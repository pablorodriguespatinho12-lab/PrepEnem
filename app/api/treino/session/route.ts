export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Retrieve active (unfinished) training session
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const activeSession = await prisma.trainingSession.findFirst({
      where: { userId, finished: false },
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

    return NextResponse.json({
      session: {
        id: activeSession.id,
        currentIdx: activeSession.currentIdx,
        correct: activeSession.correct,
        wrong: activeSession.wrong,
        mode: activeSession.mode,
        questions: activeSession.questions.map(sq => ({
          ...sq.question,
          answered: sq.answered,
          respostaDada: sq.respostaDada,
        })),
      },
    });
  } catch (error: any) {
    console.error('Get session error:', error);
    return NextResponse.json({ error: 'Erro ao buscar sessão' }, { status: 500 });
  }
}

// POST: Create a new training session
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { questionIds, mode = 'normal' } = await req.json();

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'Nenhuma questão fornecida' }, { status: 400 });
    }

    // Close any existing active sessions
    await prisma.trainingSession.updateMany({
      where: { userId, finished: false },
      data: { finished: true },
    });

    // Create new session with questions
    const newSession = await prisma.trainingSession.create({
      data: {
        userId,
        mode,
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
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Erro ao criar sessão' }, { status: 500 });
  }
}

// PUT: Update session progress
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { sessionId, currentIdx, correct, wrong, questionId, respostaDada, finished } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID não fornecido' }, { status: 400 });
    }

    // Update session progress
    const updateData: any = {};
    if (currentIdx !== undefined) updateData.currentIdx = currentIdx;
    if (correct !== undefined) updateData.correct = correct;
    if (wrong !== undefined) updateData.wrong = wrong;
    if (finished !== undefined) updateData.finished = finished;

    await prisma.trainingSession.update({
      where: { id: sessionId },
      data: updateData,
    });

    // Mark question as answered if provided
    if (questionId && respostaDada) {
      await prisma.trainingSessionQuestion.updateMany({
        where: { sessionId, questionId },
        data: { answered: true, respostaDada },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Update session error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar sessão' }, { status: 500 });
  }
}
