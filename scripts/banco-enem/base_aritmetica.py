"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Aritmética
(porcentagem pelo fator, aumento, desconto, dois descontos, razão) e um que junta.
Âncora real (só estudo): ENEM 2022 D2 (geladeira com preço 10% maior e desconto de 2%).
Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_aritmetica"""

ARQUIVO = '../escada/matematica-base-aritmetica'

GELADEIRA = 'ENEM 2022 D2 (preço da geladeira com aumento e desconto)'


def M(nivel='facil'):
  return {'materia': 'Matemática', 'tema': 'Aritmética e Porcentagem', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


PCT = ('%', 'Lê-se por cento: partes de cada 100.')

FICHAS = [
dict(**M(), id='d2-escada-mat-ari-b01', resp='B', objeto='alunos de ônibus', cobra='porcentagem de um número pelo fator', confere=300 * 20 / 100,
  ancora=GELADEIRA, canal='mat-04 [2:08:30] multiplicar pelo fator',
  enun='Numa escola com 300 alunos, 20% vão de ônibus. Quantos alunos vão de ônibus?',
  alts=['20', '60', '280', '15', '600'],
  ideia='20% são 20 de cada 100: em 300 há três grupos de 100, e 3 × 20 = 60.',
  pecas=[PCT, ('0,2', 'Lê-se dois décimos: 2 pedaços de um número cortado em 10. É o mesmo que 20%.')],
  conferencia='0,2×300 = 60. B. A = o número da %; C = 300-20; D = 300/20; E = erro de zero.',
  sua_vez=('Quanto é 10% de 250?', ['25', '10', '240', '2,5'], '25', 'A décima parte: 25.'),
  aula=dict(
    formulas=[('porcentagem', 'Porcentagem', 'parte = total × fator')],
    tenho=[('Total', '300'), ('Porcentagem', '20%')],
    quer='A questão quer quantos alunos formam os 20%.',
    equacao='p = t × f (parte = total × fator)',
    porque='Por que o fator é 0,2? 20% são 20 de cada 100, e 20 ÷ 100 se escreve 0,2.',
    letras=[('p', 'parte que vai de ônibus (o que a questão quer)'), ('t', 'total de alunos'), ('f', 'fator da porcentagem')],
    telas=[tela('Achando t (total)', 'O enunciado dá direto.\nt = 300'),
           tela('Achando f (fator)', '20% = 20 ÷ 100\nf = 0,2')],
    volta='p = 300 × 0,2\n0,2 são 2 décimos.\nUm décimo de 300: 300 ÷ 10 = 30\nDois décimos: 30 + 30 = 60\nLetra B.',
    valores=[('t', '300'), ('f', '0,2')],
    pista='"tantos por cento de" → total × fator.',
    receita=receita('300; 20%', 'p = t × f', 'f = 0,2', '300 × 0,2 = 60'))),

dict(**M(), id='d2-escada-mat-ari-b02', resp='D', objeto='mensalidade', cobra='aumento percentual pelo fator', confere=200 * 1.1,
  ancora=GELADEIRA, canal='mat-04 [2:09:00] fator de aumento',
  enun='Uma mensalidade de R$ 200,00 teve um aumento de 10%. Qual é o novo valor, em reais?',
  alts=['210', '20', '180', '220', '400'],
  ideia='O novo valor é o antigo inteiro mais 10% dele: 200 + 20 = 220.',
  pecas=[PCT, ('1,1', 'Lê-se um inteiro e um décimo: o valor todo mais 10%.')],
  conferencia='200×1,1 = 220. D. A = somou 10; B = só o aumento; C = desconto; E = dobro.',
  sua_vez=('R$ 50 com aumento de 20%. Novo valor?', ['60', '70', '10', '40'], '60', '20% de 50 são 10; 50 + 10 = 60.'),
  aula=dict(
    formulas=[('porcentagem', 'Aumento', 'novo = antigo × (1 + parte que aumenta)')],
    tenho=[('Antigo', '200'), ('Aumento', '10%')],
    quer='A questão quer o preço depois do aumento.',
    equacao='n = a × f (novo = antigo × fator)',
    porque='Por que o fator é 1,1? O 1 guarda o valor inteiro, e o 0,1 são os 10% a mais.',
    letras=[('n', 'novo valor (o que a questão quer)'), ('a', 'valor antigo'), ('f', 'fator do aumento')],
    telas=[tela('Achando a (antigo)', 'O enunciado dá direto.\na = 200'),
           tela('Achando f (fator)', '1 inteiro mais um décimo.\nf = 1 + 0,1 = 1,1')],
    volta='n = 200 × 1,1\n200 × 1 = 200\nUm décimo de 200: 200 ÷ 10 = 20\nn = 200 + 20 = 220\nLetra D.',
    valores=[('a', '200'), ('f', '1,1')],
    pista='"aumento de" → vezes 1 mais a porcentagem.',
    receita=receita('200; +10%', 'n = a × f', 'f = 1,1', '200 × 1,1 = 220'))),

dict(**M(), id='d2-escada-mat-ari-b03', resp='A', objeto='mochila em promoção', cobra='desconto percentual pelo fator', confere=80 * 0.75,
  ancora=GELADEIRA, canal='mat-04 [2:06:00] aumentos e descontos',
  enun='Uma mochila de R$ 80,00 está com 25% de desconto. Qual é o preço com desconto, em reais?',
  alts=['60', '55', '20', '100', '65'],
  ideia='25% é a quarta parte: sai 20 dos 80 e ficam 60.',
  pecas=[PCT, ('Desconto', 'O que se tira do preço.')],
  conferencia='80×0,75 = 60. A. B = 80-25; C = só o desconto; D = aumento; E = errou a parte.',
  sua_vez=('R$ 40 com 50% de desconto. Preço?', ['20', '35', '60', '10'], '20', 'Metade: 20.'),
  aula=dict(
    formulas=[('porcentagem', 'Desconto', 'novo = preço − parte descontada')],
    tenho=[('Preço', '80'), ('Desconto', '25%'), ('25%', '1 de 4 partes iguais')],
    quer='A questão quer quanto se paga depois do desconto.',
    equacao='n = a − d (novo = antigo − desconto)',
    porque='Por que cortar em 4? 25 cabe 4 vezes em 100, então 25% é 1 de 4 partes iguais.',
    letras=[('n', 'preço novo (o que a questão quer)'), ('a', 'preço antigo'), ('d', 'desconto em reais')],
    telas=[tela('Achando a (antigo)', 'O enunciado dá direto.\na = 80'),
           tela('Achando d (desconto)', 'A quarta parte de 80.\nd = 80 ÷ 4 = 20'),
           tela('O seu jeito', 'Parece certo fazer 80 − 25 = 55, a letra B.\n25% não são 25 reais.')],
    volta='n = 80 − 20 = 60\nLetra A.',
    valores=[('a', '80'), ('d', '20')],
    pista='"de desconto" → ache a parte e tire do preço.',
    receita=receita('80; 25%', 'n = a − d', 'd = 20', '80 − 20 = 60'))),

dict(**M(), id='d2-escada-mat-ari-b04', resp='E', objeto='dois descontos seguidos', cobra='dois descontos um depois do outro', confere=100 * 0.9 * 0.9,
  ancora=GELADEIRA, canal='mat-04 [2:11:32] porcentagens seguidas',
  enun='Um produto de R$ 100,00 recebe um desconto de 10% e, depois, outro desconto de 10% sobre o novo preço. Qual é o preço final, em reais?',
  alts=['80', '90', '19', '99', '81'],
  ideia='O segundo desconto é calculado sobre 90, não sobre 100: 90 − 9 = 81.',
  pecas=[PCT, ('Desconto', 'O que se tira do preço.')],
  conferencia='100-10 = 90; 90-9 = 81. E. A = somou 20%; B = um só; C = total descontado; D = chute.',
  sua_vez=('R$ 200 com 50% e depois mais 50%. Preço?', ['50', '0', '100', '150'], '50', '200, 100, 50.'),
  aula=dict(
    formulas=[('porcentagem', 'Um de cada vez', 'o 2º desconto vale sobre o preço já baixado')],
    tenho=[('Preço', '100'), ('1º desconto', '10%'), ('2º desconto', '10%')],
    quer='A questão quer o preço depois dos dois descontos.',
    equacao='n = a − d (novo = preço depois do 1º − 2º desconto)',
    porque='Por que não tirar 20 de uma vez? Quando vem o 2º desconto, o preço já é menor.',
    letras=[('n', 'preço final (o que a questão quer)'), ('a', 'preço depois do 1º desconto'), ('d', '2º desconto em reais')],
    telas=[tela('Achando a (depois do 1º)', '10% de 100 são 10.\na = 100 − 10 = 90'),
           tela('Achando d (2º desconto)', '10% de 90 é a décima parte.\nd = 90 ÷ 10 = 9'),
           tela('O seu jeito', 'Parece certo tirar 20 e achar 80, a letra A.\nO 2º desconto é de 9, não de 10.')],
    volta='n = 90 − 9 = 81\nLetra E.',
    valores=[('a', '90'), ('d', '9')],
    pista='descontos seguidos → um de cada vez, sobre o preço novo.',
    receita=receita('100; 10% e 10%', 'n = a − d', 'a = 90; d = 9', '90 − 9 = 81'))),

dict(**M(), id='d2-escada-mat-ari-b05', resp='C', objeto='suco concentrado', cobra='razão entre duas quantidades', confere=3 * 4,
  ancora=GELADEIRA, canal='mat-05 [2:19:00] grandezas proporcionais',
  enun='Uma receita de suco pede 1 copo de concentrado para cada 4 copos de água. Com 3 copos de concentrado, quantos copos de água são necessários?',
  alts=['7', '4', '12', '15', '1'],
  ideia='Cada copo de concentrado pede 4 de água: 3 copos pedem 12.',
  pecas=[('1 para 4', 'A cada 1 de um, vão 4 do outro. Chama-se razão.')],
  conferencia='3×4 = 12. C. A = soma; B = não mudou; D = total com concentrado; E = 4-3.',
  sua_vez=('1 de tinta para 2 de água. Com 5 de tinta, quanta água?', ['10', '7', '15', '2,5'], '10', '5 × 2 = 10.'),
  aula=dict(
    formulas=[('porcentagem', 'Razão', 'água = concentrado × quantos de água por copo')],
    tenho=[('Razão', '1 para 4'), ('Concentrado', '3 copos')],
    quer='A questão quer os copos de água.',
    equacao='a = c × r (água = concentrado × razão)',
    porque='Por que multiplicar? 2 copos de concentrado pedem 4 + 4 = 8 de água.',
    letras=[('a', 'copos de água (o que a questão quer)'), ('c', 'copos de concentrado'), ('r', 'copos de água para cada 1 de concentrado')],
    telas=[tela('Achando c (concentrado)', 'O enunciado dá direto.\nc = 3'),
           tela('Achando r (razão)', 'Para cada 1 copo vão 4.\nr = 4')],
    volta='a = 3 × 4 = 12\nLetra C.',
    valores=[('c', '3'), ('r', '4')],
    pista='"para cada" → multiplique pela razão.',
    receita=receita('1 para 4; 3 copos', 'a = c × r', 'c = 3; r = 4', '3 × 4 = 12'))),

dict(**M('medio'), id='d2-escada-mat-ari-b06', resp='B', objeto='televisão na loja', cobra='aumento seguido de desconto', confere=1000 * 1.2 * 0.9,
  ancora=GELADEIRA, canal='mat-04 [2:11:32] aumento e depois desconto',
  enun='Uma televisão custava R$ 1 000,00. A loja aumentou o preço em 20% e, depois, deu um desconto de 10% sobre o novo preço. Qual é o preço final, em reais?',
  alts=['1 100', '1 080', '1 200', '900', '980'],
  ideia='Primeiro o aumento: 1 000 + 200 = 1 200. Depois o desconto de 10% sobre 1 200: sai 120 e ficam 1 080.',
  pecas=[PCT, ('Desconto', 'O que se tira do preço.')],
  conferencia='1200-120 = 1080. B. A = somou 20-10; C = só o aumento; D = só o desconto; E = chute.',
  sua_vez=('R$ 100 com aumento de 50% e depois desconto de 50%. Preço?', ['75', '100', '150', '50'], '75', '150; metade: 75.'),
  aula=dict(
    formulas=[('porcentagem', 'Aumento', 'preço + parte aumentada'), ('porcentagem', 'Desconto', 'preço novo − parte descontada')],
    tenho=[('Preço', '1 000'), ('Aumento', '20%'), ('Desconto', '10%')],
    quer='A questão quer o preço depois das duas mudanças.',
    equacao='n = a − d (novo = preço já aumentado − desconto)',
    porque='Por que não fazer 20 − 10? Os 10% são tirados de um preço maior que o do começo.',
    letras=[('n', 'preço final (o que a questão quer)'), ('a', 'preço depois do aumento'), ('d', 'desconto em reais')],
    telas=[tela('Achando a (com aumento)', '10% de 1000: 1000 ÷ 10 = 100\n20% é o dobro de 10%: o dobro de 100 é 200\na = 1000 + 200 = 1200'),
           tela('Achando d (desconto)', '10% de 1200 é a décima parte.\nd = 1200 ÷ 10 = 120'),
           tela('O seu jeito', 'Parece certo somar 10% no total, 1100, a letra A.\nO desconto é de 120, não de 100.')],
    volta='n = 1200 − 120 = 1080\nLetra B.',
    valores=[('a', '1200'), ('d', '120')],
    pista='aumento e desconto seguidos → um de cada vez.',
    receita=receita('1000; +20% e −10%', 'n = a − d', 'a = 1200; d = 120', '1200 − 120 = 1080'))),
]
