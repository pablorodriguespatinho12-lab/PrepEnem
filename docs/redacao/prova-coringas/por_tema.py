# Para cada tema do ENEM da prova dos coringas, diz quais coringas SERVEM
# (aprovados pelos 3 juízes) e traz o parágrafo aprovado NO PRÓPRIO tema,
# cortado nas 3 partes. Grava lib/redacao/coringas-por-tema.json.
#
# Pablo, 02/11/2026: "o exemplo tem que ser desse tema", "quais frases eu
# posso utilizar, quais eu não posso". O exemplo em outro tema continua para
# tema digitado por ele (fora da lista).
#
#   python3 docs/redacao/prova-coringas/por_tema.py
import json
import sys
from pathlib import Path

P = Path(__file__).parent
M = P / 'grandes-assuntos'
sys.path.insert(0, str(M))
sys.path.insert(0, str(P))
sys.argv = ['', str(M), str(P)]
import io, contextlib  # noqa: E401
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    from somar_macro import carregar, aprovar, CORINGAS, R2  # noqa: E402
    import exemplos as ex  # noqa: E402  (reaproveita textos e o corte em partes)
import novos  # noqa: E402

CORINGAS = novos.no_site(CORINGAS)

veredito: dict[tuple[str, str], dict] = {}
for chave, prefixo, pasta in [('chave.json', 'juiz-', P), ('chave-r2.json', 'juiz-r2-', P), ('chave-m.json', 'juiz-m-', M)]:
    for r in carregar(chave, prefixo, pasta).values():
        item = R2.get(r['item'], r['item'])
        if item not in CORINGAS:
            continue
        q = sum(n.get('qualidade', 2 * (n['pertinente'] + n['produtivo'])) for n in r['ns']) / 3
        atual = veredito.get((r['tema'], item))
        # Mais de uma rodada no mesmo tema: vale a aprovada de melhor qualidade.
        if atual is None or (r['aprovado'], q) > (atual['aprovado'], atual['q']):
            veredito[(r['tema'], item)] = {'aprovado': bool(r['aprovado']), 'q': q}

for tema, item, ok, ns in novos.vereditos_novos(aprovar):
    q = sum(2 * (n['pertinente'] + n['produtivo']) for n in ns) / len(ns)
    veredito[(tema, item)] = {'aprovado': bool(ok), 'q': q}

saida: dict[str, dict[str, dict]] = {}
for (tema, item), v in sorted(veredito.items()):
    entrada: dict = {'serve': v['aprovado']}
    if v['aprovado']:
        texto = ex.textos.get((tema, item))
        cortado = ex.partes(item, texto) if texto else None
        if not cortado:
            continue  # aprovado sem texto cortável: fica de fora, não aparece como "serve" sem exemplo
        entrada.update(cortado)
    saida.setdefault(tema, {})[item] = entrada

destino = P.parents[2] / 'lib' / 'redacao' / 'coringas-por-tema.json'
destino.write_text(json.dumps(saida, ensure_ascii=False, indent=1) + '\n')
for tema, cs in saida.items():
    print(f"{sum(c['serve'] for c in cs.values())}/{len(cs)} servem · {tema[:60]}", file=sys.stderr)
