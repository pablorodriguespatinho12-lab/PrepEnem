"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Geometria Espacial
(volume da caixa, cilindro, litros, pirâmide) e um que junta. Enunciado sem figura: a lousa
desenha (regra 21). Âncoras reais (só estudo): ENEM 2019 D2 (reservatório numa maquete) e
ENEM 2022 D2 (modelos em forma de cilindro). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_espacial"""

ARQUIVO = '../escada/matematica-base-espacial'

RESERVATORIO = 'ENEM 2019 D2 (reservatório de água numa maquete)'
CILINDRO = 'ENEM 2022 D2 (modelos em forma de cilindro)'


def M(nivel='facil'):
  return {'materia': 'Matemática', 'tema': 'Geometria Espacial', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


M3 = ('m³', 'Lê-se metro cúbico: um cubo de 1 m de cada lado.')

FICHAS = [
dict(**M(), id='d2-escada-mat-esp-b01', resp='B', objeto='caixa de areia', cobra='volume do bloco retangular', confere=4 * 3 * 2,
  ancora=RESERVATORIO, canal='mat-26 [14:59:34] volume é um lado vezes o outro vezes a altura',
  enun='Uma caixa de areia em forma de bloco retangular tem 4 m de comprimento, 3 m de largura e 2 m de altura. Qual é o volume da caixa?',
  alts=['9 m³', '24 m³', '12 m³', '14 m³', '48 m³'],
  ideia='No fundo cabem 4 × 3 = 12 cubos de 1 metro, e são 2 andares: 24 m³.',
  pecas=[('Volume', 'O espaço que cabe dentro de um objeto.'), M3],
  conferencia='4×3×2 = 24. B. A = soma; C = só o fundo; D = 12+2; E = dobro.',
  sua_vez=('Caixa de 5 m, 2 m e 3 m. Volume?', ['30 m³', '10 m³', '13 m³', '25 m³'], '30 m³', '5 × 2 × 3 = 30 m³.'),
  aula=dict(
    formulas=[('caixa', 'Volume da caixa', 'volume = comprimento × largura × altura')],
    tenho=[('Comprimento', '4 m'), ('Largura', '3 m'), ('Altura', '2 m')],
    quer='A questão quer quantos cubos de 1 metro cabem dentro.',
    equacao='v = c × l × a (volume = comprimento × largura × altura)',
    porque='Por que multiplicar? 3 fileiras de 5 cubos dão 15 no fundo. Cada metro de altura repete esse fundo.',
    letras=[('v', 'volume, em m³ (o que a questão quer)'), ('c', 'comprimento, em metros'), ('l', 'largura, em metros'), ('a', 'altura, em metros')],
    telas=[tela('Achando c (comprimento)', 'O enunciado dá direto.\nc = 4 m'),
           tela('Achando l (largura)', 'O enunciado dá direto.\nl = 3 m'),
           tela('Achando a (altura)', 'O enunciado dá direto.\na = 2 m')],
    volta='v = 4 × 3 × 2\n4 × 3 = 12\n12 × 2 = 24 m³\nLetra B.',
    valores=[('c', '4 m'), ('l', '3 m'), ('a', '2 m')],
    pista='caixa com três medidas → multiplique as três.',
    receita=receita('4, 3 e 2 m', 'v = c × l × a', 'c = 4; l = 3; a = 2', '12 × 2 = 24'))),

dict(**M(), id='d2-escada-mat-esp-b02', resp='D', objeto='tambor', cobra='volume do cilindro', confere=3 * 2 * 2 * 5,
  ancora=CILINDRO, canal='mat-25 [14:38:31] área do círculo na base do cilindro',
  enun='Um tambor em forma de cilindro tem raio da base de 2 m e altura de 5 m. Usando π = 3, qual é o volume do tambor?',
  alts=['30 m³', '12 m³', '150 m³', '60 m³', '20 m³'],
  ideia='O fundo redondo tem área 3 × 2 × 2 = 12, e a altura repete essa área 5 vezes: 60 m³.',
  pecas=[('π', 'Lê-se pi: um número usado nos círculos. Aqui vale 3.'), ('Raio', 'A distância do meio do círculo até a borda.'), M3],
  conferencia='3×4×5 = 60. D. A = não elevou o raio; B = só a base; C = 3×2×5×5; E = esqueceu π.',
  sua_vez=('Cilindro de raio 1 m e altura 4 m (π = 3). Volume?', ['12 m³', '4 m³', '24 m³', '48 m³'], '12 m³', '3 × 1 × 1 × 4 = 12 m³.'),
  aula=dict(
    formulas=[('cilindro', 'Volume do cilindro', 'volume = área do fundo × altura')],
    tenho=[('Raio', '2 m'), ('Altura', '5 m'), ('π', '3')],
    quer='A questão quer o espaço dentro do tambor.',
    equacao='v = p × r × r × a (volume = pi × raio × raio × altura)',
    porque='Por que raio duas vezes? O fundo redondo mede pi × r × r: raio 1 dá 3. Altura 4 repete isso 4 vezes: 12.',
    letras=[('v', 'volume, em m³ (o que a questão quer)'), ('p', 'o número pi'), ('r', 'raio da base, em metros'), ('a', 'altura, em metros')],
    telas=[tela('Achando p (pi)', 'O enunciado manda usar.\np = 3'),
           tela('Achando r (raio)', 'O enunciado dá direto.\nr = 2 m'),
           tela('Achando a (altura)', 'O enunciado dá direto.\na = 5 m')],
    volta='v = 3 × 2 × 2 × 5\n3 × 2 × 2 = 12\n12 × 5 = 60 m³\nLetra D.',
    valores=[('p', '3'), ('r', '2 m'), ('a', '5 m')],
    pista='cilindro → pi × raio × raio × altura.',
    receita=receita('raio 2, altura 5, pi 3', 'v = p × r × r × a', 'p = 3; r = 2; a = 5', '12 × 5 = 60'))),

dict(**M(), id='d2-escada-mat-esp-b03', resp='A', objeto='caixa-d’água', cobra='volume em litros', confere=3 * 1000,
  ancora=RESERVATORIO, canal='mat-26 [14:59:34] volume; litros fora do canal',
  enun='Um reservatório tem volume de 3 m³. Sabendo que 1 m³ comporta 1 000 litros, quantos litros de água cabem nele?',
  alts=['3 000 L', '300 L', '30 000 L', '1 003 L', '333 L'],
  ideia='Cada metro cúbico guarda 1 000 litros: 3 deles guardam 3 000.',
  pecas=[M3, ('L', 'Lê-se litro.')],
  conferencia='3×1000 = 3000. A. B = vezes 100; C = vezes 10000; D = soma; E = divisão.',
  sua_vez=('Quantos litros cabem em 5 m³?', ['5 000 L', '500 L', '1 005 L', '200 L'], '5 000 L', '5 × 1000 = 5000 L.'),
  aula=dict(
    formulas=[('caixa', 'Metro cúbico em litros', 'litros = metros cúbicos × 1000')],
    tenho=[('Volume', '3 m³'), ('Cada m³', '1 000 L')],
    quer='A questão quer a capacidade em litros.',
    equacao='q = v × k (litros = volume × litros em 1 m³)',
    porque='Por que multiplicar? 1 m³ são 1000 L, e 2 m³ são 1000 + 1000 = 2000 L.',
    letras=[('q', 'quantidade em litros (o que a questão quer)'), ('v', 'volume, em m³'), ('k', 'litros dentro de 1 m³')],
    telas=[tela('Achando v (volume)', 'O enunciado dá direto.\nv = 3'),
           tela('Achando k (litros em 1 m³)', 'O enunciado dá direto.\nk = 1000')],
    volta='q = 3 × 1000 = 3000 L\nLetra A.',
    valores=[('v', '3'), ('k', '1000')],
    pista='de m³ para litros → vezes 1000.',
    receita=receita('3 m³', 'q = v × k', 'v = 3; k = 1000', '3 × 1000 = 3000'))),

dict(**M(), id='d2-escada-mat-esp-b04', resp='E', objeto='enfeite em forma de pirâmide', cobra='volume da pirâmide: um terço', confere=6 * 6 * 10 / 3,
  ancora=CILINDRO, canal='mat-27 [15:39:30] volume da pirâmide',
  enun='Um enfeite maciço em forma de pirâmide tem base quadrada de 6 cm de lado e altura de 10 cm. Qual é o volume do enfeite?',
  alts=['360 cm³', '60 cm³', '180 cm³', '36 cm³', '120 cm³'],
  ideia='A pirâmide ocupa a terça parte da caixa de mesma base e altura: 360 ÷ 3 = 120 cm³.',
  pecas=[('Pirâmide', 'Sólido com uma base e uma ponta em cima.'), ('cm³', 'Lê-se centímetro cúbico: um cubo de 1 cm de cada lado.')],
  conferencia='36×10/3 = 120. E. A = caixa inteira; B = 6×10; C = metade; D = só a base.',
  sua_vez=('Pirâmide com base de área 9 cm² e altura 5 cm. Volume?', ['15 cm³', '45 cm³', '14 cm³', '22,5 cm³'], '15 cm³', '9 × 5 = 45; 45 ÷ 3 = 15 cm³.'),
  aula=dict(
    formulas=[('triangulo', 'Volume da pirâmide', 'volume = área da base × altura ÷ 3')],
    tenho=[('Lado da base', '6 cm'), ('Altura', '10 cm')],
    quer='A questão quer o espaço ocupado pela pirâmide.',
    equacao='v = b × a ÷ 3 (volume = área da base × altura ÷ 3)',
    porque='Por que dividir por 3? Três pirâmides cheias de água enchem 1 caixa de mesma base e altura.',
    letras=[('v', 'volume, em cm³ (o que a questão quer)'), ('b', 'área da base quadrada, em cm²'), ('a', 'altura, em cm')],
    telas=[tela('Achando b (área da base)', 'Base quadrada: lado × lado.\nb = 6 × 6 = 36'),
           tela('Achando a (altura)', 'O enunciado dá direto.\na = 10 cm'),
           tela('O seu jeito', 'Parece certo parar em 36 × 10 = 360, a letra A.\n360 é a caixa inteira; a pirâmide é uma de 3 partes iguais dela.')],
    volta='v = 36 × 10 ÷ 3\n36 × 10 = 360\n360 ÷ 3 = 120 cm³\nLetra E.',
    valores=[('b', '36'), ('a', '10 cm')],
    pista='pirâmide (ou cone) → base × altura e depois ÷ 3.',
    receita=receita('lado 6, altura 10', 'v = b × a ÷ 3', 'b = 36; a = 10', '360 ÷ 3 = 120'))),

dict(**M('medio'), id='d2-escada-mat-esp-b05', resp='C', objeto='piscina infantil', cobra='volume da caixa e conversão para litros', confere=2 * 3 * 0.5 * 1000,
  ancora=RESERVATORIO, canal='mat-26 [14:59:34] volume; litros fora do canal',
  enun='Uma piscina infantil em forma de bloco retangular mede 3 m de comprimento e 2 m de largura, com água até a altura de 0,5 m. Cada 1 m³ são 1 000 litros. Quantos litros de água há na piscina?',
  alts=['6 000 L', '550 L', '3 000 L', '5 500 L', '300 L'],
  ideia='Primeiro o volume: 3 × 2 = 6, e metade disso é 3 m³. Depois os litros: 3 000.',
  pecas=[M3, ('L', 'Lê-se litro.')],
  conferencia='3×2×0,5 = 3 m³ = 3000 L. C. A = altura 1 m; B = soma; D = soma × 1000; E = erro de zero.',
  sua_vez=('Tanque de 4 m por 1 m, água a 0,5 m. Litros?', ['2 000 L', '4 000 L', '200 L', '5 500 L'], '2 000 L', '4 × 1 = 4; metade 2 m³ = 2000 L.'),
  aula=dict(
    formulas=[('caixa', 'Volume', 'volume = comprimento × largura × altura'), ('caixa', 'Litros', 'litros = volume × 1000')],
    tenho=[('Comprimento', '3 m'), ('Largura', '2 m'), ('Altura da água', '0,5 m'), ('Cada m³', '1 000 L')],
    quer='A questão quer a água em litros.',
    equacao='q = v × k (litros = volume × litros em 1 m³)',
    porque='Por que achar o volume antes? A regra dos 1000 litros só vale para metros cúbicos.',
    letras=[('q', 'quantidade em litros (o que a questão quer)'), ('v', 'volume de água, em m³'), ('k', 'litros dentro de 1 m³')],
    telas=[tela('Primeiro, o fundo', 'Comprimento × largura.\n3 × 2 = 6'),
           tela('Achando v (volume de água)', 'A água tem meio metro, 0,5: metade de 1 metro de altura.\nMetade de 6: 6 ÷ 2 = 3\nv = 3 m³'),
           tela('Achando k (litros em 1 m³)', 'O enunciado dá direto.\nk = 1000')],
    volta='q = 3 × 1000 = 3000 L\nLetra C.',
    valores=[('v', '3'), ('k', '1000')],
    pista='pede litros e dá metros → volume primeiro, depois vezes 1000.',
    receita=receita('3; 2; 0,5 m', 'q = v × k', 'v = 3; k = 1000', '3 × 1000 = 3000'))),
]
