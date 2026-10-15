'use client';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  deckId: string;
  capituloLido: number;
  proximoCapitulo: number;
  trancados: number;
  onMarcado: () => void;
};

/* Deck de livro: as frases de cada capítulo ficam trancadas (spoiler) até o
   capítulo ser marcado como lido. Um toque = mais um capítulo lido. */
export function CapituloLido({ deckId, capituloLido, proximoCapitulo, trancados, onMarcado }: Props) {
  const [salvando, setSalvando] = useState(false);
  const capitulo = capituloLido + 1;

  async function marcar() {
    setSalvando(true);
    try {
      const res = await fetch(`/api/flashcards/decks/${deckId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capituloLido: capitulo }),
      });
      if (!res.ok) throw new Error();
      if (capitulo >= proximoCapitulo) toast.success('Frase nova liberada');
      onMarcado();
    } catch {
      toast.error('Não deu para marcar o capítulo');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 type-meta text-muted-foreground">
      <span>
        <span data-numeric>{trancados}</span> {trancados === 1 ? 'frase trancada' : 'frases trancadas'} · a próxima no cap. <span data-numeric>{proximoCapitulo}</span>
      </span>
      <button
        onClick={marcar}
        disabled={salvando}
        className="min-h-11 px-3 py-2 rounded-[var(--radius-control)] font-medium bg-[hsl(var(--surface-2))] border border-border hover:bg-muted t-colors disabled:opacity-50"
      >
        Li o capítulo <span data-numeric>{capitulo}</span>
      </button>
    </div>
  );
}
