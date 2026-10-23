---
name: token-economy
description: "Use no início de qualquer tarefa que envolva explorar o codebase, ler múltiplos arquivos, ou rodar operações longas."
---

# Economia de Tokens neste projeto

- **Fork para AMPLITUDE, fique inline para PROFUNDIDADE.** Buscar/escanear/
  descobrir onde algo está → delegue a um subagent (ex.: `Explore`, ou os
  subagents deste projeto como `db-inspector`/`build-guard`). Raciocinar
  sobre uma decisão de arquitetura, ou decidir o que fazer com o que foi
  encontrado → mantenha inline, no contexto principal.
- **Grep/Glob antes de Read.** Nunca abra um arquivo inteiro só para achar
  uma função ou padrão — localize a linha/trecho primeiro.
- **offset/limit em arquivos grandes.** Ler um arquivo de centenas de linhas
  por completo quando só uma seção importa desperdiça contexto.
- **Não releia arquivos já vistos nesta sessão.** Se o conteúdo já está no
  contexto, use-o — releitura só depois de uma Edit própria não é necessária
  (o harness já reflete o estado atual).
- **Subagents recebem tarefa fechada, devolvem só o resultado.** Não peça
  para um subagent "narrar o processo" — peça o achado final. Isso mantém
  o contexto principal limpo para as decisões que realmente importam.
- **Avise antes de tarefas longas.** Se a próxima etapa vai gerar muita
  exploração (ex.: rodar seeds grandes, ler múltiplos seeds de flashcards),
  avise que pode valer rodar `/compact` antes de prosseguir.

## Medido neste repo (2026-08-04)

Números reais, não estimativa — cada item abaixo custou tokens de verdade
numa sessão e é evitável.

- **`git log --oneline` é armadilha AQUI.** As mensagens de commit deste
  repo têm corpo longo, e o `--oneline` achata tudo numa linha só em vez de
  cortar: um `git log --oneline -6` despejou ~4.000 tokens de corpo de
  commit. Use sempre truncado:

  ```bash
  git log --format='%h %<(72,trunc)%s' -10
  ```

- **`git diff --stat` antes de `git diff`.** Confirme quais arquivos e
  quantas linhas antes de puxar o conteúdo inteiro. Num commit de 13
  arquivos, o `--stat` custa ~150 tokens e o diff completo ~8.000.

- **Rota de API grande: grep antes de Read.** `app/api/pdf-process/route.ts`
  tem 344 linhas. Ler inteiro para alterar 2 trechos é desperdício — ache com
  `grep -n` e leia com `offset`/`limit`.

- **Subagent devolve o achado, não a narração.** Um prompt de `build-guard`
  que pede "reporte só os erros" volta com `Build OK` (~2 tokens). O mesmo
  build narrado volta com ~2.000. Vale para todos os subagents deste projeto.

- **Verificação no navegador tem custo de descoberta.** Autenticar o
  Playwright localmente custou ~8 chamadas de ferramenta só para redescobrir
  o formato do cookie do NextAuth. Isso agora está em
  [[verificacao-local]] — leia de lá em vez de redescobrir.

- **Build em segundo plano: a notificação mente.** `npm run build > log; echo $?`
  termina com o `echo`, e o "exit 0" é dele. Leia a linha de saída que o
  próprio comando imprime, ou procure `Compiled successfully` no log
  (logica-app, 26/09/2026: dois commits entraram com a cadeia parada assim).

- **Subagente custa por CHAMADA, não por pedido.** Medido no logica-app
  (28/08/2026): 130 mil tokens em 32 chamadas e 142 mil em 24, com pedido de 2
  mil. Cole no pedido o que ele iria buscar. E **continuar um agente vivo com
  `SendMessage` é mais barato que abrir outro** — o novo começa frio e relê tudo.

- **Contexto curto: não comece frente nova.** Feche a aberta — build, commit
  do que está pronto, uma linha do que faltou. Frente pela metade com contexto
  no fim vira trabalho refeito.

- **O maior dreno não é resolvível por skill.** As regras `ecc` em
  `~/.claude/rules/ecc/` carregam ~9.900 tokens em TODA sessão
  (`web/` + `common/` + `README.md`), e injeções por linguagem chegaram a
  ~15.000 numa única sessão — incluindo `arkts/` (HarmonyOS, stack que este
  projeto não usa) a ~6.100 tokens sozinho. Nenhuma instrução compensa isso;
  é decisão de arquivo em disco, no escopo global do usuário.
