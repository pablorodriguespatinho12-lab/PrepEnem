"""Junta aulas "Antes" novas ao data/revisao-final/antes-da-questao.json.

Entrada: um JSON com "conceitos" (id → aula) e "questoes" (id do conceito → ids das
questões). Conceito novo entra; questão ganha o conceito no fim da lista dela.
Uso: python3 scripts/juntar-antes.py scripts/data/antes-novos-13-11.json
"""
import json
import sys

ARQ = 'data/revisao-final/antes-da-questao.json'


def main() -> None:
    novos = json.load(open(sys.argv[1], encoding='utf8'))
    atual = json.load(open(ARQ, encoding='utf8'))
    conceitos = {**atual['conceitos'], **novos['conceitos']}
    questoes = {k: list(v) for k, v in atual['questoes'].items()}
    for conceito, ids in novos['questoes'].items():
        if conceito not in conceitos:
            raise SystemExit(f'conceito sem aula: {conceito}')
        for qid in ids:
            lista = questoes.setdefault(qid, [])
            if conceito not in lista:
                lista.append(conceito)
    with open(ARQ, 'w', encoding='utf8') as f:
        f.write(json.dumps({'conceitos': conceitos, 'questoes': questoes}, ensure_ascii=False, indent=2) + '\n')
    print(len(conceitos), 'conceitos,', len(questoes), 'questões com "Antes"')


if __name__ == '__main__':
    main()
