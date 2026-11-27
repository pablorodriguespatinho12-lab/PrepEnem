'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { CenaJardim } from './jardim/cena-jardim';
import { ArteJardim } from './jardim/desenhos';
import type { NomeDaArte } from '@/lib/jardim/artes';

/* Capa do Início e do Estudar: paisagem de noite desenhada em pixel (1 pixel = 5 px),
   igual ao desenho aprovado em 26/11/2026. Parada: é fundo, não animação. */
const CEU = ['#0c1730', '#122345', '#1b335c', '#2a4a74'];
const MORROS = [['#2b4a68', .55, .12, .045], ['#1f4a45', .7, .08, .07], ['#12332a', .84, .05, .11]] as const;
const BAYER = [0, .5, .75, .25];

function desenhar(c: HTMLCanvasElement) {
  const w = Math.max(80, Math.round(c.clientWidth / 5));
  const h = Math.max(50, Math.round(c.clientHeight / 5));
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) return;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = Math.min(3, Math.floor((y / h) * 3.4 + BAYER[(x % 2) + 2 * (y % 2)] * .5));
      g.fillStyle = CEU[i];
      g.fillRect(x, y, 1, 1);
    }
  }
  g.fillStyle = '#e8eefc';
  for (let i = 0; i < 40; i++) g.fillRect((i * 53 + i * i * 7) % w, (i * i * 13 + i * 5) % Math.round(h * .5), 1, 1);
  const lx = Math.round(w * .8);
  const ly = Math.round(h * .2);
  g.fillStyle = '#f6ecc9';
  for (let y = -6; y <= 6; y++) {
    const r = Math.round(Math.sqrt(36 - y * y));
    g.fillRect(lx - r, ly + y, r * 2, 1);
  }
  MORROS.forEach(([cor, base, amp, k], n) => {
    g.fillStyle = cor;
    for (let x = 0; x < w; x++) {
      const y = Math.round(h * (base + amp * (Math.sin(x * k + n * 2) * .7 + Math.sin(x * k * 2.7) * .3)));
      g.fillRect(x, y, 1, h - y);
    }
  });
  const cx = Math.round(w * .68);
  const cy = Math.round(h * .6);
  g.fillStyle = '#6b4130';
  for (let i = 0; i < 6; i++) g.fillRect(cx - i - 1, cy + i, i * 2 + 3, 1);
  g.fillStyle = '#d8ccb6';
  g.fillRect(cx - 5, cy + 6, 11, 7);
  g.fillStyle = '#ffd36b';
  g.fillRect(cx + 1, cy + 8, 3, 3);
}

/* `arte`: no modo Jardim vira faixa (texto à esquerda, desenho à direita) no lugar da cena. */
export function CapaPixel({ sobre, titulo, id, arte, children }: { sobre: string; titulo: string; id: string; arte?: NomeDaArte; children?: ReactNode }) {
  const tela = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = tela.current;
    if (!c) return;
    desenhar(c);
    const observador = new ResizeObserver(() => desenhar(c));
    observador.observe(c);
    return () => observador.disconnect();
  }, []);

  return (
    <section className="m-capa" aria-labelledby={id} data-faixa={arte ? 'sim' : undefined}>
      <canvas ref={tela} aria-hidden />
      {arte ? <ArteJardim nome={arte} className="so-jardim jv-faixa-arte" /> : <CenaJardim />}
      <div className="m-capa-texto">
        <div className="min-w-0">
          <small data-numeric>{sobre}</small>
          <h1 id={id} className="px">{titulo}</h1>
        </div>
        {children}
      </div>
    </section>
  );
}
