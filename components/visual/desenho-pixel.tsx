'use client';
import { useEffect, useMemo, useRef } from 'react';
import {
  ENGROSSA_LINHA, LADO_DO_PIXEL, QUADROS_POR_SEGUNDO, endurecerBordas, separarSvg, tamanhoDoViewBox,
} from '@/lib/pixel/svg-pixel';

// Desenho feito à mão (SVG) mostrado como pixel art (Pablo, 14/11/2026).
// 1. O SVG das formas fica invisível na tela, só para o navegador calcular cor e
//    animação (as classes de app/globals.css).
// 2. A cada quadro, uma cópia com essas cores escritas nela é desenhada pequena num
//    canvas e ampliada com pixels quadrados (image-rendering: pixelated).
// 3. Os rótulos ficam num SVG por cima, nítidos.

const PROPRIEDADES = [
  'fill', 'fill-opacity', 'stroke', 'stroke-opacity', 'stroke-dasharray', 'stroke-dashoffset',
  'stroke-linecap', 'stroke-linejoin', 'opacity', 'transform', 'transform-origin', 'transform-box', 'display',
];

function copiaComCores(original: SVGSVGElement): string {
  const copia = original.cloneNode(true) as SVGSVGElement;
  const deOrigem = Array.from(original.querySelectorAll('*'));
  const daCopia = Array.from(copia.querySelectorAll('*'));
  deOrigem.forEach((el, i) => {
    const estilo = getComputedStyle(el);
    const linha = parseFloat(estilo.getPropertyValue('stroke-width')) || 0;
    const css = PROPRIEDADES.map((p) => `${p}:${estilo.getPropertyValue(p)}`).join(';');
    daCopia[i]?.setAttribute('style', `${css};stroke-width:${linha * ENGROSSA_LINHA}`);
    daCopia[i]?.removeAttribute('class');
  });
  copia.removeAttribute('class');
  copia.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(copia);
}

export function DesenhoPixel({ svg, className = '' }: { svg: string; className?: string }) {
  const partes = useMemo(() => separarSvg(svg), [svg]);
  const caixa = useMemo(() => tamanhoDoViewBox(svg), [svg]);
  const fonte = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const largura = caixa ? Math.round(caixa.largura / LADO_DO_PIXEL) : 0;
  const altura = caixa ? Math.round(caixa.altura / LADO_DO_PIXEL) : 0;


  useEffect(() => {
    const original = fonte.current?.querySelector('svg');
    const ctx = tela.current?.getContext('2d', { willReadFrequently: true });
    if (!original || !ctx || !largura) return;
    let vivo = true;
    let ocupado = false;
    let base: ImageData | null = null;
    const svgMexe = (original.getAnimations?.({ subtree: true }).length ?? 0) > 0;
    // pinta a base (refeita a cada quadro só se o SVG se mexe). Sem mouse e sem brilhos:
    // o Pablo não gostou de nenhum dos dois (14/11/2026).
    const pintar = () => {
      if (!base) return;
      const quadro = new ImageData(new Uint8ClampedArray(base.data), largura, altura);
      ctx.putImageData(quadro, 0, 0);
    };
    const desenhar = () => {
      if (ocupado || !vivo) return;
      if (base && !svgMexe) return pintar();
      ocupado = true;
      const img = new Image();
      img.onload = () => {
        ocupado = false;
        if (!vivo) return;
        ctx.clearRect(0, 0, largura, altura);
        ctx.drawImage(img, 0, 0, largura, altura);
        const dados = ctx.getImageData(0, 0, largura, altura);
        endurecerBordas(dados.data);
        base = dados;
        pintar();
      };
      img.onerror = () => { ocupado = false; };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(copiaComCores(original))}`;
    };
    desenhar();
    const relogio = window.setInterval(() => {
      if (document.hidden) return;
      if (svgMexe) desenhar();
    }, 1000 / QUADROS_POR_SEGUNDO);
    return () => { vivo = false; window.clearInterval(relogio); };
  }, [partes, largura, altura]);

  if (!partes || !caixa) return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
  return (
    <div className={`relative ${className}`}>
      {/* só para o navegador calcular cores e animação; quem aparece é o canvas */}
      <div ref={fonte} aria-hidden className="desenho-pixel-fonte absolute inset-0 opacity-0 pointer-events-none" dangerouslySetInnerHTML={{ __html: partes.formas }} />
      <canvas ref={tela} width={largura} height={altura} className="desenho-pixel-tela block w-full h-auto" aria-hidden />
      <div className="desenho-pixel-rotulos absolute inset-0" dangerouslySetInnerHTML={{ __html: partes.textos }} />
    </div>
  );
}
