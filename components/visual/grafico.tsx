'use client';
// Peças comuns dos desenhos: cores, escala, eixos e o gráfico de funções.
// Os rótulos ficam DENTRO do desenho, junto da parte que nomeiam (contiguidade
// de Mayer), e a cor de cada traço é a mesma do termo na explicação.
import { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import type { CorVisual, VisualGrafico } from '@/lib/visual/especificacao';
import { tentarCompilar } from '@/lib/visual/expressao';
import { amostrar, faixaAutomatica, marcas } from '@/lib/visual/geometria';
import { renderizarTextoMatematico } from '@/lib/visual/texto-matematico';
export const LARGURA = 480;
export const ALTURA = 300;
export const MARGEM = 28;

export const COR: Record<CorVisual, string> = {
  a: 'hsl(var(--chart-1))',
  b: 'hsl(var(--chart-2))',
  c: 'hsl(var(--chart-3))',
  erro: 'hsl(var(--danger))',
};
export const corDe = (c: CorVisual | undefined, indice = 0): string => COR[c ?? (['a', 'b', 'c'] as const)[indice % 3]];

export const EIXO = 'hsl(var(--muted-foreground))';
/* Contorno da cor do fundo atrás do rótulo: legível por cima de grade e traço. */
export const HALO = { paintOrder: 'stroke', stroke: 'hsl(var(--surface-2))', strokeWidth: 4, strokeLinejoin: 'round' } as const;
export const GRADE = 'hsl(var(--border))';

export function Latex({ fonte }: { fonte: string }) {
  const html = useMemo(() => renderizarTextoMatematico(`$${fonte}$`), [fonte]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export type Escala = { px: (x: number) => number; py: (y: number) => number };

export function escala(x: [number, number], y: [number, number]): Escala {
  return {
    px: (v) => MARGEM + ((v - x[0]) / (x[1] - x[0])) * (LARGURA - 2 * MARGEM),
    py: (v) => ALTURA - MARGEM - ((v - y[0]) / (y[1] - y[0])) * (ALTURA - 2 * MARGEM),
  };
}

export function Eixos({ x, y, e }: { x: [number, number]; y: [number, number]; e: Escala }) {
  const zeroX = x[0] <= 0 && x[1] >= 0 ? e.px(0) : MARGEM;
  const zeroY = y[0] <= 0 && y[1] >= 0 ? e.py(0) : ALTURA - MARGEM;
  return (
    <g fontSize={11} fill={EIXO}>
      {marcas(x).map((v) => (
        <g key={`x${v}`}>
          <line x1={e.px(v)} x2={e.px(v)} y1={MARGEM} y2={ALTURA - MARGEM} stroke={GRADE} strokeWidth={0.5} />
          {v !== 0 && <text x={e.px(v)} y={zeroY + 14} textAnchor="middle">{v}</text>}
        </g>
      ))}
      {marcas(y, 6).map((v) => (
        <g key={`y${v}`}>
          <line x1={MARGEM} x2={LARGURA - MARGEM} y1={e.py(v)} y2={e.py(v)} stroke={GRADE} strokeWidth={0.5} />
          {v !== 0 && <text x={zeroX - 5} y={e.py(v) + 4} textAnchor="end">{v}</text>}
        </g>
      ))}
      <line x1={MARGEM} x2={LARGURA - MARGEM} y1={zeroY} y2={zeroY} stroke={EIXO} strokeWidth={1.2} />
      <line x1={zeroX} x2={zeroX} y1={MARGEM} y2={ALTURA - MARGEM} stroke={EIXO} strokeWidth={1.2} />
      <text x={LARGURA - MARGEM + 4} y={zeroY + 4}>x</text>
      <text x={zeroX + 4} y={MARGEM - 8}>y</text>
    </g>
  );
}

export function Grafico({ v }: { v: VisualGrafico }) {
  const desenho = useMemo(() => {
    const funcoes = v.funcoes
      .map((f) => ({ ...f, fn: tentarCompilar(f.expr) }))
      .filter((f): f is typeof f & { fn: NonNullable<typeof f.fn> } => f.fn !== null);
    const brutos = funcoes.flatMap((f) => amostrar(f.fn, v.x, Infinity).map((p) => p?.y ?? NaN));
    const y = v.y ?? faixaAutomatica([...brutos, ...(v.pontos ?? []).map((p) => p.y)]);
    const e = escala(v.x, y);
    const dentro = (py: number) => py >= MARGEM - 2 && py <= ALTURA - MARGEM + 2;
    const tracos = funcoes.map((f, i) => {
      let d = '';
      let ultimo: { x: number; y: number } | null = null;
      let caneta = false;
      for (const p of amostrar(f.fn, v.x, y[1] - y[0])) {
        if (!p || !dentro(e.py(p.y))) { caneta = false; continue; }
        d += `${caneta ? 'L' : 'M'}${e.px(p.x).toFixed(1)},${e.py(p.y).toFixed(1)}`;
        caneta = true;
        ultimo = p;
      }
      return { d, cor: corDe(f.cor, i), rotulo: f.rotulo ?? `y = ${f.expr}`, ultimo };
    });
    return { y, e, tracos };
  }, [v]);

  const { y, e, tracos } = desenho;
  return (
    <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="w-full h-auto" role="img" aria-label={v.titulo ?? 'Gráfico'}>
      <Eixos x={v.x} y={y} e={e} />
      {tracos.map((t, i) => (
        <g key={i}>
          <path d={t.d} fill="none" stroke={t.cor} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {t.ultimo && (
            <text x={Math.min(e.px(t.ultimo.x), LARGURA - MARGEM) - 4} y={e.py(t.ultimo.y) - 8 - i * 14}
              textAnchor="end" fontSize={12} fontWeight={600} {...HALO} fill={t.cor}>{t.rotulo}</text>
          )}
        </g>
      ))}
      {(v.pontos ?? []).map((p, i) => (
        <g key={`p${i}`}>
          <circle cx={e.px(p.x)} cy={e.py(p.y)} r={4.5} fill={corDe(p.cor, 1)} stroke="hsl(var(--background))" strokeWidth={1.5} />
          {p.rotulo && (
            <text x={e.px(p.x) + 7} y={e.py(p.y) - 7} fontSize={12} fontWeight={600} {...HALO} fill={corDe(p.cor, 1)}>{p.rotulo}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

