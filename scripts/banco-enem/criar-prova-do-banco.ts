// Cria uma prova (tela de Provas: tela cheia, sem rolar, com o astronauta) com
// questões do banco ENEM, na ordem dada. Pablo, 16/11/2026: abri as questões novas
// pelo Treino e ele estranhou: "quero que seja que nem das outras vezes".
// Não apaga nada; se a prova com esse nome já existe, não cria outra.
// Uso: DB_CONFIRMED=1 npx tsx scripts/banco-enem/criar-prova-do-banco.ts <username> "<nome>" <id,id,...> [--gravar]
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [username, nome, lista] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (!username || !nome || !lista) throw new Error('Uso: <username> "<nome>" <id,id,...> [--gravar]');
  const gravar = process.argv.includes('--gravar');
  const ids = lista.split(',').filter(Boolean);
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);
  const questoes = await prisma.question.findMany({ where: { id: { in: ids } }, select: { id: true, materia: true } });
  if (questoes.length !== ids.length) throw new Error(`Só ${questoes.length} de ${ids.length} questões estão no banco; nada gravado`);

  const ja = await prisma.customExam.findFirst({ where: { userId: user.id, nome } });
  if (ja) return console.log(`"${nome}" já existe: /provas/${ja.id}`);
  console.log(`"${nome}": ${ids.length} questões.`);
  if (!gravar) return console.log('Nada gravado (use --gravar).');
  const exam = await prisma.customExam.create({
    data: {
      userId: user.id, nome, nivel: 'escada',
      materias: Array.from(new Set(questoes.map((q) => q.materia))),
      totalQuestoes: ids.length,
      questions: { create: ids.map((questionId, ordem) => ({ questionId, ordem })) },
    },
  });
  console.log(`Criada: /provas/${exam.id}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
