export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { weeklySchedule } from '@/lib/schedule-data';
import { getSubtemaLevel } from '@/lib/learning-order';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const todaySchedule = weeklySchedule.find(d => d.dayOfWeek === dayOfWeek);

    const todayMaterias: string[] = [];
    if (todaySchedule) {
      for (const block of [...(todaySchedule.manha ?? []), ...(todaySchedule.trabalho ?? [])]) {
        if (block.materia && !todayMaterias.includes(block.materia)) {
          todayMaterias.push(block.materia);
        }
      }
    }

    const filterMaterias = todayMaterias.length > 0 ? todayMaterias : undefined;

    const where: any = {};
    if (filterMaterias) where.materia = { in: filterMaterias };

    const allQuestions = await prisma.question.findMany({ where });
    if ((allQuestions?.length ?? 0) === 0) {
      return NextResponse.json({
        error: 'Sem questões para as matérias de hoje. Importe um PDF ou gere questões com IA no Banco de Questões.',
      }, { status: 404 });
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

    // Exclude ALL questions answered in the last 7 days (correct OR wrong) to avoid repeats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyAnsweredIds = new Set<string>();
    for (const [qId, p] of progressMap) {
      if (p.lastDate > sevenDaysAgo) {
        recentlyAnsweredIds.add(qId);
      }
    }

    // Categorize questions — prioritize NEVER answered, then old ones
    const unanswered: any[] = [];
    const oldWrong: any[] = []; // answered wrong 7+ days ago
    const oldCorrect: any[] = []; // answered correct 7+ days ago

    for (const q of allQuestions) {
      if (recentlyAnsweredIds.has(q.id)) continue; // skip recent
      const p = progressMap.get(q.id);
      if (!p) unanswered.push(q);
      else if (!p.acertou) oldWrong.push(q);
      else oldCorrect.push(q);
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
    // Reserve slots: 3 easy AI + 3 medium AI = 6 AI slots, 14 for vestibular (hard priority)
    const aiSlots = 6;
    const vestibularSlots = sessionSize - aiSlots;

    // Separate AI-generated vs vestibular (ENEM/imported) questions
    const isAiQuestion = (q: any) => q.origem === 'IA Gerada' || q.origem === 'Elaboração própria';
    const isVestibular = (q: any) => !isAiQuestion(q);

    // Available pool (not recently answered)
    const availablePool = [...unanswered, ...oldWrong, ...oldCorrect];

    // If very few available questions, auto-generate AI questions for today's subjects
    if (availablePool.length < sessionSize && filterMaterias) {
      const apiKey = process.env.ABACUSAI_API_KEY;
      if (apiKey) {
        for (const mat of filterMaterias) {
          try {
            // Get example questions from DB to learn the style
            const examples = await prisma.question.findMany({
              where: { materia: mat, origem: { not: 'IA Gerada' } },
              take: 3,
              select: { enunciado: true, alternativaA: true, alternativaB: true, respostaCorreta: true, subtema: true },
            });
            const exampleText = examples.length > 0
              ? `\n\nAPRENDA com estes exemplos reais de questões ENEM desta matéria:\n${examples.map((e, i) => `Exemplo ${i+1}: "${(e.enunciado ?? '').substring(0, 300)}..." (Subtema: ${e.subtema})`).join('\n')}\n\nGere questões no MESMO ESTILO e NÍVEL destes exemplos.`
              : '';

            const prompt = `Gere 5 questões objetivas modelo ENEM com 5 alternativas (A-E) sobre ${mat}.${exampleText}

REGRAS OBRIGATÓRIAS:
- Questões devem ter contexto real (texto de apoio, situação-problema, dados concretos)
- Alternativas devem ser plausíveis e bem elaboradas
- Nível de dificuldade variado (2 fáceis, 2 médias, 1 difícil)
- Subtemas variados dentro da matéria
- Explicação didática e clara para cada questão

Retorne JSON: {"questoes":[{"enunciado":"...","alternativaA":"...","alternativaB":"...","alternativaC":"...","alternativaD":"...","alternativaE":"...","respostaCorreta":"A","subtema":"...","dificuldade":"medio","explicacao":"..."}]}
Retorne SOMENTE JSON válido.`;

            const llmRes = await fetch('https://apps.abacus.ai/v1/chat/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
              body: JSON.stringify({
                model: 'gpt-5.4-mini',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 8000,
                temperature: 0.7,
                response_format: { type: 'json_object' },
              }),
            });
            if (llmRes.ok) {
              const llmData = await llmRes.json();
              const raw = llmData?.choices?.[0]?.message?.content ?? '';
              const parsed = JSON.parse(raw);
              const questoes = parsed?.questoes ?? [];
              for (const q of questoes) {
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
                    materia: mat,
                    subtema: q.subtema ?? 'Geral',
                    dificuldade: q.dificuldade ?? 'medio',
                    explicacao: q.explicacao ?? null,
                    origem: 'IA Gerada',
                  },
                });
                unanswered.push(created);
              }
            }
          } catch (e) {
            console.error('Auto-generate AI questions error for', mat, e);
          }
        }
      }
    }

    // Select AI questions: 3 easy + 3 medium
    const aiUnanswered = shuffle(unanswered.filter(isAiQuestion));
    const aiOldWrong = shuffle(oldWrong.filter(isAiQuestion));
    const aiOldCorrect = shuffle(oldCorrect.filter(isAiQuestion));
    const aiPool = [...aiUnanswered, ...aiOldWrong, ...aiOldCorrect];
    const aiEasy = aiPool.filter(q => q.dificuldade === 'facil').slice(0, 3);
    const aiMedium = aiPool.filter(q => q.dificuldade === 'medio').slice(0, 3);
    let aiSelected = [...aiEasy, ...aiMedium];

    // Fill remaining AI slots if not enough
    if (aiSelected.length < aiSlots) {
      const aiIds = new Set(aiSelected.map(q => q.id));
      const morAi = aiPool.filter(q => !aiIds.has(q.id)).slice(0, aiSlots - aiSelected.length);
      aiSelected.push(...morAi);
    }

    // Select vestibular questions: prioritize unanswered first
    const vestUnanswered = shuffle(unanswered.filter(isVestibular));
    const vestOldWrong = shuffle(oldWrong.filter(isVestibular));
    const vestOldCorrect = shuffle(oldCorrect.filter(isVestibular));

    let vestSelected: any[] = [];
    const aiIds = new Set(aiSelected.map(q => q.id));

    // Balanced per materia for vestibular
    const perMateria = Math.max(1, Math.floor(vestibularSlots / Math.max(1, todayMaterias.length)));
    for (const mat of todayMaterias) {
      const matUnanswered = vestUnanswered.filter(q => q.materia === mat);
      const matOldWrong = vestOldWrong.filter(q => q.materia === mat);
      const matOldCorrect = vestOldCorrect.filter(q => q.materia === mat);
      const matSelected: any[] = [];
      // Prioritize unanswered, then old wrong, then old correct
      matSelected.push(...matUnanswered.slice(0, perMateria));
      const rem1 = perMateria - matSelected.length;
      if (rem1 > 0) matSelected.push(...matOldWrong.slice(0, rem1));
      const rem2 = perMateria - matSelected.length;
      if (rem2 > 0) matSelected.push(...matOldCorrect.slice(0, rem2));
      vestSelected.push(...matSelected);
    }

    // Fill remaining vestibular slots
    if (vestSelected.length < vestibularSlots) {
      const vestIds = new Set(vestSelected.map(q => q.id));
      const moreVest = shuffle([...vestUnanswered, ...vestOldWrong, ...vestOldCorrect])
        .filter(q => !vestIds.has(q.id) && !aiIds.has(q.id))
        .slice(0, vestibularSlots - vestSelected.length);
      vestSelected.push(...moreVest);
    }

    // Combine and deduplicate
    let selected = [...aiSelected, ...vestSelected];
    const seenIds = new Set<string>();
    selected = selected.filter(q => {
      if (!q?.id || seenIds.has(q.id)) return false;
      seenIds.add(q.id);
      return true;
    }).slice(0, sessionSize);

    // If still not enough (all questions exhausted), allow recently answered as last resort
    if (selected.length < sessionSize) {
      const recentPool = shuffle(allQuestions.filter(q => recentlyAnsweredIds.has(q.id) && !seenIds.has(q.id)));
      for (const q of recentPool) {
        if (selected.length >= sessionSize) break;
        seenIds.add(q.id);
        selected.push(q);
      }
    }

    // Sort: easy AI first, then medium AI, then vestibular by difficulty
    const difficultyOrder: Record<string, number> = { facil: 0, medio: 1, dificil: 2 };
    selected.sort((a: any, b: any) => {
      const aIsAi = isAiQuestion(a) ? 0 : 1;
      const bIsAi = isAiQuestion(b) ? 0 : 1;
      if (aIsAi !== bIsAi) return aIsAi - bIsAi;
      const levelA = getSubtemaLevel(a?.materia ?? '', a?.subtema ?? '');
      const levelB = getSubtemaLevel(b?.materia ?? '', b?.subtema ?? '');
      if (levelA !== levelB) return levelA - levelB;
      const da = difficultyOrder[a?.dificuldade ?? 'medio'] ?? 1;
      const db = difficultyOrder[b?.dificuldade ?? 'medio'] ?? 1;
      return da - db;
    });

    return NextResponse.json({
      questions: selected,
      total: selected.length,
      materias: todayMaterias,
      schedule: todaySchedule ? {
        dayName: todaySchedule.dayName,
        manha: todaySchedule.manha,
        trabalho: todaySchedule.trabalho,
      } : null,
    });
  } catch (error: any) {
    console.error('Generate session error:', error);
    return NextResponse.json({ error: 'Erro ao gerar sessão' }, { status: 500 });
  }
}
