# Teste decisivo: parágrafo CONSTRUÍDO em volta do coringa (molde do site)
# contra o 1º desenvolvimento original de 47 redações nota 1000.
import json, sys
from collections import defaultdict
from pathlib import Path

M = Path(sys.argv[1])
J = ['opus', 'sonnet', 'fable']
def carregar(chave, pref):
    ch = json.loads((M / chave).read_text())
    ns = {j: {n['id']: n for n in json.loads((M / f'{pref}{j}.json').read_text())} for j in J}
    out = {}
    for i, k in ch.items():
        v = [ns[j][i] for j in J if i in ns[j]]
        if len(v) < 3: continue
        sim = sum(n['c2_200'] == 'sim' for n in v); bolso = sum(n['bolso'] == 1 for n in v)
        pert = sum(n['pertinente'] for n in v) / 3; prod = sum(n['produtivo'] for n in v) / 3
        out[i] = {**k, 'aprovado': sim >= 2 and bolso <= 1 and pert >= 1.5 and prod >= 1.5, 'bolso': bolso >= 2,
                  'q': sum(n['qualidade'] for n in v) / 3}
    return out

c = carregar('chave-c.json', 'juiz-c-')
r = carregar('chave-r.json', 'juiz-r-')
orig_r = {v['redacao']: v for v in r.values() if v['versao'] == 'original'}
cons = [v for v in c.values() if v['versao'] == 'construido']
anc = [v for v in c.values() if v['versao'] == 'original']

print(f'Construído em volta do coringa: {sum(v["aprovado"] for v in cons)}/{len(cons)} sustentam 200 | visto como bolso: {sum(v["bolso"] for v in cons)} | qualidade {sum(v["q"] for v in cons)/len(cons):.2f}')
print(f'Originais (rodada anterior, 47): {sum(v["aprovado"] for v in orig_r.values())}/{len(orig_r)} | bolso: {sum(v["bolso"] for v in orig_r.values())} | qualidade {sum(v["q"] for v in orig_r.values())/len(orig_r):.2f}')
print(f'Âncoras (15 originais de novo): {sum(v["aprovado"] for v in anc)}/{len(anc)} agora; na rodada anterior {sum(orig_r[v["redacao"]]["aprovado"] for v in anc)}/{len(anc)}')
igual = sum(v['aprovado'] == orig_r[v['redacao']]['aprovado'] for v in anc)
print(f'  mesma decisão nas âncoras: {igual}/{len(anc)}; qualidade média agora {sum(v["q"] for v in anc)/len(anc):.2f}, antes {sum(orig_r[v["redacao"]]["q"] for v in anc)/len(anc):.2f}')

# Par a par: construído x original da mesma redação.
melhor = pior = 0
for v in cons:
    o = orig_r[v['redacao']]
    if v['q'] > o['q'] + 0.34: melhor += 1
    elif v['q'] < o['q'] - 0.34: pior += 1
print(f'Qualidade par a par: construído melhor em {melhor}, pior em {pior}, empate em {len(cons)-melhor-pior}')
pc = defaultdict(lambda: [0, 0])
for v in cons: pc[v['coringa']][0] += v['aprovado']; pc[v['coringa']][1] += 1
print('Por coringa (sustenta 200 / usado):', {k: f'{a}/{b}' for k, (a, b) in sorted(pc.items(), key=lambda x: -x[1][1])})
