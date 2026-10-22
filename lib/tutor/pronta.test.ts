import { describe, expect, test } from 'vitest';
import { repeteAQuestao, problemasDaExplicacao } from './pronta';
import type { Explicacao } from './validar';
describe('repeteAQuestao', () => {
  const enunciado = 'Durante a respiração celular aeróbia, a maior produção de ATP ocorre em qual etapa?';
  test('a mesma pergunta com outras palavras conta como repetida', () => {
    expect(repeteAQuestao('Qual etapa da respiração aeróbia gera mais ATP?', enunciado)).toBe(true);
  });
  test('pergunta parecida de outro assunto não conta', () => {
    expect(repeteAQuestao('Na replicação do DNA, quantas fitas servem de molde?', enunciado)).toBe(false);
  });
});
describe('problemasDaExplicacao', () => {
  const passo = (titulo: string, visual: Explicacao['passos'][number]['visual'] = null) => ({ titulo, texto: 'Ok.', visual });
  test('questão de conta sem quadro nem "Por que funciona" é marcada', () => {
    const e: Explicacao = { ideia: 'Ok.', pecas: [], seuErro: null, passos: [passo('A pergunta'), passo('A resposta')], checagem: null };
    const p = problemasDaExplicacao(e, 'Quanto é 2 + 2?', 'Matemática');
    expect(p).toEqual(expect.arrayContaining(['só 2 passos numa questão com conta', 'sem o quadro do jeito rápido', 'sem o passo "Por que funciona"', 'sem "Sua vez"']));
  });
});
