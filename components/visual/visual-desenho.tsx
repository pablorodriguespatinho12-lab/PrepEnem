'use client';
// Desenha um `Visual` (lib/visual/especificacao.ts) em SVG ou HTML.
// Todo desenho entra se desenhando (Pablo, 06/10/2026: "toda explicação com
// animação fluida"): curva traçada à caneta, linhas escritas uma a uma, setas
// crescendo. Só transform, opacity, clip-path e pathLength; parado sob
// movimento reduzido.
import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import type { VisualGrafico, Visual, VisualReta, VisualTabela, VisualTransformacao, VisualVetores } from '@/lib/visual/especificacao';
import { marcas } from '@/lib/visual/geometria';
import { renderizarTextoMatematico } from '@/lib/visual/texto-matematico';
import { Quadro } from './quadro';
import { Molecula } from './molecula';
import { ALTURA, COR, EIXO, Eixos, Grafico, HALO, LARGURA, Latex, MARGEM, corDe, escala } from './grafico';
import { Cena } from './cena';
import { Roda } from './roda';
import { Retangulo } from './retangulo';
import { Fatias } from './fatias';
import { Processo } from './processo';
function Reta({ v }: { v: VisualReta }) {
  const reduzir = useReducedMotion() ?? false;
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
            <motion.line x1={px(t.de)} x2={px(t.ate)} y1={meio} y2={meio} stroke={c} strokeWidth={5} strokeLinecap="butt"
              initial={reduzir ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 + i * 0.4, ease: [0.4, 0, 0.2, 1] }} />
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

/* Passo a passo da conta: a caneta escreve uma linha por vez (quadro.tsx). */
function Transformacao({ v }: { v: VisualTransformacao }) {
  return <Quadro partes={v.linhas.map((l) => ({ latex: l.latex, porque: l.porque }))} />;
}
function Tabela({ v }: { v: VisualTabela }) {
  const reduzir = useReducedMotion() ?? false;
  return (
    <div className="overflow-x-auto">
      <table className="w-full type-meta" data-numeric>
        <thead>
          <tr>{v.cabecalho.map((c, i) => <th key={i} className="text-left font-semibold px-3 py-2 border-b border-border">{c}</th>)}</tr>
        </thead>
        <tbody>
          {v.linhas.map((l, i) => (
            <motion.tr key={i} className="odd:bg-muted/40"
              initial={reduzir ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.15 + i * 0.25 }}>
              {l.map((c, j) => <td key={j} className="px-3 py-2 tabular-nums"><span dangerouslySetInnerHTML={{ __html: renderizarTextoMatematico(c) }} /></td>)}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Vetores({ v }: { v: VisualVetores }) {
  const reduzir = useReducedMotion() ?? false;
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
            {/* A seta cresce do ponto de aplicação; a ponta aparece no fim. */}
            <motion.line x1={e.px(w.de[0])} y1={e.py(w.de[1])} x2={e.px(w.para[0])} y2={e.py(w.para[1])}
              stroke={COR[c]} strokeWidth={3}
              initial={reduzir ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.35, ease: [0.4, 0, 0.2, 1] }} />
            <motion.line x1={e.px(w.de[0])} y1={e.py(w.de[1])} x2={e.px(w.para[0])} y2={e.py(w.para[1])}
              stroke="transparent" strokeWidth={3} markerEnd={`url(#seta-${c})`}
              initial={reduzir ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15, delay: 0.75 + i * 0.35 }} />
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


/* Gráfico parado entra traçado da esquerda para a direita, como caneta. */
const DURACAO_TRACO = 1.4;
function GraficoDesenhando({ v }: { v: VisualGrafico }) {
  const reduzir = useReducedMotion() ?? false;
  const [ateX, setAteX] = useState<number | undefined>(reduzir ? undefined : v.x[0]);
  useEffect(() => {
    if (reduzir) return;
    const controle = animate(v.x[0], v.x[1], {
      duration: DURACAO_TRACO, ease: [0.4, 0, 0.2, 1],
      onUpdate: setAteX, onComplete: () => setAteX(undefined),
    });
    return () => controle.stop();
  }, [v.x, reduzir]);
  return <Grafico v={v} ateX={ateX} />;
}
const INTERATIVOS: Visual['tipo'][] = ['cena', 'roda', 'retangulo', 'fatias'];

export function VisualDesenho({ visual }: { visual: Visual }) {
  return (
    <figure className="rounded-[var(--radius-control)] border border-border bg-[hsl(var(--surface-2))] p-3">
      {/* Nos desenhos que se mexem, o título do passo já diz o que é; o título
          extra ("Mexa no relógio...") só poluía (Pablo, 06/10/2026). */}
      {visual.titulo && !INTERATIVOS.includes(visual.tipo) && <figcaption className="type-meta font-medium text-muted-foreground mb-2">{visual.titulo}</figcaption>}
      {visual.tipo === 'grafico' && <GraficoDesenhando v={visual} />}
      {visual.tipo === 'reta' && <Reta v={visual} />}
      {visual.tipo === 'transformacao' && <Transformacao v={visual} />}
      {visual.tipo === 'tabela' && <Tabela v={visual} />}
      {visual.tipo === 'vetores' && <Vetores v={visual} />}
      {visual.tipo === 'cena' && <Cena v={visual} />}
      {visual.tipo === 'roda' && <Roda v={visual} />}
      {visual.tipo === 'retangulo' && <Retangulo v={visual} />}
      {visual.tipo === 'fatias' && <Fatias v={visual} />}
      {visual.tipo === 'processo' && <Processo v={visual} />}
      {visual.tipo === 'molecula' && <Molecula v={visual} />}
    </figure>
  );
}
