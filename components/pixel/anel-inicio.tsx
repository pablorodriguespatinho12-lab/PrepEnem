'use client';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { ANEIS_CLARO, ANEIS_ESCURO, ANEIS_VERDE_CLARO, ANEIS_VERDE_ESCURO, aneis } from '@/lib/pixel/desenho';
import { useAppTheme } from '@/components/app-theme-provider';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';
import { imagemPixel, tamanhoDoPixel } from './imagem-pixel';

/* Fundo do bloco de hoje no Início (voto 1B, 12/11/2026): anéis concêntricos
   e luz à direita, no jeito BibleProject, em pixel. A luz respira e sobem
   faíscas quando o mundo está animado. CSS em globals.css (.anel-inicio). */

const FAISCAS = [
  [74, 62, 0], [82, 70, 0.8], [88, 58, 1.6], [79, 50, 2.3], [91, 66, 0.4],
];

export function AnelInicio() {
  const caixa = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const { animado } = useMundoAnimado();
  const { color } = useAppTheme();
  const [desenho, setDesenho] = useState<{ url: string; cx: number; cy: number; r: number } | null>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const pintar = () => {
      const px = tamanhoDoPixel();
      const W = Math.ceil(el.clientWidth / px);
      const H = Math.ceil(el.clientHeight / px);
      if (!W || !H) return;
      const escuro = resolvedTheme === 'dark';
      const cx = Math.round(W * (W < 120 ? 0.8 : 0.82));
      const cy = Math.round(H * 0.5);
      const r0 = Math.max(5, Math.round(Math.min(H, W) * 0.18));
      const larg = Math.max(4, Math.round(Math.min(H, W) * 0.11));
      const url = imagemPixel(`anel-${W}x${H}-${escuro ? 'e' : 'c'}-${color === 'green' ? 'v' : 't'}`, W, H, (c) =>
        aneis(c, W, H, color === 'green' ? (escuro ? ANEIS_VERDE_ESCURO : ANEIS_VERDE_CLARO) : (escuro ? ANEIS_ESCURO : ANEIS_CLARO), cx, cy, r0, larg),
      );
      setDesenho({ url, cx: (cx / W) * 100, cy: (cy / H) * 100, r: r0 * px * 2.6 });
    };
    pintar();
    const obs = new ResizeObserver(() => pintar());
    obs.observe(el);
    return () => obs.disconnect();
  }, [resolvedTheme, color]);

  return (
    <div
      ref={caixa}
      className="anel-inicio"
      aria-hidden
      data-animado={animado ? 'sim' : 'nao'}
      style={color === 'green' ? ({ ['--ai-tom' as string]: '168, 230, 184' }) : undefined}
    >
      {desenho && (
        <>
          <div className="ai-imagem" style={{ backgroundImage: `url(${desenho.url})` }} />
          <div
            className="ai-brilho"
            style={{ left: `calc(${desenho.cx}% - ${desenho.r / 2}px)`, top: `calc(${desenho.cy}% - ${desenho.r / 2}px)`, width: desenho.r, height: desenho.r }}
          />
          {FAISCAS.map(([x, y, atraso], i) => (
            <span key={i} className="ai-faisca" style={{ left: `${x}%`, top: `${y}%`, ['--atraso' as string]: `${atraso}s` }} />
          ))}
        </>
      )}
    </div>
  );
}
