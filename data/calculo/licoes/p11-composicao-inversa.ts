import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P11_COMPOSICAO_INVERSA: ConteudoLicao = {
  gancho: {
    pergunta: 'Um táxi anda 2 km por minuto. O taxímetro cobra R$ 5 mais R$ 2 por km. Quanto custa uma corrida de 3 minutos?',
    ideia: 'São duas máquinas em fila. A primeira transforma o relógio em km: 3 minutos dão 6 km. A segunda transforma o km em preço: $5 + 2\\cdot 6 = 17$ reais. A saída da primeira é a entrada da segunda. Isso se chama **composição**.',
  },
  construcao: [
    {
      titulo: 'Duas máquinas em fila',
      texto: 'Primeira máquina: o relógio vira km, $f(t) = 2t$. Segunda máquina: o km vira preço, $g(k) = 5 + 2k$. Ande o relógio e, a cada minuto, jogue o km da tela no taxímetro. Em 3 minutos, o táxi está no km 6, e o preço é $5 + 2\\cdot 6 = 17$.',
      visual: {
        tipo: 'cena', titulo: 'O táxi anda; o taxímetro lê o km', x: [0, 5], unidadeX: 'min', unidadeY: 'km',
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '2', diz: 'km por minuto' }, { termo: 'f(x)', diz: 'os km rodados' }],
        veiculos: [{ veiculo: 'carro', nome: 'f', expr: '2*x', rotulo: 'táxi', cor: 'a' }],
      },
    },
    {
      titulo: 'A fila numa fórmula só',
      texto: 'Escreve-se $g(f(t))$: lê-se de dentro para fora, primeiro $f$, depois $g$. Trocando $f(t)$ pela regra dele, as duas máquinas viram uma só, que vai direto do relógio ao preço.',
      visual: {
        tipo: 'transformacao', titulo: 'Do relógio ao preço, direto',
        linhas: [
          { latex: 'g(f(t))', porque: 'primeiro f, depois g' },
          { latex: 'g(2t)', porque: 'f(t) é 2t' },
          { latex: '5 + 2\\cdot 2t', porque: 'g pega o que entrou e faz 5 + 2 vezes' },
          { latex: '5 + 4t', porque: 'cada minuto custa 4 reais' },
        ],
      },
    },
    {
      titulo: 'A ordem importa',
      texto: 'Calçar a meia e depois o tênis não é o mesmo que o tênis e depois a meia. Com $f(x) = x + 3$ e $g(x) = x^2$: somar 3 e depois elevar ao quadrado dá outra coisa que elevar e depois somar.',
      visual: {
        tipo: 'tabela', titulo: 'f(x) = x + 3 e g(x) = x²',
        cabecalho: ['x', 'g(f(x)) = (x + 3)²', 'f(g(x)) = x² + 3'],
        linhas: [['0', '9', '3'], ['1', '16', '4'], ['2', '25', '7']],
      },
    },
    {
      titulo: 'Inversa: desfazer',
      texto: 'A pergunta ao contrário: a corrida custou R$ 17, quantos km o táxi andou? Para desfazer, faça as contas ao contrário e na ordem contrária. O taxímetro somou 5 por último, então tire os 5 primeiro; depois desfaça o vezes 2, dividindo. Essa máquina que desfaz é a **inversa**, $g^{-1}$.',
      visual: {
        tipo: 'transformacao', titulo: 'Desfazendo o taxímetro',
        linhas: [
          { latex: 'p = 5 + 2k', porque: 'o taxímetro: km entra, preço sai' },
          { latex: 'p - 5 = 2k', porque: 'tira os 5 fixos' },
          { latex: 'k = \\frac{p - 5}{2}', porque: 'divide por 2' },
          { latex: 'g^{-1}(17) = \\frac{17 - 5}{2} = 6', porque: 'R$ 17 são 6 km' },
        ],
      },
    },
    {
      titulo: 'No gráfico, a inversa é o espelho',
      texto: 'A inversa troca entrada e saída: o ponto $(3, 11)$ de $g$ vira $(11, 3)$ na inversa. Trocar $x$ com $y$ espelha o desenho na diagonal $y = x$, como a exponencial e o log na lição 8.',
      visual: {
        tipo: 'grafico', titulo: 'g e a inversa, espelhadas',
        funcoes: [{ expr: '5+2*x', rotulo: 'g(x)', cor: 'a' }, { expr: '(x-5)/2', rotulo: 'g⁻¹(x)', cor: 'b' }, { expr: 'x', rotulo: 'y = x', cor: 'c' }],
        pontos: [{ x: 3, y: 11, rotulo: '(3, 11)', cor: 'a' }, { x: 11, y: 3, rotulo: '(11, 3)', cor: 'b' }],
        x: [-1, 16], y: [-1, 16],
      },
    },
    {
      titulo: 'Exponencial e log se desfazem',
      texto: 'Na lição 8, o log respondia "quantos minutos até 32 m?". Ele desfaz a exponencial, e a exponencial desfaz o log. Aplicar uma e depois a outra devolve o número do começo.',
      visual: {
        tipo: 'transformacao', titulo: 'Um desfaz o outro',
        linhas: [
          { latex: '\\log_2(2^5) = 5', porque: 'eleva, depois pergunta o expoente' },
          { latex: '2^{\\log_2 32} = 2^5 = 32', porque: 'pergunta o expoente, depois eleva' },
          { latex: '\\log_a(a^x) = x \\quad\\text{e}\\quad a^{\\log_a x} = x', porque: 'em geral' },
        ],
      },
    },
    {
      titulo: 'Quando não dá para desfazer',
      texto: 'Em $x^2$, entra 2 e sai 4, mas entra $-2$ e também sai 4. Vendo só o 4, não dá para saber quem entrou. No gráfico: a reta horizontal na altura 4 corta a parábola em dois pontos. Só existe inversa quando cada saída vem de uma entrada só.',
      visual: {
        tipo: 'grafico', titulo: 'Duas entradas, a mesma saída',
        funcoes: [{ expr: 'x^2', rotulo: 'x²', cor: 'a' }, { expr: '4', rotulo: 'saída 4', cor: 'c' }],
        pontos: [{ x: -2, y: 4, rotulo: 'entra −2', cor: 'b' }, { x: 2, y: 4, rotulo: 'entra 2', cor: 'b' }],
        x: [-3, 3], y: [-1, 9],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'A regra da cadeia, uma das mais usadas do cálculo, é sobre máquinas em fila: como uma mudança na primeira máquina passa para a segunda. E a inversa explica de onde vem a taxa de variação do log.',
    },
  ],
  resumo: '$g(f(x))$: a saída de $f$ entra em $g$. Lê-se de dentro para fora, e a ordem importa. A inversa $f^{-1}$ desfaz $f$: faz as contas ao contrário e na ordem contrária. O gráfico dela é o de $f$ espelhado na reta $y = x$. Exponencial e log são inversas. Só tem inversa a função em que cada saída vem de uma entrada só.',
  exemplos: [
    {
      enunciado: 'Com $f(x) = 3x$ e $g(x) = x + 4$, calcule $g(f(2))$.',
      passos: [
        { texto: '$f(2) = 3\\cdot 2 = 6$', porque: 'De dentro para fora: primeiro $f$.' },
        { texto: '$g(6) = 6 + 4 = 10$', porque: 'A saída de $f$ entra em $g$.' },
        { texto: '$g(f(2)) = 10$', porque: 'Resultado da fila.' },
      ],
    },
    {
      enunciado: 'Com os mesmos $f(x) = 3x$ e $g(x) = x + 4$, calcule $f(g(2))$.',
      passos: [
        { texto: '$g(2) = 2 + 4 = 6$', porque: 'Agora $g$ age primeiro.' },
        { texto: '$f(6) = 3\\cdot 6 = 18$', porque: 'Trocar a ordem trocou o resultado: 18 em vez de 10.', lacuna: { pergunta: 'Quanto vale $f(g(2))$?', resposta: { tipo: 'numero', valor: 18 } } },
      ],
    },
    {
      enunciado: 'Ache a inversa de $f(x) = 2x - 6$ e calcule $f^{-1}(4)$.',
      passos: [
        { texto: '$y = 2x - 6$, então $x = \\frac{y + 6}{2}$', porque: 'Desfaz na ordem contrária: soma 6, depois divide por 2.' },
        { texto: '$f^{-1}(4) = \\frac{4 + 6}{2} = 5$', porque: 'Troca o $y$ por 4.', lacuna: { pergunta: 'Quanto vale $f^{-1}(4)$?', resposta: { tipo: 'numero', valor: 5 } } },
        { texto: 'Confere: $f(5) = 2\\cdot 5 - 6 = 4$', porque: 'A inversa devolveu quem entrou.', lacuna: { pergunta: 'Quanto vale $f(5)$?', resposta: { tipo: 'numero', valor: 4 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Com $f(x) = x + 1$ e $g(x) = x^2$, quanto vale $g(f(3))$?',
      resposta: { tipo: 'numero', valor: 16 },
      dica: 'De dentro para fora: calcule $f(3)$ primeiro.',
      resolucao: [
        { texto: '$f(3) = 4$', porque: '3 mais 1.' },
        { texto: '$g(4) = 4^2 = 16$', porque: 'A saída de $f$ entra em $g$.' },
      ],
    },
    {
      enunciado: 'Com os mesmos $f(x) = x + 1$ e $g(x) = x^2$, quanto vale $f(g(3))$?',
      resposta: { tipo: 'numero', valor: 10 },
      dica: 'Agora $g$ age primeiro.',
      resolucao: [
        { texto: '$g(3) = 9$', porque: '3 ao quadrado.' },
        { texto: '$f(9) = 9 + 1 = 10$', porque: 'Diferente de 16: a ordem importa.' },
      ],
    },
    {
      enunciado: 'A inversa de $f(x) = 4x + 1$, calculada em 9, vale quanto?',
      resposta: { tipo: 'numero', valor: 2 },
      dica: '$f^{-1}(9)$ é o número que entra em $f$ e sai 9.',
      resolucao: [
        { texto: '$4x + 1 = 9$', porque: 'Que entrada dá saída 9?' },
        { texto: '$4x = 8$, então $x = 2$', porque: 'Tira 1, divide por 4.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\log_3(3^7)$?',
      resposta: { tipo: 'numero', valor: 7 },
      dica: 'Log e exponencial na mesma base se desfazem.',
      resolucao: [
        { texto: '$\\log_3(3^7) = 7$', porque: 'O log pergunta o expoente de $3^7$: é 7.' },
      ],
    },
    {
      enunciado: 'Qual destas funções NÃO tem inversa, porque alguma saída vem de duas entradas?',
      resposta: { tipo: 'escolha', opcoes: ['$f(x) = 2x + 1$', '$f(x) = x^3$', '$f(x) = x^2$', '$f(x) = 10^x$'], correta: 2 },
      dica: 'Procure uma função em que um número e o seu oposto dão a mesma saída.',
      resolucao: [
        { texto: 'Em $x^2$, um número e o seu oposto dão a mesma saída.', porque: 'Vendo só a saída, não dá para saber quem entrou.' },
        { texto: 'As outras sempre dão saídas diferentes para entradas diferentes.', porque: 'Por isso cada uma tem inversa.' },
      ],
    },
    {
      enunciado: 'Se $f(x) = 2x + 3$ e $g(f(x)) = 4x + 7$, quanto vale $g(5)$?',
      resposta: { tipo: 'numero', valor: 11 },
      dica: 'Qual entrada faz $f$ dar 5? Use ela na fórmula de $g(f(x))$.',
      resolucao: [
        { texto: '$2x + 3 = 5$ quando $x = 1$', porque: 'É a entrada que faz $f$ sair 5.' },
        { texto: '$g(5) = g(f(1)) = 4\\cdot 1 + 7 = 11$', porque: 'Sem achar a fórmula de $g$: basta a fila.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Se $f(x) = \\frac{x}{x - 1}$, com $x \\ne 1$, quanto vale $f(f(3))$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Calcule $f(3)$ e jogue o resultado de volta em $f$.',
      resolucao: [
        { texto: '$f(3) = \\frac{3}{2}$', porque: '$\\frac{3}{3 - 1}$.' },
        { texto: '$f\\left(\\frac{3}{2}\\right) = \\frac{3/2}{1/2} = 3$', porque: 'Essa função é a própria inversa: aplicada duas vezes, devolve o número.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Em $g(f(x))$, qual máquina age primeiro? E o que a inversa faz?',
    resposta: 'Primeiro age $f$, de dentro para fora, e a saída dela entra em $g$. A inversa desfaz a função: a partir da saída, devolve a entrada.',
  },
};
