# Como melhorar o Claude — parte 5: raio-x das 56 sessões (06/11/2026, noite)

**Resposta curta:** o maior desperdício eram 2 ganchos quebrados que rodam sempre:
**1.932 s jogados fora** (32 min) e **3.567 alarmes falsos**. O conserto está pronto em
`scripts/claude-config/aplicar-raio-x.py`, testado numa cópia. O Pablo roda:

```
! python3 scripts/claude-config/aplicar-raio-x.py
```

Diferente das partes 1 a 4 (a comunidade e as docs), esta olha **para dentro**: as 56 sessões
gravadas de 9 projetos (`~/.claude/projects/*/*.jsonl`), lidas por `scripts/claude-config/raio-x.py`.

## Números

| O que | Medido | O que fazer |
|---|---|---|
| `syntax-check.sh` (cada edição) | 4.317 s em 449 vezes (9,6 s cada) | já consertado de manhã (0,009 s) |
| `api-error-alert.sh` (cada parada) | 1.656 s em 1.055 vezes; lê `.stop_reason`, que não existe; log com 1.254 linhas "unknown" | **tirar** |
| `context-monitor.sh` (cada ferramenta) | 276 s em 3.703 vezes; **3.567 saídas "EMERGENCY: Context remaining 0%"** falsas | **tirar** (o Claude Code já compacta sozinho) |
| Safety Net (plugin) | barrou 41: 29 heredocs que ele não soube ler; 9 destrutivos reais que o destructive-guard não cobre (`git checkout --`, `stash drop`, `worktree --force`) | **manter**; a regra "Write em vez de heredoc" já existe (último caso: 02/11) |
| Ganchos do projeto (db-guard 17, commit-guard 9) | bloqueios de propósito | manter |
| Correções reais do Pablo | 12 (regra conferida à mão); 4 logo após um "pronto" de tela; 2 de "não apareceu" num passo que ele fazia | 2 linhas no `~/.claude/CLAUDE.md` |
| Interrupções do Pablo | 32; em 19 eu rodava um Bash | próxima medição: quais comandos e quanto duravam |
| Sessões que estouraram o contexto | 13 de 56 | — |
| Scripts mortos em `~/.claude/hooks/` | 5 scripts, `hooks.json` do ECC (28 ganchos inertes), `ecc/` (93 MB) | mover para `~/.claude/hooks-desligados/` |
| Changelog oficial | 2.1.319 já é a última versão | nada a instalar |

## O que entrou
- `scripts/claude-config/raio-x.py`: ganchos (tempo), bloqueios, erros, recusas, interrupções e correções (`--correcoes` mostra minha última frase antes de cada uma).
- `scripts/claude-config/aplicar-raio-x.py`: tira os 2 ganchos do `settings.json` (com cópia) e **move** (não apaga) os mortos. Testado em cópia: a 2ª rodada diz "Nada a fazer"; as outras chaves do `settings.json` ficam iguais.
- `~/.claude/CLAUDE.md`: "pronto" de tela diz se ele já vê ou falta push; passo de tela vem com o plano B; heredoc com o número; `grep` aqui é o ugrep.

## O que ficou de fora
- Desligar o Safety Net: protege 9 casos que nada mais cobre.
- Mexer no `roda-lint.sh` do logica-app (7,8 s): só roda com mudança sem commit, de propósito.
- `permissions.denyInsteadOfPrompting` (2.1.319): negaria sem perguntar; com o Pablo dormindo seria útil, mas muda permissão; avaliar depois.

## Segunda opinião (Antigravity, `agy -p`)
Concordou com as 5 decisões. Sugeriu medir interrupções (feito: 32) e tokens de entrada contra correções (fica para a próxima).

## Fontes
- 56 sessões em `~/.claude/projects/` (06/10 a 06/11/2026).
- https://code.claude.com/docs/en/changelog (lido em 06/11; 2.1.319 é a última).
