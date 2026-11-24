"""Funções (5º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (lucro de um bolo: reta das vendas em quadro + parábola + teto de preço; mesma técnica, agora com tabela no enunciado),
b = ITA/IME (equação funcional com troca de ordem 3: f(x) + 2 f(1/(1 − x)) = x, pede f(1/2)),
c = Fuvest (contar soluções de t⁴ − 6t² + k = 0 pela troca t² = u, com tabela de h(u) = u² − 6u e gráfico na explicação),
d = Harvard-MIT (função iterada f(x) = 1/(1 − x) aplicada 2 026 vezes: quantos x fixos; período 3 e discriminante negativo).
Só junta os degraus 1 a 4 (Aritmética, Grandezas, Estatística, Equações): afim, quadrática, composição, módulo não entra aqui.
Toda resposta é conferida por conta Python (assert) neste módulo, inclusive por contagem exata (sequência de Sturm) e potência de matriz.
"""
from fractions import Fraction as F

ARQUIVO = 'matematica-acima-novas.json'
T = 'Funções'

# ---------------------------------------------------------------- a) ENEM (lucro do bolo, quadro no enunciado)
pontos_a = [(20, 120), (24, 104), (28, 88)]
incl_a = F(pontos_a[1][1] - pontos_a[0][1], pontos_a[1][0] - pontos_a[0][0])
assert incl_a == -4 and F(pontos_a[2][1] - pontos_a[1][1], pontos_a[2][0] - pontos_a[1][0]) == -4   # a reta: -4 bolos por real
qa = lambda p: 120 + incl_a * (p - 20)                                                              # noqa: E731
assert all(qa(p) == 200 - 4 * p for p in range(0, 51)) and all(qa(p) == q for p, q in pontos_a)
CUSTO_A, FIXO_A, TETO_A = 10, 300, 25
lucro_a = lambda p: (p - CUSTO_A) * qa(p) - FIXO_A                                                  # noqa: E731
# força bruta em passos de 1 centavo, de 10 a 25: o máximo permitido está no teto
melhor = max((F(c, 100) for c in range(1000, 2501)), key=lucro_a)
assert melhor == 25 and lucro_a(25) == 1200 and qa(25) == 100
assert (10 + 50) / 2 == 30 and lucro_a(30) == 1300                      # vértice 30 passa do teto: 1 300 (C) é a armadilha
assert [lucro_a(p) + FIXO_A for p in (10, 20, 30, 40, 50)] == [0, 1200, 1600, 1200, 0]
assert lucro_a(20) == 900                                               # 900: usou o menor preço da tabela
assert (25 - CUSTO_A) * qa(25) == 1500                                  # 1 500: esqueceu o gasto fixo
assert (30 - CUSTO_A) * qa(30) == 1600                                  # 1 600: vértice e sem gasto fixo
ENUN_A = ('Uma confeitaria de bairro quer descobrir o preço ideal do seu bolo de cenoura. Durante três semanas seguidas, antes de qualquer '
          'tabelamento, o dono mudou o preço e anotou quantos bolos vendeu por semana, como mostra o quadro, e percebeu que a quantidade vendida '
          'varia com o preço seguindo uma reta. Cada bolo custa R$ 10 para ser produzido (ingredientes e embalagem), e há um gasto fixo de R$ 300 '
          'por semana com o aluguel do forno e a conta de luz. O lucro semanal é o que sobra da venda depois de descontar todos os custos. '
          'Agora, por causa de um tabelamento da prefeitura para produtos da cesta básica local, o preço de venda do bolo não pode passar de R$ 25. '
          'Escolhendo o preço que dá o maior lucro semanal permitido, esse lucro, em reais, será de:\n\n'
          'Semana | Preço do bolo (R$) | Bolos vendidos\n'
          '1ª | 20 | 120\n'
          '2ª | 24 | 104\n'
          '3ª | 28 | 88\n'
          'Custo por bolo: R$ 10 | Gasto fixo: R$ 300 | Preço máximo: R$ 25')
assert len(ENUN_A) >= 600, len(ENUN_A)
# "Sua vez": L = (p − 5) · (60 − 2p) − 20, p ≤ 12
l_sv = lambda p: (p - 5) * (60 - 2 * p) - 20                                                        # noqa: E731
assert (5 + 30) / 2 == 17.5 and l_sv(12) == 232 and l_sv(F(35, 2)) == F('292.5') and (12 - 5) * (60 - 24) == 252

# ---------------------------------------------------------------- b) ITA/IME (equação funcional, ciclo de ordem 3)
Tb = lambda x: 1 / (1 - x)                                                                          # noqa: E731
x0 = F(1, 2)
ciclo = [x0, Tb(x0), Tb(Tb(x0))]
assert ciclo == [F(1, 2), 2, -1] and Tb(ciclo[2]) == x0
assert all(Tb(Tb(Tb(F(x)))) == F(x) for x in (F(1, 3), F(7, 5), F(-4), F(5), F(-1, 7)))             # T³ = identidade


def resolver3(pt, a=1, b=2):
    """Resolve f(x) + b·f(T x) = x nos 3 pontos do ciclo de `pt` (sistema 3×3 por eliminação, em frações)."""
    xs = [pt, Tb(pt), Tb(Tb(pt))]
    m = [[F(0)] * 3 + [xs[i]] for i in range(3)]
    for i in range(3):
        m[i][i] += a
        m[i][(i + 1) % 3] += b
    for c in range(3):
        piv = next(r for r in range(c, 3) if m[r][c] != 0)
        m[c], m[piv] = m[piv], m[c]
        m[c] = [v / m[c][c] for v in m[c]]
        for r in range(3):
            if r != c:
                m[r] = [v - m[r][c] * w for v, w in zip(m[r], m[c])]
    return xs, [m[i][3] for i in range(3)]


xs_b, vals_b = resolver3(x0)
u_b, v_b, w_b = vals_b                                       # u = f(1/2), v = f(2), w = f(−1)
assert xs_b == [F(1, 2), 2, -1] and (u_b, v_b, w_b) == (F(-5, 6), F(2, 3), F(2, 3))
assert u_b + 2 * v_b == F(1, 2) and v_b + 2 * w_b == 2 and w_b + 2 * u_b == -1       # as 3 equações do enunciado
# a própria função existe e fecha em outros pontos (f(3) = 20/27, conferido por todo o ciclo de 3)
for pt in (F(3), F(-2), F(1, 5)):
    _, fv = resolver3(pt)
    xp = [pt, Tb(pt), Tb(Tb(pt))]
    assert all(fv[i] + 2 * fv[(i + 1) % 3] == xp[i] for i in range(3))
assert resolver3(F(3))[1][0] == F(20, 27)
# a eliminação do texto: w = −1 − 2u; v = 2 − 2w = 4 + 4u; u + 2v = 9u + 8 = 1/2
assert (-1 - 2 * u_b == w_b) and (4 + 4 * u_b == v_b) and 9 * u_b + 8 == F(1, 2) and F(1, 2) - 8 == F(-15, 2) and F(-15, 18) == u_b
# distratores
assert F(1, 2) / 3 == F(1, 6)                                # 1/6: supôs f(1/(1 − x)) = f(x)  (3 f(1/2) = 1/2)
assert v_b == F(2, 3)                                        # 2/3: respondeu f(2)
assert F(15, 18) == F(5, 6)                                  # 5/6: errou o sinal de 9u = −15/2
ENUN_B = ('Seja f uma função real definida para todo x real, com x diferente de 0 e de 1, tal que f(x) + 2 · f(1/(1 − x)) = x para todo x do '
          'domínio. Qual é o valor de f(1/2)?')
assert 120 <= len(ENUN_B) <= 300, len(ENUN_B)
# "Sua vez": T(T(T(3))) = 3
assert Tb(F(3)) == F(-1, 2) and Tb(F(-1, 2)) == F(2, 3) and Tb(F(2, 3)) == 3

# ---------------------------------------------------------------- c) Fuvest (contar soluções de t⁴ − 6t² + k = 0)


def _apara(p):
    while p and p[0] == 0:
        p = p[1:]
    return p


def _resto(a, b):
    a = a[:]
    while len(a) >= len(b) and a:
        f = a[0] / b[0]
        a = _apara([x - f * y for x, y in zip(a, b + [0] * (len(a) - len(b)))])
    return a


def raizes_reais_distintas(p):
    """Conta raízes reais distintas pelo teorema de Sturm (frações exatas): independe da conta por u."""
    p = [F(c) for c in p]
    d = [c * (len(p) - 1 - i) for i, c in enumerate(p[:-1])]
    seq = [p, d]
    while True:
        r = _resto(seq[-2], seq[-1])
        if not r:
            break
        seq.append([-c for c in r])

    def mudancas(sinais):
        s = [x for x in sinais if x != 0]
        return sum(1 for a, b in zip(s, s[1:]) if (a > 0) != (b > 0))
    mais = [1 if s[0] > 0 else -1 for s in seq]
    menos = [(1 if s[0] > 0 else -1) * (-1) ** (len(s) - 1) for s in seq]
    return mudancas(menos) - mudancas(mais)


cont_c = {k: raizes_reais_distintas([1, 0, -6, 0, k]) for k in range(-10, 21)}
assert all(cont_c[k] == 2 for k in range(-10, 0)) and cont_c[0] == 3
assert all(cont_c[k] == 4 for k in range(1, 9)) and cont_c[9] == 2 and all(cont_c[k] == 0 for k in range(10, 21))
servem_c = [k for k in cont_c if cont_c[k] == 2]
assert len(servem_c) == 11 and servem_c == list(range(-10, 0)) + [9]
P_c = sum(1 for k in servem_c if k < 0)
Q_c = sum(1 for k in servem_c if k >= 0)
assert (P_c, Q_c, len(range(-10, 21))) == (10, 1, 31)
h_c = lambda u: u * u - 6 * u                                                                       # noqa: E731
assert [h_c(u) for u in range(-1, 8)] == [7, 0, -5, -8, -9, -8, -5, 0, 7]                             # a tabela do enunciado
assert min(h_c(F(u, 10)) for u in range(-100, 160)) == -9 and h_c(3) == -9
assert 0 < h_c(0) + 1 and h_c(-2) == 16 and h_c(8) == 16                                              # h > 0 fora de [0, 6]: -k = 10 também tem u < 0 e u > 6
# distratores
assert len([k for k in range(-10, 21) if cont_c[k] == 4]) == 8                                      # 8: k de 1 a 8 (quatro soluções cada)
assert len([k for k in range(1, 10)]) == 9                                                          # 9: k de 1 a 9
assert len([k for k in range(-10, 0)]) == 10                                                        # 10: esqueceu o k = 9
assert len([k for k in range(-10, 1)]) + 1 == 12                                                    # 12: k negativos, k = 0 e k = 9
ENUN_C = ('Para cada número inteiro k, com −10 ≤ k ≤ 20 (k vai de −10 a 20, e "≤" lê-se "menor ou igual"), considere a equação t⁴ − 6t² + k = 0, na incógnita real t. A tabela mostra alguns '
          'valores da função h(u) = u² − 6u, que ajuda a estudar essa equação. Em quantos valores de k a equação tem exatamente duas soluções '
          'reais distintas?\n\n'
          'u | −1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7\n'
          'h(u) | 7 | 0 | −5 | −8 | −9 | −8 | −5 | 0 | 7')
assert 250 <= len(ENUN_C) <= 600, len(ENUN_C)
# "Sua vez": t⁴ − 4t² + k = 0, k de −5 a 6
cont_sv = {k: raizes_reais_distintas([1, 0, -4, 0, k]) for k in range(-5, 7)}
assert [k for k in cont_sv if cont_sv[k] == 2] == [-5, -4, -3, -2, -1, 4] and cont_sv[0] == 3
assert all(cont_sv[k] == 4 for k in (1, 2, 3)) and all(cont_sv[k] == 0 for k in (5, 6))

# ---------------------------------------------------------------- d) Harvard-MIT (f(x) = 1/(1 − x) aplicada 2 026 vezes)
N_APLIC = 2026
M = ((0, 1), (-1, 1))                                        # f(x) = (0·x + 1)/(−1·x + 1), como matriz de Möbius


def mult(a, b):
    return tuple(tuple(sum(a[i][k] * b[k][j] for k in range(2)) for j in range(2)) for i in range(2))


def potencia(m, n):
    r = ((1, 0), (0, 1))
    while n:
        if n & 1:
            r = mult(r, m)
        m, n = mult(m, m), n >> 1
    return r


M3 = potencia(M, 3)
assert M3 == ((-1, 0), (0, -1))                              # f³ = identidade (matriz é −1 vezes a identidade)
resto_d = N_APLIC % 3
assert N_APLIC == 3 * 675 + 1 and resto_d == 1 and 3 * 675 == 2025
Mn = potencia(M, N_APLIC)
assert Mn == tuple(tuple(-v for v in linha) for linha in M)  # f²⁰²⁶ é a mesma transformação que f
(a_d, b_d), (c_d, d_d) = Mn                                  # (a x + b)/(c x + d) = x  ->  c x² + (d − a) x − b = 0
A2, B2, C2 = c_d, d_d - a_d, -b_d
assert (A2, B2, C2) == (1, -1, 1)                            # x² − x + 1 = 0 (a escala −1 não muda as raízes)
D_d = B2 ** 2 - 4 * A2 * C2
assert D_d == -3                                             # discriminante negativo: nenhum ponto fixo real
fixos = [x for x in range(-3000, 3001) if x not in (0, 1) and F(x) * (1 - x) == 1]
assert fixos == []                                           # sem inteiro; e D < 0 exclui todo real
# a função iterada de verdade, em frações, em vários pontos: f²⁰²⁶ = f e nunca fixa
for pt in (F(2), F(-1, 2), F(3, 7), F(-5), F(11, 4)):
    y = pt
    for _ in range(N_APLIC):
        y = Tb(y)
    assert y == Tb(pt) and y != pt
assert Tb(F(2)) == -1 and Tb(F(-1)) == F(1, 2) and Tb(F(1, 2)) == 2                                  # teste com x = 2: ciclo 2 → −1 → 1/2 → 2
# f só deixa x fora de {0, 1} dentro do mesmo conjunto (o domínio fecha)
assert all(Tb(F(x)) not in (0, 1) for x in (F(2), F(-1), F(1, 2), F(3), F(-7, 3)))
# distratores
assert resto_d == 1                                          # 1: respondeu o resto de 2 026 ÷ 3
assert len(((1, -1, 1))) - 1 == 2                            # 2: contou as duas raízes de x² − x + 1 sem ver D
# 3 = o período; 2 026 = uma solução por aplicação
ENUN_D = ('Seja f(x) = 1/(1 − x), definida para x real diferente de 1. Indique por f²⁰²⁶ a função obtida aplicando f em sequência 2 026 vezes '
          '(f²(x) = f(f(x)), f³(x) = f(f(f(x))), e assim por diante). Quantos números reais x, com x diferente de 0 e de 1 (f(1) não existe, e f(0) = 1 levaria a f(1) na aplicação seguinte), satisfazem '
          'f²⁰²⁶(x) = x?')
assert 200 <= len(ENUN_D) <= 520, len(ENUN_D)
# "Sua vez": f⁷(2) = f(2) = −1
y7 = F(2)
for _ in range(7):
    y7 = Tb(y7)
assert y7 == -1 and 7 % 3 == 1

# ---------------------------------------------------------------- módulo
tab = lambda titulo, cab, linhas: {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}  # noqa: E731

Q = [
    dict(
        id='d2-escada-mat-ita-fun-00a', materia='Matemática', tema=T, calc=1200,
        enunciado=ENUN_A,
        dados=[('Preço R$ 20', '120 bolos por semana'), ('Preço R$ 24', '104 bolos por semana'), ('Preço R$ 28', '88 bolos por semana'),
               ('Custo de cada bolo', 'R$ 10'), ('Gasto fixo', 'R$ 300 por semana'), ('Preço máximo permitido', 'R$ 25')],
        alts=[('R$ 900', 900, 'Usou o menor preço do quadro (R$ 20): 10 · 120 − 300'),
              ('R$ 1 200', 1200, 'OK'),
              ('R$ 1 300', 1300, 'Usou o vértice p = 30, que passa do teto de R$ 25: 20 · 80 − 300'),
              ('R$ 1 500', 1500, 'Esqueceu o gasto fixo de R$ 300: 15 · 100'),
              ('R$ 1 600', 1600, 'Vértice p = 30 e sem o gasto fixo: 20 · 80')],
        resumo='As vendas seguem q = 200 − 4p. O lucro (p − 10) · (200 − 4p) − 300 é uma parábola com vértice em p = 30, acima do teto. O melhor preço permitido é 25, com q = 100 e lucro 15 · 100 − 300 = 1 200.',
        ideia='Ache a reta das vendas, monte o lucro (uma parábola) e veja onde está o máximo. Se o vértice passa do preço permitido, o máximo fica no limite.',
        pecas=[('Parábola', 'A curva do lucro: sobe até um topo e desce.'), ('Vértice', 'O ponto mais alto da parábola (o topo).'),
               ('Raiz', 'O valor em que a conta dá zero.')],
        formulas=[('grafico', 'Lucro', 'lucro = (preço − custo) · vendas − gasto fixo'), ('grafico', 'Reta das vendas', 'cada R$ 1 a mais no preço tira 4 bolos')],
        eq='L = (p − 10) · q − 300', leitura='(lucro por bolo × bolos vendidos) − gasto fixo',
        letras=[('L', 'lucro semanal (o que a questão quer)'), ('p', 'preço do bolo'), ('q', 'bolos vendidos por semana')],
        eq_texto='O lucro é o ganho de cada bolo vezes os bolos vendidos, menos o gasto fixo. Os bolos vendidos dependem do preço, e o preço tem teto: a prefeitura não deixa passar de R$ 25.\nAgora é só achar q e p, uma por vez.',
        achando=[('Achando q: a reta das vendas',
                  'No quadro, o preço sobe R$ 4 (de 20 para 24) e as vendas caem 16 (de 120 para 104): 16 ÷ 4 = 4 bolos a menos para cada R$ 1 a mais (por isso o −4). A R$ 21 vendem 116, a R$ 22 vendem 112. Partindo de 120 bolos a R$ 20: q = 120 − 4 · (p − 20).'),
                 ('Achando q: abrindo a conta',
                  '−4 · (p − 20): o −4 multiplica o p e o −20. −4 · p = −4p. −4 · (−20) = +80: menos vezes menos dá mais (como tirar 4 vezes uma dívida de R$ 20: sobram R$ 80 a mais). Então q = 120 − 4p + 80 = 200 − 4p. Teste com p = 24: 120 − 4 · 4 = 104 e 200 − 96 = 104.'),
                 ('Achando p: o lucro em função do preço',
                  'Troque q: L = (p − 10) · (200 − 4p) − 300.\nTeste com p = 20: 10 · 120 = 1 200, e 1 200 − 300 = 900 reais.'),
                 ('Achando p: como o lucro varia',
                  'Sem o gasto fixo, (p − 10) · (200 − 4p) vale: p = 10 → 0; p = 20 → 10 · 120 = 1 200; p = 30 → 20 · 80 = 1 600; p = 40 → 30 · 40 = 1 200; p = 50 → 0.\nSobe até 30 e desce igual do outro lado, como um morro: isso é uma parábola aberta para baixo.'),
                 ('Achando p: onde fica o vértice',
                  'Raízes são os preços em que a conta dá 0: p − 10 = 0 dá p = 10; 200 − 4p = 0 dá 4p = 200, p = 50. O morro é igual dos dois lados, então o topo (o vértice) fica no meio das raízes: p = (10 + 50) ÷ 2 = 30.'),
                 ('Achando p: o melhor preço permitido',
                  'De 10 até 30 o lucro só sobe. A prefeitura só deixa até 25, então o melhor preço permitido é o maior que ela deixa: p = 25. (Em p = 30 o lucro seria 1 600 − 300 = 1 300, mas é proibido.)'),
                 ('Achando q: bolos vendidos a R$ 25', 'q = 200 − 4 · 25 = 200 − 100 = 100 bolos.')],
        volta='L = (25 − 10) · 100 − 300.\n25 − 10 = 15, e 15 · 100 = 1 500. Então L = 1 500 − 300 = 1 200.\nResposta: alternativa X.',
        valores=[('p', 'R$ 25'), ('q', '100 bolos'), ('L', 'R$ 1 200')],
        pista='reta de vendas + lucro = parábola → ache o vértice (no meio das raízes) e, se ele passa do preço permitido, fique no limite.',
        rec1='3 preços e vendas; custo R$ 10; gasto fixo R$ 300; teto R$ 25', rec3='q = 200 − 4p; p = 25; q = 100; L = 1 200',
        checagem=('Lucro L = (p − 5) · (60 − 2p) − 20, com preço p de no máximo R$ 12. Qual é o maior lucro?',
                  ['R$ 232', 'R$ 252', 'R$ 292,50'], 'R$ 232',
                  'O vértice estaria em p = 17,5, que passa do teto. Então p = 12: 7 · 36 − 20 = 232.'),
        ancora='forte · ENEM 2022 q.158 (caderno 7; q.176 no caderno 5: modelo quadrático de infectados por mês, máximo no vértice t = 5 e escolha do período que o contém); aqui a parábola nasce de uma reta de vendas dada em quadro, e o vértice passa do teto de preço',
        canal='mat-13-funcao-do-segundo-grau-propriedades.txt [6:12:01] (x do vértice e eixo de simetria da parábola)',
        antes=['numero-que-falta', 'fun-parabola'],
    ),
    dict(
        id='d2-escada-mat-ita-fun-00b', materia='Matemática', tema=T, calc=-5 / 6,
        enunciado=ENUN_B,
        dados=[('Regra', 'f(x) + 2 · f(1/(1 − x)) = x'), ('Vale para', 'todo x diferente de 0 e de 1'), ('Quero', 'f(1/2)')],
        alts=[('−5/6', -5 / 6, 'OK'),
              ('1/6', 1 / 6, 'Supôs f(1/(1 − x)) igual a f(x): 3 · f(1/2) = 1/2'),
              ('1/2', 0.5, 'Parou na 1ª equação e copiou o lado direito, 1/2'),
              ('2/3', 2 / 3, 'Respondeu f(2), que vale 2/3, e não f(1/2)'),
              ('5/6', 5 / 6, 'Errou o sinal em 9u = −15/2 e achou +15/18')],
        resumo='A troca x → 1/(1 − x) leva 1/2 a 2, 2 a −1 e −1 a 1/2. Com u = f(1/2), v = f(2), w = f(−1): u + 2v = 1/2, v + 2w = 2, w + 2u = −1. Daí w = −1 − 2u, v = 4 + 4u e 9u + 8 = 1/2, logo u = −5/6.',
        ideia='A troca x → 1/(1 − x) volta ao ponto de partida depois de 3 passos. Escreva a equação nos 3 pontos do ciclo: sai um sistema 3×3 nas três imagens de f.',
        pecas=[('Troca de ponto', 'Trocar x por 1/(1 − x), três vezes seguidas, volta ao x.'), ('Ciclo', 'Pontos que se repetem em fila: 1/2 → 2 → −1 → 1/2.')],
        formulas=[('texto', 'Troca de ponto', 'x vira 1/(1 − x)'), ('contagem', 'Volta ao começo', 'trocar 3 vezes volta ao x')],
        eq='u + 2v = 1/2',
        leitura='a regra f(x) + 2 · f(1/(1 − x)) = x escrita no ponto x = 1/2: f(1/2) mais 2 vezes o f do ponto que a troca 1/(1 − x) liga a ele',
        letras=[('u', 'f(1/2) (o que a questão quer)'), ('v', 'f(1/(1 − 1/2)): o f que a regra liga ao u'), ('w', 'f do ponto que a mesma troca liga ao ponto de v')],
        eq_texto='A regra vale em todo ponto, e f é só uma regra desconhecida: f de cada ponto é um número escondido. Chamo de u o f(1/2). A regra em x = 1/2 liga u a um segundo número escondido, v, e a regra nesse novo ponto liga v a um terceiro, w. A equação mostra a regra em x = 1/2.\nAgora é só achar w e v, uma por vez, em função de u.',
        achando=[('Achando w: o ciclo do 1/2',
                  'Para encurtar, chame 1/(1 − x) de T(x). T(1/2) = 1/(1 − 1/2) = 1/(1/2) = 2.\n1/(1/2) é 1 ÷ 1/2: quantos meios cabem em 1? Cabem 2.'),
                 ('Achando w: voltando ao 1/2',
                  'T(2) = 1/(1 − 2) = 1/(−1) = −1.\nT(−1) = 1/(1 − (−1)) = 1/2.\nVolta ao 1/2 depois de 3 passos.',
                  tab('O ciclo', ['Entra x', 'Sai 1/(1 − x)'], [['1/2', '2'], ['2', '−1'], ['−1', '1/2']])),
                 ('Achando w: a regra em cada ponto',
                  'Em x = 1/2: f(1/2) + 2 · f(2) = 1/2, ou u + 2v = 1/2.\nEm x = 2: f(2) + 2 · f(−1) = 2, ou v + 2w = 2.\nEm x = −1: f(−1) + 2 · f(1/2) = −1, ou w + 2u = −1.'),
                 ('Achando w: w em função de u', 'A 3ª equação é w + 2u = −1. Tire 2u dos dois lados: w = −1 − 2u. Teste com u = 1: w + 2 = −1 dá w = −3, e −1 − 2 = −3.'),
                 ('Achando v: v em função de u',
                  'A 2ª equação é v + 2w = 2. Tire 2w dos dois lados: v = 2 − 2w. Teste com w = 1/2: v + 1 = 2 dá v = 1, e 2 − 1 = 1.\nTroque w = −1 − 2u: 2w = −2 − 4u. Então v = 2 − (−2 − 4u).'),
                 ('Achando v: tirando o parêntese',
                  'Tirar (−2 − 4u) é tirar −2 e tirar −4u: some 2 e some 4u. Então v = 2 + 2 + 4u = 4 + 4u. Teste com u = 1: 2 − (−2 − 4) = 2 + 6 = 8 e 4 + 4 = 8.')],
        volta='Na 1ª equação, u + 2v = 1/2, troque v = 4 + 4u: u + 2 · (4 + 4u) = 1/2.\n2 · (4 + 4u) = 8 + 8u. Juntar os u: u + 8u = 9u (1 u e mais 8 u são 9 u). Fica 9u + 8 = 1/2.\nTire 8 dos dois lados: 9u = 1/2 − 8 = 1/2 − 16/2 = −15/2.\nDividir por 9 é pôr 9 embaixo: (−15/2) ÷ 9 = −15/18 = −5/6 (÷ 3 em cima e embaixo).\nConferindo: v = 4 + 4 · (−5/6) = 4 − 10/3 = 2/3; w = −1 + 5/3 = 2/3. A 2ª equação: 2/3 + 4/3 = 2.\nResposta: alternativa X.',
        valores=[('u', '−5/6'), ('v', '2/3'), ('w', '2/3')],
        pista='regra com f(x) e f(troca de x) → ache o ciclo da troca (volta ao começo em 3 passos) e escreva a regra em cada ponto: sai um sistema.',
        rec1='f(x) + 2 · f(1/(1 − x)) = x; quero f(1/2)', rec3='ciclo 1/2, 2, −1; w = −1 − 2u; v = 4 + 4u; u = −5/6',
        checagem=('T(x) = 1/(1 − x). Quanto vale T(T(T(3)))?', ['3', '−1/2', '2/3', '1/3'], '3',
                  'T(3) = 1/(1 − 3) = −1/2. T(−1/2) = 1/(1 + 1/2) = 2/3. T(2/3) = 1/(1 − 2/3) = 3. Volta ao 3.'),
        ancora='forte · IME 2021 q.8 (equação funcional que liga f(x) e f((x − 1)/x): a troca de ponto volta ao começo em 3 passos e vira sistema 3×3; li a correção comentada do Estratégia Militares); aqui o coeficiente 2 e o ponto 1/2 desfazem o atalho simétrico',
        canal='fuv-16-funcoes-parte-3-3.txt [8:48:01] (f de g de x: a regra aplicada ao resultado); a troca que volta ao começo em 3 passos fica fora do canal',
        antes=['fun-composta', 'fracoes'],
    ),
    dict(
        id='d2-escada-mat-ita-fun-00c', materia='Matemática', tema=T, calc=11,
        enunciado=ENUN_C,
        dados=[('Equação', 't⁴ − 6t² + k = 0, t real'), ('k', 'inteiro de −10 a 20 (31 valores)'), ('h(u)', 'u² − 6u (tabela do enunciado)'),
               ('Quero', 'k com exatamente 2 soluções reais distintas')],
        alts=[('8', 8, 'Contou os k de 1 a 8: duas raízes positivas em u, mas 4 soluções em t'),
              ('9', 9, 'Contou os k de 1 a 9, tratando todos como se dessem 2 soluções'),
              ('10', 10, 'Contou só os k negativos e esqueceu o k = 9'),
              ('11', 11, 'OK'),
              ('12', 12, 'Incluiu o k = 0, que parece dar 2 soluções mas dá 3')],
        resumo='Com u = t², h(u) = −k. Cada u positivo dá 2 valores de t, u = 0 dá 1 e u negativo dá 0. Os k de −10 a −1 dão um u negativo e um u maior que 6 (2 soluções), e k = 9 dá só u = 3 (2 soluções). Total 10 + 1 = 11.',
        ideia='Troque t² por u: cada u positivo vira dois valores de t. Na tabela de h(u) = u² − 6u, veja quais valores de −k dão exatamente um u positivo.',
        pecas=[('Troca de variável', 'Chamar t² de u: a equação de grau 4 vira de grau 2.'),
               ('Fundo da curva', 'O ponto mais baixo da curva de h (a curva em U): aqui é −9, em u = 3.'), ('Contar soluções', 'Cada u positivo dá 2 valores de t.')],
        formulas=[('grafico', 'Troca de variável', 'u = t²  (t⁴ = u²)'), ('contagem', 'Quantos t por u', 'u > 0: 2;  u = 0: 1;  u < 0: 0')],
        eq='N = P + Q', leitura='k que servem = k negativos que servem + k de 0 a 20 que servem',
        letras=[('N', 'quantos valores de k servem (o que a questão quer)'), ('P', 'quantos k negativos servem'), ('Q', 'quantos k de 0 a 20 servem')],
        eq_texto='Separo os 31 valores de k em dois grupos, os negativos e os de 0 a 20, e conto os que servem em cada um.\nAgora é só achar P e Q, uma por vez.',
        achando=[('Achando P: troque t² por u',
                  'Chame t² de u. Como t⁴ = t² · t², a equação vira u² − 6u + k = 0.\nPasse k para o outro lado, trocando o sinal: u² − 6u = −k, ou h(u) = −k. Teste com k = 5: u² − 6u + 5 = 0 e u² − 6u = −5.'),
                 ('Achando P: quantos t dá cada u',
                  'Cada u gera valores de t por t² = u: u positivo dá 2 (t e −t), u = 0 dá 1 (t = 0) e u negativo não dá nenhum.'),
                 ('Achando P: ler o gráfico de h',
                  'h(0) = 0 e h(6) = 0. Entre 0 e 6, h fica abaixo de zero, com fundo −9 em u = 3. Fora de 0 a 6, h fica acima de zero: h(−1) = 7 e h(7) = 7.',
                  {'tipo': 'grafico', 'titulo': 'h(u) = u² − 6u (o eixo horizontal é u)', 'funcoes': [{'expr': 'x^2-6*x', 'rotulo': 'h', 'cor': 'a'}],
                   'pontos': [{'x': 3, 'y': -9, 'rotulo': 'fundo'}, {'x': 0, 'y': 0, 'rotulo': '0'}, {'x': 6, 'y': 0, 'rotulo': '6'}],
                   'x': [-2, 8], 'y': [-10, 10]}),
                 ('Achando P: k negativo',
                  'Com k negativo, −k é positivo (k = −7 pede h(u) = 7). Então há um u menor que 0 (sem t) e um u maior que 6 (2 valores de t): 2 soluções.'),
                 ('Achando P: testando k = −1',
                  'Teste com k = −1: h(u) = 1. A curva não pula valores: h(−1) = 7 e h(0) = 0, então no caminho ela passa pelo 1, e um u está entre −1 e 0 (negativo). Do mesmo jeito h(6) = 0 e h(7) = 7: outro u entre 6 e 7.'),
                 ('Achando P: contando os k negativos',
                  'Com k = −10: h(u) = 10, ainda mais longe: u menor que −1 e maior que 7. Sempre um u negativo e um maior que 6. Isso vale para k = −10, −9, ..., −1: são 10 valores, P = 10.'),
                 ('Achando Q: o fundo de h',
                  'O menor valor de h é −9. Então h(u) = −k só tem solução se −k ≥ −9 (≥ lê-se "maior ou igual"). Teste: k = 10 dá −k = −10, menor que −9, não serve; k = 9 dá −9, serve. Então k tem que ser 9 ou menos. Com k = 10, 11, ..., 20 não existe u.'),
                 ('Achando Q: o caso k = 9',
                  'Com k = 9: h(u) = −9 só em u = 3, um u positivo. t² = 3: t é o número que vezes ele mesmo dá 3 (√3, um pouco mais de 1,7 porque 1,7 · 1,7 = 2,89), e o oposto, −√3. Não precisa do valor: só importa que são 2 soluções.'),
                 ('Achando Q: os k de 0 a 8',
                  'Com k de 1 a 8, −k fica entre −8 e −1: há dois u, entre 0 e 6, ambos positivos: 4 soluções. Com k = 0: u = 0 (1 solução) e u = 6 (2 soluções): 3 soluções. Nenhum desses serve.\nEntre 0 e 20 só o k = 9 serve: Q = 1.')],
        volta='N = P + Q = 10 + 1 = 11.\nConferindo a contagem dos k: os dois extremos entram (de 1 a 3 são 3 números: 3 − 1 + 1). Por isso de −10 a 20 são 20 − (−10) + 1 = 31 valores. Servem os 10 negativos e o k = 9.\nResposta: alternativa X.',
        valores=[('P', '10 valores de k'), ('Q', '1 valor (k = 9)'), ('N', '11 valores de k')],
        pista='equação com t⁴ e t² → troque t² por u, leia no gráfico quantos u dá cada k e lembre: u positivo dá 2 valores de t.',
        rec1='t⁴ − 6t² + k = 0; k de −10 a 20; tabela de h(u)', rec3='P = 10 (k negativos); Q = 1 (k = 9); N = 11',
        checagem=('t⁴ − 4t² + k = 0, com k inteiro de −5 a 6. Em quantos k há exatamente 2 soluções reais?', ['6', '5', '4', '7'], '6',
                  'Com u = t²: h(u) = u² − 4u tem fundo −4 em u = 2. Os k de −5 a −1 dão 2 soluções (5 valores) e k = 4 dá só u = 2 (2 soluções). Total 5 + 1 = 6.'),
        ancora='parcial · ITA 2025 1ª fase q.6 (equação em 9^x e 3^x: troca de variável e contar soluções reais distintas conforme o parâmetro) com Fuvest 2023 2ª fase dia 2 M02 item c (composição com função de imagem limitada); não achei real de t⁴ − 6t² + k',
        canal='mat-13-funcao-do-segundo-grau-propriedades.txt [6:05:31] (delta e quantas raízes; o fundo da parábola); a troca de t² por u fica fora do canal',
        antes=['fun-biquadrada'],
    ),
    dict(
        id='d2-escada-mat-ita-fun-00d', materia='Matemática', tema=T, calc=0,
        enunciado=ENUN_D,
        dados=[('Regra', 'f(x) = 1/(1 − x)'), ('Aplicações', '2 026 seguidas'), ('Domínio', 'x diferente de 0 e de 1'),
               ('Quero', 'quantos x com f²⁰²⁶(x) = x')],
        alts=[('0', 0, 'OK'),
              ('1', 1, 'Respondeu o resto 1 da divisão de 2 026 por 3'),
              ('2', 2, 'Contou as 2 raízes de x² − x + 1 = 0 sem ver que Δ é negativo'),
              ('3', 3, 'Respondeu o período do ciclo (3 aplicações)'),
              ('2 026', 2026, 'Contou uma solução por aplicação')],
        resumo='f aplicada 3 vezes devolve x, e 2 026 = 3 · 675 + 1, então f²⁰²⁶ = f. Resolver f(x) = x dá x² − x + 1 = 0, com Δ = 1 − 4 = −3 < 0: nenhuma solução real.',
        ideia='Aplicar f três vezes devolve o x de partida, então só importa o resto de 2 026 ÷ 3. Sobra 1 aplicação: resolva f(x) = x e veja o sinal do discriminante.',
        pecas=[('Função composta', 'f² = f(f(x)): aplicar f duas vezes.'), ('Ciclo', 'Depois de 3 aplicações volta ao começo.'),
               ('Discriminante', 'Δ = b² − 4ac: se for negativo, não há raiz real.')],
        formulas=[('texto', 'Função composta', 'f²(x) = f(f(x))'), ('contagem', 'Volta ao começo', 'f³(x) = x'), ('grafico', 'Discriminante', 'Δ = b² − 4ac')],
        eq='N = 0 se Δ < 0;  N = 1 se Δ = 0;  N = 2 se Δ > 0',
        leitura='quantos x, conforme o sinal do discriminante Δ da equação fʳ(x) = x',
        letras=[('N', 'quantos x servem (o que a questão quer)'), ('r', 'quantas aplicações de f sobram depois das voltas completas'),
                ('Δ', 'discriminante da equação fʳ(x) = x')],
        eq_texto='Se f volta ao começo a cada 3 aplicações, sobram só r aplicações. Para r = 1 ou r = 2 a equação fʳ(x) = x é de 2º grau (aqui r será 1), e o sinal de Δ diz quantos x existem. Com r = 0, f voltou ao começo e vale para qualquer x.\nAgora é só achar r e Δ, uma por vez.',
        achando=[('Achando r: teste com número',
                  'Com x = 2: f(2) = 1/(1 − 2) = −1. f(−1) = 1/(1 + 1) = 1/2. f(1/2) = 1/(1 − 1/2) = 2.\nDepois de 3 aplicações, voltou ao 2.',
                  tab('O ciclo de x = 2', ['Aplicação', 'Resultado'], [['início', '2'], ['1ª', '−1'], ['2ª', '1/2'], ['3ª', '2']])),
                 ('Achando r: aplicar f duas vezes',
                  'Agora com letras, para qualquer x. f²(x) = 1/(1 − 1/(1 − x)).\nO 1 do começo vira (1 − x)/(1 − x), que também vale 1 (como 5/5 = 1), para ficar com o mesmo embaixo da outra fração: (1 − x)/(1 − x) − 1/(1 − x) = (1 − x − 1)/(1 − x) = −x/(1 − x).'),
                 ('Achando r: dividir por fração',
                  'Logo f²(x) = 1 ÷ (−x/(1 − x)). Dividir por fração é inverter: 1 ÷ 1/2 = 2 (cabem 2 meios em 1). Aqui vira (1 − x)/(−x); cima e baixo vezes −1: (x − 1)/x.\nTeste com x = 2: f(f(2)) = f(−1) = 1/2 e (2 − 1)/2 = 1/2.'),
                 ('Achando r: a terceira aplicação',
                  'f³(x) = f(f²(x)) = 1/(1 − (x − 1)/x).\n1 − (x − 1)/x = (x − (x − 1))/x = 1/x.\nEntão f³(x) = 1/(1/x) = x: três aplicações devolvem o x de partida.'),
                 ('Achando r: o resto de 2 026 ÷ 3',
                  'A cada 3 aplicações a função volta ao começo. 2 026 ÷ 3: 3 · 600 = 1 800, restam 226; 3 · 75 = 225, resta 1. Então 600 + 75 = 675 voltas e resta 1.'),
                 ('Achando r: o que sobra',
                  'São 675 voltas completas (3 · 675 = 2 025) e mais 1 aplicação: f²⁰²⁶(x) = f(x). Então r = 1.'),
                 ('Achando Δ: igualar f(x) a x',
                  'Como f²⁰²⁶ = f, a equação é f(x) = x: 1/(1 − x) = x.\nMultiplicar os dois lados por (1 − x) tira a fração (como 6 ÷ 2 = 3 vira 6 = 3 · 2), e (1 − x) não é zero. Fica 1 = x · (1 − x) = x − x².'),
                 ('Achando Δ: passando para um lado',
                  'Passar tudo para um lado: some x² e tire x dos dois lados de 1 = x − x². Fica x² − x + 1 = 0.\nTeste com x = 2: 1 − (2 − 4) = 3 e 4 − 2 + 1 = 3. Os dois lados dão o mesmo, e 3 não é 0: o 2 não resolve.'),
                 ('Achando Δ: o discriminante',
                  'Em x² − x + 1 = 0: a = 1, b = −1, c = 1.\nΔ = b² − 4ac = (−1)² − 4 · 1 · 1 = 1 − 4 = −3.\nΔ é negativo: a equação não tem raiz real.')],
        volta='Δ = −3 é menor que 0, então N = 0.\nConferindo com x = 2: f²⁰²⁶(2) = f(2) = −1, que não é 2.\nResposta: alternativa X.',
        valores=[('r', '1'), ('Δ', '−3'), ('N', '0')],
        pista='função aplicada um número enorme de vezes → ache em quantas aplicações ela volta ao começo, use o resto da divisão e resolva a equação que sobra.',
        rec1='f(x) = 1/(1 − x); 2 026 aplicações; f²⁰²⁶(x) = x', rec3='f³ = x; r = 1; Δ = −3; N = 0',
        checagem=('f(x) = 1/(1 − x). Aplicando f 7 vezes ao número 2, qual é o resultado?', ['−1', '2', '1/2', '1'], '−1',
                  'f aplicada 3 vezes volta ao começo. 7 = 2 · 3 + 1 sobra 1: f⁷(2) = f(2) = 1/(1 − 2) = −1.'),
        ancora='parcial · ITA 2023 1ª fase q.38 (f(z) = z + i aplicada 2 023 vezes: os iterados se repetem em ciclo e o expoente grande vira resto de divisão); aqui a função é 1/(1 − x), o ciclo é de 3 e a pergunta é contar pontos fixos; não achei real que conte pontos fixos',
        canal='mat-17-funcoes-trigonometricas.txt [8:07:33] (função periódica: depois de um período a coisa se repete); aplicar uma função várias vezes fica fora do canal',
        antes=['fun-composta', 'fun-periodicidade', 'fun-discriminante', 'fracoes'],
    ),
]

MANTER = {}

ANTES_NOVOS = {
    'fun-parabola': {
        'titulo': 'Parábola: o morro, as raízes e o topo',
        'linhas': [
            'Parábola é a curva em forma de morro (ou de vale): sobe, chega a um topo e desce igual do outro lado.',
            'Raízes são os valores em que a conta dá zero. Em (p − 2) · (12 − p), dá zero em p = 2 e em p = 12.',
            'O vértice é o topo do morro. Como os dois lados são iguais, ele fica no meio das raízes: (2 + 12) ÷ 2 = 7.',
            'Teste: p = 7 dá 5 · 5 = 25; p = 6 dá 4 · 6 = 24 e p = 8 dá 6 · 4 = 24. O topo é em p = 7.',
        ],
        'visual': tab('Valores de (p − 2) · (12 − p)', ['p', 'Conta'], [['2', '0'], ['6', '24'], ['7', '25'], ['8', '24'], ['12', '0']]),
        'exercicios': [
            {'enunciado': 'A conta (p − 2) · (12 − p) vale zero em dois valores de p. Quais?', 'alternativas': ['2 e 12', '−2 e 12', '2 e −12', '10 e 14'], 'certa': 0,
             'resolucao': '2 e 12: p − 2 = 0 dá p = 2, e 12 − p = 0 dá p = 12.\n−2 e 12 trocou o sinal de p − 2; 2 e −12 trocou o de 12 − p; 10 e 14 não zeram nenhum parêntese.'},
            {'enunciado': 'A conta (p − 2) · (12 − p) forma um morro, igual dos dois lados das raízes 2 e 12. Em qual p fica o topo?', 'alternativas': ['7', '5', '10', '12'], 'certa': 0,
             'resolucao': '7: o topo fica no meio das raízes, (2 + 12) ÷ 2 = 7.\n5 é a distância do topo à raiz 12; 10 é 12 − 2; 12 é uma raiz, onde a conta dá zero.'},
        ],
    },
    'fun-composta': {
        'titulo': 'Aplicar uma regra duas vezes: f(f(x))',
        'linhas': [
            'f(x) é o resultado da regra f quando entra x. Aplicar duas vezes é pôr esse resultado de novo na regra: f(f(x)).',
            'Exemplo: f(x) = 2x + 1. f(3) = 2 · 3 + 1 = 7. Depois f(f(3)) = f(7) = 2 · 7 + 1 = 15.',
            'Em letras: f(f(x)) = 2 · (2x + 1) + 1 = 4x + 3. Conferindo com x = 3: 4 · 3 + 3 = 15.',
            'Uma regra pode voltar ao começo: se g(x) = 5 − x, então g(g(x)) = 5 − (5 − x) = x.',
        ],
        'visual': tab('Aplicando f(x) = 2x + 1 duas vezes', ['Entra x', 'f(x)', 'f(f(x))'], [['1', '3', '7'], ['2', '5', '11'], ['3', '7', '15']]),
        'exercicios': [
            {'enunciado': 'Se f(x) = 3x − 2, quanto vale f(f(2))?', 'alternativas': ['10', '4', '8', '7'], 'certa': 0,
             'resolucao': '10: f(2) = 3 · 2 − 2 = 4, e f(4) = 3 · 4 − 2 = 10.\n4 é só a 1ª aplicação; 8 e 7 erram a segunda conta.'},
            {'enunciado': 'Se g(x) = 5 − x, quanto vale g(g(7))?', 'alternativas': ['7', '−2', '5', '12'], 'certa': 0,
             'resolucao': '7: g(7) = 5 − 7 = −2, e g(−2) = 5 − (−2) = 7.\n−2 é só a 1ª aplicação; 5 e 12 erram o sinal.'},
        ],
    },
    'fun-periodicidade': {
        'titulo': 'Ciclo que se repete e a divisão com resto',
        'linhas': [
            'Se uma regra volta ao começo depois de 3 aplicações, ela repete em ciclo: 1ª, 2ª, 3ª, e de novo 1ª, 2ª, 3ª...',
            'Para saber onde cai a 100ª aplicação, divida por 3 e olhe só o resto.',
            'Exemplo: 100 ÷ 3 = 33 e sobra 1, porque 33 · 3 = 99. A 100ª cai onde cai a 1ª.',
            'Resto 0 vale como o fim do ciclo (3ª): 99 ÷ 3 = 33 e sobra 0, então a 99ª cai onde cai a 3ª.',
        ],
        'visual': tab('Onde cai a aplicação de número n', ['n', 'Conta', 'Cai em'],
                      [['100', '100 = 33 · 3 + 1', '1ª'], ['99', '99 = 33 · 3 + 0', '3ª'], ['2 000', '2 000 = 666 · 3 + 2', '2ª']]),
        'exercicios': [
            {'enunciado': 'Um ciclo de 3 passos se repete. Em qual passo do ciclo cai a 50ª aplicação?', 'alternativas': ['2º passo', '1º passo', '3º passo', '16º passo'], 'certa': 0,
             'resolucao': '2º passo: 50 ÷ 3 = 16 e sobra 2, porque 16 · 3 = 48.\n16 é o número de voltas completas, não o passo.'},
            {'enunciado': 'Em um ciclo de 3 passos, em qual passo cai a 60ª aplicação?', 'alternativas': ['3º passo', '1º passo', '2º passo', '20º passo'], 'certa': 0,
             'resolucao': '3º passo: 60 ÷ 3 = 20 e sobra 0, que vale o fim do ciclo.\n20 é o número de voltas completas, não o passo.'},
        ],
    },
    'fun-discriminante': {
        'titulo': 'Discriminante: a equação de 2º grau tem raiz real?',
        'linhas': [
            'Em ax² + bx + c = 0, o discriminante é Δ = b² − 4ac. Ele diz quantas raízes reais a equação tem.',
            'Δ positivo: duas raízes reais diferentes. Δ = 0: uma só. Δ negativo: nenhuma raiz real.',
            'Exemplo: x² − 5x + 6 = 0. Δ = 25 − 24 = 1, positivo: duas raízes (2 e 3).',
            'Exemplo: x² − x + 1 = 0. Δ = (−1)² − 4 · 1 · 1 = 1 − 4 = −3, negativo: nenhuma raiz real.',
        ],
        'visual': tab('Sinal de Δ e raízes reais', ['Δ', 'Raízes reais'], [['positivo', '2, diferentes'], ['zero', '1'], ['negativo', 'nenhuma']]),
        'exercicios': [
            {'enunciado': 'Quantas raízes reais tem x² − 4x + 5 = 0?', 'alternativas': ['Nenhuma', 'Uma', 'Duas', 'Quatro'], 'certa': 0,
             'resolucao': 'Nenhuma: Δ = (−4)² − 4 · 1 · 5 = 16 − 20 = −4, negativo.\nDuas só se Δ fosse positivo.'},
            {'enunciado': 'Quantas raízes reais tem x² − 6x + 9 = 0?', 'alternativas': ['Uma', 'Nenhuma', 'Duas', 'Três'], 'certa': 0,
             'resolucao': 'Uma: Δ = (−6)² − 4 · 1 · 9 = 36 − 36 = 0.\nΔ = 0 dá uma raiz só (x = 3).'},
        ],
    },
    'fun-biquadrada': {
        'titulo': 'Equação com t⁴: troque t² por u',
        'linhas': [
            'Em t⁴ − 5t² + 4 = 0, note que t⁴ = t² · t². Chame t² de u: fica u² − 5u + 4 = 0, de 2º grau.',
            'Ache u e volte: t² = u. Cada u positivo dá 2 valores de t (a raiz e o oposto); u = 0 dá 1; u negativo não dá nenhum.',
            'Exemplo: u = 1 e u = 4 servem. Então t = 1, −1, 2, −2: são 4 soluções.',
        ],
        'visual': tab('Quantos t dá cada u', ['u', 't² = u', 'Soluções em t'], [['4', 't² = 4', '2 (t = 2 e t = −2)'], ['0', 't² = 0', '1 (t = 0)'], ['−4', 't² = −4', 'nenhuma']]),
        'exercicios': [
            {'enunciado': 'Quantas soluções reais tem t² = 9?', 'alternativas': ['2', '1', '3', '0'], 'certa': 0,
             'resolucao': '2: t = 3 e t = −3.\n1 só valeria para t² = 0; 0 só para t² negativo.'},
            {'enunciado': 'Em t⁴ − 5t² + 4 = 0, quantas soluções reais existem?', 'alternativas': ['4', '2', '3', '1'], 'certa': 0,
             'resolucao': '4: u = 1 e u = 4 dão t = 1, −1, 2 e −2.\nContar só as duas raízes de u dá 2.'},
        ],
    },
}

# ---- conferências das aulas "Antes" e do módulo
assert (7 - 2) * (12 - 7) == 25 and (6 - 2) * (12 - 6) == 24 and (8 - 2) * (12 - 8) == 24 and (2 + 12) // 2 == 7 and 12 - 2 == 10 and 12 - 7 == 5
f_ex = lambda x: 3 * x - 2                                                                          # noqa: E731
g_ex = lambda x: 5 - x                                                                              # noqa: E731
assert f_ex(f_ex(2)) == 10 and f_ex(2) == 4 and g_ex(g_ex(7)) == 7 and g_ex(7) == -2
assert (lambda x: 2 * x + 1)(3) == 7 and (lambda x: 2 * x + 1)(7) == 15 and 4 * 3 + 3 == 15
assert [(lambda x: 2 * x + 1)((lambda x: 2 * x + 1)(i)) for i in (1, 2, 3)] == [7, 11, 15]
assert 50 // 3 == 16 and 50 % 3 == 2 and 60 % 3 == 0 and 60 // 3 == 20 and 100 // 3 == 33 and 100 % 3 == 1 and 99 % 3 == 0 and 2000 // 3 == 666 and 2000 % 3 == 2
assert (-4) ** 2 - 4 * 1 * 5 == -4 and (-6) ** 2 - 4 * 1 * 9 == 0 and 25 - 24 == 1 and 1 - 4 == -3
assert raizes_reais_distintas([1, 0, -5, 0, 4]) == 4 and raizes_reais_distintas([1, 0, -9]) == 2
for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('fun-'), _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['resolucao'].split('\n')[0].count(_e['alternativas'][_e['certa']].split(' ')[0]) >= 1
        assert len(set(_e['alternativas'])) == len(_e['alternativas'])
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), (_q['id'], [len(v) for _, v in _q['dados']])
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), _q['id']
    assert len(_q['ideia']) <= 300, _q['id']
    assert all(l not in 'ABCDE' for l, _ in _q['letras']), _q['id']
    assert len({l for l, _ in _q['letras']}) == len(_q['letras'])
    assert all(len(o) <= 60 for o in _q['checagem'][1]) and _q['checagem'][2] in _q['checagem'][1]
    assert all(len(a[1]) <= 300 for a in _q['achando']), (_q['id'], [len(a[1]) for a in _q['achando'] if len(a[1]) > 300])
    assert all(a[0].startswith('Achando ') for a in _q['achando'])
    assert all(a[0].split()[1].rstrip(':') in {l for l, _ in _q['letras'][1:]} for a in _q['achando']), _q['id']
    assert len(_q['pecas']) <= 3
