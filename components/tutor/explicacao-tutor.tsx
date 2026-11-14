'use client';
// Explicação visual em passos + conversa de dúvida. Uma tela por passo, do jeito
// que o Pablo aprovou no artefato dos peixes (22/10/2026: "perfeito, fala para
// a IA fazer exatamente assim"): texto à esquerda, desenho à direita, pontinhos
// de progresso, Voltar e Próximo, e nada rola: o desenho encolhe para caber.
// A conversa fica atrás de um ícone no meio, embaixo.

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Loader2, RefreshCcw, Sparkles } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import { NaoEntendiContext } from '@/components/visual/quadro';
import type { Explicacao, RespostaTutor } from '@/lib/tutor/validar';
import { resumirExplicacao } from '@/lib/tutor/validar';
import type { Visual } from '@/lib/visual/especificacao';
import { useTelaGrande } from '@/hooks/use-tela-grande';
import { CaberNaCaixa } from './caber-na-caixa';
import { SuaVez } from './sua-vez';
import { PergunteAIa, type Mensagem } from './pergunte-a-ia';

const LARGURA_LADO_A_LADO = 700;

const DESLIZE_DO_PASSO = {
  entra: (s: number) => ({ opacity: 0, x: 24 * s }),
  parado: { opacity: 1, x: 0 },
  sai: (s: number) => ({ opacity: 0, x: -24 * s }),
};

export interface QuestaoTutor {
  id?: string;
  enunciado: string;
  alternativaA: string; alternativaB: string; alternativaC: string; alternativaD: string; alternativaE: string;
  respostaCorreta: string;
  materia: string;
  subtema?: string | null;
}

interface Props {
  questao: QuestaoTutor;
  respostaDada: string | null;
  /* Errou: a explicação já começa sozinha (feedback imediato). Acertou: botão. */
  iniciarSozinha?: boolean;
  /* Tela grande: o que é sobre o aluno e a questão (onde errou, o que cada
     termo é) vai para este lugar da coluna da esquerda (Pablo, 15/10/2026). */
  lateral?: HTMLElement | null;
}

type Tela =
  | { tipo: 'erro'; rotulo: string; titulo: string; texto: string }
  | { tipo: 'passo'; rotulo: string; titulo: string; texto: string; visual: Visual | null; comPecas: boolean }
  | { tipo: 'fim'; rotulo: string; titulo: string; texto: string };

function corpoDaQuestao(q: QuestaoTutor, respostaDada: string | null) {
  return {
    questionId: q.id,
    enunciado: q.enunciado,
    alternativas: { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE },
    respostaCorreta: q.respostaCorreta,
    respostaDada,
    materia: q.materia,
    subtema: q.subtema,
  };
}

/* Onde errou (se não foi para a coluna do lado) → os passos → sua vez. */
function montarTelas(e: Explicacao, erroNaLateral: boolean): Tela[] {
  const erro: Tela[] = e.seuErro && !erroNaLateral
    ? [{ tipo: 'erro', rotulo: 'Seu erro', titulo: 'Onde você desviou', texto: e.seuErro }]
    : [];
  // Como no artefato: o nome do passo pequeno ("A pergunta") e o que ele diz em destaque.
  const passos: Tela[] = e.passos.map((p, i) => ({
    tipo: 'passo', rotulo: p.titulo, titulo: p.texto, texto: '', visual: p.visual, comPecas: i === 0 && !erroNaLateral,
  }));
  const fim: Tela = e.checagem
    ? { tipo: 'fim', rotulo: 'Sua vez', titulo: e.checagem.pergunta, texto: `Para lembrar: ${e.ideia}` }
    : { tipo: 'fim', rotulo: 'Para lembrar', titulo: e.ideia, texto: '' };
  return [...erro, ...passos, fim];
}

export function ExplicacaoTutor({ questao, respostaDada, iniciarSozinha = false, lateral = null }: Props) {
  const telaGrande = useTelaGrande();
  const [explicacao, setExplicacao] = useState<Explicacao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [atual, setAtual] = useState(0);
  // 1 = avançou (o passo novo vem da direita), -1 = voltou (vem da esquerda).
  const [sentido, setSentido] = useState(1);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [conversaAberta, setConversaAberta] = useState(false);
  const [falhaConversa, setFalhaConversa] = useState(false);
  const [rascunho, setRascunho] = useState('');
  const [respondendo, setRespondendo] = useState(false);
  const cartao = useRef<HTMLElement>(null);
  // Lido quando o "onde você desviou" chega depois: só desloca o passo atual se ele virou tela.
  const erroVaiParaOLado = useRef(false);

  const gerar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch('/api/tutor/explicacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpoDaQuestao(questao, respostaDada)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.explicacao) {
        setErro(data?.error ?? 'Não deu para gerar a explicação agora.');
        return;
      }
      setExplicacao(data.explicacao);
      setAtual(0);
      // Veio pronta do banco (feita sem saber o que ele marcou): se errou, o
      // "onde você desviou" chega depois e entra como primeira tela.
      const errou = !!respostaDada && respostaDada !== questao.respostaCorreta;
      if (data.pronta && errou) {
        fetch('/api/tutor/seu-erro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpoDaQuestao(questao, respostaDada)),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (!d?.seuErro) return;
            setExplicacao((e) => (e ? { ...e, seuErro: d.seuErro } : e));
            if (!erroVaiParaOLado.current) setAtual((a) => (a > 0 ? a + 1 : a));
          })
          .catch(() => { /* sem o erro, a explicação segue completa */ });
      }
      // Errou: a pergunta de fixação vira flashcard (api/flashcards/do-erro).
      const c = data.explicacao.checagem;
      if (c && respostaDada && respostaDada !== questao.respostaCorreta) {
        fetch('/api/flashcards/do-erro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ materia: questao.materia, pergunta: c.pergunta, resposta: c.resposta }),
        }).catch(() => { /* cartão é bônus: falhar não atrapalha a explicação */ });
      }
    } catch {
      setErro('Sem conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  }, [questao, respostaDada]);

  // Questão nova: zera tudo. Errou: já começa.
  useEffect(() => {
    setExplicacao(null);
    setMensagens([]);
    setConversaAberta(false);
    setErro(null);
    if (iniciarSozinha) gerar();
  }, [questao, iniciarSozinha, gerar]);

  // A explicação chegou: o cartão sobe e ocupa a tela.
  useEffect(() => {
    if (explicacao) cartao.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [explicacao]);

  // Lado a lado só quando o próprio cartão é largo. No treino em tela grande ele
  // divide a tela com a questão (~540 px) e o desenho saía cortado (23/10/2026).
  const [ladoALado, setLadoALado] = useState(false);
  useEffect(() => {
    const c = cartao.current;
    if (!c) return;
    const observador = new ResizeObserver(([e]) => setLadoALado(e.contentRect.width >= LARGURA_LADO_A_LADO));
    observador.observe(c);
    return () => observador.disconnect();
  }, [explicacao]);

  const perguntar = async (texto: string) => {
    const limpo = texto.trim();
    if (!limpo || respondendo || !explicacao) return;
    setConversaAberta(true);
    const historico: Mensagem[] = [...mensagens, { papel: 'aluno', texto: limpo }];
    setMensagens(historico);
    setRascunho('');
    setFalhaConversa(false);
    setRespondendo(true);
    try {
      const res = await fetch('/api/tutor/conversa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questao: corpoDaQuestao(questao, respostaDada),
          questionId: questao.id,
          resumoExplicacao: resumirExplicacao(explicacao),
          historico: historico.map(({ papel, texto: t }) => ({ papel, texto: t })),
        }),
      });
      const data: Partial<RespostaTutor> = await res.json().catch(() => ({}));
      if (!res.ok || !data.resposta) throw new Error('sem resposta');
      setMensagens([...historico, { papel: 'tutor', texto: data.resposta, visual: data.visual ?? null }]);
    } catch {
      /* Erro não entra na conversa: antes virava fala do tutor e voltava no
         prompt seguinte. A dúvida volta ao campo. */
      setMensagens(mensagens);
      setRascunho(limpo);
      setFalhaConversa(true);
    } finally {
      setRespondendo(false);
    }
  };

  const erroNaLateral = !!lateral && telaGrande;
  erroVaiParaOLado.current = erroNaLateral;
  const telas = explicacao ? montarTelas(explicacao, erroNaLateral) : [];
  const total = telas.length;
  const ir = useCallback((destino: number) => {
    setSentido(destino >= atual ? 1 : -1);
    setAtual(Math.max(0, Math.min(total - 1, destino)));
  }, [atual, total]);

  // Setas do teclado trocam o passo (menos quando ele está escrevendo).
  useEffect(() => {
    if (!explicacao || conversaAberta) return;
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (alvo && /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName)) return;
      if (e.key === 'ArrowRight') ir(atual + 1);
      if (e.key === 'ArrowLeft') ir(atual - 1);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [explicacao, conversaAberta, atual, ir]);

  if (!explicacao) {
    return (
      <div className="surface-1 rounded-[var(--radius-surface)] p-5">
        {carregando ? (
          <div className="flex items-center gap-3 text-muted-foreground" role="status">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="type-meta">Montando o desenho e a explicação...</span>
          </div>
        ) : (
          <>
            {erro && <p className="type-meta text-[hsl(var(--danger))] mb-3">{erro}</p>}
            <button
              onClick={gerar}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-1 t-colors hover:bg-[hsl(var(--primary-hover))]"
            >
              {erro ? <RefreshCcw className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
              {erro ? 'Tentar de novo' : 'Me explica com desenho'}
            </button>
          </>
        )}
      </div>
    );
  }

  const tela = telas[atual];
  const temLadoDireito = tela.tipo === 'fim' ? !!explicacao.checagem : tela.tipo === 'passo' && !!tela.visual;
  const sobreAQuestao = (
    <div className="space-y-4">
      {explicacao.seuErro && (
        <div className="rounded-[var(--radius-control)] border p-4" style={{ backgroundColor: 'hsl(var(--danger-surface))', borderColor: 'hsl(var(--danger-border))' }}>
          <p className="type-caption font-semibold mb-1" style={{ color: 'hsl(var(--danger))' }}>Onde seu raciocínio desviou</p>
          <MathText text={explicacao.seuErro} className="font-reading" />
        </div>
      )}
      <Pecas explicacao={explicacao} />
    </div>
  );

  return (
    <NaoEntendiContext.Provider value={(texto) => { void perguntar(texto); }}>
      {erroNaLateral && lateral && createPortal(sobreAQuestao, lateral)}
      <section
        ref={cartao}
        aria-label="Explicação"
        className="relative surface-1 rounded-[var(--radius-surface)] p-4 md:p-6 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-3 md:gap-4 h-[calc(100dvh-5.5rem)] md:h-[calc(100dvh-2rem)] lg:h-[calc(100dvh-7.5rem)] max-h-[760px] min-h-[460px] scroll-mt-20 md:scroll-mt-4"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="type-meta text-muted-foreground whitespace-nowrap" data-numeric>Passo {atual + 1} de {total}</span>
          <nav className="flex gap-1.5" aria-label="Passos">
            {telas.map((_, i) => (
              <button
                key={i}
                onClick={() => ir(i)}
                aria-label={`Ir para o passo ${i + 1}`}
                aria-current={i === atual ? 'step' : undefined}
                className={`h-2 w-6 md:w-7 rounded-full t-colors ${i === atual ? 'bg-primary' : i < atual ? 'bg-primary/30' : 'bg-border'}`}
              />
            ))}
          </nav>
        </div>

        <AnimatePresence mode="wait" initial={false} custom={sentido}>
          <motion.div
            key={atual}
            custom={sentido}
            variants={DESLIZE_DO_PASSO}
            initial="entra"
            animate="parado"
            exit="sai"
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className={`min-h-0 h-full grid gap-4 md:gap-8 ${!temLadoDireito ? 'grid-rows-[minmax(0,1fr)]' : ladoALado ? 'grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] grid-rows-[minmax(0,1fr)]' : 'grid-rows-[auto_minmax(0,1fr)]'} items-center`}
          >
            {/* Texto longo (balanço do ENEM, 14/11/2026) passava do cartão e cobria Voltar e
                Próximo: a coluna tem teto e rola só ela, e a letra desce um tamanho. */}
            <div className={`grid gap-2 md:gap-3 content-start min-w-0 min-h-0 max-h-full overflow-y-auto pr-1 ${temLadoDireito ? '' : 'max-w-2xl mx-auto text-center justify-items-center'}`}>
              <p className="type-caption font-semibold uppercase tracking-[0.08em] text-primary-text">{tela.rotulo}</p>
              {/* Passo escrito em linhas (12/11/2026): uma ideia por linha, com respiro,
                  em letra de leitura; em bloco único de título ficava ilegível. */}
              {tela.titulo.includes('\n') ? (
                <div className={`font-reading font-medium leading-snug space-y-2 ${tela.titulo.length > TEXTO_LONGO ? 'text-[clamp(0.95rem,0.85rem+0.3vw,1.1rem)]' : 'text-[clamp(1rem,0.85rem+0.6vw,1.35rem)]'}`}>
                  {tela.titulo.split('\n').filter((l) => l.trim()).map((linha, i) => <MathText key={i} text={linha} />)}
                </div>
              ) : (
                <h3 className={`font-display font-bold leading-snug text-balance ${tela.tipo === 'erro' ? 'text-[clamp(1.3rem,0.9rem+1.6vw,2.3rem)]' : 'text-[clamp(1.1rem,0.85rem+1vw,1.75rem)]'}`}>
                  <MathText text={tela.titulo} />
                </h3>
              )}
              {tela.texto && <MathText text={tela.texto} className="font-reading type-lead" />}
              {/* Empilhado, as peças roubavam o lugar do desenho; a legenda já diz o que cada letra é. */}
              {tela.tipo === 'passo' && tela.comPecas && ladoALado && <Pecas explicacao={explicacao} />}
            </div>
            {temLadoDireito && (
              <div className="min-h-0 h-full min-w-0 rounded-[var(--radius-surface)] border border-border bg-[hsl(var(--surface-2))] p-2 md:p-4">
                <CaberNaCaixa>
                  {tela.tipo === 'passo' && tela.visual && <VisualDesenho visual={tela.visual} semMoldura />}
                  {tela.tipo === 'fim' && explicacao.checagem && <SuaVez checagem={explicacao.checagem} />}
                </CaberNaCaixa>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <button
            onClick={() => ir(atual - 1)}
            disabled={atual === 0}
            className="justify-self-start min-h-12 px-5 md:px-7 rounded-[var(--radius-control)] bg-primary/10 text-primary-text font-semibold type-body t-colors hover:bg-primary/15 disabled:opacity-30 active:scale-[0.97]"
          >
            Voltar
          </button>
          <button
            onClick={() => setConversaAberta(true)}
            aria-label="Perguntar para a IA sobre a explicação"
            title="Perguntar para a IA"
            className="w-11 h-11 grid place-items-center rounded-full text-muted-foreground hover:text-primary-text hover:bg-primary/10 t-colors active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            onClick={() => ir(atual + 1)}
            disabled={atual === total - 1}
            className="justify-self-end min-h-12 px-5 md:px-7 rounded-[var(--radius-control)] bg-primary text-primary-foreground font-semibold type-body shadow-elev-1 t-colors hover:bg-[hsl(var(--primary-hover))] disabled:opacity-30 active:scale-[0.97]"
          >
            Próximo
          </button>
        </div>

        <AnimatePresence>
          {conversaAberta && (
            <PergunteAIa
              mensagens={mensagens}
              respondendo={respondendo}
              falhou={falhaConversa}
              rascunho={rascunho}
              aoEscrever={setRascunho}
              aoPerguntar={(t) => { void perguntar(t); }}
              aoFechar={() => setConversaAberta(false)}
            />
          )}
        </AnimatePresence>
      </section>
    </NaoEntendiContext.Provider>
  );
}

/* Passo acima disso desce um tamanho de letra (o do balanço tem 448 letras). */
const TEXTO_LONGO = 300;

/* O que cada termo é, em chips pequenos, no primeiro passo (pré-treino). */
function Pecas({ explicacao }: { explicacao: Explicacao }) {
  if (explicacao.pecas.length === 0) return null;
  return (
    <dl className="flex flex-wrap gap-2 text-left">
      {explicacao.pecas.map((p) => (
        <div key={p.termo} className="rounded-[var(--radius-control)] bg-muted/60 px-3 py-2 max-w-xs">
          <dt className="type-meta font-semibold">{p.termo}</dt>
          <dd className="type-meta text-muted-foreground"><MathText text={p.significado} /></dd>
        </div>
      ))}
    </dl>
  );
}
