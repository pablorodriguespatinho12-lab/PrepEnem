// Baralhos "Quartetos 1, 2 e 3" no navegador (Pablo, 06/11/2026: "testar
// mais para ver se tá tudo certo"; 07/11: escadinha em 3 baralhos). Confere:
//  0. cada baralho abre INTEIRO e NA ORDEM da lib, e o 1º cartão na tela é o 1º
//     da escadinha (a fila do dia e o embaralhar já quebraram isso);
//  1. os cartões do banco são os mesmos de lib/redacao/cartoes-quartetos.ts
//     (o seed pode ter ficado para trás de uma mudança na lib);
//  2. abrir, virar, responder e passar para o próximo cartão;
//  3. o caminho de volta: Voltar para a lista e reabrir o baralho.
// Não grava nada: todo POST/PUT/DELETE em /api devolve {}.
//
// Precisa do dev no ar e de um cookie de sessão (ver skill verificacao-local):
//   BASE=http://localhost:3000 TOKEN_FILE=<arquivo> npx vite-node --config vitest.config.ts tests/e2e/meus-quartetos.e2e.ts

import { readFileSync } from 'fs';
import { chromium, type Page } from 'playwright';
import { baralhosDosQuartetos, cartoesDosQuartetos } from '@/lib/redacao/cartoes-quartetos';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOKEN = readFileSync(process.env.TOKEN_FILE ?? '', 'utf8').trim();
const NOME = 'Quartetos 3: em que quarteto cabem';
const ESPERA = 120000;

type CartaoDoBanco = { frente: string; verso: string };
const falhas: string[] = [];
const conferir = (ok: boolean, msg: string) => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${msg}`);
  if (!ok) falhas.push(msg);
};

async function abrirBaralho(page: Page, nome = NOME): Promise<CartaoDoBanco[]> {
  await page.goto(`${BASE}/flashcards`, { waitUntil: 'networkidle', timeout: ESPERA });
  await page.getByRole('button', { name: /^Abrir Redação/ }).first().click();
  const resposta = page.waitForResponse((r) => /\/api\/flashcards\/decks\/[^/?]+\?mode=/.test(r.url()), { timeout: ESPERA });
  await page.getByRole('button', { name: `Abrir o baralho ${nome}` }).click();
  const corpo = await (await resposta).json();
  const lista = (corpo.cards ?? corpo.deck?.cards ?? corpo.flashcards ?? []) as CartaoDoBanco[];
  await page.getByRole('button', { name: /Virar para ver a resposta/ }).first().waitFor({ timeout: ESPERA });
  return lista;
}

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addCookies([{ name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
  const page = await ctx.newPage();
  await page.route('**/api/**', (r) => (r.request().method() === 'GET' ? r.continue() : r.fulfill({ json: {} })));
  const errosJs: string[] = [];
  page.on('pageerror', (e) => errosJs.push(e.message));

  // 0. Escadinha: inteiro, na ordem, e o 1º na tela é o 1º da lib
  const doBanco: CartaoDoBanco[] = [];
  for (const b of baralhosDosQuartetos()) {
    const lista = await abrirBaralho(page, b.nome);
    doBanco.push(...lista);
    conferir(lista.map((c) => c.frente).join('|') === b.cartoes.map((c) => c.frente).join('|'), `${b.nome}: ${lista.length} de ${b.cartoes.length} cartões, na ordem`);
    const tela = (await page.locator('main').innerText()).slice(0, 4000);
    conferir(tela.includes(b.cartoes[0].frente), `${b.nome}: a tela começa por "${b.cartoes[0].frente.slice(0, 40)}"`);
  }

  // 1. Banco = lib (o baralho 3 fica aberto para o passo 2)
  await abrirBaralho(page);
  const daLib = cartoesDosQuartetos();
  conferir(doBanco.length > 0, `API devolveu ${doBanco.length} cartões`);
  const frentesBanco = new Set(doBanco.map((c) => c.frente));
  const faltando = daLib.filter((c) => !frentesBanco.has(c.frente));
  conferir(faltando.length === 0, `todos os ${daLib.length} cartões da lib estão no banco${faltando.length ? ` (faltam: ${faltando.map((c) => c.frente).join(' | ')})` : ''}`);
  const versoDiferente = daLib.filter((c) => doBanco.some((b) => b.frente === c.frente && b.verso !== c.verso));
  conferir(versoDiferente.length === 0, `verso igual ao da lib${versoDiferente.length ? ` (diferem: ${versoDiferente.map((c) => c.frente).join(' | ')})` : ''}`);

  // 2. Virar, responder, próximo
  const frente1 = (await page.locator('main').innerText()).slice(0, 4000);
  const cartao1 = daLib.find((c) => frente1.includes(c.frente));
  conferir(!!cartao1, `a frente na tela é um cartão do baralho (${cartao1?.frente ?? 'nenhum'})`);
  await page.getByRole('button', { name: /Virar para ver a resposta/ }).last().click();
  await page.getByRole('button', { name: /Virar para a pergunta/ }).last().waitFor();
  const verso = await page.locator('main').innerText();
  conferir(!!cartao1 && verso.includes(cartao1.verso.slice(0, 30)), 'o verso mostrado é o desse cartão');
  await page.getByRole('button', { name: 'Acertei' }).click();
  await page.waitForTimeout(1200);
  const frente2 = await page.locator('main').innerText();
  const cartao2 = daLib.find((c) => frente2.includes(c.frente));
  conferir(!!cartao2 && cartao2.frente !== cartao1?.frente, `depois de "Acertei" veio outro cartão (${cartao2?.frente ?? 'nenhum'})`);

  // 3. Caminho de volta
  await page.getByRole('button', { name: 'Voltar' }).first().click();
  await page.waitForURL(/\/flashcards$/, { timeout: ESPERA });
  await page.waitForTimeout(1500);
  conferir(true, 'Voltar levou para a lista de baralhos');
  const deNovo = await abrirBaralho(page);
  conferir(deNovo.length === baralhosDosQuartetos()[2].cartoes.length, `reabrir mostra o baralho de novo (${deNovo.length} cartões)`);

  conferir(errosJs.length === 0, `sem erro de JavaScript${errosJs.length ? `: ${errosJs.join(' | ')}` : ''}`);
  await browser.close();
  console.log(falhas.length ? `\n${falhas.length} falha(s)` : '\nTudo certo');
  process.exit(falhas.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
