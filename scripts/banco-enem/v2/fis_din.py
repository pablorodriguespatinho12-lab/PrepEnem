"""Nível acima v2 de Física: Dinâmica e Leis de Newton (23/11/2026, revisado 24/11 depois do aluno-do-zero).

a = ENEM (elevador em 3 fases lido no painel), b = ITA (sobe, para e volta com atrito),
c = Fuvest (bloco sobre prancha, teste de escorregamento), d = Harvard-MIT (pêndulo com pino, resposta sem o comprimento).
Nenhuma das 4 antigas fica (a, b, d REESCREVER; c TROCAR). Conferido por assert no próprio módulo.
Letras da equação: abreviações próprias (nunca A a E, nem unidade). Conteúdo que as aulas Antes antigas não cobrem: ANTES_NOVOS (ids din-*).
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_din
"""
import math

ARQUIVO = 'fisica-acima-novas.json'
T = 'Dinâmica e Leis de Newton'
G = 10

Q = []
MANTER = {}


def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


# ============ Aulas "Antes" novas (cada uma: linhas até 170 letras e 2 exercícios com a certa na 1ª linha da resolução) ============
ANTES_NOVOS = {
    'din-kmh': {
        'titulo': 'De km/h para m/s',
        'linhas': [
            '1 km são 1 000 m e 1 hora são 3 600 s. Então 1 km/h = 1 000 ÷ 3 600 m/s = 1 ÷ 3,6 m/s.',
            'Para passar de km/h para m/s, divida por 3,6. Exemplo: 36 km/h ÷ 3,6 = 10 m/s.',
            'Com vírgula: 21,6 ÷ 3,6 = 216 ÷ 36 = 6. Multiplicar os dois por 10 não muda o resultado.',
            'Ao contrário, de m/s para km/h, multiplique por 3,6: 10 m/s · 3,6 = 36 km/h.',
        ],
        'visual': tabela('Três velocidades', ['km/h', 'Conta', 'm/s'], [['36', '36 ÷ 3,6', '10'], ['72', '72 ÷ 3,6 = 720 ÷ 36', '20'], ['21,6', '21,6 ÷ 3,6 = 216 ÷ 36', '6']]),
        'exercicios': [
            {'enunciado': 'Um carro anda a 72 km/h. Quantos m/s são?', 'alternativas': ['20 m/s', '259,2 m/s', '7,2 m/s', '75,6 m/s'], 'certa': 0,
             'resolucao': '20 m/s: 72 ÷ 3,6 = 720 ÷ 36 = 20.\n259,2 é multiplicar por 3,6; 7,2 é dividir por 10; 75,6 é somar.'},
            {'enunciado': 'Um elevador sobe a 10,8 km/h. Quantos m/s são?', 'alternativas': ['3 m/s', '38,9 m/s', '1,08 m/s', '7,2 m/s'], 'certa': 0,
             'resolucao': '3 m/s: 10,8 ÷ 3,6 = 108 ÷ 36 = 3.\n38,9 é multiplicar por 3,6; 1,08 é dividir por 10; 7,2 é subtrair.'},
        ],
    },
    'din-peso-chao': {
        'titulo': 'Peso, força do chão e balança',
        'linhas': [
            'Peso é a força com que a Terra puxa: peso = massa · 10. A unidade de força é o newton (N). Pessoa de 60 kg: 60 · 10 = 600 N.',
            'Parada no chão, a pessoa não cai: o chão empurra para cima com a mesma força, 600 N. A balança mede esse empurrão.',
            'A balança de banheiro mostra em kg: empurrão ÷ 10. Então 600 ÷ 10 = 60 kg.',
            'Se a força que sobra é massa · aceleração, então aceleração = força que sobra ÷ massa.',
            'Elevador subindo com 2 m/s²: sobra 60 · 2 = 120 N. O chão empurra 600 + 120 = 720 N e a balança mostra 72 kg.',
        ],
        'visual': tabela('Pessoa de 60 kg na balança', ['Situação', 'Empurrão do chão', 'Balança'], [['Parada', '600 N', '60 kg'], ['Sobe acelerando 2 m/s²', '600 + 120 = 720 N', '72 kg']]),
        'exercicios': [
            {'enunciado': 'Uma pessoa de 50 kg está parada numa balança (g = 10). Quanto vale o peso dela?', 'alternativas': ['500 N', '50 N', '5 N', '60 N'], 'certa': 0,
             'resolucao': '500 N: 50 · 10 = 500.\n50 N é só a massa; 5 N é dividir por 10; 60 N é somar.'},
            {'enunciado': 'A mesma pessoa está num elevador que acelera 2 m/s² para cima. Quanto o chão empurra?', 'alternativas': ['600 N', '500 N', '100 N', '400 N'], 'certa': 0,
             'resolucao': '600 N: sobram 50 · 2 = 100 N e 500 + 100 = 600.\n500 N é a pessoa parada; 100 N é só o que sobra; 400 N é subtrair.'},
        ],
    },
    'din-sinal': {
        'titulo': 'Aceleração com sinal de menos',
        'linhas': [
            'Aceleração positiva: a velocidade aumenta. Aceleração negativa (sinal −): a velocidade diminui, o corpo está freando.',
            'Elevador sobe a 6 m/s e para em 2 s: a = (0 − 6) ÷ 2 = −3 m/s². O sinal − só diz "está freando".',
            'Subtrair um negativo é somar: 2 − (−3) = 2 + 3 = 5. E 10 + (−3) = 10 − 3 = 7.',
            'Na balança do elevador, o chão empurra massa · (10 + aceleração). Freando, 10 + (−3) = 7: o empurrão cai.',
        ],
        'visual': tabela('Contas com sinal', ['Conta', 'Passo', 'Resultado'], [['2 − (−3)', '2 + 3', '5'], ['10 + (−3)', '10 − 3', '7'], ['(0 − 6) ÷ 2', '−6 ÷ 2', '−3']]),
        'exercicios': [
            {'enunciado': 'Um carro vai de 20 m/s a 0 em 4 s. Qual é a aceleração?', 'alternativas': ['−5 m/s²', '5 m/s²', '−80 m/s²', '0 m/s²'], 'certa': 0,
             'resolucao': '−5 m/s²: (0 − 20) ÷ 4 = −5. O sinal − diz que está freando.\n5 esquece o sinal; −80 multiplica; 0 não houve mudança.'},
            {'enunciado': 'Quanto é 7 − (−2)?', 'alternativas': ['9', '5', '−9', '−5'], 'certa': 0,
             'resolucao': '9: subtrair um negativo é somar, 7 + 2 = 9.\n5 é 7 − 2; −9 e −5 trocam o sinal.'},
        ],
    },
    'din-atrito': {
        'titulo': 'Atrito: μ, estático e cinético',
        'linhas': [
            'Atrito é a força que segura uma superfície contra a outra. Atrito máximo = μ · força que aperta (μ lê-se "mi": é o coeficiente de atrito).',
            'Em chão plano, a força que aperta é o peso. Bloco de 1 kg com μ = 0,4: aperta com 10 N e o atrito máximo é 0,4 · 10 = 4 N.',
            'Estático: o bloco está parado em relação à superfície. O atrito vale só o que for preciso, até o máximo (4 N).',
            'Cinético: o bloco escorrega. O atrito vale sempre o máximo (4 N). Nos problemas, o estático e o cinético têm o mesmo μ.',
            'Teste: se o atrito pedido passa do máximo, o bloco escorrega. Pedir 6 N com máximo de 4 N: escorrega.',
        ],
        'visual': tabela('Bloco de 1 kg, μ = 0,4', ['Atrito pedido', 'Máximo', 'Resultado'], [['3 N', '4 N', 'não escorrega'], ['6 N', '4 N', 'escorrega']]),
        'exercicios': [
            {'enunciado': 'Bloco de 2 kg em chão plano, μ = 0,5 (g = 10). Qual é o atrito máximo?', 'alternativas': ['10 N', '1 N', '20 N', '5 N'], 'certa': 0,
             'resolucao': '10 N: aperta com 2 · 10 = 20 N e 0,5 · 20 = 10.\n1 N é 0,5 · 2; 20 N é só o peso; 5 N é 0,5 · 10.'},
            {'enunciado': 'O atrito pedido é 3 N e o máximo é 4 N. O bloco escorrega?', 'alternativas': ['Não: 3 N cabe nos 4 N', 'Sim: 3 N cabe nos 4 N', 'Sim: 4 N é maior que 3 N', 'Não: 4 N é maior que 7 N'], 'certa': 0,
             'resolucao': 'Não: o atrito pedido (3 N) é menor que o máximo (4 N) e o atrito dá conta.\nSó escorrega se o pedido passar do máximo.'},
        ],
    },
    'din-acao-reacao': {
        'titulo': 'Ação e reação',
        'linhas': [
            'Se o bloco 1 empurra o bloco 2 com 4 N, o bloco 2 empurra o bloco 1 com 4 N, no sentido contrário.',
            'As duas forças têm o mesmo valor e agem em corpos diferentes. Por isso não se anulam.',
            'Bloco sobre prancha: o atrito do bloco na prancha é 4 N para trás; o da prancha no bloco é 4 N para frente.',
            'Ao somar as forças de um corpo, use só as forças que agem nele.',
        ],
        'visual': tabela('Bloco sobre prancha', ['Quem faz', 'Em quem', 'Força'], [['Prancha', 'bloco', '4 N para frente'], ['Bloco', 'prancha', '4 N para trás']]),
        'exercicios': [
            {'enunciado': 'O bloco empurra a prancha para trás com 4 N. Que força a prancha faz no bloco?', 'alternativas': ['4 N para frente', '4 N para trás', '0 N', '8 N para frente'], 'certa': 0,
             'resolucao': '4 N para frente: o mesmo valor, no sentido contrário.\n4 N para trás seria o mesmo sentido; 0 e 8 N erram o valor.'},
            {'enunciado': 'Uma prancha é puxada para frente com 30 N e o bloco sobre ela a puxa para trás com 4 N. Qual é a força total nela?', 'alternativas': ['26 N para frente', '34 N para frente', '30 N para frente', '4 N para trás'], 'certa': 0,
             'resolucao': '26 N para frente: 30 − 4 = 26.\n34 N soma em vez de subtrair; 30 N esquece o bloco; 4 N para trás esquece o puxão.'},
        ],
    },
    'din-seno-rampa': {
        'titulo': 'Rampa: seno e cosseno pelas medidas',
        'linhas': [
            'Numa rampa, seno = altura ÷ comprimento da rampa. Sobe 3 m a cada 5 m de rampa: seno = 3 ÷ 5 = 0,6.',
            'O terceiro lado vem de Pitágoras: 3 · 3 + x · x = 5 · 5. Então 9 + x · x = 25, x · x = 16 e x = 4.',
            'Cosseno = lado de baixo ÷ comprimento da rampa = 4 ÷ 5 = 0,8.',
            'O seno é a parte do peso que puxa ao longo da rampa; o cosseno, a que aperta. Peso de 20 N: puxa 0,6 · 20 = 12 N e aperta 0,8 · 20 = 16 N.',
        ],
        'visual': tabela('Rampa 3, 4, 5', ['Lado', 'Medida', 'Razão'], [['Altura', '3 m', 'seno = 3 ÷ 5 = 0,6'], ['Embaixo', '4 m', 'cosseno = 4 ÷ 5 = 0,8'], ['Rampa', '5 m', '—']]),
        'exercicios': [
            {'enunciado': 'Uma rampa de 5 m sobe 4 m. Quanto vale o seno?', 'alternativas': ['0,8', '0,6', '1,25', '0,2'], 'certa': 0,
             'resolucao': '0,8: 4 ÷ 5 = 0,8.\n0,6 seria o cosseno; 1,25 é 5 ÷ 4; 0,2 erra a divisão.'},
            {'enunciado': 'Uma rampa de 13 m sobe 5 m. Quanto mede o lado de baixo?', 'alternativas': ['12 m', '8 m', '18 m', '144 m'], 'certa': 0,
             'resolucao': '12 m: 5 · 5 + x · x = 13 · 13, ou 25 + x · x = 169, x · x = 144 e x = 12.\n8 é subtrair; 18 é somar; 144 esquece a raiz.'},
        ],
    },
    'din-torricelli': {
        'titulo': 'Freando até parar: v · v = 2 · a · d',
        'linhas': [
            'Carro a 12 m/s freia com 3 m/s² até parar. Perde 3 a cada segundo: 12 ÷ 3 = 4 s.',
            'A média é (12 + 0) ÷ 2 = 6 m/s. Distância = média · tempo = 6 · 4 = 24 m.',
            'Confira: 12 · 12 = 144 e 2 · 3 · 24 = 144. Então, até parar: v inicial · v inicial = 2 · a · d.',
            'Sem calcular o tempo: d = 144 ÷ (2 · 3) = 144 ÷ 6 = 24 m.',
            'Vale também ao contrário (sai parado até v): v · v = 2 · a · d. Cair 20 m com a = 10: v · v = 2 · 10 · 20 = 400, então v = 20 m/s.',
        ],
        'visual': tabela('Carro a 12 m/s, a = 3', ['Passo', 'Conta', 'Valor'], [['Tempo', '12 ÷ 3', '4 s'], ['Distância', '6 · 4', '24 m'], ['Confere', '2 · 3 · 24', '144 = 12 · 12']]),
        'exercicios': [
            {'enunciado': 'Uma moto a 20 m/s freia com 5 m/s² até parar. Qual a distância?', 'alternativas': ['40 m', '80 m', '4 m', '100 m'], 'certa': 0,
             'resolucao': '40 m: 20 · 20 = 400 = 2 · 5 · d = 10 · d, então d = 400 ÷ 10 = 40.\n80 esquece o 2; 4 é o tempo; 100 é 20 · 5.'},
            {'enunciado': 'Um carro sai do repouso com 2 m/s² e anda 25 m. Quanto vale v · v no fim?', 'alternativas': ['100', '50', '25', '12,5'], 'certa': 0,
             'resolucao': '100: v · v = 2 · 2 · 25 = 100.\n50 esquece o 2; 25 é só a distância; 12,5 divide em vez de multiplicar.'},
        ],
    },
    'din-distancia-tempo': {
        'titulo': 'Saindo do repouso: distância e tempo',
        'linhas': [
            'Sai do repouso com a = 2 m/s². Em 3 s a velocidade é 2 · 3 = 6 m/s. A média é (0 + 6) ÷ 2 = 3 m/s.',
            'Distância = média · tempo = 3 · 3 = 9 m. Em letras: d = a · t · t ÷ 2. Teste: 2 · 3 · 3 ÷ 2 = 9.',
            'Ao contrário, para o tempo: t · t = 2 · d ÷ a. Teste: 2 · 9 ÷ 2 = 9, e t = 3, pois 3 · 3 = 9.',
            'Raiz quadrada (√) é o número que vezes ele mesmo dá aquilo: √9 = 3 e √1 = 1.',
        ],
        'visual': tabela('a = 2 m/s², sai do repouso', ['Tempo', 'Velocidade', 'Distância'], [['1 s', '2 m/s', '1 m'], ['2 s', '4 m/s', '4 m'], ['3 s', '6 m/s', '9 m']]),
        'exercicios': [
            {'enunciado': 'Sai do repouso com 2 m/s² e anda 16 m. Quanto tempo leva?', 'alternativas': ['4 s', '8 s', '2 s', '16 s'], 'certa': 0,
             'resolucao': '4 s: t · t = 2 · 16 ÷ 2 = 16, e √16 = 4.\n8 esquece a raiz da metade; 2 e 16 trocam as contas.'},
            {'enunciado': 'Sai do repouso com 4 m/s² por 5 s. Quanto anda?', 'alternativas': ['50 m', '100 m', '20 m', '25 m'], 'certa': 0,
             'resolucao': '50 m: 4 · 5 · 5 ÷ 2 = 100 ÷ 2 = 50.\n100 esquece o ÷ 2; 20 é 4 · 5; 25 é só o 5 · 5.'},
        ],
    },
    'din-topo': {
        'titulo': 'No topo do círculo: tração mais peso',
        'linhas': [
            'Pedra presa a um fio, girando em círculo. No ponto mais alto, o fio puxa a pedra para baixo (para o centro) e o peso também puxa para baixo.',
            'As duas forças somam e fazem a força da curva: tração + peso = massa · v · v ÷ raio.',
            'Exemplo: 1 kg, v · v = 10, raio 0,5 m. Força da curva = 1 · 10 ÷ 0,5 = 20 N. Peso = 10 N. Tração = 20 − 10 = 10 N.',
            'Dividir por 0,5 é multiplicar por 2, pois cabem 2 meios em cada 1: 10 ÷ 0,5 = 20.',
            'O fio só fica esticado se a força da curva for pelo menos o peso. Aqui 20 N ≥ 10 N: esticado.',
        ],
        'visual': tabela('Topo do círculo', ['Passo', 'Conta', 'Valor'], [['Força da curva', '1 · 10 ÷ 0,5', '20 N'], ['Peso', '1 · 10', '10 N'], ['Tração', '20 − 10', '10 N']]),
        'exercicios': [
            {'enunciado': 'Esfera de 2 kg, v · v = 8, raio 0,4 m (g = 10). Qual a tração no topo?', 'alternativas': ['20 N', '40 N', '60 N', '0 N'], 'certa': 0,
             'resolucao': '20 N: força da curva = 2 · 8 ÷ 0,4 = 40 N; peso = 20 N; 40 − 20 = 20.\n40 esquece o peso; 60 soma o peso.'},
            {'enunciado': 'Esfera de 1 kg no topo com v · v = 2 e raio 0,5 m (g = 10). O fio fica esticado?', 'alternativas': ['Não: a força da curva (4 N) é menor que o peso (10 N)', 'Sim: a força da curva (4 N) é menor que o peso (10 N)', 'Sim: a tração é 14 N', 'Não: a tração é 6 N'], 'certa': 0,
             'resolucao': 'Não: a força da curva é 1 · 2 ÷ 0,5 = 4 N, menor que o peso, 10 N. O fio afrouxa.\nPara ficar esticado, teria de ser pelo menos 10 N.'},
        ],
    },
    'din-fracao-de-l': {
        'titulo': 'Fração de um comprimento e letra que corta',
        'linhas': [
            'Fração é divisão: 4/5 = 4 ÷ 5 = 0,8. E 0,8 L quer dizer 0,8 vezes L: se L = 10 m, 0,8 L = 8 m.',
            'Letra igual em cima e embaixo corta: L ÷ L = 1. Com L = 10: 24 · 10 ÷ (0,2 · 10) = 240 ÷ 2 = 120.',
            'Com L = 5: 24 · 5 ÷ (0,2 · 5) = 120 ÷ 1 = 120. O resultado não depende de L.',
            'Dividir por 0,2: cabem 5 vezes 0,2 em cada 1, então ÷ 0,2 é · 5. 24 ÷ 0,2 = 24 · 5 = 120.',
        ],
        'visual': tabela('24 L ÷ 0,2 L', ['L', 'Conta', 'Resultado'], [['10 m', '240 ÷ 2', '120'], ['5 m', '120 ÷ 1', '120'], ['1 m', '24 ÷ 0,2', '120']]),
        'exercicios': [
            {'enunciado': 'Quanto é 3/4 de um fio de 20 m?', 'alternativas': ['15 m', '5 m', '60 m', '23 m'], 'certa': 0,
             'resolucao': '15 m: 3 ÷ 4 = 0,75 e 0,75 · 20 = 15.\n5 m é 1/4; 60 é 3 · 20; 23 é somar.'},
            {'enunciado': 'Quanto é 6 · L ÷ (0,5 · L)?', 'alternativas': ['12', '3', '6', '0,5'], 'certa': 0,
             'resolucao': '12: o L corta e 6 ÷ 0,5 = 6 · 2 = 12.\n3 divide por 2; 6 esquece o 0,5; 0,5 é só o divisor.'},
        ],
    },
}
for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('din-') and len(_c['exercicios']) == 2, _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas'] if len(l) > 170])
    for _e in _c['exercicios']:
        assert len(set(_e['alternativas'])) == len(_e['alternativas']) and _e['alternativas'][_e['certa']].split(' ')[0] in _e['resolucao'].split('\n')[0], (_id, _e['enunciado'])
# contas das aulas novas
assert 72 / 3.6 == 20 and round(10.8 / 3.6, 9) == 3 and 21.6 / 3.6 - 6 < 1e-12
assert 2 * 5 * 40 == 20 ** 2 and 2 * 2 * 25 == 100 and 12 ** 2 == 2 * 3 * 24 and 2 * 10 * 20 == 20 ** 2
assert 5 ** 2 + 12 ** 2 == 13 ** 2 and 4 / 5 == 0.8 and 3 * 0.75 * 20 / 3 == 15 and 6 / 0.5 == 12
assert 2 * 8 / 0.4 - 20 == 20 and 1 * 2 / 0.5 == 4 < 10 and 1 * 10 / 0.5 - 10 == 10
assert math.sqrt(2 * 16 / 2) == 4 and 4 * 5 * 5 / 2 == 50 and 50 + 2 * 25 / 25 == 52


# ============ a) ENEM: elevador em 3 fases, leitura da balança em kg ============
def leitura(m, a):
    return m * (G + a) / G  # kg: força do chão (N) dividida por g


MASSA = 52 + 8
V_MS = 21.6 / 3.6
assert abs(V_MS - 6) < 1e-9
A1 = V_MS / 3
A3 = (0 - V_MS) / 2
assert (A1, A3) == (2, -3)
L1, L2, L3 = leitura(MASSA, A1), leitura(MASSA, 0), leitura(MASSA, A3)
assert (L1, L2, L3) == (72, 60, 42) and max(L1, L2, L3) - min(L1, L2, L3) == 30
assert MASSA * G + MASSA * A1 == 720 and MASSA * G + MASSA * A3 == 420 and MASSA * (A1 - A3) / G == 30 and 2 - (-3) == 5
# erros típicos
assert L1 - L2 == 12                                              # só subida acelerada contra constante
assert leitura(52, A1) - leitura(52, A3) == 26                    # esqueceu a mochila (52 kg): 62,4 - 36,4
assert abs(leitura(MASSA, 21.6 / 3) - leitura(MASSA, -21.6 / 2) - 108) < 1e-9  # 21,6 sem converter: a = 7,2 e -10,8
assert (L1 - L3) * G == 300                                       # em newtons
Q.append(dict(
    id='d2-escada-fis-ita-din-00a', materia='Física', tema=T, calc=30,
    enunciado=('Em um prédio comercial, um técnico sobe de elevador até o último andar para consertar um aparelho. Ele pesa 52 kg e carrega nas costas '
               'uma mochila de ferramentas de 8 kg. Para entender o que sente na viagem, coloca uma balança de banheiro no chão do elevador, sobe nela '
               'com a mochila e filma o visor, que mostra a leitura em kg, como se a gravidade valesse 10 m/s². Ao mesmo tempo, anota a velocidade do '
               'elevador, lida no painel em km/h, em quatro instantes: em 0 s, 0 km/h; em 3 s, 21,6 km/h; em 10 s, 21,6 km/h; em 12 s, 0 km/h. '
               'Entre dois instantes seguidos a velocidade varia de modo uniforme, e o elevador só sobe. Depois, ele compara a maior leitura da balança '
               'com a menor leitura durante a viagem. Qual é a diferença, em kg, entre a maior e a menor leitura mostradas?'),
    dados=[('Técnico', '52 kg'), ('Mochila (nas costas dele)', '8 kg'), ('Painel: 0 s, 3 s, 10 s, 12 s', '0; 21,6; 21,6; 0 km/h'), ('Gravidade da balança', '10 m/s²')],
    alts=[('12', 12, 'Comparou só a subida acelerada com a velocidade constante: 72 − 60'),
          ('26', 26, 'Esqueceu a mochila e usou 52 kg: 62,4 − 36,4'),
          ('30', 30, 'OK'),
          ('108', 108, 'Usou 21,6 sem passar para m/s: aceleração 7,2 e −10,8'),
          ('300', 300, 'Deu a diferença em newtons, sem dividir por 10')],
    resumo='Massa 60 kg; 21,6 km/h = 6 m/s; aceleração +2 (0 a 3 s), 0 e −3 (10 a 12 s); leituras 72, 60 e 42 kg; 72 − 42 = 30 kg.',
    ideia='A balança mostra o empurrão do chão dividido por 10. Acelerando para cima ela mostra mais que a massa; freando enquanto sobe, mostra menos.',
    pecas=[('Leitura da balança', 'O empurrão do chão dividido por 10. Parado ou em velocidade constante, mostra a massa; acelerando para cima, mostra mais.')],
    formulas=[('carro', 'km/h para m/s', 'm/s = km/h ÷ 3,6'), ('carro', 'Aceleração', 'aceleração = (v final − v inicial) ÷ tempo'),
              ('carro', 'Leitura da balança', 'kg = massa · (10 + aceleração) ÷ 10')],
    origem=['Antes você viu: parado, o chão empurra com o peso; acelerando para cima, empurra o peso mais massa · aceleração. Ou seja, empurrão = massa · (10 + aceleração).',
            'A balança mostra o empurrão ÷ 10. Freando enquanto sobe, a aceleração é negativa: 10 + (−3) = 7, menor que 10, e a leitura cai abaixo da massa.'],
    eq='dif = arr − fre', leitura='diferença = leitura da arrancada − leitura da freada',
    letras=[('dif', 'diferença entre a maior e a menor leitura, em kg (o que a questão quer)'), ('arr', 'leitura na arrancada (0 a 3 s), em kg'), ('fre', 'leitura na freada (10 a 12 s), em kg')],
    eq_texto='A leitura mais alta é a da arrancada e a mais baixa é a da freada. Entre 3 s e 10 s a velocidade é constante e a leitura fica no meio.\nAgora é só achar arr e fre.',
    achando=[('Achando arr: a leitura na arrancada',
              'Massa na balança: 52 + 8 = 60 kg. Peso: 60 · 10 = 600 N. 21,6 km/h ÷ 3,6 = 6 m/s.\nDe 0 a 3 s: aceleração = 6 ÷ 3 = 2 m/s². Sobra 60 · 2 = 120 N, e o chão empurra 600 + 120 = 720 N.\narr = 720 ÷ 10 = 72 kg.'),
             ('Achando fre: a leitura na freada',
              'De 10 a 12 s a velocidade vai de 6 a 0: aceleração = (0 − 6) ÷ 2 = −3 m/s². O sinal − diz que freia.\nO chão empurra 600 + 60 · (−3) = 600 − 180 = 420 N. fre = 420 ÷ 10 = 42 kg.')],
    volta='dif = 72 − 42 = 30 kg.\nResposta: alternativa A. Conferindo: 2 − (−3) = 2 + 3 = 5, e 60 · 5 ÷ 10 = 30 kg.',
    valores=[('arr', '72 kg'), ('fre', '42 kg')],
    pista='"balança no elevador" com velocidade em tabela → ache a aceleração de cada trecho (variação da velocidade ÷ tempo), use empurrão = massa · (10 + aceleração) e divida por 10 no fim.',
    rec1='60 kg no total; 0, 21,6, 21,6, 0 km/h em 0, 3, 10, 12 s', rec3='arr = 72 kg; fre = 42 kg',
    checagem=('Uma pessoa de 50 kg está num elevador que acelera 2 m/s² para cima (g = 10). Quanto a balança mostra?', ['60 kg', '40 kg', '50 kg', '600 kg'], '60 kg',
              'Empurrão = 50 · (10 + 2) = 600 N; 600 ÷ 10 = 60 kg.'),
    ancora='parcial · ENEM 2023 q.114 (carga no caminhão: 2ª lei com aceleração e duas situações, arrancada e freada; aqui três fases lidas num painel)',
    canal='fis-02-leis-de-newton.txt [1:12:00] (elevador acelerando para cima; a balança mede a normal)',
    antes=['aceleracao', 'din-kmh', 'din-peso-chao', 'din-sinal'],
))

# ============ b) ITA: sobe, para e volta com atrito ============
M, V0, MU = 2, 12, 0.45
SEN, COS = 3 / 5, math.sqrt(1 - (3 / 5) ** 2)
assert abs(COS - 0.8) < 1e-12 and 3 ** 2 + 4 ** 2 == 5 ** 2
PUXA, APERTA = M * G * SEN, M * G * COS
ATRITO = MU * APERTA
assert (round(PUXA, 9), round(APERTA, 9), round(ATRITO, 9)) == (12, 16, 7.2) and 45 * 16 == 720
S_SUBE = (PUXA + ATRITO) / M
D_SUBE = V0 ** 2 / (2 * S_SUBE)
assert (round(S_SUBE, 9), round(D_SUBE, 9)) == (9.6, 7.5)
assert 2 * 9.6 == 19.2 and 1440 / 192 == 7.5 and 192 * 7 == 1344 and 1440 - 1344 == 96 == 192 / 2
assert SEN / COS > MU and PUXA > ATRITO                      # tan 0,75 > 0,45: desce
R_DESCE = (PUXA - ATRITO) / M
V_VOLTA = math.sqrt(2 * R_DESCE * D_SUBE)
assert round(R_DESCE, 9) == 2.4 and abs(V_VOLTA - 6) < 1e-9
assert round(2 * 2.4, 9) == 4.8 and round(4.8 * 7, 9) == 33.6 and round(4.8 * 0.5, 9) == 2.4 and round(33.6 + 2.4, 9) == 36
assert round(6 / R_DESCE, 9) == 2.5 and 3 * 2.5 == D_SUBE           # confere: 6 ÷ 2,4 = 2,5 s; média 3 m/s
# erros típicos
assert abs(math.sqrt(2 * (PUXA / M) * D_SUBE) - math.sqrt(90)) < 1e-9 and round(math.sqrt(90), 1) == 9.5  # sem atrito na descida
d_sem = V0 ** 2 / (2 * (PUXA / M))                                                                       # sem atrito na subida
assert d_sem == 12 and round(math.sqrt(2 * R_DESCE * d_sem), 1) == 7.6
Q.append(dict(
    id='d2-escada-fis-ita-din-00b', materia='Física', tema=T, calc=6,
    enunciado=('Uma rampa fixa sobe 3 m de altura a cada 5 m percorridos ao longo dela. Um bloco de 2 kg é lançado da base da rampa, para cima, com velocidade de '
               '12 m/s. O coeficiente de atrito μ entre o bloco e a rampa vale 0,45, tanto o estático quanto o cinético. Adote g = 10 m/s². '
               'O módulo da velocidade do bloco ao voltar à base da rampa, em m/s, é:'),
    dados=[('Massa', '2 kg'), ('Velocidade de lançamento', '12 m/s'), ('Rampa', '3 m de altura a cada 5 m de rampa'),
           ('Atrito μ (estático = cinético)', '0,45'), ('Gravidade', '10 m/s²')],
    alts=[('0', 0, 'Achou que o bloco para na subida e fica parado, sem testar se ele desce'),
          ('6', 6, 'OK'),
          ('7,6', 7.5895, 'Esqueceu o atrito na subida (distância 12 m) e só o usou na descida'),
          ('9,5', 9.4868, 'Usou a distância certa (7,5 m), mas esqueceu o atrito na descida'),
          ('12', 12, 'Voltou igual, como se não houvesse atrito (ou deixou o atrito freando também na descida)')],
    resumo='seno 0,6 e cosseno 0,8; subida: (12 + 7,2) ÷ 2 = 9,6 m/s², distância 144 ÷ 19,2 = 7,5 m; desce (12 > 7,2): (12 − 7,2) ÷ 2 = 2,4 m/s²; v · v = 2 · 2,4 · 7,5 = 36.',
    ideia='O bloco só desce se a parte do peso que puxa vencer o atrito. Se descer, o atrito troca de sentido: freava a subida e agora segura a descida, e a volta é mais lenta.',
    pecas=[('Atrito troca de lado', 'O atrito sempre se opõe ao movimento: na subida aponta rampa abaixo; na descida, rampa acima.')],
    formulas=[('triangulo-retangulo', 'Seno e cosseno da rampa', 'seno = altura ÷ rampa; cosseno = embaixo ÷ rampa'), ('caixa', 'Atrito máximo', 'atrito = μ · força que aperta'),
              ('carro', 'Até parar', 'v · v = 2 · aceleração · distância')],
    desenho=('A rampa sobe 3 m a cada 5 m. O bloco de 2 kg sai da base, rampa acima, a 12 m/s.', 'rampa-com-forcas', []),
    eq='vol = √(2 · des · dis)', leitura='velocidade na volta = raiz de (2 · aceleração na descida · distância percorrida)',
    letras=[('vol', 'velocidade ao voltar à base, em m/s (o que a questão quer)'), ('des', 'aceleração do bloco na descida, em m/s²'),
            ('dis', 'distância que ele sobe, em m'), ('sub', 'desaceleração na subida, em m/s² (entra na conta de dis)')],
    eq_texto='Na volta o bloco parte do repouso lá em cima e desce a mesma distância dis, com a aceleração des da descida. É a regra v · v = 2 · a · d da aula Antes.\nAgora é só achar sub, dis e des.',
    achando=[('Achando sub: a desaceleração na subida',
              'Seno = 3 ÷ 5 = 0,6; cosseno = 4 ÷ 5 = 0,8. Peso: 2 · 10 = 20 N.\nPuxa rampa abaixo: 0,6 · 20 = 12 N. Aperta: 0,8 · 20 = 16 N. Atrito: 0,45 · 16 = 7,2 N (45 · 16 = 720, 2 casas).\nSubindo, os dois freiam: 12 + 7,2 = 19,2 N. sub = 19,2 ÷ 2 = 9,6 m/s².',
              {'tipo': 'diagrama', 'nome': 'rampa-com-forcas', 'rotulos': ['', '', '', '', 'peso 20 N', 'aperta 16 N', 'puxa 12 N', 'atrito 7,2 N']}),
             ('Achando dis: a distância que ele sobe',
              'Sobe até parar: 12 · 12 = 144 = 2 · 9,6 · dis. Como 2 · 9,6 = 19,2, temos 144 = 19,2 · dis.\ndis = 144 ÷ 19,2. Multiplicando os dois por 10: 1 440 ÷ 192.\n192 · 7 = 1 344; sobram 96, a metade de 192. Então dis = 7,5 m.'),
             ('Achando des: a aceleração na descida',
              'Desce? Só se o que puxa (12 N) vencer o atrito máximo (7,2 N). 12 > 7,2: desce.\nAgora o atrito segura, rampa acima: 12 − 7,2 = 4,8 N. des = 4,8 ÷ 2 = 2,4 m/s² (aceleração = força ÷ massa).')],
    volta='vol · vol = 2 · 2,4 · 7,5 = 4,8 · 7,5. Como 4,8 · 7 = 33,6 e 4,8 · 0,5 = 2,4, dá 36. vol = √36 = 6 m/s.\nResposta: alternativa A. Conferindo: na descida, 6 ÷ 2,4 = 2,5 s, média 3 m/s, e 3 · 2,5 = 7,5 m.',
    valores=[('sub', '9,6 m/s²'), ('dis', '7,5 m'), ('des', '2,4 m/s²')],
    pista='"sobe, para e volta" com atrito → faça a subida com peso e atrito juntos; teste se ele desce (parte do peso > atrito); na descida o atrito troca de lado.',
    rec1='2 kg, 12 m/s, rampa 3-4-5, atrito 0,45', rec3='sub = 9,6; dis = 7,5; des = 2,4',
    checagem=('Um bloco de 1 kg está numa rampa com seno 0,6 e cosseno 0,8; o atrito μ é 0,9. Ele desce sozinho? (g = 10)', ['Não: 6 N < 7,2 N', 'Sim: 6 N > 7,2 N', 'Sim: 8 N > 5,4 N', 'Não: 8 N < 9 N'], 'Não: 6 N < 7,2 N',
              'Puxa: 0,6 · 10 = 6 N. Atrito máximo: 0,9 · 0,8 · 10 = 7,2 N. 6 < 7,2: fica parado.'),
    ancora='parcial · ITA 2025 2ª fase q.3 (atrito mais plano inclinado e 2ª lei com o atrito mudando de papel) e ITA 2021 q.2 (separar força de energia)',
    canal='fora do canal: plano inclinado (0 hits em fis-02 e fis-03); atrito em fis-02-leis-de-newton.txt [1:35:30]',
    antes=['din-seno-rampa', 'seno-cosseno', 'pitagoras', 'din-atrito', 'din-torricelli', 'din-peso-chao'],
))

# ============ c) Fuvest: bloco sobre prancha, teste de escorregamento ============
MA, MB, F, LP = 1, 4, 30, 1.25
MU_AB = 0.40  # borracha e madeira (da tabela)
juntos = F / (MA + MB)
assert juntos == 6 and MA * juntos > MU_AB * MA * G         # 6 N pedidos > 4 N possíveis: escorrega
PA = MU_AB * MA * G / MA
QB = (F - MU_AB * MA * G) / MB
RR = QB - PA
assert (PA, QB, RR) == (4, 6.5, 2.5) and 26 / 4 == 6.5 and 6 * 4 + 2 == 26
TEMPO = math.sqrt(2 * LP / RR)
assert abs(TEMPO - 1) < 1e-12 and 2 * LP / RR == 1
assert 2 * 3 * 3 / 2 == 9 and 3 - 1 == 2 and 2 * 3 * 3 / 2 == 9   # exemplo da origem: relativa 2 em 3 s dá 9 m
# erros típicos
assert round(math.sqrt(2 * LP / (juntos - PA)), 1) == 1.1                  # usou 6 juntos menos 4
assert round(math.sqrt(2 * LP / ((F / MB) - PA)), 2) == 0.85              # esqueceu o atrito em 2
assert round(math.sqrt(LP / RR), 1) == 0.7                                # esqueceu o ½
assert round(math.sqrt(2 * LP / QB), 1) == 0.6                            # tratou o bloco como parado no chão
Q.append(dict(
    id='d2-escada-fis-ita-din-00c', materia='Física', tema=T, calc=1,
    enunciado=('Num laboratório, uma prancha 2 de madeira, com 4 kg e 1,25 m de comprimento, está sobre uma mesa horizontal sem atrito. Sobre a extremidade dianteira '
               'da prancha repousa um bloco pequeno 1, de borracha, com 1 kg. A tabela traz os coeficientes de atrito medidos no laboratório, iguais para o estático e o cinético.\n\n'
               'Borracha e madeira: 0,40\nBorracha e aço: 0,60\nMadeira e aço: 0,20\nMadeira e madeira: 0,50\n\n'
               'No instante t = 0, uma força horizontal constante de 30 N passa a puxar a prancha para frente, e o bloco, que parte do repouso, pode ou não '
               'escorregar sobre ela. Adote g = 10 m/s². Quanto tempo, em segundos, o bloco leva para cair pela extremidade traseira da prancha?'),
    dados=[('Bloco 1 (borracha)', '1 kg'), ('Prancha 2 (madeira)', '4 kg, 1,25 m'), ('Força na prancha 2', '30 N, para frente'), ('Mesa', 'sem atrito'), ('Gravidade', '10 m/s²')],
    alts=[('0,6', 0.62, 'Tratou o bloco 1 como parado no chão: só a aceleração da prancha 2 (6,5)'),
          ('0,7', 0.7071, 'Esqueceu o ½ da distância: usou d = a · t · t'),
          ('0,85', 0.8452, 'Esqueceu o atrito sobre a prancha 2: aceleração dela 30 ÷ 4 = 7,5'),
          ('1,0', 1, 'OK'),
          ('1,1', 1.118, 'Supôs os dois juntos (6) e subtraiu a do bloco (4): relativa 2, não 2,5')],
    resumo='Juntos: 30 ÷ 5 = 6; o bloco precisaria de 6 N e o atrito dá no máximo 4 N, então escorrega. Bloco 1: 4 m/s²; prancha 2: (30 − 4) ÷ 4 = 6,5 m/s²; relativa 2,5; tem = √(2 · 1,25 ÷ 2,5) = 1 s.',
    ideia='Primeiro teste se os dois andam juntos: o atrito máximo (4 N) não segura o bloco, que escorrega. O atrito age nos dois, em sentidos opostos, e o bloco fica para trás.',
    pecas=[('Aceleração relativa', 'Quanto a prancha ganha do bloco a cada segundo: aceleração da prancha 2 menos a do bloco 1.')],
    formulas=[('caixa', 'Atrito máximo', 'atrito = μ · massa · 10'), ('carro', 'Aceleração', 'aceleração = força que sobra ÷ massa'), ('carro', 'Distância a partir do repouso', 'd = a · t · t ÷ 2')],
    origem=['Aceleração relativa: se a prancha acelera 3 m/s² e o bloco 1 m/s², a prancha ganha 3 − 1 = 2 m/s² do bloco. Em 3 s, a diferença de posição é 2 · 3 · 3 ÷ 2 = 9 m.',
            'Aqui é o contrário: a diferença de posição é o comprimento da prancha, e queremos o tempo. Pela aula Antes, tem · tem = 2 · cmp ÷ rel, com tem o tempo, cmp o comprimento da prancha e rel a aceleração relativa.'],
    desenho=('O bloco de 1 kg está na ponta da frente da prancha de 4 kg. Puxam a prancha com 30 N; a mesa não tem atrito.', 'bloco-sobre-prancha', []),
    eq='tem = √(2 · cmp ÷ rel)', leitura='tempo = raiz de (2 · distância relativa ÷ aceleração relativa)',
    letras=[('tem', 'tempo até o bloco cair, em s (o que a questão quer)'), ('cmp', 'distância que o bloco anda para trás em relação à prancha, em m'),
            ('rel', 'aceleração da prancha menos a do bloco, em m/s²'), ('bl', 'aceleração do bloco 1, em m/s²'), ('pr', 'aceleração da prancha 2, em m/s²')],
    eq_texto='Em relação à prancha, o bloco parte do repouso e anda para trás o comprimento cmp com a aceleração rel.\nAgora é só achar bl, pr, rel e cmp.',
    achando=[('Achando bl: a aceleração do bloco 1',
              'O bloco é de borracha e a prancha é de madeira: vale a linha "borracha e madeira", μ = 0,40. As outras 3 linhas não entram.\nSe andassem juntos: massa 1 + 4 = 5 kg, aceleração 30 ÷ 5 = 6 m/s², e o bloco pediria 1 · 6 = 6 N de atrito. Máximo: 0,40 · (1 · 10) = 4 N. 6 > 4: escorrega, com atrito de 4 N. bl = 4 ÷ 1 = 4 m/s².'),
             ('Achando pr: a aceleração da prancha 2',
              'Na prancha: 30 N para frente. O bloco a empurra para trás com 4 N (ação e reação, aula Antes). Sobra 30 − 4 = 26 N.\npr = 26 ÷ 4 = 6,5 m/s² (4 · 6 = 24, e os 2 N que sobram são a metade de 4).'),
             ('Achando rel: a aceleração relativa',
              'A cada segundo a prancha ganha do bloco: rel = 6,5 − 4 = 2,5 m/s².',
              {'tipo': 'diagrama', 'nome': 'bloco-sobre-prancha', 'rotulos': ['', '', '', '', '', 'bloco 1: 4 m/s²', 'prancha 2: 6,5 m/s²', 'atrito 4 N']}),
             ('Achando cmp: quanto o bloco anda em relação à prancha',
              'O bloco começa na ponta da frente. Para cair pela ponta de trás, anda para trás o comprimento todo da prancha.\ncmp = 1,25 m.')],
    volta='tem · tem = 2 · 1,25 ÷ 2,5 = 2,5 ÷ 2,5 = 1. Então tem = √1 = 1 s.\nResposta: alternativa A. Conferindo: em 1 s, a prancha anda 6,5 ÷ 2 = 3,25 m, o bloco anda 4 ÷ 2 = 2 m, e 3,25 − 2 = 1,25 m.',
    valores=[('bl', '4 m/s²'), ('pr', '6,5 m/s²'), ('rel', '2,5 m/s²'), ('cmp', '1,25 m')],
    pista='"bloco sobre prancha" e força numa só → teste se andam juntos (atrito pedido × atrito máximo); se escorrega, atrito nos dois, em sentidos opostos.',
    rec1='Bloco 1 kg, prancha 4 kg, 30 N na prancha, μ = 0,40, 1,25 m', rec3='bl = 4; pr = 6,5; rel = 2,5; cmp = 1,25',
    checagem=('Um bloco de 2 kg está sobre uma prancha, com μ = 0,5 entre eles (g = 10). Qual a maior aceleração que o atrito pode dar ao bloco?', ['5 m/s²', '10 m/s²', '1 m/s²', '2,5 m/s²'], '5 m/s²',
              'Atrito máximo: 0,5 · 2 · 10 = 10 N. Aceleração = 10 ÷ 2 = 5 m/s².'),
    ancora='forte · Fuvest 2021 2ª fase dia 2 F06 (atrito estático como único agente que acelera a caixa; limite μ·g e teste de escorregar)',
    canal='fora do canal: bloco sobre prancha (0 hits); atrito estático e cinético em fis-02-leis-de-newton.txt [1:35:30]',
    antes=['din-atrito', 'din-acao-reacao', 'din-distancia-tempo', 'din-peso-chao', 'aceleracao'],
))

# ============ d) Harvard-MIT: pêndulo com pino, resposta que não depende de L ============
def tracao_topo(L, m=2, d_pino=0.8):
    r = L - d_pino * L                          # raio depois do pino
    queda = d_pino * L - r                      # do nível da fixação ao topo da volta pequena
    w = 2 * G * queda                           # v · v no topo
    assert w >= G * r                           # o fio não afrouxa
    return m * w / r - m * G


for L in (1, 1.25, 3, 7.3, 10, 5):
    assert abs(tracao_topo(L) - 100) < 1e-9     # invariante: 5 · m · g, qualquer que seja L
assert abs(24 * 10 / (0.2 * 10) - 120) < 1e-9 and abs(24 * 5 / (0.2 * 5) - 120) < 1e-9 and 24 / 0.2 == 24 * 5
assert abs(12 * 10 - 2 * 10 * 0.6 * 10) < 1e-9 and abs(0.8 - 0.2 - 0.6) < 1e-12
assert 3 * 2 * G == 60                                                   # r = L: 3 · m · g
assert round(2 * (2 * G * 0.6) / 0.2) == 120                             # esqueceu o peso
assert round(2 * (2 * G * 0.6) / 0.2 + 2 * G) == 140                     # somou o peso em vez de subtrair
assert round(2 * (2 * G * 0.6) / 0.8 - 2 * G) == 10                      # raio 0,8 L (distância ao pino)
Q.append(dict(
    id='d2-escada-fis-ita-din-00d', materia='Física', tema=T, calc=100,
    enunciado=('Uma esfera de 2 kg está presa a um fio ideal de comprimento L, que o problema não informa, e é solta do repouso com o fio esticado na horizontal. '
               'Um pino fixo está na mesma vertical do ponto de fixação do fio, a 4/5 de L abaixo dele. Quando o fio fica vertical, encosta no pino, e a esfera '
               'passa a girar em torno do pino. Despreze as resistências e adote g = 10 m/s². A tração no fio quando a esfera passa pelo ponto mais alto '
               'dessa nova circunferência, em newtons, é:'),
    dados=[('Massa', '2 kg'), ('Comprimento do fio', 'L (não informado)'), ('Pino', '4/5 de L abaixo da fixação'), ('Saída', 'repouso, fio horizontal'), ('Gravidade', '10 m/s²')],
    alts=[('10', 10, 'Usou como raio a distância até o pino (0,8 L) em vez de L − 0,8 L'),
          ('60', 60, 'Ignorou o pino e deu a tração do ponto mais baixo: 3 · m · g'),
          ('100', 100, 'OK'),
          ('120', 120, 'Esqueceu de tirar o peso: deu só m · v · v ÷ raio'),
          ('140', 140, 'Somou o peso em vez de subtrair, no topo')],
    resumo='raio = 0,2 L; queda até o topo = 0,6 L; v · v = 12 L; tração = 2 · 12 L ÷ 0,2 L − 20 = 120 − 20 = 100 N (5 · m · g, sem depender de L).',
    ideia='Depois do pino o raio é só o pedaço de fio que sobrou, e o topo da volta pequena fica mais baixo que o ponto de fixação. O comprimento L aparece em cima e embaixo da conta e some.',
    pecas=[('Raio muda no pino', 'A esfera passa a girar em torno do pino, então o raio é o pedaço de fio que passou do pino: L − 0,8 L.')],
    formulas=[('carro', 'v · v depois da queda', 'vv = 2 · 10 · queda'), ('circulo', 'Força da curva no topo', 'tração + peso = massa · vv ÷ raio')],
    origem=['No topo, tração + peso = massa · vv ÷ raio (aula Antes), onde vv é v · v. O peso é 2 · 10 = 20 N.',
            'Por isso tra = 2 · vv ÷ rai − 20, com tra a tração no topo, vv o v · v e rai o raio em torno do pino.'],
    desenho=('A esfera de 2 kg sai do repouso com o fio na horizontal. O pino fica a 4/5 de L abaixo da fixação.', 'pendulo-com-pino', []),
    eq='tra = 2 · vv ÷ rai − 20', leitura='tração = massa · v · v ÷ raio − peso',
    letras=[('tra', 'tração no fio no ponto mais alto, em N (o que a questão quer)'), ('vv', 'velocidade vezes ela mesma (v · v) no ponto mais alto, em m²/s²'),
            ('rai', 'raio da circunferência em torno do pino, em m')],
    eq_texto='No topo, a tração mais o peso fazem a força da curva. O L não foi dado: vamos deixar L na conta e ver se ele some.\nAgora é só achar rai e vv.',
    achando=[('Achando rai: o raio em torno do pino',
              '4/5 = 4 ÷ 5 = 0,8: o pino está a 0,8 L da fixação (se L = 10 m, a 8 m). O fio todo tem L, então passa do pino um pedaço de L − 0,8 L = 0,2 L.\nrai = 0,2 L.',
              {'tipo': 'diagrama', 'nome': 'pendulo-com-pino', 'rotulos': ['', '', '', '', '', 'raio = 0,2 L', '']}),
             ('Achando vv: v · v no ponto mais alto',
              'O pino está 0,8 L abaixo da fixação. O topo fica rai = 0,2 L acima do pino: 0,8 L − 0,2 L = 0,6 L abaixo da fixação.\nQueda: 0,6 L. vv = 2 · 10 · 0,6 L = 12 L.\nO fio fica esticado? vv = 12 L é maior que 10 · rai = 2 L: sim.',
              {'tipo': 'diagrama', 'nome': 'pendulo-com-pino', 'rotulos': ['', '', '', '', '', 'raio = 0,2 L', 'queda = 0,6 L']})],
    volta='tra = 2 · 12 L ÷ 0,2 L − 20 = 24 L ÷ 0,2 L − 20. L ÷ L = 1, o L corta. 24 ÷ 0,2 = 24 · 5 = 120.\ntra = 120 − 20 = 100 N.\nResposta: alternativa A. Conferindo com L = 1 m: vv = 12, rai = 0,2, e 2 · 12 ÷ 0,2 − 20 = 100.',
    valores=[('rai', '0,2 L'), ('vv', '12 L')],
    pista='"fio que encosta num pino" → o raio novo é o fio que sobrou; ache a queda até o topo da volta nova; se o L não é dado, ele vai se cortar.',
    rec1='2 kg; fio L; pino a 4/5 de L; solta na horizontal', rec3='rai = 0,2 L; vv = 12 L',
    checagem=('Uma esfera de 1 kg gira numa circunferência de raio 0,5 m e passa no topo com v · v = 10 (g = 10). Qual a tração no topo?', ['10 N', '30 N', '20 N', '0 N'], '10 N',
              'Tração + 10 = 1 · 10 ÷ 0,5 = 20, então a tração é 20 − 10 = 10 N.'),
    ancora='parcial · ENEM 2022 q.112 CD7 (energia + centrípeta, tração sem precisar do comprimento) e IME 2025 q.3 (fio que encosta na barra: o raio muda)',
    canal='fis-03-movimento-circular.txt [2:02:31] (a tensão do fio faz o papel de força centrípeta)',
    antes=['din-fracao-de-l', 'din-torricelli', 'din-topo', 'din-peso-chao', 'curva'],
))

# letras das equações: abreviações próprias, nunca A a E, nunca repetidas dentro da questão
for _q in Q:
    _ls = [l for l, _ in _q['letras']]
    assert len(set(_ls)) == len(_ls) and not any(l in 'ABCDE' or l in ('m', 's', 't', 'N', 'F', 'D') for l in _ls), _q['id']
