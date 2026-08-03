// Similaridade textual local (cosine sobre bag-of-words), sem chamada de API
// externa. Usada pra deduplicar flashcards gerados por IA contra os cards já
// existentes no deck — evita repetir conceito quando o usuário pede "mais N
// sobre X" e já existem cards daquele tema.

const STOPWORDS = new Set([
  'a', 'o', 'os', 'as', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
  'um', 'uma', 'uns', 'umas', 'e', 'ou', 'que', 'qual', 'quais', 'como', 'para', 'por',
  'com', 'sem', 'se', 'ao', 'aos', 'à', 'às', 'é', 'são', 'foi', 'ser', 'estar',
]);

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ');
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function termFrequency(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return freq;
}

/** Similaridade de cosseno entre dois textos, 0 (nada em comum) a 1 (idêntico em vocabulário). */
export function textSimilarity(a: string, b: string): number {
  const freqA = termFrequency(tokenize(a));
  const freqB = termFrequency(tokenize(b));
  if (freqA.size === 0 || freqB.size === 0) return 0;

  let dot = 0;
  for (const [term, countA] of freqA) {
    const countB = freqB.get(term);
    if (countB) dot += countA * countB;
  }

  const magA = Math.sqrt([...freqA.values()].reduce((s, c) => s + c * c, 0));
  const magB = Math.sqrt([...freqB.values()].reduce((s, c) => s + c * c, 0));
  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}

/** Maior similaridade de `text` contra qualquer item de `others`. */
export function maxSimilarity(text: string, others: string[]): number {
  let max = 0;
  for (const other of others) {
    const sim = textSimilarity(text, other);
    if (sim > max) max = sim;
    if (max >= 1) break;
  }
  return max;
}
