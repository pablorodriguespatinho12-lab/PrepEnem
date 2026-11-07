// Flashcards de Redação em escadinha (Pablo, 07/11/2026: "apaga todos os
// flashcards da parte de redação e coloca falas de autores... depois o que
// eles querem dizer... depois em quais posições... depois um tema e quais
// argumentos utilizar"). Só os 5 autores dos 2 trios. Trio = introdução,
// 1º e 2º desenvolvimento, um autor em cada (antes chamado de "quarteto").
// As frases saem de CORINGAS e do Pacto (lei-coringa.ts), a mesma fonte do
// resto do site. A dica nunca usa palavra do verso (o teste barra).

import { CORINGAS } from './autores';
import { MEMORIA, type Cartao } from './cartoes-coringas';
import { LEI_CORINGA } from './lei-coringa';

export const TRIOS = {
  1: { d1: 'Rui Barbosa', d2: 'Dom Hélder', tipo: 'direito, acesso, Estado, saúde ou tecnologia' },
  2: { d1: 'Graciliano', d2: 'Galeano', tipo: 'gente excluída ou invisível (violência, criança, imigração, trabalho)' },
} as const;
export type NumeroDoTrio = keyof typeof TRIOS;

export const AUTORES_DOS_TRIOS = ['Drummond', 'Rui Barbosa', 'Dom Hélder', 'Graciliano', 'Galeano'] as const;
export type AutorDosTrios = (typeof AUTORES_DOS_TRIOS)[number];

/* 8 temas reais do ENEM em que só um dos trios passou na prova dos 28
 * (coringas-por-tema.json): 4 de cada. */
export const TEMAS_DO_BARALHO: { tema: string; trio: NumeroDoTrio }[] = [
  { tema: 'O estigma associado às doenças mentais na sociedade brasileira', trio: 1 },
  { tema: 'Direitos da criança e do adolescente: como enfrentar esse desafio nacional', trio: 2 },
  { tema: 'Manipulação do comportamento do usuário pelo controle de dados na internet', trio: 1 },
  { tema: 'O desafio de se conviver com a diferença', trio: 2 },
  { tema: 'Democratização do acesso ao cinema no Brasil', trio: 1 },
  { tema: 'O poder de transformação da leitura', trio: 2 },
  { tema: 'A persistência da violência contra a mulher na sociedade brasileira', trio: 1 },
  { tema: 'O trabalho na construção da dignidade humana', trio: 2 },
];

const ONDE_ENTRA: Record<AutorDosTrios, { verso: string; dica: string }> = {
  Drummond: { verso: 'Introdução, nos dois trios, junto com o Pacto.', dica: 'Abre o texto.' },
  'Rui Barbosa': { verso: 'Trio 1, no 1º desenvolvimento.', dica: 'O da igualdade real.' },
  'Dom Hélder': { verso: 'Trio 1, no 2º desenvolvimento.', dica: 'O santo e o comunista.' },
  Graciliano: { verso: 'Trio 2, no 1º desenvolvimento.', dica: 'Fabiano.' },
  Galeano: { verso: 'Trio 2, no 2º desenvolvimento.', dica: 'Os ninguéns.' },
};

/* Forma de decorar: a curta quando existe (o Rui longo ninguém decorou). */
const falaDe = (nome: AutorDosTrios): string => CORINGAS[nome].curta ?? CORINGAS[nome].texto;

export const quemVaiNoTrio = (n: NumeroDoTrio): string =>
  `Introdução: Drummond + Pacto. 1º desenvolvimento: ${TRIOS[n].d1}. 2º desenvolvimento: ${TRIOS[n].d2}.`;

function cartoesDasFalas(): Cartao[] {
  return AUTORES_DOS_TRIOS.map((nome) => {
    const k = CORINGAS[nome];
    const comoCitar = k.curta ? ' Na prova, cite como ideia, sem aspas.' : '';
    return { frente: k.rotulo, verso: `"${falaDe(nome)}" (${k.fonte}, ${k.quando}).${comoCitar}`, dica: MEMORIA[nome].imagem };
  });
}

function cartoesDosSentidos(): Cartao[] {
  return AUTORES_DOS_TRIOS.map((nome) => {
    const k = CORINGAS[nome];
    return { frente: `${k.rotulo}: "${falaDe(nome)}" O que ele quer dizer?`, verso: k.sentido ?? MEMORIA[nome].mecanismo, dica: 'Diga com as suas palavras antes de virar.' };
  });
}

function cartoesDasPosicoes(): Cartao[] {
  return [
    { frente: 'Trio 1: quem vai em cada parte?', verso: quemVaiNoTrio(1), dica: 'A igualdade real e a causa do problema.' },
    { frente: 'Trio 2: quem vai em cada parte?', verso: quemVaiNoTrio(2), dica: 'Um sertanejo e os invisíveis.' },
    { frente: 'Qual lei vai com o Drummond na introdução?', verso: `${LEI_CORINGA.nome} (${LEI_CORINGA.quando}).`, dica: 'Uma lei mundial que o país assinou.' },
    ...AUTORES_DOS_TRIOS.map((nome) => ({ frente: `${CORINGAS[nome].rotulo}: em que parte da redação?`, ...ONDE_ENTRA[nome] })),
  ];
}

function cartoesDosTemas(): Cartao[] {
  return TEMAS_DO_BARALHO.map(({ tema, trio }) => ({
    frente: `Tema: "${tema}". Qual trio?`,
    verso: `Trio ${trio}. ${quemVaiNoTrio(trio)}`,
    dica: trio === 1 ? 'Tema de direito ou de acesso?' : 'Tema de gente invisível?',
  }));
}

export interface BaralhoDosTrios {
  /* Nome e título na lista (a lista ordena por ele: 1, 2, 3, 4). */
  nome: string;
  descricao: string;
  cartoes: Cartao[];
}

export function baralhosDosTrios(): BaralhoDosTrios[] {
  return [
    { nome: '1. O que cada autor fala', descricao: 'As 5 falas dos 2 trios: Drummond, Rui Barbosa, Dom Hélder, Graciliano e Galeano.', cartoes: cartoesDasFalas() },
    { nome: '2. O que cada autor quer dizer', descricao: 'A fala na frente; o sentido atrás.', cartoes: cartoesDosSentidos() },
    { nome: '3. Onde cada um entra', descricao: 'Trio = introdução, 1º e 2º desenvolvimento, um autor em cada.', cartoes: cartoesDasPosicoes() },
    { nome: '4. Tema e trio', descricao: 'Um tema real do ENEM: qual trio usar. Depois, leia as redações prontas em Redação → Redações prontas dos trios.', cartoes: cartoesDosTemas() },
  ];
}
