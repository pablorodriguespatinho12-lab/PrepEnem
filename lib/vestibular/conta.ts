// Quebra a conta de um passo em linhas curtas para caber no celular: cada
// "⇒" começa linha nova, e fatos separados por \quad/\qquad viram linhas
// próprias. A tela escreve uma linha depois da outra.
export function quebrarConta(fonte: string): string[] {
  return fonte
    .split(/,?\s*\\q?quad\s*/)
    .flatMap((fato) => fato.split(/\s*(?:\\ )?\\Rightarrow(?:\\ )?\s*/).map((parte, i) => (i === 0 ? parte : `\\Rightarrow\\ ${parte}`)))
    .map((linha) => linha.trim())
    .filter(Boolean)
    .flatMap(quebrarIgualdades);
}
/* Linha comprida demais quebra antes de cada "=" de fora das chaves. */
const LINHA_LONGA = 44;
function quebrarIgualdades(linha: string): string[] {
  if (linha.length <= LINHA_LONGA) return [linha];
  const partes: string[] = [];
  let profundidade = 0, inicio = 0;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (c === '{') profundidade++;
    else if (c === '}') profundidade--;
    else if (c === '=' && profundidade === 0 && i > inicio) {
      partes.push(linha.slice(inicio, i).trim());
      inicio = i;
    }
  }
  partes.push(linha.slice(inicio).trim());
  return partes.filter(Boolean);
}
