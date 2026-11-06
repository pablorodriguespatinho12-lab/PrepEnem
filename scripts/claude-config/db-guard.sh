#!/bin/bash
# db-guard.sh — avisa antes de qualquer operação que toque o banco
#
# TRIGGER: PreToolUse, matcher "Bash"
#
# Neste projeto o Neon é O MESMO banco em dev e em produção. Não existe
# banco de desenvolvimento separado — qualquer script que escreve, escreve
# em produção. Descoberto quando scripts/generate-question-images.ts
# atualizou produção antes do deploy correspondente.
#
# Para prosseguir conscientemente, repita o comando com DB_CONFIRMED=1:
#   DB_CONFIRMED=1 npx tsx scripts/foo.ts
set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0

INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$CMD" ] && exit 0

# Acknowledgment explícito já dado.
printf '%s' "$CMD" | grep -q 'DB_CONFIRMED=1' && exit 0

TOUCHES_DB=""
printf '%s' "$CMD" | grep -qE 'prisma[[:space:]]+(db[[:space:]]+(push|pull|execute|seed)|migrate|studio)' && TOUCHES_DB="comando prisma"
printf '%s' "$CMD" | grep -qE '(^|[;&|[:space:]])psql([[:space:]]|$)' && TOUCHES_DB="psql"
printf '%s' "$CMD" | grep -qE '(tsx|ts-node|node)[[:space:]]+[^[:space:]]*scripts/' && TOUCHES_DB="script em scripts/"

[ -z "$TOUCHES_DB" ] && exit 0

# `db pull --print` só lê o schema (a skill prisma-neon-safety manda rodar).
# Barrá-lo custou 3 voltas em 7 dias. Passa se nada mais no comando toca o banco.
if printf '%s' "$CMD" | grep -qE 'prisma[[:space:]]+db[[:space:]]+pull[[:space:]]+--print' \
  && ! printf '%s' "$CMD" | grep -qE 'db[[:space:]]+(push|execute|seed)|migrate|studio|psql|(tsx|ts-node|node)[[:space:]]'; then
  exit 0
fi

cat >&2 <<EOF
[db-guard] ATENÇÃO: $TOUCHES_DB — o Neon é o MESMO banco de dev e de produção.

Não existe banco de desenvolvimento separado neste projeto. Se este comando
escreve, ele escreve em produção agora, antes de qualquer deploy.

Antes de prosseguir, confirme:
  - a operação é de leitura, ou é aditiva/tem where restritivo?
  - se escreve: o usuário está ciente de que isso atinge produção?
  - schema.prisma está em sinc com o banco? (skill prisma-neon-safety)

Para executar mesmo assim, repita o comando com o acknowledgment explícito:
  DB_CONFIRMED=1 <comando>

Só leitura (SELECT)? Use o MCP neon run_sql: é só-leitura e não passa por aqui.
EOF
exit 2
