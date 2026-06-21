export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const partType = searchParams.get('partType');

    const where: any = { isActive: true };
    if (partType) where.partType = partType;

    const templates = await prisma.essayPartTemplate.findMany({
      where,
      select: {
        id: true,
        partType: true,
        tema: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error('Erro ao listar templates:', error);
    return NextResponse.json({ error: 'Erro ao listar templates' }, { status: 500 });
  }
}
