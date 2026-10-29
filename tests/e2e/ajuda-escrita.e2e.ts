// Ajuda enquanto escreve (Pablo, 29/10/2026), no celular: "Me ajuda" abre a
// aba Ajuda com a resposta da IA; trocar para Molde e voltar mantém a
// resposta; "Usar este começo" não repete o que ele já tinha escrito; a
// pergunta livre responde. Chama a IA de verdade (2 pedidos na Groq).
// Não grava nada: todo POST em /api, menos /api/redacao/ajuda, devolve {}.
//
//   BASE=http://localhost:3000 TOKEN_FILE=<arquivo> npx vite-node --config vitest.config.ts tests/e2e/ajuda-escrita.e2e.ts

import { readFileSync } from 'fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOKEN = readFileSync(process.env.TOKEN_FILE ?? '', 'utf8').trim();
const COMECO_DELE = 'Nesse sentido,';
const D1 = `Em primeiro lugar, cabe destacar a falta de atendimento psicológico para quem não pode pagar como fator central do estigma. ${COMECO_DELE}`;
const ESPERA_IA_MS = 70_000;

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addCookies([{ name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
  const page = await ctx.newPage();
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.route('**/api/**', (r) => (r.request().method() !== 'GET' && !r.request().url().endsWith('/api/redacao/ajuda') ? r.fulfill({ json: {} }) : r.continue()));
  await page.goto(`${BASE}/redacao/partes`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.evaluate((d1) => localStorage.setItem('prepenem_receita_rascunho_v1', JSON.stringify({
    passo: 5, tema: 'O estigma associado às doenças mentais na sociedade brasileira', causaA: 'acesso', causaB: 'estigma',
    moldesVistos: ['desenvolvimento1'], paragrafos: { introducao: '', desenvolvimento1: d1, desenvolvimento2: '', conclusao: '' },
  })), D1);
  await page.reload({ waitUntil: 'networkidle' });

  const linhas: [string, boolean, string][] = [];
  await page.getByRole('button', { name: 'Me ajuda' }).click();
  await page.getByText('Próxima ação').waitFor({ timeout: ESPERA_IA_MS });
  const onde = await page.getByText(/^Frase 2 de 4/).isVisible();
  linhas.push(['Onde está: frase 2 de 4', onde, onde ? 'visível' : 'não achou']);

  /* O caminho de volta: sair da aba e voltar não pode apagar a resposta. */
  await page.getByRole('tab', { name: 'Molde' }).click();
  await page.getByRole('tab', { name: 'Ajuda' }).click();
  const mantida = await page.getByText('Próxima ação').isVisible();
  linhas.push(['Molde e volta: resposta mantida', mantida, mantida ? 'sim' : 'sumiu']);

  await page.getByRole('button', { name: /Usar este começo/ }).first().click();
  const texto = await page.locator('#texto-desenvolvimento1').inputValue();
  const vezes = texto.split(COMECO_DELE).length - 1;
  linhas.push(['Usar começo: sem repetir o dele', texto.startsWith(D1.slice(0, -COMECO_DELE.length)) && vezes <= 1, `"${COMECO_DELE}" ${vezes}x`]);

  await page.locator('#pergunta-ajuda').fill('como explico a ideia desse autor com o tema?');
  await page.getByRole('button', { name: 'Perguntar' }).click();
  await page.getByText(/^Sua pergunta:/).waitFor({ timeout: ESPERA_IA_MS });
  const resposta = (await page.getByText(/^Sua pergunta:/).locator('xpath=following-sibling::p').innerText()).trim();
  linhas.push(['Pergunta livre responde', resposta.length > 20, `${resposta.length} caracteres`]);

  const largura = await page.evaluate(() => document.documentElement.scrollWidth);
  linhas.push(['Sem rolagem lateral em 390 px', largura <= 390, `${largura} px`]);
  linhas.push(['Sem erro de JS', erros.length === 0, erros.join(' | ') || 'nenhum']);
  await browser.close();

  console.log('| Prova | Passou | Medido |\n|---|---|---|');
  for (const [prova, ok, medido] of linhas) console.log(`| ${prova} | ${ok ? 'sim' : 'NÃO'} | ${medido} |`);
  if (linhas.some(([, ok]) => !ok)) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
