import { describe, expect, test } from 'vitest';
import { limparExplicacaoAntiga } from './explicacao-antiga';
describe('limparExplicacaoAntiga', () => {
  test('tira emojis e mantém o texto', () => {
    expect(limparExplicacaoAntiga('📚 CONTEXTO: A fórmula.\n\n✅ RESOLUÇÃO: H₂O.')).toBe('CONTEXTO: A fórmula.\n\nRESOLUÇÃO: H₂O.');
  });
  test('texto sem emoji fica igual', () => {
    expect(limparExplicacaoAntiga('Sem nada de mais.')).toBe('Sem nada de mais.');
  });
});
