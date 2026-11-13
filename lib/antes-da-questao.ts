import dados from '@/data/revisao-final/antes-da-questao.json';
import type { PassoExplicacao } from '@/lib/tutor/validar';

// "Antes da questão" (Pablo, 12/11/2026, mangueira: "ela ensinava usando velocidade
// média, que eu não tinha estudado"): conteúdo que a questão cobra e a aula do tema
// não ensina vem ANTES da explicação, numa aula curta e 2 exercícios.

export type Exercicio = { enunciado: string; alternativas: string[]; certa: number; resolucao: string };
export type ConceitoAntes = { id: string; titulo: string; aula: PassoExplicacao; exercicios: Exercicio[] };

type Bruto = { titulo: string; linhas: string[]; visual?: unknown; exercicios: Exercicio[] };
const CONCEITOS = dados.conceitos as Record<string, Bruto>;
const QUESTOES = dados.questoes as Record<string, string[]>;

export function antesDaQuestao(questaoId: string | undefined): ConceitoAntes[] {
  if (!questaoId) return [];
  return (QUESTOES[questaoId] ?? []).flatMap((id) => {
    const c = CONCEITOS[id];
    if (!c) return [];
    const aula = { titulo: c.titulo, texto: c.linhas.join('\n'), visual: c.visual ?? null } as PassoExplicacao;
    return [{ id, titulo: c.titulo, aula, exercicios: c.exercicios }];
  });
}

export const CONCEITOS_ANTES = CONCEITOS;
export const QUESTOES_COM_ANTES = QUESTOES;
