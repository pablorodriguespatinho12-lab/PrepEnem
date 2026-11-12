'use client';
import { useCallback, useEffect, useState } from 'react';

/* Letras em pixel no site todo (Pablo, 12/11/2026: "tudo meio pixelado, até as
   letras e as palavras"). Ligado por padrão: o <html> já nasce com
   data-letra-pixel (app/layout.tsx). Quem desligar em Perfil fica sem o atributo;
   a escolha mora no navegador e o evento sincroniza as telas abertas. */
const CHAVE = 'prepenem:letra-pixel';
const EVENTO = 'prepenem:letra-pixel';

function lerLigado(): boolean {
  try {
    return localStorage.getItem(CHAVE) !== 'nao';
  } catch {
    return true;
  }
}

function aplicar(ligado: boolean) {
  document.documentElement.toggleAttribute('data-letra-pixel', ligado);
}

export function useLetraPixel() {
  const [ligado, setLigado] = useState(true);

  useEffect(() => {
    const atual = lerLigado();
    setLigado(atual);
    aplicar(atual);
    const aoMudar = () => {
      const v = lerLigado();
      setLigado(v);
      aplicar(v);
    };
    window.addEventListener(EVENTO, aoMudar);
    return () => window.removeEventListener(EVENTO, aoMudar);
  }, []);

  const alternar = useCallback(() => {
    const novo = !ligado;
    try {
      localStorage.setItem(CHAVE, novo ? 'sim' : 'nao');
    } catch {
      // sem armazenamento: vale só nesta visita
    }
    setLigado(novo);
    aplicar(novo);
    window.dispatchEvent(new Event(EVENTO));
  }, [ligado]);

  return { ligado, alternar };
}
