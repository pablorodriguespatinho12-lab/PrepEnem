// Quando um flashcard sai da fila. Antes, um acerto só bastava para o cartão
// sumir para sempre. Agora vale treino até critério com espaçamento
// (Knouse et al. 2020; docs/pesquisa-tdah-estudo.md): 3 acertos seguidos,
// cada um num dia diferente. Acertou hoje, volta amanhã; errou, zera.

import { diaNoBrasil } from '@/lib/dia-brasil';

export const ACERTOS_PARA_DOMINAR = 3;

export interface RespostaCartao { acertou: boolean; dataResposta: Date }

export interface SituacaoCartao {
  /* Dias diferentes com acerto desde o último erro (0 a ACERTOS_PARA_DOMINAR). */
  acertosSeguidos: number;
  dominado: boolean;
  naFilaHoje: boolean;
}

export function situacaoDoCartao(respostas: readonly RespostaCartao[], agora: Date): SituacaoCartao {
  const recentes = [...respostas].sort((a, b) => b.dataResposta.getTime() - a.dataResposta.getTime());
  const fimDaSequencia = recentes.findIndex((r) => !r.acertou);
  const acertos = fimDaSequencia === -1 ? recentes : recentes.slice(0, fimDaSequencia);
  const dias = new Set(acertos.map((r) => diaNoBrasil(r.dataResposta)));
  const acertosSeguidos = Math.min(dias.size, ACERTOS_PARA_DOMINAR);
  const dominado = acertosSeguidos >= ACERTOS_PARA_DOMINAR;
  const respondeuCertoHoje = dias.has(diaNoBrasil(agora));
  return { acertosSeguidos, dominado, naFilaHoje: !dominado && !respondeuCertoHoje };
}
