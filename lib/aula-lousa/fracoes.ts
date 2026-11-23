// Fração em pé na lousa (Pablo, 22/11/2026: "coloca a equação em pé, mesmo somando ou só
// multiplicando em partes, em todos os quadros"). A lousa guarda texto ("4/5 × 3/4 = 12/20");
// na hora de mostrar, cada a/b vira cima, traço, baixo. Vale para as lousas já gravadas.

export type Pedaco = string | { cima: string; baixo: string };

/** Número (com espaço de milhar: "50 000") ou a letra x, de cada lado da barra. Não pega "km/h". */
const NUM = String.raw`(?:\d+(?: \d{3})*(?:,\d+)?|x)`;
/** Em cima da barra: número, soma entre parênteses "(4+3+2)" ou raiz com letra opcional "L√3". Embaixo: número. */
const CIMA = String.raw`(?:${NUM}|\([^()\n]{1,24}\)|[A-Za-z]?√\d+)`;
const FRACAO = new RegExp(String.raw`(?<![\w/√.])(${CIMA})/(${NUM})(?![\w/√])`, 'g');

/** "3/5 × 5/x = 1/2" → [{3,5}, " × ", {5,x}, " = ", {1,2}]. Texto sem fração volta como um pedaço só. */
export function partirEmFracoes(s: string): Pedaco[] {
  const saida: Pedaco[] = [];
  let ultimo = 0;
  for (const m of s.matchAll(FRACAO)) {
    const inicio = m.index ?? 0;
    if (inicio > ultimo) saida.push(s.slice(ultimo, inicio));
    saida.push({ cima: m[1], baixo: m[2] });
    ultimo = inicio + m[0].length;
  }
  if (ultimo < s.length) saida.push(s.slice(ultimo));
  return saida.length > 0 ? saida : [s];
}

const temPedacoDeFracao = (s: string): boolean => partirEmFracoes(s).some((p) => typeof p !== 'string');
const SO_UMA_FRACAO_E_UNIDADE = new RegExp(String.raw`^\s*${NUM}/${NUM}\s*\S{0,3}\s*$`);

/** Só EQUAÇÃO vira fração em pé: tem "=" ou é uma fração sozinha ("2/3 h"). Frase ("ler 9/10 como 9 ou 10") fica em texto. */
export const temFracao = (s: string): boolean => temPedacoDeFracao(s) && (s.includes('=') || SO_UMA_FRACAO_E_UNIDADE.test(s));
