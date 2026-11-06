#!/bin/bash
# comment-strip.sh (versão consertada em 06/11/2026)
#
# Tira SÓ os comentários do começo do comando (antes da primeira linha de
# verdade), para a lista de permissões enxergar o comando real.
#
# A versão antiga apagava toda linha em branco e toda linha com # do comando
# inteiro, inclusive dentro de heredoc e de texto entre aspas. Isso deixou o
# schema.prisma inválido, grudou o corpo dos commits no título e comeu
# títulos de markdown.

INPUT=$(cat)
COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

[[ -z "$COMMAND" ]] && exit 0

# Apaga linhas de comentário/branco só até a primeira linha que não é comentário.
CLEAN=$(printf '%s' "$COMMAND" | awk 'started || !/^[[:space:]]*(#.*)?$/ { started=1; print }')

[[ "$CLEAN" == "$COMMAND" || -z "$CLEAN" ]] && exit 0

jq -n --arg cmd "$CLEAN" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    updatedInput: { command: $cmd }
  }
}'
