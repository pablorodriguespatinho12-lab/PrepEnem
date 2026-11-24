"""Grandezas e Medidas (2º degrau de Matemática), nível acima v2, 23/11/2026.

a = ENEM (MANTER: sítio, escala 1 : 25 000 e cópia a 50%), b = ITA (robô cuja velocidade cai à metade a cada trecho),
c = Fuvest (regra de três COMPOSTA: ração de abrigo com doação de 50%, adoção e dieta nova), d = Harvard-MIT (relógio que anda para trás).
Só junta o degrau 1 (Aritmética e Porcentagem). Toda resposta é conferida por conta Python (assert) neste módulo.
"""
from fractions import Fraction as F

ARQUIVO = 'matematica-acima-novas.json'
T = 'Grandezas e Medidas'

# ---------------------------------------------------------------- a) ENEM (MANTER): conferência da conta que já está no JSON
escala_copia = 25000 * 2  # 1 cm da cópia = 50 000 cm = 500 m
assert escala_copia / 100 == 500
assert (4 * 500) * (6 * 500) / 10000 == 600  # 600 ha (alternativa C)

# ---------------------------------------------------------------- b) ITA
# 8 trechos de 1 m; 1º trecho a 4 m/min; a velocidade cai à metade a cada trecho
vel_b = [F(4) / 2 ** k for k in range(8)]
tempos_b = [1 / v for v in vel_b]
assert tempos_b == [F(1, 4), F(1, 2), 1, 2, 4, 8, 16, 32]
tot_b = sum(tempos_b)
assert tot_b == F(255, 4) == F(63) + F(3, 4)  # 63,75 min
P_b, Q_b = sum(tempos_b[:4]), sum(tempos_b[4:])
assert (P_b, Q_b, P_b + Q_b) == (F(15, 4), 60, F(255, 4))
assert F(3, 4) * 60 == 45 and divmod(63, 60) == (1, 3)  # 63,75 min = 1 h 03 min 45 s
# distratores
assert F(8, 4) == 2  # 2 min
media_v = sum(vel_b) / 8
assert abs(float(8 / media_v) - 8.0314) < 1e-3 and divmod(round(float(8 / media_v) * 60), 60) == (8, 2)  # 8 min 2 s
assert 64 == 63 + 1 and divmod(64, 60) == (1, 4)  # 1 h 04 min
assert 8 / vel_b[-1] == 256 and divmod(256, 60) == (4, 16)  # 4 h 16 min
# a ideia: cada tempo é o dobro do anterior e a velocidade média é 8 m ÷ 63,75 min, não a média das velocidades
assert float(F(8) / tot_b) < float(media_v)
# "Sua vez": 4 trechos de 1 m, 1º a 2 m/min
tempos_sv = [1 / (F(2) / 2 ** k) for k in range(4)]
assert tempos_sv == [F(1, 2), 1, 2, 4] and sum(tempos_sv) == F(15, 2)
ENUN_B = ('Um robô percorre, em linha reta, 8 trechos seguidos de 1 m cada um. No 1º trecho a velocidade dele é 4 m/min e, ao terminar '
          'cada trecho, a velocidade passa à metade da que tinha. Dentro de cada trecho a velocidade é constante. '
          'Quanto tempo o robô leva para percorrer os 8 m?')
assert 250 <= len(ENUN_B) <= 400, len(ENUN_B)

# ---------------------------------------------------------------- c) Fuvest (regra de três composta)
C0, G0, D0 = 60, 200, 15       # combinado: cães, gramas por cão por dia, dias de ração
K, PCT = 5, 50                # dias já passados; doação em % do estoque comprado
C1, G1 = 40, 250               # depois: cães e gramas por cão por dia
estoque = F(C0 * G0 * D0, 1000)  # kg comprados
assert estoque == 180
doacao = estoque * PCT / 100
total_c = estoque + doacao
comido = F(C0 * G0 * K, 1000)
falta = total_c - comido
assert (doacao, total_c, comido, falta) == (90, 270, 60, 210)
cons_dia = F(C1 * G1, 1000)
assert cons_dia == 10
x_c = falta / cons_dia
assert x_c == 21
# a regra de três composta do Pablo: antes ÷ agora em cada coluna; quem anda ao contrário dos dias fica do lado dos dias
assert F(D0) / x_c * F(C0, C1) * F(G0, G1) == estoque / falta
assert F(60, 40) == F(3, 2) and F(200, 250) == F(4, 5) and F(3, 2) * F(4, 5) == F(6, 5) and F(180, 210) == F(6, 7)
assert F(15) * F(6, 5) == 18 and F(18) / x_c == F(6, 7) and 6 * 21 == 18 * 7 == 126
# distratores
assert estoque - comido == 120 and (estoque - comido) / cons_dia == 12         # esqueceu a doação
assert (estoque - comido) * F(100 + PCT, 100) / cons_dia == 18                 # 50% só sobre o que sobrava (120 kg)
assert total_c / cons_dia == 27                                                # esqueceu o que já foi comido
assert falta / F(C0 * G1, 1000) == 14                                          # esqueceu a adoção (60 cães)
assert D0 - K == 10 and x_c not in (60, 200, 15, 5, 50, 40, 250, 20, 150)
# "Sua vez": 8 galinhas, 12 kg, 5 dias; com 10 galinhas e 18 kg
sv_c = F(5) * F(8, 10) * F(18, 12)
assert sv_c == 6 and 5 * F(8, 10) == 4 and 5 * F(3, 2) == F(15, 2) and 18 / (10 * F(12, 8 * 5)) == 6
ENUN_C = ('Um abrigo de animais tem 60 cães e comprou ração para 15 dias, com cada cão comendo 200 g por dia. '
          'Cinco dias depois, o abrigo recebeu uma doação de ração igual a 50% do estoque que tinha sido comprado e, nesse mesmo dia, 20 cães foram adotados. '
          'Os 40 cães que ficaram passaram a comer 250 g por dia, porque o veterinário aumentou a dieta. A tabela resume a situação.\n\n'
          'Situação | Cães | Ração por cão (g/dia) | Ração (kg) | Dias\n'
          'Comprado | 60 | 200 | o estoque comprado | 15\n'
          'A partir do 6º dia | 40 | 250 | o que ainda há | ?\n\n'
          'Nos 5 primeiros dias todos os cães comeram a quantidade prevista. A partir do 6º dia, durante quantos dias a ração ainda dura?')
assert len(ENUN_C) >= 600, len(ENUN_C)
assert 'operários' not in ENUN_C

# ---------------------------------------------------------------- d) Harvard-MIT
# relógio de ponteiros (mostrador de 12 h) anda para trás a 3 vezes a velocidade de um relógio certo
def vezes_certo(vezes, d0):
    """Quantas vezes (t em (0, 24]) o relógio errado mostra a hora certa. d0 = diferença de agora, em horas, entre 0 e 12 (exclusive)."""
    rel = 1 + vezes  # a diferença cresce 1 + vezes horas a cada hora
    n = 0
    t = F(0)
    k = 0
    while True:
        t = (12 * k - d0) / rel  # diferença d0 + rel·t = 12 k
        if t > 24:
            return n
        if t > 0:
            n += 1
        k += 1


for d0 in [F(1, 7), F(1), F(5, 2), F(6), F(47, 4), F(2399, 200), F(1199, 100)]:
    assert vezes_certo(3, d0) == 8, d0
    assert vezes_certo(2, d0) == 6, d0
    assert vezes_certo(4, d0) == 10, d0
assert 12 / (3 + 1) == 3 and 24 / 3 == 8
assert 24 / 12 == 2 and 24 / (12 / (3 - 1)) == 4 and 24 / (12 / 3) == 6 and 24 / (3 - 1) == 12  # distratores
assert 12 / (2 + 1) == 4 and 24 / 4 == 6  # "Sua vez"
ENUN_D = ('Um relógio de ponteiros, sem tique, anda de modo contínuo para trás, a 3 vezes a velocidade de um relógio certo, e agora mostra uma hora errada. '
          'O mostrador tem só as 12 horas, sem distinguir manhã de tarde. Quantas vezes, nas próximas 24 horas, esse relógio vai mostrar a hora certa?')
assert 250 <= len(ENUN_D) <= 360, len(ENUN_D)

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-gra-00b', materia='Matemática', tema=T, calc=63.75,
        enunciado=ENUN_B,
        dados=[('Trechos', '8 trechos de 1 m cada'), ('Velocidade no 1º trecho', '4 m/min'),
               ('A cada trecho que termina', 'a velocidade cai à metade'), ('Quero', 'tempo total, em horas, minutos e segundos')],
        alts=[('2 min', 2, 'Dividiu 8 m pela velocidade do começo: 8 ÷ 4'),
              ('8 min 2 s', 8.0314, 'Dividiu 8 m pela média das 8 velocidades (cerca de 0,996 m/min)'),
              ('1 h 03 min 45 s', 63.75, 'OK'),
              ('1 h 04 min', 64, 'Arredondou os 45 s para 1 minuto cheio: 63 min + 1 min'),
              ('4 h 16 min', 256, 'Dividiu 8 m pela última velocidade, 1/32 m/min: 8 · 32 = 256 min')],
        resumo='Cada trecho leva 1 ÷ velocidade, e o tempo dobra: 0,25; 0,5; 1; 2; 4; 8; 16; 32 min. Soma = 63,75 min = 1 h 03 min 45 s.',
        ideia='Velocidade pela metade quer dizer tempo em dobro: cada metro leva o dobro do anterior. Some os 8 tempos e passe os minutos para horas, minutos e segundos; a média das velocidades não serve.',
        pecas=[('Tempo de um trecho', 'Distância ÷ velocidade. Se a velocidade cai à metade, o tempo do trecho dobra.'),
               ('Velocidade média', 'Distância total ÷ tempo total. Não é a média das velocidades dos trechos.')],
        formulas=[('carro', 'Tempo de um trecho', 'tempo = distância ÷ velocidade'), ('contagem', 'Tempo total', 'soma dos tempos dos 8 trechos'),
                  ('texto', 'Minutos em segundos', '1 min = 60 s; 1 h = 60 min')],
        eq='T = P + Q', leitura='tempo total = tempo dos 4 primeiros trechos + tempo dos 4 últimos trechos',
        letras=[('T', 'tempo total para os 8 m, em minutos (o que a questão quer)'), ('P', 'tempo dos 4 primeiros trechos, em minutos'),
                ('Q', 'tempo dos 4 últimos trechos, em minutos')],
        eq_texto='O tempo total é a soma dos tempos de todos os trechos. Separei em dois grupos de 4 só para a conta ficar curta.\nAgora é só achar P e Q, uma por vez.',
        achando=[('Achando P: os 4 primeiros trechos',
                  'Cada trecho tem 1 m, então tempo = 1 ÷ velocidade. Velocidades: 4; 2; 1; 0,5 m/min.\nTempos: 1 ÷ 4 = 0,25; 1 ÷ 2 = 0,5; 1 ÷ 1 = 1; 1 ÷ 0,5 = 2 min.\nP = 0,25 + 0,5 + 1 + 2 = 3,75 min.',
                  {'tipo': 'tabela', 'titulo': 'Os 4 primeiros trechos', 'cabecalho': ['Trecho', 'Velocidade (m/min)', 'Tempo (min)'],
                   'linhas': [['1º', '4', '0,25'], ['2º', '2', '0,5'], ['3º', '1', '1'], ['4º', '0,5', '2']]}),
                 ('Achando Q: os 4 últimos trechos',
                  'Velocidades: 0,25; 0,125; 0,0625; 0,03125 m/min.\nTempos: 1 ÷ 0,25 = 100 ÷ 25 = 4; 1 ÷ 0,125 = 1 000 ÷ 125 = 8; 1 ÷ 0,0625 = 10 000 ÷ 625 = 16; 1 ÷ 0,03125 = 100 000 ÷ 3 125 = 32 min.\nQ = 4 + 8 + 16 + 32 = 60 min.',
                  {'tipo': 'tabela', 'titulo': 'Os 4 últimos trechos', 'cabecalho': ['Trecho', 'Velocidade (m/min)', 'Tempo (min)'],
                   'linhas': [['5º', '0,25', '4'], ['6º', '0,125', '8'], ['7º', '0,0625', '16'], ['8º', '0,03125', '32']]})],
        volta='T = 3,75 + 60 = 63,75 min.\nO 0,75 min vira segundos: 0,75 · 60 = 45 s. Os 63 min são 60 + 3 = 1 h 03 min.\nT = 1 h 03 min 45 s.\nResposta: alternativa X. Conferindo: 8 m em 63,75 min dá cerca de 0,125 m/min, bem menos que a média das velocidades (0,996).',
        valores=[('P', '3,75 min'), ('Q', '60 min'), ('T', '63,75 min = 1 h 03 min 45 s')],
        pista='"velocidade cai à metade" a cada trecho → o tempo de cada trecho dobra: ache o tempo de cada um (distância ÷ velocidade), some e passe os minutos para h, min e s.',
        rec1='8 trechos de 1 m; 4 m/min; cai à metade a cada trecho', rec3='P = 3,75 min; Q = 60 min; T = 1 h 03 min 45 s',
        checagem=('Robô de 4 trechos de 1 m. O 1º trecho é a 2 m/min e a velocidade cai à metade a cada trecho. Quanto tempo leva?',
                  ['7,5 min', '2 min', '16 min', '4 min'], '7,5 min',
                  'Velocidades 2; 1; 0,5; 0,25. Tempos 0,5; 1; 2; 4. Soma = 7,5 min.'),
        ancora='forte · Oxford Extra MAT dez/2021 q.D (velocidade muda a cada ponto inteiro e o tempo até o marco n é soma de potências de 2); aqui pede o tempo dos 8 m e a conta termina em h, min e s. A pegadinha da média que engana vem de ENEM 2020 q.153 (CD7, velocidade média com tabela)',
        canal='cin-02-video-inteiro-parte-3-13.txt [1:20:31] (velocidade média não é média das velocidades: deslocamento ÷ tempo)',
        antes=['velocidade', 'dividir-por-decimal', 'gra-hora-minuto-decimal'],
    ),
    dict(
        id='d2-escada-mat-ita-gra-00c', materia='Matemática', tema=T, calc=21,
        enunciado=ENUN_C,
        dados=[('Comprado', 'ração para 15 dias, 60 cães, 200 g por cão por dia'), ('Doação, no 6º dia', '50% do estoque comprado'),
               ('Adoção, no 6º dia', '20 dos 60 cães'), ('Depois', '40 cães, 250 g por cão por dia'),
               ('Quero', 'dias que a ração dura, a partir do 6º dia')],
        alts=[('12', 12, 'Esqueceu a doação: 120 kg ÷ 10 kg por dia'),
              ('14', 14, 'Esqueceu a adoção e usou 60 cães a 250 g: 210 ÷ 15'),
              ('18', 18, 'Calculou os 50% sobre o que sobrava (120 kg) e não sobre o comprado: 180 ÷ 10'),
              ('21', 21, 'OK'),
              ('27', 27, 'Esqueceu o que já foi comido: 270 ÷ 10')],
        resumo='Comprou 60 · 0,2 · 15 = 180 kg; com a doação, 270 kg; em 5 dias comeram 60 kg; sobram 210 kg. Fica 15/x · 60/40 · 200/250 = 180/210, e x = 21.',
        ideia='Primeiro ache a ração que ainda há: comprada mais doada, menos a já comida (gramas em quilos). Depois monte a regra de três composta, antes ÷ agora em cada coluna: cães e gramas por cão andam ao contrário dos dias; a ração anda junto.',
        pecas=[('Grandezas inversas', 'Mais cães, menos dias. Mais gramas por cão, menos dias. Elas andam ao contrário dos dias.'),
               ('Grandezas diretas', 'Mais ração, mais dias. Ela anda junto com os dias.')],
        formulas=[('porcentagem', 'Doação', 'total = estoque · (1 + %)'), ('texto', 'Regra de três composta', 'antes ÷ agora, uma coluna por grandeza'),
                  ('texto', 'Gramas e quilos', '1 kg = 1 000 g; 200 g = 0,2 kg')],
        eq='15 ÷ x × 60 ÷ 40 × 200 ÷ 250 = S ÷ R',
        leitura='em cada coluna, antes ÷ agora; cães e gramas (ao contrário dos dias) ficam do lado dos dias, a ração do outro lado',
        letras=[('x', 'dias que a ração ainda dura, a partir do 6º dia (o que a questão quer)'), ('S', 'ração comprada no começo, em kg'),
                ('R', 'ração que ainda há no 6º dia, em kg')],
        eq_texto='É a tabela antes e agora, uma coluna por grandeza. Os dias, 15 antes e x agora, ficam de um lado; as outras colunas entram uma a uma.\nAgora é só achar S e R, uma por vez.',
        achando=[('Achando S: a ração comprada',
                  '200 g = 0,2 kg. Os 60 cães comem 60 · 0,2 = 12 kg por dia.\nPara 15 dias: S = 12 · 15 = 180 kg.'),
                 ('Achando R: a ração que ainda há',
                  'Doação de 50%: 180 · 0,5 = 90 kg; total 180 + 90 = 270 kg. Em 5 dias comeram 12 · 5 = 60 kg.\nR = 270 − 60 = 210 kg.\nTabela, antes em cima e agora embaixo.',
                  {'tipo': 'tabela', 'titulo': 'Antes e agora', 'cabecalho': ['', 'Cães', 'g por cão', 'Ração (kg)', 'Dias'],
                   'linhas': [['Antes', '60', '200', '180', '15'], ['Agora', '40', '250', '210', 'x']]})],
        volta='Em cada coluna, antes ÷ agora: 15/x × 60/40 × 200/250 = 180/210.\n60/40 = 3/2 (÷ 20) e 200/250 = 4/5 (÷ 50). Então 3/2 × 4/5 = 12/10 = 6/5. Direita: 180/210 = 6/7 (÷ 30).\nFica 15/x × 6/5 = 90/(5 · x) = 18/x = 6/7. Cruzado: 6 · x = 18 · 7 = 126, e x = 21 dias.\nResposta: alternativa X.',
        valores=[('S', '180 kg'), ('R', '210 kg'), ('x', '21 dias')],
        pista='"comprado" e "mudou no meio" → ache o que ainda há (gramas em quilos) e monte a tabela antes e agora, uma coluna por grandeza.',
        rec1='tabela antes e agora: 60 e 40 cães, 200 e 250 g, 180 e 210 kg, 15 e x', rec3='S = 180 kg; R = 210 kg; x = 21 dias',
        checagem=('8 galinhas comem 12 kg de ração em 5 dias. Com 10 galinhas, 18 kg duram quantos dias?',
                  ['6 dias', '4 dias', '7,5 dias', '9 dias'], '6 dias',
                  'Galinhas andam ao contrário dos dias: 5 · 8/10 = 4. A ração anda junto: 4 · 18/12 = 4 · 3/2 = 6 dias.'),
        ancora='parcial · ENEM 2023 q.167 (caderno 7: grandezas proporcionais com acréscimo e uma condição escondida no texto); aqui é regra de três composta (cães, gramas por cão, dias) com doação de 50% e gramas em quilos',
        canal='mat-06-regra-de-tres.txt [3:14:31] (regra de três composta: compare cada grandeza com a dos dias, inversa ou direta)',
        antes=['porcentagem', 'fracoes', 'potencia-de-dez'],
    ),
    dict(
        id='d2-escada-mat-ita-gra-00d', materia='Matemática', tema=T, calc=8,
        enunciado=ENUN_D,
        dados=[('Relógio errado', 'anda para trás, a 3 vezes a velocidade do certo'), ('Mostrador', 'só 12 horas, sem manhã nem tarde'),
               ('Tempo olhado', '24 horas'), ('Quero', 'quantas vezes mostra a hora certa')],
        alts=[('2', 2, 'Achou que só coincidem a cada 12 h: 24 ÷ 12'),
              ('4', 4, 'Subtraiu as velocidades, 3 − 1 = 2, e achou período de 12 ÷ 2 = 6 h: 24 ÷ 6'),
              ('6', 6, 'Esqueceu que o relógio certo também anda: usou 3, período de 12 ÷ 3 = 4 h: 24 ÷ 4'),
              ('8', 8, 'OK'),
              ('12', 12, 'Fez 24 ÷ (3 − 1), sem usar o mostrador de 12 h')],
        resumo='Os dois se afastam 1 + 3 = 4 h a cada hora e voltam a mostrar o mesmo quando a diferença completa 12 h: a cada 12 ÷ 4 = 3 h. Em 24 h: 24 ÷ 3 = 8.',
        ideia='Um relógio vai para frente e o outro para trás, então a diferença entre eles cresce 4 horas a cada hora. O mostrador repete a cada 12 horas, por isso eles coincidem de 3 em 3 horas, qualquer que seja a hora errada de agora.',
        pecas=[('Velocidade relativa', 'Quando duas coisas vão em sentidos contrários, a distância entre elas cresce a soma das velocidades.'),
               ('Mostrador de 12 h', 'Horas que diferem de 12, 24, 36... mostram o mesmo no mostrador.')],
        formulas=[('texto', 'Quanto se afastam', 'afastamento por hora = 1 + 3'), ('texto', 'Intervalo entre acertos', 'intervalo = 12 ÷ afastamento por hora'),
                  ('contagem', 'Quantas vezes', 'vezes = 24 ÷ intervalo')],
        eq='N = 24 ÷ P', leitura='número de vezes = 24 horas ÷ intervalo, em horas, entre um acerto e o próximo',
        letras=[('N', 'quantas vezes mostra a hora certa em 24 h (o que a questão quer)'), ('R', 'quantas horas por hora a diferença entre os dois cresce'),
                ('P', 'intervalo, em horas, entre um acerto e o seguinte')],
        eq_texto='Cada acerto vem depois de P horas e cabem 24 ÷ P intervalos em 24 horas.\nAgora é só achar R e P, uma por vez.',
        achando=[('Achando R: o quanto eles se afastam',
                  'O relógio certo anda 1 hora para frente a cada hora. O errado anda 3 horas para trás a cada hora.\nSentidos contrários: a diferença cresce 1 + 3 = 4 horas a cada hora.\nR = 4.'),
                 ('Achando P: o intervalo entre acertos',
                  'Os dois mostram a mesma hora quando a diferença é um múltiplo de 12 h (0, 12, 24...).\nA diferença cresce 4 h por hora e precisa crescer 12 h entre um acerto e o seguinte.\nP = 12 ÷ 4 = 3 h.')],
        volta='N = 24 ÷ 3 = 8.\nA 1ª vez cai antes de 3 h, porque a diferença de agora está entre 0 e 12 h; depois vem uma a cada 3 h. Em 24 h cabem 8 intervalos de 3 h.\nResposta: alternativa X.',
        valores=[('R', '4 horas por hora'), ('P', '3 h'), ('N', '8 vezes')],
        pista='"para trás" a várias vezes a velocidade → some as velocidades, veja em quanto tempo a diferença completa 12 h e conte quantos intervalos cabem em 24 h.',
        rec1='3 vezes para trás; mostrador de 12 h; 24 h', rec3='R = 4 h por hora; P = 3 h; N = 8',
        checagem=('Um relógio de ponteiros anda para trás a 2 vezes a velocidade de um certo, com hora errada agora. Quantas vezes mostra a hora certa em 24 h?',
                  ['6', '4', '8', '12'], '6',
                  'Diferença cresce 1 + 2 = 3 h por hora. Intervalo: 12 ÷ 3 = 4 h. Em 24 h: 24 ÷ 4 = 6.'),
        ancora='forte · HMMT nov/2022 General q.1 (relógio de ponteiros que anda para trás a 5 vezes a velocidade, mostrador de 12 h: velocidade relativa e período); aqui a 3 vezes e com mais alternativas armadilha',
        canal='cin-03-video-inteiro-parte-4-13.txt [2:22:01] (velocidade relativa: trocar de referencial); o relógio de ponteiros em si é fora do canal',
        antes=['gra-mostrador-12h', 'velocidade'],
    ),
]

MANTER = {
    'd2-escada-mat-ita-gra-00a': {
        'ancora': 'forte · ENEM 2022 q.160 (caderno 5; q.139 no caderno 7: planta na escala 1 : 50 com folga de 10 cm só de um lado); aqui a cópia reduzida a 50% e a área real em hectares',
        'canal': 'mat-07-escalas.txt [3:51:02] (escala é razão na mesma unidade); área e escala ao quadrado em mat-07-escalas.txt [4:01:31]',
        'antes': ['potencia-de-dez', 'porcentagem'],
    },
}

tabela = lambda titulo, cab, linhas: {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}  # noqa: E731

ANTES_NOVOS = {
    'gra-hora-minuto-decimal': {
        'titulo': 'Minutos em horas e segundos em minutos',
        'linhas': [
            'Para passar minutos para horas, divida por 60. 30 min são meia hora: 0,5 h. 15 min são 0,25 h. 45 min são 0,75 h.',
            'Então 7 h 30 min = 7 + 0,5 = 7,5 h. E 8 h 15 min = 8 + 0,25 = 8,25 h.',
            'O mesmo vale para segundos: 0,75 min · 60 = 45 s. Então 63,75 min = 63 min e 45 s.',
            '63 min = 60 min + 3 min = 1 h 03 min. Logo 63,75 min = 1 h 03 min 45 s.',
        ],
        'visual': tabela('Minutos em horas', ['Tempo', 'Conta', 'Em horas'], [['15 min', '15 ÷ 60', '0,25 h'], ['30 min', '30 ÷ 60', '0,5 h'], ['45 min', '45 ÷ 60', '0,75 h']]),
        'exercicios': [
            {'enunciado': 'Uma máquina trabalha 6 h 30 min por dia. Quantas horas por dia são, em decimal?', 'alternativas': ['6,5 h', '6,3 h', '6,05 h', '630 h'], 'certa': 0,
             'resolucao': '6,5 h: 30 min são meia hora, 0,5 h; 6 + 0,5 = 6,5.\n6,3 é ler 6 h 30 como 6,30; 6,05 é 5 em vez de 50; 630 é juntar os números.'},
            {'enunciado': 'Quanto é 2,5 min em minutos e segundos?', 'alternativas': ['2 min 30 s', '2 min 50 s', '2 min 5 s', '2 min 15 s'], 'certa': 0,
             'resolucao': '2 min 30 s: 0,5 min · 60 = 30 s, então 2,5 min = 2 min 30 s.\n2 min 50 s lê o 0,5 como 50; 2 min 5 s tira um zero; 2 min 15 s é 0,25 min.'},
        ],
    },
    'gra-mostrador-12h': {
        'titulo': 'Relógio de ponteiros: o mostrador de 12 horas',
        'linhas': [
            'O relógio de ponteiros tem 12 números e não diz manhã ou tarde. Passou de 12 h, o ponteiro dá uma volta e recomeça.',
            'Por isso 3 h da tarde (15 h) mostra o mesmo que 3 h da manhã: a diferença é 12 h.',
            'Dois relógios mostram a mesma hora quando a diferença entre eles é 0, 12, 24, 36 h... ou seja, um múltiplo de 12.',
            'Exemplo: 5 h e 17 h mostram o mesmo (17 − 5 = 12). 2 h e 9 h não (9 − 2 = 7).',
        ],
        'visual': tabela('Mesma hora no mostrador', ['Hora', 'Mais 12 h', 'Mostra'], [['3 h', '15 h', '3'], ['5 h', '17 h', '5'], ['9 h', '21 h', '9']]),
        'exercicios': [
            {'enunciado': 'Um relógio de ponteiros mostra 4 h. Daqui a 30 horas, que hora ele mostra?', 'alternativas': ['10 h', '4 h', '6 h', '34 h'], 'certa': 0,
             'resolucao': '10 h: 4 + 30 = 34; tire 12 duas vezes (24): 34 − 24 = 10.\n4 h é ignorar as 30 h; 6 h é tirar só 30 − 24; 34 h não existe no mostrador.'},
            {'enunciado': 'Qual par de horas mostra a mesma coisa no relógio de ponteiros?', 'alternativas': ['3 h e 15 h', '3 h e 14 h', '3 h e 18 h', '3 h e 10 h'], 'certa': 0,
             'resolucao': '3 h e 15 h: 15 − 3 = 12, um múltiplo de 12.\n14 − 3 = 11, 18 − 3 = 15 e 10 − 3 = 7 não são múltiplos de 12.'},
        ],
    },
}

for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('gra-'), _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['resolucao'].split('\n')[0].count(_e['alternativas'][_e['certa']].split(' ')[0]) >= 1
        assert len(set(_e['alternativas'])) == len(_e['alternativas'])
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), _q['id']
    assert len(_q['ideia']) <= 300, _q['id']
    assert all(l not in 'ABCDE' for l, _ in _q['letras']), _q['id']
    assert len({l for l, _ in _q['letras']}) == len(_q['letras'])
