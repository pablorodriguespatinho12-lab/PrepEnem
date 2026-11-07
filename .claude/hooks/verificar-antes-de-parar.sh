#!/bin/bash
# verificar-antes-de-parar.sh — não deixa o Claude dizer "pronto" com código quebrado
#
# TRIGGER: Stop (quando o Claude vai encerrar a resposta)
#
# Por que (06/11/2026): a regra "provar antes de afirmar" vivia só no CLAUDE.md,
# e regra escrita o Claude segue quase sempre; hook o programa obriga sempre.
# Ideia vinda do GitHub (verify-before-stop, claude-code-loop-patterns).
#
# O que faz: se há .ts/.tsx mudados desde o último commit, roda tsc incremental
# (1-3 s, o mesmo de typecheck.sh) e os testes vitest ligados a esses arquivos.
# Falhou -> exit 2: o erro volta para o Claude e ele tem de continuar.
#
# Proteções:
#  - stop_hook_active=true (já está continuando por causa deste hook): sai 0,
#    senão vira laço infinito.
#  - nada mudado, ou o mesmo conjunto de mudanças já passou: sai 0 sem rodar.
#  - falha aberta: sem jq, git, tsc ou vitest, sai calado.
set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0
command -v git >/dev/null 2>&1 || exit 0

INPUT=$(cat)
[ "$(printf '%s' "$INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null)" = "true" ] && exit 0

# Só age dentro deste projeto.
[ -f "package.json" ] || exit 0
grep -q '"prepenem"' package.json 2>/dev/null || exit 0

MUDADOS=$( { git diff --name-only HEAD 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null; } \
  | grep -E '\.(ts|tsx)$' | sort -u | while read -r f; do [ -f "$f" ] && echo "$f"; done )
[ -z "$MUDADOS" ] && exit 0

STATE_DIR="node_modules/.cache"
mkdir -p "$STATE_DIR" 2>/dev/null || exit 0
ASSINATURA=$(printf '%s\n' "$MUDADOS" | xargs cat 2>/dev/null | md5sum | cut -d' ' -f1)
JA_PASSOU="$STATE_DIR/prepenem-parada.ok"
[ -f "$JA_PASSOU" ] && [ "$(cat "$JA_PASSOU")" = "$ASSINATURA" ] && exit 0

TSC="node_modules/.bin/tsc"
VITEST="node_modules/.bin/vitest"
[ -x "$TSC" ] || exit 0

TIPOS=$(timeout 90 "$TSC" --noEmit --pretty false --incremental \
  --tsBuildInfoFile "$STATE_DIR/tsc-hook.tsbuildinfo" 2>&1 | grep -E "error TS[0-9]+" | head -10)
if [ -n "$TIPOS" ]; then
  echo "FAIL" > "$STATE_DIR/prepenem-typecheck.state"
  {
    echo "[verificar-antes-de-parar] Erro de tipo nos arquivos mudados. Conserte antes de dizer que está pronto:"
    printf '%s\n' "$TIPOS"
  } >&2
  exit 2
fi
echo "PASS" > "$STATE_DIR/prepenem-typecheck.state"

if [ -x "$VITEST" ]; then
  # shellcheck disable=SC2086
  TESTES=$(timeout 120 "$VITEST" related --run --passWithNoTests $(printf '%s ' $MUDADOS) 2>&1)
  CODIGO=$?
  if [ $CODIGO -ne 0 ] && [ $CODIGO -ne 124 ]; then
    {
      echo "[verificar-antes-de-parar] Teste falhando ligado aos arquivos mudados. Conserte antes de dizer que está pronto:"
      printf '%s\n' "$TESTES" | grep -E "FAIL|×|AssertionError|Expected|Received" | head -12
    } >&2
    exit 2
  fi
fi

echo "$ASSINATURA" > "$JA_PASSOU"
exit 0
