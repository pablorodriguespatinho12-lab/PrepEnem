# Como melhorar o Claude — parte 2 (06/11/2026)

A parte 1 (`pesquisa-melhorar-claude-2026-11.md`) juntou dicas da web.
Esta parte olha **o que deu errado de verdade**: 22 conversas de 31/10 a 06/11.

## O que mais custou

| Erro visto | Vezes | Causa | Conserto |
|---|---|---|---|
| Safety Net barra o comando | 13 | começar com `S=/caminho && cat > $S/x <<'EOF'`: a análise do comando quebra e ele falha fechado | criar o arquivo com Write e rodar numa linha simples (memória `guardas-que-barram`) |
| db-guard barra | 7 | barra `tsx scripts/` e até `prisma db pull --print`, que a skill `prisma-neon-safety` manda rodar | leitura pelo MCP `neon` (só-leitura); hook melhorado pronto em `scripts/claude-config/db-guard.sh` |
| Vercel "projeto não encontrado" | 3 | `.vercel/project.json` com ID de projeto apagado | **corrigido** para `prep-enem` (`prj_lrUuqul…`) |
| Classificador barra | 9 | `gh pr`, mexer em `~/.claude` e em hooks | é de propósito: deixar pronto, o Pablo roda com `!` |

Correções do Pablo em palavras: só 9 frases, quase todas "continua" (retomar
onde parou). O aviso de pendências no início já cobre isso.

## Novidades do Claude Code que valem (fonte: terceiros, conferir)

- **`/doctor` aponta linha do CLAUDE.md que o Claude acharia lendo o código** (v2.1.206).
  Versão aqui: 2.1.319, já tem.
- O modo automático **pausa depois de 3 barradas seguidas ou 20 na sessão** — mais um motivo
  para acertar o caminho de primeira.
- O índice `MEMORY.md` só carrega as **200 primeiras linhas**. O nosso tem 42: folga.

## O que fica para o Pablo

1. Trocar o hook do banco pela versão que deixa `db pull --print` passar:
   `! cp scripts/claude-config/db-guard.sh .claude/hooks/db-guard.sh`
   (testar antes de confiar: o teste automático também foi barrado).
2. Rodar `/doctor` uma vez e ver o que ele diz do CLAUDE.md.

## Fontes

- https://dev.classmethod.jp/en/articles/20260710-cc-updates-v2-1-206/
- https://claudelog.com/faqs/what-is-auto-mode-in-claude-code/
- https://www.dsebastien.net/claude-code-auto-mode/
- https://israynotarray.com/en/ai/2026/03/30/claude-code-auto-memory-complete-guide/
