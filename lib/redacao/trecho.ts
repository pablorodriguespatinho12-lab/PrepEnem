// Conferências que o CÓDIGO faz no texto do aluno, sem confiar na IA: se o
// trecho citado existe mesmo na redação e quais conectivos se repetem.

/* Minúsculas, sem acento, sem pontuação e com um espaço só: a IA copia o
   trecho trocando aspas, vírgula ou maiúscula, e isso não é inventar. */
export function normalizar(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/* Pedaço com menos que isso não prova nada ("o", "e a"). */
const MINIMO_CARACTERES = 4;

/* A IA erra uma letra ao copiar ("Estima" por "Estigma", medido no golden
   set em 27/10/2026) e isso recusava a correção inteira. Pedaço de 5 palavras
   ou mais vale com 85% delas iguais, na mesma posição; menor tem que ser exato. */
const PALAVRAS_PARA_TOLERAR = 5;
const PROPORCAO_IGUAL = 0.85;

/* Posição (em palavras) logo depois do pedaço no texto, ou -1. */
function acharPedaco(pedaco: string[], alvo: string[], desde: number): number {
  const n = pedaco.length;
  const minimo = n >= PALAVRAS_PARA_TOLERAR ? Math.ceil(n * PROPORCAO_IGUAL) : n;
  for (let i = desde; i + n <= alvo.length; i++) {
    let iguais = 0;
    for (let j = 0; j < n; j++) if (alvo[i + j] === pedaco[j]) iguais++;
    if (iguais >= minimo) return i + n;
  }
  return -1;
}

/* O trecho existe na redação? Reticências ("começo ... fim") valem: cada
   pedaço tem que estar no texto, na ordem. */
export function trechoExiste(trecho: string | null | undefined, texto: string): boolean {
  if (!trecho) return false;
  const pedacos = trecho.split(/\.{3}|…/).map(normalizar).filter(Boolean);
  if (pedacos.length === 0 || pedacos.every((p) => p.length < MINIMO_CARACTERES)) return false;
  const alvo = normalizar(texto).split(' ');
  let desde = 0;
  for (const p of pedacos) {
    desde = acharPedaco(p.split(' '), alvo, desde);
    if (desde < 0) return false;
  }
  return true;
}

const CONECTIVOS = [
  'alem disso', 'nesse sentido', 'nessa perspectiva', 'sob essa otica', 'diante disso', 'portanto', 'dessa forma',
  'desse modo', 'assim', 'logo', 'ademais', 'outrossim', 'em primeiro lugar', 'em segundo lugar', 'por conseguinte',
  'no entanto', 'entretanto', 'contudo', 'todavia', 'por fim', 'em suma', 'com efeito', 'consequentemente', 'ou seja',
];
const REPETICOES_NO_TEXTO = 3;
const ABERTURAS_DE_PARAGRAFO = 2;

/* Conectivos usados demais: 3 vezes ou mais no texto, ou abrindo 2 parágrafos. */
export function conectivosRepetidos(texto: string): string[] {
  const corpo = ` ${normalizar(texto)} `;
  const aberturas = texto.split(/\n+/).map(normalizar).filter(Boolean);
  return CONECTIVOS.filter((c) => {
    const vezes = corpo.split(` ${c} `).length - 1;
    const abre = aberturas.filter((p) => p.startsWith(`${c} `)).length;
    return vezes >= REPETICOES_NO_TEXTO || abre >= ABERTURAS_DE_PARAGRAFO;
  });
}

/* Ação que só pede consciência ("conscientizar a população") precisa de meio. */
export const ACAO_SO_CONSCIENCIA = /conscientiz|sensibiliz|alertar/i;
