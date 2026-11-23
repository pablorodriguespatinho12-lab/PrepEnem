// "Revisão de hoje" (Pablo, 22/11/2026): os cartões que ele JÁ estudou e que venceram pelos
// intervalos de lib/flashcard-dominio.ts. Cartão que nunca foi visto não entra: isso é estudo
// novo, não revisão. Função pura: a busca no banco está em flashcards-revisao-servidor.ts.

export const MAX_REVISAO_POR_DIA = 20;

export interface CartaoDaRevisao {
  id: string;
  jaRespondido: boolean;
  naFilaHoje: boolean;
  precisaRevisar: boolean;
  /** "AAAA-MM-DD" da revisão marcada; null = errado agora, vence na hora. */
  proximaRevisao: string | null;
}

export const venceu = (c: CartaoDaRevisao): boolean => c.jaRespondido && c.naFilaHoje;

/** Errados primeiro, depois os mais atrasados; no máximo `max`. */
export function escolherRevisao<T extends CartaoDaRevisao>(cartoes: readonly T[], max = MAX_REVISAO_POR_DIA): T[] {
  return cartoes
    .filter(venceu)
    .map((c, i) => ({ c, i }))
    .sort((a, b) => {
      if (a.c.precisaRevisar !== b.c.precisaRevisar) return a.c.precisaRevisar ? -1 : 1;
      const da = a.c.proximaRevisao ?? '';
      const db = b.c.proximaRevisao ?? '';
      return da === db ? a.i - b.i : da < db ? -1 : 1;
    })
    .slice(0, max)
    .map(({ c }) => c);
}
