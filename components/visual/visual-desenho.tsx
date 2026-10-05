'use client';
// Desenha um `Visual` (lib/visual/especificacao.ts) em SVG. Os rótulos ficam
// DENTRO do desenho, junto da parte que nomeiam (contiguidade de Mayer), e a
// cor de cada traço é a mesma do termo na explicação (sinalização).

import { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import type {
  CorVisual, Visual, VisualGrafico, VisualReta, VisualTabela, VisualTransformacao, VisualVetores,
} from '@/lib/visual/especificacao';
import { tentarCompilar } from '@/lib/visual/expressao';
import { amostrar, faixaAutomatica, marcas } from '@/lib/visual/geometria';
import { renderizarTextoMatematico } from '@/lib/visual/texto-matematico';

const LARGURA = 480;
const ALTURA = 300;
const MARGEM = 28;

const COR: Record<CorVisual, string> = {
  a: 'hsl(var(--chart-1))',
  b: 'hsl(var(--chart-2))',
  c: 'hsl(var(--chart-3))',
  erro: 'hsl(var(--danger))',
};
const corDe = (c: CorVisual | undefined, indice = 0): string => COR[c ?? (['a', 'b', 'c'] as const)[indice % 3]];

const EIXO = 'hsl(var(--muted-foreground))';
/* Contorno da cor do fundo atrás do rótulo: legível por cima de grade e traço. */
const HALO = { paintOrder: 'stroke', stroke: 'hsl(var(--surface-2))', strokeWidth: 4, strokeLinejoin: 'round' } as const;
const GRADE = 'hsl(var(--border))';

function Latex({ fonte }: { fonte: string }) {
  const html = useMemo(() => renderizarTextoMatematico(`$${fonte}$`), [fonte]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

type Escala = { px: (x: number) => number; py: (y: number) => number };

function escala(x: [number, number], y: [number, number]): Escala {
  return {
    px: (v) => MARGEM + ((v - x[0]) / (x[1] - x[0])) * (LARGURA - 2 * MARGEM),
    py: (v) => ALTURA - MARGEM - ((v - y[0]) / (y[1] - y[0])) * (ALTURA - 2 * MARGEM),
  };
}

function Eixos({ x, y, e }: { x: [number, number]; y: [number, number]; e: Escala }) {
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

function Grafico({ v }: { v: VisualGrafico }) {
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

function Reta({ v }: { v: VisualReta }) {
  const altura = 110;
  const meio = 56;
  const px = (x: number) => MARGEM + ((x - v.de) / (v.ate - v.de)) * (LARGURA - 2 * MARGEM);
  return (
    <svg viewBox={`0 0 ${LARGURA} ${altura}`} className="w-full h-auto" role="img" aria-label={v.titulo ?? 'Reta numérica'}>
      <line x1={MARGEM - 10} x2={LARGURA - MARGEM + 10} y1={meio} y2={meio} stroke={EIXO} strokeWidth={1.2} />
      {marcas([v.de, v.ate], 10).map((x) => (
        <g key={x} fontSize={11} fill={EIXO}>
          <line x1={px(x)} x2={px(x)} y1={meio - 4} y2={meio + 4} stroke={EIXO} />
          <text x={px(x)} y={meio + 18} textAnchor="middle">{x}</text>
        </g>
      ))}
      {(v.trechos ?? []).map((t, i) => {
        const c = corDe(t.cor, i);
        return (
          <g key={i}>
            <line x1={px(t.de)} x2={px(t.ate)} y1={meio} y2={meio} stroke={c} strokeWidth={5} strokeLinecap="butt" />
            <circle cx={px(t.de)} cy={meio} r={5.5} fill={t.fechadoDe ? c : 'hsl(var(--background))'} stroke={c} strokeWidth={2} />
            <circle cx={px(t.ate)} cy={meio} r={5.5} fill={t.fechadoAte ? c : 'hsl(var(--background))'} stroke={c} strokeWidth={2} />
            {t.rotulo && <text x={(px(t.de) + px(t.ate)) / 2} y={meio - 14 - i * 14} textAnchor="middle" fontSize={12} fontWeight={600} {...HALO} fill={c}>{t.rotulo}</text>}
          </g>
        );
      })}
      {(v.marcas ?? []).map((m, i) => (
        <g key={`m${i}`}>
          <circle cx={px(m.x)} cy={meio} r={4} fill={corDe(m.cor, 1)} />
          {m.rotulo && <text x={px(m.x)} y={meio + 34} textAnchor="middle" fontSize={12} fontWeight={600} {...HALO} fill={corDe(m.cor, 1)}>{m.rotulo}</text>}
        </g>
      ))}
    </svg>
  );
}

function Transformacao({ v }: { v: VisualTransformacao }) {
  return (
    <ol className="space-y-1">
      {v.linhas.map((l, i) => (
        <li key={i} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[var(--radius-control)] px-3 py-2 odd:bg-muted/40">
          <span className="text-body overflow-x-auto"><Latex fonte={l.latex} /></span>
          {l.porque && <span className="type-meta text-muted-foreground text-right max-w-[14rem]">{l.porque}</span>}
        </li>
      ))}
    </ol>
  );
}

function Tabela({ v }: { v: VisualTabela }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full type-meta" data-numeric>
        <thead>
          <tr>{v.cabecalho.map((c, i) => <th key={i} className="text-left font-semibold px-3 py-2 border-b border-border">{c}</th>)}</tr>
        </thead>
        <tbody>
          {v.linhas.map((l, i) => (
            <tr key={i} className="odd:bg-muted/40">
              {l.map((c, j) => <td key={j} className="px-3 py-2 tabular-nums"><span dangerouslySetInnerHTML={{ __html: renderizarTextoMatematico(c) }} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Vetores({ v }: { v: VisualVetores }) {
  const xs = [...v.vetores.flatMap((w) => [w.de[0], w.para[0]]), ...(v.pontos ?? []).map((p) => p.x)];
  const ys = [...v.vetores.flatMap((w) => [w.de[1], w.para[1]]), ...(v.pontos ?? []).map((p) => p.y)];
  const proporcao = LARGURA / ALTURA;
  const lado = Math.max((Math.max(...xs) - Math.min(...xs)) / proporcao, Math.max(...ys) - Math.min(...ys), 1) * 0.65;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const e = escala([cx - lado * proporcao, cx + lado * proporcao], [cy - lado, cy + lado]);
  return (
    <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="w-full h-auto" role="img" aria-label={v.titulo ?? 'Vetores'}>
      <defs>
        {(['a', 'b', 'c', 'erro'] as const).map((c) => (
          <marker key={c} id={`seta-${c}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={COR[c]} />
          </marker>
        ))}
      </defs>
      {v.vetores.map((w, i) => {
        const c = w.cor ?? (['a', 'b', 'c'] as const)[i % 3];
        return (
          <g key={i}>
            <line x1={e.px(w.de[0])} y1={e.py(w.de[1])} x2={e.px(w.para[0])} y2={e.py(w.para[1])}
              stroke={COR[c]} strokeWidth={3} markerEnd={`url(#seta-${c})`} />
            {w.rotulo && (
              <text x={e.px((w.de[0] + w.para[0]) / 2) + 6} y={e.py((w.de[1] + w.para[1]) / 2) - 8}
                fontSize={13} fontWeight={600} {...HALO} fill={COR[c]}>{w.rotulo}</text>
            )}
          </g>
        );
      })}
      {(v.pontos ?? []).map((p, i) => (
        <g key={`p${i}`}>
          <circle cx={e.px(p.x)} cy={e.py(p.y)} r={6} fill="hsl(var(--foreground))" />
          {p.rotulo && <text x={e.px(p.x) + 9} y={e.py(p.y) + 16} fontSize={12} fill="hsl(var(--foreground))" {...HALO}>{p.rotulo}</text>}
        </g>
      ))}
    </svg>
  );
}

export function VisualDesenho({ visual }: { visual: Visual }) {
  return (
    <figure className="rounded-[var(--radius-control)] border border-border bg-[hsl(var(--surface-2))] p-3">
      {visual.titulo && <figcaption className="type-meta font-medium text-muted-foreground mb-2">{visual.titulo}</figcaption>}
      {visual.tipo === 'grafico' && <Grafico v={visual} />}
      {visual.tipo === 'reta' && <Reta v={visual} />}
      {visual.tipo === 'transformacao' && <Transformacao v={visual} />}
      {visual.tipo === 'tabela' && <Tabela v={visual} />}
      {visual.tipo === 'vetores' && <Vetores v={visual} />}
    </figure>
  );
}
