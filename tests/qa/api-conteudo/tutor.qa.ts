/* Rotas app/api/tutor/** e as libs de entrada, geração e cache. IA e cache do Next são de mentira. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';
import { POST as conversa } from '@/app/api/tutor/conversa/route';
import { POST as explicacao } from '@/app/api/tutor/explicacao/route';
import { POST as seuErro } from '@/app/api/tutor/seu-erro/route';
import { lerHistorico, lerQuestao } from '@/lib/tutor/entrada';
import { comCache } from '@/lib/cache-ia';
import { gerarExplicacao } from '@/lib/tutor/gerar';
import { VERSAO_EXPLICACAO } from '@/lib/tutor/pronta';

const { pedirJson, cache } = vi.hoisted(() => ({ pedirJson: vi.fn(), cache: vi.fn() }));
vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/pedir-json', () => ({ pedirJson }));
vi.mock('next/cache', () => ({ unstable_cache: cache }));

const QUESTAO = { enunciado: 'Quanto é 2+2?', alternativas: { A: '3', B: '4' }, respostaCorreta: 'B', materia: 'Matemática', subtema: 'Soma' };
const EXPLICACAO = { ideia: 'Somar junta quantidades.', pecas: [], passos: [{ titulo: 'Somar', texto: 'Dois mais dois dá quatro.' }] };

beforeEach(() => {
  zerar();
  pedirJson.mockReset().mockResolvedValue({ ok: false, erro: 'cheio', status: 429 });
  cache.mockReset().mockImplementation((fn: () => unknown) => fn);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('sem sessão', () => {
  it.each([['conversa', conversa], ['explicacao', explicacao], ['seu-erro', seuErro]])('%s devolve 401 sem IA', async (_n, rota) => {
    expect((await rota(pedido('/t', QUESTAO))).status).toBe(401);
    expect(pedirJson).not.toHaveBeenCalled();
  });
});

describe('lerQuestao', () => {
  it.each(['A', 'E', 'a', ' c '])('aceita resposta %j em maiúscula', (r) => {
    expect(lerQuestao({ ...QUESTAO, respostaCorreta: r })?.respostaCorreta).toBe(r.trim().toUpperCase());
  });

  it.each([null, 3, 'x', {}, { ...QUESTAO, enunciado: '   ' }, { ...QUESTAO, respostaCorreta: 'F' }, { ...QUESTAO, respostaCorreta: 2 }])(
    'recusa %j', (v) => { expect(lerQuestao(v)).toBeNull(); });

  it('corta nos tetos e preenche padrões', () => {
    const q = lerQuestao({ enunciado: 'e'.repeat(6001), alternativas: { A: 'a'.repeat(801) }, respostaCorreta: 'A', respostaDada: 'Z', subtema: 's'.repeat(121) })!;
    expect([q.enunciado.length, q.alternativas.A.length, q.alternativas.B, q.subtema?.length]).toEqual([6000, 800, '', 120]);
    expect([q.materia, q.respostaDada]).toEqual(['Geral', null]);
  });
});

describe('lerHistorico', () => {
  it('descarta papel estranho, texto vazio e itens que não são objeto', () => {
    expect(lerHistorico([null, 3, { papel: 'sistema', texto: 'x' }, { papel: 'aluno', texto: ' ' }, { papel: 'tutor', texto: 'ok' }]))
      .toEqual([{ papel: 'tutor', texto: 'ok' }]);
  });
  it('guarda as 30 últimas, cada uma com até 1200 caracteres', () => {
    const h = lerHistorico(Array.from({ length: 31 }, (_, i) => ({ papel: 'aluno', texto: `${i}-${'x'.repeat(2000)}` })));
    expect(h).toHaveLength(30);
    expect(h[0].texto.startsWith('1-')).toBe(true);
    expect(h[0].texto).toHaveLength(1200);
  });
  it.each([null, {}, 'oi'])('%j vira lista vazia', (v) => expect(lerHistorico(v)).toEqual([]));
});

describe('conversa', () => {
  beforeEach(() => entrarComo());
  const corpo = { questao: QUESTAO, historico: [{ papel: 'aluno', texto: 'por quê?' }], resumoExplicacao: 'r'.repeat(100_000), questionId: 'q1' };

  it.each([
    '{quebrado', 'null', {}, { ...corpo, questao: null }, { ...corpo, historico: [] },
    { ...corpo, historico: [{ papel: 'tutor', texto: 'oi' }] },
  ])('pedido %j devolve 400 sem IA', async (c) => {
    expect((await conversa(pedido('/c', c, 'POST'))).status).toBe(400);
    expect(pedirJson).not.toHaveBeenCalled();
  });

  it('resumo gigante não estoura o tamanho do pedido à IA', async () => {
    await conversa(pedido('/c', corpo));
    expect(pedirJson.mock.calls[0][0].length).toBeLessThan(15_000);
  });

  it('contexto do aluno só lê dados dele', async () => {
    await conversa(pedido('/c', corpo));
    expect(bancoFalso.userProgress.count.mock.calls[0][0].where.userId).toBe('aluno-1');
    expect(bancoFalso.userProgress.findFirst.mock.calls[0][0].where).toMatchObject({ userId: 'aluno-1', questionId: 'q1' });
    expect(gravacoes()).toEqual([]);
  });

  it('questionId que não é texto não vai ao banco', async () => {
    await conversa(pedido('/c', { ...corpo, questionId: { not: 'x' } }));
    expect(bancoFalso.userProgress.findFirst).not.toHaveBeenCalled();
  });

  it('banco fora não impede a resposta', async () => {
    bancoFalso.userProgress.count.mockRejectedValue(new Error('fora'));
    pedirJson.mockResolvedValue({ ok: true, dado: { resposta: 'porque sim', visual: null } });
    expect((await conversa(pedido('/c', corpo))).status).toBe(200);
  });
});

describe('explicacao', () => {
  beforeEach(() => entrarComo());

  it.each(['{quebrado', 'null', {}])('corpo %j devolve 400', async (c) => {
    expect((await explicacao(pedido('/x', c, 'POST'))).status).toBe(400);
  });

  it('explicação pronta sai sem IA e sem o erro de outro aluno', async () => {
    bancoFalso.explicacaoPronta.findUnique.mockResolvedValue({ versao: VERSAO_EXPLICACAO, conteudo: { ...EXPLICACAO, seuErro: 'Você somou errado a segunda parcela.' } });
    const j = await (await explicacao(pedido('/x', { ...QUESTAO, questionId: 'q1' }))).json();
    expect(j.pronta).toBe(true);
    expect(j.explicacao.seuErro).toBeNull();
    expect(pedirJson).not.toHaveBeenCalled();
  });

  it.each([['inexistente', null], ['de versão velha', { versao: -1, conteudo: EXPLICACAO }]])(
    'soPronta com pronta %s devolve 404 sem IA', async (_n, pronta) => {
      bancoFalso.explicacaoPronta.findUnique.mockResolvedValue(pronta);
      expect((await explicacao(pedido('/x', { ...QUESTAO, questionId: 'q1', soPronta: true }))).status).toBe(404);
      expect(pedirJson).not.toHaveBeenCalled();
    });

  it('falha da IA repassa o status', async () => {
    expect((await explicacao(pedido('/x', QUESTAO))).status).toBe(429);
  });
});

describe('seu-erro', () => {
  beforeEach(() => entrarComo());

  it.each([
    ['corpo quebrado', '{x'], ['sem resposta dada', QUESTAO], ['resposta certa', { ...QUESTAO, respostaDada: 'b' }],
    ['letra inválida', { ...QUESTAO, respostaDada: 'Z' }],
  ])('%s devolve 400 sem IA', async (_n, c) => {
    expect((await seuErro(pedido('/s', c, 'POST'))).status).toBe(400);
    expect(pedirJson).not.toHaveBeenCalled();
  });

  it('aceita seuErro nulo e recusa JSON sem a chave', async () => {
    pedirJson.mockImplementation(async (_p: string, validar: (b: unknown) => unknown) => {
      expect(validar({ outra: 1 })).toBeNull();
      return { ok: true, dado: validar({ seuErro: null }) };
    });
    expect(await (await seuErro(pedido('/s', { ...QUESTAO, respostaDada: 'A' }))).json()).toEqual({ seuErro: null });
  });
});

describe('comCache', () => {
  const ok = (dado: string) => async () => ({ ok: true as const, dado });

  it('chave depende do prefixo e do prompt inteiro', async () => {
    await comCache('p', 'um', ok('x'), (v) => v);
    await comCache('p', 'dois', ok('x'), (v) => v);
    const [a, b] = cache.mock.calls.map((c) => c[1]);
    expect(a[0]).toBe('p');
    expect(a[1]).not.toBe(b[1]);
  });

  it('falha da IA vira resultado com o mesmo status e não valor guardado', async () => {
    expect(await comCache('p', 'x', async () => ({ ok: false, erro: 'cheio', status: 429 }), (v) => v)).toEqual({ ok: false, erro: 'cheio', status: 429 });
  });

  it('resposta guardada que não passa mais na regra dá 502', async () => {
    expect(await comCache('p', 'x', ok('velha'), () => null)).toMatchObject({ ok: false, status: 502 });
  });

  it('erro que não é da IA sobe', async () => {
    await expect(comCache('p', 'x', async () => { throw new Error('bug'); }, (v) => v)).rejects.toThrow('bug');
  });
});

describe('gerarExplicacao: prazo', () => {
  it('sem tempo não chama a IA e devolve 504', async () => {
    expect(await gerarExplicacao(lerQuestao(QUESTAO)!, 7_999)).toMatchObject({ ok: false, status: 504 });
    expect(pedirJson).not.toHaveBeenCalled();
  });

  it('com tempo só para gerar, entrega sem conferir', async () => {
    pedirJson.mockResolvedValue({ ok: true, dado: EXPLICACAO });
    expect((await gerarExplicacao(lerQuestao(QUESTAO)!, 12_000)).ok).toBe(true);
    expect(pedirJson).toHaveBeenCalledTimes(1);
  });

  it('a resposta pedida cabe no teto por pedido', async () => {
    await gerarExplicacao(lerQuestao(QUESTAO)!, 55_000);
    const [prompt, , opcoes] = pedirJson.mock.calls[0];
    expect(opcoes.maxTokens).toBeLessThanOrEqual(4000);
    expect(opcoes.maxTokens + Math.ceil(prompt.length / 3.2)).toBeLessThanOrEqual(7800);
    expect(opcoes.prazoMs).toBeLessThanOrEqual(55_000);
  });
});
