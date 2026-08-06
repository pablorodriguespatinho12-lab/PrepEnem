'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  BookOpen, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertTriangle,
  Brain, Loader2, RefreshCcw, Home, Send, Sparkles, Trophy,
  GraduationCap, ChevronDown, Lightbulb, FlaskConical, Calculator, Play, Eye, EyeOff, ImageIcon,
  Check, X
} from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';
import { fireConfetti, spawnCorrectParticles, flashScreen } from '@/components/animations';
import { ImagemIndisponivel } from '@/components/pdf-page-viewer';
import { playSound } from '@/lib/sounds';

const PdfPageViewer = dynamic(() => import('@/components/pdf-page-viewer'), { ssr: false });
const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });
const Results3DScene = dynamic(() => import('@/components/results-3d-scene'), { ssr: false });

const difficultyLabel: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

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
  const [llmExplanation, setLlmExplanation] = useState('');
  const [generatingExplanation, setGeneratingExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [errosRound, setErrosRound] = useState(1);
  const [errosWrongIds, setErrosWrongIds] = useState<string[]>([]);

  // Resumo (pre-training review) state
  const [showResumo, setShowResumo] = useState(false);
  const [resumoData, setResumoData] = useState<any[]>([]);
  const [resumoLoading, setResumoLoading] = useState(false);
  const [expandedResumo, setExpandedResumo] = useState<Set<string>>(new Set());
  const [resumoImages, setResumoImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
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

  const startSession = useCallback(async () => {
    setLoading(true);
    try {
      let loadedQs: any[] = [];

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
        // Check for active session first
        const activeRes = await fetch('/api/treino/session');
        const activeData = await activeRes.json();

        if (activeData?.session && !activeData.session.finished) {
          // Restore existing session
          const s = activeData.session;
          loadedQs = s.questions ?? [];
          setQuestions(loadedQs);
          setSessionId(s.id);

          // Find first unanswered question
          let restoreIdx = s.currentIdx ?? 0;
          const answeredQs = loadedQs.filter((q: any) => q.answered);
          for (let i = restoreIdx; i < loadedQs.length; i++) {
            if (!loadedQs[i]?.answered) { restoreIdx = i; break; }
          }

          setCurrentIdx(restoreIdx);
          setScore({ correct: s.correct ?? 0, wrong: s.wrong ?? 0 });
          markStudyProgress('em_andamento');
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
        for (const q of loadedQs) {
          const key = `${q?.materia}::${q?.subtema}`;
          if (!subtemaMap.has(key) && q?.materia && q?.subtema) {
            subtemaMap.set(key, { materia: q.materia, subtema: q.subtema });
          }
        }
        const subtemas = Array.from(subtemaMap.values()).slice(0, 8);
        setResumoLoading(true);
        fetch('/api/treino/resumo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subtemas }),
        })
          .then((r) => r.json())
          .then((d) => setResumoData(d?.resumos ?? []))
          .catch(() => toast.error('Erro ao carregar resumo'))
          .finally(() => setResumoLoading(false));
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
  const alternatives = currentQ ? [
    { key: 'A', text: currentQ.alternativaA },
    { key: 'B', text: currentQ.alternativaB },
    { key: 'C', text: currentQ.alternativaC },
    { key: 'D', text: currentQ.alternativaD },
    { key: 'E', text: currentQ.alternativaE },
  ] : [];

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

  const generateAIExplanation = async () => {
    if (!currentQ || generatingExplanation) return;
    setGeneratingExplanation(true);
    setLlmExplanation('');
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enunciado: currentQ.enunciado,
          alternativas: {
            A: currentQ.alternativaA,
            B: currentQ.alternativaB,
            C: currentQ.alternativaC,
            D: currentQ.alternativaD,
            E: currentQ.alternativaE,
          },
          respostaCorreta: currentQ.respostaCorreta,
          respostaDada: selected,
          materia: currentQ.materia,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData?.error || 'Erro ao gerar explicação. Tente novamente.');
        setGeneratingExplanation(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        toast.error('Erro ao conectar com a IA');
        setGeneratingExplanation(false);
        return;
      }
      const decoder = new TextDecoder();
      let buffer = '';
      let partialRead = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        partialRead += decoder.decode(value, { stream: true });
        const lines = partialRead.split('\n');
        partialRead = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const content = parsed?.choices?.[0]?.delta?.content ?? '';
              buffer += content;
              setLlmExplanation(buffer);
            } catch {}
          }
        }
      }
      if (!buffer) {
        toast.error('A IA não conseguiu gerar explicação para esta questão. Tente novamente.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Erro ao gerar explicação. Tente novamente.');
    } finally {
      setGeneratingExplanation(false);
    }
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
        setLlmExplanation('');
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
    setLlmExplanation('');
    if (sessionId) saveSessionProgress(sessionId, newIdx, score);
  };

  const toggleResumoExpand = (key: string) => {
    setExpandedResumo((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const generateResumoImage = async (resumo: any) => {
    const key = `${resumo.materia}::${resumo.subtema}`;
    if (resumoImages[key] || loadingImages.has(key)) return;
    setLoadingImages((prev) => new Set(prev).add(key));
    try {
      const res = await fetch('/api/treino/resumo-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: resumo.image_suggestion, materia: resumo.materia, subtema: resumo.subtema }),
      });
      const data = await res.json();
      if (data?.imageUrl) {
        setResumoImages((prev) => ({ ...prev, [key]: data.imageUrl }));
      }
    } catch {
      toast.error('Erro ao gerar imagem');
    } finally {
      setLoadingImages((prev) => { const n = new Set(prev); n.delete(key); return n; });
    }
  };

  // Resumo screen (before questions)
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
                <GraduationCap className="w-6 h-6 text-primary" />
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
              Revise os conceitos antes de começar. Quando estiver pronto, clique em &quot;Começar Treino&quot;.
            </p>
          </div>
        </motion.div>

        {/* Subtemas list */}
        {resumoLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="type-meta text-muted-foreground mb-4">Gerando resumo dos conteúdos...</p>
            <button
              onClick={() => setResumoDismissed(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta hover:opacity-90 t-colors shadow-elev-1 inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Pular e Começar Treino
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {resumoData.map((resumo, idx) => {
              const key = `${resumo.materia}::${resumo.subtema}`;
              const isExpanded = expandedResumo.has(key);
              const hasImage = !!resumoImages[key];
              const isLoadingImg = loadingImages.has(key);
              const isExatas = ['Física', 'Matemática', 'Química'].includes(resumo.materia);

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[hsl(var(--surface-1))] rounded-[var(--radius-surface)] border border-border shadow-elev-1 overflow-hidden"
                >
                  {/* Header - always visible. A cor da matéria virou filete
                      vertical: como caixa pastel atrás do ícone ela decorava. */}
                  <button
                    onClick={() => toggleResumoExpand(key)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-[hsl(var(--surface-2))] t-colors"
                  >
                    <span
                      aria-hidden
                      className="w-[3px] h-9 rounded-[var(--radius-data)] shrink-0"
                      style={{ backgroundColor: materiaColors[resumo.materia] ?? '#888' }}
                    />
                    <div className="w-9 h-9 flex items-center justify-center shrink-0 text-muted-foreground">
                      {isExatas ? <Calculator className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display type-body font-semibold">{resumo.materia}</p>
                      <p className="type-meta text-muted-foreground">{resumo.subtema}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="type-caption text-primary">
                        {isExpanded ? 'Ocultar' : 'Revelar'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Content - expandable */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 space-y-4">
                          {/* Conceitos */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <Lightbulb className="w-4 h-4 text-muted-foreground" />
                              <span className="type-caption text-muted-foreground">Conceitos-chave</span>
                            </div>
                            <ul className="space-y-2 measure-reading">
                              {(resumo.conceitos ?? []).map((c: string, ci: number) => (
                                <li key={ci} className="flex items-start gap-2.5 type-body font-reading text-foreground/90">
                                  <span aria-hidden className="w-1 h-1 rounded-full bg-primary mt-[0.7em] shrink-0" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Fórmulas */}
                          {(resumo.formulas?.length ?? 0) > 0 && (
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <FlaskConical className="w-4 h-4 text-muted-foreground" />
                                <span className="type-caption text-muted-foreground">Fórmulas</span>
                              </div>
                              <div className="bg-[hsl(var(--surface-2))] rounded-[var(--radius-control)] p-3 space-y-1">
                                {(resumo.formulas ?? []).map((f: string, fi: number) => (
                                  <p key={fi} className="type-meta font-mono text-foreground" data-numeric>{f}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dica ENEM */}
                          {resumo.dica_enem && (
                            <div className="border-l-2 border-primary/40 pl-3 py-0.5">
                              <p className="type-caption text-muted-foreground mb-1">Dica ENEM</p>
                              <p className="type-body font-reading text-foreground/90 measure-reading">{resumo.dica_enem}</p>
                            </div>
                          )}

                          {/* Image */}
                          {resumo.image_suggestion && (
                            <div>
                              {!hasImage ? (
                                <button
                                  onClick={() => generateResumoImage(resumo)}
                                  disabled={isLoadingImg}
                                  className="flex items-center gap-2 type-meta text-primary font-medium hover:underline disabled:opacity-50"
                                >
                                  {isLoadingImg ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Gerando ilustração...</>
                                  ) : (
                                    <><ImageIcon className="w-4 h-4" /> Ver ilustração do conceito</>
                                  )}
                                </button>
                              ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                                  <div className="relative rounded-xl overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={resumoImages[key]}
                                      alt={`Ilustração: ${resumo.subtema}`}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 sticky bottom-4">
          <button
            onClick={() => setResumoDismissed(true)}
            className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-display font-semibold type-body hover:opacity-90 transition-opacity shadow-elev-2 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Começar Treino
          </button>
        </div>
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
            <span className="font-display type-hero font-semibold text-primary" data-numeric>
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
            <span className="type-caption text-primary">Medalha {tierLabel}</span>
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
            <button
              onClick={() => { setFinished(false); startSession(); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] type-meta font-medium hover:opacity-90 t-colors shadow-elev-2"
            >
              <RefreshCcw className="w-4 h-4" /> Nova Sessão
            </button>
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
              <span data-numeric className="type-meta font-medium px-2 py-1 rounded-[var(--radius-data)] bg-primary/10 text-primary">
                {streak} seguidas
              </span>
            )}
            <button
              onClick={() => { setFinished(false); startSession(); }}
              title="Reiniciar sessão"
              aria-label="Reiniciar sessão"
              className="ml-1 p-1.5 rounded-[var(--radius-control)] text-muted-foreground hover:text-foreground hover:bg-muted t-colors"
            >
              <RefreshCcw className="w-4 h-4" />
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

      {/* Question with 3D flip transition */}
      <div className="perspective-1000 mb-4 relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIdx}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, rotateY: -90, scale: 0.85 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, rotateY: 0, scale: 1 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0.01 } }
                : result?.acertou === false
                ? { opacity: 0, y: 200, rotateX: 30, transition: { duration: 0.5, ease: 'easeIn' } }
                : { opacity: 0, rotateY: 90, scale: 0.85, transition: { duration: 0.4 } }
            }
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: 'easeOut' }}
            style={{ transformStyle: 'preserve-3d' }}
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
            <span className={difficultyLabel[currentQ?.dificuldade] ? 'font-medium' : ''}>
              {difficultyLabel[currentQ?.dificuldade] ?? currentQ?.dificuldade ?? ''}
            </span>
          </div>

          {/* Enunciado — serifada de leitura, medida travada em 60–70 caracteres.
              Antes: 646px a 16px, ~81 caracteres por linha. */}
          <div className="prose-reading mb-6">
            <MathText text={currentQ?.enunciado ?? ''} />
          </div>

          {/* Scan da prova original. O container é o passe-partout: ver .exam-scan
              em globals.css — no escuro, papel rebaixado em vez de branco puro. */}
          {currentQ?.pdfFileUrl && currentQ?.paginaPdf && (
            <figure className="mb-6">
              <PdfPageViewer
                pdfUrl={currentQ.pdfFileUrl}
                pageNumber={currentQ.paginaPdf}
                imagemUrl={currentQ.imagemUrl}
                imagemUrlExpandida={currentQ.imagemUrlExpandida}
              />
            </figure>
          )}
          {currentQ?.dependeImagem && !currentQ?.pdfFileUrl && (
            <ImagemIndisponivel className="mb-6" />
          )}

          {/* Alternatives */}
          <div className="space-y-2">
            {alternatives.map((alt, altIdx) => {
              // Só marca certo/errado quando o veredito do servidor (result) já chegou —
              // enquanto `answered && !result` (verificando) ou em erro, fica neutro.
              const isCorrect = !!result && alt.key === result.respostaCorreta;
              const isWrong = !!result && alt.key === selected && !result.acertou;
              const isChecking = answered && !result && !answerError && alt.key === selected;
              const isSelected = alt.key === selected;
              return (
                <motion.button
                  key={alt.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isCorrect && !shouldReduceMotion
                      ? { opacity: 1, x: 0, scale: [1, 1.08, 1] }
                      : { opacity: 1, x: 0, scale: 1 }
                  }
                  transition={
                    isCorrect && !shouldReduceMotion
                      ? { duration: 0.35, ease: 'easeOut' }
                      : { delay: altIdx * 0.08, duration: 0.3 }
                  }
                  onClick={() => !answered && setSelected(alt.key)}
                  disabled={answered}
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
                        : 'bg-muted text-muted-foreground group-enabled:group-hover:bg-primary/15 group-enabled:group-hover:text-primary'
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
      {!answered ? (
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
            {result?.explicacao && (
              <div className="prose-reading">
                <MathText text={result.explicacao} />
              </div>
            )}
          </motion.div>

          {/* AI Explanation — available for ALL answers */}
          <div className="surface-1 rounded-[var(--radius-surface)] p-5">
            <button
              onClick={generateAIExplanation}
              disabled={generatingExplanation}
              className="flex items-center gap-2 type-meta text-primary font-medium hover:underline underline-offset-4 mb-3 disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              {generatingExplanation ? 'Gerando explicação...' : result?.acertou ? 'Ver explicação detalhada' : 'Gerar explicação detalhada com IA'}
            </button>
            <AnimatePresence>
              {llmExplanation && (
                <motion.div
                  initial={{ opacity: 0, rotateX: shouldReduceMotion ? 0 : -12, scaleY: shouldReduceMotion ? 1 : 0.96 }}
                  animate={{ opacity: 1, rotateX: 0, scaleY: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformPerspective: 800, transformOrigin: 'top' }}
                  className="prose-reading bg-muted/50 rounded-[var(--radius-control)] p-4"
                >
                  <MathText text={llmExplanation} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feynman technique */}
          {!result?.acertou && !isReview && (
            <div className="surface-1 rounded-[var(--radius-surface)] p-5">
              <p className="type-caption text-muted-foreground mb-1.5">Técnica Feynman</p>
              <p className="type-meta text-muted-foreground mb-3">
                Explique com suas palavras por que errou e qual o conceito correto:
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
                className="mt-2.5 flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary type-meta font-medium rounded-[var(--radius-control)] hover:bg-primary/20 t-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" /> Salvar explicação
              </button>
            </div>
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
                  setLlmExplanation('');
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
