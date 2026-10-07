import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P7_EXPONENCIAL: ConteudoLicao = {
  gancho: {
    pergunta: 'Proposta A: você ganha R$ 100 por dia. Proposta B: ganha R$ 1 no primeiro dia, e a cada dia o valor dobra. No décimo dia, qual das duas paga mais?',
    ideia: 'A paga 100. B paga 1, 2, 4, 8, 16, 32, 64, 128, 256 e, no décimo dia, 512. Somar sempre o mesmo cresce em linha reta. Multiplicar sempre pelo mesmo começa devagar e depois dispara.',
  },
  construcao: [
    {
      titulo: 'Somar contra multiplicar',
      texto: 'Dois balões saem juntos. O primeiro **soma** 6 m a cada minuto: $a(x) = 6x$. O segundo **dobra** de altura a cada minuto: $b(x) = 2^x$. No começo, o que soma está bem na frente. Entre o minuto 4 e o 5, o que dobra passa, e daí em diante só se afasta.',
      visual: {
        tipo: 'cena', titulo: 'O que soma contra o que dobra', x: [0, 6], unidadeX: 'min', unidadeY: 'm', rastro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '6x', diz: 'soma 6 m por minuto' }, { termo: '2^x', diz: 'dobra a cada minuto' }],
        veiculos: [
          { veiculo: 'balao', nome: 'a', expr: '6*x', rotulo: 'soma 6', cor: 'a' },
          { veiculo: 'balao', nome: 'b', expr: '2^x', rotulo: 'dobra', cor: 'b' },
        ],
      },
    },
    {
      titulo: 'Na tabela: diferença contra razão',
      texto: 'Na função afim, a **diferença** entre um valor e o anterior é sempre a mesma: +6. Na exponencial, o que fica igual é a **razão**: cada valor dividido pelo anterior dá 2. Por isso a diferença da exponencial cresce cada vez mais.',
      visual: {
        tipo: 'tabela', titulo: 'Soma 6 contra dobra',
        cabecalho: ['minuto', 'soma 6', 'diferença', 'dobra', 'razão'],
        linhas: [['0', '0', '—', '1', '—'], ['1', '6', '+6', '2', '×2'], ['2', '12', '+6', '4', '×2'], ['3', '18', '+6', '8', '×2'], ['4', '24', '+6', '16', '×2'], ['5', '30', '+6', '32', '×2']],
      },
    },
    {
      titulo: 'A fórmula: início vezes a base, x vezes',
      texto: 'Toda exponencial se escreve $f(x) = c\\cdot a^x$. O $c$ é onde começa: em $x = 0$, $a^0 = 1$ e sobra só o $c$. O $a$ é a **base**: por quanto tudo é multiplicado a cada passo. Compare com a afim: lá, o passo **soma** sempre o mesmo; aqui, **multiplica**.',
      visual: {
        tipo: 'transformacao', titulo: 'O que c e a fazem',
        linhas: [
          { latex: 'f(x) = c\\cdot a^x', porque: 'c: início; a: multiplica a cada passo' },
          { latex: 'f(0) = c\\cdot a^0 = c\\cdot 1 = c', porque: 'no começo, só o c' },
          { latex: 'f(x + 1) = c\\cdot a^{x+1} = f(x)\\cdot a', porque: 'um passo a mais multiplica por a' },
        ],
      },
    },
    {
      titulo: 'Juros compostos são uma exponencial',
      texto: 'R$ 1000 rendendo 10% ao mês: render 10% é multiplicar por 1,1. Depois de $t$ meses, $M(t) = 1000\\cdot 1{,}1^t$. No segundo mês, os juros já incidem sobre os juros do primeiro: $1000\\cdot 1{,}1^2 = 1210$, e não 1200. Em dois anos, a reta dos juros simples fica muito para trás.',
      visual: {
        tipo: 'grafico', titulo: 'R$ 1000 a 10% ao mês',
        funcoes: [{ expr: '1000*1.1^x', rotulo: 'compostos', cor: 'a' }, { expr: '1000+100*x', rotulo: 'simples', cor: 'c' }],
        pontos: [{ x: 2, y: 1210, rotulo: 'mês 2: 1210', cor: 'b' }],
        x: [0, 24], y: [0, 10000],
      },
    },
    {
      titulo: 'Meia-vida: multiplicar por menos de 1',
      texto: 'Se a base fica entre 0 e 1, multiplicar **encolhe**. Um remédio: 80 mg no sangue, e a cada hora sobra a metade. $R(x) = 80\\cdot (\\frac{1}{2})^x$: 80, 40, 20, 10, 5. A quantidade nunca chega a zero, mas fica cada vez mais perto. O tempo para cair à metade se chama **meia-vida**. Juros e meia-vida são o mesmo fenômeno: multiplicar sempre pelo mesmo número.',
      visual: {
        tipo: 'grafico', titulo: 'Remédio: sobra a metade a cada hora',
        funcoes: [{ expr: '80*0.5^x', rotulo: 'R(x)', cor: 'a' }],
        pontos: [{ x: 1, y: 40, rotulo: '1 h: 40', cor: 'b' }, { x: 2, y: 20, rotulo: '2 h: 20', cor: 'b' }, { x: 3, y: 10, rotulo: '3 h: 10', cor: 'b' }],
        x: [0, 6], y: [0, 90],
      },
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Na exponencial, quanto mais se tem, mais se ganha: o crescimento é proporcional ao tamanho. Mais adiante na trilha aparece uma base especial, o número $e \\approx 2{,}718$, em que a taxa de crescimento é exatamente igual ao próprio valor. É a função mais importante do cálculo.',
    },
  ],
  resumo: 'Afim soma sempre o mesmo: $f(x) = ax + b$. Exponencial multiplica sempre pelo mesmo: $f(x) = c\\cdot a^x$, com $c$ o valor inicial e $a$ a base. Base maior que 1 cresce (juros compostos); base entre 0 e 1 encolhe (meia-vida). Na tabela, a afim tem diferença fixa e a exponencial tem razão fixa.',
  exemplos: [
    {
      enunciado: 'Uma cultura começa com 50 bactérias e triplica a cada hora. Quantas há depois de 4 horas?',
      passos: [
        { texto: '$B(x) = 50\\cdot 3^x$', porque: 'Começa em 50 (o $c$) e multiplica por 3 (a base) a cada hora.' },
        { texto: '$B(4) = 50\\cdot 3^4 = 50\\cdot 81$', porque: '$3\\cdot 3\\cdot 3\\cdot 3 = 81$.' },
        { texto: '$B(4) = 4050$', porque: 'Depois de 4 horas, 4050 bactérias.' },
      ],
    },
    {
      enunciado: 'R$ 400 aplicados a 5% ao mês, em juros compostos. Quanto há depois de 2 meses?',
      passos: [
        { texto: '$M(t) = 400\\cdot 1{,}05^t$', porque: 'Render 5% é multiplicar por 1,05 a cada mês.' },
        { texto: '$1{,}05^2 = 1{,}05\\cdot 1{,}05 = 1{,}1025$', porque: 'Dois meses: multiplica duas vezes.' },
        { texto: '$M(2) = 400\\cdot 1{,}1025 = 441$', porque: 'Os 41 reais incluem 1 real de juros sobre juros.', lacuna: { pergunta: 'Quantos reais há depois de 2 meses?', resposta: { tipo: 'numero', valor: 441 } } },
      ],
    },
    {
      enunciado: 'Uma substância radioativa tem 640 g e meia-vida de 1 ano. Quanto sobra depois de 3 anos?',
      passos: [
        { texto: '$S(3) = \\frac{640}{2^3}$', porque: 'Cada ano divide por 2; três anos dividem por $2^3$.' },
        { texto: '$2^3 = 8$', porque: 'Metade da metade da metade é um oitavo.', lacuna: { pergunta: 'Quanto vale $2^3$?', resposta: { tipo: 'numero', valor: 8 } } },
        { texto: '$S(3) = \\frac{640}{8} = 80$', porque: 'Sobram 80 g.', lacuna: { pergunta: 'Quantos gramas sobram?', resposta: { tipo: 'numero', valor: 80 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Uma população de 30 coelhos dobra a cada mês. Quantos coelhos há depois de 5 meses?',
      resposta: { tipo: 'numero', valor: 960 },
      dica: 'Escreva $P(x) = 30\\cdot 2^x$ e troque $x$ por 5.',
      resolucao: [
        { texto: '$P(5) = 30\\cdot 2^5$', porque: 'Começa em 30, multiplica por 2 a cada mês.' },
        { texto: '$30\\cdot 32 = 960$', porque: '$2^5 = 32$.' },
      ],
    },
    {
      enunciado: 'Qual destas sequências é de uma função exponencial?',
      resposta: { tipo: 'escolha', opcoes: ['1; 4; 7; 10; 13', '2; 6; 18; 54; 162', '1; 4; 9; 16; 25', '5; 5; 5; 5; 5'], correta: 1 },
      dica: 'Divida cada termo pelo anterior. Na exponencial, essa razão nunca muda.',
      resolucao: [
        { texto: 'Em 2; 6; 18; 54; 162, cada termo é o anterior vezes 3.', porque: 'Razão fixa é a marca da exponencial.' },
        { texto: 'Nas outras não: a primeira soma sempre o mesmo, a terceira são quadrados e a quarta não muda.', porque: 'Diferença fixa é afim; quadrados formam uma parábola.' },
      ],
    },
    {
      enunciado: 'Para $f(x) = 3\\cdot 2^x$, quanto vale $f(0)$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Quanto vale qualquer número elevado a 0?',
      resolucao: [
        { texto: '$f(0) = 3\\cdot 2^0 = 3\\cdot 1 = 3$', porque: '$2^0 = 1$: no começo sobra só o valor inicial.' },
      ],
    },
    {
      enunciado: 'Um celular de R$ 900 perde 10% do valor a cada ano. Quantos reais ele vale depois de 2 anos?',
      resposta: { tipo: 'numero', valor: 729 },
      dica: 'Perder 10% é ficar com 90%: multiplicar por 0,9 a cada ano.',
      resolucao: [
        { texto: '$V(2) = 900\\cdot 0{,}9^2$', porque: 'Dois anos: multiplica por 0,9 duas vezes.' },
        { texto: '$900\\cdot 0{,}81 = 729$', porque: 'Não é 720: no segundo ano, os 10% saem de 810, não de 900.' },
      ],
    },
    {
      enunciado: 'Um remédio tem 96 mg no sangue, e a cada 4 horas sobra a metade. Quantos mg sobram depois de 12 horas?',
      resposta: { tipo: 'numero', valor: 12 },
      dica: 'Quantas meias-vidas de 4 horas cabem em 12 horas?',
      resolucao: [
        { texto: '12 horas são 3 meias-vidas de 4 horas.', porque: 'Cada meia-vida divide por 2.' },
        { texto: '$96 \\div 2^3 = 96 \\div 8 = 12$', porque: '96, 48, 24, 12.' },
      ],
    },
    {
      enunciado: 'Uma bactéria se divide em duas a cada 20 minutos. Começando com uma só, depois de quantas horas há 4096 bactérias?',
      resposta: { tipo: 'numero', valor: 4 },
      dica: 'Escreva 4096 como potência de 2: quantas divisões foram?',
      resolucao: [
        { texto: '$4096 = 2^{12}$', porque: 'Dobrando a partir de 1: 2, 4, 8, ..., 4096 são 12 divisões.' },
        { texto: '$12\\cdot 20 = 240$ minutos', porque: 'Cada divisão leva 20 minutos.' },
        { texto: '$240 \\div 60 = 4$ horas', porque: 'Uma hora tem 60 minutos.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
    {
      enunciado: 'A aplicação A rende 10% ao mês. A aplicação B rende 21% a cada 2 meses. Ambas em juros compostos, com R$ 1000 cada. Depois de 2 meses, qual a diferença, em reais, entre os valores de A e de B?',
      resposta: { tipo: 'numero', valor: 0 },
      dica: 'Calcule quanto A vira em 2 meses e compare com B.',
      resolucao: [
        { texto: 'A: $1000\\cdot 1{,}1^2 = 1000\\cdot 1{,}21 = 1210$', porque: '10% ao mês, dois meses seguidos.' },
        { texto: 'B: $1000\\cdot 1{,}21 = 1210$', porque: '21% de uma vez só.' },
        { texto: 'Diferença: $1210 - 1210 = 0$', porque: '10% ao mês composto é o mesmo que 21% a cada dois meses, porque $1{,}1^2 = 1{,}21$.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
  ],
  recuperacao: {
    pergunta: 'Olhando só uma tabela de valores, como você sabe se a função é exponencial ou afim?',
    resposta: 'Na afim, a diferença entre um valor e o anterior é sempre a mesma. Na exponencial, a razão (um dividido pelo anterior) é sempre a mesma.',
  },
};
