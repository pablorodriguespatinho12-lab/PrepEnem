import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C8_EXP_LOG_TRIG: ConteudoLicao = {
  gancho: {
    pergunta: 'Existe um carro cuja velocidade é sempre igual ao km em que ele está? No km 5, andando a 5 km por minuto; no km 20, a 20?',
    ideia: 'Existe: o carro que anda pela regra $e^x$, com $e \\approx 2{,}718$. Essa função é a própria derivada. Por isso ela aparece em tudo que cresce na proporção do próprio tamanho: dinheiro, população, bactérias.',
  },
  construcao: [
    {
      titulo: 'O carro que anda tão rápido quanto está longe',
      texto: 'Ande o relógio e compare os dois números da linha: o km e o velocímetro. São sempre iguais. Quanto mais longe o carro está, mais rápido anda, na mesma medida. Esse carro anda pela regra $e^x$.',
      visual: {
        tipo: 'cena', titulo: 'Posição e velocímetro iguais: s(x) = eˣ', x: [0, 4], unidadeX: 'min', unidadeY: 'km', velocimetro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: 'e^x', diz: 'os km e também o velocímetro' }],
        veiculos: [{ veiculo: 'carro', nome: 's', expr: 'e^x', cor: 'a' }],
      },
    },
    {
      titulo: 'Por que 2,718',
      texto: 'Toda exponencial anda com velocidade proporcional à posição, mas o fator muda com a base. Em $2^x$, o velocímetro marca 0,69 vezes o km; em $3^x$, 1,10 vezes. Entre 2 e 3 existe uma base em que o fator é exatamente 1: o número $e$.',
      visual: {
        tipo: 'tabela', titulo: 'Velocidade dividida pela posição',
        cabecalho: ['regra', 'velocímetro ÷ km'],
        linhas: [['$2^x$', '0,69'], ['$e^x$, com $e \\approx 2{,}718$', '1'], ['$3^x$', '1,10']],
      },
    },
    {
      titulo: 'A derivada do ln, pela inversa',
      texto: 'O $\\ln$ é o log na base $e$: ele desfaz a exponencial. Se $y = \\ln x$, então $x = e^y$. Derivando os dois lados com a regra da cadeia, a derivada do $\\ln$ aparece sozinha.',
      visual: {
        tipo: 'transformacao', titulo: 'Derivada do ln',
        linhas: [
          { latex: 'y = \\ln x \\;\\Rightarrow\\; x = e^{y}', porque: 'o ln desfaz a exponencial' },
          { latex: "1 = e^{y}\\cdot y'", porque: 'deriva os dois lados; regra da cadeia à direita' },
          { latex: "y' = \\frac{1}{e^{y}} = \\frac{1}{x}", porque: 'e^y é o próprio x' },
        ],
      },
    },
    {
      titulo: 'A derivada do seno, olhando o gráfico',
      texto: 'Onde o [[a:seno]] está no topo, em $\\frac{\\pi}{2}$, ele para de subir: inclinação 0. E o [[b:cosseno]] vale 0 ali. Onde o seno cruza o zero subindo, a inclinação é a maior, 1, e o cosseno vale 1. Ponto a ponto, a inclinação do seno é o cosseno.',
      visual: {
        tipo: 'grafico', titulo: 'A inclinação do seno é o cosseno',
        funcoes: [{ expr: 'sin(x)', rotulo: 'sen x', cor: 'a' }, { expr: 'cos(x)', rotulo: 'cos x', cor: 'b' }],
        pontos: [{ x: 1.5708, y: 1, rotulo: 'topo: inclinação 0', cor: 'a' }, { x: 1.5708, y: 0, rotulo: 'cos = 0', cor: 'b' }],
        x: [0, 6.29], y: [-1.5, 1.5],
      },
    },
    {
      titulo: 'As quatro derivadas',
      texto: 'Repetindo a ideia com o cosseno, a inclinação dele é $-\\operatorname{sen} x$. O sinal de menos aparece porque, logo depois de 0, o cosseno desce enquanto o seno sobe.',
      visual: {
        tipo: 'tabela', titulo: 'Quatro derivadas para guardar',
        cabecalho: ['função', 'derivada'],
        linhas: [['$e^x$', '$e^x$'], ['$\\ln x$', '$\\frac{1}{x}$'], ['$\\operatorname{sen} x$', '$\\cos x$'], ['$\\cos x$', '$-\\operatorname{sen} x$']],
      },
    },
    {
      titulo: 'Com a regra da cadeia',
      texto: 'Com algo dentro, a taxa de dentro multiplica, como em qualquer engrenagem.',
      visual: {
        tipo: 'transformacao', titulo: 'Cadeia nas quatro',
        linhas: [
          { latex: "(e^{3x})' = 3e^{3x}", porque: 'dentro: 3x, taxa 3' },
          { latex: "(\\operatorname{sen} 2x)' = 2\\cos 2x", porque: 'dentro: 2x, taxa 2' },
          { latex: "(\\ln(x^2 + 1))' = \\frac{2x}{x^2 + 1}", porque: 'dentro: x² + 1, taxa 2x' },
        ],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'População, juros contínuos, decaimento radioativo, vibração de uma corda e corrente da tomada: tudo isso se descreve com essas quatro derivadas e a regra da cadeia.',
    },
  ],
  resumo: "$(e^x)' = e^x$; $(\\ln x)' = \\frac{1}{x}$; $(\\operatorname{sen} x)' = \\cos x$; $(\\cos x)' = -\\operatorname{sen} x$. Com a regra da cadeia: $(e^{kx})' = k\\,e^{kx}$ e $(\\operatorname{sen} kx)' = k\\cos kx$.",
  exemplos: [
    {
      enunciado: 'Derive $5e^x + \\ln x$.',
      passos: [
        { texto: "$(5e^x)' = 5e^x$", porque: 'A constante acompanha; $e^x$ não muda.' },
        { texto: "$(\\ln x)' = \\frac{1}{x}$", porque: 'Pela inversa.' },
        { texto: 'Total: $5e^x + \\frac{1}{x}$', porque: 'Soma deriva parte por parte.' },
      ],
    },
    {
      enunciado: 'Derive $e^{4x}$ e calcule a derivada em $x = 0$.',
      passos: [
        { texto: '$4e^{4x}$', porque: 'Regra da cadeia: dentro, $4x$ tem taxa 4.' },
        { texto: 'Em 0: $4e^0 = 4$', porque: '$e^0 = 1$.', lacuna: { pergunta: 'Quanto vale a derivada em 0?', resposta: { tipo: 'numero', valor: 4 } } },
      ],
    },
    {
      enunciado: 'Derive $\\operatorname{sen}(2x)$ e calcule a derivada em $x = 0$ e em $x = \\frac{\\pi}{2}$.',
      passos: [
        { texto: '$2\\cos(2x)$', porque: 'Dentro, $2x$ tem taxa 2.' },
        { texto: 'Em 0: $2\\cos 0 = 2$', porque: '$\\cos 0 = 1$.', lacuna: { pergunta: 'Quanto vale em 0?', resposta: { tipo: 'numero', valor: 2 } } },
        { texto: 'Em $\\frac{\\pi}{2}$: $2\\cos\\pi = -2$', porque: '$\\cos\\pi = -1$: ali a onda desce.', lacuna: { pergunta: 'Quanto vale em $\\frac{\\pi}{2}$?', resposta: { tipo: 'numero', valor: -2 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale a derivada de $e^x$ em $x = 0$?',
      resposta: { tipo: 'numero', valor: 1 },
      dica: 'A derivada é a própria função.',
      resolucao: [
        { texto: '$e^0 = 1$', porque: 'A inclinação em 0 é o valor em 0.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $\\ln x$ em $x = 4$?',
      resposta: { tipo: 'numero', valor: 0.25 },
      dica: 'A derivada de $\\ln x$ é $\\frac{1}{x}$.',
      resolucao: [
        { texto: '$\\frac{1}{4}$, que dá 0,25', porque: 'Quanto maior o $x$, mais devagar o log cresce.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $\\operatorname{sen} x$ em $x = 0$?',
      resposta: { tipo: 'numero', valor: 1 },
      dica: 'A derivada do seno é o cosseno.',
      resolucao: [
        { texto: '$\\cos 0 = 1$', porque: 'Em 0 o seno sobe o mais rápido que consegue.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $\\cos x$ em $x = \\frac{\\pi}{2}$?',
      resposta: { tipo: 'numero', valor: -1 },
      dica: 'A derivada do cosseno é $-\\operatorname{sen} x$.',
      resolucao: [
        { texto: '$-\\operatorname{sen}\\frac{\\pi}{2} = -1$', porque: 'Ali o cosseno desce o mais rápido.' },
      ],
    },
    {
      enunciado: 'Uma população é $P(t) = 1000e^{0{,}02t}$, com $t$ em anos. Quantos indivíduos por ano ela está crescendo em $t = 0$?',
      resposta: { tipo: 'numero', valor: 20 },
      dica: 'Regra da cadeia: dentro, $0{,}02t$ tem taxa 0,02.',
      resolucao: [
        { texto: "$P'(t) = 1000\\cdot 0{,}02\\, e^{0{,}02t}$", porque: 'Cadeia na exponencial.' },
        { texto: 'Em 0: $1000\\cdot 0{,}02 = 20$', porque: 'Cresce 2% do tamanho por ano: 20 de 1000.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Quanto vale a derivada de $\\ln(x^2 + 1)$ em $x = 1$?',
      resposta: { tipo: 'numero', valor: 1 },
      dica: 'Fora: $\\ln u$, taxa $\\frac{1}{u}$. Dentro: $x^2 + 1$, taxa $2x$.',
      resolucao: [
        { texto: 'A derivada é $\\frac{2x}{x^2 + 1}$', porque: 'Regra da cadeia com o log.' },
        { texto: 'Em 1: $\\frac{2}{2} = 1$', porque: 'Troca $x$ por 1.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Qual é a derivada de $e^x$? O que isso quer dizer para um carro andando por essa regra?',
    resposta: 'É o próprio $e^x$: a velocidade é sempre igual à posição. Quanto mais longe, mais rápido, na mesma medida.',
  },
};
