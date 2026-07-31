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
