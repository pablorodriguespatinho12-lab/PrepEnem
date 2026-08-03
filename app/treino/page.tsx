'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  BookOpen, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertTriangle,
  Brain, Loader2, RefreshCcw, Home, Send, Sparkles, Trophy,
  GraduationCap, ChevronDown, Lightbulb, FlaskConical, Calculator, Play, Eye, EyeOff, ImageIcon
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

const difficultyColor: Record<string, string> = {
  facil: 'bg-green-500/10 text-green-700',
  medio: 'bg-yellow-500/10 text-yellow-700',
  dificil: 'bg-red-500/10 text-red-700',
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
  const shouldReduceMotion = useReducedMotion();

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
        const res = await fetch('/api/treino/generate', { method: 'POST' });
        const resData = await res.json();
        loadedQs = resData?.questions ?? [];
        setQuestions(loadedQs);
        if (resData?.materias) setSessionMaterias(resData.materias);
        if (resData?.schedule) setSessionSchedule(resData.schedule);

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
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-lg hover:bg-muted transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Revisão de Conceitos
              </h1>
              <p className="text-sm text-muted-foreground">
                {isFiltered ? `${filterMateria || 'Filtrado'}` : sessionSchedule ? `${sessionSchedule.dayName}` : 'Treino Diário'} — {questions.length} questões preparadas
              </p>
              {sessionMaterias.length > 0 && !isFiltered && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {sessionMaterias.map(m => (
                    <span key={m} className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-foreground" style={{ borderLeft: `3px solid ${materiaColors[m] ?? '#888'}` }}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 mt-4">
            <p className="text-sm font-medium text-primary">
              📖 Revise os conceitos antes de começar. Quando estiver pronto, clique em &quot;Começar Treino&quot;.
            </p>
          </div>
        </motion.div>

        {/* Subtemas list */}
        {resumoLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">Gerando resumo dos conteúdos...</p>
            <button
              onClick={() => setResumoDismissed(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition shadow-md inline-flex items-center gap-2"
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
                  className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
                >
                  {/* Header - always visible */}
                  <button
                    onClick={() => toggleResumoExpand(key)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${materiaColors[resumo.materia] ?? '#888'}22` }}
                    >
                      {isExatas ? (
                        <Calculator className="w-5 h-5" style={{ color: materiaColors[resumo.materia] ?? '#888' }} />
                      ) : (
                        <BookOpen className="w-5 h-5" style={{ color: materiaColors[resumo.materia] ?? '#888' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold">{resumo.materia}</p>
                      <p className="text-xs text-muted-foreground">{resumo.subtema}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
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
                              <Lightbulb className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conceitos-chave</span>
                            </div>
                            <ul className="space-y-1.5">
                              {(resumo.conceitos ?? []).map((c: string, ci: number) => (
                                <li key={ci} className="flex items-start gap-2 text-sm text-foreground/90">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Fórmulas */}
                          {(resumo.formulas?.length ?? 0) > 0 && (
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <FlaskConical className="w-4 h-4 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fórmulas</span>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                                {(resumo.formulas ?? []).map((f: string, fi: number) => (
                                  <p key={fi} className="text-sm font-mono text-foreground">{f}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dica ENEM */}
                          {resumo.dica_enem && (
                            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-3">
                              <p className="text-sm text-foreground/90">
                                <span className="font-semibold">💡 Dica ENEM:</span> {resumo.dica_enem}
                              </p>
                            </div>
                          )}

                          {/* Image */}
                          {resumo.image_suggestion && (
                            <div>
                              {!hasImage ? (
                                <button
                                  onClick={() => generateResumoImage(resumo)}
                                  disabled={isLoadingImg}
                                  className="flex items-center gap-2 text-sm text-primary font-medium hover:underline disabled:opacity-50"
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
            className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
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
    const tierEmoji = pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : '🥉';
    const tierLabel = pct >= 80 ? 'Ouro' : pct >= 60 ? 'Prata' : 'Bronze';
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onAnimationComplete={() => { if (pct >= 60) fireConfetti(); }}
          className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-border text-center overflow-hidden"
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
            <span className="font-display text-6xl font-black bg-gradient-to-r from-primary via-[hsl(var(--chart-2))] to-primary bg-clip-text text-transparent">
              {pct}%
            </span>
          </motion.div>

          {/* Tier badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <span className="text-lg">{tierEmoji}</span>
            <span className="font-display font-bold text-sm text-primary">Medalha {tierLabel}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="font-display text-2xl font-bold mb-1"
          >
            {pct >= 80 ? 'Excelente!' : pct >= 60 ? 'Bom trabalho!' : 'Continue praticando!'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-muted-foreground mb-6 text-sm"
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
            <div className="bg-muted/50 rounded-xl p-4 card-3d">
              <p className="font-display text-3xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 card-3d">
              <p className="font-display text-3xl font-bold text-green-600 dark:text-green-400">{score.correct}</p>
              <p className="text-xs text-green-700 dark:text-green-500 mt-1">Acertos</p>
            </div>
            <div className="bg-red-500/10 rounded-xl p-4 card-3d">
              <p className="font-display text-3xl font-bold text-red-600 dark:text-red-400">{score.wrong}</p>
              <p className="text-xs text-red-700 dark:text-red-500 mt-1">Erros</p>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-muted rounded-xl text-sm font-medium hover:bg-muted/80 transition card-3d"
            >
              <Home className="w-4 h-4" /> Voltar
            </button>
            <button
              onClick={() => { setFinished(false); startSession(); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition shadow-lg cta-glow"
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
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-semibold mb-2">
            {isReview ? 'Nenhuma revisão pendente!' : 'Sem questões disponíveis'}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {isReview ? 'Parabéns! Você está em dia com suas revisões.' : 'O admin precisa cadastrar questões primeiro.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
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
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-lg hover:bg-muted transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold">
              {isErrosReview ? `Revisão de Erros (Rodada ${errosRound})` : isReview ? 'Revisão Espaçada' : isFiltered ? `Treino: ${filterMateria || 'Filtrado'}` : 'Treino Diário'}
            </h1>
            <p className="text-xs text-muted-foreground">
              Questão {currentIdx + 1} de {questions?.length ?? 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-green-500/10 text-green-700 px-2 py-1 rounded">
            {score.correct} ✓
          </span>
          <span className="text-xs font-medium bg-red-500/10 text-red-700 px-2 py-1 rounded">
            {score.wrong} ✗
          </span>
          {streak >= 3 && (
            <span className="text-xs font-medium bg-orange-500/10 text-orange-700 px-2 py-1 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {streak} seguidas!
            </span>
          )}
          <button
            onClick={() => { setFinished(false); startSession(); }}
            title="Reiniciar sessão"
            className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / Math.max(1, questions?.length ?? 1)) * 100}%` }}
        />
      </div>

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
            className="bg-card/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border card-float"
          >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: materiaColors[currentQ?.materia] ?? '#888' }}
            >
              {currentQ?.materia ?? ''}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {currentQ?.subtema ?? ''}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColor[currentQ?.dificuldade] ?? ''}`}>
              {difficultyLabel[currentQ?.dificuldade] ?? currentQ?.dificuldade ?? ''}
            </span>
          </div>

          {/* Enunciado */}
          <div className="text-sm md:text-base leading-relaxed mb-4">
            <MathText text={currentQ?.enunciado ?? ''} />
          </div>

          {/* PDF Image (figure/graph from original exam) */}
          {currentQ?.pdfFileUrl && currentQ?.paginaPdf && (
            <div className="mb-5">
              <PdfPageViewer
                pdfUrl={currentQ.pdfFileUrl}
                pageNumber={currentQ.paginaPdf}
                imagemUrl={currentQ.imagemUrl}
                imagemUrlExpandida={currentQ.imagemUrlExpandida}
              />
            </div>
          )}
          {currentQ?.dependeImagem && !currentQ?.pdfFileUrl && (
            <ImagemIndisponivel className="mb-5" />
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
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left text-sm transition-all ${
                    isCorrect
                      ? 'bg-green-500/10 border-green-500 text-green-800 dark:text-green-300'
                      : isWrong
                      ? 'bg-red-500/10 border-red-500 text-red-800 dark:text-red-300 animate-shake'
                      : isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'border-border hover:bg-muted/50 hover:translate-x-1'
                  }`}
                  whileHover={!answered ? { x: 4 } : undefined}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isCorrect
                      ? 'bg-green-500 text-white'
                      : isWrong
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isWrong ? (
                      <XCircle className="w-4 h-4" />
                    ) : isChecking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      alt.key
                    )}
                  </span>
                  <span className="pt-0.5"><MathText text={alt.text ?? ''} /></span>
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
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-40 transition shadow-md"
        >
          Confirmar Resposta
        </button>
      ) : answerError ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-5 bg-amber-500/10 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="font-display font-bold text-amber-700">Não deu pra verificar</span>
          </div>
          <p className="text-sm text-foreground/80 mb-4">{answerError}</p>
          <button
            onClick={retryAnswer}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium text-sm hover:opacity-90 transition"
          >
            <RefreshCcw className="w-4 h-4" /> Tentar novamente
          </button>
        </motion.div>
      ) : !result ? (
        <div className="rounded-xl p-5 bg-muted/40 border border-border flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Verificando resposta...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Feedback — revelação em "flip" suave, mesmo espírito do flip dos flashcards */}
          <motion.div
            initial={{ opacity: 0, rotateX: shouldReduceMotion ? 0 : -12, scaleY: shouldReduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, rotateX: 0, scaleY: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 800, transformOrigin: 'top' }}
            className={`rounded-xl p-5 ${
              result?.acertou ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {result?.acertou ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-display font-bold ${result?.acertou ? 'text-green-700' : 'text-red-700'}`}>
                {result?.acertou ? 'Correto' : 'Incorreto'}
              </span>
            </div>
            {result?.explicacao && (
              <div className="text-sm text-foreground/80 leading-relaxed">
                <MathText text={result.explicacao} />
              </div>
            )}
          </motion.div>

          {/* AI Explanation — available for ALL answers */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <button
              onClick={generateAIExplanation}
              disabled={generatingExplanation}
              className="flex items-center gap-2 text-sm text-primary font-medium hover:underline mb-3"
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
                  className="text-sm text-foreground/80 leading-relaxed bg-muted/50 rounded-lg p-3"
                >
                  <MathText text={llmExplanation} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feynman technique */}
          {!result?.acertou && !isReview && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Técnica Feynman</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Explique com suas palavras por que errou e qual o conceito correto:
              </p>
              <textarea
                value={feynmanText}
                onChange={(e) => setFeynmanText(e.target.value)}
                className="w-full p-3 border border-input rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                placeholder="Escreva sua explicação aqui..."
              />
              <button
                onClick={saveFeynman}
                disabled={!feynmanText.trim()}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition disabled:opacity-40"
              >
                <Send className="w-3 h-3" /> Salvar explicação
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
                className="px-4 py-3 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
            )}
            <button
              onClick={nextQuestion}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
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
