# Varredura: conteúdo não estudado e letra antes de número

Pedido do Pablo (12/11/2026, depois da mangueira e do balanço): "esse tipo de coisa não
pode estar nos outros conteúdos; vê se esse tipo de confusão está nas outras questões".

Como: `python3 scripts/jornada-aula-questoes.py <pasta>` monta, por questão, a aula do
tema (o que o aluno já estudou) + telas "Antes" + explicação; o agente `aluno-do-zero`
lê cada arquivo procurando o tropeço 4 (conteúdo que a aula não ensinou) e o 7 (letra
antes da conta com número). Uma linha por achado: id | passo | tipo | trecho | o que faltou.

## Difícil natureza (14 de 20 sem achado)
- d2-dificil-nat-15 | Por que funciona | 4 | "As bactérias que comem essa alga morta respiram e gastam o oxigênio do fundo." | decompositor que respira e gasta O₂
- d2-dificil-nat-15 | A pergunta | 4 | "Eutrofização" | palavra sem definição
- d2-dificil-nat-20 | A pergunta | 4 | "anticorpos prontos" | anticorpo e soro não ensinados
- d2-dificil-nat-10 | Por que funciona | 4 | "O CO se prende à hemoglobina..." | hemoglobina não está na aula
- d2-dificil-nat-16 | Por que funciona | 4 | "Cada hemácia leva oxigênio preso na hemoglobina." | hemoglobina
- d2-dificil-nat-16 | A pergunta | 4 | "hormônio EPO" | sigla só no desenho
- d2-dificil-nat-07 | Por que funciona | 4 | "Mudou o grupo: isomeria de função." | isomeria e grupo éter
- d2-dificil-nat-03 | Por que funciona | 4 | "...é igual dos dois lados e se cancela" | cancelar fator igual dos dois lados

## Difícil matemática (13 de 20)
- d2-dificil-mat-14 | Jeito rápido | 4 | "O expoente fica 12 ÷ 3 = 4, e 2⁴ = 16" | potência com expoente 4; a aula só tem x²
- d2-dificil-mat-16 | O que acontece | 4 | "no poste vale o mesmo: altura = 1,5 × 6 = 9" | semelhança: por que a razão é igual
- d2-dificil-mat-07 | O que acontece | 4 | "Tempo = distância ÷ velocidade." | velocidade (já há "Antes")
- d2-dificil-mat-02 | Jeito rápido | 7 | "divida a parte pela porcentagem: 90 ÷ 0,30" | exemplo 30% de 100 = 30 e a volta
- d2-dificil-mat-06 | Por que funciona | 7 | "× 8 ÷ 10 = × 0,8" | mostrar com dias reais
- d2-dificil-mat-12 | A pergunta | 7 | "× (x − 10)" | conta com 17 antes do x
- d2-dificil-mat-13 | Ideia | 7 | "Pelo espelho, o meio é x = 20." | tabela 10 e 30 antes

## ENEM matemática (13 de 20)
- cmouei99p0082uoz9p61sg5mn | O que acontece | 4 | "4/3 × π × 0,5 × 0,5 × 0,5" | volume da esfera fora da aula
- cmouei99p0082uoz9p61sg5mn | Por que funciona | 4 | "Dividir por π/6 é ... multiplicar por 6 e dividir por π" | dividir por fração com número
- cmoudnny7003yuoz9rl5k4j71 | A pergunta | 4 | "média 10 kg e desvio 1 kg" | desvio padrão e coeficiente de variação
- cmoudnny7003yuoz9rl5k4j71 | Jeito rápido | 4 | "1,5 ÷ x < 0,1" | desigualdade; tabela só depois
- cmoudnnyg0042uoz9kc45yues | O que acontece | 4 | "Errar 2 seguidos: metade da metade, 1/4." | probabilidade fora da aula de Estatística
- cmouei9a10088uoz90w2bqvc6 | O que acontece | 4 | "pelo espelho o pico está no meio" | simetria da parábola não ensinada
- cmoudnnye0041uoz9ryp2dxoj | O que acontece | 7 | "Diária d vezes n diárias ... d·n" | 100 × 3 = 300 antes das letras
- cmoudnnwo003duoz9gn1ouuu0 | O que acontece | 7 | "Duas paredes medem c por h..." | medidas de verdade antes
- cmouei99m0080uoz9m46w0uba | Por que funciona | 7 | "a forma mais redonda gasta menos superfície" | testar com números

## ENEM natureza (10 de 20)
- cmoudnnso001puoz93jgvg2as | O que acontece | 4 | "a tensão de uma pilha é o E° de quem recebe ... menos o de quem entrega" | E° e "maior menos menor"
- cmoudnnso001puoz93jgvg2as | O que acontece | 4 | "0,54 − (−3,05)" | subtrair negativo
- cmoudnnuu002nuoz9m6m2tszm | O que acontece | 4 | "Soma-se grossura ÷ k de cada camada..." | condutividade e camada dupla
- cmoudnnuu002nuoz9m6m2tszm | Jeito rápido | 7 | fórmula de k_mista | conta com dois materiais simples
- cmouei95e005yuoz9wkrh222v | O que acontece | 7 | "empurra mais quem muda mais a velocidade" | 20→0 contra 20→−20 em 4 s
- cmouei95e005yuoz9wkrh222v | O que acontece | 4 | "Energia: nos blocos todo o movimento some." | energia do movimento
- cmouei967006buoz9sn75cdpe | 2) Velocidade da água | 4 | "(3 ÷ t) × (3 ÷ t) = 9 ÷ (t × t)" | multiplicar frações com número
- cmouei97i006xuoz91gjs17c4 | Por que funciona | 4 | "proteção catódica" | galvanização e proteção catódica
- cmoudnnt2001vuoz97s5sifsi | Jeito rápido | 4 | "acetato = CH₃CO₂ (2 carbonos)" | nomenclatura etan-/propan-
- cmouei95y0067uoz9w3x3r9uv | O que acontece | 4 | "poucos fótons" | fóton
- cmouei976006ruoz9ybzcgxam | O que acontece | 4 | "a enzima normal" | enzima
- cmoudnnu2002auoz9dskgmqnx | Por que funciona | 4 | "cada litro de etanol pesa só 0,8 kg" | 0,8 g/mL → 0,8 kg/L
- cmouei97t0073uoz9docgkvnz | Por que funciona | 7 | quadro R = 4,5 × 4,5 ÷ 4,5 | quadro usa outra conta que o texto

## Médio natureza (14 de 20)
- d2-medio-nat-18 | O que acontece | 4 | "retículo rugoso" | retículo e proteína de exportação
- d2-medio-nat-20 | O que acontece | 4 | "o soro traz anticorpos prontos" | anticorpo
- d2-medio-nat-14 | O que acontece | 4 | "10% de 10 000 = 10 000 ÷ 10" | porcentagem
- d2-medio-nat-08 | O que acontece | 4 | "C₄H₁₀ ... 4 × 12" | mol e massa molar
- d2-medio-nat-01 | Jeito rápido | 4 | "a corrente é a potência dividida pela tensão" | virar P = U × i
- d2-medio-nat-02 | Jeito rápido | 4 | "corrente = tensão ÷ resistência" | virar U = R × i

## Médio matemática (16 de 20)
- d2-medio-mat-06 | Por que funciona | ERRO | "Os 2 400 são a mesma distância nos dois dias." | a distância é 40 km; 2 400 é 60 × 40 com minutos
- d2-medio-mat-14 | Jeito rápido | 4 | "40 = 90m − 80m" | passar para o outro lado (isolar)
- d2-medio-mat-19 | O que acontece | 4 | "480 cm³, ou 480 mL" | 1 cm³ = 1 mL
- d2-medio-mat-12 | A pergunta | 7 | "P = 20 + 40h" | 2 horas = 20 + 80 antes da letra

## Fácil natureza (18 de 20)
- d2-facil-nat-13 | A pergunta | 4 | "o peso de 1 mol" | mol
- d2-facil-nat-02 | A resposta | 4 | "resistores lado a lado (paralelo)" | paralelo

## Reforço matemática (15 de 20)
- mat-gra-03 | Ideia | 4 | "Tempo = distância ÷ velocidade: 200 ÷ 80 = 2,5 horas" | velocidade (já há "Antes")
- mat-fun-02 | Jeito rápido | 4 | "12 = 30 − 2t", "2t = 30 − 12 = 18" | isolar a incógnita
- mat-gra-01 | Jeito rápido | 4 | "1 km = 100 000 cm" | 1 000 × 100 não mostrado
- mat-ari-02 | Jeito rápido | 4 | "preço = 8 400 ÷ 7" | dividir por decimal (840 ÷ 0,70)
- mat-ari-01 | A resposta | ERRO | "A (R$ 105,00) dá desconto em vez de aumento" | 120 − 15% = 102; 105 é 120 − 15 reais

## Reforço biologia (11 de 20)
- d2-reforco-bio-fis-04 | Por que funciona | 4 | "Cada gás vai de onde tem mais para onde tem menos." | difusão
- d2-reforco-bio-fis-02 | O que acontece | 4 | "Sem insulina, a porta da célula não abre" | insulina abre a célula
- d2-reforco-bio-evo-01 | Por que funciona | 4 | "O que passa para os filhos é o que está no DNA" | DNA (de Genética)
- d2-reforco-bio-evo-01 | A resposta | 4 | "seleção artificial" | não ensinada
- d2-reforco-bio-mic-02 | Por que funciona | 4 | "parede da célula ou o ribossomo dela" | peças da célula (de Citologia)
- d2-reforco-bio-mic-02 | A resposta | 4 | "bactérias resistentes" | resistência (de Evolução)
- d2-reforco-bio-cit-02 | Por que funciona | 4 | "Vírus não tem ribossomo próprio" | vírus e antibiótico (de Microbiologia)
- d2-reforco-bio-fis-01 | O que acontece | 4 | "As células usam o oxigênio para tirar energia" | respiração celular
- d2-reforco-bio-evo-02 | A resposta | 4 | "o veneno cria a mutação" | mutação
- d2-reforco-bio-eco-03 | A resposta | 4 | "a ideia superada de que o uso muda o corpo" | Lamarck
- d2-reforco-bio-eco-01 | Jeito rápido | 4 | "passa 10% = 0,1" | porcentagem

## Reforço química (6 de 20)
- d2-reforco-qui-ph-03 | Jeito rápido | 4 | "Pode deixar em mL dos dois lados." | por que pode ficar em mL
- d2-reforco-qui-est-04 | Por que funciona | 4 | "Mg(OH)₂ = 24 + 2 × (16 + 1) = 58" | massas do Mg e do Cl não dadas
- d2-reforco-qui-est-04 | Jeito rápido | 4 | "58 ÷ 0,58 = 100" | dividir por decimal
- d2-reforco-qui-est-03 | O que acontece | 4 | "E o FeS é tudo o que entrou, junto." | massa se conserva
- d2-reforco-qui-ele-01 | O que acontece | 4 | "vira íon Zn²⁺" | íon e o ²⁺
- d2-reforco-qui-ele-01 | Por que funciona | 4 | "ânodo comido" | ânodo
- d2-reforco-qui-ele-03 | O que acontece | 4 | "(cátodo) ... (ânodo)" | cátodo e ânodo
- d2-reforco-qui-ph-02 | Por que funciona | 4 | "Ácido solta H⁺ na água" | H⁺ e por que baixa o pH
- d2-reforco-qui-est-01 | Por que funciona | 4 | "128 g de O₂ (4 mols)" | massa do O₂ não dada
- d2-reforco-qui-org-03 | Por que funciona | 4 | "a amina é básica (lembra a amônia)" | básico, amônia
- d2-reforco-qui-org-01 | Por que funciona | 4 | "tem pH abaixo de 7" | pH (de outro tema)
- d2-reforco-qui-amb-01 | Por que funciona | 4 | "carbonato de cálcio, que reage com ácido" | não ensinado
- d2-reforco-qui-amb-04 | A resposta | 4 | "CFC" | não ensinado
- d2-reforco-qui-amb-02 | Por que funciona | 4 | "57,5 ÷ 2,3 = 25 litros" | dividir por decimal

## Fácil matemática (17 de 20)
- d2-facil-mat-14 | Jeito rápido | 4 | "Some 8 dos dois lados" | achar o número que falta
- d2-facil-mat-11 | Jeito rápido | 7 | "meio = (n + 1) ÷ 2" | contar com 5 valores antes
- d2-facil-mat-08 | Jeito rápido | 7 | "Multiplique a velocidade pelo tempo." | velocidade (Antes)

## Reforço natureza (16 de 20)
- d2-reforco-fis-ond-04 | Por que funciona | 7 | "Como v = λ × f..." | v fixa 340, f dobra, λ cai à metade
- d2-reforco-fis-opt-02 | O que acontece | 7 | "o ângulo de saída é igual ao de chegada" | caso com 30°
- d2-reforco-fis-ter-02 | Por que funciona | ERRO | "O QUE MACETE" | o macete é "QUE MACETE"
- d2-reforco-fis-opt-03 | O que acontece | 4 | "o ponto nítido fica antes da retina" | como o olho foca na retina

## Total
240 questões lidas, 86 achados (3 erros de fato). Conteúdos repetidos viraram 7 aulas
"Antes" em 13/11 (porcentagem, número que falta, dividir por decimal, mol, pilha,
anticorpo, hemoglobina; `scripts/data/antes-novos-13-11.json`). O resto: conserto no
texto do passo.
