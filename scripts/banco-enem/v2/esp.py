"""Geometria Espacial (7º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (MANTER: suco da garrafa em copos cônicos a 80% da altura), b = ITA (copo piramidal que vira e perde um gole),
c = Fuvest (vareta na caixa com só a soma das arestas e a área total), d = Harvard-MIT (caixa cúbica x tubo de bolas, o raio some).
Só junta os degraus 1 a 6 (Aritmética, Grandezas, Estatística, Equações, Funções, Geometria Plana). Toda resposta é conferida por conta Python (assert).
"""
from fractions import Fraction as F
from math import isqrt, pi, sqrt

ARQUIVO = 'matematica-acima-novas.json'
T = 'Geometria Espacial'

# ---------------------------------------------------------------- a) ENEM (MANTER): conferência da conta que já está no JSON
suco_a = pi * 25 * 18                      # garrafa: r = 5, suco até 3/4 de 24 = 18 cm
copo_a = pi * 25 * 9 / 3 * F(4, 5) ** 3    # cone 80% da altura: (0,8)³ do cone cheio
assert abs(float(suco_a / copo_a) - 11.71875) < 1e-9 and int(suco_a / copo_a) == 11  # 11 copos inteiros (alternativa C)
assert F(450) / (F(75) * F(64, 125)) == F(450 * 125, 75 * 64) and F(75) * F(64, 125) == F(192, 5) == F(384, 10)  # 38,4π

# ---------------------------------------------------------------- b) ITA
# pirâmide de base quadrada lado 6 e altura 20; ponta para baixo, bebida até 16 cm; gole de 30 mL; vira; altura da bebida
LADO, ALT, NIVEL, GOLE = 6, 20, 16, 30
V_copo = F(LADO * LADO * ALT, 3)
assert V_copo == 240
V_beb = V_copo * F(NIVEL, ALT) ** 3
assert V_beb == F(12288, 100) == F('122.88') and F(NIVEL, ALT) ** 3 == F(64, 125) == F('0.512')
V_sobra = V_beb - GOLE
assert V_sobra == F('92.88')
V_vazio = V_copo - V_sobra
assert V_vazio == F('147.12') and float(V_vazio / V_copo) == 0.613  # 147,12 ÷ 240 = 0,613
assert F(6, 10) * 240 == 144 and F('3.12') / 240 == F('0.013')
a_vazio = ALT * float(V_vazio / V_copo) ** (1 / 3)
h_bebida = ALT - a_vazio
assert abs(a_vazio - 16.99) < 0.01 and abs(h_bebida - 3.01) < 0.01
# a estimativa do texto: 0,8³ = 0,512 (pouco), 0,9³ = 0,729 (muito), 0,85³ = 0,614125 (quase 0,613)
assert F(4, 5) ** 3 == F('0.512') and F(9, 10) ** 3 == F('0.729')
assert F('0.85') * F('0.85') == F('0.7225') and F('0.7225') * F('0.85') == F('0.614125')
assert abs(float(F('0.614125')) - 0.613) < 0.002 and 20 * F('0.85') == 17 and 20 - 17 == 3
# distratores
sem_gole = ALT - ALT * float((V_copo - V_beb) / V_copo) ** (1 / 3)               # não bebeu: 4,3
assert abs(sem_gole - 4.3) < 0.05
liq80 = F(4, 5) * V_copo                                                          # 80% da altura tomado como 80% do volume
vaz80 = V_copo - (liq80 - GOLE)
d80 = ALT - ALT * float(vaz80 / V_copo) ** (1 / 3)
assert abs(d80 - 6.25) < 0.05                                                     # 6,3
sem_cubo = ALT * (1 - float(V_vazio / V_copo))                                    # altura vai com o volume (sem o cubo): 7,7
assert abs(sem_cubo - 7.74) < 0.05
alt_liq = ALT * float(V_sobra / V_copo) ** (1 / 3)                               # pirâmide da bebida que sobrou (14,6) e ALT − isso
assert abs(alt_liq - 14.6) < 0.05 and abs((ALT - alt_liq) - 5.4) < 0.05
# "Sua vez": 8 cm, 80 cm³, cheio até a borda, ponta para baixo, gole 10 mL: vazio 10/80 = 1/8 = (1/2)³; vazio de 4 cm; bebida 4 cm
assert F(10, 80) == F(1, 8) == F(1, 2) ** 3 and 8 - 8 * F(1, 2) == 4 and 8 * F(7, 8) == 7
ENUN_B = ('Um copo tem a forma de uma pirâmide de base quadrada, de lado 6 cm e altura 20 cm, e está apoiado na ponta, '
          'com bebida até 16 cm de altura. Bebe-se 30 mL e, em seguida, o copo é virado e apoiado na base quadrada. '
          'Qual é, aproximadamente, a altura da bebida no copo virado?')
assert 250 <= len(ENUN_B) <= 400, len(ENUN_B)

# ---------------------------------------------------------------- c) Fuvest
# bloco 6 x 8 x 10 escondido: soma das 12 arestas 96, área total 376
dims = (6, 8, 10)
S_ = sum(dims)
P_ = dims[0] * dims[1] + dims[1] * dims[2] + dims[2] * dims[0]
assert 4 * S_ == 96 and 2 * P_ == 376 and S_ == 24 and P_ == 188
D2 = S_ ** 2 - 2 * P_
assert D2 == 576 - 376 == 200 == sum(x * x for x in dims)
assert 24 * 24 == 576 and 14 * 14 == 196 and 15 * 15 == 225 and isqrt(200) == 14 and abs(sqrt(200) - 14.142) < 1e-3
# a diagonal só depende da soma e da área: qualquer outro bloco com os mesmos dados tem o mesmo D²
for a_ in range(1, 25):
    for b_ in range(a_, 25):
        c_ = 24 - a_ - b_
        if c_ >= b_ and 2 * (a_ * b_ + b_ * c_ + c_ * a_) == 376:
            assert a_ * a_ + b_ * b_ + c_ * c_ == 200
calc_c = isqrt(D2)
assert calc_c == 14
# distratores
assert round(sqrt(200) + 0.5) == 15                                              # arredondou para cima
assert isqrt(576 - 188) == 19 and 576 - 188 == 388                                # subtraiu só metade da área (19,7)
assert 96 // 4 == 24                                                              # parou na soma das dimensões
assert isqrt(576 + 376) == 30 and 576 + 376 == 952                                # somou em vez de subtrair (30,8)
# "Sua vez": bloco 1 x 2 x 2: soma 20 / 4 = 5? usar 3 x 4 x 12: soma das arestas 76, área 192; diagonal 13
sv = (3, 4, 12)
assert 4 * sum(sv) == 76 and 2 * (3 * 4 + 4 * 12 + 12 * 3) == 192 and sum(sv) ** 2 - 192 == 169 == 13 ** 2
ENUN_C = ('Uma fábrica de embalagens guardou, de um modelo de caixa em forma de bloco retangular, apenas estes dois dados, '
          'sem as medidas das arestas:\n\n'
          'Dado | Valor\n'
          'Soma das 12 arestas | 96 cm\n'
          'Área total (as 6 faces) | 376 cm²\n\n'
          'Um artesão quer guardar nessa caixa uma vareta reta, inteira e sem dobrar, que pode encostar nas paredes e nos cantos. '
          'O comprimento da vareta, em centímetros, é um número inteiro. Qual é o maior comprimento possível, em centímetros?')
assert 400 <= len(ENUN_C) <= 700, len(ENUN_C)

# ---------------------------------------------------------------- d) Harvard-MIT
# 8 bolas de raio r (π = 3); caixa cúbica 2 x 2 x 2 (aresta 4r); tubo de 4 camadas de 2 bolas (raio 2r, altura 8r)
PI = 3
bola = F(4, 3) * PI                        # 4 r³ por bola
bolas = 8 * bola
assert bola == 4 and bolas == 32
caixa = 4 * 4 * 4
tubo = PI * 2 * 2 * 8
assert (caixa, tubo) == (64, 96)
vazio_caixa, vazio_tubo = F(caixa - bolas, caixa), F(tubo - bolas, tubo)
assert (vazio_caixa, vazio_tubo) == (F(1, 2), F(2, 3))
razao = vazio_tubo / vazio_caixa
assert razao == F(4, 3) and (razao - 1) * 100 == F(100, 3)
assert F(2, 3) - F(1, 2) == F(1, 6) and (F(1, 6)) / F(1, 2) == F(1, 3)
# independente de r: as frações não mudam com r
for r_ in (F(1), F(1, 2), F(7, 3), F(13)):
    assert (F(4, 3) * PI * r_ ** 3 * 8) / (4 * r_) ** 3 == F(1, 2) == 1 - vazio_caixa
    assert (F(4, 3) * PI * r_ ** 3 * 8) / (PI * (2 * r_) ** 2 * 8 * r_) == F(1, 3) == 1 - vazio_tubo
# distratores
assert round(float(F(1, 6)) * 100, 1) == 16.7                                     # diferença em pontos percentuais
assert (vazio_tubo - vazio_caixa) / vazio_tubo == F(1, 4)                         # base errada: 25%
assert (tubo - bolas) / (caixa - bolas) == 2                                      # vazios absolutos: +100%
assert vazio_caixa * 100 == 50                                                    # fração vazia da caixa
# "Sua vez": frações vazias 1/3 e 1/2: (1/2 − 1/3) ÷ (1/3) = 1/2 = 50%
assert (F(1, 2) - F(1, 3)) / F(1, 3) == F(1, 2) and F(1, 6) / F(1, 2) == F(1, 3) and (F(1, 2) - F(1, 3)) / F(1, 2) == F(1, 3)
ENUN_D = ('Uma loja vende 8 bolas de gude idênticas, de raio r desconhecido, em duas embalagens. Na caixa cúbica, as bolas ficam em '
          '2 camadas de 4, encostadas umas nas outras e nas paredes. No tubo cilíndrico, ficam em 4 camadas de 2 bolas, encostadas umas nas outras, '
          'nas paredes e nas duas tampas. Em cada embalagem, a fração vazia é o volume que não é bola dividido pelo volume da embalagem. '
          'Use π = 3. Em quantos por cento a fração vazia do tubo é maior que a da caixa?')
assert 350 <= len(ENUN_D) <= 600, len(ENUN_D)

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-esp-00b', materia='Matemática', tema=T, calc=round(h_bebida, 2),
        enunciado=ENUN_B,
        dados=[('Copo', 'pirâmide de base quadrada, lado 6 cm, altura 20 cm'), ('Antes', 'ponta para baixo, bebida até 16 cm de altura'),
               ('Gole', '30 mL (1 mL = 1 cm³)'), ('Depois', 'copo virado, apoiado na base'), ('Quero', 'altura da bebida, em cm')],
        alts=[('3,0 cm', round(h_bebida, 2), 'OK'),
              ('4,3 cm', round(sem_gole, 2), 'Esqueceu o gole: vazio de 117,12 cm³, e 20 − 15,7'),
              ('5,4 cm', round(ALT - alt_liq, 2), 'Achou a pirâmide da bebida que sobrou (14,6 cm) e fez 20 − 14,6, como se a bebida ficasse na ponta'),
              ('6,3 cm', round(d80, 2), 'Tomou 80% da altura como 80% do volume (192 cm³), sem o cubo'),
              ('7,7 cm', round(sem_cubo, 2), 'Fez a altura vazia como 0,613 de 20 (sem tirar a raiz cúbica): 20 − 12,3')],
        resumo='Copo: 36 · 20 ÷ 3 = 240 cm³. Bebida: 0,8³ · 240 = 122,88; depois do gole, 92,88. Vazio: 147,12 = 0,613 do copo; k³ = 0,613, k ≈ 0,85 e a ≈ 17 cm. Bebida: 20 − 17 = 3 cm.',
        ideia='Com a ponta para baixo, a bebida é uma pirâmide semelhante ao copo, e o volume vai com o cubo da razão das alturas. Virado o copo, o vazio é a pirâmide pequena do topo: ache a altura dela por tentativa de k · k · k e tire de 20.',
        pecas=[('Semelhante', 'Mesmo formato, tamanho diferente: tudo cresce pela mesma razão k. O volume vai com k · k · k.'),
               ('Raiz cúbica', 'O número que, vezes ele mesmo, vezes ele mesmo, dá o valor. Não precisa ser exata: basta prender entre dois vizinhos.'),
               ('mL e cm³', '1 mL cabe num cubinho de 1 cm de lado: 1 mL = 1 cm³.')],
        formulas=[('cone', 'Volume da pirâmide', '⅓ · área da base · altura'), ('cone', 'Semelhança', 'volume na razão das alturas ao cubo'),
                  ('texto', 'mL e cm³', '1 mL = 1 cm³')],
        desenho=('Veja o copo virado, apoiado na base. A bebida fica embaixo (o tronco) e o vazio é a pirâmide menor do topo. O copo tem 20 cm de altura.',
                 'piramide-cortada',
                 ['20 cm', 'o vazio é a pirâmide menor; a bebida é o tronco', '', '', 'base quadrada de lado 6 cm; desenho fora de escala']),
        eq='h = 20 − a  e  k³ = V ÷ 240', leitura='altura da bebida = 20 − altura do vazio; razão das alturas ao cubo = vazio ÷ volume do copo',
        letras=[('h', 'altura da bebida no copo virado (o que a questão quer)'), ('a', 'altura da pirâmide vazia, no topo'),
                ('k', 'razão entre a altura do vazio e a do copo, a ÷ 20'), ('V', 'volume do vazio, em cm³'),
                ('L', 'bebida que sobra depois do gole, em cm³')],
        eq_texto='A bebida e o vazio dividem os 20 cm do copo. O vazio é uma pirâmide semelhante ao copo, com razão k e volume k³ · 240.\nAgora é só achar L, V, k e a, uma por vez.',
        achando=[('Achando L: a bebida que sobra',
                  'Volume da pirâmide = ⅓ · base · altura. Base = 6 · 6 = 36; 36 · 20 = 720; 720 ÷ 3 = 240 cm³.\nCom a ponta para baixo, a bebida é semelhante ao copo, razão 16 ÷ 20 = 0,8. Volume: 0,8 · 0,8 · 0,8 = 0,512 do copo.\n0,512 · 240 = 122,88 cm³.'),
                 ('Achando L: a bebida que sobra (2 de 2)',
                  'O gole é 30 mL = 30 cm³.\nL = 122,88 − 30 = 92,88 cm³.'),
                 ('Achando V: o vazio',
                  'O copo vazio é o copo todo menos a bebida: V = 240 − 92,88 = 147,12 cm³.\nFração do copo: 147,12 ÷ 240. 240 · 0,6 = 144, sobram 3,12; 3,12 ÷ 240 = 0,013. Fração = 0,613.'),
                 ('Achando k: a razão das alturas',
                  'k · k · k = 0,613. Tentando: 0,8 · 0,8 · 0,8 = 0,512 (pouco) e 0,9 · 0,9 · 0,9 = 0,729 (muito).\nMeio-termo: 0,85 · 0,85 = 0,7225 e 0,7225 · 0,85 = 0,614, quase 0,613. Logo k ≈ 0,85.'),
                 ('Achando a: a altura do vazio',
                  'a = k · 20 = 0,85 · 20 = 17 cm. O vazio é a pirâmide pequena do topo, com cerca de 17 cm de altura.',
                  {'tipo': 'diagrama', 'nome': 'piramide-cortada',
                   'rotulos': ['20 cm', 'o vazio é a pirâmide menor; a bebida é o tronco', '≈ 17 cm', '', 'base quadrada de lado 6 cm; desenho fora de escala']})],
        volta='h = 20 − a = 20 − 17 = 3 cm.\nConferindo: bebida de 3 cm de altura, num copo de 20 cm, fica pouca bebida, e o vazio é a maior parte.\nResposta: alternativa X.',
        valores=[('L', '92,88 cm³'), ('V', '147,12 cm³'), ('k', '≈ 0,85'), ('a', '≈ 17 cm'), ('h', '≈ 3,0 cm')],
        pista='bebida em recipiente de ponta para baixo é um sólido semelhante, e o volume vai com o cubo: ache o vazio (copo − bebida − gole), descubra a altura dele pelo cubo e tire de 20.',
        rec1='pirâmide 6 × 6 × 20; bebida até 16; gole de 30 mL; copo virado', rec3='L = 92,88; V = 147,12; k ≈ 0,85; a ≈ 17; h ≈ 3',
        checagem=('Um copo de pirâmide tem 8 cm de altura e 80 cm³, cheio até a borda com a ponta para baixo. Bebe-se 10 mL e vira-se o copo. Qual a altura da bebida?',
                  ['4 cm', '2 cm', '7 cm', '1 cm'], '4 cm',
                  'Vazio: 10 ÷ 80 = 1/8 = (1/2)³, então o vazio tem 8 · 1/2 = 4 cm de altura. Bebida: 8 − 4 = 4 cm.'),
        ancora='parcial · IME 2021 objetiva, copo de pirâmide invertida que é virado (14º do arquivo resolvido; nº oficial não conferido): volume vai com o cubo e a altura exige estimar uma raiz cúbica por limites; aqui com um gole no meio',
        canal='mat-07-escalas.txt [4:02:32] (comprimento, área e volume mudam por razões diferentes: o volume vai ao cubo); razão de semelhança em fuv-02-geometria-espacial-parte-2-3.txt [1:17:32]',
        antes=['esp-razao-volume', 'esp-raiz-cubica', 'multiplicar-decimais'],
    ),
    dict(
        id='d2-escada-mat-ita-esp-00c', materia='Matemática', tema=T, calc=calc_c,
        enunciado=ENUN_C,
        dados=[('Soma das 12 arestas', '96 cm'), ('Área total (6 faces)', '376 cm²'), ('Medidas da caixa', 'não informadas'),
               ('Vareta', 'reta, inteira, com número inteiro de cm'), ('Quero', 'maior comprimento inteiro, em cm')],
        alts=[('14', 14, 'OK'),
              ('15', 15, 'Arredondou 14,14 para cima: a vareta de 15 cm não cabe'),
              ('19', 19, 'Subtraiu só metade da área: 576 − 188 = 388, e a raiz de 388 é 19,7'),
              ('24', 24, 'Parou em a + b + c = 96 ÷ 4 = 24, a soma das medidas'),
              ('30', 30, 'Somou em vez de subtrair: 576 + 376 = 952, e a raiz de 952 é 30,8')],
        resumo='S = 96 ÷ 4 = 24; P = 376 ÷ 2 = 188; d² = 24² − 2 · 188 = 576 − 376 = 200; 14² = 196 e 15² = 225, então d ≈ 14,1 e a maior vareta inteira tem 14 cm.',
        ideia='A maior vareta é a diagonal do bloco, d² = a² + b² + c², e você não tem a, b e c: mas S² − 2P, com S = a + b + c e P = ab + bc + ca, dá o mesmo valor: as arestas dão S e a área dá P. A vareta é o maior inteiro que cabe.',
        pecas=[('Diagonal do bloco', 'O segmento de um canto ao canto oposto, o maior que cabe na caixa. d² = a² + b² + c².'),
               ('Aresta', 'Cada um dos 12 segmentos onde duas faces se encontram: 4 de cada medida.'),
               ('Inteiro que cabe', 'Se a diagonal é 14,14, a vareta de 14 cabe e a de 15 não.')],
        formulas=[('caixa', 'Diagonal do bloco', 'd² = a² + b² + c²'), ('caixa', 'Soma das 12 arestas', '4 · (a + b + c)'),
                  ('caixa', 'Área total', '2 · (ab + bc + ca)')],
        desenho=('Veja a caixa (desenho fora de escala). As três medidas são a, b e c, e nenhuma delas é dada. A vareta mais comprida vai de um canto ao canto oposto.',
                 'vareta-na-caixa',
                 ['b', 'a', 'c', '', '', 'desenho fora de escala: as medidas a, b e c são desconhecidas']),
        eq='d² = S² − 2 · P', leitura='diagonal ao quadrado = (a + b + c)² − 2 · (ab + bc + ca)',
        letras=[('d', 'diagonal do bloco, a maior vareta possível (o que a questão quer)'), ('S', 'soma das três medidas, a + b + c, em cm'),
                ('P', 'soma dos produtos dois a dois, ab + bc + ca, em cm²')],
        eq_texto='A diagonal vem de a² + b² + c². Pela identidade da aula Antes, isso é S² − 2P, e S e P vêm dos dois dados da tabela.\nAgora é só achar S e P, uma por vez.',
        achando=[('Achando S: a soma das três medidas',
                  'Um bloco tem 12 arestas: 4 de cada medida (a, b e c).\nSoma das arestas = 4a + 4b + 4c = 4 · (a + b + c) = 96.\nS = 96 ÷ 4 = 24 cm.'),
                 ('Achando P: a soma dos produtos',
                  'A área total tem 6 faces, 2 de cada tipo: 2ab + 2bc + 2ca = 2 · (ab + bc + ca) = 376.\nP = 376 ÷ 2 = 188 cm².')],
        volta='d² = S² − 2 · P = 24 · 24 − 2 · 188. 24 · 24 = 576 (24 · 20 = 480 e 24 · 4 = 96) e 2 · 188 = 376. d² = 576 − 376 = 200.\n14 · 14 = 196 (pouco) e 15 · 15 = 225 (muito): d está entre 14 e 15, cerca de 14,1.\nA vareta inteira só cabe se for menor ou igual a d: a maior é 14 cm.\nResposta: alternativa X.',
        valores=[('S', '24 cm'), ('P', '188 cm²'), ('d²', '200 cm²'), ('d', '≈ 14,1 cm; vareta de 14 cm')],
        pista='dados que não dão as medidas: a diagonal d² = (a + b + c)² − 2 · (ab + bc + ca), e as arestas dão a soma e a área dá os produtos; como a vareta é inteira, pegue o maior inteiro que cabe.',
        rec1='soma das arestas 96; área total 376; medidas escondidas', rec3='S = 24; P = 188; d² = 200; d ≈ 14,1',
        checagem=('Uma caixa tem soma das 12 arestas 76 cm e área total 192 cm². Qual o comprimento da diagonal?',
                  ['13 cm', '19 cm', '12 cm', '25 cm'], '13 cm',
                  'S = 76 ÷ 4 = 19; P = 192 ÷ 2 = 96. d² = 19² − 2 · 96 = 361 − 192 = 169, e 13 · 13 = 169.'),
        ancora='forte · Fuvest 2020 1ª fase q.17 (diagonal do paralelepípedo = diâmetro da esfera circunscrita, Pitágoras duas vezes); aqui as medidas ficam escondidas e a diagonal sai de (a + b + c)² − 2 · (ab + bc + ca), a identidade escondida do ITA 2023 q.46',
        canal='fuv-02-geometria-espacial-parte-2-3.txt [0:50:01] (a diagonal pede Pitágoras duas vezes)',
        antes=['pitagoras', 'esp-quadrado-da-soma'],
    ),
    dict(
        id='d2-escada-mat-ita-esp-00d', materia='Matemática', tema=T, calc=float(razao - 1) * 100,
        enunciado=ENUN_D,
        dados=[('Bolas', '8, idênticas, raio r desconhecido'), ('Caixa cúbica', '2 camadas de 4 bolas'),
               ('Tubo cilíndrico', '4 camadas de 2 bolas, encostadas nas tampas'), ('π', '3'),
               ('Quero', 'em quantos % a fração vazia do tubo é maior')],
        alts=[('16,7%', 16.7, 'Subtraiu as frações vazias, 2/3 − 1/2 = 1/6, e deu os pontos percentuais'),
              ('25%', 25, 'Dividiu a diferença pela fração vazia do tubo, e não pela da caixa: (1/6) ÷ (2/3)'),
              ('33,3%', 100 / 3, 'OK'),
              ('50%', 50, 'Respondeu a fração vazia da caixa, 1/2'),
              ('100%', 100, 'Comparou os volumes vazios, 64r³ contra 32r³, e não as frações vazias')],
        resumo='8 bolas: 8 · 4r³ = 32r³. Caixa: (4r)³ = 64r³, fração vazia 32/64 = 1/2. Tubo: 3 · (2r)² · 8r = 96r³, fração vazia 64/96 = 2/3. (2/3 − 1/2) ÷ (1/2) = 1/3 = 33,3%.',
        ideia='Dê o raio r às bolas: tudo vira múltiplo de r³ e o r some das frações. Compare as frações vazias da caixa e do tubo, e use a base certa na porcentagem: quanto mais, sobre o menor.',
        pecas=[('Fração vazia', 'Volume que não é bola ÷ volume da embalagem. Não depende do tamanho do r.'),
               ('Pontos percentuais', 'Diferença simples entre duas porcentagens. É diferente de "quantos % maior".')],
        formulas=[('esfera', 'Volume da esfera', '4/3 · π · r³'), ('cilindro', 'Volume do cilindro', 'π · raio² · altura'),
                  ('porcentagem', 'Quantos % maior', '(maior − menor) ÷ menor')],
        eq='P = (t − c) ÷ c · 100', leitura='percentual = (fração vazia do tubo − fração vazia da caixa) ÷ fração vazia da caixa · 100',
        letras=[('P', 'quantos por cento o vazio do tubo é maior (o que a questão quer)'), ('b', 'volume das 8 bolas, em r³'),
                ('c', 'fração vazia da caixa'), ('t', 'fração vazia do tubo')],
        eq_texto='Quanto mais, sobre o menor: a diferença entre as frações vazias, dividida pela fração vazia da caixa.\nAgora é só achar b, c e t, uma por vez.',
        achando=[('Achando b: as 8 bolas',
                  'Volume da esfera = 4/3 · π · r³ = 4/3 · 3 · r³ = 4r³.\nOito bolas: b = 8 · 4r³ = 32r³.'),
                 ('Achando c: a fração vazia da caixa',
                  'A aresta tem 2 bolas lado a lado: 2 · 2r = 4r. Volume = 4r · 4r · 4r = 64r³.\nVazio = 64r³ − 32r³ = 32r³. Fração: 32 ÷ 64 = 1/2.'),
                 ('Achando t: a fração vazia do tubo',
                  'Duas bolas lado a lado ocupam 4r, então o raio do tubo é 2r. A altura é de 4 camadas: 4 · 2r = 8r.\nVolume = π · (2r)² · 8r = 3 · 4r² · 8r = 96r³. Vazio = 96r³ − 32r³ = 64r³.\nFração: 64 ÷ 96 = 2/3 (dividindo por 32).')],
        volta='t − c = 2/3 − 1/2 = 4/6 − 3/6 = 1/6. Dividindo por c: (1/6) ÷ (1/2) = 1/6 · 2 = 2/6 = 1/3.\nP = 1/3 · 100 = 33,3 (100 ÷ 3). O r sumiu de todas as contas.\nAtenção: 1/6 = 16,7 é a diferença em pontos percentuais, não o "quanto mais".\nResposta: alternativa X.',
        valores=[('b', '32r³'), ('c', '1/2'), ('t', '2/3'), ('P', '33,3%')],
        pista='raio desconhecido → tudo é múltiplo de r³ e o r some das frações; compare as frações vazias, e porcentagem "maior que" divide pela base menor.',
        rec1='8 bolas; caixa 2 × 2 × 2; tubo 4 × 2; π = 3', rec3='B = 32r³; c = 1/2; t = 2/3; P = 33,3%',
        checagem=('A fração vazia de uma embalagem é 1/3 e a de outra é 1/2. Em quantos por cento a segunda é maior que a primeira?',
                  ['50%', '16,7%', '33,3%', '66,7%'], '50%',
                  '(1/2 − 1/3) ÷ (1/3) = (1/6) ÷ (1/3) = 1/2 = 50%. A base é a primeira, a menor.'),
        ancora='parcial · HMMT nov/2020 Theme q.3 (cilindros de raio k: olhar a figura de um lado em vez de somar partes, e a conta se simplifica) e ENEM 2022 q.169 (CD5, cilindro e esferas, o π cancela); aqui o r some das frações vazias e a pegadinha é a base da porcentagem',
        canal='mat-25-cilindro-e-esfera.txt [14:43:00] (volume da esfera 4/3 π r³ e do cilindro); comparar duas embalagens por fração é fora do canal',
        antes=['esp-quanto-maior-em-percentual', 'fracoes', 'porcentagem'],
    ),
]

MANTER = {
    'd2-escada-mat-ita-esp-00a': {
        'ancora': 'forte · ENEM 2022 q.169 (CD5: peça cilíndrica derretida em esferas, razão de volumes e contagem de peças inteiras) e q.147 (CD5: dobrar o diâmetro multiplica o volume por 8); aqui o suco sobra de um cilindro e enche cones a 80% da altura',
        'canal': 'mat-07-escalas.txt [4:02:32] (o volume vai ao cubo da razão); volume do cilindro em mat-25-cilindro-e-esfera.txt [14:43:00]',
        'antes': ['esp-razao-volume', 'multiplicar-decimais', 'dividir-por-decimal'],
    },
}

tabela = lambda titulo, cab, linhas: {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}  # noqa: E731

ANTES_NOVOS = {
    'esp-razao-volume': {
        'titulo': 'Sólidos do mesmo formato: o volume vai ao cubo',
        'linhas': [
            'Dois sólidos de mesmo formato (semelhantes) diferem por uma razão k. Todos os comprimentos são multiplicados por k.',
            'A área é multiplicada por k · k. O volume, por k · k · k, porque tem 3 medidas: largura, comprimento e altura.',
            'Exemplo: dobrar tudo (k = 2) dá 8 vezes o volume (2 · 2 · 2). Metade (k = 1/2) dá 1/8: 1/2 · 1/2 · 1/2 = 1/8.',
            'Copo cônico com a ponta para baixo cheio até metade da altura: a bebida é um cone semelhante e tem 1/8 do copo, não 1/2.',
        ],
        'visual': tabela('Razão k e o volume', ['Razão k', 'Comprimento', 'Área', 'Volume'],
                         [['2', '2 vezes', '4 vezes', '8 vezes'], ['1/2', '1/2', '1/4', '1/8'], ['0,8', '0,8', '0,64', '0,512']]),
        'exercicios': [
            {'enunciado': 'Uma caixa-d\'água de 1 000 L é copiada em um modelo igual, com o dobro de todas as medidas. Qual o volume do modelo?',
             'alternativas': ['8 000 L', '2 000 L', '4 000 L', '6 000 L'], 'certa': 0,
             'resolucao': '8 000 L: k = 2 e o volume vai com 2 · 2 · 2 = 8; 8 · 1 000 = 8 000.\n2 000 é só dobrar; 4 000 é k · k; 6 000 não tem conta que dê.'},
            {'enunciado': 'Um copo cônico de 270 mL está com a ponta para baixo e a bebida chega a 1/3 da altura. Quantos mL de bebida?',
             'alternativas': ['10 mL', '90 mL', '30 mL', '135 mL'], 'certa': 0,
             'resolucao': '10 mL: k = 1/3 e o volume é 1/3 · 1/3 · 1/3 = 1/27; 270 ÷ 27 = 10.\n90 é 1/3 do volume; 30 é 1/9; 135 é a metade.'},
        ],
    },
    'esp-raiz-cubica': {
        'titulo': 'Raiz cúbica por tentativa',
        'linhas': [
            'A raiz cúbica é o número que, vezes ele mesmo, vezes ele mesmo, dá o valor. ∛27 = 3, porque 3 · 3 · 3 = 27.',
            'Quando não é exata, prenda entre dois vizinhos. ∛20: 2 · 2 · 2 = 8 é pouco e 3 · 3 · 3 = 27 é muito, então fica entre 2 e 3.',
            'Afine com uma casa: 2,7 · 2,7 · 2,7 = 19,683, quase 20. Então ∛20 ≈ 2,7.',
            'Com decimais: 0,8 · 0,8 · 0,8 = 0,512 e 0,9 · 0,9 · 0,9 = 0,729. Então ∛0,6 está entre 0,8 e 0,9.',
        ],
        'visual': tabela('Cubos de decimais', ['Número', 'Número · número · número'],
                         [['0,5', '0,125'], ['0,6', '0,216'], ['0,7', '0,343'], ['0,8', '0,512'], ['0,9', '0,729']]),
        'exercicios': [
            {'enunciado': 'Qual destes valores fica mais perto de ∛0,35?',
             'alternativas': ['0,7', '0,35', '0,6', '0,8'], 'certa': 0,
             'resolucao': '0,7: 0,7 · 0,7 = 0,49 e 0,49 · 0,7 = 0,343, quase 0,35.\n0,35 é copiar o número; 0,6 dá 0,216 (pouco); 0,8 dá 0,512 (muito).'},
            {'enunciado': 'Entre quais números inteiros fica ∛100?',
             'alternativas': ['4 e 5', '3 e 4', '9 e 10', '10 e 11'], 'certa': 0,
             'resolucao': '4 e 5: 4 · 4 · 4 = 64 é pouco e 5 · 5 · 5 = 125 é muito.\n3 e 4 fica baixo (64 é menor que 100); 9 e 10 e 10 e 11 vêm da raiz quadrada.'},
        ],
    },
    'esp-quadrado-da-soma': {
        'titulo': 'O quadrado de uma soma de três números',
        'linhas': [
            'Para dois números: (a + b)² = a² + b² + 2 · a · b. Teste: (2 + 3)² = 25 e 4 + 9 + 12 = 25.',
            'Para três números: (a + b + c)² = a² + b² + c² + 2 · (a·b + b·c + c·a).',
            'Teste com 1, 2 e 3: (1 + 2 + 3)² = 36. E 1 + 4 + 9 = 14; a·b + b·c + c·a = 2 + 6 + 3 = 11; 14 + 2 · 11 = 36.',
            'Ao contrário: sabendo a soma e os produtos dois a dois, a² + b² + c² = (a + b + c)² − 2 · (a·b + b·c + c·a).',
        ],
        'visual': tabela('Três números', ['Números', 'a + b + c', 'a² + b² + c²', 'a·b + b·c + c·a'],
                         [['1, 2, 3', '6', '14', '11'], ['2, 3, 4', '9', '29', '26'], ['1, 1, 1', '3', '3', '3']]),
        'exercicios': [
            {'enunciado': 'Três números somam 10 e a soma dos produtos dois a dois é 31. Quanto vale a² + b² + c²?',
             'alternativas': ['38', '69', '100', '131'], 'certa': 0,
             'resolucao': '38: (a + b + c)² = 100 e 2 · 31 = 62; 100 − 62 = 38.\n69 é 100 − 31 (esqueceu o 2); 100 ignora os produtos; 131 soma em vez de subtrair.'},
            {'enunciado': 'Três números somam 12 e a soma dos quadrados é 56. Quanto vale a·b + b·c + c·a?',
             'alternativas': ['44', '88', '72', '200'], 'certa': 0,
             'resolucao': '44: 12² = 144; 144 − 56 = 88 e 88 ÷ 2 = 44.\n88 esquece de dividir por 2; 72 é a metade de 144; 200 soma em vez de subtrair.'},
        ],
    },
    'esp-quanto-maior-em-percentual': {
        'titulo': 'Quantos por cento maior? E pontos percentuais',
        'linhas': [
            'Para saber em quantos % A é maior que B: (A − B) ÷ B, e depois · 100. A base é B, o que você compara.',
            'Exemplo: 30 e 24. (30 − 24) ÷ 24 = 6/24 = 1/4 = 25%. Então 30 é 25% maior que 24.',
            'Não vale o contrário: 24 é menor que 30 em 6/30 = 1/5 = 20%. A base mudou.',
            'Ponto percentual é só a diferença entre duas porcentagens: de 40% a 50% são 10 pontos, mas 50 é 25% maior que 40 (10 ÷ 40).',
        ],
        'visual': tabela('Maior em quantos %', ['Comparar', 'Conta', 'Resultado'],
                         [['30 contra 24', '6 ÷ 24', '25% maior'], ['24 contra 30', '6 ÷ 30', '20% menor'], ['50% contra 40%', '10 ÷ 40', '25% maior (10 pontos)']]),
        'exercicios': [
            {'enunciado': 'Uma tarifa foi de R$ 8 para R$ 10. Em quantos por cento aumentou?',
             'alternativas': ['25%', '20%', '2%', '80%'], 'certa': 0,
             'resolucao': '25%: (10 − 8) ÷ 8 = 2/8 = 1/4 = 25%.\n20% é dividir por 10 (base errada); 2% é só a diferença; 80% é 8 ÷ 10.'},
            {'enunciado': 'Numa turma, 40% gostam de A e 60% gostam de B. A porcentagem de B é quantos por cento maior que a de A?',
             'alternativas': ['50%', '20%', '33,3%', '100%'], 'certa': 0,
             'resolucao': '50%: (60 − 40) ÷ 40 = 20/40 = 1/2 = 50%.\n20% é só a diferença em pontos; 33,3% é 20 ÷ 60 (base errada); 100% é 40 + 60.'},
        ],
    },
}

for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('esp-'), _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['resolucao'].split('\n')[0].count(_e['alternativas'][_e['certa']].split(' ')[0]) >= 1
        assert len(set(_e['alternativas'])) == len(_e['alternativas'])
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), _q['id']
    assert len(_q['ideia']) <= 300, (_q['id'], len(_q['ideia']))
    assert all(l not in 'ABCDE' for l, _ in _q['letras']), _q['id']
    assert len({l for l, _ in _q['letras']}) == len(_q['letras'])
