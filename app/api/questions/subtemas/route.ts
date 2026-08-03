export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const materia = searchParams.get('materia');

    const where: any = {};
    if (materia) where.materia = materia;

    const questions = await prisma.question.findMany({
      where,
      select: { materia: true, subtema: true },
    });

    // Group subtemas by materia
    const grouped: Record<string, string[]> = {};
    for (const q of questions) {
      if (!grouped[q.materia]) grouped[q.materia] = [];
      if (!grouped[q.materia].includes(q.subtema)) {
        grouped[q.materia].push(q.subtema);
      }
    }

    // Also return counts
    const counts: Record<string, Record<string, number>> = {};
    for (const q of questions) {
      if (!counts[q.materia]) counts[q.materia] = {};
      counts[q.materia][q.subtema] = (counts[q.materia][q.subtema] ?? 0) + 1;
    }

    return NextResponse.json({ subtemas: grouped, counts });
  } catch (error: any) {
    console.error('Subtemas error:', error);
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
