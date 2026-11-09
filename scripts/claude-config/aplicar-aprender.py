#!/usr/bin/env python3
"""Liga o gancho global de aprender com o erro. O Pablo roda: ! python3 scripts/claude-config/aplicar-aprender.py

1. Copia detectar-correcao.py para ~/.claude/hooks/.
2. Acrescenta o gancho em UserPromptSubmit no ~/.claude/settings.json.

Guarda cópia do settings.json antes. Rodar 2x não muda nada.
Para testar numa cópia: CLAUDE_RAIZ=<pasta com settings.json e hooks/>.
Para desfazer: restaurar settings.json.bak-aprender-<data>.
"""
import json
import os
import shutil
from datetime import datetime
from pathlib import Path

RAIZ = Path(os.environ.get("CLAUDE_RAIZ", Path.home() / ".claude"))
SETTINGS = RAIZ / "settings.json"
ORIGEM = Path(__file__).with_name("detectar-correcao.py")
DESTINO = RAIZ / "hooks" / "detectar-correcao.py"
NOME = "detectar-correcao.py"


def com_gancho(config: dict, comando: str) -> dict:
    """Devolve uma cópia da configuração com o gancho; não muda a original."""
    ganchos = config.get("hooks", {})
    grupos = ganchos.get("UserPromptSubmit", [])
    novo_grupo = {"hooks": [{"type": "command", "command": comando}]}
    return {**config, "hooks": {**ganchos, "UserPromptSubmit": [*grupos, novo_grupo]}}


def ja_tem(config: dict) -> bool:
    grupos = config.get("hooks", {}).get("UserPromptSubmit", [])
    return any(NOME in str(h.get("command", "")) for g in grupos for h in g.get("hooks", []))


def main() -> None:
    config = json.loads(SETTINGS.read_text(encoding="utf-8"))
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ORIGEM, DESTINO)
    DESTINO.chmod(0o755)
    print(f"gancho copiado: {DESTINO}")
    if ja_tem(config):
        print("settings.json já tinha o gancho: nada mudou.")
        return
    copia = SETTINGS.with_name(f"settings.json.bak-aprender-{datetime.now():%Y%m%d-%H%M%S}")
    shutil.copy2(SETTINGS, copia)
    novo = com_gancho(config, f"python3 -I {DESTINO}")
    SETTINGS.write_text(json.dumps(novo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    json.loads(SETTINGS.read_text(encoding="utf-8"))
    print(f"gancho ligado. Cópia de segurança: {copia}")
    print("Vale nas próximas sessões. Para conferir: abra uma sessão nova e escreva 'isso ficou genérico'.")


if __name__ == "__main__":
    main()
