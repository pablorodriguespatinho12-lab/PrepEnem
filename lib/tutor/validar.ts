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

const texto = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim().length > 0 ? v.trim().slice(0, max) : null;
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

export function validarExplicacao(bruto: unknown): Explicacao | null {
  const e = objeto(bruto);
  const passos = lista(e.passos).map(objeto)
    .map((p) => ({ titulo: texto(p.titulo, 80), texto: texto(p.texto, 900), visual: validarVisual(p.visual) }))
    .filter((p): p is PassoExplicacao => p.titulo !== null && p.texto !== null)
    .slice(0, 8);
  const ideia = texto(e.ideia, 300);
  if (!ideia || passos.length === 0) return null;
  const pecas = lista(e.pecas).map(objeto)
    .map((p) => ({ termo: texto(p.termo, 60), significado: texto(p.significado, 240) }))
    .filter((p): p is { termo: string; significado: string } => p.termo !== null && p.significado !== null)
    .slice(0, 3);
  const c = objeto(e.checagem);
  const pergunta = texto(c.pergunta, 300);
  const resposta = texto(c.resposta, 400);
  return {
    ideia,
    pecas,
    passos,
    seuErro: texto(e.seuErro, 700),
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
