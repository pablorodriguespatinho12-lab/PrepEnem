"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Termodinâmica
(°C para K, Q = m·c·ΔT, calor latente, potência × tempo, trabalho do gás) e um que junta.
Âncoras reais (só estudo): ENEM 2020 D2 (aquecedor de aquário), ENEM 2022 D2 (ducha),
ENEM 2023 D2 (calor latente no tacho; gás ideal no pneu). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_termo"""

ARQUIVO = '../escada/fisica-base-termo'

AQUARIO = 'ENEM 2020 D2 (aquecedor de aquário)'
DUCHA = 'ENEM 2022 D2 (ducha elétrica)'
TACHO = 'ENEM 2023 D2 (calor latente num tacho)'
PNEU = 'ENEM 2023 D2 (gás perfeito num pneu)'


def F(nivel='facil'):
  return {'materia': 'Física', 'tema': 'Termodinâmica e Calor', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**F(), id='d2-escada-fis-ter-03', resp='D', objeto='sala climatizada', cobra='graus Celsius para kelvin', confere=27 + 273,
  ancora=PNEU, canal='fis-07 [6:06:01] temperatura em kelvin nas contas de gás',
  enun='Um termômetro numa sala marca 27 °C. Sabendo que a temperatura em kelvin é a temperatura em graus Celsius mais 273, qual é essa temperatura em kelvin?',
  alts=['246 K', '273 K', '27 K', '300 K', '7 371 K'],
  ideia='Para passar de graus Celsius para kelvin, some 273: 27 + 273 = 300 K.',
  pecas=[('°C', 'Lê-se graus Celsius: a temperatura do dia a dia.'), ('K', 'Lê-se kelvin: a temperatura usada nas contas de gás.')],
  conferencia='27 + 273 = 300. D. A = 273-27; B = o número da regra; C = não converteu; E = 27×273.',
  sua_vez=('Quanto é 7 °C em kelvin?', ['280 K', '266 K', '7 K', '273 K'], '280 K', '7 + 273 = 280 K.'),
  aula=dict(
    formulas=[('termometro', 'Kelvin', 'kelvin = graus Celsius + 273')],
    tenho=[('Temperatura', '27 °C'), ('Para somar', '273')],
    quer='A questão quer a mesma temperatura, em kelvin.',
    equacao='k = g + 273 (temperatura em kelvin = graus Celsius + 273)',
    porque='Por que somar? As duas escalas andam juntas, só começam em lugares diferentes: 0 °C é 273 K.',
    letras=[('k', 'temperatura em kelvin (o que a questão quer)'), ('g', 'temperatura em graus Celsius')],
    telas=[tela('Achando g (graus Celsius)', 'O enunciado dá direto.\ng = 27 °C')],
    volta='k = 27 + 273 = 300 K\nLetra D.',
    valores=[('g', '27 °C')],
    pista='pede kelvin e dá graus Celsius → some 273.',
    receita=receita('27 °C', 'k = g + 273', 'g = 27', '27 + 273 = 300'))),

dict(**F(), id='d2-escada-fis-ter-04', resp='A', objeto='água na chaleira', cobra='calor para mudar a temperatura (Q = m·c·ΔT)', confere=200 * 1 * (50 - 20),
  ancora=DUCHA, canal='fis-06 [5:52:31] Q = m c ΔT com água',
  enun='Uma chaleira aquece 200 g de água de 20 °C até 50 °C. O calor específico da água é 1 cal por grama a cada grau. Quanto calor a água recebe?',
  alts=['6 000 cal', '10 000 cal', '4 000 cal', '200 cal', '230 cal'],
  ideia='Cada grama precisa de 1 caloria para subir 1 grau: 200 gramas subindo 30 graus pedem 200 × 30 = 6 000 cal.',
  pecas=[('cal', 'Lê-se caloria: uma medida de calor.'), ('Calor específico', 'O calor que 1 grama precisa para subir 1 grau.'), ('ΔT', 'Lê-se delta tê: quantos graus a temperatura mudou.')],
  conferencia='200×1×30 = 6000. A. B = usou 50; C = usou 20; D = esqueceu ΔT; E = soma.',
  sua_vez=('100 g de água sobem de 30 °C a 40 °C (c = 1). Calor?', ['1000 cal', '4000 cal', '100 cal', '3000 cal'], '1000 cal', 'ΔT = 10; 100 × 1 × 10 = 1000 cal.'),
  aula=dict(
    formulas=[('termometro', 'Calor para esquentar', 'calor = massa × calor específico × graus que subiu')],
    tenho=[('Massa', '200 g'), ('Calor específico', '1'), ('Começo', '20 °C'), ('Fim', '50 °C')],
    quer='A questão quer o calor que entrou na água.',
    equacao='Q = m × c × ΔT (calor = massa × calor específico × graus que subiu)',
    porque='Por que multiplicar? 2 g subindo 3 graus: cada grama pede 3 cal, e 2 × 3 = 6 cal.',
    letras=[('Q', 'calor, em calorias (o que a questão quer)'), ('m', 'massa, em gramas'), ('c', 'calor específico'), ('ΔT', 'quantos graus a temperatura subiu')],
    telas=[tela('Achando m (massa)', 'O enunciado dá direto.\nm = 200 g'),
           tela('Achando c (calor específico)', 'O enunciado dá direto.\nc = 1'),
           tela('Achando ΔT (graus que subiu)', 'Temperatura do fim menos a do começo.\nΔT = 50 − 20 = 30 graus')],
    volta='Q = 200 × 1 × 30\n200 × 1 = 200\n200 × 30 = 6000 cal\nLetra A.',
    valores=[('m', '200 g'), ('c', '1'), ('ΔT', '30')],
    pista='esquentar sem mudar de estado → massa × calor específico × graus que subiu.',
    receita=receita('200 g; 1; 20 a 50 °C', 'Q = m × c × ΔT', 'ΔT = 30', '200 × 1 × 30 = 6000'))),

dict(**F(), id='d2-escada-fis-ter-05', resp='E', objeto='gelo derretendo', cobra='calor latente Q = m·L', confere=50 * 80,
  ancora=TACHO, canal='fis-06 [5:44:31] calor latente: energia entra e a temperatura não muda',
  enun='Um bloco de 50 g de gelo está a 0 °C. Para derreter, cada grama de gelo precisa de 80 cal. Quanto calor é necessário para derreter o bloco todo?',
  alts=['0 cal', '130 cal', '1,6 cal', '400 cal', '4 000 cal'],
  ideia='Cada grama pede 80 calorias para virar água: 50 gramas pedem 50 × 80 = 4 000 cal.',
  pecas=[('cal', 'Lê-se caloria: uma medida de calor.'), ('Calor latente', 'O calor que 1 grama precisa para virar outra coisa (gelo virar água), sem mudar a temperatura.')],
  conferencia='50×80 = 4000. E. A = achou que sem mudar temperatura não há calor; B = soma; C = 80/50; D = erro de zero.',
  sua_vez=('Derreter 10 g de gelo a 0 °C (80 cal por grama). Calor?', ['800 cal', '90 cal', '8 cal', '0 cal'], '800 cal', '10 × 80 = 800 cal.'),
  aula=dict(
    formulas=[('termometro', 'Calor latente', 'calor = massa × calor latente')],
    tenho=[('Massa de gelo', '50 g'), ('Calor latente', '80 cal por grama')],
    quer='A questão quer o calor para virar tudo água.',
    equacao='Q = m × L (calor = massa × calor latente)',
    porque='Por que multiplicar? 2 g de gelo, 80 cal para cada: 2 × 80 = 160 cal.',
    letras=[('Q', 'calor, em calorias (o que a questão quer)'), ('m', 'massa, em gramas'), ('L', 'calor latente: calor para derreter 1 grama')],
    telas=[tela('Achando m (massa)', 'O enunciado dá direto.\nm = 50 g'),
           tela('Achando L (calor latente)', 'O enunciado dá direto.\nL = 80 cal por grama'),
           tela('O seu jeito', 'Parece certo dizer 0 cal, a letra A, porque o gelo continua a 0 °C.\nO calor entra, mas é gasto para derreter, não para esquentar.')],
    volta='Q = 50 × 80 = 4000 cal\nLetra E.',
    valores=[('m', '50 g'), ('L', '80')],
    pista='derreter ou ferver → massa × calor latente.',
    receita=receita('50 g; 80 cal por grama', 'Q = m × L', 'm = 50; L = 80', '50 × 80 = 4000'))),

dict(**F(), id='d2-escada-fis-ter-06', resp='B', objeto='ebulidor', cobra='calor fornecido por uma potência', confere=500 * 60,
  ancora=AQUARIO, canal='fis-06 [5:11:00] potência de um ebulidor aquecendo água',
  enun='Um ebulidor (aparelho que esquenta água) de 500 W fica ligado por 1 minuto. Quanto calor (energia) ele entrega?',
  alts=['500 J', '30 000 J', '501 J', '8,3 J', '1 800 000 J'],
  ideia='500 W são 500 joules a cada segundo, e 1 minuto tem 60 segundos: 500 × 60 = 30 000 J.',
  pecas=[('J', 'Lê-se joule: uma medida de energia.'), ('W', 'Lê-se watt: joules entregues a cada segundo.')],
  conferencia='500×60 = 30000. B. A = 1 s; C = soma com 1; D = 500/60; E = usou 3600.',
  sua_vez=('Um aquecedor de 100 W ligado por 10 s. Energia?', ['1000 J', '10 J', '110 J', '60 000 J'], '1000 J', '100 × 10 = 1000 J.'),
  aula=dict(
    formulas=[('circuito', 'Energia pela potência', 'calor = potência × tempo em segundos')],
    tenho=[('Potência', '500 W'), ('Tempo', '1 minuto')],
    quer='A questão quer a energia entregue no minuto todo.',
    equacao='Q = pot × t (calor = potência × tempo em segundos)',
    porque='Por que multiplicar? Com 500 J em cada segundo, em 2 s seriam 500 × 2 = 1000 J.',
    letras=[('Q', 'calor, em joules (o que a questão quer)'), ('pot', 'potência, em W'), ('t', 'tempo, em segundos')],
    telas=[tela('Achando pot (potência)', 'O enunciado dá direto.\npot = 500 W'),
           tela('Achando t (tempo em segundos)', '1 minuto são 60 segundos (para decorar).\nt = 60 s')],
    volta='Q = 500 × 60\nQ = 30 000 J\nLetra B.',
    valores=[('pot', '500 W'), ('t', '60 s')],
    pista='dá watts e tempo → watts × segundos.',
    receita=receita('500 W; 1 min', 'Q = pot × t', 't = 60', '500 × 60 = 30 000'))),

dict(**F(), id='d2-escada-fis-ter-07', resp='C', objeto='pistão', cobra='trabalho do gás com pressão constante', confere=100000 * (0.005 - 0.002),
  ancora=PNEU, canal='fis-07 [6:32:30] o gás faz trabalho ao empurrar',
  enun='Um gás empurra um pistão (a tampa que desliza) com pressão sempre igual a 100 000 Pa. O volume do gás passa de 0,002 m³ para 0,005 m³. Qual é o trabalho feito pelo gás?',
  alts=['500 J', '200 J', '300 J', '700 J', '300 000 J'],
  ideia='Com pressão constante, o trabalho é a pressão vezes o quanto o volume cresceu: 100 000 × 0,003 = 300 J.',
  pecas=[('Pa', 'Lê-se pascal: mede a pressão, o quanto o gás aperta as paredes.'), ('m³', 'Lê-se metro cúbico: uma medida de volume.'), ('ΔV', 'Lê-se delta vê: quanto o volume mudou.')],
  conferencia='ΔV = 0,003; 100000×0,003 = 300. C. A = usou o volume final; B = o inicial; D = somou os volumes; E = esqueceu a vírgula.',
  sua_vez=('Pressão 1000 Pa; volume vai de 1 m³ a 3 m³. Trabalho?', ['2000 J', '3000 J', '4000 J', '1000 J'], '2000 J', 'ΔV = 2; 1000 × 2 = 2000 J.'),
  aula=dict(
    formulas=[('termometro', 'Trabalho do gás', 'trabalho = pressão × quanto o volume mudou')],
    tenho=[('Pressão', '100 000 Pa'), ('Volume no começo', '0,002 m³'), ('Volume no fim', '0,005 m³')],
    quer='A questão quer o trabalho: a energia que o gás gasta empurrando.',
    equacao='trab = p × ΔV (trabalho = pressão × quanto o volume mudou)',
    porque='Por que só a mudança? Se o volume não muda, o pistão não anda e o trabalho é zero.',
    letras=[('trab', 'trabalho, em joules (o que a questão quer)'), ('p', 'pressão, em Pa'), ('ΔV', 'volume do fim menos volume do começo')],
    telas=[tela('Achando p (pressão)', 'O enunciado dá direto.\np = 100 000 Pa'),
           tela('Achando ΔV (mudança de volume)', '0,005 são 5 pedaços de mil e 0,002 são 2. De 5 pedaços tire 2: ficam 3.\nΔV = 0,005 − 0,002 = 0,003 m³')],
    volta='trab = 100 000 × 0,003\n0,003 são 3 milésimos.\nUm pedaço de mil de 100 000: 100 000 ÷ 1000 = 100\nTrês milésimos: 100 + 100 + 100 = 300 J\nLetra C.',
    valores=[('p', '100 000 Pa'), ('ΔV', '0,003')],
    pista='gás com pressão constante mudando de volume → pressão × mudança de volume.',
    receita=receita('100 000 Pa; 0,002 a 0,005', 'trab = p × ΔV', 'ΔV = 0,003', '100 000 × 0,003 = 300'))),

dict(**F('medio'), id='d2-escada-fis-ter-08', resp='A', objeto='aquário', cobra='tempo de aquecimento por potência e calor', confere=2 * 4000 * 5 / 100,
  ancora=AQUARIO, canal='fis-06 [5:11:00] potência de um aquecedor e calor da água',
  enun='Um aquecedor de 100 W esquenta um aquário com 2 kg de água, fazendo a temperatura subir 5 °C. O calor específico da água é 4 000 J por quilograma a cada grau. Sem perdas de calor, quanto tempo o aquecedor precisa ficar ligado?',
  alts=['400 s', '200 s', '80 s', '40 000 s', '100 s'],
  ideia='Primeiro o calor que a água pede: 2 × 4 000 × 5 = 40 000 J. Depois o tempo: 40 000 ÷ 100 = 400 s.',
  pecas=[('W', 'Lê-se watt: joules entregues a cada segundo.'), ('J', 'Lê-se joule: uma medida de energia.'), ('ΔT', 'Lê-se delta tê: quantos graus a temperatura mudou.')],
  conferencia='Q = 40000; t = 400. A. B = esqueceu a massa; C = esqueceu o ΔT; D = parou no calor; E = 2×5×... = potência.',
  sua_vez=('Um aquecedor de 200 W precisa entregar 20 000 J. Tempo?', ['100 s', '4 000 000 s', '200 s', '10 s'], '100 s', '20 000 ÷ 200 = 100 s.'),
  aula=dict(
    formulas=[('termometro', 'Calor para esquentar', 'calor = massa × calor específico × graus que subiu'), ('circuito', 'Tempo', 'tempo = calor ÷ potência')],
    tenho=[('Potência', '100 W'), ('Massa', '2 kg'), ('Calor específico', '4 000'), ('Subida', '5 °C')],
    quer='A questão quer por quantos segundos o aquecedor fica ligado.',
    equacao='t = Q ÷ pot (tempo = calor ÷ potência)',
    porque='Por que dividir? Para entregar 200 J com 100 J em cada segundo: 200 ÷ 100 = 2 s.',
    letras=[('t', 'tempo, em segundos (o que a questão quer)'), ('Q', 'calor que a água pede, em joules'), ('pot', 'potência, em W')],
    telas=[tela('Achando Q (calor)', 'Massa × calor específico × graus.\n2 × 4000 = 8000\n8000 × 5 = 40 000\nQ = 40 000 J'),
           tela('Achando pot (potência)', 'O enunciado dá direto.\npot = 100 W')],
    volta='t = 40 000 ÷ 100\nTire dois zeros dos dois (a resposta não muda): 400 ÷ 1\nt = 400 s\nLetra A.',
    valores=[('Q', '40 000 J'), ('pot', '100 W')],
    pista='pede o tempo de um aquecedor → primeiro o calor, depois calor ÷ potência.',
    receita=receita('100 W; 2 kg; 4000; 5 °C', 't = Q ÷ pot', 'Q = 40 000; pot = 100', '40 000 ÷ 100 = 400'))),
]
