// Equação grande com micro legenda embaixo de cada peça (Pablo, 24/11/2026: "como as placas de
// estação de trem": A = H × V, e embaixo "aceleração", "altura", "velocidade"). Função pura:
// transforma o pedido `eq` em textos comuns da lousa, então o desenho e o resto não mudam.
import type { Cor, Desenho, DesenhoEq } from './tipos';

const LARGURA_DO_SINAL = 0.55; // × tamanho; mais larga que a estimativa de texto corrido, pois dígito e × são largos
const LARGURA_DA_LEGENDA = 8; // letra de 16 de tamanho
const TAM_LEGENDA = 16;
const FOLGA_ENTRE_PECAS = 16;
const LARGURA_UTIL = 380;
const TAM_MINIMO = 20;
const SEGUNDOS_ENTRE_PECAS = 0.5;
const SEGUNDOS_ATE_LEGENDA = 0.3;
const CENTRO = 200;

const larguraDaPeca = (p: DesenhoEq['partes'][number], tam: number): number =>
  Math.max(p.s.length * tam * LARGURA_DO_SINAL, (p.leg?.length ?? 0) * LARGURA_DA_LEGENDA) + FOLGA_ENTRE_PECAS;

/** Maior tamanho (até o pedido) em que a equação inteira cabe nos 380 de largura útil. */
export function tamanhoQueCabe(partes: DesenhoEq['partes'], pedido: number): number {
  for (let tam = pedido; tam > TAM_MINIMO; tam -= 2) {
    const total = partes.reduce((soma, p) => soma + larguraDaPeca(p, tam), 0);
    if (total <= LARGURA_UTIL) return tam;
  }
  return TAM_MINIMO;
}

export function expandirEquacao(d: DesenhoEq): Desenho[] {
  const tam = tamanhoQueCabe(d.partes, d.tam);
  const larguras = d.partes.map((p) => larguraDaPeca(p, tam));
  let x = CENTRO - larguras.reduce((a, b) => a + b, 0) / 2;
  return d.partes.flatMap((p, i): Desenho[] => {
    const meio = x + larguras[i] / 2;
    x += larguras[i];
    const quando = d.t + i * SEGUNDOS_ENTRE_PECAS;
    const cor: Cor = p.cor ?? 'tinta';
    const peca: Desenho = { k: 'tx', x: meio, y: d.y, s: p.s, cor, tam, t: quando, ancora: 'middle' };
    if (!p.leg) return [peca];
    return [peca, { k: 'tx', x: meio, y: d.y + TAM_LEGENDA + 8, s: p.leg, cor: 'cinza', tam: TAM_LEGENDA, t: quando + SEGUNDOS_ATE_LEGENDA, ancora: 'middle' }];
  });
}
