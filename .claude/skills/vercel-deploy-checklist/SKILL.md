---
name: vercel-deploy-checklist
description: "Use antes de fazer commit/push ou quando um build da Vercel falhar."
---

# Checklist de Deploy na Vercel — PrepEnem

**O site do ar é o projeto `prep-enem`** (`prj_lrUuqulABBSD8EHjCoxo1uvIZGNd`,
time `team_a7PD1Od3lH4xFGeqesETzANl`). O `.vercel/project.json` aponta para um
projeto antigo (`prepenem.app`) que a API responde 404: para ver se o push já
publicou, liste os deploys do `prep-enem` e confira o `githubCommitSha`.

Erros que **já aconteceram** neste projeto e a causa raiz confirmada:

## 1. `next.config.js` deve ficar vazio/mínimo

`outputFileTracingRoot` já causou falha de build na Vercel (commit
`9658066`). O arquivo correto hoje está vazio (0 linhas). Não adicione
`outputFileTracingRoot`, `output: 'standalone'` ou outras opções de tracing
sem testar deploy real antes — a Vercel já tem seu próprio root detection.

## 2. `prisma/schema.prisma` precisa de `binaryTargets` corretos

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

Sem `rhel-openssl-1.0.x`, o Prisma Client gerado localmente não roda no
runtime da Vercel (Lambda). Não remova esse binaryTarget. Não adicione
`output` no `datasource`/`generator` sem necessidade comprovada.

## 3. Dependências que já faltaram no `package.json`

Se o build falhar com "Module not found" para algum destes, é porque foram
adicionados fora de ordem em relação ao código que os usa — confirme que
estão em `dependencies` (não só instalados localmente):

- `pdfjs-dist`
- `tailwindcss-animate`
- `gsap`
- `three`, `canvas-confetti`

## 4. Arrays vazios em TypeScript precisam de tipo explícito

`noImplicitAny` está **desativado** (`false`) no `tsconfig.json` — foi uma
solução temporária para destravar um build (commit `0e61573`), não o ideal.
Mesmo assim, declare tipos explícitos em arrays vazios para evitar
regressões quando `noImplicitAny` for reativado:

```ts
// Errado (já causou erro de build antes)
const cardIds = [];

// Correto
const cardIds: string[] = [];
```

## Antes de cada commit/push

1. `npm run build` local (roda `prisma generate && next build`) — nunca
   empurre sem isso passar. Use o subagent `build-guard` para isso.
2. Se o build falhar, confira nesta ordem: (1) `next.config.js` não tem
   opções novas, (2) `schema.prisma` tem os `binaryTargets`, (3) toda
   dependência nova usada no código está no `package.json`, (4) nenhum
   array/objeto vazio sem tipo explícito no diff.
3. Commits pequenos e temáticos — um build que falha é mais fácil de
   isolar quando o commit é pequeno.
