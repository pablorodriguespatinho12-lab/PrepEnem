import { afterEach, describe, expect, test } from 'vitest';
import { modelosEmOrdem } from './ia-modelos';

describe('modelosEmOrdem', () => {
  afterEach(() => {
    delete process.env.IA_RESERVAS_QUE_TREINAM;
    delete process.env.MISTRAL_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  test('sem o gerador ligar, a Mistral não entra (conversa do aluno fica na Groq)', () => {
    process.env.MISTRAL_API_KEY = 'chave';
    expect(modelosEmOrdem('openai/gpt-oss-120b').some((m) => m?.startsWith('mistral:'))).toBe(false);
  });

  test('com o gerador ligado e a chave, a Mistral vem logo depois do principal', () => {
    process.env.MISTRAL_API_KEY = 'chave';
    process.env.IA_RESERVAS_QUE_TREINAM = '1';
    const ordem = modelosEmOrdem('openai/gpt-oss-120b');
    expect(ordem.slice(0, 2)).toEqual(['openai/gpt-oss-120b', 'mistral:mistral-medium-latest']);
  });

  test('o Gemini não é reserva do gerador, mesmo com a chave e o gerador ligado', () => {
    process.env.GEMINI_API_KEY = 'g';
    process.env.MISTRAL_API_KEY = 'm';
    process.env.IA_RESERVAS_QUE_TREINAM = '1';
    const ordem = modelosEmOrdem('openai/gpt-oss-120b');
    expect(ordem.some((m) => m?.startsWith('gemini:'))).toBe(false);
    expect(ordem[1]).toBe('mistral:mistral-medium-latest');
  });
  test('o Gemini não é reserva do tutor nem de nenhum modelo da Groq', () => {
    process.env.GEMINI_API_KEY = 'g';
    for (const principal of ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']) {
      expect(modelosEmOrdem(principal).some((m) => m?.startsWith('gemini:'))).toBe(false);
    }
  });
  test('com o Gemini escolhido para a redação, ele é o único da lista', () => {
    expect(modelosEmOrdem('gemini:gemini-3-flash-preview')).toEqual(['gemini:gemini-3-flash-preview']);
  });
  test('sem a chave, a Mistral não entra mesmo com o gerador ligado', () => {
    process.env.IA_RESERVAS_QUE_TREINAM = '1';
    expect(modelosEmOrdem('openai/gpt-oss-120b').some((m) => m?.startsWith('mistral:'))).toBe(false);
  });
});
