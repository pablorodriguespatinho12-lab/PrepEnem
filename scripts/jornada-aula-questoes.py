"""Monta, para o aluno-do-zero, a jornada de cada questão do dia 2: o que a aula do
tema ensinou (o que o aluno JÁ estudou), as telas "Antes" e a explicação, passo a passo.

Nasceu do pedido do Pablo (12/11/2026): "esse tipo de coisa não pode estar nos
outros conteúdos" (conteúdo não estudado e letra antes de número).

Uso: python3 scripts/jornada-aula-questoes.py <pasta-de-saida> [arquivo.json ...]
Sai um .md por arquivo de prova, na pasta pedida.
"""
import glob
import json
import os
import sys

PASTA = 'data/revisao-final/dia-2'
AULAS = json.load(open(f'{PASTA}/aulas.json', encoding='utf8'))
ANTES = json.load(open('data/revisao-final/antes-da-questao.json', encoding='utf8'))


def desenho(v) -> str:
    return f"[desenho {json.dumps(v, ensure_ascii=False)}]" if v else ''


def jornada(q: dict) -> list:
    aula = AULAS.get(q['tema'], {})
    out = [f"# Questão {q['id']} ({q['tema']})", '', '## O que a aula do tema ensinou (o aluno já viu)']
    out += [f"- {l}" for l in aula.get('aula', []) + aula.get('paraSubir', [])]
    for c in ANTES['questoes'].get(q['id'], []):
        k = ANTES['conceitos'][c]
        out += ['', f"## Antes: {k['titulo']}", *k['linhas'], desenho(k.get('visual'))]
    e = q['explicacao']
    out += ['', '## Enunciado', q['enunciado'], '', '## Ideia', e['ideia']]
    for p in e['passos']:
        out += ['', f"### Passo: {p['titulo']}", p['texto'], desenho(p.get('visual'))]
    return out + ['', '---', '']


def main() -> None:
    saida = sys.argv[1]
    arquivos = sys.argv[2:] or sorted(f for f in glob.glob(f'{PASTA}/*.json') if not f.endswith('aulas.json'))
    os.makedirs(saida, exist_ok=True)
    for caminho in arquivos:
        linhas = [l for q in json.load(open(caminho, encoding='utf8')) for l in jornada(q)]
        destino = os.path.join(saida, os.path.basename(caminho).replace('.json', '.md'))
        open(destino, 'w', encoding='utf8').write('\n'.join(linhas))
        print(destino, len(linhas), 'linhas')


if __name__ == '__main__':
    main()
