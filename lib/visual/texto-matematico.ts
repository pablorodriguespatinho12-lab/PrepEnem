// Texto com LaTeX e um markdown mínimo → HTML seguro. O texto vem de questões
// importadas, da IA e (indiretamente, pela conversa) do próprio aluno: tudo
// fora das fórmulas é escapado ANTES de virar HTML, e o KaTeX roda sem `trust`
// (com trust, \href{javascript:...} viraria link executável).

import katex from 'katex';

/* "R$" é dinheiro, nunca abre fórmula: "R$ 5 ... R$ 2" virava LaTeX (06/10/2026). */
const DELIMITADORES = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|(?<![$R])\$(?!\$)([^$\n]+?)\$|\\\((.+?)\\\)/g;

const CORES_TERMO: Record<string, string> = {
  a: 'hsl(var(--chart-1))',
  b: 'hsl(var(--chart-2))',
  c: 'hsl(var(--chart-3))',
  erro: 'hsl(var(--danger))',
};

function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Letra grega escrita sem a barra ("$Delta = 0$") vem da IA quando o JSON
   perde o "\D" no caminho. Dentro de fórmula, o nome solto vira o símbolo. */
const GREGAS = /(?<![\\a-zA-Z])(Delta|delta|alpha|beta|gamma|Gamma|theta|lambda|mu|pi|sigma|Sigma|omega|Omega|rho|phi|epsilon)(?![a-zA-Z])/g;

function formula(latex: string, display: boolean): string {
  // "0,2" virava "0, 2": para o KaTeX, vírgula é pontuação e ganha espaço.
  // Entre dois algarismos, é vírgula decimal (padrão brasileiro).
  const corrigido = latex.trim().replace(GREGAS, '\\$1').replace(/(\d),(?=\d)/g, '$1{,}');
  return katex.renderToString(corrigido, { displayMode: display, throwOnError: false, trust: false, strict: 'ignore' });
}

/* Markdown mínimo, aplicado sobre texto JÁ escapado. */
function marcarTexto(escapado: string): string {
  return escapado
    .replace(/\[\[(a|b|c|erro):([^\]]+?)\]\]/g, (_m, c: string, termo: string) =>
      `<strong style="color:${CORES_TERMO[c]}">${termo}</strong>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<div class="type-lead font-display font-semibold mt-5 mb-2">$1</div>')
    .replace(/^## (.+)$/gm, '<div class="type-title font-display font-semibold mt-5 mb-2">$1</div>')
    .replace(/^[-*] (.+)$/gm, '<div class="ml-4 flex gap-2"><span>•</span><span>$1</span></div>')
    .replace(/\n/g, '<br/>');
}

export function renderizarTextoMatematico(texto: string): string {
  if (!texto) return '';
  let saida = '';
  let ultimo = 0;
  for (const m of texto.matchAll(DELIMITADORES)) {
    saida += marcarTexto(escapar(texto.slice(ultimo, m.index)));
    const [, display1, display2, inline1, inline2] = m;
    saida += formula(display1 ?? display2 ?? inline1 ?? inline2 ?? '', display1 !== undefined || display2 !== undefined);
    ultimo = (m.index ?? 0) + m[0].length;
  }
  return saida + marcarTexto(escapar(texto.slice(ultimo)));
}
