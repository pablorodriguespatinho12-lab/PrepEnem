export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MODELOS } from '@/data/redacao/modelos';

/* Os temas das redações-modelo entram no banco na primeira listagem. `tema` é
   único no schema e skipDuplicates ignora o que já existe, então duas
   listagens ao mesmo tempo (duas abas) não duplicam nada. */
async function garantirTemasDosModelos(): Promise<void> {
  await prisma.essayTheme.createMany({
    data: MODELOS.map((m) => ({ tema: m.tema, anoEnem: m.anoEnem, textoMotivador: m.contexto })),
    skipDuplicates: true,
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
