---
name: distribuir-trabalho
description: "Quebrar uma frente e decidir quem faz cada parte: o que fica comigo, o que vai para Explore, build-guard, db-inspector, design-system-auditor ou os revisores, o que vai em paralelo e em quantas levas, e como pedir evidência em vez de parágrafo. Usar no começo de frente com mais de dois arquivos, e sempre que a dúvida for 'eu faço ou delego'."
---

# Distribuir trabalho

**Delegue a evidência, nunca a decisão.** Subagente traz o que viu; quem
decide e responde pelo commit sou eu. Delegação mal feita volta como parágrafo
plausível que ninguém confere e entra no commit com cara de revisado.

## Quem faz o quê

| Quem | Serve para | Nunca peça |
|---|---|---|
| eu | decidir, escrever código | — |
| `Explore` | "onde está X", quem chama quem | julgar se X está certo |
| `build-guard` | build com só os erros | interpretar o erro |
| `db-inspector` | schema vs Neon real antes de script | rodar o script |
| `design-system-auditor` | tabela de contraste, raio, transição | opinar sobre composição |
| `revisor-de-fatos` | conta, gabarito único e fato de material de estudo escrito à mão | consertar ou opinar sobre estilo |
| `revisor-adversarial` | defeito no diff, em contexto limpo | opinar sobre layout |
| `inspetor-visual` | se a composição fecha, olhando a imagem | conferir lógica |
| `general-purpose` | edição mecânica em lote, busca na web | decidir; **passe `model: "sonnet"`** (132 chamadas em 30 dias = 14% do gasto, nov/2026) |

## A ordem

1. Localizar (`Explore`, se não sei onde mexer).
2. Fazer — eu, sem revisor no meio.
3. Verificar — `build-guard`. **Antes dos revisores, sempre**: revisor gastando
   contexto para reencontrar erro de tipo é revisor desperdiçado.
4. Revisar — só os que `chamar-revisor` aprovou, numa mensagem só.
5. Commitar — um por frente.

## Paralelo tem teto

Chamadas independentes vão numa mensagem só. Mas **acima de 3–4 chamadas caras,
mande em levas** e confira a primeira antes da segunda. Logica-app, 03/09/2026:
oito agentes numa mensagem, três voltaram, **cinco morreram com 429** (limite
mensal) sem ler uma linha.

## O pedido tem três partes

- **Escopo:** arquivos ou comando exato.
- **Pergunta:** uma, respondível com evidência.
- **Formato:** até N achados com `arquivo:linha`, por gravidade; "se nada, diga".

Para o `revisor-adversarial`: escopo e pergunta, **nunca o meu raciocínio** —
o valor dele é não ter visto a conversa.

Cole no pedido o que ele iria buscar (o `grep`, a seção do arquivo): o custo de
subagente cresce com o **número de chamadas**, não com o tamanho do pedido.

## Porteiro do orquestrador (Pablo, 24/11/2026: "você tem que ser um bom orquestrador")

Eu penso e respondo pelo resultado. Antes de CADA leva, as 7 linhas; a que falhar, conserto antes de disparar:

| Confira no pedido | Erro real que criou a linha |
|---|---|
| Palavra ambígua definida em 1 frase, com exemplo do que NÃO conta | "tema do ENEM" lido como redação; "qualquer número" contado (89 de 90) |
| O agente tem a ferramenta que a saída exige (Write? Bash?) | 2 de 3 voltaram sem poder gravar |
| Um agente por arquivo escrito; nomes compartilhados registrados antes | 3 em paralelo no mesmo `.tsx` se atropelariam |
| Leva de até 4; a 1ª conferida antes da 2ª | 8 de uma vez, 5 mortos com 429 |
| Script e guardas da máquina colados no pedido (sem heredoc; `DB_CONFIRMED=1`) | heredoc barrado |
| Modelo mais barato que dá conta; ≤5 linhas em 1 arquivo faço inline | arranque de 20 mil tokens por agente |
| Pablo sabe em 1 linha o que cada um vai fazer | disparo recusado 2 vezes sem aviso |

`aluno-do-zero` roda em Haiku (Pablo, 24/11/2026: só lê). Medido em 7 questões: Haiku 55,5 mil tokens, 59 s, 10 tropeços
(a maioria real); a leitura anterior, antes do 1º conserto, gastou 42,6 mil e 13 s. Conta e gabarito NÃO vão para Haiku.

Depois de cada leva: conferir o achado na fonte (`vitest`, comando, foto); perguntar "onde o MEU pedido errou?";
gravar a resposta nesta tabela ou no arquivo do agente e dizer "aprendi: X, gravei em Y". Texto consertado por causa de
um revisor e não relido é dito ao Pablo como "sem 2ª leitura".

**Padrão é fazer sozinho** (pesquisa de 27/11/2026, `docs/pesquisa-orquestracao-agentes-2026-11-27.md`): raciocínio em
sequência piorou 39 a 70% dividido entre agentes (Google + MIT); erro de agente solto cresce 17x, com orquestrador 4x.
Agente só para parte independente, leitura que sujaria o contexto ou conferência com olhos limpos.

## Depois

O resultado chega na notificação. **Nunca abra o transcript** (JSONL inteiro).
Relatório é testemunho, não veredito: achado que importa, confira na fonte;
achado descartado, diga por quê.

## Duas frentes ao mesmo tempo

Frentes que mexem em arquivos diferentes (ex.: corretor de redação e prova)
rodam em paralelo, cada uma na sua cópia: `EnterWorktree` nesta sessão, ou
`isolation: "worktree"` no agente. Sem isso, duas edições no mesmo checkout
se atropelam.

## Quando não delegar

Arquivo único que já sei onde fica; decisão de produto; contexto já curto.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
