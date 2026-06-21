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

    const user = await prisma.user.findUnique({ where: { username: (session.user as any).username || session.user.email! } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const body = await request.json();
    const { examId, questionId, respostaDada } = body;

    const exam = await prisma.customExam.findFirst({
      where: { id: examId, userId: user.id },
    });
    if (!exam) return NextResponse.json({ error: 'Prova não encontrada' }, { status: 404 });

    const examQuestion = await prisma.customExamQuestion.findFirst({
      where: { examId, questionId },
      include: { question: true },
    });
    if (!examQuestion) return NextResponse.json({ error: 'Questão não encontrada na prova' }, { status: 404 });

    const acertou = respostaDada === examQuestion.question.respostaCorreta;

    // Update exam question
    await prisma.customExamQuestion.update({
      where: { id: examQuestion.id },
      data: { answered: true, respostaDada, acertou },
    });

    // Update exam stats
    const newAcertos = acertou ? exam.acertos + 1 : exam.acertos;
    const newErros = !acertou ? exam.erros + 1 : exam.erros;
    const newCurrentIdx = exam.currentIdx + 1;

    await prisma.customExam.update({
      where: { id: examId },
      data: {
        acertos: newAcertos,
        erros: newErros,
        currentIdx: newCurrentIdx,
        status: exam.status === 'pendente' ? 'em_andamento' : exam.status,
        startedAt: exam.startedAt ?? new Date(),
      },
    });

    // Also record in UserProgress to feed the wider system (caderno de erros etc)
    await prisma.userProgress.create({
      data: {
        userId: user.id,
        questionId,
        acertou,
        respostaDada,
      },
    });

    return NextResponse.json({ acertou, respostaCorreta: examQuestion.question.respostaCorreta });
  } catch (error: any) {
    console.error('Erro ao responder prova:', error);
    return NextResponse.json({ error: 'Erro ao responder' }, { status: 500 });
  }
}
