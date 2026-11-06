#!/usr/bin/env python3
"""Enxuga o que entra em TODA sessão do Claude Code (3ª rodada, 06/11/2026).

Medido antes com medir-listagem.py: 131,7 KB de descrições, 380 itens.
Tudo que sai tinha ZERO uso nos históricos dos 9 projetos (contado nos .jsonl).

Sem argumento: só MOSTRA o que faria.
Com --aplicar: guarda o original em ~/.claude/backups/enxugar-2026-11-06/ e aplica.
Rodar 2× não estraga nada. Desfazer: mover de volta das pastas *-disabled
e copiar o settings.json do backup.

Testar numa cópia:  CLAUDE_HOME=/tmp/copia python3 enxugar.py --aplicar
Rodar de verdade:   ! python3 scripts/claude-config/enxugar.py --aplicar
"""
import json
import os
import shutil
import sys
from pathlib import Path

CLAUDE = Path(os.environ.get("CLAUDE_HOME", Path.home() / ".claude"))
BACKUP = CLAUDE / "backups" / "enxugar-2026-11-06"
APLICAR = "--aplicar" in sys.argv

# Sincronizados da conta claude.ai: 0 chamadas em 9 projetos.
# small-business sozinho = 33,8 KB (44 skills + Gmail, Drive, Shopify).
# Fica só pdf-viewer (0,3 KB; PDF do INEP).
PLUGINS_SYNCED = ["small-business", "figma", "data", "engineering",
                  "product-management", "design", "productivity"]
# Plugins instalados: 3D/animação — o PrepEnem tem 1 cena 3D só.
PLUGINS_INSTALADOS = ["core-3d-animation@claude-design-skillstack"]

# PubMed (bio-research) teve 31 chamadas, quase todas no leukemia-lab:
# volta a ser ligado SÓ lá (a faxina anterior desligou em todo lugar).
RELIGAR_NO_PROJETO = {
    CLAUDE.parent / "leukemia-lab": ["bio-research@synced"],
}

# Skills globais sem uso: three.js e gsap (ficam threejs-fundamentals,
# gsap-core e gsap-react), jogos, mobile, devops e z.ai (não instalado).
SKILLS_FICAM = {"threejs-fundamentals", "gsap-core", "gsap-react"}
SKILLS_PREFIXOS = ("threejs-", "gsap-")
SKILLS_SAEM = ["game-developer", "game-development", "react-native",
               "devops-engineer", "monitoring-expert", "consult-zai"]

# Comandos ECC de linguagens e fluxos que nenhum projeto usa (0 chamadas).
# code-review e loop-* também batiam de frente com /code-review e /loop oficiais.
COMANDOS_SAEM = [
    "cpp-build", "cpp-review", "cpp-test", "go-build", "go-review", "go-test",
    "rust-build", "rust-review", "rust-test", "kotlin-build", "kotlin-review",
    "kotlin-test", "flutter-build", "flutter-review", "flutter-test",
    "gradle-build", "fastapi-review", "python-review", "vue-review", "pm2",
    "jira", "epic-claim", "epic-decompose", "epic-publish", "epic-review",
    "epic-sync", "epic-unblock", "epic-validate", "gan-build", "gan-design",
    "marketing-campaign", "multi-backend", "multi-execute", "multi-frontend",
    "multi-plan", "multi-workflow", "orch-add-feature", "orch-build-mvp",
    "orch-change-feature", "orch-fix-defect", "orch-refine-code", "prp-commit",
    "prp-implement", "prp-plan", "prp-pr", "prp-prd", "instinct-export",
    "instinct-import", "instinct-status", "santa-loop", "setup-pm",
    "model-route", "project-init", "projects", "promote", "prune", "evolve",
    "loop-start", "loop-status", "auto-update", "ecc-guide", "code-review",
]


def passo(texto):
    print(("FEITO  " if APLICAR else "FARIA  ") + texto)


def guardar(origem: Path):
    """Copia o ORIGINAL para o backup; se já existe, não sobrescreve."""
    if not origem.exists():
        return
    destino = BACKUP / origem.relative_to(CLAUDE)
    if destino.exists():
        return
    destino.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(origem, destino)


def mover(origem: Path, pasta_destino: Path):
    destino = pasta_destino / origem.name
    if destino.exists():
        print(f"AVISO  {destino} já existe; {origem.name} fica onde está")
        return False
    if APLICAR:
        pasta_destino.mkdir(parents=True, exist_ok=True)
        shutil.move(str(origem), destino)
    return True


def mexer_settings():
    caminho = CLAUDE / "settings.json"
    dados = json.loads(caminho.read_text())
    plugins = dict(dados.get("enabledPlugins", {}))
    chaves = [f"{n}@synced" for n in PLUGINS_SYNCED] + PLUGINS_INSTALADOS
    mudou = [c for c in chaves if plugins.get(c) is not False]
    if not mudou:
        print("OK     plugins já desligados")
        return
    passo(f"desligar {len(mudou)} plugins: {', '.join(c.split('@')[0] for c in mudou)}")
    if APLICAR:
        guardar(caminho)
        plugins.update({c: False for c in mudou})
        novo = {**dados, "enabledPlugins": plugins}
        caminho.write_text(json.dumps(novo, indent=2, ensure_ascii=False) + "\n")


def religar_nos_projetos():
    for projeto, chaves in RELIGAR_NO_PROJETO.items():
        if not projeto.is_dir():
            print(f"PULA   {projeto} não existe")
            continue
        caminho = projeto / ".claude" / "settings.local.json"
        dados = json.loads(caminho.read_text()) if caminho.exists() else {}
        plugins = dict(dados.get("enabledPlugins", {}))
        faltam = [c for c in chaves if plugins.get(c) is not True]
        if not faltam:
            print(f"OK     {projeto.name}: {', '.join(chaves)} já ligado")
            continue
        passo(f"{projeto.name}: ligar {', '.join(faltam)} só neste projeto")
        if APLICAR:
            caminho.parent.mkdir(parents=True, exist_ok=True)
            plugins.update({c: True for c in faltam})
            novo = {**dados, "enabledPlugins": plugins}
            caminho.write_text(json.dumps(novo, indent=2, ensure_ascii=False) + "\n")


def desligar_skills():
    pasta = CLAUDE / "skills"
    nomes = [p.name for p in sorted(pasta.iterdir()) if p.is_dir()] if pasta.is_dir() else []
    saem = [n for n in nomes
            if (n.startswith(SKILLS_PREFIXOS) and n not in SKILLS_FICAM) or n in SKILLS_SAEM]
    movidas = [n for n in saem if mover(pasta / n, CLAUDE / "skills-disabled")]
    if movidas:
        passo(f"{len(movidas)} skills globais -> skills-disabled/ (three.js, gsap, jogos…)")
    else:
        print("OK     skills já enxutas")


def desligar_comandos():
    pasta = CLAUDE / "commands"
    saem = [pasta / f"{n}.md" for n in COMANDOS_SAEM if (pasta / f"{n}.md").exists()]
    movidos = [c for c in saem if mover(c, CLAUDE / "commands-disabled")]
    if movidos:
        passo(f"{len(movidos)} comandos -> commands-disabled/ (cpp, go, rust, epic, orch…)")
    else:
        print("OK     comandos já enxutos")


def main():
    if not APLICAR:
        print("Modo de teste: nada muda. Para aplicar, rode com --aplicar.\n")
    mexer_settings()
    religar_nos_projetos()
    desligar_skills()
    desligar_comandos()
    if APLICAR:
        print(f"\nBackup do settings.json em {BACKUP}. Feche e abra o Claude Code.")
        print("Medir de novo: python3 scripts/claude-config/medir-listagem.py")


if __name__ == "__main__":
    main()
