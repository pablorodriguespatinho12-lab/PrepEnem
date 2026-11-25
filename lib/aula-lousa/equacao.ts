// Equação grande com micro legenda embaixo de cada peça (Pablo, 24/11/2026: "como as placas de
// estação de trem": A = H × V, e embaixo "aceleração", "altura", "velocidade"). Função pura:
// transforma o pedido `eq` em textos comuns da lousa, então o desenho e o resto não mudam.
import type { Cor, Desenho, DesenhoEq } from './tipos';

const LARGURA_DO_SINAL = 0.55; // × tamanho; mais larga que a estimativa de texto corrido, pois dígito e × são largos
const LARGURA_DA_LEGENDA = 8; // letra de 16 de tamanho
const TAM_LEGENDA = 16;
const FOLGA_ENTRE_PECAS = 16;
const FOLGA_DA_LISTA = 20;
const ALTURA_DA_LINHA_DA_LISTA = 24;
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

const larguraTotal = (partes: DesenhoEq['partes'], tam: number): number => partes.reduce((soma, p) => soma + larguraDaPeca(p, tam), 0);

/** Lado a lado, uma legenda cobriria a outra mesmo com a menor letra. */
export const legendasNaoCabem = (partes: DesenhoEq['partes']): boolean => larguraTotal(partes, TAM_MINIMO) > LARGURA_UTIL;

/** Legendas em lista, uma por linha ("c = comprimento, em metros"), para quando lado a lado uma cobriria a outra. */
function legendasEmLista(d: DesenhoEq, tam: number, extras: DesenhoEq['partes']): Desenho[] {
  const temFracao = d.partes.some((p) => partirFracao(p.s));
  const primeira = d.y + (temFracao ? tam * DESCE_DA_BARRA : 0) + TAM_LEGENDA + FOLGA_DA_LISTA;
  return [...d.partes, ...extras]
    .filter((p) => p.leg)
    .map((p, i): Desenho => ({
      k: 'tx', x: CENTRO, y: primeira + i * ALTURA_DA_LINHA_DA_LISTA, s: `${textoDaPeca(p.s)} = ${p.leg}`,
      cor: 'cinza', tam: TAM_LEGENDA, t: d.t + (d.partes.length + i) * SEGUNDOS_ENTRE_PECAS, ancora: 'middle',
    }));
}

export function expandirEquacao(d: DesenhoEq, opcoes: { emLista?: boolean; extras?: DesenhoEq['partes'] } = {}): Desenho[] {
  const emLista = !!opcoes.emLista && (legendasNaoCabem(d.partes) || !!opcoes.extras?.length);
  const partes = emLista ? d.partes.map((p) => ({ ...p, leg: undefined })) : d.partes;
  const tam = tamanhoQueCabe(partes, d.tam);
  const larguras = partes.map((p) => larguraDaPeca(p, tam));
  let x = CENTRO - larguras.reduce((a, b) => a + b, 0) / 2;
  const pecasDaEquacao = partes.flatMap((p, i): Desenho[] => {
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
  return emLista ? [...pecasDaEquacao, ...legendasEmLista(d, tam, opcoes.extras ?? [])] : pecasDaEquacao;
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
