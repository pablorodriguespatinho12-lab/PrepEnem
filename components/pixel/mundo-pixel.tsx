'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTheme } from 'next-themes';
import { PALETA_DIA, PALETA_NOITE, arvores, arvoresAoVento, astro, ceu, nuvens, paisagem, type Arvore, type Paleta } from '@/lib/pixel/desenho';
import { imagemPixel, tamanhoDoPixel } from './imagem-pixel';

/* Fundo da prova: serra em pixel com o dia e a noite passando (Pablo, 12/11/2026:
   "tem um sol, depois vem a noite"). Duas versões de cada camada (dia e noite)
   desenhadas UMA vez; o ciclo é só opacidade e giro em CSS (compositor). Parado,
   mostra o dia no tema claro e a noite no escuro. CSS em globals.css (.mundo-pixel). */

/** Um dia inteiro (dia + noite), em segundos. */
const CICLO_S = 360;

interface Imagens {
  ceuDia: string;
  ceuNoite: string;
  nuvensDia: string;
  nuvensNoite: string;
  terraDia: string;
  terraNoite: string;
  /** Árvores entortadas pelo vento: [dia grupo A, dia B, noite A, noite B]. */
  vento: string[];
  sol: string;
  lua: string;
  chamine: { fx: number; fy: number };
  px: number;
  raioAstro: number;
}

function desenhar(): Imagens {
  const px = tamanhoDoPixel();
  const W = Math.ceil(window.innerWidth / px);
  const H = Math.ceil(window.innerHeight / px);
  const k = `${W}x${H}`;
  // onde ficam a chaminé e as árvores (não depende da cor; vale também com a imagem guardada)
  const { chamine, arvores: lista } = paisagem({ fillStyle: '', fillRect: () => {} }, W, H, PALETA_DIA);
  const terraDia = imagemPixel(`terra-dia-${k}`, W, H, (c) => {
    paisagem(c, W, H, PALETA_DIA, undefined, true);
    arvores(c, PALETA_DIA, lista);
  });
  const terraNoite = imagemPixel(`terra-noite-${k}`, W, H, (c) => {
    paisagem(c, W, H, PALETA_NOITE, undefined, true);
    arvores(c, PALETA_NOITE, lista);
  });
  // Vento (14/11/2026): metade das árvores em cada grupo, para não balançarem juntas.
  const grupos = [lista.filter((_, i) => i % 2 === 0), lista.filter((_, i) => i % 2 === 1)];
  const vento = [PALETA_DIA, PALETA_NOITE].flatMap((p, f) =>
    grupos.map((g, j) => imagemPixel(`vento2-${f}-${j}-${k}`, W, H, (c) => desenharVento(c, W, H, p, lista, g))),
  );
  const r = Math.max(4, Math.round(H * 0.05));
  const lado = 2 * r + 3;
  const hn = Math.round(H * 0.5);
  return {
    ceuDia: imagemPixel(`ceu-dia-${k}`, W, H, (c) => ceu(c, W, H, PALETA_DIA)),
    ceuNoite: imagemPixel(`ceu-noite-${k}`, W, H, (c) => ceu(c, W, H, PALETA_NOITE)),
    nuvensDia: imagemPixel(`nuvens-dia-${k}`, W * 2, hn, (c) => nuvens(c, W, hn, PALETA_DIA)),
    nuvensNoite: imagemPixel(`nuvens-noite-${k}`, W * 2, hn, (c) => nuvens(c, W, hn, PALETA_NOITE)),
    terraDia,
    terraNoite,
    vento,
    sol: imagemPixel(`sol-${r}`, lado, lado, (c) => astro(c, PALETA_DIA, r, false)),
    lua: imagemPixel(`lua-${r}`, lado, lado, (c) => astro(c, PALETA_NOITE, r, true)),
    chamine,
    px,
    raioAstro: lado * px,
  };
}

/** Camada de vento: a base (terra sem árvores) só onde há árvore, e a árvore entortada. */
function desenharVento(c: { fillStyle: unknown }, W: number, H: number, p: Paleta, todas: Arvore[], grupo: Arvore[]) {
  const base = document.createElement('canvas');
  base.width = W;
  base.height = H;
  const b = base.getContext('2d');
  if (!b) return;
  paisagem(b, W, H, p, undefined, true);
  arvoresAoVento(c as CanvasRenderingContext2D, base, p, todas, grupo, 2);
}

const fundo = (url: string): CSSProperties => ({ backgroundImage: `url(${url})` });

/** Estrelas que piscam e vagalumes: posições fixas (sem sorteio a cada render). */
const ESTRELAS = [[12, 8], [27, 15], [41, 6], [58, 12], [71, 4], [86, 10], [93, 18], [35, 22]];
const VAGALUMES = [[18, 88], [33, 92], [52, 86], [64, 94], [79, 90]];

export function MundoPixel({ animado }: { animado: boolean }) {
  const { resolvedTheme } = useTheme();
  const [img, setImg] = useState<Imagens | null>(null);
  const [pausado, setPausado] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  // Rolando: o mundo espera. Mexe só no atributo, sem passar pelo React
  // (medir-fluidez: nada que rode no scroll pode passar pelo React).
  useEffect(() => {
    let fim: ReturnType<typeof setTimeout>;
    const aoRolar = () => {
      raiz.current?.setAttribute('data-rolando', 'sim');
      clearTimeout(fim);
      fim = setTimeout(() => raiz.current?.removeAttribute('data-rolando'), 180);
    };
    window.addEventListener('scroll', aoRolar, { passive: true, capture: true });
    return () => {
      clearTimeout(fim);
      window.removeEventListener('scroll', aoRolar, { capture: true });
    };
  }, []);

  useEffect(() => {
    setImg(desenhar());
    let espera: ReturnType<typeof setTimeout>;
    const aoRedimensionar = () => {
      clearTimeout(espera);
      espera = setTimeout(() => setImg(desenhar()), 200);
    };
    // aba escondida: o mundo para (nada roda fora da tela)
    const aoTrocarAba = () => setPausado(document.hidden);
    window.addEventListener('resize', aoRedimensionar);
    document.addEventListener('visibilitychange', aoTrocarAba);
    return () => {
      clearTimeout(espera);
      window.removeEventListener('resize', aoRedimensionar);
      document.removeEventListener('visibilitychange', aoTrocarAba);
    };
  }, []);

  if (!img) return <div className="mundo-pixel" aria-hidden />;

  const noite = resolvedTheme === 'dark';
  const estilo = {
    '--ciclo': `${CICLO_S}s`,
    // abre no meio da manhã (claro) ou no começo da noite (escuro)
    '--atraso': `-${CICLO_S * (noite ? 0.6 : 0.12)}s`,
    '--px': `${img.px}px`,
    // caminho largo: ao meio-dia o sol passa por cima do cartão, não atrás dele
    '--raio': 'min(56vh, 46vw)',
    '--astro': `${img.raioAstro}px`,
  } as CSSProperties;

  return (
    <div
      ref={raiz}
      className="mundo-pixel"
      aria-hidden
      data-animado={animado ? 'sim' : 'nao'}
      data-fase={noite ? 'noite' : 'dia'}
      data-pausado={pausado ? 'sim' : 'nao'}
      style={estilo}
    >
      <div className="mp-camada" style={fundo(img.ceuDia)} />
      <div className="mp-camada mp-noite" style={fundo(img.ceuNoite)}>
        {ESTRELAS.map(([x, y], i) => (
          <span key={i} className="mp-estrela" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.7}s` }} />
        ))}
      </div>
      <div className="mp-braco">
        <div className="mp-sol" style={fundo(img.sol)} />
        <div className="mp-lua" style={fundo(img.lua)} />
      </div>
      <div className="mp-nuvens" style={fundo(img.nuvensDia)} />
      <div className="mp-nuvens mp-noite" style={fundo(img.nuvensNoite)} />
      <div className="mp-dia">
        <span className="mp-passaro" />
        <span className="mp-passaro mp-passaro-2" />
      </div>
      <div className="mp-camada" style={fundo(img.terraDia)}>
        <div className="mp-camada mp-vento" style={fundo(img.vento[0])} />
        <div className="mp-camada mp-vento mp-vento-b" style={fundo(img.vento[1])} />
      </div>
      <div className="mp-camada mp-noite" style={fundo(img.terraNoite)}>
        <div className="mp-camada mp-vento" style={fundo(img.vento[2])} />
        <div className="mp-camada mp-vento mp-vento-b" style={fundo(img.vento[3])} />
        {VAGALUMES.map(([x, y], i) => (
          <span key={i} className="mp-vagalume" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 1.3}s` }} />
        ))}
      </div>
      <div className="mp-fumaca" style={{ left: `${img.chamine.fx * 100}%`, top: `${img.chamine.fy * 100}%` }}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
