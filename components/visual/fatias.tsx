'use client';
// Área sob a curva como soma de retângulos (integral, c11). O controle muda o
// número de fatias: cada retângulo usa a altura do começo da fatia, e a soma
// encosta na área de verdade conforme as fatias afinam.

import { useMemo } from 'react';
import type { VisualFatias } from '@/lib/visual/especificacao';
import { tentarCompilar } from '@/lib/visual/expressao';
import { amostrar, faixaAutomatica, somaPelaEsquerda } from '@/lib/visual/geometria';
import { ALTURA, COR, Eixos, LARGURA, escala } from './grafico';
import { Controles, Deslizante, useRelogio } from './relogio';

const SEGUNDOS_POR_FATIA = 0.25;
const FATIAS_DA_AREA = 4000; // fino o bastante para a "área de verdade" bater na segunda casa
const numero = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export function Fatias({ v }: { v: VisualFatias }) {
  // Passo curto: com 30 fatias, 0,9 s por fatia seriam 27 s de espera.
  const relogio = useRelogio([1, v.maxFatias], { continuo: false, segundosPorUnidade: SEGUNDOS_POR_FATIA });
  const n = relogio.t;
  const desenho = useMemo(() => {
    const f = tentarCompilar(v.expr) ?? (() => NaN);
    const pontos = amostrar(f, v.x, Infinity);
    const y = faixaAutomatica([0, ...pontos.map((p) => p?.y ?? NaN)]);
    const e = escala(v.x, y);
    const traco = pontos.reduce((d, p, i) => (p ? `${d}${d && pontos[i - 1] ? 'L' : 'M'}${e.px(p.x).toFixed(1)},${e.py(p.y).toFixed(1)}` : d), '');
    return { f, y, e, traco, area: somaPelaEsquerda(f, v.x, FATIAS_DA_AREA) };
  }, [v]);
  const { f, y, e, traco, area } = desenho;
  const largura = (v.x[1] - v.x[0]) / n;
  const soma = somaPelaEsquerda(f, v.x, n);
  const retangulos = Array.from({ length: n }, (_, k) => {
    const x0 = v.x[0] + k * largura;
    const h = f(x0);
    return { x: e.px(x0), w: e.px(x0 + largura) - e.px(x0), topo: e.py(Math.max(h, 0)), base: e.py(Math.min(h, 0)) };
  });

  return (
    <div className="space-y-4">
      <Deslizante relogio={relogio} rotulo={<span data-numeric className="font-semibold text-foreground">{n} {n === 1 ? 'fatia' : 'fatias'}</span>} />
      <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="w-full h-auto" role="img" aria-label={`${n} fatias sob a curva`}>
        <Eixos x={v.x} y={y} e={e} />
        {retangulos.map((r, k) => (
          <rect key={k} x={r.x} y={r.topo} width={Math.max(r.w - (n > 25 ? 0 : 1), 0.5)} height={Math.max(r.base - r.topo, 0)}
            fill={COR.b} fillOpacity={0.35} stroke={COR.b} strokeWidth={n > 25 ? 0 : 1} />
        ))}
        <path d={traco} fill="none" stroke={COR.a} strokeWidth={2.5} strokeLinejoin="round" />
      </svg>
      <div className="space-y-1 type-body" aria-live="polite">
        <p>
          <span className="text-muted-foreground">{n} {n === 1 ? 'fatia' : 'fatias'} de largura {numero(largura)}: soma dos retângulos = </span>
          <strong data-numeric style={{ color: COR.b }}>{numero(soma)}</strong>
        </p>
        <p className="text-muted-foreground">
          Área de verdade embaixo da curva: <strong data-numeric className="text-foreground">{numero(area)}</strong>
        </p>
      </div>
      <Controles relogio={relogio} tocar="Ver afinando" passo="Mais 1 fatia" />
      {v.unidadeX && v.unidadeY && (
        <p className="type-caption text-muted-foreground">Cada retângulo: largura em {v.unidadeX} vezes altura em {v.unidadeY}.</p>
      )}
    </div>
  );
}
