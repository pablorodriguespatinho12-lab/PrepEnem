"""Parecidas com mais questões de Matemática do ENEM 2026, dia 2, caderno azul (Pablo,
17/11/2026). Cada uma cobra a MESMA ideia da questão do ENEM, numa situação diferente
e com outros números; o texto do ENEM não é copiado. Sem cena. Aula no molde da
"Aula do Robô Aspirador" (passos_aula em montar.py). Um arquivo por tema."""
import math

ARQUIVO = 'parecidas-2026-c'
ARQUIVO_POR_TEMA = {
  'Funções': 'parecidas-2026-c-funcoes',
  'Geometria Plana': 'parecidas-2026-c-geometria',
  'Análise Combinatória e Probabilidade': 'parecidas-2026-c-contagem',
}
MAT = {'materia': 'Matemática'}
FUN = {**MAT, 'tema': 'Funções'}
GEO = {**MAT, 'tema': 'Geometria Plana'}
CONTA = {**MAT, 'tema': 'Análise Combinatória e Probabilidade'}

FICHAS = [
# Parecida com ENEM 2026 · questão 158 (sinalizador em parábola): a altura máxima
# está no vértice da função do 2º grau; acha-se o instante do topo e põe-se na lei.
dict(**FUN, id='d2-banco-mat-p26-14', resp='D', objeto='sinalizador-barco', cobra='vértice',
  confere=-4 * 3 * 3 + 24 * 3 + 5,
  enun='De um barco, alguém lança um sinalizador para cima. A altura dele, em metros, depois de t segundos, é dada por h = −4t² + 24t + 5.\nA altura máxima que o sinalizador atinge é de',
  alts=['3 m', '5 m', '36 m', '41 m', '77 m'],
  ideia='O topo da curva está em T = 24 ÷ (2 × 4) = 3 s. Colocando 3 na lei, H = −36 + 72 + 5 = 41 m.',
  pecas=[('Vértice', 'O ponto mais alto da curva quando ela abre para baixo. Aqui, o topo do voo.')],
  conferencia='T = 24/(2*4) = 3; H = -4*9 + 72 + 5 = 41. D. A = o tempo T; B = a altura de saída; C = sem o 5 (-36+72); E = 24*3+5, sem o termo do t ao quadrado.',
  sua_vez=('Altura h = −2t² + 12t + 1, em metros. Qual a altura máxima?', ['19 m', '37 m', '3 m', '25 m'], '19 m', 'T = 12 ÷ (2 × 2) = 3. H = −2 × 9 + 12 × 3 + 1 = −18 + 36 + 1 = 19.'),
  aula=dict(
    formulas=[('grafico', 'Instante do topo', 'T = número do t ÷ (2 × número do t × t), sem o menos'), ('grafico', 'Altura no topo', 'ponha o T na lei no lugar do t')],
    tenho=[('Lei da altura', '−4 × t × t + 24 × t + 5'), ('t', 'tempo, em segundos'), ('Altura', 'em metros')],
    quer='A questão quer a altura máxima do sinalizador.',
    equacao='H = −4 × T × T + 24 × T + 5 (altura = a lei, com T no lugar do t)',
    porque='Por que achar T antes? O sinalizador sobe, para e desce. O ponto mais alto acontece em um instante só, o T. Com ele na lei, sai a altura do topo.',
    letras=[('H', 'altura máxima (o que a questão quer)'), ('T', 'instante em que ele chega ao topo')],
    telas=[
      dict(titulo='Achando T (o instante do topo)',
        texto='A curva sobe e desce igual dos dois lados. O topo fica no meio.\nUse o número do t × t (4, sem o menos) e o número do t (24).\nT = 24 ÷ (2 × 4)\nT = 24 ÷ 8 = 3 segundos'),
      dict(titulo='Achando H: o seu jeito',
        texto='Parece certo responder 3, o que acabou de sair. Mas 3 é o tempo, em segundos. A questão pede metros.\nPara a altura, ponha T = 3 na lei:\nH = −4 × 3 × 3 + 24 × 3 + 5\nH = −36 + 72 + 5 = 41 m'),
    ],
    volta='H = −4 × 3 × 3 + 24 × 3 + 5 = −36 + 72 + 5 = 41\nLetra D. O sinalizador chega a 41 m, aos 3 segundos.',
    valores=[('T', '3'), ('H', '41')],
    pista='altura máxima de uma curva do 2º grau → ache o instante do topo (número do t ÷ 2 vezes o do t × t) e ponha na lei.',
    receita=[('1. Tabela do que eu tenho', 'lei com 4, 24 e 5'), ('2. Equação em letras', 'H = −4 × T × T + 24 × T + 5'), ('3. Achar cada letra', 'T = 3'), ('4. Substituir', '−36 + 72 + 5 = 41')])),

# Parecida com ENEM 2026 · questão 180 (câmera em trilho circular): o arco é uma
# parte da volta, e a parte do tempo é a mesma parte da volta.
dict(**GEO, id='d2-banco-mat-p26-15', resp='C', objeto='camera-trilho', cobra='arco e tempo',
  confere=2 * 3 * 15 * 50 / 180,
  enun='Uma câmera de segurança anda sobre um trilho em forma de circunferência, de raio 15 m. Ela dá uma volta completa em 3 minutos, sempre na mesma velocidade. Use 3 como valor de π.\nEm 50 segundos, a distância que a câmera percorre no trilho é de',
  alts=['1,8 m', '12,5 m', '25 m', '90 m', '324 m'],
  ideia='A volta toda mede 2 × 3 × 15 = 90 m e leva 180 s. Em 50 s ela anda 90 × 50 ÷ 180 = 25 m.',
  pecas=[('Circunferência', 'A linha da borda do círculo. A volta toda mede 2 × π × raio.')],
  conferencia='C = 2*3*15 = 90; D = 90*50/180 = 25. C. A = 90/50; B = (3*15)*50/180, sem o 2; D = a volta toda; E = 90*180/50.',
  sua_vez=('Raio 10 m, π = 3, volta em 60 s. Quanto anda em 15 s?', ['15 m', '30 m', '5 m', '60 m'], '15 m', 'C = 2 × 3 × 10 = 60. D = 60 × 15 ÷ 60 = 15.'),
  aula=dict(
    formulas=[('circulo', 'Comprimento da volta toda', '2 × π × raio'), ('circulo', 'Pedaço da volta', 'volta × tempo andado ÷ tempo da volta')],
    tenho=[('Raio do trilho', '15 m'), ('Tempo da volta', '3 min = 180 s'), ('Tempo andado', '50 s'), ('π', '3')],
    quer='A questão quer a distância que a câmera anda em 50 s.',
    equacao='D = C × 50 ÷ 180 (distância = a volta toda × a parte do tempo que ela andou)',
    porque='Por que × 50 ÷ 180? Em 180 s a câmera anda a volta toda. Em 90 s, metade do tempo, anda metade da volta. Em 50 s anda 50 de 180 partes da volta.',
    letras=[('D', 'distância andada em 50 s (o que a questão quer)'), ('C', 'comprimento da volta toda')],
    telas=[
      dict(titulo='Achando C: o seu jeito',
        texto='Parece certo fazer 3 × 15 = 45, que é π × raio. Mas isso é só meia volta. A volta toda é 2 × π × raio.\nC = 2 × 3 × 15\nC = 90 m'),
    ],
    volta='D = 90 × 50 ÷ 180 = 90 ÷ 180 × 50 = 0,5 × 50 = 25\nLetra C. Em 50 s a câmera anda 25 m, um pouco mais que um quarto da volta.',
    valores=[('C', '90')],
    pista='anda numa circunferência por um tempo → ache a volta toda (2 × π × raio) e tome a mesma parte do tempo.',
    receita=[('1. Tabela do que eu tenho', 'raio 15, volta em 180 s, 50 s'), ('2. Equação em letras', 'D = C × 50 ÷ 180'), ('3. Achar cada letra', 'C = 90'), ('4. Substituir', '90 × 50 ÷ 180 = 25')])),

# Parecida com ENEM 2026 · questão 180 (câmera em trilho circular): arco por ângulo,
# depois o tempo é a distância dividida pela velocidade.
dict(**GEO, id='d2-banco-mat-p26-16', resp='B', objeto='camera-arco', cobra='arco, ângulo e tempo',
  confere=(2 * 3 * 30 * 60 / 360) / 2,
  enun='Uma câmera percorre um trilho circular de raio 30 m, sempre com velocidade de 2 m/s. Ela vai de um ponto a outro do trilho, e o arco entre os dois pontos forma 60° no centro do círculo. Use 3 como valor de π.\nO tempo que a câmera leva para ir de um ponto ao outro é de',
  alts=['7,5 s', '15 s', '30 s', '60 s', '90 s'],
  ideia='A volta toda mede 2 × 3 × 30 = 180 m, e 60° é 1 sexto dela: 30 m. A 2 m/s, o tempo é 30 ÷ 2 = 15 s.',
  pecas=[('Arco', 'Um pedaço da circunferência, entre dois pontos. Os 360° são a volta toda.')],
  conferencia='C = 2*3*30 = 180; A = 180*60/360 = 30; T = 30/2 = 15. B. A = com C = 3*30 (sem o 2): 15/2; C = parou no arco; D = 30*2; E = 180/2.',
  sua_vez=('Raio 10 m, π = 3, arco de 90°, velocidade 3 m/s. Quanto tempo?', ['5 s', '15 s', '45 s', '2 s'], '5 s', 'C = 2 × 3 × 10 = 60. Arco = 60 ÷ 4 = 15. T = 15 ÷ 3 = 5.'),
  aula=dict(
    formulas=[('circulo', 'Comprimento da volta toda', '2 × π × raio'), ('circulo', 'Arco de um ângulo', 'volta × ângulo ÷ 360')],
    tenho=[('Raio do trilho', '30 m'), ('Velocidade', '2 m por segundo'), ('Ângulo do arco', '60 graus'), ('Volta toda', '360 graus'), ('π', '3')],
    quer='A questão quer o tempo para a câmera andar o arco de 60 graus.',
    equacao='T = A ÷ 2 (tempo = distância do arco ÷ velocidade)',
    porque='Por que dividir? Andando 2 m a cada segundo, 10 m levam 10 ÷ 2 = 5 s. Quanto mais longo o arco, mais tempo.',
    letras=[('T', 'tempo gasto (o que a questão quer)'), ('A', 'comprimento do arco de 60 graus'), ('C', 'comprimento da volta toda')],
    telas=[
      dict(titulo='Achando C (a volta toda)',
        texto='A volta toda do círculo mede 2 × π × raio.\nC = 2 × 3 × 30\nC = 180 m'),
      dict(titulo='Achando A (o arco)',
        texto='A volta toda tem 360 graus. O arco tem 60 graus, que é uma parte da volta: 60 ÷ 360 = 1 ÷ 6.\nA = 180 ÷ 6\nA = 30 m'),
      dict(titulo='Achando T: o seu jeito',
        texto='Parece certo fazer 30 × 2 = 60. Mas 2 m/s quer dizer 2 metros por segundo. Para saber os segundos, divida os metros pela velocidade.\nT = 30 ÷ 2\nT = 15 s'),
    ],
    volta='T = A ÷ 2 = 30 ÷ 2 = 15\nLetra B. A câmera leva 15 s para andar 1 sexto da volta.',
    valores=[('C', '180'), ('A', '30'), ('T', '15')],
    pista='arco com ângulo e velocidade → volta toda × (ângulo ÷ 360) dá o arco; arco ÷ velocidade dá o tempo.',
    receita=[('1. Tabela do que eu tenho', 'raio 30, 2 m/s, 60 graus'), ('2. Equação em letras', 'T = A ÷ 2'), ('3. Achar cada letra', 'C = 180; A = 30'), ('4. Substituir', '30 ÷ 2 = 15')])),

# Parecida com ENEM 2026 · questão 141 (distância entre pia e fogão): o caminho em
# linha reta entre duas paredes em canto reto é a diagonal (Pitágoras); aumento = novo − velho.
dict(**GEO, id='d2-banco-mat-p26-17', resp='E', objeto='galpao-fio', cobra='Pitágoras',
  confere=math.hypot(15, 20) - math.hypot(9, 12),
  enun='Num galpão, duas paredes formam um canto reto. A máquina X está encostada numa parede, a 9 m do canto, e a máquina Y está encostada na outra parede, a 12 m do canto. Numa reforma, X vai para 15 m do canto e Y para 20 m do canto, cada uma na sua parede. Um fio vai em linha reta de X até Y.\nCom a reforma, o fio aumenta em',
  alts=['25 m', '15 m', '8 m', '14 m', '10 m'],
  ideia='Em linha reta, o fio é a diagonal do canto reto: 15 m antes e 25 m depois, por Pitágoras. O aumento é 25 − 15 = 10 m.',
  pecas=[('Diagonal', 'A linha reta que liga os dois pontos, de frente para o canto reto.')],
  conferencia='antes = raiz(81+144) = 15; depois = raiz(225+400) = 25; aumento = 10. E. A = o fio novo; B = o fio velho; C = 20-12; D = (15+20)-(9+12), somando os lados.',
  sua_vez=('Dois lados de um canto reto: 3 m e 4 m. Qual a distância em linha reta?', ['5 m', '7 m', '12 m', '25 m'], '5 m', '3 × 3 = 9; 4 × 4 = 16; 9 + 16 = 25; 5 × 5 = 25.'),
  aula=dict(
    formulas=[('triangulo-retangulo', 'Pitágoras (canto reto)', 'diagonal × diagonal = lado × lado + outro lado × outro lado')],
    tenho=[('X e Y antes', '9 m e 12 m do canto'), ('X e Y depois', '15 m e 20 m do canto'), ('Fio', 'em linha reta de X até Y')],
    quer='A questão quer quanto o fio aumenta.',
    equacao='A = N − V (aumento = fio novo − fio velho)',
    porque='Por que tirar? Aumento é o quanto passou do que era. Se o fio era 7 m e ficou 9 m, aumentou 9 − 7 = 2 m.',
    letras=[('A', 'aumento do fio (o que a questão quer)'), ('V', 'fio velho, antes da reforma'), ('N', 'fio novo, depois da reforma')],
    telas=[
      dict(titulo='Achando V: o seu jeito',
        texto='Parece certo somar os lados: 9 + 12 = 21 m. Mas o fio vai em linha reta, na diagonal, e ela é mais curta que os dois lados somados.\nPitágoras: diagonal × diagonal = lado × lado + lado × lado\n9 × 9 = 81 e 12 × 12 = 144\n81 + 144 = 225\nQue número vezes ele mesmo dá 225? 15 × 15 = 225.\nV = 15 m'),
      dict(titulo='Achando N (o fio novo)',
        texto='Mesma conta, agora com 15 e 20.\n15 × 15 = 225 e 20 × 20 = 400\n225 + 400 = 625\n25 × 25 = 625\nN = 25 m'),
    ],
    volta='A = N − V = 25 − 15 = 10\nLetra E. O fio fica 10 m maior.',
    valores=[('V', '15'), ('N', '25'), ('A', '10')],
    pista='distância em linha reta entre dois pontos em paredes em canto reto → Pitágoras; "aumenta" → fio novo − fio velho.',
    receita=[('1. Tabela do que eu tenho', '9 e 12; 15 e 20'), ('2. Equação em letras', 'A = N − V'), ('3. Achar cada letra', 'V = 15; N = 25'), ('4. Substituir', '25 − 15 = 10')])),

# Parecida com ENEM 2026 · questão 141 (distância entre pia e fogão): diagonal de um
# triângulo com canto reto (poste, chão e cabo) por Pitágoras, antes e depois.
dict(**GEO, id='d2-banco-mat-p26-18', resp='A', objeto='antena-cabo', cobra='Pitágoras',
  confere=math.hypot(12, 16) - math.hypot(12, 5),
  enun='Uma antena é um poste reto de 12 m, em terreno plano. Um cabo de aço vai do topo do poste até um ponto no chão, em linha reta. Hoje o ponto no chão fica a 5 m da base do poste. Numa mudança, o ponto passa a ficar a 16 m da base, e o cabo é trocado por outro.\nO novo cabo é maior que o antigo em',
  alts=['7 m', '4 m', '11 m', '13 m', '20 m'],
  ideia='Poste, chão e cabo formam um canto reto: o cabo velho mede 13 m e o novo, 20 m, por Pitágoras. O novo é maior em 20 − 13 = 7 m.',
  pecas=[('Terreno plano', 'Chão sem subida nem descida. Por isso o poste e o chão formam um canto reto.')],
  conferencia='velho = raiz(144+25) = 13; novo = raiz(144+256) = 20; 20-13 = 7. A. B = 16-12; C = 16-5; D = o cabo velho; E = o cabo novo.',
  sua_vez=('Poste de 8 m e ponto no chão a 6 m da base. Tamanho do cabo?', ['10 m', '14 m', '2 m', '28 m'], '10 m', '8 × 8 = 64; 6 × 6 = 36; 64 + 36 = 100; 10 × 10 = 100.'),
  aula=dict(
    formulas=[('triangulo-retangulo', 'Pitágoras (canto reto)', 'cabo × cabo = poste × poste + chão × chão')],
    tenho=[('Altura do poste', '12 m'), ('Ponto no chão, antes', '5 m da base'), ('Ponto no chão, depois', '16 m da base')],
    quer='A questão quer quanto o cabo novo é maior que o antigo.',
    equacao='M = N − V (a mais = cabo novo − cabo velho)',
    porque='Por que tirar? Quanto a mais é o que passou do que era. Se era 10 m e virou 13 m, são 13 − 10 = 3 m a mais.',
    letras=[('M', 'quanto o cabo cresceu (o que a questão quer)'), ('V', 'cabo velho, com o ponto a 5 m'), ('N', 'cabo novo, com o ponto a 16 m')],
    telas=[
      dict(titulo='Achando V (o cabo antigo)',
        texto='O poste, o chão e o cabo formam um triângulo com um canto reto. O cabo é o lado inclinado.\nPitágoras: cabo × cabo = poste × poste + chão × chão\n12 × 12 = 144 e 5 × 5 = 25\n144 + 25 = 169\n13 × 13 = 169\nV = 13 m'),
      dict(titulo='Achando N: o seu jeito',
        texto='Parece certo dizer que o cabo cresceu o mesmo que o ponto andou no chão: 16 − 5 = 11 m. Mas o cabo é inclinado e não cresce igual. Refaça a conta com 16.\n12 × 12 = 144 e 16 × 16 = 256\n144 + 256 = 400\n20 × 20 = 400\nN = 20 m'),
    ],
    volta='M = N − V = 20 − 13 = 7\nLetra A. O cabo novo é 7 m maior.',
    valores=[('V', '13'), ('N', '20'), ('M', '7')],
    pista='lado inclinado entre dois lados em canto reto → Pitágoras; mudou a medida → refaça a conta com o número novo.',
    receita=[('1. Tabela do que eu tenho', 'poste 12; chão 5 e 16'), ('2. Equação em letras', 'M = N − V'), ('3. Achar cada letra', 'V = 13; N = 20'), ('4. Substituir', '20 − 13 = 7')])),

# Parecida com ENEM 2026 · questão 148 (tipo sanguíneo e fator Rh): a chance de dois
# eventos juntos é a chance do 1º vezes a chance do 2º (dentro do 1º).
dict(**CONTA, id='d2-banco-mat-p26-19', resp='A', objeto='banco-de-sangue', cobra='dois eventos juntos',
  confere=0.4 * 0.2 * 100,
  enun='Num banco de sangue, 4 em cada 10 doadores têm sangue do tipo A. Entre os doadores do tipo A, 1 em cada 5 tem fator Rh negativo. Um doador é sorteado ao acaso.\nA chance de esse doador ser do tipo A e ter Rh negativo é de',
  alts=['8%', '20%', '32%', '40%', '60%'],
  ideia='Primeiro o doador precisa ser tipo A (0,4) e, dentro desse grupo, ter Rh negativo (0,2). Os dois juntos: 0,4 × 0,2 = 0,08, ou 8%.',
  pecas=[('Fator Rh', 'Uma marca do sangue. Pode ser positivo ou negativo, além do tipo A, B, AB ou O.')],
  conferencia='0,4*0,2 = 0,08 = 8%. A. B = só o Rh (1 em 5); C = 0,4*0,8, que é A e Rh positivo; D = só o tipo A; E = 40+20.',
  sua_vez=('Metade tem tipo O. Entre os O, 1 em 10 tem Rh negativo. Chance de O e Rh negativo?', ['5%', '10%', '40%', '60%'], '5%', '0,5 × 0,1 = 0,05, ou 5%.'),
  aula=dict(
    formulas=[('porcentagem', 'Parte de um todo', '4 em 10 = 4 ÷ 10 = 0,4 = 40%'), ('contagem', 'Dois eventos juntos', 'chance dos dois = chance do 1º × chance do 2º')],
    tenho=[('Tipo A', '4 em 10 = 0,4'), ('Rh negativo, entre os A', '1 em 5 = 0,2'), ('Rh positivo, entre os A', '4 em 5 = 0,8')],
    quer='A questão quer a chance de ser tipo A e ter Rh negativo, os dois juntos.',
    equacao='P = A × R (os dois juntos = chance de A × chance de Rh negativo dentro do A)',
    porque='Por que multiplicar? Primeiro a pessoa precisa estar no grupo A. Depois, dentro dele, ainda precisa ser Rh negativo. É uma parte de uma parte: metade de metade é 0,5 × 0,5 = 0,25.',
    letras=[('P', 'chance dos dois juntos (o que a questão quer)'), ('A', 'chance de ser tipo A'), ('R', 'chance de Rh negativo, entre os A')],
    telas=[
      dict(titulo='Achando A (o tipo A)',
        texto='4 em cada 10 doadores é tipo A.\nA = 4 ÷ 10 = 0,4'),
      dict(titulo='Achando R: o seu jeito',
        texto='Parece certo responder 20%, o 1 em 5. Mas esse 1 em 5 vale só dentro do grupo A, que são 0,4 dos doadores. Cuidado também com o 4 em 5: ele é o Rh positivo.\nR = 1 ÷ 5 = 0,2'),
    ],
    volta='P = A × R = 0,4 × 0,2 = 0,08 = 8%\nLetra A. De cada 100 doadores, 8 são tipo A com Rh negativo.',
    valores=[('A', '0,4'), ('R', '0,2'), ('P', '0,08 = 8%')],
    pista='"e" entre dois eventos, um dentro do outro → multiplique as chances; ache cada chance antes.',
    receita=[('1. Tabela do que eu tenho', '0,4 e 0,2'), ('2. Equação em letras', 'P = A × R'), ('3. Achar cada letra', 'A = 0,4; R = 0,2'), ('4. Substituir', '0,4 × 0,2 = 0,08')])),

# Parecida com ENEM 2026 · questão 148 (tipo sanguíneo e fator Rh): dois eventos
# independentes juntos, chance multiplicada (aqui, dois defeitos numa peça).
dict(**CONTA, id='d2-banco-mat-p26-20', resp='D', objeto='camisetas-defeito', cobra='dois eventos independentes',
  confere=(1 / 20) * (1 / 10) * 100,
  enun='Numa fábrica, 1 em cada 20 camisetas sai com defeito na cor, e 1 em cada 10 sai com defeito no tamanho. Os dois defeitos acontecem de forma independente: um não muda a chance do outro. Uma camiseta é sorteada ao acaso.\nA chance de ela ter os dois defeitos é de',
  alts=['5%', '10%', '15%', '0,5%', '50%'],
  ideia='Para ter os dois defeitos, a camiseta precisa do da cor (0,05) e também do do tamanho (0,1). Os dois juntos: 0,05 × 0,1 = 0,005, ou 0,5%.',
  pecas=[('Independentes', 'Um evento não muda a chance do outro. Por isso as chances se multiplicam.')],
  conferencia='(1/20)*(1/10) = 0,005 = 0,5%. D. A = só a cor; B = só o tamanho; C = 5+10, somando; E = 0,05/0,1, dividindo.',
  sua_vez=('1 em 10 tem defeito A e 1 em 5 tem defeito B, independentes. Chance dos dois?', ['2%', '30%', '15%', '50%'], '2%', '0,1 × 0,2 = 0,02, ou 2%.'),
  aula=dict(
    formulas=[('contagem', 'Dois eventos independentes', 'chance dos dois = chance do 1º × chance do 2º'), ('porcentagem', 'De fração para porcentagem', '1 ÷ 20 = 0,05 = 5%')],
    tenho=[('Defeito na cor', '1 em 20'), ('Defeito no tamanho', '1 em 10'), ('Os defeitos', 'independentes')],
    quer='A questão quer a chance de a camiseta ter os dois defeitos.',
    equacao='P = C × T (os dois juntos = chance da cor × chance do tamanho)',
    porque='Por que multiplicar? Para ter os dois, é preciso o 1º e também o 2º. Se metade das camisetas é branca e metade das brancas é grande, a chance de branca e grande é metade de metade: 0,5 × 0,5 = 0,25.',
    letras=[('P', 'chance dos dois defeitos (o que a questão quer)'), ('C', 'chance do defeito na cor'), ('T', 'chance do defeito no tamanho')],
    telas=[
      dict(titulo='Achando C (a cor)',
        texto='1 em cada 20 é 1 ÷ 20.\nC = 1 ÷ 20 = 0,05'),
      dict(titulo='Achando T: o seu jeito',
        texto='1 em cada 10 é 1 ÷ 10.\nT = 1 ÷ 10 = 0,1\nParece certo somar: 0,05 + 0,1 = 0,15, ou 15%. Mas somar dá a chance de ter um defeito ou o outro. Ter os dois exige o 1º e também o 2º: multiplica.'),
    ],
    volta='P = C × T = 0,05 × 0,1 = 0,005 = 0,5%\nLetra D. Só 5 em cada 1 000 camisetas têm os dois defeitos.',
    valores=[('C', '0,05'), ('T', '0,1'), ('P', '0,005 = 0,5%')],
    pista='"os dois" e eventos que não se influenciam → multiplique as chances; "um ou outro" seria outra conta.',
    receita=[('1. Tabela do que eu tenho', '1 em 20 e 1 em 10'), ('2. Equação em letras', 'P = C × T'), ('3. Achar cada letra', 'C = 0,05; T = 0,1'), ('4. Substituir', '0,05 × 0,1 = 0,005')])),

# Parecida com ENEM 2026 · questão 171 (data lida igual em dia/mês e mês/dia): a data
# se lê igual nos dois jeitos quando dia = mês; chance = datas assim ÷ todas as datas.
dict(**CONTA, id='d2-banco-mat-p26-21', resp='B', objeto='calendario-semestre', cobra='datas com dia = mês',
  confere=6,
  enun='Um calendário mostra a data como dia/mês, como 3/5. Mas algumas pessoas leem como mês/dia. A data tem o mesmo texto nos dois jeitos de ler quando o dia e o mês são o mesmo número, como 4/4. Considere as datas de 1º de janeiro a 30 de junho de um ano comum, com fevereiro de 28 dias. Uma delas é sorteada ao acaso.\nA chance de a data ser lida igual nos dois jeitos é de',
  alts=['1 em 6', '6 em 181', '12 em 181', '6 em 365', '1 em 12'],
  ideia='Entre janeiro e junho há 181 datas, e só 6 têm dia igual ao mês (1/1 até 6/6). A chance é 6 em 181.',
  pecas=[('Ano comum', 'Ano que não é bissexto: fevereiro tem 28 dias e o ano tem 365 dias.')],
  conferencia='T = 31+28+31+30+31+30 = 181; F = 6 (1/1 a 6/6); P = 6/181. B. A = 1 data por mês, 6 meses; C = 12 datas (um ano todo) em 181; D = 6 em 365 (ano todo); E = 1 em 12.',
  sua_vez=('Só janeiro e fevereiro (59 dias, ano comum). Chance de dia = mês?', ['2 em 59', '1 em 2', '2 em 12', '1 em 59'], '2 em 59', 'Só 1/1 e 2/2 servem: 2. Total: 31 + 28 = 59. Chance: 2 em 59.'),
  aula=dict(
    formulas=[('contagem', 'Chance (probabilidade)', 'datas que servem ÷ todas as datas'), ('contagem', 'Data lida igual', 'o dia é igual ao mês, como 4/4')],
    tenho=[('Primeira data', '1º de janeiro'), ('Última data', '30 de junho'), ('Fevereiro', '28 dias'), ('Data lida igual', 'dia = mês, como 4/4')],
    quer='A questão quer a chance de a data ter dia e mês iguais.',
    equacao='P = F ÷ T (chance = datas que servem ÷ todas as datas)',
    porque='Por que dividir? Chance é a parte que serve dentro do total. Se 3 de 10 bolas são vermelhas, a chance de sortear uma vermelha é 3 ÷ 10.',
    letras=[('P', 'chance (o que a questão quer)'), ('F', 'datas com dia e mês iguais'), ('T', 'todas as datas de janeiro a junho')],
    telas=[
      dict(titulo='Achando T (todas as datas)',
        texto='Some os dias de cada mês, de janeiro a junho.\nJaneiro 31, fevereiro 28, março 31\nAbril 30, maio 31, junho 30\nT = 31 + 28 + 31 + 30 + 31 + 30 = 181'),
      dict(titulo='Achando F: o seu jeito',
        texto='Parece certo contar 12 datas, uma por mês do ano. Mas só 6 meses entram: janeiro a junho.\nEm cada mês, só 1 data tem dia = mês: 1/1, 2/2, 3/3, 4/4, 5/5 e 6/6.\nF = 6'),
    ],
    volta='P = F ÷ T = 6 ÷ 181, ou seja, 6 em 181\nLetra B. Cerca de 3 datas em cada 100.',
    valores=[('T', '181'), ('F', '6'), ('P', '6 em 181')],
    pista='chance de uma data ter uma marca → conte as datas com a marca (F) e todas as datas (T); P = F ÷ T.',
    receita=[('1. Tabela do que eu tenho', '1/1 a 30/6, fevereiro de 28 dias'), ('2. Equação em letras', 'P = F ÷ T'), ('3. Achar cada letra', 'T = 181; F = 6'), ('4. Substituir', '6 ÷ 181')])),

# Parecida com ENEM 2026 · questão 171 (data lida igual em dia/mês e mês/dia): mesma
# ideia, num semestre da escola, de 1º de agosto a 31 de outubro.
dict(**CONTA, id='d2-banco-mat-p26-22', resp='E', objeto='calendario-escola', cobra='datas com dia = mês',
  confere=3,
  enun='Na escola, o 2º semestre vai de 1º de agosto a 31 de outubro. A data aparece como dia/mês, como 4/9, e algumas pessoas leem como mês/dia. A data tem o mesmo texto nos dois jeitos de ler quando o dia e o mês são o mesmo número, como 9/9. Uma data desse período é sorteada ao acaso.\nA chance de ela ser lida igual nos dois jeitos é de',
  alts=['3 em 31', '1 em 3', '12 em 92', '8 em 92', '3 em 92'],
  ideia='De agosto a outubro há 31 + 30 + 31 = 92 datas, e só 3 têm dia igual ao mês: 8/8, 9/9 e 10/10. A chance é 3 em 92.',
  pecas=[('Chance', 'Quantas vezes o que você quer pode acontecer, dividido por todas as vezes possíveis.')],
  conferencia='T = 31+30+31 = 92; F = 3 (8/8, 9/9, 10/10); P = 3/92. E. A = 3 em um mês só; B = 1 data por mês em 3 meses; C = 12 datas (um ano todo); D = só a data 8/8 e outras 8.',
  sua_vez=('Só novembro e dezembro (61 dias). Chance de dia = mês?', ['2 em 61', '2 em 12', '1 em 61', '11 em 61'], '2 em 61', 'Só 11/11 e 12/12 servem: 2. Total: 30 + 31 = 61. Chance: 2 em 61.'),
  aula=dict(
    formulas=[('contagem', 'Chance (probabilidade)', 'datas que servem ÷ todas as datas'), ('contagem', 'Data lida igual', 'o dia é igual ao mês, como 9/9')],
    tenho=[('Primeira data', '1º de agosto'), ('Última data', '31 de outubro'), ('Meses', 'agosto 31, setembro 30, outubro 31'), ('Data lida igual', 'dia = mês, como 9/9')],
    quer='A questão quer a chance de a data ter dia e mês iguais.',
    equacao='P = F ÷ T (chance = datas que servem ÷ todas as datas)',
    porque='Por que dividir? Chance é a parte que serve dentro do total. Se 2 de 8 cartas são ases, a chance de sortear um ás é 2 ÷ 8.',
    letras=[('P', 'chance (o que a questão quer)'), ('F', 'datas com dia e mês iguais'), ('T', 'todas as datas de agosto a outubro')],
    telas=[
      dict(titulo='Achando T (todas as datas)',
        texto='Some os dias dos 3 meses.\nAgosto 31, setembro 30, outubro 31\nT = 31 + 30 + 31 = 92'),
      dict(titulo='Achando F: o seu jeito',
        texto='Parece certo contar 12 datas, uma por mês do ano. Mas só 3 meses entram: agosto, setembro e outubro.\nEm cada mês, só 1 data tem dia = mês: 8/8, 9/9 e 10/10.\nF = 3'),
    ],
    volta='P = F ÷ T = 3 ÷ 92, ou seja, 3 em 92\nLetra E. Cerca de 3 datas em cada 100.',
    valores=[('T', '92'), ('F', '3'), ('P', '3 em 92')],
    pista='chance de uma data ter uma marca → conte as datas com a marca (F) e todas as datas (T); P = F ÷ T.',
    receita=[('1. Tabela do que eu tenho', '1/8 a 31/10'), ('2. Equação em letras', 'P = F ÷ T'), ('3. Achar cada letra', 'T = 92; F = 3'), ('4. Substituir', '3 ÷ 92')])),

# Parecida com ENEM 2026 · questão 157 (curva do 2º grau de carga tributária): acha-se
# a lei por dois pontos e prevê-se um valor mais adiante (extrapolação).
dict(**FUN, id='d2-banco-mat-p26-23', resp='A', objeto='visitas-site', cobra='lei pelos pontos',
  confere=-1 * 5 * 5 + 9 * 5,
  enun='Um site registra quantas visitas recebe por dia, em milhares. Os dados seguem uma curva do 2º grau, V = a × t × t + b × t, em que t é o dia (t = 1 é o 1º dia). No dia 1 foram 8 mil visitas, e no dia 2 foram 14 mil. Se a curva continuar do mesmo jeito, no dia 5 o site terá',
  alts=['20 mil visitas', '14 mil visitas', '32 mil visitas', '45 mil visitas', '60 mil visitas'],
  ideia='Os dois dias dão a = −1 e b = 9, então V = −t × t + 9 × t. No dia 5: −25 + 45 = 20 mil visitas.',
  pecas=[('Extrapolar', 'Usar a lei descoberta para prever um valor além dos dados que você tem.')],
  conferencia='a+b = 8; 4a+2b = 14 -> 2a+b = 7 -> a = -1, b = 9. V(5) = -25+45 = 20. A. B = repetiu o dia 2; C = reta (8+4*6); D = 9*5, sem o termo do t*t; E = a=1 e b=7: 25+35.',
  sua_vez=('V = a × t × t + b × t; dia 1 = 5 e dia 2 = 8. Quanto no dia 3?', ['9', '11', '15', '12'], '9', 'a + b = 5 e 2a + b = 4 dão a = −1, b = 6. Dia 3: −9 + 18 = 9.'),
  aula=dict(
    formulas=[('grafico', 'Lei da curva', 'V = a × t × t + b × t'), ('grafico', 'Cada dia dá uma pista', 'ponha o t e o V do dia na lei')],
    tenho=[('Lei', 'V = a × t × t + b × t'), ('Dia 1', '8 mil visitas'), ('Dia 2', '14 mil visitas'), ('Dia pedido', 'dia 5')],
    quer='A questão quer as visitas do dia 5.',
    equacao='V = A × 5 × 5 + B × 5 (a lei, com o dia 5 no lugar do t)',
    porque='Por que achar A e B antes? A lei tem 2 números escondidos. Os 2 dias dados dão 2 pistas, uma para cada número. Com os dois descobertos, a lei serve para qualquer dia.',
    letras=[('V', 'visitas no dia 5 (o que a questão quer)'), ('A', 'número que multiplica o t × t'), ('B', 'número que multiplica o t')],
    telas=[
      dict(titulo='Achando A: o seu jeito',
        texto='Parece certo ligar os 2 dias com uma reta: de 8 para 14 sobe 6 por dia, e no dia 5 seria 8 + 4 × 6 = 32. Mas a curva é do 2º grau e não sobe sempre igual. Use as duas pistas:\nDia 1: A + B = 8\nDia 2: 4 × A + 2 × B = 14\nDividindo o dia 2 por 2: 2 × A + B = 7\nTire a pista do dia 1: 7 − 8 = −1\nA = −1\nO menos diz que a curva vira para baixo.'),
      dict(titulo='Achando B (o outro número)',
        texto='Volte na pista do dia 1: A + B = 8\n−1 + B = 8\nB = 8 + 1 = 9'),
    ],
    volta='V = −1 × 5 × 5 + 9 × 5 = −25 + 45 = 20\nLetra A. No dia 5, o site terá 20 mil visitas.',
    valores=[('A', '−1'), ('B', '9'), ('V', '20')],
    pista='curva do 2º grau com 2 pontos dados → cada ponto dá uma pista; ache os números da lei e depois ponha o valor pedido.',
    receita=[('1. Tabela do que eu tenho', 'dia 1 = 8; dia 2 = 14'), ('2. Equação em letras', 'V = A × 5 × 5 + B × 5'), ('3. Achar cada letra', 'A = −1; B = 9'), ('4. Substituir', '−25 + 45 = 20')])),

# Parecida com ENEM 2026 · questão 157 (curva do 2º grau de carga tributária): lei com
# termo fixo, achada por dois pontos; prever um valor adiante.
dict(**FUN, id='d2-banco-mat-p26-24', resp='E', objeto='gasto-fabrica', cobra='lei pelos pontos',
  confere=2 * 4 * 4 + 5,
  enun='O gasto de uma fábrica com energia, em milhares de reais, segue a lei G = a × x × x + c, em que x é a produção em centenas de peças. Sem produzir nada (x = 0), o gasto é de 5 mil reais. Com 200 peças (x = 2), o gasto é de 13 mil reais. Mantida a lei, ao produzir 400 peças (x = 4), o gasto será de',
  alts=['69 mil reais', '21 mil reais', '26 mil reais', '32 mil reais', '37 mil reais'],
  ideia='Em x = 0 sobra só c = 5, e em x = 2 a conta dá a = 8 ÷ 4 = 2. Em x = 4, G = 2 × 16 + 5 = 37 mil reais.',
  pecas=[('Termo fixo', 'O número c, que não muda com x. É o gasto quando x vale 0.')],
  conferencia='c = 5; 13 = a*4 + 5 -> a = 2; G(4) = 2*16 + 5 = 37. E. A = a = 4 (÷ 2): 4*16+5; B = reta (5 + 4*4); C = 13*2; D = 2*16, sem o c.',
  sua_vez=('G = a × x × x + c; x = 0 dá 3 e x = 2 dá 11. Quanto em x = 3?', ['21', '15', '39', '18'], '21', 'c = 3. 11 = a × 4 + 3, então a = 2. x = 3: 2 × 9 + 3 = 21.'),
  aula=dict(
    formulas=[('grafico', 'Lei da curva', 'G = a × x × x + c'), ('grafico', 'Quando x = 0', 'sobra só o c')],
    tenho=[('Lei', 'G = a × x × x + c'), ('x = 0', 'G = 5'), ('x = 2', 'G = 13'), ('x pedido', '4')],
    quer='A questão quer o gasto quando x = 4.',
    equacao='G = A × 4 × 4 + C (a lei, com x = 4)',
    porque='Por que achar A e C antes? A lei tem 2 números escondidos. Os 2 pontos dados dão 2 pistas, uma para cada número. Com os dois descobertos, dá para prever x = 4.',
    letras=[('G', 'gasto com x = 4 (o que a questão quer)'), ('C', 'termo fixo da lei'), ('A', 'número que multiplica o x × x')],
    telas=[
      dict(titulo='Achando C (o termo fixo)',
        texto='Com x = 0, as partes com x somem:\nG = A × 0 × 0 + C = C\nO gasto era 5, então C = 5'),
      dict(titulo='Achando A: o seu jeito',
        texto='Pista de x = 2: 13 = A × 2 × 2 + 5\n13 − 5 = A × 4\n8 = A × 4\nParece certo fazer 8 ÷ 2 = 4. Mas o x aparece duas vezes (2 × 2 = 4): divida por 4, não por 2.\nA = 8 ÷ 4 = 2'),
    ],
    volta='G = 2 × 4 × 4 + 5 = 32 + 5 = 37\nLetra E. A fábrica gastaria 37 mil reais.',
    valores=[('C', '5'), ('A', '2'), ('G', '37')],
    pista='curva do 2º grau com pontos dados → o ponto x = 0 dá o termo fixo; o outro dá o resto; depois prevê o valor pedido.',
    receita=[('1. Tabela do que eu tenho', 'x = 0 dá 5; x = 2 dá 13'), ('2. Equação em letras', 'G = A × 4 × 4 + C'), ('3. Achar cada letra', 'C = 5; A = 2'), ('4. Substituir', '32 + 5 = 37')])),
]
