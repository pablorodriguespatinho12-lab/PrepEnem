export const dynamic = 'force-dynamic';
export const maxDuration = 300;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PDFDocument } from 'pdf-lib';
import { uploadBufferToS3 } from '@/lib/s3';
import { isS3Configured, s3UnavailableResponse } from '@/lib/aws-client';
import { chatCompletion, getAbacusApiKey, aiUnavailableResponse } from '@/lib/ai-client';
import * as fs from 'fs';
import * as path from 'path';

const MATERIAS_VALIDAS = [
  'Matemática', 'Português', 'Biologia', 'Química', 'Física',
  'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês'
];

const PDF_PAIRS = [
  { prova: '2021_PV_impresso_D1_CD1.pdf', gabarito: '2021_GB_impresso_D1_CD1.pdf', ano: 2021, dia: 1 },
  { prova: '2021_PV_impresso_D2_CD5.pdf', gabarito: '2021_GB_impresso_D2_CD5.pdf', ano: 2021, dia: 2 },
  { prova: '2022_PV_impresso_D1_CD1.pdf', gabarito: '2022_GB_impresso_D1_CD1.pdf', ano: 2022, dia: 1 },
  { prova: '2022_PV_impresso_D2_CD5.pdf', gabarito: '2022_GB_impresso_D2_CD5.pdf', ano: 2022, dia: 2 },
  { prova: '2023_PV_impresso_D1_CD1.pdf', gabarito: '2023_GB_impresso_D1_CD1.pdf', ano: 2023, dia: 1 },
  { prova: '2023_PV_impresso_D2_CD5.pdf', gabarito: '2023_GB_impresso_D2_CD5.pdf', ano: 2023, dia: 2 },
  { prova: '2024_PV_impresso_D1_CD1.pdf', gabarito: '2024_GB_impresso_D1_CD1.pdf', ano: 2024, dia: 1 },
  { prova: '2024_PV_impresso_D2_CD5.pdf', gabarito: '2024_GB_impresso_D2_CD5.pdf', ano: 2024, dia: 2 },
  { prova: '2025_PV_impresso_D2_CD5.pdf', gabarito: '2025_GB_impresso_D2_CD5.pdf', ano: 2025, dia: 2 },
];

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'pdfs');

async function extractGabarito(
  gabaritoBase64: string
): Promise<{ ok: true; gabarito: Record<number, string> } | { ok: false; response: NextResponse }> {
  const result = await chatCompletion({
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Você recebeu o PDF do gabarito oficial de uma prova ENEM.\n\nExtraia TODOS os números de questão e suas respostas corretas.\n\nRegras:\n- Se a resposta for "Anulado" ou "Anulada", use "ANULADA" como valor\n- Respostas devem ser A, B, C, D, E ou ANULADA\n- Inclua TODAS as questões de TODAS as áreas\n- Para questões de língua estrangeira (Inglês/Espanhol), use a coluna Inglês\n\nRetorne APENAS JSON: {"gabarito": {"1": "C", "2": "A", ...}}' },
        { type: 'file', file: { filename: 'gabarito.pdf', file_data: `data:application/pdf;base64,${gabaritoBase64}` } },
      ],
    }],
    maxTokens: 4000,
    temperature: 0.05,
    responseFormat: { type: 'json_object' },
  });
  if (!result.ok) return result;

  const raw = result.data?.choices?.[0]?.message?.content ?? '';
  const parsed = JSON.parse(raw);
  const gab: Record<number, string> = {};
  for (const [key, val] of Object.entries(parsed?.gabarito ?? {})) {
    const num = parseInt(key);
    if (!isNaN(num)) gab[num] = String(val).toUpperCase().trim();
  }
  return { ok: true, gabarito: gab };
}

async function processChunk(chunkBase64: string, fileName: string, chunkPageCount: number): Promise<any[]> {
  const result = await chatCompletion({
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: `Você recebeu PARTE de um PDF de prova ENEM/vestibular (${chunkPageCount} páginas neste trecho).\n\nExtraia TODAS as questões objetivas (múltipla escolha A-E) presentes COMPLETAS nessas páginas. Ignore questões cortadas/incompletas.\n\nIMPORTANTE:\n- Para cada questão, identifique o NÚMERO original da questão na prova (ex: Questão 91).\n- Para cada questão, identifique em qual PÁGINA deste trecho ela COMEÇA (1 = primeira página deste trecho).\n\nPara cada questão:\n- numeroQuestao: número original da questão na prova (inteiro)\n- paginaNoTrecho: página deste trecho onde a questão começa (1 a ${chunkPageCount})\n- enunciado: texto completo (incluindo textos de apoio). Se houver referência a imagem/figura/gráfico, inclua "[IMAGEM]" no texto.\n- alternativaA-E: 5 alternativas completas\n- materia: ${MATERIAS_VALIDAS.join(', ')}\n- subtema: subtema específico\n- dificuldade: facil, medio ou dificil\n- explicacao: justificativa breve da correta\n\nRetorne APENAS JSON: {"questoes":[{...}]}` },
        { type: 'file', file: { filename: fileName, file_data: `data:application/pdf;base64,${chunkBase64}` } },
      ],
    }],
    maxTokens: 8000,
    temperature: 0.1,
    responseFormat: { type: 'json_object' },
  });
  if (!result.ok) return [];
  const raw = result.data?.choices?.[0]?.message?.content ?? '';
  try { return JSON.parse(raw)?.questoes ?? []; } catch { return []; }
}

// GET: Check status of existing imports
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    }
    const counts = await prisma.question.groupBy({
      by: ['anoProva', 'diaProva'],
      _count: true,
      where: { anoProva: { not: null } },
    });
    const total = await prisma.question.count();
    return NextResponse.json({ counts, total, pairs: PDF_PAIRS.map(p => ({ ano: p.ano, dia: p.dia, prova: p.prova })) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Process a specific pair
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    }
    if (!isS3Configured()) {
      return s3UnavailableResponse();
    }
    if (!getAbacusApiKey()) {
      return aiUnavailableResponse();
    }

    const { pairIndex } = await req.json();
    if (pairIndex === undefined || pairIndex < 0 || pairIndex >= PDF_PAIRS.length) {
      return NextResponse.json({ error: 'Invalid pair index' }, { status: 400 });
    }

    const pair = PDF_PAIRS[pairIndex];

    // Check if already imported
    const existing = await prisma.question.count({ where: { anoProva: pair.ano, diaProva: pair.dia } });
    if (existing > 20) {
      return NextResponse.json({ message: `ENEM ${pair.ano} D${pair.dia} já importado (${existing} questões)`, skipped: true });
    }

    // Read files
    const provaPath = path.join(UPLOAD_DIR, pair.prova);
    const gabPath = path.join(UPLOAD_DIR, pair.gabarito);
    if (!fs.existsSync(provaPath)) return NextResponse.json({ error: `Arquivo não encontrado: ${pair.prova}` }, { status: 404 });
    if (!fs.existsSync(gabPath)) return NextResponse.json({ error: `Arquivo não encontrado: ${pair.gabarito}` }, { status: 404 });

    const provaBuffer = fs.readFileSync(provaPath);
    const gabBuffer = fs.readFileSync(gabPath);
    const provaB64 = provaBuffer.toString('base64');
    const gabB64 = gabBuffer.toString('base64');

    console.log(`[BATCH] Starting ENEM ${pair.ano} D${pair.dia}`);

    // Step 1: Extract gabarito
    const gabResult = await extractGabarito(gabB64);
    if (!gabResult.ok) return gabResult.response;
    const gabarito = gabResult.gabarito;
    console.log(`[BATCH] Gabarito: ${Object.keys(gabarito).length} answers`);

    // Step 2: Upload PDF to S3
    let pdfFileUrl: string | null = null;
    try {
      pdfFileUrl = await uploadBufferToS3(provaBuffer, pair.prova, 'application/pdf');
      console.log(`[BATCH] PDF uploaded: ${pdfFileUrl}`);
    } catch (e: any) {
      console.error('[BATCH] Upload fail:', e.message);
    }

    // Step 3: Process chunks
    const srcPdf = await PDFDocument.load(provaBuffer);
    const totalPages = srcPdf.getPageCount();
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
      console.log(`[BATCH] Chunk pages ${start + 1}-${end}...`);
      const questoes = await processChunk(chunkB64, pair.prova, end - start);
      for (const q of questoes) {
        const relPage = parseInt(q.paginaNoTrecho);
        q._absolutePage = (!isNaN(relPage) && relPage >= 1) ? start + relPage : start + 1;
      }
      console.log(`[BATCH]   -> ${questoes.length} questions`);
      allQuestoes.push(...questoes);
    }

    // Dedupe
    const byNumber = new Map<number, any>();
    for (const q of allQuestoes) {
      const num = parseInt(q.numeroQuestao);
      if (!isNaN(num) && num > 0 && !byNumber.has(num)) byNumber.set(num, q);
    }
    const uniq = Array.from(byNumber.entries()).map(([num, q]) => ({ ...q, numeroQuestao: num }));

    // Save
    let saved = 0;
    let anuladas = 0;
    for (const q of uniq) {
      try {
        const qNum = q.numeroQuestao;
        const gabAnswer = gabarito[qNum];
        if (gabAnswer === 'ANULADA' || gabAnswer === 'ANULADO') { anuladas++; continue; }

        // Check duplicate
        const dup = await prisma.question.findFirst({ where: { anoProva: pair.ano, diaProva: pair.dia, numeroQuestao: qNum } });
        if (dup) { saved++; continue; }

        let materia = q.materia ?? 'Português';
        if (!MATERIAS_VALIDAS.includes(materia)) {
          materia = MATERIAS_VALIDAS.find(m => materia.toLowerCase().includes(m.toLowerCase())) ?? 'Português';
        }
        let dificuldade = (q.dificuldade ?? 'medio').toLowerCase();
        if (!['facil', 'medio', 'dificil'].includes(dificuldade)) dificuldade = 'medio';

        let resposta = gabAnswer ?? (q.respostaCorreta ?? 'A');
        resposta = resposta.toUpperCase().trim();
        if (!['A', 'B', 'C', 'D', 'E'].includes(resposta)) resposta = 'A';

        const enunciado = q.enunciado ?? `Questão ${qNum}`;
        const imagePatterns = /\[IMAGEM\]|imagem|figura|gráfico|tirinha|charge|quadrinho|esquema|diagrama|tabela|mapa|ilustração/i;

        await prisma.question.create({
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
            origem: `ENEM ${pair.ano} D${pair.dia} Q${qNum}`,
            dependeImagem: imagePatterns.test(enunciado),
            numeroQuestao: qNum,
            anoProva: pair.ano,
            diaProva: pair.dia,
            pdfFileUrl,
            paginaPdf: q._absolutePage ?? null,
          },
        });
        saved++;
      } catch (e: any) {
        console.error(`[BATCH] Save error Q${q.numeroQuestao}:`, e.message);
      }
    }

    console.log(`[BATCH] Done ENEM ${pair.ano} D${pair.dia}: ${saved} saved, ${anuladas} anuladas`);
    return NextResponse.json({ message: `ENEM ${pair.ano} D${pair.dia}: ${saved} questões importadas`, saved, anuladas });
  } catch (error: any) {
    console.error('[BATCH] Error:', error);
    return NextResponse.json({ error: error?.message || 'Erro no processamento' }, { status: 500 });
  }
}
