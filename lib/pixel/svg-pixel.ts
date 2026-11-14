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
