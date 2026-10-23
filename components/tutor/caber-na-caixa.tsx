'use client';
// Encolhe o conteúdo para caber inteiro na caixa, sem rolar e sem cortar
// (Pablo, 22/10/2026: "não gosto de rolar para baixo"). Só escala para
// baixo; desenho que já cabe fica do tamanho dele.

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export function CaberNaCaixa({ children }: { children: ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null);
  const conteudo = useRef<HTMLDivElement>(null);
  const [ajuste, setAjuste] = useState({ escala: 1, dx: 0 });

  useLayoutEffect(() => {
    const c = caixa.current;
    const d = conteudo.current;
    if (!c || !d) return;
    const medir = () => {
      const alto = d.offsetHeight;
      // scrollWidth: desenho mais largo que a caixa vaza para a direita e
      // offsetWidth não vê; antes ele saía cortado (23/10/2026).
      const largo = Math.max(d.scrollWidth, d.offsetWidth);
      if (!alto || !largo) return;
      const escala = Math.min(1, c.clientHeight / alto, c.clientWidth / largo);
      // Escala a partir da esquerda e centraliza à mão: funciona com ou sem vazamento.
      setAjuste({ escala, dx: (c.clientWidth - largo * escala) / 2 });
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(c);
    observador.observe(d);
    // Fórmula que termina de montar depois vaza para o lado sem mudar o tamanho
    // da caixa, e o ResizeObserver não vê: mede de novo quando o conteúdo muda.
    const mudancas = new MutationObserver(medir);
    mudancas.observe(d, { childList: true, subtree: true, characterData: true });
    void document.fonts?.ready.then(medir);
    return () => { observador.disconnect(); mudancas.disconnect(); };
  }, []);

  return (
    // flex e não grid: a grade prende no topo o conteúdo mais alto que a caixa e,
    // encolhido pelo centro, ele sobrava em cima e era cortado embaixo.
    <div ref={caixa} className="h-full w-full min-h-0 overflow-hidden flex items-center">
      <div ref={conteudo} className="w-full shrink-0" style={{ transform: `translateX(${ajuste.dx}px) scale(${ajuste.escala})`, transformOrigin: 'left center' }}>
        {children}
      </div>
    </div>
  );
}
