import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Prova "Revisão final: o que mais cai" (Pablo, 03/11/2026). As questões
// estão em data/revisao-final/prova-revisao-final.json: reais do ENEM, dos
// temas do checklist. Cria a prova pronta em /provas para a conta do usuário
// passado. Se já existir uma com o mesmo nome ainda não começada, não cria outra.
// Uso: npx tsx scripts/criar-prova-revisao-final.ts <username>

interface ProvaArquivo { nome: string; questoes: { id: string; area: string }[] }

async function main() {
  const username = process.argv[2];
  if (!username) throw new Error("Passe o usuário: npx tsx scripts/criar-prova-revisao-final.ts <username>");
  const prova: ProvaArquivo = JSON.parse(readFileSync(join(process.cwd(), 'data/revisao-final/prova-revisao-final.json'), 'utf8'));
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);

  const ids = prova.questoes.map((q) => q.id);
  const existentes = await prisma.question.findMany({ where: { id: { in: ids } }, select: { id: true, materia: true } });
  const faltam = ids.filter((id) => !existentes.some((q) => q.id === id));
  if (faltam.length > 0) throw new Error(`Questões que não estão no banco: ${faltam.join(', ')}`);

  const ja = await prisma.customExam.findFirst({ where: { userId: user.id, nome: prova.nome, status: 'pendente' } });
  if (ja) {
    console.log(`Já existe (não começada): ${ja.id}`);
    return;
  }
  const materias = Array.from(new Set(ids.map((id) => existentes.find((q) => q.id === id)!.materia)));
  const exam = await prisma.customExam.create({
    data: {
      userId: user.id,
      nome: prova.nome,
      nivel: 'enem',
      materias,
      totalQuestoes: ids.length,
      questions: { create: ids.map((questionId, ordem) => ({ questionId, ordem })) },
    },
  });
  console.log(`Criada: ${exam.id} (${ids.length} questões, ${materias.length} matérias)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
