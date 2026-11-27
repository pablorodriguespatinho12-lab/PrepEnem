/* Tabela de decisão de acesso, para TODAS as rotas de API:
   sem sessão -> 401/403 e nada gravado; aluno em rota de administrador -> 403.
   Rota nova entra sozinha (import.meta.glob). */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';

vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);

type Manipulador = (req: Request, ctx: { params: Record<string, string> }) => Promise<Response>;
// @ts-expect-error: import.meta.glob é do Vite, o tsconfig do Next não conhece.
const modulos = import.meta.glob('../../../app/api/**/route.ts') as Record<string, () => Promise<Record<string, Manipulador>>>;

const METODOS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
// Públicas por natureza: o próprio login e o cadastro (que sempre recusa).
const SEM_SESSAO = ['auth/[...nextauth]', 'signup'];
const SO_ADMIN: Record<string, string[]> = {
  questions: ['POST'],
  'questions/[id]': ['PUT', 'DELETE'],
  'batch-import': ['GET', 'POST'],
  'pdf-process': ['POST'],
};

const rotas = Object.entries(modulos)
  .map(([caminho, carregar]) => ({ nome: caminho.replace(/^.*app\/api\//, '').replace('/route.ts', ''), carregar }))
  .sort((a, b) => a.nome.localeCompare(b.nome));

const chamar = (fn: Manipulador, nome: string, metodo: string) => {
  const url = `/api/${nome.replace(/\[.*?\]/g, 'x')}`;
  const req = pedido(url, metodo === 'GET' || metodo === 'DELETE' ? undefined : {}, metodo);
  req.nextUrl = new URL(req.url);
  return fn(req, { params: { id: 'x' } });
};

beforeEach(zerar);

it('encontra as rotas da API', () => {
  expect(rotas.length).toBeGreaterThanOrEqual(53);
});

describe('sem sessão', () => {
  for (const rota of rotas.filter((r) => !SEM_SESSAO.includes(r.nome))) {
    it(`/api/${rota.nome} recusa todo método e não grava`, async () => {
      const modulo = await rota.carregar();
      const metodos = METODOS.filter((m) => typeof modulo[m] === 'function');
      expect(metodos.length).toBeGreaterThan(0);
      for (const metodo of metodos) {
        const resposta = await chamar(modulo[metodo], rota.nome, metodo);
        expect([401, 403], `${metodo} /api/${rota.nome}`).toContain(resposta.status);
      }
      expect(gravacoes()).toEqual([]);
    }, 20_000);
  }
});

describe('aluno comum em rota de administrador', () => {
  for (const [nome, metodos] of Object.entries(SO_ADMIN)) {
    for (const metodo of metodos) {
      it(`${metodo} /api/${nome} responde 401/403 e não grava`, async () => {
        entrarComo({ role: 'user' });
        const modulo = await rotas.find((r) => r.nome === nome)!.carregar();
        expect(typeof modulo[metodo]).toBe('function');
        const resposta = await chamar(modulo[metodo], nome, metodo);
        expect([401, 403]).toContain(resposta.status);
        expect(gravacoes()).toEqual([]);
      }, 20_000);
    }
  }
});

describe('cadastro fechado', () => {
  it('recusa mesmo com sessão de administrador', async () => {
    entrarComo({ role: 'admin' });
    const modulo = await rotas.find((r) => r.nome === 'signup')!.carregar();
    expect((await chamar(modulo.POST, 'signup', 'POST')).status).toBe(403);
    expect(gravacoes()).toEqual([]);
  });
});
