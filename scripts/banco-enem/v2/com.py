"""Análise Combinatória e Probabilidade (8º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (REESCRITA 24/11: 2 fichas no ladrilho, soma de pontos, condicional, 2/3), b = ITA (REESCRITA: painel de 12 lâmpadas, 5 acesas sem vizinhas, 56/377),
c = Fuvest (REESCRITA 24/11: exame com desempate de 3 exames, Bayes por árvore, 74%), d = Harvard-MIT (REESCRITA 24/11: 8 times, invariante dos empates, 3 jogos sorteados, 99/124).
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

# ---------------------------------------------------------------- a) ENEM: ficha no ladrilho, 2 fichas, soma de pontos (enumeração)
LADO, RAIO = 10, 3                                  # ladrilho de 1 dm = 10 cm; ficha de 6 cm de diâmetro
celulas = [(x, y) for x in range(LADO) for y in range(LADO)]   # células de 1 cm; as fronteiras 3 e 7 caem entre células
def toca(x, y):
    return sum([x + .5 <= RAIO, x + .5 >= LADO - RAIO, y + .5 <= RAIO, y + .5 >= LADO - RAIO])
cont = {k: sum(toca(x, y) == k for x, y in celulas) for k in (0, 1, 2)}
assert cont == {0: 16, 1: 48, 2: 36} and sum(cont.values()) == 100 and 4 * 4 == 16 and 4 * 9 == 36 and 100 - 16 - 36 == 48 and 3 * 4 == 12
Pz, Pu, Pd = F(cont[0], 100), F(cont[1], 100), F(cont[2], 100)
assert (Pz, Pu, Pd) == (F(4, 25), F(12, 25), F(9, 25)) and Pz + Pu + Pd == 1 and 3 + 3 < LADO and 6 // 2 == RAIO and 1 * 10 == LADO
PONTOS = {0: 4, 1: 2, 2: 0}                         # pontos por quantos rejuntes toca
par = [(a, b) for a in celulas for b in celulas]    # 10 000 pares de centros
soma4 = [(a, b) for a, b in par if PONTOS[toca(*a)] + PONTOS[toca(*b)] == 4]
ambas1 = [(a, b) for a, b in soma4 if toca(*a) == 1 and toca(*b) == 1]
assert (len(par), len(soma4), len(ambas1)) == (10000, 3456, 2304)
P_a = F(len(ambas1), len(soma4))
assert P_a == F(2, 3) == Pu * Pu / (Pu * Pu + 2 * Pz * Pd)
assert Pu * Pu == F(144, 625) and Pz * Pd == F(36, 625) and 2 * Pz * Pd == F(72, 625) and 144 + 72 == 216 and 144 == 2 * 72 and 216 == 3 * 72
assert 12 * 12 == 144 and 25 * 25 == 625 and 4 * 9 == 36 and 16 // 4 == 4 and 100 // 4 == 25 and 36 // 4 == 9 and 48 // 4 == 12
# distratores
assert F(144, 625) == Pu * Pu                       # sem a condição
assert F(72, 216) == F(1, 3)                        # a outra parte (0 e 2 rejuntes)
assert F(144, 144 + 36) == F(4, 5)                  # sem as 2 ordens
vals_a = [float(F(144, 625)), float(F(1, 3)), float(Pu), float(P_a), float(F(4, 5))]
assert vals_a == sorted(vals_a) and len(set(vals_a)) == 5
# checagem: 2 fichas de 1 ponto (1/2) ou 0 (1/2); soma 1; 1ª fez 1
assert F(1, 4) / (F(1, 4) + F(1, 4)) == F(1, 2)
ENUN_A = ('Numa festa junina de bairro, o piso da quadra é coberto de ladrilhos quadrados de 1 dm de lado, separados por rejuntes finos. Na brincadeira da calçada, '
          'o participante lança duas fichas circulares, uma de cada vez, cada uma com 6 cm de diâmetro, e os pontos de cada ficha dependem de quantos rejuntes do ladrilho ela toca, '
          'como mostra a tabela. A organização garante que cada ficha cai com o centro dentro de um ladrilho, em qualquer ponto com a mesma chance, que o lançamento de uma ficha '
          'não influencia o da outra e que só os 4 rejuntes do ladrilho importam (os dos ladrilhos vizinhos ficam longe demais). O prêmio do dia é uma cesta que custa R$ 80 '
          'e cada par de fichas custa R$ 2, mas esses valores não entram na conta. Sabendo que o total dos pontos das duas fichas foi exatamente 4, '
          'a probabilidade de que cada uma delas tenha tocado exatamente 1 rejunte é:')
assert len(ENUN_A) >= 600, len(ENUN_A)

# ---------------------------------------------------------------- c) Fuvest: exame 3 vezes com desempate
D_JOV, D_VEL, POP = F(5, 100) * 5000, F(10, 100) * 5000, 10000
Dt = int(D_JOV + D_VEL)
St = POP - Dt
assert (D_JOV, D_VEL, Dt, St) == (250, 500, 750, 9250)
ac = F(9, 10)                                       # positivo para doente
fp = F(1, 10)                                       # positivo para sadia (engano)
def regra(p):
    """Chance de a regra (2 exames iguais valem; se divergem, o 3º decide) acusar quem dá positivo com chance p."""
    total = F(0)
    for e in itertools.product((1, 0), repeat=3):   # 1 = positivo, 0 = negativo, 3 exames feitos
        pr = F(1)
        for x in e:
            pr *= p if x else 1 - p
        acusa = (e[0] and e[1]) or ((e[0] != e[1]) and e[2])
        total += pr if acusa else 0
    return total
assert regra(ac) == F(972, 1000) and regra(fp) == F(28, 1000)
assert ac * ac == F(81, 100) and ac * (1 - ac) == F(9, 100) and 2 * F(9, 100) == F(18, 100) and F(18, 100) * ac == F(162, 1000)
assert F(81, 100) + F(162, 1000) == F(972, 1000) and fp * fp == F(1, 100) and F(18, 100) * fp == F(18, 1000) and F(1, 100) + F(18, 1000) == F(28, 1000)
Dc, Sc = Dt * regra(ac), St * regra(fp)
assert (Dc, Sc) == (729, 259) and 972 // 4 == 243 and 243 * 3 == 729 and 9000 * 28 + 250 * 28 == 259000 == 9250 * 28 and Dc + Sc == 988
P_c = Dc / (Dc + Sc)
assert round(P_c * 100) == 74 and 988 * 74 == 73112 and 988 * 73 == 72124
# distratores
x87 = Dt * ac * ac / (Dt * ac * ac + St * fp * fp)           # sem o 3º exame
x42 = Dt * ac / (Dt * ac + St * fp)                          # só o 1º exame
assert (round(x87 * 100), round(x42 * 100), round(regra(ac) * 100)) == (87, 42, 97) and Dt * ac == 675 and St * fp == 925
assert Dt * ac * ac == F(1215, 2) and St * fp * fp == F(185, 2)
vals_c = [42.0, 74.0, 87.0, 90.0, 97.0]
# checagem: positivo e depois negativo = 0,9 · 0,1
assert ac * (1 - ac) == F(9, 100) and ac * ac == F(81, 100)
ENUN_C = ('Uma clínica aplicou um protocolo de exames em 10 000 pessoas, divididas por idade, com a porcentagem de doentes de cada faixa, como mostra a tabela. '
          'Cada exame dá positivo em 90% das pessoas doentes e, por engano, em 10% das sadias, e os resultados de exames repetidos na mesma pessoa não dependem uns dos outros. '
          'A regra da clínica é: faz-se o 1º e o 2º exame; se os dois derem o mesmo resultado, ele vale; se divergirem, faz-se um 3º exame, e o resultado dele decide. '
          'Cada exame custa R$ 120, mas esse valor não entra na conta. Entre as pessoas que a regra classifica como doentes, '
          'a porcentagem aproximada das que realmente têm a doença é:')

# ---------------------------------------------------------------- d) Harvard-MIT: 8 times, 3 jogos sorteados, condicional
N_TIMES = 8
JOGOS = list(itertools.combinations(range(N_TIMES), 2))
assert len(JOGOS) == 28 == N_TIMES * (N_TIMES - 1) // 2 and 8 * 7 == 56
TABELA = [17, 15, 13, 11, 9, 6, 4, 3]
assert sum(TABELA) == 78 and 17 + 15 == 32 and 32 + 13 == 45 and 45 + 11 == 56 and 56 + 9 == 65 and 65 + 6 == 71 and 71 + 4 == 75 and 75 + 3 == 78
EMPATES = 28 * 3 - sum(TABELA)
assert EMPATES == 6 and 28 - EMPATES == 22
# existe campeonato assim? 28 resultados (E = empate, 1 = 1º time ganha, 2 = 2º ganha) que dão exatamente esta tabela, com 6 empates
RES = '11EE111EE1121E22E11111222211'
pts = [0] * N_TIMES
for (i, j), r in zip(JOGOS, RES):
    if r == 'E':
        pts[i] += 1; pts[j] += 1
    elif r == '1':
        pts[i] += 3
    else:
        pts[j] += 3
assert sorted(pts, reverse=True) == TABELA and RES.count('E') == 6
# todo campeonato com esta tabela tem 6 empates: pontos = 3 · 28 − empates
assert comb(28, 3) == 3276 == 28 * 27 * 26 // 6 and 28 * 27 == 756 and 756 * 26 == 19656 and 19656 // 6 == 3276
um_emp = 6 * comb(22, 2)
nenhum = comb(22, 3)
assert comb(22, 2) == 231 == 22 * 21 // 2 and 22 * 21 == 462 and um_emp == 1386 and nenhum == 1540 == 22 * 21 * 20 // 6 and 462 * 20 == 9240 and 9240 // 6 == 1540
pelo_menos = comb(28, 3) - nenhum
assert pelo_menos == 1736
# enumeração direta dos 3 276 sorteios, com os 6 primeiros jogos marcados como empates
sorteios = list(itertools.combinations(range(28), 3))
assert len(sorteios) == 3276
k_emp = [sum(j < 6 for j in s) for s in sorteios]
assert (k_emp.count(1), sum(k >= 1 for k in k_emp)) == (1386, 1736)
P_d = F(um_emp, pelo_menos)
assert P_d == F(99, 124) and 1386 // 2 == 693 and 1736 // 2 == 868 and 7 * 99 == 693 and 7 * 124 == 868 and 9 * 11 == 99 and 4 * 31 == 124 and abs(float(P_d) - 99.2 / 124) < 1e-2
# distratores
assert F(um_emp, comb(28, 3)) == F(11, 26)                                   # sem a condição
assert F(pelo_menos, comb(28, 3)) == F(62, 117) and 1 - F(55, 117) == F(62, 117)  # "pelo menos 1" e parou
E3 = 28 * 3 - 78                                                             # erro: empate tira 2 pontos, 84 - 78 = 6, 6 ÷ 2 = 3
assert (28 * 3 - 78) // 2 == 3
x_225 = F(3 * comb(25, 2), comb(28, 3) - comb(25, 3))
assert x_225 == F(225, 244)
p6 = F(6, 28)
x_rep = 3 * p6 * (1 - p6) ** 2 / (1 - (1 - p6) ** 3)                          # com reposição
assert x_rep == F(121, 157)
vals_d = [float(F(11, 26)), float(F(62, 117)), float(F(121, 157)), float(P_d), float(F(225, 244))]
assert vals_d == sorted(vals_d) and len(set(vals_d)) == 5
# checagem: 5 times (10 jogos), 2 empates, sorteio de 2 jogos; sabendo que há pelo menos 1 empate, exatamente 1
assert comb(5, 2) == 10 and 2 * comb(8, 1) == 16 and comb(10, 2) - comb(8, 2) == 17 and comb(8, 2) == 28 and 10 * 9 // 2 == 45
ENUN_D = ('Oito times disputaram um campeonato em turno único: todos contra todos, uma vez. Vitória vale 3 pontos; empate vale 1 ponto para cada time; derrota, nenhum. '
          'A tabela mostra a pontuação final. O jornal não publicou os resultados dos jogos. Três jogos distintos são sorteados ao acaso entre todos os do campeonato. '
          'Sabendo que pelo menos um deles terminou empatado, a probabilidade de que exatamente um tenha terminado empatado é:')

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
        desenho=('Veja um painel aprovado de 6 lâmpadas: amarelo é acesa e branco é apagada, e nenhuma acesa fica ao lado de outra acesa.', 'painel-lampadas', []),
        eq='P = N ÷ T',
        leitura='chance = painéis aprovados com 5 acesas ÷ painéis aprovados',
        letras=[('P', 'chance de ter exatamente 5 acesas (o que a questão quer)'), ('N', 'painéis aprovados com exatamente 5 acesas'),
                ('T', 'total de painéis aprovados')],
        eq_texto='Entre os aprovados, cada painel pesa igual (a conta está no 1º passo de T), então só é preciso contar: favoráveis ÷ possíveis.\nAgora é só achar T e N, uma letra por vez.',
        achando=[('Achando T: contar os aprovados (1 de 4)',
                  'Um painel certo, lâmpada por lâmpada, tem chance 1/2 doze vezes: 2 · 2 · ... dá 4 096. Cada painel tem chance 1/4 096.\n'
                  'Entre os aprovados todos pesam igual: o 1/4 096 se corta e a chance é N ÷ T. (Teste: (3 · 5) ÷ (7 · 5) = 3/7.)'),
                 ('Achando T: contar os aprovados (2 de 4)',
                  'Olhe a última lâmpada. Apagada: as 11 de antes são um painel aprovado qualquer. Acesa: a anterior tem de ser apagada, e as 10 de antes são um aprovado qualquer.\n'
                  'Com a(n) = painéis aprovados de n lâmpadas: a(12) = a(11) + a(10).'),
                 ('Achando T: contar os aprovados (3 de 4)',
                  'Teste com 1 = acesa e 0 = apagada. a(1) = 2 (0 ou 1). a(2) = 3 (00, 01, 10; o 11 não vale). Com 3 lâmpadas, terminando em 0: 000, 010, 100, são 3 = a(2). Terminando em 1: 001 e 101, são 2 = a(1).\n'
                  'a(3) = 3 + 2 = 5. A regra confere.'),
                 ('Achando T: contar os aprovados (4 de 4)',
                  'a(4) = 5 + 3 = 8; a(5) = 8 + 5 = 13; a(6) = 13 + 8 = 21; a(7) = 21 + 13 = 34.\n'
                  'a(8) = 34 + 21 = 55; a(9) = 55 + 34 = 89; a(10) = 89 + 55 = 144; a(11) = 144 + 89 = 233.\n'
                  'a(12) = 233 + 144 = 377.\nT = 377 painéis aprovados.'),
                 ('Achando N: os vãos entre as apagadas (1 de 3)',
                  'Com 5 acesas, sobram 12 − 5 = 7 apagadas. Vão é o lugar onde uma acesa pode entrar: antes da 1ª apagada, entre duas apagadas vizinhas, ou depois da última.\n'
                  'No desenho, 3 apagadas dão 4 vãos. 7 apagadas dão 7 + 1 = 8 vãos.',
                  {'tipo': 'diagrama', 'nome': 'painel-lampadas',
                   'rotulos': ['', '', 'exemplo: 3 apagadas deixam 4 vãos (1 a 4)', 'cada acesa entra num vão diferente']}),
                 ('Achando N: os vãos entre as apagadas (2 de 3)',
                  'Cada acesa vai num vão diferente, e assim nenhuma fica colada em outra: entre duas acesas há sempre uma apagada.\n'
                  'Vale também a volta: num painel aprovado, as 5 acesas estão separadas por apagadas, então cada uma ocupa um vão diferente. Nenhum aprovado fica de fora.'),
                 ('Achando N: escolher os vãos (3 de 3)',
                  'Escolher 5 vãos entre 8 é o mesmo que escolher os 3 que ficam vazios: C(8, 5) = C(8, 3).\n'
                  '8 · 7 · 6 = 336, e 3 · 2 · 1 = 6. 336 ÷ 6 = 56.\nN = 56 painéis.')],
        volta='P = N ÷ T = 56 ÷ 377.\n56 = 2 · 2 · 2 · 7, então só o 2 e o 7 poderiam cortar. 377 é ímpar: o 2 não divide. 7 · 53 = 371 e 7 · 54 = 378: 377 não é múltiplo de 7.\n'
              'Sem fator comum, a fração não simplifica: P = 56/377.\n'
              'Resposta: alternativa X. Conferindo: 377 · 0,15 = 56,55 (377 · 15 = 5 655), que passa de 56. Logo 56 ÷ 377 é um pouco menos que 0,15.',
        valores=[('T', '377 painéis'), ('N', '56 painéis'), ('P', '56/377')],
        pista='"sem duas acesas vizinhas" → olhe a última lâmpada (total = soma dos dois anteriores); para um número fixo de acesas, encaixe-as nos vãos entre as apagadas.',
        rec1='12 lâmpadas; chance 1/2 cada; aprovado: sem 2 acesas vizinhas; 5 acesas', rec3='T = 377; N = 56; P = 56/377',
        checagem=('5 lâmpadas em fila, nenhuma acesa ao lado de outra acesa. Quantos painéis têm exatamente 2 acesas?',
                  ['4', '6', '10', '3'], '6',
                  'Sobram 3 apagadas e 4 vãos. Escolher 2 vãos entre 4: 4 · 3 ÷ 2 = 6. (C(5, 2) = 10 ignora a proibição.)'),
        ancora=('parcial · ITA 2021 1ª fase q.53 (variável auxiliar e contagem por casos, resposta exata) e HMMT fev. 2022 Combinatorics q.2 '
                '(casas coloridas sem vizinhas, 3 em 9); aqui 12 lâmpadas e 5 acesas, para a ideia dos vãos valer e a lista à mão não resolver'),
        canal='mat-40-combinacao-com-repeticao-analise-combina.txt [24:25:31] (escolher quantos de cada com restrição); a recorrência a(n) = a(n−1) + a(n−2) e os vãos não aparecem no canal',
        antes=['com-probabilidade', 'com-combinacao', 'com-condicional', 'fracoes'],
    ),
    dict(
        id='d2-escada-mat-ita-com-00a', materia='Matemática', tema=T, calc=float(P_a),
        enunciado=ENUN_A,
        dados=[('Ladrilho', '1 dm de lado = 10 cm, área 100 cm²'), ('Ficha', 'diâmetro 6 cm, ou seja, raio 3 cm'),
               ('Tocar 0 rejuntes', '4 pontos'), ('Tocar 1 rejunte', '2 pontos'), ('Tocar 2 rejuntes', '0 ponto'),
               ('Duas fichas', 'uma não influencia a outra'), ('Cesta (R$ 80) e par de fichas (R$ 2)', 'não entra na conta'),
               ('Quero', 'total 4 pontos: cada ficha tocou 1 rejunte')],
        alts=[('144/625', float(F(144, 625)), 'Esqueceu a condição do total: Pu · Pu = 12/25 · 12/25, sem dividir pelos casos que dão 4 pontos'),
              ('1/3', float(F(1, 3)), 'Pôs no numerador o outro jeito de dar 4 pontos (0 e 2 rejuntes, 72) sobre 216'),
              ('12/25', float(Pu), 'Só a chance de UMA ficha tocar exatamente 1 rejunte (48 ÷ 100), sem a 2ª ficha nem a soma'),
              ('2/3', float(P_a), 'OK'),
              ('4/5', float(F(4, 5)), 'Contou o jeito 0 e 2 rejuntes uma vez só (36), sem as 2 ordens: 144 ÷ (144 + 36)')],
        resumo='Pz = 4/25, Pd = 9/25, Pu = 12/25. Soma 4: dois 1 rejunte (144/625) ou 0 e 2 rejuntes em 2 ordens (72/625). Pq = 144 ÷ 216 = 2/3.',
        ideia='Total 4 só sai de dois jeitos, e o segundo tem duas ordens; as fichas são independentes, então as chances se multiplicam. Cada chance é uma área do ladrilho ÷ 100, e a condição encolhe os casos aos que dão 4.',
        pecas=[('Independentes', 'Uma ficha não muda a chance da outra: a chance das duas juntas é o produto.'),
               ('Condicional', 'Chance de algo sabendo que outra coisa já aconteceu: só contam os casos que cumprem a condição.')],
        formulas=[('contagem', 'Probabilidade por área', 'área da parte ÷ 100 cm²'), ('contagem', 'Fichas independentes', 'chance da 1ª · chance da 2ª'),
                  ('contagem', 'Condicional', 'casos pedidos ÷ casos que cumprem a condição')],
        desenho=('Veja o ladrilho de 1 dm = 10 cm, com o rejunte fino em volta, e uma ficha de diâmetro 6 cm (raio 3 cm). Exemplo: esta ficha passa por cima do rejunte de baixo (toca 1 rejunte). '
                 'O tracejado embaixo é o ladrilho vizinho.', 'ladrilho-ficha', []),
        eq='Pq = Pu · Pu ÷ (Pu · Pu + 2 · Pz · Pd)',
        leitura='chance = as duas tocam 1 rejunte ÷ (as duas tocam 1, ou uma toca 0 e a outra 2, em 2 ordens)',
        letras=[('Pq', 'chance de cada ficha ter tocado 1 rejunte, sabendo que o total foi 4 (o que a questão quer)'),
                ('Pz', 'chance de uma ficha tocar 0 rejuntes'), ('Pu', 'chance de uma ficha tocar 1 rejunte'),
                ('Pd', 'chance de uma ficha tocar 2 rejuntes')],
        eq_texto='Cada ficha vale 4, 2 ou 0 pontos. Total 4 só sai de 2 + 2 (as duas tocam 1) ou de 4 + 0 (uma toca 0 e a outra 2, em 2 ordens). Fichas independentes: as chances se multiplicam.\nAgora é só achar Pz, Pd e Pu, uma letra por vez.',
        achando=[('Achando Pz: a ficha vira um ponto',
                  'Só o centro da ficha importa: ele toca um rejunte quando está a 3 cm ou menos dele (6 ÷ 2 = 3). Todo ponto do ladrilho tem a mesma chance, então a chance de uma região é a área dela ÷ 100 (o ladrilho tem 10 · 10 = 100 cm²).'),
                 ('Achando Pz: nenhum rejunte',
                  'O centro fica no quadrado de dentro, de lado 10 − 3 − 3 = 4 cm. Área: 4 · 4 = 16 cm².\nPz = 16/100. Dividindo em cima e embaixo por 4 (cabe em 16 e em 100): 16 ÷ 4 = 4 e 100 ÷ 4 = 25. Pz = 4/25.'),
                 ('Achando Pd: dois rejuntes',
                  'Perto de dois lados vizinhos, o centro cai num canto de 3 · 3 = 9 cm². São 4 cantos: 4 · 9 = 36 cm².\nDois lados opostos nunca: 3 + 3 = 6 cm e o ladrilho tem 10 cm, então o centro não chega perto dos dois.\nPd = 36/100 = 9/25 (÷ 4).'),
                 ('Achando Pu: um rejunte',
                  'O que sobra toca só 1: 100 − 16 − 36 = 48 cm² (4 faixas de 3 · 4 = 12).\nPu = 48/100 = 12/25 (÷ 4).\nConfira: 4/25 + 12/25 + 9/25 = 25/25 = 1.',
                  {'tipo': 'diagrama', 'nome': 'ladrilho-ficha',
                   'rotulos': ['', '', '', '', 'verde: nenhum rejunte (16)', 'amarelo: 1 rejunte (4 faixas de 12)', 'rosa: 2 rejuntes (4 cantos de 9)']}),
                 ('Juntando as duas fichas',
                  'Fichas independentes: multiplique. 2 + 2: Pu · Pu = 12/25 · 12/25 = 144/625 (12 · 12 = 144 e 25 · 25 = 625).\n4 + 0: Pz · Pd = 4/25 · 9/25 = 36/625; são 2 ordens, então 2 · 36/625 = 72/625.')],
        volta='Pq = (144/625) ÷ (144/625 + 72/625). Mesmo número embaixo: 144 + 72 = 216, e fica 144/216 (o 625 se corta).\n'
              '144 = 2 · 72 e 216 = 3 · 72. Dividindo em cima e embaixo por 72: Pq = 2/3.\nResposta: alternativa X. Conferindo: 2/3 é cerca de 0,67, mais que a metade, porque o jeito 2 + 2 tem o dobro de área do outro.',
        valores=[('Pz', '4/25'), ('Pd', '9/25'), ('Pu', '12/25'), ('Pq', '2/3')],
        pista='duas fichas e uma soma de pontos: liste os pares que dão a soma, multiplique as chances de cada par (as ordens contam) e divida pelo total dos pares.',
        rec1='ladrilho 100 cm²; fichas independentes; total 4 pontos', rec3='ache Pz, Pd e Pu, junte os pares e volte',
        checagem=('Duas fichas independentes valem 1 ponto (chance 1/2) ou 0 ponto (chance 1/2). Sabendo que o total foi 1 ponto, qual a chance de a 1ª ter feito 1 ponto?',
                  ['1/4', '1/2', '3/4', '1/3'], '1/2',
                  'Total 1 só em 1 + 0 ou 0 + 1, e cada ordem vale 1/2 · 1/2 = 1/4. A 1ª fez 1 ponto numa das duas: (1/4) ÷ (1/4 + 1/4) = 1/2.'),
        ancora=('parcial · ENEM 2019 CD7 q.173 (condicional contando em 100, com porcentagens); a parte de área (probabilidade geométrica, ficha no ladrilho) '
                'não tem real aberta do tema, só o canal; a nossa une as duas, com 2 fichas independentes e soma de pontos (2 jeitos, 2 ordens), e traz dado que sobra'),
        canal='fuv-07-analise-combinatoria-e-probabi.txt [3:53:00] (probabilidade geométrica: área favorável ÷ área total); fuv-08-analise-combinatoria-e-probabi.txt [4:00:32] (probabilidade condicional)',
        antes=['com-probabilidade', 'com-condicional', 'com-independentes', 'fracoes'],
    ),
    dict(
        id='d2-escada-mat-ita-com-00c', materia='Matemática', tema=T, calc=74.0,
        enunciado=ENUN_C,
        dados=[('Pessoas', '10 000'), ('Menos de 40 anos', '5 000 pessoas, 5% com a doença'), ('40 anos ou mais', '5 000 pessoas, 10% com a doença'),
               ('Exame em doente', 'positivo em 90% (0,9)'), ('Exame em sadia', 'positivo em 10% (0,1), por engano'),
               ('Regra', '2 resultados iguais valem; se divergem, o 3º decide'), ('Preço de cada exame', 'R$ 120: não entra na conta')],
        alts=[('42%', 42.0, 'Parou no 1º exame: 675 ÷ (675 + 925), com 0,9 · 750 doentes e 0,1 · 9 250 sadias'),
              ('74%', 74.0, 'OK'),
              ('87%', 87.0, 'Só aceitou 2 positivos e ignorou o 3º exame: 607,5 ÷ (607,5 + 92,5)'),
              ('90%', 90.0, 'Pegou a taxa de acerto do exame (90%) como se fosse a resposta'),
              ('97%', 97.0, 'Pegou a chance de a regra acusar um doente (0,972), sem olhar as sadias acusadas')],
        resumo='Doentes 750, sadias 9 250. A regra acusa um doente com 0,972 e uma sadia com 0,028: 729 e 259. 729 ÷ 988 é cerca de 74%.',
        ideia='Conte pessoas, não porcentagens: ache os doentes e as sadias e a chance de a regra de 3 exames acusar cada tipo, somando os caminhos da árvore. Depois compare os doentes acusados com todos os acusados.',
        pecas=[('Caminho da árvore', 'Uma sequência de resultados dos exames: multiplique as chances dela. Caminhos que levam à mesma conclusão se somam.'),
               ('Desempate', 'O 3º exame só é feito se o 1º e o 2º divergem, e aí ele decide.')],
        formulas=[('porcentagem', 'Porcentagem de um valor', 'valor ÷ 100 · porcentagem'), ('contagem', 'Caminho da árvore', 'multiplica as chances de cada etapa'),
                  ('contagem', 'Bayes por contagem', 'doentes acusados ÷ todos os acusados')],
        eq='Pq = Dc ÷ (Dc + Sc)',
        leitura='porcentagem = doentes que a regra acusa ÷ todos que a regra acusa',
        letras=[('Pq', 'porcentagem de doentes entre os acusados (o que a questão quer)'),
                ('Dc', 'doentes que a regra classifica como doentes'), ('Sc', 'sadias que a regra classifica como doentes')],
        eq_texto='Conte pessoas em vez de porcentagens. A regra acusa quem tem 2 positivos, ou 1 positivo e 1 negativo seguidos de um 3º positivo.\nAgora é só achar Dc e Sc, uma letra por vez: quantos doentes e sadias existem, e a chance de a regra acusar cada um.',
        achando=[('Achando Dc: quantos doentes (1 de 4)',
                  'Menos de 40 anos: 5% de 5 000 = 5 000 ÷ 100 · 5 = 250. 40 anos ou mais: 10% de 5 000 = 5 000 ÷ 10 = 500.\nDoentes ao todo: 250 + 500 = 750. Sadias: 10 000 − 750 = 9 250.'),
                 ('Achando Dc: a regra acusa um doente (2 de 4)',
                  'Doente: positivo com chance 0,9 e negativo com 0,1. Positivo, positivo: 0,9 · 0,9 = 0,81 (9 · 9 = 81, com 2 casas).\nExames diferentes: positivo, negativo 0,9 · 0,1 = 0,09; negativo, positivo 0,1 · 0,9 = 0,09. Soma: 0,18.'),
                 ('Achando Dc: a regra acusa um doente (3 de 4)',
                  'Nesses 0,18 há um 3º exame, positivo com chance 0,9: 0,18 · 0,9 = 0,162 (18 · 9 = 162, com 3 casas).\nA regra acusa o doente com chance 0,81 + 0,162 = 0,972.'),
                 ('Achando Dc: doentes acusados (4 de 4)',
                  'Dc = 750 · 0,972. O 750 é 3/4 de 1 000. 0,972 · 1 000 = 972; 972 ÷ 4 = 243; 243 · 3 = 729.\nDc = 729 doentes acusados.'),
                 ('Achando Sc: a regra acusa uma sadia (1 de 2)',
                  'Sadia: positivo com chance 0,1 e negativo com 0,9. Positivo, positivo: 0,1 · 0,1 = 0,01.\nExames diferentes: 0,1 · 0,9 = 0,09, duas vezes: 0,18. O 3º positivo tem chance 0,1: 0,18 · 0,1 = 0,018. A regra acusa a sadia com chance 0,01 + 0,018 = 0,028.'),
                 ('Achando Sc: sadias acusadas (2 de 2)',
                  'Sc = 9 250 · 0,028. Sem vírgula: 9 250 · 28 = 9 000 · 28 + 250 · 28 = 252 000 + 7 000 = 259 000.\n0,028 tem 3 casas, então tire 3 zeros: Sc = 259 sadias acusadas.')],
        volta='Pq = 729 ÷ (729 + 259) = 729 ÷ 988.\nSem calculadora: 988 · 74 = 73 112, então 988 · 0,74 = 731,12; e 988 · 0,73 = 721,24. O 729 fica entre os dois, bem perto do 731,12: Pq é cerca de 0,74.\n'
              'Resposta: alternativa X. Conferindo: 0,74 = 74%, menos que os 90% do exame, porque as sadias são 9 250 de 10 000.',
        valores=[('Dc', '729 pessoas'), ('Sc', '259 pessoas'), ('Pq', 'cerca de 74%')],
        pista='conte pessoas: doentes e sadias, a chance de a regra acusar cada tipo (multiplique no caminho, some os caminhos) e divida doentes acusados por todos os acusados.',
        rec1='10 000 pessoas, 750 doentes; regra de 3 exames', rec3='ache Dc e Sc e volte',
        checagem=('Uma pessoa doente faz 2 exames independentes, cada um positivo com chance 0,9. Qual a chance de o 1º dar positivo e o 2º dar negativo?',
                  ['0,09', '0,81', '0,90', '0,19'], '0,09',
                  'Negativo tem chance 1 − 0,9 = 0,1. Positivo e depois negativo: 0,9 · 0,1 = 0,09 (9 · 1 = 9, com 2 casas). 0,81 é positivo nos dois.'),
        ancora=('forte · ENEM 2019 CD7 q.173 (Bayes contando em 100: de fraudulenta para inconsistente) e Fuvest 2025 2ª fase M02 '
                '(tabela e condicionais com denominadores trocados); aqui 2 faixas de idade e regra de 3 exames com desempate (caminhos da árvore somados)'),
        canal='fuv-08-analise-combinatoria-e-probabi.txt [4:00:32] (clássico da probabilidade condicional); mat-04-porcentagem.txt [2:06:31] (percentual de um valor)',
        antes=['porcentagem', 'com-bayes', 'fracoes', 'multiplicar-decimais', 'com-ramos'],
    ),
    dict(
        id='d2-escada-mat-ita-com-00d', materia='Matemática', tema=T, calc=float(P_d),
        enunciado=ENUN_D,
        dados=[('Tigres', '17'), ('Raio', '15'), ('Pelé', '13'), ('Unidos', '11'), ('Estrela', '9'), ('Garra', '6'), ('Furacão', '4'), ('Cometa', '3'),
               ('Público total do campeonato', '9 200 pessoas: não entra na conta')],
        alts=[('11/26', float(F(11, 26)), 'Esqueceu a condição: 1 386 ÷ 3 276, todos os sorteios possíveis'),
              ('62/117', float(F(62, 117)), 'Achou a chance de pelo menos um empate (1 736 ÷ 3 276) e parou'),
              ('121/157', float(F(121, 157)), 'Sorteou com reposição (o mesmo jogo podia sair 2 vezes): 3 · (3/14) · (11/14)² dividido por 1 − (11/14)³'),
              ('99/124', float(P_d), 'OK'),
              ('225/244', float(F(225, 244)), 'Achou que cada empate tira 2 pontos: 3 empates em vez de 6')],
        resumo='28 jogos, 84 − 78 = 6 empates. Sorteios de 3: 3 276. Exatamente 1 empate: 6 · 231 = 1 386. Pelo menos 1: 3 276 − 1 540 = 1 736. 1 386 ÷ 1 736 = 99/124.',
        ideia='Cada empate tira 1 ponto do total possível, então os pontos dizem quantos empates houve sem saber quais. Depois conte os sorteios de 3 jogos: a condição encolhe o total aos que têm pelo menos 1 empate.',
        pecas=[('Combinação', 'Quantos jeitos de escolher k entre n, sem ligar para a ordem: n · (n−1) · ... ÷ (k · ... · 1).'),
               ('Pelo menos 1', 'É todos os casos menos os casos de nenhum.')],
        formulas=[('contagem', 'Probabilidade', 'quero ÷ tudo'), ('contagem', 'Condicional', 'casos pedidos ÷ casos que cumprem a condição'),
                  ('contagem', 'Combinação', 'n · (n−1) · ... ÷ k!')],
        eq='Pq = Xu ÷ Mu',
        leitura='chance = sorteios com exatamente 1 empate ÷ sorteios com pelo menos 1 empate',
        letras=[('Pq', 'chance de exatamente 1 empate, sabendo que há pelo menos 1 (o que a questão quer)'),
                ('Xu', 'sorteios de 3 jogos com exatamente 1 empate'), ('Mu', 'sorteios de 3 jogos com pelo menos 1 empate')],
        eq_texto='Sabendo que há pelo menos 1 empate, o grupo possível encolhe para os sorteios que têm pelo menos 1. A chance é então os sorteios com exatamente 1 ÷ os com pelo menos 1.\nAntes de achar Xu e Mu, é preciso saber quantos jogos e quantos empates houve.',
        achando=[('Quantos jogos',
                  'Cada time joga contra 7 outros: 8 · 7 = 56, mas cada jogo foi contado duas vezes (uma por time), então 56 ÷ 2 = 28 jogos.\n(Com 3 times: 3 · 2 ÷ 2 = 3 jogos.)'),
                 ('Pontos se ninguém empatasse',
                  '28 · 3 = 84. Um empate dá 1 + 1 = 2 pontos, e não os 3 de uma vitória: cada empate tira 1 ponto do total.'),
                 ('Quantos empates',
                  'A tabela soma 17 + 15 = 32; 32 + 13 = 45; 45 + 11 = 56; 56 + 9 = 65; 65 + 6 = 71; 71 + 4 = 75; 75 + 3 = 78.\nFaltam 84 − 78 = 6 empates, e 28 − 6 = 22 jogos com vencedor. Nem precisa saber quais empataram.'),
                 ('Quantos sorteios existem',
                  'Escolher 3 jogos entre 28, sem ordem: 28 · 27 · 26 = 19 656 (28 · 27 = 756 e 756 · 26 = 19 656), dividido por 3 · 2 · 1 = 6: 19 656 ÷ 6 = 3 276 sorteios no total.'),
                 ('Achando Xu: exatamente 1 empate',
                  'Escolher o 1 empate entre os 6: 6 jeitos. Escolher os outros 2 jogos entre os 22 com vencedor: 22 · 21 = 462, e 462 ÷ 2 = 231 jeitos.\nAs duas escolhas se multiplicam: Xu = 6 · 231 = 1 386.'),
                 ('Achando Mu: pelo menos 1 empate',
                  '"Pelo menos 1" é todos menos "nenhum". Nenhum empate: os 3 jogos saem dos 22 com vencedor: 22 · 21 · 20 = 9 240 (462 · 20), e 9 240 ÷ 6 = 1 540.\nMu = 3 276 − 1 540 = 1 736.')],
        volta='Pq = Xu ÷ Mu = 1 386 ÷ 1 736.\nDividindo em cima e embaixo por 2: 693/868. Depois por 7 (7 · 99 = 693 e 7 · 124 = 868): 99/124.\n99 = 9 · 11 e 124 = 4 · 31: não há fator comum.\n'
              'Resposta: alternativa X. Conferindo: 124 · 0,8 = 99,2, então 99/124 é cerca de 0,8.',
        valores=[('Xu', '1 386 sorteios'), ('Mu', '1 736 sorteios'), ('Pq', '99/124')],
        pista='cada empate tira 1 ponto do total (3 por jogo): os pontos dizem quantos empates houve. Exatamente 1 = escolhas que se multiplicam; pelo menos 1 = todos menos nenhum; a condição troca o total.',
        rec1='8 times, 28 jogos, 6 empates; sorteio de 3 jogos', rec3='ache Xu e Mu e volte',
        checagem=('5 times jogam todos contra todos (10 jogos) e 2 foram empates. Sorteando 2 jogos distintos, sabendo que pelo menos um foi empate, qual a chance de exatamente um ter sido empate?',
                  ['16/17', '1/2', '16/45', '28/45'], '16/17',
                  'Exatamente 1: 2 · 8 = 16. Pelo menos 1: 10 · 9 ÷ 2 = 45 sorteios, menos 8 · 7 ÷ 2 = 28 sem empate, dá 17. Então 16/17. (16/45 esquece a condição.)'),
        ancora=('parcial · HMMT fev. 2021 Combinatorics q.2 (invariante: cada partida elimina 1 jogador, então se contam partidas e não jogadores); '
                'aqui a invariante é cada empate tirar 1 ponto do total de 84, e se sorteiam 3 jogos com condicional'),
        canal='mat-41-probabilidade.txt [25:03:01] (probabilidade = favoráveis ÷ espaço amostral); mat-40-combinacao-com-repeticao-analise-combina.txt [24:25:31] (combinação); a invariante dos pontos fora do canal',
        antes=['com-probabilidade', 'com-combinacao', 'com-condicional', 'com-escolhas-juntas', 'fracoes'],
    ),
]

MANTER = {}  # as 3 antigas (00a, 00c, 00d) viraram reescritas acima, mais difíceis

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
    'com-independentes': {
        'titulo': 'Independentes: multiplicar as chances',
        'linhas': [
            'Duas coisas são independentes quando uma não muda a chance da outra. A chance das duas juntas é o produto das chances.',
            'Moeda e dado: cara é 1/2 e o número 3 é 1/6. Cara e 3 juntos: 1/2 · 1/6 = 1/12.',
            'Multiplicar frações: em cima com em cima, embaixo com embaixo. 2/5 · 3/4 = 6/20 = 3/10 (dividindo por 2).',
            'Se o par pode sair em duas ordens (cara e coroa, ou coroa e cara), as duas contam: some as chances das ordens.',
            'Duas moedas, uma cara e uma coroa: 1/2 · 1/2 = 1/4 por ordem. Com 2 ordens: 1/4 + 1/4 = 1/2.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Juntando chances', 'cabecalho': ['Situação', 'Conta', 'Chance'],
                   'linhas': [['Cara e o 3', '1/2 · 1/6', '1/12'], ['Cara, depois coroa', '1/2 · 1/2', '1/4'], ['Uma cara e uma coroa, qualquer ordem', '1/4 + 1/4', '1/2']]},
        'exercicios': [
            {'enunciado': 'Uma moeda e um dado são lançados. Qual é a chance de sair cara e um número par?', 'alternativas': ['1/4', '1/2', '3/4', '1/8'], 'certa': 0,
             'resolucao': '1/4: cara é 1/2 e par é 3 em 6, 1/2. 1/2 · 1/2 = 1/4.\n1/2 é a chance só da cara; 3/4 é a de cara ou par; 1/8 conta a moeda duas vezes (1/2 · 1/2 · 1/2).'},
            {'enunciado': 'Duas moedas são lançadas. Qual é a chance de saírem uma cara e uma coroa, em qualquer ordem?', 'alternativas': ['1/2', '1/4', '3/4', '1/3'], 'certa': 0,
             'resolucao': '1/2: cara e coroa valem 1/2 · 1/2 = 1/4, e coroa e cara também. 1/4 + 1/4 = 1/2.\n1/4 conta uma ordem só; 3/4 é a chance de pelo menos uma cara; 1/3 trata 3 resultados como se fossem igualmente prováveis.'},
        ],
    },
    'com-ramos': {
        'titulo': 'Árvore: multiplicar no caminho, somar os caminhos',
        'linhas': [
            'Uma árvore mostra o que pode acontecer em etapas. Cada caminho é uma sequência de resultados.',
            'Num caminho, multiplique as chances de cada etapa. Exame com 0,9 de positivo: positivo e depois negativo = 0,9 · 0,1 = 0,09.',
            'Caminhos diferentes que dão o mesmo final se somam: (positivo, negativo) e (negativo, positivo) valem 0,09 + 0,09 = 0,18.',
            'Decimais: 0,9 · 0,1 = 0,09 (9 · 1 = 9, com 2 casas). 0,18 · 0,9 = 0,162 (18 · 9 = 162, com 3 casas).',
            'Confira: todos os caminhos somam 1. Com 2 exames: 0,81 + 0,09 + 0,09 + 0,01 = 1.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Dois exames', 'cabecalho': ['Caminho', 'Conta', 'Chance'],
                   'linhas': [['positivo, positivo', '0,9 · 0,9', '0,81'], ['positivo, negativo', '0,9 · 0,1', '0,09'],
                              ['negativo, positivo', '0,1 · 0,9', '0,09'], ['negativo, negativo', '0,1 · 0,1', '0,01']]},
        'exercicios': [
            {'enunciado': 'Um teste acusa 80% das peças defeituosas (0,8). Uma peça defeituosa é testada 2 vezes, uma não depende da outra. Qual a chance de o 1º acusar e o 2º não acusar?',
             'alternativas': ['0,16', '0,64', '0,04', '0,20'], 'certa': 0,
             'resolucao': '0,16: acusar é 0,8 e não acusar é 1 − 0,8 = 0,2. 0,8 · 0,2 = 0,16 (8 · 2 = 16, com 2 casas).\n0,64 é acusar nas duas (0,8 · 0,8); 0,04 é não acusar nas duas (0,2 · 0,2); 0,20 é só a chance do 2º não acusar.'},
            {'enunciado': 'A mesma peça defeituosa é testada 2 vezes. Qual a chance de os dois resultados serem diferentes (um acusa e o outro não)?',
             'alternativas': ['0,32', '0,16', '0,64', '0,36'], 'certa': 0,
             'resolucao': '0,32: acusa e depois não vale 0,8 · 0,2 = 0,16, e não acusa e depois acusa vale 0,2 · 0,8 = 0,16. Somando: 0,16 + 0,16 = 0,32.\n0,16 é uma só das ordens; 0,64 é acusar nas duas; 0,36 é 1 − 0,64 e inclui não acusar nas duas.'},
        ],
    },
    'com-escolhas-juntas': {
        'titulo': 'Escolhas juntas: multiplicar os jeitos',
        'linhas': [
            'Para fazer duas escolhas, multiplique os jeitos de cada uma. Com 3 camisas e 4 calças há 3 · 4 = 12 trajes.',
            'Com combinação: de 4 bolas vermelhas e 5 azuis, escolher 1 vermelha e 2 azuis. 1 vermelha: 4 jeitos. 2 azuis: 5 · 4 ÷ 2 = 10 jeitos.',
            'Juntando as escolhas: 4 · 10 = 40 jeitos de pegar 1 vermelha e 2 azuis.',
            '"Nenhuma vermelha" em 3 bolas é escolher as 3 só entre as 5 azuis: 5 · 4 · 3 = 60, dividido por 3 · 2 · 1 = 6, dá 10 jeitos.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Escolhas juntas', 'cabecalho': ['Escolha', 'Conta', 'Jeitos'],
                   'linhas': [['1 vermelha entre 4', '4', '4'], ['2 azuis entre 5', '5 · 4 ÷ 2', '10'], ['As duas juntas', '4 · 10', '40']]},
        'exercicios': [
            {'enunciado': 'Uma caixa tem 3 bolas verdes e 6 amarelas. De quantos jeitos se escolhem 1 verde e 2 amarelas, sem ligar para a ordem?',
             'alternativas': ['45', '18', '90', '15'], 'certa': 0,
             'resolucao': '45: 1 verde entre 3 são 3 jeitos; 2 amarelas entre 6 são 6 · 5 ÷ 2 = 15. Juntas: 3 · 15 = 45.\n90 esquece de dividir por 2 as amarelas (3 · 30); 18 é 3 · 6, só 1 amarela; 15 são só as amarelas.'},
            {'enunciado': 'Numa turma há 5 meninos e 4 meninas. Quantos trios têm exatamente 1 menina?',
             'alternativas': ['40', '80', '20', '10'], 'certa': 0,
             'resolucao': '40: 1 menina entre 4 são 4 jeitos; 2 meninos entre 5 são 5 · 4 ÷ 2 = 10. Juntos: 4 · 10 = 40.\n80 esquece de dividir por 2 os meninos (4 · 20); 20 são os meninos com ordem, sem as meninas; 10 são só os meninos.'},
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
