'use client';
// Painel de dúvidas ao lado da lição (Pablo, 06/10/2026: "coloca uma IA do lado
// para fazer uma pergunta"). Mesma IA e mesmas regras do tutor do Treino; ela
// recebe o que está na tela agora. A conversa não é salva.

import { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircleQuestion, Send } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import type { Visual } from '@/lib/visual/especificacao';

interface Mensagem { papel: 'aluno' | 'tutor'; texto: string; visual?: Visual | null }

const MAX_PERGUNTA = 600;

/* "pronta": pergunta que veio de um botão da tela ("Não entendi" do quadro);
   chega com id novo a cada clique e é enviada sozinha. */
export function DuvidaLicao({ licaoId, naTela, pronta }: { licaoId: string; naTela: string; pronta?: { id: number; texto: string } | null }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false); // só importa no celular
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => { fim.current?.scrollIntoView({ block: 'nearest' }); }, [mensagens, pensando]);
  useEffect(() => {
    if (!pronta) return;
    setAberto(true);
    void enviar(pronta.texto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pronta?.id]);

  const enviar = async (escrita?: string) => {
    const pergunta = (escrita ?? texto).trim().slice(0, MAX_PERGUNTA);
    if (!pergunta || pensando) return;
    const historico = [...mensagens, { papel: 'aluno' as const, texto: pergunta }];
    setMensagens(historico);
    setTexto('');
    setErro(null);
    setPensando(true);
    try {
      const r = await fetch('/api/calculo/duvida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licaoId, naTela, historico: historico.map(({ papel, texto: t }) => ({ papel, texto: t })) }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Não deu para responder agora.');
      setMensagens((m) => [...m, { papel: 'tutor', texto: data.resposta, visual: data.visual ?? null }]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu para responder agora.');
    } finally {
      setPensando(false);
    }
  };

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Perguntar sobre a lição">
      <button type="button" onClick={() => setAberto((v) => !v)} aria-expanded={aberto}
        className="lg:hidden w-full inline-flex items-center justify-center gap-2 py-3 rounded-[var(--radius-control)] bg-muted hover:bg-muted/80 t-colors type-meta font-medium">
        <MessageCircleQuestion className="w-4 h-4" /> {aberto ? 'Fechar perguntas' : 'Perguntar sobre esta parte'}
      </button>
      <div className={`${aberto ? 'flex' : 'hidden'} lg:flex flex-col surface-1 rounded-[var(--radius-surface)] p-4 mt-3 lg:mt-0 max-h-[80vh]`}>
        <p className="font-display type-body font-semibold mb-1">Ficou com dúvida?</p>
        <p className="type-caption text-muted-foreground mb-3">Pergunte sobre o que está na tela. A resposta usa o exemplo da lição.</p>
        <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
          {mensagens.map((m, i) => (
            m.papel === 'aluno'
              ? <p key={i} className="ml-6 rounded-[var(--radius-control)] bg-primary/10 px-3 py-2 type-meta">{m.texto}</p>
              : (
                <div key={i} className="space-y-2">
                  <MathText text={m.texto} className="font-reading type-meta" />
                  {m.visual && <VisualDesenho visual={m.visual} />}
                </div>
              )
          ))}
          {pensando && <p className="inline-flex items-center gap-2 type-meta text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Pensando...</p>}
          {erro && <p className="type-meta text-[hsl(var(--danger))]">{erro}</p>}
          <div ref={fim} />
        </div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
            rows={2}
            maxLength={MAX_PERGUNTA}
            placeholder="Ex.: se f(x) = 3, o x vale 3?"
            className="flex-1 resize-none rounded-[var(--radius-control)] bg-muted/60 border border-border px-3 py-2 type-meta focus:outline-none focus:border-primary"
          />
          <button type="submit" disabled={!texto.trim() || pensando} aria-label="Enviar pergunta"
            className="self-end p-2.5 rounded-[var(--radius-control)] bg-primary text-primary-foreground disabled:opacity-40 t-colors">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
