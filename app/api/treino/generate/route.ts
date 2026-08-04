export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCycleInfoForDay } from '@/lib/schedule-data';
import { getActiveStudyDay, upsertStudyProgress } from '@/lib/study-progress';
import { chatCompletion, getAbacusApiKey } from '@/lib/ai-client';


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json().catch(() => ({}));
    const planDay = Number.isInteger(body?.weekNumber) && Number.isInteger(body?.dayIndex)
      ? { weekNumber: body.weekNumber, dayIndex: body.dayIndex }
      : await getActiveStudyDay(userId);

    const { daySchedule: todaySchedule, weekNumber, currentWeek } = getCycleInfoForDay(planDay.weekNumber, planDay.dayIndex);

    await upsertStudyProgress(userId, planDay.weekNumber, planDay.dayIndex, 'em_andamento');

    // Build materia + subtema filters from today's schedule
    const todayMaterias: string[] = [];
    const todaySubtemas: string[] = [];
    if (todaySchedule && todaySchedule.topics.length > 0) {
      for (const topic of todaySchedule.topics) {
        if (!todayMaterias.includes(topic.materia)) todayMaterias.push(topic.materia);
        todaySubtemas.push(...topic.subtemas);
      }
    }
    // Always include Português and Matemática for daily practice
    if (!todayMaterias.includes('Português')) todayMaterias.push('Português');
    if (!todayMaterias.includes('Matemática')) todayMaterias.push('Matemática');

    const filterMaterias = todayMaterias.length > 0 ? todayMaterias : undefined;

    const where: any = {};
    if (filterMaterias) where.materia = { in: filterMaterias };

    const allQuestions = await prisma.question.findMany({ where });
    if ((allQuestions?.length ?? 0) === 0) {
      return NextResponse.json({
        error: 'Sem questões para as matérias de hoje. Importe um PDF ou gere questões com IA no Banco de Questões.',
      }, { status: 404 });
    }

    // Score questions by how well they match today's subtemas
    const subtemaLower = todaySubtemas.map(s => s.toLowerCase());
    function matchesSubtema(q: any): boolean {
      if (subtemaLower.length === 0) return true;
      const qSub = (q.subtema ?? '').toLowerCase();
      const qEnun = (q.enunciado ?? '').toLowerCase();
      return subtemaLower.some(s => qSub.includes(s) || s.includes(qSub) || qEnun.includes(s));
    }

    // Get ALL user progress to check recently answered questions
    const progress = await prisma.userProgress.findMany({
      where: { userId },
      orderBy: { dataResposta: 'desc' },
    });

    const progressMap = new Map<string, { acertou: boolean; tentativas: number; lastDate: Date }>();
    for (const p of (progress ?? [])) {
      if (!progressMap.has(p.questionId)) {
        progressMap.set(p.questionId, { acertou: p.acertou, tentativas: p.tentativas, lastDate: p.dataResposta });
      }
    }

    // Exclude ALL questions answered in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyAnsweredIds = new Set<string>();
    for (const [qId, p] of progressMap) {
      if (p.lastDate > sevenDaysAgo) {
        recentlyAnsweredIds.add(qId);
      }
    }

    // Categorize questions
    const topicMatch: any[] = []; // matches today's subtemas
    const materiaMatch: any[] = []; // right materia but different subtema

    for (const q of allQuestions) {
      if (recentlyAnsweredIds.has(q.id)) continue;
      if (matchesSubtema(q)) topicMatch.push(q);
      else materiaMatch.push(q);
    }

    const shuffle = (arr: any[]) => {
      const a = [...(arr ?? [])];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const sessionSize = 20;

    // Prioritize topic-matching questions, then fill with materia matches
    let selected: any[] = [];
    const seenIds = new Set<string>();

    // First: topic matches (shuffled)
    for (const q of shuffle(topicMatch)) {
      if (selected.length >= sessionSize) break;
      if (!seenIds.has(q.id)) { seenIds.add(q.id); selected.push(q); }
    }

    // Second: same materia but different subtema
    for (const q of shuffle(materiaMatch)) {
      if (selected.length >= sessionSize) break;
      if (!seenIds.has(q.id)) { seenIds.add(q.id); selected.push(q); }
    }

    // If still not enough, auto-generate AI questions for today's topics
    if (selected.length < sessionSize && filterMaterias) {
      if (getAbacusApiKey()) {
        const topicsToGenerate = todaySchedule?.topics ?? [];
        for (const topic of topicsToGenerate) {
          if (selected.length >= sessionSize) break;
          try {
            const subtemasStr = topic.subtemas.join(', ');
            const examples = await prisma.question.findMany({
              where: { materia: topic.materia, origem: { not: 'IA Gerada' } },
              take: 3,
              select: { enunciado: true, alternativaA: true, alternativaB: true, respostaCorreta: true, subtema: true },
            });
            const exampleText = examples.length > 0
              ? `\n\nAPRENDA com estes exemplos reais:\n${examples.map((e, i) => `Exemplo ${i+1}: "${(e.enunciado ?? '').substring(0, 300)}..." (Subtema: ${e.subtema})`).join('\n')}\n\nGere questões no MESMO ESTILO.`
              : '';

            const prompt = `Gere 5 questões objetivas modelo ENEM com 5 alternativas (A-E) sobre ${topic.materia}, ESPECIFICAMENTE sobre: ${subtemasStr}.${exampleText}

REGRAS:
- Questões devem ter contexto real (texto de apoio, situação-problema)
- Alternativas plausíveis e bem elaboradas
- Dificuldade variada (2 fáceis, 2 médias, 1 difícil)
- Explicação didática para cada

Retorne JSON: {"questoes":[{"enunciado":"...","alternativaA":"...","alternativaB":"...","alternativaC":"...","alternativaD":"...","alternativaE":"...","respostaCorreta":"A","subtema":"...","dificuldade":"medio","explicacao":"..."}]}
Retorne SOMENTE JSON válido.`;

            const llmResult = await chatCompletion({
              messages: [{ role: 'user', content: prompt }],
              maxTokens: 8000,
              temperature: 0.7,
              responseFormat: { type: 'json_object' },
            });
            if (llmResult.ok) {
              const raw = llmResult.data?.choices?.[0]?.message?.content ?? '';
              const parsed = JSON.parse(raw);
              const questoes = parsed?.questoes ?? [];
              for (const q of questoes) {
                if (selected.length >= sessionSize) break;
                let resp = (q.respostaCorreta ?? 'A').toUpperCase();
                if (!['A','B','C','D','E'].includes(resp)) resp = 'A';
                const created = await prisma.question.create({
                  data: {
                    enunciado: q.enunciado ?? 'Questão',
                    alternativaA: q.alternativaA ?? 'N/A',
                    alternativaB: q.alternativaB ?? 'N/A',
                    alternativaC: q.alternativaC ?? 'N/A',
                    alternativaD: q.alternativaD ?? 'N/A',
                    alternativaE: q.alternativaE ?? 'N/A',
                    respostaCorreta: resp,
                    materia: topic.materia,
                    subtema: q.subtema ?? topic.subtemas[0] ?? 'Geral',
                    dificuldade: q.dificuldade ?? 'medio',
                    explicacao: q.explicacao ?? null,
                    origem: 'IA Gerada',
                  },
                });
                seenIds.add(created.id);
                selected.push(created);
              }
            }
          } catch (e) {
            console.error('Auto-generate AI questions error for', topic.materia, e);
          }
        }
      }
    }

    // Last resort: recently answered questions
    if (selected.length < sessionSize) {
      const recentPool = shuffle(allQuestions.filter(q => recentlyAnsweredIds.has(q.id) && !seenIds.has(q.id)));
      // Prefer topic-matching recent ones first
      const recentTopic = recentPool.filter(matchesSubtema);
      const recentOther = recentPool.filter(q => !matchesSubtema(q));
      for (const q of [...recentTopic, ...recentOther]) {
        if (selected.length >= sessionSize) break;
        seenIds.add(q.id);
        selected.push(q);
      }
    }

    // Sort: topic matches first, then by difficulty
    const difficultyOrder: Record<string, number> = { facil: 0, medio: 1, dificil: 2 };
    selected.sort((a: any, b: any) => {
      const aMatch = matchesSubtema(a) ? 0 : 1;
      const bMatch = matchesSubtema(b) ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      const da = difficultyOrder[a?.dificuldade ?? 'medio'] ?? 1;
      const db = difficultyOrder[b?.dificuldade ?? 'medio'] ?? 1;
      return da - db;
    });

    // Build schedule info for header
    const scheduleTopics = todaySchedule?.topics.map(t => `${t.materia}: ${t.subtemas.join(', ')}`) ?? [];

    return NextResponse.json({
      questions: selected,
      total: selected.length,
      materias: todayMaterias,
      schedule: todaySchedule ? {
        dayName: todaySchedule.dayName,
        weekNumber,
        dayIndex: planDay.dayIndex,
        weekTitle: currentWeek.weekTitle,
        topics: scheduleTopics,
        manha: todaySchedule.topics.map(t => ({ materia: t.materia, tema: t.subtemas.join(', '), questoes: 20 })),
        trabalho: [
          { materia: 'Português', tema: 'Treino diário', questoes: 20 },
          { materia: 'Matemática', tema: 'Treino diário', questoes: 20 },
        ],
        isSimulado: todaySchedule.isSimulado,
      } : null,
    });
  } catch (error: any) {
    console.error('Generate session error:', error);
    return NextResponse.json({ error: 'Erro ao gerar sessão' }, { status: 500 });
  }
}
