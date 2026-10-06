'use client';
// Liga o anel de foco só para quem navega pelo teclado: Tab põe a classe
// "usando-teclado" no <html>; qualquer clique ou toque tira. Quem usa mouse
// nunca vê o contorno azul (Pablo, 06/10/2026); quem usa teclado não se perde.

import { useEffect } from 'react';

export function FocoTeclado() {
  useEffect(() => {
    const raiz = document.documentElement;
    const teclado = (e: KeyboardEvent) => { if (e.key === 'Tab') raiz.classList.add('usando-teclado'); };
    const ponteiro = () => raiz.classList.remove('usando-teclado');
    window.addEventListener('keydown', teclado);
    window.addEventListener('pointerdown', ponteiro);
    return () => { window.removeEventListener('keydown', teclado); window.removeEventListener('pointerdown', ponteiro); };
  }, []);
  return null;
}
