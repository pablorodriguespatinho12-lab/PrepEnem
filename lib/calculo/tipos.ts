// Formato de uma lição da trilha de Cálculo. A ordem das seções é a ordem da
// pesquisa de 05/10/2026 (lib/tutor/prompts.ts tem as fontes):
//   gancho      → tentativa curta antes da explicação (productive failure, Kapur)
//   construcao  → de onde a ideia vem: concreto → desenho → símbolo (Fyfe)
//   resumo      → a fórmula, por último, como resumo do raciocínio
//   exemplos    → resolvido completo, depois com 1 e 2 passos em branco (Renkl & Atkinson)
//   exercicios  → o aluno resolve; resolução comentada depois
//   recuperacao → pergunta de cabeça para fixar (Dunlosky)

import type { Visual } from '@/lib/visual/especificacao';

export type Resposta =
  | { tipo: 'numero'; valor: number; tolerancia?: number }
  | { tipo: 'escolha'; opcoes: string[]; correta: number };

export interface PassoConstrucao { titulo: string; texto: string; visual?: Visual | null }

export interface PassoResolvido {
  texto: string;
  porque: string;
  /* Passo em branco: o aluno responde antes de ver o texto do passo. */
  lacuna?: { pergunta: string; resposta: Resposta };
}

export interface ExemploResolvido { enunciado: string; visual?: Visual | null; passos: PassoResolvido[] }

export interface Exercicio {
  enunciado: string;
  visual?: Visual | null;
  resposta: Resposta;
  dica: string;
  resolucao: { texto: string; porque: string }[];
}

export interface ConteudoLicao {
  gancho: { pergunta: string; ideia: string };
  construcao: PassoConstrucao[];
  resumo: string;
  exemplos: ExemploResolvido[];
  exercicios: Exercicio[];
  recuperacao: { pergunta: string; resposta: string };
}

export type Modulo = 'pre' | 'calc1' | 'calc2' | 'calc3';

export interface Degrau {
  id: string;
  modulo: Modulo;
  titulo: string;
  /* O que a lição precisa deixar claro; também vira instrução para a IA. */
  objetivo: string;
  /* A pergunta que move a lição (o "por que isso existe"). */
  pergunta: string;
  prerequisitos: string[];
  minutos: number;
  /* Assunto do ENEM que já prepara este degrau, para ligar ao cronograma. */
  ligacaoEnem?: string;
}

export interface LicaoCompleta extends Degrau { conteudo: ConteudoLicao; origem: 'escrita' | 'ia' }

export function conferirResposta(r: Resposta, dada: string | number): boolean {
  if (r.tipo === 'escolha') return Number(dada) === r.correta;
  const valor = typeof dada === 'number' ? dada : Number(String(dada).replace(',', '.').trim());
  if (!Number.isFinite(valor)) return false;
  const tolerancia = r.tolerancia ?? Math.max(1e-6, Math.abs(r.valor) * 1e-3);
  return Math.abs(valor - r.valor) <= tolerancia;
}
