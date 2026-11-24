RELATÓRIO aluno-do-zero: 12 questões novas de Física (ond, opt, ele; 00a a 00d). Total: 54 tropeços. Li o agente (19 tipos), as 12 questões e as aulas Antes de cada uma. Conferi todas as contas e as 60 alternativas: nenhuma conta nem alternativa está errada. Só há 1 erro de texto numa alternativa (ond-00d) e 1 ambiguidade de enunciado (ond-00d); os dois estão abaixo.

BUG QUE VALE PARA 7 DAS 12: "Resposta: alternativa X." ficou literal em ond-00b, ond-00c, ond-00d, opt-00a, opt-00b, opt-00c e opt-00d. As outras 5 já têm a letra certa (ond-00a C, ele-00a C, ele-00b D, ele-00c E, ele-00d D). O X está no JSON `fisica-acima-novas.json` e nos scripts `scripts/banco-enem/v2/fis_ond.py` e `fis_opt.py`. O teste `nivel-acima-regras.test.ts` (linha 68) exige o texto "Resposta: alternativa X". Se nenhum passo troca o X pela letra na hora de publicar, o aluno lê "alternativa X". Conferir isso antes de publicar. Correção: ond-00b E, ond-00c A, ond-00d B, opt-00a B, opt-00b C, opt-00c D, opt-00d E.

AULAS ANTES QUE NÃO COBREM O QUE A EXPLICAÇÃO USA (a lista está dentro dos tropeços de cada questão):
- ond-00b: efeito Doppler.
- ond-00c: λ, v = λ·f e tubo fechado.
- ond-00d: modos da corda e v = 2·L·f1.
- ele-00b: I = ε ÷ (R + r), P = R·I·I e "máximo quando R = r".
- ele-00c: série e paralelo.
- ele-00d: lei dos nós e simetria.
- opt-00b: multiplicar frações e 3,0 ÷ 1,875.
- opt-00c: potência de dez dividindo (10³ ÷ 10⁸).

## 1. d2-escada-fis-ita-ond-00a (3 tropeços)
1.1 [passo "De onde vem (3 de 3)"] "O ponto · significa vezes." (tipo 1). O · já apareceu em "distância = velocidade · tempo" e em "1 500 · 0,2", antes desta tela. Correção: abrir o passo "De onde vem cada fórmula" com "O ponto · significa vezes: 1 500 · 2 é 1 500 vezes 2." e apagar a tela 3 de 3.
1.2 [tipo 17] "D = v · t ÷ 2", "D = 1 500 · 0,6 ÷ 2" ao lado de "Alternativa D = Deu a profundidade do fundo". Correção: trocar a letra da equação por "d" (de distância) e manter "Alternativa D" por extenso.
1.3 [passo "De onde vem (2 de 3)"] "1 500 · 8 = 12 000, ÷ 10 = 1 200" (tipo 10). Só o 0,2 foi explicado como "2 ÷ 10". Correção: "0,8 é 8 ÷ 10: 1 500 · 8 = 12 000 e 12 000 ÷ 10 = 1 200."
Nível: FÁCIL para "acima". São 3 contas (0,8 − 0,2; × 1 500; ÷ 2) e 1 ideia escondida (ida e volta), que o enunciado já diz ("vai e volta"). É nível ENEM 2023, o que a própria âncora declara.

## 2. d2-escada-fis-ita-ond-00b (5 tropeços)
2.1 [passo "De onde vem (1 de 3)"] "f = f0 · V ÷ (V − u)" e "as cristas chegam espremidas" (tipos 2, 4, 7, 16). Não há o que são f, f0, V e u, nem caso com número, nem aula Antes de Doppler. Correção: "f0 é a frequência da sirene parada; f é a que o microfone ouve; V = 340 m/s é o som; u é a velocidade da sirene. Com f0 = 400 Hz e u = 34 m/s: chegando, f = 400 · 340 ÷ 306 = 444 Hz (mais agudo); indo embora, f = 400 · 340 ÷ 374 = 364 Hz (mais grave)." Falta criar a aula Antes "Doppler".
2.2 [passo "Achando K"] "550 · (340 − U) = f0 · 340" vem de "f = f0 · V ÷ (V − u)" sem o passo (tipo 18). Correção: "Multiplico os dois lados por (340 − U) para sumir a divisão. Teste: 6 = 12 ÷ 2 → 6 · 2 = 12."
2.3 [símbolo trocado, tipos 11/12] "u" minúsculo nas fórmulas e na peça, "U" na equação. "Antes, o K que as liga" cita o K antes de ele existir. Correção: usar "u" em tudo; dizer "K é o número f0 · 340, igual nas duas frequências" antes de citá-lo.
2.4 [passo "Volta na equação"] "34 · 34 = 1 156", "5 780 ÷ 17 = 340" (tipo 19). Correção: "34 · 34 = 30 · 34 + 4 · 34 = 1 020 + 136 = 1 156. 5 780 ÷ 17: 17 · 300 = 5 100, sobram 680; 17 · 40 = 680; 300 + 40 = 340."
2.5 [mesmo passo] "f0 = 168 300 ÷ 340", "÷ 306", "÷ 374" (tipo 10). Esses números vêm do nada. Correção: "340 − 34 = 306 e 340 + 34 = 374; K = 550 · 306 = 168 300; f0 = 168 300 ÷ 340 = 495; 168 300 ÷ 374 = 450."
Observação: a resposta E (340 N) é igual ao dado "som 340 m/s". Não é erro, mas convida a chutar o número que está no enunciado.
Nível: DIFÍCIL de verdade. São 2 incógnitas (f0 e u) com 2 equações, e a ideia escondida é igualar para f0 sumir. Há 3 modelos encadeados (Doppler nos 2 sentidos e força da curva) e cerca de 8 contas.

## 3. d2-escada-fis-ita-ond-00c (5 tropeços)
3.1 [formulas e "De onde vem"] "diferença = λ ÷ 2", "v = λ · f" (tipos 1, 2, 7). O λ nunca é dito "comprimento de onda" antes da lista de letras. Não há o que são f e Hz, nem caso com número. Antes não cobre. Correção: "λ (lê-se 'lâmbda') é o comprimento de onda: a distância entre duas cristas. f é a frequência, em Hz: quantas ondas por segundo. Com número: 500 ondas por segundo de 0,68 m cada andam 500 · 0,68 = 340 m em 1 s, então v = λ · f."
3.2 [passo "De onde vem (1 de 2)"] "Cabe λ ÷ 4, depois 3 · λ ÷ 4, depois 5 · λ ÷ 4..." é regra sem número (tipo 7). Correção: "Com λ = 68 cm: λ ÷ 4 = 17 cm; 3 · λ ÷ 4 = 51 cm; 5 · λ ÷ 4 = 85 cm. A coluna de ar reforça nesses tamanhos (menos a folga)."
3.3 [tipo 17] "D = L ÷ 2" e "D" (diferença) ao lado de "Alternativa D". Correção: usar "dif".
3.4 [símbolo trocado] "V = λ · f = L · 500". O λ vira L, e v (fórmulas) vira V. Correção: usar "λ" ou "L" em tudo, e v ou V em tudo.
3.5 [passo "Achando D"] "34,0 cm = 0,34 m" (tipo 19). Correção: "1 m = 100 cm, então 34 cm = 34 ÷ 100 = 0,34 m."
Nível: ACIMA, mas de leve. Há 1 ideia escondida (a folga some na diferença dos dois níveis) e cerca de 5 contas em cadeia (D, L, V, T). Fica por pouco acima de ENEM difícil.

## 4. d2-escada-fis-ita-ond-00d (4 tropeços)
4.1 [passo "De onde vem (1 de 3)"] "os modos são f1, 2 · f1, 3 · f1...", "v = 2 · L · f1" (tipos 1, 2, 3). "Modo" e "fundamental" nunca são explicados, e Antes só ensina mdc. Correção: "Corda de 0,9 m presa nas pontas. Modo 1: uma barriga, a onda cabe meia vez (λ = 1,8 m). Modo 2: duas barrigas (λ = 0,9 m). Modo n: λ = 1,8 ÷ n, então f = n · f1. E v = λ · f dá v = 1,8 · f1." O λ e o v = λ·f não aparecem aqui (conferir se vêm de aula anterior).
4.2 [tela contra tela, tipo 11] "Não dá para só subtrair 700 − 420 = 280", e na tela seguinte "Troque o maior pela diferença: 700 − 420 = 280". Correção: na tela do mdc, avisar "aqui a subtração é um truque do mdc, não quer dizer que os modos são vizinhos".
4.3 [passo "(3 de 3)" e "Volta"] "420 ÷ 46,67 = 9 e 700 ÷ 46,67 = 15". O 46,67 é arredondado, então 420 ÷ 46,67 dá 8,9993, não 9 (tipo 11, igualdade falsa). Correção: "F = 140 ÷ 3. 420 ÷ (140 ÷ 3) = 420 · 3 ÷ 140 = 9; 700 · 3 ÷ 140 = 15."
4.4 [símbolo trocado] f1 (fórmulas e passos) vira F (equação), mais G e N, e "N = quantos F = G ÷ k..." não é equação. Correção: usar f1 em tudo e dizer "N = quantidade de valores de k".
Enunciado ambíguo (não contado como tropeço): "em outra situação, num modo de 700 Hz". Pode significar outra tensão, e aí a conta muda. Correção: "...e, com a mesma tensão, num modo de 700 Hz."
Texto errado na conferência: "Alternativa C = ... divisores de 140 que passam de 20 (20, 28, ...)". O 20 não "passa" de 20. Correção: "que são pelo menos 20".
Nível: DIFÍCIL de verdade. Há 3 ideias escondidas: modos não vizinhos, f1 = mdc ÷ k, e valores não inteiros com piso de 20 Hz. São poucas contas (mdc 140, k de 1 a 7, 7 valores).

## 5. d2-escada-fis-ita-opt-00a (4 tropeços)
5.1 [passo "Achando f" contra a lista de letras] "No início, w = 2 000 mm", mas a lista diz "w: ... quando a imagem tem 1,26 m" e "d: ... no início" (tipo 11). A fórmula das telas e da aula usa p', não w. A lista diz w e d "em m" e f "em mm", e a conta g = w ÷ f − 1 precisa da mesma unidade. Correção: em "Achando f", escrever "d = 2 000 mm: g = d ÷ f − 1". Usar a mesma letra da aula (p') ou avisar "w é o p' da aula". Pôr d, w e f todos em mm.
5.2 [tabela "O que eu tenho"] O enunciado traz "lâmpada de 150 W" e "carrossel de 24 slides", que não entram na conta e não são avisados (tipo 5). Correção: linha na tabela: "Lâmpada 150 W e 24 slides: não entram na conta."
5.3 [passo "Achando f"] "36 · 12,33" (tipos 10, 19). Correção: "2 000 ÷ 150 = 13,33 (150 · 13 = 1 950; sobram 50, que é 1/3 de 150). 13,33 − 1 = 12,33; 36 · 12,33 ≈ 444 mm."
5.4 [passo "Achando w"] "w ÷ f = g + 1" (tipo 18). Correção: "Somo 1 nos dois lados para tirar o −1. Teste: 36 − 1 = 35, então 35 + 1 = 36."
Nível: ACIMA moderado. Há 5 passos e a escolha da lente por 3 testes, mas a ideia central (g = p' ÷ f − 1, com o −1 em destaque) está inteira na aula Antes. É trabalhoso mais do que difícil.

## 6. d2-escada-fis-ita-opt-00b (5 tropeços)
6.1 [passo "A equação em letras"] "Agora é só achar u, k, q, N, f, s e g". São letras sem inicial: u = altura, k = vidro, q = líquido, s = posição da imagem. A aula e as telas usam n e p' (tipos 11, 12). Correção: h (altura do objeto), nv e nl (índices), p' (imagem), N (razão).
6.2 [passo "Achando s"] "1/f = 1/p + 1/s, com p = 40". O p não está na lista de letras (tipo 16). Correção: pôr na lista "p: distância do objeto à lente, em cm (40)".
6.3 [passo "Achando q"] "3,0 × 10⁸ ÷ 1,875 × 10⁸" (tipo 12). Como se lê: (3,0 × 10⁸) ÷ (1,875 × 10⁸)? Correção: escrever com parênteses e "os 10⁸ se cancelam".
6.4 [mesmo passo] "3,0 ÷ 1,875 = 1,6 (pois 1,875 · 1,6 = 3,0)" (tipo 19). Antes não ensina dividir por decimal. Correção: "3,0 ÷ 1,875 = 3 000 ÷ 1 875. 1 875 · 1 = 1 875; sobram 1 125; 1 875 · 0,6 = 1 125; então 1,6."
6.5 [passo "Achando f"] "(−1/16) · (2/15) = −2/240 = −1/120" (tipo 19). Antes só ensina somar e subtrair fração. Correção: "Multiplicar fração: em cima com em cima, embaixo com embaixo: (−1 · 2) ÷ (16 · 15) = −2/240. Divido em cima e embaixo por 2: −1/120."
Nível: DIFÍCIL de verdade, estilo ITA. São 7 grandezas encadeadas (nv, nl, N, f, p', g, i), 2 ideias escondidas (razão N com o meio e sinal do foco que vira divergente) e 4 armadilhas de sinal.

## 7. d2-escada-fis-ita-opt-00c (5 tropeços)
7.1 [tipo 17, o mais grave do lote] "Revestimento A, B, C, D" contra "Alternativa A ... E". Textos: "O D (1,50) é igual", "O maior que serve é o C", "Alternativa A = Escolheu o revestimento D". A certa é o revestimento C e a alternativa D. Correção: nomear os revestimentos "1,20 / 1,35 / 1,45 / 1,50" (ou 1, 2, 3, 4) e reescrever os erros ("escolheu o revestimento de 1,50").
7.2 [lista de letras] r, v, x, s, l, m, d. O "l" parece o número 1 ("l = 3 103,4 m"), x e m são tempos, e "m" também é a unidade metro (tipos 11, 12). Correção: tempo axial "ta", lento "tl", caminho "L", índice "nr".
7.3 [passos "Achando x" e "Achando m"] "3 000 ÷ (2,0 × 10⁸) = 1,5 × 10⁻⁵ s" e "1 551,7 ÷ 10⁸ = 1,5517 × 10⁻⁵" (tipo 19). Antes ensina 10⁻³ = 0,001, mas não "× 10³ ÷ 10⁸". Correção: "3 000 ÷ 2 = 1 500. 1 500 ÷ 10⁸ = 0,000 015 s. 1 µs = 0,000 001 s, então 0,000 015 s = 15 µs."
7.4 [passos "Achando s" e "Achando l"] "145 ÷ 150 = 29/30" e "90 000 ÷ 29 ≈ 3 103,4" (tipo 19). Correção: "145 ÷ 5 = 29 e 150 ÷ 5 = 30. 29 · 3 100 = 89 900; sobram 100; 100 ÷ 29 ≈ 3,4; então 3 103,4."
7.5 [passo "Volta"] "d = 15,52 − 15 = 0,52 µs" e logo depois "0,517 µs" (tipo 11, igualdade que não bate por arredondamento). Correção: "0,517 ≈ 0,52 µs (arredondado)".
Nível: DIFÍCIL de verdade. Há 2 ideias escondidas (índice igual não guia; raio mais lento = ângulo limite) e cerca de 7 passos. A conta é pesada: 90 000 ÷ 29 e potências de dez.

## 8. d2-escada-fis-ita-opt-00d (5 tropeços)
8.1 [passos "Achando m, p, q"] Nenhuma tela desenha a sala copiada e a reta a 45°. Só há "linhas verticais em x = 5 e x = 10" (geometria sem figura, regra de 22/11). Correção: tela "O desenho" com a reta atravessando 3 salas em x e 5 em y, linhas tracejadas x = 5, 10, 15 e y = 3, 6, 9, 12, 15, e cada cruzamento numerado.
8.2 [letras] "m = 15 m" e "m: distância andada em x". A letra m e a unidade m se misturam (tipo 12). Correção: usar "c" (comprimento até o canto).
8.3 [lista de letras] "p: reflexões nas paredes de 3 m (linhas verticais cruzadas)". Nenhuma tela diz por que a parede de 3 m é a linha vertical x (tipo 8). Correção: "A sala tem 5 m de largura (eixo x) e 3 m de altura (eixo y). As paredes dos lados medem 3 m: são as linhas x = 5, 10, 15."
8.4 [passos "Achando p" e "Achando q"] "São 15 ÷ 5 = 3 salas, menos a do canto" (tipo 8). A frase passa de "linhas" para "salas" sem avisar. Correção: "15 ÷ 5 = 3 linhas (x = 5, 10, 15). A de x = 15 é o canto e não conta: 3 − 1 = 2."
8.5 [passo "Volta"] "15 · √2 ≈ 21,2 m" (tipos 10, 5). Antes só mostra raízes exatas, e o percurso não entra na resposta. Correção: "Só conferência: √2 ≈ 1,414 (1,414 · 1,414 ≈ 2). 15 · 1,414 ≈ 21,2 m. Não precisa para a resposta."
Observação: a checagem (sala 4 × 2) é igual ao exercício 2 da aula Antes, então não mede nada novo.
Nível: FÁCIL para "acima". A ideia (desdobrar e usar mmc) está inteira na aula Antes, com o exemplo 4 × 2. Sobram 3 contas (mmc 15; 15 ÷ 5 − 1; 15 ÷ 3 − 1) com números pequenos.

## 9. d2-escada-fis-ita-ele-00a (5 tropeços)
9.1 [tela formulas] "U = m · c · ΔT (m em kg por segundo)" (tipo 11). A aula Antes usa Q, e U é a tensão (a questão tem 220 V). Correção: "calor por segundo = m · c · ΔT, com m em kg por segundo".
9.2 [tabela "O que eu tenho"] O enunciado diz "ligado em 220 V", que nunca entra e não é avisado (tipo 5). Correção: "Tensão 220 V: não entra na conta (a potência de cada posição já vem em W)."
9.3 [passo "Achando k: a posição"] "2 940 ÷ 0,8" (tipo 7). Por que dividir e não multiplicar? Correção: "Se o chuveiro puxa 100 W da tomada, só 80 W viram calor (100 · 0,8). Para 2 940 W de calor, ele puxa 2 940 ÷ 0,8."
9.4 [passos "Achando k"] "0,05 · 4 200 = 210" e "2 940 ÷ 0,8 = 3 675" (tipo 19). Correção: "0,05 = 5 ÷ 100: 4 200 ÷ 100 = 42 e 42 · 5 = 210. 2 940 ÷ 0,8 = 29 400 ÷ 8: 8 · 3 000 = 24 000; 8 · 600 = 4 800; 8 · 75 = 600; total 3 675."
9.5 [equação em letras] "R = k · h · v" e "R = R$ 75,60": R e R$ se confundem; k e kW/kWh também; v é preço e não velocidade (tipos 11, 12). Correção: C (custo), P (potência, kW), h, p (preço).
Nível: FÁCIL para "acima": é ENEM difícil por tamanho, não por ideia. São cerca de 9 contas e 3 ideias padrão (÷ 0,8, menor posição, custo pela potência elétrica). A aula Antes já traz "3 L por minuto = 0,05 kg por segundo", o mesmo número.

## 10. d2-escada-fis-ita-ele-00b (4 tropeços)
10.1 [passo "Achando P"] "P = R · I · I, com I = 12 ÷ (R + 1)" (tipos 2, 7). Não há de onde vêm a soma R + 1 nem a potência, e Antes não cobre. Correção: "A bateria equivalente tem 1 Ω por dentro, em fila com R: as resistências somam R + 1. Corrente = 12 ÷ (R + 1). Ex.: R = 5 → 12 ÷ 6 = 2 A. Potência = tensão em R × corrente = (R · I) · I: 5 · 2 · 2 = 20 W."
10.2 [mesmo passo] "O topo é em R = 1 Ω, igual a r" (tipo 14). Os 4 testes (0,5; 1; 2; 3) não provam o máximo, e Antes não ensina "máximo quando R = r". Correção: somar R = 0,8 (I = 6,67 A, P = 35,6 W) e R = 1,25 (I = 5,33 A, P = 35,6 W), os dois abaixo de 36 W, e dizer "vale sempre: potência máxima quando R = r".
10.3 [tela formulas] "ε e r pela regra do 'Antes'" aparece no lugar da fórmula (tipo 2). Correção: escrever "ε = (ε1 · r2 + ε2 · r1) ÷ (r1 + r2) e r = (r1 · r2) ÷ (r1 + r2)", dizendo que ε1 e r1 são a bateria 1.
10.4 [passo "Achando ε"] "54 ÷ 4,5 = 12 (pois 4,5 · 12 = 54)" (tipo 19). Antes dessa questão não tem dividir por decimal. Correção: "54 ÷ 4,5 = 540 ÷ 45 (× 10 nos dois) = 12."
Nível: DIFÍCIL de verdade, ITA clássico. São 3 ideias em cadeia (bateria equivalente, R = r, calorimetria), cerca de 8 contas, e a ideia R = r não está nas aulas Antes.

## 11. d2-escada-fis-ita-ele-00c (4 tropeços)
11.1 [tela formulas e passos "Achando p, j, U"] "Dois em paralelo: Rp = (X · Y) ÷ (X + Y)", "R1 em série", "tensão ... a mesma de R2", "R1 gasta os outros 7,5 V" (tipos 1, 2, 4). Série e paralelo nunca são ensinados nem aparecem em Antes, e X e Y não são definidos. Correção: "Série: a corrente é a mesma e as resistências somam (100 + 100 = 200). Paralelo (as duas pontas nos mesmos dois pontos): a tensão é a mesma nos dois, e a resistência única é X · Y ÷ (X + Y). Ex.: 2 Ω e 2 Ω: 4 ÷ 4 = 1 Ω (dois caminhos, passa mais corrente). Na fila, as tensões somam: 7,5 + 7,5 = 15 V." Falta criar a aula Antes "Série e paralelo".
11.2 [equação em letras] "Agora é só achar R, p, j e U". O "R" é a resistência de R3, entre R1 a R4 (tipos 11, 12). Correção: chamar de "R3".
11.3 [explicação toda] Não há desenho do circuito. O aluno só tem a tabela de linhas (circuito sem figura). Correção: desenhar R1 entre as linhas 1 e 2, R2 e R3 entre 2 e 3, e R4 com as duas pontas na linha 2, em laço.
11.4 [passo "Achando j"] "j = 15 ÷ 200 = 0,075 A" (tipo 19). Correção: "15 ÷ 200: 15 ÷ 2 = 7,5; ÷ 100 = 0,075."
Nível: FÁCIL para "acima". Há 1 ideia escondida (R4 em curto), cerca de 6 contas e números redondos (100 Ω, 200 Ω, 75 mA, 7,5 V). O resto é série e paralelo de livro.

## 12. d2-escada-fis-ita-ele-00d (5 tropeços; considerei o desenho existente)
12.1 [tipo 17] "E = F · R" e "Alternativa E = Deu a resistência de um resistor só". Os vértices "A" e "B" também batem com "Alternativa A/B", e na mesma tela "em A" é ampère e "A" é ponto. Correção: vértices P e Q, equivalente "Req", "A" só para ampère, "Alternativa E" por extenso.
12.2 [passos do 1/3, 1/6, 1/3] Toda a derivação é em letras (I ÷ 3, I ÷ 6), sem caso com número (tipo 7). Correção: "Com I = 6 A saindo de P: 3 arestas com 2 A; 6 arestas com 1 A; 3 arestas com 2 A. Quedas: 12 · 2 = 24 V; 12 · 1 = 12 V; 12 · 2 = 24 V. Total 60 V. Req = 60 ÷ 6 = 10 Ω."
12.3 [passo "Passando pelo meio"] "I ÷ 6 + I ÷ 6 = I ÷ 3, e é isso que a última aresta leva a B" (tipos 2, 4). Nenhuma tela ensina que a corrente que chega num vértice é a que sai. Correção: "Num vértice, o que chega é o que sai (a eletricidade não some nem aparece). Chegam 1 A + 1 A, saem 2 A."
12.4 [passo "Somando as quedas: o 5/6"] O parágrafo junta 5 ideias: I ÷ 3 = 1/3 de I, 1/3 = 2/6, a soma, a leitura de "cinco sextos" e a divisão por I (tipo de "duas ideias juntas"). A tela seguinte tem só "Por isso F = 5/6.". Correção: dividir em 2 telas: (a) as 3 quedas como fração de I · R; (b) 2/6 + 1/6 + 2/6 = 5/6 e dividir por I.
12.5 [peça "Simetria" e passo "Achando F"] "Os 3 vértices vizinhos de A são iguais entre si" (tipo 3). O aluno pergunta "por que as 3 correntes são iguais?". Correção: "Gire o cubo em volta da diagonal P–Q: as 3 arestas que saem de P trocam de lugar e o circuito fica idêntico. Por isso a corrente é a mesma nas 3."
Nível: DIFÍCIL de verdade. É uma ideia conceitual pesada (simetria + lei dos nós) em 3 etapas com 12 resistores. A conta final é leve (5/6 · 12).

## Contagem de tropeços
- ond-00a: 3
- ond-00b: 5
- ond-00c: 5
- ond-00d: 4
- opt-00a: 4
- opt-00b: 5
- opt-00c: 5
- opt-00d: 5
- ele-00a: 5
- ele-00b: 4
- ele-00c: 4
- ele-00d: 5
- TOTAL: 54 tropeços. À parte: o bug "alternativa X" em 7 questões, a ambiguidade do enunciado de ond-00d e o texto errado da alternativa C de ond-00d.

Mais frequente: letra trocada, confusa ou igual à da alternativa (tipos 11, 12, 17), 15 vezes. Em seguida vêm conta sem passo (tipo 19, 12 vezes) e fórmula ou regra sem origem e sem caso com número (tipos 2, 7; 9 vezes).

Nível, resumo:
- Difícil de verdade (7): ond-00b, ond-00d, opt-00b, opt-00c, ele-00b, ele-00d, e ond-00c (acima por pouco).
- Fácil para "acima" (5): ond-00a, opt-00d, ele-00a, ele-00c, e opt-00a (acima moderado, quase fácil).
- O padrão dos fáceis: a ideia inteira já está na aula Antes (opt-00a, opt-00d, ele-00a), ou resta 1 só ideia com números redondos (ond-00a, ele-00c).
