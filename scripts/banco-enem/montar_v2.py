#!/usr/bin/env python3
"""Fábrica v2 do nível acima (23/11/2026): reescreve as questões que a auditoria reprovou e completa as que ficam.

Cada área tem um módulo em scripts/banco-enem/v2/<slug>.py com:
  ARQUIVO     'fisica-acima-novas.json' | 'matematica-acima-novas.json' | 'matematica-aritmetica-novas.json'
  Q           lista de dicts no formato de molde_acima.montar (ver docs/nivel-acima/molde-v2.md): só as REESCRITAS e TROCADAS;
              cada uma com `antes` (ids de conceitos em antes-da-questao.json), `ancora` e `canal`
  MANTER      {id: {'ancora': ..., 'canal': ..., 'antes': [...]}} para as que ficam (corrige âncora, marca canal e Antes)
  ANTES_NOVOS {id_do_conceito: {titulo, linhas, visual, exercicios}} (opcional)

O programa monta cada Q, troca a entrada de mesmo id no JSON (ou acrescenta), aplica MANTER, grava o mapa
questão -> aulas "Antes" e escreve os arquivos. Idempotente.

Uso: python3 scripts/banco-enem/montar_v2.py [--seco] [slug ...]   (sem slug, todos os módulos de v2/; --seco só valida e NÃO grava)
"""
import importlib
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
sys.path.insert(0, os.path.join(AQUI, 'v2'))
from molde_acima import montar  # noqa: E402

RAIZ = os.path.join(AQUI, '..', '..', 'data', 'revisao-final')
ESCADA = os.path.join(RAIZ, 'escada')
ANTES = os.path.join(RAIZ, 'antes-da-questao.json')


def carregar(caminho):
    with open(caminho, encoding='utf-8') as f:
        return json.load(f)


def gravar(caminho, dados, indent):
    with open(caminho, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=indent)
        f.write('\n')


def posicao_da_certa(qid):
    """Letra certa espalhada sem depender da ordem de escrita (0 a 4, estável pelo id)."""
    return sum(ord(c) for c in qid) % 5


def principal(slugs, seco=False):
    if not slugs:
        slugs = sorted(f[:-3] for f in os.listdir(os.path.join(AQUI, 'v2')) if f.endswith('.py') and not f.startswith('_'))
    arquivos, antes = {}, carregar(ANTES)
    resumo = []
    for slug in slugs:
        mod = importlib.import_module(slug)
        lista = arquivos.setdefault(mod.ARQUIVO, carregar(os.path.join(ESCADA, mod.ARQUIVO)))
        indice = {q['id']: i for i, q in enumerate(lista)}
        for q in getattr(mod, 'Q', []):
            q.setdefault('pos', posicao_da_certa(q['id']))
            saida = montar(q)
            if q['id'] in indice:
                lista[indice[q['id']]] = saida
            else:
                indice[q['id']] = len(lista)
                lista.append(saida)
            antes['questoes'][q['id']] = list(q['antes'])
        for qid, campos in getattr(mod, 'MANTER', {}).items():
            assert qid in indice, f'{slug}: MANTER de id que não existe: {qid}'
            entrada = lista[indice[qid]]
            for chave in ('ancora', 'canal'):
                if campos.get(chave):
                    entrada[chave] = campos[chave]
            antes['questoes'][qid] = list(campos['antes'])
        antes['conceitos'].update(getattr(mod, 'ANTES_NOVOS', {}))
        resumo.append(f'{slug}: {len(getattr(mod, "Q", []))} reescritas, {len(getattr(mod, "MANTER", {}))} mantidas')
    for chave, ids in antes['questoes'].items():
        for c in ids:
            assert c in antes['conceitos'], f'{chave}: conceito Antes inexistente: {c}'
    for arq, lista in arquivos.items():
        ids = [q['id'] for q in lista]
        assert len(ids) == len(set(ids)), f'{arq}: ids repetidos'
        if not seco:
            gravar(os.path.join(ESCADA, arq), lista, 1)
    if not seco:
        gravar(ANTES, antes, 2)
    print('\n'.join(resumo))
    if seco:
        print('MODO SECO: nada foi gravado. Resumo por questão (letras do enunciado, passos, maior passo):')
        for lista in arquivos.values():
            for q in lista:
                if q['id'] in {i for sl in slugs for i in [x['id'] for x in getattr(sys.modules[sl], 'Q', [])]}:
                    p = q['explicacao']['passos']
                    print(f"  {q['id']}: enunciado {len(q['enunciado'])}, passos {len(p)}, maior passo {max(len(x['texto']) for x in p)}, resposta {q['resposta']}")


if __name__ == '__main__':
    argumentos = [a for a in sys.argv[1:] if not a.startswith('--')]
    principal(argumentos, seco='--seco' in sys.argv)
