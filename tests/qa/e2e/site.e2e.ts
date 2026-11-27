/* Ponta a ponta no navegador, contra o build local ligado a um banco que NÃO
   existe (ver servidor.ts): nada aqui alcança o site no ar. */
import { chromium, devices, type Browser, type BrowserContext } from 'playwright';
import { encode } from 'next-auth/jwt';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { BASE, SEGREDO } from './servidor';

const TELAS = ['/dashboard', '/provas', '/flashcards', '/redacao', '/calculo', '/progresso', '/perfil', '/descobrir', '/treino?qa=1', '/simulado', '/caderno-erros', '/banco-questoes', '/vestibular'];
let navegador: Browser;

beforeAll(async () => { navegador = await chromium.launch(); });
afterAll(async () => { await navegador?.close(); });

/** Sessão assinada com o segredo de teste; toda API de dados responde `status`. */
async function logado(status = 500, opcoes: Parameters<Browser['newContext']>[0] = {}): Promise<BrowserContext> {
  const contexto = await navegador.newContext(opcoes);
  const value = await encode({ token: { id: 'qa', username: 'qa', role: 'user', name: 'QA', lastValidated: Date.now() }, secret: SEGREDO });
  await contexto.addCookies([{ name: 'next-auth.session-token', value, url: BASE }]);
  await contexto.route('**/api/**', (rota) =>
    new URL(rota.request().url()).pathname.startsWith('/api/auth/')
      ? rota.continue()
      : rota.fulfill({ status, contentType: 'application/json', body: '{"error":"falha de teste"}' }));
  return contexto;
}

describe('sem login', () => {
  it.each(TELAS)('%s leva para o login', async (tela) => {
    const r = await fetch(`${BASE}${tela}`, { redirect: 'manual' });
    expect(r.status).toBe(307);
    expect(r.headers.get('location')).toContain('/login');
  });

  it.each(['/api/stats', '/api/provas/listar', '/api/flashcards/decks', '/api/user/profile'])('%s recusa', async (api) => {
    expect([401, 403]).toContain((await fetch(`${BASE}${api}`)).status);
  });

  it('BUG-S2: o cabeçalho next-router-prefetch não pula a proteção da tela', async () => {
    const r = await fetch(`${BASE}/dashboard`, { redirect: 'manual', headers: { 'next-router-prefetch': '1' } });
    expect(r.status).toBe(307);
  });

  it('cabeçalhos de segurança na resposta', async () => {
    const h = (await fetch(`${BASE}/login`)).headers;
    expect(h.get('x-frame-options')).toBe('DENY');
    expect(h.get('x-content-type-options')).toBe('nosniff');
    expect(h.get('strict-transport-security')).toContain('max-age=');
    expect(h.get('content-security-policy')).toContain("default-src 'self'");
    expect(h.get('x-powered-by')).toBeNull();
  });

  it('login abre sem erro de script nem bloqueio de CSP e mostra erro com senha errada', async () => {
    const contexto = await navegador.newContext();
    const pagina = await contexto.newPage();
    const erros: string[] = [];
    pagina.on('pageerror', (e) => erros.push(e.message));
    pagina.on('console', (m) => { if (m.text().includes('Content Security Policy')) erros.push(m.text()); });
    await pagina.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    expect(erros).toEqual([]);
    await pagina.locator('input[type="text"]').fill('ninguem');
    await pagina.locator('input[type="password"]').fill('errada');
    const resposta = pagina.waitForResponse((r) => r.url().includes('/api/auth/callback/credentials'));
    await pagina.locator('button[type="submit"]').click();
    expect((await resposta).status()).toBe(401);
    await pagina.waitForTimeout(500);
    expect(new URL(pagina.url()).pathname).toBe('/login');
    await contexto.close();
  });
});

describe('logado, com a API de dados fora do ar', () => {
  it.each(TELAS)('%s não quebra', async (tela) => {
    const contexto = await logado();
    const pagina = await contexto.newPage();
    const erros: string[] = [];
    pagina.on('pageerror', (e) => erros.push(e.message));
    await pagina.goto(`${BASE}${tela}`, { waitUntil: 'networkidle' });
    await pagina.waitForTimeout(500);
    expect(erros).toEqual([]);
    expect(new URL(pagina.url()).pathname).toBe(tela.split('?')[0]);
    expect((await pagina.locator('body').innerText()).trim().length).toBeGreaterThan(20);
    await contexto.close();
  });
});

it('/treino sem parâmetro é endereço antigo: leva para as provas', async () => {
  const contexto = await logado();
  const pagina = await contexto.newPage();
  await pagina.goto(`${BASE}/treino`);
  await pagina.waitForURL('**/provas');
  await contexto.close();
});

describe('celular (390 px)', () => {
  it.each(TELAS)('%s não rola de lado', async (tela) => {
    const contexto = await logado(500, { ...devices['iPhone 13'], defaultBrowserType: undefined } as any);
    const pagina = await contexto.newPage();
    await pagina.goto(`${BASE}${tela}`, { waitUntil: 'networkidle' });
    const sobra = await pagina.evaluate('document.documentElement.scrollWidth - window.innerWidth');
    expect(sobra).toBeLessThanOrEqual(0);
    await contexto.close();
  });
});

describe('entrar no site sempre pelo Início', () => {
  it.each([
    ['/provas', '/dashboard'],
    ['/perfil', '/dashboard'],
    ['/treino?qa=1', '/treino?qa=1'],
  ])('primeira tela %s -> %s; recarregar não muda', async (pedida, esperada) => {
    const contexto = await logado();
    // o site ignora a regra em navegador automatizado: aqui se passa por gente
    await contexto.addInitScript("Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false })");
    const pagina = await contexto.newPage();
    await pagina.goto(`${BASE}${pedida}`, { waitUntil: 'networkidle' });
    await pagina.waitForURL(`**${esperada}`);
    await pagina.reload({ waitUntil: 'networkidle' });
    const { pathname, search } = new URL(pagina.url());
    expect(pathname + search).toBe(esperada);
    await contexto.close();
  });
});
