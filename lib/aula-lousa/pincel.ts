// Pincéis para montar telas de lousa à mão (tabela, fração, linhas de texto). Usados pelas aulas
// do jeito do Pablo (data/lousas/*.ts). Tudo dado puro: quem valida é validar.ts.
import type { Cena, Cor, Desenho, Fala } from './tipos';

const SEGUNDOS_POR_LETRA = 1 / 15;
const PASSO_DO_TRACO = 1.4;
const LARGURA_DA_LETRA = 0.4; // mesma estimativa de do-robo.ts (em × tamanho)

export type Ancora = 'start' | 'middle' | 'end';

export const tx = (x: number, y: number, s: string, cor: Cor, tam: number, t: number, ancora: Ancora = 'middle'): Desenho =>
  ({ k: 'tx', x, y, s, cor, tam, t, ancora });

export const titulo = (s: string): Desenho => tx(200, 34, s, 'tinta', 26, 0.2);

/** Largura aproximada de um texto, em pixels da lousa. */
export const larguraDe = (s: string, tam: number): number => s.length * tam * LARGURA_DA_LETRA;

/** Frases do professor com o segundo em que cada uma entra (mesma conta de do-robo.ts). */
export function fala(...frases: string[]): Fala[] {
  let t = 0.3;
  return frases.map((f): Fala => {
    const par: Fala = [Math.round(t * 10) / 10, f];
    t += Math.max(2.2, f.length * SEGUNDOS_POR_LETRA + 0.8);
    return par;
  });
}

/** Fração desenhada: número em cima, traço, número embaixo. */
export function fracao(cx: number, y: number, cima: string, baixo: string, cor: Cor, tam: number, t: number): Desenho[] {
  const meia = Math.max(larguraDe(cima, tam), larguraDe(baixo, tam)) / 2 + 4;
  return [
    tx(cx, y - 8, cima, cor, tam, t),
    { k: 'linha', x1: cx - meia, y1: y, x2: cx + meia, y2: y, cor: 'tinta', t: t + 0.3, dur: 0.4 },
    tx(cx, y + tam * 0.85 + 4, baixo, cor, tam, t + 0.5),
  ];
}

/** Linhas de texto uma a uma, no mesmo espaçamento das outras telas (84 + 44 × i). */
export function linhas(titulin: string, itens: readonly (readonly [string, Cor, number])[], falaDaTela: Fala[]): Cena {
  return {
    tipo: 'lousa',
    fala: falaDaTela,
    desenho: [titulo(titulin), ...itens.map(([s, cor, tam], i) => tx(30, 84 + i * 44, s, cor, tam, 0.8 + i * PASSO_DO_TRACO, 'start'))],
  };
}

/** Setinha para cima: haste e as duas pontas da ponta, de baixo (yBaixo) para cima (yCima). */
export function setaParaCima(cx: number, yBaixo: number, yCima: number, cor: Cor, t: number): Desenho[] {
  const ponta = 7;
  return [
    { k: 'linha', x1: cx, y1: yBaixo, x2: cx, y2: yCima, cor, t, dur: 0.4 },
    { k: 'linha', x1: cx - ponta, y1: yCima + ponta, x2: cx, y2: yCima, cor, t: t + 0.4, dur: 0.2 },
    { k: 'linha', x1: cx + ponta, y1: yCima + ponta, x2: cx, y2: yCima, cor, t: t + 0.4, dur: 0.2 },
  ];
}
