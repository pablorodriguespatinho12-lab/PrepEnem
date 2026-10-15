'use client';
// Caneta: a conta se escreve como professor no caderno, letra por letra. Cada
// letra é um traço (SVG do MathJax, feito no servidor em /api/caneta): primeiro
// o contorno se desenha, depois a tinta preenche (Pablo, 07/10/2026: "a caneta
// passando por cima formando a letra a, formando o mais, formando o b").
// Linha que o servidor não leu cai no KaTeX, aparecendo da esquerda para a
// direita. Sob reduced-motion a conta já nasce escrita.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Latex } from './grafico';

const MS_POR_LETRA = 95;
const MS_TRACO = 420;
const ESPESSURA = 18; // em unidades do MathJax (1000 = 1 em)

const cache = new Map<string, string | null>();
const pendentes = new Map<string, Promise<void>>();

async function buscar(linhas: string[]): Promise<void> {
  const faltam = linhas.filter((l) => !cache.has(l) && !pendentes.has(l));
  if (faltam.length > 0) {
    const pedido = fetch('/api/caneta', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ linhas: faltam }),
    })
      .then((r) => (r.ok ? r.json() : { svgs: [] }))
      .then((d: { svgs?: (string | null)[] }) => faltam.forEach((l, i) => cache.set(l, d.svgs?.[i] ?? null)))
      .catch(() => faltam.forEach((l) => cache.set(l, null)))
      .finally(() => faltam.forEach((l) => pendentes.delete(l)));
    faltam.forEach((l) => pendentes.set(l, pedido));
  }
  await Promise.all(linhas.map((l) => pendentes.get(l)).filter(Boolean));
}

/* Já busca as contas antes de elas aparecerem (ex.: o passo seguinte). */
export function prepararCaneta(linhas: string[]): void {
  void buscar(linhas.filter(Boolean));
}

/* Anima cada letra de um SVG, em ordem; devolve quanto tempo leva. */
function escrever(svg: SVGSVGElement, inicio: number): number {
  const marcas = Array.from(svg.querySelectorAll<SVGGraphicsElement>('path, rect, text'));
  marcas.forEach((el, i) => {
    const atraso = inicio + i * MS_POR_LETRA;
    if (el.tagName === 'path') {
      el.setAttribute('pathLength', '1');
      el.style.strokeWidth = String(ESPESSURA);
      el.style.strokeLinecap = 'round';
      el.style.strokeLinejoin = 'round';
      el.animate(
        [
          { strokeDasharray: '1 1', strokeDashoffset: 1, fillOpacity: 0 },
          { strokeDasharray: '1 1', strokeDashoffset: 0, fillOpacity: 0, offset: 0.65 },
          { strokeDasharray: '1 1', strokeDashoffset: 0, fillOpacity: 1 },
        ],
        { duration: MS_TRACO, delay: atraso, easing: 'ease-in-out', fill: 'both' },
      );
    } else if (el.tagName === 'text' || el.hasAttribute('transform')) {
      // Letra sem traço na fonte do MathJax (acento: "â", "ç", "ã") vem como
      // <text> com transform="scale(1,-1)". Animar transform pelo CSS apagava
      // esse atributo e a letra caía de ponta-cabeça: "dist_ncia" (15/10/2026).
      el.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: MS_TRACO * 0.7, delay: atraso, easing: 'ease-out', fill: 'both' });
    } else {
      // Traço de fração e raiz (rect): risca da esquerda para a direita.
      el.style.transformBox = 'fill-box';
      el.style.transformOrigin = 'left center';
      el.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration: MS_TRACO * 0.7, delay: atraso, easing: 'ease-out', fill: 'both' });
    }
  });
  return marcas.length * MS_POR_LETRA + MS_TRACO;
}

export interface CanetaProps {
  linhas: string[];
  /* Avisa quando a última letra termina (para mostrar "Continuar"). */
  onFim?: () => void;
  /* Linha que já foi escrita antes (passo anterior do quadro): aparece pronta. */
  jaEscrita?: boolean;
  className?: string;
}

export function Caneta({ linhas, onFim, jaEscrita = false, className }: CanetaProps) {
  const reduzir = useReducedMotion() ?? false;
  const [pronto, setPronto] = useState(() => linhas.every((l) => cache.has(l)));
  const caixa = useRef<HTMLDivElement>(null);
  const fim = useRef(onFim);
  fim.current = onFim;
  const chave = linhas.join('\n');

  useEffect(() => {
    let vivo = true;
    if (!linhas.every((l) => cache.has(l))) {
      setPronto(false);
      void buscar(linhas).then(() => vivo && setPronto(true));
    } else setPronto(true);
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  useLayoutEffect(() => {
    if (!pronto || !caixa.current) return;
    if (reduzir || jaEscrita) { fim.current?.(); return; }
    let t = 0;
    caixa.current.querySelectorAll<HTMLElement>('[data-linha]').forEach((linha) => {
      const svg = linha.querySelector('svg');
      if (svg) t += escrever(svg, t);
      else {
        linha.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
          { duration: 600, delay: t, easing: 'ease-out', fill: 'both' });
        t += 600;
      }
    });
    const id = window.setTimeout(() => fim.current?.(), t);
    return () => window.clearTimeout(id);
  }, [pronto, reduzir, jaEscrita, chave]);

  if (!pronto) return <div className={className} aria-busy="true" style={{ minHeight: `${linhas.length * 2.2}em` }} />;
  return (
    <div ref={caixa} className={className} role="math" aria-label={linhas.join('; ')}>
      {linhas.map((l, i) => {
        const svg = cache.get(l);
        return (
          // Conta mais larga que a tela encolhe em vez de ser cortada.
          <div key={`${i}-${l}`} data-linha className="overflow-x-auto py-1 text-[1.35em] leading-none [&_svg]:max-w-full [&_svg]:h-auto">
            {svg ? <span aria-hidden dangerouslySetInnerHTML={{ __html: svg }} /> : <Latex fonte={l} />}
          </div>
        );
      })}
    </div>
  );
}
