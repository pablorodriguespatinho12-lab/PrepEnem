// Desenho em pixel (Pablo, 14/11/2026: "nem todos os desenhos estão em arte de pixel
// bem visualizável"). O SVG feito à mão é desenhado PEQUENO num canvas (1 ponto a cada
// LADO_DO_PIXEL unidades) e ampliado com pixels quadrados. Os rótulos (<text>) ficam
// num SVG por cima, nítidos, para dar para ler. Filtro SVG (feTile) foi testado e
// apagava o desenho no Chrome sem placa de vídeo: por isso canvas.

export const LADO_DO_PIXEL = 3; // unidades do viewBox por pixel (~4,5 px na tela)
export const ENGROSSA_LINHA = 1.6; // linha de 2 unidades viraria pixel apagado
export const QUADROS_POR_SEGUNDO = 8; // animação "de videogame", e barata

const TEXTO = /<text\b[\s\S]*?<\/text>/g;

/** Separa o SVG em formas (vão para o canvas) e textos (ficam nítidos por cima). */
export function separarSvg(svg: string): { formas: string; textos: string } | null {
  const abre = svg.match(/^\s*<svg\b[^>]*>/);
  const fecha = svg.lastIndexOf('</svg>');
  if (!abre || fecha < 0) return null;
  const corpo = svg.slice(abre[0].length, fecha);
  const textos = corpo.match(TEXTO) ?? [];
  return {
    formas: `${abre[0]}${corpo.replace(TEXTO, '')}</svg>`,
    textos: `${abre[0]}${textos.join('')}</svg>`,
  };
}

/** Tamanho do viewBox ("0 0 340 200" → 340 × 200). */
export function tamanhoDoViewBox(svg: string): { largura: number; altura: number } | null {
  const m = svg.match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*"/);
  return m ? { largura: Number(m[1]), altura: Number(m[2]) } : null;
}

/** Pixel meio transparente vira cheio ou vazio: borda dura, sem borrão. */
export function endurecerBordas(dados: Uint8ClampedArray, corte = 40): void {
  for (let i = 3; i < dados.length; i += 4) dados[i] = dados[i] >= corte ? 255 : 0;
}

/* Efeitos por quadro em cima do desenho pronto (Pablo, 14/11/2026: "deixa mais animado
   tudo" e "se eu passar o cursor interage"). Mexem só nos pixels já pintados. */
const clarear = (d: Uint8ClampedArray, i: number, quanto: number) => {
  d[i] = Math.min(255, d[i] + quanto);
  d[i + 1] = Math.min(255, d[i + 1] + quanto);
  d[i + 2] = Math.min(255, d[i + 2] + quanto);
};

/** Onda de luz saindo do cursor (x, y em pixels do desenho; idade em ms). */
export function ondaDoCursor(d: Uint8ClampedArray, w: number, h: number, x: number, y: number, idade: number): void {
  const raio = (idade / 70) % 12;
  for (let py = Math.max(0, Math.floor(y - 13)); py < Math.min(h, y + 13); py++) {
    for (let px = Math.max(0, Math.floor(x - 13)); px < Math.min(w, x + 13); px++) {
      const i = (py * w + px) * 4;
      if (d[i + 3] === 0) continue;
      const dist = Math.hypot(px - x, py - y);
      if (dist < 2.5) clarear(d, i, 70);
      else if (Math.abs(dist - raio) < 1) clarear(d, i, 80);
    }
  }
}

/** Brilhos em cruz que mudam de lugar a cada segundo, em pixels já pintados. */
export function brilhos(d: Uint8ClampedArray, w: number, h: number, segundo: number, quantos = 3): void {
  let semente = (segundo * 2654435761) >>> 0;
  const sorte = () => { semente = (semente * 1664525 + 1013904223) >>> 0; return semente / 4294967296; };
  let achados = 0;
  for (let tentativa = 0; tentativa < 400 && achados < quantos; tentativa++) {
    const x = 1 + Math.floor(sorte() * (w - 2));
    const y = 1 + Math.floor(sorte() * (h - 2));
    if (d[(y * w + x) * 4 + 3] === 0) continue;
    achados++;
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const i = ((y + dy) * w + (x + dx)) * 4;
      d[i] = 255; d[i + 1] = 246; d[i + 2] = 200; d[i + 3] = 255;
    });
  }
}
