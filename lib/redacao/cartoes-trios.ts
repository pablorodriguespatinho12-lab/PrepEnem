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
import { MODELOS } from '@/data/redacao/modelos';

/* Só o Trio 1 (Pablo, 07/11/2026: "não vou conseguir decorar as duas coisas,
 * prefiro o trio 1, o do Rui Barbosa"). O Trio 2 (Graciliano + Galeano) saiu. */
export const TRIOS = {
  1: { d1: 'Rui Barbosa', d2: 'Dom Hélder', tipo: 'todos os temas das redações prontas' },
} as const;
export type NumeroDoTrio = keyof typeof TRIOS;

export const AUTORES_DOS_TRIOS = ['Drummond', 'Rui Barbosa', 'Dom Hélder'] as const;
export type AutorDosTrios = (typeof AUTORES_DOS_TRIOS)[number];

const ONDE_ENTRA: Record<AutorDosTrios, { verso: string; dica: string }> = {
  Drummond: { verso: 'Introdução, junto com o Pacto.', dica: 'Abre o texto.' },
  'Rui Barbosa': { verso: 'No 1º desenvolvimento.', dica: 'O da igualdade real.' },
  'Dom Hélder': { verso: 'No 2º desenvolvimento.', dica: 'O santo e o comunista.' },
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
    { frente: 'O trio: quem vai em cada parte?', verso: quemVaiNoTrio(1), dica: 'A igualdade real e a causa do problema.' },
    { frente: 'Qual lei vai com o Drummond na introdução?', verso: `${LEI_CORINGA.nome} (${LEI_CORINGA.quando}).`, dica: 'Uma lei mundial que o país assinou.' },
    ...AUTORES_DOS_TRIOS.map((nome) => ({ frente: `${CORINGAS[nome].rotulo}: em que parte da redação?`, ...ONDE_ENTRA[nome] })),
  ];
}

/* Um cartão por redação pronta: o tema na frente; atrás, como o Rui e o Dom
 * Hélder entram nele (as linhas de RedacaoModelo.usos, sem lei nem dado). */
function cartoesDosTemas(): Cartao[] {
  return MODELOS.filter((m) => m.trio && m.usos).map((m) => ({
    frente: `Tema: "${m.tema}". Como o Rui e o Dom Hélder entram?`,
    verso: `Rui: ${m.usos!['Rui Barbosa']} Dom Hélder: ${m.usos!['Dom Hélder']}`,
    dica: 'Pense: quem parte atrás? Qual seria a pergunta incômoda?',
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
    { nome: '1. O que cada autor fala', descricao: 'As 3 falas do trio: Drummond, Rui Barbosa e Dom Hélder.', cartoes: cartoesDasFalas() },
    { nome: '2. O que cada autor quer dizer', descricao: 'A fala na frente; o sentido atrás.', cartoes: cartoesDosSentidos() },
    { nome: '3. Onde cada um entra', descricao: 'Trio = introdução, 1º e 2º desenvolvimento, um autor em cada.', cartoes: cartoesDasPosicoes() },
    { nome: '4. Como o Rui e o Dom Hélder entram no tema', descricao: 'Um tema real do ENEM na frente; atrás, a ligação de cada um. São os temas das redações prontas.', cartoes: cartoesDosTemas() },
  ];
}
