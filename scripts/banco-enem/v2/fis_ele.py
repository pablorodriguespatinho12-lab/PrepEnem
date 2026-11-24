"""Nível acima v2 de Física: Eletricidade e Circuitos (23/11/2026; revisão 24/11/2026 pelo aluno-do-zero).

a = ENEM (chuveiro: a tabela dá só o aumento de temperatura; a posição muda a cada mês; custo do trimestre),
b = ITA (duas baterias reais em paralelo viram uma só; potência máxima e tempo para aquecer água),
c = Fuvest (protoboard com um resistor em curto E outro em aberto), d = Harvard-MIT (cubo de resistores por simetria, reescrita em telas menores).
As 4 antigas saem. Conferido por assert no próprio módulo.
Letras da equação: abreviações próprias, nunca A a E nem símbolo de unidade (R$, m, h, W, V, A) nem outra letra da mesma questão.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_ele
"""
from fractions import Fraction as Fr

ARQUIVO = 'fisica-acima-novas.json'
T = 'Eletricidade e Circuitos'

Q = []
MANTER = {}


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
            'L por minuto vira kg por segundo: 6 L por minuto = 6 kg em 60 s = 0,1 kg por segundo. E 100 g = 0,1 kg.',
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
        'titulo': 'Quilo e mili: kΩ, mA, kW e kWh',
        'linhas': [
            'k (quilo) é mil vezes: 1 kΩ = 1 000 Ω e 1 kW = 1 000 W. Então 0,15 kΩ = 0,15 · 1 000 = 150 Ω.',
            'm (mili) é a milésima parte: 1 mA = 0,001 A. Então 1 A = 1 000 mA.',
            'Lei de Ohm: corrente (A) = tensão (V) ÷ resistência (Ω). Para dar em mA, multiplique o resultado em A por 1 000.',
            'Exemplo: 5 V sobre 2 kΩ = 2 000 Ω. 5 ÷ 2 000 = 0,0025 A, e 0,0025 · 1 000 = 2,5 mA.',
            'kWh é a energia de 1 kW ligado por 1 hora (é a unidade da conta de luz). 2 kW por 3 h gastam 2 · 3 = 6 kWh.',
        ],
        'visual': tabela('Prefixos', ['Unidade', 'Vale', 'Exemplo'], [['1 kΩ', '1 000 Ω', '0,47 kΩ = 470 Ω'], ['1 A', '1 000 mA', '0,05 A = 50 mA'], ['1 kW', '1 000 W', '2 kW por 3 h = 6 kWh']]),
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
            'Bateria real: uma fonte ideal de tensão (a fem, em V) com uma resistência interna (Rin, em Ω) em fila com ela.',
            'Duas baterias ligadas aos mesmos dois terminais (em paralelo) valem uma só, com uma Fem e uma Rin próprias.',
            'Rin = (r1 · r2) ÷ (r1 + r2), como dois resistores em paralelo. Fem = (ε1 · r2 + ε2 · r1) ÷ (r1 + r2). Bateria 1: ε1 e r1; bateria 2: ε2 e r2.',
            'Exemplo: 10 V e 2 Ω com 4 V e 2 Ω: Fem = (10 · 2 + 4 · 2) ÷ 4 = 28 ÷ 4 = 7 V e Rin = (2 · 2) ÷ 4 = 1 Ω.',
            'A Fem da bateria única fica sempre entre as duas fem (aqui, entre 4 V e 10 V).',
        ],
        'visual': tabela('Duas baterias em paralelo', ['Baterias', 'Fem', 'Rin'], [['10 V e 2 Ω com 4 V e 2 Ω', '7 V', '1 Ω'], ['12 V e 2 Ω com 12 V e 2 Ω', '12 V', '1 Ω']]),
        'exercicios': [
            {'enunciado': 'Duas baterias iguais, de 12 V e 2 Ω, em paralelo. Quanto valem a Fem e a Rin da bateria única?', 'alternativas': ['12 V e 1 Ω', '24 V e 4 Ω', '12 V e 4 Ω', '24 V e 1 Ω'], 'certa': 0,
             'resolucao': '12 V e 1 Ω: Fem = (12 · 2 + 12 · 2) ÷ 4 = 48 ÷ 4 = 12 e Rin = (2 · 2) ÷ 4 = 1.\n24 V e 4 Ω soma tudo; 12 V e 4 Ω soma só a resistência; 24 V e 1 Ω soma só a fem.'},
            {'enunciado': 'Baterias de 10 V e 2 Ω e de 4 V e 2 Ω, em paralelo. Quanto valem a Fem e a Rin da bateria única?', 'alternativas': ['7 V e 1 Ω', '14 V e 4 Ω', '7 V e 4 Ω', '10 V e 2 Ω'], 'certa': 0,
             'resolucao': '7 V e 1 Ω: Fem = (10 · 2 + 4 · 2) ÷ 4 = 28 ÷ 4 = 7 e Rin = (2 · 2) ÷ 4 = 1.\n14 V e 4 Ω soma tudo; 7 V e 4 Ω soma só a resistência; 10 V e 2 Ω fica só com a maior bateria.'},
        ],
    },
    'ele-serie-paralelo': {
        'titulo': 'Série, paralelo e resistor que não conduz',
        'linhas': [
            'Série: os resistores ficam em fila e a mesma corrente passa por todos. As resistências somam: 100 Ω e 150 Ω em série valem 250 Ω.',
            'Na fila, as tensões também somam: 7,5 V em um e 7,5 V no outro gastam 15 V da fonte.',
            'Paralelo: as duas pontas de cada resistor ficam nos mesmos dois pontos. A tensão é a mesma nos dois e a corrente se divide.',
            'Dois em paralelo: X · Y ÷ (X + Y). Exemplo: 300 Ω e 150 Ω: 300 · 150 = 45 000 e 300 + 150 = 450; 45 000 ÷ 450 = 100 Ω.',
            'Curto: resistor com as duas pontas no mesmo ponto não tem tensão, e nenhuma corrente passa. Aberto: com uma ponta solta, também não passa. Os dois saem da conta.',
            'Lei de Ohm: corrente = tensão ÷ resistência. Exemplo: 12 V sobre 4 Ω dão 3 A.',
        ],
        'visual': tabela('Série e paralelo', ['Ligação', 'Regra', 'Exemplo'], [['Série', 'soma', '100 + 150 = 250 Ω'], ['Paralelo', 'X · Y ÷ (X + Y)', '6 e 3 dão 18 ÷ 9 = 2 Ω']]),
        'exercicios': [
            {'enunciado': 'Resistores de 100 Ω e 200 Ω em série, numa fonte de 15 V. Qual a corrente?', 'alternativas': ['0,05 A', '0,15 A', '0,5 A', '0,075 A'], 'certa': 0,
             'resolucao': '0,05 A: 100 + 200 = 300 Ω e 15 ÷ 300 = 0,05 A.\n0,15 A usa só o de 100 Ω; 0,075 A usa só o de 200 Ω; 0,5 A erra a vírgula.'},
            {'enunciado': 'Resistores de 6 Ω e 3 Ω em paralelo. Qual a resistência única?', 'alternativas': ['2 Ω', '9 Ω', '4,5 Ω', '18 Ω'], 'certa': 0,
             'resolucao': '2 Ω: 6 · 3 = 18 e 6 + 3 = 9; 18 ÷ 9 = 2 Ω.\n9 Ω soma como se fosse série; 4,5 Ω é a média; 18 Ω é só o produto.'},
        ],
    },
    'ele-potencia-maxima': {
        'titulo': 'Bateria e resistor: corrente, potência e o máximo',
        'linhas': [
            'Bateria (Fem, Rin) ligada a um resistor R: ficam em fila, então as resistências somam, R + Rin.',
            'Lei de Ohm: corrente = Fem ÷ (R + Rin). Exemplo: Fem = 12 V, Rin = 1 Ω, R = 5 Ω: corrente = 12 ÷ 6 = 2 A.',
            'Potência no resistor = tensão nele · corrente = (R · corrente) · corrente. Exemplo: 5 · 2 = 10 V e 10 · 2 = 20 W.',
            'Com R variável, a potência sobe e desce. Ela é máxima quando R = Rin. Com Fem = 12 V e Rin = 1 Ω: R = 0,8 dá 35,6 W; R = 1 dá 36 W; R = 1,25 dá 35,6 W.',
        ],
        'visual': tabela('Fem = 12 V e Rin = 1 Ω', ['R', 'Corrente', 'Potência'], [['0,8 Ω', '6,67 A', '35,6 W'], ['1 Ω', '6 A', '36 W'], ['1,25 Ω', '5,33 A', '35,6 W']]),
        'exercicios': [
            {'enunciado': 'Fem = 10 V, Rin = 2 Ω e R = 3 Ω. Qual a potência no resistor R?', 'alternativas': ['12 W', '20 W', '6 W', '8 W'], 'certa': 0,
             'resolucao': '12 W: corrente = 10 ÷ 5 = 2 A e potência = 3 · 2 · 2 = 12 W.\n20 W é a potência total (10 · 2); 6 W esquece uma corrente; 8 W é a perdida dentro da bateria.'},
            {'enunciado': 'Fem = 12 V e Rin = 3 Ω. Para qual R a potência no resistor é máxima?', 'alternativas': ['3 Ω', '0 Ω', '6 Ω', '12 Ω'], 'certa': 0,
             'resolucao': '3 Ω: a potência é máxima quando R = Rin. Com R = 3: corrente 2 A e 12 W; com R = 6: corrente 12 ÷ 9 e cerca de 10,7 W, menos.\n0 Ω não tem tensão no resistor; 6 Ω e 12 Ω passam do ponto.'},
        ],
    },
    'ele-nos-simetria': {
        'titulo': 'Lei dos nós, simetria e queda de tensão',
        'linhas': [
            'Lei dos nós: num ponto (nó) da ligação, a corrente que chega é igual à que sai. A eletricidade não some nem aparece.',
            'Exemplo: chegam 1 A e 1 A num ponto; saem 2 A.',
            'Simetria: se dá para girar ou espelhar o circuito e ele fica igual, as partes que trocam de lugar levam a mesma corrente.',
            'Exemplo: 6 A saem de um ponto por 3 fios iguais e simétricos: 6 ÷ 3 = 2 A em cada.',
            'Queda de tensão num resistor = resistência · corrente. Com 12 Ω e 2 A: 12 · 2 = 24 V. Em fila, as quedas somam.',
        ],
        'visual': tabela('Nós e quedas', ['Situação', 'Conta', 'Resultado'], [['Chegam 1 A e 1 A', '1 + 1', 'saem 2 A'], ['6 A em 3 fios iguais', '6 ÷ 3', '2 A em cada'], ['12 Ω com 2 A', '12 · 2', '24 V']]),
        'exercicios': [
            {'enunciado': 'Num ponto chegam 3 A por um fio e 2 A por outro. Quantos A saem?', 'alternativas': ['5 A', '1 A', '6 A', '3 A'], 'certa': 0,
             'resolucao': '5 A: o que chega é o que sai, 3 + 2 = 5 A.\n1 A subtrai; 6 A multiplica; 3 A pega só um fio.'},
            {'enunciado': 'Saem 12 A de um ponto por 4 fios iguais e simétricos. Quantos A em cada fio?', 'alternativas': ['3 A', '48 A', '8 A', '12 A'], 'certa': 0,
             'resolucao': '3 A: por simetria, as correntes são iguais, 12 ÷ 4 = 3 A.\n48 A multiplica; 8 A subtrai 4; 12 A deixa tudo num fio.'},
        ],
    },
}
for _id, _c in ANTES_NOVOS.items():
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    for _e in _c['exercicios']:
        assert _e['alternativas'][_e['certa']].split(' ')[0] in _e['resolucao'].split('\n')[0], (_id, _e['enunciado'])
assert Fr(2) * 4200 * 10 == 84000 and Fr(1, 2) * 4200 * 10 == 21000 and Fr(6, 60) == Fr(1, 10)
assert Fr(1, 5) * 4200 * 5 == 4200 and Fr(1, 5) * 4200 == 840 and 6 * 4200 * 10 == 252000 and Fr(6, 60) * 4200 * 10 == 4200
assert Fr(47, 100) * 1000 == 470 and Fr(5, 100) * 1000 == 50 and Fr(15, 100) * 1000 == 150 and Fr(5, 2000) * 1000 == Fr(5, 2) and 2 * 3 == 6
assert Fr(12 * 2 + 12 * 2, 4) == 12 and Fr(2 * 2, 4) == 1 and Fr(10 * 2 + 4 * 2, 4) == 7
assert 100 + 150 == 250 and Fr(300 * 150, 300 + 150) == 100 and Fr(6 * 3, 6 + 3) == 2 and Fr(15, 100 + 200) == Fr(1, 20) and Fr(12, 4) == 3
assert Fr(12, 6) == 2 and 5 * 2 * 2 == 20 and 10 * 2 == 20 and 2 ** 2 * 2 == 8
assert Fr(12) * 0 + 3 * Fr(10, 5) ** 2 == 12
_pm = lambda fem, rin, r: r * (fem / (r + rin)) ** 2
assert _pm(Fr(12), Fr(1), Fr(1)) == 36 and round(float(_pm(Fr(12), Fr(1), Fr(4, 5))), 1) == 35.6 and round(float(_pm(Fr(12), Fr(1), Fr(5, 4))), 1) == 35.6
assert round(float(Fr(12) / Fr(9, 5)), 2) == 6.67 and round(float(Fr(12) / Fr(9, 4)), 2) == 5.33
assert _pm(Fr(12), Fr(3), Fr(3)) == 12 and round(float(_pm(Fr(12), Fr(3), Fr(6))), 1) == 10.7 and _pm(Fr(12), Fr(3), Fr(3)) > _pm(Fr(12), Fr(3), Fr(6))
assert 3 + 2 == 5 and Fr(12, 4) == 3


# ============ a) ENEM: chuveiro de 3 posições, a posição muda a cada mês, custo do trimestre ============
SOBE_TAB = {'morno': 8, 'quente': 16, 'superquente': 24}           # °C a 3 L/min (a tabela do manual)
VAZAO_KG_S = Fr(3, 60)
C_AGUA = 4200
ETA = Fr(8, 10)
T_ALVO = 38
ENTRA = {'junho': 24, 'julho': 18, 'agosto': 22}
TARIFA = Fr(90, 100)
HORAS = Fr(4 * 30 * 10, 60)
assert VAZAO_KG_S == Fr(1, 20) and HORAS == 20 and VAZAO_KG_S * C_AGUA == 210
CALOR_POS = {n: VAZAO_KG_S * C_AGUA * d for n, d in SOBE_TAB.items()}
P_ELE = {n: c / ETA for n, c in CALOR_POS.items()}                  # potência elétrica que o chuveiro puxa
assert CALOR_POS == {'morno': 1680, 'quente': 3360, 'superquente': 5040}
assert P_ELE == {'morno': 2100, 'quente': 4200, 'superquente': 6300}


def escolhe(t_entra):
    precisa = T_ALVO - t_entra
    return min((d, n) for n, d in SOBE_TAB.items() if d >= precisa)[1]


assert [T_ALVO - t for t in ENTRA.values()] == [14, 20, 16]
ESC = {mes: escolhe(t) for mes, t in ENTRA.items()}
assert ESC == {'junho': 'quente', 'julho': 'superquente', 'agosto': 'quente'}          # agosto: 16 serve (igual)
KW = {mes: Fr(P_ELE[n], 1000) for mes, n in ESC.items()}
assert (KW['junho'], KW['julho'], KW['agosto']) == (Fr(42, 10), Fr(63, 10), Fr(42, 10))
SOMA_KW = sum(KW.values())
KWH = SOMA_KW * HORAS
CUSTO = KWH * TARIFA
assert (SOMA_KW, KWH, CUSTO) == (Fr(147, 10), 294, Fr(2646, 10)) and float(CUSTO) == 264.6
# erros típicos
assert round(float(KWH * ETA * TARIFA), 2) == 211.68                                    # usou o calor (80%) em vez da potência elétrica
assert round(float((KW['junho'] + 2 * KW['julho']) * HORAS * TARIFA), 2) == 302.4      # agosto na superquente (16 não "bastaria")
assert round(float(3 * KW['julho'] * HORAS * TARIFA), 2) == 340.2                       # o pior mês nos três meses
assert KWH == 294                                                                       # parou nos kWh
assert float(KW['julho'] * HORAS * TARIFA) == 113.4                                     # só julho

ENUN_A = ('Uma família de quatro pessoas mora numa casa em que o chuveiro elétrico, ligado em 220 V, tem uma chave de três posições. O manual não informa a potência: traz só '
          'quanto a água esquenta em cada posição, medido com o registro na vazão de 3 litros por minuto (tabela abaixo), e avisa que só 80% da potência elétrica vira calor na água; '
          'o resto se perde na carcaça e nos fios. Todos gostam de tomar banho com a água saindo a 38 °C e, para gastar menos, a família usa em cada mês a posição de menor '
          'potência que consiga essa temperatura. Na estação fria, a água da rua chega ao chuveiro a 24 °C em junho, a 18 °C em julho e a 22 °C em agosto. Em cada mês, '
          'cada pessoa toma um banho por dia, de 10 minutos, e o mês tem 30 dias. A companhia de energia cobra R$ 0,90 por quilowatt-hora (kWh). Considere que 1 litro de água '
          'tem massa de 1 quilograma, que o calor específico da água é 4 200 J/(kg · °C) e que o chuveiro só gasta energia durante os banhos.\n\n'
          'Aumento da temperatura da água (vazão de 3 L por minuto)\nMorno: 8 °C\nQuente: 16 °C\nSuperquente: 24 °C\n\n'
          'Qual é, em reais, o custo de energia desses três meses só com os banhos dessa família?')
assert len(ENUN_A) >= 600, len(ENUN_A)
Q.append(dict(
    id='d2-escada-fis-ita-ele-00a', materia='Física', tema=T, calc=264.6,
    enunciado=ENUN_A,
    dados=[('Tabela do manual', 'aumento: morno 8 °C; quente 16 °C; superquente 24 °C'), ('Vazão', '3 L por minuto'), ('Rendimento', '80% da potência vira calor na água'),
           ('Água da rua', 'junho 24 °C; julho 18 °C; agosto 22 °C'), ('Banho', 'sai a 38 °C'), ('Uso por mês', '4 pessoas, 1 banho por dia de 10 min, 30 dias'),
           ('Preço da energia', 'R$ 0,90 por kWh'), ('Calor específico da água', '4 200 J/(kg · °C)'), ('Tensão da rede', '220 V: não entra na conta')],
    alts=[('R$ 211,68', 211.68, 'Usou o calor que chega à água (80% da potência) no lugar da potência elétrica que o chuveiro puxa da rede'),
          ('R$ 264,60', 264.6, 'OK'),
          ('R$ 294,00', 294, 'Parou nos 294 kWh e não multiplicou pelo preço de R$ 0,90 por kWh'),
          ('R$ 302,40', 302.4, 'Em agosto foi para a superquente, achando que 16 °C "não passa" dos 16 °C que faltam; mas 16 serve'),
          ('R$ 340,20', 340.2, 'Usou a superquente (a de julho, a mais exigente) nos três meses')],
    resumo=('Calor por segundo = 0,05 · 4 200 · aumento; potência elétrica = calor ÷ 0,8: morno 2 100 W, quente 4 200 W, superquente 6 300 W. Junho precisa de 14 °C (quente), '
            'julho de 20 °C (superquente), agosto de 16 °C (quente, 16 serve). Soma 4,2 + 6,3 + 4,2 = 14,7 kW; 20 h por mês: 294 kWh; 294 · 0,90 = R$ 264,60.'),
    ideia=('A tabela dá só o aumento da água: a potência elétrica sai do calor por segundo dividido por 0,8. Em cada mês, a menor posição que sobe a água o necessário '
           'muda com a temperatura de entrada, e o custo vem da potência elétrica dessas posições.'),
    pecas=[('Rendimento', 'Parte da energia que serve ao que se quer. Aqui 80% da potência elétrica vira calor na água, então a potência elétrica é maior que o calor.'),
           ('Quilowatt-hora', 'Energia de um aparelho de 1 kW ligado por 1 hora. É a unidade da conta de luz.')],
    formulas=[('termometro', 'Calor por segundo', 'kg por segundo · 4 200 · aumento'), ('porcentagem', 'Potência elétrica', 'calor por segundo ÷ 0,8'),
              ('circuito', 'Energia da conta', 'kWh = kW · horas')],
    eq='Cus = (Pjun + Pjul + Pago) · Hor · Pre', leitura='custo = soma das potências dos três meses, em kW · horas de banho por mês · preço de 1 kWh',
    letras=[('Cus', 'custo de energia dos três meses, em reais (o que a questão quer)'), ('Pjun', 'potência elétrica da posição usada em junho, em kW'),
            ('Pjul', 'potência elétrica da posição usada em julho, em kW'), ('Pago', 'potência elétrica da posição usada em agosto, em kW'),
            ('Hor', 'horas de banho em cada mês'), ('Pre', 'preço de 1 kWh, em reais')],
    eq_texto='Cada hora ligada, o chuveiro gasta tantos kWh quanto a sua potência em kW. Somando as potências dos três meses e multiplicando pelas horas de cada mês e pelo preço, sai o custo.\nAgora é só achar Hor, Pre, Pjun, Pjul e Pago.',
    achando=[('Achando Hor: as horas de cada mês', 'Cada mês: 4 pessoas · 1 banho por dia · 30 dias = 120 banhos.\n120 banhos de 10 min = 1 200 min. 1 hora tem 60 min: 1 200 ÷ 60 = 20 (pois 60 · 20 = 1 200).\nHor = 20 horas por mês.'),
             ('Achando Pre: o preço do kWh', 'O enunciado dá: Pre = R$ 0,90 por kWh.'),
             ('O calor que a água precisa por segundo',
              'A tabela dá o aumento da água, não a potência. Calor por segundo = kg por segundo · 4 200 · aumento.\n'
              '3 L por minuto = 3 kg em 60 s = 0,05 kg por segundo (pois 60 · 0,05 = 3). 0,05 · 4 200 = 210: 4 200 ÷ 100 = 42 e 42 · 5 = 210.'),
             ('O que o chuveiro puxa da tomada: posição quente',
              'Só 80% do que ele puxa vira calor: puxando 100 W, 80 W viram calor (100 · 0,8). Então puxa o calor ÷ 0,8.\n'
              'Quente (16 °C): calor = 210 · 16 = 3 360 W (210 · 10 = 2 100 e 210 · 6 = 1 260). Puxa 3 360 ÷ 0,8 = 33 600 ÷ 8 = 4 200 W (pois 8 · 4 200 = 33 600).'),
             ('O que o chuveiro puxa nas outras duas posições',
              'Morno (8 °C): 210 · 8 = 1 680 W de calor; 1 680 ÷ 0,8 = 16 800 ÷ 8 = 2 100 W.\n'
              'Superquente (24 °C): 210 · 24 = 5 040 W (210 · 20 = 4 200 e 210 · 4 = 840); 5 040 ÷ 0,8 = 50 400 ÷ 8 = 6 300 W.'),
             ('Achando Pjun: a posição de junho',
              'Em junho a água chega a 24 °C e precisa subir 38 − 24 = 14 °C. O morno sobe 8: é pouco. O quente sobe 16 (16 ≥ 14): é a menor que serve.\n'
              'Pjun = 4 200 W = 4,2 kW (1 kW = 1 000 W).'),
             ('Achando Pjul: a posição de julho',
              'Em julho: 38 − 18 = 20 °C. O quente sobe só 16 (16 < 20): não basta. O superquente sobe 24 (24 ≥ 20): só ele serve.\nPjul = 6 300 W = 6,3 kW.'),
             ('Achando Pago: a posição de agosto',
              'Em agosto: 38 − 22 = 16 °C. O quente sobe exatamente 16: serve (16 ≥ 16, a temperatura é atingida). O morno não.\n'
              'Cuidado: "o quente sobe 16" e "precisam 16" são iguais, e igual serve. Pago = 4 200 W = 4,2 kW.')],
    volta=('Cus = (4,2 + 6,3 + 4,2) · 20 · 0,90.\nSoma: 4,2 + 6,3 = 10,5 e 10,5 + 4,2 = 14,7 kW. 14,7 · 20 = 294 kWh (14 · 20 = 280 e 0,7 · 20 = 14).\n'
           '294 · 0,90 = 264,6 (294 · 9 = 2 646, dividido por 10).\nCus = R$ 264,60.\nResposta: alternativa A.'),
    valores=[('Hor', '20 horas'), ('Pre', 'R$ 0,90 por kWh'), ('Pjun', '4,2 kW'), ('Pjul', '6,3 kW'), ('Pago', '4,2 kW')],
    pista='"tabela com o aumento da água" e "menor posição que atinge" → ache a potência elétrica de cada posição (calor por segundo ÷ 0,8), escolha por mês (igual serve) e multiplique por horas e preço.',
    rec1='tabela 8/16/24 °C; 3 L/min; 80%; entradas 24, 18, 22 °C; 20 h; R$ 0,90', rec3='Hor = 20; Pre = 0,90; Pjun = 4,2; Pjul = 6,3; Pago = 4,2',
    checagem=('Um aparelho de 2 000 W fica ligado 3 horas. Quantos kWh ele gasta?', ['6 kWh', '2 kWh', '6 000 kWh', '0,67 kWh'], '6 kWh', '2 000 W = 2 kW; 2 · 3 = 6 kWh.'),
    ancora=('forte · ENEM 2022 q.111 caderno 5 (= q.116 caderno 7): ducha com três níveis e tabela do aumento de temperatura por vazão; potência escondida na tabela, '
            'L/min para kg por segundo e escolha do nível. Aqui a escolha muda a cada mês e a pergunta é o custo'),
    canal='fis-13-potencia-eletrica-e-efeito-joule.txt [11:48:01] (chuveiro de três posições) e fis-06-calorimetria.txt [5:42:30] (Q = m · c · ΔT)',
    antes=['ele-calor-especifico', 'ele-prefixos', 'porcentagem', 'dividir-por-decimal'],
))


# ============ b) ITA: duas baterias reais em paralelo, potência máxima e tempo ============
E1, R1, E2, R2 = Fr(16), Fr(3, 2), Fr(4), Fr(3)
R_EQ = R1 * R2 / (R1 + R2)
E_EQ = (E1 * R2 + E2 * R1) / (R1 + R2)
assert (E_EQ, R_EQ) == (12, 1) and E_EQ == (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2)
assert (E1 * R2, E2 * R1, E1 * R2 + E2 * R1, R1 + R2) == (48, 6, 54, Fr(9, 2)) and Fr(540, 45) == 12 and 45 * 12 == 540


def pot(e, r, R):
    return R * (e / (R + r)) ** 2


assert pot(E_EQ, R_EQ, Fr(1)) == 36 and pot(E_EQ, R_EQ, Fr(1, 2)) == 32 and pot(E_EQ, R_EQ, Fr(2)) == 32 and pot(E_EQ, R_EQ, Fr(3)) == 27
assert round(float(pot(E_EQ, R_EQ, Fr(4, 5))), 1) == 35.6 and round(float(pot(E_EQ, R_EQ, Fr(5, 4))), 1) == 35.6
assert round(float(E_EQ / (Fr(4, 5) + 1)), 2) == 6.67 and round(float(E_EQ / (Fr(5, 4) + 1)), 2) == 5.33
assert all(pot(E_EQ, R_EQ, Fr(k, 100)) <= 36 for k in range(1, 1001))              # o topo é em R = Rin (varredura)
assert Fr(12, 6) == 2 and 5 * 2 * 2 == 20
I_TOT = E_EQ / (1 + R_EQ)
V_TERM = I_TOT * 1
assert (I_TOT, V_TERM) == (6, 6)
I1, I2 = (E1 - V_TERM) / R1, (E2 - V_TERM) / R2
assert (I1, I2) == (Fr(20, 3), Fr(-2, 3)) and I1 + I2 == I_TOT                      # a bateria de 4 V é carregada
P_TOTAL = E1 * I1 + E2 * I2
assert P_TOTAL == 104 and P_TOTAL - (R1 * I1 ** 2 + R2 * I2 ** 2) == 36
M, DT = Fr(1, 10), 6
Q_AGUA = M * 4200 * DT
assert Q_AGUA == 2520 and Q_AGUA / 36 == 70 and 36 * 70 == 2520
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
          ('72,9', 72.9, 'Casou R com 1,5 Ω, a menor resistência interna, em vez da resistência da bateria única: potência 34,56 W'),
          ('100,8', 100.8, 'Tirou a média simples das fem (10 V) em vez de ponderar pelas resistências: potência 25 W'),
          ('70 000', 70000, 'Usou 100 g como se fossem 100 kg: calor de 2 520 000 J')],
    resumo=('Fem = (16 · 3 + 4 · 1,5) ÷ 4,5 = 12 V e Rin = 1,5 · 3 ÷ 4,5 = 1 Ω; potência máxima com R = Rin = 1 Ω: corrente 6 A, potência 36 W; calor = 0,1 · 4 200 · 6 = 2 520 J; '
            'tempo = 2 520 ÷ 36 = 70 s.'),
    ideia='As duas baterias em paralelo valem uma só, com Fem e Rin equivalentes. A potência no resistor é máxima quando R é igual à Rin, e o tempo é o calor da água dividido por essa potência.',
    pecas=[('Bateria única', 'A bateria que deixa o resistor igual: mesma tensão e mesma corrente nele que as duas em paralelo.'),
           ('Potência máxima no resistor', 'Com R muito pequeno quase não há tensão nele; com R muito grande, quase não há corrente. O topo fica em R = Rin.')],
    formulas=[('circuito', 'Fem da bateria única', '(ε1 · r2 + ε2 · r1) ÷ (r1 + r2)'), ('circuito', 'Rin da bateria única', '(r1 · r2) ÷ (r1 + r2)'),
              ('circuito', 'Potência no resistor', '(R · corrente) · corrente')],
    desenho=('Veja o circuito: duas baterias reais em paralelo, cada uma com a sua resistência interna, e o resistor R mergulhado na água.', 'baterias-paralelo', []),
    eq='Tmp = Cal ÷ Pot', leitura='tempo = calor que a água pede ÷ potência no resistor',
    letras=[('Tmp', 'tempo para a água subir 6 °C, em segundos (o que a questão quer)'), ('Cal', 'calor que a água pede, em joules'), ('Pot', 'maior potência no resistor, em watts'),
            ('Fem', 'força eletromotriz da bateria única, em volts'), ('Rin', 'resistência interna da bateria única, em ohms')],
    eq_texto='O resistor entrega Pot joules por segundo à água. Dividindo o calor que a água pede por Pot, sai o tempo.\nAgora é só achar Cal, Fem, Rin e Pot.',
    achando=[('Achando Cal: o calor da água', '100 g = 0,1 kg. Cal = 0,1 · 4 200 · 6.\n0,1 · 4 200 = 420 e 420 · 6 = 2 520 J.'),
             ('Achando Fem: a bateria única', 'Regra do "Antes": Fem = (ε1 · r2 + ε2 · r1) ÷ (r1 + r2), com ε1 = 16, r1 = 1,5, ε2 = 4 e r2 = 3.\n16 · 3 = 48 e 4 · 1,5 = 6, e 48 + 6 = 54. Embaixo: 1,5 + 3 = 4,5.'),
             ('Achando Fem: a divisão por decimal', '54 ÷ 4,5: multiplico os dois por 10 e a conta não muda: 540 ÷ 45.\n45 · 12 = 540 (45 · 10 = 450 e 45 · 2 = 90). Fem = 12 V.'),
             ('Achando Rin: a resistência da bateria única', 'Rin = (r1 · r2) ÷ (r1 + r2) = (1,5 · 3) ÷ 4,5 = 4,5 ÷ 4,5 = 1 Ω.',
              {'tipo': 'diagrama', 'nome': 'baterias-paralelo', 'rotulos': ['', '', '', '', '', '', 'bateria única: 12 V e 1 Ω']}),
             ('Achando Pot: a corrente e a potência',
              'A bateria única (Fem = 12 V, Rin = 1 Ω) fica em fila com R: as resistências somam, R + 1. Corrente = 12 ÷ (R + 1).\n'
              'Potência em R = (R · corrente) · corrente. Exemplo: R = 5: corrente 12 ÷ 6 = 2 A; (5 · 2) · 2 = 20 W.'),
             ('Achando Pot: o R que dá o máximo',
              'Teste perto de R = 1: R = 0,8: corrente 12 ÷ 1,8 ≈ 6,67 A e potência ≈ 35,6 W. R = 1: corrente 6 A e (1 · 6) · 6 = 36 W. R = 1,25: corrente 12 ÷ 2,25 ≈ 5,33 A e ≈ 35,6 W.\n'
              'Mais longe: R = 0,5 e R = 2 dão 32 W; R = 3 dá 27 W. O topo é em R = Rin = 1 Ω (vale sempre). Pot = 36 W.',
              {'tipo': 'diagrama', 'nome': 'baterias-paralelo', 'rotulos': ['', '', '', '', '', '', 'bateria única: 12 V e 1 Ω', 'R = 1 Ω: potência máxima 36 W']})],
    volta='Tmp = 2 520 ÷ 36 = 70 s (pois 36 · 70 = 2 520: 36 · 7 = 252).\nResposta: alternativa A. Conferindo: com R = 1 Ω, a corrente é 6 A e (1 · 6) · 6 = 36 W.',
    valores=[('Cal', '2 520 J'), ('Fem', '12 V'), ('Rin', '1 Ω'), ('Pot', '36 W')],
    pista='"baterias em paralelo" e "maior potência" → troque as duas por uma bateria única (Fem e Rin), ponha R = Rin para a potência máxima e divida o calor pela potência.',
    rec1='16 V e 1,5 Ω; 4 V e 3 Ω; paralelo; 100 g, 6 °C', rec3='Cal = 2 520; Fem = 12; Rin = 1; Pot = 36',
    checagem=('Bateria de 10 V e Rin = 5 Ω. Qual a potência máxima no resistor?', ['5 W', '10 W', '20 W', '2,5 W'], '5 W', 'R = 5 Ω; corrente = 10 ÷ 10 = 1 A; potência = (5 · 1) · 1 = 5 W.'),
    ancora=('parcial · ITA 2022 2ª fase, Física (a rede é trocada por um gerador equivalente de Thevenin e a potência máxima vem de R = resistência equivalente); '
            'aqui são duas baterias reais em paralelo; ENEM 2022 q.133 caderno 5 fica como toque (bateria com resistência interna)'),
    canal='fora do canal: resistência interna e baterias em paralelo (0 hits); Ohm em fis-12-circuitos-eletricos.txt [10:29:33] e calor em fis-06-calorimetria.txt [5:42:30]',
    antes=['ele-baterias-paralelo', 'ele-potencia-maxima', 'ele-calor-especifico', 'dividir-por-decimal'],
))


# ============ c) Fuvest: protoboard com um resistor em curto E outro em aberto ============
V_F = Fr(18)
RA, RB, RC, RD, RE, RF = Fr(100), Fr(300), Fr(150), Fr(470), Fr(60), Fr(90)     # R1..R6; R3 aberto, R4 em curto
RAMO = RE + RF
PAR = RB * RAMO / (RB + RAMO)
assert (RAMO, PAR) == (150, 100) and RA == Fr(10, 100) * 1000 and RC == Fr(15, 100) * 1000 and RD == Fr(47, 100) * 1000
I_TOTAL = V_F / (RA + PAR)
T_PAR = PAR * I_TOTAL
IC = T_PAR / RAMO
assert (I_TOTAL * 1000, T_PAR, IC * 1000) == (90, 9, 60) and T_PAR / RB * 1000 == 30 and IC + T_PAR / RB == I_TOTAL and Fr(18, 200) == Fr(9, 100)
assert Fr(300 * 150, 450) == 100 and 450 * 100 == 45000 and 150 * Fr(6, 100) == 9
# erros típicos
J_ABERTO = V_F / (RA + 1 / (1 / RB + 1 / RAMO + 1 / RC))                         # R3 ligado em paralelo (não viu o aberto)
assert round(float(J_ABERTO * (1 / (1 / RB + 1 / RAMO + 1 / RC)) / RAMO * 1000), 1) == 45.0
J_CURTO = V_F / (RA + PAR + RD)                                                   # R4 em série (não viu o curto)
assert round(float(J_CURTO * PAR / RAMO * 1000), 1) == 17.9
Q.append(dict(
    id='d2-escada-fis-ita-ele-00c', materia='Física', tema=T, calc=60,
    enunciado=('Numa aula de eletrônica, um aluno monta um circuito numa protoboard, placa em que todos os furos de uma mesma linha estão ligados entre si por dentro e formam um único '
               'ponto do circuito. Os fios de uma fonte contínua de 18 V ocupam as linhas 1 (positivo) e 3 (negativo), e os seis resistores são encaixados como mostra a tabela. '
               'Os fios e a fonte são ideais, e nenhum outro fio ou peça toca a placa.\n\n'
               'Linha 1: fio positivo e uma ponta de R1\n'
               'Linha 2: outra ponta de R1; uma ponta de R2; uma ponta de R3; as duas pontas de R4; uma ponta de R5\n'
               'Linha 3: outra ponta de R2; uma ponta de R6; fio negativo\n'
               'Linha 4: outra ponta de R5; outra ponta de R6\n'
               'Linha 5: outra ponta de R3\n\n'
               'R1 = 0,10 kΩ; R2 = 300 Ω; R3 = 0,15 kΩ; R4 = 0,47 kΩ; R5 = 60 Ω; R6 = 90 Ω.\n\n'
               'Qual é, em miliampères (mA), a corrente que passa pelo resistor R6?'),
    dados=[('Fonte', '18 V (linha 1 positivo, linha 3 negativo)'), ('R1', '0,10 kΩ, entre as linhas 1 e 2'), ('R2', '300 Ω, entre as linhas 2 e 3'),
           ('R3', '0,15 kΩ, da linha 2 à linha 5 (sem mais nada)'), ('R4', '0,47 kΩ, as duas pontas na linha 2'), ('R5 e R6', '60 Ω e 90 Ω, linha 2 a 4 e linha 4 a 3')],
    alts=[('17,9 mA', 17.9, 'Pôs R4 em série (não viu o curto): 100 + 100 + 470 = 670 Ω, corrente total 26,9 mA, tensão 2,69 V no paralelo'),
          ('30 mA', 30, 'Deu a corrente de R2 (9 ÷ 300), não a do ramo de R5 e R6'),
          ('45 mA', 45, 'Pôs R3 em paralelo (não viu que ele está aberto): paralelo de 60 Ω, corrente total 112,5 mA'),
          ('60 mA', 60, 'OK'),
          ('90 mA', 90, 'Deu a corrente total (18 ÷ 200), sem dividir entre R2 e o ramo de R5 e R6')],
    resumo=('R4 em curto (as duas pontas na linha 2) e R3 aberto (ponta solta na linha 5) saem da conta. R5 + R6 = 150 Ω em série; 300 · 150 ÷ 450 = 100 Ω em paralelo com R2; '
            'com R1 = 100 Ω, total 200 Ω; corrente total 18 ÷ 200 = 90 mA; tensão 100 · 0,09 = 9 V; corrente em R6 = 9 ÷ 150 = 60 mA.'),
    ideia='Dois defeitos escondidos na tabela: R4 está em curto e R3 está aberto, e nenhum leva corrente. O resto é R1 em série com R2 em paralelo com o ramo R5 e R6.',
    pecas=[('Linha da protoboard', 'Todos os furos de uma linha estão ligados: valem um ponto só do circuito.'),
           ('Resistor em curto', 'Com as duas pontas no mesmo ponto, não há tensão sobre ele e nenhuma corrente passa.'),
           ('Resistor aberto', 'Com uma ponta num ponto onde mais nada se liga, a corrente não tem para onde ir e nenhuma passa.')],
    formulas=[('circuito', 'Série', 'resistências somam'), ('circuito', 'Dois em paralelo', 'X · Y ÷ (X + Y)'), ('texto', 'Prefixos', '1 kΩ = 1 000 Ω; 1 A = 1 000 mA')],
    desenho=('Veja a protoboard: cada barra é uma linha, e todos os furos de uma linha são um ponto só. A fonte de 18 V está ligada nas linhas 1 e 3.', 'protoboard-curto-aberto', []),
    eq='Ic = Tp ÷ Ram', leitura='corrente em R6 = tensão entre as linhas 2 e 3 ÷ resistência do ramo R5 + R6',
    letras=[('Ic', 'corrente em R6, em mA (o que a questão quer)'), ('Tp', 'tensão entre as linhas 2 e 3, em V'), ('Ram', 'resistência do ramo R5 e R6, em Ω'),
            ('Par', 'resistência de tudo que liga a linha 2 à 3, em Ω'), ('Itot', 'corrente total que sai da fonte, em A')],
    eq_texto='O ramo de R5 e R6 está entre as linhas 2 e 3, e a mesma corrente passa pelos dois. Dividindo a tensão entre essas linhas pela resistência do ramo, sai a corrente.\nAgora é só achar Ram, Par, Itot e Tp.',
    achando=[('Quem sai da conta: R3 e R4', 'Leia a tabela com cuidado. R4 tem as duas pontas na linha 2: o mesmo ponto dos dois lados, sem tensão e sem corrente (curto). '
                                              'R3 tem uma ponta na linha 2 e a outra na linha 5, onde mais nada se liga: a corrente não tem para onde ir (aberto). R3 e R4 saem do circuito.',
              {'tipo': 'diagrama', 'nome': 'protoboard-curto-aberto', 'rotulos': ['', '', '', '', '', '', '', 'R4: curto, sem corrente', 'R3: aberto, sem corrente']}),
             ('Achando Ram: o ramo de R5 e R6', 'R5 liga a linha 2 à 4 e R6 liga a 4 à 3, e nada mais toca a linha 4: estão em fila, mesma corrente, e as resistências somam.\nRam = 60 + 90 = 150 Ω.'),
             ('Achando Par: os dois caminhos', 'Entre as linhas 2 e 3 sobram dois caminhos: R2 = 300 Ω e o ramo de 150 Ω. Em paralelo: 300 · 150 = 45 000 e 300 + 150 = 450.\n45 000 ÷ 450 = 100 (pois 450 · 100 = 45 000). Par = 100 Ω.'),
             ('Achando Itot: a corrente total', 'R1 = 0,10 kΩ = 0,10 · 1 000 = 100 Ω, em fila com o paralelo: 100 + 100 = 200 Ω.\nItot = 18 ÷ 200 = 9 ÷ 100 = 0,09 A (dividi os dois por 2). Em mA: 0,09 · 1 000 = 90 mA.'),
             ('Achando Tp: a tensão entre as linhas 2 e 3', 'Tp = Par · Itot = 100 · 0,09 = 9 V.\nR1 gasta os outros 9 V (100 · 0,09 = 9), e 9 + 9 = 18 V, a fonte.')],
    volta='Ic = 9 ÷ 150 = 0,06 A (pois 150 · 0,06 = 9).\nEm mA: 0,06 · 1 000 = 60 mA.\nResposta: alternativa A. Conferindo: R2 leva 9 ÷ 300 = 0,03 A = 30 mA, e 60 + 30 = 90 mA, a corrente total.',
    valores=[('Ram', '150 Ω'), ('Par', '100 Ω'), ('Itot', '0,09 A = 90 mA'), ('Tp', '9 V')],
    pista='"protoboard" → furos da mesma linha são um ponto só; resistor com as duas pontas na mesma linha (curto) ou com ponta solta (aberto) sai da conta. O resto é série e paralelo; atenção a kΩ e mA.',
    rec1='18 V; R1 100 Ω; R2 300 Ω; R5 e R6 em série; R3 aberto; R4 em curto', rec3='Ram = 150; Par = 100; Itot = 0,09; Tp = 9',
    checagem=('Fonte de 12 V, resistor de 4 Ω e outro de 6 Ω com uma ponta solta (sem ligação). Qual a corrente?', ['3 A', '1,2 A', '2 A', '5 A'], '3 A', 'O de 6 Ω está aberto: não conduz. Fica só 4 Ω; corrente = 12 ÷ 4 = 3 A.'),
    ancora=('forte · Fuvest 2024 1ª fase q.57 (protoboard: os furos de uma linha formam os nós; kΩ e corrente pequena) e ENEM 2019 q.126 caderno 7 '
            '(cabo em série com ramos em paralelo); aqui, além do resistor em curto, outro está aberto e há um ramo em série dentro do paralelo'),
    canal='fis-12-circuitos-eletricos.txt [10:40:01] (série) e [10:42:00] (paralelo); resistor em curto, aberto e protoboard: fora do canal',
    antes=['ele-serie-paralelo', 'ele-prefixos', 'dividir-por-decimal'],
))


# ============ d) Harvard-MIT: cubo de resistores por simetria (reescrita em telas menores, caso numérico I = 6 A) ============
RAR = Fr(12)
I_NUM = Fr(6)
I_1, I_2, I_3 = I_NUM / 3, I_NUM / 3 / 2, (I_NUM / 3 / 2) * 2
assert (I_1, I_2, I_3) == (2, 1, 2) and 3 * I_1 == 6 and 6 * I_2 == 6 and 3 * I_3 == 6
QUEDAS = (RAR * I_1, RAR * I_2, RAR * I_3)
assert QUEDAS == (24, 12, 24) and sum(QUEDAS) == 60
REQ = sum(QUEDAS) / I_NUM
assert REQ == 10 and REQ == Fr(5, 6) * RAR and Fr(1, 3) + Fr(1, 6) + Fr(1, 3) == Fr(5, 6) and I_NUM * RAR == 72
assert (Fr(1, 3) * 72, Fr(1, 6) * 72) == (24, 12) and Fr(1, 3) == Fr(2, 6)
# erros típicos
assert RAR / 3 == 4 and RAR / 2 == 6 and RAR / 3 + RAR / 3 == 8
cubo = lambda *r: ['P', 'Q', *r, 'cada aresta é um resistor de 12 Ω']
Q.append(dict(
    id='d2-escada-fis-ita-ele-00d', materia='Física', tema=T, calc=10,
    enunciado=('Doze resistores iguais, de 12 Ω cada um, formam as arestas de um cubo. Uma bateria é ligada a dois vértices opostos, P e Q, as pontas de uma diagonal do cubo. '
               'A resistência equivalente entre P e Q, em ohms, é:'),
    dados=[('Resistores', '12 resistores de 12 Ω cada'), ('Montagem', 'arestas de um cubo'), ('Bateria', 'nos vértices opostos P e Q')],
    alts=[('4', 4, 'Deu 12 ÷ 3, como se só as três primeiras arestas contassem'),
          ('6', 6, 'Deu 12 ÷ 2, sem raciocínio de simetria'),
          ('8', 8, 'Somou só duas etapas: 4 + 4'),
          ('10', 10, 'OK'),
          ('12', 12, 'Deu a resistência de um resistor só')],
    resumo='Com 6 A saindo de P: 2 A nas 3 primeiras arestas, 1 A nas 6 do meio e 2 A nas 3 últimas; quedas 24 V + 12 V + 24 V = 60 V; Req = 60 ÷ 6 = 10 Ω, que é 5/6 de 12.',
    ideia='Por simetria, a corrente que sai de P se divide em 3 partes iguais, depois em 6, e volta a juntar em 3. Somando as quedas de tensão nas três etapas e dividindo pela corrente total, sai o equivalente.',
    pecas=[('Simetria', 'Se o circuito fica igual depois de girar o cubo, as peças que trocam de lugar levam a mesma corrente.'),
           ('Lei dos nós', 'Num vértice, a corrente que chega é igual à que sai.')],
    formulas=[('circuito', 'Queda de tensão', 'resistência · corrente'), ('circuito', 'Lei dos nós', 'o que chega = o que sai'), ('circuito', 'Resistência equivalente', 'Req = tensão ÷ corrente total')],
    desenho=('Cada traço do cubo é um resistor de 12 Ω. A bateria liga P e Q, as pontas de uma diagonal.', 'cubo-resistores', cubo('', '', '')),
    eq='Req = Fra · Rar', leitura='equivalente = fração · resistência de uma aresta',
    letras=[('Req', 'resistência equivalente entre P e Q, em ohms (o que a questão quer)'), ('Fra', 'fração de Rar que a simetria do cubo dá'), ('Rar', 'resistência de cada aresta, em ohms')],
    eq_texto='Em três etapas a corrente passa por arestas iguais. A soma das três quedas de tensão, dividida pela corrente total, dá o equivalente, que é uma fração de Rar.\nAgora é só achar Rar e Fra.',
    achando=[('Achando Rar: a aresta', 'O enunciado dá: Rar = 12 Ω.'),
             ('Achando Fra: as 3 primeiras arestas', 'Finja que 6 A saem de P (a fração não depende desse valor). Gire o cubo em volta da diagonal P-Q: as 3 arestas que saem de P trocam de lugar e o cubo fica idêntico. '
                                                  'Por isso levam a mesma corrente: 6 ÷ 3 = 2 A em cada.',
              {'tipo': 'diagrama', 'nome': 'cubo-resistores', 'rotulos': cubo('saem de P: 2 A em cada', '', '')}),
             ('Achando Fra: as 6 arestas do meio', 'Cada vizinho de P recebe 2 A e tem 2 arestas saindo. Espelhe o cubo: as duas trocam de lugar, então levam a mesma corrente. Cada uma leva 2 ÷ 2 = 1 A (são 6 arestas).',
              {'tipo': 'diagrama', 'nome': 'cubo-resistores', 'rotulos': cubo('saem de P: 2 A em cada', 'no meio: 1 A em cada', '')}),
             ('Achando Fra: chegando em Q', 'Num vértice, o que chega é o que sai (a eletricidade não some nem aparece). Cada vizinho de Q recebe 1 A + 1 A = 2 A, e a última aresta leva esses 2 A a Q. '
                                          'São 3 arestas com 2 A: 2 + 2 + 2 = 6 A, o total.',
              {'tipo': 'diagrama', 'nome': 'cubo-resistores', 'rotulos': cubo('saem de P: 2 A em cada', 'no meio: 1 A em cada', 'chegam em Q: 2 A em cada')}),
             ('Achando Fra: as quedas, com números', 'Queda = resistência · corrente. 1ª etapa: 12 · 2 = 24 V. Meio: 12 · 1 = 12 V. Última: 12 · 2 = 24 V.\n'
                                                   'De P a Q por um caminho, as quedas somam: 24 + 12 + 24 = 60 V. Req = 60 ÷ 6 = 10 Ω.'),
             ('Achando Fra: as quedas como fração (1 de 2)', 'Sem números: as correntes são 1/3, 1/6 e 1/3 da total I, e cada queda é essa fração de I · Rar. '
                                                           'Confira com o caso: I · Rar = 6 · 12 = 72 V; 1/3 de 72 = 24 V e 1/6 de 72 = 12 V, igual às quedas de cima.'),
             ('Achando Fra: somando as frações (2 de 2)', 'Para somar, o mesmo número embaixo: 1/3 = 2/6. Soma: 2/6 + 1/6 + 2/6 = 5/6 (lê-se "cinco sextos").\n'
                                                        'A tensão é 5/6 de I · Rar; dividindo pela corrente I, Req = (5/6) · Rar. Então Fra = 5/6.')],
    volta='Req = (5/6) · 12: 12 ÷ 6 = 2 e 2 · 5 = 10 Ω. Confere com o caso numérico: 60 ÷ 6 = 10 Ω.\nResposta: alternativa A.',
    valores=[('Rar', '12 Ω'), ('Fra', '5/6')],
    pista='"resistores iguais nas arestas de um cubo" → por simetria a corrente se divide em 1/3, 1/6 e 1/3; some as quedas e divida pela corrente total.',
    rec1='12 resistores de 12 Ω; cubo; bateria nas pontas da diagonal', rec3='Rar = 12; Fra = 5/6',
    checagem=('Cubo de resistores de 6 Ω cada, ligado pela diagonal. Qual o equivalente?', ['5 Ω', '6 Ω', '4 Ω', '3 Ω'], '5 Ω', '(5/6) · 6 = 5 Ω.'),
    ancora=('sem · técnica: simetria do circuito (pontos de mesmo potencial e divisão igual da corrente), clássico de olimpíada; '
            'não há real de Física de Harvard-MIT nem cubo de resistores no corpus legível'),
    canal='fora do canal: resistores em cubo (0 hits); série e paralelo em fis-12-circuitos-eletricos.txt [10:40:01]',
    antes=['fracoes', 'ele-nos-simetria'],
))

for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), (_q['id'], [len(v) for _, v in _q['dados']])
