'use client';
// Passo 2: escolher 2 das 5 causas coringa (A e B). Tocar de novo desmarca.

import { CAUSAS, type ChaveCausa } from '@/lib/redacao/receita';
import { CabecalhoPasso } from './pecas';

export function PassoCausas({ causaA, causaB, aoMudar }: {
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  aoMudar: (a: ChaveCausa | null, b: ChaveCausa | null) => void;
}) {
  const tocar = (c: ChaveCausa) => {
    if (c === causaA) return aoMudar(causaB, null);
    if (c === causaB) return aoMudar(causaA, null);
    if (!causaA) return aoMudar(c, causaB);
    if (!causaB) return aoMudar(causaA, c);
    aoMudar(causaA, c);
  };
  return (
    <div>
      <CabecalhoPasso titulo="Causas" instrucao="Escolha 2. A primeira vira o D1, a segunda o D2." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {CAUSAS.map((c) => {
          const letra = c.chave === causaA ? 'A' : c.chave === causaB ? 'B' : null;
          return (
            <li key={c.chave}>
              <button
                type="button"
                onClick={() => tocar(c.chave)}
                aria-pressed={letra !== null}
                className="h-full w-full text-left rounded-[var(--radius-surface)] border p-4 t-colors hover:bg-muted"
                style={letra ? { borderColor: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.1)' } : undefined}
              >
                <span className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-display type-body font-semibold">{c.nome}</span>
                  {letra && (
                    <span className="type-meta font-semibold rounded-[var(--radius-data)] px-2 py-0.5" style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
                      Causa {letra}
                    </span>
                  )}
                </span>
                <span className="block font-reading type-meta mb-2">{c.fraseDeTese}</span>
                <span className="block type-meta text-muted-foreground">{c.repertorios.join(' · ')}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
