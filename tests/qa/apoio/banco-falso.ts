/* Banco de mentira para os testes de API: nenhum teste desta pasta conversa com
   o Neon. `bancoFalso.question.findMany` nasce como vi.fn() no primeiro acesso;
   método sem resposta combinada devolve o padrão do Prisma (lista vazia, nulo,
   zero). Uso no arquivo de teste:

     vi.mock('@/lib/db', async () => ({ prisma: (await import('./apoio/banco-falso')).bancoFalso }));
     vi.mock('next-auth', async () => (await import('./apoio/banco-falso')).nextAuthFalso);
     beforeEach(() => zerar());
*/
import { vi, type Mock } from 'vitest';

type Modelo = Record<string, Mock>;

const modelos = new Map<string, Modelo>();
const ESCRITAS = /^(create|createMany|update|updateMany|upsert|delete|deleteMany|\$executeRaw|\$executeRawUnsafe)$/;

function respostaPadrao(metodo: string): unknown {
  if (metodo === 'findMany' || metodo === 'groupBy') return [];
  if (metodo === 'count') return 0;
  if (metodo === 'aggregate') return {};
  if (metodo === 'createMany' || metodo === 'updateMany' || metodo === 'deleteMany') return { count: 0 };
  if (metodo.startsWith('find')) return null;
  return { id: 'novo' };
}

function modelo(nome: string): Modelo {
  const existente = modelos.get(nome);
  if (existente) return existente;
  const metodos: Modelo = {};
  const proxy = new Proxy(metodos, {
    get(alvo, metodo: string) {
      alvo[metodo] ??= vi.fn(async () => respostaPadrao(metodo));
      return alvo[metodo];
    },
  });
  modelos.set(nome, proxy);
  return proxy;
}

const raiz: Record<string, unknown> = {
  $transaction: vi.fn(),
  $queryRaw: vi.fn(),
  $queryRawUnsafe: vi.fn(),
  $executeRaw: vi.fn(),
  $executeRawUnsafe: vi.fn(),
};

export const bancoFalso: any = new Proxy(raiz, {
  get(alvo, nome: string) {
    if (nome === 'then') return undefined;
    return nome in alvo ? alvo[nome] : modelo(nome);
  },
});

export const sessaoFalsa = vi.fn();
export const nextAuthFalso = { getServerSession: sessaoFalsa, default: vi.fn(() => vi.fn()) };

export function entrarComo(usuario: { id?: string; role?: string } | null = {}) {
  sessaoFalsa.mockResolvedValue(
    usuario === null ? null : { user: { id: 'aluno-1', username: 'aluno', role: 'user', ...usuario } },
  );
}

/** Zera respostas e chamadas; volta a sessão para "ninguém logado". */
export function zerar() {
  modelos.clear();
  (raiz.$transaction as Mock).mockReset().mockImplementation(async (arg: unknown) =>
    typeof arg === 'function' ? (arg as (tx: unknown) => unknown)(bancoFalso) : Promise.all(arg as Promise<unknown>[]),
  );
  for (const nome of ['$queryRaw', '$queryRawUnsafe', '$executeRaw', '$executeRawUnsafe']) {
    (raiz[nome] as Mock).mockReset().mockResolvedValue([]);
  }
  sessaoFalsa.mockReset().mockResolvedValue(null);
}

/** Lista "modelo.metodo" de toda gravação que o código tentou fazer. */
export function gravacoes(): string[] {
  const feitas: string[] = [];
  for (const [nome, metodos] of modelos) {
    for (const [metodo, fn] of Object.entries(metodos)) {
      if (ESCRITAS.test(metodo) && fn.mock.calls.length > 0) feitas.push(`${nome}.${metodo}`);
    }
  }
  for (const nome of ['$executeRaw', '$executeRawUnsafe']) {
    if ((raiz[nome] as Mock).mock.calls.length > 0) feitas.push(nome);
  }
  return feitas;
}

export function pedido(url: string, corpo?: unknown, metodo = corpo === undefined ? 'GET' : 'POST') {
  return new Request(`http://localhost${url}`, {
    method: metodo,
    headers: { 'content-type': 'application/json' },
    body: corpo === undefined ? undefined : typeof corpo === 'string' ? corpo : JSON.stringify(corpo),
  }) as any;
}
