// Motivo com as palavras do aluno (Pablo, 02/11/2026: "a desinformação" e "a
// falta de empatia", fora das 5 causas). Escrito, ele manda na tese e nos moldes.
import { describe, expect, test } from 'vitest';
import { meuMotivo, moldeDaFrase, moldeTese } from './receita';
import { CHAVE_RASCUNHO, lerRascunho, teseAutomatica } from './rascunho-receita';

const TEMA = 'O estigma associado às doenças mentais na sociedade brasileira';
const MEUS: [string, string] = ['A desinformação sobre as doenças mentais.', 'a falta de empatia da população'];

describe('motivos com as palavras do aluno', () => {
  test('o artigo do começo fica minúsculo e o ponto final sai', () => {
    expect(meuMotivo('A desinformação.')).toBe('a desinformação');
    expect(meuMotivo('  Brasil sem   verba ')).toBe('Brasil sem verba');
    expect(meuMotivo(undefined)).toBe('');
  });

  test('a tese usa os dois, com a contração do português', () => {
    expect(moldeTese(null, null, TEMA, MEUS)).toBe(
      'Esse estigma decorre, sobretudo, da desinformação sobre as doenças mentais e da falta de empatia da população.',
    );
  });

  test('um escrito e outro escolhido: cada lado segue o seu', () => {
    const tese = moldeTese('estigma', 'estado', TEMA, ['a desinformação', '']);
    expect(tese.startsWith('Esse estigma decorre, sobretudo, da desinformação e d')).toBe(true);
    expect(tese).not.toContain('[');
  });

  test('sem motivo escrito, a tese é a de antes', () => {
    expect(moldeTese('estigma', 'estado', TEMA, ['', ''])).toBe(moldeTese('estigma', 'estado', TEMA));
  });

  test('o molde do desenvolvimento 1 diz o motivo dele', () => {
    expect(moldeDaFrase('desenvolvimento1', 0, TEMA, 'estigma', 'estado', MEUS)).toContain('a desinformação sobre as doenças mentais');
    expect(moldeDaFrase('desenvolvimento2', 0, TEMA, null, null, MEUS)).toContain('a falta de empatia da população');
  });

  test('a tese automática sai com motivos só escritos, e não sai faltando um', () => {
    expect(teseAutomatica({ tema: TEMA, causaA: null, causaB: null, meusMotivos: MEUS })).not.toBe('');
    expect(teseAutomatica({ tema: TEMA, causaA: null, causaB: null, meusMotivos: ['a desinformação', ''] })).toBe('');
  });

  test('rascunho antigo, sem o campo, abre com os motivos vazios', () => {
    const salvo = JSON.stringify({ passo: 2, tema: TEMA, causaA: 'estigma', causaB: 'estado' });
    const armazenamento = { getItem: (k: string) => (k === CHAVE_RASCUNHO ? salvo : null), setItem: () => {}, removeItem: () => {} };
    expect(lerRascunho(armazenamento).meusMotivos).toEqual(['', '']);
  });
});
