export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { proximaSequencia } from '@/lib/dia-brasil';
import { agendarRevisaoDoErro } from '@/lib/revisao';

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

    if (!acertou) await agendarRevisaoDoErro(userId, questionId);

    // Sequência de dias no calendário de Brasília (lib/dia-brasil.ts).
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const agora = new Date();
      await prisma.user.update({
        where: { id: userId },
        data: { lastStudyDate: agora, streakDays: proximaSequencia(user.lastStudyDate, user.streakDays ?? 0, agora) },
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
