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
    const { progressId, explicacaoEstudante } = await request.json();
    if (!progressId || !explicacaoEstudante) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }
    await prisma.userProgress.update({
      where: { id: progressId },
      data: { explicacaoEstudante },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao salvar explicação' }, { status: 500 });
  }
}
