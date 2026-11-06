"""Aplica o /doctor de 06/11/2026 no ~/.claude/settings.json.

Desliga 4 plugins sem uso e põe o modo automático como padrão.
Sem --aplicar só mostra o que mudaria. Backup antes de gravar.
Desfazer: copiar o backup de volta (o caminho aparece no fim).
"""
import json
import shutil
import sys
import time
from pathlib import Path

ARQ = Path.home() / ".claude" / "settings.json"
PLUGINS_SEM_USO = [
    "code-simplifier@claude-plugins-official",
    "frontend-design@claude-plugins-official",
    "code-review@claude-code-plugins",
    "pdf-viewer@synced",
]
APLICAR = "--aplicar" in sys.argv


def main():
    s = json.loads(ARQ.read_text())
    plugins = dict(s.get("enabledPlugins") or {})
    for p in PLUGINS_SEM_USO:
        print(f"plugin {p}: {plugins.get(p)} -> False")
        plugins[p] = False
    perm = dict(s.get("permissions") or {})
    print(f"permissions.defaultMode: {perm.get('defaultMode')} -> auto")
    perm["defaultMode"] = "auto"
    novo = {**s, "enabledPlugins": plugins, "permissions": perm}
    if not APLICAR:
        print("\nModo de teste: nada mudou. Para aplicar: python3 scripts/claude-config/doctor.py --aplicar")
        return
    backup = ARQ.with_name(f"settings.json.bak-doctor-{time.strftime('%Y%m%d-%H%M%S')}")
    shutil.copy2(ARQ, backup)
    tmp = ARQ.with_suffix(".tmp")
    tmp.write_text(json.dumps(novo, indent=2, ensure_ascii=False) + "\n")
    json.loads(tmp.read_text())
    tmp.replace(ARQ)
    print(f"\nFeito. Backup em {backup}. Feche e abra o Claude Code para valer.")


if __name__ == "__main__":
    main()
