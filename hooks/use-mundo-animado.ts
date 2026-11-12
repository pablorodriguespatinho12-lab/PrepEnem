'use client';
import { useCallback, useEffect, useState } from 'react';

/* Mundo pixel animado (Pablo, 12/11/2026: "quero bastante animação" e "deixa
   como padrão do site; quem quiser mudar vai nas configurações").
   Ligado por padrão, mesmo com "reduzir movimento" no sistema (o Windows dele
   reduz). Quem quiser parado desliga em Perfil > "Mundo pixel animado". A
   escolha fica no navegador e o evento sincroniza as telas abertas. */
const CHAVE = 'prepenem:mundo-animado';
const EVENTO = 'prepenem:mundo-animado';

function lerAnimado(): boolean {
  try {
    return localStorage.getItem(CHAVE) !== 'nao';
  } catch {
    return true;
  }
}

export function useMundoAnimado() {
  const [animado, setAnimado] = useState(true);

  useEffect(() => {
    setAnimado(lerAnimado());
    const aoMudar = () => setAnimado(lerAnimado());
    window.addEventListener(EVENTO, aoMudar);
    return () => window.removeEventListener(EVENTO, aoMudar);
  }, []);

  const alternar = useCallback(() => {
    const novo = !animado;
    try {
      localStorage.setItem(CHAVE, novo ? 'sim' : 'nao');
    } catch {
      // navegador sem armazenamento: vale só nesta tela
    }
    setAnimado(novo);
    window.dispatchEvent(new Event(EVENTO));
  }, [animado]);

  return { animado, alternar };
}
