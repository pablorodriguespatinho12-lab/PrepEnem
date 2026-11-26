// Telas que o texto da aula não traz sozinho (achados do aluno-do-zero, 25/11/2026): o desenho do
// passo, o que é volume e de onde vêm o ⅓ e o 4/3, e a resposta escrita no quadro.
// Função pura: texto e visual entram, telas saem.
import type { Cena, Cor, Fala } from './tipos';
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

const TERCO_DO_CONE = conceito(
  'de onde vem o ⅓',
  [['3 cones cheios = 1 cilindro', 'tinta', 26], ['mesma base, mesma altura', 'cinza', 24], ['cone = cilindro ÷ 3', 'verde', 28], ['ex.: cilindro 30, cone 10', 'verde', 26]],
  'Enchendo um cilindro com um cone de mesma base e mesma altura, cabem 3 cones.',
  'Por isso o cone é um terço do cilindro. O sinal ⅓ é dividir por 3.',
);

const TERCO_DA_PIRAMIDE = conceito(
  'de onde vem o ⅓',
  [['3 pirâmides cheias = 1 prisma', 'tinta', 26], ['mesma base, mesma altura', 'cinza', 24], ['pirâmide = prisma ÷ 3', 'verde', 28], ['ex.: prisma 30, pirâmide 10', 'verde', 26]],
  'Enchendo um prisma com uma pirâmide de mesma base e mesma altura, cabem 3 pirâmides.',
  'Por isso a pirâmide é um terço do prisma. O sinal ⅓ é dividir por 3.',
);

const ESFERA: Cena[] = [
  conceito(
    'de onde vem o 4/3',
    [['bola dentro de um cilindro justo', 'tinta', 24], ['altura do cilindro = 2 · r', 'azul', 24], ['cilindro = π · r · r · 2r', 'verde', 28], ['cilindro = 2 · π · r³', 'verde', 28]],
    'Ponha a bola dentro de um cilindro justo: o raio é o mesmo e a altura é o diâmetro, 2 r.',
    'São três r multiplicando, que se escreve r³, e um 2.',
  ),
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

const MAX_LETRAS_DA_RESPOSTA = 36;
const RESPOSTA = /(?:Resposta:\s*(?:alternativa|letra)|Letra)\s+([A-E])\b/i;

const Y_DA_RESPOSTA = 262;
const Y_DA_RESPOSTA_SOZINHA = 150;
const MAIS_BAIXO_QUE_CABE = 214; // texto abaixo disso encostaria na resposta
const SEGUNDOS_ATE_A_RESPOSTA = 1.2;

/** Fim da conta: a resposta escrita no quadro. Entra no pé da última tela da conta; sem espaço, ganha tela. */
export function comResposta(cenas: Cena[], textoDoPasso: string, alternativas: string[]): Cena[] {
  const letra = textoDoPasso.match(RESPOSTA)?.[1]?.toUpperCase();
  const valor = letra ? alternativas['ABCDE'.indexOf(letra)] : undefined;
  if (!letra || !valor) return cenas;
  const dita = `Resposta: alternativa ${letra}`;
  const completa = `${dita}: ${valor}`;
  const frase = completa.length <= MAX_LETRAS_DA_RESPOSTA ? completa : dita;
  const pista = cenas.findIndex((c) => c.tipo === 'lousa' && c.desenho.some((d) => d.k === 'tx' && d.s.startsWith('questão parecida')));
  const fim = pista < 0 ? cenas.length : pista;
  const ultima = cenas[fim - 1];
  const cabe = ultima?.tipo === 'lousa' && ultima.desenho.every((d) => d.k === 'tx' && d.y <= MAIS_BAIXO_QUE_CABE || d.k === 'linha' && Math.max(d.y1, d.y2) <= MAIS_BAIXO_QUE_CABE);
  if (!cabe) return [...cenas.slice(0, fim), { tipo: 'lousa' as const, fala: fala(`${dita}.`), desenho: [titulo('resposta'), tx(200, Y_DA_RESPOSTA_SOZINHA, frase, 'verde', 28, 0.8)] }, ...cenas.slice(fim)];
  const t = Math.max(...ultima.desenho.map((d) => ('t' in d ? d.t : 0))) + SEGUNDOS_ATE_A_RESPOSTA;
  const comEla: Cena = { ...ultima, desenho: [...ultima.desenho, tx(200, Y_DA_RESPOSTA, frase, 'verde', 24, t)] };
  return cenas.map((c, i) => (i === fim - 1 ? comEla : c));
}
