## Relatório aluno-do-zero: 12 questões novas (Cinemática, Dinâmica, Termodinâmica), 24/11/2026

Li o agente (19 tipos), as 12 questões e as aulas Antes de cada uma. Não editei nada. Refiz todas as contas: **gabaritos e as 5 alternativas de cada questão batem, nenhuma conta errada.** O texto abaixo cita o trecho exato.

### Bug que vale na tela (8 das 12)
Em din-00a, din-00b, din-00c, din-00d, ter-00a, ter-00b, ter-00c e ter-00d, o passo "Volta na equação" termina com **"Resposta: alternativa X."** (a letra X, não a certa). As 4 de Cinemática trazem a letra certa. No JSON está literal (`fisica-acima-novas.json`; os 15 "X" do arquivo vêm de `scripts/banco-enem/v2/fis_ter.py` e `est.py`). Não achei troca de X pela letra no código de `lib/`, `app/` ou `components/`. Se a tela não troca, o aluno lê "alternativa X". Conferir na tela. Texto de correção: trocar X pela letra certa (din-00a C, din-00b D, din-00c E, din-00d A, ter-00a D, ter-00b E, ter-00c A, ter-00d B). Letras certas conferidas na explicação.

---

## cin-00a (semáforos/radar de trecho): 4 tropeços
1. [Pegadinha, tipo 5] Enunciado "Uma rodovia de 30 km, do km 100 ao km 130" e "(80 km/h para caminhões)". A conta usa só 12 km (118 a 130) e 90 km/h; nenhum passo diz que 30 km, km 100 e 80 km/h não entram. Colar na tela "O que eu tenho": "Não entram na conta: os 30 km da rodovia, o km 100 e o limite de caminhões. Conta só do pórtico 1 ao 3: 130 − 118 = 12 km, limite de carro."
2. [Antes não cobre, tipo 4] Fórmulas: "tempo = distância ÷ velocidade". A aula Antes só ensina distância = v × t e v = d ÷ t. Colar na aula: "Se v = d ÷ t, então t = d ÷ v. Carro a 60 km/h anda 120 km em 120 ÷ 60 = 2 horas."
3. [Conta com vírgula, tipo 19] "M = 12 ÷ 1,5 = 120 ÷ 15 = 8 min (multiplicou os dois por 10)". Falta o porquê e a conta 120 ÷ 15. Colar: "Para tirar a vírgula, multiplico o 12 e o 1,5 por 10: 120 e 15. 15 cabe 8 vezes em 120 (15 · 8 = 120)."
4. [Tipo 17] Letra **D** (distância, "Achando D") ao lado de "Alternativa D = Repetiu o limite". Renomear a letra D para outra (ex.: K, de "km que faltam").

## cin-00b (esfera e canhão): 2 tropeços
1. [Abstração sem caso, tipo 3/7] Telas "De onde vem cada fórmula (2 de 3)" e "(3 de 3)": "A diferença entre eles continua a mesma da reta sem gravidade" e "só atinge a esfera quando percorre, em reta, a distância". Sem desenho e sem número (qual diferença?). A ideia de "cair junto" não está nas Antes. Colar: "Depois de 1 s a esfera desceu 5 m e o projétil também desceu 5 m a partir de onde estaria sem gravidade. Depois de 2 s, os dois desceram 20 m. Por isso a distância entre os dois nunca muda por causa da gravidade." E pôr um desenho com os pontos.
2. [Número do nada, tipo 10/19] "d · d = 64 + 225 = 289, e d = 17 m (17 · 17 = 289)" e, na checagem, "51 · 51 = 2 601" (sem 24² = 576 e 45² = 2 025). A Antes só tem raízes pequenas (5, 10, 13, 15, 17 pelo exercício). Colar na checagem: "24 · 24 = 576 e 45 · 45 = 2 025; soma 2 601. 51 · 51 = 2 601."

## cin-00c (Ana e Bia): 4 tropeços
1. [Símbolo trocado, tipo 7/16] Tabela do enunciado "t (s)" (relógio de Ana) e na equação "t = tempo, depois de Bia sair". Dois t. Trocar a letra da equação para "u".
2. [Regra sem caso e Antes não cobre, tipo 7/4] Fórmula "v de aproximação = v1 + v2" e "aproximação 5 + 5 = 10 m/s". Colar: "Em 1 s Ana anda 5 m e Bia anda 5 m. A distância entre elas diminui 5 + 5 = 10 m a cada segundo."
3. [Isolar incógnita, tipo 18] "Chega a 5 m/s em 5 ÷ 0,5 = 10 s". Antes só ensina a = Δv ÷ t. Colar: "a = 0,5 m/s² quer dizer +0,5 m/s a cada segundo: 1 s, 0,5; 2 s, 1; ... 10 s, 5. Quantos 0,5 cabem em 5? 10."
4. [Palavra/notação, tipo 1/12] Peça "Gráfico v × t... A distância é a área embaixo". "v × t" não tem leitura ("v por t") e "área embaixo" não é usada em nenhum passo. Cortar a frase ou lê-la: "gráfico de v (no alto) contra t (embaixo)".

## cin-00d (carrinho, 120 m): 5 tropeços
1. [Passo de álgebra, tipo 18] "N · P ÷ 2 = 120 dá N · P = 240". Colar: "Multiplico os dois lados por 2 para sumir o ÷ 2. Teste: N = 3, P = 80: 3 · 80 ÷ 2 = 120 e 3 · 80 = 240."
2. [Número do nada, tipo 10] "N + P é ímpar (N + P = 2 · 1ª velocidade + 1)". Colar: "N = 3 e 1ª = 41: P = 41 + 39 = 80; N + P = 83 = 2 · 41 + 1. A última é a 1ª menos (N − 1), então P = 2 · 1ª − (N − 1), e N + P = 2 · 1ª + 1."
3. [Método não mostrado, tipo 9] "Como 240 = 16 · 15, o 16 inteiro fica num só deles" e a lista "N = 1, 3, 5 ou 15 ... 16, 48, 80 ou 240". Faltam: os divisores de 15 são 1, 3, 5, 15; o outro grupo é 16 vezes cada um. Colar essa frase.
4. [Letra sem nascer, tipo 16] Passo "Achando P: quais N servem" (o título diz P, o texto faz outra coisa). Surge "v = (P + N − 1) ÷ 2" com v não listada nas letras. Colar: "Do P = 1ª + última e última = 1ª − (N − 1): P = 2 · 1ª − N + 1, então 1ª = (P + N − 1) ÷ 2. Teste N = 3, P = 80: (80 + 3 − 1) ÷ 2 = 41." Renomear o título.
5. [Tipo 14, leve] Checagem: "Só N = 3 serve; N = 8 daria última velocidade negativa". Não cita N = 1 e N = 24, que o aluno também acha em N · P = 24.

## din-00a (balança no elevador): 5 tropeços
1. [Antes não cobre, tipo 4/19] "m/s = km/h ÷ 3,6" e "21,6 ÷ 3,6 = 6". Colar: "1 km = 1 000 m e 1 h = 3 600 s; por isso 1 km/h = 1 000 ÷ 3 600 = 1 ÷ 3,6 m/s. 21,6 ÷ 3,6 = 216 ÷ 36 = 6."
2. [Símbolo duplo] "N" é a força no passo "N − m · g = m · a" e também a unidade "720 N". Renomear a força para "C" (chão).
3. [Letra antes de número, tipo 7/3] "N − m · g = m · a, então N = m · (g + a)" e "A balança mostra N ÷ g". As Antes só têm aceleração e F = m × a, não peso nem força do chão. Colar o caso antes: "Elevador parado, pessoa de 60 kg: peso 60 · 10 = 600 N; o chão empurra com 600 N; 600 ÷ 10 = 60 kg. Acelerando 2 m/s² para cima: sobra 60 · 2 = 120 N, então o chão empurra 600 + 120 = 720 N, e a balança mostra 72 kg."
4. [Negativo sem aula, tipo 4/19] "a = (0 − 6) ÷ 2 = −3", "10 − 3" e "60 · (2 − (−3)) ÷ 10 = 30". Nunca se diz que "para cima é positivo" e "2 − (−3)" surge do nada. Colar: "Freando a velocidade diminui: o sinal − só diz isso. 2 − (−3) = 2 + 3 = 5; 60 · 5 ÷ 10 = 30."
5. [Tipo 17/16] Letra **D** (diferença) com "Alternativa D = Usou 21,6 sem passar para m/s", e a letra **F** (freada) contra F = m × a da aula. Renomear D e F.

## din-00b (rampa com atrito): 7 tropeços
1. [Número do nada, tipo 10/19] "Triângulo 3, 4, 5: seno = 3 ÷ 5 ... cosseno = 4 ÷ 5". O enunciado só dá 3 m de altura e 5 m de rampa; o 4 vem de Pitágoras sem dizer, e a Antes dá o seno 0,6 pronto, sem ligá-lo a "altura ÷ rampa". Colar: "Seno = altura ÷ comprimento da rampa = 3 ÷ 5 = 0,6. O outro lado: 3 · 3 + x · x = 5 · 5, então x = 4 e cosseno = 4 ÷ 5 = 0,8." Sem desenho da rampa.
2. [Símbolo sem leitura, tipo 12/1] "atrito = μ · força que aperta". μ é lido como "coeficiente" na Antes, mas o símbolo não aparece lá. Colar: "μ (lê-se 'mi') é o coeficiente de atrito: 0,45."
3. [Palavra nova, tipo 1] "O coeficiente de atrito ... tanto o estático quanto o cinético" e "atrito máximo (7,2 N)". Nenhuma tela explica. Colar: "Estático: bloco parado, o atrito segura até 7,2 N. Cinético: bloco andando, o atrito vale 7,2 N."
4. [Fórmula sem origem, tipo 2/7] "Torricelli: v² = v inicial² + 2 · a · d" e depois "V = √(2 · r · d)". Nenhuma Antes ensina. Colar a conta com número: "Sobe a 12 m/s e para em 4 s com a = 3: média 6, d = 6 · 4 = 24 m, e 12 · 12 = 144 = 2 · 3 · 24."
5. [Álgebra e conta, tipo 18/19] "Sobe até parar: 12 · 12 = 2 · s · d, ou seja, 144 = 19,2 · d" e "144 ÷ 19,2 = 1 440 ÷ 192 = 7,5". Falta: 2 · 9,6 = 19,2; "×10" por quê; 1 440 ÷ 192 passo a passo (192 · 7 = 1 344, sobra 96, que é a metade).
6. [Isolar, tipo 18, leve] "s = 19,2 ÷ 2" e "r = 4,8 ÷ 2": a Antes dá F = m × a, não a = F ÷ m.
7. [Símbolo trocado, tipo 7] Letra **s** (desaceleração) ao lado de "m/s²" e "s = 9,6 m/s²". Trocar a letra.

## din-00c (bloco sobre prancha): 8 tropeços
1. [Tipo 17] "bloco A", "prancha B" ao lado de "Alternativa A = Tratou A como parado" e "Alternativa B". Trocar os nomes (bloco 1, prancha 2).
2. [Antes não cobre, tipo 4] "atrito = μ · m · g", "atrito máximo", "estático e cinético" e "2ª lei". A Antes só tem aceleração e queda; faltam atrito, μ, peso = m · g e a unidade N.
3. [Número do nada, tipo 10] "a = 30 ÷ 5 = 6 m/s²". De onde 5? Colar: "30 N empurram os dois juntos: massa 4 + 1 = 5 kg."
4. [Palavra nova, tipo 1] "(ação e reação)". Colar: "Se A empurra B para trás com 4 N, B empurra A para frente com 4 N."
5. [Fórmula sem origem, tipo 2/7] "d = a · t² ÷ 2". Colar: "a = 2 m/s²; em 3 s chega a 6 m/s, média 3, d = 3 · 3 = 9 m; e 2 · 3 · 3 ÷ 2 = 9."
6. [Álgebra, tipo 18] "T = √(2 · L ÷ R)": d = a · t² ÷ 2 virou t = √(2 · d ÷ a) sem passo. A raiz está só na Pitágoras, que não é Antes desta questão. Colar o teste: "t · t = 2 · 9 ÷ 2 = 9, t = 3."
7. [Abstração, tipo 3/7] Equação em letras: "o bloco ... anda para trás o comprimento L com a aceleração R". A aceleração relativa vem sem caso com número. Mover a conferência ("em 1 s, B anda 3,25 m, A anda 2 m, e 3,25 − 2 = 1,25") para antes da fórmula.
8. [Pegadinha, tipo 5] A tabela traz 4 coeficientes; só 0,40 entra. Nenhuma tela diz por que os outros três (0,6; 0,2; 0,5) não entram. Colar: "O bloco de borracha está sobre a prancha de madeira, então vale 'borracha e madeira'. As outras linhas não entram."

## din-00d (fio e pino): 6 tropeços
1. [Conta com fração, tipo 19] "4/5 de L abaixo" e depois "O pino está a 0,8 L". 4/5 = 0,8 nunca é feito, e "0,8 L" (0,8 vezes L) não é lido. Colar: "4/5 = 4 ÷ 5 = 0,8. 0,8 L é 0,8 vezes o L: se L = 10 m, é 8 m."
2. [Fórmula sem origem, tipo 2] "v² = 2 · g · queda". A Antes dá média × tempo, não v². Colar: "Cai 5 m: v = 10 m/s depois de 1 s, mas 5 m leva menos de 1 s... Se cair 20 m: leva 2 s, chega a 20 m/s, e 20 · 20 = 400 = 2 · 10 · 20."
3. [Regra sem caso, tipo 7/1] "T + 20 = 2 · W ÷ r": "tração" e "peso" não são definidos, e o 20 é o peso (2 · 10). Não diz por que os dois somam no topo (os dois puxam para o centro). Colar uma conta com número (como a checagem).
4. [Número do nada, tipo 10] "O fio não afrouxa: W = 12 L é maior que g · r = 2 L". Condição que nunca foi ensinada; surge "2 L" (10 · 0,2 L).
5. [Álgebra, tipo 18] "O L corta". Colar: "L ÷ L = 1: com L = 10, 24 · 10 ÷ (0,2 · 10) = 240 ÷ 2 = 120; com L = 5, 120 ÷ 1 = 120."
6. [Geometria sem figura] 0,8 L, 0,2 L e 0,6 L são só texto. Falta desenho do pino, do fio e do topo, com as medidas marcadas, antes das contas.

## ter-00a (banheira e botijão): 4 tropeços
1. [Álgebra, tipo 18] "o c corta: 30 · x = 20 · (50 − x) = 1 000 − 20 · x ... 30 · x + 20 · x = 1 000". Falta o parêntese (20 · 50 = 1 000), por que corta (c, kg iguais) e por que somar 20 · x nos dois lados. Colar o teste: "x = 20 L: 20 · 30 = 600 e 30 · 20 = 600."
2. [Conta com vírgula, tipo 19] "4,2 ÷ 0,8 = 42 ÷ 8 = 5,25", "m = 5,25 ÷ 42 = 0,125 (pois 42 · 0,125 = 5,25)" e "Conferindo: 8 ÷ 8 = 1". 42 ÷ 8 = 5,25 e 5,25 ÷ 42 não têm passos, e "8 ÷ 8" aparece do nada (0,125 = 1 ÷ 8). Colar: "0,125 é 1 ÷ 8: 8 · 0,125 = 1."
3. [Regra sem caso, tipo 7] "energia do gás = calor útil ÷ 0,8": por que dividir e não multiplicar (Alternativa B é o erro). Colar: "Se o gás dá 10, chegam 80% = 8. Então 8 é o útil e 10 = 8 ÷ 0,8."
4. [Símbolo duplo, tipo 7] "Q = m · c · ΔT" na tela de fórmulas (m = massa de água, Q em kJ) e na equação "m = kg de gás", "Q = calor útil em MJ". Trocar as letras.

## ter-00b (gás, reta p × V): 4 tropeços
1. [Símbolo trocado, tipo 7] Fórmulas e enunciado dizem "Q = W + ΔU" e "U = (3/2) · n · R · T" (energia); a equação em letras usa "Q = W + U" com U = variação. Além disso a letra "v" (volume de B, em L) fica ao lado do "V" do p · V. Trocar para "ΔU" ou outra letra, e "v" por "B".
2. [Palavra nova, tipo 1/5] "gás ideal monoatômico" nunca é explicado, e "(3/2) · n · R · T" sobra (só serve para dizer ΔU = 0), sem aviso de que o 3/2 não entra na conta.
3. [Geometria sem figura/termo] "a área sob ela é um trapézio". "Área" e "trapézio" não estão na Antes, e não há desenho do diagrama p × V com A, B e a reta. Colar: um desenho com o trapézio (lados 3 e 1, largura 2) e "área = (lado + lado) ÷ 2 · largura".
4. [Potência de dez, tipo 19] "W = 2 × 10⁵ · 2 × 10⁻³ = 400 J". Falta 2 · 2 = 4 e 10⁵ · 10⁻³ = 10² = 100 (a Antes não ensina somar expoentes). Colar: "10⁵ · 10⁻³ = 100 000 · 0,001 = 100; 4 · 100 = 400."

## ter-00c (gelo, água e resistência): 2 tropeços
1. [Antes não cobre, tipo 4/7] "t = energia ÷ potência" e "72 000 ÷ 720 = 100 s". Nenhuma Antes diz que 1 W = 1 J por segundo. Colar: "720 W é 720 J por segundo. 72 000 J ÷ 720 J por segundo = 100 s."
2. [Símbolo duplo, tipo 7] Fórmulas: "Q = m · c · ΔT" (m = massa, Q em cal). Equação: "m = gelo que sobra" e "Q em J". Trocar m e Q.

## ter-00d (escada de barras): 7 tropeços
1. [Antes não cobre, tipo 4] "z = 25 + 50 · z ÷ (50 + z)". A Antes só ensina duas barras IGUAIS em paralelo (a metade). Com 50 e z, a regra "produto ÷ soma" surge sem aula. Colar uma aula Antes com 2 exercícios (ex.: 30 e 60 em paralelo: 30 · 60 ÷ 90 = 20).
2. [Álgebra, tipo 18] "Multiplico por (50 + z): 50 · z + z · z = 1 250 + 25 · z + 50 · z, então z · z − 25 · z − 1 250 = 0". Três distribuições e a passagem de termos sem passo e sem teste com número pequeno.
3. [Método não mostrado, tipo 19] "Dois números que somam −25 e multiplicam −1 250: −50 e 25." A Antes tem −3 e 2 (produto −6). Colar: "1 250 = 50 · 25; um é negativo (produto −), o maior tem sinal −: −50 + 25 = −25."
4. [Regra sem caso, tipo 7/2] "f = 25 ÷ 50 = 1/2. O resto é igual ao todo, então cada nó repete isso". Por que o 2º nó também fica com a metade do 1º? Colar: "Do 2º nó para frente a escada é a mesma, então o 2º nó divide a temperatura do 1º do mesmo jeito: 50 → 25 → 12,5."
5. [Notação e contagem, tipo 14/9] Conferência "1 + 0,5 + 0,25 + ... = 2 W". Soma sem fim que dá 2 sem justificativa. Cortar ou explicar ("1 + 0,5 = 1,5; + 0,25 = 1,75; ... chega perto de 2").
6. [Conta com vírgula, tipo 19, leve] "0,5 ÷ 0,02 = 50 ÷ 2 = 25" e "12,5 ÷ 50 = 25 ÷ 100". Os "×100" e "×2" não são ditos.
7. [Geometria sem figura] O enunciado e toda a explicação descrevem a escada só em palavras (nós, horizontais, verticais). Falta o desenho com a fonte, os nós 1, 2, 3, as barras e o frio, com 0,50 m e 1,0 m marcados.

---

## Contagem de tropeços
| Questão | Tropeços |
|---|---|
| cin-00a | 4 |
| cin-00b | 2 |
| cin-00c | 4 |
| cin-00d | 5 |
| din-00a | 5 |
| din-00b | 7 |
| din-00c | 8 |
| din-00d | 6 |
| ter-00a | 4 |
| ter-00b | 4 |
| ter-00c | 2 |
| ter-00d | 7 |
| **Total** | **58** |

Mais o bug "alternativa X" em 8 questões (não somado aos 58). Tipos mais repetidos: conteúdo que a Antes não cobre (tipo 4) e fórmula/passo de álgebra sem origem nem número (tipos 2, 7, 18, 19), nas contas de Dinâmica e Termodinâmica; símbolo duplo (N, Q, m, t, U) em 6 questões; letra igual a alternativa (tipo 17) em cin-00a, din-00a e din-00c.

## Nível: acima de verdade ou fácil demais
- **cin-00a:** acima, no limite. 4 contas curtas (6, 8, 3, 72); a ideia escondida é "média de velocidade ≠ média das velocidades" e há 3 dados que sobram. Nenhum passo ultrapassa 12 ÷ 1,5.
- **cin-00b:** acima. 3 contas, mas a ideia ("cair junto", o ângulo some) não tem pista no enunciado; sem ela a questão não tem saída.
- **cin-00c:** acima. 6 contas e 2 armadilhas (a tabela mostra 5 m/s aos 12 s, mas a velocidade máxima chega aos 10 s; Bia sai aos 20 s).
- **cin-00d:** acima, muito difícil. 3 ideias encadeadas (soma em degraus, N · P = 240 com paridade oposta, descartar 5 dos 8 casos), 8 casos testados.
- **din-00a:** acima. 6 contas e 4 armadilhas (mochila de 8 kg, km/h, newtons, sinal da freada), mas a conta pesada é só 72 − 42.
- **din-00b:** acima. 10 contas em 3 fases e a pegadinha "ele desce?" (12 N > 7,2 N); 5 das 5 alternativas erradas vêm de erro de fase.
- **din-00c:** acima, muito difícil. 7 contas, teste "andam juntos?" (6 N > 4 N), duas acelerações e a relativa; 4 coeficientes de atrito dos quais só 1 entra.
- **din-00d:** acima, muito difícil. O L nunca é dado e some; raio muda, topo a 0,6 L, subtrair o peso. 5 ideias em 3 contas.
- **ter-00a:** acima. 7 passos e 1 ideia escondida (só 20 L dos 50 L passam pelo aquecedor), 3 dados que se perdem se o aluno os usar à toa (50 L, 40 °C, 30 dias).
- **ter-00b:** **fácil demais para "acima".** 3 contas (3 L, 0, 400 J). A aula Antes já entrega os 3 passos (p · V igual, ΔU = 0, pressão média). O único traço difícil é a área do trapézio, que também é a única parte não ensinada.
- **ter-00c:** acima. 8 contas e 1 ideia escondida (testar se o gelo derrete tudo: 8 000 cal < 16 000 cal), mais rendimento para multiplicar.
- **ter-00d:** acima, muito difícil. 4 ideias (resistência, escada igual ao todo, equação de grau 2, divisor de temperatura) e 7 contas; só passa se a aula de paralelo desigual for acrescentada.
