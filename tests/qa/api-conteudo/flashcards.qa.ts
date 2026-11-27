/* Integração das rotas app/api/flashcards/** com banco, sessão e IA de mentira. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';
import { POST as criarCartoes } from '@/app/api/flashcards/cards/route';
import { GET as listarBaralhos, POST as criarBaralho } from '@/app/api/flashcards/decks/route';
import { DELETE as apagarBaralho, GET as abrirBaralho, PATCH as marcarCapitulo } from '@/app/api/flashcards/decks/[id]/route';
import { POST as doErro } from '@/app/api/flashcards/do-erro/route';
import { POST as gerar } from '@/app/api/flashcards/gerar/route';
import { POST as progresso } from '@/app/api/flashcards/progresso/route';
import { GET as revisao } from '@/app/api/flashcards/revisao/route';

const { pedirJson } = vi.hoisted(() => ({ pedirJson: vi.fn() }));
vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/pedir-json', () => ({ pedirJson }));

const BARALHOS = [
  { id: 'meu', userId: 'aluno-1', isDefault: false, materia: 'Biologia', subtema: null, nome: 'Meu', capituloLido: 0 },
  { id: 'alheio', userId: 'outro', isDefault: false, materia: 'Química', subtema: null, nome: 'Alheio', capituloLido: 0 },
  { id: 'padrao', userId: null, isDefault: true, materia: 'Física', subtema: null, nome: 'Padrão', capituloLido: 0 },
];

/* Imita o Prisma: `id: undefined` no filtro é ignorado; OR precisa bater em pelo menos um ramo. */
function bancoComBaralhos(papel = 'user') {
  bancoFalso.user.findUnique.mockResolvedValue({ id: 'aluno-1', role: papel });
  bancoFalso.flashcardDeck.findFirst.mockImplementation(async ({ where }: any) =>
    BARALHOS.find((d: any) =>
      (typeof where.id !== 'string' || d.id === where.id) &&
      (!where.OR || where.OR.some((ramo: any) => Object.entries(ramo).every(([k, v]) => d[k] === v))),
    ) ?? null,
  );
}

beforeEach(() => {
  zerar();
  pedirJson.mockReset().mockResolvedValue({ ok: true, dado: [{ frente: 'O que é mitose?', verso: 'Divisão celular', dica: null }] });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('sem sessão', () => {
  it.each([
    ['cards', () => criarCartoes(pedido('/c', { deckId: 'meu', cards: [] }))],
    ['decks GET', () => listarBaralhos()],
    ['decks POST', () => criarBaralho(pedido('/d', { nome: 'x', materia: 'y' }))],
    ['deck GET', () => abrirBaralho(pedido('/d/meu'), { params: { id: 'meu' } })],
    ['deck PATCH', () => marcarCapitulo(pedido('/d/meu', { capituloLido: 1 }, 'PATCH'), { params: { id: 'meu' } })],
    ['deck DELETE', () => apagarBaralho(pedido('/d/meu', undefined, 'DELETE'), { params: { id: 'meu' } })],
    ['do-erro', () => doErro(pedido('/e', { materia: 'a', pergunta: 'b', resposta: 'c' }))],
    ['gerar', () => gerar(pedido('/g', { deckId: 'meu' }))],
    ['progresso', () => progresso(pedido('/p', { cardId: 'c', acertou: true }))],
    ['revisao', () => revisao()],
  ])('%s devolve 401 e não grava', async (_n, chamar) => {
    const r = await chamar();
    expect(r.status).toBe(401);
    expect(gravacoes()).toEqual([]);
    expect(pedirJson).not.toHaveBeenCalled();
  });
});

describe('POST cards: dono do baralho', () => {
  const um = [{ frente: 'f', verso: 'v' }];
  it.each([
    ['user', 'meu', 200],
    ['user', 'alheio', 404],
    ['user', 'padrao', 404],
    ['admin', 'padrao', 200],
    ['admin', 'alheio', 404],
    ['user', 'inexistente', 404],
  ])('papel %s no baralho %s devolve %i', async (papel, deckId, status) => {
    entrarComo({ role: papel });
    bancoComBaralhos(papel);
    const r = await criarCartoes(pedido('/c', { deckId, cards: um }));
    expect(r.status).toBe(status);
    expect(gravacoes()).toEqual(status === 200 ? ['flashcard.createMany'] : []);
  });

  it.each([
    ['ausente', undefined],
    ['objeto', { not: 'x' }],
  ])('BUG-C1: deckId %s é recusado com 400, sem gravar em baralho sorteado', async (_n, deckId) => {
    entrarComo();
    bancoComBaralhos();
    const r = await criarCartoes(pedido('/c', { deckId, cards: um }));
    expect(gravacoes()).toEqual([]);
    expect(r.status).toBe(400);
  });
});

describe('POST cards: limites', () => {
  beforeEach(() => { entrarComo(); bancoComBaralhos(); });
  const n = (q: number) => Array.from({ length: q }, (_, i) => ({ frente: `f${i}`, verso: 'v' }));

  it.each([[0, 400], [1, 200], [50, 200], [51, 400]])('%i cartões devolve %i', async (q, status) => {
    expect((await criarCartoes(pedido('/c', { deckId: 'meu', cards: n(q) }))).status).toBe(status);
  });

  it.each([['texto', 'abc'], ['nulo', null], ['só espaços', [{ frente: '  ', verso: '  ' }]], ['itens nulos', [null, 3]]])(
    'cards %s devolve 400', async (_n, cards) => {
      expect((await criarCartoes(pedido('/c', { deckId: 'meu', cards }))).status).toBe(400);
      expect(gravacoes()).toEqual([]);
    });

  it('corta frente, verso e dica no teto e continua a numeração', async () => {
    bancoFalso.flashcard.findFirst.mockResolvedValue({ ordem: 7 });
    await criarCartoes(pedido('/c', { deckId: 'meu', cards: [{ frente: 'a'.repeat(1001), verso: 'b'.repeat(2001), dica: 'c'.repeat(501) }, { frente: 'x', verso: 'y' }] }));
    const { data } = bancoFalso.flashcard.createMany.mock.calls[0][0];
    expect([data[0].frente.length, data[0].verso.length, data[0].dica.length]).toEqual([1000, 2000, 500]);
    expect(data.map((c: any) => c.ordem)).toEqual([8, 9]);
  });
});

describe('POST gerar', () => {
  beforeEach(() => { entrarComo(); bancoComBaralhos(); });

  it.each(['alheio', 'padrao'])('baralho %s não gasta IA', async (deckId) => {
    expect((await gerar(pedido('/g', { deckId }))).status).toBe(404);
    expect(pedirJson).not.toHaveBeenCalled();
  });

  it('BUG-C1: sem deckId devolve 400 antes de gastar IA', async () => {
    const r = await gerar(pedido('/g', {}));
    expect(pedirJson).not.toHaveBeenCalled();
    expect(r.status).toBe(400);
  });

  it.each([[undefined, 10], [0, 10], [-5, 1], [1, 1], [30, 30], [31, 30], [500, 30], ['abc', 10]])(
    'quantidade %s pede %i à IA', async (quantidade, esperado) => {
      await gerar(pedido('/g', { deckId: 'meu', quantidade }));
      expect(pedirJson.mock.calls[0][0]).toContain(`Crie ${esperado} flashcards`);
    });

  it('corta o tópico em 300 caracteres e não grava nada', async () => {
    await gerar(pedido('/g', { deckId: 'meu', topico: 'z'.repeat(5000) }));
    expect(pedirJson.mock.calls[0][0]).toContain('z'.repeat(300));
    expect(pedirJson.mock.calls[0][0]).not.toContain('z'.repeat(301));
    expect(gravacoes()).toEqual([]);
  });

  it('descarta candidato repetido contra o baralho e dentro do lote', async () => {
    bancoFalso.flashcard.findMany.mockResolvedValue([{ frente: 'O que é mitose?' }]);
    pedirJson.mockResolvedValue({ ok: true, dado: [
      { frente: 'O que é mitose?', verso: 'a', dica: null },
      { frente: 'Função da mitocôndria', verso: 'b', dica: null },
      { frente: 'Função da mitocôndria', verso: 'c', dica: null },
    ] });
    const j = await (await gerar(pedido('/g', { deckId: 'meu' }))).json();
    expect(j.candidatos.map((c: any) => c.verso)).toEqual(['b']);
    expect(j.descartadosPorDuplicata).toBe(2);
  });

  it('repassa o status de falha da IA', async () => {
    pedirJson.mockResolvedValue({ ok: false, erro: 'cheio', status: 429 });
    expect((await gerar(pedido('/g', { deckId: 'meu' }))).status).toBe(429);
  });
});

describe('POST progresso', () => {
  beforeEach(() => { entrarComo(); bancoFalso.user.findUnique.mockResolvedValue({ id: 'aluno-1', role: 'user' }); });

  it.each([{}, { cardId: 'c' }, { cardId: 'c', acertou: 'sim' }, { cardId: '', acertou: true }])(
    'corpo %j devolve 400', async (corpo) => {
      expect((await progresso(pedido('/p', corpo))).status).toBe(400);
      expect(gravacoes()).toEqual([]);
    });

  it('acerto limpa só as revisões do próprio aluno naquele cartão', async () => {
    await progresso(pedido('/p', { cardId: 'c1', acertou: true }));
    expect(bancoFalso.flashcardProgress.updateMany.mock.calls[0][0].where).toEqual({ userId: 'aluno-1', cardId: 'c1', precisaRevisar: true });
  });

  it('erro marca para revisar sem limpar nada', async () => {
    await progresso(pedido('/p', { cardId: 'c1', acertou: false }));
    expect(gravacoes()).toEqual(['flashcardProgress.create']);
    expect(bancoFalso.flashcardProgress.create.mock.calls[0][0].data.precisaRevisar).toBe(true);
  });

  it('BUG-C3: cardId objeto devolve 400 sem limpar a revisão de todos os cartões', async () => {
    bancoFalso.flashcardProgress.create.mockRejectedValue(new Error('PrismaClientValidationError'));
    const r = await progresso(pedido('/p', { cardId: { not: '' }, acertou: true }));
    expect(bancoFalso.flashcardProgress.updateMany).not.toHaveBeenCalled();
    expect(r.status).toBe(400);
  });

  it('BUG-C4: cartão inexistente devolve 4xx, não 500', async () => {
    bancoFalso.flashcardProgress.create.mockRejectedValue(Object.assign(new Error('Foreign key constraint failed'), { code: 'P2003' }));
    const r = await progresso(pedido('/p', { cardId: 'nao-existe', acertou: false }));
    expect([400, 404]).toContain(r.status);
  });
});

describe('baralhos', () => {
  beforeEach(() => { entrarComo(); bancoComBaralhos(); });

  it('lista soma acertos, erros pendentes e restantes por cartão único', async () => {
    bancoFalso.flashcardDeck.findMany.mockResolvedValue([{ ...BARALHOS[0], cards: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] }]);
    bancoFalso.flashcardProgress.findMany.mockResolvedValue([
      { cardId: 'a', acertou: true, precisaRevisar: false }, { cardId: 'a', acertou: true, precisaRevisar: false },
      { cardId: 'b', acertou: false, precisaRevisar: true },
    ]);
    const { decks } = await (await listarBaralhos()).json();
    expect(decks[0]).toMatchObject({ totalCards: 3, acertos: 1, erros: 1, restantes: 2 });
    expect(bancoFalso.flashcardDeck.findMany.mock.calls[0][0].where).toEqual({ OR: [{ isDefault: true }, { userId: 'aluno-1' }] });
  });

  it('criar grava com o dono da sessão, ignorando userId e isDefault do corpo', async () => {
    await criarBaralho(pedido('/d', { nome: 'N', materia: 'M', userId: 'outro', isDefault: true }));
    const { data } = bancoFalso.flashcardDeck.create.mock.calls[0][0];
    expect(data.userId).toBe('aluno-1');
    expect(data.isDefault).toBeUndefined();
  });

  it.each([{}, { nome: 'N' }, { materia: 'M' }, { nome: '', materia: 'M' }])('criar com %j devolve 400', async (corpo) => {
    expect((await criarBaralho(pedido('/d', corpo))).status).toBe(400);
  });

  it.each([
    ['nome numérico', { nome: 123, materia: 'M' }],
    ['nome só de espaços', { nome: '    ', materia: 'M' }],
    ['nome de 100 mil letras', { nome: 'a'.repeat(100_000), materia: 'M' }],
  ])('BUG-C20: criar com %s devolve 400', async (_n, corpo) => {
    const r = await criarBaralho(pedido('/d', corpo));
    expect(r.status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });

  it('abrir baralho alheio devolve 404', async () => {
    expect((await abrirBaralho(pedido('/d/alheio'), { params: { id: 'alheio' } })).status).toBe(404);
  });

  it('capítulo não lido fica trancado e modo revisar traz só os errados', async () => {
    bancoFalso.flashcardDeck.findFirst.mockImplementation(async () => ({
      ...BARALHOS[0], capituloLido: 1,
      cards: [{ id: 'a', capitulo: 1, ordem: 0 }, { id: 'b', capitulo: 3, ordem: 1 }, { id: 'c', capitulo: 2, ordem: 2 }, { id: 'd', capitulo: null, ordem: 3 }],
    }));
    bancoFalso.flashcardProgress.findMany.mockResolvedValue([{ cardId: 'a', acertou: false, precisaRevisar: true, dataResposta: new Date() }]);
    const j = await (await abrirBaralho(pedido('/d/meu?mode=revisar'), { params: { id: 'meu' } })).json();
    expect(j.deck).toMatchObject({ trancados: 2, proximoCapitulo: 2 });
    expect(j.totalCards).toBe(2);
    expect(j.cards.map((c: any) => c.id)).toEqual(['a']);
  });

  it('deck virtual "revisao" sem histórico vem vazio', async () => {
    const j = await (await abrirBaralho(pedido('/d/revisao'), { params: { id: 'revisao' } })).json();
    expect(j).toMatchObject({ totalCards: 0, cards: [] });
  });

  it('deck virtual "dia" só busca baralhos padrão ou do próprio aluno', async () => {
    const r = await abrirBaralho(pedido('/d/dia'), { params: { id: 'dia' } });
    expect(r.status).toBe(200);
    expect(bancoFalso.flashcardDeck.findMany.mock.calls[0][0].where.OR).toEqual([{ isDefault: true }, { userId: 'aluno-1' }]);
  });

  it.each([[-1, 400], [0, 200], [500, 200], [501, 400], [1.5, 400], ['3', 400], [null, 400]])(
    'capituloLido %s devolve %i', async (capituloLido, status) => {
      bancoFalso.flashcardDeck.updateMany.mockResolvedValue({ count: 1 });
      expect((await marcarCapitulo(pedido('/d/meu', { capituloLido }, 'PATCH'), { params: { id: 'meu' } })).status).toBe(status);
    });

  it('marcar capítulo em baralho alheio devolve 404', async () => {
    expect((await marcarCapitulo(pedido('/d/alheio', { capituloLido: 1 }, 'PATCH'), { params: { id: 'alheio' } })).status).toBe(404);
  });

  it('apagar filtra pelo dono e nunca pega baralho padrão', async () => {
    await apagarBaralho(pedido('/d/padrao', undefined, 'DELETE'), { params: { id: 'padrao' } });
    expect(bancoFalso.flashcardDeck.deleteMany.mock.calls[0][0].where).toEqual({ id: 'padrao', userId: 'aluno-1', isDefault: false });
  });

  it('BUG-C19: apagar baralho alheio (nada apagado) devolve 404, não sucesso', async () => {
    bancoFalso.flashcardDeck.deleteMany.mockResolvedValue({ count: 0 });
    const r = await apagarBaralho(pedido('/d/alheio', undefined, 'DELETE'), { params: { id: 'alheio' } });
    expect(r.status).toBe(404);
  });
});

describe('POST do-erro', () => {
  const corpo = { materia: 'Física', pergunta: 'P?', resposta: 'R' };
  beforeEach(() => entrarComo());

  it.each([null, '{quebrado', {}, { ...corpo, materia: 3 }, { ...corpo, pergunta: '   ' }])('corpo %j devolve 400', async (c) => {
    expect((await doErro(pedido('/e', c, 'POST'))).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });

  it('cria baralho do aluno e cartão marcado para revisar, com textos no teto', async () => {
    const r = await doErro(pedido('/e', { materia: 'm'.repeat(41), pergunta: 'p'.repeat(301), resposta: 'r'.repeat(401) }));
    expect(await r.json()).toEqual({ cardId: 'novo', novo: true });
    expect(bancoFalso.flashcardDeck.create.mock.calls[0][0].data).toMatchObject({ userId: 'aluno-1', materia: 'm'.repeat(40) });
    const { data } = bancoFalso.flashcard.create.mock.calls[0][0];
    expect([data.frente.length, data.verso.length, data.ordem]).toEqual([300, 400, 0]);
    expect(bancoFalso.flashcardProgress.create.mock.calls[0][0].data).toMatchObject({ userId: 'aluno-1', precisaRevisar: true });
  });

  it('mesma pergunta não duplica', async () => {
    bancoFalso.flashcardDeck.findFirst.mockResolvedValue({ id: 'meu' });
    bancoFalso.flashcard.findFirst.mockResolvedValue({ id: 'velho' });
    expect(await (await doErro(pedido('/e', corpo))).json()).toEqual({ cardId: 'velho', novo: false });
    expect(gravacoes()).toEqual([]);
  });

  it('banco fora devolve 500 sem vazar o erro', async () => {
    bancoFalso.flashcardDeck.findFirst.mockRejectedValue(new Error('segredo-do-banco'));
    const r = await doErro(pedido('/e', corpo));
    expect(r.status).toBe(500);
    expect(await r.text()).not.toContain('segredo-do-banco');
  });
});

describe('JSON inválido ou nulo', () => {
  beforeEach(() => { entrarComo(); bancoComBaralhos(); });
  const rotas: [string, (c: string) => Promise<Response>][] = [
    ['cards', (c) => criarCartoes(pedido('/c', c))],
    ['decks POST', (c) => criarBaralho(pedido('/d', c))],
    ['deck PATCH', (c) => marcarCapitulo(pedido('/d/meu', c, 'PATCH'), { params: { id: 'meu' } })],
    ['gerar', (c) => gerar(pedido('/g', c))],
    ['progresso', (c) => progresso(pedido('/p', c))],
  ];
  describe.each(rotas)('%s', (_n, chamar) => {
    it.each(['{quebrado', 'null'])('BUG-C5: corpo %s devolve 400, não 500', async (c) => {
      expect((await chamar(c)).status).toBe(400);
    });
  });
});
