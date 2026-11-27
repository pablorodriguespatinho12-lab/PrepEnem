import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso as db, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';

vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/ai-client', () => ({ getAbacusApiKey: () => '' }));
vi.mock('@/lib/pedir-json', () => ({ pedirJson: vi.fn(async () => ({ ok: false, erro: 'IA desligada', status: 503 })) }));
vi.mock('@/lib/cache-ia', () => ({ comCache: vi.fn(async () => ({ ok: true, dado: [] })) }));

import { POST as responder } from '@/app/api/treino/answer/route';
import { POST as filtrado } from '@/app/api/treino/filtered/route';
import { POST as gerar } from '@/app/api/treino/generate/route';
import { POST as resumo } from '@/app/api/treino/resumo/route';
import { GET as sessaoAtual, POST as criarSessao, PUT as salvarSessao } from '@/app/api/treino/session/route';
import { comCache } from '@/lib/cache-ia';
import { studyCycle } from '@/lib/schedule-data';

function casa(linha: Record<string, any>, where: Record<string, any> = {}) {
  return Object.entries(where).every(([k, v]) => {
    if (v === undefined) return true;
    if (v && typeof v === 'object' && 'not' in v) return linha[k] !== v.not;
    if (v && typeof v === 'object' && 'in' in v) return v.in.includes(linha[k]);
    return linha[k] === v;
  });
}

beforeEach(() => {
  zerar();
  entrarComo({ id: 'aluno-1' });
  vi.mocked(comCache).mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('sem login', () => {
  it.each([
    ['answer', () => responder(pedido('/x', {}))],
    ['filtered', () => filtrado(pedido('/x', {}))],
    ['generate', () => gerar(pedido('/x', {}))],
    ['resumo', () => resumo(pedido('/x', {}))],
    ['session GET', () => sessaoAtual()],
    ['session POST', () => criarSessao(pedido('/x', { questionIds: ['a'] }))],
    ['session PUT', () => salvarSessao(pedido('/x', { sessionId: 'a' }, 'PUT'))],
  ])('%s devolve 401 e não grava', async (_n, chamar) => {
    entrarComo(null);
    expect((await chamar()).status).toBe(401);
    expect(gravacoes()).toEqual([]);
  });
});

describe('answer', () => {
  let progresso: any[];
  const enviar = (corpo: unknown) => responder(pedido('/x', corpo));
  beforeEach(() => {
    progresso = [];
    db.question.findUnique.mockImplementation(async ({ where }: any) =>
      where.id === 'q1' ? { id: 'q1', respostaCorreta: 'B', explicacao: 'porque' } : null);
    db.userProgress.findMany.mockImplementation(async () => [...progresso].reverse().slice(0, 1));
    db.userProgress.create.mockImplementation(async ({ data }: any) => {
      const novo = { id: `p${progresso.length}`, dataResposta: new Date(), ...data };
      progresso = [...progresso, novo];
      return novo;
    });
  });

  it('404 para questão que não existe', async () => {
    expect((await enviar({ questionId: 'zz', respostaDada: 'A' })).status).toBe(404);
    expect(gravacoes()).toEqual([]);
  });
  it.each([
    [null, 'B', true, 1, false, 1],
    [{ acertosConsecutivos: 1, tentativas: 1 }, 'B', true, 2, true, 2],
    [{ acertosConsecutivos: 5, tentativas: 5 }, 'A', false, 0, false, 6],
  ])('anterior %j + resposta %s', async (anterior, resposta, acertou, seguidos, dominada, tentativas) => {
    if (anterior) progresso = [anterior];
    const r = await (await enviar({ questionId: 'q1', respostaDada: resposta })).json();
    expect(r).toMatchObject({ acertou, acertosConsecutivos: seguidos, dominada, respostaCorreta: 'B' });
    expect(progresso.at(-1)).toMatchObject({ userId: 'aluno-1', tentativas });
  });
  it('erro agenda revisão; acerto não', async () => {
    await enviar({ questionId: 'q1', respostaDada: 'B' });
    expect(db.reviewSchedule.create).not.toHaveBeenCalled();
    await enviar({ questionId: 'q1', respostaDada: 'C' });
    expect(db.reviewSchedule.create).toHaveBeenCalledTimes(1);
  });
  it('userId do corpo é ignorado', async () => {
    await enviar({ questionId: 'q1', respostaDada: 'B', userId: 'aluno-2' });
    expect(progresso[0].userId).toBe('aluno-1');
  });
  it.each([
    [new Date('2026-11-26T15:00:00Z'), 3, 4],
    [new Date('2026-11-27T10:00:00Z'), 3, 3],
    [new Date('2026-11-20T15:00:00Z'), 3, 1],
  ])('sequência de dias (último estudo %s)', async (ultimo, antes, depois) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-27T18:00:00Z'));
    db.user.findUnique.mockResolvedValue({ id: 'aluno-1', lastStudyDate: ultimo, streakDays: antes });
    await enviar({ questionId: 'q1', respostaDada: 'B' });
    expect(db.user.update.mock.calls[0][0].data.streakDays).toBe(depois);
  });
  it('BUG-E8: o mesmo envio repetido em seguida não conta duas vezes nem marca "dominada"', async () => {
    // a tela aborta aos 15 s e oferece tentar de novo: o 1º pedido pode ter gravado
    const corpo = { questionId: 'q1', respostaDada: 'B' };
    await enviar(corpo);
    const segunda = await (await enviar(corpo)).json();
    expect({ gravadas: progresso.length, dominada: segunda.dominada }).toEqual({ gravadas: 1, dominada: false });
  });
  it.each([
    ['sem respostaDada', { questionId: 'q1' }],
    ['respostaDada vazia', { questionId: 'q1', respostaDada: '' }],
    ['respostaDada fora de A-E', { questionId: 'q1', respostaDada: 'Z' }],
  ])('BUG-E9: %s é 400 e não vira erro no histórico', async (_n, corpo) => {
    const r = await enviar(corpo);
    expect(r.status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it.each(['{quebrado', 'null'])('BUG-E6: corpo %s é 400, não 500', async (corpo) => {
    expect((await enviar(corpo)).status).toBe(400);
  });
});

describe('sessão do treino', () => {
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

  it('salva a própria sessão e só ela', async () => {
    const r = await salvar({ sessionId: 's1', currentIdx: 0, correct: 0, questionId: 'q1', respostaDada: 'A' });
    expect(r.status).toBe(200);
    expect(sessoes[0]).toMatchObject({ currentIdx: 0, correct: 0 });
    expect(itens.map((i) => i.respostaDada)).toEqual([undefined, 'A']);
  });
  it('sessão alheia: 404, nada muda', async () => {
    const r = await salvar({ sessionId: 's2', finished: true, questionId: 'q1', respostaDada: 'A' });
    expect(r.status).toBe(404);
    expect(sessoes[1].finished).toBeUndefined();
    expect(db.trainingSessionQuestion.updateMany).not.toHaveBeenCalled();
  });
  it('sem sessionId: 400', async () => {
    expect((await salvar({})).status).toBe(400);
  });
  it('BUG-E10: sessionId em forma de operador não pode escrever na sessão de outro aluno', async () => {
    const r = await salvar({ sessionId: { not: '' }, questionId: 'q1', respostaDada: 'E' });
    expect(itens[0].respostaDada).toBeUndefined();
    expect(r.status).toBe(400);
  });

  it.each([[undefined], [[]], ['q1']])('criar com questionIds %j: 400 sem fechar nada', async (questionIds) => {
    expect((await criarSessao(pedido('/x', { questionIds }))).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it('criar fecha só os treinos do próprio aluno, preserva o simulado', async () => {
    await criarSessao(pedido('/x', { questionIds: ['a', 'b'] }));
    expect(db.trainingSession.updateMany.mock.calls[0][0].where).toEqual({ userId: 'aluno-1', finished: false, mode: { not: 'simulado' } });
    expect(db.trainingSession.create.mock.calls[0][0].data.questions.create).toEqual([
      { questionId: 'a', ordem: 0 }, { questionId: 'b', ordem: 1 },
    ]);
  });
  it.each([[['a', 'a']], [[1, 2]], [[null]]])('BUG-E11: lista %j é 400 e não fecha o treino aberto', async (questionIds) => {
    const r = await criarSessao(pedido('/x', { questionIds }));
    expect(r.status).toBe(400);
    expect(db.trainingSession.updateMany).not.toHaveBeenCalled();
  });
  it.each(['{quebrado', 'null'])('BUG-E6: corpo %s é 400 em POST e PUT', async (corpo) => {
    expect((await criarSessao(pedido('/x', corpo))).status).toBe(400);
    expect((await salvarSessao(pedido('/x', corpo, 'PUT'))).status).toBe(400);
  });

  it.each([
    ['2026-11-27T03:00:00Z', true],
    ['2026-11-27T02:59:59Z', false],
  ])('retoma só o treino de hoje (criado %s)', async (criado, retoma) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-27T12:00:00Z'));
    db.trainingSession.findFirst.mockResolvedValue({ id: 's1', createdAt: new Date(criado), questions: [] });
    const corpo = await (await sessaoAtual()).json();
    expect(corpo.session !== null).toBe(retoma);
    expect(db.trainingSession.findFirst.mock.calls[0][0].where).toMatchObject({ userId: 'aluno-1', finished: false, mode: { not: 'simulado' } });
  });
});

describe('treino filtrado', () => {
  const qs = [
    { id: 'certa', materia: 'Biologia', subtema: 'a', dificuldade: 'medio', ancoraId: null },
    { id: 'errada', materia: 'Biologia', subtema: 'a', dificuldade: 'medio', ancoraId: null },
    { id: 'nova', materia: 'Biologia', subtema: 'a', dificuldade: 'medio', ancoraId: null },
  ];
  const chamar = async (corpo: object) => filtrado(pedido('/x', corpo));
  beforeEach(() => {
    db.question.findMany.mockImplementation(async ({ where }: any) => qs.filter((q) => casa(q, where)));
    db.userProgress.findMany.mockResolvedValue([
      { questionId: 'errada', acertou: false },
      { questionId: 'certa', acertou: true },
      { questionId: 'errada', acertou: true }, // mais antiga: não vale
    ]);
  });

  it.each([[1, ['errada']], [2, ['errada', 'nova']]])('quantidade %i: errada, depois inédita', async (quantidade, ids) => {
    const r = await (await chamar({ quantidade })).json();
    expect(r.questions.map((q: any) => q.id)).toEqual(ids);
    expect(r.insufficient).toBe(false);
  });
  it('avisa quando faltam questões', async () => {
    expect(await (await chamar({ quantidade: 4 })).json()).toMatchObject({ total: 3, insufficient: true });
  });
  it('404 sem questão no filtro', async () => {
    expect((await chamar({ materia: 'Química' })).status).toBe(404);
  });
  it('histórico consultado é só o do aluno', async () => {
    await chamar({});
    expect(db.userProgress.findMany.mock.calls[0][0].where.userId).toBe('aluno-1');
  });
  it.each([[-1], [0], ['abc']])('BUG-E12: quantidade %j é 400', async (quantidade) => {
    expect((await chamar({ quantidade })).status).toBe(400);
  });
  it('BUG-E13: degrau (com âncora) não aparece solto no treino filtrado', async () => {
    const degrau = { id: 'degrau', materia: 'Biologia', subtema: 'a', dificuldade: 'facil', ancoraId: 'certa' };
    db.question.findMany.mockImplementation(async ({ where }: any) => [...qs, degrau].filter((q) => casa(q, where)));
    const r = await (await chamar({ materia: 'Biologia' })).json();
    expect(r.questions.map((q: any) => q.id)).not.toContain('degrau');
  });
});

describe('gerar o treino do dia', () => {
  const todosConcluidos = () => studyCycle.flatMap((s) => s.days.map((_, dayIndex) => ({ weekNumber: s.weekNumber, dayIndex, status: 'concluido' })));
  const chamar = (corpo: unknown) => gerar(pedido('/x', corpo));

  it('404 sem nenhuma questão', async () => {
    expect((await chamar({ weekNumber: 1, dayIndex: 0 })).status).toBe(404);
  });
  it.each([
    [{ weekNumber: 4, dayIndex: 6 }, 4, 6],
    [{ weekNumber: 0, dayIndex: 0 }, 1, 0],
    [{ weekNumber: 5, dayIndex: 0 }, 1, 0],
    [{ weekNumber: 1, dayIndex: 7 }, 1, 0],
    [{ weekNumber: 1, dayIndex: -1 }, 1, 0],
    [{ weekNumber: '2', dayIndex: 1 }, 1, 0],
  ])('dia do plano %j', async (corpo, semana, dia) => {
    await chamar(corpo);
    expect(db.studyProgress.upsert.mock.calls[0][0].where.userId_weekNumber_dayIndex).toEqual({ userId: 'aluno-1', weekNumber: semana, dayIndex: dia });
  });
  it('só pede questões sem âncora e não repete', async () => {
    db.question.findMany.mockImplementation(async ({ where }: any) =>
      where.materia && typeof where.materia === 'string'
        ? [{ id: `${where.materia}-1`, materia: where.materia, subtema: 'x', enunciado: 'e', nivel: 'facil' }]
        : []);
    const r = await (await chamar({ weekNumber: 1, dayIndex: 0 })).json();
    const ids = r.questions.map((q: any) => q.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    const porMateria = db.question.findMany.mock.calls.map((c: any) => c[0].where).filter((w: any) => typeof w.materia === 'string');
    expect(porMateria.every((w: any) => w.ancoraId === null)).toBe(true);
  });
  it.each([
    ['pela tela (dia na URL)', { weekNumber: 1, dayIndex: 0 }],
    ['sem dia, com o ciclo completo', {}],
  ])('BUG-E14: abrir treino de dia concluído %s não volta para "em andamento"', async (_n, corpo) => {
    db.studyProgress.findMany.mockResolvedValue(todosConcluidos());
    await chamar(corpo);
    const voltou = db.studyProgress.upsert.mock.calls.filter((c: any) => c[0].update.status === 'em_andamento');
    expect(voltou).toEqual([]);
  });
});

describe('resumo', () => {
  const chamar = (corpo: unknown) => resumo(pedido('/x', corpo));
  it.each(['{quebrado', {}, { subtemas: [] }, { subtemas: 'a' }, { subtemas: [null, { materia: 1, subtema: 'a' }] }])(
    '400 sem assunto válido: %j', async (corpo) => {
      expect((await chamar(corpo)).status).toBe(400);
      expect(comCache).not.toHaveBeenCalled();
    });
  it('manda no máximo 4 assuntos à IA, sem repetir', async () => {
    const subtemas = ['a', 'a', 'b', 'c', 'd', 'e'].map((s) => ({ materia: 'M', subtema: `assunto-${s}` }));
    await chamar({ subtemas });
    const prompt = vi.mocked(comCache).mock.calls[0][1];
    expect(prompt).toContain('4. M — assunto-d');
    expect(prompt).not.toContain('assunto-e');
  });
  it('repassa o erro da IA com o status', async () => {
    vi.mocked(comCache).mockResolvedValueOnce({ ok: false, erro: 'cota', status: 429 });
    expect((await chamar({ subtemas: [{ materia: 'M', subtema: 'a' }] })).status).toBe(429);
  });
});
