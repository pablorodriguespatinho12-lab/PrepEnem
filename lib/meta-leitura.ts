import { diasEntre } from './dia-brasil';
export type PlanoDeLeitura = { inicio: string; paginasIniciais: number; teto: number };
/* Plano do Pablo (21/10/2026): começa com poucas páginas e soma 1 por dia até
   o teto. Dia contado no fuso de Brasília. */
export function metaDePaginas(plano: PlanoDeLeitura, hoje: Date): number {
  const dias = Math.max(0, diasEntre(new Date(`${plano.inicio}T12:00:00-03:00`), hoje));
  return Math.min(plano.teto, plano.paginasIniciais + dias);
}
