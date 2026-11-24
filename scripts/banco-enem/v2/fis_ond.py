"""Nível acima v2 de Física: Ondas e Acústica (23/11/2026).

a = ENEM (MANTER: dois ecos do sonar, âncora ENEM 2023 q.135), b = ITA/IME (sirene girando: duas frequências, duas incógnitas, tração),
c = Fuvest (tubo com água: dois níveis de ressonância e a temperatura do ar), d = Harvard-MIT (mdc e contagem de divisores, âncora por técnica HMMT).
Conferido por assert no próprio módulo.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_ond
"""
import math

ARQUIVO = 'fisica-acima-novas.json'
T = 'Ondas e Acústica'
VSOM = 340

Q = []

# ============ a) ENEM: fica como está; só âncora, canal e Antes ============
assert abs((0.8 - 0.2) * 1500 / 2 - 450) < 1e-9 # a conta da questão antiga, conferida de novo
MANTER = {
    'd2-escada-fis-ita-ond-00a': {
        'ancora': 'forte · ENEM 2023 q.135 (dois ecos de um mesmo pulso: só vale a diferença dos tempos, dividida por 2 pela ida e volta)',
        'canal': 'fis-09-ondulatoria.txt [8:45:01] (v = λ · f); eco em fis-16-som-acustica-e-efeito-doppler.txt [13:22:30], sem conta',
        'antes': ['velocidade'],
    },
}

# ============ b) ITA/IME: sirene girando, duas frequências, duas incógnitas (f0 e u), depois a tração ============
FMAX, FMIN, MASSA, FIO = 550, 450, 0.5, 1.7
# fmax·(V − u) = f0·V = fmin·(V + u)  ->  u = V·(fmax − fmin)/(fmax + fmin)
U = VSOM * (FMAX - FMIN) / (FMAX + FMIN)
F0 = FMAX * (VSOM - U) / VSOM
assert abs(U - 34) < 1e-9 and abs(F0 - 495) < 1e-9
assert abs(F0 * VSOM / (VSOM - U) - FMAX) < 1e-9 and abs(F0 * VSOM / (VSOM + U) - FMIN) < 1e-9
assert FMAX * (VSOM - 34) == 550 * 306 == 168300 and FMIN * (VSOM + 34) == 450 * 374 == 168300
assert 550 * 340 == 187000 and 450 * 340 == 153000 and 187000 - 153000 == 34000
TRACAO = MASSA * U ** 2 / FIO
assert abs(TRACAO - 340) < 1e-9 and 578 / 1.7 == 340 and 5780 / 17 == 340 and 0.5 * 34 * 34 == 578
# erros típicos
assert round(MASSA * U / FIO) == 10                                               # esqueceu o quadrado
u_media = VSOM - 500 * VSOM / FMAX                                                # f0 = média simples (500 Hz)
assert round(u_media, 1) == 30.9 and round(MASSA * u_media ** 2 / FIO) == 281
assert round(MASSA * U ** 2 / (FIO / 2)) == 680                                   # 1,7 m tomado como diâmetro
u_errada = VSOM * (FMAX - FMIN) / FMIN                                            # dividiu pela mínima
assert round(u_errada, 1) == 75.6 and round(MASSA * u_errada ** 2 / FIO) == 1679
# checagem
assert 360 * 340 / (340 + 20) == 340 and round(360 * 340 / (340 - 20), 1) == 382.5
Q.append(dict(
    id='d2-escada-fis-ita-ond-00b', materia='Física', tema=T, calc=340,
    enunciado=('Sobre uma mesa horizontal e lisa, uma pequena sirene de 0,5 kg está presa à ponta de um fio ideal de 1,7 m, cuja outra ponta é fixa no centro da mesa. '
               'A sirene gira em círculo com velocidade de módulo constante e emite um som de frequência f0, que ninguém mediu. Um microfone parado, no plano da mesa e '
               'muito mais longe do que o raio do círculo, registra, ao longo de várias voltas, uma frequência máxima de 550 Hz e uma mínima de 450 Hz. Não há vento '
               'e o som se propaga a 340 m/s. A tração no fio, em newtons, é:'),
    dados=[('Sirene', '0,5 kg, na ponta de um fio de 1,7 m'), ('Mesa', 'horizontal e lisa'), ('Frequência máxima no microfone', '550 Hz'),
           ('Frequência mínima no microfone', '450 Hz'), ('Som no ar', '340 m/s')],
    alts=[('10', 10, 'Esqueceu o quadrado da velocidade: m · u ÷ r = 0,5 · 34 ÷ 1,7'),
          ('281', 281, 'Tomou a média simples (500 Hz) como f0: u ≈ 30,9 m/s'),
          ('340', 340, 'OK'),
          ('680', 680, 'Tomou 1,7 m como diâmetro e usou o raio 0,85 m'),
          ('1 679', 1679, 'Dividiu a diferença das frequências só pela mínima: u ≈ 75,6 m/s')],
    resumo='f máx · (340 − u) = f mín · (340 + u) = f0 · 340; 187 000 − 550u = 153 000 + 450u; u = 34 m/s; T = 0,5 · 34 · 34 ÷ 1,7 = 578 ÷ 1,7 = 340 N.',
    ideia='São duas incógnitas, f0 e a velocidade u da sirene, e duas frequências: f0 some quando se igualam as duas equações. Com u, a tração é a força que faz a curva.',
    pecas=[('Frequência máxima e mínima', 'A máxima é ouvida quando a sirene vem direto ao microfone; a mínima, quando vai embora. Nos dois casos só conta a velocidade u, na direção do microfone.')],
    formulas=[('onda', 'Doppler, fonte chegando', 'f = f0 · V ÷ (V − u)'), ('onda', 'Doppler, fonte indo embora', 'f = f0 · V ÷ (V + u)'),
              ('circulo', 'Tração no giro', 'T = m · u · u ÷ r')],
    origem=['Fonte vindo direto ao microfone: as cristas chegam espremidas, f = f0 · V ÷ (V − u), com V = 340 m/s. Indo embora: f = f0 · V ÷ (V + u).',
            'Nos outros pontos do círculo o som é ouvido entre esses dois valores. Como o microfone está muito longe, a direção da sirene até ele quase não muda ao longo da volta.',
            'Mesa lisa: a única força horizontal na sirene é a tração do fio, e ela faz a curva: T = m · u · u ÷ r (aula "Força para fazer a curva").'],
    eq='T = 0,5 · U · U ÷ 1,7', leitura='tração = massa · velocidade · velocidade ÷ raio (o raio é o fio)',
    letras=[('T', 'tração no fio, em N (o que a questão quer)'), ('U', 'velocidade da sirene no círculo, em m/s (o u das fórmulas)'),
            ('K', 'o número f0 · 340, igual nas duas frequências (some na conta)')],
    eq_texto='A massa e o fio são dados. Falta a velocidade U, e as duas frequências a escondem. Antes, o K que as liga.\nAgora é só achar K e U.',
    achando=[('Achando K: o que as duas frequências têm em comum',
              'Chegando: 550 · (340 − U) = f0 · 340. Indo embora: 450 · (340 + U) = f0 · 340.\nO lado direito é o mesmo nas duas: K = f0 · 340. Então 550 · (340 − U) = K e 450 · (340 + U) = K. O f0 não precisa ser achado.'),
             ('Achando U: a velocidade da sirene',
              'Iguale: 550 · (340 − U) = 450 · (340 + U). 550 · 340 = 187 000 e 450 · 340 = 153 000.\n187 000 − 550 · U = 153 000 + 450 · U. Junte: 187 000 − 153 000 = 450 · U + 550 · U.\n34 000 = 1 000 · U, então U = 34 m/s.')],
    volta='T = 0,5 · 34 · 34 ÷ 1,7. 34 · 34 = 1 156 e 0,5 · 1 156 = 578. T = 578 ÷ 1,7 = 5 780 ÷ 17 = 340 N.\nResposta: alternativa X. Conferindo: f0 = 168 300 ÷ 340 = 495 Hz; 495 · 340 ÷ 306 = 550 e 495 · 340 ÷ 374 = 450.',
    valores=[('K', '168 300 (= 495 · 340)'), ('U', '34 m/s')],
    pista='"duas frequências, máxima e mínima, de fonte em círculo" → monte f máx · (V − u) = f mín · (V + u); o f0 some. Com u, tração = m · u · u ÷ r.',
    rec1='0,5 kg; fio 1,7 m; 550 e 450 Hz; 340 m/s', rec3='K = f0 · 340; U = 34 m/s',
    checagem=('Uma fonte de 360 Hz se afasta de um ouvinte parado a 20 m/s (som a 340 m/s). Qual frequência o ouvinte percebe?', ['340 Hz', '382,5 Hz', '360 Hz', '380 Hz'], '340 Hz',
              'Afastando: f = 360 · 340 ÷ (340 + 20) = 360 · 340 ÷ 360 = 340 Hz.'),
    ancora='parcial · IME 2026 q.6 (fonte em movimento circular: frequências percebidas dão a velocidade) e Fuvest 2023 F05 (Doppler com a fonte chegando e indo)',
    canal='fis-16-som-acustica-e-efeito-doppler.txt [13:29:04] (fonte se aproximando e se afastando)',
    antes=['curva', 'dividir-por-decimal', 'ond-incognita-dos-dois-lados'],
))

# ============ c) Fuvest: tubo com água, dois níveis de ressonância e a temperatura do ar ============
FREQ, N1, N2, FOLGA = 500, 0.16, 0.50, 0.01
DIF = N2 - N1
LAMBDA = 2 * DIF
VELOC = LAMBDA * FREQ
TEMP = (VELOC - 331) / 0.6
assert abs(DIF - 0.34) < 1e-12 and abs(LAMBDA - 0.68) < 1e-12 and abs(VELOC - 340) < 1e-9 and abs(TEMP - 15) < 1e-9
assert abs(331 + 0.6 * 15 - 340) < 1e-9
# a física que o enunciado supõe: 1º nível = λ/4 − folga, 2º = 3λ/4 − folga (folga de 1 cm na boca)
assert abs((LAMBDA / 4 - FOLGA) - N1) < 1e-12 and abs((3 * LAMBDA / 4 - FOLGA) - N2) < 1e-12
# erros típicos
t_l1 = (4 * N1 * FREQ - 331) / 0.6                                   # 16 cm tomado como λ/4
assert round(t_l1) == -18 and abs(4 * N1 * FREQ - 320) < 1e-9
t_l2 = (4 * N2 / 3 * FREQ - 331) / 0.6                               # 50 cm tomado como 3λ/4
assert round(t_l2) == 4
t_media = ((4 * N1 + 4 * N2 / 3) / 2 * FREQ - 331) / 0.6             # média dos dois λ sem a folga
assert round(t_media) == -7
assert round(VELOC - 331) == 9                                       # esqueceu de dividir por 0,6
assert (55 - 15) * 2 == 80 and 4 * 15 == 60
Q.append(dict(
    id='d2-escada-fis-ita-ond-00c', materia='Física', tema=T, calc=15,
    enunciado=('Num laboratório, um tubo de vidro vertical, aberto no alto, está ligado por uma mangueira a um reservatório de água, de modo que o nível da água dentro do tubo '
               'pode ser subido ou descido. A coluna de ar entre a boca do tubo e a água funciona como um tubo sonoro fechado embaixo. Um diapasão de 500 Hz vibra sobre a boca. '
               'Baixando devagar o nível, o som reforça em duas posições seguidas, sem outra entre elas. A tabela dá o comprimento da coluna de ar, medido da boca até a água:\n\n'
               '1ª ressonância: 16,0 cm\n2ª ressonância: 50,0 cm\n\n'
               'O ventre do som fica um pouco fora da boca do tubo, por uma correção que ninguém mediu. O som se propaga no ar a v = 331 + 0,6 · T, em m/s, com T em °C. A temperatura do ar no tubo, em °C, é:'),
    dados=[('Diapasão', '500 Hz'), ('1ª ressonância, coluna de ar', '16,0 cm'), ('2ª ressonância, coluna de ar', '50,0 cm'), ('Som no ar', 'v = 331 + 0,6 · T (m/s)')],
    alts=[('−18', -18, 'Tomou 16 cm como λ ÷ 4: λ = 64 cm, v = 320 m/s'),
          ('−7', -7, 'Achou λ de cada nível sem a folga da boca (4 · 16 e 4 · 50 ÷ 3) e fez a média'),
          ('4', 4, 'Tomou 50 cm como 3 · λ ÷ 4: λ = 66,7 cm, v ≈ 333 m/s'),
          ('9', 9, 'Achou v = 340 m/s e parou em 340 − 331, sem dividir por 0,6'),
          ('15', 15, 'OK')],
    resumo='Entre níveis seguidos cabe λ ÷ 2: 50 − 16 = 34 cm, λ = 68 cm; v = 0,68 · 500 = 340 m/s; T = (340 − 331) ÷ 0,6 = 15 °C.',
    ideia='Na boca do tubo o som "passa" um pouco da borda, então um nível sozinho não dá λ ÷ 4. Já a diferença entre dois níveis seguidos é exatamente meio comprimento de onda, e a folga some.',
    pecas=[('Níveis seguidos', 'Dois pontos de ressonância em sequência: a coluna de ar cresce meio comprimento de onda de um para o outro.')],
    formulas=[('onda', 'Entre dois níveis seguidos', 'diferença = λ ÷ 2'), ('onda', 'Velocidade da onda', 'v = λ · f'), ('termometro', 'Som e temperatura', 'v = 331 + 0,6 · T')],
    origem=['No tubo com água, o ar na água não se mexe (nó) e na boca se mexe o máximo (ventre). Cabe λ ÷ 4, depois 3 · λ ÷ 4, depois 5 · λ ÷ 4... mas o ventre fica um pouco acima da borda.',
            'Por isso cada coluna medida é λ ÷ 4 (ou 3 · λ ÷ 4) menos uma folga que não foi dada. Entre dois níveis seguidos a folga é a mesma e some na subtração: sobra λ ÷ 2.'],
    eq='T = (V − 331) ÷ 0,6', leitura='temperatura = (velocidade do som − 331) ÷ 0,6',
    letras=[('T', 'temperatura do ar, em °C (o que a questão quer)'), ('V', 'velocidade do som no tubo, em m/s'),
            ('L', 'comprimento de onda do som, em m'), ('D', 'diferença entre os dois níveis, em m')],
    eq_texto='A fórmula do enunciado é V = 331 + 0,6 · T. Desfazendo de trás para frente, sai T = (V − 331) ÷ 0,6.\nAgora é só achar V, L e D.',
    achando=[('Achando V: a velocidade do som',
              'V = λ · f = L · 500. Falta o L. A velocidade vem do comprimento de onda e da frequência do diapasão.'),
             ('Achando L: o comprimento de onda',
              'Entre dois níveis seguidos cabe meia onda: D = L ÷ 2, então L = 2 · D. Falta o D.'),
             ('Achando D: a diferença dos níveis',
              '50,0 − 16,0 = 34,0 cm = 0,34 m. L = 2 · 0,34 = 0,68 m.\nV = 0,68 · 500 = 0,68 · 5 · 100 = 3,4 · 100 = 340 m/s.')],
    volta='T = (340 − 331) ÷ 0,6 = 9 ÷ 0,6 = 90 ÷ 6 = 15 °C.\nResposta: alternativa X. Conferindo: 331 + 0,6 · 15 = 331 + 9 = 340 m/s.',
    valores=[('D', '0,34 m'), ('L', '0,68 m'), ('V', '340 m/s')],
    porque=('Por que não usar só o nível de 16 cm?', 'Porque 16 cm é λ ÷ 4 menos uma folga na boca, que o enunciado não deu. 4 · 16 = 64 cm erra: daria v = 320 m/s e −18 °C. A diferença cancela a folga.'),
    pista='"dois níveis de ressonância seguidos" → a diferença é λ ÷ 2 (a folga da boca some); depois v = λ · f e a temperatura pela fórmula do som.',
    rec1='500 Hz; níveis 16,0 e 50,0 cm; v = 331 + 0,6 · T', rec3='D = 0,34; L = 0,68; V = 340',
    checagem=('Num tubo fechado, dois níveis seguidos de ressonância ficam a 15 cm e 55 cm. Qual o comprimento de onda?', ['80 cm', '40 cm', '60 cm', '55 cm'], '80 cm',
              'Diferença: 55 − 15 = 40 cm = λ ÷ 2, então λ = 2 · 40 = 80 cm.'),
    ancora='forte · ENEM 2020 q.114 (ressonâncias seguidas em tubo fechado: o dado medido não é a fundamental) e Fuvest 2024 F03 (ventres, nós e comprimento)',
    canal='fora do canal: tubo com água e níveis de ressonância (o canal só cita harmônicos em fis-16-som-acustica-e-efeito-doppler.txt [13:19:32]); v = λ · f em fis-09-ondulatoria.txt [8:45:01]',
    antes=['numero-que-falta', 'dividir-por-decimal'],
))

# ============ d) Harvard-MIT: mdc e f1 = mdc ÷ k (a fundamental não precisa ser inteira) ============
from fractions import Fraction

COMP, FA, FB, PISO = Fraction(9, 10), 420, 700, 20
MDC = math.gcd(FA, FB)
assert MDC == 140 and 700 - 420 == 280 and math.gcd(420, 280) == 140 and math.gcd(140, 280) == 140 and 280 == 2 * 140
# força bruta com frações: f1 vale se 420 ÷ f1 e 700 ÷ f1 são inteiros; f1 = 140 ÷ k, testado para k de 1 a 400
POSSIVEIS = [Fraction(MDC, k) for k in range(1, 401)
             if (FA / Fraction(MDC, k)).denominator == 1 and (FB / Fraction(MDC, k)).denominator == 1 and Fraction(MDC, k) >= PISO]
assert len(POSSIVEIS) == 7 and POSSIVEIS[-1] == 20 and POSSIVEIS[0] == 140
# conferência independente: varre f1 de 20 a 700 em passos de 1/60 Hz (todo valor possível é 140 ÷ k, e 60 é múltiplo dos k pedidos até 7 e mais)
achados = [Fraction(i, 60) for i in range(20 * 60, 700 * 60 + 1)
           if (FA / Fraction(i, 60)).denominator == 1 and (FB / Fraction(i, 60)).denominator == 1]
assert achados == sorted(POSSIVEIS) and len(achados) == 7
assert Fraction(MDC, 8) < PISO and Fraction(MDC, 3) == Fraction(140, 3)    # k = 8 dá 17,5 Hz (abaixo do piso); k = 3 dá 46,67 Hz
assert FA / Fraction(140, 3) == 9 and FB / Fraction(140, 3) == 15           # k = 3: modos 9 e 15
VELOCS = [2 * COMP * f for f in POSSIVEIS]
assert [float(v) for v in VELOCS] == [252, 126, 84, 63, 50.4, 42, 36] and len(set(VELOCS)) == 7
assert all(2 * COMP * Fraction(MDC, k) == Fraction(252, k) for k in range(1, 8))
# distratores (nenhum coincide com a certa 7)
DIVS = sorted(d for d in range(1, MDC + 1) if MDC % d == 0)
assert len(DIVS) == 12                                                      # 12: todos os divisores de 140
assert len([d for d in DIVS if d >= PISO]) == 5                             # 5: f1 só inteiro
assert FA % 280 != 0                                                        # 1: modos vizinhos dariam f1 = 280, que não divide 420
assert len({1, 5, 7, 12, 140}) == 5 and 7 not in (1, 5, 12, 140)
assert math.gcd(30, 50) == 10 and [Fraction(10, k) for k in range(1, 20) if Fraction(10, k) >= 3] == [10, 5, Fraction(10, 3)]
Q.append(dict(
    id='d2-escada-fis-ita-ond-00d', materia='Física', tema=T, calc=7,
    enunciado=('Uma corda de violão de 0,9 m, presa nas duas pontas, vibra num modo estacionário de 420 Hz e, em outra situação, num modo de 700 Hz. Não se sabe quais são esses '
               'modos, nem se há outros entre eles. A frequência fundamental dessa corda é audível, isto é, de pelo menos 20 Hz, e não precisa ser um número inteiro de hertz. '
               'A tensão da corda, e portanto a velocidade das ondas nela, é desconhecida. Quantos valores diferentes essa velocidade pode ter?'),
    dados=[('Corda', '0,9 m, presa nas duas pontas'), ('Dois modos vistos', '420 Hz e 700 Hz'), ('Fundamental', 'pelo menos 20 Hz, não precisa ser inteira')],
    alts=[('1', 1, 'Supôs modos vizinhos: f1 = 700 − 420 = 280 Hz (e 420 nem é múltiplo de 280)'),
          ('5', 5, 'Exigiu f1 inteira: só os divisores de 140 que passam de 20 (20, 28, 35, 70, 140)'),
          ('7', 7, 'OK'),
          ('12', 12, 'Contou todos os divisores de 140, esquecendo o piso de 20 Hz'),
          ('140', 140, 'Deu o mdc (140) em vez de contar os valores')],
    resumo='420 = m · f1 e 700 = n · f1 com m e n inteiros: f1 = 140 ÷ k. Com f1 ≥ 20, k vai de 1 a 7 (140 ÷ 7 = 20; 140 ÷ 8 = 17,5). v = 1,8 · f1 = 252 ÷ k: sete valores.',
    ideia='Os modos são f1, 2 · f1, 3 · f1 e assim por diante, então 420 e 700 são múltiplos inteiros de f1, e f1 é o mdc (140) dividido por um inteiro k. O piso de 20 Hz limita k, e cada k dá uma velocidade diferente.',
    pecas=[('mdc dividido por k', 'O maior f1 possível é o mdc, 140 Hz. Dividindo-o por 2, 3, 4... os dois modos continuam a ser múltiplos inteiros de f1, só que mais altos (o 6º e o 10º, o 9º e o 15º...).')],
    formulas=[('onda', 'Modos da corda', 'f = n · f1, com n = 1, 2, 3...'), ('onda', 'Velocidade na corda', 'v = 2 · L · f1'), ('contagem', 'Fundamental possível', 'f1 = mdc ÷ k')],
    origem=['Corda presa nas pontas: os modos são f1, 2 · f1, 3 · f1... Se 420 é m · f1 e 700 é n · f1, com m e n inteiros que não conhecemos, então f1 cabe um número inteiro de vezes nos dois.',
            'Não dá para só subtrair 700 − 420 = 280: isso valeria para modos vizinhos, e o enunciado não diz isso. Com f1 = 140, os modos são o 3º e o 5º. Com f1 = 70, o 6º e o 10º.',
            'O enunciado não pede f1 inteira. 140 ÷ 3 = 46,67 Hz serve: 420 ÷ 46,67 = 9 e 700 ÷ 46,67 = 15, os dois inteiros.'],
    eq='N = quantos F = G ÷ k, com F pelo menos 20', leitura='número de velocidades = número de fundamentais possíveis (todas diferentes)',
    letras=[('N', 'quantidade de velocidades possíveis (o que a questão quer)'), ('G', 'maior divisor comum de 420 e 700 (o mdc)'),
            ('k', 'inteiro que divide G para formar cada fundamental F possível')],
    eq_texto='Cada fundamental F = G ÷ k dá uma velocidade (v = 2 · 0,9 · F), todas diferentes. Contar velocidades é contar valores de k.\nAgora é só achar G e k.',
    achando=[('Achando G: o mdc de 420 e 700',
              'Troque o maior pela diferença: 700 − 420 = 280, e mdc(420, 700) = mdc(420, 280).\n420 − 280 = 140: mdc(140, 280). Como 280 = 2 · 140, G = 140.\nO maior F possível é 140: modos 3º e 5º.'),
             ('Achando k: quantos inteiros servem',
              'Se F = 140 ÷ k, os modos viram 3 · k e 5 · k, inteiros: qualquer k inteiro serve.\nO piso: 140 ÷ k pelo menos 20, ou seja, 140 ÷ 20 = 7: k é no máximo 7. Teste: 140 ÷ 7 = 20 (serve) e 140 ÷ 8 = 17,5 (não).\nk = 1, 2, 3, 4, 5, 6, 7.')],
    volta='N = 7 valores de k, logo 7 velocidades: v = 1,8 · F = 252 ÷ k.\nResposta: alternativa X. Valores: 252; 126; 84; 63; 50,4; 42; 36 m/s, todos diferentes. Conferindo k = 3: F = 46,67 Hz, e 420 ÷ 46,67 = 9, 700 ÷ 46,67 = 15.',
    valores=[('G', '140'), ('k', '1, 2, 3, 4, 5, 6, 7')],
    pista='"dois modos, sem dizer se são vizinhos" → f1 = mdc ÷ k, com k inteiro; o piso de frequência limita k; conte os k.',
    rec1='0,9 m; modos 420 e 700 Hz; fundamental ≥ 20 Hz', rec3='G = 140; k = 1 a 7',
    checagem=('Dois modos de uma corda são 30 Hz e 50 Hz (não se sabe se são vizinhos), e a fundamental é de pelo menos 3 Hz. Quantas fundamentais são possíveis?', ['3', '2', '1', '4'], '3',
              'mdc(30, 50) = 10. F = 10 ÷ k pelo menos 3: k = 1, 2, 3 (10; 5; 3,33). Com k = 4, F = 2,5 fica abaixo de 3. São 3.'),
    ancora='parcial · HMMT Fev 2022 Álgebra e Teoria dos Números q.6 e HMMT Nov 2021 Guts q.11 (técnica: mdc e contagem de divisores); sem Física no HMMT',
    canal='fora do canal: corda com modos desconhecidos e mdc; v = λ · f em fis-09-ondulatoria.txt [8:45:01]',
    antes=['ond-divisor-comum'],
))

# ============ aulas "Antes" novas ============
def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


ANTES_NOVOS = {
    'ond-incognita-dos-dois-lados': {
        'titulo': 'Número escondido dos dois lados',
        'linhas': [
            'Às vezes o número escondido (U) aparece dos dois lados da igualdade. Exemplo: 3 · (12 − U) = 12 + U.',
            'Primeiro abra o parêntese: 3 · 12 = 36 e 3 · U = 3U. Fica 36 − 3U = 12 + U.',
            'Some 3U dos dois lados, para os U ficarem juntos: 36 = 12 + U + 3U, ou seja, 36 = 12 + 4U.',
            'Tire 12 dos dois lados: 24 = 4U. Divida por 4: U = 6. Confira: 3 · (12 − 6) = 18 e 12 + 6 = 18.',
            'Outro: 7 · (10 − U) = 3 · (10 + U). 70 − 7U = 30 + 3U. 70 = 30 + 10U. 40 = 10U. U = 4.',
        ],
        'visual': tabela('Passo a passo', ['Passo', '3 · (12 − U) = 12 + U'], [['Abrir o parêntese', '36 − 3U = 12 + U'], ['Juntar os U', '36 = 12 + 4U'], ['Tirar 12', '24 = 4U'], ['Dividir por 4', 'U = 6']]),
        'exercicios': [
            {'enunciado': '2 · (9 − U) = 9 + U. Quanto vale U?', 'alternativas': ['3', '9', '6', '1'], 'certa': 0,
             'resolucao': '3: 2 · 9 = 18, então 18 − 2U = 9 + U; 18 = 9 + 3U; 9 = 3U; U = 3.\n9 esquece de dividir por 3; 6 é 18 ÷ 3; 1 é 3 − 2.'},
            {'enunciado': '5 · (20 − U) = 3 · (20 + U). Quanto vale U?', 'alternativas': ['5', '40', '8', '10'], 'certa': 0,
             'resolucao': '5: 100 − 5U = 60 + 3U; 100 = 60 + 8U; 40 = 8U; U = 5.\n40 esquece de dividir por 8; 8 é o número que multiplica U; 10 é 40 ÷ 4.'},
        ],
    },
    'ond-divisor-comum': {
        'titulo': 'Divisor comum e mdc',
        'linhas': [
            'Divisores de 12: 1, 2, 3, 4, 6 e 12 (os que cabem certinho). Divisores de 18: 1, 2, 3, 6, 9 e 18.',
            'Divisor comum é o que cabe nos dois números: 1, 2, 3 e 6 aparecem nas duas listas.',
            'O maior deles é o mdc (maior divisor comum): mdc(12, 18) = 6. Todo divisor comum é divisor do mdc.',
            'Os divisores de 6 são 1, 2, 3 e 6: exatamente os divisores comuns. Para achá-los, liste os divisores do mdc.',
            'Atalho: o mdc não muda se você troca o maior número pela diferença. 18 − 12 = 6, então mdc(12, 18) = mdc(12, 6) = 6.',
            'Liste divisores em pares: 1 · 6, 2 · 3. Os maiores que 2: 3 e 6. São 2.',
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
    assert all(len(l) <= 170 for l in _c['linhas']), _id
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['resolucao'].split('\n')[0].count(_e['alternativas'][_e['certa']].split(' ')[0]) >= 1
        assert len(set(_e['alternativas'])) == len(_e['alternativas'])
assert 3 * (12 - 6) == 12 + 6 and 7 * (10 - 4) == 3 * (10 + 4) and 2 * (9 - 3) == 9 + 3 and 5 * (20 - 5) == 3 * (20 + 5)
assert math.gcd(20, 30) == 10 and [d for d in range(1, 25) if 24 % d == 0 and d > 5] == [6, 8, 12, 24]
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
    assert len(_q['ideia']) <= 300, _q['id']
