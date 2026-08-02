// Pré-renderiza páginas de PDF do INEP como imagens WebP estáticas em public/questoes-imagens/,
// pra questões com dependeImagem=true. Elimina o problema de origem da Etapa A: o pdf.js faz
// range requests em paralelo no cliente, o pdf-proxy baixa os 6.7MB inteiros a cada uma delas,
// e a concorrência estoura tempo/memória da function (502 intermitente). Pré-renderizando uma
// vez aqui, cada questão passa a carregar uma imagem de ~100-250KB via CDN, sem tocar no proxy.
//
// Uso:
//   npx tsx scripts/generate-question-images.ts            # todas as questões elegíveis
//   npx tsx scripts/generate-question-images.ts --limit=3   # só as N primeiras (validação de amostra)
import { PrismaClient } from '@prisma/client';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { downloadInepPdf, isAllowedInepUrl } from '../lib/inep-pdf-fetch';

const prisma = new PrismaClient();

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'questoes-imagens');
const SMALL_WIDTH = 800;
const LARGE_WIDTH = 1100; // validado visualmente: mantém legibilidade de tabela densa, ~22% menor que 1400px
const WEBP_QUALITY = 85;
const RENDER_SCALE = 2.0; // ~146dpi numa página A4, texto pequeno legível mesmo no variant de 800px
const DOWNLOAD_MAX_ATTEMPTS = 3;

interface QuestionToRender {
  id: string;
  pdfFileUrl: string;
  paginaPdf: number;
}

function parseLimitArg(): number | undefined {
  const arg = process.argv.find(a => a.startsWith('--limit='));
  if (!arg) return undefined;
  const value = Number(arg.split('=')[1]);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

async function downloadWithRetry(url: URL): Promise<Buffer> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= DOWNLOAD_MAX_ATTEMPTS; attempt++) {
    try {
      return await downloadInepPdf(url);
    } catch (error) {
      lastError = error;
      console.warn(`  tentativa ${attempt}/${DOWNLOAD_MAX_ATTEMPTS} falhou: ${(error as Error).message}`);
    }
  }
  throw lastError;
}

async function renderPageToWebp(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  width: number
): Promise<Buffer> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: RENDER_SCALE });
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');
  // canvas precisa ser explicitamente null quando renderizando via canvasContext (napi-rs/canvas
  // não é um HTMLCanvasElement de verdade, mas implementa a mesma API de contexto 2D).
  await page.render({ canvas: null, canvasContext: context as unknown as CanvasRenderingContext2D, viewport }).promise;
  const pngBuffer = canvas.toBuffer('image/png');
  return sharp(pngBuffer).resize({ width }).webp({ quality: WEBP_QUALITY }).toBuffer();
}

async function main(): Promise<void> {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const limit = parseLimitArg();
  const questions = await prisma.question.findMany({
    where: { dependeImagem: true, pdfFileUrl: { not: null }, paginaPdf: { not: null } },
    select: { id: true, pdfFileUrl: true, paginaPdf: true },
    orderBy: { id: 'asc' },
    ...(limit ? { take: limit } : {}),
  });

  const toRender: QuestionToRender[] = questions
    .filter((q): q is QuestionToRender => q.pdfFileUrl !== null && q.paginaPdf !== null);

  console.log(`${toRender.length} questões elegíveis (dependeImagem=true + pdfFileUrl + paginaPdf).\n`);

  const byPdf = new Map<string, QuestionToRender[]>();
  for (const q of toRender) {
    const group = byPdf.get(q.pdfFileUrl) ?? [];
    group.push(q);
    byPdf.set(q.pdfFileUrl, group);
  }

  let done = 0;
  const failed: { id: string; error: string }[] = [];

  for (const [pdfFileUrl, group] of byPdf) {
    const url = new URL(pdfFileUrl);
    if (!isAllowedInepUrl(url)) {
      console.warn(`Pulando ${pdfFileUrl}: host não permitido.`);
      failed.push(...group.map(q => ({ id: q.id, error: 'host não permitido' })));
      continue;
    }

    console.log(`Baixando ${pdfFileUrl} (${group.length} questões)...`);
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await downloadWithRetry(url);
    } catch (error) {
      console.error(`  falha ao baixar após ${DOWNLOAD_MAX_ATTEMPTS} tentativas: ${(error as Error).message}`);
      failed.push(...group.map(q => ({ id: q.id, error: 'download falhou' })));
      continue;
    }

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
    const pdf = await loadingTask.promise;

    for (const question of group) {
      try {
        const [smallBuffer, largeBuffer] = await Promise.all([
          renderPageToWebp(pdf, question.paginaPdf, SMALL_WIDTH),
          renderPageToWebp(pdf, question.paginaPdf, LARGE_WIDTH),
        ]);

        const smallPath = `/questoes-imagens/${question.id}.webp`;
        const largePath = `/questoes-imagens/${question.id}-expandida.webp`;
        fs.writeFileSync(path.join(process.cwd(), 'public', smallPath), smallBuffer);
        fs.writeFileSync(path.join(process.cwd(), 'public', largePath), largeBuffer);

        await prisma.question.update({
          where: { id: question.id },
          data: { imagemUrl: smallPath, imagemUrlExpandida: largePath },
        });

        done += 1;
        console.log(`  [${done}/${toRender.length}] ${question.id} (página ${question.paginaPdf}) ok`);
      } catch (error) {
        console.error(`  ${question.id} falhou: ${(error as Error).message}`);
        failed.push({ id: question.id, error: (error as Error).message });
      }
    }

    await loadingTask.destroy();
  }

  console.log(`\nConcluído: ${done}/${toRender.length} imagens geradas.`);
  if (failed.length > 0) {
    console.log(`Falhas (${failed.length}):`);
    for (const f of failed) console.log(`  ${f.id}: ${f.error}`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
