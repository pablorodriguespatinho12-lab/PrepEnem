export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Retrieve active (unfinished) simulado session
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const activeSession = await prisma.trainingSession.findFirst({
      where: { userId, finished: false, mode: 'simulado' },
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          orderBy: { ordem: 'asc' },
          include: { question: true },
        },
      },
    });

    if (!activeSession) {
      return NextResponse.json({ session: null });
    }

    // Build answers map from answered questions
    const answers: Record<string, string> = {};
    for (const sq of activeSession.questions) {
      if (sq.answered && sq.respostaDada) {
        answers[sq.questionId] = sq.respostaDada;
      }
    }

    return NextResponse.json({
      session: {
        id: activeSession.id,
        currentIdx: activeSession.currentIdx,
        correct: activeSession.correct,
        wrong: activeSession.wrong,
        timeLeft: activeSession.timeLeft,
        timeElapsed: activeSession.timeElapsed,
        timerHours: activeSession.timerHours,
        useTimer: activeSession.useTimer,
        answers,
        questions: activeSession.questions.map(sq => sq.question),
      },
    });
  } catch (error: any) {
    console.error('Get simulado session error:', error);
    return NextResponse.json({ error: 'Erro ao buscar sessão' }, { status: 500 });
  }
}

// POST: Create a new simulado session
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { questionIds, useTimer, timerHours, timeLeft } = await req.json();

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'Nenhuma questão fornecida' }, { status: 400 });
    }

    // Close any existing active simulado sessions
    await prisma.trainingSession.updateMany({
      where: { userId, finished: false, mode: 'simulado' },
      data: { finished: true },
    });

    // Create new session
    const newSession = await prisma.trainingSession.create({
      data: {
        userId,
        mode: 'simulado',
        useTimer: useTimer ?? false,
        timerHours: timerHours ?? 0,
        timeLeft: timeLeft ?? 0,
        timeElapsed: 0,
        questions: {
          create: questionIds.map((qId: string, idx: number) => ({
            questionId: qId,
            ordem: idx,
          })),
        },
      },
    });

    return NextResponse.json({ sessionId: newSession.id });
  } catch (error: any) {
    console.error('Create simulado session error:', error);
    return NextResponse.json({ error: 'Erro ao criar sessão' }, { status: 500 });
  }
}

// PUT: Update simulado session progress
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { sessionId, currentIdx, timeLeft, timeElapsed, questionId, respostaDada, finished } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID não fornecido' }, { status: 400 });
    }

    const updateData: any = {};
    if (currentIdx !== undefined) updateData.currentIdx = currentIdx;
    if (timeLeft !== undefined) updateData.timeLeft = timeLeft;
    if (timeElapsed !== undefined) updateData.timeElapsed = timeElapsed;
    if (finished !== undefined) updateData.finished = finished;

    await prisma.trainingSession.update({
      where: { id: sessionId },
      data: updateData,
    });

    // Mark question as answered if provided
    if (questionId && respostaDada !== undefined) {
      await prisma.trainingSessionQuestion.updateMany({
        where: { sessionId, questionId },
        data: { answered: true, respostaDada },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Update simulado session error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar sessão' }, { status: 500 });
  }
}
