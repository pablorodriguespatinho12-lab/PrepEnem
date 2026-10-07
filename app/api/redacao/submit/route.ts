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
      // `tema` é único no banco: create dava 500 na segunda redação do mesmo tema.
      const newTheme = await prisma.essayTheme.upsert({
        where: { tema: customTema.trim() },
        update: {},
        create: { tema: customTema.trim(), areaConhecimento: 'Tema Livre' },
      });
      finalThemeId = newTheme.id;
    }

    const essay = await prisma.essay.create({
      data: { userId, themeId: finalThemeId, texto: texto.trim(), status: 'pendente' },
    });

    // A correção é pedida pelo navegador logo depois (POST /api/redacao/evaluate).
    // Disparar daqui não funcionava: o fetch servidor→servidor vai sem o cookie
    // de sessão, o evaluate devolvia 401 e a redação ficava "pendente" para sempre.
    return NextResponse.json({ essayId: essay.id, status: 'pendente' });
  } catch (error: any) {
    console.error('Submit essay error:', error);
    return NextResponse.json({ error: 'Erro ao salvar redação' }, { status: 500 });
  }
}
