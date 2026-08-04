export const dynamic = 'force-dynamic';
export const maxDuration = 300;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PDFDocument } from 'pdf-lib';
import { uploadBufferToS3 } from '@/lib/s3';
import { isS3Configured, s3UnavailableResponse } from '@/lib/aws-client';

const MATERIAS_VALIDAS = [
  'Matemática', 'Português', 'Biologia', 'Química', 'Física',
  'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês'
];

// Extract answer key from gabarito PDF using LLM
async function extractGabarito(gabaritoBase64: string, apiKey: string): Promise<Record<number, string>> {
  const prompt = `Você recebeu o PDF do gabarito oficial de uma prova ENEM.

Extraia TODOS os números de questão e suas respostas corretas.

Regras:
- Se a resposta for "Anulado" ou "Anulada", use "ANULADA" como valor
- Respostas devem ser A, B, C, D, E ou ANULADA
- Inclua TODAS as questões de TODAS as áreas (Linguagens, Humanas, Natureza, Matemática)
- Para questões de língua estrangeira (Inglês/Espanhol), use a coluna Inglês

Retorne APENAS JSON: {"gabarito": {"1": "C", "2": "A", ...}}`;

  const res = await fetch('https://apps.abacus.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-5.4-mini',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'file', file: { filename: 'gabarito.pdf', file_data: `data:application/pdf;base64,${gabaritoBase64}` } },
        ],
      }],
      max_tokens: 4000,
      temperature: 0.05,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error('Gabarito extraction error:', res.status, txt.substring(0, 300));
    throw new Error('Erro ao extrair gabarito');
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? '';
  try {
    const parsed = JSON.parse(raw);
    const gab: Record<number, string> = {};
    for (const [key, val] of Object.entries(parsed?.gabarito ?? {})) {
      const num = parseInt(key);
      if (!isNaN(num)) {
        gab[num] = String(val).toUpperCase().trim();
      }
    }
    return gab;
  } catch (e) {
    console.error('Gabarito parse fail:', e);
    throw new Error('Erro ao interpretar gabarito');
  }
}

// Process a chunk of the exam PDF to extract questions
async function processChunk(chunkBase64: string, fileName: string, apiKey: string, chunkPageCount: number): Promise<any[]> {
  const prompt = `Você recebeu PARTE de um PDF de prova ENEM/vestibular (${chunkPageCount} páginas neste trecho).

Extraia TODAS as questões objetivas (múltipla escolha A-E) presentes COMPLETAS nessas páginas. Ignore questões cortadas/incompletas.

IMPORTANTE:
- Para cada questão, identifique o NÚMERO original da questão na prova (ex: Questão 91, Questão 136, etc).
- Para cada questão, identifique em qual PÁGINA deste trecho ela COMEÇA (1 = primeira página deste trecho, 2 = segunda, etc).

Para cada questão:
- numeroQuestao: número original da questão na prova (inteiro)
- paginaNoTrecho: página deste trecho onde a questão começa (1 a ${chunkPageCount})
- enunciado: texto completo (incluindo textos de apoio, poemas, trechos). Se houver referência a imagem/figura/gráfico, inclua "[IMAGEM]" no texto para indicar.
- alternativaA-E: 5 alternativas completas
- materia: ${MATERIAS_VALIDAS.join(', ')}
- subtema: subtema específico
- dificuldade: facil, medio ou dificil
- explicacao: justificativa breve da correta (pode ser genérica se não souber a resposta)

Retorne APENAS JSON: {"questoes":[{...}]}`;

  const res = await fetch('https://apps.abacus.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-5.4-mini',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'file', file: { filename: fileName, file_data: `data:application/pdf;base64,${chunkBase64}` } },
        ],
      }],
      max_tokens: 8000,
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error(`Chunk error: ${res.status}`, txt.substring(0, 200));
    return [];
  }
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? '';
  try {
    const parsed = JSON.parse(raw);
    return parsed?.questoes ?? [];
  } catch (e) {
    console.error('Parse fail');
    return [];
  }
}

// Parse year and day from filename like "2024_PV_impresso_D2_CD5.pdf"
function parseProvaInfo(fileName: string): { ano: number | null; dia: number | null } {
  const yearMatch = fileName.match(/(20\d{2})/);
  const dayMatch = fileName.match(/D(\d)/i);
  return {
    ano: yearMatch ? parseInt(yearMatch[1]) : null,
    dia: dayMatch ? parseInt(dayMatch[1]) : null,
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    if (!isS3Configured()) {
      return s3UnavailableResponse();
    }

    const { pdfBase64, gabaritoBase64, fileName, gabaritoFileName } = await req.json();
    if (!pdfBase64) {
      return NextResponse.json({ error: 'PDF da prova não fornecido' }, { status: 400 });
    }
    if (!gabaritoBase64) {
      return NextResponse.json({ error: 'PDF do gabarito não fornecido' }, { status: 400 });
    }

    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });
    }

    const { ano, dia } = parseProvaInfo(fileName ?? '');
    console.log(`Processing prova: ${fileName} (ano=${ano}, dia=${dia})`);

    // Step 1: Extract gabarito
    console.log('Extracting gabarito...');
    const gabarito = await extractGabarito(gabaritoBase64, apiKey);
    const gabaritoCount = Object.keys(gabarito).length;
    console.log(`Gabarito extracted: ${gabaritoCount} answers`);

    if (gabaritoCount === 0) {
      return NextResponse.json({ error: 'Não foi possível extrair respostas do gabarito' }, { status: 422 });
    }

    // Step 2: Upload original PDF to cloud storage
    const pdfBytes = Buffer.from(pdfBase64, 'base64');
    let pdfFileUrl: string | null = null;
    try {
      pdfFileUrl = await uploadBufferToS3(pdfBytes, fileName ?? 'prova.pdf', 'application/pdf');
      console.log(`PDF uploaded to: ${pdfFileUrl}`);
    } catch (e: any) {
      console.error('PDF upload failed (continuing without):', e.message);
    }

    // Step 3: Process prova PDF in chunks
    const srcPdf = await PDFDocument.load(pdfBytes);
    const totalPages = srcPdf.getPageCount();
    console.log(`Prova PDF has ${totalPages} pages`);

    const PAGES_PER_CHUNK = 6;
    const allQuestoes: any[] = [];

    for (let start = 0; start < totalPages; start += PAGES_PER_CHUNK) {
      const end = Math.min(start + PAGES_PER_CHUNK, totalPages);
      const chunkPdf = await PDFDocument.create();
      const indices = Array.from({ length: end - start }, (_, i) => start + i);
      const copied = await chunkPdf.copyPages(srcPdf, indices);
      copied.forEach(p => chunkPdf.addPage(p));
      const chunkBytes = await chunkPdf.save();
      const chunkB64 = Buffer.from(chunkBytes).toString('base64');
      const chunkPageCount = end - start;
      console.log(`Processing chunk pages ${start + 1}-${end}...`);
      const questoes = await processChunk(chunkB64, fileName ?? 'prova.pdf', apiKey, chunkPageCount);
      // Add absolute page number to each question
      for (const q of questoes) {
        const relPage = parseInt(q.paginaNoTrecho);
        q._absolutePage = (!isNaN(relPage) && relPage >= 1) ? start + relPage : start + 1;
      }
      console.log(`  -> ${questoes.length} questions found`);
      allQuestoes.push(...questoes);
    }

    // Dedupe by question number (prefer the one with a valid number)
    const byNumber = new Map<number, any>();
    const noNumber: any[] = [];
    for (const q of allQuestoes) {
      const num = parseInt(q.numeroQuestao);
      if (!isNaN(num) && num > 0) {
        if (!byNumber.has(num)) byNumber.set(num, q);
      } else {
        noNumber.push(q);
      }
    }

    // Also dedupe no-number questions by first 100 chars
    const seen = new Set<string>();
    const uniqNoNum = noNumber.filter(q => {
      const key = (q.enunciado ?? '').substring(0, 100);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Combine: numbered questions + unnumbered
    const uniq = [...Array.from(byNumber.entries()).map(([num, q]) => ({ ...q, numeroQuestao: num })), ...uniqNoNum];

    if (uniq.length === 0) {
      return NextResponse.json({ error: 'Nenhuma questão encontrada no PDF' }, { status: 422 });
    }

    // Step 3: Cross-reference with gabarito and save
    const saved: any[] = [];
    const errors: string[] = [];
    let anuladas = 0;

    for (let i = 0; i < uniq.length; i++) {
      const q = uniq[i];
      try {
        const qNum = parseInt(q.numeroQuestao);
        const gabAnswer = !isNaN(qNum) ? gabarito[qNum] : undefined;

        // Skip annulled questions
        if (gabAnswer === 'ANULADA' || gabAnswer === 'ANULADO') {
          anuladas++;
          continue;
        }

        let materia = q.materia ?? 'Português';
        if (!MATERIAS_VALIDAS.includes(materia)) {
          const found = MATERIAS_VALIDAS.find((m) => materia.toLowerCase().includes(m.toLowerCase()));
          materia = found ?? 'Português';
        }
        let dificuldade = (q.dificuldade ?? 'medio').toLowerCase();
        if (!['facil', 'medio', 'dificil'].includes(dificuldade)) dificuldade = 'medio';

        // Use gabarito answer if available, otherwise LLM's guess
        let resposta = gabAnswer ?? (q.respostaCorreta ?? 'A');
        resposta = resposta.toUpperCase().trim();
        if (!['A', 'B', 'C', 'D', 'E'].includes(resposta)) resposta = 'A';

        // Check for image references in enunciado
        const enunciado = q.enunciado ?? `Questão ${i + 1}`;
        const imagePatterns = /\[IMAGEM\]|imagem|figura|gráfico|tirinha|charge|quadrinho|esquema|diagrama|tabela|mapa|ilustração/i;
        const dependeImagem = imagePatterns.test(enunciado);

        // Build origin string
        const origemParts: string[] = [];
        if (ano) origemParts.push(`ENEM ${ano}`);
        if (dia) origemParts.push(`D${dia}`);
        if (!isNaN(qNum)) origemParts.push(`Q${qNum}`);
        const origem = origemParts.length > 0 ? origemParts.join(' ') : (fileName ?? 'PDF importado');

        // Check for existing question with same year/day/number to avoid duplicates
        if (ano && dia && !isNaN(qNum)) {
          const existing = await prisma.question.findFirst({
            where: { anoProva: ano, diaProva: dia, numeroQuestao: qNum },
          });
          if (existing) {
            // Update answer if gabarito available
            if (gabAnswer) {
              await prisma.question.update({
                where: { id: existing.id },
                data: { respostaCorreta: resposta },
              });
            }
            saved.push(existing);
            continue;
          }
        }

        const absolutePage = q._absolutePage ?? null;

        const created = await prisma.question.create({
          data: {
            enunciado,
            alternativaA: q.alternativaA ?? 'N/A',
            alternativaB: q.alternativaB ?? 'N/A',
            alternativaC: q.alternativaC ?? 'N/A',
            alternativaD: q.alternativaD ?? 'N/A',
            alternativaE: q.alternativaE ?? 'N/A',
            respostaCorreta: resposta,
            materia,
            subtema: q.subtema ?? 'Geral',
            dificuldade,
            explicacao: q.explicacao ?? null,
            origem,
            dependeImagem,
            numeroQuestao: !isNaN(qNum) ? qNum : null,
            anoProva: ano,
            diaProva: dia,
            pdfFileUrl: pdfFileUrl,
            paginaPdf: absolutePage,
          },
        });
        saved.push(created);
      } catch (e: any) {
        errors.push(`Questão ${i + 1}: ${e.message}`);
      }
    }

    return NextResponse.json({
      message: `${saved.length} questões importadas com sucesso!`,
      total: saved.length,
      gabaritoUsado: true,
      gabaritoTotal: gabaritoCount,
      anuladas,
      erros: errors.length > 0 ? errors : undefined,
      questoes: saved.map((q) => ({
        id: q.id,
        materia: q.materia,
        subtema: q.subtema,
        dificuldade: q.dificuldade,
      })),
    });
  } catch (error: any) {
    console.error('PDF process error:', error);
    return NextResponse.json({ error: error?.message || 'Erro interno ao processar PDF' }, { status: 500 });
  }
}
