import { diaNoBrasil } from '@/lib/dia-brasil';
import { estagioDaPlanta, type EstagioDaPlanta } from '@/lib/jardim/artes';

export const DIAS_DO_CANTEIRO = 28;
/* Questões num dia para a planta florir. */
export const QUESTOES_PARA_FLORIR = 15;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

export type Canteiro = { data: string; questoes: number; estagio: EstagioDaPlanta }[];

/* Um canteiro por dia, do mais antigo até hoje (fuso de Brasília). */
export function canteiroDeEstudo(porDia: Record<string, { total: number }>, hoje: Date): Canteiro {
  return Array.from({ length: DIAS_DO_CANTEIRO }, (_, i) => {
    const chave = diaNoBrasil(new Date(hoje.getTime() - (DIAS_DO_CANTEIRO - 1 - i) * MS_POR_DIA));
    const questoes = porDia[chave]?.total ?? 0;
    return {
      data: `${chave.slice(8, 10)}/${chave.slice(5, 7)}`,
      questoes,
      estagio: estagioDaPlanta(questoes / QUESTOES_PARA_FLORIR),
    };
  });
}
