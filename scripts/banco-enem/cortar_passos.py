#!/usr/bin/env python3
"""Corta passo de explicação com mais de 300 letras em telas curtas (regra do Pablo, 14/11/2026:
"não gosto de rolar telas... passo com mais de ~4 linhas ou ~300 letras é longo demais").

A 1ª tela guarda o título original (os testes procuram "Volta na equação", "Achando x:" etc.) e o desenho (visual);
as seguintes se chamam "<título> (2 de 3)". Idempotente: passo já curto não muda.

Uso como biblioteca: dividir_passo(passo) -> lista de passos.
Uso como programa:   python3 scripts/banco-enem/cortar_passos.py <arquivo.json> [...]   (reescreve o arquivo)
"""
import json
import re
import sys

LIMITE = 300
TITULO_MAX = 80
FRASE = re.compile(r'(?<=[.;?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9(−√"\'“])')


def _unidades(texto):
    """Quebra o texto em pedaços (linha ou frase), cada um com o separador que veio antes dele."""
    saida = []
    for i, linha in enumerate(texto.split('\n')):
        partes = [linha] if len(linha) <= LIMITE else FRASE.split(linha)
        for j, parte in enumerate(partes):
            saida.append((parte, '\n' if (j == 0 and i > 0) else ' '))
    return saida


def _juntar(unidades):
    blocos, atual = [], ''
    for texto, sep in unidades:
        candidato = texto if not atual else atual + sep + texto
        if atual and len(candidato) > LIMITE:
            blocos.append(atual)
            atual = texto
        else:
            atual = candidato
    if atual:
        blocos.append(atual)
    return blocos


def dividir_passo(passo):
    texto = passo.get('texto', '')
    if len(texto) <= LIMITE:
        return [passo]
    blocos = _juntar(_unidades(texto))
    if len(blocos) == 1:
        return [passo]
    n = len(blocos)
    saida = []
    for k, bloco in enumerate(blocos):
        novo = {'titulo': passo['titulo'] if k == 0 else f"{passo['titulo']} ({k + 1} de {n})", 'texto': bloco}
        if len(novo['titulo']) > TITULO_MAX:
            novo['titulo'] = novo['titulo'][: TITULO_MAX - 8].rstrip() + f' ({k + 1}/{n})'
        if k == 0 and passo.get('visual'):
            novo['visual'] = passo['visual']
        saida.append(novo)
    return saida


def cortar_questao(q):
    passos = q['explicacao']['passos']
    q['explicacao']['passos'] = [c for p in passos for c in dividir_passo(p)]
    return q


def principal(arquivos):
    for arq in arquivos:
        with open(arq, encoding='utf-8') as f:
            qs = json.load(f)
        antes = sum(len(q['explicacao']['passos']) for q in qs)
        for q in qs:
            cortar_questao(q)
        depois = sum(len(q['explicacao']['passos']) for q in qs)
        restam = sum(1 for q in qs for p in q['explicacao']['passos'] if len(p['texto']) > LIMITE)
        with open(arq, 'w', encoding='utf-8') as f:
            json.dump(qs, f, ensure_ascii=False, indent=1)
            f.write('\n')
        print(f'{arq}: passos {antes} -> {depois}; ainda >{LIMITE} letras: {restam}')


if __name__ == '__main__':
    principal(sys.argv[1:])
