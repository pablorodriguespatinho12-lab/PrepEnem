'use client';
import { motion } from 'framer-motion';
/* Transição entre páginas (21/10/2026, referência de fluidez: Nubank). O
   template remonta a cada troca de rota: a página nova sobe 8 px e aparece,
   em vez de trocar seca. Curta de propósito: transição longa entre telas
   parece lentidão. Sob "reduzir movimento" fica só o fade (MotionConfig). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
