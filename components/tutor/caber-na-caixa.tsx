'use client';
// Encolhe o conteúdo para caber inteiro na caixa, sem rolar e sem cortar
// (Pablo, 22/10/2026: "não gosto de rolar para baixo"). Só escala para
// baixo; desenho que já cabe fica do tamanho dele.

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export function CaberNaCaixa({ children }: { children: ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null);
  const conteudo = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);

  useLayoutEffect(() => {
    const c = caixa.current;
    const d = conteudo.current;
    if (!c || !d) return;
    const medir = () => {
      const alto = d.offsetHeight;
      const largo = d.offsetWidth;
      if (!alto || !largo) return;
      setEscala(Math.min(1, c.clientHeight / alto, c.clientWidth / largo));
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(c);
    observador.observe(d);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={caixa} className="h-full w-full min-h-0 overflow-hidden grid place-items-center">
      <div ref={conteudo} className="w-full" style={{ transform: `scale(${escala})`, transformOrigin: 'center' }}>
        {children}
      </div>
    </div>
  );
}
