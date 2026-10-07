import type { ConteudoLicao } from '@/lib/calculo/tipos';

// Degraus do estacionamento: "0*sqrt(...)" limita cada pedaço ao seu trecho
// (fora dele a raiz não existe e o traço não é desenhado). Sem isso, o gráfico
// ligaria os degraus com um risco vertical que não existe.
const DEGRAUS = [
  { expr: '5+0*sqrt(x)*sqrt(1-x)', rotulo: 'R$ 5', cor: 'a' as const },
  { expr: '8+0*sqrt(x-1)*sqrt(2-x)', rotulo: 'R$ 8', cor: 'a' as const },
  { expr: '11+0*sqrt(x-2)*sqrt(3-x)', rotulo: 'R$ 11', cor: 'a' as const },
];

export const C2_CONTINUIDADE: ConteudoLicao = {
  gancho: {
    pergunta: 'Um estacionamento cobra R$ 5 por até 1 hora e R$ 8 por até 2 horas. Quanto custa ficar 59 minutos? E 61 minutos?',
    ideia: '59 minutos custam R$ 5; 61 minutos custam R$ 8. Dois minutos de diferença e o preço pula 3 reais. Não dá para desenhar esse preço sem tirar o lápis do papel: em 1 hora, ele é **descontínuo**.',
  },
  construcao: [
    {
      titulo: 'O preço que pula',
      texto: 'Cada faixa de horário é um degrau. Em 1 hora, o ponto cheio fica embaixo, porque exatamente 1 hora ainda custa R$ 5. A bolinha vazia fica em cima: logo depois de 1 hora já custa R$ 8, mas em 1 hora certinha não. Chegando em 1 hora pela esquerda, o preço fica em 5; pela direita, em 8.',
      visual: {
        tipo: 'grafico', titulo: 'Preço do estacionamento (horas × reais)',
        funcoes: DEGRAUS,
        pontos: [
          { x: 1, y: 5, cor: 'b' },
          { x: 1, y: 8, cor: 'b', aberto: true },
          { x: 2, y: 8, cor: 'b' },
          { x: 2, y: 11, cor: 'b', aberto: true },
        ],
        x: [0, 3], y: [0, 13],
      },
    },
    {
      titulo: 'Limites laterais',
      texto: 'Cada lado tem o seu limite. O sinal de menos em $1^-$ quer dizer "chegando por valores menores que 1"; o de mais, por valores maiores. Quando os dois lados discordam, o limite comum não existe.',
      visual: {
        tipo: 'transformacao', titulo: 'Os dois lados de 1 hora',
        linhas: [
          { latex: '\\lim_{x \\to 1^-} p(x) = 5', porque: 'pela esquerda: 59 min, 59,9 min...' },
          { latex: '\\lim_{x \\to 1^+} p(x) = 8', porque: 'pela direita: 61 min, 60,1 min...' },
          { latex: '5 \\ne 8 \\;\\Rightarrow\\; \\lim_{x \\to 1} p(x)\\ \\text{não existe}', porque: 'os lados discordam' },
        ],
      },
    },
    {
      titulo: 'Contínua: chegar perto e chegar lá dão o mesmo',
      texto: 'Uma função é **contínua** em $a$ quando três coisas acontecem juntas: $f(a)$ existe, o limite em $a$ existe, e os dois são iguais. O degrau falha no limite; a reta com furo da lição anterior falha no valor.',
      visual: {
        tipo: 'tabela', titulo: 'As três perguntas',
        cabecalho: ['caso', 'f(a) existe?', 'limite existe?', 'iguais?'],
        linhas: [
          ['degrau do estacionamento, em 1', 'sim: 5', 'não', '—'],
          ['reta com furo (lição anterior), em 1', 'não', 'sim: 2', '—'],
          ['f(x) = 2x + 1, em 3', 'sim: 7', 'sim: 7', 'sim: contínua'],
        ],
      },
    },
    {
      titulo: 'O movimento de verdade é contínuo',
      texto: 'Um carro não se teletransporta: a posição dele não dá saltos. Ande o relógio devagar. Entre o km 4 e o km 9, ele passa por todos os km do meio, sem pular nenhum. Isso vale para toda função contínua: se ela vai de um valor a outro, passa por todos os valores entre eles.',
      visual: {
        tipo: 'cena', titulo: 'Sem pular nenhum km', x: [0, 4], unidadeX: 'min', unidadeY: 'km',
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: 's(x)', diz: 'os km, sem pular nenhum' }],
        veiculos: [{ veiculo: 'carro', nome: 's', expr: 'x^2', cor: 'a' }],
      },
    },
    {
      titulo: 'Furo tem conserto, salto não',
      texto: 'Na reta com furo da lição anterior, basta definir $f(1) = 2$ e ela vira contínua: o furo foi tapado. No degrau não há conserto, porque os dois lados apontam para lugares diferentes. Uma terceira quebra é a explosão, como $\\frac{1}{x}$ em 0.',
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Quase todo teorema do cálculo começa com "se $f$ é contínua". E é a continuidade que garante algo que parece óbvio: se um carro estava atrás de outro e depois está na frente, em algum instante os dois emparelharam.',
    },
  ],
  resumo: 'Limite pela esquerda ($x \\to a^-$) e pela direita ($x \\to a^+$): se discordam, o limite em $a$ não existe. $f$ é contínua em $a$ quando $f(a)$ existe, o limite existe e $\\lim_{x \\to a} f(x) = f(a)$. Furo se conserta definindo o valor; salto e explosão, não.',
  exemplos: [
    {
      enunciado: 'Seja $f(x) = x + 2$ para $x < 3$ e $f(x) = 10 - x$ para $x \\ge 3$. Os limites laterais em 3 concordam?',
      passos: [
        { texto: 'Pela esquerda: $3 + 2 = 5$', porque: 'Perto de 3, por baixo, vale a primeira regra.' },
        { texto: 'Pela direita: $10 - 3 = 7$', porque: 'Por cima, vale a segunda.' },
        { texto: 'Os lados dão 5 e 7: o limite em 3 não existe.', porque: 'Salto de 2 no gráfico.' },
      ],
    },
    {
      enunciado: 'Seja $g(x) = 2x$ para $x < 1$ e $g(x) = x + 1$ para $x \\ge 1$. A função $g$ é contínua em 1?',
      passos: [
        { texto: 'Pela esquerda: $2\\cdot 1 = 2$', porque: 'Primeira regra perto de 1.' },
        { texto: 'Pela direita e no ponto: $1 + 1 = 2$', porque: 'A segunda regra vale em 1 e depois.', lacuna: { pergunta: 'Quanto vale $g(1)$?', resposta: { tipo: 'numero', valor: 2 } } },
        { texto: 'Os dois lados e o valor dão 2: $g$ é contínua em 1.', porque: 'As três perguntas respondidas com sim.' },
      ],
    },
    {
      enunciado: 'Que valor de $k$ deixa contínua em 2 a função $h(x) = x^2$ para $x < 2$ e $h(x) = k$ para $x \\ge 2$?',
      passos: [
        { texto: 'Pela esquerda: $2^2 = 4$', porque: 'A parábola chegando em 2.', lacuna: { pergunta: 'Quanto vale o limite pela esquerda?', resposta: { tipo: 'numero', valor: 4 } } },
        { texto: 'Pela direita e no ponto, a função vale $k$.', porque: 'A segunda regra é constante.' },
        { texto: 'Para colar os pedaços: $k = 4$', porque: 'Os lados precisam concordar com o valor.', lacuna: { pergunta: 'Qual é o $k$?', resposta: { tipo: 'numero', valor: 4 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Seja $f(x) = 3x$ para $x < 2$ e $f(x) = 8$ para $x \\ge 2$. Quanto vale o limite de $f$ quando $x$ tende a 2 pela esquerda?',
      resposta: { tipo: 'numero', valor: 6 },
      dica: 'Pela esquerda vale a primeira regra.',
      resolucao: [
        { texto: '$3\\cdot 2 = 6$', porque: 'A reta $3x$ chegando em 2.' },
      ],
    },
    {
      enunciado: 'Na mesma função, quanto vale o limite quando $x$ tende a 2 pela direita?',
      resposta: { tipo: 'numero', valor: 8 },
      dica: 'Pela direita vale a segunda regra.',
      resolucao: [
        { texto: 'Para $x$ maior que 2, $f(x) = 8$', porque: 'Constante: o limite pela direita é 8. Como 6 e 8 discordam, o limite em 2 não existe.' },
      ],
    },
    {
      enunciado: 'Que valor de $k$ deixa contínua em 1 a função $f(x) = 4x$ para $x < 1$ e $f(x) = x + k$ para $x \\ge 1$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Os dois lados precisam dar o mesmo número em 1.',
      resolucao: [
        { texto: 'Pela esquerda: $4\\cdot 1 = 4$', porque: 'A primeira regra chegando em 1.' },
        { texto: '$1 + k = 4$, então $k = 3$', porque: 'A segunda regra em 1 precisa dar 4.' },
      ],
    },
    {
      enunciado: 'Um estacionamento cobra R$ 5 por até 1 hora e R$ 8 por até 2 horas. De quantos reais é o salto do preço em 1 hora?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Compare os limites dos dois lados de 1 hora.',
      resolucao: [
        { texto: '$8 - 5 = 3$', porque: 'Limite pela direita menos limite pela esquerda.' },
      ],
    },
    {
      enunciado: 'Qual destas funções é contínua em zero?',
      resposta: { tipo: 'escolha', opcoes: ['um sobre x', 'x ao quadrado dividido por x, sem valor definido em zero', 'x ao quadrado mais um', 'um degrau que pula em zero'], correta: 2 },
      dica: 'Procure uma que não tenha furo, salto nem explosão em zero.',
      resolucao: [
        { texto: 'x ao quadrado mais um existe em zero, e o limite bate com o valor.', porque: 'Sem furo, sem salto, sem explosão.' },
        { texto: 'As outras quebram: explosão, furo e salto, nessa ordem.', porque: 'Cada uma falha numa das três perguntas.' },
      ],
    },
    {
      enunciado: 'Ache $a$ para que $f(x) = ax + 1$ (para $x < 2$) e $f(x) = x^2 - a$ (para $x \\ge 2$) seja contínua em 2.',
      resposta: { tipo: 'numero', valor: 1 },
      dica: 'Iguale os dois lados em $x = 2$.',
      resolucao: [
        { texto: '$2a + 1 = 4 - a$', porque: 'Esquerda e direita em 2.' },
        { texto: '$3a = 3$, então $a = 1$', porque: 'Junta os $a$ de um lado.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Quanto vale o limite de $\\frac{|x|}{x}$ quando $x$ tende a 0 pela direita?',
      resposta: { tipo: 'numero', valor: 1 },
      dica: 'Para $x$ positivo, quanto vale $|x|$?',
      resolucao: [
        { texto: 'Para $x > 0$, $|x|$ é o próprio $x$.', porque: 'Módulo de positivo não muda nada.' },
        { texto: '$\\frac{x}{x} = 1$', porque: 'Pela esquerda daria −1: o limite em 0 não existe, mas o lateral pela direita existe.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'O que precisa acontecer para uma função ser contínua num ponto $a$?',
    resposta: 'O valor $f(a)$ existir, o limite em $a$ existir (os dois lados concordarem) e os dois serem iguais. Chegar perto e chegar lá dão o mesmo número.',
  },
};
