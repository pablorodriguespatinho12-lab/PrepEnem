/* Prova nova sem repetir o que o aluno já fez (Pablo, 06/11/2026: "tenho medo
   de criar uma prova e repetir as mesmas questões"). As já respondidas em
   provas anteriores vão para o fim da fila: só entram se faltar questão inédita. */
export function ineditasPrimeiro<T extends { id: string }>(sorteadas: T[], jaVistas: Set<string>): T[] {
  const ineditas = sorteadas.filter((q) => !jaVistas.has(q.id));
  const vistas = sorteadas.filter((q) => jaVistas.has(q.id));
  return [...ineditas, ...vistas];
}
