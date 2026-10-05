// Itens fixos de cada parte no treino por partes. São fixos de propósito: a IA
// só marca cada item (cumpriu ou não, com o trecho); a lista do que se cobra
// não muda de uma correção para outra. Tirados dos padrões das cartilhas do
// INEP (docs/redacao-enem-correcao.md).

import type { TipoParte } from '@/data/redacao/modelos';

export interface ItemCriterio { id: string; rotulo: string; descricao: string }

const INTRODUCAO: ItemCriterio[] = [
  { id: 'repertorio', rotulo: 'Repertório legitimado e pertinente', descricao: 'Uma referência de área do conhecimento (autor, obra, lei, fato histórico, conceito) ligada ao tema. Dado copiado dos textos de contexto não conta.' },
  { id: 'repertorio_produtivo', rotulo: 'Repertório explicado, não solto', descricao: 'O repertório é explicado e ligado ao tema. Se desse para trocar por outra citação sem mudar nada, é "repertório de bolso".' },
  { id: 'tema_completo', rotulo: 'Tema completo', descricao: 'Aborda todos os termos da frase temática, ligando o assunto à realidade brasileira.' },
  { id: 'tese', rotulo: 'Tese clara', descricao: 'Um ponto de vista que o texto vai defender, não só a apresentação do assunto.' },
  { id: 'anuncio', rotulo: 'Anúncio dos argumentos', descricao: 'Antecipa os dois eixos (causas, desafios) que os desenvolvimentos vão explicar.' },
];

const DESENVOLVIMENTO: ItemCriterio[] = [
  { id: 'operador', rotulo: 'Operador entre parágrafos', descricao: 'Abre ligando ao parágrafo anterior ("Em primeira análise", "Além disso", "Outrossim").' },
  { id: 'topico', rotulo: 'Tópico frasal', descricao: 'A primeira frase diz do que o parágrafo trata e retoma um dos eixos anunciados na introdução.' },
  { id: 'repertorio_produtivo', rotulo: 'Repertório que sustenta o argumento', descricao: 'Referência legitimada usada a favor do argumento, explicada, não citada solta no fim.' },
  { id: 'analise', rotulo: 'Análise', descricao: 'Explica a causa ou a consequência no Brasil. Não deixa a ligação para o leitor fazer.' },
  { id: 'fecho', rotulo: 'Fecho', descricao: 'Última frase conclui o parágrafo ligando de volta à tese ("Dessa forma...").' },
];

const CONCLUSAO: ItemCriterio[] = [
  { id: 'retomada', rotulo: 'Retomada da tese', descricao: 'Retoma o problema e as causas discutidas, de preferência voltando ao repertório da introdução.' },
  { id: 'agente', rotulo: 'Agente', descricao: 'Quem vai agir, nomeado. "Alguém", "você" ou verbo no imperativo não valem.' },
  { id: 'acao', rotulo: 'Ação', descricao: 'O que fazer, de forma interventiva. Constatar ("faltam investimentos") não é propor.' },
  { id: 'modo', rotulo: 'Modo/meio', descricao: 'Como a ação será feita ("por meio de...").' },
  { id: 'efeito', rotulo: 'Efeito/finalidade', descricao: 'Para que a ação serve ("a fim de...").' },
  { id: 'detalhamento', rotulo: 'Detalhamento', descricao: 'Informação a mais sobre agente, ação, modo ou efeito: exemplo, especificação, justificativa.' },
];

export const CRITERIOS_PARTE: Record<TipoParte, ItemCriterio[]> = {
  introducao: INTRODUCAO,
  desenvolvimento1: DESENVOLVIMENTO,
  desenvolvimento2: DESENVOLVIMENTO,
  conclusao: CONCLUSAO,
};
