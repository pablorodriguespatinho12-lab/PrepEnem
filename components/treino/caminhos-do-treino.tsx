'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardList, Plus, RotateCcw } from 'lucide-react';

/* Um lugar só para escolher COMO treinar (passeio do iniciante, Pablo,
   02/11/2026, opção B): eram 6 portas espalhadas (Treino, Simulado, Caderno
   de Erros...) e o iniciante não sabia qual abrir. A primeira é a principal;
   as outras duas dizem em uma linha quando usar. */
const CAMINHOS = [
  {
    href: '/provas/criar',
    titulo: 'Nova prova',
    quando: 'Você escolhe matérias, nível e quantas questões. Pode ter flashcards antes.',
    Icone: Plus,
    principal: true,
  },
  {
    href: '/simulado',
    titulo: 'Prova rápida ou simulado',
    quando: 'Cansado? 10 questões prontas, sem escolher nada. Ou o simulado da semana, com tempo.',
    Icone: ClipboardList,
    principal: false,
  },
  {
    href: '/caderno-erros',
    titulo: 'Refazer meus erros',
    quando: 'As questões que você errou, até acertar.',
    Icone: RotateCcw,
    principal: false,
  },
] as const;

export function CaminhosDoTreino() {
  return (
    <nav aria-label="Jeitos de treinar" className="grid gap-3 md:grid-cols-3 mb-10">
      {CAMINHOS.map(({ href, titulo, quando, Icone, principal }, i) => (
        <motion.div
          key={href}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={href}
            className={
              'group flex h-full flex-col gap-2 p-5 rounded-[var(--radius-surface)] t-lift hover:-translate-y-px ' +
              (principal
                ? 'bg-primary text-primary-foreground shadow-elev-2 hover:shadow-elev-3'
                : 'surface-1 text-foreground hover:shadow-elev-2')
            }
          >
            <span className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-display type-lead font-semibold">
                <Icone className="w-5 h-5 shrink-0" aria-hidden /> {titulo}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </span>
            <span className={'type-meta ' + (principal ? 'opacity-90' : 'text-muted-foreground')}>{quando}</span>
          </Link>
        </motion.div>
      ))}
    </nav>
  );
}
