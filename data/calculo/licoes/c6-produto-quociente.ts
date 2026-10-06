import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C6_PRODUTO_QUOCIENTE: ConteudoLicao = {
  gancho: {
    pergunta: 'Um terreno retangular cresce: a base aumenta 1 m por ano e a altura, 2 m por ano. Hoje ele tem 10 m de base e 5 m de altura. Quanto a área cresce no próximo ano?',
    ideia: 'A área nova vem em pedaços: uma faixa de 10 por 2 em cima (20 m²), uma de 5 por 1 do lado (5 m²) e um cantinho de 1 por 2 (2 m²). Total: 27 m². As duas faixas são a **regra do produto**; o cantinho some quando o intervalo de tempo encolhe.',
  },
  construcao: [
    {
      titulo: 'O retângulo que cresce nos dois lados',
      texto: 'Base $10 + t$ e altura $5 + 2t$. Aperte "Mais 1" e veja o que a área ganha a cada ano: a [[c:faixa de cima]] (a base velha vezes o que a altura cresceu), a [[b:faixa do lado]] (a altura velha vezes o que a base cresceu) e o canto.',
      visual: { tipo: 'retangulo', titulo: 'Terreno: base 10 + t, altura 5 + 2t', x: [0, 4], base: '10+x', altura: '5+2*x', unidade: 'm', faixas: true },
    },
    {
      titulo: 'Duas faixas e um canto',
      texto: 'Chame os lados de $f$ e $g$. Num intervalo pequeno, a área ganha $f\\cdot\\Delta g$ (faixa de cima), $g\\cdot\\Delta f$ (faixa do lado) e $\\Delta f\\cdot\\Delta g$ (canto). Dividindo pelo tempo e encolhendo o intervalo, o canto some: ele é pequeno vezes pequeno.',
      visual: {
        tipo: 'transformacao', titulo: 'De onde vem a regra do produto',
        linhas: [
          { latex: '\\Delta(f g) = f\\,\\Delta g + g\\,\\Delta f + \\Delta f\\,\\Delta g', porque: 'faixa de cima, faixa do lado, canto' },
          { latex: '\\frac{\\Delta(f g)}{h} = f\\,\\frac{\\Delta g}{h} + g\\,\\frac{\\Delta f}{h} + \\Delta f\\,\\frac{\\Delta g}{h}', porque: 'divide pelo tempo h' },
          { latex: "(f g)' = f\\,g' + g\\,f'", porque: 'com h → 0, o canto vai a zero' },
        ],
      },
    },
    {
      titulo: 'Não é multiplicar as derivadas',
      texto: "O erro mais comum é fazer $f'\\cdot g'$. No terreno, isso daria $1\\cdot 2 = 2$ m² por ano. A conta certa, agora: $10\\cdot 2 + 5\\cdot 1 = 25$ m² por ano. As faixas são grandes porque cada uma usa o lado inteiro do outro.",
    },
    {
      titulo: 'Testando numa conta que já sabemos',
      texto: 'Como $x^2 = x\\cdot x$, a regra do produto tem que devolver $2x$. Devolve.',
      visual: {
        tipo: 'transformacao', titulo: 'x² como x vezes x',
        linhas: [
          { latex: "(x\\cdot x)' = x\\cdot 1 + x\\cdot 1", porque: 'regra do produto' },
          { latex: '= 2x', porque: 'igual à regra da potência' },
        ],
      },
    },
    {
      titulo: 'O quociente sai do produto',
      texto: 'Não precisa decorar outra regra do zero. Se $q = \\frac{f}{g}$, então $f = q\\cdot g$, e a regra do produto entrega a do quociente.',
      visual: {
        tipo: 'transformacao', titulo: 'Do produto ao quociente',
        linhas: [
          { latex: 'f = q\\cdot g', porque: 'o quociente vezes o de baixo' },
          { latex: "f' = q'\\,g + q\\,g'", porque: 'regra do produto' },
          { latex: "q' = \\frac{f' - q\\,g'}{g}", porque: "isola q'" },
          { latex: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - f\\,g'}{g^2}", porque: 'troca q por f/g' },
        ],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Produto aparece em tudo que é "quantidade vezes preço" ou "população vezes consumo". Quando os dois fatores mudam ao mesmo tempo, a regra do produto diz quanto o total muda.',
    },
  ],
  resumo: "$(f\\cdot g)' = f'\\cdot g + f\\cdot g'$: as duas faixas do retângulo; nunca $f'\\cdot g'$. Quociente: $\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}$, que sai da regra do produto.",
  exemplos: [
    {
      enunciado: 'Derive $p(x) = x^2(x + 3)$ pela regra do produto.',
      passos: [
        { texto: "$f = x^2$ e $g = x + 3$, com $f' = 2x$ e $g' = 1$", porque: 'Separa os dois fatores.' },
        { texto: "$p'(x) = 2x(x + 3) + x^2\\cdot 1$", porque: "$f'g + fg'$." },
        { texto: "$p'(x) = 3x^2 + 6x$", porque: 'Confere: $x^3 + 3x^2$ derivado dá o mesmo.' },
      ],
    },
    {
      enunciado: "Para $p(x) = x^2(x + 3)$, calcule $p'(1)$.",
      passos: [
        { texto: "$p'(x) = 3x^2 + 6x$", porque: 'Do exemplo anterior.' },
        { texto: "$p'(1) = 3 + 6 = 9$", porque: 'Troca $x$ por 1.', lacuna: { pergunta: "Quanto vale $p'(1)$?", resposta: { tipo: 'numero', valor: 9 } } },
      ],
    },
    {
      enunciado: "Derive $q(x) = \\frac{x}{x + 1}$ e calcule $q'(1)$.",
      passos: [
        { texto: "$q'(x) = \\frac{1\\cdot(x + 1) - x\\cdot 1}{(x + 1)^2}$", porque: "$f = x$, $g = x + 1$, ambos com derivada 1." },
        { texto: 'O numerador $x + 1 - x$ vira 1', porque: 'O $x$ cancela.', lacuna: { pergunta: 'Quanto sobra no numerador?', resposta: { tipo: 'numero', valor: 1 } } },
        { texto: "$q'(1) = \\frac{1}{(1 + 1)^2}$, que dá 0,25", porque: '$\\frac{1}{4}$.', lacuna: { pergunta: "Quanto vale $q'(1)$?", resposta: { tipo: 'numero', valor: 0.25 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Pela regra do produto, quanto vale a derivada de $f(x) = x\\cdot x^3$ em $x = 1$?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Derive cada fator e use $f\'g + fg\'$.',
      resolucao: [
        { texto: '$1\\cdot x^3 + x\\cdot 3x^2$ vira $4x^3$', porque: 'Bate com a regra da potência para $x^4$.' },
        { texto: "$f'(1) = 4$", porque: 'Troca $x$ por 1.' },
      ],
    },
    {
      enunciado: 'Um terreno tem base 10 m crescendo 1 m por ano e altura 5 m crescendo 2 m por ano. Quantos m² por ano a área está crescendo agora?',
      resposta: { tipo: 'numero', valor: 25 },
      dica: 'As duas faixas: base vezes a taxa da altura, mais altura vezes a taxa da base.',
      resolucao: [
        { texto: '$10\\cdot 2 + 5\\cdot 1 = 25$', porque: 'Faixa de cima mais faixa do lado; o canto some no instante.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $(2x + 1)(x - 3)$ em $x = 0$?',
      resposta: { tipo: 'numero', valor: -5 },
      dica: 'O primeiro fator tem derivada 2; o segundo, 1.',
      resolucao: [
        { texto: '$2(x - 3) + (2x + 1)\\cdot 1$', porque: "$f'g + fg'$." },
        { texto: 'Em 0: $2\\cdot(-3) + 1 = -5$', porque: 'Troca $x$ por 0.' },
      ],
    },
    {
      enunciado: 'Pela regra do quociente, quanto vale a derivada de $\\frac{1}{x}$ em $x = 2$?',
      resposta: { tipo: 'numero', valor: -0.25 },
      dica: 'Em cima, $f = 1$ e $f\' = 0$; embaixo, $g = x$ e $g\' = 1$.',
      resolucao: [
        { texto: 'A derivada é $\\frac{0\\cdot x - 1\\cdot 1}{x^2}$, que é $-\\frac{1}{x^2}$', porque: "$\\frac{f'g - fg'}{g^2}$." },
        { texto: 'Em 2: $-\\frac{1}{4}$, que dá -0,25', porque: 'Negativa: $\\frac{1}{x}$ desce.' },
      ],
    },
    {
      enunciado: 'Qual é a derivada de um produto $f\\cdot g$?',
      resposta: { tipo: 'escolha', opcoes: ["$f'\\cdot g'$", "$f'\\cdot g + f\\cdot g'$", "$f' + g'$", "$\\frac{f'}{g'}$"], correta: 1 },
      dica: 'Lembre das duas faixas do retângulo.',
      resolucao: [
        { texto: 'Cada faixa usa um lado inteiro vezes o quanto o outro lado cresceu.', porque: 'Faixa de cima e faixa do lado.' },
        { texto: 'Multiplicar as derivadas deixa as faixas de fora.', porque: 'É o erro mais comum.' },
      ],
    },
    {
      enunciado: 'Uma loja vende $q(t) = 100 + 10t$ unidades por mês, ao preço $p(t) = 50 - t$ reais. A receita é $R = p\\cdot q$. Em $t = 0$, quantos reais por mês a receita está mudando?',
      resposta: { tipo: 'numero', valor: 400 },
      dica: "$R' = p'q + pq'$, com $p' = -1$ e $q' = 10$.",
      resolucao: [
        { texto: "$R' = p'\\cdot q + p\\cdot q'$", porque: 'Regra do produto.' },
        { texto: '$(-1)\\cdot 100 + 50\\cdot 10 = 400$', porque: 'O preço caindo tira 100; as vendas subindo põem 500.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Quanto vale a derivada de $\\frac{x^2}{x + 1}$ em $x = 1$?',
      resposta: { tipo: 'numero', valor: 0.75 },
      dica: "Quociente: $\\frac{f'g - fg'}{g^2}$.",
      resolucao: [
        { texto: 'A derivada é $\\frac{2x(x + 1) - x^2\\cdot 1}{(x + 1)^2}$', porque: "$f' = 2x$, $g' = 1$." },
        { texto: 'Em 1: $\\frac{2\\cdot 2 - 1}{4}$, que dá 0,75', porque: '$\\frac{3}{4}$.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Por que a derivada de um produto tem duas parcelas?',
    resposta: 'Porque quando os dois lados de um retângulo crescem, a área ganha duas faixas: uma do lado que cresceu na base e outra da altura. O canto que sobra some no limite.',
  },
};
