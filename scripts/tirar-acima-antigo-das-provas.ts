import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';

/* Tira das provas de escada de MATEMÁTICA as questões de nível "acima" antigas (as que não são
   d2-escada-mat-ita-<tema>-00a..d), quando ainda não foram respondidas, e renumera a ordem.
   Motivo (Pablo, 23/11/2026): a Matemática 2 ainda mostrava "Nove operários" (gra-01) porque
   criar-provas-escada.ts só ACRESCENTA questões quando a prova já tem resposta.
   As questões continuam no banco; só saem da prova. Sem --gravar só mostra.
   Uso: DB_CONFIRMED=1 npx tsx scripts/tirar-acima-antigo-das-provas.ts <username> [--gravar] */
const prisma = new PrismaClient();
const NOVA = /^d2-escada-mat-ita-[a-z]{3}-00[a-d]$/;

async function main() {
  const [username] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const gravar = process.argv.includes('--gravar');
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);
  const provas = await prisma.customExam.findMany({
    where: { userId: user.id, arquivada: false, nivel: 'escada', nome: { startsWith: 'Matemática' } },
    include: { questions: { orderBy: { ordem: 'asc' }, include: { question: { select: { id: true, nivel: true } } } } },
  });
  for (const prova of provas) {
    const sai = prova.questions.filter((q) => q.question.nivel === 'acima' && !NOVA.test(q.question.id) && !q.answered);
    const ficaAcima = prova.questions.filter((q) => q.question.nivel === 'acima' && NOVA.test(q.question.id)).length;
    if (sai.length === 0) continue;
    // Só tira se a prova já tem as novas (senão ficaria sem nível acima).
    if (ficaAcima < 2) {
      console.log(`${prova.nome}: tem só ${ficaAcima} nova(s); NÃO tiro as antigas.`);
      continue;
    }
    console.log(`${prova.nome}: tira ${sai.map((q) => q.question.id).join(', ')}`);
    if (!gravar) continue;
    await prisma.$transaction(async (tx) => {
      await tx.customExamQuestion.deleteMany({ where: { id: { in: sai.map((q) => q.id) } } });
      const restantes = await tx.customExamQuestion.findMany({ where: { examId: prova.id }, orderBy: { ordem: 'asc' }, select: { id: true } });
      for (const [ordem, q] of restantes.entries()) await tx.customExamQuestion.update({ where: { id: q.id }, data: { ordem } });
      await tx.customExam.update({ where: { id: prova.id }, data: { totalQuestoes: restantes.length } });
    });
    console.log(`  ${prova.nome}: agora ${prova.questions.length - sai.length} questões.`);
  }
  if (!gravar) console.log('Nada gravado (use --gravar).');
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
