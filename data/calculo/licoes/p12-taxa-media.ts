import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P12_TAXA_MEDIA: ConteudoLicao = {
  gancho: {
    pergunta: 'Uma viagem de 300 km durou 4 horas. Qual foi a velocidade média? O velocímetro marcou esse número o tempo todo?',
    ideia: '$300 \\div 4 = 75$ km/h. Mas o carro parou no pedágio e correu na estrada: 75 é a média, não o que o velocímetro marcava em cada instante. Taxa média é isso: quanto mudou dividido pelo tempo que levou.',
  },
  construcao: [
    {
      titulo: 'O carro que acelera',
      texto: 'Um carro sai parado e vai acelerando: depois de $x$ minutos, ele está no km $x^2$. Ande o relógio. No primeiro minuto ele anda 1 km, no segundo 3, no terceiro 5: cada minuto anda mais que o anterior. Então, qual é a velocidade dele?',
      visual: {
        tipo: 'cena', titulo: 'Cada minuto anda mais que o anterior', x: [0, 5], unidadeX: 'min', unidadeY: 'km', rastro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: 'x^2', diz: 'os km: cada minuto anda mais que o anterior' }],
        veiculos: [{ veiculo: 'carro', nome: 's', expr: 'x^2', cor: 'a' }],
      },
    },
    {
      titulo: 'Velocidade média: quanto andou dividido pelo tempo',
      texto: 'Entre o minuto 1 e o minuto 3, o carro foi do km 1 ao km 9: andou 8 km em 2 minutos. A média é 4 km por minuto. O $\\Delta$ (delta) quer dizer "quanto mudou".',
      visual: {
        tipo: 'transformacao', titulo: 'A velocidade média entre 1 e 3',
        linhas: [
          { latex: 'v_m = \\frac{\\Delta s}{\\Delta t}', porque: 'quanto andou dividido pelo tempo' },
          { latex: 'v_m = \\frac{s(3) - s(1)}{3 - 1}', porque: 'posição final menos inicial, sobre o tempo' },
          { latex: 'v_m = \\frac{9 - 1}{2} = 4', porque: '4 km por minuto' },
        ],
      },
    },
    {
      titulo: 'No gráfico: a reta que corta',
      texto: 'Ligue os pontos $(1, 1)$ e $(3, 9)$ do gráfico com uma reta. A inclinação dessa reta, chamada [[b:secante]], é a velocidade média: 4. É o $a$ da lição de função afim, agora medindo uma curva.',
      visual: {
        tipo: 'grafico', titulo: 'A secante entre 1 e 3',
        funcoes: [{ expr: 'x^2', rotulo: 's(x)', cor: 'a' }, { expr: '4*x-3', rotulo: 'secante: inclinação 4', cor: 'b' }],
        pontos: [{ x: 1, y: 1, rotulo: '(1, 1)', cor: 'b' }, { x: 3, y: 9, rotulo: '(3, 9)', cor: 'b' }],
        x: [0, 4], y: [-1, 16],
      },
    },
    {
      titulo: 'Encolhendo o intervalo',
      texto: 'Agora calcule a média entre o minuto 1 e um instante cada vez mais perto dele. As médias se aproximam de 2, sem precisar chegar. Esse 2 é a velocidade **no instante** 1: o que o velocímetro marcaria.',
      visual: {
        tipo: 'tabela', titulo: 'Médias a partir do minuto 1',
        cabecalho: ['de 1 até', 'andou (km)', 'tempo (min)', 'média'],
        linhas: [['3', '8', '2', '4'], ['2', '3', '1', '3'], ['1,5', '1,25', '0,5', '2,5'], ['1,1', '0,21', '0,1', '2,1'], ['1,01', '0,0201', '0,01', '2,01']],
      },
    },
    {
      titulo: 'A secante vira tangente',
      texto: 'Quando o segundo ponto escorrega até o primeiro, a reta que corta a curva vira a reta que só encosta nela: a [[c:tangente]]. A inclinação dela é a taxa no instante. Medir essa inclinação é o trabalho da **derivada**, logo adiante na trilha.',
      visual: {
        tipo: 'grafico', titulo: 'Secante de 1 a 2 e tangente em 1',
        funcoes: [{ expr: 'x^2', rotulo: 's(x)', cor: 'a' }, { expr: '3*x-2', rotulo: 'secante: 3', cor: 'b' }, { expr: '2*x-1', rotulo: 'tangente: 2', cor: 'c' }],
        pontos: [{ x: 1, y: 1, rotulo: '(1, 1)', cor: 'c' }, { x: 2, y: 4, rotulo: '(2, 4)', cor: 'b' }],
        x: [0, 3], y: [-1, 9],
      },
    },
    {
      titulo: 'Taxa média em outras coisas',
      texto: 'Não é só velocidade. Preço por mês, população por ano, temperatura por hora: sempre $\\frac{\\text{quanto mudou}}{\\text{em quanto tempo}}$, com a unidade junto (reais por mês, habitantes por ano).',
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'A tabela do passo "Encolhendo o intervalo" é a ideia inteira do cálculo: chegar cada vez mais perto de um número sem precisar chegar nele. A próxima lição dá nome a isso: **limite**.',
    },
  ],
  resumo: 'Taxa média de variação entre $a$ e $b$: $\\frac{f(b) - f(a)}{b - a}$, quanto a saída mudou dividido por quanto a entrada mudou. No gráfico, é a inclinação da secante que liga os dois pontos. Encolhendo o intervalo, a média se aproxima da taxa no instante: a inclinação da tangente.',
  exemplos: [
    {
      enunciado: 'Uma cultura tinha 200 bactérias às 8h e 800 às 11h. Qual a taxa média de crescimento?',
      passos: [
        { texto: '$\\frac{800 - 200}{11 - 8} = \\frac{600}{3}$', porque: 'Quanto mudou sobre quanto tempo passou.' },
        { texto: '$\\frac{600}{3} = 200$', porque: '200 bactérias por hora, em média.' },
      ],
    },
    {
      enunciado: 'Para $f(x) = x^2$, qual a taxa média entre $x = 2$ e $x = 4$?',
      passos: [
        { texto: '$f(4) - f(2) = 16 - 4 = 12$', porque: 'Quanto a saída mudou.' },
        { texto: '$\\frac{12}{4 - 2} = 6$', porque: 'Dividido por quanto a entrada mudou.', lacuna: { pergunta: 'Qual a taxa média?', resposta: { tipo: 'numero', valor: 6 } } },
      ],
    },
    {
      enunciado: 'Para $f(x) = x^2$, calcule a taxa média entre 3 e 3,1. De que número ela está perto?',
      passos: [
        { texto: '$f(3{,}1) = 3{,}1\\cdot 3{,}1$, que dá 9,61', porque: 'O ponto um pouquinho à frente.', lacuna: { pergunta: 'Quanto vale $f(3{,}1)$?', resposta: { tipo: 'numero', valor: 9.61 } } },
        { texto: '$\\frac{9{,}61 - 9}{0{,}1}$, que dá 6,1', porque: 'Mudou 0,61 em 0,1 de entrada.', lacuna: { pergunta: 'Qual a taxa média?', resposta: { tipo: 'numero', valor: 6.1 } } },
        { texto: 'Encolhendo mais o intervalo, a média se aproxima de 6.', porque: 'É a taxa no instante 3, a inclinação da tangente ali.' },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Um carro estava no km 40 às 2h e no km 160 às 4h. Qual a velocidade média, em km/h?',
      resposta: { tipo: 'numero', valor: 60 },
      dica: 'Quantos km andou e em quantas horas?',
      resolucao: [
        { texto: '$\\frac{160 - 40}{4 - 2} = \\frac{120}{2} = 60$', porque: '120 km em 2 horas.' },
      ],
    },
    {
      enunciado: 'Para $f(x) = 3x + 2$, qual a taxa média entre $x = 1$ e $x = 5$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Calcule $f(5)$ e $f(1)$.',
      resolucao: [
        { texto: '$\\frac{f(5) - f(1)}{5 - 1} = \\frac{17 - 5}{4} = 3$', porque: 'Numa reta, a taxa média é sempre a inclinação $a$.' },
      ],
    },
    {
      enunciado: 'Para $f(x) = x^2$, qual a taxa média entre $x = 0$ e $x = 3$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: '$f(3) = 9$ e $f(0) = 0$.',
      resolucao: [
        { texto: '$\\frac{9 - 0}{3 - 0} = 3$', porque: 'Mudou 9 em 3 de entrada.' },
      ],
    },
    {
      enunciado: 'Um produto custava R$ 50 em janeiro e R$ 62 em abril, 3 meses depois. Qual o aumento médio, em reais por mês?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Quanto o preço mudou e em quantos meses?',
      resolucao: [
        { texto: '$\\frac{62 - 50}{3} = 4$', porque: '12 reais em 3 meses.' },
      ],
    },
    {
      enunciado: 'A taxa média de $f(x) = x^2$ entre o 1 e um número muito perto dele, logo à direita, fica mais perto de qual número?',
      resposta: { tipo: 'escolha', opcoes: ['1', '2', '3', '0'], correta: 1 },
      dica: 'Olhe a tabela do passo "Encolhendo o intervalo".',
      resolucao: [
        { texto: 'Fazendo a conta, a média dá 2 e mais um pouquinho.', porque: 'Quanto mais perto, menor esse pouquinho.' },
        { texto: 'É a taxa naquele instante: a inclinação da tangente.', porque: 'O velocímetro do carro da cena marcaria esse número.' },
      ],
    },
    {
      enunciado: 'Para $f(x) = x^2$, a taxa média entre $a$ e $a + h$ é $2a + h$. Usando isso, qual a taxa média entre 5 e 5,5?',
      resposta: { tipo: 'numero', valor: 10.5 },
      dica: 'Aqui $a = 5$ e $h = 0{,}5$.',
      resolucao: [
        { texto: '$2\\cdot 5 + 0{,}5$, que dá 10,5', porque: 'De $\\frac{(a + h)^2 - a^2}{h} = \\frac{2ah + h^2}{h} = 2a + h$.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Uma bola é lançada para cima, e sua altura é $h(t) = 20t - 5t^2$ metros, com $t$ em segundos. Qual a velocidade média, em m/s, entre $t = 1$ e $t = 3$?',
      resposta: { tipo: 'numero', valor: 0 },
      dica: 'Calcule a altura nos dois instantes.',
      resolucao: [
        { texto: 'Em $t = 1$ e em $t = 3$, a altura é 15 m.', porque: '$20 - 5$ e $60 - 45$.' },
        { texto: '$\\frac{15 - 15}{3 - 1} = 0$', porque: 'Subiu e desceu a mesma altura: a média é zero, embora a bola tenha se movido o tempo todo.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
  ],
  recuperacao: {
    pergunta: 'O que a taxa média de variação mede? E o que acontece com ela quando o intervalo encolhe?',
    resposta: 'Quanto a saída mudou dividido por quanto a entrada mudou: a inclinação da secante. Encolhendo o intervalo, ela se aproxima da taxa no instante, a inclinação da tangente.',
  },
};
