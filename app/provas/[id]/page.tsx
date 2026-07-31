'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, XCircle, Trophy, Loader2, ArrowRight, BookOpen, Target, Brain, AlertTriangle, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';
import dynamic from 'next/dynamic';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

export default function ProvaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [llmExplanation, setLlmExplanation] = useState('');
  const [generatingExplanation, setGeneratingExplanation] = useState(false);

  // Track explanations for review screen
  const [reviewExplanations, setReviewExplanations] = useState<Record<string, string>>({});
  const [reviewGenerating, setReviewGenerating] = useState<string | null>(null);

  const generateExplanation = async (question: any, answeredLetter: string | null, targetKey?: string) => {
    const isReview = !!targetKey;
    if (isReview) {
      setReviewGenerating(targetKey);
    } else {
      setGeneratingExplanation(true);
      setLlmExplanation('');
    }
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enunciado: question.enunciado,
          alternativas: {
            A: question.alternativaA,
            B: question.alternativaB,
            C: question.alternativaC,
            D: question.alternativaD,
            E: question.alternativaE,
          },
          respostaCorreta: question.respostaCorreta,
          respostaDada: answeredLetter || question.respostaCorreta,
          materia: question.materia,
        }),
      });
      if (!res.ok) {
        toast.error('Erro ao gerar explicação');
        return;
      }
      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let buffer = '';
      let partial = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        partial += decoder.decode(value, { stream: true });
        const lines = partial.split('\n');
        partial = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const content = parsed?.choices?.[0]?.delta?.content ?? '';
              buffer += content;
              if (isReview) {
                setReviewExplanations(prev => ({ ...prev, [targetKey]: buffer }));
              } else {
                setLlmExplanation(buffer);
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      toast.error('Erro ao gerar explicação');
    } finally {
      if (isReview) {
        setReviewGenerating(null);
      } else {
        setGeneratingExplanation(false);
      }
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!exam) return null;

  // If finalized, show results
  if (exam.status === 'finalizada') {
    const pct = exam.totalQuestoes > 0 ? Math.round((exam.acertos / exam.totalQuestoes) * 100) : 0;
    return (
      <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/provas')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-200 dark:border-violet-800 rounded-3xl p-10"
        >
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Trophy className="w-20 h-20 text-amber-500" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Prova Finalizada!</h1>
          <p className="text-muted-foreground mb-6">{exam.nome}</p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-4">
              <div className="text-3xl font-bold text-emerald-600">{exam.acertos}</div>
              <div className="text-xs text-muted-foreground">Acertos</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-4">
              <div className="text-3xl font-bold text-rose-600">{exam.erros}</div>
              <div className="text-xs text-muted-foreground">Erros</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card border border-border rounded-2xl p-4">
              <div className="text-3xl font-bold text-violet-600">{pct}%</div>
              <div className="text-xs text-muted-foreground">Aproveitamento</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Review of all questions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-3">Revisão</h2>
          {exam.questions.map((eq: any, idx: number) => {
            const q = eq.question;
            const acertou = eq.acertou;
            return (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-card border-2 rounded-2xl p-5 ${
                  acertou === null ? 'border-border' : acertou ? 'border-emerald-300 dark:border-emerald-700' : 'border-rose-300 dark:border-rose-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <span className="text-sm font-bold text-muted-foreground">Questão {idx + 1}</span>
                  {acertou !== null && (
                    acertou ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-500" />
                    )
                  )}
                </div>
                <div className="text-foreground mb-3">
                  <MathText text={q.enunciado} />
                </div>
                <div className="text-sm text-muted-foreground">
                  Sua resposta: <span className={`font-bold ${acertou ? 'text-emerald-600' : 'text-rose-600'}`}>{eq.respostaDada || '—'}</span>
                  {!acertou && (
                    <>
                      {' '} | Correta: <span className="font-bold text-emerald-600">{q.respostaCorreta}</span>
                    </>
                  )}
                </div>

                {/* Explanation button for each question */}
                <div className="mt-3 border-t border-border pt-3">
                  <button
                    onClick={() => generateExplanation(q, eq.respostaDada, eq.id)}
                    disabled={reviewGenerating === eq.id}
                    className="flex items-center gap-2 text-sm text-violet-600 font-medium hover:underline"
                  >
                    <Brain className="w-4 h-4" />
                    {reviewGenerating === eq.id ? 'Gerando...' : (reviewExplanations[eq.id] ? 'Explicação ↓' : `${acertou ? '📚 Ver explicação' : '🧠 Gerar explicação'}`)}
                  </button>
                  {reviewGenerating === eq.id && !reviewExplanations[eq.id] && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                      <span className="text-xs text-muted-foreground">Gerando...</span>
                    </div>
                  )}
                  {reviewExplanations[eq.id] && (
                    <div className="text-sm text-foreground/80 leading-relaxed bg-muted/50 rounded-lg p-3 mt-2">
                      <MathText text={reviewExplanations[eq.id]} />
                    </div>
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
    // All answered but not finalized? Finalize now
    fetch('/api/provas/finalizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId }),
    }).then(() => fetchExam());
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
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
      setLlmExplanation('');
      setGeneratingExplanation(false);
      fetchExam();
    }
  };

  const progress = ((exam.currentIdx + (submitted ? 1 : 0)) / exam.totalQuestoes) * 100;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/provas')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">{exam.nome}</h1>
          <span className="text-sm font-bold text-muted-foreground">
            {exam.currentIdx + 1}/{exam.totalQuestoes}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
          />
        </div>
      </motion.div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md"
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs px-2.5 py-1 rounded-md text-white font-bold"
              style={{ backgroundColor: materiaColors[q.materia] || '#a855f7' }}
            >
              {q.materia}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-bold">
              {q.subtema}
            </span>
          </div>
          <div className="text-foreground text-base leading-relaxed mb-6">
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
                  whileHover={!submitted && !submitting ? { scale: 1.01, x: 4 } : {}}
                  whileTap={!submitted && !submitting ? { scale: 0.99 } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  disabled={submitted || submitting}
                  onClick={() => !submitted && !submitting && setSelectedAnswer(alt.letra)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                    isCorrect
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                      : isWrong
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                        : isSelected
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
                          : 'border-border bg-background hover:border-violet-300'
                  }`}
                >
                  <span
                    className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isCorrect
                        ? 'bg-emerald-500 text-white'
                        : isWrong
                          ? 'bg-rose-500 text-white'
                          : isSelected
                            ? 'bg-violet-500 text-white'
                            : 'bg-muted text-foreground'
                    }`}
                  >
                    {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : alt.letra}
                  </span>
                  <span className="text-foreground flex-1">
                    <MathText text={alt.texto} />
                  </span>
                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                  {isWrong && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
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
              <div className={`rounded-xl p-4 ${feedback.acertou ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {feedback.acertou ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className={`font-bold ${feedback.acertou ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {feedback.acertou ? 'Correto! 🎉' : 'Incorreto 😔'}
                  </span>
                </div>
                {!feedback.acertou && (
                  <p className="text-sm text-foreground/70">
                    Resposta correta: <span className="font-bold text-emerald-600">{feedback.respostaCorreta}</span>
                  </p>
                )}
              </div>

              {/* AI Explanation */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <button
                  onClick={() => generateExplanation(q, selectedAnswer)}
                  disabled={generatingExplanation}
                  className="flex items-center gap-2 text-sm text-violet-600 font-medium hover:underline mb-3"
                >
                  <Brain className="w-4 h-4" />
                  {generatingExplanation ? 'Gerando explicação...' : `${feedback.acertou ? '📚 Ver explicação detalhada' : '🧠 Gerar explicação detalhada com IA'}`}
                </button>
                {generatingExplanation && !llmExplanation && (
                  <div className="flex items-center gap-2 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                    <span className="text-sm text-muted-foreground">Gerando...</span>
                  </div>
                )}
                {llmExplanation && (
                  <div className="text-sm text-foreground/80 leading-relaxed bg-muted/50 rounded-lg p-4">
                    <MathText text={llmExplanation} />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Error state: fetch failed or timed out */}
          {submitError && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl p-4 bg-amber-500/10 border border-amber-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-amber-700">Não deu pra verificar</span>
              </div>
              <p className="text-sm text-foreground/70 mb-3">{submitError}</p>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium text-sm hover:opacity-90 transition"
              >
                <RefreshCcw className="w-4 h-4" /> Tentar novamente
              </button>
            </motion.div>
          )}

          {/* Submit / Next */}
          <div className="flex justify-end mt-6">
            {!submitted ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!selectedAnswer || submitting}
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                Confirmar
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
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
