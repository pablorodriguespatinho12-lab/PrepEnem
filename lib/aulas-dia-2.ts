import aulas from '@/data/revisao-final/dia-2/aulas.json';

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

export type AulaDoTema = { materia: string; aula: string[]; degraus: Degrau[] };

const TODAS = aulas as Record<string, AulaDoTema>;

export function aulaDoTema(tema: string | null | undefined): AulaDoTema | null {
  if (!tema) return null;
  return TODAS[tema] ?? null;
}

export const TEMAS_COM_AULA = Object.keys(TODAS);
