# Gabarito do teste do agente `aluno-do-zero`

Não mostre este arquivo ao agente. Ele lê só `jornada-teste.txt`, que tem **9 tropeços plantados** (os 8 primeiros nas rodadas de 21/11; o T9 veio do Pablo no mesmo dia), todos
reais (o Pablo, em 21/11/2026, ou o agente iniciante pegando o que o Pablo pegaria), e **3 telas limpas**
(para medir encenação: se o agente reclama delas, está inventando dúvida).

## Os 8 plantados

| # | Onde | Tropeço | Tipo | De onde veio |
|---|------|---------|------|--------------|
| T1 | Aula 1, tela 4 | "quantas filas?" sem dizer o que é uma fila | palavra comum com sentido técnico | Pablo: "quantas filas? como assim?" |
| T2 | Aula 1, telas 5 a 8 | resolve listando as 6 ordens e depois cobra 7 cartões, sem conta curta que escale | método que não escala | Pablo: "com 7 cartões ninguém lista na prova" |
| T3 | Aula 1, tela 6 | o 84 e o 504 aparecem sem de onde vêm ("escolher 3 de 9") | número do nada | agente iniciante, 21/11 |
| T4 | Aula 1, telas 6 e 7 | "o 9! parado no 3º fator" (9! não é 504) e "o 9 nem entra na conta" depois de usar o 9 | tela contra tela, igualdade falsa | agente iniciante, 21/11 |
| T5 | Aula 1, tela 7 | "k × (k−1) × … × 1" antes de um caso com número | letra antes de número | agente iniciante, 21/11 |
| T6 | Aula 1, tela 7 | "k!" sem dizer como se lê o "!" (nem a palavra fatorial aparece) | notação sem leitura | agente iniciante, 21/11 |
| T7 | Aula 1, tela 9 | "o MAIOR no meio" cobrado sem ter sido ensinado | exercício cobra o não ensinado | agente iniciante, 21/11 |
| T9 | Aula 1, telas 5 e 7 | "só uma está crescente" / "só 1 crescente" sem dizer entre o quê: o aluno acha 3 · 7 · 9 também crescente | só um sem escopo | Pablo: "e o 379? também é crescente" (21/11/2026) |
| T8 | Aula 2, tela 1 | "quem pesa mais puxa a média" antes de dizer o que é peso aqui | palavra comum com sentido técnico | agente iniciante, 21/11 |

## As 3 limpas (o agente deve dizer "entendi")

- Aula 1, tela 3 ("o que a questão pede").
- Aula 2, tela 2 (média de 4 e 8, com número antes de qualquer regra).
- Aula 2, tela 3 (m/s explicado com número).

## Como medir

Rode o agente na `jornada-teste.txt` e conte: **plantados achados (de 8)** e **limpas reclamadas (de 3)**.
Quem acha menos que o anterior, ou reclama de limpa, piorou.

## Resultados

| Data | Versão do agente | Plantados achados | Limpas reclamadas |
|------|------------------|-------------------|-------------------|
| 21/11/2026 | antes (7 tipos) | 6 de 8 (errou T1 e T2) | 0 de 3 |
| 21/11/2026 | depois (13 tipos + 5 perguntas) | 7 de 8 (T1 só parcial: viu a palavra e desculpou) | 0 de 3 |
| 21/11/2026 | depois + "a ordem das telas manda" | 8 de 8 | 0 de 3 |
| 21/11/2026 | + tipo 14 ("só um" sem dizer entre o quê); T9 plantado | 9 de 9 | 0 de 3 |

Limites honestos: 1 execução por versão (um modelo pode variar de uma rodada para outra) e a última regra
foi escrita depois de ver o T1 escapar, então o 8 de 8 mede o texto que eu já conhecia. O teste real é a
próxima aula nova: se o Pablo ainda disser "não entendi" de algo que o agente não achou, acrescente o
tropeço novo em `.claude/agents/aluno-do-zero.md`, plante-o em `jornada-teste.txt` e some uma linha aqui.
