# Leitura do aluno-do-zero: Matemática equ / fun / pla (12 questões novas)

Data: 24/11/2026. Lido: enunciado, alternativas, explicação (ideia, peças, passos, checagem) e as aulas "Antes" ligadas de `data/revisao-final/antes-da-questao.json`. Gabaritos e contas refeitos por script (todas as 12 batem). O que a aula Antes ensina não foi contado como tropeço.

Resumo: 78 tropeços em 12 questões. Gabarito certo nas 12. Bugs de fato: 2 (equ-00c, pla-00b).

| Questão | Tropeços | Nível |
|---|---|---|
| equ-00a | 6 | acima (por tamanho) |
| equ-00b | 8 | acima |
| equ-00c | 8 | fácil demais |
| equ-00d | 6 | acima |
| fun-00a | 4 | fácil demais |
| fun-00b | 8 | acima |
| fun-00c | 6 | acima |
| fun-00d | 6 | acima |
| pla-00a | 3 | fácil demais |
| pla-00b | 8 | acima |
| pla-00c | 8 | acima (moderado) |
| pla-00d | 7 | fácil demais |

Tipo que mais se repete: passo de álgebra ou conta sem o porquê e sem número (tipos 18 e 19: 24 vezes). Depois: letra ou número antes de nascer (tipos 7, 10, 16: 15 vezes), nome de alternativa igual a nome de letra, tipo, plano ou ponto (tipo 17: 5 questões), palavra que a Antes não tem (tipo 1: 8 vezes) e geometria sem figura (tipo 3: 2 questões).

---

## d2-escada-mat-ita-equ-00a (lote de café) — 6 tropeços

Conta refeita: x = 60 kg, G = 3 120, V = 3 900, lucro 780 = 20% de 3 900. Distratores 40, 67, 73, 78 conferem com o erro descrito.

1. [Passo 3, letras] "x ... G ... P ... V" -> a fórmula é só G = 0,8 · V, mas a lista começa por x e P, que não estão nela (tipo 16). Correção: listar primeiro G ("gasto com os grãos, em reais") e V ("receita, em reais"); depois dizer "x e P não estão nesta equação: entram nos passos 4 a 6".
2. [Passo 1 e passo 5] "1 kg = 4 pacotes de 250 g" -> de onde vem o 4? (tipo 10/19). Correção: "1 kg = 1 000 g. Cabem 1 000 ÷ 250 = 4 pacotes de 250 g em 1 kg (4 · 250 = 1 000)."
3. [Passo 4] "É uma média ponderada: cada preço pesa pelos seus quilos." -> "média ponderada" não foi explicada em lugar nenhum (tipo 1). Correção: trocar por "É a soma de preço vezes quilos de cada tipo: 36 · 10 + 24 · 90."
4. [Passo 4 e passo 5] "24 · (100 − x) = 2 400 − 24x" e "0,8x + 0,75 · (100 − x) = 75 + 0,05x" -> por que 24 · (100 − x) vira 2 400 − 24x? e de onde sai 0,05? (tipos 18 e 19; a Antes não ensina abrir parêntese). Correção: "24 · (100 − x) é 24 vezes 100 e 24 vezes x, com o sinal de menos: 2 400 − 24x. Teste com x = 10: 24 · 90 = 2 160 e 2 400 − 240 = 2 160." E no passo 5: "0,75 · (100 − x) = 75 − 0,75x. Junte os x: 0,8x − 0,75x = 0,05x (80 centésimos menos 75 centésimos). Sobra 75 + 0,05x."
5. [Passo 7, tabela] "G: R$ 3 120 com x = 60 ... P: 312 ... V: R$ 3 900" -> esses números aparecem na tabela antes de a conta do passo 8 os produzir (tipo 10). Correção: tirar a tabela do passo 7 e pô-la no passo 8, depois das contas; ou escrever no passo 7 "daqui a pouco confiro G, P e V com x = 60".
6. [Alternativas e checagem] "Alternativa A = Respondeu os kg do tipo B" -> "tipo A" e "tipo B" têm o nome das alternativas A e B (tipo 17). Correção: escrever "alternativa A" sempre por extenso (já está na checagem) e, na pergunta e nas peças, "o café tipo A" por extenso no lugar de "tipo A" solto.

Ambiguidade leve do enunciado: não diz que o único custo do lote é o dos grãos (embalagem dos pacotes, energia da torra). Correção: acrescentar "O único custo do lote é o dos grãos crus."

Nível: ACIMA, por tamanho. 8 passos, 3 cadeias em x (custo, massa torrada, receita) e 1 ideia escondida (margem sobre a venda: custo = 0,8 · receita, com x dos dois lados). Dificuldade é de conta, não de ideia nova; a Antes dá a margem pronta.

---

## d2-escada-mat-ita-equ-00b (dois sistemas 3x3) — 8 tropeços

Conta refeita: I é a reta (5 − 5t)/3, t, (7 − t)/3; n = 4, m = 3, k = 4/5; conferência em t = 3 correta. Distratores 5/4, 2, 28/5 conferem.

1. [Passo 3, equação] "k · (5 − 5t)/3 + t − (7 − t)/3 = m − n" -> as frações (5 − 5t)/3 e (7 − t)/3 só nascem no passo 5 (tipos 7 e 10). Correção: no passo 3 escrever a equação como "k · x + y − z = m − n" e dizer "x, y e z vêm da reta do sistema I; achamos nos passos 4 e 5"; a forma com t entra no passo 8.
2. [Passos 3, 4 e 5] "Agora é só achar t, n e m" / "Achando t: as soluções do sistema I" -> t não é achado: continua livre ("Com t qualquer"). Dúvida do aluno: "qual é o valor de t?" (tipo 11). Correção: "t não tem um valor só: é o nome do y, e cada t dá um ponto da reta. Vamos achar x e z em função de t."
3. [Passo 4] "Some as duas primeiras equações de I: 3x + 5y + 0z = 5. É a 3ª equação, que não traz nada novo." -> a Antes só ensina equação "dobrada", não "soma das outras duas" (tipo 4). Correção: "Uma equação também não traz nada novo quando é a soma de outras duas. Teste: x + y = 7 e x − y = 1 somam 2x = 8; uma 3ª equação 2x = 8 não diz nada além das duas."
4. [Passo 4] "Sobram 2 equações para 3 letras: há infinitas soluções." -> regra sem caso (tipo 3/7). Correção: "Com 2 equações e 3 letras, sobra 1 letra livre. Exemplo menor: x + y = 5 tem 2 letras e 1 equação, e tem infinitas soluções (a aula Antes)."
5. [Passo 4, tabela] "t = 0: 5/3 e 7/3; t = 4: −5 e 1" -> a tabela tem 3 linhas, mas só t = 1 foi calculado no texto (tipo 10). Correção: no texto, mostrar t = 0: 3x + 0 = 5, x = 5/3, z = 4 − 5/3 = 7/3.
6. [Passo 5] "z = 4 − x − 2t = (12 − 5 + 5t − 6t)/3 = (7 − t)/3" -> pulou: 4 vira 12/3, 2t vira 6t/3, e o menos troca o sinal de (5 − 5t) (tipo 19). Correção: "4 = 12/3 e 2t = 6t/3. Então z = 12/3 − (5 − 5t)/3 − 6t/3 = (12 − 5 + 5t − 6t)/3 = (7 − t)/3. Teste com t = 1: (7 − 1)/3 = 2, igual ao z da tabela."
7. [Passo 1] "Frações com o mesmo fundo: a/3 + b/3 = (a + b)/3" -> letras a e b antes de número, e nunca usadas depois (tipo 7). Correção: "1/3 + 4/3 = 5/3" (a Antes já tem fração com o mesmo número embaixo).
8. [Checagem, Alternativa A] "Na 3ª equação, esqueceu o termo −z no coeficiente de t: −5k/3 + 1 = 0" -> a explicação nunca olha o "coeficiente de t"; usa t = 0. O erro descrito não é o caminho do aluno (tipo 6). Correção: "Na 3ª equação em t = 0, esqueceu o −z: k · 5/3 = −1 + 7/3 virou k · 5/3 = 1 − ... " ou trocar por erro que o caminho do passo 8 produza: "usou z = 7/3 com sinal de mais: 5k/3 + 7/3 = −1, que dá k = −2". Conferir o novo valor antes de usá-lo como alternativa.

Nível: ACIMA. 8 passos e 2 ideias escondidas (a 3ª equação de I é a soma das duas primeiras, logo I é uma reta; os pontos dessa reta têm que servir em II e fixam m, n e k). A própria âncora diz "parcial", mas para quem só tem a Antes é difícil de verdade.

---

## d2-escada-mat-ita-equ-00c (planos de celular) — 8 tropeços e 1 bug

Conta refeita: B < A primeiro em t = 93 (t = 92 empata em 54). Acima de 120, A − B = 0,25t − 9. Gabarito C certo.

1. [Alternativas, equação e checagem] "A = 30 + 0,75 · (t − 60) e B = 54" / "A = Usou t > 36 ... B = Parou na igualdade" -> plano A e plano B têm o nome das alternativas A e B (tipo 17). Correção: checagem "Alternativa A = Usou ...", "Alternativa B = Parou ..." e, na equação, chamar os custos de "custo do plano A" ou pela letra "a" e "b"? (melhor: letras C_A e C_B ou "X" e "Y"; mas basta escrever "plano A" e "plano B" por extenso nos textos e "alternativa" por extenso na lista).
2. [Passo 5] "Com t = 93: A = 30 + 0,75 · 33 = 54,75" -> o 93 aparece antes de qualquer conta que o produza (tipo 10); ele só nasce no passo 7. Correção: no passo 5 usar t = 70 (o exemplo do passo 4): "A = 30 + 0,75 · 10 = 37,50"; o 93 fica para o passo 9.
3. [Passo 7] "0,75 · (t − 60) > 24 ... ">" lê-se "maior que" ... t > 92" -> primeira desigualdade da Antes (só tem igualdade), e "t − 60 > 32, isto é, t > 92" pula o "somar 60 dos dois lados" (tipo 18). Correção: "Se 0,75 · 32 = 24, então com t − 60 maior que 32 o plano A passa de 54. t − 60 > 32 quer dizer t > 32 + 60 = 92."
4. [Passos 10 e 11] "Acima de 120 min ..." -> a pergunta é o MENOR t, e 93 já é menor que 120: esse trecho todo sobra e não avisa por quê (tipo 5). Correção: abrir o passo 10 com "Só para conferir: acima de 120 min a resposta não muda, porque já achamos t = 93, que é menor." Ou apagar passos 10 e 11 (então a alternativa A 36 perde a explicação; manter, mas avisando).
5. [Passo 11] "A − B = 0,25 t − 9, que é positivo para t acima de 36" -> subtração A − B e 0,25 · 36 = 9 sem passo (tipo 19). Correção: "A − B = (0,75t − 15) − (0,5t − 6) = 0,25t − 9. Com t = 36: 0,25 · 36 = 9 e 9 − 9 = 0; para t maior que 36 dá mais que 0."
6. [Passo 10] "Abrindo o parêntese: 0,75 · t − 0,75 · 60 = 0,75 t − 45" -> "abrir o parêntese" sem porquê nem teste, e "0,75 t" sem o "·" (tipos 18 e 12). Correção: "0,75 · (t − 60) é 0,75 vezes t menos 0,75 vezes 60. Teste com t = 70: 0,75 · 10 = 7,5 e 0,75 · 70 − 45 = 52,5 − 45 = 7,5." e escrever sempre "0,75 · t".
7. [Passo 1] "fixo + minuto extra · (t − franquia)" -> letras em palavras antes do exemplo com número; "franquia" só é explicada na peça "Excedente" (tipo 7). Correção: tirar a fórmula do passo 1 ou escrever "R$ 30 + R$ 0,75 · (minutos − 60)", já com os números.
8. [Checagem, Alternativa E] "E = Contou os 60 minutos incluídos nos dois planos" -> refiz: esse erro dá "B mais barato quando t > 156", logo 157; o 156 é o empate (tipo 6). Correção: trocar a alternativa E por 157, ou trocar o texto por "Parou no empate do erro (156)".

Bug de texto: checagem começa com "Resposta: alternativa C. t = 93. C. Erros: ..." (o "C." sobrando). Correção: "Resposta: alternativa C (t = 93). Erros: ..."

Nível: FÁCIL DEMAIS para "acima". 6 passos úteis (3 trechos de t, desigualdade, "estritamente"), 1 ideia escondida (estritamente: exclui o empate em 92). Passos 10 e 11 nem entram na resposta. É nível de ENEM difícil, não de prova real mais difícil.

---

## d2-escada-mat-ita-equ-00d (raízes r, s, t) — 6 tropeços

Conta refeita: s = 3t + 8, t = 1 ou −4, s = 11 ou −4, soma 7. As duas soluções conferem nos dois polinômios. Distratores −9, −4, 11, 15 conferem.

1. [Passo 3, letras] "S: soma de todos os valores possíveis de s ... s: cada valor possível de s" -> S maiúsculo e s minúsculo na mesma tela (tipos 12 e 17). Correção: chamar a soma de "Total" ou "Soma" e o letreiro "S" sair; ou "Σ" nunca. Usar "soma = 11 + (−4) = 7".
2. [Passo 6 e passo 1] "Somam −3 e multiplicam −4: 1 e −4" -> a aula Antes, para o MESMO polinômio x² + 3x − 4, diz "dois números que somam 3 e multiplicam −4: 4 e −1" e depois troca o sinal (tipo 11). Correção: usar o jeito da Antes: "Dois números que somam 3 e multiplicam −4: 4 e −1. Então (t + 4) · (t − 1) = 0 e t = −4 ou t = 1." E apagar o item "soma −b, produto c" do passo 1.
3. [Passo 7 e checagem, Alternativa D] ""st = s, logo t = 1" deixa escapar" -> "st = s" nunca foi escrito antes (vem de multiplicar as duas raízes, ideia que a explicação não usa) (tipos 10 e 11). Correção: apagar a frase do passo 7 e, na checagem D, escrever "Esqueceu o caso t = −4 (o que dá s = −4) e ficou só com t = 1: soma 11."
4. [Passo 4] "Iguale: −s − 1 = −9 − 3t, ou seja, s = 3t + 8" -> pulou. Correção: "−s − 1 = −9 − 3t. Some 1 dos dois lados: −s = −8 − 3t. Troque os sinais: s = 8 + 3t. Teste com t = 1: s = 11 e r = −12 nas duas fórmulas: −11 − 1 = −12 e −9 − 3 = −12."
5. [Passo 5] "Abrindo: t² − 9t − 3t² + 3t + 8 = −2t² − 6t + 8" -> (−9 − 3t) · t = −9t − 3t² e a soma t² − 3t² = −2t², −9t + 3t = −6t sem passo (tipo 19). Correção: "(−9 − 3t) · t = −9t − 3t² (cada parte vezes t). Junte: t² − 3t² = −2t²; −9t + 3t = −6t."
6. [Passo 4] "Divida por s: s + r + 1 = 0" -> o exemplo numérico só confere o zero (25 − 30 + 5 = 0), não a divisão (tipo 18). Correção: "Com s = 5: 25 + r · 5 + 5 = 0; dividindo cada parte por 5: 5 + r + 1 = 0, r = −6."

Nível: ACIMA. 8 passos, 3 ideias escondidas (trocar x por cada raiz para tirar r; dividir por s porque s ≠ 0; o caso em que s = t entra sem aviso). Alternativas armadilha plausíveis (−9, 15, 11).

---

## d2-escada-mat-ita-fun-00a (bolo de cenoura) — 4 tropeços

Conta refeita: q = 200 − 4p, topo em p = 30, lucro em p = 25 é R$ 1 200. Distratores conferem.

1. [Passo 1] "q = q₀ + inclinação · (p − p₀)" -> letras com índice e a palavra "inclinação", sem número; a Antes só tem "número que falta" (tipos 7 e 4). Correção: "Cada R$ 1 a mais no preço tira 4 bolos. Partindo de 120 bolos a R$ 20: a R$ 21 vendem 116, a R$ 22 vendem 112." E a fórmula só depois, com os números.
2. [Passo 4] "q = 120 − 4 · (p − 20) = 120 − 4p + 80" -> −4 · (p − 20) vira −4p + 80 sem o porquê do sinal (tipo 18). Correção: "−4 · (p − 20) é −4 vezes p e −4 vezes −20: −4p + 80. Teste com p = 24: 120 − 4 · 4 = 104 e 200 − 96 = 104."
3. [Passos 6 e 7] "topo" -> a peça chama "Vértice" e "Fundo da parábola" e o texto fala "topo" (palavra trocada) (tipo 8/11). Correção: usar "vértice (o topo)" na primeira vez e depois sempre "vértice".
4. [Passo 7] "Os preços que zeram ... são p = 10 e p = 50" -> o 50 não tem conta (tipo 10). Correção: "200 − 4p = 0: 4p = 200, p = 50. E p − 10 = 0: p = 10."

Nível: FÁCIL DEMAIS. 6 passos, 1 ideia escondida (o topo passa do teto de R$ 25, então fica no limite). É a parábola de livro com restrição; o quadro já dá a reta (3 pontos com razão constante).

---

## d2-escada-mat-ita-fun-00b (f(x) + 2 f(1/(1 − x)) = x) — 8 tropeços

Conta refeita: u = −5/6, v = 2/3, w = 2/3; as 3 equações conferem. Distratores conferem.

1. [Passo 1 e passo 3] "T(x) = 1/(1 − x)" / "f(T(x))" -> o T é usado no passo 1 e na leitura do passo 3 antes de ser definido no passo 4 (tipo 16). Correção: no passo 1 e no 3, escrever "f(1/(1 − x))" e só no passo 4: "Para encurtar, chame 1/(1 − x) de T(x)".
2. [Passo 3] "e o 1º passo mostra de onde vem esse ciclo" -> o 1º passo só diz T(T(T(x))) = x; o ciclo 1/2, 2, −1 está no passo 4 (tipo 11). Correção: "o passo 4 mostra de onde vem esse ciclo".
3. [Passo 3, equação] "u + 2v = 1/2; v + 2w = 2; w + 2u = −1" -> números 2 e −1 antes do passo 4 que os calcula (tipos 7 e 10). Correção: mover o ciclo (passo 4) para antes da equação em letras, ou escrever no passo 3 só "u + 2v = ..., v + 2w = ..., w + 2u = ..." e preencher no passo 5.
4. [Peça "Função composta"] "Aplicar a regra ao resultado da regra: f(f(x))" -> a questão não tem f(f(x)); tem f de 1/(1 − x), e o que se repete é T (tipo 11). Correção: trocar a peça por "Trocar x por 1/(1 − x), três vezes seguidas, volta ao x".
5. [Passo 3 e 5] "Escrevo ela em 3 pontos que se ligam em ciclo" -> a Antes só calcula f(f(3)) com f conhecida; aqui f é desconhecida e f(2), f(−1) viram "números que não sei" (tipo 4/13). Correção: acrescentar à Antes fun-composta (ou ao passo 3): "Se não sei a regra de f, f(2) é só um número escondido: chame de v. A regra vale para x = 1/2, 2 e −1; cada uma fala de dois desses números escondidos."
6. [Passo 4] "T(1/2) = 1/(1 − 1/2) = 1/(1/2) = 2" -> 1 dividido por 1/2: a Antes de fração não ensina dividir por fração (tipo 4). Correção: "1/(1/2) é 1 ÷ 1/2: quantos meios cabem em 1? Cabem 2."
7. [Passo 7] "v = 2 − (−2 − 4u) = 2 + 2 + 4u" -> tirar parêntese com sinal de menos (tipo 18). Correção: "Tirar (−2 − 4u) é tirar −2 e tirar −4u: some 2 e some 4u. Teste com u = 1: 2 − (−2 − 4) = 2 + 6 = 8 e 4 + 4 = 8."
8. [Passo 8] "u = (−15/2) ÷ 9 = −15/18 = −5/6" -> fração dividida por 9 e simplificar ÷ 3, que a Antes não ensina (tipo 19). Correção: "Dividir por 9 é pôr 9 embaixo: 15/(2 · 9) = 15/18. Divida em cima e embaixo por 3: 5/6."

Nível: ACIMA de verdade. 8 passos e 2 ideias escondidas (a troca volta ao ponto de partida em 3 passos; escrever a regra nos 3 pontos do ciclo e tratar f(1/2), f(2), f(−1) como 3 incógnitas). Equação funcional é matéria de olimpíada/ITA.

---

## d2-escada-mat-ita-fun-00c (t⁴ − 6t² + k = 0) — 6 tropeços

Conta refeita (por script): 11 valores de k dão exatamente 2 raízes reais (k de −10 a −1 e k = 9). Distratores 8, 9, 10, 12 conferem.

1. [Passo 7] "t = √3 e t = −√3" -> √ de número que não é exato; a Antes (fun-biquadrada) não tem raiz quadrada (tipo 1/4). Correção: "t² = 3: t é o número que vezes ele mesmo dá 3 (√3, um pouco mais de 1,7 porque 1,7 · 1,7 = 2,89), e o oposto, −√3. Não precisa do valor: só importa que são 2 soluções."
2. [Passo 7] "−k ≥ −9, ou seja, k ≤ 9" -> inverter o sentido da desigualdade ao trocar o sinal, e "≥" nunca lido (tipos 18 e 12). Correção: "Teste: k = 10 dá −k = −10, que é menor que −9, não serve. k = 9 dá −9, serve. Então k tem que ser 9 ou menos. (≥ lê-se 'maior ou igual'.)"
3. [Passo 6] "Isso vale para k = −10, −9, ..., −1" -> só k = −7 foi testado; a tabela não tem h = 1, 2, ..., 10 (tipos 3 e 14). Correção: "Teste com k = −1: h(u) = 1; olhando a tabela, h(0) = 0 e h(−1) = 7, então o u está entre −1 e 0 (negativo); do outro lado h(6) = 0 e h(7) = 7, então u entre 6 e 7. Com k = −10, h(u) = 10 fica ainda mais longe: u menor que −1 e maior que 7. Sempre um u negativo e um maior que 6."
4. [Peça "Fundo da parábola"] "parábola" -> a palavra não é explicada nesta questão (a Antes não a tem) (tipo 1). Correção: "Fundo: o ponto mais baixo da curva de h (a curva em U). Aqui é −9, em u = 3."
5. [Passo 4] "a equação vira u² − 6u + k = 0, ou h(u) = −k" -> o "ou" pula passar k para o outro lado (tipo 18). Correção: "Passe k para o outro lado, trocando o sinal: u² − 6u = −k. Teste com k = 5: u² − 6u + 5 = 0 e u² − 6u = −5."
6. [Passo 9] "20 − (−10) + 1 = 31" -> o "+ 1" sem porquê (tipo 19). Correção: "De 1 a 5 são 5 números, não 4: 5 − 1 + 1. Por isso 20 − (−10) + 1 = 31."

Nível: ACIMA. 9 passos, 3 ideias escondidas (trocar t² por u e ligar a h; cada u positivo dá 2 valores de t; k = 0 dá 3 e k = 9 dá 2, os dois casos de borda). A tabela guia a leitura, mas os 5 regimes de k (negativo, 0, 1 a 8, 9, maior que 9) pedem cuidado de prova real alta.

---

## d2-escada-mat-ita-fun-00d (f aplicada 2 026 vezes) — 6 tropeços

Conta refeita: f³ = identidade, 2 026 = 3 · 675 + 1, f²⁰²⁶ = f, x² − x + 1 = 0 com Δ = −3: 0 soluções. Gabarito E certo; distratores 1, 2, 3, 2 026 conferem.

1. [Passos 4 e 5] "1/(1 − x) ... = −x/(1 − x). Logo f²(x) = (1 − x)/(−x) = (x − 1)/x" -> dividir por fração, e trocar o sinal de cima e de baixo, sem a Antes de fração nesta questão (tipos 4 e 7: letras antes de números). Correção: a Antes fun-00d deve incluir fracoes; e no passo: "1 ÷ (−x/(1 − x)) vira (1 − x)/(−x): inverte a fração. Multiplicando cima e baixo por −1: (x − 1)/x. Teste com x = 2: f(f(2)) = f(−1) = 1/2 e (2 − 1)/2 = 1/2."
2. [Passo 6] "Achando r: teste com número" -> o teste com número vem DEPOIS das letras dos passos 4 e 5 (tipo 7). Correção: passar o passo 6 (x = 2: 2, −1, 1/2, 2) para antes do passo 4, e deixar as letras como "conferência geral".
3. [Passo 9] "D = b² − 4ac = (−1)² − 4 · 1 · 1 = 1 − 4 = −3. D é negativo" -> o símbolo muda de Δ para D (tipo 12/11). Correção: "Δ = b² − 4ac ... Δ é negativo".
4. [Passo 3] "A equação fʳ(x) = x é de 2º grau" -> vale para r = 1 e r = 2, mas para r = 0 (por exemplo 2 025 aplicações) a equação é x = x e vale para todo x (tipo 14). Correção: "Para r = 1 ou r = 2 a equação fʳ(x) = x é de 2º grau (aqui r será 1). Com r = 0, f voltou ao começo e vale para qualquer x."
5. [Passo 7] "3 · 675 = 2 025" -> de onde vem o 675? (tipo 10). Correção: "2 026 ÷ 3: 3 · 600 = 1 800, restam 226; 3 · 75 = 225, resta 1. Então 600 + 75 = 675 voltas e resta 1."
6. [Passo 8] "Multiplicando por (1 − x) ... Passando tudo para um lado" -> sem porquê (tipo 18). Correção: "Multiplicar os dois lados por (1 − x) tira a fração (como 6 ÷ 2 = 3 vira 6 = 3 · 2). Teste: 1/(1 − x) = x com x = 2: 1/(−1) = −1, e 2 não é −1. Passar tudo para um lado: somar x² e tirar x dos dois lados: x² − x + 1 = 0."

Nível: ACIMA. 8 passos e 3 ideias escondidas (f³ = identidade por conta com fração; usar o resto de 2 026 ÷ 3; discriminante negativo, resposta "nenhuma"). A conta é simples mas o resultado 0 e a periodicidade não aparecem do enunciado.

---

## d2-escada-mat-ita-pla-00a (gramado em L) — 3 tropeços

Conta refeita: área 1 050; × 1,1 = 1 155; ÷ 9 = 128 e resta 3; 129 pacotes. Distratores 117, 128, 193, 700 conferem. O dado que sobra (R$ 54, 5%, a prazo) é avisado no passo 2.

1. [Passo 4 e checagem] "A: área do gramado" e "A = Esqueceu os 10% ... B = Arredondou ..." -> a letra A da equação e as alternativas A e B (tipo 17). Correção: trocar a letra A por "G" (gramado) e escrever "Alternativa A = ..." na checagem.
2. [Passo 8] "9 · 28 = 252; resta 3" -> o 28 não tem origem (tipo 10). Correção: "255 ÷ 9: 9 · 20 = 180, restam 75; 9 · 8 = 72, resta 3. Então 20 + 8 = 28."
3. [Passo 4] "arredondado para cima" -> só explicado no passo 9 (tipo 8, a ordem das telas manda). Correção: no passo 4 trocar por "(se sobrar um pedaço, precisa de mais um pacote inteiro)".

Nível: FÁCIL DEMAIS. 5 passos (área do L, +10%, 9 m², divisão com resto, arredondar), 0 ideias novas; as duas pegadinhas (arredondar para cima, dados que sobram) já estão avisadas no texto.

---

## d2-escada-mat-ita-pla-00b (semicírculos e Γ) — 8 tropeços

Conta refeita: AC = 15; T = 60; S = 8π, R = 28,125π, H = 36,125π, S + R = H; L = 60. Distratores 30, 68, 113,43, 120 conferem. O resultado é o das lúnulas de Hipócrates.

1. [Passos 3 e 4; enunciado] "O meio círculo de Γ do lado do triângulo tem diâmetro BC: é o semicírculo H. Ele se divide em três partes ..." -> a explicação de geometria é toda em texto, sem figura marcada com H, T, S, R, os dois "pedaços" e a parte de fora (tipo 3; princípio do Pablo). Correção: acrescentar desenho (circunferência Γ, triângulo ABC com A no círculo, semicírculos de AB e AC para fora, a parte fora de Γ pintada) ANTES do passo 3, com os rótulos S, R, H, T.
2. [Enunciado, passo 1] "triângulo retângulo", "cateto", "hipotenusa", "circunferência" -> nenhuma palavra foi definida (a Antes de Pitágoras fala "canto reto" e "diagonal") (tipo 1). Correção: na Antes pitagoras: "O triângulo com canto reto chama-se triângulo retângulo. A diagonal chama-se hipotenusa; os dois lados do canto, catetos." e na peça: "Circunferência Γ: a linha do círculo de diâmetro BC".
3. [Passo 1] "hipotenusa² = cateto² + cateto²" -> o "²" nunca foi lido (a Antes escreve "·") (tipo 12). Correção: "hipotenusa · hipotenusa = cateto · cateto + cateto · cateto" (igual à Antes), ou "² lê-se 'ao quadrado': 5² = 5 · 5".
4. [Enunciado, passos e alternativas] "ABC ... AB ... AC ... BC" e alternativas "A 60", "B 30", "C 68" -> pontos A, B, C do triângulo e alternativas A, B, C (tipo 17). Correção: "alternativa A" por extenso sempre; na lista de erros já está certo ("Alternativa B = ..."), conferir também o resumo da resposta.
5. [Passo 9] "Olhe: S + R = 8π + 28,125π = 36,125π, o mesmo que H." -> por que S + R = H? parece coincidência (tipo 3). Correção: "Não é coincidência: os raios ao quadrado seguem Pitágoras. 4 · 4 + 7,5 · 7,5 = 16 + 56,25 = 72,25 = 8,5 · 8,5. Como cada semicírculo é π · (raio · raio) ÷ 2, as áreas somam do mesmo jeito."
6. [Passo 10] "L = 8π + 28,125π − (36,125π − 60) ... = 36,125π − 36,125π + 60" -> sair do parêntese com menos muda o sinal do 60 (tipo 18). Correção: "Tirar (36,125π − 60) é tirar 36,125π e somar 60. Teste: 10 − (7 − 2) = 5 e 10 − 7 + 2 = 5."
7. [Passos 8 e 9] "7,5 · 7,5 = 56,25 (75 · 75 = 5 625 ...)", "56,25π ÷ 2 = 28,125π" -> 75 · 75 e o ÷ 2 com vírgula sem passo (tipo 19). Correção: "75 · 75 = 75 · 70 + 75 · 5 = 5 250 + 375 = 5 625. Metade de 56,25: metade de 56 é 28 e metade de 0,25 é 0,125; total 28,125."
8. [Passo 2 e enunciado] "Valor de π: só se precisar: 3,14" -> o enunciado não dá π (tipo 5/11: tabela diz uma coisa e o enunciado, outra). A alternativa D (113,43) só existe por causa do 3,14. Correção: acrescentar ao enunciado "Se precisar, use π = 3,14."

Nível: ACIMA de verdade. 10 passos e 1 ideia decisiva (a soma dos semicírculos dos catetos é igual ao da hipotenusa, e os π se cancelam). Sem essa ideia a área não sai (precisaria de ângulos). O texto guia a ideia, mas ela é nível ITA.

---

## d2-escada-mat-ita-pla-00c (círculo no triângulo) — 8 tropeços

Conta refeita: catetos 20 e 21 (existem), área 210, r = 210 ÷ 35 = 6, 210 − 3,14 · 36 = 96,96. Distratores 113,04, 181,74, 191,16, 210 conferem. Desenho `circulo-no-triangulo` considerado existente (rótulos ?, ?, 29 cm, r).

1. [Enunciado, passos 1 e 3] "triângulo retângulo", "hipotenusa", "cateto" -> a Antes de Pitágoras usa "canto reto" e "diagonal"; as três palavras novas não são ensinadas (tipo 1). Correção: acrescentar na aula Antes pitagoras: "triângulo com canto reto = triângulo retângulo; diagonal = hipotenusa; os dois lados do canto = catetos".
2. [Passo 5] "Os catetos não foram dados. Some os dois: 70 − 29 = 41." -> "some os dois" soa como somar os catetos que não existem; não diz que 41 é a soma dos dois catetos nem por que se tira a hipotenusa (tipos 3 e 10). Correção: "Os três lados somam 70 e a hipotenusa é 29. Então os dois catetos juntos somam 70 − 29 = 41."
3. [Passo 5] "Sempre vale (soma)² = (cateto)² + (cateto)² + 2 · produto. Teste com 3 e 4: 7 · 7 = 49 = 9 + 16 + 2 · 12." -> conteúdo novo (quadrado da soma) dentro da explicação, e "sempre" com um caso só (tipos 19 e 14). A Antes da questão não tem. Correção: criar aula Antes "quadrado da soma" com 2 exercícios, ou dar mais um caso: "Com 2 e 5: 7 · 7 = 49 = 4 + 25 + 2 · 10 (também fecha)". A fórmula só depois.
4. [Passo 5] "2 · produto ... então produto = 420" -> "produto" de quê? (tipo 8). Correção: "produto dos catetos (um cateto vezes o outro). No teste, 12 = 3 · 4."
5. [Passo 5] "41 · 41 = 1 681", "29 · 29 = 841" -> contas sem passo (tipo 19). Correção: "41 · 41 = 40 · 41 + 41 = 1 640 + 41 = 1 681. 29 · 29 = 30 · 29 − 29 = 870 − 29 = 841."
6. [Passo 8, conta] "0,14 · 36 = 5,04" -> sem passo (tipo 19). Correção: "0,14 · 36: 14 · 36 = 504; duas casas depois da vírgula: 5,04."
7. [Passo 8, frase] "Conferindo: sobra menos que a área do painel (210) e é bem menos que o círculo mais o resto." -> "o círculo mais o resto" não quer dizer nada claro (círculo + resto = 210) (tipo 15). Correção: "Conferindo: círculo 113,04 + parte de fora 96,96 = 210, a área do painel."
8. [Passo 1] "hipotenusa² = cateto² + cateto²" -> "²" sem leitura (tipo 12). Correção: escrever com "·" como na Antes.

Nível: ACIMA, moderado. 7 passos, 2 ideias escondidas (achar o produto dos catetos pelo quadrado da soma, sem achar os lados; usar o semiperímetro 35 e não o perímetro 70). Atalho que reduz a dificuldade: 20-21-29 sai de tentativa para quem conhece ternos, mas a explicação não depende disso.

---

## d2-escada-mat-ita-pla-00d (praça com ponto P) — 7 tropeços

Conta refeita: pedras 120 m², V = 300y + 4 200 = 5 700, y = 5. Distratores 6,75, 7, 8, 10 conferem com os erros descritos.

1. [Todos os passos] nenhum diagrama -> a explicação monta alturas e bases de 4 triângulos sem figura do retângulo ABCD, de P, de y e de 8 (tipo 3; princípio do Pablo). Correção: acrescentar desenho do retângulo com A, B, C, D, o ponto P, as distâncias 8 (até AD) e y (até AB), e os 4 triângulos pintados com as cores dos preços.
2. [Peças e passo 3] "Em PAB a altura é y; em PCD é 12 − y" / "base AB = 20 e altura y" -> o y aparece na peça e no passo 3, mas só é definido na lista de letras do passo 4 (tipo 16). Correção: dizer no começo do passo 3: "y é a distância de P ao lado AB, que a questão pede."
3. [Passo 3] "Custo = 10 · 10 · (12 − y)" e "Custo = 40 · 10y = 400y" -> de onde vêm os dois 10 do custo da grama, e "10y" lê-se 10 vezes y? (tipos 10 e 12). Correção: "Área da grama = 20 · (12 − y) ÷ 2 = 10 · (12 − y). Custo = 10 reais por m² · 10 · (12 − y) = 100 · (12 − y)." e "10y quer dizer 10 · y".
4. [Passo 3] "Área = 20 · y ÷ 2 = 10y m²" -> conta com letra antes da mesma conta com número (tipo 7). Correção: "Com y = 5: área = 20 · 5 ÷ 2 = 50 e custo = 40 · 50 = 2 000. Em letras: área = 10 · y e custo = 400 · y."
5. [Passos 3 e 6] "altura 12 − y" e "altura 20 − 8 = 12" -> por que 12 − y e 20 − 8 (distância até o lado oposto)? Sem figura não se vê (tipo 3). Correção: "AB e CD estão a 12 m um do outro; se P está a y de AB, está a 12 − y de CD. AD e BC estão a 20 m um do outro; se P está a 8 de AD, está a 20 − 8 = 12 de BC."
6. [Passo 8] "100 · (12 − y) = 1 200 − 100 · y" -> abrir parêntese sem porquê nem teste (tipo 18). Correção: "100 · (12 − y) é 100 vezes 12 menos 100 vezes y. Teste com y = 5: 100 · 7 = 700 e 1 200 − 500 = 700."
7. [Peça "Dado que sobra" e ideia] "a distância de 8 m é dado que sobra" / "Os 8 m não importam" -> o passo 6 USA o 8 (48 = 12 · 8 ÷ 2 e 20 − 8 = 12); o aluno pergunta "então importa" (tipos 5 e 11). Correção: "O 8 entra na conta das pedras, mas o resultado (120 m²) é o mesmo para qualquer distância: o 8 não muda a resposta."

Ambiguidade leve do enunciado: não diz a ordem dos vértices (A, B, C, D em volta) e que BC é paralelo a AD; sem figura o aluno pode ler outro retângulo. Correção: desenho no enunciado ou "ABCD, nessa ordem em volta do retângulo".

Nível: FÁCIL DEMAIS. 6 passos, 0 ideias escondidas: como o 8 é dado, as quatro áreas saem direto (48, 72, 10y, 10 · (12 − y)), e o resto é uma equação de 1º grau. A "ideia" (pares opostos somam metade) não é necessária.
