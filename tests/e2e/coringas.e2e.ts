// Coringas raros nas pílulas de autores (Pablo, 29/10/2026): no passo 5 vêm
// primeiro, marcados "raro", e a ficha traz a frase que os liga ao motivo do
// parágrafo; no passo 2, cada motivo mostra os seus. Sem rolagem lateral.
// Não grava nada: todo POST em /api devolve {}.
//
//   BASE=http://localhost:3000 TOKEN_FILE=<arquivo> SHOTS=<pasta> npx vite-node --config vitest.config.ts tests/e2e/coringas.e2e.ts

import { readFileSync } from 'fs';
import { chromium } from 'playwright';
import { CORINGAS } from '@/lib/redacao/autores';
import { causaPorChave } from '@/lib/redacao/receita';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOKEN = readFileSync(process.env.TOKEN_FILE ?? '', 'utf8').trim();
const SHOTS = process.env.SHOTS ?? '';
const TEMA = 'O estigma associado às doenças mentais na sociedade brasileira';

async function percorrer(largura: number): Promise<[string, boolean, string][]> {
  const linhas: [string, boolean, string][] = [];
  const prova = (nome: string, ok: boolean, medido: string) => linhas.push([`${largura} px · ${nome}`, ok, medido]);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: largura, height: largura < 500 ? 844 : 900 } });
  await ctx.addCookies([{ name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
  const page = await ctx.newPage();
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.route('**/api/**', (r) => (r.request().method() !== 'GET' ? r.fulfill({ json: {} }) : r.continue()));
  await page.goto(`${BASE}/redacao/partes`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.evaluate((tema) => localStorage.setItem('prepenem_receita_rascunho_v1', JSON.stringify({
    passo: 5, tema, causaA: 'estigma', causaB: 'estado', moldesVistos: ['introducao', 'desenvolvimento1'],
    paragrafos: { introducao: '', desenvolvimento1: 'Em primeiro lugar, cabe destacar o preconceito.', desenvolvimento2: '', conclusao: '' },
  })), TEMA);
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 2, name: 'Desenvolvimento 1', exact: true }).waitFor();

  /* A frase 2 é a do repertório: os autores abrem sozinhos. */
  const esperados = causaPorChave('estigma')!.coringas.map((n) => CORINGAS[n].rotulo);
  const pilulas = page.locator('[data-medir="autores"] ul button');
  await pilulas.first().waitFor();
  const primeiros = (await pilulas.allInnerTexts()).slice(0, 3).map((t) => t.replace(/^(fala|dado)\s*/i, '').trim());
  prova('coringas do motivo vêm primeiro', JSON.stringify(primeiros) === JSON.stringify(esperados), primeiros.join(' | '));
  const marcados = await page.locator('[data-medir="autores"] ul button', { hasText: /^(fala|dado)/i }).count();
  prova('só 3 coringas à vista (2 falas e 1 dado)', marcados === 3, `${marcados}`);
  const outros = await page.getByRole('button', { name: /^Outros autores/ }).isVisible();
  prova('outros autores atrás de 1 botão', outros, outros ? 'sim' : 'não');

  await pilulas.first().click();
  const ficha = await page.locator('#ficha-autor').innerText();
  const amarra = CORINGAS['Graciliano'].amarra.estigma!;
  prova('ficha traz a frase e a ligação', ficha.includes('Você é um bicho, Fabiano') && ficha.includes(amarra), ficha.split('\n')[0]);
  prova('ficha diz como ligar ao tema', ficha.includes('Ligue ao seu tema assim'), ficha.includes('Ligue') ? 'sim' : 'não');
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/coringas-${largura}.png` });

  /* Sem rolagem (Pablo, 29/10/2026): com a ficha aberta, a caixa de texto
     inteira fica acima da barra Voltar/Próximo, e a página não rola. */
  if (largura >= 1024) {
    const caixa = await page.locator('#texto-desenvolvimento1').boundingBox();
    const barra = await page.getByRole('button', { name: /^Próximo/ }).boundingBox();
    const fundo = Math.round((caixa?.y ?? 0) + (caixa?.height ?? 0));
    prova('caixa de texto acima da barra', !!barra && fundo <= barra.y, `caixa até ${fundo}, barra em ${Math.round(barra?.y ?? 0)}`);
    const rola = await page.evaluate(() => document.documentElement.scrollHeight > innerHeight + 1);
    prova('página não rola', !rola, rola ? 'rola' : 'cabe');
    const dentro = await page.locator('[data-medir="autores"]').evaluate((el) => el.scrollHeight - el.clientHeight);
    prova('ficha inteira à vista, sem rolar por dentro', dentro <= 1, `${dentro} px escondidos`);
  }

  /* Passo 2: cada motivo mostra os seus coringas. */
  await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('prepenem_receita_rascunho_v1') || '{}');
    localStorage.setItem('prepenem_receita_rascunho_v1', JSON.stringify({ ...r, passo: 2 }));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 2, name: 'Por que esse problema existe?', exact: true }).waitFor();
  const raros2 = await page.getByRole('button', { name: /^(fala|dado)/i }).count();
  prova('passo 2: 3 coringas em cada um dos 5 motivos', raros2 === 15, `${raros2}`);

  const largo = await page.evaluate(() => document.documentElement.scrollWidth);
  prova('sem rolagem lateral', largo <= largura, `${largo} px`);
  prova('sem erro de JS', erros.length === 0, erros.join(' | ') || 'nenhum');
  await browser.close();
  return linhas;
}

async function main(): Promise<void> {
  const linhas = [...(await percorrer(390)), ...(await percorrer(1440))];
  console.log('| Prova | Passou | Medido |\n|---|---|---|');
  for (const [prova, ok, medido] of linhas) console.log(`| ${prova} | ${ok ? 'sim' : 'NÃO'} | ${medido} |`);
  if (linhas.some(([, ok]) => !ok)) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
