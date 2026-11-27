/* Login, limite de senha e sessão: valores limite (4/5 por IP, 29/30 no total,
   janela de 15 min) e tabelas de decisão. */
import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { bancoFalso, zerar } from '../apoio/banco-falso';
import { ERROS_NO_TOTAL, ERROS_POR_IP, JANELA_MS, MSG_BLOQUEIO, bloqueado, hashDoIp, ipDoPedido } from '@/lib/limite-login';
import { authOptions } from '@/lib/auth';

vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));

const SENHA = 'senha-certa';
const usuario = { id: 'u1', username: 'ana', email: null, name: 'Ana', role: 'user', themeColor: 'azul', password: bcrypt.hashSync(SENHA, 4) };

/** Tabela TentativaLogin em memória. */
function tentativasEmMemoria() {
  let linhas: { ipHash: string; criadaEm: Date }[] = [];
  bancoFalso.tentativaLogin.count.mockImplementation(async ({ where }: any) =>
    linhas.filter((l) => (!where.ipHash || l.ipHash === where.ipHash) && l.criadaEm >= where.criadaEm.gte).length);
  bancoFalso.tentativaLogin.create.mockImplementation(async ({ data }: any) => {
    linhas = [...linhas, { ...data, criadaEm: new Date() }];
  });
  bancoFalso.tentativaLogin.deleteMany.mockImplementation(async ({ where }: any) => {
    linhas = linhas.filter((l) => (where.ipHash ? l.ipHash !== where.ipHash : l.criadaEm >= where.criadaEm.lt));
    return { count: 0 };
  });
  return {
    por: (ip: string, quantas: number, haMs = 0) => {
      linhas = [...linhas, ...Array.from({ length: quantas }, () => ({ ipHash: hashDoIp(ip), criadaEm: new Date(Date.now() - haMs) }))];
    },
    total: () => linhas.length,
  };
}

const autorizar = (authOptions.providers[0] as any).options.authorize as (c: any, r: any) => Promise<any>;
const tentar = (password: string, username = 'ana', ip = '1.1.1.1') =>
  autorizar({ username, password }, { headers: { 'x-forwarded-for': ip } });

beforeEach(() => {
  zerar();
  bancoFalso.user.findUnique.mockImplementation(async ({ where }: any) => (where.username === 'ana' || where.id === 'u1' ? usuario : null));
});

describe('IP do pedido (partições)', () => {
  it.each([
    [{ 'x-forwarded-for': '9.9.9.9, 10.0.0.1' }, '9.9.9.9'],
    [{ 'x-forwarded-for': ['8.8.8.8'] }, '8.8.8.8'],
    [{ 'x-real-ip': '7.7.7.7' }, '7.7.7.7'],
    [{ 'x-forwarded-for': '' }, 'sem-ip'],
    [undefined, 'sem-ip'],
  ])('%j -> %s', (headers, esperado) => expect(ipDoPedido(headers as any)).toBe(esperado));

  it('guarda só o hash, nunca o IP', () => {
    expect(hashDoIp('9.9.9.9')).toMatch(/^[0-9a-f]{64}$/);
    expect(hashDoIp('9.9.9.9')).not.toContain('9.9.9.9');
  });
});

describe('bloqueio (valores limite)', () => {
  it.each([
    [ERROS_POR_IP - 1, false],
    [ERROS_POR_IP, true],
    [ERROS_POR_IP + 1, true],
  ])('%i erros do mesmo IP -> bloqueado %s', async (n, esperado) => {
    tentativasEmMemoria().por('1.1.1.1', n);
    expect(await bloqueado(hashDoIp('1.1.1.1'))).toBe(esperado);
  });

  it.each([
    [ERROS_NO_TOTAL - 1, false],
    [ERROS_NO_TOTAL, true],
  ])('%i erros de IPs diferentes -> bloqueia todos: %s', async (n, esperado) => {
    const t = tentativasEmMemoria();
    for (let i = 0; i < n; i += 1) t.por(`10.0.0.${i}`, 1);
    expect(await bloqueado(hashDoIp('2.2.2.2'))).toBe(esperado);
  });

  it('erro mais velho que a janela não conta', async () => {
    tentativasEmMemoria().por('1.1.1.1', ERROS_POR_IP, JANELA_MS + 1000);
    expect(await bloqueado(hashDoIp('1.1.1.1'))).toBe(false);
  });
});

describe('authorize', () => {
  it('senha certa entra e não devolve o hash', async () => {
    tentativasEmMemoria();
    const u = await tentar(SENHA);
    expect(u).toMatchObject({ id: 'u1', username: 'ana' });
    expect(u.password).toBeUndefined();
  });

  it.each([['errada', 'ana'], [SENHA, 'ninguem']])('senha %s, usuário %s -> recusa e anota o erro', async (senha, nome) => {
    const t = tentativasEmMemoria();
    expect(await tentar(senha, nome)).toBeNull();
    expect(t.total()).toBe(1);
  });

  it.each([['', 'ana'], [SENHA, '']])('campo vazio -> recusa sem consultar o banco', async (senha, nome) => {
    expect(await tentar(senha, nome)).toBeNull();
    expect(bancoFalso.user.findUnique).not.toHaveBeenCalled();
  });

  it('bloqueado não entra nem com a senha certa', async () => {
    tentativasEmMemoria().por('1.1.1.1', ERROS_POR_IP);
    await expect(tentar(SENHA)).rejects.toThrow(MSG_BLOQUEIO);
  });

  it('entrar certo zera os erros daquele IP', async () => {
    const t = tentativasEmMemoria();
    t.por('1.1.1.1', ERROS_POR_IP - 1);
    await tentar(SENHA);
    expect(t.total()).toBe(0);
  });

  it(`BUG-S1: tentativas ao mesmo tempo não passam de ${ERROS_POR_IP} conferências de senha`, async () => {
    tentativasEmMemoria();
    const respostas = await Promise.allSettled(Array.from({ length: 20 }, () => tentar('errada')));
    const conferidas = respostas.filter((r) => r.status === 'fulfilled').length;
    expect(conferidas).toBeLessThanOrEqual(ERROS_POR_IP);
  });
});

describe('lista de usuários permitidos', () => {
  afterEach(() => vi.unstubAllEnvs());
  const signIn = (username: string) => (authOptions.callbacks!.signIn as any)({ user: { username } });

  it.each([
    ['', 'qualquer', true],
    ['ana', 'ana', true],
    [' ana , bia ', 'bia', true],
    ['ana,bia', 'caio', false],
    ['ana', 'an', false],
    [',', 'ana', false],
  ])('ALLOWED_USERS=%j, %s -> %s', async (lista, nome, esperado) => {
    vi.stubEnv('ALLOWED_USERS', lista);
    expect(await signIn(nome)).toBe(esperado);
  });
});

describe('sessão', () => {
  const jwt = authOptions.callbacks!.jwt as any;
  const session = authOptions.callbacks!.session as any;

  it('token recente não consulta o banco', async () => {
    await jwt({ token: { id: 'u1', lastValidated: Date.now() } });
    expect(bancoFalso.user.findUnique).not.toHaveBeenCalled();
  });

  it('conta apagada derruba a sessão', async () => {
    const token = await jwt({ token: { id: 'sumiu', lastValidated: 0 } });
    expect(token.error).toBe('UserNotFound');
    expect((await session({ session: { user: {} }, token })).user).toBeUndefined();
  });

  it('banco fora do ar mantém a sessão', async () => {
    bancoFalso.user.findUnique.mockRejectedValue(new Error('fora do ar'));
    vi.spyOn(console, 'error').mockImplementationOnce(() => {});
    const token = await jwt({ token: { id: 'u1', lastValidated: 0 } });
    expect(token.error).toBeUndefined();
  });

  it('atualizar a sessão pelo navegador não vira administrador', async () => {
    const token = await jwt({ token: { id: 'u1', role: 'user', lastValidated: Date.now() }, trigger: 'update', session: { role: 'admin', id: 'outro' } });
    expect(token).toMatchObject({ role: 'user', id: 'u1' });
  });
});
