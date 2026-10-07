'use client';
// Palavra em destaque (Português): a palavra grande, letra por letra, as
// sílabas separadas por um ponto, a parte que importa circulada à mão e uma
// nota pequena embaixo (Pablo, 07/10/2026: "baú, o círculo no u, e embaixo
// é acentuado por causa do hiato").

import { motion, useReducedMotion } from 'framer-motion';
import type { VisualPalavra } from '@/lib/visual/especificacao';

const MS_LETRA = 0.09;

interface Pedaco { texto: string; destaque: boolean }

/* Corta a palavra (ou cada sílaba) em volta do destaque, na primeira vez que ele aparece. */
function pedacos(v: VisualPalavra): Pedaco[][] {
  const grupos = v.silabas ?? [v.palavra];
  if (!v.destaque) return grupos.map((g) => [{ texto: g, destaque: false }]);
  const inicio = v.palavra.indexOf(v.destaque);
  const fim = inicio + v.destaque.length;
  let pos = 0;
  return grupos.map((g) => {
    const partes: Pedaco[] = Array.from(g).map((letra, i) => ({ texto: letra, destaque: pos + i >= inicio && pos + i < fim }));
    pos += g.length;
    // Junta letras vizinhas do mesmo tipo, para o círculo envolver o destaque inteiro.
    return partes.reduce<Pedaco[]>((acc, p) => {
      const ultimo = acc[acc.length - 1];
      return ultimo && ultimo.destaque === p.destaque
        ? [...acc.slice(0, -1), { ...ultimo, texto: ultimo.texto + p.texto }]
        : [...acc, p];
    }, []);
  });
}

export function Palavra({ v }: { v: VisualPalavra }) {
  const reduzir = useReducedMotion() ?? false;
  const grupos = pedacos(v);
  const total = Array.from(v.palavra).length;
  let indice = 0;
  const letra = (l: string, destaque: boolean) => {
    const atraso = indice++ * MS_LETRA;
    return (
      <motion.span key={indice} className={destaque ? 'text-primary-text' : undefined}
        initial={reduzir ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: atraso }}>
        {l}
      </motion.span>
    );
  };
  const circulo = total * MS_LETRA + 0.15;

  return (
    <div className="py-4 space-y-4 text-center">
      <p className="font-display font-bold leading-none text-5xl sm:text-6xl" aria-label={v.silabas ? v.silabas.join('-') : v.palavra}>
        {grupos.map((grupo, gi) => (
          <span key={gi}>
            {gi > 0 && <span aria-hidden className="text-muted-foreground font-normal mx-1.5">·</span>}
            {grupo.map((p, pi) => (p.destaque ? (
              <span key={pi} className="relative inline-block px-1">
                {Array.from(p.texto).map((l) => letra(l, true))}
                {/* O círculo desenhado à mão em volta do destaque. */}
                <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute -inset-x-2 -inset-y-1.5 w-[calc(100%+1rem)] h-[calc(100%+0.75rem)] overflow-visible">
                  <motion.ellipse cx={50} cy={52} rx={47} ry={44} fill="none" stroke="hsl(var(--primary))" strokeWidth={4} vectorEffect="non-scaling-stroke"
                    strokeLinecap="round" transform="rotate(-4 50 50)"
                    initial={reduzir ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: circulo, ease: 'easeInOut' }} />
                </svg>
              </span>
            ) : (
              <span key={pi}>{Array.from(p.texto).map((l) => letra(l, false))}</span>
            )))}
          </span>
        ))}
      </p>
      {v.nota && (
        <motion.p className="type-meta text-muted-foreground max-w-sm mx-auto"
          initial={reduzir ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: circulo + 0.6 }}>
          {v.nota}
        </motion.p>
      )}
    </div>
  );
}
