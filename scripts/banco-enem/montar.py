"""Monta os arquivos do banco ENEM a partir de fichas curtas em Python.

Pablo, 16/11/2026: "várias questões parecidas" (toalha, disco, eletrodinâmica,
estatística, probabilidade, geometria misturada) para a rotina de estudo.
Cada ficha traz só o conteúdo; aqui vira o formato de
data/revisao-final/dia-2/LEIA-ME.md, e a conta de cada questão é refeita
(campo `confere`) antes de gravar: se não bater com a letra certa, para tudo.

Uso: python3 scripts/banco-enem/montar.py cobrir_e_chance
Grava data/revisao-final/banco-enem/<arquivo>.json. Depois: npm test.
"""
import importlib
import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parents[2]
PASTA = RAIZ / 'data/revisao-final/banco-enem'
LETRAS = 'ABCDE'
ORIGEM = 'Banco ENEM do dia 2'  # o teste e o script de gravação esperam esta origem
MAX_LINHA_RAPIDO = 170


def numero(texto):
    """Primeiro número de uma alternativa ('R$ 1 200,50' -> 1200.5)."""
    achado = re.search(r'-?\d[\d ]*(?:,\d+)?', texto)
    if not achado:
        raise ValueError(f'sem número em: {texto}')
    return float(achado.group().replace(' ', '').replace(',', '.'))


def montar(f):
    certa = f['alts'][LETRAS.index(f['resp'])]
    if 'confere' in f:
        valor = f['confere']
        if abs(valor - numero(certa)) > 0.01 * max(1, abs(valor)):
            raise SystemExit(f"{f['id']}: a conta deu {valor}, mas a letra {f['resp']} diz {certa}")
    # Mesma régua de lib/tutor/pronta.ts: ideia com até 300 letras e 2 frases.
    frases_ideia = [p for p in re.split(r'(?<=[.!?])\s+', f['ideia'].strip()) if p]
    if len(f['ideia']) > 300 or len(frases_ideia) > 2:
        raise SystemExit(f"{f['id']}: ideia longa ({len(f['ideia'])} letras, {len(frases_ideia)} frases; máximo 300 e 2)")
    rapido = f['rapido']
    if not rapido.startswith('Macete de'):
        raise SystemExit(f"{f['id']}: Jeito rápido tem que começar com 'Macete de'")
    longas = [l for l in rapido.split('\n') if len(l) > MAX_LINHA_RAPIDO]
    if longas:
        raise SystemExit(f"{f['id']}: linha do Jeito rápido com mais de {MAX_LINHA_RAPIDO} letras: {longas[0][:60]}")
    nome, rotulos = f['fig']
    quadro = {'tipo': 'quadro', **f['quadro']}
    passos = [
        {'titulo': 'A pergunta', 'texto': f['pergunta'], 'visual': {'tipo': 'figura', 'nome': nome, 'titulo': f.get('fig_titulo', 'A situação'), 'rotulos': rotulos}},
        {'titulo': 'O que acontece', 'texto': f['acontece'], **({'visual': f['visual2']} if f.get('visual2') else {})},
        {'titulo': 'Jeito rápido', 'texto': rapido, 'visual': quadro},
        {'titulo': f.get('titulo_funciona', 'Por que funciona'), 'texto': f['funciona']},
        {'titulo': 'A resposta', 'texto': f['resposta']},
    ]
    pergunta, opcoes, certa_sv, porque = f['sua_vez']
    return {
        'id': f['id'], 'materia': f['materia'], 'tema': f['tema'],
        'enunciado': f['enun'], **dict(zip(LETRAS, f['alts'])), 'resposta': f['resp'], 'origem': ORIGEM,
        'explicacao': {
            'conferencia': f['conferencia'], 'ideia': f['ideia'],
            'pecas': [{'termo': t, 'significado': s} for t, s in f.get('pecas', [])],
            'passos': passos, 'seuErro': None,
            'checagem': {'pergunta': pergunta, 'opcoes': opcoes, 'certa': certa_sv, 'resposta': porque},
        },
    }


def main():
    for nome in sys.argv[1:]:
        sys.path.insert(0, str(pathlib.Path(__file__).parent))
        modulo = importlib.import_module(nome)
        questoes = [montar(f) for f in modulo.FICHAS]
        letras = {l: sum(q['resposta'] == l for q in questoes) for l in LETRAS}
        destino = PASTA / f"{modulo.ARQUIVO}.json"
        destino.write_text(json.dumps(questoes, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
        print(f'{destino.name}: {len(questoes)} questões, contas conferidas, letras {letras}')


if __name__ == '__main__':
    main()
