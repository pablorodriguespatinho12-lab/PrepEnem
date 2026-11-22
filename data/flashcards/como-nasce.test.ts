import { describe, expect, test } from 'vitest';
import { CARTOES_COMO_NASCE } from './como-nasce';

describe('cartões "Como nasce a fórmula"', () => {
  test('são 10 e cada um pede o papel', () => {
    expect(CARTOES_COMO_NASCE).toHaveLength(10);
    for (const c of CARTOES_COMO_NASCE) expect(c.frente).toContain('papel');
  });

  test('o verso mostra o caso com números antes da letra, em até 6 linhas curtas', () => {
    for (const c of CARTOES_COMO_NASCE) {
      const linhas = c.verso.split('\n');
      expect(linhas.length).toBeGreaterThanOrEqual(3);
      expect(linhas.length).toBeLessThanOrEqual(6);
      expect(linhas.every((l) => l.length <= 110)).toBe(true);
      expect(/\d/.test(linhas[1] ?? '')).toBe(true);
      expect(linhas.slice(-2).join(' ')).toMatch(/[=:]/);
    }
  });

  test('frentes não se repetem e não há emoji', () => {
    expect(new Set(CARTOES_COMO_NASCE.map((c) => c.frente)).size).toBe(CARTOES_COMO_NASCE.length);
    for (const c of CARTOES_COMO_NASCE) expect(/\p{Extended_Pictographic}/u.test(c.frente + c.verso)).toBe(false);
  });
});
