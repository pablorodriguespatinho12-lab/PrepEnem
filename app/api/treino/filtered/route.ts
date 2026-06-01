export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSubtemaLevel } from '@/lib/learning-order';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { materia, subtema, quantidade = 20 } = await req.json();

    const where: any = {};
    if (materia) where.materia = materia;
    if (subtema) where.subtema = subtema;

    const allQuestions = await prisma.question.findMany({ where });
    if (allQuestions.length === 0) {
      return NextResponse.json({ error: 'Sem questões para esse filtro' }, { status: 404 });
    }

    // Get user progress for these questions
    const progress = await prisma.userProgress.findMany({
      where: { userId, questionId: { in: allQuestions.map((q) => q.id) } },
      orderBy: { dataResposta: 'desc' },
    });

    const progressMap = new Map<string, boolean>();
    for (const p of progress) {
      if (!progressMap.has(p.questionId)) {
        progressMap.set(p.questionId, p.acertou);
      }
    }

    // Priority: wrong > unanswered > correct
    const wrong: any[] = [];
    const unanswered: any[] = [];
    const correct: any[] = [];
    for (const q of allQuestions) {
      const p = progressMap.get(q.id);
      if (p === undefined) unanswered.push(q);
      else if (!p) wrong.push(q);
      else correct.push(q);
    }

    const shuffle = (arr: any[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    let selected = [
      ...shuffle(wrong),
      ...shuffle(unanswered),
      ...shuffle(correct),
    ].slice(0, quantidade);

    // Progressive difficulty + learning order for Física/Química
    const difficultyOrder: Record<string, number> = { facil: 0, medio: 1, dificil: 2 };
    selected.sort((a: any, b: any) => {
      const levelA = getSubtemaLevel(a?.materia ?? '', a?.subtema ?? '');
      const levelB = getSubtemaLevel(b?.materia ?? '', b?.subtema ?? '');
      if (levelA !== levelB) return levelA - levelB;
      const da = difficultyOrder[a?.dificuldade ?? 'medio'] ?? 1;
      const db = difficultyOrder[b?.dificuldade ?? 'medio'] ?? 1;
      return da - db;
    });

    // Flag if questions are insufficient (so UI can suggest AI generation)
    const insufficient = selected.length < quantidade;

    return NextResponse.json({ questions: selected, total: selected.length, insufficient, requested: quantidade });
  } catch (error: any) {
    console.error('Filtered training error:', error);
    return NextResponse.json({ error: 'Erro ao gerar treino filtrado' }, { status: 500 });
  }
}
