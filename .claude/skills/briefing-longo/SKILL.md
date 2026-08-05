---
name: briefing-longo
description: "Use ao receber um briefing longo e estruturado, com seções de restrição, critérios verificáveis e proibições explícitas — planeja a execução antes de escrever código."
---

# Briefing longo e estruturado — como executar

Um briefing com seções TRAVADO / ABERTO / DIAGNÓSTICO MEDIDO / PROIBIDO /
TÉCNICAS EXIGIDAS / VERIFICÁVEL / PROCESSO não é uma conversa: é um
contrato. O usuário já pensou, já mediu, já viu coisa dar errado, e
codificou tudo isso em seções. O modo de falhar mais comum não é escrever
código ruim — é ler o briefing como se fosse um pedido solto e sair
implementando a primeira seção.

## 1. Extrair o contrato antes de escrever qualquer código

Um briefing desses mistura três tipos de item, com pesos completamente
diferentes:

- **Restrições travadas.** "TRAVADO", "não mexa em X", "mantenha a rota".
  Violar significa retrabalho garantido — o trabalho todo volta. Não são
  preferências: são o perímetro.
- **Critérios verificáveis.** Binários. "Contraste mínimo 4.5:1",
  "nenhuma transição em `width`". Cada um vira uma checagem executável.
- **Direção subjetiva.** "Deve parecer editorial", "menos genérico".
  Aqui há julgamento, e é aqui que a conversa com o usuário vale.

Separe os três **explicitamente** antes de começar, num TodoWrite ou numa
lista curta na resposta. O erro clássico é tratar tudo como igualmente
negociável — negociar uma restrição travada e ao mesmo tempo tratar uma
direção subjetiva como lei.

Quando as três listas estiverem prontas, confira o que sobrou: item do
briefing que não caiu em nenhuma das três geralmente é ambiguidade real,
e vale uma pergunta antes de escrever qualquer linha.

## 2. Critério verificável vira comando, não promessa

Para cada item da seção VERIFICÁVEL, escreva **desde já** como vai provar.
Não "vou garantir contraste adequado" — mas: qual grep, qual medição no
navegador, qual cálculo de contraste, rodado onde.

```
Critério: nenhuma animação de propriedade de layout
Prova:    grep -rnE 'transition:[^;]*\b(width|height|left|top)\b' app/ components/
          esperado: zero linhas
```

Se um critério não tem forma de ser medido, **isso é uma pergunta para o
usuário, não uma suposição**. "Hierarquia clara" não é verificável como
está; "escala tipográfica com razão mínima de 1.25 entre níveis" é. Peça a
tradução em vez de inventá-la e depois defender a invenção.

Ver [[verificacao-local]] para o que só o navegador prova (opacidade real
depois do ScrollTrigger, estado autenticado, layout em viewport pequeno) —
grep no código não substitui.

## 3. A lista de PROIBIDO é mais informativa que a de EXIGIDO

Proibições não são gosto. Cada uma descreve algo que o usuário **já viu
dar errado** — nesta ou em outra sessão, com este ou com outro modelo. É
um sintoma diagnosticado, escrito para não se repetir.

"Sem roxo/violeta" quase nunca é sobre a cor: é sobre o visual genérico de
template que já apareceu antes. "Sem `transition-all`" não é purismo: é
jank medido. Leia cada proibição perguntando *o que aconteceu para isso
virar regra* — a resposta costuma indicar o padrão inteiro a evitar, não
só a instância citada.

Antes de entregar, **releia a lista de PROIBIDO e confira uma por uma**,
com a prova de cada, do mesmo jeito que os critérios verificáveis. Entregar
com uma proibição violada custa mais confiança do que qualquer feature vale.

## 4. Diagnóstico medido que o usuário trouxe não se re-mede — se usa

Se o briefing traz números que o usuário levantou ("o hero tem 320px de
padding", "são 47 ocorrências dessa classe", "o contraste do rodapé está
em 3.1:1"), **não gaste chamadas de ferramenta reproduzindo a medição**.
Ele já pagou por esse trabalho. Refazer é caro e não gera informação nova.

Verifique apenas dois casos:

- O que for **barato** (um grep de uma linha que confirma de graça).
- O que parecer **contraditório com o código** — se o briefing diz uma
  coisa e o arquivo diz outra, aí sim vale a checagem, e a divergência
  vira item de reporte, não correção silenciosa.

Isso é aplicação direta de [[token-economy]]: o contexto gasto
reproduzindo diagnóstico é contexto que falta na hora da decisão difícil.

## 5. Quando criar subagente e quando não

O corte é **amplitude versus profundidade**:

- **Amplitude → subagente, em paralelo.** Varrer arquivos, achar todas as
  ocorrências de um padrão, migração mecânica repetitiva espalhada por
  muitos arquivos, auditoria contra critérios objetivos. A tarefa é
  fechada, a saída é um achado.
- **Profundidade → inline.** Decidir a escala tipográfica, escolher a
  paleta, resolver um trade-off entre duas restrições que se chocam. A
  decisão precisa do contexto inteiro do briefing, e um subagente começa
  frio — ele redescobriria o que você já sabe, pior e mais caro.

Regra dura: **nunca delegue dois subagentes que editam o MESMO arquivo.**
Eles não se enxergam; o segundo write sobrescreve o primeiro sem erro
nenhum e o conflito só aparece muito depois, como bug. Particione por
arquivo, ou serialize.

## 6. Quando vale criar um agente ou skill novo

Só quando o conhecimento **se repete** e é **caro de redescobrir**.

- **Agente novo se paga** quando a tarefa se repete com o mesmo formato de
  entrada e o mesmo formato de saída. É isso que dá para encapsular: o
  contrato, não a inteligência.
- **Skill nova se paga** quando o custo foi de **descoberta** — redescobrir
  o formato de um cookie, um flag obscuro de CLI, uma pegadinha de
  ambiente que consumiu oito chamadas até funcionar. O valor está em não
  pagar de novo.
- **Decisão de produto não é skill.** "Sem emoji em conteúdo de IA", "sem
  treemap" — isso é decisão registrada (aqui, na skill
  `decisoes-prepenem`), não conhecimento processual.

E o contrário, explícito: **não crie agente para tarefa que acontece uma
vez.** O custo de escrever, versionar e manter o agente é maior que rodar
a tarefa inline uma única vez.

## 7. Ordem de execução que evita retrabalho

1. **Fundação compartilhada primeiro** — tokens, tipos, schema, utilitários.
   Tudo que várias telas vão consumir.
2. **Uma superfície de prova.** Uma tela só, a mais representativa,
   implementada até o fim contra os critérios verificáveis.
3. **Aprovação.** Mostra medida, não adjetivo (ver item 8).
4. **Só então propagação** para as demais telas.

Propagar antes da aprovação multiplica o retrabalho pelo número de telas.
Um ajuste de direção que custaria uma tela passa a custar oito — e o
usuário, que teria dito "muda isso" de graça no passo 3, agora precisa
revisar oito diffs.

## 8. Reporte com medição, não com adjetivo

"Contraste 7.2:1" em vez de "boa legibilidade". "Zero ocorrências de
`transition-all`" em vez de "performance cuidada". "Escala de 14px a 72px,
razão 1.33" em vez de "hierarquia forte".

Adjetivo não é verificável e transfere para o usuário o trabalho de
conferir. Número é conferível em um segundo.

**Quando um critério falhar, diga que falhou e mostre o número.** Um
critério reprovado e reportado é informação; um critério reprovado e
omitido é o bug que o usuário descobre depois, junto com a descoberta de
que o relatório não é confiável. Se um critério não pôde ser medido, diga
isso também — "não medido" é um resultado honesto, "passou" sem medição
não é.

## Fechamento

Antes de dizer que terminou, releia as três listas do item 1: restrições
travadas intactas, critérios verificáveis com número ao lado, proibições
conferidas uma a uma. O que ficou como direção subjetiva vira a pergunta
que acompanha a entrega — é ali, e só ali, que a opinião do usuário ainda
é necessária.
