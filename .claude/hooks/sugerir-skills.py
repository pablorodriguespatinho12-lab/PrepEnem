#!/usr/bin/env python3
"""sugerir-skills.py: lembra o Claude das skills do projeto que servem ao pedido.

TRIGGER: UserPromptSubmit. O que este script imprime (exit 0) entra no contexto do Claude.

Por que (06/11/2026): o CLAUDE.md manda listar e carregar as skills que servem,
mas nessa sessão o Claude não carregou combinar-skills nem explicar-ao-pablo.
Regra escrita ele segue quase sempre; hook o programa obriga sempre.
Ideia do ChrisWiles/claude-code-showcase (skill-eval.sh + skill-rules.json).

Falha aberta: qualquer erro sai calado, sem atrapalhar o pedido.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

REGRAS = Path(__file__).with_name("skill-rules.json")


# Relatório de agente e aviso automático chegam como "prompt" mas não são do
# Pablo: em 10/11/2026 o aviso disparou em ~10 relatórios de agente numa noite.
# Tira esses blocos e olha só o que sobra (a frase dele que vier junto conta).
NAO_E_DELE = re.compile(
    r"<(agent-message|system-reminder|task-notification)\b.*?</\1>"
    r"|Another Claude session sent a message:?"
    r"|That \"other Claude session\".*?laundering\.",
    re.S,
)


def so_o_que_ele_escreveu(texto: str) -> str:
    return NAO_E_DELE.sub(" ", texto)


def sem_acento(texto: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", texto.lower()) if unicodedata.category(c) != "Mn")


def main() -> None:
    try:
        pedido = sem_acento(so_o_que_ele_escreveu(json.load(sys.stdin).get("prompt", "")))
        tabela = json.loads(REGRAS.read_text())
    except Exception:
        return
    if not pedido.strip() or pedido.lstrip().startswith("/"):
        return
    # "fizzzz o enemmmm" (fala animada) também conta como "fiz o enem".
    encolhido = re.sub(r"(.)\1{2,}", r"\1", pedido)
    achadas: list[str] = []
    for regra in tabela.get("regras", []):
        if re.search(regra["palavras"], pedido) or re.search(regra["palavras"], encolhido):
            achadas += [s for s in regra["skills"] if s not in achadas]
    achadas += [s for s in tabela.get("sempre", []) if s not in achadas]
    print(f"[sugerir-skills] Skills do projeto que servem a este pedido (carregar cada uma antes do trabalho que ela governa): {', '.join(achadas)}.")


if __name__ == "__main__":
    main()
