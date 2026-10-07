import { describe, expect, test } from 'vitest';
import { validarCartoesGerados } from './flashcards-gerados';

describe('validarCartoesGerados', () => {
  test('guarda o cartão curto e tira espaço', () => {
    expect(validarCartoesGerados({ cards: [{ frente: ' O que é mol? ', verso: '6,02 × 10²³ partículas', dica: '' }] }))
      .toEqual([{ frente: 'O que é mol?', verso: '6,02 × 10²³ partículas', dica: null }]);
  });

  test('verso longo (enumeração) sai; o resto fica', () => {
    const longo = { frente: 'Causas da Revolução Francesa?', verso: 'x'.repeat(201) };
    const curto = { frente: 'Ano da Revolução Francesa?', verso: '1789' };
    expect(validarCartoesGerados({ cards: [longo, curto] })).toHaveLength(1);
  });

  test('sem cartão aproveitável devolve null', () => {
    expect(validarCartoesGerados({ cards: [{ frente: 'só frente' }] })).toBeNull();
    expect(validarCartoesGerados('lixo')).toBeNull();
  });
});
