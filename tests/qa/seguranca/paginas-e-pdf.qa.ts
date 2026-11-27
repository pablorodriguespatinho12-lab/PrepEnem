/* Middleware (proteção das telas e CSP) e o buscador de PDF (contra SSRF). */
import { Readable } from 'node:stream';
import { NextRequest } from 'next/server';
import { encode } from 'next-auth/jwt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { entrarComo, zerar } from '../apoio/banco-falso';
import { middleware } from '@/middleware';
import { isAllowedInepUrl } from '@/lib/inep-pdf-fetch';
import { GET as buscarPdf } from '@/app/api/pdf-proxy/route';

const baixar = vi.hoisted(() => vi.fn());
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('@/lib/inep-pdf-fetch', async (original) => ({ ...(await original<object>()), fetchInepUpstream: baixar }));

const SEGREDO = 'segredo-de-teste';
const ir = (caminho: string, cookie?: string) =>
  middleware(new NextRequest(`http://localhost${caminho}`, { headers: cookie ? { cookie } : {} }));

beforeEach(() => {
  zerar();
  baixar.mockReset();
  process.env.NEXTAUTH_SECRET = SEGREDO;
});

describe('telas', () => {
  it.each(['/', '/dashboard', '/provas/abc', '/admin/questoes', '/perfil', '/loginx', '/login/outra'])('%s sem login vai para /login', async (caminho) => {
    const r = await ir(caminho);
    expect(r.status).toBe(307);
    expect(new URL(r.headers.get('location')!).pathname).toBe('/login');
  });

  it.each(['/login', '/signup'])('%s abre sem login', async (caminho) => {
    expect((await ir(caminho)).status).toBe(200);
  });

  it.each([
    [SEGREDO, 200],
    ['outro-segredo', 307],
  ])('cookie assinado com %s -> %i', async (segredo, status) => {
    const token = await encode({ token: { id: 'u1' }, secret: segredo });
    expect((await ir('/dashboard', `next-auth.session-token=${token}`)).status).toBe(status);
  });

  it('cookie inventado não abre', async () => {
    expect((await ir('/dashboard', 'next-auth.session-token=abc')).status).toBe(307);
  });

  it('CSP: nonce novo a cada pedido, sem objeto nem iframe', async () => {
    const a = (await ir('/login')).headers.get('content-security-policy')!;
    const b = (await ir('/login')).headers.get('content-security-policy')!;
    expect(a).toContain("object-src 'none'");
    expect(a).toContain("frame-ancestors 'none'");
    expect(a).toMatch(/script-src 'self' 'nonce-[^']+'/);
    expect(a.match(/nonce-[^']+/)![0]).not.toBe(b.match(/nonce-[^']+/)![0]);
  });
});

describe('endereço de PDF permitido (partições)', () => {
  it.each([
    ['https://download.inep.gov.br/a.pdf', true],
    ['http://download.inep.gov.br/a.pdf', false],
    ['https://download.inep.gov.br.atacante.com/a.pdf', false],
    ['https://atacante.com/download.inep.gov.br', false],
    ['https://download.inep.gov.br@atacante.com/a.pdf', false],
    ['https://127.0.0.1/a.pdf', false],
    ['file:///etc/passwd', false],
  ])('%s -> %s', (url, esperado) => expect(isAllowedInepUrl(new URL(url))).toBe(esperado));
});

describe('GET /api/pdf-proxy', () => {
  const pedir = (url?: string) => {
    const nextUrl = new URL(`http://localhost/api/pdf-proxy${url === undefined ? '' : `?url=${encodeURIComponent(url)}`}`);
    return buscarPdf({ nextUrl } as any);
  };
  beforeEach(() => entrarComo());

  it.each([
    [undefined, 400],
    ['nao-e-url', 400],
    ['https://atacante.com/a.pdf', 403],
  ])('url %s -> %i sem sair para a rede', async (url, status) => {
    expect((await pedir(url)).status).toBe(status);
    expect(baixar).not.toHaveBeenCalled();
  });

  it('devolve o PDF da fonte oficial', async () => {
    baixar.mockResolvedValue({ statusCode: 200, stream: Readable.from([Buffer.from('%PDF-1.7')]) });
    const r = await pedir('https://download.inep.gov.br/a.pdf');
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toBe('application/pdf');
    expect(await r.text()).toBe('%PDF-1.7');
  });

  it('fonte fora do ar -> 502', async () => {
    baixar.mockRejectedValue(new Error('Fonte retornou 500'));
    vi.spyOn(console, 'error').mockImplementationOnce(() => {});
    expect((await pedir('https://download.inep.gov.br/a.pdf')).status).toBe(502);
  });
});
