# Junta a cobertura de TODOS os coringas nos 28 temas do ENEM (1998 a 2025):
# antigos (rodadas 1, 2 e grandes assuntos, juízes Opus, Sonnet e Fable) e
# novos (rodadas 3 e 4, juízes Haiku, Sonnet e Fable). Imprime a tabela por
# grande assunto e os melhores trios para Pacto + 3 parágrafos.
# Quarteto = Pacto (a lei) + 3 coringas, um na introdução, um no D1, um no D2.
# Um trio só "serve" num tema se os 3 passaram nele. Coringas com o mesmo
# mecanismo (Drummond e João Cabral: "só lei/palavra não basta") não entram
# juntos. Uso: python3 r4/quartetos.py
import json, itertools, sys
from collections import defaultdict
from pathlib import Path

P = Path(__file__).parent.parent
sys.path.insert(0, str(P / 'grandes-assuntos'))
fonte = (P / 'grandes-assuntos' / 'somar_macro.py').read_text()
MACRO = eval(fonte.split('MACRO = ')[1].split('\ndef macros')[0])


def macros(tema):
    for k, v in MACRO.items():
        if tema.startswith(k):
            return v
    raise SystemExit(f'tema sem grande assunto: {tema}')


def aprovar(ns):
    sim = sum(n['c2_200'] == 'sim' for n in ns)
    bolso = sum(n['bolso'] == 1 for n in ns)
    pert = sum(n['pertinente'] for n in ns) / len(ns)
    prod = sum(n['produtivo'] for n in ns) / len(ns)
    return sim * 2 > len(ns) and bolso * 2 < len(ns) and pert >= 1.5 and prod >= 1.5


def carregar(pasta, chave_arq, prefixo, juizes):
    chave = json.loads((pasta / chave_arq).read_text())
    notas = {j: {n['id']: n for n in json.loads((pasta / f'{prefixo}{j}.json').read_text())} for j in juizes}
    for id_, k in chave.items():
        ns = [notas[j][id_] for j in juizes if id_ in notas[j]]
        if len(ns) == len(juizes):
            yield k, aprovar(ns)


ANTIGOS = {'Drummond', 'Dom Hélder', 'Rui Barbosa', 'Elie Wiesel', 'Graciliano', 'Luther King', 'Machado', 'Dado 1888'}
NOME = {'rui_barbosa': 'Rui Barbosa', 'elie_wiesel': 'Elie Wiesel', 'luther_king': 'Luther King',
        'joao_cabral': 'João Cabral', 'darcy': 'Darcy', 'brecht': 'Brecht', 'galeano': 'Galeano'}
VELHOS = ['opus', 'sonnet', 'fable']
NOVOS = ['haiku', 'sonnet', 'fable']

cob = defaultdict(dict)
fontes = [(P, 'chave.json', 'juiz-', VELHOS), (P, 'chave-r2.json', 'juiz-r2-', VELHOS),
          (P / 'grandes-assuntos', 'chave-m.json', 'juiz-m-', VELHOS),
          (P / 'r3', 'chave.json', 'juiz-', NOVOS), (P / 'r4', 'chave.json', 'juiz-', NOVOS)]
for pasta, chave, pref, js in fontes:
    if not (pasta / chave).exists():
        print('falta', pasta.name, chave)
        continue
    for k, ok in carregar(pasta, chave, pref, js):
        nome = NOME.get(k['item'], k['item'])
        novo = pasta.name in ('r3', 'r4')
        if nome in ANTIGOS and not novo:
            cob[k['tema']].setdefault(nome, ok)
        elif nome in ('João Cabral', 'Darcy', 'Brecht', 'Galeano') and novo:
            cob[k['tema']][nome] = ok

temas = sorted(cob)
coringas = sorted({c for t in temas for c in cob[t]}, key=lambda c: -sum(cob[t].get(c, False) for t in temas))
grupos = sorted({m for v in MACRO.values() for m in v})
print(f'{len(temas)} temas\n')
print('| Coringa | Total | ' + ' | '.join(grupos) + ' |')
print('|---' * (len(grupos) + 2) + '|')
for c in coringas:
    tt = [t for t in temas if c in cob[t]]
    cel = []
    for g in grupos:
        tg = [t for t in tt if g in macros(t)]
        cel.append(f'{sum(cob[t][c] for t in tg)}/{len(tg)}')
    print(f'| {c} | {sum(cob[t][c] for t in tt)}/{len(tt)} | ' + ' | '.join(cel) + ' |')

MESMO = [{'Drummond', 'João Cabral'}]
SO_RESTRITO = {'Machado', 'Dado 1888'}
cands = [c for c in coringas if c not in SO_RESTRITO]
trios = []
for trio in itertools.combinations(cands, 3):
    if any(m <= set(trio) for m in MESMO):
        continue
    servem = [t for t in temas if all(cob[t].get(c) for c in trio)]
    fracos = [g for g in grupos if not any(g in macros(t) for t in servem)]
    trios.append((len(servem), trio, fracos))
trios.sort(key=lambda x: (-x[0], len(x[2])))
print('\nMelhores trios (temas em que os 3 passaram, de 28):')
for n, trio, fracos in trios[:8]:
    print(f'  {n}/28  {" + ".join(trio)}   sem nenhum tema em: {", ".join(fracos) or "-"}')
(P / 'r4' / 'cobertura-28.json').write_text(json.dumps(cob, ensure_ascii=False, indent=1))
