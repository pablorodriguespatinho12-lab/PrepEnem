#!/usr/bin/env python3
"""Aplica o que o raio-x das sessões achou (06/11/2026). O Pablo roda: ! python3 scripts/claude-config/aplicar-raio-x.py

Medido em 56 sessões de 9 projetos (scripts/claude-config/raio-x.py):
1. api-error-alert.sh (Stop): lê `.stop_reason`, campo que o Stop não manda, então sempre
   abre powershell.exe. 1055 vezes, 1656 s (média 1,6 s por parada). Log: 1254 linhas, todas "unknown".
2. context-monitor.sh (PostToolUse, TODA ferramenta): 3703 vezes, 276 s; 3567 das saídas eram
   alarme falso "EMERGENCY: Context remaining 0%". O Claude Code já compacta sozinho.
3. Scripts mortos em ~/.claude/hooks/ (nenhum ligado): vão para ~/.claude/hooks-desligados/.
   Movidos, não apagados: para voltar, é só mover de volta.

Guarda cópia do settings.json antes. Rodar 2x não muda nada.
Para testar numa cópia: CLAUDE_RAIZ=<pasta com settings.json e hooks/>.
"""
import json
import os
import shutil
from datetime import datetime
from pathlib import Path

RAIZ = Path(os.environ.get("CLAUDE_RAIZ", Path.home() / ".claude"))
SETTINGS = RAIZ / "settings.json"
TIRAR_DO_SETTINGS = ("api-error-alert.sh", "context-monitor.sh")
MORTOS = (
    "context-guardian.sh", "design-enforcer.sh", "ecc-security.sh", "handoff-creator.sh",
    "scope-guard.sh", "hooks.json", "memory-persistence", "ecc", "api-error-alert.sh",
    "context-monitor.sh",
)


def sem_ganchos(grupos: list) -> list:
    """Devolve os grupos sem os ganchos a tirar; grupo que fica vazio some."""
    novos = []
    for grupo in grupos:
        ganchos = [h for h in grupo.get("hooks", [])
                   if not any(nome in str(h.get("command", "")) for nome in TIRAR_DO_SETTINGS)]
        if ganchos:
            novos.append({**grupo, "hooks": ganchos})
    return novos


def limpar_settings() -> list:
    dados = json.loads(SETTINGS.read_text(encoding="utf-8"))
    ganchos = dados.get("hooks", {})
    novos = {ev: sem_ganchos(g) for ev, g in ganchos.items()}
    novos = {ev: g for ev, g in novos.items() if g}
    if novos == ganchos:
        return []
    copia = SETTINGS.with_name(f"settings.json.bak-raio-x-{datetime.now():%Y%m%d-%H%M%S}")
    shutil.copy2(SETTINGS, copia)
    SETTINGS.write_text(json.dumps({**dados, "hooks": novos}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return [f"settings.json: tirei {', '.join(TIRAR_DO_SETTINGS)} (cópia: {copia.name})"]


def mover_mortos() -> list:
    destino = RAIZ / "hooks-desligados" / "2026-11-06"
    feitos = []
    for nome in MORTOS + tuple(p.name for p in (RAIZ / "hooks").glob("*.bak-*")):
        origem = RAIZ / "hooks" / nome
        if not origem.exists():
            continue
        destino.mkdir(parents=True, exist_ok=True)
        shutil.move(str(origem), str(destino / nome))
        feitos.append(f"movido: hooks/{nome}")
    return feitos


def main() -> None:
    feitos = limpar_settings() + mover_mortos()
    print("\n".join(feitos) if feitos else "Nada a fazer: já estava aplicado.")
    print("Feche e abra o Claude Code para valer.")


if __name__ == "__main__":
    main()
