# Junta os trechos dos escritores e os positivos, embaralha com semente fixa e
# grava itens.json (o que o juiz vê: id, tema, trecho) e chave.json (de onde
# veio cada id). O juiz nunca vê a chave.
import json, random, sys
from pathlib import Path

D = Path(sys.argv[1])
todos = []
for nome in ['escritor-a.json', 'escritor-b.json', 'escritor-c.json', 'positivos.json']:
    todos += json.loads((D / nome).read_text())
random.Random(20261029).shuffle(todos)
itens, chave = [], {}
for i, t in enumerate(todos, 1):
    id_ = f'x{i:03d}'
    itens.append({'id': id_, 'tema': t['tema'], 'trecho': t['trecho']})
    chave[id_] = {'item': t['item'], 'tema': t['tema'], 'autoavaliacao': t.get('autoavaliacao', '-')}
(D / 'itens.json').write_text(json.dumps(itens, ensure_ascii=False, indent=1))
(D / 'chave.json').write_text(json.dumps(chave, ensure_ascii=False, indent=1))
print(len(itens), 'itens')
