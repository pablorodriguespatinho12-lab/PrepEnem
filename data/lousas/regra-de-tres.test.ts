import { describe, expect, test } from 'vitest';
import { validarLousa } from '@/lib/aula-lousa/validar';
import { capaEPapel, lousaRegraDeTres, numeroDe, reduzida, xPelaProporcao } from '@/lib/aula-lousa/regra-de-tres';
import { FICHAS_REGRA_DE_TRES } from './regra-de-tres';

const RESPOSTA_EM_UNIDADE_DA_QUESTAO: Record<string, number> = {
  'd2-dificil-mat-06': 6, // dias
  'd2-facil-mat-07': 90, // pães
  'd2-medio-mat-06': 50, // minutos
  'd2-medio-mat-07': 3, // km
  'd2-reforco-mat-gra-01': 14, // km
  'd2-reforco-mat-gra-02': 8, // horas
};

const aulaDe = (i: number) => {
  const ficha = FICHAS_REGRA_DE_TRES[i];
  const [capa, papel] = capaEPapel('Grandezas e Medidas', 'Enunciado.', ['a', 'b']);
  return lousaRegraDeTres(ficha, capa, papel);
};

describe('fichas de regra de três (jeito do Pablo)', () => {
  test('são 6 e cada id aparece uma vez', () => {
    expect(FICHAS_REGRA_DE_TRES).toHaveLength(6);
    expect(new Set(FICHAS_REGRA_DE_TRES.map((f) => f.id)).size).toBe(6);
    expect(FICHAS_REGRA_DE_TRES.map((f) => f.id).sort()).toEqual(Object.keys(RESPOSTA_EM_UNIDADE_DA_QUESTAO).sort());
  });

  test.each(FICHAS_REGRA_DE_TRES.map((f, i) => [f.id, i] as const))('%s: x pela proporção é o x da ficha', (_id, i) => {
    const f = FICHAS_REGRA_DE_TRES[i];
    expect(xPelaProporcao(f)).toBeCloseTo(f.resposta, 6);
  });

  test('a resposta na unidade da questão bate com a letra certa', () => {
    for (const f of FICHAS_REGRA_DE_TRES) {
      const esperado = RESPOSTA_EM_UNIDADE_DA_QUESTAO[f.id];
      const emCm = ['d2-medio-mat-07', 'd2-reforco-mat-gra-01'].includes(f.id);
      expect(emCm ? f.resposta / 100000 : f.resposta).toBe(esperado);
    }
  });

  test.each(FICHAS_REGRA_DE_TRES.map((f, i) => [f.id, i] as const))('%s: o porteiro aceita todas as telas sem cortar nada', (_id, i) => {
    const aula = aulaDe(i);
    const v = validarLousa(aula);
    expect(v).not.toBeNull();
    expect(v!.cenas).toHaveLength(aula.cenas.length);
    expect(aula.cenas.length).toBeLessThanOrEqual(16);
    aula.cenas.forEach((c, n) => {
      const depois = v!.cenas[n];
      if (c.tipo === 'lousa' && depois.tipo === 'lousa') expect(depois.desenho).toHaveLength(c.desenho.length);
      expect(c.fala.reduce((s, f) => s + f[1].length, 0)).toBeLessThanOrEqual(300);
    });
  });

  test('a lousa traz a equação em frações e a tabela antes/agora', () => {
    const textos = (i: number) => JSON.stringify(aulaDe(i));
    expect(textos(1)).toContain('a equação em frações');
    expect(textos(1)).toContain('um embaixo do outro');
    expect(textos(1)).toContain('"s":"x"');
  });

  test('costureiras: as letras erradas vêm de contas que dão aqueles valores', () => {
    expect(5 * 2 * (6 / 8)).toBeCloseTo(7.5, 10); // esqueceu as costureiras
    expect(5 * 2 * (8 / 10)).toBeCloseTo(8, 10); // esqueceu as horas
    expect(5 * 2).toBe(10); // só as camisetas
    expect(5 * 2 * (10 / 8)).toBeCloseTo(12.5, 10); // costureiras como direta, sem as horas
    expect(8 * 6 * 5).toBe(240);
    expect(480 / (10 * 8)).toBe(6);
  });

  test('simplificação desenhada: sai quando há fração para reduzir e a equação volta com setas', () => {
    const titulos = (i: number) => aulaDe(i).cenas.flatMap((c) => (c.tipo === 'lousa' ? c.desenho.flatMap((d) => (d.k === 'tx' ? [d.s] : [])) : []));
    const costureiras = titulos(0);
    expect(costureiras).toContain('simplificando');
    expect(costureiras).toContain('a equação simplificada');
    expect(costureiras.filter((s) => s === 'inversa')).toHaveLength(2);
    expect(costureiras.filter((s) => s === 'direta')).toHaveLength(1);
    // 4/3 × 6/x = 1 não reduz nada: sem tela "simplificando", mas a equação volta com as setas.
    const torneiras = titulos(5);
    expect(torneiras).not.toContain('simplificando');
    expect(torneiras).toContain('a equação com as setas');
  });

  test('reduzida: só com inteiros e quando há o que reduzir', () => {
    expect(reduzida('8', '10')).toEqual({ cima: '4', baixo: '5', por: 2 });
    expect(reduzida('240', '480')).toEqual({ cima: '1', baixo: '2', por: 240 });
    expect(reduzida('50 000', 'x')).toBeNull();
    expect(reduzida('4', '3')).toBeNull();
  });

  test('números com espaço e vírgula viram número', () => {
    expect(numeroDe('50 000')).toBe(50000);
    expect(numeroDe('1,5')).toBe(1.5);
  });
});
