export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const allProgress = await prisma.userProgress.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { dataResposta: 'desc' },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const totalRespondidas = allProgress?.length ?? 0;
    const totalAcertos = (allProgress ?? []).filter((p: any) => p?.acertou).length;
    const taxaAcerto = totalRespondidas > 0 ? Math.round((totalAcertos / totalRespondidas) * 100) : 0;

    // By subject
    const byMateria: Record<string, { total: number; acertos: number }> = {};
    for (const p of (allProgress ?? [])) {
      const m = p?.question?.materia ?? 'Outros';
      if (!byMateria[m]) byMateria[m] = { total: 0, acertos: 0 };
      byMateria[m].total++;
      if (p?.acertou) byMateria[m].acertos++;
    }

    // By subtema
    const bySubtema: Record<string, { total: number; acertos: number; materia: string }> = {};
    for (const p of (allProgress ?? [])) {
      const s = p?.question?.subtema ?? 'Outros';
      const m = p?.question?.materia ?? 'Outros';
      if (!bySubtema[s]) bySubtema[s] = { total: 0, acertos: 0, materia: m };
      bySubtema[s].total++;
      if (p?.acertou) bySubtema[s].acertos++;
    }

    // Last 30 days evolution
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentProgress = (allProgress ?? []).filter(
      (p: any) => new Date(p?.dataResposta) >= thirtyDaysAgo
    );
    const dailyData: Record<string, { total: number; acertos: number }> = {};
    for (const p of recentProgress) {
      const day = new Date(p?.dataResposta).toISOString().split('T')[0];
      if (!dailyData[day]) dailyData[day] = { total: 0, acertos: 0 };
      dailyData[day].total++;
      if (p?.acertou) dailyData[day].acertos++;
    }

    // Pending reviews count
    const now = new Date();
    const pendingReviews = await prisma.reviewSchedule.count({
      where: { userId, completada: false, proximaRevisao: { lte: now } },
    });

    // Dominant vs weak subjects
    const dominadas: string[] = [];
    const reforcar: string[] = [];
    for (const [m, data] of Object.entries(byMateria)) {
      const rate = data.total > 0 ? (data.acertos / data.total) * 100 : 0;
      if (rate >= 70 && data.total >= 3) dominadas.push(m);
      else if (rate < 50 && data.total >= 2) reforcar.push(m);
    }

    // Essay part practice stats
    const essayParts = await prisma.essayPartPractice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const essayPartStats: Record<string, { total: number; avgNota: number; lastNota: number | null }> = {};
    const byPartType: Record<string, any[]> = {};
    for (const p of (essayParts ?? [])) {
      if (!byPartType[p.partType]) byPartType[p.partType] = [];
      byPartType[p.partType].push(p);
    }
    for (const [type, items] of Object.entries(byPartType)) {
      const withNota = items.filter(i => i.nota != null);
      essayPartStats[type] = {
        total: items.length,
        avgNota: withNota.length > 0 ? Math.round(withNota.reduce((s, i) => s + (i.nota ?? 0), 0) / withNota.length * 10) / 10 : 0,
        lastNota: items[0]?.nota ?? null,
      };
    }

    return NextResponse.json({
      totalRespondidas,
      totalAcertos,
      taxaAcerto,
      streakDays: user?.streakDays ?? 0,
      byMateria,
      bySubtema,
      dailyData,
      pendingReviews,
      dominadas,
      reforcar,
      essayPartStats,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
