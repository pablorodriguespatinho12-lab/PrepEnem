import { describe, expect, test } from 'vitest';
import { texParaSvg } from './tex-para-svg';
describe('texParaSvg', () => {
  test('cada letra vira um path, sem cache de fonte', () => {
    const svg = texParaSvg('x_1 + x_2 = -\\frac{b}{a}');
    expect(svg).toMatch(/^<svg/);
    expect((svg!.match(/<path /g) ?? []).length).toBeGreaterThanOrEqual(7);
    expect(svg).not.toContain('<use');
  });
  test('LaTeX quebrado volta null para a tela cair no KaTeX', () => {
    expect(texParaSvg('\\frac{1}{')).toBeNull();
    expect(texParaSvg('\\comandoquenaoexiste{2}')).toBeNull();
  });
  test('comando de link ou HTML não passa', () => {
    expect(texParaSvg('\\href{https://x.com}{a}')).toBeNull();
  });
  test('\\novo pinta com a cor do tema e \\corta risca de vermelho, sem deixar o código', () => {
    const svg = texParaSvg('x^2 + \\novo{\\left(\\frac{b}{2a}\\right)^2} + \\corta{\\frac{c}{a}}')!;
    expect(svg).toContain('hsl(var(--chart-2))');
    expect(svg).toContain('hsl(var(--danger))');
    expect(svg).not.toMatch(/0A0A0/i);
  });
  test('caixa no resultado final', () => {
    expect(texParaSvg('\\boxed{x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}}')).toMatch(/^<svg/);
  });
});
