import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C4_DERIVADA: ConteudoLicao = {
  gancho: {
    pergunta: 'O carro da lição de taxa média está no km $x^2$ depois de $x$ minutos. Qual a velocidade dele exatamente no minuto 3?',
    ideia: 'A média entre 3 e 3,1 deu 6,1; entre 3 e 3,01 dá 6,01. Encolhendo o intervalo, as médias encostam em 6. A velocidade no instante é esse limite: 6 km por minuto. Esse número tem nome: a **derivada** no ponto 3.',
  },
  construcao: [
    {
      titulo: 'O velocímetro',
      texto: 'Ande o relógio. O carro acelera: a cada minuto anda mais que no anterior. O velocímetro não marca a média da viagem, marca a velocidade naquele instante. Como calcular o número que ele mostra?',
      visual: {
        tipo: 'cena', titulo: 'O carro que acelera: s(x) = x²', x: [0, 5], unidadeX: 'min', unidadeY: 'km',
        veiculos: [{ veiculo: 'carro', nome: 's', expr: 'x^2', cor: 'a' }],
      },
    },
    {
      titulo: 'A média num intervalo de tamanho h',
      texto: 'Em vez de testar 3,1 e 3,01 um por um, chame o tamanho do intervalo de $h$. A média entre 3 e $3 + h$ vira uma conta que dá para simplificar.',
      visual: {
        tipo: 'transformacao', titulo: 'A média entre 3 e 3 + h',
        linhas: [
          { latex: '\\frac{s(3 + h) - s(3)}{h}', porque: 'quanto andou sobre quanto tempo passou' },
          { latex: '= \\frac{(3 + h)^2 - 9}{h}', porque: 's(x) = x²' },
          { latex: '= \\frac{9 + 6h + h^2 - 9}{h} = \\frac{6h + h^2}{h}', porque: 'abre o quadrado' },
          { latex: '= 6 + h', porque: 'corta o h, que não é zero' },
        ],
      },
    },
    {
      titulo: 'Agora h vai a zero',
      texto: 'Com o intervalo encolhendo, $6 + h$ encosta em 6. O $\\frac{0}{0}$ que travaria a conta sumiu, porque o $h$ foi cortado antes. A velocidade no minuto 3 é $\\lim_{h \\to 0}(6 + h) = 6$.',
      visual: {
        tipo: 'tabela', titulo: 'A média 6 + h com h encolhendo',
        cabecalho: ['h (min)', 'média (km/min)'],
        linhas: [['1', '7'], ['0,1', '6,1'], ['0,01', '6,01'], ['0,001', '6,001'], ['→ 0', '→ 6']],
      },
    },
    {
      titulo: 'No gráfico: a tangente',
      texto: 'A velocidade no instante é a inclinação da [[c:tangente]], a reta que só encosta na curva no ponto $(3, 9)$. A cada minuto a mais na reta, ela sobe 6.',
      visual: {
        tipo: 'grafico', titulo: 'A tangente em (3, 9): inclinação 6',
        funcoes: [{ expr: 'x^2', rotulo: 's(x)', cor: 'a' }, { expr: '6*x-9', rotulo: 'tangente', cor: 'c' }],
        pontos: [{ x: 3, y: 9, rotulo: '(3, 9)', cor: 'c' }],
        x: [0, 5], y: [-1, 25],
      },
    },
    {
      titulo: 'Em qualquer instante: o 2x aparece',
      texto: 'Fazendo a mesma conta com $x$ no lugar do 3, sai a velocidade em todo instante de uma vez: $2x$. No minuto 3, 6; no minuto 1, 2; no minuto 5, 10. Escreve-se $s\'(x) = 2x$ e lê-se "s linha de x": a **derivada** de $s$.',
      visual: {
        tipo: 'transformacao', titulo: 'A conta para um x qualquer',
        linhas: [
          { latex: '\\frac{(x + h)^2 - x^2}{h} = \\frac{2xh + h^2}{h}', porque: 'abre o quadrado; o x² cancela' },
          { latex: '= 2x + h', porque: 'corta o h' },
          { latex: '\\lim_{h \\to 0}(2x + h) = 2x', porque: 'h vai a zero' },
          { latex: "s'(x) = 2x", porque: 'a velocidade em cada instante' },
        ],
      },
    },
    {
      titulo: 'A derivada é outra função',
      texto: 'Para cada instante, a derivada devolve a velocidade. O gráfico de $2x$ é uma reta: a velocidade cresce sempre o mesmo tanto, o carro acelera por igual. Onde a posição sobe devagar, a derivada é pequena; onde sobe rápido, é grande.',
      visual: {
        tipo: 'grafico', titulo: 'Posição x² e velocidade 2x',
        funcoes: [{ expr: 'x^2', rotulo: 'posição s(x)', cor: 'a' }, { expr: '2*x', rotulo: "velocidade s'(x)", cor: 'b' }],
        pontos: [{ x: 3, y: 6, rotulo: "s'(3) = 6", cor: 'b' }],
        x: [0, 5], y: [0, 25],
      },
    },
    {
      titulo: 'A definição',
      texto: 'Toda derivada sai da mesma conta: a taxa média num intervalo $h$, com $h$ encolhendo até zero. As próximas lições criam atalhos para não fazer essa conta toda vez.',
      visual: {
        tipo: 'transformacao', titulo: 'Derivada pela definição',
        linhas: [
          { latex: '\\text{média} = \\frac{f(x + h) - f(x)}{h}', porque: 'a taxa média num intervalo de tamanho h' },
          { latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}", porque: 'a mesma média, com h encolhendo até zero' },
        ],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'A derivada é a taxa de variação de qualquer coisa: velocidade, aceleração, custo de produzir uma unidade a mais, rapidez de uma reação química. E onde a derivada é zero, algo para de subir e começa a descer: é assim que se acha o topo.',
    },
  ],
  resumo: "$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$: a taxa média num intervalo que encolhe até zero. É a velocidade no instante e a inclinação da tangente. Para $f(x) = x^2$, sai $f'(x) = 2x$.",
  exemplos: [
    {
      enunciado: 'Pela definição, ache a derivada de $f(x) = 3x$.',
      passos: [
        { texto: '$\\frac{3(x + h) - 3x}{h} = \\frac{3h}{h}$', porque: 'O $3x$ cancela.' },
        { texto: '$\\frac{3h}{h} = 3$', porque: 'Corta o $h$; não sobra $h$ para ir a zero.' },
        { texto: "$f'(x) = 3$", porque: 'Numa reta, a inclinação é a mesma em todo ponto.' },
      ],
    },
    {
      enunciado: 'O carro está no km $x^2$ depois de $x$ minutos. Qual a velocidade dele no minuto 5?',
      passos: [
        { texto: "$s'(x) = 2x$", porque: 'A derivada de $x^2$, calculada na construção.' },
        { texto: "$s'(5) = 2\\cdot 5 = 10$", porque: '10 km por minuto.', lacuna: { pergunta: 'Qual a velocidade no minuto 5?', resposta: { tipo: 'numero', valor: 10 } } },
      ],
    },
    {
      enunciado: 'Pela definição, ache a derivada de $f(x) = x^2 + 4x$ no ponto 1.',
      passos: [
        { texto: '$\\frac{f(1 + h) - f(1)}{h} = \\frac{(1 + h)^2 + 4(1 + h) - 5}{h}$', porque: '$f(1) = 1 + 4 = 5$.' },
        { texto: 'O numerador $(1 + h)^2 + 4(1 + h) - 5$ vira $6h + h^2$', porque: '$1 + 2h + h^2 + 4 + 4h - 5$.', lacuna: { pergunta: 'Que número multiplica o $h$ sozinho?', resposta: { tipo: 'numero', valor: 6 } } },
        { texto: '$\\lim_{h \\to 0}(6 + h) = 6$', porque: 'Corta o $h$ e deixa ele ir a zero.', lacuna: { pergunta: 'Qual a derivada em 1?', resposta: { tipo: 'numero', valor: 6 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Se $s(x) = x^2$, qual a velocidade no minuto 4?',
      resposta: { tipo: 'numero', valor: 8 },
      dica: 'Use $s\'(x) = 2x$.',
      resolucao: [
        { texto: "$s'(4) = 2\\cdot 4 = 8$", porque: 'A derivada de $x^2$ é $2x$.' },
      ],
    },
    {
      enunciado: 'Qual a derivada de $f(x) = 5x + 1$, em qualquer ponto?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: 'Monte a taxa média com $h$ e simplifique.',
      resolucao: [
        { texto: '$\\frac{5(x + h) + 1 - (5x + 1)}{h} = \\frac{5h}{h} = 5$', porque: 'Reta: a inclinação é sempre 5.' },
      ],
    },
    {
      enunciado: 'Qual a inclinação da tangente à curva $y = x^2$ no ponto $(-2, 4)$?',
      resposta: { tipo: 'numero', valor: -4 },
      dica: 'A inclinação da tangente é a derivada naquele $x$.',
      resolucao: [
        { texto: '$2\\cdot(-2) = -4$', porque: 'Negativa: ali a parábola está descendo.' },
      ],
    },
    {
      enunciado: 'A taxa média de $x^2$ entre 3 e $3 + h$ é $6 + h$. Quanto ela vale com $h = 0{,}01$?',
      resposta: { tipo: 'numero', valor: 6.01 },
      dica: 'Troque o $h$.',
      resolucao: [
        { texto: '$6 + 0{,}01$, que dá 6,01', porque: 'Já bem perto da derivada, 6.' },
      ],
    },
    {
      enunciado: 'Se uma função dá a posição de um carro ao longo do tempo, o que a derivada dela mede?',
      resposta: { tipo: 'escolha', opcoes: ['a distância total percorrida', 'a velocidade naquele instante', 'a velocidade média da viagem', 'o tempo total de viagem'], correta: 1 },
      dica: 'Pense no velocímetro.',
      resolucao: [
        { texto: 'A derivada da posição é a velocidade no instante: o que o velocímetro marca.', porque: 'É o limite da média com o intervalo encolhendo.' },
        { texto: 'A velocidade média é a taxa num intervalo, antes do limite.', porque: 'Por isso não é a mesma coisa.' },
      ],
    },
    {
      enunciado: 'Pela definição, qual a derivada de $f(x) = x^3$ em $x = 1$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: '$(1 + h)^3 = 1 + 3h + 3h^2 + h^3$.',
      resolucao: [
        { texto: 'A média vira $\\frac{(1 + h)^3 - 1}{h}$, que é $\\frac{3h + 3h^2 + h^3}{h}$', porque: 'O 1 cancela.' },
        { texto: 'Cortando o $h$: $3 + 3h + h^2$, que vai a 3 quando $h$ vai a zero.', porque: 'Os termos com $h$ somem.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'A altura de uma bola é $a(t) = 20t - 5t^2$ metros, com $t$ em segundos. Em que instante a velocidade da bola é zero?',
      resposta: { tipo: 'numero', valor: 2 },
      dica: 'Ache a derivada pela definição e iguale a zero.',
      resolucao: [
        { texto: 'Pela definição, a média entre $t$ e $t + k$ é $20 - 10t - 5k$.', porque: 'Abre $(t + k)^2$ e corta o $k$.' },
        { texto: 'Com $k$ indo a zero, a velocidade é $20 - 10t$.', porque: 'O $5k$ some.' },
        { texto: '$20 - 10t = 0$ quando $t = 2$', porque: 'É o topo: a bola para de subir e começa a cair.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
  ],
  recuperacao: {
    pergunta: 'Qual a diferença entre a taxa média e a derivada?',
    resposta: 'A taxa média vale para um intervalo. A derivada é o limite dela com o intervalo encolhendo até zero: a taxa num instante, a inclinação da tangente.',
  },
};
