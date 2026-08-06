'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Clock, Play, Pause, BookOpen, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, BarChart3, Trophy, AlertTriangle, AlertCircle, Timer, TimerOff, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { materiaColors } from '@/lib/theme-colors';
import { fireConfetti } from '@/components/animations';
import { ImagemIndisponivel } from '@/components/pdf-page-viewer';
import dynamic from 'next/dynamic';

const PdfPageViewer = dynamic(() => import('@/components/pdf-page-viewer'), { ssr: false });
const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

type Phase = 'config' | 'exam' | 'result';

// Limiares de dado esparso (decisão travada, ver skill decisoes-prepenem):
// <5 questões não mostra %, 5-15 mostra com indicador de baixa confiança.
const MIN_QUESTOES_PARA_TAXA = 5;
const LIMIAR_BAIXA_CONFIANCA = 15;

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Taxa de acerto ciente de amostra pequena — mesmo padrão de app/progresso/page.tsx.
function TaxaAcerto({ total, acertos }: { total: number; acertos: number }) {
  if (total < MIN_QUESTOES_PARA_TAXA) {
    return (
      <span className="type-micro text-muted-foreground italic whitespace-nowrap">
        poucos dados
      </span>
    );
  }
  const rate = Math.round((acertos / total) * 100);
  const baixaConfianca = total < LIMIAR_BAIXA_CONFIANCA;
  const cor = rate >= 70 ? 'hsl(var(--success))' : rate < 50 ? 'hsl(var(--danger))' : 'hsl(var(--foreground))';
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span data-numeric className="type-meta font-semibold" style={{ color: cor }}>{rate}%</span>
      <span data-numeric className="type-micro text-muted-foreground">· {total} questões</span>
      {baixaConfianca && (
        <AlertCircle
          className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0"
          aria-label="Amostra pequena: a taxa ainda pode mudar bastante"
        />
      )}
    </span>
  );
}

export default function SimuladoPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('config');
  const [checkingSession, setCheckingSession] = useState(true);

  // Config
  const [totalQ, setTotalQ] = useState(90);
  const [useTimer, setUseTimer] = useState(true);
  const [timerHours, setTimerHours] = useState(5);

  // Exam
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Results
  const [results, setResults] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Check for active session on mount ---
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const res = await fetch('/api/simulado/session');
        if (!res.ok) { setCheckingSession(false); return; }
        const data = await res.json();
        if (data.session) {
          setQuestions(data.session.questions ?? []);
          setAnswers(data.session.answers ?? {});
          setCurrentIdx(data.session.currentIdx ?? 0);
          setTimeLeft(data.session.timeLeft ?? 0);
          setTimeElapsed(data.session.timeElapsed ?? 0);
          setUseTimer(data.session.useTimer ?? false);
          setTimerHours(data.session.timerHours ?? 5);
          setSessionId(data.session.id);
          setIsPaused(true); // Start paused so user can resume
          setPhase('exam');
          toast.info('Simulado em andamento restaurado!');
        }
      } catch (e) {
        console.error('Error checking session:', e);
      } finally {
        setCheckingSession(false);
      }
    };
    checkActiveSession();
  }, []);

  // --- Save session progress to DB ---
  const saveProgress = useCallback(async (overrides?: {
    idx?: number; tLeft?: number; tElapsed?: number;
    qId?: string; resp?: string; done?: boolean;
  }) => {
    if (!sessionId) return;
    try {
      const body: any = { sessionId };
      if (overrides?.idx !== undefined) body.currentIdx = overrides.idx;
      if (overrides?.tLeft !== undefined) body.timeLeft = overrides.tLeft;
      if (overrides?.tElapsed !== undefined) body.timeElapsed = overrides.tElapsed;
      if (overrides?.qId) { body.questionId = overrides.qId; body.respostaDada = overrides.resp; }
      if (overrides?.done) body.finished = true;
      await fetch('/api/simulado/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }, [sessionId]);

  // --- Periodic save of timer state (every 15 seconds) ---
  useEffect(() => {
    if (phase !== 'exam' || !sessionId) return;
    saveTimerRef.current = setInterval(() => {
      if (!isPaused) {
        saveProgress({ tLeft: timeLeft, tElapsed: timeElapsed });
      }
    }, 15000);
    return () => { if (saveTimerRef.current) clearInterval(saveTimerRef.current); };
  }, [phase, sessionId, isPaused, timeLeft, timeElapsed, saveProgress]);

  // --- Save on pause/visibility change ---
  useEffect(() => {
    if (phase !== 'exam' || !sessionId) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveProgress({ idx: currentIdx, tLeft: timeLeft, tElapsed: timeElapsed });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [phase, sessionId, currentIdx, timeLeft, timeElapsed, saveProgress]);

  // Timer logic
  useEffect(() => {
    if (phase !== 'exam' || isPaused || timerExpired) return;

    timerRef.current = setInterval(() => {
      setTimeElapsed((t) => t + 1);
      if (useTimer) {
        setTimeLeft((t) => {
          if (t <= 1) {
            setTimerExpired(true);
            toast.warning('Tempo esgotado! O simulado será finalizado.');
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isPaused, useTimer, timerExpired]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (timerExpired && phase === 'exam') {
      handleSubmit();
    }
  }, [timerExpired]);

  const startSimulado = async (forceNew = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulado/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalQuestoes: totalQ }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const qs = data.questions ?? [];
      const initialTimeLeft = timerHours * 3600;

      // Create session in DB
      const sessRes = await fetch('/api/simulado/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIds: qs.map((q: any) => q.id),
          useTimer,
          timerHours,
          timeLeft: initialTimeLeft,
        }),
      });
      const sessData = await sessRes.json();
      if (sessData.sessionId) setSessionId(sessData.sessionId);

      setQuestions(qs);
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeft(initialTimeLeft);
      setTimeElapsed(0);
      setTimerExpired(false);
      setIsPaused(false);
      setPhase('exam');
      toast.success(`Simulado iniciado! ${data.total} questões`);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao gerar simulado');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    // Save this answer to DB
    if (sessionId) {
      saveProgress({ qId: questionId, resp: answer });
    }
  }, [sessionId, saveProgress]);

  const handleNavigate = useCallback((newIdx: number) => {
    setCurrentIdx(newIdx);
    if (sessionId) {
      saveProgress({ idx: newIdx, tLeft: timeLeft, tElapsed: timeElapsed });
    }
  }, [sessionId, timeLeft, timeElapsed, saveProgress]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const respostas = questions.map((q) => ({
      questionId: q.id,
      respostaDada: answers[q.id] ?? '',
    }));

    try {
      const res = await fetch('/api/simulado/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respostas,
          timerUsed: useTimer,
          tempoGasto: timeElapsed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Mark session as finished
      if (sessionId) {
        saveProgress({ done: true });
      }

      setResults(data);
      setPhase('result');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar simulado');
    } finally {
      setSubmitting(false);
    }
  }, [questions, answers, useTimer, timeElapsed, submitting, sessionId, saveProgress]);

  const handlePause = useCallback(() => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    if (newPaused && sessionId) {
      saveProgress({ idx: currentIdx, tLeft: timeLeft, tElapsed: timeElapsed });
    }
  }, [isPaused, sessionId, currentIdx, timeLeft, timeElapsed, saveProgress]);

  const answeredCount = Object.keys(answers).filter((k) => answers[k]).length;
  const currentQ = questions[currentIdx];
  const isTimerCritical = useTimer && timeLeft > 0 && timeLeft < 300;

  // --- LOADING CHECK ---
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto mb-3" />
          <p className="type-meta text-muted-foreground">Verificando simulado em andamento...</p>
        </div>
      </div>
    );
  }

  // --- CONFIG PHASE ---
  if (phase === 'config') {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display type-headline font-bold tracking-tight mb-2">
            Simulado ENEM
          </h1>
          <p className="type-body text-muted-foreground mb-8">
            Configure e inicie seu simulado. Sexta-feira é dia de simulado!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface-1 rounded-[var(--radius-surface)] p-6 md:p-8 space-y-6"
        >
          {/* Número de questões */}
          <div>
            <label className="type-meta font-medium mb-2 block">Número de Questões</label>
            <div className="flex gap-3">
              {[45, 90, 135, 180].map((n) => (
                <button
                  key={n}
                  onClick={() => setTotalQ(n)}
                  className={`flex-1 py-3 rounded-[var(--radius-control)] text-center font-medium t-colors ${
                    totalQ === n
                      ? 'bg-primary text-primary-foreground shadow-elev-1'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="type-caption text-muted-foreground mt-2">
              ENEM real: 90 questões por dia (180 total em 2 dias)
            </p>
          </div>

          {/* Timer toggle */}
          <div>
            <label className="type-meta font-medium mb-3 block">Cronômetro</label>
            <div className="flex gap-3">
              <button
                onClick={() => setUseTimer(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-control)] font-medium t-colors ${
                  useTimer ? 'bg-primary text-primary-foreground shadow-elev-1' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Timer className="w-4 h-4" />
                Com Cronômetro
              </button>
              <button
                onClick={() => setUseTimer(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-control)] font-medium t-colors ${
                  !useTimer ? 'bg-primary text-primary-foreground shadow-elev-1' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <TimerOff className="w-4 h-4" />
                Sem Cronômetro
              </button>
            </div>
          </div>

          {/* Timer duration */}
          {useTimer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="type-meta font-medium mb-2 block">Tempo (horas)</label>
              <div className="flex gap-3">
                {[2.5, 3, 4, 5, 5.5].map((h) => (
                  <button
                    key={h}
                    onClick={() => setTimerHours(h)}
                    className={`flex-1 py-2.5 rounded-[var(--radius-control)] text-center type-meta font-medium t-colors ${
                      timerHours === h
                        ? 'bg-primary text-primary-foreground shadow-elev-1'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
              <p className="type-caption text-muted-foreground mt-2">
                ENEM real: 5h30 (1º dia) e 5h (2º dia)
              </p>
            </motion.div>
          )}

          {/* Start */}
          <button
            onClick={() => startSimulado()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 rounded-[var(--radius-control)] font-display font-bold type-lead hover:opacity-90 transition-opacity disabled:opacity-50 shadow-elev-2"
          >
            {loading ? (
              <span className="animate-spin">...</span>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Iniciar Simulado
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  // --- EXAM PHASE ---
  if (phase === 'exam' && currentQ) {
    const alternatives = [
      { key: 'A', text: currentQ.alternativaA },
      { key: 'B', text: currentQ.alternativaB },
      { key: 'C', text: currentQ.alternativaC },
      { key: 'D', text: currentQ.alternativaD },
      { key: 'E', text: currentQ.alternativaE },
    ];

    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4 surface-1 rounded-[var(--radius-control)] p-3 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span data-numeric className="type-meta font-medium bg-primary/10 text-primary-text px-3 py-1 rounded-[var(--radius-data)]">
              {currentIdx + 1}/{questions.length}
            </span>
            <span data-numeric className="type-caption text-muted-foreground">
              {answeredCount} respondidas
            </span>
          </div>

          <div className="flex items-center gap-3">
            {useTimer ? (
              <div
                data-numeric
                className={`flex items-center gap-2 type-lead font-semibold px-2.5 py-1 rounded-[var(--radius-control)] ${
                  isTimerCritical ? 'timer-critical' : ''
                }`}
                style={isTimerCritical ? { color: 'hsl(var(--danger))' } : undefined}
              >
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            ) : (
              <div data-numeric className="flex items-center gap-2 type-meta text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatTime(timeElapsed)}
              </div>
            )}

            <button
              onClick={handlePause}
              aria-label={isPaused ? 'Retomar simulado' : 'Pausar simulado'}
              className="p-2 rounded-[var(--radius-control)] bg-muted hover:bg-muted/80 t-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Paused overlay */}
        {isPaused && (
          <div className="fixed inset-0 bg-background/95 z-20 flex items-center justify-center">
            <div className="text-center">
              <Pause className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="font-display type-headline font-bold mb-2">Simulado Pausado</p>
              <p className="type-meta text-muted-foreground mb-4">Seu progresso foi salvo automaticamente.</p>
              <button
                onClick={handlePause}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-[var(--radius-control)] font-medium hover:opacity-90 transition-opacity mt-2"
              >
                Continuar
              </button>
              <div className="mt-3">
                <button
                  onClick={() => {
                    setPhase('config');
                    setSessionId(null);
                    setQuestions([]);
                    setAnswers({});
                  }}
                  className="type-meta text-muted-foreground hover:text-foreground underline t-colors"
                >
                  Abandonar e iniciar novo
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentQ.id ?? currentIdx}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
            >
              {/* Question */}
              <div className="surface-1 rounded-[var(--radius-surface)] p-5 md:p-6 mb-4">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-4 type-meta text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <span
                      aria-hidden
                      className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                      style={{ backgroundColor: (materiaColors as any)[currentQ.materia] ?? 'hsl(var(--muted-foreground))' }}
                    />
                    {currentQ.materia}
                  </span>
                  {currentQ.subtema && (
                    <>
                      <span aria-hidden className="text-border">/</span>
                      <span className="truncate max-w-[22rem]">{currentQ.subtema}</span>
                    </>
                  )}
                </div>
                <div className="prose-reading"><MathText text={currentQ.enunciado ?? ''} /></div>
                {currentQ.pdfFileUrl && currentQ.paginaPdf && (
                  <figure className="mt-4">
                    <PdfPageViewer
                      pdfUrl={currentQ.pdfFileUrl}
                      pageNumber={currentQ.paginaPdf}
                      imagemUrl={currentQ.imagemUrl}
                      imagemUrlExpandida={currentQ.imagemUrlExpandida}
                    />
                  </figure>
                )}
                {currentQ.dependeImagem && !currentQ.pdfFileUrl && (
                  <ImagemIndisponivel className="mt-4" />
                )}
              </div>

              {/* Alternatives */}
              <div className="space-y-2 mb-6">
                {alternatives.map((alt, altIdx) => {
                  const isSelected = answers[currentQ.id] === alt.key;
                  return (
                    <motion.button
                      key={alt.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isSelected && !shouldReduceMotion
                          ? { opacity: 1, x: 0, scale: [1, 1.05, 1] }
                          : { opacity: 1, x: 0, scale: 1 }
                      }
                      transition={
                        isSelected && !shouldReduceMotion
                          ? { duration: 0.25, ease: 'easeOut' }
                          : { delay: altIdx * 0.08, duration: 0.3 }
                      }
                      onClick={() => handleAnswer(currentQ.id, alt.key)}
                      data-state={isSelected ? 'selecionada' : 'repouso'}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.995 }}
                      className={`group relative w-full text-left p-3.5 pl-4 rounded-[var(--radius-control)] border t-lift flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-primary/[0.07] border-primary shadow-elev-2'
                          : 'bg-[hsl(var(--surface-2))] border-border shadow-elev-1 hover:border-primary/45 hover:shadow-elev-2 hover:-translate-y-px'
                      }`}
                    >
                      {/* Filete lateral: segundo sinal do estado selecionado. */}
                      {isSelected && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-[var(--radius-data)]"
                          style={{ backgroundColor: 'hsl(var(--primary))' }}
                        />
                      )}
                      <span
                        className={`w-8 h-8 rounded-[var(--radius-control)] flex items-center justify-center type-meta font-semibold flex-shrink-0 t-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary-text'
                        }`}
                      >
                        {alt.key}
                      </span>
                      <span className="font-reading text-body leading-[var(--lh-reading)] pt-0.5 flex-1">
                        <MathText text={alt.text ?? ''} />
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] type-meta font-medium bg-muted hover:bg-muted/80 t-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <div className="flex items-center gap-1">
            {/* Mini question dots */}
            <div className="hidden md:flex gap-1 flex-wrap max-w-xs justify-center">
              {questions.slice(0, 45).map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => handleNavigate(i)}
                  data-numeric
                  aria-label={`Ir para questão ${i + 1}${answers[q.id] ? ', respondida' : ''}`}
                  className={`w-5 h-5 rounded-[var(--radius-control)] type-caption flex items-center justify-center t-colors ${
                    i === currentIdx
                      ? 'bg-primary text-primary-foreground'
                      : answers[q.id]
                        ? 'bg-primary/15 text-primary-text'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => handleNavigate(currentIdx + 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] type-meta font-medium bg-muted hover:bg-muted/80 t-colors"
            >
              Próxima <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (answeredCount < questions.length) {
                  const ok = window.confirm(
                    `Você respondeu ${answeredCount} de ${questions.length} questões. Deseja finalizar mesmo assim?`
                  );
                  if (!ok) return;
                }
                handleSubmit();
              }}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-control)] bg-primary text-primary-foreground type-meta font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Finalizar'}
            </button>
          )}
        </div>

        {/* Question grid for mobile */}
        <div className="md:hidden mt-4 surface-1 rounded-[var(--radius-surface)] p-3">
          <p className="type-caption text-muted-foreground mb-2">Navegação rápida</p>
          <div className="flex gap-1.5 flex-wrap">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => handleNavigate(i)}
                data-numeric
                aria-label={`Ir para questão ${i + 1}${answers[q.id] ? ', respondida' : ''}`}
                className={`w-7 h-7 rounded-[var(--radius-control)] type-caption flex items-center justify-center t-colors ${
                  i === currentIdx
                    ? 'bg-primary text-primary-foreground'
                    : answers[q.id]
                      ? 'bg-primary/15 text-primary-text'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RESULT PHASE ---
  if (phase === 'result' && results) {
    const porMateriaEntries = Object.entries(results.porMateria ?? {}) as [string, any][];

    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onAnimationComplete={() => { if (results.taxaAcerto >= 60) fireConfetti(); }}>
          {/* Score Header */}
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 md:p-8 mb-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Trophy className="w-12 h-12 text-primary-text mx-auto mb-4" />
            </motion.div>
            <h1 className="mb-2">
              <span data-numeric className="font-display type-hero font-semibold">{results.taxaAcerto}%</span>{' '}
              <span className="type-lead text-muted-foreground">de acerto</span>
            </h1>
            <p data-numeric className="type-body text-muted-foreground">
              {results.totalCorretas} corretas de {results.totalQuestoes} questões
            </p>
            {results.timerUsed && (
              <p data-numeric className="type-meta text-muted-foreground mt-1">
                Tempo: {formatTime(results.tempoGasto ?? 0)}
              </p>
            )}

            <div className="flex justify-center gap-6 mt-6">
              <div className="text-center">
                <p data-numeric className="type-lead font-bold" style={{ color: 'hsl(var(--success))' }}>{results.totalCorretas}</p>
                <p className="type-caption text-muted-foreground">Corretas</p>
              </div>
              <div className="text-center">
                <p data-numeric className="type-lead font-bold" style={{ color: 'hsl(var(--danger))' }}>{results.totalErradas}</p>
                <p className="type-caption text-muted-foreground">Erradas</p>
              </div>
              <div className="text-center">
                <p data-numeric className="type-lead font-bold text-muted-foreground">
                  {results.totalQuestoes - results.totalCorretas - results.totalErradas}
                </p>
                <p className="type-caption text-muted-foreground">Em branco</p>
              </div>
            </div>
          </div>

          {/* Per Materia Breakdown */}
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6">
            <h2 className="font-display type-title font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-text" />
              Desempenho por Matéria
            </h2>
            <div className="space-y-3">
              {porMateriaEntries.map(([materia, data]) => {
                const rate = data.total > 0 ? data.corretas / data.total : 0;
                return (
                  <div key={materia} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          aria-hidden
                          className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                          style={{ backgroundColor: (materiaColors as any)[materia] ?? 'hsl(var(--muted-foreground))' }}
                        />
                        <span className="type-meta font-medium truncate">{materia}</span>
                      </div>
                      <TaxaAcerto total={data.total} acertos={data.corretas} />
                    </div>
                    {data.total >= MIN_QUESTOES_PARA_TAXA && (
                      <div className="h-1.5 bg-muted rounded-[var(--radius-data)] overflow-hidden">
                        <div
                          className="h-full w-full rounded-[var(--radius-data)] origin-left transition-transform duration-medium ease-out-quart"
                          style={{
                            transform: `scaleX(${rate})`,
                            backgroundColor: rate >= 0.7 ? 'hsl(var(--success))' : rate < 0.5 ? 'hsl(var(--danger))' : 'hsl(var(--foreground) / 0.35)',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Materias to reinforce */}
          {(results.materiasReforcar?.length ?? 0) > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-[var(--radius-surface)] p-6 mb-6">
              <h3 className="font-display type-lead font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Matérias para Reforçar
              </h3>
              <div className="space-y-2">
                {results.materiasReforcar.map((m: any) => {
                  const md = results.porMateria?.[m.materia];
                  return (
                    <div key={m.materia} className="flex items-center justify-between gap-3 p-2.5 rounded-[var(--radius-control)] bg-background">
                      <span className="type-meta font-medium truncate">{m.materia}</span>
                      <TaxaAcerto total={md?.total ?? 0} acertos={md?.corretas ?? 0} />
                    </div>
                  );
                })}
              </div>
              <p className="type-caption text-muted-foreground mt-3">
                Essas matérias serão priorizadas nos seus próximos treinos e revisões.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setPhase('config'); setResults(null); setSessionId(null); }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-[var(--radius-control)] type-meta font-medium shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3"
            >
              Novo Simulado
            </button>
            <button
              onClick={() => router.push('/caderno-erros')}
              className="flex items-center gap-2 bg-muted text-foreground px-6 py-3 rounded-[var(--radius-control)] type-meta font-medium t-colors hover:bg-secondary"
            >
              Ver Caderno de Erros
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 bg-muted text-foreground px-6 py-3 rounded-[var(--radius-control)] type-meta font-medium t-colors hover:bg-secondary"
            >
              Voltar ao Início
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
