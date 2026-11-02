// Aba Exemplo no tema do ENEM (Pablo, 02/11/2026): quais autores servem NO
// tema dele, o exemplo pronto no próprio tema, "Pôr a frase" na caixa e "Me
// testar". Tema digitado fora da lista volta ao exemplo em outro tema.
// Não grava nada: todo POST em /api devolve {}.
//
//   BASE=http://localhost:3000 TOKEN_FILE=<arquivo> SHOTS=<pasta> npx vite-node --config vitest.config.ts tests/e2e/autores-no-tema.e2e.ts

import { readFileSync } from 'fs';
import { chromium, type Page } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOKEN = readFileSync(process.env.TOKEN_FILE ?? '', 'utf8').trim();
const SHOTS = process.env.SHOTS ?? '';
const TEMA = 'O estigma associado às doenças mentais na sociedade brasileira';
const CHAVE = 'prepenem_receita_rascunho_v1';

async function abrirIntroducao(page: Page, tema: string): Promise<void> {
  await page.evaluate(([chave, t]) => localStorage.setItem(chave, JSON.stringify({
    passo: 4, tema: t, causaA: 'estigma', causaB: 'estado', moldesVistos: ['introducao'],
    paragrafos: { introducao: '', desenvolvimento1: '', desenvolvimento2: '', conclusao: '' },
  })), [CHAVE, tema]);
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 2, name: 'Introdução', exact: true }).waitFor();
  await page.getByRole('tab', { name: 'Exemplo' }).click();
}

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

  await abrirIntroducao(page, TEMA);
  const secao = page.locator('[data-medir="autores-no-tema"]');
  await secao.waitFor();
  const texto = await secao.innerText();
  prova('pergunta qual autor usar no tema', texto.includes('Qual autor usar no seu tema?'), texto.split('\n')[0]);
  prova('sem "Escolha um assunto"', !(await page.getByText('Escolha um assunto').count()), 'ok');
  const servem = await secao.getByLabel('serve', { exact: true }).count();
  const naoServem = await secao.getByLabel('não serve', { exact: true }).count();
  prova('marca quem serve e quem não serve', servem > 0 && naoServem > 0, `${servem} servem, ${naoServem} não`);
  prova('exemplo é do próprio tema (Drummond com a Lei 10.216)', texto.includes('As leis não bastam') && texto.includes('10.216'), texto.includes('10.216') ? 'sim' : 'não');
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/autores-tema-${largura}.png` });

  await secao.getByRole('button', { name: 'Pôr a frase do autor no meu texto' }).click();
  const caixa = await page.locator('#texto-introducao').inputValue();
  prova('"Pôr a frase" leva a frase do autor para a caixa', caixa.includes('As leis não bastam'), caixa.slice(0, 60));

  await secao.getByRole('button', { name: /último a abolir/ }).click();
  const nao = await secao.innerText();
  prova('autor que não serve explica e manda escolher outro', nao.includes('Não serve neste tema'), nao.includes('Não serve') ? 'sim' : 'não');

  await secao.getByRole('button', { name: 'Me testar' }).click();
  const marcasNoTeste = await secao.getByLabel(/^(não )?serve$/).count();
  prova('Me testar esconde as marcas', marcasNoTeste === 0, `${marcasNoTeste} marcas`);
  await secao.getByRole('button', { name: /Rui Barbosa/ }).click();
  const reveladas = await secao.getByRole('group', { name: 'Autores' }).getByLabel(/^(não )?serve$/).count();
  prova('no teste, tocar revela só aquele autor', reveladas === 1, `${reveladas}`);

  await abrirIntroducao(page, 'Um tema que eu inventei agora');
  const antigo = await page.getByText('Exemplo pronto, em outro tema').count();
  prova('tema fora da lista volta ao exemplo em outro tema', antigo > 0, `${antigo}`);

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
