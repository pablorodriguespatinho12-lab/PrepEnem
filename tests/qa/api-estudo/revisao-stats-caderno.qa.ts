import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso as db, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';

vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);

import { GET as caderno } from '@/app/api/caderno-erros/route';
import { GET as pendentes, POST as revisar } from '@/app/api/review/route';
import { GET as stats } from '@/app/api/stats/route';
import { GET as verPlano, POST as salvarPlano } from '@/app/api/study-progress/route';

const AGORA = new Date('2026-11-27T18:00:00Z');

beforeEach(() => {
  zerar();
  entrarComo({ id: 'aluno-1' });
  vi.useFakeTimers();
  vi.setSystemTime(AGORA);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('sem login', () => {
  it.each([
    ['caderno', () => caderno(pedido('/x'))],
    ['review GET', () => pendentes()],
    ['review POST', () => revisar(pedido('/x', {}))],
    ['stats', () => stats()],
    ['study-progress GET', () => verPlano()],
    ['study-progress POST', () => salvarPlano(pedido('/x', {}))],
  ])('%s devolve 401 e não grava', async (_n, chamar) => {
    entrarComo(null);
    expect((await chamar()).status).toBe(401);
    expect(gravacoes()).toEqual([]);
  });
});

describe('revisão', () => {
  let agenda: any[];
  const responder = (corpo: unknown) => revisar(pedido('/x', corpo));
  const abertas = () => agenda.filter((r) => !r.completada);
  beforeEach(() => {
    agenda = [{ id: 'r1', userId: 'aluno-1', questionId: 'q1', intervaloAtual: 1, completada: false }];
    db.reviewSchedule.findUnique.mockImplementation(async ({ where }: any) => agenda.find((r) => r.id === where.id) ?? null);
    db.reviewSchedule.updateMany.mockImplementation(async ({ where, data }: any) => {
      await Promise.resolve();
      const alvos = agenda.filter((r) => r.id === where.id && r.completada === where.completada);
      agenda = agenda.map((r) => (alvos.includes(r) ? { ...r, ...data } : r));
      return { count: alvos.length };
    });
    db.reviewSchedule.create.mockImplementation(async ({ data }: any) => {
      await Promise.resolve();
      agenda = [...agenda, { id: `r${agenda.length + 1}`, completada: false, ...data }];
      return {};
    });
  });

  it.each([
    [1, true, 3, '2026-11-30'],
    [3, true, 7, '2026-12-04'],
    [7, true, 15, '2026-12-12'],
    [7, false, 1, '2026-11-28'],
  ])('intervalo %i, acertou=%s -> %i dia(s)', async (intervalo, acertou, proximo, dia) => {
    agenda = [{ ...agenda[0], intervaloAtual: intervalo }];
    expect((await responder({ reviewId: 'r1', acertou })).status).toBe(200);
    expect(abertas()).toMatchObject([{ userId: 'aluno-1', questionId: 'q1', intervaloAtual: proximo, proximaRevisao: new Date(`${dia}T03:00:00Z`) }]);
  });
  it('acerto no último intervalo encerra', async () => {
    agenda = [{ ...agenda[0], intervaloAtual: 15 }];
    await responder({ reviewId: 'r1', acertou: true });
    expect(abertas()).toEqual([]);
  });
  it('responder duas vezes cria uma só revisão seguinte', async () => {
    await responder({ reviewId: 'r1', acertou: true });
    const r = await responder({ reviewId: 'r1', acertou: true });
    expect(await r.json()).toMatchObject({ jaRegistrada: true });
    expect(abertas()).toHaveLength(1);
  });
  it('revisão alheia: 404 sem gravar', async () => {
    agenda = [{ ...agenda[0], userId: 'aluno-2' }];
    expect((await responder({ reviewId: 'r1', acertou: true })).status).toBe(404);
    expect(gravacoes()).toEqual([]);
  });
  it('lista só as pendentes vencidas do aluno', async () => {
    await pendentes();
    expect(db.reviewSchedule.findMany.mock.calls[0][0].where).toEqual({ userId: 'aluno-1', completada: false, proximaRevisao: { lte: AGORA } });
  });
  it.each([['false'], [undefined], ['nao']])('BUG-E18: acertou=%j é 400 e não conta como resposta', async (acertou) => {
    const r = await responder({ reviewId: 'r1', acertou });
    expect(r.status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it('BUG-E19: se criar a próxima falha, a nova tentativa não pode sumir com a revisão', async () => {
    db.$transaction.mockImplementation(async (arg: any) => {
      const foto = agenda;
      try {
        return await (typeof arg === 'function' ? arg(db) : Promise.all(arg));
      } catch (e) {
        agenda = foto;
        throw e;
      }
    });
    db.reviewSchedule.create.mockRejectedValueOnce(new Error('conexão caiu'));
    expect((await responder({ reviewId: 'r1', acertou: false })).status).toBe(500);
    await responder({ reviewId: 'r1', acertou: false });
    expect(abertas()).toHaveLength(1);
  });
  it.each(['{quebrado', 'null'])('BUG-E6: corpo %s é 400', async (corpo) => {
    expect((await responder(corpo)).status).toBe(400);
  });
});

describe('estatísticas', () => {
  const linhas = (materia: string, certas: number, erradas: number, data = AGORA) =>
    Array.from({ length: certas + erradas }, (_, i) => ({ acertou: i < certas, dataResposta: data, question: { materia, subtema: `${materia}-s` } }));

  it('sem respostas: tudo zero', async () => {
    expect(await (await stats()).json()).toMatchObject({ totalRespondidas: 0, taxaAcerto: 0, streakDays: 0, dominadas: [], reforcar: [] });
  });
  it.each([
    ['70% com 10', 7, 3, 'dominadas'],
    ['100% com 3', 3, 0, 'dominadas'],
    ['100% com 2 ainda não', 2, 0, null],
    ['69%', 69, 31, null],
    ['50% não reforça', 1, 1, null],
    ['49%', 49, 51, 'reforcar'],
    ['0% com 2', 0, 2, 'reforcar'],
    ['0% com 1 ainda não', 0, 1, null],
  ])('%s', async (_n, certas, erradas, lista) => {
    db.userProgress.findMany.mockResolvedValue(linhas('M', certas, erradas));
    const r = await (await stats()).json();
    expect([r.dominadas.includes('M'), r.reforcar.includes('M')]).toEqual([lista === 'dominadas', lista === 'reforcar']);
  });
  it('totais, dia de Brasília e corte de 30 dias', async () => {
    db.userProgress.findMany.mockResolvedValue([
      ...linhas('M', 1, 0, new Date('2026-11-27T02:00:00Z')),
      ...linhas('M', 0, 1, new Date('2026-10-01T12:00:00Z')),
    ]);
    const r = await (await stats()).json();
    expect(r).toMatchObject({ totalRespondidas: 2, totalAcertos: 1, taxaAcerto: 50 });
    expect(r.dailyData).toEqual({ '2026-11-26': { total: 1, acertos: 1 } });
  });
  it('redação: média ignora sem nota', async () => {
    db.essayPartPractice.findMany.mockResolvedValue([
      { partType: 'intro', nota: null }, { partType: 'intro', nota: 7 }, { partType: 'intro', nota: 8 },
    ]);
    const r = await (await stats()).json();
    expect(r.essayPartStats.intro).toEqual({ total: 3, avgNota: 7.5, lastNota: null });
  });
  it('todas as consultas são do próprio aluno', async () => {
    await stats();
    for (const fn of [db.userProgress.findMany, db.reviewSchedule.count, db.essayPartPractice.findMany]) {
      expect(fn.mock.calls[0][0].where.userId).toBe('aluno-1');
    }
  });
});

describe('caderno de erros', () => {
  const t = (questionId: string, acertou: boolean, dia: number, subtema = 'a') => ({
    questionId, acertou, dataResposta: new Date(Date.UTC(2026, 10, dia)), respostaDada: `r${dia}`,
    question: { id: questionId, subtema },
  });
  const abrir = async (query = '') => (await caderno(pedido(`/x${query}`))).json();

  it('mostra só quem segue errada, com a contagem e a última resposta', async () => {
    db.userProgress.findMany.mockResolvedValue([
      t('corrigida', true, 10), t('corrigida', false, 9),
      t('aberta', false, 8), t('aberta', true, 7), t('aberta', false, 6),
    ]);
    const r = await abrir();
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ erros: 2, respostaDada: 'r8', question: { id: 'aberta' } });
  });
  it('filtra por matéria no banco e por subtema, sempre do aluno', async () => {
    db.userProgress.findMany.mockResolvedValue([t('x', false, 1, 'a'), t('y', false, 2, 'b')]);
    const r = await abrir('?materia=F%C3%ADsica&subtema=b');
    expect(r.map((i: any) => i.question.id)).toEqual(['y']);
    expect(db.userProgress.findMany.mock.calls[0][0].where).toEqual({ userId: 'aluno-1', question: { materia: 'Física' } });
  });
});

describe('plano de estudo', () => {
  const salvar = (corpo: unknown) => salvarPlano(pedido('/x', corpo));
  const base = { weekNumber: 1, dayIndex: 0, status: 'concluido' };

  it.each([
    [{ weekNumber: 1, dayIndex: 0 }], [{ weekNumber: 4, dayIndex: 6 }],
  ])('aceita o limite %j', async (extra) => {
    expect((await salvar({ ...base, ...extra })).status).toBe(200);
    expect(db.studyProgress.upsert.mock.calls[0][0].create.userId).toBe('aluno-1');
  });
  it.each([
    [{ weekNumber: 0 }], [{ weekNumber: 5 }], [{ weekNumber: 1.5 }], [{ weekNumber: '1' }],
    [{ dayIndex: -1 }], [{ dayIndex: 7 }], [{ status: 'feito' }], [{ status: undefined }],
  ])('400 para %j', async (extra) => {
    expect((await salvar({ ...base, ...extra })).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it('JSON quebrado dá 400', async () => {
    expect((await salvar('{quebrado')).status).toBe(400);
  });
  it('BUG-E6: corpo "null" é 400, não exceção', async () => {
    const r = await salvar('null');
    expect(r.status).toBe(400);
  });
  it('GET devolve o progresso e o dia ativo', async () => {
    const r = await (await verPlano()).json();
    expect(r).toEqual({ progress: [], active: { weekNumber: 1, dayIndex: 0, cycleComplete: false } });
  });
});
