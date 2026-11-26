import { describe, expect, it } from 'vitest';
import { datasDaSemana } from './datas-da-semana';

describe('datasDaSemana', () => {
  it('monta segunda a domingo da semana de uma quinta', () => {
    const r = datasDaSemana(new Date('2026-11-26T20:00:00Z'));
    expect(r.hoje).toBe(4);
    expect(r.datas).toEqual([29, 23, 24, 25, 26, 27, 28]);
  });

  it('usa o dia de Brasília e vira o mês', () => {
    // 01/12 01:00 UTC ainda é 30/11 (segunda) em Brasília.
    const r = datasDaSemana(new Date('2026-12-01T01:00:00Z'));
    expect(r.hoje).toBe(1);
    expect(r.datas).toEqual([6, 30, 1, 2, 3, 4, 5]);
  });
});
