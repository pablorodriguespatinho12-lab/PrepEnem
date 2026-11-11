// Redações-modelo do PrepEnem: textos ORIGINAIS (não são redações do INEP),
// sobre temas reais do ENEM, comentados trecho a trecho pela grade oficial
// (docs/redacao-enem-correcao.md). Servem para três coisas: estudar como uma
// parte é construída, treinar por partes (o aluno escreve a parte retirada) e
// comparar a parte dele com a do modelo depois da correção.
//
// Repertório: só fato verificável (autor, obra, lei, ano). Os textos de
// contexto são resumos escritos aqui, não os textos motivadores oficiais.

import type { AutorDosTrios } from '@/lib/redacao/cartoes-trios';
import { MODELOS_TRIOS } from './modelos-trios';

export type TipoParte = 'introducao' | 'desenvolvimento1' | 'desenvolvimento2' | 'conclusao';

export const ROTULO_PARTE: Record<TipoParte, string> = {
  introducao: 'Introdução',
  desenvolvimento1: 'Desenvolvimento 1',
  desenvolvimento2: 'Desenvolvimento 2',
  conclusao: 'Conclusão',
};

export const ORDEM_PARTES: TipoParte[] = ['introducao', 'desenvolvimento1', 'desenvolvimento2', 'conclusao'];

/* O papel de cada trecho na grade. Os cinco da proposta são os elementos da C5. */
export type Papel =
  | 'repertorio' | 'contextualizacao' | 'tese' | 'anuncio'
  | 'operador' | 'topico' | 'analise' | 'fecho' | 'retomada'
  | 'agente' | 'acao' | 'modo' | 'efeito' | 'detalhamento';

export const ROTULO_PAPEL: Record<Papel, string> = {
  repertorio: 'Repertório', contextualizacao: 'Ligação com o Brasil', tese: 'Tese', anuncio: 'Anúncio dos argumentos',
  operador: 'Operador entre parágrafos', topico: 'Tópico frasal', analise: 'Análise', fecho: 'Fecho do parágrafo',
  retomada: 'Retomada', agente: 'Agente', acao: 'Ação', modo: 'Modo/meio', efeito: 'Efeito', detalhamento: 'Detalhamento',
};

export interface Anotacao { trecho: string; papel: Papel; porque: string }
export interface ParteModelo { texto: string; anotacoes: Anotacao[] }

export interface RedacaoModelo {
  id: string;
  tema: string;
  anoEnem: number;
  contexto: string;
  /* Redação montada com um dos 2 trios de coringas (lib/redacao/cartoes-trios.ts). */
  trio?: 1 | 2;
  /* Nome curto do tema na aba ("Saúde mental"). */
  rotulo?: string;
  /* Redação de trio: como cada autor foi ligado a ESTE tema, em 1 linha
     (a tela "O mesmo autor em 3 temas" põe as 3 lado a lado). */
  usos?: Partial<Record<AutorDosTrios, string>>;
  partes: Record<TipoParte, ParteModelo>;
}

export const MODELOS: RedacaoModelo[] = [
  // Toda redação-modelo é de trio, só com o repertório do trio (Pablo,
  // 07/11/2026: "eu só sei os trios"). As 4 antigas (Arendt, Beauvoir, Cinema
  // Paradiso...) foram reescritas com os trios em modelos-trios.ts.
  ...MODELOS_TRIOS,
];

export function buscarModelo(id: string): RedacaoModelo | undefined {
  return MODELOS.find((m) => m.id === id);
}

/* Texto da redação com a parte retirada marcada, para o treino por partes. */
export function textoBaseSemParte(modelo: RedacaoModelo, parte: TipoParte): string {
  return ORDEM_PARTES.map((p) =>
    p === parte ? `[${ROTULO_PARTE[p].toUpperCase()}: escreva esta parte]` : modelo.partes[p].texto,
  ).join('\n\n');
}
