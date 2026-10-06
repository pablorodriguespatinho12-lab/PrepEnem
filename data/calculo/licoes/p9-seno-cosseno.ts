import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P9_SENO_COSSENO: ConteudoLicao = {
  gancho: {
    pergunta: 'A cadeira de uma roda-gigante de raio 20 m está na altura do eixo. A roda gira 90°. Quantos metros a cadeira subiu? E se a roda girasse só 30°?',
    ideia: 'Com 90°, a cadeira vai ao topo e sobe o raio inteiro: 20 m. Com 30°, sobe só 10 m, metade do raio. Quanto se sobe em cada ângulo é exatamente o que o **seno** mede: sen 90° = 1 e sen 30° = metade.',
  },
  construcao: [
    {
      titulo: 'O ponto que gira',
      texto: 'Um ponto anda num círculo de raio 1. Para dizer onde ele está, bastam dois números: quanto ele está para o lado e quanto está para cima. O de lado é a sombra no chão e se chama [[a:cosseno]]. O de cima é a altura e se chama [[b:seno]]. Gire de 30° em 30° e acompanhe os dois números. Passando de 90°, a sombra vai para a esquerda e o cosseno fica negativo; passando de 180°, o ponto desce e o seno fica negativo.',
      visual: { tipo: 'roda', titulo: 'Gire o ponto: cosseno é a sombra, seno é a altura', divisoes: 12, raio: 1, centro: 0, voltas: 1 },
    },
    {
      titulo: 'Os ângulos que aparecem sempre',
      texto: 'Cinco ângulos resolvem quase toda questão. Repare que seno e cosseno trocam de lugar entre 30° e 60°: o que é altura num é sombra no outro.',
      visual: {
        tipo: 'tabela', titulo: 'Seno e cosseno dos ângulos notáveis',
        cabecalho: ['ângulo', 'cos', 'sen'],
        linhas: [
          ['0°', '1', '0'],
          ['30°', '$\\frac{\\sqrt{3}}{2}$ ≈ 0,87', '$\\frac{1}{2}$'],
          ['45°', '$\\frac{\\sqrt{2}}{2}$ ≈ 0,71', '$\\frac{\\sqrt{2}}{2}$ ≈ 0,71'],
          ['60°', '$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$ ≈ 0,87'],
          ['90°', '0', '1'],
        ],
      },
    },
    {
      titulo: 'De onde vem o sen 30° = 1/2',
      texto: 'Não precisa decorar. Pegue um triângulo equilátero de lado 1 e corte ao meio. No topo fica um ângulo de 30°, e o lado oposto a ele é metade da base: $\\frac{1}{2}$. O cosseno sai por Pitágoras.',
      visual: {
        tipo: 'transformacao', titulo: 'O triângulo equilátero cortado ao meio',
        linhas: [
          { latex: '\\text{lado} = 1,\\ \\text{ângulos de } 60^\\circ', porque: 'triângulo equilátero' },
          { latex: '\\text{metade da base} = \\tfrac{1}{2},\\ \\text{ângulo de } 30^\\circ \\text{ no topo}', porque: 'cortado ao meio' },
          { latex: '\\operatorname{sen} 30^\\circ = \\tfrac{1}{2}', porque: 'lado oposto ao 30°, numa hipotenusa de 1' },
          { latex: '\\cos 30^\\circ = \\sqrt{1 - \\tfrac{1}{4}} = \\tfrac{\\sqrt{3}}{2}', porque: 'Pitágoras: o outro cateto' },
        ],
      },
    },
    {
      titulo: 'No triângulo retângulo: oposto e adjacente',
      texto: 'Uma escada de 5 m encostada no muro, fazendo 30° com o chão, é um triângulo retângulo com hipotenusa 5. O mesmo desenho do círculo, só que 5 vezes maior: a altura é $5\\cdot \\operatorname{sen} 30^\\circ = 2{,}5$ m e o pé fica a $5\\cdot\\cos 30^\\circ \\approx 4{,}33$ m do muro. Por isso $\\operatorname{sen} = \\frac{\\text{oposto}}{\\text{hipotenusa}}$ e $\\cos = \\frac{\\text{adjacente}}{\\text{hipotenusa}}$.',
      visual: {
        tipo: 'vetores', titulo: 'Escada de 5 m a 30° do chão',
        vetores: [
          { de: [0, 0], para: [4.33, 2.5], rotulo: 'escada (5 m)', cor: 'c' },
          { de: [0, 0], para: [4.33, 0], rotulo: 'chão', cor: 'a' },
          { de: [4.33, 0], para: [4.33, 2.5], rotulo: 'altura', cor: 'b' },
        ],
      },
    },
    {
      titulo: 'Pitágoras dentro do círculo',
      texto: 'A sombra, a altura e o raio formam um triângulo retângulo de hipotenusa 1. Pitágoras vale para qualquer ângulo, então sempre $\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$. Teste com 30°: $\\frac{1}{4} + \\frac{3}{4} = 1$.',
      visual: {
        tipo: 'transformacao', titulo: 'A relação fundamental',
        linhas: [
          { latex: '\\text{cateto}^2 + \\text{cateto}^2 = \\text{hipotenusa}^2', porque: 'Pitágoras' },
          { latex: '(\\cos\\theta)^2 + (\\operatorname{sen}\\theta)^2 = 1^2', porque: 'sombra, altura e raio 1' },
          { latex: '\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1', porque: 'vale para todo ângulo' },
        ],
      },
    },
    {
      titulo: 'Radiano: medir o ângulo pelo caminho',
      texto: 'Outro jeito de medir ângulo: pelo comprimento do arco que o ponto percorre no círculo de raio 1. Uma volta inteira tem comprimento $2\\pi \\approx 6{,}28$. Então 360° são $2\\pi$ radianos, e 180° são $\\pi$. O cálculo usa sempre radianos.',
      visual: {
        tipo: 'tabela', titulo: 'Graus e radianos',
        cabecalho: ['graus', 'radianos'],
        linhas: [['30°', '$\\frac{\\pi}{6}$'], ['45°', '$\\frac{\\pi}{4}$'], ['60°', '$\\frac{\\pi}{3}$'], ['90°', '$\\frac{\\pi}{2}$'], ['180°', '$\\pi$'], ['360°', '$2\\pi$']],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Tudo o que gira ou vibra (som, luz, maré, corrente elétrica) se descreve com seno e cosseno. No cálculo aparece uma ligação bonita: a taxa de variação do seno é o cosseno.',
    },
  ],
  resumo: 'No círculo de raio 1, o ponto no ângulo $\\theta$ está em $(\\cos\\theta, \\operatorname{sen}\\theta)$: cosseno é a sombra no chão, seno é a altura. No triângulo retângulo, $\\operatorname{sen} = \\frac{\\text{oposto}}{\\text{hipotenusa}}$ e $\\cos = \\frac{\\text{adjacente}}{\\text{hipotenusa}}$. Sempre $\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$. Uma volta: 360° $= 2\\pi$ rad.',
  exemplos: [
    {
      enunciado: 'Uma escada de 6 m está encostada num muro e faz 30° com o chão. A que altura ela toca o muro?',
      passos: [
        { texto: '$\\operatorname{sen} 30^\\circ = \\frac{\\text{altura}}{6}$', porque: 'A altura é o lado oposto ao ângulo; a escada é a hipotenusa.' },
        { texto: '$\\text{altura} = 6\\cdot \\frac{1}{2}$', porque: '$\\operatorname{sen} 30^\\circ = \\frac{1}{2}$.' },
        { texto: '$\\text{altura} = 3$', porque: 'A escada toca o muro a 3 m do chão.' },
      ],
    },
    {
      enunciado: 'O ângulo $\\theta$ é menor que 90° e $\\operatorname{sen}\\theta = 0{,}6$. Quanto vale $\\cos\\theta$?',
      passos: [
        { texto: '$\\cos^2\\theta = 1 - \\operatorname{sen}^2\\theta$', porque: 'Da relação $\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$.' },
        { texto: '$\\cos^2\\theta = 1 - 0{,}36$, que dá 0,64', porque: '$0{,}6\\cdot 0{,}6 = 0{,}36$.' },
        { texto: '$\\cos\\theta = \\sqrt{0{,}64}$, que dá 0,8', porque: 'Abaixo de 90° o cosseno é positivo.', lacuna: { pergunta: 'Quanto vale $\\cos\\theta$?', resposta: { tipo: 'numero', valor: 0.8 } } },
      ],
    },
    {
      enunciado: 'Uma rampa de 10 m sobe com inclinação de 30°. Quanto ela sobe e quanto avança no chão? Use $\\sqrt{3} \\approx 1{,}73$.',
      passos: [
        { texto: '$\\text{sobe} = 10\\cdot \\operatorname{sen} 30^\\circ = 10\\cdot \\frac{1}{2} = 5$', porque: 'A subida é o lado oposto.', lacuna: { pergunta: 'Quantos metros a rampa sobe?', resposta: { tipo: 'numero', valor: 5 } } },
        { texto: '$\\text{avança} = 10\\cdot \\cos 30^\\circ = 10\\cdot \\frac{\\sqrt{3}}{2}$', porque: 'O avanço no chão é o lado adjacente.' },
        { texto: '$5\\cdot 1{,}73$, que dá 8,65', porque: '$10\\cdot\\frac{\\sqrt{3}}{2} = 5\\sqrt{3}$.', lacuna: { pergunta: 'Quantos metros ela avança no chão?', resposta: { tipo: 'numero', valor: 8.65 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale $\\operatorname{sen} 90^\\circ$?',
      resposta: { tipo: 'numero', valor: 1 },
      dica: 'Em 90°, onde está o ponto no círculo de raio 1?',
      resolucao: [
        { texto: '$\\operatorname{sen} 90^\\circ = 1$', porque: 'Em 90° o ponto está no topo: altura igual ao raio, 1.' },
      ],
    },
    {
      enunciado: 'Uma escada de 8 m faz 60° com o chão. A quantos metros do muro está o pé da escada?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'A distância do pé até o muro é o lado adjacente ao ângulo.',
      resolucao: [
        { texto: '$\\cos 60^\\circ = \\frac{\\text{distância}}{8}$', porque: 'Adjacente sobre hipotenusa.' },
        { texto: '$8\\cdot \\frac{1}{2} = 4$', porque: '$\\cos 60^\\circ = \\frac{1}{2}$.' },
      ],
    },
    {
      enunciado: 'O ângulo $\\theta$ é menor que 90° e $\\cos\\theta = 0{,}8$. Quanto vale $\\operatorname{sen}\\theta$?',
      resposta: { tipo: 'numero', valor: 0.6 },
      dica: 'Use $\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$.',
      resolucao: [
        { texto: '$\\operatorname{sen}^2\\theta = 1 - 0{,}64$, que dá 0,36', porque: '$0{,}8^2 = 0{,}64$.' },
        { texto: '$\\operatorname{sen}\\theta = \\sqrt{0{,}36}$, que dá 0,6', porque: 'Abaixo de 90° o seno é positivo.' },
      ],
    },
    {
      enunciado: 'Quantos graus tem um ângulo de $\\pi$ radianos?',
      resposta: { tipo: 'numero', valor: 180 },
      dica: 'Uma volta inteira são $2\\pi$ radianos.',
      resolucao: [
        { texto: '$2\\pi$ rad é uma volta: 360°.', porque: 'O comprimento do círculo de raio 1 é $2\\pi$.' },
        { texto: '$\\pi$ rad é meia volta: 180°.', porque: 'Metade de 360.' },
      ],
    },
    {
      enunciado: 'Em qual destes ângulos o cosseno é negativo e o seno é positivo?',
      resposta: { tipo: 'escolha', opcoes: ['45°', '135°', '225°', '315°'], correta: 1 },
      dica: 'Cosseno negativo: o ponto está à esquerda. Seno positivo: acima do eixo.',
      resolucao: [
        { texto: 'Em 135° o ponto está à esquerda e acima do eixo.', porque: 'Sombra para a esquerda (cos < 0) e altura para cima (sen > 0).' },
        { texto: 'Nos outros não: o primeiro tem os dois positivos, o terceiro os dois negativos e o quarto tem seno negativo.', porque: 'Cada quarto do círculo tem a sua combinação de sinais.' },
      ],
    },
    {
      enunciado: 'Um avião decola em linha reta, subindo com ângulo de 30° em relação à pista. Depois de percorrer 2 km nessa reta, a que altura, em metros, ele está?',
      resposta: { tipo: 'numero', valor: 1000 },
      dica: 'Os 2 km são a hipotenusa. Passe para metros.',
      resolucao: [
        { texto: '$\\text{altura} = 2000\\cdot \\operatorname{sen} 30^\\circ$', porque: 'A altura é o lado oposto; 2 km = 2000 m.' },
        { texto: '$2000\\cdot \\frac{1}{2} = 1000$', porque: '$\\operatorname{sen} 30^\\circ = \\frac{1}{2}$.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
    {
      enunciado: 'Entre 0° (incluído) e 360° (excluído), em quantos ângulos vale $\\operatorname{sen}\\theta = \\cos\\theta$?',
      resposta: { tipo: 'numero', valor: 2 },
      dica: 'Seno igual a cosseno: a altura e a sombra são iguais, com o mesmo sinal. Onde isso acontece no círculo?',
      resolucao: [
        { texto: 'Altura igual à sombra, com o mesmo sinal: o ponto está na diagonal que passa pelo centro.', porque: 'É a reta $y = x$.' },
        { texto: 'A diagonal corta o círculo em 45° e em 225°.', porque: 'Um ponto em cima à direita e o oposto, embaixo à esquerda.' },
        { texto: 'Total: 2 ângulos.', porque: 'Em 135° e 315° os sinais são diferentes.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'No círculo de raio 1, o que é o seno de um ângulo? E o cosseno?',
    resposta: 'O seno é a altura do ponto. O cosseno é quanto ele está para o lado: a sombra no chão.',
  },
};
