"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Eletricidade
(corrente, U = R·i, série, paralelo, potência, energia em kWh) e um que junta.
Âncoras reais (só estudo): ENEM 2020 D2 (resistores num divisor de tensão), ENEM 2022 D2
(choque com bateria; ducha), ENEM 2023 D2 (lâmpadas e resistores), ENEM 2019 D2
(consumo de energia numa casa). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_eletricidade"""

ARQUIVO = '../escada/fisica-base-eletricidade'

DIVISOR = 'ENEM 2020 D2 (resistores num divisor de tensão)'
CHOQUE = 'ENEM 2022 D2 (corrente no corpo com bateria)'
DUCHA = 'ENEM 2022 D2 (ducha elétrica)'
LAMPADAS = 'ENEM 2023 D2 (lâmpadas e resistores)'
CASA = 'ENEM 2019 D2 (consumo de energia numa casa)'


def F(nivel='facil'):
  return {'materia': 'Física', 'tema': 'Eletricidade e Circuitos', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**F(), id='d2-escada-fis-ele-03', resp='C', objeto='fio de um carregador', cobra='corrente = carga ÷ tempo', confere=20 / 4,
  ancora=CHOQUE, canal='fis-12 [11:23:30] corrente é a carga que passa dividida pelo tempo',
  enun='Por um ponto do fio de um carregador passam 20 C de carga elétrica em 4 segundos, sempre no mesmo ritmo. Qual é a corrente elétrica?',
  alts=['80 A', '16 A', '5 A', '0,2 A', '24 A'],
  ideia='Corrente é quanta carga passa em 1 segundo: 20 em 4 segundos dá 5 em cada segundo.',
  pecas=[('C', 'Lê-se coulomb: mede a carga, a eletricidade que corre pelo fio.'), ('A', 'Lê-se ampere: coulombs que passam a cada segundo.')],
  conferencia='20/4 = 5 A. C. A = 20×4; B = 20-4; D = 4/20; E = 20+4.',
  sua_vez=('Passam 30 C em 10 s. Corrente?', ['3 A', '300 A', '20 A', '40 A'], '3 A', '30 ÷ 10 = 3 A.'),
  aula=dict(
    formulas=[('circuito', 'Corrente', 'corrente = carga ÷ tempo')],
    tenho=[('Carga', '20 C'), ('Tempo', '4 s')],
    quer='A questão quer a carga que passa em 1 segundo.',
    equacao='i = c ÷ t (intensidade da corrente = carga ÷ tempo)',
    porque='Por que dividir? Se passassem 20 C em 2 s, seriam 20 ÷ 2 = 10 C em cada segundo.',
    letras=[('i', 'intensidade da corrente, em A (o que a questão quer)'), ('c', 'carga que passou, em coulombs'), ('t', 'tempo, em segundos')],
    telas=[tela('Achando c (carga)', 'O enunciado dá direto.\nc = 20 C'),
           tela('Achando t (tempo)', 'O enunciado dá direto.\nt = 4 s')],
    volta='i = 20 ÷ 4 = 5 A\nLetra C.',
    valores=[('c', '20 C'), ('t', '4 s')],
    pista='"tanta carga em tantos segundos" → carga ÷ tempo.',
    receita=receita('20 C, 4 s', 'i = c ÷ t', 'c = 20; t = 4', '20 ÷ 4 = 5'))),

dict(**F(), id='d2-escada-fis-ele-04', resp='A', objeto='lanterna', cobra='lei de Ohm: tensão = resistência × corrente', confere=6 * 2,
  ancora=CHOQUE, canal='fis-12 [10:30:31] primeira lei de Ohm: U = R i',
  enun='Numa lanterna, a lâmpada tem resistência de 6 Ω e é atravessada por uma corrente de 2 A. Qual é a tensão na lâmpada?',
  alts=['12 V', '3 V', '8 V', '4 V', '24 V'],
  ideia='Cada ampere que atravessa 6 ohms pede 6 volts: com 2 amperes são 12 volts.',
  pecas=[('Ω', 'Lê-se ohm: o quanto a peça dificulta a corrente.'), ('A', 'Lê-se ampere: a medida da corrente.'), ('V', 'Lê-se volt: a medida da tensão, o empurrão da pilha.')],
  conferencia='6×2 = 12 V. A. B = 6/2; C = 6+2; D = 6-2; E = 6×2×2.',
  sua_vez=('Resistência 10 Ω, corrente 3 A. Tensão?', ['30 V', '13 V', '7 V', '3,3 V'], '30 V', '10 × 3 = 30 V.'),
  aula=dict(
    formulas=[('circuito', 'Lei de Ohm', 'tensão = resistência × corrente')],
    tenho=[('Resistência', '6 Ω'), ('Corrente', '2 A')],
    quer='A questão quer a tensão na lâmpada.',
    equacao='U = R × i (tensão = resistência × corrente)',
    porque='Por que multiplicar? Em 6 Ω, 1 A pede 6 V, e 2 A pedem 6 + 6 = 12 V.',
    letras=[('U', 'tensão, em volts (o que a questão quer)'), ('R', 'resistência, em ohms'), ('i', 'intensidade da corrente, em amperes')],
    telas=[tela('Achando R (resistência)', 'O enunciado dá direto.\nR = 6 Ω'),
           tela('Achando i (corrente)', 'O enunciado dá direto.\ni = 2 A')],
    volta='U = 6 × 2 = 12 V\nLetra A.',
    valores=[('R', '6 Ω'), ('i', '2 A')],
    pista='dá ohms e amperes e pede volts → multiplique.',
    receita=receita('6 Ω, 2 A', 'U = R × i', 'R = 6; i = 2', '6 × 2 = 12'))),

dict(**F(), id='d2-escada-fis-ele-05', resp='D', objeto='dois resistores em fila', cobra='resistência equivalente em série', confere=100 + 200,
  ancora=DIVISOR, canal='fis-12 [10:34:00] em série passa a mesma corrente pelos dois',
  enun='Num brinquedo, um resistor de 100 Ω e outro de 200 Ω estão ligados em série, um depois do outro. Qual é a resistência total dos dois?',
  alts=['100 Ω', '150 Ω', '67 Ω', '300 Ω', '20 000 Ω'],
  ideia='Em série a corrente atravessa um e depois o outro, então as resistências se somam: 100 + 200 = 300 Ω.',
  pecas=[('Resistor', 'Uma peça que dificulta a passagem da corrente.'), ('Ω', 'Lê-se ohm: a medida da resistência.'), ('Em série', 'Um depois do outro, no mesmo caminho.')],
  conferencia='100+200 = 300. D. A = 200-100; B = média; C = fórmula de paralelo; E = produto.',
  sua_vez=('20 Ω e 30 Ω em série. Total?', ['50 Ω', '12 Ω', '10 Ω', '600 Ω'], '50 Ω', '20 + 30 = 50 Ω.'),
  aula=dict(
    formulas=[('circuito', 'Série', 'total = primeira + segunda')],
    tenho=[('Primeiro resistor', '100 Ω'), ('Segundo resistor', '200 Ω')],
    quer='A questão quer a resistência dos dois juntos.',
    equacao='s = a + b (total em série = primeira resistência + segunda)',
    porque='Por que somar? A corrente enfrenta a dificuldade do primeiro e depois a do segundo.',
    letras=[('s', 'resistência total em série (o que a questão quer)'), ('a', 'resistência do primeiro, em ohms'), ('b', 'resistência do segundo, em ohms')],
    telas=[tela('Achando a (primeiro)', 'O enunciado dá direto.\na = 100 Ω'),
           tela('Achando b (segundo)', 'O enunciado dá direto.\nb = 200 Ω')],
    volta='s = 100 + 200 = 300 Ω\nLetra D.',
    valores=[('a', '100 Ω'), ('b', '200 Ω')],
    pista='"em série" → some as resistências.',
    receita=receita('100 Ω e 200 Ω', 's = a + b', 'a = 100; b = 200', '100 + 200 = 300'))),

dict(**F(), id='d2-escada-fis-ele-06', resp='B', objeto='duas lâmpadas lado a lado', cobra='dois resistores iguais em paralelo', confere=40 / 2,
  ancora=LAMPADAS, canal='fis-12 [10:29:33] resistores em série e em paralelo',
  enun='Duas lâmpadas iguais, de 40 Ω cada, estão ligadas em paralelo, cada uma no seu próprio caminho. Qual é a resistência do conjunto?',
  alts=['80 Ω', '20 Ω', '40 Ω', '1 600 Ω', '10 Ω'],
  ideia='Com dois caminhos iguais a corrente passa com metade da dificuldade: 40 ÷ 2 = 20 Ω.',
  pecas=[('Ω', 'Lê-se ohm: a medida da resistência.'), ('Em paralelo', 'Lado a lado: a corrente se divide entre dois caminhos.')],
  conferencia='40/2 = 20. B. A = somou como série; C = não mudou; D = produto; E = 40/4.',
  sua_vez=('Dois resistores de 100 Ω em paralelo. Total?', ['50 Ω', '200 Ω', '100 Ω', '25 Ω'], '50 Ω', '100 ÷ 2 = 50 Ω.'),
  aula=dict(
    formulas=[('circuito', 'Dois iguais em paralelo', 'total = resistência de um ÷ 2')],
    tenho=[('Cada lâmpada', '40 Ω'), ('Lâmpadas', '2 iguais')],
    quer='A questão quer a resistência das duas juntas.',
    equacao='p = R ÷ 2 (total em paralelo = resistência de uma ÷ 2)',
    porque='Por que fica menor? É como abrir uma segunda porta igual: com 2 caminhos, a dificuldade cai pela metade.',
    letras=[('p', 'resistência do conjunto em paralelo (o que a questão quer)'), ('R', 'resistência de uma lâmpada, em ohms')],
    telas=[tela('Achando R (uma lâmpada)', 'O enunciado dá direto.\nR = 40 Ω'),
           tela('O seu jeito', 'Parece certo somar, 40 + 40 = 80, a letra A.\nSomar é para série, um depois do outro.\nAqui são dois caminhos lado a lado.')],
    volta='p = 40 ÷ 2 = 20 Ω\nLetra B.',
    valores=[('R', '40 Ω')],
    pista='dois iguais "em paralelo" → metade de um.',
    receita=receita('2 de 40 Ω', 'p = R ÷ 2', 'R = 40', '40 ÷ 2 = 20'))),

dict(**F(), id='d2-escada-fis-ele-07', resp='E', objeto='chuveiro', cobra='potência = tensão × corrente', confere=220 * 20,
  ancora=DUCHA, canal='fis-13 [11:27:02] potência elétrica é energia por tempo',
  enun='Um chuveiro ligado em 220 V é atravessado por uma corrente de 20 A. Qual é a potência do chuveiro?',
  alts=['11 W', '240 W', '200 W', '440 W', '4 400 W'],
  ideia='Potência é tensão vezes corrente: 220 × 20 = 4 400 W.',
  pecas=[('V', 'Lê-se volt: a medida da tensão.'), ('A', 'Lê-se ampere: a medida da corrente.'), ('W', 'Lê-se watt: a medida da potência, a energia usada a cada segundo.')],
  conferencia='220×20 = 4400. E. A = 220/20; B = soma; C = subtrai; D = vezes 2.',
  sua_vez=('Aparelho em 110 V com 2 A. Potência?', ['220 W', '55 W', '112 W', '108 W'], '220 W', '110 × 2 = 220 W.'),
  aula=dict(
    formulas=[('circuito', 'Potência', 'potência = tensão × corrente')],
    tenho=[('Tensão', '220 V'), ('Corrente', '20 A')],
    quer='A questão quer a potência do chuveiro.',
    equacao='pot = U × i (potência = tensão × corrente)',
    porque='Por que multiplicar? Em 220 V, cada ampere usa 220 W. Com mais amperes, repete 220 W para cada um.',
    letras=[('pot', 'potência, em watts (o que a questão quer)'), ('U', 'tensão, em volts'), ('i', 'intensidade da corrente, em amperes')],
    telas=[tela('Achando U (tensão)', 'O enunciado dá direto.\nU = 220 V'),
           tela('Achando i (corrente)', 'O enunciado dá direto.\ni = 20 A')],
    volta='pot = 220 × 20 = 4400 W\nLetra E.',
    valores=[('U', '220 V'), ('i', '20 A')],
    pista='dá volts e amperes e pede watts → multiplique.',
    receita=receita('220 V, 20 A', 'pot = U × i', 'U = 220; i = 20', '220 × 20 = 4400'))),

dict(**F(), id='d2-escada-fis-ele-08', resp='C', objeto='ventilador na conta de luz', cobra='energia consumida em kWh', confere=0.1 * 8 * 30,
  ancora=CASA, canal='fora do canal: kWh não achado em fis-13',
  enun='Um ventilador de 0,1 kW fica ligado 8 horas por dia durante 30 dias. Quanta energia ele consome nesse período?',
  alts=['0,8 kWh', '3 kWh', '24 kWh', '240 kWh', '38 kWh'],
  ideia='Energia da conta de luz é quilowatts vezes horas: são 240 horas no mês, e 0,1 × 240 = 24 kWh.',
  pecas=[('kW', 'Lê-se quilowatt: 1000 watts de potência.'), ('kWh', 'Lê-se quilowatt-hora: a energia de 1 kW ligado por 1 hora.')],
  conferencia='h = 240; 0,1×240 = 24. C. A = um dia; B = esqueceu as 8 h; D = vírgula; E = soma.',
  sua_vez=('Aparelho de 2 kW ligado 5 horas. Energia?', ['10 kWh', '7 kWh', '2,5 kWh', '3 kWh'], '10 kWh', '2 × 5 = 10 kWh.'),
  aula=dict(
    formulas=[('circuito', 'Energia na conta de luz', 'energia = potência em kW × horas')],
    tenho=[('Potência', '0,1 kW'), ('Por dia', '8 horas'), ('Dias', '30')],
    quer='A questão quer a energia dos 30 dias.',
    equacao='e = pot × h (energia = potência × horas ligado)',
    porque='Por que multiplicar? Um aparelho de 2 kW por 3 horas gasta 2 + 2 + 2 = 6 kWh.',
    letras=[('e', 'energia, em kWh (o que a questão quer)'), ('pot', 'potência, em kW'), ('h', 'horas ligado no período todo')],
    telas=[tela('Achando pot (potência)', 'O enunciado dá direto.\npot = 0,1 kW'),
           tela('Achando h (horas no mês)', '8 horas por dia, em 30 dias.\nh = 8 × 30 = 240 horas')],
    volta='e = 0,1 × 240\n0,1 é um décimo.\nUm décimo de 240: 240 ÷ 10 = 24\ne = 24 kWh\nLetra C.',
    valores=[('pot', '0,1 kW'), ('h', '240')],
    pista='dá potência e tempo por dia → junte as horas do mês e multiplique.',
    receita=receita('0,1 kW; 8 h; 30 dias', 'e = pot × h', 'h = 240', '0,1 × 240 = 24'))),

dict(**F('medio'), id='d2-escada-fis-ele-09', resp='A', objeto='circuito com pilhas', cobra='corrente com dois resistores em série', confere=12 / (2 + 4),
  ancora=DIVISOR, canal='fis-12 [10:33:30] corrente do circuito pela lei de Ohm',
  enun='Uma bateria de 12 V alimenta dois resistores ligados em série, um de 2 Ω e outro de 4 Ω. Qual é a corrente no circuito?',
  alts=['2 A', '6 A', '3 A', '9 A', '72 A'],
  ideia='Primeiro junte os resistores em série: 2 + 4 = 6 Ω. Depois divida a tensão pela resistência: 12 ÷ 6 = 2 A.',
  pecas=[('Ω', 'Lê-se ohm: a medida da resistência.'), ('Em série', 'Um depois do outro, no mesmo caminho.'), ('A', 'Lê-se ampere: a medida da corrente.')],
  conferencia='s = 6; i = 2. A. B = só o de 2 Ω; C = só o de 4 Ω; D = paralelo (4/3 Ω); E = 12×6.',
  sua_vez=('20 V com 3 Ω e 2 Ω em série. Corrente?', ['4 A', '100 A', '10 A', '5 A'], '4 A', '3 + 2 = 5; 20 ÷ 5 = 4 A.'),
  aula=dict(
    formulas=[('circuito', 'Série', 'total = primeira + segunda'), ('circuito', 'Corrente', 'corrente = tensão ÷ resistência total')],
    tenho=[('Tensão', '12 V'), ('Primeiro resistor', '2 Ω'), ('Segundo resistor', '4 Ω')],
    quer='A questão quer a corrente que passa pelos dois.',
    equacao='i = U ÷ s (corrente = tensão ÷ resistência total)',
    porque='Por que dividir? Se a resistência fosse 5 Ω, 1 A pediria 5 V, e com 10 V passariam 10 ÷ 5 = 2 A.',
    letras=[('i', 'intensidade da corrente, em amperes (o que a questão quer)'), ('U', 'tensão da bateria, em volts'), ('s', 'resistência total em série, em ohms')],
    telas=[tela('Achando U (tensão)', 'O enunciado dá direto.\nU = 12 V'),
           tela('Achando s (total em série)', 'Em série as resistências se somam.\ns = 2 + 4 = 6 Ω')],
    volta='i = 12 ÷ 6 = 2 A\nLetra A.',
    valores=[('U', '12 V'), ('s', '6 Ω')],
    pista='resistores em série e pede a corrente → some e depois tensão ÷ total.',
    receita=receita('12 V; 2 Ω e 4 Ω', 'i = U ÷ s', 's = 6', '12 ÷ 6 = 2'))),
]
