export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MODELOS } from '@/data/redacao/modelos';

/* Os temas das redações-modelo entram no banco na primeira listagem. Só
   cria o que falta (por tema), então rodar de novo não duplica nada. */
async function garantirTemasDosModelos(): Promise<void> {
  const existentes = new Set((await prisma.essayTheme.findMany({ select: { tema: true } })).map((t) => t.tema));
  const faltando = MODELOS.filter((m) => !existentes.has(m.tema));
  if (faltando.length === 0) return;
  await prisma.essayTheme.createMany({
    data: faltando.map((m) => ({ tema: m.tema, anoEnem: m.anoEnem, textoMotivador: m.contexto })),
  });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    await garantirTemasDosModelos();
    const themes = await prisma.essayTheme.findMany({ orderBy: { anoEnem: 'desc' } });
    return NextResponse.json({ themes });
  } catch (error: unknown) {
    console.error('Themes error:', error);
    return NextResponse.json({ error: 'Erro ao buscar temas' }, { status: 500 });
  }
}
