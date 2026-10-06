import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C11_INTEGRAL: ConteudoLicao = {
  gancho: {
    pergunta: 'Um carro anda a 60 km/h durante 2 horas. Quanto ele andou? E se a velocidade fosse mudando o tempo todo?',
    ideia: 'Com velocidade parada: $60\\cdot 2 = 120$ km, que é a área de um retângulo de base 2 e altura 60 no gráfico da velocidade. Se a velocidade muda, corte o tempo em pedaços, finja que em cada pedaço ela fica parada e some os retângulos. Com pedaços cada vez menores, a soma chega na distância exata: a **integral**.',
  },
  construcao: [
    {
      titulo: 'A velocidade que muda',
      texto: 'Este carro acelera: o velocímetro marca 1, 4, 9 km por minuto nos minutos 1, 2 e 3. Quanto ele andou em 3 minutos? Não dá para fazer velocidade vezes tempo de uma vez, porque a velocidade não para quieta.',
      visual: {
        tipo: 'cena', titulo: 'O velocímetro sobe: v(t) = t²', x: [0, 3], unidadeX: 'min', unidadeY: 'km', velocimetro: true,
        veiculos: [{ veiculo: 'carro', nome: 's', expr: 'x^3/3', cor: 'a' }],
      },
    },
    {
      titulo: 'Fatias de tempo',
      texto: 'No gráfico da velocidade, corte o tempo em fatias. Em cada fatia, finja que a velocidade fica parada no valor do começo: a distância daquela fatia é base vezes altura, um retângulo. Some os retângulos. Aumente o número de fatias e veja a soma subir e encostar em 9.',
      visual: { tipo: 'fatias', titulo: 'Velocidade t² de 0 a 3 minutos', expr: 'x^2', x: [0, 3], maxFatias: 30, unidadeX: 'min', unidadeY: 'km/min' },
    },
    {
      titulo: 'A distância é a área',
      texto: 'Somar velocidade vezes tempo, fatia por fatia, é medir a área embaixo do gráfico da velocidade. Com fatias infinitamente finas, a soma vira a área exata: o carro andou 9 km. Toda vez que se soma "taxa vezes tempo", a resposta é uma área.',
    },
    {
      titulo: 'A notação',
      texto: 'O símbolo da integral é um S esticado, de "soma". O $dx$ é a largura da fatia fininha, e $f(x)\\,dx$ é um retângulo. Os números embaixo e em cima dizem de onde até onde se soma.',
      visual: {
        tipo: 'transformacao', titulo: 'Da soma à integral',
        linhas: [
          { latex: '\\sum v(t_k)\\,\\Delta t', porque: 'soma dos retângulos: altura vezes largura' },
          { latex: '\\int_0^3 v(t)\\,dt', porque: 'a mesma soma, com fatias infinitamente finas' },
          { latex: '\\int_0^3 t^2\\,dt = 9', porque: 'a distância: 9 km' },
        ],
      },
    },
    {
      titulo: 'Conferindo com um triângulo',
      texto: 'Para ter certeza de que as fatias funcionam, use uma área conhecida. A velocidade $2t$ de 0 a 4 forma um triângulo de base 4 e altura 8: área 16. As somas com 1, 2, 4, 8 e 100 fatias sobem até encostar em 16.',
      visual: {
        tipo: 'tabela', titulo: 'Somas pela esquerda de 2t, de 0 a 4',
        cabecalho: ['fatias', 'soma'],
        linhas: [['1', '0'], ['2', '8'], ['4', '12'], ['8', '14'], ['100', '15,84'], ['infinitas', '16']],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Distância a partir da velocidade, água num tanque a partir da vazão, energia gasta a partir da potência: tudo que é taxa vezes tempo, somado, é uma integral. A próxima lição mostra um atalho incrível para calcular essas áreas sem somar fatia nenhuma.',
    },
  ],
  resumo: '$\\int_a^b f(x)\\,dx$ é a área sob o gráfico de $f$ entre $a$ e $b$: a soma de fatias $f(x)\\cdot dx$ cada vez mais finas. Se $f$ é a velocidade, a integral é a distância percorrida.',
  exemplos: [
    {
      enunciado: 'Um carro anda a 80 km/h por 3 horas. Quanto andou?',
      passos: [
        { texto: 'O gráfico da velocidade é uma reta horizontal na altura 80.', porque: 'A velocidade não muda.' },
        { texto: 'A área é um retângulo: $80\\cdot 3 = 240$', porque: 'Base vezes altura.' },
        { texto: '$\\int_0^3 80\\,dt = 240$', porque: '240 km.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\int_0^4 2t\\,dt$?',
      passos: [
        { texto: 'A área sob $2t$ de 0 a 4 é um triângulo.', porque: 'A reta sai da origem.' },
        { texto: 'Base 4 e altura $2\\cdot 4 = 8$', porque: 'A altura é o valor no fim.' },
        { texto: '$\\frac{4\\cdot 8}{2} = 16$', porque: 'Área do triângulo.', lacuna: { pergunta: 'Quanto vale a integral?', resposta: { tipo: 'numero', valor: 16 } } },
      ],
    },
    {
      enunciado: 'Estime $\\int_0^2 x^2\\,dx$ somando fatias pela esquerda, com 2 fatias e depois com 4.',
      passos: [
        { texto: 'Com 2 fatias de largura 1, as alturas são $f(0)$ e $f(1)$: a soma é $0\\cdot 1 + 1\\cdot 1 = 1$', porque: 'Altura do começo de cada fatia.', lacuna: { pergunta: 'Quanto dá a soma com 2 fatias?', resposta: { tipo: 'numero', valor: 1 } } },
        { texto: 'Com 4 fatias: $(0 + 0{,}25 + 1 + 2{,}25)\\cdot 0{,}5$, que dá 1,75', porque: 'Alturas em 0; 0,5; 1 e 1,5, largura 0,5.', lacuna: { pergunta: 'Quanto dá com 4 fatias?', resposta: { tipo: 'numero', valor: 1.75 } } },
        { texto: 'A área exata é $\\frac{8}{3} \\approx 2{,}67$: as somas pela esquerda ficam abaixo e vão subindo.', porque: 'A curva sobe; o começo da fatia é sempre o ponto mais baixo dela.' },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Um ciclista anda a 15 km/h por 2 horas. Quantos km ele percorre?',
      resposta: { tipo: 'numero', valor: 30 },
      dica: 'Velocidade parada: um retângulo.',
      resolucao: [
        { texto: '$15\\cdot 2 = 30$', porque: 'Base vezes altura.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\int_0^3 4\\,dx$?',
      resposta: { tipo: 'numero', valor: 12 },
      dica: 'O gráfico de 4 é uma reta horizontal.',
      resolucao: [
        { texto: 'Retângulo de base 3 e altura 4: $3\\cdot 4 = 12$', porque: 'Área sob uma constante.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\int_0^6 x\\,dx$?',
      resposta: { tipo: 'numero', valor: 18 },
      dica: 'A área sob $y = x$ é um triângulo.',
      resolucao: [
        { texto: 'Triângulo de base 6 e altura 6: $\\frac{6\\cdot 6}{2} = 18$', porque: 'Metade do quadrado.' },
      ],
    },
    {
      enunciado: 'Com 2 fatias pela esquerda, estime $\\int_0^4 x\\,dx$.',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Fatias de largura 2, alturas no começo de cada uma.',
      resolucao: [
        { texto: 'Fatias de largura 2, com alturas $f(0)$ e $f(2)$', porque: 'Começo de cada fatia.' },
        { texto: '$0\\cdot 2 + 2\\cdot 2 = 4$', porque: 'A área exata é 8: duas fatias ainda erram muito.' },
      ],
    },
    {
      enunciado: 'Se $v(t)$ é a velocidade de um carro, o que a integral de $v$ entre dois instantes mede?',
      resposta: { tipo: 'escolha', opcoes: ['a velocidade média', 'a distância percorrida entre os dois instantes', 'a aceleração', 'o tempo de viagem'], correta: 1 },
      dica: 'Cada fatia é velocidade vezes tempo.',
      resolucao: [
        { texto: 'Velocidade vezes tempo dá distância; somando as fatias, a distância total.', porque: 'A área sob a velocidade é a distância.' },
        { texto: 'A velocidade média seria essa distância dividida pelo tempo.', porque: 'Por isso não é a mesma coisa.' },
      ],
    },
    {
      enunciado: 'A velocidade de um carro é $v(t) = 10 + 2t$ m/s. Quantos metros ele anda de $t = 0$ a $t = 5$ s?',
      resposta: { tipo: 'numero', valor: 75 },
      dica: 'A área sob essa reta é um trapézio.',
      resolucao: [
        { texto: 'A área é um trapézio de alturas 10 e 20, com base 5.', porque: '$v(0) = 10$ e $v(5) = 20$.' },
        { texto: '$\\frac{(10 + 20)\\cdot 5}{2} = 75$', porque: 'Média das alturas vezes a base.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'A soma pela esquerda de $\\int_0^1 x\\,dx$ com $n$ fatias é $\\frac{n - 1}{2n}$. Quanto ela vale com 100 fatias?',
      resposta: { tipo: 'numero', valor: 0.495 },
      dica: 'Troque $n$ por 100.',
      resolucao: [
        { texto: '$\\frac{100 - 1}{200}$, que dá 0,495', porque: 'Com $n$ crescendo, encosta em $\\frac{1}{2}$, a área do triângulo.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Por que a distância percorrida é a área embaixo do gráfico da velocidade?',
    resposta: 'Porque em cada fatia de tempo a distância é velocidade vezes tempo, base vezes altura de um retângulo. Somando fatias cada vez mais finas, a soma vira a área.',
  },
};
