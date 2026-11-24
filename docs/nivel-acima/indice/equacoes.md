# Índice de reais: EQUAÇÕES E SISTEMAS (nível acima, Matemática, 23/11/2026)

Regra de direitos: nenhum enunciado real foi copiado. Cada real está descrita em palavras minhas (até 200 letras) com banca, ano e número.
Letras e passos das reais são **estimativas** minhas, tiradas do texto extraído (colunas embaralhadas, margem de uns 15%). O que está com "?" é leitura minha sem conferir resolução oficial.
Numeração: ENEM = caderno 7 azul (CD7), que é a do arquivo; nossas âncoras de ENEM usam a numeração do CD5 (ex.: 2022 q.176 no CD5 = q.158 no CD7). ITA 1ª fase = número dentro de Matemática (2021: número geral da prova); a prova "ITA 2026" é a de outubro de 2025.
IME 2021 e 2022: arquivos de correção comentada (Estratégia Militares), q.N na ordem do arquivo. HMMT e Oxford MAT: gabarito e soluções oficiais lidos.
Conteúdo = equação do 1º e 2º grau, sistemas, desigualdades, problemas que viram equação, módulo, equações com parâmetro (inclui exponencial e polinômio quando o truque é "resolver uma equação").
Não usei (texto ilegível ou ambíguo): ITA 2023 2ª fase q.3 (inequação log, expressão embaralhada), ITA 2021 q.47 (expoentes ambíguos), ENEM 2021 CD7 (texto do caderno 7 sai embaralhado; ver seção 6).
Conta de gabarito: onde diz "conta minha", refiz em Python (script no rascunho, não vai ao repositório).

## 1. As reais (12 de Equações e Sistemas, 6 bancas)
| id | fonte | estilo | letras (≈) | passos (≈) | descrição em palavras minhas (≤ 200 letras) |
|---|---|---|---|---|---|
| enem-2023-q158 | ENEM 2023 dia 2, q.158, CD7 (gab. D) | ENEM | 750 | 5 | Pescador com custo fixo e meta de lucro pode contratar até 5 ajudantes; cada ajudante muda a pesca, recebe valor fixo e todos dividem 4% da receita. Pede o menor número de ajudantes que dá a meta. |
| fuvest-2025-f2-M01 | Fuvest 2025 2ª fase, dia 2, M01 (3 itens) | Fuvest | 900 | 6 | Papelaria com três combos de caderno, caixa de lápis e canetas e o preço de cada. Monta o sistema, acha a soma lápis+canetas com dois combos e decide quais combos repetem o preço do caderno. |
| fuvest-2021-f2-M03 | Fuvest 2021 2ª fase, dia 2, M03 (3 itens) | Fuvest | 330 | 4 | Sistema 2×2 em que uma das equações tem parâmetros p e q. Pede os valores para ter infinitas soluções, ter solução com x = 0 e não ter solução. |
| ita-2025-q6 | ITA 2025 1ª fase, Mat. q.6 (gab. B) | ITA | 140 | 4 | Equação com 9^x e 3^x e um parâmetro a. Pede o conjunto dos a para os quais há duas soluções reais distintas. |
| ita-2025-q7 | ITA 2025 1ª fase, Mat. q.7 (gab. A) | ITA | 320 | 4 | Dois sistemas 3×3 que devem ter o mesmo conjunto solução, o segundo com parâmetros m, n, k. Pede k. |
| ita-2024-2f-q5 | ITA 2024 2ª fase, Mat. q.5 | ITA | 140 | 4 | Polinômio do 4º grau dado, com a informação de que p(1+x) = p(1−x) para todo x. Pede todas as raízes. |
| ime-2026-q4 | IME 2026 discursiva de Matemática, q.4 | IME | 230 | 5 | Produto de seis somas, cada uma de uma raiz de uma cúbica com uma raiz de uma quadrática. Pede o valor sem achar as raízes. |
| ime-2022-q1 | IME 2022 2ª fase, Mat. q.1 | IME | 750 | 7 | Seis irmãos e relações entre as idades de hoje e as de quando um deles tiver o triplo da idade de outro. Pede a soma de duas idades atuais. |
| hmmt-2024-feb-algnt-1 | HMMT fev. 2024, Álgebra e Teoria dos Números, q.1 | Harvard-MIT (d) | 200 | 3 | Duas quadráticas cujos coeficientes aparecem como raízes uma da outra; uma delas tem a raiz 5. Pede o termo constante s. |
| hmmt-2022-feb-algnt-1 | HMMT fev. 2022, Álgebra e Teoria dos Números, q.1 | Harvard-MIT (d) | 250 | 4 | Equação do 2º grau cujos coeficientes são potências do mesmo inteiro k e que tem uma única raiz real, menor que 100. Pede o maior valor possível dessa raiz. |
| oxford-mat-2023-Q1G | Oxford MAT out. 2023, Q1 parte G (múltipla escolha) | Oxford (d) | 330 | 3 | Duas quadráticas com os mesmos a, b, c em ordem trocada têm raiz dupla. Pede quantas raízes reais tem a terceira troca. |
| oxford-mat-2023-Q2 | Oxford MAT out. 2023, Q2 (15 pontos, 5 itens) | Oxford (d) | 600 | 6 | Define p_n(x) = x^n + x^(−n); liga p_2 e p_3 a p_1 e usa isso para resolver uma equação de grau 4 e uma de grau 7 de coeficientes simétricos. |

## 2. Onde mora a dificuldade
| id | ideia escondida | pegadinha (tipo da gramática) | tabela ou figura | junta com |
|---|---|---|---|---|
| enem-2023-q158 | Os 4% da receita saem do dono e não dependem de n; a pesca por n é uma lista irregular (300, 400, 500...), então testa-se n inteiro: n = 3 dá lucro 750 (falta), n = 4 dá 980 (conta minha, confere o gabarito D) | 1 condição escondida (4% é da receita, repartido) e 2 pede n, não o lucro | não | porcentagem + lista de produção + inequação em inteiros |
| fuvest-2025-f2-M01 | Há 3 equações, mas só dois combos fecham o sistema: com II e III sai lápis+canetas = 32 e caderno = 26 (conta minha). Com os três combos o sistema não fecha, e a pergunta é qual par repete o caderno | 4 intuição que engana ("3 equações, 3 incógnitas, solução única") e 1 condição (caderno maior que a soma) | tabela dos combos | sistema 3×3 + lógica de casos (conta minha: o par certo é I e III) |
| fuvest-2021-f2-M03 | Dependência linear: a razão dos coeficientes decide. Indeterminado: (p, q) proporcional a (2, 3) com 2/5; x = 0 dá y = 5/3 e q = 6/5; impossível: mesma razão e termo diferente | 3 indeterminado x impossível (confundir os dois) | não | equações + parâmetros |
| ita-2025-q6 | Trocar 3^x por t: a equação em t fatora com raízes 2a−1 e a+5 (soma e produto); cada t positivo dá um x | 1 condição escondida (t > 0) e 5 caso degenerado (a = 6 faz as duas raízes iguais) | não | exponencial + 2º grau + parâmetro |
| ita-2025-q7 | O sistema I tem infinitas soluções (uma reta); II só é equivalente se a reta inteira satisfaz suas equações, para todo z | 2 responder o que não foi pedido (m e n só ajudam a fechar a conta) | não | sistema linear + reta de soluções |
| ita-2024-2f-q5 | Se p(1+x) = p(1−x), p só depende de (x−1)²: com w = (x−1)² vira w² + 3w − 18 = 0, w = 3 ou −6; raízes 1±√3 e 1±i√6 (conta minha) | 3 contagem faltando (as duas raízes complexas) | não | polinômio + simetria + complexos (fora da escada) |
| ime-2026-q4 | Para cada x_j, o produto sobre as y_i é uma expressão da cúbica em −x_j; reduz x³ com x² = 7x+3 (vira 48x+23) e fecha com Vieta em x: 1345 (conta minha, numérica, sem resolução oficial) | 2 e 3 sinal (−1)³ perdido; "não resolva cada raiz" | não | Girard + resto de divisão de polinômios |
| ime-2022-q1 | Todos os eventos acontecem no mesmo tempo t = 3M − S depois; com isso só 2 das 6 incógnitas precisam ser achadas: S = 23 e M = 17, soma 40 (resolução comentada) | 2 pede a soma de duas idades atuais | não | sistema de 1º grau com muitas incógnitas |
| hmmt-2024-feb-algnt-1 | s é raiz de x² + rx + s, então s·t = s e t = 1; r sai da segunda equação (r = −30) e s = 29 | 5 caso esquecido: se s = t, o outro zero é 1 e dá s = −6; a banca aceitou 29 e −6 | não | Vieta + casos |
| hmmt-2022-feb-algnt-1 | Uma única raiz real: discriminante zero, b² = 4ac; com potências de k isso obriga k par e a raiz é potência de 2: maior valor 64 | 7 enunciado (r < 100) e 1 condição escondida (discriminante nulo) | não | 2º grau + potências + teoria dos números |
| oxford-mat-2023-Q1G | b² = 4ac e c² = 4ab, multiplicando dá a = bc/16; o discriminante da terceira vale −63a², negativo: 0 raízes (alternativa a) | 4 intuição ("repetida" não quer dizer igual) e alternativa "depende de a" | não | discriminante + simetria dos coeficientes |
| oxford-mat-2023-Q2 | Dividir por x² (ou x³) e usar y = x + 1/x: p_2 = p_1² − 2 e p_3 = p_1³ − 3p_1; o grau cai pela metade (resolve em y e volta em x) | 1 condição (x diferente de 0) e raiz trivial x = 1 no grau 7 | esboço do gráfico de p_1 (item i) | equação por substituição + gráfico de x + 1/x |

## 3. Como a banca cobra aqui
**ENEM**
- Contexto de trabalho ou dinheiro (pesca, lucro, contratação), 700 a 900 letras, pergunta de "menor número inteiro". 5 passos ou mais.
- Dado que sobra e uma regra escondida (4% da receita repartido, não por ajudante); a conta é de 1º grau, a dificuldade é montar e testar.
- Cada alternativa errada vem de um erro de montagem (esquecer a taxa, contar por ajudante).

**ITA**
- 1ª fase: texto seco de 140 a 320 letras, parâmetro real, resposta como conjunto ou número. A ideia é uma substituição (t = 3^x) ou uma equivalência de sistemas; 3 ou 4 passos.
- 2ª fase: "encontre todas as raízes" com uma simetria dada (p(1+x) = p(1−x)); cobra raízes complexas também.

**IME**
- Identidades simétricas (Girard, resto de divisão) e problemas de idades longos; 5 a 7 passos, resposta numérica limpa (40, 1345).
- A dificuldade é montar sem se afogar em incógnitas (6 idades) ou não resolver cada raiz.

**Fuvest**
- 2ª fase em 3 itens: a) escrever o sistema, b) ler uma consequência (soma lápis+canetas), c) discutir caso (indeterminado, impossível, qual par de combos).
- Tabela ou dados em lista; pergunta precisa; uma condição escondida.

**Harvard-MIT e Oxford**
- HMMT: texto curto de 200 a 250 letras, o caso esquecido é a pegadinha ("e se s = t?"), a banca aceita as duas respostas.
- Oxford MAT: múltipla escolha de contagem de soluções (módulo aninhado dá 7 soluções, 2023 Q1 D; quadráticas com raiz dupla) e longa que ensina uma substituição (x + 1/x) em itens.
- A ideia é criativa e a conta é curta.

## 4. As nossas 4 contra a real mais próxima
Todas as 4 têm enunciado só de texto, com "Dados:" em linhas: nenhuma tem tabela ou figura própria no enunciado (regra 4 segue aberta). Gabaritos das 4 conferidos por conta minha: 00a = R$ 5 000 (B), 00b = 15 (C), 00c = 93 (C), 00d = 8 (B).
| id nosso | estilo marcado | letras / passos nossos | real mais próxima | mesma técnica? | dificuldade vs a real | estilo certo? | veredito |
|---|---|---|---|---|---|---|---|
| d2-escada-mat-ita-equ-00a (rendimento A e B, taxa de 10% no fundo, R$ 12 000) | a = ENEM | 836 / 5 | enem-2023-q158 (e a âncora ENEM 2022 q.140, que é de porcentagem) | parcial: ENEM tem lucro com % da receita, lista de produção e mínimo inteiro; a nossa é um sistema 2×2 de rendimentos | menor: 2 equações lineares, sem teste de inteiro, o dado que sobra (tarifa de R$ 15) é uma frase solta e não pesa | sim em tamanho (836, ENEM a pede 600+) | **REESCREVER** |
| d2-escada-mat-ita-equ-00b (cofrinho de moedas, "o dobro") | b = ITA | 404 / 4 | ita-2025-q7 e ita-2025-q6 | não: as reais escondem a ideia (reta de soluções que cobre outro sistema; substituição t = 3^x); a nossa é "dê letras" de problema do 8º ano | bem menor: sem parâmetro, sem caso degenerado, 2 equações e substituição direta | só no tamanho; falta a técnica de ITA | **TROCAR** |
| d2-escada-mat-ita-equ-00c (planos de celular, menor t estritamente) | c = Fuvest | 553 / 5 | fuvest-2023-f2-M01 (item b) e ENEM 2021 q.141 CD7 (= q.176 CD5, gab. A nos dois) | sim: duas tarifas por partes, compara onde cruzam | igual ao item b da real; menor que o item c (dois casos); a pegadinha "estritamente" (93, não 92) é boa | sim (Fuvest: uma condição escondida) | **MANTER** |
| d2-escada-mat-ita-equ-00d (balança, três pesagens de dois a dois) | d = Harvard-MIT | 365 / 3 | hmmt-2024-feb-algnt-1 e a Unicamp 2024 q.56 (soma das equações) do repositório | não: a âncora marcada (IME 2024 q.4) é de Girard; a nossa é soma de pares | menor que HMMT: soma as 3 equações e acabou, sem caso a descartar; igual à Unicamp 2024 q.56, que já é fácil | não: Harvard pede ideia criativa e pegadinha de caso; isto é puzzle de soma | **TROCAR** |

Motivo (2 linhas por veredito):
- **equ-00a REESCREVER:** o tamanho de ENEM está certo, mas a conta é um sistema 2×2 comum. A real de pescador tem % da receita, lista de produção e menor inteiro, com o mesmo texto longo.
- **equ-00b TROCAR:** a âncora marcada (ITA 2025 q.7) é de equivalência de sistemas, e a nossa é um problema de moedas. Trocar por uma técnica de ITA de verdade (sistemas equivalentes, com a mesma ideia da real).
- **equ-00c MANTER:** mesma técnica da Fuvest 2023 (tarifas por partes), 5 passos e a pegadinha do empate bem posta. Só falta a tabela dos planos no enunciado (regra 4), que é ajuste de forma e não de conteúdo.
- **equ-00d TROCAR:** soma das três pesagens, divide por 2, e acabou; não há caso escondido. A âncora é errada. Trocar pela técnica do HMMT 2024 (caso esquecido), com resposta que junta dois casos.

## 5. Propostas (não são o enunciado final; números conferidos por conta em Python)

### equ-00a (a, ENEM) REESCREVER: torrefação com quebra e margem sobre a venda
- **Âncora por técnica:** ENEM 2023 q.158 CD7 (lucro com percentagem da receita e número que se acha testando; texto longo).
- **Ideia escondida:** o café perde massa na torra (quebra diferente em cada tipo) e a margem de 20% é sobre a venda, não sobre o custo; a massa vendida depende da mistura, então a equação tem x dos dois lados.
- **Junta de degraus anteriores:** Aritmética (porcentagem), Grandezas (g e kg: pacotes de 250 g), Estatística (média ponderada do custo da mistura), Equações (1º grau).
- **Pegadinha:** 7 unidade (pacote de 250 g, 4 por kg) + 1 margem sobre a venda ≠ sobre o custo.
- **Números:** 100 kg de grão cru. Tipo A: R$ 36 por kg, perde 20% na torra. Tipo B: R$ 24 por kg, perde 25%. Pacote de 250 g vendido a R$ 12,50; lucro de 20% da receita. Pede kg do tipo A. Conta: custo = 2 400 + 12x; pacotes = 300 + 0,2x; receita = 3 750 + 2,5x; 2 400 + 12x = 0,8 · (3 750 + 2,5x), logo **x = 60 kg** (custo 3 120, 78 kg torrados, 312 pacotes, receita 3 900, lucro 780 = 20%). Distratores: 40 (kg de B), 67 (aprox., quebra de 20% nos dois: 66,7), 73 (aprox., margem de 20% sobre o custo: 73,1), 78 (a massa torrada, responder o que não foi pedido).
- **Forma:** texto de 600+ letras com tabela dos dois tipos (preço por kg, quebra) e um dado que sobra (frete da compra, R$ 150); sem desenho.

### equ-00b (b, ITA) TROCAR: dois sistemas com o mesmo conjunto solução
- **Âncora por técnica:** ITA 2025 q.7 (sistemas equivalentes; o primeiro é indeterminado).
- **Ideia escondida:** o sistema I tem uma reta de soluções (a 3ª equação é a soma das duas primeiras); o II só é equivalente se a reta inteira satisfaz suas equações para todo valor do parâmetro livre, e isso fixa m, n e k.
- **Junta:** Aritmética (frações) + Funções (reta de soluções como função de um parâmetro).
- **Pegadinha:** 2 responder o que não foi pedido (m e n são auxiliares) + 5 caso degenerado (sem ver que I é indeterminado, tenta Cramer e trava).
- **Números:** I: x + 2y + z = 4; 2x + 3y − z = 1; 3x + 5y = 5. Soluções (x, y, z) = ((5 − 5t)/3, t, (7 − t)/3). II: x + 2y + z = 4; x + my + nz = 11; kx + y − z = m − n. Conta: m = 3, n = 4 e **k = 4/5** (confere para t = 0, 1, −2, 7). Distratores: 5/4 (razão invertida), 28/5 (usar m + n = 7 no lado direito), 1, 3.
- **Forma:** texto seco de ITA (uns 300 letras), sem figura; o gráfico fica para a explicação (reta no espaço).

### equ-00d (d, Harvard-MIT) TROCAR: coeficientes que também são raízes, com o caso s = t
- **Âncora por técnica:** HMMT fev. 2024, Álgebra e Teoria dos Números, q.1 (caso esquecido).
- **Ideia escondida:** da primeira equação sai s·t = s e t = 1, mas e se s = t? Cada caso dá um valor, e a banca real aceitou os dois.
- **Junta:** Equações do 2º grau (Vieta) + Aritmética (sinais e casos) + Funções (zeros de quadrática).
- **Pegadinha:** 5 caso degenerado (s = t) + 2 pede a soma dos valores possíveis, não um valor.
- **Números:** r, s, t reais não nulos; x² + rx + s tem s e t como raízes; x² + tx + r tem raiz 3. Caso t = 1 (s ≠ t): r = −12, s = 11. Caso s = t: r = −s − 1 e x² + sx − (s + 1) = (x + s + 1)(x − 1) tem raiz 3, então **s = −4** (r = 3, raízes −4 e 1). Busca em Python sobre inteiros de −60 a 60 achou só (r, s, t) = (−12, 11, 1) e (3, −4, −4). Pede a soma dos valores de s: **7**. Distratores: 11 (esquece o caso s = t), −4, 15 (11 + 4 com o sinal trocado), 22.
- **Forma:** texto curto e seco (uns 250 letras), sem figura; Harvard pede resposta pequena e limpa.

## 6. Defeitos achados nas âncoras nossas (para o chefe decidir)
- `equ-00a`: âncora "ENEM 2022 q.140 (649 letras)" (numeração CD5; é a q.165 do CD7, geladeira com desconto de 2%) é de **porcentagem composta**, não de sistema. Âncora fraca; a mais próxima é ENEM 2023 q.158 CD7.
- `equ-00b`: âncora "ITA 2025 q.7" é de **equivalência de sistemas com parâmetros**, e a nossa é "o dobro" entre incógnitas: mesma família, técnica diferente (é o motivo do TROCAR).
- `equ-00c`: âncora "ENEM 2021 q.176" (CD5; q.141 no CD7, gab. A nos dois) pede só **montar a fórmula** do preço (diárias, limpeza, taxa); a técnica de comparar duas tarifas por partes está na Fuvest 2023 2ª fase M01. Âncora OK em contexto, melhor com a Fuvest ao lado.
- `equ-00d`: âncora "IME 2024 q.4" é **ERRADA**. No repositório, a q.4 pede a⁴ + b⁴ pelas relações de Girard; nada de pesagens. A mais próxima é Unicamp 2024 q.56 (somar as equações faz as variáveis sumirem) e a q.5 do IME 2024 (cada soma de par = total menos o que falta).
- ENEM 2022 q.157 (CD7, salário com comissão por faixa) foi **anulada** pelo INEP (gabarito "Anulado" no arquivo): não usar como âncora de gabarito.
