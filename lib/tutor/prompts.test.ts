import { describe, expect, test } from 'vitest';
import { faltaTextoBase, promptConversa } from './prompts';

describe('promptConversa com o que se sabe do aluno', () => {
  const q = { enunciado: 'Quanto é 2 + 2?', alternativas: { A: '3', B: '4', C: '5', D: '6', E: '7' }, respostaCorreta: 'B', respostaDada: 'A', materia: 'Matemática', subtema: 'Aritmética' };
  const historico = [{ papel: 'aluno' as const, texto: 'por quê?' }];

  test('erros repetidos e as palavras dele entram no prompt', () => {
    const p = promptConversa(q, 'resumo', historico, { errosNoAssunto: 4, suasPalavras: 'achei que somava 1' });
    expect(p).toContain('Errou 4 questões de Aritmética');
    expect(p).toContain('"achei que somava 1"');
  });

  test('um erro só e nada escrito: prompt igual ao de antes', () => {
    expect(promptConversa(q, 'resumo', historico, { errosNoAssunto: 1, suasPalavras: null })).toBe(promptConversa(q, 'resumo', historico));
  });
});

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
