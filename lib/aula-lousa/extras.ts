// Telas que o texto da aula não traz sozinho (achados do aluno-do-zero, 25/11/2026): o desenho do
// passo, o que é volume e de onde vêm o ⅓ e o 4/3, e a resposta escrita no quadro.
// Função pura: texto e visual entram, telas saem.
import type { Cena, Cor, Desenho, Fala } from './tipos';
import { fala, linhas, titulo, tx } from './pincel';

/** O passo traz um desenho pronto do site (components/visual/diagramas.tsx): ele vira uma tela. */
export function telaDaFigura(visual: Record<string, unknown> | null, falaDaTela: Fala[]): Cena | null {
  if (visual?.tipo !== 'diagrama' || typeof visual.nome !== 'string') return null;
  const rotulos = Array.isArray(visual.rotulos) ? visual.rotulos.filter((r): r is string => typeof r === 'string') : [];
  return { tipo: 'figura', nome: visual.nome, ...(rotulos.length ? { rotulos } : {}), fala: falaDaTela };
}

type Linhas = readonly (readonly [string, Cor, number])[];

const conceito = (titulo: string, itens: Linhas, ...frases: string[]): Cena => linhas(titulo, itens, fala(...frases));

const VOLUME = conceito(
  'o que é volume',
  [['volume = quanto cabe dentro', 'tinta', 26], ['1 cm³ = cubinho de lado 1 cm', 'azul', 24], ['10 cm³ = 10 cubinhos', 'verde', 28]],
  'Volume é quanto cabe dentro de um objeto.',
  'A medida é o cm³: um cubinho com 1 cm de cada lado.',
);

const traco = (d: string, cor: Cor, t: number): Desenho => ({ k: 'caminho', d, cor, t, dur: 0.6, larg: 3 });
const oval = (cx: number, cy: number, rx: number, ry: number): string => `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy}`;
const cilindro = (cx: number, cor: Cor, t: number): Desenho[] => [traco(oval(cx, 70, 32, 9), cor, t), traco(`M${cx - 32},70 L${cx - 32},150 M${cx + 32},70 L${cx + 32},150`, cor, t + 0.3), traco(oval(cx, 150, 32, 9), cor, t + 0.6)];
const cone = (cx: number, t: number): Desenho[] => [traco(`M${cx},70 L${cx - 28},150 M${cx},70 L${cx + 28},150`, 'azul', t), traco(oval(cx, 150, 28, 8), 'azul', t + 0.3)];
const piramide = (cx: number, t: number): Desenho[] => [traco(`M${cx - 28},150 L${cx + 14},150 L${cx + 28},136 L${cx - 14},136 Z`, 'azul', t), traco(`M${cx},70 L${cx - 28},150 M${cx},70 L${cx + 14},150 M${cx},70 L${cx + 28},136`, 'azul', t + 0.3)];
const prisma = (cx: number, t: number): Desenho[] => [traco(`M${cx - 30},84 L${cx + 14},84 L${cx + 14},150 L${cx - 30},150 Z`, 'verde', t), traco(`M${cx - 30},84 L${cx - 12},70 L${cx + 32},70 L${cx + 32},136 L${cx + 14},150 M${cx + 14},84 L${cx + 32},70`, 'verde', t + 0.4)];

/** Três pontas iguais enchem um corpo reto de mesma base e altura: desenhado, com a conta embaixo. */
function telaDoTerco(ponta: (cx: number, t: number) => Desenho[], corpo: Desenho[], nomes: { um: string; tres: string; corpo: string; artigo: string }): Cena {
  return {
    tipo: 'lousa',
    fala: fala(
      `Enchendo ${nomes.artigo} ${nomes.corpo} com ${nomes.um} de mesma base e mesma altura, cabem 3.`,
      `Por isso ${nomes.um} é um terço ${nomes.artigo === 'uma' ? 'da' : 'do'} ${nomes.corpo}. O sinal ⅓ é dividir por 3.`,
    ),
    desenho: [
      titulo('de onde vem o ⅓'),
      ...[50, 120, 190].flatMap((cx, i) => ponta(cx, 0.8 + i * 0.8)),
      tx(255, 120, '=', 'tinta', 36, 3.4),
      ...corpo,
      tx(200, 185, `3 ${nomes.tres} = 1 ${nomes.corpo}`, 'tinta', 22, 4.8),
      tx(200, 222, `${nomes.um.split(' ')[1]} = ${nomes.corpo} ÷ 3`, 'verde', 28, 5.6),
      tx(200, 258, `ex.: ${nomes.corpo} 30, ${nomes.um.split(' ')[1]} 10`, 'cinza', 22, 6.4),
    ],
  };
}

const TERCO_DO_CONE = telaDoTerco(cone, cilindro(330, 'verde', 3.8), { um: 'um cone', tres: 'cones cheios', corpo: 'cilindro', artigo: 'um' });
const TERCO_DA_PIRAMIDE = telaDoTerco(piramide, prisma(330, 3.8), { um: 'uma pirâmide', tres: 'pirâmides cheias', corpo: 'prisma', artigo: 'um' });

const ESFERA: Cena[] = [
  {
    tipo: 'lousa',
    fala: fala(
      'Ponha a bola dentro de um cilindro justo: o raio é o mesmo e a altura é o diâmetro, 2 r.',
      'São três r multiplicando, que se escreve r³, e um 2.',
    ),
    desenho: [
      titulo('de onde vem o 4/3'),
      traco(oval(200, 62, 52, 10), 'tinta', 0.8), traco('M148,62 L148,166 M252,62 L252,166', 'tinta', 1.2), traco(oval(200, 166, 52, 10), 'tinta', 1.6),
      { k: 'circ', cx: 200, cy: 114, r: 50, cor: 'azul', t: 2.2 },
      { k: 'linha', x1: 200, y1: 114, x2: 250, y2: 114, cor: 'vermelho', t: 2.8, dur: 0.4 },
      tx(226, 108, 'r', 'vermelho', 22, 3.0), tx(288, 122, '2r', 'tinta', 24, 3.4),
      tx(200, 218, 'cilindro = π · r · r · 2r', 'verde', 26, 4.2),
      tx(200, 256, 'cilindro = 2 · π · r³', 'verde', 26, 5.2),
    ],
  },
  conceito(
    'de onde vem o 4/3 (2)',
    [['a bola ocupa 2/3 do cilindro', 'tinta', 26], ['Arquimedes, há mais de 2 mil anos', 'cinza', 20], ['bola = 2/3 · 2 · π · r³', 'verde', 28], ['bola = 4/3 · π · r³', 'verde', 28]],
    'A bola ocupa dois terços desse cilindro. Arquimedes descobriu isso há mais de 2 mil anos.',
    'Dois terços vezes 2: o 2 multiplica o de cima, 2 vezes 2 dá 4. Fica 4 terços.',
  ),
];

/** Telas "de onde vem" para as fórmulas de volume da 1ª tela da aula. */
export function telasDosConceitos(itens: Record<string, unknown>[]): Cena[] {
  const escritos = itens.map((i) => `${String(i.nome ?? '')} ${String(i.formula ?? '')}`);
  const volumes = escritos.filter((s) => /volume/i.test(s));
  if (!volumes.length) return [];
  const tem = (solido: RegExp, fator: string): boolean => volumes.some((s) => solido.test(s) && s.includes(fator));
  return [
    VOLUME,
    ...(tem(/\bcone\b/i, '⅓') || tem(/\bcone\b/i, '1/3') ? [TERCO_DO_CONE] : []),
    ...(tem(/pir[âa]mide/i, '⅓') || tem(/pir[âa]mide/i, '1/3') ? [TERCO_DA_PIRAMIDE] : []),
    ...(tem(/esfera|bola/i, '4/3') ? ESFERA : []),
  ];
}

const RESPOSTA = /(?:Resposta:\s*(?:alternativa|letra)|Letra)\s+([A-E])\b/i;
const LARGURA_UTIL = 360;
const LARGURA_DA_LETRA = 0.4; // mesma estimativa de pincel.ts
const Y_DA_PRIMEIRA = 76;
const ENTRE_ALTERNATIVAS = 38;
const Y_DA_FRASE = 268;
const tamanhoQueCabe = (s: string): number => Math.max(14, Math.min(26, Math.floor(LARGURA_UTIL / (s.length * LARGURA_DA_LETRA))));

const LETRAS_POR_LINHA = 36;
const MAX_LETRAS_NA_LISTA = 44; // acima disso as 5 em lista ficam miúdas e cortadas

const emLinhas = (s: string): string[] =>
  s.split(' ').reduce<string[]>((feitas, p) => {
    const ultima = feitas[feitas.length - 1];
    return ultima && `${ultima} ${p}`.length <= LETRAS_POR_LINHA ? [...feitas.slice(0, -1), `${ultima} ${p}`] : [...feitas, p];
  }, []);

/** Alternativas curtas: as 5, a certa em verde. Compridas: só o texto da certa, em linhas. */
function opcoesNoQuadro(alternativas: string[], letra: string): Desenho[] {
  const cinco = alternativas.slice(0, 5).map((valor, i) => ({ s: `${'ABCDE'[i]}: ${valor}`, certa: 'ABCDE'[i] === letra }));
  const itens = cinco.every((o) => o.s.length <= MAX_LETRAS_NA_LISTA) ? cinco : emLinhas(cinco.find((o) => o.certa)!.s).slice(0, 5).map((s) => ({ s, certa: true }));
  return itens.map((o, i) => tx(200, Y_DA_PRIMEIRA + i * ENTRE_ALTERNATIVAS, o.s, o.certa ? 'verde' : 'cinza', tamanhoQueCabe(o.s), 0.8 + i * 0.3));
}

/** Fim da conta: as alternativas no quadro, a certa em verde, antes da "questão parecida". */
export function comResposta(cenas: Cena[], textoDoPasso: string, alternativas: string[]): Cena[] {
  const letra = textoDoPasso.match(RESPOSTA)?.[1]?.toUpperCase();
  if (!letra || !alternativas['ABCDE'.indexOf(letra)]) return cenas;
  const dita = `Resposta: alternativa ${letra}`;
  const tela: Cena = { tipo: 'lousa', fala: fala(`${dita}.`), desenho: [titulo('resposta'), ...opcoesNoQuadro(alternativas, letra), tx(200, Y_DA_FRASE, dita, 'verde', 24, 2.6)] };
  const pista = cenas.findIndex((c) => c.tipo === 'lousa' && c.desenho.some((d) => d.k === 'tx' && d.s.startsWith('questão parecida')));
  const fim = pista < 0 ? cenas.length : pista;
  return [...cenas.slice(0, fim), tela, ...cenas.slice(fim)];
}
