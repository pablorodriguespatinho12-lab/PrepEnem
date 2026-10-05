import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P1_FUNCAO: ConteudoLicao = {
  gancho: {
    pergunta: 'Uma corrida de táxi custa R$ 5 para entrar mais R$ 2 por km. Quanto custa uma corrida de 3 km? Do que o preço depende?',
    ideia: 'Custa 5 + 2·3 = R$ 11. O preço depende só da distância: escolhida a distância, o preço fica decidido. Uma coisa que fica decidida por outra é uma função.',
  },
  construcao: [
    {
      titulo: 'Uma máquina de entrada e saída',
      texto: 'Pense numa máquina: entra a distância, sai o preço. Uma **função** é uma regra assim: para cada entrada, ela dá uma saída.',
      visual: { tipo: 'tabela', titulo: 'Táxi: entra a distância, sai o preço', cabecalho: ['entra (km)', 'sai (R$)'], linhas: [['1', '7'], ['2', '9'], ['3', '11'], ['10', '25']] },
    },
    {
      titulo: 'O nome f(x)',
      texto: 'Chamamos a máquina de $f$ e a entrada de $x$. Então $f(x)$ quer dizer "o que sai quando entra $x$". No táxi, $f(x) = 5 + 2x$. Para calcular $f(3)$, troque todo $x$ por 3.',
      visual: {
        tipo: 'transformacao', titulo: 'Calculando f(3)',
        linhas: [
          { latex: 'f(x) = 5 + 2x', porque: 'a regra do táxi' },
          { latex: 'f(3) = 5 + 2\\cdot 3', porque: 'entra 3: todo x vira 3' },
          { latex: 'f(3) = 5 + 6', porque: 'multiplicação primeiro' },
          { latex: 'f(3) = 11', porque: 'sai 11' },
        ],
      },
    },
    {
      titulo: 'Uma entrada, uma saída só',
      texto: 'Se a mesma corrida pudesse custar dois preços diferentes, o taxímetro estaria quebrado. Por isso uma função nunca dá duas saídas para a mesma entrada. Mas duas entradas podem dar a mesma saída: em $f(x) = x^2$, entra 2 e sai 4, entra $-2$ e sai 4 também.',
      visual: { tipo: 'tabela', titulo: 'f(x) = x²', cabecalho: ['x', 'f(x)'], linhas: [['-2', '4'], ['-1', '1'], ['0', '0'], ['1', '1'], ['2', '4']] },
    },
    {
      titulo: 'Domínio: o que pode entrar',
      texto: 'Nem todo número pode entrar na máquina. No táxi, distância negativa não existe, então só entra $x \\ge 0$. Em $f(x) = \\frac{1}{x}$, o 0 não pode entrar, porque não existe divisão por zero. Esse conjunto do que pode entrar é o **domínio**.',
    },
    {
      titulo: 'Imagem: o que pode sair',
      texto: 'A **imagem** é tudo o que pode sair. No táxi, a corrida mais barata é a de 0 km, que custa 5. Então a imagem é todo preço a partir de 5: $f(x) \\ge 5$.',
    },
  ],
  resumo: 'Uma função é uma regra que dá **uma** saída para cada entrada. $f(x)$ é a saída quando entra $x$. Domínio: o que pode entrar. Imagem: o que pode sair.',
  exemplos: [
    {
      enunciado: 'Para $f(x) = 3x - 1$, calcule $f(4)$.',
      passos: [
        { texto: '$f(4) = 3\\cdot 4 - 1$', porque: '$f(4)$ quer dizer "entra 4": todo $x$ vira 4.' },
        { texto: '$f(4) = 12 - 1$', porque: 'Multiplicação vem antes da subtração.' },
        { texto: '$f(4) = 11$', porque: 'Quando entra 4, sai 11.' },
      ],
    },
    {
      enunciado: 'Para $g(x) = x^2 + 2$, calcule $g(3)$.',
      passos: [
        { texto: '$g(3) = 3^2 + 2$', porque: 'Troca $x$ por 3.' },
        { texto: '$g(3) = 9 + 2$', porque: '$3^2 = 3\\cdot 3 = 9$.' },
        { texto: '$g(3) = 11$', porque: 'Soma final.', lacuna: { pergunta: 'Quanto vale $g(3)$?', resposta: { tipo: 'numero', valor: 11 } } },
      ],
    },
    {
      enunciado: 'Para $h(x) = 10 - 2x$, calcule $h(-3)$.',
      passos: [
        { texto: '$h(-3) = 10 - 2\\cdot(-3)$', porque: 'Troca $x$ por $-3$, com parênteses para não perder o sinal.' },
        { texto: '$2\\cdot(-3) = -6$, então $h(-3) = 10 - (-6)$', porque: 'Positivo vezes negativo dá negativo.', lacuna: { pergunta: 'Quanto vale $2\\cdot(-3)$?', resposta: { tipo: 'numero', valor: -6 } } },
        { texto: '$h(-3) = 16$', porque: 'Tirar um negativo é o mesmo que somar: $10 - (-6) = 10 + 6$.', lacuna: { pergunta: 'Quanto vale $10 - (-6)$?', resposta: { tipo: 'numero', valor: 16 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Para $f(x) = 2x + 7$, quanto vale $f(5)$?',
      resposta: { tipo: 'numero', valor: 17 },
      dica: 'Troque o $x$ por 5 e faça a multiplicação primeiro.',
      resolucao: [
        { texto: '$f(5) = 2\\cdot 5 + 7$', porque: 'Entra 5.' },
        { texto: '$= 10 + 7 = 17$', porque: 'Multiplica, depois soma.' },
      ],
    },
    {
      enunciado: 'Para $f(x) = x^2 - 4x$, quanto vale $f(-1)$?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: 'Use parênteses: $(-1)^2$ e $4\\cdot(-1)$.',
      resolucao: [
        { texto: '$f(-1) = (-1)^2 - 4\\cdot(-1)$', porque: 'Troca todo $x$ por $-1$, com parênteses.' },
        { texto: '$= 1 - (-4)$', porque: '$(-1)\\cdot(-1) = 1$ e $4\\cdot(-1) = -4$.' },
        { texto: '$= 1 + 4 = 5$', porque: 'Tirar um negativo é somar.' },
      ],
    },
    {
      enunciado: 'No táxi, $f(x) = 5 + 2x$. Uma corrida custou R$ 21. Quantos km foram rodados?',
      resposta: { tipo: 'numero', valor: 8 },
      dica: 'Agora você sabe a saída (21) e quer a entrada: resolva $5 + 2x = 21$.',
      resolucao: [
        { texto: '$5 + 2x = 21$', porque: 'A saída foi 21.' },
        { texto: '$2x = 16$', porque: 'Tira os 5 fixos dos dois lados.' },
        { texto: '$x = 8$', porque: 'Cada km custa 2, então 16 reais são 8 km.' },
      ],
    },
    {
      enunciado: 'Qual destas regras **não** é uma função?',
      resposta: { tipo: 'escolha', opcoes: ['Cada aluno → sua data de nascimento', 'Cada número → o seu dobro', 'Cada pessoa → um irmão dela', 'Cada hora do dia → a temperatura naquela hora'], correta: 2 },
      dica: 'Procure uma entrada que poderia ter duas saídas, ou nenhuma.',
      resolucao: [
        { texto: 'Quem tem dois irmãos teria duas saídas; quem não tem irmão, nenhuma.', porque: 'Função exige exatamente uma saída para cada entrada.' },
        { texto: 'As outras dão sempre uma saída só: cada aluno nasceu num dia, cada número tem um dobro, cada hora tem uma temperatura.', porque: 'Por isso elas são funções.' },
      ],
    },
    {
      enunciado: 'Em $f(x) = \\frac{1}{x - 3}$, qual número **não** pode entrar?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Que valor de $x$ faz o denominador dar zero?',
      resolucao: [
        { texto: '$x - 3 = 0$ quando $x = 3$', porque: 'O denominador zera em $x = 3$.' },
        { texto: 'Então 3 fica fora do domínio.', porque: 'Não existe divisão por zero.' },
      ],
    },
  ],
  recuperacao: {
    pergunta: 'O que uma função nunca pode fazer com uma mesma entrada?',
    resposta: 'Dar duas saídas diferentes. Cada entrada tem exatamente uma saída.',
  },
};
