export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { username: (session.user as any).username || session.user.email! } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const exam = await prisma.customExam.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        questions: {
          include: { question: true },
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!exam) return NextResponse.json({ error: 'Prova não encontrada' }, { status: 404 });

    return NextResponse.json({ exam });
  } catch (error: any) {
    console.error('Erro ao buscar prova:', error);
    return NextResponse.json({ error: 'Erro ao buscar prova' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { username: (session.user as any).username || session.user.email! } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    await prisma.customExam.deleteMany({ where: { id: params.id, userId: user.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao deletar prova:', error);
    return NextResponse.json({ error: 'Erro ao deletar prova' }, { status: 500 });
  }
}
