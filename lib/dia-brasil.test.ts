import { describe, expect, test } from 'vitest';
import { diaNoBrasil, diasEntre, proximaSequencia } from './dia-brasil';

describe('diaNoBrasil', () => {
  test('22h de Brasília ainda é o mesmo dia (em UTC já virou)', () => {
    expect(diaNoBrasil(new Date('2026-10-05T01:30:00Z'))).toBe('2026-10-04');
  });

  test('meio-dia fica no próprio dia', () => {
    expect(diaNoBrasil(new Date('2026-10-05T15:00:00Z'))).toBe('2026-10-05');
  });
});

describe('diasEntre', () => {
  test('22h de um dia e 20h do seguinte é 1 dia, não 0', () => {
    expect(diasEntre(new Date('2026-10-05T01:00:00Z'), new Date('2026-10-05T23:00:00Z'))).toBe(1);
  });
});

describe('proximaSequencia', () => {
  const agora = new Date('2026-10-05T15:00:00Z');

  test('primeiro estudo começa em 1', () => {
    expect(proximaSequencia(null, 0, agora)).toBe(1);
  });

  test('mesmo dia mantém', () => {
    expect(proximaSequencia(new Date('2026-10-05T12:00:00Z'), 4, agora)).toBe(4);
  });

  test('dia seguinte soma', () => {
    expect(proximaSequencia(new Date('2026-10-04T12:00:00Z'), 4, agora)).toBe(5);
  });

  test('pulou um dia recomeça em 1', () => {
    expect(proximaSequencia(new Date('2026-10-02T12:00:00Z'), 4, agora)).toBe(1);
  });
});
