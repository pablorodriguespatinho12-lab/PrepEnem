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

    const { examId } = await request.json();
    const exam = await prisma.customExam.findFirst({ where: { id: examId, userId: user.id } });
    if (!exam) return NextResponse.json({ error: 'Prova não encontrada' }, { status: 404 });

    await prisma.customExam.update({
      where: { id: examId },
      data: { status: 'finalizada', finishedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao finalizar prova:', error);
    return NextResponse.json({ error: 'Erro ao finalizar' }, { status: 500 });
  }
}
