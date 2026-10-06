'use client';
// Cena com relógio: cada veículo anda pela própria função. x é o tempo e f(x)
// é onde ele está (ou, na vela, quanto ela mede). O gráfico fica embaixo e
// anda junto, para a fórmula virar uma coisa que se vê (pedido do Pablo,
// 06/10/2026). Só transform na animação: roda no compositor.

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ehVertical, type CorVisual, type Veiculo, type VisualCena, type VisualGrafico } from '@/lib/visual/especificacao';
import { exprParaLatex, numeroLatex, tentarCompilar } from '@/lib/visual/expressao';
import { faixaDaCena, marcas } from '@/lib/visual/geometria';
import { Grafico, Latex, corDe } from './grafico';
import { Controles, Deslizante, useRelogio } from './relogio';

const ALTURA_PISTA = 220;
const MOVIMENTO = 'transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)';
const CORES = ['a', 'b', 'c'] as const;

const EXTENSO: Record<string, string> = { min: 'minuto', h: 'hora', s: 'segundo' };
const NOME: Record<Veiculo, string> = { carro: 'carro', moto: 'moto', bola: 'bola', balao: 'balão', vela: 'vela' };
const numero = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

function frase(veiculo: Veiculo, unidade: string): string {
  if (veiculo === 'bola' || veiculo === 'balao') return `${veiculo === 'bola' ? 'a bola' : 'o balão'} está a esta altura:`;
  if (veiculo === 'vela') return 'a vela mede:';
  return `${veiculo === 'moto' ? 'a' : 'o'} ${NOME[veiculo]} está no ${unidade}`;
}

/* Desenhos de traço no estilo dos ícones do app. */
const TRACO = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Glifo({ veiculo }: { veiculo: Veiculo }) {
  if (veiculo === 'carro') {
    return (
      <svg viewBox="0 0 32 20" width={44} height={28} {...TRACO} aria-hidden>
        <path d="M2 15v-4l4-6h12l5 6h5a2 2 0 0 1 2 2v2" /><path d="M7 11h15" />
        <path d="M2 15h3M11 15h10M27 15h3" /><circle cx={8} cy={15} r={3} /><circle cx={24} cy={15} r={3} />
      </svg>
    );
  }
  if (veiculo === 'moto') {
    return (
      <svg viewBox="0 0 32 20" width={44} height={28} {...TRACO} aria-hidden>
        <circle cx={6} cy={15} r={4} /><circle cx={26} cy={15} r={4} />
        <path d="M6 15l6-6h8l2 6" /><path d="M10 9h6" /><path d="M21 4h3l2 11" />
      </svg>
    );
  }
  if (veiculo === 'bola') {
    return (
      <svg viewBox="0 0 24 24" width={30} height={30} {...TRACO} aria-hidden>
        <circle cx={12} cy={12} r={9} fill="currentColor" fillOpacity={0.25} /><path d="M3.5 9.5c5 2 12 2 17 0M3.5 14.5c5-2 12-2 17 0" />
      </svg>
    );
  }
  if (veiculo === 'balao') {
    return (
      <svg viewBox="0 0 24 32" width={28} height={38} {...TRACO} aria-hidden>
        <ellipse cx={12} cy={10} rx={8} ry={9} fill="currentColor" fillOpacity={0.25} /><path d="M12 19l-1.5 2h3zM12 21c-2 3 2 5 0 9" />
      </svg>
    );
  }
  return ( // chama da vela
    <svg viewBox="0 0 16 20" width={18} height={22} {...TRACO} aria-hidden>
      <path d="M8 2c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z" fill="currentColor" fillOpacity={0.35} />
    </svg>
  );
}

interface Posicao { veiculo: Veiculo; nome: string; cor: string; valor: number }

function PistaHorizontal({ posicoes, pct, faixa, unidade, reduzir }: {
  posicoes: Posicao[]; pct: (v: number) => number; faixa: [number, number]; unidade: string; reduzir: boolean;
}) {
  return (
    <div className="px-6">
      {posicoes.map((w) => (
        <div key={w.nome} className="relative h-10 border-b-2 border-dashed border-border">
          <div className="absolute inset-x-0 bottom-0" style={{ transform: `translateX(${pct(w.valor)}%)`, transition: reduzir ? 'none' : MOVIMENTO }}>
            <div className="w-fit -translate-x-1/2" style={{ color: w.cor }}><Glifo veiculo={w.veiculo} /></div>
          </div>
        </div>
      ))}
      <div className="relative h-5 type-micro text-muted-foreground" aria-hidden>
        {marcas(faixa, 6).map((v) => (
          <span key={v} data-numeric className="absolute top-1 -translate-x-1/2" style={{ left: `${pct(v)}%` }}>{v}</span>
        ))}
        <span className="absolute top-1 -right-6">{unidade}</span>
      </div>
    </div>
  );
}

function PistaVertical({ posicoes, pct, faixa, unidade, reduzir }: {
  posicoes: Posicao[]; pct: (v: number) => number; faixa: [number, number]; unidade: string; reduzir: boolean;
}) {
  const transicao = reduzir ? 'none' : MOVIMENTO;
  const chao = pct(0);
  return (
    <div className="flex justify-center gap-10 pt-12 pb-4" aria-hidden>
      <div className="relative w-8 type-micro text-muted-foreground" style={{ height: ALTURA_PISTA }}>
        {marcas(faixa, 6).map((v) => (
          <span key={v} data-numeric className="absolute right-0 translate-y-1/2" style={{ bottom: `${pct(v)}%` }}>{v}</span>
        ))}
        <span className="absolute right-0 -top-5">{unidade}</span>
      </div>
      {posicoes.map((w) => (
        <div key={w.nome} className="relative w-16 border-l border-dashed border-border" style={{ height: ALTURA_PISTA }}>
          <div className="absolute inset-x-0 border-t-2 border-border" style={{ bottom: `${chao}%` }} />
          {w.veiculo === 'vela' && (
            <div
              className="absolute left-1/2 w-5 -translate-x-1/2 rounded-t-sm"
              style={{
                bottom: `${chao}%`, height: `${100 - chao}%`, transformOrigin: 'bottom',
                transform: `scaleY(${Math.max(0, (pct(w.valor) - chao) / (100 - chao))})`,
                transition: transicao, background: w.cor, opacity: 0.55,
              }}
            />
          )}
          <div className="absolute inset-0" style={{ transform: `translateY(${100 - pct(w.valor)}%)`, transition: transicao }}>
            {/* O objeto pousa no valor: a bola no chão fica em cima da linha, não enterrada. */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-full" style={{ color: w.cor }}>
              <Glifo veiculo={w.veiculo} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function pontosDoGrafico(v: VisualCena, t: number, fns: ((x: number) => number)[]): VisualGrafico['pontos'] {
  const instantes = v.rastro ? Array.from({ length: t - v.x[0] + 1 }, (_, i) => v.x[0] + i) : [t];
  return v.veiculos.flatMap((w, i) => instantes.map((x) => ({ x, y: fns[i](x), cor: w.cor ?? CORES[i % 3] as CorVisual })));
}

export function Cena({ v }: { v: VisualCena }) {
  const reduzir = useReducedMotion() ?? false;
  const relogio = useRelogio(v.x);
  const { t, terminou } = relogio;
  const fns = useMemo(() => v.veiculos.map((w) => tentarCompilar(w.expr) ?? (() => NaN)), [v]);
  const faixa = useMemo(() => faixaDaCena(fns, v.x), [fns, v.x]);

  const pct = (valor: number) => Math.max(0, Math.min(100, ((valor - faixa[0]) / (faixa[1] - faixa[0])) * 100));
  const posicoes: Posicao[] = v.veiculos.map((w, i) => ({ veiculo: w.veiculo, nome: w.nome, cor: corDe(w.cor, i), valor: fns[i](t) }));
  const juntos = posicoes.length === 2 && Math.abs(posicoes[0].valor - posicoes[1].valor) < 1e-9;
  const vertical = ehVertical(v.veiculos[0].veiculo);
  const ux = v.unidadeX ?? 'min';
  const uy = v.unidadeY ?? 'km';
  const grafico: VisualGrafico = {
    tipo: 'grafico',
    x: v.x,
    y: faixa,
    funcoes: v.rastro && !terminou ? [] : v.veiculos.map((w) => ({ expr: w.expr, rotulo: `${w.nome}(x)`, cor: w.cor })),
    pontos: pontosDoGrafico(v, t, fns),
  };
  const Pista = vertical ? PistaVertical : PistaHorizontal;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-6 gap-y-1 type-body">
        {v.veiculos.map((w, i) => (
          <span key={w.nome} className="inline-flex items-baseline gap-2">
            <strong style={{ color: posicoes[i].cor }}>{w.rotulo ?? NOME[w.veiculo]}</strong>
            <Latex fonte={`${w.nome}(x) = ${exprParaLatex(w.expr)}`} />
          </span>
        ))}
      </div>

      <Deslizante relogio={relogio} rotulo={<>Relógio <span data-numeric className="font-semibold text-foreground">x = {numero(t)} {ux}</span></>} />
      <Pista posicoes={posicoes} pct={pct} faixa={faixa} unidade={uy} reduzir={reduzir} />

      <div className="space-y-1 type-body" aria-live="polite">
        {posicoes.map((w) => (
          <p key={w.nome}>
            <Latex fonte={`${w.nome}(${numeroLatex(t)}) = ${numeroLatex(w.valor)}`} />
            <span className="text-muted-foreground"> → {frase(w.veiculo, uy)} </span>
            <strong data-numeric style={{ color: w.cor }}>{numero(w.valor)}{vertical ? ` ${uy}` : ''}</strong>
          </p>
        ))}
        {juntos && <p className="font-semibold">Mesmo lugar: aqui os dois se encontram.</p>}
      </div>

      <Controles relogio={relogio} passo={`Mais 1 ${ux}`} />
      <div>
        <p className="type-meta text-muted-foreground mb-1">
          {v.rastro && !terminou
            ? `Cada ${EXTENSO[ux] ?? ux} que passa deixa um ponto (${ux}, ${uy}) no gráfico. Ande até o fim para ver a linha inteira.`
            : `O mesmo movimento como gráfico: cada ponto é (${ux}, ${uy}). A bolinha anda junto com o relógio.`}
        </p>
        <Grafico v={grafico} />
      </div>
    </div>
  );
}
