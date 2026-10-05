import { describe, expect, test } from 'vitest';
import { concorda } from './verificar-respostas';

describe('concorda', () => {
  test('escolha: só concorda com o mesmo índice', () => {
    expect(concorda({ tipo: 'escolha', correta: 1 }, { indice: 1 })).toBe(true);
    expect(concorda({ tipo: 'escolha', correta: 1 }, { indice: 2 })).toBe(false);
    expect(concorda({ tipo: 'escolha', correta: 1 }, { valor: 1 })).toBe(false);
  });

  test('número: tolerância pequena; o caso real p(3) = 45 contra gabarito 39 discorda', () => {
    expect(concorda({ tipo: 'numero', valor: 45 }, { valor: 45 })).toBe(true);
    expect(concorda({ tipo: 'numero', valor: 39 }, { valor: 45 })).toBe(false);
    expect(concorda({ tipo: 'numero', valor: 3.5811, tolerancia: 0.001 }, { valor: 3.58114 })).toBe(true);
  });

  test('sem verificação não concorda', () => {
    expect(concorda({ tipo: 'numero', valor: 1 }, null)).toBe(false);
  });
});
