import { describe, expect, it } from 'vitest';
import { AULAS } from '../aulas-desenho-dados.js';
import { endurecerBordas, separarSvg, tamanhoDoViewBox } from './svg-pixel';

describe('desenho em pixel', () => {
  const svg = '<svg viewBox="0 0 10 20"><rect x="1" y="1" width="4" height="4"/><text x="1" y="9">oi</text></svg>';

  it('separa formas e textos', () => {
    const s = separarSvg(svg)!;
    expect(s.formas).toContain('<rect');
    expect(s.formas).not.toContain('<text');
    expect(s.textos).toContain('<text x="1" y="9">oi</text>');
    expect(s.textos).not.toContain('<rect');
  });

  it('lê o viewBox', () => {
    expect(tamanhoDoViewBox(svg)).toEqual({ largura: 10, altura: 20 });
  });

  it('borda vira cheia ou vazia', () => {
    const d = new Uint8ClampedArray([0, 0, 0, 20, 0, 0, 0, 90]);
    endurecerBordas(d);
    expect([d[3], d[7]]).toEqual([0, 255]);
  });

  it('as 22 aulas em desenho têm viewBox e não perdem texto', () => {
    for (const a of AULAS as { t: string; svg: string; desenhoLogica?: string }[]) {
      for (const s of [a.svg, a.desenhoLogica].filter(Boolean) as string[]) {
        expect(tamanhoDoViewBox(s), a.t).not.toBeNull();
        const partes = separarSvg(s)!;
        expect((partes.textos.match(/<text\b/g) ?? []).length, a.t).toBe((s.match(/<text\b/g) ?? []).length);
      }
    }
  });
});
