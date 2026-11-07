#!/usr/bin/env python3
"""Tira a parte .ts do hook ~/.claude/hooks/syntax-check.sh.

Por que: `npx tsc --noEmit arquivo.ts` levava 8 s por edição (pior 68 s,
~66 min/mês), ignorava o tsconfig do projeto, e o aviso saía com exit 0,
então o Claude nunca via. O erro de TypeScript continua pego pelo
`npm run build` antes de cada commit.

Uso: python3 scripts/claude-config/tirar-ts-do-syntax-check.py
Faz backup ao lado (syntax-check.sh.bak-AAAAMMDD-HHMMSS). Rodar 2x não muda nada.
"""
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

HOOK = Path.home() / ".claude/hooks/syntax-check.sh"
NOVO = """    ts)
        # Tirado em 06/11/2026: tsc num arquivo solto levava 8 s, ignorava o
        # tsconfig e o aviso nunca chegava ao Claude. O build pega o erro.
        ;;
"""

texto = HOOK.read_text()
if "Tirado em 06/11/2026" in texto:
    print("Já estava consertado. Nada mudou.")
    sys.exit(0)

padrao = re.compile(r"    ts\)\n.*?\n        ;;\n", re.S)
novo_texto, n = padrao.subn(NOVO, texto, count=1)
if n != 1:
    print("Não achei o trecho do .ts. Nada mudou.")
    sys.exit(1)

backup = HOOK.with_name(HOOK.name + ".bak-" + datetime.now().strftime("%Y%m%d-%H%M%S"))
shutil.copy2(HOOK, backup)
HOOK.write_text(novo_texto)
print("Feito. O hook não confere mais .ts (o resto segue igual).")
print("Vale na hora, sem fechar o Claude Code.")
