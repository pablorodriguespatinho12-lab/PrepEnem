"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Geometria Plana
(perímetro, área do retângulo, do triângulo, do círculo, Pitágoras) e um que junta.
Enunciado sem figura: a lousa desenha (regra 21). Âncoras reais (só estudo): ENEM 2021 D2
(perímetro de um triângulo) e ENEM 2023 D2 (área de pizza; Pitágoras com círculos).
Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_plana"""

ARQUIVO = '../escada/matematica-base-plana'

PERIMETRO = 'ENEM 2021 D2 (perímetro de um triângulo)'
PIZZA = 'ENEM 2023 D2 (área do círculo de uma pizza)'
PITAGORAS = 'ENEM 2023 D2 (Pitágoras e áreas de círculos)'


def M(nivel='facil'):
  return {'materia': 'Matemática', 'tema': 'Geometria Plana', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


M2 = ('m²', 'Lê-se metro quadrado: um quadrado de 1 m por 1 m.')

FICHAS = [
dict(**M(), id='d2-escada-mat-pla-b01', resp='A', objeto='cerca de um terreno', cobra='perímetro do retângulo', confere=2 * 8 + 2 * 5,
  ancora=PERIMETRO, canal='fora do canal: perímetro de retângulo não achado em mat-21',
  enun='Um terreno retangular de 8 m de comprimento e 5 m de largura vai ser cercado em toda a volta. Quantos metros de cerca são necessários?',
  alts=['26 m', '13 m', '40 m', '21 m', '18 m'],
  ideia='A volta toda tem dois lados de 8 e dois lados de 5: 16 + 10 = 26 m.',
  pecas=[('Perímetro', 'O comprimento da volta toda de uma figura.')],
  conferencia='16+10 = 26. A. B = só dois lados; C = área; D = 8+8+5; E = 8+5+5.',
  sua_vez=('Retângulo de 6 m por 2 m. Perímetro?', ['16 m', '8 m', '12 m', '14 m'], '16 m', '6 + 6 + 2 + 2 = 16 m.'),
  aula=dict(
    formulas=[('retangulo', 'Perímetro', 'volta = 2 × comprimento + 2 × largura')],
    tenho=[('Comprimento', '8 m'), ('Largura', '5 m')],
    quer='A questão quer o tamanho da volta toda.',
    equacao='p = 2 × c + 2 × l (perímetro = dois comprimentos + duas larguras)',
    porque='Por que 2 vezes? Um retângulo tem 4 lados: dois iguais compridos e dois iguais curtos.',
    letras=[('p', 'perímetro, em metros (o que a questão quer)'), ('c', 'comprimento'), ('l', 'largura')],
    telas=[tela('Achando c (comprimento)', 'O enunciado dá direto.\nc = 8 m'),
           tela('Achando l (largura)', 'O enunciado dá direto.\nl = 5 m')],
    volta='p = 2 × 8 + 2 × 5\n2 × 8 = 16\n2 × 5 = 10\np = 16 + 10 = 26 m\nLetra A.',
    valores=[('c', '8 m'), ('l', '5 m')],
    pista='cerca, moldura, volta → some todos os lados.',
    receita=receita('8 m e 5 m', 'p = 2 × c + 2 × l', 'c = 8; l = 5', '16 + 10 = 26'))),

dict(**M(), id='d2-escada-mat-pla-b02', resp='D', objeto='piso de uma sala', cobra='área do retângulo', confere=7 * 4,
  ancora=PERIMETRO, canal='mat-21 [11:28:01] área dos polígonos',
  enun='Uma sala retangular mede 7 m por 4 m e vai receber piso novo. Quantos metros quadrados de piso são necessários?',
  alts=['11 m²', '22 m²', '14 m²', '28 m²', '56 m²'],
  ideia='São 7 quadrados de 1 metro numa fileira e 4 fileiras: 28 m².',
  pecas=[('Área', 'O tamanho de uma superfície, o quanto ela cobre.'), M2],
  conferencia='7×4 = 28. D. A = soma; B = perímetro; C = metade; E = dobro.',
  sua_vez=('Sala de 6 m por 3 m. Área?', ['18 m²', '9 m²', '36 m²', '12 m²'], '18 m²', '6 × 3 = 18 m².'),
  aula=dict(
    formulas=[('retangulo', 'Área do retângulo', 'área = comprimento × largura')],
    tenho=[('Comprimento', '7 m'), ('Largura', '4 m')],
    quer='A questão quer quanto de chão há para cobrir.',
    equacao='a = c × l (área = comprimento × largura)',
    porque='Por que multiplicar? 3 quadrados em cada uma de 2 fileiras: 3 × 2 = 6 quadrados.',
    letras=[('a', 'área, em m² (o que a questão quer)'), ('c', 'comprimento'), ('l', 'largura')],
    telas=[tela('Achando c (comprimento)', 'O enunciado dá direto.\nc = 7 m'),
           tela('Achando l (largura)', 'O enunciado dá direto.\nl = 4 m')],
    volta='a = 7 × 4 = 28 m²\nLetra D.',
    valores=[('c', '7 m'), ('l', '4 m')],
    pista='piso, tinta, grama → área: comprimento × largura.',
    receita=receita('7 m e 4 m', 'a = c × l', 'c = 7; l = 4', '7 × 4 = 28'))),

dict(**M(), id='d2-escada-mat-pla-b03', resp='B', objeto='canteiro triangular', cobra='área do triângulo', confere=6 * 4 / 2,
  ancora=PERIMETRO, canal='mat-21 [11:29:30] área do triângulo é meio de base vezes altura',
  enun='Um canteiro em forma de triângulo tem base de 6 m e altura de 4 m. Qual é a área do canteiro?',
  alts=['24 m²', '12 m²', '10 m²', '5 m²', '48 m²'],
  ideia='O triângulo ocupa metade do retângulo de mesma base e altura: 24 ÷ 2 = 12 m².',
  pecas=[('Base', 'O lado de baixo do triângulo.'), ('Altura', 'A medida em pé, da base até a ponta de cima.'), M2],
  conferencia='24/2 = 12. B. A = retângulo; C = soma; D = metade da soma; E = dobro.',
  sua_vez=('Triângulo de base 10 m e altura 3 m. Área?', ['15 m²', '30 m²', '13 m²', '60 m²'], '15 m²', '10 × 3 = 30; 30 ÷ 2 = 15 m².'),
  aula=dict(
    formulas=[('triangulo', 'Área do triângulo', 'área = base × altura ÷ 2')],
    tenho=[('Base', '6 m'), ('Altura', '4 m')],
    quer='A questão quer a superfície do canteiro.',
    equacao='a = b × h ÷ 2 (área = base × altura ÷ 2)',
    porque='Por que dividir por 2? Um retângulo cortado de um canto até o canto oposto vira 2 triângulos iguais.',
    letras=[('a', 'área, em m² (o que a questão quer)'), ('b', 'base'), ('h', 'altura')],
    telas=[tela('Achando b (base)', 'O enunciado dá direto.\nb = 6 m'),
           tela('Achando h (altura)', 'O enunciado dá direto.\nh = 4 m'),
           tela('O seu jeito', 'Parece certo fazer 6 × 4 = 24, a letra A.\n24 é o retângulo inteiro; o triângulo é a metade.')],
    volta='6 × 4 = 24\na = 24 ÷ 2 = 12 m²\nLetra B.',
    valores=[('b', '6 m'), ('h', '4 m')],
    pista='triângulo → base × altura e metade.',
    receita=receita('base 6, altura 4', 'a = b × h ÷ 2', 'b = 6; h = 4', '24 ÷ 2 = 12'))),

dict(**M(), id='d2-escada-mat-pla-b04', resp='E', objeto='mesa redonda', cobra='área do círculo', confere=3 * 2 * 2,
  ancora=PIZZA, canal='mat-23 [13:15:31] área do círculo',
  enun='O tampo redondo de uma mesa tem raio de 2 m. Usando π = 3, qual é a área do tampo?',
  alts=['6 m²', '4 m²', '36 m²', '7 m²', '12 m²'],
  ideia='A área do círculo é pi × raio × raio: 3 × 2 × 2 = 12 m².',
  pecas=[('π', 'Lê-se pi: um número usado nos círculos. Aqui vale 3.'), ('Raio', 'A distância do meio do círculo até a borda.'), M2],
  conferencia='3×4 = 12. E. A = 3×2; B = sem pi; C = (3×2)²; D = soma.',
  sua_vez=('Círculo de raio 3 m (π = 3). Área?', ['27 m²', '9 m²', '18 m²', '81 m²'], '27 m²', '3 × 3 × 3 = 27 m².'),
  aula=dict(
    formulas=[('circulo', 'Área do círculo', 'área = pi × raio × raio')],
    tenho=[('Raio', '2 m'), ('π', '3')],
    quer='A questão quer a superfície do tampo.',
    equacao='a = p × r × r (área = pi × raio × raio)',
    porque='Por que raio duas vezes? A área do círculo é pi vezes a do quadrado de lado r: raio 1, quadrado 1, círculo 3.',
    letras=[('a', 'área, em m² (o que a questão quer)'), ('p', 'o número pi'), ('r', 'raio')],
    telas=[tela('Achando p (pi)', 'O enunciado manda usar.\np = 3'),
           tela('Achando r (raio)', 'O enunciado dá direto.\nr = 2 m'),
           tela('O seu jeito', 'Parece certo fazer 3 × 2 = 6, a letra A.\nFaltou multiplicar pelo raio de novo.')],
    volta='a = 3 × 2 × 2\n3 × 2 = 6\n6 × 2 = 12 m²\nLetra E.',
    valores=[('p', '3'), ('r', '2 m')],
    pista='área redonda → pi × raio × raio.',
    receita=receita('raio 2, pi 3', 'a = p × r × r', 'p = 3; r = 2', '3 × 2 × 2 = 12'))),

dict(**M(), id='d2-escada-mat-pla-b05', resp='C', objeto='escada encostada', cobra='teorema de Pitágoras', confere=5,
  ancora=PITAGORAS, canal='mat-20 [10:48:01] Pitágoras: a² = b² + c²',
  enun='Uma escada está encostada numa parede em pé. O pé da escada fica a 3 m da parede, e o topo alcança 4 m de altura. Qual é o comprimento da escada?',
  alts=['7 m', '25 m', '5 m', '1 m', '12 m'],
  ideia='Escada, parede e chão formam um triângulo reto: 9 + 16 = 25, e o número que vezes ele mesmo dá 25 é 5.',
  pecas=[('Triângulo reto', 'Triângulo com um canto igual ao canto de uma folha de papel.'), ('Hipotenusa', 'O lado mais comprido, em frente ao canto reto.')],
  conferencia='9+16 = 25; 5. C. A = soma; B = não tirou a raiz; D = diferença; E = produto.',
  sua_vez=('Pé a 6 m, topo a 8 m. Comprimento?', ['10 m', '14 m', '100 m', '2 m'], '10 m', '36 + 64 = 100 = 10 × 10.'),
  aula=dict(
    formulas=[('triangulo-retangulo', 'Pitágoras', 'maior × maior = chão × chão + parede × parede')],
    tenho=[('Chão', '3 m'), ('Parede', '4 m')],
    quer='A questão quer o lado comprido, que é a escada.',
    equacao='h × h = a × a + b × b (escada vezes ela mesma = chão vezes chão + parede vezes parede)',
    porque='Por que vezes ele mesmo? Pitágoras, num canto reto, compara quadrados desenhados nos lados: lado 2 dá 2 × 2 = 4.',
    letras=[('h', 'comprimento da escada, a hipotenusa (o que a questão quer)'), ('a', 'lado no chão'), ('b', 'lado na parede')],
    telas=[tela('Achando a (chão)', 'O enunciado dá direto.\na = 3 m'),
           tela('Achando b (parede)', 'O enunciado dá direto.\nb = 4 m'),
           tela('O seu jeito', 'Parece certo somar 3 + 4 = 7, a letra A.\nA escada corta caminho: é menor que 7.')],
    volta='3 × 3 = 9\n4 × 4 = 16\n9 + 16 = 25\nTeste: 4 × 4 = 16, pouco. 5 × 5 = 25.\nh = 5 m\nLetra C.',
    valores=[('a', '3 m'), ('b', '4 m')],
    pista='canto reto e pede o lado comprido → some os quadrados e ache o número.',
    receita=receita('3 m e 4 m', 'h × h = a × a + b × b', 'a = 3; b = 4', '9 + 16 = 25; h = 5'))),

dict(**M('medio'), id='d2-escada-mat-pla-b06', resp='B', objeto='grama ao redor do canteiro', cobra='área de retângulo menos área de outro', confere=10 * 6 - 4 * 3,
  ancora=PIZZA, canal='mat-21 [11:28:01] área dos polígonos',
  enun='Um jardim retangular de 10 m por 6 m tem, dentro dele, um canteiro retangular de 4 m por 3 m. O resto do jardim é coberto de grama. Qual é a área de grama?',
  alts=['60 m²', '48 m²', '72 m²', '12 m²', '9 m²'],
  ideia='Ache a área do jardim todo, 60, e tire a área do canteiro, 12: sobram 48 m².',
  pecas=[M2],
  conferencia='60-12 = 48. B. A = jardim todo; C = soma; D = só o canteiro; E = lados subtraídos.',
  sua_vez=('Parede de 5 m por 3 m com janela de 2 m por 1 m. Área da parede sem a janela?', ['13 m²', '15 m²', '17 m²', '2 m²'], '13 m²', 'Janela 2 × 1 = 2; 15 − 2 = 13 m².'),
  aula=dict(
    formulas=[('retangulo', 'Área do retângulo', 'área = comprimento × largura'), ('retangulo', 'O que sobra', 'área grande − área pequena')],
    tenho=[('Jardim', '10 m por 6 m'), ('Canteiro', '4 m por 3 m')],
    quer='A questão quer só a parte com grama.',
    equacao='g = j − c (grama = área do jardim − área do canteiro)',
    porque='Por que subtrair? O canteiro ocupa um pedaço do jardim onde não há grama.',
    letras=[('g', 'área de grama (o que a questão quer)'), ('j', 'área do jardim todo'), ('c', 'área do canteiro')],
    telas=[tela('Achando j (jardim)', 'Comprimento × largura.\nj = 10 × 6 = 60'),
           tela('Achando c (canteiro)', 'Comprimento × largura.\nc = 4 × 3 = 12'),
           tela('O seu jeito', 'Parece certo parar em 60, a letra A.\nAí o canteiro também teria grama.')],
    volta='g = 60 − 12 = 48 m²\nLetra B.',
    valores=[('j', '60'), ('c', '12')],
    pista='uma figura dentro da outra → área grande menos a pequena.',
    receita=receita('10 × 6 e 4 × 3', 'g = j − c', 'j = 60; c = 12', '60 − 12 = 48'))),
]
