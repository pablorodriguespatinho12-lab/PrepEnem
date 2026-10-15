'use client';
// Explicação visual em passos + conversa de dúvida. Um passo por vez, o aluno
// avança no próprio ritmo (segmentação); o desenho vem antes do texto; no fim,
// uma pergunta de recuperação; depois, ele pode perguntar "mas por quê?".

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Brain, Eye, Loader2, RefreshCcw, Send } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import { NaoEntendiContext } from '@/components/visual/quadro';
import type { Explicacao, RespostaTutor } from '@/lib/tutor/validar';
import { resumirExplicacao } from '@/lib/tutor/validar';
import type { Visual } from '@/lib/visual/especificacao';
import { useTelaGrande } from '@/hooks/use-tela-grande';

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
     termo é) vai para este lugar da coluna da esquerda, para a direita caber
     sem rolar (Pablo, 15/10/2026). */
  lateral?: HTMLElement | null;
}

interface Mensagem { papel: 'aluno' | 'tutor'; texto: string; visual?: Visual | null }

const SUGESTOES = ['Por que é assim?', 'Me dá outro exemplo', 'De onde vem essa fórmula?'];

function corpoDaQuestao(q: QuestaoTutor, respostaDada: string | null) {
  return {
    enunciado: q.enunciado,
    alternativas: { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE },
    respostaCorreta: q.respostaCorreta,
    respostaDada,
    materia: q.materia,
    subtema: q.subtema,
  };
}

export function ExplicacaoTutor({ questao, respostaDada, iniciarSozinha = false, lateral = null }: Props) {
  const telaGrande = useTelaGrande();
  const [explicacao, setExplicacao] = useState<Explicacao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [passosVisiveis, setPassosVisiveis] = useState(1);
  const [respostaChecagemAberta, setRespostaChecagemAberta] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [falhaConversa, setFalhaConversa] = useState(false);
  const [rascunho, setRascunho] = useState('');
  const [respondendo, setRespondendo] = useState(false);
  const fimDaConversa = useRef<HTMLDivElement>(null);

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
      setPassosVisiveis(1);
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
    setRespostaChecagemAberta(false);
    setErro(null);
    if (iniciarSozinha) gerar();
  }, [questao, iniciarSozinha, gerar]);

  useEffect(() => {
    fimDaConversa.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [mensagens.length]);

  const perguntar = async (texto: string) => {
    const limpo = texto.trim();
    if (!limpo || respondendo || !explicacao) return;
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
      /* Erro não entra na conversa: antes virava fala do tutor ("Falha de
         autenticação...") e voltava no prompt seguinte. A dúvida volta ao campo. */
      setMensagens(mensagens);
      setRascunho(limpo);
      setFalhaConversa(true);
    } finally {
      setRespondendo(false);
    }
  };

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

  const total = explicacao.passos.length;
  const terminou = passosVisiveis >= total;
  const passoAtual = explicacao.passos[passosVisiveis - 1];
  const sobreAQuestao = (
    <>
      {explicacao.seuErro && (
        <div className="rounded-[var(--radius-control)] border p-4"
          style={{ backgroundColor: 'hsl(var(--danger-surface))', borderColor: 'hsl(var(--danger-border))' }}>
          <p className="type-caption font-semibold mb-1" style={{ color: 'hsl(var(--danger))' }}>Onde seu raciocínio desviou</p>
          <MathText text={explicacao.seuErro} className="font-reading" />
        </div>
      )}
      {explicacao.pecas.length > 0 && (
        <dl className="flex flex-wrap gap-2">
          {explicacao.pecas.map((p) => (
            <div key={p.termo} className="rounded-[var(--radius-control)] bg-muted/60 px-3 py-2 max-w-sm">
              <dt className="type-meta font-semibold">{p.termo}</dt>
              <dd className="type-meta text-muted-foreground"><MathText text={p.significado} /></dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );

  return (
    <NaoEntendiContext.Provider value={(texto) => { void perguntar(texto); }}>
    <section className="surface-1 rounded-[var(--radius-surface)] p-5 md:p-6 space-y-5 lg:space-y-4" aria-label="Explicação">
      {lateral && telaGrande ? createPortal(<div className="space-y-4">{sobreAQuestao}</div>, lateral) : sobreAQuestao}

      <div>
        <p className="type-caption text-muted-foreground mb-1">A ideia</p>
        <div className="font-display type-lead font-semibold"><MathText text={explicacao.ideia} /></div>
      </div>

      {/* Um passo por vez: o botão troca o passo em vez de empilhar, para a
          tela não rolar (Pablo, 15/10/2026, opção A com o quadro do B). */}
      {passoAtual && (
        <div className="space-y-3">
          <p className="type-caption text-muted-foreground" data-numeric>Passo {passosVisiveis} de {total}</p>
          {passoAtual.visual && <VisualDesenho visual={passoAtual.visual} />}
          <h3 className="font-display type-body font-semibold">{passoAtual.titulo}</h3>
          <MathText text={passoAtual.texto} className="font-reading" />
        </div>
      )}

      <div className="flex items-center gap-3">
        {passosVisiveis > 1 && (
          <button
            onClick={() => setPassosVisiveis((n) => n - 1)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-[var(--radius-control)] border border-border type-meta text-muted-foreground hover:text-foreground hover:bg-muted t-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Passo anterior
          </button>
        )}
        {!terminou && (
          <button
            onClick={() => setPassosVisiveis((n) => n + 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-1 t-colors hover:bg-[hsl(var(--primary-hover))]"
          >
            Próximo passo <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {terminou && explicacao.checagem && (
        <div className="rounded-[var(--radius-control)] border border-border p-4">
          <p className="type-caption text-muted-foreground mb-1">Responda de cabeça, sem olhar</p>
          <MathText text={explicacao.checagem.pergunta} className="font-reading font-medium" />
          {respostaChecagemAberta ? (
            <div className="mt-2 text-muted-foreground"><MathText text={explicacao.checagem.resposta} className="font-reading" /></div>
          ) : (
            <button onClick={() => setRespostaChecagemAberta(true)} className="mt-2 flex items-center gap-1.5 type-meta text-primary-text font-medium hover:underline underline-offset-4">
              <Eye className="w-4 h-4" /> Conferir
            </button>
          )}
        </div>
      )}

      {/* A conversa fica aberta desde o primeiro passo: o "Não entendi" do
          quadro manda a pergunta para cá, e antes ela só aparecia no último
          passo, então o botão parecia não fazer nada (Pablo, 08/10/2026). */}
      <div className="border-t border-border pt-4 space-y-3">
          <p className="type-caption text-muted-foreground lg:hidden">Não entendeu alguma parte? Pergunte para a IA do seu jeito.</p>
          {mensagens.length > 0 && (
            <div className="space-y-3 lg:max-h-60 lg:overflow-y-auto lg:pr-1" aria-live="polite">
              {mensagens.map((m, i) => (
                <div key={i} className={m.papel === 'aluno' ? 'flex justify-end' : ''}>
                  <div className={m.papel === 'aluno'
                    ? 'max-w-[85%] rounded-[var(--radius-control)] bg-primary/10 px-3 py-2 type-meta'
                    : 'space-y-2'}>
                    {m.papel === 'tutor' && m.visual && <VisualDesenho visual={m.visual} />}
                    <MathText text={m.texto} className={m.papel === 'aluno' ? undefined : 'font-reading'} />
                  </div>
                </div>
              ))}
              {respondendo && (
                <div className="flex items-center gap-2 text-muted-foreground type-meta" role="status">
                  <Loader2 className="w-4 h-4 animate-spin" /> Pensando...
                </div>
              )}
              <div ref={fimDaConversa} />
            </div>
          )}
          {mensagens.length === 0 && terminou && (
            <div className="flex flex-wrap gap-2">
              {SUGESTOES.map((s) => (
                <button key={s} onClick={() => perguntar(s)}
                  className="px-3 py-1.5 rounded-[var(--radius-control)] border border-border type-meta hover:bg-muted t-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
          {falhaConversa && (
            <p className="type-meta text-[hsl(var(--danger))]" role="alert">Não consegui responder agora. Envie de novo.</p>
          )}
      </div>
      {/* Fora da conversa, filho direto da seção: assim fica preso embaixo da
          coluna que rola na tela grande, sempre à vista (Pablo, 15/10/2026). */}
      <form
        onSubmit={(e) => { e.preventDefault(); perguntar(rascunho); }}
        className="flex items-end gap-2 lg:sticky lg:bottom-0 lg:-mx-6 lg:-mb-6 lg:px-6 lg:pb-6 lg:pt-3 bg-[hsl(var(--surface-1))] rounded-b-[var(--radius-surface)]"
      >
        <label htmlFor="duvida-tutor" className="sr-only">Sua dúvida</label>
        <textarea
          id="duvida-tutor"
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); perguntar(rascunho); } }}
          rows={1}
          maxLength={1200}
          placeholder="Não entendeu? Pergunte aqui..."
          className="flex-1 resize-none p-3 border border-input rounded-[var(--radius-control)] font-reading text-body bg-[hsl(var(--surface-2))] focus:outline-none"
        />
        <button type="submit" disabled={respondendo || !rascunho.trim()} aria-label="Enviar dúvida"
          className="p-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] disabled:opacity-50 t-colors hover:bg-[hsl(var(--primary-hover))]">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
    </NaoEntendiContext.Provider>
  );
}
