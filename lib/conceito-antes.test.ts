import { describe, expect, test } from 'vitest';
import { assuntoSemConceito, chaveAssunto } from './conceito-antes';

const q = (materia: string, subtema: string) => ({ materia, subtema });
const sessao = [q('Física', 'Cinemática'), q('Física', 'Cinemática'), q('Física', 'Eletricidade'), q('Física', 'Eletricidade'), q('Química', 'Mol')];
const cobertos = new Set([chaveAssunto('Física', 'Cinemática')]);

describe('assuntoSemConceito (Pablo, 15/10/2026: resistor sem revisão de conceito)', () => {
  test('primeira questão de assunto que a revisão não cobriu pede o conceito', () => {
    expect(assuntoSemConceito(sessao, 2, cobertos, new Set())).toEqual({ materia: 'Física', subtema: 'Eletricidade' });
  });
  test('assunto coberto pela revisão não pede', () => {
    expect(assuntoSemConceito(sessao, 0, cobertos, new Set())).toBeNull();
  });
  test('só a primeira questão do assunto: a segunda segue direto', () => {
    expect(assuntoSemConceito(sessao, 3, cobertos, new Set())).toBeNull();
  });
  test('conceito já visto não volta', () => {
    expect(assuntoSemConceito(sessao, 2, cobertos, new Set([chaveAssunto('Física', 'Eletricidade')]))).toBeNull();
  });
  test('maiúscula e espaço não fazem o assunto parecer outro', () => {
    expect(assuntoSemConceito(sessao, 2, new Set([chaveAssunto(' física ', 'ELETRICIDADE')]), new Set())).toBeNull();
  });
  test('questão sem subtema ou fora da lista não pede', () => {
    expect(assuntoSemConceito([q('Física', '')], 0, new Set(), new Set())).toBeNull();
    expect(assuntoSemConceito(sessao, 9, cobertos, new Set())).toBeNull();
  });
});
