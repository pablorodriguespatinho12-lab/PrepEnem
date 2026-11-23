import { describe, expect, test } from 'vitest';
import { validarLousa } from '@/lib/aula-lousa/validar';
import { br, capaEPapelGeometria, contas, lousaGeometria } from '@/lib/aula-lousa/geometria';
import { FICHAS_GEOMETRIA } from './geometria';

const ficha = FICHAS_GEOMETRIA[0];
const aula = () => {
  const [capa, papel] = capaEPapelGeometria('Geometria Plana', 'Enunciado.', ['a', 'b']);
  return lousaGeometria(ficha, capa, papel);
};

describe('lousa de geometria (aspersor)', () => {
  test('a conta: diagonal 28 m e alcance 14 m (letra B da questão)', () => {
    expect(contas(ficha)).toEqual({ diagonal: 28, alcance: 14 });
    expect(br(14)).toBe('14');
    expect(br(1.4)).toBe('1,4');
  });

  test('o círculo que passa pelos cantos tem o raio de metade da diagonal (√2 de verdade)', () => {
    const { diagonal } = contas({ ...ficha, raiz2: Math.SQRT2 });
    expect(diagonal / 2).toBeCloseTo(ficha.lado * (Math.SQRT2 / 2), 2);
  });

  test('prova: a opção certa é o lado × √2', () => {
    const { prova, raiz2 } = ficha;
    expect(prova.opcoes[prova.certa]).toBe(`${br(prova.lado * raiz2)} m`);
    expect(prova.porque).toHaveLength(prova.opcoes.length);
  });

  test('passa inteira pelo porteiro, sem perder tela, e fala a conta certa', () => {
    const a = aula();
    const v = validarLousa(a);
    expect(v?.cenas).toHaveLength(a.cenas.length);
    const texto = JSON.stringify(v);
    expect(texto).toContain('D = 20 × 1,4 = 28 m');
    expect(texto).toContain('R = 28 ÷ 2 = 14 m');
  });

  test('toda tela de desenho tem a figura pequena no canto só na tela da equação', () => {
    const a = aula();
    const eq = a.cenas.find((c) => c.tipo === 'lousa' && c.desenho.some((d) => d.k === 'tx' && d.s === 'montando a conta'));
    expect(eq?.tipo === 'lousa' && eq.desenho.some((d) => d.k === 'caixa' && d.w === 48)).toBe(true);
  });
});
