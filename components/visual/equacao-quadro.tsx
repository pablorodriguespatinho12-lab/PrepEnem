'use client';
/* A equação da aula no quadro branco (Pablo, 18/11/2026: "deixar essa equação em quadro,
   não só texto... e explicar melhor o que é cada letra, igual lá no robozinho").
   A fórmula grande, cada letra numa cor; embaixo, a leitura em palavras e uma linha por
   letra, "U = quanto vale cada pedaço", com a letra na mesma cor. Quadro branco também
   no escuro (mesmo .quadro-escola). Sem movimento: o passo já entra com animação. */
import type { ReactNode } from 'react';
import type { VisualEquacao } from '@/lib/visual/especificacao';

/* Cores que leem bem sobre o quadro branco, nos dois temas. */
const CORES = ['#1d4ed8', '#c2410c', '#15803d', '#7e22ce', '#b91c1c', '#0e7490'];
const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Pinta cada letra da lista onde ela aparece sozinha na fórmula (S1 não pinta o S de S2). */
function pintar(formula: string, letras: string[]): ReactNode[] {
  const ordem = [...letras].sort((a, b) => b.length - a.length);
  if (ordem.length === 0) return [formula];
  const busca = new RegExp(`(?<![\\p{L}\\p{N}])(${ordem.map(escapar).join('|')})(?![\\p{L}\\p{N}])`, 'gu');
  const pedacos: ReactNode[] = [];
  let fim = 0;
  for (const achado of formula.matchAll(busca)) {
    const i = achado.index ?? 0;
    if (i > fim) pedacos.push(formula.slice(fim, i));
    const cor = CORES[letras.indexOf(achado[0]) % CORES.length];
    pedacos.push(<b key={i} style={{ color: cor }}>{achado[0]}</b>);
    fim = i + achado[0].length;
  }
  if (fim < formula.length) pedacos.push(formula.slice(fim));
  return pedacos;
}

export function EquacaoQuadro({ v }: { v: VisualEquacao }) {
  const letras = v.letras.map((l) => l.letra);
  return (
    <div className="quadro-escola mx-auto w-full max-w-2xl rounded-[var(--radius-control)] px-4 py-4 md:px-6 md:py-5" style={{ color: 'hsl(var(--quadro-tinta))' }}>
      <p className="text-center font-reading text-[clamp(1.25rem,1rem+1.4vw,2rem)] leading-snug tabular-nums">{pintar(v.formula, letras)}</p>
      {v.leitura && <p className="mt-1 text-center text-sm opacity-75">{v.leitura}</p>}
      <ul className="mt-4 grid gap-1.5 border-t border-dashed border-[hsl(var(--quadro-linha))] pt-3">
        {v.letras.map((l, i) => (
          <li key={l.letra} className="flex items-baseline gap-2 text-[0.95rem] leading-snug">
            <b className="min-w-[2.2rem] text-right font-reading text-lg" style={{ color: CORES[i % CORES.length] }}>{l.letra}</b>
            <span className="opacity-60">=</span>
            <span>{l.oque}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
