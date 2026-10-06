// Aplica scripts/data/correcao-texto-base-enem.ts no banco (Neon = produção).
//
// Uso:
//   npx tsx --env-file=.env scripts/corrigir-texto-base.ts            mostra o que mudaria
//   npx tsx --env-file=.env scripts/corrigir-texto-base.ts --gravar   grava
//
// Seguro de repetir: só toca a questão cujo enunciado ainda começa como o
// antigo; depois de corrigida, ela é pulada. Antes de gravar, salva os valores
// antigos em backups/correcao-texto-base-<data>.json.

import { mkdirSync, writeFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { CORRECOES } from './data/correcao-texto-base-enem';

const GRAVAR = process.argv.includes('--gravar');
const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const;

async function main() {
  const prisma = new PrismaClient();
  const atuais = await prisma.question.findMany({ where: { id: { in: CORRECOES.map((c) => c.id) } } });
  const porId = new Map(atuais.map((q) => [q.id, q]));

  const aplicar = CORRECOES.filter((c) => {
    const q = porId.get(c.id);
    if (!q) { console.log(`FALTA no banco: ${c.rotulo} (${c.id})`); return false; }
    // Vários originais começam com as mesmas palavras do enunciado cortado,
    // então "já corrigida" é o texto inteiro igual, não o começo diferente.
    if (q.enunciado === c.enunciado) { console.log(`já corrigida: ${c.rotulo}`); return false; }
    if (!q.enunciado.startsWith(c.enunciadoAtualComeca)) { console.log(`pula (mudou desde a transcrição): ${c.rotulo}`); return false; }
    return true;
  });

  for (const c of aplicar) {
    const q = porId.get(c.id)!;
    const alts = LETRAS.filter((l) => c.alternativas?.[l]).map((l) => `${l}: "${q[`alternativa${l}`]}" → "${c.alternativas![l]}"`);
    console.log(`\n${c.rotulo}: enunciado ${q.enunciado.length} → ${c.enunciado.length} caracteres`);
    alts.forEach((a) => console.log(`  ${a}`));
    if (c.materia) console.log(`  matéria: ${q.materia} → ${c.materia}; tema: ${q.tema} → ${c.tema}`);
  }
  console.log(`\n${aplicar.length} de ${CORRECOES.length} questões a corrigir.`);

  if (!GRAVAR || aplicar.length === 0) {
    if (!GRAVAR) console.log('Nada gravado. Rode com --gravar para aplicar.');
    await prisma.$disconnect();
    return;
  }

  mkdirSync('backups', { recursive: true });
  const arquivo = `backups/correcao-texto-base-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(arquivo, JSON.stringify(aplicar.map((c) => porId.get(c.id)), null, 2));
  console.log(`Backup: ${arquivo}`);

  await prisma.$transaction(
    aplicar.map((c) =>
      prisma.question.update({
        where: { id: c.id },
        data: {
          enunciado: c.enunciado,
          ...Object.fromEntries(LETRAS.filter((l) => c.alternativas?.[l]).map((l) => [`alternativa${l}`, c.alternativas![l]])),
          ...(c.materia ? { materia: c.materia, subtema: c.subtema, tema: c.tema } : {}),
        },
      }),
    ),
  );
  console.log(`Gravadas ${aplicar.length} questões.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
