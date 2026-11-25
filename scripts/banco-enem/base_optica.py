"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Óptica
(reflexão, espelho plano, índice de refração, foco, aumento) e um que junta.
Âncoras reais (só estudo): ENEM 2020 D2 (luz num prisma, Herschel) e ENEM 2022 D2
("luz engarrafada", refração). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_optica"""

ARQUIVO = '../escada/fisica-base-optica'

PRISMA = 'ENEM 2020 D2 (luz solar num prisma)'
GARRAFA = 'ENEM 2022 D2 (luz engarrafada, refração)'


def F(nivel='facil'):
  return {'materia': 'Física', 'tema': 'Óptica', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**F(), id='d2-escada-fis-opt-02', resp='C', objeto='laser no espelho', cobra='ângulo de reflexão igual ao de incidência', confere=35 * 2,
  ancora=PRISMA, canal='fis-08 [8:14:00] reflexão da luz nos espelhos',
  enun='Um raio de laser bate num espelho plano. O ângulo entre o raio que chega e a normal (a linha em pé sobre o espelho) é de 35 graus. Qual é o ângulo entre o raio que chega e o raio que volta?',
  alts=['35°', '55°', '70°', '110°', '17,5°'],
  ideia='O raio volta com o mesmo ângulo que chegou: 35 graus de um lado da normal e 35 do outro, 70 no total.',
  pecas=[('Normal', 'Uma linha em pé sobre o espelho, no ponto onde o raio bate.'), ('°', 'Lê-se graus: a medida de um ângulo.')],
  conferencia='35 + 35 = 70. C. A = só um lado; B = 90-35; D = 180-70; E = 35/2.',
  sua_vez=('O raio chega a 20° da normal. Ângulo entre os dois raios?', ['40°', '20°', '70°', '10°'], '40°', '20 × 2 = 40°.'),
  aula=dict(
    formulas=[('lente', 'Reflexão', 'ângulo que volta = ângulo que chega')],
    tenho=[('Ângulo de chegada', '35°')],
    quer='A questão quer a abertura entre os dois raios.',
    equacao='e = 2 × i (ângulo entre os raios = 2 × ângulo de incidência)',
    porque='Por que 2 vezes? Se o raio chegasse a 10°, voltaria a 10°: 10 + 10 = 20° entre eles.',
    letras=[('e', 'ângulo entre os dois raios (o que a questão quer)'), ('i', 'ângulo de incidência: entre o raio que chega e a normal')],
    telas=[tela('Achando i (ângulo que chega)', 'O enunciado dá direto.\ni = 35°'),
           tela('O seu jeito', 'Parece certo responder 35°, a letra A.\n35° é só um lado da normal.\nDo outro lado o raio que volta abre mais 35°.')],
    volta='e = 2 × 35 = 70°\nLetra C.',
    valores=[('i', '35°')],
    pista='"entre o raio que chega e o que volta" → 2 vezes o ângulo com a normal.',
    receita=receita('35° com a normal', 'e = 2 × i', 'i = 35', '2 × 35 = 70'))),

dict(**F(), id='d2-escada-fis-opt-03', resp='A', objeto='bailarina no espelho', cobra='distância até a imagem no espelho plano', confere=2 * 3,
  ancora=PRISMA, canal='fora do canal: espelho plano só é citado em fis-08',
  enun='Uma bailarina está a 3 m de um espelho plano. Qual é a distância entre a bailarina e a imagem dela?',
  alts=['6 m', '3 m', '1,5 m', '9 m', '0 m'],
  ideia='No espelho plano a imagem fica atrás do espelho, à mesma distância: 3 m na frente e 3 m atrás, 6 m no total.',
  pecas=[('Espelho plano', 'O espelho reto, como o do banheiro.'), ('Imagem', 'O que se vê "dentro" do espelho.')],
  conferencia='3 + 3 = 6. A. B = só até o espelho; C = 3/2; D = 3×3; E = 3-3.',
  sua_vez=('Um gato está a 2 m do espelho. Distância até a imagem?', ['4 m', '2 m', '1 m', '8 m'], '4 m', '2 × 2 = 4 m.'),
  aula=dict(
    formulas=[('lente', 'Espelho plano', 'distância até a imagem = 2 × distância até o espelho')],
    tenho=[('Distância até o espelho', '3 m')],
    quer='A questão quer da bailarina até a imagem.',
    equacao='d = 2 × p (distância até a imagem = 2 × distância da pessoa ao espelho)',
    porque='Por que 2 vezes? A 1 m do espelho, a imagem fica 1 m atrás dele: 1 + 1 = 2 m.',
    letras=[('d', 'distância entre a bailarina e a imagem (o que a questão quer)'), ('p', 'distância da pessoa ao espelho, em metros')],
    telas=[tela('Achando p (pessoa ao espelho)', 'O enunciado dá direto.\np = 3 m'),
           tela('O seu jeito', 'Parece certo responder 3 m, a letra B.\n3 m é só até o espelho.\nA imagem está mais 3 m atrás dele.')],
    volta='d = 2 × 3 = 6 m\nLetra A.',
    valores=[('p', '3 m')],
    pista='"distância entre a pessoa e a imagem" → o dobro da distância ao espelho.',
    receita=receita('3 m do espelho', 'd = 2 × p', 'p = 3', '2 × 3 = 6'))),

dict(**F(), id='d2-escada-fis-opt-04', resp='E', objeto='luz num bloco', cobra='índice de refração n = c ÷ v', confere=300000 / 200000,
  ancora=GARRAFA, canal='fis-08 [8:15:00] índice de refração: velocidade no vácuo dividida pela velocidade no meio',
  enun='No vácuo, a luz anda 300 000 km a cada segundo. Dentro de um bloco transparente, ela anda 200 000 km a cada segundo. Qual é o índice de refração do bloco?',
  alts=['0,67', '100 000', '5', '2', '1,5'],
  ideia='O índice diz quantas vezes a luz é mais rápida no vácuo do que no material: 300 000 dividido por 200 000 é 1,5.',
  pecas=[('Vácuo', 'Lugar sem nada, nem ar.'), ('Índice de refração', 'Um número que diz quanto o material freia a luz.')],
  conferencia='300000/200000 = 1,5. E. A = invertido; B = diferença; C = soma sem os zeros; D = arredondou.',
  sua_vez=('Num cristal a luz anda 150 000 km por segundo (no vácuo, 300 000). Índice?', ['2', '0,5', '150 000', '4,5'], '2', '300 000 ÷ 150 000 = 2.'),
  aula=dict(
    formulas=[('lente', 'Índice de refração', 'índice = velocidade no vácuo ÷ velocidade no material')],
    tenho=[('Luz no vácuo', '300 000 km por segundo'), ('Luz no bloco', '200 000 km por segundo')],
    quer='A questão quer o índice de refração do bloco.',
    equacao='n = c ÷ v (índice = velocidade no vácuo ÷ velocidade no bloco)',
    porque='Por que dividir? Se a luz fosse 10 no vácuo e 5 no bloco, seria 10 ÷ 5 = 2 vezes mais rápida fora.',
    letras=[('n', 'índice de refração (o que a questão quer)'), ('c', 'velocidade da luz no vácuo'), ('v', 'velocidade da luz no bloco')],
    telas=[tela('Achando c (luz no vácuo)', 'O enunciado dá direto.\nc = 300 000 km por segundo'),
           tela('Achando v (luz no bloco)', 'O enunciado dá direto.\nv = 200 000 km por segundo')],
    volta='n = 300 000 ÷ 200 000\nTirar os mesmos zeros dos dois não muda a resposta: 3 ÷ 2\n2 cabe 1 vez em 3 e sobra 1.\nO 1 que sobrou são 10 décimos: 10 ÷ 2 = 5 décimos, ou 0,5\nn = 1 + 0,5 = 1,5\nLetra E.',
    valores=[('c', '300 000'), ('v', '200 000')],
    pista='dá as duas velocidades da luz → a do vácuo dividida pela do material.',
    receita=receita('300 000 e 200 000', 'n = c ÷ v', 'c = 300 000; v = 200 000', '300 000 ÷ 200 000 = 1,5'))),

dict(**F(), id='d2-escada-fis-opt-05', resp='B', objeto='espelho côncavo', cobra='foco = raio ÷ 2', confere=80 / 2,
  ancora=PRISMA, canal='fis-08 [7:22:31] foco e raio de curvatura do espelho esférico',
  enun='Um espelho côncavo, daqueles curvos para dentro, tem raio de curvatura de 80 cm. A que distância do espelho fica o foco?',
  alts=['80 cm', '40 cm', '160 cm', '20 cm', '78 cm'],
  ideia='O foco fica na metade do raio: 80 dividido por 2 é 40 cm.',
  pecas=[('Raio de curvatura', 'O espelho é um pedaço da casca de uma bola: é a distância do meio da bola até a casca.'), ('Foco', 'O ponto onde se juntam os raios que chegam paralelos à linha do meio do espelho.')],
  conferencia='80/2 = 40. B. A = o raio; C = 80×2; D = 80/4; E = 80-2.',
  sua_vez=('Raio de curvatura 50 cm. Distância do foco?', ['25 cm', '50 cm', '100 cm', '48 cm'], '25 cm', '50 ÷ 2 = 25 cm.'),
  aula=dict(
    formulas=[('lente', 'Foco', 'foco = raio ÷ 2')],
    tenho=[('Raio de curvatura', '80 cm')],
    quer='A questão quer a distância do foco ao espelho.',
    equacao='f = r ÷ 2 (distância do foco = raio de curvatura ÷ 2)',
    porque='Por que 2? É a regra do espelho esférico: o foco fica no meio do raio. Raio 10 cm, foco 5 cm.',
    letras=[('f', 'distância do foco, em cm (o que a questão quer)'), ('r', 'raio de curvatura, em cm')],
    telas=[tela('Achando r (raio)', 'O enunciado dá direto.\nr = 80 cm')],
    volta='f = 80 ÷ 2 = 40 cm\nLetra B.',
    valores=[('r', '80 cm')],
    pista='dá o raio do espelho e pede o foco → a metade.',
    receita=receita('raio 80 cm', 'f = r ÷ 2', 'r = 80', '80 ÷ 2 = 40'))),

dict(**F(), id='d2-escada-fis-opt-06', resp='D', objeto='espelho de maquiagem', cobra='aumento da imagem', confere=12 / 3,
  ancora=PRISMA, canal='fis-08 [7:32:31] a imagem aumenta de tamanho',
  enun='Diante de um espelho curvo de maquiagem, um detalhe de 3 mm de altura aparece com uma imagem de 12 mm de altura. De quantas vezes é o aumento?',
  alts=['9 vezes', '36 vezes', '0,25 vez', '4 vezes', '15 vezes'],
  ideia='Aumento é quantas vezes o objeto cabe na imagem: 3 mm cabem 4 vezes em 12 mm.',
  pecas=[('Imagem', 'O que se vê "dentro" do espelho.'), ('mm', 'Lê-se milímetros.'), ('Objeto', 'A coisa de verdade, que está na frente do espelho.')],
  conferencia='12/3 = 4. D. A = 12-3; B = 12×3; C = 3/12; E = 12+3.',
  sua_vez=('Objeto de 2 cm, imagem de 10 cm. Aumento?', ['5 vezes', '8 vezes', '20 vezes', '12 vezes'], '5 vezes', '10 ÷ 2 = 5.'),
  aula=dict(
    formulas=[('lente', 'Aumento', 'aumento = altura da imagem ÷ altura do objeto')],
    tenho=[('Altura do objeto', '3 mm'), ('Altura da imagem', '12 mm')],
    quer='A questão quer quantas vezes a imagem é maior.',
    equacao='a = h ÷ o (aumento = altura da imagem ÷ altura do objeto)',
    porque='Por que dividir? Objeto de 1 mm com imagem de 2 mm: 2 ÷ 1 = 2 vezes maior.',
    letras=[('a', 'aumento, em vezes (o que a questão quer)'), ('h', 'altura da imagem'), ('o', 'altura do objeto')],
    telas=[tela('Achando h (altura da imagem)', 'O enunciado dá direto.\nh = 12 mm'),
           tela('Achando o (altura do objeto)', 'O enunciado dá direto.\no = 3 mm')],
    volta='a = 12 ÷ 3 = 4 vezes\nLetra D.',
    valores=[('h', '12 mm'), ('o', '3 mm')],
    pista='"quantas vezes maior" → imagem dividida pelo objeto.',
    receita=receita('3 mm e 12 mm', 'a = h ÷ o', 'h = 12; o = 3', '12 ÷ 3 = 4'))),

dict(**F('medio'), id='d2-escada-fis-opt-07', resp='B', objeto='fibra óptica', cobra='tempo da luz numa fibra pelo índice de refração', confere=600 / (300000 / 1.5),
  ancora=GARRAFA, canal='fis-08 [8:15:00] índice de refração e velocidade da luz no meio',
  enun='Um sinal de internet viaja como luz por uma fibra óptica de 600 km. O índice de refração da fibra é 1,5, e a luz no vácuo anda 300 000 km a cada segundo. Quanto tempo o sinal leva para atravessar a fibra?',
  alts=['0,002 s', '0,003 s', '0,03 s', '400 s', '500 s'],
  ideia='Primeiro a velocidade dentro da fibra: 300 000 ÷ 1,5 = 200 000 km por segundo. Depois o tempo: 600 ÷ 200 000 = 0,003 s.',
  pecas=[('Fibra óptica', 'Um fio de vidro por onde a luz leva o sinal.'), ('Índice de refração', 'Velocidade no vácuo dividida pela velocidade no material.'), ('Vácuo', 'Lugar sem nada, nem ar.')],
  conferencia='v = 200000; t = 600/200000 = 0,003. B. A = usou a luz no vácuo; C = erro de zero; D = 600/1,5; E = 300000/600.',
  sua_vez=('Fibra de 400 km, luz dentro dela a 200 000 km por segundo. Tempo?', ['0,002 s', '0,02 s', '500 s', '2 s'], '0,002 s', '400 ÷ 200 000 = 2 ÷ 1000 = 0,002 s.'),
  aula=dict(
    formulas=[('lente', 'Velocidade no material', 'velocidade = luz no vácuo ÷ índice'), ('carro', 'Tempo', 'tempo = distância ÷ velocidade')],
    tenho=[('Fibra', '600 km'), ('Índice', '1,5'), ('Luz no vácuo', '300 000 km por segundo')],
    quer='A questão quer o tempo dentro da fibra.',
    equacao='t = d ÷ v (tempo = distância ÷ velocidade na fibra)',
    porque='Por que não usar 300 000? Essa é a luz no vácuo. Dentro da fibra ela é mais lenta.',
    letras=[('t', 'tempo, em segundos (o que a questão quer)'), ('d', 'distância: o tamanho da fibra, em km'), ('v', 'velocidade da luz na fibra')],
    telas=[tela('Achando d (distância)', 'O enunciado dá direto.\nd = 600 km'),
           tela('Achando v (velocidade na fibra)', '6 ÷ 2 = 3, então 6 ÷ 3 = 2. Do mesmo jeito: fibra = vácuo ÷ índice.\nv = 300 000 ÷ 1,5\nVezes 10 nos dois tira a vírgula e não muda a resposta: 3 000 000 ÷ 15\n30 ÷ 15 = 2, e voltam cinco zeros\nv = 200 000 km por segundo')],
    volta='t = 600 ÷ 200 000\nTire dois zeros dos dois: 6 ÷ 2000\nMetade dos dois dá o mesmo: 3 ÷ 1000\n3 pedaços de mil: t = 0,003 s\nLetra B.',
    valores=[('d', '600 km'), ('v', '200 000')],
    pista='dá o índice e pede o tempo → primeiro a velocidade no material, depois distância ÷ velocidade.',
    receita=receita('600 km; 1,5; 300 000', 't = d ÷ v', 'd = 600; v = 200 000', '600 ÷ 200 000 = 0,003'))),
]
