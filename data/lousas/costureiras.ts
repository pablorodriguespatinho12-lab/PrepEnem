// Lousa da questão d2-dificil-mat-06 (8 costureiras, 6 h/dia, 240 camisetas em 5 dias; agora 480
// camisetas, 10 costureiras, 8 h/dia; quantos dias?) no JEITO DO PABLO (22/11/2026, foto do caderno):
// as informações uma embaixo da outra (antes em cima, agora embaixo) e a equação em frações
// 8/10 × 6/8 × 5/x = 240/480. Quem anda ao CONTRÁRIO dos dias (costureiras, horas) fica do mesmo
// lado do 5/x; quem anda JUNTO (camisetas) vai para o outro lado do igual.
// Dado puro (AulaLousa), validado por lib/aula-lousa/validar.ts; gravado por scripts/gravar-lousa-costureiras.ts.
import type { Cena, Cor, Desenho, Fala } from '@/lib/aula-lousa/tipos';

export const ID_COSTUREIRAS = 'd2-dificil-mat-06';

const SEGUNDOS_POR_LETRA = 1 / 15;
const PASSO_DO_TRACO = 1.4;

const tx = (x: number, y: number, s: string, cor: Cor, tam: number, t: number, ancora: 'start' | 'middle' | 'end' = 'middle'): Desenho =>
  ({ k: 'tx', x, y, s, cor, tam, t, ancora });

const titulo = (s: string): Desenho => tx(200, 34, s, 'tinta', 26, 0.2);

/** Frases do professor com o segundo em que cada uma entra (mesma conta de do-robo.ts). */
function fala(...frases: string[]): Fala[] {
  let t = 0.3;
  return frases.map((f): Fala => {
    const par: Fala = [Math.round(t * 10) / 10, f];
    t += Math.max(2.2, f.length * SEGUNDOS_POR_LETRA + 0.8);
    return par;
  });
}

/** Fração desenhada: número em cima, traço, número embaixo. */
function fracao(cx: number, y: number, cima: string, baixo: string, cor: Cor, tam: number, t: number): Desenho[] {
  const meia = (Math.max(cima.length, baixo.length) * tam * 0.4) / 2 + 4;
  return [
    tx(cx, y - 8, cima, cor, tam, t),
    { k: 'linha', x1: cx - meia, y1: y, x2: cx + meia, y2: y, cor: 'tinta', t: t + 0.3, dur: 0.4 },
    tx(cx, y + tam * 0.85 + 4, baixo, cor, tam, t + 0.5),
  ];
}

/** Linhas de texto uma a uma, no mesmo espaçamento das outras telas (84 + 44 × i). */
function linhas(titulin: string, itens: [string, Cor, number][], falaDaTela: Fala[]): Cena {
  return {
    tipo: 'lousa',
    fala: falaDaTela,
    desenho: [titulo(titulin), ...itens.map(([s, cor, tam], i) => tx(30, 84 + i * 44, s, cor, tam, 0.8 + i * PASSO_DO_TRACO, 'start'))],
  };
}

function tabela(): Cena {
  const colunas: [string, Cor, number, string, string][] = [
    ['costureiras', 'azul', 110, '8', '10'],
    ['horas/dia', 'rosa', 190, '6', '8'],
    ['camisetas', 'vermelho', 270, '240', '480'],
    ['dias', 'verde', 350, '5', 'x'],
  ];
  const desenho: Desenho[] = [];
  colunas.forEach(([nome, cor, x], i) => desenho.push(tx(x, 74, nome, cor, 16, 0.4 + i * 0.3)));
  desenho.push({ k: 'linha', x1: 14, y1: 88, x2: 386, y2: 88, cor: 'cinza', t: 1.4, dur: 0.6 });
  desenho.push(tx(10, 134, 'antes', 'cinza', 20, 2.2, 'start'));
  colunas.forEach(([, cor, x, antes], i) => desenho.push(tx(x, 138, antes, cor, 30, 2.4 + i * 0.4)));
  desenho.push(tx(10, 188, 'agora', 'cinza', 20, 5.0, 'start'));
  colunas.forEach(([, cor, x, , agora], i) => desenho.push(tx(x, 192, agora, cor, 30, 5.2 + i * 0.4)));
  desenho.push({ k: 'circ', cx: 350, cy: 182, r: 24, cor: 'verde', t: 7.4 });
  desenho.push(tx(200, 250, 'x = os dias que a questão quer', 'tinta', 20, 8.0));
  return {
    tipo: 'lousa',
    fala: fala(
      'Coloque o que a questão deu uma linha embaixo da outra.',
      'Em cima, antes: 8 costureiras, 6 horas por dia, 240 camisetas, 5 dias.',
      'Embaixo, agora: 10 costureiras, 8 horas por dia, 480 camisetas e x dias.',
      'O x é o que a questão quer.',
    ),
    desenho: [titulo('um embaixo do outro'), ...desenho],
  };
}

function equacao(): Cena {
  const y = 130;
  const tam = 30;
  const desenho: Desenho[] = [
    titulo('a equação em frações'),
    ...fracao(38, y, '8', '10', 'azul', tam, 0.8),
    tx(76, y + 8, '×', 'tinta', tam, 1.8),
    ...fracao(114, y, '6', '8', 'rosa', tam, 2.2),
    tx(152, y + 8, '×', 'tinta', tam, 3.2),
    ...fracao(190, y, '5', 'x', 'verde', tam, 3.6),
    tx(232, y + 8, '=', 'tinta', tam, 4.6),
    ...fracao(290, y, '240', '480', 'vermelho', tam, 5.0),
    tx(38, 200, 'costureiras', 'azul', 14, 6.0),
    tx(114, 200, 'horas', 'rosa', 14, 6.2),
    tx(190, 200, 'dias', 'verde', 14, 6.4),
    tx(290, 200, 'camisetas', 'vermelho', 14, 6.6),
    tx(200, 248, 'cada coluna: antes sobre agora', 'cinza', 18, 7.0),
  ];
  return {
    tipo: 'lousa',
    fala: fala(
      'Cada coluna vira uma fração: o de antes sobre o de agora.',
      'Costureiras e horas andam ao contrário dos dias: ficam do mesmo lado dos dias.',
      'Camisetas anda junto com os dias: vai para o outro lado do igual.',
    ),
    desenho,
  };
}

export function aulaCostureiras(capa: Cena, papel: Cena): { cenas: Cena[] } {
  return {
    cenas: [
      capa,
      papel,
      tabela(),
      linhas(
        'camisetas e dias',
        [['240 para 480 camisetas', 'vermelho', 26], ['o dobro de camisetas', 'tinta', 24], ['pede o dobro de dias', 'tinta', 24], ['andam juntas: direta', 'verde', 24]],
        fala('Se só as camisetas dobram, de 240 para 480, os dias também dobram.', 'As duas andam juntas: uma é direta da outra.'),
      ),
      linhas(
        'costureiras e dias',
        [['8 para 10 costureiras', 'azul', 26], ['mais gente na oficina', 'tinta', 24], ['termina em menos dias', 'tinta', 24], ['uma sobe, a outra desce: inversa', 'verde', 22]],
        fala('Se só as costureiras aumentam, de 8 para 10, o trabalho acaba em menos dias.', 'Uma sobe e a outra desce: é inversa.'),
      ),
      linhas(
        'horas por dia e dias',
        [['6 para 8 horas por dia', 'rosa', 26], ['mais horas trabalhadas por dia', 'tinta', 22], ['termina em menos dias', 'tinta', 24], ['uma sobe, a outra desce: inversa', 'verde', 22]],
        fala('Se só as horas por dia aumentam, de 6 para 8, o trabalho acaba em menos dias.', 'Também é inversa.'),
      ),
      equacao(),
      linhas(
        'simplificando',
        [['8/10 = 4/5', 'azul', 28], ['6/8 = 3/4', 'rosa', 28], ['4/5 × 3/4 = 12/20 = 3/5', 'tinta', 26], ['240/480 = 1/2', 'vermelho', 28], ['fica: 3/5 × 5/x = 1/2', 'verde', 26]],
        fala('8 sobre 10 simplifica por 2: dá 4 sobre 5. 6 sobre 8 também: dá 3 sobre 4.', '4/5 vezes 3/4 dá 12/20, que é 3/5. E 240 sobre 480 é 1 sobre 2.'),
      ),
      linhas(
        'achando x',
        [['3/5 × 5/x = 1/2', 'verde', 28], ['o 5 corta com o 5', 'cinza', 20], ['3/x = 1/2', 'tinta', 32], ['cruzado: 3 × 2 = 1 × x', 'tinta', 26], ['x = 6 dias', 'verde', 34]],
        fala('O 5 de baixo de uma fração corta com o 5 de cima da outra: sobra 3 sobre x igual a 1 sobre 2.', 'Multiplicando cruzado: 3 × 2 = 1 × x. Então x = 6 dias.'),
      ),
      linhas(
        'conferindo',
        [['8 × 6 × 5 = 240 horas de trabalho', 'tinta', 22], ['240 camisetas: 1 por hora', 'tinta', 22], ['480 camisetas pedem 480 horas', 'tinta', 22], ['10 × 8 = 80 horas por dia', 'tinta', 22], ['480 ÷ 80 = 6 dias', 'verde', 28]],
        fala('Outro jeito de conferir: some as horas de trabalho.', '8 costureiras × 6 horas × 5 dias = 240 horas, e saíram 240 camisetas: 1 por hora.', 'Para 480 camisetas, 480 horas. A equipe nova faz 10 × 8 = 80 horas por dia. 480 ÷ 80 = 6 dias.'),
      ),
      linhas(
        'por que as outras erram',
        [['A, 6: usou as três colunas', 'verde', 22], ['B, 7,5: esqueceu as costureiras', 'tinta', 22], ['C, 8: esqueceu as horas por dia', 'tinta', 22], ['D, 10: olhou só as camisetas', 'tinta', 22], ['E, 12,5: costureiras como direta', 'tinta', 22]],
        fala('A letra A, 6, usa as três colunas.', 'B esquece as costureiras. C esquece as horas por dia. D olha só as camisetas.', 'E trata mais costureiras como mais dias e esquece as horas.'),
      ),
      linhas(
        'serve para outras',
        [['1. Tabela: antes em cima, agora embaixo', 'tinta', 20], ['2. Cada coluna: antes sobre agora', 'tinta', 20], ['3. Inversa dos dias: mesmo lado do x', 'azul', 20], ['4. Direta: outro lado do igual', 'vermelho', 20], ['5. Simplifica e multiplica cruzado', 'verde', 20]],
        fala('Para uma questão assim: monte a tabela, e cada coluna vira uma fração, antes sobre agora.', 'Quem anda ao contrário dos dias fica do mesmo lado do x. Quem anda junto vai para o outro lado do igual.'),
      ),
    ],
  };
}
