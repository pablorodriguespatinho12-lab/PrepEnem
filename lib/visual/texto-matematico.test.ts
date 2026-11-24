import { describe, expect, test } from 'vitest';
import { renderizarTextoMatematico as r } from './texto-matematico';

describe('renderizarTextoMatematico', () => {
  test('vírgula decimal dentro da fórmula não ganha espaço', () => {
    expect(r('$x = 0,2$')).toEqual(r('$x = 0{,}2$'));
  });
  test('R$ de dinheiro não abre fórmula', () => {
    const html = r('Custa R$ 5 para entrar mais R$ 2 por km. Em $f(x)$ entra x.');
    expect(html).toContain('R$ 5 para entrar mais R$ 2 por km');
    expect(html.match(/class="katex"/g)?.length).toBe(1);
  });
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

  test('letra grega sem barra dentro da fórmula vira símbolo; fora dela, não', () => {
    expect(r('$Delta = 4$')).toBe(r('$\\Delta = 4$'));
    expect(r('$Delta = 4$')).toContain('Δ');
    expect(r('Delta fora da fórmula')).toContain('Delta fora');
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
test('% sem barra dentro da fórmula não apaga o resto da linha (jornada de 18/10/2026)', () => {
  // Só a parte visível: o KaTeX guarda o LaTeX original escondido (MathML).
  const visivel = r('$\\text{Aumento} = 15% \\cdot 200 = 30$').split('katex-html')[1] ?? '';
  expect(visivel).toContain('30');
  expect(visivel).toContain('%');
});
test('milhar não quebra no meio: 1 000 vira espaço fixo (geladeira, 14/11/2026)', () => {
  expect(r('vai a 1 100 e fica 1 000 000')).toContain('1 100');
  expect(r('fica 1 000 000')).toContain('1 000 000');
  expect(r('2 de 4 = 50%')).toContain('2 de 4');
});

describe('tabela escrita com barras', () => {
  const texto = 'Veja:\n\nDocumento | Como foi feito | Escala\nPlanta | da prefeitura | 1 : 30 000\n1ª cópia | reduzida a 50% | não consta\n\nNa cópia, a área é:';
  test('2 ou mais linhas com " | " viram tabela, sem barra solta', () => {
    const html = r(texto);
    expect(html).toContain('<table');
    expect(html.match(/<th /g)?.length).toBe(3);
    expect(html.match(/<tr>/g)?.length).toBe(3);
    expect(html).not.toContain(' | ');
    expect(html).toContain('Na cópia, a área é:');
  });
  test('uma linha só com barra não vira tabela', () => {
    expect(r('A | B')).not.toContain('<table');
  });
  test('fórmula dentro da célula continua funcionando', () => {
    expect(r('x | y\n$a^2$ | 5')).toContain('katex');
  });
  test('o texto da tabela continua escapado', () => {
    expect(r('a | b\n<img src=x> | 2')).not.toContain('<img');
  });
});
