const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const API_KEY = process.env.ABACUSAI_API_KEY;

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

const DATA_DIR = path.join(__dirname, '..', 'data', 'pdfs');

async function callLLM(messages, maxTokens = 4000, responseFormat = undefined) {
  const body = {
    model: 'gpt-5.4-mini',
    messages,
    max_tokens: maxTokens,
    temperature: 0.1,
  };
  if (responseFormat) body.response_format = responseFormat;

  const res = await fetch('https://apps.abacus.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`LLM error ${res.status}: ${txt.substring(0, 200)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

async function extractGabarito(gabB64) {
  const raw = await callLLM([{
    role: 'user',
    content: [
      { type: 'text', text: 'Você recebeu o PDF do gabarito oficial de uma prova ENEM.\n\nExtraia TODOS os números de questão e suas respostas corretas.\nSe "Anulado/Anulada", use "ANULADA".\nRespostas: A, B, C, D, E ou ANULADA.\nPara língua estrangeira, use Inglês.\n\nRetorne APENAS JSON: {"gabarito": {"1": "C", "2": "A", ...}}' },
      { type: 'file', file: { filename: 'gabarito.pdf', file_data: `data:application/pdf;base64,${gabB64}` } },
    ],
  }], 4000, { type: 'json_object' });

  const parsed = JSON.parse(raw);
  const gab = {};
  for (const [key, val] of Object.entries(parsed?.gabarito ?? {})) {
    const num = parseInt(key);
    if (!isNaN(num)) gab[num] = String(val).toUpperCase().trim();
  }
  return gab;
}

async function processChunk(chunkB64, fileName, pageCount) {
  const raw = await callLLM([{
    role: 'user',
    content: [
      { type: 'text', text: `Você recebeu PARTE de um PDF de prova ENEM (${pageCount} páginas).\n\nExtraia TODAS as questões objetivas (A-E) COMPLETAS. Ignore incompletas.\n\nPara cada:\n- numeroQuestao: número original\n- paginaNoTrecho: página neste trecho (1 a ${pageCount})\n- enunciado: texto completo. Se houver imagem/figura/gráfico, inclua "[IMAGEM]"\n- alternativaA-E: 5 alternativas\n- materia: ${MATERIAS_VALIDAS.join(', ')}\n- subtema: subtema específico\n- dificuldade: facil, medio ou dificil\n- explicacao: justificativa breve\n\nRetorne APENAS JSON: {"questoes":[{...}]}` },
      { type: 'file', file: { filename: fileName, file_data: `data:application/pdf;base64,${chunkB64}` } },
    ],
  }], 8000, { type: 'json_object' });

  try { return JSON.parse(raw)?.questoes ?? []; }
  catch { return []; }
}

async function uploadToS3(buffer, fileName) {
  try {
    const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
    const s3 = new S3Client({});
    const bucket = process.env.AWS_BUCKET_NAME;
    const folderPrefix = process.env.AWS_FOLDER_PREFIX || '';
    const key = `${folderPrefix}pdfs/${Date.now()}_${fileName}`;
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: 'application/pdf',
    }));
    const region = process.env.AWS_REGION || 'us-west-2';
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  } catch (e) {
    console.error('S3 upload failed:', e.message);
    return null;
  }
}

async function processPair(pair) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`PROCESSING: ENEM ${pair.ano} D${pair.dia}`);
  console.log(`${'='.repeat(60)}`);

  // Check if already imported
  const existing = await prisma.question.count({ where: { anoProva: pair.ano, diaProva: pair.dia } });
  if (existing > 20) {
    console.log(`SKIP: Already has ${existing} questions`);
    return { saved: existing, skipped: true };
  }

  const provaPath = path.join(DATA_DIR, pair.prova);
  const gabPath = path.join(DATA_DIR, pair.gabarito);
  const provaBuffer = fs.readFileSync(provaPath);
  const gabBuffer = fs.readFileSync(gabPath);

  // 1. Extract gabarito
  console.log('Extracting gabarito...');
  const gabarito = await extractGabarito(gabBuffer.toString('base64'));
  console.log(`Gabarito: ${Object.keys(gabarito).length} answers`);

  // 2. Upload PDF to S3
  console.log('Uploading PDF to S3...');
  const pdfFileUrl = await uploadToS3(provaBuffer, pair.prova);
  console.log(`PDF URL: ${pdfFileUrl ? 'OK' : 'FAILED'}`);

  // 3. Process chunks using pdf-lib
  const { PDFDocument } = require('pdf-lib');
  const srcPdf = await PDFDocument.load(provaBuffer);
  const totalPages = srcPdf.getPageCount();
  console.log(`Total pages: ${totalPages}`);

  const PAGES_PER_CHUNK = 3; // Smaller chunks to avoid LLM timeout
  const allQuestoes = [];

  for (let start = 0; start < totalPages; start += PAGES_PER_CHUNK) {
    const end = Math.min(start + PAGES_PER_CHUNK, totalPages);
    const chunkPdf = await PDFDocument.create();
    const indices = Array.from({ length: end - start }, (_, i) => start + i);
    const copied = await chunkPdf.copyPages(srcPdf, indices);
    copied.forEach(p => chunkPdf.addPage(p));
    const chunkBytes = await chunkPdf.save();
    const chunkB64 = Buffer.from(chunkBytes).toString('base64');

    console.log(`  Chunk pages ${start + 1}-${end}...`);
    let questoes = [];
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        questoes = await processChunk(chunkB64, pair.prova, end - start);
        break;
      } catch (e) {
        console.log(`    Retry ${attempt + 1}/3: ${e.message.substring(0, 80)}`);
        await new Promise(r => setTimeout(r, 5000));
      }
    }
    for (const q of questoes) {
      const relPage = parseInt(q.paginaNoTrecho);
      q._absolutePage = (!isNaN(relPage) && relPage >= 1) ? start + relPage : start + 1;
    }
    console.log(`    -> ${questoes.length} questions`);
    allQuestoes.push(...questoes);
  }

  // Dedupe by number
  const byNumber = new Map();
  for (const q of allQuestoes) {
    const num = parseInt(q.numeroQuestao);
    if (!isNaN(num) && num > 0 && !byNumber.has(num)) byNumber.set(num, q);
  }
  const uniq = Array.from(byNumber.entries()).map(([num, q]) => ({ ...q, numeroQuestao: num }));
  console.log(`Unique questions: ${uniq.length}`);

  // Save
  let saved = 0, anuladas = 0;
  const imagePatterns = /\[IMAGEM\]|imagem|figura|gráfico|tirinha|charge|quadrinho|esquema|diagrama|tabela|mapa|ilustração/i;

  for (const q of uniq) {
    try {
      const qNum = q.numeroQuestao;
      const gabAnswer = gabarito[qNum];
      if (gabAnswer === 'ANULADA' || gabAnswer === 'ANULADO') { anuladas++; continue; }

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
    } catch (e) {
      console.error(`  Error Q${q.numeroQuestao}: ${e.message}`);
    }
  }

  console.log(`DONE: ${saved} saved, ${anuladas} anuladas`);
  return { saved, anuladas };
}

async function main() {
  const startIdx = parseInt(process.argv[2] ?? '0');
  const endIdx = parseInt(process.argv[3] ?? String(PDF_PAIRS.length));

  console.log(`Batch import: pairs ${startIdx} to ${endIdx - 1}`);
  const results = [];

  for (let i = startIdx; i < endIdx && i < PDF_PAIRS.length; i++) {
    try {
      const result = await processPair(PDF_PAIRS[i]);
      results.push({ pair: `ENEM ${PDF_PAIRS[i].ano} D${PDF_PAIRS[i].dia}`, ...result });
    } catch (e) {
      console.error(`PAIR ${i} FAILED:`, e.message);
      results.push({ pair: `ENEM ${PDF_PAIRS[i].ano} D${PDF_PAIRS[i].dia}`, error: e.message });
    }
  }

  console.log('\n\n=== SUMMARY ===');
  for (const r of results) console.log(JSON.stringify(r));

  const total = await prisma.question.count();
  console.log(`\nTotal questions in DB: ${total}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
