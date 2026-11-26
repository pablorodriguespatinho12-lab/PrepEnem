import { describe, expect, it } from 'vitest';
import { contaVerdadeira } from './conta-verdadeira';

describe('trava de conta falsa', () => {
  const diz = (linha: string) => contaVerdadeira(linha.split(' '));
  it('barra igualdade numérica que não fecha', () => {
    expect(diz('96,96 = 210')).toBe(false);
    expect(diz('1|2 = 1')).toBe(false);
    expect(diz('20% = 12')).toBe(false);
  });
  it('deixa passar conta certa, porcentagem, arredondamento e conta com letra', () => {
    for (const l of ['1 681 − 841 = 840', '24 · 20 = 480', '1|3 = 33,3%', '0,5 × 100 = 50%', '607,5 ÷ 38,4 = 15,8', 'S = 3 × 4', '(2 + 3)² = 25']) {
      expect(contaVerdadeira(l.replace(/(\d) (?=\d{3})/g, '$1\u00a0').split(' '))).toBe(true);
    }
  });
});
