export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const now = new Date();

    const pendingReviews = await prisma.reviewSchedule.findMany({
      where: {
        userId,
        completada: false,
        proximaRevisao: { lte: now },
      },
      include: { question: true },
      orderBy: { proximaRevisao: 'asc' },
    });

    return NextResponse.json({
      reviews: pendingReviews ?? [],
      count: pendingReviews?.length ?? 0,
    });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Erro ao buscar revisões' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { reviewId, acertou } = await request.json();

    const review = await prisma.reviewSchedule.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== userId) {
      return NextResponse.json({ error: 'Revisão não encontrada' }, { status: 404 });
    }

    // Marca como feita só se ainda não estava: duplo clique ou nova tentativa
    // criavam uma revisão seguinte a cada chamada e a fila se multiplicava.
    const marcada = await prisma.reviewSchedule.updateMany({
      where: { id: reviewId, completada: false },
      data: { completada: true },
    });
    if (marcada.count === 0) {
      return NextResponse.json({ ok: true, jaRegistrada: true });
    }

    // Ebbinghaus intervals: 1 -> 3 -> 7 -> 15
    const intervals = [1, 3, 7, 15];
    const currentInterval = review.intervaloAtual ?? 1;
    const currentIdx = intervals.indexOf(currentInterval);

    if (acertou) {
      // If correct, schedule next interval (if there is one)
      const nextIdx = currentIdx + 1;
      if (nextIdx < intervals.length) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + intervals[nextIdx]);
        await prisma.reviewSchedule.create({
          data: {
            userId,
            questionId: review.questionId,
            proximaRevisao: nextDate,
            intervaloAtual: intervals[nextIdx],
          },
        });
      }
    } else {
      // If wrong, restart cycle
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1);
      await prisma.reviewSchedule.create({
        data: {
          userId,
          questionId: review.questionId,
          proximaRevisao: nextDate,
          intervaloAtual: 1,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Review answer error:', error);
    return NextResponse.json({ error: 'Erro ao processar revisão' }, { status: 500 });
  }
}
