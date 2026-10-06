'use client';
// Ponto girando num círculo. Sem centro: o círculo de raio 1, com o cosseno
// como a sombra no chão e o seno como a altura (lição p9). Com centro: a
// roda-gigante, em que a altura da cadeira é centro + raio · sen θ (p10).
// O gráfico opcional desenrola a altura volta a volta.

import type { VisualGrafico, VisualRoda } from '@/lib/visual/especificacao';
import { numeroLatex } from '@/lib/visual/expressao';
import { Grafico, Latex, COR, EIXO } from './grafico';
import { Controles, Deslizante, useRelogio } from './relogio';

const R = 110; // raio do desenho, em px
const MARGEM = 34;
const LARGURA = 2 * (R + MARGEM);

const numero = (n: number) => (Math.abs(n) < 1e-9 ? 0 : n).toLocaleString('pt-BR', { maximumFractionDigits: 2 });

function geometria(v: VisualRoda, k: number) {
  const graus = (k * 360) / v.divisoes;
  const theta = (graus * Math.PI) / 180;
  return { graus, theta, cos: Math.cos(theta), sen: Math.sin(theta), altura: v.centro + v.raio * Math.sin(theta) };
}

function Circulo({ v, k }: { v: VisualRoda; k: number }) {
  const { theta, cos, sen } = geometria(v, k);
  const cx = R + MARGEM;
  const cy = R + MARGEM;
  const px = cx + R * cos;
  const py = cy - R * sen;
  const arco = 26;
  const grande = theta % (2 * Math.PI) > Math.PI ? 1 : 0;
  const fimArco = { x: cx + arco * Math.cos(theta), y: cy - arco * Math.sin(theta) };
  return (
    <svg viewBox={`0 0 ${LARGURA} ${LARGURA}`} className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="Ponto girando no círculo de raio 1">
      <line x1={MARGEM / 2} x2={LARGURA - MARGEM / 2} y1={cy} y2={cy} stroke={EIXO} strokeWidth={1} />
      <line x1={cx} x2={cx} y1={MARGEM / 2} y2={LARGURA - MARGEM / 2} stroke={EIXO} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="hsl(var(--border))" strokeWidth={2} />
      {k % v.divisoes !== 0 && (
        <path d={`M${cx + arco},${cy} A${arco},${arco} 0 ${grande} 0 ${fimArco.x},${fimArco.y}`} fill="none" stroke={EIXO} strokeWidth={1.5} />
      )}
      <line x1={cx} y1={cy} x2={px} y2={py} stroke="hsl(var(--foreground))" strokeWidth={1.5} />
      <line x1={cx} y1={cy} x2={px} y2={cy} stroke={COR.a} strokeWidth={4} strokeLinecap="round" />
      <line x1={px} y1={cy} x2={px} y2={py} stroke={COR.b} strokeWidth={4} strokeLinecap="round" />
      <circle cx={px} cy={py} r={7} fill="hsl(var(--foreground))" />
      <text x={(cx + px) / 2} y={cy + (sen >= 0 ? 18 : -10)} textAnchor="middle" fontSize={13} fontWeight={600} fill={COR.a}>cos</text>
      <text x={px + (cos >= 0 ? 8 : -8)} y={(cy + py) / 2 + 4} textAnchor={cos >= 0 ? 'start' : 'end'} fontSize={13} fontWeight={600} fill={COR.b}>sen</text>
      <text x={LARGURA - MARGEM / 2} y={cy - 6} textAnchor="end" fontSize={11} fill={EIXO}>1</text>
      <text x={cx + 6} y={MARGEM / 2 + 10} fontSize={11} fill={EIXO}>1</text>
    </svg>
  );
}

function RodaGigante({ v, k }: { v: VisualRoda; k: number }) {
  const { theta } = geometria(v, k);
  const escala = R / v.raio;
  const cx = R + MARGEM;
  const cy = R + MARGEM / 2;
  const chao = cy + v.centro * escala;
  const altura = chao + 24;
  const px = cx + R * Math.cos(theta);
  const py = cy - R * Math.sin(theta);
  const raios = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <svg viewBox={`0 0 ${LARGURA} ${altura}`} className="w-full max-w-[320px] h-auto mx-auto" role="img" aria-label="Roda-gigante girando">
      <line x1={0} x2={LARGURA} y1={chao} y2={chao} stroke={EIXO} strokeWidth={2} />
      <line x1={cx} y1={cy} x2={cx - 40} y2={chao} stroke={EIXO} strokeWidth={2} />
      <line x1={cx} y1={cy} x2={cx + 40} y2={chao} stroke={EIXO} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="hsl(var(--border))" strokeWidth={3} />
      {raios.map((a) => (
        <line key={a} x1={cx} y1={cy} x2={cx + R * Math.cos(a + theta)} y2={cy - R * Math.sin(a + theta)} stroke="hsl(var(--border))" strokeWidth={1} />
      ))}
      <line x1={px} y1={py} x2={px} y2={chao} stroke={COR.b} strokeWidth={2.5} strokeDasharray="5 4" />
      <rect x={px - 10} y={py - 8} width={20} height={16} rx={3} fill={COR.a} />
      {/* O rótulo fica do lado de dentro da roda, senão sai cortado na borda. */}
      <text x={px > cx ? px - 10 : px + 10} y={(py + chao) / 2} textAnchor={px > cx ? 'end' : 'start'} fontSize={13} fontWeight={600} fill={COR.b}>altura</text>
    </svg>
  );
}

export function Roda({ v }: { v: VisualRoda }) {
  const relogio = useRelogio([0, v.divisoes * v.voltas]);
  const { t } = relogio;
  const { graus, cos, sen, altura } = geometria(v, t);
  const gigante = v.centro !== 0 || v.raio !== 1;
  const u = v.unidade ?? 'm';
  const passoGraus = 360 / v.divisoes;
  const valor = (k: number) => geometria(v, k).altura;
  const ate = Array.from({ length: t + 1 }, (_, k) => k);
  const grafico: VisualGrafico = {
    tipo: 'grafico',
    x: [0, 2 * Math.PI * v.voltas],
    y: [Math.min(0, v.centro - v.raio) - v.raio * 0.15, v.centro + v.raio * 1.15],
    funcoes: relogio.terminou ? [{ expr: gigante ? `${v.centro}+${v.raio}*sin(x)` : 'sin(x)', rotulo: gigante ? 'altura' : 'sen x', cor: 'b' }] : [],
    pontos: ate.map((k) => ({ x: (k * 2 * Math.PI) / v.divisoes, y: valor(k), cor: 'b' as const })),
  };

  return (
    <div className="space-y-4">
      <Deslizante relogio={relogio} rotulo={<>Ângulo <span data-numeric className="font-semibold text-foreground">θ = {numero(graus)}°</span></>} />
      {gigante ? <RodaGigante v={v} k={t} /> : <Circulo v={v} k={t} />}
      <div className="space-y-1 type-body" aria-live="polite">
        {gigante ? (
          <p>
            <Latex fonte={`${numeroLatex(v.centro)} + ${numeroLatex(v.raio)}\\cdot \\operatorname{sen} ${numeroLatex(graus)}^\\circ = ${numeroLatex(altura)}`} />
            <span className="text-muted-foreground"> → a cadeira está a </span>
            <strong data-numeric style={{ color: COR.b }}>{numero(altura)} {u}</strong>
            <span className="text-muted-foreground"> do chão</span>
          </p>
        ) : (
          <>
            <p>
              <Latex fonte={`\\cos ${numeroLatex(graus)}^\\circ = ${numeroLatex(cos)}`} />
              <span className="text-muted-foreground"> → a sombra no chão, </span><strong style={{ color: COR.a }}>para o lado</strong>
            </p>
            <p>
              <Latex fonte={`\\operatorname{sen} ${numeroLatex(graus)}^\\circ = ${numeroLatex(sen)}`} />
              <span className="text-muted-foreground"> → a </span><strong style={{ color: COR.b }}>altura</strong>
            </p>
          </>
        )}
      </div>
      <Controles relogio={relogio} tocar="Girar" passo={`Mais ${numero(passoGraus)}°`} />
      {v.grafico && (
        <div>
          <p className="type-meta text-muted-foreground mb-1">
            {relogio.terminou
              ? 'A altura, volta a volta: uma onda que se repete. No eixo x, o ângulo em radianos (uma volta = 2π ≈ 6,28).'
              : 'Cada passo deixa um ponto: (ângulo, altura). Gire até o fim para ver a onda inteira.'}
          </p>
          <Grafico v={grafico} />
        </div>
      )}
    </div>
  );
}
