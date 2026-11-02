import { describe, expect, test } from 'vitest';
// corrigirRedacao (v3, com trecho obrigatório) é testada em tests/redacao/correcao-v3.test.ts.
import { contarParagrafos, ehSobraDeDigitacao, notaC2, notaC3 } from './correcao';

const TEXTO = 'Introdução.\n\nDesenvolvimento um.\n\nDesenvolvimento dois.\n\nConclusão.';

describe('notaC2 e notaC3', () => {
  const rep = (produtivo: boolean, legitimado = true) => ({ trecho: 't', legitimado, pertinente: true, produtivo, comentario: '' });
  test('C2 segue partes embrionárias e o estado do repertório', () => {
    expect(notaC2(0, [rep(true)])).toBe(200);
    expect(notaC2(0, [rep(false)])).toBe(160);
    expect(notaC2(0, [rep(true, false)])).toBe(120);
    expect(notaC2(1, [rep(true)])).toBe(120);
    expect(notaC2(2, [rep(true)])).toBe(80);
  });

  test('C3 não passa do teto da evidência', () => {
    const p = (desenvolvida: boolean) => ({ numero: 1, ideia: '', desenvolvida, comentario: '' });
    expect(notaC3(200, [p(true), p(true)])).toBe(200);
    expect(notaC3(200, [p(true), p(true), p(false)])).toBe(160);
    expect(notaC3(200, [p(false), p(true)])).toBe(120);
  });

  test('conta parágrafos com uma ou duas quebras de linha', () => {
    expect(contarParagrafos(TEXTO)).toBe(4);
    expect(contarParagrafos('a\nb')).toBe(2);
  });
});

describe('sobra de digitação não é erro de português', () => {
  test('número grudado na palavra não conta (Pablo, 02/11/2026)', () => {
    expect(ehSobraDeDigitacao({ trecho: 'por uma desinformação1', correcao: 'por uma desinformação' })).toBe(true);
    expect(ehSobraDeDigitacao({ trecho: '2a sociedade', correcao: 'a sociedade' })).toBe(true);
  });
  test('erro de verdade continua contando', () => {
    expect(ehSobraDeDigitacao({ trecho: 'por que uma norma', correcao: 'porque uma norma' })).toBe(false);
    expect(ehSobraDeDigitacao({ trecho: 'desinformação1 e', correcao: 'da desinformação e' })).toBe(false);
    expect(ehSobraDeDigitacao({ trecho: 'Lei 10.216', correcao: 'Lei nº 10.216' })).toBe(false);
  });
});
