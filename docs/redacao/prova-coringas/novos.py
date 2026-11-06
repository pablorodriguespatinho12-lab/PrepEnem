# Rodadas 3 e 4 (06/11/2026): coringas novos testados nos 28 temas com juízes
# Haiku, Sonnet e Fable. Brecht e Galeano (18 de 28) entraram no site no lugar
# de Luther King (12) e Machado (6). Usado por exemplos.py e por_tema.py.
import json
from pathlib import Path

P = Path(__file__).parent
FORA = {'Luther King', 'Machado'}
NOVOS = {'brecht': 'Brecht', 'galeano': 'Galeano'}
JUIZES = ['haiku', 'sonnet', 'fable']


def no_site(antigos):
    return [c for c in antigos if c not in FORA] + list(NOVOS.values())


def textos_novos():
    out = {}
    for arq in [P / 'r3' / 'escritor-r3.json', P / 'r4' / 'escritor-r4.json']:
        for t in json.loads(arq.read_text()):
            if t['item'] in NOVOS:
                out[(t['tema'], NOVOS[t['item']])] = t['trecho']
    return out


def vereditos_novos(aprovar):
    """Gera (tema, coringa, aprovado, ns) dos coringas novos."""
    for pasta in [P / 'r3', P / 'r4']:
        chave = json.loads((pasta / 'chave.json').read_text())
        notas = {j: {n['id']: n for n in json.loads((pasta / f'juiz-{j}.json').read_text())} for j in JUIZES}
        for id_, k in chave.items():
            if k['item'] not in NOVOS:
                continue
            ns = [notas[j][id_] for j in JUIZES if id_ in notas[j]]
            if len(ns) == len(JUIZES):
                yield k['tema'], NOVOS[k['item']], aprovar(ns), ns
