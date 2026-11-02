import { describe, expect, test } from 'vitest';
import { nomeAutomatico } from './materias-com-questoes';

describe('nomeAutomatico', () => {
  test('uma matéria vira o próprio nome', () => {
    expect(nomeAutomatico(['Física'])).toBe('Física');
  });
  test('duas matérias ligadas por "e"', () => {
    expect(nomeAutomatico(['Matemática', 'Física'])).toBe('Matemática e Física');
  });
  test('quatro matérias dizem quantas sobram', () => {
    expect(nomeAutomatico(['Matemática', 'Física', 'Química', 'Biologia'])).toBe('Matemática, Física e mais 2');
  });
  test('sem matéria não fica vazio', () => {
    expect(nomeAutomatico([])).toBe('Prova');
  });
});
