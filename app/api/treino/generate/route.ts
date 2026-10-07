export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCycleInfoForDay, studyCycle } from '@/lib/schedule-data';
import { getActiveStudyDay, upsertStudyProgress } from '@/lib/study-progress';
import { chatCompletion, getAbacusApiKey } from '@/lib/ai-client';
import { cotasDoDia, etapaDaQuestao, isQuestaoEnem, montarEscada } from '@/lib/treino-etapas';
import { degrausDasAncoras } from '@/lib/treino-degraus';
// Quantas questões do ENEM viram bloco com degraus por sessão. Cada bloco tem
// ~7 questões (5 degraus + a do ENEM + 1 de nível acima): 2 blocos deixam
// espaço para o aquecimento.
const MAX_ANCORAS = 2;
/* Uma âncora por matéria antes de repetir — hoje a escolha roda dentro de uma matéria só. */
function escolherAncoras<T extends { materia: string }>(candidatas: T[], max: number): T[] {
  const primeiras = candidatas.filter((q, i) => candidatas.findIndex((c) => c.materia === q.materia) === i);
  const resto = candidatas.filter((q) => !primeiras.includes(q));
  return [...primeiras, ...resto].slice(0, max);
}


/* A última questão do dia é real de vestibular (ITA, IME, Fuvest, Unicamp,
   Unesp; data/vestibular), de uma exata do dia. Prefere a nunca respondida;
   se todas já foram, volta a mais antiga. Pedido do Pablo, 06/10/2026. */
const EXATAS = ['Matemática', 'Física', 'Química'];
async function questaoVestibularDoDia(materias: string[], ultimaResposta: Map<string, Date>) {
  const doDia = materias.filter((m) => EXATAS.includes(m));
  if (doDia.length === 0) return null;
  const candidatas = await prisma.question.findMany({ where: { nivel: 'vestibular', materia: { in: doDia } } });
  if (candidatas.length === 0) return null;
  const nunca = candidatas.filter((q) => !ultimaResposta.has(q.id));
  if (nunca.length > 0) return nunca[Math.floor(Math.random() * nunca.length)];
  return [...candidatas].sort((a, b) => ultimaResposta.get(a.id)!.getTime() - ultimaResposta.get(b.id)!.getTime())[0];
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json().catch(() => ({}));
    // Dia do plano vindo da URL só vale se existir no ciclo; senão, o dia ativo.
    const diaValido = Number.isInteger(body?.weekNumber) && Number.isInteger(body?.dayIndex)
      && body.weekNumber >= 1 && body.weekNumber <= studyCycle.length && body.dayIndex >= 0 && body.dayIndex <= 6;
    const planDay = diaValido
      ? { weekNumber: body.weekNumber, dayIndex: body.dayIndex }
      : await getActiveStudyDay(userId);

    const { daySchedule: todaySchedule, weekNumber, currentWeek } = getCycleInfoForDay(planDay.weekNumber, planDay.dayIndex);

    await upsertStudyProgress(userId, planDay.weekNumber, planDay.dayIndex, 'em_andamento');

    // Treino do dia: uma matéria por vez, com cota própria (lib/treino-etapas.ts).
    const topicos = todaySchedule?.topics ?? [];
    const todayMaterias = Array.from(new Set(topicos.map((t) => t.materia)));
    const cotas = cotasDoDia(todayMaterias);
    // Respostas do usuário, uma vez só para todas as matérias.
    const progress = await prisma.userProgress.findMany({
      where: { userId },
      orderBy: { dataResposta: 'desc' },
    });
    const ultimaResposta = new Map<string, Date>();
    for (const p of progress ?? []) if (!ultimaResposta.has(p.questionId)) ultimaResposta.set(p.questionId, p.dataResposta);
    // Respondida nos últimos 7 dias só entra se faltar questão.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyAnsweredIds = new Set(Array.from(ultimaResposta).filter(([, d]) => d > sevenDaysAgo).map(([id]) => id));
    const shuffle = (arr: any[]) => {
      const a = [...(arr ?? [])];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    /* A escada de uma matéria: aquecimento (base, intermediária), blocos-âncora
       (degraus → questão do ENEM → nível acima) e ENEM avulsa no fim. */
    async function montarMateria(materia: string, sessionSize: number): Promise<any[]> {
      const topicosDaMateria = topicos.filter((t) => t.materia === materia);
      const subtemaLower = topicosDaMateria.flatMap((t) => t.subtemas).map((s) => s.toLowerCase());
      const matchesSubtema = (q: any): boolean => {
        if (subtemaLower.length === 0) return true;
        const qSub = (q.subtema ?? '').toLowerCase();
        const qEnun = (q.enunciado ?? '').toLowerCase();
        return subtemaLower.some((s) => qSub.includes(s) || (qSub.length > 0 && s.includes(qSub)) || qEnun.includes(s));
      };
      // Degraus (ancoraId) só entram junto da própria questão do ENEM, nunca soltos.
      const allQuestions = await prisma.question.findMany({ where: { ancoraId: null, materia } });
      const topicMatch: any[] = [];
      const materiaMatch: any[] = [];
      for (const q of allQuestions) {
        if (recentlyAnsweredIds.has(q.id)) continue;
        if (matchesSubtema(q)) topicMatch.push(q);
        else materiaMatch.push(q);
      }
      // Âncora exige o assunto no subtema/tema, não só uma palavra no enunciado:
      // "mol" no enunciado casava com "g/mol" de uma questão de titulação.
      const assuntoNoSubtema = (q: any) => {
        const rotulo = `${q.subtema ?? ''} ${q.tema ?? ''}`.toLowerCase();
        return subtemaLower.some((s) => rotulo.includes(s));
      };
      // Cada bloco tem ~7 questões: na matéria de 10, um bloco só cabe.
      const maxAncoras = sessionSize >= 20 ? MAX_ANCORAS : 1;
      const ancoras = escolherAncoras(shuffle(topicMatch.filter((q) => isQuestaoEnem(q) && assuntoNoSubtema(q))), maxAncoras);
      const degraus = await degrausDasAncoras(ancoras);
      const blocos = ancoras
        .filter((a) => (degraus.get(a.id) ?? []).some((q) => q.nivel !== 'acima'))
        .map((a) => {
          const qs = degraus.get(a.id) ?? [];
          return [...qs.filter((q) => q.nivel !== 'acima'), a, ...qs.filter((q) => q.nivel === 'acima')];
        });
      const idsBlocos = new Set(blocos.flat().map((q) => q.id));
      const complemento = montarEscada(
        shuffle(topicMatch.filter((q) => !idsBlocos.has(q.id))),
        shuffle(materiaMatch),
        Math.max(0, sessionSize - idsBlocos.size),
      );
      let selected: any[] = [
        ...complemento.filter((q) => etapaDaQuestao(q) !== 'enem'),
        ...blocos.flat(),
        ...complemento.filter((q) => etapaDaQuestao(q) === 'enem'),
      ];
      const seenIds = new Set<string>(selected.map((q) => q.id));
      const geradasIA: any[] = [];
      // Faltou questão do conteúdo do dia: a IA gera, só para a matéria do cronograma.
      if (selected.length < sessionSize && getAbacusApiKey()) {
        for (const topic of topicosDaMateria) {
          if (selected.length + geradasIA.length >= sessionSize) break;
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
                  if (selected.length + geradasIA.length >= sessionSize) break;
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
                  geradasIA.push(created);
                }
              }
          } catch (e) {
            console.error('Auto-generate AI questions error for', topic.materia, e);
          }
        }
      }
      // O que faltar (geradas agora e, em último caso, respondidas nos últimos
      // 7 dias) entra na escada sem quebrar os blocos-âncora.
      const recentes = shuffle(allQuestions.filter((q) => recentlyAnsweredIds.has(q.id) && !seenIds.has(q.id)));
      const extras = montarEscada(
        [...geradasIA, ...recentes.filter(matchesSubtema)],
        recentes.filter((q) => !matchesSubtema(q)),
        Math.max(0, sessionSize - selected.length),
      );
      selected = [
        ...extras.filter((q) => etapaDaQuestao(q) !== 'enem'),
        ...selected,
        ...extras.filter((q) => etapaDaQuestao(q) === 'enem'),
      ];
      return selected;
    }
    // Em paralelo: a geração de degraus por IA de uma matéria não segura as outras.
    const porMateria = await Promise.all(cotas.map((c) => montarMateria(c.materia, c.quantidade)));
    const vestibular = await questaoVestibularDoDia(cotas.map((c) => c.materia), ultimaResposta);
    const selected = [...porMateria.flat(), ...(vestibular ? [vestibular] : [])];
    if (selected.length === 0) {
      return NextResponse.json({
        error: 'Sem questões para as matérias de hoje. Importe um PDF ou gere questões com IA no Banco de Questões.',
      }, { status: 404 });
    }
    // Build schedule info for header
    const scheduleTopics = todaySchedule?.topics.map(t => `${t.materia}: ${t.subtemas.join(', ')}`) ?? [];

    return NextResponse.json({
      questions: selected,
      total: selected.length,
      materias: todayMaterias,
      // O resumo de revisão cobre o conteúdo do cronograma, não o subtema de
      // cada questão sorteada (as do ENEM trazem subtemas soltos).
      revisao: (todaySchedule?.topics ?? []).flatMap((t) => t.subtemas.map((subtema) => ({ materia: t.materia, subtema }))),
      schedule: todaySchedule ? {
        dayName: todaySchedule.dayName,
        weekNumber,
        dayIndex: planDay.dayIndex,
        weekTitle: currentWeek.weekTitle,
        topics: scheduleTopics,
        manha: todaySchedule.topics.map(t => ({ materia: t.materia, tema: t.subtemas.join(', '), questoes: cotas.find((c) => c.materia === t.materia)?.quantidade ?? 0 })),
        trabalho: cotas.filter((c) => !todayMaterias.includes(c.materia)).map((c) => ({ materia: c.materia, tema: 'Treino diário', questoes: c.quantidade })),
        isSimulado: todaySchedule.isSimulado,
      } : null,
    });
  } catch (error: any) {
    console.error('Generate session error:', error);
    return NextResponse.json({ error: 'Erro ao gerar sessão' }, { status: 500 });
  }
}
