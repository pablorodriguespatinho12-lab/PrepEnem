// Evidência da IA → correção com nota. A nota de C1, C2 e C5 sai inteira das
// regras (grade.ts); C3 e C4 usam o nível da IA, mas com teto pela evidência
// e pelas travas. Toda competência traz o trecho que a justifica, e o código
// confere que o trecho está mesmo na redação (correção v3, 27/10/2026).
import {
  aplicarTravas, arredondarNivel, notaC1, notaC5, total,
  type Abordagem, type EstruturaSintatica, type Nivel, type Notas,
} from './grade';
import { EvidenciaSchema } from './esquema';
import { ACAO_SO_CONSCIENCIA, conectivosRepetidos, trechoExiste } from './trecho';
export interface Desvio { trecho: string; tipo: string; correcao: string }
/* cita/explica/amarra e bolso só existem da v3 em diante. */
export interface Repertorio {
  trecho: string; legitimado: boolean; pertinente: boolean; produtivo: boolean; comentario: string;
  cita?: string | null; explica?: string | null; amarra?: string | null; bolso?: boolean;
}
export interface ParagrafoAnalisado { numero: number; ideia: string; desenvolvida: boolean; comentario: string }
export interface ElementoProposta { trecho: string | null; valido: boolean }
export interface Justificativa { trecho: string | null; descritor: string }
export type ChaveElemento = 'agente' | 'acao' | 'modo' | 'efeito' | 'detalhamento';
export type Competencia = 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
export const COMPETENCIAS: Competencia[] = ['c1', 'c2', 'c3', 'c4', 'c5'];
export interface CorrecaoCompleta {
  versao: 2 | 3;
  notas: Notas;
  total: number;
  travas: string[];
  justificativas?: Record<Competencia, Justificativa>;
  /* Modelo de IA que corrigiu (gravado desde 27/10/2026; antigas não têm). */
  corrigidaPor?: string;
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
/* Desvio que "corrige" para o mesmo texto não é desvio; o mesmo trecho
   apontado duas vezes conta uma (no teste com IA real veio "ninguém → ninguém"). */
/* Desvio que não está no texto, ou cuja "correção" é o próprio trecho, não
   conta: com raciocínio 'low' a IA apontou "Eremos Seis" → "Eremas Seis" e
   aspas trocadas por aspas iguais (Cartilha 2026 #2, 27/10/2026). */
function limparDesvios(desvios: Desvio[], texto?: string): Desvio[] {
  const vistos = new Set<string>();
  return desvios.filter((d) => {
    const limpo = (t: string) => t.trim().replace(/\s+/g, ' ');
    const chave = limpo(d.trecho).toLowerCase();
    if (!chave || limpo(d.trecho) === limpo(d.correcao) || (texto !== undefined && !trechoExiste(d.trecho, texto)) || vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}
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
/* Repertório produtivo = os 3 passos no texto: cita, explica, amarra ao tema.
   Citado e legitimado sem explicar ou sem amarrar é o "repertório de bolso":
   a Cartilha 2025 chama de bolso o Bauman só nomeado, mesmo ligado ao tema. */
function lerRepertorio(
  r: { cita: string | null; explica: string | null; amarra: string | null; legitimado: boolean; pertinente: boolean; comentario: string },
  texto: string,
): Repertorio {
  const noTexto = (t: string | null) => (t && trechoExiste(t, texto) ? t : null);
  const cita = noTexto(r.cita), explica = noTexto(r.explica), amarra = noTexto(r.amarra);
  return {
    trecho: cita ?? explica ?? amarra ?? '',
    cita, explica, amarra,
    legitimado: r.legitimado,
    pertinente: r.pertinente,
    produtivo: r.legitimado && r.pertinente && !!cita && !!explica && !!amarra,
    bolso: r.legitimado && !!cita && (!explica || !amarra),
    comentario: r.comentario,
  };
}
const TETO_C4_REPETICAO: Nivel = 160;
export function corrigirRedacao(bruto: unknown, textoDoAluno: string): CorrecaoCompleta | null {
  const lido = EvidenciaSchema.safeParse(bruto);
  if (!lido.success) return null;
  const { c1, c2, c3, c4, c5, proximoPasso, reescritas } = lido.data;
  const existe = (t: string | null | undefined) => trechoExiste(t, textoDoAluno);
  /* Nota sem trecho é inválida: a IA tenta de novo. */
  if (![c1, c2, c3, c4].every((c) => existe(c.trecho))) return null;
  const desvios = limparDesvios(c1.desvios, textoDoAluno);
  const repertorios = c2.repertorios.map((r) => lerRepertorio(r, textoDoAluno)).filter((r) => r.trecho);
  const proposta = Object.fromEntries(ELEMENTOS.map((k) => {
    const e = c5[k];
    const trecho = e.trecho && existe(e.trecho) ? e.trecho : null;
    return [k, { trecho, valido: e.valido && trecho !== null }];
  })) as Record<ChaveElemento, ElementoProposta>;
  const motivosCodigo: string[] = [];
  if (proposta.acao.valido && ACAO_SO_CONSCIENCIA.test(proposta.acao.trecho ?? '') && !proposta.modo.valido) {
    proposta.acao = { ...proposta.acao, valido: false };
    motivosCodigo.push('Conscientizar sem dizer por qual meio não conta como ação na C5.');
  }
  const repetidos = conectivosRepetidos(textoDoAluno);
  const propostas: Notas = {
    c1: notaC1(c1.estrutura, desvios.length),
    c2: notaC2(c2.partesEmbrionarias, repertorios),
    c3: notaC3(c3.nivel, c3.paragrafos),
    c4: arredondarNivel(c4.nivel),
    c5: notaC5(
      { agente: proposta.agente.valido, acao: proposta.acao.valido, modo: proposta.modo.valido, efeito: proposta.efeito.valido, detalhamento: proposta.detalhamento.valido },
      { desrespeitaDH: c5.desrespeitaDH, condicional: c5.condicional },
    ),
  };
  if (repetidos.length > 0 && propostas.c4 > TETO_C4_REPETICAO) {
    propostas.c4 = TETO_C4_REPETICAO;
    motivosCodigo.push(`Conectivo repetido (${repetidos.join(', ')}) trava a C4 em 160.`);
  }
  const { notas, motivos } = aplicarTravas(propostas, {
    abordagem: c2.abordagem,
    outroTipoTextual: c2.outroTipoTextual,
    copiaMotivadores: c2.copiaMotivadores,
    monobloco: contarParagrafos(textoDoAluno) <= 1,
    contradicaoGrave: c3.contradicaoGrave,
    inadequacaoCoesiva: c4.inadequacoes.length > 0,
    operadoresEntreParagrafos: c4.operadoresEntreParagrafos.length,
    todoParagrafoTemCoesivo: c4.todoParagrafoTemCoesivo,
  });
  const trechoC5 = ELEMENTOS.map((k) => proposta[k]).find((e) => e.valido)?.trecho ?? null;
  return {
    versao: 3,
    notas,
    total: total(notas),
    travas: [...motivos, ...motivosCodigo],
    justificativas: {
      c1: { trecho: c1.trecho, descritor: c1.descritor },
      c2: { trecho: c2.trecho, descritor: c2.descritor },
      c3: { trecho: c3.trecho, descritor: c3.descritor },
      c4: { trecho: c4.trecho, descritor: c4.descritor },
      c5: { trecho: trechoC5, descritor: '' },
    },
    c1: { estrutura: c1.estrutura, desvios },
    c2: { abordagem: c2.abordagem, partesEmbrionarias: c2.partesEmbrionarias, copiaMotivadores: c2.copiaMotivadores, repertorios },
    c3: { paragrafos: c3.paragrafos.map((p, i) => ({ ...p, numero: p.numero || i + 1 })), contradicaoGrave: c3.contradicaoGrave },
    c4: {
      operadoresEntreParagrafos: c4.operadoresEntreParagrafos,
      inadequacoes: c4.inadequacoes.filter((i) => i.trecho),
      repeticoes: Array.from(new Set([...repetidos, ...c4.repeticoes])),
    },
    c5: { ...proposta, desrespeitaDH: c5.desrespeitaDH, condicional: c5.condicional },
    proximoPasso: Object.fromEntries(COMPETENCIAS
      .map((c) => [c, notas[c] < 200 ? txt(proximoPasso[c], 500) : ''])
      .filter(([, v]) => v)),
    reescritas: reescritas.filter((x) => x.original && x.sugestao).slice(0, 3),
  };
}
const NOME_ELEMENTO: Record<ChaveElemento, string> = {
  agente: 'agente', acao: 'ação', modo: 'meio', efeito: 'finalidade', detalhamento: 'detalhamento',
};
/* O erro que mais pesou em cada competência, numa frase que começa pelo erro.
   Null quando a competência está no 200. */
export function erroPrincipal(c: CorrecaoCompleta, comp: Competencia): string | null {
  if (c.notas[comp] >= 200) return null;
  const aspas = (t: string) => `"${t}"`;
  switch (comp) {
    case 'c1': {
      const d = c.c1.desvios[0];
      return d ? `${aspas(d.trecho)} → ${d.correcao} (${d.tipo}).` : `Estrutura das frases ${c.c1.estrutura}.`;
    }
    case 'c2': {
      if (c.c2.abordagem === 'tangencia') return 'Tangenciou o tema: fala do assunto amplo, não do recorte da frase temática.';
      const bolso = c.c2.repertorios.find((r) => r.bolso);
      if (bolso) return `Repertório de bolso: ${aspas(bolso.trecho)} ${bolso.explica ? 'não foi amarrado ao tema' : 'só foi citado, sem explicar a ideia'}.`;
      if (c.c2.partesEmbrionarias > 0) return `${c.c2.partesEmbrionarias} parte(s) curta(s) demais.`;
      if (c.c2.repertorios.length === 0) return 'Nenhum repertório próprio. Sem ele a C2 para em 120.';
      const fraco = c.c2.repertorios.find((r) => !r.produtivo);
      return fraco ? `Repertório sem os 3 passos (cita, explica, amarra): ${aspas(fraco.trecho)}.` : null;
    }
    case 'c3': {
      if (c.c3.contradicaoGrave) return 'Contradição grave entre as ideias.';
      const solta = c.c3.paragrafos.find((p) => !p.desenvolvida);
      return solta ? `§${solta.numero} ficou solto: ${solta.ideia}` : c.justificativas?.c3.descritor || null;
    }
    case 'c4': {
      const i = c.c4.inadequacoes[0];
      if (i) return `Conectivo com sentido errado: ${aspas(i.trecho)}. ${i.porque}`;
      if (c.c4.repeticoes.length > 0) return `Repetição: ${c.c4.repeticoes.join(', ')}.`;
      if (c.c4.operadoresEntreParagrafos.length < 2) return 'Menos de 2 conectivos ligando um parágrafo ao outro.';
      return c.justificativas?.c4.descritor || null;
    }
    case 'c5': {
      if (c.c5.desrespeitaDH) return 'A proposta desrespeita os direitos humanos.';
      const faltam = ELEMENTOS.filter((k) => !c.c5[k].valido).map((k) => NOME_ELEMENTO[k]);
      if (faltam.length > 0) return `Falta na proposta: ${faltam.join(', ')}.`;
      return c.c5.condicional ? 'Proposta condicional ("se...") trava em 80.' : null;
    }
  }
}
/* Correção de redação não troca de modelo (Pablo, 27/10/2026): falhou, o
   aluno tenta de novo. A nota de um modelo não vale para outro. */
export const ERRO_CORRECAO_IA = 'Tente de novo em 1 minuto.';
