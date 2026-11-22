// Lousa a partir da aula no molde ANTIGO (ideia, peças, passos "A pergunta / O que acontece /
// Jeito rápido / Por que funciona / A resposta"), que ainda é a de 199 questões de Matemática e
// Física (Pablo, 22/11/2026: "vai"). Função pura. Se sobrar LaTeX que não sei escrever em texto
// simples, recusa a questão em vez de pôr "\dfrac" cru na lousa.
import type { AulaLousa, Cena, Cor } from './tipos';
import {
  MAX_ALTERNATIVA, MAX_CENAS, MAX_PAPEL, cabem, falas, limpa, linhasDoTexto, quebrar, telas, texto, visualDe,
  type EntradaDoRobo, type Linha, type Resultado,
} from './do-robo';

const SUPERESCRITO: Record<string, string> = { '2': '²', '3': '³' };
const SIMBOLOS: [RegExp, string][] = [
  [/\\times/g, '×'], [/\\div/g, '÷'], [/\\cdot/g, '·'], [/\\approx/g, '≈'], [/\\neq/g, '≠'],
  [/\\leq?/g, '≤'], [/\\geq?/g, '≥'], [/\\pi/g, 'π'], [/\\Delta/g, 'Δ'], [/\\circ/g, '°'],
  [/\\%/g, '%'], [/\\(?:quad|qquad)/g, ' '], [/\\[,;:! ]/g, ' '], [/\\left|\\right/g, ''],
  [/\\(?:rightarrow|to)/g, '→'], [/\\mu/g, 'µ'], [/\\Omega/g, 'Ω'], [/\\lambda/g, 'λ'],
  [/\\theta/g, 'θ'], [/\\rho/g, 'ρ'], [/\{,\}/g, ','],
];

function agrupa(s: string): string {
  return /[\s+\-−×÷=]/.test(s.trim()) ? `(${s.trim()})` : s.trim();
}

/** LaTeX simples → texto da lousa. Devolve null se sobrar comando que não conheço. */
export function latexParaTexto(entrada: string): string | null {
  let s = entrada.replace(/\{,\}/g, ',');
  for (let i = 0; i < 4; i++) {
    s = s
      .replace(/\\text\{([^{}]*)\}/g, '$1')
      .replace(/\\(?:mathrm|textbf|mathbf)\{([^{}]*)\}/g, '$1')
      .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, (_m, a: string, b: string) => `${agrupa(a)}/${agrupa(b)}`)
      .replace(/\\sqrt\{([^{}]*)\}/g, (_m, a: string) => `√${agrupa(a)}`)
      .replace(/\^\{?([0-9])\}?/g, (_m, n: string) => SUPERESCRITO[n] ?? `^${n}`)
      .replace(/\^\{([^{}]*)\}/g, '^$1')
      .replace(/_\{([^{}]*)\}/g, '_$1');
  }
  for (const [re, troca] of SIMBOLOS) s = s.replace(re, troca);
  s = s.replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
  return /\\[a-zA-Z]/.test(s) ? null : s;
}

const TITULO_PERGUNTA = 'A pergunta';

function linhasDoQuadro(v: Record<string, unknown>): Linha[] | null {
  const lista = (k: string): string[] => (Array.isArray(v[k]) ? (v[k] as unknown[]).map(texto) : []);
  const blocos: [string[], Cor, number][] = [
    [[texto(v.formula)].filter(Boolean), 'verde', 28],
    [lista('dados'), 'tinta', 24],
    [lista('contas'), 'verde', 24],
    [[texto(v.resultado)].filter(Boolean), 'azul', 28],
  ];
  const saida: Linha[] = [];
  for (const [itens, cor, tam] of blocos) {
    for (const item of itens) {
      const plano = latexParaTexto(item);
      if (plano === null) return null;
      for (const l of quebrar(plano, cabem(tam))) saida.push({ s: l, cor, tam });
    }
  }
  return saida;
}

export function lousaDoAntigo(e: EntradaDoRobo & { ideia: string }): Resultado {
  const passos = e.passos;
  if (!passos.length || texto(passos[0]?.titulo) === 'As fórmulas desta questão') return { ok: false, motivo: 'não é o molde antigo' };
  if (!e.enunciado || e.enunciado.length > MAX_PAPEL) return { ok: false, motivo: 'enunciado vazio ou longo demais' };
  const alts = e.alternativas.map((a) => limpa(a));
  if (alts.length < 2 || alts.some((a) => !a)) return { ok: false, motivo: 'alternativa vazia' };
  // Alternativa longa vazaria da fileira do papel: nesse caso o papel leva só o enunciado.
  const cabemNoPapel = alts.every((a) => a.length <= MAX_ALTERNATIVA);

  const nome = (e.tema ?? 'Questão').slice(0, 30);
  const cenas: Cena[] = [
    {
      tipo: 'lousa',
      fala: [[0.3, `Questão de ${nome}. Vamos pela ideia dela e depois pela conta.`]],
      desenho: [
        { k: 'tx', x: 200, y: 120, s: nome, cor: 'tinta', tam: nome.length > 20 ? 32 : 40, t: 0.2 },
        { k: 'linha', x1: 90, y1: 142, x2: 310, y2: 142, cor: 'verde', t: 1.0, dur: 0.8 },
        { k: 'tx', x: 200, y: 196, s: 'passo a passo', cor: 'cinza', tam: 28, t: 2.0 },
      ],
    },
    {
      tipo: 'papel',
      fala: [[0.3, 'Esta é a questão. Leia com calma o que ela dá e o que ela quer.']],
      rotulo: 'A questão',
      texto: e.enunciado,
      ...(cabemNoPapel ? { alternativas: alts } : {}),
    },
  ];

  const ideia = latexParaTexto(e.ideia);
  if (ideia === null) return { ok: false, motivo: 'LaTeX na ideia' };
  if (ideia) cenas.push(...telas('a ideia', linhasDoTexto(ideia), falas(ideia)));

  for (const p of passos) {
    const titulo = limpa(texto(p.titulo));
    if (!titulo || titulo === TITULO_PERGUNTA) continue;
    const t = latexParaTexto(texto(p.texto));
    if (t === null) return { ok: false, motivo: 'LaTeX no texto do passo' };
    const v = visualDe(p);
    const tituloTela = titulo.slice(0, 1).toLowerCase() + titulo.slice(1);
    if (v?.tipo === 'quadro') {
      const quadro = linhasDoQuadro(v);
      if (quadro === null) return { ok: false, motivo: 'LaTeX que não sei escrever' };
      const nota = latexParaTexto(texto(v.nota)) ?? '';
      cenas.push(...telas(tituloTela, [...linhasDoTexto(t), ...quadro], falas(nota ? `${t} ${nota}` : t)));
    } else {
      cenas.push(...telas(tituloTela, linhasDoTexto(t), falas(t)));
    }
  }

  if (cenas.length < 4) return { ok: false, motivo: 'poucas telas' };
  if (cenas.length > MAX_CENAS) return { ok: false, motivo: `telas demais (${cenas.length})` };
  const aula: AulaLousa = { cenas };
  return { ok: true, aula };
}
