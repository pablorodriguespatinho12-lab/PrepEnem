import { describe, expect, it } from 'vitest';
import { numerosSemOrigem } from './origem-dos-numeros';
import type { Cena, Desenho } from './tipos';

const conta = (...pecas: string[]): Desenho[] => pecas.map((s, i) => ({ k: 'tx', x: 100, y: 150, s, t: 0.6 + i * 0.5, ancora: 'middle' }));
const lousa = (desenho: Desenho[]): Cena => ({ tipo: 'lousa', fala: [], desenho });
const papel = (texto: string): Cena => ({ tipo: 'papel', fala: [], rotulo: 'A questão', texto });

describe('numerosSemOrigem (regra 19)', () => {
  it('acha o 5 de "5 × t × t" quando nenhuma tela diz de onde vem', () => {
    const cenas = [papel('Um objeto cai por 3 s.'), lousa(conta('5', '×', '3', '=', '15'))];
    expect(numerosSemOrigem(cenas).map((f) => f.numero)).toEqual(['5']);
  });

  it('aceita número da questão, resultado de conta anterior e 0 ou 1', () => {
    const cenas = [papel('Um carro anda 60 km em 3 h.'), lousa(conta('60', '÷', '3', '=', '20')), lousa(conta('20', '+', '1', '=', '21'))];
    expect(numerosSemOrigem(cenas)).toEqual([]);
  });

  it('o número só vale depois de aparecer: resultado da mesma conta não conta para a esquerda', () => {
    const cenas = [papel('Preço 100.'), lousa(conta('100', '×', '15', '=', '1500'))];
    expect(numerosSemOrigem(cenas).map((f) => f.numero)).toEqual(['15']);
  });

  it('milhar com espaço e decimal com vírgula são o mesmo número', () => {
    const cenas = [papel('Custa 1 200 reais, com 1,5 de taxa.'), lousa(conta('1200', '×', '1.5', '=', '1800'))];
    expect(numerosSemOrigem(cenas)).toEqual([]);
  });
});
