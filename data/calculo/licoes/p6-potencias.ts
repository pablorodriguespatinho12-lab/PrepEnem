import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P6_POTENCIAS: ConteudoLicao = {
  gancho: {
    pergunta: '$2^5 = 32$, $2^4 = 16$, $2^3 = 8$. Continue a sequência para trás: quanto vale $2^0$? E $2^{-1}$?',
    ideia: 'Cada passo para trás divide por 2: $2^2 = 4$, $2^1 = 2$, $2^0 = 1$, $2^{-1} = \\frac{1}{2}$. Essas regras não são decoreba: são o padrão continuando.',
  },
  construcao: [
    {
      titulo: 'O balão que dobra',
      texto: 'Um balão sobe de um jeito estranho: a cada minuto, a altura **dobra**. Começa a 1 m, depois 2, 4, 8, 16, 32. No começo parece parado; no fim, dispara. A regra é $b(x) = 2^x$: o 2 multiplicado por ele mesmo $x$ vezes. Olhe o rastro: não é reta, porque a reta muda sempre o mesmo tanto. Crescer multiplicando é a marca das **potências**.',
      visual: {
        tipo: 'cena', titulo: 'A altura dobra a cada minuto', x: [0, 5], unidadeX: 'min', unidadeY: 'm', rastro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '2^x', diz: 'a altura dobra a cada minuto' }, { termo: 'b(x)', diz: 'a altura (m)' }],
        veiculos: [{ veiculo: 'balao', nome: 'b', expr: '2^x', cor: 'a' }],
      },
    },
    {
      titulo: 'Potência é multiplicação repetida',
      texto: '$2^5$ é o 2 multiplicado 5 vezes: $2\\cdot 2\\cdot 2\\cdot 2\\cdot 2 = 32$. Subir um no expoente é multiplicar mais uma vez por 2.',
      visual: { tipo: 'tabela', titulo: 'Subindo o expoente', cabecalho: ['n', '2ⁿ', 'conta'], linhas: [['1', '2', '2'], ['2', '4', '2 · 2'], ['3', '8', '2 · 2 · 2'], ['4', '16', '8 · 2'], ['5', '32', '16 · 2']] },
    },
    {
      titulo: 'Para trás, divide',
      texto: 'Se subir multiplica por 2, descer divide por 2. Seguindo o padrão abaixo de 1, aparece $2^0 = 1$ e os expoentes negativos viram frações: $2^{-n} = \\frac{1}{2^n}$.',
      visual: { tipo: 'tabela', titulo: 'Descendo o expoente', cabecalho: ['n', '2ⁿ'], linhas: [['3', '8'], ['2', '4'], ['1', '2'], ['0', '1'], ['−1', '$\\frac{1}{2}$'], ['−2', '$\\frac{1}{4}$']] },
    },
    {
      titulo: 'Multiplicar soma os expoentes',
      texto: 'Conte os fatores: $2^3\\cdot 2^2$ são três 2 vezes dois 2, ou seja, cinco 2. Por isso os expoentes se somam. Dividir cancela fatores, então os expoentes se subtraem. E $\\frac{a^n}{a^n} = a^0$ tem de valer 1: confirma o que o padrão mostrou.',
      visual: {
        tipo: 'transformacao', titulo: 'Contando os fatores',
        linhas: [
          { latex: '2^3 \\cdot 2^2 = (2\\cdot 2\\cdot 2)(2\\cdot 2)', porque: 'abre as potências' },
          { latex: '= 2^5 = 2^{3+2}', porque: 'cinco fatores 2' },
          { latex: '\\frac{2^5}{2^3} = \\frac{2\\cdot 2\\cdot 2\\cdot 2\\cdot 2}{2\\cdot 2\\cdot 2} = 2^{5-3}', porque: 'três 2 se cancelam' },
          { latex: '(2^3)^2 = 2^3\\cdot 2^3 = 2^{3\\cdot 2}', porque: 'potência de potência multiplica' },
        ],
      },
    },
    {
      titulo: 'Raiz é um expoente fracionário',
      texto: 'Que número é $9^{1/2}$? Pela regra da potência de potência, $(9^{1/2})^2 = 9^1 = 9$. Então $9^{1/2}$ é o número que ao quadrado dá 9: é $\\sqrt{9} = 3$. Do mesmo jeito, $a^{1/3} = \\sqrt[3]{a}$.',
      visual: {
        tipo: 'transformacao',
        linhas: [
          { latex: '(9^{1/2})^2 = 9^{\\frac{1}{2}\\cdot 2} = 9^1', porque: 'multiplica os expoentes' },
          { latex: '9^{1/2} = \\sqrt{9} = 3', porque: 'o número que ao quadrado dá 9' },
          { latex: 'a^{m/n} = \\sqrt[n]{a^m}', porque: 'em geral' },
        ],
      },
    },
    {
      titulo: 'Duas armadilhas',
      texto: 'Potência não se distribui na soma: $(3 + 4)^2 = 49$, mas $3^2 + 4^2 = 25$. Raiz também não: $\\sqrt{9 + 16} = \\sqrt{25} = 5$, mas $\\sqrt{9} + \\sqrt{16} = 7$. E o expoente vem antes do sinal: $-2^4 = -16$, enquanto $(-2)^4 = 16$.',
    },
  ],
  resumo: '$a^m\\cdot a^n = a^{m+n}$, $\\frac{a^m}{a^n} = a^{m-n}$, $(a^m)^n = a^{mn}$. Do padrão para trás: $a^0 = 1$ e $a^{-n} = \\frac{1}{a^n}$. Raiz é expoente fracionário: $a^{1/n} = \\sqrt[n]{a}$. Potência e raiz não se distribuem em soma.',
  exemplos: [
    {
      enunciado: 'Simplifique $\\frac{2^5\\cdot 2^{-2}}{2}$.',
      passos: [
        { texto: '$2^5\\cdot 2^{-2} = 2^{5 + (-2)} = 2^3$', porque: 'Multiplicar soma os expoentes.' },
        { texto: '$\\frac{2^3}{2^1} = 2^{3-1} = 2^2$', porque: 'Dividir subtrai; o 2 sozinho é $2^1$.' },
        { texto: '$2^2 = 4$', porque: 'Resultado.' },
      ],
    },
    {
      enunciado: 'Calcule $8^{2/3}$.',
      passos: [
        { texto: '$8^{2/3} = (8^{1/3})^2$', porque: '$\\frac{2}{3} = \\frac{1}{3}\\cdot 2$: primeiro a raiz cúbica, depois o quadrado.' },
        { texto: '$8^{1/3} = \\sqrt[3]{8} = 2$', porque: '$2\\cdot 2\\cdot 2 = 8$.', lacuna: { pergunta: 'Quanto vale $\\sqrt[3]{8}$?', resposta: { tipo: 'numero', valor: 2 } } },
        { texto: '$2^2 = 4$', porque: 'Agora o quadrado.' },
      ],
    },
    {
      enunciado: 'Calcule $\\frac{(3^2)^3}{3^4}$.',
      passos: [
        { texto: '$(3^2)^3 = 3^6$', porque: 'Potência de potência multiplica: $2\\cdot 3 = 6$.', lacuna: { pergunta: 'Qual é o expoente de $(3^2)^3$?', resposta: { tipo: 'numero', valor: 6 } } },
        { texto: '$\\frac{3^6}{3^4} = 3^{6-4} = 3^2$', porque: 'Dividir subtrai os expoentes.' },
        { texto: '$3^2 = 9$', porque: 'Resultado.', lacuna: { pergunta: 'Quanto vale $3^2$?', resposta: { tipo: 'numero', valor: 9 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale $4^{3/2}$?',
      resposta: { tipo: 'numero', valor: 8 },
      dica: 'Primeiro a raiz quadrada de 4, depois o cubo.',
      resolucao: [
        { texto: '$4^{3/2} = (4^{1/2})^3$', porque: '$\\frac{3}{2} = \\frac{1}{2}\\cdot 3$.' },
        { texto: '$(4^{1/2})^3 = 2^3 = 8$', porque: '$\\sqrt{4} = 2$.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\frac{2^{10}}{2^7}$?',
      resposta: { tipo: 'numero', valor: 8 },
      dica: 'Dividir subtrai os expoentes.',
      resolucao: [
        { texto: '$\\frac{2^{10}}{2^7} = 2^{10-7} = 2^3 = 8$', porque: 'Sete fatores 2 se cancelam.' },
      ],
    },
    {
      enunciado: 'Quanto vale $-2^4$?',
      resposta: { tipo: 'numero', valor: -16 },
      dica: 'O expoente age só no número ao lado dele. O sinal vem depois.',
      resolucao: [
        { texto: '$-2^4 = -(2^4) = -16$', porque: 'Sem parênteses, só o 2 é elevado. Com parênteses, $(-2)^4$ daria 16.' },
      ],
    },
    {
      enunciado: 'Que expoente $n$ faz $2^n = \\frac{1}{8}$?',
      resposta: { tipo: 'numero', valor: -3 },
      dica: '$8 = 2^3$, e um sobre uma potência é expoente negativo.',
      resolucao: [
        { texto: '$\\frac{1}{8} = \\frac{1}{2^3} = 2^{-3}$', porque: '$a^{-n} = \\frac{1}{a^n}$.' },
        { texto: '$n = -3$', porque: 'Três passos para trás a partir de $2^0 = 1$.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\sqrt{9} + \\sqrt{16} - \\sqrt{9 + 16}$?',
      resposta: { tipo: 'numero', valor: 2 },
      dica: 'Faça a soma de dentro da última raiz antes de tirar a raiz.',
      resolucao: [
        { texto: '$\\sqrt{9 + 16} = \\sqrt{25} = 5$', porque: 'Primeiro a soma, depois a raiz.' },
        { texto: '$3 + 4 - 5 = 2$', porque: 'Se a raiz se distribuísse, o resultado seria 0. Não se distribui.' },
      ],
    },
    {
      enunciado: 'Se $2^x = 5$, quanto vale $4^x$?',
      resposta: { tipo: 'numero', valor: 25 },
      dica: 'Escreva 4 como potência de 2.',
      resolucao: [
        { texto: '$4^x = (2^2)^x = (2^x)^2$', porque: 'Potência de potência: a ordem dos expoentes não importa.' },
        { texto: '$(2^x)^2 = 5^2 = 25$', porque: 'Troca $2^x$ por 5 sem precisar achar $x$.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
    {
      enunciado: 'Quanto vale $\\frac{2^{2026} + 2^{2025}}{2^{2024}}$?',
      resposta: { tipo: 'numero', valor: 6 },
      dica: 'Ninguém calcula $2^{2026}$. Coloque $2^{2024}$ em evidência no numerador.',
      resolucao: [
        { texto: '$2^{2026} + 2^{2025} = 2^{2024}(2^2 + 2^1) = 2^{2024}\\cdot 6$', porque: 'Multiplicar soma expoentes: $2^{2024}\\cdot 2^2 = 2^{2026}$.' },
        { texto: '$\\frac{2^{2024}\\cdot 6}{2^{2024}} = 6$', porque: 'O $2^{2024}$ se cancela.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Por que $2^0 = 1$, e não 0?',
    resposta: 'Porque cada passo para trás no expoente divide por 2: $2^1 = 2$, então $2^0 = 2 \\div 2 = 1$.',
  },
};
