// "Planejar com os quartetos" (Pablo, 07/11/2026): aparece um tema real do
// ENEM, ele escreve com as palavras dele quem vai em cada parte ("Drummond no
// começo, Rui na argumentação e Dom Hélder na segunda") e o site avalia.
// Sem IA: o veredito é a prova dos coringas nos 28 temas
// (coringas-por-tema.json, a mesma fonte da aba Exemplo).

import dados from './coringas-por-tema.json';
import { QUARTETOS } from './cartoes-quartetos';

export const PARTES = ['introducao', 'd1', 'd2'] as const;
export type Parte = (typeof PARTES)[number];
export const NOME_DA_PARTE: Record<Parte, string> = {
  introducao: 'Introdução',
  d1: '1º argumento',
  d2: '2º argumento',
};

export const AUTORES_DO_PLANO = ['Drummond', 'Rui Barbosa', 'Dom Hélder', 'Graciliano', 'Galeano'] as const;
export type AutorDoPlano = (typeof AUTORES_DO_PLANO)[number];

/* Onde cada autor fica no quarteto dele. */
const LUGAR_CERTO: Record<AutorDoPlano, Parte> = {
  Drummond: 'introducao',
  'Rui Barbosa': 'd1',
  Graciliano: 'd1',
  'Dom Hélder': 'd2',
  Galeano: 'd2',
};

const APELIDOS: Record<AutorDoPlano | 'Pacto', string[]> = {
  Drummond: ['drummond', 'lirio', 'leis nao bastam'],
  'Rui Barbosa': ['rui', 'barbosa', 'oracao aos mocos'],
  'Dom Hélder': ['helder', 'dom h'],
  Graciliano: ['graciliano', 'fabiano', 'vidas secas'],
  Galeano: ['galeano', 'ninguens'],
  Pacto: ['pacto'],
};

/* A ordem importa: "segunda argumentação" tem "argument" e é o 2º. */
const MARCAS_DE_PARTE: [Parte, RegExp][] = [
  ['d2', /\b(segund\w*|2|d2|ultim\w*)\b/],
  ['d1', /\b(primeir\w*|1|d1|argument\w*|desenvolv\w*)\b/],
  ['introducao', /\b(introdu\w*|comec\w*|inicio|abert\w*|abre|abrir)\b/],
];

type Veredito = { serve: boolean; ligacao?: string };
const POR_TEMA = dados as Record<string, Record<string, Veredito>>;

export const TEMAS_DO_PLANO: string[] = Object.keys(POR_TEMA);

export const normalizar = (t: string): string =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

function autoresNoTrecho(trecho: string): (AutorDoPlano | 'Pacto')[] {
  const achados = (Object.keys(APELIDOS) as (AutorDoPlano | 'Pacto')[])
    .map((a) => ({ a, pos: Math.min(...APELIDOS[a].map((ap) => {
      const i = ` ${trecho} `.indexOf(` ${ap}`);
      return i < 0 ? Infinity : i;
    })) }))
    .filter((x) => x.pos !== Infinity)
    .sort((x, y) => x.pos - y.pos);
  return achados.map((x) => x.a);
}

/* "quarteto 1" não é "1º argumento". */
const parteDoTrecho = (trecho: string): Parte | null => {
  const limpo = trecho.replace(/\bquartetos? \d\b/g, ' ');
  return MARCAS_DE_PARTE.find(([, re]) => re.test(limpo))?.[0] ?? null;
};

export interface PlanoLido {
  partes: Partial<Record<Parte, AutorDoPlano>>;
  citouPacto: boolean;
  /* Autor citado duas vezes ou sem lugar livre. */
  sobrando: AutorDoPlano[];
}

/* Lê o plano escrito à vontade. Trecho com a parte dita ("no começo",
 * "na segunda") manda; o resto preenche as partes livres na ordem do texto. */
export function lerPlano(texto: string): PlanoLido {
  const trechos = texto.split(/[.;,\n]| e /i).map(normalizar).filter(Boolean);
  const partes: Partial<Record<Parte, AutorDoPlano>> = {};
  const semParte: AutorDoPlano[] = [];
  const sobrando: AutorDoPlano[] = [];
  const vistos = new Set<AutorDoPlano>();
  let citouPacto = false;
  let parteGuardada: Parte | null = null;

  for (const trecho of trechos) {
    const autores = autoresNoTrecho(` ${trecho} `.replace(/\s+/g, ' ').trim());
    const parte = parteDoTrecho(trecho);
    if (autores.includes('Pacto')) citouPacto = true;
    const coringas = autores.filter((a): a is AutorDoPlano => a !== 'Pacto' && !vistos.has(a));
    if (coringas.length === 0) {
      /* "no segundo, Galeano": a parte vem antes do nome, no trecho anterior. */
      if (parte) parteGuardada = parte;
      continue;
    }
    const alvo = parte ?? parteGuardada;
    parteGuardada = null;
    for (const a of coringas) {
      vistos.add(a);
      if (alvo && !partes[alvo]) partes[alvo] = a;
      else semParte.push(a);
    }
  }
  for (const a of semParte) {
    const livre = PARTES.find((p) => !partes[p]);
    if (livre) partes[livre] = a;
    else sobrando.push(a);
  }
  return { partes, citouPacto, sobrando };
}

export interface ParteAvaliada {
  parte: Parte;
  autor: AutorDoPlano | null;
  serve: boolean;
  /* Ex.: "No quarteto dele, o Rui vai no 1º argumento." */
  aviso?: string;
}

export interface Avaliacao {
  certo: boolean;
  titulo: string;
  partes: ParteAvaliada[];
  dicas: string[];
  /* Quartetos que servem neste tema (1, 2 ou nenhum). */
  quartetosQueServem: (1 | 2)[];
  /* Exemplo de ligação com o tema para cada autor que serve no plano. */
  ligacoes: { autor: AutorDoPlano; texto: string }[];
}

export const serveNoTema = (tema: string, autor: AutorDoPlano): boolean => POR_TEMA[tema]?.[autor]?.serve === true;

export function quartetosQueServem(tema: string): (1 | 2)[] {
  return ([1, 2] as const).filter((n) => {
    const q = QUARTETOS[n];
    const d1 = q.d1 as AutorDoPlano;
    const d2 = q.d2 as AutorDoPlano;
    return serveNoTema(tema, 'Drummond') && serveNoTema(tema, d1) && serveNoTema(tema, d2);
  });
}

export function respostaSugerida(tema: string): string {
  const qs = quartetosQueServem(tema);
  if (qs.length > 0) {
    const q = QUARTETOS[qs[0]];
    return `Quarteto ${qs[0]}: Pacto + Drummond na introdução, ${q.d1} no 1º argumento, ${q.d2} no 2º.`;
  }
  const servem = AUTORES_DO_PLANO.filter((a) => a !== 'Drummond' && serveNoTema(tema, a));
  if (servem.length === 0) return 'Neste tema, nenhum dos 5 passou além do Drummond.';
  return `Misture: Pacto + Drummond na introdução e ${servem.slice(0, 2).join(' e ')} nos argumentos.`;
}

export function avaliarPlano(tema: string, texto: string): Avaliacao | null {
  if (!POR_TEMA[tema]) return null;
  const { partes, citouPacto, sobrando } = lerPlano(texto);
  const avaliadas: ParteAvaliada[] = PARTES.map((parte) => {
    const autor = partes[parte] ?? null;
    if (!autor) return { parte, autor, serve: false };
    const lugar = LUGAR_CERTO[autor];
    const aviso = lugar !== parte
      ? (autor === 'Drummond' || parte === 'introducao'
        ? `O Drummond abre o texto: ele vai na introdução.`
        : `Pode, mas no quarteto dele ${autor} vai no ${NOME_DA_PARTE[lugar]}.`)
      : undefined;
    return { parte, autor, serve: serveNoTema(tema, autor), aviso };
  });

  const qs = quartetosQueServem(tema);
  const faltando = avaliadas.filter((p) => !p.autor);
  const naoServem = avaliadas.filter((p) => p.autor && !p.serve);
  const drummondFora = avaliadas.some((p) => p.autor === 'Drummond' && p.parte !== 'introducao');
  const certo = faltando.length === 0 && naoServem.length === 0 && !drummondFora;

  const dicas: string[] = [];
  if (faltando.length === 3) dicas.push('Não achei nenhum dos 5 autores. Escreva o nome deles: Drummond, Rui Barbosa, Dom Hélder, Graciliano ou Galeano.');
  else if (faltando.length > 0) dicas.push(`Faltou dizer quem vai no ${faltando.map((p) => NOME_DA_PARTE[p.parte]).join(' e no ')}.`);
  for (const p of naoServem) dicas.push(`${p.autor} não passou neste tema: troque.`);
  if (!citouPacto && faltando.length < 3) dicas.push('Lembre do Pacto junto com o Drummond na introdução.');
  if (sobrando.length > 0) dicas.push(`Sobrou: ${sobrando.join(', ')}. Cada parte leva um autor.`);

  const usados = avaliadas.map((p) => p.autor);
  const ehQuarteto = qs.find((n) => usados[1] === QUARTETOS[n].d1 && usados[2] === QUARTETOS[n].d2 && usados[0] === 'Drummond');
  const titulo = certo
    ? `Boa ideia: dá certo.${ehQuarteto ? ` É o Quarteto ${ehQuarteto}.` : ''}`
    : faltando.length === 3 ? 'Não entendi o plano.' : 'Quase. Ajuste o que está marcado.';

  const ligacoes = avaliadas
    .filter((p): p is ParteAvaliada & { autor: AutorDoPlano } => !!p.autor && p.serve && !!POR_TEMA[tema][p.autor]?.ligacao)
    .map((p) => ({ autor: p.autor, texto: POR_TEMA[tema][p.autor].ligacao! }));

  return { certo, titulo, partes: avaliadas, dicas, quartetosQueServem: qs, ligacoes };
}
