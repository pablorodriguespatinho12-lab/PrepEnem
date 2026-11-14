import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';

// Volta uma prova ao começo (Pablo, 14/11/2026: "reseta a prova que estou fazendo").
// Zera só o andamento DA PROVA (questão atual, acertos, respostas marcadas nela).
// O histórico de respostas (UserProgress: caderno de erros, progresso) fica.
// Sem --gravar só mostra. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/reiniciar-prova.ts "<nome exato da prova>" <username> [--gravar]

const prisma = new PrismaClient();

async function main() {
  const [nome, username] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (!nome || !username) throw new Error('Uso: reiniciar-prova.ts "<nome>" <username> [--gravar]');
  const gravar = process.argv.includes('--gravar');
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);
  const provas = await prisma.customExam.findMany({ where: { userId: user.id, nome } });
  if (provas.length !== 1) throw new Error(`Esperava 1 prova "${nome}", achei ${provas.length}; nada mudado`);
  const [prova] = provas;
  const respondidas = await prisma.customExamQuestion.count({ where: { examId: prova.id, answered: true } });
  console.log(`${prova.nome}: ${prova.status}, questão ${prova.currentIdx + 1} de ${prova.totalQuestoes}, ${respondidas} respondidas.`);
  if (!gravar) return console.log('Nada mudado (use --gravar).');

  await prisma.$transaction([
    prisma.customExamQuestion.updateMany({
      where: { examId: prova.id },
      data: { answered: false, respostaDada: null, acertou: null },
    }),
    prisma.customExam.update({
      where: { id: prova.id },
      data: { status: 'pendente', currentIdx: 0, acertos: 0, erros: 0, startedAt: null, finishedAt: null },
    }),
  ]);
  console.log('Reiniciada: volta na questão 1. Histórico de respostas mantido.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
