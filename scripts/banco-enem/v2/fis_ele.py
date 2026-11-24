"""Nível acima v2 de Física: Eletricidade e Circuitos (23/11/2026).

a = ENEM (chuveiro de 3 posições: qual serve e quanto custa o mês), b = ITA (duas baterias reais em paralelo viram uma só; potência máxima e tempo para aquecer água),
c = Fuvest (protoboard com um resistor em curto), d = Harvard-MIT (cubo de resistores por simetria; MANTIDA, só corrige âncora, canal e Antes).
As 3 antigas (a, b, c) saem; a d fica. Conferido por assert no próprio módulo.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_ele
"""
from fractions import Fraction as Fr

ARQUIVO = 'fisica-acima-novas.json'
T = 'Eletricidade e Circuitos'

Q = []
MANTER = {
    'd2-escada-fis-ita-ele-00d': {
        'ancora': ('sem · técnica: simetria do circuito (pontos de mesmo potencial e divisão igual da corrente), clássico de olimpíada; '
                   'não há real de Física de Harvard-MIT nem cubo de resistores no corpus legível'),
        'canal': 'fora do canal: resistores em cubo (0 hits); série e paralelo em fis-12-circuitos-eletricos.txt [10:40:01]',
        'antes': ['fracoes'],
    },
}


def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


# ============ Aulas "Antes" novas (ids próprios, 'ele-': não dependem de outros módulos) ============
ANTES_NOVOS = {
    'ele-calor-especifico': {
        'titulo': 'Calor para esquentar a água: Q = m · c · ΔT',
        'linhas': [
            'Calor (Q) é energia que passa de um corpo para outro. Medimos em joule (J). 1 kJ = 1 000 J.',
            'Calor específico (c): quantos J pedem 1 kg do material para subir 1 °C. Na água, c = 4 200 J por kg por °C.',
            'Q = m · c · ΔT. Exemplo: 2 kg de água sobem 10 °C: Q = 2 · 4 200 · 10 = 84 000 J.',
            'Com vazão: se passam 0,5 kg por segundo, o calor por segundo (a potência) é 0,5 · 4 200 · ΔT, em watts (1 W = 1 J por segundo).',
            'L por minuto vira kg por segundo: 3 L por minuto = 3 kg em 60 s = 0,05 kg por segundo. E 100 g = 0,1 kg.',
        ],
        'visual': tabela('Calor para esquentar a água', ['Água', 'ΔT', 'Conta'], [['2 kg', '10 °C', '2 · 4 200 · 10 = 84 000 J'], ['0,5 kg por s', '10 °C', '0,5 · 4 200 · 10 = 21 000 W']]),
        'exercicios': [
            {'enunciado': 'Quanto calor pedem 0,2 kg de água para subir 5 °C? (c = 4 200 J/(kg · °C))', 'alternativas': ['4 200 J', '21 000 J', '840 J', '1 J'], 'certa': 0,
             'resolucao': '4 200 J: 0,2 · 4 200 = 840 e 840 · 5 = 4 200.\n21 000 J esquece os 0,2 kg; 840 J esquece o ΔT; 1 J só multiplica 0,2 · 5.'},
            {'enunciado': 'A água passa por um chuveiro a 6 L por minuto e esquenta 10 °C. Qual a potência que vira calor? (c = 4 200)', 'alternativas': ['4 200 W', '252 000 W', '420 W', '42 W'], 'certa': 0,
             'resolucao': '4 200 W: 6 L por minuto = 6 kg em 60 s = 0,1 kg por segundo; 0,1 · 4 200 · 10 = 4 200 W.\n252 000 W não divide por 60; 420 W esquece o ΔT; 42 W erra o c.'},
        ],
    },
    'ele-prefixos': {
        'titulo': 'Quilo e mili: kΩ, mA',
        'linhas': [
            'k (quilo) é mil vezes: 1 kΩ = 1 000 Ω e 1 kW = 1 000 W. Então 0,15 kΩ = 0,15 · 1 000 = 150 Ω.',
            'm (mili) é a milésima parte: 1 mA = 0,001 A. Então 1 A = 1 000 mA.',
            'Lei de Ohm: corrente (A) = tensão (V) ÷ resistência (Ω). Para dar em mA, multiplique o resultado em A por 1 000.',
            'Exemplo: 5 V sobre 2 kΩ = 2 000 Ω. 5 ÷ 2 000 = 0,0025 A, e 0,0025 · 1 000 = 2,5 mA.',
        ],
        'visual': tabela('Prefixos', ['Unidade', 'Vale', 'Exemplo'], [['1 kΩ', '1 000 Ω', '0,47 kΩ = 470 Ω'], ['1 A', '1 000 mA', '0,05 A = 50 mA']]),
        'exercicios': [
            {'enunciado': 'Quantos ohms são 0,47 kΩ?', 'alternativas': ['470 Ω', '4,7 Ω', '47 Ω', '47 000 Ω'], 'certa': 0,
             'resolucao': '470 Ω: 0,47 · 1 000 = 470.\n4,7 Ω e 47 Ω andam a vírgula para o lado errado; 47 000 Ω anda casas demais.'},
            {'enunciado': 'Uma corrente de 0,05 A vale quantos mA?', 'alternativas': ['50 mA', '0,05 mA', '5 mA', '500 mA'], 'certa': 0,
             'resolucao': '50 mA: 0,05 · 1 000 = 50.\n0,05 mA não converteu; 5 mA e 500 mA erram uma casa.'},
        ],
    },
    'ele-baterias-paralelo': {
        'titulo': 'Bateria real e duas baterias em paralelo',
        'linhas': [
            'Bateria real: uma fonte ideal de tensão ε (a fem) com uma resistência interna r em série com ela.',
            'Duas baterias ligadas aos mesmos dois terminais (em paralelo) valem uma só, com fem ε e resistência interna r.',
            'r = (r1 · r2) ÷ (r1 + r2), como dois resistores em paralelo. ε = (ε1 · r2 + ε2 · r1) ÷ (r1 + r2).',
            'Exemplo: 10 V e 2 Ω com 4 V e 2 Ω: ε = (10 · 2 + 4 · 2) ÷ 4 = 28 ÷ 4 = 7 V e r = (2 · 2) ÷ 4 = 1 Ω.',
            'A fem da bateria única fica sempre entre as duas fem (aqui, entre 4 V e 10 V).',
        ],
        'visual': tabela('Duas baterias em paralelo', ['Baterias', 'ε', 'r'], [['10 V e 2 Ω com 4 V e 2 Ω', '7 V', '1 Ω'], ['12 V e 2 Ω com 12 V e 2 Ω', '12 V', '1 Ω']]),
        'exercicios': [
            {'enunciado': 'Duas baterias iguais, de 12 V e 2 Ω, em paralelo. Quanto valem ε e r da bateria única?', 'alternativas': ['12 V e 1 Ω', '24 V e 4 Ω', '12 V e 4 Ω', '24 V e 1 Ω'], 'certa': 0,
             'resolucao': '12 V e 1 Ω: ε = (12 · 2 + 12 · 2) ÷ 4 = 48 ÷ 4 = 12 e r = (2 · 2) ÷ 4 = 1.\n24 V e 4 Ω soma tudo; 12 V e 4 Ω soma só o r; 24 V e 1 Ω soma só a fem.'},
            {'enunciado': 'Baterias de 10 V e 2 Ω e de 4 V e 2 Ω, em paralelo. Quanto valem ε e r da bateria única?', 'alternativas': ['7 V e 1 Ω', '14 V e 4 Ω', '7 V e 4 Ω', '10 V e 2 Ω'], 'certa': 0,
             'resolucao': '7 V e 1 Ω: ε = (10 · 2 + 4 · 2) ÷ 4 = 28 ÷ 4 = 7 e r = (2 · 2) ÷ 4 = 1.\n14 V e 4 Ω soma tudo; 7 V e 4 Ω soma só o r; 10 V e 2 Ω fica só com a maior bateria.'},
        ],
    },
}
for _id, _c in ANTES_NOVOS.items():
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    for _e in _c['exercicios']:
        assert _e['alternativas'][_e['certa']].split(' ')[0] in _e['resolucao'].split('\n')[0], (_id, _e['enunciado'])
assert Fr(2) * 4200 * 10 == 84000 and Fr(1, 2) * 4200 * 10 == 21000 and Fr(3, 60) == Fr(1, 20)
assert Fr(1, 5) * 4200 * 5 == 4200 and Fr(1, 5) * 4200 == 840 and 6 * 4200 * 10 == 252000 and Fr(6, 60) * 4200 * 10 == 4200
assert Fr(47, 100) * 1000 == 470 and Fr(5, 100) * 1000 == 50 and Fr(15, 100) * 1000 == 150 and Fr(5, 2000) * 1000 == Fr(5, 2)
assert (12 * 2 + 12 * 2, 2 * 2, 4) == (48, 4, 4) and Fr(12 * 2 + 12 * 2, 4) == 12 and Fr(2 * 2, 4) == 1
assert Fr(10 * 2 + 4 * 2, 4) == 7 and Fr(2 * 2, 4) == 1


# ============ a) ENEM: chuveiro de 3 posições, custo do mês ============
POS = {'morno': 2800, 'quente': 4200, 'superquente': 5600}
VAZAO_KG_S = Fr(3, 60)                       # 3 L/min
C_AGUA = 4200
ETA = Fr(8, 10)
T_ENTRA, T_QUER = 22, 36
TARIFA = Fr(90, 100)
BANHOS = 4 * 30
HORAS = Fr(BANHOS * 10, 60)
assert VAZAO_KG_S == Fr(1, 20) and HORAS == 20
SOBE = T_QUER - T_ENTRA
UTIL = VAZAO_KG_S * C_AGUA * SOBE
ELETR = UTIL / ETA
assert (SOBE, UTIL, ELETR) == (14, 2940, 3675)
# aumento de temperatura em cada posição (confere a escolha)
SOBE_POS = {n: float(ETA * p / (VAZAO_KG_S * C_AGUA)) for n, p in POS.items()}
assert [round(v, 2) for v in SOBE_POS.values()] == [10.67, 16.0, 21.33]
ESCOLHIDA = min((p for p in POS.values() if p >= ELETR))
assert ESCOLHIDA == 4200 and POS['morno'] < ELETR
KWH = Fr(ESCOLHIDA, 1000) * HORAS
CUSTO = KWH * TARIFA
assert (KWH, CUSTO) == (84, Fr(756, 10)) and float(CUSTO) == 75.6


def custo(p_w, horas=HORAS, tarifa=TARIFA):
    return Fr(p_w, 1000) * horas * tarifa


assert float(custo(3360)) == 60.48                       # usou a potência útil (80% de 4 200) em vez da elétrica
assert float(custo(5600)) == 100.8                       # escolheu a superquente
assert KWH == 84                                         # parou nos kWh, sem a tarifa
assert float(Fr(ESCOLHIDA, 1000) * Fr(10, 60) * TARIFA) == 0.63          # custo de um banho só
assert Fr(ESCOLHIDA, 1000) * Fr(10, 60) == Fr(7, 10)

ENUN_A = ('Uma família de quatro pessoas mora numa casa em que o chuveiro elétrico, ligado em 220 V, tem uma chave de três posições. O manual traz a potência elétrica de cada '
          'posição, na tabela abaixo, e avisa que só 80% dessa potência vira calor na água; o resto se perde na carcaça e nos fios. Com o registro aberto, a vazão fica em '
          '3 litros por minuto. No inverno a água chega ao chuveiro a 22 °C, e todos gostam de tomar banho com a água saindo a 36 °C, sempre na posição de menor potência que '
          'consiga essa temperatura, para gastar menos. Cada pessoa toma um banho por dia, de 10 minutos, e o mês tem 30 dias. A companhia de energia cobra R$ 0,90 por '
          'quilowatt-hora (kWh). Considere que 1 litro de água tem massa de 1 quilograma, que o calor específico da água é 4 200 J/(kg · °C) e que o chuveiro só gasta '
          'energia durante os banhos.\n\nPosição da chave e potência elétrica\nMorno: 2 800 W\nQuente: 4 200 W\nSuperquente: 5 600 W\n\n'
          'Qual é, em reais, o custo mensal de energia só com os banhos dessa família?')
assert len(ENUN_A) >= 600, len(ENUN_A)
Q.append(dict(
    id='d2-escada-fis-ita-ele-00a', materia='Física', tema=T, calc=75.6,
    enunciado=ENUN_A,
    dados=[('Posições', 'morno 2 800 W; quente 4 200 W; superquente 5 600 W'), ('Rendimento', '80% da potência vira calor na água'), ('Vazão', '3 L por minuto'),
           ('Temperaturas', 'entra a 22 °C; sai a 36 °C'), ('Banhos', '4 pessoas, 1 por dia, 10 min cada, 30 dias'), ('Preço da energia', 'R$ 0,90 por kWh'),
           ('Calor específico da água', '4 200 J/(kg · °C)')],
    alts=[('R$ 0,63', 0.63, 'Deu o custo de um banho só (0,7 kWh · 0,90), sem multiplicar pelos 120 banhos do mês'),
          ('R$ 60,48', 60.48, 'Usou a potência que vira calor, 3 360 W (80% de 4 200), em vez da potência elétrica que o chuveiro puxa da rede'),
          ('R$ 75,60', 75.6, 'OK'),
          ('R$ 84,00', 84, 'Parou nos 84 kWh do mês e não multiplicou pelo preço de R$ 0,90 por kWh'),
          ('R$ 100,80', 100.8, 'Escolheu a posição superquente (5 600 W), que também serve, mas não é a de menor potência')],
    resumo=('Água sobe 36 − 22 = 14 °C: calor por segundo = 0,05 · 4 200 · 14 = 2 940 W; elétrica = 2 940 ÷ 0,8 = 3 675 W; o morno (2 800 W) não basta e o quente (4 200 W) basta; '
            '120 banhos de 10 min = 20 h; 4,2 kW · 20 h = 84 kWh; 84 · 0,90 = R$ 75,60.'),
    ideia='Primeiro ache a menor posição que atinge 36 °C: o calor por segundo que a água pede, dividido pelo rendimento, é a potência elétrica mínima. Depois o custo vem da potência elétrica da posição, não do calor.',
    pecas=[('Rendimento', 'Parte da energia que serve ao que se quer. Aqui 80% da potência elétrica vira calor na água, então a potência elétrica é maior que o calor.'),
           ('Quilowatt-hora', 'Energia de um aparelho de 1 kW ligado por 1 hora. É a unidade da conta de luz.')],
    formulas=[('termometro', 'Calor por segundo', 'U = m · c · ΔT (m em kg por segundo)'), ('porcentagem', 'Rendimento', 'potência elétrica = U ÷ 0,8'),
              ('circuito', 'Energia da conta', 'kWh = kW · horas')],
    eq='R = k · h · v', leitura='custo = potência da posição, em kW · horas de banho no mês · preço de 1 kWh',
    letras=[('R', 'custo de energia no mês, em reais (o que a questão quer)'), ('k', 'potência elétrica da posição escolhida, em kW'), ('h', 'horas de banho no mês'),
            ('v', 'preço de 1 kWh, em reais'), ('n', 'número de banhos no mês')],
    eq_texto='Cada hora ligada, a posição gasta k quilowatts-hora, e cada kWh custa v reais. Multiplicando pelas h horas do mês, sai o custo.\nAgora é só achar n, h, v e k.',
    achando=[('Achando n: os banhos do mês', 'Cada uma das 4 pessoas toma 1 banho por dia, durante 30 dias.\nn = 4 · 30 = 120 banhos.'),
             ('Achando h: as horas do mês', 'Cada banho dura 10 min, então 120 banhos dão 120 · 10 = 1 200 min.\n1 hora tem 60 min: 1 200 ÷ 60 = 20 (pois 60 · 20 = 1 200).\nh = 20 horas.'),
             ('Achando v: o preço do kWh', 'O enunciado dá: v = R$ 0,90 por kWh.'),
             ('Achando k: o calor que a água pede',
              'A água precisa subir 36 − 22 = 14 °C.\n3 litros por minuto = 3 kg em 60 s = 0,05 kg por segundo (60 · 0,05 = 3).\n'
              'Calor por segundo: 0,05 · 4 200 = 210 e 210 · 14 = 2 940 W (210 · 10 = 2 100 e 210 · 4 = 840).'),
             ('Achando k: a posição da chave',
              'Só 80% = 0,8 da potência elétrica vira calor. A elétrica mínima é 2 940 ÷ 0,8 = 3 675 W (pois 0,8 · 3 675 = 2 940).\n'
              'Morno, 2 800 W, é pouco (2 800 < 3 675). Quente, 4 200 W, basta (4 200 > 3 675), e é a menor que serve.\nk = 4 200 W = 4,2 kW (1 kW = 1 000 W).')],
    volta='R = 4,2 · 20 · 0,90. Primeiro 4,2 · 20 = 84 kWh no mês. Depois 84 · 0,90 = 75,6 (84 · 9 = 756, dividido por 10).\nR = R$ 75,60.\nResposta: alternativa A. Conferindo: 120 banhos de 0,7 kWh dão 84 kWh.',
    valores=[('n', '120 banhos'), ('h', '20 h'), ('v', 'R$ 0,90 por kWh'), ('k', '4,2 kW')],
    pista='"menor posição que atinge a temperatura" e "custo do mês" → calor por segundo ÷ rendimento acha a potência elétrica mínima; escolha a posição da tabela e multiplique por horas e preço.',
    rec1='3 L/min; 22 a 36 °C; 80%; 3 posições; 120 banhos; R$ 0,90', rec3='n = 120; h = 20; v = 0,90; k = 4,2',
    checagem=('Um aparelho de 2 000 W fica ligado 3 horas. Quantos kWh ele gasta?', ['6 kWh', '2 kWh', '6 000 kWh', '0,67 kWh'], '6 kWh', '2 000 W = 2 kW; 2 · 3 = 6 kWh.'),
    ancora=('forte · ENEM 2022 q.111 caderno 5 (= q.116 caderno 7): ducha com três níveis, vazão e calor específico; escolher a pior posição da tabela '
            'e passar de L/min para kg por segundo. Aqui a escolha é a menor posição que serve, e a pergunta é o custo do mês'),
    canal='fis-13-potencia-eletrica-e-efeito-joule.txt [11:48:01] (chuveiro de três posições) e fis-06-calorimetria.txt [5:42:30] (Q = m · c · ΔT)',
    antes=['ele-calor-especifico', 'porcentagem', 'dividir-por-decimal'],
))


# ============ b) ITA: duas baterias reais em paralelo, potência máxima e tempo ============
E1, R1, E2, R2 = Fr(16), Fr(3, 2), Fr(4), Fr(3)
R_EQ = R1 * R2 / (R1 + R2)
E_EQ = (E1 * R2 + E2 * R1) / (R1 + R2)
assert (E_EQ, R_EQ) == (12, 1) and E_EQ == (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2)


def pot(e, r, R):
    return R * (e / (R + r)) ** 2


assert pot(E_EQ, R_EQ, Fr(1)) == 36 and pot(E_EQ, R_EQ, Fr(1, 2)) == 32 and pot(E_EQ, R_EQ, Fr(2)) == 32 and pot(E_EQ, R_EQ, Fr(3)) == 27
assert all(pot(E_EQ, R_EQ, Fr(k, 100)) <= 36 for k in range(1, 1001))              # o topo é em R = r (varredura)
I_TOT = E_EQ / (1 + R_EQ)
V_TERM = I_TOT * 1
assert (I_TOT, V_TERM) == (6, 6)
I1, I2 = (E1 - V_TERM) / R1, (E2 - V_TERM) / R2
assert (I1, I2) == (Fr(20, 3), Fr(-2, 3)) and I1 + I2 == I_TOT                      # a bateria de 4 V é carregada
P_TOTAL = E1 * I1 + E2 * I2
assert P_TOTAL == 104 and P_TOTAL - (R1 * I1 ** 2 + R2 * I2 ** 2) == 36
M, DT = Fr(1, 10), 6
Q_AGUA = M * 4200 * DT
assert Q_AGUA == 2520 and Q_AGUA / 36 == 70
# erros típicos
assert round(float(Q_AGUA / P_TOTAL), 1) == 24.2                                   # potência total das baterias
assert round(float(Q_AGUA / pot(E_EQ, R_EQ, R1)), 1) == 72.9                       # R = 1,5 Ω (a menor resistência interna)
MEDIA = (E1 + E2) / 2
assert MEDIA == 10 and float(Q_AGUA / pot(MEDIA, R_EQ, Fr(1))) == 100.8             # média simples das fem
assert Q_AGUA * 1000 / 36 == Fr(70000)                                             # 100 g tratados como 100 kg
Q.append(dict(
    id='d2-escada-fis-ita-ele-00b', materia='Física', tema=T, calc=70,
    enunciado=('Duas baterias reais, uma de força eletromotriz 16 V e resistência interna 1,5 Ω e outra de 4 V e 3 Ω, são ligadas em paralelo (positivo com positivo, negativo com negativo). '
               'Entre os terminais comuns liga-se um resistor de imersão, de resistência R ajustável, mergulhado em 100 g de água. Toda a potência dissipada em R vira calor na água, sem perdas. '
               'O valor de R é ajustado para a maior potência possível no resistor. Considere o calor específico da água igual a 4 200 J/(kg · °C). '
               'O tempo, em segundos, para a água subir 6 °C é:'),
    dados=[('Bateria 1', '16 V e 1,5 Ω'), ('Bateria 2', '4 V e 3 Ω'), ('Ligação das baterias', 'em paralelo'), ('Resistor R', 'ajustado para a potência máxima'),
           ('Água', '100 g, sobe 6 °C, sem perdas'), ('Calor específico da água', '4 200 J/(kg · °C)')],
    alts=[('24,2', 24.2, 'Usou a potência total das duas baterias, 104 W; parte dela esquenta as próprias baterias e a bateria de 4 V ainda é carregada'),
          ('70', 70, 'OK'),
          ('72,9', 72.9, 'Casou R com 1,5 Ω, a menor resistência interna, em vez da resistência equivalente: P = 34,56 W'),
          ('100,8', 100.8, 'Tirou a média simples das fem (10 V) em vez de ponderar pelas resistências: P = 25 W'),
          ('70 000', 70000, 'Usou 100 g como se fossem 100 kg: Q = 2 520 000 J')],
    resumo=('ε = (16 · 3 + 4 · 1,5) ÷ 4,5 = 12 V e r = 1,5 · 3 ÷ 4,5 = 1 Ω; potência máxima com R = r = 1 Ω: I = 6 A, P = 36 W; Q = 0,1 · 4 200 · 6 = 2 520 J; '
            't = 2 520 ÷ 36 = 70 s.'),
    ideia='As duas baterias em paralelo valem uma só, com fem e resistência interna equivalentes. A potência no resistor é máxima quando R é igual a essa resistência, e o tempo é o calor da água dividido por ela.',
    pecas=[('Bateria equivalente', 'A bateria única que deixa o resistor igual: mesma tensão e mesma corrente nele que as duas em paralelo.'),
           ('Potência máxima no resistor', 'Com R muito pequeno quase não há tensão nele; com R muito grande, quase não há corrente. O topo fica em R = r.')],
    formulas=[('circuito', 'Bateria equivalente', 'ε e r pela regra do "Antes"'), ('circuito', 'Potência no resistor', 'P = R · I · I'),
              ('termometro', 'Calor da água', 'Q = m · c · ΔT')],
    eq='t = Q ÷ P', leitura='tempo = calor que a água pede ÷ potência no resistor',
    letras=[('t', 'tempo para a água subir 6 °C, em s (o que a questão quer)'), ('Q', 'calor que a água pede, em J'), ('P', 'maior potência no resistor, em W'),
            ('ε', 'fem da bateria equivalente, em V'), ('r', 'resistência interna da bateria equivalente, em Ω')],
    eq_texto='O resistor entrega P joules por segundo à água. Dividindo o calor que a água pede por P, sai o tempo.\nAgora é só achar Q, ε, r e P.',
    achando=[('Achando Q: o calor da água', '100 g = 0,1 kg. Q = 0,1 · 4 200 · 6.\n0,1 · 4 200 = 420 e 420 · 6 = 2 520 J.'),
             ('Achando ε: a fem equivalente', 'Regra do "Antes": ε = (16 · 3 + 4 · 1,5) ÷ (1,5 + 3).\n16 · 3 = 48 e 4 · 1,5 = 6, e 48 + 6 = 54. Embaixo: 1,5 + 3 = 4,5.\n54 ÷ 4,5 = 12 (pois 4,5 · 12 = 54). ε = 12 V.'),
             ('Achando r: a resistência equivalente', 'r = (1,5 · 3) ÷ (1,5 + 3) = 4,5 ÷ 4,5 = 1 Ω.'),
             ('Achando P: a maior potência',
              'A potência no resistor é P = R · I · I, com I = 12 ÷ (R + 1). Teste:\nR = 0,5: I = 12 ÷ 1,5 = 8 A; P = 0,5 · 64 = 32 W.\nR = 1: I = 12 ÷ 2 = 6 A; P = 1 · 36 = 36 W.\n'
              'R = 2: I = 12 ÷ 3 = 4 A; P = 2 · 16 = 32 W.\nR = 3: I = 3 A; P = 3 · 9 = 27 W.\nO topo é em R = 1 Ω, igual a r. P = 36 W.')],
    volta='t = 2 520 ÷ 36 = 70 s (pois 36 · 70 = 2 520: 36 · 7 = 252).\nResposta: alternativa A. Conferindo: com R = 1 Ω, a corrente é 6 A e 1 · 6 · 6 = 36 W.',
    valores=[('Q', '2 520 J'), ('ε', '12 V'), ('r', '1 Ω'), ('P', '36 W')],
    pista='"baterias em paralelo" e "maior potência" → troque as duas por uma bateria equivalente (ε e r), ponha R = r para a potência máxima e divida o calor pela potência.',
    rec1='16 V e 1,5 Ω; 4 V e 3 Ω; paralelo; 100 g, 6 °C', rec3='Q = 2 520; ε = 12; r = 1; P = 36',
    checagem=('Bateria de 10 V e r = 5 Ω. Qual a potência máxima no resistor?', ['5 W', '10 W', '20 W', '2,5 W'], '5 W', 'R = 5 Ω; I = 10 ÷ 10 = 1 A; P = 5 · 1 · 1 = 5 W.'),
    ancora=('parcial · ITA 2022 2ª fase, Física (a rede é trocada por um gerador equivalente de Thevenin e a potência máxima vem de R = r equivalente); '
            'aqui são duas baterias reais em paralelo; ENEM 2022 q.133 caderno 5 fica como toque (bateria com resistência interna)'),
    canal='fora do canal: resistência interna e baterias em paralelo (0 hits); Ohm em fis-12-circuitos-eletricos.txt [10:29:33] e calor em fis-06-calorimetria.txt [5:42:30]',
    antes=['ele-baterias-paralelo', 'ele-calor-especifico', 'numero-que-falta'],
))


# ============ c) Fuvest: protoboard com um resistor em curto ============
V_F = Fr(15)
RA, RB, RC, RD = Fr(100), Fr(300), Fr(150), Fr(470)           # R1, R2, R3, R4 (R4 em curto)
RP = RB * RC / (RB + RC)
assert RP == 100
J_TOT = V_F / (RA + RP)
U_PAR = RP * J_TOT
I3 = U_PAR / RC
assert (J_TOT * 1000, U_PAR, I3 * 1000) == (75, Fr(15, 2), 50) and U_PAR / RB * 1000 == 25 and I3 + U_PAR / RB == J_TOT
assert RA == Fr(10, 100) * 1000 and RD == Fr(47, 100) * 1000
# erros típicos
assert V_F / RC * 1000 == 100                                  # 15 V direto em R3
J4 = V_F / (RA + RP + RD)                                      # R4 em série (não viu o curto)
assert round(float(J4 * RP / RC * 1000), 1) == 14.9
Q.append(dict(
    id='d2-escada-fis-ita-ele-00c', materia='Física', tema=T, calc=50,
    enunciado=('Numa aula de eletrônica, um aluno monta um circuito numa protoboard, placa em que todos os furos de uma mesma linha estão ligados entre si por dentro e formam um único ponto do circuito. '
               'Os fios de uma fonte contínua de 15 V ocupam as linhas 1 (positivo) e 3 (negativo), e os quatro resistores são encaixados como mostra a tabela. Os fios e a fonte são ideais.\n\n'
               'Linha 1: fio positivo e uma ponta de R1\n'
               'Linha 2: outra ponta de R1; uma ponta de R2; uma ponta de R3; as duas pontas de R4\n'
               'Linha 3: outra ponta de R2; outra ponta de R3; fio negativo\n\n'
               'R1 = 0,10 kΩ; R2 = 300 Ω; R3 = 150 Ω; R4 = 0,47 kΩ.\n\n'
               'Qual é, em miliampères (mA), a corrente que passa pelo resistor R3?'),
    dados=[('Fonte', '15 V (linha 1 positivo, linha 3 negativo)'), ('R1', '0,10 kΩ, entre as linhas 1 e 2'), ('R2 e R3', '300 Ω e 150 Ω, entre as linhas 2 e 3'),
           ('R4', '0,47 kΩ, as duas pontas na linha 2')],
    alts=[('14,9 mA', 14.93, 'Pôs R4 em série (não viu o curto): 100 + 100 + 470 = 670 Ω, corrente 22,4 mA, tensão 2,24 V no paralelo'),
          ('25 mA', 25, 'Deu a corrente de R2 (7,5 ÷ 300), não a de R3'),
          ('50 mA', 50, 'OK'),
          ('75 mA', 75, 'Deu a corrente total (15 ÷ 200), sem dividir entre R2 e R3'),
          ('100 mA', 100, 'Ligou os 15 V direto em R3: 15 ÷ 150')],
    resumo=('R4 tem as duas pontas na linha 2: em curto, sem corrente. R2 e R3: 300 · 150 ÷ 450 = 100 Ω; com R1 = 100 Ω, total 200 Ω; corrente total 15 ÷ 200 = 75 mA; '
            'tensão no paralelo 100 · 0,075 = 7,5 V; corrente em R3 = 7,5 ÷ 150 = 50 mA.'),
    ideia='Dois furos da mesma linha são o mesmo ponto: R4, com as duas pontas na linha 2, está em curto e não leva corrente. O resto é R1 em série com R2 e R3 em paralelo.',
    pecas=[('Linha da protoboard', 'Todos os furos de uma linha estão ligados: valem um ponto só do circuito.'),
           ('Resistor em curto', 'Com as duas pontas no mesmo ponto, não há tensão sobre ele e nenhuma corrente passa.')],
    formulas=[('circuito', 'Lei de Ohm', 'U = R · I'), ('circuito', 'Dois em paralelo', 'Rp = (X · Y) ÷ (X + Y)'), ('texto', 'Prefixos', '1 kΩ = 1 000 Ω; 1 A = 1 000 mA')],
    eq='I = U ÷ R', leitura='corrente em R3 = tensão entre as linhas 2 e 3 ÷ resistência de R3',
    letras=[('I', 'corrente em R3, em mA (o que a questão quer)'), ('U', 'tensão entre as linhas 2 e 3, em V'), ('R', 'resistência de R3, em Ω'),
            ('p', 'resistência de R2 e R3 em paralelo, em Ω'), ('j', 'corrente total que sai da fonte, em A')],
    eq_texto='R3 está entre as linhas 2 e 3, e a tensão sobre ele é a mesma de R2. Dividindo essa tensão por R3, sai a corrente.\nAgora é só achar R, p, j e U.',
    achando=[('Achando R: o resistor R3', 'É o R3 do enunciado: R = 150 Ω.'),
             ('Achando p: o paralelo de R2 e R3',
              'R4 tem as duas pontas na linha 2: o mesmo ponto nos dois lados, então sem tensão e sem corrente. Ele sai do circuito.\n'
              'R2 e R3 ligam a linha 2 à 3, em paralelo: 300 · 150 = 45 000 e 300 + 150 = 450.\n45 000 ÷ 450 = 100 (pois 450 · 100 = 45 000). p = 100 Ω.'),
             ('Achando j: a corrente total',
              'R1 = 0,10 kΩ = 0,10 · 1 000 = 100 Ω, em série com o paralelo: 100 + 100 = 200 Ω.\nj = 15 ÷ 200 = 0,075 A (pois 200 · 0,075 = 15).\nEm mA: 0,075 · 1 000 = 75 mA.'),
             ('Achando U: a tensão do paralelo', 'U = p · j = 100 · 0,075 = 7,5 V.\nR1 gasta os outros 7,5 V (100 · 0,075 = 7,5), e 7,5 + 7,5 = 15 V.')],
    volta='I = 7,5 ÷ 150 = 0,05 A (pois 150 · 0,05 = 7,5).\nEm mA: 0,05 · 1 000 = 50 mA.\nResposta: alternativa A. Conferindo: R2 leva 7,5 ÷ 300 = 0,025 A = 25 mA, e 50 + 25 = 75 mA, a corrente total.',
    valores=[('R', '150 Ω'), ('p', '100 Ω'), ('j', '0,075 A = 75 mA'), ('U', '7,5 V')],
    pista='"protoboard" → furos da mesma linha são um ponto só; resistor com as duas pontas na mesma linha está em curto e sai da conta. O resto é série e paralelo; atenção a kΩ e mA.',
    rec1='15 V; R1 = 100 Ω; R2 = 300 Ω; R3 = 150 Ω; R4 em curto', rec3='R = 150; p = 100; j = 0,075; U = 7,5',
    checagem=('Fonte de 12 V, resistor de 4 Ω e outro de 6 Ω, este com as duas pontas no mesmo ponto. Qual a corrente?', ['3 A', '1,2 A', '2 A', '4 A'], '3 A', 'O de 6 Ω está em curto: fica só 4 Ω; I = 12 ÷ 4 = 3 A.'),
    ancora=('forte · Fuvest 2024 1ª fase q.57 (protoboard: os furos de uma linha estão em curto e formam os nós; kΩ e corrente pequena) e ENEM 2019 q.126 caderno 7 '
            '(cabo em série com ramos em paralelo); aqui um resistor com as duas pontas na mesma linha não leva corrente'),
    canal='fis-12-circuitos-eletricos.txt [10:40:01] (série) e [10:42:00] (paralelo); resistor em curto e protoboard: fora do canal',
    antes=['ele-prefixos', 'dividir-por-decimal'],
))

for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), (_q['id'], [len(v) for _, v in _q['dados']])
