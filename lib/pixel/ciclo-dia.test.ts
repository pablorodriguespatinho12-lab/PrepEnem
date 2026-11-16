import { describe, expect, it } from 'vitest';
import { quantoDeNoite } from './ciclo-dia';

// O relógio do dia e da noite (16/11/2026) tem que repetir o antigo @keyframes mp-noite.
describe('quanto de noite no ciclo', () => {
  it('dia cheio de manhã, noite cheia depois do anoitecer', () => {
    expect(quantoDeNoite(0.12)).toBe(0);
    expect(quantoDeNoite(0.6)).toBe(1);
  });
  it('anoitece aos poucos entre 44% e 54% do ciclo', () => {
    expect(quantoDeNoite(0.49)).toBeCloseTo(0.5, 5);
  });
  it('a volta do ciclo emenda sem pulo', () => {
    expect(quantoDeNoite(1)).toBeCloseTo(quantoDeNoite(0), 5);
    expect(quantoDeNoite(1.6)).toBe(1);
  });
});
