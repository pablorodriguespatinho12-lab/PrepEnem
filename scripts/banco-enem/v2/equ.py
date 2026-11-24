"""Equações e Sistemas (4º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (REESCRITA: torrefação com quebra de peso e margem sobre a venda, x nos dois lados), b = ITA (TROCA: dois sistemas com o mesmo
conjunto solução, o I é uma reta), c = Fuvest (MANTER: tarifas por partes, "estritamente" dá 93), d = Harvard-MIT (TROCA: coeficientes
que também são raízes, com o caso s = t; soma dos s = 7).
Só junta os degraus 1 (Aritmética e Porcentagem), 2 (Grandezas e Medidas) e 3 (Estatística: média ponderada do custo da mistura).
Toda resposta é conferida por conta Python (assert) neste módulo, para o sistema e as raízes por força bruta.
"""
from fractions import Fraction as F

ARQUIVO = 'matematica-acima-novas.json'
T = 'Equações e Sistemas'

# ---------------------------------------------------------------- a) ENEM: torrefação
def custo_a(x):          # R$: x kg de A a 36 e (100 - x) kg de B a 24
    return 36 * x + 24 * (100 - x)


def torrado_a(x):        # kg depois da quebra: A perde 20%, B perde 25%
    return F(80, 100) * x + F(75, 100) * (100 - x)


def pacotes_a(x):        # pacotes de 250 g = 4 por kg
    return 4 * torrado_a(x)


def receita_a(x):        # R$ 12,50 por pacote
    return F(25, 2) * pacotes_a(x)


# formas fechadas que a explicação escreve
for _x in (0, 10, 20, 60, 100):
    assert custo_a(_x) == 2400 + 12 * _x
    assert torrado_a(_x) == 75 + F(5, 100) * _x
    assert pacotes_a(_x) == 300 + F(2, 10) * _x
    assert receita_a(_x) == 3750 + F(5, 2) * _x
assert custo_a(10) == 2520 and custo_a(20) == 2640 and 36 * 10 == 360 and 24 * 90 == 2160
assert F(8, 10) * 10 == 8 and F(75, 100) * 90 == F(135, 2) and 8 + F(135, 2) == F(151, 2) == F(755, 10)  # 75,5 kg
assert pacotes_a(10) == 302 and receita_a(10) == 3775 and F(25, 2) * 302 == 3775
# a equação: custo = 80% da receita (lucro de 20% da receita); f é afim com inclinação diferente de zero, então a raiz é única
f_a = lambda x: F(8, 10) * receita_a(x) - custo_a(x)  # noqa: E731
assert f_a(0) == 600 and f_a(1) - f_a(0) == -10
x_a = -f_a(0) / (f_a(1) - f_a(0))
assert x_a == 60
assert (custo_a(60), torrado_a(60), pacotes_a(60), receita_a(60)) == (3120, 78, 312, 3900)
assert receita_a(60) - custo_a(60) == 780 == F(20, 100) * receita_a(60)
assert F(8, 10) * 3750 == 3000 and F(8, 10) * F(5, 2) == 2 and 12 - 2 == 10 and 3000 - 2400 == 600
# distratores
assert 100 - x_a == 40                                                    # kg do tipo B
assert torrado_a(x_a) == 78                                               # massa torrada, não pedida
rec_b = F(25, 2) * 4 * F(8, 10) * 100                                      # quebra de 20% nos dois tipos: receita fixa 4 000
assert rec_b == 4000 and round(float((F(8, 10) * rec_b - 2400) / 12)) == 67 and abs(float((F(8, 10) * rec_b - 2400) / 12) - 66.6667) < 1e-3
x_c = (3750 - F(12, 10) * 2400) / (F(12, 10) * 12 - F(5, 2))                # margem de 20% sobre o custo: receita = 1,2 · custo
assert round(float(x_c)) == 73 and abs(float(x_c) - 73.11) < 0.01
# "Sua vez": custo R$ 80 e lucro de 20% da venda
assert F(80) / F(8, 10) == 100 and 80 * F(12, 10) == 96 and 80 * F(8, 10) == 64
ENUN_A = ('Uma torrefação artesanal prepara, a cada lote, 100 kg de grãos crus de café, misturando dois tipos. Na torra o grão perde massa porque a água '
          'evapora, e essa perda, chamada quebra, é diferente em cada tipo, como mostra a tabela. Depois da torra, todo o café do lote é embalado em '
          'pacotes de 250 g, vendidos a R$ 12,50 cada um. O dono quer que o lucro do lote seja de 20% da receita, isto é, de 20% de tudo que entra com '
          'a venda dos pacotes (e não 20% do custo dos grãos). O frete de R$ 150 da entrega dos pacotes foi pago pelo comprador e não entra nas contas '
          'da torrefação.\n\n'
          'Tipo | Preço do kg cru | Quebra na torra\n'
          'A | R$ 36,00 | 20%\n'
          'B | R$ 24,00 | 25%\n\n'
          'Quantos quilogramas do tipo A devem entrar no lote de 100 kg de grãos crus?')
assert len(ENUN_A) >= 600, len(ENUN_A)
assert 'operários' not in ENUN_A

# ---------------------------------------------------------------- b) ITA: sistemas com o mesmo conjunto solução
# I: x + 2y + z = 4; 2x + 3y - z = 1; 3x + 5y = 5  ->  (x, y, z) = ((5 - 5t)/3, t, (7 - t)/3)
def pontoI(t):
    t = F(t)
    return ((5 - 5 * t) / 3, t, (7 - t) / 3)


for _t in (-7, -2, 0, 1, 3, 4, F(1, 2), 10):
    x, y, z = pontoI(_t)
    assert x + 2 * y + z == 4 and 2 * x + 3 * y - z == 1 and 3 * x + 5 * y == 5
assert pontoI(0) == (F(5, 3), 0, F(7, 3)) and pontoI(1) == (0, 1, 2) and pontoI(3) == (F(-10, 3), 3, F(4, 3)) and pontoI(4) == (-5, 4, 1)
# as duas primeiras somadas dão a terceira (a 3ª não traz nada novo) e a solução é mesmo uma reta
assert (1 + 2, 2 + 3, 1 - 1, 4 + 1) == (3, 5, 0, 5)
# força bruta em grade racional: toda solução de I é da forma pontoI(t)
for _y in [F(a, 3) for a in range(-12, 13)]:
    for _x in [F(a, 3) for a in range(-12, 13)]:
        _z = 4 - _x - 2 * _y
        if 2 * _x + 3 * _y - _z == 1 and 3 * _x + 5 * _y == 5:
            assert (_x, _y, _z) == pontoI(_y)
# m e n: a 2ª de II tem de valer em t = 0 e em t = 1 (conta de 1º grau em t: vale em dois, vale em todos)
n_b = F(33 - 5, 7)
assert n_b == 4 and F(5, 3) + n_b * F(7, 3) == 11
m_b = 11 - 2 * n_b
assert m_b == 3 and 0 + m_b * 1 + n_b * 2 == 11
for _t in (-5, 0, 1, 2, 9, F(1, 3)):
    x, y, z = pontoI(_t)
    assert x + m_b * y + n_b * z == 11                                     # vale em toda a reta
# k: 3ª de II, k·x + y - z = m - n = -1; t = 0 dá k·5/3 - 7/3 = -1
k_b = (F(-1) + F(7, 3)) / F(5, 3)
assert k_b == F(4, 5) and F(5, 3) * k_b == F(4, 3) and 5 * k_b == 4
for _t in (-9, -1, 0, 1, 2, 3, 7, F(2, 5)):
    x, y, z = pontoI(_t)
    assert k_b * x + y - z == m_b - n_b == -1                              # a reta inteira satisfaz a 3ª de II
assert k_b * F(-10, 3) + 3 - F(4, 3) == -1 and F(4, 5) * F(-10, 3) == F(-8, 3)
# II tem de ter EXATAMENTE a reta (posto 2): linhas (1,2,1) e (1,m,n) = (1,3,4) não são proporcionais
assert (1 * 3 - 2 * 1, 1 * 4 - 1 * 1) != (0, 0)
# k é único: qualquer outro k falha em algum ponto da reta
for _k in (F(3, 5), F(5, 4), F(2), F(28, 5), F(1), F(3)):
    assert any(_k * pontoI(_t)[0] + pontoI(_t)[1] - pontoI(_t)[2] != -1 for _t in (0, 1, 2, 3)), _k
# distratores
assert F(5, 4) == 1 / k_b                                                  # razão invertida
assert F(3, 5) == 3 / F(5)                                                 # coeficiente de t sem o termo do z: -5k/3 + 1 = 0
assert (F(1) + F(7, 3)) / F(5, 3) == 2                                     # t = 0 com lado direito +1 (n - m)
assert (F(7) + F(7, 3)) / F(5, 3) == F(28, 5) and m_b + n_b == 7           # lado direito m + n
# "Sua vez": x + y = 7 e 3x + 3y = 21; com y = t, x = 7 - t
assert all((7 - t) + t == 7 and 3 * (7 - t) + 3 * t == 21 for t in range(-3, 6))
ENUN_B = ('Considere os sistemas lineares abaixo, nas incógnitas reais x, y e z, em que m, n e k são constantes reais.\n'
          '(I)  x + 2y + z = 4,  2x + 3y − z = 1,  3x + 5y = 5.\n'
          '(II)  x + 2y + z = 4,  x + my + nz = 11,  kx + y − z = m − n.\n'
          'Sabendo que (I) e (II) têm exatamente o mesmo conjunto solução, o valor de k é:')
assert 250 <= len(ENUN_B) <= 400, len(ENUN_B)

# ---------------------------------------------------------------- c) Fuvest (MANTER): tarifas por partes
def plano_a(t):
    return F(30) + F(3, 4) * max(0, t - 60)


def plano_b(t):
    return F(54) + F(1, 2) * max(0, t - 120)


assert min(t for t in range(0, 1000) if plano_b(t) < plano_a(t)) == 93
assert plano_a(92) == plano_b(92) == 54 and plano_a(93) == F(219, 4) and plano_b(93) == 54
assert all(plano_b(t) < plano_a(t) for t in range(93, 1000))

# ---------------------------------------------------------------- d) Harvard-MIT: coeficientes que também são raízes
# r, s, t ≠ 0: s e t são raízes de x² + r x + s; 3 é raiz de x² + t x + r. Pede a soma dos valores possíveis de s.
# força bruta: r sai de 3 ser raiz (9 + 3t + r = 0); procura s, t inteiros e depois racionais com denominador até 4
achados = set()
for _den in (1, 2, 3, 4):
    faixa = [F(a, _den) for a in range(-60 * _den, 60 * _den + 1) if a != 0]
    for _t in faixa:
        _r = -9 - 3 * _t
        if _r == 0:
            continue
        for _s in faixa:
            if _s * _s + _r * _s + _s == 0 and _t * _t + _r * _t + _s == 0:
                achados.add((_r, _s, _t))
assert achados == {(F(-12), F(11), F(1)), (F(3), F(-4), F(-4))}, achados
assert sum(s for _, s, _ in achados) == 7
# álgebra: r = -s - 1 (s ≠ 0) e r = -9 - 3t  =>  s = 3t + 8; depois t² + r t + s = -2t² - 6t + 8 = 0  =>  t² + 3t - 4 = (t - 1)(t + 4)
for _t in (-4, 1):
    _s, _r = 3 * _t + 8, -9 - 3 * _t
    assert _r == -_s - 1 and _t * _t + _r * _t + _s == 0 and -2 * _t * _t - 6 * _t + 8 == 0
assert 36 + 4 * 2 * 8 == 100 and (-6) ** 2 - 4 * (-2) * 8 == 100         # discriminante 100: só duas raízes em t
assert (3 * 1 + 8, 3 * -4 + 8) == (11, -4) and 11 + -4 == 7
# o caso t = 2 do exemplo numérico não serve; o exemplo s = 5 dá r = -6
assert 2 * 2 + (-9 - 6) * 2 + (3 * 2 + 8) == 4 - 30 + 14 == -12
assert 25 + (-6) * 5 + 5 == 0
# conferências da volta: polinômios dos dois casos
assert (1 - 12 + 11 == 0 and 121 - 132 + 11 == 0 and 9 + 3 - 12 == 0)       # x² - 12x + 11 (raízes 1 e 11); x² + x - 12 em 3
assert (1 + 3 - 4 == 0 and 16 - 12 - 4 == 0 and 9 - 12 + 3 == 0)            # x² + 3x - 4 (raízes 1 e -4); x² - 4x + 3 em 3
# distratores
assert -12 + 3 == -9                                                       # soma dos r
assert 11 - (-4) == 15                                                     # subtraiu
# "Sua vez": 2 é raiz de x² + p x + 6  =>  p = -5
assert 4 + 2 * -5 + 6 == 0
ENUN_D = ('Os números reais r, s e t são todos diferentes de zero. Cada um dos números s e t é raiz de x² + rx + s, e o número 3 é raiz de '
          'x² + tx + r. Qual é a soma de todos os valores possíveis de s?')
assert 150 <= len(ENUN_D) <= 360, len(ENUN_D)

tabela = lambda titulo, cab, linhas: {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}  # noqa: E731

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-equ-00a', materia='Matemática', tema=T, calc=60,
        enunciado=ENUN_A,
        dados=[('Lote', '100 kg de grão cru, x kg do tipo A e o resto do B'), ('Tipo A', 'R$ 36 por kg cru, perde 20% na torra'),
               ('Tipo B', 'R$ 24 por kg cru, perde 25% na torra'), ('Venda', 'pacotes de 250 g a R$ 12,50'),
               ('Lucro', '20% da receita (da venda)'), ('Quero', 'kg do tipo A no lote')],
        alts=[('40 kg', 40, 'Respondeu os kg do tipo B: 100 − 60'),
              ('60 kg', 60, 'OK'),
              ('67 kg', 66.667, 'Usou quebra de 20% nos dois tipos: receita fixa de 4 000 e 0,8 · 4 000 = 2 400 + 12x'),
              ('73 kg', 73.11, 'Fez o lucro de 20% sobre o custo: receita = 1,2 · custo'),
              ('78 kg', 78, 'Respondeu a massa torrada (75 + 0,05 · 60), que não foi pedida')],
        resumo='Custo = 36x + 24 · (100 − x) = 2 400 + 12x. Torrado = 75 + 0,05x kg = 300 + 0,2x pacotes. Receita = 3 750 + 2,5x. Custo = 0,8 · receita: x = 60.',
        ideia='A margem de 20% é sobre a venda, então o custo é 80% da receita. Como a quantidade de pacotes também depende de x, ele aparece nos dois lados da equação.',
        pecas=[('Quebra', 'Massa que o grão perde na torra. Quebra de 20% deixa 80% da massa.'),
               ('Margem sobre a venda', 'Lucro de 20% da receita: sobra 80% da receita para pagar o custo.')],
        formulas=[('porcentagem', 'Margem sobre a venda', 'custo = 0,8 · receita'), ('media', 'Custo da mistura', 'soma de preço · kg de cada tipo'),
                  ('texto', 'Gramas em quilos', '1 kg = 4 pacotes de 250 g')],
        eq='G = 0,8 · V', leitura='custo dos grãos = 80% da receita (os outros 20% são o lucro)',
        letras=[('x', 'kg do tipo A no lote (o que a questão quer)'), ('G', 'gasto com os grãos do lote, em reais'),
                ('P', 'pacotes de 250 g vendidos'), ('V', 'receita da venda, em reais')],
        eq_texto='O lucro é 20% da receita, então o gasto é os outros 80%. G e V dependem de x.\nAgora é só achar G, P e V, uma por vez.',
        achando=[('Achando G: o gasto com os grãos',
                  'Com 10 kg de A e 90 kg de B: 36 · 10 = 360 e 24 · 90 = 2 160, total 2 520. Com x kg de A sobram 100 − x kg de B. G = 36x + 24 · (100 − x) = 36x + 2 400 − 24x = 2 400 + 12x. É uma média ponderada: cada preço pesa pelos seus quilos.',
                  tabela('Gasto com o lote', ['Kg de A', 'Kg de B', 'Gasto (R$)'], [['10', '90', '2 520'], ['20', '80', '2 640'], ['x', '100 − x', '2 400 + 12x']])),
                 ('Achando P: os pacotes',
                  'Com 10 kg de A e 90 kg de B: A perde 20%, sobra 0,8 · 10 = 8 kg; B perde 25%, sobra 0,75 · 90 = 67,5 kg; juntos 75,5 kg. Com x: 0,8x + 0,75 · (100 − x) = 75 + 0,05x kg. 1 kg tem 4 pacotes de 250 g: P = 4 · (75 + 0,05x) = 300 + 0,2x.'),
                 ('Achando V: a receita',
                  'Cada pacote rende R$ 12,50. Com x = 10: P = 302 pacotes e V = 12,5 · 302 = 3 775. Com x: V = 12,5 · (300 + 0,2x) = 3 750 + 2,5x (12,5 · 300 = 3 750 e 12,5 · 0,2 = 2,5). O frete de R$ 150 não entra: quem pagou foi o comprador.')],
        volta='O lucro é 20% da receita, então o gasto é 80%: G = 0,8 · V.\n2 400 + 12x = 0,8 · (3 750 + 2,5x) = 3 000 + 2x (0,8 · 3 750 = 3 000 e 0,8 · 2,5 = 2).\nTire 2x e 2 400 dos dois lados: 12x − 2x = 3 000 − 2 400, 10x = 600, x = 60 kg.\nConferindo: G = 2 400 + 720 = 3 120; 78 kg torrados são 312 pacotes; V = 3 900; lucro 780 = 20% de 3 900.\nResposta: alternativa X.',
        valores=[('x', '60 kg'), ('G', 'R$ 3 120 com x = 60'), ('P', '312 pacotes com x = 60'), ('V', 'R$ 3 900 com x = 60')],
        pista='"20% da receita" é lucro sobre a venda: custo = 80% da receita. Ache custo, pacotes e receita em função de x e iguale.',
        rec1='lote de 100 kg: A e B, quebras 20% e 25%, pacote de 250 g a R$ 12,50', rec3='G = 2 400 + 12x; P = 300 + 0,2x; V = 3 750 + 2,5x; x = 60',
        checagem=('Um produto custa R$ 80. Para ter lucro de 20% da venda, por quanto deve ser vendido?',
                  ['R$ 100', 'R$ 96', 'R$ 64', 'R$ 120'], 'R$ 100',
                  'O custo é 80% da venda: 80 ÷ 0,8 = 100. R$ 96 é o lucro de 20% sobre o custo (80 · 1,2).'),
        ancora='parcial · ENEM 2023 q.158 (caderno 7: pescador com 4% da receita repartida e número mínimo achado por teste; texto de 750 letras); aqui a margem é sobre a venda, a quebra muda a massa vendida e o x aparece nos dois lados da equação',
        canal='mat-04-porcentagem.txt [2:14:31] (lucro em %, custo e preço de venda: ache o custo e o preço com um fator)',
        antes=['porcentagem', 'multiplicar-decimais', 'numero-que-falta', 'equ-margem-sobre-a-venda'],
    ),
    dict(
        id='d2-escada-mat-ita-equ-00b', materia='Matemática', tema=T, calc=0.8,
        enunciado=ENUN_B,
        dados=[('Sistema I', 'x + 2y + z = 4; 2x + 3y − z = 1; 3x + 5y = 5'), ('Sistema II', 'x + 2y + z = 4; x + my + nz = 11; kx + y − z = m − n'),
               ('Condição', 'I e II têm o mesmo conjunto solução'), ('Quero', 'k')],
        alts=[('3/5', 0.6, 'Na 3ª equação, esqueceu o termo −z no coeficiente de t: −5k/3 + 1 = 0'),
              ('4/5', 0.8, 'OK'),
              ('5/4', 1.25, 'Inverteu a razão: de 5k = 4 escreveu k = 5/4'),
              ('2', 2, 'Usou t = 0 com o lado direito trocado: 5k/3 − 7/3 = +1, em vez de −1'),
              ('28/5', 5.6, 'Usou m + n = 7 no lado direito, em vez de m − n')],
        resumo='I é uma reta: (x, y, z) = ((5 − 5t)/3, t, (7 − t)/3). Em II: t = 0 dá n = 4, t = 1 dá m = 3, e a 3ª dá k · 5/3 − 7/3 = −1, então k = 4/5.',
        ideia='Somando as duas primeiras equações de I sai a terceira: I não é um ponto, é uma reta de soluções. Para II ter a mesma reta, os pontos dela têm que servir em II, e isso fixa m, n e k.',
        pecas=[('Sistema indeterminado', 'Tem infinitas soluções. Aqui são os pontos de uma reta, um para cada valor de t.'),
               ('Mesmo conjunto solução', 'Todo ponto de I serve em II. Como II não pode ter mais pontos, ela também é uma reta.')],
        formulas=[('texto', 'Dar nome a uma letra', 'y = t, e as outras ficam em função de t'), ('texto', 'Conta do 1º grau em t', 'vale em 2 valores de t, vale em todos'),
                  ('porcentagem', 'Frações com o mesmo fundo', 'a/3 + b/3 = (a + b)/3')],
        eq='k · (5 − 5t)/3 + t − (7 − t)/3 = m − n',
        leitura='a 3ª equação de II, com as soluções de I no lugar de x, y e z',
        letras=[('k', 'constante da 3ª equação de II (o que a questão quer)'), ('t', 'nome dado ao y: cada t dá uma solução de I'),
                ('n', 'constante do z na 2ª equação de II'), ('m', 'constante do y na 2ª equação de II')],
        eq_texto='Todo ponto de I tem que servir em II. Escrevo a 3ª equação de II com as soluções de I (y = t).\nAgora é só achar t, n e m, uma por vez, e voltar nesta equação para achar k.',
        achando=[('Achando t: as soluções do sistema I',
                  'Some as duas primeiras equações de I: 3x + 5y + 0z = 5. É a 3ª equação, que não traz nada novo. Sobram 2 equações para 3 letras: há infinitas soluções.\nDê nome a y: y = t. Com t = 1: 3x + 5 = 5, x = 0 e z = 4 − 0 − 2 = 2.\nCom t qualquer: 3x = 5 − 5t, x = (5 − 5t)/3. E z = 4 − x − 2t = (12 − 5 + 5t − 6t)/3 = (7 − t)/3.',
                  tabela('Alguns pontos de I', ['t = y', 'x', 'z'], [['0', '5/3', '7/3'], ['1', '0', '2'], ['4', '−5', '1']])),
                 ('Achando n: o ponto t = 0',
                  'A 1ª equação de II é igual à 1ª de I: já vale. A 2ª, x + my + nz = 11, tem que valer em todo ponto de I.\nEm t = 0 (x = 5/3, y = 0, z = 7/3): 5/3 + n · 7/3 = 11. Multiplique por 3: 5 + 7n = 33, 7n = 28, n = 4.'),
                 ('Achando m: o ponto t = 1',
                  'Em t = 1 (x = 0, y = 1, z = 2): 0 + m · 1 + n · 2 = 11. Com n = 4: m + 8 = 11, m = 3.\nA conta em t é de 1º grau e vale em t = 0 e em t = 1, então vale em todo t.')],
        volta='Agora a 3ª equação de II: kx + y − z = m − n = 3 − 4 = −1.\nEm t = 0 (x = 5/3, y = 0, z = 7/3): k · 5/3 − 7/3 = −1. Então 5k/3 = −1 + 7/3 = 4/3 e 5k = 4, k = 4/5.\nConferindo em t = 3 (x = −10/3, y = 3, z = 4/3): 4/5 · (−10/3) + 3 − 4/3 = −8/3 + 9/3 − 4/3 = −3/3 = −1. Certo.\nResposta: alternativa X.',
        valores=[('k', '4/5'), ('t', 'y = t'), ('n', '4'), ('m', '3')],
        pista='"mesmo conjunto solução" e a 3ª equação de I é a soma das duas primeiras: I é uma reta. Dê nome a y e ponha os pontos da reta em II.',
        rec1='I é uma reta; y = t; pontos (5/3, 0, 7/3) e (0, 1, 2)', rec3='t = 0 dá n = 4; t = 1 dá m = 3; 3ª de II dá k = 4/5',
        checagem=('Os sistemas x + y = 7 e 3x + 3y = 21 têm as mesmas soluções. Com y = t, quanto vale x?',
                  ['7 − t', '7 + t', 't − 7', '21 − t'], '7 − t',
                  'x + y = 7 dá x = 7 − y = 7 − t. A 2ª equação é a 1ª vezes 3: não traz nada novo.'),
        ancora='parcial · ITA 2025 1ª fase Mat. q.7 (dois sistemas 3×3 equivalentes, o primeiro indeterminado); parcial porque a técnica é a mesma, mas aqui o lado direito da 3ª equação de II é m − n (depende de m e n) e a dificuldade fica na da real, não acima dela',
        canal='mat-11-funcao-afim-e-sistemas-lineares.txt [5:18:00] (sistema com infinitas soluções: as duas equações descrevem a mesma reta)',
        antes=['fracoes', 'numero-que-falta', 'equ-sistema-infinito'],
    ),
    dict(
        id='d2-escada-mat-ita-equ-00d', materia='Matemática', tema=T, calc=7,
        enunciado=ENUN_D,
        dados=[('Números', 'r, s, t reais, todos diferentes de zero'), ('Polinômio 1', 'x² + rx + s, com s e t como raízes'),
               ('Polinômio 2', 'x² + tx + r, com 3 como raiz'), ('Quero', 'soma de todos os valores possíveis de s')],
        alts=[('−9', -9, 'Somou os valores de r das duas soluções: −12 + 3'),
              ('−4', -4, 'Ficou só com o caso s = t: o s dele é −4'),
              ('7', 7, 'OK'),
              ('11', 11, 'Usou st = s, concluiu t = 1 e esqueceu o caso s = t'),
              ('15', 15, 'Subtraiu em vez de somar os dois valores: 11 − (−4)')],
        resumo='s raiz dá r = −s − 1; 3 raiz dá r = −9 − 3t; então s = 3t + 8. Com t raiz: t² + 3t − 4 = 0, t = 1 ou −4, s = 11 ou −4. Soma = 7.',
        ideia='Escreva que s, t e 3 são raízes e troque x por cada um: sai r em função de s e de t, e depois uma equação só em t. Cuidado com o caso em que s e t são o mesmo número: ele também vale.',
        pecas=[('Raiz', 'Número que, no lugar de x, zera o polinômio.'),
               ('Caso s = t', 'Se s e t são iguais, só se sabe que s é raiz; a outra raiz pode ser outro número.')],
        formulas=[('texto', 'Raiz zera o polinômio', 'se a é raiz, troque x por a: resultado 0'), ('texto', 'Dividir por s', 's ≠ 0 permite cortar um s da conta'),
                  ('texto', 'Dois números: soma e produto', 'x² + bx + c: soma −b, produto c')],
        eq='S = soma dos valores de s', leitura='cada valor possível de s vem de um valor possível de t',
        letras=[('S', 'soma de todos os valores possíveis de s (o que a questão quer)'), ('r', 'coeficiente r, que sai de s e de 3 serem raízes'),
                ('t', 'o número t, que decide os valores de s'), ('s', 'cada valor possível de s')],
        eq_texto='Cada valor de t que serve dá um valor de s. Somo todos os s.\nAgora é só achar r, t e s, uma por vez.',
        achando=[('Achando r: o que as raízes dizem',
                  'Se s ≠ 0 é raiz de x² + rx + s: s² + rs + s = 0. Divida por s: s + r + 1 = 0, então r = −s − 1 (com s = 5, r = −6: 25 − 30 + 5 = 0).\nSe 3 é raiz de x² + tx + r: 9 + 3t + r = 0, então r = −9 − 3t.\nIguale: −s − 1 = −9 − 3t, ou seja, s = 3t + 8.'),
                 ('Achando t: a equação só em t',
                  'Também t é raiz de x² + rx + s. Com t = 2 (r = −15, s = 14): 4 − 30 + 14 = −12, não dá zero.\nCom t qualquer, r = −9 − 3t e s = 3t + 8: t² + (−9 − 3t) · t + 3t + 8 = 0. Abrindo: t² − 9t − 3t² + 3t + 8 = −2t² − 6t + 8 = 0.\nDivida por −2: t² + 3t − 4 = 0. Somam −3 e multiplicam −4: 1 e −4. Então t = 1 ou t = −4.'),
                 ('Achando s: um valor para cada t',
                  'Com s = 3t + 8: t = 1 dá s = 11 e r = −12. t = −4 dá s = −4 e r = 3.\nNo 2º caso s = t = −4: é o caso que "st = s, logo t = 1" deixa escapar. Os dois valem: r, s e t são diferentes de zero.',
                  tabela('Os dois casos', ['t', 'r', 's', 'x² + rx + s', 'Raízes'], [['1', '−12', '11', 'x² − 12x + 11', '1 e 11'], ['−4', '3', '−4', 'x² + 3x − 4', '1 e −4']]))],
        volta='S = 11 + (−4) = 7.\nConferindo o 2º polinômio com raiz 3: x² + x − 12 em 3 dá 9 + 3 − 12 = 0. E x² − 4x + 3 em 3 dá 9 − 12 + 3 = 0.\nNo 2º caso as raízes de x² + 3x − 4 são 1 e −4: o −4 é s e também t.\nResposta: alternativa X.',
        valores=[('r', '−12 e 3'), ('t', '1 e −4'), ('s', '11 e −4'), ('S', '7')],
        pista='"s e t são raízes" e "3 é raiz": troque x por cada um, ache r e uma equação só em t. Confira o caso em que s e t são iguais.',
        rec1='raízes s, t e 3; r, s, t ≠ 0; pede a soma dos s', rec3='r = −s − 1 e r = −9 − 3t; t = 1 ou −4; s = 11 ou −4',
        checagem=('O número 2 é raiz de x² + px + 6. Quanto vale p?',
                  ['−5', '5', '−10', '−3'], '−5',
                  'Troque x por 2: 4 + 2p + 6 = 0, então 2p = −10 e p = −5.'),
        ancora='parcial · HMMT fev. 2024 Álgebra e Teoria dos Números q.1 (coeficientes que também são raízes e o caso s = t esquecido pela banca); parcial porque aqui o 3 muda a conta, a pergunta é a soma de todos os s e o caso s = t entra na resposta; sem real brasileira desta técnica',
        canal='mat-12-funcao-do-segundo-grau.txt [5:37:02] (raízes de x² + bx + c: dois números com soma e produto); o caso s = t é fora do canal',
        antes=['numero-que-falta', 'equ-raiz-de-equacao'],
    ),
]

MANTER = {
    'd2-escada-mat-ita-equ-00c': {
        'ancora': 'forte · Fuvest 2023 2ª fase dia 2 M01 item b (duas tarifas, uma delas por partes, e o intervalo em que uma fica mais barata); ENEM 2021 q.141 do caderno 7 (= q.176 do caderno 5) só pede montar a fórmula do preço; aqui a pegadinha é "estritamente" (93, não 92)',
        'canal': 'mat-11-funcao-afim-e-sistemas-lineares.txt [5:19:30] (ver onde as duas retas se encontram: o ponto comum das duas)',
        'antes': ['multiplicar-decimais', 'dividir-por-decimal', 'numero-que-falta'],
    },
}

ANTES_NOVOS = {
    'equ-margem-sobre-a-venda': {
        'titulo': 'Lucro sobre a venda e lucro sobre o custo',
        'linhas': [
            'Lucro de 20% sobre a venda: de cada R$ 100 que o cliente paga, R$ 20 são lucro e R$ 80 cobrem o custo.',
            'Então o custo é 80% da venda: custo = 0,8 · venda. Com custo de R$ 80, a venda é 80 ÷ 0,8 = 100.',
            'Lucro de 20% sobre o custo é outra conta: venda = 1,2 · custo. Com custo de R$ 80, a venda é 80 · 1,2 = 96.',
            'Leia com cuidado: "sobre a venda" (ou "da receita") e "sobre o custo" dão preços diferentes, 100 e 96.',
        ],
        'visual': tabela('Lucro de 20%, custo de R$ 80', ['Lucro', 'Conta', 'Venda'],
                         [['sobre a venda', 'custo = 0,8 · venda', 'R$ 100'], ['sobre o custo', 'venda = 1,2 · custo', 'R$ 96']]),
        'exercicios': [
            {'enunciado': 'Um produto custa R$ 60. Para ter lucro de 25% sobre a venda, por quanto vender?', 'alternativas': ['R$ 80', 'R$ 75', 'R$ 45', 'R$ 85'], 'certa': 0,
             'resolucao': 'R$ 80: o custo é 75% da venda, então 60 ÷ 0,75 = 80.\nR$ 75 é lucro de 25% sobre o custo (60 · 1,25); R$ 45 é 60 · 0,75; R$ 85 soma 25.'},
            {'enunciado': 'Uma venda de R$ 200 deu lucro de 10% da venda. Quanto custou?', 'alternativas': ['R$ 180', 'R$ 20', 'R$ 190', 'R$ 220'], 'certa': 0,
             'resolucao': 'R$ 180: o lucro é 10% de 200 = 20 e o custo é 200 − 20 = 180.\nR$ 20 é só o lucro; R$ 190 tira 10 reais e não 10%; R$ 220 soma o lucro.'},
        ],
    },
    'equ-sistema-infinito': {
        'titulo': 'Sistema com infinitas soluções',
        'linhas': [
            'Se uma equação é a outra "dobrada", ela não traz nada novo. x + y = 5 e 2x + 2y = 10 têm infinitas soluções.',
            'Dê um nome a uma letra: y = t. Então x = 5 − t. Cada t dá uma solução: t = 0 dá (5, 0); t = 1 dá (4, 1); t = 2 dá (3, 2).',
            'Para ver se outra equação vale em todas, teste dois valores de t (a conta em t é de 1º grau): se vale em dois, vale em todos.',
            'Exemplo: 3x + 3y = 15 vale em t = 0 (3 · 5 + 0 = 15) e em t = 1 (3 · 4 + 3 = 15). Então vale sempre.',
        ],
        'visual': tabela('As soluções de x + y = 5', ['t = y', 'x = 5 − t', 'Ponto'], [['0', '5', '(5, 0)'], ['1', '4', '(4, 1)'], ['2', '3', '(3, 2)']]),
        'exercicios': [
            {'enunciado': 'x + y = 7 e 3x + 3y = 21. Com y = t, quanto vale x?', 'alternativas': ['7 − t', '7 + t', 't − 7', '21 − t'], 'certa': 0,
             'resolucao': '7 − t: x + y = 7 dá x = 7 − y = 7 − t.\n7 + t soma em vez de tirar; t − 7 troca o lado; 21 − t usa a 2ª equação sem dividir por 3.'},
            {'enunciado': 'No mesmo sistema, qual é a solução com t = 2?', 'alternativas': ['(5, 2)', '(9, 2)', '(7, 2)', '(2, 5)'], 'certa': 0,
             'resolucao': '(5, 2): x = 7 − 2 = 5 e y = 2.\n(9, 2) soma 7 + 2; (7, 2) esquece de tirar t; (2, 5) troca x e y.'},
        ],
    },
    'equ-raiz-de-equacao': {
        'titulo': 'Raiz de uma equação',
        'linhas': [
            'Raiz é o número que, no lugar de x, deixa a conta igual a zero. Em x² − 5x + 6, o 2 é raiz: 4 − 10 + 6 = 0.',
            'Se o texto diz "3 é raiz de x² + tx + r", troque x por 3: 9 + 3t + r = 0. Vira uma equação nas outras letras.',
            'Para x² + 3x − 4 = 0, ache dois números que somam 3 e multiplicam −4: 4 e −1. Então (x + 4) · (x − 1) = 0.',
            'As raízes são os números que zeram cada parêntese: −4 e 1.',
        ],
        'visual': tabela('Testando x² − 5x + 6', ['x', 'Conta', 'Zerou?'], [['2', '4 − 10 + 6 = 0', 'sim'], ['3', '9 − 15 + 6 = 0', 'sim'], ['4', '16 − 20 + 6 = 2', 'não']]),
        'exercicios': [
            {'enunciado': '4 é raiz de x² + px − 8. Quanto vale p?', 'alternativas': ['−2', '2', '−6', '−4'], 'certa': 0,
             'resolucao': '−2: troque x por 4: 16 + 4p − 8 = 0, então 4p = −8 e p = −2.\n2 é o sinal trocado; −6 é 16 + 4p + 8 = 0; −4 esquece o −8.'},
            {'enunciado': 'Quais são as raízes de x² + 2x − 3 = 0?', 'alternativas': ['−3 e 1', '3 e −1', '−3 e −1', '2 e −3'], 'certa': 0,
             'resolucao': '−3 e 1: dois números que somam 2 e multiplicam −3 são 3 e −1, então (x + 3) · (x − 1) = 0.\n3 e −1 é o sinal trocado; −3 e −1 multiplica +3; 2 e −3 copia os coeficientes.'},
        ],
    },
}

# conferência das contas dos exercícios "Antes"
assert 60 / F(75, 100) == 80 and 60 * F(125, 100) == 75 and 60 * F(75, 100) == 45
assert 200 - 200 * F(10, 100) == 180
assert 16 + 4 * -2 - 8 == 0 and 4 - 10 + 6 == 0 and 9 - 15 + 6 == 0 and 16 - 20 + 6 == 2
assert (-3) ** 2 + 2 * -3 - 3 == 0 and 1 + 2 - 3 == 0 and 4 * -1 == -4 and 4 + -1 == 3 and 3 + -1 == 2 and 3 * -1 == -3
assert all(t * 3 + (7 - t) * 3 == 21 for t in range(5)) and 7 - 2 == 5

for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('equ-'), _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['resolucao'].split('\n')[0].count(_e['alternativas'][_e['certa']].split(' ')[0]) >= 1, _e['enunciado']
        assert len(set(_e['alternativas'])) == len(_e['alternativas'])
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), (_q['id'], [len(v) for _, v in _q['dados'] if len(v) > 60])
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), _q['id']
    assert len(_q['ideia']) <= 300, _q['id']
    assert all(l not in 'ABCDE' for l, _ in _q['letras']), _q['id']
    assert len({l for l, _ in _q['letras']}) == len(_q['letras'])
    assert all(len(o) <= 60 for o in _q['checagem'][1]) and len(_q['checagem'][1]) <= 4 and _q['checagem'][2] in _q['checagem'][1], _q['id']
    assert all(len(a[1]) <= 900 for a in _q['achando']), _q['id']
    assert len(_q['volta']) <= 900 and _q['volta'].count('Resposta: alternativa X.') == 1, _q['id']
    assert {a[0].split(':')[0].replace('Achando ', '') for a in _q['achando']} == {l for l, _ in _q['letras'][1:]}, _q['id']
