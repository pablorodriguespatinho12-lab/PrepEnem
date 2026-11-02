// Quais coringas servem no tema do aluno e o exemplo NO PRÓPRIO tema (Pablo,
// 02/11/2026: "o exemplo tem que ser desse tema", "quais frases eu posso
// utilizar, quais eu não posso"). Os dados são o veredito dos 3 juízes da
// prova dos coringas nos 28 temas do ENEM, gerados por
// docs/redacao/prova-coringas/por_tema.py. Tema fora da lista: null, e a aba
// Exemplo volta ao exemplo em outro tema.

import dados from './coringas-por-tema.json';
import { CORINGAS } from './autores';

export interface AutorNoTema {
  coringa: string;
  serve: boolean;
  /* As 3 partes do parágrafo aprovado neste tema (só quando serve). */
  citacao?: string;
  sentido?: string;
  ligacao?: string;
}

type Dados = Record<string, Record<string, Omit<AutorNoTema, 'coringa'>>>;
const POR_TEMA = dados as Dados;

const normalizar = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const INDICE = new Map(Object.keys(POR_TEMA).map((t) => [normalizar(t), t]));

/* Quantos temas cada coringa aprovou na prova: o que mais serve vem primeiro. */
const forca = (c: string) => CORINGAS[c]?.prova.aprovados ?? 0;

export function autoresNoTema(tema: string): AutorNoTema[] | null {
  const chave = INDICE.get(normalizar(tema));
  if (!chave) return null;
  return Object.entries(POR_TEMA[chave])
    .map(([coringa, v]) => ({ coringa, ...v }))
    .sort((a, b) => Number(b.serve) - Number(a.serve) || forca(b.coringa) - forca(a.coringa));
}
