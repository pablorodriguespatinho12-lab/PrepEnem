"""Faz o branch-guard olhar só o trecho `git push ...` do comando.

Antes: num comando que começava com `git push`, qualquer "main" no resto
(ex.: `gh pr create --base main`) era barrado. Push direto na main e
force-push continuam barrados.

Rodar: ! python3 scripts/claude-config/branch-guard-so-push.py
"""
from pathlib import Path

ARQ = Path.home() / ".claude/hooks/branch-guard.sh"
ANTIGO = 'if printf \'%s\' "$COMMAND" | grep -qwE "origin\\s+${branch}|${branch}\\s|${branch}$"; then'
NOVO = 'if printf \'%s\' "$PUSH_PART" | grep -qwE "origin\\s+${branch}|${branch}\\s|${branch}$"; then'
MARCA = 'PROTECTED="${CC_PROTECT_BRANCHES:-main:master}"'
TRECHO = MARCA + '\n# só o trecho do push, até ; & ou | (16/11/2026)\nPUSH_PART=$(printf \'%s\' "$COMMAND" | grep -oE \'git\\s+push[^;&|]*\' | head -1)'

texto = ARQ.read_text()
if "PUSH_PART" in texto:
    print("Já estava aplicado.")
else:
    assert texto.count(ANTIGO) == 1, "regra antiga não encontrada 1 vez"
    assert texto.count(MARCA) == 1, "linha PROTECTED não encontrada 1 vez"
    texto = texto.replace(ANTIGO, NOVO).replace(MARCA, TRECHO)
    ARQ.write_text(texto)
    print("Pronto: branch-guard agora olha só o git push.")
