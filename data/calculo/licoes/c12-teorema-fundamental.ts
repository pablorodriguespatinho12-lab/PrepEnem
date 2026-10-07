import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C12_TEOREMA_FUNDAMENTAL: ConteudoLicao = {
  gancho: {
    pergunta: 'Na lição anterior, somar 30 fatias de $t^2$ deu quase 9. Existe um jeito de achar o 9 exato sem somar fatia nenhuma?',
    ideia: 'Existe. Procure uma função cuja derivada é $t^2$: é $\\frac{t^3}{3}$. Calcule em 3 e em 0 e subtraia: $9 - 0 = 9$. Somar fatias e derivar são operações inversas. Esse é o **Teorema Fundamental do Cálculo**.',
  },
  construcao: [
    {
      titulo: 'Hodômetro e velocímetro',
      texto: 'O hodômetro do carro conta os km rodados; o velocímetro mostra a velocidade. Ande o relógio: o velocímetro é a derivada do hodômetro, porque $\\left(\\frac{t^3}{3}\\right)\' = t^2$. E o hodômetro é a soma das fatias do velocímetro, a área acumulada. Uma operação desfaz a outra.',
      visual: {
        tipo: 'cena', titulo: 'Hodômetro t³/3, velocímetro t²', x: [0, 3], unidadeX: 'min', unidadeY: 'km', velocimetro: true,
        legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: 's(x)', diz: 'o hodômetro: km rodados' }, { termo: '\\text{velocímetro}', diz: 'x²' }],
        veiculos: [{ veiculo: 'carro', nome: 's', expr: 'x^3/3', cor: 'a' }],
      },
    },
    {
      titulo: 'A área acumulada cresce na velocidade de f',
      texto: 'Chame de $A(x)$ a área sob $f$ de 0 até $x$. Andando um pouquinho $h$, a área ganha uma fatia fina de altura $f(x)$ e largura $h$. Então a área cresce na velocidade $f(x)$: a derivada da área é a própria $f$. No gráfico, em $x = 2$ a curva vale 4, e a área acumulada (que vai em 2,67) está crescendo 4 por unidade.',
      visual: {
        tipo: 'grafico', titulo: 'f(x) = x² e a área acumulada A(x) = x³/3',
        funcoes: [{ expr: 'x^2', rotulo: 'f(x)', cor: 'b' }, { expr: 'x^3/3', rotulo: 'área A(x)', cor: 'a' }],
        pontos: [{ x: 2, y: 4, rotulo: 'f(2) = 4', cor: 'b' }, { x: 2, y: 2.6667, rotulo: 'A(2) ≈ 2,67', cor: 'a' }],
        x: [0, 3], y: [0, 10],
      },
    },
    {
      titulo: 'Antiderivada: a derivada ao contrário',
      texto: 'Uma função cuja derivada é $f$ se chama **antiderivada** de $f$. Para achar, desfaça a regra da potência: o expoente sobe 1 e o resultado é dividido pelo novo expoente.',
      visual: {
        tipo: 'tabela', titulo: 'Antiderivadas para guardar',
        cabecalho: ['função', 'antiderivada'],
        linhas: [['$1$', '$x$'], ['$x$', '$\\frac{x^2}{2}$'], ['$x^2$', '$\\frac{x^3}{3}$'], ['$x^n$', '$\\frac{x^{n+1}}{n+1}$'], ['$\\cos x$', '$\\operatorname{sen} x$'], ['$e^x$', '$e^x$']],
      },
    },
    {
      titulo: 'A conta da integral',
      texto: 'Com uma antiderivada $F$ na mão, a área de $a$ até $b$ é o quanto $F$ andou: $F(b) - F(a)$. É o hodômetro no fim menos o hodômetro no começo.',
      visual: {
        tipo: 'transformacao', titulo: 'O 9 exato, sem fatias',
        linhas: [
          { latex: '\\int_a^b f(x)\\,dx = F(b) - F(a)', porque: 'F é uma antiderivada de f' },
          { latex: '\\int_0^3 t^2\\,dt = \\frac{3^3}{3} - \\frac{0^3}{3}', porque: 'F(t) = t³/3' },
          { latex: '= 9 - 0 = 9', porque: 'o mesmo 9 das fatias' },
        ],
      },
    },
    {
      titulo: 'Por que o "+ C" não atrapalha',
      texto: 'A função $\\frac{t^3}{3} + 5$ também tem derivada $t^2$: é um hodômetro que já começou marcando 5. Mas em $F(b) - F(a)$ o 5 aparece nos dois e cancela. A distância de uma viagem não depende de quanto o hodômetro marcava antes.',
    },
    {
      titulo: 'Conferindo com o triângulo',
      texto: 'Na lição anterior, a área sob $2t$ de 0 a 4 era um triângulo de área 16. Pelo teorema: a antiderivada de $2t$ é $t^2$, e $16 - 0 = 16$. As duas contas concordam.',
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Esse teorema junta as duas metades do cálculo: taxas (a derivada) e acumulação (a integral). Graças a ele, áreas, volumes e distâncias viram contas de uma linha.',
    },
  ],
  resumo: "Se $F' = f$, então $\\int_a^b f(x)\\,dx = F(b) - F(a)$. A área acumulada sob $f$ cresce na velocidade $f(x)$: derivar e integrar são operações inversas. Antiderivada de $x^n$: $\\frac{x^{n+1}}{n+1}$.",
  exemplos: [
    {
      enunciado: 'Calcule $\\int_0^2 x^3\\,dx$.',
      passos: [
        { texto: 'Antiderivada: $\\frac{x^4}{4}$', porque: 'O expoente sobe para 4 e divide por 4.' },
        { texto: '$\\frac{2^4}{4} - \\frac{0^4}{4}$', porque: '$F(2) - F(0)$.' },
        { texto: '$4 - 0 = 4$', porque: 'A área sob $x^3$ de 0 a 2.' },
      ],
    },
    {
      enunciado: 'Calcule $\\int_1^3 2x\\,dx$.',
      passos: [
        { texto: 'Antiderivada: $x^2$', porque: 'A derivada de $x^2$ é $2x$.' },
        { texto: '$3^2 - 1^2 = 9 - 1 = 8$', porque: '$F(3) - F(1)$.', lacuna: { pergunta: 'Quanto vale a integral?', resposta: { tipo: 'numero', valor: 8 } } },
      ],
    },
    {
      enunciado: 'Calcule $\\int_0^\\pi \\operatorname{sen} x\\,dx$, a área de um arco da onda.',
      passos: [
        { texto: "Antiderivada: $-\\cos x$, porque $(-\\cos x)' = \\operatorname{sen} x$", porque: 'Derivada do cosseno ao contrário.' },
        { texto: '$-\\cos\\pi = 1$', porque: '$\\cos\\pi = -1$.', lacuna: { pergunta: 'Quanto vale $-\\cos\\pi$?', resposta: { tipo: 'numero', valor: 1 } } },
        { texto: '$1 - (-\\cos 0) = 1 + 1 = 2$', porque: 'A área de um arco do seno é exatamente 2.', lacuna: { pergunta: 'Quanto vale a integral?', resposta: { tipo: 'numero', valor: 2 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale $\\int_0^3 x^2\\,dx$?',
      resposta: { tipo: 'numero', valor: 9 },
      dica: 'Antiderivada de $x^2$: $\\frac{x^3}{3}$.',
      resolucao: [
        { texto: '$\\frac{3^3}{3} - 0 = 9$', porque: 'O mesmo 9 das fatias.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\int_0^2 3x^2\\,dx$?',
      resposta: { tipo: 'numero', valor: 8 },
      dica: 'Qual função tem derivada $3x^2$?',
      resolucao: [
        { texto: 'Antiderivada $x^3$: $2^3 - 0^3 = 8$', porque: 'A derivada de $x^3$ é $3x^2$.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\int_1^2 4x^3\\,dx$?',
      resposta: { tipo: 'numero', valor: 15 },
      dica: 'Qual função tem derivada $4x^3$?',
      resolucao: [
        { texto: 'Antiderivada $x^4$: $16 - 1 = 15$', porque: '$F(2) - F(1)$.' },
      ],
    },
    {
      enunciado: 'A velocidade de um corpo é $v(t) = 6t$ m/s. Quantos metros ele percorre de $t = 0$ a $t = 2$ s?',
      resposta: { tipo: 'numero', valor: 12 },
      dica: 'A distância é a integral da velocidade.',
      resolucao: [
        { texto: 'Antiderivada $3t^2$: $3\\cdot 4 - 0 = 12$', porque: 'Hodômetro no fim menos no começo.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\int_0^1 (x^2 + x)\\,dx$? Responda com duas casas decimais.',
      resposta: { tipo: 'numero', valor: 0.83, tolerancia: 0.01 },
      dica: 'Antiderivada parte por parte.',
      resolucao: [
        { texto: 'Antiderivada: $\\frac{x^3}{3} + \\frac{x^2}{2}$', porque: 'Cada parte sozinha.' },
        { texto: 'Em 1: $\\frac{1}{3} + \\frac{1}{2}$, que é $\\frac{5}{6}$, cerca de 0,83', porque: 'Em 0 a antiderivada vale 0.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Para que valor de $k > 0$ vale $\\int_0^k 2x\\,dx = 25$?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: 'Calcule a integral em função de $k$.',
      resolucao: [
        { texto: 'Antiderivada $x^2$: a integral vale $k^2$.', porque: '$k^2 - 0^2$.' },
        { texto: '$k^2 = 25$, então $k = 5$', porque: 'Só o positivo serve.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
  ],
  recuperacao: {
    pergunta: 'O que diz o Teorema Fundamental do Cálculo, em palavras?',
    resposta: 'Que somar fatias e calcular taxas são operações inversas: a área acumulada sob $f$ cresce na velocidade $f$. Por isso a integral de $a$ até $b$ é $F(b) - F(a)$, com $F$ uma antiderivada de $f$.',
  },
};
