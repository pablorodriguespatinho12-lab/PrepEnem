'use client';
import { useCallback, useEffect, useState } from 'react';

/* Mundo pixel animado (Pablo, 12/11/2026: "quero bastante animação").
   Sem escolha dele, segue o sistema: o Windows dele está com "efeitos de
   animação" desligados (reduzir movimento), então o mundo nasce parado e o
   botão "Mundo animado" liga só no site. A escolha fica no navegador e vale
   em todas as telas (o evento sincroniza as que estão abertas). */
const CHAVE = 'prepenem:mundo-animado';
const EVENTO = 'prepenem:mundo-animado';
type Escolha = 'sim' | 'nao' | null;

function lerEscolha(): Escolha {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === 'sim' || v === 'nao' ? v : null;
  } catch {
    return null;
  }
}

export function useMundoAnimado() {
  const [escolha, setEscolha] = useState<Escolha>(null);
  const [sistemaReduz, setSistemaReduz] = useState(false);

  useEffect(() => {
    setEscolha(lerEscolha());
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    setSistemaReduz(mq.matches);
    const aoMudarSistema = () => setSistemaReduz(mq.matches);
    const aoMudarEscolha = () => setEscolha(lerEscolha());
    mq.addEventListener('change', aoMudarSistema);
    window.addEventListener(EVENTO, aoMudarEscolha);
    return () => {
      mq.removeEventListener('change', aoMudarSistema);
      window.removeEventListener(EVENTO, aoMudarEscolha);
    };
  }, []);

  const animado = escolha ? escolha === 'sim' : !sistemaReduz;

  const alternar = useCallback(() => {
    const nova = animado ? 'nao' : 'sim';
    try {
      localStorage.setItem(CHAVE, nova);
    } catch {
      // navegador sem armazenamento: vale só nesta tela
    }
    setEscolha(nova);
    window.dispatchEvent(new Event(EVENTO));
  }, [animado]);

  return { animado, alternar };
}
