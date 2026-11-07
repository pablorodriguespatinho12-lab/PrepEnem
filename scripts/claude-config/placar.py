#!/usr/bin/env python3
"""Placar semanal do Claude: está melhorando? (todos os projetos, 06/11/2026)

Três números por semana, lidos das sessões gravadas em ~/.claude/projects/*/*.jsonl:
1. texto fixo: letras que o Claude lê no começo de toda sessão (CLAUDE.md global,
   regras sem `paths:` e índice da memória do PrepEnem). Só existe o valor de hoje;
   cada execução grava uma linha em ~/.claude/placar-historico.csv.
2. espera dos ganchos: segundos somados de todos os hooks, por sessão.
3. correções: mensagens do Pablo com cara de correção, por sessão (estimativa por
   palavras como "errado", "de novo", "não era"; serve para tendência, não para nota).

Uso: python3 scripts/claude-config/placar.py [semanas=6]
"""
import json
import re
import sys
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path

CLAUDE = Path.home() / ".claude"
HISTORICO = CLAUDE / "placar-historico.csv"
MEMORIA = CLAUDE / "projects/-home-pablo-prepenem-app/memory/MEMORY.md"
SEMANAS_PADRAO = 6

CORRECAO = re.compile(
    r"\b(errad[oa]|errou|n[ãa]o era (isso|assim|pra)|n[ãa]o (é|e) isso|eu quis dizer"
    r"|j[áa] (te )?(falei|disse|pedi)|n[ãa]o funcion|n[ãa]o resolv|n[ãa]o aparece|n[ãa]o mudou"
    r"|continua (errad|igual|o mesmo|quebr)|ainda (t[áa]|est[áa]) |quebrad|piorou|(vc|voc[êe]) esqueceu)",
    re.IGNORECASE,
)
RESUMO_AUTOMATICO = "This session is being continued"


def texto_fixo() -> int:
    """Bytes que entram em toda sessão."""
    total = sum(p.stat().st_size for p in (CLAUDE / "CLAUDE.md", MEMORIA) if p.exists())
    for regra in (CLAUDE / "rules").rglob("*.md"):
        texto = regra.read_text(encoding="utf-8")
        partes = texto.split("---")
        tem_paths = texto.lstrip().startswith("---") and len(partes) > 2 and "paths:" in partes[1]
        if not tem_paths:
            total += len(texto.encode())
    return total


def texto_do_pablo(registro: dict) -> str | None:
    """Mensagem digitada pelo Pablo; None para resultado de ferramenta, comando ou aviso."""
    if registro.get("type") != "user" or registro.get("isSidechain") or registro.get("isMeta"):
        return None
    conteudo = (registro.get("message") or {}).get("content")
    if isinstance(conteudo, list):
        if any(b.get("type") == "tool_result" for b in conteudo if isinstance(b, dict)):
            return None
        conteudo = " ".join(b.get("text", "") for b in conteudo if isinstance(b, dict))
    if not isinstance(conteudo, str) or conteudo.lstrip().startswith(("<", RESUMO_AUTOMATICO)):
        return None
    return conteudo


def ler_sessao(arquivo: Path, vistas: set) -> dict | None:
    """Resume uma sessão: semana, segundos de gancho, mensagens e correções.

    `vistas` guarda o uuid das mensagens já contadas: sessão retomada copia o histórico.
    """
    inicio, espera_ms, mensagens, correcoes = None, 0, 0, 0
    with arquivo.open(encoding="utf-8", errors="replace") as f:
        for linha in f:
            try:
                r = json.loads(linha)
            except json.JSONDecodeError:
                continue
            if inicio is None and r.get("timestamp"):
                inicio = r["timestamp"][:10]
            anexo = r.get("attachment") or {}
            espera_ms += anexo.get("durationMs") or 0
            for info in r.get("hookInfos") or []:
                espera_ms += info.get("durationMs") or 0
            texto = texto_do_pablo(r)
            if texto is not None and r.get("uuid") not in vistas:
                vistas.add(r.get("uuid"))
                mensagens += 1
                correcoes += bool(CORRECAO.search(texto))
    if not inicio or mensagens == 0:
        return None
    ano, semana, _ = date.fromisoformat(inicio).isocalendar()
    return {"semana": f"{ano}-S{semana:02d}", "espera": espera_ms / 1000,
            "mensagens": mensagens, "correcoes": correcoes}


def gravar_historico(fixo: int) -> None:
    novo = not HISTORICO.exists()
    with HISTORICO.open("a", encoding="utf-8") as f:
        if novo:
            f.write("data,texto_fixo_letras\n")
        f.write(f"{datetime.now():%Y-%m-%d %H:%M},{fixo}\n")


def main() -> None:
    semanas = int(sys.argv[1]) if len(sys.argv) > 1 else SEMANAS_PADRAO
    por_semana = defaultdict(list)
    vistas: set = set()
    arquivos = sorted((CLAUDE / "projects").glob("*/*.jsonl"), key=lambda p: p.stat().st_mtime)
    for arquivo in arquivos:
        sessao = ler_sessao(arquivo, vistas)
        if sessao:
            por_semana[sessao["semana"]].append(sessao)

    fixo = texto_fixo()
    gravar_historico(fixo)
    print(f"Texto fixo de cada sessão hoje: {fixo:,} letras (era 26.166 às 14h de 06/11)\n".replace(",", "."))
    print(f"{'semana':9} {'sessões':>7} {'espera/sessão':>14} {'correções/sessão':>17} {'% msgs corrigindo':>18}")
    for chave in sorted(por_semana)[-semanas:]:
        lista = por_semana[chave]
        n = len(lista)
        espera = sum(s["espera"] for s in lista) / n
        corr = sum(s["correcoes"] for s in lista)
        msgs = sum(s["mensagens"] for s in lista)
        print(f"{chave:9} {n:7} {espera:12.0f} s {corr / n:17.1f} {corr / msgs * 100:17.0f}%")


if __name__ == "__main__":
    main()
