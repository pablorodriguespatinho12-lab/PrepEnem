"""Análise Combinatória e Probabilidade (8º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (MANTER: ficha no ladrilho, área + condicional), b = ITA (REESCRITA: painel de 12 lâmpadas, 5 acesas sem vizinhas, 56/377),
c = Fuvest (MANTER: exame duas vezes, Bayes por contagem), d = Harvard-MIT (MANTER: tabela de pontos, invariante dos empates).
Junta só os degraus 1 a 7 (Aritmética, Grandezas, Estatística, Equações, Funções, Geometria Plana, Geometria Espacial).
Toda resposta é conferida por conta Python (assert), a da 00b também por enumeração dos 4 096 painéis.
"""
import itertools
from fractions import Fraction as F
from math import comb

ARQUIVO = 'matematica-acima-novas.json'
T = 'Análise Combinatória e Probabilidade'

# ---------------------------------------------------------------- b) ITA: painel de 12 lâmpadas, enumeração
N_LAMP, N_ACESAS = 12, 5
todos = list(itertools.product((0, 1), repeat=N_LAMP))
assert len(todos) == 4096
aprovados = [p for p in todos if not any(p[i] and p[i + 1] for i in range(N_LAMP - 1))]
com5 = [p for p in aprovados if sum(p) == N_ACESAS]
assert (len(aprovados), len(com5)) == (377, 56)
P_b = F(len(com5), len(aprovados))
assert P_b == F(56, 377)
# a recorrência a(n) = a(n−1) + a(n−2), a(1) = 2, a(2) = 3
a = {1: 2, 2: 3}
for n in range(3, 13):
    a[n] = a[n - 1] + a[n - 2]
assert [a[n] for n in range(1, 13)] == [2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]
assert a[3] == 3 + 2 and a[4] == 5 + 3 and a[6] == 13 + 8 and a[7] == 21 + 13 and a[8] == 34 + 21 and a[9] == 55 + 34
assert a[10] == 89 + 55 and a[11] == 144 + 89 and a[12] == 233 + 144
# vãos: 7 apagadas deixam 8 vãos; 5 acesas em vãos diferentes
vaos = (N_LAMP - N_ACESAS) + 1
assert vaos == 8 and comb(8, 5) == comb(8, 3) == 56 and 8 * 7 * 6 == 336 and 336 // 6 == 56
assert 13 * 29 == 377 and 56 == 8 * 7 and abs(56 / 377 - 0.1485) < 1e-4
# distratores
assert F(56, 4096) == F(7, 512)                 # sem a condição de aprovação
assert F(comb(12, 5), 4096) == F(99, 512) and comb(12, 5) == 792   # sem a proibição de vizinhas
assert a[11] == 233 and comb(11 - 5 + 1, 5) == 21 and F(21, 233) != P_b   # 11 lâmpadas: C(7,5) ÷ 233
assert F(56, 233) != P_b                        # numerador certo, total de 11 lâmpadas
vals_b = [float(F(7, 512)), float(F(21, 233)), float(P_b), float(F(99, 512)), float(F(56, 233))]
assert vals_b == sorted(vals_b) and len(set(vals_b)) == 5
# checagem (Sua vez): 5 lâmpadas, 2 acesas, sem vizinhas = C(4,2) = 6
sv = [p for p in itertools.product((0, 1), repeat=5) if not any(p[i] and p[i + 1] for i in range(4)) and sum(p) == 2]
assert len(sv) == 6 == comb(5 - 2 + 1, 2) and comb(5, 2) == 10 and comb(4, 3) == 4
ENUN_B = ('Um painel tem 12 lâmpadas em fila. No teste de fábrica, cada lâmpada fica acesa ou apagada ao acaso, com chance 1/2 e sem depender das outras. '
          'A máquina só aprova painéis que não têm duas lâmpadas acesas lado a lado. Entre os painéis aprovados, '
          'a probabilidade de que tenham exatamente 5 lâmpadas acesas é:')
assert 250 <= len(ENUN_B) <= 450, len(ENUN_B)

# ---------------------------------------------------------------- conferências dos Antes novos
assert F(4, 10) == F(2, 5) and 1 - F(1, 8) == F(7, 8) and F(5, 20) == F(1, 4) and F(1, 3) == F(1, 6) / F(1, 2)
assert comb(6, 2) == 15 and 6 * 5 // 2 == 15 and comb(7, 3) == 35 and 7 * 6 * 5 == 210 and 210 // 6 == 35 and comb(4, 2) == 6 and comb(5, 3) == 10 == comb(5, 2)
assert F(90, 90 + 90) == F(1, 2) and F(100, 100 + 80) == F(5, 9) and 200 // 2 == 100 and 800 // 10 == 80
assert F(40, 40 + 30) == F(4, 7) and 200 // 4 == 50 and 50 * 8 // 10 == 40 and 150 * 2 // 10 == 30
assert F(20 * 1, 100) == F(1, 5) and F(80, 180) == F(4, 9) and F(30, 70) == F(3, 7)

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-com-00b', materia='Matemática', tema=T, calc=float(P_b),
        enunciado=ENUN_B,
        dados=[('Painel', '12 lâmpadas em fila'), ('Cada lâmpada', 'acesa com chance 1/2, sem depender das outras'),
               ('Painel aprovado', 'sem 2 lâmpadas acesas lado a lado'),
               ('Quero', 'chance de exatamente 5 acesas, entre os aprovados')],
        alts=[('7/512', float(F(7, 512)), 'Ignorou a condição de aprovação: 56 ÷ 4 096, todos os painéis possíveis'),
              ('21/233', float(F(21, 233)), 'Contou 11 lâmpadas em vez de 12: C(7, 5) ÷ 233'),
              ('56/377', float(P_b), 'OK'),
              ('99/512', float(F(99, 512)), 'Ignorou a proibição de vizinhas acesas: C(12, 5) ÷ 4 096 = 792 ÷ 4 096'),
              ('56/233', float(F(56, 233)), 'Pôs o 56 certo sobre o total de 11 lâmpadas (233) e não 12 (377)')],
        resumo='Aprovados: a(12) = 377, somando os dois anteriores. Com 5 acesas: 7 apagadas, 8 vãos, C(8, 5) = 56. P = 56/377.',
        ideia='O total de painéis aprovados é a soma dos dois anteriores, olhando a última lâmpada. Com 5 acesas, encaixe-as nos vãos entre as 7 apagadas; a chance 1/2 só faz todo painel valer igual.',
        pecas=[('Recorrência', 'Uma regra que acha cada número a partir dos anteriores: a(n) = a(n−1) + a(n−2).'),
               ('C(8, 5)', 'Quantos jeitos de escolher 5 entre 8, sem ligar para a ordem: 56.')],
        formulas=[('contagem', 'Probabilidade', 'favoráveis ÷ possíveis'), ('contagem', 'Combinação', 'C(n, k): escolher k entre n'),
                  ('contagem', 'Recorrência', 'a(n) = a(n−1) + a(n−2)')],
        eq='P = N ÷ T',
        leitura='chance = painéis aprovados com 5 acesas ÷ painéis aprovados',
        letras=[('P', 'chance de ter exatamente 5 acesas (o que a questão quer)'), ('N', 'painéis aprovados com exatamente 5 acesas'),
                ('T', 'total de painéis aprovados')],
        eq_texto='Cada painel tem a mesma chance (1/2, doze vezes), então só é preciso contar: favoráveis ÷ possíveis, entre os aprovados.\nAgora é só achar T e N, uma letra por vez.',
        achando=[('Achando T: contar os aprovados (1 de 5)',
                  'Olhe a última lâmpada. Apagada: as 11 de antes são um painel aprovado qualquer. Acesa: a anterior tem de ser apagada, e as 10 de antes são um aprovado qualquer.\n'
                  'Com a(n) = painéis aprovados de n lâmpadas: a(12) = a(11) + a(10).'),
                 ('Achando T: contar os aprovados (2 de 5)',
                  'Começo: 1 lâmpada tem 2 painéis (acesa ou apagada), a(1) = 2. 2 lâmpadas têm 3: apagada-apagada, apagada-acesa e acesa-apagada; acesa-acesa não vale. a(2) = 3.\n'
                  'a(3) = 3 + 2 = 5. a(4) = 5 + 3 = 8. a(5) = 8 + 5 = 13. a(6) = 13 + 8 = 21.'),
                 ('Achando T: contar os aprovados (3 de 5)',
                  'a(7) = 21 + 13 = 34.\na(8) = 34 + 21 = 55.\na(9) = 55 + 34 = 89.\na(10) = 89 + 55 = 144.'),
                 ('Achando T: contar os aprovados (4 de 5)',
                  'a(11) = 144 + 89 = 233.\na(12) = 233 + 144 = 377.\nT = 377 painéis aprovados.'),
                 ('Achando N: os vãos entre as apagadas',
                  'Com 5 acesas, sobram 12 − 5 = 7 apagadas. Ponha as 7 apagadas em fila: ficam 8 vãos (antes da 1ª, 6 entre elas, depois da 7ª).\n'
                  'Cada acesa vai num vão diferente, e assim nenhuma fica ao lado de outra.'),
                 ('Achando N: escolher os vãos',
                  'Escolher 5 vãos entre 8 é o mesmo que escolher os 3 que ficam vazios: C(8, 5) = C(8, 3).\n'
                  '8 · 7 · 6 = 336, e 3 · 2 · 1 = 6. 336 ÷ 6 = 56.\nN = 56 painéis.')],
        volta='P = N ÷ T = 56 ÷ 377.\n377 = 13 · 29 e 56 = 8 · 7: não há fator comum, a fração não simplifica.\nP = 56/377.\n'
              'Resposta: alternativa X. Conferindo: 56 ÷ 377 é cerca de 0,15, um pouco menos que 1 em 6.',
        valores=[('T', '377 painéis'), ('N', '56 painéis'), ('P', '56/377')],
        pista='"sem duas acesas vizinhas" → olhe a última lâmpada (total = soma dos dois anteriores); para um número fixo de acesas, encaixe-as nos vãos entre as apagadas.',
        rec1='12 lâmpadas; chance 1/2 cada; aprovado: sem 2 acesas vizinhas; 5 acesas', rec3='T = 377; N = 56; P = 56/377',
        checagem=('5 lâmpadas em fila, nenhuma acesa ao lado de outra acesa. Quantos painéis têm exatamente 2 acesas?',
                  ['4', '6', '10', '3'], '6',
                  'Sobram 3 apagadas e 4 vãos. Escolher 2 vãos entre 4: 4 · 3 ÷ 2 = 6. (C(5, 2) = 10 ignora a proibição.)'),
        ancora=('parcial · ITA 2021 1ª fase q.53 (variável auxiliar e contagem por casos, resposta exata) e HMMT fev. 2022 Combinatorics q.2 '
                '(casas coloridas sem vizinhas, 3 em 9); aqui 12 lâmpadas e 5 acesas, para a ideia dos vãos valer e a lista à mão não resolver'),
        canal='mat-40-combinacao-com-repeticao-analise-combina.txt [24:25:31] (escolher quantos de cada com restrição); a recorrência a(n) = a(n−1) + a(n−2) e os vãos não aparecem no canal',
        antes=['com-probabilidade', 'com-combinacao', 'fracoes'],
    ),
]

MANTER = {
    'd2-escada-mat-ita-com-00a': {
        'ancora': ('parcial · ENEM 2019 CD7 q.173 (condicional contando em 100, com porcentagens); a parte de área (probabilidade geométrica, ficha no ladrilho) '
                   'não tem real aberta do tema, só o canal; a nossa une as duas e traz tabela de pontos e dado que sobra'),
        'canal': 'fuv-07-analise-combinatoria-e-probabi.txt [3:53:00] (probabilidade geométrica: área favorável ÷ área total); fuv-08-analise-combinatoria-e-probabi.txt [4:00:32] (probabilidade condicional)',
        'antes': ['com-probabilidade', 'com-condicional', 'fracoes'],
    },
    'd2-escada-mat-ita-com-00c': {
        'ancora': ('forte · ENEM 2019 CD7 q.173 (Bayes contando em 100: de fraudulenta para inconsistente) e Fuvest 2025 2ª fase M02 '
                   '(tabela e condicionais com denominadores trocados); aqui 2 faixas de idade e 2º exame independente'),
        'canal': 'fuv-08-analise-combinatoria-e-probabi.txt [4:00:32] (clássico da probabilidade condicional); mat-04-porcentagem.txt [2:06:31] (percentual de um valor)',
        'antes': ['porcentagem', 'com-bayes', 'fracoes'],
    },
    'd2-escada-mat-ita-com-00d': {
        'ancora': ('parcial · HMMT fev. 2021 Combinatorics q.2 (invariante: cada partida elimina 1 jogador, então se contam partidas e não jogadores); '
                   'aqui a invariante é cada empate tirar 1 ponto do total de 45'),
        'canal': 'mat-41-probabilidade.txt [25:03:01] (probabilidade = favoráveis ÷ espaço amostral); mat-40-combinacao-com-repeticao-analise-combina.txt [24:25:31] (combinação); a invariante dos pontos fora do canal',
        'antes': ['com-probabilidade', 'com-combinacao', 'numero-que-falta'],
    },
}

ANTES_NOVOS = {
    'com-probabilidade': {
        'titulo': 'Probabilidade: favoráveis ÷ possíveis',
        'linhas': [
            'Probabilidade é casos favoráveis ÷ casos possíveis, quando todos os casos têm a mesma chance.',
            'Dado de 6 faces, sair número par: favoráveis 3 (o 2, o 4 e o 6), possíveis 6. Chance = 3 ÷ 6 = 1/2.',
            'Uma bola de uma caixa com 3 vermelhas e 5 azuis: vermelha tem 3 favoráveis em 3 + 5 = 8 possíveis, 3/8.',
            '"Pelo menos um" é 1 − "nenhum". Moeda 2 vezes: nenhuma cara é 1/4, então pelo menos uma é 1 − 1/4 = 3/4.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Três chances', 'cabecalho': ['Situação', 'Favoráveis', 'Possíveis', 'Chance'],
                   'linhas': [['Par no dado', '3', '6', '1/2'], ['Vermelha na caixa', '3', '8', '3/8'], ['Cara em 2 moedas, pelo menos 1', '3', '4', '3/4']]},
        'exercicios': [
            {'enunciado': 'Uma urna tem 4 bolas pretas e 6 brancas. Sorteando 1 bola, qual é a chance de ser preta?', 'alternativas': ['2/5', '2/3', '3/5', '1/4'], 'certa': 0,
             'resolucao': '2/5: 4 favoráveis em 4 + 6 = 10 possíveis, 4/10 = 2/5.\n2/3 compara as pretas com as brancas (4 ÷ 6); 3/5 é a chance de branca; 1/4 não tem conta.'},
            {'enunciado': 'Uma moeda é lançada 3 vezes. Qual é a chance de sair pelo menos uma coroa?', 'alternativas': ['7/8', '1/8', '3/8', '1/2'], 'certa': 0,
             'resolucao': '7/8: são 8 resultados possíveis, e só 1 não tem coroa (cara, cara, cara). 1 − 1/8 = 7/8.\n1/8 é a chance de nenhuma coroa; 3/8 é a de exatamente 1 coroa; 1/2 é a de 1 lançamento só.'},
        ],
    },
    'com-combinacao': {
        'titulo': 'Combinação: escolher sem ordem',
        'linhas': [
            'Combinação é escolher itens sem importar a ordem. Escolher 2 entre 4 pessoas: a dupla A-B é a mesma que B-A.',
            'Conte com ordem e divida: 4 · 3 = 12 jeitos com ordem. Cada dupla apareceu 2 vezes, então 12 ÷ 2 = 6. Escreve-se C(4, 2) = 6.',
            'Escolher 3 entre 5: 5 · 4 · 3 = 60 com ordem. Cada trio apareceu 3 · 2 · 1 = 6 vezes. 60 ÷ 6 = 10, ou seja, C(5, 3) = 10.',
            'Escolher 3 entre 5 é o mesmo que escolher os 2 que ficam de fora: C(5, 3) = C(5, 2) = 10.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Combinações', 'cabecalho': ['Escolha', 'Com ordem', 'Dividir por', 'Resultado'],
                   'linhas': [['2 entre 4', '4 · 3 = 12', '2', '6'], ['3 entre 5', '5 · 4 · 3 = 60', '6', '10'], ['2 entre 5', '5 · 4 = 20', '2', '10']]},
        'exercicios': [
            {'enunciado': 'De quantos jeitos se escolhem 2 pessoas entre 6, sem ligar para a ordem?', 'alternativas': ['15', '30', '12', '36'], 'certa': 0,
             'resolucao': '15: 6 · 5 = 30 com ordem, e 30 ÷ 2 = 15.\n30 esquece de dividir por 2; 12 soma 6 + 6; 36 faz 6 · 6.'},
            {'enunciado': 'De quantos jeitos se escolhem 3 pessoas entre 7, sem ligar para a ordem?', 'alternativas': ['35', '210', '21', '42'], 'certa': 0,
             'resolucao': '35: 7 · 6 · 5 = 210 com ordem, e 210 ÷ 6 = 35.\n210 esquece de dividir por 3 · 2 · 1; 21 é 7 · 6 ÷ 2; 42 divide só por 5.'},
        ],
    },
    'com-condicional': {
        'titulo': 'Condicional: a chance sabendo que...',
        'linhas': [
            'Condicional é a chance de algo sabendo que outra coisa já aconteceu. O grupo possível encolhe para quem cumpre a condição.',
            'De 50 alunos, 20 jogam futebol e 5 deles também jogam vôlei. Sabendo que joga futebol: 5 ÷ 20 = 1/4.',
            'O 50 sai da conta. O de baixo é só quem cumpre a condição (os 20), não o grupo todo.',
            'Dado: sabendo que saiu par (2, 4 ou 6), a chance de ser 6 é 1 em 3, e não 1 em 6.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Sabendo que...', 'cabecalho': ['Condição', 'Quem sobra', 'Favoráveis', 'Chance'],
                   'linhas': [['Joga futebol', '20', '5 jogam vôlei', '1/4'], ['Saiu par', '3 (2, 4, 6)', '1 (o 6)', '1/3']]},
        'exercicios': [
            {'enunciado': 'Numa sala de 50 alunos, 20 jogam futebol e 5 deles também jogam vôlei. Sabendo que o aluno joga futebol, qual é a chance de ele jogar vôlei?',
             'alternativas': ['1/4', '1/10', '2/5', '3/4'], 'certa': 0,
             'resolucao': '1/4: só os 20 do futebol contam, e 5 ÷ 20 = 1/4.\n1/10 divide pelos 50 da sala (5 ÷ 50); 2/5 é a chance de jogar futebol (20 ÷ 50); 3/4 é 15 ÷ 20, os que só jogam futebol.'},
            {'enunciado': 'Um dado é lançado e se sabe que saiu número par. Qual é a chance de ter saído o 6?', 'alternativas': ['1/3', '1/6', '1/2', '2/3'], 'certa': 0,
             'resolucao': '1/3: os pares são 2, 4 e 6, e o 6 é 1 deles. 1 ÷ 3 = 1/3.\n1/6 conta os 6 lados do dado; 1/2 é a chance de ser par; 2/3 é a de não ser o 6 entre os pares.'},
        ],
    },
    'com-bayes': {
        'titulo': 'Bayes por contagem: do resultado à causa',
        'linhas': [
            'Quando o exame deu positivo, qual a chance de a pessoa estar doente? Use um número redondo de pessoas e conte.',
            'De 1 000 pessoas, 10% doentes: 100. O exame dá positivo em 90% dos doentes (90) e em 10% dos sadios (900 · 10% = 90).',
            'Positivos: 90 doentes + 90 sadios = 180. Entre os positivos, os doentes são 90 ÷ 180 = 1/2.',
            'Cuidado: 90% é a chance de dar positivo SENDO doente. A de ser doente SENDO positivo é outra: 1/2.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Contando 1 000 pessoas', 'cabecalho': ['Grupo', 'Pessoas', 'Positivos'],
                   'linhas': [['Doentes', '100', '90'], ['Sadios', '900', '90'], ['Total', '1 000', '180']]},
        'exercicios': [
            {'enunciado': 'Em 1 000 peças, 20% têm defeito. O teste acusa 50% das defeituosas e 10% das boas. Entre as peças acusadas, que fração tem defeito de verdade?',
             'alternativas': ['5/9', '1/2', '1/5', '4/9'], 'certa': 0,
             'resolucao': '5/9: defeituosas 200, acusadas 100; boas 800, acusadas 80. 100 ÷ (100 + 80) = 100/180 = 5/9.\n1/2 é a taxa do teste; 1/5 é a fração de defeituosas na fábrica; 4/9 é 80 ÷ 180, as boas acusadas.'},
            {'enunciado': 'Em 200 caixas, 25% têm falha. O detector apita em 80% das caixas com falha e em 20% das sem falha. Entre as que apitaram, que fração tem falha?',
             'alternativas': ['4/7', '4/5', '1/4', '3/7'], 'certa': 0,
             'resolucao': '4/7: com falha 50, apitam 40; sem falha 150, apitam 30. 40 ÷ (40 + 30) = 40/70 = 4/7.\n4/5 é a taxa do detector; 1/4 é a fração com falha nas 200; 3/7 é 30 ÷ 70, as sem falha que apitaram.'},
        ],
    },
}

# ---------------------------------------------------------------- conferências de formato (o programa confere o resto)
for _q in Q:
    assert len(_q['ideia']) <= 300, (_q['id'], len(_q['ideia']))
    assert len(_q['alts']) == 5
    for _l, _v in _q['dados']:
        assert len(_v) <= 60, (_q['id'], _v)
    assert len(_q['ancora'].split(' · ')[0]) <= 7
    for _t, _x, *_ in _q['achando']:
        assert len(_x) <= 300, (_t, len(_x))
for _k, _c in ANTES_NOVOS.items():
    assert _k.startswith('com-')
    for _l in _c['linhas']:
        assert len(_l) <= 170, (_k, len(_l), _l)
    for _e in _c['exercicios']:
        assert _e['alternativas'][_e['certa']].split()[0] in _e['resolucao'].split('\n')[0], (_k, _e['enunciado'])
