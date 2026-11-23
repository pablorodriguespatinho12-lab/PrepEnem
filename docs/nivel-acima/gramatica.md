# Gramática do "nível acima" (Fase 2 do plano, 22/11/2026)

Base: 36 questões reais já no repo (28 de Matemática) (`data/vestibular`: ITA 2025, IME 2024, Fuvest, Unesp, Unicamp), 34 questões resolvidas nos capítulos `fuv-*` do
Universo Narrado (16 em fuv-01..11, 18 em fuv-12..22) e ENEM do banco (Mat 85). Passos são estimativa. Nada daqui entra no site; são exemplos.
Fuvest: a aula erra contas (dados 105; diagonais 750 → 1530; "menor que 3" onde é "maior que 3"): **nenhum número da aula vira gabarito sem eu refazer.**

## (b) Régua medida (letras do enunciado, Matemática)
| Fonte | Questões | Letras (média) | Mín–máx | Passos |
|---|---|---|---|---|
| ENEM real (banco) | 85 | 676 | 183–1974 | 4+ |
| ITA 2025 | 9 | 232 | 75–469 | 3–4 |
| IME 2024 | 8 | 197 | 104–354 | 3–4 |
| Fuvest (repo) | 4 de Mat | 496 | 129–905 | 3 |
| Fuvest (aulas) | 34 | texto curto; difícil na técnica | — | 4–15 (média ~9) |
| **Minhas 36 de nível acima (antigas)** | 36 | 220–264 | — | 3 |

Leitura: há **2 jeitos** de ser difícil.
- **Jeito ENEM:** texto longo (≥ 600 letras), tabela/figura, dado sobrando, conversão de unidade. Difícil de **ler e montar**.
- **Jeito ITA/IME/Fuvest:** texto curto (100–400), mas a técnica é escondida (lugar geométrico, periodicidade, substituição, Euler). Difícil de **ter a ideia**.
- Minhas antigas eram curtas **e** sem técnica escondida: por isso "muito fácil, genérico". Regra nova: cada questão tem **um** dos dois jeitos, de verdade, e 6+ passos.

## (a) Catálogo de junções (par de conteúdos → ideia de questão)
Contagem nos exemplos (34 resolvidas):
| Junção | Vezes | Exemplo que ensinou (não copiar) | Ideia de questão original (para a escada) |
|---|---|---|---|
| Trigonometria + triângulo retângulo/semelhança | 4 | torre; caixa d'água inclinada; f = 2sen x + 3cos x | fora da escada de Mat atual (não há degrau de trigonometria): só se o degrau entrar |
| Geometria espacial + semelhança/razão | 3 | pirâmide com esferas; tetraedro com cortes | degrau 7: volume que muda ao cortar/derreter; razão de áreas |
| Combinatória + probabilidade | 3 | moedas condicionais; dados; Monty | degrau 8: condicional com tabela de contagem |
| Exponencial + logaritmo / + eq. 2º grau | 4 / 2 | 5^x com y=5^x; log em a,b | fora da escada atual (Funções cobre só afim/quadrática) |
| Geometria plana: área por subtração, tangência, ângulo inscrito | 3 | hexágono equiângulo; circunferência inscrita | degrau 6 |
| Geometria analítica + 2º grau (reta × circunferência) | 2 | tangência com Δ = 0 | degrau 5/6 se virar "função quadrática + distância" |
| Módulo + gráfico | 2 | soma de |x−k| (barbantes) | degrau 5: otimização "onde pôr a parada" (mediana) |
| Combinatória + geometria + cinemática | 1 | Ana e Bruna na malha | degrau 8 + 2: caminhos com velocidades |
| **Geometria plana + probabilidade** (modelo do Pablo: ENEM 3 círculos e disco) | 0 nos exemplos | ENEM | degrau 8 com 6 (precisa da decisão A) |
| Porcentagem/aritmética + estatística (média ponderada, tabela) | ENEM | — | degraus 3 e 8 (única junção permitida pela cadeia estrita) |

## (c) Tipos de pegadinha (do mais ao menos frequente)
1. **Condição escondida:** |q|<1, "não passa pela origem", base entre 0 e 1 inverte desigualdade, existência do log, "no máximo" ≠ "exatamente".
2. **Responder o que não foi pedido:** pedem R²+10R e não R; pedem a soma mínima, não o ponto.
3. **Contagem dupla ou faltando:** 2A vs A; esquecer o 2! do bloco; caso (2,2,1) = 90 e não 45.
4. **Intuição que engana:** 50% no Monty; 2/3 nas moedas; somar os máximos separados (2+3 = 5).
5. **Caso degenerado:** com 4 estacas o mínimo é um intervalo.
6. **Número grande → padrão:** somatório até 100 se resolve por período, nunca "na mão".
7. **Unidade/enunciado:** "mesmo perímetro" ≠ mesma área; arco que não contém A; deslocamento é −D/C, não D.

## (d) Estrutura do enunciado
- **ENEM:** contexto real, 2–3 dados que sobram, pergunta no fim, tabela ou figura que o texto não repete.
- **ITA/IME/Fuvest:** definição seca ("Seja..."), 1–2 condições, pede **uma** grandeza; o desenho não vem (o professor: "Nenhuma questão tinha o desenho";
  "o enunciado é só um texto, tem que visualizar").
- Frases de método do canal: "pensa num caso exagerado" (100 portas); "número absurdo não se soma na mão"; "o que mudou e o que não mudou" (base/altura).

## Receita para a fábrica (Fase 4)
**Regra do Pablo (22/11/2026, versão final, depois do lote 2): cada questão tem UM estilo principal (Harvard, ITA, ENEM ou Fuvest) e toques dos outros 3. Em cada degrau, as 4 candidatas têm 4 principais diferentes (uma de cada).** Antes: "mistura igual nos 4" (lote 1). Cada questão tem ao mesmo tempo, com o principal mais forte:
- **ENEM:** situação real, texto de ~500+ letras, tabela ou desenho, dado que sobra.
- **Fuvest:** pergunta precisa, uma condição escondida no texto.
- **ITA:** uma ideia de contagem/técnica que destrava (contagem dupla, lugar geométrico, período).
- **Harvard–MIT:** um truque elegante que junta 2 ideias e dá resposta limpa.
O lote 1 (4 questões, 1 estilo cada) serve de teste; refazer misturado quando ele pedir.

**CORRIGIDO (Pablo, 22/11/2026): cada questão nova nasce de UMA questão real aberta e lida** (índice em `indice-reais.md`), com o campo `ancora` ("ITA 2025 q.4"): copia a TÉCNICA e a classe de tamanho da real, no conteúdo do degrau. Não se escreve questão a partir deste resumo. Medido nos lotes 2 e 3 sem âncora: 317 letras de média (ENEM real 676), 0 com 600+.
Cada questão nova declara: (0) **âncora real**; (1) **junção**; (2) **jeito** (ENEM ou ITA); (3) **pegadinha** da lista acima; (4) passos como a âncora (o dado real é 3–4 em ITA/IME, 4+ no ENEM; a dificuldade está na ideia, "≥ 6" foi invenção minha); (5) cada alternativa errada = um erro
típico dos 7 tipos; (6) conteúdos só da cadeia do degrau (ver `mapa-da-escada.md`); (7) resolvida por **outro agente sem ver a resolução**.

## Lacuna honesta
A escada de Matemática **não tem trigonometria, exponencial/log nem geometria analítica**, que são 12 das 34 junções dos exemplos. O nível acima do site
fica, por ora, com as junções de aritmética, grandezas, estatística, equações, funções, geometria plana/espacial e probabilidade.
