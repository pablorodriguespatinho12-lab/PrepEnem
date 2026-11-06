# Repertórios coringa: a prova

Pedido do Pablo (29/10/2026): coringas que "servem para qualquer tipo de tema",
fáceis de decorar (frases de autor ou dados), e **provar** que funcionam, com
base nas redações nota 1000, sem achismo. Dados brutos e scripts:
`docs/redacao/prova-coringas/`.

## Rodada 3 (06/11/2026): 5 coringas novos, juízes mais baratos

Pedido do Pablo: achar outros coringas, com os juízes, sem gastar muito.
Mesmo método nos mesmos 11 temas (2015 a 2025), com 1 escritor Sonnet e 3
juízes cegos: Haiku, Sonnet e Fable. Dados e scripts em `prova-coringas/r3/`.

| Coringa | Temas (de 11) | Reprovou em |
|---|---|---|
| João Cabral, "é difícil defender, só com palavras, a vida" | **9** | doenças mentais, dados na internet |
| Darcy Ribeiro, "A crise da educação no Brasil não é uma crise; é um projeto." | **8** | doenças mentais, envelhecimento, intolerância religiosa |
| Brecht, "Do rio que tudo arrasta se diz que é violento, mas ninguém diz violentas as margens que o comprimem." | 7 | dados na internet, cinema, envelhecimento, registro civil |
| Galeano, "Os ninguéns: os filhos de ninguém, os donos de nada." | 6 | violência contra a mulher, envelhecimento, dados, herança africana, doenças mentais |
| Milton Santos (ideia, sem aspas): o consumidor ocupou o lugar do cidadão | 2 | 9 temas |

- **Os juízes baratos repetiram a régua:** as âncoras da rodada 1 deram o mesmo
  resultado (Drummond 11 de 11, dado do esgoto 0 de 11, Bauman de bolso 0 de 11).
- Concordância no "sustenta 200": de 70 a 80 em 88 por par de juízes.
- Escritor x juízes: "ok" aprovado em 25 de 26; "forçado" em 0 de 30.
- Custo: ~340 mil tokens nos 4 agentes.
- **Fontes:** João Cabral em *Morte e Vida Severina* (1955); Darcy na reunião da
  SBPC de 1977 (há quem cite "programa" no lugar de "projeto"); Brecht no poema
  "Sobre a violência", com tradução que varia; Galeano em *O Livro dos Abraços*
  (1989). Milton Santos: a frase exata não foi achada, só a ideia.
- Ainda não foram ao site nem à prova dos 28 temas.

## Atualização de 30/10/2026: grandes assuntos e redações nota 1000

O Pablo perguntou se os coringas servem para os grandes assuntos (economia,
saúde, educação, segurança, cultura e outros) e se dariam certo nas redações
nota 1000 de verdade. Os dados estão em `prova-coringas/grandes-assuntos/`,
com o script `somar_macro.py` e `somar_c.py`.

**Os grandes assuntos.** Agrupei os 28 temas do ENEM de 1998 a 2025. Um tema
pode cair em 2 grupos.

| Grupo | Temas |
|---|---|
| Grupos vulneráveis | 11 |
| Cultura | 5 |
| Cidadania e política | 4 |
| Tecnologia e comunicação | 4 |
| Economia e trabalho | 4 |
| Segurança e violência | 3 |
| Educação | 3 |
| Saúde | 3 |
| Meio ambiente | 2 |

**Cobertura nos 28 temas.** Escritores redigiram os trechos dos 17 temas
novos, de 1998 a 2014, com o mesmo método e os mesmos 3 juízes cegos. Somados
aos 11 temas da prova anterior, dão os 28.

| Coringa | Temas | Grupos em que passou em todos |
|---|---|---|
| Drummond | **28 de 28** | os 9 grupos |
| Rui Barbosa | 24 de 28 | vulneráveis, saúde, tecnologia |
| Dom Hélder | 21 de 28 | ambiente, saúde, segurança |
| Graciliano | 19 de 28 | educação |
| Elie Wiesel | 18 de 28 | saúde, segurança |
| Luther King | 12 de 28 | nenhum |
| Dado 1888 | 12 de 28 | nenhum |
| Machado | 6 de 28 | nenhum |

- Em todos os 28 temas, pelo menos 1 dos 3 primeiros (Drummond, Rui Barbosa,
  Dom Hélder) passou.
- Calibração: o Bauman colado reprovou em 17 de 17 temas.
- As âncoras repetiram a 1ª prova: Drummond 11 de 11 e esgoto 0 de 11.

**Nas redações nota 1000 reais.** Usei o 1º desenvolvimento das 47 redações
(5 cartilhas do INEP), comparado às cegas em duas versões com coringa.

| Parágrafo | Sustenta 200 no repertório | Visto como "de bolso" | Qualidade (0 a 10) |
|---|---|---|---|
| Original nota 1000 | 17 de 47 | 14 | 5,85 |
| Coringa colado no parágrafo pronto | 2 de 43 | 36 | 5,69 |
| Parágrafo construído em volta do coringa (molde do site) | **34 de 47** | 12 | **6,37** |

- Par a par, o construído foi melhor que o original em 24, pior em 6 e
  empatou em 17.
- Âncoras: 11 de 15 originais tiveram a mesma decisão nas duas rodadas. Os
  juízes ficaram um pouco mais duros (5 aprovados contra 7), e não mais moles.
- O coringa colado foi chamado de "genérico, serviria para qualquer tema". É a
  definição de "repertório de bolso" da Cartilha.
- Construído, por coringa:
  - Machado 8 de 9, Drummond 8 de 10, Wiesel 7 de 10, Rui Barbosa 4 de 4,
    dado de 1888 5 de 7;
  - **Graciliano 1 de 5**: forçado em racismo e velhice. A ficha avisa.

**Regra que sai disso:**
1. O coringa é o esqueleto do parágrafo: tópico, coringa, explicação com um
   fato do Brasil no recorte do tema, fechamento.
2. Nunca é um enfeite colado num parágrafo pronto.
3. Se você conhece um repertório próprio do tema, ele também serve. As
   redações nota 1000 usam mais obra cultural específica.

**Limite:** os juízes cobram "cita, explica, amarra", que é a estrutura do
molde. A Cartilha cobra isso, mas é uma vantagem de formato para o parágrafo
construído.

## Resposta curta

Dos 11 coringas da 1ª versão, **só 2 passaram em todos os temas**: Drummond e
Dom Hélder. Os 5 dados e as frases presas a um assunto falharam. Numa 2ª
rodada, Rui Barbosa também passou em todos. O site agora mostra só os
aprovados, cada um com a prova na ficha.

| Coringa | Temas aprovados (de 11) | O mecanismo aparece nas redações nota 1000? |
|---|---|---|
| Drummond, "As leis não bastam. Os lírios não nascem da lei." | **11** (nas 2 rodadas) | **sim**: "a lei existe, mas não basta" em 18 de 47, nos 5 temas |
| Dom Hélder, "Quando dou comida aos pobres..." | **11** | não: "remediar não basta" em 0 de 47 |
| Rui Barbosa, "Tratar com desigualdade a iguais..." | **11** | quase não: 2 de 47, só como proposta de cotas |
| Elie Wiesel, "O oposto do amor não é o ódio, é a indiferença." | 8 | **sim**: "indiferença e invisibilidade" em 29 de 47, nos 5 temas |
| Graciliano, "Você é um bicho, Fabiano." | 7 | — |
| Luther King, "A injustiça em qualquer lugar..." | 7 | — |
| Machado, "ao vencedor, as batatas" | 4 | — |
| Dado: último país a abolir a escravidão (1888) | 4 (só temas de raça, religião e povos tradicionais) | — |
| Carolina Maria de Jesus | 2 | — |
| Conceição Evaristo | 2 | — |
| Dado: analfabetismo funcional (Inaf) | 2 | — |
| Dado: informalidade | 1 | — |
| Dado: esgoto | **0** (nas 2 rodadas) | — |
| Dado: violência e cor | **0** | — |

Saíram do site os que passaram em menos de 4 temas. Machado e o dado de 1888
ficaram com o aviso de onde servem.

## Como foi provado

**1. Temas.** Os 11 temas oficiais do ENEM de 2015 a 2025, inclusive os
difíceis para coringa social: 2018 (dados na internet) e 2019 (cinema).

**2. Escritores.** Três agentes escreveram, para cada coringa e cada tema, um
trecho de 2 ou 3 frases (cita, explica, amarra ao recorte do tema), com
autoavaliação honesta (ok, fraco, forçado). Foram 121 trechos na rodada 1 e 33
na rodada 2.

**3. Controles na mesma pilha:**
- Bauman bem escrito: um batido, com o mesmo cuidado.
- Bauman "de bolso": colado genérico, como a Cartilha 2025 descreve.
- Repertórios reais das redações bem avaliadas: na rodada 1, as 2 primeiras
  frases da introdução; na rodada 2, a introdução inteira.

**4. Juízes cegos.** Três juízes, de 3 modelos diferentes (Opus, Sonnet,
Fable), deram nota a cada trecho embaralhado, sem saber a origem, pelos
critérios da Cartilha 2025: legitimado, pertinente, produtivo, "de bolso" e
"sustenta 200". Foram 163 trechos na rodada 1 e 75 na rodada 2.
- **Aprovado** = a maioria diz que sustenta 200, a maioria não vê "de bolso" e
  a média de pertinente e de produtivo é de 1,5 ou mais (de 2).

**5. Censo das redações nota 1000 reais.** Foram 47 redações de 5 cartilhas
do INEP (temas de 2021 a 2025). As de 2022 a 2024 dizem literalmente "nota
1.000". Contei todos os repertórios e 4 mecanismos de argumento.

**6. Corretor oficial do site.** A mesma redação bem avaliada, em 3 versões:
a original, com Drummond e com Bauman "de bolso".

## Os juízes são confiáveis?

- **Distinguem o "de bolso":** Bauman de bolso teve 0 de 11 aprovados, e os
  juízes o marcaram como "de bolso" em 11 de 11.
- **Concordam entre si:** de 80% a 95% de acordo no "sustenta 200".
- **Repetem a régua:** as âncoras da rodada 1 repetidas na rodada 2 deram o
  mesmo resultado (Drummond 11 de 11, esgoto 0 de 11).
- **Batem com o escritor:** o que o escritor marcou "ok" foi aprovado em 27 de
  28; o "forçado", em 1 de 66.
- **Limite: são mais duros que o INEP.** As introduções reais bem avaliadas
  passaram em 0 de 20 cortadas e em 6 de 20 inteiras, porque nelas a ligação ao
  tema costuma vir depois, no desenvolvimento. O juiz cobra "cita, explica,
  amarra" no próprio trecho. Isso pesa **contra** os coringas: passar em 11 de 11
  com um juiz mais duro que o INEP é sinal forte.

## O que as redações nota 1000 mostram (47 textos, 184 repertórios)

- **Tipos de repertório:** obra cultural 65, ideia de autor ou conceito 51,
  fato histórico 32, lei 24, **dado 7, fala entre aspas 5**. Frase de autor e
  dado são raros nas nota 1000: usar um deles destaca, mas não é o caminho
  mais comum.
- **O único repertório presente nos 5 temas é a Constituição de 1988** (15
  redações), quase sempre para dizer que "a lei existe, mas não se cumpre". É
  o mesmo mecanismo do Drummond.
- Em 4 temas: colonização e escravidão. Em 3: Marx, Kant e Krenak.
- **Ser batido não impede a nota 1000:** a Constituição está em 15 de 47.
  Bauman bem escrito também passou nos juízes (10 de 11). O INEP pune o
  repertório colado, não o famoso.

## Corretor oficial do site: defeito encontrado

As 3 versões da mesma redação tiraram **a mesma nota na C2 (160)**: a original
(bem avaliada pelo INEP), a com Drummond e a com Bauman "de bolso". Nas 3, ele
marcou todos os repertórios como "de bolso". Ele não separa o repertório bem
usado do colado, e por isso não serve de prova aqui.

**Causa (30/10/2026, medida com a resposta crua da IA):** em "explica" e
"amarra", a IA escrevia a própria análise ("Ele usa a citação para mostrar...")
em vez de copiar a frase do aluno. O código procura o trecho na redação, não
acha, e o passo vira "ausente": todo repertório saía "de bolso".

**Conserto, no prompt (`lib/redacao/prompts.ts`):**
- o exemplo do formato diz "<frase do aluno, copiada>";
- a análise vai só em "comentario";
- a explicação pode estar na mesma frase da citação ("X afirma que...").

A regra do código ficou como estava: sem explicar, é "de bolso", como no
Bauman da Cartilha 2025.

**Validação (6 correções reais):** 2 redações bem avaliadas, cada uma em 3
versões. As 2 originais voltaram a C2 = 200, como o INEP avaliou. O Drummond
bem usado saiu produtivo, e não "de bolso". O Bauman colado foi marcado "de
bolso". Dados em `prova-coringas/validar-c2-depois.json`.

**Ainda aberto:**
- Em 4 das 6 correções, a IA não listou o repertório da introdução. Num dos
  casos, o Bauman colado passou sem ser avaliado.
- Confirmar a mudança no golden set, que gasta 1 rodada por dia da cota da Groq.

## O iniciante decora e melhora? (30/10/2026)

**Método.** 3 alunos simulados, que nunca escreveram redação (Ana, Bruno e
Carla, perfis diferentes):
1. escrevem 3 parágrafos sem os coringas;
2. leem as fichas uma vez;
3. escrevem de memória o que lembram;
4. reescrevem os parágrafos com 1 coringa.

Os temas nunca entraram na prova: 2012 (imigração), 2013 (Lei Seca) e 2014
(publicidade infantil). Os mesmos 3 juízes cegos avaliaram os 18 parágrafos
embaralhados. Dados em `prova-coringas/iniciantes/`.

| | Antes | Depois de 1 leitura |
|---|---|---|
| Parágrafos que sustentam 200 no repertório | 0 de 9 | **4 de 9** |
| Qualidade média do parágrafo (0 a 10) | 3,4 | **5,4** |

**Memória** (de 3 alunos):

| Lembraram de | Coringas |
|---|---|
| 3 de 3 | Drummond, Dom Hélder, Graciliano e Wiesel (a ideia) |
| 2 de 3 | Machado e Luther King |
| 1 de 3 | dado de 1888 |
| 0 de 3 | **Rui Barbosa** (só a ideia, a frase é longa) |

Fica na cabeça a frase curta e com imagem: lírio, bicho, santo e comunista,
batatas.

**O que falhou:** 5 dos 9 parágrafos do "depois" saíram "de bolso". O aluno
cita, mas liga mal ao tema, e os 3 disseram que "ligar foi o mais difícil".
Deram certo Drummond na Lei Seca e Graciliano na imigração. Falharam Dom Hélder
na publicidade infantil, além de Wiesel e Luther King citados de forma genérica.

**Consertos que vieram disso:**
- o Rui Barbosa ganhou uma forma curta para decorar, citada como ideia, sem aspas;
- toda ficha ganhou o molde da ligação: "Isso se vê quando [fato do tema]".

**Limite:** um aluno (Ana) leu as fichas antes do "antes". Ela não usou nenhum
coringa nele, mas a ordem não foi a combinada.

## O que mudou no site

- **Estado:** Drummond, Dom Hélder, Rui Barbosa.
- **Acesso:** Rui Barbosa, Dom Hélder, Drummond.
- **Estigma:** Elie Wiesel, Graciliano, Luther King.
- **História:** Drummond (Lei Áurea), Rui Barbosa (cotas), dado de 1888 (com aviso).
- **Mercado:** Drummond (leis do trabalho), Graciliano, Machado (com aviso).

Cada ficha mostra "Testado: serviu em X de 11 temas do ENEM de 2015 a 2025".
Fontes das frases conferidas por checagem: Drummond em *A Rosa do Povo*
(1945); Rui Barbosa em *Oração aos Moços* (1920); Wiesel na *US News & World
Report* (27/10/1986); Luther King na Carta de Birmingham (1963); Graciliano em
*Vidas Secas* (1938); Machado em *Quincas Borba*, cap. VI (1891). Dom Hélder
não tem documento datado: cite "como dizia Dom Hélder".

## Limites desta prova

- Os juízes e os escritores são IAs. O corretor humano do INEP não foi usado,
  e o corretor do site não diferencia (veja acima).
- Um tema por ano, de 2015 a 2025. Temas muito diferentes, como os de
  ciência, podem dar outro resultado.
- Os trechos têm 2 ou 3 frases. Numa redação inteira, a ligação ao tema pode
  ficar mais forte ou mais fraca.
