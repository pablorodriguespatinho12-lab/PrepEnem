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
    // Só o dono escreve: antes qualquer conta sobrescrevia pelo id.
    const { count } = await prisma.userProgress.updateMany({
      where: { id: progressId, userId: (session.user as any).id },
      data: { explicacaoEstudante: String(explicacaoEstudante).slice(0, 4000) },
    });
    if (count === 0) return NextResponse.json({ error: 'Resposta não encontrada' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao salvar explicação' }, { status: 500 });
  }
}
