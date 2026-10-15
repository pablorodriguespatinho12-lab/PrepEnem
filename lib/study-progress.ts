import { prisma } from '@/lib/db';
import { studyCycle } from '@/lib/schedule-data';

export type StudyProgressStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'pulado';

const DONE_STATUSES: StudyProgressStatus[] = ['concluido', 'pulado'];

// Semana/dia "atuais" derivados do progresso real do usuário, não da data —
// substitui o CYCLE_START antigo que girava sozinho independente do que o
// usuário de fato estudava. Semana ativa = primeira das 4 com algum dia
// pendente; dia ativo = primeiro dia pendente dessa semana. Se as 4 semanas
// estiverem concluídas, cycleComplete=true (sem loop automático de volta pra
// semana 1 — looping sozinho foi exatamente o bug original).
export async function getActiveStudyDay(userId: string) {
  const rows = await prisma.studyProgress.findMany({ where: { userId } });
  const statusFor = (weekNumber: number, dayIndex: number): StudyProgressStatus =>
    (rows.find((r) => r.weekNumber === weekNumber && r.dayIndex === dayIndex)?.status as StudyProgressStatus) ??
    'nao_iniciado';

  // Só avança o dia que foi ESTUDADO (treino terminado). "pulado" fica
  // pendente: o conteúdo não estudado vira o conteúdo de hoje (Pablo,
  // 15/10/2026: "mostra o dia de hoje, que é quinta, com o conteúdo de segunda").
  for (let weekNumber = 1; weekNumber <= studyCycle.length; weekNumber++) {
    const week = studyCycle[weekNumber - 1];
    for (let dayIndex = 0; dayIndex < week.days.length; dayIndex++) {
      if (statusFor(weekNumber, dayIndex) !== 'concluido') {
        return { weekNumber, dayIndex, cycleComplete: false };
      }
    }
  }
  const lastWeek = studyCycle.length;
  const lastDay = studyCycle[lastWeek - 1].days.length - 1;
  return { weekNumber: lastWeek, dayIndex: lastDay, cycleComplete: true };
}

export async function upsertStudyProgress(
  userId: string,
  weekNumber: number,
  dayIndex: number,
  status: StudyProgressStatus
) {
  return prisma.studyProgress.upsert({
    where: { userId_weekNumber_dayIndex: { userId, weekNumber, dayIndex } },
    update: { status, completedAt: DONE_STATUSES.includes(status) ? new Date() : null },
    create: { userId, weekNumber, dayIndex, status, completedAt: DONE_STATUSES.includes(status) ? new Date() : null },
  });
}
