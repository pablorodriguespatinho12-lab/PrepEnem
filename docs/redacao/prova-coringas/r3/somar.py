# Soma os votos da rodada 3 com a mesma regra das rodadas 1 e 2: aprovado =
# maioria diz c2_200 "sim", maioria NÃO vê "bolso" e média de pertinente e de
# produtivo de 1,5 ou mais. Uso: python3 somar.py haiku sonnet fable
import json, sys, itertools
from collections import defaultdict
from pathlib import Path

D = Path(__file__).parent
juizes = sys.argv[1:]
chave = json.loads((D / 'chave.json').read_text())
notas = {j: {n['id']: n for n in json.loads((D / f'juiz-{j}.json').read_text())} for j in juizes}

res = {}
for id_, k in chave.items():
    ns = [notas[j][id_] for j in juizes if id_ in notas[j]]
    if not ns:
        continue
    sim = sum(n['c2_200'] == 'sim' for n in ns)
    bolso = sum(n['bolso'] == 1 for n in ns)
    pert = sum(n['pertinente'] for n in ns) / len(ns)
    prod = sum(n['produtivo'] for n in ns) / len(ns)
    ok = sim * 2 > len(ns) and bolso * 2 < len(ns) and pert >= 1.5 and prod >= 1.5
    res[id_] = {**k, 'aprovado': ok, 'n': len(ns), 'porques': [n.get('porque', '') for n in ns]}

por = defaultdict(list)
for r in res.values():
    por[r['item']].append(r)
print('| Item | Temas aprovados | Onde reprovou |')
print('|---|---|---|')
for item in sorted(por, key=lambda i: -sum(r['aprovado'] for r in por[i])):
    rs = por[item]
    falhas = '; '.join(r['tema'][:40] for r in rs if not r['aprovado'])
    print(f"| {item} | {sum(r['aprovado'] for r in rs)}/{len(rs)} | {falhas} |")

print('\nConcordância no "sustenta 200":')
for a, b in itertools.combinations(juizes, 2):
    comuns = [i for i in chave if i in notas[a] and i in notas[b]]
    igual = sum(notas[a][i]['c2_200'] == notas[b][i]['c2_200'] for i in comuns)
    print(f'  {a} x {b}: {igual}/{len(comuns)}')

auto = defaultdict(lambda: [0, 0])
for r in res.values():
    if r['autoavaliacao'] in ('ok', 'fraco', 'forcado'):
        auto[r['autoavaliacao']][0] += r['aprovado']
        auto[r['autoavaliacao']][1] += 1
print('\nEscritor x juízes:', {k: f'{v[0]}/{v[1]}' for k, v in auto.items()})
(D / 'resultado-r3.json').write_text(json.dumps(res, ensure_ascii=False, indent=1))
