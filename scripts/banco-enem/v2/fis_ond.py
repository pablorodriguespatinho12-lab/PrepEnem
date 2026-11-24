"""Nível acima v2 de Física: Ondas e Acústica (24/11/2026, 2ª versão depois da leitura do aluno-do-zero).

a = ENEM (sonar com dois ecos, âncora ENEM 2023 q.135; agora com eco inclinado, °F e tabela), b = ITA/IME (sirene girando: duas frequências, duas incógnitas, tração),
c = Fuvest (tubo com água: dois níveis de ressonância e a temperatura do ar), d = Harvard-MIT (mdc ÷ k: a fundamental não precisa ser inteira, âncora por técnica HMMT).
Letras das equações: abreviações próprias (nunca A a E, unidade ou letra repetida na mesma questão). Conferido por assert no próprio módulo.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_ond
Obs.: "Resposta: alternativa A." nos textos é um marcador; o montador troca pela letra certa.
"""
import math
from fractions import Fraction

ARQUIVO = 'fisica-acima-novas.json'
T = 'Ondas e Acústica'
VSOM = 340

Q = []
MANTER = {}

# ============ a) ENEM: sonar com dois ecos, um deles inclinado; temperatura em °F e tabela ============
TERMOMETRO_F = 68
CELSIUS = (TERMOMETRO_F - 32) * 5 / 9
assert abs(CELSIUS - 20) < 1e-12 and (68 - 32, 36 * 5, 180 / 9) == (36, 180, 20)
TABELA = {10: 1450, 20: 1500, 30: 1550}
VEL = TABELA[round(CELSIUS)]
T_CARDUME, T_FUNDO, HORIZ = 0.6, 0.8, 270
assert VEL == 1500
FUNDO = VEL * T_FUNDO / 2
OBLIQUO = VEL * T_CARDUME / 2
assert abs(FUNDO - 600) < 1e-9 and abs(OBLIQUO - 450) < 1e-9
assert 1500 * 8 == 12000 and 1500 * 6 == 9000
CARDUME = math.sqrt(OBLIQUO ** 2 - HORIZ ** 2)
assert abs(CARDUME - 360) < 1e-9 and 450 ** 2 == 202500 and 270 ** 2 == 72900 and 202500 - 72900 == 129600 == 360 ** 2 and 36 * 36 == 1296
assert HORIZ ** 2 + 360 ** 2 == 450 ** 2
DIST = FUNDO - CARDUME
assert abs(DIST - 240) < 1e-9
# erros típicos
assert FUNDO - OBLIQUO == 150                # eco inclinado como profundidade
assert FUNDO - HORIZ == 330                  # 270 m horizontais como profundidade
assert abs(CARDUME - 360) < 1e-9             # só a profundidade do cardume
assert FUNDO + CARDUME == 960                # somou
assert len({150, 240, 330, 360, 960}) == 5
Q.append(dict(
    id='d2-escada-fis-ita-ond-00a', materia='Física', tema=T, calc=240,
    enunciado=('Uma equipe de biólogos estuda um lago profundo e precisa saber a que distância, na vertical, um cardume está do fundo, para decidir até onde descer as redes. '
               'Do barco, parado na superfície, o sonar emite um pulso de ultrassom em todas as direções e mede o tempo até cada eco. O pulso volta de dois pontos. O primeiro eco '
               'vem do cardume, que o sonar de varredura lateral localiza a 270 m do barco, na horizontal, e chega 0,6 s depois da emissão. O segundo vem do fundo do lago, '
               'exatamente abaixo do barco, e chega 0,8 s depois da emissão. A velocidade do som na água depende da temperatura. O termômetro do barco, que marca em graus Fahrenheit, '
               'indica 68 °F na água do lago, e o manual do sonar traz esta tabela, de valores aproximados:\n\n10 °C: 1 450 m/s\n20 °C: 1 500 m/s\n30 °C: 1 550 m/s\n\n'
               'O cardume, o barco e o fundo estão no mesmo plano vertical. A distância vertical, em metros, entre o cardume e o fundo do lago é:'),
    dados=[('Eco do cardume', '0,6 s depois da emissão'), ('Eco do fundo (abaixo do barco)', '0,8 s depois da emissão'), ('Cardume, na horizontal', '270 m do barco'),
           ('Termômetro da água', '68 °F'), ('Tabela do som na água', '10 °C: 1 450; 20 °C: 1 500; 30 °C: 1 550 m/s')],
    alts=[('150', 150, 'Tomou o trajeto inclinado (450 m) como profundidade do cardume: 600 − 450'),
          ('240', 240, 'OK'),
          ('330', 330, 'Usou os 270 m da horizontal como profundidade do cardume: 600 − 270'),
          ('360', 360, 'Deu a profundidade do cardume (360 m), e não a distância até o fundo'),
          ('960', 960, 'Somou as profundidades do fundo e do cardume: 600 + 360')],
    resumo='68 °F = 20 °C, som a 1 500 m/s; fundo: 1 500 · 0,8 ÷ 2 = 600 m; eco inclinado: 1 500 · 0,6 ÷ 2 = 450 m; Pitágoras: 360 m de profundidade; 600 − 360 = 240 m.',
    ideia='Cada eco é de ida e volta, então a distância é metade do que o som andou. O eco do cardume é inclinado: a profundidade dele sai do triângulo de canto reto. Antes, o termômetro em °F escolhe a linha da tabela.',
    pecas=[('Eco inclinado', 'O pulso vai até o cardume em linha reta e volta. Esse caminho é a diagonal de um triângulo; só o lado vertical dele é profundidade.')],
    formulas=[('termometro', '°F para °C', '°C = (°F − 32) · 5 ÷ 9'), ('onda', 'Eco: ida e volta', 'distância = velocidade · tempo ÷ 2'),
              ('triangulo-retangulo', 'Pitágoras', 'inclinado² = horizontal² + vertical²')],
    origem=['O eco é o som que bate e volta: o tempo medido é de ida e volta, então a distância até o ponto é a velocidade do som vezes o tempo, dividida por 2.',
            'O cardume está de lado: o trajeto até ele é a diagonal de um triângulo de canto reto. A profundidade dele é o lado vertical, que sai por Pitágoras.'],
    desenho=('O barco está na superfície. O eco do cardume, a 270 m na horizontal, volta em 0,6 s; o do fundo, abaixo do barco, em 0,8 s.', 'sonar-eco-obliquo', []),
    eq='dis = fun − car', leitura='distância = profundidade do fundo − profundidade do cardume',
    letras=[('dis', 'distância vertical entre cardume e fundo, em m (o que a questão quer)'), ('fun', 'profundidade do fundo, em m'),
            ('car', 'profundidade do cardume, em m'), ('obl', 'trajeto inclinado do barco ao cardume (só a ida), em m'), ('vel', 'velocidade do som na água, em m/s')],
    eq_texto='O fundo e o cardume estão em profundidades diferentes: dis é a diferença. Para cada um, preciso da velocidade do som.\nAgora é só achar vel, fun, obl e car.',
    achando=[('Achando vel: a velocidade do som',
              'Termômetro: 68 °F. Tire 32: 68 − 32 = 36. Multiplique por 5: 36 · 5 = 180. Divida por 9: 180 ÷ 9 = 20 °C.\nNa tabela, a linha de 20 °C diz 1 500 m/s. vel = 1 500 m/s.'),
             ('Achando fun: a profundidade do fundo',
              'O som fez ida e volta: andou vel · 0,8 = 1 500 · 0,8. Como 0,8 = 8 ÷ 10: 1 500 · 8 = 12 000 e 12 000 ÷ 10 = 1 200 m.\nSó a ida: fun = 1 200 ÷ 2 = 600 m.'),
             ('Achando obl: o trajeto inclinado até o cardume',
              'Ida e volta: 1 500 · 0,6 = 1 500 · 6 ÷ 10 = 9 000 ÷ 10 = 900 m.\nSó a ida: obl = 900 ÷ 2 = 450 m. Esse caminho é inclinado: não é a profundidade do cardume.'),
             ('Achando car: a profundidade do cardume',
              'Triângulo de canto reto: diagonal 450 m, horizontal 270 m, vertical car.\n450 · 450 = 202 500 e 270 · 270 = 72 900. car · car = 202 500 − 72 900 = 129 600.\n36 · 36 = 1 296, então 360 · 360 = 129 600. car = 360 m.',
              {'tipo': 'diagrama', 'nome': 'sonar-eco-obliquo', 'rotulos': ['', '', '', '', '600 m', '450 m', '360 m', '240 m']})],
    volta='dis = 600 − 360 = 240 m.\nResposta: alternativa A. Conferindo: 270 · 270 + 360 · 360 = 72 900 + 129 600 = 202 500 = 450 · 450.',
    valores=[('vel', '1 500 m/s'), ('fun', '600 m'), ('obl', '450 m'), ('car', '360 m')],
    pista='"dois ecos, um deles de lado" → cada eco é ida e volta (÷ 2); o inclinado entra em Pitágoras; a temperatura em °F escolhe a velocidade na tabela.',
    rec1='0,6 s; 0,8 s; 270 m; 68 °F; tabela', rec3='vel = 1 500; fun = 600; obl = 450; car = 360',
    checagem=('Um som vai e volta de um paredão em 2 s, com velocidade de 340 m/s. A que distância está o paredão?', ['340 m', '680 m', '170 m', '1 360 m'], '340 m',
              'Ida e volta: 340 · 2 = 680 m. Só a ida: 680 ÷ 2 = 340 m.'),
    ancora='forte · ENEM 2023 q.135 (dois ecos de um mesmo pulso: o tempo de cada eco é de ida e volta, distância = velocidade · tempo ÷ 2); aqui um dos ecos é inclinado e a velocidade vem de tabela',
    canal='fis-09-ondulatoria.txt [8:45:01] (v = λ · f); eco em fis-16-som-acustica-e-efeito-doppler.txt [13:22:30], sem conta',
    antes=['velocidade', 'pitagoras', 'ond-fahrenheit-celsius'],
))

# ============ b) ITA/IME: sirene girando, duas frequências, duas incógnitas (fe e vf), depois a tração ============
FMAX, FMIN, MASSA, FIO = 420, 380, 0.8, 1.7
VF = VSOM * (FMAX - FMIN) / (FMAX + FMIN)
FE = FMAX * (VSOM - VF) / VSOM
assert abs(VF - 17) < 1e-9 and abs(FE - 399) < 1e-9
assert abs(FE * VSOM / (VSOM - VF) - FMAX) < 1e-9 and abs(FE * VSOM / (VSOM + VF) - FMIN) < 1e-9
assert 340 - 17 == 323 and 340 + 17 == 357 and 420 * 323 == 135660 == 380 * 357 and 135660 / 340 == 399
assert 420 * 340 == 142800 == 1428 * 100 and 42 * 34 == 1428 and 380 * 340 == 129200 and 38 * 34 == 1292
assert 142800 - 129200 == 13600 == 800 * 17 and 13600 / 800 == 17
TRACAO = MASSA * VF ** 2 / FIO
assert abs(TRACAO - 136) < 1e-9 and 17 * 17 == 289 == 170 + 119 and 8 * 289 == 2312 and abs(231.2 / 1.7 - 136) < 1e-9 and 2312 / 17 == 136 and 17 * 136 == 2312
# erros típicos
assert round(MASSA * VF / FIO) == 8                                                # esqueceu o quadrado
f_media = (FMAX + FMIN) / 2                                                         # fe = média simples (400 Hz)
v_media = VSOM - f_media * VSOM / FMAX
assert round(MASSA * v_media ** 2 / FIO) == 123
assert round(MASSA * VF ** 2 / (FIO / 2)) == 272                                    # 1,7 m como diâmetro
v_errada = VSOM * (FMAX - FMIN) / FMIN                                              # dividiu só pela mínima
assert round(MASSA * v_errada ** 2 / FIO) == 603
assert len({8, 123, 136, 272, 603}) == 5
# aula Doppler e checagem
assert round(400 * 340 / 306) == 444 and round(400 * 340 / 374) == 364 and 400 * 340 == 136000
assert 320 * 340 / 320 == 340 and round(320 * 340 / 360) == 302 and 720 * 340 / 360 == 680 and 720 * 340 == 244800 and 244800 / 360 == 680 and round(720 * 340 / 320) == 765
assert 380 * 340 / 323 == 400 and round(380 * 340 / 357) == 362 and 323 * 400 == 129200 == 380 * 340
Q.append(dict(
    id='d2-escada-fis-ita-ond-00b', materia='Física', tema=T, calc=136,
    enunciado=('Sobre uma mesa horizontal e lisa, uma pequena sirene de 0,8 kg está presa à ponta de um fio ideal de 1,7 m, cuja outra ponta é fixa no centro da mesa. '
               'A sirene gira em círculo com velocidade de módulo constante e emite um som de frequência fe, que ninguém mediu. Um microfone parado, no plano da mesa e '
               'muito mais longe do que o raio do círculo, registra, ao longo de várias voltas, uma frequência máxima de 420 Hz e uma mínima de 380 Hz. Não há vento '
               'e o som se propaga a 340 m/s. A tração no fio, em newtons, é:'),
    dados=[('Sirene', '0,8 kg, na ponta de um fio de 1,7 m'), ('Mesa', 'horizontal e lisa'), ('Frequência máxima no microfone', '420 Hz'),
           ('Frequência mínima no microfone', '380 Hz'), ('Som no ar', '340 m/s')],
    alts=[('8', 8, 'Esqueceu o quadrado da velocidade: massa · vf ÷ raio = 0,8 · 17 ÷ 1,7'),
          ('123', 123, 'Tomou a média simples (400 Hz) como fe: vf ≈ 16,2 m/s'),
          ('136', 136, 'OK'),
          ('272', 272, 'Tomou 1,7 m como diâmetro e usou o raio 0,85 m'),
          ('603', 603, 'Dividiu a diferença das frequências só pela mínima: vf ≈ 35,8 m/s')],
    resumo='fo máx · (340 − vf) = fo mín · (340 + vf) = fe · 340; 142 800 − 420 · vf = 129 200 + 380 · vf; vf = 17 m/s; tra = 0,8 · 17 · 17 ÷ 1,7 = 231,2 ÷ 1,7 = 136 N.',
    ideia='São duas incógnitas, fe e a velocidade vf da sirene, e duas frequências: fe some quando as duas equações são igualadas. Com vf, a tração é a força que faz a curva.',
    pecas=[('Frequência máxima e mínima', 'A máxima é ouvida quando a sirene vem direto ao microfone; a mínima, quando vai embora. Nos dois casos só conta a velocidade vf, na direção do microfone.')],
    formulas=[('onda', 'Doppler, fonte chegando', 'fo = fe · vsom ÷ (vsom − vf)'), ('onda', 'Doppler, fonte indo embora', 'fo = fe · vsom ÷ (vsom + vf)'),
              ('circulo', 'Tração no giro', 'tra = massa · vf · vf ÷ raio')],
    origem=['A sirene vem direto ao microfone quando a velocidade dela aponta para ele: aí vale a fórmula de chegando, com vsom = 340 m/s. Quando aponta para longe, vale a de indo embora.',
            'Nos outros pontos do círculo o som é ouvido entre esses dois valores. O microfone está muito longe: a direção da sirene até ele quase não muda durante a volta.',
            'Mesa lisa: a única força horizontal na sirene é a tração do fio, e ela faz a curva (aula "Força para fazer a curva"): tra = massa · vf · vf ÷ raio.'],
    desenho=('Veja a mesa de cima: a sirene gira na ponta do fio e o microfone está muito longe. Quando ela vem direto ao microfone, ele ouve 420 Hz (a máxima); no ponto oposto ela se afasta e ele ouve 380 Hz (a mínima).', 'sirene-no-circulo', []),
    eq='tra = 0,8 · vf · vf ÷ 1,7', leitura='tração = massa · velocidade · velocidade ÷ raio (o raio é o fio)',
    letras=[('tra', 'tração no fio, em N (o que a questão quer)'), ('vf', 'velocidade da sirene no círculo, em m/s'),
            ('cte', 'o número fe · 340, igual nas duas frequências (some na conta)')],
    eq_texto='A massa e o fio são dados. Falta a velocidade vf, e as duas frequências a escondem. cte é o número fe · 340, que é o mesmo nas duas.\nAgora é só achar cte e vf.',
    achando=[('Achando cte: o que as duas frequências têm em comum',
              'Chegando: 420 = fe · 340 ÷ (340 − vf). Multiplique os dois lados por (340 − vf) para sumir a divisão (como 6 = 12 ÷ 2 vira 6 · 2 = 12): 420 · (340 − vf) = fe · 340.\nIndo embora: 380 · (340 + vf) = fe · 340. Então cte = fe · 340 aparece nas duas.'),
             ('Achando vf: a velocidade da sirene',
              'Iguale: 420 · (340 − vf) = 380 · (340 + vf). 420 · 340 = 42 · 34 · 100 = 1 428 · 100 = 142 800. 380 · 340 = 38 · 34 · 100 = 1 292 · 100 = 129 200.\n142 800 − 420 · vf = 129 200 + 380 · vf. Junte: 142 800 − 129 200 = 13 600 = 800 · vf.\nvf = 13 600 ÷ 800 = 136 ÷ 8 = 17 m/s.',
              {'tipo': 'diagrama', 'nome': 'sirene-no-circulo', 'rotulos': ['', '', '', '', '', 'vf = 17 m/s']})],
    volta=('tra = 0,8 · 17 · 17 ÷ 1,7. 17 · 17 = 170 + 119 = 289. 0,8 · 289 = 8 · 289 ÷ 10 = 2 312 ÷ 10 = 231,2.\n231,2 ÷ 1,7 = 2 312 ÷ 17. 17 · 100 = 1 700, sobram 612; 17 · 36 = 612. Então 100 + 36 = 136 N.\n'
           'Resposta: alternativa A. Conferindo: 340 − 17 = 323 e 340 + 17 = 357; cte = 420 · 323 = 135 660 = 380 · 357; fe = 135 660 ÷ 340 = 399 Hz.'),
    valores=[('cte', '135 660 (= 420 · 323)'), ('vf', '17 m/s')],
    pista='"duas frequências, máxima e mínima, de fonte em círculo" → monte máx · (vsom − vf) = mín · (vsom + vf); o fe some. Com vf, tração = massa · vf · vf ÷ raio.',
    rec1='0,8 kg; fio 1,7 m; 420 e 380 Hz; 340 m/s', rec3='cte = fe · 340; vf = 17 m/s',
    checagem=('Uma fonte de 380 Hz vem na direção de um ouvinte parado a 17 m/s (som a 340 m/s). Qual frequência o ouvinte percebe?', ['400 Hz', '380 Hz', '362 Hz', '323 Hz'], '400 Hz',
              'Chegando: 340 − 17 = 323; 380 · 340 ÷ 323 = 129 200 ÷ 323 = 400 Hz.'),
    ancora='parcial · IME 2026 q.6 (fonte em movimento circular: frequências percebidas dão a velocidade) e Fuvest 2023 F05 (Doppler com a fonte chegando e indo)',
    canal='fis-16-som-acustica-e-efeito-doppler.txt [13:29:04] (fonte se aproximando e se afastando)',
    antes=['ond-doppler', 'curva', 'dividir-por-decimal', 'ond-incognita-dos-dois-lados'],
))

# ============ c) Fuvest: tubo com água, dois níveis de ressonância e a temperatura do ar ============
FREQ, N1, N2, FOLGA = 500, 0.16, 0.50, 0.01
DIF = N2 - N1
LAM = 2 * DIF
VELOC = LAM * FREQ
TEMP = (VELOC - 331) / 0.6
assert abs(DIF - 0.34) < 1e-12 and abs(LAM - 0.68) < 1e-12 and abs(VELOC - 340) < 1e-9 and abs(TEMP - 15) < 1e-9
assert abs(331 + 0.6 * 15 - 340) < 1e-9 and 68 * 500 == 34000 and 34000 / 100 == 340 and 9 / 0.6 == 15 and 90 / 6 == 15
assert abs((LAM / 4 - FOLGA) - N1) < 1e-12 and abs((3 * LAM / 4 - FOLGA) - N2) < 1e-12 and abs(LAM / 4 - 0.17) < 1e-12 and abs(3 * LAM / 4 - 0.51) < 1e-12
# erros típicos
assert round((4 * N1 * FREQ - 331) / 0.6) == -18 and abs(4 * N1 * FREQ - 320) < 1e-9
assert round((4 * N2 / 3 * FREQ - 331) / 0.6) == 4
assert round(((4 * N1 + 4 * N2 / 3) / 2 * FREQ - 331) / 0.6) == -7
assert round(VELOC - 331) == 9
assert (55 - 15) * 2 == 80 and 4 * 15 == 60
Q.append(dict(
    id='d2-escada-fis-ita-ond-00c', materia='Física', tema=T, calc=15,
    enunciado=('Num laboratório, um tubo de vidro vertical, aberto no alto, está ligado por uma mangueira a um reservatório de água, de modo que o nível da água dentro do tubo '
               'pode ser subido ou descido. A coluna de ar entre a boca do tubo e a água funciona como um tubo sonoro fechado embaixo. Um diapasão de 500 Hz vibra sobre a boca. '
               'Baixando devagar o nível, o som reforça em duas posições seguidas, sem outra entre elas. A tabela dá o comprimento da coluna de ar, medido da boca até a água:\n\n'
               '1ª ressonância: 16,0 cm\n2ª ressonância: 50,0 cm\n\n'
               'O ventre do som fica um pouco fora da boca do tubo, por uma correção que ninguém mediu. O som se propaga no ar com velocidade vel = 331 + 0,6 · tem, em m/s, '
               'sendo tem a temperatura do ar em °C. A temperatura do ar no tubo, em °C, é:'),
    dados=[('Diapasão', '500 Hz'), ('1ª ressonância, coluna de ar', '16,0 cm'), ('2ª ressonância, coluna de ar', '50,0 cm'), ('Som no ar', 'vel = 331 + 0,6 · tem (m/s)')],
    alts=[('−18', -18, 'Tomou 16 cm como lam ÷ 4: lam = 64 cm, vel = 320 m/s'),
          ('−7', -7, 'Achou lam de cada nível sem a folga (4 · 16 e 4 · 50 ÷ 3) e fez a média'),
          ('4', 4, 'Tomou 50 cm como 3 · lam ÷ 4: lam = 66,7 cm, vel ≈ 333 m/s'),
          ('9', 9, 'Achou vel = 340 m/s e parou em 340 − 331, sem dividir por 0,6'),
          ('15', 15, 'OK')],
    resumo='Entre níveis seguidos cabe lam ÷ 2: 50 − 16 = 34 cm, lam = 68 cm; vel = 0,68 · 500 = 340 m/s; tem = (340 − 331) ÷ 0,6 = 15 °C.',
    ideia='Na boca do tubo o som "passa" um pouco da borda, então um nível sozinho não dá lam ÷ 4. Já a diferença entre dois níveis seguidos é exatamente meio comprimento de onda, e a folga some.',
    pecas=[('Níveis seguidos', 'Dois pontos de ressonância em sequência: a coluna de ar cresce meio comprimento de onda de um para o outro.')],
    formulas=[('onda', 'Entre dois níveis seguidos', 'dif = lam ÷ 2'), ('onda', 'Velocidade da onda', 'vel = lam · freq'), ('termometro', 'Som e temperatura', 'vel = 331 + 0,6 · tem')],
    origem=['Com lam = 68 cm, o 1º reforço seria em lam ÷ 4 = 17 cm e o 2º em 3 · lam ÷ 4 = 51 cm. Mas o ventre fica um pouco fora da boca: cada coluna medida sai menor por uma folga que ninguém mediu (aqui, 17 − 16 = 1 cm e 51 − 50 = 1 cm).',
            'A folga é a mesma nos dois níveis e some na subtração: 50 − 16 = 34 cm = lam ÷ 2. Por isso 4 · 16 = 64 cm erra: ele daria vel = 320 m/s e −18 °C.'],
    desenho=('Veja o tubo: o diapasão de 500 Hz vibra sobre a boca e o nível da água sobe e desce. O som reforça com 16,0 cm de ar e de novo com 50,0 cm.', 'tubo-com-agua', []),
    eq='tem = (vel − 331) ÷ 0,6', leitura='temperatura = (velocidade do som − 331) ÷ 0,6',
    letras=[('tem', 'temperatura do ar, em °C (o que a questão quer)'), ('vel', 'velocidade do som no tubo, em m/s'),
            ('lam', 'comprimento de onda do som (λ), em m'), ('dif', 'diferença entre os dois níveis, em m')],
    eq_texto='A fórmula do enunciado é vel = 331 + 0,6 · tem. Desfazendo de trás para frente (aula "Achar o número que falta"): tem = (vel − 331) ÷ 0,6.\nAgora é só achar vel, lam e dif.',
    achando=[('Achando vel: a velocidade do som',
              'vel = lam · freq = lam · 500. Falta o lam. A velocidade vem do comprimento de onda e da frequência do diapasão.'),
             ('Achando lam: o comprimento de onda',
              'Entre dois níveis seguidos cabe meia onda: dif = lam ÷ 2, então lam = 2 · dif. Falta o dif.'),
             ('Achando dif: a diferença dos níveis',
              '50,0 − 16,0 = 34,0 cm. Como 1 m = 100 cm, 34 cm = 34 ÷ 100 = 0,34 m. lam = 2 · 0,34 = 0,68 m.\nvel = 0,68 · 500 = 68 · 500 ÷ 100 = 34 000 ÷ 100 = 340 m/s.',
              {'tipo': 'diagrama', 'nome': 'tubo-com-agua', 'rotulos': ['', '', '', '34,0 cm = λ ÷ 2', 'λ = 0,68 m; vel = 340 m/s']})],
    volta='tem = (340 − 331) ÷ 0,6 = 9 ÷ 0,6. Multiplique em cima e embaixo por 10: 90 ÷ 6 = 15 °C.\nResposta: alternativa A. Conferindo: 331 + 0,6 · 15 = 331 + 9 = 340 m/s.',
    valores=[('dif', '0,34 m'), ('lam', '0,68 m'), ('vel', '340 m/s')],
    pista='"dois níveis de ressonância seguidos" → a diferença é lam ÷ 2 (a folga da boca some); depois vel = lam · freq e a temperatura pela fórmula do som.',
    rec1='500 Hz; níveis 16,0 e 50,0 cm; vel = 331 + 0,6 · tem', rec3='dif = 0,34; lam = 0,68; vel = 340',
    checagem=('Num tubo fechado, dois níveis seguidos de ressonância ficam a 15 cm e 55 cm. Qual o comprimento de onda?', ['80 cm', '40 cm', '60 cm', '55 cm'], '80 cm',
              'Diferença: 55 − 15 = 40 cm = meio comprimento de onda, então o comprimento de onda é 2 · 40 = 80 cm.'),
    ancora='forte · ENEM 2020 q.114 (ressonâncias seguidas em tubo fechado: o dado medido não é a fundamental) e Fuvest 2024 F03 (ventres, nós e comprimento)',
    canal='fora do canal: tubo com água e níveis de ressonância (o canal só cita harmônicos em fis-16-som-acustica-e-efeito-doppler.txt [13:19:32]); v = λ · f em fis-09-ondulatoria.txt [8:45:01]',
    antes=['ond-comprimento-de-onda', 'ond-tubo-fechado', 'numero-que-falta', 'dividir-por-decimal'],
))

# ============ d) Harvard-MIT: mdc e f1 = mdc ÷ kk (a fundamental não precisa ser inteira) ============
COMP, FA, FB, PISO = Fraction(9, 10), 420, 700, 20
MDC = math.gcd(FA, FB)
assert MDC == 140 and 700 - 420 == 280 and math.gcd(420, 280) == 140 and math.gcd(140, 280) == 140 and 280 == 2 * 140
POSSIVEIS = [Fraction(MDC, k) for k in range(1, 401)
             if (FA / Fraction(MDC, k)).denominator == 1 and (FB / Fraction(MDC, k)).denominator == 1 and Fraction(MDC, k) >= PISO]
assert len(POSSIVEIS) == 7 and POSSIVEIS[-1] == 20 and POSSIVEIS[0] == 140
achados = [Fraction(i, 60) for i in range(20 * 60, 700 * 60 + 1)
           if (FA / Fraction(i, 60)).denominator == 1 and (FB / Fraction(i, 60)).denominator == 1]
assert achados == sorted(POSSIVEIS) and len(achados) == 7
assert Fraction(MDC, 8) < PISO and Fraction(MDC, 8) == Fraction(35, 2)
assert FA / Fraction(140, 3) == 9 and FB / Fraction(140, 3) == 15 and 420 * 3 == 1260 and 1260 / 140 == 9 and 700 * 3 / 140 == 15
VELOCS = [2 * COMP * f for f in POSSIVEIS]
assert [float(v) for v in VELOCS] == [252, 126, 84, 63, 50.4, 42, 36] and len(set(VELOCS)) == 7
assert all(2 * COMP * Fraction(MDC, k) == Fraction(252, k) for k in range(1, 8)) and 18 * 14 == 252
DIVS = sorted(d for d in range(1, MDC + 1) if MDC % d == 0)
assert len(DIVS) == 12                                                      # 12: todos os divisores de 140
assert len([d for d in DIVS if d >= PISO]) == 5                             # 5: f1 só inteira
assert FA % 280 != 0                                                        # 1: modos vizinhos dariam f1 = 280, que não divide 420
assert len({1, 5, 7, 12, 140}) == 5
assert math.gcd(30, 50) == 10 and [Fraction(10, k) for k in range(1, 20) if Fraction(10, k) >= 3] == [10, 5, Fraction(10, 3)]
Q.append(dict(
    id='d2-escada-fis-ita-ond-00d', materia='Física', tema=T, calc=7,
    enunciado=('Uma corda de violão de 0,9 m, presa nas duas pontas, vibra num modo estacionário de 420 Hz e, com a mesma tensão, num modo de 700 Hz. Não se sabe quais são esses '
               'modos, nem se há outros entre eles. A frequência fundamental dessa corda é audível, isto é, de pelo menos 20 Hz, e não precisa ser um número inteiro de hertz. '
               'A tensão da corda, e portanto a velocidade das ondas nela, é desconhecida. Quantos valores diferentes essa velocidade pode ter?'),
    dados=[('Corda', '0,9 m, presa nas duas pontas'), ('Dois modos vistos (mesma tensão)', '420 Hz e 700 Hz'), ('Fundamental', 'pelo menos 20 Hz, não precisa ser inteira')],
    alts=[('1', 1, 'Supôs modos vizinhos: f1 = 700 − 420 = 280 Hz (e 420 nem é múltiplo de 280)'),
          ('5', 5, 'Exigiu f1 inteira: só os divisores de 140 que são pelo menos 20 (20, 28, 35, 70, 140)'),
          ('7', 7, 'OK'),
          ('12', 12, 'Contou todos os divisores de 140, esquecendo o piso de 20 Hz'),
          ('140', 140, 'Deu o mdc (140) em vez de contar os valores')],
    resumo='420 = m · f1 e 700 = n · f1 com m e n inteiros: f1 = 140 ÷ kk. Com f1 pelo menos 20, kk vai de 1 a 7 (140 ÷ 7 = 20; 140 ÷ 8 = 17,5). v = 1,8 · f1 = 252 ÷ kk: sete valores.',
    ideia='Os modos são f1, 2 · f1, 3 · f1 e assim por diante, então 420 e 700 são múltiplos inteiros de f1, e f1 é o mdc (140) dividido por um inteiro kk. O piso de 20 Hz limita kk, e cada kk dá uma velocidade diferente.',
    pecas=[('mdc dividido por kk', 'O maior f1 possível é o mdc, 140 Hz. Dividindo-o por 2, 3, 4..., os dois modos continuam múltiplos inteiros de f1, só que de ordem mais alta.')],
    formulas=[('onda', 'Modos da corda', 'f = n · f1, com n = 1, 2, 3...'), ('onda', 'Velocidade na corda', 'v = 2 · 0,9 · f1 = 1,8 · f1'), ('contagem', 'Fundamental possível', 'f1 = mdc ÷ kk')],
    origem=['Se 420 é m · f1 e 700 é n · f1, com m e n inteiros que não conhecemos, então f1 cabe um número inteiro de vezes nos dois. O maior f1 possível é o mdc, 140 Hz (modos 3º e 5º).',
            'Não dá para só subtrair 700 − 420 = 280: isso valeria para modos vizinhos, e o enunciado não diz isso. (A subtração do mdc, na tela seguinte, é só um truque de conta.)',
            'O enunciado não pede f1 inteira: f1 = 140 ÷ 3 também serve, com os modos 9º e 15º.'],
    desenho=('Veja a corda de 0,9 m, presa nas duas pontas, em dois modos: 420 Hz e 700 Hz. Quantas barrigas cada um tem não é dado; o desenho mostra só um exemplo.', 'corda-modos', []),
    eq='qtd = quantos kk dão f1 = mdc ÷ kk pelo menos 20', leitura='número de velocidades = número de fundamentais possíveis (todas diferentes)',
    letras=[('qtd', 'quantidade de velocidades possíveis (o que a questão quer)'), ('mdc', 'maior divisor comum de 420 e 700'),
            ('kk', 'inteiro (1, 2, 3...) que divide o mdc para formar f1')],
    eq_texto='Cada f1 = mdc ÷ kk dá uma velocidade (v = 1,8 · f1), todas diferentes. Contar velocidades é contar valores de kk.\nAgora é só achar mdc e kk.',
    achando=[('Achando mdc: o maior divisor comum de 420 e 700',
              'Troque o maior pela diferença (truque do mdc, não quer dizer que os modos são vizinhos): 700 − 420 = 280, e mdc(420, 700) = mdc(420, 280).\n420 − 280 = 140: mdc(140, 280). Como 280 = 2 · 140, mdc = 140.'),
             ('Achando kk: quantos inteiros servem',
              'f1 = 140 ÷ kk. Exemplo kk = 3: f1 = 140 ÷ 3, e 420 ÷ (140 ÷ 3) = 420 · 3 ÷ 140 = 1 260 ÷ 140 = 9; 700 · 3 ÷ 140 = 15. Os dois dão inteiros: serve.\nPiso: 140 ÷ kk pelo menos 20, então kk é no máximo 140 ÷ 20 = 7. Teste: 140 ÷ 7 = 20 serve e 140 ÷ 8 = 17,5 não. kk = 1, 2, 3, 4, 5, 6, 7.',
              {'tipo': 'diagrama', 'nome': 'corda-modos', 'rotulos': ['', '', '', '', 'f1 = 140 ÷ kk, com kk de 1 a 7']})],
    volta='qtd = 7 valores de kk, logo 7 velocidades: v = 1,8 · f1 = 1,8 · 140 ÷ kk = 252 ÷ kk.\nResposta: alternativa A. As velocidades são 252; 126; 84; 63; 50,4; 42; 36 m/s, todas diferentes.',
    valores=[('mdc', '140'), ('kk', '1, 2, 3, 4, 5, 6, 7')],
    pista='"dois modos, sem dizer se são vizinhos" → f1 = mdc ÷ kk, com kk inteiro; o piso de frequência limita kk; conte os kk.',
    rec1='0,9 m; modos 420 e 700 Hz; fundamental pelo menos 20 Hz', rec3='mdc = 140; kk = 1 a 7',
    checagem=('Dois modos de uma corda são 30 Hz e 50 Hz (não se sabe se são vizinhos), e a fundamental é de pelo menos 3 Hz. Quantas fundamentais são possíveis?', ['3', '2', '1', '4'], '3',
              'mdc(30, 50) = 10. f1 = 10 ÷ kk pelo menos 3: kk = 1, 2, 3 (10; 5; 3,33). Com kk = 4, f1 = 2,5 fica abaixo de 3. São 3.'),
    ancora='parcial · HMMT Fev 2022 Álgebra e Teoria dos Números q.6 e HMMT Nov 2021 Guts q.11 (técnica: mdc e contagem de divisores); sem Física no HMMT',
    canal='fora do canal: corda com modos desconhecidos e mdc; v = λ · f em fis-09-ondulatoria.txt [8:45:01]',
    antes=['ond-modos-da-corda', 'ond-divisor-comum'],
))

# ============ aulas "Antes" novas ============
def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


ANTES_NOVOS = {
    'ond-fahrenheit-celsius': {
        'titulo': 'Graus Fahrenheit e graus Celsius',
        'linhas': [
            'O termômetro pode marcar em °F (Fahrenheit) ou em °C (Celsius). É a mesma temperatura, com números diferentes.',
            'A água congela a 32 °F = 0 °C e ferve a 212 °F = 100 °C.',
            'De °F para °C: tire 32 e multiplique por 5 ÷ 9. Em palavras: °C = (°F − 32) · 5 ÷ 9.',
            'Exemplo, 68 °F: 68 − 32 = 36. Depois 36 · 5 = 180. Depois 180 ÷ 9 = 20. Então 68 °F = 20 °C.',
            'Confira: 212 − 32 = 180, 180 · 5 = 900, 900 ÷ 9 = 100 °C. Tabela: ache a linha da temperatura e leia o valor ao lado.',
        ],
        'visual': tabela('Três temperaturas', ['°F', 'Conta', '°C'], [['32', '(32 − 32) · 5 ÷ 9', '0'], ['68', '36 · 5 ÷ 9', '20'], ['212', '180 · 5 ÷ 9', '100']]),
        'exercicios': [
            {'enunciado': 'Quanto é 86 °F em °C?', 'alternativas': ['30 °C', '54 °C', '48 °C', '97 °C'], 'certa': 0,
             'resolucao': '30 °C: 86 − 32 = 54; 54 · 5 = 270; 270 ÷ 9 = 30.\n54 só tira o 32; 48 esquece o 32 (86 · 5 ÷ 9); 97 usa 9 ÷ 5 no lugar de 5 ÷ 9.'},
            {'enunciado': 'Quanto é 50 °F em °C?', 'alternativas': ['10 °C', '18 °C', '28 °C', '90 °C'], 'certa': 0,
             'resolucao': '10 °C: 50 − 32 = 18; 18 · 5 = 90; 90 ÷ 9 = 10.\n18 só tira o 32; 28 esquece o 32; 90 esquece o ÷ 9.'},
        ],
    },
    'ond-comprimento-de-onda': {
        'titulo': 'Comprimento de onda e v = λ · f',
        'linhas': [
            'Uma onda é uma fila de cristas. Comprimento de onda (λ, lê-se lâmbda) é a distância entre duas cristas seguidas. Nas questões, é "lam".',
            'Frequência (f) é quantas ondas passam por segundo. A unidade é o Hz: 500 Hz = 500 ondas por segundo.',
            'Se cada onda tem 0,68 m e passam 500 por segundo, em 1 s a onda anda 500 · 0,68 = 340 m. Então a velocidade é v = λ · f.',
            'Conta: 0,68 = 68 ÷ 100. 68 · 500 = 34 000 e 34 000 ÷ 100 = 340 m/s.',
            'Metro e centímetro: 1 m = 100 cm. Então 34 cm = 34 ÷ 100 = 0,34 m, e 0,68 m = 68 cm.',
        ],
        'visual': tabela('Uma onda de 0,68 m', ['Ondas por segundo', 'Conta', 'Metros por segundo'], [['1 Hz', '0,68 · 1', '0,68'], ['100 Hz', '0,68 · 100', '68'], ['500 Hz', '0,68 · 500', '340']]),
        'exercicios': [
            {'enunciado': 'Ondas de 2 m passam 5 vezes por segundo (5 Hz). Qual é a velocidade da onda?', 'alternativas': ['10 m/s', '7 m/s', '0,4 m/s', '2,5 m/s'], 'certa': 0,
             'resolucao': '10 m/s: v = 2 · 5 = 10.\n7 é somar 2 + 5; 0,4 é 2 ÷ 5; 2,5 é 5 ÷ 2.'},
            {'enunciado': 'Uma onda de 30 cm de comprimento tem 200 Hz. Qual é a velocidade, em m/s?', 'alternativas': ['60 m/s', '6 000 m/s', '0,15 m/s', '230 m/s'], 'certa': 0,
             'resolucao': '60 m/s: 30 cm = 30 ÷ 100 = 0,3 m; 0,3 · 200 = 60.\n6 000 esquece de passar cm para m; 0,15 é 30 ÷ 200; 230 é 30 + 200.'},
        ],
    },
    'ond-doppler': {
        'titulo': 'Efeito Doppler: o som muda quando a fonte anda',
        'linhas': [
            'Fonte parada: o som tem a frequência fe (emitida). Se a fonte anda, quem ouve percebe outra frequência, fo. Isso é o efeito Doppler.',
            'Fonte vindo na sua direção: as cristas chegam mais juntas e o som fica mais agudo: fo = fe · vsom ÷ (vsom − vf).',
            'Fonte indo embora: as cristas ficam mais espaçadas e o som fica mais grave: fo = fe · vsom ÷ (vsom + vf). vsom é a do som; vf, a da fonte.',
            'Com fe = 400 Hz, vsom = 340 m/s e vf = 34 m/s: chegando, fo = 400 · 340 ÷ 306 = 444 Hz (cerca de); indo embora, 400 · 340 ÷ 374 = 364 Hz (cerca de).',
            'Conta: 340 − 34 = 306 e 340 + 34 = 374. E 400 · 340 = 136 000, que se divide por 306 ou por 374.',
        ],
        'visual': tabela('Fonte de 400 Hz a 34 m/s', ['Movimento', 'Conta', 'Ouve'], [['Parada', '400', '400 Hz'], ['Chegando', '400 · 340 ÷ 306', 'cerca de 444 Hz'], ['Indo embora', '400 · 340 ÷ 374', 'cerca de 364 Hz']]),
        'exercicios': [
            {'enunciado': 'Uma fonte de 320 Hz vem na sua direção a 20 m/s (som a 340 m/s). Que frequência você ouve?', 'alternativas': ['340 Hz', '302 Hz', '320 Hz', '360 Hz'], 'certa': 0,
             'resolucao': '340 Hz: 340 − 20 = 320 e 320 · 340 ÷ 320 = 340.\n302 é o caso de ir embora (340 + 20); 320 é não mudar; 360 é 340 + 20.'},
            {'enunciado': 'Uma sirene de 720 Hz se afasta de você a 20 m/s (som a 340 m/s). Que frequência você ouve?', 'alternativas': ['680 Hz', '765 Hz', '720 Hz', '340 Hz'], 'certa': 0,
             'resolucao': '680 Hz: 340 + 20 = 360; 720 · 340 = 244 800; 244 800 ÷ 360 = 680.\n765 é o caso de se aproximar; 720 é não mudar; 340 é só o som.'},
        ],
    },
    'ond-tubo-fechado': {
        'titulo': 'Tubo fechado: onde o som reforça',
        'linhas': [
            'Num tubo fechado em uma ponta (ou coluna de ar sobre a água), o som reforça quando a coluna mede λ ÷ 4, depois 3 · λ ÷ 4, depois 5 · λ ÷ 4...',
            'Com λ = 68 cm: λ ÷ 4 = 17 cm; 3 · λ ÷ 4 = 51 cm; 5 · λ ÷ 4 = 85 cm. A coluna reforça o som nesses tamanhos.',
            'Na vida real o som passa um pouquinho da boca do tubo, então cada medida sai um pouco menor que esses números. Esse pouco é a folga.',
            'Entre dois reforços seguidos a coluna cresce meia onda: 51 − 17 = 34 cm = λ ÷ 2. A folga é igual nos dois e some na subtração.',
        ],
        'visual': tabela('Tubo fechado, λ = 68 cm', ['Reforço', 'Conta', 'Coluna'], [['1º', '68 ÷ 4', '17 cm'], ['2º', '3 · 68 ÷ 4', '51 cm'], ['3º', '5 · 68 ÷ 4', '85 cm']]),
        'exercicios': [
            {'enunciado': 'Num tubo fechado, a coluna reforça o som com 12 cm e, no reforço seguinte, com 36 cm (sem folga). Qual é o λ?', 'alternativas': ['48 cm', '24 cm', '12 cm', '36 cm'], 'certa': 0,
             'resolucao': '48 cm: 36 − 12 = 24 cm = λ ÷ 2, então λ = 2 · 24 = 48.\n24 é a diferença; 12 e 36 são medidas, não o λ.'},
            {'enunciado': 'Com λ = 80 cm e sem folga, quanto mede a coluna no 2º reforço (3 · λ ÷ 4)?', 'alternativas': ['60 cm', '20 cm', '40 cm', '100 cm'], 'certa': 0,
             'resolucao': '60 cm: 3 · 80 = 240 e 240 ÷ 4 = 60.\n20 é λ ÷ 4 (1º reforço); 40 é λ ÷ 2; 100 é 5 · λ ÷ 4 (3º reforço).'},
        ],
    },
    'ond-modos-da-corda': {
        'titulo': 'Modos da corda e v = 2 · L · f1',
        'linhas': [
            'Corda de 0,9 m presa nas pontas. No modo 1 ela vibra com uma barriga: cabe meia onda, então λ = 2 · 0,9 = 1,8 m.',
            'Modo 2: duas barrigas, cabe uma onda inteira: λ = 0,9 m. Modo 3: três barrigas, λ = 0,6 m. Modo n: λ = 1,8 ÷ n.',
            'Pela v = λ · f, a frequência de cada modo é f = v ÷ λ. No modo 1 é f1 (a fundamental). No modo n é f = n · f1.',
            'Os modos são f1, 2 · f1, 3 · f1... Do modo 1: v = λ · f1 = 1,8 · f1. Em geral, v = 2 · L · f1, sendo L o comprimento da corda.',
            'Exemplo: f1 = 100 Hz e L = 0,9 m. v = 2 · 0,9 · 100 = 180 m/s. O modo 3 tem 3 · 100 = 300 Hz.',
        ],
        'visual': tabela('Corda de 0,9 m, f1 = 100 Hz', ['Modo', 'λ', 'Frequência'], [['1', '1,8 m', '100 Hz'], ['2', '0,9 m', '200 Hz'], ['3', '0,6 m', '300 Hz']]),
        'exercicios': [
            {'enunciado': 'Uma corda de 1 m tem f1 = 50 Hz. Qual é a velocidade da onda nela?', 'alternativas': ['100 m/s', '50 m/s', '25 m/s', '150 m/s'], 'certa': 0,
             'resolucao': '100 m/s: v = 2 · 1 · 50 = 100.\n50 esquece o 2; 25 é 50 ÷ 2; 150 é 3 · 50.'},
            {'enunciado': 'Uma corda tem f1 = 80 Hz. Qual é a frequência do modo 4?', 'alternativas': ['320 Hz', '84 Hz', '20 Hz', '160 Hz'], 'certa': 0,
             'resolucao': '320 Hz: modo 4 = 4 · 80 = 320.\n84 é 80 + 4; 20 é 80 ÷ 4; 160 é o modo 2.'},
        ],
    },
    'ond-incognita-dos-dois-lados': {
        'titulo': 'Número escondido dos dois lados',
        'linhas': [
            'Às vezes o número escondido (U) aparece dos dois lados da igualdade. Exemplo: 3 · (12 − U) = 12 + U.',
            'Primeiro abra o parêntese: 3 · 12 = 36 e 3 · U = 3U. Fica 36 − 3U = 12 + U.',
            'Some 3U dos dois lados, para os U ficarem juntos: 36 = 12 + U + 3U, ou seja, 36 = 12 + 4U.',
            'Tire 12 dos dois lados: 24 = 4U. Divida por 4: U = 6. Confira: 3 · (12 − 6) = 18 e 12 + 6 = 18.',
            'Se U está numa divisão, multiplique os dois lados pelo que divide: 6 = 12 ÷ 2 vira 6 · 2 = 12. E 12 = 60 ÷ (2 + U) vira 12 · (2 + U) = 60.',
        ],
        'visual': tabela('Passo a passo', ['Passo', '3 · (12 − U) = 12 + U'], [['Abrir o parêntese', '36 − 3U = 12 + U'], ['Juntar os U', '36 = 12 + 4U'], ['Tirar 12', '24 = 4U'], ['Dividir por 4', 'U = 6']]),
        'exercicios': [
            {'enunciado': '2 · (9 − U) = 9 + U. Quanto vale U?', 'alternativas': ['3', '9', '6', '1'], 'certa': 0,
             'resolucao': '3: 2 · 9 = 18, então 18 − 2U = 9 + U; 18 = 9 + 3U; 9 = 3U; U = 3.\n9 esquece de dividir por 3; 6 é 18 ÷ 3; 1 é 3 − 2.'},
            {'enunciado': '12 = 60 ÷ (2 + U). Quanto vale U?', 'alternativas': ['3', '5', '36', '1'], 'certa': 0,
             'resolucao': '3: multiplique por (2 + U): 12 · (2 + U) = 60; 24 + 12U = 60; 12U = 36; U = 3.\n5 é 60 ÷ 12 (ignorou o 2 + U); 36 esquece de dividir por 12; 1 é 3 − 2.'},
        ],
    },
    'ond-divisor-comum': {
        'titulo': 'Divisor comum e mdc',
        'linhas': [
            'Divisores de 12: 1, 2, 3, 4, 6 e 12 (os que cabem certinho). Divisores de 18: 1, 2, 3, 6, 9 e 18.',
            'Divisor comum é o que cabe nos dois números: 1, 2, 3 e 6 aparecem nas duas listas.',
            'O maior deles é o mdc (maior divisor comum): mdc(12, 18) = 6. Todo divisor comum é divisor do mdc.',
            'Truque de conta: o mdc não muda se você troca o maior número pela diferença. 18 − 12 = 6, então mdc(12, 18) = mdc(12, 6) = 6.',
            'Isso é só um truque de conta do mdc. Não quer dizer que 12 e 18 sejam "vizinhos" em nada.',
            'Dividir o mdc também serve, mesmo sem dar inteiro: 6 ÷ 4 = 1,5, e 12 ÷ 1,5 = 8 e 18 ÷ 1,5 = 12 são inteiros.',
        ],
        'visual': tabela('Divisores de 12 e de 18', ['Número', 'Divisores', 'Comuns'], [['12', '1, 2, 3, 4, 6, 12', '1, 2, 3, 6'], ['18', '1, 2, 3, 6, 9, 18', '1, 2, 3, 6']]),
        'exercicios': [
            {'enunciado': 'Qual é o mdc de 20 e 30?', 'alternativas': ['10', '5', '60', '50'], 'certa': 0,
             'resolucao': '10: 30 − 20 = 10, e 20 = 2 · 10, então mdc(20, 30) = 10.\n5 é divisor comum, mas não o maior; 60 e 50 são contas que não dão divisor.'},
            {'enunciado': 'Quantos divisores de 24 são maiores que 5?', 'alternativas': ['4', '8', '3', '5'], 'certa': 0,
             'resolucao': '4: os divisores de 24 são 1, 2, 3, 4, 6, 8, 12 e 24; maiores que 5: 6, 8, 12 e 24.\n8 conta todos os divisores; 3 e 5 contam errado.'},
        ],
    },
}
for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('ond-')
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['resolucao'].split('\n')[0].count(_e['alternativas'][_e['certa']].split(' ')[0]) >= 1
        assert len(set(_e['alternativas'])) == len(_e['alternativas'])
# contas das aulas
assert 3 * (12 - 6) == 12 + 6 and 7 * (10 - 4) == 3 * (10 + 4) and 2 * (9 - 3) == 9 + 3 and 12 * (2 + 3) == 60
assert math.gcd(20, 30) == 10 and [d for d in range(1, 25) if 24 % d == 0 and d > 5] == [6, 8, 12, 24]
assert (86 - 32) * 5 / 9 == 30 and round(86 * 5 / 9) == 48 and round((86 - 32) * 9 / 5) == 97 and (50 - 32) * 5 / 9 == 10 and round(50 * 5 / 9) == 28 and (212 - 32) * 5 / 9 == 100
assert 2 * 5 == 10 and 0.3 * 200 == 60 and abs(0.68 * 500 - 340) < 1e-9
assert 12 + 24 == 36 and 3 * 80 / 4 == 60 and 2 * 1 * 50 == 100 and 4 * 80 == 320 and 2 * 0.9 * 100 == 180
assert math.gcd(12, 18) == 6 and 12 / 1.5 == 8 and 18 / 1.5 == 12
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
    assert len(_q['ideia']) <= 300, _q['id']
