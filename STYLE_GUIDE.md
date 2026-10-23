# Guia de estilo — onde está a verdade

Este arquivo só aponta. Até 23/10/2026 ele repetia fontes e escala do design
antigo (Plus Jakarta Sans, `text-4xl`…) e mandava fazer errado. Regra repetida
aqui apodrece; por isso cada coisa tem uma casa só:

| O quê | Onde |
|-------|------|
| Tokens (cor, raio, sombra, escala de texto `--type-*`) | `app/globals.css` |
| Como cada peça fica na tela, nos dois modos | rota `/design-system` |
| Decisões fechadas (cor teal "Clareza", explicação em passos, dado esparso, sem treemap…) | skill `decisoes-prepenem` |
| Movimento | skill `animation-system` |

## O que vale hoje (conferido no código em 23/10/2026)

- **Fontes** (`app/layout.tsx`): Fraunces (`font-display`, título), Source Serif 4
  (`font-reading`, leitura), DM Sans (`font-sans`, interface), JetBrains Mono (`font-mono`).
- **Texto:** classes `type-caption`, `type-meta`, `type-body`, `type-lead`, `type-display`,
  não a escala crua do Tailwind.
- **Raio:** `--radius-control` (8 px, clicável) e `--radius-surface` (14 px, card).
- **Cor:** `--primary` é preenchimento; texto da cor primária usa `--primary-text` (contraste AA).
- **Movimento** só em `transform`/`opacity`; nada de `transition-all`.
- **Layout raiz** (`app/layout.tsx`): `Providers`, `AppLayout`, `ChunkLoadErrorHandler`
  (evita a corrida do ChunkLoadError) e `FocoTeclado`. Não tirar sem motivo.
