# Escolhe, para cada coringa, o melhor parágrafo APROVADO pelos 3 juízes em
# cada grande assunto, e grava lib/redacao/exemplos-coringas.json para a ficha
# do coringa mostrar como exemplo (Pablo, 30/10/2026: "um exemplo com o tema X
# para eu fazer o meu texto Y"). Mesma régua de grandes-assuntos/somar_macro.py.
#
#   python3 docs/redacao/prova-coringas/exemplos.py
import json
import sys
from pathlib import Path

P = Path(__file__).parent
M = P / 'grandes-assuntos'
sys.path.insert(0, str(M))
sys.argv = ['', str(M), str(P)]
import io, contextlib  # noqa: E401
with contextlib.redirect_stdout(io.StringIO()):
    from somar_macro import carregar, macros, aprovar, CORINGAS, R2  # noqa: E402
sys.path.insert(0, str(P))
import novos  # noqa: E402

CORINGAS = novos.no_site(CORINGAS)
textos: dict[tuple[str, str], str] = {**novos.textos_novos()}
for arq in [*P.glob('escritor-*.json'), *M.glob('temas-antigos-escritor-*.json')]:
    for t in json.loads(arq.read_text()):
        textos[(t['tema'], R2.get(t['item'], t['item']))] = t['trecho']

aprovados = []
for chave, prefixo, pasta in [('chave.json', 'juiz-', P), ('chave-r2.json', 'juiz-r2-', P), ('chave-m.json', 'juiz-m-', M)]:
    for r in carregar(chave, prefixo, pasta).values():
        item = R2.get(r['item'], r['item'])
        if item not in CORINGAS or not r['aprovado']:
            continue
        texto = textos.get((r['tema'], item))
        if not texto:
            print('sem texto:', item, r['tema'], file=sys.stderr)
            continue
        # A 1ª rodada não deu nota de qualidade: vale a soma pertinente + produtivo.
        q = sum(n.get('qualidade', 2 * (n['pertinente'] + n['produtivo'])) for n in r['ns']) / 3
        aprovados.append({'coringa': item, 'tema': r['tema'], 'texto': texto, 'qualidade': round(q, 2), 'assuntos': macros(r['tema'])})
for tema, item, ok, ns in novos.vereditos_novos(aprovar):
    if ok and (tema, item) in textos:
        q = sum(2 * (n['pertinente'] + n['produtivo']) for n in ns) / len(ns)
        aprovados.append({'coringa': item, 'tema': tema, 'texto': textos[(tema, item)], 'qualidade': round(q, 2), 'assuntos': macros(tema)})

# Onde termina a frase do autor (ou o dado) em cada coringa.
FIM_CITACAO = {
    'Drummond': 'nascem da lei', 'Dom Hélder': 'comunista', 'Rui Barbosa': 'igualdade real',
    'Elie Wiesel': 'indiferença', 'Graciliano': 'bicho, Fabiano', 'Luther King': 'em todo lugar',
    'Machado': 'as batatas', 'Dado 1888': '1888', 'Brecht': 'comprimem', 'Galeano': 'donos de nada',
}
def fim_da_frase(texto: str, de: int) -> int:
    i = texto.find('. ', de)
    return len(texto) if i < 0 else i + 1
def partes(coringa: str, texto: str) -> dict[str, str] | None:
    i = texto.find(FIM_CITACAO[coringa])
    if i < 0:
        return None
    fim = fim_da_frase(texto, i) if coringa == 'Dado 1888' else i + len(FIM_CITACAO[coringa])
    while fim < len(texto) and texto[fim] in '.”"!»)':
        fim += 1
    sentido_fim = fim_da_frase(texto, fim)
    citacao, sentido, ligacao = texto[:fim].strip(), texto[fim:sentido_fim].strip(), texto[sentido_fim:].strip()
    return {'citacao': citacao, 'sentido': sentido, 'ligacao': ligacao} if sentido and ligacao else None
saida: dict[str, list[dict]] = {}
for c in CORINGAS:
    meus = sorted((a for a in aprovados if a['coringa'] == c and partes(c, a['texto'])), key=lambda a: -a['qualidade'])
    vistos_tema: set[str] = set()
    escolhidos = []
    for a in meus:
        if a['tema'] in vistos_tema:
            continue
        novo = [g for g in a['assuntos'] if not any(g in e['assuntos'] for e in escolhidos)]
        if novo:
            vistos_tema.add(a['tema'])
            escolhidos.append(a)
    saida[c] = [{'tema': a['tema'], 'assuntos': a['assuntos'], **partes(c, a['texto'])} for a in escolhidos]
    print(f'{c}: {len(meus)} aprovados, {len(escolhidos)} exemplos', [e['assuntos'] for e in escolhidos], file=sys.stderr)

destino = P.parents[2] / 'lib' / 'redacao' / 'exemplos-coringas.json'
destino.write_text(json.dumps(saida, ensure_ascii=False, indent=1) + '\n')
