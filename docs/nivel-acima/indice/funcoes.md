# Índice de reais: FUNÇÕES (nível acima, Matemática, 23/11/2026)

Regra de direitos: nenhum enunciado real foi copiado. Cada real está descrita em palavras minhas (até 200 letras) com banca, ano e número.
Letras e passos das reais são **estimativas** minhas, tiradas do texto extraído (colunas embaralhadas, margem de uns 15%). O que está com "?" é leitura minha sem conferir resolução oficial.
Numeração: ENEM = caderno 7 azul (CD7), que é a do arquivo; nossas âncoras de ENEM usam a numeração do CD5 (ex.: 2022 q.176 no CD5 = q.158 no CD7, conferido pelo texto do modelo de infectados). ITA 1ª fase = número dentro de Matemática (2021: número geral da prova); a prova "ITA 2026" é a de outubro de 2025.
IME 2021: arquivo de correção comentada (Estratégia Militares), q.N na ordem do arquivo. HMMT e Oxford MAT: gabarito e soluções oficiais lidos.
Conteúdo = função afim, quadrática, exponencial, logarítmica, composição, inversa, gráficos, máximos e mínimos, equação funcional.
Não usei (texto ilegível, só alternativas em figura): Fuvest 2025 1ª fase V1 q.69 (gráfico de uma função com módulo, alternativas são desenhos), ITA 2022 1ª fase (digitalização ilegível), ENEM 2021 CD7 (texto embaralhado).
Conta de gabarito: onde diz "conta minha", refiz em Python (script no rascunho, não vai ao repositório).

## 1. As reais (12 de Funções, 6 bancas)
| id | fonte | estilo | letras (≈) | passos (≈) | descrição em palavras minhas (≤ 200 letras) |
|---|---|---|---|---|---|
| enem-2022-q158 | ENEM 2022 dia 2, q.158, CD7 (gab. C) | ENEM | 900 | 3 | Modelo quadrático do número de infectados por mês (t de 1 a 12) e cinco propostas de período de propaganda. Escolher o período que contém o mês do máximo. |
| enem-2023-q170 | ENEM 2023 dia 2, q.170, CD7 (gab. D) | ENEM | 520 | 4 | Montante diário dado por uma quadrática nos dias 1 a 30 e uma tabela de faixas de desempenho. Achar o menor montante do mês e classificar. |
| fuvest-2023-f2-M01 | Fuvest 2023 2ª fase, dia 2, M01 (3 itens) | Fuvest | 640 | 6 | Duas transportadoras: A com taxa fixa e preço por quilo; B com preço por quilo que muda acima de 30 kg. Escrever a tarifa de A, ver quando A é mais barata e repartir 200 kg com custo total dado. |
| fuvest-2023-f2-M02 | Fuvest 2023 2ª fase, dia 2, M02 (3 itens) | Fuvest | 620 | 7 | Quadrática com coeficientes a, b, c: a) acha a, b, c por três pontos; b) acha c por uma área de triângulo com o vértice; c) com a = 3 e c = −8, acha b para a composição com cosseno ter zero. |
| fuvest-2022-f2-M02 | Fuvest 2022 2ª fase, dia 2, M02 (3 itens) | Fuvest | 600 | 6 | Função que é x² num intervalo e dois segmentos de reta no resto (gráfico dado). Itens: onde cresce, valores em pontos e a área de um retângulo em função de x. |
| ita-2025-q4 | ITA 2025 1ª fase, Mat. q.4 (gab. D) | ITA | 150 | 3 | Funções f e g reais com g(x²) = f(2x² − x + 1) para x > 0. Escolher a afirmação (sobrejetora, injetora) que decorre. |
| ita-2021-q46 | ITA 2021 1ª fase, Mat. q.46 (gab. B) | ITA | 240 | 4 | Reunião dos gráficos de uma exponencial crescente, uma decrescente e um log de base 2, cortados por uma reta y = kx. Julgar afirmações sobre quantos cortes há conforme k. |
| ita-2026-q8 | ITA 2026 1ª fase, Mat. q.8 (gab. B) | ITA | 230 | 5 | Cúbica mônica com raízes reais e com simetria p(2 + x) = −p(2 − x). Pede o menor valor possível de p(0). |
| ime-2021-q8 | IME 2021, q.8 (gab. a) | IME | 150 | 4 | Equação funcional que liga f(x) e f((x − 1)/x) para x diferente de 0 e 1. Pede f(2). |
| ime-2026-q3 | IME 2026 discursiva de Matemática, q.3 | IME | 400 | 5 | f(x) é uma soma infinita de degraus g_n(x)/3^n (cada g_n liga em −1/n). Pede o menor inteiro x com f(x) + f(−1/x) ≥ 0,999. |
| hmmt-2024-feb-algnt-4 | HMMT fev. 2024, Álgebra e Teoria dos Números, q.4 | Harvard-MIT (d) | 170 | 4 | f é quociente de dois polinômios do 2º grau e vale n³ em n = 1, 2, 3, 4, 5. Pede f(0). |
| oxford-mat-2023-Q1I | Oxford MAT out. 2023, Q1 parte I (múltipla escolha) | Oxford (d) | 220 | 3 | Polinômio do 3º grau com p(0) = 0, p(1) = 1, p(2) = 2 e uma raiz repetida M positiva. Pede M. |

## 2. Onde mora a dificuldade
| id | ideia escondida | pegadinha (tipo da gramática) | tabela ou figura | junta com |
|---|---|---|---|---|
| enem-2022-q158 | O máximo de uma parábola está no vértice, t = 5; o mês 5 cai no período III (5 a 6) | 1 condição escondida (t natural, escolher o período e não o mês) | não (lista de propostas) | quadrática + leitura de intervalos |
| enem-2023-q170 | Parábola para cima: o menor valor está no vértice, no dia 20, e vale 5; depois classificar (fica "Ruim"). A expressão lida é x²/4 − 10x + 105 (? o expoente vem do texto embaralhado, coerente com o gabarito D) | 2 responder o que não foi pedido (classificação, não o valor nem o dia) | tabela de faixas | quadrática + tabela de classes |
| fuvest-2023-f2-M01 | B tem duas regras (até 30 kg e acima): A < B dá 15 < x < 45 (conta minha); e a divisão de 200 kg dá **dois** casos válidos, (A 150, B 50) e (A 190, B 10) | 3 contagem faltando (achar só um caso) e 1 condição (troca de regra aos 30 kg) | não | função por partes + 1º grau + desigualdade |
| fuvest-2023-f2-M02 | Em c: cos t só vai de −1 a 1, então 3u² + bu − 8 = 0 precisa de raiz em [−1, 1]; vale se b ≥ 5 ou b ≤ −5 (conta minha, pelos valores em ±1) | 1 condição escondida (a imagem de cos) | figura (triângulo ABV na parábola) | quadrática + composição + trigonometria (fora da escada) |
| fuvest-2022-f2-M02 | A área do retângulo (9 − x)·f(x) tem fórmula diferente em cada trecho do gráfico; é preciso ler cada segmento | 7 enunciado (domínio por partes, ]0, 9[) | figura (os valores dos segmentos dependem dela, ?) | função por partes + área de retângulo |
| ita-2025-q4 | A parábola 2x² − x + 1 é simétrica em x = 1/4: dois x > 0 diferentes têm o mesmo valor, então g(x²) repete e g não é injetora | 4 intuição que engana (olhar só f) | não | função composta + simetria da parábola |
| ita-2021-q46 | A exponencial e o log de base 2 são inversas (simétricas em y = x); com a decrescente, retas por zero cortam duas vezes em pelo menos três valores de k | 4 intuição (cada reta corta uma vez) e contagem de pontos | não (o aluno desenha) | exponencial + logaritmo + gráfico |
| ita-2026-q8 | p(2) = 0 e p é ímpar em torno de x = 2: p(x) = (x−2)³ + m(x−2) com m ≤ 0 (raízes reais); p(0) = −8 − 2m ≥ −8, mínimo −8 (conta minha, confere com a resolução comentada) | 2 pede o mínimo de p(0), não de m | não | cúbica + simetria + condição de raízes reais |
| ime-2021-q8 | A troca x → (x−1)/x → 1/(1−x) volta a x em 3 passos: 3 equações em f(2), f(1/2), f(−1); resolve e f(2) = 5/4 (conta minha em frações) | 4 intuição (procurar uma fórmula de f) | não | composição + sistema 3×3 + frações |
| ime-2026-q3 | Para x > 0, f(x) = 1/2; para x < 0, soma truncada de potências de 1/3; f(x) + f(−1/x) = 1 − 3^(−m)/2 com m = ⌈x⌉ − 1; o menor inteiro é 7 (conta minha em Python, sem resolução oficial ?) | 7 enunciado e 6 número grande que vira padrão (série) | não | função definida por série geométrica |
| hmmt-2024-feb-algnt-4 | x³·q(x) − p(x) vale 0 em 1 a 5, logo é (x−1)...(x−5); comparando o termo de x² e o constante tira q(0) = 85 e f(0) = 120/85 = 24/17 (oficial) | 4 intuição (tentar interpolar) | não | função racional + polinômio com raízes dadas |
| oxford-mat-2023-Q1I | Com raiz em 0 e raiz dupla M, p(x) = A·x·(x−M)²; p(1) = 1 e p(2) = 2 dão (2−M)² = (1−M)², M = 3/2 | 5 caso degenerado (a outra solução da equação dá 2 − M = 1 − M, absurdo) | não | polinômio + eliminação de A |

## 3. Como a banca cobra aqui
**ENEM**
- Modelo de situação real (infectados, vendas do mês), 500 a 900 letras, quadrática ou função por partes; 3 ou 4 passos.
- A ideia é "máximo ou mínimo no vértice" com um intervalo permitido (período, dias 1 a 30) e uma tabela de classes no fim. A conta é curta e a pegadinha é responder o que o texto pergunta.
- Observação: em 2022 a q.157 (CD7, salário por faixas) foi anulada; q.150 cobrou razão de potências (L = c·R²·T⁴, gab. D).

**ITA**
- 1ª fase: texto seco de 150 a 240 letras sobre conceito (injetora, simetria da parábola, gráficos de inversas) ou cúbica com simetria; 3 a 5 passos.
- A ideia é uma simetria ou uma inversa que o aluno precisa enxergar sem a figura.

**IME**
- Equação funcional com troca cíclica (x → (x−1)/x) e, na discursiva, função definida por série; 4 a 5 passos, resposta numérica limpa (5/4, 7).
- O que destrava é ver que a troca volta ao ponto de partida.

**Fuvest**
- 2ª fase em 3 itens: a) escrever a função, b) comparar ou ler um gráfico, c) um caso difícil (dois casos válidos, composição com cosseno).
- Pergunta precisa, uma condição escondida (limite de 30 kg, a imagem do cosseno), figura em alguns itens.

**Harvard-MIT e Oxford**
- HMMT: função dada só por valores (f(n) = n³) e a ideia é olhar o polinômio que se anula nesses pontos.
- Oxford MAT: múltipla escolha com polinômio e uma condição (raiz repetida); resposta pequena (3/2).
- Ideia curta, conta curta, resposta limpa.

## 4. As nossas 4 contra a real mais próxima
Todas as 4 têm enunciado só de texto: nenhuma tem tabela ou figura própria (a fun-00a diz "como mostra a tabela", mas os dados só vêm em "Dados:"; regra 4 segue aberta). Gabaritos das 4 conferidos por conta minha: 00a = R$ 1 200 (B), 00b = 17 (C), 00c = 8 valores (C), 00d = 3 069 (C).
| id nosso | estilo marcado | letras / passos nossos | real mais próxima | mesma técnica? | dificuldade vs a real | estilo certo? | veredito |
|---|---|---|---|---|---|---|---|
| d2-escada-mat-ita-fun-00a (bolo, reta de vendas, lucro e teto de R$ 25) | a = ENEM | 914 / 5 | enem-2022-q158 (a âncora marcada) e enem-2023-q170 | sim: parábola, máximo, e o período ou limite permitido | maior que a real (a real é só o vértice; a nossa acha a reta, monta o lucro e vê que o vértice, 30, passa do teto) | sim (914, tabela citada, condição escondida) | **MANTER** |
| d2-escada-mat-ita-fun-00b (máquina de moedas, f(f(x)) = 9x + 8, a > 0) | b = ITA | 261 / 3 | ita-2025-q4 e ime-2021-q8 (ITA e IME); a âncora marcada é Unicamp 2024 q.64 | sim com a Unicamp (composição com coeficientes); não com ITA/IME | menor: a Unicamp q.64 já é de 3 passos, e as de ITA/IME escondem uma simetria ou um ciclo | só no tamanho; falta a ideia de ITA | **REESCREVER** |
| d2-escada-mat-ita-fun-00c (parábola x² − 6x + k, k de 1 a 20, duas raízes positivas distintas) | c = Fuvest | 349 / 4 | ita-2025-q6 e fuvest-2023-f2-M02 (item c) | parcial: raízes positivas e distintas com parâmetro (ITA q.6), sem a composição da Fuvest | menor: só Δ > 0, soma e produto, sem substituição e sem composição; a Fuvest junta composição e intervalo | sim no tamanho; a pegadinha k = 9 é boa mas é uma só | **REESCREVER** |
| d2-escada-mat-ita-fun-00d (fila "dobra e soma 3", 10 posições depois) | d = Harvard-MIT | 348 / 4 | ita-2023-q38 (iteração periódica) e hmmt-2024-feb-algnt-4 | não: a nossa é ponto fixo + PG; as âncoras marcadas (Unesp PG, ITA 2025 q.5) são de outra coisa | menor: truque conhecido (somar 3 vira PG), sem caso escondido; Harvard pede ideia que o aluno ainda não viu | não: é recorrência de ENEM/Unesp, não função de Harvard | **TROCAR** |

Motivo (2 linhas por veredito):
- **fun-00a MANTER:** é mais difícil que a real do ENEM (vértice só) e cumpre o estilo a: 914 letras, junção de reta, lucro e parábola, teto como condição escondida. Falta só uma tabela de verdade no enunciado (regra 4).
- **fun-00b REESCREVER:** a técnica é a da Unicamp (composição com coeficientes), mas ITA/IME pedem uma ideia escondida (simetria, ciclo). Subir para equação funcional com troca de ordem 3, como a real do IME 2021.
- **fun-00c REESCREVER:** a conta é só discriminante, soma e produto. Falta a camada que as reais têm (composição, substituição, contar soluções); subir para t⁴ − 6t² + k = 0 contando soluções em t.
- **fun-00d TROCAR:** a âncora marcada é de outra técnica e o truque "soma 3 vira PG" é conhecido. Trocar pela periodicidade de uma função iterada (ITA 2023 q.38) com pergunta de contagem, estilo HMMT.

## 5. Propostas (não são o enunciado final; números conferidos por conta em Python)

### fun-00b (b, ITA) REESCREVER: equação funcional com troca de ordem 3
- **Âncora por técnica:** IME 2021 q.8 (equação funcional que liga f(x) e f((x−1)/x)); mesma classe de tamanho de ITA, 150 letras.
- **Ideia escondida:** a troca T(x) = 1/(1 − x) volta ao começo em 3 passos (T(T(T(x))) = x); escreve-se a equação em x, em T(x) e em T(T(x)) e fica um sistema 3×3 nas três imagens.
- **Junta de degraus anteriores:** Equações (sistema 3×3), Aritmética (frações), Funções (composição e ciclo).
- **Pegadinha:** 4 intuição que engana (supor f(T(x)) = f(x) dá 1/6) + 1 condição (x diferente de 0 e de 1: o domínio é fechado pela troca).
- **Números:** f(x) + 2·f(1/(1 − x)) = x para todo x diferente de 0 e 1. Pede f(1/2). Conta: f(1/2) + 2f(2) = 1/2; f(2) + 2f(−1) = 2; f(−1) + 2f(1/2) = −1; resolvendo em frações, **f(1/2) = −5/6** (f(2) = 2/3, f(−1) = 2/3, e a soma dos três vale 1/2). Conferido para x = 3: f(3) = 20/27 e a equação fecha. Distratores: 1/6 (supor f igual nos dois pontos), 2/3 (é f(2), responder o que não foi pedido), 5/6 (erro de sinal), 1/2 (a soma dos três).
- **Forma:** texto seco de ITA (uns 150 letras), sem figura; o diagrama do ciclo 2 → −1 → 1/2 → 2 fica na explicação. (Escolher 1/2 e não 2: com x = 2 o atalho errado dá a resposta certa por coincidência, 2/3.)

### fun-00c (c, Fuvest) REESCREVER: contar soluções da biquadrada pela composição
- **Âncora por técnica:** ITA 2025 q.6 (duas soluções distintas, parâmetro, substituição que exige valor positivo) com o item c da Fuvest 2023 F2 M02 (composição com uma função de imagem limitada).
- **Ideia escondida:** f(t²) = 0 com f(u) = u² − 6u + k: cada u positivo vira 2 valores de t, u = 0 vira 1 e u negativo vira nenhum; a pergunta é "exatamente 2 soluções reais distintas", e não "duas raízes".
- **Junta:** Equações (biquadrada), Funções (composição e função par), Aritmética/contagem (de k inteiros).
- **Pegadinha:** 5 caso degenerado (k = 9 dá u = 3 dupla, que ainda são 2 soluções; k = 0 dá 3 soluções) + 3 contagem faltando (os k negativos entram).
- **Números:** k inteiro de −10 a 20; equação t⁴ − 6t² + k = 0. Conta por Python: 4 soluções para k de 1 a 8; 3 para k = 0; 2 para k de −10 a −1 e k = 9; 0 para k de 10 a 20. Exatamente 2 soluções: **11 valores de k**. Distratores: 10 (esquece k = 9), 12 (inclui k = 0), 8 (conta os k de 1 a 8), 9 (k de 1 a 9).
- **Forma:** texto de uns 350 letras; desenho do gráfico de y = t⁴ − 6t² + k para três valores de k (regra 4).

### fun-00d (d, Harvard-MIT) TROCAR: função iterada e a contagem de pontos fixos
- **Âncora por técnica:** ITA 2023 q.38 (f aplicada 2023 vezes, a sequência de iterados é periódica; conta minha: f^(2023)(0) = −i) e a ideia de contagem de HMMT.
- **Ideia escondida:** f(x) = 1/(1 − x) tem período 3 (f três vezes é a identidade), então f^2026 = f (2026 deixa resto 1 na divisão por 3) e os pontos fixos de f^2026 são os de f: x² − x + 1 = 0, que não tem raiz real (Δ = −3).
- **Junta:** Funções (composição, iteração), Aritmética (divisão com resto), Equações (2º grau e discriminante).
- **Pegadinha:** 6 número grande vira padrão (2026 não se calcula) + 5 caso degenerado (o domínio é x diferente de 0 e 1, e as iteradas ficam dentro dele).
- **Números:** "Quantos números reais x (x diferente de 0 e 1) satisfazem f^2026(x) = x?" Conta em Python: f(f(f(x))) = x testado em 4 valores e f^2026 = f nos mesmos 4; Δ = 1 − 4 = −3 < 0. Resposta **0**. Distratores: 1, 2, 3 (o período), 2026.
- **Forma:** texto de uns 250 letras, sem figura; o diagrama do ciclo de 3 fica na explicação. A resposta 0 é curta e limpa, como Harvard pede.

## 6. Defeitos achados nas âncoras nossas (para o chefe decidir)
- `fun-00a`: âncora "ENEM 2022 q.176 (935 letras)" confere (CD5 q.176 = CD7 q.158, modelo de infectados, vértice t = 5). Âncora certa.
- `fun-00b`: âncora "Unicamp 2024 q.64" confere em técnica, mas a real é de 3 passos e a nossa tem o mesmo nível; para ITA faltam as âncoras ITA 2025 q.4 ou IME 2021 q.8.
- `fun-00c`: âncora "IME 2024 q.4" é **fraca**: no repositório pede a⁴ + b⁴ por Girard (soma e produto das raízes, sem sinais nem contagem). A âncora certa para "duas raízes positivas distintas com parâmetro" é ITA 2025 q.6.
- `fun-00d`: âncora "Unesp 2025 (PG) e ITA 2025 q.5" é **errada**. A Unesp (q.90) é uma partícula com velocidade dobrando (PG); a ITA 2025 q.5 liga S_n a b_(n+1) − b_1 e julga 3 afirmações. Nenhuma usa ponto fixo; a mais próxima de "iterar uma regra" é ITA 2023 q.38.
- Equação com exponencial e logaritmo: a escada de Matemática só tem "Funções" afim e quadrática (gramática, "Lacuna honesta"); as reais de exponencial e log (ITA 2021 q.46, ITA 2025 q.6) ficam como âncora de técnica, e as propostas acima só usam afim, quadrática e composição.
