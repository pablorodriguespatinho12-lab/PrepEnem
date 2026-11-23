#!/usr/bin/env python3
"""Liga as questões de nível acima novas (Física e Aritmética) às aulas "Antes" e cria os 5 conceitos que faltavam.

Regra do Pablo (12/11/2026, "explicacao-so-com-o-que-ele-estudou"): conteúdo de outro tema vira aula "Antes" curta com
2 exercícios, antes da explicação; a explicação não ensina conteúdo novo. Os conceitos existentes (velocidade, queda,
aceleracao, curva, porcentagem, numero-que-falta, dividir-por-decimal) já foram aprovados por ele: só se ligam.

Uso: python3 scripts/banco-enem/antes_nivel_acima.py   (reescreve data/revisao-final/antes-da-questao.json; idempotente)
"""
import json
import os

ARQ = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'revisao-final', 'antes-da-questao.json')


def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


NOVOS = {
    'pitagoras': {
        'titulo': 'Canto reto: a diagonal (Pitágoras)',
        'linhas': [
            'Dois lados formam um canto reto, e a diagonal fecha o triângulo. A diagonal é o lado maior.',
            'Regra: diagonal · diagonal = lado1 · lado1 + lado2 · lado2.',
            'Exemplo: lados 3 e 4. 3 · 3 = 9 e 4 · 4 = 16; 9 + 16 = 25. A diagonal é o número que vezes ele mesmo dá 25: 5.',
            'Raiz quadrada (√) é isso: √25 = 5, porque 5 · 5 = 25. Outro: lados 6 e 8: 36 + 64 = 100, e √100 = 10.',
        ],
        'visual': tabela('Três triângulos de canto reto', ['Lados', 'Soma dos quadrados', 'Diagonal'], [['3 e 4', '9 + 16 = 25', '5'], ['6 e 8', '36 + 64 = 100', '10'], ['5 e 12', '25 + 144 = 169', '13']]),
        'exercicios': [
            {'enunciado': 'Um triângulo de canto reto tem lados 9 e 12. Quanto mede a diagonal?', 'alternativas': ['15', '21', '3', '10,5'], 'certa': 0,
             'resolucao': '15: 9 · 9 = 81 e 12 · 12 = 144; 81 + 144 = 225, e 15 · 15 = 225.\n21 é somar 9 + 12; 3 é subtrair; 10,5 é a média.'},
            {'enunciado': 'Um barco anda 8 m/s para o norte e 15 m/s para o leste. Qual a velocidade total (a diagonal)?', 'alternativas': ['17 m/s', '23 m/s', '7 m/s', '12 m/s'], 'certa': 0,
             'resolucao': '17 m/s: 8 · 8 = 64 e 15 · 15 = 225; 64 + 225 = 289, e 17 · 17 = 289.\n23 é somar 8 + 15; 7 é subtrair; 12 é a média.'},
        ],
    },
    'fracoes': {
        'titulo': 'Frações: um quarto, três quartos e somar',
        'linhas': [
            "1/4 lê-se 'um quarto': dividir em 4 partes iguais e pegar 1. 3/4 são 3 dessas partes.",
            'Pegar 1/4 de 40 é 40 ÷ 4 = 10. Pegar 3/4 de 40 é 3 · 10 = 30. Com vírgula: 1/4 = 0,25 e 3/4 = 0,75.',
            'Para somar ou subtrair, deixe o mesmo número embaixo: 1/2 = 2/4, então 1/2 + 1/4 = 2/4 + 1/4 = 3/4.',
            'Para trocar, multiplique em cima e embaixo pelo mesmo número: 1/3 = (1 · 2)/(3 · 2) = 2/6.',
            'Outro: 1/2 − 1/3 = 3/6 − 2/6 = 1/6.',
        ],
        'visual': tabela('Frações comuns', ['Fração', 'Em partes', 'Com vírgula'], [['1/4', '1 de 4', '0,25'], ['1/2', '1 de 2', '0,5'], ['3/4', '3 de 4', '0,75']]),
        'exercicios': [
            {'enunciado': 'Quanto é 3/4 de 80?', 'alternativas': ['60', '20', '240', '83'], 'certa': 0,
             'resolucao': '60: 80 ÷ 4 = 20 e 3 · 20 = 60.\n20 é só 1/4; 240 é 80 · 3; 83 é 80 + 3.'},
            {'enunciado': 'Quanto é 1/2 − 1/3?', 'alternativas': ['1/6', '2/5', '1/5', '5/6'], 'certa': 0,
             'resolucao': '1/6: 1/2 = 3/6 e 1/3 = 2/6; 3/6 − 2/6 = 1/6.\n2/5 e 1/5 vêm de subtrair em cima e embaixo; 5/6 é somar.'},
        ],
    },
    'multiplicar-decimais': {
        'titulo': 'Multiplicar números com vírgula',
        'linhas': [
            'Tire as vírgulas e multiplique: 0,6 · 1,2 vira 6 · 12 = 72.',
            'Conte quantos números ficam depois da vírgula, nos dois: 0,6 tem 1 e 1,2 tem 1. São 2 no total.',
            'Ponha a vírgula com 2 números depois dela: 0,72.',
            'Outro: 0,25 · 0,9 vira 25 · 9 = 225; há 2 + 1 = 3 casas: 0,225.',
            'Confira pelo tamanho: 0,6 de 1,2 tem que dar menos que 1,2, e 0,72 dá.',
        ],
        'visual': tabela('Três contas com vírgula', ['Conta', 'Sem vírgula', 'Casas', 'Resultado'], [['0,6 · 1,2', '6 · 12 = 72', '2', '0,72'], ['0,25 · 0,9', '25 · 9 = 225', '3', '0,225'], ['0,3 · 0,3', '3 · 3 = 9', '2', '0,09']]),
        'exercicios': [
            {'enunciado': 'Quanto é 0,5 · 0,4?', 'alternativas': ['0,2', '2', '0,02', '0,9'], 'certa': 0,
             'resolucao': '0,2: 5 · 4 = 20; há 1 + 1 = 2 casas: 0,20 = 0,2.\n2 e 0,02 erram a vírgula; 0,9 é somar.'},
            {'enunciado': 'Quanto é 1,5 · 0,2?', 'alternativas': ['0,3', '3', '0,03', '1,7'], 'certa': 0,
             'resolucao': '0,3: 15 · 2 = 30; há 1 + 1 = 2 casas: 0,30 = 0,3.\n3 e 0,03 erram a vírgula; 1,7 é somar.'},
        ],
    },
    'potencia-de-dez': {
        'titulo': 'Potências de dez e o Δ',
        'linhas': [
            '10² = 10 · 10 = 100. 10³ = 1 000. 10⁵ = 100 000: o número de zeros é o expoente.',
            '10⁻³ = 1 ÷ 1 000 = 0,001. Expoente negativo é dividir.',
            '3 × 10⁸ = 3 · 100 000 000 = 300 000 000.',
            '1 L = 10⁻³ m³ quer dizer: 1 litro é 0,001 metro cúbico.',
            "Δ (delta) quer dizer 'quanto mudou': ΔV = volume final − volume inicial.",
        ],
        'visual': tabela('Potências de dez', ['Potência', 'Valor'], [['10²', '100'], ['10⁵', '100 000'], ['10⁻³', '0,001']]),
        'exercicios': [
            {'enunciado': 'Quanto é 2 × 10⁴?', 'alternativas': ['20 000', '200 000', '2 000', '24'], 'certa': 0,
             'resolucao': '20 000: 10⁴ = 10 000 e 2 · 10 000 = 20 000.\n200 000 tem um zero a mais; 2 000 tem um a menos; 24 é somar.'},
            {'enunciado': '5 L são quantos m³? (1 L = 10⁻³ m³)', 'alternativas': ['0,005', '0,05', '5 000', '0,5'], 'certa': 0,
             'resolucao': '0,005: 5 · 0,001 = 0,005.\n0,05 e 0,5 erram os zeros; 5 000 é multiplicar por 1 000.'},
        ],
    },
    'seno-cosseno': {
        'titulo': 'Plano inclinado: o que puxa e o que aperta',
        'linhas': [
            'Um bloco no plano inclinado pesa m · g. Esse peso se divide em duas partes.',
            'Uma puxa o bloco ao longo do plano, para baixo. A outra aperta o bloco contra o plano.',
            'Quanto mais inclinado, mais peso puxa e menos aperta. Deitado, quase só aperta; em pé, quase só puxa.',
            'O seno é a parte do peso que puxa; o cosseno, a que aperta. Seno 0,6 e peso 20 N: puxa 0,6 · 20 = 12 N.',
            'Cosseno 0,8 aperta com 0,8 · 20 = 16 N. O atrito vale o coeficiente vezes esse aperto.',
        ],
        'visual': tabela('Peso de 20 N no plano', ['Parte', 'Conta', 'Força'], [['Puxa (seno 0,6)', '0,6 · 20', '12 N'], ['Aperta (cosseno 0,8)', '0,8 · 20', '16 N']]),
        'exercicios': [
            {'enunciado': 'Bloco de 10 N num plano com seno 0,5 e cosseno 0,87. Quanto do peso puxa ao longo do plano?', 'alternativas': ['5 N', '8,7 N', '10 N', '0,5 N'], 'certa': 0,
             'resolucao': '5 N: 0,5 · 10 = 5 N.\n8,7 N é a parte que aperta; 10 N é o peso inteiro; 0,5 N esqueceu de multiplicar.'},
            {'enunciado': 'No mesmo plano o aperto é 8,7 N. Com coeficiente de atrito 0,2, quanto vale o atrito?', 'alternativas': ['1,74 N', '0,2 N', '8,7 N', '2 N'], 'certa': 0,
             'resolucao': '1,74 N: atrito = 0,2 · 8,7 = 1,74 N.\n0,2 N é só o coeficiente; 8,7 N é o aperto; 2 N erra a conta.'},
        ],
    },
}

P = 'd2-escada-'
LIGACOES = {
    'fis-ita-cin-00a': ['velocidade'], 'fis-ita-cin-00b': ['queda', 'pitagoras'], 'fis-ita-cin-00c': ['velocidade'], 'fis-ita-cin-00d': ['numero-que-falta'],
    'fis-ita-din-00a': ['aceleracao'], 'fis-ita-din-00b': ['aceleracao', 'queda', 'seno-cosseno'], 'fis-ita-din-00c': ['aceleracao'], 'fis-ita-din-00d': ['queda', 'curva'],
    'fis-ita-ter-00a': ['numero-que-falta', 'multiplicar-decimais'], 'fis-ita-ter-00b': ['potencia-de-dez'], 'fis-ita-ter-00c': ['numero-que-falta'], 'fis-ita-ter-00d': ['numero-que-falta'],
    'fis-ita-ond-00a': ['velocidade', 'multiplicar-decimais'], 'fis-ita-ond-00b': ['velocidade'], 'fis-ita-ond-00c': ['velocidade', 'dividir-por-decimal'], 'fis-ita-ond-00d': ['velocidade', 'numero-que-falta'],
    'fis-ita-opt-00a': ['fracoes', 'numero-que-falta'], 'fis-ita-opt-00b': ['fracoes', 'dividir-por-decimal'], 'fis-ita-opt-00c': ['potencia-de-dez', 'dividir-por-decimal'], 'fis-ita-opt-00d': ['velocidade'],
    'fis-ita-ele-00a': ['porcentagem', 'multiplicar-decimais'], 'fis-ita-ele-00b': ['numero-que-falta', 'multiplicar-decimais'], 'fis-ita-ele-00c': ['numero-que-falta', 'fracoes'], 'fis-ita-ele-00d': ['fracoes'],
    'mat-ita-ari-00a': ['porcentagem', 'multiplicar-decimais'], 'mat-ita-ari-00b': ['porcentagem', 'fracoes', 'dividir-por-decimal'],
    'mat-ita-ari-00c': ['porcentagem', 'numero-que-falta', 'dividir-por-decimal'], 'mat-ita-ari-00d': ['porcentagem', 'multiplicar-decimais', 'dividir-por-decimal'],
}


def principal():
    with open(ARQ, encoding='utf-8') as f:
        d = json.load(f)
    d['conceitos'].update(NOVOS)
    for sufixo, conceitos in LIGACOES.items():
        for c in conceitos:
            assert c in d['conceitos'], c
        d['questoes'][P + sufixo] = conceitos
    with open(ARQ, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('conceitos:', len(d['conceitos']), '| questões ligadas:', len(d['questoes']))


if __name__ == '__main__':
    principal()
