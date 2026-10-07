// Questões REAIS de vestibular (pedido do Pablo, 06/10/2026): ITA, IME, Fuvest,
// Unicamp e Unesp, transcritas das provas e conferidas contra o gabarito
// oficial. Cada uma vem com a resolução em passos de clicar e responder.
// A fonte de cada prova está no topo de cada arquivo em data/vestibular/.

export type Banca = 'ITA' | 'IME' | 'Fuvest' | 'Unicamp' | 'Unesp';

export interface PassoResolucao {
  /* O que fazer agora, como pergunta curta. */
  pergunta: string;
  opcoes: string[];
  correta: number;
  /* A conta que aparece escrita depois de responder (LaTeX, sem $). */
  conta?: string;
  /* Uma frase: por que esse passo. */
  porque?: string;
}

export interface QuestaoVestibular {
  banca: Banca;
  ano: number;
  numero: number;
  materia: 'Matemática' | 'Física' | 'Química';
  subtema: string;
  enunciado: string;
  /* 5 alternativas; a Unicamp usa 4. */
  alternativas: string[];
  /* Índice da alternativa certa no gabarito oficial. */
  gabarito: number;
  /* Mudança na transcrição (figura descrita, rótulo corrigido). */
  adaptacao?: string;
  passos: PassoResolucao[];
}

/* Chave estável da questão; vai para Question.origem no banco. */
export const chaveVestibular = (q: Pick<QuestaoVestibular, 'banca' | 'ano'>) => `${q.banca} ${q.ano}`;
