'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';
import { materiaColors } from '@/lib/theme-colors';

// Prova rápida (Pablo, 21/10/2026, dia de cabeça cansada): flashcards primeiro,
// depois poucas questões médias de cada matéria. Fica no Simulado, não é tela nova.
export const MISTURA_PROVA_RAPIDA = [
  { materia: 'Português', quantidade: 3 },
  { materia: 'Matemática', quantidade: 3 },
  { materia: 'Biologia', quantidade: 3 },
  { materia: 'Química', quantidade: 1 },
];
const MATERIAS_DOS_CARTOES = new Set(MISTURA_PROVA_RAPIDA.map((m) => m.materia));
const DECK_DO_DIA = 'dia';
const CHAVE_MINIMIZADO = 'prova-rapida-minimizada';

type Deck = { id: string; nome: string; materia: string; restantes: number };

type Props = {
  carregando: boolean;
  onComecar: (deckId: string | null) => void;
};

function lerMinimizado(): boolean {
  try { return localStorage.getItem(CHAVE_MINIMIZADO) === '1'; } catch { return false; }
}

export function PainelProvaRapida({ carregando, onComecar }: Props) {
  const [aberto, setAberto] = useState(true);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckId, setDeckId] = useState<string | null>(DECK_DO_DIA);
  const [materiaAberta, setMateriaAberta] = useState<string | null>(null);

  useEffect(() => { setAberto(!lerMinimizado()); }, []);

  useEffect(() => {
    if (!aberto || decks.length > 0) return;
    fetch('/api/flashcards/decks')
      .then((r) => (r.ok ? r.json() : { decks: [] }))
      .then((data) => setDecks((data.decks ?? []).filter((d: Deck) => MATERIAS_DOS_CARTOES.has(d.materia) && d.restantes > 0)))
      .catch((e) => console.error('Erro ao listar decks:', e));
  }, [aberto, decks.length]);

  const alternar = () => {
    const novo = !aberto;
    setAberto(novo);
    try { localStorage.setItem(CHAVE_MINIMIZADO, novo ? '0' : '1'); } catch { /* sem armazenamento: só não lembra */ }
  };

  // Primeiro nível curto (do dia, matérias, nenhum); os baralhos aparecem
  // só da matéria tocada, para a lista não virar um paredão no celular.
  const materiasComDeck = MISTURA_PROVA_RAPIDA.map((m) => m.materia).filter((m) => decks.some((d) => d.materia === m));
  const decksDaMateria = decks.filter((d) => d.materia === materiaAberta);
  const escolherMateria = (m: string) => {
    setMateriaAberta(m);
    setDeckId(decks.find((d) => d.materia === m)?.id ?? null);
  };
  const escolherFixo = (id: string | null) => {
    setMateriaAberta(null);
    setDeckId(id);
  };
  const chip = (ativo: boolean) =>
    `inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] type-meta font-medium t-colors ${
      ativo ? 'bg-primary text-primary-foreground shadow-elev-1' : 'bg-muted hover:bg-muted/80'
    }`;
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
            <span className="block type-meta text-muted-foreground">Flashcards, depois 10 questões médias</span>
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
              <div>
                <p className="type-meta font-medium mb-2">1. Escolha os flashcards</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => escolherFixo(DECK_DO_DIA)} aria-pressed={deckId === DECK_DO_DIA} className={chip(deckId === DECK_DO_DIA)}>
                    Os do dia
                  </button>
                  {materiasComDeck.map((m) => (
                    <button key={m} onClick={() => escolherMateria(m)} aria-pressed={materiaAberta === m} className={chip(materiaAberta === m)}>
                      <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)]" style={{ backgroundColor: materiaColors[m] }} />
                      {m}
                    </button>
                  ))}
                  <button onClick={() => escolherFixo(null)} aria-pressed={deckId === null && !materiaAberta} className={chip(deckId === null && !materiaAberta)}>
                    Sem flashcards
                  </button>
                </div>
                {decksDaMateria.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {decksDaMateria.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDeckId(d.id)}
                        aria-pressed={deckId === d.id}
                        className={`px-3 py-2 rounded-[var(--radius-control)] type-caption normal-case tracking-normal t-colors border ${
                          deckId === d.id ? 'border-primary text-foreground bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {d.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="type-meta font-medium mb-2">2. Depois, as questões</p>
                <p className="type-meta text-muted-foreground">
                  {MISTURA_PROVA_RAPIDA.map((m) => `${m.materia} ${m.quantidade}`).join(' · ')}
                </p>
              </div>

              <button
                onClick={() => onComecar(deckId)}
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
