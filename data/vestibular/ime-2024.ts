// IME 2024, prova objetiva. Texto e gabarito do banco cemig-ceia/vestibulares-with-subject
// (Hugging Face, transcrição da prova oficial); cada gabarito conferido por resolução própria.
import type { QuestaoVestibular } from '@/lib/vestibular/tipos';

const t = String.raw;
const base = { banca: 'IME', ano: 2024 } as const;

export const IME_2024: QuestaoVestibular[] = [
  {
    ...base, numero: 1, materia: 'Matemática', subtema: 'Bases numéricas',
    enunciado: t`Números palíndromos na base $b$ são números cuja representação nesta base é simétrica, ou seja, se os seus algarismos forem lidos de trás para frente obtém-se o mesmo número. A quantidade de números naturais positivos menores ou iguais a $(377)_8$ que são palíndromos na base dois é

Observação: Considere que todo número não nulo na base 2 começa por 1.`,
    alternativas: ['16', '26', '30', '31', '32'],
    gabarito: 2,
    passos: [
      { pergunta: t`Quanto é $(377)_8$ em base 10?`, opcoes: ['255', '377', '511'], correta: 0,
        conta: t`3\cdot64+7\cdot8+7=255=(11111111)_2`, porque: 'Então contamos palíndromos binários com até 8 algarismos.' },
      { pergunta: t`Num palíndromo binário de $L$ algarismos, quantos você escolhe livremente?`, opcoes: ['os da primeira metade, menos o primeiro (que é 1)', 'todos', 'nenhum'], correta: 0,
        conta: t`\text{livres}=\lceil L/2\rceil-1`, porque: 'A segunda metade copia a primeira.' },
      { pergunta: t`Somando de $L=1$ até $8$:`, opcoes: ['1+1+2+2+4+4+8+8 = 30', t`$2^8=256$`, '16'], correta: 0,
        conta: t`\textstyle\sum_{L=1}^{8}2^{\lceil L/2\rceil-1}=30`, porque: 'Cada algarismo livre dobra as opções.' },
    ],
  },
  {
    ...base, numero: 3, materia: 'Matemática', subtema: 'Números complexos',
    enunciado: t`Considere a sequência de números complexos $z_1 = (1 + i)$, $z_2 = (1 + i)^2$, ..., $z_{20} = (1+i)^{20}$, onde $i^2 = -1$. A maior área possível do triângulo formado pelos afixos de três números consecutivos dessa sequência é`,
    alternativas: [t`$2^{16}$`, t`$2^{17}$`, t`$2^{18}$`, t`$2^{19}$`, t`$2^{20}$`],
    gabarito: 1,
    passos: [
      { pergunta: t`Multiplicar por $1+i$ faz o quê com um ponto?`, opcoes: [t`gira $45°$ e estica $\sqrt2$ vezes`, 'só gira', 'só estica'], correta: 0,
        conta: t`1+i=\sqrt2\,(\cos45°+i\,\mathrm{sen}\,45°)`, porque: t`Módulo $\sqrt2$, ângulo $45°$.` },
      { pergunta: t`O trio $z_k,\ z_{k+1},\ z_{k+2}$ é o trio $1,\ 1+i,\ 2i$ vezes $(1+i)^k$. A área do trio pequeno é…`, opcoes: [t`$\frac12$`, '1', '2'], correta: 0,
        conta: t`\text{lados}\ (0,1)\ \text{e}\ (-1,2):\ \tfrac12\,|0\cdot2-1\cdot(-1)|=\tfrac12`, porque: t`$(1+i)^2=2i$.` },
      { pergunta: t`Multiplicar por $(1+i)^k$ multiplica a área por…`, opcoes: [t`$|1+i|^{2k}=2^k$`, t`$2^{k/2}$`, t`$k$`], correta: 0,
        conta: t`A_k=2^{k}\cdot\tfrac12=2^{k-1}`, porque: 'Comprimentos crescem √2 a cada passo; área cresce o quadrado disso.' },
      { pergunta: t`O último trio é $z_{18},\ z_{19},\ z_{20}$. A área é…`, opcoes: [t`$2^{17}$`, t`$2^{18}$`, t`$2^{20}$`], correta: 0,
        conta: t`A_{18}=2^{17}`, porque: 'A área cresce com k, então a maior é a do último trio.' },
    ],
  },
  {
    ...base, numero: 4, materia: 'Matemática', subtema: 'Relações de Girard',
    enunciado: t`Seja a equação $x^2 - px + q = 0$, na variável $x$, com raízes $a$ e $b$. Então o valor de $a^4 + b^4$ é`,
    alternativas: [t`$p^4 + 4q^2 - 2p^2q$`, t`$p^4 + 4q^2 - 4p^2q$`, t`$p^4 + 2q^2 - 4p^2q$`, t`$p^4 + 4q^2 - 4p^4q$`, t`$p^4 + 2q^2 - 2p^2q$`],
    gabarito: 2,
    passos: [
      { pergunta: 'Soma e produto das raízes:', opcoes: [t`$a+b=p$, $ab=q$`, t`$a+b=-p$, $ab=q$`, t`$a+b=q$, $ab=p$`], correta: 0,
        conta: t`a+b=p,\qquad ab=q`, porque: t`Em $x^2-px+q$: soma $=p$, produto $=q$.` },
      { pergunta: t`$a^2+b^2$ é…`, opcoes: [t`$p^2-2q$`, t`$p^2+2q$`, t`$p^2$`], correta: 0,
        conta: t`a^2+b^2=(a+b)^2-2ab=p^2-2q`, porque: t`O quadrado da soma traz um $2ab$ a mais.` },
      { pergunta: 'Repetindo o mesmo truque um degrau acima:', opcoes: [t`$p^4+2q^2-4p^2q$`, t`$p^4+4q^2-4p^2q$`, t`$p^4-2q^2$`], correta: 0,
        conta: t`a^4+b^4=(a^2+b^2)^2-2a^2b^2=(p^2-2q)^2-2q^2=p^4-4p^2q+2q^2`, porque: t`$a^2b^2=q^2$.` },
    ],
  },
  {
    ...base, numero: 5, materia: 'Matemática', subtema: 'Polinômios',
    enunciado: t`Sejam $\alpha$, $\beta$ e $\gamma$ as raízes da equação $x^3 + 6x^2 - 6x - 3 = 0$. O valor de $(\alpha + \beta)(\beta + \gamma)(\gamma + \alpha)$ é`,
    alternativas: ['12', '18', '27', '33', '42'],
    gabarito: 3,
    passos: [
      { pergunta: 'Soma das raízes:', opcoes: [t`$-6$`, '6', '3'], correta: 0,
        conta: t`\alpha+\beta+\gamma=-\tfrac61=-6`, porque: 'Girard: menos o coeficiente de x² sobre o de x³.' },
      { pergunta: t`Então $\alpha+\beta$ é…`, opcoes: [t`$-6-\gamma$`, t`$6-\gamma$`, t`$\gamma$`], correta: 0,
        conta: t`(\alpha+\beta)(\beta+\gamma)(\gamma+\alpha)=(-6-\gamma)(-6-\alpha)(-6-\beta)`, porque: 'Cada par é a soma total menos a raiz que falta.' },
      { pergunta: t`Isso é $P(-6)$, com $P(x)=(x-\alpha)(x-\beta)(x-\gamma)$. Quanto dá?`, opcoes: ['33', t`$-33$`, '0'], correta: 0,
        conta: t`P(-6)=-216+216+36-3=33`, porque: 'Basta trocar x por −6 na equação.' },
    ],
  },
  {
    ...base, numero: 8, materia: 'Matemática', subtema: 'Probabilidade geométrica',
    enunciado: t`São dados os pontos $A$ e $B$ sobre uma circunferência de raio $r$, de forma que a corda $AB$ mede $r$. Escolhe-se ao acaso um ponto $C$ sobre o maior arco $AB$. A probabilidade da área do triângulo $ABC$ ser maior que $\frac{r^2\sqrt{3}}{4}$ é`,
    alternativas: [t`$\frac{1}{5}$`, t`$\frac{2}{5}$`, t`$\frac{1}{2}$`, t`$\frac{3}{5}$`, t`$\frac{4}{5}$`],
    gabarito: 3,
    passos: [
      { pergunta: t`Corda igual ao raio: o ângulo central $A\hat OB$ mede…`, opcoes: [t`$60°$`, t`$90°$`, t`$120°$`], correta: 0,
        conta: t`\triangle AOB\ \text{é equilátero}\ \Rightarrow\ \text{arco maior}=300°`, porque: t`Os três lados medem $r$.` },
      { pergunta: t`Área maior que $\frac{r^2\sqrt3}{4}$ com base $AB=r$ pede altura…`, opcoes: [t`$h>\frac{r\sqrt3}{2}$`, t`$h>r$`, t`$h>\frac r2$`], correta: 0,
        conta: t`\tfrac12\cdot r\cdot h>\tfrac{r^2\sqrt3}{4}\ \Rightarrow\ h>\tfrac{r\sqrt3}{2}`, porque: 'Área = base × altura ÷ 2.' },
      { pergunta: t`O centro $O$ já está a $\frac{r\sqrt3}{2}$ de $AB$. Então $C$ precisa ficar…`, opcoes: [t`além da paralela a $AB$ pelo centro: meia volta, $180°$`, 'em qualquer lugar', t`perto de $A$`], correta: 0,
        conta: t`P=\frac{180°}{300°}=\frac35`, porque: 'Do arco maior de 300°, servem 180°.' },
    ],
  },
  {
    ...base, numero: 9, materia: 'Matemática', subtema: 'Inequações',
    enunciado: t`Considere a inequação $(x^2 - 100)(x^2 - 150)(x^2 - 200) < 0$. A quantidade de números inteiros que a satisfazem é`,
    alternativas: ['23', '24', '25', '26', '27'],
    gabarito: 0,
    passos: [
      { pergunta: t`Pense em $u=x^2$. O produto $(u-100)(u-150)(u-200)$ é negativo quando…`, opcoes: [t`$u<100$ ou $150<u<200$`, t`$u>200$`, t`$100<u<150$`], correta: 0,
        conta: t`(-)(-)(-)<0\qquad (+)(+)(-)<0`, porque: 'Três fatores: negativo com um ou três sinais de menos.' },
      { pergunta: t`Inteiros com $x^2<100$:`, opcoes: ['19 (de −9 a 9)', '20', '10'], correta: 0,
        conta: t`-9\le x\le9`, porque: t`$10^2=100$ não entra: a desigualdade é estrita.` },
      { pergunta: t`Inteiros com $150<x^2<200$:`, opcoes: ['4: ±13 e ±14', '2', '6'], correta: 0,
        conta: t`13^2=169,\ \ 14^2=196\ \Rightarrow\ 19+4=23`, porque: t`$12^2=144$ e $15^2=225$ ficam de fora.` },
    ],
  },
  {
    ...base, numero: 11, materia: 'Matemática', subtema: 'Trigonometria',
    enunciado: t`O número de soluções da equação $\cos^3(x) + \mathrm{sen}^3(x) + \frac{1}{2}\mathrm{sen}(2x) = 1$ no intervalo $[0,2\pi)$ é`,
    alternativas: ['0', '1', '2', '3', '4'],
    gabarito: 2,
    passos: [
      { pergunta: t`Chame $s=\mathrm{sen}\,x+\cos x$ e $p=\mathrm{sen}\,x\cos x$. Então $\frac12\mathrm{sen}\,2x$ é…`, opcoes: [t`$p$`, t`$2p$`, t`$s$`], correta: 0,
        conta: t`\tfrac12\,\mathrm{sen}\,2x=\mathrm{sen}\,x\cos x=p`, porque: t`$\mathrm{sen}\,2x=2\,\mathrm{sen}\,x\cos x$.` },
      { pergunta: t`$\cos^3x+\mathrm{sen}^3x$ em $s$ e $p$:`, opcoes: [t`$s\,(1-p)$`, t`$s^3$`, t`$1-p$`], correta: 0,
        conta: t`a^3+b^3=(a+b)(a^2-ab+b^2)=s\,(1-p)`, porque: t`$\mathrm{sen}^2+\cos^2=1$.` },
      { pergunta: t`A equação vira $s(1-p)+p=1$, ou seja…`, opcoes: [t`$(s-1)(1-p)=0$`, t`$s=p$`, t`$p=1$`], correta: 0,
        conta: t`s-sp+p-1=(s-1)(1-p)=0`, porque: t`$p\le\frac12$, então $1-p\neq0$ e sobra $s=1$.` },
      { pergunta: t`$\mathrm{sen}\,x+\cos x=1$ em $[0,2\pi)$:`, opcoes: [t`$x=0$ e $x=\frac\pi2$: 2 soluções`, t`só $x=0$`, '4 soluções'], correta: 0,
        conta: t`\sqrt2\,\mathrm{sen}\!\left(x+\tfrac\pi4\right)=1`, porque: 'Esse seno vale √2/2 em dois pontos da volta.' },
    ],
  },
  {
    ...base, numero: 14, materia: 'Matemática', subtema: 'Polígonos regulares',
    enunciado: t`São dados $n$ círculos de mesmo raio $r$, cujos centros são os vértices de um polígono regular $P$ de $n$ lados, de forma que cada círculo tangencia externamente dois outros círculos. Seja $R$ o raio do círculo circunscrito a $P$. O valor de $n$ quando $R = 2r$ é`,
    alternativas: ['3', '4', '5', '6', '8'],
    gabarito: 3,
    passos: [
      { pergunta: t`Círculos vizinhos se tocam por fora: o lado de $P$ mede…`, opcoes: [t`$2r$`, t`$r$`, t`$R$`], correta: 0,
        conta: t`\ell=r+r=2r`, porque: 'Distância entre centros = soma dos raios.' },
      { pergunta: t`Num polígono regular inscrito no raio $R$, o lado é…`, opcoes: [t`$2R\,\mathrm{sen}\frac{\pi}{n}$`, t`$R$`, t`$\frac{2\pi R}{n}$`], correta: 0,
        conta: t`2r=2R\,\mathrm{sen}\tfrac{\pi}{n}=4r\,\mathrm{sen}\tfrac{\pi}{n}`, porque: t`Triângulo isósceles com dois lados $R$ e ângulo $\frac{2\pi}{n}$ no centro.` },
      { pergunta: t`Então $\mathrm{sen}\frac{\pi}{n}=\frac12$:`, opcoes: [t`$n=6$`, t`$n=3$`, t`$n=4$`], correta: 0,
        conta: t`\tfrac{\pi}{n}=\tfrac{\pi}{6}\ \Rightarrow\ n=6`, porque: 'No hexágono o lado é igual ao raio: 2r = R. Confere.' },
    ],
  },
  {
    ...base, numero: 26, materia: 'Física', subtema: 'Gravitação',
    enunciado: t`Para simular a órbita $(x(t),y(t))$ do satélite de um planeta, no referencial do planeta, utilizou-se um modelo com as seguintes equações: $x(t) = A \cos(\omega t)$ e $y(t) = B\,\mathrm{sen}(\omega t)$, onde $A$, $B$ e $\omega$ são constantes e $t$ é o instante de tempo.

Dados:
• massa do planeta: $M$;
• massa do satélite: $m$, onde $m \ll M$;
• constante universal de gravitação: $G$;
• $C = \sqrt{A^2 - B^2}$;
• localização do centro do planeta: $(C,0)$.

A diferença entre a maior e a menor energia potencial gravitacional do satélite é:`,
    alternativas: [t`$\frac{2AGmM}{B^2}$`, t`$\frac{CGmM}{B^2}$`, t`$\frac{2CGmM}{A^2}$`, t`$\frac{2CGmM}{B^2}$`, t`$\frac{AGmM}{C^2}$`],
    gabarito: 3,
    adaptacao: 'Equações separadas por "e" e a palavra "unidimensional" retirada (erro de transcrição na fonte).',
    passos: [
      { pergunta: t`A órbita é uma elipse de semieixos $A$ e $B$. O planeta, em $(C,0)$, fica…`, opcoes: ['num foco', 'no centro', 'fora da elipse'], correta: 0,
        conta: t`C^2=A^2-B^2`, porque: 'É a distância do centro ao foco (1ª lei de Kepler).' },
      { pergunta: 'Menor e maior distância do satélite ao planeta:', opcoes: [t`$A-C$ e $A+C$`, t`$B$ e $A$`, t`$0$ e $2A$`], correta: 0,
        conta: t`r_{\min}=A-C,\qquad r_{\max}=A+C`, porque: 'Nas duas pontas do eixo maior.' },
      { pergunta: t`Com $U=-\frac{GMm}{r}$, a diferença $U_{\max}-U_{\min}$ é…`, opcoes: [t`$\frac{2CGmM}{B^2}$`, t`$\frac{CGmM}{B^2}$`, t`$\frac{2AGmM}{B^2}$`], correta: 0,
        conta: t`GMm\Big(\tfrac{1}{A-C}-\tfrac{1}{A+C}\Big)=\tfrac{2C\,GMm}{A^2-C^2}=\tfrac{2C\,GMm}{B^2}`, porque: t`$A^2-C^2=B^2$.` },
    ],
  },
  {
    ...base, numero: 28, materia: 'Física', subtema: 'Óptica',
    enunciado: t`Uma lente convergente é construída usando um material de índice de refração $n$, podendo a sua distância focal $f$ ser calculada usando a equação dos fabricantes de lentes. Um objeto é posicionado no eixo da lente e muito distante da mesma.

Observações:
• $f$ é proporcional a $(n - 1)^{-1}$;
• $n > 1$;
• seja $x$ tal que $|x| \ll 1$, então $(1 - x)^{-1} \approx 1 + x$.

Caso haja uma ínfima variação na constituição do índice de refração do material $(n \to n + \Delta n)$, a variação $\Delta i$ na posição final da imagem do objeto $(i \to i + \Delta i)$ é, aproximadamente:`,
    alternativas: [t`$f\Delta n/n$`, t`$f\Delta n/(n - 1)$`, t`$-f\Delta n/(n - 1)$`, t`$-f\Delta n/(n^2 - 1)$`, t`$f\Delta n/(n^2 - 1)$`],
    gabarito: 2,
    passos: [
      { pergunta: 'Objeto muito distante: a imagem se forma…', opcoes: [t`no foco: $i=f$`, 'no infinito', 'no centro da lente'], correta: 0,
        conta: t`i=f=\frac{k}{n-1}`, porque: 'Raios vindos de longe chegam paralelos e se cruzam no foco.' },
      { pergunta: t`Com $n+\Delta n$, o novo foco é…`, opcoes: [t`$f\left(1+\frac{\Delta n}{n-1}\right)^{-1}$`, t`$f$`, t`$f+\Delta n$`], correta: 0,
        conta: t`f'=\frac{k}{n-1+\Delta n}=\frac{k}{(n-1)\big(1+\frac{\Delta n}{n-1}\big)}`, porque: t`Põe $n-1$ em evidência.` },
      { pergunta: t`Usando $(1-x)^{-1}\approx1+x$ com $x=-\frac{\Delta n}{n-1}$:`, opcoes: [t`$\Delta i\approx-\frac{f\,\Delta n}{n-1}$`, t`$\Delta i\approx\frac{f\,\Delta n}{n}$`, t`$\Delta i=0$`], correta: 0,
        conta: t`f'\approx f\Big(1-\tfrac{\Delta n}{n-1}\Big)\ \Rightarrow\ \Delta i\approx-\tfrac{f\,\Delta n}{n-1}`, porque: 'Índice maior, lente mais forte: o foco chega mais perto. É uma derivada disfarçada.' },
    ],
  },
];
