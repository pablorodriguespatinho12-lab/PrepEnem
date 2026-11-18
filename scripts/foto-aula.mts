/* Foto da aula "Não sei isso: ver a aula" de uma questão da prova (18/11/2026: as fórmulas
   ficavam minúsculas nessa caixa, que é maior que o cartão da explicação, e eu só tinha
   fotografado o cartão). Acerta as questões até achar a que tem o trecho, abre a aula e
   fotografa no modo escuro, em 1017 px. Nada grava na conta (POST respondido com {}).
   Uso: PREPENEM_URL opcional; DB_CONFIRMED=1 npx tsx scripts/foto-aula.mts <token> <idDaProva> "<trecho do enunciado>" <saida sem .png> [passo, 1 = primeiro] */
import { chromium } from 'playwright';
const [tok, prova, trecho, out, passo = '1'] = process.argv.slice(2);
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 1017, height: 828 }, colorScheme: 'dark' });
await c.addCookies([{ name: '__Secure-next-auth.session-token', value: tok, domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: 'Lax' }]);
const p = await c.newPage();
await p.addInitScript(() => localStorage.setItem('theme', 'dark'));
await p.route('**/api/**', (r) => (r.request().method() !== 'GET' && !r.request().url().includes('/api/tutor/explicacao') ? r.fulfill({ json: {} }) : r.continue()));
try {
  await p.goto(`http://localhost:3000/provas/${prova}`);
  await p.locator('[data-alt]').first().waitFor({ timeout: 90_000 });
  await p.waitForTimeout(1500);
  const { exam } = await p.evaluate(async (u) => (await fetch(u)).json(), `/api/provas/${prova}`);
  for (let i = 0; i < exam.questions.length; i++) {
    const texto = await p.locator('body').innerText();
    if (texto.includes(trecho)) break;
    const achada = exam.questions.find((x: { question: { enunciado: string } }) => texto.includes(x.question.enunciado.slice(0, 50)));
    console.log(i, achada ? achada.question.id : 'não achei a questão na tela');
    await p.locator(`[data-alt="${achada.question.respostaCorreta}"]`).first().click({ timeout: 8000 });
    await p.getByRole('button', { name: 'Confirmar' }).click({ timeout: 8000 });
    await p.getByRole('button', { name: /Próxima/ }).click({ timeout: 8000 });
    await p.waitForTimeout(500);
  }
  await p.getByRole('button', { name: /ver a aula/ }).click({ timeout: 8000 });
  await p.waitForTimeout(2500);
  for (let i = 1; i < Number(passo); i++) {
    await p.getByRole('button', { name: /Próximo/ }).last().click({ timeout: 8000 });
    await p.waitForTimeout(900);
  }
  await p.screenshot({ path: `${out}-${passo}.png` });
} catch (e) {
  console.log('FALHOU', String(e).slice(0, 200));
  await p.screenshot({ path: `${out}-erro.png` });
}
await b.close();
