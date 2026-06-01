export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { totalQuestoes = 90, materias } = await req.json().catch(() => ({}));
    const limit = Math.min(Math.max(totalQuestoes, 10), 180);

    // Get questions, optionally filtered by materias
    const where: any = {};
    if (materias && Array.isArray(materias) && materias.length > 0) {
      where.materia = { in: materias };
    }

    const allQuestions = await prisma.question.findMany({ where });

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: 'Sem questões disponíveis' }, { status: 404 });
    }

    // Shuffle
    const shuffle = (arr: any[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    // Try to balance by materia
    const byMateria: Record<string, any[]> = {};
    for (const q of allQuestions) {
      const m = q.materia;
      if (!byMateria[m]) byMateria[m] = [];
      byMateria[m].push(q);
    }

    const materiaKeys = Object.keys(byMateria);
    const perMateria = Math.max(1, Math.floor(limit / materiaKeys.length));
    let selected: any[] = [];

    for (const m of materiaKeys) {
      selected.push(...shuffle(byMateria[m]).slice(0, perMateria));
    }

    // Fill remaining
    if (selected.length < limit) {
      const usedIds = new Set(selected.map((q) => q.id));
      const remaining = shuffle(allQuestions.filter((q) => !usedIds.has(q.id)));
      selected.push(...remaining.slice(0, limit - selected.length));
    }

    selected = shuffle(selected).slice(0, limit);

    // Group by area for summary
    const areas: Record<string, number> = {};
    for (const q of selected) {
      areas[q.materia] = (areas[q.materia] ?? 0) + 1;
    }

    return NextResponse.json({
      questions: selected,
      total: selected.length,
      areas,
    });
  } catch (error: any) {
    console.error('Simulado generate error:', error);
    return NextResponse.json({ error: 'Erro ao gerar simulado' }, { status: 500 });
  }
}
