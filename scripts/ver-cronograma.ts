// Mostra o progresso do cronograma de um aluno e quantas questões ele
// respondeu em cada dia. Só leitura.
//   npx tsx --env-file=.env scripts/ver-cronograma.ts pablo123
import { prisma } from '@/lib/db';

async function main() {
  const user = await prisma.user.findUnique({ where: { username: process.argv[2] ?? 'pablo123' } });
  if (!user) throw new Error('usuário não encontrado');
  const linhas = await prisma.studyProgress.findMany({ where: { userId: user.id }, orderBy: [{ weekNumber: 'asc' }, { dayIndex: 'asc' }] });
  for (const l of linhas) console.log(`semana ${l.weekNumber} dia ${l.dayIndex}: ${l.status} ${l.completedAt?.toISOString() ?? ''} (criado ${l.createdAt?.toISOString?.() ?? ''})`);
  const sessoes = await prisma.trainingSession.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 8 });
  for (const s of sessoes) console.log('sessao', s.createdAt.toISOString(), JSON.stringify({ mode: (s as Record<string, unknown>).mode, idx: (s as Record<string, unknown>).currentIdx, fim: (s as Record<string, unknown>).finished ?? (s as Record<string, unknown>).completed }));
  await prisma.$disconnect();
}
main();
