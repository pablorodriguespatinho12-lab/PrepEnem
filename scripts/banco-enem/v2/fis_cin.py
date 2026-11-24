"""Cinemática (1º degrau de Física), nível acima v2, 23/11/2026.

a = ENEM (média que engana, tabela de pórticos), b = ITA (esfera e projétil na queda, referencial que cai),
c = Fuvest (Ana acelera e depois segue constante, tabela v x t), d = Harvard-MIT (velocidades inteiras em degraus de 1 s, contagem).
Toda resposta é conferida por conta Python (assert) neste módulo.
"""
import math

ARQUIVO = 'fisica-acima-novas.json'
T = 'Cinemática'

# ---------------------------------------------------------------- a) ENEM
km_p1, km_p2, km_p3, limite = 118, 124, 130, 90
h1, h2 = 2 * 60 + 20, 5 * 60 + 20  # segundos depois das 14 h 00 min 00 s (14:02:20 e 14:05:20)
gasto_min = (h2 - h1) / 60
trecho = km_p3 - km_p1
perm_min = trecho / (limite / 60)
sobra_min = perm_min - gasto_min
v_a = (km_p3 - km_p2) / sobra_min * 60
assert (gasto_min, trecho, perm_min, sobra_min, v_a) == (3, 12, 8, 5, 72)
assert (km_p2 - km_p1) / gasto_min * 60 == 120  # a câmera do meio vê 120 km/h
assert 2 * limite - 120 == 60 and 60 * 6 / 8 == 45 and 60 * 12 / 5 == 144
ENUN_A = ('Uma rodovia de 30 km, do km 100 ao km 130, tem fiscalização por radar de trecho. Três pórticos com câmera registram a hora em que cada carro passa, '
          'e o sistema calcula a velocidade média entre o primeiro e o último pórtico. O limite do trecho é 90 km/h para carros (80 km/h para caminhões). '
          'Se a velocidade média do carro passar disso, há multa, mesmo que nenhuma câmera o tenha visto acima de 90 km/h. '
          'A câmera do pórtico do meio só registra a hora e não multa ninguém. Uma motorista, dirigindo um carro, passou pelos pórticos como mostra a tabela.\n\n'
          'Pórtico | Marco da rodovia | Horário\n'
          '1 | km 118 | 14 h 02 min 20 s\n'
          '2 | km 124 | 14 h 05 min 20 s\n'
          '3 | km 130 | ainda vai passar\n\n'
          'Ao passar pelo pórtico 2, ela percebeu que vinha rápida e decidiu reduzir. Para chegar ao pórtico 3 sem ser multada, '
          'qual é a maior velocidade média, em km/h, que ela pode manter entre o pórtico 2 e o pórtico 3?')
assert len(ENUN_A) >= 600, len(ENUN_A)

# ---------------------------------------------------------------- b) ITA
H_TORRE, H_CANHAO, D_HOR, G = 20, 5, 8, 10
t_queda = math.sqrt(2 * H_TORRE / G)
dist = math.hypot(D_HOR, H_TORRE - H_CANHAO)
v_b = dist / t_queda
assert (t_queda, dist, v_b) == (2, 17, 8.5)
assert (D_HOR / t_queda, (H_TORRE - H_CANHAO) / t_queda, (D_HOR + 15) / t_queda) == (4, 7.5, 11.5)
# Conferência da ideia (referencial que cai): apontando para o ponto de onde a esfera foi solta, com v = 8,5, os dois se encontram em t = 2 s.
ux, uy = D_HOR / dist, (H_TORRE - H_CANHAO) / dist
px, py = v_b * t_queda * ux, H_CANHAO + v_b * t_queda * uy - 0.5 * G * t_queda ** 2
bx, by = D_HOR, H_TORRE - 0.5 * G * t_queda ** 2
assert abs(px - bx) < 1e-9 and abs(py - by) < 1e-9 and abs(by) < 1e-9  # encontram-se no chão, no último instante
# Com v menor (8 m/s) o alvo, em linha reta, só seria alcançado em 17 / 8 = 2,125 s > 2 s: tarde demais.
assert dist / 8 > t_queda
# Conferência do "Sua vez": esfera de 45 m, canhão no chão a 24 m
assert math.hypot(24, 45) == 51 and math.sqrt(2 * 45 / G) == 3 and 51 / 3 == 17

# ---------------------------------------------------------------- c) Fuvest
a_ana = 2 / 4
t_max = 5 / a_ana
F = (0 + 5) / 2 * t_max
K = 5 * (20 - t_max)
A20 = F + K
resta = 1000 - A20
t_enc = resta / (5 + 5)
v_c = A20 + 5 * t_enc
assert (a_ana, t_max, F, K, A20, resta, t_enc, v_c) == (0.5, 10, 25, 50, 75, 925, 92.5, 537.5)
# a tabela bate com a = 0,5 até chegar a 5 m/s e depois fica em 5
for t, v in zip([0, 4, 8, 12, 16, 20], [0, 2, 4, 5, 5, 5]):
    assert min(a_ana * t, 5) == v
assert 1000 - v_c == 5 * t_enc  # Bia anda 462,5 m
assert 100 + 5 * (900 / 10) == 550 and 5 * 20 / 2 + 5 * (1000 - 50) / 10 == 525 and 5 * 1000 / 10 == 500
assert 5 * 20 / 2 == 50
# Conferência por simulação: encontro das posições
def pos_ana(t):
    return 0.5 * t * t / 2 if t <= 10 else 25 + 5 * (t - 10)
t_total = 20 + t_enc
assert abs(pos_ana(t_total) - (1000 - 5 * t_enc)) < 1e-9
# "Sua vez": 0 a 4 m/s em 8 s e depois constante, 12 s de movimento
assert (0 + 4) / 2 * 8 + 4 * (12 - 8) == 32 and 4 * 12 == 48

# ---------------------------------------------------------------- d) Harvard-MIT
D_TOTAL = 120


def validos(total):
    """(N, v0) com N > 1 segundos, velocidades inteiras v0, v0-1, ..., v0-N+1 todas >= 1 e soma = total."""
    saida = []
    for n in range(2, 2 * total + 2):
        # soma = n*v0 - n(n-1)/2
        resto = total + n * (n - 1) // 2
        if resto % n == 0 and resto // n - n + 1 >= 1:
            saida.append((n, resto // n))
    return saida


sol = validos(D_TOTAL)
assert sol == [(3, 41), (5, 26), (15, 15)], sol
assert len({v for _, v in sol}) == 3
for n, v in sol:
    assert sum(v - i for i in range(n)) == D_TOTAL
# armadilhas
pares_paridade = [n for n in range(1, 2 * D_TOTAL + 1) if (2 * D_TOTAL) % n == 0 and (n + (2 * D_TOTAL) // n) % 2 == 1]
assert pares_paridade == [1, 3, 5, 15, 16, 48, 80, 240] and len(pares_paridade) == 8
assert len([n for n in range(1, 241) if 240 % n == 0]) == 20
assert (16, 15) == (16, (240 // 16 + 16 - 1) // 2) and (240 // 16 + 16 - 1) // 2 - 16 + 1 == 0  # N = 16 termina parado
assert (1, 120) == (1, (240 // 1 + 1 - 1) // 2)
linhas_tab = []
for n in [1, 3, 5, 15, 16, 48, 80, 240]:
    p = 240 // n
    v = (p + n - 1) // 2
    ult = v - n + 1
    linhas_tab.append((n, p, v, ult))
assert linhas_tab == [(1, 240, 120, 120), (3, 80, 41, 39), (5, 48, 26, 22), (15, 16, 15, 1), (16, 15, 15, 0), (48, 5, 26, -21), (80, 3, 41, -38), (240, 1, 120, -119)]
# Regras do enunciado: v0 inteiro > 0, N > 1, todas as velocidades v0..v0-N+1 >= 1 (sem zero, sem inverter), soma = 120. Força bruta direta:
_bf = sorted({(n, v0) for n in range(2, 400) for v0 in range(1, 400) if all(v0 - i >= 1 for i in range(n)) and sum(v0 - i for i in range(n)) == D_TOTAL})
assert _bf == [(3, 41), (5, 26), (15, 15)] and len(_bf) == 3
# Se pudesse zerar ou inverter (distância = soma dos módulos) o total seria 6 (inclui N = 16 e N = 20): por isso o enunciado proíbe os dois.
_inv = sorted({(n, v0) for n in range(2, 400) for v0 in range(1, 400) if sum(abs(v0 - i) for i in range(n)) == D_TOTAL})
assert len(_inv) == 6 and (16, 15) in _inv, _inv
# "Sua vez": 12 m
assert validos(12) == [(3, 5)]


# Contas novas dos passos (24/11/2026, aluno-do-zero): cada multiplicação mostrada passo a passo confere aqui.
assert 15 * 10 == 150 and 15 * 5 == 75 and 150 + 75 == 225 and 15 * 8 == 120 and 120 // 15 == 8
assert 8 * 8 == 64 and 64 + 225 == 289 and 17 * 10 == 170 and 17 * 7 == 119 and 170 + 119 == 289 and 17 * 17 == 289
assert 24 * 20 == 480 and 24 * 4 == 96 and 480 + 96 == 576 and 45 * 40 == 1800 and 45 * 5 == 225 and 1800 + 225 == 2025
assert 576 + 2025 == 2601 and 51 * 50 == 2550 and 2550 + 51 == 2601 and 51 * 51 == 2601
assert 16 * 8 == 128 and 8 * 2 == 16 and 17 - 16 == 1  # 8 m/s em 2 s: 16 m, faltaria 1 m
assert 5 * 72 == 360 and 360 // 5 == 72 and 4 * 0.5 == 2 and 5 * 92 == 460 and 5 * 0.5 == 2.5 and 460 + 2.5 == 462.5 and 925 / 10 == 92.5
assert 3 * 80 // 2 == 120 and 3 * 80 == 240 and 41 + 39 == 80 and 80 + 3 == 83 == 2 * 41 + 1
assert 3 * 41 - 3 == 120 and 15 * 16 == 240 and [d for d in range(1, 16) if 15 % d == 0] == [1, 3, 5, 15]
assert [16 * d for d in (1, 3, 5, 15)] == [16, 48, 80, 240] and [240 // d for d in (16, 48, 80, 240)] == [15, 5, 3, 1]
# "Sua vez" do 00d (12 m): N · P = 24
assert [n for n in range(1, 25) if 24 % n == 0 and (n + 24 // n) % 2 == 1] == [1, 3, 8, 24]
assert (3 + 8 - 1) // 2 == 5 and (3 + 8 - 1) // 2 - 8 + 1 == -2 and (1 + 24 - 1) // 2 - 24 + 1 == -11 and (24 // 1 + 1 - 1) // 2 == 12
# Antes novos: contas dos exercícios
assert 120 / 60 == 2 and 30 / 15 == 2 and 150 / 50 == 3 and 100 / 2 == 50 and 100 / (6 + 4) == 10 and 100 / ((6 + 4) / 2) == 20 and 3 + 5 == 8
assert 30 / 10 == 3 and 10 / 2 == 5 and 3 / 0.5 == 6

Q = [
    dict(
        id='d2-escada-fis-ita-cin-00a', materia='Física', tema=T, calc=72,
        enunciado=ENUN_A,
        dados=[('Pórtico 1', 'km 118, às 14 h 02 min 20 s'), ('Pórtico 2', 'km 124, às 14 h 05 min 20 s'), ('Pórtico 3', 'km 130 (ainda vai passar)'),
               ('Limite do trecho para carros', '90 km/h, na média'),
               ('Não entram na conta', '30 km da rodovia, km 100, limite de caminhões')],
        alts=[('45', 45, 'Dividiu os 6 km pelos 8 min inteiros, sem descontar os 3 min já gastos: 60 · 6 ÷ 8'),
              ('60', 60, 'Fez a média aritmética das velocidades: 2 · 90 − 120'),
              ('72', 72, 'OK'),
              ('90', 90, 'Repetiu o limite, como se a 2ª metade pudesse andar na própria média'),
              ('144', 144, 'Usou os 12 km do trecho inteiro nos 5 min que sobram: 60 · 12 ÷ 5')],
        resumo='12 km a 90 km/h pedem 8 min; ela gastou 3 min; sobram 5 min para 6 km: 6 ÷ 5 = 1,2 km/min = 72 km/h.',
        ideia='Radar de trecho multa pela velocidade média, e velocidade média é distância total ÷ tempo total, não a média das velocidades. O que se reparte é o tempo: 8 minutos permitidos, 3 já gastos, 5 para os 6 km finais.',
        pecas=[('Velocidade média no trecho', 'Distância do trecho inteiro ÷ tempo gasto nele. Não é a média das velocidades de cada metade.'),
               ('Marco da rodovia', 'O número do km na placa. A distância entre dois marcos é a subtração: km 130 − km 124.')],
        formulas=[('carro', 'Tempo permitido', 'tempo = distância ÷ velocidade'), ('carro', 'km/min para km/h', 'km/h = km/min · 60')],
        eq='vm = 60 · kf ÷ (tp − tg)', leitura='km/h = 60 · km da 2ª metade ÷ (minutos permitidos − minutos já gastos)',
        letras=[('vm', 'maior velocidade média na 2ª metade, em km/h (o que a questão quer)'), ('kf', 'km que faltam: do pórtico 2 ao 3'),
                ('tp', 'tempo total permitido no trecho, em min'), ('tg', 'tempo já gasto do pórtico 1 ao 2, em min')],
        eq_texto='A velocidade pedida é os km que faltam ÷ os minutos que sobram. O 60 passa de km por minuto para km por hora (1 hora = 60 minutos).\nAgora é só achar kf, tp e tg, uma por vez.',
        achando=[('Achando kf: os km que faltam', 'O pórtico 2 está no km 124 e o 3 no km 130.\nkf = 130 − 124 = 6 km.'),
                 ('Achando tp: o tempo total permitido',
                  'Do pórtico 1 (km 118) ao 3 (km 130): 130 − 118 = 12 km. Em 60 min o limite anda 90 km, então 90 ÷ 60 = 1,5 km por minuto.\ntp = 12 ÷ 1,5. Para tirar a vírgula, multiplico o 12 e o 1,5 por 10: 120 e 15. O 15 cabe 8 vezes no 120 (15 · 8 = 120).\ntp = 8 min.'),
                 ('Achando tg: o tempo já gasto',
                  'Do pórtico 1 (14 h 02 min 20 s) ao 2 (14 h 05 min 20 s) os 20 s são iguais e se cancelam: passaram 5 − 2 = 3 min.\ntg = 3 min. Ela fez 6 km em 3 min, 120 km/h: rápido, mas só o total conta.')],
        volta='vm = 60 · 6 ÷ (8 − 3) = 360 ÷ 5 = 72 km/h (5 · 72 = 360).\nResposta: alternativa A. Conferindo: 3 min a 120 km/h dão 6 km e 5 min a 72 km/h dão 6 km; 12 km em 8 min é 90 km/h, o limite.',
        valores=[('kf', '6 km'), ('tp', '8 min'), ('tg', '3 min')],
        pista='"radar de trecho" ou "velocidade média entre dois pontos" → ache o tempo que o limite permite (distância ÷ limite), tire o que já gastou e divida os km que faltam pelo tempo que sobra.',
        rec1='6 km restantes, trecho de 12 km a 90 km/h, 3 min gastos', rec3='kf = 6 km; tp = 8 min; tg = 3 min',
        checagem=('Trecho de 10 km, limite de 60 km/h na média. Na 1ª metade (5 km) gastou 4 min. Qual a maior velocidade média na 2ª metade?',
                  ['50 km/h', '60 km/h', '75 km/h', '30 km/h'], '50 km/h',
                  '60 km/h = 1 km/min: 10 min permitidos; sobram 6 min para 5 km; 5 ÷ 6 km/min · 60 = 50 km/h.'),
        ancora='parcial · ENEM 2020 dia 2 q.98 (caderno azul CD7, semáforos: fase em cadeia, antecipação de 100 m, km/h em m/s); aqui a cadeia é "tempo permitido menos tempo gasto" com a média que engana',
        canal='cin-02-video-inteiro-parte-3-13.txt [1:20:01] (média de 60 e 80 não é 70: velocidade média é deslocamento ÷ tempo)',
        antes=['velocidade', 'cin-tempo-da-velocidade', 'cin-hora-em-minutos', 'dividir-por-decimal'],
    ),
    dict(
        id='d2-escada-fis-ita-cin-00b', materia='Física', tema=T, calc=8.5,
        enunciado=('Uma esfera é abandonada do repouso do alto de uma torre de 20 m de altura. No mesmo instante, um canhão situado sobre uma plataforma '
                   'a 5 m do solo e a 8 m de distância horizontal da torre dispara um projétil, com um ângulo de lançamento a ser escolhido. '
                   'Desprezando a resistência do ar e adotando g = 10 m/s², a menor velocidade de lançamento, em m/s, para que o projétil atinja a esfera '
                   'antes de ela tocar o solo ou, no máximo, no instante em que a toca, é:'),
        dados=[('Altura da torre (de onde a esfera cai)', '20 m'), ('Altura do canhão', '5 m'), ('Distância horizontal', '8 m'), ('Gravidade', '10 m/s²')],
        alts=[('4', 4, 'Dividiu só a distância horizontal pelo tempo de queda: 8 ÷ 2'),
              ('7,5', 7.5, 'Dividiu só a diferença de altura pelo tempo de queda: 15 ÷ 2'),
              ('8,5', 8.5, 'OK'),
              ('11,5', 11.5, 'Somou 8 + 15 em vez de usar Pitágoras: 23 ÷ 2'),
              ('17', 17, 'Deu a distância em linha reta, 17 m, sem dividir pelo tempo')],
        resumo='Queda de 20 m: 2 s. Para quem cai com a esfera, o projétil anda em reta: dr = √(8² + 15²) = 17 m; vmin = 17 ÷ 2 = 8,5 m/s.',
        ideia='A esfera e o projétil caem a mesma altura em cada instante, então o encontro acontece quando o projétil percorreria, em reta e sem gravidade, a distância até o ponto de onde a esfera foi solta. Basta essa distância em linha reta ÷ o tempo de queda.',
        pecas=[('Cair junto', 'Esfera e projétil descem a mesma altura em cada instante: 5 m em 1 s, 20 m em 2 s. A gravidade não muda a distância entre os dois.')],
        formulas=[('triangulo-retangulo', 'Pitágoras', 'dr² = lado1² + lado2²'), ('carro', 'Queda livre', 'altura = média · tempo'),
                  ('carro', 'Velocidade constante', 'v = distância ÷ tempo')],
        desenho=('Uma esfera cai do alto de uma torre de 20 m. O canhão fica numa plataforma de 5 m, a 8 m da torre.', 'torre-esfera-canhao', []),
        eq='vmin = dr ÷ tq', leitura='velocidade mínima = distância em linha reta ÷ tempo de queda da esfera',
        letras=[('vmin', 'menor velocidade de lançamento, em m/s (o que a questão quer)'), ('dr', 'distância em linha reta do canhão ao ponto de onde a esfera foi solta, em m'),
                ('tq', 'tempo que a esfera leva para tocar o solo, em s')],
        eq_texto='O projétil percorre dr em linha reta e tem de chegar até o tempo tq da queda. A menor velocidade é a que gasta justo esse tempo.\nAgora é só achar dr e tq.',
        achando=[('Achando dr: a distância em linha reta',
                  'A esfera foi solta a 20 m e o canhão está a 5 m: a diferença de altura é 20 − 5 = 15 m. A distância horizontal é 8 m. Os dois formam um canto reto.\n8 · 8 = 64 e 15 · 15 = 225 (15 · 10 = 150 e 15 · 5 = 75). 64 + 225 = 289.\nO número que vezes ele mesmo dá 289 é 17: 17 · 10 = 170, 17 · 7 = 119, 170 + 119 = 289. dr = 17 m.',
                  {'tipo': 'diagrama', 'nome': 'torre-esfera-canhao', 'rotulos': ['', '', '', '', '', '', '17 m em linha reta', 'catetos: 15 m (20 − 5) e 8 m']}),
                 ('Achando tq: o tempo de queda',
                  'Aula da queda: velocidade cresce 10 m/s a cada segundo; distância = média × tempo. Em 1 s: média 5, cai 5 m. Em 2 s: chega a 20 m/s, média 10, cai 10 · 2 = 20 m.\nA torre tem 20 m, então tq = 2 s.')],
        volta='vmin = 17 ÷ 2 = 8,5 m/s (16 ÷ 2 = 8 e sobra 1, que dividido por 2 é 0,5).\nResposta: alternativa A. Com velocidade maior o projétil chega antes. Com 8 m/s ele faria só 8 · 2 = 16 m em 2 s e ainda faltaria 1 m: a esfera já teria batido no chão.',
        valores=[('dr', '17 m'), ('tq', '2 s')],
        pista='"solta e dispara no mesmo instante" → os dois caem juntos: ache a reta entre o canhão e o ponto onde a esfera foi solta e divida pelo tempo de queda.',
        rec1='20 m, 5 m, 8 m, g = 10', rec3='dr = 17 m; tq = 2 s',
        checagem=('Esfera solta de 45 m; canhão no chão, a 24 m da torre. Qual a menor velocidade para atingi-la até o fim da queda? (g = 10)',
                  ['17 m/s', '15 m/s', '23 m/s', '51 m/s'], '17 m/s',
                  'Queda de 45 m: 3 s. 24 · 24 = 576 e 45 · 45 = 2 025; soma 2 601 = 51 · 51. dr = 51 m. v = 51 ÷ 3 = 17 m/s.'),
        ancora='forte · ITA 2026 1ª fase q.14 (esfera solta e projétil disparado no mesmo instante: no referencial da esfera o projétil anda em reta e o ângulo some); aqui pede a menor velocidade, com plataforma e Pitágoras 8-15-17',
        canal='cin-03-video-inteiro-parte-4-13.txt [2:22:01] (trocar de referencial); queda em cin-08-video-inteiro-parte-9-13.txt [5:33:01]; a ideia de "cair junto" fora do canal',
        antes=['queda', 'pitagoras', 'cin-cair-junto'],
    ),
    dict(
        id='d2-escada-fis-ita-cin-00c', materia='Física', tema=T, calc=537.5,
        enunciado=('Em uma pista reta de 1 000 m, Ana parte do repouso do ponto P, em direção ao ponto Q, e acelera de modo constante até atingir a sua velocidade máxima, '
                   'que mantém daí em diante. A tabela mostra a velocidade de Ana em alguns instantes depois da partida.\n\n'
                   't (s) | 0 | 4 | 8 | 12 | 16 | 20\n'
                   'v (m/s) | 0 | 2 | 4 | 5 | 5 | 5\n\n'
                   'Vinte segundos depois da partida de Ana, Bia parte de Q em direção a P, com velocidade constante de 5 m/s. '
                   'Considere que as duas seguem pela pista sem parar. A que distância de P, em metros, Ana e Bia se encontram?'),
        dados=[('Pista', '1 000 m, de P a Q'), ('Ana', 'sai de P, do repouso; tabela v × t'), ('Bia', 'sai de Q aos 20 s, a 5 m/s constantes')],
        alts=[('462,5', 462.5, 'Deu a distância a partir de Q, não de P'),
              ('500', 500, 'Fez como se saíssem juntas, a 5 m/s: 1 000 ÷ 10 = 100 s e 5 · 100'),
              ('525', 525, 'Supôs Ana acelerando durante os 20 s (50 m): 50 + 5 · 95'),
              ('537,5', 537.5, 'OK'),
              ('550', 550, 'Supôs Ana a 5 m/s desde a partida (100 m aos 20 s): 100 + 5 · 90')],
        resumo='Ana chega a 5 m/s em 10 s (a = 0,5) e anda 25 m; nos 10 s seguintes anda 50 m; aos 20 s está a 75 m. Faltam 925 m a 10 m/s: 92,5 s. xe = 75 + 5 · 92,5 = 537,5 m.',
        ideia='Ana acelera e depois fica a 5 m/s, e a fase constante começa aos 10 s, antes dos 12 s que a tabela mostra. Quando Bia sai (20 s), Ana já está nela, e só então vale somar as velocidades das duas.',
        pecas=[('Gráfico de v contra t', 'Velocidade no alto (v) e tempo embaixo (t): a linha sobe reta enquanto Ana acelera e depois fica reta na horizontal.'),
               ('Velocidade de aproximação', 'Quando dois vão um contra o outro, a distância entre eles cai a soma das velocidades: 5 + 5 = 10 m/s.')],
        formulas=[('grafico', 'Aceleração', 'a = variação da velocidade ÷ tempo'), ('carro', 'Distância (média)', 'distância = média · tempo'),
                  ('carro', 'Aproximação', 'v de aproximação = v1 + v2')],
        desenho=('Pontos da tabela de Ana (v em m/s, t em s). Bia sai de Q aos 20 s.', 'grafico-vt-ana', []),
        eq='xe = ac + cte + 5 · ap', leitura='distância de P = o que Ana andou acelerando + o que andou a 5 m/s antes de Bia sair + o que anda depois',
        letras=[('xe', 'distância de P ao encontro, em m (o que a questão quer)'), ('ac', 'distância de Ana na fase acelerando, em m'),
                ('cte', 'distância de Ana a 5 m/s até Bia sair, em m'), ('ap', 'tempo, depois de Bia sair, até se cruzarem, em s')],
        eq_texto='O 5 vem dos 5 m/s de Ana depois que Bia sai. Antes disso, Ana já andou ac + cte.\nAgora é só achar ac, cte e ap, uma por vez.',
        achando=[('Achando ac: Ana acelerando',
                  'Pela tabela, a velocidade sobe 2 m/s a cada 4 s: a = 2 ÷ 4 = 0,5 m/s² (4 · 0,5 = 2). Ou seja, +0,5 m/s a cada segundo. Quantos 0,5 cabem em 5? 10: chega a 5 m/s em 10 s (antes dos 12 s da tabela).\nMédia: (0 + 5) ÷ 2 = 2,5 m/s. ac = 2,5 · 10 = 25 m.',
                  {'tipo': 'diagrama', 'nome': 'grafico-vt-ana', 'rotulos': ['', '', '', '10 s: 5 m/s', 'ac = 25 m', '']}),
                 ('Achando cte: Ana a 5 m/s antes de Bia sair',
                  'Bia sai aos 20 s. De 10 s a 20 s Ana já está a 5 m/s: 20 − 10 = 10 s.\ncte = 5 · 10 = 50 m. Aos 20 s, Ana está a 25 + 50 = 75 m de P.',
                  {'tipo': 'grafico', 'titulo': 'Velocidade de Ana (m/s) pelo tempo (s)',
                   'funcoes': [{'expr': '(0.5*x+5-abs(0.5*x-5))/2', 'rotulo': 'v de Ana'}],
                   'pontos': [{'x': 10, 'y': 5, 'rotulo': '10 s: 5 m/s'}, {'x': 20, 'y': 5, 'rotulo': '20 s: Bia sai'}],
                   'x': [0, 22], 'y': [0, 6]}),
                 ('Achando ap: o tempo até se cruzarem',
                  'Quando Bia sai, restam 1 000 − 75 = 925 m entre as duas. Em 1 s Ana anda 5 m e Bia anda 5 m: a distância cai 5 + 5 = 10 m a cada segundo.\nap = 925 ÷ 10 = 92,5 s (dividir por 10 anda a vírgula uma casa).')],
        volta='xe = 25 + 50 + 5 · 92,5 = 75 + 462,5 = 537,5 m (5 · 92 = 460 e 5 · 0,5 = 2,5).\nResposta: alternativa A. Conferindo por Bia: 5 · 92,5 = 462,5 m e 537,5 + 462,5 = 1 000 m.',
        valores=[('ac', '25 m'), ('cte', '50 m'), ('ap', '92,5 s')],
        pista='"acelera e depois fica constante" e "sai depois" → veja em que fase está quem saiu antes quando o outro sai, some as distâncias dele até aí e use a soma das velocidades.',
        rec1='1 000 m; Ana: tabela v × t; Bia sai aos 20 s a 5 m/s', rec3='ac = 25 m; cte = 50 m; ap = 92,5 s',
        checagem=('Ana acelera de 0 a 4 m/s em 8 s e depois segue a 4 m/s. Quantos metros ela anda nos primeiros 12 s?',
                  ['32 m', '48 m', '24 m', '16 m'], '32 m',
                  'Acelerando: (0 + 4) ÷ 2 · 8 = 16 m. Depois, 12 − 8 = 4 s a 4 m/s = 16 m. Total 32 m.'),
        ancora='parcial · Fuvest 2023 2ª fase dia 2 F06 (tabela de números, condição escondida de quem já está em regime e distâncias que se acumulam); aqui a condição é a fase de Ana quando Bia sai',
        canal='cin-06-video-inteiro-parte-7-13.txt [4:26:30] (área do gráfico v × t); encontro em cin-03-video-inteiro-parte-4-13.txt [2:22:01]',
        antes=['aceleracao', 'cin-quantos-cabem', 'queda', 'velocidade', 'cin-aproximacao'],
    ),
    dict(
        id='d2-escada-fis-ita-cin-00d', materia='Física', tema=T, calc=3,
        enunciado=('Um carrinho anda em linha reta durante um número inteiro de segundos. A velocidade dele, em m/s, é sempre um número inteiro e fica constante dentro de cada segundo; '
                   'a cada novo segundo ela é exatamente 1 m/s menor que no segundo anterior. A velocidade inicial é positiva e o carrinho anda sempre para a frente: '
                   'em nenhum segundo ele para (velocidade zero) nem inverte o sentido (velocidade negativa). Ele anda por mais de 1 segundo e percorre 120 m no total. '
                   'Quantas velocidades iniciais diferentes o carrinho pode ter?'),
        dados=[('Velocidade', 'inteira, cai 1 m/s a cada segundo'), ('Distância total', '120 m'), ('Tempo', 'mais de 1 s, sempre em movimento')],
        alts=[('3', 3, 'OK'),
              ('4', 4, 'Contou também o caso de 1 só segundo (120 m/s), que o enunciado exclui'),
              ('5', 5, 'Contou também 1 segundo e o caso de 16 s, que termina com velocidade zero'),
              ('8', 8, 'Contou os 8 casos de paridade certa (1, 3, 5, 15, 16, 48, 80, 240 s), sem exigir velocidade positiva'),
              ('20', 20, 'Contou todos os 20 divisores de 240, sem pensar na paridade')],
        resumo='seg · pu = 240 (seg segundos, pu = 1ª + última velocidade); seg e pu de paridades diferentes; com seg > 1 e última velocidade ≥ 1 servem seg = 3, 5 e 15: 3 velocidades iniciais (41, 26 e 15 m/s).',
        ideia='Cada segundo anda "velocidade · 1 s", então a distância é a soma das velocidades dos degraus: seg · (1ª + última) ÷ 2 = 120. Como seg + (1ª + última) é ímpar, um é par e o outro é ímpar, o que deixa poucos casos.',
        pecas=[('Soma em degraus', 'Velocidades que descem de 1 em 1: soma = quantidade · (primeira + última) ÷ 2.'),
               ('Última velocidade', 'É a 1ª menos (seg − 1). Tem de ser 1 ou mais, senão o carrinho para ou volta.')],
        formulas=[('grafico', 'Soma em degraus', 'soma = seg · (1ª + última) ÷ 2'), ('contagem', 'Produto', 'seg · pu = 2 · 120 = 240')],
        eq='qt = quantos seg servem em seg · pu = 240', leitura='quantidade de valores de seg com seg · pu = 240, onde pu = 1ª velocidade + última',
        letras=[('qt', 'quantas velocidades iniciais diferentes (o que a questão quer)'), ('seg', 'quantos segundos o carrinho anda'),
                ('pu', 'soma da primeira velocidade com a última, em m/s'), ('v1', 'primeira velocidade (a inicial), em m/s')],
        eq_texto='Cada seg que serve dá uma velocidade inicial v1. A soma em degraus diz seg · pu ÷ 2 = 120. Multiplico os dois lados por 2 para sumir o ÷ 2: seg · pu = 240. Teste: seg = 3, pu = 80: 3 · 80 ÷ 2 = 120 e 3 · 80 = 240.\nAgora é só achar seg, pu e v1 e contar os que servem.',
        achando=[('Achando seg: os segundos possíveis',
                  'seg divide 240. Teste: seg = 3 e v1 = 41 (41 + 40 + 39): pu = 41 + 39 = 80 e seg + pu = 83 = 2 · 41 + 1. Sempre: a última é v1 − (seg − 1), então pu = 2 · v1 − seg + 1 e seg + pu = 2 · v1 + 1, ímpar. Um é par e o outro é ímpar.\n240 = 16 · 15. Os divisores de 15 são 1, 3, 5, 15. O 16 inteiro fica num só deles: seg = 1, 3, 5 ou 15 (pu = 240, 80, 48, 16) ou seg = 16, 48, 80 ou 240 (é 16 · 1, 16 · 3, 16 · 5, 16 · 15; pu = 15, 5, 3, 1).'),
                 ('Achando pu: a soma de cada caso', 'Para cada seg, pu = 240 ÷ seg. Exemplos: 240 ÷ 3 = 80 (3 · 80 = 240) e 240 ÷ 15 = 16 (15 · 16 = 240).\nA tabela do próximo passo traz os 8 casos.'),
                 ('Achando v1: a velocidade inicial de cada caso',
                  'Do pu = 1ª + última e última = 1ª − (seg − 1): pu = 2 · v1 − seg + 1, então v1 = (pu + seg − 1) ÷ 2. Teste seg = 3, pu = 80: (80 + 3 − 1) ÷ 2 = 41. A última é v1 − (seg − 1) e precisa ser 1 ou mais; seg precisa ser maior que 1.\nServem seg = 3, 5 e 15.',
                  {'tipo': 'tabela', 'titulo': 'Os 8 casos de seg', 'cabecalho': ['seg', 'pu = 240 ÷ seg', 'v1', 'Última', 'Serve?'],
                   'linhas': [['1', '240', '120', '120', 'não: só 1 s'], ['3', '80', '41', '39', 'sim'], ['5', '48', '26', '22', 'sim'],
                              ['15', '16', '15', '1', 'sim'], ['16', '15', '15', '0', 'não: para'], ['48', '5', '26', '−21', 'não: volta'],
                              ['80', '3', '41', '−38', 'não: volta'], ['240', '1', '120', '−119', 'não: volta']]})],
        volta='Servem seg = 3 (41 + 40 + 39 = 120), seg = 5 (26 + 25 + 24 + 23 + 22 = 120) e seg = 15 (15 + 14 + ... + 1 = 120). São 3 velocidades iniciais: 41, 26 e 15 m/s.\nResposta: alternativa A.',
        valores=[('seg', '3, 5 ou 15 s'), ('pu', '80, 48 ou 16 m/s'), ('v1', '41, 26 ou 15 m/s'), ('qt', '3')],
        pista='"velocidade inteira que cai de 1 em 1" e "distância total" → soma em degraus: seg · pu = 2 · distância; liste os pares de paridade oposta e tire os casos em que a velocidade zera ou fica negativa.',
        rec1='120 m; cai 1 m/s por segundo; mais de 1 s', rec3='seg = 3, 5, 15; pu = 80, 48, 16',
        checagem=('Mesmo carrinho, mas com 12 m no total. Quantas velocidades iniciais diferentes?', ['1', '2', '3', '4'], '1',
                  'seg · pu = 24: com paridade oposta, seg = 1, 3, 8 ou 24. seg = 1 é só 1 s. seg = 8 (pu = 3): v1 = 5 e a última, 5 − 7 = −2, volta. seg = 24 (pu = 1): v1 = 12 e a última é negativa. Só seg = 3 (pu = 8, v1 = 5): 5 + 4 + 3 = 12.'),
        ancora='parcial · HMMT nov. 2022 Guts q.12 (velocidade inteira que cai 1 por minuto, distância total fixa, número inteiro de minutos: contagem com restrição de inteiros); por técnica, não há real de Física do tema',
        canal='fora do canal: divisores, paridade e contagem de casos (0 hits no canal); soma de degraus como área do gráfico v × t em cin-06-video-inteiro-parte-7-13.txt [4:26:30]',
        antes=['cin-divisores-e-par-impar', 'cin-soma-em-degraus', 'numero-que-falta', 'velocidade'],
    ),
]

MANTER = {}


def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


ANTES_NOVOS = {
    'cin-hora-em-minutos': {
        'titulo': 'Horas, minutos e km por minuto',
        'linhas': [
            '1 hora tem 60 minutos. De minutos para horas, divida por 60; de horas para minutos, multiplique por 60.',
            'Velocidade de 90 km/h: em 1 hora anda 90 km, então em 1 minuto anda 90 ÷ 60 = 1,5 km. Assim, 90 km/h = 1,5 km/min.',
            'Ao contrário: 2 km/min anda 2 · 60 = 120 km em 60 minutos. Assim, 2 km/min = 120 km/h.',
            'Horário: das 14 h 02 min às 14 h 05 min passaram 5 − 2 = 3 minutos. Segundos iguais nos dois horários se cancelam.',
        ],
        'visual': tabela('km/h e km/min', ['Em km/h', 'Conta', 'Em km/min'], [['60 km/h', '60 ÷ 60', '1 km/min'], ['90 km/h', '90 ÷ 60', '1,5 km/min'], ['120 km/h', '120 ÷ 60', '2 km/min']]),
        'exercicios': [
            {'enunciado': 'Um trem anda a 120 km/h. Quantos km ele anda por minuto?', 'alternativas': ['2 km', '12 km', '0,5 km', '7 200 km'], 'certa': 0,
             'resolucao': '2 km: 120 ÷ 60 = 2 km a cada minuto.\n12 km é dividir por 10; 0,5 km é 60 ÷ 120; 7 200 km é 120 · 60.'},
            {'enunciado': 'Uma lancha anda 1,2 km por minuto. Qual é a velocidade em km/h?', 'alternativas': ['72 km/h', '0,02 km/h', '1,2 km/h', '7,2 km/h'], 'certa': 0,
             'resolucao': '72 km/h: 1,2 · 60 = 72 km em 1 hora.\n0,02 é 1,2 ÷ 60; 1,2 é não converter; 7,2 é multiplicar por 6.'},
        ],
    },
    'cin-tempo-da-velocidade': {
        'titulo': 'Achar o tempo: distância ÷ velocidade',
        'linhas': [
            'Velocidade = distância ÷ tempo. Se você quer o tempo, desfaça a conta: tempo = distância ÷ velocidade.',
            'Carro a 60 km/h anda 120 km em 120 ÷ 60 = 2 horas. Confira: 60 · 2 = 120.',
            'Vale em qualquer unidade: 90 m a 30 m/s leva 90 ÷ 30 = 3 s.',
            'Se a velocidade está em km por minuto, o tempo sai em minutos: 12 km a 1,5 km/min leva 12 ÷ 1,5 = 8 min.',
        ],
        'visual': tabela('Tempo = distância ÷ velocidade', ['Distância', 'Velocidade', 'Tempo'], [['120 km', '60 km/h', '2 h'], ['90 m', '30 m/s', '3 s'], ['12 km', '1,5 km/min', '8 min']]),
        'exercicios': [
            {'enunciado': 'Uma moto anda a 50 km/h. Quanto tempo leva para andar 150 km?', 'alternativas': ['3 h', '7 500 h', '0,33 h', '200 h'], 'certa': 0,
             'resolucao': '3 h: 150 ÷ 50 = 3 (confira: 50 · 3 = 150).\n7 500 h é 150 · 50; 0,33 h é 50 ÷ 150; 200 h é 150 + 50.'},
            {'enunciado': 'Um nadador faz 100 m a 2 m/s. Quanto tempo leva?', 'alternativas': ['50 s', '200 s', '0,02 s', '98 s'], 'certa': 0,
             'resolucao': '50 s: 100 ÷ 2 = 50 (confira: 2 · 50 = 100).\n200 s é 100 · 2; 0,02 s é 2 ÷ 100; 98 s é 100 − 2.'},
        ],
    },
    'cin-cair-junto': {
        'titulo': 'Cair junto: a gravidade não aproxima nem afasta',
        'linhas': [
            'A gravidade faz qualquer coisa solta cair 5 m em 1 s e 20 m em 2 s. Vale para a bola solta e para a pedra atirada.',
            'Caso: bola solta do alto, parada no ar. Se não houvesse gravidade, uma pedra atirada em reta para ela a atingiria depois de um certo tempo.',
            'Com gravidade, em 2 s a bola caiu 20 m e a pedra também caiu 20 m, a partir da reta que seguiria sem gravidade.',
            'Os dois caíram a mesma altura, então a distância entre eles é a mesma de quando não há gravidade.',
            'Por isso o encontro acontece quando a pedra percorreria, em reta e sem gravidade, a distância até o ponto de onde a bola foi solta.',
        ],
        'visual': tabela('Os dois caem juntos', ['Tempo', 'Bola cai', 'Pedra cai (a partir da reta)'], [['1 s', '5 m', '5 m'], ['2 s', '20 m', '20 m'], ['3 s', '45 m', '45 m']]),
        'exercicios': [
            {'enunciado': 'Uma bola é solta de uma janela alta e, no mesmo instante, uma pedra é atirada a 10 m/s em direção ao ponto de onde a bola saiu, a 30 m dali. Em quanto tempo a pedra atinge a bola?',
             'alternativas': ['3 s', '10 s', '0,3 s', '30 s'], 'certa': 0,
             'resolucao': '3 s: sem gravidade a pedra faz 30 m em 30 ÷ 10 = 3 s. Com gravidade os dois caem igual, e o encontro é nesse mesmo tempo.\n10 s é 30 − 20; 0,3 s é 10 ÷ 30; 30 s é a distância.'},
            {'enunciado': 'Em 2 s, quantos metros cai uma bola solta e quantos cai uma pedra atirada (a partir da reta que seguiria sem gravidade)? Use g = 10 m/s².',
             'alternativas': ['20 m e 20 m', '20 m e 10 m', '10 m e 20 m', '40 m e 40 m'], 'certa': 0,
             'resolucao': '20 m e 20 m: em 2 s, qualquer coisa cai 20 m (média 10 m/s · 2 s).\nOs outros dão alturas diferentes para os dois, mas a gravidade puxa igual.'},
        ],
    },
    'cin-aproximacao': {
        'titulo': 'Um contra o outro: as velocidades se somam',
        'linhas': [
            'Duas pessoas vão uma contra a outra: uma anda 5 m a cada segundo e a outra também 5 m a cada segundo.',
            'Em 1 s a distância entre elas cai 5 + 5 = 10 m; em 2 s, cai 20 m. A distância cai 10 m por segundo.',
            'Esse 10 m/s é a velocidade de aproximação: a soma das duas velocidades.',
            'Se estão a 100 m, o encontro é em 100 ÷ 10 = 10 s.',
        ],
        'visual': tabela('Distância entre elas', ['Tempo', 'Cada uma anda', 'A distância cai'], [['1 s', '5 m', '10 m'], ['2 s', '10 m', '20 m'], ['10 s', '50 m', '100 m']]),
        'exercicios': [
            {'enunciado': 'Duas pessoas vão uma contra a outra, a 3 m/s e a 5 m/s. Quantos metros por segundo a distância entre elas diminui?',
             'alternativas': ['8 m/s', '2 m/s', '15 m/s', '4 m/s'], 'certa': 0,
             'resolucao': '8 m/s: em 1 s uma anda 3 m e a outra 5 m; 3 + 5 = 8.\n2 m/s é 5 − 3; 15 é 3 · 5; 4 é a média.'},
            {'enunciado': 'Dois ciclistas, a 100 m um do outro, vão um contra o outro a 6 m/s e 4 m/s. Em quanto tempo se encontram?',
             'alternativas': ['10 s', '50 s', '20 s', '1 000 s'], 'certa': 0,
             'resolucao': '10 s: a distância cai 6 + 4 = 10 m por segundo; 100 ÷ 10 = 10.\n50 s é 100 ÷ 2 (6 − 4); 20 s é 100 ÷ 5 (a média); 1 000 s é 100 · 10.'},
        ],
    },
    'cin-quantos-cabem': {
        'titulo': 'Aceleração: quantos cabem',
        'linhas': [
            'a = 0,5 m/s² quer dizer: a velocidade sobe 0,5 m/s a cada segundo.',
            'Em 1 s, 0,5 m/s; em 2 s, 1 m/s; em 4 s, 2 m/s; em 10 s, 5 m/s.',
            'Para saber em quanto tempo chega a 5 m/s, pergunte: quantos 0,5 cabem em 5? Cabem 10 (0,5 · 10 = 5). Então são 10 s.',
            'É a conta 5 ÷ 0,5 = 50 ÷ 5 = 10 (multiplicando os dois por 10 some a vírgula).',
        ],
        'visual': tabela('Aceleração de 0,5 m/s²', ['Tempo', 'Velocidade'], [['1 s', '0,5 m/s'], ['2 s', '1 m/s'], ['4 s', '2 m/s'], ['10 s', '5 m/s']]),
        'exercicios': [
            {'enunciado': 'Um carro ganha 2 m/s a cada segundo. Em quantos segundos vai de 0 a 10 m/s?', 'alternativas': ['5 s', '20 s', '12 s', '0,2 s'], 'certa': 0,
             'resolucao': '5 s: cabem 5 vezes o 2 em 10 (2 · 5 = 10).\n20 s é 2 · 10; 12 s é 2 + 10; 0,2 s é 2 ÷ 10.'},
            {'enunciado': 'Com a = 0,5 m/s², quanto tempo para ir de 0 a 3 m/s?', 'alternativas': ['6 s', '1,5 s', '3,5 s', '0,6 s'], 'certa': 0,
             'resolucao': '6 s: cabem 6 vezes o 0,5 em 3 (0,5 · 6 = 3).\n1,5 s é 3 · 0,5; 3,5 s é 3 + 0,5; 0,6 s é 3 ÷ 5.'},
        ],
    },
    'cin-divisores-e-par-impar': {
        'titulo': 'Divisores, par e ímpar',
        'linhas': [
            'Divisor de 12 é número que cabe certinho em 12: 1, 2, 3, 4, 6 e 12. Eles vêm em pares: 1 · 12, 2 · 6, 3 · 4.',
            'Par termina em 0, 2, 4, 6 ou 8. Ímpar termina em 1, 3, 5, 7 ou 9.',
            'Par + ímpar dá ímpar (4 + 3 = 7). Par + par e ímpar + ímpar dão par (4 + 2 = 6; 3 + 5 = 8).',
            'Então, se a soma de dois números é ímpar, um é par e o outro é ímpar.',
            'Pares que multiplicam 12: 1 e 12 somam 13 (ímpar); 2 e 6 somam 8 (par); 3 e 4 somam 7 (ímpar).',
        ],
        'visual': tabela('Pares que multiplicam 12', ['Par', 'Soma', 'Soma ímpar?'], [['1 e 12', '13', 'sim'], ['2 e 6', '8', 'não'], ['3 e 4', '7', 'sim']]),
        'exercicios': [
            {'enunciado': 'Qual par de números multiplica 16 e soma um número ímpar?', 'alternativas': ['1 e 16', '2 e 8', '4 e 4', '8 e 2'], 'certa': 0,
             'resolucao': '1 e 16: 1 · 16 = 16 e 1 + 16 = 17, ímpar.\n2 e 8 somam 10 e 4 e 4 somam 8: pares, não servem.'},
            {'enunciado': 'Quantos divisores tem o número 10?', 'alternativas': ['4', '2', '5', '10'], 'certa': 0,
             'resolucao': '4: os divisores são 1, 2, 5 e 10.\n2 é contar só o 2 e o 5; 5 é metade de 10; 10 é o próprio número.'},
        ],
    },
    'cin-soma-em-degraus': {
        'titulo': 'Somar números que descem de 1 em 1',
        'linhas': [
            'Some 5 + 4 + 3 = 12. Os números descem de 1 em 1 (de 5 a 3), então a soma tem um atalho.',
            'Some o primeiro com o último: 5 + 3 = 8. Multiplique pela quantidade de números e divida por 2: 8 · 3 = 24 e 24 ÷ 2 = 12.',
            'Por quê: o 5 faz par com o 3 (soma 8) e o 4 do meio vale metade de 8. Três números valem 3 metades de 8, que dá 12.',
            'Outro: 7 + 6 + 5 + 4 = 22. Primeiro + último = 7 + 4 = 11; 11 · 4 = 44; 44 ÷ 2 = 22.',
            'Se cada número é a velocidade de 1 segundo, a soma é a distância percorrida.',
        ],
        'visual': tabela('Atalho da soma', ['Números', 'Primeiro + último', 'Conta'],
                         [['5, 4, 3', '5 + 3 = 8', '8 · 3 ÷ 2 = 12'], ['7, 6, 5, 4', '7 + 4 = 11', '11 · 4 ÷ 2 = 22'], ['9, 8, 7, 6, 5', '9 + 5 = 14', '14 · 5 ÷ 2 = 35']]),
        'exercicios': [
            {'enunciado': 'Some 8 + 7 + 6 + 5 + 4 + 3.', 'alternativas': ['33', '66', '11', '24'], 'certa': 0,
             'resolucao': '33: 8 + 3 = 11; 11 · 6 = 66; 66 ÷ 2 = 33.\n66 esquece o ÷ 2; 11 é só primeiro + último; 24 é 8 · 3.'},
            {'enunciado': 'Um carrinho anda 6 m/s no 1º segundo, 5 no 2º, 4 no 3º e 3 no 4º. Quantos metros no total?', 'alternativas': ['18 m', '36 m', '9 m', '24 m'], 'certa': 0,
             'resolucao': '18 m: 6 + 3 = 9; 9 · 4 = 36; 36 ÷ 2 = 18.\n36 m esquece o ÷ 2; 9 m é só primeiro + último; 24 m é 6 · 4.'},
        ],
    },
}
assert sum(6 + 5 + 4 + 3 for _ in [0]) == 18 and 8 + 7 + 6 + 5 + 4 + 3 == 33 and 7 + 6 + 5 + 4 == 22 and 9 + 8 + 7 + 6 + 5 == 35
for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('cin-'), _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['resolucao'].split('\n')[0].count(_e['alternativas'][_e['certa']].split(' ')[0]) >= 1
        assert len(set(_e['alternativas'])) == len(_e['alternativas'])
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
    _ls = [l for l, _ in _q['letras']]
    assert len(set(_ls)) == len(_ls) and not set(_ls) & set('ABCDEmstdDFNQU'), (_q['id'], _ls)
    assert _q['eq'].count('(') == _q['eq'].count(')')
