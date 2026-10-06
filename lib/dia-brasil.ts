// O servidor na Vercel roda em UTC. "Que dia é hoje" tem de ser o dia do aluno:
// às 22h de Brasília o UTC já virou, e a sequência de estudo e o gráfico por
// dia caíam no dia errado.

const FUSO = 'America/Sao_Paulo';
const MS_POR_DIA = 24 * 60 * 60 * 1000;

const formatoDia = new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' });

/* "AAAA-MM-DD" no fuso de Brasília. */
export function diaNoBrasil(data: Date): string {
  return formatoDia.format(data);
}

/* Diferença em dias de calendário de Brasília (0 = mesmo dia). */
export function diasEntre(antes: Date, depois: Date): number {
  const meiaNoite = (d: Date) => Date.parse(`${diaNoBrasil(d)}T00:00:00Z`);
  return Math.round((meiaNoite(depois) - meiaNoite(antes)) / MS_POR_DIA);
}

/* Sequência de dias estudando depois de estudar em `agora`. */
export function proximaSequencia(ultimoEstudo: Date | null, sequenciaAtual: number, agora: Date): number {
  if (!ultimoEstudo) return 1;
  const diff = diasEntre(ultimoEstudo, agora);
  if (diff <= 0) return Math.max(sequenciaAtual, 1);
  if (diff === 1) return sequenciaAtual + 1;
  return 1;
}
