import type { KeyboardEvent } from 'react';
/* Cartão clicável que é div (tem bloco dentro): Enter e Espaço abrem, como num
   botão. Sem isso só o mouse abria (Flashcards, Upload e Vestibular, 21/10/2026).
   Vai junto com role="button" e tabIndex={0}. */
export function abrirComTeclado(e: KeyboardEvent, abrir: () => void): void {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  abrir();
}
