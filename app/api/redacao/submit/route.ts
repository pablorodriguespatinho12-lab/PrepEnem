export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const userId = (session.user as any).id;
    const { themeId, customTema, texto } = await req.json();

    if (!texto || texto.trim().length < 50) {
      return NextResponse.json({ error: 'Texto muito curto (mínimo 50 caracteres)' }, { status: 400 });
    }
    if (!themeId && !customTema) {
      return NextResponse.json({ error: 'Selecione um tema ou digite um tema livre' }, { status: 400 });
    }

    let finalThemeId = themeId;

    // If custom theme, create an EssayTheme record on the fly
    if (!themeId && customTema) {
      const newTheme = await prisma.essayTheme.create({
        data: { tema: customTema.trim(), areaConhecimento: 'Tema Livre' },
      });
      finalThemeId = newTheme.id;
    }

    const essay = await prisma.essay.create({
      data: { userId, themeId: finalThemeId, texto: texto.trim(), status: 'pendente' },
    });

    // Trigger evaluation in background (non-blocking)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    fetch(`${baseUrl}/api/redacao/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ essayId: essay.id }),
    }).catch(e => console.error('Background eval trigger error:', e));

    return NextResponse.json({ essayId: essay.id, status: 'pendente' });
  } catch (error: any) {
    console.error('Submit essay error:', error);
    return NextResponse.json({ error: 'Erro ao salvar redação' }, { status: 500 });
  }
}
