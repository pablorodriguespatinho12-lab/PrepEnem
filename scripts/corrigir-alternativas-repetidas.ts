// Tira do fim do enunciado as 5 alternativas que vieram coladas do PDF
// (12 questões reais de 2022 e 2023, achado do Pablo em 03/11/2026: na prova
// as alternativas apareciam no texto e de novo nos botões).
// Guarda o texto antigo em backups/ antes de gravar. Só mexe na questão cujo
// enunciado ainda é o antigo (rodar duas vezes não faz nada).
// Uso: npx tsx scripts/corrigir-alternativas-repetidas.ts [--gravar]
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { mkdirSync, writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { cortarAlternativasRepetidas } from '../lib/enunciado-sem-alternativas';

const prisma = new PrismaClient();

async function main() {
  const gravar = process.argv.includes('--gravar');
  const qs = await prisma.question.findMany({
    select: { id: true, origem: true, enunciado: true, alternativaA: true, alternativaB: true, alternativaC: true, alternativaD: true, alternativaE: true },
  });
  const mudar = qs
    .map((q) => ({ id: q.id, origem: q.origem, antes: q.enunciado, depois: cortarAlternativasRepetidas(q.enunciado, [q.alternativaA, q.alternativaB, q.alternativaC, q.alternativaD, q.alternativaE]) }))
    .filter((x) => x.depois !== x.antes);
  console.log(`${mudar.length} questões com as alternativas repetidas no enunciado`);
  if (!gravar || mudar.length === 0) return;

  mkdirSync('backups', { recursive: true });
  const arquivo = `backups/enunciados-antes-de-cortar-alternativas-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(arquivo, JSON.stringify(mudar, null, 1));
  for (const x of mudar) {
    const r = await prisma.question.updateMany({ where: { id: x.id, enunciado: x.antes }, data: { enunciado: x.depois } });
    console.log(r.count ? 'corrigida' : 'mudou antes, pulada', x.origem);
  }
  console.log(`cópia do texto antigo: ${arquivo}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
