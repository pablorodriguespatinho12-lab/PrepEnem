// Última trava do quadro: uma igualdade só de números que não fecha ("96,96 = 210") é sobra de
// frase cortada, e não pode aparecer na lousa. Conta com letra ou unidade não é julgada.

const FOLGA = 0.011; // arredondamentos da aula ("≈ 15,8")

/** Resolve + − · × ÷ / ², ³ e parênteses; null se houver qualquer outra coisa. */
function resolver(expressao: string): number | null {
  const pecas = expressao.match(/\d+(?:\.\d+)?|[+−\-·×÷/()²³]/g) ?? [];
  if (pecas.join('') !== expressao.replace(/\s/g, '')) return null;
  let i = 0;
  const fator = (): number => {
    const t = pecas[i++];
    let v: number;
    if (t === '(') {
      v = soma();
      i++;
    } else if (t === '−' || t === '-') return -fator();
    else v = Number(t);
    while (pecas[i] === '²' || pecas[i] === '³') v **= pecas[i++] === '²' ? 2 : 3;
    return v;
  };
  const produto = (): number => {
    let v = fator();
    while (['·', '×', '÷', '/'].includes(pecas[i])) {
      const op = pecas[i++];
      v = op === '·' || op === '×' ? v * fator() : v / fator();
    }
    return v;
  };
  const soma = (): number => {
    let v = produto();
    while (['+', '−', '-'].includes(pecas[i])) {
      const op = pecas[i++];
      v = op === '+' ? v + produto() : v - produto();
    }
    return v;
  };
  const v = soma();
  return i === pecas.length && Number.isFinite(v) ? v : null;
}

function fecha(lados: string[], porcento: string): boolean {
  const valores = lados.map((l) => resolver(l.replace(/(\d+(?:\.\d+)?)%/g, porcento)));
  if (valores.some((v) => v === null)) return true;
  const [primeiro, ...resto] = valores as number[];
  return resto.every((v) => Math.abs(primeiro - v) <= Math.max(FOLGA * Math.abs(primeiro), FOLGA));
}

/** Falso só quando todos os lados são números e não dão o mesmo valor. Peça "a|b" é fração. */
export function contaVerdadeira(pecas: string[]): boolean {
  const linha = pecas
    .map((p) => (p.includes('|') ? `((${p.split('|')[0]})/(${p.split('|')[1]}))` : p))
    .join(' ')
    .replace(/(\d)[  ](?=\d{3}(?!\d))/g, '$1')
    .replace(/(\d)\.(?=\d{3}(?!\d))/g, '$1')
    .replace(/,/g, '.');
  const lados = linha.split('=').map((l) => l.trim());
  // "50% de cada 100" aparece dos dois jeitos: 0,5 = 50% e 0,5 × 100 = 50%.
  return lados.length < 2 || fecha(lados, '($1/100)') || fecha(lados, '$1');
}
