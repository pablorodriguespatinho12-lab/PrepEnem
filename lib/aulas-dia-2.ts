import aulas from '@/data/revisao-final/dia-2/aulas.json';
import enemNatureza from '@/data/revisao-final/dia-2/enem-natureza.json';
import enemMatematica from '@/data/revisao-final/dia-2/enem-matematica.json';

// Aula de cada um dos 22 conteúdos do dia 2, aberta de dentro da questão
// (Pablo, 11/11/2026: estudar pela questão e chegar pronto no Médio, Difícil e ENEM).
// Gerada por scripts/gerar-aulas-dia-2.cjs; não gasta IA.

export type Degrau = {
  nivel: 'Médio' | 'Difícil' | 'ENEM';
  origem?: string;
  enunciado: string;
  alternativas: string[];
  certa: number;
  resolucao: string;
};

// paraSubir: o que a questão de cima cobra e a aula não ensina (scripts/data/aulas-dia-2-subir.json).
// Macete curinga do conteúdo (Pablo, 14/11/2026: "um jeito curinga que serve para a maioria
// das ocasiões", da fácil até o ENEM). O Jeito rápido de cada questão aplica este macete.
export type Macete = { nome: string; regra: string; passos: string[]; exemplo: string };
export type AulaDoTema = { materia: string; aula: string[]; paraSubir: string[]; degraus: Degrau[]; macete?: Macete };

const TODAS = aulas as Record<string, AulaDoTema>;

export function aulaDoTema(tema: string | null | undefined): AulaDoTema | null {
  if (!tema) return null;
  return TODAS[tema] ?? null;
}

export const TEMAS_COM_AULA = Object.keys(TODAS);

// As 40 reais do ENEM estão no banco com `tema` vazio; o tema delas está nos arquivos
// da prova, pelo id do banco (11/11/2026). Sem isso o botão não aparecia na prova 4.
const TEMA_DA_REAL = new Map<string, string>(
  [...(enemNatureza as { id: string; tema: string }[]), ...(enemMatematica as { id: string; tema: string }[])].map((q) => [q.id, q.tema]),
);

export function temaDaQuestao(q: { id: string; tema?: string | null }): string | null {
  if (q.tema && TODAS[q.tema]) return q.tema;
  return TEMA_DA_REAL.get(q.id) ?? q.tema ?? null;
}
