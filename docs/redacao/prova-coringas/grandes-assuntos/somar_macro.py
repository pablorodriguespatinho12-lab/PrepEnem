# Junta: (1) a cobertura de cada coringa nos 28 temas do ENEM (17 desta
# rodada + 11 da prova anterior), por grande assunto; (2) a calibração
# (Bauman de bolso e âncoras); (3) as redações nota 1000 com o coringa no lugar
# do repertório, contra o original. Aprovado = maioria diz c2_200 "sim",
# maioria NÃO vê "bolso", média de pertinente e produtivo >= 1,5.
import json, sys
from collections import defaultdict
from pathlib import Path

M = Path(sys.argv[1])
P = Path(sys.argv[2])  # docs/redacao/prova-coringas
JUIZES = ['opus', 'sonnet', 'fable']
CORINGAS = ['Drummond', 'Dom Hélder', 'Rui Barbosa', 'Elie Wiesel', 'Graciliano', 'Luther King', 'Machado', 'Dado 1888']
R2 = {'rui_barbosa': 'Rui Barbosa', 'elie_wiesel': 'Elie Wiesel', 'luther_king': 'Luther King'}

# Grandes assuntos, pelo começo do texto do tema.
MACRO = {
    'Viver e aprender': ['Educação'], 'Cidadania e participação': ['Cidadania e política'],
    'Direitos da criança': ['Grupos vulneráveis'], 'Desenvolvimento e preservação': ['Meio ambiente', 'Economia e trabalho'],
    'O direito de votar': ['Cidadania e política'], 'A violência na sociedade': ['Segurança e violência'],
    'Como garantir a liberdade': ['Tecnologia e comunicação'], 'O trabalho infantil': ['Economia e trabalho', 'Grupos vulneráveis'],
    'O poder de transformação da leitura': ['Educação', 'Cultura'], 'O desafio de se conviver': ['Grupos vulneráveis'],
    'Como preservar a floresta': ['Meio ambiente'], 'O indivíduo frente à ética': ['Cidadania e política'],
    'O trabalho na construção': ['Economia e trabalho'], 'Viver em rede': ['Tecnologia e comunicação'],
    'O movimento imigratório': ['Grupos vulneráveis'], 'Efeitos da implantação da Lei Seca': ['Segurança e violência', 'Saúde'],
    'Publicidade infantil': ['Tecnologia e comunicação', 'Grupos vulneráveis'], 'A persistência da violência contra a mulher': ['Segurança e violência', 'Grupos vulneráveis'],
    'Caminhos para combater a intolerância': ['Cultura'], 'Desafios para a formação educacional de surdos': ['Educação', 'Grupos vulneráveis'],
    'Manipulação do comportamento': ['Tecnologia e comunicação'], 'Democratização do acesso ao cinema': ['Cultura'],
    'O estigma associado às doenças mentais': ['Saúde'], 'Invisibilidade e registro civil': ['Cidadania e política'],
    'Desafios para a valorização de comunidades': ['Cultura', 'Grupos vulneráveis'], 'Desafios para o enfrentamento da invisibilidade do trabalho': ['Economia e trabalho', 'Grupos vulneráveis'],
    'Desafios para a valorização da herança africana': ['Cultura', 'Grupos vulneráveis'], 'Perspectivas acerca do envelhecimento': ['Grupos vulneráveis', 'Saúde'],
}
def macros(tema):
    for k, v in MACRO.items():
        if tema.startswith(k): return v
    raise SystemExit(f'tema sem grande assunto: {tema}')

def aprovar(ns):
    sim = sum(n['c2_200'] == 'sim' for n in ns); bolso = sum(n['bolso'] == 1 for n in ns)
    pert = sum(n['pertinente'] for n in ns) / len(ns); prod = sum(n['produtivo'] for n in ns) / len(ns)
    return sim * 2 > len(ns) and bolso * 2 < len(ns) and pert >= 1.5 and prod >= 1.5

def carregar(chave_arq, prefixo, pasta):
    chave = json.loads((pasta / chave_arq).read_text())
    notas = {j: {n['id']: n for n in json.loads((pasta / f'{prefixo}{j}.json').read_text())} for j in JUIZES}
    out = {}
    for id_, k in chave.items():
        ns = [notas[j][id_] for j in JUIZES if id_ in notas[j]]
        if len(ns) == 3: out[id_] = {**k, 'aprovado': aprovar(ns), 'ns': ns}
    return out

# (1) cobertura: tema -> coringa -> aprovado
cob = defaultdict(dict)
for r in carregar('chave.json', 'juiz-', P).values():
    if r['item'] in ('Drummond', 'Dom Hélder', 'Graciliano', 'Machado', 'Dado 1888'): cob[r['tema']][r['item']] = r['aprovado']
for r in carregar('chave-r2.json', 'juiz-r2-', P).values():
    if r['item'] in R2: cob[r['tema']][R2[r['item']]] = r['aprovado']
m = carregar('chave-m.json', 'juiz-m-', M)
for r in m.values():
    if r['item'] in CORINGAS: cob[r['tema']][r['item']] = r['aprovado']

print(f'Temas: {len(cob)}\n')
print('| Coringa | Temas aprovados | ' + ' | '.join(sorted({x for t in cob for x in macros(t)})) + ' |')
grupos = sorted({x for t in cob for x in macros(t)})
print('|---|---|' + '---|' * len(grupos))
for c in CORINGAS:
    temas = [t for t in cob if c in cob[t]]
    ok = sum(cob[t][c] for t in temas)
    cel = []
    for g in grupos:
        tg = [t for t in temas if g in macros(t)]
        cel.append(f'{sum(cob[t][c] for t in tg)}/{len(tg)}')
    print(f'| {c} | {ok}/{len(temas)} | ' + ' | '.join(cel) + ' |')

# Melhor combinação: em quantos temas pelo menos 1 dos 3 primeiros serve.
top = ['Drummond', 'Dom Hélder', 'Rui Barbosa']
algum = sum(any(cob[t].get(c) for c in top) for t in cob)
print(f'\nTemas em que Drummond, Dom Hélder OU Rui Barbosa serve: {algum}/{len(cob)}')
algum8 = sum(any(cob[t].get(c) for c in CORINGAS) for t in cob)
print(f'Temas em que pelo menos 1 dos 8 serve: {algum8}/{len(cob)}')

# (2) calibração
for nome in ['bauman_bolso', 'ancora_Drummond', 'ancora_Dado esgoto']:
    rs = [r for r in m.values() if r['item'] == nome]
    print(f'Calibração {nome}: {sum(r["aprovado"] for r in rs)}/{len(rs)} aprovados')

# (3) redações nota 1000: original x coringa
if all((M / f'juiz-r-{j}.json').exists() for j in JUIZES):
    rr = carregar('chave-r.json', 'juiz-r-', M)
    por = defaultdict(dict)
    for r in rr.values(): por[r['redacao']][r['versao']] = r
    pares = [v for v in por.values() if 'original' in v and 'coringa' in v]
    q = lambda r: sum(n['qualidade'] for n in r['ns']) / 3
    oa = sum(v['original']['aprovado'] for v in pares); ca = sum(v['coringa']['aprovado'] for v in pares)
    print(f'\nRedações nota 1000 ({len(pares)} pares):')
    print(f'  sustenta 200 no repertório: original {oa}/{len(pares)}, com coringa {ca}/{len(pares)}')
    print(f'  qualidade média: original {sum(q(v["original"]) for v in pares)/len(pares):.2f}, com coringa {sum(q(v["coringa"]) for v in pares)/len(pares):.2f}')
    melhor = sum(q(v['coringa']) > q(v['original']) for v in pares); pior = sum(q(v['coringa']) < q(v['original']) for v in pares)
    print(f'  coringa melhor em {melhor}, pior em {pior}, igual em {len(pares)-melhor-pior}')
    pc = defaultdict(lambda: [0, 0])
    for v in pares:
        c = v['coringa']['coringa']; pc[c][0] += v['coringa']['aprovado']; pc[c][1] += 1
    print('  por coringa (aprovado/usado):', {k: f'{a}/{b}' for k, (a, b) in sorted(pc.items(), key=lambda x: -x[1][1])})
