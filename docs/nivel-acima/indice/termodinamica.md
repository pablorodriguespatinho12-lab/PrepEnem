# Índice de TERMODINÂMICA E CALOR (nível acima, 23/11/2026)

Fonte: provas reais em `~/provas-reais/` (fora do repositório). **Nenhum enunciado real está copiado aqui**: cada real é descrito em palavras minhas (até 200 letras) com banca, ano e nº.
Número da questão: ENEM = caderno 7 azul (o site numera diferente: `ENEM 2021 q.126` do site é a q.115 do caderno 7); Fuvest 1ª fase = prova V; ITA = ano do arquivo, 1ª fase, nº dentro de Física (a prova é do ano anterior).
Letras = só o enunciado (≈ quando o texto extraído mistura colunas). Passos = estimativa minha.

## 1) Questões reais do conteúdo (16 lidas; as 12 mais úteis)

| id | Fonte e nº | Estilo | Descrição (minhas palavras) |
|---|---|---|---|
| T1 | Fuvest 2022, 1ª fase, q.50 | Fuvest | Café quente recebe leite gelado; pede o volume de leite para chegar a uma temperatura final dada, com mesmo calor específico e mesma densidade. |
| T2 | ITA 2026, 1ª fase, Fís q.27 | ITA | Duas barras quentes de material desconhecido caem em recipiente com água fria, em duas montagens com temperaturas diferentes; pede o calor específico de cada barra. |
| T3 | ITA 2020, 1ª fase, Fís q.9 | ITA | Gás aquecido pela mesma corrente, uma vez a volume constante e outra a pressão constante; pede a razão entre os calores molares em função de P e V. |
| T4 | ITA 2021, 1ª fase, Fís q.6 | ITA | Gás num lado de recipiente isolado, vácuo no outro (o dobro do volume); abre-se um furo; pede a temperatura de equilíbrio final. |
| T5 | Fuvest 2023, 1ª fase, q.13 | Fuvest | Dois compartimentos com 1 e 2 mols de gás monoatômico a temperaturas diferentes; tira-se a parede, sistema isolado; pede a temperatura final em função de T. |
| T6 | Fuvest 2020, 2ª fase, F02 | Fuvest | 1 mol de gás monoatômico esfria por adiabática até 1/3 da temperatura; diz se expandiu, pede o trabalho e a razão entre pressões (dado P·V elevado a 5/3 constante). |
| T7 | Fuvest 2024, 2ª fase, F01 | Fuvest | Gelo do Ártico perdido (km³): massa de água, espessura se espalhado pelo oceano e energia mínima para fundir 1 t de gelo a −20 °C. |
| T8 | IME 2025, Física, q.8 | IME | Câmara frigorífica congela 1 t de suco (líquido, fusão, sólido) em 96 min, compressor com desempenho 3/4 do de Carnot; pede a potência em HP e discutir o palpite do engenheiro. |
| T9 | ENEM 2019, q.102 | ENEM | Duas caixas térmicas de tamanhos diferentes com gelo a 0 °C; o gelo derrete o dobro em uma delas; pede a razão entre as condutividades térmicas. Resposta B (0,67), conferida na conta. |
| T10 | ENEM 2021, q.115 (site 126) | ENEM | Panelas de um material ou de duas camadas; fluxo de calor depende de k, área, ΔT e espessura (fórmula no texto); pede ordenar as panelas pelo calor conduzido. |
| T11 | ITA 2026, 1ª fase, Fís q.19 | ITA | 10 pessoas dissipam 100 W cada num escritório; ar-condicionado ideal entre 17 °C e 37 °C por 4 semanas; pede o custo da energia elétrica. |
| T12 | ITA 2025, 2ª fase, Q6 | ITA | Casca esférica de duas camadas com condutividades diferentes na atmosfera de Mercúrio; pede a condutividade efetiva e a potência de um refrigerador ideal. |

Lidas e não tabeladas (apoio): ITA 2024 2ª fase Q5 (menor trabalho de refrigerador, com entropia), ITA 2025 1ª fase q.18 (gás isotérmico com mola, anulada), IME 2026 q.5 (turbina, ciclo com duas fontes frias), ENEM 2022 q.118 (chuveiro: vazão, tabela, disjuntor; o gabarito do arquivo, C = 20 A, **não bate** com minha conta de 28,6 A → 30 A: não usar número dele sem conferir no INEP).

### Medidas das reais

| id | Letras | Passos | Onde mora a dificuldade (ideia escondida) | Pegadinha (tipo da `gramatica.md`) | Tabela ou figura | Junta |
|---|---|---|---|---|---|---|
| T1 | ≈400 | 2 | Calor cedido = recebido; como c e densidade são iguais, mL entra direto | 7 unidade/enunciado (nenhuma conversão: o dado "sobra") | não | só calorimetria |
| T2 | 1010 | 4 | Duas montagens dão 2 equações para 2 incógnitas; o recipiente também troca calor | 1 condição escondida (esquecer o recipiente) | não (dados em texto) | calorimetria + sistema 2×2 |
| T3 | 332 | 3 | Mesmo calor em dois processos: ΔT de cada um sai de P·V = n·R·T | 2 responder o que não foi pedido (pede razão, não C) | não | gases + calor molar |
| T4 | 285 | 2 | Expansão livre: Q = 0 e W = 0, logo ΔU = 0 e T não muda | 4 intuição que engana ("expandiu, esfria") | não | 1ª lei |
| T5 | ≈800 | 3 | Sem trabalho nem troca, a energia interna total se conserva: média ponderada pelos mols | 4 intuição (média simples dá 5T/2) | figura (2 compartimentos) | gases + energia interna |
| T6 | ≈640 | 4 | Adiabática: W = −ΔU; esfriou, logo expandiu; razão de pressões com a relação dada | 7 sinal do trabalho | não | gases + 1ª lei |
| T7 | ≈1300 | 5 | Volume → massa (densidade) → espessura; energia mínima = sensível + latente | 7 unidades (km³ → m³ → kg) | não | grandezas + calorimetria |
| T8 | ≈1370 | 6 | 3 etapas de calor; desempenho real = 3/4 de Carnot em kelvin; potência = Q ÷ (COP · tempo) | 7 unidades (°C→K, HP, cal→J, min→s) | não | calorimetria + máquina frigorífica |
| T9 | ≈800 | 4 | Fluxo ∝ k · área ÷ espessura · ΔT; massa de gelo derretida mede o fluxo; área interna de cada caixa | 3 contar errado (volume no lugar de área) | não (?) | condução + geometria |
| T10 | ≈870 | 5 | Camadas em série: o fluxo depende de k/d de cada camada | 4 intuição (média simples dos k) | fórmula dada; figura das camadas (?) | condução + frações |
| T11 | 496 | 4 | Ar-condicionado ideal: rendimento de Carnot em kelvin liga calor rejeitado e energia elétrica | 7 unidades (°C→K, W→kWh) | não | máquina térmica + custo |
| T12 | 856 | 6 | Resistências de camadas somam; refrigerador ideal: potência = Q·(Tq−Tf)/Tf | 7 unidades e raio ≫ espessura | figura | condução + Carnot |

## 2) Como a banca cobra aqui

- **ENEM:** situação do dia a dia ou da indústria (panela, caixa de gelo, ducha, concreto), 600+ letras, fórmula às vezes dada no texto e unidades misturadas (L, g, kg, J, kWh, R$).
  A conta é de 1 ou 2 equações; a dificuldade está em montar o que se pede e converter. Junta calor com eletricidade ou custo.
  Costuma trazer tabela, gráfico ou desenho que o texto não repete.
- **ITA:** texto de 285 a 1000 letras, seco; ou simbólico (alternativas em letras) ou número limpo.
  A ideia escondida decide: expansão livre (ΔU = 0), dois processos com o mesmo calor (Cp/Cv), duas montagens que dão sistema 2×2 com o recipiente, Carnot em kelvin. 3 a 6 passos.
  Pegadinha frequente: intuição que engana e unidade (°C em Carnot).
- **Fuvest:** pergunta precisa com número redondo (15 mL, Tm = 2T); a 1ª fase tem 1 a 3 passos e uma condição escondida (c e densidade iguais; sem trabalho nem troca).
  A 2ª fase pede em itens a), b), c) em escada, com "Note e adote" (U = 3nRT/2, P·V^(5/3) constante) e uma justificativa ("expandiu ou comprimiu?").
- **IME:** discursiva, situação de engenharia (câmara frigorífica, turbina) com HP, kcal, minutos e "avalie e discuta se procede".
  6+ passos: várias etapas de calor mais máquina térmica com desempenho dado como fração de Carnot. A resposta final é um juízo, não só um número.
- **Harvard–MIT / Oxford (sem prova de Física no corpus; âncora por técnica):** ideia criativa curta, de contagem, simetria ou invariante (HMMT) ou de modelo simplificado (Oxford PAT, que não está no corpus).
  A resposta sai limpa e o caminho comum (somar tudo) não funciona.

## 3) Nossas 4 questões de Termodinâmica (`d2-escada-fis-ita-ter-00a` a `00d`)

Defeito geral (conferido): 3 dos 4 campos `ancora` dizem "sem real" mas **existe real**: 00a (T1, T2), 00b (T3, T4, T5, T6), 00c (T7, T8). Atualizar o campo depois. O arquivo JSON não foi alterado.
Gabaritos das 4 conferidos na conta: 00a = 14,4 L (D), 00b = 1000 J (E), 00c = 120 s (A), 00d = 75 °C (B).

| id | Estilo e letras | Real mais próxima | Técnica igual? | Dificuldade vs a real | Veredito e motivo |
|---|---|---|---|---|---|
| 00a | a ENEM, 717 | T1 (Fuvest 2022 q.50, mesma conta) e T2 (ITA 2026 q.27, bem mais dura) | Sim, igual à T1 | **Menor**: 1 equação, 3 passos, sem tabela nem junção; a T2 tem 2 equações e o recipiente. Estilo ENEM certo (texto 700+), mas falta a cara do ENEM (tabela, custo, outra matéria) | **REESCREVER.** É o café da Fuvest com texto maior; ENEM real junta calor com custo ou eletricidade e traz tabela. |
| 00b | b ITA, 385 | T3 (ITA 2020 q.9) e T4 (ITA 2021 q.6) | Só em parte: usa 1ª lei, mas a ideia é a receita pronta Q = pΔV + 3/2·pΔV (U e p·V já vêm no enunciado) | **Menor**: nenhuma ideia escondida; as reais pedem enxergar ΔU = 0 ou ΔT a partir de P·V | **REESCREVER.** Estilo ITA e tamanho certos, mas a dificuldade é de ENEM fácil; trocar pela ideia "mesma isoterma, ΔU = 0, calor = área". |
| 00c | c Fuvest, 509 | T7 (Fuvest 2024 F01, item c) e T8 (IME 2025 q.8) | Sim (3 etapas de calor, cal→J) | **Igual à T7, menor que a T8**; falta a condição escondida que a Fuvest costuma pôr (aqui as 3 etapas estão no enunciado) | **REESCREVER.** Fuvest certa no estilo, mas a ideia "são 3 etapas" é óbvia; juntar o teste "derrete tudo?" e a eficiência. |
| 00d | d Harvard, 606 | T9 (ENEM 2019 q.102) e T10 (ENEM 2021 q.115) | Sim, mas é técnica de **ENEM** (fluxo igual em série), não de Harvard | **Menor que a T10** (2 passos, sem camadas nem áreas) e **estilo errado**: Harvard pede ideia criativa e aqui é conta direta | **TROCAR.** Sem prova de Física de Harvard no corpus, a âncora é por técnica (auto-semelhança). |

## 4) Propostas de nova versão (mais difícil) — sem enunciado final

Ordem da escada de Física: Cinemática, Dinâmica, **Termodinâmica**, Ondas, Óptica, Eletricidade. Junções de degraus anteriores = Cinemática e Dinâmica (energia, trabalho, potência). "Toque" de outras matérias (Aritmética, porcentagem, preço) é só tempero ENEM.

### 00a (ENEM) — REESCREVER: banheira com custo do gás
- **Âncora:** ENEM 2022 q.118 (cadeia vazão → calor → conta de energia, com tabela; usar só a estrutura) + Fuvest 2022 q.50 (mistura).
- **Ideia escondida:** o aquecedor só esquenta a parte **quente** da água, não a banheira toda; a mistura diz quanto é essa parte.
- **Passos (5):** mistura (litros quentes) → calor Q = m·c·ΔT só da parte quente → rendimento do aquecedor (divide) → massa de gás pelo poder calorífico → custo pelo preço do botijão.
- **Números:** banheira 50 L a 40 °C; fria 20 °C; saída do aquecedor 70 °C (esquenta de 20 a 70); c = 4,2 kJ/(kg·°C); rendimento 80%; poder calorífico 42 000 kJ/kg; botijão 13 kg a R$ 104.
  Conta: 30·x = 20·(50−x) → x = 20 L; Q = 20·4,2·50 = 4 200 kJ; ÷0,8 = 5 250 kJ; ÷42 000 = 0,125 kg; × R$ 8/kg = **R$ 1,00**.
- **Pegadinhas:** aquecer os 50 L (R$ 2,50); esquecer o rendimento (R$ 0,80); multiplicar por 0,8 (R$ 0,64); kJ com MJ (fator 1000); 1 L = 1 kg.
- **Tabela/figura:** tabela de dados (preço, poder calorífico, rendimento) + desenho da banheira com as duas torneiras. Texto 600+ letras.
- **Junta:** mistura de temperaturas + energia/potência (Dinâmica) + toque de Aritmética (porcentagem, regra de três).

### 00b (ITA) — REESCREVER: a reta p–V entre dois pontos da mesma isoterma
- **Âncora:** ITA 2020 q.9 (ΔT por P·V = n·R·T) e ITA 2021 q.6 (ΔU = 0).
- **Ideia escondida:** os dois estados têm o mesmo P·V, logo a mesma temperatura: ΔU = 0 e **Q líquido = W = área do trapézio**. A temperatura passa por um máximo no meio.
- **Passos (4):** P·V nos dois estados (iguais) → ΔU = 0 → área sob a reta (trabalho) → Q = W.
- **Números:** A (4,0×10⁵ Pa; 1,0 L) → B (1,0×10⁵ Pa; 4,0 L) por reta; gás monoatômico. W = (4+1)/2·10⁵·3·10⁻³ = **750 J** = Q.
  Conferência: dQ/dV muda de sinal em V = 3,125 L; Q absorvido só até aí = 903 J (para uma 2ª pergunta ou pegadinha); T máxima em V = 2,5 L (P·V = 625 J contra 400 J).
- **Pegadinhas:** litro → m³; usar p inicial × ΔV (1 200 J) ou p final (300 J); calcular ΔU = 3/2·pΔV e esquecer que ΔT = 0; "calor líquido" ≠ "calor recebido na parte em que absorve".
- **Tabela/figura:** gráfico p–V com a reta (o enunciado ITA não traz desenho, mas a regra do Pablo pede tabela ou desenho em 40%).
- **Junta:** trabalho como área (Dinâmica) + gases + 1ª lei. Texto curto (300–450), estilo ITA.

### 00c (Fuvest) — REESCREVER: o gelo derrete todo?
- **Âncora:** Fuvest 2024 F01 (gelo, c·ΔT + m·L) + IME 2025 q.8 (etapas e potência).
- **Ideia escondida:** antes de somar etapas, testar se o calor da água quente derrete **todo** o gelo; se não, o equilíbrio é 0 °C com gelo sobrando.
- **Passos (6):** calor do gelo até 0 °C → calor que a água libera até 0 °C → comparar → massa derretida → depois, a resistência termina o serviço (fusão do que sobrou + aquecer tudo) → tempo com rendimento.
- **Números:** 200 g de gelo a −10 °C em 300 g de água a 30 °C (isolado). Água: 9 000 cal; gelo: 1 000 cal; sobram 8 000 cal → derrete 100 g; fica 0 °C com 100 g de gelo e 400 g de água.
  Depois resistência de 900 W com 80% de rendimento (720 W): fundir 100 g = 8 000 cal; aquecer 500 g de 0 a 20 °C = 10 000 cal; total 18 000 cal = 72 000 J (1 cal = 4 J) → **100 s**.
- **Pegadinhas:** supor temperatura final acima de 0 °C dá Tf ≈ −13 °C (absurdo, sinal de que a hipótese falhou); rendimento divide; cal → J.
- **Tabela/figura:** tabela de calores (gelo 0,5; água 1; fusão 80) + desenho em etapas (barras de calor).
- **Junta:** calorimetria de mistura + mudança de fase + potência/energia (Dinâmica).

### 00d (Harvard–MIT) — TROCAR: escada infinita de barras (âncora por técnica)
- **Âncora:** **por técnica**, não por prova de Física (não há no corpus). Técnica: auto-semelhança/invariante de problemas tipo HMMT (a parte que falta é igual ao todo) e analogia térmica–elétrica (resistências em série e paralelo, do tipo Oxford PAT).
- **Ideia escondida:** uma rede infinita de barras idênticas: o que vem depois do 1º nó tem a **mesma resistência térmica** do todo. Isso vira equação de 2º grau com raiz racional.
- **Montagem:** do reservatório quente (100 °C), barra horizontal de resistência r; no nó, uma barra vertical de resistência 2r até o reservatório frio (0 °C) em paralelo com a **mesma rede** repetida.
  Z = r + (2r·Z)/(2r+Z) → Z² − rZ − 2r² = 0 → **Z = 2r**. Cada nó fica com a metade da temperatura anterior (50, 25, 12,5 °C).
- **Números:** mesmo material, k = 200 W/(m·K), seção 1,0 cm², barras horizontais de 0,50 m e verticais de 1,0 m (resistência 2r). r = L/(kA) = 0,5/(200·10⁻⁴) = 25 K/W; fluxo saindo da fonte = 100/(2r) = **2,0 W** (ou pedir a temperatura do 3º nó: 12,5 °C).
- **Pegadinhas:** cm² → m²; a barra de 1,0 m tem resistência dobrada; somar só a 1ª etapa (100/3r ≈ 1,33 W); tentar somar infinitos termos na mão.
- **Tabela/figura:** desenho da escada com 3 etapas e "…" (obrigatório: ninguém visualiza sem).
- **Junta:** condução em série e paralelo (Termo) + equação do 2º grau (toque de Matemática); a analogia com resistores é só dica, pois Eletricidade vem depois na escada. Texto 500+ letras; sem conta pesada.

## 5) O que sobra para o chefe decidir
- Trocar os campos `ancora` das 4 (00a: T1/T2; 00b: T3/T4; 00c: T7/T8; 00d: T9/T10 mais "por técnica") quando o JSON puder ser editado.
- Estilo d (Harvard) em Física: confirmar com o Pablo que "âncora por técnica" basta.
- Rodar o ritual de abertura e o gabarito às cegas antes de gravar as novas versões.
