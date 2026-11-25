"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Equações e
Sistemas (1º grau, montar do texto, substituição, somar as equações) e um que junta.
Âncora real (só estudo): ENEM 2023 D2, questão 175 (tíquetes azuis e vermelhos do
metrô). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_equacoes"""

ARQUIVO = '../escada/matematica-base-equacoes'

TIQUETES = 'ENEM 2023 D2, questão 175 (tíquetes do metrô)'


def M(nivel='facil'):
  return {'materia': 'Matemática', 'tema': 'Equações e Sistemas', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**M(), id='d2-escada-mat-equ-06', resp='C', objeto='cadernos iguais', cobra='resolver uma equação do 1º grau', confere=(26 - 5) / 3,
  ancora=TIQUETES, canal='mat-11 [5:07:30] isolar uma letra numa equação',
  enun='Na equação 3 × p + 5 = 26, a letra p é o preço de um caderno, em reais. Qual é o valor de p?',
  alts=['31', '21', '7', '10', '63'],
  ideia='Tire os 5 dos dois lados e fica 3 × p = 21. Depois divida por 3: p = 7.',
  pecas=[('Equação', 'Uma igualdade com uma letra escondendo um número.')],
  conferencia='3p = 21; p = 7. C. A = 26+5; B = parou em 21; D = 31/3 arredondado; E = 21×3.',
  sua_vez=('2 × x + 4 = 18. Quanto vale x?', ['7', '11', '14', '22'], '7', '2 × x = 14; x = 7.'),
  aula=dict(
    formulas=[('grafico', 'Isolar a letra', 'desfaça a soma, depois a multiplicação')],
    tenho=[('Multiplica p', '3'), ('Somado', '5'), ('Resultado', '26')],
    quer='A questão quer o número escondido na letra p.',
    equacao='p = (r − s) ÷ m (preço = (resultado − somado) ÷ multiplicador)',
    porque='Por que tirar primeiro o somado? Em 2 × p + 1 = 7, sem o 1 sobra 2 × p = 6. Metade: p = 6 ÷ 2 = 3.',
    letras=[('p', 'preço de um caderno (o que a questão quer)'), ('r', 'resultado, o lado direito'), ('s', 'número somado'), ('m', 'número que multiplica p')],
    telas=[tela('Achando r (resultado)', 'Está na equação.\nr = 26'),
           tela('Achando s (somado)', 'Está na equação.\ns = 5'),
           tela('Achando m (multiplica)', 'Está na equação.\nm = 3')],
    volta='26 − 5 = 21\np = 21 ÷ 3 = 7\nLetra C.',
    valores=[('r', '26'), ('s', '5'), ('m', '3')],
    pista='letra sozinha de um lado → desfaça a soma e depois a multiplicação.',
    receita=receita('3 × p + 5 = 26', 'p = (r − s) ÷ m', 'r = 26; s = 5; m = 3', '21 ÷ 3 = 7'))),

dict(**M(), id='d2-escada-mat-equ-07', resp='A', objeto='corrida de aplicativo', cobra='montar a equação a partir do texto', confere=(29 - 5) / 3,
  ancora=TIQUETES, canal='mat-10 [4:44:33] escrever a equação que descreve uma situação',
  enun='Um aplicativo cobra R$ 5,00 fixos mais R$ 3,00 por quilômetro. Uma corrida custou R$ 29,00. Quantos quilômetros ela teve?',
  alts=['8', '24', '9', '11', '3'],
  ideia='O texto vira 5 + 3 × k = 29. Tirando os 5 sobram 24, e 24 ÷ 3 = 8 km.',
  pecas=[('Valor fixo', 'O que se paga sempre, mesmo sem andar.')],
  conferencia='(29-5)/3 = 8. A. B = parou em 24; C = 29/3 arredondado; D = (29+4)/3; E = o preço do km.',
  sua_vez=('Taxa de 4 reais mais 2 por km; total 20. Quilômetros?', ['8', '10', '16', '12'], '8', '20 − 4 = 16; 16 ÷ 2 = 8.'),
  aula=dict(
    formulas=[('grafico', 'Montar a conta', 'total = fixo + preço do km × quilômetros')],
    tenho=[('Fixo', '5'), ('Por quilômetro', '3'), ('Total', '29')],
    quer='A questão quer quantos quilômetros foram rodados.',
    equacao='k = (t − f) ÷ q (quilômetros = (total − fixo) ÷ preço de cada quilômetro)',
    porque='Por que tirar o fixo? Os 5 reais não pagam distância. Numa corrida de 2 km: 5 + 3 × 2 = 11.',
    letras=[('k', 'quilômetros (o que a questão quer)'), ('t', 'total pago'), ('f', 'valor fixo'), ('q', 'preço de cada quilômetro')],
    telas=[tela('Achando t (total)', 'O enunciado dá direto.\nt = 29'),
           tela('Achando f (fixo)', 'O enunciado dá direto.\nf = 5'),
           tela('Achando q (cada quilômetro)', 'O enunciado dá direto.\nq = 3')],
    volta='29 − 5 = 24\nk = 24 ÷ 3 = 8\nLetra A.',
    valores=[('t', '29'), ('f', '5'), ('q', '3')],
    pista='"fixo mais tanto por" → total menos fixo, dividido pelo preço de cada um.',
    receita=receita('5 fixos, 3 por km, 29', 'k = (t − f) ÷ q', 't = 29; f = 5; q = 3', '24 ÷ 3 = 8'))),

dict(**M(), id='d2-escada-mat-equ-08', resp='E', objeto='caneta e estojo', cobra='sistema por substituição', confere=24 / (3 + 1),
  ancora=TIQUETES, canal='mat-11 [5:07:30] substituição: trocar uma letra pelo que ela vale',
  enun='Um estojo custa o mesmo que 3 canetas. Um estojo e uma caneta, juntos, custam R$ 24,00. Quanto custa uma caneta, em reais?',
  alts=['8', '18', '12', '21', '6'],
  ideia='Troque o estojo por 3 canetas: ficam 4 canetas por 24, e cada uma custa 6.',
  pecas=[('Trocar', 'Pôr no lugar de uma coisa outra que vale o mesmo.')],
  conferencia='4c = 24; c = 6. E. A = 24/3; B = o estojo; C = 24/2; D = 24-3.',
  sua_vez=('Um bolo vale 2 sucos. Bolo + suco = 15. Preço do suco?', ['5', '10', '7,50', '13'], '5', '3 sucos = 15; 15 ÷ 3 = 5.'),
  aula=dict(
    formulas=[('grafico', 'Substituição', 'troque o estojo por 3 canetas')],
    tenho=[('Estojo', '3 canetas'), ('Estojo + caneta', '24')],
    quer='A questão quer o preço de uma caneta sozinha.',
    equacao='c = t ÷ n (preço da caneta = total ÷ número de canetas depois da troca)',
    porque='Por que trocar? Com duas coisas diferentes não dá para dividir; só com canetas dá.',
    letras=[('c', 'preço de uma caneta (o que a questão quer)'), ('t', 'total pago'), ('n', 'número de canetas depois da troca')],
    telas=[tela('Achando t (total)', 'O enunciado dá direto.\nt = 24'),
           tela('Achando n (canetas)', 'O estojo vira 3 canetas, mais a 1 caneta.\nn = 3 + 1 = 4'),
           tela('O seu jeito', 'Parece certo fazer 24 ÷ 3 = 8, a letra A.\nFaltou contar a caneta que já estava junto: são 4.')],
    volta='c = 24 ÷ 4 = 6\nLetra E.',
    valores=[('t', '24'), ('n', '4')],
    pista='"custa o mesmo que" → troque e fique com um tipo só.',
    receita=receita('estojo = 3 canetas; 24', 'c = t ÷ n', 'n = 4', '24 ÷ 4 = 6'))),

dict(**M(), id='d2-escada-mat-equ-09', resp='B', objeto='duas idades somadas e subtraídas', cobra='sistema somando as equações', confere=(30 + 6) / 2,
  ancora=TIQUETES, canal='mat-11 [5:11:30] somar as equações para sumir uma letra',
  enun='A soma das idades de duas irmãs é 30 anos, e a diferença entre elas é 6 anos. Qual é a idade da mais velha?',
  alts=['36', '18', '12', '24', '15'],
  ideia='Somando as duas informações, a idade da mais nova some: 2 vezes a mais velha é 36, então ela tem 18.',
  pecas=[('Diferença', 'O resultado de uma subtração.')],
  conferencia='(30+6)/2 = 18. B. A = parou em 36; C = a mais nova; D = 30-6; E = 30/2.',
  sua_vez=('Soma 20, diferença 4. Qual é o maior?', ['12', '8', '24', '16'], '12', '20 + 4 = 24; 24 ÷ 2 = 12.'),
  aula=dict(
    formulas=[('grafico', 'Somar as duas contas', 'maior = (soma + diferença) ÷ 2')],
    tenho=[('Soma', '30'), ('Diferença', '6')],
    quer='A questão quer a idade da irmã mais velha.',
    equacao='v = (s + d) ÷ 2 (mais velha = (soma + diferença) ÷ 2)',
    porque='Por que somar? Com 10 e 4: soma 14, diferença 6. Juntando, 14 + 6 = 20, que é 2 vezes o maior.',
    letras=[('v', 'idade da mais velha (o que a questão quer)'), ('s', 'soma das idades'), ('d', 'diferença das idades')],
    telas=[tela('Achando s (soma)', 'O enunciado dá direto.\ns = 30'),
           tela('Achando d (diferença)', 'O enunciado dá direto.\nd = 6')],
    volta='30 + 6 = 36\nv = 36 ÷ 2 = 18\nLetra B.',
    valores=[('s', '30'), ('d', '6')],
    pista='dá a soma e a diferença → some as duas e divida por 2 para achar o maior.',
    receita=receita('soma 30, diferença 6', 'v = (s + d) ÷ 2', 's = 30; d = 6', '36 ÷ 2 = 18'))),

dict(**M('medio'), id='d2-escada-mat-equ-10', resp='D', objeto='ingressos de cinema', cobra='montar o sistema do texto e resolver por troca', confere=(60 - 5) / (4 + 1),
  ancora=TIQUETES, canal='mat-11 [5:07:30] montar duas equações e substituir',
  enun='Num cinema, o ingresso inteiro custa R$ 5,00 a mais que o ingresso de criança. Uma família pagou R$ 60,00 por 1 inteiro e 4 ingressos de criança. Quanto custa o ingresso de criança, em reais?',
  alts=['12', '16', '13', '11', '15'],
  ideia='Troque o inteiro por "criança + 5": ficam 5 ingressos de criança mais 5 reais, igual a 60. Então cada um custa 11.',
  pecas=[('Ingresso inteiro', 'O ingresso de preço cheio.')],
  conferencia='5c + 5 = 60; c = 11. D. A = 60/5; B = o inteiro; C = (60+5)/5; E = 60/4.',
  sua_vez=('Um adulto paga 2 a mais que uma criança. 1 adulto e 2 crianças: 23. Preço da criança?', ['7', '9', '8', '11'], '7', '3 crianças + 2 = 23; 21 ÷ 3 = 7.'),
  aula=dict(
    formulas=[('grafico', 'Substituição', 'inteiro = criança + 5')],
    tenho=[('Inteiro', 'criança + 5'), ('Compra', '1 inteiro e 4 de criança'), ('Total', '60')],
    quer='A questão quer o preço de um ingresso de criança.',
    equacao='c = (t − a) ÷ n (criança = (total − acréscimo) ÷ número de ingressos)',
    porque='Por que tirar o acréscimo? Sem os 5 a mais, os 5 ingressos ficam todos com o mesmo preço.',
    letras=[('c', 'preço de criança (o que a questão quer)'), ('t', 'total pago'), ('a', 'acréscimo do inteiro'), ('n', 'número de ingressos')],
    telas=[tela('Achando t (total)', 'O enunciado dá direto.\nt = 60'),
           tela('Achando a (acréscimo)', 'O enunciado dá direto.\na = 5'),
           tela('Achando n (ingressos)', 'O inteiro vira 1 de criança mais 5 reais.\nn = 1 + 4 = 5'),
           tela('O seu jeito', 'Parece certo fazer 60 ÷ 5 = 12, a letra A.\nOs 5 reais a mais ainda estão dentro dos 60.')],
    volta='60 − 5 = 55\nc = 55 ÷ 5 = 11\nLetra D.',
    valores=[('t', '60'), ('a', '5'), ('n', '5')],
    pista='"custa tanto a mais que" → troque, tire o acréscimo e divida.',
    receita=receita('+5; 1 e 4; 60', 'c = (t − a) ÷ n', 'n = 5', '55 ÷ 5 = 11'))),
]
