'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';

// Prova rápida (Pablo, 21/10/2026, dia de cabeça cansada): poucas questões
// médias de cada matéria. Fica no Simulado, não é tela nova. Os flashcards de
// antes foram para Provas, escolhidos ao criar a prova (22/10/2026).
export const MISTURA_PROVA_RAPIDA = [
  { materia: 'Português', quantidade: 3 },
  { materia: 'Matemática', quantidade: 3 },
  { materia: 'Biologia', quantidade: 3 },
  { materia: 'Química', quantidade: 1 },
];
const CHAVE_MINIMIZADO = 'prova-rapida-minimizada';

type Props = {
  carregando: boolean;
  onComecar: () => void;
};

function lerMinimizado(): boolean {
  try { return localStorage.getItem(CHAVE_MINIMIZADO) === '1'; } catch { return false; }
}

export function PainelProvaRapida({ carregando, onComecar }: Props) {
  const [aberto, setAberto] = useState(true);

  useEffect(() => { setAberto(!lerMinimizado()); }, []);

  const alternar = () => {
    const novo = !aberto;
    setAberto(novo);
    try { localStorage.setItem(CHAVE_MINIMIZADO, novo ? '0' : '1'); } catch { /* sem armazenamento: só não lembra */ }
  };

  return (
    <section className="surface-1 rounded-[var(--radius-surface)] mb-6 overflow-hidden" aria-labelledby="prova-rapida-titulo">
      <button
        onClick={alternar}
        aria-expanded={aberto}
        className="w-full flex items-center justify-between gap-3 p-5 md:p-6 text-left"
      >
        <span className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" aria-hidden />
          <span>
            <span id="prova-rapida-titulo" className="block font-display type-title font-bold">Prova rápida</span>
            <span className="block type-meta text-muted-foreground">10 questões médias, sem cronômetro</span>
          </span>
        </span>
        <motion.span animate={{ rotate: aberto ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="px-5 md:px-6 pb-6 space-y-5">
              <p className="type-meta text-muted-foreground">
                {MISTURA_PROVA_RAPIDA.map((m) => `${m.materia} ${m.quantidade}`).join(' · ')}
              </p>

              <button
                onClick={onComecar}
                disabled={carregando}
                className="w-full py-4 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-display font-bold type-lead shadow-elev-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {carregando ? 'Preparando...' : 'Começar'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
