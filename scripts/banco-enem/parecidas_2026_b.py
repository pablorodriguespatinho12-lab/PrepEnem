"""Parecidas com o ENEM 2026, dia 2, caderno azul, 2ª leva (Pablo, 17/11/2026): 11
questões novas de Matemática. Cada uma cobra a MESMA ideia da questão do ENEM, numa
situação diferente e com outros números; o texto do ENEM não é copiado. Aula no molde
do robô (passos_aula em montar.py). Um arquivo por tema."""

ARQUIVO = 'parecidas-2026-b'
ARQUIVO_POR_TEMA = {
  'Geometria Plana': 'parecidas-2026-b-geometria',
  'Geometria Espacial': 'parecidas-2026-b-espacial',
  'Análise Combinatória e Probabilidade': 'parecidas-2026-b-contagem',
  'Funções': 'parecidas-2026-b-funcoes',
}
GEO = {'materia': 'Matemática', 'tema': 'Geometria Plana'}
ESP = {'materia': 'Matemática', 'tema': 'Geometria Espacial'}
CONTA = {'materia': 'Matemática', 'tema': 'Análise Combinatória e Probabilidade'}
FUN = {'materia': 'Matemática', 'tema': 'Funções'}

FICHAS = [
# Parecida com ENEM 2026 · questão 176 (toalha para o tampo): o menor círculo que cobre
# um triângulo de lados iguais, com sobra, tem raio = 2/3 da altura + a sobra.
dict(**GEO, id='d2-banco-mat-p26-03', resp='D', objeto='toalha-redonda', cobra='menor medida',
  confere=2 * ((2 / 3) * (90 * 1.7 / 2) + 10),
  enun='Um tampo de mesa tem a forma de um triângulo de 3 lados iguais, cada um com 90 cm. Uma toalha redonda será posta com o centro no centro do tampo (o ponto que está à mesma distância das 3 pontas). A borda da toalha deve passar 10 cm além de cada ponta do tampo. Use 1,7 como valor de √3.\nO menor diâmetro possível para a toalha é de',
  alts=['61 cm', '102 cm', '110 cm', '122 cm', '153 cm'],
  ideia='A ponta é o ponto do tampo mais longe do centro, a 2/3 da altura de 76,5 cm: 51 cm. Com 10 cm de sobra o raio é 61 cm, e o diâmetro, 122 cm.',
  pecas=[('Diâmetro', 'Linha reta que atravessa o círculo passando pelo centro: vale 2 raios.')],
  conferencia='H = 90*1,7/2 = 76,5; P = 2/3*76,5 = 51; T = 2*(51+10) = 122. D. A = só o raio 61; B = 2*51 sem a sobra; C = 2*(45+10) com metade do lado; E = 2*76,5.',
  sua_vez=('Tampo de 3 lados iguais de 30 cm, √3 = 1,7. Do centro até a ponta?', ['17 cm', '25,5 cm', '15 cm', '8,5 cm'], '17 cm', 'Altura 30 × 1,7 ÷ 2 = 25,5; 2/3 de 25,5 = 17.'),
  aula=dict(
    formulas=[('triangulo', 'Altura do triângulo equilátero', 'lado × √3 ÷ 2'), ('circulo', 'Diâmetro do círculo', '2 × raio')],
    tenho_texto='Primeiro, tire os números do enunciado. Tudo em centímetros.',
    tenho=[('Lado do tampo', '90 cm'), ('Sobra da toalha', '10 cm'), ('√3', '1,7')],
    quer='A questão quer o menor diâmetro da toalha, com 10 cm de sobra depois das pontas.',
    equacao='T = 2 × (P + 10) (diâmetro = 2 raios; o raio vai do centro até a ponta e mais a sobra)',
    porque='Por que dobrar? O diâmetro atravessa a toalha toda: são 2 raios, um de cada lado do centro.',
    letras=[('T', 'diâmetro da toalha (o que a questão quer)'), ('P', 'distância do centro até a ponta'), ('H', 'altura do triângulo')],
    telas=[
      dict(titulo='Achando H (a altura)',
        texto='A altura vai de uma ponta até o meio do lado de frente.\nNo triângulo de 3 lados iguais: altura = lado × √3 ÷ 2.\nH = 90 × 1,7 ÷ 2 = 153 ÷ 2 = 76,5 cm'),
      dict(titulo='Achando P: o seu jeito',
        texto='Parece certo usar metade do lado, 45 cm. Mas o centro não fica na borda: fica dentro do triângulo.\nAs 3 alturas se cruzam no centro, e ele divide cada altura em 3 partes iguais: 2 partes até a ponta e 1 até o lado.\nP = 76,5 ÷ 3 × 2 = 25,5 × 2 = 51 cm'),
    ],
    volta='T = 2 × (51 + 10) = 2 × 61 = 122\nLetra D. A toalha tem 122 cm de diâmetro: 61 cm de raio, sendo 51 até a ponta e 10 de sobra.',
    valores=[('H', '76,5'), ('P', '51')],
    pista='toalha redonda que cobre um triângulo de 3 lados iguais → raio = 2/3 da altura + a sobra; diâmetro = 2 raios.',
    coluna_receita='Neste tampo',
    receita=[('1. Tabela do que eu tenho', '90 cm, 10 cm, √3 = 1,7'), ('2. Equação em letras', 'T = 2 × (P + 10)'), ('3. Achar cada letra', 'H = 76,5; P = 51'), ('4. Substituir', '2 × 61 = 122')])),

# Parecida com ENEM 2026 · questão 174 (rotas em sequência): trechos um depois do outro
# multiplicam; o produto que falta é primo (11), então só sobra "ele × 1".
dict(**CONTA, id='d2-banco-mat-p26-04', resp='E', objeto='estradas', cobra='contagem',
  confere=132 / (3 * 4) / 11,
  enun='Um ônibus vai da cidade A à cidade E passando, nesta ordem, por B, C e D. De A a B há 3 estradas, e de D a E há 4. O mapa não mostra quantas estradas ligam B a C nem C a D, mas há menos estradas entre C e D do que entre B e C. Ao todo existem 132 rotas diferentes de A até E.\nO número de estradas entre C e D é',
  alts=['11', '12', '33', '7', '1'],
  ideia='Trechos em sequência multiplicam: 3 × X × Y × 4 = 132, então X × Y = 11. Como 11 só é 11 × 1 e C a D tem menos estradas, Y = 1.',
  pecas=[('Número primo', 'Número que só se divide por 1 e por ele mesmo, como 2, 3, 7 e 11.')],
  conferencia='132/(3*4) = 11 = 11*1 e Y < X: X = 11, Y = 1. E. A = X; B = 3*4; C = 132/4; D = 3+4.',
  sua_vez=('2 caminhos de A a B, ? de B a C e 3 de C a D. São 42 caminhos de A a D. Caminhos de B a C?', ['7', '21', '14', '12'], '7', '42 ÷ (2 × 3) = 42 ÷ 6 = 7.'),
  aula=dict(
    formulas=[('contagem', 'Trechos um depois do outro', 'multiplique as escolhas de cada trecho')],
    tenho=[('A → B', '3 estradas'), ('D → E', '4 estradas'), ('Rotas ao todo', '132'), ('C → D', 'menos que B → C')],
    quer='A questão quer quantas estradas ligam C a D.',
    equacao='132 = 3 × X × Y × 4 (rotas = estradas de cada trecho multiplicadas)',
    porque='Por que multiplicar? Para cada estrada do 1º trecho, você ainda pode pegar qualquer estrada do 2º. Com 2 e depois 3, são 2 × 3 = 6 rotas, não 2 + 3.',
    letras=[('Y', 'estradas C → D (o que a questão quer)'), ('X', 'estradas B → C'), ('P', 'X × Y juntos')],
    telas=[
      dict(titulo='Achando P (X × Y)',
        texto='Tire o 3 e o 4 dividindo, porque eles já estão na conta.\nP = 132 ÷ (3 × 4) = 132 ÷ 12 = 11'),
      dict(titulo='Achando X: o seu jeito',
        texto='Parece certo responder 11, o número que apareceu. Mas 11 é X × Y, os dois trechos juntos.\n11 é primo: só se divide por 1 e por 11. Então X × Y = 11 × 1.\nO enunciado diz que C → D tem menos estradas. Logo X = 11 e Y = 1.'),
    ],
    volta='Y = 11 ÷ X = 11 ÷ 11 = 1\nLetra E. Confere: 3 × 11 × 1 × 4 = 132 rotas.',
    valores=[('P', '11'), ('X', '11')],
    pista='trechos um depois do outro → multiplica; faltam dois trechos → divida o total pelos que você sabe e olhe o primo.',
    coluna_receita='Nesta viagem',
    receita=[('1. Tabela do que eu tenho', '3, 4 e 132'), ('2. Equação em letras', '132 = 3 × X × Y × 4'), ('3. Achar cada letra', 'P = 11; X = 11'), ('4. Substituir', 'Y = 11 ÷ 11 = 1')])),

# Parecida com ENEM 2026 · questão 136 (disco sobre círculos): o disco fica todo dentro
# se o centro cai no círculo menor, de raio R − r; chance = razão das áreas.
dict(**CONTA, id='d2-banco-mat-p26-05', resp='A', objeto='moeda-no-circulo', cobra='probabilidade',
  confere=(3 * 4 * 4) / (3 * 5 * 5) * 100,
  enun='Num jogo de feira, uma moeda de raio 1 cm é jogada sobre uma mesa com círculos desenhados de raio 5 cm. Ganha quem fizer a moeda ficar toda dentro de um círculo, sem encostar na linha. A moeda cai sempre sobre um círculo, e o centro dela tem a mesma chance de cair em qualquer ponto dele. Use π = 3.\nA chance de ganhar é de',
  alts=['64%', '80%', '96%', '36%', '20%'],
  ideia='A moeda fica toda dentro quando o centro dela cai a mais de 1 cm da linha, num círculo de raio 4 cm. A chance é a razão das áreas: 48 ÷ 75 = 64%.',
  pecas=[('Chance', 'A parte que serve dividida pelo total, em porcentagem.')],
  conferencia='Q = 5-1 = 4; B = 3*4*4 = 48; T = 3*5*5 = 75; P = 48/75 = 64%. A. B = 4/5 (raios sem área); C = 1-(1/5)^2; D = (3/5)^2 com o diâmetro; E = 1/5.',
  sua_vez=('Círculo de raio 6 cm, moeda de raio 2 cm, π = 3. Área onde o centro pode cair?', ['48 cm²', '108 cm²', '72 cm²', '24 cm²'], '48 cm²', 'Raio 6 − 2 = 4; área 3 × 4 × 4 = 48.'),
  aula=dict(
    formulas=[('circulo', 'Área do círculo', 'π × raio × raio'), ('porcentagem', 'Chance (probabilidade)', 'parte que serve ÷ total')],
    tenho=[('Raio do círculo', '5 cm'), ('Raio da moeda', '1 cm'), ('π', '3')],
    quer='A questão quer a chance de a moeda ficar toda dentro do círculo.',
    equacao='P = B ÷ T (chance = área onde o centro pode cair ÷ área do círculo todo)',
    porque='Por que dividir áreas? O centro cai em qualquer ponto do círculo com a mesma chance. Então a chance é o tamanho da parte boa em relação ao tamanho do todo.',
    letras=[('P', 'chance de ganhar (o que a questão quer)'), ('B', 'área onde o centro pode cair'), ('T', 'área do círculo todo')],
    telas=[
      dict(titulo='Achando T (o círculo todo)',
        texto='É a área do círculo: π × raio × raio.\nT = 3 × 5 × 5 = 75 cm²'),
      dict(titulo='Achando B: o seu jeito',
        texto='Parece certo comparar só os raios: 4 ÷ 5 = 80%. Mas chance de cair numa região depende da ÁREA, não do raio.\nO centro não pode chegar perto da linha: precisa ficar a 1 cm dela. O raio da região boa é 5 − 1 = 4 cm.\nB = 3 × 4 × 4 = 48 cm²'),
    ],
    volta='P = 48 ÷ 75 = 0,64 = 64%\nLetra A. Em cada 100 jogadas, a moeda fica toda dentro em 64.',
    valores=[('T', '75'), ('B', '48')],
    pista='disco que precisa ficar todo dentro → o centro cai num círculo de raio (grande − disco); chance = área boa ÷ área total.',
    coluna_receita='Neste jogo',
    receita=[('1. Tabela do que eu tenho', 'raios 5 e 1, π = 3'), ('2. Equação em letras', 'P = B ÷ T'), ('3. Achar cada letra', 'T = 75; B = 48'), ('4. Substituir', '48 ÷ 75 = 64%')])),

# Parecida com ENEM 2026 · questão 136 (disco sobre círculos): agora a pergunta é o
# contrário (tocar a linha), então tira de 100% a chance de ficar dentro.
dict(**CONTA, id='d2-banco-mat-p26-06', resp='C', objeto='ficha-quermesse', cobra='probabilidade',
  confere=100 - (3 * 7 * 7) / (3 * 10 * 10) * 100,
  enun='Numa quermesse, uma ficha redonda de raio 3 cm é jogada sobre uma mesa com círculos desenhados de raio 10 cm. A ficha cai sempre sobre um círculo, e o centro dela tem a mesma chance de cair em qualquer ponto dele. Use π = 3.\nA chance de a ficha tocar a linha de um círculo é de',
  alts=['49%', '70%', '51%', '30%', '91%'],
  ideia='A ficha fica toda dentro quando o centro cai num círculo de raio 7 cm: 147 ÷ 300 = 49%. Ela toca a linha nas outras jogadas: 100% − 49% = 51%.',
  pecas=[('Chance', 'A parte que serve dividida pelo total, em porcentagem.')],
  conferencia='Q = 10-3 = 7; B = 3*49 = 147; T = 3*100 = 300; G = 147/300 = 49%; P = 100-49 = 51%. C. A = só G; B = 7/10; D = 3/10; E = 100-3*3.',
  sua_vez=('Círculo de raio 6 cm, ficha de raio 2 cm, π = 3. Área onde o centro pode cair?', ['48 cm²', '108 cm²', '72 cm²', '24 cm²'], '48 cm²', 'Raio 6 − 2 = 4; área 3 × 4 × 4 = 48.'),
  aula=dict(
    formulas=[('circulo', 'Área do círculo', 'π × raio × raio'), ('porcentagem', 'Chance (probabilidade)', 'parte que serve ÷ total')],
    tenho=[('Raio do círculo', '10 cm'), ('Raio da ficha', '3 cm'), ('π', '3')],
    quer='A questão quer a chance de a ficha tocar a linha, e não a de ficar dentro.',
    equacao='P = 100% − G (tocar = 100% menos a chance de ficar toda dentro)',
    porque='Por que tirar de 100%? Cada jogada ou fica toda dentro ou toca a linha. Não tem terceira opção, então as duas chances somam 100%.',
    letras=[('P', 'chance de tocar a linha (o que a questão quer)'), ('G', 'chance de ficar toda dentro'), ('B', 'área onde o centro pode cair'), ('T', 'área do círculo todo')],
    telas=[
      dict(titulo='Achando T (o círculo todo)',
        texto='É a área do círculo: π × raio × raio.\nT = 3 × 10 × 10 = 300 cm²'),
      dict(titulo='Achando B (onde o centro pode cair)',
        texto='O centro precisa ficar a 3 cm da linha para a ficha não tocar nela.\nO raio da região boa é 10 − 3 = 7 cm.\nB = 3 × 7 × 7 = 147 cm²'),
      dict(titulo='Achando G: o seu jeito',
        texto='Parece certo parar em 49%. Mas 49% é a chance de ficar toda DENTRO. A questão pergunta o contrário, tocar a linha.\nG = 147 ÷ 300 = 0,49 = 49%'),
    ],
    volta='P = 100% − 49% = 51%\nLetra C. Em cada 100 jogadas, a ficha toca a linha em 51.',
    valores=[('T', '300'), ('B', '147'), ('G', '49%')],
    pista='disco e círculos → área boa ÷ área total; se a pergunta é o contrário, tire o resultado de 100%.',
    coluna_receita='Nesta quermesse',
    receita=[('1. Tabela do que eu tenho', 'raios 10 e 3, π = 3'), ('2. Equação em letras', 'P = 100% − G'), ('3. Achar cada letra', 'T = 300; B = 147; G = 49%'), ('4. Substituir', '100% − 49% = 51%')])),

# Parecida com ENEM 2026 · questão 151 (círculo em volta do jardim quadrado): o círculo
# que passa pelos 4 cantos tem diâmetro = diagonal = lado × √2.
dict(**GEO, id='d2-banco-mat-p26-07', resp='B', objeto='aspersor', cobra='medida',
  confere=20 * 1.4 / 2,
  enun='Um jardim tem a forma de um quadrado de 20 m de lado. Um aspersor fica no centro do jardim e molha um círculo que passa exatamente pelos 4 cantos. Use 1,4 como valor de √2.\nO alcance do aspersor, do centro até um canto, é de',
  alts=['10 m', '14 m', '20 m', '28 m', '7 m'],
  ideia='O círculo que passa pelos 4 cantos tem como diâmetro a diagonal do quadrado: 20 × 1,4 = 28 m. O alcance é o raio, a metade: 14 m.',
  pecas=[('Diagonal', 'Linha reta de um canto até o canto do lado oposto.')],
  conferencia='D = 20*1,4 = 28; R = 28/2 = 14. B. A = metade do lado; C = o lado; D = a diagonal inteira; E = metade do raio.',
  sua_vez=('Quadrado de 10 m de lado, √2 = 1,4. Quanto mede a diagonal?', ['14 m', '10 m', '20 m', '7 m'], '14 m', '10 × 1,4 = 14.'),
  aula=dict(
    formulas=[('quadrado', 'Diagonal do quadrado', 'lado × √2'), ('circulo', 'Diâmetro do círculo', '2 × raio')],
    tenho=[('Lado do jardim', '20 m'), ('√2', '1,4')],
    quer='A questão quer o alcance do aspersor, do centro até um canto.',
    equacao='R = D ÷ 2 (raio = diagonal ÷ 2)',
    porque='Por que dividir por 2? O círculo passa pelos 4 cantos, então a diagonal é o diâmetro do círculo. O alcance, do centro até a borda, é o raio: a metade do diâmetro.',
    letras=[('R', 'alcance do aspersor, o raio (o que a questão quer)'), ('D', 'diagonal do jardim')],
    telas=[
      dict(titulo='Achando D: o seu jeito',
        texto='Parece certo usar metade do lado, 10 m. Mas o canto fica mais longe do centro do que o meio de um lado.\nO caminho do centro ao canto vai pela diagonal, e a diagonal do quadrado é lado × √2.\nD = 20 × 1,4 = 28 m'),
    ],
    volta='R = 28 ÷ 2 = 14\nLetra B. O aspersor alcança 14 m e molha o jardim todo, até os cantos.',
    valores=[('D', '28')],
    pista='círculo que passa pelos 4 cantos de um quadrado → diâmetro = diagonal = lado × √2; raio = metade.',
    coluna_receita='Neste jardim',
    receita=[('1. Tabela do que eu tenho', '20 m, √2 = 1,4'), ('2. Equação em letras', 'R = D ÷ 2'), ('3. Achar cada letra', 'D = 28'), ('4. Substituir', '28 ÷ 2 = 14')])),

# Parecida com ENEM 2026 · questão 151 (círculo e quadrado com os cantos no círculo): o
# caminho inverso, do diâmetro do círculo para o lado do quadrado (lado = diagonal ÷ √2).
dict(**GEO, id='d2-banco-mat-p26-08', resp='E', objeto='viga-no-tronco', cobra='medida',
  confere=70 / 1.4,
  enun='De um tronco de árvore redondo, com 70 cm de diâmetro, um marceneiro corta uma viga de seção quadrada, a maior possível: os 4 cantos do quadrado encostam na casca do tronco. Use 1,4 como valor de √2.\nO lado do quadrado da viga mede',
  alts=['35 cm', '98 cm', '70 cm', '49 cm', '50 cm'],
  ideia='Os 4 cantos encostam na casca, então a diagonal do quadrado é o diâmetro do tronco: 70 cm. Como diagonal = lado × 1,4, o lado é 70 ÷ 1,4 = 50 cm.',
  pecas=[('Diagonal', 'Linha reta de um canto até o canto do lado oposto.')],
  conferencia='D = 70; L = 70/1,4 = 50. E. A = o raio; B = 70*1,4; C = o diâmetro; D = 35*1,4.',
  sua_vez=('Tronco de 28 cm de diâmetro, viga quadrada maior possível, √2 = 1,4. Lado?', ['20 cm', '39,2 cm', '14 cm', '28 cm'], '20 cm', '28 ÷ 1,4 = 20.'),
  aula=dict(
    formulas=[('quadrado', 'Diagonal do quadrado', 'lado × √2'), ('circulo', 'Diâmetro do círculo', '2 × raio')],
    tenho=[('Diâmetro do tronco', '70 cm'), ('√2', '1,4')],
    quer='A questão quer o lado do quadrado da viga.',
    equacao='L = D ÷ 1,4 (lado = diagonal ÷ √2)',
    porque='Por que dividir? A diagonal é o lado × 1,4. Se 12 = 3 × 4, então 3 = 12 ÷ 4. Do mesmo jeito, o lado é a diagonal ÷ 1,4.',
    letras=[('L', 'lado da viga (o que a questão quer)'), ('D', 'diagonal do quadrado')],
    telas=[
      dict(titulo='Achando D: o seu jeito',
        texto='Parece certo usar o raio, 35 cm, porque o centro está no meio. Mas a diagonal passa pelo centro e vai de um canto ao outro.\nOs dois cantos encostam na casca, em lados opostos: a diagonal é o diâmetro todo.\nD = 70 cm'),
    ],
    volta='L = 70 ÷ 1,4 = 700 ÷ 14 = 50\nLetra E. A viga tem 50 cm de lado. Confere: 50 × 1,4 = 70 cm de diagonal.',
    valores=[('D', '70')],
    pista='quadrado com os 4 cantos no círculo → diagonal = diâmetro; do diâmetro para o lado, divida por √2.',
    coluna_receita='Neste tronco',
    receita=[('1. Tabela do que eu tenho', '70 cm, √2 = 1,4'), ('2. Equação em letras', 'L = D ÷ 1,4'), ('3. Achar cada letra', 'D = 70'), ('4. Substituir', '70 ÷ 1,4 = 50')])),

# Parecida com ENEM 2026 · questão 154 (manta na lateral): a lateral do cilindro,
# planificada, é um retângulo de (2 × π × raio) por altura.
dict(**ESP, id='d2-banco-mat-p26-09', resp='A', objeto='coluna-faixa', cobra='área',
  confere=2 * 3 * 0.5 * 3,
  enun='Uma coluna de concreto tem a forma de um cilindro com 1 m de diâmetro e 3 m de altura. Para uma festa, ela será coberta por uma faixa de tecido que envolve só a lateral, sem cobrir o topo nem a base. Use π = 3.\nA área de tecido necessária é de',
  alts=['9 m²', '4,5 m²', '10,5 m²', '1,5 m²', '18 m²'],
  ideia='Aberta, a lateral vira um retângulo: a base é a volta da coluna, 2 × 3 × 0,5 = 3 m, e a altura é 3 m. A área é 3 × 3 = 9 m².',
  pecas=[('Raio', 'Distância do centro até a borda do círculo: metade do diâmetro.')],
  conferencia='R = 1/2 = 0,5; C = 2*3*0,5 = 3; A = 3*3 = 9. A. B = 3*0,5*3 (sem o 2); C = 9 + 2 tampas; D = 2 tampas; E = 2*3*1*3 (diâmetro no lugar do raio).',
  sua_vez=('Faixa em volta de um cilindro de raio 2 m, π = 3. Comprimento da volta?', ['12 m', '6 m', '24 m', '4 m'], '12 m', '2 × 3 × 2 = 12.'),
  aula=dict(
    formulas=[('cilindro', 'Volta da borda do círculo', '2 × π × raio'), ('retangulo', 'Área do retângulo', 'base × altura')],
    tenho=[('Diâmetro da coluna', '1 m'), ('Altura da coluna', '3 m'), ('π', '3')],
    quer='A questão quer a área da faixa que cobre só a lateral.',
    equacao='A = C × 3 (área = volta da coluna × altura)',
    porque='Por que multiplicar? Se você abrir a faixa, ela vira um retângulo. A área do retângulo é base × altura. A base é a volta da coluna, e a altura é 3 m.',
    letras=[('A', 'área da faixa (o que a questão quer)'), ('C', 'volta da coluna'), ('R', 'raio da coluna')],
    telas=[
      dict(titulo='Achando R: o seu jeito',
        texto='Parece certo usar 1 m na conta, porque é o número do enunciado. Mas a fórmula da volta pede o raio, e o enunciado deu o diâmetro.\nO raio é a metade do diâmetro.\nR = 1 ÷ 2 = 0,5 m'),
      dict(titulo='Achando C (a volta)',
        texto='A volta é a borda do círculo: 2 × π × raio.\nC = 2 × 3 × 0,5 = 3 m'),
    ],
    volta='A = 3 × 3 = 9\nLetra A. São 9 m² de tecido: uma faixa de 3 m por 3 m.',
    valores=[('C', '3'), ('R', '0,5')],
    pista='cobrir só a lateral de um cilindro → retângulo de (2 × π × raio) por altura; confira se deram raio ou diâmetro.',
    coluna_receita='Nesta coluna',
    receita=[('1. Tabela do que eu tenho', 'diâmetro 1 m, altura 3 m'), ('2. Equação em letras', 'A = C × 3'), ('3. Achar cada letra', 'R = 0,5; C = 3'), ('4. Substituir', '3 × 3 = 9')])),

# Parecida com ENEM 2026 · questão 154 (manta na lateral): mesma lateral, agora seguida
# de uma conta de tinta (área ÷ o que 1 L cobre).
dict(**ESP, id='d2-banco-mat-p26-10', resp='D', objeto='tanque-tinta', cobra='área',
  confere=2 * 3 * 2 * 5 / 6,
  enun='Um tanque de água tem a forma de um cilindro com 2 m de raio e 5 m de altura. Só a parede lateral será pintada, sem o topo nem o fundo. Cada litro de tinta cobre 6 m². Use π = 3.\nA quantidade mínima de tinta necessária é de',
  alts=['5 L', '20 L', '60 L', '10 L', '14 L'],
  ideia='A parede aberta é um retângulo: a base é a volta, 2 × 3 × 2 = 12 m, e a altura é 5 m. A área é 60 m², e 60 ÷ 6 = 10 L.',
  pecas=[('Lateral', 'A parede curva do cilindro, sem o topo e sem o fundo.')],
  conferencia='C = 2*3*2 = 12; A = 12*5 = 60; N = 60/6 = 10. D. A = 3*2*5/6 (sem o 2); B = 2*3*4*5/6 (diâmetro no lugar do raio); C = 60 sem dividir; E = (60+24)/6 com topo e fundo.',
  sua_vez=('Parede de 36 m² e cada litro cobre 6 m². Quantos litros?', ['6 L', '30 L', '216 L', '42 L'], '6 L', '36 ÷ 6 = 6.'),
  aula=dict(
    formulas=[('cilindro', 'Volta da borda do círculo', '2 × π × raio'), ('retangulo', 'Área do retângulo', 'base × altura')],
    tenho=[('Raio do tanque', '2 m'), ('Altura do tanque', '5 m'), ('1 L de tinta cobre', '6 m²'), ('π', '3')],
    quer='A questão quer quantos litros de tinta pintam só a parede lateral.',
    equacao='N = A ÷ 6 (litros = área da parede ÷ área que 1 L cobre)',
    porque='Por que dividir? Cada litro cobre 6 m². Para 18 m² você precisa de 18 ÷ 6 = 3 litros.',
    letras=[('N', 'litros de tinta (o que a questão quer)'), ('A', 'área da parede'), ('C', 'volta do tanque')],
    telas=[
      dict(titulo='Achando C (a volta)',
        texto='A volta é a borda do círculo: 2 × π × raio.\nC = 2 × 3 × 2 = 12 m'),
      dict(titulo='Achando A: o seu jeito',
        texto='Parece certo pintar o tanque inteiro, somando o topo e o fundo: 60 + 12 + 12 = 84 m². Mas o enunciado só manda pintar a parede lateral.\nAberta, a parede é um retângulo: base × altura.\nA = 12 × 5 = 60 m²'),
    ],
    volta='N = 60 ÷ 6 = 10\nLetra D. São 10 litros de tinta para os 60 m² da parede.',
    valores=[('C', '12'), ('A', '60')],
    pista='pintar ou cobrir só a lateral de um cilindro → retângulo de (2 × π × raio) por altura; depois divida pelo que 1 L cobre.',
    coluna_receita='Neste tanque',
    receita=[('1. Tabela do que eu tenho', 'raio 2, altura 5, 6 m² por L'), ('2. Equação em letras', 'N = A ÷ 6'), ('3. Achar cada letra', 'C = 12; A = 60'), ('4. Substituir', '60 ÷ 6 = 10')])),

# Parecida com ENEM 2026 · questão 153 (bola de bilhar): o ângulo de chegada é igual ao
# de saída; os dois ângulos com a tabela e o V que a bola desenha somam 180°.
dict(**GEO, id='d2-banco-mat-p26-11', resp='C', objeto='bola-na-tabela', cobra='ângulo',
  confere=180 - (35 + 35),
  enun='Numa mesa de sinuca, uma bola bate na tabela formando 35° com ela. Depois da batida, o ângulo de saída é igual ao de chegada, medido com a mesma tabela e do outro lado da batida. A bola desenha um V: o caminho de ida e o de volta partem do ponto da batida e ficam do lado da mesa.\nO ângulo de abertura desse V mede',
  alts=['35°', '70°', '110°', '145°', '55°'],
  ideia='A tabela é uma linha reta de 180°. A bola gasta 35° na chegada e 35° na saída, e o que sobra é a abertura do V: 180 − 70 = 110°.',
  pecas=[('Ângulo', 'A abertura entre duas linhas que saem do mesmo ponto, medida em graus.')],
  conferencia='S = 35+35 = 70; V = 180-70 = 110. C. A = só o ângulo de chegada; B = a soma S; D = 180-35; E = 90-35.',
  sua_vez=('Bola bate na tabela formando 20° e sai formando 20°. Abertura do V?', ['140°', '40°', '160°', '70°'], '140°', '180 − (20 + 20) = 140.'),
  aula=dict(
    formulas=[('triangulo', 'Linha reta (a tabela)', 'mede 180°'), ('triangulo', 'Regra da batida', 'ângulo de chegada = ângulo de saída')],
    tenho=[('Ângulo de chegada com a tabela', '35°'), ('Ângulo de saída com a tabela', '35°'), ('A tabela inteira', '180°')],
    quer='A questão quer a abertura do V que a bola desenha.',
    equacao='V = 180 − S (abertura = 180° da tabela − os dois ângulos com a tabela)',
    porque='Por que tirar de 180? Em cima da tabela cabem três ângulos lado a lado: o de chegada, o V e o de saída. Juntos eles fecham a linha reta, 180°.',
    letras=[('V', 'abertura do V (o que a questão quer)'), ('S', 'chegada + saída juntas')],
    telas=[
      dict(titulo='Achando S: o seu jeito',
        texto='Parece certo marcar 70°, o valor de S. Mas 70° é só o que a bola gasta perto da tabela, nas duas pontas do V.\nS = 35 + 35 = 70°\nA abertura é o que sobra para chegar a 180°.'),
    ],
    volta='V = 180 − 70 = 110\nLetra C. O V abre 110°. Confere: 35 + 110 + 35 = 180.',
    valores=[('S', '70')],
    pista='bola na tabela → ângulo de saída = ângulo de chegada; chegada + abertura + saída = 180°.',
    coluna_receita='Nesta batida',
    receita=[('1. Tabela do que eu tenho', '35° na chegada e na saída'), ('2. Equação em letras', 'V = 180 − S'), ('3. Achar cada letra', 'S = 70'), ('4. Substituir', '180 − 70 = 110')])),

# Parecida com ENEM 2026 · questão 153 (bola de bilhar): duas batidas num canto reto
# formam um triângulo; o ângulo que falta é 180 − 90 − o que já se conhece.
dict(**GEO, id='d2-banco-mat-p26-12', resp='A', objeto='bola-no-canto', cobra='ângulo',
  confere=180 - (90 + 30),
  enun='Numa mesa de sinuca, a tabela de baixo e a da esquerda se encontram num canto reto, de 90°. Uma bola bate na tabela de baixo formando 30° com ela e segue, depois da batida, formando também 30° com essa tabela, em direção à tabela da esquerda. O ângulo de chegada é sempre igual ao de saída. A bola e as duas batidas formam um triângulo com o canto.\nAo bater na tabela da esquerda, a bola forma com ela um ângulo de',
  alts=['60°', '30°', '45°', '90°', '120°'],
  ideia='O caminho da bola entre as duas batidas, as duas tabelas e o canto formam um triângulo. Os ângulos são 90° do canto e 30° da primeira batida, então o outro é 180 − 90 − 30 = 60°.',
  pecas=[('Triângulo', 'Figura de 3 lados e 3 ângulos. Os 3 ângulos somam 180°.')],
  conferencia='S = 90+30 = 120; X = 180-120 = 60. A. B = repetir os 30°; C = 90/2; D = o canto; E = 180-60.',
  sua_vez=('Triângulo com ângulos de 90° e 20°. Quanto mede o 3º ângulo?', ['70°', '20°', '160°', '90°'], '70°', '180 − (90 + 20) = 70.'),
  aula=dict(
    formulas=[('triangulo', 'Ângulos do triângulo', 'os 3 somam 180°'), ('quadrado', 'Canto reto', 'mede 90°')],
    tenho=[('Canto da mesa', '90°'), ('Ângulo na tabela de baixo', '30°'), ('Soma dos ângulos do triângulo', '180°')],
    quer='A questão quer o ângulo da bola com a tabela da esquerda.',
    equacao='X = 180 − S (ângulo que falta = 180° − os dois ângulos que já conheço)',
    porque='Por que tirar de 180? Os 3 ângulos de um triângulo sempre somam 180°. Se você sabe dois, o terceiro é o que falta.',
    letras=[('X', 'ângulo com a tabela da esquerda (o que a questão quer)'), ('S', 'os dois ângulos que já conheço juntos')],
    telas=[
      dict(titulo='Achando S: o seu jeito',
        texto='Parece certo repetir os 30°, porque a regra diz que chegada e saída são iguais. Mas essa regra vale numa batida só. Aqui são duas tabelas diferentes.\nO triângulo tem o canto de 90° e o ângulo de 30° da primeira batida.\nS = 90 + 30 = 120°'),
    ],
    volta='X = 180 − 120 = 60\nLetra A. A bola bate na tabela da esquerda formando 60°.',
    valores=[('S', '120')],
    pista='bola que bate em duas tabelas num canto reto → triângulo; o ângulo que falta é 180° − 90° − o outro ângulo.',
    coluna_receita='Nesta jogada',
    receita=[('1. Tabela do que eu tenho', 'canto 90°, batida 30°'), ('2. Equação em letras', 'X = 180 − S'), ('3. Achar cada letra', 'S = 120'), ('4. Substituir', '180 − 120 = 60')])),

# Parecida com ENEM 2026 · questão 158 (trajetória em parábola): a altura máxima é o
# vértice; o instante é t = −b ÷ (2a) e a altura vem de pôr esse t na fórmula.
dict(**FUN, id='d2-banco-mat-p26-13', resp='B', objeto='foguete-brinquedo', cobra='valor máximo',
  confere=-2 * 3 * 3 + 12 * 3,
  enun='Um foguete de brinquedo é lançado do chão. Sua altura h, em metros, t segundos depois do lançamento, é dada por h = −2t² + 12t, até ele voltar ao chão.\nA altura máxima que o foguete atinge é de',
  alts=['3 m', '18 m', '12 m', '36 m', '16 m'],
  ideia='A trajetória é uma parábola virada para baixo, e o ponto mais alto é o vértice. Ele ocorre em t = 12 ÷ 4 = 3 s, e h = −2 × 9 + 36 = 18 m.',
  pecas=[('Vértice', 'O ponto mais alto da parábola virada para baixo. Ali a altura é máxima.')],
  conferencia='t = -12/(2*(-2)) = 3; h = -2*9 + 12*3 = 18. B. A = o tempo 3; C = o número 12 da fórmula; D = 12*3; E = h(2) = -8+24.',
  sua_vez=('h = −t² + 6t. Em que segundo a altura é máxima?', ['3 s', '6 s', '9 s', '1 s'], '3 s', 't = −6 ÷ (2 × −1) = −6 ÷ −2 = 3.'),
  aula=dict(
    formulas=[('grafico', 'Instante do ponto mais alto', 't = −b ÷ (2 × a)'), ('grafico', 'Altura nesse instante', 'ponha esse t na fórmula de h')],
    tenho=[('Fórmula da altura', 'h = −2t² + 12t'), ('Valor de a (junto de t²)', '−2'), ('Valor de b (junto de t)', '12')],
    quer='A questão quer a altura máxima do foguete.',
    equacao='H = −2 × T × T + 12 × T (altura máxima = a fórmula de h com o T do ponto mais alto)',
    porque='Por que usar o T do ponto mais alto? A fórmula dá a altura em cada segundo. A maior altura acontece num segundo só: o do vértice da parábola.',
    letras=[('H', 'altura máxima (o que a questão quer)'), ('T', 'segundo do ponto mais alto')],
    telas=[
      dict(titulo='Achando T: o seu jeito',
        texto='Parece certo marcar 3 como resposta. Mas T = 3 é em SEGUNDOS, e a questão pede metros.\nPara achar T: t = −b ÷ (2 × a).\nT = −12 ÷ (2 × −2) = −12 ÷ −4 = 3 s'),
    ],
    volta='H = −2 × 3 × 3 + 12 × 3 = −18 + 36 = 18\nLetra B. O foguete chega a 18 m, no 3º segundo.',
    valores=[('T', '3')],
    pista='trajetória em parábola, pede ponto mais alto → ache t = −b ÷ (2 × a) e ponha esse t na fórmula de h.',
    coluna_receita='Neste foguete',
    receita=[('1. Tabela do que eu tenho', 'a = −2, b = 12'), ('2. Equação em letras', 'H = −2 × T × T + 12 × T'), ('3. Achar cada letra', 'T = 3'), ('4. Substituir', '−18 + 36 = 18')])),
]
