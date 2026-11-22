// Quando um flashcard volta para a fila. Treino até critério com espaçamento
// (Knouse et al. 2020; docs/pesquisa-tdah-estudo.md): acertou hoje, volta amanhã; errou, zera.
// "Dominado" (3 acertos em dias diferentes) só muda o rótulo: o cartão NÃO some para sempre.
// Pablo, 22/11/2026: "um sistema de revisão para relembrar das fórmulas". Antes, o cartão
// dominado nunca mais voltava e o esquecimento passava despercebido. Agora cada acerto em
// dia novo empurra a próxima revisão: 1, 3, 7, 21 e 45 dias (intervalos crescentes).
// Os intervalos são escolha de projeto (família Leitner/SM-2), não número medido neste app.

import { diaNoBrasil } from '@/lib/dia-brasil';

export const ACERTOS_PARA_DOMINAR = 3;
/** Dias até a próxima revisão depois de 1, 2, 3, 4 e 5 ou mais acertos em dias diferentes. */
export const INTERVALOS_EM_DIAS = [1, 3, 7, 21, 45] as const;

const MS_POR_DIA = 24 * 60 * 60 * 1000;

export interface RespostaCartao { acertou: boolean; dataResposta: Date }

export interface SituacaoCartao {
  /* Dias diferentes com acerto desde o último erro (0 a ACERTOS_PARA_DOMINAR). */
  acertosSeguidos: number;
  dominado: boolean;
  naFilaHoje: boolean;
  /* "AAAA-MM-DD" (Brasília) da próxima revisão; null se o cartão está na fila agora sem acerto. */
  proximaRevisao: string | null;
}

/* "AAAA-MM-DD" mais `dias` dias de calendário. */
export function somaDias(dia: string, dias: number): string {
  return new Date(Date.parse(`${dia}T00:00:00Z`) + dias * MS_POR_DIA).toISOString().slice(0, 10);
}

export function intervaloDepoisDe(acertosEmDiasDiferentes: number): number {
  const i = Math.min(Math.max(acertosEmDiasDiferentes, 1), INTERVALOS_EM_DIAS.length) - 1;
  return INTERVALOS_EM_DIAS[i];
}

export function situacaoDoCartao(respostas: readonly RespostaCartao[], agora: Date): SituacaoCartao {
  const recentes = [...respostas].sort((a, b) => b.dataResposta.getTime() - a.dataResposta.getTime());
  const fimDaSequencia = recentes.findIndex((r) => !r.acertou);
  const acertos = fimDaSequencia === -1 ? recentes : recentes.slice(0, fimDaSequencia);
  const dias = new Set(acertos.map((r) => diaNoBrasil(r.dataResposta)));
  const acertosSeguidos = Math.min(dias.size, ACERTOS_PARA_DOMINAR);
  const dominado = acertosSeguidos >= ACERTOS_PARA_DOMINAR;
  if (dias.size === 0) return { acertosSeguidos, dominado, naFilaHoje: true, proximaRevisao: null };

  const ultimoAcerto = [...dias].sort().at(-1)!;
  const proximaRevisao = somaDias(ultimoAcerto, intervaloDepoisDe(dias.size));
  return { acertosSeguidos, dominado, naFilaHoje: diaNoBrasil(agora) >= proximaRevisao, proximaRevisao };
}
