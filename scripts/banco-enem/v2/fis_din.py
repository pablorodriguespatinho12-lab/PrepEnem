"""Nível acima v2 de Física: Dinâmica e Leis de Newton (23/11/2026).

a = ENEM (elevador em 3 fases lido no painel), b = ITA (sobe, para e volta com atrito),
c = Fuvest (bloco sobre prancha, teste de escorregamento), d = Harvard-MIT (pêndulo com pino, resposta sem o comprimento).
Nenhuma das 4 antigas fica (a, b, d REESCREVER; c TROCAR). Conferido por assert no próprio módulo.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_din
"""
import math

ARQUIVO = 'fisica-acima-novas.json'
T = 'Dinâmica e Leis de Newton'
G = 10

Q = []
MANTER = {}
ANTES_NOVOS = {}

# ============ a) ENEM: elevador em 3 fases, leitura da balança em kg ============
def leitura(m, a):
    return m * (G + a) / G  # kg: força na balança (N) dividida por g


MASSA = 52 + 8
V_MS = 21.6 / 3.6
assert abs(V_MS - 6) < 1e-9
A1 = V_MS / 3
A3 = (0 - V_MS) / 2
assert (A1, A3) == (2, -3)
L1, L2, L3 = leitura(MASSA, A1), leitura(MASSA, 0), leitura(MASSA, A3)
assert (L1, L2, L3) == (72, 60, 42) and max(L1, L2, L3) - min(L1, L2, L3) == 30
# erros típicos
assert L1 - L2 == 12                                              # só subida acelerada contra constante
assert leitura(52, A1) - leitura(52, A3) == 26                    # esqueceu a mochila (52 kg): 62,4 - 36,4
assert abs(leitura(MASSA, 21.6 / 3) - leitura(MASSA, -21.6 / 2) - 108) < 1e-9  # 21,6 sem converter: a = 7,2 e -10,8
assert (L1 - L3) * G == 300                                       # em newtons
assert 0.5 * 6 * 3 + 6 * 7 + 0.5 * 6 * 2 == 57                   # altura percorrida (não é pedida)
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
          ('108', 108, 'Usou 21,6 sem passar para m/s: a = 7,2 e a = −10,8'),
          ('300', 300, 'Deu a diferença em newtons, sem dividir por g')],
    resumo='Massa 60 kg; 21,6 km/h = 6 m/s; a = +2 (0 a 3 s), 0 e −3 (10 a 12 s); leituras 72, 60 e 42 kg; 72 − 42 = 30 kg.',
    ideia='A balança mostra a força que o chão faz, dividida por g. Acelerando para cima ela mostra mais que a massa; freando enquanto sobe, mostra menos.',
    pecas=[('Leitura da balança', 'A força que a pessoa faz na balança, dividida por g. Parado ou em velocidade constante, mostra a massa; acelerando para cima, mostra mais.')],
    formulas=[('carro', 'km/h para m/s', 'm/s = km/h ÷ 3,6'), ('carro', 'Aceleração', 'a = (v final − v inicial) ÷ tempo'),
              ('carro', 'Leitura da balança', 'kg = m · (g + a) ÷ g')],
    origem=['Na subida acelerada, o chão empurra para cima com a força N e o peso puxa para baixo. A diferença é a massa vezes a aceleração: N − m · g = m · a, então N = m · (g + a).',
            'A balança mostra N ÷ g. Se o elevador sobe mas está freando, a aceleração é negativa: g + a fica menor que g, e a leitura cai abaixo da massa.'],
    eq='D = S − F', leitura='diferença = leitura mais alta − leitura mais baixa',
    letras=[('D', 'diferença entre a maior e a menor leitura, em kg (o que a questão quer)'), ('S', 'leitura na arrancada (0 a 3 s), em kg'), ('F', 'leitura na freada (10 a 12 s), em kg')],
    eq_texto='A leitura mais alta é a da arrancada e a mais baixa é a da freada. Falta conferir a parte do meio e achar cada leitura.\nAgora é só achar S e F.',
    achando=[('Achando S: a leitura na arrancada',
              'Massa na balança: 52 + 8 = 60 kg. 21,6 km/h ÷ 3,6 = 6 m/s. De 0 a 3 s: a = 6 ÷ 3 = 2 m/s², para cima.\nN = 60 · (10 + 2) = 720 N. S = 720 ÷ 10 = 72 kg.'),
             ('Achando F: a leitura na freada',
              'De 10 a 12 s a velocidade cai de 6 a 0 m/s em 2 s: a = (0 − 6) ÷ 2 = −3 m/s².\nN = 60 · (10 − 3) = 420 N. F = 420 ÷ 10 = 42 kg.\nDe 3 a 10 s, a = 0 e a leitura é 60 kg: fica no meio, não é a maior nem a menor.')],
    volta='D = 72 − 42 = 30 kg.\nResposta: alternativa X. Conferindo: 60 · (2 − (−3)) ÷ 10 = 30 kg.',
    valores=[('S', '72 kg'), ('F', '42 kg')],
    pista='"balança no elevador" com velocidade em tabela → ache a aceleração de cada trecho (variação da velocidade ÷ tempo) e use N = m · (g + a), dividindo por g no fim.',
    rec1='60 kg no total; 0, 21,6, 21,6, 0 km/h em 0, 3, 10, 12 s', rec3='S = 72 kg; F = 42 kg',
    checagem=('Uma pessoa de 50 kg está num elevador que acelera 2 m/s² para cima (g = 10). Quanto a balança mostra?', ['60 kg', '40 kg', '50 kg', '600 kg'], '60 kg',
              'N = 50 · (10 + 2) = 600 N; 600 ÷ 10 = 60 kg.'),
    ancora='parcial · ENEM 2023 q.114 (carga no caminhão: 2ª lei com aceleração e duas situações, arrancada e freada; aqui três fases lidas num painel)',
    canal='fis-02-leis-de-newton.txt [1:12:00] (elevador acelerando para cima; a balança mede a normal)',
    antes=['aceleracao'],
))

# ============ b) ITA: sobe, para e volta com atrito ============
M, V0, MU = 2, 12, 0.45
SEN, COS = 3 / 5, math.sqrt(1 - (3 / 5) ** 2)
assert abs(COS - 0.8) < 1e-12 and 3 ** 2 + 4 ** 2 == 5 ** 2
PUXA, APERTA = M * G * SEN, M * G * COS
ATRITO = MU * APERTA
assert (round(PUXA, 9), round(APERTA, 9), round(ATRITO, 9)) == (12, 16, 7.2)
S_SUBE = (PUXA + ATRITO) / M
D_SUBE = V0 ** 2 / (2 * S_SUBE)
assert (round(S_SUBE, 9), round(D_SUBE, 9)) == (9.6, 7.5)
assert SEN / COS > MU and PUXA > ATRITO                      # tan 0,75 > 0,45: desce
R_DESCE = (PUXA - ATRITO) / M
V_VOLTA = math.sqrt(2 * R_DESCE * D_SUBE)
assert round(R_DESCE, 9) == 2.4 and abs(V_VOLTA - 6) < 1e-9
# conferência por energia: 144 J - 2 · 54 J = 36 J = ½ · 2 · V²
assert abs(0.5 * M * V0 ** 2 - 2 * ATRITO * D_SUBE - 0.5 * M * V_VOLTA ** 2) < 1e-9
# erros típicos
assert abs(math.sqrt(2 * (PUXA / M) * D_SUBE) - math.sqrt(90)) < 1e-9 and round(math.sqrt(90), 1) == 9.5  # sem atrito na descida
d_sem = V0 ** 2 / (2 * (PUXA / M))                                                                       # sem atrito na subida
assert d_sem == 12 and round(math.sqrt(2 * R_DESCE * d_sem), 1) == 7.6
Q.append(dict(
    id='d2-escada-fis-ita-din-00b', materia='Física', tema=T, calc=6,
    enunciado=('Uma rampa fixa sobe 3 m de altura a cada 5 m percorridos ao longo dela. Um bloco de 2 kg é lançado da base da rampa, para cima, com velocidade de '
               '12 m/s. O coeficiente de atrito entre o bloco e a rampa vale 0,45, tanto o estático quanto o cinético. Adote g = 10 m/s². '
               'O módulo da velocidade do bloco ao voltar à base da rampa, em m/s, é:'),
    dados=[('Massa', '2 kg'), ('Velocidade de lançamento', '12 m/s'), ('Rampa', '3 m de altura a cada 5 m de rampa'),
           ('Atrito (estático = cinético)', '0,45'), ('Gravidade', '10 m/s²')],
    alts=[('0', 0, 'Achou que o bloco para na subida e fica parado, sem testar se ele desce'),
          ('6', 6, 'OK'),
          ('7,6', 7.5895, 'Esqueceu o atrito na subida (d = 12 m) e só o usou na descida'),
          ('9,5', 9.4868, 'Usou a distância certa (7,5 m), mas esqueceu o atrito na descida'),
          ('12', 12, 'Voltou igual, como se não houvesse atrito (ou deixou o atrito freando também na descida)')],
    resumo='sen 0,6 e cos 0,8; subida: (12 + 7,2) ÷ 2 = 9,6 m/s², d = 144 ÷ 19,2 = 7,5 m; desce (12 > 7,2): (12 − 7,2) ÷ 2 = 2,4 m/s²; V² = 2 · 2,4 · 7,5 = 36.',
    ideia='O bloco só desce se a parte do peso que puxa vencer o atrito. Se descer, o atrito troca de sentido: freava a subida e agora segura a descida, e a volta é mais lenta.',
    pecas=[('Atrito troca de lado', 'O atrito sempre se opõe ao movimento: na subida aponta rampa abaixo; na descida, rampa acima.')],
    formulas=[('triangulo-retangulo', 'Seno e cosseno', 'sen = 3 ÷ 5 e cos = 4 ÷ 5'), ('caixa', 'Atrito', 'atrito = μ · força que aperta'),
              ('carro', 'Torricelli', 'v² = v inicial² + 2 · a · d')],
    eq='V = √(2 · r · d)', leitura='velocidade na volta = raiz de (2 · aceleração na descida · distância percorrida)',
    letras=[('V', 'velocidade ao voltar à base, em m/s (o que a questão quer)'), ('r', 'aceleração do bloco na descida, em m/s²'),
            ('d', 'distância que ele sobe, em m'), ('s', 'desaceleração na subida, em m/s² (entra na conta de d)')],
    eq_texto='Na volta o bloco parte do repouso lá em cima e desce a mesma distância d que subiu, com a aceleração r da descida.\nAgora é só achar s, d e r.',
    achando=[('Achando s: a desaceleração na subida',
              'Triângulo 3, 4, 5: seno = 3 ÷ 5 = 0,6 e cosseno = 4 ÷ 5 = 0,8. Peso: 2 · 10 = 20 N.\nPuxa rampa abaixo: 0,6 · 20 = 12 N. Aperta: 0,8 · 20 = 16 N. Atrito: 0,45 · 16 = 7,2 N.\nSubindo, os dois freiam: 12 + 7,2 = 19,2 N. s = 19,2 ÷ 2 = 9,6 m/s².'),
             ('Achando d: a distância que ele sobe',
              'Sobe até parar: 12 · 12 = 2 · s · d, ou seja, 144 = 19,2 · d.\nd = 144 ÷ 19,2 = 1 440 ÷ 192 = 7,5 m.'),
             ('Achando r: a aceleração na descida',
              'Ele desce? Só se o que puxa (12 N) vencer o atrito máximo (7,2 N). 12 é maior que 7,2: desce.\nAgora o atrito aponta rampa acima e segura: 12 − 7,2 = 4,8 N. r = 4,8 ÷ 2 = 2,4 m/s².')],
    volta='V = √(2 · 2,4 · 7,5) = √36 = 6 m/s.\nResposta: alternativa X. Conferindo pela energia: 144 J no lançamento, menos 54 J de atrito na subida e 54 J na descida, sobram 36 J = ½ · 2 · 6².',
    valores=[('s', '9,6 m/s²'), ('d', '7,5 m'), ('r', '2,4 m/s²')],
    pista='"sobe, para e volta" com atrito → faça a subida com peso e atrito juntos; teste se ele desce (parte do peso > atrito); na descida o atrito troca de lado.',
    rec1='2 kg, 12 m/s, rampa 3-4-5, atrito 0,45', rec3='s = 9,6; d = 7,5; r = 2,4',
    checagem=('Um bloco de 1 kg está numa rampa com seno 0,6 e cosseno 0,8; o atrito é 0,9. Ele desce sozinho? (g = 10)', ['Não: 6 N < 7,2 N', 'Sim: 6 N > 7,2 N', 'Sim: 8 N > 5,4 N', 'Não: 8 N < 9 N'], 'Não: 6 N < 7,2 N',
              'Puxa: 0,6 · 10 = 6 N. Atrito máximo: 0,9 · 0,8 · 10 = 7,2 N. 6 < 7,2: fica parado.'),
    ancora='parcial · ITA 2025 2ª fase q.3 (atrito mais plano inclinado e 2ª lei com o atrito mudando de papel) e ITA 2021 q.2 (separar força de energia)',
    canal='fora do canal: plano inclinado (0 hits em fis-02 e fis-03); atrito em fis-02-leis-de-newton.txt [1:35:30]',
    antes=['seno-cosseno', 'pitagoras', 'aceleracao'],
))

# ============ c) Fuvest: bloco sobre prancha, teste de escorregamento ============
MA, MB, F, LP = 1, 4, 30, 1.25
MU_AB = 0.40  # borracha e madeira (da tabela)
juntos = F / (MA + MB)
assert juntos == 6 and MA * juntos > MU_AB * MA * G         # 6 N pedidos > 4 N possíveis: escorrega
PA = MU_AB * MA * G / MA
QB = (F - MU_AB * MA * G) / MB
RR = QB - PA
assert (PA, QB, RR) == (4, 6.5, 2.5)
TEMPO = math.sqrt(2 * LP / RR)
assert abs(TEMPO - 1) < 1e-12
# erros típicos
assert round(math.sqrt(2 * LP / (juntos - PA)), 1) == 1.1                  # usou 6 juntos menos 4
assert round(math.sqrt(2 * LP / ((F / MB) - PA)), 2) == 0.85              # esqueceu o atrito em B
assert round(math.sqrt(LP / RR), 1) == 0.7                                # esqueceu o ½
assert round(math.sqrt(2 * LP / QB), 1) == 0.6                            # tratou A como parado no chão
Q.append(dict(
    id='d2-escada-fis-ita-din-00c', materia='Física', tema=T, calc=1,
    enunciado=('Num laboratório, uma prancha B de madeira, com 4 kg e 1,25 m de comprimento, está sobre uma mesa horizontal sem atrito. Sobre a extremidade dianteira '
               'da prancha repousa um bloco pequeno A, de borracha, com 1 kg. A tabela traz os coeficientes de atrito medidos no laboratório, iguais para o estático e o cinético.\n\n'
               'Borracha e madeira: 0,40\nBorracha e aço: 0,60\nMadeira e aço: 0,20\nMadeira e madeira: 0,50\n\n'
               'No instante t = 0, uma força horizontal constante de 30 N passa a puxar a prancha para frente, e o bloco, que parte do repouso, pode ou não '
               'escorregar sobre ela. Adote g = 10 m/s². Quanto tempo, em segundos, o bloco leva para cair pela extremidade traseira da prancha?'),
    dados=[('Bloco A (borracha)', '1 kg'), ('Prancha B (madeira)', '4 kg, 1,25 m'), ('Força em B', '30 N, para frente'), ('Mesa', 'sem atrito'), ('Gravidade', '10 m/s²')],
    alts=[('0,6', 0.62, 'Tratou A como parado no chão: só a aceleração de B (6,5), sem a de A'),
          ('0,7', 0.7071, 'Esqueceu o ½ da distância: usou d = a · t²'),
          ('0,85', 0.8452, 'Esqueceu o atrito sobre B: a de B = 30 ÷ 4 = 7,5'),
          ('1,0', 1, 'OK'),
          ('1,1', 1.118, 'Supôs os dois juntos (a = 6) e subtraiu a de A (4): relativa 2, não 2,5')],
    resumo='Juntos: a = 6; A precisaria de 6 N e o atrito dá no máximo 4 N, então escorrega. A: 4 m/s²; B: (30 − 4) ÷ 4 = 6,5 m/s²; relativa 2,5; t = √(2 · 1,25 ÷ 2,5) = 1 s.',
    ideia='Primeiro teste se os dois andam juntos: o atrito máximo (4 N) não segura o bloco, que escorrega. O atrito age nos dois, em sentidos opostos, e o bloco fica para trás.',
    pecas=[('Aceleração relativa', 'Quanto a prancha ganha do bloco a cada segundo: aceleração de B menos aceleração de A.')],
    formulas=[('caixa', 'Atrito máximo', 'atrito = μ · m · g'), ('carro', '2ª lei', 'força = massa · aceleração'), ('carro', 'Distância a partir do repouso', 'd = a · t² ÷ 2')],
    eq='T = √(2 · L ÷ R)', leitura='tempo = raiz de (2 · distância relativa ÷ aceleração relativa)',
    letras=[('T', 'tempo até A cair, em s (o que a questão quer)'), ('L', 'distância que A anda para trás em relação a B, em m'),
            ('R', 'aceleração de B menos a de A, em m/s²'), ('P', 'aceleração do bloco A, em m/s²'), ('Q', 'aceleração da prancha B, em m/s²')],
    eq_texto='Em relação à prancha, o bloco parte do repouso e anda para trás o comprimento L com a aceleração R.\nAgora é só achar P, Q, R e L.',
    achando=[('Achando P: a aceleração do bloco A',
              'Teste: se andassem juntos, a = 30 ÷ 5 = 6 m/s², e A precisaria de 1 · 6 = 6 N de atrito.\nO máximo, com borracha e madeira, é 0,40 · 1 · 10 = 4 N. 6 > 4: A escorrega.\nÚnica força horizontal em A: 4 N. P = 4 ÷ 1 = 4 m/s².'),
             ('Achando Q: a aceleração da prancha B',
              'Sobre B: puxa 30 N para frente. O bloco A empurra B para trás com 4 N (ação e reação).\nForça em B: 30 − 4 = 26 N. Q = 26 ÷ 4 = 6,5 m/s².'),
             ('Achando R: a aceleração relativa',
              'B ganha de A a cada segundo: R = 6,5 − 4 = 2,5 m/s².'),
             ('Achando L: quanto A anda em relação a B',
              'A começa na ponta da frente. Para cair pela ponta de trás, tem de ficar para trás o comprimento todo da prancha.\nL = 1,25 m.')],
    volta='T = √(2 · 1,25 ÷ 2,5) = √1 = 1 s.\nResposta: alternativa X. Conferindo: em 1 s, B anda 3,25 m, A anda 2 m, e 3,25 − 2 = 1,25 m.',
    valores=[('P', '4 m/s²'), ('Q', '6,5 m/s²'), ('R', '2,5 m/s²'), ('L', '1,25 m')],
    pista='"bloco sobre prancha" e força numa só → teste se andam juntos (atrito necessário × atrito máximo); se escorrega, atrito cinético nos dois, em sentidos opostos.',
    rec1='A 1 kg, B 4 kg, 30 N em B, μ = 0,40, prancha 1,25 m', rec3='P = 4; Q = 6,5; R = 2,5; L = 1,25',
    checagem=('Um bloco de 2 kg está sobre uma prancha, com μ = 0,5 entre eles (g = 10). Qual a maior aceleração que o atrito pode dar ao bloco?', ['5 m/s²', '10 m/s²', '1 m/s²', '2,5 m/s²'], '5 m/s²',
              'Atrito máximo: 0,5 · 2 · 10 = 10 N. a = 10 ÷ 2 = 5 m/s² (é μ · g).'),
    ancora='forte · Fuvest 2021 2ª fase dia 2 F06 (atrito estático como único agente que acelera a caixa; limite μ·g e teste de escorregar)',
    canal='fora do canal: bloco sobre prancha (0 hits); atrito estático e cinético em fis-02-leis-de-newton.txt [1:35:30]',
    antes=['aceleracao', 'queda'],
))

# ============ d) Harvard-MIT: pêndulo com pino, resposta que não depende de L ============
def tracao_topo(L, m=2, d_pino=0.8):
    r = L - d_pino * L                          # raio depois do pino
    queda = d_pino * L - r                      # do nível da fixação ao topo da volta pequena
    w = 2 * G * queda                           # v² no topo
    assert w >= G * r                           # o fio não afrouxa
    return m * w / r - m * G


for L in (1, 1.25, 3, 7.3):
    assert abs(tracao_topo(L) - 100) < 1e-9     # invariante: 5 · m · g, qualquer que seja L
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
          ('120', 120, 'Esqueceu de tirar o peso: deu só m · v² ÷ r'),
          ('140', 140, 'Somou o peso em vez de subtrair, no topo')],
    resumo='r = 0,2 L; queda até o topo = 0,6 L; v² = 12 L; T = 2 · 12 L ÷ 0,2 L − 20 = 120 − 20 = 100 N (5 · m · g, sem depender de L).',
    ideia='Depois do pino o raio é só o pedaço de fio que sobrou, e o topo da volta pequena fica mais baixo que o ponto de fixação. O comprimento L aparece em cima e embaixo da conta e some.',
    pecas=[('Raio muda no pino', 'A esfera passa a girar em torno do pino, então o raio é o pedaço de fio que passou do pino: L − 0,8 L.')],
    formulas=[('carro', 'v² depois da queda', 'v² = 2 · g · queda'), ('circulo', 'Força da curva', 'T + peso = m · v² ÷ raio')],
    origem=['No ponto mais alto da volta, o fio puxa a esfera para baixo, em direção ao pino, e o peso também. As duas juntas fazem a força da curva: T + 20 = 2 · W ÷ r, onde W é v · v.',
            'Por isso T = 2 · W ÷ r − 20. O 20 é o peso: 2 · 10.'],
    eq='T = 2 · W ÷ r − 20', leitura='tração = m · v² ÷ raio − peso',
    letras=[('T', 'tração no fio no ponto mais alto, em N (o que a questão quer)'), ('W', 'velocidade vezes ela mesma (v · v) no ponto mais alto, em m²/s²'),
            ('r', 'raio da circunferência em torno do pino, em m')],
    eq_texto='No topo, a tração mais o peso fazem a força da curva. O L não foi dado: vamos deixar L na conta e ver se ele some.\nAgora é só achar r e W.',
    achando=[('Achando r: o raio em torno do pino',
              'O pino está a 0,8 L da fixação. O fio todo tem L, então passa do pino um pedaço de L − 0,8 L = 0,2 L.\nr = 0,2 L.'),
             ('Achando W: v · v no ponto mais alto',
              'O pino está a 0,8 L abaixo da fixação. O topo fica r = 0,2 L acima do pino: 0,8 L − 0,2 L = 0,6 L abaixo da fixação.\nQueda: 0,6 L. W = 2 · 10 · 0,6 L = 12 L.\nO fio não afrouxa: W = 12 L é maior que g · r = 2 L.')],
    volta='T = 2 · 12 L ÷ 0,2 L − 20 = 24 L ÷ 0,2 L − 20. O L corta: 24 ÷ 0,2 = 120, pois cada 1 cabe 5 vezes de 0,2 e 24 · 5 = 120.\nT = 120 − 20 = 100 N.\nResposta: alternativa X. Conferindo com L = 1 m: W = 12, r = 0,2, e 2 · 12 ÷ 0,2 − 20 = 100.',
    valores=[('r', '0,2 L'), ('W', '12 L')],
    pista='"fio que encosta num pino" → o raio novo é o fio que sobrou; ache a queda até o topo da volta nova; se o L não é dado, ele vai se cortar.',
    rec1='2 kg; fio L; pino a 4/5 de L; solta na horizontal', rec3='r = 0,2 L; W = 12 L',
    checagem=('Uma esfera de 1 kg gira numa circunferência de raio 0,5 m e passa no topo com v · v = 10 (g = 10). Qual a tração no topo?', ['10 N', '30 N', '20 N', '0 N'], '10 N',
              'T + 10 = 1 · 10 ÷ 0,5 = 20, então T = 20 − 10 = 10 N.'),
    ancora='parcial · ENEM 2022 q.112 CD7 (energia + centrípeta, tração sem precisar do comprimento) e IME 2025 q.3 (fio que encosta na barra: o raio muda)',
    canal='fis-03-movimento-circular.txt [2:02:31] (a tensão do fio faz o papel de força centrípeta)',
    antes=['queda', 'curva'],
))
