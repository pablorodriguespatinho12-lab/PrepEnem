// Escreve um texto de teste nos 4 parágrafos do Treino por partes e prova, no
// navegador (Pablo, 28/10/2026):
// 1. "Copiar redação" põe na área de transferência o tema + a redação inteira;
// 2. "Guardar em Salvas" faz a redação aparecer na aba Salvas da Redação.
// Navegador limpo: não mexe nas Salvas de ninguém. POST/PUT/DELETE em /api = {}.
//   BASE=http://localhost:3000 TOKEN_FILE=<arquivo> npx vite-node --config vitest.config.ts tests/e2e/copiar-e-salvas.e2e.ts

import { readFileSync } from 'fs';
import { chromium } from 'playwright';
import { montarRedacao, moldeTese } from '@/lib/redacao/receita';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOKEN = readFileSync(process.env.TOKEN_FILE ?? '', 'utf8').trim();
const TEMA = 'O estigma associado às doenças mentais na sociedade brasileira';
const TEXTOS = {
  introducao: 'Segundo Michel Foucault, em História da Loucura, a sociedade aprendeu a isolar quem foge da norma. Essa reflexão se aplica ao Brasil.',
  desenvolvimento1: 'Em primeiro lugar, o preconceito esconde quem sofre. Goffman mostra que o estigma reduz a pessoa a uma marca.',
  desenvolvimento2: 'Além disso, a omissão do Estado agrava o estigma. A Lei 10.216 manda tratar perto da família.',
  conclusao: 'Portanto, o Ministério da Saúde deve criar campanhas, por meio das redes sociais, a fim de que quem sofre busque ajuda.',
};

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
  await ctx.addCookies([{ name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
  const page = await ctx.newPage();
  await page.route('**/api/**', (r) => (r.request().method() === 'GET' ? r.continue() : r.fulfill({ json: {} })));

  /* Começa no passo 4 com tema e motivos escolhidos: os passos 1 a 3 já são
     cobertos por treino-por-partes.e2e.ts. */
  const tese = moldeTese('estigma', 'estado', TEMA);
  await page.addInitScript((r) => {
    if (sessionStorage.getItem('semeado')) return;
    localStorage.setItem('prepenem_receita_rascunho_v1', JSON.stringify(r));
    sessionStorage.setItem('semeado', '1');
  }, { passo: 4, tema: TEMA, causaA: 'estigma', causaB: 'estado', tese, teseGerada: tese });
  await page.goto(`${BASE}/redacao/partes`, { waitUntil: 'networkidle', timeout: 120000 });

  const titulos = { introducao: 'Introdução', desenvolvimento1: 'Desenvolvimento 1', desenvolvimento2: 'Desenvolvimento 2', conclusao: 'Conclusão' } as const;
  for (const chave of Object.keys(TEXTOS) as (keyof typeof TEXTOS)[]) {
    await page.getByRole('heading', { level: 2, name: titulos[chave], exact: true }).waitFor();
    await page.locator(`#texto-${chave}`).fill(TEXTOS[chave]);
    await page.getByRole('button', { name: /^(Próximo|Montar redação)/ }).click();
  }
  await page.getByRole('heading', { level: 2, name: 'Redação montada', exact: true }).waitFor();

  const esperada = montarRedacao(TEXTOS, tese);
  const resultados: [string, boolean, string][] = [];

  await page.getByRole('button', { name: /Copiar redação/ }).click();
  const copiado = await page.evaluate(() => navigator.clipboard.readText());
  resultados.push(['Copiar redação copia tema + 4 parágrafos (com a tese)', copiado === `Tema: ${TEMA}\n\n${esperada}`, `${copiado.length} caracteres, ${copiado.split('\n\n').length - 1} parágrafos`]);

  await page.getByRole('button', { name: /Guardar em Salvas/ }).click();
  await page.getByText('Guardada em Salvas').waitFor();
  await page.goto(`${BASE}/redacao`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Salvas/ }).click();
  await page.getByRole('heading', { name: 'Redações Salvas' }).waitFor();
  const naAba = await page.getByText(`Receita: ${TEMA}`).first().isVisible();
  const lista = await page.evaluate(() => JSON.parse(localStorage.getItem('redacao_saved_list') || '[]'));
  resultados.push(['Guardar em Salvas aparece na aba Salvas', naAba, `"Receita: ${TEMA.slice(0, 30)}..." visível`]);
  resultados.push(['O texto guardado é a redação inteira', lista[0]?.texto === esperada, `${lista.length} item na lista`]);

  await browser.close();
  console.info('| Prova | Passou | Medido |\n|---|---|---|');
  for (const [nome, ok, medido] of resultados) console.info(`| ${nome} | ${ok ? 'sim' : 'não'} | ${medido} |`);
  process.exitCode = resultados.every(([, ok]) => ok) ? 0 : 1;
}

main();
