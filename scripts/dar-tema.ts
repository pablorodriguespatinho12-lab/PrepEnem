import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';
import { MATERIAS_DO_DIA } from '../data/escadas';
import { temaPeloSubtema } from '../lib/tema-pelo-subtema';

// Dá tema (da escada) às questões das 5 matérias do dia que só têm subtema.
// Só mexe em questão com tema vazio. Sem --gravar só mostra. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/dar-tema.ts [--gravar]

const prisma = new PrismaClient();

async function main() {
  const gravar = process.argv.includes('--gravar');
  const semTema = await prisma.question.findMany({
    where: { tema: null, materia: { in: [...MATERIAS_DO_DIA] } },
    select: { id: true, materia: true, subtema: true },
  });
  const contagem = new Map<string, number>();
  const sobrou: string[] = [];
  const porTema = new Map<string, string[]>();
  for (const q of semTema) {
    const tema = temaPeloSubtema(q.materia, q.subtema);
    if (!tema) { sobrou.push(`${q.materia}: ${q.subtema ?? '(sem subtema)'}`); continue; }
    const chave = `${q.materia} · ${tema}`;
    contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
    porTema.set(tema, [...(porTema.get(tema) ?? []), q.id]);
  }
  for (const [chave, n] of [...contagem].sort()) console.log(`${n.toString().padStart(4)}  ${chave}`);
  console.log(`\nSem regra (ficam sem tema): ${sobrou.length}`);
  sobrou.forEach((s) => console.log(`  - ${s}`));
  if (!gravar) return console.log('\nNada gravado (use --gravar).');

  let total = 0;
  for (const [tema, ids] of porTema) {
    const r = await prisma.question.updateMany({ where: { id: { in: ids }, tema: null }, data: { tema } });
    total += r.count;
  }
  console.log(`\nGravado: ${total} questões com tema.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
