#!/usr/bin/env python3
"""Aplica as melhorias do Claude Code de 06/11/2026.

Sem argumento: só MOSTRA o que faria (não muda nada).
Com --aplicar: faz backup de tudo em ~/.claude/backups/faxina-2026-11-06/ e aplica.
Para desfazer: copiar de volta os arquivos do backup.

Rodar no Claude Code com:  ! python3 scripts/claude-config/aplicar.py --aplicar
"""
import json
import shutil
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
CLAUDE = Path.home() / ".claude"
BACKUP = CLAUDE / "backups" / "faxina-2026-11-06"
APLICAR = "--aplicar" in sys.argv

# Plugins sincronizados da conta que não servem para o que o Pablo faz.
# (Os que ficaram aqui — small-business, figma, design… — saem no enxugar.py.)
PLUGINS_DESLIGAR = [
    "zoom-plugin", "sales", "bio-research", "bigdata-com", "sp-global",
    "spglobal-plugin", "legal", "finance", "human-resources", "pendo-analytics",
    "pendo-guides", "pendo-orchestrate", "postiz", "hostinger",
    "adobe-for-creativity", "brand-voice", "customer-support",
    "slack-by-salesforce", "enterprise-search", "operations", "product-tracking",
    "product-tracking-skills", "searchfit-seo", "marketing",
    "cowork-plugin-management", "desktop-commander",
]

# Regras ECC sempre carregadas que brigam com as do projeto (TDD obrigatório,
# 80% de cobertura, agentes que não existem, estilo de design próprio).
REGRAS_DESLIGAR = [
    "common/code-review.md", "common/testing.md", "common/development-workflow.md",
    "common/patterns.md", "common/agents.md", "web/coding-style.md",
    "web/design-quality.md", "web/patterns.md", "web/testing.md",
]

# Memórias do PrepEnem que agora estão no ~/.claude/CLAUDE.md (valem em todo projeto).
# Saem do índice e vão para memory/no-global/ (não são apagadas).
MEMORIA = CLAUDE / "projects" / "-home-pablo-prepenem-app" / "memory"
MEMORIAS_NO_GLOBAL = [
    "falar-sempre-portugues.md", "seguir-sem-perguntar.md",
    "nao-lembrar-horario-de-prova.md", "numeros-do-pablo-sao-intencao.md",
    "chrome-nao-funciona-no-wsl.md", "segunda-opiniao-o-que-roda.md",
    "agente-novo-so-na-proxima-sessao.md", "regra-desligada-fora-de-rules.md",
    "pesquisa-salva-em-arquivo.md",
]

HOOKS_NOVOS = {
    "Notification": "avisar-windows.sh",
    "SessionStart": "pendencias-inicio.sh",
}


def passo(texto):
    print(("FEITO  " if APLICAR else "FARIA  ") + texto)


def guardar(origem: Path):
    if not origem.exists():
        return
    destino = BACKUP / origem.relative_to(CLAUDE)
    if destino.exists():
        return  # o backup guarda o ORIGINAL; rodar de novo não sobrescreve
    destino.parent.mkdir(parents=True, exist_ok=True)
    if origem.is_dir():
        shutil.copytree(origem, destino, dirs_exist_ok=True)
    else:
        shutil.copy2(origem, destino)


def copiar(nome: str, destino: Path, executavel=False):
    passo(f"copiar {nome} -> {destino}")
    if APLICAR:
        guardar(destino)
        destino.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(AQUI / nome, destino)
        if executavel:
            destino.chmod(0o755)


def mexer_settings():
    caminho = CLAUDE / "settings.json"
    dados = json.loads(caminho.read_text())
    hooks = dados.setdefault("hooks", {})
    for evento, script in HOOKS_NOVOS.items():
        comando = str(CLAUDE / "hooks" / script)
        ja_tem = any(
            h.get("command") == comando
            for grupo in hooks.get(evento, [])
            for h in grupo.get("hooks", [])
        )
        if ja_tem:
            print(f"OK     gancho {evento} já existe")
            continue
        passo(f"gancho {evento} -> {script}")
        hooks.setdefault(evento, []).append(
            {"matcher": "", "hooks": [{"type": "command", "command": comando, "timeout": 10}]}
        )
    plugins = dados.setdefault("enabledPlugins", {})
    for nome in PLUGINS_DESLIGAR:
        chave = f"{nome}@synced"
        if plugins.get(chave) is not False:
            plugins[chave] = False
    passo(f"desligar {len(PLUGINS_DESLIGAR)} plugins sincronizados (Zoom, vendas, finanças...)")
    if dados.get("outputStyle") != "TDAH":
        passo("estilo de resposta padrão = TDAH (troca com /config se não gostar)")
        dados["outputStyle"] = "TDAH"
    if APLICAR:
        guardar(caminho)
        caminho.write_text(json.dumps(dados, indent=2, ensure_ascii=False) + "\n")


def desligar_regras():
    antes = sum(f.stat().st_size for f in (CLAUDE / "rules").rglob("*.md"))
    economia = 0
    for rel in REGRAS_DESLIGAR:
        origem = CLAUDE / "rules" / "ecc" / rel
        if not origem.exists():
            continue
        economia += origem.stat().st_size
        destino = CLAUDE / "rules-disabled" / "ecc-conflitantes-2026-11-06" / rel
        passo(f"desligar regra {rel}")
        if APLICAR:
            guardar(origem)
            destino.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(origem), destino)
    print(f"       regras: {antes/1024:.0f} KB -> {(antes-economia)/1024:.0f} KB")


def mover_memorias():
    indice = MEMORIA / "MEMORY.md"
    linhas = indice.read_text().splitlines(keepends=True)
    movidas = [m for m in MEMORIAS_NO_GLOBAL if (MEMORIA / m).exists()]
    passo(f"{len(movidas)} memórias do PrepEnem -> global (ficam em memory/no-global/)")
    if not APLICAR or not movidas:
        return
    guardar(MEMORIA)
    (MEMORIA / "no-global").mkdir(exist_ok=True)
    for m in movidas:
        shutil.move(str(MEMORIA / m), MEMORIA / "no-global" / m)
    novas = [l for l in linhas if not any(f"({m})" in l for m in movidas)]
    novas.append("- [Regras gerais no global](no-global/) — TDAH, português, push, WSL, agy: agora em ~/.claude/CLAUDE.md\n")
    indice.write_text("".join(novas))


def main():
    if not APLICAR:
        print("Modo de teste: nada muda. Para aplicar, rode com --aplicar.\n")
    copiar("CLAUDE.global.md", CLAUDE / "CLAUDE.md")
    copiar("comment-strip.sh", CLAUDE / "hooks" / "comment-strip.sh", executavel=True)
    copiar("avisar-windows.sh", CLAUDE / "hooks" / "avisar-windows.sh", executavel=True)
    copiar("pendencias-inicio.sh", CLAUDE / "hooks" / "pendencias-inicio.sh", executavel=True)
    copiar("estilo-tdah.md", CLAUDE / "output-styles" / "tdah.md")
    if not (CLAUDE / "pendencias.md").exists():
        copiar("pendencias.md", CLAUDE / "pendencias.md")
    mexer_settings()
    desligar_regras()
    mover_memorias()
    if APLICAR:
        print(f"\nBackup em {BACKUP}. Feche e abra o Claude Code para valer.")


if __name__ == "__main__":
    main()
