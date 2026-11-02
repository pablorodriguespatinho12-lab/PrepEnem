/* Matérias que têm questão no banco: as que Criar prova e o Simulado
   oferecem. O Simulado listava as cores de matéria (Literatura, Livros,
   Redação) e a escolha não tinha questão (passeio do iniciante, 02/11/2026). */
export const MATERIAS_COM_QUESTOES = [
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'Português',
  'História',
  'Geografia',
  'Filosofia',
  'Sociologia',
  'Inglês',
] as const;

/* Nome que a prova ganha quando o aluno não escreve um: "Matemática e
   Física", "Matemática, Física e mais 2". Dar nome antes de tudo travava. */
export function nomeAutomatico(materias: readonly string[]): string {
  if (materias.length === 0) return 'Prova';
  if (materias.length === 1) return materias[0];
  if (materias.length === 2) return `${materias[0]} e ${materias[1]}`;
  return `${materias[0]}, ${materias[1]} e mais ${materias.length - 2}`;
}
