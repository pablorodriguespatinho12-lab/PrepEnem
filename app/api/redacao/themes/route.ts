export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const themes = await prisma.essayTheme.findMany({ orderBy: { anoEnem: 'desc' } });
    return NextResponse.json({ themes });
  } catch (error: any) {
    console.error('Themes error:', error);
    return NextResponse.json({ error: 'Erro ao buscar temas' }, { status: 500 });
  }
}
