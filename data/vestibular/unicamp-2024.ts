// Unicamp 2024, 1ª fase (4 alternativas). Texto e gabarito do banco BLUEX
// (portuguese-benchmark-datasets/BLUEX); cada gabarito conferido por resolução própria.
import type { QuestaoVestibular } from '@/lib/vestibular/tipos';

const t = String.raw;
const base = { banca: 'Unicamp', ano: 2024 } as const;

export const UNICAMP_2024: QuestaoVestibular[] = [
  {
    ...base, numero: 38, materia: 'Física', subtema: 'Dinâmica',
    enunciado: t`Um corpo em queda nas proximidades da superfície terrestre sofre a ação da força gravitacional e da força de resistência do ar, $F_{ar}$; essa última atua em sentido oposto à força gravitacional. Nos primeiros instantes, $F_{ar} \approx 0$ se o corpo parte do repouso. À medida que a velocidade aumenta, $F_{ar}$ também aumenta. Com isso, a aceleração do corpo diminui gradativamente, tornando-se praticamente nula a partir de certo momento. Desse ponto em diante, o corpo passa a cair com velocidade constante, chamada de velocidade terminal. Um objeto de massa $m = 200$ g é solto a partir de certa altura e atinge a velocidade terminal após determinado tempo. Qual é o módulo da força de resistência do ar depois que o objeto atinge a velocidade terminal?

Use os valores aproximados: $g = 10$ m/s².`,
    alternativas: ['0,20 N.', '2,0 N.', '200 N.', '2000 N.'],
    gabarito: 1,
    adaptacao: 'A constante g = 10 m/s², dada no topo da prova, foi trazida para o fim do enunciado.',
    passos: [
      { pergunta: 'Velocidade terminal é velocidade constante. A aceleração é…', opcoes: ['zero', 'g', 'negativa'], correta: 0,
        porque: 'Velocidade que não muda: aceleração nula.' },
      { pergunta: 'Aceleração zero quer dizer que as forças…', opcoes: [t`se equilibram: $F_{ar}=P$`, t`somem: $F_{ar}=0$`, t`$F_{ar}>P$`], correta: 0,
        conta: t`F_{ar}-m\,g=m\cdot0\ \Rightarrow\ F_{ar}=m\,g`, porque: '2ª lei de Newton.' },
      { pergunta: 'Com m = 200 g:', opcoes: ['2,0 N', '200 N', '0,20 N'], correta: 0,
        conta: t`F_{ar}=0{,}2\ \text{kg}\cdot10\ \text{m/s}^2=2\ \text{N}`, porque: 'Grama vira quilo antes: 200 g = 0,2 kg.' },
    ],
  },
  {
    ...base, numero: 54, materia: 'Matemática', subtema: 'Área do círculo',
    enunciado: `Sr. Gauss tem uma pizzaria, chamada π-zzaria, que vende dois tipos de pizzas circulares: uma individual, de diâmetro d; e uma de 20 cm de diâmetro, partida em quatro pedaços iguais.

Considerando que o preço de uma pizza é proporcional à sua área, qual precisa ser o valor de d para que quatro pizzas individuais custem o mesmo que a pizza mencionada, de quatro pedaços?`,
    alternativas: ['6 cm.', '8 cm.', '10 cm.', '12 cm.'],
    gabarito: 2,
    passos: [
      { pergunta: 'Área da pizza grande (raio 10 cm):', opcoes: [t`$100\pi$`, t`$20\pi$`, t`$400\pi$`], correta: 0,
        conta: t`\pi\cdot10^2=100\pi` },
      { pergunta: t`Quatro individuais de diâmetro $d$ (raio $\frac d2$):`, opcoes: [t`$\pi d^2$`, t`$4\pi d^2$`, t`$\frac{\pi d^2}{4}$`], correta: 0,
        conta: t`4\cdot\pi\Big(\tfrac d2\Big)^2=\pi d^2` },
      { pergunta: 'Preço igual, área igual:', opcoes: ['d = 10 cm', 'd = 20 cm', 'd = 5 cm'], correta: 0,
        conta: t`\pi d^2=100\pi\ \Rightarrow\ d=10`, porque: 'Diâmetro pela metade, área dividida por 4: quatro pequenas valem uma grande.' },
    ],
  },
  {
    ...base, numero: 55, materia: 'Matemática', subtema: 'Lógica',
    enunciado: `Todo final de semana, as amigas Ana, Bruna e Carol se encontram em um parque para andar de bicicleta ou de patins. Nesta brincadeira, a escolha entre patins e bicicleta é feita usando a seguinte regra:

Se Ana anda de patins, então Carol também anda de patins.
Bruna anda de patins apenas quando Carol anda de bicicleta.

Sabendo que neste final de semana Carol andou de patins, então é necessariamente verdade que`,
    alternativas: ['Ana andou de patins.', 'Ana não andou de patins.', 'Bruna andou de patins.', 'Bruna não andou de patins.'],
    gabarito: 3,
    passos: [
      { pergunta: '"Bruna anda de patins apenas quando Carol anda de bicicleta" quer dizer…', opcoes: ['se Bruna está de patins, Carol está de bicicleta', 'se Carol está de bicicleta, Bruna está de patins', 'nada'], correta: 0,
        porque: '"Apenas quando" marca o que tem de acontecer junto.' },
      { pergunta: 'Carol foi de patins. Então Bruna…', opcoes: ['não andou de patins', 'andou de patins', 'não dá para saber'], correta: 0,
        porque: 'Se Bruna estivesse de patins, Carol estaria de bicicleta. Não está.' },
      { pergunta: 'E Ana?', opcoes: ['não dá para saber', 'andou de patins', 'não andou de patins'], correta: 0,
        porque: '"Se Ana, então Carol" não diz nada quando Carol já está de patins. Só o fato sobre Bruna é certo.' },
    ],
  },
  {
    ...base, numero: 56, materia: 'Matemática', subtema: 'Sistemas',
    enunciado: `Luísa estava conversando com seu irmão ao telefone quando passou perto de uma feira de adoção de animais. Ela comentou que, na feira, havia cachorros, gatos e pintinhos.

O irmão, curioso, perguntou-lhe quantos gatos havia. Luísa, que adora charadas matemáticas, limitou-se a dizer que a quantidade de gatos somada à quantidade de pintinhos era 4 a mais do que a quantidade de cachorros, e que a quantidade de gatos somada à quantidade de cachorros era 6 a mais do que a quantidade de pintinhos.

O irmão de Luísa, que adora as aulas de matemática, rapidamente chegou à resposta correta. Havia quantos gatos para adoção?`,
    alternativas: ['4.', '5.', '6.', '7.'],
    gabarito: 1,
    passos: [
      { pergunta: 'Escreva as duas frases (g gatos, p pintinhos, c cachorros):', opcoes: [t`$g+p=c+4$ e $g+c=p+6$`, t`$g+p+c=10$`, t`$g=p+4$`], correta: 0,
        conta: t`g+p=c+4,\qquad g+c=p+6` },
      { pergunta: 'Some as duas equações:', opcoes: [t`$2g=10$`, t`$g=c$`, t`$p=c$`], correta: 0,
        conta: t`2g+p+c=c+p+10\ \Rightarrow\ 2g=10`, porque: 'p e c aparecem dos dois lados e somem.' },
      { pergunta: 'Quantos gatos?', opcoes: ['5', '4', '10'], correta: 0, conta: t`g=5` },
    ],
  },
  {
    ...base, numero: 58, materia: 'Matemática', subtema: 'Desigualdade triangular',
    enunciado: `Joaquim estava brincando com um graveto, quando acertou uma parede e o graveto se partiu em três pedaços, de comprimentos a, b, c, com a ≤ b ≤ c. Ele recolheu os pedaços e tentou construir um triângulo cujos lados seriam exatamente os pedaços do graveto: não foi possível. Sabendo que o graveto tinha 50 cm de comprimento e que b = a + 2, qual é o maior valor possível de a?`,
    alternativas: ['9,5 cm.', '10,5 cm.', '11,5 cm.', '12,5 cm.'],
    gabarito: 2,
    passos: [
      { pergunta: t`Não formar triângulo com $a\le b\le c$ significa…`, opcoes: [t`$c\ge a+b$`, t`$c<a+b$`, t`$a=b$`], correta: 0,
        porque: 'O maior lado precisa ser menor que a soma dos outros dois para o triângulo fechar.' },
      { pergunta: t`Com $a+b+c=50$ e $b=a+2$, $c$ vale…`, opcoes: [t`$48-2a$`, t`$50-a$`, t`$a+4$`], correta: 0,
        conta: t`c=50-a-(a+2)=48-2a` },
      { pergunta: 'A condição fica…', opcoes: [t`$a\le11{,}5$`, t`$a\ge11{,}5$`, t`$a\le12{,}5$`], correta: 0,
        conta: t`48-2a\ge2a+2\ \Rightarrow\ a\le11{,}5`, porque: 'No limite, c = 25 = a + b: o "triângulo" fica achatado.' },
    ],
  },
  {
    ...base, numero: 59, materia: 'Matemática', subtema: 'Inequações',
    enunciado: t`Considere os conjuntos $A = \{x \in \mathbb{R} \mid x^2 - 2x - 24 < 0\}$ e $B = \{x \in \mathbb{R} \mid 2x - 7 \le 0\}$. Quantos números inteiros pertencem à interseção $A \cap B$?`,
    alternativas: ['3.', '5.', '7.', '9.'],
    gabarito: 2,
    passos: [
      { pergunta: t`Raízes de $x^2-2x-24$:`, opcoes: [t`$-4$ e $6$`, t`$4$ e $-6$`, t`$2$ e $12$`], correta: 0,
        conta: t`(x-6)(x+4)<0\ \Rightarrow\ -4<x<6`, porque: 'Parábola para cima: negativa entre as raízes.' },
      { pergunta: t`O conjunto $B$:`, opcoes: [t`$x\le3{,}5$`, t`$x\ge3{,}5$`, t`$x\le7$`], correta: 0,
        conta: t`2x-7\le0\ \Rightarrow\ x\le\tfrac72` },
      { pergunta: t`Inteiros com $-4<x\le3{,}5$:`, opcoes: ['7: de −3 a 3', '9', '5'], correta: 0,
        conta: t`\{-3,-2,-1,0,1,2,3\}` },
    ],
  },
  {
    ...base, numero: 60, materia: 'Matemática', subtema: 'Combinatória',
    enunciado: `Terminado o almoço, Ana foi à cozinha para a escolha das sobremesas. A garota estava decidida a pegar dois itens. Seu pai, preocupado com a alimentação dela, instruiu-a da seguinte forma: "Escolha o que quiser, mas, se você pegar algum pirulito, pegue também alguma fruta". Na cozinha, tinha 5 frutas diferentes, 3 pirulitos diferentes e 2 pedaços de bolos de sabores diferentes. De quantas formas Ana poderia escolher seus dois itens?`,
    alternativas: ['34.', '36.', '45.', '47.'],
    gabarito: 1,
    passos: [
      { pergunta: 'Sem regra nenhuma, dois itens entre 10:', opcoes: ['45', '90', '100'], correta: 0,
        conta: t`\binom{10}{2}=\frac{10\cdot9}{2}=45` },
      { pergunta: 'Proibido: ter pirulito sem fruta. Entre 3 pirulitos e 2 bolos, pares com pirulito são…', opcoes: ['9', '10', '3'], correta: 0,
        conta: t`\binom52-\binom22=10-1=9`, porque: 'De todos os pares sem fruta, só "dois bolos" não tem pirulito.' },
      { pergunta: 'Formas permitidas:', opcoes: ['36', '34', '45'], correta: 0, conta: t`45-9=36` },
    ],
  },
  {
    ...base, numero: 61, materia: 'Matemática', subtema: 'Probabilidade',
    enunciado: `João e Maria estão passeando pela floresta. Para não se perderem no caminho, levaram consigo uma sacola com 100 pedrinhas, sendo 60 pedrinhas brancas e 40 pedrinhas pretas. A cada 5 passos eles retiram aleatoriamente uma pedrinha da sacola e jogam-na no chão para marcar o caminho.

Quando eles pararam para fazer um lanche, notaram que já tinham sido jogadas 35 pedrinhas brancas e 25 pedrinhas pretas.

Qual a probabilidade de as próximas duas pedrinhas jogadas serem brancas?`,
    alternativas: [t`$\frac{7}{13}$.`, t`$\frac{5}{13}$.`, t`$\frac{11}{52}$.`, t`$\frac{7}{52}$.`],
    gabarito: 1,
    passos: [
      { pergunta: 'O que sobrou na sacola?', opcoes: ['25 brancas e 15 pretas (40)', '60 brancas e 40 pretas', '35 brancas e 25 pretas'], correta: 0,
        conta: t`60-35=25,\qquad 40-25=15` },
      { pergunta: 'Branca e depois branca de novo:', opcoes: [t`$\frac{25}{40}\cdot\frac{24}{39}$`, t`$\frac{25}{40}\cdot\frac{25}{40}$`, t`$\frac{35}{60}$`], correta: 0,
        porque: 'Sem devolver: depois da primeira, sobra uma branca a menos e uma pedra a menos.' },
      { pergunta: 'Simplificando:', opcoes: [t`$\frac{5}{13}$`, t`$\frac{7}{13}$`, t`$\frac{7}{52}$`], correta: 0,
        conta: t`\frac{25}{40}\cdot\frac{24}{39}=\frac58\cdot\frac{8}{13}=\frac{5}{13}` },
    ],
  },
  {
    ...base, numero: 62, materia: 'Matemática', subtema: 'Somas',
    enunciado: t`Seja $p(x) = x + 2024$. A equação

$p(x) + p(2x) + p(3x) + \dots + p(2023x) + p(2024x) = 0$

tem uma solução $x$ que satisfaz:`,
    alternativas: [t`$x < -2$.`, t`$-2 < x < 0$.`, t`$0 < x < 2$.`, t`$x > 2$.`],
    gabarito: 1,
    passos: [
      { pergunta: t`Some só as partes com $x$: $x+2x+\dots+2024x$.`, opcoes: [t`$x\cdot\frac{2024\cdot2025}{2}$`, t`$2024x$`, t`$x^{2024}$`], correta: 0,
        conta: t`1+2+\dots+2024=\tfrac{2024\cdot2025}{2}`, porque: 'Soma de Gauss: primeiro mais último, vezes quantos, dividido por 2.' },
      { pergunta: 'E o 2024 que aparece 2024 vezes:', opcoes: [t`$2024^2$`, '2024', t`$2\cdot2024$`], correta: 0,
        conta: t`2024\cdot2024=2024^2` },
      { pergunta: 'Igualando a zero, x vale…', opcoes: [t`$-\frac{4048}{2025}\approx-1{,}999$`, t`$-2024$`, '1'], correta: 0,
        conta: t`x\cdot\tfrac{2024\cdot2025}{2}=-2024^2\ \Rightarrow\ x=-\tfrac{2\cdot2024}{2025}`, porque: 'Um pouquinho maior que −2: entre −2 e 0.' },
    ],
  },
  {
    ...base, numero: 64, materia: 'Matemática', subtema: 'Função composta',
    enunciado: t`Considere as funções $f(x) = 2x + c$ e $g(x) = 5 - 6x$, com $c > 0$. Sejam $P$ e $Q$ os pontos de interseção, com o eixo $y$, dos gráficos de $y = f(g(x))$ e $y = g(f(x))$, respectivamente.

Para que a origem seja o ponto médio do segmento $PQ$, qual deverá ser o valor de $c$?`,
    alternativas: ['1.', '2.', '3.', '4.'],
    gabarito: 2,
    passos: [
      { pergunta: t`$P$ é onde $y=f(g(x))$ corta o eixo $y$ ($x=0$):`, opcoes: [t`$f(g(0))=f(5)=10+c$`, t`$f(0)=c$`, t`$g(0)=5$`], correta: 0,
        conta: t`P=(0,\ 10+c)` },
      { pergunta: t`E $Q$:`, opcoes: [t`$g(f(0))=g(c)=5-6c$`, '5', t`$5+6c$`], correta: 0,
        conta: t`Q=(0,\ 5-6c)` },
      { pergunta: 'Origem no meio: as duas alturas somam zero. Então…', opcoes: [t`$c=3$`, t`$c=1$`, t`$c=-3$`], correta: 0,
        conta: t`10+c+5-6c=0\ \Rightarrow\ c=3` },
    ],
  },
];
