import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C5_REGRA_POTENCIA: ConteudoLicao = {
  gancho: {
    pergunta: 'Pela definição, a derivada de $x^2$ deu $2x$. Dá para adivinhar a de $x^3$ sem fazer a conta toda?',
    ideia: 'Em $x^2 \\to 2x$, o 2 de cima desceu para a frente e o expoente perdeu 1. Seguindo o padrão, $x^3$ vira $3x^2$. A lição confere isso pelo limite e transforma o padrão em regra.',
  },
  construcao: [
    {
      titulo: 'O velocímetro de um carro mais rápido',
      texto: 'Agora o carro está no km $x^3$. Ande minuto a minuto e anote o velocímetro: 3, 12, 27. Esses números são $3\\cdot 1^2$, $3\\cdot 2^2$ e $3\\cdot 3^2$. A velocidade é $3x^2$, como o padrão previa.',
      visual: {
        tipo: 'cena', titulo: 'Anote o velocímetro: s(x) = x³', x: [0, 4], unidadeX: 'min', unidadeY: 'km', velocimetro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: 's(x)', diz: 'os km' }, { termo: '\\text{velocímetro}', diz: 'anote: 3, 12, 27...' }],
        veiculos: [{ veiculo: 'carro', nome: 's', expr: 'x^3', cor: 'a' }],
      },
    },
    {
      titulo: 'Conferindo pelo limite',
      texto: 'A mesma conta da lição de derivada, com cubo. Abrindo $(x + h)^3$, todos os termos com $h$ somem no limite, menos um.',
      visual: {
        tipo: 'transformacao', titulo: 'A derivada de x³ pela definição',
        linhas: [
          { latex: '\\frac{(x + h)^3 - x^3}{h}', porque: 'a taxa média' },
          { latex: '= \\frac{3x^2h + 3xh^2 + h^3}{h}', porque: 'abre o cubo; o x³ cancela' },
          { latex: '= 3x^2 + 3xh + h^2', porque: 'corta o h' },
          { latex: '\\xrightarrow{\\,h \\to 0\\,} 3x^2', porque: 'os termos com h somem' },
        ],
      },
    },
    {
      titulo: 'O padrão vira regra',
      texto: 'O expoente desce multiplicando e diminui 1. Vale para qualquer expoente, até fração: $\\sqrt{x} = x^{1/2}$ vira $\\frac{1}{2}x^{-1/2}$.',
      visual: {
        tipo: 'tabela', titulo: 'Regra da potência',
        cabecalho: ['função', 'derivada'],
        linhas: [['$x$', '$1$'], ['$x^2$', '$2x$'], ['$x^3$', '$3x^2$'], ['$x^4$', '$4x^3$'], ['$x^{1/2}$', '$\\frac{1}{2}x^{-1/2}$'], ['$x^n$', '$n\\,x^{n-1}$']],
      },
    },
    {
      titulo: 'Constante vezes função',
      texto: 'Se a posição é $5x^2$, o carro está sempre 5 vezes mais longe que o de $x^2$, então também anda 5 vezes mais rápido: $10x$. A constante só acompanha.',
      visual: {
        tipo: 'transformacao', titulo: 'A constante acompanha',
        linhas: [
          { latex: "(5x^2)' = 5\\cdot (x^2)'", porque: '5 vezes mais longe, 5 vezes mais rápido' },
          { latex: '= 5\\cdot 2x = 10x', porque: 'regra da potência' },
        ],
      },
    },
    {
      titulo: 'Soma: cada parte deriva sozinha',
      texto: 'Em $x^2 + 3x$, a taxa de variação da soma é a soma das taxas. Cada pedaço deriva sozinho e os resultados se somam.',
      visual: {
        tipo: 'transformacao', titulo: 'Derivando uma soma',
        linhas: [
          { latex: "(x^2 + 3x)' = (x^2)' + (3x)'", porque: 'uma parte de cada vez' },
          { latex: '= 2x + 3', porque: 'regra da potência e constante' },
        ],
      },
    },
    {
      titulo: 'Constante sozinha: derivada zero',
      texto: 'Um carro parado no km 7 tem posição $f(x) = 7$ em todo instante. Ele não anda: velocidade 0. A derivada de uma constante é 0, e por isso o "+ 9" de um polinômio some ao derivar.',
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Com essas regras, qualquer polinômio deriva em uma linha, sem limite nenhum. É o atalho que faz a derivada ser usada todo dia em engenharia, economia e física.',
    },
  ],
  resumo: "$(x^n)' = n\\,x^{n-1}$: o expoente desce multiplicando e diminui 1. A constante acompanha: $(c\\cdot f)' = c\\cdot f'$. Soma deriva parte por parte. Derivada de constante é 0.",
  exemplos: [
    {
      enunciado: 'Derive $f(x) = x^5$.',
      passos: [
        { texto: 'O 5 desce e o expoente perde 1: $5x^{5 - 1}$', porque: 'Regra da potência.' },
        { texto: "$f'(x) = 5x^4$", porque: 'Pronto, sem limite.' },
        { texto: 'Em $x = 1$, a inclinação é $5\\cdot 1^4 = 5$', porque: 'Trocando $x$ por 1.' },
      ],
    },
    {
      enunciado: "Derive $g(x) = 4x^3 - 2x + 9$ e calcule $g'(1)$.",
      passos: [
        { texto: "$g'(x) = 12x^2 - 2$", porque: '$4\\cdot 3x^2 = 12x^2$; o $-2x$ vira $-2$; o 9 vira 0.' },
        { texto: "$g'(1) = 12 - 2 = 10$", porque: 'Troca $x$ por 1.', lacuna: { pergunta: "Quanto vale $g'(1)$?", resposta: { tipo: 'numero', valor: 10 } } },
      ],
    },
    {
      enunciado: 'Uma bola tem altura $a(t) = 30t - 5t^2$ metros. Qual a velocidade em $t = 1$ e em $t = 4$ segundos?',
      passos: [
        { texto: "$a'(t) = 30 - 10t$", porque: 'Derivada de $30t$ é 30; de $5t^2$ é $10t$.' },
        { texto: "$a'(1) = 30 - 10 = 20$", porque: 'Subindo a 20 m/s.', lacuna: { pergunta: 'Qual a velocidade em $t = 1$?', resposta: { tipo: 'numero', valor: 20 } } },
        { texto: "$a'(4) = 30 - 40 = -10$", porque: 'Negativa: a bola já está caindo.', lacuna: { pergunta: 'Qual a velocidade em $t = 4$?', resposta: { tipo: 'numero', valor: -10 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale a derivada de $x^4$ em $x = 2$?',
      resposta: { tipo: 'numero', valor: 32 },
      dica: 'Derive com a regra da potência e troque $x$ por 2.',
      resolucao: [
        { texto: "$f'(x) = 4x^3$", porque: 'O 4 desce; o expoente vira 3.' },
        { texto: "$f'(2) = 4\\cdot 8 = 32$", porque: '$2^3 = 8$.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $f(x) = 7x^2$ em $x = 3$?',
      resposta: { tipo: 'numero', valor: 42 },
      dica: 'A constante 7 acompanha.',
      resolucao: [
        { texto: "$f'(x) = 14x$", porque: '$7\\cdot 2x$.' },
        { texto: "$f'(3) = 42$", porque: '$14\\cdot 3$.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $f(x) = x^3 + x^2 + x + 1$ em $x = 1$?',
      resposta: { tipo: 'numero', valor: 6 },
      dica: 'Derive cada parte; a constante some.',
      resolucao: [
        { texto: "$f'(x) = 3x^2 + 2x + 1$", porque: 'Parte por parte; o 1 vira 0.' },
        { texto: "$f'(1) = 3 + 2 + 1 = 6$", porque: 'Troca $x$ por 1.' },
      ],
    },
    {
      enunciado: 'Quanto vale a derivada de $f(x) = 100$?',
      resposta: { tipo: 'numero', valor: 0 },
      dica: 'Um carro parado no km 100.',
      resolucao: [
        { texto: "$f'(x) = 0$", porque: 'Constante não muda: taxa zero.' },
      ],
    },
    {
      enunciado: 'Em que valor de $x$ a tangente à curva $y = x^2 - 6x + 2$ é horizontal?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Tangente horizontal: inclinação zero.',
      resolucao: [
        { texto: "$y' = 2x - 6$", porque: 'Parte por parte.' },
        { texto: '$2x - 6 = 0$ quando $x = 3$', porque: 'É o vértice da parábola, como na lição de quadrática.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Usando a regra da potência com expoente fracionário, quanto vale a derivada de $\\sqrt{x} = x^{1/2}$ em $x = 4$?',
      resposta: { tipo: 'numero', valor: 0.25 },
      dica: 'O $\\frac{1}{2}$ desce e o expoente vira $-\\frac{1}{2}$.',
      resolucao: [
        { texto: "$f'(x) = \\frac{1}{2}x^{-1/2}$, que é $\\frac{1}{2\\sqrt{x}}$", porque: 'Expoente negativo vira fração.' },
        { texto: 'Em 4: $\\frac{1}{2\\cdot 2}$, que dá 0,25', porque: '$\\sqrt{4} = 2$.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Como se deriva $x^n$, em palavras?',
    resposta: 'O expoente desce multiplicando e o novo expoente é um a menos: $n\\,x^{n-1}$.',
  },
};
