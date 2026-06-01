export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { respostas, timerUsed, tempoGasto } = await req.json();
    // respostas: Array<{ questionId, respostaDada }>

    if (!Array.isArray(respostas) || respostas.length === 0) {
      return NextResponse.json({ error: 'Nenhuma resposta enviada' }, { status: 400 });
    }

    // Fetch all questions at once
    const questionIds = respostas.map((r: any) => r.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
    });
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let totalCorrect = 0;
    let totalWrong = 0;
    const porMateria: Record<string, { total: number; corretas: number; erradas: number }> = {};
    const porSubtema: Record<string, { total: number; corretas: number }> = {};
    const detalhes: any[] = [];
    const errosParaReforco: any[] = [];

    for (const r of respostas) {
      const q = questionMap.get(r.questionId);
      if (!q) continue;

      const acertou = r.respostaDada === q.respostaCorreta;
      if (acertou) totalCorrect++;
      else totalWrong++;

      // Per materia
      if (!porMateria[q.materia]) porMateria[q.materia] = { total: 0, corretas: 0, erradas: 0 };
      porMateria[q.materia].total++;
      if (acertou) porMateria[q.materia].corretas++;
      else porMateria[q.materia].erradas++;

      // Per subtema
      const subKey = `${q.materia} - ${q.subtema}`;
      if (!porSubtema[subKey]) porSubtema[subKey] = { total: 0, corretas: 0 };
      porSubtema[subKey].total++;
      if (acertou) porSubtema[subKey].corretas++;

      detalhes.push({
        questionId: q.id,
        materia: q.materia,
        subtema: q.subtema,
        enunciado: q.enunciado.substring(0, 100) + '...',
        respostaDada: r.respostaDada,
        respostaCorreta: q.respostaCorreta,
        acertou,
      });

      if (!acertou) {
        errosParaReforco.push({
          materia: q.materia,
          subtema: q.subtema,
          questionId: q.id,
        });
      }

      // Save progress
      await prisma.userProgress.create({
        data: {
          userId,
          questionId: q.id,
          acertou,
          respostaDada: r.respostaDada,
        },
      });

      // Schedule review for wrong answers
      if (!acertou) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await prisma.reviewSchedule.create({
          data: {
            userId,
            questionId: q.id,
            proximaRevisao: tomorrow,
            intervaloAtual: 1,
          },
        });
      }
    }

    const taxa = respostas.length > 0 ? Math.round((totalCorrect / respostas.length) * 100) : 0;

    // Determine materias to reinforce (< 60% correct)
    const materiasReforcar = Object.entries(porMateria)
      .filter(([_, v]) => v.total > 0 && (v.corretas / v.total) < 0.6)
      .map(([m, v]) => ({ materia: m, taxa: Math.round((v.corretas / v.total) * 100) }));

    return NextResponse.json({
      totalQuestoes: respostas.length,
      totalCorretas: totalCorrect,
      totalErradas: totalWrong,
      taxaAcerto: taxa,
      timerUsed,
      tempoGasto,
      porMateria,
      porSubtema,
      detalhes,
      materiasReforcar,
      errosParaReforco,
    });
  } catch (error: any) {
    console.error('Simulado submit error:', error);
    return NextResponse.json({ error: 'Erro ao processar simulado' }, { status: 500 });
  }
}
