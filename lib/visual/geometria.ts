// Contas do desenho, separadas do componente para poderem ser testadas:
// amostragem da função, faixa automática do eixo y e marcas "redondas".

import type { Funcao } from './expressao';

export const AMOSTRAS = 240;

/* Pontos da função no intervalo. Quebra o traço (null) onde a função não
   existe ou dá salto de assíntota, para não ligar +∞ a −∞ com uma reta. */
export function amostrar(f: Funcao, [x0, x1]: [number, number], alturaFaixa: number): ({ x: number; y: number } | null)[] {
  const saida: ({ x: number; y: number } | null)[] = [];
  let anterior: number | null = null;
  for (let i = 0; i <= AMOSTRAS; i++) {
    const x = x0 + ((x1 - x0) * i) / AMOSTRAS;
    const y = f(x);
    if (!Number.isFinite(y) || (anterior !== null && Math.abs(y - anterior) > alturaFaixa * 4)) {
      saida.push(null);
      anterior = Number.isFinite(y) ? y : null;
      continue;
    }
    saida.push({ x, y });
    anterior = y;
  }
  return saida;
}

/* Faixa de y quando a IA não mandou: cobre os valores, ignorando os 5% de
   cada ponta (assíntotas) e sempre incluindo o zero se estiver perto. */
export function faixaAutomatica(valores: number[]): [number, number] {
  const finitos = valores.filter(Number.isFinite).sort((a, b) => a - b);
  if (finitos.length === 0) return [-5, 5];
  const corte = Math.floor(finitos.length * 0.05);
  let min = finitos[corte];
  let max = finitos[finitos.length - 1 - corte];
  if (min > 0 && min < (max - min) * 0.5) min = 0;
  if (max < 0 && -max < (max - min) * 0.5) max = 0;
  if (max - min < 1e-9) { min -= 1; max += 1; }
  const folga = (max - min) * 0.1;
  return [min - folga, max + folga];
}

/* Marcas do eixo em passos de 1, 2 ou 5 × 10^k, umas 6 a 10 no total. */
export function marcas([a, b]: [number, number], alvo = 8): number[] {
  const bruto = (b - a) / alvo;
  const potencia = Math.pow(10, Math.floor(Math.log10(bruto)));
  const passo = [1, 2, 5, 10].map((m) => m * potencia).find((p) => (b - a) / p <= alvo) ?? 10 * potencia;
  const saida: number[] = [];
  for (let v = Math.ceil(a / passo) * passo; v <= b + passo * 1e-9; v += passo) {
    saida.push(Math.abs(v) < passo * 1e-9 ? 0 : Number(v.toPrecision(12)));
  }
  return saida;
}

const PASSO_PISTA = 5;
const AMOSTRAS_CENA = 40;
/* Pista da cena: do menor ao maior valor que algum veículo atinge no relógio
   (o topo da bola fica no meio, não nas pontas), sempre com o zero, em
   múltiplos de 5 para as marcas saírem redondas. */
export function faixaDaCena(funcoes: Funcao[], [x0, x1]: [number, number]): [number, number] {
  const valores = funcoes.flatMap((f) =>
    Array.from({ length: AMOSTRAS_CENA + 1 }, (_, i) => f(x0 + ((x1 - x0) * i) / AMOSTRAS_CENA)))
    .filter(Number.isFinite);
  const min = Math.floor(Math.min(0, ...valores) / PASSO_PISTA) * PASSO_PISTA;
  const max = Math.ceil(Math.max(0, ...valores) / PASSO_PISTA) * PASSO_PISTA;
  return [min, max > min ? max : min + PASSO_PISTA];
}
