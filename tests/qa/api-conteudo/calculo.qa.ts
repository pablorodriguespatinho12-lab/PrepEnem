/* Rotas app/api/calculo/** e as libs de estado, repositório e validação de lição. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';
import { POST as duvida } from '@/app/api/calculo/duvida/route';
import { POST as registrar } from '@/app/api/calculo/progresso/route';
import { GET as revisao } from '@/app/api/calculo/revisao/route';
import { GET as trilha } from '@/app/api/calculo/trilha/route';
import { GET as licao } from '@/app/api/calculo/licao/[id]/route';
import { lerEstados, salvarEstado } from '@/lib/calculo/estados';
import { obterLicao } from '@/lib/calculo/repositorio';
import { validarLicao, validarResposta } from '@/lib/calculo/validar';
import { TRILHA } from '@/data/calculo/trilha';
import { LICOES_ESCRITAS } from '@/data/calculo/licoes';

const { pedirJson, resolver } = vi.hoisted(() => ({ pedirJson: vi.fn(), resolver: vi.fn() }));
vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/pedir-json', () => ({ pedirJson }));
vi.mock('@/lib/verificar-respostas', async (original) => ({ ...(await original<object>()), resolverIndependente: resolver }));

const ESCRITA = Object.keys(LICOES_ESCRITAS)[0];
const SEM_TEXTO = TRILHA.find((d) => !(d.id in LICOES_ESCRITAS))?.id;
const linha = (licaoId: string, extra: object = {}) => ({ licaoId, status: 'concluida', acertos: 3, tentativas: 1, revisoes: 0, proximaRevisao: new Date('2000-01-01'), ...extra });

beforeEach(() => {
  zerar();
  pedirJson.mockReset().mockResolvedValue({ ok: false, erro: 'cheio', status: 429 });
  resolver.mockReset().mockResolvedValue(null);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { delete process.env.CALCULO_LICAO_IA; });

describe('sem sessão', () => {
  it.each([
    ['duvida', () => duvida(pedido('/d', {}))],
    ['progresso', () => registrar(pedido('/p', {}))],
    ['revisao', () => revisao()],
    ['trilha', () => trilha()],
    ['licao', () => licao(pedido('/l'), { params: { id: ESCRITA } })],
  ])('%s devolve 401', async (_n, chamar) => {
    expect((await chamar()).status).toBe(401);
    expect(gravacoes()).toEqual([]);
    expect(pedirJson).not.toHaveBeenCalled();
  });
});

describe('progresso', () => {
  beforeEach(() => entrarComo());
  const chamar = (c: unknown) => registrar(pedido('/p', c, 'POST'));

  it.each(['{x', 'null', {}, { licaoId: 'nao-existe', total: 1, acertos: 1 }, { licaoId: { not: 'x' } }])('corpo %j devolve 400', async (c) => {
    expect((await chamar(c)).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });

  it.each([
    [1, 0, 200], [1, 1, 200], [20, 20, 200], [0, 0, 400], [21, 1, 400], [5, 6, 400], [5, -1, 400], [5, 2.5, 400], [undefined, 1, 400], ['x', 1, 400],
  ])('total %s e acertos %s devolve %i', async (total, acertos, status) => {
    expect((await chamar({ licaoId: ESCRITA, total, acertos })).status).toBe(status);
  });

  it('grava no usuário da sessão', async () => {
    await chamar({ licaoId: ESCRITA, total: 3, acertos: 3, userId: 'outro' });
    expect(bancoFalso.calculoProgresso.upsert.mock.calls[0][0].where).toEqual({ userId_licaoId: { userId: 'aluno-1', licaoId: ESCRITA } });
  });

  it.each([['nunca feita', []], ['em andamento', [linha(ESCRITA, { status: 'em_andamento' })]]])(
    'revisão de lição %s devolve 400', async (_n, linhas) => {
      bancoFalso.calculoProgresso.findMany.mockResolvedValue(linhas);
      expect((await chamar({ licaoId: ESCRITA, tipo: 'revisao', acertou: true })).status).toBe(400);
      expect(gravacoes()).toEqual([]);
    });

  it('revisão de lição concluída grava', async () => {
    bancoFalso.calculoProgresso.findMany.mockResolvedValue([linha(ESCRITA)]);
    expect((await chamar({ licaoId: ESCRITA, tipo: 'revisao', acertou: true })).status).toBe(200);
    expect(gravacoes()).toEqual(['calculoProgresso.upsert']);
  });
});

describe('duvida', () => {
  beforeEach(() => entrarComo());
  const boa = { licaoId: ESCRITA, historico: [{ papel: 'aluno', texto: 'não entendi' }] };

  it.each(['{x', 'null', {}, { ...boa, licaoId: 'zz' }, { ...boa, historico: [] }, { ...boa, historico: [{ papel: 'tutor', texto: 'a' }] }])(
    'pedido %j devolve 400 sem IA', async (c) => {
      expect((await duvida(pedido('/d', c, 'POST'))).status).toBe(400);
      expect(pedirJson).not.toHaveBeenCalled();
    });

  it('corta o trecho da tela em 1500 caracteres', async () => {
    await duvida(pedido('/d', { ...boa, naTela: '§'.repeat(100_000) }));
    expect(pedirJson.mock.calls[0][0].match(/§/g)).toHaveLength(1500);
  });
});

describe('trilha, lição e revisão', () => {
  beforeEach(() => entrarComo());

  it('trilha traz todos os degraus e o estado do aluno', async () => {
    bancoFalso.calculoProgresso.findMany.mockResolvedValue([linha(ESCRITA)]);
    const j = await (await trilha()).json();
    expect(j.degraus).toHaveLength(TRILHA.length);
    expect(j.degraus.find((d: any) => d.id === ESCRITA)).toMatchObject({ acertos: 3, escrita: true });
    expect(j.revisoesPendentes).toBe(1);
    expect(bancoFalso.calculoProgresso.findMany.mock.calls[0][0].where).toEqual({ userId: 'aluno-1' });
  });

  it('lição desconhecida devolve 404', async () => {
    expect((await licao(pedido('/l'), { params: { id: 'zz' } })).status).toBe(404);
  });

  it('lição escrita abre sem gastar IA', async () => {
    const j = await (await licao(pedido('/l'), { params: { id: ESCRITA } })).json();
    expect(j.licao.origem).toBe('escrita');
    expect(pedirJson).not.toHaveBeenCalled();
  });

  it('revisão traz no máximo 6 questões, uma por lição vencida', async () => {
    const ids = Object.keys(LICOES_ESCRITAS).slice(0, 8);
    bancoFalso.calculoProgresso.findMany.mockResolvedValue(ids.map((id) => linha(id)));
    const { questoes } = await (await revisao()).json();
    expect(questoes).toHaveLength(Math.min(ids.length, 6));
    expect(new Set(questoes.map((q: any) => q.licaoId)).size).toBe(questoes.length);
  });

  it('revisão pula lição que não existe mais', async () => {
    bancoFalso.calculoProgresso.findMany.mockResolvedValue([linha('apagada')]);
    expect(await (await revisao()).json()).toEqual({ questoes: [] });
  });
});

describe('estados', () => {
  it('status desconhecido vira em_andamento', async () => {
    bancoFalso.calculoProgresso.findMany.mockResolvedValue([linha('a', { status: 'lixo' }), linha('b')]);
    const m = await lerEstados('u');
    expect([m.get('a')?.status, m.get('b')?.status]).toEqual(['em_andamento', 'concluida']);
  });
  it('salvar não leva campo estranho para o banco', async () => {
    await salvarEstado('u', { ...(linha('a') as any), extra: 1 });
    expect(Object.keys(bancoFalso.calculoProgresso.upsert.mock.calls[0][0].update).sort())
      .toEqual(['acertos', 'proximaRevisao', 'revisoes', 'status', 'tentativas']);
  });
});

const passo = (lacuna = false) => ({ texto: 'Então x = 4.', porque: 'porque soma', ...(lacuna ? { lacuna: { pergunta: 'x?', resposta: { tipo: 'numero', valor: 4 } } } : {}) });
const LICAO = {
  gancho: { pergunta: 'p', ideia: 'i' }, resumo: 'r', recuperacao: { pergunta: 'p', resposta: 'r' },
  construcao: [1, 2, 3].map((i) => ({ titulo: `t${i}`, texto: 'x' })),
  exemplos: [0, 1, 2].map((i) => ({ enunciado: 'e', passos: [passo(i > 0), passo()] })),
  exercicios: [1, 2, 3].map((i) => ({ enunciado: `quanto? ${i}`, resposta: { tipo: 'numero', valor: 4 }, resolucao: [{ texto: 'Logo x = 4.', porque: 'conta' }] })),
};

describe('validar lição', () => {
  it.each([
    [{ tipo: 'numero', valor: 'abc' }], [{ tipo: 'escolha', opcoes: ['a'], correta: 0 }], [{ tipo: 'escolha', opcoes: ['a', 'b'], correta: 2 }],
    [{ tipo: 'escolha', opcoes: ['a', 'b'], correta: -1 }], [{ tipo: 'escolha', opcoes: ['a', 'b'], correta: 0.5 }],
    [{ tipo: 'desenho', reta: { a: 0, b: 0 } }], [{ tipo: 'desenho', reta: { a: 5, b: 0 } }], [{ tipo: 'outro' }], [null],
  ])('resposta %j é recusada', (r) => expect(validarResposta(r)).toBeNull());

  it('aceita lição completa', () => expect(validarLicao(LICAO)).not.toBeNull());

  it.each([
    ['2 exercícios', { exercicios: LICAO.exercicios.slice(0, 2) }], ['2 exemplos', { exemplos: LICAO.exemplos.slice(0, 2) }],
    ['2 passos de construção', { construcao: LICAO.construcao.slice(0, 2) }], ['sem resumo', { resumo: '' }],
  ])('recusa lição com %s', (_n, troca) => expect(validarLicao({ ...LICAO, ...troca })).toBeNull());
});

describe('repositório: lição gerada pela IA', () => {
  const caso = SEM_TEXTO ? it : it.todo;

  caso('desligada por padrão: 404 sem gastar IA', async () => {
    expect(await obterLicao(SEM_TEXTO!)).toMatchObject({ ok: false, status: 404 });
    expect(pedirJson).not.toHaveBeenCalled();
  });

  caso('salva válida no banco é usada sem IA', async () => {
    bancoFalso.calculoLicaoGerada.findUnique.mockResolvedValue({ conteudo: LICAO });
    expect(await obterLicao(SEM_TEXTO!)).toMatchObject({ ok: true, dado: { origem: 'ia' } });
    expect(pedirJson).not.toHaveBeenCalled();
  });

  caso('segundo modelo fora do ar: 502 e nada salvo', async () => {
    process.env.CALCULO_LICAO_IA = '1';
    pedirJson.mockResolvedValue({ ok: true, dado: validarLicao(LICAO) });
    expect(await obterLicao(SEM_TEXTO!)).toMatchObject({ ok: false, status: 502 });
    expect(gravacoes()).toEqual([]);
  });

  caso('segundo modelo discorda de um exercício e sobram 2: não salva', async () => {
    process.env.CALCULO_LICAO_IA = '1';
    pedirJson.mockResolvedValue({ ok: true, dado: validarLicao(LICAO) });
    resolver.mockResolvedValue([{ valor: 4 }, { valor: 4 }, { valor: 9 }, { valor: 4 }, { valor: 4 }]);
    expect((await obterLicao(SEM_TEXTO!)).ok).toBe(false);
    expect(gravacoes()).toEqual([]);
  });

  caso('3 confirmados: salva, e lacuna discordante vira passo resolvido', async () => {
    process.env.CALCULO_LICAO_IA = '1';
    pedirJson.mockResolvedValue({ ok: true, dado: validarLicao(LICAO) });
    resolver.mockResolvedValue([{ valor: 4 }, { valor: 4 }, { valor: 4 }, { valor: 9 }, { valor: 4 }]);
    const r = await obterLicao(SEM_TEXTO!);
    expect(r.ok && r.dado.conteudo.exemplos.map((e) => e.passos.filter((p) => p.lacuna).length)).toEqual([0, 0, 1]);
    expect(gravacoes()).toEqual(['calculoLicaoGerada.upsert']);
  });
});
