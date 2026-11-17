'use client';
/* Peças comuns dos desenhos em vetor das aulas (diagramas.tsx e diagramas-parecidas.tsx):
   as cores do papel claro, o texto e o "anima só no clique" (Pablo tem "reduzir
   movimento" ligado no Windows: o desenho fica completo em repouso e só se mexe quando
   ele aperta o botão). */
import { useEffect, useState } from 'react';

export const PAPEL = '#f7f5ee';
export const TINTA = '#1f2a22';
export const CHAO = '#ead9b4';
export const LIMPO = '#9fd7c4';
export const SUJO = '#e86f8a';
export const ROBO = '#3d4a52';
export const CORTE = '#4f6bd8';
export const AGUA = '#8cc7e3';
export const SECO = '#e8c45a';
export const APAGADO = '#5b6b5e';

export type Props = { rotulos?: string[] };
export const r = (rotulos: string[] | undefined, i: number, padrao: string) => rotulos?.[i] || padrao;
export const Texto = ({ x, y, children, ancora = 'middle', cor = TINTA, tam = 15 }: { x: number; y: number; children: string; ancora?: 'start' | 'middle' | 'end'; cor?: string; tam?: number }) => (
  <text x={x} y={y} textAnchor={ancora} fontSize={tam} fontWeight={700} fill={cor} style={{ fontFamily: 'var(--font-sans, system-ui)' }}>{children}</text>
);

/** Fração de 0 a 1 que anda no clique e fica em 1 em repouso. */
export function useAoClicar(duracaoMs: number): [number, () => void, boolean] {
  const [fracao, setFracao] = useState(1);
  const [rodando, setRodando] = useState(false);
  useEffect(() => {
    if (!rodando) return;
    const inicio = performance.now();
    let quadro = 0;
    const passo = (t: number) => {
      const f = Math.min(1, (t - inicio) / duracaoMs);
      setFracao(f);
      if (f < 1) quadro = requestAnimationFrame(passo); else setRodando(false);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [rodando, duracaoMs]);
  return [fracao, () => { setFracao(0); setRodando(true); }, rodando];
}

export function BotaoVer({ children, onClick, rodando }: { children: string; onClick: () => void; rodando: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={rodando}
      className="rounded-[var(--radius-control)] bg-primary px-4 py-2 type-meta font-semibold text-primary-foreground disabled:opacity-50">
      {children}
    </button>
  );
}
