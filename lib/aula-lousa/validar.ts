// Porteiro da aula de lousa: o JSON que vem do banco só vira tela depois de passar aqui.
// Campo fora da lista some, número fora da lousa é preso nas bordas, texto longo é cortado.

import { ALTURA, CORES, LARGURA, type Ancora, type AulaLousa, type Cena, type Cor, type Desenho, type Fala } from './tipos';

const MIN_CENAS = 3;
const MAX_CENAS = 20;
const MAX_DESENHOS = 40;
const MAX_FALAS = 4;
const MAX_TEMPO = 40;
const MAX_TEXTO_LOUSA = 80;
const MAX_FALA = 160;
const MAX_PAPEL = 1400;
const MAX_ALTERNATIVA = 60;
const MAX_PROVA = 220;
const MAX_CAMINHO = 240;
const MAX_GRADE = 36;
// Só comandos de traço de SVG: nada de letra solta que abra brecha.
const CAMINHO_OK = /^[MmLlHhVvZzCcSsQqTtAa0-9eE.,\s-]+$/;
const ANCORAS: readonly Ancora[] = ['start', 'middle', 'end'];

const objeto = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

function texto(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const limpo = v.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
  return limpo ? limpo.slice(0, max) : null;
}

function numero(v: unknown, min: number, max: number): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null;
}

const cor = (v: unknown): Cor => (CORES.includes(v as Cor) ? (v as Cor) : 'tinta');
const tempo = (v: unknown): number | null => numero(v, 0, MAX_TEMPO);
const emX = (v: unknown): number | null => numero(v, 0, LARGURA);
const emY = (v: unknown): number | null => numero(v, 0, ALTURA);
/** Os números todos, ou null se algum faltou. */
const nums = (...v: (number | null)[]): number[] | null => (v.every((x) => x !== null) ? (v as number[]) : null);

function falas(v: unknown): Fala[] {
  return lista(v)
    .map((par): Fala | null => {
      const [t, frase] = Array.isArray(par) ? par : [];
      const segundo = tempo(t);
      const dita = texto(frase, MAX_FALA);
      return segundo !== null && dita ? [segundo, dita] : null;
    })
    .filter((f): f is Fala => f !== null)
    .slice(0, MAX_FALAS);
}

function desenho(bruto: unknown): Desenho | null {
  const d = objeto(bruto);
  const c = cor(d.cor);
  switch (d.k) {
    case 'tx': {
      const s = texto(d.s, MAX_TEXTO_LOUSA);
      const n = nums(emX(d.x), emY(d.y), tempo(d.t), numero(d.tam ?? 28, 10, 64));
      if (!s || !n) return null;
      const [x, y, t, tam] = n;
      const ancora = ANCORAS.includes(d.ancora as Ancora) ? (d.ancora as Ancora) : 'middle';
      return { k: 'tx', x, y, s, cor: c, tam, t, ancora };
    }
    case 'hl': {
      const n = nums(emX(d.x), emY(d.y), numero(d.w, 1, LARGURA), numero(d.h, 1, ALTURA), tempo(d.t));
      if (!n) return null;
      const [x, y, w, h, t] = n;
      return { k: 'hl', x, y, w, h, t, cor: cor(d.cor ?? 'amarelo') };
    }
    case 'linha': {
      const n = nums(emX(d.x1), emY(d.y1), emX(d.x2), emY(d.y2), tempo(d.t), numero(d.dur ?? 0.5, 0.1, 3));
      if (!n) return null;
      const [x1, y1, x2, y2, t, dur] = n;
      return { k: 'linha', x1, y1, x2, y2, cor: c, t, dur };
    }
    case 'circ': {
      const n = nums(emX(d.cx), emY(d.cy), numero(d.r, 1, 200), tempo(d.t));
      if (!n) return null;
      const [cx, cy, r, t] = n;
      return { k: 'circ', cx, cy, r, cor: c, t };
    }
    case 'caixa': {
      const n = nums(emX(d.x), emY(d.y), numero(d.w, 1, LARGURA), numero(d.h, 1, ALTURA), tempo(d.t), numero(d.dur ?? 0.6, 0.1, 3));
      if (!n) return null;
      const [x, y, w, h, t, dur] = n;
      return { k: 'caixa', x, y, w, h, cor: c, t, dur };
    }
    case 'caminho': {
      const dd = typeof d.d === 'string' ? d.d.trim() : '';
      const n = nums(tempo(d.t), numero(d.dur ?? 0.5, 0.1, 3), numero(d.larg ?? 3, 1, 8));
      if (!dd || dd.length > MAX_CAMINHO || !CAMINHO_OK.test(dd) || !n) return null;
      const [t, dur, larg] = n;
      return { k: 'caminho', d: dd, cor: c, t, dur, larg };
    }
    case 'grade': {
      const n = nums(numero(d.cols, 1, 12), numero(d.rows, 1, 12), emX(d.x0), emY(d.y0), numero(d.s, 4, 80), numero(d.gap, 0, 20), tempo(d.t0), numero(d.passo, 0, 2));
      if (!n) return null;
      const [colunas, linhas, x0, y0, s, gap, t0, passo] = n;
      const [cols, rows] = [Math.floor(colunas), Math.floor(linhas)];
      if (cols * rows > MAX_GRADE) return null;
      const marcados = lista(d.marcados).filter((m): m is number => Number.isInteger(m) && (m as number) >= 0 && (m as number) < MAX_GRADE);
      return { k: 'grade', cols, rows, x0, y0, s, gap, t0, passo, marcados };
    }
    default:
      return null;
  }
}

function cena(bruto: unknown): Cena | null {
  const c = objeto(bruto);
  const fala = falas(c.fala);
  if (c.tipo === 'lousa') {
    const desenhos = lista(c.desenho).map(desenho).filter((x): x is Desenho => x !== null).slice(0, MAX_DESENHOS);
    return desenhos.length > 0 && fala.length > 0 ? { tipo: 'lousa', fala, desenho: desenhos } : null;
  }
  if (c.tipo === 'papel') {
    const corpo = texto(c.texto, MAX_PAPEL);
    const rotulo = texto(c.rotulo, 60);
    const alternativas = lista(c.alternativas).map((a) => texto(a, MAX_ALTERNATIVA)).filter((a): a is string => a !== null).slice(0, 5);
    return corpo && rotulo && fala.length > 0 ? { tipo: 'papel', fala, rotulo, texto: corpo, alternativas } : null;
  }
  if (c.tipo === 'prova') {
    const pergunta = texto(c.pergunta, MAX_PROVA);
    const opcoes = lista(c.opcoes).map((o) => texto(o, MAX_ALTERNATIVA));
    const porque = lista(c.porque).map((p) => texto(p, MAX_PROVA));
    const certa = numero(c.certa, 0, 4);
    const ok = pergunta && opcoes.length >= 2 && opcoes.length <= 5 && porque.length === opcoes.length && certa !== null && Number.isInteger(certa) && certa < opcoes.length;
    if (!ok || opcoes.includes(null) || porque.includes(null)) return null;
    return { tipo: 'prova', fala: fala.length > 0 ? fala : [[0.3, 'Sua vez! Escolhe uma.']], pergunta, opcoes: opcoes as string[], certa, porque: porque as string[] };
  }
  return null;
}

/** Devolve a aula limpa, ou null se sobrar menos de 3 telas boas. */
export function validarLousa(bruto: unknown): AulaLousa | null {
  const cenas = lista(objeto(bruto).cenas).map(cena).filter((c): c is Cena => c !== null).slice(0, MAX_CENAS);
  return cenas.length >= MIN_CENAS ? { cenas } : null;
}
