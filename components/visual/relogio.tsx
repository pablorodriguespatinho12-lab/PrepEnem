'use client';
// Relógio das animações (cena, roda, retângulo, fatias). Corre CONTÍNUO: o
// objeto desliza e o gráfico se desenha como caneta no papel. Antes andava em
// passos inteiros de 900 ms e o carro teleportava de um ponto ao outro (Pablo,
// 06/10/2026: "sprite por sprite, tem que ser fluido"). As fatias, que só
// existem em número inteiro, pedem `continuo: false`.

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion, type AnimationPlaybackControls } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

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

/* Toca sozinho quando o desenho aparece na tela, uma vez. Sem deslizante nem
   "Mais 1": o Pablo não usava e só enchia a tela (07/10/2026). Sob
   reduced-motion o desenho já nasce no fim, sem animar. */
export function useTocarAoVer(relogio: Relogio) {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.4 });
  const reduzir = useReducedMotion();
  const tocar = useRef(relogio.tocar);
  const ir = useRef(relogio.ir);
  tocar.current = relogio.tocar;
  ir.current = relogio.ir;
  useEffect(() => {
    if (!visto) return;
    if (reduzir) ir.current(relogio.fim);
    else tocar.current();
  }, [visto, reduzir, relogio.fim]);
  return ref;
}
const BOTAO = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-control)] type-meta font-medium t-colors disabled:opacity-40';
export function Controles({ relogio }: { relogio: Relogio }) {
  return (
    <button type="button" onClick={relogio.tocar} disabled={relogio.andando} className={`${BOTAO} bg-muted hover:bg-muted/80`}>
      <RotateCcw className="w-4 h-4" /> Ver de novo
    </button>
  );
}
