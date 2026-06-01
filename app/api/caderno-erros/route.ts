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
    const { searchParams } = new URL(request.url);
    const materia = searchParams.get('materia');
    const subtema = searchParams.get('subtema');

    // Get ALL attempts for this user's questions (to check latest status)
    const allAttempts = await prisma.userProgress.findMany({
      where: {
        userId,
        ...(materia ? { question: { materia } } : {}),
      },
      include: { question: true },
      orderBy: { dataResposta: 'desc' },
    });

    // Group by question — track latest attempt AND count errors
    const grouped: Record<string, any> = {};
    const latestAttempt: Record<string, { acertou: boolean; date: Date }> = {};

    for (const wa of (allAttempts ?? [])) {
      const qId = wa?.questionId;
      if (!qId) continue;
      if (subtema && wa?.question?.subtema !== subtema) continue;

      // Track the very latest attempt per question
      if (!latestAttempt[qId] || new Date(wa.dataResposta) > latestAttempt[qId].date) {
        latestAttempt[qId] = { acertou: wa.acertou, date: wa.dataResposta };
      }

      // Only count wrong attempts for the error notebook
      if (!wa.acertou) {
        if (!grouped[qId]) {
          grouped[qId] = {
            question: wa.question,
            respostaDada: wa.respostaDada,
            tentativas: wa.tentativas,
            ultimaTentativa: wa.dataResposta,
            dominada: wa.dominada,
            explicacaoEstudante: wa.explicacaoEstudante,
            erros: 1,
          };
        } else {
          grouped[qId].erros++;
          if (new Date(wa.dataResposta) > new Date(grouped[qId].ultimaTentativa)) {
            grouped[qId].respostaDada = wa.respostaDada;
            grouped[qId].ultimaTentativa = wa.dataResposta;
            grouped[qId].dominada = wa.dominada;
            grouped[qId].explicacaoEstudante = wa.explicacaoEstudante;
          }
        }
      }
    }

    // Remove questions where the LATEST attempt was correct (user fixed the error)
    const result = Object.values(grouped).filter((item: any) => {
      const qId = item?.question?.id;
      if (!qId) return false;
      const latest = latestAttempt[qId];
      // Keep only if the latest attempt was wrong
      return latest && !latest.acertou;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Caderno erros error:', error);
    return NextResponse.json({ error: 'Erro ao buscar caderno de erros' }, { status: 500 });
  }
}
