import { describe, expect, test } from 'vitest';
import { diasDoGrafico } from './evolucao-diaria';

const HOJE = new Date('2026-10-21T15:00:00Z');

describe('diasDoGrafico', () => {
  test('devolve um dia por data, até hoje, mesmo sem resposta', () => {
    const dias = diasDoGrafico({}, HOJE, 30);
    expect(dias).toHaveLength(30);
    expect(dias[0].data).toBe('22/09');
    expect(dias[29].data).toBe('21/10');
    expect(dias.every((d) => d.acertos === 0 && d.erros === 0)).toBe(true);
  });

  test('separa acertos e erros do dia, sem porcentagem', () => {
    const dias = diasDoGrafico({ '2026-10-18': { total: 3, acertos: 1 } }, HOJE, 30);
    const dia = dias.find((d) => d.data === '18/10');
    expect(dia).toEqual({ data: '18/10', acertos: 1, erros: 2 });
  });

  test('ignora dia fora da janela', () => {
    const dias = diasDoGrafico({ '2026-08-01': { total: 5, acertos: 5 } }, HOJE, 30);
    expect(dias.reduce((s, d) => s + d.acertos, 0)).toBe(0);
  });
});
