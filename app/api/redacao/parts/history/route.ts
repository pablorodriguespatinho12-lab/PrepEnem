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
    const userId = (session.user as any).id;

    const practices = await prisma.essayPartPractice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Stats by partType
    const stats: Record<string, { total: number; avgNota: number; lastNota: number | null }> = {};
    const byType: Record<string, any[]> = {};
    for (const p of practices) {
      if (!byType[p.partType]) byType[p.partType] = [];
      byType[p.partType].push(p);
    }
    for (const [type, items] of Object.entries(byType)) {
      const withNota = items.filter(i => i.nota != null);
      stats[type] = {
        total: items.length,
        avgNota: withNota.length > 0 ? Math.round(withNota.reduce((s, i) => s + (i.nota ?? 0), 0) / withNota.length * 10) / 10 : 0,
        lastNota: items[0]?.nota ?? null,
      };
    }

    return NextResponse.json({ practices, stats });
  } catch (error: any) {
    console.error('Essay parts history error:', error);
    return NextResponse.json({ error: 'Erro ao carregar histórico' }, { status: 500 });
  }
}
