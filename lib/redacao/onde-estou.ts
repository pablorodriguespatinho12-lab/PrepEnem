// Em que frase do molde o aluno está, contado pelo CÓDIGO (Pablo, 29/10/2026:
// "saber onde eu estou e qual a minha próxima ação"). A IA da ajuda recebe
// esse número pronto: contar frase é conta, não palpite.

import type { ChaveParagrafo } from './receita';

/* Frase = trecho que termina em ponto, interrogação ou exclamação. O último
   pedaço sem ponto é a frase que ele ainda está escrevendo. */
export function frasesDoTexto(texto: string): { completas: string[]; emAndamento: string } {
  const limpo = texto.replace(/\s+/g, ' ').trim();
  if (!limpo) return { completas: [], emAndamento: '' };
  const pedacos = limpo.split(/(?<=[.!?…]["”’)]?)\s+/);
  const ultimo = pedacos[pedacos.length - 1];
  const fechado = /[.!?…]["”’)]?$/.test(ultimo);
  return fechado ? { completas: pedacos, emAndamento: '' } : { completas: pedacos.slice(0, -1), emAndamento: ultimo };
}

/* Quantas frases o aluno escreve no passo: na introdução a 3ª é a tese do
   passo 3, que entra sozinha. */
export function frasesParaEscrever(chave: ChaveParagrafo, totalDoMolde: number): number {
  return chave === 'introducao' ? Math.min(2, totalDoMolde) : totalDoMolde;
}

export interface OndeEstou {
  /* Índice (0 = 1ª) da frase do molde que ele está escrevendo ou deve
     escrever agora. Igual a `total` quando já escreveu todas. */
  atual: number;
  total: number;
  completas: number;
  escrevendo: boolean;
}

export function ondeEstou(texto: string, chave: ChaveParagrafo, totalDoMolde: number): OndeEstou {
  const total = frasesParaEscrever(chave, totalDoMolde);
  const { completas, emAndamento } = frasesDoTexto(texto);
  return {
    atual: Math.min(completas.length, total),
    total,
    completas: completas.length,
    escrevendo: emAndamento.length > 0 && completas.length < total,
  };
}

/* Põe o começo sugerido pela ajuda no fim do texto. Se ele já tinha começado
   a frase ("Nesse sentido,") e o começo repete esse pedaço, não duplica. */
export function juntarComeco(texto: string, comeco: string): string {
  const limpo = comeco.replace(/(\.\.\.|…)$/, '').trim();
  const base = texto.trimEnd();
  const fim = base.match(/^([\s\S]*[.!?…]["”’)]?\s+)?([\s\S]*)$/);
  const antes = fim?.[1] ?? '';
  const pedaco = fim?.[2] ?? '';
  const normal = (s: string) => s.replace(/\s+/g, ' ').toLowerCase().replace(/[\s,;:]+$/, '');
  const repete = pedaco && !/[.!?…]["”’)]?$/.test(pedaco) && normal(limpo).startsWith(normal(pedaco));
  if (repete) return `${antes}${limpo} `;
  return base ? `${base} ${limpo} ` : `${limpo} `;
}
