export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getActiveStudyDay, upsertStudyProgress, type StudyProgressStatus } from '@/lib/study-progress';

const VALID_STATUSES: StudyProgressStatus[] = ['nao_iniciado', 'em_andamento', 'concluido', 'pulado'];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const [progress, active] = await Promise.all([
    prisma.studyProgress.findMany({ where: { userId } }),
    getActiveStudyDay(userId),
  ]);

  return NextResponse.json({ progress, active });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const body = await req.json().catch(() => ({}));
  const { weekNumber, dayIndex, status } = body;

  if (
    !Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 4 ||
    !Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6 ||
    !VALID_STATUSES.includes(status)
  ) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  }

  const updated = await upsertStudyProgress(userId, weekNumber, dayIndex, status);
  return NextResponse.json({ studyProgress: updated });
}
