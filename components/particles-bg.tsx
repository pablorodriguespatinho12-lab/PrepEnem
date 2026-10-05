'use client';
import React, { useMemo } from 'react';

/* Partículas em CSS puro: cada ponto sobe com uma animação de `transform`,
   que roda no compositor. Antes era um canvas redesenhado 60 vezes por
   segundo na thread principal — disputava frame com as transições do treino
   e continuava redesenhando mesmo com reduced-motion.

   Camadas de parallax: quanto mais perto, maior, mais opaca e mais rápida. */
const CAMADAS = [
  { quantos: 14, tamanho: [0.6, 1.3], duracao: [70, 110], alfa: [0.05, 0.15] },
  { quantos: 12, tamanho: [1.3, 2.1], duracao: [45, 70], alfa: [0.08, 0.2] },
  { quantos: 8, tamanho: [2.1, 3.2], duracao: [28, 45], alfa: [0.12, 0.3] },
] as const;

/* Sorteio com semente fixa: servidor e cliente geram os mesmos pontos, sem
   diferença de hidratação. */
function sorteador(semente: number) {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function ParticlesBg() {
  const pontos = useMemo(() => {
    const r = sorteador(42);
    const entre = ([min, max]: readonly [number, number]) => min + r() * (max - min);
    return CAMADAS.flatMap((c) =>
      Array.from({ length: c.quantos }, () => {
        const duracao = entre(c.duracao);
        return {
          left: `${(r() * 100).toFixed(2)}%`,
          tamanho: entre(c.tamanho),
          duracao,
          // Atraso negativo: cada ponto já começa no meio da subida.
          atraso: -r() * duracao,
          deriva: (r() - 0.5) * 80,
          alfa: entre(c.alfa),
        };
      }),
    );
  }, []);

  return (
    <div className="particulas fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {pontos.map((p, i) => (
        <span
          key={i}
          className="particula"
          style={{
            left: p.left,
            width: p.tamanho * 2,
            height: p.tamanho * 2,
            animationDelay: `${p.atraso.toFixed(1)}s`,
            ['--duracao' as string]: `${p.duracao.toFixed(1)}s`,
            ['--deriva' as string]: `${p.deriva.toFixed(0)}px`,
            ['--alfa' as string]: p.alfa.toFixed(3),
          }}
        />
      ))}
    </div>
  );
}
