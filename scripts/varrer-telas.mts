/* Varre as telas do PrepEnem procurando bug visível: erro de JS, erro no
   console, resposta HTTP >= 400, conteúdo vazando para o lado e tela quase
   vazia. Em 1366 px e 375 px (celular).

   Rodar contra o build, com sessão (ver verificacao-local):
     DB_CONFIRMED=1 PREPENEM_TOKEN=... npx tsx scripts/varrer-telas.mts [rota ...]

   Todo POST/PUT/DELETE em /api/** recebe {} (menos /api/caneta, que só
   converte conta): nada grava na conta e nenhuma cota de IA é gasta. */
import { chromium, type Page } from 'playwright';

const BASE = process.env.PREPENEM_URL ?? 'http://localhost:3000';
const TOKEN = process.env.PREPENEM_TOKEN;
if (!TOKEN) throw new Error('Falta PREPENEM_TOKEN');

const ROTAS = [
  '/dashboard', '/treino', '/simulado', '/flashcards', '/flashcards/criar', '/caderno-erros',
  '/progresso', '/redacao', '/redacao/modelos', '/redacao/partes', '/calculo', '/calculo/p1',
  '/calculo/revisao', '/banco-questoes', '/provas', '/provas/criar', '/vestibular', '/upload',
  '/perfil', '/admin/questoes',
];
const LARGURAS = [1366, 375];
const ESPERA_MS = 2500;
const TEXTO_MINIMO = 40;
// Barulho conhecido que não é bug do app.
const IGNORAR = [/favicon/, /Download the React DevTools/, /\/_vercel\//];

type Achado = { rota: string; largura: number; tipo: string; detalhe: string };

async function varrer(page: Page, rota: string, largura: number, achados: Achado[]) {
  const anota = (tipo: string, detalhe: string) => {
    if (!IGNORAR.some((r) => r.test(detalhe))) achados.push({ rota, largura, tipo, detalhe: detalhe.slice(0, 160) });
  };
  const ouvintes = {
    pageerror: (e: Error) => anota('erro JS', e.message),
    console: (m: { type: () => string; text: () => string }) => { if (m.type() === 'error') anota('console', m.text()); },
    response: (r: { status: () => number; url: () => string }) => { if (r.status() >= 400) anota(`HTTP ${r.status()}`, r.url().replace(BASE, '')); },
  };
  page.on('pageerror', ouvintes.pageerror);
  page.on('console', ouvintes.console);
  page.on('response', ouvintes.response);
  try {
    await page.setViewportSize({ width: largura, height: 800 });
    await page.goto(BASE + rota, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(ESPERA_MS);
    // Sem isso, token vencido vira "0 achados": a tela de login não tem bug.
    if (new URL(page.url()).pathname === '/login') anota('caiu no login', 'sessão não valeu; nada foi testado');
    const m = (await page.evaluate(`({
      vaza: document.documentElement.scrollWidth - innerWidth,
      texto: (document.querySelector('main')?.innerText ?? document.body.innerText).trim().length,
      culpado: [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > innerWidth + 2)
        .map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(' ').slice(0, 3).join('.')).slice(0, 2).join(' | '),
    })`)) as { vaza: number; texto: number; culpado: string };
    if (m.vaza > 2) anota('vaza para o lado', `${m.vaza}px ${m.culpado}`);
    if (m.texto < TEXTO_MINIMO) anota('tela quase vazia', `${m.texto} caracteres`);
  } catch (erro) {
    anota('não carregou', (erro as Error).message.split('\n')[0]);
  } finally {
    page.off('pageerror', ouvintes.pageerror);
    page.off('console', ouvintes.console);
    page.off('response', ouvintes.response);
  }
}

const rotas = process.argv.slice(2).length ? process.argv.slice(2) : ROTAS;
const browser = await chromium.launch();
const context = await browser.newContext();
await context.addCookies([{
  name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/',
  httpOnly: true, secure: true, sameSite: 'Lax',
}]);
await context.route('**/api/**', (route) => {
  const r = route.request();
  return r.method() === 'GET' || r.url().includes('/api/caneta') ? route.continue() : route.fulfill({ json: {} });
});
const page = await context.newPage();
const achados: Achado[] = [];
for (const rota of rotas) for (const largura of LARGURAS) await varrer(page, rota, largura, achados);
await browser.close();
console.table(achados);
console.log(`${achados.length} achados em ${rotas.length} rotas × ${LARGURAS.length} larguras`);
