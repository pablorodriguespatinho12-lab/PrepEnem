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
});
