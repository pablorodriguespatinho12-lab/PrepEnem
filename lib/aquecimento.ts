import type { Etapa } from './treino-etapas';

/* Aquecimento antes da prova (Pablo, 04/11/2026: "como na piscina, primeiro
   aquecer o corpo para conseguir fazer uma coisa mais difícil"). Toda prova
   Médio, Difícil ou ENEM começa com questões mais fáceis das mesmas matérias,
   a mais, sem tirar nenhuma do nível pedido. Fácil não ganha aquecimento. */
const FRACAO_DO_AQUECIMENTO = 0.25;
const MINIMO_DO_AQUECIMENTO = 3;

const ETAPAS_DO_AQUECIMENTO: Record<string, Etapa[]> = {
  medio: ['facil'],
  dificil: ['facil', 'medio'],
  enem: ['facil', 'medio'],
  vestibular: ['facil', 'medio'],
};

export function etapasDoAquecimento(nivel: string): Etapa[] {
  return ETAPAS_DO_AQUECIMENTO[nivel] ?? [];
}

/* Quantas de aquecimento: 1 para cada 4 da prova, no mínimo 3. */
export function tamanhoDoAquecimento(nivel: string, totalQuestoes: number): number {
  if (etapasDoAquecimento(nivel).length === 0 || totalQuestoes <= 0) return 0;
  return Math.max(MINIMO_DO_AQUECIMENTO, Math.ceil(totalQuestoes * FRACAO_DO_AQUECIMENTO));
}

/* Escolhe o aquecimento entre as questões que sobraram, fácil antes de médio. */
export function montarAquecimento<T extends { id: string }>(
  nivel: string,
  totalQuestoes: number,
  sobras: T[],
  etapaDe: (q: T) => Etapa,
): T[] {
  const tamanho = tamanhoDoAquecimento(nivel, totalQuestoes);
  return etapasDoAquecimento(nivel)
    .flatMap((etapa) => sobras.filter((q) => etapaDe(q) === etapa))
    .slice(0, tamanho);
}
