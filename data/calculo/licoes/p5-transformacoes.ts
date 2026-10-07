import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P5_TRANSFORMACOES: ConteudoLicao = {
  gancho: {
    pergunta: 'O gráfico de $x^2$ tem o vértice em $(0, 0)$. Onde fica o vértice de $(x - 3)^2 + 1$?',
    ideia: 'Em $(3, 1)$: a parábola andou 3 para a direita e subiu 1. O "+1" de fora sobe. O "−3" de dentro anda para a direita, e não para a esquerda. A lição explica por quê.',
  },
  construcao: [
    {
      titulo: 'Somar fora sobe o desenho',
      texto: 'Em $x^2 + 2$, cada saída de $x^2$ ganha 2. Todos os pontos sobem 2, e o desenho inteiro sobe junto, sem mudar de forma.',
      visual: { tipo: 'tabela', titulo: 'Somando 2 na saída', cabecalho: ['x', 'x²', 'x² + 2'], linhas: [['−1', '1', '3'], ['0', '0', '2'], ['1', '1', '3'], ['2', '4', '6']] },
    },
    {
      titulo: 'Mexer dentro anda para o lado',
      texto: 'Em $g(x) = (x - 3)^2$, a saída zera quando $x - 3 = 0$, ou seja, em $x = 3$. O que acontecia em $x = 0$ agora acontece em $x = 3$: o desenho andou 3 para a [[b:direita]].',
      visual: {
        tipo: 'grafico',
        funcoes: [{ expr: 'x^2', rotulo: 'x²', cor: 'a' }, { expr: '(x - 3)^2', rotulo: '(x − 3)²', cor: 'b' }],
        pontos: [{ x: 0, y: 0, rotulo: '(0, 0)', cor: 'a' }, { x: 3, y: 0, rotulo: '(3, 0)', cor: 'b' }],
        x: [-3, 6], y: [-1, 9],
      },
    },
    {
      titulo: 'A moto que vem 2 minutos atrás',
      texto: 'O carro anda pela regra $f(x) = 5x$. A moto faz exatamente o mesmo caminho, só que **2 minutos depois**: onde o carro estava no minuto 0, a moto chega no minuto 2. A regra da moto é $g(x) = f(x - 2) = 5(x - 2)$. Compare: $g(2) = f(0)$ e $g(3) = f(1)$. No gráfico, a linha da moto é a do carro empurrada 2 para a **direita**. O "−2" de dentro atrasa, e atrasar no relógio é andar para a direita.',
      visual: {
        tipo: 'cena', titulo: 'Carro f(x) = 5x e moto g(x) = f(x − 2)', x: [0, 6], unidadeX: 'min', unidadeY: 'km',
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '5', diz: 'km por minuto, igual para os dois' }, { termo: 'x - 2', diz: 'a moto sai 2 minutos depois' }],
        veiculos: [
          { veiculo: 'carro', nome: 'f', expr: '5*x', cor: 'a' },
          { veiculo: 'moto', nome: 'g', expr: '5*(x-2)', cor: 'b' },
        ],
      },
    },
    {
      titulo: 'Por que parece ao contrário',
      texto: 'Compare as entradas: para $(x - 3)^2$ dar 0, 1 ou 4, a entrada precisa ser 3 maior do que em $x^2$. Tudo acontece 3 passos mais tarde, e "mais tarde" no eixo $x$ é mais para a direita. O sinal de menos atrasa; o de mais adianta.',
      visual: { tipo: 'tabela', titulo: 'Mesma saída, entrada 3 maior', cabecalho: ['saída', 'em x² entra', 'em (x − 3)² entra'], linhas: [['0', '0', '3'], ['1', '1', '4'], ['4', '2', '5']] },
    },
    {
      titulo: 'Multiplicar fora estica ou espelha',
      texto: 'Em $2x^2$, cada altura dobra: a parábola fica mais fechada. Em $-x^2$, cada altura troca de sinal: o desenho espelha no eixo $x$ e abre para baixo. É o "sinal de a" da lição anterior.',
      visual: {
        tipo: 'grafico',
        funcoes: [{ expr: 'x^2', rotulo: 'x²', cor: 'a' }, { expr: '2x^2', rotulo: '2x²', cor: 'b' }, { expr: '-x^2', rotulo: '−x²', cor: 'c' }],
        x: [-3, 3], y: [-8, 9],
      },
    },
    {
      titulo: 'Tudo junto: a forma do vértice',
      texto: 'Na lição da quadrática, completar o quadrado deu $x^2 - 6x + 5 = (x - 3)^2 - 4$. Agora isso se lê como desenho: é $x^2$ andando 3 para a direita e descendo 4. O vértice vai de $(0, 0)$ para $(3, -4)$.',
      visual: {
        tipo: 'transformacao', titulo: 'Lendo a fórmula como movimento',
        linhas: [
          { latex: 'y = x^2', porque: 'vértice em (0, 0)' },
          { latex: 'y = (x - 3)^2', porque: 'anda 3 para a direita: vértice (3, 0)' },
          { latex: 'y = (x - 3)^2 - 4', porque: 'desce 4: vértice (3, −4)' },
          { latex: 'y = a(x - h)^2 + k', porque: 'em geral: vértice (h, k)' },
        ],
      },
    },
  ],
  resumo: '$f(x) + k$ sobe $k$. $f(x - h)$ anda $h$ para a direita (a entrada precisa ser $h$ maior para chegar no mesmo lugar). $a\\cdot f(x)$ estica as alturas por $a$; com $a$ negativo, espelha no eixo $x$. O vértice de $a(x - h)^2 + k$ é $(h, k)$.',
  exemplos: [
    {
      enunciado: 'Descreva o gráfico de $y = (x + 2)^2 - 5$ a partir de $y = x^2$.',
      visual: {
        tipo: 'grafico',
        funcoes: [{ expr: 'x^2', rotulo: 'x²', cor: 'a' }, { expr: '(x + 2)^2 - 5', rotulo: 'novo', cor: 'b' }],
        pontos: [{ x: -2, y: -5, rotulo: '(−2, −5)', cor: 'b' }],
        x: [-6, 3], y: [-6, 9],
      },
      passos: [
        { texto: '$x + 2 = x - (-2)$, então $h = -2$', porque: 'Mais dentro adianta: anda 2 para a esquerda.' },
        { texto: '$k = -5$', porque: 'Menos 5 fora: desce 5.' },
        { texto: 'Vértice em $(-2, -5)$', porque: 'Parte de $(0, 0)$, vai 2 para a esquerda e 5 para baixo.' },
      ],
    },
    {
      enunciado: 'Se $f(x) = x^2$ e $g(x) = f(x - 1) + 2$, quanto vale $g(4)$?',
      passos: [
        { texto: '$g(4) = f(4 - 1) + 2 = f(3) + 2$', porque: 'Troca $x$ por 4 na regra de $g$.' },
        { texto: '$f(3) = 3^2 = 9$', porque: '$f$ eleva ao quadrado.', lacuna: { pergunta: 'Quanto vale $f(3)$?', resposta: { tipo: 'numero', valor: 9 } } },
        { texto: '$g(4) = 9 + 2 = 11$', porque: 'Soma o 2 de fora.' },
      ],
    },
    {
      enunciado: 'Qual é o vértice e o valor mínimo de $y = 2(x - 1)^2 + 3$?',
      passos: [
        { texto: '$h = 1$', porque: 'Menos 1 dentro: anda 1 para a direita.', lacuna: { pergunta: 'Qual é o $x$ do vértice?', resposta: { tipo: 'numero', valor: 1 } } },
        { texto: '$k = 3$, vértice $(1, 3)$', porque: 'Mais 3 fora: sobe 3.' },
        { texto: 'Valor mínimo 3', porque: '$a = 2 > 0$: abre para cima, e o vértice é o ponto mais baixo. O 2 só deixa a parábola mais fechada.', lacuna: { pergunta: 'Qual é o menor valor de $y$?', resposta: { tipo: 'numero', valor: 3 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Qual é o $x$ do vértice de $y = (x - 4)^2 + 1$?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Menos dentro anda para a direita.',
      resolucao: [
        { texto: '$(x - 4)^2$ é $x^2$ andando 4 para a direita.', porque: 'A entrada precisa ser 4 maior.' },
        { texto: '$x_v = 4$', porque: 'O vértice sai de $x = 0$ e vai para $x = 4$.' },
      ],
    },
    {
      enunciado: 'O gráfico de $y = x^2$ anda 5 para a esquerda e desce 2. Quanto vale a nova função em $x = 0$?',
      resposta: { tipo: 'numero', valor: 23 },
      dica: 'Esquerda é "mais" dentro: $(x + 5)^2$. Descer é "menos" fora.',
      resolucao: [
        { texto: 'Nova função: $y = (x + 5)^2 - 2$', porque: 'Adianta 5 e desce 2.' },
        { texto: 'Em $x = 0$: $(0 + 5)^2 - 2 = 25 - 2 = 23$', porque: 'Troca $x$ por 0.' },
      ],
    },
    {
      enunciado: 'Como é o gráfico de $y = -x^2 + 3$?',
      resposta: { tipo: 'escolha', opcoes: ['Parábola para baixo, vértice (0, 3)', 'Parábola para cima, vértice (0, 3)', 'Parábola para baixo, vértice (0, −3)', 'Parábola para cima, vértice (3, 0)'], correta: 0 },
      dica: 'O sinal de menos na frente espelha; o +3 sobe.',
      resolucao: [
        { texto: '$-x^2$ é $x^2$ espelhado: abre para baixo.', porque: 'Toda altura troca de sinal.' },
        { texto: 'O $+3$ sobe tudo 3: vértice em $(0, 3)$.', porque: 'Somar fora sobe.' },
      ],
    },
    {
      enunciado: 'Escreva $x^2 + 4x + 1$ na forma $(x - h)^2 + k$. Quanto vale $k$?',
      resposta: { tipo: 'numero', valor: -3 },
      dica: 'Metade de 4 é 2: compare com $(x + 2)^2$.',
      resolucao: [
        { texto: '$(x + 2)^2 = x^2 + 4x + 4$', porque: 'Mesmo começo que a expressão.' },
        { texto: '$x^2 + 4x + 1 = (x + 2)^2 - 3$, então $k = -3$', porque: 'O quadrado tem 4 e a expressão tem 1: tira 3.' },
      ],
    },
    {
      enunciado: 'O gráfico de $y = x^2 - 2x$ é empurrado para cima até tocar o eixo $x$ num único ponto. Quantas unidades ele subiu?',
      resposta: { tipo: 'numero', valor: 1 },
      dica: 'Ache o vértice completando o quadrado. Ele precisa chegar até a altura 0.',
      resolucao: [
        { texto: '$x^2 - 2x = (x - 1)^2 - 1$', porque: '$(x - 1)^2 = x^2 - 2x + 1$: tira 1.' },
        { texto: 'Vértice em $(1, -1)$: para chegar à altura 0, sobe $1 - 0 = 1$', porque: 'Tocar o eixo num ponto só é o vértice encostar nele.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Qual é o menor número inteiro $k$ para o qual a parábola $y = x^2 - 4x + k$ fica inteira acima do eixo $x$, sem tocá-lo?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: 'Escreva na forma do vértice. A parábola abre para cima: basta o vértice estar acima do eixo.',
      resolucao: [
        { texto: '$x^2 - 4x + k = (x - 2)^2 + (k - 4)$', porque: '$(x - 2)^2 = x^2 - 4x + 4$.' },
        { texto: 'Vértice $(2, k - 4)$ acima do eixo: $k - 4 > 0$, ou seja, $k > 4$', porque: 'O vértice é o ponto mais baixo.' },
        { texto: 'Menor inteiro: $k = 5$', porque: 'O 4 não serve: com $k = 4$ o vértice encosta no eixo.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Por que $f(x - 3)$ anda para a DIREITA, se tem um sinal de menos?',
    resposta: 'Porque a entrada precisa ser 3 maior para dar a mesma saída: tudo que acontecia em $x = 0$ passa a acontecer em $x = 3$.',
  },
};
