import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso as db, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';

vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/ai-client', () => ({ getAbacusApiKey: () => '' }));
vi.mock('@/lib/pedir-json', () => ({ pedirJson: vi.fn(async () => ({ ok: false, erro: 'IA desligada', status: 503 })) }));

import { POST as gerar } from '@/app/api/simulado/generate/route';
import { GET as sessaoAtual, POST as criarSessao, PUT as salvarSessao } from '@/app/api/simulado/session/route';
import { POST as enviar } from '@/app/api/simulado/submit/route';

function casa(linha: Record<string, any>, where: Record<string, any> = {}) {
  return Object.entries(where).every(([k, v]) => {
    if (v === undefined) return true;
    if (v && typeof v === 'object' && 'not' in v) return linha[k] !== v.not;
    if (v && typeof v === 'object' && 'in' in v) return v.in.includes(linha[k]);
    return linha[k] === v;
  });
}
const q = (id: string, extra: object = {}) => ({
  id, materia: 'Física', subtema: 's', enunciado: 'enunciado', respostaCorreta: 'A', nivel: 'medio', ancoraId: null, ...extra,
});

beforeEach(() => {
  zerar();
  entrarComo({ id: 'aluno-1' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('sem login', () => {
  it.each([
    ['generate', () => gerar(pedido('/x', {}))],
    ['submit', () => enviar(pedido('/x', { respostas: [] }))],
    ['session GET', () => sessaoAtual()],
    ['session POST', () => criarSessao(pedido('/x', { questionIds: ['a'] }))],
    ['session PUT', () => salvarSessao(pedido('/x', { sessionId: 'a' }, 'PUT'))],
  ])('%s devolve 401 e não grava', async (_n, chamar) => {
    entrarComo(null);
    expect((await chamar()).status).toBe(401);
    expect(gravacoes()).toEqual([]);
  });
});

describe('entrega do simulado', () => {
  const banco = [q('a'), q('b'), q('c', { materia: 'Biologia' })];
  const chamar = (respostas: unknown) => enviar(pedido('/x', { respostas }));
  beforeEach(() => db.question.findMany.mockImplementation(async ({ where }: any) => banco.filter((x) => where.id.in.includes(x.id))));

  it.each([[undefined], [[]], ['a'], [{}]])('400 para respostas %j', async (respostas) => {
    expect((await chamar(respostas)).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it('nota certa com acerto, erro e em branco', async () => {
    const r = await (await chamar([
      { questionId: 'a', respostaDada: 'A' },
      { questionId: 'b', respostaDada: 'B' },
      { questionId: 'c', respostaDada: '' },
    ])).json();
    expect(r).toMatchObject({ totalQuestoes: 3, totalCorretas: 1, totalErradas: 2, taxaAcerto: 33 });
    expect(r.porMateria.Física).toEqual({ total: 2, corretas: 1, erradas: 1 });
    // em branco não vira progresso nem revisão
    expect(db.userProgress.create.mock.calls.map((c: any) => c[0].data.questionId)).toEqual(['a', 'b']);
    expect(db.reviewSchedule.create.mock.calls.map((c: any) => c[0].data.questionId)).toEqual(['b']);
    expect(r.errosParaReforco.map((e: any) => e.questionId)).toEqual(['b']);
  });
  it.each([
    [3, 2, []],
    [5, 2, ['Física']],
    [5, 3, []],
  ])('reforço abaixo de 60%%: %i questões, %i certas', async (total, certas, esperado) => {
    const muitas = Array.from({ length: total }, (_, i) => q(`m${i}`));
    db.question.findMany.mockResolvedValue(muitas);
    const r = await (await chamar(muitas.map((x, i) => ({ questionId: x.id, respostaDada: i < certas ? 'A' : 'B' })))).json();
    expect(r.materiasReforcar.map((m: any) => m.materia)).toEqual(esperado);
  });
  it('userId do corpo não é usado', async () => {
    await enviar(pedido('/x', { userId: 'aluno-2', respostas: [{ questionId: 'a', respostaDada: 'A', userId: 'aluno-2' }] }));
    expect(db.userProgress.create.mock.calls[0][0].data.userId).toBe('aluno-1');
  });
  it('marca o dia do simulado como concluído só quando o dia ativo é de simulado', async () => {
    db.studyProgress.findMany.mockResolvedValue([0, 1, 2, 3].map((dayIndex) => ({ weekNumber: 1, dayIndex, status: 'concluido' })));
    await chamar([{ questionId: 'a', respostaDada: 'A' }]);
    expect(db.studyProgress.upsert.mock.calls[0][0].create).toMatchObject({ weekNumber: 1, dayIndex: 4, status: 'concluido' });
    db.studyProgress.upsert.mockClear();
    db.studyProgress.findMany.mockResolvedValue([]);
    await chamar([{ questionId: 'a', respostaDada: 'A' }]);
    expect(db.studyProgress.upsert).not.toHaveBeenCalled();
  });
  it('BUG-E15: a mesma questão repetida no envio conta uma vez só', async () => {
    const r = await (await chamar([
      { questionId: 'a', respostaDada: 'A' },
      { questionId: 'a', respostaDada: 'A' },
      { questionId: 'a', respostaDada: 'A' },
      { questionId: 'b', respostaDada: 'B' },
    ])).json();
    expect({ certas: r.totalCorretas, gravadas: db.userProgress.create.mock.calls.length }).toEqual({ certas: 1, gravadas: 2 });
  });
  it.each([[[null]], [[1, null]]])('BUG-E6: item inválido %j é 400, não 500', async (respostas) => {
    expect((await chamar(respostas)).status).toBe(400);
  });
  it.each(['{quebrado', 'null'])('BUG-E6: corpo %s é 400', async (corpo) => {
    expect((await enviar(pedido('/x', corpo))).status).toBe(400);
  });
});

describe('sessão do simulado', () => {
  let sessoes: any[];
  let itens: any[];
  beforeEach(() => {
    sessoes = [{ id: 's1', userId: 'aluno-1' }, { id: 's2', userId: 'aluno-2' }];
    itens = [{ sessionId: 's2', questionId: 'q1' }, { sessionId: 's1', questionId: 'q1' }];
    db.trainingSession.updateMany.mockImplementation(async ({ where, data }: any) => {
      const alvos = sessoes.filter((s) => casa(s, where));
      sessoes = sessoes.map((s) => (alvos.includes(s) ? { ...s, ...data } : s));
      return { count: alvos.length };
    });
    db.trainingSessionQuestion.updateMany.mockImplementation(async ({ where, data }: any) => {
      const alvos = itens.filter((i) => casa(i, where));
      itens = itens.map((i) => (alvos.includes(i) ? { ...i, ...data } : i));
      return { count: alvos.length };
    });
  });
  const salvar = (corpo: unknown) => salvarSessao(pedido('/x', corpo, 'PUT'));

  it('tempo zero é salvo', async () => {
    await salvar({ sessionId: 's1', timeLeft: 0, currentIdx: 0 });
    expect(sessoes[0]).toMatchObject({ timeLeft: 0, currentIdx: 0 });
  });
  it('sessão alheia: 404, nada muda', async () => {
    const r = await salvar({ sessionId: 's2', questionId: 'q1', respostaDada: 'A' });
    expect(r.status).toBe(404);
    expect(db.trainingSessionQuestion.updateMany).not.toHaveBeenCalled();
  });
  it('BUG-E10: sessionId em forma de operador não pode escrever na sessão de outro aluno', async () => {
    const r = await salvar({ sessionId: { not: '' }, questionId: 'q1', respostaDada: 'E' });
    expect(itens[0].respostaDada).toBeUndefined();
    expect(r.status).toBe(400);
  });
  it.each([[undefined], [[]]])('criar com questionIds %j: 400', async (questionIds) => {
    expect((await criarSessao(pedido('/x', { questionIds }))).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it('criar fecha só o simulado aberto do próprio aluno', async () => {
    await criarSessao(pedido('/x', { questionIds: ['a'] }));
    expect(db.trainingSession.updateMany.mock.calls[0][0].where).toEqual({ userId: 'aluno-1', finished: false, mode: 'simulado' });
    expect(db.trainingSession.create.mock.calls[0][0].data).toMatchObject({ userId: 'aluno-1', mode: 'simulado', timeElapsed: 0 });
  });
  it('BUG-E11: lista com id repetido é 400 e não fecha o simulado aberto', async () => {
    const r = await criarSessao(pedido('/x', { questionIds: ['a', 'a'] }));
    expect(r.status).toBe(400);
    expect(db.trainingSession.updateMany).not.toHaveBeenCalled();
  });
  it.each(['{quebrado', 'null'])('BUG-E6: corpo %s é 400 em POST e PUT', async (corpo) => {
    expect((await criarSessao(pedido('/x', corpo))).status).toBe(400);
    expect((await salvarSessao(pedido('/x', corpo, 'PUT'))).status).toBe(400);
  });
  it('retomar devolve só as respostas marcadas e filtra pelo dono', async () => {
    db.trainingSession.findFirst.mockResolvedValue({
      id: 's1', questions: [
        { questionId: 'a', answered: true, respostaDada: 'C', question: q('a') },
        { questionId: 'b', answered: false, respostaDada: null, question: q('b') },
      ],
    });
    const r = await (await sessaoAtual()).json();
    expect(r.session.answers).toEqual({ a: 'C' });
    expect(db.trainingSession.findFirst.mock.calls[0][0].where).toEqual({ userId: 'aluno-1', finished: false, mode: 'simulado' });
  });
});

describe('montar o simulado', () => {
  const banco = Array.from({ length: 200 }, (_, i) => q(`n${i}`));
  const chamar = (corpo: object) => gerar(pedido('/x', corpo));
  beforeEach(() => db.question.findMany.mockImplementation(async ({ where }: any) => banco.filter((x) => casa(x, where))));

  it.each([[undefined, 10], [-5, 10], [9, 10], [10, 10], [11, 11], [180, 180], [181, 180]])(
    'total %j gera %i questões sem repetir', async (totalQuestoes, esperado) => {
      const r = await (await chamar({ totalQuestoes, weekNumber: 1, dayIndex: 0 })).json();
      expect(r.total).toBe(esperado);
      expect(new Set(r.questions.map((x: any) => x.id)).size).toBe(esperado);
    });
  it('404 sem questões', async () => {
    db.question.findMany.mockResolvedValue([]);
    expect((await chamar({})).status).toBe(404);
  });
  it.each([[0, 1], [1, 1], [10, 10], [11, 10]])('prova rápida: quantidade %i vira %i', async (quantidade, esperado) => {
    const r = await (await chamar({ mistura: [{ materia: 'Física', quantidade }] })).json();
    expect(r.total).toBe(esperado);
  });
  it('prova rápida ignora item inválido e devolve 404 se nada sobrar', async () => {
    expect((await chamar({ mistura: [null, { materia: 1, quantidade: 2 }, { materia: 'Física', quantidade: 1.5 }] })).status).toBe(404);
  });
  it.each(['abc', {}])('BUG-E16: totalQuestoes %j não pode devolver simulado vazio com 200', async (totalQuestoes) => {
    const r = await chamar({ totalQuestoes, weekNumber: 1, dayIndex: 0 });
    const corpo = await r.json();
    expect(r.status === 400 || corpo.total >= 10, `status ${r.status}, total ${corpo.total}`).toBe(true);
  });
  it('BUG-E17: prova rápida com a matéria repetida no pedido não repete questão', async () => {
    db.question.findMany.mockResolvedValue([q('a'), q('b')]);
    const r = await (await chamar({ mistura: [{ materia: 'Física', quantidade: 2 }, { materia: 'Física', quantidade: 2 }] })).json();
    const ids = r.questions.map((x: any) => x.id);
    expect(ids.length).toBe(new Set(ids).size);
  });
  it.each([
    ['normal', { totalQuestoes: 10, weekNumber: 1, dayIndex: 0 }],
    ['prova rápida', { mistura: [{ materia: 'Física', quantidade: 5 }] }],
  ])('BUG-E13: degrau (com âncora) não aparece solto no simulado (%s)', async (_n, corpo) => {
    const soDegraus = [q('real'), q('degrau', { ancoraId: 'real' })];
    db.question.findMany.mockImplementation(async ({ where }: any) => soDegraus.filter((x) => casa(x, where)));
    const r = await (await chamar(corpo)).json();
    expect(r.questions.map((x: any) => x.id)).not.toContain('degrau');
  });
});
