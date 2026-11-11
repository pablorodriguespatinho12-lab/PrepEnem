/* Percorre uma prova pronta na tela, questão por questão, antes de dizer ao
   Pablo que ela está no site (10/11/2026: as 4 provas do dia 2 só foram
   abertas na tela depois que ele perguntou "deu tudo certinho?"; nas 160
   questões e 840 passos o robô achou 0 defeito real).

   Para cada questão: marca uma alternativa ERRADA (a explicação abre
   sozinha), confere se a tela marca a letra certa do banco, e passa por todos
   os passos da explicação procurando fórmula quebrada (.katex-error), LaTeX
   cru, "undefined"/"NaN", 1º passo sem desenho e conteúdo vazando da caixa.

   Rodar com o dev ou o build no ar e a sessão de verificacao-local:
     PREPENEM_TOKEN=... npx tsx scripts/varrer-prova.mts <idDaProva> [...] [--largura=390] [--ate=5]

   Todo POST em /api/** recebe {} (nada grava na conta), menos
   /api/tutor/explicacao, que só lê a explicação pronta. Questão sem
   explicação pronta GASTA a IA do site: rode só em prova com explicação pronta. */
import { chromium, type Page } from 'playwright';

const BASE = process.env.PREPENEM_URL ?? 'http://localhost:3000';
const TOKEN = process.env.PREPENEM_TOKEN;
if (!TOKEN) throw new Error('Falta PREPENEM_TOKEN (ver skill verificacao-local)');

const opcao = (nome: string, padrao: number) => Number(process.argv.find((a) => a.startsWith(`--${nome}=`))?.split('=')[1] ?? padrao);
const LARGURA = opcao('largura', 1366);
const ALTURA = LARGURA < 600 ? 844 : 768;
const ATE = opcao('ate', Infinity);
const PROVAS = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const ESPERA_PASSO_MS = 450;
const ESPERA_CARREGAR_MS = 1500;
const TEXTO_CRU = /undefined|NaN|\[object|\\frac|\\text|\\,/;

interface QuestaoDaProva { question: { id: string; respostaCorreta: string } }

async function varrerQuestao(page: Page, marca: string, certa: string, achados: string[]): Promise<number> {
  const errada = LETRAS.find((l) => l !== certa)!;
  await page.locator(`[data-alt="${errada}"]`).first().click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  if ((await page.locator(`[data-alt="${certa}"][data-state="correta"]`).count()) === 0) achados.push(`${marca}: a tela não marcou ${certa} como certa`);
  const exp = page.locator('[aria-label="Explicação"]');
  await exp.waitFor({ timeout: 30_000 });
  const passos = await exp.locator('[aria-label^="Ir para o passo"]').count();
  if (passos < 2) achados.push(`${marca}: só ${passos} passo(s) na tela`);
  for (let p = 0; p < passos; p++) {
    await exp.locator(`[aria-label="Ir para o passo ${p + 1}"]`).click();
    await page.waitForTimeout(ESPERA_PASSO_MS);
    const m = await exp.evaluate((el) => ({
      texto: (el as HTMLElement).innerText,
      katexErro: el.querySelectorAll('.katex-error').length,
      desenho: el.querySelectorAll('svg, table, .katex').length,
      vaza: [...el.querySelectorAll('*')].some((n) => n.scrollWidth > n.clientWidth + 2 && getComputedStyle(n).overflowX === 'hidden' && n.clientWidth > 50),
    }));
    if (m.katexErro) achados.push(`${marca} passo ${p + 1}: fórmula quebrada`);
    if (TEXTO_CRU.test(m.texto)) achados.push(`${marca} passo ${p + 1}: texto cru "${m.texto.match(TEXTO_CRU)![0]}"`);
    if (p === 0 && m.desenho === 0) achados.push(`${marca} passo 1: sem desenho`);
    if (m.vaza) achados.push(`${marca} passo ${p + 1}: algo vaza da caixa`);
  }
  return passos;
}

async function main() {
  if (PROVAS.length === 0) throw new Error('Passe o id de pelo menos uma prova');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: LARGURA, height: ALTURA } });
  await context.addCookies([{ name: '__Secure-next-auth.session-token', value: TOKEN!, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
  const page = await context.newPage();
  const achados: string[] = [];
  const erros = new Set<string>();
  page.on('pageerror', (e) => erros.add(`JS: ${e.message.slice(0, 120)}`));
  page.on('console', (m) => { if (m.type() === 'error') erros.add(`console: ${m.text().slice(0, 120)}`); });
  await page.route('**/api/**', (route) => {
    const req = route.request();
    if (req.method() !== 'GET' && !req.url().includes('/api/tutor/explicacao')) return route.fulfill({ json: {} });
    return route.continue();
  });
  let totalPassos = 0;
  let totalQuestoes = 0;
  for (const id of PROVAS) {
    await page.goto(`${BASE}/provas/${id}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-alt]').first().waitFor({ timeout: 60_000 });
    await page.waitForTimeout(ESPERA_CARREGAR_MS);
    const { exam } = await page.evaluate(async (u) => (await fetch(u)).json(), `/api/provas/${id}`);
    const questoes: QuestaoDaProva[] = exam.questions;
    const limite = Math.min(questoes.length, ATE);
    for (let i = 0; i < limite; i++) {
      const marca = `${exam.nome} #${i + 1}`;
      try {
        totalPassos += await varrerQuestao(page, marca, questoes[i].question.respostaCorreta, achados);
        totalQuestoes++;
        if (i < limite - 1) {
          await page.getByRole('button', { name: /Próxima/ }).click();
          await page.waitForTimeout(300);
        }
      } catch (e) {
        achados.push(`${marca}: travou (${(e as Error).message.split('\n')[0].slice(0, 100)})`);
        break;
      }
    }
  }
  await browser.close();
  console.log(`${totalQuestoes} questões, ${totalPassos} passos, largura ${LARGURA} px`);
  console.log(`achados (${achados.length}):${achados.map((a) => `\n  ${a}`).join('')}`);
  console.log(`erros JS/console (${erros.size}):${[...erros].map((e) => `\n  ${e}`).join('')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
