// Conta em LaTeX vira SVG com cada letra como um traço (<path>), para a caneta
// do app desenhar letra por letra (components/visual/caneta.tsx). Roda no
// servidor: o MathJax pesa ~2 MB e não precisa ir para o navegador.
// Só base, ams, color e cancel: \href, \html e afins ficam de fora, porque a
// conta pode vir da IA. \novo{...} pinta o termo que acabou de entrar e
// \corta{...} risca de vermelho o que cancela (o quadro do Universo Narrado):
// as cores saem com um código e viram as cores do tema logo abaixo.
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/color/ColorConfiguration.js';
import 'mathjax-full/js/input/tex/cancel/CancelConfiguration.js';
import 'mathjax-full/js/input/tex/configmacros/ConfigMacrosConfiguration.js';

const adaptador = liteAdaptor();
RegisterHTMLHandler(adaptador);
const documento = mathjax.document('', {
  InputJax: new TeX({
    packages: ['base', 'ams', 'color', 'cancel', 'configmacros'],
    macros: {
      // RGB e não #hex: o # dentro da macro é lido como parâmetro.
      novo: ['{\\color[RGB]{10,10,1}{#1}}', 1],
      corta: ['{\\color[RGB]{10,10,2}{\\cancel{\\color[RGB]{10,10,3}{#1}}}}', 1],
    },
  }),
  OutputJax: new SVG({ fontCache: 'none' }),
});

const CORES: [RegExp, string][] = [
  [/#0A0A01/gi, 'hsl(var(--chart-2))'],
  [/#0A0A02/gi, 'hsl(var(--danger))'],
  [/#0A0A03/gi, 'currentColor'],
];
const pintar = (svg: string) => CORES.reduce((s, [codigo, cor]) => s.replace(codigo, cor), svg);
const MAX_CACHE = 500;
const cache = new Map<string, string>();

export const MAX_LINHAS = 12;
export const MAX_TAMANHO = 300;

/* O MathJax escreve o erro de LaTeX dentro do próprio SVG (data-mjx-error);
   aí devolve null e a tela cai no KaTeX, que mostra o texto cru. */
export function texParaSvg(tex: string): string | null {
  const guardado = cache.get(tex);
  if (guardado !== undefined) return guardado;
  let svg: string | null;
  try {
    const no = documento.convert(tex, { display: false });
    const html = adaptador.innerHTML(no);
    svg = html.includes('data-mjx-error') || html.includes('merror') ? null : pintar(html);
  } catch {
    svg = null;
  }
  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value as string);
  if (svg) cache.set(tex, svg);
  return svg;
}
