"""Estatística (3º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (média ponderada de turmas, agora com quadro), b = ITA (mediana de 13 notas, agora com tabela de frequências),
c = Fuvest (coeficiente de variação depois de reajuste de 10% e abono fixo; menor abono inteiro), d = Harvard-MIT (número apagado
da lista de 1 a n, média 20,6). Só junta o degrau 1 (Aritmética e Porcentagem) e o 2 (Grandezas e Medidas).
Toda resposta é conferida por conta Python (assert) neste módulo.
"""
from fractions import Fraction as F
from itertools import combinations_with_replacement
from statistics import median

ARQUIVO = 'matematica-acima-novas.json'
T = 'Estatística'

# ---------------------------------------------------------------- a) ENEM (quadro no enunciado, mesma técnica e mesmos números)
n_a, m_a = 30, F('5.8')
n_x, m_x = 5, F('7.0')
n_y = 5
meta_a, n_tot = F('6.0'), n_a + n_x + n_y
assert n_tot == 40
P_a = n_tot * meta_a
O_a = n_a * m_a
X_a = n_x * m_x
assert (P_a, O_a, X_a) == (240, 174, 35)
M_a = (P_a - O_a - X_a) / n_y
assert M_a == F('6.2')
assert (n_a * m_a + n_x * m_x + n_y * M_a) / n_tot == meta_a  # confere: a turma fecha em 6,0
# distratores
assert 2 * meta_a - m_x == 5                                    # 5,0: ignorou os 30 alunos
assert (P_a - O_a) / 10 == F('6.6')                             # 6,6: média dos 10 transferidos juntos (66 ÷ 10)
assert m_a == F('5.8') and meta_a == 6                          # 5,8 e 6,0: repetiu um dado
# "Sua vez": 20 alunos, média 5,5; entram 5; turma de 25 com média 6,0
assert (25 * F(6) - 20 * F('5.5')) / 5 == 8
ENUN_A = ('Numa escola pública, a coordenação acompanha a média de Matemática de cada turma. No fim do bimestre, o 8º A, com 30 alunos, teve média 5,8 '
          'na prova. No começo do bimestre seguinte, a direção recebeu 10 alunos transferidos de duas outras escolas, 5 vindos da escola X e 5 vindos da '
          'escola Y, e juntou todos numa única turma de 40 alunos. As notas que os transferidos já tinham foram aproveitadas, e o quadro mostra o que se '
          'sabe. Pelo regimento, a turma só é considerada aprovada no bimestre se a média dos 40 alunos for 6,0 ou mais, e as notas do 8º A não podem '
          'ser alteradas. A coordenadora quer saber qual precisa ser, no mínimo, a média dos 5 alunos vindos da escola Y para a turma chegar a 6,0.\n\n'
          'Grupo | Alunos | Média na prova\n'
          '8º A | 30 | 5,8\n'
          'Escola X | 5 | 7,0\n'
          'Escola Y | 5 | ?\n'
          'Turma final | 40 | 6,0 (mínimo)\n\n'
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
    """Menor inteiro R com desvio ÷ (media + R) < 0,10 (ou <= 0,10 se estrito=False)."""
    r = 0
    while True:
        cv = desvio_apos / (media_apos + r)
        if (cv < F(1, 10)) if estrito else (cv <= F(1, 10)):
            return r
        r += 1


R_c = menor_abono(med1, dp1)
assert R_c == 551
assert F(330) / (2750 + 551) < F(1, 10) and F(330) / (2750 + 550) == F(1, 10)  # 551 serve; 550 dá exatamente 10%
assert float(F(330) / 3301) < 0.1 and round(float(F(330) / 3301) * 100, 3) == 9.997
assert 10 * dp1 - med1 == 550                                                   # R > 10 · 330 − 2 750
# distratores
assert menor_abono(med1, dp0) == 251                                            # não reajustou o desvio
R_antes = 0
while F(330) / (F('1.1') * (2500 + R_antes)) >= F(1, 10):                       # abono ANTES do reajuste (e reajustado junto)
    R_antes += 1
assert R_antes == 501
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
assert sols == [(41, 37)], sols  # resposta única até n = 2000
assert F(41 * 42, 2) == 861 and 861 - 40 * F('20.6') == 37 and 40 * F('20.6') == 824
assert (F(39) * F('20.6')).denominator != 1 and F(39) * F('20.6') == F('803.4')
# a média ao apagar k de 1..n fica entre n/2 (apagou o n) e (n + 2)/2 (apagou o 1)
for n in range(3, 60):
    medias = [(F(n * (n + 1), 2) - k) / (n - 1) for k in range(1, n + 1)]
    assert min(medias) == F(n, 2) and max(medias) == F(n + 2, 2)
assert F(5, 2) == F(15 - 5, 4) and F(7, 2) == F(15 - 1, 4)  # a conferência 1 a 5
assert [n for n in range(2, 100) if F(n, 2) <= F('20.6') <= F(n + 2, 2)] == [40, 41]
# distratores
assert round(20.6) == 21                                     # 21: arredondou a média
assert 820 - F(39) * F('20.6') == F('16.6') and round(16.6) == 17  # 17: supôs n = 40 e arredondou 820 − 803,4
# 40 = quantos sobraram; 41 = o maior número da lista (n)
# "Sua vez": tirar um de 1 a 5 e a média dos 4 que sobraram ser 2,5 => o 5
assert 15 - 4 * F('2.5') == 5
ENUN_D = ('Os números inteiros de 1 até n foram escritos numa lista, e um deles foi apagado. O valor de n não foi informado. A média dos '
          'números que sobraram na lista é 20,6. Qual foi o número apagado?')
assert 150 <= len(ENUN_D) <= 250, len(ENUN_D)

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-est-00a', materia='Matemática', tema=T, calc=6.2,
        enunciado=ENUN_A,
        dados=[('8º A original', '30 alunos, média 5,8'), ('Escola X', '5 alunos, média 7,0'), ('Escola Y', '5 alunos, média ?'),
               ('Turma final', '40 alunos, média 6,0 (mínimo)')],
        alts=[('5,0', 5.0, 'Fez 2 · 6,0 − 7,0 e ignorou os 30 alunos'),
              ('5,8', 5.8, 'Repetiu a média da turma antiga'),
              ('6,0', 6.0, 'Repetiu a meta da turma'),
              ('6,2', 6.2, 'OK'),
              ('6,6', 6.6, 'Parou na média dos 10 transferidos juntos: 66 ÷ 10')],
        resumo='Pontos que a turma de 40 precisa: 40 · 6,0 = 240. Já tem 30 · 5,8 = 174 e a escola X dá 5 · 7,0 = 35. Faltam 240 − 174 − 35 = 31, e 31 ÷ 5 = 6,2.',
        ideia='Ache quantos pontos a turma precisa ter no total e tire o que já tem. O que sobra é da escola Y: divida pelos 5 alunos dela.',
        pecas=[('Média', 'A soma das notas dividida pela quantidade de alunos. Por isso soma = média × quantidade.')],
        formulas=[('media', 'Média', 'soma ÷ quantidade; soma = média × quantidade')],
        eq='M = (P − O − X) ÷ 5', leitura='pontos que faltam para a escola Y ÷ 5 alunos',
        letras=[('M', 'média da escola Y (o que a questão quer)'), ('P', 'pontos que a turma de 40 precisa ter'),
                ('O', 'pontos da turma original, o 8º A'), ('X', 'pontos da escola X')],
        eq_texto='A turma precisa de um total de pontos. Tirando os pontos do 8º A e da escola X, o que sobra é da escola Y, e dividimos pelos 5 alunos.\nAgora é só achar P, O e X, uma por vez.',
        achando=[('Achando P: pontos que a turma precisa',
                  'Média × número de alunos = pontos no total.\n40 alunos · 6,0 = 240 pontos. P = 240.'),
                 ('Achando O: pontos da turma original',
                  '30 · 5,8: 30 · 5 = 150 e 30 · 0,8 = 24. Então 150 + 24 = 174 pontos. O = 174.'),
                 ('Achando X: pontos da escola X',
                  '5 alunos · 7,0 = 35 pontos. X = 35.')],
        volta='M = (240 − 174 − 35) ÷ 5.\n240 − 174 = 66 e 66 − 35 = 31, então M = 31 ÷ 5.\n5 · 6 = 30, sobra 1, e 1 ÷ 5 = 0,2. Então M = 6,2.\nResposta: alternativa X. Conferindo: 174 + 35 + 5 · 6,2 = 174 + 35 + 31 = 240, e 240 ÷ 40 = 6,0.',
        valores=[('P', '240 pontos'), ('O', '174 pontos'), ('X', '35 pontos'), ('M', '6,2')],
        pista='média de grupos com um grupo desconhecido → ache o total de pontos que a turma precisa e tire os pontos dos grupos que você já conhece.',
        rec1='8º A: 30 e 5,8; escola X: 5 e 7,0; escola Y: 5 e ?; turma: 40 e 6,0', rec3='P = 240; O = 174; X = 35; M = 6,2',
        checagem=('Turma de 20 alunos, média 5,5. Entram 5 alunos e a turma de 25 precisa de média 6,0. Qual a média dos 5 que entraram?',
                  ['6,0', '6,5', '8,0', '7,5'], '8,0',
                  'Pontos: 25 · 6,0 = 150. Já tem 20 · 5,5 = 110. Faltam 40, e 40 ÷ 5 = 8,0.'),
        ancora='forte · ENEM 2022 q.163 (caderno 7; q.136 no caderno 5: média ponderada de dois grupos de professores e uma meta para a média geral); aqui são três grupos de alunos, um deles com média desconhecida, em quadro',
        canal='mat-44-medias-estatistica.txt [27:20:00] (média ponderada: valor × peso, somar e dividir pelo total de pesos)',
        antes=['multiplicar-decimais', 'numero-que-falta'],
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
        eq_texto='Os pares que servem têm pelo menos um 6. Separei em dois grupos para contar sem repetir: os dois 6 e um só 6.\nAntes de achar P e Q, vejo o que a mediana exige das 2 notas novas.',
        achando=[('Achando P: a mediana de 13 notas',
                  'Mediana é a nota do meio, com as notas em fila da menor para a maior. Com 13 notas há 6 de cada lado e a do meio é a 7ª. (Conta: (13 + 1) ÷ 2 = 7.)\nPara a 7ª valer 6, as 2 notas novas têm de encaixar certo na fila.'),
                 ('Achando P: o que as 11 notas já têm',
                  'Em fila: 4, 4, 5, 5, 5, 7, 7, 7, 8, 8, 10.\nAbaixo de 6 há 5 notas (4, 4, 5, 5, 5) e ninguém tirou 6. Acima de 6 há 6 notas. A nota mínima de aprovação (6) não entra na conta.'),
                 ('Achando P: duas regras para a 7ª ser 6',
                  '(1) No máximo 6 notas ficam abaixo do 6, senão o 6 passa do 7º lugar.\n(2) Até o 6, contando ele, ficam pelo menos 7 notas, senão o 6 não chega ao 7º lugar.'),
                 ('Achando P: traduzindo para as 2 notas novas',
                  'Hoje são 5 abaixo de 6. Regra (1): no máximo uma nova é menor que 6 (5 + 1 = 6 cabe; 5 + 2 = 7 não cabe).\nRegra (2): até o 6 hoje há 5 notas; para chegar a 7, as duas novas são menores ou iguais a 6.'),
                 ('Achando P: pares com dois 6',
                  'As duas são ≤ 6 e no máximo uma é menor que 6. Então pelo menos uma é exatamente 6.\nCom dois 6 só existe o par {6, 6}. Então P = 1.'),
                 ('Achando Q: pares com um só 6',
                  'A outra nota é menor que 6, de 0 a 5: 0, 1, 2, 3, 4, 5, que são 6 notas.\nCada uma forma um par diferente: {6, 0}, {6, 1}, ..., {6, 5}. Então Q = 6.',
                  {'tipo': 'tabela', 'titulo': 'Os 7 pares', 'cabecalho': ['Grupo', 'Pares', 'Quantos'],
                   'linhas': [['Dois 6', '{6, 6}', '1'], ['Um só 6', '{6, 0} {6, 1} {6, 2} {6, 3} {6, 4} {6, 5}', '6']]})],
        volta='N = P + Q = 1 + 6 = 7 pares.\nConferindo um par: com {6, 3}, a fila de 13 fica 3, 4, 4, 5, 5, 5, 6, 7, ... e a 7ª é 6.\nResposta: alternativa X.',
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
        dados=[('Hoje', 'média R$ 2 500, desvio-padrão R$ 300, CV 12%'), ('Reajuste', '10% sobre o salário de todos'), ('Abono', 'mesmo valor para todos, depois do reajuste'),
               ('Divulga se', 'CV menor que 10%'), ('Quero', 'menor abono inteiro, em reais')],
        alts=[('R$ 251', 251, 'Não reajustou o desvio (ficou 300): 300 ÷ (2 750 + R) < 0,10 dá R > 250'),
              ('R$ 501', 501, 'Pôs o abono antes do reajuste: 330 ÷ (1,10 · (2 500 + R)) < 0,10 dá R > 500'),
              ('R$ 550', 550, 'Aceitou CV igual a 10%: 330 ÷ 3 300 = 0,10 não é menor que 0,10'),
              ('R$ 551', 551, 'OK'),
              ('R$ 801', 801, 'Não reajustou a média (ficou 2 500): 330 ÷ (2 500 + R) < 0,10 dá R > 800')],
        resumo='Depois do reajuste: média 2 750 e desvio 330. O abono soma na média e não muda o desvio. CV < 0,10 pede 330 < 0,10 · (2 750 + R), ou seja 2 750 + R > 3 300 e R > 550. Menor inteiro: 551.',
        ideia='O reajuste de 10% multiplica a média e o desvio por 1,10; o abono fixo soma só na média, o desvio não muda. O desvio tem de ficar abaixo de 1/10 da média nova.',
        pecas=[('Coeficiente de variação', 'Desvio-padrão ÷ média. Compara o tamanho do desvio com o tamanho da média, sem unidade.'),
               ('Abono fixo', 'Soma o mesmo valor a todos: a média sobe esse valor e o desvio fica igual.')],
        formulas=[('media', 'Coeficiente de variação', 'CV = desvio ÷ média'), ('porcentagem', 'Reajuste de 10%', 'novo = antigo × 1,10'),
                  ('texto', 'Abono fixo', 'média + R; o desvio não muda')],
        eq='R > 10 × S − M', leitura='o abono precisa levar a média nova a mais de 10 vezes o desvio novo',
        letras=[('R', 'abono, em reais (o que a questão quer)'), ('S', 'desvio-padrão depois do reajuste'), ('M', 'média depois do reajuste, antes do abono')],
        eq_texto='CV menor que 10% quer dizer desvio menor que 1/10 da média, ou média maior que 10 vezes o desvio. A média nova é M + R, e o desvio novo é S.\nAgora é só achar S e M, uma por vez.',
        achando=[('Achando S: o desvio depois do reajuste',
                  'O reajuste multiplica todos os salários por 1,10, e o desvio cresce na mesma proporção.\n300 · 1,10 = 300 + 30 = 330. O abono é igual para todos e só desloca os salários: não muda o desvio. S = 330.'),
                 ('Achando M: a média depois do reajuste',
                  'A média também é multiplicada por 1,10.\n2 500 · 1,10 = 2 500 + 250 = 2 750. M = 2 750 (o abono entra depois).')],
        volta='O CV novo é 330 ÷ (2 750 + R) e precisa ser menor que 0,10.\nDividir por 0,10 é multiplicar por 10: 10 · 330 = 3 300, e a média nova precisa passar de 3 300.\n2 750 + R > 3 300, então R > 3 300 − 2 750 = 550. O menor inteiro é 551.\nResposta: alternativa X. Conferindo: com 551, 330 ÷ 3 301 é cerca de 0,09997; com 550, 330 ÷ 3 300 = 0,10 exato, que não é menor.',
        valores=[('S', 'R$ 330'), ('M', 'R$ 2 750'), ('R', 'mais de R$ 550, logo R$ 551')],
        pista='reajuste de % multiplica média e desvio; abono fixo só soma na média → o CV novo é o desvio novo ÷ (média nova + abono); precisa ser menor que 10%.',
        rec1='média 2 500; desvio 300; reajuste 10%; abono fixo; CV < 10%', rec3='S = 330; M = 2 750; R > 550, logo 551',
        checagem=('5 salários: média R$ 1 000 e desvio R$ 100. Reajuste de 10% e depois um abono de R$ 50 para todos. Qual é o desvio novo?',
                  ['R$ 110', 'R$ 150', 'R$ 100', 'R$ 160'], 'R$ 110', 'O reajuste multiplica o desvio: 100 · 1,10 = 110. O abono não muda o desvio.'),
        ancora='parcial · ENEM 2021 q.173 (caderno 5; coeficiente de variação = desvio ÷ média, trocar só se o novo CV for menor; o PDF está ilegível, li o texto do banco do site) com o quadro antes e depois da Fuvest 2025 2ª fase M02; não achei real com reajuste e abono fixo sobre média e desvio',
        canal='fora do canal: coeficiente de variação não aparece; média e desvio-padrão em mat-45-medias-de-dispersao-estatistica.txt [28:24:01]',
        antes=['porcentagem', 'dividir-por-decimal', 'numero-que-falta'],
    ),
    dict(
        id='d2-escada-mat-ita-est-00d', materia='Matemática', tema=T, calc=37,
        enunciado=ENUN_D,
        dados=[('Lista', 'os inteiros de 1 até n, n desconhecido'), ('Apagado', 'um dos números da lista'),
               ('Média dos que sobraram', '20,6'), ('Quero', 'o número apagado')],
        alts=[('17', 17, 'Supôs n = 40 e arredondou: 820 − 39 · 20,6 = 820 − 803,4 = 16,6'),
              ('21', 21, 'Arredondou a média 20,6 e respondeu um número perto dela'),
              ('37', 37, 'OK'),
              ('40', 40, 'Respondeu quantos números sobraram, em vez do apagado'),
              ('41', 41, 'Respondeu o maior número da lista (n), em vez do apagado')],
        resumo='A média prende n entre 39,2 e 41,2, logo n é 40 ou 41; só n = 41 dá soma inteira (40 · 20,6 = 824). A lista soma 861, então o apagado é 861 − 824 = 37.',
        ideia='Apagar um número só mexe pouco na média: ela fica entre n ÷ 2 e (n + 2) ÷ 2, e isso prende n. Depois, soma total menos soma dos que sobraram dá o apagado.',
        pecas=[('Média', 'Soma ÷ quantidade, então soma = média × quantidade.'), ('Soma de 1 a n', 'n × (n + 1) ÷ 2.')],
        formulas=[('media', 'Média', 'soma = média × quantidade'), ('contagem', 'Soma de 1 até n', 'n × (n + 1) ÷ 2'),
                  ('texto', 'Número apagado', 'soma de tudo − soma dos que sobraram')],
        eq='K = S − R', leitura='número apagado = soma de 1 até N − soma dos que sobraram',
        letras=[('K', 'número apagado (o que a questão quer)'), ('N', 'quantos números a lista tinha antes de apagar'),
                ('S', 'soma de todos os números de 1 até N'), ('R', 'soma dos N − 1 números que sobraram')],
        eq_texto='A soma de tudo menos a soma do que sobrou é o número que saiu. Mas N não foi dado: primeiro preciso achar N.\nAgora é só achar N, S e R, uma por vez.',
        achando=[('Achando N: onde a média prende N',
                  'Apagar o maior número (N) deixa a média mais baixa possível: N ÷ 2. Apagar o 1 deixa a mais alta: (N + 2) ÷ 2.\nConferindo com 1 a 5: sem o 5 a média é 2,5; sem o 1 é 3,5.\nEntão N ÷ 2 ≤ 20,6 ≤ (N + 2) ÷ 2.'),
                 ('Achando N: só dois valores servem',
                  'N ÷ 2 ≤ 20,6 dá N ≤ 41,2.\n(N + 2) ÷ 2 ≥ 20,6 dá N + 2 ≥ 41,2, então N ≥ 39,2.\nComo N é inteiro, N é 40 ou 41.'),
                 ('Achando N: só um dos dois fecha',
                  'Sobram N − 1 números, e a soma deles é um número inteiro.\nCom N = 40: 39 · 20,6 = 780 + 23,4 = 803,4, que não é inteiro.\nCom N = 41: 40 · 20,6 = 800 + 24 = 824, que é inteiro. Então N = 41.'),
                 ('Achando S: a soma de 1 até 41',
                  'Soma de 1 até N = N · (N + 1) ÷ 2.\n41 · 42 = 1 680 + 42 = 1 722, e 1 722 ÷ 2 = 861. S = 861.'),
                 ('Achando R: a soma dos que sobraram',
                  'Soma = média × quantidade. Sobraram 40 números.\n40 · 20,6 = 800 + 24 = 824. R = 824.')],
        volta='K = S − R = 861 − 824 = 37.\nConferindo: sem o 37, a lista soma 824 e tem 40 números, e 824 ÷ 40 = 20,6.\nResposta: alternativa X.',
        valores=[('N', '41 números'), ('S', '861'), ('R', '824'), ('K', '37')],
        pista='n não foi dado → a média prende n (entre n ÷ 2 e (n + 2) ÷ 2); depois, soma de 1 até n menos média × quantidade dá o apagado.',
        rec1='lista de 1 até n; um apagado; média 20,6', rec3='N = 41; S = 861; R = 824; K = 37',
        checagem=('Apagou-se um número de 1, 2, 3, 4, 5 e a média dos 4 que sobraram é 2,5. Qual foi apagado?',
                  ['5', '1', '4', '2,5'], '5', 'Soma de 1 a 5 = 15. Os 4 que sobraram somam 4 · 2,5 = 10. O apagado é 15 − 10 = 5.'),
        ancora='parcial · HMMT fev/2021 Guts q.1 (inteiros consecutivos com um apagado) e q.6 (a média vira uma soma); sem real do tema com média dada e n desconhecido, a técnica é a dessas duas',
        canal='mat-44-medias-estatistica.txt [27:19:31] (média = soma dos valores ÷ quantidade); soma de 1 até n fora do canal (aula Antes)',
        antes=['est-soma-de-1-a-n', 'numero-que-falta', 'multiplicar-decimais'],
    ),
]

MANTER = {}

tabela = lambda titulo, cab, linhas: {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}  # noqa: E731

ANTES_NOVOS = {
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
        'titulo': 'Somar 1 + 2 + 3 + ... + n',
        'linhas': [
            'Junte o 1º com o último, o 2º com o penúltimo, e assim por diante. Cada par soma n + 1.',
            'Em 1 até 10 há 5 pares, cada um somando 11: 5 · 11 = 55. Em fórmula: n · (n + 1) ÷ 2 = 10 · 11 ÷ 2 = 55.',
            'Outro: 1 até 41 é 41 · 42 ÷ 2. Como 41 · 42 = 1 680 + 42 = 1 722, a soma é 1 722 ÷ 2 = 861.',
        ],
        'visual': tabela('Somas de 1 até n', ['Até n', 'Conta', 'Soma'], [['5', '5 · 6 ÷ 2', '15'], ['10', '10 · 11 ÷ 2', '55'], ['20', '20 · 21 ÷ 2', '210']]),
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
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), (_q['id'], [len(v) for _, v in _q['dados']])
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), _q['id']
    assert len(_q['ideia']) <= 300, _q['id']
    assert all(l not in 'ABCDE' for l, _ in _q['letras']), _q['id']
    assert len({l for l, _ in _q['letras']}) == len(_q['letras'])
    assert all(len(o) <= 60 for o in _q['checagem'][1]) and _q['checagem'][2] in _q['checagem'][1]
