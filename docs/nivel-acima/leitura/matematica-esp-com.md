# Leitura do aluno-do-zero: Matemática esp / com (8 questões novas)

Data: 24/11/2026. Lido: enunciado, alternativas, explicação (ideia, peças, passos, checagem) de `data/revisao-final/escada/matematica-acima-novas.json` e dos módulos `scripts/banco-enem/v2/esp.py` e `com.py`, mais as aulas "Antes" ligadas de `data/revisao-final/antes-da-questao.json`. Gabaritos e contas refeitos por script (todas as 8 batem; com-00b por enumeração dos 4 096 painéis; com-00d por busca de todos os resultados possíveis dos 15 jogos: 11 jeitos, todos com 2 empates). O que a aula Antes ensina não foi contado como tropeço.

Resumo: 42 tropeços em 8 questões. Gabarito certo nas 8, distratores todos conferem com o erro descrito. Bugs de conta ou gabarito: 0. Bug de texto: 4 (conferência das 4 questões MANTIDAS esp-00a, com-00a, com-00c, com-00d ainda no formato antigo, com "A = ..." e uma letra sobrando, ex. "C. Erros:").

| Questão | Tropeços | Nível |
|---|---|---|
| esp-00a | 8 | fácil demais (ENEM difícil) |
| esp-00b | 6 | acima |
| esp-00c | 4 | fácil demais |
| esp-00d | 6 | fácil demais (ENEM difícil) |
| com-00a | 6 | fácil demais (ENEM difícil) |
| com-00b | 6 | acima |
| com-00c | 4 | fácil demais |
| com-00d | 2 | no nível Fuvest, abaixo da meta |

Tipo que mais se repete: conta com vírgula, fração ou divisão sem passo (tipo 19: 11 vezes). Depois: número que aparece do nada (tipo 10: 7), geometria sem figura ou figura depois da conta (tipo 3: 5), fórmula sem origem (tipo 2: 4), e conferência no formato antigo "A = ..." nas 4 mantidas (tipo 17).

---

## d2-escada-mat-ita-esp-00a (suco em copos cônicos, MANTIDA) — 8 tropeços

Conta refeita: suco = π · 25 · 18 = 450π; copo a 80% = 75π · 0,512 = 38,4π; 450 ÷ 38,4 = 11,72 e 11 copos inteiros. Distratores: A 6 (borda, 450 ÷ 75), B 7 (80% do volume, 450 ÷ 60 = 7,5), D 12, E 15 (600 ÷ 38,4 = 15,6) conferem.

1. [Passo 1, fórmulas] "π · r² · h" -> o que é π? (tipo 1). A 1ª aparição é a tela das fórmulas; "π é um número fixo (cerca de 3,14)" só vem no passo 4. Correção: explicar π na 1ª tela em que aparece.
2. [Passo 1, fórmulas] "⅓ · π · r² · h" -> de onde saiu o ⅓ do cone? (tipo 2).
3. [Passos 4 e 5] "Raio = diâmetro ÷ 2 = 5 ... π · 25 · 18" e "raio²" -> de onde veio o 25? (tipos 10 e 12). "raio²" nunca é lido como "raio vezes raio". Correção: escrever "raio · raio = 5 · 5 = 25".
4. [Passo 8, volta] "O π aparece nos dois e se corta: 450 ÷ 38,4" -> por que cortar? (tipo 18). Sem teste com número pequeno (6π ÷ 3π = 2, igual a 6 ÷ 3).
5. [Passo 8] "dá 11 e um pouco (≈ 11,7)" -> de onde veio o 7? (tipo 10). A conta mostrou 4 500 ÷ 384 = 11 e sobram 276; 276 ÷ 384 não aparece.
6. [Passo 7] "75π · 0,512 = 38,4π (75 · 0,512 = 38,4)" -> conta com vírgula sem passo (tipo 19). Correção: 75 · 512 = 38 400, três casas depois da vírgula: 38,4.
7. [Passo 9] "11 · 38,4 = 422,4 ... o 12º precisaria de 460,8" -> as duas contas sem passo (tipo 19).
8. [Passos 4 a 7] Geometria sem figura: garrafa, copo cheio e copo a 80% nunca são desenhados (tipo 3; o aluno espera a figura com as medidas marcadas antes da equação).

Bug de texto: conferência começa "alternativa C. ... C. Erros: A = ..." (o "C." sobrando e "A =" sem "Alternativa", tipo 17).

Nível: FÁCIL DEMAIS para ITA/IME. A ideia central (volume vai ao cubo, 0,8³ = 0,512) está pronta na aula Antes (a tabela até traz o 0,8 e o 0,512). Resto é conta de ENEM difícil. Âncora ENEM 2022 coerente com o nível.

---

## d2-escada-mat-ita-esp-00b (copo de pirâmide, gole e virada) — 6 tropeços

Conta refeita: copo 240 cm³; bebida 0,512 · 240 = 122,88; depois do gole 92,88; vazio 147,12 = 0,613 do copo; k = 0,8496, a = 16,99, h = 3,01. Resposta B (3,0) certa. Distratores: A 4,3 (sem gole, 4,26), C 5,4 (20 − 14,6), D 6,3 (80% da altura como 80% do volume, 6,25), E 7,7 (sem raiz, 7,74) conferem.

1. [Passo 4, equação] "h = 20 − a e k³ = V ÷ 240" -> de onde vem o 240, e como leio "k³"? (tipos 10 e 12). O 240 nasce no passo seguinte e "k³" não tem leitura (a Antes usa k · k · k). Correção: "k · k · k = V ÷ volume do copo" e o 240 só depois de calculado.
2. [Passo 5] "Volume da pirâmide = ⅓ · base · altura" -> de onde vem o ⅓? (tipo 2).
3. [Passo 5] "razão 16 ÷ 20 = 0,8" -> divisão com resultado decimal sem passo (tipo 19; a Antes ligada não tem "dividir").
4. [Passo 5] "0,512 · 240 = 122,88" -> conta com vírgula sem passo (tipo 19). Correção: 512 · 24 = 12 288 e três casas depois da vírgula, mais o zero de 240.
5. [Passo 7] "240 · 0,6 = 144, sobram 3,12; 3,12 ÷ 240 = 0,013" -> de onde veio o 0,6 e como se divide 3,12 por 240? (tipos 10 e 19). Para tirar 147,12 ÷ 240 o aluno precisa de 3 contas sem passo; na prova, sem calculadora, é o ponto mais lento da questão.
6. [Passo 8] "Logo k ≈ 0,85" -> o salto de 0,614 para 0,613 passa batido ("quase 0,613" com diferença de 0,001 e k = 0,85 sem dizer quanto erra a altura). Correção: dizer que 0,85 · 20 = 17 e que um erro de 0,01 em k move a altura em 0,2 cm, menos que o espaço entre as alternativas (tipo 5: pegadinha de precisão não dita).

Nível: ACIMA. 3 camadas: (1) bebida de ponta para baixo é pirâmide semelhante, (2) depois do gole e da virada o vazio é a pirâmide pequena do topo, (3) raiz cúbica por limites sem calculadora. Âncora IME 2021, "parcial". As alternativas são bem espaçadas, e o erro de 0,3 do 4,3 só aparece por quem esqueceu o gole.

---

## d2-escada-mat-ita-esp-00c (vareta na caixa, só soma das arestas e área) — 4 tropeços

Conta refeita: S = 96 ÷ 4 = 24; P = 376 ÷ 2 = 188; d² = 576 − 376 = 200; d = 14,14; maior inteiro que cabe 14. Só existe uma caixa de lados inteiros (6, 8, 10), mas todas as caixas com esses dados dão d² = 200. Distratores: A 15, B 19 (raiz de 388), D 24, E 30 (raiz de 952) conferem. Checagem 3 x 4 x 12 (76; 192; d = 13) confere.

1. [Passo 3 e peças] "d² = a² + b² + c²" -> onde aprendi isso, e por que a diagonal é "o maior que cabe"? (tipos 2, 4 e 14). A Antes `pitagoras` só faz o triângulo plano (3, 4, 5); o bloco em 3 dimensões e a afirmação "a maior vareta é a diagonal" não têm caso nem teste com número.
2. [Passo 5] "4a + 4b + 4c = 4 · (a + b + c) = 96" -> tirar o 4 de dentro (tipo 18), sem teste (4 · 2 + 4 · 3 = 20 e 4 · (2 + 3) = 20).
3. [Passo 6] "2ab + 2bc + 2ca" -> como leio "ab"? e onde vejo as 2 faces de cada tipo? (tipos 12 e 3). A Antes usa "a·b" com ponto; aqui "ab" colado, e o desenho só mostra a caixa, sem as 6 faces marcadas.
4. [Passo 7 e alternativa A] "cerca de 14,1" na explicação e "14,14" na alternativa A -> de onde veio o 14,14? (tipo 10). A explicação nunca chega a 14,14 (200 − 196 = 4 e 4 ÷ 28 não aparecem).

Nível: FÁCIL DEMAIS. A aula Antes `esp-quadrado-da-soma` entrega a identidade pronta (a² + b² + c² = (a + b + c)² − 2 · (ab + bc + ca), com o exercício quase igual). Sobram 4 passos. A âncora diz que a identidade era a "escondida" do ITA 2023; com a Antes ligada ela deixa de ser escondida. Correção possível (não aplicada): tirar a identidade da Antes e deixar só "(a + b)²" de dois números.

---

## d2-escada-mat-ita-esp-00d (caixa x tubo de bolas, r some) — 6 tropeços

Conta refeita (π = 3): bola 4r³, 8 bolas 32r³; caixa 64r³, vazio 1/2; tubo 3 · 4r² · 8r = 96r³, vazio 2/3; (2/3 − 1/2) ÷ (1/2) = 1/3 = 33,3%. Resposta D certa, independente de r (testado com r = 1/2, 7/3, 13). Distratores: A 16,7 (1/6), B 25 (1/6 ÷ 2/3), C 50 (vazio da caixa), E 100 (64 contra 32) conferem.

1. [Passo 3, letras] "b: volume das 8 bolas, em r³" -> o "b" não está na fórmula "P = (t − c) ÷ c · 100" (tipo 16; as letras da fórmula são P, t e c).
2. [Passo 4] "Volume da esfera = 4/3 · π · r³ = 4/3 · 3 · r³ = 4r³" -> de onde vem a fórmula da esfera, o que é π, como leio "r³", e "4/3 · 3 = 4" sem passo (tipos 2, 1, 12 e 19). O enunciado diz "Use π = 3" sem dizer o que é π.
3. [Passos 5 e 6] "2 · 2r = 4r" -> por que a bola tem largura 2r? (tipo 10). Diâmetro = 2 · raio nunca é dito nesta questão.
4. [Passos 5 e 6] Nenhum desenho da caixa (2 camadas de 4) nem do tubo (4 camadas de 2) (tipo 3). A arrumação em 3 dimensões só existe no texto do enunciado.
5. [Passo 8, volta] "(1/6) ÷ (1/2) = 1/6 · 2" -> dividir por fração (tipo 4). A Antes `fracoes` só soma, subtrai e troca de forma; "dividir por 1/2 é multiplicar por 2" não foi ensinado.
6. [Passo 8] "P = 1/3 · 100 = 33,3 (100 ÷ 3)" -> conta com vírgula sem passo (tipo 19). Ainda lê-se "33,3" sem o "..." (a questão pede percentual aproximado, mas a alternativa não diz).

Nível: FÁCIL DEMAIS (ENEM difícil). A pegadinha de base da porcentagem está dada pela Antes `esp-quanto-maior-em-percentual` e o exercício 2 dela é a mesma conta de ponta a ponta. A parte que ensina é o r sumir, e ela é boa; mas falta ITA/IME: ninguém precisa decidir nada além de montar volumes.

---

## d2-escada-mat-ita-com-00a (ficha no ladrilho, MANTIDA) — 6 tropeços

Conta refeita: sem tocar 4 · 4 = 16; cantos 4 · 9 = 36; um rejunte 100 − 16 − 36 = 48 (4 faixas de 3 · 4 = 12); P = 48 ÷ 84 = 4/7. Resposta D certa. Distratores: A 12/25 (48/100), B 3/7 (36/84), C 9/25 (36/100), E 4/21 (16/84) conferem.

1. [Passo 4, equação] "P = E ÷ (100 − N)" -> o 100 e o "100 − N" aparecem antes de serem explicados (tipos 10 e 16). A "condição" só é explicada no último passo, depois da equação.
2. [Passo 6] "O centro fica no quadrado de dentro: 10 − 3 − 3 = 4 cm" -> o quadrado de dentro não está desenhado neste passo (tipo 3); o desenho com as regiões só vem 2 passos depois.
3. [Passo 7] "um canto de 3 · 3 = 9 ... (3 + 3 = 6 < 10)" -> como leio "<"? (tipo 12). A Antes `com-condicional` não tem desigualdade.
4. [Passo 8] "4 faixas de 3 · 4 = 12" -> de onde veio o 4 da faixa? (tipo 10). É o lado de dentro (10 − 3 − 3), nunca dito aqui.
5. [Passo 9] "dividindo em cima e embaixo por 12" -> por que 12? (tipo 19). A Antes `fracoes` ensina multiplicar em cima e embaixo; achar o 12 comum não foi mostrado.
6. [Conferência] "Erros: A = Esqueceu a condição ..." -> nome de alternativa igual ao de região e de letra (tipo 17), e a letra sobrando no início ("D. Erros").

Nível: FÁCIL DEMAIS para ITA/IME (no nível ENEM difícil / Fuvest). Ideia certa: trocar a ficha por um ponto, regiões e condicional. A âncora (ENEM 2019 q.173) é o mesmo patamar. O distrator de R$ 80 e R$ 2 é bom (tipo 5 tratado na tela "O que eu tenho").

---

## d2-escada-mat-ita-com-00b (painel de 12 lâmpadas, REESCRITA) — 6 tropeços

Conta refeita por enumeração: 4 096 painéis, 377 aprovados, 56 com 5 acesas; a(n) = 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377; C(8,5) = 56; P = 56/377 = 0,1485. Resposta C certa. Distratores: A 7/512, B 21/233, D 99/512, E 56/233 conferem. Checagem (5 lâmpadas, 2 acesas, 6) confere por enumeração.

1. [Passo 4 a 8, T] "a(12) = a(11) + a(10)" -> abstração sem caso (tipo 3): nenhum painel de 3 ou 4 lâmpadas é desenhado para ver que "acesa: a anterior tem de ser apagada" gera a soma. Só o painel de 2 lâmpadas é listado.
2. [Passo 3, equação] "Cada painel tem a mesma chance (1/2, doze vezes)" -> qual é a chance de um painel? (tipo 4). Nenhum passo diz "1/2 · 1/2 · ... = 1/4 096", e a condição "entre os aprovados" (probabilidade condicional) não é ensinada pela Antes ligada: o `com-condicional` não está na lista da questão (só `com-probabilidade`, `com-combinacao`, `fracoes`).
3. [Passo 9] "Ponha as 7 apagadas em fila: ficam 8 vãos" -> "vão" é palavra comum com sentido técnico e não há desenho (tipos 8 e 3). Correção: desenhar 7 apagadas com os 8 espaços numerados.
4. [Passo 9] "Cada acesa vai num vão diferente, e assim nenhuma fica ao lado de outra" -> e todo painel aprovado com 5 acesas aparece assim, sem faltar nenhum? (tipo 2: a volta não é mostrada). Quem confere com "5 lâmpadas, 2 acesas" na checagem ganha o caso; a explicação principal não o faz.
5. [Passo 11, volta] "377 = 13 · 29 e 56 = 8 · 7: não há fator comum" -> de onde saiu o 13 · 29? (tipos 10 e 19). A fatoração de 377 não aparece.
6. [Passo 11] "56 ÷ 377 é cerca de 0,15, um pouco menos que 1 em 6" -> divisão sem passo e "1 em 6" nunca definido (tipos 19 e 12).

Nível: ACIMA. É a melhor das 8: precisa de duas ideias separadas (recorrência de Fibonacci sobre a última lâmpada, e vãos entre as apagadas), nenhuma cabe em lista à mão (4 096 painéis). Âncora ITA 2021 e HMMT 2022 coerente. Única ressalva: a alternativa B (21/233) só pega quem erra o contador, não quem erra a ideia.

---

## d2-escada-mat-ita-com-00c (exame duas vezes, MANTIDA) — 4 tropeços

Conta refeita: doentes 100 + 500 = 600; sadias 9 400; 1º positivo: 540 e 940; 2º positivo: 486 e 94; 486 ÷ 580 = 0,838, ou seja 84%. Resposta A certa. Distratores: B 36% (540 ÷ 1 480 = 0,365), C 81%, D 90%, E 94% conferem.

1. [Passo 4] "A tabela diz que 2% e 10% são as pessoas com a doença" -> a frase repete e confunde: a tabela já tinha dito "com a doença" (tipo 15; fala que não ensina nada novo).
2. [Passo 5 e 6] "90% de 600 = 600 ÷ 100 · 90 = 540" e "90% de 540 = 540 ÷ 100 · 90 = 486" -> a segunda conta passa por 5,4 · 90, conta com vírgula sem passo (tipo 19). O mais difícil da questão é só esta multiplicação.
3. [Passo 8, volta] "580 · 0,8 = 464 e sobram 22; 22 ÷ 580 é cerca de 0,04" -> divisão sem passo (tipo 19).
4. [Conferência] "Erros: B = Parou no 1º exame (540 de 1 480)" -> de onde veio o 1 480 (tipos 10 e 17)? Nunca é calculado nas telas (540 + 940 não aparece) e a letra "B =" não vem com "Alternativa".

Nível: FÁCIL DEMAIS. Só porcentagem de porcentagem, contando pessoas. A Antes `com-bayes` entrega o procedimento de uma rodada, e a segunda rodada é repetir a mesma coisa. Âncora ENEM/Fuvest coerente, mas a meta é acima.

---

## d2-escada-mat-ita-com-00d (tabela de pontos, 2 empates, MANTIDA) — 2 tropeços

Conta refeita: 15 jogos; 45 − 43 = 2 empates (e é possível: 11 resultados de campeonato dão exatamente essa tabela, todos com 2 empates); C(13,2) = 78, C(15,2) = 105; 78/105 = 26/35; 1 − 26/35 = 9/35. Resposta C certa. Distratores: A 1/105, B 2/15, D 4/15, E 26/35 conferem.

1. [Passo 8] "13 · 12 ÷ 2 = 78" e "15 · 14 ÷ 2 = 105" -> as multiplicações 13 · 12 e 15 · 14 e "78/105 = 26/35 (dividindo por 3)" sem passo (tipo 19).
2. [Conferência] "Erros: A = Calculou ..." -> nome de alternativa sem "Alternativa" (tipo 17), mais a letra sobrando no início.

Entendi sem tropeço: a ideia de que cada empate tira 1 ponto, o caso com 3 times (3 jogos), o "pelo menos um é tudo menos nenhum".

Nível: no nível FUVEST 2ª fase, abaixo da meta ITA/IME. A invariante "cada empate tira 1 ponto" é bonita, mas depois dela são 4 contas curtas. Âncora HMMT 2021 coerente com a ideia, não com o tamanho.

---

## O que mais se repete

Conta com vírgula, fração ou divisão sem passo (tipo 19: 11 vezes nas 8 questões), seguida de número que aparece do nada (tipo 10: 7). Nenhum bug de conta ou gabarito. Questões fáceis demais para a meta ITA/IME: esp-00a, esp-00c, esp-00d, com-00a, com-00c, com-00d (6 de 8). Acima de verdade: esp-00b e com-00b (2 de 8).
