// Converte a aula no molde do robô (passos: fórmulas, o que eu tenho, equação, achando cada letra,
// volta, pista) para a aula de lousa (Pablo, 21/11/2026: "não tá que nem o quadro do Universo
// Narrado"). Função pura: recebe a questão e os passos, devolve a lousa ou o motivo de não dar.
import type { AulaLousa, Cena, Cor, Desenho, Fala } from './tipos';

export type Passo = { titulo?: unknown; texto?: unknown; visual?: unknown };
export type EntradaDoRobo = {
  enunciado: string;
  alternativas: string[];
  tema: string | null;
  passos: Passo[];
};
export type Resultado = { ok: true; aula: AulaLousa } | { ok: false; motivo: string };

const TITULO_PRIMEIRO_PASSO = 'As fórmulas desta questão';
export const MAX_PAPEL = 1400;
export const MAX_ALTERNATIVA = 60;
const MAX_FALA = 150;
const MAX_FALA_DA_TELA = 250;
export const MAX_CENAS = 16;
const LINHAS_POR_TELA = 5;
const LARGURA_TELA = 360;
const LARGURA_DA_LETRA = 0.4; // mesma estimativa de lousa.py (em × tamanho)
const SEGUNDOS_POR_LETRA = 1 / 15;

export const texto = (v: unknown): string => (typeof v === 'string' ? v : '');
export const limpa = (s: string): string => s.replace(/\$/g, '').replace(/\s+/g, ' ').trim();

export function cabem(tam: number): number {
  return Math.floor(LARGURA_TELA / (tam * LARGURA_DA_LETRA));
}

/** Quebra em linhas de até `max` letras, só entre palavras. */
export function quebrar(s: string, max: number): string[] {
  const linhas: string[] = [];
  let atual = '';
  for (const palavra of limpa(s).split(' ')) {
    if (!palavra) continue;
    if (atual && atual.length + 1 + palavra.length > max) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = atual ? `${atual} ${palavra}` : palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

export type Linha = { s: string; cor: Cor; tam: number };

/** Frases do professor: as frases do passo, até 4 e até ~250 letras na tela toda. */
export function falas(textoDoPasso: string): Fala[] {
  // "1 : 50 000" é uma escala, não o fim de uma frase: cola os dois-pontos entre números.
  const frases = limpa(textoDoPasso.replace(/\n/g, ' ').replace(/(\d)\s*:\s*(\d)/g, '$1:$2'))
    .split(/(?<=[.:?!])\s+/)
    .map((f) => f.slice(0, MAX_FALA))
    .filter(Boolean);
  const escolhidas: string[] = [];
  let total = 0;
  for (const f of frases) {
    if (escolhidas.length >= 4 || total + f.length > MAX_FALA_DA_TELA) break;
    escolhidas.push(f);
    total += f.length;
  }
  if (!escolhidas.length && frases[0]) escolhidas.push(frases[0].slice(0, MAX_FALA));
  let t = 0.3;
  return escolhidas.map((f): Fala => {
    const par: Fala = [Math.round(t * 10) / 10, f];
    t += Math.max(2.2, f.length * SEGUNDOS_POR_LETRA + 0.8);
    return par;
  });
}

/** Telas de texto: título no alto e até 5 linhas por tela, uma a uma, com sublinhado verde no que tem "=". */
export function telas(titulo: string, linhas: Linha[], fala: Fala[]): Cena[] {
  const paginas: Linha[][] = [];
  for (let i = 0; i < linhas.length; i += LINHAS_POR_TELA) paginas.push(linhas.slice(i, i + LINHAS_POR_TELA));
  if (!paginas.length) paginas.push([]);
  return paginas.map((pagina, n): Cena => {
    const desenho: Desenho[] = [
      { k: 'tx', x: 200, y: 34, s: n ? `${titulo} (${n + 1})`.slice(0, 40) : titulo.slice(0, 40), cor: 'tinta', tam: 28, t: 0.2 },
    ];
    pagina.forEach((l, i) => {
      desenho.push({ k: 'tx', x: 30, y: 84 + i * 44, s: l.s, cor: l.cor, tam: l.tam, t: 0.8 + i * 1.4, ancora: 'start' });
    });
    return { tipo: 'lousa', fala: n === 0 ? fala : fala.slice(-1), desenho };
  });
}

export function linhasDoTexto(s: string, tam = 24): Linha[] {
  const max = cabem(tam);
  const saida: Linha[] = [];
  for (const parte of s.split('\n')) {
    for (const l of quebrar(parte, max)) {
      const conta = /[=×÷]/.test(l) && !/[a-zà-ú]{5,}/i.test(l.replace(/\([^)]*\)/g, ''));
      saida.push({ s: l, cor: conta ? 'verde' : 'tinta', tam });
    }
  }
  return saida;
}

export function visualDe(p: Passo): Record<string, unknown> | null {
  return p.visual && typeof p.visual === 'object' ? (p.visual as Record<string, unknown>) : null;
}

export function linhasDaTabela(v: Record<string, unknown> | null): Linha[] {
  const linhas = Array.isArray(v?.linhas) ? (v!.linhas as unknown[]) : [];
  return linhas.flatMap((l) => {
    if (!Array.isArray(l)) return [];
    const [a, b] = l.map((x) => limpa(texto(x)));
    return quebrar(`${a}: ${b}`, cabem(24)).map((s) => ({ s, cor: 'tinta' as Cor, tam: 24 }));
  });
}

export function lousaDoRobo(e: EntradaDoRobo): Resultado {
  const passos = e.passos;
  if (texto(passos[0]?.titulo) !== TITULO_PRIMEIRO_PASSO) return { ok: false, motivo: 'não é o molde do robô' };
  if (!e.enunciado || e.enunciado.length > MAX_PAPEL) return { ok: false, motivo: 'enunciado vazio ou longo demais' };
  const alts = e.alternativas.map((a) => limpa(a));
  if (alts.length < 2 || alts.some((a) => !a || a.length > MAX_ALTERNATIVA)) return { ok: false, motivo: 'alternativa vazia ou longa' };

  const cenas: Cena[] = [];
  const nome = (e.tema ?? 'Questão').slice(0, 30);
  cenas.push({
    tipo: 'lousa',
    fala: [[0.3, `Questão de ${nome}. A aula segue a conta dela, uma peça por vez.`]],
    desenho: [
      { k: 'tx', x: 200, y: 120, s: nome, cor: 'tinta', tam: nome.length > 20 ? 32 : 40, t: 0.2 },
      { k: 'linha', x1: 90, y1: 142, x2: 310, y2: 142, cor: 'verde', t: 1.0, dur: 0.8 },
      { k: 'tx', x: 200, y: 196, s: 'passo a passo', cor: 'cinza', tam: 28, t: 2.0 },
    ],
  });
  cenas.push({
    tipo: 'papel',
    fala: [[0.3, 'Esta é a questão. Primeiro vamos separar o que ela dá e o que ela quer.']],
    rotulo: 'A questão',
    texto: e.enunciado,
    alternativas: alts,
  });

  for (const p of passos) {
    const titulo = limpa(texto(p.titulo));
    const t = texto(p.texto);
    const v = visualDe(p);
    if (!titulo) continue;
    if (titulo === TITULO_PRIMEIRO_PASSO) {
      const itens = Array.isArray(v?.itens) ? (v!.itens as Record<string, unknown>[]) : [];
      const linhas = itens.flatMap((it) => [
        ...quebrar(limpa(texto(it.nome)), cabem(24)).map((s) => ({ s, cor: 'azul' as Cor, tam: 24 })),
        ...quebrar(limpa(texto(it.formula)), cabem(26)).map((s) => ({ s, cor: 'verde' as Cor, tam: 26 })),
      ]);
      cenas.push(...telas('as fórmulas', linhas, falas(t)));
    } else if (v?.tipo === 'equacao') {
      const formula = limpa(texto(v.formula));
      // As letras que aparecem na fórmula vêm primeiro, na ordem em que aparecem: assim nenhuma
      // letra da equação é explicada só na tela seguinte (Pablo, 22/11/2026: "o que significa o M?").
      const posicao = (l: Record<string, unknown>): number => {
        const i = formula.indexOf(limpa(texto(l.letra)));
        return i < 0 ? Number.MAX_SAFE_INTEGER : i;
      };
      const letras = (Array.isArray(v.letras) ? (v.letras as Record<string, unknown>[]) : [])
        .map((l, i) => ({ l, i }))
        .sort((a, b) => posicao(a.l) - posicao(b.l) || a.i - b.i)
        .map(({ l }) => l);
      const linhas: Linha[] = [
        ...quebrar(formula, cabem(32)).map((s) => ({ s, cor: 'verde' as Cor, tam: 32 })),
        ...quebrar(limpa(texto(v.leitura)), cabem(24)).map((s) => ({ s, cor: 'azul' as Cor, tam: 24 })),
        ...letras.flatMap((l) => quebrar(`${limpa(texto(l.letra))} = ${limpa(texto(l.oque))}`, cabem(22)).map((s) => ({ s, cor: 'tinta' as Cor, tam: 22 }))),
      ];
      cenas.push(...telas('a equação', linhas, falas(t)));
    } else if (/receita|parecida/i.test(titulo)) {
      cenas.push(...telas('questão parecida?', [...linhasDoTexto(t), ...linhasDaTabela(v)], falas(t)));
    } else {
      const base = v?.tipo === 'tabela' ? [...linhasDoTexto(t.split('\n')[0] ?? ''), ...linhasDaTabela(v)] : linhasDoTexto(t);
      cenas.push(...telas(titulo.replace(/^Achando /, 'achando '), base, falas(t)));
    }
  }

  if (cenas.length < 3) return { ok: false, motivo: 'poucas telas' };
  if (cenas.length > MAX_CENAS) return { ok: false, motivo: `telas demais (${cenas.length})` };
  return { ok: true, aula: { cenas } };
}
