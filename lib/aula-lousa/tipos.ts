// Aula de lousa (jeito Universo Narrado, aprovada pelo Pablo em 20/11/2026): a questão
// real abre a aula, cada ferramenta entra quando a questão pede e a lousa se desenha
// sozinha enquanto o professor de pixel fala. É DADO (JSON), nunca HTML: o React escapa o
// texto e o validador (validar.ts) corta tudo o que não for desta lista.

/** Tela da lousa: 400 de largura por 280 de altura. */
export const LARGURA = 400;
export const ALTURA = 280;

/** Frase do professor: [segundo em que aparece, texto]. */
export type Fala = [number, string];

export const CORES = ['tinta', 'azul', 'vermelho', 'verde', 'amarelo', 'cinza', 'rosa', 'verdeClaro'] as const;
export type Cor = (typeof CORES)[number];

export type Ancora = 'start' | 'middle' | 'end';

/** O que se desenha na lousa. `t` é o segundo em que o traço começa. */
export type Desenho =
  | { k: 'tx'; x: number; y: number; s: string; cor?: Cor; tam?: number; t: number; ancora?: Ancora }
  | { k: 'hl'; x: number; y: number; w: number; h: number; t: number; cor?: Cor }
  | { k: 'linha'; x1: number; y1: number; x2: number; y2: number; cor?: Cor; t: number; dur?: number }
  | { k: 'circ'; cx: number; cy: number; r: number; cor?: Cor; t: number }
  | { k: 'caixa'; x: number; y: number; w: number; h: number; cor?: Cor; t: number; dur?: number }
  | { k: 'caminho'; d: string; cor?: Cor; t: number; dur?: number; larg?: number }
  /** Quadradinhos que aparecem um a um; `marcados` (índices) ficam em vermelho claro. */
  | { k: 'grade'; cols: number; rows: number; x0: number; y0: number; s: number; gap: number; t0: number; passo: number; marcados?: number[] };

/** Pedido de equação com legenda embaixo de cada peça. Só entra no validador, que o troca por `tx`. */
export interface DesenhoEq {
  k: 'eq';
  y: number;
  t: number;
  tam: number;
  partes: { s: string; leg?: string; cor?: Cor }[];
}

export type Cena =
  | { tipo: 'lousa'; fala: Fala[]; desenho: Desenho[] }
  /** A questão em papel, com o texto real do ENEM (ou da questão). */
  | { tipo: 'papel'; fala: Fala[]; rotulo: string; texto: string; alternativas?: string[] }
  /** "Prove você": o aluno escolhe e o professor diz por que cada letra está certa ou errada. */
  | { tipo: 'prova'; fala: Fala[]; pergunta: string; opcoes: string[]; certa: number; porque: string[] };

export interface AulaLousa {
  cenas: Cena[];
}
