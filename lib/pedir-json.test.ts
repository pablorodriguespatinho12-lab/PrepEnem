import { afterEach, describe, expect, test, vi } from 'vitest';

const chamadas: { timeoutMs?: number; model?: string }[] = [];
let respostas: Array<{ ok: boolean; status?: number; conteudo?: string }> = [];

vi.mock('@/lib/ai-client', () => ({
  chatCompletion: async (params: { timeoutMs?: number; model?: string }) => {
    chamadas.push(params);
    const r = respostas.shift() ?? { ok: true, conteudo: '{"a":1}' };
    return r.ok
      ? { ok: true, data: { choices: [{ message: { content: r.conteudo } }] } }
      : { ok: false, response: new Response('{}', { status: r.status }) };
  },
}));

const { pedirJson } = await import('./pedir-json');
const validar = (b: unknown) => ((b as { a?: number })?.a ? (b as { a: number }) : null);

afterEach(() => {
  chamadas.length = 0;
  respostas = [];
  vi.useRealTimers();
});

describe('pedirJson com prazo total', () => {
  test('o timeout de cada chamada nunca passa do que resta do prazo', async () => {
    await pedirJson('p', validar, { timeoutMs: 45_000, prazoMs: 20_000 });
    expect(chamadas[0].timeoutMs).toBeLessThanOrEqual(20_000);
  });

  test('429 sem tempo para esperar devolve o erro em vez de estourar os 60 s', async () => {
    respostas = [{ ok: false, status: 429 }];
    const inicio = Date.now();
    const r = await pedirJson('p', validar, { prazoMs: 5_000 });
    expect(r.ok).toBe(false);
    expect(Date.now() - inicio).toBeLessThan(1_000);
    expect(chamadas).toHaveLength(1);
  });

  test('resposta fora do formato ainda ganha a segunda tentativa', async () => {
    respostas = [{ ok: true, conteudo: 'lixo' }, { ok: true, conteudo: '{"a":2}' }];
    const r = await pedirJson('p', validar);
    expect(r).toEqual({ ok: true, dado: { a: 2 } });
  });
});

describe('cota da Groq acabou (15/10/2026: 200 mil tokens/dia no 120b, ~30 explicações)', () => {
  test('429 passa na hora para o modelo reserva, sem esperar', async () => {
    respostas = [{ ok: false, status: 429 }, { ok: true, conteudo: '{"a":1}' }];
    const inicio = Date.now();
    const r = await pedirJson('p', validar, { modelo: 'openai/gpt-oss-120b' });
    expect(r.ok).toBe(true);
    expect(chamadas.map((c) => c.model)).toEqual(['openai/gpt-oss-120b', 'openai/gpt-oss-20b']);
    expect(Date.now() - inicio).toBeLessThan(1000);
  });
  test('todas as reservas sem cota: devolve 429', async () => {
    respostas = [{ ok: false, status: 429 }, { ok: false, status: 429 }, { ok: false, status: 429 }, { ok: false, status: 429 }, { ok: false, status: 429 }];
    const r = await pedirJson('p', validar, { modelo: 'openai/gpt-oss-120b', prazoMs: 4000 });
    expect(r).toMatchObject({ ok: false, status: 429 });
    expect(new Set(chamadas.map((c) => c.model)).size).toBe(3);
  });
  test('a segunda tentativa (fora do formato) continua no modelo que respondeu', async () => {
    respostas = [{ ok: false, status: 429 }, { ok: true, conteudo: 'nada' }, { ok: true, conteudo: '{"a":1}' }];
    await pedirJson('p', validar, { modelo: 'openai/gpt-oss-120b' });
    expect(chamadas.map((c) => c.model)).toEqual(['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'openai/gpt-oss-20b']);
  });
});
