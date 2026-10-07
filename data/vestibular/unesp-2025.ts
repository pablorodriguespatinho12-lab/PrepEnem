// Unesp 2025, 1ª fase (Vunesp, 15/11/2024, versão 1). Caderno e gabarito oficiais
// publicados em vestibulares.estrategia.com (unesp-2025-1-fase-*.pdf). Só questões
// que não dependem de figura; símbolos que o PDF perdeu (setas, núcleos) refeitos.
import type { QuestaoVestibular } from '@/lib/vestibular/tipos';

const t = String.raw;
const base = { banca: 'Unesp', ano: 2025 } as const;

export const UNESP_2025: QuestaoVestibular[] = [
  {
    ...base, numero: 71, materia: 'Química', subtema: 'Soluções',
    enunciado: t`Uma solução aquosa do sal sulfato de cobre pentahidratado, $\mathrm{CuSO_4\cdot5H_2O}$, massa molar = 250 g/mol, foi preparada pela diluição de 10 mL de uma solução estoque do sal que contém 10 g do sal/100 mL de solução, até o volume final de 1 L.

A concentração da solução diluída do sal, expressa em g/L e em mol/L, é, respectivamente,`,
    alternativas: [t`10 e $4\times10^{-3}$.`, t`1 e $1\times10^{-5}$.`, t`10 e $1\times10^{-1}$.`, t`1 e $4\times10^{-4}$.`, t`1 e $4\times10^{-3}$.`],
    gabarito: 4,
    passos: [
      { pergunta: 'Concentração da solução estoque, em g/L:', opcoes: ['100 g/L', '10 g/L', '1 g/L'], correta: 0,
        conta: t`\frac{10\ \text{g}}{0{,}1\ \text{L}}=100\ \text{g/L}` },
      { pergunta: '10 mL viraram 1 L (volume 100 vezes maior):', opcoes: ['1 g/L', '10 g/L', '0,1 g/L'], correta: 0,
        conta: t`\frac{100\ \text{g/L}}{100}=1\ \text{g/L}`, porque: 'A massa de sal é a mesma; só ganhou água.' },
      { pergunta: 'Em mol/L (250 g por mol):', opcoes: [t`$4\times10^{-3}$`, t`$4\times10^{-4}$`, t`$1\times10^{-5}$`], correta: 0,
        conta: t`\frac{1}{250}=0{,}004\ \text{mol/L}` },
    ],
  },
  {
    ...base, numero: 73, materia: 'Química', subtema: 'Equilíbrio químico',
    enunciado: t`Em uma solução aquosa de cianeto de sódio (NaCN), ocorrem os seguintes equilíbrios simultâneos:

$\mathrm{CN^-(aq) + H_2O(l) \rightleftharpoons HCN(aq) + OH^-(aq)}$
$\mathrm{HCN(aq) \rightleftharpoons HCN(g)}$

O cianeto de hidrogênio (HCN) é um gás extremamente tóxico, que pode ser fatal quando inalado. Para minimizar o escape desse gás para a atmosfera, recomenda-se`,
    alternativas: [
      'elevar o pH da solução de NaCN por adição de NaCl.',
      'diminuir o pH da solução de NaCN por adição de NaOH.',
      'elevar o pH da solução de NaCN por adição de HCl.',
      'diminuir o pH da solução de NaCN por adição de HCl.',
      'elevar o pH da solução de NaCN por adição de NaOH.',
    ],
    gabarito: 4,
    passos: [
      { pergunta: 'Para escapar menos HCN, o primeiro equilíbrio deve ir…', opcoes: ['para a esquerda', 'para a direita', 'para lugar nenhum'], correta: 0,
        porque: 'Esquerda = menos HCN dissolvido = menos gás.' },
      { pergunta: 'O que empurra esse equilíbrio para a esquerda?', opcoes: [t`mais $\mathrm{OH^-}$`, t`menos $\mathrm{OH^-}$`, 'mais HCN'], correta: 0,
        porque: 'Le Chatelier: aumentar um produto desloca para o lado dos reagentes.' },
      { pergunta: 'Adicionar NaOH faz o pH…', opcoes: ['subir', 'descer', 'ficar igual'], correta: 0,
        conta: t`\mathrm{NaOH}\rightarrow\mathrm{Na^+}+\mathrm{OH^-}`, porque: 'Base forte: mais OH⁻, pH maior. Alternativa (e).' },
    ],
  },
  {
    ...base, numero: 74, materia: 'Química', subtema: 'Radioatividade',
    enunciado: t`Em 1932, James Chadwick descobriu o nêutron pelo bombardeamento do isótopo berílio-9 com partículas $\alpha$, conforme a equação nuclear:

$\alpha + {}^{9}_{4}\mathrm{Be} \rightarrow X + {}^{1}_{0}n$

O número de nêutrons do isótopo $X$ formado nesse bombardeamento é`,
    alternativas: ['9.', '6.', '8.', '4.', '13.'],
    gabarito: 1,
    adaptacao: 'A equação nuclear (imagem no caderno) foi reescrita.',
    passos: [
      { pergunta: t`A partícula $\alpha$ é…`, opcoes: [t`um núcleo de hélio: $A=4$, $Z=2$`, 'um elétron', 'um nêutron'], correta: 0 },
      { pergunta: 'Conservando massa (A) e carga (Z), X tem…', opcoes: [t`$A=12$ e $Z=6$`, t`$A=13$ e $Z=6$`, t`$A=9$ e $Z=4$`], correta: 0,
        conta: t`4+9=A+1,\qquad 2+4=Z+0` },
      { pergunta: 'Nêutrons de X:', opcoes: ['6', '12', '8'], correta: 0,
        conta: t`N=A-Z=12-6=6`, porque: 'É o carbono-12.' },
    ],
  },
  {
    ...base, numero: 75, materia: 'Química', subtema: 'Termoquímica',
    enunciado: t`A hidrazina ($\mathrm{N_2H_4}$), substância utilizada como propelente de foguetes, sofre combustão conforme a equação:

$\mathrm{N_2H_4 + O_2 \rightarrow N_2 + 2H_2O}$

A tabela apresenta alguns valores de entalpias de ligação envolvidas nessa reação.

N – H: 391 kJ/mol
N ≡ N: 949 kJ/mol
N – N: 163 kJ/mol
O = O: 497 kJ/mol
H – O: 463 kJ/mol

Utilizando os dados tabelados, calcula-se que a combustão de 1 mol de hidrazina irá liberar`,
    alternativas: ['949 kJ.', '1 727 kJ.', '577 kJ.', '2 224 kJ.', '2 801 kJ.'],
    gabarito: 2,
    adaptacao: 'Tabela reescrita em linhas, com os mesmos números.',
    passos: [
      { pergunta: 'Ligações quebradas (custam energia):', opcoes: ['4 N–H, 1 N–N e 1 O=O', 'só as N–H', 'a N≡N'], correta: 0,
        conta: t`4\cdot391+163+497=2224\ \text{kJ}`, porque: 'A hidrazina é H₂N–NH₂.' },
      { pergunta: 'Ligações formadas (liberam energia):', opcoes: ['1 N≡N e 4 O–H: 2801 kJ', '949 kJ', '1852 kJ'], correta: 0,
        conta: t`949+4\cdot463=2801\ \text{kJ}`, porque: 'Duas águas, cada uma com duas ligações O–H.' },
      { pergunta: 'Saldo:', opcoes: ['libera 577 kJ', 'absorve 577 kJ', 'libera 2801 kJ'], correta: 0,
        conta: t`\Delta H=2224-2801=-577\ \text{kJ}` },
    ],
  },
  {
    ...base, numero: 78, materia: 'Física', subtema: 'Dinâmica',
    enunciado: t`Uma esteira rolante é utilizada para transportar caixas para o alto de uma plataforma. Para iniciar a subida a partir do repouso, a esteira é colocada em movimento uniformemente acelerado por alguns instantes, até que as caixas atinjam uma velocidade constante, compatível com a subida. O coeficiente de atrito estático entre as superfícies das caixas e a superfície da esteira é 0,8 e a aceleração da gravidade local tem intensidade 10 m/s².

Sabendo que $\mathrm{sen}\,\theta = 0{,}6$ e que $\cos\theta = 0{,}8$, a intensidade da máxima aceleração que a esteira pode ter no início de seu movimento, sem que as caixas escorreguem sobre ela, será`,
    alternativas: ['0,4 m/s².', '0,2 m/s².', '0,5 m/s².', '0,1 m/s².', '0,3 m/s².'],
    gabarito: 0,
    adaptacao: 'A figura mostra a esteira inclinada de um ângulo θ com a horizontal.',
    passos: [
      { pergunta: 'O que puxa a caixa rampa acima, junto com a esteira?', opcoes: ['o atrito estático', 'o peso', 'a normal'], correta: 0,
        porque: 'A esteira "segura" a caixa pelo atrito.' },
      { pergunta: 'Atrito máximo e parte do peso ao longo da rampa:', opcoes: [t`$\mu mg\cos\theta$ e $mg\,\mathrm{sen}\,\theta$`, t`$mg$ e $\mu mg$`, t`$\mu mg\,\mathrm{sen}\,\theta$ e $mg$`], correta: 0,
        conta: t`F_{at}^{\max}=0{,}8\cdot m\cdot10\cdot0{,}8=6{,}4\,m,\qquad P_x=m\cdot10\cdot0{,}6=6\,m` },
      { pergunta: 'Aceleração máxima:', opcoes: ['0,4 m/s²', '6,4 m/s²', '0,8 m/s²'], correta: 0,
        conta: t`m\,a=6{,}4\,m-6\,m\ \Rightarrow\ a=0{,}4\ \text{m/s}^2` },
    ],
  },
  {
    ...base, numero: 85, materia: 'Matemática', subtema: 'Princípio da casa dos pombos',
    enunciado: `Em uma urna, são colocados cartões idênticos: um cartão com o número 1, dois cartões com o número 2, três cartões com o número 3, e assim sucessivamente, até cem cartões com o número 100, totalizando 1 + 2 + 3 + … + 100 = 5 050 cartões. A quantidade mínima de cartões que devem ser retirados aleatoriamente dessa urna para que se tenha certeza de que pelo menos 10 dos cartões retirados tenham um mesmo número é`,
    alternativas: ['865.', '253.', '55.', '1 001.', '11.'],
    gabarito: 0,
    passos: [
      { pergunta: 'Pior azar possível: tirar o máximo sem 10 iguais. Dos números 1 a 9 dá para tirar…', opcoes: ['todos: 45 cartões', '9 de cada: 81', 'nenhum'], correta: 0,
        conta: t`1+2+\dots+9=45`, porque: 'Nenhum deles chega a ter 10 cartões.' },
      { pergunta: 'De 10 a 100 (91 números), no máximo 9 de cada:', opcoes: ['819', '910', '91'], correta: 0,
        conta: t`91\cdot9=819` },
      { pergunta: 'O próximo cartão garante 10 iguais. Total:', opcoes: ['865', '864', '1001'], correta: 0,
        conta: t`45+819+1=865` },
    ],
  },
  {
    ...base, numero: 89, materia: 'Matemática', subtema: 'Logaritmo',
    enunciado: t`Considere o gráfico da função $f(x) = \log_2(x - 1)$, sendo $P$ e $Q$ os pontos de intersecção da assíntota e do gráfico com o eixo $x$, respectivamente.

Sabendo-se que $M(x_M, y_M)$ pertence ao gráfico de $y = f(x)$ e que $x_M$ é ponto médio de $\overline{PQ}$, então $y_M$ é igual a`,
    alternativas: ['−0,8.', '−1,1.', '−1.', '−0,9.', '−1,2.'],
    gabarito: 2,
    adaptacao: 'Sem a figura do gráfico; o texto já define P e Q.',
    passos: [
      { pergunta: t`Assíntota de $\log_2(x-1)$ e ponto onde o gráfico corta o eixo $x$:`, opcoes: [t`$x=1$ e $x=2$`, t`$x=0$ e $x=1$`, t`$x=2$ e $x=3$`], correta: 0,
        conta: t`x-1=1\ \Rightarrow\ x=2`, porque: 'O log zera quando o argumento é 1; o argumento nunca chega a 0.' },
      { pergunta: t`Ponto médio de $P(1,0)$ e $Q(2,0)$:`, opcoes: [t`$x_M=1{,}5$`, t`$x_M=3$`, t`$x_M=0{,}5$`], correta: 0 },
      { pergunta: t`$y_M=\log_2(1{,}5-1)$:`, opcoes: [t`$-1$`, t`$-0{,}5$`, '1'], correta: 0,
        conta: t`\log_2\tfrac12=-1`, porque: t`$2^{-1}=\frac12$.` },
    ],
  },
  {
    ...base, numero: 90, materia: 'Matemática', subtema: 'Progressão geométrica',
    enunciado: `Uma partícula desloca-se sobre os lados de um triângulo equilátero ABC, de lado 10 cm, partindo do vértice A no sentido horário. A intensidade da velocidade inicial dessa partícula, que é de 6 m/min, sempre dobra após a partícula percorrer um lado inteiro do triângulo e, durante o percurso de cada lado do triângulo, ela permanece constante.

Nessas condições, e desconsiderando os intervalos de tempo de aceleração dessa partícula, ela terá dado 10 voltas completas ao longo do perímetro do triângulo em, aproximadamente,`,
    alternativas: ['2 s.', '12 s.', '6 s.', '3 s.', '1 s.'],
    gabarito: 0,
    adaptacao: 'Sem a figura do triângulo.',
    passos: [
      { pergunta: 'Primeiro lado: 10 cm a 6 m/min. Quanto tempo?', opcoes: ['1 s', '10 s', '0,1 s'], correta: 0,
        conta: t`6\ \text{m/min}=0{,}1\ \text{m/s}\ \Rightarrow\ \frac{0{,}1\ \text{m}}{0{,}1\ \text{m/s}}=1\ \text{s}` },
      { pergunta: 'A velocidade dobra a cada lado. Os tempos ficam…', opcoes: ['1, ½, ¼, …', '1, 2, 4, …', 'sempre 1 s'], correta: 0,
        porque: 'Mesma distância com o dobro da velocidade: metade do tempo.' },
      { pergunta: '10 voltas são 30 lados. Tempo total:', opcoes: ['quase 2 s', '30 s', '1 s'], correta: 0,
        conta: t`1+\tfrac12+\tfrac14+\dots+\tfrac{1}{2^{29}}=2-\tfrac{1}{2^{29}}\approx2\ \text{s}`, porque: 'Cada parcela cobre metade do que falta até 2.' },
    ],
  },
];
