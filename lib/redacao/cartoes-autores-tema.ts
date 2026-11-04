// Baralho "Autores por tema" (Pablo, 02/11/2026: "um flashcard de redação: que
// autores eu posso utilizar nesse tema, aí tem vários lá e eu fico decorando").
// Um cartão por tema do ENEM, com o veredito dos 3 juízes da prova dos
// coringas (lib/redacao/coringas-por-tema.json), o mesmo da aba Exemplo.
//
// Informação mínima (flashcard-pattern): o Drummond serviu nos 28 temas, então
// ele não entra no verso (não ensina nada) e a frente já diz isso. O verso
// traz no máximo 3 nomes, os que mais serviram na prova, para caber de cabeça.

import dados from './coringas-por-tema.json';
import { CORINGAS } from './autores';
import { MEMORIA, type Cartao } from './cartoes-coringas';

const SEMPRE = 'Drummond';
const MAXIMO = 3;

/* O nome como o aluno fala ("Dado 1888" é o dado, não uma pessoa). */
const NOME: Record<string, string> = { 'Dado 1888': 'o dado de 1888' };
const nome = (chave: string) => NOME[chave] ?? chave;

const forca = (chave: string) => CORINGAS[chave]?.prova.aprovados ?? 0;

function lista(nomes: string[]): string {
  if (nomes.length <= 1) return nomes.join('');
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}

type Veredito = Record<string, { serve: boolean }>;

export function cartoesDosAutoresPorTema(): Cartao[] {
  return Object.entries(dados as Record<string, Veredito>).map(([tema, porAutor]) => {
    const servem = Object.entries(porAutor)
      .filter(([chave, v]) => v.serve && chave !== SEMPRE)
      .map(([chave]) => chave)
      .sort((a, b) => forca(b) - forca(a))
      .slice(0, MAXIMO);
    const primeiro = servem[0];
    return {
      frente: `Tema: ${tema}. Além do Drummond, que autores servem?`,
      verso: servem.length > 0 ? `${lista(servem.map(nome))}.` : 'Só o Drummond.',
      dica: primeiro && MEMORIA[primeiro] ? `Um deles fala que ${MEMORIA[primeiro].mecanismo}.` : '',
    };
  });
}
