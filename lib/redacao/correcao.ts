// Evidência da IA → correção com nota. A nota de C1, C2 e C5 sai inteira das
// regras (grade.ts); C3 e C4 usam o nível da IA, mas com teto pela evidência
// e pelas travas. Assim cada ponto perdido aponta para um trecho.

import {
  aplicarTravas, arredondarNivel, notaC1, notaC5, total,
  type Abordagem, type EstruturaSintatica, type Nivel, type Notas,
} from './grade';
import { CRITERIOS_PARTE } from './criterios-parte';
import type { TipoParte } from '@/data/redacao/modelos';

export interface Desvio { trecho: string; tipo: string; correcao: string }
export interface Repertorio { trecho: string; legitimado: boolean; pertinente: boolean; produtivo: boolean; comentario: string }
export interface ParagrafoAnalisado { numero: number; ideia: string; desenvolvida: boolean; comentario: string }
export interface ElementoProposta { trecho: string | null; valido: boolean }
export type ChaveElemento = 'agente' | 'acao' | 'modo' | 'efeito' | 'detalhamento';
export type Competencia = 'c1' | 'c2' | 'c3' | 'c4' | 'c5';

export interface CorrecaoCompleta {
  versao: 2;
  notas: Notas;
  total: number;
  travas: string[];
  c1: { estrutura: EstruturaSintatica; desvios: Desvio[] };
  c2: { abordagem: Abordagem; partesEmbrionarias: number; copiaMotivadores: boolean; repertorios: Repertorio[] };
  c3: { paragrafos: ParagrafoAnalisado[]; contradicaoGrave: boolean };
  c4: { operadoresEntreParagrafos: string[]; inadequacoes: { trecho: string; porque: string }[]; repeticoes: string[] };
  c5: Record<ChaveElemento, ElementoProposta> & { desrespeitaDH: boolean; condicional: boolean };
  proximoPasso: Partial<Record<Competencia, string>>;
  reescritas: { original: string; sugestao: string; porque: string }[];
}

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
const lista = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.map(obj) : []);
const txt = (v: unknown, max = 600): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bool = (v: unknown): boolean => v === true;
const naoVazio = <T extends { trecho: string }>(x: T): boolean => x.trecho.length > 0;

const ESTRUTURAS: EstruturaSintatica[] = ['excelente', 'boa', 'regular', 'deficitaria', 'inexistente'];
const ABORDAGENS: Abordagem[] = ['completa', 'tangencia', 'fuga'];
const ELEMENTOS: ChaveElemento[] = ['agente', 'acao', 'modo', 'efeito', 'detalhamento'];

/* C2 pela evidência (grade oficial): partes embrionárias e estado do repertório. */
export function notaC2(partesEmbrionarias: number, repertorios: Repertorio[]): Nivel {
  if (partesEmbrionarias >= 2) return 80;
  const validos = repertorios.filter((r) => r.legitimado && r.pertinente);
  if (partesEmbrionarias === 1 || validos.length === 0) return 120;
  return validos.some((r) => r.produtivo) ? 200 : 160;
}

/* C3: nível da IA, com teto pela proporção de ideias desenvolvidas. */
export function notaC3(nivelIA: unknown, paragrafos: ParagrafoAnalisado[]): Nivel {
  const nivel = arredondarNivel(nivelIA);
  if (paragrafos.length === 0) return nivel;
  const soltas = paragrafos.filter((p) => !p.desenvolvida).length;
  const tetoEvidencia: Nivel = soltas === 0 ? 200 : soltas / paragrafos.length < 0.5 ? 160 : 120;
  return Math.min(nivel, tetoEvidencia) as Nivel;
}

export function contarParagrafos(texto: string): number {
  return texto.split(/\n\s*\n|\n/).map((p) => p.trim()).filter((p) => p.length > 0).length;
}

export function corrigirRedacao(bruto: unknown, textoDoAluno: string): CorrecaoCompleta | null {
  const r = obj(bruto);
  const c1 = obj(r.c1), c2 = obj(r.c2), c3 = obj(r.c3), c4 = obj(r.c4), c5 = obj(r.c5);
  const estrutura = ESTRUTURAS.includes(c1.estrutura as EstruturaSintatica) ? (c1.estrutura as EstruturaSintatica) : null;
  const abordagem = ABORDAGENS.includes(c2.abordagem as Abordagem) ? (c2.abordagem as Abordagem) : null;
  if (!estrutura || !abordagem) return null;

  const desvios = lista(c1.desvios).map((d) => ({ trecho: txt(d.trecho, 200), tipo: txt(d.tipo, 40), correcao: txt(d.correcao, 200) })).filter(naoVazio);
  const repertorios = lista(c2.repertorios).map((x) => ({
    trecho: txt(x.trecho, 300), legitimado: bool(x.legitimado), pertinente: bool(x.pertinente), produtivo: bool(x.produtivo), comentario: txt(x.comentario, 300),
  })).filter(naoVazio);
  const partesEmbrionarias = Math.max(0, Math.min(3, Number(c2.partesEmbrionarias) || 0));
  const paragrafos = lista(c3.paragrafos).map((p, i) => ({
    numero: Number(p.numero) || i + 1, ideia: txt(p.ideia, 300), desenvolvida: bool(p.desenvolvida), comentario: txt(p.comentario, 300),
  }));
  const operadores = (Array.isArray(c4.operadoresEntreParagrafos) ? c4.operadoresEntreParagrafos : []).map((o) => txt(o, 60)).filter(Boolean);
  const inadequacoes = lista(c4.inadequacoes).map((i) => ({ trecho: txt(i.trecho, 200), porque: txt(i.porque, 300) })).filter(naoVazio);
  const proposta = Object.fromEntries(ELEMENTOS.map((k) => {
    const e = obj(c5[k]);
    const trecho = txt(e.trecho, 300) || null;
    return [k, { trecho, valido: bool(e.valido) && trecho !== null }];
  })) as Record<ChaveElemento, ElementoProposta>;
  const desrespeitaDH = bool(c5.desrespeitaDH);
  const condicional = bool(c5.condicional);

  const propostas: Notas = {
    c1: notaC1(estrutura, desvios.length),
    c2: notaC2(partesEmbrionarias, repertorios),
    c3: notaC3(c3.nivel, paragrafos),
    c4: arredondarNivel(c4.nivel),
    c5: notaC5(
      { agente: proposta.agente.valido, acao: proposta.acao.valido, modo: proposta.modo.valido, efeito: proposta.efeito.valido, detalhamento: proposta.detalhamento.valido },
      { desrespeitaDH, condicional },
    ),
  };
  const { notas, motivos } = aplicarTravas(propostas, {
    abordagem,
    outroTipoTextual: bool(c2.outroTipoTextual),
    copiaMotivadores: bool(c2.copiaMotivadores),
    monobloco: contarParagrafos(textoDoAluno) <= 1,
    contradicaoGrave: bool(c3.contradicaoGrave),
    inadequacaoCoesiva: inadequacoes.length > 0,
    operadoresEntreParagrafos: operadores.length,
    todoParagrafoTemCoesivo: bool(c4.todoParagrafoTemCoesivo),
  });

  const passo = obj(r.proximoPasso);
  return {
    versao: 2,
    notas,
    total: total(notas),
    travas: motivos,
    c1: { estrutura, desvios },
    c2: { abordagem, partesEmbrionarias, copiaMotivadores: bool(c2.copiaMotivadores), repertorios },
    c3: { paragrafos, contradicaoGrave: bool(c3.contradicaoGrave) },
    c4: {
      operadoresEntreParagrafos: operadores, inadequacoes,
      repeticoes: (Array.isArray(c4.repeticoes) ? c4.repeticoes : []).map((x) => txt(x, 60)).filter(Boolean),
    },
    c5: { ...proposta, desrespeitaDH, condicional },
    proximoPasso: Object.fromEntries((['c1', 'c2', 'c3', 'c4', 'c5'] as Competencia[])
      .map((c) => [c, notas[c] < 200 ? txt(passo[c], 500) : ''])
      .filter(([, v]) => v)),
    reescritas: lista(r.reescritas).map((x) => ({ original: txt(x.original, 400), sugestao: txt(x.sugestao, 600), porque: txt(x.porque, 300) }))
      .filter((x) => x.original && x.sugestao).slice(0, 3),
  };
}

export interface CorrecaoParte {
  versao: 2;
  parte: TipoParte;
  nota: number;
  itens: { id: string; rotulo: string; ok: boolean; trecho: string | null; comoMelhorar: string }[];
  desvios: Desvio[];
  reescrita: string;
}

/* Nota da parte (0–10) = proporção de itens cumpridos, menos 1 ponto a cada
   3 desvios de norma. Itens são os fixos de criterios-parte.ts. */
export function corrigirParte(bruto: unknown, parte: TipoParte): CorrecaoParte | null {
  const r = obj(bruto);
  const marcados = obj(r.itens);
  const criterios = CRITERIOS_PARTE[parte];
  if (criterios.every((c) => !(c.id in marcados))) return null;
  const itens = criterios.map((c) => {
    const m = obj(marcados[c.id]);
    const trecho = txt(m.trecho, 400) || null;
    const ok = bool(m.ok) && trecho !== null;
    return { id: c.id, rotulo: c.rotulo, ok, trecho, comoMelhorar: ok ? '' : txt(m.comoMelhorar, 500) };
  });
  const desvios = lista(r.desvios).map((d) => ({ trecho: txt(d.trecho, 200), tipo: txt(d.tipo, 40), correcao: txt(d.correcao, 200) })).filter(naoVazio);
  const base = (10 * itens.filter((i) => i.ok).length) / itens.length;
  const nota = Math.max(0, Math.round(base - Math.floor(desvios.length / 3)));
  return { versao: 2, parte, nota, itens, desvios, reescrita: txt(r.reescrita, 2500) };
}
