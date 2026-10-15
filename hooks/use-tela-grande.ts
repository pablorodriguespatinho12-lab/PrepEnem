'use client';
import { useSyncExternalStore } from 'react';

/* Mesma largura do `lg` do Tailwind: é onde o treino vira duas colunas. */
const CONSULTA = '(min-width: 1024px)';

function assinar(avisar: () => void): () => void {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}

export function useTelaGrande(): boolean {
  return useSyncExternalStore(assinar, () => window.matchMedia(CONSULTA).matches, () => false);
}
