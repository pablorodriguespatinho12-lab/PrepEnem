export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { inicioDoDiaBrasil } from '@/lib/dia-brasil';

/* Quantas provas o aluno terminou hoje (dia de Brasília), para a meta do início. */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const agora = new Date();
    const feitas = await prisma.customExam.count({
      where: {
        userId,
        status: 'finalizada',
        finishedAt: { gte: inicioDoDiaBrasil(agora, 0), lt: inicioDoDiaBrasil(agora, 1) },
      },
    });
    return NextResponse.json({ feitas });
  } catch (error) {
    console.error('Erro ao contar provas de hoje:', error);
    return NextResponse.json({ error: 'Erro ao contar' }, { status: 500 });
  }
}
