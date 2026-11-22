import { describe, expect, it } from 'vitest';
import { partirEmFracoes, temFracao } from './fracoes';

describe('partirEmFracoes', () => {
  it('separa cada fração da equação, guardando o resto do texto', () => {
    expect(partirEmFracoes('3/5 × 5/x = 1/2')).toEqual([
      { cima: '3', baixo: '5' }, ' × ', { cima: '5', baixo: 'x' }, ' = ', { cima: '1', baixo: '2' },
    ]);
  });

  it('pega número com espaço de milhar e texto antes e depois', () => {
    expect(partirEmFracoes('fica: 50 000/x = 1/6 (÷ 4)')).toEqual([
      'fica: ', { cima: '50 000', baixo: 'x' }, ' = ', { cima: '1', baixo: '6' }, ' (÷ 4)',
    ]);
  });

  it('soma entre parênteses e raiz ficam inteiras em cima da barra', () => {
    expect(partirEmFracoes('= (4+3+2)/12 =')).toEqual(['= ', { cima: '(4+3+2)', baixo: '12' }, ' =']);
    expect(partirEmFracoes('r = 2/3 × L√3/2 + sobra')).toEqual(['r = ', { cima: '2', baixo: '3' }, ' × ', { cima: 'L√3', baixo: '2' }, ' + sobra']);
  });

  it('não mexe em unidade, data ou texto sem fração', () => {
    for (const s of ['60 km/h', 'a velocidade m/s', 'horas/dia', 'x = 6 dias', '2024/25/26', 'R = D ÷ 2']) {
      expect(temFracao(s)).toBe(false);
      expect(partirEmFracoes(s)).toEqual([s]);
    }
  });

  it('só equação vira fração em pé: frase e conta sem "=" ficam em texto', () => {
    expect(temFracao('4/5 × 3/4 = 12/20')).toBe(true);
    expect(temFracao('2/3 h')).toBe(true);
    expect(temFracao('Aluguel: 1/3 = 4/12')).toBe(true);
    expect(temFracao('Parece certo ler 9/10 como 9 ou 10')).toBe(false);
    expect(temFracao('dardos. Mas 9/10 é uma CHANCE: 0,9,')).toBe(false);
  });

  it('o que não vira fração continua inteiro: juntando os pedaços volta o mesmo texto', () => {
    const s = '4/5 × 3/4 = 12/20';
    const volta = partirEmFracoes(s).map((p) => (typeof p === 'string' ? p : `${p.cima}/${p.baixo}`)).join('');
    expect(volta).toBe(s);
  });
});
