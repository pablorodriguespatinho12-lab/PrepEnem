// Exemplos prontos de cada coringa, em temas reais do ENEM, para o aluno ver
// um texto no tema X e escrever o dele no tema Y (Pablo, 30/10/2026: "exemplos
// me ajudam muito porque sou mais prático").
//
// Não são escritos à mão nem pela IA na hora: são os parágrafos que os 3
// juízes APROVARAM na prova dos coringas (docs/redacao/repertorios-coringa.md),
// o melhor de cada grande assunto. O JSON sai de
// docs/redacao/prova-coringas/exemplos.py; os fatos com número ou lei foram
// conferidos em 30/10/2026 (Estatuto do Idoso 2003, LGPD 2018, Lei de Libras
// 2002, Mariana 2015, Brumadinho 2019, Diretas Já 1984, Lei Áurea nº 3.353,
// voto do analfabeto em 1985, Quarto de Despejo 1960).

import dados from './exemplos-coringas.json';

export interface ExemploCoringa {
  tema: string;
  assuntos: string[];
  /* As 3 partes que o aluno imita, na ordem do texto. */
  citacao: string;
  sentido: string;
  ligacao: string;
}

const EXEMPLOS = dados as Record<string, ExemploCoringa[]>;

/* A pergunta que transforma a ideia do coringa na ligação com qualquer tema:
   o aluno responde e a resposta vira a parte 3. */
export const PERGUNTA_DO_CORINGA: Record<string, string> = {
  Drummond: 'Que lei ou direito do seu tema existe no papel, mas não chega à vida real? Não precisa do número da lei: “a Constituição garante…” já vale.',
  /* "causa" ficou vago para o iniciante (teste de 30/10/2026). */
  'Dom Hélder': 'No seu tema, que ajuda resolve só na hora, sem perguntar por que o problema existe?',
  'Rui Barbosa': 'No seu tema, quem está em desvantagem e precisa de um cuidado diferente?',
  'Elie Wiesel': 'No seu tema, quem sofre enquanto a sociedade não se importa?',
  Graciliano: 'No seu tema, quem é tratado como menos que gente, e por quê?',
  Galeano: 'No seu tema, quem a sociedade trata como se não existisse?',
  Brecht: 'No seu tema, que reação de quem sofre é condenada, enquanto a causa dela ninguém critica?',
  'Dado 1888': 'No seu tema, que efeito da escravidão ainda aparece hoje?',
};

/* Os exemplos do coringa em temas DIFERENTES do tema do aluno: com o mesmo
   tema ele copiaria em vez de imitar a estrutura. */
export function exemplosDoCoringa(coringa: string, temaDoAluno: string): ExemploCoringa[] {
  const igual = (t: string) => t.trim().toLowerCase() === temaDoAluno.trim().toLowerCase();
  return (EXEMPLOS[coringa] ?? []).filter((e) => !igual(e.tema));
}
