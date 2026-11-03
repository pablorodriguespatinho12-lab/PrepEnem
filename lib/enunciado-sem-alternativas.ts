// Questões reais importadas do PDF trazem as 5 alternativas coladas no fim do
// enunciado ("...teve como objetivo a\nA unificação...\nB aproximação...").
// Na tela elas apareciam duas vezes: no texto e nos botões (Pablo, 03/11/2026).
// Corta o bloco final só quando as 5 alternativas estão lá, em ordem, de A a E.

const normalizar = (s: string): string =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const TRECHO_MINIMO = 6;

export function cortarAlternativasRepetidas(enunciado: string, alternativas: string[]): string {
  if (alternativas.length !== 5) return enunciado;
  const linhas = enunciado.split('\n');
  // Procura, de trás para frente, a linha onde começa a alternativa A.
  for (let inicio = linhas.length - 1; inicio >= 0; inicio--) {
    if (!/^\s*\(?A\)?[\s).:-]/.test(linhas[inicio])) continue;
    const bloco = normalizar(linhas.slice(inicio).join(' '));
    let pos = 0;
    let ok = true;
    for (const [i, alt] of alternativas.entries()) {
      const letra = 'abcde'[i];
      const trecho = normalizar(alt).slice(0, 24);
      if (trecho.length < TRECHO_MINIMO) { ok = false; break; }
      const achou = bloco.indexOf(letra + trecho, pos);
      const achouSemLetra = achou < 0 ? bloco.indexOf(trecho, pos) : -1;
      const onde = achou >= 0 ? achou : achouSemLetra;
      if (onde < 0) { ok = false; break; }
      pos = onde + trecho.length;
    }
    if (!ok) return enunciado;
    // O que sobra depois da E não pode ser texto novo (no máximo o fim da própria E).
    const fimE = normalizar(alternativas[4]);
    if (bloco.length - pos > fimE.length + 4) return enunciado;
    return linhas.slice(0, inicio).join('\n').trimEnd();
  }
  return enunciado;
}
