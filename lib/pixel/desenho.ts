/* Desenho do mundo pixel (Pablo, 12/11/2026: Café da Serra "PERFEITO" e prévia
   https://claude.ai/artifact/QVn75VnVMV9JmptgX1pJXG, votos 1B 2A 3A 4A).
   Funções puras sobre um pincel mínimo: desenham UMA vez numa grade pequena
   (1 unidade = 4 a 6 px na tela) e a imagem pronta vira fundo CSS. Nada aqui
   roda em loop: o movimento é CSS (transform/opacity), no compositor
   (animation-system: canvas a 60 fps já travou o treino em 05/10/2026). */

export interface Pincel {
  fillStyle: string | CanvasGradient | CanvasPattern;
  fillRect(x: number, y: number, w: number, h: number): void;
}

export interface Paleta {
  ceu: string[];
  astro: string;
  astroBorda: string;
  nuvem: string;
  nuvemSombra: string;
  longe: string;
  longeLuz: string;
  perto: string;
  pertoLuz: string;
  pinho: string;
  pinhoLuz: string;
  tronco: string;
  grama: string;
  gramaLuz: string;
  gramaEscura: string;
  agua: string;
  aguaLuz: string;
  flores: string[];
  parede: string;
  telhado: string;
  telhadoLuz: string;
  porta: string;
  janela: string;
  pedra: string;
  estrela: string[];
}

export const PALETA_DIA: Paleta = {
  ceu: ['#a9d8ee', '#bfe3f2', '#d3edf3', '#e6f5ef'],
  astro: '#fff3bf',
  astroBorda: '#ffe593',
  nuvem: '#ffffff',
  nuvemSombra: '#dcebf1',
  longe: '#8fb7b4',
  longeLuz: '#a8cbc6',
  perto: '#5f9e6a',
  pertoLuz: '#79b67f',
  pinho: '#2f6b45',
  pinhoLuz: '#3f8456',
  tronco: '#5b3f2b',
  grama: '#6db36f',
  gramaLuz: '#8ccb84',
  gramaEscura: '#559a5c',
  agua: '#6fb7d6',
  aguaLuz: '#bfe6f2',
  flores: ['#fff7d6', '#f7d36b', '#f2b8c6'],
  parede: '#f4ead7',
  telhado: '#6b4a33',
  telhadoLuz: '#85603f',
  porta: '#4a3322',
  janela: '#a9d6e5',
  pedra: '#9a9a92',
  estrela: [],
};

export const PALETA_NOITE: Paleta = {
  ceu: ['#16223c', '#1c2b4a', '#243759', '#2e4468'],
  astro: '#f3ead0',
  astroBorda: '#d8ccab',
  nuvem: '#3a4d6e',
  nuvemSombra: '#2f405e',
  longe: '#2b4257',
  longeLuz: '#365169',
  perto: '#25483a',
  pertoLuz: '#2f5847',
  pinho: '#163327',
  pinhoLuz: '#1f4332',
  tronco: '#2c2018',
  grama: '#2a5440',
  gramaLuz: '#36694f',
  gramaEscura: '#204533',
  agua: '#2e5d7c',
  aguaLuz: '#6f9fbd',
  flores: ['#d9d4c0', '#c9b25c', '#b89aa6'],
  parede: '#c9bfae',
  telhado: '#3e2b1e',
  telhadoLuz: '#4d3726',
  porta: '#2b1e14',
  janela: '#ffd77a',
  pedra: '#5b5d5a',
  estrela: ['#f6efd9', '#9fb0cc'],
};

/* Anéis e luz (jeito BibleProject), sempre em cima do teal da marca. */
export interface PaletaAneis {
  aneis: string[];
  linha: string;
  luz: string[];
}
export const ANEIS_CLARO: PaletaAneis = {
  aneis: ['#0f5f73', '#0d5466', '#0b4858', '#093d4b', '#07323d'],
  linha: '#2a7c8f',
  luz: ['#fff4d6', '#e6f6f2', '#9fe0e6', '#4fb9cc'],
};
export const ANEIS_ESCURO: PaletaAneis = {
  aneis: ['#0c3a3c', '#0a3133', '#08292b', '#062123', '#041a1b'],
  linha: '#15514f',
  luz: ['#fff1c9', '#ffd98a', '#7fe0d0', '#2a9d93'],
};

/** Gerador com semente: o mesmo desenho a cada visita (sem pinheiro pulando). */
export function aleatorio(semente: number): () => number {
  let s = semente;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function ponto(c: Pincel, cor: string, x: number, y: number, w = 1, h = 1): void {
  c.fillStyle = cor;
  c.fillRect(Math.round(x), Math.round(y), w, h);
}

export function circulo(c: Pincel, cor: string, cx: number, cy: number, r: number): void {
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) ponto(c, cor, cx + x, cy + y);
}

/** Cor da faixa em t (0..1) com pontilhado Bayer entre faixas: degradê liso entrega que não é pixel. */
export function faixa(cores: string[], t: number, x: number, y: number): string {
  const v = Math.min(Math.max(t, 0), 0.999) * (cores.length - 1);
  const i = Math.floor(v);
  return (v - i) * 16 > BAYER[y % 4][x % 4] && i + 1 < cores.length ? cores[i + 1] : cores[i];
}

export function cume(W: number, H: number, base: number, ondas: [number, number, number][]): number[] {
  return Array.from({ length: W }, (_, x) => Math.round(H * base + ondas.reduce((s, [f, fase, a]) => s + Math.sin(x * f + fase) * H * a, 0)));
}

/** Pinheiro; `vento` (em pixels) entorta a metade de cima da copa para o lado. */
function pinheiro(c: Pincel, p: Paleta, x: number, chao: number, h: number, vento = 0): void {
  ponto(c, p.tronco, x, chao - 2, 1, 3);
  for (let r = 0; r < h; r++) {
    const m = Math.floor(((r % 4) + r * 0.6) / 2.2);
    const y = chao - 2 - h + r;
    const d = r < h * 0.25 ? vento : r < h * 0.55 ? Math.sign(vento) * Math.max(0, Math.abs(vento) - 1) : 0;
    ponto(c, p.pinho, x - m + d, y, m * 2 + 1, 1);
    ponto(c, p.pinhoLuz, x - m + d, y);
  }
}

/* Árvores ao vento (Pablo, 14/11/2026: "deixa mais animado tudo, as árvores").
   A terra é desenhada SEM as árvores (base); depois as árvores retas por cima.
   Cada camada de vento repinta o retângulo de cada árvore com a base e desenha
   a árvore entortada: só ela muda, o resto da camada é transparente. */
export type Arvore = { x: number; chao: number; h: number };
export function arvores(c: Pincel, p: Paleta, lista: Arvore[]): void {
  lista.forEach((a) => pinheiro(c, p, a.x, a.chao, a.h));
}
export function retanguloDaArvore(a: Arvore, folga = 3): { x: number; y: number; w: number; h: number } {
  const m = Math.floor((3 + a.h * 0.6) / 2.2) + folga;
  return { x: a.x - m, y: a.chao - 2 - a.h - 1, w: m * 2 + 1, h: a.h + 4 };
}
export function arvoresAoVento(
  c: CanvasRenderingContext2D, base: CanvasImageSource, p: Paleta, lista: Arvore[], vento: number,
): void {
  lista.forEach((a) => {
    const r = retanguloDaArvore(a);
    c.drawImage(base, r.x, r.y, r.w, r.h, r.x, r.y, r.w, r.h);
  });
  lista.forEach((a) => pinheiro(c, p, a.x, a.chao, a.h, vento));
}

/** Casinha; devolve a boca da chaminé (onde a fumaça nasce). */
export function casa(c: Pincel, p: Paleta, x: number, chao: number): { x: number; y: number } {
  const h = 9;
  ponto(c, p.pedra, x + 10, chao - h - 9, 2, 5);
  ponto(c, p.parede, x, chao - h, 15, h);
  for (let r = 0; r < 6; r++) ponto(c, r % 2 ? p.telhadoLuz : p.telhado, x - 2 + r, chao - h - 1 - r, 19 - r * 2, 1);
  ponto(c, p.porta, x + 3, chao - 5, 3, 5);
  ponto(c, p.janela, x + 9, chao - 7, 3, 3);
  ponto(c, p.porta, x + 10, chao - 7, 1, 3);
  return { x: x + 11, y: chao - h - 10 };
}

export function ceu(c: Pincel, W: number, H: number, p: Paleta, semente = 7): void {
  const rnd = aleatorio(semente);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) ponto(c, faixa(p.ceu, y / (H * 0.7), x, y), x, y);
  if (p.estrela.length) for (let k = 0; k < W * 0.6; k++) ponto(c, p.estrela[k % 2], rnd() * W, rnd() * H * 0.55);
}

/** Faixa de nuvens com o dobro da largura, repetida: anda -50% e volta sem emenda. */
export function nuvens(c: Pincel, W: number, H: number, p: Paleta, semente = 11): void {
  const rnd = aleatorio(semente);
  const qtd = Math.max(3, Math.round(W / 45));
  const uma = (x0: number, y0: number, tam: number) => {
    const partes: [number, number, number][] = [[0, 0, tam], [tam * 0.9, -tam * 0.4, tam * 1.1], [tam * 2, 0, tam * 0.9], [tam * 1.1, tam * 0.3, tam]];
    partes.forEach(([dx, dy, r]) => circulo(c, p.nuvemSombra, x0 + dx, y0 + dy + 1, Math.round(r)));
    partes.forEach(([dx, dy, r]) => circulo(c, p.nuvem, x0 + dx, y0 + dy, Math.round(r)));
  };
  for (let i = 0; i < qtd; i++) {
    const x = (i / qtd) * W + rnd() * 20;
    const y = H * (0.15 + rnd() * 0.45);
    const tam = 2 + Math.round(rnd() * 3);
    uma(x, y, tam);
    uma(x + W, y, tam);
  }
}

/** Serra com pinheiros, casinha, riacho e flores. Devolve a chaminé em fração de W e H. */
export function paisagem(
  c: Pincel, W: number, H: number, p: Paleta, semente = 23, semArvores = false,
): { chamine: { fx: number; fy: number }; arvores: Arvore[] } {
  const rnd = aleatorio(semente);
  const lista: Arvore[] = [];
  const planta = (x: number, chao: number, h: number) => {
    lista.push({ x, chao, h });
    if (!semArvores) pinheiro(c, p, x, chao, h);
  };
  const longe = cume(W, H, 0.5, [[0.035, 1, 0.05], [0.09, 2, 0.02], [0.21, 0, 0.006]]);
  for (let x = 0; x < W; x++) {
    ponto(c, p.longe, x, longe[x], 1, H - longe[x]);
    ponto(c, p.longeLuz, x, longe[x]);
  }
  const perto = cume(W, H, 0.66, [[0.02, 0.5, 0.04], [0.07, 3, 0.015]]);
  for (let x = 0; x < W; x++) {
    ponto(c, p.perto, x, perto[x], 1, H - perto[x]);
    ponto(c, p.pertoLuz, x, perto[x], 1, 2);
  }
  // à direita, fora do cartão da questão (que ocupa o meio no computador)
  const xCasa = Math.round(W * (W < 140 ? 0.66 : 0.9));
  for (let x = 2; x < W - 2; x += 3 + Math.round(rnd() * 5)) {
    if ((x < xCasa - 4 || x > xCasa + 19) && rnd() > 0.35) planta(x, perto[x] + 3 + Math.round(rnd() * 3), 7 + Math.round(rnd() * 7));
  }
  const boca = casa(c, p, xCasa, perto[xCasa + 7] + 3);
  const y0 = Math.round(H * 0.84);
  for (let x = 0; x < W; x++) {
    const topo = y0 + Math.round(Math.sin(x * 0.3) * 0.8);
    ponto(c, p.grama, x, topo, 1, H - topo);
    ponto(c, p.gramaLuz, x, topo);
  }
  for (let y = y0 + 1; y < H; y++) {
    const d = y - y0;
    const cx = W * 0.3 + Math.sin(d * 0.2) * 3 + d * 0.8;
    const meia = 1 + d * 0.35;
    for (let x = Math.round(cx - meia); x <= Math.round(cx + meia); x++) ponto(c, (x * 3 + y * 5) % 11 === 0 ? p.aguaLuz : p.agua, x, y);
  }
  for (let k = 0; k < W * 1.2; k++) ponto(c, rnd() > 0.5 ? p.gramaLuz : p.gramaEscura, rnd() * W, y0 + 2 + rnd() * (H - y0 - 2));
  for (let k = 0; k < W * 0.3; k++) ponto(c, p.flores[k % 3], rnd() * W, y0 + 3 + rnd() * (H - y0 - 4));
  planta(4, H + 1, 16);
  planta(10, H + 2, 12);
  planta(W - 6, H + 1, 15);
  return { chamine: { fx: boca.x / W, fy: boca.y / H }, arvores: lista };
}

/** Anéis concêntricos com luz no centro e grão de papel (jeito BibleProject, sem as caveiras). */
export function aneis(c: Pincel, W: number, H: number, p: PaletaAneis, cx: number, cy: number, r0: number, larg: number, semente = 9): void {
  const rnd = aleatorio(semente);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - cx, (y - cy) * 1.05);
      let cor: string;
      if (d < r0) cor = faixa(p.luz, d / r0, x, y);
      else {
        const k = (d - r0) / larg;
        const i = Math.min(Math.floor(k), p.aneis.length - 1);
        cor = k % 1 < 0.12 && i < 4 ? p.linha : p.aneis[i];
      }
      ponto(c, cor, x, y);
    }
  }
  for (let k = 0; k < W * H * 0.03; k++) ponto(c, rnd() > 0.5 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)', rnd() * W, rnd() * H);
}

/** Sol ou lua num quadradinho (2r+3 de lado). */
export function astro(c: Pincel, p: Paleta, r: number, lua: boolean): void {
  const m = r + 1;
  if (lua) {
    circulo(c, p.astro, m, m, r);
    ponto(c, p.astroBorda, m - 1, m - 1, 2, 2);
    ponto(c, p.astroBorda, m + 2, m + 1);
  } else {
    circulo(c, p.astroBorda, m, m, r + 1);
    circulo(c, p.astro, m, m, r);
  }
}
