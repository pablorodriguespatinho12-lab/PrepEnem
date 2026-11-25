import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { telaDoSolido, type Solido } from '../lib/aula-lousa/solido';

const SAIDA = process.argv[2];
const TODOS: Solido[] = ['cilindro', 'cone', 'piramide', 'esfera', 'cubo', 'caixa'];
const COR: Record<string, string> = { tinta: '#222', azul: '#2563eb', vermelho: '#dc2626', verde: '#16a34a', cinza: '#999', amarelo: '#ca8a04', rosa: '#db2777', verdeClaro: '#86efac' };
const svg = (s: Solido): string => {
  const c = telaDoSolido(s);
  if (c.tipo !== 'lousa') return '';
  const f = c.desenho.map((d) => {
    const cor = COR[('cor' in d && d.cor) || 'tinta'];
    if (d.k === 'caminho') return `<path d="${d.d}" fill="none" stroke="${cor}" stroke-width="3" stroke-linecap="round"/>`;
    if (d.k === 'linha') return `<line x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}" stroke="${cor}" stroke-width="3"/>`;
    if (d.k === 'tx') return `<text x="${d.x}" y="${d.y}" fill="${cor}" font-size="${d.tam ?? 20}" text-anchor="${d.ancora ?? 'middle'}" font-family="sans-serif">${d.s}</text>`;
    return '';
  }).join('');
  return `<svg viewBox="0 0 400 280" width="400" height="280" style="background:#fff;border:1px solid #ccc;margin:6px">${f}</svg>`;
};
writeFileSync(`${SAIDA}/solidos.html`, `<body style="margin:0;width:1260px">${TODOS.map(svg).join('')}</body>`);
(async () => {
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1260, height: 620 } });
await p.goto(`file://${SAIDA}/solidos.html`);
await p.screenshot({ path: `${SAIDA}/solidos.png` });
await b.close();
})();
