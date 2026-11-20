// Uso: node scripts/foto-pagina.mjs arquivo.html pasta-saida
// Tira foto inteira da página em PC (1280) e celular (400), claro e escuro, e conta rolagem lateral.
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [arquivo, saida] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });
const navegador = await chromium.launch();
for (const [nome, largura] of [["pc", 1280], ["celular", 400]]) {
  for (const tema of ["light", "dark"]) {
    const pagina = await navegador.newPage({ viewport: { width: largura, height: 900 }, colorScheme: tema });
    const erros = [];
    pagina.on("pageerror", (e) => erros.push(String(e)));
    await pagina.goto(pathToFileURL(path.resolve(arquivo)).href, { waitUntil: "load" });
    const lateral = await pagina.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await pagina.screenshot({ path: `${saida}/${nome}-${tema}.png`, fullPage: true });
    console.log(nome, tema, "rolagem lateral (px):", lateral, "erros:", erros.length);
    await pagina.close();
  }
}
await navegador.close();
