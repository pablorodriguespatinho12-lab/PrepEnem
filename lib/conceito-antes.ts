// Conceito antes da questão. A Revisão de Conceitos cobre só os assuntos do
// cronograma do dia (até 4), mas o treino completa as 41 com outros da matéria:
// o Pablo caiu em "dois resistores em paralelo" sem nunca ter visto Ω nem
// eletricidade (15/10/2026). Na primeira questão de um assunto que a revisão
// não cobriu, o conceito dele aparece antes, no mesmo formato.

export interface Assunto { materia: string; subtema: string }

export const chaveAssunto = (materia: string, subtema: string): string =>
  `${materia.trim().toLowerCase()}::${subtema.trim().toLowerCase()}`;

type QuestaoComAssunto = { materia?: string | null; subtema?: string | null } | null | undefined;

export function assuntoSemConceito(
  questoes: readonly QuestaoComAssunto[],
  idx: number,
  cobertos: ReadonlySet<string>,
  vistos: ReadonlySet<string>,
): Assunto | null {
  const atual = questoes[idx];
  if (!atual?.materia || !atual.subtema?.trim()) return null;
  const chave = chaveAssunto(atual.materia, atual.subtema);
  if (cobertos.has(chave) || vistos.has(chave)) return null;
  const primeira = questoes.findIndex((x) => !!x?.materia && !!x.subtema && chaveAssunto(x.materia, x.subtema) === chave);
  return primeira === idx ? { materia: atual.materia, subtema: atual.subtema } : null;
}
