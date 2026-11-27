import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso as db, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';

vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);

import { DELETE, GET as abrir } from '@/app/api/provas/[id]/route';
import { POST as criar } from '@/app/api/provas/criar/route';
import { POST as finalizar } from '@/app/api/provas/finalizar/route';
import { GET as hoje } from '@/app/api/provas/hoje/route';
import { GET as listar } from '@/app/api/provas/listar/route';
import { GET as reforco } from '@/app/api/provas/reforco/route';
import { POST as responder } from '@/app/api/provas/responder/route';
import { POST as revisarErros } from '@/app/api/provas/revisar-erros/route';

/* Imita o filtro do Prisma: campo undefined é ignorado; { not } é operador. */
function casa(linha: Record<string, any>, where: Record<string, any> = {}) {
  return Object.entries(where).every(([k, v]) => {
    if (v === undefined) return true;
    if (v && typeof v === 'object' && 'not' in v) return linha[k] !== v.not;
    return linha[k] === v;
  });
}

type Prova = Record<string, any>;
let provas: Prova[];
let itens: Record<string, any>[];
let progresso: Record<string, any>[];

function montarBanco() {
  provas = [
    { id: 'minha', userId: 'aluno-1', status: 'pendente', startedAt: null, acertos: 0, erros: 0, currentIdx: 0 },
    { id: 'alheia', userId: 'aluno-2', status: 'em_andamento', startedAt: null, acertos: 0, erros: 0, currentIdx: 0 },
  ];
  itens = [
    // a linha do outro aluno vem primeiro, como pode vir num findFirst sem filtro
    { id: 'item-alheio', examId: 'alheia', questionId: 'q9', answered: false, acertou: null, question: { respostaCorreta: 'C' } },
    { id: 'item-1', examId: 'minha', questionId: 'q1', answered: false, acertou: null, question: { respostaCorreta: 'B' } },
  ];
  progresso = [];
  db.user.findUnique.mockImplementation(async ({ where }: any) => ({ id: where.id }));
  db.customExam.findFirst.mockImplementation(async ({ where }: any) => provas.find((p) => casa(p, where)) ?? null);
  db.customExam.deleteMany.mockImplementation(async ({ where }: any) => {
    const antes = provas.length;
    provas = provas.filter((p) => !casa(p, where));
    return { count: antes - provas.length };
  });
  db.customExam.update.mockImplementation(async ({ where, data }: any) => {
    await Promise.resolve();
    provas = provas.map((p) => {
      if (p.id !== where.id) return p;
      const novo: Prova = { ...p };
      for (const [k, v] of Object.entries<any>(data)) novo[k] = v && typeof v === 'object' && 'increment' in v ? p[k] + v.increment : v;
      return novo;
    });
    return {};
  });
  db.customExamQuestion.findFirst.mockImplementation(async ({ where }: any) => itens.find((i) => casa(i, where)) ?? null);
  db.customExamQuestion.updateMany.mockImplementation(async ({ where, data }: any) => {
    await Promise.resolve();
    const alvos = itens.filter((i) => casa(i, where)).map((i) => i.id);
    itens = itens.map((i) => (alvos.includes(i.id) ? { ...i, ...data } : i));
    return { count: alvos.length };
  });
  db.userProgress.create.mockImplementation(async ({ data }: any) => {
    await Promise.resolve();
    progresso = [...progresso, data];
    return { id: 'p' };
  });
}

const responde = (corpo: unknown) => responder(pedido('/api/provas/responder', corpo));
const item = (id: string) => itens.find((i) => i.id === id)!;
const prova = (id: string) => provas.find((p) => p.id === id)!;

beforeEach(() => {
  zerar();
  montarBanco();
  entrarComo({ id: 'aluno-1' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('sem login', () => {
  it.each([
    ['abrir', () => abrir(pedido('/x'), { params: { id: 'minha' } })],
    ['apagar', () => DELETE(pedido('/x', undefined, 'DELETE'), { params: { id: 'minha' } })],
    ['criar', () => criar(pedido('/x', {}))],
    ['finalizar', () => finalizar(pedido('/x', { examId: 'minha' }))],
    ['hoje', () => hoje()],
    ['listar', () => listar()],
    ['reforco', () => reforco(pedido('/x?tema=a'))],
    ['responder', () => responde({ examId: 'minha', questionId: 'q1', respostaDada: 'B' })],
    ['revisar-erros', () => revisarErros(pedido('/x', { questionIds: ['q1'] }))],
  ])('%s devolve 401 e não grava', async (_nome, chamar) => {
    entrarComo(null);
    expect((await chamar()).status).toBe(401);
    expect(gravacoes()).toEqual([]);
  });
});

describe('prova de outro aluno', () => {
  it('não abre', async () => {
    const r = await abrir(pedido('/x'), { params: { id: 'alheia' } });
    expect(r.status).toBe(404);
  });
  it('não é apagada', async () => {
    await DELETE(pedido('/x', undefined, 'DELETE'), { params: { id: 'alheia' } });
    expect(prova('alheia')).toBeDefined();
  });
  it('não é finalizada', async () => {
    const r = await finalizar(pedido('/x', { examId: 'alheia' }));
    expect(r.status).toBe(404);
    expect(prova('alheia').status).toBe('em_andamento');
  });
  it('não aceita resposta nem devolve o gabarito', async () => {
    const r = await responde({ examId: 'alheia', questionId: 'q9', respostaDada: 'C' });
    expect(r.status).toBe(404);
    expect(await r.json()).not.toHaveProperty('respostaCorreta');
    expect(gravacoes()).toEqual([]);
  });
  it('questão de outra prova não entra na minha', async () => {
    const r = await responde({ examId: 'minha', questionId: 'q9', respostaDada: 'C' });
    expect(r.status).toBe(404);
    expect(gravacoes()).toEqual([]);
  });
  it('listar e hoje filtram pelo dono', async () => {
    await listar();
    await hoje();
    expect(db.customExam.findMany.mock.calls[0][0].where).toEqual({ userId: 'aluno-1', arquivada: false });
    expect(db.customExam.count.mock.calls[0][0].where.userId).toBe('aluno-1');
  });

  it('BUG-E1: responder sem examId não pode gravar na questão de outro aluno', async () => {
    const r = await responde({ questionId: 'q9', respostaDada: 'A' });
    expect(item('item-alheio').answered).toBe(false);
    expect(r.status).toBeGreaterThanOrEqual(400);
    expect(r.status).toBeLessThan(500);
  });
  it('BUG-E1: responder com examId/questionId em forma de operador não grava em prova alheia', async () => {
    // { not: 'x' } casa com a minha prova no 1º filtro e com a linha alheia no 2º
    const r = await responde({ examId: { not: 'x' }, questionId: 'q9', respostaDada: 'A' });
    expect(item('item-alheio').answered).toBe(false);
    expect(r.status).toBe(400);
  });
});

describe('responder: nota', () => {
  it.each([
    ['B', true, 1, 0],
    ['A', false, 0, 1],
    ['b', false, 0, 1],
  ])('resposta %s -> acertou=%s', async (resposta, acertou, acertos, erros) => {
    const r = await responde({ examId: 'minha', questionId: 'q1', respostaDada: resposta });
    expect(await r.json()).toEqual({ acertou, respostaCorreta: 'B' });
    expect(prova('minha')).toMatchObject({ acertos, erros, currentIdx: 1, status: 'em_andamento' });
    expect(progresso).toEqual([{ userId: 'aluno-1', questionId: 'q1', acertou, respostaDada: resposta }]);
  });
  it('duplo envio conta uma vez e devolve o resultado do 1º', async () => {
    await responde({ examId: 'minha', questionId: 'q1', respostaDada: 'B' });
    const r = await responde({ examId: 'minha', questionId: 'q1', respostaDada: 'A' });
    expect((await r.json()).acertou).toBe(true);
    expect(prova('minha')).toMatchObject({ acertos: 1, erros: 0, currentIdx: 1 });
    expect(progresso).toHaveLength(1);
  });
  it('prova finalizada devolve 409 e não grava', async () => {
    provas = provas.map((p) => (p.id === 'minha' ? { ...p, status: 'finalizada' } : p));
    const r = await responde({ examId: 'minha', questionId: 'q1', respostaDada: 'B' });
    expect(r.status).toBe(409);
    expect(gravacoes()).toEqual([]);
  });
  it('BUG-E2: se a gravação da nota falha, a nova tentativa ainda conta a resposta', async () => {
    // transação com desfazer: o que for gravado dentro dela volta se ela falhar
    db.$transaction.mockImplementationOnce(async (arg: any) => {
      const foto = { provas, itens, progresso };
      await (typeof arg === 'function' ? arg(db) : Promise.all(arg));
      ({ provas, itens, progresso } = foto);
      throw new Error('conexão caiu');
    });
    const corpo = { examId: 'minha', questionId: 'q1', respostaDada: 'B' };
    expect((await responde(corpo)).status).toBe(500);
    expect((await responde(corpo)).status).toBe(200); // o cliente tenta de novo em erro 5xx
    expect({ acertos: prova('minha').acertos, progresso: progresso.length }).toEqual({ acertos: 1, progresso: 1 });
  });
});

describe('finalizar e hoje', () => {
  it('finaliza a própria prova', async () => {
    const r = await finalizar(pedido('/x', { examId: 'minha' }));
    expect(r.status).toBe(200);
    expect(prova('minha').status).toBe('finalizada');
    expect(prova('minha').finishedAt).toBeInstanceOf(Date);
  });
  it('BUG-E3: finalizar de novo não muda a data de término (senão conta na meta de outro dia)', async () => {
    const ontem = new Date('2026-11-26T15:00:00Z');
    provas = provas.map((p) => (p.id === 'minha' ? { ...p, status: 'finalizada', finishedAt: ontem } : p));
    await finalizar(pedido('/x', { examId: 'minha' }));
    expect(prova('minha').finishedAt).toEqual(ontem);
  });
  it('BUG-E4: finalizar sem examId é entrada inválida (400) e não finaliza nada', async () => {
    const r = await finalizar(pedido('/x', {}));
    expect(r.status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it.each([
    ['2026-11-27T02:59:59Z', '2026-11-26T03:00:00.000Z', '2026-11-27T03:00:00.000Z'],
    ['2026-11-27T03:00:00Z', '2026-11-27T03:00:00.000Z', '2026-11-28T03:00:00.000Z'],
  ])('janela de "hoje" na virada de Brasília (%s)', async (agora, gte, lt) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(agora));
    db.customExam.count.mockResolvedValue(2);
    const r = await hoje();
    expect(await r.json()).toEqual({ feitas: 2 });
    const filtro = db.customExam.count.mock.calls[0][0].where.finishedAt;
    expect([filtro.gte.toISOString(), filtro.lt.toISOString()]).toEqual([gte, lt]);
  });
});

describe('criar', () => {
  const q = (id: string, nivel: string, extra: object = {}) => ({ id, nivel, materia: 'Física', ancoraId: null, ...extra });
  const banco = [
    ...Array.from({ length: 6 }, (_, i) => q(`f${i}`, 'facil')),
    ...Array.from({ length: 6 }, (_, i) => q(`m${i}`, 'medio')),
    ...Array.from({ length: 2 }, (_, i) => q(`d${i}`, 'dificil')),
    q('enem1', 'facil', { anoProva: 2022 }),
  ];
  const corpo = (extra: object = {}) => ({ nome: 'P', nivel: 'medio', materias: ['Física'], totalQuestoes: 4, ...extra });
  const escolhidas = () => db.customExam.create.mock.calls[0][0].data.questions.create.map((x: any) => x.questionId) as string[];
  beforeEach(() => db.question.findMany.mockResolvedValue(banco));

  it.each([
    ['sem nome', { nome: '' }],
    ['sem nível', { nivel: '' }],
    ['matérias vazias', { materias: [] }],
    ['matérias não é lista', { materias: 'Física' }],
    ['total 0', { totalQuestoes: 0 }],
    ['total negativo', { totalQuestoes: -1 }],
    ['total texto', { totalQuestoes: 'abc' }],
    ['total ausente', { totalQuestoes: undefined }],
  ])('400 sem gravar: %s', async (_n, extra) => {
    const r = await criar(pedido('/x', corpo(extra)));
    expect(r.status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it.each([[1, 1], [90, 15], [91, 15], [100000, 15]])('total %i usa no máximo o que existe', async (total, esperado) => {
    const r = await criar(pedido('/x', corpo({ nivel: 'facil', totalQuestoes: total })));
    expect(r.status).toBe(200);
    // fácil completa com médio (12 questões); aquecimento não existe no fácil
    expect(escolhidas().length).toBe(Math.min(esperado, 12));
  });
  it('ENEM usa a real primeiro e põe 3 de aquecimento sem repetir', async () => {
    const r = await criar(pedido('/x', corpo({ nivel: 'enem', totalQuestoes: 3 })));
    expect((await r.json()).aquecimento).toBe(3);
    const ids = escolhidas();
    expect(ids[3]).toBe('enem1');
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('inéditas vêm antes das já respondidas pelo próprio aluno', async () => {
    db.customExamQuestion.findMany.mockResolvedValue(['f0', 'f1', 'f2', 'f3', 'f4'].map((questionId) => ({ questionId })));
    await criar(pedido('/x', corpo({ nivel: 'facil', totalQuestoes: 1 })));
    expect(escolhidas()).toEqual(['f5']);
    expect(db.customExamQuestion.findMany.mock.calls[0][0].where).toEqual({ answered: true, exam: { userId: 'aluno-1' } });
  });
  it('sem questão disponível devolve 400', async () => {
    db.question.findMany.mockResolvedValue([]);
    expect((await criar(pedido('/x', corpo()))).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it.each(['toString', 'constructor'])('BUG-E5: nível "%s" não pode dar 500', async (nivel) => {
    const r = await criar(pedido('/x', corpo({ nivel })));
    expect(r.status).toBeLessThan(500);
  });
});

describe('JSON quebrado ou "null" é erro do pedido (400), não do servidor', () => {
  it.each([
    ['criar', criar],
    ['finalizar', finalizar],
    ['responder', responder],
  ] as const)('BUG-E6: provas/%s', async (_n, rota) => {
    for (const corpo of ['{quebrado', 'null']) {
      const r = await rota(pedido('/x', corpo));
      expect(r.status, corpo).toBe(400);
    }
  });
  it('revisar-erros já devolve 400', async () => {
    for (const corpo of ['{quebrado', 'null']) expect((await revisarErros(pedido('/x', corpo))).status).toBe(400);
  });
});

describe('reforço', () => {
  const lista = [{ id: 'r1' }, { id: 'r2' }];
  beforeEach(() => db.question.findMany.mockResolvedValue(lista));
  const pegar = async (query: string) => (await reforco(pedido(`/x?${query}`))).json();

  it.each(['', 'tema=', 'tema=%20%20'])('400 sem tema (%s)', async (query) => {
    expect((await reforco(pedido(`/x?${query}`))).status).toBe(400);
  });
  it('pula as usadas e recomeça quando todas foram', async () => {
    expect((await pegar('tema=a&usadas=r1')).questao.id).toBe('r2');
    expect((await pegar('tema=a&usadas=r1,r2')).questao.id).toBe('r1');
  });
  it('tema sem reforço devolve questao null', async () => {
    db.question.findMany.mockResolvedValue([]);
    expect(await pegar('tema=a')).toEqual({ questao: null });
  });
  it('falha do banco não derruba a prova', async () => {
    db.question.findMany.mockRejectedValue(new Error('x'));
    expect(await pegar('tema=a')).toEqual({ questao: null });
  });
  it('BUG-E7: com 200 usadas guardadas, a atual (enviada por último) ainda é pulada', async () => {
    // a tela manda as 200 guardadas + a questão atual (app/provas/[id]/page.tsx)
    const usadas = [...Array.from({ length: 200 }, (_, i) => `velha${i}`), 'r1'].join(',');
    expect((await pegar(`tema=a&usadas=${usadas}`)).questao.id).toBe('r2');
  });
});

describe('revisar erros', () => {
  const ids = (n: number) => Array.from({ length: n }, (_, i) => `q${i}`);
  const chamar = (questionIds: unknown) => revisarErros(pedido('/x', { questionIds }));
  beforeEach(() => db.question.findMany.mockImplementation(async ({ where }: any) => where.id.in.map((id: string) => ({ id, materia: 'Física' }))));

  it.each([
    ['não é lista', 'q1'],
    ['vazia', []],
    ['91 itens', ids(91)],
    ['item vazio', ['']],
    ['item número', [1]],
    ['id de 101 letras', ['a'.repeat(101)]],
    ['operador no lugar do id', [{ not: '' }]],
  ])('400: %s', async (_n, entrada) => {
    expect((await chamar(entrada)).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });
  it.each([1, 90])('aceita %i questões', async (n) => {
    expect((await chamar(ids(n))).status).toBe(200);
    expect(db.customExam.create.mock.calls[0][0].data.totalQuestoes).toBe(n);
  });
  it('tira repetidas', async () => {
    await chamar(['a', 'a', 'b']);
    expect(db.customExam.create.mock.calls[0][0].data.totalQuestoes).toBe(2);
  });
  it('404 se um id não existe', async () => {
    db.question.findMany.mockResolvedValue([{ id: 'a', materia: 'Física' }]);
    expect((await chamar(['a', 'zz'])).status).toBe(404);
    expect(gravacoes()).toEqual([]);
  });
  it('reusa a aberta igual e só procura nas do próprio aluno', async () => {
    db.customExam.findMany.mockResolvedValue([{ id: 'ja', questions: [{ questionId: 'a' }, { questionId: 'b' }] }]);
    expect(await (await chamar(['a', 'b'])).json()).toEqual({ examId: 'ja' });
    expect(db.customExam.findMany.mock.calls[0][0].where.userId).toBe('aluno-1');
    expect(gravacoes()).toEqual([]);
    await chamar(['b', 'a']);
    expect(db.customExam.create).toHaveBeenCalledTimes(1);
  });
});
