import { semPalavraChula } from '@/lib/tutor/validar';
// Cartões que a IA gera para um baralho. Informação mínima (SuperMemo,
// decisoes-prepenem): verso longo é enumeração disfarçada e sai.

export interface CartaoGerado { frente: string; verso: string; dica: string | null }

const MAX_FRENTE = 300;
const MAX_VERSO = 200;
const MAX_DICA = 200;

const texto = (v: unknown): string => (typeof v === 'string' ? semPalavraChula(v.trim()) : '');

/* Nenhum cartão aproveitável = null (a pedirJson tenta de novo). */
export function validarCartoesGerados(bruto: unknown): CartaoGerado[] | null {
  const lista = Array.isArray((bruto as { cards?: unknown })?.cards) ? (bruto as { cards: unknown[] }).cards : [];
  const cartoes = lista
    .map((c) => (c && typeof c === 'object' ? (c as Record<string, unknown>) : {}))
    .map((c) => ({ frente: texto(c.frente), verso: texto(c.verso), dica: texto(c.dica).slice(0, MAX_DICA) || null }))
    .filter((c) => c.frente && c.verso && c.frente.length <= MAX_FRENTE && c.verso.length <= MAX_VERSO);
  return cartoes.length > 0 ? cartoes : null;
}
