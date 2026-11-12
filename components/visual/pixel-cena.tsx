'use client';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { Pincel } from '@/lib/pixel/desenho';
import { imagemPixel } from '@/components/pixel/imagem-pixel';

/* Peças comuns das figuras em pixel (12/11/2026): a cena desenhada UMA vez
   no canvas, os rótulos nos lugares fixos e os pontos que se mexem em CSS
   (globals.css: .fig-mov, .fig-ponto). */

export type Lugar = { left: string; top: string };
export type PropsFigura = { rotulos?: string[]; semConta?: boolean };
export const LOUSA = '#eef4ea';
export const TINTA = '#22302a';

export function Cena({ chave, w, h, desenhar, lugares, rotulos, filhos }: {
  chave: string; w: number; h: number; desenhar: (c: Pincel) => void;
  lugares: Lugar[]; rotulos?: string[]; filhos?: ReactNode;
}) {
  const [url, setUrl] = useState('');
  useEffect(() => setUrl(imagemPixel(chave, w, h, desenhar)), [chave, w, h, desenhar]);
  return (
    <div className="fig-cena" style={{ aspectRatio: `${w} / ${h}` }}>
      {url && <div className="fig-imagem" style={{ backgroundImage: `url(${url})` }} />}
      {filhos}
      {(rotulos ?? []).map((r, i) => (r && lugares[i] ? <span key={i} className="fig-rotulo" style={lugares[i]}>{r}</span> : null))}
    </div>
  );
}

export type Animacao = 'pulso' | 'pisca' | 'anda' | 'vai-e-volta';

/** Quadradinho que se mexe. x, y e tam em % da cena; dx/dy em % da cena (para "anda"). */
export function Ponto({ x, y, tam = 3, cor, anim, dx = 0, dy = 0, dur = 2, atraso = 0, redondo = false }: {
  x: number; y: number; tam?: number; cor: string; anim: Animacao;
  dx?: number; dy?: number; dur?: number; atraso?: number; redondo?: boolean;
}) {
  const estilo = {
    '--dx': `${dx}%`, '--dy': `${dy}%`, '--dur': `${dur}s`, '--atraso': `${atraso}s`,
  } as CSSProperties;
  return (
    <div className={`fig-mov fig-${anim}`} style={estilo} aria-hidden>
      <span className="fig-ponto" style={{ left: `${x}%`, top: `${y}%`, width: `${tam}%`, background: cor, borderRadius: redondo ? '50%' : 0 }} />
    </div>
  );
}
