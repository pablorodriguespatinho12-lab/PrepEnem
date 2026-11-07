// Baralhos que estudam inteiros e na ordem gravada, sem embaralhar (Pablo,
// 07/11/2026: a escadinha de redação, falas → sentidos → posições → temas).
// Os outros baralhos continuam embaralhados e pela fila do dia.
import { baralhosDosTrios } from '../redacao/cartoes-trios';

const BARALHOS_EM_ORDEM = new Set(baralhosDosTrios().map((b) => b.nome));

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
