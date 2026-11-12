'use client';
import { useEffect, useState } from 'react';
import { ANEIS_ESCURO, PALETA_NOITE, aneis, casa, ponto } from '@/lib/pixel/desenho';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';
import { imagemPixel } from './imagem-pixel';

/* Fim da prova (voto 4A, 12/11/2026): casinha acesa no meio do escuro, com
   anéis em volta (jeito BibleProject, sem caveira). A placa diz quantas ele
   acertou de quantas: o n fica visível (regra de dado esparso). */

const W = 160;
const H = 100;
const CHAO = Math.round(H * 0.64);
const CASA_X = W / 2 - 7;

function desenharCena() {
  const url = imagemPixel('cena-fim', W, H, (c) => {
    aneis(c, W, H, ANEIS_ESCURO, W / 2, Math.round(H * 0.46), Math.round(H * 0.2), Math.round(H * 0.1), 13);
    ponto(c, '#062022', 0, CHAO, W, H - CHAO);
    // a luz da porta deitada no chão
    for (let k = 0; k < 6; k++) ponto(c, 'rgba(255,217,138,.18)', W / 2 - 4 - k * 2, CHAO + k, 8 + k * 4, 1);
    casa(c, { ...PALETA_NOITE, parede: '#f6e2b3', porta: '#ffd98a', janela: '#fff1c9' }, CASA_X, CHAO);
  });
  const boca = casa({ fillStyle: '', fillRect: () => {} }, PALETA_NOITE, CASA_X, CHAO);
  return { url, fx: (boca.x / W) * 100, fy: (boca.y / H) * 100 };
}

export function CenaFim({ acertos, total }: { acertos: number; total: number }) {
  const { animado } = useMundoAnimado();
  const [desenho, setDesenho] = useState<{ url: string; fx: number; fy: number } | null>(null);
  // desenha no navegador (no servidor não há canvas)
  useEffect(() => setDesenho(desenharCena()), []);

  return (
    <div className="cena-fim rounded-[var(--radius-container)]" data-animado={animado ? 'sim' : 'nao'}>
      {desenho && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cf-imagem" src={desenho.url} alt="" width={W} height={H} />
          <div className="cf-brilho" style={{ left: '30%', top: '6%', width: '40%', aspectRatio: '1' }} aria-hidden />
          <div className="cf-fumaca" style={{ left: `${desenho.fx}%`, top: `${desenho.fy}%` }} aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </>
      )}
      <div className="absolute inset-x-0 bottom-[7%] text-center grid" style={{ color: '#fff6dc' }}>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 'clamp(18px, 2.4vw, 24px)', letterSpacing: '.06em' }}>Prova feita</span>
        <strong data-numeric style={{ fontFamily: 'var(--font-pixel), monospace', fontWeight: 400, fontSize: 'clamp(42px, 7vw, 64px)', lineHeight: 0.95 }}>
          {acertos} de {total}
        </strong>
      </div>
    </div>
  );
}
