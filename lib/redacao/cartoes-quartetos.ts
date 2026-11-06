// Baralho "Meus quartetos da redação" (Pablo, 06/11/2026: "2 quartetos vou
// decorar para todos os temas que os dois cobrem"; "lembra dos flashcards para
// decorar os repertórios para não esquecer"). Os 2 quartetos são o melhor par
// nos 28 temas do ENEM: juntos servem em 25 (docs/redacao/repertorios-coringa.md).
// As frases saem de CORINGAS e do Pacto (lei-coringa.ts), a mesma fonte das
// fichas do site. A dica nunca usa palavra do verso (o teste barra).

import { CORINGAS } from './autores';
import { MEMORIA, type Cartao } from './cartoes-coringas';
import { LEI_CORINGA } from './lei-coringa';

export const QUARTETOS = {
  1: { d1: 'Rui Barbosa', d2: 'Dom Hélder', temas: 18 },
  2: { d1: 'Graciliano', d2: 'Galeano', temas: 7 },
} as const;

const NOS_QUARTETOS = ['Drummond', 'Rui Barbosa', 'Dom Hélder', 'Graciliano', 'Galeano'] as const;

function cartoesDaEscolha(): Cartao[] {
  const q1 = QUARTETOS[1];
  const q2 = QUARTETOS[2];
  const artigos = LEI_CORINGA.artigos.map((a) => `${a.artigo}: ${a.assunto}`).join('; ');
  return [
    { frente: 'Quarteto 1: quem vai em cada parte?', verso: `Introdução: Pacto + Drummond. 1º desenvolvimento: ${q1.d1}. 2º desenvolvimento: ${q1.d2}.`, dica: 'Lei, igualdade e a causa do problema.' },
    { frente: 'Quarteto 2: quem vai em cada parte?', verso: `Introdução: Pacto + Drummond. 1º desenvolvimento: ${q2.d1}. 2º desenvolvimento: ${q2.d2}.`, dica: 'Lei, um sertanejo e os invisíveis.' },
    { frente: 'Tema de direito, acesso ou Estado: qual quarteto?', verso: `Quarteto 1 (${q1.d1} e ${q1.d2}). Sozinho, serve em ${q1.temas} dos 28 temas.`, dica: 'O mais forte dos dois.' },
    { frente: 'Tema de gente excluída ou invisível (violência, criança, imigração, trabalho): qual quarteto?', verso: `Quarteto 2 (${q2.d1} e ${q2.d2}).`, dica: 'Fabiano e os ninguéns.' },
    { frente: 'Tema de meio ambiente: o que usar nos desenvolvimentos?', verso: 'Misture: Dom Hélder e Galeano, com Pacto + Drummond na introdução.', dica: 'Um de cada quarteto.' },
    { frente: 'Tema de ética ou de publicidade infantil: qual coringa passou?', verso: 'Só o Rui Barbosa, além do Drummond.', dica: 'O da igualdade real.' },
    { frente: 'Qual lei vai com o Drummond na introdução?', verso: `${LEI_CORINGA.nome} (${LEI_CORINGA.quando}).`, dica: 'Uma lei mundial que o país assinou.' },
    { frente: 'Pacto: qual artigo para cada direito?', verso: `${artigos}.`, dica: 'Quatro números, de 6 a 13.' },
  ];
}

function cartoesDasFrases(): Cartao[] {
  const cartoes: Cartao[] = [];
  for (const nome of NOS_QUARTETOS) {
    const k = CORINGAS[nome];
    const frase = k.curta ?? `"${k.texto}"`;
    cartoes.push({ frente: `${k.rotulo}: qual é a frase?`, verso: `${frase} (${k.fonte}, ${k.quando})`, dica: MEMORIA[nome].imagem });
  }
  for (const nome of NOS_QUARTETOS) {
    const k = CORINGAS[nome];
    cartoes.push({ frente: `O que a frase de ${k.rotulo} quer dizer?`, verso: k.sentido ?? MEMORIA[nome].mecanismo, dica: 'Diga com as suas palavras antes de virar.' });
  }
  return cartoes;
}

export function cartoesDosQuartetos(): Cartao[] {
  return [...cartoesDaEscolha(), ...cartoesDasFrases()];
}
