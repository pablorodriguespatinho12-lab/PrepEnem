import { describe, expect, test } from 'vitest';
import { CORINGAS } from './autores';
import { exemplosDoCoringa, PERGUNTA_DO_CORINGA } from './exemplos-coringas';

const TEMA_DO_ALUNO = 'O estigma associado às doenças mentais na sociedade brasileira';

describe('exemplos dos coringas', () => {
  test.each(Object.keys(CORINGAS))('%s: pergunta e pelo menos 3 exemplos em temas diferentes do do aluno', (nome) => {
    expect(PERGUNTA_DO_CORINGA[nome]).toBeTruthy();
    const exemplos = exemplosDoCoringa(nome, TEMA_DO_ALUNO);
    expect(exemplos.length).toBeGreaterThanOrEqual(3);
    expect(exemplos.some((e) => e.tema === TEMA_DO_ALUNO)).toBe(false);
  });

  test.each(Object.keys(CORINGAS))('%s: as 3 partes recompõem um texto que traz o coringa na parte 1', (nome) => {
    const marca = nome === 'Dado 1888' ? '1888' : CORINGAS[nome].texto.slice(-12, -1);
    for (const e of exemplosDoCoringa(nome, '')) {
      expect(e.citacao).toContain(marca);
      expect(e.sentido.length).toBeGreaterThan(15);
      expect(e.ligacao.length).toBeGreaterThan(40);
    }
  });
});
