'use client';
// Conversa com a IA sobre a explicação. Fica escondida atrás de um ícone no
// meio, embaixo (Pablo, 22/10/2026: "o negócio de perguntar não muito
// nítido, um ícone de IA no meio, eu clico e pergunto"). Abre por cima do
// passo, dentro do cartão, e fecha sem perder a conversa.

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send, X } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import type { Visual } from '@/lib/visual/especificacao';

export interface Mensagem { papel: 'aluno' | 'tutor'; texto: string; visual?: Visual | null }

const SUGESTOES = ['Por que é assim?', 'De onde vem essa fórmula?', 'Me dá outro exemplo'];

type Props = {
  mensagens: Mensagem[];
  respondendo: boolean;
  falhou: boolean;
  rascunho: string;
  aoEscrever: (t: string) => void;
  aoPerguntar: (t: string) => void;
  aoFechar: () => void;
};

export function PergunteAIa({ mensagens, respondendo, falhou, rascunho, aoEscrever, aoPerguntar, aoFechar }: Props) {
  const fim = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { campo.current?.focus(); }, []);
  useEffect(() => { fim.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [mensagens.length, respondendo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className="absolute inset-0 z-10 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-3 p-4 md:p-6 bg-[hsl(var(--surface-1))] rounded-[var(--radius-surface)]"
      role="dialog"
      aria-label="Pergunte para a IA"
    >
      <div className="flex items-center justify-between">
        <p className="font-display type-lead font-semibold">Pergunte para a IA</p>
        <button onClick={aoFechar} aria-label="Voltar para a explicação" className="p-2 rounded-[var(--radius-control)] text-muted-foreground hover:text-foreground hover:bg-muted t-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="min-h-0 overflow-y-auto space-y-3 pr-1" aria-live="polite">
        {mensagens.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGESTOES.map((s) => (
              <button key={s} onClick={() => aoPerguntar(s)} className="px-3 py-2 rounded-[var(--radius-control)] border border-border type-meta hover:bg-muted t-colors">
                {s}
              </button>
            ))}
          </div>
        )}
        {mensagens.map((m, i) => (
          <div key={i} className={m.papel === 'aluno' ? 'flex justify-end' : ''}>
            <div className={m.papel === 'aluno' ? 'max-w-[85%] rounded-[var(--radius-control)] bg-primary/10 px-3 py-2 type-meta' : 'space-y-2'}>
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
        {falhou && <p className="type-meta text-[hsl(var(--danger))]" role="alert">Não consegui responder agora. Envie de novo.</p>}
        <div ref={fim} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); aoPerguntar(rascunho); }} className="flex items-end gap-2">
        <label htmlFor="duvida-tutor" className="sr-only">Sua dúvida</label>
        <textarea
          ref={campo}
          id="duvida-tutor"
          value={rascunho}
          onChange={(e) => aoEscrever(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); aoPerguntar(rascunho); } }}
          rows={1}
          maxLength={1200}
          placeholder="O que você não entendeu?"
          className="flex-1 resize-none p-3 border border-input rounded-[var(--radius-control)] font-reading text-body bg-[hsl(var(--surface-2))] focus:outline-none"
        />
        <button type="submit" disabled={respondendo || !rascunho.trim()} aria-label="Enviar dúvida"
          className="p-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] disabled:opacity-50 t-colors hover:bg-[hsl(var(--primary-hover))]">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}
