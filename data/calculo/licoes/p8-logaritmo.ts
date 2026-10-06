import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const P8_LOGARITMO: ConteudoLicao = {
  gancho: {
    pergunta: 'O balão que dobra de altura a cada minuto começa a 1 m. Em quantos minutos ele chega a 32 m?',
    ideia: '1, 2, 4, 8, 16, 32: são 5 dobras, então 5 minutos. Repare que a pergunta mudou de lado: antes era "quanto dá depois de tantos minutos?", agora é "quantas vezes preciso dobrar?". Essa pergunta ao contrário se chama logaritmo: $\\log_2 32 = 5$.',
  },
  construcao: [
    {
      titulo: 'O filme ao contrário',
      texto: 'Ande o relógio e pare quando o balão chegar a 32 m: minuto 5. Na lição anterior, você sabia o minuto e queria a altura. Aqui você sabe a altura e quer o minuto. O **logaritmo** responde essa pergunta: $\\log_2 32 = 5$, porque $2^5 = 32$.',
      visual: {
        tipo: 'cena', titulo: 'Quantos minutos até 32 m?', x: [0, 5], unidadeX: 'min', unidadeY: 'm', rastro: true,
        veiculos: [{ veiculo: 'balao', nome: 'b', expr: '2^x', cor: 'a' }],
      },
    },
    {
      titulo: 'Logaritmo é um expoente',
      texto: 'Lê-se $\\log_2 8$ como "logaritmo de 8 na base 2". Ele pergunta: **2 elevado a quanto dá 8?** A resposta é sempre um expoente. Toda conta de log vira uma pergunta de potência.',
      visual: {
        tipo: 'transformacao', titulo: 'Traduzindo log para potência',
        linhas: [
          { latex: '\\log_2 8 = \\,?', porque: 'a pergunta' },
          { latex: '2^{?} = 8', porque: 'a mesma pergunta, como potência' },
          { latex: '2^3 = 8', porque: '2 · 2 · 2' },
          { latex: '\\log_2 8 = 3', porque: 'o log é o expoente' },
        ],
      },
    },
    {
      titulo: 'Base 10: o log conta os zeros',
      texto: 'Quando não aparece a base, ela é 10: $\\log 1000$ pergunta "10 elevado a quanto dá 1000?". Para as potências de 10, o log conta os zeros. Abaixo de 1, os expoentes ficam negativos, como na lição de potências.',
      visual: {
        tipo: 'tabela', titulo: 'Logaritmo na base 10',
        cabecalho: ['número', 'como potência de 10', 'log'],
        linhas: [['0,1', '10⁻¹', '−1'], ['1', '10⁰', '0'], ['10', '10¹', '1'], ['100', '10²', '2'], ['1000', '10³', '3'], ['1 000 000', '10⁶', '6']],
      },
    },
    {
      titulo: 'As regras vêm das potências',
      texto: 'Multiplicar potências soma os expoentes: $2^3\\cdot 2^4 = 2^7$. Como o log **é** o expoente, multiplicar os números soma os logs: $\\log_2(8\\cdot 16) = 3 + 4 = 7$. Nenhuma regra nova: é a regra da potência lida ao contrário.',
      visual: {
        tipo: 'transformacao', titulo: 'Cada regra de potência vira uma regra de log',
        linhas: [
          { latex: 'a^m\\cdot a^n = a^{m+n} \\;\\Rightarrow\\; \\log(xy) = \\log x + \\log y', porque: 'multiplicar soma' },
          { latex: '\\frac{a^m}{a^n} = a^{m-n} \\;\\Rightarrow\\; \\log\\frac{x}{y} = \\log x - \\log y', porque: 'dividir subtrai' },
          { latex: '(a^m)^n = a^{mn} \\;\\Rightarrow\\; \\log x^n = n\\log x', porque: 'o expoente desce multiplicando' },
        ],
      },
    },
    {
      titulo: 'O gráfico: a exponencial no espelho',
      texto: 'O log troca entrada e saída da exponencial: o ponto $(2, 4)$ de $2^x$ vira o ponto $(4, 2)$ do log. Trocar $x$ e $y$ espelha o desenho na diagonal $y = x$. O log cresce cada vez mais devagar: para ele subir 1, a entrada precisa **dobrar**.',
      visual: {
        tipo: 'grafico', titulo: 'Exponencial e logaritmo, espelhados',
        funcoes: [{ expr: '2^x', rotulo: '2ˣ', cor: 'a' }, { expr: 'ln(x)/ln(2)', rotulo: 'log₂ x', cor: 'b' }, { expr: 'x', rotulo: 'y = x', cor: 'c' }],
        pontos: [{ x: 2, y: 4, rotulo: '(2, 4)', cor: 'a' }, { x: 4, y: 2, rotulo: '(4, 2)', cor: 'b' }],
        x: [-3, 6], y: [-3, 6],
      },
    },
    {
      titulo: 'Escala logarítmica',
      texto: 'Quando as medidas vão de 1 a 1 bilhão, uma régua comum não serve. A escala logarítmica anota o expoente. Na escala Richter, cada ponto a mais é uma onda 10 vezes maior: um terremoto de magnitude 7 tem ondas 100 vezes maiores que um de magnitude 5. No pH, cada ponto a menos é 10 vezes mais ácido.',
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'O logaritmo transforma multiplicação em soma, e soma é mais fácil de manejar. No cálculo aparece o $\\ln$, o log na base $e \\approx 2{,}718$, a base especial da lição anterior. A taxa de variação de $\\ln x$ é simplesmente $\\frac{1}{x}$.',
    },
  ],
  resumo: '$\\log_a b = c$ quer dizer $a^c = b$: o log é o expoente. Sem base escrita, a base é 10. As regras vêm das potências: $\\log(xy) = \\log x + \\log y$, $\\log\\frac{x}{y} = \\log x - \\log y$, $\\log x^n = n\\log x$. O gráfico do log é o da exponencial espelhado na reta $y = x$.',
  exemplos: [
    {
      enunciado: 'Calcule $\\log_3 81$.',
      passos: [
        { texto: '$3^{?} = 81$', porque: 'O log pergunta o expoente.' },
        { texto: '$3^4 = 3\\cdot 3\\cdot 3\\cdot 3 = 81$', porque: 'Multiplicando até chegar a 81.' },
        { texto: '$\\log_3 81 = 4$', porque: 'O expoente é a resposta.' },
      ],
    },
    {
      enunciado: 'Sabendo que $\\log 2 \\approx 0{,}3$, calcule $\\log 20$.',
      passos: [
        { texto: '$\\log 20 = \\log(2\\cdot 10) = \\log 2 + \\log 10$', porque: 'Log de um produto é a soma dos logs.' },
        { texto: '$\\log 10 = 1$', porque: '$10^1 = 10$.', lacuna: { pergunta: 'Quanto vale $\\log 10$?', resposta: { tipo: 'numero', valor: 1 } } },
        { texto: '$\\log 20 \\approx 0{,}3 + 1$, que dá 1,3', porque: 'Soma final.' },
      ],
    },
    {
      enunciado: 'Resolva $2^x = 64$.',
      passos: [
        { texto: '$64 = 2^6$', porque: '2, 4, 8, 16, 32, 64: seis dobras.', lacuna: { pergunta: '2 elevado a quanto dá 64?', resposta: { tipo: 'numero', valor: 6 } } },
        { texto: '$2^x = 2^6$, então $x = 6$', porque: 'Mesma base dos dois lados: os expoentes são iguais.', lacuna: { pergunta: 'Quanto vale $x$?', resposta: { tipo: 'numero', valor: 6 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Quanto vale $\\log_2 32$?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: '2 elevado a quanto dá 32?',
      resolucao: [
        { texto: '$32 = 2\\cdot 2\\cdot 2\\cdot 2\\cdot 2 = 2^5$', porque: 'Cinco fatores 2.' },
        { texto: '$\\log_2 32 = 5$', porque: 'O log é o expoente.' },
      ],
    },
    {
      enunciado: 'Quanto vale $\\log 1000$?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Sem base escrita, a base é 10. Conte os zeros.',
      resolucao: [
        { texto: '$1000 = 10^3$', porque: 'Três zeros.' },
        { texto: '$\\log 1000 = 3$', porque: '10 elevado a 3 dá 1000.' },
      ],
    },
    {
      enunciado: 'Sabendo que $\\log 2 \\approx 0{,}3$ e $\\log 3 \\approx 0{,}48$, quanto vale $\\log 6$?',
      resposta: { tipo: 'numero', valor: 0.78 },
      dica: '$6 = 2\\cdot 3$, e log de produto é soma.',
      resolucao: [
        { texto: '$\\log 6 = \\log 2 + \\log 3$', porque: 'Porque $6 = 2\\cdot 3$.' },
        { texto: '$0{,}3 + 0{,}48$, que dá 0,78', porque: 'Soma dos dois logs.' },
      ],
    },
    {
      enunciado: 'Resolva $3^x = 243$.',
      resposta: { tipo: 'numero', valor: 5 },
      dica: 'Multiplique 3 por ele mesmo até chegar a 243.',
      resolucao: [
        { texto: '$243 = 3\\cdot 3\\cdot 3\\cdot 3\\cdot 3 = 3^5$', porque: '3, 9, 27, 81, 243.' },
        { texto: '$x = 5$', porque: 'Mesma base: os expoentes são iguais.' },
      ],
    },
    {
      enunciado: 'Na escala Richter, cada ponto a mais é uma onda 10 vezes maior. A onda de um terremoto de magnitude 8 é quantas vezes maior que a de um de magnitude 5?',
      resposta: { tipo: 'numero', valor: 1000 },
      dica: 'Quantos pontos de diferença? Cada ponto multiplica por 10.',
      resolucao: [
        { texto: 'São 3 pontos de diferença.', porque: '8 menos 5.' },
        { texto: '$10\\cdot 10\\cdot 10 = 1000$', porque: 'Cada ponto multiplica por 10; somar pontos é multiplicar ondas.' },
      ],
    },
    {
      enunciado: 'Se $\\log_2 x = 3$ e $\\log_2 y = 5$, quanto vale $\\log_2 (x^2 y)$?',
      resposta: { tipo: 'numero', valor: 11 },
      dica: 'Não precisa achar $x$ e $y$: abra o log com as regras.',
      resolucao: [
        { texto: '$\\log_2 (x^2 y) = 2\\log_2 x + \\log_2 y$', porque: 'O produto vira soma e o expoente 2 desce multiplicando.' },
        { texto: '$2\\cdot 3 + 5 = 11$', porque: 'Troca cada log pelo valor dado.' },
      ],
      nivelAcima: { estilo: 'ITA' },
    },
    {
      enunciado: 'Uma cidade tem 10 mil habitantes, e a população dobra a cada 20 anos. Em quantos anos ela chega a 80 mil habitantes?',
      resposta: { tipo: 'numero', valor: 60 },
      dica: 'Quantas vezes 10 mil precisa dobrar para virar 80 mil?',
      resolucao: [
        { texto: '80 mil dividido por 10 mil dá 8, e $8 = 2^3$: são 3 dobras.', porque: '$\\log_2 8 = 3$.' },
        { texto: '$3\\cdot 20 = 60$', porque: 'Cada dobra leva 20 anos.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
  ],
  recuperacao: {
    pergunta: 'O que $\\log_2 16$ pergunta, em palavras?',
    resposta: 'Quantas vezes é preciso multiplicar o 2 para chegar a 16. A resposta é 4, porque $2^4 = 16$.',
  },
};
