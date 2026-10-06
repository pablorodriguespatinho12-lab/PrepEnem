import { describe, expect, test } from 'vitest';
import { amostrar, faixaAutomatica, faixaDaCena, marcas } from './geometria';

describe('amostrar', () => {
  test('quebra o traço na assíntota de 1/x', () => {
    const pts = amostrar((x) => 1 / x, [-2, 2], 10);
    expect(pts.some((p) => p === null)).toBe(true);
  });

  test('não quebra uma parábola', () => {
    expect(amostrar((x) => x * x, [-2, 2], 4).every((p) => p !== null)).toBe(true);
  });
});

describe('faixaAutomatica', () => {
  test('inclui o zero quando está perto e dá folga', () => {
    const [min, max] = faixaAutomatica([1, 2, 3, 4]);
    expect(min).toBeLessThanOrEqual(0);
    expect(max).toBeGreaterThan(4);
  });

  test('função constante ainda tem altura', () => {
    const [min, max] = faixaAutomatica([3, 3, 3]);
    expect(max - min).toBeGreaterThan(1);
  });
});

describe('marcas', () => {
  test('usa passos redondos e inclui o zero', () => {
    expect(marcas([-4, 4])).toEqual([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
    expect(marcas([0, 100])).toEqual([0, 20, 40, 60, 80, 100]);
  });
});

describe('faixaDaCena', () => {
  test('parábola da bola: o topo do meio entra, não só as pontas', () => {
    expect(faixaDaCena([(x) => 20 * x - 5 * x * x], [0, 4])).toEqual([0, 20]);
  });
  test('valores negativos abrem a pista para trás, em múltiplos de 5', () => {
    expect(faixaDaCena([(x) => 5 * x, (x) => 5 * (x - 2)], [0, 6])).toEqual([-10, 30]);
  });
  test('sempre inclui o zero e arredonda o topo', () => {
    expect(faixaDaCena([(x) => 2 ** x], [0, 5])).toEqual([0, 35]);
  });
});
