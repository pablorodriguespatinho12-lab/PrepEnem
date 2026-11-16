export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

// Revisão de erros vira uma prova (Pablo, 16/11/2026): no Treino, recarregar a
// página voltava para a 1ª questão, e ele quer a tela da prova (tela cheia, sem
// rolar, astronauta). A prova guarda a questão atual no banco.
// Mesmo conjunto de erros com revisão ainda aberta: devolve a mesma prova, para
// não empilhar uma prova nova a cada clique.

const NOME = 'Revisão de erros';
const MAX_QUESTOES = 90;

function lerIds(bruto: unknown): string[] | null {
  if (!Array.isArray(bruto) || bruto.length === 0 || bruto.length > MAX_QUESTOES) return null;
  const ids = bruto.filter((x): x is string => typeof x === 'string' && x.length > 0 && x.length <= 100);
  return ids.length === bruto.length ? Array.from(new Set(ids)) : null;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const body = await request.json().catch(() => null);
    const ids = lerIds(body?.questionIds);
    if (!ids) return NextResponse.json({ error: 'Lista de questões inválida' }, { status: 400 });

    const questoes = await prisma.question.findMany({ where: { id: { in: ids } }, select: { id: true, materia: true } });
    if (questoes.length !== ids.length) return NextResponse.json({ error: 'Questão não encontrada' }, { status: 404 });

    const abertas = await prisma.customExam.findMany({
      where: { userId, nome: NOME, status: { not: 'finalizada' } },
      select: { id: true, questions: { select: { questionId: true }, orderBy: { ordem: 'asc' } } },
    });
    const mesma = abertas.find((e) => e.questions.length === ids.length && e.questions.every((q, i) => q.questionId === ids[i]));
    if (mesma) return NextResponse.json({ examId: mesma.id });

    const exam = await prisma.customExam.create({
      data: {
        userId, nome: NOME, nivel: 'revisao',
        materias: Array.from(new Set(questoes.map((q) => q.materia))),
        totalQuestoes: ids.length,
        questions: { create: ids.map((questionId, ordem) => ({ questionId, ordem })) },
      },
    });
    return NextResponse.json({ examId: exam.id });
  } catch (error) {
    console.error('Erro ao criar a revisão de erros:', error);
    return NextResponse.json({ error: 'Não deu para abrir a revisão. Tente de novo.' }, { status: 500 });
  }
}
