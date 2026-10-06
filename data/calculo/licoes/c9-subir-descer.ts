import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C9_SUBIR_DESCER: ConteudoLicao = {
  gancho: {
    pergunta: 'Uma bola é jogada para cima e sua altura é $h(t) = 20t - 5t^2$ metros. Sem desenhar, como saber em que instante ela chega ao ponto mais alto?',
    ideia: 'No ponto mais alto, a bola parou de subir e ainda não começou a descer: a velocidade é zero. A velocidade é a derivada, $20 - 10t$, que zera em $t = 2$. A altura máxima é $h(2) = 20$ m.',
  },
  construcao: [
    {
      titulo: 'O velocímetro da bola',
      texto: 'Ande o relógio e olhe o velocímetro: 20, 10, 0, −10, −20. Positivo: a bola sobe. Negativo: desce. Bem no meio, em 2 segundos, ele marca 0. É o topo.',
      visual: {
        tipo: 'cena', titulo: 'A bola e o velocímetro: h(t) = 20t − 5t²', x: [0, 4], unidadeX: 's', unidadeY: 'm', rastro: true, velocimetro: true,
        veiculos: [{ veiculo: 'bola', nome: 'h', expr: '20*x-5*x^2', cor: 'a' }],
      },
    },
    {
      titulo: 'O sinal da derivada',
      texto: 'Derivada positiva: a função sobe. Negativa: desce. Quando o sinal troca, a função passou por um topo ou por um fundo, e ali a derivada vale zero.',
      visual: {
        tipo: 'tabela', titulo: 'A bola, segundo a segundo',
        cabecalho: ['tempo', "velocidade h'(t)", 'a bola'],
        linhas: [['antes de 2 s', 'positiva', 'sobe'], ['em 2 s', 'zero', 'topo'], ['depois de 2 s', 'negativa', 'desce']],
      },
    },
    {
      titulo: 'Achando o topo sem desenhar',
      texto: 'Três passos: derivar, igualar a zero, e calcular a função naquele instante.',
      visual: {
        tipo: 'transformacao', titulo: 'O topo da bola pela conta',
        linhas: [
          { latex: "h'(t) = 20 - 10t", porque: 'deriva' },
          { latex: '20 - 10t = 0 \\;\\Rightarrow\\; t = 2', porque: 'velocidade zero' },
          { latex: 'h(2) = 40 - 20 = 20', porque: 'altura máxima: 20 m' },
        ],
      },
    },
    {
      titulo: 'Topo ou fundo?',
      texto: 'Derivada zero aparece no [[b:topo]] e no [[a:fundo]]. Para saber qual, olhe o sinal antes e depois: de mais para menos é topo; de menos para mais é fundo.',
      visual: {
        tipo: 'grafico', titulo: 'Os dois têm tangente horizontal em x = 2',
        funcoes: [{ expr: 'x^2-4*x+5', rotulo: 'fundo', cor: 'a' }, { expr: '-x^2+4*x', rotulo: 'topo', cor: 'b' }],
        pontos: [{ x: 2, y: 1, rotulo: 'fundo: − para +', cor: 'a' }, { x: 2, y: 4, rotulo: 'topo: + para −', cor: 'b' }],
        x: [0, 4], y: [-1, 6],
      },
    },
    {
      titulo: 'A segunda derivada',
      texto: "A derivada da derivada, $h''$, diz se a velocidade aumenta ou diminui. Na bola, $h'' = -10$: a velocidade cai sempre, por causa da gravidade. Segunda derivada negativa: curva virada para baixo, e o ponto de derivada zero é um topo. Positiva: virada para cima, é um fundo.",
      visual: {
        tipo: 'transformacao', titulo: 'Derivando duas vezes',
        linhas: [
          { latex: 'h(t) = 20t - 5t^2', porque: 'altura' },
          { latex: "h'(t) = 20 - 10t", porque: 'velocidade' },
          { latex: "h''(t) = -10", porque: 'aceleração: a velocidade cai 10 m/s a cada segundo' },
        ],
      },
    },
    {
      titulo: 'Cuidado: derivada zero sem topo',
      texto: 'Em $x^3$, a derivada $3x^2$ zera em 0, mas a função só dá uma pausa e continua subindo: o sinal da derivada não troca. Derivada zero aponta um candidato, não uma garantia.',
      visual: {
        tipo: 'grafico', titulo: 'x³: pausa em 0, sem topo nem fundo',
        funcoes: [{ expr: 'x^3', rotulo: 'x³', cor: 'a' }],
        pontos: [{ x: 0, y: 0, rotulo: 'derivada zero, mas continua subindo', cor: 'b' }],
        x: [-2, 2], y: [-4, 4],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Achar o máximo e o mínimo sem desenhar é a base da otimização, a próxima lição: o maior lucro, o menor custo, a caixa de maior volume.',
    },
  ],
  resumo: "Derivada positiva: sobe; negativa: desce. Topos e fundos estão onde $f'(x) = 0$ e o sinal troca: de + para − é topo, de − para + é fundo. A segunda derivada confirma: $f'' < 0$, topo; $f'' > 0$, fundo.",
  exemplos: [
    {
      enunciado: 'Onde $f(x) = x^2 - 6x + 10$ tem um fundo, e quanto ela vale lá?',
      passos: [
        { texto: "$f'(x) = 2x - 6$", porque: 'Deriva.' },
        { texto: '$2x - 6 = 0$ em $x = 3$', porque: 'Antes de 3 a derivada é negativa; depois, positiva: fundo.' },
        { texto: '$f(3) = 9 - 18 + 10 = 1$', porque: 'O menor valor da função.' },
      ],
    },
    {
      enunciado: 'Uma bola tem altura $h(t) = 30t - 5t^2$ metros. Em que instante ela chega ao topo?',
      passos: [
        { texto: "$h'(t) = 30 - 10t$", porque: 'A velocidade.' },
        { texto: '$30 - 10t = 0$ em $t = 3$', porque: 'Velocidade zero no topo.', lacuna: { pergunta: 'Em que instante, em segundos?', resposta: { tipo: 'numero', valor: 3 } } },
      ],
    },
    {
      enunciado: "Qual a altura máxima da bola $h(t) = 30t - 5t^2$? E o que $h''$ confirma?",
      passos: [
        { texto: '$h(3) = 90 - 45 = 45$', porque: 'A altura no topo, em metros.', lacuna: { pergunta: 'Qual a altura máxima?', resposta: { tipo: 'numero', valor: 45 } } },
        { texto: "$h''(t) = -10$", porque: 'Deriva a velocidade.', lacuna: { pergunta: "Quanto vale $h''$?", resposta: { tipo: 'numero', valor: -10 } } },
        { texto: 'Negativa: curva virada para baixo, então $t = 3$ é mesmo um topo.', porque: 'Segunda derivada confirma.' },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Em que $x$ a função $f(x) = x^2 - 8x + 3$ tem um fundo?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Derive e iguale a zero.',
      resolucao: [
        { texto: "$f'(x) = 2x - 8$", porque: 'Deriva.' },
        { texto: '$2x - 8 = 0$ em $x = 4$', porque: 'Parábola para cima: o único ponto de derivada zero é o fundo.' },
      ],
    },
    {
      enunciado: 'Qual a altura máxima, em metros, de uma bola com altura $h(t) = 40t - 5t^2$?',
      resposta: { tipo: 'numero', valor: 80 },
      dica: 'Ache o instante do topo e calcule a altura nele.',
      resolucao: [
        { texto: '$40 - 10t = 0$ em $t = 4$', porque: 'Velocidade zero.' },
        { texto: '$h(4) = 160 - 80 = 80$', porque: 'Altura no topo.' },
      ],
    },
    {
      enunciado: 'A derivada de uma função é positiva antes de $x = 2$ e negativa depois. Em $x = 2$ a função tem:',
      resposta: { tipo: 'escolha', opcoes: ['um topo', 'um fundo', 'nem topo nem fundo'], correta: 0 },
      dica: 'Positiva: sobe. Negativa: desce.',
      resolucao: [
        { texto: 'Ela subia e passou a descer: topo.', porque: 'De mais para menos.' },
        { texto: 'Fundo seria o contrário: descia e passou a subir.', porque: 'De menos para mais.' },
      ],
    },
    {
      enunciado: 'Quanto vale a segunda derivada de $f(x) = 3x^2 + x$?',
      resposta: { tipo: 'numero', valor: 6 },
      dica: 'Derive duas vezes.',
      resolucao: [
        { texto: "$f'(x) = 6x + 1$", porque: 'Primeira derivada.' },
        { texto: "$f''(x) = 6$", porque: 'Positiva: curva virada para cima.' },
      ],
    },
    {
      enunciado: 'Em quantos pontos a derivada de $f(x) = x^3 - 3x$ vale zero?',
      resposta: { tipo: 'numero', valor: 2 },
      dica: 'Derive e resolva $3x^2 - 3 = 0$.',
      resolucao: [
        { texto: "A derivada é $3x^2 - 3$", porque: 'Regra da potência.' },
        { texto: 'Ela zera quando $x$ vale 1 ou $-1$: são 2 pontos.', porque: 'Um topo em $-1$ e um fundo em 1.' },
      ],
    },
    {
      enunciado: 'Para que valor de $k$ a função $f(x) = x^2 + kx + 1$ tem fundo em $x = 3$?',
      resposta: { tipo: 'numero', valor: -6 },
      dica: 'No fundo, a derivada é zero.',
      resolucao: [
        { texto: "$f'(3) = 6 + k$", porque: "$f'(x) = 2x + k$." },
        { texto: '$6 + k = 0$, então $k = -6$', porque: 'Derivada zero em 3.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Qual o maior valor de $f(x) = x\\,e^{-x}$ para $x \\ge 0$? Use $e \\approx 2{,}72$ e responda com duas casas decimais.',
      resposta: { tipo: 'numero', valor: 0.37, tolerancia: 0.01 },
      dica: 'Regra do produto: $(x)\'\\,e^{-x} + x\\,(e^{-x})\'$.',
      resolucao: [
        { texto: "A derivada é $e^{-x} - x\\,e^{-x}$, ou seja, $e^{-x}(1 - x)$", porque: 'Produto e cadeia.' },
        { texto: 'Ela zera quando $x$ vale 1: antes positiva, depois negativa.', porque: '$e^{-x}$ nunca zera; só o $1 - x$.' },
        { texto: 'No topo, $f(1)$ vale $\\frac{1}{e}$, cerca de 0,37', porque: '$\\frac{1}{2{,}72}$.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Como achar o ponto mais alto de uma curva sem desenhar?',
    resposta: 'Derivar, achar onde a derivada é zero e conferir que o sinal dela passa de positivo para negativo ali, ou que a segunda derivada é negativa.',
  },
};
