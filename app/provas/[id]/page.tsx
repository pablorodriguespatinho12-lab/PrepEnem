'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, XCircle, Trophy, Loader2, ArrowRight, BookOpen, Target, Brain, AlertTriangle, AlertCircle, RefreshCcw, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';
import dynamic from 'next/dynamic';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });
import { ExplicacaoTutor } from '@/components/tutor/explicacao-tutor';

/* Limiares de dado esparso — mesma regra usada em app/dashboard/page.tsx. */
const MIN_QUESTOES_PARA_TAXA = 5;
const LIMIAR_BAIXA_CONFIANCA = 15;

export default function ProvaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const shouldReduceMotion = useReducedMotion();

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Questão da revisão final com a explicação aberta (uma por vez).
  const [revisaoAberta, setRevisaoAberta] = useState<string | null>(null);
  const fetchExam = useCallback(async () => {
    try {
      const res = await fetch(`/api/provas/${examId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro');
        router.push('/provas');
        return;
      }
      setExam(data.exam);
    } catch (e) {
      toast.error('Erro ao carregar prova');
    } finally {
      setLoading(false);
    }
  }, [examId, router]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);
  // Todas respondidas mas a prova não fechou: finaliza uma vez só.
  const finalizando = useRef(false);
  const semQuestaoAtual = !!exam && exam.status !== 'finalizada' && !exam.questions?.[exam.currentIdx];
  useEffect(() => {
    if (!semQuestaoAtual || finalizando.current) return;
    finalizando.current = true;
    fetch('/api/provas/finalizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('finalizar');
        return fetchExam();
      })
      .catch(() => {
        toast.error('Não consegui fechar a prova agora.');
        router.push('/provas');
      });
  }, [semQuestaoAtual, examId, fetchExam, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-text" />
      </div>
    );
  }

  if (!exam) return null;

  // If finalized, show results
  if (exam.status === 'finalizada') {
    const totalQuestoes = exam.totalQuestoes || 0;
    const sparse = totalQuestoes < MIN_QUESTOES_PARA_TAXA;
    const lowConfidence = !sparse && totalQuestoes < LIMIAR_BAIXA_CONFIANCA;
    const pct = totalQuestoes > 0 ? Math.round((exam.acertos / totalQuestoes) * 100) : 0;
    return (
      <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/provas')}
          className="flex items-center gap-2 type-meta text-muted-foreground hover:text-foreground t-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10 surface-1 rounded-[var(--radius-container)] p-8 md:p-10"
        >
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Trophy className="w-16 h-16 text-amber-500" />
          </motion.div>
          <h1 className="font-display type-headline font-semibold mb-2">Prova Finalizada!</h1>
          <p className="text-muted-foreground mb-6">{exam.nome}</p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-[var(--radius-surface)] p-4"
              style={{ backgroundColor: 'hsl(var(--success-surface))' }}
            >
              <p data-numeric className="font-display type-display font-semibold" style={{ color: 'hsl(var(--success))' }}>
                {exam.acertos}
              </p>
              <p className="type-caption text-muted-foreground mt-1">Acertos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[var(--radius-surface)] p-4"
              style={{ backgroundColor: 'hsl(var(--danger-surface))' }}
            >
              <p data-numeric className="font-display type-display font-semibold" style={{ color: 'hsl(var(--danger))' }}>
                {exam.erros}
              </p>
              <p className="type-caption text-muted-foreground mt-1">Erros</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="surface-2 rounded-[var(--radius-surface)] p-4"
            >
              <p data-numeric className="font-display type-display font-semibold text-primary-text flex items-center justify-center gap-1">
                {sparse ? '—' : `${pct}%`}
                {lowConfidence && (
                  <AlertCircle
                    className="w-3.5 h-3.5 text-muted-foreground"
                    aria-label="Poucas questões: percentual pouco confiável"
                  />
                )}
              </p>
              <p className="type-caption text-muted-foreground mt-1">Aproveitamento</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Review of all questions */}
        <div className="space-y-4">
          <h2 className="font-display type-title font-semibold mb-3">Revisão</h2>
          {exam.questions.map((eq: any, idx: number) => {
            const q = eq.question;
            const acertou = eq.acertou;
            return (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx, 6) * 0.04 }}
                className="surface-1 rounded-[var(--radius-surface)] p-5"
                style={acertou === null ? undefined : { borderColor: acertou ? 'hsl(var(--success-border))' : 'hsl(var(--danger-border))' }}
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <span className="type-meta font-semibold text-muted-foreground">Questão {idx + 1}</span>
                  {acertou !== null && (
                    <span style={{ color: acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
                      {acertou ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
                    </span>
                  )}
                </div>
                <div className="prose-reading mb-3">
                  <MathText text={q.enunciado} />
                </div>
                <div className="type-meta text-muted-foreground">
                  Sua resposta:{' '}
                  <span className="font-semibold" style={{ color: acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
                    {eq.respostaDada || '—'}
                  </span>
                  {!acertou && (
                    <>
                      {' '}| Correta:{' '}
                      <span className="font-semibold" style={{ color: 'hsl(var(--success))' }}>{q.respostaCorreta}</span>
                    </>
                  )}
                </div>

                {/* Explicação visual da questão, uma aberta por vez */}
                <div className="mt-3 border-t border-border pt-3">
                  {revisaoAberta === eq.id ? (
                    <ExplicacaoTutor questao={q} respostaDada={eq.respostaDada} iniciarSozinha />
                  ) : (
                    <button
                      onClick={() => setRevisaoAberta(eq.id)}
                      className="flex items-center gap-2 type-meta text-primary-text font-medium hover:underline underline-offset-4"
                    >
                      <Brain className="w-4 h-4" />
                      {acertou ? 'Ver explicação' : 'Me explica com desenho'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active prova
  const currentEQ = exam.questions[exam.currentIdx];
  const isLast = exam.currentIdx === exam.totalQuestoes - 1;

  if (!currentEQ) {
    // Finalizar mora num efeito com trava (finalizarSemQuestao): chamado aqui
    // no render, cada re-render disparava outro par de requisições, em laço.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-text" />
      </div>
    );
  }

  const q = currentEQ.question;
  const alternativas = [
    { letra: 'A', texto: q.alternativaA },
    { letra: 'B', texto: q.alternativaB },
    { letra: 'C', texto: q.alternativaC },
    { letra: 'D', texto: q.alternativaD },
    { letra: 'E', texto: q.alternativaE },
  ];

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    setSubmitting(true);
    setSubmitError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch('/api/provas/responder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, questionId: q.id, respostaDada: selectedAnswer }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Erro ao verificar resposta.');
      }
      setFeedback(data);
      setSubmitted(true);
    } catch (e: any) {
      const message =
        e?.name === 'AbortError'
          ? 'A verificação demorou demais. Confira sua conexão e tente de novo.'
          : e?.message || 'Erro ao enviar resposta.';
      setSubmitError(message);
      toast.error(message);
    } finally {
      clearTimeout(timeoutId);
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (isLast) {
      await fetch('/api/provas/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId }),
      });
      toast.success('Prova finalizada!');
      fetchExam();
    } else {
      setSelectedAnswer(null);
      setSubmitted(false);
      setFeedback(null);
      setSubmitError(null);
      fetchExam();
    }
  };

  const progress = (exam.currentIdx + (submitted ? 1 : 0)) / exam.totalQuestoes;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/provas')}
        className="flex items-center gap-2 type-meta text-muted-foreground hover:text-foreground t-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3 gap-3">
          <h1 className="font-display type-headline font-semibold truncate">{exam.nome}</h1>
          <span data-numeric className="type-meta font-medium text-muted-foreground shrink-0">
            {exam.currentIdx + 1}/{exam.totalQuestoes}
          </span>
        </div>
        <div className="h-px w-full bg-border overflow-hidden" role="presentation">
          <div
            className="h-full w-full bg-primary origin-left transition-transform duration-medium ease-out-quart"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </motion.div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
          className="surface-1 rounded-[var(--radius-surface)] p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-6 type-meta text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <span
                aria-hidden
                className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                style={{ backgroundColor: materiaColors[q.materia] ?? 'hsl(var(--muted-foreground))' }}
              />
              {q.materia}
            </span>
            {q.subtema && (
              <>
                <span aria-hidden className="text-border">/</span>
                <span className="truncate max-w-[22rem]">{q.subtema}</span>
              </>
            )}
          </div>
          <div className="prose-reading mb-6">
            <MathText text={q.enunciado} />
          </div>

          <div className="space-y-2">
            {alternativas.map((alt, i) => {
              // isCorrect/isWrong só existem quando `submitted` é true, e `submitted` só vira
              // true depois que `feedback` já foi setado (mesmo bloco síncrono em
              // handleSubmit) — não há janela onde submitted=true e feedback=null aqui.
              const isCorrect = submitted && alt.letra === feedback?.respostaCorreta;
              const isWrong = submitted && selectedAnswer === alt.letra && alt.letra !== feedback?.respostaCorreta;
              const isSelected = !submitted && selectedAnswer === alt.letra;
              const isChecking = submitting && selectedAnswer === alt.letra;

              return (
                <motion.button
                  key={alt.letra}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isCorrect && !shouldReduceMotion
                      ? { opacity: 1, x: 0, scale: [1, 1.08, 1] }
                      : { opacity: 1, x: 0, scale: 1 }
                  }
                  transition={
                    isCorrect && !shouldReduceMotion
                      ? { duration: 0.35, ease: 'easeOut' }
                      : { delay: i * 0.08, duration: 0.3 }
                  }
                  disabled={submitted || submitting}
                  onClick={() => !submitted && !submitting && setSelectedAnswer(alt.letra)}
                  data-alt={alt.letra}
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
                >
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
                    {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : alt.letra}
                  </span>
                  <span className="font-reading text-body leading-[var(--lh-reading)] pt-0.5 flex-1">
                    <MathText text={alt.texto} />
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback + Explanation after answer */}
          {submitted && feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              {/* Correct/Incorrect feedback */}
              <div
                className="rounded-[var(--radius-surface)] border p-4"
                style={{
                  backgroundColor: feedback.acertou ? 'hsl(var(--success-surface))' : 'hsl(var(--danger-surface))',
                  borderColor: feedback.acertou ? 'hsl(var(--success-border))' : 'hsl(var(--danger-border))',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: feedback.acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
                    {feedback.acertou ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
                  </span>
                  <span
                    className="font-display type-lead font-semibold"
                    style={{ color: feedback.acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}
                  >
                    {feedback.acertou ? 'Correto' : 'Incorreto'}
                  </span>
                </div>
                {!feedback.acertou && (
                  <p className="type-meta text-foreground/80">
                    Resposta correta:{' '}
                    <span className="font-semibold" style={{ color: 'hsl(var(--success))' }}>{feedback.respostaCorreta}</span>
                  </p>
                )}
              </div>

              <ExplicacaoTutor questao={q} respostaDada={selectedAnswer} iniciarSozinha={!feedback.acertou} />
            </motion.div>
          )}

          {/* Error state: fetch failed or timed out */}
          {submitError && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-[var(--radius-surface)] p-4 bg-amber-500/10 border border-amber-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-display type-lead font-semibold text-amber-700">Não deu pra verificar</span>
              </div>
              <p className="type-meta text-foreground/80 mb-3">{submitError}</p>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-[var(--radius-control)] font-medium type-meta t-colors hover:opacity-90"
              >
                <RefreshCcw className="w-4 h-4" /> Tentar novamente
              </button>
            </motion.div>
          )}

          {/* Submit / Next */}
          <div className="flex justify-end mt-6">
            {!submitted ? (
              <button
                disabled={!selectedAnswer || submitting}
                onClick={handleSubmit}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift enabled:hover:-translate-y-px enabled:hover:shadow-elev-3 disabled:opacity-40 disabled:shadow-elev-1 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                Confirmar
              </button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3 flex items-center gap-2"
              >
                {isLast ? (
                  <>
                    <Trophy className="w-4 h-4" />
                    Finalizar Prova
                  </>
                ) : (
                  <>
                    Próxima
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
