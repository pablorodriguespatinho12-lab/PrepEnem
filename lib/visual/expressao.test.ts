import { describe, expect, test } from 'vitest';
import { compilarExpressao, exprParaLatex, tentarCompilar } from './expressao';

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

describe('exprParaLatex', () => {
  test('número vezes número mantém o ponto de multiplicação', () => {
    expect(exprParaLatex('10-10*0.5^x')).toBe('10-10\\cdot 0{,}5^x');
  });
  test('número vezes letra ou parêntese fica colado, como se escreve à mão', () => {
    expect(exprParaLatex('5*x+2')).toBe('5x+2');
    expect(exprParaLatex('5*(x-2)')).toBe('5(x-2)');
    expect(exprParaLatex('20*x-5*x^2')).toBe('20x-5x^2');
  });
  test('decimal com vírgula', () => {
    expect(exprParaLatex('1000*1.1^x')).toBe('1000\\cdot 1{,}1^x');
  });
});
describe('numeroLatex', () => {
  test('vírgula decimal sem o espaço do KaTeX', async () => {
    const { numeroLatex } = await import('./expressao');
    expect(numeroLatex(9.84375)).toBe('9{,}84');
    expect(numeroLatex(12)).toBe('12');
  });
});
