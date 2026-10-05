// Validação do que o navegador manda para as rotas do tutor.

import type { MensagemTutor, QuestaoParaTutor } from './prompts';

const MAX_MENSAGEM = 1200;
const MAX_HISTORICO = 30;

const texto = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim().length > 0 ? v.trim().slice(0, max) : null;

export function lerQuestao(bruto: unknown): QuestaoParaTutor | null {
  const b = (bruto && typeof bruto === 'object' ? bruto : {}) as Record<string, unknown>;
  const alt = (b.alternativas && typeof b.alternativas === 'object' ? b.alternativas : {}) as Record<string, unknown>;
  const enunciado = texto(b.enunciado, 6000);
  const respostaCorreta = texto(b.respostaCorreta, 1)?.toUpperCase();
  if (!enunciado || !respostaCorreta || !'ABCDE'.includes(respostaCorreta)) return null;
  const dada = texto(b.respostaDada, 1)?.toUpperCase();
  return {
    enunciado,
    alternativas: {
      A: texto(alt.A, 800) ?? '', B: texto(alt.B, 800) ?? '', C: texto(alt.C, 800) ?? '',
      D: texto(alt.D, 800) ?? '', E: texto(alt.E, 800) ?? '',
    },
    respostaCorreta,
    respostaDada: dada && 'ABCDE'.includes(dada) ? dada : null,
    materia: texto(b.materia, 40) ?? 'Geral',
    subtema: texto(b.subtema, 120),
  };
}

export function lerHistorico(bruto: unknown): MensagemTutor[] {
  if (!Array.isArray(bruto)) return [];
  return bruto
    .map((m) => (m && typeof m === 'object' ? (m as Record<string, unknown>) : {}))
    .filter((m) => m.papel === 'aluno' || m.papel === 'tutor')
    .map((m) => ({ papel: m.papel as MensagemTutor['papel'], texto: texto(m.texto, MAX_MENSAGEM) ?? '' }))
    .filter((m) => m.texto.length > 0)
    .slice(-MAX_HISTORICO);
}
