// Baralhos que estudam na ordem gravada, sem embaralhar (Pablo, 07/11/2026:
// "primeiro as falas, depois o que eles querem dizer, depois os quartetos").
// Os outros baralhos continuam embaralhados.
const BARALHOS_EM_ORDEM = new Set(['Meus quartetos da redação']);

interface CartaoComOrdem {
  ordem: number;
}

export function deveManterOrdem(nomeDoBaralho: string): boolean {
  return BARALHOS_EM_ORDEM.has(nomeDoBaralho);
}

/* Devolve uma cópia: na ordem gravada ou embaralhada. */
export function ordenarParaEstudo<T extends CartaoComOrdem>(cartoes: readonly T[], nomeDoBaralho: string): T[] {
  if (deveManterOrdem(nomeDoBaralho)) return [...cartoes].sort((a, b) => a.ordem - b.ordem);
  return [...cartoes].sort(() => Math.random() - 0.5);
}
