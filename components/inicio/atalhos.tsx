'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Layers, PenTool, Sigma } from 'lucide-react';

// Mesmos ícones do menu lateral: o atalho é o mesmo lugar, não outro.
const ATALHOS = [
  { href: '/treino', rotulo: 'Treino', Icone: BookOpen },
  { href: '/flashcards', rotulo: 'Flashcards', Icone: Layers },
  { href: '/redacao', rotulo: 'Redação', Icone: PenTool },
  { href: '/calculo', rotulo: 'Cálculo', Icone: Sigma },
] as const;

const ENTRADA = [0.16, 1, 0.3, 1] as const;

/* Fileira de atalhos redondos, como os do app do Nubank (Pablo escolheu a
   opção B em 21/10/2026: https://claude.ai/artifact/Wy2USfyj6hiYfSKA4dKdfs). */
export function Atalhos() {
  return (
    <nav aria-label="Atalhos" className="flex justify-between">
      {ATALHOS.map(({ href, rotulo, Icone }, i) => (
        <motion.div
          key={href}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: ENTRADA }}
        >
          <Link href={href} className="group flex flex-col items-center gap-2 py-1 type-meta font-medium text-foreground w-[60px]">
            <span className="h-[60px] w-[60px] grid place-items-center rounded-full bg-primary/10 text-primary-text transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-primary/15 group-active:scale-95">
              <Icone className="h-6 w-6" strokeWidth={1.8} />
            </span>
            {rotulo}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
}
