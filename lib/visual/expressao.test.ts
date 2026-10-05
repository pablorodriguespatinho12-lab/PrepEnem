import { describe, expect, test } from 'vitest';
import { compilarExpressao, tentarCompilar } from './expressao';

const em = (fonte: string, x: number) => compilarExpressao(fonte)(x);

describe('compilarExpressao', () => {
  test('respeita precedência de soma, produto e potência', () => {
    expect(em('x^2 - 4', 3)).toBe(5);
    expect(em('2 + 3 * x', 2)).toBe(8);
    expect(em('(2 + 3) * x', 2)).toBe(10);
  });

  test('potência é associativa à direita e o menos unário vem depois dela', () => {
    expect(em('2^3^2', 0)).toBe(512);
    expect(em('-x^2', 3)).toBe(-9);
  });

  test('aceita multiplicação implícita', () => {
    expect(em('2x', 5)).toBe(10);
    expect(em('3(x+1)', 1)).toBe(6);
    expect(em('(x+1)(x-1)', 3)).toBe(8);
    expect(em('2pi', 0)).toBeCloseTo(2 * Math.PI);
  });

  test('aceita funções com e sem parênteses e nomes em português', () => {
    expect(em('sqrt(x)', 9)).toBe(3);
    expect(em('raiz(x)', 16)).toBe(4);
    expect(em('sen(x)', Math.PI / 2)).toBeCloseTo(1);
    expect(em('2sin x', Math.PI / 2)).toBeCloseTo(2);
  });

  test('ignora o lado esquerdo de "y =" e "f(x) ="', () => {
    expect(em('y = x + 1', 1)).toBe(2);
    expect(em('f(x) = x^2', 4)).toBe(16);
  });

  test('aceita vírgula decimal e ** como potência', () => {
    expect(em('0,5x', 4)).toBe(2);
    expect(em('x**3', 2)).toBe(8);
  });

  test('recusa expressão gigante antes de montar recursão funda', () => {
    expect(() => compilarExpressao('('.repeat(150) + 'x' + ')'.repeat(150))).toThrow('longa');
    expect(() => compilarExpressao(Array(80).fill('x').join('+'))).toThrow('longa');
    expect(tentarCompilar('-'.repeat(300) + 'x')).toBeNull();
  });

  test('recusa código e nomes desconhecidos em vez de executar', () => {
    expect(() => compilarExpressao('alert(1)')).toThrow();
    expect(() => compilarExpressao('x; process.exit()')).toThrow();
    expect(() => compilarExpressao('x +')).toThrow();
    expect(tentarCompilar('constructor')).toBeNull();
  });
});
