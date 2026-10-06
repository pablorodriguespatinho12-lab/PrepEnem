// Flashcards do dia: depois do treino, até N cartões de cada matéria estudada
// hoje (Pablo, 06/10/2026: "10 de cada matéria que eu vou estudar no dia").
// Função pura: a rota busca os candidatos, aqui só se escolhe e ordena.

export interface CartaoCandidato {
  id: string;
  materia: string;
  subtema: string;
  /** false = dominado ou já respondido hoje (situacaoDoCartao). */
  naFilaHoje: boolean;
  precisaRevisar: boolean;
}

export interface MateriaDoDia {
  materia: string;
  /** Assuntos do cronograma de hoje; casam por trecho, sem diferenciar maiúscula. */
  subtemas: string[];
}

function prioridade(cartao: CartaoCandidato, subtemas: string[]): number {
  if (cartao.precisaRevisar) return 0;
  const assunto = cartao.subtema.toLowerCase();
  if (subtemas.some((s) => s && assunto.includes(s.toLowerCase()))) return 1;
  return 2;
}

export function escolherCartoesDoDia<T extends CartaoCandidato>(
  cartoes: readonly T[],
  materias: readonly MateriaDoDia[],
  porMateria: number,
): T[] {
  return materias.flatMap(({ materia, subtemas }) =>
    cartoes
      .filter((x) => x.materia === materia && x.naFilaHoje)
      .map((x, i) => ({ x, i, p: prioridade(x, subtemas) }))
      .sort((a, b) => a.p - b.p || a.i - b.i)
      .slice(0, porMateria)
      .map(({ x }) => x),
  );
}
