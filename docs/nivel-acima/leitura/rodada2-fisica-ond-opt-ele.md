# Rodada 2, aluno-do-zero: Física ond / opt / ele (12 questões)

Data: 24/11/2026. Lido: enunciado, alternativas, explicação inteira (conferência, ideia, peças, passos com figuras, checagem) e as aulas Antes ligadas em `data/revisao-final/antes-da-questao.json`. Gabaritos e todas as 60 alternativas refeitos por script: nenhuma conta errada (meta da rodada atingida: 0). O que a Antes ensina não foi contado.

Resumo: 44 tropeços novos ou que continuam. Nenhuma questão limpa. Bugs de fato: 0 de conta, 0 de gabarito. 2 imprecisões de texto (opt-00a alternativa C; ond-00d "ideia"). Figura ausente onde a geometria exige: nenhuma (10 diagramas existem em `components/visual`; todas as questões de geometria têm "O desenho").

Corrigido desde a rodada 1 (conferido): "Resposta: alternativa X" agora tem a letra nas 12; o enunciado ambíguo e a alternativa C de ond-00d saíram; as Antes de Doppler, tubo, corda, série/paralelo, nós/simetria, fabricantes, potência de dez agora existem; opt-00d e ele-00c ganharam figura; ele-00d agora tem número antes da letra.

| Questão | Tropeços |
|---|---|
| ond-00a | 4 |
| ond-00b | 5 |
| ond-00c | 3 |
| ond-00d | 3 |
| opt-00a | 3 |
| opt-00b | 3 |
| opt-00c | 5 |
| opt-00d | 5 |
| ele-00a | 4 |
| ele-00b | 3 |
| ele-00c | 2 |
| ele-00d | 4 |

Tipo que mais se repete: número que aparece antes da conta que o produz, ou sem cadeia (tipo 10: 11 vezes). Depois: conta sem passo (tipos 18 e 19: 8), notação ou letra sem leitura (tipos 11, 12, 16, 17: 12) e palavra que nenhuma tela define (tipos 1 e 8: 5).

---

## ond-00a (sonar, 2 ecos) — 4 tropeços. Conta refeita: 600 − 360 = 240, alternativa D. Distratores 150, 330, 360, 960 batem.
1. [Achando car] "36 · 36 = 1 296, então 360 · 360 = 129 600" -> de onde veio o 36? (tipo 10). O aluno não tem raiz quadrada de 129 600 e vê o 36 do nada.
2. [Achando car] "car · car = 202 500 − 72 900" -> passa de "diagonal² = lado² + lado²" para subtrair; a Antes só acha a diagonal, nunca um lado (tipo 18). "450 · 450 = 202 500" e "270 · 270 = 72 900" saem sem passo (tipo 19).
3. [Tela das fórmulas] "inclinado² = horizontal² + vertical²" -> como leio "²"? A Antes escreve "·" (tipo 12).
4. [Enunciado] "ultrassom", "sonar de varredura lateral" -> palavras sem explicação (tipo 1, leve; a pergunta se responde sem elas).

## ond-00b (sirene, Doppler) — 5 tropeços. Conta refeita: vf = 17 m/s, tração 136 N, alternativa E. Distratores 8, 123, 272, 603 batem.
1. [Achando vf] "13 600 = 800 · vf" -> de onde veio o 800? (é 420 + 380, passando 420 · vf para o outro lado, sem dizer) (tipos 10 e 18).
2. [Achando vf] "420 · 340 = 42 · 34 · 100 = 1 428 · 100" e "38 · 34 = 1 292" -> sem passo (tipo 19).
3. [Volta na equação, tabela] "cte = 135 660 (= 420 · 323)" -> o 323 só nasce na tela seguinte ("340 − 17 = 323"); a tabela mostra o número antes da conta (tipo 10).
4. [De onde vem 2 de 3] "Nos outros pontos do círculo o som é ouvido entre esses dois valores. A direção ... quase não muda" -> afirmação sem caso (tipo 3/14); "entre esses dois valores" vale para todos os pontos?
5. [Volta] "2 312 ÷ 17. 17 · 100 = 1 700, sobram 612; 17 · 36 = 612" -> como achou o 36? (tipo 10).

## ond-00c (tubo com água) — 3 tropeços. Conta refeita: lam = 0,68 m, vel = 340, tem = 15 °C, alternativa A. Distratores −18, −7, 4, 9 batem (−18,3; −7,2; 3,9; 9).
1. [De onde vem 1 de 2] "Com lam = 68 cm, o 1º reforço seria em lam ÷ 4 = 17 cm" -> o 68 é usado antes de ser achado (só aparece na conta depois) (tipo 10). Na tela 2, "4 · 16 = 64 cm erra: daria vel = 320 m/s e −18 °C" cita 320 e −18 sem cadeia (tipo 10).
2. [Enunciado] "O ventre do som fica um pouco fora da boca" -> "ventre" nunca é explicado (a Antes diz "folga"; a palavra "barriga" só existe na aula da corda) (tipos 1 e 8).
3. [Conferência, alternativa C] "4 · 16 e 4 · 50 ÷ 3 e fez a média" -> os números 64, 66,7 e a média 65,3 não aparecem; o −7 vem de uma conta que o aluno não vê (tipos 6 e 10).

## ond-00d (corda, modos) — 3 tropeços + 1 glitch. Conta refeita: mdc 140, kk de 1 a 7, 7 velocidades, alternativa B. Distratores 1, 5, 12, 140 batem (5 = divisores de 140 que são pelo menos 20).
1. [De onde vem 1 de 3] "O maior f1 possível é o mdc, 140 Hz (modos 3º e 5º)" -> o 140 e o "3º e 5º" aparecem antes de o mdc ser calculado (2 telas depois) e sem a conta 420 ÷ 140 = 3; "por que o maior f1 é o mdc?" (tipos 3 e 10).
2. [De onde vem 3 de 3] "f1 = 140 ÷ 3 também serve, com os modos 9º e 15º" -> 9 e 15 só são calculados na tela do kk (tipo 10).
3. [Equação] "qtd = quantos kk dão f1 = mdc ÷ kk pelo menos 20"; "kk" -> como leio "kk"? e isso não é uma equação com sinal de igual a conta (tipo 12).
Glitch de texto: campo "ideia": "dividido por um inteiro kk; O piso de 20 Hz" (ponto e vírgula e "O" maiúsculo no meio da frase). Não é conta.

## opt-00a (projetor, duas lentes) — 3 tropeços. Conta refeita: q1 = 30, h1 = 18, g2 = 4, p2 = 12,5, Df = 42,5, 10 s, alternativa B. Distratores 0, 6, 85, 100 batem.
1. [Achando p2] "q2 = 4 · p2 ... 1/p2 = 4/(4 · p2)" -> por que 1/p2 vira 4/(4 · p2)? Troca o número embaixo com letra, sem teste com número (tipo 18). "q2" também não está na lista de letras (tipo 16).
2. [Volta] "aumento 4 (10 ÷ 2,5)" -> de onde vem 10 ÷ 2,5? (2,5 = 10 − 7,5, e a fórmula g = f ÷ (f − p) nunca foi dada) (tipo 10).
3. [Conferência, alternativa C, bug leve de texto] "Esqueceu a lente 1: usou o slide de 3,6 cm como objeto da lente 2 (aumento 20, p2 = 10,5 cm)" -> a descrição não reproduz o 6 s: o 6 vem de Df = 30 + 10,5 = 40,5 e (40,5 − 37,5) ÷ 0,5. Quem "esqueceu a lente 1" não teria o 30 (tipo 6, detalhe; refiz: 6 s só sai se mantiver q1 = 30 e errar só o aumento).

## opt-00b (lente no líquido) — 3 tropeços. Conta refeita: nv 1,5, nl 1,6, N 15/16, f −120, q −30, hi 6 cm, alternativa C. Distratores A (4,8), B (5,2), D (12), E (12,4) batem.
1. [Achando q] "−1/120 − 3/120 = −4/120 = −1/30" -> subtrair de número negativo e simplificar por 4 sem passo (tipo 19). Também "15/16 − 16/16 = −1/16" no passo do N.
2. [Ideia] "o líquido é mais refringente que o vidro" -> "refringente" nunca é definido; a Antes usa só no exercício (tipo 1).
3. [Achando N] "1,5 ÷ 1,6 = 15 ÷ 16" -> o "multiplicar por 10 nos dois" não é dito aqui (tipo 19, leve).
Figura: não há tela "O desenho" (lente e objeto). A geometria não depende dela (é 1/f = 1/p + 1/q), então não conto como ausente; só registro.

## opt-00c (fibra óptica) — 5 tropeços. Conta refeita: nr 1,45; sl 29/30; Lc 3 103,4 m; ta 15 µs; tl 15,517 µs; at 0,517 ≈ 0,52 µs, alternativa D. Distratores 0, 1,67, 3,75, 15,5 batem.
1. [Achando Lc] "Para cada metro ao longo do eixo, o raio anda 1 ÷ sl metros" -> por que 1 ÷ seno? O aluno não tem seno como lado de triângulo; a Antes dá a regra sem de onde vem e o desenho só rotula "3 103,4 m" (tipos 2 e 3). Esta é a ideia central da questão.
2. [Desenho e enunciado] "revestimento" -> nunca é dito que é a camada de fora do núcleo; o desenho diz "núcleo entre dois revestimentos" (tipo 1).
3. [Letras] "ta" e "at" (e "tl", "sl") -> quase iguais; "ta" e "at" lidos de relance se trocam (tipos 12 e 17 leve).
4. [Volta, "Conferindo"] "103,4 ÷ (2,0 × 10⁸) ≈ 0,517 µs" -> sem a conversão de segundos para µs que a tela do ta mostrou (tipo 19).
5. [Checagem] a pergunta é idêntica ao exercício 1 da aula Antes (1,60 e 1,20); não mede nada novo (tipo da checagem, leve).

## opt-00d (corredor de espelhos) — 5 tropeços. Conta refeita: a = 4 (−10, −4, 2, 8), b = 4 (−8, −2, 4, 10), total 8, alternativa E. As 8 retas cruzam 0, 1, 1, 2, 2, 3, 3, 4 espelhos (conferi por script). Distratores 4, 5, 7, 16 batem.
1. [Achando a] "Passar o alvo pelos dois espelhos, um depois do outro, o desloca 2 · 3 = 6 m" -> regra sem caso; a Antes só tem 1 espelho (tipos 3 e 7).
2. [Achando b] "imagens do sensor sem inverter" / "invertido" -> "inverter" nunca é explicado (tipo 8).
3. [Achando lo e hi] "Para 45° para baixo a inclinação é −1" -> onde aprendi que 45° é inclinação 1? A Antes só diz inclinação = Δy ÷ Δx (tipo 4).
4. [Volta] "cruzam 0, 1, 1, 2, 2, 3, 3 e 4 linhas de espelho (y = 3, 6, 9 ou y = 0, −3, −6, −9), e simulei o raio" -> a lista de cruzamentos vem sem cadeia (tipo 10) e "simulei" é fala do autor, não da aula (tipo 15).
5. [Letras] "a" e "b" minúsculos ao lado de "alternativa A/B" e de "Alternativa A = ..." (tipo 17).
Figura: "corredor-imagens" existe, com legenda "cheias: dentro do cone de 45° / vazias: fora". Ok.

## ele-00a (chuveiro, 3 meses) — 4 tropeços. Conta refeita: 2 100, 4 200, 6 300 W; junho quente, julho superquente, agosto quente; 14,7 kW · 20 h · 0,90 = R$ 264,60, alternativa C. Distratores 211,68, 294, 302,40, 340,20 batem.
1. [Títulos dos passos] "Achando Pjun: a potência de cada posição / o que o chuveiro puxa / as outras duas posições" -> 3 passos com o nome "Pjun" que não calculam Pjun (tipo 11); e a letra "Pago" lê-se "pago" (tipo 12).
2. [Pjun, Pjul, Pago] "(16 ≥ 14)", "(16 < 20)", "(16 ≥ 16...)" -> como leio ≥ e <? (tipo 12). A Antes não os lê.
3. [Puxa da tomada] "puxando 100 W, 80 W viram calor. Então puxa o calor ÷ 0,8" -> o "então ÷ 0,8" salta; falta um teste: "para 80 W de calor, puxa 80 ÷ 0,8 = 100 W" (tipo 18).
4. [Volta] "294 · 9 = 2 646" -> sem passo (tipo 19, leve). Pegadinha dos 220 V, 4 pessoas e 80% estão avisadas; ok.

## ele-00b (duas baterias, potência máxima) — 3 tropeços. Conta refeita: Fem 12 V, Rin 1 Ω, 36 W, 2 520 J, 70 s, alternativa D. Distratores 24,2 (104 W), 72,9 (R = 1,5), 100,8 (média 10 V), 70 000 batem; R = 0,5; 2; 3 dão 32, 32, 27 W.
1. [Achando Fem] "ε1 · r2 + ε2 · r1" -> como leio "ε"? a Antes usa e não nomeia (tipo 12); a fórmula da Fem vem sem de onde sai (a Antes dá exemplo, não construção) (tipo 2).
2. [Achando Pot] "O topo é em R = Rin (vale sempre)" -> só testado com Rin = 1; "sempre" sem outro caso na tela (a Antes tem Rin = 3 mas só compara 2 valores) (tipo 14). Também "12 ÷ 2,25 ≈ 5,33 A e ≈ 35,6 W" sem conta e "≈" sem leitura (tipos 12 e 19).
3. [Conferência, alternativa A] "potência total das duas baterias, 104 W" -> número sem cadeia (104 = 16 · 6,67 − 4 · 0,67) (tipo 10).

## ele-00c (protoboard) — 2 tropeços. Conta refeita: Ram 150, Par 100, Itot 90 mA, Tp 9 V, Ic 60 mA, alternativa E. Distratores 17,9; 30; 45; 90 batem (R4 em série; R2; R3 em paralelo; total).
1. [Títulos e letras] "Achando Ram: quem sai da conta" -> o passo não acha Ram (tipo 11); "Par", "Tp", "Ic" -> como se leem? "Par" parece a palavra "par" (tipo 12).
2. [Conferência, alternativa C] "paralelo de 60 Ω, corrente total 112,5 mA" -> 60 Ω e 112,5 sem cadeia (300, 150 e 150 em paralelo = 60) (tipo 10).
Figura "protoboard-curto-aberto" existe e marca R4 curto e R3 aberto. Ok.

## ele-00d (cubo de resistores) — 4 tropeços. Conta refeita: 2 A, 1 A, 2 A; 24 + 12 + 24 = 60 V; 60 ÷ 6 = 10 Ω = (5/6) · 12, alternativa A. Distratores 4, 6, 8, 12 batem.
1. [Enunciado e desenho] "vértices opostos", "arestas", "diagonal do cubo" -> nenhuma tela define; "Cada traço do cubo é um resistor" ajuda, mas "aresta" e "vértice" ficam sem sentido (tipo 1).
2. [Achando Fra 1] "Finja que 6 A saem de P (a fração não depende desse valor)" -> por que 6? e "não depende" sem caso (tipos 10 e 14). O 6 serve por dividir por 3 e por 6, mas ninguém diz.
3. [Títulos] "Achando Fra" 6 vezes, e a 5ª tela já dá "Req = 60 ÷ 6 = 10 Ω" antes de a fração existir; depois a 6ª tela refaz tudo em letras (tipo 11 leve).
4. [Quedas] "De P a Q por um caminho, as quedas somam" -> a Antes diz "em fila"; aqui o caminho passa por 3 arestas diferentes de um cubo, e o aluno pergunta "e os outros caminhos?" (tipo 3).
Figura "cubo-resistores" existe com legenda de 2 A / 1 A / 2 A. Ok.

---

## Bugs de fato
- Conta ou gabarito errados: nenhum (12 gabaritos e 60 alternativas conferidos por script).
- Texto impreciso (não muda nenhuma resposta): opt-00a conferência da alternativa C ("esqueceu a lente 1" não produz o 6 s); ond-00d campo "ideia" com "kk; O piso".
- Figura ausente onde a geometria exige: nenhuma. (opt-00b e ele-00a não têm "O desenho"; nenhuma das duas depende de figura.)
