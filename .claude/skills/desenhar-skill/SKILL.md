---
name: desenhar-skill
description: "O trabalho antes de escrever uma skill do PrepEnem: decidir se ela deve existir (ou se é uma linha numa existente), achar a falha real, o número medido e o contra-exemplo, e cortar o que um agente faria sozinho. Usar antes de write-a-skill / skill-creator, e quando uma skill parecer óbvia ou longa demais."
---

# Desenhar skill

`write-a-skill` e `skill-creator` montam a estrutura. O difícil é decidir **o
que a skill sabe que o agente já não sabia**. Sem isso sai um arquivo bem
formatado que repete bom senso — e ele custa em toda sessão, porque a
`description` entra no contexto sempre.

## Primeiro: deve existir?

Skill nova só se a tarefa é **recorrente E tem procedimento não óbvio**. Fora
disso é uma linha numa skill existente (`inventar-daqui` diz qual). Medido no
logica-app: 26 de 27 commits em skills foram linha.

## Os três modos de falhar

| Falha | Teste |
|---|---|
| repete o modelo ("leia antes de mudar") | o agente faria isso sozinho? corte |
| genérica | trocando "PrepEnem" por outro nome, continua valendo? não é daqui |
| lista sem porquê | cada regra diz o que se perde ao violar? senão ninguém obedece sob pressão |

## Os três achados antes de escrever

1. **A falha real** — episódio deste repositório em que o trabalho foi refeito
   (`git log`, conversa antiga, ou perguntar ao Pablo).
2. **O número** — fato medido que vira limite. Ex.: `app/treino/page.tsx` tem
   1.272 linhas; build leva 60–70 s; `git log --oneline -6` aqui despeja ~4 mil tokens.
3. **O contra-exemplo** — o caminho tentador e errado, nomeado. Ex.: skill
   global de design que parece certa e desfaz o redesign editorial.

## A voz

Português, zero emoji. Prosa que argumenta; tabela para limite e mapeamento.
Regra no imperativo, e a frase seguinte com o porquê. Nada de "seja cuidadoso",
"considere", "é importante".

## O corte final

Linha a linha: **um agente competente faria o contrário disto sem a skill?**
Se não, sai. Quarenta linhas afiadas vencem duzentas completas.

## Encerramento obrigatório

1. Estrutura com `write-a-skill` ou `skill-creator`.
2. Validar com `ln-162-skill-reviewer` passando o caminho do `SKILL.md` (não a
   pasta). Ela é de outro repositório: falta de versão, data, `**Type:**`,
   `Definition of Done` e description acima de 200 caracteres reprovam por
   convenção alheia — **ignore esses cinco**; aproveite frontmatter, tamanho,
   caminho quebrado e referência órfã.
3. Anotar a skill no `CLAUDE.md` e na tabela de `combinar-skills` — skill que
   ninguém cita é skill que ninguém chama.
4. Fechar com o bloco "A regra comum" igual ao das outras.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
