/* Bibliotecas usadas pelas rotas de conteúdo que não tinham teste. Rede e AWS são de mentira. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso, zerar } from '../apoio/banco-falso';
import { chatCompletion } from '@/lib/ai-client';
import { isS3Configured } from '@/lib/aws-client';
import { uploadBufferToS3 } from '@/lib/s3';
import { maxSimilarity, textSimilarity } from '@/lib/text-similarity';
import { getActiveStudyDay, upsertStudyProgress } from '@/lib/study-progress';
import { cartoesRespondidos } from '@/lib/flashcards-revisao-servidor';
import { studyCycle } from '@/lib/schedule-data';

const { enviar } = vi.hoisted(() => ({ enviar: vi.fn() }));
vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: class { send = enviar; },
  PutObjectCommand: class { constructor(readonly input: unknown) {} },
  GetObjectCommand: class {}, DeleteObjectCommand: class {},
}));
vi.mock('@aws-sdk/s3-request-presigner', () => ({ getSignedUrl: vi.fn() }));

beforeEach(() => { zerar(); enviar.mockReset(); vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });

describe('chatCompletion', () => {
  const mensagens = [{ role: 'user' as const, content: 'oi' }];
  const rede = vi.fn();
  beforeEach(() => {
    rede.mockReset().mockResolvedValue(new Response('{"choices":[]}'));
    vi.stubGlobal('fetch', rede);
    vi.stubEnv('ABACUSAI_API_KEY', 'chave-falsa');
    vi.stubEnv('AI_BASE_URL', 'https://padrao.invalid/v1');
    vi.stubEnv('MISTRAL_API_KEY', '');
  });
  const status = async () => { const r = await chatCompletion({ messages: mensagens }); return r.ok ? 200 : r.response.status; };

  it('sem chave devolve 503 sem tocar a rede', async () => {
    vi.stubEnv('ABACUSAI_API_KEY', '');
    expect(await status()).toBe(503);
    expect(rede).not.toHaveBeenCalled();
  });

  it.each([[429, 429], [401, 502], [403, 502], [400, 502], [500, 502]])('provedor %i vira %i, sem vazar o corpo', async (de, para) => {
    rede.mockResolvedValue(new Response('detalhe-interno', { status: de }));
    const r = await chatCompletion({ messages: mensagens });
    expect(!r.ok && r.response.status).toBe(para);
    expect(!r.ok && (await r.response.text())).not.toContain('detalhe-interno');
  });

  it('resposta que não é JSON vira 502 e queda de rede também', async () => {
    rede.mockResolvedValue(new Response('<html>'));
    expect(await status()).toBe(502);
    rede.mockRejectedValue(new TypeError('fetch failed'));
    expect(await status()).toBe(502);
  });

  it('estouro do prazo vira 504', async () => {
    rede.mockImplementation((_u, { signal }) => new Promise((_ok, falha) =>
      signal.addEventListener('abort', () => falha(Object.assign(new Error('x'), { name: 'AbortError' })))));
    const r = await chatCompletion({ messages: mensagens, timeoutMs: 5 });
    expect(!r.ok && r.response.status).toBe(504);
  });

  it('prefixo de provedor sem chave não manda a requisição para outro endereço', async () => {
    await chatCompletion({ messages: mensagens, model: 'mistral:m' });
    expect(rede.mock.calls[0][0]).toBe('https://padrao.invalid/v1/chat/completions');
  });

  it('prefixo com chave usa o provedor e a chave dele', async () => {
    vi.stubEnv('MISTRAL_API_KEY', 'outra-falsa');
    await chatCompletion({ messages: mensagens, model: 'mistral:m:2' });
    const [url, init] = rede.mock.calls[0];
    expect(url).toBe('https://api.mistral.ai/v1/chat/completions');
    expect(init.headers.Authorization).toBe('Bearer outra-falsa');
    expect(JSON.parse(init.body).model).toBe('m:2');
  });
});

describe('armazenamento', () => {
  const vars = ['AWS_BUCKET_NAME', 'AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];

  it.each([...vars, null])('isS3Configured com %s faltando', (falta) => {
    vars.forEach((v) => vi.stubEnv(v, v === falta ? '' : 'x'));
    expect(isS3Configured()).toBe(falta === null);
  });

  it('upload devolve o endereço da mesma chave enviada', async () => {
    const url = await uploadBufferToS3(Buffer.from('a'), 'p.pdf', 'application/pdf');
    const { Key, ContentType } = enviar.mock.calls[0][0].input;
    expect(url.endsWith(Key)).toBe(true);
    expect(Key).toMatch(/public\/pdfs\/\d+-p\.pdf$/);
    expect(ContentType).toBe('application/pdf');
  });
});

describe('semelhança de texto', () => {
  it.each([
    ['A mitocôndria produz energia', 'a MITOCONDRIA produz energia!', 1],
    ['fotossíntese vegetal', 'guerra fria', 0], ['', 'algo', 0], ['de a o que', 'de a o que', 0],
  ])('%j x %j = %d', (a, b, n) => expect(textSimilarity(a, b)).toBeCloseTo(n));

  it('maxSimilarity pega o maior e lista vazia dá 0', () => {
    expect(maxSimilarity('mitose celular', ['guerra', 'mitose celular'])).toBeCloseTo(1);
    expect(maxSimilarity('x', [])).toBe(0);
  });
});

describe('dia de estudo ativo', () => {
  const todos = studyCycle.flatMap((s, i) => s.days.map((_, dayIndex) => ({ weekNumber: i + 1, dayIndex, status: 'concluido' })));

  it('sem histórico começa no primeiro dia', async () => {
    expect(await getActiveStudyDay('u')).toEqual({ weekNumber: 1, dayIndex: 0, cycleComplete: false });
  });

  it('dia pulado continua pendente', async () => {
    bancoFalso.studyProgress.findMany.mockResolvedValue([{ weekNumber: 1, dayIndex: 0, status: 'pulado' }]);
    expect(await getActiveStudyDay('u')).toMatchObject({ weekNumber: 1, dayIndex: 0 });
  });

  it('tudo concluído marca o ciclo completo no último dia, sem voltar', async () => {
    bancoFalso.studyProgress.findMany.mockResolvedValue(todos);
    const ultimo = todos.at(-1)!;
    expect(await getActiveStudyDay('u')).toEqual({ weekNumber: ultimo.weekNumber, dayIndex: ultimo.dayIndex, cycleComplete: true });
  });

  it.each([['concluido', true], ['pulado', true], ['em_andamento', false], ['nao_iniciado', false]] as const)(
    'status %s tem data de conclusão: %s', async (status, tem) => {
      await upsertStudyProgress('u', 1, 0, status);
      expect(bancoFalso.studyProgress.upsert.mock.calls[0][0].update.completedAt !== null).toBe(tem);
    });
});

describe('cartões respondidos', () => {
  const agora = new Date('2026-11-27T12:00:00Z');
  const cartao = (id: string, capitulo: number | null) => ({ id, capitulo, deck: { materia: 'M', nome: 'N', subtema: null, capituloLido: 1 } });

  it('sem respostas não consulta cartões', async () => {
    expect(await cartoesRespondidos('u', agora)).toEqual([]);
    expect(bancoFalso.flashcard.findMany).not.toHaveBeenCalled();
  });

  it('filtra por dono, esconde capítulo não lido e usa a resposta mais recente', async () => {
    bancoFalso.flashcardProgress.findMany.mockResolvedValue([
      { cardId: 'a', acertou: true, precisaRevisar: false, dataResposta: agora },
      { cardId: 'a', acertou: false, precisaRevisar: true, dataResposta: new Date('2026-11-01') },
      { cardId: 'b', acertou: false, precisaRevisar: true, dataResposta: agora },
      { cardId: 'c', acertou: false, precisaRevisar: true, dataResposta: agora },
    ]);
    bancoFalso.flashcard.findMany.mockResolvedValue([cartao('a', null), cartao('b', 1), cartao('c', 2)]);
    const r = await cartoesRespondidos('u', agora);
    expect(r.map((c) => [c.id, c.precisaRevisar])).toEqual([['a', false], ['b', true]]);
    expect(r[0].subtema).toBe('N');
    expect(bancoFalso.flashcard.findMany.mock.calls[0][0].where.deck).toEqual({ OR: [{ isDefault: true }, { userId: 'u' }] });
  });
});
