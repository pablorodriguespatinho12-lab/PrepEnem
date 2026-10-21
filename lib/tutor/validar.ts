// Validação do JSON que a IA devolve. Nada da IA vai para a tela sem passar
// aqui: campo faltando vira ausência, visual quebrado é descartado.

import { validarVisual, type Visual } from '@/lib/visual/especificacao';

export interface PassoExplicacao { titulo: string; texto: string; visual: Visual | null }

export interface Explicacao {
  ideia: string;
  pecas: { termo: string; significado: string }[];
  passos: PassoExplicacao[];
  seuErro: string | null;
  checagem: { pergunta: string; resposta: string } | null;
}

export interface RespostaTutor { resposta: string; visual: Visual | null }

const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;
// Hífen sem quebra e hífen tipográfico (U+2010/2011): a IA usa em "calcula‑se",
// e as fontes do app não têm o desenho deles (21/10/2026).
const HIFEN_ESPECIAL = /[\u2010\u2011]/g;
/* Frase que a decisão proíbe (decisoes-prepenem): a frase inteira sai. */
const PROIBIDAS = [/é importante notar/i, /vale ressaltar/i, /vamos analisar/i, /^(ótima pergunta|muito bem|parabéns)\b/i];
/* Quebra em frases sem cortar dentro de $...$ nem em decimal ("0.5"). */
export function frases(t: string): string[] {
  const saida: string[] = [];
  let atual = '';
  let naFormula = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    atual += c;
    if (c === '$') naFormula = !naFormula;
    if (!naFormula && /[.!?]/.test(c) && (i + 1 === t.length || /\s/.test(t[i + 1]))) {
      saida.push(atual.trim());
      atual = '';
    }
  }
  if (atual.trim()) saida.push(atual.trim());
  return saida;
}
const SOBRESCRITO: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
/* "m/s^2" fora de $...$ aparecia com o circunflexo cru na tela. */
const semCircunflexo = (t: string): string =>
  t.split('$').map((pedaco, i) => (i % 2 === 1 ? pedaco : pedaco.replace(/\^(-?\d+)/g, (_, n: string) => [...n].map((c) => SOBRESCRITO[c]).join('')))).join('$');
/* "Três pilhas dão ~10.8 V" (lote de 15/10/2026): decimal brasileiro é com
   vírgula. Só 1 ou 2 casas: "1.000" é mil e fica. Dentro de $...$ não mexe. */
const virgulaDecimal = (t: string): string =>
  t.split('$').map((pedaco, i) => (i % 2 === 1 ? pedaco : pedaco.replace(/(\d)\.(\d{1,2})(?!\d)/g, '$1,$2'))).join('$');
/* "60\%" fora de $...$ aparecia com a barra na tela (jornada de 18/10/2026). */
const semBarraNoPorcento = (t: string): string =>
  t.split('$').map((pedaco, i) => (i % 2 === 1 ? pedaco : pedaco.replace(/\\%/g, '%'))).join('$');
/* Texto da IA: sem emoji, sem frase proibida, cortado em fim de frase.
   Antes cortava com slice no meio da palavra (validador deixava passar). */
const texto = (v: unknown, max: number, maxFrases = Infinity): string | null => {
  if (typeof v !== 'string') return null;
  const limpas = frases(virgulaDecimal(semCircunflexo(semBarraNoPorcento(v))).replace(EMOJI, '').replace(HIFEN_ESPECIAL, '-').replace(/[ \t]{2,}/g, ' ').trim())
    .filter((f) => !PROIBIDAS.some((r) => r.test(f)))
    .slice(0, maxFrases);
  let saida = '';
  for (const f of limpas) {
    const junto = saida ? `${saida} ${f}` : f;
    if (junto.length > max) break;
    saida = junto;
  }
  if (!saida && limpas[0]) saida = limpas[0].slice(0, max).replace(/\s+\S*$/, '') + '…';
  return saida || null;
};
/* "Onde seu raciocínio desviou" errado é pior que nenhum: o aluno refaz a conta
   e perde a confiança na explicação inteira. Na jornada de 18/10/2026, 2 de 7
   chutavam ("Provavelmente calculou 60% de 30 como 10", que dá 18; "√8 ≈ 2,8,
   arredondado para 2") e 1 trazia a fórmula sem $, como código na tela. A
   regra no prompt não bastou; sem o erro, a tela segue com a ideia e os passos. */
const ERRO_CHUTADO = /\b(provavelmente|talvez|possivelmente|arredond)/i;
const latexSolto = (t: string): boolean => t.split('$').some((pedaco, i) => i % 2 === 0 && /\\[a-zA-Z,]/.test(pedaco));
const erroConfiavel = (t: string | null): string | null => (t && !ERRO_CHUTADO.test(t) && !latexSolto(t) ? t : null);
const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const objeto = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});

/* Modelos às vezes embrulham o JSON em ```json ... ``` mesmo em modo JSON. */
/* LaTeX dentro de JSON: "\frac" com UMA barra é JSON válido, mas \f vira
   form-feed e a fórmula some sem erro nenhum ("\times" → tab + "imes").
   Comandos LaTeX que começam com letra de escape JSON (b f n r t u) ganham
   a barra dupla antes do parse. A lista é fechada de propósito: "\n" seguido
   de texto comum é quebra de linha de verdade e não pode virar "\\n". */
const LATEX_COM_ESCAPE_JSON = /(?<!\\)\\(?=(?:frac|forall|beta|bar|binom|big|boxed|bullet|neq|nabla|nu|ne(?![a-z])|not|newline|right|rho|rangle|rm|times|theta|text|tau|tan|to(?![a-z])|triangle|tfrac|top|tilde|underline|upsilon)(?![a-z]))/g;

/* Barra solta antes de letra que não é escape JSON ("\sqrt", "\cdot") torna o
   JSON inválido; dobrar a barra salva o texto. */
const BARRA_INVALIDA = /(?<!\\)\\(?=[^"\\/bfnrtu])/g;

export function extrairJson(bruto: string): unknown {
  const limpo = bruto.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const inicio = limpo.indexOf('{');
  const fim = limpo.lastIndexOf('}');
  if (inicio < 0 || fim <= inicio) return null;
  const json = limpo.slice(inicio, fim + 1).replace(LATEX_COM_ESCAPE_JSON, '\\\\');
  try {
    return JSON.parse(json);
  } catch {
    try {
      return JSON.parse(json.replace(BARRA_INVALIDA, '\\\\'));
    } catch {
      return null;
    }
  }
}

/* Desenho "palavra" (sílabas, acento) só faz sentido em Português: em Física
   a IA desenhou "New·ton" para explicar força (foto de 07/10/2026). */
// Cena e fatias são das lições de Cálculo; o prompt da explicação nem as descreve.
const FORA_DA_EXPLICACAO: readonly Visual['tipo'][] = ['cena', 'fatias'];
const visualDaMateria = (v: Visual | null, materia?: string): Visual | null => {
  if (v && FORA_DA_EXPLICACAO.includes(v.tipo)) return null;
  return v?.tipo === 'palavra' && materia && !/portugu/i.test(materia) ? null : v;
};
/* ENEM não cobra cálculo, e o prompt já proíbe; mesmo assim a IA deduziu
   energia cinética com integral numa questão de Física Base (Pablo,
   15/10/2026: "integral em lugar que não é para aparecer"). Passo assim sai. */
const CALCULO = /\\int|\\oint|\\lim\b|\\partial|\\frac\{d[a-z]?\}\{d[a-z]\}|\bd[a-z]\s*=\s*[a-z]\s*\\?,?\s*d[a-z]\b|∫/;
export const temCalculo = (passo: unknown): boolean => CALCULO.test(JSON.stringify(passo));
/* A IA às vezes põe a explicação dentro do termo: "conjugação (alternância de
   ligações simples e duplas ao longo da cadeia)". O termo tem teto de 60
   letras e saía cortado com "…" no título da peça (testar-tutor, 21/10/2026).
   Parêntese longo vai para o começo do significado; curto ("pH (acidez)") fica. */
const PARENTESE_LONGO = 25;
function separarTermo(p: Record<string, unknown>): Record<string, unknown> {
  if (typeof p.termo !== 'string') return p;
  const m = p.termo.trim().match(/^([^()]+?)\s*\((.+)\)$/);
  if (!m || m[2].length < PARENTESE_LONGO) return p;
  const explicacao = m[2].charAt(0).toUpperCase() + m[2].slice(1).replace(/\.?$/, '.');
  const resto = typeof p.significado === 'string' ? p.significado.trim() : '';
  return { ...p, termo: m[1], significado: resto ? `${explicacao} ${resto}` : explicacao };
}
export function validarExplicacao(bruto: unknown, materia?: string): Explicacao | null {
  const e = objeto(bruto);
  const passos = lista(e.passos).map(objeto)
    .filter((p) => !temCalculo(p))
    .map((p) => ({ titulo: texto(p.titulo, 80), texto: texto(p.texto, 900), visual: visualDaMateria(validarVisual(p.visual), materia) }))
    .filter((p): p is PassoExplicacao => p.titulo !== null && p.texto !== null)
    .slice(0, 4);
  const ideia = texto(e.ideia, 300, 2);
  if (!ideia || passos.length === 0) return null;
  const pecas = lista(e.pecas).map(objeto).map(separarTermo)
    .map((p) => ({ termo: texto(p.termo, 60), significado: texto(p.significado, 320) }))
    .filter((p): p is { termo: string; significado: string } => p.termo !== null && p.significado !== null)
    .slice(0, 3);
  const c = objeto(e.checagem);
  const pergunta = texto(c.pergunta, 300);
  const resposta = texto(c.resposta, 400);
  return {
    ideia,
    pecas,
    passos,
    seuErro: erroConfiavel(texto(e.seuErro, 700)),
    checagem: pergunta && resposta ? { pergunta, resposta } : null,
  };
}

export function validarRespostaTutor(bruto: unknown): RespostaTutor | null {
  const r = objeto(bruto);
  const resposta = texto(r.resposta, 1500);
  return resposta ? { resposta, visual: validarVisual(r.visual) } : null;
}

/* Texto corrido da explicação, para o tutor saber o que não repetir. */
export function resumirExplicacao(e: Explicacao): string {
  return [
    `Ideia: ${e.ideia}`,
    ...e.passos.map((p, i) => `${i + 1}. ${p.titulo}: ${p.texto}`),
    e.seuErro ? `Erro do aluno: ${e.seuErro}` : '',
  ].filter(Boolean).join('\n');
}
