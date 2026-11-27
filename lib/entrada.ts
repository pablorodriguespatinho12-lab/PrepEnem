/* O que vem do navegador não é confiável. Um id que chega como objeto
   ({ not: '' }) ou que não chega muda o filtro do Prisma e alcança outras
   linhas, até de outro aluno (QA de 27/11/2026: E1, E10, C1, C2, C3). */
export const ehId = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Letra do gabarito (A a E) ou null. Nunca inventa uma resposta. */
export function letraDoGabarito(v: unknown): string | null {
  const letra = typeof v === 'string' ? v.toUpperCase().trim() : '';
  return /^[A-E]$/.test(letra) ? letra : null;
}
