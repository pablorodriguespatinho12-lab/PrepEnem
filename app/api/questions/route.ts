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
    const ids = searchParams.get('ids');
    const materia = searchParams.get('materia');
    const dificuldade = searchParams.get('dificuldade');
    const where: any = {};

    if (ids) {
      // Fetch specific questions by IDs
      const idList = ids.split(',').filter(Boolean);
      const questions = await prisma.question.findMany({
        where: { id: { in: idList } },
      });
      return NextResponse.json({ questions });
    }

    if (materia) where.materia = materia;
    if (dificuldade) where.dificuldade = dificuldade;
    const questions = await prisma.question.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(questions);
  } catch (error: any) {
    console.error('Get questions error:', error);
    return NextResponse.json({ error: 'Erro ao buscar questões' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    const body = await request.json();
    const question = await prisma.question.create({ data: body });
    return NextResponse.json(question);
  } catch (error: any) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: 'Erro ao criar questão' }, { status: 500 });
  }
}
