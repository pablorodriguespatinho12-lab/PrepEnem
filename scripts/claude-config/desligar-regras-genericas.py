#!/usr/bin/env python3
"""Desliga as regras globais genéricas de React, TypeScript e web (09/11/2026).

Medido em 09/11: basta a sessão ler um `.tsx` para entrarem 35.210 bytes
(~8,8 mil tokens) de regras em inglês que não são do Pablo (convenções de
React 19, CSP genérica, tabela de Core Web Vitals). No PrepEnem isso acontece
em quase toda sessão. O que é do projeto já está no CLAUDE.md e nas skills.

Ficam ligadas: common/coding-style.md, common/git-workflow.md e
common/security.md (as duas últimas foram ajustadas para o Pablo).

Uso:
  python3 scripts/claude-config/desligar-regras-genericas.py            desliga
  python3 scripts/claude-config/desligar-regras-genericas.py --voltar   religa

Nada é apagado: as pastas vão para ~/.claude/rules-disabled/ (regra desligada
tem de sair de rules/, senão carrega mesmo com "disabled" no nome).
Rodar 2 vezes não muda nada. Para testar numa cópia: CLAUDE_RAIZ=<pasta com rules/ecc>.
"""
import os
import shutil
import sys
from pathlib import Path

RAIZ = Path(os.environ.get("CLAUDE_RAIZ", Path.home() / ".claude"))
LIGADAS = RAIZ / "rules" / "ecc"
DESLIGADAS = RAIZ / "rules-disabled" / "ecc-genericas-2026-11-09"
PASTAS = ("react", "typescript", "web")


def bytes_de(pasta: Path) -> int:
    if not pasta.exists():
        return 0
    return sum(arquivo.stat().st_size for arquivo in pasta.rglob("*.md"))


def mover(origem: Path, destino: Path) -> list[str]:
    movidas = []
    for nome in PASTAS:
        de, para = origem / nome, destino / nome
        if not de.exists():
            continue
        if para.exists():
            print(f"pulei {nome}: já existe em {para}")
            continue
        para.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(de), str(para))
        movidas.append(nome)
    return movidas


def main() -> int:
    if not LIGADAS.exists():
        print(f"Não achei {LIGADAS}. Nada feito.")
        return 1
    voltar = "--voltar" in sys.argv
    antes = bytes_de(LIGADAS)
    movidas = mover(DESLIGADAS, LIGADAS) if voltar else mover(LIGADAS, DESLIGADAS)
    depois = bytes_de(LIGADAS)
    acao = "Religuei" if voltar else "Desliguei"
    print(f"{acao}: {', '.join(movidas) if movidas else 'nada (já estava assim)'}")
    print(f"Regras ligadas: {antes:,} -> {depois:,} bytes".replace(",", "."))
    print(f"Ficaram ligadas: {', '.join(sorted(p.name for p in LIGADAS.iterdir()))}")
    if movidas and not voltar:
        print(f"Guardadas em: {DESLIGADAS}")
        print("Vale a partir da próxima sessão (feche e abra o Claude Code).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
