import { describe, expect, it } from 'vitest';
import { contasNaFrase, pecasDaConta, separarContas } from './quadro-de-conta';
import { quebrar } from './do-robo';

const textos = (p: { s: string }[] | null) => p?.map((x) => x.s);

describe('pecasDaConta', () => {
  it('divisão vira fração em pé (peça "a|b") e milhar fica junto', () => {
    expect(textos(pecasDaConta('D = M ÷ 1 000'))).toEqual(['D', '=', 'M|1 000']);
    expect(textos(pecasDaConta('v = 120 ÷ (1 + 2/3)'))).toEqual(['v', '=', '120|(1 + 2/3)']);
  });
  it('fórmula com nomes só passa com comPalavras', () => {
    expect(pecasDaConta('v = distância total ÷ tempo total')).toBeNull();
    expect(textos(pecasDaConta('v = distância total ÷ tempo total', true))).toEqual(['v', '=', 'distância total|tempo total']);
  });
  it('recusa prosa, divisão em cadeia e conta comprida demais', () => {
    expect(pecasDaConta('Parece certo fazer 360 ÷ 60 = 6. Mas o gasto é por dia')).toBeNull();
    expect(pecasDaConta('a = 1 ÷ 2 ÷ 3')).toBeNull();
    expect(pecasDaConta('1 + 2 + 3 + 4 + 5 + 6 + 7 = 28')).toBeNull();
  });
});

describe('contasNaFrase', () => {
  it('acha a conta no meio da frase e leva o nome antes do igual', () => {
    const c = contasNaFrase('A fórmula pede o raio. Raio = 30 ÷ 2 = 15 cm. Depois, 15² = 15 × 15 = 225.');
    expect(c.map(textos)).toEqual([['Raio', '=', '30|2', '=', '15 cm'], ['15²', '=', '15', '×', '15', '=', '225']]);
  });
  it('frase sem conta não devolve nada', () => {
    expect(contasNaFrase('A pizza cabe dentro do quadrado, com sobra nos cantos.')).toEqual([]);
  });
});

describe('contasNaFrase não corta número nem aparte', () => {
  const linhas = (f: string) => contasNaFrase(f).map((c) => c.map((p) => p.s.replace(/\u00a0/g, ' ')).join(' '));
  it('milhar com espaço fica inteiro', () => {
    expect(linhas('Então 72 · 100 = 7 200 metros.')).toEqual(['72 · 100 = 7 200']);
    expect(linhas('Somando, 2 200 + 880 = 3 080.')).toEqual(['2 200 + 880 = 3 080']);
  });
  it('parêntese que sobrou e "milhões" ficam com o número', () => {
    expect(linhas('conta: 2 200 + 880 = 3 080.)')).toEqual(['2 200 + 880 = 3 080']);
    expect(linhas('Parece certo: 300 000 × 8 = 2,4 milhões. Mas não.')).toEqual(['300 000 × 8 = 2,4 milhões']);
  });
  it('a quebra de linha não parte o milhar', () => {
    expect(quebrar('V = 400 000 + 1 500 000 = 1 900 000', 20).every((l) => !/^000/.test(l))).toBe(true);
  });
  it('conta dentro de parênteses não gruda na de fora', () => {
    const saida = linhas('sm · sm = 24 · 24 = 576 (24 · 20 = 480 e 24 · 4 = 96). 2 · pr = 2 · 188 = 376.');
    expect(saida).toContain('24 · 4 = 96');
    expect(saida).toContain('2 · pr = 2 · 188 = 376');
    expect(saida.some((l) => l.includes('96 2') || l.startsWith('24 · 4 = 2'))).toBe(false);
  });
});

describe('separarContas', () => {
  it('a frase inteira continua na prosa (vira fala) e a conta vai para o quadro', () => {
    const { contas, prosa } = separarContas('Raio = 30 ÷ 2 = 15 cm.\nPor isso a área usa o raio.');
    expect(contas).toHaveLength(1);
    expect(prosa).toContain('Por isso a área usa o raio.');
  });
});

describe('defeitos achados na foto das aulas reais (24/11/2026)', () => {
  it('"72 km/h" é unidade e não vira fração', () => {
    expect(textos(pecasDaConta('v = 72 km/h'))).toEqual(['v', '=', '72 km/h']);
  });
  it('duas contas na mesma linha viram duas', () => {
    expect(separarContas('t1 = 1 h; t2 = 2/3 h').contas).toHaveLength(2);
    expect(separarContas('S = 21, B = 10101').contas).toHaveLength(2);
  });
});
