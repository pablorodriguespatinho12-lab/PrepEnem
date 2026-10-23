/**
 * Mede uma tela de fora (ou daqui) sem login: fonte, escala, medida de linha,
 * cor de fundo/texto, variáveis de CSS e durações de transição.
 *
 * Uso: npx tsx scripts/medir-referencia.mts <url> [largura=1440]
 * Grava o JSON completo e um screenshot no diretório de MEDIR_SAIDA
 * (padrão: /tmp) e imprime só o resumo — o JSON cru não entra no contexto.
 *
 * O corpo do evaluate vai como STRING: função passada direto quebra com
 * `__name is not defined` (helper que o tsx injeta e o navegador não tem).
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const url = process.argv[2];
const largura = Number(process.argv[3] ?? 1440);
if (!url) {
  console.error('uso: npx tsx scripts/medir-referencia.mts <url> [largura]');
  process.exit(1);
}
const saida = process.env.MEDIR_SAIDA ?? '/tmp';
const nome = new URL(url).hostname.replace(/^www\./, '') + '-' + largura;

const MEDIDA = `(() => {
  const cs = (el) => el ? getComputedStyle(el) : null;
  const vars = new Set(); const duracoes = {}; let keyframes = 0; let folhasBloqueadas = 0;
  for (const s of document.styleSheets) {
    let regras; try { regras = s.cssRules; } catch { folhasBloqueadas++; continue; }
    for (const r of regras) {
      if (r.type === 7) keyframes++;
      if (!r.style) continue;
      for (const p of r.style) if (p.startsWith('--')) vars.add(p);
      const d = r.style.transitionDuration;
      if (d) for (const x of d.split(',')) { const k = x.trim(); duracoes[k] = (duracoes[k] || 0) + 1; }
    }
  }
  const paragrafos = [...document.querySelectorAll('p')].filter((p) => p.innerText.trim().length > 80);
  const p = paragrafos[0];
  const h1 = document.querySelector('h1');
  const larguraP = p ? p.getBoundingClientRect().width : 0;
  const fsP = p ? parseFloat(cs(p).fontSize) : 0;
  return {
    innerWidth: window.innerWidth,
    textoVisivel: document.body.innerText.length,
    fundo: cs(document.body).backgroundColor,
    texto: cs(document.body).color,
    fonteCorpo: cs(document.body).fontFamily.split(',')[0],
    h1: h1 ? { fonte: cs(h1).fontFamily.split(',')[0], tamanho: cs(h1).fontSize, peso: cs(h1).fontWeight } : null,
    paragrafo: p ? { fonte: cs(p).fontFamily.split(',')[0], tamanho: cs(p).fontSize, alturaLinha: cs(p).lineHeight,
      larguraPx: Math.round(larguraP), caracteresPorLinha: fsP ? Math.round(larguraP / (fsP * 0.5)) : 0 } : null,
    variaveisCss: vars.size, keyframes, folhasBloqueadas,
    duracoesMaisUsadas: Object.entries(duracoes).sort((a, b) => b[1] - a[1]).slice(0, 5),
    overflowHorizontal: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
})()`;

const nav = await chromium.launch();
try {
  const pag = await nav.newPage();
  await pag.setViewportSize({ width: largura, height: 900 });
  const resp = await pag.goto(url, { waitUntil: 'load', timeout: 45000 });
  await pag.waitForTimeout(2500);
  const m = await pag.evaluate(MEDIDA);
  writeFileSync(join(saida, `${nome}.json`), JSON.stringify({ url, status: resp?.status(), ...m }, null, 2));
  await pag.screenshot({ path: join(saida, `${nome}.png`) });
  console.log(JSON.stringify({ url, status: resp?.status(), innerWidth: m.innerWidth, texto: m.textoVisivel,
    fonte: m.fonteCorpo, h1: m.h1?.tamanho, p: m.paragrafo && `${m.paragrafo.tamanho}/${m.paragrafo.alturaLinha} ~${m.paragrafo.caracteresPorLinha}ch`,
    vars: m.variaveisCss, keyframes: m.keyframes, duracoes: m.duracoesMaisUsadas.map((d) => d.join('×')).join(' ') }));
} finally {
  await nav.close();
}
