#!/bin/bash
# commit-guard.sh — bloqueia `git commit` se a última checagem de tipos falhou
#
# TRIGGER: PreToolUse, matcher "Bash"
#
# Lê o estado gravado por typecheck.sh. Falha aberta de propósito: sem
# estado (clone novo, node_modules apagado, nenhuma edição .ts ainda nesta
# sessão) o commit passa — o objetivo é impedir commit sobre erro CONHECIDO,
# não exigir uma checagem prévia que talvez nunca tenha rodado.
set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0

INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$CMD" ] && exit 0

printf '%s' "$CMD" | grep -qE '(^|[;&|[:space:]])git[[:space:]]+commit([[:space:]]|$)' || exit 0

STATE_FILE="node_modules/.cache/prepenem-typecheck.state"
[ -f "$STATE_FILE" ] || exit 0

if [ "$(cat "$STATE_FILE" 2>/dev/null)" = "FAIL" ]; then
  cat >&2 <<'EOF'
[commit-guard] BLOQUEADO: a última checagem de tipos falhou.

Corrija os erros de tipo e edite qualquer .ts/.tsx para revalidar (o hook
typecheck roda de novo e libera), ou rode manualmente:

  node_modules/.bin/tsc --noEmit --pretty false --incremental \
    --tsBuildInfoFile node_modules/.cache/tsc-hook.tsbuildinfo \
    && echo PASS > node_modules/.cache/prepenem-typecheck.state
EOF
  exit 2
fi

exit 0
