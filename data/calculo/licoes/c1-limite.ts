import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C1_LIMITE: ConteudoLicao = {
  gancho: {
    pergunta: 'Quanto vale $\\frac{x^2 - 1}{x - 1}$ quando $x = 1$? E quando $x = 0{,}999$?',
    ideia: 'Em $x = 1$ a conta dá $\\frac{0}{0}$, que não é número. Mas em 0,999 ela dá 1,999, e em 1,001 dá 2,001. A função não tem valor em 1, mas os valores perto de 1 apontam para 2. Esse "para onde aponta" é o **limite**.',
  },
  construcao: [
    {
      titulo: 'O carro que se aproxima do pedágio',
      texto: 'A cada minuto, o carro anda metade do que falta até o pedágio, no km 10: vai para 5, 7,5, 8,75... Ele chega tão perto quanto se quiser, mas a regra nunca o põe no km 10. Mesmo assim, todo mundo sabe dizer para onde ele vai: o km 10. Dizer "para onde vai" sem precisar chegar é a ideia de **limite**.',
      visual: {
        tipo: 'cena', titulo: 'Metade do que falta, a cada minuto', x: [0, 6], unidadeX: 'min', unidadeY: 'km', rastro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '10', diz: 'o pedágio, no km 10' }, { termo: '0{,}5^x', diz: 'o que falta cai pela metade a cada minuto' }],
        veiculos: [{ veiculo: 'carro', nome: 'p', expr: '10-10*0.5^x', cor: 'a' }],
      },
    },
    {
      titulo: 'Uma conta que dá 0/0',
      texto: 'Em $f(x) = \\frac{x^2 - 1}{x - 1}$, trocar $x$ por 1 dá $\\frac{0}{0}$: a função tem um buraco em $x = 1$. Mas dá para chegar perto dele pelos dois lados. Pela esquerda e pela direita, os valores apontam para o mesmo número: 2.',
      visual: {
        tipo: 'tabela', titulo: 'f(x) = (x² − 1)/(x − 1) perto de 1',
        cabecalho: ['x', 'f(x)'],
        linhas: [['0,9', '1,9'], ['0,99', '1,99'], ['0,999', '1,999'], ['1', 'não existe'], ['1,001', '2,001'], ['1,01', '2,01'], ['1,1', '2,1']],
      },
    },
    {
      titulo: 'No gráfico: uma reta com um furo',
      texto: 'O desenho é a reta $y = x + 1$ com um furo em $x = 1$. Andando sobre a reta em direção ao furo, por qualquer lado, a altura vai para 2. O limite é a altura do furo, mesmo que o ponto não esteja lá.',
      visual: {
        tipo: 'grafico', titulo: 'Uma reta com um furo em x = 1',
        funcoes: [{ expr: '(x^2-1)/(x-1)', rotulo: 'f(x)', cor: 'a' }],
        pontos: [{ x: 1, y: 2, rotulo: 'furo: f(1) não existe', cor: 'b', aberto: true }],
        x: [-1, 3], y: [-1, 5],
      },
    },
    {
      titulo: 'A notação',
      texto: 'Escreve-se $\\lim_{x \\to 1} f(x) = 2$ e lê-se "o limite de $f(x)$, quando $x$ tende a 1, é 2". O limite olha só para os vizinhos de 1. O que acontece exatamente em 1 não conta: pode ser outro valor, ou nada.',
      visual: {
        tipo: 'transformacao', titulo: 'Lendo a notação',
        linhas: [
          { latex: '\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} = 2', porque: 'perto de 1, a função chega perto de 2' },
          { latex: 'f(1)\\ \\text{não existe}', porque: 'o valor no ponto não importa para o limite' },
        ],
      },
    },
    {
      titulo: 'De onde vem o 2: simplificar',
      texto: 'Não precisa de tabela toda vez. O $\\frac{0}{0}$ avisa que há um fator escondido nos dois lados da fração. Fatore, corte, e o buraco some da conta.',
      visual: {
        tipo: 'transformacao', titulo: 'Tirando o 0/0',
        linhas: [
          { latex: '\\frac{x^2 - 1}{x - 1} = \\frac{(x - 1)(x + 1)}{x - 1}', porque: 'diferença de quadrados' },
          { latex: '= x + 1, \\quad \\text{para } x \\ne 1', porque: 'corta o x − 1, que não é zero perto de 1' },
          { latex: '\\lim_{x \\to 1}(x + 1) = 2', porque: 'agora é só trocar x por 1' },
        ],
      },
    },
    {
      titulo: 'Quando o limite não existe',
      texto: 'Em $\\frac{1}{x}$, chegando perto de 0 pela direita, os valores sobem sem parar: 10, 100, 1000. Pela esquerda, descem sem parar. Não há um número para onde os dois lados apontem: o limite não existe.',
      visual: {
        tipo: 'grafico', titulo: '1/x perto de 0',
        funcoes: [{ expr: '1/x', rotulo: '1/x', cor: 'a' }],
        x: [-3, 3], y: [-10, 10],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'A velocidade no instante, da lição de taxa média, é um limite: a média quando o intervalo encolhe até zero. Ali também aparece um $\\frac{0}{0}$, e a lição de derivada resolve exatamente isso com o que você viu aqui.',
    },
  ],
  resumo: '$\\lim_{x \\to a} f(x) = L$: quando $x$ chega perto de $a$, por qualquer lado, $f(x)$ chega perto de $L$. O valor em $a$ não importa e pode nem existir. Se der $\\frac{0}{0}$, fatore, corte e tente de novo. Se os lados apontam para lugares diferentes ou crescem sem parar, o limite não existe.',
  exemplos: [
    {
      enunciado: 'Calcule $\\lim_{x \\to 3} (2x + 1)$.',
      passos: [
        { texto: 'Perto de 3, $2x + 1$ fica perto de $2\\cdot 3 + 1$.', porque: 'Não há buraco: dá para trocar $x$ por 3 direto.' },
        { texto: '$2\\cdot 3 + 1 = 7$', porque: 'Conta.' },
        { texto: '$\\lim_{x \\to 3} (2x + 1) = 7$', porque: 'Aqui o limite é igual ao valor da função em 3.' },
      ],
    },
    {
      enunciado: 'Calcule $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$.',
      passos: [
        { texto: 'Trocar $x$ por 2 dá $\\frac{0}{0}$.', porque: 'É preciso simplificar antes.' },
        { texto: '$\\frac{(x - 2)(x + 2)}{x - 2}$ vira $x + 2$', porque: 'Diferença de quadrados; corta o $x - 2$.' },
        { texto: '$\\lim_{x \\to 2}(x + 2) = 4$', porque: 'Agora troca $x$ por 2.', lacuna: { pergunta: 'Qual é o limite?', resposta: { tipo: 'numero', valor: 4 } } },
      ],
    },
    {
      enunciado: 'Calcule $\\lim_{x \\to 5} \\frac{x^2 - 25}{x - 5}$.',
      passos: [
        { texto: '$x^2 - 25$ fatora em $(x - 5)(x + 5)$', porque: 'Diferença de quadrados: $25 = 5^2$.', lacuna: { pergunta: 'Que número completa $(x - 5)(x + \\ ?)$?', resposta: { tipo: 'numero', valor: 5 } } },
        { texto: 'Cortando o $x - 5$, sobra $x + 5$.', porque: 'Perto de 5, $x - 5$ não é zero.' },
        { texto: '$\\lim_{x \\to 5}(x + 5) = 10$', porque: 'Troca $x$ por 5.', lacuna: { pergunta: 'Qual é o limite?', resposta: { tipo: 'numero', valor: 10 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale $\\lim_{x \\to 4} (x^2 - 1)$?',
      resposta: { tipo: 'numero', valor: 15 },
      dica: 'Não há buraco: troque $x$ por 4.',
      resolucao: [
        { texto: '$4^2 - 1 = 15$', porque: 'Função sem buraco: o limite é o valor.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$?',
      resposta: { tipo: 'numero', valor: 6 },
      dica: 'Dá $\\frac{0}{0}$. Fatore o $x^2 - 9$.',
      resolucao: [
        { texto: '$\\frac{(x - 3)(x + 3)}{x - 3}$ vira $x + 3$', porque: 'Diferença de quadrados.' },
        { texto: '$3 + 3 = 6$', porque: 'Troca $x$ por 3 na forma simplificada.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\lim_{x \\to 0} \\frac{x^2 + 5x}{x}$?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: 'Coloque $x$ em evidência no numerador.',
      resolucao: [
        { texto: '$\\frac{x(x + 5)}{x}$ vira $x + 5$', porque: 'Corta o $x$, que não é zero perto de 0.' },
        { texto: '$0 + 5 = 5$', porque: 'Troca $x$ por 0.' },
      ],
    },
    {
      enunciado: 'Perto de 2, uma função vale: $f(1{,}9) = 6{,}8$, $f(1{,}99) = 6{,}98$, $f(2{,}01) = 7{,}02$ e $f(2{,}1) = 7{,}2$. Qual parece ser o limite quando $x$ tende a 2?',
      resposta: { tipo: 'numero', valor: 7 },
      dica: 'Para onde os valores vão, dos dois lados?',
      resolucao: [
        { texto: 'Pela esquerda: 6,8 e 6,98, subindo em direção a 7.', porque: 'Cada vez mais perto de 7.' },
        { texto: 'Pela direita: 7,2 e 7,02, descendo em direção a 7.', porque: 'Os dois lados concordam.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\lim_{x \\to 1} \\frac{x^3 - 1}{x - 1}$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: '$x^3 - 1$ também tem o fator $x - 1$ escondido. Qual é o outro fator?',
      resolucao: [
        { texto: '$x^3 - 1$ fatora em $(x - 1)(x^2 + x + 1)$', porque: 'Confira multiplicando: dá $x^3 - 1$.' },
        { texto: '$\\lim_{x \\to 1}(x^2 + x + 1) = 3$', porque: '$1 + 1 + 1$.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Quanto vale $\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4}$?',
      resposta: { tipo: 'numero', valor: 0.25 },
      dica: 'Pense em $x - 4$ como diferença de quadrados: $(\\sqrt{x})^2 - 2^2$.',
      resolucao: [
        { texto: '$x - 4$ fatora em $(\\sqrt{x} - 2)(\\sqrt{x} + 2)$', porque: 'Diferença de quadrados com $\\sqrt{x}$.' },
        { texto: 'Cortando, sobra $\\frac{1}{\\sqrt{x} + 2}$; em 4, $\\frac{1}{2 + 2}$, que dá 0,25', porque: 'Agora dá para trocar $x$ por 4.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'O limite de $f$ quando $x$ tende a $a$ depende do valor $f(a)$?',
    resposta: 'Não. O limite olha só para os valores perto de $a$. O $f(a)$ pode ser outro número ou nem existir.',
  },
};
