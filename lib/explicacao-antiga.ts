// As questões importadas trazem uma explicação antiga, longa e cheia de emoji
// ("📚 CONTEXTO", "✅ RESOLUÇÃO"). Ela fica atrás de "Ver texto completo" e,
// quando aparece, sem emoji (decisoes-prepenem: zero emoji).
const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;
export function limparExplicacaoAntiga(texto: string): string {
  return texto
    .split('\n')
    .map((linha) => linha.replace(EMOJI, '').replace(/^\s+/, ''))
    .join('\n')
    .trim();
}
