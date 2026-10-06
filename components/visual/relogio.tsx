'use client';
// Relógio das animações (cena e roda): um passo inteiro por vez, devagar o
// bastante para acompanhar o número mudar. Os botões e o deslizante são os
// mesmos nos dois desenhos.

import { useEffect, useId, useState, type ReactNode } from 'react';
import { Play, RotateCcw, StepForward } from 'lucide-react';

const PASSO_MS = 900;

export interface Relogio {
  t: number;
  andando: boolean;
  terminou: boolean;
  inicio: number;
  fim: number;
  ir: (t: number) => void;
  tocar: () => void;
  avancar: () => void;
  recomecar: () => void;
}

export function useRelogio([inicio, fim]: [number, number], passoMs = PASSO_MS): Relogio {
  const [t, setT] = useState(inicio);
  const [andando, setAndando] = useState(false);

  useEffect(() => {
    if (!andando) return;
    if (t >= fim) { setAndando(false); return; }
    const id = setTimeout(() => setT((atual) => Math.min(atual + 1, fim)), passoMs);
    return () => clearTimeout(id);
  }, [andando, t, fim, passoMs]);

  return {
    t, andando, inicio, fim,
    terminou: t >= fim,
    ir: (novo) => { setAndando(false); setT(novo); },
    tocar: () => { if (t >= fim) setT(inicio); setAndando(true); },
    avancar: () => { setAndando(false); setT((a) => Math.min(a + 1, fim)); },
    recomecar: () => { setAndando(false); setT(inicio); },
  };
}

export function Deslizante({ relogio, rotulo }: { relogio: Relogio; rotulo: ReactNode }) {
  const id = useId();
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="type-meta text-muted-foreground whitespace-nowrap">{rotulo}</label>
      <input
        id={id} type="range" min={relogio.inicio} max={relogio.fim} step={1} value={relogio.t}
        onChange={(e) => relogio.ir(Number(e.target.value))}
        className="flex-1 accent-[hsl(var(--primary))]"
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
      <button type="button" onClick={relogio.avancar} disabled={relogio.terminou} className={`${BOTAO} bg-muted hover:bg-muted/80`}>
        <StepForward className="w-4 h-4" /> {passo}
      </button>
      <button type="button" onClick={relogio.recomecar} disabled={relogio.t === relogio.inicio} className={`${BOTAO} bg-muted hover:bg-muted/80`}>
        <RotateCcw className="w-4 h-4" /> Recomeçar
      </button>
    </div>
  );
}
