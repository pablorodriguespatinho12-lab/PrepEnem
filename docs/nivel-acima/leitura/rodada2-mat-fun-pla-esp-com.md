# Leitura do aluno-do-zero, rodada 2: Matemática fun / pla / esp / com (16 questões)

Data: 24/11/2026. Lido: enunciado, alternativas, explicação inteira (ideia, peças, passos com figuras, checagem) e as aulas "Antes" ligadas em `data/revisao-final/antes-da-questao.json`. O que a Antes ensina não foi contado como tropeço. Só entram tropeços NOVOS ou que CONTINUAM da rodada 1 (`matematica-equ-fun-pla.md`, `matematica-esp-com.md`).

## Resultado

Contas e gabaritos refeitos por script: **16 de 16 batem, 0 conta errada.** Os 4 distratores de cada questão também conferem com o erro descrito. Conferências extras: o campeonato da com-00d existe de verdade (busca por força bruta achou jogos que dão exatamente a tabela 17-15-13-11-9-6-4-3 com 6 empates); a caixa da esp-00c existe (x = y ≈ 9,15 e z ≈ 5,69); o triângulo da pla-00c existe (catetos 20 e 21). As 16 checagens (pergunta final com 3 ou 4 opções) também batem.

Bugs de fato: **0 de conta, gabarito ou dado.** Só 4 de texto (abaixo). Nenhuma contradição entre enunciado e tabela.

45 tropeços em 16 questões (rodada 1 tinha 78 só nas 12 de equ/fun/pla). Questão limpa: pla-00c.

| Questão | Tropeços | Observação |
|---|---|---|
| fun-00a | 4 | |
| fun-00b | 5 | 2 continuam |
| fun-00c | 3 | |
| fun-00d | 4 | 1 continua |
| pla-00a | 2 | |
| pla-00b | 3 | 2 continuam, falta figura |
| pla-00c | 0 | limpa |
| pla-00d | 3 | + 1 erro de texto |
| esp-00a | 3 | 2 continuam, + 1 erro de texto, falta figura |
| esp-00b | 4 | falta figura |
| esp-00c | 2 | 1 continua, falta figura |
| esp-00d | 1 | |
| com-00a | 3 | + 1 erro de texto |
| com-00b | 3 | |
| com-00c | 3 | |
| com-00d | 2 | |

Tipo que mais se repete: letra ou número que aparece antes de nascer (tipos 10 e 16: 8 vezes). Depois: passo de álgebra ou conta sem o porquê (tipos 18 e 19: 8 vezes), palavra comum com sentido técnico (tipo 8: 5 vezes) e geometria sem figura (tipo 3: 4 questões).

## Bugs vistos (texto, nenhum de conta)

1. [pla-00d, ideia] "...dão os lados. os dois triângulos sobre AD e BC..." -> frase começa com minúscula depois do ponto.
2. [esp-00a, ideia] "...menos a perda. antes, ache quanto líquido..." -> mesma minúscula depois do ponto (ordem das frases também está trocada: "antes" vem depois do ponto).
3. [fun-00c, passo 13] "de 1 a 5 são 5 números, não 4: 5 − 1 + 1" -> sobra de uma correção da rodada 1; aqui ninguém falou em 4 números, a frase não explica nada da questão.
4. [com-00a, passo 11] "o jeito 2 + 2 tem o dobro de área do outro" -> são chances (144/625 contra 72/625), não áreas.

Figura ausente onde a geometria exige (4 casos):
- pla-00b passos 3 e 4: a divisão do semicírculo H em triângulo T e dois pedaços é descrita em texto; a figura só vem no passo 5.
- esp-00a passo 5: a garrafa (10 cm de diâmetro, 24 de altura, 3/4 cheia) nunca é desenhada; só o copo tem figura.
- esp-00b passo 6: o copo de ponta para baixo com bebida até 16 cm não tem figura; o desenho do passo 3 mostra só o copo já virado.
- esp-00c passo 6: "6 faces, 2 de cada tipo" sem as faces marcadas na figura (continua da rodada 1).

---

## d2-escada-mat-ita-fun-00a (bolo de cenoura) — 4 tropeços

Conta refeita: q = 200 − 4p, vértice em p = 30, lucro em p = 25 é 1 200; distratores 900, 1 300, 1 500, 1 600 conferem.

1. [Passo 5] "−4 · (p − 20) é −4 vezes p e −4 vezes −20: −4p + 80" -> "menos vezes menos dá mais" não foi dito (tipo 18). A Antes só tem "número que falta".
2. [Passos 7 e 8] "uma parábola aberta para baixo", "raízes", "o vértice fica no meio" -> parábola, raiz e vértice entram como conteúdo novo dentro da explicação, e a Antes não os ensina (tipos 4 e 19). As peças dão 1 linha cada, sem exercício.
3. [Passo 3 e passo 9] "o preço tem teto" / "o último" -> o enunciado diz "não pode passar de R$ 25"; "teto" é palavra comum com sentido técnico (tipo 8).
4. [Passo 4] "−4 bolos por real" -> como se lê: por cada 1 real (tipo 12).

Nível: moderado; reta, lucro em parábola e teto são 3 ideias, mas sem Antes de parábola o aluno aprende dentro da explicação.

## d2-escada-mat-ita-fun-00b (f(x) + 2 f(1/(1 − x)) = x) — 5 tropeços

Conta refeita: u = −5/6, v = w = 2/3; as 3 equações conferem; ciclo 1/2 → 2 → −1 → 1/2 confere.

1. [Passo 3, equação e texto] "u + 2v = ...; v + 2w = ...; w + 2u = ..." e "v do ponto seguinte do ciclo" -> "ciclo" e os pontos só nascem nos passos 5 e 6; as reticências não se leem (tipos 10, 12 e 16). CONTINUA da rodada 1.
2. [Passo 4] "o 1º passo 'Achando' mostra de onde vem esse ciclo" -> a frase fala da própria aula, não do conteúdo (tipo 15). CONTINUA.
3. [Passo 9] "Da 2ª equação, v = 2 − 2w" -> falta o porquê (tirar 2w dos dois lados) e um teste (tipo 18). O passo 8 faz o mesmo com a 3ª equação sem teste também.
4. [Passo 11] "u + 2 · (4 + 4u) = ... 9u + 8" -> u + 8u = 9u (juntar os u) não é dito (tipo 19).
5. [Passo 11] "9u = 1/2 − 8" -> passar o 8 para o outro lado sem o porquê (tipo 18).

Nível: acima de verdade (ciclo de 3 e sistema 3×3 em f desconhecida).

## d2-escada-mat-ita-fun-00c (t⁴ − 6t² + k = 0) — 3 tropeços

Conta refeita (todos os k de −10 a 20 por script): exatamente 2 soluções em 11 valores (k = −10 a −1 e k = 9). Checagem (t⁴ − 4t² + k) dá 6. Conferem.

1. [Passo 13] "de 1 a 5 são 5 números, não 4: 5 − 1 + 1" -> "não 4" vem do nada (bug de texto 3 acima; tipos 10 e 15).
2. [Passos 8 e 12] "h(0) = 0 e h(−1) = 7, então um u está entre −1 e 0" -> por que h passa por 1 entre esses dois pontos (tipo 2)? Falta dizer que a curva não pula valores.
3. [Enunciado] "−10 ≤ k ≤ 20" -> "≤" nunca é lido; só "≥" é lido, no passo 10 (tipo 12).

Nível: acima (5 regimes de k; a tabela guia).

## d2-escada-mat-ita-fun-00d (f aplicada 2 026 vezes) — 4 tropeços

Conta refeita: f³ = identidade, 2 026 = 3 · 675 + 1, f(x) = x dá x² − x + 1 = 0, Δ = −3, N = 0. Checagem f⁷(2) = −1 confere.

1. [Passo 5] "1 − 1/(1 − x) = (1 − x)/(1 − x) − 1/(1 − x)" -> por que 1 vira (1 − x)/(1 − x) (tipo 18). A Antes de fração só troca "1/3 = 2/6".
2. [Passo 6] "Dividir por uma fração é inverter: vira (1 − x)/(−x)" -> regra sem caso com número nesta questão (tipos 7 e 4). CONTINUA da rodada 1 (a questão fun-00b tem "quantos meios cabem em 1", esta não).
3. [Enunciado, tabela] "x diferente de 0 e de 1" -> o 1 faz sentido (f não existe), e o 0? Nunca é dito que f(0) = 1 e f(1) não existe (tipo 5).
4. [Passo 11] "Teste de 1/(1 − x) = x com x = 2: 1/(−1) = −1, e 2 não é −1" -> o teste mostra que 2 não resolve, mas não testa o passo de passar tudo para um lado (tipo 18).

Nível: acima (ciclo + resto + discriminante, resposta 0).

---

## d2-escada-mat-ita-pla-00a (gramado em L) — 2 tropeços

Conta refeita: 1 050 m²; 1 155 m²; 9 m² por pacote; 128,3 → 129. Distratores 117, 128, 193, 700 conferem.

1. [Passos 1 e 4] "10% a mais: × 1,1" e "P = 1,1 · G ÷ 9" -> 1,1 e 9 aparecem antes de nascer (passos 6 e 7) (tipo 10). A leitura da equação diz o que são, mas o aluno ainda não viu a conta.
2. [Passo 6] "(É o mesmo que 1 050 · 1,1: 110% é 110 ÷ 100 = 1,1.)" -> conta com vírgula dentro de parênteses, sem passo (tipo 19); a Antes tem "aumentar 10% é × 1,10", então é leve.

Nível: fácil demais (5 passos, 0 ideia nova), mas as 2 pegadinhas estão avisadas.

## d2-escada-mat-ita-pla-00b (semicírculos e Γ) — 3 tropeços

Conta refeita: AC = 15; S = 8π, R = 28,125π, H = 36,125π; S + R = H; L = 60. Distratores 30, 68, 113,43, 120 conferem. Existência da região confere (lúnulas de Hipócrates).

1. [Passos 3 e 4] "O meio círculo de Γ do lado do triângulo ... é o semicírculo H ... em três partes" -> sem figura marcada (tipo 3; princípio dele). CONTINUA da rodada 1 (a figura veio no passo 5, depois do texto).
2. [Passos 3 a 5] "H", "T", "S", "R" -> as letras são usadas antes da lista do passo 6, e S, R e H não são iniciais de nada (tipo 16). CONTINUA.
3. [Enunciado e alternativas] "ABC, AB, AC, BC" ao lado de "alternativa A, B, C" -> pontos do triângulo e alternativas com a mesma letra (tipo 17). Na explicação ela está por extenso, só o enunciado mistura.

Nível: acima de verdade (uma ideia decisiva: Pitágoras vale para áreas de semicírculos).

## d2-escada-mat-ita-pla-00c (círculo no triângulo) — limpa

Conta refeita: soma dos catetos 41; produto 420; área 210; semiperímetro 35; r = 6; fora do círculo 96,96. Distratores 113,04, 181,74, 191,16 e 210 conferem; o triângulo existe (20, 21, 29). Todo passo de conta tem teste ou decomposição; figura com "?" nos catetos e "r"; a Antes ensina Pitágoras, círculo inscrito, área do círculo e vírgula. Nenhum tropeço novo.

Nível: acima, moderado (2 ideias: produto pelo quadrado da soma; semiperímetro e não perímetro).

## d2-escada-mat-ita-pla-00d (praça com ponto P) — 3 tropeços

Conta refeita: AD = 12, AB = 20; pedras 120 m² = R$ 3 000; 300y + 4 200 = 5 700; y = 5; d = 7. Distratores 2, 5, 6,75, 8 conferem. Figura da praça existe desde o passo 3 (tropeço da rodada 1 resolvido).

1. [Passo 4, equação] "5 700 = 20 · b · y + 5 · b · (h − y) + g" -> o 20 e o 5 não têm caminho até o R$ 40 e o R$ 10 (são a metade, por causa do ÷ 2 da área) (tipo 10). Nos passos 9 e 10 a mesma conta aparece como "40 · 10 · y", forma diferente.
2. [Peças] "Altura do triângulo" e "a altura h da praça" -> "altura" com dois sentidos na mesma questão: h = lado AD é "a altura" da praça, y é altura do triângulo PAB (tipo 8).
3. [Passo 7] "Seja x a distância de P ao lado AD" -> letra nova que não está na equação do passo 4 (tipo 16); só aparece nesse passo e some.

Erro de texto: ver bug 1.

Nível: acima (ideia do par de lados opostos soma metade da praça, preço único; a posição de P some).

---

## d2-escada-mat-ita-esp-00a (suco em copos cônicos) — 3 tropeços

Conta refeita: 450π; 675π; 607,5π; copo a 80% = 75π · 0,512 = 38,4π; 15,8 → 15. Distratores 10, 11, 16, 17 conferem.

1. [Passo 4, equação] "Cada copo leva vc de mistura ... vs, vm, vu, vc" -> "vc" lê-se "você" em mensagem; "vs", "vu", "vm" não são iniciais claras (tipos 12 e 16).
2. [Passo 1, fórmulas] "Por que ⅓: o cone cabe 3 vezes no cilindro igual" -> afirmação sem desenho nem número (tipo 2). Melhorou da rodada 1, mas continua só dita.
3. [Passo 5] garrafa 10 × 24 até 3/4 -> sem figura (tipo 3). CONTINUA da rodada 1 (o copo ganhou figura; a garrafa não).

Erro de texto: ver bug 2.

Nível: fácil demais para ITA/IME (a ideia 0,8³ está na Antes), conta de ENEM difícil.

## d2-escada-mat-ita-esp-00b (copo de pirâmide, gole e virada) — 4 tropeços

Conta refeita: 240 cm³; 122,88; 92,88; vazio 147,12 = 0,613 do copo; kr ≈ 0,849 → vazio 17 cm; bebida 3,01 cm. Distratores 4,3, 5,4, 6,3 e 7,7 conferem com o erro descrito (checadas as 4 contas).

1. [Passo 6] "Ponta para baixo, a bebida é uma pirâmide ... razão 16 ÷ 20" -> o copo de ponta para baixo com bebida até 16 cm nunca é desenhado (tipo 3).
2. [Passo 10] "Isso muda kr em menos de 0,001 e a altura em menos de 0,02 cm" -> afirmação sem conta (tipo 18); o aluno pergunta "por que menos de 0,001?".
3. [Passo 8] "14,712 ÷ 24 ... 24 · 0,6 = 14,4 ... 24 · 0,013 = 0,312" -> divisão decimal longa; os passos aparecem, mas "0,013" sai de tentativa (tipo 19). Na prova, sem calculadora, é o ponto mais lento.
4. [Passo 4, equação] "kr", "vv", "vp", "av" -> nomes de 2 letras sem inicial clara ("kr" lê-se como moeda) (tipos 12 e 16).

Nível: acima (3 camadas: semelhança, gole e virada, raiz cúbica por limites).

## d2-escada-mat-ita-esp-00c (vareta na caixa) — 2 tropeços

Conta refeita: sm = 24; pr = 188; dg² = 200; dg ≈ 14,14; lv = 12. Distratores 13, 14, 17, 21 conferem.

1. [Passo 6] "6 faces, 2 de cada tipo: 2 · x · y + 2 · y · z + 2 · z · x = 2 · pr" -> as 6 faces não estão marcadas no desenho (tipo 3). CONTINUA da rodada 1.
2. [Passos 9 e 10] "dg está entre 14,1 e 14,2" e depois "lv + 2 não passa de 14,1" -> a conta usa 14,1 como se fosse a diagonal; a conclusão (12) vale, mas o texto não diz por que 14,1 basta (tipos 10 e 14).

Nível: moderado; a identidade vem da Antes, mas a ideia de esconder as medidas ainda exige o passo 7.

## d2-escada-mat-ita-esp-00d (caixa x tubo de bolas) — 1 tropeço

Conta refeita: vb = 32r³; vt = 96r³; fc = 1/3; vn = 96r³; hn = 6r; (6r − 4r) ÷ 4r = 50%. Distratores 16,7%, 33,3%, 66,7% e 100% conferem. Figuras da caixa, do tubo e da caixa nova existem.

1. [Passo 4, letras] "fc", "vn", "vt", "vb", "ho", "hn" -> as letras de 2 letras não são iniciais claras (fc seria "fração do tubo", mas parece "caixa") (tipo 16).

Nível: fácil demais para ITA/IME (ENEM difícil); a parte que ensina é o r sumir, e ela é boa.

---

## d2-escada-mat-ita-com-00a (ficha no ladrilho) — 3 tropeços

Conta refeita: Pz = 4/25, Pd = 9/25, Pu = 12/25; 144/625 contra 72/625; Pq = 2/3. Distratores 1/3, 12/25, 4/5, 144/625 conferem.

1. [Passo 4] "Total 4 só sai de 2 + 2 (as duas tocam 1) ou de 4 + 0 (uma toca 0 e a outra 2)" -> mistura pontos (4, 2, 0) com rejuntes (0, 1, 2): "4 + 0" pontos é "0 e 2" rejuntes, e isso só está na tabela do enunciado (tipos 11 e 12).
2. [Passo 10] "Mesmo número embaixo: 144 + 72 = 216, e fica 144/216 (o 625 se corta)" -> dividir fração por fração e "cortar" sem o porquê (tipos 18 e 19). A Antes de frações só soma, subtrai e troca.
3. [Passo 11] "o jeito 2 + 2 tem o dobro de área do outro" -> chances, não áreas (bug de texto 4).

Nível: acima, moderado (probabilidade geométrica + soma de 2 ordens + condicional).

## d2-escada-mat-ita-com-00b (12 lâmpadas, 5 acesas, sem vizinhas) — 3 tropeços

Conta refeita (todas as 4 096 sequências por script): 377 aprovados; 56 com 5 acesas; P = 56/377. Distratores 7/512, 21/233, 99/512 e 56/233 conferem.

1. [Passo 4] "cada painel pesa igual (a conta está no 1º passo de T)" -> "pesa" é palavra comum com sentido técnico (tipo 8) e o parêntese remete a outro passo, não explica o conteúdo (tipo 15).
2. [Passo 5] "chance 1/2 doze vezes: 2 · 2 · ... dá 4 096" -> de onde vem o 4 096, e como se lê "..." (tipos 10 e 12).
3. [Passo 8] oito somas seguidas até 377 -> método que funciona, mas para 30 lâmpadas na prova não escala sem uma regra mais curta (tipo 9); aceitável aqui porque 12 é pequeno.

Nível: acima (recorrência sobre a última lâmpada + vãos entre apagadas); a melhor das 16.

## d2-escada-mat-ita-com-00c (exames, regra de 3) — 3 tropeços

Conta refeita: 750 doentes, 9 250 sadias; 0,972 e 0,028; 729 e 259; 729 ÷ 988 = 73,8%. Distratores 42%, 87%, 90% e 97% conferem.

1. [Passo 3 e conferência] "a regra acusa" -> "acusar" = classificar como doente nunca é dito (a letra diz "classifica"); palavra comum com sentido técnico (tipo 8). Também "regra de 3 exames" pode se confundir com "regra de três" da outra aula.
2. [Passo 6] "Nesses 0,18 há um 3º exame" -> quer dizer "dos que divergiram, faz-se o 3º"; o 0,18 não é "um grupo com exame dentro" para quem só viu números (tipo 15/10).
3. [Passo 7] "O 750 é 3/4 de 1 000. 0,972 · 1 000 = 972; 972 ÷ 4 = 243; 243 · 3 = 729" -> atalho legítimo, mas o aluno pergunta de onde veio o 3/4 de 1 000 e por que não multiplicar 750 · 0,972 direto (tipo 10).

Nível: acima, moderado (soma de caminhos da árvore com desempate + Bayes por contagem).

## d2-escada-mat-ita-com-00d (campeonato, empates, sorteio) — 2 tropeços

Conta refeita: 28 jogos; 84 − 78 = 6 empates; C(28,3) = 3 276; exatamente 1: 6 · 231 = 1 386; pelo menos 1: 3 276 − 1 540 = 1 736; 99/124. Distratores 11/26, 62/117, 121/157 e 225/244 conferem; o campeonato existe (força bruta).

1. [Passo 1, fórmulas] "Combinação: n · (n−1) · ... ÷ k!" -> "!" nunca foi lido (tipos 11 e 12); a Antes de combinação escreve "3 · 2 · 1".
2. [Passo 3, equação] "Pq = Xu ÷ Mu" -> "Xu" e "Mu" não são iniciais de nada (tipo 16).

Nível: moderado; a invariante dos pontos é boa, o resto são 4 contas de contagem.
