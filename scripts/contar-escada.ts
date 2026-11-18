import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';
import { ESCADAS } from '../data/escadas';
import { ETAPAS, POR_ETAPA, etapaDaProva } from '../lib/prova-da-escada';

// Quantas questões faltam em cada degrau de cada escada, por etapa (só lê).
// Uso: DB_CONFIRMED=1 npx tsx scripts/contar-escada.ts [Matéria]

const prisma = new PrismaClient();

async function main() {
  const [so] = process.argv.slice(2);
  const escadas = ESCADAS.filter((e) => !so || e.materia === so);
  const todas = await prisma.question.findMany({
    where: { materia: { in: escadas.map((e) => e.materia) }, tema: { not: null }, ancoraId: null },
    select: { id: true, materia: true, tema: true, nivel: true, anoProva: true, origem: true },
  });
  let total = 0;
  for (const { materia, degraus } of escadas) {
    for (const { tema } of degraus) {
      const doTema = todas.filter((q) => q.materia === materia && q.tema === tema);
      const faltas = ETAPAS.map((etapa) => [etapa, POR_ETAPA[etapa] - doTema.filter((q) => etapaDaProva(q) === etapa).length] as const)
        .filter(([, n]) => n > 0);
      total += faltas.reduce((s, [, n]) => s + n, 0);
      if (faltas.length) console.log(`${materia} · ${tema}: ${faltas.map(([e, n]) => `${e} ${n}`).join(', ')}`);
    }
  }
  console.log(`Total que falta: ${total}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
