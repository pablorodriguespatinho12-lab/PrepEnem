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
const SEPARADOR_DE_FRACAO = '|'; // peça "0 + 20|2" vira 0 + 20 em cima, traço, 2 embaixo
const SOBE_DA_BARRA = 0.5; // × tamanho: do traço até a linha de base do numerador
const DESCE_DA_BARRA = 0.55; // × tamanho: da linha de base da peça até a linha de base do denominador
const ALTURA_DA_BARRA = 0.32; // × tamanho: do chão da peça até o traço (eixo da conta)
const TAM_DA_FRACAO = 0.8; // numerador e denominador um pouco menores que a letra grande

const partirFracao = (s: string): [string, string] | null => {
  const i = s.indexOf(SEPARADOR_DE_FRACAO);
  return i > 0 && i < s.length - 1 ? [s.slice(0, i).trim(), s.slice(i + 1).trim()] : null;
};
const textoDaPeca = (s: string): string => {
  const f = partirFracao(s);
  return f ? (f[0].length > f[1].length ? f[0] : f[1]) : s;
};

const larguraDaPeca = (p: DesenhoEq['partes'][number], tam: number): number =>
  Math.max(textoDaPeca(p.s).length * tam * LARGURA_DO_SINAL * (partirFracao(p.s) ? TAM_DA_FRACAO : 1), (p.leg?.length ?? 0) * LARGURA_DA_LEGENDA) + FOLGA_ENTRE_PECAS;

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
    const fracao = partirFracao(p.s);
    const pecas: Desenho[] = fracao ? desenharFracao(fracao, meio, d.y, tam, cor, quando, larguras[i]) : [{ k: 'tx', x: meio, y: d.y, s: p.s, cor, tam, t: quando, ancora: 'middle' }];
    if (!p.leg) return pecas;
    // Legenda colada na própria peça: embaixo do denominador numa fração, embaixo da letra nas outras (aluno-do-zero, 24/11: "legenda longe da peça").
    const yLegenda = d.y + (fracao ? tam * DESCE_DA_BARRA : 0) + TAM_LEGENDA + 8;
    return [...pecas, { k: 'tx', x: meio, y: yLegenda, s: p.leg, cor: 'cinza', tam: TAM_LEGENDA, t: quando + SEGUNDOS_ATE_LEGENDA, ancora: 'middle' }];
  });
}

function desenharFracao([cima, baixo]: [string, string], meio: number, y: number, tam: number, cor: Cor, t: number, largura: number): Desenho[] {
  const menor = Math.round(tam * TAM_DA_FRACAO);
  const yBarra = y - tam * ALTURA_DA_BARRA;
  const meia = (largura - FOLGA_ENTRE_PECAS) / 2;
  return [
    { k: 'tx', x: meio, y: yBarra - tam * SOBE_DA_BARRA * 0.35, s: cima, cor, tam: menor, t, ancora: 'middle' },
    { k: 'linha', x1: meio - meia, y1: yBarra, x2: meio + meia, y2: yBarra, cor, t: t + 0.1, dur: 0.3 },
    { k: 'tx', x: meio, y: y + tam * DESCE_DA_BARRA * 0.8, s: baixo, cor, tam: menor, t: t + 0.2, ancora: 'middle' },
  ];
}
