'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Pausa curta antes de cada parte da prova rápida (Pablo, 21/10/2026): 3, 2, 1, vai.
const PASSOS = [3, 2, 1];
const MS_POR_PASSO = 800;

type Props = {
  titulo: string;
  onFim: () => void;
};

export function ContagemRegressiva({ titulo, onFim }: Props) {
  const [passo, setPasso] = useState(0);
  const reduzir = useReducedMotion();

  useEffect(() => {
    if (passo >= PASSOS.length) {
      onFim();
      return;
    }
    const id = setTimeout(() => setPasso((p) => p + 1), MS_POR_PASSO);
    return () => clearTimeout(id);
  }, [passo, onFim]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4" role="status" aria-live="polite">
      <p className="type-lead text-muted-foreground">{titulo}</p>
      <div className="h-40 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {passo < PASSOS.length && (
            <motion.span
              key={passo}
              data-numeric
              initial={reduzir ? { opacity: 0 } : { opacity: 0, scale: 1.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduzir ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-display font-bold text-primary leading-none"
              style={{ fontSize: 'clamp(6rem, 20vw, 10rem)' }}
            >
              {PASSOS[passo]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <button onClick={onFim} className="type-meta text-muted-foreground underline underline-offset-4 hover:text-foreground t-colors">
        Pular
      </button>
    </div>
  );
}
