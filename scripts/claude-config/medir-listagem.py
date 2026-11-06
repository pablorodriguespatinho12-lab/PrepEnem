#!/usr/bin/env python3
"""Mede quanto texto de descrição de skill/comando entra em TODA sessão (só lê).

Uso:  python3 scripts/claude-config/medir-listagem.py
Soma o campo `description` do frontmatter de cada SKILL.md e comando .md
que o Claude Code lista: ~/.claude/skills, ~/.claude/commands e plugins ligados.
"""
import json
import re
from pathlib import Path

CLAUDE = Path.home() / ".claude"


def descricao(arquivo: Path) -> int:
    try:
        texto = arquivo.read_text(errors="ignore")
    except OSError:
        return 0
    m = re.match(r"---\n(.*?)\n---", texto, re.S)
    if not m:
        return 0
    d = re.search(r"^description:\s*(.*?)(?=^\w[\w-]*:|\Z)", m.group(1), re.S | re.M)
    return len(d.group(1).strip()) if d else 0


def somar(arquivos):
    lista = list(arquivos)
    return len(lista), sum(descricao(a) for a in lista)


def plugins_ligados():
    dados = json.loads((CLAUDE / "settings.json").read_text())
    estado = dados.get("enabledPlugins", {})
    ligados = {k.split("@")[0] for k, v in estado.items() if v}
    # Sincronizados da conta: ligados por padrão, a menos que estejam `false`.
    for pasta in (CLAUDE / "plugins" / "synced").glob("*/*"):
        nome = re.sub(r"~g\d+$", "", pasta.name)
        if pasta.is_dir() and estado.get(f"{nome}@synced") is not False:
            ligados.add(pasta.name)
    return ligados


def main():
    grupos = {
        "skills globais": somar(CLAUDE.glob("skills/*/SKILL.md")),
        "comandos globais": somar(CLAUDE.glob("commands/*.md")),
    }
    ligados = plugins_ligados()
    raiz = CLAUDE / "plugins"
    vistos = set()
    for skill in raiz.rglob("SKILL.md"):
        partes = skill.parts
        nome = next((p for p in partes if p in ligados), None)
        chave = (nome, skill.parent.name)
        if nome is None or chave in vistos:
            continue
        vistos.add(chave)
        n, c = grupos.get(f"plugin {nome}", (0, 0))
        grupos[f"plugin {nome}"] = (n + 1, c + descricao(skill))
    total_n = total_c = 0
    for nome, (n, c) in sorted(grupos.items(), key=lambda x: -x[1][1]):
        print(f"{c/1024:6.1f} KB  {n:4d}  {nome}")
        total_n += n
        total_c += c
    print(f"{total_c/1024:6.1f} KB  {total_n:4d}  TOTAL (~{total_c//4} tokens)")
    print("Obs.: o Claude Code pode encurtar descrições longas; o número real vem do /context.")


if __name__ == "__main__":
    main()
