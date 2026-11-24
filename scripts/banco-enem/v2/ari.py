"""Aritmética e Porcentagem (1º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (MANTER: custo com 3 partes que mudam), b = ITA/IME (quantas trocas até a mistura enfraquecer),
c = Fuvest (3 parcelas iguais com entrada, juros só sobre o saldo), d = Harvard-MIT (contagem de totais inteiros).
Aritmética é o 1º degrau: não há degrau anterior e nenhum conteúdo de degrau posterior é usado (sem Equações, sem Combinatória).
Toda resposta é conferida por conta Python (assert) neste módulo.
"""
ARQUIVO = 'matematica-aritmetica-novas.json'
T = 'Aritmética e Porcentagem'
INTRO = 'Cada fórmula é explicada, com números, no passo em que for usada. Aqui você só vê o nome dela. O ponto · significa vezes.'
INTRO_B = 'Cada fórmula é explicada, com números, no passo em que for usada. O 0,75 e o 1/4 nascem no passo "Achando F"; por enquanto, só o nome. O ponto · significa vezes.'
INTRO_C = 'Cada fórmula é explicada, com números, no passo em que for usada. O p é o número da porcentagem (em 10%, p = 10: 1 + 10 ÷ 100 = 1,1). O ponto · significa vezes.'
INTRO_D = 'Cada fórmula é explicada, com números, no passo em que for usada. O p é o número da porcentagem (em 20%, p = 20). O ponto · significa vezes.'

# ---------------------------------------------------------------- a) ENEM/Fuvest: custo por componente (novo, mais difícil)
TAB = {'Cálcio': (200, 600), 'Zinco': (150, 400), 'Ferro': (50, 2000)}  # mg por cápsula, R$ por g
custo = {k: m / 1000 * r for k, (m, r) in TAB.items()}
assert custo == {'Cálcio': 120, 'Zinco': 60, 'Ferro': 100}
dP = custo['Cálcio'] * 0.10
dW = -custo['Zinco'] * 0.20
dX = custo['Ferro'] * 0.40 * 0.50  # só 40% do ferro vem do novo fornecedor, 50% mais caro por grama
assert (round(dP, 9), round(dW, 9), round(dX, 9)) == (12, -12, 20)
Q_CAPS = 30
R_A = Q_CAPS * (dP + dW + dX)
assert round(R_A, 9) == 600
# efeito real no ferro: 40 -> 60, o resto igual: 60 + 60 = 120 (alta de 20%)
assert 100 * 0.6 + 100 * 0.4 * 1.5 == 120
# exemplo da origem: R$ 200 de ferro, 40% = 80 passa a 120; resto 120; total 240 (+20%)
assert 200 * 0.4 * 1.5 + 200 * 0.6 == 240
# distratores
assert round((dP + dW) * Q_CAPS) == 0                                             # ignorou o novo fornecedor
assert round(dP + dW + dX) == 20                                                  # uma cápsula, não o frasco
assert round((custo['Ferro'] * 0.5 + dP + dW) * Q_CAPS) == 1500                   # 50% em todo o ferro
sem_conv = (200 * 600 * 0.10) + (-150 * 400 * 0.20) + (50 * 2000 * 0.40 * 0.50)  # mg usados como se fossem g
assert round(sem_conv * Q_CAPS) == 600000
# "Sua vez": 1 cápsula de 20 mg de pó a R$ 500/g, com +10%: 0,02 · 500 = 10; +1; 10 cápsulas = 10
assert round(20 / 1000 * 500) == 10 and round(20 / 1000 * 500 * 0.1 * 10) == 10

ENUN_A = ('Uma farmácia de manipulação produz um suplemento em cápsulas, com três componentes. A tabela I mostra a massa de cada componente em uma cápsula e o preço '
          'de cada grama dele. A tabela II mostra como esses preços mudam no próximo mês. O ferro passará a ser comprado de dois fornecedores: o antigo, que mantém o preço, '
          'e um novo, que cobra 50% a mais por grama do que o antigo e fornecerá 40% de todo o ferro comprado. Os outros custos de produção não mudam.\n\n'
          'Tabela I | Massa por cápsula | Preço por grama\n'
          'Cálcio | 200 mg | R$ 600\n'
          'Zinco | 150 mg | R$ 400\n'
          'Ferro | 50 mg | R$ 2 000\n\n'
          'Tabela II | Variação do preço por grama\n'
          'Cálcio | aumenta 10%\n'
          'Zinco | diminui 20%\n'
          'Ferro | antigo fornecedor: 0%; novo fornecedor: aumenta 50% (60% do ferro vem do antigo e 40% do novo)\n\n'
          'Cada frasco leva 30 cápsulas. Qual será o aumento, em reais, no custo dos componentes de um frasco?')
assert len(ENUN_A) >= 600, len(ENUN_A)


# ---------------------------------------------------------------- b) ITA/IME: trocas até enfraquecer
FATOR = 0.75  # sai 10 L de 40 L = 1/4 da mistura e do álcool
assert 10 / 40 == 0.25 and 1 - 10 / 40 == FATOR


def trocas(c0, fator, limite):
    """Menor n com c0 * fator**n <= limite."""
    c, n = float(c0), 0
    while c > limite + 1e-12:
        c *= fator
        n += 1
    return n


assert trocas(80, 0.75, 10) == 8
cadeia = [80 * 0.75 ** n for n in range(9)]
assert [round(x, 2) for x in cadeia] == [80, 60, 45, 33.75, 25.31, 18.98, 14.24, 10.68, 8.01]
assert cadeia[7] > 10 >= cadeia[8]  # a 7ª ainda tem 10,68%; a 8ª tem 8,01%
# a cadeia arredondada em 2 casas (como a explicação mostra) dá os mesmos números
c = 80.0
passos_arred = [80.0]
for _ in range(8):
    c = round(c * 0.75 + 1e-9, 2)
    passos_arred.append(c)
assert passos_arred == [80, 60, 45, 33.75, 25.31, 18.98, 14.24, 10.68, 8.01], passos_arred
# a explicação mostra cada passo como ÷ 4 e × 3
for _ini, _q4, _fim in [(80, 20, 60), (60, 15, 45), (45, 11.25, 33.75), (33.75, 8.4375, 25.3125), (25.31, 6.3275, 18.9825), (18.98, 4.745, 14.235), (14.24, 3.56, 10.68), (10.68, 2.67, 8.01)]:
    assert abs(_ini / 4 - _q4) < 1e-9 and abs(_q4 * 3 - _fim) < 1e-9, (_ini, _q4, _fim)
# distratores
assert -(-(80 - 10) // 20) == 4 and 80 - 4 * 20 <= 10 < 80 - 3 * 20            # queda linear de 20 pontos por troca
assert trocas(80, 2 / 3, 10) == 6                                                # tirou 10 L de 30 L (1/3 do álcool)
assert trocas(80, 40 / 50, 10) == 10                                             # juntou 10 L de água sem retirar: 40 ÷ 50 = 0,8
assert trocas(80, 0.75, 10.68 + 0.01) == 7                                       # "10,68 é quase 10": parou na 7ª
# "Sua vez": 50% de álcool, troca da metade (fator 0,5): 50, 25, 12,5, 6,25
assert trocas(50, 0.5, 10) == 3 and [50 * 0.5 ** n for n in range(4)] == [50, 25, 12.5, 6.25]

# ---------------------------------------------------------------- c) Fuvest: 3 parcelas iguais, entrada sem juros
J = 1.1
K = J * J + J + 1
V = 3310 * J * J
assert abs(K - 3.31) < 1e-9 and abs(V - 4005.1) < 1e-9
P = V / K
assert abs(P - 1210) < 1e-9
assert 331 * 1210 == 400510 and 3310 * 121 == 400510 and 331 * 1000 + 331 * 200 + 331 * 10 == 400510
# simulação do saldo devedor: entrada P, depois 10% sobre o saldo, parcela, 10% sobre o saldo, parcela
saldo = 3310 - 1210
assert saldo == 2100
saldo = saldo * J - 1210
assert abs(saldo - 1100) < 1e-9
saldo = saldo * J - 1210
assert abs(saldo) < 1e-9
assert 1210 * 3 - 3310 == 320                                                    # juros pagos no total
# distratores
assert round(3310 / 3) == 1103 and round(3310 * 1.1 / 3) == 1214 and round(3310 * 1.21 / 3) == 1335
assert round(V / K / 1.21, 6) == 1000                                            # valor de hoje da última parcela
# "Sua vez": 210 à vista, 2 parcelas iguais (hoje e 30 dias), 10%: 210 · 1,1 = 231; K = 2,1; P = 110
assert abs(210 * 1.1 / 2.1 - 110) < 1e-9 and 110 + 110 / 1.1 == 210

ENUN_C = ('Uma loja anuncia uma máquina de lavar por R$ 3 310 à vista. Quem prefere parcelar segue o contrato abaixo, com juros de 10% ao mês, '
          'cobrados somente sobre o que ainda se deve depois de cada pagamento, mês a mês. A 1ª parcela é uma entrada e, por ser paga na hora, não rende juros. '
          'As três parcelas têm o mesmo valor, e a última deixa a dívida zerada.\n\n'
          'Quando | O que se paga\n'
          'Hoje, na compra | 1ª parcela (entrada)\n'
          '30 dias depois | 2ª parcela\n'
          '60 dias depois | 3ª parcela, que quita a dívida\n\n'
          'Um cliente raciocinou: "3 310 dividido por 3 é 1 103,33, e ainda vêm os juros". Qual é o valor de cada parcela, em reais, '
          'para que a loja receba exatamente o equivalente ao preço à vista?')

# ---------------------------------------------------------------- d) Harvard-MIT: quantos totais inteiros


def totais(lo, hi):
    saida = []
    for cc in range(1, hi):
        if (3 * cc) % 4:
            continue
        bb = 3 * cc // 4
        if (6 * bb) % 5:
            continue
        aa = 6 * bb // 5
        t = cc + bb + aa
        if lo < t < hi:
            saida.append((cc, bb, aa, t))
    return saida


sol = totais(100, 400)
assert [s[3] for s in sol] == [106, 159, 212, 265, 318, 371] and len(sol) == 6
assert [s[0] for s in sol] == [40, 60, 80, 100, 120, 140]
assert all(s[1] == s[0] * 0.75 and abs(s[2] - s[1] * 1.2) < 1e-9 for s in sol)
# o menor caso e a regra "total = 53 · k"
assert totais(0, 60) == [(20, 15, 18, 53)]
assert all(s[3] % 53 == 0 for s in totais(0, 2000))
assert 53 * 7 == 371 and 53 * 8 == 424 and 53 * 7 < 400 < 53 * 8 and 53 < 100 < 106
assert 399 // 53 - 100 // 53 == 6                                                # M − L
assert [3 * m for m in range(1, 6)] == [3, 6, 9, 12, 15] and 15 % 5 == 0
# distratores
assert 399 // 53 == 7 and (399 - 100) // 53 == 5 and round(400 / 53) == 8 and 399 // 20 == 19
# "Sua vez": Ana 50% a mais que Bia; Bia 20% a menos que Caio; menor total inteiro
menor = [(cc, 4 * cc // 5, 3 * (4 * cc // 5) // 2) for cc in range(1, 100) if (4 * cc) % 5 == 0 and (3 * (4 * cc // 5)) % 2 == 0][0]
assert menor == (5, 4, 6) and sum(menor) == 15
# "Sua vez": entre 20 e 80 há quantos múltiplos de 6?
assert len([x for x in range(21, 80) if x % 6 == 0]) == 10 and 79 // 6 - 20 // 6 == 10

Q = [
    dict(
        id='d2-escada-mat-ita-ari-00a', materia='Matemática', tema=T, calc=600,
        canal='mat-04-porcentagem.txt [2:12:32] (fator 1,2 e 0,8; cada variação multiplica a sua parte)',
        ancora='forte · Fuvest 2024 1ª fase q.33, prova V (custo por componente em mg e R$/g, com a variação percentual de cada um em 2ª tabela)',
        antes=['porcentagem', 'multiplicar-decimais', 'ari-mg-em-g'], intro_formulas=INTRO,
        enunciado=ENUN_A,
        dados=[('Cálcio', '200 mg; R$ 600/g; sobe 10%'), ('Zinco', '150 mg; R$ 400/g; cai 20%'), ('Ferro', '50 mg; R$ 2 000/g; 40% sobe 50%'), ('Frasco', '30 cápsulas')],
        alts=[('0', 0, 'Esqueceu o novo fornecedor do ferro: +12 − 12 = 0'),
              ('20', 20, 'Deu o aumento de uma cápsula, não o do frasco de 30'),
              ('600', 600, 'OK'),
              ('1 500', 1500, 'Pôs os 50% em todo o ferro (+50 por cápsula): (12 − 12 + 50) · 30'),
              ('600 000', 600000, 'Não passou mg para g: usou 200, 150 e 50 no lugar de 0,2, 0,15 e 0,05')],
        resumo='Custo por cápsula: cálcio 0,2 · 600 = 120; zinco 0,15 · 400 = 60; ferro 0,05 · 2 000 = 100. Variações: +12; −12; ferro 40% de 100 = 40 e 50% de 40 = +20. Soma +20 por cápsula; frasco: 30 · 20 = 600.',
        ideia='Cada componente custa massa em gramas vezes o preço do grama, e a variação é uma % desse custo. No ferro, o aumento de 50% vale só para os 40% comprados do novo fornecedor: o efeito é 40% de 50% = 20% do custo do ferro.',
        pecas=[('Mg e g', 'O preço é por grama e a massa vem em miligramas. 1 g tem 1 000 mg.'),
               ('Aumento só de uma parte', 'Os 50% valem só para 40% do ferro; os outros 60% seguem com o preço antigo.')],
        formulas=[('porcentagem', 'Custo do componente', 'custo = gramas · preço por grama'), ('porcentagem', 'Parte de um total', 'parte = total · porcentagem ÷ 100')],
        origem=['O aumento vale só para uma parte. Exemplo com R$ 200 de ferro: 40% de 200 = 80 passam a vir do novo fornecedor, com 50% a mais: 80 + 40 = 120. Os outros 120 ficam iguais. O total vira 120 + 120 = 240: subiu 40, que são 20% de 200.',
                'Isso é 40% de 50%: 0,4 · 0,5 = 0,2 = 20%. O custo do ferro, no todo, sobe 20%, e não 50%.'],
        eq='S = N · (P + W + X)', leitura='aumento do frasco = cápsulas por frasco · (variação do cálcio + do zinco + do ferro, por cápsula)',
        letras=[('S', 'aumento do custo de um frasco, em R$ (o que a questão quer)'), ('N', 'cápsulas por frasco'), ('P', 'variação do custo do cálcio por cápsula, em R$'),
                ('W', 'variação do custo do zinco por cápsula, em R$ (negativa se o custo cai)'), ('X', 'variação do custo do ferro por cápsula, em R$')],
        eq_texto='O aumento do frasco é o de uma cápsula vezes 30. Em uma cápsula, somo as variações dos três componentes; uma queda entra com sinal de menos.\nAgora é só achar N, P, W e X.',
        achando=[('Achando N: as cápsulas do frasco', 'O enunciado diz: N = 30.'),
                 ('Achando P: a variação do cálcio', '200 mg em gramas: 200 ÷ 1 000 = 0,2 g. Custo: 0,2 · 600 = 120 (2 · 600 = 1 200; 0,2 tem 1 casa, então 1 200 ÷ 10 = 120).\nSobe 10%: 10% de 120 = 120 ÷ 10 = 12. P = +12.'),
                 ('Achando W: a variação do zinco', '150 mg = 0,15 g. Custo: 0,15 · 400 = 60 (15 · 400 = 6 000; 0,15 tem 2 casas, então 6 000 ÷ 100 = 60).\nCai 20%: 10% de 60 = 6 e 20% = 12. Como é queda, W = −12.'),
                 ('Achando X: a variação do ferro', '50 mg = 0,05 g. Custo: 0,05 · 2 000 = 100 (5 · 2 000 = 10 000, e ÷ 100 = 100).\nSó 40% do ferro vem do novo fornecedor: 40% de 100 = 40. Essa parte custa 50% a mais: 50% de 40 = 20. X = +20.')],
        volta='S = 30 · (12 − 12 + 20). Dentro do parêntese: 12 − 12 = 0 e 0 + 20 = 20.\nS = 30 · 20 = 600 (3 · 2 = 6 e dois zeros).\nResposta: alternativa X.',
        valores=[('N', '30'), ('P', '+12'), ('W', '−12'), ('X', '+20')],
        pista='"preço em R$/g e massa em mg, reajuste de cada parte" → passe mg para g, ache o custo de cada componente, aplique a % só na parte que muda, some e multiplique pelo lote.',
        rec1='3 componentes em mg e R$/g; ferro: 40% sobe 50%; 30 cápsulas', rec3='N = 30; P = +12; W = −12; X = +20',
        checagem=('Uma cápsula tem 20 mg de um pó a R$ 500 por g. Em um lote de 10 cápsulas, o preço do g sobe 10%. Qual o aumento no custo do pó do lote?', ['R$ 10', 'R$ 1', 'R$ 100', 'R$ 10 000'], 'R$ 10',
                  '20 mg = 0,02 g; 0,02 · 500 = 10 por cápsula; 10% de 10 = 1; 10 cápsulas: R$ 10.'),
    ),
    dict(
        id='d2-escada-mat-ita-ari-00b', materia='Matemática', tema=T, calc=8,
        canal='mat-04-porcentagem.txt [2:09:00] (cada variação percentual é um fator que se multiplica, 1,2 e 0,8); mistura e diluição: fora do canal',
        ancora='parcial · IME 2022 2ª fase q.1 (texto seco em que a ideia escondida vale mais que a conta; aqui, o fator por troca); não há real de diluição no repositório',
        antes=['porcentagem', 'fracoes', 'multiplicar-decimais'], intro_formulas=INTRO_B,
        enunciado=('Um tanque de 40 L contém uma mistura de álcool e água com 80% de álcool. Em cada operação, retiram-se 10 L da mistura, bem mexida, '
                   'e o tanque é completado com 10 L de água pura. A operação se repete até que o álcool passe a ser 10% ou menos do volume da mistura. '
                   'Qual é o menor número de operações necessário?'),
        dados=[('Tanque', '40 L, sempre cheio'), ('Álcool no início', '80%'), ('Cada operação', 'sai 10 L e entra 10 L de água'), ('Parar quando', 'álcool for 10% ou menos')],
        alts=[('4', 4, 'Tirou 20 pontos (25% de 80) em toda operação: 70 ÷ 20 = 3,5, arredondado para 4'),
              ('6', 6, 'Achou que a mistura tinha 30 L (sem contar o tanque cheio de 40 L) e que sai 1/3 do álcool: fator 2/3, chega a 10% na 6ª'),
              ('7', 7, 'Parou na 7ª, com 10,68%, achando que é "quase 10"'),
              ('8', 8, 'OK'),
              ('10', 10, 'Juntou 10 L de água a 40 L sem retirar nada (fator 40 ÷ 50 = 0,8): só chega a 10% ou menos na 10ª')],
        resumo='Cada operação deixa 3/4 do álcool: 80 → 60 → 45 → 33,75 → 25,31 → 18,98 → 14,24 → 10,68 (7ª, ainda mais de 10%) → 8,01 (8ª). N = 8.',
        ideia='Cada operação tira 1/4 da mistura e, junto, 1/4 do álcool; a água que entra não tem álcool. Então a % de álcool é multiplicada por 0,75 a cada vez, e não diminui sempre os mesmos pontos.',
        pecas=[('Mistura bem mexida', 'O que sai tem a mesma % de álcool do tanque. Por isso sai 1/4 do álcool quando sai 1/4 da mistura.')],
        formulas=[('porcentagem', 'Ficar com 3/4', 'sobra = antes · 0,75'), ('porcentagem', 'Fração que sai', '10 L ÷ 40 L = 1/4')],
        eq='T · F · F · … · F ≤ 10', leitura='álcool no início, vezes 0,75 uma vez por troca, até ficar 10 ou menos; N é quantos F aparecem',
        letras=[('N', 'número de operações: quantos F aparecem na conta (o que a questão quer)'), ('T', 'álcool no início, em %'), ('F', 'o que sobra do álcool a cada operação')],
        eq_texto='A cada operação a % de álcool é multiplicada por F. Depois de N operações é T · F · F · … · F, com N fatores F. Procuro o menor N que deixa a conta em 10 ou menos.\nAgora é só achar T e F.',
        achando=[('Achando T: o álcool no início', 'O tanque começa com 80% de álcool: T = 80.\nO tanque está sempre com 40 L. Por isso a % de álcool anda junto com a quantidade de álcool: se o álcool vai a 3/4, a % vai a 3/4 também.'),
                 ('Achando F: o que sobra a cada operação', 'Saem 10 L de 40 L: 10 ÷ 40 = 1/4 da mistura. Está bem mexida, então sai 1/4 do álcool junto. A água que entra não tem álcool. Sobram 3/4 = 0,75: F = 0,75.\nExemplo com números: 40 L com 80% = 32 L de álcool e 8 L de água. Saem 10 L, que levam 1/4 de cada um: 8 L de álcool e 2 L de água. Sobram 24 L de álcool em 40 L: 24 ÷ 40 = 0,6 = 60%, o mesmo que 80 · 0,75.\nCuidado: não são sempre 20 pontos. A 2ª operação tira 1/4 de 60, que é 15.')],
        volta='Cada operação é × 0,75, que é ÷ 4 e depois × 3. Guardo 2 casas: o erro é pequeno perto da distância até 10.\n1ª: 80 ÷ 4 = 20; 20 · 3 = 60.\n2ª: 60 ÷ 4 = 15; 15 · 3 = 45.\n3ª: 45 ÷ 4 = 11,25; 11,25 · 3 = 33,75.\nEstimando: de 33,75 ainda falta cair até 10, então faltam umas 4 operações. Só a 7ª e a 8ª pedem cuidado.\n4ª: 33,75 ÷ 4 = 8,4375; · 3 = 25,3125, uns 25,31.\n5ª: 25,31 ÷ 4 = 6,3275; · 3 = 18,9825, uns 18,98.\n6ª: 18,98 ÷ 4 = 4,745; · 3 = 14,235, uns 14,24.\n7ª: 14,24 ÷ 4 = 3,56; · 3 = 10,68. Ainda MAIS de 10%, não vale.\n8ª: 10,68 ÷ 4 = 2,67; · 3 = 8,01. Agora é menos de 10%. N = 8.\nResposta: alternativa X.',
        valores=[('T', '80%'), ('F', '0,75'), ('N', '8')],
        pista='"retira parte da mistura e completa com água, várias vezes" → a cada vez sobra a mesma fração do álcool; multiplique em cadeia e pare no primeiro valor que atende, sem arredondar a contagem.',
        rec1='40 L; 80%; sai 1/4; parar em 10% ou menos', rec3='T = 80; F = 0,75; N = 8',
        checagem=('Tanque com 50% de álcool; cada operação tira metade da mistura e põe água. Quantas operações até 10% ou menos?', ['3', '2', '4', '5'], '3',
                  '50 → 25 → 12,5 → 6,25: na 2ª ainda tem 12,5%; na 3ª tem 6,25%.'),
    ),
    dict(
        id='d2-escada-mat-ita-ari-00c', materia='Matemática', tema=T, calc=1210,
        canal='mat-35-amortizacao-e-parcelamento.txt [21:15:02] (a entrada não tem juros) e [21:21:35] (levar cada parcela à mesma data)',
        ancora='parcial · ENEM 2023 q.161 (CD7: parcelas iguais, a 1ª na compra, juros só depois) e Fuvest 2025 2ª fase M04 (financiamento por parcelas); juros cobrados só sobre o saldo',
        antes=['porcentagem', 'multiplicar-decimais', 'dividir-por-decimal', 'numero-que-falta'], intro_formulas=INTRO_C,
        enunciado=ENUN_C,
        dados=[('Preço à vista', 'R$ 3 310'), ('Parcelas', '3 iguais: hoje, em 30 e em 60 dias'), ('Juros', '10% ao mês, só sobre o saldo devedor'), ('Entrada', 'paga na hora, sem juros')],
        alts=[('1 000', 1000, 'Deu o valor de hoje da última parcela (3 310 ÷ 3,31) e não levou ao dia 60'),
              ('1 103', 1103, 'Dividiu 3 310 por 3 e ignorou os juros'),
              ('1 210', 1210, 'OK'),
              ('1 214', 1214, 'Pôs 10% de juros no total e dividiu por 3: 3 310 · 1,1 ÷ 3 = 1 213,67'),
              ('1 335', 1335, 'Pôs 21% no total e dividiu por 3: 3 310 · 1,21 ÷ 3 = 1 335,03')],
        resumo='No dia 60: V = 3 310 · 1,21 = 4 005,1; K = 1,21 + 1,1 + 1 = 3,31; P = 4 005,1 ÷ 3,31 = 1 210. Conferindo: saldo 3 310 − 1 210 = 2 100; 2 100 · 1,1 − 1 210 = 1 100; 1 100 · 1,1 − 1 210 = 0.',
        ideia='A entrada não rende juros e a dívida cresce 10% por mês. Leve tudo para o dia 60: o preço à vista, parado até lá, tem de valer o mesmo que as três parcelas, cada uma levada com os juros do tempo que ficou na mão do cliente.',
        pecas=[('Saldo devedor', 'O que ainda se deve depois de pagar a parcela. Só ele rende juros.'),
               ('Levar para o dia 60', 'Dinheiro de hoje cresce 10% por mês: ×1,1 em 30 dias e ×1,1 ×1,1 = ×1,21 em 60 dias.')],
        formulas=[('porcentagem', 'Acrescentar p%', 'novo = antigo · (1 + p ÷ 100)'), ('porcentagem', 'Levar ao dia 60', 'dia 60 = hoje · 1,1 · 1,1')],
        origem=['Com juros de 10% ao mês, R$ 100 de hoje viram R$ 110 em 30 dias (100 · 1,1) e R$ 121 em 60 dias (110 · 1,1).',
                'R$ 100 hoje e R$ 100 daqui a 60 dias não valem o mesmo: os de hoje viram R$ 121 em 60 dias. Só dá para somar dinheiro quando todos estão na MESMA data. Escolho o dia 60, o último.',
                'Uma parcela paga hoje vale, no dia 60, P · 1,1 · 1,1. A do dia 30 vale P · 1,1. A do dia 60 vale P. E os R$ 3 310 à vista valem 3 310 · 1,1 · 1,1. As duas somas têm de ser iguais.',
                'A entrada não gera juros na DÍVIDA (o saldo começa em 3 310 − P). Mas, para comparar na mesma data, ela vale o que o dinheiro dela renderia em 60 dias: P · 1,21.'],
        eq='P · K = V', leitura='parcela · (soma dos fatores) = preço à vista levado ao dia 60',
        letras=[('P', 'valor de cada parcela, em R$ (o que a questão quer)'), ('K', 'soma dos números pelos quais cada parcela é multiplicada até o dia 60 (1,21, 1,1 e 1)'), ('V', 'preço à vista levado ao dia 60, em R$')],
        eq_texto='No dia 60, as três parcelas valem P · 1,21 + P · 1,1 + P. P é o mesmo que 1 · P. Teste com P = 100: 121 + 110 + 100 = 331, e 100 · 3,31 = 331. Então a soma é P · K, com K = 1,21 + 1,1 + 1. Isso tem de ser igual a V, o preço à vista levado ao dia 60.\nAgora é só achar K e V.',
        achando=[('Achando K: a soma dos fatores', '1ª parcela (hoje): ×1,1 duas vezes, 1,1 · 1,1: sem vírgulas, 11 · 11 = 121; há 1 + 1 = 2 casas: 1,21.\n2ª parcela (30 dias): ×1,1.\n3ª parcela (60 dias): ×1.\nK = 1,21 + 1,1 + 1: 1,21 + 1,10 = 2,31 e 2,31 + 1 = 3,31.'),
                 ('Achando V: o preço à vista no dia 60', 'V = 3 310 · 1,21. Sem vírgulas: 3 310 · 121 = 331 000 + 66 200 + 3 310 = 400 510 (3 310 · 100, 3 310 · 20 e 3 310 · 1). Há 2 casas, então V = 4 005,10 = 4 005,1.')],
        volta='P · 3,31 = 4 005,1. Quero P: desfaço o × 3,31 dividindo.\nP = 4 005,1 ÷ 3,31. Multiplico os dois por 100 (o resultado da divisão não muda) para sumir a vírgula: 400 510 ÷ 331.\nDivisão grande: vou tirando de 400 510 pedaços de 331 que sei calcular. 331 · 1 000 = 331 000; sobram 69 510. 331 · 200 = 66 200; sobram 3 310. 331 · 10 = 3 310; sobra 0. P = 1 000 + 200 + 10 = 1 210.\nConferindo: saldo 3 310 − 1 210 = 2 100; 2 100 · 1,1 = 2 310, menos 1 210 = 1 100; 1 100 · 1,1 = 1 210, menos 1 210 = 0.\nResposta: alternativa X.',
        valores=[('K', '3,31'), ('V', '4 005,1')],
        pista='"parcelas iguais, a 1ª na compra, juros só sobre o saldo" → leve tudo para a última data: cada parcela ganha ×1,1 por mês que ficou antes dela, e o preço à vista também.',
        rec1='3 310 à vista; 3 parcelas iguais; 10% ao mês; entrada sem juros', rec3='K = 3,31; V = 4 005,1; P = 1 210',
        checagem=('À vista R$ 210, duas parcelas iguais (hoje e em 30 dias), juros de 10% ao mês. Qual a parcela?', ['R$ 110', 'R$ 105', 'R$ 115,50', 'R$ 100'], 'R$ 110',
                  'No dia 30: V = 210 · 1,1 = 231 e K = 1,1 + 1 = 2,1; P = 231 ÷ 2,1 = 110. Conferindo: saldo 100, com 10%: 110.'),
    ),
    dict(
        id='d2-escada-mat-ita-ari-00d', materia='Matemática', tema=T, calc=6,
        canal='mat-03-mmc-e-mdc.txt [1:02:33] (múltiplos) e mat-04-porcentagem.txt [2:09:00] (fator em cadeia)',
        ancora='parcial · HMMT nov/2020 Theme q.3 (porcentagem que vira condição sobre inteiros) e HMMT nov/2021 Theme q.7 (inteiros por razão); a contagem é do estilo, o texto é nosso',
        antes=['porcentagem', 'fracoes', 'ari-multiplos'], intro_formulas=INTRO_D,
        enunciado=('Ana, Bia e Caio guardam figurinhas, cada um com uma quantidade inteira. Ana tem 20% a mais do que Bia, e Bia tem 25% a menos do que Caio. '
                   'Juntos, eles têm mais de 100 e menos de 400 figurinhas. Quantos valores diferentes o total de figurinhas pode ter?'),
        dados=[('Ana', '20% a mais que Bia'), ('Bia', '25% a menos que Caio'), ('Total dos três', 'mais de 100 e menos de 400'), ('Quantidades', 'todas inteiras')],
        alts=[('5', 5, 'Fez (399 − 100) ÷ 53 = 5,6 e ficou com 5, sem somar 1 (contou degraus, não números)'),
              ('6', 6, 'OK'),
              ('7', 7, 'Contou os múltiplos de 53 até 399 e não tirou o 53, que não passa de 100'),
              ('8', 8, 'Arredondou 400 ÷ 53 = 7,5 para cima e contou o 424, que passa de 400'),
              ('19', 19, 'Contou os valores de Caio (múltiplos de 20 até 399) e não ligou ao total')],
        resumo='Caio = 20 · x, Bia = 15 · x, Ana = 18 · x, total = 53 · x. Múltiplos de 53 de 100 a 400: 106, 159, 212, 265, 318, 371 (x = 2 a 7). Conta: 7 − 1 = 6.',
        ideia='Para as três quantidades serem inteiras, Caio precisa ser múltiplo de 20, e o total vira sempre 53 vezes um número. A porcentagem esconde a divisibilidade: a pergunta vira contar múltiplos de 53 na faixa.',
        pecas=[('Quantidade inteira', 'Ninguém tem figurinha pela metade. 75% de Caio só é inteiro se Caio for múltiplo de 4, e assim por diante.'),
               ('Múltiplo de 53', 'Um número que é 53 vezes um inteiro: 53, 106, 159, 212...')],
        formulas=[('porcentagem', 'p% a mais', 'novo = antigo · (1 + p ÷ 100)'), ('porcentagem', 'p% a menos', 'novo = antigo · (1 − p ÷ 100)'), ('contagem', 'Múltiplos entre dois valores', 'quantos até o maior − quantos até o menor')],
        eq='N = M − L', leitura='totais possíveis = múltiplos de S que cabem abaixo de 400 − múltiplos de S que ficam até 100',
        letras=[('N', 'quantos totais diferentes são possíveis (o que a questão quer)'), ('M', 'quantos múltiplos de S ficam abaixo de 400'), ('L', 'quantos múltiplos de S ficam até 100 (não valem)'), ('S', 'o menor total possível, em figurinhas')],
        eq_texto='Se todo total possível é múltiplo de S (o menor total), o número de totais é a quantidade de múltiplos de S na faixa. Conto os que cabem abaixo de 400 (M) e tiro os que ficam até 100 (L).\nAgora é só achar S, M e L. Começo por S.',
        achando=[('Achando S: o menor total possível', 'Chamo de x um número que ainda vou achar.\n25% a menos: sobram 100% − 25% = 75% = 3/4. De 20 sai 5 e sobram 15. Se Caio tem 8, Bia tem 3/4 de 8 = 6. Se Caio tem 6, Bia teria 4,5: não pode. Caio é de 4 em 4: Caio = 4 · x e Bia = 3 · x.\n20% a mais é 1 em cada 5: de 15 sobe 3 (15 ÷ 5 = 3), 15 + 3 = 18. Ou seja, Ana = Bia ÷ 5 · 6. Para dar inteiro, Bia (3 · x) tem de ser múltiplo de 5. Teste: x = 1, 2, 3, 4 dão 3, 6, 9, 12 (não); x = 5 dá 15 (sim).\nSó x = 5, 10, 15... servem. Com x = 5: Caio 20, Bia 15, Ana 15 ÷ 5 · 6 = 18. Total 20 + 15 + 18 = 53. Com x = 10: 40, 30, 36, total 106 = 2 · 53. S = 53.'),
                 ('Achando M: os totais abaixo de 400', 'Os totais possíveis são 53, 106, 159, 212, 265, 318, 371, 424...\n53 · 7 = 371 (50 · 7 = 350 e 3 · 7 = 21). 53 · 8 = 424 passa de 400. Abaixo de 400 cabem 7. M = 7.'),
                 ('Achando L: os totais que não passam de 100', 'O total tem de ser MAIS de 100. 53 · 1 = 53 não passa; 53 · 2 = 106 passa. Só 1 múltiplo fica até 100. L = 1.')],
        volta='N = M − L = 7 − 1 = 6.\nConferindo na lista: 106, 159, 212, 265, 318, 371. São 6 totais (Caio com 40, 60, 80, 100, 120 e 140).\nResposta: alternativa X.',
        valores=[('S', '53'), ('M', '7'), ('L', '1')],
        pista='"porcentagem a mais ou a menos, com quantidades inteiras" → escreva cada um como fração de um só, ache o menor total que fecha com inteiros e conte os múltiplos dele na faixa.',
        rec1='Ana +20% de Bia; Bia −25% de Caio; total entre 100 e 400; inteiros', rec3='S = 53; M = 7; L = 1',
        checagem=('Ana tem 50% a mais que Bia; Bia tem 20% a menos que Caio; todos com quantidade inteira. Qual o menor total possível?', ['15', '9', '10', '30'], '15',
                  'Bia = 4/5 de Caio: Caio múltiplo de 5. Ana = 3/2 de Bia: Bia par. Com Caio 5: Bia 4, Ana 6, total 15.'),
    ),
]

MANTER = {}

ANTES_NOVOS = {
    'ari-mg-em-g': {
        'titulo': 'Miligrama e grama',
        'linhas': [
            '1 grama (g) tem 1 000 miligramas (mg). Para passar de mg para g, divida por 1 000: 200 mg = 200 ÷ 1 000 = 0,2 g.',
            'Dividir por 1 000 é andar a vírgula 3 casas para a esquerda: 150 mg = 0,150 g = 0,15 g.',
            'Custo = gramas · preço do grama. 0,2 g a R$ 600 por g custa 0,2 · 600 = R$ 120 (2 · 600 = 1 200, e uma casa para a esquerda).',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'De mg para g', 'cabecalho': ['Massa', 'Em gramas'], 'linhas': [['200 mg', '0,2 g'], ['150 mg', '0,15 g'], ['50 mg', '0,05 g']]},
        'exercicios': [
            {'enunciado': 'Quantos gramas são 350 mg?', 'alternativas': ['0,35 g', '3,5 g', '35 g', '350 g'], 'certa': 0,
             'resolucao': '0,35 g: 350 ÷ 1 000 = 0,35.\n3,5 e 35 andam pouco a vírgula; 350 g nem converteu.'},
            {'enunciado': 'Uma cápsula tem 40 mg de um pó que custa R$ 500 por g. Quanto custa o pó de uma cápsula?', 'alternativas': ['R$ 20', 'R$ 20 000', 'R$ 2', 'R$ 200'], 'certa': 0,
             'resolucao': 'R$ 20: 40 mg = 0,04 g e 0,04 · 500 = 20.\nR$ 20 000 não converteu; R$ 2 e R$ 200 erram a vírgula.'},
        ],
    },
    'ari-multiplos': {
        'titulo': 'Múltiplos: contar quantos cabem',
        'linhas': [
            'Múltiplo de 7 é 7 vezes um número inteiro: 7 · 1 = 7, 7 · 2 = 14, 7 · 3 = 21, 7 · 4 = 28...',
            'Para ver se um número é múltiplo de 7, divida por 7. Deu inteiro? É. 35 ÷ 7 = 5, então 35 é múltiplo. 36 ÷ 7 = 5,14: não é.',
            'Quantos múltiplos de 7 cabem até 50? 50 ÷ 7 = 7,14. Cabem 7 (7 · 7 = 49). O próximo, 7 · 8 = 56, passa de 50.',
            'Entre dois números: conte até o maior e tire os que ficam até o menor. Múltiplos de 7 entre 20 e 50: 7 − 2 = 5 (21, 28, 35, 42, 49).',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Quantos múltiplos cabem até 50', 'cabecalho': ['Número', 'Os múltiplos', 'Quantos'],
                   'linhas': [['5', '5, 10, ..., 50', '10'], ['7', '7, 14, ..., 49', '7'], ['12', '12, 24, 36, 48', '4']]},
        'exercicios': [
            {'enunciado': 'Quantos múltiplos de 9 há de 1 a 100?', 'alternativas': ['11', '12', '10', '9'], 'certa': 0,
             'resolucao': '11: 100 ÷ 9 = 11,1 e 9 · 11 = 99; 9 · 12 = 108 passa de 100.\n12 arredonda 11,1 para cima; 10 é 100 ÷ 10; 9 é o próprio número.'},
            {'enunciado': 'Quantos múltiplos de 6 ficam entre 20 e 80?', 'alternativas': ['10', '13', '11', '9'], 'certa': 0,
             'resolucao': '10: até 79 cabem 13 (6 · 13 = 78) e até 20 cabem 3 (18); 13 − 3 = 10.\n13 esquece de tirar os de 20 para baixo; 11 e 9 erram por 1 ao contar degraus.'},
        ],
    },
}

for _q in Q:
    assert len(_q['ideia']) <= 300, (_q['id'], len(_q['ideia']))
    assert len(_q['alts']) == 5
    for _l, _v in _q['dados']:
        assert len(_v) <= 60, (_q['id'], _v)
assert len(Q[0]['enunciado']) >= 600 and len(Q[2]['enunciado']) >= 400
for _k in ANTES_NOVOS:
    for _l in ANTES_NOVOS[_k]['linhas']:
        assert len(_l) <= 170, (len(_l), _l)
    for _e in ANTES_NOVOS[_k]['exercicios']:
        assert _e['alternativas'][_e['certa']].split()[0] in _e['resolucao'].split('\n')[0]
