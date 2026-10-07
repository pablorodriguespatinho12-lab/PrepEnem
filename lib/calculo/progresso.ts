// Progresso na trilha: o que está aberto, quando um degrau conta como
// concluído e quando ele volta para revisão. Revisão espaçada com intervalos
// crescentes (Cepeda et al. 2008; Dunlosky et al. 2013); errou, volta cedo.

import type { Degrau } from './tipos';

export const INTERVALOS_REVISAO_DIAS = [2, 7, 21, 60];
const DIA_MS = 24 * 60 * 60 * 1000;

export interface EstadoDegrau {
  licaoId: string;
  status: 'em_andamento' | 'concluida';
  acertos: number;
  tentativas: number;
  revisoes: number;
  proximaRevisao: Date | null;
}

/* Sem tranca (Pablo, 07/10/2026: "deixa eu pular, toda hora volto do início"):
   toda lição abre desde o começo; os pré-requisitos só ordenam a trilha. */
export type Situacao = 'disponivel' | 'em_andamento' | 'concluida';

export function situacao(degrau: Degrau, estados: Map<string, EstadoDegrau>): Situacao {
  const e = estados.get(degrau.id);
  if (e?.status === 'concluida') return 'concluida';
  return e ? 'em_andamento' : 'disponivel';
}

export function proximoDegrau(trilha: Degrau[], estados: Map<string, EstadoDegrau>): Degrau | null {
  return trilha.find((d) => {
    const s = situacao(d, estados);
    return s === 'em_andamento' || s === 'disponivel';
  }) ?? null;
}

/* Resultado dos exercícios de uma lição. Terminar conclui, com qualquer
   número de acertos (a meta de 70% saiu em 07/10/2026, pedido do Pablo); ao
   concluir pela primeira vez, agenda a primeira revisão. Refazer não "desconclui". */
export function registrarLicao(atual: EstadoDegrau | undefined, licaoId: string, acertos: number, total: number, agora: Date): EstadoDegrau {
  const base: EstadoDegrau = atual ?? { licaoId, status: 'em_andamento', acertos: 0, tentativas: 0, revisoes: 0, proximaRevisao: null };
  const passou = total > 0;
  const concluiAgora = passou && base.status !== 'concluida';
  return {
    ...base,
    acertos: base.acertos + acertos,
    tentativas: base.tentativas + total,
    status: passou || base.status === 'concluida' ? 'concluida' : 'em_andamento',
    proximaRevisao: concluiAgora ? new Date(agora.getTime() + INTERVALOS_REVISAO_DIAS[0] * DIA_MS) : base.proximaRevisao,
  };
}

/* Uma questão de revisão: acertou, o intervalo cresce; errou, volta amanhã. */
export function registrarRevisao(atual: EstadoDegrau, acertou: boolean, agora: Date): EstadoDegrau {
  const revisoes = acertou ? atual.revisoes + 1 : 0;
  const dias = acertou
    ? INTERVALOS_REVISAO_DIAS[Math.min(revisoes, INTERVALOS_REVISAO_DIAS.length - 1)]
    : 1;
  return {
    ...atual,
    revisoes,
    acertos: atual.acertos + (acertou ? 1 : 0),
    tentativas: atual.tentativas + 1,
    proximaRevisao: new Date(agora.getTime() + dias * DIA_MS),
  };
}

export function revisoesPendentes(estados: EstadoDegrau[], agora: Date): string[] {
  return estados
    .filter((e) => e.status === 'concluida' && e.proximaRevisao && e.proximaRevisao.getTime() <= agora.getTime())
    .sort((a, b) => (a.proximaRevisao!.getTime() - b.proximaRevisao!.getTime()))
    .map((e) => e.licaoId);
}
