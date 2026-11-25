"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Grandezas e Medidas
(unidades, área, escala, regra de três direta, inversa) e um que junta.
Âncoras reais (só estudo): ENEM 2022 D2 (planta de cozinha em escala 1:50) e ENEM 2019
D2 (maquete 1:200 com reservatório). Regra de três no jeito do Pablo (antes em cima, agora
embaixo). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_grandezas"""

ARQUIVO = '../escada/matematica-base-grandezas'

PLANTA = 'ENEM 2022 D2 (planta de cozinha na escala 1 : 50)'
MAQUETE = 'ENEM 2019 D2 (maquete 1 : 200 com reservatório)'


def M(nivel='facil'):
  return {'materia': 'Matemática', 'tema': 'Grandezas e Medidas', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**M(), id='d2-escada-mat-gra-b01', resp='C', objeto='fita métrica', cobra='converter metros em centímetros', confere=3 * 100,
  ancora=PLANTA, canal='mat-07 [3:45:30] unidades de comprimento nas escalas',
  enun='Uma fita tem 3 m de comprimento. Qual é esse comprimento em centímetros?',
  alts=['30 cm', '3 000 cm', '300 cm', '0,03 cm', '103 cm'],
  ideia='Cada metro tem 100 centímetros: 3 metros têm 3 × 100 = 300 cm.',
  pecas=[('m', 'Lê-se metro.'), ('cm', 'Lê-se centímetro: 100 deles formam 1 metro.')],
  conferencia='3×100 = 300. C. A = vezes 10; B = vezes 1000; D = dividiu; E = somou.',
  sua_vez=('Quantos centímetros há em 5 m?', ['500 cm', '50 cm', '105 cm', '5 000 cm'], '500 cm', '5 × 100 = 500 cm.'),
  aula=dict(
    formulas=[('retangulo', 'Metro para centímetro', 'centímetros = metros × 100')],
    tenho=[('Comprimento', '3 m'), ('1 metro', '100 cm, para decorar')],
    quer='A questão quer o mesmo comprimento em centímetros.',
    equacao='c = m × k (centímetros = metros × quantos cm há em 1 metro)',
    porque='Por que multiplicar? 1 m são 100 cm, e 2 m são 100 + 100 = 200 cm.',
    letras=[('c', 'comprimento em cm (o que a questão quer)'), ('m', 'comprimento em metros'), ('k', 'centímetros dentro de 1 metro')],
    telas=[tela('Achando m (metros)', 'O enunciado dá direto.\nm = 3'),
           tela('Achando k (cm em 1 metro)', 'É de decorar.\nk = 100')],
    volta='c = 3 × 100 = 300 cm\nLetra C.',
    valores=[('m', '3'), ('k', '100')],
    pista='de metro para centímetro → vezes 100.',
    receita=receita('3 m', 'c = m × k', 'm = 3; k = 100', '3 × 100 = 300'))),

dict(**M(), id='d2-escada-mat-gra-b02', resp='A', objeto='tapete', cobra='área em metros quadrados', confere=4 * 2,
  ancora=PLANTA, canal='mat-21 [área de polígonos] área do retângulo',
  enun='Um tapete retangular mede 4 m de comprimento e 2 m de largura. Qual é a área do tapete?',
  alts=['8 m²', '6 m²', '12 m²', '8 m', '16 m²'],
  ideia='Cabem 4 quadrados de 1 metro numa fileira, e são 2 fileiras: 4 × 2 = 8 m².',
  pecas=[('Área', 'O tamanho de uma superfície, o quanto ela cobre.'), ('m²', 'Lê-se metro quadrado: um quadrado de 1 m por 1 m.')],
  conferencia='4×2 = 8 m². A. B = soma; C = perímetro; D = unidade errada; E = 4×4.',
  sua_vez=('Uma parede de 5 m por 3 m. Área?', ['15 m²', '8 m²', '16 m²', '15 m'], '15 m²', '5 × 3 = 15 m².'),
  aula=dict(
    formulas=[('retangulo', 'Área do retângulo', 'área = comprimento × largura')],
    tenho=[('Comprimento', '4 m'), ('Largura', '2 m')],
    quer='A questão quer quantos quadrados de 1 metro cabem no tapete.',
    equacao='a = c × l (área = comprimento × largura)',
    porque='Por que multiplicar? Num tapete menor, 3 m por 2 m: 2 fileiras de 3 quadrados, 3 × 2 = 6.',
    letras=[('a', 'área, em m² (o que a questão quer)'), ('c', 'comprimento, em metros'), ('l', 'largura, em metros')],
    telas=[tela('Achando c (comprimento)', 'O enunciado dá direto.\nc = 4 m'),
           tela('Achando l (largura)', 'O enunciado dá direto.\nl = 2 m')],
    volta='a = 4 × 2 = 8 m²\nLetra A.',
    valores=[('c', '4 m'), ('l', '2 m')],
    pista='"área do retângulo" → um lado vezes o outro.',
    receita=receita('4 m por 2 m', 'a = c × l', 'c = 4; l = 2', '4 × 2 = 8'))),

dict(**M(), id='d2-escada-mat-gra-b03', resp='E', objeto='planta de um quarto', cobra='escala: do desenho para o real', confere=6 * 50,
  ancora=PLANTA, canal='mat-07 [3:45:30] escala',
  enun='Na planta de uma casa, na escala 1 : 50, uma parede foi desenhada com 6 cm. Qual é o comprimento real da parede, em centímetros?',
  alts=['56 cm', '50 cm', '30 cm', '8 cm', '300 cm'],
  ideia='Cada 1 cm do desenho vale 50 cm de verdade: 6 × 50 = 300 cm.',
  pecas=[('1 : 50', 'Lê-se um para cinquenta: 1 cm no desenho vale 50 cm no real.'), ('Planta', 'O desenho da casa visto de cima.')],
  conferencia='6×50 = 300. E. A = soma; B = a escala; C = erro de zero; D = 50/6.',
  sua_vez=('Escala 1 : 100, desenho de 4 cm. Tamanho real?', ['400 cm', '104 cm', '25 cm', '40 cm'], '400 cm', '4 × 100 = 400 cm.'),
  aula=dict(
    formulas=[('retangulo', 'Escala', 'real = desenho × número da escala')],
    tenho=[('Escala', '1 : 50'), ('No desenho', '6 cm')],
    quer='A questão quer o tamanho da parede de verdade.',
    equacao='r = d × e (real = desenho × escala)',
    porque='Por que multiplicar? 1 cm vale 50 cm, e 2 cm valem 50 + 50 = 100 cm.',
    letras=[('r', 'tamanho real, em cm (o que a questão quer)'), ('d', 'tamanho no desenho, em cm'), ('e', 'número da escala, depois dos dois pontos')],
    telas=[tela('Achando d (desenho)', 'O enunciado dá direto.\nd = 6 cm'),
           tela('Achando e (escala)', 'O número depois dos dois pontos em 1 : 50.\ne = 50')],
    volta='r = 6 × 50 = 300 cm\nLetra E.',
    valores=[('d', '6 cm'), ('e', '50')],
    pista='dá o desenho e a escala → multiplique para achar o real.',
    receita=receita('1 : 50; 6 cm', 'r = d × e', 'd = 6; e = 50', '6 × 50 = 300'))),

dict(**M(), id='d2-escada-mat-gra-b04', resp='B', objeto='pães na padaria', cobra='regra de três direta', confere=12 * 5 / 3,
  ancora=MAQUETE, canal='mat-06 [3:01:31] regra de três simples',
  enun='Na padaria, 3 pães custam R$ 12,00. Mantendo o mesmo preço por pão, quanto custam 5 pães, em reais?',
  alts=['14', '20', '60', '7,20', '17'],
  ideia='Mais pães, mais dinheiro: 1 pão custa 12 ÷ 3 = 4, então 5 pães custam 5 × 4 = 20.',
  pecas=[('Direta', 'Dobrou uma coisa, a outra dobra também.'), ('x', 'O número que ainda não se sabe.')],
  conferencia='3x = 60; x = 20. B. A = 12+2; C = 12×5; D = inversa; E = 12+5.',
  sua_vez=('2 cadernos custam 14. Quanto custam 6?', ['42', '18', '84', '28'], '42', '1 custa 7; 6 × 7 = 42.'),
  aula=dict(
    formulas=[('porcentagem', 'Regra de três direta', 'antes em cima, agora embaixo, e multiplique cruzado')],
    tenho=[('Antes', '3 pães, 12 reais'), ('Agora', '5 pães, x reais')],
    quer='A questão quer o preço dos pães de agora.',
    equacao='x = p × a ÷ b (preço novo = preço antigo × pães de agora ÷ pães de antes)',
    porque='Por que direta? Dobrando os pães, o preço dobra: as duas coisas andam juntas.',
    letras=[('x', 'preço novo (o que a questão quer)'), ('p', 'preço antigo'), ('a', 'pães de agora'), ('b', 'pães de antes')],
    telas=[tela('Achando p (preço antigo)', 'O enunciado dá direto.\np = 12'),
           tela('Achando a (pães de agora)', 'É a linha de baixo.\na = 5'),
           tela('Achando b (pães de antes)', 'É a linha de cima.\nb = 3'),
           tela('Montando as frações', 'Antes em cima, agora embaixo: 3/5 = 12/x\nEm cruz: 3 vezes x é igual a 12 vezes 5')],
    volta='3 × x = 60\nx = 60 ÷ 3 = 20\nLetra B.',
    valores=[('p', '12'), ('a', '5'), ('b', '3')],
    pista='mais de uma coisa dá mais da outra → direta, multiplique cruzado.',
    receita=receita('3 pães, 12; 5 pães', 'x = p × a ÷ b', 'p = 12; a = 5; b = 3', '60 ÷ 3 = 20'))),

dict(**M(), id='d2-escada-mat-gra-b05', resp='D', objeto='pintores num muro', cobra='regra de três inversa', confere=2 * 6 / 3,
  ancora=MAQUETE, canal='mat-05 [2:19:00] grandezas inversamente proporcionais',
  enun='Dois pintores, no mesmo ritmo, pintam um muro em 6 horas. Em quantas horas 3 pintores, nesse ritmo, pintam o mesmo muro?',
  alts=['9', '7', '12', '4', '3'],
  ideia='O muro pede 2 × 6 = 12 horas de trabalho de uma pessoa; dividindo por 3 pintores, dá 4 horas.',
  pecas=[('Inversa', 'Dobrou uma coisa, a outra cai pela metade.'), ('x', 'O número que ainda não se sabe.')],
  conferencia='12/3 = 4. D. A = direta; B = soma 6+1; C = trabalho total; E = metade.',
  sua_vez=('4 pessoas fazem em 3 dias. 6 pessoas fazem em quantos?', ['2', '4,5', '5', '12'], '2', '4 × 3 = 12; 12 ÷ 6 = 2.'),
  aula=dict(
    formulas=[('porcentagem', 'Regra de três inversa', 'o trabalho total não muda')],
    tenho=[('Antes', '2 pintores, 6 horas'), ('Agora', '3 pintores, x horas')],
    quer='A questão quer o tempo com mais gente.',
    equacao='x = a × h ÷ b (horas novas = pintores de antes × horas de antes ÷ pintores de agora)',
    porque='Por que inversa? 2 pintores por 6 horas são 12 horas de uma pessoa sozinha. Mais gente divide essas horas.',
    letras=[('x', 'horas novas (o que a questão quer)'), ('a', 'pintores de antes'), ('h', 'horas de antes'), ('b', 'pintores de agora')],
    telas=[tela('Achando a (pintores de antes)', 'O enunciado dá direto.\na = 2'),
           tela('Achando h (horas de antes)', 'O enunciado dá direto.\nh = 6'),
           tela('Achando b (agora)', 'O enunciado dá direto.\nb = 3'),
           tela('O seu jeito', 'Parece certo montar como nos pães, 2/3 = 6/x, e achar 9 horas, a letra A.\nMais pintores não podem demorar mais.')],
    volta='2 × 6 = 12\nx = 12 ÷ 3 = 4 horas\nLetra D.',
    valores=[('a', '2'), ('h', '6'), ('b', '3')],
    pista='mais gente, menos tempo → inversa: ache o trabalho total e divida.',
    receita=receita('2 e 6 h; 3 pintores', 'x = a × h ÷ b', 'a = 2; h = 6; b = 3', '12 ÷ 3 = 4'))),

dict(**M('medio'), id='d2-escada-mat-gra-b06', resp='C', objeto='piso de uma varanda', cobra='área real a partir de uma planta em escala', confere=(4 * 50 / 100) * (3 * 50 / 100),
  ancora=PLANTA, canal='mat-07 [3:45:30] escala e medidas reais',
  enun='Numa planta na escala 1 : 50, uma varanda retangular mede 4 cm por 3 cm. Qual é a área real da varanda, em metros quadrados?',
  alts=['6 m²', '12 m²', '3 m²', '600 m²', '30 000 m²'],
  ideia='Primeiro cada lado de verdade: 4 × 50 = 200 cm = 2 m e 3 × 50 = 150 cm = 1,5 m. Depois a área: 2 × 1,5 = 3 m².',
  pecas=[('1 : 50', 'Lê-se um para cinquenta: 1 cm no desenho vale 50 cm no real.'), ('m²', 'Lê-se metro quadrado: um quadrado de 1 m por 1 m.')],
  conferencia='2 × 1,5 = 3. C. A = 12×50/100; B = área do desenho; D = 12×50; E = em cm².',
  sua_vez=('Escala 1 : 100, desenho de 3 cm por 2 cm. Área real?', ['6 m²', '600 m²', '5 m²', '60 m²'], '6 m²', 'Lados 3 m e 2 m: 6 m².'),
  aula=dict(
    formulas=[('retangulo', 'Escala', 'real = desenho × 50'), ('retangulo', 'Área', 'área = um lado × o outro')],
    tenho=[('Escala', '1 : 50'), ('Desenho', '4 cm por 3 cm'), ('1 metro', '100 cm')],
    quer='A questão quer a área da varanda de verdade, em m².',
    equacao='a = c × l (área = comprimento real × largura real)',
    porque='Por que não multiplicar a área do desenho só por 50? Os dois lados aumentam, não um só.',
    letras=[('a', 'área real, em m² (o que a questão quer)'), ('c', 'comprimento real, em metros'), ('l', 'largura real, em metros')],
    telas=[tela('Achando c (comprimento real)', '4 × 50 = 200 cm\n200 ÷ 100 = 2\nc = 2 m'),
           tela('Achando l (largura real)', '3 × 50 = 150 cm\n100 cm são 1 m, e 50 cm são meio metro.\nl = 1,5 m'),
           tela('O seu jeito', 'Parece certo fazer 4 × 3 = 12 e marcar a letra B.\nEssa é a área do desenho, não a da varanda.')],
    volta='a = 2 × 1,5\n1,5 + 1,5 = 3 m²\nLetra C.',
    valores=[('c', '2 m'), ('l', '1,5 m')],
    pista='área com escala → passe cada lado para o real antes de multiplicar.',
    receita=receita('1 : 50; 4 e 3 cm', 'a = c × l', 'c = 2; l = 1,5', '2 × 1,5 = 3'))),
]
