'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { MapaQuestoes } from '@/components/provas/mapa-questoes';
import { BarraQuestao } from '@/components/provas/barra-questao';
import { useMarcadas } from '@/components/provas/use-marcadas';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, Trophy, Loader2, Brain, AlertCircle, Check, X, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';
import { etapaDaQuestao, rotuloDaQuestao } from '@/lib/treino-etapas';
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
import { FiguraPixel } from '@/components/visual/figura-pixel';
import { cenaDaQuestao } from '@/lib/cenas-das-questoes';
import type { NomeFigura } from '@/lib/visual/especificacao';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';
import { useTelaCheia } from '@/hooks/use-tela-cheia';

/* Faíscas da alternativa escolhida (voto 2A): 6 quadradinhos saindo da letra. */
const FAISCAS: [number, number][] = [[-26, -18], [0, -28], [26, -18], [-26, 18], [0, 28], [26, 18]];
/* Anéis do acerto/erro (voto 3A): três, um atrás do outro. */
const ANEIS_MS = [0, 90, 180];

/* Questão de reforço (Pablo, 12/11/2026): errou, vem uma parecida do mesmo
   conteúdo para ver se entendeu (app/api/provas/reforco). Não conta na nota.
   As já vistas ficam no navegador, para a próxima vez trazer outra. */
type Reforco = { questao: any; figura: { nome: NomeFigura; rotulos?: string[] } | null };
const CHAVE_REFORCO = 'prepenem:reforco-usadas';
/* Qual correção estava aberta nesta aba (índice da questão): ver fetchExam. */
const CHAVE_CORRECAO = (examId: string) => `prepenem:vendo-correcao:${examId}`;
const RESPOSTA_RECENTE_MS = 10 * 60 * 1000;
const lerUsadas = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_REFORCO) ?? '[]');
  } catch {
    return [];
  }
};
const marcarUsada = (id: string) => {
  try {
    localStorage.setItem(CHAVE_REFORCO, JSON.stringify([...lerUsadas().filter((x) => x !== id), id].slice(-200)));
  } catch {
    // sem armazenamento: só repete reforço
  }
};
async function buscarReforco(tema: string | null | undefined, excluir: string): Promise<Reforco | null> {
  if (!tema) return null;
  const usadas = [...lerUsadas(), excluir].join(',');
  const res = await fetch(`/api/provas/reforco?tema=${encodeURIComponent(tema)}&usadas=${encodeURIComponent(usadas)}`).catch(() => null);
  const dados = res?.ok ? await res.json().catch(() => null) : null;
  return dados?.questao ? { questao: dados.questao, figura: dados.figura ?? null } : null;
}

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
  const { marcadas, alternar: alternarMarca } = useMarcadas(examId);
  // Questão já respondida aberta pelo mapa; null = a atual.
  const [vendo, setVendo] = useState<number | null>(null);
  // Alternativas riscadas, por questão (só enquanto a prova está aberta).
  const [riscadas, setRiscadas] = useState<Record<string, string[]>>({});
  // muda a cada toque numa alternativa: remonta as faíscas para tocarem de novo
  const [toque, setToque] = useState(0);
  // Reforço: errou, a próxima é uma parecida do mesmo conteúdo (não conta na nota).
  const [reforcoPronto, setReforcoPronto] = useState<Reforco | null>(null);
  const [reforcoAtivo, setReforcoAtivo] = useState<Reforco | null>(null);

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
      // Recarregou (Shift+R) lendo a correção: o servidor já avançou para a próxima no
      // momento da resposta, então a tela abria na seguinte e a correção sumia
      // (Pablo, 24/11/2026, planta e depois Estatística). A aba lembra o que fez: o índice da
      // correção aberta, ou 'seguiu' se já apertou Próxima. Aba sem memória (aberta antes
      // desta versão): vale a resposta dada há menos de 10 min.
      const ex = data.exam;
      const memoria = sessionStorage.getItem(CHAVE_CORRECAO(examId));
      const lida = memoria !== null && memoria !== 'seguiu' ? Number(memoria) : ex.currentIdx - 1;
      const anterior = ex.questions?.[lida];
      const recente = Date.now() - new Date(ex.updatedAt).getTime() < RESPOSTA_RECENTE_MS;
      const aindaLendo = memoria === null ? recente && !ex.questions?.[ex.currentIdx]?.answered : memoria !== 'seguiu';
      if (ex.status !== 'finalizada' && aindaLendo && lida === ex.currentIdx - 1 && anterior?.answered) {
        setExam({ ...ex, currentIdx: lida });
        setSelectedAnswer(anterior.respostaDada);
        setFeedback({ acertou: anterior.acertou, respostaCorreta: anterior.question.respostaCorreta });
        setSubmitted(true);
      } else {
        setExam(ex);
      }
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
          className="flex items-center gap-2 type-meta text-muted-foreground hover:text-foreground t-colors mb-6 py-3 pr-3 -my-3"
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

          {/* min-w-0 + quebra: "APROVEITAMENTO" passava 1 px da tela de 390 px */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto [&>*]:min-w-0 [&_p]:break-words">

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

  const antiga = vendo === null ? null : exam.questions[vendo];
  const idxVisto = vendo ?? exam.currentIdx;
  const reforco = antiga ? null : reforcoAtivo;
  const q = antiga ? antiga.question : reforcoAtivo?.questao ?? currentEQ.question;
  // O que a tela mostra: a resposta antiga (só leitura) ou a da questão atual.
  const respondidaTela = antiga ? true : submitted;
  const respostaTela: string | null = antiga ? antiga.respostaDada : selectedAnswer;
  const retorno = antiga ? { acertou: antiga.acertou, respostaCorreta: antiga.question.respostaCorreta } : feedback;
  const foraDaConta: string[] = riscadas[q.id] ?? [];
  const abrirQuestao = (i: number) => {
    setVendo(i === exam.currentIdx ? null : i);
    window.scrollTo({ top: 0 });
  };
  const riscar = (letra: string) => {
    const fora = foraDaConta.includes(letra);
    setRiscadas((r) => ({ ...r, [q.id]: fora ? foraDaConta.filter((x) => x !== letra) : [...foraDaConta, letra] }));
    if (selectedAnswer === letra) setSelectedAnswer(null);
  };
  // O astronauta reage à resposta dentro do desenho da questão (14/11/2026).
  const reacao = respondidaTela && retorno ? (retorno.acertou ? 'acerto' : 'erro') : null;
  const alternativas = [
    { letra: 'A', texto: q.alternativaA },
    { letra: 'B', texto: q.alternativaB },
    { letra: 'C', texto: q.alternativaC },
    { letra: 'D', texto: q.alternativaD },
    { letra: 'E', texto: q.alternativaE },
  // Unicamp tem 4 alternativas: a E vem vazia e aparecia como botão sem texto (18/11/2026).
  ].filter((a) => a.texto?.trim());

  // A letra certa já vem com a questão: o acerto aparece no toque e a resposta
  // é gravada por trás (Pablo, 22/10/2026: "demora para ele ver que acerta").
  const handleSubmit = () => {
    if (!selectedAnswer || submitted) return;
    const acertou = selectedAnswer === q.respostaCorreta;
    setFeedback({ acertou, respostaCorreta: q.respostaCorreta });
    setSubmitted(true);
    // Reforço é treino: não grava nem mexe na nota da prova.
    if (reforcoAtivo) {
      marcarUsada(q.id);
      return;
    }
    sessionStorage.setItem(CHAVE_CORRECAO(examId), String(exam.currentIdx));
    // Errou: já busca a parecida, para a "Próxima" trazer ela.
    if (!acertou) {
      buscarReforco(temaDaQuestao(q) ?? q.tema, q.id).then(setReforcoPronto);
    }
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
    // Errou e há uma parecida guardada: ela vem antes da próxima da prova.
    if (!reforcoAtivo && reforcoPronto) {
      setReforcoAtivo(reforcoPronto);
      setReforcoPronto(null);
      setSelectedAnswer(null);
      setSubmitted(false);
      setFeedback(null);
      window.scrollTo({ top: 0 });
      return;
    }
    setReforcoAtivo(null);
    sessionStorage.setItem(CHAVE_CORRECAO(examId), 'seguiu');
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

  // Mundo pixel atrás da prova (Pablo, 12/11/2026): o céu aparece em cima do
  // cartão, a serra embaixo, e o dia e a noite passam enquanto ele estuda.
  return (
    // overflow-x-clip: os anéis do acerto/erro passam da borda no celular e a página rolava para o lado
    <div className="relative min-h-screen overflow-x-clip">
      <MundoPixel animado={mundo.animado} />
      <div className="relative z-[1] min-h-screen px-2 pb-6 md:px-10 md:pb-10 pt-[68px] md:pt-[min(20vh,170px)] max-w-4xl mx-auto">
      <div className="absolute top-4 right-4 md:right-10 flex gap-3">
        <button type="button" className="px-chip" aria-pressed={telaCheia.ativa} onClick={telaCheia.alternar}>
          {telaCheia.ativa ? 'Sair da tela cheia' : 'Tela cheia'}
        </button>
      </div>
      <div className="px-cartao relative p-5 md:p-8">
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/provas')}
        className="flex items-center gap-2 type-meta text-muted-foreground hover:text-foreground t-colors mb-6 py-3 pr-3 -my-3"
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
        <h1 className="font-display type-title md:[font-size:var(--type-headline)] font-semibold mb-3">{exam.nome}</h1>
        <MapaQuestoes
          respondidas={exam.questions.map((eq: any) => Boolean(eq.answered))}
          atual={exam.currentIdx}
          vendo={idxVisto}
          marcadas={exam.questions.map((eq: any) => marcadas.includes(eq.question.id))}
          onAbrir={abrirQuestao}
        />
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
              {reforco ? 'Reforço · estilo ENEM' : etapaDaQuestao(q) === 'enem' && q.anoProva ? `ENEM ${q.anoProva} · questão real` : rotuloDaQuestao(q)}
            </span>
            {q.subtema && (
              <>
                <span aria-hidden className="text-border">/</span>
                <span className="truncate max-w-[22rem]">{q.subtema}</span>
              </>
            )}
          </div>
          {reforco && (
            <p className="mb-4 px-4 py-3 rounded-[var(--radius-control)] bg-primary/10 type-meta text-foreground">
              <strong className="text-primary-text">Questão de reforço:</strong> parecida com a que você errou, para ver se ficou claro. Não conta na nota da prova.
            </p>
          )}
          <div className="prose-reading mb-6">
            <MathText text={semMarcaDeImagem(q.enunciado)} />
          </div>
          {/* Cena em pixel da situação da questão (Pablo, 14/11/2026: "se fala de um menino
              puxando uma corda, desenha o menino"). Mapa em data/revisao-final/cenas-das-questoes.json. */}
          {!reforco && cenaDaQuestao(q.id) && (
            <div className="mb-6">
              <FiguraPixel nome={cenaDaQuestao(q.id)!.nome} rotulos={cenaDaQuestao(q.id)!.rotulos} semConta astronauta={{ reacao }} />
            </div>
          )}
          {/* Desenho em pixel da questão de reforço, sem a conta (só ajuda a entender). */}
          {reforco?.figura && (
            <div className="mb-6">
              <FiguraPixel nome={reforco.figura.nome} rotulos={reforco.figura.rotulos} semConta astronauta={{ reacao }} />
            </div>
          )}
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
              const isCorrect = respondidaTela && alt.letra === retorno?.respostaCorreta;
              const isWrong = respondidaTela && respostaTela === alt.letra && alt.letra !== retorno?.respostaCorreta;
              const isSelected = !respondidaTela && respostaTela === alt.letra;
              const riscada = !respondidaTela && foraDaConta.includes(alt.letra);

              // A alternativa respondida (a marcada) abre os anéis; a certa só acende.
              const respondida = !antiga && submitted && selectedAnswer === alt.letra;
              return (
                // A entrada fica no invólucro: o transform do framer no botão
                // apagaria o "afundar" de 4 px do CSS (.px-alt).
                <motion.div
                  key={alt.letra}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="flex items-stretch gap-3"
                >
                  <button
                    type="button"
                    disabled={respondidaTela}
                    onClick={() => {
                      if (respondidaTela) return;
                      if (riscada) riscar(alt.letra);
                      setSelectedAnswer(alt.letra);
                      setToque((t) => t + 1);
                    }}
                    data-alt={alt.letra}
                    data-state={isCorrect ? 'correta' : isWrong ? 'errada' : isSelected ? 'selecionada' : 'repouso'}
                    className={`px-alt min-w-0 ${riscada ? 'opacity-50 line-through' : ''}`}
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
                  {!respondidaTela && (
                    <button
                      type="button"
                      aria-pressed={riscada}
                      aria-label={`Riscar a alternativa ${alt.letra}`}
                      title={riscada ? 'Desfazer o risco' : 'Riscar'}
                      onClick={() => riscar(alt.letra)}
                      className="shrink-0 w-11 rounded-[var(--radius-control)] border border-border grid place-items-center text-muted-foreground hover:text-foreground t-colors"
                    >
                      {riscada ? <Undo2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Feedback + Explanation after answer */}
          {respondidaTela && retorno && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              {/* Correct/Incorrect feedback */}
              <div
                className="rounded-[var(--radius-surface)] border p-4"
                style={{
                  backgroundColor: retorno.acertou ? 'hsl(var(--success-surface))' : 'hsl(var(--danger-surface))',
                  borderColor: retorno.acertou ? 'hsl(var(--success-border))' : 'hsl(var(--danger-border))',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: retorno.acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
                    {retorno.acertou ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
                  </span>
                  <span
                    className="font-display type-lead font-semibold"
                    style={{ color: retorno.acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}
                  >
                    {retorno.acertou ? 'Correto' : 'Incorreto'}
                  </span>
                </div>
                {!retorno.acertou && (
                  <p className="type-meta text-foreground/80">
                    Resposta correta:{' '}
                    <span className="font-semibold" style={{ color: 'hsl(var(--success))' }}>{retorno.respostaCorreta}</span>
                  </p>
                )}
              </div>

              <ExplicacaoTutor key={`tutor-${q.id}`} questao={q} respostaDada={respostaTela} iniciarSozinha={!antiga && !retorno.acertou} />
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>
      <BarraQuestao
        podeVoltar={!reforco && idxVisto > 0}
        onAnterior={() => abrirQuestao(idxVisto - 1)}
        marcada={marcadas.includes(q.id)}
        onMarcar={reforco ? null : () => alternarMarca(q.id)}
        principal={
          antiga
            ? { rotulo: 'Voltar à atual', onClick: () => abrirQuestao(exam.currentIdx) }
            : !submitted
              ? { rotulo: 'Confirmar', onClick: handleSubmit, desligado: !selectedAnswer }
              : {
                  rotulo: !reforcoAtivo && reforcoPronto ? 'Tentar uma parecida' : isLast ? 'Finalizar Prova' : 'Próxima',
                  onClick: handleNext,
                  desligado: fechando,
                }
        }
      />
      </div>
      </div>
    </div>
  );
}
