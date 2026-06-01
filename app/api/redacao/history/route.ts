export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const essayId = searchParams.get('id');

    if (essayId) {
      const essay = await prisma.essay.findFirst({
        where: { id: essayId, userId },
        include: { theme: true },
      });
      if (!essay) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
      return NextResponse.json({ essay });
    }

    const essays = await prisma.essay.findMany({
      where: { userId },
      include: { theme: { select: { tema: true, anoEnem: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ essays });
  } catch (error: any) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Erro ao buscar histórico' }, { status: 500 });
  }
}
