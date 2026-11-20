// Uso: node docs/universo-narrado/testar-aula.mjs aula.html pasta-saida
// Passa por TODAS as cenas (estado final, sem esperar a animação) e mede: rolagem da página, balão que não cabe,
// texto da lousa fora do quadro 400x280 e textos que se sobrepõem. Foto no meio da animação da cena 3.
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [arquivo, saida] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });
const FOTOS = new Set([3, 7, 11, 15]);
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
      if (t === 3 && tema === "dark") { await pagina.waitForTimeout(3300); await pagina.screenshot({ path: `${saida}/${nome}-meio-3.png` }); }
      await pagina.evaluate(() => window.__aula.fim());
      await pagina.waitForTimeout(120);
      const m = await pagina.evaluate(() => {
        const r = { lateral: document.documentElement.scrollWidth - innerWidth, vertical: document.documentElement.scrollHeight - innerHeight,
          balao: document.getElementById("balao").scrollHeight - document.getElementById("balao").clientHeight, fora: 0, sobrepoe: [] };
        const svg = document.querySelector("#board svg");
        if (svg && svg.viewBox && svg.viewBox.baseVal.width) {
          const ts = [...svg.querySelectorAll("text")].map((e) => ({ s: e.textContent, b: e.getBBox() }));
          for (const { b } of ts) if (b.x < -1 || b.y < -1 || b.x + b.width > 401 || b.y + b.height > 281) r.fora++;
          for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
            const a = ts[i].b, c = ts[j].b;
            const ox = Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x), oy = Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y);
            if (ox > 3 && oy > 8) r.sobrepoe.push(ts[i].s + " | " + ts[j].s);
          }
        }
        r.alt = svg ? svg.getBoundingClientRect().height : -1;
        return r;
      });
      const ruim = m.lateral > 0 || m.vertical > 0 || m.balao > 1 || m.fora > 0 || m.sobrepoe.length > 0 || (m.alt !== -1 && m.alt < 150);
      if (ruim) { problemas++; console.log(nome, tema, "cena", t, JSON.stringify(m)); }
      if (FOTOS.has(t) && tema === "dark") await pagina.screenshot({ path: `${saida}/${nome}-${t}.png` });
      if (t < total) { await pagina.evaluate(() => document.getElementById("app").classList.remove("fim")); await pagina.click("#prox"); }
    }
    console.log(nome, tema, "cenas:", total, "erros:", erros.length);
    await pagina.close();
  }
}
await navegador.close();
console.log("problemas de medida:", problemas);
