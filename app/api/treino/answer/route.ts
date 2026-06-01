export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { questionId, respostaDada, explicacaoEstudante } = await request.json();

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return NextResponse.json({ error: 'Questão não encontrada' }, { status: 404 });
    }

    const acertou = respostaDada === question.respostaCorreta;

    // Check existing progress for consecutive correct answers
    const existingProgress = await prisma.userProgress.findMany({
      where: { userId, questionId },
      orderBy: { dataResposta: 'desc' },
      take: 1,
    });

    const prevConsecutivos = existingProgress?.[0]?.acertosConsecutivos ?? 0;
    const newConsecutivos = acertou ? prevConsecutivos + 1 : 0;
    const dominada = newConsecutivos >= 2;
    const tentativas = (existingProgress?.[0]?.tentativas ?? 0) + 1;

    const progress = await prisma.userProgress.create({
      data: {
        userId,
        questionId,
        acertou,
        respostaDada,
        tentativas,
        explicacaoEstudante: explicacaoEstudante ?? null,
        acertosConsecutivos: newConsecutivos,
        dominada,
      },
    });

    // Schedule review if wrong (Ebbinghaus intervals: 1, 3, 7, 15 days)
    if (!acertou) {
      const now = new Date();
      const nextReview = new Date(now);
      nextReview.setDate(nextReview.getDate() + 1);
      await prisma.reviewSchedule.create({
        data: {
          userId,
          questionId,
          proximaRevisao: nextReview,
          intervaloAtual: 1,
        },
      });
    }

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
      if (lastStudy) {
        lastStudy.setHours(0, 0, 0, 0);
      }
      const diff = lastStudy ? Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)) : -1;
      let newStreak = user.streakDays ?? 0;
      if (diff === 1) newStreak += 1;
      else if (diff > 1) newStreak = 1;
      else if (diff < 0 || diff === 0) { /* same day, keep streak */ }

      await prisma.user.update({
        where: { id: userId },
        data: { lastStudyDate: new Date(), streakDays: newStreak },
      });
    }

    return NextResponse.json({
      acertou,
      respostaCorreta: question.respostaCorreta,
      explicacao: question.explicacao,
      dominada,
      acertosConsecutivos: newConsecutivos,
      progressId: progress.id,
    });
  } catch (error: any) {
    console.error('Answer error:', error);
    return NextResponse.json({ error: 'Erro ao processar resposta' }, { status: 500 });
  }
}
