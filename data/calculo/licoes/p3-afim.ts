import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P3_AFIM: ConteudoLicao = {
  gancho: {
    pergunta: 'Uma vela de 20 cm queima 2 cm por hora. Qual a altura depois de 3 horas? E depois de $t$ horas?',
    ideia: 'Depois de 3 horas: 20 − 2·3 = 14 cm. Depois de $t$ horas: $20 - 2t$. Começa em um valor e muda sempre o mesmo tanto: isso desenha uma reta.',
  },
  construcao: [
    {
      titulo: 'A vela acesa',
      texto: 'A vela da pergunta, acesa. Cada hora ela perde 2 cm, sempre o mesmo tanto: $h(x) = 20 - 2x$, com $x$ em horas. A vela encolhe em pedaços iguais, e no gráfico os pontos descem em degraus iguais. Mudança sempre igual desenha uma **reta**.',
      visual: {
        tipo: 'cena', titulo: 'A vela encolhe 2 cm por hora', x: [0, 10], unidadeX: 'h', unidadeY: 'cm', rastro: true,
        legenda: [{ termo: 'x', diz: 'as horas acesa' }, { termo: '20', diz: 'o tamanho no começo (cm)' }, { termo: '-2', diz: 'os cm que ela perde por hora' }],
        veiculos: [{ veiculo: 'vela', nome: 'h', expr: '20-2*x', cor: 'a' }],
      },
    },
    {
      titulo: 'Mudar sempre o mesmo tanto',
      texto: 'Na tabela da vela, cada hora tira exatamente 2 cm. A mudança é sempre a mesma.',
      visual: { tipo: 'tabela', titulo: 'Vela', cabecalho: ['horas', 'altura (cm)', 'mudança'], linhas: [['0', '20', '—'], ['1', '18', '−2'], ['2', '16', '−2'], ['3', '14', '−2']] },
    },
    {
      titulo: 'Degraus iguais formam uma reta',
      texto: 'Se cada passo para a direita desce o mesmo tanto, os pontos ficam alinhados, como uma escada de degraus iguais. Por isso o gráfico é uma reta.',
      visual: { tipo: 'grafico', titulo: 'h(t) = 20 − 2t', funcoes: [{ expr: '20 - 2x', rotulo: 'altura', cor: 'a' }], pontos: [{ x: 0, y: 20, rotulo: 'começa em 20', cor: 'b' }, { x: 3, y: 14, rotulo: '3 h: 14 cm', cor: 'c' }], x: [0, 10], y: [0, 22] },
    },
    {
      titulo: 'Os dois números da fórmula',
      texto: 'Toda reta assim se escreve $y = ax + b$. O [[b:b]] é onde começa: o valor quando $x = 0$, onde a reta corta o eixo $y$. O [[a:a]] é quanto $y$ muda a cada passo de $x$: a **taxa de variação**. Na vela, $b = 20$ e $a = -2$.',
      visual: {
        tipo: 'transformacao', titulo: 'Montando a fórmula da vela',
        linhas: [
          { latex: '\\text{altura} = \\text{início} + (\\text{mudança por hora})\\cdot \\text{horas}', porque: 'a ideia em palavras' },
          { latex: 'h(t) = 20 + (-2)\\cdot t', porque: 'começa em 20, muda −2 por hora' },
          { latex: 'h(t) = -2t + 20', porque: 'a = −2, b = 20' },
        ],
      },
    },
    {
      titulo: 'O a e o b na estrada',
      texto: 'Na estrada, [[b:b]] é onde o veículo larga e [[a:a]] é quantos km ele anda por minuto: a velocidade. O carro larga na frente ($b = 6$), mas é mais lento ($a = 2$). A moto larga do zero ($b = 0$), mas é mais rápida ($a = 4$). Quem tem o $a$ maior tem a reta mais inclinada, e por isso alcança: no minuto 3, os dois estão no km 12.',
      visual: {
        tipo: 'cena', titulo: 'Carro f(x) = 2x + 6 e moto g(x) = 4x', x: [0, 5], unidadeX: 'min', unidadeY: 'km',
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '2 \\text{ e } 4', diz: 'km por minuto: a inclinação' }, { termo: '6', diz: 'o carro larga 6 km na frente' }],
        veiculos: [
          { veiculo: 'carro', nome: 'f', expr: '2*x+6', cor: 'a' },
          { veiculo: 'moto', nome: 'g', expr: '4*x', cor: 'b' },
        ],
      },
    },
    {
      titulo: 'Achar a taxa com dois pontos',
      texto: 'Sem a tabela, dá para achar $a$ com dois pontos quaisquer: quanto $y$ mudou dividido por quanto $x$ mudou. De $(1, 18)$ para $(3, 14)$: $y$ mudou $-4$ e $x$ mudou 2, então $a = \\frac{-4}{2} = -2$.',
      visual: {
        tipo: 'transformacao',
        linhas: [
          { latex: 'a = \\frac{\\Delta y}{\\Delta x}', porque: 'Δ (delta) quer dizer "variação"' },
          { latex: 'a = \\frac{14 - 18}{3 - 1}', porque: 'final menos inicial, em cima e embaixo' },
          { latex: 'a = \\frac{-4}{2} = -2', porque: 'desce 2 por hora' },
        ],
      },
    },
    {
      titulo: 'O sinal de a diz para onde a reta vai',
      texto: 'Se $a > 0$, a reta sobe. Se $a < 0$, desce. Se $a = 0$, fica parada: a saída nunca muda.',
      visual: {
        tipo: 'grafico',
        funcoes: [{ expr: 'x + 1', rotulo: 'a = 1: sobe', cor: 'a' }, { expr: '-x + 1', rotulo: 'a = −1: desce', cor: 'b' }, { expr: '1', rotulo: 'a = 0: parada', cor: 'c' }],
        x: [-3, 3], y: [-3, 4],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'A pergunta "quanto $y$ muda quando $x$ anda um passo?" é a mais importante do cálculo. Na reta, a resposta é sempre a mesma. Numa curva, ela muda de ponto para ponto, e a **derivada** é justamente a ferramenta que mede essa taxa em cada ponto.',
    },
  ],
  resumo: '$f(x) = ax + b$. O $b$ é o valor inicial (onde a reta corta o eixo $y$). O $a = \\frac{\\Delta y}{\\Delta x}$ é a taxa de variação: quanto $y$ muda quando $x$ aumenta 1. É a inclinação da reta.',
  exemplos: [
    {
      enunciado: 'Um plano de celular custa R$ 30 fixos mais R$ 0,50 por GB usado. Escreva o preço $p(g)$ e calcule para 10 GB.',
      passos: [
        { texto: '$b = 30$', porque: 'Mesmo com 0 GB você paga 30: é o valor inicial.' },
        { texto: '$a = 0{,}5$', porque: 'Cada GB a mais soma 0,50: é a taxa.' },
        { texto: '$p(g) = 0{,}5g + 30$', porque: 'Junta os dois na forma $ax + b$.' },
        { texto: '$p(10) = 0{,}5\\cdot 10 + 30 = 5 + 30 = 35$', porque: 'Com 10 GB, a conta é R$ 35.' },
      ],
    },
    {
      enunciado: 'Uma reta passa por $(2, 7)$ e $(5, 16)$. Qual é a taxa $a$?',
      passos: [
        { texto: '$\\Delta y = 16 - 7 = 9$', porque: 'Quanto a saída mudou.' },
        { texto: '$\\Delta x = 5 - 2 = 3$', porque: 'Quanto a entrada mudou.' },
        { texto: '$a = \\frac{9}{3} = 3$', porque: 'Cada passo de $x$ sobe 3.', lacuna: { pergunta: 'Quanto vale $a = \\frac{\\Delta y}{\\Delta x}$?', resposta: { tipo: 'numero', valor: 3 } } },
      ],
    },
    {
      enunciado: 'Uma reta passa por $(0, 4)$ e $(2, 10)$. Escreva $f(x) = ax + b$ e calcule $f(5)$.',
      passos: [
        { texto: '$b = 4$', porque: 'O ponto $(0, 4)$ é onde a reta corta o eixo $y$.' },
        { texto: '$a = \\frac{10 - 4}{2 - 0} = 3$, então $f(x) = 3x + 4$', porque: 'Subiu 6 em 2 passos: 3 por passo.', lacuna: { pergunta: 'Quanto vale $a$?', resposta: { tipo: 'numero', valor: 3 } } },
        { texto: '$f(5) = 3\\cdot 5 + 4 = 19$', porque: 'Entra 5.', lacuna: { pergunta: 'Quanto vale $f(5)$?', resposta: { tipo: 'numero', valor: 19 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Desenhe os eixos e o gráfico de $f(x) = -2x + 3$.',
      resposta: { tipo: 'desenho', reta: { a: -2, b: 3 } },
      dica: 'O $+3$ diz onde a reta corta o eixo $y$. O $-2$ diz que, a cada 1 para a direita, ela desce 2.',
      resolucao: [
        { texto: 'Corta o eixo $y$ no 3: ponto (0, 3).', porque: '$f(0) = -2\\cdot 0 + 3 = 3$.' },
        { texto: 'Um passo para a direita, desce 2: ponto (1, 1). Mais um: (2, -1).', porque: 'Na função afim o passo é sempre o mesmo: é o número na frente do $x$.' },
        { texto: 'Liga os pontos: a reta desce da esquerda para a direita.', porque: 'O número na frente do $x$ é negativo.' },
      ],
    },
    {
      enunciado: 'Uma caixa d\'água tem 500 L e perde 25 L por minuto. Quantos litros restam depois de 8 minutos?',
      resposta: { tipo: 'numero', valor: 300 },
      dica: 'Início 500, taxa $-25$ por minuto.',
      resolucao: [
        { texto: '$V(t) = 500 - 25t$', porque: 'Começa em 500 e perde 25 por minuto.' },
        { texto: '$V(8) = 500 - 200 = 300$', porque: '$25\\cdot 8 = 200$.' },
      ],
    },
    {
      enunciado: 'Qual é a inclinação da reta que passa por $(1, 3)$ e $(4, 15)$?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: '$a = \\frac{\\Delta y}{\\Delta x}$.',
      resolucao: [
        { texto: '$\\Delta y = 15 - 3 = 12$ e $\\Delta x = 4 - 1 = 3$', porque: 'Final menos inicial.' },
        { texto: '$a = \\frac{12}{3} = 4$', porque: 'Sobe 4 por passo.' },
      ],
    },
    {
      enunciado: 'Em que valor de $x$ a reta $f(x) = -3x + 12$ corta o eixo $x$?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Resolva $-3x + 12 = 0$.',
      resolucao: [
        { texto: '$-3x + 12 = 0 \\Rightarrow 3x = 12$', porque: 'Passa o $-3x$ para o outro lado.' },
        { texto: '$x = 4$', porque: 'Divide por 3.' },
      ],
    },
    {
      enunciado: 'Um táxi cobra R$ 6 fixos mais R$ 2,50 por km. Com R$ 41, quantos km dá para andar?',
      resposta: { tipo: 'numero', valor: 14 },
      dica: 'Resolva $6 + 2{,}5k = 41$.',
      resolucao: [
        { texto: '$6 + 2{,}5k = 41 \\Rightarrow 2{,}5k = 35$', porque: 'Tira os 6 fixos.' },
        { texto: '$k = \\frac{35}{2{,}5} = 14$', porque: '35 reais divididos por 2,50 por km.' },
      ],
    },
  ],
  recuperacao: {
    pergunta: 'Na fórmula $y = ax + b$, o que o número $a$ diz?',
    resposta: 'Quanto $y$ muda quando $x$ aumenta 1: a taxa de variação, que é a inclinação da reta.',
  },
};
