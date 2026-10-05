import { describe, expect, test } from 'vitest';
import { renderizarTextoMatematico as r } from './texto-matematico';

describe('renderizarTextoMatematico', () => {
  test('escapa HTML fora das fórmulas', () => {
    const html = r('<img src=x onerror=alert(1)> e <script>x</script>');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<script');
    expect(html).toContain('&lt;img');
  });

  test('não transforma \\href em link executável', () => {
    expect(r('$\\href{javascript:alert(1)}{x}$')).not.toContain('href="javascript');
  });

  test('renderiza fórmula inline e em destaque', () => {
    expect(r('a $x^2$ b')).toContain('katex');
    expect(r('$$\\frac{1}{2}$$')).toContain('katex-display');
  });

  test('desigualdade dentro da fórmula não é escapada duas vezes', () => {
    expect(r('$a < b$')).not.toContain('&amp;lt;');
  });

  test('colore termo marcado com a cor do desenho', () => {
    expect(r('a [[a:raiz]] do gráfico')).toContain('<strong style="color:hsl(var(--chart-1))">raiz</strong>');
  });

  test('markdown mínimo: negrito, lista e quebra de linha', () => {
    const html = r('**forte**\n- item');
    expect(html).toContain('<strong>forte</strong>');
    expect(html).toContain('<br/>');
    expect(html).toContain('•');
  });
});
