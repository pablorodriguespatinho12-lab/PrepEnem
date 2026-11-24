# Leitura do aluno-do-zero, rodada 2: Matemática ari / gra / est / equ (16 questões)

Data: 24/11/2026. Lido: enunciado, alternativas, explicação inteira (conferência, ideia, peças, passos, checagem) das 16 questões `d2-escada-mat-ita-{ari,gra,est,equ}-00{a,b,c,d}` e as aulas "Antes" ligadas em `data/revisao-final/antes-da-questao.json` (o que a Antes ensina não conta). Só tropeços novos ou que continuam.

Contas e gabaritos refeitos por script (Fractions, força bruta onde dava): 16 de 16 batem, e os distratores citados na conferência também (ari-b D, equ-c E, est-a D conferidos um a um). **Conta errada: 0. Meta da rodada cumprida.**

Resumo: 42 tropeços de detalhe em 16 questões; 0 bug de conta/gabarito/dado; 2 achados de texto/formato; 0 figura ausente onde a geometria exige (a única geometria, gra-00a, tem o desenho `terreno-escala`).

| Questão | Tropeços | Situação |
|---|---|---|
| ari-00a | 3 | quase limpa |
| ari-00b | 4 | |
| ari-00c | 3 | |
| ari-00d | 3 | |
| gra-00a | 4 | |
| gra-00b | 1 | limpa (1 detalhe) |
| gra-00c | 2 | |
| gra-00d | 4 | |
| est-00a | 1 | limpa (1 detalhe) |
| est-00b | 3 | |
| est-00c | 3 | |
| est-00d | 2 | |
| equ-00a | 2 | quase limpa |
| equ-00b | 3 | |
| equ-00c | 2 (+1 formato) | |
| equ-00d | 2 | quase limpa |

Tipo que mais se repete: número ou letra que aparece antes de nascer (tipos 10, 16: 7 vezes). Depois: passo de conta sem o porquê ou sem passo (tipos 18 e 19: 9 vezes), símbolo sem leitura (tipo 12: 6 vezes), "sempre" ou regra geral tirada de um caso (tipos 7 e 14: 5 vezes).

Das rodadas anteriores (equ): sumiram os tropeços de letra fora da fórmula, "média ponderada", "5/3 sem passo em z", t sem valor, "T" antes de definir, "S" x "s", "93" antes de nascer, "x e z" etc. Continuam só os de detalhe listados abaixo.

---

## Bugs de fato

Nenhum de conta, gabarito ou dado. Dois achados de texto/formato:

1. [ari-00b, conferência, Alternativa D] "só passa de 10% na 10ª" -> a conta está certa (0,8 elevado a 10 dá 8,6%, e na 9ª ainda 10,7%), mas "passa de 10%" diz o contrário do que acontece: na 10ª o álcool CHEGA a 10% ou menos. Texto, não conta.
2. [equ-00c, checagem] a pergunta de checagem tem 3 opções (65, 66, 70); as outras 15 têm 4. Gabarito certo (66).

---

## ari-00a (suplemento, 3 tropeços)

Conta: +12, −12, +20 por cápsula; 30 · 20 = 600. Alternativas A, B, C, E conferem.

1. [Fórmulas] "O p é o número da porcentagem" e depois a letra "P" = "variação do custo do cálcio" -> p minúsculo e P maiúsculo na mesma questão (tipos 12 e 17).
2. [Fórmulas] "parte = total · p ÷ 100" -> nunca é usada: os passos usam "10% de 120 = 120 ÷ 10", "metade" etc. O aluno pergunta "onde eu uso p ÷ 100?" (tipo 11).
3. [Equação] "R = N · (P + W + X)" -> "R" ao lado de "R$" em todo lugar; leve (tipo 12).

## ari-00b (tanque de álcool, 4 tropeços)

Conta: 80 → 60 → 45 → 33,75 → 25,31 → 18,98 → 14,24 → 10,68 → 8,01; N = 8. Distratores A (4), B (6), C (7), D (10) conferem.

1. [Volta 1] "Guardo 2 casas: o erro é pequeno perto da distância até 10." -> guardar casas de quê? que erro? (tipo 8).
2. [Volta 2 de 3] "Estimando: de 33,75 ainda falta cair até 10, então faltam umas 4 operações." -> como se estimou "4"? número sem cadeia (tipo 10).
3. [Volta 2 de 3 e 3 de 3] "33,75 ÷ 4 = 8,4375", "25,31 ÷ 4 = 6,3275", "14,24 ÷ 4 = 3,56" -> divisão de número com vírgula por 4 sem passo; a Antes não tem (tipo 19).
4. [Equação] "T · F · F · … · F ≤ 10" -> "≤" e "…" sem leitura; o N não está na fórmula (só no texto "N fatores") (tipo 12).

## ari-00c (parcelas, 3 tropeços)

Conta: P = 4 005,1 ÷ 3,31 = 1 210; saldo 3 310 → 2 100 → 1 100 → 0. Distratores 1 000, 1 103, 1 213,67, 1 335,03 conferem.

1. [De onde vem (4 de 4)] "A entrada não gera juros na DÍVIDA ... ela vale P · 1,21" -> o enunciado diz "não rende juros" e a tela multiplica a entrada por 1,21: qual vale? (tipo 11; explicado, mas a palavra "renderia" ainda deixa dúvida).
2. [De onde vem (2 de 4)] "Escolho o dia 60, o último." -> por que o último e não hoje? (tipo 2).
3. [Fórmulas] "O p é o número da porcentagem" x letra "P" (parcela) (tipo 17), igual ao ari-00a.

## ari-00d (figurinhas, 3 tropeços)

Conta: totais 106, 159, 212, 265, 318, 371; N = 6 (força bruta confere). Distratores 5, 7, 8, 19 conferem.

1. [Achando S 1 de 3] "Caio é de 4 em 4" -> tirado de 2 testes (8 serve, 6 não); e "só x = 5, 10, 15..." depois vira "os totais possíveis são 53, 106, 159..." sem mostrar que TODO total é 53 vezes um número (só x = 5 e x = 10 foram feitos) (tipo 14).
2. [Conferência x passos] "Caio = 20 · x, Bia = 15 · x ... x = 2 a 7" -> nos passos x vale 5, 10, 15 (Caio = 4 · x); o mesmo x com dois sentidos (tipo 11).
3. [Achando S 2 de 3] "Para dar inteiro, Bia (3 · x) tem de ser múltiplo de 5" -> o x desta questão é o x da tela anterior (Caio = 4 · x), mas o enunciado e a tabela não têm x; entra como "um número que ainda vou achar" (tipo 16, leve).

## gra-00a (fazenda e cópias, 4 tropeços)

Conta: fator 0,75, K = 40 000, 17,5 · 1,6 · 10⁹ ÷ 10⁸ = 280 ha. Distratores 17,5, 157,5, 210, 2 800 000 conferem. Figura `terreno-escala` presente.

1. [Achando K 2] "1 cm dela guarda 1 ÷ 0,75 cm da planta: 100 ÷ 75 = 4/3 (dividindo por 25)" -> por que 1 ÷ 0,75? (a tabela de 10 cm dá 7,5 cm, mas ninguém lê dela "7,5 cm da cópia = 10 cm da planta"); e fração 4/3 e "dividindo por 25" sem Antes (a Antes desta questão não tem fração nem simplificar) (tipos 4 e 7).
2. [Achando K 2] "30 000 · 4/3 = 30 000 ÷ 3 · 4" -> multiplicar por fração sem Antes (tipo 4).
3. [Enunciado] "a prefeitura cobra R$ 15 por hectare" -> número que não entra na conta e a explicação não avisa (nem o "Dados") (tipo 5).
4. [Fórmulas e Achando K] "0,5 · 1,5 = 0,75" -> multiplicar decimais sem passo; a Antes desta questão não tem multiplicar-decimais (tipo 19).

## gra-00b (robô, 1 tropeço, limpa)

Conta: 0,25 + 0,5 + ... + 32 = 63,75 min = 1 h 03 min 45 s. Distratores 2 min, 8 min 2 s (8,03), 1 h 04, 4 h 16 conferem.

1. [Peças] "Velocidade média: Distância total ÷ tempo total" -> palavra nova que nenhum passo usa; só aparece na peça e na conferência (tipo 15, leve).

## gra-00c (ração, 2 tropeços)

Conta: 180 kg, 270 kg, 60 kg comidos, 210 kg; Z = 21. Distratores 12, 14, 18, 27 conferem.

1. [Volta] "Em cima, 15 · 6 = 90; embaixo, Z · 5 = 5Z; 90 ÷ 5 = 18, e fica 18/Z" -> por que dividir só o 90 por 5 e o Z fica? e "5Z" lê-se 5 vezes Z? (tipos 18 e 12).
2. [Equação] "15 ÷ Z × 60 ÷ 40 × 200 ÷ 250 = R ÷ F" -> a leitura é a das frações empilhadas, mas escrita numa linha com ÷ e × alternados; o aluno lê da esquerda para a direita e precisa de parênteses (tipo 12, leve; a tela seguinte mostra as frações desenhadas).

## gra-00d (relógio para trás, 4 tropeços)

Conta: força bruta com a hora errada de 1 a 11: sempre 8 acertos em 24 h. Distratores 2, 4, 6, 12 conferem.

1. [Achando R: quando eles acertam] "daqui a 0,5 h ... o errado 5 − 1,5 = 3 h 30 min: acertou" -> de onde veio 0,5? falta a cadeia (diferença de 2 h ÷ 4 h por hora) (tipo 10).
2. [Fórmulas] "R = 1 + 3 = 4 h a cada hora" -> o 4 aparece na primeira tela, antes do exemplo que o produz (tipo 10).
3. [Peças e Equação] "Velocidade relativa" e "a diferença entre eles dá uma volta de 12 h" -> "dá uma volta" e "relativa" sem exemplo (tipos 1 e 8).
4. [Volta] "ela cai sempre antes de 3 h ... cabem sempre 8 em 24 h" -> "sempre" sem teste com outra hora errada (tipo 14).

## est-00a (escola, 1 tropeço, limpa)

Conta: 30 + 30 + 24 = 84; 520,8 − 174 − 186 = 160,8; M = 6,7. Distratores 4,7, 6,25, 6,3, 6,85 conferem.

1. [Volta] "520,8 ÷ 84 = 6,2" (conferência) -> divisão com vírgula sem passo (tipo 19, leve).

## est-00b (mediana 13 notas, 3 tropeços)

Conta: força bruta em todos os pares (a, b) de 0 a 10: 7 pares ({6, 0} a {6, 6}). Distratores 6, 11, 13, 21 conferem.

1. [Preparo: duas regras] "(1) No máximo 6 notas ficam abaixo do 6, senão o 6 passa do 7º lugar. (2) Até o 6, contando ele, ficam pelo menos 7 notas" -> regra antes do caso com números (só a (1) tem a fila de exemplo) e "o 6 passa do 7º lugar" confunde (tipos 7 e 8).
2. [Traduzindo] "Regra (2): até o 6 hoje há 5 notas" -> a regra diz "contando ele" e ninguém tirou 6: o aluno pergunta "5 contando o quê?" (tipo 11, leve).
3. [Achando P] "As duas são ≤ 6" -> "≤" sem leitura nesta questão (a tela anterior diz "menores ou iguais a", mas o símbolo não é ligado) (tipo 12).

## est-00c (salários, 3 tropeços)

Conta: S = 330, M = 2 750, G > 550, menor inteiro 551. Distratores 251, 501, 550, 801 conferem (conferido por script exato).

1. [Fórmulas] "média + G; o desvio não muda" -> G aparece antes de ser definido (só dois passos depois) (tipo 16).
2. [Volta] "330 ÷ (algo) < 0,10 quer dizer que 'algo' tem de ser maior que 330 ÷ 0,10" -> por que o sentido inverte? falta um teste curto (330 ÷ 4 000 = 0,0825 e 330 ÷ 3 000 = 0,11) (tipo 18).
3. [Equação] "G > 10 × S − M" e depois "300 · 1,10" -> "×" e "·" misturados para a mesma coisa (tipo 12, leve).

## est-00d (lista apagada, 2 tropeços)

Conta: N = 41, soma 861, sobraram 824, apagado 37 (força bruta confere, único). Distratores 17, 21, 40, 41 conferem.

1. [Achando N (2 de 2) e (só dois)] "N ÷ 2 ≤ 20,6 ≤ (N + 2) ÷ 2" -> "≤" só é lido na tela SEGUINTE; "≥" nunca é lido (tipos 12 e 8: a ordem das telas manda).
2. [Achando N 1 de 2] "Apagar o maior número (N) deixa a média mais baixa possível: N ÷ 2" -> regra geral tirada do exemplo 1 a 7; para N = 41 o aluno não viu por quê (tipos 7 e 14).

## equ-00a (café, 2 tropeços)

Conta: x = 60, G = 3 120, P = 312, V = 3 900, lucro 780 = 20% de 3 900. Distratores 40, 67, 73, 78 conferem (lucro 25%, 18%, 17%, 15%).

1. [Enunciado, tabela e checagem] "Tipo | A | B" e "Alternativa A = Respondeu os kg do café tipo B" -> o tipo A/B ainda tem o nome das alternativas A/B (tipo 17; já está escrito "café tipo A" e "alternativa A" por extenso, mas a tabela do enunciado usa só "A" e "B").
2. [Achando G (1 de 2)] a tabela mostra a linha "x | 100 − x | 2 400 + 12x" na mesma tela, antes de a tela (2 de 2) fazer a conta que dá 2 400 + 12x (tipo 10).

## equ-00b (dois sistemas, 3 tropeços)

Conta: reta ((5 − 5t)/3, t, (7 − t)/3), n = 4, m = 3, k = 4/5; conferido com frações exatas. Distratores −2, 5/4, 2, 28/5 conferem.

1. [Achando n] "5/3 + n · 7/3 = 11. Multiplique por 3: 5 + 7n = 33" -> por que multiplicar a equação por 3 e o que acontece com o 11? A Antes de frações só soma e troca denominador (tipo 18).
2. [Volta] "5k/3 = −1 + 7/3 = 4/3 e 5k = 4" -> "−1 + 7/3 = 4/3" sem passo (−3/3 + 7/3) e "5k/3 = 4/3 então 5k = 4" sem dizer que se multiplica por 3 (tipo 19).
3. [Volta 2 de 2] "4/5 · (−10/3) = −8/3" -> multiplicar fração e simplificar sem passo; a Antes não ensina multiplicar frações (tipos 4 e 19).

## equ-00c (planos de celular, 2 tropeços + 1 formato)

Conta: B < A pela 1ª vez em t = 93 (t = 92 empata em 54). A alternativa E (157) agora bate com o erro descrito (60 min incluídos nos dois planos dá t > 156, logo 157). Distratores 36, 92, 120 conferem.

1. [Achando CB: a diferença acima de 120] "(0,75 · t − 15) − (0,5 · t − 6) = 0,25 · t − 9" -> tirar parêntese com sinal de menos (−15 + 6 = −9) sem passo nem teste (tipo 18). Continua da rodada 1: só a parte do "t = 36" foi corrigida.
2. [Enunciado] "Plano A" e "Plano B" ao lado das alternativas A a E (tipo 17, leve; a lista de erros já usa "Alternativa A").
3. Formato: a checagem tem 3 opções (ver bugs).

## equ-00d (raízes r, s, t, 2 tropeços)

Conta: força bruta racional: só (t, r, s) = (1, −12, 11) e (−4, 3, −4); soma de s = 7. Distratores −9, −4, 11, 15 conferem.

1. [Fórmulas] "s ≠ 0 permite cortar um s da conta" -> "≠" sem leitura (o enunciado diz "diferentes de zero") (tipo 12).
2. [Achando r 2 de 2] "−s = −8 − 3t. Troque os sinais: s = 8 + 3t" -> por que trocar os sinais? (multiplicar os dois lados por −1, sem teste) (tipo 18).

---

## Entendi sem tropeço (trechos)

ari-00a conta do ferro (40% de 100 = 40; 50% de 40 = 20) com o exemplo de R$ 200; ari-00b a conta de que sai 1/4 do álcool com o exemplo de 32 L e 8 L; ari-00c o exemplo "R$ 100 hoje viram 110 e 121"; ari-00d o teste x = 1 a 5 de Bia; gra-00a o quadradinho 1 cm → 3 cm → 9 cm²; gra-00b toda a tabela de tempos; gra-00c a tabela antes e agora e as frações empilhadas; est-00a tudo (H, L, T, W, Q, um por tela); est-00b a mediana da 7ª posição e a tabela dos 7 pares; est-00c o exemplo de desvio com 2 000 e 3 000; est-00d a soma de 1 a 41 e a conferência; equ-00a o teste com 10 kg de A; equ-00b a tabela dos 3 pontos da reta; equ-00c os passos t = 70 e t = 92 / 93; equ-00d o teste com t = 2 e a tabela dos dois casos.
