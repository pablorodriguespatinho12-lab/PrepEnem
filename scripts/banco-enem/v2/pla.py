"""Geometria Plana (6º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (MANTER: gramado em L, 10% a mais e pacotes), b = ITA (lúnulas de Hipócrates sobre o cateto 8 e a hipotenusa 17),
c = Fuvest (círculo inscrito num triângulo retângulo só com hipotenusa e perímetro), d = Harvard-MIT (custo que só depende de uma distância).
Só junta os degraus 1 a 5 (Aritmética, Grandezas, Estatística, Equações, Funções). Toda resposta é conferida por conta Python (assert).
"""
import math
from fractions import Fraction as F

ARQUIVO = 'matematica-acima-novas.json'
T = 'Geometria Plana'

# ---------------------------------------------------------------- a) ENEM (MANTER): confere a conta que já está no JSON
area_l = 40 * 30 - 15 * 10
assert area_l == 1050
com_folga = F(area_l) * F(11, 10)
assert com_folga == F(2310, 2) == 1155
pacote = F(6) * F(3, 2)
assert pacote == 9
assert math.ceil(com_folga / pacote) == 129 and divmod(1155, 9) == (128, 3)

# ---------------------------------------------------------------- b) ITA: lúnulas de Hipócrates
AB_b, BC_b = 8, 17
AC_b = math.isqrt(BC_b ** 2 - AB_b ** 2)
assert AC_b ** 2 == BC_b ** 2 - AB_b ** 2 and AC_b == 15
T_b = F(AB_b * AC_b, 2)
assert T_b == 60
semi = lambda d: F(d, 2) ** 2 / 2   # área do semicírculo de diâmetro d, em múltiplos de π
S_b, R_b, H_b = semi(AB_b), semi(AC_b), semi(BC_b)
assert (S_b, R_b, H_b) == (8, F(225, 8), F(289, 8)) and F(15, 2) ** 2 == F(225, 4) and F(225, 8) == F('28.125')
assert H_b == F('36.125') and F(17, 2) ** 2 == F('72.25') and F(15, 2) ** 2 == F('56.25')
assert S_b + R_b == H_b                      # Pitágoras vale para áreas de semicírculos
L_b = S_b + R_b - (H_b - T_b)                # pedaço dos semicírculos dos catetos fora de Γ: os π se cancelam
assert L_b == 60
# conferência numérica pela geometria: metade de Γ do lado do triângulo = H = T + 2 segmentos
PI = math.pi
seg_total = PI * H_b - float(T_b)
assert abs(float(S_b + R_b) * PI - seg_total - 60) < 1e-9
# distratores (π = 3,14)
assert 60 / 2 == 30                                              # dividiu por 2 duas vezes
assert F(AB_b * BC_b, 2) == 68                                   # hipotenusa no lugar do outro cateto
assert AB_b * AC_b == 120                                        # esqueceu o ÷ 2
dois_semi = 3.14 * float(S_b + R_b)
assert abs(dois_semi - 113.4325) < 1e-9                          # somou só os dois semicírculos dos catetos
ENUN_B = ('Seja ABC um triângulo retângulo em A, com AB = 8 cm e BC = 17 cm. Sobre os catetos AB e AC, para fora do triângulo, '
          'constroem-se dois semicírculos, cada um com um cateto como diâmetro. Seja Γ a circunferência de diâmetro BC. '
          'Qual é, em cm², a área da região formada pelos pontos desses dois semicírculos que ficam fora de Γ?')
assert 250 <= len(ENUN_B) <= 450, len(ENUN_B)

# ---------------------------------------------------------------- c) Fuvest: círculo inscrito
HIP_c, PER_c = 29, 70
soma_cat = PER_c - HIP_c
assert soma_cat == 41
prod2 = soma_cat ** 2 - HIP_c ** 2             # (a+b)² − (a²+b²) = 2ab
assert (soma_cat ** 2, HIP_c ** 2, prod2) == (1681, 841, 840)
area_c = F(prod2, 4)
assert area_c == 210
semi_c = F(PER_c, 2)
r_c = area_c / semi_c
assert semi_c == 35 and r_c == 6
# os catetos existem e são 20 e 21 (só para conferir; a explicação não os acha)
cats = [(a, b) for a in range(1, 30) for b in range(a, 30) if a * a + b * b == 841 and a + b == 41]
assert cats == [(20, 21)] and 20 * 21 == 420
assert F(314, 100) * 36 == F('113.04') and 3 * 36 + F(14, 100) * 36 == F('113.04') and F(14, 100) * 36 == F('5.04')
fora_c = area_c - F('3.14') * r_c ** 2
assert fora_c == F('96.96') == 210 - F('113.04')
# distratores
assert F('3.14') * 36 == F('113.04')                                   # só o círculo
assert area_c == 210                                                   # só o triângulo
assert 210 - F('3.14') * (area_c / PER_c) ** 2 == F('181.74')          # r = área ÷ perímetro = 3
assert 210 - F('3.14') * 6 == F('191.16')                              # esqueceu de elevar o raio ao quadrado
assert len({float(fora_c), 113.04, 181.74, 191.16, 210}) == 5
# "Sua vez": hipotenusa 5, perímetro 12 → r = 1
sv_soma = 12 - 5
sv_prod = F(sv_soma ** 2 - 25, 2)
assert sv_prod == 12 and F(sv_prod, 2) / F(12, 2) == 1
ENUN_C = ('Um artesão corta painéis de madeira no formato de triângulo retângulo. Em cada painel ele pinta o maior círculo que cabe dentro do triângulo, '
          'encostando nos três lados, e o resto da madeira fica sem pintura, para receber verniz. Para um pedido, ele só anotou estas medidas:\n\n'
          'Medida | Valor\n'
          'Hipotenusa do painel | 29 cm\n'
          'Soma dos três lados | 70 cm\n'
          'Valor de π usado | 3,14\n\n'
          'Qual é, em cm², a área de cada painel que fica sem pintura, isto é, fora do círculo?')
assert 400 <= len(ENUN_C) <= 650, len(ENUN_C)

# ---------------------------------------------------------------- d) Harvard-MIT: o custo só depende de uma distância
AB_d, AD_d, X_d = 20, 12, 8
def custo(y, x=X_d):
    y, x = F(y), F(x)
    flores = 40 * F(AB_d) * y / 2
    grama = 10 * F(AB_d) * (AD_d - y) / 2
    pedras = 25 * (F(AD_d) * x / 2 + F(AD_d) * (AB_d - x) / 2)
    return flores + grama + pedras
for x in (1, 3, 8, 15, 19):
    for y in (2, 5, F(11, 2), 11):
        assert custo(y, x) == 300 * y + 4200            # o x some
assert custo(5) == 5700 and (5700 - 4200) / 300 == 5
assert F(12 * 8, 2) == 48 and F(12 * 12, 2) == 72 and 48 + 72 == 120 == AB_d * AD_d // 2 and 25 * 120 == 3000
assert F(12 * 3, 2) == 18 and F(12 * 17, 2) == 102 and 18 + 102 == 120
# distratores
assert (5700 - 3000) / 400 == F(27, 4) == F('6.75')                    # esqueceu a grama
assert (5700 - 1200 - 1500) / 300 == 10                                # pedras só em 60 m²
assert (5700 - 3000 - 4800) / -300 == 7                                # flores e grama com preços trocados: 100y + 400(12 − y)
assert 100 * 7 + 400 * (12 - 7) + 3000 == 5700
assert AD_d - 5 == 7 and X_d == 8                                      # 7 também é a distância até CD; 8 é o x
assert len({F(27, 4), 7, 8, 10, 5}) == 5
assert custo(F(27, 4)) != 5700 and custo(10) != 5700
# "Sua vez": retângulo 10 por 6, P a 4 de um lado menor: triângulos sobre os lados de 6
assert F(6 * 4, 2) + F(6 * 6, 2) == 30
ENUN_D = ('Uma praça tem o formato de um retângulo ABCD, com AB = 20 m e AD = 12 m. Um ponto P, dentro da praça, fica a 8 m do lado AD. '
          'Ligando P aos quatro vértices, a praça se divide em quatro triângulos: PAB, PBC, PCD e PDA. A prefeitura plantou flores em PAB '
          '(R$ 40 por m²), grama em PCD (R$ 10 por m²) e colocou pedras decorativas em PBC e em PDA (R$ 25 por m²). '
          'O custo total foi de R$ 5 700. A que distância do lado AB está o ponto P?')
assert 400 <= len(ENUN_D) <= 650, len(ENUN_D)

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-pla-00b', materia='Matemática', tema=T, calc=60,
        enunciado=ENUN_B,
        dados=[('Triângulo ABC', 'reto em A; AB = 8 cm; BC = 17 cm'), ('Semicírculos', 'diâmetros AB e AC, para fora do triângulo'),
               ('Circunferência Γ', 'diâmetro BC'), ('Valor de π', 'só se precisar: 3,14'),
               ('Quero', 'área dos semicírculos que fica fora de Γ, em cm²')],
        alts=[('30 cm²', 30, 'Dividiu a área do triângulo por 2 duas vezes: 8 · 15 ÷ 2 ÷ 2'),
              ('60 cm²', 60, 'OK'),
              ('68 cm²', 68, 'Usou a hipotenusa como cateto: 8 · 17 ÷ 2'),
              ('113,43 cm²', 113.4325, 'Somou só os dois semicírculos dos catetos: 3,14 · (8 + 28,125)'),
              ('120 cm²', 120, 'Esqueceu o ÷ 2 da área do triângulo: 8 · 15')],
        resumo='AC = 15 por Pitágoras. Semicírculos: 8π, 28,125π e 36,125π (o da hipotenusa). Fora de Γ: 8π + 28,125π − (36,125π − 60) = 60 cm².',
        ideia='Pitágoras vale também para áreas de semicírculos: os dois dos catetos somam o da hipotenusa, e a parte deles dentro de Γ é o semicírculo de BC menos o triângulo. Os π se cancelam e sobra a área do triângulo.',
        pecas=[('Semicírculo', 'Metade de um círculo: área = π · r · r ÷ 2, com r a metade do diâmetro.'),
               ('Parte fora de Γ', 'O que sobra dos semicírculos dos catetos depois de tirar a parte que cai dentro da circunferência Γ.')],
        formulas=[('circulo', 'Semicírculo', 'π · r · r ÷ 2'), ('triangulo-retangulo', 'Pitágoras', 'hipotenusa² = cateto² + cateto²'),
                  ('triangulo', 'Área do triângulo', 'base · altura ÷ 2')],
        origem=['O meio círculo de Γ do lado do triângulo tem diâmetro BC: é o semicírculo H. Ele se divide em três partes: o triângulo T e dois pedaços, um junto de cada cateto.\n'
                'Os semicírculos dos catetos (S e R) cobrem exatamente esses dois pedaços, mais o que fica fora de Γ. Então, dentro de Γ, os dois têm H − T. O que pedem é S + R − (H − T).'],
        eq='L = S + R − (H − T)',
        leitura='área pedida = semicírculo de AB (S) + semicírculo de AC (R) − o que cai dentro de Γ (semicírculo de BC menos o triângulo)',
        letras=[('L', 'área dos semicírculos que fica fora de Γ (o que a questão quer)'), ('S', 'semicírculo de diâmetro AB'),
                ('R', 'semicírculo de diâmetro AC'), ('H', 'semicírculo de diâmetro BC'), ('T', 'área do triângulo ABC')],
        eq_texto='A parte fora é tudo dos dois semicírculos menos a parte que cai dentro de Γ. Deixe o π escrito, sem trocar por 3,14.\nAgora é só achar T, S, R e H, uma letra por vez.',
        achando=[('Achando T: a área do triângulo',
                  'Falta o cateto AC. Pitágoras ao contrário: AC · AC = 17 · 17 − 8 · 8 = 289 − 64 = 225, e 15 · 15 = 225. AC = 15.\nT = 8 · 15 ÷ 2 = 120 ÷ 2 = 60 cm².'),
                 ('Achando S: semicírculo de AB',
                  'Diâmetro 8, raio 4. S = π · 4 · 4 ÷ 2 = 16π ÷ 2 = 8π.'),
                 ('Achando R: semicírculo de AC',
                  'Diâmetro 15, raio 7,5. 7,5 · 7,5 = 56,25 (75 · 75 = 5 625, com duas casas).\nR = 56,25π ÷ 2 = 28,125π.'),
                 ('Achando H: semicírculo de BC',
                  'Diâmetro 17, raio 8,5. 8,5 · 8,5 = 72,25 (85 · 85 = 7 225, com duas casas).\nH = 72,25π ÷ 2 = 36,125π.\nOlhe: S + R = 8π + 28,125π = 36,125π, o mesmo que H.')],
        volta='L = 8π + 28,125π − (36,125π − 60).\nOs semicírculos dos catetos somam 36,125π, igual a H. Então os π se cancelam: L = 36,125π − 36,125π + 60 = 60.\nL = 60 cm².\nResposta: alternativa X. Conferindo: é a área do triângulo, 8 · 15 ÷ 2.',
        valores=[('T', '60 cm²'), ('S', '8π'), ('R', '28,125π'), ('H', '36,125π'), ('L', '60 cm²')],
        pista='"área pedida entre círculos e um triângulo retângulo" → deixe o π escrito, ache o outro cateto por Pitágoras, escreva cada semicírculo em π e veja o que se cancela.',
        rec1='AB = 8; BC = 17; semicírculos nos catetos; Γ de diâmetro BC', rec3='T = 60; S = 8π; R = 28,125π; H = 36,125π; L = 60',
        checagem=('Triângulo retângulo de catetos 6 cm e 8 cm. Com a mesma construção (semicírculos nos catetos e Γ de diâmetro igual à hipotenusa), qual é a área fora de Γ?',
                  ['24 cm²', '48 cm²', '12 cm²', '30 cm²'], '24 cm²',
                  'Os dois semicírculos dos catetos somam o da hipotenusa, então a área fora é a do triângulo: 6 · 8 ÷ 2 = 24 cm².'),
        ancora=('parcial · ITA 2021 1ª fase q.45 (a resposta sai por uma ideia escondida, sem calcular o que parece essencial) e IME 2025 q.9 (simetria no lugar da conta direta); '
                'lúnulas de Hipócrates não aparecem em nenhuma real do repositório (busca feita nos .txt), só a técnica "o π se cancela" é a mesma'),
        canal='mat-23-area-de-circunferencia-geometria-plana.txt [13:18:02] (área de círculo e a diferença entre duas áreas); as lúnulas e Pitágoras para semicírculos não aparecem no canal',
        antes=['pitagoras', 'pla-area-circulo', 'pla-area-triangulo', 'fracoes'],
    ),
    dict(
        id='d2-escada-mat-ita-pla-00c', materia='Matemática', tema=T, calc=96.96,
        enunciado=ENUN_C,
        dados=[('Painel', 'triângulo retângulo; hipotenusa 29 cm'), ('Soma dos três lados', '70 cm'),
               ('Círculo pintado', 'encosta nos três lados (inscrito)'), ('Valor de π', '3,14'),
               ('Quero', 'área sem pintura (fora do círculo), em cm²')],
        alts=[('96,96 cm²', 96.96, 'OK'),
              ('113,04 cm²', 113.04, 'Deu a área do círculo, não a que sobra: 3,14 · 6 · 6'),
              ('181,74 cm²', 181.74, 'Raio 3 (área ÷ perímetro 70, em vez do semiperímetro 35): 210 − 3,14 · 3 · 3'),
              ('191,16 cm²', 191.16, 'Esqueceu de elevar o raio ao quadrado: 210 − 3,14 · 6'),
              ('210 cm²', 210, 'Deu só a área do triângulo, sem tirar o círculo')],
        resumo='Soma dos catetos 41; 41 · 41 = 1 681 = 841 + 2 · produto, produto 420, área 210. Semiperímetro 35, r = 210 ÷ 35 = 6. Fora: 210 − 3,14 · 36 = 96,96 cm².',
        ideia='Os catetos não são pedidos: só a soma deles (70 − 29) e a hipotenusa dão o produto, e com ele a área. O raio inscrito é a área ÷ semiperímetro (35, não 70), e por fim se tira a área do círculo.',
        pecas=[('Semiperímetro', 'A metade da soma dos três lados: 70 ÷ 2 = 35.'),
               ('Círculo inscrito', 'Encosta nos três lados por dentro. O raio dele é a área do triângulo ÷ semiperímetro.')],
        formulas=[('triangulo-retangulo', 'Pitágoras', 'hipotenusa² = cateto² + cateto²'), ('triangulo', 'Raio do inscrito', 'r = área ÷ semiperímetro'),
                  ('circulo', 'Área do círculo', 'π · r · r')],
        desenho=('Veja o painel: os catetos não são conhecidos, a hipotenusa mede 29 cm e o círculo encosta nos três lados.',
                 'circulo-no-triangulo', ['?', '?', '29 cm', 'r']),
        eq='F = T − 3,14 · r · r',
        leitura='área sem pintura = área do triângulo (T) − área do círculo (3,14 vezes o raio r vezes ele mesmo)',
        letras=[('F', 'área do painel fora do círculo (o que a questão quer)'), ('T', 'área do painel, que é um triângulo retângulo'),
                ('r', 'raio do círculo inscrito')],
        eq_texto='O que fica sem pintura é o painel inteiro menos o círculo.\nAgora é só achar T e r, uma letra por vez.',
        achando=[('Achando T: a área do painel',
                  'Os catetos não foram dados. Some os dois: 70 − 29 = 41. Sempre vale (soma)² = (cateto)² + (cateto)² + 2 · produto. Teste com 3 e 4: 7 · 7 = 49 = 9 + 16 + 2 · 12.\n'
                  'Aqui: 41 · 41 = 1 681. A soma dos quadrados dos catetos é 29 · 29 = 841 (Pitágoras). 1 681 − 841 = 840 = 2 · produto, então produto = 420.\n'
                  'T = produto ÷ 2 = 420 ÷ 2 = 210 cm².'),
                 ('Achando r: o raio do círculo',
                  'Ligue o centro aos três vértices: o painel vira 3 triângulos de altura r, e a área vale r · (soma dos lados) ÷ 2 = r · semiperímetro.\n'
                  'Semiperímetro = 70 ÷ 2 = 35 (não 70). r = 210 ÷ 35 = 6 cm, porque 35 · 6 = 210.')],
        volta='3,14 · 6 · 6 = 3,14 · 36 = 3 · 36 + 0,14 · 36 = 108 + 5,04 = 113,04.\nF = 210 − 113,04 = 96,96 cm².\nResposta: alternativa X. Conferindo: sobra menos que a área do painel (210) e é bem menos que o círculo mais o resto.',
        valores=[('T', '210 cm²'), ('r', '6 cm'), ('círculo', '113,04 cm²'), ('F', '96,96 cm²')],
        pista='"círculo inscrito" com hipotenusa e perímetro → a soma dos catetos é perímetro − hipotenusa; (soma)² − hipotenusa² = 2 · produto; área = produto ÷ 2; r = área ÷ semiperímetro.',
        rec1='hipotenusa 29; perímetro 70; círculo inscrito; π = 3,14', rec3='T = 210; r = 6; F = 96,96',
        checagem=('Triângulo retângulo de hipotenusa 5 cm e soma dos três lados 12 cm. Qual é o raio do círculo inscrito?',
                  ['1 cm', '2 cm', '1,5 cm', '0,5 cm'], '1 cm',
                  'Soma dos catetos 12 − 5 = 7; 49 − 25 = 24 = 2 · produto, produto 12, área 6. Semiperímetro 12 ÷ 2 = 6. r = 6 ÷ 6 = 1 cm.'),
        ancora=('forte · ITA 2021 1ª fase q.45 (raio da circunferência inscrita por área ÷ semiperímetro, sem os lados à vista) com a ideia escondida de '
                'Fuvest 2021 2ª fase M05 (aplicar uma definição nova); a tabela de dados no enunciado é a de Fuvest'),
        canal='fuv-21-geometria-plana-parte-2-3.txt [11:23:30] (circunferência inscrita: tangencia os três lados)',
        antes=['pitagoras', 'pla-inscrito', 'pla-area-circulo', 'multiplicar-decimais'],
    ),
    dict(
        id='d2-escada-mat-ita-pla-00d', materia='Matemática', tema=T, calc=5,
        enunciado=ENUN_D,
        dados=[('Praça ABCD', 'retângulo, AB = 20 m e AD = 12 m'), ('Ponto P', 'dentro da praça, a 8 m do lado AD'),
               ('PAB: flores', 'R$ 40 por m²'), ('PCD: grama', 'R$ 10 por m²'), ('PBC e PDA: pedras', 'R$ 25 por m²'),
               ('Custo total', 'R$ 5 700'), ('Quero', 'distância de P ao lado AB, em m')],
        alts=[('5 m', 5, 'OK'),
              ('6,75 m', 6.75, 'Esqueceu a grama: 400 · y + 3 000 = 5 700'),
              ('7 m', 7, 'Trocou os preços de flores e grama (ou deu a distância até CD): 12 − 5'),
              ('8 m', 8, 'Deu o dado que sobra: a distância de P ao lado AD'),
              ('10 m', 10, 'Contou as pedras em só 60 m², metade da área certa de 120 m²')],
        resumo='Pedras: PDA + PBC = 120 m² (x some), 25 · 120 = 3 000. Flores 400y; grama 100 · (12 − y). 5 700 = 300y + 4 200, y = 5 m.',
        ideia='Os dois triângulos sobre AD e BC somam sempre metade da praça (120 m²), onde quer que P esteja, e a distância de 8 m é dado que sobra. Só flores e grama dependem da distância y até AB: monte o custo em y e resolva.',
        pecas=[('Altura do triângulo', 'A distância da ponta P até o lado da base. Em PAB a altura é y; em PCD é 12 − y.'),
               ('Dado que sobra', 'Os 8 m não mudam o custo: as pedras custam sempre o mesmo.')],
        formulas=[('triangulo', 'Área do triângulo', 'base · altura ÷ 2'), ('retangulo', 'Área do retângulo', 'base × altura'),
                  ('texto', 'Custo de um canteiro', 'preço por m² · área')],
        origem=['Flores, em PAB: base AB = 20 e altura y. Área = 20 · y ÷ 2 = 10y m². Custo = 40 · 10y = 400y.\n'
                'Grama, em PCD: base CD = 20 e altura 12 − y. Área = 10 · (12 − y) m². Custo = 10 · 10 · (12 − y) = 100 · (12 − y).'],
        eq='V = 400 · y + 100 · (12 − y) + g',
        leitura='custo total = flores + grama + gasto com as pedras (g)',
        letras=[('y', 'distância de P ao lado AB, em m (o que a questão quer)'), ('V', 'custo total da obra, em reais'),
                ('g', 'gasto com as pedras, em reais')],
        eq_texto='O custo total é a soma dos três gastos. Flores e grama dependem de y; as pedras eu acho à parte.\nAgora é só achar V e g, e depois y.',
        achando=[('Achando V: o custo total',
                  'O enunciado dá: V = 5 700 reais.'),
                 ('Achando g: o gasto com as pedras',
                  'PDA: base AD = 12, altura 8 (a distância de P ao lado AD). Área = 12 · 8 ÷ 2 = 48 m².\n'
                  'PBC: base BC = 12, altura 20 − 8 = 12. Área = 12 · 12 ÷ 2 = 72 m². Juntas: 48 + 72 = 120 m².\n'
                  'Se P estivesse a 3 m de AD: 12 · 3 ÷ 2 = 18 e 12 · 17 ÷ 2 = 102, e 18 + 102 = 120 também. Os 8 m não importam.\n'
                  'g = 25 · 120 = 3 000 reais.')],
        volta='V = 400 · y + 100 · (12 − y) + 3 000. 100 · (12 − y) = 1 200 − 100 · y. Então V = 300 · y + 4 200.\n5 700 = 300 · y + 4 200. Tire 4 200: 1 500 = 300 · y. y = 1 500 ÷ 300 = 5 m.\n'
              'Resposta: alternativa X. Conferindo: 300 · 5 + 4 200 = 1 500 + 4 200 = 5 700.',
        valores=[('V', '5 700 reais'), ('g', '3 000 reais'), ('y', '5 m')],
        pista='"ponto livre dentro do retângulo, ligado aos vértices" → os triângulos de lados opostos somam metade da área; só o par que tem a distância pedida muda o custo.',
        rec1='AB 20; AD 12; P a 8 do lado AD; R$ 40, 10 e 25 por m²; total 5 700', rec3='V = 5 700; g = 3 000; y = 5',
        checagem=('Retângulo de 10 m por 6 m e um ponto P dentro dele, a 4 m de um lado menor. Quanto valem juntas as áreas dos dois triângulos que têm os lados de 6 m como base?',
                  ['30 m²', '60 m²', '15 m²', '24 m²'], '30 m²',
                  'Alturas 4 e 10 − 4 = 6. Áreas 6 · 4 ÷ 2 = 12 e 6 · 6 ÷ 2 = 18. Juntas 30 m², metade de 60.'),
        ancora=('forte · HMMT fev. 2023 Geometry q.1 (ponto livre dentro do polígono: a soma das áreas dos triângulos sobre lados opostos não depende de onde ele está) '
                'e IME 2021 objetiva do trapézio (áreas de triângulos de mesma altura); aqui o preço faz o custo ficar em função de uma só distância'),
        canal='mat-21-area-de-polignos-geometria-plana.txt [11:31:03] (altura é a distância do vértice até a base)',
        antes=['pla-area-triangulo', 'numero-que-falta'],
    ),
]

MANTER = {
    'd2-escada-mat-ita-pla-00a': {
        'ancora': ('parcial · ENEM 2022 q.167 (CD5; piscina com 5 projetos: somar áreas e decidir por conta, 820 letras) e ENEM 2019 q.142 (CD7; só a coroa nova '
                   'conta, comparada com o estoque de material); aqui a área é de um L, com folga de 10% e arredondamento para pacotes'),
        'canal': 'mat-04-porcentagem.txt [2:06:31] (aumento: valor × 1,1); área de retângulo em mat-21-area-de-polignos-geometria-plana.txt [11:43:30]',
        'antes': ['multiplicar-decimais', 'porcentagem', 'dividir-por-decimal'],
    },
}

ANTES_NOVOS = {
    'pla-area-circulo': {
        'titulo': 'Área do círculo e do semicírculo',
        'linhas': [
            'A área de um círculo é π · r · r, onde r é o raio. O raio é a metade do diâmetro.',
            'Diâmetro 10: raio 5, e a área é π · 5 · 5 = 25π. Pode deixar o π escrito: 25π.',
            'Semicírculo é metade do círculo, então a área é a metade. Diâmetro 10: 25π ÷ 2 = 12,5π.',
            'Outro: diâmetro 6, raio 3. Círculo: π · 9 = 9π. Semicírculo: 9π ÷ 2 = 4,5π.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Círculo e semicírculo', 'cabecalho': ['Diâmetro', 'Raio', 'Círculo', 'Semicírculo'],
                   'linhas': [['10', '5', '25π', '12,5π'], ['6', '3', '9π', '4,5π'], ['4', '2', '4π', '2π']]},
        'exercicios': [
            {'enunciado': 'Um semicírculo tem diâmetro 8. Qual é a área dele, em função de π?', 'alternativas': ['8π', '16π', '4π', '32π'], 'certa': 0,
             'resolucao': '8π: raio 4, círculo π · 16 = 16π, e a metade é 8π.\n16π é o círculo inteiro; 4π é a área do círculo de raio 2; 32π dobra em vez de dividir.'},
            {'enunciado': 'Um semicírculo tem diâmetro 12. Qual é a área dele, em função de π?', 'alternativas': ['18π', '36π', '72π', '12π'], 'certa': 0,
             'resolucao': '18π: raio 6, círculo π · 36 = 36π, e a metade é 18π.\n36π é o círculo inteiro; 72π dobra; 12π usa o diâmetro no lugar de r · r ÷ 2.'},
        ],
    },
    'pla-area-triangulo': {
        'titulo': 'Área do triângulo: base, altura e meio',
        'linhas': [
            'A área de um triângulo é base · altura ÷ 2. A altura é a distância da ponta oposta até a base, em ângulo reto.',
            'Base 12 e altura 5: 12 · 5 = 60, e 60 ÷ 2 = 30.',
            'Qualquer lado pode ser a base. A altura é então a distância da ponta oposta até aquele lado.',
            'No triângulo com canto reto, os dois lados do canto servem: um é a base e o outro, a altura. Lados 6 e 8: 6 · 8 ÷ 2 = 24.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Três triângulos', 'cabecalho': ['Base', 'Altura', 'Base · altura', 'Área'],
                   'linhas': [['12', '5', '60', '30'], ['6', '8', '48', '24'], ['10', '3', '30', '15']]},
        'exercicios': [
            {'enunciado': 'Um triângulo tem base 10 e altura 6. Qual é a área?', 'alternativas': ['30', '60', '16', '8'], 'certa': 0,
             'resolucao': '30: 10 · 6 = 60, e 60 ÷ 2 = 30.\n60 esquece de dividir por 2; 16 soma em vez de multiplicar; 8 é a diferença.'},
            {'enunciado': 'Um triângulo tem base 8 e altura 3. Qual é a área?', 'alternativas': ['12', '24', '11', '5,5'], 'certa': 0,
             'resolucao': '12: 8 · 3 = 24, e 24 ÷ 2 = 12.\n24 esquece de dividir por 2; 11 soma; 5,5 é (8 + 3) ÷ 2.'},
        ],
    },
    'pla-inscrito': {
        'titulo': 'Círculo dentro do triângulo: o raio',
        'linhas': [
            'O círculo inscrito encosta nos três lados por dentro. O raio até o ponto onde encosta forma canto reto com o lado.',
            'Ligue o centro aos 3 vértices: o triângulo vira 3 triângulos, todos de altura r. A área de cada um é lado · r ÷ 2.',
            'Somando: área = (lado + lado + lado) · r ÷ 2. A soma dos lados é o perímetro, e a metade dele é o semiperímetro.',
            'Então área = semiperímetro · r, e r = área ÷ semiperímetro. Lados 3, 4, 5: área 6, semiperímetro 12 ÷ 2 = 6, r = 6 ÷ 6 = 1.',
        ],
        'visual': {'tipo': 'tabela', 'titulo': 'Raio do círculo inscrito', 'cabecalho': ['Lados', 'Área', 'Semiperímetro', 'Raio'],
                   'linhas': [['3, 4, 5', '6', '6', '1'], ['6, 8, 10', '24', '12', '2'], ['5, 12, 13', '30', '15', '2']]},
        'exercicios': [
            {'enunciado': 'Um triângulo de lados 9, 12 e 15 tem canto reto. Qual é o raio do círculo inscrito?', 'alternativas': ['3', '6', '4,5', '18'], 'certa': 0,
             'resolucao': '3: área 9 · 12 ÷ 2 = 54, semiperímetro (9 + 12 + 15) ÷ 2 = 18, e 54 ÷ 18 = 3.\n6 divide por 9; 4,5 divide por 12; 18 é o semiperímetro, não o raio.'},
            {'enunciado': 'Um triângulo de lados 8, 15 e 17 tem canto reto. Qual é o raio do círculo inscrito?', 'alternativas': ['3', '60', '20', '5'], 'certa': 0,
             'resolucao': '3: área 8 · 15 ÷ 2 = 60, semiperímetro (8 + 15 + 17) ÷ 2 = 20, e 60 ÷ 20 = 3.\n60 é a área; 20 é o semiperímetro; 5 divide por 12.'},
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
for _k, _c in ANTES_NOVOS.items():
    for _l in _c['linhas']:
        assert len(_l) <= 170, (_k, len(_l), _l)
    for _e in _c['exercicios']:
        assert _e['alternativas'][_e['certa']].split()[0] in _e['resolucao'].split('\n')[0], (_k, _e['enunciado'])
assert 8 * 15 // 2 == 60 and 60 // 20 == 3 and 54 // 18 == 3  # exercícios do Antes
