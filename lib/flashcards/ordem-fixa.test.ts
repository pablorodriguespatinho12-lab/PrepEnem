import { describe, expect, test } from 'vitest';
import { ordenarParaEstudo } from './ordem-fixa';

const cartoes = Array.from({ length: 24 }, (_, i) => ({ ordem: 23 - i, id: `c${23 - i}` }));

describe('ordem de estudo', () => {
  test('quartetos saem na ordem gravada, sempre', () => {
    for (let i = 0; i < 5; i++) {
      expect(ordenarParaEstudo(cartoes, '3. Onde cada um entra').map((c) => c.ordem)).toEqual([...Array(24).keys()]);
    }
  });
  test('não muda a lista original', () => {
    const antes = cartoes.map((c) => c.ordem);
    ordenarParaEstudo(cartoes, '3. Onde cada um entra');
    expect(cartoes.map((c) => c.ordem)).toEqual(antes);
  });
  test('outro baralho continua embaralhado (mesmos cartões)', () => {
    const saida = ordenarParaEstudo(cartoes, 'O que mais cai');
    expect([...saida].map((c) => c.ordem).sort((a, b) => a - b)).toEqual([...Array(24).keys()]);
  });
});
