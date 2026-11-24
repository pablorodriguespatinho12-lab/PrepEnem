"""Aritmética e Porcentagem (1º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (MANTER: custo com 3 partes que mudam), b = ITA/IME (quantas trocas até a mistura enfraquecer),
c = Fuvest (3 parcelas iguais com entrada, juros só sobre o saldo), d = Harvard-MIT (contagem de totais inteiros).
Aritmética é o 1º degrau: não há degrau anterior e nenhum conteúdo de degrau posterior é usado (sem Equações, sem Combinatória).
Toda resposta é conferida por conta Python (assert) neste módulo.
"""
ARQUIVO = 'matematica-aritmetica-novas.json'
T = 'Aritmética e Porcentagem'
INTRO = 'Cada fórmula é explicada, com números, no passo em que for usada. Aqui você só vê o nome dela. O ponto · significa vezes.'

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
        id='d2-escada-mat-ita-ari-00b', materia='Matemática', tema=T, calc=8,
        canal='mat-04-porcentagem.txt [2:09:00] (cada variação percentual é um fator que se multiplica, 1,2 e 0,8); mistura e diluição: fora do canal',
        ancora='parcial · IME 2022 2ª fase q.1 (texto seco em que a ideia escondida vale mais que a conta; aqui, o fator por troca); não há real de diluição no repositório',
        antes=['porcentagem', 'fracoes', 'multiplicar-decimais'], intro_formulas=INTRO,
        enunciado=('Um tanque de 40 L contém uma mistura de álcool e água com 80% de álcool. Em cada operação, retiram-se 10 L da mistura, bem mexida, '
                   'e o tanque é completado com 10 L de água pura. A operação se repete até que o álcool passe a ser 10% ou menos do volume da mistura. '
                   'Qual é o menor número de operações necessário?'),
        dados=[('Tanque', '40 L, sempre cheio'), ('Álcool no início', '80%'), ('Cada operação', 'sai 10 L e entra 10 L de água'), ('Parar quando', 'álcool for 10% ou menos')],
        alts=[('4', 4, 'Tirou 20 pontos (25% de 80) em toda operação: 70 ÷ 20 = 3,5, arredondado para 4'),
              ('6', 6, 'Achou que sai 1/3 do álcool (10 L de 30 L): com fator 2/3, a 6ª operação já chega a 10% ou menos'),
              ('7', 7, 'Parou na 7ª, com 10,68%, achando que é "quase 10"'),
              ('8', 8, 'OK'),
              ('10', 10, 'Juntou 10 L de água a 40 L sem retirar nada (fator 40 ÷ 50 = 0,8): só passa de 10% na 10ª')],
        resumo='Cada operação deixa 3/4 do álcool: 80 → 60 → 45 → 33,75 → 25,31 → 18,98 → 14,24 → 10,68 (7ª, ainda mais de 10%) → 8,01 (8ª). N = 8.',
        ideia='Cada operação tira 1/4 da mistura e, junto, 1/4 do álcool; a água que entra não tem álcool. Então a % de álcool é multiplicada por 0,75 a cada vez, e não diminui sempre os mesmos pontos.',
        pecas=[('Mistura bem mexida', 'O que sai tem a mesma % de álcool do tanque. Por isso sai 1/4 do álcool quando sai 1/4 da mistura.')],
        formulas=[('porcentagem', 'Ficar com 3/4', 'sobra = antes · 0,75'), ('porcentagem', 'Fração que sai', '10 L ÷ 40 L = 1/4')],
        eq='T · F · F · … · F ≤ 10', leitura='álcool no início, vezes 0,75 uma vez por troca, até ficar 10 ou menos; N é quantos F aparecem',
        letras=[('N', 'número de operações: quantos F aparecem na conta (o que a questão quer)'), ('T', 'álcool no início, em %'), ('F', 'o que sobra do álcool a cada operação')],
        eq_texto='A cada operação a % de álcool é multiplicada por F. Depois de N operações é T · F · F · … · F, com N fatores F. Procuro o menor N que deixa a conta em 10 ou menos.\nAgora é só achar T e F.',
        achando=[('Achando T: o álcool no início', 'O tanque começa com 80% de álcool: T = 80.\nO tanque está sempre com 40 L. Por isso a % de álcool anda junto com a quantidade de álcool: se o álcool vai a 3/4, a % vai a 3/4 também.'),
                 ('Achando F: o que sobra a cada operação', 'Saem 10 L de 40 L: 10 ÷ 40 = 1/4 da mistura. Está bem mexida, então sai 1/4 do álcool junto. A água que entra não tem álcool. Sobram 3/4 = 0,75: F = 0,75.\nExemplo: 80 − 1/4 de 80 = 80 − 20 = 60, o mesmo que 80 · 0,75. Cuidado: não são sempre 20 pontos. A 2ª operação tira 1/4 de 60, que é 15.')],
        volta='Multiplico por 0,75 a cada operação e guardo 2 casas, pois só quero saber se passou de 10.\n1ª: 80 · 0,75 = 60. 2ª: 60 · 0,75 = 45. 3ª: 45 · 0,75 = 33,75.\n4ª: 33,75 · 0,75 = 25,3125, uns 25,31. 5ª: 25,31 · 0,75 = 18,98. 6ª: 18,98 · 0,75 = 14,24.\n7ª: 14,24 · 0,75 = 10,68. Ainda é MAIS de 10%, não vale.\n8ª: 10,68 · 0,75 = 8,01. Agora é menos de 10%. N = 8.\nResposta: alternativa X.',
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
        antes=['porcentagem', 'multiplicar-decimais', 'dividir-por-decimal', 'numero-que-falta'], intro_formulas=INTRO,
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
        origem=['Com juros de 10% ao mês, R$ 100 de hoje viram R$ 110 em 30 dias (100 · 1,1) e R$ 121 em 60 dias (110 · 1,1). O que se paga hoje custa mais, no dia 60, do que o que se paga só no dia 60. Por isso comparo tudo no dia 60, o último.',
                'Uma parcela paga hoje vira P · 1,1 · 1,1 no dia 60. Uma paga no dia 30 vira P · 1,1. A do dia 60 vale P. E os R$ 3 310 à vista, parados até o dia 60, virariam 3 310 · 1,1 · 1,1. As duas somas têm de dar o mesmo. A entrada não paga juros por si; ela só conta como dinheiro que já saiu da mão do cliente.'],
        eq='P · K = V', leitura='parcela · (soma dos fatores) = preço à vista levado ao dia 60',
        letras=[('P', 'valor de cada parcela, em R$ (o que a questão quer)'), ('K', 'soma dos fatores de cada parcela até o dia 60'), ('V', 'preço à vista levado ao dia 60, em R$')],
        eq_texto='No dia 60, as três parcelas valem P · 1,21 + P · 1,1 + P, que é P · (1,21 + 1,1 + 1) = P · K. Isso tem de ser igual a V, o preço à vista levado ao dia 60.\nAgora é só achar K e V.',
        achando=[('Achando K: a soma dos fatores', '1ª parcela (hoje): ×1,1 duas vezes, 1,1 · 1,1: sem vírgulas, 11 · 11 = 121; há 1 + 1 = 2 casas: 1,21.\n2ª parcela (30 dias): ×1,1.\n3ª parcela (60 dias): ×1.\nK = 1,21 + 1,1 + 1: 1,21 + 1,10 = 2,31 e 2,31 + 1 = 3,31.'),
                 ('Achando V: o preço à vista no dia 60', 'V = 3 310 · 1,21. Sem vírgulas: 3 310 · 121 = 331 000 + 66 200 + 3 310 = 400 510 (3 310 · 100, 3 310 · 20 e 3 310 · 1). Há 2 casas, então V = 4 005,10 = 4 005,1.')],
        volta='P · 3,31 = 4 005,1. Quero P: desfaço o × 3,31 dividindo.\nP = 4 005,1 ÷ 3,31. Multiplico os dois por 100 para sumir a vírgula: 400 510 ÷ 331.\n331 · 1 000 = 331 000; sobram 69 510. 331 · 200 = 66 200; sobram 3 310. 331 · 10 = 3 310; sobra 0. P = 1 000 + 200 + 10 = 1 210.\nConferindo: saldo 3 310 − 1 210 = 2 100; 2 100 · 1,1 = 2 310, menos 1 210 = 1 100; 1 100 · 1,1 = 1 210, menos 1 210 = 0.\nResposta: alternativa X.',
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
        antes=['porcentagem', 'fracoes', 'ari-multiplos'], intro_formulas=INTRO,
        enunciado=('Ana, Bia e Caio guardam figurinhas, cada um com uma quantidade inteira. Ana tem 20% a mais do que Bia, e Bia tem 25% a menos do que Caio. '
                   'Juntos, eles têm mais de 100 e menos de 400 figurinhas. Quantos valores diferentes o total de figurinhas pode ter?'),
        dados=[('Ana', '20% a mais que Bia'), ('Bia', '25% a menos que Caio'), ('Total dos três', 'mais de 100 e menos de 400'), ('Quantidades', 'todas inteiras')],
        alts=[('5', 5, 'Fez (399 − 100) ÷ 53 = 5,6 e ficou com 5, sem somar 1 (contou degraus, não números)'),
              ('6', 6, 'OK'),
              ('7', 7, 'Contou os múltiplos de 53 até 399 e não tirou o 53, que não passa de 100'),
              ('8', 8, 'Arredondou 400 ÷ 53 = 7,5 para cima e contou o 424, que passa de 400'),
              ('19', 19, 'Contou os valores de Caio (múltiplos de 20 até 399) e não ligou ao total')],
        resumo='Caio = 20 · k, Bia = 15 · k, Ana = 18 · k, total = 53 · k. Múltiplos de 53 de 100 a 400: 106, 159, 212, 265, 318, 371 (k = 2 a 7). Conta: 7 − 1 = 6.',
        ideia='Para as três quantidades serem inteiras, Caio precisa ser múltiplo de 20, e o total vira sempre 53 vezes um número. A porcentagem esconde a divisibilidade: a pergunta vira contar múltiplos de 53 na faixa.',
        pecas=[('Quantidade inteira', 'Ninguém tem figurinha pela metade. 75% de Caio só é inteiro se Caio for múltiplo de 4, e assim por diante.'),
               ('Múltiplo de 53', 'Um número que é 53 vezes um inteiro: 53, 106, 159, 212...')],
        formulas=[('porcentagem', 'p% a mais', 'novo = antigo · (1 + p ÷ 100)'), ('porcentagem', 'p% a menos', 'novo = antigo · (1 − p ÷ 100)'), ('contagem', 'Múltiplos entre dois valores', 'quantos até o maior − quantos até o menor')],
        eq='N = M − L', leitura='totais possíveis = múltiplos de S que cabem abaixo de 400 − múltiplos de S que ficam até 100',
        letras=[('N', 'quantos totais diferentes são possíveis (o que a questão quer)'), ('S', 'o menor total possível, em figurinhas'), ('M', 'quantos múltiplos de S ficam abaixo de 400'), ('L', 'quantos múltiplos de S ficam até 100 (não valem)')],
        eq_texto='Se todo total possível é múltiplo de S, o número de totais é a quantidade de múltiplos de S na faixa. Conto os que cabem abaixo de 400 (M) e tiro os que ficam até 100 (L).\nAgora é só achar S, M e L.',
        achando=[('Achando S: o menor total possível', 'Caio tem C. Bia tem 75% = 3/4 de C, então C é múltiplo de 4: C = 4 · m e Bia = 3 · m.\nAna tem 20% a mais que Bia: 1,2 = 12/10 = 6/5, então Ana = Bia ÷ 5 · 6. Bia, 3 · m, tem de ser múltiplo de 5. Teste: m = 1, 2, 3, 4 dão 3, 6, 9, 12 (não); m = 5 dá 15 (sim).\nSó m = 5, 10, 15... servem. Com m = 5: Caio 20, Bia 15, Ana 15 ÷ 5 · 6 = 18. Total 20 + 15 + 18 = 53. Com m = 10: 40, 30, 36, total 106 = 2 · 53. S = 53.'),
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

MANTER = {
    'd2-escada-mat-ita-ari-00a': {
        'ancora': 'forte · Fuvest 2024 1ª fase q.33, prova V (custo por componente com variação percentual de cada um, em 2 tabelas)',
        'canal': 'mat-04-porcentagem.txt [2:12:32] (fator 1,2 e 0,8)',
        'antes': ['porcentagem', 'multiplicar-decimais'],
    },
}

ANTES_NOVOS = {
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
assert len(Q[1]['enunciado']) >= 400
for _l in ANTES_NOVOS['ari-multiplos']['linhas']:
    assert len(_l) <= 170, (len(_l), _l)
for _e in ANTES_NOVOS['ari-multiplos']['exercicios']:
    assert _e['alternativas'][_e['certa']].split()[0] in _e['resolucao'].split('\n')[0]
