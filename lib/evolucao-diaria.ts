import { diaNoBrasil } from './dia-brasil';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

export type DiaDoGrafico = { data: string; acertos: number; erros: number };

/* Os N dias até hoje (fuso de Brasília), um por data, mesmo os sem resposta.
   Antes o gráfico só tinha os dias com resposta, igualmente espaçados: 9 dias
   de buraco pareciam 1. E a taxa de um dia com 1 questão virava "0%", contra
   a regra de dado esparso (decisoes-prepenem): aqui só contagem, sem %. */
export function diasDoGrafico(
  porDia: Record<string, { total: number; acertos: number }>,
  hoje: Date,
  n: number,
): DiaDoGrafico[] {
  return Array.from({ length: n }, (_, i) => {
    const chave = diaNoBrasil(new Date(hoje.getTime() - (n - 1 - i) * MS_POR_DIA));
    const dia = porDia[chave];
    const acertos = dia?.acertos ?? 0;
    return {
      data: `${chave.slice(8, 10)}/${chave.slice(5, 7)}`,
      acertos,
      erros: (dia?.total ?? 0) - acertos,
    };
  });
}
