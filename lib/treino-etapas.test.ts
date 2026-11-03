import { describe, expect, test } from 'vitest';
import { cotasDoDia, ehExemploResolvido, montarEscada, etapaDaQuestao, isQuestaoEnem, ordenarPorEtapa, RESOLVIDAS_POR_MATERIA } from './treino-etapas';

const q = (materia: string, nivel = 'facil', extra: Record<string, unknown> = {}) => ({ id: Math.random().toString(), materia, nivel, ...extra });

describe('ehExemploResolvido', () => {
  test('as primeiras de cada matéria vêm resolvidas, contadas por matéria', () => {
    const sessao = [
      ...Array.from({ length: 4 }, () => q('Português')),
      ...Array.from({ length: 4 }, () => q('Matemática')),
    ];
    const resolvidas = sessao.map((_, i) => ehExemploResolvido(sessao, i));
    expect(resolvidas.slice(0, 4)).toEqual([true, true, true, false]);
    expect(resolvidas.slice(4)).toEqual([true, true, true, false]);
    expect(RESOLVIDAS_POR_MATERIA).toBe(3);
  });

  test('questão do ENEM e do nível acima nunca vem resolvida', () => {
    const sessao = [q('Química', 'medio', { anoProva: 2022 }), q('Química', 'acima'), q('Química')];
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
    // Questão real de vestibular nunca vira âncora do ENEM, mesmo com ano.
    expect(etapaDaQuestao({ nivel: 'vestibular', origem: 'ITA 2025', anoProva: 2025 })).toBe('vestibular');
    expect(isQuestaoEnem({ nivel: 'vestibular', anoProva: 2025 })).toBe(false);
  });
  test('4 níveis: real é sempre ENEM; modelo_enem e adaptada nunca são', () => {
    expect(etapaDaQuestao({ nivel: 'facil', anoProva: 2021 })).toBe('enem');
    expect(etapaDaQuestao({ nivel: 'medio', origem: 'ENEM 2022 D1' })).toBe('enem');
    expect(etapaDaQuestao({ nivel: 'modelo_enem', dificuldade: 'dificil', origem: 'Manual' })).toBe('dificil');
    expect(etapaDaQuestao({ nivel: 'medio', origem: 'ENEM adaptado' })).toBe('medio');
    expect(etapaDaQuestao({ nivel: 'facil' })).toBe('facil');
    expect(etapaDaQuestao({ dificuldade: 'dificil' })).toBe('dificil');
    expect(etapaDaQuestao({ dificuldade: 'medio' })).toBe('medio');
  });
});

describe('ordenarPorEtapa', () => {
  test('fáceis, médias, difíceis, ENEM e acima, nessa ordem', () => {
    const lista = [
      q('Matemática', 'medio', { id: 'm' }),
      q('Matemática', 'facil', { id: 'f', anoProva: 2020 }),
      q('Matemática', 'facil', { id: 'b' }),
      q('Matemática', 'acima', { id: 'a' }),
      q('Matemática', 'modelo_enem', { id: 'd' }),
    ];
    expect(ordenarPorEtapa(lista).map((x) => x.id)).toEqual(['b', 'm', 'd', 'f', 'a']);
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
  const banco = (difíceis: number, enem: number) => [
    ...Array.from({ length: 8 }, (_, i) => q('Física', 'facil', { id: `f${i}` })),
    ...Array.from({ length: 8 }, (_, i) => q('Física', 'medio', { id: `m${i}` })),
    ...Array.from({ length: difíceis }, (_, i) => q('Física', 'modelo_enem', { id: `d${i}` })),
    ...Array.from({ length: enem }, (_, i) => q('Física', 'medio', { id: `e${i}`, anoProva: 2020 })),
  ];
  test('2 fáceis, 3 médias, 2 difíceis e 3 do ENEM, nessa ordem', () => {
    const etapas = montarEscada(banco(8, 8), [], 10).map((x) => etapaDaQuestao(x));
    expect(etapas).toEqual(['facil', 'facil', 'medio', 'medio', 'medio', 'dificil', 'dificil', 'enem', 'enem', 'enem']);
  });
  test('sem difícil nem ENEM, completa com médias e ainda dá 10', () => {
    const etapas = montarEscada(banco(0, 0), [], 10).map((x) => etapaDaQuestao(x));
    expect(etapas).toHaveLength(10);
    expect(etapas.filter((e) => e === 'medio').length).toBe(8);
  });
  test('faltou ENEM: a difícil cobre antes da média', () => {
    const etapas = montarEscada(banco(8, 1), [], 10).map((x) => etapaDaQuestao(x));
    expect(etapas.filter((e) => e === 'dificil').length).toBe(4);
    expect(etapas.filter((e) => e === 'enem').length).toBe(1);
  });
});
