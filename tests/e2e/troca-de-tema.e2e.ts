// Troca de tema no meio do Treino por partes (Pablo, 29/10/2026): o teste dos
// 7 passos começa cada tema do zero e não pegava os motivos do tema anterior.
// Aqui o aluno vai até o passo 2 ou 3, volta, troca 2023 -> 2019 -> livre e
// confere motivos, aviso "combina pouco" e tese. Também confere que, numa
// janela de 767 px, o molde abre na 1ª visita do passo e fecha na 2ª.
// Não grava nada: todo POST/PUT/DELETE em /api devolve {}.
//
//   BASE=http://localhost:3000 TOKEN_FILE=<arquivo> npx vite-node --config vitest.config.ts tests/e2e/troca-de-tema.e2e.ts

import { readFileSync } from 'fs';
import { chromium, type Browser, type Page } from 'playwright';
import { causaPorChave, moldeTese, type ChaveCausa } from '@/lib/redacao/receita';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOKEN = readFileSync(process.env.TOKEN_FILE ?? '', 'utf8').trim();
const T2023 = 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil';
const T2019 = 'Democratização do acesso ao cinema no Brasil';
const LIVRE = 'A mobilidade urbana nas grandes cidades';
const TITULO_DO_PASSO = ['', 'Tema', 'Por que esse problema existe?', 'Tese', 'Introdução', 'Desenvolvimento 1', 'Desenvolvimento 2', 'Conclusão', 'Redação montada'];

type Linha = { cenario: string; conferido: string; esperado: string; medido: string };
const linhas: Linha[] = [];
const anotar = (cenario: string, conferido: string, esperado: string, medido: string) => linhas.push({ cenario, conferido, esperado, medido });

async function abrir(browser: Browser, largura = 1440): Promise<Page> {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
  await ctx.addCookies([{ name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
  const page = await ctx.newPage();
  await page.route('**/api/**', (r) => (r.request().method() === 'GET' ? r.continue() : r.fulfill({ json: {} })));
  await page.goto(`${BASE}/redacao/partes`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.getByRole('button', { name: T2023 }).waitFor();
  return page;
}

const rascunho = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('prepenem_receita_rascunho_v1') || '{}'));
/* Espera o passo novo sozinho na tela (a troca anima a saída do antigo). */
async function irPara(page: Page, botao: RegExp, passo: number): Promise<void> {
  await page.getByRole('button', { name: botao }).click();
  await page.getByRole('heading', { level: 2, name: TITULO_DO_PASSO[passo], exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelectorAll('main h2').length === 1);
}
const proximo = async (page: Page) => irPara(page, /^(Próximo|Montar redação)/, (await rascunho(page)).passo + 1);
const voltar = async (page: Page) => irPara(page, /Voltar/, (await rascunho(page)).passo - 1);
const nomes = (a: ChaveCausa | null, b: ChaveCausa | null) => [a, b].map((c) => causaPorChave(c)?.nome ?? 'nenhum').join(' + ');
const aviso = async (page: Page) => {
  const t = await page.getByText(/combina(m)? pouco com o tema/).allInnerTexts();
  return t.length ? t[0].split(':')[0] : 'sem aviso';
};
async function marcar(page: Page, causas: ChaveCausa[]): Promise<void> {
  for (const c of causas) {
    const botao = page.locator('button[aria-pressed]', { hasText: causaPorChave(c)!.nome });
    if ((await botao.getAttribute('aria-pressed')) !== 'true') await botao.click();
  }
}
async function desmarcarTodos(page: Page): Promise<void> {
  const marcados = page.locator('button[aria-pressed="true"]');
  while ((await marcados.count()) > 0) await marcados.first().click();
}
async function conferirMotivos(page: Page, cenario: string, quando: string, esperado: [ChaveCausa | null, ChaveCausa | null]) {
  const r = await rascunho(page);
  anotar(cenario, `motivos ${quando}`, nomes(...esperado), nomes(r.causaA, r.causaB));
}

/* A: o aluno aceita os sugeridos. Eles trocam junto com o tema. */
async function cenarioSugeridos(browser: Browser) {
  const c = 'A. sugeridos';
  const page = await abrir(browser);
  await page.getByRole('button', { name: T2023 }).click();
  await proximo(page);
  await conferirMotivos(page, c, '2023 no passo 2', ['estigma', 'historia']);
  await proximo(page);
  await voltar(page);
  await voltar(page);
  await page.getByRole('button', { name: T2019 }).click();
  await conferirMotivos(page, c, 'ao trocar para 2019', ['acesso', 'mercado']);
  anotar(c, 'aviso no passo 1 (2019)', 'sem aviso', await aviso(page));
  await proximo(page);
  anotar(c, 'aviso no passo 2 (2019)', 'sem aviso', await aviso(page));
  await proximo(page);
  anotar(c, 'tese no passo 3 (2019)', 'gerada para 2019', (await page.locator('#tese').inputValue()) === moldeTese('acesso', 'mercado', T2019) ? 'gerada para 2019' : await page.locator('#tese').inputValue());
  await voltar(page);
  await voltar(page);
  await page.locator('#tema-livre').fill(LIVRE);
  await conferirMotivos(page, c, 'ao trocar para livre', [null, null]);
  await proximo(page);
  const semMotivo = await page.getByText('Escolha 2 motivos.').count();
  anotar(c, 'passo 2 (livre) trava sem motivo', 'trava', semMotivo > 0 ? 'trava' : 'não trava');
  await page.context().close();
}

/* B: o aluno escolhe à mão. Os motivos ficam e o aviso aparece. */
async function cenarioAMao(browser: Browser) {
  const c = 'B. à mão';
  const page = await abrir(browser);
  await page.getByRole('button', { name: T2023 }).click();
  await proximo(page);
  await desmarcarTodos(page);
  await marcar(page, ['estigma', 'mercado']);
  await conferirMotivos(page, c, 'escolhidos em 2023', ['estigma', 'mercado']);
  await voltar(page);
  await page.getByRole('button', { name: T2019 }).click();
  await conferirMotivos(page, c, 'ao trocar para 2019', ['estigma', 'mercado']);
  anotar(c, 'aviso no passo 1 (2019)', 'Estigma e invisibilidade', await aviso(page));
  await proximo(page);
  anotar(c, 'aviso no passo 2 (2019)', 'Estigma e invisibilidade', await aviso(page));
  await proximo(page);
  anotar(c, 'aviso no passo 3 (2019)', 'Estigma e invisibilidade', await aviso(page));
  const tese = await page.locator('#tese').inputValue();
  anotar(c, 'tese no passo 3 (2019)', 'gerada para 2019', tese === moldeTese('estigma', 'mercado', T2019) ? 'gerada para 2019' : tese);
  await voltar(page);
  await voltar(page);
  await page.locator('#tema-livre').fill(LIVRE);
  await conferirMotivos(page, c, 'ao trocar para livre', ['estigma', 'mercado']);
  anotar(c, 'aviso no passo 1 (livre)', 'sem aviso', await aviso(page));
  await proximo(page);
  await proximo(page);
  const teseLivre = await page.locator('#tese').inputValue();
  anotar(c, 'tese no passo 3 (livre)', 'gerada para o livre', teseLivre === moldeTese('estigma', 'mercado', LIVRE) ? 'gerada para o livre' : teseLivre);
  anotar(c, 'tese livre sem "esse grupo"', 'sem', /esse grupo/.test(teseLivre) ? 'tem' : 'sem');
  await page.context().close();
}

/* C: o aluno escreveu a tese. Ela fica e a tela pergunta se atualiza. */
async function cenarioTeseEditada(browser: Browser) {
  const c = 'C. tese editada';
  const page = await abrir(browser);
  await page.getByRole('button', { name: T2023 }).click();
  await proximo(page);
  await desmarcarTodos(page);
  await marcar(page, ['estigma', 'mercado']);
  await proximo(page);
  await page.locator('#tese').fill('Minha tese sobre o cuidado.');
  await voltar(page);
  await voltar(page);
  await page.getByRole('button', { name: T2019 }).click();
  await proximo(page);
  await proximo(page);
  anotar(c, 'tese no passo 3 (2019)', 'Minha tese sobre o cuidado.', await page.locator('#tese').inputValue());
  anotar(c, 'pergunta "Atualizar a tese?"', 'aparece', (await page.getByRole('button', { name: 'Atualizar a tese' }).count()) > 0 ? 'aparece' : 'não aparece');
  await page.getByRole('button', { name: 'Atualizar a tese' }).click();
  anotar(c, 'depois de Atualizar', 'gerada para 2019', (await page.locator('#tese').inputValue()) === moldeTese('estigma', 'mercado', T2019) ? 'gerada para 2019' : 'outra');
  await page.context().close();
}

/* D: 767 px. O molde abre na 1ª visita de cada passo e fecha na 2ª. */
async function cenarioMolde(browser: Browser) {
  const c = 'D. molde 767 px';
  const page = await abrir(browser, 767);
  await page.getByRole('button', { name: T2019 }).click();
  await proximo(page);
  await proximo(page);
  const estado = async () => ((await page.getByRole('button', { name: /o molde$/ }).getAttribute('aria-expanded')) === 'true' ? 'aberto' : 'fechado');
  for (const passo of ['Introdução', 'Desenvolvimento 1']) {
    await proximo(page);
    anotar(c, `${passo}, 1ª visita`, 'aberto', await estado());
  }
  await voltar(page);
  anotar(c, 'Introdução, 2ª visita', 'fechado', await estado());
  await page.context().close();
}

async function main() {
  const browser = await chromium.launch();
  for (const cenario of [cenarioSugeridos, cenarioAMao, cenarioTeseEditada, cenarioMolde]) {
    try {
      await cenario(browser);
    } catch (e) {
      anotar(cenario.name, 'rodou até o fim', 'sim', `quebrou: ${(e as Error).message.split('\n')[0].slice(0, 90)}`);
    }
  }
  await browser.close();
  console.info('| Cenário | Conferido | Esperado | Medido | ok |\n|---|---|---|---|---|');
  for (const l of linhas) console.info(`| ${l.cenario} | ${l.conferido} | ${l.esperado} | ${l.medido} | ${l.esperado === l.medido ? 'ok' : 'FALHA'} |`);
  const falhas = linhas.filter((l) => l.esperado !== l.medido).length;
  console.info(`\n${linhas.length} conferências, ${falhas} falha(s).`);
  process.exitCode = falhas ? 1 : 0;
}

main();
