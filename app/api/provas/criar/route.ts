export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Niveis: 'facil' (facil+medio), 'medio' (medio+modelo_enem), 'vestibular' (vestibular+modelo_enem)
const nivelMapping: Record<string, string[]> = {
  facil: ['facil', 'medio'],
  medio: ['medio', 'modelo_enem'],
  dificil: ['modelo_enem', 'vestibular'],
  vestibular: ['vestibular', 'modelo_enem'],
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const body = await request.json();
    const { nome, nivel, materias, totalQuestoes } = body;

    if (!nome || !nivel || !Array.isArray(materias) || materias.length === 0 || !totalQuestoes) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const niveisPermitidos = nivelMapping[nivel] || ['medio'];

    // Find questions matching nivel + materias
    let questoes = await prisma.question.findMany({
      where: {
        materia: { in: materias },
        nivel: { in: niveisPermitidos },
      },
      orderBy: { createdAt: 'desc' },
      take: totalQuestoes * 3, // fetch extras for shuffling
    });

    // If not enough, fall back to dificuldade field for legacy questions
    if (questoes.length < totalQuestoes) {
      const extra = await prisma.question.findMany({
        where: {
          materia: { in: materias },
          id: { notIn: questoes.map((q) => q.id) },
        },
        orderBy: { createdAt: 'desc' },
        take: totalQuestoes * 2,
      });
      questoes = [...questoes, ...extra];
    }

    if (questoes.length === 0) {
      return NextResponse.json({ error: 'Nenhuma questão disponível para os critérios escolhidos' }, { status: 400 });
    }

    // Shuffle and slice
    const shuffled = [...questoes].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, totalQuestoes);

    // Create exam
    const exam = await prisma.customExam.create({
      data: {
        userId: user.id,
        nome,
        nivel,
        materias,
        totalQuestoes: selected.length,
        questions: {
          create: selected.map((q, idx) => ({
            questionId: q.id,
            ordem: idx,
          })),
        },
      },
    });

    return NextResponse.json({ examId: exam.id, totalQuestoes: selected.length });
  } catch (error: any) {
    console.error('Erro ao criar prova:', error);
    return NextResponse.json({ error: 'Erro ao criar prova' }, { status: 500 });
  }
}
