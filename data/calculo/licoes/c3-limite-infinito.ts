import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C3_LIMITE_INFINITO: ConteudoLicao = {
  gancho: {
    pergunta: 'Um remédio no sangue cai à metade a cada hora, começando em 80 mg. Depois de 100 horas, quanto sobra? Chega a zero?',
    ideia: 'Sobra $80\\cdot(\\frac{1}{2})^{100}$, um número com 28 zeros depois da vírgula antes do primeiro algarismo. Nunca chega a zero, mas fica tão perto quanto se quiser. Dizemos que, quando o tempo vai para o infinito, o limite é 0.',
  },
  construcao: [
    {
      titulo: 'O balão que desce e nunca encosta',
      texto: 'Um balão perde metade da altura a cada minuto: 80 m, 40, 20, 10... Ande o relógio. Ele desce cada vez mais devagar e chega tão perto do chão quanto se quiser, mas pela regra nunca encosta. Para onde ele vai, com o tempo indo para o infinito? Para 0.',
      visual: {
        tipo: 'cena', titulo: 'Metade da altura a cada minuto', x: [0, 8], unidadeX: 'min', unidadeY: 'm', rastro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '80', diz: 'a altura no começo (m)' }, { termo: '0{,}5^x', diz: 'a metade a cada minuto' }],
        veiculos: [{ veiculo: 'balao', nome: 'b', expr: '80*0.5^x', cor: 'a' }],
      },
    },
    {
      titulo: 'A assíntota horizontal',
      texto: 'Em $f(x) = 2 + \\frac{1}{x}$, quando $x$ cresce, o $\\frac{1}{x}$ some: em 1000 ele vale 0,001. A função encosta cada vez mais na reta $y = 2$, sem tocar. Essa reta é a [[c:assíntota horizontal]], e escreve-se $\\lim_{x \\to \\infty} f(x) = 2$.',
      visual: {
        tipo: 'grafico', titulo: '2 + 1/x encostando em y = 2',
        funcoes: [{ expr: '2+1/x', rotulo: 'f(x)', cor: 'a' }, { expr: '2', rotulo: 'assíntota: y = 2', cor: 'c' }],
        x: [0, 10], y: [0, 6],
      },
    },
    {
      titulo: 'A assíntota vertical',
      texto: 'Em $\\frac{1}{x - 2}$, perto de $x = 2$ o denominador vai a zero e a função explode: sobe sem parar de um lado e desce sem parar do outro. O gráfico fica colado na reta vertical $x = 2$, a **assíntota vertical**. Onde o denominador zera, procure uma.',
      visual: {
        tipo: 'grafico', titulo: '1/(x − 2) explodindo perto de 2',
        funcoes: [{ expr: '1/(x-2)', rotulo: 'f(x)', cor: 'a' }],
        x: [-1, 5], y: [-10, 10],
      },
    },
    {
      titulo: 'Quem cresce mais rápido',
      texto: 'Uma corrida: o carro anda pela regra $x^3$ e a moto por $2^x$. No começo o carro dispara: no minuto 5, 125 contra 32. Ande até o minuto 10: a moto passa, 1024 contra 1000. A exponencial sempre acaba ganhando de qualquer potência de $x$, porque multiplica a cada passo.',
      visual: {
        tipo: 'cena', titulo: 'Carro x³ contra moto 2ˣ', x: [0, 10], unidadeX: 'min', unidadeY: 'km',
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: 'x^3', diz: 'o carro' }, { termo: '2^x', diz: 'a moto, que dobra a cada minuto' }],
        veiculos: [
          { veiculo: 'carro', nome: 'f', expr: 'x^3', cor: 'a' },
          { veiculo: 'moto', nome: 'g', expr: '2^x', cor: 'b' },
        ],
      },
    },
    {
      titulo: 'No infinito, manda o termo mais forte',
      texto: 'Quando em cima e embaixo tudo cresce, quem decide é o termo mais forte de cada lado. Divida tudo por ele: o que sobra de fraco vira zero.',
      visual: {
        tipo: 'transformacao', titulo: 'Dividindo pelo mais forte',
        linhas: [
          { latex: '\\lim_{x \\to \\infty} \\frac{3x^2 + 1}{x^2 + 5}', porque: 'em cima e embaixo crescem' },
          { latex: '= \\lim_{x \\to \\infty} \\frac{3 + \\frac{1}{x^2}}{1 + \\frac{5}{x^2}}', porque: 'divide tudo por x²' },
          { latex: '= \\frac{3 + 0}{1 + 0} = 3', porque: 'os fracos somem' },
        ],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Saber quem cresce mais rápido decide se um programa termina em segundos ou em séculos, e se uma epidemia ou uma dívida sai do controle. É a pergunta "para onde isso vai no longo prazo?".',
    },
  ],
  resumo: '$\\lim_{x \\to \\infty} f(x) = L$: quando $x$ cresce sem parar, $f(x)$ chega perto de $L$, e a reta $y = L$ é assíntota horizontal. Onde o denominador zera costuma haver assíntota vertical. No infinito, manda o termo mais forte; a exponencial ganha de qualquer potência de $x$.',
  exemplos: [
    {
      enunciado: 'Calcule $\\lim_{x \\to \\infty} \\frac{1}{x}$.',
      passos: [
        { texto: 'Para $x$ igual a 10, 100 e 1000, $\\frac{1}{x}$ vale 0,1, 0,01 e 0,001.', porque: 'Dividir 1 por números cada vez maiores.' },
        { texto: 'Os valores encostam em 0, sem chegar.', porque: 'Sempre positivos, cada vez menores.' },
        { texto: '$\\lim_{x \\to \\infty}\\frac{1}{x} = 0$', porque: 'O eixo $x$ é a assíntota horizontal.' },
      ],
    },
    {
      enunciado: 'Calcule $\\lim_{x \\to \\infty} \\frac{6x + 1}{2x}$.',
      passos: [
        { texto: 'Dividindo tudo por $x$: $\\frac{6 + \\frac{1}{x}}{2}$', porque: 'O termo mais forte é $x$.' },
        { texto: 'Com $x$ enorme, $\\frac{1}{x}$ some.', porque: 'É o exemplo anterior.' },
        { texto: '$\\frac{6}{2} = 3$', porque: 'O que sobra.', lacuna: { pergunta: 'Qual é o limite?', resposta: { tipo: 'numero', valor: 3 } } },
      ],
    },
    {
      enunciado: 'Calcule $\\lim_{x \\to \\infty} \\frac{4x^2 - x}{2x^2 + 3}$.',
      passos: [
        { texto: 'Dividindo por $x^2$: $\\frac{4 - \\frac{1}{x}}{2 + \\frac{3}{x^2}}$', porque: 'O mais forte de cada lado é $x^2$.' },
        { texto: 'Em cima sobra 4; embaixo sobra 2.', porque: 'As frações com $x$ embaixo somem.', lacuna: { pergunta: 'O que sobra em cima?', resposta: { tipo: 'numero', valor: 4 } } },
        { texto: '$\\frac{4}{2} = 2$', porque: 'O limite é a razão dos termos mais fortes.', lacuna: { pergunta: 'Qual é o limite?', resposta: { tipo: 'numero', valor: 2 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale $\\lim_{x \\to \\infty} \\frac{5}{x}$?',
      resposta: { tipo: 'numero', valor: 0 },
      dica: '5 dividido por um número enorme.',
      resolucao: [
        { texto: '$\\lim_{x \\to \\infty} \\frac{5}{x} = 0$', porque: 'O denominador cresce sem parar; a fração some.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\lim_{x \\to \\infty} \\left(3 + \\frac{2}{x}\\right)$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'O que acontece com $\\frac{2}{x}$?',
      resolucao: [
        { texto: '$3 + 0 = 3$', porque: '$\\frac{2}{x}$ some; a assíntota é $y = 3$.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\lim_{x \\to \\infty} \\frac{8x^2}{2x^2 + 1}$?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Divida tudo por $x^2$.',
      resolucao: [
        { texto: 'Dividindo por $x^2$: $\\frac{8}{2 + \\frac{1}{x^2}}$', porque: 'O mais forte é $x^2$.' },
        { texto: '$\\frac{8}{2} = 4$', porque: 'O $\\frac{1}{x^2}$ some.' },
      ],
    },
    {
      enunciado: 'Em que valor de $x$ a função $\\frac{1}{x - 5}$ tem assíntota vertical?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: 'Onde o denominador zera?',
      resolucao: [
        { texto: '$x - 5 = 0$ quando $x = 5$', porque: 'Ali a função explode.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\lim_{x \\to \\infty} \\left(\\sqrt{x^2 + 4x} - x\\right)$?',
      resposta: { tipo: 'numero', valor: 2 },
      dica: 'Multiplique e divida por $\\sqrt{x^2 + 4x} + x$.',
      resolucao: [
        { texto: 'Vira $\\frac{(x^2 + 4x) - x^2}{\\sqrt{x^2 + 4x} + x}$, que é $\\frac{4x}{\\sqrt{x^2 + 4x} + x}$', porque: 'Diferença de quadrados some com a raiz em cima.' },
        { texto: 'Dividindo por $x$: $\\frac{4}{\\sqrt{1 + \\frac{4}{x}} + 1}$', porque: 'Dentro da raiz, dividir por $x$ é dividir por $x^2$.' },
        { texto: '$\\frac{4}{1 + 1} = 2$', porque: 'O $\\frac{4}{x}$ some.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'A população de peixes de um lago segue $P(t) = \\frac{1000t}{t + 4}$, com $t$ em anos. De qual número a população se aproxima com o passar do tempo?',
      resposta: { tipo: 'numero', valor: 1000 },
      dica: 'Divida em cima e embaixo por $t$.',
      resolucao: [
        { texto: 'Dividindo por $t$: $\\frac{1000}{1 + \\frac{4}{t}}$', porque: 'O mais forte de cada lado é $t$.' },
        { texto: '$\\frac{1000}{1 + 0} = 1000$', porque: 'O lago tem um teto: a assíntota é $P = 1000$.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
  ],
  recuperacao: {
    pergunta: 'O que é uma assíntota horizontal?',
    resposta: 'É a reta $y = L$ da qual o gráfico chega cada vez mais perto quando $x$ cresce sem parar: $\\lim_{x \\to \\infty} f(x) = L$.',
  },
};
