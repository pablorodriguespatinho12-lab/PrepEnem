# PrepEnem

## Stack
Next.js 14 (App Router) + React 18 + TypeScript 5 + Tailwind CSS 3 +
Framer Motion 11 + Prisma 5 + NextAuth 4 + Neon (Postgres).

## Estrutura
```
app/          # rotas (App Router)
components/   # componentes (inclui shadcn/ui)
data/         # dados estáticos
hooks/        # hooks customizados
lib/          # utilitários e clientes (prisma, auth)
prisma/       # schema.prisma (sem migrations, usa `db push`)
scripts/      # seeds e scripts de manutenção
types/        # tipos compartilhados
```

## Convenções
- Nomes de campos/models de domínio em português (`enunciado`, `materia`,
  `dificuldade`, `precisaRevisar` etc.) — siga o padrão já existente.
- UI com Tailwind + componentes shadcn/ui; evite CSS solto quando já existe
  primitiva shadcn equivalente.
- Antes de qualquer commit, rode `npm run build` (roda `prisma generate` +
  `next build`) e resolva os erros antes de seguir.

## /compact
Ao resumir, preserve: decisões de schema do Prisma, erros de build já vistos
e a solução aplicada. Descarte: exploração de arquivos já concluída e
navegação que não gerou decisão.
