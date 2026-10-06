'use client';
// Relógio das animações (cena, roda, retângulo, fatias). Corre CONTÍNUO: o
// objeto desliza e o gráfico se desenha como caneta no papel. Antes andava em
// passos inteiros de 900 ms e o carro teleportava de um ponto ao outro (Pablo,
// 06/10/2026: "sprite por sprite, tem que ser fluido"). As fatias, que só
// existem em número inteiro, pedem `continuo: false`.

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { animate, type AnimationPlaybackControls } from 'framer-motion';
import { Play, RotateCcw, StepForward } from 'lucide-react';

const SEGUNDOS_POR_UNIDADE = 0.9;

export interface Relogio {
  t: number;
  andando: boolean;
  terminou: boolean;
  inicio: number;
  fim: number;
  continuo: boolean;
  ir: (t: number) => void;
  tocar: () => void;
  avancar: () => void;
  recomecar: () => void;
}

export function useRelogio(
  [inicio, fim]: [number, number],
  { continuo = true, segundosPorUnidade = SEGUNDOS_POR_UNIDADE }: { continuo?: boolean; segundosPorUnidade?: number } = {},
): Relogio {
  const [t, setT] = useState(inicio);
  const [andando, setAndando] = useState(false);
  const animacao = useRef<AnimationPlaybackControls | null>(null);
  const tAtual = useRef(inicio);
  tAtual.current = t;

  useEffect(() => () => animacao.current?.stop(), []);

  const parar = () => { animacao.current?.stop(); animacao.current = null; setAndando(false); };

  const correr = (de: number, ate: number) => {
    animacao.current?.stop();
    if (ate <= de) return;
    setAndando(true);
    const passo = (v: number) => setT(continuo ? v : Math.floor(v));
    animacao.current = animate(de, ate, {
      duration: (ate - de) * segundosPorUnidade,
      ease: 'linear',
      onUpdate: passo,
      onComplete: () => { setT(ate); animacao.current = null; setAndando(false); },
    });
  };

  return {
    t, andando, inicio, fim, continuo,
    terminou: t >= fim,
    ir: (novo) => { parar(); setT(novo); },
    tocar: () => correr(tAtual.current >= fim ? inicio : tAtual.current, fim),
    avancar: () => correr(tAtual.current, Math.min(Math.floor(tAtual.current + 1e-9) + 1, fim)),
    recomecar: () => { parar(); setT(inicio); },
  };
}

export function Deslizante({ relogio, rotulo }: { relogio: Relogio; rotulo: ReactNode }) {
  const id = useId();
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="type-meta text-muted-foreground whitespace-nowrap">{rotulo}</label>
      <input
        id={id} type="range" min={relogio.inicio} max={relogio.fim} step={relogio.continuo ? 0.01 : 1} value={relogio.t}
        onChange={(e) => relogio.ir(Number(e.target.value))}
        className="deslizante flex-1"
        style={{ ['--progresso' as string]: `${((relogio.t - relogio.inicio) / (relogio.fim - relogio.inicio || 1)) * 100}%` }}
      />
    </div>
  );
}

const BOTAO = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-control)] type-meta font-medium t-colors disabled:opacity-40';

export function Controles({ relogio, tocar = 'Ver andando', passo }: { relogio: Relogio; tocar?: string; passo: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={relogio.tocar} disabled={relogio.andando} className={`${BOTAO} bg-primary text-primary-foreground hover:opacity-90`}>
        <Play className="w-4 h-4" /> {tocar}
      </button>
      <button type="button" onClick={relogio.avancar} disabled={relogio.terminou || relogio.andando} className={`${BOTAO} bg-muted hover:bg-muted/80`}>
        <StepForward className="w-4 h-4" /> {passo}
      </button>
      <button type="button" onClick={relogio.recomecar} disabled={relogio.t === relogio.inicio && !relogio.andando} className={`${BOTAO} bg-muted hover:bg-muted/80`}>
        <RotateCcw className="w-4 h-4" /> Recomeçar
      </button>
    </div>
  );
}
