import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';

// Quantas questões das provas em escada já têm a aula no jeito do robô, por matéria
// (Pablo, 18/11/2026: "montar a equação e descobrir cada valor"). Só lê.
// Uso: DB_CONFIRMED=1 npx tsx scripts/contar-robo.ts [username]

const prisma = new PrismaClient();
const ROBO = ['As fórmulas desta questão', 'A regra desta questão', 'O que eu tenho'];

async function main() {
  const username = process.argv[2] ?? 'pablo123';
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);
  const provas = await prisma.customExam.findMany({
    where: { userId: user.id, arquivada: false, nivel: 'escada' },
    select: { nome: true, questions: { select: { question: { select: { explicacaoPronta: { select: { conteudo: true } } } } } } },
  });
  const porMateria: Record<string, { robo: number; total: number }> = {};
  for (const prova of provas) {
    const materia = prova.nome.split(' ')[0];
    porMateria[materia] ??= { robo: 0, total: 0 };
    for (const { question } of prova.questions) {
      const passos = (question.explicacaoPronta?.conteudo as { passos?: { titulo: string }[] } | null)?.passos;
      porMateria[materia].total++;
      if (ROBO.includes(passos?.[0]?.titulo ?? '')) porMateria[materia].robo++;
    }
  }
  for (const [materia, { robo, total }] of Object.entries(porMateria)) console.log(`${materia}: robô ${robo} de ${total}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
