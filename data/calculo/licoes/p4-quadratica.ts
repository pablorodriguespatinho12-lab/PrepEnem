import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P4_QUADRATICA: ConteudoLicao = {
  gancho: {
    pergunta: 'Um terreno quadrado tem lado $x$ metros. Se o lado dobra, a área dobra também?',
    ideia: 'Não: a área é $x^2$. Lado 2 dá área 4; lado 4 dá área 16, quatro vezes mais. Aqui a mudança não é sempre a mesma, e por isso o desenho não é uma reta.',
  },
  construcao: [
    {
      titulo: 'A bola jogada para cima',
      texto: 'Jogue uma bola para cima. Ela sobe rápido, vai perdendo força, para lá no alto e cai. A altura depois de $x$ segundos é $h(x) = 20x - 5x^2$. Em 1 s ela está a 15 m, em 2 s chega a 20 m, o ponto mais alto, e em 4 s volta ao chão. O rastro no gráfico não é uma reta: é uma curva que sobe e desce, a **parábola**. O ponto mais alto é o [[c:vértice]]. Os instantes em que a bola está no chão (0 s e 4 s) são as **raízes**.',
      visual: {
        tipo: 'cena', titulo: 'A altura da bola segundo a segundo', x: [0, 4], unidadeX: 's', unidadeY: 'm', rastro: true,
        legenda: [{ termo: 'x', diz: 'os segundos' }, { termo: '20x', diz: 'o empurrão para cima' }, { termo: '-5x^2', diz: 'a gravidade puxando para baixo' }, { termo: 'h(x)', diz: 'a altura (m)' }],
        veiculos: [{ veiculo: 'bola', nome: 'h', expr: '20*x-5*x^2', cor: 'a' }],
      },
    },
    {
      titulo: 'A mudança cresce',
      texto: 'Na reta, cada passo de $x$ mudava $y$ sempre o mesmo tanto. Em $x^2$, a mudança vai 1, 3, 5, 7: cresce de 2 em 2. Como a inclinação aumenta, o desenho entorta.',
      visual: { tipo: 'tabela', titulo: 'f(x) = x²', cabecalho: ['x', 'x²', 'mudança'], linhas: [['0', '0', '—'], ['1', '1', '+1'], ['2', '4', '+3'], ['3', '9', '+5'], ['4', '16', '+7']] },
    },
    {
      titulo: 'A parábola é um espelho',
      texto: 'Como $(-2)^2 = 2^2 = 4$, os pontos de $x = -2$ e $x = 2$ ficam na mesma altura. O desenho é simétrico em torno de uma reta vertical, e o ponto onde ele vira é o [[c:vértice]].',
      visual: {
        tipo: 'grafico', titulo: 'f(x) = x²',
        funcoes: [{ expr: 'x^2', rotulo: 'f(x)', cor: 'a' }],
        pontos: [{ x: -2, y: 4, rotulo: '(−2, 4)', cor: 'b' }, { x: 2, y: 4, rotulo: '(2, 4)', cor: 'b' }, { x: 0, y: 0, rotulo: 'vértice', cor: 'c' }],
        x: [-4, 4], y: [-1, 17],
      },
    },
    {
      titulo: 'O sinal de a vira a parábola',
      texto: 'Toda quadrática se escreve $f(x) = ax^2 + bx + c$. Se $a > 0$, ela abre para cima e o vértice é o ponto mais baixo (mínimo). Se $a < 0$, abre para baixo e o vértice é o mais alto (máximo).',
      visual: {
        tipo: 'grafico',
        funcoes: [{ expr: 'x^2', rotulo: 'a > 0: mínimo', cor: 'a' }, { expr: '-x^2 + 4', rotulo: 'a < 0: máximo', cor: 'b' }],
        x: [-3, 3], y: [-6, 9],
      },
    },
    {
      titulo: 'Raízes, soma e produto',
      texto: 'Multiplique $(x - 1)(x - 5)$: dá $x^2 - 6x + 5$. Ela zera em $x = 1$ e em $x = 5$, as [[b:raízes]]. Repare: a soma das raízes, 6, aparece com o sinal trocado no meio, e o produto, 5, é o número solto. Pela simetria, o vértice fica no meio delas: $x = 3$, e $f(3) = 9 - 18 + 5 = -4$.',
      visual: {
        tipo: 'grafico', titulo: 'f(x) = x² − 6x + 5',
        funcoes: [{ expr: 'x^2 - 6x + 5', rotulo: 'f(x)', cor: 'a' }],
        pontos: [{ x: 1, y: 0, rotulo: 'raiz 1', cor: 'b' }, { x: 5, y: 0, rotulo: 'raiz 5', cor: 'b' }, { x: 3, y: -4, rotulo: 'vértice (3, −4)', cor: 'c' }],
        x: [-1, 7], y: [-5, 8],
      },
    },
    {
      titulo: 'Completar o quadrado, com números',
      texto: 'Nem toda quadrática se fatora de cabeça. O truque é **completar o quadrado**: escrever a conta como "algo ao quadrado" mais um número. Primeiro com números.',
      visual: {
        tipo: 'transformacao', titulo: 'Completando o quadrado',
        ajuda: ['(x - y)^2 = x^2 - 2xy + y^2'],
        linhas: [
          { latex: 'x^2 - 6x + 5 = 0', porque: 'A pergunta: qual x faz isso dar zero?' },
          { latex: '(x - 3)^2 = x^2 - 6x + \\novo{9}', porque: 'Metade do 6 é 3. Esse quadrado começa igual, mas termina em 9, não em 5.' },
          { latex: 'x^2 - 6x + 5 = (x - 3)^2 - \\novo{4}', porque: 'Tem 9 e queremos 5: tira 4.' },
          { latex: '(x - 3)^2 = 4', lado: '+4', porque: 'Soma 4 dos dois lados.' },
          { latex: 'x - 3 = \\pm 2', lado: '\\sqrt{\\quad}', porque: 'Que número ao quadrado dá 4? 2 e também −2.' },
          { latex: '\\boxed{x = 5 \;\\text{ou}\; x = 1}', lado: '+3', porque: 'Confere: 25 − 30 + 5 = 0 e 1 − 6 + 5 = 0.' },
        ],
      },
    },
    {
      titulo: 'De onde vem a fórmula de Bhaskara',
      texto: 'A mesma conta, agora com letras. Uma regra só: o que fizer de um lado do =, faz do outro. A fórmula é o fim desse caminho, não o começo.',
      visual: {
        tipo: 'transformacao', titulo: 'Bhaskara, linha por linha',
        condicao: 'a \\neq 0',
        ajuda: ['(x + y)^2 = x^2 + 2xy + y^2', 'y = \\frac{b}{2a}'],
        linhas: [
          { latex: 'ax^2 + bx + c = 0', porque: 'A pergunta: qual x faz isso dar zero?' },
          { latex: 'x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0', lado: '\\div a', porque: 'Divide os dois lados por a. Pode, porque a não é zero.' },
          { latex: 'x^2 + \\frac{b}{a}x + \\novo{\\left(\\frac{b}{2a}\\right)^2} + \\frac{c}{a} = \\novo{\\left(\\frac{b}{2a}\\right)^2}', lado: '+\\left(\\frac{b}{2a}\\right)^2', porque: 'Soma o mesmo pedaço dos dois lados. Ele completa o quadrado da ajuda, com y = b/2a.' },
          { latex: '\\left(x + \\frac{b}{2a}\\right)^2 + \\frac{c}{a} = \\frac{b^2}{4a^2}', porque: 'Os três primeiros termos viram um quadrado só.' },
          { latex: '\\left(x + \\frac{b}{2a}\\right)^2 + \\corta{\\frac{c}{a}} - \\corta{\\frac{c}{a}} = \\frac{b^2}{4a^2} - \\frac{c}{a}', lado: '-\\frac{c}{a}', porque: 'Tira c/a dos dois lados. Do lado esquerdo ele some.' },
          { latex: '\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}', porque: 'Mesmo denominador: c/a vira 4ac/4a².' },
          { latex: '\\novo{\\Delta = b^2 - 4ac}', porque: 'Esse pedaço aparece tanto que ganhou nome: delta.' },
          { latex: 'x + \\frac{b}{2a} = \\pm\\frac{\\sqrt{\\Delta}}{2a}', lado: '\\sqrt{\\quad}', porque: 'Raiz dos dois lados. Mais ou menos, porque 3² e (−3)² dão 9.' },
          { latex: 'x = -\\frac{b}{2a} \\pm \\frac{\\sqrt{\\Delta}}{2a}', lado: '-\\frac{b}{2a}', porque: 'Tira b/2a dos dois lados.' },
          { latex: '\\boxed{x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}}', porque: 'A fórmula. Esquecer não tem problema: o caminho leva de volta a ela.' },
        ],
      },
    },
    {
      titulo: 'O Δ diz quantas raízes existem',
      texto: 'O número $\\Delta = b^2 - 4ac$ fica dentro da raiz. Se $\\Delta > 0$, há duas raízes; se $\\Delta = 0$, uma só (o vértice encosta no eixo); se $\\Delta < 0$, nenhuma: não existe raiz quadrada real de negativo, e a parábola não toca o eixo $x$.',
      visual: {
        tipo: 'grafico',
        funcoes: [{ expr: 'x^2 - 4', rotulo: 'Δ > 0', cor: 'a' }, { expr: 'x^2 - 4x + 4', rotulo: 'Δ = 0', cor: 'b' }, { expr: 'x^2 + 1', rotulo: 'Δ < 0', cor: 'c' }],
        x: [-3, 4], y: [-5, 8],
      },
    },
  ],
  resumo: '$f(x) = ax^2 + bx + c$. Vértice em $x_v = -\\frac{b}{2a}$, no meio das raízes. Raízes: $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$ com $\\Delta = b^2 - 4ac$, que sai de completar o quadrado. Soma das raízes: $-\\frac{b}{a}$; produto: $\\frac{c}{a}$. Se $a > 0$ o vértice é mínimo; se $a < 0$, máximo.',
  exemplos: [
    {
      enunciado: 'Ache as raízes e o vértice de $f(x) = x^2 - 4x + 3$.',
      visual: {
        tipo: 'grafico', funcoes: [{ expr: 'x^2 - 4x + 3', rotulo: 'f(x)', cor: 'a' }],
        pontos: [{ x: 1, y: 0, rotulo: '1', cor: 'b' }, { x: 3, y: 0, rotulo: '3', cor: 'b' }, { x: 2, y: -1, rotulo: '(2, −1)', cor: 'c' }],
        x: [-1, 5], y: [-2, 9],
      },
      passos: [
        { texto: 'Dois números com soma 4 e produto 3: 1 e 3. Então $f(x) = (x - 1)(x - 3)$.', porque: 'A soma aparece com sinal trocado no meio e o produto é o número solto.' },
        { texto: 'Raízes: $x = 1$ e $x = 3$.', porque: 'Um produto zera quando um dos fatores zera.' },
        { texto: '$x_v = \\frac{1 + 3}{2} = 2$ e $f(2) = 4 - 8 + 3 = -1$', porque: 'O vértice fica no meio das raízes, pela simetria. Vértice $(2, -1)$.' },
      ],
    },
    {
      enunciado: 'Resolva $2x^2 - 3x - 2 = 0$.',
      passos: [
        { texto: '$a = 2$, $b = -3$, $c = -2$', porque: 'Os números da forma $ax^2 + bx + c$.' },
        { texto: '$\\Delta = (-3)^2 - 4\\cdot 2\\cdot(-2) = 9 + 16 = 25$', porque: 'Menos com menos dá mais: $-4\\cdot 2\\cdot(-2) = +16$.', lacuna: { pergunta: 'Quanto vale $\\Delta$?', resposta: { tipo: 'numero', valor: 25 } } },
        { texto: '$x = \\frac{3 \\pm 5}{4}$, então $x = 2$ ou $x = -\\frac{1}{2}$', porque: '$-b = 3$, $\\sqrt{25} = 5$ e $2a = 4$: $\\frac{8}{4} = 2$ e $\\frac{-2}{4} = -\\frac{1}{2}$.' },
      ],
    },
    {
      enunciado: 'Uma bola é jogada para cima e sua altura é $h(t) = -5t^2 + 20t$ metros, depois de $t$ segundos. Qual a altura máxima?',
      passos: [
        { texto: '$a = -5 < 0$: a parábola abre para baixo, e o vértice é o ponto mais alto.', porque: 'Altura máxima é o $y$ do vértice.' },
        { texto: '$t_v = -\\frac{20}{2\\cdot(-5)} = 2$', porque: '$x_v = -\\frac{b}{2a}$ com $b = 20$ e $a = -5$: embaixo, $2\\cdot(-5) = -10$; e $-20$ dividido por $-10$ dá 2, menos com menos dá mais.', lacuna: { pergunta: 'Em que instante $t$ a bola está mais alta?', resposta: { tipo: 'numero', valor: 2 } } },
        { texto: '$h(2) = -5\\cdot 4 + 40 = 20$', porque: 'Altura máxima: 20 m.', lacuna: { pergunta: 'Quanto vale $h(2)$?', resposta: { tipo: 'numero', valor: 20 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Qual é a maior raiz de $x^2 - 5x + 6 = 0$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Procure dois números com soma 5 e produto 6.',
      resolucao: [
        { texto: '$x^2 - 5x + 6 = (x - 2)(x - 3)$', porque: '2 + 3 = 5 e 2 · 3 = 6.' },
        { texto: 'Raízes 2 e 3; a maior $= 3$', porque: 'Cada fator zera numa raiz.' },
      ],
    },
    {
      enunciado: 'Qual é o menor valor que $f(x) = x^2 - 6x + 10$ pode ter?',
      resposta: { tipo: 'numero', valor: 1 },
      dica: '$a > 0$: o menor valor está no vértice.',
      resolucao: [
        { texto: '$x_v = -\\frac{-6}{2\\cdot 1} = 3$', porque: 'Vértice de uma parábola que abre para cima.' },
        { texto: '$f(3) = 9 - 18 + 10 = 1$', porque: 'O menor valor é o $y$ do vértice.' },
      ],
    },
    {
      enunciado: 'Qual é o valor máximo de $f(x) = -2x^2 + 8x - 3$?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: '$a < 0$: o maior valor está no vértice.',
      resolucao: [
        { texto: '$x_v = -\\frac{8}{2\\cdot(-2)} = 2$', porque: '$b = 8$ e $a = -2$: $-8$ dividido por $-4$ dá 2, menos com menos dá mais.' },
        { texto: '$f(2) = -8 + 16 - 3 = 5$', porque: '$-2\\cdot 2^2 = -8$.' },
      ],
    },
    {
      enunciado: 'Um fazendeiro tem 40 m de cerca para fazer um cercado retangular encostado num muro (o muro faz um dos lados). Qual é a maior área possível, em m²?',
      resposta: { tipo: 'numero', valor: 200 },
      dica: 'Chame de $x$ os dois lados que saem do muro. O lado paralelo ao muro fica com o que sobra da cerca.',
      resolucao: [
        { texto: '$A(x) = x(40 - 2x) = -2x^2 + 40x$', porque: 'Dois lados de $x$ e um de $40 - 2x$.' },
        { texto: '$x_v = -\\frac{40}{2\\cdot(-2)} = 10$', porque: '$-40$ dividido por $-4$ dá 10 (menos com menos dá mais). Parábola para baixo: o vértice dá a área máxima.' },
        { texto: '$A(10) = 10\\cdot 20 = 200$', porque: 'Lados de 10 m e 20 m.' },
      ],
    },
    {
      enunciado: 'Para que valores de $k$ a equação $x^2 - kx + 9 = 0$ tem uma única raiz real? Responda o maior deles.',
      resposta: { tipo: 'numero', valor: 6 },
      dica: 'Uma raiz só acontece quando $\\Delta = 0$.',
      resolucao: [
        { texto: '$\\Delta = k^2 - 4\\cdot 9 = k^2 - 36$', porque: '$a = 1$, $b = -k$, $c = 9$.' },
        { texto: '$k^2 = 36$, então $k = 6$ ou $k = -6$; o maior $= 6$', porque: 'Os dois valores zeram o $\\Delta$: em ambos o vértice encosta no eixo.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'As raízes $r$ e $s$ de uma equação do 2º grau têm soma 7 e produto 10. Quanto vale $r^2 + s^2$?',
      resposta: { tipo: 'numero', valor: 29 },
      dica: 'Você não precisa achar $r$ e $s$. Eleve a soma ao quadrado: $(r + s)^2 = r^2 + 2rs + s^2$.',
      resolucao: [
        { texto: '$(r + s)^2 = r^2 + 2rs + s^2$, então $r^2 + s^2 = (r + s)^2 - 2rs$', porque: 'Isola o que a questão pede.' },
        { texto: '$r^2 + s^2 = 7^2 - 2\\cdot 10 = 49 - 20 = 29$', porque: 'Soma 7 e produto 10. Conferindo: as raízes são 2 e 5, e $4 + 25 = 29$.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'Por que o vértice da parábola fica exatamente no meio das duas raízes?',
    resposta: 'Porque a parábola é simétrica: os dois lados são espelhos em torno da reta vertical que passa pelo vértice.',
  },
};
