import { describe, expect, test } from 'vitest';
import { faltaTextoBase } from './prompts';

describe('faltaTextoBase', () => {
  test('comando que aponta para um trecho que não veio', () => {
    expect(faltaTextoBase('Esse trecho da resenha de um livro de entrevistas inéditas de Federico García Lorca tem por finalidade...')).toBe(true);
    expect(faltaTextoBase('Sinhá [trecho da canção] Esse fragmento da letra da canção, empregado na situação retratada, só é relevante porque')).toBe(true);
  });

  test('trecho citado no próprio enunciado não conta como falta', () => {
    expect(faltaTextoBase('No trecho "O governo anunciou o pacote de medidas. Essas ações visam combater a inflação", o pronome "essas" exerce função de:')).toBe(false);
    expect(faltaTextoBase('Leia o trecho: "O sertanejo é, antes de tudo, um forte." No contexto da obra, essa afirmação')).toBe(false);
  });

  test('enunciado longo traz o texto junto', () => {
    const longo = `${'A história do futebol brasileiro contém registros de episódios racistas. '.repeat(6)}O texto atribui o enfraquecimento do mito a`;
    expect(faltaTextoBase(longo)).toBe(false);
  });

  test('questão sem referência a texto', () => {
    expect(faltaTextoBase('Na tabela periódica, os elementos do grupo 1 são chamados de:')).toBe(false);
  });
});
