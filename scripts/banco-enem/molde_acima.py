#!/usr/bin/env python3
"""Montador único das questões de nível acima (molde do robô do Pablo): dados -> equação em letras -> uma letra por tela
-> volta na equação -> receita -> "Sua vez". Usado por acima_fisica_novas.py, acima_aritmetica_novas.py e pela fábrica v2.

`montar(q)` recebe o dict da questão (ver docs/nivel-acima/molde-v2.md) e devolve o JSON gravável em
data/revisao-final/escada/*.json. Corta passo em telas de 300 letras (cortar_passos.dividir_passo).
"""
import re

from cortar_passos import dividir_passo

LETRAS = 'ABCDE'


def br(x):
    """Número no jeito brasileiro (vírgula decimal, espaço nos milhares)."""
    if isinstance(x, str):
        return x
    s = f'{x:,.10g}'.replace(',', ' ')
    return s.replace('.', ',')


def origem_em_telas(origem):
    """`origem` é um texto ou uma lista de textos: cada um vira uma tela de até 900 letras."""
    if not origem:
        return []
    textos = [origem] if isinstance(origem, str) else list(origem)
    for t in textos:
        assert len(t) <= 900, (len(t), t[:60])
    n = len(textos)
    return [{'titulo': 'De onde vem cada fórmula' + (f' ({i + 1} de {n})' if n > 1 else ''), 'texto': t} for i, t in enumerate(textos)]


def linhas_dados(dados):
    """Cada célula da tabela "O que eu tenho" cabe em 60 letras: valor longo vira linhas "<rótulo> (cont.)", cortando em "; "."""
    saida = []
    for rotulo, valor in dados:
        if len(valor) <= 60:
            saida.append((rotulo, valor))
            continue
        partes, atual = [], ''
        trechos = [x for t in valor.split('; ') for x in (t.split(', ') if len(t) > 60 else [t])]
        for trecho in trechos:
            candidato = trecho if not atual else atual + '; ' + trecho
            if atual and len(candidato) > 60:
                partes.append(atual)
                atual = trecho
            else:
                atual = candidato
        partes.append(atual)
        saida.extend((rotulo if i == 0 else f'{rotulo} (cont.)', p) for i, p in enumerate(partes))
    return saida


def ideia_em_duas_frases(texto):
    """O validador (lib/tutor/validar.ts) aceita `ideia` com até 300 letras e 2 frases: junta as frases além da 2ª com "; "."""
    partes = [p for p in re.split(r'(?<=[.!?])\s+', texto.strip()) if p]
    if len(partes) <= 2:
        return texto
    resto = []
    for p in partes[1:]:
        p = p.rstrip('.!?')
        if len(p) > 1 and p[0].isupper() and p[1].islower():
            p = p[0].lower() + p[1:]
        resto.append(p)
    return partes[0] + ' ' + '; '.join(resto) + '.'


def montar(q):
    alts = q['alts']  # [(texto, valor, motivo)] em ordem crescente
    certa = next(i for i, a in enumerate(alts) if abs(a[1] - q['calc']) < 1e-6 * max(1, abs(q['calc'])))
    # Letra certa espalhada (A a E em ciclo): as erradas mantêm a ordem, a certa vai para a posição pedida.
    alvo = q['pos']
    resto = [a for i, a in enumerate(alts) if i != certa]
    alts = resto[:alvo] + [alts[certa]] + resto[alvo:]
    certa = alvo
    assert alts[certa][2] == 'OK', (q['id'], 'a alternativa certa deve ter motivo OK')
    assert sum(a[2] == 'OK' for a in alts) == 1, q['id']
    assert len({a[0] for a in alts}) == 5, q['id']
    erros = '; '.join(f'Alternativa {LETRAS[i]} = {a[2]}' for i, a in enumerate(alts) if i != certa)
    conferencia = f"{q['resumo']} Resposta: alternativa {LETRAS[certa]}. Erros: {erros}."
    dados = '; '.join(f'{k}: {v}' for k, v in q['dados'])
    passos = [
        {'titulo': 'As fórmulas desta questão', 'texto': q.get('intro_formulas', 'Cada fórmula é explicada, com números, no passo em que for usada. Aqui você só vê o nome dela.'),
         'visual': {'tipo': 'formulas', 'itens': [{'figura': f[0], 'nome': f[1], 'formula': f[2]} for f in q['formulas']]}},
        {'titulo': 'O que eu tenho', 'texto': 'Primeiro, tire os dados do enunciado.',
         'visual': {'tipo': 'tabela', 'titulo': 'O que eu tenho', 'cabecalho': ['Informação', 'Valor'], 'linhas': [list(d) for d in linhas_dados(q['dados'])]}},
        *origem_em_telas(q.get('origem')),
        *([{'titulo': 'O desenho', 'texto': q['desenho'][0], 'visual': {'tipo': 'diagrama', 'nome': q['desenho'][1], 'rotulos': q['desenho'][2]}}] if q.get('desenho') else []),
        {'titulo': 'A equação em letras',
         'texto': q['eq_texto'],
         'visual': {'tipo': 'equacao', 'formula': q['eq'], 'leitura': q['leitura'], 'letras': [{'letra': l, 'oque': o} for l, o in q['letras']]}},
    ]
    for achado in q['achando']:
        passo = {'titulo': achado[0], 'texto': achado[1]}
        if len(achado) > 2:
            passo['visual'] = achado[2]
        passos.append(passo)
    volta = re.sub(r'(Letra|Resposta: alternativa) [A-EX]\.', f'Resposta: alternativa {LETRAS[certa]}.', q['volta'])  # X = letra provisória dos autores v2
    passos.append({'titulo': 'Volta na equação', 'texto': volta,
                   'visual': {'tipo': 'tabela', 'titulo': 'As letras', 'cabecalho': ['Letra', 'Valor'], 'linhas': [list(l) for l in q['valores']]}})
    if q.get('porque'):
        passos.append({'titulo': q['porque'][0], 'texto': q['porque'][1]})
    passos.append({'titulo': 'Questão parecida? Faça assim', 'texto': f"Pista: {q['pista']}",
                   'visual': {'tipo': 'tabela', 'titulo': 'A receita', 'cabecalho': ['Passo', 'Nesta questão'],
                              'linhas': [list(l) for l in linhas_dados([('1. Tabela do que eu tenho', q['rec1']), ('2. Equação em letras', q['eq']), ('3. Uma letra por vez', q['rec3'])])]}})
    passos = [curto for p in passos for curto in dividir_passo(p)]  # regra 14/11: passo até ~300 letras, sem rolar
    c = q['checagem']
    return {
        'id': q['id'], 'materia': q.get('materia', 'Física'), 'tema': q['tema'], 'nivel': 'acima', 'origem': 'Escada',
        **({'ancora': q['ancora']} if q.get('ancora') else {}),
        **({'canal': q['canal']} if q.get('canal') else {}),
        'enunciado': f"{q['enunciado']}\n\nDados: {dados}.",
        **{LETRAS[i]: a[0] for i, a in enumerate(alts)}, 'resposta': LETRAS[certa],
        'explicacao': {
            'conferencia': conferencia, 'ideia': ideia_em_duas_frases(q['ideia']),
            'pecas': [{'termo': t, 'significado': s} for t, s in q['pecas']],
            'passos': passos,
            'checagem': {'pergunta': c[0], 'opcoes': c[1], 'certa': c[2], 'resposta': c[3]},
            'seuErro': None,
        },
    }


