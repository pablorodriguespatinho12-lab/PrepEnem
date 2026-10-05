'use client';
// Explicação visual em passos + conversa de dúvida. Um passo por vez, o aluno
// avança no próprio ritmo (segmentação); o desenho vem antes do texto; no fim,
// uma pergunta de recuperação; depois, ele pode perguntar "mas por quê?".

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Brain, Eye, Loader2, RefreshCcw, Send } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import type { Explicacao, RespostaTutor } from '@/lib/tutor/validar';
import { resumirExplicacao } from '@/lib/tutor/validar';
import type { Visual } from '@/lib/visual/especificacao';

export interface QuestaoTutor {
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

export function ExplicacaoTutor({ questao, respostaDada, iniciarSozinha = false }: Props) {
  const [explicacao, setExplicacao] = useState<Explicacao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [passosVisiveis, setPassosVisiveis] = useState(1);
  const [respostaChecagemAberta, setRespostaChecagemAberta] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
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
    setRespondendo(true);
    try {
      const res = await fetch('/api/tutor/conversa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questao: corpoDaQuestao(questao, respostaDada),
          resumoExplicacao: resumirExplicacao(explicacao),
          historico: historico.map(({ papel, texto: t }) => ({ papel, texto: t })),
        }),
      });
      const data: Partial<RespostaTutor> & { error?: string } = await res.json().catch(() => ({}));
      const resposta = res.ok && data.resposta
        ? { papel: 'tutor' as const, texto: data.resposta, visual: data.visual ?? null }
        : { papel: 'tutor' as const, texto: data.error ?? 'Não consegui responder agora. Tente de novo.' };
      setMensagens([...historico, resposta]);
    } catch {
      setMensagens([...historico, { papel: 'tutor', texto: 'Sem conexão com o servidor.' }]);
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

  return (
    <section className="surface-1 rounded-[var(--radius-surface)] p-5 md:p-6 space-y-5" aria-label="Explicação">
      {explicacao.seuErro && (
        <div className="rounded-[var(--radius-control)] border p-4"
          style={{ backgroundColor: 'hsl(var(--danger-surface))', borderColor: 'hsl(var(--danger-border))' }}>
          <p className="type-caption font-semibold mb-1" style={{ color: 'hsl(var(--danger))' }}>Onde seu raciocínio desviou</p>
          <MathText text={explicacao.seuErro} className="font-reading" />
        </div>
      )}

      <div>
        <p className="type-caption text-muted-foreground mb-1">A ideia</p>
        <div className="font-display type-lead font-semibold"><MathText text={explicacao.ideia} /></div>
      </div>

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

      <ol className="space-y-5">
        {explicacao.passos.slice(0, passosVisiveis).map((p, i) => (
          <li key={i} className="space-y-3">
            <p className="type-caption text-muted-foreground" data-numeric>Passo {i + 1} de {total}</p>
            {p.visual && <VisualDesenho visual={p.visual} />}
            <h3 className="font-display type-body font-semibold">{p.titulo}</h3>
            <MathText text={p.texto} className="font-reading" />
          </li>
        ))}
      </ol>

      {!terminou ? (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPassosVisiveis((n) => n + 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-1 t-colors hover:bg-[hsl(var(--primary-hover))]"
          >
            Próximo passo <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setPassosVisiveis(total)} className="type-meta text-muted-foreground hover:text-foreground underline underline-offset-2">
            Ver tudo
          </button>
        </div>
      ) : explicacao.checagem && (
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

      {terminou && (
        <div className="border-t border-border pt-4 space-y-3">
          <p className="type-caption text-muted-foreground">Ficou alguma dúvida? Pergunte do seu jeito.</p>
          {mensagens.length > 0 && (
            <div className="space-y-3" aria-live="polite">
              {mensagens.map((m, i) => (
                <div key={i} className={m.papel === 'aluno' ? 'flex justify-end' : ''}>
                  <div className={m.papel === 'aluno'
                    ? 'max-w-[85%] rounded-[var(--radius-control)] bg-primary/10 px-3 py-2 type-meta'
                    : 'space-y-2'}>
                    {m.papel === 'tutor' && m.visual && <VisualDesenho visual={m.visual} />}
                    {m.papel === 'aluno' ? m.texto : <MathText text={m.texto} className="font-reading" />}
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
          {mensagens.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {SUGESTOES.map((s) => (
                <button key={s} onClick={() => perguntar(s)}
                  className="px-3 py-1.5 rounded-[var(--radius-control)] border border-border type-meta hover:bg-muted t-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => { e.preventDefault(); perguntar(rascunho); }}
            className="flex items-end gap-2"
          >
            <label htmlFor="duvida-tutor" className="sr-only">Sua dúvida</label>
            <textarea
              id="duvida-tutor"
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); perguntar(rascunho); } }}
              rows={1}
              maxLength={1200}
              placeholder="Ex.: mas por que o x vira negativo?"
              className="flex-1 resize-none p-3 border border-input rounded-[var(--radius-control)] font-reading text-body bg-[hsl(var(--surface-2))] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button type="submit" disabled={respondendo || !rascunho.trim()} aria-label="Enviar dúvida"
              className="p-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] disabled:opacity-50 t-colors hover:bg-[hsl(var(--primary-hover))]">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
