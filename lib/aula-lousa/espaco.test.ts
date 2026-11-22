import { describe, expect, it } from 'vitest';
import { acomodarFracoes } from './espaco';
import type { Desenho } from './tipos';

const tx = (y: number, s: string, tam = 24): Desenho => ({ k: 'tx', x: 30, y, s, tam, t: 0, ancora: 'start' });
const ys = (d: Desenho[]) => d.flatMap((x) => (x.k === 'tx' ? [x.y] : []));

describe('acomodarFracoes', () => {
  it('tela sem fração em pé passa intacta (mesmo objeto)', () => {
    const d = [tx(84, 'ler 9/10 como 9 ou 10'), tx(128, 'x = 6 dias')];
    expect(acomodarFracoes(d)).toBe(d);
  });

  it('empurra para baixo a fração que bate na linha de baixo, sem inverter a ordem', () => {
    const d = [tx(84, '4/5 × 3/4 = 12/20'), tx(128, '12/20 = 3/5 (÷ 4)'), tx(172, 'fica: 3/5 × 5/x = 1/2')];
    const novo = ys(acomodarFracoes(d));
    expect(novo[1] - novo[0]).toBeGreaterThan(44);
    expect(novo[2] - novo[1]).toBeGreaterThan(44);
  });

  it('se não cabe na lousa, encolhe o texto e fica dentro da altura', () => {
    const d = [tx(60, '1/2 = 2/4'), tx(100, '2/4 = 3/6'), tx(140, '3/6 = 4/8'), tx(180, '4/8 = 5/10'), tx(220, '5/10 = 6/12')];
    const novo = acomodarFracoes(d);
    const tams = novo.flatMap((x) => (x.k === 'tx' ? [x.tam ?? 0] : []));
    expect(Math.max(...tams)).toBeLessThan(24);
    expect(Math.max(...ys(novo))).toBeLessThan(280);
  });

  it('não mexe em traços nem em texto que não bate', () => {
    const linha: Desenho = { k: 'linha', x1: 0, y1: 0, x2: 10, y2: 10, t: 0 };
    const longe: Desenho = { k: 'tx', x: 300, y: 240, s: 'x = 6', tam: 24, t: 0, ancora: 'start' };
    const d: Desenho[] = [linha, tx(84, '3/5 = 6/10'), longe];
    const novo = acomodarFracoes(d);
    expect(novo[0]).toBe(linha);
    expect(ys(novo)[1]).toBe(240);
  });
});
