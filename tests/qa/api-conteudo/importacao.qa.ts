/* Rotas batch-import e pdf-process. IA, S3, PDF e disco são de mentira. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';
import { GET as estado, POST as lote } from '@/app/api/batch-import/route';
import { POST as processar } from '@/app/api/pdf-process/route';

const m = vi.hoisted(() => ({
  chat: vi.fn(), chave: vi.fn(), s3Ligado: vi.fn(), subir: vi.fn(), carregar: vi.fn(), existe: vi.fn(),
}));
vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/ai-client', async () => {
  const { NextResponse } = await import('next/server');
  return { chatCompletion: m.chat, getAbacusApiKey: m.chave, aiUnavailableResponse: () => NextResponse.json({}, { status: 503 }) };
});
vi.mock('@/lib/aws-client', async () => {
  const { NextResponse } = await import('next/server');
  return { isS3Configured: m.s3Ligado, s3UnavailableResponse: () => NextResponse.json({}, { status: 503 }) };
});
vi.mock('@/lib/s3', () => ({ uploadBufferToS3: m.subir }));
vi.mock('pdf-lib', () => ({
  PDFDocument: { load: m.carregar, create: async () => ({ copyPages: async () => [], addPage() {}, save: async () => new Uint8Array() }) },
}));
vi.mock('fs', () => ({ existsSync: m.existe, readFileSync: () => Buffer.from('pdf') }));

const resposta = (content: string) => ({ ok: true, data: { choices: [{ message: { content } }] } });
/* 1ª chamada da IA lê o gabarito; a 2ª lê as questões do único trecho. */
function ia(gabarito: string | object, questoes: object[]) {
  m.chat.mockResolvedValueOnce(resposta(typeof gabarito === 'string' ? gabarito : JSON.stringify({ gabarito })))
    .mockResolvedValue(resposta(JSON.stringify({ questoes })));
}
const Q = { numeroQuestao: 1, paginaNoTrecho: 1, enunciado: 'e', materia: 'Física' };
const PDF = { pdfBase64: 'cGRm', gabaritoBase64: 'Z2Fi', fileName: '2024_PV_impresso_D1_CD1.pdf' };
const salvas = () => bancoFalso.question.create.mock.calls.map((c: any) => c[0].data);

beforeEach(() => {
  zerar();
  m.chat.mockReset();
  m.chave.mockReset().mockReturnValue('chave-falsa');
  m.s3Ligado.mockReset().mockReturnValue(true);
  m.subir.mockReset().mockResolvedValue('https://exemplo.invalid/p.pdf');
  m.carregar.mockReset().mockResolvedValue({ getPageCount: () => 1 });
  m.existe.mockReset().mockReturnValue(true);
  entrarComo({ role: 'admin' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

const rotas = [
  ['batch-import', () => lote(pedido('/b', { pairIndex: 0 }))],
  ['pdf-process', () => processar(pedido('/p', PDF))],
] as const;

describe.each(rotas)('%s: porteiros', (_n, chamar) => {
  it.each([['sem sessão', null], ['aluno', { role: 'user' }]])('%s não gasta IA nem grava', async (_q, quem) => {
    zerar();
    if (quem) entrarComo(quem);
    expect([401, 403]).toContain((await chamar()).status);
    expect(m.chat).not.toHaveBeenCalled();
    expect(gravacoes()).toEqual([]);
  });

  it.each([['S3', () => m.s3Ligado.mockReturnValue(false)], ['chave da IA', () => m.chave.mockReturnValue(null)]])(
    'sem %s devolve 503 sem gastar IA', async (_q, desligar) => {
      desligar();
      expect((await chamar()).status).toBe(503);
      expect(m.chat).not.toHaveBeenCalled();
    });
});

describe('batch-import', () => {
  const post = (c: unknown) => lote(pedido('/b', c, 'POST'));

  it('GET é só de admin', async () => {
    entrarComo({ role: 'user' });
    expect((await estado()).status).toBe(403);
    entrarComo({ role: 'admin' });
    expect((await (await estado()).json()).pairs).toHaveLength(9);
  });

  it.each([{}, { pairIndex: -1 }, { pairIndex: 9 }])('%j devolve 400', async (c) => {
    expect((await post(c)).status).toBe(400);
  });

  it.each([null, 'abc', 1.5, '0x'])('BUG-C13: pairIndex %j devolve 400, não 500', async (pairIndex) => {
    expect((await post({ pairIndex })).status).toBe(400);
  });

  it('BUG-C5: corpo quebrado devolve 400, não 500', async () => {
    expect((await post('{x')).status).toBe(400);
  });

  it.each([[20, false], [21, true]])('com %i questões já salvas, pula = %s', async (n, pula) => {
    bancoFalso.question.count.mockResolvedValue(n);
    ia({ 1: 'B' }, [Q]);
    const j = await (await post({ pairIndex: 0 })).json();
    expect(j.skipped === true).toBe(pula);
    expect(m.chat.mock.calls.length > 0).toBe(!pula);
  });

  it('arquivo ausente devolve 404 sem IA', async () => {
    m.existe.mockReturnValue(false);
    expect((await post({ pairIndex: 0 })).status).toBe(404);
    expect(m.chat).not.toHaveBeenCalled();
  });

  it('usa o gabarito oficial e pula anulada', async () => {
    ia({ 1: 'c', 2: 'Anulada' }, [{ ...Q, respostaCorreta: 'A' }, { ...Q, numeroQuestao: 2 }]);
    expect(await (await post({ pairIndex: 0 })).json()).toMatchObject({ saved: 1, anuladas: 1 });
    expect(salvas().map((q: any) => q.respostaCorreta)).toEqual(['C']);
  });

  it('BUG-C14: gabarito vazio não grava questão nenhuma', async () => {
    ia({}, [Q]);
    const r = await post({ pairIndex: 0 });
    expect(gravacoes()).toEqual([]);
    expect(r.status).toBeGreaterThanOrEqual(400);
  });

  it('BUG-C15: gabarito que não é JSON devolve 502, não 500', async () => {
    ia('desculpe, não consegui', [Q]);
    expect((await post({ pairIndex: 0 })).status).toBe(502);
  });

  it('BUG-C16: questão sem gabarito nem palpite não é gravada como "A"', async () => {
    ia({ 99: 'B' }, [Q]);
    await post({ pairIndex: 0 });
    expect(salvas().map((q: any) => q.respostaCorreta)).toEqual([]);
  });
});

describe('pdf-process', () => {
  const post = (c: unknown) => processar(pedido('/p', c, 'POST'));

  it.each([[{}], [{ pdfBase64: 'x' }], [{ gabaritoBase64: 'x' }]])('%j devolve 400 sem IA', async (c) => {
    expect((await post(c)).status).toBe(400);
    expect(m.chat).not.toHaveBeenCalled();
  });

  it('BUG-C5: corpo quebrado devolve 400, não 500', async () => {
    expect((await post('{x')).status).toBe(400);
  });

  it('gabarito ilegível devolve 502 e vazio devolve 422, sem gravar', async () => {
    ia('lixo', []);
    expect((await post(PDF)).status).toBe(502);
    m.chat.mockReset();
    ia({}, []);
    expect((await post(PDF)).status).toBe(422);
    expect(gravacoes()).toEqual([]);
  });

  it('nenhuma questão extraída devolve 422', async () => {
    ia({ 1: 'B' }, []);
    expect((await post(PDF)).status).toBe(422);
  });

  it('grava com ano, dia e gabarito oficial; repetida no lote entra uma vez', async () => {
    ia({ 1: 'D' }, [{ ...Q, respostaCorreta: 'A', materia: 'física aplicada', dificuldade: 'Hard' }, Q]);
    expect((await (await post(PDF)).json()).total).toBe(1);
    expect(salvas()[0]).toMatchObject({ respostaCorreta: 'D', anoProva: 2024, diaProva: 1, materia: 'Física', dificuldade: 'medio' });
  });

  it('questão já existente recebe a resposta oficial', async () => {
    ia({ 1: 'E' }, [Q]);
    bancoFalso.question.findFirst.mockResolvedValue({ id: 'velha' });
    await post(PDF);
    expect(bancoFalso.question.update.mock.calls[0][0]).toEqual({ where: { id: 'velha' }, data: { respostaCorreta: 'E' } });
    expect(salvas()).toEqual([]);
  });

  it('BUG-C16: questão sem gabarito nem palpite não é gravada como "A"', async () => {
    ia({ 99: 'B' }, [Q]);
    await post(PDF);
    expect(salvas().map((q: any) => q.respostaCorreta)).toEqual([]);
  });

  it.each(['X', 'C OU D', ''.padEnd(1, '-')])('BUG-C17: gabarito ilegível %j não troca a resposta salva por "A"', async (valor) => {
    ia({ 1: valor }, [Q]);
    bancoFalso.question.findFirst.mockResolvedValue({ id: 'velha', respostaCorreta: 'D' });
    await post(PDF);
    expect(bancoFalso.question.update).not.toHaveBeenCalled();
  });

  it('BUG-C18: arquivo que não é PDF devolve 4xx antes de gastar IA', async () => {
    ia({ 1: 'B' }, [Q]);
    m.carregar.mockRejectedValue(new Error('Failed to parse PDF document'));
    const r = await post({ ...PDF, pdfBase64: 'bmFvLWUtcGRm' });
    expect(m.chat).not.toHaveBeenCalled();
    expect([400, 415, 422]).toContain(r.status);
  });
});
