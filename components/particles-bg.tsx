'use client';
import React, { useEffect, useMemo, useRef } from 'react';

/* Partículas em CSS puro: cada ponto sobe com uma animação de `transform`,
   que roda no compositor. Antes era um canvas redesenhado 60 vezes por
   segundo na thread principal — disputava frame com as transições do treino
   e continuava redesenhando mesmo com reduced-motion.

   Camadas de parallax: quanto mais perto, maior, mais opaca e mais rápida.
   Animação que nunca para obriga o navegador a redesenhar a tela inteira a
   cada quadro, para sempre. Medido em 18/10/2026 (skill medir-fluidez): as
   partículas eram quase todo o custo de composição do dashboard (~450 ms em
   4 s; 2 ms sem elas). O número de pontos quase não muda isso; o que muda é
   a animação estar rodando. Por isso:
   - andam em passos de PASSOS_POR_SEGUNDO, não a 60 fps — o ponto mais rápido
     anda ~1,3 px por passo, o olho não vê o degrau;
   - pausam enquanto a página rola, que é quando o travado aparece. */
const PASSOS_POR_SEGUNDO = 20;
const PAUSA_APOS_ROLAR_MS = 200;
const emPassos = (segundos: number) => Math.round(segundos * PASSOS_POR_SEGUNDO) / PASSOS_POR_SEGUNDO;
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
        // Duração e atraso em múltiplos de um passo: assim as 34 partículas dão
        // o passo no MESMO instante e a tela só é redesenhada nesses instantes.
        // Desalinhadas, 34 × 20 passos/s davam quadro novo a cada 1/60 s.
        const duracao = emPassos(entre(c.duracao));
        return {
          left: `${(r() * 100).toFixed(2)}%`,
          tamanho: entre(c.tamanho),
          duracao,
          // Atraso negativo: cada ponto já começa no meio da subida.
          atraso: -emPassos(r() * duracao),
          deriva: (r() - 0.5) * 80,
          alfa: entre(c.alfa),
          passos: Math.round(duracao * PASSOS_POR_SEGUNDO),
        };
      }),
    );
  }, []);

  // Classe direto no DOM, sem estado do React: rolar não re-renderiza nada.
  const caixa = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let espera: ReturnType<typeof setTimeout> | undefined;
    const aoRolar = () => {
      caixa.current?.classList.add('rolando');
      clearTimeout(espera);
      espera = setTimeout(() => caixa.current?.classList.remove('rolando'), PAUSA_APOS_ROLAR_MS);
    };
    window.addEventListener('scroll', aoRolar, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', aoRolar, { capture: true });
      clearTimeout(espera);
    };
  }, []);

  return (
    <div ref={caixa} className="particulas fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {pontos.map((p, i) => (
        <span
          key={i}
          className="particula"
          style={{
            left: p.left,
            width: p.tamanho * 2,
            height: p.tamanho * 2,
            animationDelay: `${p.atraso.toFixed(2)}s`,
            ['--duracao' as string]: `${p.duracao.toFixed(2)}s`,
            ['--deriva' as string]: `${p.deriva.toFixed(0)}px`,
            ['--alfa' as string]: p.alfa.toFixed(3),
            ['--passos' as string]: p.passos,
          }}
        />
      ))}
    </div>
  );
}
