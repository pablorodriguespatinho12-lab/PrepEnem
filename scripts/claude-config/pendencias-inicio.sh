#!/bin/bash
# No começo de cada sessão, conta ao Claude a data, a hora, onde o Pablo parou
# (último commit e arquivos sem commit) e as pendências de ~/.claude/pendencias.md.
# Gancho: SessionStart. Assim o Pablo não precisa lembrar nem reexplicar.

PEND="$HOME/.claude/pendencias.md"
TXT="Hoje: $(date '+%d/%m/%Y %H:%M') (horário do Pablo)."

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  ULTIMO=$(git log -1 --format='%s (%cr)' 2>/dev/null)
  SUJOS=$(git status --porcelain 2>/dev/null | wc -l)
  RAMO=$(git branch --show-current 2>/dev/null)
  NAO_ENVIADOS=$(git rev-list --count '@{u}..HEAD' 2>/dev/null || echo "?")
  TXT="$TXT
Onde parou: ramo $RAMO; último commit: $ULTIMO; $SUJOS arquivo(s) sem commit; $NAO_ENVIADOS commit(s) sem push."
fi

if [[ -s "$PEND" ]]; then
  TXT="$TXT
Pendências do Pablo (de $PEND; mencionar só se tiver a ver com o pedido, e riscar o que ficar pronto):
$(head -c 2500 "$PEND")"
fi

jq -n --arg ctx "$TXT" '{ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: $ctx } }'
