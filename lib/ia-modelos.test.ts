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

  test('com a chave do Gemini, ele entra antes da Mistral', () => {
    process.env.GEMINI_API_KEY = 'g';
    process.env.MISTRAL_API_KEY = 'm';
    process.env.IA_RESERVAS_QUE_TREINAM = '1';
    expect(modelosEmOrdem('openai/gpt-oss-120b').slice(1, 3)).toEqual(['gemini:gemini-3-flash-preview', 'mistral:mistral-medium-latest']);
  });
  test('sem a chave, a Mistral não entra mesmo com o gerador ligado', () => {
    process.env.IA_RESERVAS_QUE_TREINAM = '1';
    expect(modelosEmOrdem('openai/gpt-oss-120b').some((m) => m?.startsWith('mistral:'))).toBe(false);
  });
});
