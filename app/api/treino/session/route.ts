export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { diaNoBrasil } from '@/lib/dia-brasil';

// GET: Retrieve active (unfinished) training session
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Só retoma sessão recente. Uma sessão aberta de outro dia foi montada
    // para outro dia do cronograma — retomá-la jogava o estudante no meio de
    // questões que não são as de hoje, sem passar pelo resumo.
    const LIMITE_RETOMADA_MS = 12 * 60 * 60 * 1000;
    // Treino e Simulado dividem a tabela: sem filtrar o modo, o Treino
    // retomava o simulado aberto ("45 de 90", Pablo, 06/10/2026).
    const aberta = await prisma.trainingSession.findFirst({
      where: { userId, finished: false, mode: { not: 'simulado' }, createdAt: { gte: new Date(Date.now() - LIMITE_RETOMADA_MS) } },
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          orderBy: { ordem: 'asc' },
          include: { question: true },
        },
      },
    });
    // Só retoma o treino de HOJE (dia no Brasil): o de ontem foi montado para
    // outro dia do cronograma.
    const activeSession = aberta && diaNoBrasil(aberta.createdAt) === diaNoBrasil(new Date()) ? aberta : null;

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

    // Fecha os treinos abertos; o simulado aberto fica, ele tem tela própria.
    await prisma.trainingSession.updateMany({
      where: { userId, finished: false, mode: { not: 'simulado' } },
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

    const userId = (session.user as any).id;
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

    // Só a sessão do próprio usuário: o id vem do cliente.
    const { count } = await prisma.trainingSession.updateMany({
      where: { id: sessionId, userId },
      data: updateData,
    });
    if (count === 0) {
      return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 });
    }

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
