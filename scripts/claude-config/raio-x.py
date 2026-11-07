#!/usr/bin/env python3
"""Raio-x das sessões do Claude (todos os projetos): onde eu erro, travo ou faço o Pablo esperar.

Lê ~/.claude/projects/*/*.jsonl e mostra:
1. ganchos: vezes, segundos somados e média, por gancho;
2. ganchos que barraram: qual e quantas vezes;
3. erros de ferramenta: por ferramenta, e o mesmo comando falhando 2+ vezes;
4. permissões recusadas pelo Pablo;
5. sessões que estouraram o contexto (resumo automático);
6. correções do Pablo (mesma regra do placar) e a minha última frase antes de cada uma.

Uso: python3 scripts/claude-config/raio-x.py [--correcoes]
"""
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from placar import CLAUDE, CORRECAO, RESUMO_AUTOMATICO, texto_do_pablo  # noqa: E402

TOPO = 12
INTERRUPCAO = "[Request interrupted by user"
RECUSA = ("The user doesn't want to proceed", "Permission to use", "denied")


def nome_gancho(anexo: dict) -> str:
    comando = anexo.get("command") or anexo.get("hookName") or "?"
    return f"{anexo.get('hookEvent', '?')}: {Path(comando.split()[0]).name if comando else '?'}"


def texto_resultado(bloco: dict) -> str:
    conteudo = bloco.get("content")
    if isinstance(conteudo, list):
        conteudo = " ".join(c.get("text", "") for c in conteudo if isinstance(c, dict))
    return str(conteudo or "")


class Raio:
    def __init__(self) -> None:
        self.gancho_ms = defaultdict(list)
        self.barrou = Counter()
        self.erro_ferramenta = Counter()
        self.erro_comando = Counter()
        self.recusas = Counter()
        self.estouros = 0
        self.correcoes = []
        self.interrupcoes = Counter()
        self.ultima_ferramenta = "?"
        self.vistas = set()

    def ler(self, arquivo: Path) -> None:
        pedidos = {}  # tool_use_id -> (ferramenta, comando)
        ultima_fala = ""
        with arquivo.open(encoding="utf-8", errors="replace") as f:
            for linha in f:
                try:
                    r = json.loads(linha)
                except json.JSONDecodeError:
                    continue
                if r.get("uuid") in self.vistas:
                    continue
                self.vistas.add(r.get("uuid"))
                ultima_fala = self._registro(r, pedidos, ultima_fala, arquivo)

    def _registro(self, r: dict, pedidos: dict, ultima_fala: str, arquivo: Path) -> str:
        anexo = r.get("attachment") or {}
        tipo = anexo.get("type", "")
        if tipo == "hook_success" and anexo.get("durationMs") is not None:
            self.gancho_ms[nome_gancho(anexo)].append(anexo["durationMs"])
        elif tipo == "hook_blocking_error":
            self.barrou[nome_gancho(anexo)] += 1
        for info in r.get("hookInfos") or []:
            self.gancho_ms[f"Stop: {Path(info.get('command', '?').split()[0]).name}"].append(info.get("durationMs") or 0)

        conteudo = (r.get("message") or {}).get("content")
        if r.get("type") == "assistant" and isinstance(conteudo, list):
            for b in conteudo:
                if b.get("type") == "tool_use":
                    entrada = b.get("input") or {}
                    pedidos[b.get("id")] = (b.get("name"), str(entrada.get("command") or entrada.get("file_path") or "")[:90])
                elif b.get("type") == "text" and b.get("text", "").strip():
                    ultima_fala = b["text"].strip()
        if r.get("type") == "user" and isinstance(conteudo, list):
            for b in conteudo:
                if isinstance(b, dict) and b.get("type") == "tool_result" and b.get("is_error"):
                    self._erro(b, pedidos)
        texto = texto_do_pablo(r) if not str(conteudo).startswith(RESUMO_AUTOMATICO) else None
        if isinstance(conteudo, str) and conteudo.startswith(RESUMO_AUTOMATICO):
            self.estouros += 1
        if texto and texto.startswith(INTERRUPCAO):
            self.interrupcoes[self.ultima_ferramenta] += 1
        if r.get("type") == "assistant" and isinstance(conteudo, list):
            usos = [b.get("name") for b in conteudo if b.get("type") == "tool_use"]
            self.ultima_ferramenta = usos[-1] if usos else "texto"
        if texto and CORRECAO.search(texto):
            self.correcoes.append((arquivo.parent.name, ultima_fala[-160:], texto[:160]))
        return ultima_fala

    def _erro(self, bloco: dict, pedidos: dict) -> None:
        ferramenta, comando = pedidos.get(bloco.get("tool_use_id"), ("?", ""))
        texto = texto_resultado(bloco)
        if any(m in texto for m in RECUSA):
            self.recusas[ferramenta] += 1
            return
        self.erro_ferramenta[ferramenta] += 1
        if comando:
            self.erro_comando[(ferramenta, comando)] += 1


def tabela(titulo: str, linhas: list) -> None:
    print(f"\n## {titulo}")
    for linha in linhas or ["(nada)"]:
        print(f"  {linha}")


def main() -> None:
    raio = Raio()
    arquivos = sorted((CLAUDE / "projects").glob("*/*.jsonl"), key=lambda p: p.stat().st_mtime)
    for arquivo in arquivos:
        raio.ler(arquivo)

    ganchos = sorted(raio.gancho_ms.items(), key=lambda kv: -sum(kv[1]))
    tabela("Ganchos (segundos somados | vezes | média)", [
        f"{sum(v) / 1000:7.0f} s | {len(v):5} | {sum(v) / len(v) / 1000:5.2f} s  {k}" for k, v in ganchos[:TOPO]])
    tabela("Ganchos que barraram", [f"{n:4}  {k}" for k, n in raio.barrou.most_common(TOPO)])
    tabela("Erros por ferramenta", [f"{n:4}  {k}" for k, n in raio.erro_ferramenta.most_common(TOPO)])
    tabela("Mesmo comando falhando 2+ vezes", [
        f"{n:3}x {f}: {c}" for (f, c), n in raio.erro_comando.most_common(TOPO) if n > 1])
    tabela("Permissões recusadas", [f"{n:4}  {k}" for k, n in raio.recusas.most_common()])
    tabela("Interrupções do Pablo (o que eu fazia na hora)", [
        f"{n:4}  {k}" for k, n in raio.interrupcoes.most_common(TOPO)])
    print(f"\n## Sessões que estouraram o contexto: {raio.estouros} (de {len(arquivos)} arquivos)")
    print(f"## Correções do Pablo: {len(raio.correcoes)}")
    if "--correcoes" in sys.argv:
        for projeto, fala, correcao in raio.correcoes:
            print(f"\n[{projeto}]\n  EU: ...{fala}\n  PABLO: {correcao}")


if __name__ == "__main__":
    main()
