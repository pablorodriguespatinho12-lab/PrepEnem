"""Troca a aula de questões que já existem pela do jeito do robô (Pablo, 17/11/2026:
"faz esse tipo de forma com todas as questões das provas").

Só mexe em explicacao.passos (e na ideia, se a ficha trouxer uma nova). Enunciado,
alternativas, gabarito, peças e "Sua vez" ficam como estão; nas questões reais do
ENEM eles nunca mudam. Se a ficha tem `confere`, a conta é refeita e tem que bater
com a alternativa certa.

Uso: python3 scripts/banco-enem/refazer_aulas.py <modulo> [<modulo> ...]
O módulo (em scripts/banco-enem/aulas/) define ARQUIVO (caminho do JSON a partir da
raiz) e AULAS = {id: dict(aula..., confere=?, ideia=?)}.
"""
import importlib
import json
import pathlib
import sys

from montar import RAIZ, numero, passos_aula

PASTA_AULAS = pathlib.Path(__file__).parent / 'aulas'
MAX_IDEIA = 300


def refazer(modulo):
    destino = RAIZ / modulo.ARQUIVO
    questoes = json.loads(destino.read_text(encoding='utf8'))
    por_id = {q['id']: q for q in questoes}
    faltam = [i for i in modulo.AULAS if i not in por_id]
    if faltam:
        raise SystemExit(f'{modulo.__name__}: ids que não estão em {modulo.ARQUIVO}: {faltam}')
    for qid, ficha in modulo.AULAS.items():
        q = por_id[qid]
        if 'confere' in ficha:
            certa = q[q['resposta']]
            if abs(ficha['confere'] - numero(certa)) > 0.01 * max(1, abs(ficha['confere'])):
                raise SystemExit(f"{qid}: a conta deu {ficha['confere']}, mas a letra {q['resposta']} diz {certa}")
        aula = {k: v for k, v in ficha.items() if k not in ('confere', 'ideia')}
        q['explicacao']['passos'] = passos_aula({'aula': aula})
        if ficha.get('ideia'):
            if len(ficha['ideia']) > MAX_IDEIA:
                raise SystemExit(f'{qid}: ideia com mais de {MAX_IDEIA} letras')
            q['explicacao']['ideia'] = ficha['ideia']
    destino.write_text(json.dumps(questoes, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(f'{modulo.ARQUIVO}: {len(modulo.AULAS)} aulas trocadas de {len(questoes)} questões')


def main():
    sys.path.insert(0, str(PASTA_AULAS))
    for nome in sys.argv[1:]:
        refazer(importlib.import_module(nome))


if __name__ == '__main__':
    main()
