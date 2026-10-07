import { inicioDoDiaBrasil } from '@/lib/dia-brasil';
import { prisma } from '@/lib/db';
// Errou: revisão amanhã, no começo do ciclo (1, 3, 7, 15 dias; ver api/review).
// Se já há uma revisão pendente da mesma questão, não cria outra: errar a
// mesma questão três vezes gerava três revisões iguais e inflava a fila.
export async function agendarRevisaoDoErro(userId: string, questionId: string): Promise<void> {
  const pendente = await prisma.reviewSchedule.findFirst({
    where: { userId, questionId, completada: false },
    select: { id: true },
  });
  const amanha = inicioDoDiaBrasil(new Date(), 1);
  if (pendente) {
    await prisma.reviewSchedule.update({ where: { id: pendente.id }, data: { proximaRevisao: amanha, intervaloAtual: 1 } });
    return;
  }
  await prisma.reviewSchedule.create({ data: { userId, questionId, proximaRevisao: amanha, intervaloAtual: 1 } });
}
