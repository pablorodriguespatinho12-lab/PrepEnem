// O que a IA pode pedir para desenhar. A IA nunca manda imagem nem SVG: manda
// esta descrição, e o app desenha (components/visual). Tudo que chega da IA
// passa por `validarVisual`, que descarta o que não dá para desenhar certo.

import { tentarCompilar } from './expressao';

/* Cores semânticas: a mesma cor marca o termo na explicação e a parte do
   desenho (sinalização de Mayer). 'erro' é só para o caminho errado. */
export type CorVisual = 'a' | 'b' | 'c' | 'erro';

export interface PontoRotulado { x: number; y: number; rotulo?: string; cor?: CorVisual }

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
   (pedido do Pablo, 06/10/2026). Só nas lições escritas: fica fora do
   formato da IA. */
export interface VisualCena {
  tipo: 'cena';
  titulo?: string;
  x: [number, number];
  unidadeX?: string;
  unidadeY?: string;
  veiculos: { veiculo: 'carro' | 'moto'; nome: string; expr: string; rotulo?: string; cor?: CorVisual }[];
}
export type Visual = VisualGrafico | VisualReta | VisualTransformacao | VisualTabela | VisualVetores | VisualCena;

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
  return ehNumero(p.x) && ehNumero(p.y) ? { x: p.x, y: p.y, rotulo: texto(p.rotulo, 40), cor: cor(p.cor) } : null;
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
const MAX_MINUTOS = 20;
function cena(v: Record<string, unknown>): VisualCena | null {
  const x = intervalo(v.x);
  if (!x || !Number.isInteger(x[0]) || !Number.isInteger(x[1]) || x[1] - x[0] > MAX_MINUTOS) return null;
  const veiculos = lista(v.veiculos)
    .map(objeto)
    .filter((w) => (w.veiculo === 'carro' || w.veiculo === 'moto') && typeof w.expr === 'string' && tentarCompilar(w.expr) !== null)
    .slice(0, MAX_VEICULOS)
    .map((w) => ({
      veiculo: w.veiculo as 'carro' | 'moto',
      nome: texto(w.nome, 3) ?? 'f',
      expr: String(w.expr),
      rotulo: texto(w.rotulo, 40),
      cor: cor(w.cor),
    }));
  if (veiculos.length === 0) return null;
  return { tipo: 'cena', titulo: texto(v.titulo), x, unidadeX: texto(v.unidadeX, 12), unidadeY: texto(v.unidadeY, 12), veiculos };
}
const VALIDADORES: Record<Visual['tipo'], (v: Record<string, unknown>) => Visual | null> = {
  grafico, reta, transformacao, tabela, vetores, cena,
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
  expr usa só x, números, + - * / ^, parênteses, sqrt, sin, cos, tan, ln, log, abs, exp, pi. Escolha x e y para que o que importa (raízes, vértice, cruzamentos) apareça.
- Reta numérica (inequação, intervalo): {"tipo":"reta","de":-5,"ate":5,"marcas":[{"x":2,"rotulo":"2"}],"trechos":[{"de":2,"ate":5,"rotulo":"x ≥ 2","fechadoDe":true,"fechadoAte":false,"cor":"a"}]}
- Transformação passo a passo (álgebra, de onde a fórmula vem): {"tipo":"transformacao","linhas":[{"latex":"ax^2+bx+c=0","porque":"ponto de partida"},{"latex":"x^2+\\\\frac{b}{a}x=-\\\\frac{c}{a}","porque":"divide tudo por a"}]}
- Tabela (comparar valores, proporção, mol): {"tipo":"tabela","cabecalho":["n (mol)","massa (g)"],"linhas":[["1","18"],["2","36"]]}
- Vetores (forças, velocidade, deslocamento): {"tipo":"vetores","vetores":[{"de":[0,0],"para":[3,0],"rotulo":"F₁","cor":"a"}],"pontos":[{"x":0,"y":0,"rotulo":"corpo"}]}
"cor": "a", "b" ou "c" para destacar (use a MESMA cor no texto: escreva o termo como [[a:termo]]), "erro" só para o caminho errado do aluno.
REGRAS DE TEXTO: toda fórmula entre $...$ (nunca \\frac solto fora de $). [[a:termo]] é só para PALAVRAS fora da fórmula ("a [[a:velocidade]] é a inclinação"); nunca dentro de $...$ e nunca em volta de símbolo.`;
/* Versão curta para a conversa: vai em toda pergunta do aluno, e a Groq
   gratuita tem 8 mil tokens por minuto. Só os dois desenhos mais usados. */
export const FORMATO_VISUAL_CURTO = `"visual" (opcional, ou null) — o app desenha:
- gráfico: {"tipo":"grafico","funcoes":[{"expr":"x^2-4","rotulo":"f(x)","cor":"a"}],"pontos":[{"x":2,"y":0,"rotulo":"raiz"}],"x":[-4,4]}
- passo a passo: {"tipo":"transformacao","linhas":[{"latex":"2x=6","porque":"..."},{"latex":"x=3","porque":"divide por 2"}]}
Fórmula sempre entre $...$; [[a:palavra]] só fora da fórmula.`;
