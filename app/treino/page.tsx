'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { PaginaDaProva } from '@/components/pagina-da-prova';
import {
  BookOpen, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertTriangle,
  Loader2, RefreshCcw, Home, Send, Sparkles, Trophy,
  GraduationCap, Play, Eye, EyeOff,
  Check, X, Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';
import { fireConfetti, spawnCorrectParticles, flashScreen } from '@/components/animations';
import { ImagemIndisponivel } from '@/components/pdf-page-viewer';
import { ETAPA_LABEL, ehExemploResolvido, etapaDaQuestao } from '@/lib/treino-etapas';
import { ExplicacaoTutor } from '@/components/tutor/explicacao-tutor';
import { TextoCompleto } from '@/components/tutor/texto-completo';
// Só carrega as 48 resoluções quando a questão do dia é de vestibular.
const ResolucaoClicavel = dynamic(() => import('@/components/vestibular/resolucao-clicavel'), { ssr: false });
import { ConceitosDoDia } from '@/components/treino/conceitos-do-dia';
import type { ResumoAssunto } from '@/lib/tutor/resumo';
import { playSound } from '@/lib/sounds';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });
const Results3DScene = dynamic(() => import('@/components/results-3d-scene'), { ssr: false });

export default function TreinoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams?.get('mode') ?? 'normal';
  const isReview = mode === 'review';
  const isFiltered = mode === 'filtered';
  const isErrosReview = mode === 'erros';
  const filterMateria = searchParams?.get('materia') ?? '';
  const filterSubtema = searchParams?.get('subtema') ?? '';
  const errosQuestionIds = searchParams?.get('questionIds') ?? '';
  const planWeekNumberParam = searchParams?.get('weekNumber');
  const planDayIndexParam = searchParams?.get('dayIndex');
  const shouldReduceMotion = useReducedMotion();
  const [planDay, setPlanDay] = useState<{ weekNumber: number; dayIndex: number } | null>(
    planWeekNumberParam && planDayIndexParam
      ? { weekNumber: Number(planWeekNumberParam), dayIndex: Number(planDayIndexParam) }
      : null
  );

  const markStudyProgress = useCallback((status: 'em_andamento' | 'concluido', day?: { weekNumber: number; dayIndex: number } | null) => {
    const target = day ?? planDay;
    if (!target) return;
    fetch('/api/study-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...target, status }),
    }).catch(() => {});
  }, [planDay]);

  const [questions, setQuestions] = useState<any[]>([]);
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const [feynmanText, setFeynmanText] = useState('');
  const [streak, setStreak] = useState(0);
  const [errosRound, setErrosRound] = useState(1);
  const [errosWrongIds, setErrosWrongIds] = useState<string[]>([]);

  // Resumo (pre-training review) state
  const [showResumo, setShowResumo] = useState(false);
  const [resumoData, setResumoData] = useState<ResumoAssunto[]>([]);
  const [resumoLoading, setResumoLoading] = useState(false);
  const [resumoDismissed, setResumoDismissed] = useState(false);
  const [sessionMaterias, setSessionMaterias] = useState<string[]>([]);
  const [sessionSchedule, setSessionSchedule] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [restoredSession, setRestoredSession] = useState(false);

  // Save session to server
  const saveSessionProgress = useCallback(async (sId: string, idx: number, sc: { correct: number; wrong: number }, qId?: string, resp?: string, fin?: boolean) => {
    try {
      await fetch('/api/treino/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sId,
          currentIdx: idx,
          correct: sc.correct,
          wrong: sc.wrong,
          questionId: qId,
          respostaDada: resp,
          finished: fin,
        }),
      });
    } catch (e) {
      console.error('Save session error:', e);
    }
  }, []);

  // `recomecar`: monta uma sessão nova do zero. Sem isso o
  // botão de reiniciar só restaurava a mesma sessão, na mesma questão.
  // Resumo já pedido e ainda sem resposta. O efeito que monta a sessão roda duas
  // vezes no modo de desenvolvimento do React: eram dois pedidos iguais à IA,
  // o dobro da cota por minuto e um 429 no segundo (visto em 05/10/2026).
  const resumoEmCursoRef = useRef<string | null>(null);
  const startSession = useCallback(async (recomecar = false) => {
    setLoading(true);
    setSelected(null);
    setAnswered(false);
    setResult(null);
    setAnswerError(null);
    setStreak(0);
    try {
      let loadedQs: any[] = [];
      let revisaoDoDia: { materia: string; subtema: string }[] = [];

      if (isErrosReview && errosQuestionIds) {
        // Load specific questions for error review loop
        const ids = errosQuestionIds.split(',').filter(Boolean);
        if (ids.length === 0) {
          toast.info('Nenhuma questão para revisar!');
          setQuestions([]);
          setSessionStarted(true);
          setLoading(false);
          return;
        }
        const res = await fetch('/api/questions?ids=' + ids.join(','));
        const resData = await res.json();
        loadedQs = resData?.questions ?? [];
        setQuestions(loadedQs);
        setErrosRound(1);
        setErrosWrongIds([]);
      } else if (isReview) {
        const res = await fetch('/api/review');
        const resData = await res.json();
        if ((resData?.reviews?.length ?? 0) === 0) {
          toast.info('Nenhuma revisão pendente!');
          setQuestions([]);
          setSessionStarted(true);
          setLoading(false);
          return;
        }
        setReviewData(resData.reviews);
        loadedQs = (resData.reviews ?? []).map((r: any) => r?.question);
        setQuestions(loadedQs);
      } else if (isFiltered) {
        const res = await fetch('/api/treino/filtered', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ materia: filterMateria, subtema: filterSubtema, quantidade: 20 }),
        });
        const resData = await res.json();
        loadedQs = resData?.questions ?? [];
        setQuestions(loadedQs);
      } else {
        // Recomeçar pula a restauração; o POST da sessão nova fecha a antiga.
        const activeRes = recomecar ? null : await fetch('/api/treino/session');
        const activeData = activeRes ? await activeRes.json() : null;

        if (activeData?.session && !activeData.session.finished) {
          // Restore existing session
          const s = activeData.session;
          loadedQs = s.questions ?? [];
          setQuestions(loadedQs);
          setSessionId(s.id);

          // Find first unanswered question
          // Primeira sem resposta, a partir de onde parou e depois do começo.
          // Sem nenhuma pendente (respondeu a última e fechou), a sessão acabou:
          // antes reabria uma respondida, que aceitava resposta de novo e
          // contava o acerto duas vezes.
          const inicio = s.currentIdx ?? 0;
          const pendentes = loadedQs.map((q: any, i: number) => (q?.answered ? -1 : i)).filter((i: number) => i >= 0);
          const restoreIdx = pendentes.find((i: number) => i >= inicio) ?? pendentes[0];
          if (restoreIdx === undefined) {
            setCurrentIdx(Math.max(loadedQs.length - 1, 0));
            setFinished(true);
            saveSessionProgress(s.id, loadedQs.length - 1, { correct: s.correct ?? 0, wrong: s.wrong ?? 0 }, undefined, undefined, true);
          } else {
            setCurrentIdx(restoreIdx);
          }
          setScore({ correct: s.correct ?? 0, wrong: s.wrong ?? 0 });
          markStudyProgress(restoreIdx === undefined ? 'concluido' : 'em_andamento');
          setRestoredSession(true);
          setSessionStarted(true);
          setResumoDismissed(true); // Skip resumo on restore
          setShowResumo(false);
          setLoading(false);
          const answeredCount = (s.correct ?? 0) + (s.wrong ?? 0);
          if (answeredCount > 0) {
            toast.info(`Sessão restaurada! ${answeredCount} de ${loadedQs.length} questões respondidas.`);
          }
          return;
        }

        // No active session, generate new one
        const res = await fetch('/api/treino/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(planDay ?? {}),
        });
        const resData = await res.json();
        loadedQs = resData?.questions ?? [];
        revisaoDoDia = resData?.revisao ?? [];
        setQuestions(loadedQs);
        if (resData?.materias) setSessionMaterias(resData.materias);
        if (resData?.schedule) {
          setSessionSchedule(resData.schedule);
          // Servidor pode ter resolvido o dia do plano sozinho (ex: sessão
          // sem weekNumber/dayIndex explícitos na URL) — guarda pra saber
          // qual dia marcar como concluído ao final da sessão.
          const resolvedDay = { weekNumber: resData.schedule.weekNumber, dayIndex: resData.schedule.dayIndex };
          setPlanDay(resolvedDay);
          markStudyProgress('em_andamento', resolvedDay);
        }

        // Create persistent session
        if (loadedQs.length > 0) {
          const createRes = await fetch('/api/treino/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionIds: loadedQs.map((q: any) => q.id), mode: 'normal' }),
          });
          const createData = await createRes.json();
          if (createData?.sessionId) setSessionId(createData.sessionId);
        }
      }

      setSessionStarted(true);
      setCurrentIdx(0);
      setScore({ correct: 0, wrong: 0 });
      setFinished(false);
      setResumoDismissed(false);

      // After loading questions, trigger resumo generation (non-blocking)
      if (loadedQs.length > 0 && !isReview && !isErrosReview) {
        setShowResumo(true);
        const subtemaMap = new Map<string, { materia: string; subtema: string }>();
        for (const r of revisaoDoDia) subtemaMap.set(`${r.materia}::${r.subtema}`, r);
        for (const q of revisaoDoDia.length > 0 ? [] : loadedQs) {
          const key = `${q?.materia}::${q?.subtema}`;
          if (!subtemaMap.has(key) && q?.materia && q?.subtema) {
            subtemaMap.set(key, { materia: q.materia, subtema: q.subtema });
          }
        }
        const subtemas = Array.from(subtemaMap.values()).slice(0, 8);
        const chaveResumo = JSON.stringify(subtemas);
        if (resumoEmCursoRef.current === chaveResumo) return;
        resumoEmCursoRef.current = chaveResumo;
        setResumoLoading(true);
        fetch('/api/treino/resumo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subtemas }),
        })
          .then((r) => r.json())
          .then((d) => {
            // IA fora do ar devolve {error}; sem isso a tela ficava com a lista vazia.
            if ((d?.resumos?.length ?? 0) === 0) {
              toast.error('Resumo indisponível agora. Começando pelas questões.');
              setResumoDismissed(true);
              return;
            }
            setResumoData(d.resumos);
          })
          .catch(() => toast.error('Erro ao carregar resumo'))
          .finally(() => {
            resumoEmCursoRef.current = null;
            setResumoLoading(false);
          });
      }
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar questões');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [isReview, isFiltered, filterMateria, filterSubtema]);

  useEffect(() => {
    startSession();
  }, [startSession]);

  const currentQ = questions?.[currentIdx];
  // Só no treino do dia: revisão e filtro por assunto continuam todos para resolver.
  const resolvida = !isReview && !isErrosReview && !isFiltered && ehExemploResolvido(questions ?? [], currentIdx);
  const alternatives = currentQ ? [
    { key: 'A', text: currentQ.alternativaA },
    { key: 'B', text: currentQ.alternativaB },
    { key: 'C', text: currentQ.alternativaC },
    { key: 'D', text: currentQ.alternativaD },
    { key: 'E', text: currentQ.alternativaE },
  ].filter((a) => a.text?.trim()) : []; // Unicamp tem 4 alternativas
  const ehVestibular = !!currentQ && etapaDaQuestao(currentQ) === 'vestibular';

  const handleAnswer = async () => {
    if (!selected || !currentQ) return;
    setAnswered(true);
    setAnswerError(null);
    setResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      if (isErrosReview) {
        const acertou = selected === currentQ.respostaCorreta;
        setResult({
          acertou,
          respostaCorreta: currentQ.respostaCorreta,
          explicacao: currentQ.explicacao,
        });
        // Visual feedback
        flashScreen(acertou ? 'correct' : 'wrong');
        playSound(acertou ? 'acerto' : 'erro');
        if (acertou) {
          const correctEl = document.querySelector(`[data-alt="${currentQ.respostaCorreta}"]`);
          if (correctEl) spawnCorrectParticles(correctEl as HTMLElement);
        }
        if (acertou) {
          setScore((s) => ({ ...s, correct: s.correct + 1 }));
          setStreak((s) => s + 1);
        } else {
          setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
          setStreak(0);
          setErrosWrongIds((prev) => [...prev, currentQ.id]);
        }
        // Also record answer server-side (best-effort, não bloqueia a UI que já tem o veredito local)
        fetch('/api/treino/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: currentQ.id, respostaDada: selected }),
        }).catch(() => {});
      } else if (isReview) {
        const reviewItem = reviewData?.[currentIdx];
        const acertou = selected === currentQ.respostaCorreta;
        const res = await fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewId: reviewItem?.id, acertou }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody?.error || 'Erro ao registrar revisão.');
        }
        setResult({
          acertou,
          respostaCorreta: currentQ.respostaCorreta,
          explicacao: currentQ.explicacao,
        });
        flashScreen(acertou ? 'correct' : 'wrong');
        playSound(acertou ? 'acerto' : 'erro');
        if (acertou) {
          const correctEl = document.querySelector(`[data-alt="${currentQ.respostaCorreta}"]`);
          if (correctEl) spawnCorrectParticles(correctEl as HTMLElement);
        }
        if (acertou) {
          setScore((s) => ({ ...s, correct: s.correct + 1 }));
          setStreak((s) => s + 1);
        } else {
          setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
          setStreak(0);
        }
      } else {
        const res = await fetch('/api/treino/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: currentQ.id,
            respostaDada: selected,
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody?.error || 'Erro ao verificar resposta.');
        }
        const data = await res.json();
        setResult(data);
        flashScreen(data?.acertou ? 'correct' : 'wrong');
        playSound(data?.acertou ? 'acerto' : 'erro');
        if (data?.acertou) {
          const correctEl = document.querySelector(`[data-alt="${currentQ.respostaCorreta}"]`);
          if (correctEl) spawnCorrectParticles(correctEl as HTMLElement);
        }
        if (data?.acertou) {
          setScore((s) => {
            const newScore = { ...s, correct: s.correct + 1 };
            if (sessionId) saveSessionProgress(sessionId, currentIdx, newScore, currentQ.id, selected);
            return newScore;
          });
          setStreak((s) => s + 1);
        } else {
          setScore((s) => {
            const newScore = { ...s, wrong: s.wrong + 1 };
            if (sessionId) saveSessionProgress(sessionId, currentIdx, newScore, currentQ.id, selected);
            return newScore;
          });
          setStreak(0);
        }
      }
    } catch (e: any) {
      console.error(e);
      const message =
        e?.name === 'AbortError'
          ? 'A verificação demorou demais. Confira sua conexão e tente de novo.'
          : e?.message || 'Erro ao verificar resposta. Tente de novo.';
      setAnswerError(message);
      toast.error(message);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const retryAnswer = () => {
    // `selected` continua igual; só reenvia a mesma resposta.
    handleAnswer();
  };

  const saveFeynman = async () => {
    if (!feynmanText.trim() || !result?.progressId) return;
    try {
      await fetch('/api/progress/feynman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressId: result.progressId,
          explicacaoEstudante: feynmanText,
        }),
      });
      toast.success('Explicação salva!');
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  const nextQuestion = () => {
    if (currentIdx >= (questions?.length ?? 0) - 1) {
      // In erros mode, if there are still wrong answers, start a new round
      if (isErrosReview && errosWrongIds.length > 0) {
        const wrongQs = questions.filter((q: any) => errosWrongIds.includes(q.id));
        setQuestions(wrongQs);
        setErrosRound((r) => r + 1);
        setErrosWrongIds([]);
        setCurrentIdx(0);
        setSelected(null);
        setAnswered(false);
        setResult(null);
        setAnswerError(null);
        setFeynmanText('');
        toast.info(`Rodada ${errosRound + 1}: ${wrongQs.length} questão(ões) para revisar novamente!`);
        return;
      }
      setFinished(true);
      playSound('sessaoConcluida');
      if (sessionId) saveSessionProgress(sessionId, currentIdx, score, undefined, undefined, true);
      markStudyProgress('concluido');
      return;
    }
    const newIdx = currentIdx + 1;
    setCurrentIdx(newIdx);
    setSelected(null);
    setAnswered(false);
    setResult(null);
    setAnswerError(null);
    setFeynmanText('');
    if (sessionId) saveSessionProgress(sessionId, newIdx, score);
  };


  if (showResumo && !resumoDismissed && sessionStarted && !loading && questions.length > 0) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 1, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-[var(--radius-control)] hover:bg-muted t-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display type-title font-semibold flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary-text" />
                Revisão de Conceitos
              </h1>
              <p className="type-meta text-muted-foreground">
                {isFiltered ? `${filterMateria || 'Filtrado'}` : sessionSchedule ? `${sessionSchedule.dayName}` : 'Treino Diário'} — <span data-numeric>{questions.length}</span> questões preparadas
              </p>
              {sessionMaterias.length > 0 && !isFiltered && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {sessionMaterias.map(m => (
                    <span key={m} className="type-caption px-2 py-0.5 rounded-[var(--radius-data)] bg-[hsl(var(--surface-2))] text-foreground" style={{ borderLeft: `3px solid ${materiaColors[m] ?? '#888'}` }}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Antes: caixa em primary/5 com emoji. Emoji é trava do projeto e a
              caixa colorida decorava. Agora é filete + texto na serifada. */}
          <div className="border-l-2 border-primary pl-4 py-1 mb-6 mt-5">
            <p className="type-body font-reading text-muted-foreground measure-reading">
              Um conceito por vez, começando pelo que você precisa saber antes.
            </p>
          </div>
        </motion.div>

        {/* Subtemas list */}
        {resumoLoading ? (
          /* Esqueleto do primeiro conceito, nunca tela vazia com rodinha. */
          <div className="mb-8">
            <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-4 animate-pulse" role="status" aria-label="Preparando os conceitos do dia">
              <div className="h-3 w-24 rounded bg-muted mb-4" />
              <div className="h-6 w-2/3 rounded bg-muted mb-5" />
              <div className="h-24 w-full rounded bg-muted mb-4" />
              <div className="h-3 w-5/6 rounded bg-muted mb-2" />
              <div className="h-3 w-3/5 rounded bg-muted" />
            </div>
            <button
              onClick={() => setResumoDismissed(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta hover:opacity-90 t-colors shadow-elev-1 inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Pular e Começar Treino
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <ConceitosDoDia resumos={resumoData} cores={materiaColors} onComecar={() => setResumoDismissed(true)} />
            <button type="button" onClick={() => setResumoDismissed(true)}
              className="mt-4 type-meta text-muted-foreground hover:text-foreground t-colors underline-offset-4 hover:underline">
              Pular os conceitos e começar o treino
            </button>
          </div>
        )}
      </div>
    );
  }

  // Finished screen
  if (finished) {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    const tierLabel = pct >= 80 ? 'Ouro' : pct >= 60 ? 'Prata' : 'Bronze';
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onAnimationComplete={() => { if (pct >= 60) fireConfetti(); }}
          className="bg-[hsl(var(--surface-1))] rounded-[var(--radius-container)] p-6 md:p-8 shadow-elev-3 border border-border text-center overflow-hidden"
        >
          {/* 3D Scene: Medal + Podium + Confetti */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mb-2 -mt-4"
          >
            <Results3DScene percentage={pct} width={320} height={320} />
          </motion.div>

          {/* Percentage display */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-3"
          >
            <span className="font-display type-hero font-semibold text-primary-text" data-numeric>
              {pct}%
            </span>
          </motion.div>

          {/* Tier badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <span aria-hidden className="w-6 h-px bg-primary/50" />
            <span className="type-caption text-primary-text">Medalha {tierLabel}</span>
            <span aria-hidden className="w-6 h-px bg-primary/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="font-display type-title font-semibold mb-1"
          >
            {pct >= 80 ? 'Excelente!' : pct >= 60 ? 'Bom trabalho!' : 'Continue praticando!'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-muted-foreground mb-8 type-meta"
          >
            Sessão {isReview ? 'de revisão' : 'de treino'} finalizada
          </motion.p>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {/* Verde e vermelho aqui são legítimos: acerto e erro. Mas via
                tokens --success/--danger, não green-500/red-500 literais. */}
            <div className="bg-[hsl(var(--surface-2))] rounded-[var(--radius-surface)] p-4">
              <p className="font-display type-headline font-semibold" data-numeric>{total}</p>
              <p className="type-caption text-muted-foreground mt-1">Total</p>
            </div>
            <div className="bg-[hsl(var(--success-surface))] rounded-[var(--radius-surface)] p-4">
              <p className="font-display type-headline font-semibold text-[hsl(var(--success))]" data-numeric>{score.correct}</p>
              <p className="type-caption text-[hsl(var(--success))] mt-1">Acertos</p>
            </div>
            <div className="bg-[hsl(var(--danger-surface))] rounded-[var(--radius-surface)] p-4">
              <p className="font-display type-headline font-semibold text-[hsl(var(--danger))]" data-numeric>{score.wrong}</p>
              <p className="type-caption text-[hsl(var(--danger))] mt-1">Erros</p>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex gap-3 justify-center"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--surface-2))] border border-border rounded-[var(--radius-control)] type-meta font-medium hover:bg-muted t-colors"
            >
              <Home className="w-4 h-4" /> Voltar
            </button>
            {/* Depois do treino do dia vêm os flashcards do dia (Pablo, 06/10/2026). */}
            {isReview ? (
              <button
                onClick={() => { setFinished(false); startSession(); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] type-meta font-medium hover:opacity-90 t-colors shadow-elev-2"
              >
                <RefreshCcw className="w-4 h-4" /> Nova Sessão
              </button>
            ) : (
              <button
                onClick={() => router.push('/flashcards/dia')}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] type-meta font-medium hover:opacity-90 t-colors shadow-elev-2"
              >
                <Layers className="w-4 h-4" /> Flashcards do dia
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (sessionStarted && (questions?.length ?? 0) === 0 && !loading) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="bg-[hsl(var(--surface-1))] rounded-[var(--radius-surface)] p-8 shadow-elev-1 border border-border text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-5" />
          <h2 className="font-display type-title font-semibold mb-2">
            {isReview ? 'Nenhuma revisão pendente' : 'Sem questões disponíveis'}
          </h2>
          <p className="type-body font-reading text-muted-foreground mb-6 measure-reading mx-auto">
            {isReview ? 'Você está em dia com suas revisões.' : 'O admin precisa cadastrar questões primeiro.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-control)] type-meta font-medium hover:opacity-90 t-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-text" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-[46rem] mx-auto">
      {/* Cabeçalho editorial: o número da questão é o marcador de capítulo.
          Contraste de escala (51.9px contra 13.6px) carrega a hierarquia — não
          há caixa colorida fazendo esse trabalho. */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => router.push('/dashboard')}
              aria-label="Voltar ao painel"
              className="-ml-2 p-2 rounded-[var(--radius-control)] text-muted-foreground hover:text-foreground hover:bg-muted t-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="type-caption text-muted-foreground truncate">
              {isErrosReview ? `Revisão de erros · rodada ${errosRound}` : isReview ? 'Revisão espaçada' : isFiltered ? `Treino · ${filterMateria || 'filtrado'}` : 'Treino diário'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              data-numeric
              className="inline-flex items-center gap-1.5 type-meta font-medium px-2 py-1 rounded-[var(--radius-data)]"
              style={{ backgroundColor: 'hsl(var(--success-surface))', color: 'hsl(var(--success))' }}
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              {score.correct}
            </span>
            <span
              data-numeric
              className="inline-flex items-center gap-1.5 type-meta font-medium px-2 py-1 rounded-[var(--radius-data)]"
              style={{ backgroundColor: 'hsl(var(--danger-surface))', color: 'hsl(var(--danger))' }}
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              {score.wrong}
            </span>
            {streak >= 3 && (
              <span data-numeric className="type-meta font-medium px-2 py-1 rounded-[var(--radius-data)] bg-primary/10 text-primary-text">
                {streak} seguidas
              </span>
            )}
            <button
              onClick={() => {
                if (!window.confirm('Recomeçar o treino do zero? As respostas desta sessão continuam salvas no seu progresso.')) return;
                setFinished(false);
                startSession(true);
              }}
              title="Recomeçar treino do zero"
              className="ml-1 inline-flex items-center gap-1.5 px-2 py-1.5 rounded-[var(--radius-control)] type-meta text-muted-foreground hover:text-foreground hover:bg-muted t-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Recomeçar
            </button>
          </div>
        </div>

        <div className="flex items-baseline gap-2.5">
          <span data-numeric className="font-display type-hero font-semibold leading-none">
            {String(currentIdx + 1).padStart(2, '0')}
          </span>
          <span data-numeric className="type-meta text-muted-foreground pb-1.5">
            de {String(questions?.length ?? 0).padStart(2, '0')}
          </span>
        </div>

        {/* Filete de progresso: escala no eixo X, sem animar width. */}
        <div className="mt-4 h-px w-full bg-border overflow-hidden" role="presentation">
          <div
            className="h-full w-full bg-primary origin-left transition-transform duration-medium ease-out-quart"
            style={{ transform: `scaleX(${(currentIdx + 1) / Math.max(1, questions?.length ?? 1)})` }}
          />
        </div>
      </header>

      {/* Troca de questão: fade + deslize curto (skill animation-system).
          Antes era um giro 3D de 0,5 s com a página da prova dentro — a
          imagem grande era rasterizada em 3D a cada quadro e a tela travava. */}
      <div className="mb-4 relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentIdx}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0, transition: { duration: 0.01 } } : { opacity: 0, x: -40, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="surface-1 rounded-[var(--radius-surface)] p-6 md:p-8"
          >
          {/* Procedência da questão. Antes eram três pílulas preenchidas; a
              pílula da matéria usava texto branco sobre pastel (contraste
              reprovado) e as três competiam com o enunciado. Agora é uma linha
              de metadado: ponto de cor + nome, separadores discretos. */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-6 type-meta text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <span
                aria-hidden
                className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                style={{ backgroundColor: materiaColors[currentQ?.materia] ?? 'hsl(var(--muted-foreground))' }}
              />
              {currentQ?.materia ?? ''}
            </span>
            {currentQ?.subtema && (
              <>
                <span aria-hidden className="w-px h-3 bg-border shrink-0" />
                <span className="truncate max-w-[22rem]">{currentQ.subtema}</span>
              </>
            )}
            <span aria-hidden className="w-px h-3 bg-border shrink-0" />
            {currentQ && (
              <span className="font-medium">
                {ehVestibular ? `${currentQ.origem} · questão ${currentQ.numeroQuestao} · prova real` : ETAPA_LABEL[etapaDaQuestao(currentQ)]}
              </span>
            )}
            {resolvida && (
              <>
                <span aria-hidden className="w-px h-3 bg-border shrink-0" />
                <span className="font-medium text-primary-text">Exemplo resolvido</span>
              </>
            )}
          </div>

          {/* Enunciado — serifada de leitura, medida travada em 60–70 caracteres.
              Antes: 646px a 16px, ~81 caracteres por linha. */}
          <div className="prose-reading mb-6">
            <MathText text={currentQ?.enunciado ?? ''} />
          </div>

          {/* Scan da prova original. O container é o passe-partout: ver .exam-scan
              em globals.css — no escuro, papel rebaixado em vez de branco puro. */}
          {currentQ?.pdfFileUrl && currentQ?.paginaPdf && (
            <PaginaDaProva
              key={currentQ.id}
              pdfUrl={currentQ.pdfFileUrl}
              pagina={currentQ.paginaPdf}
              imagemUrl={currentQ.imagemUrl}
              imagemUrlExpandida={currentQ.imagemUrlExpandida}
              precisaDaImagem={Boolean(currentQ.dependeImagem)}
              className="mb-6"
            />
          )}
          {currentQ?.dependeImagem && !currentQ?.pdfFileUrl && (
            <ImagemIndisponivel className="mb-6" />
          )}

          {/* Alternatives. No exemplo resolvido só a certa aparece, já marcada:
              não há o que escolher (Pablo, 07/10/2026). */}
          {resolvida && <p className="type-caption text-muted-foreground mb-2">Resposta certa</p>}
          <div className="space-y-2">
            {(resolvida ? alternatives.filter((alt) => alt.key === currentQ?.respostaCorreta) : alternatives).map((alt, altIdx) => {
              // Só marca certo/errado quando o veredito do servidor (result) já chegou —
              // enquanto `answered && !result` (verificando) ou em erro, fica neutro.
              const isCorrect = resolvida ? alt.key === currentQ?.respostaCorreta : !!result && alt.key === result.respostaCorreta;
              const isWrong = !!result && alt.key === selected && !result.acertou;
              const isChecking = answered && !result && !answerError && alt.key === selected;
              const isSelected = alt.key === selected;
              return (
                <motion.button
                  key={alt.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={
                    isCorrect && !shouldReduceMotion
                      ? { opacity: 1, x: 0, scale: [1, 1.08, 1] }
                      : { opacity: 1, x: 0, scale: 1 }
                  }
                  transition={
                    isCorrect && !shouldReduceMotion
                      ? { duration: 0.35, ease: 'easeOut' }
                      : { delay: shouldReduceMotion ? 0 : 0.05 + altIdx * 0.03, duration: 0.2 }
                  }
                  onClick={() => !answered && !resolvida && setSelected(alt.key)}
                  disabled={answered || resolvida}
                  data-alt={alt.key}
                  data-state={isCorrect ? 'correta' : isWrong ? 'errada' : isSelected ? 'selecionada' : 'repouso'}
                  style={
                    isCorrect
                      ? { backgroundColor: 'hsl(var(--success-surface))', borderColor: 'hsl(var(--success-border))' }
                      : isWrong
                      ? { backgroundColor: 'hsl(var(--danger-surface))', borderColor: 'hsl(var(--danger-border))' }
                      : undefined
                  }
                  className={`group relative w-full flex items-start gap-3.5 p-3.5 pl-4 text-left rounded-[var(--radius-control)] border t-lift ${
                    isCorrect
                      ? 'shadow-elev-1'
                      : isWrong
                      ? 'shadow-elev-1 animate-shake'
                      : isSelected
                      ? 'bg-primary/[0.07] border-primary shadow-elev-2'
                      : 'bg-[hsl(var(--surface-2))] border-border shadow-elev-1 enabled:hover:border-primary/45 enabled:hover:shadow-elev-2 enabled:hover:-translate-y-px'
                  }`}
                  whileHover={!answered ? { x: 3 } : undefined}
                  whileTap={!answered ? { scale: 0.995 } : undefined}
                >
                  {/* Filete lateral: segundo sinal do estado escolhido, para quem
                      não distingue o matiz da borda. */}
                  {(isSelected || isCorrect || isWrong) && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-[var(--radius-data)]"
                      style={{
                        backgroundColor: isCorrect
                          ? 'hsl(var(--success))'
                          : isWrong
                          ? 'hsl(var(--danger))'
                          : 'hsl(var(--primary))',
                      }}
                    />
                  )}
                  <span
                    aria-hidden
                    style={
                      isCorrect
                        ? { backgroundColor: 'hsl(var(--success))', color: 'hsl(var(--surface-1))' }
                        : isWrong
                        ? { backgroundColor: 'hsl(var(--danger))', color: 'hsl(var(--surface-1))' }
                        : undefined
                    }
                    className={`w-8 h-8 rounded-[var(--radius-control)] flex items-center justify-center flex-shrink-0 type-meta font-semibold t-colors ${
                      isCorrect || isWrong
                        ? ''
                        : isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-enabled:group-hover:bg-primary/15 group-enabled:group-hover:text-primary-text'
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : isWrong ? (
                      <X className="w-4 h-4" strokeWidth={3} />
                    ) : isChecking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      alt.key
                    )}
                  </span>
                  <span className="font-reading text-body leading-[var(--lh-reading)] pt-0.5">
                    <MathText text={alt.text ?? ''} />
                  </span>
                </motion.button>
              );
            })}
          </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confirm / Checking / Error / Next */}
      {resolvida && currentQ ? (
        <div className="space-y-4">
          <div className="surface-1 rounded-[var(--radius-surface)] p-5 md:p-6 border-l-[3px] border-l-primary">
            <p className="type-caption text-muted-foreground mb-1.5">Exemplo resolvido · resposta {currentQ.respostaCorreta}</p>
            <p className="type-meta text-muted-foreground">
              A resolução vem embaixo, um passo por vez. As próximas você resolve sozinho.
            </p>
          </div>
          {/* A explicação curta com desenho vem primeiro; o texto antigo da
              questão fica atrás de um clique (Pablo, 06/10/2026). */}
          <ExplicacaoTutor questao={currentQ} respostaDada={null} iniciarSozinha />
          {currentQ.explicacao && <TextoCompleto texto={currentQ.explicacao} />}
          <button
            onClick={nextQuestion}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium text-body shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3 flex items-center justify-center gap-2"
          >
            Entendi, próxima
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : !answered ? (
        <button
          onClick={handleAnswer}
          disabled={!selected}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium text-body shadow-elev-2 t-lift enabled:hover:-translate-y-px enabled:hover:shadow-elev-3 disabled:opacity-40 disabled:shadow-elev-1"
        >
          Confirmar resposta
        </button>
      ) : answerError ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[var(--radius-surface)] p-5 bg-[hsl(var(--surface-2))] border border-border"
        >
          {/* Falha do sistema, não erro do aluno — por isso fica em superfície
              neutra. Vermelho aqui roubaria o sinal da resposta errada. */}
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-muted-foreground" />
            <span className="font-display type-lead font-semibold">Não deu pra verificar</span>
          </div>
          <p className="type-body font-reading text-foreground/80 mb-4 measure-reading">{answerError}</p>
          <button
            onClick={retryAnswer}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta hover:opacity-90 t-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Tentar novamente
          </button>
        </motion.div>
      ) : !result ? (
        <div className="rounded-[var(--radius-surface)] p-5 bg-[hsl(var(--surface-2))] border border-border flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="type-meta text-muted-foreground">Verificando resposta...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Feedback — revelação em "flip" suave, mesmo espírito do flip dos flashcards */}
          <motion.div
            initial={{ opacity: 0, rotateX: shouldReduceMotion ? 0 : -12, scaleY: shouldReduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, rotateX: 0, scaleY: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformPerspective: 800,
              transformOrigin: 'top',
              backgroundColor: result?.acertou ? 'hsl(var(--success-surface))' : 'hsl(var(--danger-surface))',
              borderColor: result?.acertou ? 'hsl(var(--success-border))' : 'hsl(var(--danger-border))',
            }}
            className="rounded-[var(--radius-surface)] border p-5 md:p-6 shadow-elev-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: result?.acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
                {result?.acertou ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
              </span>
              <span
                className="font-display type-lead font-semibold"
                style={{ color: result?.acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}
              >
                {result?.acertou ? 'Correto' : 'Incorreto'}
              </span>
            </div>
            {result?.explicacao && <TextoCompleto texto={result.explicacao} />}
          </motion.div>

          {/* Questão real de vestibular: resolução de clicar, passo a passo, antes do tutor. */}
          {currentQ && ehVestibular && <ResolucaoClicavel origem={currentQ.origem} numero={currentQ.numeroQuestao} />}
          {/* Explicação visual em passos + conversa de dúvida. Errou: começa sozinha. */}
          {currentQ && (
            <ExplicacaoTutor questao={currentQ} respostaDada={selected} iniciarSozinha={!result?.acertou && !ehVestibular} />
          )}
          {/* Feynman technique */}
          {!result?.acertou && !isReview && (
            /* Fechado por padrão: aberto, era mais um campo de texto embaixo de
               toda explicação (tela limpa, decisoes-prepenem). */
            <details key={currentIdx} className="surface-1 rounded-[var(--radius-surface)] px-5 py-3 group">
              <summary className="cursor-pointer type-meta text-muted-foreground hover:text-foreground t-colors list-none">
                Explicar com minhas palavras
              </summary>
              <p className="type-meta text-muted-foreground mt-3 mb-3">
                Por que errou e qual o conceito certo:
              </p>
              <textarea
                value={feynmanText}
                onChange={(e) => setFeynmanText(e.target.value)}
                className="w-full p-3 border border-input rounded-[var(--radius-control)] font-reading text-body bg-[hsl(var(--surface-2))] resize-none focus:outline-none"
                rows={3}
                placeholder="Escreva sua explicação aqui..."
              />
              <button
                onClick={saveFeynman}
                disabled={!feynmanText.trim()}
                className="mt-2.5 flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary-text type-meta font-medium rounded-[var(--radius-control)] hover:bg-primary/20 t-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" /> Salvar explicação
              </button>
            </details>
          )}

          <div className="flex gap-3">
            {currentIdx > 0 && (
              <button
                onClick={() => {
                  setCurrentIdx(currentIdx - 1);
                  setSelected(null);
                  setAnswered(false);
                  setResult(null);
                  setAnswerError(null);
                  setFeynmanText('');
                          }}
                className="px-4 py-3.5 bg-muted text-foreground rounded-[var(--radius-control)] font-medium type-meta hover:bg-secondary t-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
            )}
            <button
              onClick={nextQuestion}
              className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium text-body shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3 flex items-center justify-center gap-2"
            >
              {currentIdx >= (questions?.length ?? 0) - 1 ? 'Finalizar Sessão' : 'Próxima Questão'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
