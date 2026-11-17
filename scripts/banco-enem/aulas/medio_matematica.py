"""Aulas do jeito do robô para as 20 questões de data/revisao-final/dia-2/medio-matematica.json
(17/11/2026). Formato igual a exemplo_matematica.py."""

ARQUIVO = 'data/revisao-final/dia-2/medio-matematica.json'

PORC = ('porcentagem', 'Porcentagem', 'parte = % ÷ 100 × todo')

AULAS = {
  'd2-medio-mat-01': dict(
    confere=(120 + 10 / 100 * 120) / 4,
    formulas=[PORC],
    tenho=[('Conta', 'R$ 120'), ('Taxa de serviço', '10%'), ('Pessoas', '4')],
    quer='A questão quer quanto cada amigo paga.',
    equacao='P = T ÷ 4 (cada um paga o total dividido por 4)',
    porque='Por que dividir? Dividir uma conta é repartir em partes iguais. Uma pizza de 8 fatias para 4 pessoas: 8 ÷ 4 = 2 fatias cada. Mas o total já tem que trazer a taxa.',
    letras=[('P', 'o que cada um paga (o que a questão quer)'), ('TX', 'taxa de serviço'), ('T', 'total com a taxa')],
    telas=[
      dict(titulo='Achando TX (taxa de serviço)', texto='A taxa é 10% da conta.\nTX = 10 ÷ 100 × 120 = 12 reais'),
      dict(titulo='Achando T: o seu jeito', texto='Parece certo fazer 120 ÷ 4 = 30. Mas aí a taxa ficou de fora.\nO restaurante soma a taxa na conta ANTES de dividir.\nT = 120 + 12 = 132 reais'),
    ],
    volta='P = 132 ÷ 4 = 33\nLetra C. Cada amigo paga R$ 33,00.',
    valores=[('TX', '12'), ('T', '132')],
    pista='conta com taxa dividida por pessoas → ache a taxa, some, e só depois divida.',
    receita=[('1. Tabela do que eu tenho', '120, taxa 10%, 4 pessoas'), ('2. Equação em letras', 'P = T ÷ 4'), ('3. Achar cada letra', 'TX = 12; T = 132'), ('4. Substituir', '132 ÷ 4 = 33')]),

  'd2-medio-mat-02': dict(
    confere=(1500 - 30 / 100 * 1500) - 10 / 100 * (1500 - 30 / 100 * 1500),
    formulas=[PORC],
    tenho=[('Preço do celular', 'R$ 1 500'), ('1º desconto', '30%'), ('2º desconto (Pix)', '10% sobre o preço já reduzido')],
    quer='A questão quer o preço de quem paga no Pix.',
    equacao='P = PP − DP (preço no Pix = preço da promoção − desconto do Pix)',
    porque='Por que tirar um de cada vez? O 2º desconto é sobre o preço novo, não sobre o antigo. Se uma camiseta de 100 cai para 80, os 10% seguintes são 10% de 80, não de 100.',
    letras=[('P', 'preço no Pix (o que a questão quer)'), ('PP', 'preço da promoção'), ('DP', 'desconto do Pix')],
    telas=[
      dict(titulo='Achando PP (preço da promoção)', texto='O desconto de 30% é 30 ÷ 100 × 1 500 = 450.\nPP = 1 500 − 450 = 1 050 reais'),
      dict(titulo='Achando DP: o seu jeito', texto='Parece certo somar 30% + 10% = 40% e tirar de 1 500. Mas o 10% do Pix não é sobre 1 500.\nEle é sobre o preço já reduzido: 1 050.\nDP = 10 ÷ 100 × 1 050 = 105 reais'),
    ],
    volta='P = 1 050 − 105 = 945\nLetra A. Quem paga no Pix leva por R$ 945,00.',
    valores=[('PP', '1 050'), ('DP', '105')],
    pista='dois descontos seguidos → um de cada vez, o 2º em cima do preço novo; nunca some as porcentagens.',
    receita=[('1. Tabela do que eu tenho', '1 500, 30% e depois 10%'), ('2. Equação em letras', 'P = PP − DP'), ('3. Achar cada letra', 'PP = 1 050; DP = 105'), ('4. Substituir', '1 050 − 105 = 945')]),

  'd2-medio-mat-03': dict(
    confere=5 / 1.25,
    formulas=[PORC],
    tenho=[('Aumento', '25%'), ('Preço depois do aumento', 'R$ 5,00')],
    quer='A questão quer o preço ANTES do aumento.',
    equacao='A × F = 5 (preço antigo × fator do aumento = preço novo)',
    porque='Por que dividir? Se 4 × 3 = 12, para voltar de 12 a 4 você divide: 12 ÷ 3 = 4. Aqui o aumento multiplicou o preço antigo por F, então para voltar divide por F.',
    letras=[('A', 'preço antes do aumento (o que a questão quer)'), ('F', 'fator do aumento')],
    telas=[
      dict(titulo='Achando F: o seu jeito', texto='Parece certo tirar 25% de 5 (dá 1,25) e fazer 5 − 1,25 = 3,75. Mas os 25% foram sobre o preço ANTIGO, não sobre 5.\nAumento de 25% = o preço antigo mais 25 ÷ 100 dele.\nF = 1 + 0,25 = 1,25'),
    ],
    volta='A = 5 ÷ 1,25 = 4\nLetra E. Antes do aumento a passagem custava R$ 4,00.\nConferindo: 4 × 1,25 = 5.',
    valores=[('F', '1,25')],
    pista='"depois de um aumento (ou desconto) ficou X" → o preço antigo é X ÷ fator, nunca X menos a porcentagem.',
    receita=[('1. Tabela do que eu tenho', 'aumento 25%, preço novo 5'), ('2. Equação em letras', 'A × F = 5'), ('3. Achar cada letra', 'F = 1,25'), ('4. Substituir', 'A = 5 ÷ 1,25 = 4')]),

  'd2-medio-mat-04': dict(
    confere=20 / 100 * (55 / 100 * 800),
    formulas=[PORC],
    tenho=[('Alunos', '800'), ('Meninos', '45%'), ('Meninas com óculos', '20% das meninas')],
    quer='A questão quer quantas meninas usam óculos.',
    equacao='O = 20 ÷ 100 × ME (meninas com óculos = 20% das meninas)',
    porque='Por que 20% das meninas e não da escola? Em "20% das meninas" o todo é o grupo das meninas. Se 10 pessoas de um grupo de 50 gostam de pizza, o todo é o grupo de 50.',
    letras=[('O', 'meninas com óculos (o que a questão quer)'), ('PM', 'porcentagem de meninas'), ('ME', 'número de meninas')],
    telas=[
      dict(titulo='Achando PM (porcentagem de meninas)', texto='Todo mundo é 100%. Meninos são 45%.\nPM = 100 − 45 = 55%'),
      dict(titulo='Achando ME: o seu jeito', texto='Parece certo fazer 20% de 800 = 160. Mas os 20% só valem para as meninas, não para a escola toda.\nPrimeiro conte as meninas: 55% de 800.\nME = 55 ÷ 100 × 800 = 440'),
    ],
    volta='O = 20 ÷ 100 × 440 = 88\nLetra B. São 88 meninas de óculos.',
    valores=[('PM', '55'), ('ME', '440')],
    pista='porcentagem "dentro de um grupo" → primeiro ache o grupo, depois a porcentagem dele.',
    receita=[('1. Tabela do que eu tenho', '800, meninos 45%, óculos 20%'), ('2. Equação em letras', 'O = 20 ÷ 100 × ME'), ('3. Achar cada letra', 'PM = 55; ME = 440'), ('4. Substituir', '0,20 × 440 = 88')]),

  'd2-medio-mat-05': dict(
    confere=2000 + 60 * 5,
    formulas=[PORC],
    tenho=[('Empréstimo', 'R$ 2 000'), ('Juros simples', '3% ao mês'), ('Prazo', '5 meses')],
    quer='A questão quer o total que Ana vai pagar.',
    equacao='T = 2 000 + JT (total = empréstimo + juros dos 5 meses)',
    porque='Por que multiplicar por 5? Juros simples rendem o MESMO valor todo mês. Se você paga R$ 60 de juros por mês, em 5 meses são 5 × 60.',
    letras=[('T', 'total a pagar (o que a questão quer)'), ('J', 'juros de 1 mês'), ('JT', 'juros dos 5 meses')],
    telas=[
      dict(titulo='Achando J: o seu jeito', texto='Parece certo fazer 3 × 5 = 15 e somar 15 reais. Mas o 3 é 3 POR CENTO, não 3 reais.\nOs juros de 1 mês são 3% de 2 000.\nJ = 3 ÷ 100 × 2 000 = 60 reais'),
      dict(titulo='Achando JT (juros dos 5 meses)', texto='Todo mês rende 60.\nJT = 60 × 5 = 300 reais'),
    ],
    volta='T = 2 000 + 300 = 2 300\nLetra D. Ana paga R$ 2 300,00 no total.',
    valores=[('J', '60'), ('JT', '300')],
    pista='juros simples → juros de 1 mês × número de meses, e depois soma o valor emprestado.',
    receita=[('1. Tabela do que eu tenho', '2 000, 3% ao mês, 5 meses'), ('2. Equação em letras', 'T = 2 000 + JT'), ('3. Achar cada letra', 'J = 60; JT = 300'), ('4. Substituir', '2 000 + 300 = 2 300')]),

  'd2-medio-mat-06': dict(
    confere=60 * 40 / 48,
    formulas=[('grafico', 'Caminho', 'caminho = velocidade × tempo')],
    tenho=[('Velocidade normal', '60 km/h'), ('Tempo normal', '40 minutos'), ('Velocidade no trânsito', '48 km/h')],
    quer='A questão quer o tempo no dia de trânsito.',
    equacao='48 × T = K (velocidade nova × tempo = a conta que não muda)',
    porque='Por que a conta não muda? O caminho é o mesmo. Velocidade × tempo dá sempre o mesmo caminho. Se você anda mais devagar, precisa de MAIS tempo para o mesmo caminho.',
    letras=[('T', 'tempo no trânsito (o que a questão quer)'), ('K', 'velocidade × tempo, igual nos dois dias')],
    telas=[
      dict(titulo='Achando K (a conta que não muda)', texto='No dia normal: velocidade × tempo.\nK = 60 × 40 = 2 400'),
      dict(titulo='Achando T: o seu jeito', texto='Parece certo fazer 40 × 48 ÷ 60 = 32. Mas isso dá MENOS tempo, e devagar leva MAIS tempo.\nO certo é dividir K pela velocidade nova.\n48 × T = 2 400, então T = 2 400 ÷ 48 = 50'),
    ],
    volta='T = 2 400 ÷ 48 = 50\nLetra A. Rita levou 50 minutos.',
    valores=[('K', '2 400'), ('T', '50')],
    pista='velocidade muda, caminho igual → mais devagar, mais tempo; use velocidade × tempo = K.',
    receita=[('1. Tabela do que eu tenho', '60 km/h, 40 min, 48 km/h'), ('2. Equação em letras', '48 × T = K'), ('3. Achar cada letra', 'K = 60 × 40 = 2 400'), ('4. Substituir', 'T = 2 400 ÷ 48 = 50')]),

  'd2-medio-mat-07': dict(
    confere=6 * 50000 / 100 / 1000,
    formulas=[('grafico', 'Escala 1 : 50 000', '1 cm no mapa = 50 000 cm na rua')],
    tenho=[('Escala', '1 : 50 000'), ('Distância no mapa', '6 cm')],
    quer='A questão quer a distância real, em quilômetros.',
    equacao='D = M ÷ 1 000 (km = metros ÷ 1 000)',
    porque='Por que multiplicar por 50 000? Escala 1 : 50 000 diz que 1 cm no mapa vale 50 000 cm na rua. Seis vezes mais no mapa, seis vezes mais na rua.',
    letras=[('D', 'distância real em km (o que a questão quer)'), ('CM', 'distância real em cm'), ('M', 'distância real em metros')],
    telas=[
      dict(titulo='Achando CM: o seu jeito', texto='Parece certo achar que 1 cm vale 1 km e responder 6. Mas a escala diz 1 cm = 50 000 cm.\nCM = 6 × 50 000 = 300 000 cm'),
      dict(titulo='Achando M (distância em metros)', texto='1 metro tem 100 cm.\nM = 300 000 ÷ 100 = 3 000 m'),
    ],
    volta='D = 3 000 ÷ 1 000 = 3\nLetra E. A casa fica a 3 km da escola.',
    valores=[('CM', '300 000'), ('M', '3 000')],
    pista='escala no mapa → multiplique pela escala, depois converta: cm ÷ 100 = m, m ÷ 1 000 = km.',
    receita=[('1. Tabela do que eu tenho', 'escala 1 : 50 000, 6 cm'), ('2. Equação em letras', 'D = M ÷ 1 000'), ('3. Achar cada letra', 'CM = 300 000; M = 3 000'), ('4. Substituir', '3 000 ÷ 1 000 = 3')]),

  'd2-medio-mat-08': dict(
    confere=50 * 24 * 30 / 1000,
    formulas=[('contagem', 'Horas do dia', '1 dia = 24 horas'), ('caixa', 'Litro', '1 L = 1 000 mL')],
    tenho=[('Desperdício', '50 mL por hora'), ('Horas em 1 dia', '24 (dia e noite)'), ('Tempo', '30 dias')],
    quer='A questão quer quantos litros se perdem em 30 dias.',
    equacao='L = ML ÷ 1 000 (litros = mL ÷ 1 000)',
    porque='Por que ÷ 1 000? 1 litro tem 1 000 mL. Se você tem 2 000 mL de suco, são 2 litros: 2 000 ÷ 1 000.',
    letras=[('L', 'litros em 30 dias (o que a questão quer)'), ('MD', 'mL perdidos em 1 dia'), ('ML', 'mL perdidos em 30 dias')],
    telas=[
      dict(titulo='Achando MD: o seu jeito', texto='Parece certo fazer 50 × 30 = 1 500. Mas 50 mL é por HORA, e o dia tem 24 horas.\nMD = 50 × 24 = 1 200 mL'),
      dict(titulo='Achando ML (mL em 30 dias)', texto='Todo dia perde 1 200 mL.\nML = 1 200 × 30 = 36 000 mL'),
    ],
    volta='L = 36 000 ÷ 1 000 = 36\nLetra C. A torneira desperdiça 36 litros.',
    valores=[('MD', '1 200'), ('ML', '36 000')],
    pista='taxa por hora e tempo em dias → horas do dia primeiro; no fim converta a unidade (mL ÷ 1 000 = L).',
    receita=[('1. Tabela do que eu tenho', '50 mL/h, 24 h, 30 dias'), ('2. Equação em letras', 'L = ML ÷ 1 000'), ('3. Achar cada letra', 'MD = 1 200; ML = 36 000'), ('4. Substituir', '36 000 ÷ 1 000 = 36')]),

  'd2-medio-mat-09': dict(
    confere=7 * 4 - (6 + 8 + 5),
    formulas=[('media', 'Média', 'média = soma ÷ quantidade')],
    tenho=[('Média que precisa', '7'), ('Número de provas', '4'), ('Notas já tiradas', '6, 8 e 5')],
    quer='A questão quer a nota da 4ª prova.',
    equacao='N = S − J (nota que falta = soma que precisa − soma que já tem)',
    porque='Por que pensar em soma? Média é a soma dividida pela quantidade. Se 4 provas dão média 7, a soma delas tem que ser 4 × 7. Falta só completar essa soma.',
    letras=[('N', 'nota que falta (o que a questão quer)'), ('S', 'soma que precisa'), ('J', 'soma que já tem')],
    telas=[
      dict(titulo='Achando S: o seu jeito', texto='Parece certo tirar 7 de novo, para a média continuar 7. Mas as notas anteriores foram 6, 8 e 5, e elas pesam.\nMédia 7 em 4 provas quer dizer: soma 7 × 4.\nS = 7 × 4 = 28'),
      dict(titulo='Achando J (soma que já tem)', texto='Some as três notas.\nJ = 6 + 8 + 5 = 19'),
    ],
    volta='N = 28 − 19 = 9\nLetra B. Lucas precisa tirar 9.',
    valores=[('S', '28'), ('J', '19')],
    pista='"que nota falta para a média X" → soma que precisa (X × quantidade) menos soma que já tem.',
    receita=[('1. Tabela do que eu tenho', 'média 7, 4 provas, notas 6, 8, 5'), ('2. Equação em letras', 'N = S − J'), ('3. Achar cada letra', 'S = 28; J = 19'), ('4. Substituir', '28 − 19 = 9')]),

  'd2-medio-mat-10': dict(
    confere=(20 + 25) / 2,
    formulas=[('media', 'Média de dois números', 'média = soma ÷ 2')],
    tenho=[('Tempos (min)', '25, 10, 50, 15, 30, 20'), ('Quantidade', '6 alunos')],
    quer='A questão quer a mediana: o valor do meio da lista em ordem.',
    equacao='M = (A + B) ÷ 2 (mediana = média dos dois do meio, porque são 6 números)',
    porque='Por que a média dos dois do meio? Com 6 números não existe um só no meio: existem dois. A mediana fica no meio deles, que é a média dos dois.',
    letras=[('M', 'mediana (o que a questão quer)'), ('L', 'a lista em ordem'), ('AB', 'os dois números do meio')],
    telas=[
      dict(titulo='Achando L: o seu jeito', texto='Parece certo pegar o meio da lista como veio: 50 e 15. Mas só vale o meio da lista EM ORDEM.\nDo menor para o maior:\nL = 10, 15, 20, 25, 30, 50'),
      dict(titulo='Achando AB (os dois do meio)', texto='São 6 números: o 3º e o 4º ficam no meio.\nAB = 20 e 25'),
    ],
    volta='M = (20 + 25) ÷ 2 = 45 ÷ 2 = 22,5\nLetra D. A mediana é 22,5 minutos.',
    valores=[('L', '10, 15, 20, 25, 30, 50'), ('AB', '20 e 25')],
    pista='mediana → ponha em ordem primeiro; se a quantidade é par, faça a média dos dois do meio.',
    receita=[('1. Tabela do que eu tenho', '6 tempos soltos'), ('2. Equação em letras', 'M = (A + B) ÷ 2'), ('3. Achar cada letra', 'L em ordem; AB = 20 e 25'), ('4. Substituir', '(20 + 25) ÷ 2 = 22,5')]),

  'd2-medio-mat-11': dict(
    confere=(10 * 30 + 30 * 20) / (10 + 30),
    formulas=[('media', 'Média', 'média = total ÷ quantidade')],
    tenho=[('Camisetas a R$ 30', '10'), ('Camisetas a R$ 20', '30')],
    quer='A questão quer o preço médio de cada camiseta vendida.',
    equacao='PM = T ÷ N (preço médio = total em reais ÷ número de camisetas)',
    porque='Por que total ÷ número? Média é tudo o que entrou dividido pelo número de peças. Se você ganhou R$ 100 vendendo 4 coisas, cada uma rendeu 100 ÷ 4 = 25.',
    letras=[('PM', 'preço médio (o que a questão quer)'), ('T', 'total vendido em reais'), ('N', 'número de camisetas')],
    telas=[
      dict(titulo='Achando T: o seu jeito', texto='Parece certo fazer (30 + 20) ÷ 2 = 25. Mas vendeu 30 camisetas de R$ 20 e só 10 de R$ 30. O preço de 20 pesa mais.\nSomamos o dinheiro de cada grupo:\nT = 10 × 30 + 30 × 20 = 300 + 600 = 900 reais'),
      dict(titulo='Achando N (número de camisetas)', texto='Junte os dois grupos.\nN = 10 + 30 = 40'),
    ],
    volta='PM = 900 ÷ 40 = 22,5\nLetra E. O preço médio foi R$ 22,50.',
    valores=[('T', '900'), ('N', '40')],
    pista='média com quantidades diferentes → total em reais ÷ total de peças; nunca a média dos dois preços.',
    receita=[('1. Tabela do que eu tenho', '10 a R$ 30 e 30 a R$ 20'), ('2. Equação em letras', 'PM = T ÷ N'), ('3. Achar cada letra', 'T = 900; N = 40'), ('4. Substituir', '900 ÷ 40 = 22,5')]),

  'd2-medio-mat-12': dict(
    confere=(180 - 20) / 40,
    formulas=[('contagem', 'Total cobrado', 'total = visita + preço da hora × horas')],
    tenho=[('Visita (paga uma vez)', 'R$ 20'), ('Cada hora de trabalho', 'R$ 40'), ('Total recebido', 'R$ 180')],
    quer='A questão quer quantas horas o técnico trabalhou.',
    equacao='H = V ÷ 40 (horas = o que sobra depois da visita ÷ preço da hora)',
    porque='Por que tirar a visita antes de dividir? A visita é paga uma vez só e não depende das horas. Se você paga R$ 5 de entrada e R$ 10 por brinquedo, para descobrir os brinquedos tira a entrada e divide o resto.',
    letras=[('H', 'horas trabalhadas (o que a questão quer)'), ('V', 'o que sobra depois da visita')],
    telas=[
      dict(titulo='Achando V: o seu jeito', texto='Parece certo fazer 180 ÷ 40 = 4,5. Mas nos 180 estão os 20 da visita, que não pagam hora nenhuma.\nTire a visita primeiro.\nV = 180 − 20 = 160 reais'),
    ],
    volta='H = 160 ÷ 40 = 4\nLetra A. O técnico trabalhou 4 horas.\nConferindo: 20 + 4 × 40 = 180.',
    valores=[('V', '160')],
    pista='valor fixo mais valor por unidade → tire o fixo do total e divida o resto pelo valor da unidade.',
    receita=[('1. Tabela do que eu tenho', 'visita 20, hora 40, total 180'), ('2. Equação em letras', 'H = V ÷ 40'), ('3. Achar cada letra', 'V = 160'), ('4. Substituir', '160 ÷ 40 = 4')]),

  'd2-medio-mat-13': dict(
    confere=-5 * 2 ** 2 + 20 * 2,
    formulas=[('grafico', 'Altura da bola', 'h = −5 × t × t + 20 × t')],
    tenho=[('Altura da bola', 'h = −5t² + 20t'), ('t', 'segundos depois do chute'), ('Pergunta', 'altura máxima, em metros')],
    quer='A questão quer a altura mais alta da bola.',
    equacao='A = −5 × T × T + 20 × T (altura no instante T mais alto)',
    porque='Por que no meio? A bola sobe e desce do mesmo jeito, como um espelho. O ponto mais alto fica no meio do tempo entre sair do chão e voltar ao chão.',
    letras=[('A', 'altura máxima (o que a questão quer)'), ('Z', 'instante em que a bola volta ao chão'), ('T', 'instante do ponto mais alto')],
    telas=[
      dict(titulo='Achando Z (quando volta ao chão)', texto='No chão, h = 0. Escreva h = t × (−5t + 20).\nZero quando t = 0 (o chute) ou −5t + 20 = 0.\n−5t + 20 = 0 vira 5t = 20, então Z = 20 ÷ 5 = 4 segundos'),
      dict(titulo='Achando T: o seu jeito', texto='O meio entre 0 e 4 é 2. Mas parece certo responder "2 m" ou "4 m", e isso é TEMPO em segundos, não altura.\nT = 4 ÷ 2 = 2 segundos\nAgora coloque esse 2 na fórmula da altura.'),
    ],
    volta='A = −5 × 2 × 2 + 20 × 2 = −20 + 40 = 20\nLetra C. A bola chega a 20 metros.',
    valores=[('Z', '4'), ('T', '2')],
    pista='altura máxima de bola → ache quando volta ao chão, pegue o meio do tempo e ponha na fórmula.',
    receita=[('1. Tabela do que eu tenho', 'h = −5t² + 20t'), ('2. Equação em letras', 'A = −5 × T × T + 20 × T'), ('3. Achar cada letra', 'Z = 4; T = 2'), ('4. Substituir', '−20 + 40 = 20')]),

  'd2-medio-mat-14': dict(
    confere=40 / (90 - 80),
    formulas=[('contagem', 'Total da academia', 'total = matrícula + mensalidade × meses')],
    tenho=[('Academia X', 'R$ 40 de matrícula + R$ 80 por mês'), ('Academia Y', 'R$ 90 por mês, sem matrícula')],
    quer='A questão quer quantos meses até as duas cobrarem o mesmo total.',
    equacao='M = 40 ÷ D (meses = matrícula da X ÷ quanto Y cobra a mais por mês)',
    porque='Por que dividir? A Y começa R$ 40 na frente, mas ganha R$ 10 por mês em cima da X. Para tapar 40 a 10 por mês, precisa de 40 ÷ 10 meses.',
    letras=[('M', 'meses (o que a questão quer)'), ('D', 'quanto Y cobra a mais por mês')],
    telas=[
      dict(titulo='Achando D: o seu jeito', texto='Parece certo responder 10, que é a diferença. Mas 10 reais é por MÊS; a pergunta é quantos meses.\nY cobra 90 e X cobra 80 por mês.\nD = 90 − 80 = 10 reais por mês'),
    ],
    volta='M = 40 ÷ 10 = 4\nLetra B. Em 4 meses as duas cobraram R$ 360,00.\nConferindo: X = 40 + 4 × 80 = 360; Y = 4 × 90 = 360.',
    valores=[('D', '10')],
    pista='dois planos que se igualam → a vantagem inicial ÷ a diferença por mês.',
    receita=[('1. Tabela do que eu tenho', 'X: 40 + 80/mês; Y: 90/mês'), ('2. Equação em letras', 'M = 40 ÷ D'), ('3. Achar cada letra', 'D = 10'), ('4. Substituir', '40 ÷ 10 = 4')]),

  'd2-medio-mat-15': dict(
    confere=(5 * 4 / 2) * 45,
    formulas=[('retangulo', 'Área do retângulo', 'base × altura')],
    tenho=[('Sala', '5 m por 4 m'), ('Cada caixa cobre', '2 m²'), ('Preço da caixa', 'R$ 45')],
    quer='A questão quer o custo do piso da sala inteira.',
    equacao='C = NC × 45 (custo = número de caixas × preço da caixa)',
    porque='Por que a área e não a volta? Piso cobre o chão, que é área. A volta (perímetro) só serviria para rodapé.',
    letras=[('C', 'custo (o que a questão quer)'), ('AR', 'área da sala'), ('NC', 'número de caixas')],
    telas=[
      dict(titulo='Achando AR: o seu jeito', texto='Parece certo somar os lados: 5 + 4 + 5 + 4 = 18. Mas essa é a VOLTA da sala. O piso cobre o chão.\nO chão é um retângulo: base × altura.\nAR = 5 × 4 = 20 m²'),
      dict(titulo='Achando NC (número de caixas)', texto='Cada caixa cobre 2 m². Quantas vezes o 2 cabe em 20?\nNC = 20 ÷ 2 = 10 caixas'),
    ],
    volta='C = 10 × 45 = 450\nLetra D. O piso custa R$ 450,00.',
    valores=[('AR', '20'), ('NC', '10')],
    pista='piso, grama ou tinta → área do chão ÷ o que 1 caixa cobre, depois × preço.',
    receita=[('1. Tabela do que eu tenho', '5 × 4, caixa 2 m², R$ 45'), ('2. Equação em letras', 'C = NC × 45'), ('3. Achar cada letra', 'AR = 20; NC = 10'), ('4. Substituir', '10 × 45 = 450')]),

  'd2-medio-mat-16': dict(
    confere=(12 ** 2 + 5 ** 2) ** 0.5,
    formulas=[('triangulo-retangulo', 'Diagonal (Pitágoras)', 'diagonal × diagonal = lado × lado + outro × outro')],
    tenho=[('Comprimento', '12 m'), ('Largura', '5 m'), ('Caminho', 'de um canto ao canto oposto')],
    quer='A questão quer o comprimento da diagonal do jardim.',
    equacao='D × D = S (diagonal × diagonal = soma dos lados vezes eles mesmos)',
    porque='Por que lado × lado? A diagonal e os dois lados formam um triângulo com um canto reto. Nele, o quadrado da diagonal é igual à soma dos quadrados dos dois lados.',
    letras=[('D', 'diagonal (o que a questão quer)'), ('S', '12 × 12 + 5 × 5')],
    telas=[
      dict(titulo='Achando S: o seu jeito', texto='Parece certo fazer 12 + 5 = 17. Mas o caminho reto é um atalho: é mais curto que andar 12 e depois 5.\nS = 12 × 12 + 5 × 5 = 144 + 25 = 169'),
    ],
    volta='D × D = 169. Que número vezes ele mesmo dá 169? 13 × 13 = 169.\nLetra E. O caminho tem 13 metros.',
    valores=[('S', '169')],
    pista='canto a canto de um retângulo → some lado × lado dos dois lados e ache o número que vezes ele mesmo dá isso.',
    receita=[('1. Tabela do que eu tenho', 'lados 12 e 5'), ('2. Equação em letras', 'D × D = S'), ('3. Achar cada letra', 'S = 144 + 25 = 169'), ('4. Substituir', '13 × 13 = 169, D = 13')]),

  'd2-medio-mat-17': dict(
    confere=2 * 3 * 30 * 100 / 100,
    formulas=[('circulo', 'Volta do círculo', '2 × π × raio')],
    tenho=[('Raio da roda', '30 cm'), ('Voltas', '100'), ('π', '3')],
    quer='A questão quer a distância em metros.',
    equacao='M = CM ÷ 100 (metros = cm ÷ 100)',
    porque='Por que a volta da roda? A cada volta, a roda deita no chão todo o seu contorno. Uma volta anda o tamanho do contorno; 100 voltas andam 100 vezes isso.',
    letras=[('M', 'metros andados (o que a questão quer)'), ('V', 'distância de 1 volta, em cm'), ('CM', 'distância de 100 voltas, em cm')],
    telas=[
      dict(titulo='Achando V: o seu jeito', texto='Parece certo usar a área: 3 × 30 × 30 = 2 700. Mas a roda anda pelo CONTORNO, não pelo chão que ela cobre.\nContorno = 2 × π × raio.\nV = 2 × 3 × 30 = 180 cm'),
      dict(titulo='Achando CM (100 voltas)', texto='Cada volta anda 180 cm.\nCM = 180 × 100 = 18 000 cm'),
    ],
    volta='M = 18 000 ÷ 100 = 180\nLetra A. A bicicleta anda 180 metros.',
    valores=[('V', '180'), ('CM', '18 000')],
    pista='roda dando voltas → contorno (2 × π × raio) vezes o número de voltas; converta no fim.',
    receita=[('1. Tabela do que eu tenho', 'raio 30 cm, 100 voltas, π = 3'), ('2. Equação em letras', 'M = CM ÷ 100'), ('3. Achar cada letra', 'V = 180; CM = 18 000'), ('4. Substituir', '18 000 ÷ 100 = 180')]),

  'd2-medio-mat-18': dict(
    confere=30 * 20 * 5 / 1000,
    formulas=[('caixa', 'Volume da forma', 'comprimento × largura × altura'), ('caixa', 'Litro', '1 L = 1 000 cm³')],
    tenho=[('Fundo da forma', '30 cm por 20 cm'), ('Altura da massa', '5 cm')],
    quer='A questão quer quantos litros de massa cabem.',
    equacao='L = V ÷ 1 000 (litros = cm³ ÷ 1 000)',
    porque='Por que ÷ 1 000? Um litro é uma caixinha de 10 × 10 × 10 = 1 000 cm³. Para saber quantas caixinhas de 1 litro enchem a massa, divide por 1 000.',
    letras=[('L', 'litros de massa (o que a questão quer)'), ('AF', 'área do fundo'), ('V', 'volume da massa em cm³')],
    telas=[
      dict(titulo='Achando AF (área do fundo)', texto='O fundo é um retângulo.\nAF = 30 × 20 = 600 cm²'),
      dict(titulo='Achando V: o seu jeito', texto='Parece certo parar em 600. Mas 600 é só o fundo, e a massa tem altura.\nVolume = fundo × altura.\nV = 600 × 5 = 3 000 cm³'),
    ],
    volta='L = 3 000 ÷ 1 000 = 3\nLetra C. Cabem 3 litros de massa.',
    valores=[('AF', '600'), ('V', '3 000')],
    pista='"quantos litros" de algo em caixa → volume em cm³ (fundo × altura) e depois ÷ 1 000.',
    receita=[('1. Tabela do que eu tenho', '30 × 20, altura 5'), ('2. Equação em letras', 'L = V ÷ 1 000'), ('3. Achar cada letra', 'AF = 600; V = 3 000'), ('4. Substituir', '3 000 ÷ 1 000 = 3')]),

  'd2-medio-mat-19': dict(
    confere=1440 / (3 * 4 * 4 * 10),
    formulas=[('cilindro', 'Volume do cilindro', 'π × raio × raio × altura'), ('caixa', 'Litro', '1 L = 1 000 cm³')],
    tenho=[('Raio do copo', '4 cm'), ('Altura do copo', '10 cm'), ('Jarra', '1,44 L'), ('π', '3')],
    quer='A questão quer quantos copos enchem a jarra.',
    equacao='N = VJ ÷ VC (copos = volume da jarra ÷ volume de 1 copo)',
    porque='Por que dividir? É perguntar quantas vezes o copo cabe na jarra. Um balde de 12 litros e um copo de 2 litros: 12 ÷ 2 = 6 copos.',
    letras=[('N', 'número de copos (o que a questão quer)'), ('VC', 'volume de 1 copo'), ('VJ', 'volume da jarra em cm³')],
    telas=[
      dict(titulo='Achando VC: o seu jeito', texto='Parece certo fazer 3 × 4 × 10 = 120. Mas falta um raio: o círculo do fundo usa raio × raio.\nVC = 3 × 4 × 4 × 10 = 480 cm³'),
      dict(titulo='Achando VJ (jarra em cm³)', texto='1 litro = 1 000 cm³. Então 1,44 L = 1 440 cm³.\nVJ = 1 440'),
    ],
    volta='N = 1 440 ÷ 480 = 3\nLetra B. São 3 copos.\nConferindo: 480 + 480 + 480 = 1 440.',
    valores=[('VC', '480'), ('VJ', '1 440')],
    pista='quantos copos cabem → volume grande ÷ volume do copo, os dois na mesma unidade.',
    receita=[('1. Tabela do que eu tenho', 'raio 4, altura 10, jarra 1,44 L'), ('2. Equação em letras', 'N = VJ ÷ VC'), ('3. Achar cada letra', 'VC = 480; VJ = 1 440'), ('4. Substituir', '1 440 ÷ 480 = 3')]),

  'd2-medio-mat-20': dict(
    confere=6 * 6 * 10 / 3,
    formulas=[('quadrado', 'Área do quadrado', 'lado × lado'), ('caixa', 'Volume da pirâmide', 'área da base × altura ÷ 3')],
    tenho=[('Base (quadrado)', '6 cm de lado'), ('Altura', '10 cm'), ('Regra dada', 'volume = base × altura ÷ 3')],
    quer='A questão quer o volume da pirâmide, em cm³.',
    equacao='V = T ÷ 3 (volume = área da base × altura, dividido por 3)',
    porque='Por que ÷ 3? A pirâmide ocupa 1 terço da caixa de mesma base e altura. Se a caixa tem 360, a pirâmide tem 360 ÷ 3.',
    letras=[('V', 'volume (o que a questão quer)'), ('AB', 'área da base'), ('T', 'área da base × altura')],
    telas=[
      dict(titulo='Achando AB: o seu jeito', texto='Parece certo fazer 6 × 10 = 60 (lado × altura). Mas a base é um quadrado inteiro: lado × lado.\nAB = 6 × 6 = 36 cm²'),
      dict(titulo='Achando T (base × altura)', texto='Agora use a altura.\nT = 36 × 10 = 360'),
    ],
    volta='V = 360 ÷ 3 = 120\nLetra D. A embalagem tem 120 cm³.',
    valores=[('AB', '36'), ('T', '360')],
    pista='pirâmide → área da base × altura ÷ 3; a base quadrada é lado × lado.',
    receita=[('1. Tabela do que eu tenho', 'lado 6, altura 10'), ('2. Equação em letras', 'V = T ÷ 3'), ('3. Achar cada letra', 'AB = 36; T = 360'), ('4. Substituir', '360 ÷ 3 = 120')]),
}
