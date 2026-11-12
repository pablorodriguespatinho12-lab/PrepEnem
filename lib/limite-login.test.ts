import { describe, expect, it, vi } from 'vitest';

/* Limite contra chute de senha: conta por IP (5) e no total (30) em 15 min. */
const contagens = { doIp: 0, total: 0 };
vi.mock('@/lib/db', () => ({
  prisma: {
    tentativaLogin: {
      count: vi.fn(async ({ where }: { where: { ipHash?: string } }) => (where.ipHash ? contagens.doIp : contagens.total)),
      create: vi.fn(async () => ({})),
      deleteMany: vi.fn(async () => ({ count: 0 })),
    },
  },
}));

const { bloqueado, hashDoIp, ipDoPedido, ERROS_POR_IP, ERROS_NO_TOTAL } = await import('./limite-login');

describe('limite de login', () => {
  it('libera abaixo do limite e bloqueia no 5º erro do mesmo IP', async () => {
    Object.assign(contagens, { doIp: ERROS_POR_IP - 1, total: 4 });
    expect(await bloqueado('x')).toBe(false);
    Object.assign(contagens, { doIp: ERROS_POR_IP, total: 5 });
    expect(await bloqueado('x')).toBe(true);
  });

  it('bloqueia todos quando o site soma 30 erros (ataque de vários IPs)', async () => {
    Object.assign(contagens, { doIp: 0, total: ERROS_NO_TOTAL });
    expect(await bloqueado('y')).toBe(true);
  });

  it('pega o primeiro IP do x-forwarded-for e nunca guarda o IP puro', () => {
    expect(ipDoPedido({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' })).toBe('1.2.3.4');
    expect(ipDoPedido({})).toBe('sem-ip');
    const h = hashDoIp('1.2.3.4');
    expect(h).toMatch(/^[a-f0-9]{64}$/);
    expect(h).not.toContain('1.2.3.4');
  });
});
