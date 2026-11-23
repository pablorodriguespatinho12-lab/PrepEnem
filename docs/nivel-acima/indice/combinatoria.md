# Índice de reais: ANÁLISE COMBINATÓRIA E PROBABILIDADE (nível acima, Matemática, 23/11/2026)

Regra de direitos: nenhum enunciado real foi copiado. Cada real está descrita em palavras minhas (até 200 letras) com banca, ano e número.
Letras e passos das reais são **estimativas** minhas, tiradas do texto extraído (colunas embaralhadas, margem de uns 15%). O que está com "?" é leitura minha sem conferir resolução oficial.
ENEM: nº do **caderno 7 azul (CD7)**, que é o do arquivo; conferi cada nº pelo cabeçalho "Questão N" (as duas colunas se misturam) e pelo gabarito GB. Esta pasta não tem ENEM de 2021 e 2022 de Combinatória no JSON do banco (só aritmética, estatística, funções, plana e espacial).
Fuvest 1ª fase: nome do ano = ano do vestibular (2023 = prova de 2022), prova V; 2ª fase = dia 2, M01 a M06. ITA 1ª fase: nome do ano = arquivo (2021 = nov/2020). IME: nº da questão na prova discursiva. HMMT e Oxford MAT: nome do ano = ano da prova.
"Conta minha" = refeita em Python (fração exata ou força bruta).

## 1. As reais (18 de Combinatória e Probabilidade, 6 bancas)
| id | fonte | estilo | letras (≈) | passos (≈) | descrição em palavras minhas (≤ 200 letras) |
|---|---|---|---|---|---|
| enem-2019-cd7-q156 | ENEM 2019 dia 2, CD7 q.156 (gab. C) | ENEM | 270 | 3 | Oito amigos (dois canhotos) formam 4 duplas de vôlei sem pôr os dois canhotos juntos. Pede de quantas maneiras (90, conta minha). |
| enem-2019-cd7-q159 | ENEM 2019 dia 2, CD7 q.159 (gab. D) | ENEM | 480 | 3 | Placa de propaganda é vista com chance 1/2. Quantas placas novas instalar para a chance de ver pelo menos uma passar de 99/100 (6). |
| enem-2019-cd7-q173 | ENEM 2019 dia 2, CD7 q.173 (gab. E) | ENEM | 640 | 4 | 20% das declarações são inconsistentes, 25% destas fraudulentas, e 6,25% das consistentes também. Pede a chance de inconsistente dado que é fraudulenta (0,5). |
| enem-2020-cd7-q163 | ENEM 2020 dia 2, CD7 q.163 (gab. E) | ENEM | 330 | 3 | Anagramas de "I AM POTTER" com vogais e consoantes sempre intercaladas; a alternativa é uma expressão com fatoriais (4!·5!/2). |
| fuvest-2023-f1-q84 | Fuvest 2023 1ª fase, V, q.84 (gab. E) | Fuvest | 230 | 2 | Prova com 2 questões de Matemática (banco de 3) e 6 de Física (banco de 8), sem ordem. Pede quantas provas distintas (84). |
| fuvest-2022-f2-M03 | Fuvest 2022 2ª fase, dia 2, M03 (3 itens) | Fuvest | 610 | 5 | Pontos (m, n) com m e n em {3,...,9}. Itens: produto maior que 60; chance de m/n ser redutível; chance de dois pontos sorteados estarem a distância √13. |
| fuvest-2023-f2-M03 | Fuvest 2023 2ª fase, dia 2, M03 (3 itens) | Fuvest | 380 | 5 | Funções de A = {1..4} em A; funções de B = {1..6} em B com f(f(n)) = n; chance de uma bijeção de B ter ponto fixo. |
| fuvest-2025-f2-M02 | Fuvest 2025 2ª fase, dia 2, M02 (3 itens) | Fuvest | 1200 | 4 | Tabela 2 × 2 (expostos x doentes, 24 000 pessoas). Pede P(doença), P(exposto | doença) e o risco relativo, razão de duas condicionais. |
| ita-2021-q53 | ITA 2021 1ª fase, Mat q.53 (gab. B) | ITA | 230 | 4 | 48 balas em 4 tigelas A, B, C, D, cada uma com pelo menos 3 e B com a mesma quantidade de D. Pede de quantas maneiras (361). |
| ita-2023-q45 | ITA 2023 1ª fase, Mat q.45 (gab. B) | ITA | 280 | 4 | Moedas lançadas várias vezes, saem as que dão coroa; o jogo acaba quando não resta nenhuma. Pede a chance de durar mais de 3 rodadas com 4 moedas (1695/4096). |
| ita-2024-q41 | ITA 2024 1ª fase, Mat q.41 (gab. D) | ITA | 300 | 5 | Para cada ordem dos números 1 a 5 como coeficientes de um polinômio de grau 4, soma-se a soma das raízes de todos os polinômios (−351/2, conta minha). |
| ime-2022-q8 | IME 2022 discursiva, Mat q.8 | IME | 260 | 5 | 11 estudantes divididos ao acaso em três grupos de 3 e um de 2; um casal está na turma. Pede a chance de ficarem juntos (2/11, conta minha). |
| ime-2025-q7 | IME 2025 discursiva, Mat q.7 | IME | 380 | 3 | Computador infectado com 90%; antivírus acusa 95% dos infectados e dá falso alarme em 1%. Respondeu "não infectado": pede a chance de estar infectado (5/16, conta minha). |
| ime-2026-q6 | IME 2026 discursiva, Mat q.6 | IME | 210 | 7 | Bijeção f de {1..9} sorteada entre as que, compostas 9 vezes, dão a identidade. Pede a chance de f(1) = 1 (137/5121, força bruta: 1 233 em 46 089). |
| hmmt-2021-feb-comb-q2 | HMMT fev. 2021, Combinatorics, q.2 (resp. 116) | Harvard-MIT | 400 | 2 | Torneio eliminatório de 32 jogadores, pares sorteados a cada rodada. Pede a chance de dois jogadores dados se enfrentarem em algum momento (1/16). |
| hmmt-2021-feb-comb-q4 | HMMT fev. 2021, Combinatorics, q.4 (resp. 288) | Harvard-MIT | 160 | 4 | Funções de {1..9} em si com f(f(f(s))) = s e f(s) − s nunca múltiplo de 3. Pede quantas. |
| hmmt-2023-feb-comb-q1 | HMMT fev. 2023, Combinatorics, q.1 (resp. 99/101) | Harvard-MIT | 400 | 3 | 800 bolinhas de 100 cores (8 de cada); retira até ter 8 da mesma cor. Sabendo que não parou nas 699 primeiras, a chance de parar na 700ª (99/101). |
| oxford-mat-2019-q5 | Oxford MAT 2019, Q5 (5 itens) | Harvard-MIT | 1500 | 7 | Conta partições de n elementos em k blocos de tamanho 2 ou mais. Mostrar f(n,k) = 0 se k > n/2, achar uma recorrência por "juntar o novo elemento" e calcular f(7,3). |

## 2. Onde mora a dificuldade
| id | ideia escondida | pegadinha (tipo da gramática) | tabela ou figura | junta com |
|---|---|---|---|---|
| enem-2019-cd7-q156 | Total de pareamentos de 8 = 105; os que juntam os dois canhotos são 15 (o resto em 3 duplas): 105 − 15 = 90 | 3 contagem dupla (duplas não têm ordem) | não | combinação + complementar |
| enem-2019-cd7-q159 | Complementar: 1 − (1/2)ⁿ > 0,99 pede n = 7 placas no total, e já existe 1 | 1 condição (pedem as NOVAS) + 7 enunciado | não | probabilidade + potências |
| enem-2019-cd7-q173 | Bayes por contagem em 100: fraudulentas = 5 + 5; inconsistentes entre elas = 5 de 10 | 2 responder o que não foi pedido (condicional ao contrário: P(fraude \| inconsistente) = 25%) | não (dados em porcentagem) | porcentagem + condicional |
| enem-2020-cd7-q163 | 5 consoantes e 4 vogais só alternam começando e terminando em consoante; o T repetido divide por 2 | 3 contagem (letra repetida, só um padrão) | não | permutação com repetição |
| fuvest-2023-f1-q84 | Escolhas independentes: C(3,2)·C(8,6) = 3·28 | 3 contagem (ordem não conta) | não | combinação + princípio multiplicativo |
| fuvest-2022-f2-M03 | √13 só vem de diferenças (2,3) ou (3,2) com sinais; contar pares não ordenados: 80 de 1 176 = 10/147 (conta minha) | 3 contagem (ordenados x não ordenados, sinais ±) | não | geometria analítica + contagem |
| fuvest-2023-f2-M03 | f(f(n)) = n só tem ciclos de tamanho 1 e 2: 76; sem ponto fixo é desarranjo (265 de 720): 91/144 (conta minha) | 1 condição ("não necessariamente sobrejetoras") + 3 contagem | não | funções + complementar |
| fuvest-2025-f2-M02 | Ler três condicionais da tabela: 600/24 000, 500/600 e (500/800) ÷ (100/23 200) = 145 (guia de respostas da banca confere) | 4 intuição (trocar os denominadores das condicionais) | tabela 2 × 2 | condicional + razão |
| ita-2021-q53 | Reservar 3 por tigela (sobram 36); com b = d, a + c = 36 − 2b tem 37 − 2b soluções; soma dos ímpares = 19² = 361 | 3 contagem (b = d reduz uma variável e a soma vira quadrado) | não | estrelas e barras + soma de PA |
| ita-2023-q45 | Cada moeda é independente: sobrevive 3 rodadas com 1/8; o jogo acaba cedo com (7/8)⁴; resposta = 1 − (7/8)⁴ | 4 intuição (modelar por rodadas, não por moeda) | não | probabilidade + complementar |
| ita-2024-q41 | Girard: soma das raízes = −a₃/a₄; somar sobre as 120 permutações (simetria): −6·Σ i/j | 3 contagem (cada par (a₃, a₄) aparece 3! vezes) | não | polinômios + permutações |
| ime-2022-q8 | Grupos não rotulados: dividir por 3! só nos três grupos iguais; casal na dupla (280) ou num trio (2 520) em 15 400 | 3 contagem (dividir por 3! e não por 2!) | não | multinomial + casos |
| ime-2025-q7 | Bayes com resposta negativa: 0,9·0,05 contra 0,1·0,99, 0,045 ÷ 0,144 | 2 e 4 (a resposta "não infectado" não zera o risco) | não | condicional + Bayes |
| ime-2026-q6 | f⁹ = id só aceita ciclos de tamanho 1, 3 ou 9 (divisores de 9); contar permutações por tipo de ciclo e achar as com 1 fixo | 1 condição escondida (f⁹ = id, e não f = id) | não | ciclos + contagem |
| hmmt-2021-feb-comb-q2 | Cada partida elimina 1 jogador: 31 partidas distintas entre C(32,2) = 496 pares igualmente prováveis: 31/496 = 1/16 | 4 intuição (somar as chances por rodada) | não | invariante (nº de partidas) |
| hmmt-2021-feb-comb-q4 | Ciclos de 3 com um de cada resto mod 3: 6·3·4·2·2·1 = 288 | 3 contagem (um 1, um 4 e um 7 em ciclos diferentes) | não | ciclos + aritmética modular |
| hmmt-2023-feb-comb-q1 | Se não parou em 699, as 101 restantes são 2 de uma cor e 1 de cada outra; só falha se a próxima for das 2 repetidas | 4 intuição (esperar que a chance dependa dos 699 já retirados) | não | condicional + simetria |
| oxford-mat-2019-q5 | Juntar o elemento novo a um bloco existente ou formar um par com 1 dos n − 1 anteriores dá a recorrência de f(n+1, k) | 3 contagem (casos exaustivos e sem dupla contagem) | não | partição + recorrência |

## 3. Como a banca cobra aqui
**ENEM**
- Contexto de dia a dia (torneio, placas, declarações, anagrama), 270 a 640 letras; tabela só nas de porcentagem.
- Ideia escondida curta: complementar ("pelo menos uma"), contar pares sem ordem, condicional ao contrário.
- Três a quatro passos; cada alternativa errada nasce de um erro dos 7 tipos.

**ITA (1ª fase)**
- Texto seco de 230 a 300 letras; uma variável auxiliar ou uma simetria destrava (b = d, moeda por moeda, soma por permutação).
- A resposta é um número exato, às vezes uma fração com potência de 2 (1695/4096).

**IME**
- Discursiva: casos separados (casal na dupla ou no trio), Bayes e ciclos de permutação.
- A questão de 2026 junta Funções, ciclos e probabilidade: o aluno precisa transformar f⁹ = id em "ciclos de 1, 3 ou 9".

**Fuvest**
- 1ª fase: uma conta direta (84). 2ª fase: 3 itens crescentes, o último é a probabilidade, com complemento (91/144) ou tabela 2 × 2 e razão de condicionais.
- Pede a justificativa; a banca publicou a resposta esperada (145 no risco relativo).

**Harvard-MIT e Oxford**
- HMMT Combinatorics: 2 a 5 linhas, resposta inteira ou fração, truque único (cada partida elimina um; ciclo mod 3).
- Oxford MAT: itens encadeados que levam a uma recorrência provada pelo aluno.
- Estilo d da escada é **por técnica** (invariante, contar por outro lado), não por tema.

## 4. As nossas 4 contra a real mais próxima
Todas as 4 têm âncora de uma linha. Conferi cada uma lendo a real citada.
| id nosso | estilo marcado | letras / passos nossos | real mais próxima | mesma técnica? | dificuldade vs a real | estilo certo? | veredito |
|---|---|---|---|---|---|---|---|
| d2-escada-mat-ita-com-00a (ficha no ladrilho, tabela de pontos, condicional) | a = ENEM | 888 / 5 reais | enem-2019-cd7-q173 e ime-2024-q8 (do repositório: ponto sobre o arco, área do triângulo maior que um valor) | em parte: condicional com porcentagens (ENEM) e probabilidade geométrica (IME); nenhuma real une as duas | igual ou maior: tem a geometria (faixa de 3 cm), a condição "pelo menos um" e dado que sobra (R$) | sim (888 letras, tabela, dado que sobra) | **MANTER** |
| d2-escada-mat-ita-com-00b (painel de 6 lâmpadas sem duas acesas vizinhas) | b = ITA | 373 / 4 reais | ita-2021-q53 e hmmt-2022-feb-comb-q2 (22 jeitos de 3 casas sem vizinhas) | pouco: a ideia "sem vizinhos" existe na HMMT, mas com n = 6 dá para listar na mão (21 painéis, 4 com 3 acesas) | menor: a ITA 2021 q.53 pede variável auxiliar e soma de 19 termos | texto de ITA, mas sem ideia escondida que o número pequeno não resolva | **REESCREVER** |
| d2-escada-mat-ita-com-00c (exame duas vezes, doentes por idade) | c = Fuvest | 561 / 4 reais | enem-2019-cd7-q173, ime-2025-q7 e fuvest-2025-f2-M02 | sim: Bayes por contagem; a nossa acrescenta 2 faixas de idade e o 2º exame independente | igual ou maior: 486 ÷ 580 pede dois níveis (população e exames) | sim (561 letras, tabela, 1 pergunta precisa) | **MANTER** |
| d2-escada-mat-ita-com-00d (6 times, pontos e empates, 2 jogos sorteados) | d = Harvard | 459 / 4 reais | hmmt-2021-feb-comb-q2 e ime-2026-q6 | sim em espírito: invariante de contagem (cada empate tira 1 ponto do total de 45); a real conta partidas por eliminação | igual à HMMT q.2 (1 ideia + 1 conta); menor que a IME 2026 | sim: a ideia é uma invariante, não tem fórmula de livro | **MANTER** |

Conferi também que as 4 respostas fecham: com-00a 48/84 = 4/7; com-00b 4 de 21; com-00c 486/580 ≈ 84%; com-00d 1 − 78/105 = 9/35. E que a tabela de pontos da com-00d existe: busca exaustiva achou 11 resultados dos 15 jogos com esses pontos e 2 empates.

Motivo (2 linhas por veredito):
- **com-00a MANTER:** é a única que une probabilidade geométrica e condicional com tabela, 5 passos, 888 letras e figura (`ladrilho-ficha`). A âncora IME 2024 q.8 é só parcial (arco, sem condicional).
- **com-00b REESCREVER:** com 6 lâmpadas o aluno lista 21 painéis sem a ideia dos vãos; a âncora ITA 2025 q.5 é de PA/PG e a Unesp 2025 q.85 é casa dos pombos. Subir para 12 lâmpadas e 5 acesas faz a ideia valer.
- **com-00c MANTER:** a técnica é a mesma da ENEM 2019 q.173 e da IME 2025 q.7, com um nível a mais (2 exames, 2 faixas). A âncora citada (Unicamp q.61, ENEM 2021 q.177) é de outra técnica.
- **com-00d MANTER:** a invariante dos pontos (45 − 43 = 2 empates) esconde a ideia como a HMMT q.2 e a conta final é curta. Se o chefe quiser subir, perguntar a chance de os dois jogos sorteados envolverem o mesmo time.

## 5. Propostas (não são o enunciado final; números conferidos em Python)

### com-00b (b, ITA) REESCREVER: painel longo, contar pelos vãos
- **Âncora por técnica:** ITA 2021 q.53 (variável auxiliar e contagem por casos) e HMMT fev. 2022 Combinatorics q.2 (casas sem vizinhas). Oxford MAT 2019 q.5 para a recorrência.
- **Ideia escondida:** painéis sem duas acesas vizinhas de n lâmpadas são F(n + 2) (cada painel termina em apagada ou em "apagada, acesa"); com exatamente k acesas, são C(n − k + 1, k) (encaixar as acesas nos vãos entre as apagadas).
- **Junta (degraus 1 a 7):** Funções (recorrência como função de n), Aritmética (frações), Estatística (condicional), Equações (coeficiente binomial).
- **Pegadinha:** 1 condição escondida (a chance 1/2 faz todos os painéis serem igualmente prováveis, então o 2¹² some) + 3 contagem (C(12,5) ignora a proibição).
- **Números:** 12 lâmpadas, cada uma acesa com chance 1/2; a máquina só aprova painéis sem duas acesas vizinhas; entre os aprovados, a chance de exatamente 5 acesas. Aprovados 377; com 5 acesas C(8,5) = 56; resposta **56/377** (força bruta confere: 377 e 56). Distratores: 7/512 (ignorou a condição: 56/4096), 99/512 (C(12,5)/4096, ignorou a proibição), 56/233 (usou 11 lâmpadas no total), 21/233, 56/144.
- **Forma:** ITA, texto seco de 320 letras, resposta fração. **`painel-lampadas` serve** com ajuste: o desenho atual é fixo em 6 lâmpadas (acesa, apagada, acesa, apagada, apagada, acesa); a nova versão pede 12 e o passo dos vãos.

## 6. Defeitos achados nas âncoras nossas (para o chefe decidir)
- `com-00b` (**errada**): "ITA 2025 q.5" é afirmações sobre PA e PG de somas parciais (S_n = b_{n+1} − b_1) e "Unesp 2025 q.85" é casa dos pombos (mínimo de cartões para 10 iguais). Nenhuma conta sequência por recorrência com proibição de vizinhos.
- `com-00c` (**errada**): "Unicamp 2024 q.61" é duas pedrinhas sem reposição e "ENEM 2021 q.177" é a chance de errar todos os dardos (complementar). Nenhuma é Bayes. As reais certas são ENEM 2019 CD7 q.173, IME 2025 q.7 e Fuvest 2025 2ª fase M02.
- `com-00d` (fraca): "Unicamp 2024 q.60" é combinação com uma regra proibida (45 − 9); a técnica da nossa é invariante de pontos. A âncora certa é HMMT fev. 2021 Combinatorics q.2.
- `com-00a` (parcial): "IME 2024 q.8" é probabilidade geométrica no arco; a nossa é por área e condicional. A parte condicional está na ENEM 2019 CD7 q.173.
- ENEM 2020 CD7 q.157 (amigo secreto, casal) está **anulada** no gabarito oficial (marcada `*`): não serve de âncora; usei a q.163 (anagramas).
- Cobertura do ENEM: só varri 2019 e 2020 (CD7) para Combinatória. 2021 tem fonte cifrada e 2022 e 2023 não foram varridas para este conteúdo (vi só títulos, como o triângulo mágico de 2023 e o dígito verificador de 2022); ficam de fora até alguém conferir.
