'use client';
// A fórmula da questão com o que cada pedaço quer dizer embaixo (Pablo,
// 22/10/2026, artefato dos peixes: "p quantos peixes, d o dia"). Cada pedaço
// entra um depois do outro, primeiro o símbolo, depois o rótulo.

import { motion, useReducedMotion } from 'framer-motion';
import type { VisualLegenda } from '@/lib/visual/especificacao';
import { Latex, corDe } from './grafico';

const ATRASO_POR_PARTE = 0.22;

export function Legenda({ v }: { v: VisualLegenda }) {
  const reduzir = useReducedMotion() ?? false;
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-5 py-4" role="img" aria-label={v.partes.map((p) => `${p.texto}: ${p.rotulo}`).join('; ')}>
      {v.partes.map((p, i) => (
        <motion.div
          key={i}
          className="grid justify-items-center gap-1.5 text-center"
          initial={reduzir ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * ATRASO_POR_PARTE, duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="font-reading text-[clamp(1.4rem,1rem+1.6vw,2.2rem)] leading-tight" style={p.cor ? { color: corDe(p.cor) } : undefined}>
            <Latex fonte={p.texto} />
          </span>
          <span className="type-caption normal-case tracking-normal text-muted-foreground max-w-[9rem] leading-snug">{p.rotulo}</span>
        </motion.div>
      ))}
    </div>
  );
}
