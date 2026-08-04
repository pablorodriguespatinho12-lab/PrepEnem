#!/bin/bash
# push-guard.sh — impede `git push` que não leva nada
#
# TRIGGER: PreToolUse, matcher "Bash"
#
# Incidente que originou o hook (2026-08-03): o trabalho do dia inteiro
# ficou solto na árvore, nunca foi commitado. O push "funcionou" (exit 0,
# "Everything up-to-date"), produção continuou com código antigo, e se
# perdeu tempo achando que o deploy tinha falhado.
#
# Neste repo `main` NÃO tem upstream configurado (branch.main.merge vazio),
# mas origin/main existe — então checar só `@{u}` falharia aberto justamente
# no caso que o hook existe para pegar. Por isso o fallback para
# origin/<branch>. Sem nenhuma das duas referências (branch nova de
# verdade), deixa passar.
set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0

INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$CMD" ] && exit 0

printf '%s' "$CMD" | grep -qE '(^|[;&|[:space:]])git[[:space:]]+push([[:space:]]|$)' || exit 0

git rev-parse --git-dir >/dev/null 2>&1 || exit 0

UPSTREAM=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)

if [ -z "$UPSTREAM" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)
  [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ] && exit 0
  git rev-parse --verify --quiet "origin/$BRANCH" >/dev/null 2>&1 || exit 0
  UPSTREAM="origin/$BRANCH"
fi

AHEAD=$(git rev-list --count "$UPSTREAM..HEAD" 2>/dev/null) || exit 0

if [ "$AHEAD" = "0" ]; then
  DIRTY=$(git status --porcelain 2>/dev/null | head -10)
  {
    echo "[push-guard] BLOQUEADO: nenhum commit novo em relação a $UPSTREAM."
    echo "Este push não levaria nada — produção continuaria com o código atual."
    if [ -n "$DIRTY" ]; then
      echo ""
      echo "Há trabalho não commitado na árvore:"
      printf '%s\n' "$DIRTY"
      echo ""
      echo "Provável causa: o trabalho não foi commitado. Commite antes de empurrar."
    fi
  } >&2
  exit 2
fi

exit 0
