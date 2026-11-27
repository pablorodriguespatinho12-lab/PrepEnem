'use client';
import { useEffect, useState } from 'react';

const DURACAO = 1100;

/* Número que sobe até o valor (prévia "Jardim vivo"). O leitor de tela recebe
   sempre o valor final. */
export function Contador({ valor }: { valor: number }) {
  const [visto, setVisto] = useState(0);

  useEffect(() => {
    const inicio = performance.now();
    let quadro = requestAnimationFrame(function passo(agora) {
      const k = Math.min(1, (agora - inicio) / DURACAO);
      setVisto(Math.round(valor * (1 - (1 - k) ** 3)));
      if (k < 1) quadro = requestAnimationFrame(passo);
    });
    // Aba de fundo não roda rAF: o valor certo aparece do mesmo jeito.
    const fim = setTimeout(() => setVisto(valor), DURACAO + 100);
    return () => { cancelAnimationFrame(quadro); clearTimeout(fim); };
  }, [valor]);

  return (
    <>
      <span aria-hidden>{visto}</span>
      <span className="sr-only">{valor}</span>
    </>
  );
}
