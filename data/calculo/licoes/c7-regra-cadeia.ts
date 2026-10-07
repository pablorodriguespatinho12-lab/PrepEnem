import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C7_REGRA_CADEIA: ConteudoLicao = {
  gancho: {
    pergunta: 'O táxi da lição de composição anda 2 km por minuto, e o taxímetro cobra R$ 2 por km. Quantos reais por minuto o preço sobe?',
    ideia: 'São 2 km por minuto, e cada km custa R$ 2: o preço sobe $2\\cdot 2 = 4$ reais por minuto. As taxas de máquinas em fila se **multiplicam**, como engrenagens. Essa é a regra da cadeia.',
  },
  construcao: [
    {
      titulo: 'Engrenagens',
      texto: 'O velocímetro marca 2 km por minuto. O taxímetro transforma km em reais, a 2 reais por km. Então a cada minuto o preço sobe $2\\cdot 2 = 4$ reais. Como engrenagens: a primeira gira 2 vezes mais rápido que o relógio, a segunda gira 2 vezes mais que a primeira, e no fim tudo anda 4 vezes.',
      visual: {
        tipo: 'cena', titulo: 'O táxi: 2 km por minuto', x: [0, 5], unidadeX: 'min', unidadeY: 'km', velocimetro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '2', diz: 'km por minuto: o velocímetro' }],
        veiculos: [{ veiculo: 'carro', nome: 'f', expr: '2*x', rotulo: 'táxi', cor: 'a' }],
      },
    },
    {
      titulo: 'A regra',
      texto: 'Para $p(t) = g(f(t))$, a taxa de $p$ é a taxa de $g$ vezes a taxa de $f$. O detalhe: a taxa de $g$ é medida no ponto onde $f$ está. Escrita com as unidades, a regra é uma conversão: reais por km vezes km por minuto dá reais por minuto.',
      visual: {
        tipo: 'transformacao', titulo: 'Regra da cadeia',
        linhas: [
          { latex: 'p(t) = g(f(t))', porque: 'máquinas em fila' },
          { latex: "p'(t) = g'(f(t))\\cdot f'(t)", porque: 'taxa de fora, onde a de dentro está, vezes taxa de dentro' },
          { latex: '\\frac{\\text{reais}}{\\text{min}} = \\frac{\\text{reais}}{\\text{km}}\\cdot\\frac{\\text{km}}{\\text{min}}', porque: 'as unidades se cancelam como frações' },
        ],
      },
    },
    {
      titulo: 'Quando a taxa de fora muda',
      texto: 'No táxi, a taxa de fora é sempre 2. Em $(3x + 1)^2$, não: de dentro, $3x + 1$ anda 3 por passo; de fora, $u^2$ tem taxa $2u$, que depende de onde o $u$ está. Multiplica as duas.',
      visual: {
        tipo: 'transformacao', titulo: 'Derivando (3x + 1)²',
        linhas: [
          { latex: 'u = 3x + 1, \\quad u\' = 3', porque: 'a máquina de dentro' },
          { latex: '(u^2)\' = 2u', porque: 'a máquina de fora' },
          { latex: "\\left[(3x + 1)^2\\right]' = 2(3x + 1)\\cdot 3", porque: 'fora, no ponto de dentro, vezes dentro' },
          { latex: '= 6(3x + 1)', porque: 'simplifica' },
        ],
      },
    },
    {
      titulo: 'Conferindo por outro caminho',
      texto: 'Abrindo o quadrado antes e derivando parte por parte, tem que dar o mesmo. Dá.',
      visual: {
        tipo: 'transformacao', titulo: 'Abrindo antes de derivar',
        linhas: [
          { latex: '(3x + 1)^2 = 9x^2 + 6x + 1', porque: 'abre o quadrado' },
          { latex: "(9x^2 + 6x + 1)' = 18x + 6", porque: 'regra da potência' },
          { latex: '= 6(3x + 1)', porque: 'igual à regra da cadeia' },
        ],
      },
    },
    {
      titulo: 'O balão e o frio',
      texto: 'Um balão sobe 100 m por minuto. Quanto mais alto, mais frio: o ar esfria 0,006 °C a cada metro. Quanto a temperatura em volta do balão cai por minuto? °C por metro vezes metros por minuto: $0{,}006\\cdot 100 = 0{,}6$ °C por minuto. Duas engrenagens, uma multiplicação.',
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Quase nada depende do tempo diretamente: depende de algo que depende do tempo. A regra da cadeia liga essas taxas. É também a conta que um computador faz para treinar uma inteligência artificial: o erro passa de camada em camada, multiplicando taxas.',
    },
  ],
  resumo: "Para $p(x) = g(f(x))$: $p'(x) = g'(f(x))\\cdot f'(x)$. A taxa de fora, calculada onde a de dentro está, vezes a taxa de dentro. Em fila, as taxas se multiplicam como engrenagens, e as unidades se cancelam como frações.",
  exemplos: [
    {
      enunciado: 'Derive $(x^2 + 1)^3$.',
      passos: [
        { texto: 'De dentro: $u = x^2 + 1$, com taxa $2x$.', porque: 'A primeira máquina.' },
        { texto: 'De fora: $u^3$, com taxa $3u^2$.', porque: 'Regra da potência na segunda máquina.' },
        { texto: '$3(x^2 + 1)^2\\cdot 2x$, que é $6x(x^2 + 1)^2$', porque: 'Fora, no ponto de dentro, vezes dentro.' },
      ],
    },
    {
      enunciado: 'Derive $(2x + 5)^2$ e calcule a derivada em $x = 0$.',
      passos: [
        { texto: '$2(2x + 5)\\cdot 2$, que é $4(2x + 5)$', porque: 'Fora: $2u$. Dentro: taxa 2.' },
        { texto: 'Em 0: $4\\cdot 5 = 20$', porque: 'Troca $x$ por 0.', lacuna: { pergunta: 'Quanto vale a derivada em 0?', resposta: { tipo: 'numero', valor: 20 } } },
      ],
    },
    {
      enunciado: 'Uma mancha de óleo circular tem raio $r(t) = 2t$ cm, e área $A = \\pi r^2$. Quanto a área cresce por segundo em $t = 1$? Use $\\pi \\approx 3$.',
      passos: [
        { texto: 'Em $t = 1$, o raio é $r = 2$', porque: '$2\\cdot 1$.', lacuna: { pergunta: 'Qual o raio em $t = 1$?', resposta: { tipo: 'numero', valor: 2 } } },
        { texto: 'A área cresce $2\\pi r$ por cm de raio, e o raio cresce 2 cm por segundo.', porque: 'As duas engrenagens.' },
        { texto: '$2\\cdot 3\\cdot 2\\cdot 2 = 24$', porque: 'cm² por cm vezes cm por segundo: cm² por segundo.', lacuna: { pergunta: 'Quantos cm² por segundo?', resposta: { tipo: 'numero', valor: 24 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale a derivada de $(x + 4)^2$ em $x = 1$?',
      resposta: { tipo: 'numero', valor: 10 },
      dica: 'Fora: $2u$. Dentro: taxa 1.',
      resolucao: [
        { texto: '$2(x + 4)\\cdot 1$', porque: 'Regra da cadeia.' },
        { texto: 'Em 1: $2\\cdot 5 = 10$', porque: 'Troca $x$ por 1.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $(3x)^2$ em $x = 2$?',
      resposta: { tipo: 'numero', valor: 36 },
      dica: 'Dentro, $3x$ tem taxa 3.',
      resolucao: [
        { texto: '$2(3x)\\cdot 3$, que é $18x$', porque: 'Confere: $(3x)^2 = 9x^2$, que deriva para $18x$.' },
        { texto: 'Em 2: $18\\cdot 2 = 36$', porque: 'Troca $x$ por 2.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $(x^2 - 1)^2$ em $x = 1$?',
      resposta: { tipo: 'numero', valor: 0 },
      dica: 'Fora: $2u$. Dentro: $x^2 - 1$, com taxa $2x$.',
      resolucao: [
        { texto: '$2(x^2 - 1)\\cdot 2x$', porque: 'Regra da cadeia.' },
        { texto: 'Em 1: $2\\cdot 0\\cdot 2 = 0$', porque: 'O de dentro vale zero ali.' },
      ],
    },
    {
      enunciado: 'Um carro anda 3 km por minuto e gasta 0,1 litro por km. Quantos litros por minuto ele gasta?',
      resposta: { tipo: 'numero', valor: 0.3 },
      dica: 'Litros por km vezes km por minuto.',
      resolucao: [
        { texto: '$3\\cdot 0{,}1$, que dá 0,3', porque: 'As unidades km se cancelam: sobram litros por minuto.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $\\sqrt{x^2 + 9}$ em $x = 4$?',
      resposta: { tipo: 'numero', valor: 0.8 },
      dica: 'Fora: $\\sqrt{u}$, com taxa $\\frac{1}{2\\sqrt{u}}$. Dentro: $x^2 + 9$.',
      resolucao: [
        { texto: 'A derivada é $\\frac{1}{2\\sqrt{x^2 + 9}}\\cdot 2x$, que é $\\frac{x}{\\sqrt{x^2 + 9}}$', porque: 'Regra da cadeia com raiz.' },
        { texto: 'Em 4: $\\frac{4}{\\sqrt{25}}$, que dá 0,8', porque: '$\\frac{4}{5}$.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Uma escada de 5 m está encostada numa parede, e o pé dela se afasta a 1 m/s. Quando o pé está a 3 m da parede, com que velocidade, em m/s, o topo desce?',
      resposta: { tipo: 'numero', valor: 0.75 },
      dica: 'Pé em $x$, topo em $y$: $x^2 + y^2 = 25$. Derive os dois lados no tempo.',
      resolucao: [
        { texto: 'Com o pé em $x = 3$, o topo está em $y = 4$', porque: 'Pitágoras: $9 + 16 = 25$.' },
        { texto: "Derivando no tempo: $2x\\,x' + 2y\\,y' = 0$", porque: 'Regra da cadeia em cada quadrado; 25 é constante.' },
        { texto: "$6\\cdot 1 + 8\\,y' = 0$: velocidade de descida = 0,75 m/s", porque: "$y' = -\\frac{6}{8}$; o sinal negativo diz que o topo desce." },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Por que as taxas se multiplicam na regra da cadeia?',
    resposta: 'Porque é uma conversão em fila: km por minuto vezes reais por km dá reais por minuto. Cada máquina multiplica a velocidade da anterior, como engrenagens.',
  },
};
