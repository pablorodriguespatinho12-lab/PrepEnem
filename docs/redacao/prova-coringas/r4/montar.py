# Rodada 4: junta os 68 trechos novos com âncoras da rodada 1 (Drummond =
# aprovado nos 11 temas; Dado esgoto e Bauman de bolso = reprovados nos 11),
# embaralha com semente fixa e grava itens.json (o que o juiz vê) e chave.json.
import json, random
from pathlib import Path

D = Path(__file__).parent
ANCORAS = {'Drummond', 'bauman_bolso'}

novos = json.loads((D / 'escritor-r4.json').read_text())
antigos = []
for nome in ['grandes-assuntos/temas-antigos-escritor-a.json', 'grandes-assuntos/temas-antigos-escritor-b.json', 'grandes-assuntos/temas-antigos-escritor-c.json']:
    antigos += [t for t in json.loads((D.parent / nome).read_text()) if t['item'] in ANCORAS]

todos = novos + antigos
random.Random(20261107).shuffle(todos)
itens, chave = [], {}
for i, t in enumerate(todos, 1):
    id_ = f'z{i:03d}'
    itens.append({'id': id_, 'tema': t['tema'], 'trecho': t['trecho']})
    chave[id_] = {'item': t['item'], 'tema': t['tema'], 'autoavaliacao': t.get('autoavaliacao', '-')}
(D / 'itens.json').write_text(json.dumps(itens, ensure_ascii=False, indent=1))
(D / 'chave.json').write_text(json.dumps(chave, ensure_ascii=False, indent=1))
print(len(novos), 'novos +', len(antigos), 'âncoras =', len(itens), 'itens')
