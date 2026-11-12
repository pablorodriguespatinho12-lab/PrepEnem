'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { materiaColors } from '@/lib/theme-colors';

// Aquecimento antes da prova: poucos cartões, virar e responder, e segue
// para as questões. Mesmo flip do baralho (app/flashcards/[deckId]/page.tsx).
// Desde 22/10/2026 mora em Provas, com a quantidade escolhida ao criar a prova.
type Cartao = { id: string; frente: string; verso: string; materia?: string };

type Props = {
  deckId: string;
  quantidade: number;
  onFim: () => void;
};

export function AquecimentoFlashcards({ deckId, quantidade, onFim }: Props) {
  const [cartoes, setCartoes] = useState<Cartao[] | null>(null);
  const [materiaDoDeck, setMateriaDoDeck] = useState('');
  const [idx, setIdx] = useState(0);
  const [virado, setVirado] = useState(false);
  const [acertos, setAcertos] = useState(0);

  useEffect(() => {
    const controle = new AbortController();
    fetch(`/api/flashcards/decks/${deckId}`, { signal: controle.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('deck'))))
      .then((data) => {
        setMateriaDoDeck(data.deck?.materia ?? '');
        setCartoes((data.cards ?? []).slice(0, quantidade));
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setCartoes([]);
      });
    return () => controle.abort();
  }, [deckId, quantidade]);

  const responder = (acertou: boolean) => {
    const cartao = cartoes?.[idx];
    if (!cartao) return;
    fetch('/api/flashcards/progresso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: cartao.id, acertou }),
    }).catch((e) => console.error('Erro ao salvar cartão:', e));
    if (acertou) setAcertos((a) => a + 1);
    setVirado(false);
    setIdx((i) => i + 1);
  };

  // Espaço vira, 1 = errei, 2 = acertei (igual ao baralho).
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setVirado((v) => !v); }
      if (virado && e.key === '1') responder(false);
      if (virado && e.key === '2') responder(true);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  });

  if (cartoes === null) {
    return <p className="p-8 text-center type-meta text-muted-foreground">Separando os cartões...</p>;
  }

  if (cartoes.length === 0 || idx >= cartoes.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="font-display type-headline font-bold">
          {cartoes.length === 0 ? 'Esse baralho não tem cartão para hoje' : 'Cartões feitos'}
        </h2>
        {cartoes.length > 0 && (
          <p className="type-body text-muted-foreground">
            <span data-numeric>{acertos}</span> de <span data-numeric>{cartoes.length}</span> certos.
          </p>
        )}
        <button
          onClick={onFim}
          className="mt-2 px-8 py-4 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-display font-bold type-lead shadow-elev-2 hover:opacity-90 transition-opacity"
        >
          Agora as questões
        </button>
      </div>
    );
  }

  const cartao = cartoes[idx];
  const cor = materiaColors[cartao.materia ?? materiaDoDeck] ?? 'hsl(var(--primary))';

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="type-meta text-muted-foreground">Flashcards</p>
        <p className="type-meta text-muted-foreground">
          <span data-numeric>{idx + 1}</span> / <span data-numeric>{cartoes.length}</span>
        </p>
      </div>

      <div
        className="relative w-full mb-6 cursor-pointer select-none"
        style={{ perspective: '1500px', minHeight: '320px' }}
        onClick={() => setVirado((v) => !v)}
        role="button"
        tabIndex={0}
        aria-pressed={virado}
        aria-label={virado ? 'Virar para a pergunta' : 'Virar para ver a resposta'}
      >
        {/* Flip em CSS (.cartao-flip), igual ao dos flashcards: roda no compositor (12/11/2026). */}
        <div
          key={cartao.id}
          style={{ transform: `rotateY(${virado ? 180 : 0}deg)`, minHeight: '320px' }}
          className="cartao-flip relative w-full"
        >
          <div
            className="absolute inset-0 rounded-[var(--radius-container)] surface-2 flex items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 type-caption text-muted-foreground">
              <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)]" style={{ backgroundColor: cor }} />
              Pergunta
            </span>
            <p className="font-reading type-title measure-reading text-center">{cartao.frente}</p>
            <span className="absolute bottom-4 inset-x-0 text-center type-meta text-muted-foreground">Toque para ver a resposta</span>
          </div>
          <div
            className="absolute inset-0 rounded-[var(--radius-container)] surface-1 flex items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 type-caption text-muted-foreground">
              <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)]" style={{ backgroundColor: cor }} />
              Resposta
            </span>
            <p className="font-reading type-lead measure-reading text-center font-medium">{cartao.verso}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {virado && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              onClick={() => responder(false)}
              style={{ backgroundColor: 'hsl(var(--danger))', color: 'hsl(var(--surface-1))' }}
              className="flex items-center justify-center gap-2 py-4 rounded-[var(--radius-control)] font-semibold type-body t-lift hover:shadow-elev-3"
            >
              <XCircle className="w-5 h-5" /> Errei
            </button>
            <button
              onClick={() => responder(true)}
              style={{ backgroundColor: 'hsl(var(--success))', color: 'hsl(var(--surface-1))' }}
              className="flex items-center justify-center gap-2 py-4 rounded-[var(--radius-control)] font-semibold type-body t-lift hover:shadow-elev-3"
            >
              <CheckCircle2 className="w-5 h-5" /> Acertei
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onFim}
        className="mt-6 mx-auto block type-meta text-muted-foreground underline underline-offset-4 hover:text-foreground t-colors"
      >
        Pular para as questões
      </button>
    </div>
  );
}
