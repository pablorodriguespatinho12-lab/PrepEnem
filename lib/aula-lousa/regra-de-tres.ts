// Lousa de questão de GRANDEZAS no jeito do Pablo (22/11/2026, caderno dele): os dados um embaixo
// do outro (antes em cima, agora embaixo), uma tela por coluna dizendo se anda junto (direta) ou ao
// contrário (inversa) do x, e a equação JÁ MONTADA em frações: as inversas ficam do mesmo lado do x,
// as diretas vão para o outro lado do igual. Modelo aprovado: data/lousas/costureiras.ts.
// Função pura: a ficha da questão entra, a AulaLousa sai.
import type { AulaLousa, Cena, Cor, Desenho } from './tipos';
import { fala, fracao, larguraDe, linhas, setaParaCima, titulo, tx } from './pincel';

export type Relacao = 'incognita' | 'direta' | 'inversa';

export interface ColunaRT {
  /** Nome curto do cabeçalho da tabela (até ~11 letras). */
  nome: string;
  /** Com artigo, para as frases: "a velocidade", "o tempo". */
  rotulo: string;
  cor: Cor;
  antes: string;
  /** "x" na coluna da incógnita. */
  agora: string;
  relacao: Relacao;
}

export type ItemDeTela = readonly [string, Cor, number];

export interface TelaTexto {
  titulo: string;
  itens: readonly ItemDeTela[];
  fala: readonly string[];
}

export interface FichaRT {
  id: string;
  colunas: readonly ColunaRT[];
  /** O que são o "antes" e o "agora" nesta questão, em palavras (nem sempre são dois momentos). */
  antesAgora: readonly [string, string];
  /** Valor de x na unidade da tabela (para o teste conferir a conta). */
  resposta: number;
  /** Telas depois da equação: simplificando, achando x, conversão, conferência, outras letras. */
  telas: readonly TelaTexto[];
}

export const MAX_FRACOES = 4;
const LARGURA_UTIL = 360;
const COLUNA_X = 80;
const MAX_ALTERNATIVA = 60;

/** "50 000" → 50000; "1,5" → 1.5. */
export function numeroDe(s: string): number {
  return Number(s.replace(/\s/g, '').replace(',', '.'));
}

const incognitaDe = (f: FichaRT): ColunaRT => {
  const col = f.colunas.find((c) => c.relacao === 'incognita');
  if (!col) throw new Error(`${f.id}: falta a coluna da incógnita`);
  return col;
};

/** x pela proporção: antes da incógnita × (direta: agora/antes) × (inversa: antes/agora). */
export function xPelaProporcao(f: FichaRT): number {
  const inc = incognitaDe(f);
  return f.colunas.reduce((x, c) => {
    if (c.relacao === 'incognita') return x;
    const razao = numeroDe(c.agora) / numeroDe(c.antes);
    return c.relacao === 'direta' ? x * razao : x / razao;
  }, numeroDe(inc.antes));
}

export function capaEPapel(tema: string, enunciado: string, alternativas: readonly string[]): [Cena, Cena] {
  const nome = tema.slice(0, 30);
  const cabem = alternativas.every((a) => a.length <= MAX_ALTERNATIVA);
  return [
    {
      tipo: 'lousa',
      fala: [[0.3, `Questão de ${nome}. Vamos montar a conta com os dados um embaixo do outro.`]],
      desenho: [
        tx(200, 120, nome, 'tinta', nome.length > 20 ? 32 : 40, 0.2),
        { k: 'linha', x1: 90, y1: 142, x2: 310, y2: 142, cor: 'verde', t: 1.0, dur: 0.8 },
        tx(200, 196, 'passo a passo', 'cinza', 28, 2.0),
      ],
    },
    {
      tipo: 'papel',
      fala: [[0.3, 'Esta é a questão. Primeiro separe o que ela dá e o que ela quer.']],
      rotulo: 'A questão',
      texto: enunciado,
      ...(cabem ? { alternativas: [...alternativas] } : {}),
    },
  ];
}

function tabela(f: FichaRT): Cena {
  const n = f.colunas.length;
  const xs = f.colunas.map((_, i) => 220 + (i - (n - 1) / 2) * COLUNA_X);
  const maior = Math.max(...f.colunas.flatMap((c) => [c.antes.length, c.agora.length]));
  const tam = maior > 5 ? 26 : 30;
  const inc = incognitaDe(f);
  const desenho: Desenho[] = [];
  f.colunas.forEach((c, i) => desenho.push(tx(xs[i], 74, c.nome, c.cor, 16, 0.4 + i * 0.3)));
  desenho.push({ k: 'linha', x1: 14, y1: 88, x2: 386, y2: 88, cor: 'cinza', t: 1.4, dur: 0.6 });
  desenho.push(tx(10, 134, 'antes', 'cinza', 20, 2.2, 'start'));
  f.colunas.forEach((c, i) => desenho.push(tx(xs[i], 138, c.antes, c.cor, tam, 2.4 + i * 0.4)));
  desenho.push(tx(10, 188, 'agora', 'cinza', 20, 5.0, 'start'));
  f.colunas.forEach((c, i) => desenho.push(tx(xs[i], 192, c.agora, c.cor, tam, 5.2 + i * 0.4)));
  const ix = f.colunas.indexOf(inc);
  desenho.push({ k: 'circ', cx: xs[ix], cy: 182, r: 24, cor: 'verde', t: 7.4 });
  desenho.push(tx(200, 250, `x = ${inc.rotulo.replace(/^(o|a) /, '')} que a questão quer`, 'tinta', 20, 8.0));
  return {
    tipo: 'lousa',
    fala: fala(
      'Coloque o que a questão deu uma linha embaixo da outra.',
      `Em cima, antes: ${f.antesAgora[0]}.`,
      `Embaixo, agora: ${f.antesAgora[1]}.`,
      `O x é ${inc.rotulo} que a questão quer.`,
    ),
    desenho: [titulo('um embaixo do outro'), ...desenho],
  };
}

function telaDaColuna(c: ColunaRT, inc: ColunaRT): Cena {
  const subiu = numeroDe(c.agora) > numeroDe(c.antes);
  const direta = c.relacao === 'direta';
  const incSobe = direta === subiu;
  const verbo = (sobe: boolean) => (sobe ? 'aumenta' : 'diminui');
  const nome = c.nome.length > 14 ? c.nome.slice(0, 14) : c.nome;
  return linhas(
    `${nome} e ${inc.nome}`,
    [
      [`${c.antes} para ${c.agora}`, c.cor, 26],
      [`${c.rotulo} ${verbo(subiu)}`, 'tinta', 24],
      [`${inc.rotulo} ${verbo(incSobe)}`, 'tinta', 24],
      [direta ? 'andam juntas: direta' : 'uma sobe, a outra desce: inversa', 'verde', 22],
    ],
    fala(
      `Se só ${c.rotulo} ${verbo(subiu)}, de ${c.antes} para ${c.agora}, ${inc.rotulo} ${verbo(incSobe)}.`,
      direta ? 'As duas andam juntas: é direta.' : 'Uma sobe e a outra desce: é inversa.',
    ),
  );
}

const mdc = (a: number, b: number): number => (b === 0 ? a : mdc(b, a % b));
const comEspacos = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const maiuscula = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

interface Reduzida { cima: string; baixo: string; por: number }

/** a/b dividido pelo maior número que cabe nos dois; null se não for inteiro, tiver x ou já for irredutível. */
export function reduzida(cima: string, baixo: string): Reduzida | null {
  const [a, b] = [numeroDe(cima), numeroDe(baixo)];
  if (!Number.isInteger(a) || !Number.isInteger(b) || a <= 0 || b <= 0) return null;
  const g = mdc(a, b);
  return g > 1 ? { cima: comEspacos(a / g), baixo: comEspacos(b / g), por: g } : null;
}

const doTipo = (f: FichaRT, relacao: Relacao): ColunaRT[] => f.colunas.filter((c) => c.relacao === relacao);
const colunasReduziveis = (f: FichaRT) => [...doTipo(f, 'inversa'), ...doTipo(f, 'direta')]
  .map((c) => ({ c, r: reduzida(c.antes, c.agora) }))
  .filter((x): x is { c: ColunaRT; r: Reduzida } => x.r !== null);

type Peca =
  | { tipo: 'frac'; cima: string; baixo: string; cor: Cor; rotulo: string; relacao: Relacao }
  | { tipo: 'op'; s: string }
  | { tipo: 'um' };

const larguraDaPeca = (p: Peca, tam: number): number =>
  p.tipo === 'frac' ? Math.max(44, Math.max(larguraDe(p.cima, tam), larguraDe(p.baixo, tam)) + 20) : p.tipo === 'op' ? 34 : 24;

/** Peças da equação: inversas × incógnita = diretas (ou 1). Na versão simplificada cada fração vem reduzida. */
function pecasDaEquacao(f: FichaRT, simplificada: boolean): Peca[] {
  const inc = incognitaDe(f);
  const fr = (c: ColunaRT, baixo = c.agora): Peca => {
    const r = simplificada && c.relacao !== 'incognita' ? reduzida(c.antes, baixo) : null;
    return { tipo: 'frac', cima: r?.cima ?? c.antes, baixo: r?.baixo ?? baixo, cor: c.cor, rotulo: c.nome, relacao: c.relacao };
  };
  const inversas = doTipo(f, 'inversa');
  const diretas = doTipo(f, 'direta');
  const pecas: Peca[] = [];
  const juntar = (itens: Peca[]) => itens.forEach((p, i) => { if (i) pecas.push({ tipo: 'op', s: '×' }); pecas.push(p); });
  juntar([...inversas.map((c) => fr(c)), fr(inc, 'x')]);
  pecas.push({ tipo: 'op', s: '=' });
  if (diretas.length) juntar(diretas.map((c) => fr(c)));
  else pecas.push({ tipo: 'um' });
  if (pecas.filter((p) => p.tipo === 'frac').length > MAX_FRACOES) throw new Error(`${f.id}: frações demais para a lousa`);
  return pecas;
}

/** Equação desenhada. `simplificada`: volta no quadro com as frações reduzidas e as setas ↑ "direta/inversa". */
function equacao(f: FichaRT, simplificada: boolean): Cena {
  const inversas = doTipo(f, 'inversa');
  const diretas = doTipo(f, 'direta');
  const pecas = pecasDaEquacao(f, simplificada);
  const primeira = pecas.find((p): p is Extract<Peca, { tipo: 'frac' }> => p.tipo === 'frac')!;
  let tam = 30;
  while (tam > 18 && pecas.reduce((s, p) => s + larguraDaPeca(p, tam), 0) > LARGURA_UTIL) tam -= 2;
  const total = pecas.reduce((s, p) => s + larguraDaPeca(p, tam), 0);

  const y = 130;
  const reduziu = simplificada && colunasReduziveis(f).length > 0;
  const desenho: Desenho[] = [titulo(!simplificada ? 'a equação em frações' : reduziu ? 'a equação simplificada' : 'a equação com as setas')];
  let x = 200 - total / 2;
  let t = 0.8;
  for (const p of pecas) {
    const w = larguraDaPeca(p, tam);
    const cx = x + w / 2;
    if (p.tipo === 'frac') {
      desenho.push(...fracao(cx, y, p.cima, p.baixo, p.cor, tam, t));
      if (simplificada) {
        const nome = p.relacao === 'inversa' ? 'inversa' : p.relacao === 'direta' ? 'direta' : 'x';
        desenho.push(...setaParaCima(cx, 224, 176, p.cor, t + 4));
        desenho.push(tx(cx, 246, nome, p.cor, 18, t + 4.6));
      } else {
        desenho.push(tx(cx, 200, p.rotulo.slice(0, 12), p.cor, 14, t + 5));
      }
      t += 1.0;
    } else if (p.tipo === 'op') {
      desenho.push(tx(cx, y + 8, p.s, 'tinta', tam, t));
      t += 0.6;
    } else {
      desenho.push(tx(cx, y + 8, '1', 'tinta', tam, t));
    }
    x += w;
  }
  if (!simplificada) desenho.push(tx(200, 248, 'cada coluna: antes sobre agora', 'cinza', 18, t + 5));

  const lista = (cols: ColunaRT[]) => maiuscula(cols.map((c) => c.rotulo).join(' e '));
  return {
    tipo: 'lousa',
    fala: simplificada
      ? fala(
          reduziu ? 'Voltamos na equação, agora com as frações simplificadas.' : 'Olha a equação de novo, agora com as setas.',
          'Cada seta mostra a relação da coluna com o x.',
          ...(inversas.length ? [`${inversas.length > 1 ? 'Inversas' : 'Inversa'}: ${lista(inversas).toLowerCase()}. Uma sobe e a outra desce.`] : []),
          ...(diretas.length ? [`${diretas.length > 1 ? 'Diretas' : 'Direta'}: ${lista(diretas).toLowerCase()}. Andam juntas com o x.`] : []),
        )
      : fala(
          `Cada coluna vira uma fração, uma divisão escrita assim: ${primeira.cima} sobre ${primeira.baixo} é ${primeira.cima} ÷ ${primeira.baixo}.`,
          'O de antes fica em cima e o de agora embaixo.',
          ...(inversas.length ? ['As que andam ao contrário do x ficam do mesmo lado dele.'] : []),
          diretas.length
            ? 'As que andam junto com o x vão para o outro lado do igual.'
            : 'Sem coluna direta, o outro lado do igual é 1: o que uma coluna aumenta, a outra diminui na mesma medida.',
        ),
    desenho,
  };
}

/** Simplificação DESENHADA (frações empilhadas, como na equação), uma conta por coluna que dá para reduzir. */
function telaSimplificando(f: FichaRT): Cena | null {
  const itens = colunasReduziveis(f);
  if (!itens.length) return null;
  const tam = 28;
  const posicoes = itens.length === 1 ? [[200, 130]] : itens.length === 2 ? [[110, 130], [290, 130]] : itens.length === 3 ? [[110, 105], [290, 105], [200, 205]] : [[110, 105], [290, 105], [110, 205], [290, 205]];
  const desenho: Desenho[] = [titulo('simplificando')];
  itens.forEach(({ c, r }, i) => {
    const [cx, y] = posicoes[i];
    const t = 0.8 + i * 2.2;
    desenho.push(...fracao(cx - 50, y, c.antes, c.agora, c.cor, tam, t));
    desenho.push(tx(cx, y + 8, '=', 'tinta', tam, t + 0.9));
    desenho.push(...fracao(cx + 50, y, r.cima, r.baixo, c.cor, tam, t + 1.2));
    desenho.push(tx(cx, y + 52, `÷ ${r.por}`, 'cinza', 16, t + 1.6));
  });
  return {
    tipo: 'lousa',
    fala: fala(
      'Simplificar é dividir em cima e embaixo pelo mesmo número: o valor não muda.',
      ...itens.slice(0, 3).map(({ c, r }) => `${c.antes} sobre ${c.agora}, dividido por ${r.por}, dá ${r.cima} sobre ${r.baixo}.`),
    ),
    desenho,
  };
}

/** A regra só cita o que a aula mostrou: sem coluna inversa (ou direta), o item some e a numeração fecha. */
function regraDe(f: FichaRT): { itens: ItemDeTela[]; fala: string[] } {
  const temInversa = f.colunas.some((c) => c.relacao === 'inversa');
  const temDireta = f.colunas.some((c) => c.relacao === 'direta');
  const textos: [string, Cor][] = [
    ['Tabela: antes em cima, agora embaixo', 'tinta'],
    ['Cada coluna: antes sobre agora', 'tinta'],
    ...(temInversa ? [['Inversa do x: mesmo lado do x', 'azul'] as [string, Cor]] : []),
    ...(temDireta ? [['Direta: outro lado do igual', 'vermelho'] as [string, Cor]] : []),
    ['Simplifica e multiplica cruzado', 'verde'],
  ];
  return {
    itens: textos.map(([s, cor], i): ItemDeTela => [`${i + 1}. ${s}`, cor, 20]),
    fala: [
      'Para uma questão assim: monte a tabela, e cada coluna vira uma fração, antes sobre agora.',
      [temInversa && 'Quem anda ao contrário do x fica do mesmo lado dele.', temDireta && 'Quem anda junto vai para o outro lado do igual.'].filter(Boolean).join(' ') || 'Depois é só simplificar e multiplicar cruzado.',
    ],
  };
}

export function lousaRegraDeTres(f: FichaRT, capa: Cena, papel: Cena): AulaLousa {
  const inc = incognitaDe(f);
  const regra = regraDe(f);
  const simplificando = telaSimplificando(f);
  return {
    cenas: [
      capa,
      papel,
      tabela(f),
      ...f.colunas.filter((c) => c.relacao !== 'incognita').map((c) => telaDaColuna(c, inc)),
      equacao(f, false),
      ...(simplificando ? [simplificando] : []),
      equacao(f, true),
      ...f.telas.map((t) => linhas(t.titulo, t.itens, fala(...t.fala))),
      linhas('serve para outras', regra.itens, fala(...regra.fala)),
    ],
  };
}
