#!/usr/bin/env python3
"""Enxuga as regras globais que entram em TODA sessão (06/11/2026).

Medido: 5 regras sem `paths:` (common/* e web/*) = 7,4 KB por sessão, com:
- web/performance.md e web/security.md carregando até em pedido que não toca site;
- common/security.md mandando usar o agente `security-reviewer`, que não existe;
- common/git-workflow.md dizendo "Attribution disabled" (o commit leva Co-Authored-By),
  mandando dar push com -u (o push é do Pablo) e apontando para development-workflow.md,
  que não existe.

Uso: python3 scripts/claude-config/enxugar-regras.py
Guarda cópia em ~/.claude/rules-backup-<data>/ antes. Rodar 2x não muda nada.
Para testar numa cópia: REGRAS_RAIZ=<pasta com common/ e web/>.
"""
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path

RAIZ = Path(os.environ.get("REGRAS_RAIZ", Path.home() / ".claude/rules/ecc"))

PATHS_WEB = """---
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.css"
  - "**/*.html"
  - "**/next.config.*"
  - "**/middleware.ts"
  - "**/proxy.ts"
---
"""

TROCAS = {
    "common/security.md": [
        ("2. Use **security-reviewer** agent",
         "2. Review with a clean-context reviewer (PrepEnem: `revisor-adversarial`; sites: skill `seguranca-site-nextjs`)"),
    ],
    "common/git-workflow.md": [
        ("Note: Attribution disabled globally via ~/.claude/settings.json.\n\n", ""),
        ("5. Push with `-u` flag if new branch\n", "5. Never push: Pablo pushes by hand with `!`\n"),
        ("\n> For the full development process (planning, TDD, code review) before git operations,\n"
         "> see [development-workflow.md](./development-workflow.md).\n", ""),
    ],
}


def guardar_copia() -> Path:
    destino = RAIZ.parent.parent / f"rules-backup-{datetime.now():%Y%m%d-%H%M%S}"
    if os.environ.get("REGRAS_RAIZ"):
        destino = RAIZ.parent / f"backup-{datetime.now():%Y%m%d-%H%M%S}"
    shutil.copytree(RAIZ, destino, dirs_exist_ok=True)
    return destino


def por_paths(nome: str) -> None:
    arquivo = RAIZ / nome
    texto = arquivo.read_text(encoding="utf-8")
    if texto.startswith("---"):
        print(f"já tem paths: {nome}")
        return
    arquivo.write_text(PATHS_WEB + texto, encoding="utf-8")
    print(f"paths posto: {nome}")


def trocar(nome: str, pares: list) -> None:
    arquivo = RAIZ / nome
    texto = arquivo.read_text(encoding="utf-8")
    novo = texto
    for antes, depois in pares:
        novo = novo.replace(antes, depois)
    if novo == texto:
        print(f"nada a trocar: {nome}")
        return
    arquivo.write_text(novo, encoding="utf-8")
    print(f"ajustado: {nome}")


def main() -> int:
    if not (RAIZ / "common").is_dir() or not (RAIZ / "web").is_dir():
        print(f"ERRO: não achei common/ e web/ em {RAIZ}")
        return 1
    print(f"cópia de segurança: {guardar_copia()}")
    for nome in ("web/performance.md", "web/security.md"):
        por_paths(nome)
    for nome, pares in TROCAS.items():
        trocar(nome, pares)
    print("Pronto. Vale depois de reabrir o Claude Code.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
