export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { gerarQuestoesConferidas } from '@/lib/questoes-geradas';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCycleInfoForDay, getWeekTopics } from '@/lib/schedule-data';
import { getActiveStudyDay } from '@/lib/study-progress';
import { getAbacusApiKey } from '@/lib/ai-client';
import { ordenarPorEtapa } from '@/lib/treino-etapas';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json().catch(() => ({}));
    const { totalQuestoes = 10, materias, weeklySimulado } = body;
    const limit = Math.min(Math.max(totalQuestoes, 10), 180);

    // Semana ativa: explícita no corpo (dashboard já sabe qual é) ou derivada
    // do progresso real do usuário como fallback.
    const planDay = Number.isInteger(body?.weekNumber) && Number.isInteger(body?.dayIndex)
      ? { weekNumber: body.weekNumber, dayIndex: body.dayIndex }
      : await getActiveStudyDay(userId);
    const { weekIndex, daySchedule: todaySchedule } = getCycleInfoForDay(planDay.weekNumber, planDay.dayIndex);
    const isWeeklySimulado = weeklySimulado || todaySchedule?.isSimulado;
    const weekTopics = isWeeklySimulado ? getWeekTopics(weekIndex) : [];
    const weekMaterias = weekTopics.map(t => t.materia);
    const weekSubtemas = weekTopics.flatMap(t => t.subtemas).map(s => s.toLowerCase());

    // Build filter
    const where: any = {};
    if (materias && Array.isArray(materias) && materias.length > 0) {
      where.materia = { in: materias };
    } else if (isWeeklySimulado && weekMaterias.length > 0) {
      where.materia = { in: weekMaterias };
    }

    const allQuestions = await prisma.question.findMany({ where });

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: 'Sem questões disponíveis' }, { status: 404 });
    }

    const shuffle = (arr: any[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    // For weekly simulado, prioritize questions matching this week's subtemas
    let prioritized: any[] = [];
    let others: any[] = [];

    if (isWeeklySimulado && weekSubtemas.length > 0) {
      for (const q of allQuestions) {
        const qSub = (q.subtema ?? '').toLowerCase();
        const qEnun = (q.enunciado ?? '').toLowerCase();
        if (weekSubtemas.some(s => qSub.includes(s) || s.includes(qSub) || qEnun.includes(s))) {
          prioritized.push(q);
        } else {
          others.push(q);
        }
      }
    } else {
      others = allQuestions;
    }

    // Select questions: prioritized first, then others
    let selected: any[] = [];
    const seenIds = new Set<string>();

    // Balance by materia within prioritized
    const byMateria: Record<string, any[]> = {};
    for (const q of shuffle(prioritized)) {
      const m = q.materia;
      if (!byMateria[m]) byMateria[m] = [];
      byMateria[m].push(q);
    }
    const materiaKeys = Object.keys(byMateria);
    if (materiaKeys.length > 0) {
      const perMateria = Math.max(1, Math.floor(limit / materiaKeys.length));
      for (const m of materiaKeys) {
        for (const q of byMateria[m].slice(0, perMateria)) {
          if (!seenIds.has(q.id)) { seenIds.add(q.id); selected.push(q); }
        }
      }
    }

    // Fill with others
    for (const q of shuffle(others)) {
      if (selected.length >= limit) break;
      if (!seenIds.has(q.id)) { seenIds.add(q.id); selected.push(q); }
    }

    // Fill remaining from prioritized overflow
    for (const m of materiaKeys) {
      for (const q of byMateria[m]) {
        if (selected.length >= limit) break;
        if (!seenIds.has(q.id)) { seenIds.add(q.id); selected.push(q); }
      }
    }

    // If still not enough and it's weekly simulado, generate AI questions
    if (selected.length < limit && isWeeklySimulado && weekTopics.length > 0) {
      if (getAbacusApiKey()) {
        const neededPerTopic = Math.ceil((limit - selected.length) / weekTopics.length);
        for (const topic of weekTopics) {
          if (selected.length >= limit) break;
          try {
            const prompt = `Gere ${Math.min(neededPerTopic, 5)} questões modelo ENEM difíceis com 5 alternativas (A-E) sobre ${topic.materia}, especificamente: ${topic.subtemas.join(', ')}.

REGRAS:
- Nível de dificuldade ENEM real (médio a difícil)
- Contexto realista com texto de apoio
- Explicação didática

Retorne JSON: {"questoes":[{"enunciado":"...","alternativaA":"...","alternativaB":"...","alternativaC":"...","alternativaD":"...","alternativaE":"...","respostaCorreta":"A","subtema":"...","dificuldade":"dificil","explicacao":"..."}]}
Retorne SOMENTE JSON válido.`;

            for (const q of await gerarQuestoesConferidas(prompt)) {
                if (selected.length >= limit) break;
                const created = await prisma.question.create({
                  data: {
                    ...q,
                    materia: topic.materia,
                    subtema: q.subtema ?? topic.subtemas[0] ?? 'Geral',
                    dificuldade: q.dificuldade ?? 'dificil',
                    origem: 'IA Gerada',
                    geradaPorIA: true,
                  },
                });
                selected.push(created);
            }
          } catch (e) {
            console.error('Simulado AI generation error:', e);
          }
        }
      }
    }

    // Sorteadas, mas em ordem de degrau: começa pelas fáceis (pedido do Pablo, 06/10/2026).
    selected = ordenarPorEtapa(shuffle(selected).slice(0, limit));

    // Group by area for summary
    const areas: Record<string, number> = {};
    for (const q of selected) {
      areas[q.materia] = (areas[q.materia] ?? 0) + 1;
    }

    return NextResponse.json({
      questions: selected,
      total: selected.length,
      areas,
      isWeeklySimulado,
    });
  } catch (error: any) {
    console.error('Simulado generate error:', error);
    return NextResponse.json({ error: 'Erro ao gerar simulado' }, { status: 500 });
  }
}
