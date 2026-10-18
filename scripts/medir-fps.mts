/* Mede a fluidez das telas do PrepEnem: custo de composição com a página
   parada, quadros por segundo, quadros perdidos (> 25 ms), tarefas longas e
   layouts. Como ler cada coluna: skill medir-fluidez.

   Rodar contra o build de produção (o modo dev é lento por natureza):
     npm run build && npm start   (em outro terminal)
     npx tsx scripts/medir-fps.mts [rota ...]

   Precisa de PREPENEM_TOKEN no ambiente (JWT de sessão; ver a skill
   verificacao-local). Sem ele, só /login é medida.

   A CPU vai freada (FREIO, padrão 4x) para parecer máquina comum.
   Headless não tem GPU de verdade: o número absoluto é pior que no
   navegador do Pablo. Vale a comparação antes/depois, na mesma máquina. */
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';

const BASE = process.env.PREPENEM_URL ?? 'http://localhost:3000';
const TOKEN = process.env.PREPENEM_TOKEN;
const ROTAS_PADRAO = TOKEN ? ['/dashboard', '/treino', '/progresso', '/flashcards'] : ['/login'];
const SEGUNDOS_PARADO = 3;
const SEGUNDOS_ROLANDO = 3;
const QUADRO_PERDIDO_MS = 25;
// CPU 4x mais lenta: perto de um notebook comum ou celular. FREIO=1 desliga.
const FREIO = Number(process.env.FREIO ?? 4);

type Medida = { fps: number; perdidos: number; piorMs: number };

/* Conta quadros com requestAnimationFrame dentro da página. Enquanto conta,
   `rolar` decide se a página rola sozinha (roda scrollBy a cada quadro).
   Vai como texto: o tsx injeta `__name` em função nomeada, e isso não existe
   do lado do navegador. */
const CONTADOR = `(seg, rola, limite) => new Promise((resolve) => {
  const tempos = [];
  const inicio = performance.now();
  let direcao = 1;
  const passo = (t) => {
    tempos.push(t);
    if (rola) {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (scrollY >= max - 2) direcao = -1;
      if (scrollY <= 2) direcao = 1;
      scrollBy(0, 18 * direcao);
    }
    if (t - inicio < seg * 1000) return requestAnimationFrame(passo);
    const deltas = tempos.slice(1).map((v, i) => v - tempos[i]);
    resolve({
      fps: Math.round((deltas.length / (t - inicio)) * 1000),
      perdidos: deltas.filter((d) => d > limite).length,
      piorMs: Math.round(Math.max(0, ...deltas)),
    });
  };
  requestAnimationFrame(passo);
})`;
async function contarQuadros(page: Page, segundos: number, rolar: boolean): Promise<Medida> {
  return page.evaluate(`(${CONTADOR})(${segundos}, ${rolar}, ${QUADRO_PERDIDO_MS})`) as Promise<Medida>;
}
/* Composição: quanto o navegador gasta montando quadros com a página PARADA.
   É o número que importa para animação de fundo — o fps do rAF fica em 60 no
   headless mesmo quando a placa de vídeo do aluno sofreria. Página parada
   deveria dar perto de 0; animação infinita rodando dá centenas. */
const EVENTOS_COMPOSICAO = /^(CompositeLayers|LayerTreeHostImpl::PrepareToDraw|Graphics\.Pipeline\.DrawAndSwap|DirectRenderer::DrawFrame)$/;
type EventoTrace = { ph: string; name: string; dur?: number };
async function medirComposicao(browser: Browser, page: Page): Promise<number> {
  const arquivo = join(tmpdir(), `medir-fps-${process.pid}.json`);
  await browser.startTracing(page, { path: arquivo, categories: ['devtools.timeline', 'cc', 'gpu', 'viz'] });
  await page.waitForTimeout(SEGUNDOS_PARADO * 1000);
  await browser.stopTracing();
  const eventos = (JSON.parse(readFileSync(arquivo, 'utf8')).traceEvents ?? []) as EventoTrace[];
  const micros = eventos
    .filter((e) => e.ph === 'X' && EVENTOS_COMPOSICAO.test(e.name))
    .reduce((soma, e) => soma + (e.dur ?? 0), 0);
  return Math.round(micros / 1000);
}
async function medirRota(browser: Browser, page: Page, rota: string) {
  await page.goto(BASE + rota, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // entrada das animações + dados
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: FREIO });
  const metricas = async () =>
    Object.fromEntries(((await cdp.send('Performance.getMetrics')).metrics).map((m) => [m.name, m.value]));

  await page.evaluate(`window.__longas = 0;
    new PerformanceObserver((l) => { window.__longas += l.getEntries().length; })
      .observe({ type: 'longtask', buffered: false });`);

  const composicao = await medirComposicao(browser, page);
  const antes = await metricas();
  const parado = await contarQuadros(page, SEGUNDOS_PARADO, false);
  const rolando = await contarQuadros(page, SEGUNDOS_ROLANDO, true);
  const depois = await metricas();
  const longas = (await page.evaluate('window.__longas')) as number;
  const dif = (k: string) => Math.round(depois[k] - antes[k]);

  return {
    rota,
    'composição ms (parado)': composicao,
    'fps parado': parado.fps,
    'fps rolando': rolando.fps,
    'quadros perdidos': parado.perdidos + rolando.perdidos,
    'pior quadro ms': Math.max(parado.piorMs, rolando.piorMs),
    'tarefas longas': longas,
    layouts: dif('LayoutCount'),
    'script ms': Math.round((depois.ScriptDuration - antes.ScriptDuration) * 1000),
  };
}

const rotas = process.argv.slice(2).length ? process.argv.slice(2) : ROTAS_PADRAO;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
if (TOKEN) {
  await context.addCookies([{
    name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/',
    httpOnly: true, secure: true, sameSite: 'Lax',
  }]);
}
// Nada grava na conta durante a medição.
await context.route('**/api/**', (route) =>
  route.request().method() === 'GET' ? route.continue() : route.fulfill({ json: {} }),
);
const page = await context.newPage();
const linhas = [];
for (const rota of rotas) {
  try {
    linhas.push(await medirRota(browser, page, rota));
  } catch (erro) {
    console.error(`${rota}: ${(erro as Error).message}`);
  }
}
console.table(linhas);
await browser.close();
