// Zera o progresso de estudo de UMA conta, para recomeçar do zero (pedido do
// Pablo, 06/10/2026: "pode resetar tudo, é antiga, vou começar de novo").
// Uso: npx tsx --env-file=.env scripts/resetar-progresso.ts <username> [--apagar]
// Sem --apagar, só conta. Com --apagar, salva cópia em backups/ e apaga.
//
// Apaga só linhas com o userId da conta. NUNCA toca em Question, Flashcard,
// FlashcardDeck (o baralho leva os cartões junto), temas de redação nem
// lições de Cálculo geradas: são conteúdo, não progresso (prisma-neon-safety).

import { mkdirSync, writeFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const [username, flag] = process.argv.slice(2);
const apagar = flag === '--apagar';

async function contar(userId: string) {
  const w = { where: { userId } };
  return {
    UserProgress: await prisma.userProgress.count(w),
    ReviewSchedule: await prisma.reviewSchedule.count(w),
    TrainingSession: await prisma.trainingSession.count(w),
    StudyProgress: await prisma.studyProgress.count(w),
    FlashcardProgress: await prisma.flashcardProgress.count(w),
    CalculoProgresso: await prisma.calculoProgresso.count(w),
    Essay: await prisma.essay.count(w),
    EssayPartPractice: await prisma.essayPartPractice.count(w),
    CustomExam: await prisma.customExam.count(w),
  };
}

async function conteudo() {
  return { Question: await prisma.question.count(), Flashcard: await prisma.flashcard.count(), FlashcardDeck: await prisma.flashcardDeck.count() };
}

async function main() {
  if (!username) throw new Error('Informe o username: npx tsx --env-file=.env scripts/resetar-progresso.ts <username> [--apagar]');
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta "${username}" não existe.`);
  const userId = user.id;

  const antes = await contar(userId);
  const conteudoAntes = await conteudo();
  console.log('Progresso da conta:', antes);
  console.log('Conteúdo (não é apagado):', conteudoAntes);
  if (!apagar) { console.log('Só contei. Para apagar, rode de novo com --apagar.'); return; }

  const w = { where: { userId } };
  const copia = {
    conta: { username, userId, streakDays: user.streakDays, lastStudyDate: user.lastStudyDate },
    UserProgress: await prisma.userProgress.findMany(w),
    ReviewSchedule: await prisma.reviewSchedule.findMany(w),
    TrainingSession: await prisma.trainingSession.findMany({ ...w, include: { questions: true } }),
    StudyProgress: await prisma.studyProgress.findMany(w),
    FlashcardProgress: await prisma.flashcardProgress.findMany(w),
    CalculoProgresso: await prisma.calculoProgresso.findMany(w),
    Essay: await prisma.essay.findMany(w),
    EssayPartPractice: await prisma.essayPartPractice.findMany(w),
    CustomExam: await prisma.customExam.findMany({ ...w, include: { questions: true } }),
  };
  mkdirSync('backups', { recursive: true });
  const arquivo = `backups/progresso-${username}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(arquivo, JSON.stringify(copia, null, 2));
  console.log('Cópia salva em', arquivo);

  await prisma.$transaction([
    prisma.userProgress.deleteMany(w),
    prisma.reviewSchedule.deleteMany(w),
    prisma.trainingSession.deleteMany(w),
    prisma.studyProgress.deleteMany(w),
    prisma.flashcardProgress.deleteMany(w),
    prisma.calculoProgresso.deleteMany(w),
    prisma.essay.deleteMany(w),
    prisma.essayPartPractice.deleteMany(w),
    prisma.customExam.deleteMany(w),
    prisma.user.update({ where: { id: userId }, data: { streakDays: 0, lastStudyDate: null } }),
  ]);

  console.log('Depois:', await contar(userId));
  const conteudoDepois = await conteudo();
  console.log('Conteúdo depois:', conteudoDepois);
  if (JSON.stringify(conteudoAntes) !== JSON.stringify(conteudoDepois)) throw new Error('O conteúdo mudou! Conferir a cópia.');
}

main()
  .catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
