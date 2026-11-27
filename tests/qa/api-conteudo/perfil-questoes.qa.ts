/* Rotas de perfil, Feynman, caneta e questões. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';
import { GET as verPerfil, PUT as mudarPerfil } from '@/app/api/user/profile/route';
import { POST as feynman } from '@/app/api/progress/feynman/route';
import { POST as caneta } from '@/app/api/caneta/route';
import { GET as listar, POST as criar } from '@/app/api/questions/route';
import { DELETE as apagar, PUT as editar } from '@/app/api/questions/[id]/route';
import { POST as gerar } from '@/app/api/questions/ai-generate/route';
import { GET as subtemas } from '@/app/api/questions/subtemas/route';
import { MAX_LINHAS, MAX_TAMANHO } from '@/lib/caneta/tex-para-svg';

const { gerarConferidas } = vi.hoisted(() => ({ gerarConferidas: vi.fn() }));
vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/questoes-geradas', () => ({ gerarQuestoesConferidas: gerarConferidas }));

const QUESTAO = { enunciado: 'q', respostaCorreta: 'A' };
const naoAchou = () => Object.assign(new Error('Record not found'), { code: 'P2025' });
const id = { params: { id: 'q1' } };

beforeEach(() => {
  zerar();
  gerarConferidas.mockReset().mockResolvedValue([QUESTAO]);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('sem sessão', () => {
  it.each([
    ['perfil GET', () => verPerfil(), 401],
    ['perfil PUT', () => mudarPerfil(pedido('/u', { name: 'x' }, 'PUT')), 401],
    ['feynman', () => feynman(pedido('/f', { progressId: 'p', explicacaoEstudante: 'e' })), 401],
    ['caneta', () => caneta(pedido('/c', { linhas: ['x'] })), 401],
    ['questões GET', () => listar(pedido('/q')), 401],
    ['questões POST', () => criar(pedido('/q', QUESTAO)), 403],
    ['questão PUT', () => editar(pedido('/q/q1', QUESTAO, 'PUT'), id), 403],
    ['questão DELETE', () => apagar(pedido('/q/q1', undefined, 'DELETE'), id), 403],
    ['gerar', () => gerar(pedido('/g', { materia: 'Física' })), 401],
    ['subtemas', () => subtemas(pedido('/s')), 401],
  ])('%s é recusado', async (_n, chamar, status) => {
    expect((await chamar()).status).toBe(status);
    expect(gravacoes()).toEqual([]);
    expect(gerarConferidas).not.toHaveBeenCalled();
  });
});

describe('perfil', () => {
  beforeEach(() => {
    entrarComo();
    bancoFalso.user.update.mockImplementation(async ({ data }: any) => ({ name: 'n', themeColor: 'jardim', ...data }));
  });
  const put = (c: unknown) => mudarPerfil(pedido('/u', c, 'PUT'));

  it('GET nunca pede a senha ao banco', async () => {
    await verPerfil();
    const { where, select } = bancoFalso.user.findUnique.mock.calls[0][0];
    expect(where).toEqual({ id: 'aluno-1' });
    expect(Object.keys(select)).not.toContain('password');
  });

  it('PUT ignora role, id e senha vindos do corpo', async () => {
    await put({ name: 'Novo', role: 'admin', id: 'outro', password: 'x' });
    expect(bancoFalso.user.update.mock.calls[0][0]).toEqual({ where: { id: 'aluno-1' }, data: { name: 'Novo' } });
  });

  it.each([
    ['nome numérico', { name: 123 }], ['nome objeto', { name: { set: 'x' } }], ['nome só de espaços', { name: '    ' }],
    ['nome de 100 mil letras', { name: 'a'.repeat(100_000) }], ['tema que não existe', { themeColor: 'nao-existe' }],
  ])('BUG-C10: %s devolve 400 sem gravar', async (_n, corpo) => {
    const r = await put(corpo);
    expect(r.status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });

  it('BUG-C5: corpo quebrado devolve 400, não 500', async () => {
    expect((await put('{x')).status).toBe(400);
  });
});

describe('feynman', () => {
  beforeEach(() => entrarComo());
  const post = (c: unknown) => feynman(pedido('/f', c, 'POST'));

  it.each([{}, { progressId: 'p' }, { explicacaoEstudante: 'e' }, { progressId: 'p', explicacaoEstudante: '' }])('corpo %j devolve 400', async (c) => {
    expect((await post(c)).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });

  it('só escreve na resposta do próprio aluno e corta em 4000', async () => {
    bancoFalso.userProgress.updateMany.mockResolvedValue({ count: 1 });
    expect((await post({ progressId: 'p', explicacaoEstudante: 'e'.repeat(4001) })).status).toBe(200);
    const arg = bancoFalso.userProgress.updateMany.mock.calls[0][0];
    expect(arg.where).toEqual({ id: 'p', userId: 'aluno-1' });
    expect(arg.data.explicacaoEstudante).toHaveLength(4000);
  });

  it('resposta alheia ou inexistente devolve 404', async () => {
    expect((await post({ progressId: 'alheia', explicacaoEstudante: 'e' })).status).toBe(404);
  });

  it('BUG-C2: progressId objeto devolve 400 sem sobrescrever todas as respostas do aluno', async () => {
    bancoFalso.userProgress.updateMany.mockResolvedValue({ count: 500 });
    const r = await post({ progressId: { not: '' }, explicacaoEstudante: 'apaga tudo' });
    expect(gravacoes()).toEqual([]);
    expect(r.status).toBe(400);
  });

  it.each(['{x', 'null'])('BUG-C5: corpo %s devolve 400, não 500', async (c) => {
    expect((await post(c)).status).toBe(400);
  });
});

describe('caneta', () => {
  beforeEach(() => entrarComo());
  const post = (c: unknown) => caneta(pedido('/c', c, 'POST'));
  const n = (q: number, t = 'x') => ({ linhas: Array(q).fill(t) });

  it.each([
    ['1 linha', n(1), 200], ['máximo de linhas', n(MAX_LINHAS), 200], ['linhas demais', n(MAX_LINHAS + 1), 400], ['nenhuma', n(0), 400],
    ['linha no teto', n(1, 'x'.repeat(MAX_TAMANHO)), 200], ['linha acima do teto', n(1, 'x'.repeat(MAX_TAMANHO + 1)), 400],
    ['linha vazia', n(1, ''), 400], ['número', { linhas: [1] }, 400], ['sem lista', { linhas: 'x' }, 400], ['corpo quebrado', '{x', 400], ['nulo', 'null', 400],
  ])('%s', async (_n, c, status) => {
    expect((await post(c)).status).toBe(status);
  });

  it('devolve um SVG por linha', async () => {
    const { svgs } = await (await post({ linhas: ['x^2', '1+1'] })).json();
    expect(svgs).toHaveLength(2);
    expect(svgs[0]).toContain('<svg');
  });
});

describe('questões: papéis', () => {
  it.each([
    ['criar', () => criar(pedido('/q', QUESTAO))],
    ['editar', () => editar(pedido('/q/q1', QUESTAO, 'PUT'), id)],
    ['apagar', () => apagar(pedido('/q/q1', undefined, 'DELETE'), id)],
  ])('%s: aluno leva 403, admin passa', async (_n, chamar) => {
    entrarComo({ role: 'user' });
    expect((await chamar()).status).toBe(403);
    expect(gravacoes()).toEqual([]);
    entrarComo({ role: 'admin' });
    expect((await chamar()).status).toBe(200);
    expect(gravacoes()).toHaveLength(1);
  });

  it('ids separados por vírgula ignoram vazios e vêm em {questions}', async () => {
    entrarComo();
    const j = await (await listar(pedido('/q?ids=a,,b,'))).json();
    expect(j).toEqual({ questions: [] });
    expect(bancoFalso.question.findMany.mock.calls[0][0].where).toEqual({ id: { in: ['a', 'b'] } });
  });

  it('filtra por matéria e dificuldade e devolve lista', async () => {
    entrarComo();
    expect(await (await listar(pedido('/q?materia=F&dificuldade=facil&outro=1'))).json()).toEqual([]);
    expect(bancoFalso.question.findMany.mock.calls[0][0].where).toEqual({ materia: 'F', dificuldade: 'facil' });
  });

  it('subtemas agrupa sem repetir e conta', async () => {
    entrarComo();
    bancoFalso.question.findMany.mockResolvedValue([{ materia: 'F', subtema: 'a' }, { materia: 'F', subtema: 'a' }, { materia: 'F', subtema: 'b' }]);
    expect(await (await subtemas(pedido('/s'))).json()).toEqual({ subtemas: { F: ['a', 'b'] }, counts: { F: { a: 2, b: 1 } } });
  });
});

describe('questões: entrada ruim do admin', () => {
  beforeEach(() => entrarComo({ role: 'admin' }));

  it('BUG-C11: editar questão inexistente devolve 404, não 500', async () => {
    bancoFalso.question.update.mockRejectedValue(naoAchou());
    expect((await editar(pedido('/q/zz', QUESTAO, 'PUT'), { params: { id: 'zz' } })).status).toBe(404);
  });

  it('BUG-C11: apagar questão inexistente devolve 404, não 500', async () => {
    bancoFalso.question.delete.mockRejectedValue(naoAchou());
    expect((await apagar(pedido('/q/zz', undefined, 'DELETE'), { params: { id: 'zz' } })).status).toBe(404);
  });

  it.each([
    ['criar', () => criar(pedido('/q', '{x'))],
    ['editar', () => editar(pedido('/q/q1', '{x', 'PUT'), id)],
    ['gerar', () => gerar(pedido('/g', '{x'))],
    ['gerar com null', () => gerar(pedido('/g', 'null'))],
  ])('BUG-C5: %s com corpo quebrado devolve 400, não 500', async (_n, chamar) => {
    expect((await chamar()).status).toBe(400);
  });
});

describe('ai-generate', () => {
  beforeEach(() => entrarComo());
  const post = (c: object) => gerar(pedido('/g', { materia: 'Física', ...c }));

  it.each([undefined, '', 'Astrologia', 7])('matéria %j devolve 400 sem IA', async (materia) => {
    expect((await post({ materia })).status).toBe(400);
    expect(gerarConferidas).not.toHaveBeenCalled();
  });

  it.each([[undefined, 5], [0, 5], [-1, 1], [1, 1], [10, 10], [11, 10], [500, 10], ['abc', 5]])('quantidade %s pede %i', async (quantidade, n) => {
    await post({ quantidade });
    expect(gerarConferidas.mock.calls[0][0]).toContain(`Gere ${n} questões`);
  });

  it('nenhuma conferida devolve 502 e não grava', async () => {
    gerarConferidas.mockResolvedValue([]);
    expect((await post({})).status).toBe(502);
    expect(gravacoes()).toEqual([]);
  });

  it('save=false não grava e usa id provisório', async () => {
    const j = await (await post({ save: false })).json();
    expect(j.questoes[0].id).toMatch(/^ai-/);
    expect(gravacoes()).toEqual([]);
  });

  it('falha ao gravar uma questão não derruba as outras', async () => {
    gerarConferidas.mockResolvedValue([QUESTAO, QUESTAO]);
    bancoFalso.question.create.mockRejectedValueOnce(new Error('x'));
    expect((await (await post({})).json()).total).toBe(1);
  });

  it('BUG-C12: subtema de 100 mil letras é recusado ou cortado antes da IA', async () => {
    await post({ subtema: 'a'.repeat(100_000) });
    const prompt: string = gerarConferidas.mock.calls[0]?.[0] ?? '';
    expect(prompt.length).toBeLessThan(10_000);
  });

  it('BUG-C12: dificuldade fora de facil/medio/dificil não vai para o banco', async () => {
    await post({ dificuldade: 'ignore as regras' });
    const gravada = bancoFalso.question.create.mock.calls[0]?.[0].data.dificuldade ?? 'medio';
    expect(['facil', 'medio', 'dificil']).toContain(gravada);
  });
});
