export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { etapaDaQuestao, type Etapa } from '@/lib/treino-etapas';
// Os 4 níveis (Pablo, 03/11/2026): Fácil, Médio, Difícil e ENEM (só real).
// Se faltar questão no nível pedido, completa com o vizinho mais perto.
// 'vestibular' fica para provas antigas criadas com esse nível.
const VIZINHOS: Record<string, Etapa[]> = {
  facil: ['facil', 'medio'],
  medio: ['medio', 'facil', 'dificil'],
  dificil: ['dificil', 'medio', 'enem'],
  enem: ['enem', 'dificil'],
  vestibular: ['vestibular', 'dificil', 'enem'],
};
function embaralhar<T>(lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const body = await request.json();
    const { nome, nivel, materias } = body;
    // Sem limite, "abc" dava take: NaN (500) e 100000 lia o banco inteiro.
    const totalQuestoes = Math.min(Math.max(parseInt(String(body.totalQuestoes), 10) || 0, 0), 90);

    if (!nome || !nivel || !Array.isArray(materias) || materias.length === 0 || !totalQuestoes) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const ordem = VIZINHOS[nivel] ?? VIZINHOS.medio;
    // Degraus (ancoraId) só fazem sentido junto da própria questão do ENEM.
    const todas = embaralhar(await prisma.question.findMany({
      where: { materia: { in: materias }, ancoraId: null },
    }));
    const selected = ordem
      .flatMap((etapa) => todas.filter((q) => etapaDaQuestao(q) === etapa))
      .slice(0, totalQuestoes);
    if (selected.length === 0) {
      return NextResponse.json({ error: 'Nenhuma questão disponível para os critérios escolhidos' }, { status: 400 });
    }
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
