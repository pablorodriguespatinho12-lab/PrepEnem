import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P10_PERIODICAS: ConteudoLicao = {
  gancho: {
    pergunta: 'Uma roda-gigante leva 10 minutos para dar uma volta. Às 15h, uma cadeira está na altura do eixo, subindo. Onde ela vai estar às 15h30?',
    ideia: '30 minutos são 3 voltas inteiras: ela volta exatamente para a altura do eixo, subindo. O que se repete a cada 10 minutos só depende de quanto sobra depois das voltas inteiras. Isso é uma **função periódica**, e o tempo de uma volta é o **período**.',
  },
  construcao: [
    {
      titulo: 'A roda-gigante desenrolada',
      texto: 'Raio de 20 m, eixo a 22 m do chão. Gire duas voltas e olhe o gráfico: a cadeira sobe até 42 m, desce até 2 m e recomeça. O desenho de uma volta se copia na volta seguinte. Essa onda é o gráfico do seno, só que esticado e levantado.',
      visual: { tipo: 'roda', titulo: 'Duas voltas da roda-gigante', divisoes: 8, raio: 20, centro: 22, voltas: 2, unidade: 'm', grafico: true },
    },
    {
      titulo: 'O seno desenrolado',
      texto: 'Agora o círculo de raio 1. No eixo $x$, o ângulo em radianos; no eixo $y$, a altura. A onda sobe até 1 em $\\frac{\\pi}{2}$, volta a 0 em $\\pi$, desce até $-1$ em $\\frac{3\\pi}{2}$ e fecha a volta em $2\\pi$. Depois, repete. O [[b:cosseno]] é a mesma onda, adiantada de $\\frac{\\pi}{2}$.',
      visual: {
        tipo: 'grafico', titulo: 'sen x e cos x, duas voltas',
        funcoes: [{ expr: 'sin(x)', rotulo: 'sen x', cor: 'a' }, { expr: 'cos(x)', rotulo: 'cos x', cor: 'b' }],
        pontos: [{ x: 1.5708, y: 1, rotulo: 'topo em π/2', cor: 'a' }, { x: 6.2832, y: 0, rotulo: 'uma volta: 2π', cor: 'a' }],
        x: [0, 12.57], y: [-1.5, 1.5],
      },
    },
    {
      titulo: 'Amplitude: o tamanho do balanço',
      texto: 'Em $3\\operatorname{sen} x$, cada altura fica 3 vezes maior: a onda vai de $-3$ a $3$. Esse 3 é a [[a:amplitude]], quanto a onda balança acima e abaixo do meio. Na roda-gigante, a amplitude é o raio. É a regra da lição de transformações: multiplicar fora estica na vertical.',
      visual: {
        tipo: 'grafico', titulo: 'sen x contra 3 sen x',
        funcoes: [{ expr: 'sin(x)', rotulo: 'sen x', cor: 'c' }, { expr: '3*sin(x)', rotulo: '3 sen x', cor: 'a' }],
        x: [0, 6.29], y: [-3.5, 3.5],
      },
    },
    {
      titulo: 'Linha do meio: subir a onda inteira',
      texto: 'Na roda-gigante, a altura é $22 + 20\\operatorname{sen}\\theta$. O 20 é a amplitude (o raio). O 22 levanta tudo: a onda balança em torno de 22, a altura do eixo. Somar fora sobe o desenho, também como na lição de transformações.',
      visual: {
        tipo: 'tabela', titulo: 'Altura da cadeira: 22 + 20 · sen θ',
        cabecalho: ['ângulo', 'sen θ', 'altura (m)'],
        linhas: [['0°', '0', '22'], ['90°', '1', '42'], ['180°', '0', '22'], ['270°', '−1', '2'], ['360°', '0', '22']],
      },
    },
    {
      titulo: 'Período: de quanto em quanto se repete',
      texto: 'Em $\\operatorname{sen}(2x)$, a entrada anda duas vezes mais rápido: a onda dá duas voltas no espaço de uma. O período cai de $2\\pi$ para $\\pi$. Em geral, $\\operatorname{sen}(bx)$ se repete a cada $\\frac{2\\pi}{b}$. Multiplicar dentro aperta o desenho na horizontal.',
      visual: {
        tipo: 'grafico', titulo: 'sen x contra sen 2x',
        funcoes: [{ expr: 'sin(x)', rotulo: 'sen x', cor: 'c' }, { expr: 'sin(2*x)', rotulo: 'sen 2x', cor: 'b' }],
        pontos: [{ x: 3.1416, y: 0, rotulo: 'sen 2x já repetiu: π', cor: 'b' }],
        x: [0, 6.29], y: [-1.5, 1.5],
      },
    },
    {
      titulo: 'A fórmula da onda',
      texto: 'Juntando as três peças, toda onda dessas se escreve com três números. Cada um mexe numa coisa só do desenho.',
      visual: {
        tipo: 'transformacao', titulo: 'f(x) = d + a sen(bx)',
        linhas: [
          { latex: 'f(x) = d + a\\operatorname{sen}(bx)', porque: 'a forma geral' },
          { latex: 'd', porque: 'linha do meio: sobe ou desce a onda' },
          { latex: 'a', porque: 'amplitude: quanto balança acima e abaixo do meio' },
          { latex: '\\text{período} = \\frac{2\\pi}{b}', porque: 'de quanto em quanto se repete' },
        ],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Som, maré, batimento do coração e a corrente da tomada são ondas assim. No cálculo se mostra que quase toda onda que se repete pode ser montada somando senos e cossenos. É a ideia por trás da compressão de áudio.',
    },
  ],
  resumo: '$f(x) = d + a\\operatorname{sen}(bx)$: $d$ é a linha do meio, $a$ é a amplitude (quanto balança) e o período é $\\frac{2\\pi}{b}$ (de quanto em quanto se repete). Seno e cosseno se repetem a cada $2\\pi$, e o cosseno é o seno adiantado de $\\frac{\\pi}{2}$.',
  exemplos: [
    {
      enunciado: 'Qual a linha do meio, a amplitude e o período de $f(x) = 5 + 3\\operatorname{sen}(2x)$?',
      passos: [
        { texto: 'Linha do meio: $d = 5$', porque: 'O número somado fora sobe a onda.' },
        { texto: 'Amplitude: $a = 3$', porque: 'O número que multiplica o seno estica a onda.' },
        { texto: 'Período: $\\frac{2\\pi}{2} = \\pi$', porque: 'O 2 dentro faz a onda repetir duas vezes mais rápido.' },
      ],
    },
    {
      enunciado: 'Qual o maior valor de $f(x) = 5 + 3\\operatorname{sen}(2x)$?',
      passos: [
        { texto: '$\\operatorname{sen}(2x)$ fica entre −1 e 1', porque: 'Como todo seno.' },
        { texto: 'O maior valor acontece quando $\\operatorname{sen}(2x)$ vale 1', porque: 'Amplitude positiva: quanto maior o seno, maior $f$.' },
        { texto: '$5 + 3\\cdot 1 = 8$', porque: 'Linha do meio mais a amplitude.', lacuna: { pergunta: 'Qual o maior valor de $f$?', resposta: { tipo: 'numero', valor: 8 } } },
      ],
    },
    {
      enunciado: 'Uma roda-gigante tem o eixo a 30 m do chão e raio de 25 m. Qual a altura máxima e a mínima de uma cadeira?',
      passos: [
        { texto: 'Altura da cadeira: $30 + 25\\operatorname{sen}\\theta$', porque: 'Linha do meio 30, amplitude 25.' },
        { texto: '$\\text{máxima} = 30 + 25 = 55$', porque: 'No topo, $\\operatorname{sen}\\theta$ vale 1.', lacuna: { pergunta: 'Qual a altura máxima, em metros?', resposta: { tipo: 'numero', valor: 55 } } },
        { texto: '$\\text{mínima} = 30 - 25 = 5$', porque: 'Embaixo, $\\operatorname{sen}\\theta$ vale −1.', lacuna: { pergunta: 'Qual a altura mínima, em metros?', resposta: { tipo: 'numero', valor: 5 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Qual a amplitude de $f(x) = 4\\operatorname{sen} x$?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Quanto a onda sobe acima do meio?',
      resolucao: [
        { texto: '$a = 4$', porque: 'O seno vai de −1 a 1; multiplicado por 4, vai de −4 a 4.' },
      ],
    },
    {
      enunciado: 'Qual o menor valor de $g(x) = 10 + 2\\cos x$?',
      resposta: { tipo: 'numero', valor: 8 },
      dica: 'O menor valor do cosseno é −1.',
      resolucao: [
        { texto: 'O cosseno vai de −1 a 1.', porque: 'Como o seno.' },
        { texto: '$10 + 2\\cdot(-1) = 8$', porque: 'Linha do meio menos a amplitude.' },
      ],
    },
    {
      enunciado: 'O período de $\\operatorname{sen}(4x)$ é $\\frac{2\\pi}{4}$. Quantos períodos dele cabem numa volta inteira, $2\\pi$?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Divida $2\\pi$ pelo período.',
      resolucao: [
        { texto: '$2\\pi \\div \\frac{2\\pi}{4} = 4$', porque: 'A onda repete 4 vezes no espaço de uma volta.' },
      ],
    },
    {
      enunciado: 'Numa praia, a altura da maré segue $h(t) = 3 + 2\\operatorname{sen}\\left(\\frac{\\pi t}{6}\\right)$, com $t$ em horas. De quantas em quantas horas a maré se repete?',
      resposta: { tipo: 'numero', valor: 12 },
      dica: 'O período é $\\frac{2\\pi}{b}$. Quem é o $b$ aqui?',
      resolucao: [
        { texto: '$b = \\frac{\\pi}{6}$', porque: 'É o número que multiplica o $t$ dentro do seno.' },
        { texto: '$\\text{período} = 2\\pi \\div \\frac{\\pi}{6} = 12$', porque: '$2\\pi\\cdot\\frac{6}{\\pi} = 12$.' },
      ],
    },
    {
      enunciado: 'Uma roda-gigante de raio 20 m tem o eixo a 22 m do chão e dá uma volta a cada 8 minutos. A cadeira parte da altura do eixo, subindo. Qual a altura dela, em metros, depois de 2 minutos?',
      resposta: { tipo: 'numero', valor: 42 },
      dica: 'Que fração da volta são 2 minutos? Que ângulo é esse?',
      resolucao: [
        { texto: '2 minutos são um quarto de volta: 90°.', porque: '2 de 8 minutos.' },
        { texto: '$22 + 20\\cdot\\operatorname{sen} 90^\\circ = 42$', porque: 'Um quarto de volta subindo leva a cadeira ao topo.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
    {
      enunciado: 'Entre 0 e $2\\pi$, incluindo os dois, quantas vezes $\\operatorname{sen}(2x)$ vale zero?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: 'O seno zera em todo múltiplo de $\\pi$. Quais múltiplos de $\\pi$ o $2x$ alcança?',
      resolucao: [
        { texto: '$\\operatorname{sen}(2x)$ zera quando $2x$ é $0, \\pi, 2\\pi, 3\\pi$ ou $4\\pi$.', porque: 'Com $x$ indo até $2\\pi$, o $2x$ vai até $4\\pi$.' },
        { texto: 'Dividindo por 2: $x$ é $0, \\frac{\\pi}{2}, \\pi, \\frac{3\\pi}{2}$ ou $2\\pi$.', porque: 'Período $\\pi$: o dobro de zeros do seno comum.' },
        { texto: 'Total: 5 valores.', porque: 'O $\\operatorname{sen} x$ comum zeraria só 3 vezes nesse trecho.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Numa onda $d + a\\operatorname{sen}(bx)$, o que cada letra muda no desenho?',
    resposta: 'O $d$ sobe ou desce a onda inteira. O $a$ muda o tamanho do balanço. O $b$ muda de quanto em quanto ela se repete: o período é $\\frac{2\\pi}{b}$.',
  },
};
