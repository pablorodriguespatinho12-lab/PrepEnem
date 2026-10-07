import type { ConteudoLicao } from '@/lib/calculo/tipos';

export const C10_OTIMIZACAO: ConteudoLicao = {
  gancho: {
    pergunta: 'Com 20 m de cerca, você quer cercar um terreno retangular. Que medidas dão a maior área?',
    ideia: 'Se a base é $x$, a altura é $10 - x$ (base mais altura é metade da cerca). Testando: 2 por 8 dá 16 m²; 4 por 6 dá 24; 5 por 5 dá 25; 6 por 4 volta a 24. O máximo é o quadrado 5 por 5.',
  },
  construcao: [
    {
      titulo: 'A cerca mudando de forma',
      texto: 'A cerca tem sempre 20 m. Mova o controle: a base cresce e a altura encolhe, porque a cerca não estica. A área sobe, chega a 25 m² no quadrado 5 por 5 e depois desce.',
      visual: { tipo: 'retangulo', titulo: '20 m de cerca: base x, altura 10 − x', x: [0, 10], base: 'x', altura: '10-x', unidade: 'm', faixas: false },
    },
    {
      titulo: 'A área como função',
      texto: 'A área depende de uma escolha só, a base: $A(x) = x(10 - x)$. O gráfico é uma parábola virada para baixo, e o topo dela é a melhor escolha.',
      visual: {
        tipo: 'grafico', titulo: 'Área do terreno: A(x) = x(10 − x)',
        funcoes: [{ expr: 'x*(10-x)', rotulo: 'A(x)', cor: 'a' }],
        pontos: [{ x: 5, y: 25, rotulo: 'máximo: 5 por 5', cor: 'b' }],
        x: [0, 10], y: [0, 30],
      },
    },
    {
      titulo: 'O método em quatro passos',
      texto: 'Toda questão de otimização segue o mesmo roteiro: o que se quer, o que prende, derivar, conferir.',
      visual: {
        tipo: 'transformacao', titulo: 'A cerca pelo método',
        linhas: [
          { latex: 'A = b\\cdot a', porque: '1. o que se quer: a área' },
          { latex: '2b + 2a = 20 \\;\\Rightarrow\\; a = 10 - b', porque: '2. o que prende: a cerca' },
          { latex: "A(b) = 10b - b^2, \\quad A'(b) = 10 - 2b", porque: '3. uma variável só; deriva' },
          { latex: '10 - 2b = 0 \\;\\Rightarrow\\; b = 5', porque: '4. topo; nas pontas a área é 0' },
        ],
      },
    },
    {
      titulo: 'A caixa de maior volume',
      texto: 'Uma folha de 12 cm por 12 cm. Corta-se um quadrado de lado $x$ em cada canto e dobram-se as abas: vira uma caixa sem tampa, de volume $V = x(12 - 2x)^2$. Corte pequeno dá caixa rasa; corte grande, caixa estreita. A tabela mostra o melhor perto de 2.',
      visual: {
        tipo: 'tabela', titulo: 'Volume da caixa para cada corte',
        cabecalho: ['corte x (cm)', 'fundo (cm)', 'volume (cm³)'],
        linhas: [['1', '10 por 10', '100'], ['2', '8 por 8', '128'], ['3', '6 por 6', '108'], ['4', '4 por 4', '64']],
      },
    },
    {
      titulo: 'Derivando a caixa',
      texto: 'A derivada confirma o 2 sem tabela. Ela zera em dois lugares: em 6 a caixa não tem fundo, então sobra o 2.',
      visual: {
        tipo: 'transformacao', titulo: 'O máximo da caixa',
        linhas: [
          { latex: "V'(x) = (12 - 2x)^2 - 4x(12 - 2x)", porque: 'produto e cadeia' },
          { latex: '= (12 - 2x)(12 - 6x)', porque: 'põe (12 − 2x) em evidência' },
          { latex: 'x = 6 \\ \\text{(sem fundo)} \\quad\\text{ou}\\quad x = 2', porque: 'onde a derivada zera' },
          { latex: 'V(2) = 2\\cdot 8^2 = 128', porque: 'volume máximo: 128 cm³' },
        ],
      },
    },
    {
      titulo: 'Sempre confira as pontas',
      texto: 'O melhor valor pode estar numa ponta do intervalo, onde a derivada não precisa ser zero. Na cerca, as pontas (base 0 ou base 10) dão área 0, então o topo de verdade é o do meio. Compare sempre os candidatos com as pontas.',
    },
    {
      titulo: 'Por que isso importa para o cálculo',
      texto: 'Menor gasto de material, maior lucro, menor tempo de viagem: engenharia, economia e logística vivem dessa conta. É a aplicação da derivada que mais aparece no vestibular.',
    },
  ],
  resumo: 'Otimizar em quatro passos: escreva a quantidade que se quer; use a restrição para deixar uma variável só; derive e iguale a zero; compare com as pontas do intervalo. Com perímetro fixo, o retângulo de maior área é o quadrado.',
  exemplos: [
    {
      enunciado: 'Dois números somam 12. Qual o maior produto possível entre eles?',
      passos: [
        { texto: '$P = x(12 - x) = 12x - x^2$', porque: 'Se um é $x$, o outro é $12 - x$.' },
        { texto: "$P'(x) = 12 - 2x$, que zera em $x = 6$", porque: 'Deriva e iguala a zero.' },
        { texto: '$P = 6\\cdot 6 = 36$', porque: 'Os dois números são 6.' },
      ],
    },
    {
      enunciado: 'Com 40 m de cerca, qual a maior área retangular, em m²?',
      passos: [
        { texto: 'Base mais altura dá 20, então $A = x(20 - x)$', porque: 'Metade da cerca.' },
        { texto: "$A'(x) = 20 - 2x$, que zera em $x = 10$", porque: 'O quadrado de novo.' },
        { texto: '$A = 10\\cdot 10 = 100$', porque: 'Área máxima.', lacuna: { pergunta: 'Qual a área máxima?', resposta: { tipo: 'numero', valor: 100 } } },
      ],
    },
    {
      enunciado: 'Um terreno retangular encosta num rio, então só três lados levam cerca: 60 m no total. Qual a maior área possível?',
      passos: [
        { texto: '$A = x(60 - 2x) = 60x - 2x^2$', porque: 'Dois lados de $x$ saindo do rio; o lado paralelo ao rio fica com o resto.' },
        { texto: "$A'(x) = 60 - 4x = 0$ em $x = 15$", porque: 'Deriva e iguala a zero.', lacuna: { pergunta: 'Quanto vale $x$?', resposta: { tipo: 'numero', valor: 15 } } },
        { texto: '$A = 15\\cdot 30 = 450$', porque: 'O lado do rio fica com 30 m; aqui o melhor não é um quadrado.', lacuna: { pergunta: 'Qual a área máxima, em m²?', resposta: { tipo: 'numero', valor: 450 } } },
      ],
    },
  ],
  exercicios: [
    {
      enunciado: 'Dois números positivos somam 20. Qual o maior produto possível?',
      resposta: { tipo: 'numero', valor: 100 },
      dica: 'Se um é $x$, o outro é $20 - x$.',
      resolucao: [
        { texto: '$P = x(20 - x)$, com máximo em $x = 10$', porque: "$P' = 20 - 2x$." },
        { texto: '$10\\cdot 10 = 100$', porque: 'Os dois são 10.' },
      ],
    },
    {
      enunciado: 'Com 16 m de cerca, qual a maior área retangular, em m²?',
      resposta: { tipo: 'numero', valor: 16 },
      dica: 'Perímetro fixo: o melhor é o quadrado.',
      resolucao: [
        { texto: 'Base mais altura dá 8; o máximo é o quadrado 4 por 4.', porque: "$A = x(8 - x)$, $A' = 8 - 2x$." },
        { texto: '$4\\cdot 4 = 16$', porque: 'Área máxima.' },
      ],
    },
    {
      enunciado: 'Para que $x$ a função $f(x) = -x^2 + 6x + 1$ é máxima?',
      resposta: { tipo: 'numero', valor: 3 },
      dica: 'Derive e iguale a zero.',
      resolucao: [
        { texto: "$f'(x) = -2x + 6$", porque: 'Deriva.' },
        { texto: '$-2x + 6 = 0$ em $x = 3$', porque: 'Parábola para baixo: topo.' },
      ],
    },
    {
      enunciado: 'Uma fábrica tem lucro $L(q) = 40q - q^2$ reais ao vender $q$ unidades. Quantas unidades dão o maior lucro?',
      resposta: { tipo: 'numero', valor: 20 },
      dica: 'Onde a derivada do lucro zera?',
      resolucao: [
        { texto: "$L'(q) = 40 - 2q$", porque: 'Lucro a mais por unidade a mais.' },
        { texto: '$40 - 2q = 0$ em $q = 20$', porque: 'Depois disso, cada unidade a mais diminui o lucro.' },
      ],
    },
    {
      enunciado: 'De uma folha quadrada de 30 cm de lado cortam-se quadrados de lado $x$ nos cantos, para fazer uma caixa sem tampa. Que valor de $x$, em cm, dá o maior volume?',
      resposta: { tipo: 'numero', valor: 5 },
      dica: '$V = x(30 - 2x)^2$. Derive com produto e cadeia.',
      resolucao: [
        { texto: "$V'(x) = (30 - 2x)^2 - 4x(30 - 2x)$, que fatora em $(30 - 2x)(30 - 6x)$", porque: 'Põe $(30 - 2x)$ em evidência.' },
        { texto: 'Zera em 15, que é a caixa sem fundo, e em 5.', porque: 'Só um dos dois faz sentido.' },
        { texto: 'O máximo é em $x = 5$', porque: 'Corte de um sexto do lado da folha.' },
      ],
      nivelAcima: { estilo: 'Fuvest' },
    },
    {
      enunciado: 'Qual ponto da reta $y = x$ fica mais perto do ponto $(4, 0)$? Responda a coordenada $x$ dele.',
      resposta: { tipo: 'numero', valor: 2 },
      dica: 'Minimize o quadrado da distância: $(x - 4)^2 + x^2$.',
      resolucao: [
        { texto: '$d^2 = (x - 4)^2 + x^2$', porque: 'O ponto da reta é $(x, x)$.' },
        { texto: 'Derivando: $2(x - 4) + 2x = 0$, então $x = 2$', porque: 'Minimizar a distância é o mesmo que minimizar o quadrado dela, que não tem raiz.' },
      ],
      nivelAcima: { estilo: 'Unicamp' },
    },
  ],
  recuperacao: {
    pergunta: 'Quais são os passos para achar o máximo de uma quantidade que tem uma restrição?',
    resposta: 'Escrever a quantidade, usar a restrição para deixar uma variável só, derivar e igualar a zero, e comparar com as pontas do intervalo.',
  },
};
