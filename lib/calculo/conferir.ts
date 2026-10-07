// Confere o gabarito que a IA marcou contra o resultado que a própria
// resolução dela chega. Motivo (teste com IA real, 05/10/2026): exercício
// "2x² − 8x + 6 = 0", resolução terminando em "x₁ = 3, x₂ = 1", e a opção
// marcada como certa era "2 e 1". O aluno acertaria e ouviria que errou.
//
// Regra: os números do RESULTADO são os que vêm logo depois de um "=" no fim
// de uma expressão (ex.: "= 3$", "= 1"). Uma opção bate se todos os números
// dela estão no resultado. Se só uma bate, ela é a certa. Se nenhuma ou
// várias batem, não há como confirmar: o exercício é descartado.

import type { Resposta } from './tipos';

const NUMERO = /-?\d+(?:[.,]\d+)?/g;

const normalizar = (n: string): string => String(Number(n.replace(',', '.')));

/* "(3,4)" é um ponto, não o decimal 3,4: par de inteiros entre parênteses
   vira "(3 ; 4)" antes de ler os números. */
function numeros(texto: string): string[] {
  const semPontos = texto.replace(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g, '($1 ; $2)');
  return (semPontos.match(NUMERO) ?? []).map(normalizar);
}

/* Números que fecham uma conta: "= 3$", "= -2,5", "=1," — e não "= 2x" ou "= \frac". */
export function resultadosDe(texto: string): Set<string> {
  const achados = Array.from(texto.matchAll(/=\s*(-?\d+(?:[.,]\d+)?)(?=\s*(?:\$|,|;|\.|$|\s+[^\s+\-*/^\\=]|\)))/g))
    .map((m) => normalizar(m[1]));
  return new Set(achados);
}

export type Conferencia = { resposta: Resposta } | null;

/* Todo ponto "(x, y)" citado na resolução tem de estar na reta do gabarito. */
function conferirPontosDaReta(reta: { a: number; b: number }, texto: string): boolean {
  const pontos = Array.from(texto.replace(/−/g, '-').matchAll(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g));
  return pontos.every((m) => Math.abs(reta.a * Number(m[1]) + reta.b - Number(m[2])) < 1e-9);
}
/* Devolve a resposta confirmada (talvez com a opção corrigida) ou null. */
export function conferirGabarito(resposta: Resposta, resolucaoFinal: string): Conferencia {
  const resultado = resultadosDe(resolucaoFinal);
  const universo = resultado.size > 0 ? resultado : new Set(numeros(resolucaoFinal));
  if (resposta.tipo === 'desenho') return conferirPontosDaReta(resposta.reta, resolucaoFinal) ? { resposta } : null;
  if (universo.size === 0) return { resposta };

  if (resposta.tipo === 'numero') {
    return universo.has(normalizar(String(resposta.valor))) ? { resposta } : null;
  }

  const batem = resposta.opcoes
    .map((op, i) => ({ i, nums: numeros(op) }))
    .filter(({ nums }) => nums.length > 0 && nums.every((n) => universo.has(n)) && nums.length <= universo.size)
    .map(({ i }) => i);
  // Não dá para conferir por conta quando quem decide é a palavra: opções sem
  // número ("para baixo") ou com os mesmos números ("Aumenta 2" × "Diminui 2",
  // "x > 0" × "x < 0"). Nesses casos o gabarito fica como veio.
  const assinaturas = resposta.opcoes.map((op) => Array.from(new Set(numeros(op))).sort().join('|'));
  const semNumero = assinaturas.some((a) => a === '');
  const repetidas = new Set(assinaturas).size < assinaturas.length;
  if (semNumero || repetidas) return { resposta };
  if (batem.length === 1) return { resposta: { ...resposta, correta: batem[0] } };
  if (batem.includes(resposta.correta) && batem.length > 1) {
    // Várias batem (ex.: "1 e 3" e "3 e 1"): só confia se a marcada é a única com o MESMO conjunto.
    const alvo = new Set(numeros(resposta.opcoes[resposta.correta]));
    const exatas = batem.filter((i) => {
      const s = new Set(numeros(resposta.opcoes[i]));
      return s.size === universo.size && Array.from(s).every((n) => universo.has(n)) && s.size === alvo.size;
    });
    return exatas.length === 1 && exatas[0] === resposta.correta ? { resposta } : null;
  }
  return null;
}
