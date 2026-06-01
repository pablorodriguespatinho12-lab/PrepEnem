// Seeds questions from a local PDF by splitting into chunks and processing each via LLM
// Usage: cd nextjs_space && npx tsx scripts/seed-pdf.ts /path/to/file.pdf
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MATERIAS_VALIDAS = [
  'Matemática', 'Português', 'Biologia', 'Química', 'Física',
  'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês'
];

function getPageCount(pdfPath: string): number {
  const out = execSync(`pdfinfo "${pdfPath}"`, { encoding: 'utf-8' });
  const m = out.match(/Pages:\s+(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function splitChunk(pdfPath: string, startPage: number, endPage: number, outDir: string): string {
  // Use pdfseparate to extract pages, pdfunite to merge
  const pages: string[] = [];
  for (let i = startPage; i <= endPage; i++) {
    const p = path.join(outDir, `page-${i}.pdf`);
    execSync(`pdfseparate -f ${i} -l ${i} "${pdfPath}" "${p}"`);
    pages.push(p);
  }
  const merged = path.join(outDir, `chunk-${startPage}-${endPage}.pdf`);
  execSync(`pdfunite ${pages.map(p => `"${p}"`).join(' ')} "${merged}"`);
  for (const p of pages) fs.unlinkSync(p);
  return merged;
}

async function processChunk(chunkPath: string, fileName: string, apiKey: string): Promise<any[]> {
  const buf = fs.readFileSync(chunkPath);
  const base64 = buf.toString('base64');
  const prompt = `Você recebeu PARTE de um PDF de prova ENEM/vestibular.

Extraia TODAS as questões objetivas (múltipla escolha A-E) presentes COMPLETAS nestas páginas. Ignore questões cortadas/incompletas.

Para cada questão:
- enunciado: texto completo (incluindo textos de apoio)
- alternativaA-E: 5 alternativas
- respostaCorreta: A-E (use "A" se desconhecida)
- materia: ${MATERIAS_VALIDAS.join(', ')}
- subtema: subtema específico
- dificuldade: facil, medio ou dificil
- explicacao: justificativa breve da correta

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
          { type: 'file', file: { filename: fileName, file_data: `data:application/pdf;base64,${base64}` } },
        ],
      }],
      max_tokens: 8000,
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error(`Chunk error: ${res.status} ${txt.substring(0, 200)}`);
    return [];
  }
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? '';
  try {
    const parsed = JSON.parse(raw);
    return parsed?.questoes ?? [];
  } catch (e) {
    console.error('Parse fail, preview:', raw.substring(0, 200));
    return [];
  }
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) { console.error('Usage: tsx seed-pdf.ts <pdf>'); process.exit(1); }
  const apiKey = process.env.ABACUSAI_API_KEY;
  if (!apiKey) { console.error('ABACUSAI_API_KEY not set'); process.exit(1); }

  const fileName = path.basename(filePath);
  const totalPages = getPageCount(filePath);
  console.log(`PDF: ${fileName}, ${totalPages} pages`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfseed-'));
  const PAGES_PER_CHUNK = 6;
  const allQuestoes: any[] = [];

  for (let start = 1; start <= totalPages; start += PAGES_PER_CHUNK) {
    const end = Math.min(start + PAGES_PER_CHUNK - 1, totalPages);
    console.log(`Processing pages ${start}-${end}...`);
    const chunkPath = splitChunk(filePath, start, end, tmpDir);
    const questoes = await processChunk(chunkPath, fileName, apiKey);
    console.log(`  -> ${questoes.length} questions extracted`);
    allQuestoes.push(...questoes);
    fs.unlinkSync(chunkPath);
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log(`\nTotal extracted: ${allQuestoes.length}`);

  // Dedupe by enunciado (first 100 chars)
  const seen = new Set<string>();
  const uniq = allQuestoes.filter(q => {
    const key = (q.enunciado ?? '').substring(0, 100);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`After dedupe: ${uniq.length}`);

  let saved = 0;
  for (let i = 0; i < uniq.length; i++) {
    const q = uniq[i];
    try {
      let materia = q.materia ?? 'Português';
      if (!MATERIAS_VALIDAS.includes(materia)) {
        const f = MATERIAS_VALIDAS.find(m => materia.toLowerCase().includes(m.toLowerCase()));
        materia = f ?? 'Português';
      }
      let dif = (q.dificuldade ?? 'medio').toLowerCase();
      if (!['facil','medio','dificil'].includes(dif)) dif = 'medio';
      let resp = (q.respostaCorreta ?? 'A').toUpperCase();
      if (!['A','B','C','D','E'].includes(resp)) resp = 'A';

      await prisma.question.create({
        data: {
          enunciado: q.enunciado ?? `Questão ${i+1}`,
          alternativaA: q.alternativaA ?? 'N/A',
          alternativaB: q.alternativaB ?? 'N/A',
          alternativaC: q.alternativaC ?? 'N/A',
          alternativaD: q.alternativaD ?? 'N/A',
          alternativaE: q.alternativaE ?? 'N/A',
          respostaCorreta: resp,
          materia,
          subtema: q.subtema ?? 'Geral',
          dificuldade: dif,
          explicacao: q.explicacao ?? null,
          origem: fileName,
        },
      });
      saved++;
    } catch (e: any) {
      console.error(`Save Q${i+1}: ${e.message}`);
    }
  }
  console.log(`\nSaved ${saved}/${uniq.length} to DB`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
