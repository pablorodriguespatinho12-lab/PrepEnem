'use client';
// Resolução de questão real de vestibular, um passo por vez (Pablo, 06/10/2026:
// "clique e responda", animado). Cada passo é uma pergunta curta; ao responder,
// a conta se escreve no caderno como caneta (clip-path) e o porquê aparece.

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import MathText from '@/components/math-text';
import { Latex } from '@/components/visual/grafico';
import { acharQuestaoVestibular } from '@/data/vestibular';
import type { PassoResolucao } from '@/lib/vestibular/tipos';
import { ordemFixa, sementeDoPasso } from '@/lib/vestibular/ordem';
import { quebrarConta } from '@/lib/vestibular/conta';

/* Cada linha da conta se escreve da esquerda para a direita, uma depois da outra. */
function Conta({ fonte, reduzir }: { fonte: string; reduzir: boolean }) {
  return (
    <div className="py-1 font-reading">
      {quebrarConta(fonte).map((linha, i) => (
        <motion.div key={i} className="overflow-x-auto whitespace-nowrap"
          initial={reduzir ? false : { clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.55, delay: i * 0.45, ease: [0.4, 0, 0.2, 1] }}>
          <Latex fonte={linha} />
        </motion.div>
      ))}
    </div>
  );
}
function Passo({ passo, semente, onFim, reduzir }: { passo: PassoResolucao; semente: number; onFim: () => void; reduzir: boolean }) {
  const ordem = useMemo(() => ordemFixa(passo.opcoes.length, semente), [passo.opcoes.length, semente]);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const respondido = escolhida !== null;
  const acertou = escolhida === passo.correta;

  return (
    <div className="space-y-3">
      <MathText text={passo.pergunta} className="font-reading type-body" />
      <div className="grid gap-2">
        {ordem.map((i) => {
          const certa = respondido && i === passo.correta;
          const errada = respondido && i === escolhida && !acertou;
          return (
            <button key={i} type="button" disabled={respondido} onClick={() => setEscolhida(i)}
              className="text-left px-4 py-2.5 rounded-[var(--radius-control)] border t-colors enabled:hover:bg-muted enabled:active:scale-[0.99] disabled:cursor-default"
              style={{
                borderColor: certa ? 'hsl(var(--success-border))' : errada ? 'hsl(var(--danger-border))' : 'hsl(var(--border))',
                backgroundColor: certa ? 'hsl(var(--success-surface))' : errada ? 'hsl(var(--danger-surface))' : undefined,
                opacity: respondido && !certa && !errada ? 0.45 : 1,
              }}>
              <MathText text={passo.opcoes[i]} className="font-reading" />
            </button>
          );
        })}
      </div>
      {respondido && (
        <motion.div initial={{ opacity: 0, y: reduzir ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-2">
          <p className="inline-flex items-center gap-1 type-meta font-semibold" role="status"
            style={{ color: acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
            {acertou ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" strokeWidth={3} />}
            {acertou ? 'Isso' : 'Quase: a certa está em verde'}
          </p>
          {passo.porque && <MathText text={passo.porque} className="font-reading type-meta text-muted-foreground block" />}
          <button type="button" onClick={onFim}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta t-colors hover:bg-[hsl(var(--primary-hover))]">
            Próximo <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function ResolucaoClicavel({ origem, numero }: { origem: string; numero: number }) {
  const reduzir = useReducedMotion() ?? false;
  const questao = acharQuestaoVestibular(origem, numero);
  const [atual, setAtual] = useState(0);
  if (!questao) return null;

  const fim = atual >= questao.passos.length;
  const escritas = questao.passos.slice(0, atual).filter((p) => p.conta);

  return (
    <section className="surface-1 rounded-[var(--radius-surface)] p-5 md:p-6 space-y-4" aria-label="Resolução passo a passo">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="font-display type-lead font-semibold">Resolva comigo</h3>
        <span className="type-meta text-muted-foreground" data-numeric>
          {fim ? 'pronto' : `passo ${atual + 1} de ${questao.passos.length}`}
        </span>
      </header>

      {/* O caderno: cada passo respondido deixa a sua conta escrita. */}
      {escritas.length > 0 && (
        <div className="rounded-[var(--radius-control)] bg-[hsl(var(--surface-2))] border border-border px-4 py-2 space-y-1">
          {escritas.map((p, i) => <Conta key={i} fonte={p.conta!} reduzir={reduzir} />)}
        </div>
      )}

      <AnimatePresence mode="wait">
        {fim ? (
          <motion.div key="fim" initial={{ opacity: 0, x: reduzir ? 0 : 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-2 type-body">
              <span className="font-semibold">Resposta: ({'ABCDE'[questao.gabarito].toLowerCase()})</span>
              <MathText text={questao.alternativas[questao.gabarito]} className="font-reading" />
            </div>
            <p className="type-caption text-muted-foreground normal-case tracking-normal">
              {questao.banca} {questao.ano}, questão {questao.numero}. Gabarito oficial.
              {questao.adaptacao ? ` Adaptação: ${questao.adaptacao}` : ''}
            </p>
          </motion.div>
        ) : (
          <motion.div key={atual} initial={{ opacity: 0, x: reduzir ? 0 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduzir ? 0 : -30 }} transition={{ duration: 0.25 }}>
            <Passo passo={questao.passos[atual]} semente={sementeDoPasso(questao, atual)} onFim={() => setAtual(atual + 1)} reduzir={reduzir} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
