#!/usr/bin/env python3
"""detectar-correcao.py: quando o Pablo corrige, lembra o Claude de aprender com o erro.

TRIGGER: UserPromptSubmit, global. O que este script imprime (exit 0) entra no contexto do Claude.

Por que (09/11/2026): ele pediu que todo erro corrigido vire mudança permanente, em toda sessão.
Regra escrita depende de eu lembrar; gancho não. Detector vem do placar.py (10 de 12 acertos, conferido
à mão), ampliado com "genérico" e "já existe", que o placar não pegava.

Falha aberta: qualquer erro sai calado, sem atrapalhar a mensagem.
"""
import json
import re
import sys
import unicodedata

CORRECAO = re.compile(
    r"\b(errad[oa]|errou|nao era (isso|assim|pra)|nao e isso|nao foi isso|eu quis dizer"
    r"|ja (te )?(falei|disse|pedi)|nao funcion|nao resolv|nao apareceu?|nao mudou"
    r"|continua (errad|igual|o mesmo|quebr)|quebrad|piorou|(vc|voce) esqueceu"
    r"|[gh]eneric|(esses?|essas?|isso|isse) (ai )?ja exist|nao gostei|ficou (feio|ruim))"
)
AVISO = (
    "[aprender] Esta mensagem parece correção de um erro meu. Se for, carregar a skill "
    "aprender-com-erro: causa em 1 frase, corrigir, varrer o mesmo erro, gravar no lugar certo "
    "e dizer \"aprendi: X, gravei em Y\". Se não for correção, ignorar este aviso."
)


def normalizar(texto: str) -> str:
    sem_acento = "".join(c for c in unicodedata.normalize("NFD", texto.lower()) if unicodedata.category(c) != "Mn")
    return re.sub(r"(.)\1{2,}", r"\1", sem_acento)


def main() -> None:
    try:
        pedido = json.load(sys.stdin).get("prompt", "")
    except Exception:
        return
    if not pedido.strip() or pedido.lstrip().startswith("/"):
        return
    if CORRECAO.search(normalizar(pedido)):
        print(AVISO)


if __name__ == "__main__":
    main()
