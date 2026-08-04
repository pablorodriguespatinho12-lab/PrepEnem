#!/bin/bash
# typecheck.sh — checagem de tipos após edição de .ts/.tsx
#
# TRIGGER: PostToolUse, matcher "Edit|Write"
#
# Por que tsc e não `npm run build`: o build completo deste projeto leva
# 60-70s (medido). Rodar isso a cada Edit, com edições chegando em lote de
# 3-5, tornaria o fluxo inviável. `tsc --noEmit --incremental` faz a mesma
# checagem de tipos em 1-3s reaproveitando o .tsbuildinfo. O build completo
# continua sendo responsabilidade do agente build-guard antes do commit —
# e commit-guard.sh bloqueia o commit se ESTA checagem estiver falhando.
#
# Nunca bloqueia a edição em si (PostToolUse já rodou); reporta o erro pro
# Claude via exit 2. Falha aberta: se tsc/jq não existir, sai calado.
set -uo pipefail

STATE_DIR="node_modules/.cache"
STATE_FILE="$STATE_DIR/prepenem-typecheck.state"

command -v jq >/dev/null 2>&1 || exit 0

INPUT=$(cat)
FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty' 2>/dev/null)
[ -z "$FILE" ] && exit 0

case "$FILE" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# Só age dentro deste projeto.
[ -f "package.json" ] || exit 0
grep -q '"prepenem"' package.json 2>/dev/null || exit 0

TSC="node_modules/.bin/tsc"
[ -x "$TSC" ] || exit 0

mkdir -p "$STATE_DIR" 2>/dev/null || exit 0

OUT=$(timeout 90 "$TSC" --noEmit --pretty false --incremental \
        --tsBuildInfoFile "$STATE_DIR/tsc-hook.tsbuildinfo" 2>&1)
CODE=$?

# timeout/tsc travado: não trava o fluxo nem grava estado enganoso.
if [ $CODE -eq 124 ]; then
  echo "[typecheck] tsc excedeu 90s e foi interrompido — estado não atualizado." >&2
  exit 0
fi

ERRORS=$(printf '%s' "$OUT" | grep -E "error TS[0-9]+" || true)

if [ -n "$ERRORS" ]; then
  echo "FAIL" > "$STATE_FILE"
  COUNT=$(printf '%s\n' "$ERRORS" | wc -l | tr -d ' ')
  {
    echo "[typecheck] $COUNT erro(s) de tipo — commit está bloqueado até resolver:"
    printf '%s\n' "$ERRORS" | head -20
    [ "$COUNT" -gt 20 ] && echo "  ... (+$((COUNT - 20)) erros)"
  } >&2
  exit 2
fi

echo "PASS" > "$STATE_FILE"
exit 0
