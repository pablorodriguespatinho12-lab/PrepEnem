'use client';
import { useState } from 'react';

/* Mapa das questões no topo da prova (quadro de 26/11/2026). Só abre as já
   respondidas e a atual: o servidor grava uma depois da outra. */
export function MapaQuestoes({ respondidas, atual, vendo, marcadas, onAbrir }: {
  respondidas: boolean[];
  atual: number;
  vendo: number;
  marcadas: boolean[];
  onAbrir: (i: number) => void;
}) {
  // No celular o mapa começa fechado, atrás do "4 de 12".
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <button
        type="button"
        data-numeric
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
        className="md:hidden min-h-11 px-4 mb-3 rounded-[var(--radius-control)] bg-muted type-meta font-semibold text-foreground"
      >
        {vendo + 1} de {respondidas.length}
      </button>
      <nav aria-label="Mapa das questões" className={`${aberto ? 'flex' : 'hidden'} md:flex flex-wrap gap-1.5`}>
        {respondidas.map((feita, i) => {
          const liberada = feita || i === atual;
          const cor = i === vendo
            ? 'bg-primary text-primary-foreground'
            : feita ? 'bg-muted text-foreground' : 'border border-border text-muted-foreground';
          return (
            <button
              key={i}
              type="button"
              disabled={!liberada}
              aria-current={i === vendo ? 'step' : undefined}
              aria-label={`Questão ${i + 1}${marcadas[i] ? ', marcada para revisar' : ''}`}
              onClick={() => { setAberto(false); onAbrir(i); }}
              className={`w-11 h-11 font-display type-lead ${cor} ${marcadas[i] ? 'border-t-4 !border-t-[hsl(var(--chart-5))]' : ''}`}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>
    </>
  );
}
