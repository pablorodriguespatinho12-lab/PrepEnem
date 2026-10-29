# Soma as notas dos juízes. Aprovado = maioria diz c2_200 "sim", maioria NÃO
# vê "bolso", e a média de pertinente e de produtivo é de 1,5 ou mais.
# Imprime: calibração (positivos e Bauman), concordância entre juízes e a
# cobertura de cada coringa nos 11 temas. Grava resultado.json.
import json, sys, itertools
from collections import defaultdict
from pathlib import Path

D = Path(sys.argv[1])
juizes = sys.argv[2:]
chave = json.loads((D / 'chave.json').read_text())
notas = {j: {n['id']: n for n in json.loads((D / f'juiz-{j}.json').read_text())} for j in juizes}

def grupo(item):
    if item.startswith('positivo'): return 'positivo (redação bem avaliada)'
    if item == 'bauman_bolso': return 'Bauman de bolso'
    if item == 'bauman_cuidadoso': return 'Bauman bem escrito'
    return item

res = {}
for id_, k in chave.items():
    ns = [notas[j][id_] for j in juizes if id_ in notas[j]]
    if not ns: continue
    sim = sum(n['c2_200'] == 'sim' for n in ns)
    bolso = sum(n['bolso'] == 1 for n in ns)
    pert = sum(n['pertinente'] for n in ns) / len(ns)
    prod = sum(n['produtivo'] for n in ns) / len(ns)
    ok = sim * 2 > len(ns) and bolso * 2 < len(ns) and pert >= 1.5 and prod >= 1.5
    res[id_] = {**k, 'grupo': grupo(k['item']), 'sim': sim, 'bolso': bolso, 'pertinente': round(pert, 2), 'produtivo': round(prod, 2), 'aprovado': ok, 'n': len(ns),
                'porques': [n.get('porque', '') for n in ns]}

por = defaultdict(list)
for r in res.values(): por[r['grupo']].append(r)
print('| Grupo | Aprovados | Pertinente (média) | Produtivo (média) | Visto como "de bolso" |')
print('|---|---|---|---|---|')
for g in sorted(por, key=lambda g: (not g.startswith(('positivo', 'Bauman')), g)):
    rs = por[g]
    a = sum(r['aprovado'] for r in rs)
    print(f"| {g} | {a}/{len(rs)} ({100*a//len(rs)}%) | {sum(r['pertinente'] for r in rs)/len(rs):.2f} | {sum(r['produtivo'] for r in rs)/len(rs):.2f} | {sum(r['bolso']*2>r['n'] for r in rs)}/{len(rs)} |")

# Concordância: % de itens em que cada par de juízes deu o mesmo c2_200.
print('\nConcordância no "sustenta 200":')
for a, b in itertools.combinations(juizes, 2):
    comuns = [i for i in chave if i in notas[a] and i in notas[b]]
    igual = sum(notas[a][i]['c2_200'] == notas[b][i]['c2_200'] for i in comuns)
    print(f'  {a} x {b}: {igual}/{len(comuns)} ({100*igual//max(1,len(comuns))}%)')

# Temas onde cada coringa falhou, e a autoavaliação do escritor contra o juiz.
print('\nOnde cada coringa reprovou:')
for g in sorted(por):
    if g.startswith(('positivo', 'Bauman')): continue
    falhas = [r['tema'][:45] for r in por[g] if not r['aprovado']]
    print(f'  {g}: {len(falhas)} — ' + '; '.join(falhas))
auto = defaultdict(lambda: [0, 0])
for r in res.values():
    if r['autoavaliacao'] in ('ok', 'fraco', 'forcado'):
        auto[r['autoavaliacao']][0] += r['aprovado']; auto[r['autoavaliacao']][1] += 1
print('\nEscritor x juízes (aprovados por autoavaliação):', {k: f'{v[0]}/{v[1]}' for k, v in auto.items()})
(D / 'resultado.json').write_text(json.dumps(res, ensure_ascii=False, indent=1))
