import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P2_GRAFICO: ConteudoLicao = {
  gancho: {
    pergunta: 'A tabela do táxi mostra o preço de 1, 2, 3 e 10 km. E se você quisesse ver o preço de todas as distâncias de uma vez?',
    ideia: 'Desenhe cada par (distância, preço) como um ponto. Todos os pontos juntos formam o gráfico: a função inteira num desenho.',
  },
  construcao: [
    {
      titulo: 'O rastro do carro',
      texto: 'Lembra do carro da lição anterior, $f(x) = 5x + 2$? Agora, a cada minuto, ele deixa uma marca no gráfico: o ponto (minuto, km). Aperte "Mais 1 min" algumas vezes e veja os pontos aparecerem um por um. Quando o relógio chega ao fim, os pontos viram uma linha: essa linha é o **gráfico** da função, o caminho inteiro desenhado de uma vez.',
      visual: {
        tipo: 'cena', titulo: 'Cada minuto deixa um ponto', x: [0, 4], unidadeX: 'min', unidadeY: 'km', rastro: true,
        veiculos: [{ veiculo: 'carro', nome: 'f', expr: '5*x+2', cor: 'a' }],
      },
    },
    {
      titulo: 'Cada linha da tabela vira um ponto',
      texto: 'O par (entrada, saída) vira o ponto $(x, f(x))$: ande $x$ para a direita e $f(x)$ para cima. A linha "3 km custa R$ 11" vira o ponto $(3, 11)$.',
      visual: { tipo: 'grafico', titulo: 'Os pontos da tabela', funcoes: [], pontos: [{ x: 1, y: 7, rotulo: '(1, 7)', cor: 'a' }, { x: 2, y: 9, rotulo: '(2, 9)', cor: 'a' }, { x: 3, y: 11, rotulo: '(3, 11)', cor: 'a' }], x: [0, 6], y: [0, 20] },
    },
    {
      titulo: 'Os pontos viram uma linha',
      texto: 'Entre 1 e 2 km também existe 1,5 km, 1,7 km, e cada um tem seu preço. Desenhando todos, os pontos se juntam numa linha: o **gráfico** de $f(x) = 5 + 2x$.',
      visual: { tipo: 'grafico', titulo: 'f(x) = 5 + 2x', funcoes: [{ expr: '5 + 2x', rotulo: 'f(x)', cor: 'a' }], pontos: [{ x: 3, y: 11, rotulo: 'f(3) = 11', cor: 'b' }], x: [0, 6], y: [0, 20] },
    },
    {
      titulo: 'Raiz: onde o gráfico corta o eixo x',
      texto: 'No eixo $x$, a altura é zero. Então os pontos onde o gráfico cruza o eixo $x$ são as entradas que dão saída zero: as [[b:raízes]], onde $f(x) = 0$.',
      visual: { tipo: 'grafico', titulo: 'f(x) = x² − 4', funcoes: [{ expr: 'x^2 - 4', rotulo: 'f(x)', cor: 'a' }], pontos: [{ x: -2, y: 0, rotulo: 'raiz', cor: 'b' }, { x: 2, y: 0, rotulo: 'raiz', cor: 'b' }], x: [-4, 4], y: [-5, 8] },
    },
    {
      titulo: 'Subindo e descendo',
      texto: 'Leia sempre da esquerda para a direita. Onde a curva sobe, a função é **crescente**; onde desce, é **decrescente**. A parábola $x^2 - 4$ desce até $x = 0$ e sobe depois. O ponto onde ela vira é o [[c:vértice]].',
      visual: { tipo: 'grafico', funcoes: [{ expr: 'x^2 - 4', rotulo: 'f(x)', cor: 'a' }], pontos: [{ x: 0, y: -4, rotulo: 'vértice', cor: 'c' }], x: [-4, 4], y: [-5, 8] },
    },
    {
      titulo: 'Teste da reta vertical',
      texto: 'Uma reta vertical é "uma entrada só". Se ela corta o desenho em dois pontos, aquela entrada tem duas saídas, e o desenho não é de uma função. Um círculo falha: em $x = 1$ ele tem um ponto em cima e outro embaixo.',
      visual: {
        tipo: 'grafico', titulo: 'Círculo: não é função',
        funcoes: [{ expr: 'sqrt(4 - x^2)', rotulo: 'metade de cima', cor: 'a' }, { expr: '-sqrt(4 - x^2)', rotulo: 'metade de baixo', cor: 'a' }],
        pontos: [{ x: 1, y: 1.732, rotulo: 'x = 1', cor: 'erro' }, { x: 1, y: -1.732, rotulo: 'x = 1 de novo', cor: 'erro' }],
        x: [-3, 3], y: [-3, 3],
      },
    },
  ],
  resumo: 'O gráfico de $f$ é o desenho de todos os pontos $(x, f(x))$. Raiz: onde ele corta o eixo $x$, ou seja, $f(x) = 0$. Subindo: crescente. Descendo: decrescente.',
  exemplos: [
    {
      enunciado: 'Quais são as raízes de $f(x) = x^2 - 4$?',
      visual: { tipo: 'grafico', funcoes: [{ expr: 'x^2 - 4', rotulo: 'f(x)', cor: 'a' }], pontos: [{ x: -2, y: 0, rotulo: '−2', cor: 'b' }, { x: 2, y: 0, rotulo: '2', cor: 'b' }], x: [-4, 4], y: [-5, 8] },
      passos: [
        { texto: '$x^2 - 4 = 0$', porque: 'Raiz é onde a saída é zero.' },
        { texto: '$x^2 = 4$', porque: 'Soma 4 dos dois lados.' },
        { texto: '$x = 2$ ou $x = -2$', porque: '$2^2 = 4$ e $(-2)^2 = 4$: são os dois pontos onde a parábola corta o eixo.' },
      ],
    },
    {
      enunciado: 'Em que ponto o gráfico de $g(x) = 2x - 6$ corta o eixo $x$?',
      passos: [
        { texto: '$2x - 6 = 0$', porque: 'No eixo $x$, a saída é zero.' },
        { texto: '$2x = 6$', porque: 'Soma 6 dos dois lados.' },
        { texto: '$x = 3$', porque: 'Divide por 2.', lacuna: { pergunta: 'Quanto vale $x$?', resposta: { tipo: 'numero', valor: 3 } } },
      ],
    },
    {
      enunciado: 'Para $f(x) = x^2 - 4$, quanto vale $f(3)$? O ponto do gráfico fica acima ou abaixo do eixo $x$?',
      passos: [
        { texto: '$f(3) = 3^2 - 4$', porque: 'Entra 3.' },
        { texto: '$f(3) = 9 - 4 = 5$', porque: '$3^2 = 9$.', lacuna: { pergunta: 'Quanto vale $f(3)$?', resposta: { tipo: 'numero', valor: 5 } } },
        { texto: 'O ponto $(3, 5)$ fica acima do eixo $x$.', porque: 'Altura positiva fica acima.', lacuna: { pergunta: 'O ponto $(3, 5)$ está:', resposta: { tipo: 'escolha', opcoes: ['acima do eixo x', 'abaixo do eixo x', 'em cima do eixo x'], correta: 0 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Em que valor de $x$ o gráfico de $f(x) = x - 3$ corta o eixo $x$?',
      visual: { tipo: 'grafico', funcoes: [{ expr: 'x - 3', rotulo: 'f(x)', cor: 'a' }], x: [-2, 6], y: [-5, 4] },
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Corta o eixo $x$ onde $f(x) = 0$.',
      resolucao: [
        { texto: '$x - 3 = 0$', porque: 'Saída zero.' },
        { texto: '$x = 3$', porque: 'Soma 3 dos dois lados.' },
      ],
    },
    {
      enunciado: 'Desenhe os eixos $x$ e $y$ e o gráfico de $f(x) = x + 2$.',
      resposta: { tipo: 'desenho', reta: { a: 1, b: 2 } },
      dica: 'Faça uma tabelinha: $x = 0$ dá $f(0) = 2$; $x = 1$ dá $f(1) = 3$. Marque os dois pontos e ligue.',
      resolucao: [
        { texto: 'Primeiro os eixos: uma linha deitada e uma em pé, cruzando no 0.', porque: 'Sem eixos não dá para saber onde fica cada número.' },
        { texto: '$f(0) = 2$ dá o ponto (0, 2); $f(1) = 3$ dá o ponto (1, 3).', porque: 'Cada entrada vira um ponto: anda $x$ para o lado e sobe $f(x)$.' },
        { texto: 'A reta passa por (0, 2) e (1, 3) e segue para os dois lados.', porque: 'A cada 1 para a direita, sobe 1: é sempre o mesmo passo.' },
      ],
    },
    {
      enunciado: 'Qual é o valor máximo (a maior altura) de $f(x) = -x^2 + 9$?',
      visual: { tipo: 'grafico', funcoes: [{ expr: '-x^2 + 9', rotulo: 'f(x)', cor: 'a' }], x: [-4, 4], y: [-8, 11] },
      resposta: { tipo: 'numero', valor: 9 },
      dica: '$-x^2$ nunca é positivo. Quando ele é o maior possível?',
      resolucao: [
        { texto: '$-x^2$ vale no máximo 0, quando $x = 0$.', porque: '$x^2$ é sempre $\\ge 0$, então $-x^2$ é sempre $\\le 0$.' },
        { texto: '$f(0) = 0 + 9 = 9$', porque: 'Esse é o topo da parábola, o vértice.' },
      ],
    },
    {
      enunciado: 'Onde $f(x) = x^2$ é crescente?',
      resposta: { tipo: 'escolha', opcoes: ['Para todo x', 'Para x > 0', 'Para x < 0', 'Nunca'], correta: 1 },
      dica: 'Imagine a parábola e leia da esquerda para a direita.',
      resolucao: [
        { texto: 'À esquerda do 0 a parábola desce; à direita, sobe.', porque: 'Ex.: $f(1) = 1$, $f(2) = 4$: entrada maior, saída maior.' },
      ],
    },
    {
      enunciado: 'No gráfico de $f(x) = 2x + 1$, qual a altura do ponto com $x = 4$?',
      resposta: { tipo: 'numero', valor: 9 },
      dica: 'A altura do ponto é $f(4)$.',
      resolucao: [
        { texto: '$f(4) = 2\\cdot 4 + 1 = 9$', porque: 'O ponto é $(4, 9)$.' },
      ],
    },
    {
      enunciado: 'Qual destes desenhos **não** é gráfico de uma função?',
      resposta: { tipo: 'escolha', opcoes: ['Uma reta inclinada', 'Uma parábola', 'Um círculo', 'Uma reta horizontal'], correta: 2 },
      dica: 'Use o teste da reta vertical.',
      resolucao: [
        { texto: 'Uma reta vertical corta o círculo em dois pontos.', porque: 'Uma entrada com duas saídas: não é função.' },
      ],
    },
  ],
  recuperacao: {
    pergunta: 'O que o ponto $(2, 7)$ no gráfico de $f$ diz sobre a função?',
    resposta: 'Que $f(2) = 7$: quando entra 2, sai 7.',
  },
};
