/* Cena da capa do modo Jardim, igual à prévia "Jardim vivo" aprovada em
   26/11/2026. Texto SVG montado com sorteio de semente fixa: servidor e
   navegador geram exatamente o mesmo desenho. Sem movimento ligado ao cursor
   (Pablo pediu para tirar). Animação em app/jardim-cena.css. */

type Sorteio = () => number;

function sorteio(semente: number): Sorteio {
  let s = semente;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const varios = (n: number, f: (i: number) => string) => Array.from({ length: n }, (_, i) => f(i)).join('');
const n1 = (v: number) => Math.round(v * 10) / 10;
const tempo = (dur: number, atraso = 0) => `style="--dur:${n1(dur)}s;--atraso:${n1(atraso)}s"`;

function morro(r: Sorteio, y: number, amp: number, cor: string): string {
  let d = `M-60 ${y}`;
  for (let x = -60; x < 1060; x += 140) {
    d += `Q${x + 70} ${n1(y - amp * (0.3 + r()))} ${x + 140} ${n1(y + (r() - 0.5) * amp * 0.5)}`;
  }
  return `<path d="${d}V520H-60Z" fill="${cor}"/>`;
}

const pinheiro = (x: number, y: number, h: number) =>
  `<path d="M${n1(x)} ${n1(y - h)}L${n1(x + h * 0.28)} ${n1(y - h * 0.45)}H${n1(x + h * 0.15)}L${n1(x + h * 0.38)} ${n1(y)}H${n1(x - h * 0.38)}L${n1(x - h * 0.15)} ${n1(y - h * 0.45)}H${n1(x - h * 0.28)}Z" fill="#4c8566"/>`;

const COPA = [[0, -70, 34, '#2f7a45'], [-24, -52, 25, '#3f8f4f'], [24, -54, 26, '#3f8f4f'], [-6, -84, 20, '#68ad5c']] as const;

const arvore = (x: number, y: number, s: number) =>
  `<rect x="${n1(x - 4 * s)}" y="${n1(y - 40 * s)}" width="${n1(8 * s)}" height="${n1(44 * s)}" rx="${n1(3 * s)}" fill="#6b4a32"/>` +
  COPA.map(([dx, dy, raio, cor]) => `<circle cx="${n1(x + dx * s)}" cy="${n1(y + dy * s)}" r="${n1(raio * s)}" fill="${cor}"/>`).join('');

/* O que se mexe fica em camada própria (um <svg> por peça): a placa de vídeo
   só desliza a camada, liso a 60 quadros/s, sem redesenhar a cena. Dentro de um
   SVG só, o movimento tinha de ir em passos e "engasgava" (27/11/2026). */
export type Camada = { classe: string; estilo: Record<string, string>; desenho: string };

const tempoDa = (dur: number, atraso: number) => ({ '--dur': `${dur}s`, '--atraso': `${atraso}s` });

const nuvem = (y: number, escala: number, dur: number, atraso: number, parada: number): Camada => ({
  classe: 'jv-nuvem',
  estilo: { ...tempoDa(dur, atraso), '--parada': `${parada}` },
  desenho: `<g transform="translate(0 ${y}) scale(${escala})" fill="#fff" opacity=".75"><ellipse cx="60" cy="30" rx="60" ry="18"/><circle cx="45" cy="22" r="22"/><circle cx="76" cy="16" r="27"/></g>`,
});

const anel = (raio: number, i: number): Camada => ({
  classe: 'jv-anel jv-so-dia jv-astro',
  estilo: tempoDa(6, n1(i * 0.7)),
  desenho: `<circle cx="730" cy="120" r="${raio}" fill="none" stroke="#fff3bd" stroke-width="${n1(3 - i * 0.7)}" opacity=".8"/>`,
});

const AVES = '<path class="jv-asa" d="M0 100q9-10 18 0q9-10 18 0" fill="none" stroke="#2d4a4a" stroke-width="2.5"/><path class="jv-asa" d="M46 118q7-8 14 0q7-8 14 0" fill="none" stroke="#2d4a4a" stroke-width="2"/>';

export const CAMADAS: readonly Camada[] = [
  ...[70, 105, 145].map(anel),
  nuvem(46, 1, 70, -20, 300),
  nuvem(120, 0.65, 95, -60, 640),
  nuvem(30, 0.45, 120, -95, 640),
  { classe: 'jv-ave', estilo: {}, desenho: AVES },
];

export function montarCena(): string {
  const r = sorteio(7);
  const defs = `<defs><linearGradient id="jv-dia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb8c4"/><stop offset=".55" stop-color="#cfe6d2"/><stop offset="1" stop-color="#fdeec2"/></linearGradient><linearGradient id="jv-noite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1230"/><stop offset="1" stop-color="#2b4a63"/></linearGradient><radialGradient id="jv-luz"><stop offset="0" stop-color="#fff6c9" stop-opacity=".95"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient></defs>`;
  const estrelas = varios(70, () => `<circle cx="${n1(r() * 1000)}" cy="${n1(r() * 230)}" r="${n1(0.6 + r() * 1.5)}" fill="#fff" opacity="${n1(0.4 + r() * 0.6)}"/>`);
  const ceu = `<rect width="1000" height="480" fill="url(#jv-dia)"/><rect class="jv-so-noite" width="1000" height="480" fill="url(#jv-noite)"/><g class="jv-so-noite">${estrelas}</g>`;
  const sol = `<g class="jv-so-dia"><circle cx="730" cy="120" r="130" fill="url(#jv-luz)"/><circle cx="730" cy="120" r="42" fill="#ffe58a"/></g>`;
  const lua = `<g class="jv-so-noite"><circle cx="730" cy="110" r="90" fill="url(#jv-luz)" opacity=".35"/><circle cx="730" cy="110" r="34" fill="#f3f1de"/><circle cx="718" cy="102" r="7" fill="#d9d8c4"/><circle cx="742" cy="122" r="5" fill="#d9d8c4"/></g>`;
  const longe = morro(r, 285, 110, '#9dc3b0');
  const meio = morro(r, 330, 80, '#6fa683') + varios(34, (i) => {
    const x = i * 32 + r() * 20 - 30;
    const y = 345 + r() * 14;
    return pinheiro(x, y, 34 + r() * 26);
  });
  const rio = `<path d="M560 360C500 390 640 402 560 428S410 455 470 520H700C610 462 700 440 660 420S590 385 590 360Z" fill="#8fd0dc"/>`;
  const vale = morro(r, 390, 60, '#7cb45c') + rio;
  const brilhos = varios(9, (i) => {
    const atraso = -r() * 3;
    const x = 490 + r() * 140;
    return `<rect class="jv-brilho" ${tempo(3.2, atraso)} x="${n1(x)}" y="${385 + i * 10}" width="${n1(16 + r() * 22)}" height="3" rx="2" fill="#fff"/>`;
  });
  const arvores = arvore(850, 420, 1.25) + arvore(935, 405, 0.85) + arvore(120, 400, 0.9);
  const frente = morro(r, 452, 34, '#4d8c46') + varios(60, () => {
    const x = r() * 1060 - 30;
    const y = 448 + r() * 34;
    const cor = ['#ffd45c', '#fff', '#f28f79', '#c6a2f0'][Math.floor(r() * 4)];
    return `<path d="M${n1(x)} ${n1(y + 14)}v-12" stroke="#2f6b33" stroke-width="2"/><circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(3 + r() * 2.5)}" fill="${cor}"/>`;
  });
  const vagalumes = varios(22, () => {
    const atraso = -r() * 7;
    return `<circle class="jv-vaga" ${tempo(7, atraso)} cx="${n1(r() * 1000)}" cy="${n1(290 + r() * 170)}" r="2.6" fill="#ffee8c"/>`;
  });
  return `${defs}${ceu}<g class="jv-astro">${sol}${lua}</g><g class="jv-terra">${longe}${meio}${vale}</g><g>${brilhos}</g><g class="jv-terra">${arvores}${frente}</g><g class="jv-so-noite">${vagalumes}</g>`;
}
