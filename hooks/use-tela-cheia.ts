'use client';
import { useCallback, useEffect, useState } from 'react';

/* Tela cheia para estudar no mundo pixel (Pablo, 12/11/2026). Esconde o menu
   (html[data-imersivo], CSS em globals.css) e pede tela cheia ao navegador.
   Se o navegador recusar, o menu some do mesmo jeito. Esc sai dos dois. */
export function useTelaCheia() {
  const [ativa, setAtiva] = useState(false);

  useEffect(() => {
    const raiz = document.documentElement;
    if (ativa) raiz.setAttribute('data-imersivo', '');
    else raiz.removeAttribute('data-imersivo');
  }, [ativa]);

  useEffect(() => {
    const aoMudar = () => {
      if (!document.fullscreenElement) setAtiva(false);
    };
    document.addEventListener('fullscreenchange', aoMudar);
    return () => {
      document.removeEventListener('fullscreenchange', aoMudar);
      document.documentElement.removeAttribute('data-imersivo');
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  const alternar = useCallback(() => {
    if (ativa) {
      setAtiva(false);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      return;
    }
    setAtiva(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, [ativa]);

  return { ativa, alternar };
}
