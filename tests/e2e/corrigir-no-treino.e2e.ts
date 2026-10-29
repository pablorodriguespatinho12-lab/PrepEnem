// Passo 8 do Treino por partes: corrigir e saber o que treinar (Pablo,
// 29/10/2026: "melhorar com o tempo"). Não grava nada: submit, evaluate e
// history são respondidos aqui, com a correção de verdade da redação do leigo
// (correcao-leigo.json, gerada por gerar-correcao-leigo.ts). Confere, no
// celular e no computador: a devolutiva, o botão que leva ao passo, o caminho
// de volta (mudou o texto: "Corrigir de novo" e a comparação), a correção que
// reabre sozinha, o erro que não cria outra redação e o texto curto demais.
//
//   BASE=http://localhost:3000 TOKEN_FILE=<arquivo> SHOTS=<pasta> npx vite-node --config vitest.config.ts tests/e2e/corrigir-no-treino.e2e.ts

import { readFileSync } from 'fs';
import { chromium, type Page } from 'playwright';
import { PARAGRAFOS_LEIGO, REDACAO_LEIGO, TEMA_LEIGO, TESE_LEIGO } from './texto-leigo';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOKEN = readFileSync(process.env.TOKEN_FILE ?? '', 'utf8').trim();
const SHOTS = process.env.SHOTS ?? '';
const CORRECAO = JSON.parse(readFileSync('tests/e2e/correcao-leigo.json', 'utf8'));
const ANTERIOR = { id: 'antes', createdAt: '2026-10-28T10:00:00.000Z', notaTotal: 600, notaC1: 120, notaC2: 120, notaC3: 120, notaC4: 120, notaC5: 120 };
const essay = (id: string) => ({
  id, createdAt: new Date().toISOString(), notaTotal: CORRECAO.total, avaliacao: JSON.stringify(CORRECAO),
  notaC1: CORRECAO.notas.c1, notaC2: CORRECAO.notas.c2, notaC3: CORRECAO.notas.c3, notaC4: CORRECAO.notas.c4, notaC5: CORRECAO.notas.c5,
});

interface Contagem { submit: number; evaluate: number; falharEvaluate: boolean }

async function abrir(largura: number, contagem: Contagem): Promise<{ page: Page; erros: string[] }> {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: largura, height: largura < 500 ? 844 : 900 } });
  await ctx.addCookies([{ name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
  const page = await ctx.newPage();
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.route('**/api/**', async (r) => {
    const url = r.request().url();
    if (url.endsWith('/api/redacao/submit')) { contagem.submit++; return r.fulfill({ json: { essayId: 'agora', status: 'pendente' } }); }
    if (url.endsWith('/api/redacao/evaluate')) {
      contagem.evaluate++;
      if (contagem.falharEvaluate) { contagem.falharEvaluate = false; return r.fulfill({ status: 502, json: { error: 'Tente de novo em 1 minuto.' } }); }
      return r.fulfill({ json: { success: true, notaTotal: CORRECAO.total } });
    }
    if (url.includes('/api/redacao/history?id=')) return r.fulfill({ json: { essay: essay('agora') } });
    if (url.endsWith('/api/redacao/history')) return r.fulfill({ json: { essays: [essay('agora'), ANTERIOR] } });
    return r.request().method() !== 'GET' ? r.fulfill({ json: {} }) : r.continue();
  });
  return { page, erros };
}

const rascunho = (paragrafos: Record<string, string>, correcao: unknown = null) => ({
  passo: 8, tema: TEMA_LEIGO, causaA: 'estigma', causaB: 'estado', tese: TESE_LEIGO, teseGerada: TESE_LEIGO,
  paragrafos, moldesVistos: ['introducao', 'desenvolvimento1', 'desenvolvimento2', 'conclusao'], correcao,
});
async function comRascunho(page: Page, r: unknown): Promise<void> {
  await page.goto(`${BASE}/redacao/partes`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.evaluate((v) => localStorage.setItem('prepenem_receita_rascunho_v1', JSON.stringify(v)), r);
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 2, name: 'Redação montada', exact: true }).waitFor();
}

async function percorrer(largura: number): Promise<[string, boolean, string][]> {
  const linhas: [string, boolean, string][] = [];
  const contagem: Contagem = { submit: 0, evaluate: 0, falharEvaluate: true };
  const { page, erros } = await abrir(largura, contagem);
  const prova = (nome: string, ok: boolean, medido: string) => linhas.push([`${largura} px · ${nome}`, ok, medido]);

  await comRascunho(page, rascunho(PARAGRAFOS_LEIGO));
  /* 1ª tentativa: o evaluate falha. A 2ª não pode criar outra redação. */
  await page.getByRole('button', { name: 'Corrigir minha redação' }).click();
  await page.getByText('Tente de novo em 1 minuto.').waitFor();
  await page.getByRole('button', { name: 'Corrigir minha redação' }).click();
  await page.getByText('Sua nota').waitFor({ timeout: 15000 });
  prova('erro e nova tentativa: 1 redação só', contagem.submit === 1 && contagem.evaluate === 2, `submit ${contagem.submit}x, evaluate ${contagem.evaluate}x`);

  const caixa = page.locator('section[aria-label="Correção"]');
  const texto = await caixa.innerText();
  prova('nota e meta', texto.includes(`${CORRECAO.total}`) && /Próxima meta: .+ de \d+ para \d+/.test(texto), texto.match(/Próxima meta: [^\n]+/)?.[0] ?? 'sem meta');
  prova('já funciona é fato, sem elogio', /Já funciona/.test(texto) && !/parabéns|ótimo|excelente/i.test(texto), texto.match(/Já funciona\n([^\n]+)/)?.[1]?.slice(0, 60) ?? '-');
  prova('comparação com a anterior', texto.includes(`+${CORRECAO.total - 600} desde a redação anterior (600)`), texto.match(/[+-]?\d+ desde a redação anterior[^\n]+/)?.[0] ?? 'não achou');
  if (SHOTS) await caixa.screenshot({ path: `${SHOTS}/devolutiva-${largura}.png` });

  /* O botão leva ao passo; mudar o texto e voltar pede outra correção. */
  const botao = page.getByRole('button', { name: /^Treinar no passo \d/ });
  const passo = Number((await botao.innerText()).match(/\d+/)?.[0]);
  await botao.click();
  const titulos = ['', '', '', '', 'Introdução', 'Desenvolvimento 1', 'Desenvolvimento 2', 'Conclusão'];
  await page.getByRole('heading', { level: 2, name: titulos[passo], exact: true }).waitFor();
  prova('botão leva ao passo', true, `passo ${passo}`);
  const campo = page.locator('textarea').first();
  await campo.fill(`${await campo.inputValue()} Segundo Erving Goffman, em Estigma, a pessoa é reduzida a uma marca.`);
  for (let p = passo; p < 8; p++) {
    await page.getByRole('button', { name: /^(Próximo|Montar redação)/ }).click();
    await page.waitForTimeout(350);
  }
  await page.getByRole('heading', { level: 2, name: 'Redação montada', exact: true }).waitFor();
  const deNovo = await page.getByRole('button', { name: 'Corrigir de novo' }).isVisible();
  prova('texto mudou: "Corrigir de novo"', deNovo, deNovo ? 'visível' : 'não apareceu');

  /* Voltar com o texto igual: a correção reabre sozinha, sem corrigir de novo. */
  const antes = contagem.submit;
  await comRascunho(page, rascunho(PARAGRAFOS_LEIGO, { essayId: 'agora', texto: REDACAO_LEIGO }));
  await page.getByText('Sua nota').waitFor({ timeout: 15000 });
  prova('correção guardada reabre', contagem.submit === antes, `submit ${contagem.submit - antes}x a mais`);

  /* Texto curto: nem manda, explica o mínimo de 8 linhas. */
  await comRascunho(page, rascunho({ introducao: 'Frase curta.', desenvolvimento1: '', desenvolvimento2: '', conclusao: '' }));
  const curto = await page.getByText(/linhas para o ENEM corrigir/).isVisible();
  prova('menos de 8 linhas: explica e não envia', curto && contagem.submit === antes, curto ? 'mensagem visível' : 'sem mensagem');

  const largo = await page.evaluate(() => document.documentElement.scrollWidth);
  prova('sem rolagem lateral', largo <= largura, `${largo} px`);
  prova('sem erro de JS', erros.length === 0, erros.join(' | ') || 'nenhum');
  await page.context().browser()?.close();
  return linhas;
}

async function main(): Promise<void> {
  const linhas = [...(await percorrer(390)), ...(await percorrer(1440))];
  console.log('| Prova | Passou | Medido |\n|---|---|---|');
  for (const [prova, ok, medido] of linhas) console.log(`| ${prova} | ${ok ? 'sim' : 'NÃO'} | ${medido} |`);
  if (linhas.some(([, ok]) => !ok)) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
