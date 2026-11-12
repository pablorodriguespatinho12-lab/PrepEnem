'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, Trophy, Loader2, ArrowRight, Target, Brain, AlertCircle, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';
import { ETAPA_LABEL, etapaDaQuestao } from '@/lib/treino-etapas';
import { PaginaDaProva } from '@/components/pagina-da-prova';
import { ImagemIndisponivel } from '@/components/pdf-page-viewer';
import { semMarcaDeImagem } from '@/lib/enunciado-sem-alternativas';
import dynamic from 'next/dynamic';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });
import { ExplicacaoTutor } from '@/components/tutor/explicacao-tutor';
import { EsqueletoQuestao } from '@/components/esqueletos';
import { AquecimentoFlashcards } from '@/components/simulado/aquecimento-flashcards';
import { AulaDoTema } from '@/components/simulado/aula-do-tema';
import { temaDaQuestao } from '@/lib/aulas-dia-2';
import { MundoPixel } from '@/components/pixel/mundo-pixel';
import { CenaFim } from '@/components/pixel/cena-fim';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';
import { useTelaCheia } from '@/hooks/use-tela-cheia';

/* Faíscas da alternativa escolhida (voto 2A): 6 quadradinhos saindo da letra. */
const FAISCAS: [number, number][] = [[-26, -18], [0, -28], [26, -18], [-26, 18], [0, 28], [26, 18]];
/* Anéis do acerto/erro (voto 3A): três, um atrás do outro. */
const ANEIS_MS = [0, 90, 180];

/* Limiares de dado esparso — mesma regra usada em app/dashboard/page.tsx. */
const MIN_QUESTOES_PARA_TAXA = 5;
const LIMIAR_BAIXA_CONFIANCA = 15;
const TENTATIVAS_DE_SALVAR = 3;

/* Grava a resposta; tenta de novo se a rede piscar (o servidor ignora repetida). */
async function salvarResposta(examId: string, questionId: string, respostaDada: string): Promise<void> {
  for (let tentativa = 1; ; tentativa++) {
    try {
      const res = await fetch('/api/provas/responder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, questionId, respostaDada }),
      });
      if (res.ok || res.status < 500) return;
    } catch {
      // rede caiu: tenta de novo abaixo
    }
    if (tentativa >= TENTATIVAS_DE_SALVAR) throw new Error('responder');
    await new Promise((r) => setTimeout(r, 800 * tentativa));
  }
}

export default function ProvaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const shouldReduceMotion = useReducedMotion();
  const mundo = useMundoAnimado();
  const telaCheia = useTelaCheia();
  // muda a cada toque numa alternativa: remonta as faíscas para tocarem de novo
  const [toque, setToque] = useState(0);

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [fechando, setFechando] = useState(false);
  // Respostas ainda a caminho do servidor; a prova só fecha depois delas.
  const salvando = useRef<Promise<void>[]>([]);
  const cartoesAntes = Number(useSearchParams().get('cartoes')) || 0;
  const [aquecido, setAquecido] = useState(false);
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
      <div className="p-4 md:p-8 max-w-4xl mx-auto"><EsqueletoQuestao rotulo="Carregando a prova" /></div>
    );
  }

  if (!exam) return null;

  // Flashcards antes, escolhidos ao criar a prova (só antes da 1ª questão).
  if (cartoesAntes > 0 && !aquecido && exam.status === 'pendente' && exam.currentIdx === 0) {
    return <AquecimentoFlashcards deckId="dia" quantidade={cartoesAntes} onFim={() => setAquecido(true)} />;
  }

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
          {/* Casinha acesa no escuro (voto 4A, 12/11/2026). */}
          <CenaFim acertos={exam.acertos} total={totalQuestoes} />
          <h1 className="sr-only">Prova finalizada</h1>
          <p className="text-muted-foreground mt-5 mb-6">{exam.nome}</p>

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
                  <MathText text={semMarcaDeImagem(q.enunciado)} />
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

  // A letra certa já vem com a questão: o acerto aparece no toque e a resposta
  // é gravada por trás (Pablo, 22/10/2026: "demora para ele ver que acerta").
  const handleSubmit = () => {
    if (!selectedAnswer || submitted) return;
    const acertou = selectedAnswer === q.respostaCorreta;
    setFeedback({ acertou, respostaCorreta: q.respostaCorreta });
    setSubmitted(true);
    setExam((e: any) => ({
      ...e,
      acertos: e.acertos + (acertou ? 1 : 0),
      erros: e.erros + (acertou ? 0 : 1),
      questions: e.questions.map((eq: any, i: number) =>
        i === e.currentIdx ? { ...eq, answered: true, respostaDada: selectedAnswer, acertou } : eq
      ),
    }));
    const numero = exam.currentIdx + 1;
    salvando.current.push(
      salvarResposta(examId, q.id, selectedAnswer).catch(() => {
        toast.error(`Não consegui salvar a questão ${numero}. Confira a internet.`);
      })
    );
  };

  // Próxima troca a questão na hora. Antes recarregava a prova inteira e, até
  // chegar, a questão de antes voltava sem resposta na tela.
  const handleNext = async () => {
    if (isLast) {
      setFechando(true);
      await Promise.allSettled(salvando.current);
      await fetch('/api/provas/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId }),
      });
      toast.success('Prova finalizada!');
      await fetchExam();
      setFechando(false);
      return;
    }
    setSelectedAnswer(null);
    setSubmitted(false);
    setFeedback(null);
    setExam((e: any) => ({ ...e, currentIdx: e.currentIdx + 1, status: 'em_andamento' }));
    window.scrollTo({ top: 0 });
  };

  const progress = (exam.currentIdx + (submitted ? 1 : 0)) / exam.totalQuestoes;

  // Mundo pixel atrás da prova (Pablo, 12/11/2026): o céu aparece em cima do
  // cartão, a serra embaixo, e o dia e a noite passam enquanto ele estuda.
  return (
    <div className="relative min-h-screen">
      <MundoPixel animado={mundo.animado} />
      <div className="relative z-[1] min-h-screen px-4 pb-10 md:px-10 pt-[min(20vh,170px)] max-w-4xl mx-auto">
      <div className="absolute top-4 right-4 md:right-10 flex gap-3">
        <button type="button" className="px-chip" aria-pressed={mundo.animado} onClick={mundo.alternar}>
          {mundo.animado ? 'Mundo animado' : 'Mundo parado'}
        </button>
        <button type="button" className="px-chip" aria-pressed={telaCheia.ativa} onClick={telaCheia.alternar}>
          {telaCheia.ativa ? 'Sair da tela cheia' : 'Tela cheia'}
        </button>
      </div>
      <div className="px-cartao p-5 md:p-8">
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
            {/* Nível da questão (Pablo, 03/11/2026: "cadê o nível das questões?"). */}
            <span className="type-caption px-2 py-0.5 rounded-[var(--radius-data)] bg-muted text-foreground font-medium">
              {etapaDaQuestao(q) === 'enem' && q.anoProva ? `ENEM ${q.anoProva} · questão real` : ETAPA_LABEL[etapaDaQuestao(q)]}
            </span>
            {q.subtema && (
              <>
                <span aria-hidden className="text-border">/</span>
                <span className="truncate max-w-[22rem]">{q.subtema}</span>
              </>
            )}
          </div>
          <div className="prose-reading mb-6">
            <MathText text={semMarcaDeImagem(q.enunciado)} />
          </div>
          <AulaDoTema key={`aula-${q.id}`} tema={temaDaQuestao(q)} questao={q} className="mb-6" />
          {/* A figura da questão real (a prova não mostrava; Pablo, 03/11/2026). */}
          {q.pdfFileUrl && q.paginaPdf && (
            <PaginaDaProva
              key={q.id}
              pdfUrl={q.pdfFileUrl}
              pagina={q.paginaPdf}
              imagemUrl={q.imagemUrl}
              imagemUrlExpandida={q.imagemUrlExpandida}
              precisaDaImagem={Boolean(q.dependeImagem)}
              className="mb-6"
            />
          )}
          {q.dependeImagem && !q.pdfFileUrl && <ImagemIndisponivel className="mb-6" />}

          <div className="space-y-2">
            {alternativas.map((alt, i) => {
              // isCorrect/isWrong só existem quando `submitted` é true, e `submitted` só vira
              // true depois que `feedback` já foi setado (mesmo bloco síncrono em
              // handleSubmit) — não há janela onde submitted=true e feedback=null aqui.
              const isCorrect = submitted && alt.letra === feedback?.respostaCorreta;
              const isWrong = submitted && selectedAnswer === alt.letra && alt.letra !== feedback?.respostaCorreta;
              const isSelected = !submitted && selectedAnswer === alt.letra;

              // A alternativa respondida (a marcada) abre os anéis; a certa só acende.
              const respondida = submitted && selectedAnswer === alt.letra;
              return (
                // A entrada fica no invólucro: o transform do framer no botão
                // apagaria o "afundar" de 4 px do CSS (.px-alt).
                <motion.div
                  key={alt.letra}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => {
                      if (submitted) return;
                      setSelectedAnswer(alt.letra);
                      setToque((t) => t + 1);
                    }}
                    data-alt={alt.letra}
                    data-state={isCorrect ? 'correta' : isWrong ? 'errada' : isSelected ? 'selecionada' : 'repouso'}
                    className="px-alt"
                  >
                    <span aria-hidden className="px-letra">{alt.letra}</span>
                    <span className="font-reading text-body leading-[var(--lh-reading)] pt-0.5 flex-1">
                      <MathText text={alt.texto} />
                    </span>
                    {isSelected &&
                      FAISCAS.map(([dx, dy], k) => (
                        <span
                          key={`${toque}-${k}`}
                          aria-hidden
                          className="px-faisca"
                          style={{ left: 'calc(1rem + 1.05rem - 3px)', top: 'calc(.875rem + 1.05rem - 3px)', ['--dx' as string]: `${dx}px`, ['--dy' as string]: `${dy}px` }}
                        />
                      ))}
                    {respondida &&
                      mundo.animado &&
                      ANEIS_MS.map((ms) => (
                        <span key={ms} aria-hidden className="px-anel" style={{ ['--atraso' as string]: `${ms}ms` }} />
                      ))}
                  </button>
                </motion.div>
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

          {/* Submit / Next */}
          <div className="flex justify-end mt-6">
            {!submitted ? (
              <button
                disabled={!selectedAnswer}
                onClick={handleSubmit}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift enabled:hover:-translate-y-px enabled:hover:shadow-elev-3 disabled:opacity-40 disabled:shadow-elev-1 flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Confirmar
              </button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                disabled={fechando}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3 flex items-center gap-2"
              >
                {isLast ? (
                  <>
                    {fechando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
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
      </div>
    </div>
  );
}
