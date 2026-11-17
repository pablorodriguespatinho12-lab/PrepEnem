import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';
import { MATERIAS_DO_DIA } from '../data/escadas';
import { provasDasEscadas } from '../lib/prova-da-escada';

// Provas em escada (Pablo, 17/11/2026): uma por conteúdo, Fácil → Médio → Difícil
// → ENEM → ITA. Esconde (arquivada = true, sem apagar) as provas antigas, menos a
// Revisão de erros. Sem --gravar só mostra. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/criar-provas-escada.ts <username> [--gravar]

const prisma = new PrismaClient();
const NIVEL_ESCADA = 'escada';

async function main() {
  const [username] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const gravar = process.argv.includes('--gravar');
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);

  const todas = await prisma.question.findMany({
    where: { materia: { in: [...MATERIAS_DO_DIA] }, tema: { not: null }, ancoraId: null },
    select: { id: true, materia: true, tema: true, nivel: true, anoProva: true, origem: true },
  });
  const provas = provasDasEscadas(todas).filter((p) => p.questoes.length > 0);
  const vazias = provasDasEscadas(todas).filter((p) => p.questoes.length === 0);
  for (const p of provas) {
    console.log(`${p.nome}: ${p.questoes.length} questões${p.faltam.length ? ` (falta: ${p.faltam.join(', ')})` : ''}`);
  }
  if (vazias.length) console.log(`Sem nenhuma questão (fica de fora): ${vazias.map((p) => p.nome).join('; ')}`);

  const nomes = new Set(provas.map((p) => p.nome));
  const antigas = await prisma.customExam.findMany({
    where: { userId: user.id, arquivada: false, nivel: { not: 'revisao' } },
    select: { id: true, nome: true },
  });
  const esconder = antigas.filter((e) => !nomes.has(e.nome));
  console.log(`\nEsconder (${esconder.length}): ${esconder.map((e) => e.nome).join('; ')}`);
  if (!gravar) return console.log('\nNada gravado (use --gravar).');

  const r = await prisma.customExam.updateMany({ where: { id: { in: esconder.map((e) => e.id) } }, data: { arquivada: true } });
  console.log(`Escondidas: ${r.count}`);
  let criadas = 0;
  for (const p of provas) {
    const ja = await prisma.customExam.findFirst({ where: { userId: user.id, nome: p.nome, arquivada: false } });
    if (ja) continue;
    await prisma.customExam.create({
      data: {
        userId: user.id, nome: p.nome, nivel: NIVEL_ESCADA, materias: [p.materia],
        totalQuestoes: p.questoes.length,
        questions: { create: p.questoes.map((q, ordem) => ({ questionId: q.id, ordem })) },
      },
    });
    criadas++;
  }
  console.log(`Criadas: ${criadas}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
