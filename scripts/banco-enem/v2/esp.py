"""Geometria Espacial (7º degrau de Matemática), nível acima v2, 23/11/2026; corrigido pelas leituras do aluno-do-zero em 24/11/2026.

a = ENEM (suco do concentrado, diluído, com perda, em copos cônicos a 80% da altura), b = ITA (copo piramidal que vira e perde um gole),
c = Fuvest (vareta com espuma na caixa, só soma das arestas e área total, em metros), d = Harvard-MIT (caixa x tubo de bolas, o r some).
Só junta os degraus 1 a 6 (Aritmética, Grandezas, Estatística, Equações, Funções, Geometria Plana). Toda resposta é conferida por conta Python (assert).
Letras das equações: abreviações próprias (nunca A a E, nunca iguais entre si na mesma questão).
"""
from fractions import Fraction as F
from math import isqrt, pi, sqrt

ARQUIVO = 'matematica-acima-novas.json'
T = 'Geometria Espacial'

# ---------------------------------------------------------------- a) ENEM (difícil: mistura 2:1, perda de 10%, cone a 80%)
# garrafa r = 5, suco até 3/4 de 24 = 18 cm; 2 partes de concentrado para 1 de água; perde 10%; copo cone r = 5, h = 9, servido a 80%
vs_a = F(25 * 18)                         # em unidades de π
assert vs_a == 450 and 24 // 4 * 3 == 18 and 25 * 18 == 25 * 10 + 25 * 8
vm_a = vs_a / 2 * 3                       # 1 parte = 225, mistura = 3 partes
assert vm_a == 675 and vs_a / 2 == 225
vu_a = vm_a * F(9, 10)
assert vu_a == F('607.5') and 675 * 9 == 6075
copo_cheio = F(25 * 9, 3)
assert copo_cheio == 75 and 25 * 9 == 225
vc_a = copo_cheio * F(4, 5) ** 3
assert F(4, 5) ** 3 == F('0.512') and F('0.8') * F('0.8') == F('0.64') and F('0.64') * F('0.8') == F('0.512')
assert vc_a == F('38.4') and 75 * 512 == 38400 and 75 * 500 == 37500 and 75 * 12 == 900
n_a = vu_a / vc_a
assert abs(float(n_a) - 15.8203125) < 1e-9 and int(n_a) == 15
assert 6075 == 384 * 15 + 315 and 384 * 15 == 5760 and 315 < 384 and 384 * 10 == 3840 and 384 * 5 == 1920
assert F('38.4') * 15 == 576 and F('38.4') * 16 == F('614.4') and 576 <= vu_a < F('614.4')
assert 576 == 384 + 192 and F('614.4') == 576 + F('38.4')
# distratores
assert int(vu_a / (75 * F(4, 5))) == 10 and 75 * F(4, 5) == 60            # 80% da altura como 80% do volume: 10,1
assert int(vs_a / vc_a) == 11 and abs(float(vs_a / vc_a) - 11.71875) < 1e-9  # concentrado puro, sem água e sem perda
assert round(float(n_a)) == 16                                              # arredondou para cima
assert int(vm_a / vc_a) == 17 and abs(float(vm_a / vc_a) - 17.578125) < 1e-9  # esqueceu a perda
# "Sua vez": 100π de suco, 1 parte de suco para 1 de água (200π), copo 20π a 50% da altura: 20π/8 = 2,5π; 200 ÷ 2,5 = 80
assert F(100) * 2 == 200 and F(20) * F(1, 2) ** 3 == F('2.5') and F(200) / F('2.5') == 80 and F(100) / F('2.5') == 40
ENUN_A = ('Numa lanchonete, o suco de laranja concentrado é guardado em garrafas de vidro cilíndricas que têm 10 cm de diâmetro interno e '
          '24 cm de altura. No fim do dia, sobrou uma garrafa com o concentrado até 3/4 da altura. Para a degustação grátis do dia seguinte, '
          'o dono vai misturar esse concentrado com água, na proporção de 2 partes de concentrado para 1 parte de água, e servir em copos de papel '
          'em forma de cone com a ponta para baixo, com 10 cm de diâmetro na boca e 9 cm de altura, comprados a R$ 0,30 cada. '
          'Para o suco não derramar, cada copo é servido só até 80% da altura (e não até a borda), e não se servem copos pela metade. '
          'Na preparação, 10% da mistura fica agarrada na jarra e nas paredes e se perde. Considere que o suco não faz espuma. '
          'Quantos copos o dono consegue servir completamente?')
assert 600 <= len(ENUN_A) <= 1000, len(ENUN_A)

# ---------------------------------------------------------------- b) ITA
# pirâmide de base quadrada lado 6 e altura 20; ponta para baixo, bebida até 16 cm; gole de 30 mL; vira; altura da bebida
LADO, ALT, NIVEL, GOLE = 6, 20, 16, 30
V_copo = F(LADO * LADO * ALT, 3)
assert V_copo == 240 and 36 * 20 == 720 and 720 // 3 == 240
V_beb = V_copo * F(NIVEL, ALT) ** 3
assert V_beb == F(12288, 100) == F('122.88') and F(NIVEL, ALT) ** 3 == F(64, 125) == F('0.512') and F(16, 20) == F(8, 10)
assert 512 * 24 == 12288 and 512 * 20 == 10240 and 512 * 4 == 2048
V_sobra = V_beb - GOLE
assert V_sobra == F('92.88')
V_vazio = V_copo - V_sobra
assert V_vazio == F('147.12') and float(V_vazio / V_copo) == 0.613  # 147,12 ÷ 240 = 0,613
assert F('147.12') / 240 == F('14.712') / 24 and 24 * F('0.6') == F('14.4') and F('14.712') - F('14.4') == F('0.312') and 24 * F('0.013') == F('0.312')
a_vazio = ALT * float(V_vazio / V_copo) ** (1 / 3)
h_bebida = ALT - a_vazio
assert abs(a_vazio - 16.99) < 0.01 and abs(h_bebida - 3.01) < 0.01
# a estimativa do texto: 0,8³ = 0,512 (pouco), 0,9³ = 0,729 (muito), 0,85³ = 0,614125 (quase 0,613)
assert F(4, 5) ** 3 == F('0.512') and F(9, 10) ** 3 == F('0.729')
assert F('0.85') * F('0.85') == F('0.7225') and F('0.7225') * F('0.85') == F('0.614125')
assert abs(float(F('0.614125')) - 0.613) < 0.002 and 20 * F('0.85') == 17 and 20 - 17 == 3
# erro do 0,85: o cubo passa 0,613 em 0,001125; dk = 0,001125 ÷ (3 · 0,85²) < 0,001 e vezes 20 < 0,02 cm; alternativas distam ≥ 0,9 cm
assert (0.614125 - 0.613) / (3 * 0.85 ** 2) < 0.001 and 20 * (0.614125 - 0.613) / (3 * 0.85 ** 2) < 0.02
assert abs(6.3 - 5.4 - 0.9) < 1e-9 and 20 * F('0.85') == 17
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
# bloco 6 x 8 x 10 escondido: soma das 12 arestas 0,96 m, área total 0,0376 m², espuma de 1 cm em cada ponta da vareta
dims = (6, 8, 10)
S_ = sum(dims)
P_ = dims[0] * dims[1] + dims[1] * dims[2] + dims[2] * dims[0]
assert 4 * S_ == 96 and 2 * P_ == 376 and S_ == 24 and P_ == 188
assert F('0.96') * 100 == 96 and F('0.0376') * 100 * 100 == 376            # m -> cm e m² -> cm²
D2 = S_ ** 2 - 2 * P_
assert D2 == 576 - 376 == 200 == sum(x * x for x in dims)
assert 24 * 24 == 576 == 24 * 20 + 24 * 4 and 24 * 20 == 480 and 24 * 4 == 96
assert 14 * 14 == 196 and 15 * 15 == 225 and isqrt(200) == 14 and abs(sqrt(200) - 14.142) < 1e-3
assert F('14.1') ** 2 == F('198.81') and F('14.2') ** 2 == F('201.64')       # 14,1 < dg < 14,2
# a diagonal só depende da soma e da área: qualquer outro bloco com os mesmos dados tem o mesmo D²
for a_ in range(1, 25):
    for b_ in range(a_, 25):
        c_ = 24 - a_ - b_
        if c_ >= b_ and 2 * (a_ * b_ + b_ * c_ + c_ * a_) == 376:
            assert a_ * a_ + b_ * b_ + c_ * c_ == 200
# identidade mostrada na explicação, com 1, 2 e 3
assert 6 * 6 == 36 and 1 + 4 + 9 == 14 and 1 * 2 + 2 * 3 + 3 * 1 == 11 and 14 + 2 * 11 == 36
assert 4 * 2 + 4 * 3 == 20 == 4 * (2 + 3)
FOLGA = 2                                   # 1 cm em cada ponta
DG = sqrt(D2)
assert 14.1 < DG < 14.2
calc_c = int(DG - FOLGA)
assert calc_c == 12 and 12 + 2 == 14 < 14.1 and 13 + 2 == 15 > 14.2
# distratores
assert int(DG - 1) == 13                                                          # descontou só 1 cm no total
assert int(DG) == 14                                                              # esqueceu a espuma
assert int(sqrt(576 - 188) - FOLGA) == 17 and abs(sqrt(388) - 19.698) < 1e-3      # subtraiu só metade da área
assert int(sqrt(576 - 37.6) - FOLGA) == 21 and abs(sqrt(538.4) - 23.2) < 0.01    # 0,0376 m² lido como 37,6 cm²
# "Sua vez": bloco 3 x 4 x 12: soma das arestas 76, área 192; diagonal 13
sv = (3, 4, 12)
assert 4 * sum(sv) == 76 and 2 * (3 * 4 + 4 * 12 + 12 * 3) == 192 and sum(sv) ** 2 - 192 == 169 == 13 ** 2
ENUN_C = ('Uma fábrica de embalagens guardou, de um modelo de caixa em forma de bloco retangular, apenas estes dados, '
          'sem as medidas das arestas:\n\n'
          'Dado | Valor\n'
          'Soma das 12 arestas | 0,96 m\n'
          'Área total (as 6 faces) | 0,0376 m²\n'
          'Peso da caixa vazia | 120 g\n\n'
          'Um artesão quer guardar nessa caixa uma vareta reta, protegida por uma espuma de 1 cm em cada ponta: a vareta com as duas '
          'espumas é que precisa caber inteira, sem dobrar, podendo encostar nas paredes e nos cantos. '
          'O comprimento da vareta, sem a espuma, é um número inteiro de centímetros. Qual é o maior comprimento possível, em centímetros?')
assert 400 <= len(ENUN_C) <= 800, len(ENUN_C)

# ---------------------------------------------------------------- d) Harvard-MIT
# 8 bolas de raio r (π = 3); caixa cúbica 2 x 2 x 2 (aresta 4r); tubo de 4 camadas de 2 bolas (raio 2r, altura 8r)
# caixa nova: mesma base 4r x 4r, altura hn, com a mesma fração vazia do tubo (2/3)
PI = 3
bola = F(4, 3) * PI                        # 4 r³ por bola
bolas = 8 * bola
assert bola == 4 and bolas == 32
tubo = PI * 2 * 2 * 8
assert tubo == 96 and 3 * 4 == 12 and 12 * 8 == 96
fc = F(bolas, tubo)
assert fc == F(1, 3) and tubo == 3 * 32 and 1 - fc == F(2, 3)
vn = bolas / fc
assert vn == 96 and 3 * 32 == 96
base_nova = 4 * 4
hn = F(vn, base_nova)
assert hn == 6 and 96 // 16 == 6
pc = (hn - 4) / 4 * 100
assert pc == 50
# independente de r: tudo cresce com r³ e a altura com r
for r_ in (F(1), F(1, 2), F(7, 3), F(13)):
    b_ = F(4, 3) * PI * r_ ** 3 * 8
    t_ = PI * (2 * r_) ** 2 * 8 * r_
    assert b_ / t_ == F(1, 3) and 3 * b_ / (4 * r_) ** 2 == 6 * r_ and (6 * r_ - 4 * r_) / (4 * r_) * 100 == 50
# distratores
assert round(float(F(2, 3) - F(1, 2)) * 100, 1) == 16.7                          # diferença das frações vazias (pontos percentuais)
assert round(float(F(2, 6)) * 100, 1) == 33.3 and abs((6 - 4) / 6 * 100 - 100 / 3) < 1e-9   # base errada: a altura nova
assert round(float(F(2, 3)) * 100, 1) == 66.7                                     # a própria fração vazia do tubo
assert (tubo - bolas) / (4 ** 3 - bolas) * 100 - 100 == 100                       # vazios absolutos: +100%
# "Sua vez": bolas 10 cm³ ocupam 1/2 de caixa de base 5 cm²: total 20, altura 4; a 1/4: total 40, altura 8; (8 − 4) ÷ 4 = 100%
assert 10 * 2 == 20 and 20 / 5 == 4 and 10 * 4 == 40 and 40 / 5 == 8 and (8 - 4) / 4 * 100 == 100
ENUN_D = ('Uma loja vende 8 bolas de gude idênticas, de raio r desconhecido, em duas embalagens. Na caixa cúbica, as bolas ficam em '
          '2 camadas de 4, encostadas umas nas outras e nas paredes. No tubo cilíndrico, ficam em 4 camadas de 2 bolas, cada camada bem em cima da outra '
          '(empilhadas retas, sem encaixe), encostadas umas nas outras, nas paredes e nas duas tampas. A fração vazia de uma embalagem é o volume '
          'que não é bola dividido pelo volume dela. A loja quer fabricar uma caixa nova, com a mesma base quadrada da caixa cúbica, só que mais alta, '
          'para que a fração vazia dela seja igual à do tubo. Use π = 3. Em quantos por cento a altura da caixa nova é maior que a da caixa cúbica?')
assert 400 <= len(ENUN_D) <= 900, len(ENUN_D)

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-esp-00a', materia='Matemática', tema=T, calc=int(n_a),
        enunciado=ENUN_A,
        dados=[('Garrafa', 'diâmetro 10 cm, altura 24 cm, concentrado até 3/4'), ('Mistura', '2 partes de concentrado para 1 de água'),
               ('Perda', '10% da mistura'), ('Copo (cone)', 'diâmetro 10 cm, altura 9 cm'), ('Servir', 'até 80% da altura do copo'),
               ('Preço do copo', 'R$ 0,30: não entra na conta'), ('Quero', 'número de copos completos')],
        alts=[('10', 10, 'Tomou 80% da altura como 80% do volume do copo (60π): 607,5 ÷ 60 = 10,1'),
              ('11', 11, 'Serviu o concentrado puro, sem água e sem perda: 450 ÷ 38,4 = 11,7'),
              ('15', 15, 'OK'),
              ('16', 16, 'Arredondou 15,8 para cima: o 16º copo não enche (614,4 é mais que 607,5)'),
              ('17', 17, 'Esqueceu a perda de 10%: 675 ÷ 38,4 = 17,6')],
        resumo='Concentrado: π · 25 · 18 = 450π; mistura 2:1: 450π ÷ 2 · 3 = 675π; sem a perda de 10%: 675π · 0,9 = 607,5π. Copo a 80%: 75π · 0,512 = 38,4π. 607,5 ÷ 38,4 = 15,8: 15 copos.',
        ideia='O suco servido até 80% da altura forma um cone menor semelhante ao copo, e o volume vai com o cubo da razão. Antes, ache quanto líquido existe de fato: concentrado, mais a água da mistura, menos a perda. Conte só os copos inteiros.',
        pecas=[('Semelhante', 'Mesmo formato, tamanho diferente: tudo cresce na mesma razão.'),
               ('Partes', '2 partes de concentrado e 1 de água: a mistura tem 3 partes, e o concentrado é 2 delas.'),
               ('Copos inteiros', 'Só conta o copo que enche: 15 copos e um pouco são 15.')],
        formulas=[('circulo', 'π (pi)', 'número fixo, cerca de 3,14'), ('cilindro', 'Volume do cilindro', 'π · raio · raio · altura'),
                  ('cone', 'Volume do cone', '⅓ · π · raio · raio · altura'), ('cone', 'Por que ⅓', 'o cone cabe 3 vezes no cilindro igual')],
        eq='nc = vu ÷ vc', leitura='número de copos = mistura que sobrou depois da perda ÷ volume de um copo, só copos inteiros',
        letras=[('nc', 'número de copos (o que a questão quer)'), ('vs', 'concentrado da garrafa, em cm³'),
                ('vm', 'mistura pronta, com a água, em cm³'), ('vu', 'mistura que sobra depois da perda de 10%, em cm³'),
                ('vc', 'suco de um copo servido a 80% da altura, em cm³')],
        eq_texto='Cada copo leva vc de mistura; a mistura útil é vu. Dividindo, vê-se quantos copos. vu nasce de vs: mistura com água, depois a perda.\nAgora é só achar vs, vm, vu e vc, uma por vez.',
        achando=[('Achando vs: o concentrado da garrafa',
                  '3/4 de 24: 24 ÷ 4 = 6 e 6 · 3 = 18 cm de altura. Raio = diâmetro ÷ 2 = 5 cm. Volume = π · raio · raio · altura = π · 5 · 5 · 18 = π · 25 · 18. 25 · 18 = 250 + 200 = 450. vs = 450π cm³ (π é só um número fixo; vai se cortar no fim).'),
                 ('Achando vm: a mistura com água',
                  '2 partes de concentrado para 1 de água: 3 partes no total. O concentrado (450π) é 2 partes: 1 parte = 450π ÷ 2 = 225π. A mistura tem 3 partes: vm = 3 · 225π = 675π cm³.'),
                 ('Achando vu: depois da perda',
                  'Perde 10%, então fica 90% = 90 ÷ 100 = 0,9 da mistura. 675 · 0,9: 675 · 9 = 6 075 (675 · 10 = 6 750 menos 675) e uma casa depois da vírgula: 607,5. vu = 607,5π cm³.'),
                 ('Achando vc: o copo cheio',
                  'Volume do cone = ⅓ · π · raio · raio · altura = ⅓ · π · 5 · 5 · 9. 25 · 9 = 225 e 225 ÷ 3 = 75. O copo cheio tem 75π cm³.',
                  ),
                 ('Achando vc: o copo a 80% (2 de 3)',
                  '80% = 80 ÷ 100 = 0,8. O suco forma um cone menor com o mesmo formato do copo (semelhante), razão 0,8. O volume depende de 3 medidas, então vai com 0,8 · 0,8 · 0,8: 0,8 · 0,8 = 0,64 e 0,64 · 0,8 = 0,512.'),
                 ('Achando vc: o copo a 80% (3 de 3)',
                  '75π · 0,512: 75 · 512 = 38 400 (75 · 500 = 37 500 e 75 · 12 = 900). 0,512 tem três casas depois da vírgula, então 38 400 vira 38,4. vc = 38,4π cm³.')],
        volta='nc = 607,5π ÷ 38,4π. O π some: 6π ÷ 3π = 2, igual a 6 ÷ 3. Fica 607,5 ÷ 38,4 = 6 075 ÷ 384 (vezes 10 nos dois). 384 · 15 = 5 760 (3 840 + 1 920) e sobram 315, menos que 384: dá 15 e um pouco (≈ 15,8).\nSó os completos: 15 · 38,4 = 576 cabe em 607,5; 16 · 38,4 = 614,4 passa.\nResposta: alternativa X.',
        valores=[('vs', '450π cm³'), ('vm', '675π cm³'), ('vu', '607,5π cm³'), ('vc', '38,4π cm³'), ('nc', '15 copos')],
        pista='servir até 80% da altura forma um cone semelhante: o volume vai com 0,8 · 0,8 · 0,8; antes de dividir, ache o líquido de verdade (mistura com água, menos a perda).',
        rec1='garrafa 10 × 24 até 3/4; mistura 2:1; perda 10%; copo cone a 80%', rec3='vs = 450π; vm = 675π; vu = 607,5π; vc = 38,4π; nc = 15',
        checagem=('Sobraram 100π cm³ de suco, misturado com água na proporção de 1 parte de suco para 1 de água. Cada copo cônico cheio tem 20π cm³ e é servido até 50% da altura. Sem perdas, quantos copos?',
                  ['20', '40', '80', '160'], '80',
                  'Mistura: 100π é 1 parte, então 2 partes = 200π. A 50% da altura o volume é (1/2)³ = 1/8 de 20π = 2,5π. 200 ÷ 2,5 = 80.'),
        ancora='forte · ENEM 2022 q.169 (CD5: peça cilíndrica derretida em esferas, razão de volumes e contagem de peças inteiras) e q.147 (CD5: dobrar o diâmetro multiplica o volume por 8); aqui o suco sobra de um cilindro, é diluído, perde 10% e enche cones a 80% da altura',
        canal='mat-07-escalas.txt [4:02:32] (o volume vai ao cubo da razão); volume do cilindro em mat-25-cilindro-e-esfera.txt [14:43:00]',
        antes=['esp-razao-volume', 'esp-mistura-em-partes', 'porcentagem', 'multiplicar-decimais', 'dividir-por-decimal'],
    ),
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
        resumo='Copo: 36 · 20 ÷ 3 = 240 cm³. Bebida: 0,8³ · 240 = 122,88; depois do gole, 92,88. Vazio: 147,12 = 0,613 do copo; kr · kr · kr = 0,613, kr ≈ 0,85 e av ≈ 17 cm. Bebida: 20 − 17 = 3 cm.',
        ideia='Com a ponta para baixo, a bebida é uma pirâmide semelhante ao copo, e o volume vai com o cubo da razão das alturas. Virado o copo, o vazio é a pirâmide pequena do topo: ache a altura dela por tentativa de kr · kr · kr e tire de 20.',
        pecas=[('Semelhante', 'Mesmo formato, tamanho diferente: tudo cresce pela mesma razão. O volume vai com razão · razão · razão.'),
               ('Raiz cúbica', 'O número que, vezes ele mesmo, vezes ele mesmo, dá o valor. Não precisa ser exata: basta prender entre dois vizinhos.'),
               ('mL e cm³', '1 mL cabe num cubinho de 1 cm de lado: 1 mL = 1 cm³.')],
        formulas=[('cone', 'Volume da pirâmide', '⅓ · área da base · altura'), ('cone', 'Por que ⅓', 'a pirâmide cabe 3 vezes no prisma igual'),
                  ('cone', 'Semelhança', 'volume na razão das alturas ao cubo'), ('texto', 'mL e cm³', '1 mL = 1 cm³')],
        desenho=('Veja o copo virado, apoiado na base. A bebida fica embaixo (o tronco) e o vazio é a pirâmide menor do topo. O copo tem 20 cm de altura.',
                 'piramide-cortada',
                 ['20 cm', 'o vazio é a pirâmide menor; a bebida é o tronco', '', '', 'base quadrada de lado 6 cm; desenho fora de escala']),
        eq='hb = 20 − av  e  kr · kr · kr = vv ÷ vp',
        leitura='altura da bebida = 20 − altura do vazio; razão das alturas ao cubo = volume do vazio ÷ volume do copo todo',
        letras=[('hb', 'altura da bebida no copo virado (o que a questão quer)'), ('av', 'altura da pirâmide vazia, no topo'),
                ('kr', 'razão entre a altura do vazio e a do copo, av ÷ 20'), ('vv', 'volume do vazio, em cm³'),
                ('vs', 'bebida que sobra depois do gole, em cm³'), ('vp', 'volume do copo todo, em cm³')],
        eq_texto='A bebida e o vazio dividem os 20 cm do copo. O vazio é uma pirâmide semelhante ao copo, com razão kr e volume kr · kr · kr · vp.\nAgora é só achar vp, vs, vv, kr e av, uma por vez.',
        achando=[('Achando vp: o copo todo',
                  'Base quadrada = 6 · 6 = 36 cm². A pirâmide cabe 3 vezes no prisma de mesma base e altura (por isso o ⅓). Volume = ⅓ · base · altura = ⅓ · 36 · 20 = 720 ÷ 3 = 240 cm³.'),
                 ('Achando vs: a bebida que sobra',
                  'Ponta para baixo, a bebida é uma pirâmide do mesmo formato do copo (semelhante), razão das alturas 16 ÷ 20 = 8 ÷ 10 = 0,8 (dividindo por 2). O volume vai com 0,8 · 0,8 · 0,8: 0,8 · 0,8 = 0,64 e 0,64 · 0,8 = 0,512 do copo.'),
                 ('Achando vs: a bebida que sobra (2 de 2)',
                  '0,512 · 240: 512 · 24 = 12 288 (512 · 20 = 10 240 e 512 · 4 = 2 048). Três casas depois da vírgula: 12,288, e vezes 10 (240 = 24 · 10): 122,88 cm³. O gole é 30 mL = 30 cm³. vs = 122,88 − 30 = 92,88 cm³.'),
                 ('Achando vv: o vazio',
                  'vv = 240 − 92,88 = 147,12 cm³. Fração do copo: 147,12 ÷ 240. Corte um zero dos dois: 14,712 ÷ 24. 24 · 0,6 = 14,4 e 14,712 − 14,4 = 0,312; 24 · 0,013 = 0,312. A fração é 0,6 + 0,013 = 0,613.'),
                 ('Achando kr: a razão das alturas',
                  'Virado, o vazio é a pirâmide pequena do topo: kr · kr · kr = 0,613. 0,8 · 0,8 · 0,8 = 0,512 (pouco) e 0,9 · 0,9 · 0,9 = 0,729 (muito). Teste 0,85: 0,85 · 0,85 = 0,7225 e 0,7225 · 0,85 = 0,614125, quase 0,613. Logo kr ≈ 0,85.'),
                 ('Achando kr: o erro importa?',
                  'O cubo de 0,85 passa de 0,613 em 0,001. Isso muda kr em menos de 0,001 e a altura em menos de 0,02 cm. As alternativas distam 0,9 cm ou mais umas das outras, então 0,85 basta.'),
                 ('Achando av: a altura do vazio',
                  'av = kr · 20 = 0,85 · 20 = 17 cm (0,85 · 2 = 1,7 e vezes 10). O vazio é a pirâmide pequena do topo, com cerca de 17 cm de altura.',
                  {'tipo': 'diagrama', 'nome': 'piramide-cortada',
                   'rotulos': ['20 cm', 'o vazio é a pirâmide menor; a bebida é o tronco', '≈ 17 cm', '', 'base quadrada de lado 6 cm; desenho fora de escala']})],
        volta='hb = 20 − av = 20 − 17 = 3 cm.\nConferindo: bebida de 3 cm de altura, num copo de 20 cm, fica pouca bebida, e o vazio é a maior parte.\nResposta: alternativa X.',
        valores=[('vp', '240 cm³'), ('vs', '92,88 cm³'), ('vv', '147,12 cm³'), ('kr', '≈ 0,85'), ('av', '≈ 17 cm'), ('hb', '≈ 3,0 cm')],
        pista='bebida em recipiente de ponta para baixo é um sólido semelhante, e o volume vai com o cubo: ache o vazio (copo − bebida − gole), descubra a altura dele pelo cubo e tire de 20.',
        rec1='pirâmide 6 × 6 × 20; bebida até 16; gole de 30 mL; copo virado', rec3='vp = 240; vs = 92,88; vv = 147,12; kr ≈ 0,85; av ≈ 17; hb ≈ 3',
        checagem=('Um copo de pirâmide tem 8 cm de altura e 80 cm³, cheio até a borda com a ponta para baixo. Bebe-se 10 mL e vira-se o copo. Qual a altura da bebida?',
                  ['4 cm', '2 cm', '7 cm', '1 cm'], '4 cm',
                  'Vazio: 10 ÷ 80 = 1/8 = (1/2)³, então o vazio tem 8 · 1/2 = 4 cm de altura. Bebida: 8 − 4 = 4 cm.'),
        ancora='parcial · IME 2021 objetiva, copo de pirâmide invertida que é virado (14º do arquivo resolvido; nº oficial não conferido): volume vai com o cubo e a altura exige estimar uma raiz cúbica por limites; aqui com um gole no meio',
        canal='mat-07-escalas.txt [4:02:32] (comprimento, área e volume mudam por razões diferentes: o volume vai ao cubo); razão de semelhança em fuv-02-geometria-espacial-parte-2-3.txt [1:17:32]',
        antes=['esp-razao-volume', 'esp-raiz-cubica', 'multiplicar-decimais', 'dividir-por-decimal'],
    ),
    dict(
        id='d2-escada-mat-ita-esp-00c', materia='Matemática', tema=T, calc=calc_c,
        enunciado=ENUN_C,
        dados=[('Soma das 12 arestas', '0,96 m'), ('Área total (6 faces)', '0,0376 m²'), ('Peso da caixa vazia', '120 g: não entra na conta'),
               ('Espuma', '1 cm em cada ponta da vareta'), ('Medidas da caixa', 'não informadas'),
               ('Quero', 'maior vareta (sem espuma), inteira, em cm')],
        alts=[('12', 12, 'OK'),
              ('13', 13, 'Descontou só 1 cm de espuma no total: 14,1 − 1 = 13,1'),
              ('14', 14, 'Esqueceu a espuma: a vareta de 14 cm com as espumas (16 cm) não cabe'),
              ('17', 17, 'Subtraiu só metade da área: 576 − 188 = 388, a raiz é 19,7, menos 2 de espuma'),
              ('21', 21, 'Leu 0,0376 m² como 37,6 cm² (1 m² = 100 cm², não 10 000): 576 − 37,6, raiz 23,2, menos 2')],
        resumo='sm = 96 ÷ 4 = 24 cm; pr = 376 ÷ 2 = 188 cm²; dg · dg = 24 · 24 − 2 · 188 = 576 − 376 = 200, dg ≈ 14,1; lv + 2 não passa de 14,1: lv ≤ 12,1, e a maior vareta inteira tem 12 cm.',
        ideia='A maior reta dentro do bloco é a diagonal, mas você não tem as medidas: a soma delas ao quadrado, menos 2 vezes a soma dos produtos dois a dois, dá a diagonal ao quadrado. Passe tudo para cm, ache a diagonal e desconte as duas espumas.',
        pecas=[('Diagonal do bloco', 'O segmento de um canto ao canto oposto, o maior que cabe na caixa.'),
               ('Aresta', 'Cada um dos 12 segmentos onde duas faces se encontram: 4 de cada medida.'),
               ('Espuma', 'Ocupa 1 cm em cada ponta: a vareta mais 2 cm é que tem de caber na diagonal.')],
        formulas=[('caixa', 'Soma das 12 arestas', '4 · (x + y + z)'), ('caixa', 'Área total', '2 · (x · y + y · z + z · x)'),
                  ('caixa', 'Diagonal do bloco', 'dg² = x² + y² + z²'), ('texto', 'm² em cm²', '1 m² = 100 · 100 = 10 000 cm²')],
        desenho=('Veja a caixa (desenho fora de escala). As três medidas são x, y e z, e nenhuma delas é dada. A vareta mais comprida vai de um canto ao canto oposto.',
                 'vareta-na-caixa',
                 ['y', 'x', 'z', '', '', 'desenho fora de escala: as medidas x, y e z são desconhecidas']),
        eq='dg · dg = sm · sm − 2 · pr  e  lv + 2 não passa de dg',
        leitura='diagonal ao quadrado = (x + y + z)² − 2 · (x · y + y · z + z · x); vareta mais as duas espumas cabe na diagonal',
        letras=[('lv', 'vareta inteira sem a espuma, o maior valor possível, em cm (o que a questão quer)'), ('dg', 'diagonal do bloco, em cm'),
                ('sm', 'soma das três medidas, x + y + z, em cm'), ('pr', 'soma dos produtos dois a dois, x · y + y · z + z · x, em cm²')],
        eq_texto='A vareta com as espumas mede lv + 2 e tem de caber na diagonal dg. A diagonal sai de sm e pr, que vêm dos dois dados da tabela, já em centímetros.\nAgora é só achar sm, pr e dg, uma por vez.',
        achando=[('Achando sm: a soma das três medidas',
                  '1 m = 100 cm: 0,96 m = 96 cm (vírgula 2 casas para a direita). Um bloco tem 12 arestas, 4 de cada medida: 4 · x + 4 · y + 4 · z = 4 · (x + y + z) = 96. Teste: 4 · 2 + 4 · 3 = 20 = 4 · 5. sm = 96 ÷ 4 = 24 cm.'),
                 ('Achando pr: a soma dos produtos',
                  '1 m² = 100 cm · 100 cm = 10 000 cm²: 0,0376 m² = 376 cm² (vírgula 4 casas à direita). 6 faces, 2 de cada tipo: 2 · x · y + 2 · y · z + 2 · z · x = 2 · pr = 376. pr = 376 ÷ 2 = 188 cm².'),
                 ('Achando dg: o truque da soma',
                  'dg · dg = x · x + y · y + z · z (Pitágoras duas vezes). (x + y + z) · (x + y + z) = x · x + y · y + z · z + 2 · pr: cada produto de duas medidas aparece 2 vezes. Teste 1, 2, 3: 36 = 14 + 2 · 11. Logo dg · dg = sm · sm − 2 · pr.',
                  {'tipo': 'diagrama', 'nome': 'vareta-na-caixa',
                   'rotulos': ['y', 'x', 'z', '', '', 'desenho fora de escala: as medidas x, y e z são desconhecidas']}),
                 ('Achando dg: a conta (2 de 3)',
                  'sm · sm = 24 · 24 = 576 (24 · 20 = 480 e 24 · 4 = 96). 2 · pr = 2 · 188 = 376. dg · dg = 576 − 376 = 200.'),
                 ('Achando dg: a raiz (3 de 3)',
                  'Raiz de 200: 14 · 14 = 196 (pouco) e 15 · 15 = 225 (muito). Afinando: 14,1 · 14,1 = 198,81 (pouco) e 14,2 · 14,2 = 201,64 (muito). Então dg está entre 14,1 e 14,2.')],
        volta='A vareta com as espumas mede lv + 1 + 1 = lv + 2 e cabe na diagonal: lv + 2 não passa de 14,1, então lv não passa de 12,1. O maior inteiro é 12 cm.\nConferindo: 12 + 2 = 14 cabe em 14,1; 13 + 2 = 15 não cabe.\nResposta: alternativa X.',
        valores=[('sm', '24 cm'), ('pr', '188 cm²'), ('dg', '≈ 14,1 cm'), ('lv', '12 cm')],
        pista='dados que não dão as medidas: a diagonal ao quadrado é (soma das medidas)² − 2 · (soma dos produtos dois a dois); passe m e m² para cm e cm², e desconte a espuma antes de pegar o maior inteiro.',
        rec1='soma das arestas 0,96 m; área total 0,0376 m²; espuma 1 cm em cada ponta', rec3='sm = 24; pr = 188; dg ≈ 14,1; lv = 12',
        checagem=('Uma caixa tem soma das 12 arestas 76 cm e área total 192 cm². Qual o comprimento da diagonal?',
                  ['13 cm', '19 cm', '12 cm', '25 cm'], '13 cm',
                  'Soma das medidas: 76 ÷ 4 = 19; soma dos produtos: 192 ÷ 2 = 96. Diagonal ao quadrado = 19 · 19 − 2 · 96 = 361 − 192 = 169, e 13 · 13 = 169.'),
        ancora='forte · Fuvest 2020 1ª fase q.17 (diagonal do paralelepípedo = diâmetro da esfera circunscrita, Pitágoras duas vezes); aqui as medidas ficam escondidas, os dados vêm em m e m², e a diagonal sai de (x + y + z)² − 2 · (x · y + y · z + z · x), a identidade escondida do ITA 2023 q.46',
        canal='fuv-02-geometria-espacial-parte-2-3.txt [0:50:01] (a diagonal pede Pitágoras duas vezes)',
        antes=['pitagoras', 'esp-diagonal-do-bloco', 'esp-quadrado-da-soma', 'esp-metro-quadrado-em-cm'],
    ),
    dict(
        id='d2-escada-mat-ita-esp-00d', materia='Matemática', tema=T, calc=float(pc),
        enunciado=ENUN_D,
        dados=[('Bolas', '8, idênticas, raio r desconhecido'), ('Caixa cúbica', '2 camadas de 4 bolas'),
               ('Tubo cilíndrico', '4 camadas de 2 bolas, encostadas nas tampas'),
               ('Caixa nova', 'mesma base da cúbica, mais alta, mesma fração vazia do tubo'), ('π', '3'),
               ('Quero', 'em quantos % a altura da caixa nova é maior')],
        alts=[('16,7%', 16.7, 'Subtraiu as frações vazias do tubo e da caixa cúbica, 2/3 − 1/2 = 1/6, e deu os pontos percentuais'),
              ('33,3%', 100 / 3, 'Dividiu a diferença das alturas pela altura nova, 2r ÷ 6r, e não pela da caixa cúbica'),
              ('50%', 50, 'OK'),
              ('66,7%', 200 / 3, 'Respondeu a fração vazia do tubo, 2/3'),
              ('100%', 100, 'Comparou os volumes vazios do tubo e da caixa cúbica, 64r³ contra 32r³')],
        resumo='8 bolas: 8 · 4r³ = 32r³. Tubo: 3 · (2r)² · 8r = 96r³, bolas 32/96 = 1/3. Caixa nova: bolas 1/3, volume 3 · 32r³ = 96r³; base 16r², altura 96r³ ÷ 16r² = 6r. (6r − 4r) ÷ 4r = 1/2 = 50%.',
        ideia='Dê o raio r às bolas: tudo vira múltiplo de r³ e o r some das frações. Fração vazia igual à do tubo quer dizer que as bolas ocupam a mesma fração do volume: ache o volume da caixa nova, depois a altura, e compare com a base certa.',
        pecas=[('Fração vazia', 'Volume que não é bola ÷ volume da embalagem. Não depende do tamanho do r.'),
               ('Mesma fração', 'Se as bolas são 1/3 do total, o total é 3 vezes as bolas.'),
               ('Base da porcentagem', '"Maior que" divide pelo valor de antes, a caixa cúbica.')],
        formulas=[('esfera', 'Volume da esfera', '4/3 · π · r · r · r'), ('cilindro', 'Volume do cilindro', 'π · raio · raio · altura'),
                  ('caixa', 'Volume da caixa', 'base · altura'), ('porcentagem', 'Quantos % maior', '(novo − antigo) ÷ antigo · 100')],
        eq='pc = (hn − ho) ÷ ho · 100', leitura='percentual = (altura nova − altura da caixa cúbica) ÷ altura da caixa cúbica · 100',
        letras=[('pc', 'quantos por cento a altura da caixa nova é maior (o que a questão quer)'), ('ho', 'altura da caixa cúbica, em r'),
                ('hn', 'altura da caixa nova, em r'), ('vn', 'volume da caixa nova, em r³'),
                ('fc', 'fração do tubo ocupada pelas bolas'), ('vt', 'volume do tubo, em r³'), ('vb', 'volume das 8 bolas, em r³')],
        eq_texto='Quanto mais, sobre o que era antes: a diferença das alturas dividida pela altura da caixa cúbica. A altura nova vem do volume novo, e esse vem da fração do tubo.\nAgora é só achar ho, vb, vt, fc, vn e hn, uma por vez.',
        achando=[('Achando ho: a altura da caixa cúbica',
                  'Diâmetro da bola = 2 · raio = 2r. Duas bolas lado a lado ocupam 2 · 2r = 4r. A caixa cúbica tem 2 bolas por aresta: ho = 4r, e a base é 4r por 4r.'),
                 ('Achando vb: as 8 bolas',
                  'Volume da esfera = 4/3 · π · r · r · r. Com π = 3: 4/3 · 3 = 12/3 = 4, então cada bola tem 4 · r³ (r³ = r · r · r). Oito bolas: vb = 8 · 4 · r³ = 32 · r³.'),
                 ('Achando vt: o tubo',
                  'Duas bolas lado a lado: o diâmetro do tubo é 4r e o raio 2r. 4 camadas de 2r: altura 8r. Volume = π · raio · raio · altura = 3 · 2r · 2r · 8r = 3 · 4 · 8 · r³. 3 · 4 = 12 e 12 · 8 = 96. vt = 96 · r³.'),
                 ('Achando fc: a fração das bolas no tubo',
                  'fc = vb ÷ vt = 32 ÷ 96. Como 96 = 3 · 32, fc = 1/3: as bolas são 1/3 do tubo (o vazio é 2/3). O r³ some na divisão.'),
                 ('Achando vn: o volume da caixa nova',
                  'A caixa nova tem a mesma fração vazia, 2/3, então as 8 bolas ocupam 1/3 dela. Se 32 é 1/3 do total, o total é 3 · 32 = 96. Teste: se 5 é 1/3 do total, o total é 15. vn = 96 · r³.'),
                 ('Achando hn: a altura da caixa nova',
                  'Volume = base · altura, com base 4r · 4r = 16 · r · r. 96 · r · r · r = 16 · r · r · hn. 96 ÷ 16 = 6 e (r · r · r) ÷ (r · r) = r. Logo hn = 6r.')],
        volta='pc = (hn − ho) ÷ ho · 100 = (6r − 4r) ÷ 4r · 100. 6r − 4r = 2r, e 2r ÷ 4r = 2/4 = 1/2 (o r some). 1/2 · 100 = 50.\nAtenção: dividir por 6r, a altura nova, dá 1/3 = 33,3%; a base é a caixa de antes.\nResposta: alternativa X.',
        valores=[('ho', '4r'), ('vb', '32r³'), ('vt', '96r³'), ('fc', '1/3'), ('vn', '96r³'), ('hn', '6r'), ('pc', '50%')],
        pista='raio desconhecido → tudo é múltiplo de r³ e o r some; mesma fração vazia quer dizer bolas na mesma fração do volume, e "maior que" divide pelo valor de antes.',
        rec1='8 bolas; caixa 2 × 2 × 2; tubo 4 × 2; caixa nova, mesma base e mesma fração do tubo; π = 3',
        rec3='ho = 4r; vb = 32r³; vt = 96r³; fc = 1/3; vn = 96r³; hn = 6r; pc = 50%',
        checagem=('As bolas de uma caixa somam 10 cm³ e ocupam 1/2 dela, que tem base de 5 cm². Uma caixa nova, com a mesma base, deve deixar as bolas ocupando só 1/4. A altura nova é maior em quantos por cento?',
                  ['100%', '50%', '200%', '25%'], '100%',
                  'Se 10 é metade, o total é 20 e a altura é 20 ÷ 5 = 4. Se 10 é 1/4, o total é 40 e a altura é 40 ÷ 5 = 8. (8 − 4) ÷ 4 = 1 = 100%.'),
        ancora='parcial · HMMT nov/2020 Theme q.3 (cilindros de raio k: olhar a figura de um lado em vez de somar partes, e a conta se simplifica) e ENEM 2022 q.169 (CD5, cilindro e esferas, o π cancela); aqui o r some das frações, a fração do tubo fixa o volume da caixa nova, e a pegadinha é a base da porcentagem',
        canal='mat-25-cilindro-e-esfera.txt [14:43:00] (volume da esfera 4/3 π r³ e do cilindro); comparar duas embalagens por fração é fora do canal',
        antes=['esp-volume-da-esfera', 'esp-quanto-maior-em-percentual', 'fracoes', 'porcentagem'],
    ),
]

MANTER = {}

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
                         [['2', '2 vezes', '4 vezes', '8 vezes'], ['1/2', '1/2', '1/4', '1/8'], ['3', '3 vezes', '9 vezes', '27 vezes']]),
        'exercicios': [
            {'enunciado': 'Uma caixa-d\'água de 1 000 L é copiada em um modelo igual, com o dobro de todas as medidas. Qual o volume do modelo?',
             'alternativas': ['8 000 L', '2 000 L', '4 000 L', '6 000 L'], 'certa': 0,
             'resolucao': '8 000 L: k = 2 e o volume vai com 2 · 2 · 2 = 8; 8 · 1 000 = 8 000.\n2 000 é só dobrar; 4 000 é k · k; 6 000 não tem conta que dê.'},
            {'enunciado': 'Um copo cônico de 270 mL está com a ponta para baixo e a bebida chega a 1/3 da altura. Quantos mL de bebida?',
             'alternativas': ['10 mL', '90 mL', '30 mL', '135 mL'], 'certa': 0,
             'resolucao': '10 mL: k = 1/3 e o volume é 1/3 · 1/3 · 1/3 = 1/27; 270 ÷ 27 = 10.\n90 é 1/3 do volume; 30 é 1/9; 135 é a metade.'},
        ],
    },
    'esp-mistura-em-partes': {
        'titulo': 'Mistura em partes (2 para 1)',
        'linhas': [
            '"2 partes de concentrado para 1 de água": no total são 2 + 1 = 3 partes, e o concentrado é 2 dessas 3.',
            'Ache o valor de 1 parte dividindo: se o concentrado é 400 mL (2 partes), 1 parte = 400 ÷ 2 = 200 mL.',
            'A mistura toda tem 3 partes: 3 · 200 = 600 mL. A água é 1 parte, 200 mL.',
            'Conferindo: 400 mL de concentrado mais 200 mL de água dão 600 mL, e 400 é 2 de 3 partes de 600.',
        ],
        'visual': tabela('Partes da mistura', ['Item', 'Partes', 'Quantidade'],
                         [['Concentrado', '2', '400 mL'], ['Água', '1', '200 mL'], ['Mistura', '3', '600 mL']]),
        'exercicios': [
            {'enunciado': 'Uma tinta é feita com 3 partes de pigmento para 2 de água. Com 90 mL de pigmento, quantos mL de tinta se faz?',
             'alternativas': ['150 mL', '180 mL', '135 mL', '270 mL'], 'certa': 0,
             'resolucao': '150 mL: 3 partes = 90, então 1 parte = 30; a tinta tem 5 partes, 5 · 30 = 150.\n180 é 90 · 2; 135 é 90 · 1,5; 270 é 90 · 3.'},
            {'enunciado': 'Uma jarra tem 600 mL de mistura, 1 parte de xarope para 4 de água. Quantos mL de xarope?',
             'alternativas': ['120 mL', '150 mL', '480 mL', '300 mL'], 'certa': 0,
             'resolucao': '120 mL: a mistura tem 5 partes, 1 parte = 600 ÷ 5 = 120.\n150 é 600 ÷ 4; 480 é a água (4 partes); 300 é a metade.'},
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
    'esp-diagonal-do-bloco': {
        'titulo': 'A diagonal de um bloco',
        'linhas': [
            'Um bloco tem medidas x, y e z. A maior reta dentro dele vai de um canto ao canto oposto: é a diagonal do bloco.',
            '1º, Pitágoras no chão: a diagonal da base ao quadrado é x² + y² (x² lê-se x · x).',
            '2º, Pitágoras em pé: diagonal do bloco ao quadrado = (diagonal da base)² + z² = x² + y² + z².',
            'Teste: bloco 1 por 2 por 2: 1 + 4 + 4 = 9, e a diagonal é 3, porque 3 · 3 = 9. Nenhuma reta maior que 3 cabe lá dentro.',
        ],
        'visual': tabela('Diagonal do bloco', ['Bloco', 'x² + y² + z²', 'Diagonal'],
                         [['1 por 2 por 2', '1 + 4 + 4 = 9', '3'], ['2 por 3 por 6', '4 + 9 + 36 = 49', '7'], ['3 por 4 por 12', '9 + 16 + 144 = 169', '13']]),
        'exercicios': [
            {'enunciado': 'Um bloco mede 2 cm, 3 cm e 6 cm. Qual o comprimento da maior vareta reta que cabe nele?',
             'alternativas': ['7 cm', '11 cm', '6 cm', '5 cm'], 'certa': 0,
             'resolucao': '7 cm: 4 + 9 + 36 = 49 e 7 · 7 = 49.\n11 é a soma das medidas; 6 é só a maior aresta; 5 é a diagonal de 3 e 4 sem a altura.'},
            {'enunciado': 'Um bloco mede 1 cm, 4 cm e 8 cm. Qual o comprimento da diagonal?',
             'alternativas': ['9 cm', '13 cm', '8 cm', '81 cm'], 'certa': 0,
             'resolucao': '9 cm: 1 + 16 + 64 = 81 e 9 · 9 = 81.\n13 é a soma das medidas; 8 é só a maior aresta; 81 esqueceu a raiz.'},
        ],
    },
    'esp-quadrado-da-soma': {
        'titulo': 'O quadrado de uma soma de dois números',
        'linhas': [
            'Para dois números: (a + b)² = a² + b² + 2 · a · b. Teste: (2 + 3)² = 25 e 4 + 9 + 12 = 25.',
            'Por quê: (a + b) · (a + b) tem a · a, b · b e o produto a · b duas vezes (a · b e b · a).',
            'Ao contrário: sabendo a soma e o produto, a² + b² = (a + b)² − 2 · a · b. Teste com 2 e 3: 25 − 12 = 13 = 4 + 9.',
            'Cuidado: o 2 é obrigatório. (2 + 3)² = 25 não é 4 + 9 = 13.',
        ],
        'visual': tabela('Dois números', ['Números', 'a + b', 'a² + b²', 'a · b'],
                         [['2, 3', '5', '13', '6'], ['1, 4', '5', '17', '4'], ['3, 3', '6', '18', '9']]),
        'exercicios': [
            {'enunciado': 'Dois números somam 10 e o produto deles é 21. Quanto vale a² + b²?',
             'alternativas': ['58', '79', '100', '142'], 'certa': 0,
             'resolucao': '58: (a + b)² = 100 e 2 · 21 = 42; 100 − 42 = 58.\n79 é 100 − 21 (esqueceu o 2); 100 ignora o produto; 142 soma em vez de subtrair.'},
            {'enunciado': 'Dois números somam 9 e a soma dos quadrados é 45. Quanto vale o produto a · b?',
             'alternativas': ['18', '36', '27', '126'], 'certa': 0,
             'resolucao': '18: 9² = 81; 81 − 45 = 36 e 36 ÷ 2 = 18.\n36 esquece de dividir por 2; 27 é 81 ÷ 3; 126 soma em vez de subtrair.'},
        ],
    },
    'esp-metro-quadrado-em-cm': {
        'titulo': 'Metros e metros quadrados em centímetros',
        'linhas': [
            '1 m = 100 cm. Para passar de m para cm, ande a vírgula 2 casas para a direita: 0,96 m = 96 cm.',
            '1 m² é um quadrado de 1 m por 1 m, igual a 100 cm por 100 cm = 100 · 100 = 10 000 cm².',
            'Para passar de m² para cm², ande a vírgula 4 casas para a direita: 0,0376 m² = 376 cm².',
            'Cuidado: 1 m² não é 100 cm². O 100 serve para comprimento; área usa 100 · 100.',
        ],
        'visual': tabela('De metro para centímetro', ['Medida', 'Vezes', 'Exemplo'],
                         [['Comprimento (m para cm)', '100', '0,96 m = 96 cm'], ['Área (m² para cm²)', '10 000', '0,0376 m² = 376 cm²']]),
        'exercicios': [
            {'enunciado': 'Uma lona tem 0,25 m². Quantos cm²?',
             'alternativas': ['2 500 cm²', '25 cm²', '250 cm²', '25 000 cm²'], 'certa': 0,
             'resolucao': '2 500 cm²: 0,25 · 10 000 = 2 500 (vírgula 4 casas à direita).\n25 e 250 usam 100 ou 1 000; 25 000 anda 5 casas.'},
            {'enunciado': 'Um azulejo tem 150 cm². Quantos m²?',
             'alternativas': ['0,015 m²', '0,15 m²', '1,5 m²', '0,0015 m²'], 'certa': 0,
             'resolucao': '0,015 m²: 150 ÷ 10 000 = 0,015 (vírgula 4 casas à esquerda).\n0,15 e 1,5 andam só 3 e 2 casas; 0,0015 anda 5.'},
        ],
    },
    'esp-volume-da-esfera': {
        'titulo': 'π, r³ e o volume da esfera e do cilindro',
        'linhas': [
            'π (lê-se "pi") é um número fixo, cerca de 3,14, que aparece em todo círculo e toda esfera. Alguns enunciados mandam usar π = 3.',
            'r é o raio, metade do diâmetro: diâmetro = 2 · raio. r³ lê-se r · r · r, e r² é r · r.',
            'Volume da esfera = 4/3 · π · r³. Com π = 3: 4/3 · 3 = 12/3 = 4, então o volume é 4 · r³.',
            'Volume do cilindro = π · raio · raio · altura. Com π = 3, raio 2 e altura 5: 3 · 2 · 2 · 5 = 60.',
        ],
        'visual': tabela('Com π = 3', ['Sólido', 'Fórmula', 'Raio 2'],
                         [['Esfera', '4 · r · r · r', '4 · 8 = 32'], ['Cilindro de altura 5', '3 · r · r · 5', '3 · 4 · 5 = 60']]),
        'exercicios': [
            {'enunciado': 'Com π = 3, qual o volume de uma bola de raio 2 cm?',
             'alternativas': ['32 cm³', '24 cm³', '8 cm³', '96 cm³'], 'certa': 0,
             'resolucao': '32 cm³: 4/3 · 3 = 4 e 2 · 2 · 2 = 8; 4 · 8 = 32.\n24 é 3 · 8 (esqueceu o 4/3); 8 é só r³; 96 é 4 · 3 · 8.'},
            {'enunciado': 'Com π = 3, um cilindro tem raio 2 cm e altura 5 cm. Qual o volume?',
             'alternativas': ['60 cm³', '30 cm³', '20 cm³', '240 cm³'], 'certa': 0,
             'resolucao': '60 cm³: 3 · 2 · 2 · 5 = 3 · 4 · 5 = 60.\n30 usou o raio uma vez só; 20 esqueceu o π; 240 usou o diâmetro 4 no lugar do raio.'},
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
    assert all(l not in 'ABCDEabcde' for l, _ in _q['letras']), _q['id']
    assert len({l for l, _ in _q['letras']}) == len(_q['letras'])
    assert len(_q['achando']) >= len(_q['letras']) - 1, _q['id']
    assert all(len(a[1]) <= 300 for a in _q['achando']), (_q['id'], [len(a[1]) for a in _q['achando']])
