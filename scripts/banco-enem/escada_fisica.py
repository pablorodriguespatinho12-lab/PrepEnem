"""Questões que faltavam nas provas em escada de Física (Pablo, 17/11/2026: "quero que
você faça aquelas questões nível ITA"). Cada ficha diz o degrau em `nivel`: facil,
medio, dificil ou acima (nível ITA/IME, estilo banca difícil, questão original, nunca
apresentada como real). Aula no molde do robô. Contagem do que falta:
scripts/contar-escada.ts. Gravar: scripts/criar-questoes-escada.ts."""

ARQUIVO = '../escada/fisica'


def F(tema, nivel):
  return {'materia': 'Física', 'tema': tema, 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


FICHAS = [
# 01 · Cinemática, médio · a parada conta no tempo.
dict(**F('Cinemática', 'medio'), id='d2-escada-fis-cin-01', resp='C', objeto='ciclista', cobra='velocidade média com parada',
  confere=(9 + 11) / ((30 + 10 + 20) / 60),
  enun='Um ciclista pedala 9 km em 30 minutos, para 10 minutos para beber água e depois pedala mais 11 km em 20 minutos. Qual foi a velocidade média do ciclista no passeio todo, contando a parada?',
  alts=['24 km/h', '25,5 km/h', '20 km/h', '0,33 km/h', '40 km/h'],
  ideia='Velocidade média é a distância total dividida pelo tempo total, e a parada também conta no tempo. São 20 km em 60 minutos, ou seja, em 1 hora.',
  pecas=[('Velocidade média', 'Quantos km a pessoa andou, em média, a cada hora do passeio inteiro.')],
  conferencia='d = 9+11 = 20 km; t = 30+10+20 = 60 min = 1 h; v = 20 km/h. C. A = sem a parada (20 km em 50 min); B = média de 18 e 33 km/h; D = 20/60 sem passar para hora; E = 20/0,5.',
  sua_vez=('Um carro anda 60 km em 1 h, para 30 min e anda mais 30 km em 30 min. Velocidade média?', ['45 km/h', '60 km/h', '90 km/h', '30 km/h'], '45 km/h', '90 km em 2 h, contando a parada: 90 ÷ 2 = 45 km/h.'),
  aula=dict(
    formulas=[('carro', 'Velocidade média', 'v = distância total ÷ tempo total'), ('carro', 'Minutos para horas', 'horas = minutos ÷ 60')],
    tenho=[('1º trecho', '9 km em 30 min'), ('Parada', '10 min'), ('2º trecho', '11 km em 20 min')],
    quer='A questão quer a velocidade média do passeio todo.',
    equacao='v = d ÷ t (velocidade média = distância total ÷ tempo total)',
    porque='Por que o total? A velocidade média diz quantos km o ciclista andou, em média, a cada hora do passeio inteiro, inclusive no tempo em que ficou parado.',
    letras=[('v', 'velocidade média (o que a questão quer)'), ('d', 'distância total, em km'), ('t', 'tempo total, em horas')],
    telas=[
      dict(titulo='Achando d (distância total)', texto='Some os dois trechos. Parado, ele não anda nada.\nd = 9 + 11 = 20 km'),
      dict(titulo='Achando t: o seu jeito',
        texto='Parece certo somar só o tempo pedalando: 30 + 20 = 50 min. Isso dá 24 km/h, a letra A.\nMas a parada também faz parte do passeio.\nt = 30 + 10 + 20 = 60 min\n60 min ÷ 60 = 1 h'),
    ],
    volta='v = 20 ÷ 1 = 20 km/h\nLetra C.',
    valores=[('d', '20 km'), ('t', '1 h')],
    pista='"velocidade média" com parada no meio → some todas as distâncias e todos os tempos, inclusive o parado, e só depois divida.',
    receita=receita('9 km, parada, 11 km; 30, 10 e 20 min', 'v = d ÷ t', 'd = 20 km; t = 1 h', '20 ÷ 1 = 20'))),

# 02 · Cinemática, difícil · metades de distância: a média não é 75.
dict(**F('Cinemática', 'dificil'), id='d2-escada-fis-cin-02', resp='B', objeto='aplicativo de mapa', cobra='velocidade média em trechos de mesma distância',
  confere=120 / (60 / 60 + 60 / 90),
  enun='Um aplicativo de mapa mostra, no fim de cada viagem, a velocidade média do percurso. Um motorista fez 120 km de estrada entre duas cidades. Na primeira metade do caminho havia obras, e ele manteve 60 km/h o tempo todo. Na segunda metade, com a pista livre, manteve 90 km/h. Ele esperava ver 75 km/h, a média entre 60 e 90, mas o aplicativo mostrou outro valor. A velocidade média mostrada pelo aplicativo foi de',
  alts=['75 km/h', '72 km/h', '85,7 km/h', '80 km/h', '150 km/h'],
  ideia='Os dois trechos têm a mesma distância, mas não o mesmo tempo: ele passa mais tempo devagar. Por isso a média fica mais perto de 60 do que de 90: 120 km em 1 h 40 min dá 72 km/h.',
  pecas=[('Metade do caminho', 'Metade da DISTÂNCIA (60 km cada), e não metade do tempo.')],
  conferencia='t1 = 60/60 = 1 h; t2 = 60/90 = 2/3 h = 40 min; t = 5/3 h; v = 120/(5/3) = 72. B. A = média das velocidades; C = 40 min lido como 0,4 h (120/1,4); D = 2º trecho em 0,5 h (120/1,5); E = soma das velocidades.',
  sua_vez=('Ida de 60 km a 30 km/h e volta de 60 km a 60 km/h. Velocidade média?', ['45 km/h', '40 km/h', '50 km/h', '90 km/h'], '40 km/h', 'Ida 2 h, volta 1 h: 120 km ÷ 3 h = 40 km/h.'),
  aula=dict(
    formulas=[('carro', 'Velocidade média', 'v = distância total ÷ tempo total'), ('carro', 'Tempo de um trecho', 't = distância ÷ velocidade')],
    tenho=[('Distância total', '120 km'), ('1ª metade', '60 km a 60 km/h'), ('2ª metade', '60 km a 90 km/h')],
    quer='A questão quer a velocidade média da viagem toda.',
    equacao='v = d ÷ (t1 + t2) (velocidade média = distância total ÷ tempo total)',
    porque='Por que não a média de 60 e 90? Essa média só vale quando ele passa o MESMO TEMPO em cada velocidade. Aqui a distância é a mesma, e o tempo devagar é maior.',
    letras=[('v', 'velocidade média (o que a questão quer)'), ('d', 'distância total'), ('t1', 'tempo da 1ª metade, em horas'), ('t2', 'tempo da 2ª metade, em horas')],
    telas=[
      dict(titulo='Achando d (distância total)', texto='O enunciado dá direto.\nd = 120 km'),
      dict(titulo='Achando t1: o seu jeito',
        texto='Parece certo fazer (60 + 90) ÷ 2 = 75. É a letra A, e é a pegadinha.\nCada trecho tem o seu tempo. Na 1ª metade:\nt1 = 60 km ÷ 60 km/h = 1 h'),
      dict(titulo='Achando t2 (tempo da 2ª metade)',
        texto='t2 = 60 km ÷ 90 km/h = 2/3 h\n2/3 de 60 min = 40 min\nCuidado: 40 min NÃO é 0,4 h. Em horas, é 2/3 h.'),
    ],
    volta='v = 120 ÷ (1 + 2/3)\n1 + 2/3 = 5/3 h (1 h 40 min)\nv = 120 × 3 ÷ 5 = 72 km/h\nLetra B.',
    valores=[('d', '120 km'), ('t1', '1 h'), ('t2', '2/3 h')],
    pista='trechos de MESMA DISTÂNCIA com velocidades diferentes → nunca tire a média das velocidades: ache o tempo de cada trecho e divida a distância total pelo tempo total.',
    receita=receita('120 km; 60 km a 60; 60 km a 90', 'v = d ÷ (t1 + t2)', 't1 = 1 h; t2 = 2/3 h', '120 ÷ 5/3 = 72'))),

# 03 · Cinemática, difícil · reação + frenagem, com km/h para m/s.
dict(**F('Cinemática', 'dificil'), id='d2-escada-fis-cin-03', resp='D', objeto='carro freando', cobra='distância de parada',
  confere=20 * 0.5 + 20 ** 2 / (2 * 5),
  enun='Em autoescolas, ensina-se que a distância para parar um carro tem duas partes: a de reação, percorrida enquanto o motorista ainda não pisou no freio, e a de frenagem. Um carro anda a 72 km/h numa avenida quando o sinal fecha. O motorista leva 0,5 s para reagir; nesse tempo, o carro segue com a mesma velocidade. Depois, os freios reduzem a velocidade em 5 m/s a cada segundo, até o carro parar. A distância total percorrida, do momento em que o sinal fechou até o carro parar, é de',
  alts=['40 m', '10 m', '90 m', '50 m', '554,4 m'],
  ideia='Primeiro passe 72 km/h para 20 m/s (divida por 3,6). Na reação, o carro anda 20 × 0,5 = 10 m; freando de 20 m/s até parar, a 5 m/s por segundo, anda mais 40 m.',
  pecas=[('Reação', 'Tempo em que o motorista viu, mas o pé ainda não chegou no freio.'), ('Desaceleração de 5 m/s²', 'A velocidade cai 5 m/s a cada segundo.')],
  conferencia='v = 72/3,6 = 20 m/s; dr = 20*0,5 = 10 m; df = 20²/(2*5) = 40 m; D = 50 m. D. A = só a frenagem; B = só a reação; C = frenagem como 20*4 = 80 (sem lembrar que a velocidade cai); E = 72 sem converter (36 + 518,4).',
  sua_vez=('Carro a 10 m/s freia a 5 m/s² até parar. Quantos metros anda freando?', ['10 m', '20 m', '5 m', '2 m'], '10 m', '10² ÷ (2 × 5) = 100 ÷ 10 = 10 m.'),
  aula=dict(
    formulas=[('carro', 'km/h para m/s', 'v = km/h ÷ 3,6'), ('carro', 'Velocidade fixa', 'd = v × t'), ('grafico', 'Freando até parar', 'd = v² ÷ (2 × a)')],
    tenho=[('Velocidade', '72 km/h'), ('Tempo de reação', '0,5 s'), ('Freio', 'tira 5 m/s a cada segundo')],
    quer='A questão quer a distância total até parar.',
    equacao='D = dr + df (distância total = distância de reação + distância de frenagem)',
    porque='Por que somar? O carro anda nas duas fases: primeiro ainda na velocidade cheia, depois freando.',
    letras=[('D', 'distância total (o que a questão quer)'), ('v', 'velocidade em m/s'), ('dr', 'distância de reação'), ('df', 'distância de frenagem')],
    telas=[
      dict(titulo='Achando v (em m/s)', texto='O tempo está em segundos e o freio em m/s. Passe a velocidade para m/s.\nv = 72 ÷ 3,6 = 20 m/s\nSem converter, a conta dá 554,4 m, a letra E.'),
      dict(titulo='Achando dr (reação)', texto='Na reação, a velocidade não muda.\ndr = 20 × 0,5 = 10 m'),
      dict(titulo='Achando df: o seu jeito',
        texto='Para parar, leva 20 ÷ 5 = 4 s. Parece certo fazer 20 × 4 = 80 m. Mas a velocidade vai caindo de 20 até 0.\nUse a fórmula de quem freia até parar:\ndf = 20² ÷ (2 × 5) = 400 ÷ 10 = 40 m\nConfere: a velocidade média freando é 10 m/s, e 10 × 4 = 40 m.'),
    ],
    volta='D = 10 + 40 = 50 m\nLetra D.',
    valores=[('v', '20 m/s'), ('dr', '10 m'), ('df', '40 m')],
    pista='"tempo de reação" + "freia até parar" → duas distâncias: a de velocidade fixa (v × t) e a de frenagem (v² ÷ 2a). Antes de tudo, km/h ÷ 3,6.',
    receita=receita('72 km/h; 0,5 s; 5 m/s²', 'D = dr + df', 'v = 20; dr = 10; df = 40', '10 + 40 = 50'))),

# 04 · Termodinâmica, ITA · gelo derrete todo? Teste antes.
dict(**F('Termodinâmica e Calor', 'acima'), id='d2-escada-fis-ter-01', resp='A', objeto='copo com gelo', cobra='calor latente e equilíbrio',
  confere=(200 * 1 * 30 - 50 * 80) / ((200 + 50) * 1),
  enun='Num copo de isopor, que não troca calor com o ambiente, há 200 g de água a 30 °C. Coloca-se nele um cubo de gelo de 50 g a 0 °C e espera-se o equilíbrio. Dados: calor específico da água = 1 cal/(g·°C); calor para derreter o gelo = 80 cal por grama. A temperatura final da água no copo é de',
  alts=['8 °C', '24 °C', '10 °C', '0 °C', '15 °C'],
  ideia='O gelo primeiro gasta 50 × 80 = 4 000 cal só para derreter, sem esquentar. A água a 30 °C tem 6 000 cal para dar até 0 °C; sobram 2 000 cal para aquecer os 250 g juntos, o que dá 8 °C.',
  pecas=[('Calor para derreter', 'Calor que o gelo absorve para virar água, sem mudar de temperatura.')],
  conferencia='Qa = 200*1*30 = 6000 cal; Qf = 50*80 = 4000 cal; sobra 2000; T = 2000/250 = 8 °C. A. B = mistura sem o calor de derreter (6000/250); C = esqueceu de aquecer a água do gelo (2000/200); D = achou que sobrava gelo; E = média de 30 e 0.',
  sua_vez=('100 g de água a 20 °C e 50 g de gelo a 0 °C (80 cal/g). Sobra gelo?', ['Sim, a água dá 2 000 cal e o gelo pede 4 000', 'Não, derrete tudo', 'Sim, porque gelo sempre sobra', 'Não, a água ferve'], 'Sim, a água dá 2 000 cal e o gelo pede 4 000', '100 × 20 = 2 000 cal, menos que 50 × 80 = 4 000. Fica a 0 °C com gelo.'),
  aula=dict(
    formulas=[('termometro', 'Calor que muda temperatura', 'Q = m × c × ΔT'), ('termometro', 'Calor para derreter', 'Q = m × L')],
    tenho=[('Água', '200 g a 30 °C'), ('Gelo', '50 g a 0 °C'), ('c da água', '1 cal/(g·°C)'), ('L do gelo', '80 cal/g')],
    quer='A questão quer a temperatura final T.',
    equacao='T = (Qa − Qf) ÷ (m × 1) (o calor que sobra ÷ massa total)',
    porque='Por que assim? A água quente dá calor até 0 °C (Qa). O gelo usa uma parte só para derreter (Qf). O que sobra aquece toda a água junta, de 0 °C até T.',
    letras=[('T', 'temperatura final (o que a questão quer)'), ('Qa', 'calor que a água dá de 30 °C até 0 °C'), ('Qf', 'calor para derreter todo o gelo'), ('m', 'massa total de água no fim')],
    telas=[
      dict(titulo='Achando Qa (calor da água)', texto='Qa = m × c × ΔT\nQa = 200 × 1 × 30 = 6 000 cal'),
      dict(titulo='Achando Qf: o seu jeito',
        texto='Parece certo misturar direto: 200 × 30 ÷ 250 = 24 °C. Mas isso esquece que o gelo gasta calor para derreter.\nQf = 50 × 80 = 4 000 cal\nTeste: 6 000 é maior que 4 000, então todo o gelo derrete. Se fosse menor, sobraria gelo e T seria 0 °C.'),
      dict(titulo='Achando m (massa no fim)', texto='O gelo virou água e também precisa esquentar.\nm = 200 + 50 = 250 g\nUsando só 200 g, a conta dá 10 °C, a letra C.'),
    ],
    volta='T = (6 000 − 4 000) ÷ (250 × 1)\nT = 2 000 ÷ 250 = 8 °C\nLetra A.',
    valores=[('Qa', '6 000 cal'), ('Qf', '4 000 cal'), ('m', '250 g')],
    pista='gelo a 0 °C jogado em água → compare primeiro o calor que a água tem até 0 °C com o calor para derreter o gelo. Sobrou calor? Ele aquece TODA a água.',
    receita=receita('200 g a 30 °C; 50 g de gelo', 'T = (Qa − Qf) ÷ m', 'Qa = 6 000; Qf = 4 000; m = 250', '2 000 ÷ 250 = 8'))),

# 05 · Termodinâmica, ITA · pneu: a temperatura vai em kelvin.
dict(**F('Termodinâmica e Calor', 'acima'), id='d2-escada-fis-ter-02', resp='E', objeto='pneu', cobra='gás a volume constante, kelvin',
  confere=30 * (57 + 273) / (27 + 273),
  enun='Um motorista calibra os pneus num posto de manhã, com o ar dentro deles a 27 °C, deixando a pressão em 30 psi. Depois de uma longa viagem num dia quente, o ar dentro do pneu chega a 57 °C. Considere que o volume do pneu não muda e que o ar se comporta como gás ideal. A pressão do pneu ao fim da viagem é de',
  alts=['63,3 psi', '30 psi', '27,3 psi', '3 psi', '33 psi'],
  ideia='Na lei dos gases, a temperatura tem que estar em kelvin: some 273. Com o volume fixo, a pressão sobe na mesma proporção da temperatura em kelvin: de 300 K para 330 K, sobe 10%.',
  pecas=[('Kelvin', 'Escala de temperatura que começa no zero absoluto: K = °C + 273.')],
  conferencia='T1 = 300 K; T2 = 330 K; P2 = 30*330/300 = 33 psi. E. A = proporção em °C (30*57/27); B = achou que não muda; C = proporção invertida (30*300/330); D = só o aumento.',
  sua_vez=('Gás a 27 °C dobra a temperatura em kelvin. Vai a quantos °C?', ['54 °C', '327 °C', '600 °C', '300 °C'], '327 °C', '27 °C = 300 K. O dobro é 600 K, e 600 − 273 = 327 °C.'),
  aula=dict(
    formulas=[('termometro', 'Celsius para kelvin', 'K = °C + 273'), ('termometro', 'Gás com volume fixo', 'P1 ÷ T1 = P2 ÷ T2')],
    tenho=[('Pressão antes', '30 psi'), ('Temperatura antes', '27 °C'), ('Temperatura depois', '57 °C'), ('Volume', 'não muda')],
    quer='A questão quer a pressão no fim, P2.',
    equacao='P2 = 30 × T2 ÷ T1 (a pressão cresce na mesma proporção da temperatura em kelvin)',
    porque='Por que kelvin? A pressão é proporcional à temperatura contada do zero absoluto. Em °C, o zero é só onde a água congela, e a proporção sai errada.',
    letras=[('P2', 'pressão no fim (o que a questão quer)'), ('T1', 'temperatura antes, em kelvin'), ('T2', 'temperatura depois, em kelvin')],
    telas=[
      dict(titulo='Achando T1 (antes, em kelvin)', texto='T1 = 27 + 273 = 300 K'),
      dict(titulo='Achando T2: o seu jeito',
        texto='Parece certo fazer 57 ÷ 27, que é mais que o dobro: daria 63,3 psi, a letra A. Um pneu não dobra de pressão num dia quente.\nEm kelvin:\nT2 = 57 + 273 = 330 K'),
    ],
    volta='P2 = 30 × 330 ÷ 300\nP2 = 30 × 1,1 = 33 psi\nLetra E.',
    valores=[('T1', '300 K'), ('T2', '330 K')],
    pista='gás com temperatura em °C e conta de proporção (P ÷ T ou V ÷ T) → passe para kelvin antes de qualquer divisão.',
    receita=receita('30 psi; 27 °C; 57 °C', 'P2 = 30 × T2 ÷ T1', 'T1 = 300 K; T2 = 330 K', '30 × 330 ÷ 300 = 33'))),

# 06 · Ondas, fácil · raio e trovão.
dict(**F('Ondas e Acústica', 'facil'), id='d2-escada-fis-ond-01', resp='B', objeto='trovão', cobra='distância com a velocidade do som',
  confere=340 * 3,
  enun='Num temporal, uma pessoa vê um raio e ouve o trovão 3 segundos depois. O som anda 340 metros por segundo no ar. A que distância da pessoa caiu o raio?',
  alts=['113 m', '1 020 m', '340 m', '2 040 m', '343 m'],
  ideia='A luz do raio chega quase na hora; quem demora é o som. Em 3 segundos, o som anda 340 × 3 = 1 020 m.',
  pecas=[],
  conferencia='d = 340*3 = 1020 m. B. A = 340/3; C = só 1 segundo; D = dobrou como se fosse eco; E = 340+3.',
  sua_vez=('Trovão ouvido 5 s depois do raio (som a 340 m/s). Distância?', ['1 700 m', '68 m', '345 m', '3 400 m'], '1 700 m', '340 × 5 = 1 700 m.'),
  aula=dict(
    formulas=[('onda', 'Distância com velocidade fixa', 'd = v × t')],
    tenho=[('Velocidade do som', '340 m/s'), ('Tempo até ouvir', '3 s')],
    quer='A questão quer a distância até o raio.',
    equacao='d = v × t (distância = velocidade × tempo)',
    porque='Por que só o som? A luz anda tão rápido que chega quase na mesma hora do raio. Os 3 segundos são o tempo do som.',
    letras=[('d', 'distância até o raio (o que a questão quer)'), ('v', 'velocidade do som'), ('t', 'tempo que o som levou')],
    telas=[
      dict(titulo='Achando v (velocidade do som)', texto='O enunciado dá: v = 340 m/s.\nCada segundo, o som anda 340 m.'),
      dict(titulo='Achando t: o seu jeito', texto='Parece certo dobrar o tempo, como no eco. Mas aqui o som só vem: não vai e volta.\nt = 3 s'),
    ],
    volta='d = 340 × 3 = 1 020 m\nLetra B.',
    valores=[('v', '340 m/s'), ('t', '3 s')],
    pista='"vê e depois ouve" → o tempo é só do som indo: d = 340 × tempo. Só divida por 2 quando for eco (ida e volta).',
    receita=receita('340 m/s; 3 s', 'd = v × t', 'v = 340; t = 3', '340 × 3 = 1 020'))),

# 07 · Ondas, ITA · corda de violão: frequência e comprimento são inversos.
dict(**F('Ondas e Acústica', 'acima'), id='d2-escada-fis-ond-02', resp='C', objeto='violão', cobra='corda vibrante',
  confere=(0.65 * 2 * 220) / (2 * 330) * 100,
  enun='Uma corda de violão tem 65 cm de comprimento entre os dois apoios e, solta, vibra a 220 Hz. Ao apertar a corda contra um traste, o violonista encurta a parte que vibra, e a nota sobe para 330 Hz. A tensão da corda não muda, então a velocidade da onda nela continua a mesma. O comprimento da parte da corda que vibra com o dedo no traste é de',
  alts=['97,5 cm', '21,7 cm', '43,3 cm', '32,5 cm', '65 cm'],
  ideia='Na corda presa nas duas pontas, o comprimento de onda da nota é 2 vezes a parte que vibra. Como a velocidade não muda, frequência 1,5 vez maior pede corda 1,5 vez menor.',
  pecas=[('Traste', 'Filete de metal no braço do violão; apertando ali, só um pedaço da corda vibra.')],
  conferencia='λ1 = 2*0,65 = 1,3 m; v = 1,3*220 = 286 m/s; L2 = 286/(2*330) = 0,433 m = 43,3 cm. C. A = regra de três direta (65*330/220); B = o pedaço que não vibra (65-43,3); D = metade da corda; E = achou que não muda.',
  sua_vez=('Corda de 60 cm vibra a 200 Hz. Com a mesma velocidade, quanto vibra a 300 Hz?', ['40 cm', '90 cm', '30 cm', '20 cm'], '40 cm', 'Frequência 1,5 vez maior, corda 1,5 vez menor: 60 ÷ 1,5 = 40 cm.'),
  aula=dict(
    formulas=[('onda', 'Velocidade da onda', 'v = λ × f'), ('onda', 'Corda presa nas 2 pontas', 'λ = 2 × L')],
    tenho=[('Corda solta', '65 cm a 220 Hz'), ('Nota com o dedo', '330 Hz'), ('Velocidade da onda', 'a mesma nos dois casos')],
    quer='A questão quer o comprimento L2 que vibra a 330 Hz.',
    equacao='L2 = v ÷ (2 × f2) (de v = λ × f, com λ = 2 × L)',
    porque='Por que 2 × L? Na nota da corda presa nas duas pontas, cabe meia onda na corda. Uma onda inteira tem o dobro do comprimento da corda.',
    letras=[('L2', 'parte que vibra com o dedo (o que a questão quer)'), ('v', 'velocidade da onda na corda'), ('f2', 'nova frequência')],
    telas=[
      dict(titulo='Achando v (velocidade na corda)', texto='Use a corda solta.\nλ = 2 × 0,65 = 1,3 m\nv = 1,3 × 220 = 286 m/s'),
      dict(titulo='Achando f2: o seu jeito',
        texto='Parece certo uma regra de três direta: 65 × 330 ÷ 220 = 97,5 cm, a letra A. Mas 97,5 cm é maior que a corda inteira, de 65 cm.\nNota mais aguda pede corda MENOR: frequência e comprimento são inversos.\nf2 = 330 Hz'),
    ],
    volta='L2 = 286 ÷ (2 × 330)\nL2 = 286 ÷ 660 = 0,433 m = 43,3 cm\nLetra C. Confere: 65 ÷ 1,5 = 43,3.',
    valores=[('v', '286 m/s'), ('f2', '330 Hz')],
    pista='mesma corda, mesma tensão, nota diferente → a velocidade fica igual; frequência e comprimento que vibra são inversos.',
    receita=receita('65 cm a 220 Hz; 330 Hz', 'L2 = v ÷ (2 × f2)', 'v = 286; f2 = 330', '286 ÷ 660 = 0,433 m'))),

# 08 · Ondas, ITA · eco com o trem andando.
dict(**F('Ondas e Acústica', 'acima'), id='d2-escada-fis-ond-03', resp='E', objeto='trem', cobra='eco com fonte em movimento',
  confere=(340 * 2 + 20 * 2) / 2,
  enun='Um trem anda em linha reta a 20 m/s na direção de um paredão de rocha. Num certo instante, o maquinista toca o apito e, 2 s depois, ouve o eco vindo do paredão. O som anda 340 m/s no ar. No instante em que apitou, o trem estava a que distância do paredão?',
  alts=['340 m', '680 m', '320 m', '720 m', '360 m'],
  ideia='Em 2 s, o som vai até o paredão e volta, e o trem também anda em direção ao paredão. O caminho do som (680 m) mais o do trem (40 m) dá 2 vezes a distância inicial: 720 ÷ 2 = 360 m.',
  pecas=[('Eco', 'O som bate no paredão e volta.')],
  conferencia='ds = 340*2 = 680; dt = 20*2 = 40; 2D = 720; D = 360. Confere: som vai 360 e volta 320 (o trem está a 360-40), total 680. E. A = trem parado; B = esqueceu de dividir por 2; C = subtraiu o trem; D = não dividiu por 2.',
  sua_vez=('Mesmo caso, mas com o trem PARADO. Distância do paredão?', ['340 m', '680 m', '170 m', '360 m'], '340 m', 'O som vai e volta: 680 ÷ 2 = 340 m.'),
  aula=dict(
    formulas=[('onda', 'Caminho do som', 'ds = 340 × t'), ('carro', 'Caminho do trem', 'dt = 20 × t')],
    tenho=[('Velocidade do trem', '20 m/s'), ('Velocidade do som', '340 m/s'), ('Tempo até o eco', '2 s')],
    quer='A questão quer a distância D na hora do apito.',
    equacao='D = (ds + dt) ÷ 2 (caminho do som + caminho do trem = 2 vezes a distância)',
    porque='Por que somar? O som vai D até o paredão. Na volta, o trem já chegou mais perto, então o som volta D menos o que o trem andou. Som + trem = 2D.',
    letras=[('D', 'distância na hora do apito (o que a questão quer)'), ('ds', 'caminho do som em 2 s'), ('dt', 'caminho do trem em 2 s')],
    telas=[
      dict(titulo='Achando ds: o seu jeito',
        texto='ds = 340 × 2 = 680 m\nParece certo parar aqui: 680 ÷ 2 = 340 m, a letra A. Isso vale com o trem parado. Mas ele andou na direção do eco.'),
      dict(titulo='Achando dt (caminho do trem)', texto='dt = 20 × 2 = 40 m'),
    ],
    volta='D = (680 + 40) ÷ 2\nD = 720 ÷ 2 = 360 m\nLetra E. Confere: o som vai 360 m e volta 320 m, total 680 m.',
    valores=[('ds', '680 m'), ('dt', '40 m')],
    pista='eco com quem apita ANDANDO na direção da parede → some o caminho do som e o de quem anda, e divida por 2.',
    receita=receita('trem 20 m/s; som 340 m/s; 2 s', 'D = (ds + dt) ÷ 2', 'ds = 680; dt = 40', '720 ÷ 2 = 360'))),

# 09 · Óptica, ITA · projetor: o slide não fica no foco.
dict(**F('Óptica', 'acima'), id='d2-escada-fis-opt-01', resp='D', objeto='projetor', cobra='equação da lente e aumento',
  confere=2 * 400 / (1 / (1 / 10 - 1 / 400)),
  enun='Um projetor antigo de slides usa uma lente convergente de distância focal 10 cm. A imagem nítida de um slide aparece numa parede a 4 m da lente. A figura no slide tem 2 cm de altura. A altura dessa figura projetada na parede é de',
  alts=['80 cm', '40 cm', '2 cm', '78 cm', '39 cm'],
  ideia='A parede é onde fica a imagem, a 400 cm. Pela equação da lente, o slide fica a 400 ÷ 39 cm da lente, então a imagem é 39 vezes maior: 2 × 39 = 78 cm.',
  pecas=[('Distância focal', 'Distância da lente até o ponto onde ela junta os raios de luz.'), ('Aumento', 'Quantas vezes a imagem é maior que o objeto.')],
  conferencia='q = 400 cm; 1/p = 1/10 - 1/400 = 39/400; p = 10,26 cm; aumento = q/p = 39; i = 78 cm. D. A = slide no foco (p = 10, aumento 40); B = só o aumento do foco (400/10), sem os 2 cm; C = sem aumento; E = só o aumento.',
  sua_vez=('Lente de f = 10 cm, slide a 20 cm. Onde fica a imagem?', ['20 cm', '10 cm', '30 cm', '5 cm'], '20 cm', '1/q = 1/10 − 1/20 = 1/20. Então q = 20 cm.'),
  aula=dict(
    formulas=[('lente', 'Equação da lente', '1/f = 1/p + 1/q'), ('lente', 'Aumento', 'imagem ÷ objeto = q ÷ p')],
    tenho=[('Foco da lente', '10 cm'), ('Parede (imagem)', '4 m = 400 cm'), ('Altura no slide', '2 cm')],
    quer='A questão quer a altura i da figura na parede.',
    equacao='i = o × q ÷ p (imagem = objeto × aumento)',
    porque='Por que q ÷ p? A imagem cresce na proporção das distâncias: quanto mais longe a parede, comparado com o slide, maior a figura.',
    letras=[('i', 'altura na parede (o que a questão quer)'), ('o', 'altura no slide'), ('q', 'distância da lente até a parede'), ('p', 'distância da lente até o slide')],
    telas=[
      dict(titulo='Achando o (altura no slide)', texto='o = 2 cm'),
      dict(titulo='Achando q (até a parede)', texto='Mesma unidade do foco: q = 4 m = 400 cm'),
      dict(titulo='Achando p: o seu jeito',
        texto='Parece certo pôr o slide no foco, p = 10 cm. Daria 2 × 400 ÷ 10 = 80 cm, a letra A. Mas no foco a imagem iria para o infinito.\n1/p = 1/10 − 1/400\n1/p = 40/400 − 1/400 = 39/400\np = 400/39 ≈ 10,26 cm'),
    ],
    volta='i = 2 × 400 ÷ (400/39)\ni = 2 × 39 = 78 cm\nLetra D.',
    valores=[('o', '2 cm'), ('q', '400 cm'), ('p', '400/39 cm')],
    pista='projetor ou câmera com foco e distância da tela → ache a distância do objeto pela equação da lente; não use o foco como se fosse ela.',
    receita=receita('f = 10 cm; tela a 400 cm; slide 2 cm', 'i = o × q ÷ p', 'o = 2; q = 400; p = 400/39', '2 × 39 = 78'))),

# 10 · Eletricidade, ITA · chuveiro de 220 V em 110 V.
dict(**F('Eletricidade e Circuitos', 'acima'), id='d2-escada-fis-ele-01', resp='A', objeto='chuveiro', cobra='potência com tensão diferente',
  confere=110 ** 2 / (220 ** 2 / 4400),
  enun='Um chuveiro elétrico tem na etiqueta: 220 V e 4 400 W. Numa casa nova, ele é ligado por engano numa tomada de 110 V. Considere que a resistência do chuveiro não muda. A potência do chuveiro ligado em 110 V é de',
  alts=['1 100 W', '2 200 W', '4 400 W', '8 800 W', '550 W'],
  ideia='O que não muda é a resistência: R = 220² ÷ 4 400 = 11 ohms. Com metade da tensão, a corrente também cai à metade, e a potência cai para um quarto: 110² ÷ 11 = 1 100 W.',
  pecas=[('Resistência', 'O quanto o fio do chuveiro segura a corrente; é dele, não da tomada.')],
  conferencia='R = 220²/4400 = 11; P2 = 110²/11 = 1100 W. A. B = metade (achou que a corrente fica igual); C = achou que não muda; D = dobrou; E = um oitavo.',
  sua_vez=('Lâmpada de 120 V e 60 W ligada em 60 V (mesma resistência). Potência?', ['15 W', '30 W', '60 W', '120 W'], '15 W', 'Metade da tensão, um quarto da potência: 60 ÷ 4 = 15 W.'),
  aula=dict(
    formulas=[('circuito', 'Potência', 'P = U² ÷ R'), ('circuito', 'Resistência pela etiqueta', 'R = U² ÷ P')],
    tenho=[('Etiqueta', '220 V e 4 400 W'), ('Tomada usada', '110 V'), ('Resistência', 'não muda')],
    quer='A questão quer a potência P2 em 110 V.',
    equacao='P2 = U2² ÷ R (potência = tensão ao quadrado ÷ resistência)',
    porque='Por que esta fórmula? Ela usa a tensão e a resistência, que são justamente o que a questão dá: a tensão nova e a resistência que não muda.',
    letras=[('P2', 'potência em 110 V (o que a questão quer)'), ('U2', 'tensão da tomada usada'), ('R', 'resistência do chuveiro')],
    telas=[
      dict(titulo='Achando U2 (tensão usada)', texto='U2 = 110 V'),
      dict(titulo='Achando R: o seu jeito',
        texto='Parece certo pensar: metade da tensão, metade da potência, 2 200 W. Mas com metade da tensão a corrente TAMBÉM cai à metade.\nA resistência vem da etiqueta:\nR = 220² ÷ 4 400\nR = 48 400 ÷ 4 400 = 11 ohms'),
    ],
    volta='P2 = 110² ÷ 11\nP2 = 12 100 ÷ 11 = 1 100 W\nLetra A. Um quarto da potência da etiqueta.',
    valores=[('U2', '110 V'), ('R', '11 ohms')],
    pista='aparelho ligado em tensão diferente da etiqueta → ache R pela etiqueta (U² ÷ P) e use P = U² ÷ R com a tensão nova. Metade da tensão = um quarto da potência.',
    receita=receita('220 V e 4 400 W; ligado em 110 V', 'P2 = U2² ÷ R', 'U2 = 110; R = 11', '12 100 ÷ 11 = 1 100'))),

# 11 · Eletricidade, ITA · série com paralelo.
dict(**F('Eletricidade e Circuitos', 'acima'), id='d2-escada-fis-ele-02', resp='C', objeto='lâmpadas', cobra='circuito misto',
  confere=(18 / (12 / 2 + 12) / 2) ** 2 * 12,
  enun='Três lâmpadas iguais, cada uma com resistência de 12 ohms, são ligadas a uma bateria de 18 V assim: duas delas ficam em paralelo entre si, e esse conjunto fica em série com a terceira lâmpada. Considere que a resistência das lâmpadas não muda. A potência em cada uma das duas lâmpadas que estão em paralelo é de',
  alts=['12 W', '27 W', '3 W', '6 W', '9 W'],
  ideia='Troque o par em paralelo por um só resistor de 6 ohms: o circuito vira 6 + 12 = 18 ohms, e a corrente é 18 ÷ 18 = 1 A. Essa corrente se divide ao meio no par, 0,5 A em cada, e P = 0,5 × 0,5 × 12 = 3 W.',
  pecas=[('Em paralelo', 'Lado a lado: a corrente se divide entre elas.'), ('Em série', 'Uma depois da outra: a mesma corrente passa pelas duas.')],
  conferencia='Req = 12/2 + 12 = 18; I = 1 A; i = 0,5 A; P = 0,25*12 = 3 W. C. A = a lâmpada em série (1²*12); B = 18²/12, como se cada uma tivesse os 18 V; D = o par inteiro (1²*6); E = metade da potência total (18 W).',
  sua_vez=('Duas lâmpadas de 10 ohms em paralelo. Resistência do par?', ['5 ohms', '20 ohms', '10 ohms', '2 ohms'], '5 ohms', 'Iguais em paralelo: divida uma pelo número delas. 10 ÷ 2 = 5.'),
  aula=dict(
    formulas=[('circuito', 'Iguais em paralelo', 'R do par = R ÷ 2'), ('circuito', 'Em série', 'R total = soma'), ('circuito', 'Corrente', 'I = U ÷ R'), ('circuito', 'Potência', 'P = i × i × R')],
    tenho=[('Cada lâmpada', '12 ohms'), ('Bateria', '18 V'), ('Ligação', '2 em paralelo, em série com 1')],
    quer='A questão quer a potência P em cada lâmpada do par.',
    equacao='P = i × i × 12 (potência = corrente na lâmpada ao quadrado × resistência)',
    porque='Por que a corrente? As 3 lâmpadas têm a mesma resistência; o que muda de uma para outra é a corrente que passa nela.',
    letras=[('P', 'potência em cada lâmpada do par (o que a questão quer)'), ('Req', 'resistência do circuito todo'), ('I', 'corrente que sai da bateria'), ('i', 'corrente em cada lâmpada do par')],
    telas=[
      dict(titulo='Achando Req (circuito todo)', texto='O par em paralelo vale 12 ÷ 2 = 6 ohms.\nEle está em série com a 3ª lâmpada:\nReq = 6 + 12 = 18 ohms'),
      dict(titulo='Achando I (corrente da bateria)', texto='I = 18 ÷ 18 = 1 A\nToda essa corrente passa pela lâmpada em série.'),
      dict(titulo='Achando i: o seu jeito',
        texto='Parece certo dar os 18 V a cada lâmpada: 18 × 18 ÷ 12 = 27 W, a letra B. Mas a bateria é dividida entre a lâmpada em série e o par.\nNo par, a corrente de 1 A se divide em duas partes iguais:\ni = 1 ÷ 2 = 0,5 A'),
    ],
    volta='P = 0,5 × 0,5 × 12\nP = 0,25 × 12 = 3 W\nLetra C. A lâmpada em série gasta 12 W, 4 vezes mais.',
    valores=[('Req', '18 ohms'), ('I', '1 A'), ('i', '0,5 A')],
    pista='lâmpadas iguais misturando série e paralelo → troque cada paralelo por um resistor só, ache a corrente da bateria e divida essa corrente no paralelo.',
    receita=receita('3 × 12 ohms; 18 V', 'P = i × i × 12', 'Req = 18; I = 1; i = 0,5', '0,25 × 12 = 3'))),
]
