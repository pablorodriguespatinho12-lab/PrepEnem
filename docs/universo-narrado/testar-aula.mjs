// Uso: node docs/universo-narrado/testar-aula.mjs aula.html pasta-saida
// Passa por TODAS as telas e mede: conteúdo maior que o palco (corte), rolagem da página, erros. Foto de telas-chave.
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [arquivo, saida] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });
const FOTOS = new Set([3, 10, 14, 18, 21, 22]);
const navegador = await chromium.launch();
let problemas = 0;
for (const [nome, w, h] of [["pc", 1366, 640], ["celular", 390, 700], ["pequeno", 360, 600]]) {
  for (const tema of ["light", "dark"]) {
    const pagina = await navegador.newPage({ viewport: { width: w, height: h }, colorScheme: tema });
    const erros = [];
    pagina.on("pageerror", (e) => erros.push(String(e)));
    await pagina.goto(pathToFileURL(path.resolve(arquivo)).href, { waitUntil: "load" });
    const total = Number((await pagina.textContent("#n")).split("/")[1]);
    for (let t = 1; t <= total; t++) {
      await pagina.waitForTimeout(300);
      const m = await pagina.evaluate(() => {
        const s = document.getElementById("stage"), d = s.querySelector(".in");
        return { corte: d.offsetHeight - (s.clientHeight - parseFloat(getComputedStyle(s).paddingTop) - parseFloat(getComputedStyle(s).paddingBottom)),
                 lateral: document.documentElement.scrollWidth - innerWidth, vertical: document.documentElement.scrollHeight - innerHeight };
      });
      if (m.corte > 1 || m.lateral > 0 || m.vertical > 0) { problemas++; console.log(nome, tema, "tela", t, JSON.stringify(m)); }
      if (FOTOS.has(t) && tema === "dark") await pagina.screenshot({ path: `${saida}/${nome}-${t}.png` });
      if (t < total) await pagina.click("#prox");
    }
    console.log(nome, tema, "telas:", total, "erros:", erros.length);
    await pagina.close();
  }
}
await navegador.close();
console.log("problemas de medida:", problemas);
