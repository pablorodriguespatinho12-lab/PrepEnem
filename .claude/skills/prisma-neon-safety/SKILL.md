---
name: prisma-neon-safety
description: "Use antes de qualquer operação que leia ou escreva no banco Neon, ou que altere schema.prisma."
---

# Segurança Prisma + Neon neste projeto

## Este projeto NÃO usa migrations

Não existe `prisma/migrations/`. Sincronização de schema é feita com:

```bash
npx prisma db push
```

Nunca sugira `prisma migrate dev` ou `prisma migrate deploy` — não há
histórico de migrations para eles operarem.

## Bug já visto (2026-07-31)

O banco real ficou dessincronizado do `schema.prisma`: faltavam as colunas
`Question.nivel` e `Question.geradaPorIA`, causando erro em runtime
(`The column ... does not exist in the current database`) mesmo com o
Prisma Client gerado corretamente. A causa era simplesmente nunca ter
rodado `db push` após editar o schema.

**Só ler dados (SELECT, contar, conferir)?** Use o MCP `neon` (`run_sql`, só-leitura):
o `db-guard` barra `tsx scripts/` e `db pull` (7 voltas perdidas em 7 dias, nov/2026).

**Sempre, antes de rodar qualquer script que leia/escreva no banco:**

```bash
npx prisma migrate status      # não é confiável aqui (sem migrations) — use como sinal fraco
npx prisma db pull --print     # mostra o schema REAL do banco
# compare manualmente com prisma/schema.prisma
```

Se houver divergência, rode `npx prisma db push` (aditivo — cria/ajusta
colunas, não apaga dados) antes de prosseguir.

## Dados que NUNCA podem ser apagados sem confirmação explícita

- Tabela `Question`: **719 questões** importadas manualmente do Abacus AI
  (não são regeráveis por um seed automático).
- Tabela `Flashcard`/`FlashcardDeck` depois do seed de flashcards (663+
  cards por matéria vindos de `scripts/data/`).

Qualquer `DROP`, `TRUNCATE`, `deleteMany` sem `where` restritivo, ou
`prisma db push --force-reset` nessas tabelas exige confirmação explícita
do usuário antes de executar — mesmo que a tarefa peça "resetar" outra
coisa (ex.: contas de usuário). Ao resetar Users/sessions em cascata,
audite o `onDelete` de cada relação no schema antes de rodar, para
confirmar que o cascade não alcança `Question` ou `Flashcard`.

## Checklist antes de escrever no banco

1. `npx prisma db pull --print` (ou `db-inspector` agent) e comparar com o
   schema do repo.
2. Rodar `npx prisma generate` se o client estiver desatualizado.
3. Confirmar que a operação é aditiva ou tem `where` restritivo.
4. Só então rodar o script de escrita.
