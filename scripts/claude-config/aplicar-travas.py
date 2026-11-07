#!/usr/bin/env python3
"""Instala as 2 travas de 06/11/2026 no .claude do PrepEnem.

1. verificar-antes-de-parar.sh (Stop): não deixa o Claude encerrar com erro de
   tipo ou teste quebrado nos .ts/.tsx mudados.
2. sugerir-skills.py (UserPromptSubmit): diz ao Claude quais skills servem ao pedido.

Uso: python3 scripts/claude-config/aplicar-travas.py
Copia os arquivos para .claude/hooks/, registra no .claude/settings.json (com
backup ao lado) e rodar 2x não duplica nada. Vale depois de reabrir o Claude Code.
Para testar sem mexer no projeto: PREPENEM_RAIZ=<pasta de teste>.
"""
import json
import os
import shutil
import stat
import sys
from datetime import datetime
from pathlib import Path

ORIGEM = Path(__file__).resolve().parent
RAIZ = Path(os.environ.get("PREPENEM_RAIZ", ORIGEM.parent.parent))
HOOKS = RAIZ / ".claude/hooks"
SETTINGS = RAIZ / ".claude/settings.json"

ARQUIVOS = ["verificar-antes-de-parar.sh", "sugerir-skills.py", "skill-rules.json"]
TRAVAS = {
    "Stop": "$CLAUDE_PROJECT_DIR/.claude/hooks/verificar-antes-de-parar.sh",
    "UserPromptSubmit": "python3 -I $CLAUDE_PROJECT_DIR/.claude/hooks/sugerir-skills.py",
}


def copiar() -> None:
    HOOKS.mkdir(parents=True, exist_ok=True)
    for nome in ARQUIVOS:
        destino = HOOKS / nome
        shutil.copy2(ORIGEM / nome, destino)
        if nome.endswith((".sh", ".py")):
            destino.chmod(destino.stat().st_mode | stat.S_IXUSR)
        print(f"copiado: .claude/hooks/{nome}")


def registrar() -> bool:
    config = json.loads(SETTINGS.read_text()) if SETTINGS.exists() else {}
    hooks = config.setdefault("hooks", {})
    mudou = False
    for evento, comando in TRAVAS.items():
        lista = hooks.setdefault(evento, [])
        ja_tem = any(h.get("command") == comando for m in lista for h in m.get("hooks", []))
        if ja_tem:
            print(f"{evento}: já estava")
            continue
        lista.append({"hooks": [{"type": "command", "command": comando}]})
        print(f"{evento}: registrado")
        mudou = True
    if mudou:
        if SETTINGS.exists():
            backup = SETTINGS.with_name(f"settings.json.bak-travas-{datetime.now():%Y%m%d-%H%M%S}")
            shutil.copy2(SETTINGS, backup)
            print(f"backup: {backup.name}")
        SETTINGS.write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n")
    return mudou


def main() -> int:
    if not (ORIGEM / ARQUIVOS[0]).exists():
        print("Não achei os arquivos das travas. Nada mudou.")
        return 1
    copiar()
    mudou = registrar()
    print("\nFeito. Feche e abra o Claude Code para valer." if mudou else "\nJá estava instalado.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
