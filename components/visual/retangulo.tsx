'use client';
// Retângulo que cresce com o relógio (regra do produto, c6). O retângulo do
// passo anterior fica marcado por dentro; o que cresceu aparece em três
// pedaços: a faixa de cima (base · Δaltura), a do lado (altura · Δbase) e o
// canto (Δbase · Δaltura), que some quando o passo de tempo encolhe.

import { useMemo } from 'react';
import type { VisualRetangulo } from '@/lib/visual/especificacao';
import { numeroLatex, tentarCompilar } from '@/lib/visual/expressao';
import { COR, EIXO, Latex } from './grafico';
import { Controles, Deslizante, useRelogio } from './relogio';

const LARGURA = 320;
const ALTURA = 240;
const MARGEM = 24;
const LARGURA_ROTULO = 80;

const numero = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export function Retangulo({ v }: { v: VisualRetangulo }) {
  const relogio = useRelogio(v.x);
  const { t } = relogio;
  const { base, altura, escala } = useMemo(() => {
    const b = tentarCompilar(v.base) ?? (() => 0);
    const a = tentarCompilar(v.altura) ?? (() => 0);
    let maxB = 1;
    let maxA = 1;
    for (let k = v.x[0]; k <= v.x[1]; k++) { maxB = Math.max(maxB, b(k)); maxA = Math.max(maxA, a(k)); }
    // Mesma escala nos dois lados: a área no desenho é proporcional à área de verdade.
    return { base: b, altura: a, escala: Math.min((LARGURA - 2 * MARGEM) / maxB, (ALTURA - 2 * MARGEM) / maxA) };
  }, [v]);

  const b1 = base(t);
  const a1 = altura(t);
  const anterior = v.faixas && t > v.x[0];
  const b0 = anterior ? base(t - 1) : b1;
  const a0 = anterior ? altura(t - 1) : a1;
  const chao = ALTURA - MARGEM;
  const px = (n: number) => MARGEM + n * escala;
  const py = (n: number) => chao - n * escala;
  const u = v.unidade ?? 'm';
  const faixaCima = b0 * (a1 - a0);
  const faixaLado = a0 * (b1 - b0);
  const canto = (b1 - b0) * (a1 - a0);

  return (
    <div className="space-y-4">
      {/* Com faixas, o retângulo cresce com o tempo (c6); sem, a base é uma escolha (cerca, c10). */}
      <Deslizante relogio={relogio} rotulo={<span data-numeric className="font-semibold text-foreground">{v.faixas ? 't' : 'x'} = {numero(t)}</span>} />
      <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="w-full max-w-[360px] h-auto mx-auto" role="img" aria-label="Retângulo que cresce nos dois lados">
        <rect x={px(0)} y={py(a0)} width={b0 * escala} height={a0 * escala} fill={COR.a} fillOpacity={0.25} stroke={COR.a} strokeWidth={1.5} />
        {anterior && (
          <>
            <rect x={px(0)} y={py(a1)} width={b0 * escala} height={(a1 - a0) * escala} fill={COR.c} fillOpacity={0.55} />
            <rect x={px(b0)} y={py(a0)} width={(b1 - b0) * escala} height={a0 * escala} fill={COR.b} fillOpacity={0.55} />
            <rect x={px(b0)} y={py(a1)} width={(b1 - b0) * escala} height={(a1 - a0) * escala} fill={EIXO} fillOpacity={0.6} />
          </>
        )}
        <rect x={px(0)} y={py(a1)} width={b1 * escala} height={a1 * escala} fill="none" stroke="hsl(var(--foreground))" strokeWidth={2} />
        <text x={px(b1 / 2)} y={chao + 16} textAnchor="middle" fontSize={12} fill={EIXO}>base {numero(b1)} {u}</text>
        {/* Retângulo estreito: o rótulo da altura vai para fora, à direita. */}
        <text x={b1 * escala >= LARGURA_ROTULO ? px(0) + 6 : px(b1) + 6} y={b1 * escala >= LARGURA_ROTULO ? py(a1) + 16 : py(a1 / 2)}
          fontSize={12} fill="hsl(var(--foreground))">altura {numero(a1)} {u}</text>
      </svg>
      <div className="space-y-1 type-body" aria-live="polite">
        <p>
          <Latex fonte={`\\text{área} = ${numeroLatex(b1)} \\cdot ${numeroLatex(a1)} = ${numeroLatex(b1 * a1)}`} />
          <span className="text-muted-foreground"> {u}²</span>
        </p>
        {anterior && (
          <p className="text-muted-foreground">
            Cresceu <strong className="text-foreground">{numero(b1 * a1 - b0 * a0)} {u}²</strong>:{' '}
            <strong style={{ color: COR.c }}>faixa de cima {numero(faixaCima)}</strong>
            {' + '}<strong style={{ color: COR.b }}>faixa do lado {numero(faixaLado)}</strong>
            {' + '}<strong className="text-foreground">canto {numero(canto)}</strong>
          </p>
        )}
      </div>
      <Controles relogio={relogio} tocar={v.faixas ? 'Crescer' : 'Ver variando'} passo="Mais 1" />
    </div>
  );
}
