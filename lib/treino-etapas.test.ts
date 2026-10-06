import { describe, expect, test } from 'vitest';
import { cotasDoDia, ehExemploResolvido, montarEscada, etapaDaQuestao, ordenarPorEtapa, RESOLVIDAS_POR_MATERIA } from './treino-etapas';

const q = (materia: string, nivel = 'facil', extra: Record<string, unknown> = {}) => ({ id: Math.random().toString(), materia, nivel, ...extra });

describe('ehExemploResolvido', () => {
  test('as primeiras de cada matéria vêm resolvidas, contadas por matéria', () => {
    const sessao = [
      ...Array.from({ length: 6 }, () => q('Português')),
      ...Array.from({ length: 6 }, () => q('Matemática')),
    ];
    const resolvidas = sessao.map((_, i) => ehExemploResolvido(sessao, i));
    expect(resolvidas.slice(0, 6)).toEqual([true, true, true, true, true, false]);
    expect(resolvidas.slice(6)).toEqual([true, true, true, true, true, false]);
    expect(RESOLVIDAS_POR_MATERIA).toBe(5);
  });

  test('questão do ENEM e do nível acima nunca vem resolvida', () => {
    const sessao = [q('Química', 'modelo_enem'), q('Química', 'acima'), q('Química')];
    expect(sessao.map((_, i) => ehExemploResolvido(sessao, i))).toEqual([false, false, true]);
  });

  test('índice fora da lista não quebra', () => {
    expect(ehExemploResolvido([], 3)).toBe(false);
  });
});

describe('etapaDaQuestao', () => {
  test('nível acima tem etapa própria, mesmo com ano de prova', () => {
    expect(etapaDaQuestao({ nivel: 'acima' })).toBe('acima');
    expect(etapaDaQuestao({ nivel: 'acima', anoProva: 2020 })).toBe('acima');
    expect(etapaDaQuestao({ anoProva: 2022 })).toBe('enem');
  });
});

describe('ordenarPorEtapa', () => {
  test('fáceis primeiro, depois médias, depois ENEM', () => {
    const lista = [
      q('Matemática', 'medio', { id: 'm' }),
      q('Matemática', 'facil', { id: 'f', anoProva: 2020 }),
      q('Matemática', 'facil', { id: 'b' }),
      q('Matemática', 'acima', { id: 'a' }),
    ];
    expect(ordenarPorEtapa(lista).map((x) => x.id)).toEqual(['b', 'm', 'f', 'a']);
  });
});

describe('cotasDoDia', () => {
  test('10 de cada: matérias do cronograma, depois Português e Matemática', () => {
    expect(cotasDoDia(['Física', 'Química'])).toEqual([
      { materia: 'Física', quantidade: 10 },
      { materia: 'Química', quantidade: 10 },
      { materia: 'Português', quantidade: 10 },
      { materia: 'Matemática', quantidade: 10 },
    ]);
  });
  test('Matemática no cronograma não aparece duas vezes', () => {
    expect(cotasDoDia(['Matemática', 'Biologia'])).toEqual([
      { materia: 'Biologia', quantidade: 10 },
      { materia: 'Português', quantidade: 10 },
      { materia: 'Matemática', quantidade: 10 },
    ]);
  });
});

describe('montarEscada com 10 questões', () => {
  test('mantém a proporção: fáceis, médias e ENEM, nessa ordem', () => {
    const banco = [
      ...Array.from({ length: 8 }, (_, i) => q('Física', 'facil', { id: `f${i}` })),
      ...Array.from({ length: 8 }, (_, i) => q('Física', 'medio', { id: `m${i}` })),
      ...Array.from({ length: 8 }, (_, i) => q('Física', 'medio', { id: `e${i}`, anoProva: 2020 })),
    ];
    const etapas = montarEscada(banco, [], 10).map((x) => etapaDaQuestao(x));
    expect(etapas).toEqual(['base', 'base', 'base', 'intermediaria', 'intermediaria', 'intermediaria', 'intermediaria', 'enem', 'enem', 'enem']);
  });
});
