// ITA 2025, 1ª fase (prova de 06/10/2024). Gabarito oficial:
// https://www.vestibular.ita.br/provas/gabarito_2025.pdf
import type { QuestaoVestibular } from '@/lib/vestibular/tipos';

const t = String.raw;
const base = { banca: 'ITA', ano: 2025 } as const;

export const ITA_2025: QuestaoVestibular[] = [
  {
    ...base, numero: 1, materia: 'Matemática', subtema: 'Números complexos',
    enunciado: t`Seja $z = a + 2i$ um número complexo, em que $a \in \mathbb{R}$ é positivo. O valor de $a$ para que as representações de $1$, $z$ e $z^2$ no plano de Argand-Gauss formem um triângulo de área 200 é`,
    alternativas: ['14.', '15.', '16.', '17.', '18.'],
    gabarito: 1,
    passos: [
      { pergunta: t`Primeiro: onde fica $z^2$?`, opcoes: [t`$a^2-4+4ai$`, t`$a^2+4+4ai$`, t`$a^2+4i$`], correta: 0,
        conta: t`z^2=(a+2i)^2=a^2+4ai+4i^2=a^2-4+4ai`, porque: t`$i^2=-1$ vira o $-4$.` },
      { pergunta: t`Os pontos são $(1,0)$, $(a,2)$ e $(a^2-4,\,4a)$. Saindo do ponto $1$, os dois lados são…`, opcoes: [t`$(a-1,\,2)$ e $(a^2-5,\,4a)$`, t`$(a,\,2)$ e $(a^2,\,4a)$`, t`$(1,\,2)$ e $(1,\,4a)$`], correta: 0,
        conta: t`\vec u=z-1=(a-1,\ 2),\quad \vec v=z^2-1=(a^2-5,\ 4a)`, porque: t`Lado é ponta menos começo.` },
      { pergunta: t`A área é metade do "produto cruzado" dos dois lados. Quanto dá?`, opcoes: [t`$a^2-2a+5$`, t`$2a^2+10$`, t`$a^2+5$`], correta: 0,
        conta: t`\tfrac12\,\big|(a-1)\cdot4a-2\,(a^2-5)\big|=\tfrac12\,(2a^2-4a+10)=a^2-2a+5`, porque: t`O produto cruzado de $(p,q)$ e $(r,s)$ é $ps-qr$.` },
      { pergunta: t`Área 200: qual é $a$?`, opcoes: ['15', '17', '14'], correta: 0,
        conta: t`a^2-2a-195=0\ \Rightarrow\ (a-15)(a+13)=0\ \Rightarrow\ a=15`, porque: t`$a$ é positivo, então fica o 15.` },
    ],
  },
  {
    ...base, numero: 3, materia: 'Matemática', subtema: 'Binômio de Newton',
    enunciado: t`O termo independente da expansão de $\left(x+\dfrac{1}{x}\right)^{6}\left(x-\dfrac{2}{x}\right)^{5}$ é`,
    alternativas: [t`$-18$.`, t`$-12$.`, '0.', '12.', '18.'],
    gabarito: 2,
    passos: [
      { pergunta: t`Em $\left(x+\frac1x\right)^6$, cada termo tem $x$ elevado a…`, opcoes: ['um número par: 6, 4, 2, 0, −2…', 'qualquer inteiro', 'só 6'], correta: 0,
        conta: t`x^{6-i}\cdot\Big(\tfrac1x\Big)^{i}=x^{6-2i}`, porque: t`Cada $\frac1x$ que entra no lugar de um $x$ tira 2 do expoente.` },
      { pergunta: t`E em $\left(x-\frac2x\right)^5$?`, opcoes: ['um número ímpar: 5, 3, 1, −1…', 'um número par', 'sempre 0'], correta: 0,
        conta: t`x^{5-2j}`, porque: 'Mesma ideia, começando do 5.' },
      { pergunta: t`Multiplicando, o expoente é par + ímpar. Pode dar 0?`, opcoes: ['Não: dá sempre ímpar', t`Sim, quando $i=j$`, t`Só se $x=1$`], correta: 0,
        conta: t`(6-2i)+(5-2j)=11-2(i+j)\neq0`, porque: 'Nenhum termo fica sem x: o termo independente é 0.' },
    ],
  },
  {
    ...base, numero: 4, materia: 'Matemática', subtema: 'Funções',
    enunciado: t`Sejam $f(x)$ e $g(x)$ funções reais definidas para todo $x \in \mathbb{R}$. Se para todo $x > 0$ vale a igualdade $g(x^2) = f(2x^2 - x + 1)$, podemos afirmar que`,
    alternativas: [t`$f$ não é sobrejetora.`, t`$f$ não é injetora.`, t`$g$ não é sobrejetora.`, t`$g$ não é injetora.`, t`$f(a) \neq g(a)$ para todo $a > 0$.`],
    gabarito: 3,
    passos: [
      { pergunta: t`Olhe $h(x)=2x^2-x+1$ para $x>0$. Essa parábola…`, opcoes: [t`desce até $x=\frac14$ e depois sobe`, 'só sobe', 'só desce'], correta: 0,
        conta: t`x_v=-\tfrac{b}{2a}=\tfrac14`, porque: 'O vértice cai do lado positivo.' },
      { pergunta: t`Então existem dois $x$ positivos diferentes com…`, opcoes: [t`o mesmo valor de $h$`, t`o mesmo $x^2$`, t`$h=0$`], correta: 0,
        conta: t`h(0{,}1)=h(0{,}4)=0{,}92`, porque: t`Pontos simétricos em volta de $\frac14$ têm a mesma altura.` },
      { pergunta: t`O que isso diz sobre $g$?`, opcoes: [t`$g$ dá o mesmo valor em $0{,}01$ e $0{,}16$: não é injetora`, t`$f$ não é injetora`, 'nada'], correta: 0,
        conta: t`g(0{,}01)=f(0{,}92)=g(0{,}16)`, porque: t`Entradas diferentes de $g$ com a mesma saída.` },
    ],
  },
  {
    ...base, numero: 5, materia: 'Matemática', subtema: 'Sequências (PA e PG)',
    enunciado: t`Sejam $(a_n)_{n\in\mathbb{N}}$ e $(b_n)_{n\in\mathbb{N}}$ duas sequências numéricas tais que $S_n=\sum_{k=1}^{n}a_k=b_{n+1}-b_1$ para todo $n\in\mathbb{N}$. Considere as afirmações abaixo:

I. Se $(b_n)_{n\in\mathbb{N}}$ é uma PG, então $(a_n)_{n\in\mathbb{N}}$ também é PG.
II. Se $(a_n)_{n\in\mathbb{N}}$ é uma PG, então $(b_n)_{n\in\mathbb{N}}$ também é PG.
III. Se $(a_n)_{n\in\mathbb{N}}$ é uma PA, então $(S_n)_{n\in\mathbb{N}}$ também é PA.

Está(ão) correta(s):`,
    alternativas: ['I e II.', 'II e III.', 'I e III.', 'apenas I.', 'nenhuma.'],
    gabarito: 3,
    passos: [
      { pergunta: t`Tirando $S_{n-1}$ de $S_n$, quem é $a_n$?`, opcoes: [t`$b_{n+1}-b_n$`, t`$b_n$`, t`$b_{n+1}+b_n$`], correta: 0,
        conta: t`a_n=S_n-S_{n-1}=b_{n+1}-b_n`, porque: t`O $b_1$ cancela.` },
      { pergunta: t`Se $b_n=b_1q^{n-1}$ (PG), então $a_n$ é…`, opcoes: [t`$b_1(q-1)\,q^{n-1}$: PG de razão $q$`, 'uma PA', 'sempre constante'], correta: 0,
        conta: t`a_n=b_1q^{n}-b_1q^{n-1}=b_1(q-1)\,q^{n-1}`, porque: t`Cada termo é o anterior vezes $q$: I está certa.` },
      { pergunta: t`Teste II com $a_n=1$ (é PG) e $b_1=1$. A sequência $b_n$ fica…`, opcoes: ['1, 2, 3, 4…: não é PG', '1, 1, 1…: PG', '1, 2, 4, 8…: PG'], correta: 0,
        conta: t`b_{n+1}=b_1+S_n=1+n`, porque: t`As razões $2,\ \frac32,\ \frac43$ mudam: II é falsa.` },
      { pergunta: t`Teste III com $a_n=n$ (é PA). $S_n$ fica…`, opcoes: ['1, 3, 6, 10…: não é PA', '1, 2, 3…: PA', '2, 4, 6…: PA'], correta: 0,
        conta: t`S_n=\tfrac{n(n+1)}{2}`, porque: 'As diferenças 2, 3, 4 mudam: III é falsa. Só I.' },
    ],
  },
  {
    ...base, numero: 6, materia: 'Matemática', subtema: 'Equação exponencial',
    enunciado: t`O conjunto de todos os valores $a\in\mathbb{R}$ para os quais a equação $9^x-(3a+4)\,3^x+2a^2+9a-5=0$ tem duas soluções reais distintas é`,
    alternativas: [t`$(6;\ \infty)$.`, t`$\left(\frac12;\ \infty\right)\setminus\{6\}$.`, t`$\left(\frac32;\ \infty\right)\setminus\{6\}$.`, t`$\mathbb{R}\setminus\{6\}$.`, t`$\mathbb{R}$.`],
    gabarito: 1,
    passos: [
      { pergunta: t`Troque $3^x$ por $t$. A equação vira…`, opcoes: [t`$t^2-(3a+4)\,t+2a^2+9a-5=0$, com $t>0$`, t`$t-(3a+4)\,t=0$`, t`$t^2=9$`], correta: 0,
        conta: t`9^x=(3^x)^2=t^2`, porque: t`E $t=3^x$ é sempre positivo.` },
      { pergunta: t`Quais as raízes em $t$?`, opcoes: [t`$2a-1$ e $a+5$`, t`$a$ e $3$`, t`$6$ e $6$`], correta: 0,
        conta: t`\big(t-(2a-1)\big)\big(t-(a+5)\big)=0`, porque: t`Soma $3a+4$ e produto $(2a-1)(a+5)=2a^2+9a-5$.` },
      { pergunta: t`Para dar dois $x$ diferentes, as duas raízes precisam ser…`, opcoes: [t`positivas e diferentes: $a>\frac12$ e $a\neq6$`, 'só diferentes', 'só positivas'], correta: 0,
        conta: t`2a-1>0,\quad a+5>0,\quad 2a-1\neq a+5`, porque: t`Cada $t>0$ dá um $x$. Com $a=6$ as duas viram 11 e sobra um $x$ só.` },
    ],
  },
  {
    ...base, numero: 7, materia: 'Matemática', subtema: 'Sistemas lineares',
    enunciado: t`Sejam $m$, $n$ e $k$ números reais. Considere os sistemas abaixo:

$\text{I}:\ \begin{cases}x+y+z=1\\x+2y-z=2\\2x+y+4z=1\end{cases}\qquad \text{II}:\ \begin{cases}x+y+z=1\\x+my+nz=5\\kx+y-z=3m+2n\end{cases}$

Sabendo-se que os dois sistemas são equivalentes (isto é, possuem o mesmo conjunto solução), o valor de $k$ é`,
    alternativas: [t`$\frac13$.`, t`$\frac12$.`, '1.', '2.', '3.'],
    gabarito: 0,
    passos: [
      { pergunta: t`No sistema I, faça (2ª − 1ª) e (3ª − 2×1ª). Sobra…`, opcoes: [t`a mesma equação duas vezes: $y-2z=1$`, t`$z=0$`, 'um absurdo'], correta: 0,
        conta: t`y-2z=1,\qquad -y+2z=-1`, porque: 'Uma é a outra vezes −1: infinitas soluções.' },
      { pergunta: t`Escrevendo tudo em função de $z$, as soluções são…`, opcoes: [t`$(-3z,\ 1+2z,\ z)$`, t`$(z,\ z,\ z)$`, t`só $(1,0,0)$`], correta: 0,
        conta: t`y=1+2z,\quad x=1-y-z=-3z`, porque: 'Uma reta de soluções.' },
      { pergunta: t`Elas precisam satisfazer $x+my+nz=5$ para todo $z$. Então…`, opcoes: [t`$m=5$ e $n=-7$`, t`$m=n=5$`, t`$m=1$`], correta: 0,
        conta: t`-3z+m+2mz+nz=5\ \Rightarrow\ m=5,\ \ 2m+n-3=0`, porque: t`O que não tem $z$ dá 5; o que multiplica $z$ tem de dar 0.` },
      { pergunta: t`Agora a 3ª: $kx+y-z=3m+2n=1$.`, opcoes: [t`$k=\frac13$`, t`$k=1$`, t`$k=3$`], correta: 0,
        conta: t`-3kz+1+2z-z=1\ \Rightarrow\ z\,(1-3k)=0`, porque: t`Vale para todo $z$ só se $1-3k=0$.` },
    ],
  },
  {
    ...base, numero: 10, materia: 'Matemática', subtema: 'Polinômios',
    enunciado: t`Uma raiz comum aos polinômios $p(x)=x^5-x^3+12x-18$ e $q(x)=x^4-x^3+5x-3$ é`,
    alternativas: [t`$-1+\sqrt2\,i$.`, t`$\sqrt2+\sqrt2\,i$.`, t`$\sqrt2+i$.`, t`$1+\sqrt2\,i$.`, t`$-\sqrt2+i$.`],
    gabarito: 3,
    passos: [
      { pergunta: t`Uma raiz comum de $p$ e $q$ também é raiz de…`, opcoes: [t`qualquer combinação deles, como $p-x\,q$`, t`só de $p\cdot q$`, 'nenhum outro polinômio'], correta: 0,
        conta: t`p-x\,q=x^4-x^3-5x^2+15x-18`, porque: 'Se os dois zeram, a combinação também zera.' },
      { pergunta: t`Tire $q$ disso. O que sobra?`, opcoes: [t`$-5(x^2-2x+3)$`, t`$x^2+1$`, t`$0$`], correta: 0,
        conta: t`(p-xq)-q=-5x^2+10x-15=-5\,(x^2-2x+3)`, porque: 'Os graus altos somem e sobra grau 2.' },
      { pergunta: t`Raízes de $x^2-2x+3=0$:`, opcoes: [t`$1\pm\sqrt2\,i$`, t`$-1\pm\sqrt2\,i$`, t`$1\pm\sqrt3$`], correta: 0,
        conta: t`x=\frac{2\pm\sqrt{4-12}}{2}=1\pm\sqrt2\,i`, porque: t`$\sqrt{-8}=2\sqrt2\,i$. E de fato $q=(x^2-2x+3)(x^2+x-1)$.` },
    ],
  },
  {
    ...base, numero: 11, materia: 'Matemática', subtema: 'Cônicas',
    enunciado: t`Seja $H$ uma hipérbole no plano cartesiano cujos focos são comuns aos focos da elipse $E:\ \dfrac{x^2}{4}+y^2=1$. Seja $P$ um ponto de intersecção de $E$ e $H$ no primeiro quadrante e $O$ a origem do sistema cartesiano. Sabendo que $\overline{OP}$ forma um ângulo $\theta$ com o eixo horizontal $Ox$, com $\tan(\theta)=\dfrac{\sqrt3}{6}$, a excentricidade de $H$ é`,
    alternativas: [t`$\frac{2\sqrt3}{3}$.`, t`$\frac{\sqrt6}{2}$.`, t`$\frac{3\sqrt3}{4}$.`, t`$\frac{2\sqrt6}{3}$.`, t`$\frac{3\sqrt3}{2}$.`],
    gabarito: 0,
    passos: [
      { pergunta: t`Focos da elipse ($a=2$, $b=1$):`, opcoes: [t`$(\pm\sqrt3,\ 0)$`, t`$(\pm2,\ 0)$`, t`$(0,\ \pm1)$`], correta: 0,
        conta: t`c^2=a^2-b^2=4-1=3`, porque: t`Na elipse, $c^2=a^2-b^2$.` },
      { pergunta: t`$P$ está na reta $y=\frac{\sqrt3}{6}x$ e na elipse. Então $P$ é…`, opcoes: [t`$\left(\sqrt3,\ \frac12\right)$`, t`$(1,\ 1)$`, t`$(2,\ 0)$`], correta: 0,
        conta: t`\frac{x^2}{4}+\frac{x^2}{12}=1\ \Rightarrow\ x^2=3`, porque: t`$y^2=\frac{3x^2}{36}=\frac{x^2}{12}$.` },
      { pergunta: t`Na hipérbole, $|PF_1-PF_2|=2a_H$. As distâncias são…`, opcoes: [t`$\frac72$ e $\frac12$, então $a_H=\frac32$`, t`$2$ e $2$`, t`$3$ e $1$`], correta: 0,
        conta: t`PF_1=\sqrt{(2\sqrt3)^2+\tfrac14}=\tfrac72,\qquad PF_2=\tfrac12`, porque: t`$F_2=(\sqrt3,0)$ fica logo abaixo de $P$.` },
      { pergunta: t`Excentricidade $e=\frac{c}{a_H}$:`, opcoes: [t`$\frac{2\sqrt3}{3}$`, t`$\frac{\sqrt3}{2}$`, '2'], correta: 0,
        conta: t`e=\frac{\sqrt3}{3/2}=\frac{2\sqrt3}{3}\approx1{,}15`, porque: 'Hipérbole tem e > 1: confere.' },
    ],
  },
  {
    ...base, numero: 12, materia: 'Matemática', subtema: 'Divisores',
    enunciado: t`Um número $m\in\mathbb{N}$, ao ser multiplicado por 16, resulta em um número com 231 divisores inteiros positivos. Considere as afirmações:

I. $m$ é um número par.
II. $m$ é um quadrado perfeito.
III. $16m$ tem 3 fatores primos distintos.

É(São) VERDADEIRA(S):`,
    alternativas: ['apenas I.', 'apenas II.', 'I e II.', 'I e III.', 'II e III.'],
    gabarito: 2,
    passos: [
      { pergunta: t`Se $16m=2^{\alpha}\,p^{\beta}\cdots$, o número de divisores é…`, opcoes: [t`$(\alpha+1)(\beta+1)\cdots$`, t`$\alpha\cdot\beta\cdots$`, t`$\alpha+\beta+\cdots$`], correta: 0,
        conta: t`231=3\cdot7\cdot11`, porque: 'Cada expoente pode ir de 0 até ele mesmo.' },
      { pergunta: t`Todo divisor de 231 é ímpar. Então os expoentes de $16m$ são…`, opcoes: ['todos pares', 'todos ímpares', 'quaisquer'], correta: 0,
        conta: t`\alpha+1\ \text{ímpar}\ \Rightarrow\ \alpha\ \text{par}`, porque: 'Expoente mais 1 ímpar quer dizer expoente par.' },
      { pergunta: t`Como $16=2^4$ e o expoente do 2 é par e maior que 4…`, opcoes: [t`$m$ é par e quadrado perfeito (I e II)`, t`$m$ é ímpar`, t`$16m$ sempre tem 3 primos`], correta: 0,
        conta: t`16m=2^{6}\cdot3^{2}\cdot5^{10}\quad\text{ou}\quad 16m=2^{20}\cdot3^{10}`, porque: 'Os dois têm 231 divisores; o segundo tem só 2 primos, então III nem sempre vale.' },
    ],
  },
  {
    ...base, numero: 13, materia: 'Física', subtema: 'Cinemática',
    enunciado: t`Considere uma partícula cuja posição é dada pela função horária $x(t)=\sqrt{D^2+(Vt-D)^2}$, em que $V$ e $D$ são constantes positivas, com unidades adequadas. Seja $\bar v(t)$ a velocidade média do móvel entre o instante inicial $t_0=0$ s e um instante arbitrário $t$. Assinale a alternativa que contém a distância percorrida pela partícula desde o início do movimento até o instante no qual $\bar v(t)=0$ m/s.`,
    alternativas: [t`$(\sqrt2-1)D$`, t`$2(\sqrt2-1)D$`, t`$\sqrt2\,D$`, t`$2D$`, t`$2\sqrt2\,D$`],
    gabarito: 1,
    passos: [
      { pergunta: 'Velocidade média zero quer dizer…', opcoes: ['voltou à posição inicial', 'parou', t`andou $D$`], correta: 0,
        conta: t`x(0)=\sqrt{D^2+D^2}=\sqrt2\,D`, porque: 'Média é deslocamento dividido pelo tempo.' },
      { pergunta: t`Quando $x(t)$ volta a ser $\sqrt2\,D$?`, opcoes: [t`$Vt=2D$`, t`$Vt=D$`, 'nunca'], correta: 0,
        conta: t`(Vt-D)^2=D^2\ \Rightarrow\ Vt=2D`, porque: t`$Vt-D=\pm D$, e $Vt=0$ é o começo.` },
      { pergunta: t`No meio do caminho $x$ chega ao mínimo. Qual?`, opcoes: [t`$D$, quando $Vt=D$`, '0', t`$\sqrt2\,D$`], correta: 0,
        conta: t`x_{\min}=\sqrt{D^2+0}=D`, porque: t`O termo $(Vt-D)^2$ some quando $Vt=D$.` },
      { pergunta: 'Distância percorrida (vai e volta):', opcoes: [t`$2(\sqrt2-1)D$`, '0', t`$(\sqrt2-1)D$`], correta: 0,
        conta: t`\underbrace{(\sqrt2D-D)}_{\text{ida}}+\underbrace{(\sqrt2D-D)}_{\text{volta}}=2(\sqrt2-1)\,D`, porque: 'Distância soma a ida e a volta; deslocamento é que dá zero.' },
    ],
  },
];
