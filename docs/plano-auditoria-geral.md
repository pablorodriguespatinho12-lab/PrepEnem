# Plano grande: achar TODO erro do site (Pablo, 24/11/2026)

Pedido dele: analisar o site inteiro atrás de (a) explicação que não ensina, (b) falta de exercício
fácil, médio e difícil, (c) ENEM sem cobertura, (d) conteúdo mal explicado, (e) questão de nível acima
com texto demais e dado repetido. O `aluno-do-zero` lê tudo "como quem só sabe as 4 operações" e aponta
onde se perde. **Só computador (1366 px) por enquanto** (regra 23). Celular depois.

## Princípios
- Medir antes de afirmar: toda contagem sai de SQL (`mcp__neon__run_sql`, só leitura) ou `grep -c`.
- Cada fase termina com uma TABELA (o que achei, quantos, onde). Nada de "parece bom".
- Corrigir só depois da tabela. Um lote por vez, um commit e um push por lote (cada publicação custa ~6 min).
- Escopo é o que ele disse: TODAS as aulas e questões da família, não o exemplo da tela.

## Fases
| Fase | Pergunta | Como medir | Quem | Saída |
|---|---|---|---|---|
| A | Que conceitos/temas existem e quantos exercícios fácil/médio/difícil cada um tem? | SQL: tema x dificuldade (Matemática, Física, outras) | `explorador` (Haiku) | tabela tema x {fácil, médio, difícil}; lista dos buracos |
| B | Que conceito não tem exercício SÓ dele antes da junção (regra 20)? | cruzar A com a lista de conceitos de cada aula | `explorador` | lista conceito -> falta A, falta B, falta A+B |
| C | Que temas do ENEM (2019 a 2025) não têm questão nem aula? | `scripts/temas-enem-2022-2025.ts` x temas do banco | `explorador` | lista de temas do ENEM sem cobertura |
| D | Que explicação não ensina? (passo que pula conta, constante sem origem, letra sem significado) | `scripts/jornada-do-aluno.mts` por prova, depois `aluno-do-zero` em rodadas | `aluno-do-zero` | achados com a frase exata e a prova |
| E | Nível acima: que questão tem texto demais ou repete dado? | contar nas lousas: o mesmo número aparece em 3+ telas; enunciado > 380 letras | `explorador` | lista questão -> nº de repetições, tamanho |
| F | Contas, gabaritos e fatos certos? | `revisor-de-fatos` por lote | `revisor-de-fatos` | só os erros, 1 linha cada |
| G | Tela real do computador: telas quebradas, texto cortado, lousa vazia | `varrer-prova.mts` (1366 px) e `varrer-telas.mts` | eu (Sonnet) + foto | relatório sem achado, ou lista |

## Fase E em detalhe: dado UMA vez (regra 22)
1. Questão com dados (planta, escala, medidas, tabela): a 1ª tela mostra os dados **uma vez**,
   como figura desenhada (planta com cotas, escala) ou tabela de cotas.
2. As telas seguintes só **apontam** (cor, seta, "o 12 da tabela"), não digitam os números de novo.
3. Teste automático: nenhum número do enunciado aparece digitado em mais de 2 telas da lousa
   (vira linha em `nivel-acima-regras.test.ts`).
4. Figura nova usa a ferramenta que já existe (`geometria.ts`, `regra-de-tres.ts`, `k:'eq'`, `k:'grade'`).

## Orquestra (pedido do Pablo: modelo mais rápido, plano focado para o agente acertar)
Regra de modelo: **o mais barato que dá conta**. Haiku para ler, contar e conserto mecânico com
regra clara. Sonnet para código e tela. Opus (`pensador`) só se travar 2 vezes no mesmo ponto.

| Agente | Modelo | Recebe (entrada exata) | Entrega (formato fixo) | Eu confiro |
|---|---|---|---|---|
| A `explorador` | Haiku | SQL por `mcp__neon__run_sql` (SELECT): `materia, tema, nivel, count(*)` de `Question` | `docs/auditoria/fase-a.md`: tabela tema x {FACIL, MEDIO, MODELO_ENEM, VESTIBULAR}; lista "tema com <3 em algum nível" | refaço 2 contagens por SQL; soma bate com `count(*)` total |
| B `explorador` | Haiku | lista de conceitos das aulas (`data/`, `lib/aula-lousa`) + saída de A | `docs/auditoria/fase-b.md`: conceito -> tem só-A? só-B? junção? | sorteio 3 conceitos e abro no banco |
| C `explorador` | Haiku | `scripts/temas-enem-2022-2025.ts` + temas do banco | `docs/auditoria/fase-c.md`: tema do ENEM -> nº de questões e aulas (0 = buraco) | conto buracos com `grep -c` |
| E `explorador` | Haiku | lousas gravadas (`Question.explicacao`/aula lousa no banco, só leitura) | `docs/auditoria/fase-e.md`: questão -> letras do enunciado, nº de telas em que cada número do enunciado reaparece (≥3 = repete) | abro 2 casos na tela |
| D `aluno-do-zero` | Haiku | jornada de UMA prova por vez (`scripts/jornada-do-aluno.mts`) | `docs/auditoria/fase-d-<prova>.md`: onde se perdeu, com a frase exata | só aceito achado com frase citada |
| F `revisor-de-fatos` | Haiku, Sonnet se a conta for longa | o lote consertado | só os erros, 1 linha cada | refaço a conta de cada erro apontado |
| Conserto mecânico (trocar texto, regravar lousa pelo conversor) | `executor` Haiku | **lista fechada** de ids + regra escrita + exemplo certo | diff curto + `grep -c` antes/depois | rodo o teste e conto "X de Y" |
| Conserto com código novo (figura, `do-robo.ts`) | `executor` Sonnet | arquivo e função exatos + teste que deve passar | código + teste verde | build + foto 1366 px |

Como dar ordem certa ao agente (o que faz acertar):
1. Entrada fechada: ids, arquivo e SQL já escritos; ele não "procura onde está".
2. Saída fechada: nome do arquivo, colunas e teto ("até 10 linhas de resposta"; o resto no arquivo).
3. Só leitura por padrão: o prompt diz "não edite" e "só SELECT".
4. Contagem sempre de comando; o agente cola o comando usado ao lado do número.
5. Levas de no máximo 3 agentes (429 estoura limite).
6. Agente que volta sem o formato pedido: descarto e refaço com o prompt mais curto, sem discutir.

## Erros dos meus planos e correção (autoatualização OBRIGATÓRIA, pedido do Pablo 24/11/2026)
Depois de TODA leva: ler o que voltou, listar onde o PLANO (não só o agente) errou, corrigir aqui e no agente, antes da próxima leva.
| Leva | Erro | Causa no plano | Correção |
|---|---|---|---|
| 1-C | agente leu "tema do ENEM" como tema de redação | meu prompt apontou `temas-enem-2022-2025.ts` (que é de redação) | prompt de C passa a DEFINIR: "conteúdo de prova (Mat/Ciências/Humanas/Linguagens) cobrado no ENEM 2019-2025", fonte = `scripts/banco-enem` + lista de conteúdos por prova, e proíbe redação |
| 1-E | "89 de 90 repetem" (critério frouxo) | critério "número do enunciado" pegou 1 e 2 | só números com 3+ dígitos ou decimais; excluir `d2-escada-*` numa coluna à parte |
| 1-todos | sem Write, heredoc barrado | prompt mandou criar script com Write | eu crio o script antes, agente só roda; ou `node -e` de 1 linha |
| 1-A | nenhum erro de método; achou `dificuldade` é String livre | ok | manter prompt de A como modelo |
Regra para o próximo plano: o prompt do agente traz (1) definição em 1 frase do que conta, (2) critério com exemplo do que NÃO conta, (3) script pronto, (4) formato de saída. Teste antes de disparar: "um estranho lendo só isto entregaria a coisa certa?".

## Ordem de execução
1. **Leva 1** (em paralelo, Haiku): A, C, E. **Leva 2:** B (depende de A).
2. Eu junto tudo em `docs/auditoria/achados.md` e mostro ao Pablo: "X buracos de exercício, Y temas do ENEM sem questão, Z questões que repetem dado".
3. Ele escolhe a ordem do conserto (máx. 2 opções). Consertar em lotes: aula, exercício, figura.
4. D e F rodam em cada lote novo (Haiku); G (1366 px) no fim, antes do push.
5. Depois de cada lote: `npx vitest run data/revisao-final/nivel-acima-regras.test.ts`, build, push, conferir Vercel.

## Custo e limite
Limite semanal da conta volta 27/11 às 16h. Fases A, B, C, E são leitura barata (Haiku).
Escrever questão e figura é a parte cara: fica para depois da tabela, em lotes pequenos.
