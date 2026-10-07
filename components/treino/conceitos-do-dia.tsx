'use client';
// Conceitos do dia, um por vez e já em ordem (Pablo, 07/10/2026: "ao invés de
// eu clicar e escolher, já aparece na minha tela, em ordem"). Para cada
// assunto: o que precisa saber antes → o que o assunto é → os passos do
// raciocínio → a regra e como cai no ENEM. Continuar avança; o último leva ao
// treino. Mesma forma das lições de Cálculo.

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import type { ResumoAssunto } from '@/lib/tutor/resumo';

type Cartao =
  | { tipo: 'antes'; titulo: string; texto: string; visual: ResumoAssunto['antes'][number]['visual'] }
  | { tipo: 'oQueE'; oQueE: string; ideia: string }
  | { tipo: 'passo'; titulo: string; texto: string; visual: ResumoAssunto['construcao'][number]['visual'] }
  | { tipo: 'regra'; regra: string; dicaEnem: string };

interface Etapa { assunto: ResumoAssunto; cartao: Cartao }

export function montarEtapas(resumos: ResumoAssunto[]): Etapa[] {
  return resumos.flatMap((assunto) => {
    const cartoes: Cartao[] = [
      ...(assunto.antes ?? []).map((a) => ({ tipo: 'antes' as const, ...a })),
      { tipo: 'oQueE', oQueE: assunto.oQueE ?? '', ideia: assunto.ideia },
      ...assunto.construcao.map((p) => ({ tipo: 'passo' as const, ...p })),
      ...(assunto.regra || assunto.dicaEnem ? [{ tipo: 'regra' as const, regra: assunto.regra, dicaEnem: assunto.dicaEnem }] : []),
    ];
    return cartoes.map((cartao) => ({ assunto, cartao }));
  });
}

function Conteudo({ cartao }: { cartao: Cartao }) {
  if (cartao.tipo === 'antes') {
    return (
      <div className="space-y-3">
        <p className="type-caption text-primary-text">Você precisa disto antes</p>
        <p className="font-display type-lead font-semibold">{cartao.titulo}</p>
        {cartao.visual && <VisualDesenho visual={cartao.visual} />}
        <MathText text={cartao.texto} className="font-reading type-body block" />
      </div>
    );
  }
  if (cartao.tipo === 'oQueE') {
    return (
      <div className="space-y-3">
        {cartao.oQueE && <MathText text={cartao.oQueE} className="font-reading type-lead block" />}
        <MathText text={cartao.ideia} className="font-display type-body font-semibold block" />
      </div>
    );
  }
  if (cartao.tipo === 'passo') {
    return (
      <div className="space-y-3">
        {cartao.visual && <VisualDesenho visual={cartao.visual} />}
        <p className="type-meta font-semibold">{cartao.titulo}</p>
        <MathText text={cartao.texto} className="font-reading type-body block" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {cartao.regra && (
        <div className="rounded-[var(--radius-control)] border-l-4 border-primary bg-[hsl(var(--surface-2))] p-3">
          <p className="type-caption text-muted-foreground mb-1">Resumo</p>
          <MathText text={cartao.regra} className="font-reading" />
        </div>
      )}
      {cartao.dicaEnem && (
        <div className="border-l-2 border-primary/40 pl-3 py-0.5">
          <p className="type-caption text-muted-foreground mb-1">Como cai no ENEM</p>
          <MathText text={cartao.dicaEnem} className="type-body font-reading text-foreground/90 measure-reading block" />
        </div>
      )}
    </div>
  );
}

const BOTAO = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] font-medium type-meta t-colors';

export function ConceitosDoDia({ resumos, cores, onComecar }: {
  resumos: ResumoAssunto[]; cores: Record<string, string>; onComecar: () => void;
}) {
  const reduzir = useReducedMotion() ?? false;
  const etapas = montarEtapas(resumos);
  const [atual, setAtual] = useState(0);
  const [direcao, setDirecao] = useState(1);
  if (etapas.length === 0) return null;

  const { assunto, cartao } = etapas[atual];
  const doAssunto = etapas.filter((e) => e.assunto === assunto);
  const posicao = doAssunto.findIndex((e) => e === etapas[atual]);
  const ultima = atual === etapas.length - 1;
  const ir = (passo: number) => { setDirecao(passo); setAtual((a) => a + passo); };
  const desloca = reduzir ? 0 : 30;

  return (
    <section className="surface-1 rounded-[var(--radius-surface)] border border-border shadow-elev-1 p-5 md:p-6 space-y-5" aria-live="polite">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span aria-hidden className="w-[3px] h-9 rounded-[var(--radius-data)] shrink-0" style={{ backgroundColor: cores[assunto.materia] ?? 'hsl(var(--border))' }} />
          <div className="min-w-0">
            <p className="font-display type-body font-semibold">{assunto.materia}</p>
            <p className="type-meta text-muted-foreground">{assunto.subtema}</p>
          </div>
        </div>
        <div className="flex gap-1.5 pt-2" aria-label={`Parte ${posicao + 1} de ${doAssunto.length}`}>
          {doAssunto.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full t-colors ${i === posicao ? 'w-5 bg-primary' : 'w-1.5 bg-border'}`} />
          ))}
        </div>
      </header>

      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false} custom={direcao}>
          <motion.div key={atual} custom={direcao}
            initial={{ opacity: 0, x: direcao * desloca }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -direcao * desloca }}
            transition={{ duration: 0.25 }}>
            <Conteudo cartao={cartao} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {atual > 0 && (
          <button type="button" onClick={() => ir(-1)} className={`${BOTAO} text-muted-foreground hover:text-foreground`}>
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        )}
        {ultima ? (
          <button type="button" onClick={onComecar} className={`${BOTAO} bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]`}>
            <Play className="w-4 h-4" /> Começar treino
          </button>
        ) : (
          <button type="button" onClick={() => ir(1)} className={`${BOTAO} bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]`}>
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <span className="ml-auto type-caption text-muted-foreground" data-numeric>{atual + 1} de {etapas.length}</span>
      </div>
    </section>
  );
}
