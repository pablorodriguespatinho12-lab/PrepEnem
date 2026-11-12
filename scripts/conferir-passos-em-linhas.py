"""Confere a reescrita dos passos do dia 2 em linhas (Pablo, 12/11/2026: "o texto
mais organizado e que seja entendível").

Compara cada arquivo de data/revisao-final/dia-2 com a versão do último commit:
- mesmas questões, mesmos títulos e figuras dos passos (só o texto pode mudar);
- os NÚMEROS de cada passo continuam os mesmos (reescrever não pode mudar conta);
- passo com mais de LIMITE_SEM_QUEBRA letras tem que estar em linhas, e
  nenhuma linha passa de LIMITE_LINHA.

Uso: python3 scripts/conferir-passos-em-linhas.py [arquivo.json ...]
"""
import collections
import glob
import json
import re
import subprocess
import sys

PASTA = 'data/revisao-final/dia-2'
LIMITE_SEM_QUEBRA = 200
LIMITE_LINHA = 170
NUMERO = re.compile(r'\d+(?:[.,]\d+)*')


def numeros(texto: str) -> collections.Counter:
    return collections.Counter(NUMERO.findall(texto))


def antes(caminho: str) -> list:
    bruto = subprocess.run(['git', 'show', f'HEAD:{caminho}'], capture_output=True, text=True, check=True).stdout
    return json.loads(bruto)


def conferir(caminho: str, reescritas: set) -> list:
    erros = []
    velhas = {q['id']: q for q in antes(caminho)}
    for q in json.load(open(caminho, encoding='utf8')):
        v = velhas.get(q['id'])
        if v is None:
            erros.append(f"{q['id']}: questão nova")
            continue
        pn, pv = q['explicacao']['passos'], v['explicacao']['passos']
        if q['id'] in reescritas:
            pv = pn  # reescrita à mão de propósito (mangueira); só confere o tamanho
        elif [p['titulo'] for p in pn] != [p['titulo'] for p in pv] or [p.get('visual') for p in pn] != [p.get('visual') for p in pv]:
            erros.append(f"{q['id']}: título ou figura de passo mudou")
            continue
        for i, (n, o) in enumerate(zip(pn, pv)):
            marca = f"{q['id']} passo {i + 1} ({n['titulo']})"
            if numeros(n['texto']) != numeros(o['texto']):
                falta = numeros(o['texto']) - numeros(n['texto'])
                sobra = numeros(n['texto']) - numeros(o['texto'])
                erros.append(f"{marca}: números mudaram (sumiu {dict(falta)}, entrou {dict(sobra)})")
            if len(n['texto']) > LIMITE_SEM_QUEBRA and '\n' not in n['texto']:
                erros.append(f"{marca}: {len(n['texto'])} letras sem quebra de linha")
            linhas = n['texto'].split('\n')
            longas = [len(l) for l in linhas if len(l) > LIMITE_LINHA] if len(linhas) > 1 else []
            if longas:
                erros.append(f"{marca}: linha com {max(longas)} letras (máximo {LIMITE_LINHA})")
    return erros


def main() -> int:
    arquivos = sys.argv[1:] or sorted(f for f in glob.glob(f'{PASTA}/*.json') if 'aulas' not in f)
    reescritas = {'cmouei967006buoz9sn75cdpe', 'd2-medio-mat-01', 'd2-dificil-mat-01', 'cmouei98g007fuoz9zgosga5e'}
    total = 0
    for caminho in arquivos:
        erros = conferir(caminho, reescritas)
        total += len(erros)
        print(f"{caminho}: {len(erros)} problema(s)")
        for e in erros:
            print('  ' + e)
    return 1 if total else 0


if __name__ == '__main__':
    sys.exit(main())
