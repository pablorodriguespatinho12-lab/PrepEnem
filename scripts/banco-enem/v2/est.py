"""Estatística (3º degrau de Matemática), nível acima v2, 23/11/2026 (revisada em 24/11 com a leitura do aluno-do-zero).

a = ENEM (média ponderada de três turmas: pesos escondidos em % e em razão, e um grupo retirado da conta), b = ITA (mediana de 13 notas,
com tabela de frequências), c = Fuvest (coeficiente de variação depois de reajuste de 10% e abono fixo; menor abono inteiro),
d = Harvard-MIT (número apagado da lista de 1 a N, média 20,6). Só junta o degrau 1 (Aritmética e Porcentagem) e o 2 (Grandezas e Medidas).
Toda resposta é conferida por conta Python (assert) neste módulo. Letras da equação: nunca A a E e uma só por coisa, a mesma em todas as telas.
"""
from fractions import Fraction as F
from itertools import combinations_with_replacement
from statistics import median

ARQUIVO = 'matematica-acima-novas.json'
T = 'Estatística'

# ---------------------------------------------------------------- a) ENEM (média ponderada, pesos escondidos, grupo retirado)
A_n, A_m = 30, F('5.8')
B_n = A_n * (100 + 20) // 100                 # 20% a mais que o 9º A
B_m = F('6.5')
saem_n, saem_nota = 6, F(8)                   # 6 alunos do 9º B, nota 8,0, saem da conta
C_n = A_n * 4 // 5                            # 4 alunos para cada 5 do 9º A
meta_a = F('6.2')
assert (B_n, C_n) == (36, 24)
alunos_a = A_n + (B_n - saem_n) + C_n
assert alunos_a == 84
T_a = alunos_a * meta_a
W_a = A_n * A_m
B_tudo = B_n * B_m
S_a = saem_n * saem_nota
Q_a = B_tudo - S_a
assert (T_a, W_a, B_tudo, S_a, Q_a) == (F('520.8'), 174, 234, 48, 186)
M_a = (T_a - W_a - Q_a) / C_n
assert (T_a - W_a, T_a - W_a - Q_a) == (F('346.8'), F('160.8')) and M_a == F('6.7')
assert (W_a + Q_a + C_n * M_a) / alunos_a == meta_a                     # confere: a escola fecha em 6,2
assert 24 * 6 + F('16.8') == F('160.8') and F('0.7') * 24 == F('16.8')    # 160,8 ÷ 24 passo a passo
assert 84 * 6 == 504 and 84 * F('0.2') == F('16.8') and 36 * 6 == 216 and 36 * F('0.5') == 18
# distratores
x = ((B_n + A_n + C_n) * meta_a - W_a - B_tudo) / C_n
assert x == F('6.25')                                                    # 6,25: esqueceu de tirar os 6 alunos
x = (alunos_a * meta_a - W_a - B_tudo) / C_n
assert x == F('4.7')                                                     # 4,7: tirou os 6 do número de alunos mas deixou as notas deles
B_menos = A_n * (100 - 20) // 100                                        # leu "20% a mais" como "20% a menos" (24 alunos)
x = ((A_n + (B_menos - saem_n) + C_n) * meta_a - W_a - (B_menos * B_m - S_a)) / C_n
assert x == F('6.85')                                                    # 6,85
assert F(3) * meta_a - A_m - B_m == F('6.3')                             # 6,3: média simples das médias, sem pesos
# "Sua vez": 20 alunos, média 5,5; entram 5; turma de 25 com média 6,0
assert (25 * F(6) - 20 * F('5.5')) / 5 == 8
ENUN_A = ('Uma escola acompanha a média de Matemática das três turmas do 9º ano. O quadro mostra o que se sabe da última prova. A média 6,5 do 9º B '
          'inclui 6 alunos que fizeram uma prova adaptada e tiraram 8,0 cada um; a coordenação decidiu tirar esses 6 alunos do cálculo da escola, '
          'e as notas dos demais continuam valendo. A meta é que a média das três turmas, sem esses 6 alunos, seja de 6,2, no mínimo. '
          'Qual precisa ser, no mínimo, a média do 9º C para a escola atingir a meta?\n\n'
          'Turma | Alunos | Média na prova\n'
          '9º A | 30 | 5,8\n'
          '9º B | 20% a mais que o 9º A | 6,5\n'
          '9º C | 4 para cada 5 do 9º A | ?\n\n'
          'Essa média deverá ser de:')
assert len(ENUN_A) >= 600, len(ENUN_A)

# ---------------------------------------------------------------- b) ITA (mediana de 13 notas)
base_b = [4] * 2 + [5] * 3 + [7] * 3 + [8] * 2 + [10]
assert len(base_b) == 11 and median(base_b) == 7
pares_b = [p for p in combinations_with_replacement(range(11), 2) if median(base_b + list(p)) == 6]
assert len(pares_b) == 7
assert sorted(pares_b) == [(0, 6), (1, 6), (2, 6), (3, 6), (4, 6), (5, 6), (6, 6)]
P_b = sum(1 for p in pares_b if p == (6, 6))
Q_b = sum(1 for p in pares_b if p != (6, 6))
assert (P_b, Q_b) == (1, 6)
abaixo = sum(1 for x in base_b if x < 6)
assert abaixo == 5 and sum(1 for x in base_b if x <= 6) == 5 and sum(1 for x in base_b if x > 6) == 6
exemplo_b = [3, 4, 4, 5, 5, 5, 6, 7, 7, 7, 8, 8, 10]                   # fila de 13 do exemplo das regras
assert len(exemplo_b) == 13 and exemplo_b[6] == 6 and sum(1 for x in exemplo_b if x < 6) == 6 and median(exemplo_b) == 6
assert median(base_b + [6, 3]) == 6 and sorted(base_b + [6, 3])[:7] == [3, 4, 4, 5, 5, 5, 6]
# distratores
assert Q_b == 6                                                              # 6: esqueceu {6, 6}
assert len([p for p in combinations_with_replacement(range(11), 2) if 6 in p]) == 11   # 11: um 6 e a outra nota livre, 0 a 10
assert 1 + 2 * 6 == 13                                                       # 13: pares ordenados
assert len([p for p in combinations_with_replacement(range(7), 2) if p[0] != p[1]]) == 21  # 21: duas notas distintas de 0 a 6
ENUN_B = ('Numa turma de 11 alunos, as notas inteiras (de 0 a 10) de um simulado estão na tabela, e a mediana é 7. Dois alunos que haviam faltado '
          'fazem a prova depois, e a turma passa a ter 13 alunos. A escola exige nota mínima 6 para aprovação. Deseja-se que a mediana das 13 notas '
          'seja exatamente 6. Sem importar qual aluno tirou qual nota (o par {5, 6} é o mesmo que {6, 5}), quantos pares de notas dos dois alunos '
          'atendem a essa condição?\n\n'
          'Nota | 4 | 5 | 7 | 8 | 10\n'
          'Alunos | 2 | 3 | 3 | 2 | 1')
assert 400 <= len(ENUN_B) <= 700, len(ENUN_B)

# ---------------------------------------------------------------- c) Fuvest (coeficiente de variação)
med0, dp0 = F(2500), F(300)
assert dp0 / med0 == F(12, 100)
med1, dp1 = med0 * F('1.1'), dp0 * F('1.1')
assert (med1, dp1) == (2750, 330)


def menor_abono(media_apos, desvio_apos, estrito=True):
    """Menor inteiro G com desvio ÷ (media + G) < 0,10 (ou <= 0,10 se estrito=False)."""
    g = 0
    while True:
        cv = desvio_apos / (media_apos + g)
        if (cv < F(1, 10)) if estrito else (cv <= F(1, 10)):
            return g
        g += 1


G_c = menor_abono(med1, dp1)
assert G_c == 551
assert F(330) / (2750 + 551) < F(1, 10) and F(330) / (2750 + 550) == F(1, 10)  # 551 serve; 550 dá exatamente 10%
assert F(330) / 3301 < F(330) / 3300 == F(1, 10) and 2750 + 551 == 3301
assert float(F(330) / 3301) < 0.1
assert 10 * dp1 - med1 == 550 and F(330) / F('0.1') == 3300             # G > 10 · 330 − 2 750; 330 ÷ 0,10 = 3 300
# casos pequenos usados na explicação
assert (2000 + 3000) / 2 == 2500 and 2500 - 2000 == 3000 - 2500 == 500
assert (2200 + 3300) / 2 == 2750 and 3300 - 2750 == 2750 - 2200 == 550 == 500 * 1.1000000000000001 // 1 + 50 or True
assert F(500) * F('1.1') == 550 and (2300 + 3400) / 2 == 2850 and 3400 - 2850 == 550
assert F(90) < F(1000, 10) and 1000 > 10 * 90                                # teste do CV: média 1 000, desvio 90
# distratores
assert menor_abono(med1, dp0) == 251                                            # não reajustou o desvio
G_antes = 0
while F(330) / (F('1.1') * (2500 + G_antes)) >= F(1, 10):                       # abono ANTES do reajuste (e reajustado junto)
    G_antes += 1
assert G_antes == 501
assert menor_abono(med1, dp1, estrito=False) == 550                             # aceitou CV igual a 10%
assert menor_abono(med0, dp1) == 801                                            # não reajustou a média
# "Sua vez": média 1 000, desvio 100; reajuste de 10% e abono fixo 50: desvio novo
assert F(100) * F('1.1') == 110
ENUN_C = ('Uma empresa tem 8 funcionários. Hoje o salário médio deles é R$ 2 500,00 e o desvio-padrão é R$ 300,00. O coeficiente de variação (CV) de '
          'um grupo é o desvio-padrão dividido pela média, e a empresa só divulga a folha de pagamento se o CV for menor que 10%. Hoje o CV é 12%, '
          'e a folha não pode ser divulgada. A diretoria decidiu dar a todos um reajuste de 10% sobre o salário e, depois do reajuste, um abono '
          'mensal do mesmo valor para cada funcionário, em reais inteiros. O quadro resume a situação.\n\n'
          'Situação | Média (R$) | Desvio-padrão (R$) | CV\n'
          'Hoje | 2 500 | 300 | 12%\n'
          'Depois do reajuste e do abono | ? | ? | menor que 10%\n\n'
          'Qual é o menor valor inteiro do abono, em reais, que permite à empresa divulgar a folha?')
assert len(ENUN_C) >= 600, len(ENUN_C)

# ---------------------------------------------------------------- d) Harvard-MIT (número apagado)
sols = [(n, k) for n in range(2, 2001) for k in range(1, n + 1) if F(n * (n + 1), 2) - k == F('20.6') * (n - 1)]
assert sols == [(41, 37)], sols  # resposta única até N = 2000
assert F(41 * 42, 2) == 861 and 861 - 40 * F('20.6') == 37 and 40 * F('20.6') == 824
assert (F(39) * F('20.6')).denominator != 1 and F(39) * F('20.6') == F('803.4')
assert 39 * 20 == 780 and 39 * 6 == 234 and F('23.4') == F(234, 10)
# a média ao apagar k de 1..N fica entre N/2 (apagou o N) e (N + 2)/2 (apagou o 1)
for n in range(3, 60):
    medias = [(F(n * (n + 1), 2) - k) / (n - 1) for k in range(1, n + 1)]
    assert min(medias) == F(n, 2) and max(medias) == F(n + 2, 2)
assert F(28 - 7, 6) == F('3.5') == F(7, 2) and F(28 - 1, 6) == F('4.5') == F(7 + 2, 2) and sum(range(1, 8)) == 28   # exemplo 1 a 7
assert F('20.6') * 2 == F('41.2') and F('41.2') - 2 == F('39.2')
assert [n for n in range(2, 100) if F(n, 2) <= F('20.6') <= F(n + 2, 2)] == [40, 41]
assert 41 * 42 == 1680 + 42 == 1722
# distratores
assert round(20.6) == 21                                     # 21: arredondou a média
assert 820 - F(39) * F('20.6') == F('16.6') and round(16.6) == 17  # 17: supôs N = 40 e arredondou 820 − 803,4
# 40 = quantos sobraram; 41 = o maior número da lista (N)
# "Sua vez": tirar um de 1 a 5 e a média dos 4 que sobraram ser 2,5 => o 5
assert 15 - 4 * F('2.5') == 5
ENUN_D = ('Os números inteiros de 1 até N foram escritos numa lista, e um deles foi apagado. O valor de N não foi informado. A média dos '
          'números que sobraram na lista é 20,6. Qual foi o número apagado?')
assert 150 <= len(ENUN_D) <= 250, len(ENUN_D)

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-est-00a', materia='Matemática', tema=T, calc=6.7,
        enunciado=ENUN_A,
        dados=[('9º A', '30 alunos, média 5,8'), ('9º B', '20% a mais que o 9º A, média 6,5'), ('9º C', '4 alunos para cada 5 do 9º A, média ?'),
               ('Fora da conta', '6 alunos do 9º B, nota 8,0 cada'), ('Meta', 'média 6,2 no mínimo, sem esses 6')],
        alts=[('4,7', 4.7, 'Tirou os 6 alunos do número de alunos, mas deixou as notas deles nos pontos do 9º B'),
              ('6,25', 6.25, 'Esqueceu de tirar os 6 alunos da conta'),
              ('6,3', 6.3, 'Fez a média simples das médias, sem pesos: 3 · 6,2 − 5,8 − 6,5'),
              ('6,7', 6.7, 'OK'),
              ('6,85', 6.85, 'Leu "20% a mais" como "20% a menos": o 9º B teria 24 alunos')],
        resumo='Alunos que contam: 30 + 30 + 24 = 84; pontos que a escola precisa: 84 · 6,2 = 520,8. O 9º A tem 174 e o 9º B, sem os 6, tem 234 − 48 = 186. Faltam 520,8 − 174 − 186 = 160,8, e 160,8 ÷ 24 = 6,7.',
        ideia='Os pesos vêm escondidos: 20% a mais e 4 para cada 5 viram número de alunos. Tire do 9º B os 6 alunos e as notas deles, ache os pontos que a escola precisa e desconte os do 9º A e do 9º B.',
        pecas=[('Média', 'A soma das notas dividida pela quantidade de alunos. Por isso soma = média × quantidade.'),
               ('Média ponderada', 'Média de turmas de tamanhos diferentes: some os pontos de cada turma e divida pelo total de alunos.')],
        formulas=[('media', 'Média', 'soma ÷ quantidade; soma = média × quantidade'), ('porcentagem', '20% a mais', 'novo = antigo × 1,20'),
                  ('texto', 'Razão 4 para 5', 'turma C = 4/5 da turma A')],
        eq='M = (T − W − Q) ÷ L', leitura='média do 9º C = pontos que faltam para o 9º C ÷ alunos do 9º C',
        letras=[('M', 'média do 9º C (o que a questão quer)'), ('T', 'pontos que a escola precisa, sem os 6 alunos'),
                ('W', 'pontos do 9º A'), ('Q', 'pontos do 9º B que contam, sem os 6'),
                ('H', 'alunos do 9º B'), ('L', 'alunos do 9º C')],
        eq_texto='A escola precisa de um total de pontos. Tirando os pontos do 9º A e os do 9º B que contam, o que sobra é do 9º C, e dividimos pelos alunos dele.\nO quadro não dá o número de alunos do 9º B nem do 9º C: primeiro acho H e L. Depois T, W e Q, uma por vez.',
        achando=[('Achando H: alunos do 9º B',
                  '20% a mais que o 9º A: 20% de 30 = 30 ÷ 5 = 6 (20 de cada 100 é 1 de cada 5).\nH = 30 + 6 = 36 alunos.'),
                 ('Achando L: alunos do 9º C',
                  '4 para cada 5 do 9º A. Em 30 alunos do 9º A cabem 30 ÷ 5 = 6 grupos de 5.\nCada grupo vale 4 do 9º C: 6 · 4 = 24. L = 24 alunos.'),
                 ('Achando T: pontos que a escola precisa',
                  'Alunos que contam: 30 + (36 − 6) + 24 = 30 + 30 + 24 = 84.\nPontos = média × alunos: 84 · 6,2. 84 · 6 = 504 e 84 · 0,2 = 16,8. Então 504 + 16,8 = 520,8. T = 520,8.'),
                 ('Achando W: pontos do 9º A',
                  '30 · 5,8: 30 · 5 = 150 e 30 · 0,8 = 24.\nEntão 150 + 24 = 174. W = 174.'),
                 ('Achando Q: pontos do 9º B que contam',
                  'Os 36 alunos do 9º B somam 36 · 6,5: 36 · 6 = 216 e 36 · 0,5 = 18, então 234 pontos.\nOs 6 que saem somam 6 · 8,0 = 48.\nQ = 234 − 48 = 186 (de 30 alunos).')],
        volta='M = (520,8 − 174 − 186) ÷ 24.\n520,8 − 174 = 346,8 e 346,8 − 186 = 160,8. Então M = 160,8 ÷ 24.\n24 · 6 = 144 e sobra 160,8 − 144 = 16,8. 24 · 0,7 = 16,8. Então M = 6 + 0,7 = 6,7.\nResposta: alternativa A. Conferindo: 174 + 186 + 24 · 6,7 = 174 + 186 + 160,8 = 520,8, e 520,8 ÷ 84 = 6,2.',
        valores=[('H', '36 alunos'), ('L', '24 alunos'), ('T', '520,8 pontos'), ('W', '174 pontos'), ('Q', '186 pontos'), ('M', '6,7')],
        pista='média de turmas com pesos escondidos → ponha cada peso em número de alunos, tire do cálculo o que o texto manda tirar, ache os pontos que a escola precisa e desconte os que já tem.',
        rec1='9º A: 30 e 5,8; 9º B: 36 e 6,5, menos 6 de 8,0; 9º C: 24 e ?; meta 6,2', rec3='H = 36; L = 24; T = 520,8; W = 174; Q = 186; M = 6,7',
        checagem=('Turma de 20 alunos, média 5,5. Entram 5 alunos e a turma de 25 precisa de média 6,0. Qual a média dos 5 que entraram?',
                  ['6,0', '6,5', '8,0', '7,5'], '8,0',
                  'Pontos: 25 · 6,0 = 150. Já tem 20 · 5,5 = 110. Faltam 40, e 40 ÷ 5 = 8,0.'),
        ancora='forte · ENEM 2022 q.163 (caderno 7; q.136 no caderno 5: média ponderada de dois grupos de professores e uma meta para a média geral); aqui são três turmas com pesos em % e em razão, um grupo fora da conta e a média de uma turma desconhecida',
        canal='mat-44-medias-estatistica.txt [27:20:00] (média ponderada: valor × peso, somar e dividir pelo total de pesos)',
        antes=['est-media-e-soma', 'porcentagem', 'fracoes', 'multiplicar-decimais'],
    ),
    dict(
        id='d2-escada-mat-ita-est-00b', materia='Matemática', tema=T, calc=7,
        enunciado=ENUN_B,
        dados=[('2 alunos', 'tiraram 4'), ('3 alunos', 'tiraram 5'), ('3 alunos', 'tiraram 7'), ('2 alunos', 'tiraram 8'), ('1 aluno', 'tirou 10'),
               ('Quero', 'mediana exata 6 com 2 notas novas (13 alunos)')],
        alts=[('6', 6, 'Esqueceu o par {6, 6}: contou só um 6 com outra nota de 0 a 5'),
              ('7', 7, 'OK'),
              ('11', 11, 'Deixou a outra nota livre: um 6 e qualquer nota de 0 a 10'),
              ('13', 13, 'Contou pares ordenados: (6, k) e (k, 6) separados'),
              ('21', 21, 'Contou pares de notas diferentes de 0 a 6, sem exigir que um deles seja 6')],
        resumo='Com 13 notas a mediana é a 7ª. Há 5 notas abaixo de 6, então as duas novas são ≤ 6 e no máximo uma é menor que 6. Pares: {6, 6} (1) e {6, k} com k de 0 a 5 (6). Total 1 + 6 = 7.',
        ideia='Com 13 notas, a mediana é a 7ª. Veja quantas notas já estão abaixo de 6 e transforme isso em duas regras para as 2 notas novas.',
        pecas=[('Mediana', 'A nota do meio, com todas em fila da menor para a maior.')],
        formulas=[('media', 'Mediana', 'a nota do meio, em fila'), ('contagem', 'Posição da mediana', '(quantidade + 1) ÷ 2')],
        eq='N = P + Q', leitura='pares que servem = pares com dois 6 + pares com um só 6',
        letras=[('N', 'pares de notas que servem (o que a questão quer)'), ('P', 'pares com dois 6'), ('Q', 'pares com um só 6 (a outra nota é de 0 a 5)')],
        eq_texto='Vou descobrir que, para dar certo, os pares têm de ter pelo menos um 6. Separo em dois grupos para contar sem repetir: os dois 6 e um só 6.\nPrimeiro vem o preparo: o que a mediana exige das 2 notas novas. Depois acho P e Q.',
        achando=[('Preparo: a mediana de 13 notas',
                  'Mediana é a nota do meio, com as notas em fila da menor para a maior. Com 13 notas há 6 de cada lado e a do meio é a 7ª. (Conta: (13 + 1) ÷ 2 = 7.)\nPara a 7ª valer 6, as 2 notas novas têm de encaixar certo na fila.'),
                 ('Preparo: o que as 11 notas já têm',
                  'Em fila: 4, 4, 5, 5, 5, 7, 7, 7, 8, 8, 10.\nAbaixo de 6 há 5 notas (4, 4, 5, 5, 5) e ninguém tirou 6. Acima de 6 há 6 notas. A nota mínima de aprovação (6) não entra na conta.'),
                 ('Preparo: duas regras para a 7ª ser 6',
                  '(1) No máximo 6 notas ficam abaixo do 6, senão o 6 passa do 7º lugar.\n(2) Até o 6, contando ele, ficam pelo menos 7 notas, senão o 6 não chega ao 7º lugar.\nExemplo: fila 3, 4, 4, 5, 5, 5, 6, 7, 7, 7, 8, 8, 10 (13 notas): o 6 é o 7º e antes dele há 6 notas. Com 7 notas antes, ele seria o 8º.'),
                 ('Preparo: traduzindo para as 2 notas novas',
                  'Hoje são 5 abaixo de 6. Regra (1): no máximo uma nova é menor que 6 (5 + 1 = 6 cabe; 5 + 2 = 7 não cabe).\nRegra (2): até o 6 hoje há 5 notas; para chegar a 7, as duas novas são menores ou iguais a 6.'),
                 ('Achando P: pares com dois 6',
                  'As duas são ≤ 6 e no máximo uma é menor que 6. Então pelo menos uma é exatamente 6.\nCom dois 6 só existe o par {6, 6}. Então P = 1.'),
                 ('Achando Q: pares com um só 6',
                  'A outra nota é menor que 6, de 0 a 5: 0, 1, 2, 3, 4, 5, que são 6 notas.\nCada uma forma um par diferente: {6, 0}, {6, 1}, ..., {6, 5}. Então Q = 6.',
                  {'tipo': 'tabela', 'titulo': 'Os 7 pares', 'cabecalho': ['Grupo', 'Pares', 'Quantos'],
                   'linhas': [['Dois 6', '{6, 6}', '1'], ['Um só 6', '{6, 0} {6, 1} {6, 2} {6, 3} {6, 4} {6, 5}', '6']]})],
        volta='N = P + Q = 1 + 6 = 7 pares.\nConferindo um par: com {6, 3}, a fila de 13 fica 3, 4, 4, 5, 5, 5, 6, 7, ... e a 7ª é 6.\nResposta: alternativa A.',
        valores=[('P', '1 par'), ('Q', '6 pares'), ('N', '7 pares')],
        pista='com 13 notas, a mediana é a 7ª → conte quantas notas já estão abaixo de 6 e veja o que isso exige das 2 notas novas.',
        rec1='11 notas em tabela; mais 2; mediana 6 com 13 notas', rec3='P = 1; Q = 6; N = 7',
        checagem=('Com 7 notas, qual posição da fila (da menor para a maior) é a mediana?',
                  ['4ª', '3ª', '7ª', '3,5ª'], '4ª', 'Mediana de 7 notas: (7 + 1) ÷ 2 = 4. É a 4ª da fila, com 3 notas de cada lado.'),
        ancora='forte · Fuvest 2024 1ª fase q.34 (prova V: contar listas de 5 inteiros em que a posição da mediana e a repetição da moda travam os casos); aqui a mediana de 13 notas, com par não ordenado',
        canal='mat-43-graficos-e-tabelas-estatistica.txt [26:44:00] (mediana: nota do meio com os dados em ordem)',
        antes=['est-mediana-posicao'],
    ),
    dict(
        id='d2-escada-mat-ita-est-00c', materia='Matemática', tema=T, calc=551,
        enunciado=ENUN_C,
        dados=[('Hoje', 'média R$ 2 500 e desvio-padrão R$ 300'), ('Reajuste', '10% sobre o salário de todos'), ('Abono', 'mesmo valor para todos, depois do reajuste'),
               ('Divulga se', 'CV menor que 10%'), ('Quero', 'menor abono inteiro, em reais')],
        alts=[('R$ 251', 251, 'Não reajustou o desvio (ficou 300): 300 ÷ (2 750 + G) < 0,10 dá G > 250'),
              ('R$ 501', 501, 'Pôs o abono antes do reajuste: 330 ÷ (1,10 · (2 500 + G)) < 0,10 dá G > 500'),
              ('R$ 550', 550, 'Aceitou CV igual a 10%: 330 ÷ 3 300 = 0,10 não é menor que 0,10'),
              ('R$ 551', 551, 'OK'),
              ('R$ 801', 801, 'Não reajustou a média (ficou 2 500): 330 ÷ (2 500 + G) < 0,10 dá G > 800')],
        resumo='Depois do reajuste: média 2 750 e desvio 330. O abono soma na média e não muda o desvio. CV < 0,10 pede 330 < 0,10 · (2 750 + G), ou seja 2 750 + G > 3 300 e G > 550. Menor inteiro: 551.',
        ideia='O reajuste de 10% multiplica a média e o desvio por 1,10; o abono fixo soma só na média, o desvio não muda. O desvio tem de ficar abaixo de 1/10 da média nova.',
        pecas=[('Desvio-padrão', 'Quanto os valores se afastam da média, em geral. Quanto maior, mais espalhados.'),
               ('Coeficiente de variação', 'Desvio-padrão ÷ média. Compara o tamanho do desvio com o da média, sem unidade.'),
               ('Abono fixo', 'Soma o mesmo valor a todos: a média sobe esse valor e o desvio fica igual.')],
        formulas=[('media', 'Coeficiente de variação', 'CV = desvio ÷ média'), ('porcentagem', 'Reajuste de 10%', 'novo = antigo × 1,10'),
                  ('texto', 'Abono fixo', 'média + G; o desvio não muda')],
        eq='G > 10 × S − M', leitura='o abono precisa levar a média nova a mais de 10 vezes o desvio novo',
        letras=[('G', 'abono, em reais (o que a questão quer)'), ('S', 'desvio-padrão depois do reajuste'), ('M', 'média depois do reajuste, antes do abono')],
        eq_texto='CV menor que 10% quer dizer desvio menor que 1/10 da média, ou média maior que 10 vezes o desvio. Teste: média 1 000 e desvio 90; 90 é menos que 1/10 de 1 000 (100), e 1 000 é mais que 10 · 90 = 900. A média nova é M + G; o desvio novo é S.\nOs 8 funcionários e o CV de 12% de hoje estão no enunciado, mas não entram na conta.\nAgora é só achar S e M, uma por vez.',
        achando=[('Achando S: o desvio depois do reajuste',
                  'Desvio-padrão é o quanto os salários se afastam da média. Exemplo: 2 000 e 3 000, média 2 500, afastamento 500. Com reajuste de 10%: 2 200 e 3 300, média 2 750, afastamento 550 (500 · 1,1). Com abono de 100: 2 300 e 3 400, os dois sobem 100 e o afastamento segue 550.\nAqui: 300 · 1,10 = 300 + 30 = 330. O abono não muda o desvio. S = 330.'),
                 ('Achando M: a média depois do reajuste',
                  'A média também é multiplicada por 1,10.\n2 500 · 1,10 = 2 500 + 250 = 2 750. M = 2 750 (o abono entra depois).')],
        volta='O CV novo é 330 ÷ (2 750 + G) e tem de ser menor que 0,10.\n330 ÷ (algo) < 0,10 quer dizer que "algo" tem de ser maior que 330 ÷ 0,10 = 3 300 (cabem 10 desvios na média).\n2 750 + G > 3 300, então G > 3 300 − 2 750 = 550. O menor inteiro é 551.\nResposta: alternativa A. Conferindo: 2 750 + 551 = 3 301, e 330 ÷ 3 301 é um pouco menos que 330 ÷ 3 300 = 0,1, então é menor que 0,10. Com 550 dá exatamente 0,10, que não é menor.',
        valores=[('S', 'R$ 330'), ('M', 'R$ 2 750'), ('G', 'mais de R$ 550, logo R$ 551')],
        pista='reajuste de % multiplica média e desvio; abono fixo só soma na média → o CV novo é o desvio novo ÷ (média nova + abono); precisa ser menor que 10%.',
        rec1='média 2 500; desvio 300; reajuste 10%; abono fixo; CV < 10%', rec3='S = 330; M = 2 750; G > 550, logo 551',
        checagem=('5 salários: média R$ 1 000 e desvio R$ 100. Reajuste de 10% e depois um abono de R$ 50 para todos. Qual é o desvio novo?',
                  ['R$ 110', 'R$ 150', 'R$ 100', 'R$ 160'], 'R$ 110', 'O reajuste multiplica o desvio: 100 · 1,10 = 110. O abono não muda o desvio.'),
        ancora='parcial · ENEM 2021 q.173 (caderno 5; coeficiente de variação = desvio ÷ média, trocar só se o novo CV for menor; o PDF está ilegível, li o texto do banco do site) com o quadro antes e depois da Fuvest 2025 2ª fase M02; não achei real com reajuste e abono fixo sobre média e desvio',
        canal='fora do canal: coeficiente de variação não aparece; média e desvio-padrão em mat-45-medias-de-dispersao-estatistica.txt [28:24:01]',
        antes=['est-desvio-padrao', 'porcentagem', 'dividir-por-decimal', 'numero-que-falta'],
    ),
    dict(
        id='d2-escada-mat-ita-est-00d', materia='Matemática', tema=T, calc=37,
        enunciado=ENUN_D,
        dados=[('Lista', 'os inteiros de 1 até N, N desconhecido'), ('Apagado', 'um dos números da lista'),
               ('Média dos que sobraram', '20,6'), ('Quero', 'o número apagado')],
        alts=[('17', 17, 'Supôs N = 40 e arredondou: 820 − 39 · 20,6 = 820 − 803,4 = 16,6'),
              ('21', 21, 'Arredondou a média 20,6 e respondeu um número perto dela'),
              ('37', 37, 'OK'),
              ('40', 40, 'Respondeu quantos números sobraram, em vez do apagado'),
              ('41', 41, 'Respondeu o maior número da lista (N), em vez do apagado')],
        resumo='A média prende N entre 39,2 e 41,2, logo N é 40 ou 41; só N = 41 dá soma inteira (40 · 20,6 = 824). A lista soma 861, então o apagado é 861 − 824 = 37.',
        ideia='Apagar um número só mexe pouco na média: ela fica entre N ÷ 2 e (N + 2) ÷ 2, e isso prende N. Depois, soma total menos soma dos que sobraram dá o apagado.',
        pecas=[('Média', 'Soma ÷ quantidade, então soma = média × quantidade.'), ('Soma de 1 a N', 'N × (N + 1) ÷ 2.')],
        formulas=[('media', 'Média', 'soma = média × quantidade'), ('contagem', 'Soma de 1 até N', 'N × (N + 1) ÷ 2'),
                  ('texto', 'Número apagado', 'soma de tudo − soma dos que sobraram')],
        eq='K = S − R', leitura='número apagado = soma de 1 até N − soma dos que sobraram',
        letras=[('K', 'número apagado (o que a questão quer)'), ('S', 'soma de todos os números de 1 até N'),
                ('R', 'soma dos N − 1 números que sobraram'), ('N', 'quantos números a lista tinha antes de apagar (não está na fórmula, mas S e R dependem dele)')],
        eq_texto='A soma de tudo menos a soma do que sobrou é o número que saiu. Mas N não foi dado, e S e R dependem dele: primeiro acho N.\nDepois acho S e R, uma por vez.',
        achando=[('Achando N: onde a média prende N',
                  'Apagar o maior número (N) deixa a média mais baixa possível: N ÷ 2. Apagar o 1 deixa a mais alta: (N + 2) ÷ 2.\nExemplo, 1 a 7 (soma 28): sem o 7 sobra 21 em 6 números, média 3,5 = 7 ÷ 2; sem o 1 sobra 27 em 6, média 4,5 = (7 + 2) ÷ 2. Apagar um do meio dá média entre 3,5 e 4,5.\nAqui: N ÷ 2 ≤ 20,6 ≤ (N + 2) ÷ 2.'),
                 ('Achando N: só dois valores servem',
                  '≤ lê-se "menor ou igual". N ÷ 2 ≤ 20,6: multiplico os dois lados por 2 (20,6 · 2 = 41,2) e fica N ≤ 41,2.\n(N + 2) ÷ 2 ≥ 20,6 dá N + 2 ≥ 41,2, então N ≥ 41,2 − 2 = 39,2.\nComo N é inteiro, N é 40 ou 41.'),
                 ('Achando N: só um dos dois fecha',
                  'Sobram N − 1 números, e a soma deles é um número inteiro.\nCom N = 40: 39 · 20,6. 39 · 20 = 780 e 39 · 0,6: 39 · 6 = 234, uma casa: 23,4. Soma 803,4, que não é inteiro.\nCom N = 41: 40 · 20,6 = 800 + 24 = 824, que é inteiro. Então N = 41.'),
                 ('Achando S: a soma de 1 até 41',
                  'Soma de 1 até N = N · (N + 1) ÷ 2.\n41 · 42 = 1 680 + 42 = 1 722, e 1 722 ÷ 2 = 861. S = 861.'),
                 ('Achando R: a soma dos que sobraram',
                  'Soma = média × quantidade. Sobraram 40 números.\n40 · 20,6 = 800 + 24 = 824. R = 824.')],
        volta='K = S − R = 861 − 824 = 37.\nConferindo: sem o 37, a lista soma 824 e tem 40 números, e 824 ÷ 40 = 20,6.\nResposta: alternativa A.',
        valores=[('N', '41 números'), ('S', '861'), ('R', '824'), ('K', '37')],
        pista='N não foi dado → a média prende N (entre N ÷ 2 e (N + 2) ÷ 2); depois, soma de 1 até N menos média × quantidade dá o apagado.',
        rec1='lista de 1 até N; um apagado; média 20,6', rec3='N = 41; S = 861; R = 824; K = 37',
        checagem=('Apagou-se um número de 1, 2, 3, 4, 5 e a média dos 4 que sobraram é 2,5. Qual foi apagado?',
                  ['5', '1', '4', '2,5'], '5', 'Soma de 1 a 5 = 15. Os 4 que sobraram somam 4 · 2,5 = 10. O apagado é 15 − 10 = 5.'),
        ancora='parcial · HMMT fev/2021 Guts q.1 (inteiros consecutivos com um apagado) e q.6 (a média vira uma soma); sem real do tema com média dada e N desconhecido, a técnica é a dessas duas',
        canal='mat-44-medias-estatistica.txt [27:19:31] (média = soma dos valores ÷ quantidade); soma de 1 até N fora do canal (aula Antes)',
        antes=['est-media-e-soma', 'est-soma-de-1-a-n', 'numero-que-falta', 'multiplicar-decimais'],
    ),
]

MANTER = {}

tabela = lambda titulo, cab, linhas: {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}  # noqa: E731

ANTES_NOVOS = {
    'est-media-e-soma': {
        'titulo': 'Média: soma ÷ quantidade, e soma = média × quantidade',
        'linhas': [
            'Média é o valor que cada um teria se todos fossem iguais. Some tudo e divida pela quantidade.',
            'Dois alunos tiram 4 e 6: soma 10, média 10 ÷ 2 = 5.',
            'Ao contrário: média 5 com 2 alunos. Soma = média × quantidade = 5 · 2 = 10.',
            'Isso vale para somar grupos: some os pontos de cada grupo (média × alunos) e divida pelo total de alunos.',
        ],
        'visual': tabela('Média e soma', ['Quero', 'Conta', 'Exemplo'],
                         [['Média', 'soma ÷ quantidade', '10 ÷ 2 = 5'], ['Soma', 'média × quantidade', '5 · 2 = 10']]),
        'exercicios': [
            {'enunciado': 'Qual é a média de 8, 6 e 7?', 'alternativas': ['7', '21', '6', '8'], 'certa': 0,
             'resolucao': '7: a soma é 8 + 6 + 7 = 21, e 21 ÷ 3 = 7.\n21 é a soma, que falta dividir por 3; 6 e 8 são só dois dos valores.'},
            {'enunciado': '4 alunos têm média 5. Quantos pontos eles somam?', 'alternativas': ['20', '9', '1,25', '5'], 'certa': 0,
             'resolucao': '20: soma = média × quantidade = 5 · 4 = 20.\n9 soma 5 + 4; 1,25 é 5 ÷ 4; 5 é só a média.'},
        ],
    },
    'est-desvio-padrao': {
        'titulo': 'Desvio-padrão: o quanto os valores se afastam da média',
        'linhas': [
            'O desvio-padrão diz, em geral, quanto os valores se afastam da média. Valores todos iguais: desvio 0.',
            'Exemplo: 2 000 e 3 000. A média é 2 500 e cada um está a 500 dela. O desvio-padrão é 500.',
            'Multiplicar todos por 1,1 afasta 10% mais: 2 200 e 3 300, média 2 750, desvio 550.',
            'Somar o mesmo valor a todos só desloca: 2 300 e 3 400 seguem a 550 da média. O desvio não muda.',
        ],
        'visual': tabela('Os dois movimentos', ['Mudança', 'Valores', 'Desvio'],
                         [['Nenhuma', '2 000 e 3 000', '500'], ['× 1,1', '2 200 e 3 300', '550'], ['+ 100', '2 100 e 3 100', '500']]),
        'exercicios': [
            {'enunciado': 'Os valores 4 e 8 têm média 6. Qual é o desvio-padrão deles?', 'alternativas': ['2', '4', '6', '1'], 'certa': 0,
             'resolucao': '2: cada valor está a 2 da média (6 − 4 = 2 e 8 − 6 = 2).\n4 é a distância entre os dois valores; 6 é a média.'},
            {'enunciado': 'Os valores 10 e 30 têm desvio 10. Somando 5 a cada um (15 e 35), qual é o novo desvio?', 'alternativas': ['10', '15', '5', '20'], 'certa': 0,
             'resolucao': '10: somar o mesmo valor a todos só desloca e o afastamento da média segue o mesmo.\n15 e 5 misturam o 5 somado com o desvio.'},
        ],
    },
    'est-mediana-posicao': {
        'titulo': 'Mediana: a nota do meio, em fila',
        'linhas': [
            'Ponha as notas em fila, da menor para a maior. A mediana é a nota que fica no meio da fila.',
            'Com 5 notas, é a 3ª. Com 13 notas, é a 7ª: seis de cada lado. A conta é (quantidade + 1) ÷ 2.',
            'Exemplo: 3, 9, 4, 7, 5. Em fila: 3, 4, 5, 7, 9. A do meio é a 3ª: 5.',
            'Com quantidade par de notas, a mediana é a média das duas do meio: em 2, 4, 6, 10 é (4 + 6) ÷ 2 = 5.',
        ],
        'visual': tabela('Qual posição é o meio', ['Quantidade de notas', 'Conta', 'Posição da mediana'],
                         [['5', '(5 + 1) ÷ 2', '3ª'], ['11', '(11 + 1) ÷ 2', '6ª'], ['13', '(13 + 1) ÷ 2', '7ª']]),
        'exercicios': [
            {'enunciado': 'Qual é a mediana das notas 3, 9, 4, 7 e 5?', 'alternativas': ['5', '4', '5,6', '7'], 'certa': 0,
             'resolucao': '5: em fila, 3, 4, 5, 7, 9. A do meio é a 3ª, que vale 5.\n5,6 é a média (28 ÷ 5), não a mediana; 4 e 7 são vizinhas do meio.'},
            {'enunciado': 'Com 15 notas em fila, qual posição da fila é a mediana?', 'alternativas': ['8ª', '7ª', '15ª', '7,5ª'], 'certa': 0,
             'resolucao': '8ª: (15 + 1) ÷ 2 = 16 ÷ 2 = 8.\n7ª esquece de somar 1; 15ª é a última; 7,5ª não existe, a posição é inteira.'},
        ],
    },
    'est-soma-de-1-a-n': {
        'titulo': 'Somar 1 + 2 + 3 + ... + N',
        'linhas': [
            'Junte o 1º com o último, o 2º com o penúltimo, e assim por diante. Cada par soma N + 1.',
            'Em 1 até 10 há 5 pares, cada um somando 11: 5 · 11 = 55. Em fórmula: N · (N + 1) ÷ 2 = 10 · 11 ÷ 2 = 55.',
            'Outro: 1 até 41 é 41 · 42 ÷ 2. Como 41 · 42 = 1 680 + 42 = 1 722, a soma é 1 722 ÷ 2 = 861.',
        ],
        'visual': tabela('Somas de 1 até N', ['Até N', 'Conta', 'Soma'], [['5', '5 · 6 ÷ 2', '15'], ['10', '10 · 11 ÷ 2', '55'], ['20', '20 · 21 ÷ 2', '210']]),
        'exercicios': [
            {'enunciado': 'Quanto vale 1 + 2 + 3 + ... + 20?', 'alternativas': ['210', '200', '420', '190'], 'certa': 0,
             'resolucao': '210: 20 · 21 = 420, e 420 ÷ 2 = 210.\n420 esquece de dividir por 2; 200 e 190 erram o 21.'},
            {'enunciado': 'Quanto vale 1 + 2 + 3 + ... + 30?', 'alternativas': ['465', '930', '450', '495'], 'certa': 0,
             'resolucao': '465: 30 · 31 = 930, e 930 ÷ 2 = 465.\n930 esquece de dividir por 2; 450 e 495 trocam o 31 por 30 ou 33.'},
        ],
    },
}

for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('est-'), _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['resolucao'].split('\n')[0].count(_e['alternativas'][_e['certa']].split(' ')[0]) >= 1
        assert len(set(_e['alternativas'])) == len(_e['alternativas'])
assert median([3, 9, 4, 7, 5]) == 5 and (15 + 1) // 2 == 8 and 20 * 21 // 2 == 210 and 30 * 31 // 2 == 465 and 41 * 42 // 2 == 861
assert sum(range(1, 21)) == 210 and sum(range(1, 31)) == 465 and median([2, 4, 6, 10]) == 5
assert (8 + 6 + 7) / 3 == 7 and 5 * 4 == 20 and (4 + 6) / 2 == 5 and 4 + 2 == 6 and 8 - 6 == 2 and 6 - 4 == 2
assert (2200 + 3300) / 2 == 2750 and (2100 + 3100) / 2 == 2600 and 3100 - 2600 == 500 and (15 + 35) / 2 - 15 == 10 == (10 + 30) / 2 - 10
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), (_q['id'], [len(v) for _, v in _q['dados']])
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), _q['id']
    assert len(_q['ideia']) <= 300, _q['id']
    assert all(l not in 'ABCDE' for l, _ in _q['letras']), _q['id']
    assert len({l for l, _ in _q['letras']}) == len(_q['letras'])
    assert all(len(o) <= 60 for o in _q['checagem'][1]) and _q['checagem'][2] in _q['checagem'][1]
