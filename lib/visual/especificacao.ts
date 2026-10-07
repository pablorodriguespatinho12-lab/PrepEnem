// O que a IA pode pedir para desenhar. A IA nunca manda imagem nem SVG: manda
// esta descrição, e o app desenha (components/visual). Tudo que chega da IA
// passa por `validarVisual`, que descarta o que não dá para desenhar certo.

import { tentarCompilar } from './expressao';

/* Cores semânticas: a mesma cor marca o termo na explicação e a parte do
   desenho (sinalização de Mayer). 'erro' é só para o caminho errado. */
export type CorVisual = 'a' | 'b' | 'c' | 'erro';

/* "aberto": bolinha vazia, o furo onde a função não tem valor (limites, c1/c2). */
export interface PontoRotulado { x: number; y: number; rotulo?: string; cor?: CorVisual; aberto?: boolean }

export interface VisualGrafico {
  tipo: 'grafico';
  titulo?: string;
  funcoes: { expr: string; rotulo?: string; cor?: CorVisual }[];
  pontos?: PontoRotulado[];
  x: [number, number];
  y?: [number, number];
}

export interface VisualReta {
  tipo: 'reta';
  titulo?: string;
  de: number;
  ate: number;
  marcas?: { x: number; rotulo?: string; cor?: CorVisual }[];
  trechos?: { de: number; ate: number; rotulo?: string; cor?: CorVisual; fechadoDe?: boolean; fechadoAte?: boolean }[];
}

export interface VisualTransformacao {
  tipo: 'transformacao';
  titulo?: string;
  linhas: { latex: string; porque?: string }[];
}

export interface VisualTabela {
  tipo: 'tabela';
  titulo?: string;
  cabecalho: string[];
  linhas: string[][];
}

export interface VisualVetores {
  tipo: 'vetores';
  titulo?: string;
  vetores: { de: [number, number]; para: [number, number]; rotulo?: string; cor?: CorVisual }[];
  pontos?: PontoRotulado[];
}

/* Cena com relógio: cada veículo anda pela própria função, x é o tempo e
   f(x) é o km onde ele está. Para ver uma função antes de ler a fórmula
   (pedido do Pablo, 06/10/2026). Nas lições escritas e, desde a mesma data,
   pedida pela IA nas explicações (ver FORMATO_VISUAL_PARA_IA). */
export type Veiculo = 'carro' | 'moto' | 'bola' | 'balao' | 'vela';
const VEICULOS: Veiculo[] = ['carro', 'moto', 'bola', 'balao', 'vela'];
/* Carro e moto andam para o lado; bola e balão sobem e descem; a vela
   encolhe. Uma cena tem uma direção só. */
export const ehVertical = (v: Veiculo): boolean => v === 'bola' || v === 'balao' || v === 'vela';
export interface VisualCena {
  tipo: 'cena';
  titulo?: string;
  x: [number, number];
  unidadeX?: string;
  unidadeY?: string;
  /* O gráfico se desenha ponto a ponto, conforme o relógio anda. */
  rastro?: boolean;
  /* Mostra a velocidade no instante (a derivada) ao lado da posição: c4 em diante. */
  velocimetro?: boolean;
  /* O que cada pedaço da equação é, em 2 a 4 linhas curtas embaixo dela
     ("5 → km por minuto"). Sem legenda, mostra o que x e f(x) medem. */
  legenda?: { termo: string; diz: string }[];
  veiculos: { veiculo: Veiculo; nome: string; expr: string; rotulo?: string; cor?: CorVisual }[];
}
/* Ponto girando num círculo: o cosseno é a sombra no chão, o seno é a altura
   (lição p9). Com raio e centro vira roda-gigante: altura da cadeira =
   centro + raio · sen θ (lição p10). "grafico" desenrola a altura ao lado. */
export interface VisualRoda {
  tipo: 'roda';
  titulo?: string;
  divisoes: number;
  raio: number;
  centro: number;
  voltas: number;
  unidade?: string;
  grafico?: boolean;
}
/* Retângulo que cresce com o relógio: base e altura mudam juntas e a área
   nova aparece como duas faixas e um canto (regra do produto, c6). */
export interface VisualRetangulo {
  tipo: 'retangulo';
  titulo?: string;
  x: [number, number];
  base: string;
  altura: string;
  unidade?: string;
  /* Faixas da regra do produto (c6). Desligadas quando um lado encolhe,
     como na cerca de perímetro fixo (otimização, c10). */
  faixas: boolean;
}
/* Área sob a curva como soma de retângulos que afinam (integral, c11). */
export interface VisualFatias {
  tipo: 'fatias';
  titulo?: string;
  expr: string;
  x: [number, number];
  maxFatias: number;
  unidadeX?: string;
  unidadeY?: string;
}
/* Processo em etapas (fotossíntese, respiração, digestão): o que entra, o
   que sai e o que passa de uma etapa para a outra. Pedido do Pablo em
   06/10/2026: "mostrar esse processo em desenho, não em texto". Animado:
   as moléculas andam pelas setas. */
export interface VisualProcesso {
  tipo: 'processo';
  titulo?: string;
  etapas: { nome: string; entra: string[]; sai: string[] }[];
  ligacoes: { de: number; para: number; leva: string }[];
}
/* Molécula como mapa mental (Pablo, 07/10/2026, opção A): átomos de verdade
   (núcleo e elétrons nas camadas), linha de cada um até a etiqueta com a massa
   e, com "soma", a conta da massa da molécula embaixo. O primeiro átomo fica
   no meio; os outros, em volta dele. */
export interface VisualMolecula {
  tipo: 'molecula';
  titulo?: string;
  nome?: string;
  atomos: { simbolo: string; massa?: number }[];
  soma?: boolean;
}
/* Palavra em destaque (Português: acento, sílaba, grafia). A palavra grande,
   separada em sílabas, com a parte que importa circulada e uma nota pequena
   (Pablo, 07/10/2026: "a palavra baú, o círculo no u, e embaixo: é acentuado
   por causa do hiato"). */
export interface VisualPalavra {
  tipo: 'palavra';
  titulo?: string;
  palavra: string;
  silabas?: string[];
  destaque?: string;
  nota?: string;
}
export type Visual = VisualPalavra | VisualGrafico | VisualReta | VisualTransformacao | VisualTabela | VisualVetores | VisualCena | VisualRoda | VisualRetangulo | VisualFatias | VisualProcesso | VisualMolecula;

const MAX_FUNCOES = 4;
const MAX_PONTOS = 8;
const MAX_LINHAS = 8;
const MAX_VETORES = 6;
const LIMITE_EIXO = 1e6;

const ehNumero = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) <= LIMITE_EIXO;
const texto = (v: unknown, max = 160): string | undefined =>
  typeof v === 'string' && v.trim().length > 0 ? v.trim().slice(0, max) : undefined;
const cor = (v: unknown): CorVisual | undefined =>
  v === 'a' || v === 'b' || v === 'c' || v === 'erro' ? v : undefined;
const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const objeto = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});

function intervalo(v: unknown): [number, number] | undefined {
  const [a, b] = lista(v);
  return ehNumero(a) && ehNumero(b) && a < b ? [a, b] : undefined;
}

function ponto(v: unknown): PontoRotulado | null {
  const p = objeto(v);
  if (!ehNumero(p.x) || !ehNumero(p.y)) return null;
  const base = { x: p.x, y: p.y, rotulo: texto(p.rotulo, 40), cor: cor(p.cor) };
  return p.aberto === true ? { ...base, aberto: true } : base;
}

const naoNulo = <T,>(v: T | null): v is T => v !== null;

function grafico(v: Record<string, unknown>): VisualGrafico | null {
  const x = intervalo(v.x);
  if (!x) return null;
  const funcoes = lista(v.funcoes)
    .map(objeto)
    .filter((f) => typeof f.expr === 'string' && tentarCompilar(f.expr) !== null)
    .slice(0, MAX_FUNCOES)
    .map((f) => ({ expr: String(f.expr), rotulo: texto(f.rotulo, 40), cor: cor(f.cor) }));
  const pontos = lista(v.pontos).map(ponto).filter(naoNulo).slice(0, MAX_PONTOS);
  if (funcoes.length === 0 && pontos.length === 0) return null;
  return { tipo: 'grafico', titulo: texto(v.titulo), funcoes, pontos, x, y: intervalo(v.y) };
}

function reta(v: Record<string, unknown>): VisualReta | null {
  if (!ehNumero(v.de) || !ehNumero(v.ate) || v.de >= v.ate) return null;
  const marcas = lista(v.marcas).map(objeto).filter((m) => ehNumero(m.x))
    .slice(0, MAX_PONTOS).map((m) => ({ x: m.x as number, rotulo: texto(m.rotulo, 30), cor: cor(m.cor) }));
  const trechos = lista(v.trechos).map(objeto).filter((t) => ehNumero(t.de) && ehNumero(t.ate) && (t.de as number) <= (t.ate as number))
    .slice(0, 4).map((t) => ({
      de: t.de as number, ate: t.ate as number, rotulo: texto(t.rotulo, 30), cor: cor(t.cor),
      fechadoDe: t.fechadoDe !== false, fechadoAte: t.fechadoAte !== false,
    }));
  return { tipo: 'reta', titulo: texto(v.titulo), de: v.de, ate: v.ate, marcas, trechos };
}

function transformacao(v: Record<string, unknown>): VisualTransformacao | null {
  const linhas = lista(v.linhas).map(objeto).filter((l) => texto(l.latex, 300))
    .slice(0, MAX_LINHAS).map((l) => ({ latex: texto(l.latex, 300)!, porque: texto(l.porque, 140) }));
  return linhas.length >= 2 ? { tipo: 'transformacao', titulo: texto(v.titulo), linhas } : null;
}

function tabela(v: Record<string, unknown>): VisualTabela | null {
  const cabecalho = lista(v.cabecalho).map((c) => texto(c, 40) ?? '').slice(0, 5);
  if (cabecalho.length < 2) return null;
  const linhas = lista(v.linhas).map((l) => lista(l).map((c) => (typeof c === 'number' ? String(c) : texto(c, 60) ?? '')))
    .filter((l) => l.length === cabecalho.length).slice(0, MAX_LINHAS);
  return linhas.length > 0 ? { tipo: 'tabela', titulo: texto(v.titulo), cabecalho, linhas } : null;
}

function vetores(v: Record<string, unknown>): VisualVetores | null {
  const ehPar = (p: unknown): p is [number, number] => lista(p).length === 2 && lista(p).every(ehNumero);
  const vs = lista(v.vetores).map(objeto).filter((x) => ehPar(x.de) && ehPar(x.para)).slice(0, MAX_VETORES)
    .map((x) => ({ de: x.de as [number, number], para: x.para as [number, number], rotulo: texto(x.rotulo, 30), cor: cor(x.cor) }));
  if (vs.length === 0) return null;
  return { tipo: 'vetores', titulo: texto(v.titulo), vetores: vs, pontos: lista(v.pontos).map(ponto).filter(naoNulo).slice(0, MAX_PONTOS) };
}

const MAX_VEICULOS = 2;
const NOMES_PADRAO = ['f', 'g'];
const MAX_MINUTOS = 20;
/* Na vertical, altura negativa é atravessar o chão: a IA pede relógio longo
   demais numa queda. Corta no último instante em que alguém ainda está no
   chão ou acima. Na horizontal, posição negativa é legítima (largada atrás). */
function aparar(x: [number, number], veiculos: VisualCena['veiculos']): [number, number] {
  if (!ehVertical(veiculos[0].veiculo)) return x;
  const fns = veiculos.map((w) => tentarCompilar(w.expr)!);
  if (fns.some((f) => f(x[0]) < 0)) return x;
  let fim = x[0];
  for (let t = x[0] + 1; t <= x[1] && fns.some((f) => f(t) >= 0); t++) fim = t;
  return fim > x[0] ? [x[0], fim] : x;
}
const MAX_LEGENDA = 4;
function legenda(v: unknown): VisualCena['legenda'] {
  const itens = lista(v).map(objeto)
    .map((l) => ({ termo: texto(l.termo, 20), diz: texto(l.diz, 50) }))
    .filter((l): l is { termo: string; diz: string } => !!l.termo && !!l.diz)
    .slice(0, MAX_LEGENDA);
  return itens.length > 0 ? itens : undefined;
}
function cena(v: Record<string, unknown>): VisualCena | null {
  const x = intervalo(v.x);
  if (!x || !Number.isInteger(x[0]) || !Number.isInteger(x[1]) || x[1] - x[0] > MAX_MINUTOS) return null;
  // A IA inventa objetos ("pena", "pedra"): o que o app não desenha vira bola
  // e o nome dela vai para o rótulo, em vez de a cena inteira sumir.
  const conhecido = (w: Record<string, unknown>) => VEICULOS.includes(w.veiculo as Veiculo);
  const veiculos = lista(v.veiculos)
    .map(objeto)
    .filter((w) => typeof w.expr === 'string' && tentarCompilar(w.expr) !== null)
    .map((w) => (conhecido(w) ? w : { ...w, veiculo: 'bola', rotulo: w.rotulo ?? w.veiculo }))
    .filter((w, _i, todos) => ehVertical(w.veiculo as Veiculo) === ehVertical(todos[0].veiculo as Veiculo))
    .slice(0, MAX_VEICULOS)
    .map((w, i) => ({
      veiculo: w.veiculo as Veiculo,
      // A IA às vezes nomeia a função pelo objeto ("metal"); na tela vira "met(x)".
      nome: typeof w.nome === 'string' && /^[a-zA-Z]$/.test(w.nome.trim()) ? w.nome.trim() : NOMES_PADRAO[i],
      expr: String(w.expr),
      rotulo: texto(w.rotulo, 40),
      cor: cor(w.cor),
    }));
  if (veiculos.length === 0) return null;
  return { tipo: 'cena', titulo: texto(v.titulo), x: aparar(x, veiculos), unidadeX: texto(v.unidadeX, 12), unidadeY: texto(v.unidadeY, 12), rastro: v.rastro === true, velocimetro: v.velocimetro === true, legenda: legenda(v.legenda), veiculos };
}
const DIVISOES = [4, 24] as const;
const MAX_VOLTAS = 3;
function roda(v: Record<string, unknown>): VisualRoda | null {
  const divisoes = Number(v.divisoes);
  if (!Number.isInteger(divisoes) || divisoes < DIVISOES[0] || divisoes > DIVISOES[1]) return null;
  const raio = v.raio === undefined ? 1 : v.raio;
  const centro = v.centro === undefined ? 0 : v.centro;
  if (!ehNumero(raio) || raio <= 0 || !ehNumero(centro)) return null;
  const voltas = Math.min(MAX_VOLTAS, Math.max(1, Math.round(Number(v.voltas) || 1)));
  return { tipo: 'roda', titulo: texto(v.titulo), divisoes, raio, centro, voltas, unidade: texto(v.unidade, 12), grafico: v.grafico === true };
}
function retangulo(v: Record<string, unknown>): VisualRetangulo | null {
  const x = intervalo(v.x);
  if (!x || !Number.isInteger(x[0]) || !Number.isInteger(x[1]) || x[1] - x[0] > MAX_MINUTOS) return null;
  if (typeof v.base !== 'string' || typeof v.altura !== 'string') return null;
  const base = tentarCompilar(v.base);
  const altura = tentarCompilar(v.altura);
  if (!base || !altura) return null;
  for (let t = x[0]; t <= x[1]; t++) {
    const lados = [base(t), altura(t)];
    if (lados.some((l) => !Number.isFinite(l) || l < 0)) return null;
  }
  return { tipo: 'retangulo', titulo: texto(v.titulo), x, base: v.base, altura: v.altura, unidade: texto(v.unidade, 12), faixas: v.faixas !== false };
}
const MAX_FATIAS = 50;
function fatias(v: Record<string, unknown>): VisualFatias | null {
  const x = intervalo(v.x);
  if (!x || typeof v.expr !== 'string' || !tentarCompilar(v.expr)) return null;
  const maxFatias = Math.min(MAX_FATIAS, Math.max(2, Math.round(Number(v.maxFatias) || 20)));
  return { tipo: 'fatias', titulo: texto(v.titulo), expr: v.expr, x, maxFatias, unidadeX: texto(v.unidadeX, 12), unidadeY: texto(v.unidadeY, 12) };
}
const MAX_ETAPAS = 4;
const MAX_MOLECULAS = 4;
function processo(v: Record<string, unknown>): VisualProcesso | null {
  const nomes = (l: unknown) => lista(l).map((x) => texto(x, 24)).filter((x): x is string => Boolean(x)).slice(0, MAX_MOLECULAS);
  const etapas = lista(v.etapas).map(objeto)
    .map((e) => ({ nome: texto(e.nome, 30), entra: nomes(e.entra), sai: nomes(e.sai) }))
    .filter((e): e is { nome: string; entra: string[]; sai: string[] } => Boolean(e.nome))
    .slice(0, MAX_ETAPAS);
  // Processo forçado onde não há processo (a IA desenhou "Sustentação" sem nada
  // entrando nem saindo): melhor sem desenho do que com um que confunde.
  if (etapas.length === 0 || etapas.some((e) => e.entra.length === 0 && e.sai.length === 0)) return null;
  if (etapas.length === 1 && (etapas[0].entra.length === 0 || etapas[0].sai.length === 0)) return null;
  const indice = (n: unknown) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < etapas.length;
  const ligacoes = lista(v.ligacoes).map(objeto)
    .filter((l) => indice(l.de) && indice(l.para) && l.de !== l.para && texto(l.leva, 30))
    .slice(0, MAX_ETAPAS)
    .map((l) => ({ de: l.de as number, para: l.para as number, leva: texto(l.leva, 30)! }));
  return { tipo: 'processo', titulo: texto(v.titulo), etapas, ligacoes };
}
const MIN_ATOMOS = 2;
const MAX_ATOMOS = 6;
const MAX_MASSA = 300;
function molecula(v: Record<string, unknown>): VisualMolecula | null {
  const atomos = lista(v.atomos).map(objeto)
    .filter((a) => typeof a.simbolo === 'string' && /^[A-Z][a-z]?$/.test(a.simbolo.trim()))
    .map((a) => ({ simbolo: String(a.simbolo).trim(), massa: ehNumero(a.massa) && a.massa > 0 && a.massa < MAX_MASSA ? a.massa : undefined }))
    .slice(0, MAX_ATOMOS);
  if (atomos.length < MIN_ATOMOS) return null;
  // Soma só se todo átomo tem massa: senão a conta na tela sairia errada.
  const soma = v.soma === true && atomos.every((a) => a.massa !== undefined);
  return { tipo: 'molecula', titulo: texto(v.titulo), nome: texto(v.nome, 20), atomos, soma };
}
const MAX_PALAVRA = 30;
function palavra(v: Record<string, unknown>): VisualPalavra | null {
  const p = texto(v.palavra, MAX_PALAVRA);
  if (!p || /\s{2,}/.test(p)) return null;
  // Sílabas só valem se, juntas, dão a palavra; destaque só se está nela.
  const silabas = lista(v.silabas).map((x) => texto(x, MAX_PALAVRA)).filter((x): x is string => !!x);
  const destaque = texto(v.destaque, MAX_PALAVRA);
  return {
    tipo: 'palavra', titulo: texto(v.titulo), palavra: p,
    silabas: silabas.length > 1 && silabas.join('') === p ? silabas : undefined,
    destaque: destaque && p.includes(destaque) ? destaque : undefined,
    nota: texto(v.nota, 140),
  };
}
const VALIDADORES: Record<Visual['tipo'], (v: Record<string, unknown>) => Visual | null> = {
  grafico, reta, transformacao, tabela, vetores, cena, roda, retangulo, fatias, processo, molecula, palavra,
};

/* Devolve o visual limpo, ou null se não der para desenhar com segurança. */
export function validarVisual(bruto: unknown): Visual | null {
  const v = objeto(bruto);
  const validar = VALIDADORES[v.tipo as Visual['tipo']];
  return validar ? validar(v) : null;
}

/* Descrição do formato para colocar no prompt da IA — uma fonte só. */
export const FORMATO_VISUAL_PARA_IA = `"visual" é um destes objetos (ou null). O app desenha a partir dele; você nunca manda imagem.
- Gráfico de função: {"tipo":"grafico","titulo":"...","funcoes":[{"expr":"x^2-4","rotulo":"f(x)","cor":"a"}],"pontos":[{"x":2,"y":0,"rotulo":"raiz","cor":"b"}],"x":[-4,4],"y":[-5,6]}
  expr usa só x, números, + - * / ^, parênteses, sqrt, sin, cos, tan, ln, log, abs, exp, pi. Escolha x e y para que o que importa (raízes, vértice, cruzamentos) apareça. Ponto com "aberto": true é bolinha vazia: furo onde a função não tem valor, ou ponta que não entra.
- Reta numérica (inequação, intervalo): {"tipo":"reta","de":-5,"ate":5,"marcas":[{"x":2,"rotulo":"2"}],"trechos":[{"de":2,"ate":5,"rotulo":"x ≥ 2","fechadoDe":true,"fechadoAte":false,"cor":"a"}]}
- Transformação passo a passo (álgebra, de onde a fórmula vem): {"tipo":"transformacao","linhas":[{"latex":"ax^2+bx+c=0","porque":"ponto de partida"},{"latex":"x^2+\\\\frac{b}{a}x=-\\\\frac{c}{a}","porque":"divide tudo por a"}]}
- Tabela (comparar valores, proporção, mol): {"tipo":"tabela","cabecalho":["n (mol)","massa (g)"],"linhas":[["1","18"],["2","36"]]}
- Cena (algo que MUDA COM O TEMPO: movimento, queda, lançamento, crescimento, juros, decaimento, reservatório): {"tipo":"cena","titulo":"Bola solta de 45 m","x":[0,3],"unidadeX":"s","unidadeY":"m","rastro":true,"veiculos":[{"veiculo":"bola","nome":"h","expr":"45-5*x^2","rotulo":"bola","cor":"a"}]}
  O app anima o objeto pelo relógio e desenha o gráfico junto. "veiculo" é EXATAMENTE um destes; o nome real (pena, pedra, foguete) vai em "rotulo". "carro" ou "moto" andam para o lado (posição); "bola", "balao" ou "vela" sobem e descem (altura ou quantidade). x é o tempo em passos INTEIROS, de 0 até no máximo 20. Até 2 objetos, na mesma direção. "rastro": true quando o formato da curva é o ponto. "velocimetro": true mostra a velocidade no instante ao lado da posição (movimento acelerado). Calcule expr em cada x inteiro e confira com o texto. "nome" é UMA letra (f, g, h). expr dá ONDE o objeto está (posição, altura ou quantidade) no instante x, nunca a velocidade: numa queda de 45 m a altura DIMINUI, "45-5*x^2"; um corpo lançado para cima sobe e desce, "20*x-5*x^2". O relógio termina quando o objeto chega ao chão (altura 0), não depois.
- Área sob a curva como soma de fatias (distância a partir da velocidade, energia a partir da potência): {"tipo":"fatias","titulo":"...","expr":"2*x","x":[0,4],"maxFatias":20,"unidadeX":"s","unidadeY":"m/s"}
- Processo em etapas (biologia, química, geografia: o que entra, o que sai, o que passa de uma etapa à outra): {"tipo":"processo","titulo":"Fotossíntese","etapas":[{"nome":"Fase clara","entra":["luz","H₂O"],"sai":["O₂"]},{"nome":"Fase escura","entra":["CO₂"],"sai":["glicose"]}],"ligacoes":[{"de":0,"para":1,"leva":"ATP e NADPH"}]}
  Até 4 etapas, só as moléculas ou coisas principais (até 4 de cada lado). O app anima: as coisas andam pelas setas.
- Molécula (química: átomo, molécula, massa molar, ligação): {"tipo":"molecula","titulo":"Massa da água","nome":"H₂O","atomos":[{"simbolo":"O","massa":16},{"simbolo":"H","massa":1},{"simbolo":"H","massa":1}],"soma":true}
  O app desenha cada átomo de verdade (núcleo e elétrons), uma etiqueta com a massa de cada um e, com "soma": true, a conta da massa da molécula. O átomo do meio vem PRIMEIRO. De 2 a 6 átomos; massa da tabela periódica, arredondada.
- Palavra (Português: acento, sílaba, grafia, hiato, ditongo): {"tipo":"palavra","palavra":"baú","silabas":["ba","ú"],"destaque":"ú","nota":"Acento no u: hiato, o a e o u ficam em sílabas separadas."}
  O app escreve a palavra grande, separa as sílabas e circula o destaque. "silabas" juntas têm que dar a palavra; "destaque" é um pedaço dela. A nota tem 1 frase.
- Vetores (forças, velocidade, deslocamento): {"tipo":"vetores","vetores":[{"de":[0,0],"para":[3,0],"rotulo":"F₁","cor":"a"}],"pontos":[{"x":0,"y":0,"rotulo":"corpo"}]}
"cor": "a", "b" ou "c" para destacar (use a MESMA cor no texto: escreva o termo como [[a:termo]]), "erro" só para o caminho errado do aluno.
REGRAS DE TEXTO: toda fórmula entre $...$ (nunca \\frac solto fora de $). [[a:termo]] é só para PALAVRAS fora da fórmula ("a [[a:velocidade]] é a inclinação"); nunca dentro de $...$ e nunca em volta de símbolo.`;
/* Versão curta para a conversa: vai em toda pergunta do aluno, e a Groq
   gratuita tem 8 mil tokens por minuto. Só os dois desenhos mais usados. */
export const FORMATO_VISUAL_CURTO = `"visual" (opcional, ou null) — o app desenha:
- gráfico: {"tipo":"grafico","funcoes":[{"expr":"x^2-4","rotulo":"f(x)","cor":"a"}],"pontos":[{"x":2,"y":0,"rotulo":"raiz"}],"x":[-4,4]}
- passo a passo: {"tipo":"transformacao","linhas":[{"latex":"2x=6","porque":"..."},{"latex":"x=3","porque":"divide por 2"}]}
Fórmula sempre entre $...$; [[a:palavra]] só fora da fórmula.`;
