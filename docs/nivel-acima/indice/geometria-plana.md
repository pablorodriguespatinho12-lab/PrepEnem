# Índice de reais: GEOMETRIA PLANA (nível acima, Matemática, 23/11/2026)

Regra de direitos: nenhum enunciado real foi copiado. Cada real está descrita em palavras minhas (até 200 letras) com banca, ano e número.
Letras e passos das reais são **estimativas** minhas, tiradas do texto extraído (colunas embaralhadas, margem de uns 15%). O que está com "?" é leitura minha sem conferir resolução oficial.
ENEM: nº do **caderno 7 azul (CD7)**, que é o do arquivo, com o gabarito conferido no arquivo GB; as de 2021 e 2022 vêm de `data/revisao-final/dia-2/enem-matematica.json` e têm a numeração do **caderno 5 amarelo (CD5)**, a mesma que as nossas âncoras usam. No CD7 as duas colunas se misturam: conferi cada nº pelo cabeçalho "Questão N" e pelo gabarito.
Fuvest 1ª fase: nome do ano = ano do vestibular (2022 = prova de 12/12/2021), prova V; 2ª fase = dia 2, M01 a M06. ITA 1ª fase: nome do ano = arquivo (2021 = nov/2020; 2025 = out/2024), nº da prova geral (Matemática de 37 a 48 até 2024; 1 a 12 em 2025). IME 2021: nº na ordem do arquivo resolvido (o nº oficial não conferi, ?).
Contas marcadas "conta minha" foram refeitas em Python (frações exatas ou força bruta).

## 1. As reais (16 de Geometria Plana, 6 bancas)
| id | fonte | estilo | letras (≈) | passos (≈) | descrição em palavras minhas (≤ 200 letras) |
|---|---|---|---|---|---|
| enem-2019-cd7-q142 | ENEM 2019 dia 2, CD7 q.142 (gab. E) | ENEM | 600 | 4 | Área circular pavimentada de 6 m de diâmetro vai ganhar mais 8 m de diâmetro; o estoque de material cobre 100 m². Pede se o estoque basta (π = 3). |
| enem-2022-cd5-q167 | ENEM 2022 dia 2, CD5 q.167 (gab. B) | ENEM | 820 | 5 | Piscina de 90 000 L com cinco projetos de profundidade, largura e comprimento. Escolher o que gasta menos cerâmica no fundo e nas quatro paredes. |
| enem-2021-cd5-q152 | ENEM 2021 dia 2, CD5 q.152 (gab. B) | ENEM | 1430 | 4 | Contêiner pintado nas 4 paredes (dois lados) e no piso; comprimento e largura dobram, altura fica. Cinco fornecedores dão quantidades diferentes; achar o certo. |
| fuvest-2022-f1-q37 | Fuvest 2022 1ª fase, V, q.37 (gab. A) | Fuvest | 260 | 4 | Quadrado de lado 1 e círculo de raio 2 com o mesmo centro O. A no quadrado, B no círculo, AB = 2. Pede o cosseno do ângulo AOB quando ele for o maior possível. |
| fuvest-2021-f2-M01 | Fuvest 2021 2ª fase, dia 2, M01 (3 itens) | Fuvest | 620 | 6 | Estacionamento 40 m × 100 m com 4 câmeras que cobrem regiões I, II e III, medidas só na figura. Itens: área de I, área de II e % do estacionamento sem câmera. |
| fuvest-2021-f2-M05 | Fuvest 2021 2ª fase, dia 2, M05 (3 itens) | Fuvest | 440 | 4 | Define perímetro e diâmetro (maior distância entre dois pontos) e pede a razão perímetro ÷ diâmetro de um retângulo 3 × 4, de um triângulo obtusângulo e de uma região em círculo. |
| ita-2021-q45 | ITA 2021 1ª fase, Mat q.45 (gab. D) | ITA | 150 | 5 | Triângulo com AB = 14 e os cossenos dos ângulos A e B dados. Pede o raio da circunferência inscrita. |
| ita-2021-q49 | ITA 2021 1ª fase, Mat q.49 (gab. B) | ITA | 190 | 4 | Quantos triângulos não congruentes têm perímetro 87 e lados inteiros em progressão aritmética de razão não nula. |
| ita-2024-q45 | ITA 2024 1ª fase, Mat q.45 (gab. C) | ITA | 330 | 5 | Triângulo ABC de área 24, M meio de BC, pontos R e Q nas retas AB e AC (Q fora do segmento) com razões dadas. Retas RM e QM cortam os lados; pede a área de APMS (17, conta minha). |
| ita-2023-q42 | ITA 2023 1ª fase, Mat q.42 (gab. D) | ITA | 270 | 4 | Triângulo retângulo com ângulo de 30° em A e BC = 1. D na hipotenusa, paralelas aos catetos por D formam E e F. Pede o menor valor de EF (√3/2, conta minha). |
| ime-2021-trapezio | IME 2021 objetiva, 13º do arquivo resolvido (gab. D) | IME | 290 | 4 | Trapézio cujas diagonais se cruzam em I; os triângulos formados sobre as bases têm áreas 9 e 16 cm². Pede a área do trapézio. |
| ime-2025-q9 | IME 2025 discursiva, Mat q.9 | IME | 210 | 6 | Quadrado de lado a, triângulo equilátero AMN com M em BC e N em CD. Pede o raio do círculo inscrito no triângulo CMN em função de a. |
| ime-2026-q1 | IME 2026 discursiva, Mat q.1 | IME | 230 | 4 | As 12 raízes de z¹² = 1 formam dois hexágonos regulares (índices pares e ímpares). Pede a área da região coberta pela união dos dois. |
| hmmt-2023-feb-geo-q1 | HMMT fev. 2023, Geometry q.1 (resp. 189) | Harvard-MIT | 200 | 3 | Hexágono regular ABCDEF; P dentro do quadrilátero ABCD; áreas dos triângulos PBC = 20 e PAD = 23. Pede a área do hexágono. |
| hmmt-2023-feb-geo-q3 | HMMT fev. 2023, Geometry q.3 (resp. 47) | Harvard-MIT | 190 | 4 | Retângulo ABCD com diagonais em E; perímetro de ABE é 10π e o de ADE é n. Pede quantos valores inteiros n pode ter. |
| oxford-mat-2021-q5 | Oxford MAT 2021, Q5 (5 itens) | Harvard-MIT | 2000 | 8 | Triplas de inteiros que formam triângulo; f(P) conta as triplas de perímetro P (ordem conta). Provar que somar 1 aos lados leva P a P+3 e f(2k−3) = f(2k). |

## 2. Onde mora a dificuldade
| id | ideia escondida | pegadinha (tipo da gramática) | tabela ou figura | junta com |
|---|---|---|---|---|
| enem-2019-cd7-q142 | O aumento é no DIÂMETRO (raio de 3 para 7) e só a coroa nova conta: 3·(7² − 3²) = 120 m², maior que 100 | 7 enunciado (diâmetro x raio) + 1 condição ("área nova", não a área toda) | não (?) | círculo + comparação com estoque |
| enem-2022-cd5-q167 | O volume é igual nos 5 (90 m³) mas a área de revestimento muda: fundo + 4 paredes, sem tampa | 3 contagem faltando (2 pares de paredes diferentes) | lista de projetos | paralelepípedo + conversão L → m³ |
| enem-2021-cd5-q152 | Nas paredes só o perímetro dobra (altura fica): área x2; no piso os dois lados dobram: x4 | 4 intuição que engana ("tudo dobra") | não | escala de áreas |
| fuvest-2022-f1-q37 | AOB é isósceles (OB = AB = 2): cos θ = OA/4, e θ máximo é OA mínimo = 1/2 (meio do lado), cos = 1/8 | 5 caso extremo (o mínimo de OA é o meio do lado, não o vértice) | figura | lei dos cossenos + otimização |
| fuvest-2021-f2-M01 | Decompor as regiões em triângulos e trapézios só com as medidas da figura (leitura minha, ?) | 1 condição (% sobre a área total, não sobre a vigiada) | figura com medidas | áreas + porcentagem |
| fuvest-2021-f2-M05 | O diâmetro é a maior distância: diagonal no retângulo (14/5), lado maior no triângulo obtusângulo | 7 enunciado (definição nova de diâmetro) | 2 figuras | perímetro + comparação de distâncias |
| ita-2021-q45 | sen C sai da soma dos ângulos; lei dos senos dá os lados 13, 14, 15; r = área ÷ semiperímetro = 4 | 2 responder o que não foi pedido (pedem r, não lados) | não (a resolução desenha) | trigonometria + área |
| ita-2021-q49 | Lado do meio = perímetro ÷ 3 = 29; maior lado entre 30 e 43 (desigualdade triangular): 14 triângulos | 1 condição escondida (razão não nula e desigualdade triangular) | não | PA + desigualdade triangular + contagem |
| ita-2024-q45 | Razões de segmentos nas retas dão as áreas por proporção (ou coordenadas): APMS = 17 de 24 | 1 condição (Q fora do segmento AC) | não | áreas + razões (Menelau) |
| ita-2023-q42 | BEDF é retângulo, então EF = BD; o mínimo é a altura de B à hipotenusa: AB·BC/AC | 4 intuição (EF parece variar com D) | não | retângulo + altura do triângulo 30-60-90 |
| ime-2021-trapezio | Semelhança 3 : 4 dos triângulos das bases; os dois laterais têm áreas iguais a 12 (média geométrica): total (3 + 4)² = 49 | 7 alternativa "dados insuficientes" tenta | não | semelhança + áreas |
| ime-2025-q9 | Simetria: CM = CN = a(√3 − 1); r = (CM + CN − MN) ÷ 2 ≈ 0,2144·a (conta minha) | 2 responder o que não foi pedido (acha o lado, pedem o r) | não | equilátero + inscrito no retângulo |
| ime-2026-q1 | União = 2 hexágonos − interseção; a interseção é um dodecágono regular de apótema √3/2: 12√3 − 18 ≈ 2,78 (conta minha) | 3 contagem dupla (somar os dois hexágonos sem tirar a interseção) | figura (a resolução desenha) | complexos + polígonos |
| hmmt-2023-feb-geo-q1 | As alturas de P a BC e a AD somam a altura do trapézio: 2[PBC] + [PAD] é constante; hexágono = 6·20 + 3·23 = 189 | 4 intuição (parece faltar a posição de P) | figura | hexágono regular + áreas |
| hmmt-2023-feb-geo-q3 | Cada perímetro fica entre a metade e o dobro do outro: n entre 5π e 20π, inteiros de 16 a 62 = 47 | 1 condição escondida (desigualdade que limita n) | não | retângulo + desigualdade triangular |
| oxford-mat-2021-q5 | Somar 1 aos três lados preserva a desigualdade triangular e muda o perímetro em 3: bijeção entre perímetros | 3 contagem (triplas ordenadas contam diferente) | não | desigualdade triangular + contagem + prova |

## 3. Como a banca cobra aqui
**ENEM**
- Contexto concreto (piscina, contêiner, área pavimentada), 600 a 1 400 letras, lista de opções ou projetos para comparar.
- A conta é de área e unidade; a dificuldade é ler o que muda (diâmetro, só uma dimensão) e o que fica.
- Quatro a cinco passos; erros típicos viram alternativas (usar raio por diâmetro, dobrar tudo).

**ITA (1ª fase)**
- Texto seco de 150 a 330 letras, sem desenho; três a cinco passos.
- Uma ideia escondida (soma de ângulos + lei dos senos, desigualdade triangular nos lados em PA, EF = BD) que o aluno precisa enxergar.
- Resposta quase sempre numérica limpa (4, 14, 17), mas chegar lá pede técnica que o ENEM não pede (trigonometria).

**IME (discursiva e objetiva)**
- Pede uma grandeza em função de a, com simetria (equilátero no quadrado) ou com junção (raízes da unidade = hexágonos).
- Resolução de 4 a 6 passos com um desenho que o aluno deve fazer sozinho.
- A objetiva do trapézio (9 e 16) é o clássico de áreas com semelhança.

**Fuvest**
- 1ª fase: figura curta, uma ideia (cos = OA/4, mínimo de OA), 4 passos.
- 2ª fase: itens a, b, c crescentes, figura com as medidas, porcentagem no fim (M01), definição nova que o aluno tem de aplicar (M05).
- Justificar em palavras também vale ponto.

**Harvard-MIT e Oxford**
- HMMT Geometry: enunciado de 2 linhas, resposta inteira, truque único (soma de alturas constante, desigualdade que limita n). Sem figura no texto.
- Oxford MAT: itens encadeados que levam a uma prova; a ideia é escrita nos itens (somar 1 aos lados), mas a prova é do aluno.
- Estilo d da escada é **por técnica** (invariante, soma constante), não por tema.

## 4. As nossas 4 contra a real mais próxima
Todas as 4 nossas têm âncora de uma linha. Conferi cada uma lendo a real citada.
| id nosso | estilo marcado | letras / passos nossos | real mais próxima | mesma técnica? | dificuldade vs a real | estilo certo? | veredito |
|---|---|---|---|---|---|---|---|
| d2-escada-mat-ita-pla-00a (gramado em L, 10% a mais, pacotes) | a = ENEM | 800 / 4 reais | enem-2022-cd5-q167 e enem-2019-cd7-q142 | sim, em parte: área composta e decisão por conta, como a piscina; a ideia é "subtrair o canto" | igual ou maior: tem % + arredondar para cima + dado que sobra (preço, desconto) | sim (800 letras, desenho, dado que sobra) | **MANTER** |
| d2-escada-mat-ita-pla-00b (retângulo 3:4 inscrito, área fora) | b = ITA | 220 / 3 reais | ita-2021-q45 e ime-2025-q9 | não: nossa é "diagonal = diâmetro" com números 6-8-10; as reais escondem a ideia (lei dos senos, simetria do equilátero) | bem menor: 3 passos, o 3-4-5 entrega o raio | texto curto de ITA, mas sem técnica de ITA | **TROCAR** |
| d2-escada-mat-ita-pla-00c (círculo inscrito no 5-12-13) | c = Fuvest | 213 / 3 reais | ita-2021-q45 e fuvest-2021-f2-M05 | pouco: o inscrito é a mesma conta, mas o 5-12-13 dá r = (a + b − c)/2 de cabeça | menor: nenhuma condição escondida, π = 3 dado | só no tamanho | **REESCREVER** |
| d2-escada-mat-ita-pla-00d (canteiro com P no lado de cima, R$) | d = Harvard | 461 / 3 reais | hmmt-2023-feb-geo-q1 e ime-2021-trapezio | só a ideia "a área não depende de P"; na real ela exige somar alturas ou razões, na nossa a altura (8) já está no texto | bem menor: um triângulo de base e altura dadas | não: Harvard esconde a invariante, aqui ela vem dita | **TROCAR** |

Motivo (2 linhas por veredito):
- **pla-00a MANTER:** a conta tem 4 etapas (L, 10%, pacote, arredondar) e dado que sobra, no tamanho do ENEM 2022 (piscina, 820 letras). A âncora é só parcial (ver seção 6).
- **pla-00b TROCAR:** com 3-4-5 a diagonal 10 aparece sem esforço e o resto é uma subtração; é o nível da 1ª fase da Fuvest, não de ITA. A âncora IME 2024 q.14 é de outra técnica.
- **pla-00c REESCREVER:** mantém o círculo inscrito mas a conta é de livro (5-12-13). Falta esconder os catetos (só perímetro e hipotenusa) e usar a razão área ÷ semiperímetro de verdade.
- **pla-00d TROCAR:** a invariante vem escrita ("o triângulo do meio tem sempre metade") e o preço só multiplica. A âncora IME 2024 q.8 é de probabilidade geométrica, não de área.

## 5. Propostas (não são o enunciado final; números conferidos em Python)

### pla-00b (b, ITA) TROCAR: semicírculos sobre os catetos (lúnulas)
- **Âncora por técnica:** ITA 2021 q.45 e IME 2025 q.9 (área e raio por uma ideia, resposta limpa). Não há lúnulas nas reais; a ideia é a mesma "o resultado não precisa do que parece essencial".
- **Ideia escondida:** Pitágoras vale para áreas de figuras semelhantes. Semicírculo da hipotenusa = soma dos semicírculos dos catetos, então a região dos semicírculos dos catetos que sobra fora do círculo da hipotenusa tem área igual à do triângulo. O π nem aparece.
- **Junta (degraus 1 a 5):** Aritmética (frações do círculo), Grandezas (diâmetro, raio, cm²), Equações (terna pitagórica 8-15-17).
- **Pegadinha:** 4 intuição que engana (calcular áreas com π) + 2 responder o que não foi pedido (pedem só a parte de fora).
- **Números:** catetos 8 cm e 15 cm, hipotenusa 17 cm. Área pedida = **60 cm²** (8·15 ÷ 2). Conferido: π/2·(4² + 7,5² − 8,5²) = 0, logo lúnulas = triângulo. Distratores: 108,4 (dois semicírculos dos catetos com π = 3), 120 (produto dos catetos), 30 (metade), 216,75 (três semicírculos).
- **Forma:** texto seco de 250 letras ("Seja ABC retângulo em A..."); regra 4 pede desenho. **Não há desenho pronto de lúnulas** (os de `diagramas-nivel-acima.tsx` são `gramado-em-l`, `circulo-no-triangulo`, `retangulo-na-roda`, `canteiro-triangulos`); sairia um novo, mas `circulo-no-triangulo` serve de molde de traço.

### pla-00c (c, Fuvest) REESCREVER: círculo inscrito sem conhecer os catetos
- **Âncora por técnica:** ITA 2021 q.45 (r = área ÷ semiperímetro) com a condição escondida de Fuvest 2021 M05 (uma definição que o aluno aplica).
- **Ideia escondida:** perímetro e hipotenusa bastam: (a + b)² − c² = 2ab dá a área, e r = área ÷ semiperímetro. Nunca é preciso achar os catetos.
- **Junta (1 a 5):** Equações (produtos notáveis), Aritmética, Grandezas (cm, cm²).
- **Pegadinha:** 7 unidade/enunciado (semiperímetro 35, não o perímetro 70) + 2 (pedem a parte de fora do círculo).
- **Números:** triângulo retângulo com hipotenusa 29 cm e perímetro 70 cm; circunferência inscrita; π = 3,14. a + b = 41, ab = 420, área 210, r = 210 ÷ 35 = 6. Área fora do círculo = 210 − 3,14·36 = **96,96 cm²** (catetos 20 e 21, conferido). Distratores: 113,04 (só o círculo), 210 (só o triângulo), 181,74 (r = área ÷ perímetro = 3), 191,16 (esqueceu o quadrado do raio).
- **Forma:** Fuvest: 1 pergunta, 3 passos de ideia. Desenho: **`circulo-no-triangulo` já existe e serve** (muda a proporção de 5-12-13 para 20-21-29 e os rótulos; o desenho atual é fixo em 5-12-13).

### pla-00d (d, Harvard) TROCAR: o preço depende só de uma distância
- **Âncora por técnica:** HMMT fev. 2023 Geometry q.1 (soma de áreas constante com P livre) e IME 2021 (trapézio 9 e 16).
- **Ideia escondida:** com P dentro do retângulo, os triângulos de lados opostos somam metade da área. Com preços diferentes em cada um, o custo só depende da distância y de P ao lado AB; a coordenada x some.
- **Junta (1 a 5):** Aritmética (custo por m²), Funções (custo é função afim de y), Equações (1º grau).
- **Pegadinha:** 4 intuição (o dado x = 8 m "parece" necessário; é dado que sobra) + 2 (pedem a distância ao lado AB e não ao CD, que dá 7).
- **Números:** retângulo ABCD com AB = 20 m e altura 12 m; P interior a 8 m do lado AD; ligar P aos quatro vértices. Flores a R$ 40/m² em PAB, grama a R$ 10/m² em PCD, canteiro de pedras a R$ 25/m² em PAD e PBC. Custo = 300·y + 4 200. Com custo total R$ 5 700: y = 5 m (**5 m** de AB). Conferido: para x = 3, 8 ou 15 o custo é sempre 5 700. Distratores: 7 (distância ao CD), 8 (o x), 12, 4,5.
- **Forma:** estilo Harvard, 450 letras, desenho (regra 4). **`canteiro-triangulos` serve só em parte:** hoje P está no lado de cima (3 triângulos); a nova versão pede P interior com 4 triângulos.

## 6. Defeitos achados nas âncoras nossas (para o chefe decidir)
- `pla-00b` (**errada**): "IME 2024 q.14" é polígono regular com círculos tangentes (lado = 2R·sen(π/n)); a nossa é retângulo inscrito (diagonal = diâmetro). Técnica diferente.
- `pla-00c` (**errada**): "Fuvest (repo) q.77" é completar quadrado de duas equações de circunferência e "Unicamp 2024 q.54" é área de pizza proporcional ao quadrado do diâmetro. Nenhuma tem círculo inscrito. A real certa é ITA 2021 q.45.
- `pla-00d` (**errada**): "IME 2024 q.8" é probabilidade geométrica (ponto sobre o arco, área do triângulo maior que um valor); a nossa é área de triângulo com a mesma altura. A parte "área pela altura que não muda" existe na real, mas a pergunta é de probabilidade.
- `pla-00a` (parcial): "ENEM 2021 q.152" é escala de áreas (paredes x2, piso x4), que não aparece na nossa; "ENEM 2022 q.167" (piscina) é a que combina com a técnica "somar áreas e decidir". Citar essa e a 2019 q.142 (coroa de círculo com estoque).
