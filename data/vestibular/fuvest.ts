// Fuvest 2024 e 2025, 1ª fase. Texto e gabarito do banco BLUEX
// (portuguese-benchmark-datasets/BLUEX, transcrição das provas oficiais);
// cada gabarito conferido por resolução própria (a Q34 de 2024, por força bruta).
import type { QuestaoVestibular } from '@/lib/vestibular/tipos';

const t = String.raw;
const f24 = { banca: 'Fuvest', ano: 2024 } as const;
const f25 = { banca: 'Fuvest', ano: 2025 } as const;

export const FUVEST: QuestaoVestibular[] = [
  {
    ...f25, numero: 25, materia: 'Matemática', subtema: 'Escala',
    enunciado: `"Historiadores encontraram um mapa antigo onde não era possível identificar a escala do mapa. Com algum esforço e apoio de Geógrafos, foi possível avaliar a distância no mapa entre duas localidades como sendo de 20 centímetros. Buscando elementos na paisagem, foi possível quantificar a distância entre elas como equivalente a 40 quilômetros."
FITZ, Paulo Roberto. Cartografia Básica. São Paulo: Oficina de Textos, 2008 (Adaptado).

Com base nessas medidas, a escala numérica do mapa corresponde a`,
    alternativas: ['1:20.000.', '1:200.000.', '1:2.000.000.', '1:2.200.000.', '1:20.000.000.'],
    gabarito: 1,
    passos: [
      { pergunta: 'Mesma unidade primeiro: 40 km em centímetros é…', opcoes: ['4 000 000 cm', '40 000 cm', '400 000 cm'], correta: 0,
        conta: t`40\ \text{km}=40\,000\ \text{m}=4\,000\,000\ \text{cm}`, porque: '1 km = 1000 m e 1 m = 100 cm.' },
      { pergunta: 'Escala é mapa : real. Então…', opcoes: ['1 : 200 000', '1 : 2 000 000', '1 : 20 000'], correta: 0,
        conta: t`\frac{20}{4\,000\,000}=\frac{1}{200\,000}`, porque: 'Divide os dois por 20.' },
    ],
  },
  {
    ...f25, numero: 52, materia: 'Matemática', subtema: 'Funções trigonométricas',
    enunciado: t`As enchentes ocorridas no Rio Grande do Sul, em maio de 2024, prejudicaram a infraestrutura de comunicação. A população afetada era informada sobre as notícias relativas às enchentes ao sintonizar, por rádio de pilhas, frequências de onda AM, cujo alcance é maior.

Uma onda AM é modelada matematicamente por equações que envolvem a função cosseno, cuja variável independente é o tempo $t$, que aparece multiplicado pela frequência $f$ da onda.

Como exemplo, pode-se considerar a equação referente ao processo de modulação de uma onda AM:

$s(t) = A \left[1 + k\ m(t)\right] \cos(2\pi f t)$

em que $A$ é a amplitude, $f$ a frequência, $k$ a constante da sensibilidade à amplitude e $m(t)$ o sinal que contém a informação.

Quando a frequência $f$ é multiplicada por 3, o comprimento da onda sofre alteração. Por causa dessa multiplicação, qual transformação ocorre no gráfico da função cosseno original?`,
    alternativas: ['Expansão vertical.', 'Translação horizontal.', 'Expansão horizontal.', 'Contração horizontal.', 'Contração vertical.'],
    gabarito: 3,
    passos: [
      { pergunta: t`O período de $\cos(2\pi f t)$ é…`, opcoes: [t`$\frac1f$`, t`$f$`, t`$2\pi f$`], correta: 0,
        conta: t`T=\frac{1}{f}`, porque: t`Quando $t$ anda $\frac1f$, o ângulo anda $2\pi$: uma volta.` },
      { pergunta: t`Com $3f$, o período vira…`, opcoes: ['um terço', 'o triplo', 'o mesmo'], correta: 0,
        conta: t`T'=\frac{1}{3f}=\frac{T}{3}`, porque: 'A onda se repete três vezes mais rápido.' },
      { pergunta: 'Gráfico que se repete em um terço do tempo foi…', opcoes: ['contraído na horizontal', 'esticado na vertical', 'deslocado para o lado'], correta: 0,
        conta: t`\cos(2\pi\cdot3f\,t)`, porque: 'A altura não muda; só o eixo do tempo aperta.' },
    ],
  },
  {
    ...f25, numero: 61, materia: 'Física', subtema: 'Queda livre',
    enunciado: `Os versos a seguir pertencem à canção Fall on Me, da banda norte-americana R.E.M., lançada em 1986.

"There's a problem, feathers, iron
Bargain buildings, weights and pulleys
Feathers hit the ground before the weight can leave the air"
Bill Berry, Peter Buck, Mike Mills e Michael Stipe.

A qual episódio (real ou hipotético) da história da física o trecho da música faz alusão?`,
    alternativas: [
      'À queda de uma maçã, que teria inspirado Newton à descoberta da gravitação universal.',
      'À observação de um pássaro em voo, que teria levado Einstein a formular a teoria da relatividade.',
      'Aos experimentos com objetos de massas diferentes, que teriam indicado a Galileu os princípios da queda livre.',
      'Ao transbordamento da água em uma banheira, que teria sugerido a Arquimedes o conceito de empuxo.',
      'À queda de um bloco de ferro ligado a uma hélice, que teria levado Joule à equivalência entre calor e energia.',
    ],
    gabarito: 2,
    passos: [
      { pergunta: 'De que falam "feathers" (penas) e "weight" (peso) caindo?', opcoes: ['queda de corpos de massas diferentes', 'órbita dos planetas', 'calor e trabalho'], correta: 0,
        porque: 'Um objeto leve e um pesado chegando ao chão.' },
      { pergunta: 'Quem estudou a queda de objetos de massas diferentes?', opcoes: ['Galileu', 'Arquimedes', 'Joule'], correta: 0,
        conta: t`h=\tfrac12\,g\,t^2\quad(\text{não depende da massa})`, porque: 'Sem ar, leve e pesado caem juntos. É a história da Torre de Pisa.' },
    ],
  },
  {
    ...f25, numero: 64, materia: 'Química', subtema: 'Estequiometria',
    enunciado: t`Alguns motores de foguetes espaciais usam metano como combustível e oxigênio como comburente. Ambos os compostos são armazenados em estado líquido no próprio foguete, o que permite o seu armazenamento em maior quantidade do que se estivessem no estado gasoso. Sabe-se que o foguete armazena um volume de oxigênio líquido 1,5 vez maior do que de metano líquido e que ambos são completamente consumidos na combustão, conforme a equação $\mathrm{CH_4(l) + 2\,O_2(l) \rightarrow CO_2(g) + 2\,H_2O(g)}$.

Note e adote: Massa molar (g/mol): H = 1; C = 12; O = 16

Nessas condições, é correto afirmar que a razão entre a densidade do metano líquido e a densidade do oxigênio líquido é igual a`,
    alternativas: ['0,186.', '0,375.', '0,75.', '1,5.', '3.'],
    gabarito: 1,
    passos: [
      { pergunta: t`Pela equação, para cada mol de $\mathrm{CH_4}$ vão…`, opcoes: [t`2 mol de $\mathrm{O_2}$`, t`1 mol de $\mathrm{O_2}$`, '4 mol'], correta: 0,
        conta: t`\mathrm{CH_4}+2\,\mathrm{O_2}\rightarrow\mathrm{CO_2}+2\,\mathrm{H_2O}`, porque: 'É o coeficiente da equação.' },
      { pergunta: t`Massas: $n$ mol de metano e $2n$ de oxigênio pesam…`, opcoes: [t`$16n$ e $64n$ gramas`, t`$16n$ e $32n$`, t`$12n$ e $16n$`], correta: 0,
        conta: t`M(\mathrm{CH_4})=12+4=16,\qquad 2n\cdot M(\mathrm{O_2})=2n\cdot32=64n`, porque: 'Massa = mols × massa molar.' },
      { pergunta: t`Volumes $V$ e $1{,}5V$. Razão das densidades:`, opcoes: ['0,375', '0,25', '1,5'], correta: 0,
        conta: t`\frac{16n/V}{64n/1{,}5V}=\frac{16\cdot1{,}5}{64}=0{,}375`, porque: 'Densidade = massa ÷ volume.' },
    ],
  },
  {
    ...f25, numero: 70, materia: 'Matemática', subtema: 'Progressões',
    enunciado: t`Seja $(a_n)$ uma progressão aritmética cujo primeiro termo é $a_1$ e a razão $r$, ambos números reais. É possível construir uma outra sequência $(b_n)$, em que o primeiro termo é um número real $b_1$ e com a seguinte lei de formação

$b_{n+1} = b_n + a_n$,

sendo $n > 0$ um número natural. Por exemplo, se $b_1 = 0$ e $(a_n) = (1,3,5,7,9,11,\dots)$ tem-se $(b_n) = (0,1,4,9,16,25,\dots)$.

Com base em tais informações, os valores de $a_1$ e $r$ foram escolhidos de forma que $(b_n)$ também seja uma progressão aritmética de razão $r'$. Nessas condições, é correto afirmar:`,
    alternativas: [t`$r' = a_1$`, t`$r' = 2a_1$`, t`$r' = r$`, t`$r' = 2r$`, t`$r' = b_1 - a_1$`],
    gabarito: 0,
    passos: [
      { pergunta: t`Pela lei de formação, $b_{n+1}-b_n$ é…`, opcoes: [t`$a_n$`, t`$r$`, t`$b_1$`], correta: 0,
        conta: t`b_{n+1}-b_n=a_n`, porque: 'É a própria lei.' },
      { pergunta: t`Para $(b_n)$ ser PA, essa diferença tem de ser…`, opcoes: [t`sempre a mesma: então $a_n$ não muda e $r=0$`, 'crescente', 'zero'], correta: 0,
        conta: t`a_n=a_1+(n-1)\,r\ \text{constante}\ \Rightarrow\ r=0`, porque: 'PA tem diferença fixa.' },
      { pergunta: t`Então $r'$ vale…`, opcoes: [t`$a_1$`, t`$2a_1$`, t`$r$`], correta: 0,
        conta: t`r'=b_{n+1}-b_n=a_n=a_1`, porque: t`Com $r=0$, todo $a_n$ é igual a $a_1$.` },
    ],
  },
  {
    ...f25, numero: 76, materia: 'Matemática', subtema: 'Cilindros',
    enunciado: t`Considere um cilindro $C$ de altura $h > 0$ e cujo raio das circunferências, do topo e da base, é $r > 0$; um cilindro $C_1$ cujo raio é igual ao de $C$ e altura igual a $h/2$ e um cilindro $C_2$ com altura $h$ e raio igual a $r/2$.

Sendo $V$, $V_1$ e $V_2$ os volumes e $A$, $A_1$ e $A_2$ as áreas laterais dos cilindros $C$, $C_1$ e $C_2$, respectivamente, é correto afirmar:`,
    alternativas: [t`$V = V_1 + V_2$ e $A = A_1 + A_2$`, t`$V = V_1 + V_2$ e $A = A_1 + 2A_2$`, t`$V = V_1 + 2V_2$ e $A = A_1 + 2A_2$`, t`$V = V_1 + 2V_2$ e $A = A_1 + A_2$`, t`$V = 2V + 2V_2$ e $A = 2A_1 + 2A_2$`],
    gabarito: 3,
    passos: [
      { pergunta: t`Volumes ($V=\pi r^2h$):`, opcoes: [t`$V_1=\frac V2$ e $V_2=\frac V4$`, t`$V_1=V_2=\frac V2$`, t`$V_1=\frac V4$ e $V_2=\frac V2$`], correta: 0,
        conta: t`V_1=\pi r^2\cdot\tfrac h2,\qquad V_2=\pi\big(\tfrac r2\big)^2h=\tfrac{\pi r^2h}{4}`, porque: 'Raio pela metade divide a área da base por 4.' },
      { pergunta: t`Então $V$ é igual a…`, opcoes: [t`$V_1+2V_2$`, t`$V_1+V_2$`, t`$2V_1+2V_2$`], correta: 0,
        conta: t`\tfrac V2+2\cdot\tfrac V4=V` },
      { pergunta: t`Áreas laterais ($A=2\pi rh$):`, opcoes: [t`$A_1=A_2=\frac A2$, então $A=A_1+A_2$`, t`$A_2=\frac A4$`, t`$A_1=A$`], correta: 0,
        conta: t`A_1=2\pi r\cdot\tfrac h2=\pi rh,\qquad A_2=2\pi\cdot\tfrac r2\cdot h=\pi rh`, porque: 'Área lateral cresce junto com o raio, não com o quadrado dele.' },
    ],
  },
  {
    ...f25, numero: 77, materia: 'Matemática', subtema: 'Circunferência',
    enunciado: t`Em relação ao plano cartesiano $Oxy$, é correto afirmar que as equações $x^2 + y^2 - 4x = -3$ e $x^2 + y^2 - 4y = -3$ representam`,
    alternativas: [
      'duas circunferências com raios de mesma medida e que se interceptam em dois pontos.',
      'duas circunferências com raios de medidas diferentes e que se interceptam em dois pontos.',
      'duas circunferências que se interceptam em um único ponto.',
      'duas circunferências concêntricas e que não se interceptam.',
      'duas circunferências com centros distintos e que não se interceptam.',
    ],
    gabarito: 4,
    passos: [
      { pergunta: t`Completando o quadrado em $x^2+y^2-4x=-3$:`, opcoes: [t`$(x-2)^2+y^2=1$`, t`$(x+2)^2+y^2=7$`, t`$x^2+y^2=1$`], correta: 0,
        conta: t`x^2-4x+4+y^2=-3+4`, porque: 'Centro (2, 0), raio 1.' },
      { pergunta: 'E a outra:', opcoes: [t`$x^2+(y-2)^2=1$`, t`$(x-2)^2+(y-2)^2=1$`, t`$x^2+y^2=3$`], correta: 0,
        conta: t`x^2+y^2-4y+4=-3+4`, porque: 'Centro (0, 2), raio 1.' },
      { pergunta: 'Distância entre os centros, comparada com 1 + 1 = 2:', opcoes: [t`$2\sqrt2\approx2{,}83>2$: não se tocam`, '2: se tocam num ponto', '1: se cortam'], correta: 0,
        conta: t`d=\sqrt{2^2+2^2}=2\sqrt2`, porque: 'Centros diferentes e longe demais para os círculos se encontrarem.' },
    ],
  },
  {
    ...f24, numero: 24, materia: 'Física', subtema: 'Física moderna',
    enunciado: t`"Os experimentos de difração e interferência da luz realizados no período de 1800 a 1803, em analogia com os processos de interferência das ondas acústicas, corroboraram a natureza ondulatória da luz. Por outro lado, Einstein introduziu, em 1905, o conceito de fóton, em que cada componente monocromática de frequência $f$ da radiação seria equivalente a um sistema de partículas idênticas sem massa, cada qual com energia $hf$, sendo $h \simeq 6{,}626\times10^{-34}$ J.s a constante de Planck. A hipótese da existência de fótons só teve ampla aceitação após os experimentos de Compton, em 1922, sobre o espalhamento da radiação eletromagnética na faixa dos raios X por alvos de elementos leves, como o grafite."
Adaptado de F. Caruso e V. Oguri, Sobre a necessidade do conceito de fóton, RBEF 43, e20210011 (2021).

De acordo com o texto e seus conhecimentos, é correto afirmar:`,
    alternativas: [
      'A radiação eletromagnética apresenta somente comportamento ondulatório.',
      'Os experimentos de Compton mostraram que feixes de raios X exibem comportamento corpuscular.',
      'A energia de um fóton independe de seu comprimento de onda.',
      'A hipótese da natureza corpuscular da radiação está em desacordo com os resultados experimentais.',
      'Einstein demonstrou que os experimentos de difração e interferência da luz deveriam estar incorretos.',
    ],
    gabarito: 1,
    passos: [
      { pergunta: 'Segundo o texto, os experimentos de Compton…', opcoes: ['fizeram a ideia de fóton ser aceita', 'provaram que a luz é só onda', 'mostraram que Einstein errou'], correta: 0,
        porque: '"A hipótese da existência de fótons só teve ampla aceitação após os experimentos de Compton."' },
      { pergunta: 'Fóton é um comportamento de…', opcoes: ['partícula (corpuscular)', 'onda', 'nenhum dos dois'], correta: 0,
        porque: 'Os raios X de Compton batem nos elétrons como bolinhas: comportamento corpuscular.' },
      { pergunta: 'E a energia do fóton depende do comprimento de onda?', opcoes: ['Sim', 'Não', 'Só no vácuo'], correta: 0,
        conta: t`E=hf=\frac{hc}{\lambda}`, porque: 'Por isso a alternativa (c) é falsa. A luz tem os dois comportamentos.' },
    ],
  },
  {
    ...f24, numero: 33, materia: 'Matemática', subtema: 'Porcentagem',
    enunciado: `Uma empresa farmacêutica produz certo medicamento, o qual é formado por quatro componentes, conforme indicado na tabela I. O custo do grama de cada um dos componentes desse medicamento também é apresentado nessa tabela.

Tabela I (composição do medicamento: quantidade, em mg; custo, em R$/g)
Componente A: 200 mg; R$ 700/g
Componente B: 70 mg; R$ 500/g
Componente C: 130 mg; R$ 300/g
Componente D: 100 mg; R$ 120/g

Para a produção do próximo lote do medicamento, a empresa terá um gasto diferente para fabricá-lo, pois os custos de alguns componentes sofreram alterações, conforme mostra a tabela II.

Tabela II (variação no custo)
Componente A: +7%
Componente B: −5%
Componente C: 0%
Componente D: +10%

Note e adote: Considere que os outros custos de produção permaneceram inalterados.

Qual é o aumento, em reais, no custo do medicamento?`,
    alternativas: ['9,25', '12,00', '12,75', '36,00', '86,00'],
    gabarito: 0,
    adaptacao: 'Tabelas reescritas em linhas, com os mesmos números.',
    passos: [
      { pergunta: 'Quanto custa o componente A num medicamento?', opcoes: ['R$ 140,00', 'R$ 1 400,00', 'R$ 14,00'], correta: 0,
        conta: t`200\ \text{mg}=0{,}2\ \text{g}\ \Rightarrow\ 0{,}2\cdot700=140`, porque: 'O preço é por grama.' },
      { pergunta: 'Os outros: B custa 0,07 × 500 = 35 e D custa 0,1 × 120 = 12. Quanto muda cada um?', opcoes: ['+9,80, −1,75 e +1,20', '+7, −5 e +10', 'só +9,80'], correta: 0,
        conta: t`0{,}07\cdot140=9{,}8\qquad -0{,}05\cdot35=-1{,}75\qquad 0{,}1\cdot12=1{,}2`, porque: 'C não mudou.' },
      { pergunta: 'Aumento total:', opcoes: ['R$ 9,25', 'R$ 12,75', 'R$ 12,00'], correta: 0,
        conta: t`9{,}8-1{,}75+1{,}2=9{,}25` },
    ],
  },
  {
    ...f24, numero: 34, materia: 'Matemática', subtema: 'Estatística',
    enunciado: `Os conceitos de moda, mediana, média e amplitude definem medidas utilizadas para estudar um conjunto de informações numéricas. Por exemplo, na lista de 5 números (2, 2, 4, 8, 14), temos que a moda é igual a 2, a mediana é igual a 4, a média é igual 6 e a amplitude é igual a 12.

Assinale a alternativa que representa a quantidade de listas de 5 números inteiros positivos que cumprem a condição: moda = mediana = média = amplitude = 23.`,
    alternativas: ['8', '9', '11', '22', '44'],
    gabarito: 0,
    passos: [
      { pergunta: t`Em ordem, $a\le b\le c\le d\le e$. Mediana 23 e média 23 dão…`, opcoes: [t`$c=23$ e soma 115`, t`$c=23$ e soma 23`, t`$e=23$`], correta: 0,
        conta: t`a+b+23+d+e=5\cdot23=115` },
      { pergunta: 'Amplitude 23 quer dizer…', opcoes: [t`$e=a+23$`, t`$e=23$`, t`$a=23$`], correta: 0,
        conta: t`a+b+d+(a+23)=92\ \Rightarrow\ 2a+b+d=69` },
      { pergunta: t`Moda 23: o 23 tem de aparecer de novo. Com $d=23$, quantas listas?`, opcoes: [t`4 ($a$ de 12 a 15)`, '1', 'nenhuma'], correta: 0,
        conta: t`2a+b=46,\quad a\le b<23\ \Rightarrow\ 12\le a\le15`, porque: 'Ex.: (12, 22, 23, 23, 35).' },
      { pergunta: t`E com $b=23$ (e $d>23$)?`, opcoes: [t`mais 4 ($a$ de 8 a 11): total 8`, 'nenhuma: total 4', 'mais 5: total 9'], correta: 0,
        conta: t`2a+d=46,\quad 23<d\le a+23\ \Rightarrow\ 8\le a\le11`, porque: 'Ex.: (8, 23, 23, 30, 31): soma 115, amplitude 23.' },
    ],
  },
];
