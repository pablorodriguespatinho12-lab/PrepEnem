# Métodos: Fuvest, combinatória e probabilidade (capítulos fuv-07 a fuv-10)

Vídeo KHUAr8Svoik, de 3:19:06 a 5:35:46. A banca é a conversa de duas vozes; "ele" abaixo é quem explica. Contas refeitas por força bruta quando possível. "?" marca o que não fecha ou não é dito.

### fuv-07-analise-combinatoria-e-probabi.txt

- **Método** `[3:23:31]` Bloco para quem fica junto: o enunciado diz "juntas" → cada grupo vira uma caixa, quem está sozinho também é uma caixa → permutar as caixas → multiplicar pela permutação dentro do bloco. Por que funciona: o bloco garante a vizinhança em toda arrumação.
- **Erro que ele avisa** `[3:24:01]`: esquecer o 2! de dentro do bloco, ou contar só as pessoas soltas e esquecer o bloco como caixa (são 7 caixas, não 6).
- **Método** `[3:26:31]` Árvore de todas as situações: duas condições ao mesmo tempo → abrir os ramos (A e B juntas ou separadas; dentro de cada um, C e D juntos ou separados) → marcar o ramo pedido. Por que funciona: os quatro ramos cobrem tudo, sem sobreposição.
- **Método** `[3:29:30]` Contagem indireta (complementar): o pedido é "separados" → contar o total e tirar os "juntos". Por que funciona: juntos se resolve com bloco; separados exigiria olhar posição por posição.
- **Método** `[3:32:02]` Subtrair dentro do ramo: pedido "A e B juntas, C e D separados" → (A e B juntas) menos (os dois pares juntos). Por que funciona: o "total" da subtração é o ramo em que já se está, não todas as filas.
- **Método** `[3:35:00]` Conferência pela soma: os quatro ramos têm de somar 8!. Se não somar, há erro.
- **Conselho de prova** `[3:36:30]`: não existe receita para escolher entre contagem direta e indireta; vem de fazer muitas questões e sofrer o caminho ruim. Usar o complementar em tudo também é erro (juntas se conta direto).
- **Método** `[3:44:01]` Caso exagerado: probabilidade condicional pouco intuitiva → trocar 2 lançamentos por 100 caras seguidas → ver para onde a probabilidade vai. Por que funciona: mostra que a informação nova muda a chance.
- **Método** `[3:46:30]` Teste do resultado que elimina: perguntar que resultado zeraria uma hipótese (sair 1 coroa → a moeda é 100% honesta). Mostra que o dado altera a probabilidade.
- **Erro que ele avisa** `[3:42:01]`: responder 2/3 ignorando que as duas caras são informação nova. `[3:42:30]` Também o "tem duas opções, logo 50%".
- **Método** `[3:47:30]` Árvore de probabilidade em vez de fórmula: há sorteio em etapas → primeiro ramo é a moeda (1/3 cada), depois os resultados dos lançamentos → multiplicar ao longo do ramo. Regra dele: "Tem fórmula, tem. Recomendo usá-las? Não" `[3:47:30]`.
- **Método** `[3:50:02]` Multiplicar no mesmo caminho: duas coisas precisam acontecer → produto (1/4 de 1/3 = 1/12). Por que funciona: o segundo fator reparte só o pedaço do primeiro.
- **Método** `[3:52:31]` Quadrado de áreas: desenhar o todo como retângulo → cortar em 3 faixas (moedas) → cortar cada faixa em 4 (resultados) → a probabilidade é área pintada sobre área total. A faixa da moeda de duas caras sai cara em tudo (vale 4/12).
- **Método** `[3:55:00]` Probabilidade total: sem informação extra, "qual a chance de saírem duas caras" → somar todos os ramos com o resultado (1/12 + 1/12 + 1/3 = 1/2).
- **Método** `[3:57:30]` Novo espaço amostral: "sabendo que saiu X" → ficar só com os quadradinhos em que X acontece → contar neles os favoráveis. Por que funciona: o que não aconteceu sai do denominador.
- **Conselho de prova** `[3:58:30]`: a resposta contraintuitiva se explica perguntando qual hipótese produz melhor o resultado visto; a que produz mais fica mais provável.
- **Questão resolvida** `[3:21:00]`: banca e ano não ditos. Fila de 8, um par junto e outro separado. Ideia: blocos e subtração no ramo. 2!·7! − 2!·2!·6! = 10080 − 2880 = **7200** (conferida). Em `[3:31:00]` ele fala "total menos o 7!" para "separadas"; o certo é 8! − 2·7!.
- **Questão resolvida** `[3:45:01]`: banca e ano não ditos. Três moedas (duas honestas, uma de duas caras), saíram duas caras; chance de ser honesta. (2/12) ÷ (6/12) = **1/3** (conferida).
- **Aparte sem uso de prova** `[3:39:32]`: teorema da "bola cabeluda" (não dá para pentear a esfera toda).
- **O que ele desenha**: 8 posições com letras e caixas em volta dos blocos `[3:23:30]`; árvore de quatro ramos junto/separado, com o ramo pedido destacado `[3:26:31]`; as três moedas `[3:45:01]`; árvore moeda e lançamentos `[3:47:30]`; quadrado 3 por 4 pintado `[3:53:00]`.

### fuv-08-analise-combinatoria-e-probabi.txt

- **Conselho de prova** `[3:59:30]`: informação nova muda a probabilidade; em aposta, recalcular a cada carta. Nas duas caras, desonesta é 2/3 contra 1/3: o dobro. Em `[3:59:30]` ele diz "66% mais chance": **erro**; 66% é a chance, e ela é 100% maior que 1/3.
- **Método** `[4:02:31]` Monty Hall, trocar: apresentador abre porta vazia depois da escolha → trocar → chance vai de 1/3 para 2/3. Condição: ele sabe onde está o prêmio e só abre porta vazia (ele diz que o apresentador é "obrigado" quando sobra uma só, `[4:08:30]`).
- **Método** `[4:02:31]` Exagerar para 100 portas: abrir 98 vazias → a primeira escolha segue com 1%, a outra fica com 99%. Por que funciona: a chance das portas abertas se acumula na que sobrou. (`[4:05:00]` "99% mais provável" é fala solta; o certo é 99 vezes mais.)
- **Método** `[4:06:02]` Pensar no erro: chance de errar de primeira (99/100) é a chance de ganhar trocando, porque quem errou e troca cai no prêmio.
- **Método** `[4:07:02]` Fixar a estratégia e testar todos os casos: prêmio numa porta, escolher 1, 2 e 3 sempre trocando → perde, ganha, ganha = 2/3.
- **Erro que ele avisa** `[4:04:31]`: "sobraram duas portas, então 50% cada".
- **Método** `[4:10:30]` Condicional pela conta: favorável sobre o total do que foi observado: (1/12 + 1/12) ÷ (1/12 + 1/12 + 1/3) = 1/3. O quadrado pintado é essa fração.
- **Método** `[4:14:30]` Caminho em malha é anagrama: só anda em duas direções → escrever o caminho como palavra de D e C → permutação com repetição (3 D e 4 C: 7!/(4!·3!) = 35). Por que funciona: cada caminho é uma única palavra e vice-versa.
- **Conselho de prova** `[4:14:00]`: problema de caminhos é clássico; quem nunca viu dificilmente deduz na hora.
- **Método** `[4:17:32]` Passagem obrigatória: "passando por P" → contar A até P, contar P até B, multiplicar (4 × 3 = 12).
- **Método** `[4:18:30]` Não passar por P: total menos os que passam (35 − 12 = 23).
- **Método** `[4:19:00]` Descartar pontos de encontro testando passos: uma tem o dobro da velocidade → quem é rápida dá o dobro de passos → testar um ponto e rejeitar se a razão não for 2.
- **Método** `[4:21:30]` Soma fixa de passos: dois andam em sentidos opostos numa malha 6 por 6 sem voltar → a soma dos passos até o encontro é 12 → com razão 2 para 1, são 8 e 4.
- **Erro que ele avisa** `[4:28:01]`: dar 8 e 4 passos é necessário, não suficiente; as duas podem parar em pontos diferentes.
- **Método** `[4:22:30]` Mudança de referencial (física): dois móveis de velocidade constante → parar um, somando o oposto da velocidade dele no outro → vira um móvel só (2 m/s e 3 m/s de frente = 5 m/s). Não resolve a malha porque a direção da velocidade muda a cada passo `[4:24:31]`.
- **Método** `[4:30:00]` Listar pelo móvel mais lento: marcar onde quem dá 4 passos pode chegar; são os candidatos a encontro. Para cada um, a outra chega com 8.
- **Método** `[4:32:00]` Argumento por coordenadas: cada passo soma 1 em x ou em y → após 8 passos, x + y = 8 → os encontros estão numa reta. São **5 pontos**: (2,6) a (6,2) (conferido).
- **Método** `[4:35:00]` Contar pares por ponto: em cada ponto, caminhos de uma vezes caminhos da outra (as duas coisas precisam acontecer): ponto 1: 8!/(6!·2!) × 1 = 28.
- **Método** `[4:35:30]` Simetria: pontos espelhados têm a mesma contagem; calcular um e copiar (28 e 28; 224 e 224 = 56 × 4).
- **Questão resolvida** `[4:07:00]` (com `[4:04:00]`): Monty Hall, clássico de programa de TV americano; sem banca. Trocar dá **2/3** (conferida).
- **Questão resolvida** `[4:14:00]`: exemplo próprio. Malha 3 por 4: **35**; passando por P: **12** (conferidas).
- **Questão resolvida** `[4:12:00]`: banca e ano não ditos ("caso clássico" com inovação dele). Ana e Beatriz em malha 6 por 6; a contagem continua no fuv-09.
- **O que ele desenha**: três portas e 100 portas com X `[4:00:32]`; tabela porta escolhida e ganha/perde `[4:08:00]`; malha com as duas nas quinas opostas `[4:12:32]`; palavra DDDCCCC com setas `[4:15:02]`; casa do Paulo no meio da malha `[4:17:32]`; dois carros com vetores `[4:22:30]`; eixos x, y e a reta y = −x + 8 `[4:32:00]`; pontos de encontro numerados.

### fuv-09-analise-combinatoria-e-probabi.txt

- **Método** `[4:39:32]` Cancelar fatorial antes de multiplicar: no ponto do meio, 8!/(4!·4!) × 4!/(2!·2!) = 70 × 6 = **420**.
- **Método** `[4:40:30]` Somar os casos disjuntos, dobrando os simétricos: 2·28 + 2·224 + 420 = **924** (conferida).
- **Método** `[4:42:01]` Fechar a probabilidade: pares que se encontram sobre pares de caminhos possíveis. Ele só indica e **não calcula**. Atenção "?": a regra do enunciado (50% quando há escolha, passo forçado na borda) faz os caminhos de Ana **não** serem igualmente prováveis. Contagem sobre contagem não vale. Cálculo meu por programa: probabilidade = Σ P(Ana no ponto) × P(Beatriz no ponto) = **471/2048**, cerca de 0,23. 924 está certo como número de pares, não como numerador de uma razão de casos equiprováveis.
- **Método** `[4:45:30]` Menor distância por referencial: dois móveis de velocidade constante → passar ao referencial de um (somar o oposto da velocidade dele em todos) → o outro anda numa reta com a velocidade composta → menor distância é a perpendicular do ponto parado à reta. Por que funciona: distância entre dois pontos e tempo não mudam com o referencial (física clássica).
- **Método** `[4:49:00]` Semelhança de triângulos: o triângulo das velocidades é semelhante ao das distâncias → d_min / VA = d / raiz(VA² + VB²).
- **Método** `[4:51:30]` Caminho alternativo, função quadrática: escrever D²(t) = (d − VB·t)² + (VA·t)² → t do vértice = −b/2a = d·VB/(VA² + VB²) → substituir → tirar a raiz. Por que funciona: minimizar o quadrado da distância minimiza a distância.
- **Método** `[5:02:00]` Tempo do mínimo no referencial: achar o trecho percorrido por Pitágoras (d e d_min) e dividir pela velocidade relativa. Dá o mesmo tempo.
- **Erro que ele avisa** `[5:03:30]`: mudança de referencial não resolve de uma vez quando cada passo pode ter duas direções; viraria vários casos `[5:04:01]`.
- **Conselho de prova** `[4:56:31]`: a escolha do referencial certo troca uma conta longa de álgebra por uma semelhança.
- **Método** `[5:08:00]` Simplificar e subir: pedido difícil ("no máximo 3 números") → separar em exatamente 1, 2 e 3 → resolver do mais fácil e somar no fim.
- **Método** `[5:09:01]` Probabilidade direta do "todos iguais": primeiro dado livre (6/6), os outros 4 repetem (1/6 cada) → 1/6⁴.
- **Método** `[5:10:02]` Casos favoráveis sobre espaço amostral: 6⁵ resultados; favoráveis = escolher o número repetido, C(6,1) = 6 → 6/6⁵.
- **Método** `[5:17:02]` Separar por estrutura de repetição: com 2 números, ou 4+1 ou 3+2 → contar cada formato. (Continua no fuv-10.)
- **Questão resolvida** `[4:40:30]`: mesma malha; **924** pares de caminhos com encontro; probabilidade não dita (ver "?" acima).
- **Questão resolvida** `[4:43:00]`: ele diz que caiu "no ITA" (a legenda escreve "Ital") e que adaptou; ano não dito. Menor distância: **d·VA / raiz(VA² + VB²)**, tempo d·VB/(VA² + VB²) (conferida pelos dois caminhos).
- **Questão resolvida** `[5:06:30]`: "questão 12"; banca e ano não ditos aqui. Cinco dados, anotar sem repetir. Parte de 1 número: **1/6⁴** (conferida; ele diz 1/6⁵ de passagem em `[5:09:01]` e corrige).
- **O que ele desenha**: A subindo e B vindo na horizontal, ângulo de 90° `[4:43:32]`; vetor oposto somado em B e a velocidade resultante `[4:47:30]`; perpendicular do A à reta e os dois triângulos com o ângulo pintado `[4:49:00]`; parábola de D² por t `[4:55:02]`; caixas dos dados D1 a D5 com X e Y `[5:14:01]`.

### fuv-10-analise-combinatoria-e-probabi.txt

- **Método** `[5:19:30]` Escolher os valores primeiro: 2 números distintos entre 6 → C(6,2) = 15. Depois arrumar nos dados.
- **Método** `[5:21:00]` Fixar um exemplo e permutar como palavra: tomar {3, 6} → cada formato é um anagrama → 5!/4! = 5 e 5!/(3!·2!) = 10.
- **Método** `[5:22:31]` Trocar os papéis: quem aparece mais pode ser qualquer um dos dois → multiplicar por 2: (5 × 2) + (10 × 2) = **30**.
- **Erro que ele avisa** `[5:23:01]`: não listar como caso novo o formato espelhado (1X e 4Y) e ainda multiplicar por 2; conta duas vezes.
- **Erro que ele comete e corrige** `[5:26:30]`: esquecer o C(6,2). Total = 15 × 30 = **450**.
- **Método** `[5:29:01]` Três números: escolher a trinca, C(6,3) = 20.
- **Método** `[5:29:31]` Maximizar um número: listar formatos começando pela maior repetição → com 3 letras em 5 dados só há 3+1+1 e 2+2+1. Dica dele: "sempre tente maximizar um deles" `[5:29:31]`.
- **Método** `[5:31:01]` Anagrama vezes a escolha do papel especial: 3+1+1: 5!/3! × 3 (quem repete) = 60. 2+2+1: 5!/(2!·2!) × 3 (quem aparece uma vez) = 90.
- **Método** `[5:33:30]` Multiplicar pelo número de grupos e somar: P3 = 20 × (60 + 90) / 6⁵; resposta = P1 + P2 + P3.
- **Erro no vídeo** `[5:33:00]`: ele fala 45, corrige para 90, mas segue com **105** e 2100. O certo é 150 e **3000** (conferido por força bruta). A soma final não é dita.
- **Conselho de prova** `[5:33:00]`: o raciocínio importa mais que a conta (mas a conta errada mudaria a alternativa). `[5:35:01]` Ele estima que cerca de 30% da prova da Fuvest tem esse nível, com base nos dois simulados oficiais (estimativa dele, "?"). Pausar e descansar entre blocos.
- **Questão resolvida** `[5:19:30]`: cinco dados, no máximo 3 números distintos. P1 = 6/7776; P2 = 450/7776; P3 = 3000/7776; total **3456/7776 = 4/9** (conferido; no vídeo P3 sairia 2100, errado). Banca e ano não ditos.
- **O que ele desenha**: formatos XXXXY e XXXYY, com o par exemplo 3 e 6 `[5:21:00]`; formatos XXXYZ e XXYYZ em colunas D1 a D5 `[5:29:31]`.

## Cobertura

| capítulo | palavras (`wc -w`) | li inteiro | nº de métodos |
|---|---|---|---|
| fuv-07-analise-combinatoria-e-probabi.txt | 7540 | sim | 12 |
| fuv-08-analise-combinatoria-e-probabi.txt | 7703 | sim | 15 |
| fuv-09-analise-combinatoria-e-probabi.txt | 7649 | sim | 11 |
| fuv-10-analise-combinatoria-e-probabi.txt | 3188 | sim | 7 |
