// A redação de quem nunca escreveu uma (aluno-do-zero, 29/10/2026): sem autor,
// com erro de concordância e proposta vaga. Usada no e2e do passo 8 e para
// gerar a correção de verdade que o e2e devolve (correcao-leigo.json).

import { montarRedacao, moldeTese } from '@/lib/redacao/receita';

export const TEMA_LEIGO = 'O estigma associado às doenças mentais na sociedade brasileira';
export const PARAGRAFOS_LEIGO = {
  introducao: 'Hoje em dia muita gente tem preconceito com quem tem doença mental, e isso é muito ruim para essas pessoas que sofrem.',
  desenvolvimento1: 'Em primeiro lugar, muitas pessoas não conseguem pagar psicólogo, porque é muito caro e elas ganham pouco. Por isso elas ficam sem tratamento e a doença piora com o tempo, e elas não conseguem trabalhar nem estudar direito.',
  desenvolvimento2: 'Além disso as pessoas tem vergonha de falar que estão doentes, porque os outros chamam de louco. Então elas ficam caladas e ninguém ajuda, e o governo também não faz nada para mudar isso no Brasil.',
  conclusao: 'Portanto, o governo deve ajudar as pessoas com doença mental, fazendo campanhas na televisão. Assim o preconceito vai diminuir e as pessoas vão poder se tratar melhor.',
};
export const TESE_LEIGO = moldeTese('estigma', 'estado', TEMA_LEIGO);
export const REDACAO_LEIGO = montarRedacao(PARAGRAFOS_LEIGO, TESE_LEIGO);
