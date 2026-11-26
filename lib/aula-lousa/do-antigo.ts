// Lousa a partir da aula no molde ANTIGO (ideia, peças, passos "A pergunta / O que acontece /
// Jeito rápido / Por que funciona / A resposta"), que ainda é a de 199 questões de Matemática e
// Física (Pablo, 22/11/2026: "vai"). Função pura. Se sobrar LaTeX que não sei escrever em texto
// simples, recusa a questão em vez de pôr "\dfrac" cru na lousa.
import type { AulaLousa, Cena, Cor } from './tipos';
import { pecasDaConta, separarContas, telasDeContas } from './quadro-de-conta';
import {
  MAX_ALTERNATIVA, MAX_CENAS, MAX_PAPEL, cabem, dividirEnunciado, falas, limpa, linhasDoTexto, quebrar, telas, texto, visualDe,
  type EntradaDoRobo, type Linha, type Resultado,
} from './do-robo';

const SUPERESCRITO: Record<string, string> = { '2': '²', '3': '³' };
const SIMBOLOS: [RegExp, string][] = [
  [/\\\$/g, '$'], [/\\times/g, '×'], [/\bR(\d+,\d{2})\b/g, 'R$$ $1'], // dinheiro que veio sem o cifrão ("R6,00")
  [/\\lceil/g, '⌈'], [/\\rceil/g, '⌉'], [/\\max/g, 'máx'], [/\\div/g, '÷'], [/\\cdot/g, '·'], [/\\approx/g, '≈'], [/\\neq/g, '≠'],
  [/\\leq?/g, '≤'], [/\\geq?/g, '≥'], [/\\pi/g, 'π'], [/\\Delta/g, 'Δ'], [/\\circ/g, '°'],
  [/\\%/g, '%'], [/\\(?:quad|qquad)/g, ' '], [/\\[,;:! ]/g, ' '], [/\\left|\\right/g, ''],
  [/\\(?:rightarrow|to)/g, '→'], [/\\mu/g, 'µ'], [/\\Omega/g, 'Ω'], [/\\lambda/g, 'λ'],
  [/\\theta/g, 'θ'], [/\\rho/g, 'ρ'], [/\\Rightarrow/g, '→'], [/\\varepsilon/g, 'ε'], [/\{,\}/g, ','],
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
      .replace(/\\(?:mathrm|textbf|mathbf|boxed)\{([^{}]*)\}/g, '$1')
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

/** Linha por linha: sem isso "A: ...\nB: ..." virava um parágrafo só no quadro. */
function textoEmLinhas(s: string): string | null {
  const linhas = s.split('\n').map(latexParaTexto);
  return linhas.some((l) => l === null) ? null : linhas.join('\n');
}

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

/** Do quadro antigo, as linhas que são conta (fórmula, dados com "=", contas, resultado) vão desenhadas; o resto vira fala. null = LaTeX que não sei escrever. */
function contasDoQuadro(v: Record<string, unknown>): { contas: ReturnType<typeof pecasDaConta>[]; sobras: string[] } | null {
  const lista = (k: string): string[] => (Array.isArray(v[k]) ? (v[k] as unknown[]).map(texto) : []);
  const itens = [...[texto(v.formula)].filter(Boolean), ...lista('dados'), ...lista('contas'), ...[texto(v.resultado)].filter(Boolean)];
  const contas: ReturnType<typeof pecasDaConta>[] = [];
  const sobras: string[] = [];
  for (const item of itens) {
    const plano = latexParaTexto(item);
    if (plano === null) return null;
    const conta = pecasDaConta(plano, true);
    if (conta) contas.push(conta);
    else if (plano) sobras.push(plano);
  }
  return { contas, sobras };
}

const RESPOSTA = /^Letra\s+([A-E])\b[,:]?\s*(.{1,24}?)\.(?:\s+|$)/;

/** "Letra D, 675 cm². A (90 cm²): ..." → quadro "D = 675 cm²" e o texto que sobra (por que as outras erram). null = não tem esse começo. */
function respostaEmQuadro(titulo: string, t: string): { cena: Cena; resto: string } | null {
  if (!/^a resposta/i.test(titulo)) return null;
  const m = RESPOSTA.exec(t.trim());
  if (!m) return null;
  const partes = [{ s: m[1], leg: 'alternativa', cor: 'verde' as Cor }, { s: '=' }, { s: m[2].trim(), leg: 'resposta', cor: 'verde' as Cor }];
  const [cena] = telasDeContas('a resposta', [partes], [[0.3, `A resposta é a letra ${m[1]}: ${m[2].trim()}.`]]);
  return { cena, resto: t.trim().slice(m[0].length).trim() };
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
    ...dividirEnunciado(e.enunciado).map((parte, k, partes): Cena => ({
      tipo: 'papel',
      fala: [[0.3, k === 0 ? 'Esta é a questão. Leia com calma o que ela dá e o que ela quer.' : 'Continua a questão.']],
      rotulo: partes.length > 1 ? `A questão (${k + 1} de ${partes.length})` : 'A questão',
      texto: parte,
      ...(k === partes.length - 1 && cabemNoPapel ? { alternativas: alts } : {}),
    })),
  ];

  const ideia = latexParaTexto(e.ideia);
  if (ideia === null) return { ok: false, motivo: 'LaTeX na ideia' };
  if (ideia) {
    const { contas, prosa } = separarContas(ideia);
    if (contas.length > 0) cenas.push(...telasDeContas('a ideia', contas, falas(prosa || ideia)));
    else cenas.push(...telas('a ideia', linhasDoTexto(ideia), falas(ideia)));
  }

  for (const p of passos) {
    const titulo = limpa(texto(p.titulo));
    if (!titulo || titulo === TITULO_PERGUNTA) continue;
    const t = textoEmLinhas(texto(p.texto));
    if (t === null) return { ok: false, motivo: 'LaTeX no texto do passo' };
    const v = visualDe(p);
    const tituloTela = titulo.slice(0, 1).toLowerCase() + titulo.slice(1);
    if (v?.tipo === 'quadro') {
      const quadro = linhasDoQuadro(v);
      if (quadro === null) return { ok: false, motivo: 'LaTeX que não sei escrever' };
      const nota = latexParaTexto(texto(v.nota)) ?? '';
      const desenhado = contasDoQuadro(v);
      const contasDoPasso = separarContas(t);
      const todas = [...contasDoPasso.contas, ...(desenhado?.contas ?? [])].filter((c): c is NonNullable<typeof c> => c !== null);
      if (todas.length > 0) {
        const fala = [contasDoPasso.prosa, ...(desenhado?.sobras ?? []), nota].filter(Boolean).join(' ');
        cenas.push(...telasDeContas(tituloTela, todas, falas(fala || tituloTela)));
      } else {
        cenas.push(...telas(tituloTela, [...linhasDoTexto(t), ...quadro], falas(nota ? `${t} ${nota}` : t)));
      }
    } else if (respostaEmQuadro(titulo, t)) {
      const { cena, resto } = respostaEmQuadro(titulo, t)!;
      cenas.push(cena);
      if (resto) cenas.push(...telas('por quê', linhasDoTexto(resto), falas(resto)));
    } else {
      const { contas, prosa } = separarContas(t);
      if (contas.length > 0) cenas.push(...telasDeContas(tituloTela, contas, falas(prosa || tituloTela)));
      else cenas.push(...telas(tituloTela, linhasDoTexto(t), falas(t)));
    }
  }

  if (cenas.length < 4) return { ok: false, motivo: 'poucas telas' };
  if (cenas.length > MAX_CENAS) return { ok: false, motivo: `telas demais (${cenas.length})` };
  const aula: AulaLousa = { cenas };
  return { ok: true, aula };
}
