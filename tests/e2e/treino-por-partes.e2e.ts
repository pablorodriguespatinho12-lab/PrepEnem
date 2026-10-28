// Passa pelos 7 passos do Treino por partes, no navegador, em TODOS os temas da
// lista (os de /api/redacao/themes) e num tema livre (Pablo, 28/10/2026).
// Confere em cada tema: tese gerada sem frase circular, D1 e D2 com o motivo
// certo, redação montada com a tese. Imprime a tabela tema x passo.
// Não grava nada: todo POST/PUT/DELETE em /api devolve {}.
//
// Precisa do dev no ar e de um cookie de sessão (ver skill verificacao-local):
//   BASE=http://localhost:3000 TOKEN_FILE=<arquivo> npx vite-node --config vitest.config.ts tests/e2e/treino-por-partes.e2e.ts

import { readFileSync } from 'fs';
import { chromium, type Browser, type Page } from 'playwright';
import { CAUSAS, causaPorChave, montarRedacao, moldeDaFrase, moldeTese, motivoNoTema, problemaCompleto, problemaCurto, type ChaveCausa } from '@/lib/redacao/receita';
import { CONTEUDO_TEMAS, conteudoDoTema } from '@/lib/redacao/conteudo-temas';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOKEN = readFileSync(process.env.TOKEN_FILE ?? '', 'utf8').trim();
const TEMA_LIVRE = 'A obesidade infantil no Brasil';
/* Tema sem dupla na receita: o teste escolhe estes 2. */
const DUPLA_DO_TESTE: [ChaveCausa, ChaveCausa] = ['acesso', 'mercado'];
const COLUNAS = ['1 tema', '2 motivos', '3 tese', '4 intro', '5 D1', '6 D2', '7 concl.', 'montagem'] as const;

type Linha = Record<(typeof COLUNAS)[number], string>;
let temasExtras: string[] = [];

async function abrir(browser: Browser): Promise<Page> {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addCookies([{ name: '__Secure-next-auth.session-token', value: TOKEN, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
  const page = await ctx.newPage();
  await page.route('**/api/**', async (r) => {
    if (r.request().method() !== 'GET') return r.fulfill({ json: {} });
    if (!r.request().url().endsWith('/api/redacao/themes') || temasExtras.length === 0) return r.continue();
    const res = await r.fetch();
    const corpo = await res.json();
    const extras = temasExtras.map((tema, i) => ({ id: `extra-${i}`, tema, anoEnem: conteudoDoTema(tema)?.ano ?? null }));
    return r.fulfill({ response: res, json: { ...corpo, themes: [...(corpo.themes ?? []), ...extras] } });
  });
  return page;
}

const rascunho = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('prepenem_receita_rascunho_v1') || '{}'));
/* Avança e espera o passo novo sozinho na tela: a troca anima a saída do
   antigo (0,22 s) e, antes disso, o painel lido ainda era o do passo anterior. */
const TITULO_DO_PASSO = ['', 'Tema', 'Por que esse problema existe?', 'Tese', 'Introdução', 'Desenvolvimento 1', 'Desenvolvimento 2', 'Conclusão', 'Redação montada'];
async function proximo(page: Page): Promise<void> {
  const r = await rascunho(page);
  await page.getByRole('button', { name: /^(Próximo|Montar redação)/ }).click();
  await page.getByRole('heading', { level: 2, name: TITULO_DO_PASSO[r.passo + 1], exact: true }).waitFor();
  await page.waitForFunction((n) => document.querySelectorAll('main h2').length === n, 1);
}
const ocorrencias = (texto: string, parte: string) => texto.toLowerCase().split(parte.toLowerCase()).length - 1;
const semArtigo = (s: string) => s.replace(/^(o|a|os|as)\s/i, '');

/* "ok" ou o motivo da falha, sem parar os outros passos. */
async function checar(linha: Linha, coluna: (typeof COLUNAS)[number], fn: () => Promise<string | null>): Promise<void> {
  try {
    const erro = await fn();
    linha[coluna] = erro ? `falha: ${erro}` : 'ok';
  } catch (e) {
    linha[coluna] = `falha: ${(e as Error).message.split('\n')[0].slice(0, 80)}`;
  }
}

async function percorrer(browser: Browser, tema: string, daLista: boolean): Promise<Linha> {
  const linha = Object.fromEntries(COLUNAS.map((c) => [c, '-'])) as Linha;
  const page = await abrir(browser);
  await page.goto(`${BASE}/redacao/partes`, { waitUntil: 'networkidle', timeout: 120000 });
  const textos = { introducao: 'Frase um do teste. Frase dois do teste.', desenvolvimento1: 'Texto do D1 de teste.', desenvolvimento2: 'Texto do D2 de teste.', conclusao: 'Texto da conclusão de teste.' };
  let causaA: ChaveCausa | null = null;
  let causaB: ChaveCausa | null = null;
  let tese = '';

  await checar(linha, '1 tema', async () => {
    if (daLista) await page.getByRole('button', { name: tema, exact: false }).first().click();
    else await page.locator('#tema-livre').fill(tema);
    const r = await rascunho(page);
    return r.tema === tema ? null : `tema salvo "${r.tema}"`;
  });

  await checar(linha, '2 motivos', async () => {
    await proximo(page);
    let r = await rascunho(page);
    const dupla = daLista ? conteudoDoTema(tema)?.causas : null;
    if (dupla && (r.causaA !== dupla[0] || r.causaB !== dupla[1])) return `sugeridos ${r.causaA}/${r.causaB}, esperado ${dupla.join('/')}`;
    if (!r.causaA || !r.causaB) {
      for (const c of DUPLA_DO_TESTE) await page.locator('button[aria-pressed]', { hasText: causaPorChave(c)!.nome }).click();
      r = await rascunho(page);
    }
    causaA = r.causaA;
    causaB = r.causaB;
    return causaA && causaB ? null : 'sem 2 motivos';
  });

  await checar(linha, '3 tese', async () => {
    await proximo(page);
    tese = await page.locator('#tese').inputValue();
    if (tese !== moldeTese(causaA, causaB, tema)) return 'tese diferente da gerada';
    if (tese.includes('[')) return 'colchete na tese';
    const curta = semArtigo(problemaCurto(tema));
    if (ocorrencias(tese, curta) !== 1) return `"${curta}" aparece ${ocorrencias(tese, curta)}x (circular)`;
    for (const c of [causaA, causaB]) if (ocorrencias(motivoNoTema(c, tema, ''), curta) > 0) return `motivo ${c} repete o tema`;
    return null;
  });

  await checar(linha, '4 intro', async () => {
    await proximo(page);
    const painel = await page.locator('[data-medir=molde]').innerText();
    if (!painel.includes(tese)) return 'tese não aparece como 3ª frase';
    if (!painel.includes(problemaCompleto(tema))) return 'tema inteiro não aparece na ponte';
    await page.locator('#texto-introducao').fill(textos.introducao);
    return null;
  });

  for (const [coluna, chave, causa, campo] of [
    ['5 D1', 'desenvolvimento1', () => causaA, '#texto-desenvolvimento1'],
    ['6 D2', 'desenvolvimento2', () => causaB, '#texto-desenvolvimento2'],
  ] as const) {
    await checar(linha, coluna, async () => {
      await proximo(page);
      const painel = await page.locator('[data-medir=molde]').innerText();
      const topico = moldeDaFrase(chave, 0, tema, causaA, causaB);
      if (!painel.includes(topico)) return 'tópico frasal diferente do molde';
      if (!topico.includes(motivoNoTema(causa(), tema, ''))) return 'motivo errado no tópico';
      const outra = chave === 'desenvolvimento1' ? causaB : causaA;
      if (outra !== causa() && topico.includes(motivoNoTema(outra, tema, ''))) return 'motivo do outro parágrafo';
      await page.locator(campo).fill(textos[chave]);
      return null;
    });
  }

  await checar(linha, '7 concl.', async () => {
    await proximo(page);
    await page.locator('#texto-conclusao').fill(textos.conclusao);
    const r = await rascunho(page);
    return r.paragrafos?.conclusao === textos.conclusao ? null : 'conclusão não salva';
  });

  await checar(linha, 'montagem', async () => {
    await proximo(page);
    const montada = (await page.locator('section[aria-label="Redação inteira"] .whitespace-pre-wrap').innerText()).trim();
    const esperada = montarRedacao(textos, tese);
    if (montada !== esperada) return 'texto montado diferente';
    return montada.startsWith(`${textos.introducao} ${tese}`) ? null : 'tese fora da introdução';
  });

  await page.context().close();
  return linha;
}

async function main() {
  const browser = await chromium.launch();
  const pagina = await abrir(browser);
  await pagina.goto(`${BASE}/redacao/partes`, { waitUntil: 'networkidle', timeout: 120000 });
  const doBanco: string[] = await pagina.evaluate(async () => ((await (await fetch('/api/redacao/themes')).json()).themes ?? []).map((t: { tema: string }) => t.tema));
  await pagina.context().close();
  /* Os temas da receita que ainda não estão no banco (o script de 2022-2025
     não foi rodado) entram na lista do teste, como se estivessem lá. */
  temasExtras = CONTEUDO_TEMAS.map((c) => c.tema).filter((t) => !doBanco.includes(t));
  const temas = [...doBanco, ...temasExtras];
  if (temas.length === 0) throw new Error('lista de temas vazia');

  const linhas: [string, Linha][] = [];
  for (const tema of temas) linhas.push([tema, await percorrer(browser, tema, true)]);
  linhas.push([`${TEMA_LIVRE} (livre)`, await percorrer(browser, TEMA_LIVRE, false)]);
  await browser.close();

  console.info(`| Tema | ${COLUNAS.join(' | ')} |`);
  console.info(`|---|${COLUNAS.map(() => '---').join('|')}|`);
  for (const [tema, l] of linhas) {
    const nome = tema.length > 60 ? `${tema.slice(0, 57)}...` : tema;
    console.info(`| ${nome}${temasExtras.includes(tema) ? ' (fora do banco)' : ''} | ${COLUNAS.map((c) => l[c]).join(' | ')} |`);
  }
  const falhas = linhas.flatMap(([, l]) => COLUNAS.filter((c) => l[c] !== 'ok')).length;
  console.info(`\n${linhas.length} temas, ${falhas} falha(s). Motivos possíveis: ${CAUSAS.length}.`);
  process.exitCode = falhas ? 1 : 0;
}

main();
