"""Grandezas e Medidas (2º degrau de Matemática), nível acima v2, 23/11/2026 (revisto 24/11 depois da leitura do aluno-do-zero).

a = ENEM (duas cópias encadeadas da planta, escala, área ao quadrado e cm² em hectares), b = ITA (robô cuja velocidade cai à metade a cada trecho),
c = Fuvest (regra de três COMPOSTA: ração de abrigo com doação de 50%, adoção e dieta nova), d = Harvard-MIT (relógio que anda para trás).
Só junta o degrau 1 (Aritmética e Porcentagem). Toda resposta é conferida por conta Python (assert) neste módulo.
"""
from fractions import Fraction as F

ARQUIVO = 'matematica-acima-novas.json'
T = 'Grandezas e Medidas'

# ---------------------------------------------------------------- a) ENEM
ESC0 = 30000                      # planta original 1 : 30 000
F1, F2 = F(1, 2), F(3, 2)         # 1ª cópia a 50%; 2ª cópia a 150% da 1ª
fator = F1 * F2
assert fator == F(3, 4)           # tamanho final / tamanho da planta (não 1, não 3)
assert F(10) * F1 == 5 and F(5) * F2 == F(15, 2) and F(15, 2) / 10 == fator
assert F(100, 75) == F(4, 3)      # 1 ÷ 0,75
K_a = ESC0 / fator                # cm do chão em 1 cm da 2ª cópia
assert K_a == 40000 and F(ESC0, 3) * 4 == 40000
AREA_PAPEL = F(35, 2)             # 17,5 cm² no desenho da 2ª cópia
R_a = K_a * K_a
assert R_a == 1_600_000_000       # 4 x 4 = 16 e 4 + 4 = 8 zeros
CM2_HA = 100 * 100 * 10_000       # 1 m² = 10 000 cm²; 1 ha = 10 000 m²
assert CM2_HA == 100_000_000
H_a = AREA_PAPEL * R_a / CM2_HA
assert H_a == 280 and R_a / CM2_HA == 16 and F(35, 2) * 16 == 280 and F(35, 2) * 10 == F(175) and F(35, 2) * 6 == 105
# o mesmo resultado pelo caminho dos lados: 3,5 cm × 5 cm = 17,5 cm²; 1 400 m × 2 000 m = 280 ha
assert F(7, 2) * 5 == AREA_PAPEL and (F(7, 2) * K_a / 100) * (5 * K_a / 100) / 10_000 == 280
# distratores
assert AREA_PAPEL * (ESC0 ** 2) / CM2_HA == F(315, 2)                         # 157,5: ignorou as cópias
assert fator != 1 and F2 / F1 == 3 and AREA_PAPEL * (ESC0 / 3) ** 2 / CM2_HA == F(35, 2)  # 17,5: dividiu 150% por 50%
assert AREA_PAPEL * (F(ESC0 ** 2) / fator) / CM2_HA == 210                    # 210: 0,75 aplicado na área
assert AREA_PAPEL * R_a / 10_000 == 2_800_000                                 # 2 800 000: parou em m²
# "Sua vez": planta 1 : 1 000, cópia a 50%, 6 cm² no desenho
assert 1000 / F(1, 2) == 2000 and F(2000, 100) == 20 and 20 * 20 == 400 and 6 * 400 == 2400 and 6 * 20 == 120 and 6 * 100 == 600
ENUN_A = ('Uma família herdou uma fazenda e foi à prefeitura buscar a planta dela, desenhada na escala 1 : 30 000. O funcionário explicou que a planta original '
          'não sai do arquivo e fez uma fotocópia reduzida a 50% do tamanho, em todas as direções. Como a cópia ficou pequena demais para ler, a família a levou '
          'a uma papelaria, onde ela foi ampliada para 150% do tamanho da cópia que recebeu. Nenhuma das duas cópias traz essa informação no papel. '
          'Na cópia final, a família calculou a área do desenho do terreno em uma folha quadriculada. Para o imposto, a prefeitura cobra R$ 15 por hectare, '
          'e o corretor lembrou que 1 hectare equivale a 10 000 m². A tabela resume o que a família tem.\n\n'
          'Documento | Como foi feito | Escala\n'
          'Planta original | desenhada pela prefeitura | 1 : 30 000\n'
          '1ª cópia | reduzida a 50% da planta | não consta no papel\n'
          '2ª cópia (a final) | ampliada a 150% da 1ª cópia | não consta no papel\n\n'
          'Na 2ª cópia, o desenho do terreno ocupa 17,5 cm². A área real do terreno, em hectares, é:')
assert len(ENUN_A) >= 600, len(ENUN_A)

# ---------------------------------------------------------------- b) ITA
# 8 trechos de 1 m; 1º trecho a 4 m/min; a velocidade cai à metade a cada trecho
vel_b = [F(4) / 2 ** k for k in range(8)]
tempos_b = [1 / v for v in vel_b]
assert tempos_b == [F(1, 4), F(1, 2), 1, 2, 4, 8, 16, 32]
assert all(tempos_b[i + 1] == 2 * tempos_b[i] for i in range(7))  # velocidade pela metade, tempo em dobro
tot_b = sum(tempos_b)
assert tot_b == F(255, 4) == F(63) + F(3, 4)  # 63,75 min
P_b, Q_b = sum(tempos_b[:4]), sum(tempos_b[4:])
assert (P_b, Q_b, P_b + Q_b) == (F(15, 4), 60, F(255, 4))
assert F(1, 4) + F(1, 2) == F(3, 4) and F(3, 4) + 1 == F(7, 4) and F(7, 4) + 2 == F(15, 4) and 4 + 8 == 12 and 12 + 16 == 28 and 28 + 32 == 60
assert F(3, 4) * 60 == 45 and divmod(63, 60) == (1, 3)  # 63,75 min = 1 h 03 min 45 s
# distratores
assert F(8, 4) == 2  # 2 min
soma_v = sum(vel_b)
assert soma_v == F(255, 32) and float(soma_v) == 7.96875
media_v = soma_v / 8
assert abs(float(8 / media_v) - 8.0314) < 1e-3 and divmod(round(float(8 / media_v) * 60), 60) == (8, 2)  # 8 min 2 s
assert 64 == 63 + 1 and divmod(64, 60) == (1, 4)  # 1 h 04 min
assert 8 / vel_b[-1] == 256 and divmod(256, 60) == (4, 16)  # 4 h 16 min
# "Sua vez": 4 trechos de 1 m, 1º a 2 m/min
tempos_sv = [1 / (F(2) / 2 ** k) for k in range(4)]
assert tempos_sv == [F(1, 2), 1, 2, 4] and sum(tempos_sv) == F(15, 2)
assert 4 / 2 == 2 and 12 / 4 == 3
ENUN_B = ('Um robô percorre, em linha reta, 8 trechos seguidos de 1 m cada um. No 1º trecho a velocidade dele é 4 m/min e, ao terminar '
          'cada trecho, a velocidade passa à metade da que tinha. Dentro de cada trecho a velocidade é constante. '
          'Quanto tempo o robô leva para percorrer os 8 m?')
assert 250 <= len(ENUN_B) <= 400, len(ENUN_B)

# ---------------------------------------------------------------- c) Fuvest (regra de três composta)
C0, G0, D0 = 60, 200, 15       # combinado: cães, gramas por cão por dia, dias de ração
K, PCT = 5, 50                 # dias já passados; doação em % do estoque comprado
C1, G1 = 40, 250               # depois: cães e gramas por cão por dia
por_dia = F(C0 * G0, 1000)     # kg por dia (200 g = 0,2 kg; 60 · 0,2 = 12)
assert F(G0, 1000) == F(1, 5) and por_dia == 12
estoque = por_dia * D0         # kg comprados
assert estoque == 180
doacao = estoque * PCT / 100
total_c = estoque + doacao
comido = por_dia * K
falta = total_c - comido
assert (doacao, total_c, comido, falta) == (90, 270, 60, 210)
cons_dia = F(C1 * G1, 1000)
assert cons_dia == 10
x_c = falta / cons_dia
assert x_c == 21
# a regra de três composta do Pablo: antes ÷ agora em cada coluna; quem anda ao contrário dos dias fica do lado dos dias
assert F(D0) / x_c * F(C0, C1) * F(G0, G1) == estoque / falta
assert F(60, 40) == F(3, 2) and F(200, 250) == F(4, 5) and F(3, 2) * F(4, 5) == F(12, 10) == F(6, 5) and F(180, 210) == F(6, 7)
assert 15 * 6 == 90 and 90 / 5 == 18 and F(18) / x_c == F(6, 7) and 18 * 7 == 6 * 21 == 126 and 126 / 6 == 21
# distratores
assert estoque - comido == 120 and (estoque - comido) / cons_dia == 12         # esqueceu a doação
assert (estoque - comido) * F(100 + PCT, 100) / cons_dia == 18                 # 50% só sobre o que sobrava (120 kg)
assert total_c / cons_dia == 27                                                # esqueceu o que já foi comido
assert falta / F(C0 * G1, 1000) == 14                                          # esqueceu a adoção (60 cães)
assert D0 - K == 10 and x_c not in (60, 200, 15, 5, 50, 40, 250, 20, 150)
# "Sua vez": 8 galinhas, 12 kg, 5 dias; com 10 galinhas e 18 kg
sv_c = F(5) * F(8, 10) * F(18, 12)
assert sv_c == 6 and 5 * F(8, 10) == 4 and 5 * F(3, 2) == F(15, 2)
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
# o exemplo da explicação: certo mostra 3 h e o errado 5 h; o errado volta 3 h a cada hora
certo = lambda t: (3 + t) % 12  # noqa: E731
errado = lambda t: (5 - 3 * t) % 12  # noqa: E731
assert [(certo(t), errado(t)) for t in (0, 1, 2, 3)] == [(3, 5), (4, 2), (5, 11), (6, 8)]
acertos = [F(1, 2) + 3 * k for k in range(8)]
assert all(certo(t) == errado(t) for t in acertos) and acertos[-1] == F(43, 2) and F(1, 2) + 3 * 8 > 24
assert (F(3) + F(5, 4)) % 12 == (F(8) - 3 * F(5, 4)) % 12 == F(17, 4) and [F(5, 4) + 3 * k for k in range(8)][-1] == F(89, 4) and F(5, 4) + 24 > 24 and F(5, 4) + 3 * 8 > 24
assert sum(1 for k in range(0, 200) if 0 < F(1, 2) + F(k, 2) <= 24 and certo(F(1, 2) + F(k, 2)) == errado(F(1, 2) + F(k, 2))) == 8
ENUN_D = ('Um relógio de ponteiros gira sem parar (sem tique, isto é, sem saltos de segundo em segundo) e anda para trás, 3 vezes mais depressa que um relógio certo: '
          'a cada hora que passa, ele volta 3 horas. Os dois ponteiros dele combinam entre si como num relógio normal (o dos minutos dá 12 voltas enquanto '
          'o das horas dá 1), só que a hora que ele mostra agora está errada. O mostrador tem só as 12 horas, sem distinguir manhã de tarde. '
          'Quantas vezes, nas próximas 24 horas, esse relógio vai mostrar a mesma hora de um relógio certo?')
assert 450 <= len(ENUN_D) <= 800, len(ENUN_D)

# ---------------------------------------------------------------- módulo
Q = [
    dict(
        id='d2-escada-mat-ita-gra-00a', materia='Matemática', tema=T, calc=280,
        enunciado=ENUN_A,
        dados=[('Planta original', 'escala 1 : 30 000'), ('1ª cópia', 'reduzida a 50% da planta'), ('2ª cópia (a final)', 'ampliada a 150% da 1ª cópia'),
               ('Desenho do terreno', '17,5 cm² na 2ª cópia'), ('Imposto', 'R$ 15 por hectare (não entra na conta)'), ('Quero', 'área real, em hectares')],
        alts=[('17,5', 17.5, 'Dividiu 150% por 50% e achou fator 3: planta 1 : 10 000'),
              ('157,5', 157.5, 'Ignorou as duas cópias e usou 1 : 30 000'),
              ('210', 210, 'Aplicou o fator 0,75 na área em vez de no comprimento'),
              ('280', 280, 'OK'),
              ('2 800 000', 2800000, 'Parou em m²: não passou de m² para hectares (÷ 10 000)')],
        resumo='Cópias: 0,5 · 1,5 = 0,75; 1 cm da 2ª cópia = 30 000 ÷ 0,75 = 40 000 cm. Área: 17,5 · 40 000 · 40 000 = 28 000 000 000 cm²; 1 ha = 100 000 000 cm²; 280 ha.',
        ideia='As duas cópias mexem na escala: o fator não é 1 nem 3, é 0,5 vezes 1,5. E a escala vale para o comprimento; na área ela entra duas vezes, e ainda é preciso passar de cm² para hectares.',
        pecas=[('Duas cópias em cadeia', 'A 2ª cópia é feita em cima da 1ª: os fatores se multiplicam. 50% e depois 150% dão 0,5 · 1,5 = 0,75.'),
               ('Escala na área', 'Se 1 cm do papel vale K cm do chão, 1 cm² do papel vale K · K cm² do chão.')],
        formulas=[('quadrado', 'Área e escala', 'área do chão = área do papel · K · K'), ('porcentagem', 'Duas cópias', 'fator = 0,5 · 1,5 = 0,75'),
                  ('texto', 'Hectare', '1 ha = 10 000 m² = 100 000 000 cm²')],
        origem=('Um quadradinho de 1 cm por 1 cm no papel tem área 1 cm². Se cada 1 cm do papel vale 3 cm do chão, o quadradinho do chão tem lado 3 cm '
                'e área 3 · 3 = 9 cm². Ou seja: a área do chão é 9 vezes a do papel, e não 3 vezes. Aqui cada 1 cm vale K cm, então cada 1 cm² vale K · K cm².'),
        desenho=('Veja a planta e as duas cópias: a 1ª é 50% da planta, a 2ª é 150% da 1ª, e o terreno ocupa 17,5 cm² na 2ª.', 'terreno-escala', []),
        eq='H = 17,5 × (K × K) ÷ U', leitura='hectares = área no papel (cm²) × cm² do chão por cm² do papel ÷ cm² que cabem em 1 hectare',
        letras=[('H', 'área real, em hectares (o que a questão quer)'), ('K', 'quantos cm do chão valem 1 cm da 2ª cópia'), ('U', 'quantos cm² cabem em 1 hectare')],
        eq_texto='Os R$ 15 por hectare do imposto não entram: a questão pede a área, não o imposto. Os 17,5 vêm do enunciado. K diz quanto 1 cm da cópia final vale no chão; como é área, K entra duas vezes. Dividir por U passa de cm² para hectares.\nAgora é só achar K e U, uma por vez.',
        achando=[('Achando K: o que as duas cópias fazem',
                  'Exemplo: um lado de 10 cm na planta fica com 10 · 0,5 = 5 cm na 1ª cópia e com 5 · 1,5 = 7,5 cm na 2ª. A cópia final tem 7,5 ÷ 10 = 0,75 do tamanho da planta.\nNão é 50% + 150%, é 0,5 · 1,5 = 0,75: 0,5 é a metade, e a metade de 1,5 é 0,75. Conferindo o 5 · 1,5: 5 · 1 = 5 e 5 · 0,5 = 2,5; 5 + 2,5 = 7,5.',
                  {'tipo': 'tabela', 'titulo': 'Um lado de 10 cm da planta', 'cabecalho': ['Documento', 'Quanto mede o lado'],
                   'linhas': [['Planta original', '10 cm'], ['1ª cópia (50%)', '5 cm'], ['2ª cópia (150% da 1ª)', '7,5 cm']]}),
                 ('Achando K: 1 cm da cópia vale quantos cm do chão',
                  'Na planta, 1 cm vale 30 000 cm do chão. A cópia final é 0,75 da planta: o desenho encolheu, então 1 cm dela vale MAIS chão que 1 cm da planta (na tabela, os 10 cm da planta cabem em só 7,5 cm). Para voltar ao tamanho da planta, divido por 0,75.\nK = 30 000 ÷ 0,75. Multiplico os dois por 4 (o resultado da divisão não muda): 0,75 · 4 = 3 e 30 000 · 4 = 120 000. K = 120 000 ÷ 3 = 40 000 cm.',
                  {'tipo': 'diagrama', 'nome': 'terreno-escala', 'rotulos': ['', '0,5 · 1,5 = 0,75 da planta', '1 cm da 2ª cópia = 40 000 cm do chão']}),
                 ('Achando U: cm² em 1 hectare',
                  '1 m = 100 cm, então 1 m² = 100 · 100 = 10 000 cm². E 1 hectare = 10 000 m².\nU = 10 000 · 10 000 = 100 000 000 cm² (1 seguido de 8 zeros).')],
        volta='H = 17,5 × (40 000 × 40 000) ÷ 100 000 000.\n40 000 · 40 000: 4 · 4 = 16 e 4 + 4 = 8 zeros, dá 1 600 000 000. Dividir por 100 000 000 é cortar 8 zeros: 16.\n17,5 · 16 = 175 + 105 = 280 hectares (17,5 · 10 = 175 e 17,5 · 6 = 105).\nResposta: alternativa X.',
        valores=[('K', '40 000 cm'), ('U', '100 000 000 cm²'), ('H', '280 hectares')],
        pista='"cópia reduzida e depois ampliada" → multiplique os dois fatores para achar a escala nova; "área" → a escala entra duas vezes; passe de cm² para hectares no fim.',
        rec1='escala 1 : 30 000; cópias 50% e 150%; 17,5 cm²', rec3='K = 40 000 cm; U = 100 000 000 cm²; H = 280 ha',
        checagem=('Planta 1 : 1 000, copiada a 50%. Na cópia, o terreno ocupa 6 cm². Qual a área real, em m²?',
                  ['2 400 m²', '120 m²', '600 m²', '24 000 m²'], '2 400 m²',
                  '1 cm da cópia = 2 · 1 000 = 2 000 cm = 20 m. Área: 1 cm² vale 20 · 20 = 400 m². 6 · 400 = 2 400 m².'),
        ancora='forte · ENEM 2022 q.160 (caderno 5; q.139 no caderno 7: planta na escala 1 : 50 com folga de 10 cm só de um lado); aqui a cópia reduzida a 50% e a área real em hectares',
        canal='mat-07-escalas.txt [3:51:02] (escala é razão na mesma unidade); área e escala ao quadrado em mat-07-escalas.txt [4:01:31]',
        antes=['gra-escala', 'gra-cm2-m2-ha', 'potencia-de-dez', 'porcentagem'],
    ),
    dict(
        id='d2-escada-mat-ita-gra-00b', materia='Matemática', tema=T, calc=63.75,
        enunciado=ENUN_B,
        dados=[('Trechos', '8 trechos de 1 m cada'), ('Velocidade no 1º trecho', '4 m/min'),
               ('A cada trecho que termina', 'a velocidade cai à metade'), ('Quero', 'tempo total, em horas, minutos e segundos')],
        alts=[('2 min', 2, 'Dividiu 8 m pela velocidade do começo: 8 ÷ 4'),
              ('8 min 2 s', 8.0314, 'Dividiu 8 m pela média das 8 velocidades (7,96875 ÷ 8, cerca de 0,996 m/min)'),
              ('1 h 03 min 45 s', 63.75, 'OK'),
              ('1 h 04 min', 64, 'Arredondou os 45 s para 1 minuto cheio: 63 min + 1 min'),
              ('4 h 16 min', 256, 'Dividiu 8 m pela última velocidade, 1/32 m/min: 8 · 32 = 256 min')],
        resumo='Cada trecho leva 1 ÷ velocidade, e o tempo dobra: 0,25; 0,5; 1; 2; 4; 8; 16; 32 min. Soma = 63,75 min = 1 h 03 min 45 s.',
        ideia='Velocidade pela metade quer dizer tempo em dobro: cada metro leva o dobro do anterior. Some os 8 tempos e passe os minutos para horas, minutos e segundos; a média das velocidades não serve.',
        pecas=[('Tempo de um trecho', 'Distância ÷ velocidade. Se a velocidade cai à metade, o tempo do trecho dobra.'),
               ('Média das velocidades', 'Somar as 8 velocidades e dividir por 8 não serve: o robô passa mais tempo nas velocidades baixas.')],
        formulas=[('carro', 'Tempo de um trecho', 'tempo = distância ÷ velocidade'), ('contagem', 'Tempo total', 'soma dos tempos dos 8 trechos'),
                  ('texto', 'Minutos em segundos', '1 min = 60 s; 1 h = 60 min')],
        eq='T = P + Q', leitura='tempo total = tempo dos 4 primeiros trechos + tempo dos 4 últimos trechos',
        letras=[('T', 'tempo total para os 8 m, em minutos (o que a questão quer)'), ('P', 'tempo dos 4 primeiros trechos, em minutos'),
                ('Q', 'tempo dos 4 últimos trechos, em minutos')],
        eq_texto='O tempo total é a soma dos tempos de todos os trechos. Separei em dois grupos de 4 só para a conta ficar curta.\nAgora é só achar P e Q, uma por vez.',
        achando=[('Achando P: os 4 primeiros trechos',
                  'Tempo = distância ÷ velocidade. No 1º trecho: 1 ÷ 4 = 0,25 min (porque 4 · 0,25 = 1).\nVelocidade pela metade, o mesmo metro leva o dobro do tempo: 0,5; 1; 2 min.\nP = 0,25 + 0,5 + 1 + 2 = 0,75 + 1 + 2 = 3,75 min.',
                  {'tipo': 'tabela', 'titulo': 'Os 4 primeiros trechos', 'cabecalho': ['Trecho', 'Velocidade (m/min)', 'Tempo (min)'],
                   'linhas': [['1º', '4', '0,25'], ['2º', '2', '0,5'], ['3º', '1', '1'], ['4º', '0,5', '2']]}),
                 ('Achando Q: os 4 últimos trechos',
                  'O tempo continua dobrando a cada trecho: o 4º levou 2 min, então o 5º leva 4, o 6º leva 8, o 7º leva 16 e o 8º leva 32 min.\nQ = 4 + 8 + 16 + 32 = 12 + 16 + 32 = 28 + 32 = 60 min.',
                  {'tipo': 'tabela', 'titulo': 'Os 4 últimos trechos', 'cabecalho': ['Trecho', 'Tempo (min)'],
                   'linhas': [['5º', '4'], ['6º', '8'], ['7º', '16'], ['8º', '32']]})],
        volta='T = 3,75 + 60 = 63,75 min.\nO 0,75 min vira segundos: 0,75 · 60 = 45 s (0,75 · 6 = 4,5 e depois ·10). Os 63 min são 60 + 3 = 1 h 03 min.\nT = 1 h 03 min 45 s.\nResposta: alternativa X. Conferindo: só o último metro leva 32 min, metade do total, e 8 m a 4 m/min (2 min) seria muito menos.',
        valores=[('P', '3,75 min'), ('Q', '60 min'), ('T', '63,75 min = 1 h 03 min 45 s')],
        pista='"velocidade cai à metade" a cada trecho → o tempo de cada trecho dobra: ache o tempo do 1º (distância ÷ velocidade), dobre, some e passe os minutos para h, min e s.',
        rec1='8 trechos de 1 m; 4 m/min; cai à metade a cada trecho', rec3='P = 3,75 min; Q = 60 min; T = 1 h 03 min 45 s',
        checagem=('Robô de 4 trechos de 1 m. O 1º trecho é a 2 m/min e a velocidade cai à metade a cada trecho. Quanto tempo leva?',
                  ['7,5 min', '2 min', '16 min', '4 min'], '7,5 min',
                  '1º trecho: 1 ÷ 2 = 0,5 min. O tempo dobra: 1; 2; 4. Soma: 0,5 + 1 + 2 + 4 = 7,5 min.'),
        ancora='forte · Oxford Extra MAT dez/2021 q.D (velocidade muda a cada ponto inteiro e o tempo até o marco n é soma de potências de 2); aqui pede o tempo dos 8 m e a conta termina em h, min e s. A pegadinha da média que engana vem de ENEM 2020 q.153 (CD7, velocidade média com tabela)',
        canal='cin-02-video-inteiro-parte-3-13.txt [1:20:31] (velocidade média não é média das velocidades: deslocamento ÷ tempo)',
        antes=['velocidade', 'gra-tempo-no-trecho', 'gra-hora-minuto-decimal'],
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
        resumo='Comprou 60 · 0,2 · 15 = 180 kg; com a doação, 270 kg; em 5 dias comeram 60 kg; sobram 210 kg. Fica 15/Z · 60/40 · 200/250 = 180/210, e Z = 21.',
        ideia='Primeiro ache a ração que ainda há: comprada mais doada, menos a já comida (gramas em quilos). Depois monte a regra de três composta, antes ÷ agora em cada coluna: cães e gramas por cão andam ao contrário dos dias; a ração anda junto.',
        pecas=[('Grandezas inversas', 'Mais cães, menos dias. Mais gramas por cão, menos dias. Elas andam ao contrário dos dias.'),
               ('Grandezas diretas', 'Mais ração, mais dias. Ela anda junto com os dias.')],
        formulas=[('porcentagem', 'Doação de 50%', 'total = estoque + 50% do estoque = 180 + 90'), ('texto', 'Regra de três composta', 'antes ÷ agora, uma coluna por grandeza'),
                  ('texto', 'Gramas e quilos', '1 kg = 1 000 g; 200 g = 0,2 kg')],
        origem=['Cada coluna da tabela é uma grandeza. Compare cada uma com os dias. Cães: com o DOBRO de cães, a ração dura a METADE dos dias; elas andam ao contrário (inversas). '
                'Gramas por cão: com o dobro de gramas por cão, metade dos dias; ao contrário também.',
                'Ração: com o dobro de ração, o dobro de dias; elas andam junto (diretas). Em cada coluna escreva antes ÷ agora. Cães e gramas (ao contrário dos dias) ficam do lado dos dias; '
                'a ração (junto) vai para o outro lado do igual.'],
        eq='(15 ÷ Z) × (60 ÷ 40) × (200 ÷ 250) = R ÷ F',
        leitura='em cada coluna, antes ÷ agora; cães e gramas (ao contrário dos dias) ficam do lado dos dias, a ração do outro lado',
        letras=[('Z', 'dias que a ração ainda dura, a partir do 6º dia (o que a questão quer)'), ('R', 'ração comprada no começo, em kg'),
                ('F', 'ração que ainda há no 6º dia, em kg')],
        eq_texto='É a tabela antes e agora, uma coluna por grandeza. Cada parêntese "a ÷ b" é uma fração, a em cima e b embaixo, e o × liga as frações. Os dias, 15 antes e Z agora, ficam de um lado; as outras colunas entram uma a uma.\nAgora é só achar R e F, uma por vez; depois a conta com as frações.',
        achando=[('Achando R: a ração comprada',
                  '200 g = 0,2 kg (200 ÷ 1 000). Os 60 cães comem 60 · 0,2 = 12 kg por dia (6 · 2 = 12).\nPara 15 dias: R = 12 · 15 = 180 kg (12 · 10 = 120 e 12 · 5 = 60; 120 + 60 = 180).'),
                 ('Achando F: a ração que ainda há',
                  'Doação de 50% é a metade do estoque: 180 ÷ 2 = 90 kg. Total: 180 + 90 = 270 kg. Em 5 dias comeram 12 · 5 = 60 kg.\nF = 270 − 60 = 210 kg.\nTabela, antes em cima e agora embaixo.',
                  {'tipo': 'tabela', 'titulo': 'Antes e agora', 'cabecalho': ['', 'Cães', 'g por cão', 'Ração (kg)', 'Dias'],
                   'linhas': [['Antes', '60', '200', '180', '15'], ['Agora', '40', '250', '210', 'Z']]}),
                 ('Achando Z: montando as frações',
                  'Cada coluna vira uma fração, antes em cima e agora embaixo. Dias, cães e gramas ficam de um lado; a ração do outro.',
                  {'tipo': 'tabela', 'titulo': 'A equação em frações', 'cabecalho': ['', 'Dias', 'Cães', 'g por cão', 'Ração'],
                   'linhas': [['em cima (antes)', '15', '× 60', '× 200', '= 180'], ['embaixo (agora)', 'Z', '40', '250', '210']]}),
                 ('Achando Z: simplificando as frações',
                  'Simplificar é dividir em cima e embaixo pelo mesmo número: 60/40 ÷ 20 = 3/2; 200/250 ÷ 50 = 4/5; 180/210 ÷ 30 = 6/7.\nMultiplicando 3/2 por 4/5: 12/10, e ÷ 2 dá 6/5.',
                  {'tipo': 'tabela', 'titulo': 'Depois de simplificar', 'cabecalho': ['', 'Dias', 'Cães e gramas', 'Ração'],
                   'linhas': [['em cima', '15', '× 6', '= 6'], ['embaixo', 'Z', '5', '7']]})],
        volta='Fica 15/Z × 6/5 = 6/7. Em cima, 15 · 6 = 90; embaixo, Z · 5 (Z vezes 5). Posso dividir em cima e embaixo por 5 sem mudar a fração: 90 ÷ 5 = 18, e embaixo sobra só Z. Fica 18/Z = 6/7.\nCruzado: 18 · 7 = 6 · Z, isto é, 126 = 6 · Z. Então Z = 126 ÷ 6 = 21 (6 · 21 = 126).\nResposta: alternativa X.',
        valores=[('R', '180 kg'), ('F', '210 kg'), ('Z', '21 dias')],
        pista='"comprado" e "mudou no meio" → ache o que ainda há (gramas em quilos) e monte a tabela antes e agora, uma coluna por grandeza.',
        rec1='tabela antes e agora: 60 e 40 cães, 200 e 250 g, 180 e 210 kg, 15 e Z', rec3='R = 180 kg; F = 210 kg; Z = 21 dias',
        checagem=('8 galinhas comem 12 kg de ração em 5 dias. Com 10 galinhas, 18 kg duram quantos dias?',
                  ['6 dias', '4 dias', '7,5 dias', '9 dias'], '6 dias',
                  'Galinhas andam ao contrário dos dias: 5 · 8/10 = 4. A ração anda junto: 4 · 18/12 = 4 · 3/2 = 6 dias.'),
        ancora='parcial · ENEM 2023 q.167 (caderno 7: grandezas proporcionais com acréscimo e uma condição escondida no texto); aqui é regra de três composta (cães, gramas por cão, dias) com doação de 50% e gramas em quilos',
        canal='mat-06-regra-de-tres.txt [3:14:31] (regra de três composta: compare cada grandeza com a dos dias, inversa ou direta)',
        antes=['porcentagem', 'fracoes', 'potencia-de-dez', 'gra-simplificar-cruzado', 'gra-direta-inversa'],
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
        ideia='Um relógio vai para frente e o outro para trás, então a diferença entre eles muda 4 horas a cada hora. O mostrador repete a cada 12 horas, por isso eles coincidem de 3 em 3 horas, qualquer que seja a hora errada de agora.',
        pecas=[('Diferença entre os dois', 'Se um vai para frente e o outro para trás, a diferença entre eles muda, a cada hora, a soma dos dois movimentos. O exemplo do passo "Achando R" mostra.'),
               ('Mostrador de 12 h', 'Horas que diferem de 12, 24, 36... mostram o mesmo no mostrador.')],
        formulas=[('texto', 'Quanto a diferença muda', 'R = 1 + quantas vezes anda para trás'), ('texto', 'Intervalo entre acertos', 'intervalo = 12 ÷ R'),
                  ('contagem', 'Quantas vezes', 'N = 24 ÷ intervalo')],
        eq='N = 24 ÷ (12 ÷ R)', leitura='número de vezes = 24 horas ÷ intervalo entre acertos; intervalo = 12 horas ÷ R',
        letras=[('N', 'quantas vezes mostra a hora certa em 24 h (o que a questão quer)'), ('R', 'quantas horas por hora a diferença entre os dois relógios muda')],
        eq_texto='Dois relógios mostram a mesma hora quando a diferença entre eles é 0, 12, 24... h. De um acerto ao próximo a diferença anda 12 h. Se ela muda R horas a cada hora, isso leva 12 ÷ R horas, e cabem 24 ÷ (12 ÷ R) vezes em 24 h.\nAgora é só achar R.',
        achando=[('Achando R: como a diferença muda',
                  'Exemplo: agora o certo mostra 3 h e o errado 5 h. Daqui a 1 h: certo 4 h, errado 2 h (5 − 3). Daqui a 2 h: 5 h e 11 h (2 − 3 dá −1, que no mostrador é 11). Daqui a 3 h: 6 h e 8 h.\nO certo anda 1 h para frente e o errado 3 h para trás: a diferença muda 1 + 3 = 4 h a cada hora. R = 4.',
                  {'tipo': 'tabela', 'titulo': 'O exemplo, hora a hora', 'cabecalho': ['Daqui a', 'Relógio certo', 'Relógio errado'],
                   'linhas': [['0 h', '3 h', '5 h'], ['1 h', '4 h', '2 h'], ['2 h', '5 h', '11 h'], ['3 h', '6 h', '8 h']]}),
                 ('Achando R: quando eles acertam',
                  'No exemplo, o errado está 5 − 3 = 2 h à frente do certo. A diferença cai 4 h a cada hora, então zerar os 2 h leva 2 ÷ 4 = 0,5 h. Daqui a 0,5 h (meia hora) o certo mostra 3 h 30 min e o errado 5 − 1,5 = 3 h 30 min: acertou.\nDepois disso a situação se repete a cada 12 ÷ 4 = 3 h: acertos em 0,5; 3,5; 6,5; 9,5; 12,5; 15,5; 18,5 e 21,5 h. O próximo, 24,5 h, já passou de 24.')],
        volta='N = 24 ÷ (12 ÷ 4) = 24 ÷ 3 = 8.\nTeste com outra hora errada: certo 3 h, errado 8 h. A diferença é 5 h e cai 4 por hora: acerta em 5 ÷ 4 = 1,25 h (os dois em 4 h 15 min). Depois, de 3 em 3 h: 1,25; 4,25; 7,25; 10,25; 13,25; 16,25; 19,25; 22,25. São 8, e o próximo (25,25) passa de 24.\nOs acertos vêm de 3 em 3 h, então o 1º cai nas 3 primeiras horas, qualquer que seja a hora errada.\nResposta: alternativa X.',
        valores=[('R', '4 horas a cada hora'), ('N', '8 vezes')],
        pista='"para trás" a várias vezes a velocidade → some as velocidades, veja em quanto tempo a diferença completa 12 h e conte quantos intervalos cabem em 24 h.',
        rec1='3 vezes para trás; mostrador de 12 h; 24 h', rec3='R = 4 h a cada hora; intervalo 3 h; N = 8',
        checagem=('Um relógio de ponteiros anda para trás a 2 vezes a velocidade de um certo, com hora errada agora. Quantas vezes mostra a hora certa em 24 h?',
                  ['6', '4', '8', '12'], '6',
                  'A diferença muda 1 + 2 = 3 h a cada hora. Intervalo: 12 ÷ 3 = 4 h. Em 24 h: 24 ÷ 4 = 6.'),
        ancora='forte · HMMT nov/2022 General q.1 (relógio de ponteiros que anda para trás a 5 vezes a velocidade, mostrador de 12 h: velocidade relativa e período); aqui a 3 vezes e com mais alternativas armadilha',
        canal='cin-03-video-inteiro-parte-4-13.txt [2:22:01] (velocidade relativa: trocar de referencial); o relógio de ponteiros em si é fora do canal',
        antes=['gra-mostrador-12h', 'velocidade'],
    ),
]

MANTER = {}

tabela = lambda titulo, cab, linhas: {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}  # noqa: E731

ANTES_NOVOS = {
    'gra-escala': {
        'titulo': 'Escala de planta e cópia reduzida',
        'linhas': [
            'Escala 1 : 25 000 quer dizer: 1 cm no papel vale 25 000 cm no chão. O papel tem o terreno em tamanho pequeno.',
            '1 m = 100 cm. Para passar cm para m, divida por 100: 25 000 cm = 250 m (tire dois zeros).',
            'Cópia a 50% deixa tudo com a metade do tamanho: um lado de 10 cm vira 5 cm. A 150% fica 1,5 vez maior: 10 cm viram 15 cm.',
            'Se o desenho encolheu, 1 cm dele vale mais chão: planta 1 : 1 000 copiada a 50% dá 1 cm = 2 000 cm = 20 m.',
        ],
        'visual': tabela('Escala 1 : 25 000', ['No papel', 'No chão (cm)', 'No chão (m)'], [['1 cm', '25 000', '250'], ['2 cm', '50 000', '500'], ['4 cm', '100 000', '1 000']]),
        'exercicios': [
            {'enunciado': 'Numa planta de escala 1 : 500, um muro mede 6 cm no papel. Quantos metros ele mede no chão?', 'alternativas': ['30 m', '3 000 m', '300 m', '0,3 m'], 'certa': 0,
             'resolucao': '30 m: 6 · 500 = 3 000 cm e 3 000 ÷ 100 = 30 m.\n3 000 m esquece de passar cm para m; 300 m tira só um zero; 0,3 m divide em vez de multiplicar.'},
            {'enunciado': 'Uma planta é copiada a 50% do tamanho. Um lado que media 12 cm passa a medir quantos cm?', 'alternativas': ['6 cm', '24 cm', '12 cm', '62 cm'], 'certa': 0,
             'resolucao': '6 cm: a metade de 12 é 6.\n24 cm é o dobro; 12 cm é não mudar; 62 cm é somar 50.'},
        ],
    },
    'gra-cm2-m2-ha': {
        'titulo': 'Área: cm², m² e hectare',
        'linhas': [
            'Um quadrado de lado 1 m tem área 1 m². Como 1 m = 100 cm, esse quadrado tem 100 cm · 100 cm = 10 000 cm².',
            'Então 1 m² = 10 000 cm². De cm² para m², divida por 10 000 (tire 4 zeros).',
            'Hectare (ha) mede terreno grande: 1 ha = 10 000 m². De m² para ha, divida por 10 000.',
            'Juntando: 1 ha = 10 000 m² = 10 000 · 10 000 cm² = 100 000 000 cm² (1 seguido de 8 zeros).',
        ],
        'visual': tabela('Medidas de área', ['Medida', 'Em m²', 'Em cm²'], [['1 m²', '1', '10 000'], ['1 ha', '10 000', '100 000 000']]),
        'exercicios': [
            {'enunciado': 'Quantos m² há em 30 000 000 cm²?', 'alternativas': ['3 000 m²', '300 m²', '30 000 m²', '300 000 m²'], 'certa': 0,
             'resolucao': '3 000 m²: 30 000 000 ÷ 10 000 = 3 000 (tire 4 zeros).\n300 m² tira 5 zeros; 30 000 m² tira 3; 300 000 m² tira 2.'},
            {'enunciado': 'Um terreno tem 50 000 m². Quantos hectares ele tem?', 'alternativas': ['5 ha', '50 ha', '0,5 ha', '500 ha'], 'certa': 0,
             'resolucao': '5 ha: 50 000 ÷ 10 000 = 5.\n50 ha tira só 3 zeros; 0,5 ha tira 5; 500 ha tira 2.'},
        ],
    },
    'gra-tempo-no-trecho': {
        'titulo': 'Tempo de um trecho e velocidade pela metade',
        'linhas': [
            'Quem anda 4 m a 2 m/min leva 4 ÷ 2 = 2 min. Regra: tempo = distância ÷ velocidade (é a conta da velocidade, ao contrário).',
            'Para 1 m a 4 m/min: 1 ÷ 4 = 0,25 min (porque 4 · 0,25 = 1). A 2 m/min: 1 ÷ 2 = 0,5 min.',
            'Velocidade pela metade, tempo em dobro: o mesmo metro a 2 m/min leva 0,5 min; a 1 m/min leva 1 min; a 0,5 m/min leva 2 min.',
        ],
        'visual': tabela('Um metro, velocidade pela metade', ['Velocidade', 'Conta', 'Tempo'], [['4 m/min', '1 ÷ 4', '0,25 min'], ['2 m/min', '1 ÷ 2', '0,5 min'], ['1 m/min', '1 ÷ 1', '1 min']]),
        'exercicios': [
            {'enunciado': 'Um barco anda 12 km a 4 km/h. Quanto tempo leva?', 'alternativas': ['3 h', '48 h', '8 h', '0,3 h'], 'certa': 0,
             'resolucao': '3 h: 12 ÷ 4 = 3.\n48 h é 12 · 4; 8 h é 12 − 4; 0,3 h erra a vírgula.'},
            {'enunciado': 'Um carro leva 2 min para andar 1 km. Se a velocidade cair à metade, quanto tempo leva para o mesmo 1 km?', 'alternativas': ['4 min', '1 min', '2 min', '0,5 min'], 'certa': 0,
             'resolucao': '4 min: velocidade pela metade, tempo em dobro: 2 · 2 = 4.\n1 min é a metade do tempo; 2 min não mudou; 0,5 min é um quarto.'},
        ],
    },
    'gra-simplificar-cruzado': {
        'titulo': 'Simplificar fração e multiplicar cruzado',
        'linhas': [
            'Simplificar é dividir em cima e embaixo pelo mesmo número. 6/8: ÷ 2 dá 3/4. 60/40: ÷ 20 dá 3/2.',
            'Multiplicar frações: em cima com em cima, embaixo com embaixo. 3/2 × 4/5 = 12/10, e ÷ 2 dá 6/5.',
            'Cruzado: se 6/x = 3/4, então 6 · 4 = 3 · x. Isto é 24 = 3 · x, e x = 24 ÷ 3 = 8.',
            'Confira: 6/8 simplifica para 3/4. Deu certo.',
        ],
        'visual': tabela('Simplificar', ['Fração', 'Divido por', 'Fica'], [['6/8', '2', '3/4'], ['60/40', '20', '3/2'], ['200/250', '50', '4/5']]),
        'exercicios': [
            {'enunciado': 'Simplifique 18/12.', 'alternativas': ['3/2', '2/3', '9/4', '6/2'], 'certa': 0,
             'resolucao': '3/2: 18 ÷ 6 = 3 e 12 ÷ 6 = 2.\n2/3 é a fração de cabeça para baixo; 9/4 e 6/2 dividem em cima e embaixo por números diferentes.'},
            {'enunciado': 'Se 10/x = 5/3, quanto vale x?', 'alternativas': ['6', '15', '2', '50'], 'certa': 0,
             'resolucao': '6: 10 · 3 = 5 · x, então 30 = 5 · x e x = 30 ÷ 5 = 6.\n15 é 10 + 5; 2 é 10 ÷ 5; 50 é 10 · 5.'},
        ],
    },
    'gra-direta-inversa': {
        'titulo': 'Grandezas diretas e inversas',
        'linhas': [
            'São diretas as grandezas que andam juntas: o dobro de ração dura o dobro de dias; a metade da ração, metade dos dias.',
            'São inversas as que andam ao contrário: o dobro de cães come a ração em metade dos dias; metade dos cães, o dobro de dias.',
            'Para saber, dobre uma e veja a outra. Dobra e dobra: direta. Dobra e cai pela metade: inversa.',
            'Regra de três com várias colunas: em cada uma, antes ÷ agora. Quem anda ao contrário dos dias fica do lado dos dias; quem anda junto, do outro.',
        ],
        'visual': tabela('Direta ou inversa?', ['Coluna', 'Dobrando ela, os dias...', 'Tipo'], [['Ração', 'dobram', 'direta'], ['Cães', 'caem à metade', 'inversa']]),
        'exercicios': [
            {'enunciado': 'Dobrando o número de torneiras, o tempo para encher a mesma caixa cai à metade. As duas grandezas são:', 'alternativas': ['inversas', 'diretas', 'iguais', 'sem relação'], 'certa': 0,
             'resolucao': 'inversas: dobra uma e a outra cai pela metade.\nDiretas andam juntas; iguais e sem relação não descrevem o que acontece.'},
            {'enunciado': 'Dobrando a ração (com os mesmos cães), os dias que ela dura dobram. As duas grandezas são:', 'alternativas': ['diretas', 'inversas', 'iguais', 'sem relação'], 'certa': 0,
             'resolucao': 'diretas: dobra uma e a outra também dobra.\nInversas seriam se os dias caíssem à metade.'},
        ],
    },
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
            'Voltar no mostrador: 2 h menos 3 h dá −1 h, que é 11 h (−1 + 12). Sempre some 12 quando der negativo.',
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
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), (_q['id'], [(len(f[1]), len(f[2])) for f in _q['formulas']])
    assert len(_q['ideia']) <= 300, _q['id']
    assert all(l not in 'ABCDE' for l, _ in _q['letras']), _q['id']
    assert len({l for l, _ in _q['letras']}) == len(_q['letras'])
    # a mesma letra em todas as telas: cada letra aparece na equação
    assert all(l in _q['eq'] for l, _ in _q['letras']), _q['id']
    assert all(c in ANTES_NOVOS or c in ('velocidade', 'porcentagem', 'fracoes', 'potencia-de-dez') for c in _q['antes']), _q['id']
