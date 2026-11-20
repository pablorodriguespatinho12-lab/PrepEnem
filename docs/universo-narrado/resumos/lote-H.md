## Permutação e Repetição (Análise Combinatória)

**1. Gancho**
Pergunta com a palavra escrita na tela: "Quantos anagramas possui a palavra acaba?" [23:05:00]. Diz que não vai "jogar uma fórmula": vai explicar de onde ela vem [23:05:00].

**2. Ordem das etapas**
1. Problema ACABA e o erro do 5! (permutação simples) [23:06:31]-[23:07:00]
2. Colore as letras A de três cores para mostrar que, se fossem diferentes, seriam 5! palavras [23:08:00]-[23:09:32]
3. Cada palavra real foi contada 6 vezes [23:13:00]
4. Divide por 3! = 6 [23:14:01]-[23:15:32]
5. Generaliza: n!/(a!·b!·c!) [23:17:30]-[23:18:33]
6. PARALELA: 8!/(3!·2!) [23:18:33]-[23:21:02]
7. Caminhos de A a B só com Leste e Norte, vistos como anagramas de LLLLLNNNN [23:21:30]-[23:28:00]
8. Caminhos passando pelo ponto P: 20 × 3 = 60 [23:29:02]-[23:33:31]
9. Caminhos sem passar por P: 126 − 60 = 66 [23:34:03]-[23:34:30]
10. Placas: conta o número de estruturas e multiplica [23:37:00]-[23:45:31]

**3. Analogias e frases marcantes**
- "Esquece sentido da palavra. Olha só pra palavra." [23:26:31]
- Cada palavra formada é um caminho diferente [23:24:31]-[23:25:00]
- "Dividir pelo que você contou repetido": raciocínio que ele diz que vai usar nesta aula e na próxima [23:34:30]

**4. De onde vem a fórmula**
- Se todas as letras fossem diferentes seriam n! palavras, mas trocar duas letras iguais não gera palavra nova [23:10:30]-[23:12:00].
- Cada palavra foi contada a! vezes (a = número de letras repetidas) [23:13:00]-[23:15:32].
- Fórmula: n!/(a!·b!·c!). Pode haver só uma repetição, ou mais [23:17:30]-[23:18:33].
- Para simplificar, abre o maior fatorial até encontrar o menor [23:19:30]-[23:20:01].

**5. Pegadinhas e dicas de ENEM**
- Usar n! direto ignora a repetição e conta palavras iguais várias vezes [23:07:00]-[23:13:00].
- Em placas, conte o tipo de estrutura (ordem das letras e números), não cada placa [23:42:30]-[23:44:02].

**6. Questões que ele resolve**
- ACABA: quantos anagramas? Resposta 20. Jeito: 5!/3! [23:15:00]-[23:15:32].
- PARALELA: legenda diz "3336"; a conta dá 3360 (?) [23:21:02].
- Caminhos A→B, 5 Leste e 4 Norte: 9!/(5!·4!) = 126 [23:27:00]-[23:28:00].
- Caminhos que passam por P: 20 × 3 = 60. Jeito: A→P × P→B [23:33:31].
- Y/X para placas: 35. Jeito: 7!/(4!·3!) = 35 estruturas, cada uma com o mesmo número de placas [23:45:31].

**7. Quadro**
- [23:08:00] letras A coloridas, para tratar como diferentes.
- [23:22:32] grade de A a B com passos Leste e Norte.
- [23:29:02] ponto P dividindo o caminho em dois trechos.

## Combinação Simples (Análise Combinatória)

**1. Gancho**
Diz que é "uma linha bem light" mas de "importância indescritível" [23:47:30]. Abre comparando com permutação, arranjo e o pódio [23:48:01]-[23:49:00].

**2. Ordem das etapas**
1. Revisão: arranjo conta a ordem, combinação não [23:48:01]-[23:49:00]
2. Combinação: subgrupo em que a ordem não importa (eu, você e o cachorro) [23:49:31]-[23:50:30]
3. Mostra a fórmula antes da explicação [23:50:30]-[23:51:00]
4. C(10,6) e C(10,4), e as complementares [23:52:00]-[23:55:30]
5. Pares de A a F: 15 [23:57:31]-[24:00:02]
6. Trios de A a F: 20 [24:01:00]
7. Sem fórmula: traços, 6 × 5 = 30, divide por 2 [24:02:31]-[24:05:31]
8. Divide por 3! (não por 6), depois por p! [24:07:30]-[24:09:30]
9. Basquete: contagem direta (350 − 90) [24:10:31]-[24:18:31]
10. Contagem indireta: 120 + 60 + 80 = 260 [24:19:02]-[24:24:00]

**3. Analogias e frases marcantes**
- "Eu, você e o meu cachorro, é o mesmo grupo" [23:50:00]
- "Quando você coloca tracinhos, você está considerando a ordem, mas você não pode considerar a ordem" [24:09:30]
- "Você precisa saber a fórmula para saber marcar uma alternativa caso ela apareça" [24:10:01]

**4. De onde vem a fórmula**
- O arranjo conta a ordem: n!/(n−p)!. Cada grupo aparece p! vezes (uma por ordem) [23:51:32]-[23:52:00].
- Exemplo AB e BA: contados separadamente, por isso divide por 2! [24:04:01]-[24:04:33].
- ABC aparece 6 vezes (3!) [24:07:30]-[24:08:00].
- Fórmula: C(n,p) = n!/(p!·(n−p)!) [23:51:00]-[23:52:30].
- Complementares: C(n,p) = C(n, n−p). Ex.: C(10,6) = C(10,4) = 210 [23:55:02]-[23:56:00].

**5. Pegadinhas e dicas de ENEM**
- No Enem, a alternativa pode trazer a conta pronta, como C(10,7). Precisa saber a fórmula [23:56:30]-[23:57:00].
- Não esquecer de dividir por p!, o número de elementos escolhidos [24:10:01].
- Muitos casos que você quer: calcula direto. Poucos: calcula o total e tira [24:24:00]-[24:24:32].

**6. Questões que ele resolve**
- Pares de A a F: C(6,2) = 15. Jeito: 6 × 5 ÷ 2 [23:57:31]-[24:00:02].
- Trios de A a F: C(6,3) = 20 [24:01:00]-[24:01:32].
- Basquete (5 defensores, 7 atacantes; escalar 3 de cada; James e Sanchez não juntos): 260. Jeito: 10 × 35 = 350, menos 90 com os dois juntos [24:14:02]-[24:18:31].
- Mesmo basquete, contagem indireta: só James 120, só Sanchez 60, nenhum 80; soma 260 [24:19:02]-[24:24:00].

**7. Quadro**
- [23:58:30] lista de pares de A a F (AB, AC...).
- [24:02:31] traços separando letras, para contar sem fórmula.
- [24:19:02] casos separados (James e Sanchez) para a contagem indireta.

## Combinação com Repetição (Análise Combinatória)

**1. Gancho**
"Nós vamos resolver uma questão do Enem nessa aula" [24:25:02]. Abre com a lanchonete: pastel, coxinha e empada [24:26:01].

**2. Ordem das etapas**
1. Erro clássico: 3 × 3 × 3 = 27 [24:26:31]-[24:27:02]
2. Lista de compras possíveis: 10 [24:28:00]-[24:29:31]
3. Método bola-traço: bolinhas são salgados, traços separam as categorias [24:30:30]-[24:31:32]
4. Liga com permutação com repetição: 5!/(3!·2!) = 10 [24:38:30]-[24:39:31]
5. Generaliza: 4 salgados = 15; 10 salgados = 66 [24:40:31]-[24:45:31]
6. Restrição "pelo menos um de cada": garante um de cada e permuta o resto: 36 [24:46:02]-[24:51:01]
7. Questão do Enem (caminhão cegonha): cores são categorias, carrinhos são bolinhas [24:51:31]-[24:57:31]
8. Liga com combinação: C(9,3) = C(9,6) [24:58:00]-[24:59:33]

**3. Analogias e frases marcantes**
- "Cada maneira diferente de organizar as bolinhas com os tracinhos representa uma compra diferente" [24:37:30]
- Garantir um de cada: "me dá um pastel, uma empada e uma coxinha" e colocar na sacola [24:48:00]
- "Sua mãe mandou você comprar, mas tem que trazer um de cada" [24:49:01]

**4. De onde vem a fórmula**
- Compra = sequência de bolinhas (itens) e traços (separadores). Com k categorias, são k − 1 traços [24:54:32]-[24:55:01].
- Cada arranjo de bolinhas e traços é uma compra: permutação com repetição de (n + k − 1) elementos [24:39:31]-[24:40:01].
- Com a restrição, tira-se uma bolinha de cada categoria e recalcula com o que sobra [24:48:31]-[24:50:02].
- Resultado: C(n + k − 1, k − 1) [24:55:01]-[24:55:30].

**5. Pegadinhas e dicas de ENEM**
- Multiplicar 3 × 3 × 3 conta a ordem; numa compra a ordem não importa [24:27:02]-[24:27:31].
- Mudar a posição dos carrinhos não gera modelo novo; o que conta é o número de carrinhos por cor [24:52:30]-[24:53:01].
- A alternativa pode trazer C(9,3) ou C(9,6). Sem a fórmula, não dá para marcar [24:59:00]-[24:59:33].

**6. Questões que ele resolve**
- Lanchonete, 3 salgados, 3 tipos: 10 compras. Jeito: listar ou bola-traço [24:28:00]-[24:29:31].
- 10 salgados, 3 tipos, sem restrição: 66. Jeito: 12!/(10!·2!) [24:45:00]-[24:45:31].
- 10 salgados, pelo menos um de cada: 36. Jeito: 9!/(7!·2!) [24:50:32]-[24:51:01].
- Caminhão cegonha: 10 carrinhos, 4 cores, cada cor pelo menos uma. Resposta: letra B; o valor 84 é conta minha (?), a legenda não mostra [24:53:01]-[24:59:33].

**7. Quadro**
- [24:30:30] bolinhas e traços (bola-traço).
- [24:38:30] letras B e T no lugar de bolinhas e traços.
- [24:55:01] 10 bolinhas e 3 traços para os carrinhos.

## Probabilidade

**1. Gancho**
Problema do Iago: três filhos homens, e a pergunta é sobre o quarto [25:01:33]. Frase: "deve vir uma menina, pô" [25:01:33]. Pede para o aluno parar e tentar antes [25:01:01].

**2. Ordem das etapas**
1. Problema do Iago [25:01:01]-[25:02:31]
2. Definição: casos favoráveis ÷ espaço amostral. Moeda 1/2, dado P(6) = 1/6, par = 1/2 [25:03:01]-[25:08:02]
3. Lei dos grandes números: aproximação de longo prazo, não previsão [25:04:30]-[25:06:02]
4. Eventos sucessivos: multiplica as probabilidades [25:09:00]-[25:11:00]
5. Quatro caras seguidas: 1/2 × 1/2 × 1/2 × 1/2 = 1/16 [25:11:31]-[25:13:01]
6. Árvore de probabilidade: 16 caminhos [25:15:01]-[25:21:31]
7. Contagem de caminhos com duas caras e duas coroas [25:24:03]-[25:28:31]
8. Volta ao Iago: a próxima filha continua 1/2 [25:32:01]-[25:33:01]
9. Resposta: 1/16 = 6,25% [25:33:01]-[25:33:32]

**3. Analogias e frases marcantes**
- Linha do tempo: cada decisão "mata" as outras linhas do tempo. Ex.: casou com João, não com Joaquim [25:17:01]-[25:19:00].
- "Ter filho, menino ou menina, é lançar a moeda para cima" [25:31:30]
- "O mais improvável já foi feito" [25:32:31]
- "O fato de ele ter tido três meninos não muda nada" [25:06:30]

**4. De onde vem a fórmula**
- P = casos favoráveis ÷ espaço amostral [25:03:01]-[25:03:31].
- Eventos independentes: P(A e B) = P(A) × P(B) [25:09:31]-[25:10:01].
- Cada ramo vale 1/2; cada caminho de 4 lançamentos vale (1/2)⁴ = 1/16 [25:22:31]-[25:23:00].
- Número de caminhos: 2⁴ = 16 [25:20:30]-[25:21:02].

**5. Pegadinhas e dicas de ENEM**
- Erro de intuição: achar que o próximo filho "tem que" ser menina. A chance continua 1/2 [25:06:30] e [25:32:01].
- Conte caminhos com cuidado: o caso de duas caras e duas coroas tem mais de um caminho [25:26:01]-[25:28:31].
- Multiplicar só quando os eventos são independentes [25:09:31].

**6. Questões que ele resolve**
- Iago, quatro filhos homens: 1/16 = 6,25%. Resposta: letra A. Jeito: 1/2 × 1/2 × 1/2 × 1/2 [25:33:01]-[25:33:32].
- Próxima filha ser menina: 50% [25:33:32].
- Quatro moedas com duas caras: o narrador diz 4 caminhos e depois conta 6 [25:26:01]-[25:28:31]. Total 6/16 = 3/8 é conta minha (?).

**7. Quadro**
- [25:15:01] árvore com ramos de 50%.
- [25:26:01] caminhos marcados com duas caras e duas coroas.
- [25:33:01] conta final 1/16 = 6,25%.

## Probabilidade - Aprofundamento

**1. Gancho**
"Essas questões são as mais complexas do Enem", de análise combinatória e probabilidade [25:34:30]. Questão da gincana: Felipe, urna com divisores de 17.640 [25:35:30]-[25:36:01].

**2. Ordem das etapas**
1. Aviso: questão difícil, mas pode cair [25:34:30]-[25:35:01]
2. Revisão de união de conjuntos: n(A∪B) = n(A) + n(B) − n(A∩B) [25:37:02]-[25:45:00]
3. Mesma fórmula em probabilidade [25:45:30]-[25:48:01]
4. Fatoração: 17.640 = 2³ · 3² · 5 · 7² [25:49:02]-[25:54:03]
5. Divisores: cada expoente vai de 0 até o máximo [25:54:31]-[25:58:31]
6. Protocolo: soma 1 a cada expoente e multiplica. Total 72 [26:03:31]-[26:05:31]
7. Pares: expoente do 2 não pode ser 0. Total 54 [26:06:30]-[26:08:31]
8. Não múltiplos de 7: expoente do 7 = 0. Total 24 [26:09:30]-[26:11:04]
9. Pares e não múltiplos de 7: total 18 [26:14:32]-[26:15:32]
10. P = (54 + 24 − 18)/72 = 60/72 = 5/6 [26:16:31]-[26:21:01]

**3. Analogias e frases marcantes**
- "Esse cara acabou sendo contado duas vezes" (interseção) [25:41:36]-[25:42:30]
- "Decorar esse negócio aqui é coisa idiota. Você tem que entender" [26:05:31]
- "Fazer essa conta é simples para caramba, mas acaba omitindo o entendimento" [25:22:01]

**4. De onde vem a fórmula**
- n(A∪B) = n(A) + n(B) − n(A∩B): a interseção entra duas vezes [25:42:30]-[25:43:02].
- Dividindo pelo total, P(A∪B) = P(A) + P(B) − P(A∩B) [25:46:30]-[25:47:31].
- Divisor: 2^x · 3^y · 5^w · 7^z, com cada expoente indo de 0 até o máximo [25:56:01]-[25:58:00].
- Pares: x não pode ser 0 [26:07:03]-[26:07:31]. Não múltiplo de 7: z só pode ser 0 [26:09:30]-[26:10:31].
- Princípio multiplicativo: total = produto das opções [26:03:31].

**5. Pegadinhas e dicas de ENEM**
- Não liste os 72 divisores. Use o protocolo [25:49:30]-[26:06:00].
- Fatore antes. Ele diz que o aluno deve estar calibrado em MDC e MMC [25:53:31].
- Somar pares com não múltiplos de 7 direto dá 78/72, maior que 1. Há 18 casos contados duas vezes [26:15:02]-[26:16:00].

**6. Questões que ele resolve**
- Urna com divisores de 17.640: P(par ou não múltiplo de 7) = 5/6. Jeito: P(par) + P(não múltiplo de 7) − P(par e não múltiplo de 7) = (54 + 24 − 18)/72 [26:19:02]-[26:21:01].
- A legenda diz 17.000.60 e 17.340 em vez de 17.640 (?). O valor que Felipe calcula ficou em branco ("É bicho") [25:36:30].

**7. Quadro**
- [25:39:31] diagrama de A e B com a interseção.
- [25:54:03] fatoração de 17.640.
- [26:04:00] contagem de 72 divisores.
