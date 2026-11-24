#!/usr/bin/env python3
"""Nível acima de FÍSICA (23/11/2026): 24 questões originais, 4 por degrau (a = ENEM, b = ITA, c = Fuvest, d = Harvard-MIT).

As 2 primeiras (a, b) entram na prova; c e d ficam no banco. Mesmo molde da Matemática
(data/revisao-final/escada/matematica-acima-novas.json): dados -> equação em letras -> uma tela por letra
-> volta na equação -> receita -> "Sua vez". Cada resposta é conferida por conta em Python (assert).

Uso: python3 scripts/banco-enem/acima_fisica_novas.py   (grava data/revisao-final/escada/fisica-acima-novas.json)
"""
import json
import math
import os
import re
import sys

SAIDA = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'revisao-final', 'escada', 'fisica-acima-novas.json')
LETRAS = 'ABCDE'
sys.path.insert(0, os.path.dirname(__file__))
from acima_fisica_ajustes import aplicar as aplicar_ajustes  # noqa: E402
import acima_fisica_ajustes2  # noqa: E402,F401  (registra a 2ª rodada)
import acima_fisica_ajustes3  # noqa: E402,F401  (registra a 3ª rodada)
import acima_fisica_ajustes4  # noqa: E402,F401  (âncora real e contexto das ENEM)
import acima_fisica_ajustes5  # noqa: E402,F401  (canal Universo Narrado)
from cortar_passos import dividir_passo  # noqa: E402


from molde_acima import LETRAS, br, montar, origem_em_telas  # noqa: E402,F401  (montador movido em 23/11/2026)


Q = []

# ============================ CINEMÁTICA ============================
T = 'Cinemática'
# a) ENEM: radar de trecho
assert 12000 / (90 / 3.6) == 480 and 7 * 60 == 420
Q.append(dict(
    id='d2-escada-fis-ita-cin-00a', tema=T, calc=60,
    enunciado=('Para reduzir acidentes, uma concessionária instalou em uma rodovia um radar de trecho: dois pórticos com câmeras, a 12 km um do outro. '
               'O sistema anota a hora em que cada carro passa pelo primeiro e pelo segundo pórtico e calcula a velocidade média no trecho. '
               'Se ela passar do limite de 90 km/h, o motorista é multado, mesmo que nunca tenha sido flagrado acima de 90 km/h em nenhum ponto da pista. '
               'Um motorista passou pelo primeiro pórtico às 8 h 00 min 00 s e pelo segundo às 8 h 07 min 00 s. Ao receber a multa, ele reclamou que '
               '"só" tinha se atrasado alguns segundos para respeitar o limite. Para não ser multado, quantos segundos a mais, no mínimo, '
               'ele deveria ter gasto para percorrer o trecho?'),
    dados=[('Trecho', '12 km'), ('Limite', '90 km/h (velocidade média)'), ('Tempo gasto', '7 min')],
    alts=[('13', 13, 'Subtraiu as velocidades (102,9 − 90) e chamou o resultado de segundos'),
          ('60', 60, 'OK'),
          ('133', 133, 'Fez 12 000 ÷ 90, sem passar 90 km/h para m/s'),
          ('420', 420, 'Deu o tempo que ele gastou, não a diferença'),
          ('480', 480, 'Deu o tempo mínimo, sem subtrair o que ele gastou')],
    resumo='90 km/h = 25 m/s; tempo mínimo = 12 000 ÷ 25 = 480 s; gasto = 7 · 60 = 420 s; diferença = 60 s.',
    ideia='Radar de trecho multa pela velocidade média, então o que vale é o tempo total: 12 km a 90 km/h pedem pelo menos 8 minutos. Ele fez em 7, um minuto a menos.',
    pecas=[('Velocidade média no trecho', 'Distância do trecho ÷ tempo gasto nele. Não importa a velocidade em cada ponto.')],
    formulas=[('carro', 'Tempo', 'tempo = distância ÷ velocidade'), ('carro', 'km/h para m/s', 'm/s = km/h ÷ 3,6')],
    eq='D = M − G', leitura='segundos a mais = tempo mínimo − tempo gasto',
    letras=[('D', 'segundos a mais que ele deveria ter gasto (o que a questão quer)'), ('M', 'tempo mínimo para não passar de 90 km/h, em s'), ('G', 'tempo que ele gastou, em s')],
    eq_texto='A questão quer a diferença entre o tempo mínimo permitido e o tempo que ele gastou.\nAgora é só achar cada letra, uma por vez.',
    achando=[('Achando M: o tempo mínimo', '90 km/h ÷ 3,6 = 25 m/s. O trecho tem 12 km = 12 000 m.\nM = 12 000 ÷ 25 = 480 s (8 minutos).'),
             ('Achando G: o tempo gasto', 'Das 8 h 00 min 00 s às 8 h 07 min 00 s passaram 7 minutos.\nG = 7 · 60 = 420 s.')],
    volta='D = 480 − 420 = 60 s.\nLetra B. Conferindo: 12 km em 8 min = 90 km/h, o limite exato.',
    valores=[('M', '480 s'), ('G', '420 s')],
    pista='"radar de trecho" ou "velocidade média entre dois pontos" → calcule o tempo que o limite permite (distância ÷ limite) e compare com o tempo gasto.',
    rec1='12 km, limite 90 km/h, gastou 7 min', rec3='M = 480 s; G = 420 s',
    checagem=('Trecho de 6 km com limite de 72 km/h. Qual o tempo mínimo, sem ser multado?', ['300 s', '5 s', '83 s', '432 s'], '300 s',
              '72 km/h = 20 m/s; 6 000 ÷ 20 = 300 s (5 minutos).'),
))
# b) ITA: projétil horizontal
assert math.sqrt(2 * 10 * 45) == 30 and math.hypot(40, 30) == 50
Q.append(dict(
    id='d2-escada-fis-ita-cin-00b', tema=T, calc=50,
    enunciado=('Do alto de um penhasco de 45 m de altura sobre o mar, uma pedra é lançada horizontalmente com velocidade de 40 m/s. '
               'Despreze a resistência do ar e adote g = 10 m/s². O módulo da velocidade da pedra no instante em que ela atinge a água, em m/s, é:'),
    dados=[('Altura', '45 m'), ('Velocidade horizontal inicial', '40 m/s'), ('Gravidade', '10 m/s²')],
    alts=[('10', 10, 'Subtraiu 40 − 30, como se as velocidades se cancelassem'),
          ('30', 30, 'Deu só a velocidade da queda e esqueceu a horizontal'),
          ('40', 40, 'Deu só a horizontal e esqueceu que a pedra também cai'),
          ('50', 50, 'OK'),
          ('70', 70, 'Somou 40 + 30, mas as duas velocidades formam um ângulo reto')],
    resumo='Horizontal: 40 m/s (não muda). Vertical: Y² = 2 · 10 · 45 = 900, Y = 30 m/s. V² = 40² + 30² = 2 500, V = 50 m/s.',
    ideia='A pedra tem dois movimentos separados: na horizontal a velocidade não muda, na vertical é queda livre. Os dois valores formam os catetos de um triângulo retângulo.',
    pecas=[('Módulo da velocidade', 'O tamanho da velocidade total, juntando o que anda para o lado e o que cai.')],
    formulas=[('carro', 'Queda livre', 'Y² = 2 · g · altura'), ('triangulo-retangulo', 'Pitágoras', 'V² = X² + Y²')],
    eq='V = √(X² + Y²)', leitura='velocidade total = raiz de (horizontal² + vertical²)',
    letras=[('V', 'velocidade ao atingir a água (o que a questão quer)'), ('X', 'velocidade horizontal, em m/s'), ('Y', 'velocidade vertical, em m/s')],
    eq_texto='A velocidade final tem uma parte horizontal (X) e uma vertical (Y). Elas formam um triângulo retângulo, e V é a diagonal.\nAgora é só achar X e Y.',
    achando=[('Achando X: a parte horizontal', 'Sem resistência do ar, nada empurra a pedra para os lados: a horizontal não muda.\nX = 40 m/s.'),
             ('Achando Y: a parte vertical', 'Na queda de 45 m, partindo sem velocidade vertical: Y² = 2 · g · h.\nY² = 2 · 10 · 45 = 900, então Y = 30 m/s.')],
    volta='V = √(40² + 30²) = √(1 600 + 900) = √2 500 = 50 m/s.\nLetra D.',
    valores=[('X', '40 m/s'), ('Y', '30 m/s')],
    pista='"lançada horizontalmente" e "velocidade ao chegar" → separe: horizontal fica igual, vertical vem da queda; junte com Pitágoras.',
    rec1='45 m, 40 m/s, g = 10', rec3='X = 40 m/s; Y = 30 m/s',
    checagem=('Pedra solta, sem velocidade inicial, de 20 m de altura. Com que velocidade chega ao chão? (g = 10)', ['20 m/s', '10 m/s', '200 m/s', '40 m/s'], '20 m/s',
              'Y² = 2 · 10 · 20 = 400, então Y = 20 m/s.'),
))
# c) Fuvest: encontro com saída atrasada
d = 3 * 60; t = (1140 - d) / (3 + 5); assert t == 120 and d + 3 * t == 540 and 5 * t == 600
Q.append(dict(
    id='d2-escada-fis-ita-cin-00c', tema=T, calc=540,
    enunciado=('Uma pista reta de 1 140 m liga os pontos P e Q. Ana parte de P rumo a Q, correndo a 3 m/s. Sessenta segundos depois, Bia parte de Q rumo a P, '
               'a 5 m/s. Os dois mantêm essas velocidades o tempo todo, sem parar. A que distância de P eles se cruzam, em metros?'),
    dados=[('Pista', '1 140 m'), ('Ana', '3 m/s, sai de P'), ('Bia', '5 m/s, sai de Q'), ('Atraso de Bia', '60 s')],
    alts=[('360', 360, 'Fez 3 · 120 e esqueceu os 180 m que Ana já tinha andado'),
          ('427,5', 427.5, 'Fez 1 140 · 3 ÷ 8, ignorando que Ana saiu antes'),
          ('540', 540, 'OK'),
          ('570', 570, 'Achou que se cruzam no meio da pista'),
          ('600', 600, 'Deu a distância de Q, não de P')],
    resumo='Vantagem de Ana: 3 · 60 = 180 m. Faltam 960 m, fechando a 8 m/s: 120 s. Posição = 180 + 3 · 120 = 540 m.',
    ideia='Quando Bia sai, Ana já andou 180 m. A partir daí os dois se aproximam juntos, a 3 + 5 = 8 m/s, e é só ver em quanto tempo somam os 960 m que faltam.',
    pecas=[('Velocidade de aproximação', 'Quando dois andam um contra o outro, a distância entre eles diminui a soma das velocidades.')],
    formulas=[('carro', 'Distância', 'distância = velocidade · tempo'), ('carro', 'Aproximação', 'v de aproximação = v1 + v2')],
    eq='X = d + 3 · t', leitura='posição do encontro = vantagem de Ana + o que ela anda depois',
    letras=[('X', 'distância de P até o encontro (o que a questão quer)'), ('d', 'vantagem de Ana quando Bia sai, em m'), ('t', 'tempo, depois de Bia sair, até se cruzarem, em s')],
    eq_texto='Ana anda a vantagem mais o que corre depois que Bia sai. Os 3 vêm dos 3 m/s dela.\nAgora é só achar d e t.',
    achando=[('Achando d: a vantagem de Ana', 'Ela correu sozinha por 60 s a 3 m/s.\nd = 3 · 60 = 180 m.'),
             ('Achando t: o tempo até se cruzarem', 'Sobram 1 140 − 180 = 960 m entre os dois. Eles se aproximam a 3 + 5 = 8 m/s.\nt = 960 ÷ 8 = 120 s.')],
    volta='X = 180 + 3 · 120 = 540 m.\nLetra C. Conferindo por Bia: 5 · 120 = 600 m, e 540 + 600 = 1 140 m.',
    valores=[('d', '180 m'), ('t', '120 s')],
    pista='"um sai depois do outro" e "se cruzam" → ache a vantagem de quem saiu antes, depois use a soma das velocidades para o tempo do encontro.',
    rec1='1 140 m, 3 m/s, 5 m/s, atraso 60 s', rec3='d = 180 m; t = 120 s',
    checagem=('Pista de 100 m. A parte de P a 2 m/s e, no mesmo instante, B parte de Q a 3 m/s. A que distância de P se cruzam?', ['40 m', '50 m', '60 m', '20 m'], '40 m',
              'Aproximam-se a 5 m/s: 100 ÷ 5 = 20 s. A percorre 2 · 20 = 40 m.'),
))
# d) Harvard-MIT: escada rolante
N = 30 * 1.5; assert N == 90 * 0.5 == 45
Q.append(dict(
    id='d2-escada-fis-ita-cin-00d', tema=T, calc=45,
    enunciado=('Uma escada rolante sobe com velocidade constante. Uma pessoa caminha sobre ela, sempre no mesmo ritmo em relação aos degraus. '
               'Subindo, ela conta 30 degraus. Descendo pela mesma escada, no mesmo ritmo, ela conta 90 degraus. '
               'Com a escada desligada, quantos degraus aparecem de uma vez, do começo ao fim?'),
    dados=[('Subindo', 'conta 30 degraus'), ('Descendo', 'conta 90 degraus'), ('Pessoa', 'mesmo ritmo nas duas')],
    alts=[('30', 30, 'Deu só os degraus que contou subindo'),
          ('45', 45, 'OK'),
          ('52', 52, 'Tirou a raiz de 30 · 90, como uma média qualquer'),
          ('60', 60, 'Fez a média simples de 30 e 90'),
          ('90', 90, 'Deu só os degraus que contou descendo')],
    resumo='r = 0,5; N = 30 · 1,5 = 45 e N = 90 · 0,5 = 45.',
    ideia='Subindo, a escada ajuda e a pessoa pisa em poucos degraus; descendo, atrapalha e ela pisa em muitos. Os dois jeitos têm de dar o mesmo total.',
    pecas=[('Degraus visíveis', 'Quantos degraus existem de uma ponta à outra, com a escada parada.')],
    formulas=[('carro', 'Subindo', 'N = 30 · (1 + r)'), ('carro', 'Descendo', 'N = 90 · (1 − r)')],
    eq='N = 30 · (1 + r) = 90 · (1 − r)', leitura='o mesmo N pelos dois caminhos; r = o quanto a escada anda, comparada com a pessoa',
    letras=[('N', 'degraus visíveis com a escada parada (o que a questão quer)'), ('r', 'velocidade da escada ÷ velocidade da pessoa')],
    eq_texto='Subindo: enquanto a pessoa pisa 30 degraus, a escada traz mais 30 · r. Descendo: a escada leva embora 90 · r. Os dois dão o mesmo N.\nAgora é achar r.',
    achando=[('Achando r: a razão das velocidades', '30 · (1 + r) = 90 · (1 − r)\n30 + 30r = 90 − 90r\n120r = 60\nr = 0,5 (a escada anda a metade do que a pessoa anda).')],
    volta='N = 30 · (1 + 0,5) = 30 · 1,5 = 45 degraus.\nLetra B. Conferindo pelo outro lado: 90 · (1 − 0,5) = 45.',
    valores=[('r', '0,5')],
    pista='"a pessoa conta degraus subindo e descendo" → monte N dos dois jeitos com a razão r das velocidades e iguale.',
    rec1='30 subindo, 90 descendo', rec3='r = 0,5',
    checagem=('Subindo, conta 20 degraus; descendo, 60. Quantos degraus visíveis?', ['30', '40', '35', '45'], '30',
              '20 · (1 + r) = 60 · (1 − r) dá 80r = 40, r = 0,5. N = 20 · 1,5 = 30.'),
))

# ============================ DINÂMICA ============================
T = 'Dinâmica e Leis de Newton'
# a) ENEM: balança no elevador
a = 6 / 5; Nn = 70 * (10 + a); assert abs(a - 1.2) < 1e-9 and abs(Nn - 784) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-din-00a', tema=T, calc=78.4,
    enunciado=('Em um prédio, uma pessoa de 70 kg entra no elevador carregando uma balança de banheiro e a coloca no chão. O elevador parte do repouso, no térreo, '
               'e em 5 s atinge a velocidade de 6 m/s, com aceleração constante nesse intervalo. Depois disso, a velocidade fica constante. '
               'A balança mede a força que a pessoa faz sobre ela e mostra o resultado em kg, como se a gravidade valesse 10 m/s². '
               'Nos primeiros 5 s da subida, o valor mostrado é diferente da massa real da pessoa. Qual é o valor, em kg, mostrado pela balança nesses 5 s?'),
    dados=[('Massa da pessoa', '70 kg'), ('Velocidade ao fim de 5 s', '6 m/s (parte do repouso)'), ('Gravidade da balança', '10 m/s²')],
    alts=[('61,6', 61.6, 'Fez m · (g − a): como se o elevador estivesse descendo'),
          ('70', 70, 'Achou que a balança sempre marca a massa real'),
          ('78,4', 78.4, 'OK'),
          ('84', 84, 'Fez 70 · 1,2, usando só a aceleração'),
          ('784', 784, 'Deu a força em newtons, sem dividir por g')],
    resumo='a = 6 ÷ 5 = 1,2 m/s²; N = 70 · (10 + 1,2) = 784 N; leitura = 784 ÷ 10 = 78,4 kg.',
    ideia='Quando o elevador acelera para cima, o chão empurra a pessoa com o peso mais a força que a faz acelerar. A balança lê essa força total e a mostra como se fosse massa.',
    pecas=[('Leitura da balança', 'A balança mede a força de contato (N) e mostra N ÷ g. Em repouso isso é a massa; acelerando, muda.')],
    formulas=[('carro', 'Aceleração', 'a = variação da velocidade ÷ tempo'), ('caixa', 'Força de contato (subindo)', 'N = m · (g + a)')],
    eq='M = N ÷ g', leitura='leitura em kg = força de contato ÷ g',
    letras=[('M', 'valor mostrado pela balança, em kg (o que a questão quer)'), ('N', 'força de contato da balança, em N'), ('a', 'aceleração do elevador, em m/s²')],
    eq_texto='A balança mostra a força que recebe dividida por g. Essa força depende da aceleração do elevador.\nAgora é só achar a e N.',
    achando=[('Achando a: a aceleração', 'Saiu do repouso e chegou a 6 m/s em 5 s.\na = 6 ÷ 5 = 1,2 m/s².'),
             ('Achando N: a força de contato', 'O chão sustenta o peso e ainda acelera a pessoa para cima: N = m · (g + a).\nN = 70 · (10 + 1,2) = 70 · 11,2 = 784 N.')],
    volta='M = 784 ÷ 10 = 78,4 kg.\nLetra C. A balança marca 8,4 kg a mais, só enquanto o elevador acelera.',
    valores=[('a', '1,2 m/s²'), ('N', '784 N')],
    pista='"balança dentro do elevador" → ache a aceleração; subindo e acelerando, N = m · (g + a); a leitura em kg é N ÷ g.',
    rec1='70 kg, 6 m/s em 5 s, g = 10', rec3='a = 1,2; N = 784 N',
    checagem=('Pessoa de 60 kg em elevador que sobe acelerando a 2 m/s² (g = 10). Quantos kg a balança marca?', ['72 kg', '60 kg', '48 kg', '120 kg'], '72 kg',
              'N = 60 · (10 + 2) = 720 N; 720 ÷ 10 = 72 kg.'),
))
# b) ITA: plano inclinado com atrito
ac = (2 * 10 * 0.6 + 0.5 * 2 * 10 * 0.8) / 2; assert ac == 10 and 144 / (2 * ac) == 7.2
Q.append(dict(
    id='d2-escada-fis-ita-din-00b', tema=T, calc=7.2,
    enunciado=('Um bloco de 2 kg é lançado, da base de um plano inclinado, para cima, com velocidade de 12 m/s. O plano forma com a horizontal um ângulo '
               'cujo seno vale 0,6 e cujo cosseno vale 0,8. O coeficiente de atrito entre o bloco e o plano é 0,5. Adote g = 10 m/s². '
               'A distância que o bloco percorre sobre o plano, subindo, até parar por um instante, em metros, é:'),
    dados=[('Massa', '2 kg'), ('Velocidade inicial', '12 m/s'), ('Seno e cosseno', '0,6 e 0,8'), ('Atrito', '0,5'), ('Gravidade', '10 m/s²')],
    alts=[('4,32', 4.32, 'Deu a altura que ele sobe (7,2 · 0,6), não a distância no plano'),
          ('6,5', 6.5, 'Trocou seno por cosseno: a = 8 + 0,5 · 6 = 11'),
          ('7,2', 7.2, 'OK'),
          ('12', 12, 'Esqueceu o atrito: a = 6 e d = 144 ÷ 12'),
          ('14,4', 14.4, 'Esqueceu o ½ da fórmula: 144 ÷ 10')],
    resumo='Forças contra o movimento: 12 N (peso no plano) + 8 N (atrito) = 20 N; a = 10 m/s²; d = 144 ÷ 20 = 7,2 m.',
    ideia='Subindo, o peso e o atrito puxam o bloco para baixo ao mesmo tempo. Ache a desaceleração com as duas forças e use a fórmula que liga velocidade, aceleração e distância.',
    pecas=[('Força normal', 'A força que o plano faz perpendicular a ele. O atrito é o coeficiente vezes a normal.')],
    formulas=[('carro', 'Distância até parar', 'v² = 2 · a · d (v é a inicial)'), ('caixa', 'Atrito', 'atrito = μ · normal')],
    eq='d = v² ÷ (2 · a)', leitura='distância até parar = velocidade inicial ao quadrado ÷ (2 · desaceleração)',
    letras=[('d', 'distância percorrida no plano, em m (o que a questão quer)'), ('v', 'velocidade inicial, em m/s'), ('a', 'desaceleração do bloco, em m/s²')],
    eq_texto='O bloco para depois de uma distância d. Para achá-la preciso da velocidade inicial e da desaceleração.\nAgora é só achar v e a.',
    achando=[('Achando v: a velocidade inicial', 'O enunciado dá: v = 12 m/s.\nv² = 12 · 12 = 144.'),
             ('Achando a: a desaceleração', 'Peso ao longo do plano: 2 · 10 · 0,6 = 12 N.\nNormal: 2 · 10 · 0,8 = 16 N. Atrito: 0,5 · 16 = 8 N.\nOs dois puxam para baixo: 12 + 8 = 20 N.\na = 20 ÷ 2 = 10 m/s².')],
    volta='d = 144 ÷ (2 · 10) = 144 ÷ 20 = 7,2 m.\nLetra C.',
    valores=[('v', '12 m/s'), ('a', '10 m/s²')],
    pista='"lançado plano acima com atrito" → some peso no plano e atrito para achar a desaceleração; depois d = v² ÷ (2a).',
    rec1='2 kg, 12 m/s, 0,6 e 0,8, atrito 0,5', rec3='v² = 144; a = 10 m/s²',
    checagem=('Sem atrito, o mesmo bloco (seno 0,6, v = 12 m/s, g = 10) sobe quanto no plano?', ['12 m', '7,2 m', '14,4 m', '24 m'], '12 m',
              'a = 10 · 0,6 = 6 m/s². d = 144 ÷ 12 = 12 m.'),
))
# c) Fuvest: blocos ligados por fio
aa = 20 / 5; assert aa == 4 and 3 * aa == 12 and 20 - 12 == 2 * aa
Q.append(dict(
    id='d2-escada-fis-ita-din-00c', tema=T, calc=12,
    enunciado=('Um bloco A, de 3 kg, está sobre uma mesa horizontal sem atrito. Um fio ideal liga A a um bloco B, de 2 kg, que fica pendurado fora da mesa, '
               'passando por uma polia ideal presa na borda. O sistema é solto do repouso e os blocos se movem juntos. Adote g = 10 m/s². '
               'A força de tração no fio, em newtons, é:'),
    dados=[('Bloco A (na mesa)', '3 kg'), ('Bloco B (pendurado)', '2 kg'), ('Atrito', 'nenhum'), ('Gravidade', '10 m/s²')],
    alts=[('6', 6, 'Dividiu 12 por 2, pensando nas duas pontas do fio'),
          ('8', 8, 'Fez 2 · 4, que é a força resultante em B, não a tração'),
          ('12', 12, 'OK'),
          ('20', 20, 'Deu o peso de B, como se B não acelerasse'),
          ('30', 30, 'Deu o peso de A')],
    resumo='a = 20 ÷ 5 = 4 m/s²; tração em A: T = 3 · 4 = 12 N (em B: 20 − 12 = 8 = 2 · 4).',
    ideia='O peso de B acelera os dois blocos juntos. O fio é a única força horizontal sobre A, então a tração é a massa de A vezes a aceleração do sistema.',
    pecas=[('Tração', 'A força que o fio faz nos blocos que ele liga.')],
    formulas=[('caixa', '2ª lei de Newton', 'força = massa · aceleração'), ('caixa', 'Peso', 'P = m · g')],
    eq='T = m · a', leitura='tração = massa de A · aceleração do sistema',
    letras=[('T', 'tração no fio, em N (o que a questão quer)'), ('m', 'massa de A, em kg'), ('a', 'aceleração dos blocos, em m/s²')],
    eq_texto='Em A, a única força na horizontal é a tração. Então T = m · a, com a massa de A.\nAgora é só achar m e a.',
    achando=[('Achando m: a massa de A', 'A tração age no bloco A, que tem 3 kg.\nm = 3 kg.'),
             ('Achando a: a aceleração', 'Os dois blocos andam juntos. A força que acelera tudo é o peso de B: 2 · 10 = 20 N.\nMassa total: 3 + 2 = 5 kg.\na = 20 ÷ 5 = 4 m/s².')],
    volta='T = 3 · 4 = 12 N.\nLetra C. Conferindo em B: peso 20 − tração 12 = 8 N, e 2 · 4 = 8 N.',
    valores=[('m', '3 kg'), ('a', '4 m/s²')],
    pista='"dois blocos ligados por fio e polia" → a força que move tudo é o peso do que pende; ache a, depois a tração em um dos blocos.',
    rec1='A 3 kg, B 2 kg, sem atrito', rec3='m = 3 kg; a = 4 m/s²',
    checagem=('A de 1 kg na mesa, B de 1 kg pendurado, sem atrito, g = 10. Qual a tração?', ['5 N', '10 N', '2,5 N', '20 N'], '5 N',
              'a = 10 ÷ 2 = 5 m/s². T = 1 · 5 = 5 N.'),
))
# d) Harvard-MIT: pêndulo
v2 = 2 * 10 * 1.25; Cc = 2 * v2 / 1.25; assert v2 == 25 and Cc == 40 and 20 + Cc == 60 == 3 * 2 * 10
Q.append(dict(
    id='d2-escada-fis-ita-din-00d', tema=T, calc=60,
    enunciado=('Uma esfera de 2 kg está presa a um fio ideal de 1,25 m de comprimento e é solta do repouso com o fio esticado na horizontal. '
               'Despreze a resistência do ar e adote g = 10 m/s². Ao passar pelo ponto mais baixo da trajetória, qual é a tração no fio, em newtons?'),
    dados=[('Massa', '2 kg'), ('Fio', '1,25 m'), ('Saída', 'repouso, fio na horizontal'), ('Gravidade', '10 m/s²')],
    alts=[('20', 20, 'Deu só o peso, como se a esfera estivesse parada'),
          ('30', 30, 'Somou o peso com metade dele'),
          ('40', 40, 'Deu só a força do movimento circular, sem o peso'),
          ('60', 60, 'OK'),
          ('70', 70, 'Fez m · v² = 50, sem dividir pelo comprimento do fio')],
    resumo='Peso 20 N; v² = 2 · 10 · 1,25 = 25; C = 2 · 25 ÷ 1,25 = 40 N; T = 20 + 40 = 60 N (3 vezes o peso).',
    ideia='No ponto mais baixo, o fio sustenta o peso e ainda curva a trajetória. A velocidade ali vem da energia: a esfera trocou a altura do fio por velocidade.',
    pecas=[('Força centrípeta', 'A parte da força que faz o corpo curvar: m · v² ÷ raio. Aqui o raio é o comprimento do fio.')],
    formulas=[('caixa', 'Peso', 'P = m · g'), ('caixa', 'Energia na descida', 'v² = 2 · g · L'), ('caixa', 'Força centrípeta', 'C = m · v² ÷ L')],
    eq='T = P + C', leitura='tração = peso + força que curva a trajetória',
    letras=[('T', 'tração no fio no ponto mais baixo, em N (o que a questão quer)'), ('P', 'peso da esfera, em N'), ('C', 'força centrípeta, em N')],
    eq_texto='Embaixo, o fio puxa para cima e o peso puxa para baixo; a diferença é a força que curva. Então T = P + C.\nAgora é só achar P e C.',
    achando=[('Achando P: o peso', 'P = m · g = 2 · 10 = 20 N.'),
             ('Achando C: a força que curva', 'Primeiro a velocidade: ela desceu 1,25 m, então v² = 2 · g · L = 2 · 10 · 1,25 = 25 (v = 5 m/s).\nC = m · v² ÷ L = 2 · 25 ÷ 1,25 = 50 ÷ 1,25 = 40 N.')],
    volta='T = 20 + 40 = 60 N.\nLetra D. É exatamente 3 vezes o peso, e isso vale para qualquer fio solto da horizontal.',
    valores=[('P', '20 N'), ('C', '40 N')],
    pista='"pêndulo no ponto mais baixo" → tração = peso + m · v² ÷ L, com v² vindo da energia (2 · g · altura descida).',
    rec1='2 kg, fio 1,25 m, solta da horizontal', rec3='P = 20 N; C = 40 N',
    checagem=('Esfera de 1 kg, fio de 0,8 m, solta da horizontal (g = 10). Qual a tração embaixo?', ['30 N', '10 N', '20 N', '40 N'], '30 N',
              'v² = 2 · 10 · 0,8 = 16; C = 1 · 16 ÷ 0,8 = 20 N; T = 10 + 20 = 30 N.'),
))

# ============================ TERMODINÂMICA ============================
T = 'Termodinâmica e Calor'
# a) ENEM: mistura para o banho
Qq = 40 * 18 / 50; assert abs(Qq - 14.4) < 1e-9 and abs(Qq * 32 - (40 - Qq) * 18) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-ter-00a', tema=T, calc=14.4,
    enunciado=('Para um banho, uma família enche uma banheira de 40 L misturando água quente do aquecedor, a 70 °C, com água fria da torneira, a 20 °C. '
               'Eles querem a mistura a 38 °C. Despreze a troca de calor com a banheira e com o ar, e lembre que 1 L de água tem massa de 1 kg e que o calor '
               'específico é o mesmo para toda a água. Quantos litros de água quente devem ser colocados na banheira?'),
    dados=[('Banheira', '40 L'), ('Água quente', '70 °C'), ('Água fria', '20 °C'), ('Mistura desejada', '38 °C')],
    alts=[('14,4', 14.4, 'OK'),
          ('18', 18, 'Deu a diferença 38 − 20, que é uma temperatura, não litros'),
          ('20', 20, 'Dividiu 40 L ao meio, sem olhar as temperaturas'),
          ('25,6', 25.6, 'Trocou as razões e achou a água fria no lugar da quente'),
          ('32', 32, 'Deu a diferença 70 − 38, que é uma temperatura, não litros')],
    resumo='Q · (70 − 38) = F · (38 − 20) e F = 40 − Q: 32Q = 720 − 18Q, 50Q = 720, Q = 14,4 L.',
    ideia='Na mistura, o calor que a água quente perde é igual ao que a fria ganha. Como o calor específico é o mesmo, sobram só litros vezes variação de temperatura.',
    pecas=[('Equilíbrio térmico', 'Quando a mistura chega a uma temperatura só: o que um lado cedeu o outro recebeu.')],
    formulas=[('termometro', 'Calor trocado', 'Q = m · c · variação da temperatura'), ('termometro', 'Equilíbrio', 'calor cedido = calor recebido')],
    eq='Q · 32 = F · 18', leitura='litros quentes · queda (70 − 38) = litros frios · subida (38 − 20)',
    letras=[('Q', 'litros de água quente (o que a questão quer)'), ('F', 'litros de água fria')],
    eq_texto='A quente cai de 70 para 38 (32 graus) e a fria sobe de 20 para 38 (18 graus). O calor cedido é igual ao recebido, e c e a massa por litro se cancelam.\nAgora é só achar F.',
    achando=[('Achando F: os litros de água fria', 'A banheira tem 40 L no total: F = 40 − Q.\nSubstituindo na equação: Q · 32 = (40 − Q) · 18.')],
    volta='32Q = 720 − 18Q, então 50Q = 720 e Q = 14,4 L.\nLetra A. Então F = 40 − 14,4 = 25,6 L. Conferindo: 14,4 · 32 = 460,8 e 25,6 · 18 = 460,8.',
    valores=[('F', '40 − Q = 25,6 L')],
    pista='"misturar água quente e fria" → calor cedido = calor recebido; com mesmo c, litros · variação de temperatura dos dois lados.',
    rec1='40 L, 70 °C, 20 °C, quer 38 °C', rec3='F = 40 − Q',
    checagem=('Misturam-se 10 L de água a 80 °C com 30 L a 20 °C. Qual a temperatura final?', ['35 °C', '50 °C', '40 °C', '30 °C'], '35 °C',
              '(10 · 80 + 30 · 20) ÷ 40 = (800 + 600) ÷ 40 = 35 °C.'),
))
# b) ITA: gás isobárico
W = 2e5 * 2e-3; dU = 1.5 * W; assert W == 400 and dU == 600 and W + dU == 1000
Q.append(dict(
    id='d2-escada-fis-ita-ter-00b', tema=T, calc=1000,
    enunciado=('Um gás ideal monoatômico, a pressão constante de 2,0 × 10⁵ Pa, tem seu volume aumentado de 3,0 L para 5,0 L. '
               'Considere 1 L = 10⁻³ m³ e que a energia interna desse gás vale U = (3/2) · n · R · T. '
               'O calor recebido pelo gás nesse processo, em joules, é:'),
    dados=[('Pressão', '2,0 × 10⁵ Pa (constante)'), ('Volume', '3,0 L para 5,0 L'), ('Energia interna', 'U = (3/2) · n · R · T')],
    alts=[('400', 400, 'Deu só o trabalho, esquecendo a energia interna'),
          ('600', 600, 'Deu só a variação da energia interna, esquecendo o trabalho'),
          ('1 000', 1000, 'OK'),
          ('1 500', 1500, 'Usou a energia interna final inteira em vez da variação'),
          ('1 900', 1900, 'Somou o trabalho com a energia interna final inteira')],
    resumo='W = 2 · 10⁵ · 2 · 10⁻³ = 400 J; ΔU = (3/2) · 400 = 600 J; Q = 400 + 600 = 1 000 J.',
    ideia='O calor recebido vira trabalho (o gás empurra o ambiente) e aumento de energia interna. Como p · V = n · R · T, a variação de U sai direto de p · ΔV.',
    pecas=[('Processo isobárico', 'A pressão não muda durante a expansão. O trabalho é pressão vezes variação de volume.')],
    formulas=[('termometro', 'Primeira lei', 'Q = W + ΔU'), ('termometro', 'Trabalho a pressão constante', 'W = p · ΔV'), ('termometro', 'Gás ideal', 'p · V = n · R · T')],
    eq='Q = W + U', leitura='calor recebido = trabalho feito + aumento da energia interna',
    letras=[('Q', 'calor recebido, em J (o que a questão quer)'), ('W', 'trabalho do gás, em J'), ('U', 'variação da energia interna, em J')],
    eq_texto='Pela primeira lei da termodinâmica, o calor se divide em trabalho e energia interna.\nAgora é só achar W e U.',
    achando=[('Achando W: o trabalho', 'ΔV = 5 − 3 = 2 L = 2 · 10⁻³ m³.\nW = p · ΔV = 2 · 10⁵ · 2 · 10⁻³ = 400 J.'),
             ('Achando U: a energia interna', 'U = (3/2) · n · R · T e p · V = n · R · T, então ΔU = (3/2) · p · ΔV.\nΔU = 1,5 · 400 = 600 J.')],
    volta='Q = 400 + 600 = 1 000 J.\nLetra C.',
    valores=[('W', '400 J'), ('U', '600 J')],
    pista='"gás ideal monoatômico a pressão constante" → W = p · ΔV, ΔU = (3/2) · p · ΔV, e o calor é a soma dos dois.',
    rec1='2 · 10⁵ Pa, 3 L para 5 L', rec3='W = 400 J; U = 600 J',
    checagem=('Gás monoatômico a 1 · 10⁵ Pa expande de 2 L para 4 L. Qual o calor recebido?', ['500 J', '200 J', '300 J', '800 J'], '500 J',
              'W = 10⁵ · 2 · 10⁻³ = 200 J; ΔU = 1,5 · 200 = 300 J; Q = 500 J.'),
))
# c) Fuvest: gelo + potência
cal = 200 * 0.5 * 10 + 200 * 80 + 200 * 20; assert cal == 21000 and cal * 4 / 700 == 120
Q.append(dict(
    id='d2-escada-fis-ita-ter-00c', tema=T, calc=120,
    enunciado=('Um bloco de 200 g de gelo, inicialmente a −10 °C, é aquecido por uma resistência de potência constante de 700 W, que transfere toda a potência para o gelo, '
               'até que ele se transforme em água a 20 °C. Considere o calor específico do gelo 0,5 cal/(g · °C), o da água 1 cal/(g · °C), '
               'o calor latente de fusão do gelo 80 cal/g e 1 cal = 4 J. O tempo necessário, em segundos, é:'),
    dados=[('Gelo', '200 g a −10 °C'), ('Potência', '700 W'), ('Chegada', 'água a 20 °C'), ('Calores', 'gelo 0,5; água 1; fusão 80 cal/g'), ('Conversão', '1 cal = 4 J')],
    alts=[('29', 29, 'Esqueceu o calor da fusão (só 5 000 cal)'),
          ('30', 30, 'Dividiu as calorias por 700 sem converter em joules'),
          ('114', 114, 'Esqueceu de aquecer o gelo de −10 °C a 0 °C'),
          ('120', 120, 'OK'),
          ('126', 126, 'Usou 4,2 J por caloria, em vez do 4 do enunciado')],
    resumo='Q = 1 000 + 16 000 + 4 000 = 21 000 cal = 84 000 J; t = 84 000 ÷ 700 = 120 s.',
    ideia='São três etapas de calor: esquentar o gelo até 0 °C, derreter, esquentar a água até 20 °C. Soma tudo, passa para joules e divide pela potência.',
    pecas=[('Calor latente', 'Calor que o gelo precisa para virar água sem mudar de temperatura: 80 cal por grama.')],
    formulas=[('termometro', 'Calor sensível', 'Q = m · c · variação da temperatura'), ('termometro', 'Fusão', 'Q = m · L'), ('circuito', 'Potência', 'tempo = energia ÷ potência')],
    eq='t = Q ÷ P', leitura='tempo = calor total em joules ÷ potência',
    letras=[('t', 'tempo, em s (o que a questão quer)'), ('Q', 'calor total, em J'), ('P', 'potência da resistência, em W')],
    eq_texto='A resistência entrega 700 joules por segundo. O tempo é o calor total dividido por isso.\nAgora é só achar Q e P.',
    achando=[('Achando Q: o calor total', 'Gelo de −10 a 0 °C: 200 · 0,5 · 10 = 1 000 cal.\nFusão: 200 · 80 = 16 000 cal.\nÁgua de 0 a 20 °C: 200 · 1 · 20 = 4 000 cal.\nTotal: 21 000 cal = 21 000 · 4 = 84 000 J.'),
             ('Achando P: a potência', '700 W são 700 J por segundo.\nP = 700 J/s.')],
    volta='t = 84 000 ÷ 700 = 120 s.\nLetra D.',
    valores=[('Q', '84 000 J'), ('P', '700 W')],
    pista='"gelo vira água a tal temperatura com aquecedor" → some as 3 etapas (gelo, fusão, água), converta em J e divida pela potência.',
    rec1='200 g, −10 °C a 20 °C, 700 W', rec3='Q = 84 000 J; P = 700 W',
    checagem=('100 g de água sobem de 20 °C a 100 °C com aquecedor de 800 W (1 cal = 4 J, c = 1). Quanto tempo?', ['40 s', '10 s', '80 s', '8 s'], '40 s',
              'Q = 100 · 1 · 80 = 8 000 cal = 32 000 J; 32 000 ÷ 800 = 40 s.'),
))
# d) Harvard-MIT: condução em série
Tj = (300 * 100 + 100 * 0) / 400; assert Tj == 75 and 300 * (100 - Tj) == 100 * Tj
Q.append(dict(
    id='d2-escada-fis-ita-ter-00d', tema=T, calc=75,
    enunciado=('Duas barras de mesma seção e mesmo comprimento estão encostadas pelas pontas e formam uma barra só. A ponta livre da barra A é mantida a 100 °C e a ponta livre '
               'da barra B é mantida a 0 °C. O calor flui só ao longo das barras e, depois de um tempo, a situação fica estável: passa por A o mesmo calor, por segundo, que passa por B. '
               'A condutividade térmica de A vale 300 W/(m · K) e a de B vale 100 W/(m · K). Qual a temperatura, em °C, na junção das barras?'),
    dados=[('Ponta de A', '100 °C'), ('Ponta de B', '0 °C'), ('Condutividade de A', '300'), ('Condutividade de B', '100'), ('Barras', 'mesmo comprimento e seção')],
    alts=[('0,75', 0.75, 'Achou a fração 300 ÷ 400 e esqueceu de multiplicar por 100'),
          ('25', 25, 'Inverteu as condutividades'),
          ('50', 50, 'Fez a média simples das pontas'),
          ('75', 75, 'OK'),
          ('100', 100, 'Deu a temperatura da ponta de A')],
    resumo='300 · (100 − T) = 100 · T; 30 000 = 400T; T = 75 °C. Conferindo: 300 · 25 = 7 500 = 100 · 75.',
    ideia='Em regime estável, o calor por segundo é igual nas duas barras. A barra que conduz melhor precisa de uma diferença de temperatura menor para passar o mesmo calor.',
    pecas=[('Regime estável', 'Quando as temperaturas param de mudar: o calor que entra num trecho é igual ao que sai.')],
    formulas=[('termometro', 'Fluxo de calor', 'fluxo = k · diferença de temperatura ÷ comprimento')],
    eq='A · (100 − T) = B · (T − 0)', leitura='fluxo em A = fluxo em B (mesmo comprimento e seção)',
    letras=[('T', 'temperatura da junção, em °C (o que a questão quer)'), ('A', 'condutividade de A'), ('B', 'condutividade de B')],
    eq_texto='Como as barras têm o mesmo comprimento e a mesma seção, o fluxo só depende da condutividade e da diferença de temperatura de cada barra.\nAgora é só achar A e B.',
    achando=[('Achando A: a condutividade de A', 'O enunciado dá: A = 300.'),
             ('Achando B: a condutividade de B', 'O enunciado dá: B = 100.')],
    volta='300 · (100 − T) = 100 · T\n30 000 − 300T = 100T\n30 000 = 400T, então T = 75 °C.\nLetra D. Conferindo: 300 · 25 = 7 500 e 100 · 75 = 7 500.',
    valores=[('A', '300'), ('B', '100')],
    pista='"duas barras em série, regime estável" → fluxo igual: condutividade · diferença de temperatura em cada barra.',
    rec1='100 °C, 0 °C, A = 300, B = 100', rec3='A = 300; B = 100',
    checagem=('A (k = 200) a 90 °C encosta em B (k = 100) a 0 °C, mesmas medidas. Temperatura da junção?', ['60 °C', '45 °C', '30 °C', '70 °C'], '60 °C',
              '200 · (90 − T) = 100 · T dá 18 000 = 300T, T = 60 °C.'),
))

# ============================ ONDAS E ACÚSTICA ============================
T = 'Ondas e Acústica'
# a) ENEM: sonar com dois ecos
Dd = 1500 * (0.8 - 0.2) / 2; assert abs(Dd - 450) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-ond-00a', tema=T, calc=450,
    enunciado=('Um barco de pesquisa usa um sonar, aparelho que emite pulsos de ultrassom na água e mede o tempo que cada eco leva para voltar. '
               'Em um ponto do lago, o sonar registra dois ecos de um mesmo pulso: o primeiro, vindo de um cardume, chega 0,2 s depois da emissão, '
               'e o segundo, vindo do fundo do lago, chega 0,8 s depois da emissão. A velocidade do som na água é de 1 500 m/s, e o pulso vai e volta '
               'pelo mesmo caminho vertical. A distância, em metros, entre o cardume e o fundo do lago é:'),
    dados=[('Eco do cardume', '0,2 s'), ('Eco do fundo', '0,8 s'), ('Som na água', '1 500 m/s')],
    alts=[('150', 150, 'Deu a profundidade do cardume (1 500 · 0,2 ÷ 2)'),
          ('300', 300, 'Fez 1 500 · 0,2, sem dividir por 2 e só com o cardume'),
          ('450', 450, 'OK'),
          ('600', 600, 'Deu a profundidade do fundo (1 500 · 0,8 ÷ 2)'),
          ('900', 900, 'Esqueceu de dividir por 2: o som vai e volta')],
    resumo='Intervalo entre ecos = 0,8 − 0,2 = 0,6 s; D = 1 500 · 0,6 ÷ 2 = 450 m.',
    ideia='O som faz o caminho de ida e volta, então cada eco carrega o dobro da distância. A diferença entre os dois ecos corresponde ao dobro da distância entre cardume e fundo.',
    pecas=[('Eco', 'Som que bate num obstáculo e volta. O tempo medido é de ida e volta.')],
    formulas=[('onda', 'Distância percorrida', 'distância = velocidade · tempo'), ('onda', 'Ida e volta', 'distância até o alvo = percurso ÷ 2')],
    eq='D = v · t ÷ 2', leitura='distância entre os dois = velocidade · intervalo entre os ecos ÷ 2',
    letras=[('D', 'distância entre cardume e fundo, em m (o que a questão quer)'), ('v', 'velocidade do som na água, em m/s'), ('t', 'intervalo entre os dois ecos, em s')],
    eq_texto='O intervalo entre os ecos é o tempo extra de ida e volta até o fundo. Por isso divido por 2.\nAgora é só achar v e t.',
    achando=[('Achando v: a velocidade do som', 'O enunciado dá: v = 1 500 m/s.'),
             ('Achando t: o intervalo entre os ecos', 'O fundo respondeu em 0,8 s e o cardume em 0,2 s.\nt = 0,8 − 0,2 = 0,6 s.')],
    volta='D = 1 500 · 0,6 ÷ 2 = 900 ÷ 2 = 450 m.\nLetra C.',
    valores=[('v', '1 500 m/s'), ('t', '0,6 s')],
    pista='"sonar" ou "eco" → o tempo é de ida e volta, então divida por 2; com dois ecos, use a diferença entre os tempos.',
    rec1='ecos 0,2 s e 0,8 s, v = 1 500', rec3='v = 1 500 m/s; t = 0,6 s',
    checagem=('O eco do fundo volta em 0,4 s e o som vale 1 500 m/s. Qual a profundidade?', ['300 m', '600 m', '150 m', '750 m'], '300 m',
              '1 500 · 0,4 = 600 m de ida e volta; metade: 300 m.'),
))
# b) ITA: Doppler
Fo = 640 * 340 / (340 - 72 / 3.6); assert Fo == 680
Q.append(dict(
    id='d2-escada-fis-ita-ond-00b', tema=T, calc=680,
    enunciado=('Uma ambulância com a sirene ligada emite um som de frequência 640 Hz e se aproxima, a 72 km/h, de um pedestre parado na calçada. '
               'A velocidade do som no ar é de 340 m/s. A frequência, em Hz, ouvida pelo pedestre é:'),
    dados=[('Frequência emitida', '640 Hz'), ('Ambulância', '72 km/h, aproximando'), ('Som no ar', '340 m/s'), ('Pedestre', 'parado')],
    alts=[('604,4', 604.4, 'Calculou como se a ambulância se afastasse (340 ÷ 360)'),
          ('640', 640, 'Achou que o pedestre ouve a frequência emitida'),
          ('660', 660, 'Somou 20 m/s a 640 Hz, misturando velocidade com frequência'),
          ('677,6', 677.6, 'Inverteu o sinal: 640 · 360 ÷ 340'),
          ('680', 680, 'OK')],
    resumo='72 km/h = 20 m/s; O = 640 · 340 ÷ (340 − 20) = 217 600 ÷ 320 = 680 Hz.',
    ideia='Quando a fonte se aproxima, ela "alcança" as próprias ondas, que chegam mais juntas ao ouvinte, e a frequência ouvida sobe. O fator é a velocidade do som dividida por (velocidade do som menos a da fonte).',
    pecas=[('Efeito Doppler', 'Mudança da frequência ouvida quando a fonte e o ouvinte se aproximam ou se afastam.')],
    formulas=[('onda', 'Doppler (fonte se aproxima)', 'O = E · V ÷ (V − A)'), ('carro', 'km/h para m/s', 'm/s = km/h ÷ 3,6')],
    eq='O = E · V ÷ (V − A)', leitura='frequência ouvida = emitida · som ÷ (som − ambulância)',
    letras=[('O', 'frequência ouvida, em Hz (o que a questão quer)'), ('E', 'frequência emitida, em Hz'), ('V', 'velocidade do som, em m/s'), ('A', 'velocidade da ambulância, em m/s')],
    eq_texto='O ouvinte parado ouve a frequência emitida multiplicada por um fator maior que 1, porque a fonte vem na direção dele.\nAgora é só achar E, V e A.',
    achando=[('Achando E: a frequência emitida', 'O enunciado dá: E = 640 Hz.'),
             ('Achando V: a velocidade do som', 'O enunciado dá: V = 340 m/s.'),
             ('Achando A: a velocidade da ambulância', 'A velocidade está em km/h e o som em m/s: converta.\nA = 72 ÷ 3,6 = 20 m/s.')],
    volta='O = 640 · 340 ÷ (340 − 20) = 640 · 340 ÷ 320 = 217 600 ÷ 320 = 680 Hz.\nLetra E.',
    valores=[('E', '640 Hz'), ('V', '340 m/s'), ('A', '20 m/s')],
    pista='"fonte sonora em movimento" → converta a velocidade para m/s; se aproxima, divide por (V − A); se afasta, por (V + A).',
    rec1='640 Hz, 72 km/h, 340 m/s', rec3='E = 640; V = 340; A = 20 m/s',
    checagem=('Fonte de 320 Hz se aproxima a 20 m/s de um ouvinte parado (som a 340 m/s). Qual a frequência ouvida?', ['340 Hz', '320 Hz', '300 Hz', '360 Hz'], '340 Hz',
              '320 · 340 ÷ (340 − 20) = 320 · 340 ÷ 320 = 340 Hz.'),
))
# c) Fuvest: tubo fechado com temperatura
v = 331 + 0.6 * 35; f = v / (4 * 0.88); assert abs(v - 352) < 1e-9 and abs(f - 100) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-ond-00c', tema=T, calc=100,
    enunciado=('Um tubo sonoro, fechado em uma das pontas e aberto na outra, mede 0,88 m de comprimento. O ar dentro dele está a 35 °C e, nessa faixa de temperatura, '
               'a velocidade do som no ar vale 331 + 0,6 · T, em m/s, com T em °C. A frequência do modo fundamental desse tubo, em hertz, é:'),
    dados=[('Comprimento', '0,88 m (uma ponta fechada)'), ('Temperatura', '35 °C'), ('Som no ar', '331 + 0,6 · T m/s')],
    alts=[('97', 97, 'Usou 340 m/s, sem corrigir pela temperatura'),
          ('100', 100, 'OK'),
          ('200', 200, 'Tratou como tubo aberto: v ÷ (2 · L)'),
          ('300', 300, 'Deu o terceiro harmônico, não o fundamental'),
          ('400', 400, 'Fez v ÷ L, sem o fator 4')],
    resumo='v = 331 + 0,6 · 35 = 352 m/s; f = 352 ÷ (4 · 0,88) = 352 ÷ 3,52 = 100 Hz.',
    ideia='No tubo fechado, o modo fundamental cabe um quarto de onda no tubo: o comprimento de onda é 4 · L. Antes, é preciso achar a velocidade do som na temperatura do ar do tubo.',
    pecas=[('Modo fundamental', 'A menor frequência com que o tubo pode ressoar.')],
    formulas=[('onda', 'Tubo fechado, fundamental', 'f = v ÷ (4 · L)'), ('onda', 'Som e temperatura', 'v = 331 + 0,6 · T')],
    eq='f = v ÷ (4 · L)', leitura='frequência do fundamental = velocidade do som ÷ (4 · comprimento)',
    letras=[('f', 'frequência fundamental, em Hz (o que a questão quer)'), ('v', 'velocidade do som a 35 °C, em m/s'), ('L', 'comprimento do tubo, em m')],
    eq_texto='Tubo fechado numa ponta tem um nó na ponta fechada e um ventre na aberta: cabe 1/4 de onda. Por isso o 4 na equação.\nAgora é só achar v e L.',
    achando=[('Achando v: a velocidade do som a 35 °C', 'v = 331 + 0,6 · 35 = 331 + 21 = 352 m/s.'),
             ('Achando L: o comprimento', 'O enunciado dá: L = 0,88 m.\n4 · L = 4 · 0,88 = 3,52 m.')],
    volta='f = 352 ÷ 3,52 = 100 Hz.\nLetra B.',
    valores=[('v', '352 m/s'), ('L', '0,88 m')],
    pista='"tubo fechado numa ponta" → fundamental com 4 · L; se a temperatura aparece, corrija a velocidade do som antes.',
    rec1='0,88 m fechado, 35 °C', rec3='v = 352 m/s; 4L = 3,52 m',
    checagem=('Tubo fechado de 0,5 m, som a 340 m/s. Qual a frequência fundamental?', ['170 Hz', '340 Hz', '85 Hz', '680 Hz'], '170 Hz',
              'f = 340 ÷ (4 · 0,5) = 340 ÷ 2 = 170 Hz.'),
))
# d) Harvard-MIT: corda com harmônicos consecutivos
f1 = 400 - 300; vv = 2 * 1.5 * f1; assert f1 == 100 and vv == 300
Q.append(dict(
    id='d2-escada-fis-ita-ond-00d', tema=T, calc=300,
    enunciado=('Uma corda de 1,5 m, presa nas duas pontas, vibra formando ondas estacionárias. Dois modos de vibração consecutivos, um logo depois do outro, '
               'sem nenhum modo no meio, têm frequências de 300 Hz e 400 Hz. A velocidade de propagação da onda nessa corda, em m/s, é:'),
    dados=[('Corda', '1,5 m, presa nas duas pontas'), ('Modos consecutivos', '300 Hz e 400 Hz')],
    alts=[('150', 150, 'Fez L · f1, esquecendo o 2'),
          ('300', 300, 'OK'),
          ('450', 450, 'Usou 300 como fundamental e esqueceu o 2'),
          ('900', 900, 'Usou 300 Hz como se fosse o fundamental'),
          ('1 200', 1200, 'Usou 400 Hz como se fosse o fundamental')],
    resumo='Os modos são f, 2f, 3f...: 300 = 3f e 400 = 4f, então f = 100 Hz. v = 2 · 1,5 · 100 = 300 m/s.',
    ideia='Numa corda presa nas duas pontas, as frequências possíveis são f, 2f, 3f, 4f... Dois modos seguidos diferem exatamente de f, a frequência fundamental.',
    pecas=[('Modos consecutivos', 'Dois modos de vibração um depois do outro: suas frequências diferem de uma vez a fundamental.')],
    formulas=[('onda', 'Corda presa nas pontas', 'v = 2 · L · f (f = fundamental)')],
    eq='v = 2 · L · f', leitura='velocidade = 2 · comprimento da corda · frequência fundamental',
    letras=[('v', 'velocidade da onda, em m/s (o que a questão quer)'), ('L', 'comprimento da corda, em m'), ('f', 'frequência fundamental, em Hz')],
    eq_texto='O fundamental tem meio comprimento de onda na corda, então o comprimento de onda é 2 · L e v = 2 · L · f.\nAgora é só achar L e f.',
    achando=[('Achando L: o comprimento', 'O enunciado dá: L = 1,5 m.'),
             ('Achando f: a frequência fundamental', 'As frequências possíveis são f, 2f, 3f, 4f... Dois modos seguidos são n · f e (n + 1) · f.\nA diferença entre eles é f: f = 400 − 300 = 100 Hz (300 é o 3º modo e 400 o 4º).')],
    volta='v = 2 · 1,5 · 100 = 300 m/s.\nLetra B.',
    valores=[('L', '1,5 m'), ('f', '100 Hz')],
    pista='"modos consecutivos de uma corda" → a diferença entre as duas frequências é a fundamental; depois v = 2 · L · f.',
    rec1='1,5 m, 300 Hz e 400 Hz', rec3='L = 1,5 m; f = 100 Hz',
    checagem=('Corda de 1 m com modos consecutivos de 200 Hz e 300 Hz. Qual a velocidade da onda?', ['200 m/s', '100 m/s', '400 m/s', '300 m/s'], '200 m/s',
              'f = 300 − 200 = 100 Hz; v = 2 · 1 · 100 = 200 m/s.'),
))

# ============================ ÓPTICA ============================
T = 'Óptica'
# a) ENEM: projetor de slides
pl = 1 / (1 / 20 - 1 / 30); A = pl / 30; assert abs(pl - 60) < 1e-9 and abs(A * 5 - 10) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-opt-00a', tema=T, calc=10,
    enunciado=('Um projetor antigo de slides usa uma lente delgada convergente de distância focal 20 cm. O slide, que tem uma figura de 5 cm de altura, '
               'é colocado a 30 cm da lente, e a imagem se forma, nítida, na parede da sala. O professor quer saber o tamanho da figura que a plateia vai ver. '
               'Qual é a altura da imagem projetada na parede, em centímetros?'),
    dados=[('Distância focal', '20 cm'), ('Altura do slide', '5 cm'), ('Slide até a lente', '30 cm')],
    alts=[('3,3', 3.3, 'Usou o aumento f ÷ p = 20 ÷ 30, em vez de p\' ÷ p'),
          ('7,5', 7.5, 'Usou o aumento p ÷ f = 30 ÷ 20'),
          ('10', 10, 'OK'),
          ('30', 30, 'Deu a distância do slide, não a altura da imagem'),
          ('60', 60, 'Deu a distância da imagem à lente, não a altura')],
    resumo="1/p' = 1/20 − 1/30 = 1/60, p' = 60 cm; aumento = 60 ÷ 30 = 2; imagem = 2 · 5 = 10 cm.",
    ideia='A lente forma a imagem a uma distância que se acha pela equação da lente. O aumento é a razão entre a distância da imagem e a do objeto, e multiplica a altura do slide.',
    pecas=[('Aumento', 'Quantas vezes a imagem é maior que o objeto: distância da imagem ÷ distância do objeto.')],
    formulas=[('lente', 'Equação da lente', "1/f = 1/p + 1/p'"), ('lente', 'Aumento', "A = p' ÷ p")],
    eq='i = A · o', leitura='altura da imagem = aumento · altura do slide',
    letras=[('i', 'altura da imagem, em cm (o que a questão quer)'), ('A', 'aumento (quantas vezes aumenta)'), ('o', 'altura do slide, em cm')],
    eq_texto='A imagem é o slide multiplicado pelo aumento da lente.\nAgora é só achar o e A.',
    achando=[('Achando o: a altura do slide', 'O enunciado dá: o = 5 cm.'),
             ('Achando A: o aumento', "Primeiro onde a imagem se forma: 1/p' = 1/f − 1/p = 1/20 − 1/30 = 3/60 − 2/60 = 1/60. Então p' = 60 cm.\nA = p' ÷ p = 60 ÷ 30 = 2.")],
    volta='i = 2 · 5 = 10 cm.\nLetra C.',
    valores=[('o', '5 cm'), ('A', '2')],
    pista='"lente projeta imagem na parede" → ache p\' pela equação da lente, depois o aumento p\' ÷ p e a altura da imagem.',
    rec1='f = 20 cm, 5 cm, p = 30 cm', rec3="o = 5 cm; p' = 60 cm; A = 2",
    checagem=('Lente de f = 10 cm, objeto de 3 cm a 15 cm da lente. Qual a altura da imagem?', ['6 cm', '3 cm', '9 cm', '2 cm'], '6 cm',
              "1/p' = 1/10 − 1/15 = 1/30, p' = 30; A = 30 ÷ 15 = 2; i = 6 cm."),
))
# b) ITA: lente na água
N = 1.5 / (4 / 3); fa = 1 / ((N - 1) * (2 / 20)); assert abs(fa - 80) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-opt-00b', tema=T, calc=80,
    enunciado=('Uma lente biconvexa de vidro, de índice de refração 1,5, tem as duas faces com raio de curvatura de 20 cm. No ar, sua distância focal é de 20 cm. '
               'Se a lente for totalmente mergulhada na água, de índice de refração 4/3, qual passa a ser sua distância focal, em centímetros? '
               '(Use a equação dos fabricantes de lentes, com o índice relativo da lente em relação ao meio.)'),
    dados=[('Índice do vidro', '1,5'), ('Índice da água', '4/3'), ('Raios das faces', '20 cm e 20 cm'), ('Foco no ar', '20 cm')],
    alts=[('−90', -90, 'Inverteu o índice relativo (água ÷ vidro) e a lente ficou divergente'),
          ('20', 20, 'Achou que a água não muda nada'),
          ('60', 60, 'Usou a diferença 1,5 − 4/3 = 1/6 em vez da razão'),
          ('80', 80, 'OK'),
          ('160', 160, 'Usou só uma face: R ÷ (N − 1)')],
    resumo='N = 1,5 ÷ (4/3) = 1,125; 1/F = 0,125 · (1/20 + 1/20) = 0,0125; F = 80 cm.',
    ideia='O foco de uma lente depende da diferença entre o índice dela e o do meio. Na água essa diferença cai muito, e a lente converge bem menos, com foco bem maior.',
    pecas=[('Índice relativo', 'Índice da lente dividido pelo índice do meio em que ela está.')],
    formulas=[('lente', 'Equação dos fabricantes', '1/F = (N − 1) · (1/R1 + 1/R2)'), ('lente', 'Índice relativo', 'N = n da lente ÷ n do meio')],
    eq='1/F = (N − 1) · (1/R + 1/R)', leitura='1 sobre o foco = (índice relativo − 1) · (soma de 1 sobre os dois raios)',
    letras=[('F', 'distância focal na água, em cm (o que a questão quer)'), ('N', 'índice relativo vidro/água'), ('R', 'raio de cada face, em cm')],
    eq_texto='As duas faces têm o mesmo raio R. O que muda da água para o ar é o índice relativo N.\nAgora é só achar N e R.',
    achando=[('Achando N: o índice relativo', 'N = índice do vidro ÷ índice da água = 1,5 ÷ (4/3) = 1,5 · 3/4 = 1,125.\nN − 1 = 0,125.'),
             ('Achando R: o raio', 'O enunciado dá: R = 20 cm nas duas faces.\n1/R + 1/R = 1/20 + 1/20 = 0,1.')],
    volta='1/F = 0,125 · 0,1 = 0,0125, então F = 1 ÷ 0,0125 = 80 cm.\nLetra D. No ar, N − 1 = 0,5 dava 1/F = 0,05 e F = 20 cm: na água o foco ficou 4 vezes maior.',
    valores=[('N', '1,125'), ('R', '20 cm')],
    pista='"lente mergulhada em outro meio" → troque o índice por índice da lente ÷ índice do meio na equação dos fabricantes.',
    rec1='vidro 1,5, água 4/3, R = 20 cm', rec3='N = 1,125; 1/R + 1/R = 0,1',
    checagem=('Qual o índice relativo de uma lente de vidro (1,5) num líquido de índice 1,2?', ['1,25', '0,8', '0,3', '1,8'], '1,25',
              'N = 1,5 ÷ 1,2 = 1,25.'),
))
# c) Fuvest: fibra óptica
vn = 3e8 / 1.6; tt = 3000 / vn * 1e6; assert abs(tt - 16) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-opt-00c', tema=T, calc=16,
    enunciado=('Em uma fibra óptica, o núcleo de vidro tem índice de refração 1,6. Um pulso de luz percorre 3 km de fibra, todo dentro do núcleo, em linha reta '
               '(despreze as reflexões nas paredes). A velocidade da luz no vácuo é 3 × 10⁸ m/s. O tempo, em microssegundos (1 µs = 10⁻⁶ s), '
               'que o pulso leva para percorrer a fibra é:'),
    dados=[('Comprimento', '3 km'), ('Índice do núcleo', '1,6'), ('Luz no vácuo', '3 × 10⁸ m/s')],
    alts=[('6,25', 6.25, 'Multiplicou a velocidade por 1,6 em vez de dividir'),
          ('10', 10, 'Usou a velocidade do vácuo, sem o índice'),
          ('16', 16, 'OK'),
          ('25,6', 25.6, 'Multiplicou o resultado por 1,6 duas vezes'),
          ('160', 160, 'Errou uma casa decimal na conversão para microssegundos')],
    resumo='v = 3 · 10⁸ ÷ 1,6 = 187 500 000 m/s; t = 3 000 ÷ 187 500 000 = 0,000016 s = 16 µs.',
    ideia='Dentro do vidro a luz anda mais devagar: a velocidade é a do vácuo dividida pelo índice de refração. O tempo é distância ÷ velocidade, e depois se passa para microssegundos.',
    pecas=[('Índice de refração', 'Quantas vezes a luz é mais lenta no material do que no vácuo: n = c ÷ v.')],
    formulas=[('onda', 'Velocidade no meio', 'v = c ÷ n'), ('carro', 'Tempo', 'tempo = distância ÷ velocidade')],
    eq='t = L ÷ v', leitura='tempo = comprimento da fibra ÷ velocidade da luz no núcleo',
    letras=[('t', 'tempo do pulso, em s (o que a questão quer)'), ('L', 'comprimento da fibra, em m'), ('v', 'velocidade da luz no núcleo, em m/s')],
    eq_texto='O tempo é a distância dividida pela velocidade da luz dentro do núcleo, que não é a do vácuo.\nAgora é só achar L e v.',
    achando=[('Achando L: o comprimento em metros', '3 km = 3 000 m.'),
             ('Achando v: a velocidade no núcleo', 'v = c ÷ n = 300 000 000 ÷ 1,6 = 187 500 000 m/s.')],
    volta='t = 3 000 ÷ 187 500 000 = 0,000016 s.\n1 µs = 0,000001 s, então 0,000016 s = 16 µs.\nLetra C.',
    valores=[('L', '3 000 m'), ('v', '187 500 000 m/s')],
    pista='"luz num material com índice n" → v = c ÷ n; depois tempo = distância ÷ v, cuidando com as unidades.',
    rec1='3 km, n = 1,6, c = 3 · 10⁸', rec3='L = 3 000 m; v = 1,875 · 10⁸ m/s',
    checagem=('Qual a velocidade da luz num vidro de índice 1,5? (c = 3 × 10⁸ m/s)', ['2 × 10⁸ m/s', '4,5 × 10⁸ m/s', '3 × 10⁸ m/s', '1,5 × 10⁸ m/s'], '2 × 10⁸ m/s',
              'v = 3 · 10⁸ ÷ 1,5 = 2 · 10⁸ m/s.'),
))
# d) Harvard-MIT: espelho plano e imagem
dd = 8 - 1.5 * 4; DD = 2 * dd; assert dd == 2 and DD == 4
Q.append(dict(
    id='d2-escada-fis-ita-opt-00d', tema=T, calc=4,
    enunciado=('Um homem está de pé, a 8 m de um espelho plano vertical, e começa a andar em direção ao espelho, em linha reta, com velocidade de 1,5 m/s. '
               'Depois de 4 s de caminhada, qual é a distância, em metros, entre o homem e a imagem dele?'),
    dados=[('Distância inicial ao espelho', '8 m'), ('Velocidade', '1,5 m/s, em direção ao espelho'), ('Tempo', '4 s')],
    alts=[('2', 2, 'Deu a distância do homem ao espelho, não até a imagem'),
          ('4', 4, 'OK'),
          ('8', 8, 'Deu a distância inicial ao espelho'),
          ('10', 10, 'Somou 8 + 2'),
          ('16', 16, 'Deu a distância inicial entre ele e a imagem')],
    resumo='Andou 1,5 · 4 = 6 m; sobram 8 − 6 = 2 m até o espelho; a imagem está 2 m atrás, então D = 4 m.',
    ideia='No espelho plano, a imagem fica tão atrás do espelho quanto o objeto fica na frente. A distância entre o homem e a imagem é o dobro da distância dele ao espelho.',
    pecas=[('Imagem no espelho plano', 'Fica simétrica ao objeto: mesma distância do espelho, só que do outro lado.')],
    formulas=[('carro', 'Distância andada', 'distância = velocidade · tempo'), ('lente', 'Espelho plano', 'distância à imagem = distância ao espelho')],
    eq='D = 2 · d', leitura='distância até a imagem = 2 · distância dele ao espelho',
    letras=[('D', 'distância entre o homem e a imagem, em m (o que a questão quer)'), ('d', 'distância do homem ao espelho depois de 4 s, em m')],
    eq_texto='A imagem está atrás do espelho, à mesma distância d. Entre o homem e a imagem há d na frente do espelho e d atrás: 2 · d.\nAgora é só achar d.',
    achando=[('Achando d: a distância ao espelho', 'Em 4 s ele andou 1,5 · 4 = 6 m.\nd = 8 − 6 = 2 m.')],
    volta='D = 2 · 2 = 4 m.\nLetra B. Antes de andar, D era 2 · 8 = 16 m: a aproximação do homem encurta a distância até a imagem duas vezes mais rápido.',
    valores=[('d', '2 m')],
    pista='"espelho plano e uma pessoa que anda" → ache a distância dela ao espelho; a imagem está à mesma distância do outro lado.',
    rec1='8 m do espelho, 1,5 m/s, 4 s', rec3='d = 2 m',
    checagem=('A 5 m do espelho, ele anda 1 m/s por 2 s. Qual a distância até a imagem?', ['6 m', '3 m', '8 m', '10 m'], '6 m',
              'd = 5 − 2 = 3 m; D = 2 · 3 = 6 m.'),
))

# ============================ ELETRICIDADE ============================
T = 'Eletricidade e Circuitos'
# a) ENEM: chuveiro com rendimento
U = 4200 * 0.8; dT = U / (0.1 * 4200); assert U == 3360 and abs(dT - 8) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-ele-00a', tema=T, calc=8,
    enunciado=('Um chuveiro elétrico de 4 200 W esquenta a água que passa por ele, com vazão de 6 L por minuto. Por causa de perdas, só 80% da potência elétrica '
               'vira calor na água. Considere que 1 L de água tem massa de 1 kg, que o calor específico da água é 4 200 J/(kg · °C) e que a água sai do chuveiro '
               'numa temperatura constante. Qual é o aumento de temperatura da água ao passar pelo chuveiro, em °C?'),
    dados=[('Potência elétrica', '4 200 W'), ('Rendimento', '80%'), ('Vazão', '6 L/min'), ('Calor específico', '4 200 J/(kg · °C)')],
    alts=[('0,13', 0.13, 'Usou 6 kg por segundo, sem dividir os 6 L por 60 s'),
          ('8', 8, 'OK'),
          ('10', 10, 'Esqueceu o rendimento de 80%'),
          ('12,5', 12.5, 'Dividiu por 0,8 em vez de multiplicar'),
          ('80', 80, 'Usou 80 no lugar de 0,8')],
    resumo='Potência útil = 4 200 · 0,8 = 3 360 W; m = 6 ÷ 60 = 0,1 kg/s; ΔT = 3 360 ÷ (0,1 · 4 200) = 8 °C.',
    ideia='A água recebe, a cada segundo, só 80% da potência. Esse calor por segundo é massa por segundo vezes calor específico vezes o aumento de temperatura.',
    pecas=[('Rendimento', 'A parte da energia que realmente serve ao que se quer: aqui 80% da potência vira calor na água.')],
    formulas=[('circuito', 'Potência útil', 'U = P · rendimento'), ('termometro', 'Calor por segundo', 'U = m · c · ΔT (m = massa por segundo)')],
    eq='T = U ÷ (m · c)', leitura='aumento de temperatura = potência útil ÷ (massa por segundo · calor específico)',
    letras=[('T', 'aumento de temperatura, em °C (o que a questão quer)'), ('U', 'potência que vira calor na água, em W'), ('m', 'massa de água por segundo, em kg/s'), ('c', 'calor específico da água')],
    eq_texto='Cada segundo, U joules aquecem m quilos de água. Então T = U ÷ (m · c).\nAgora é só achar U, m e c.',
    achando=[('Achando U: a potência útil', 'Só 80% vira calor: U = 4 200 · 0,8 = 3 360 W (3 360 J por segundo).'),
             ('Achando m: a massa por segundo', '6 L por minuto = 6 kg por minuto. Em um segundo: 6 ÷ 60 = 0,1 kg/s.'),
             ('Achando c: o calor específico', 'O enunciado dá: c = 4 200 J/(kg · °C).')],
    volta='T = 3 360 ÷ (0,1 · 4 200) = 3 360 ÷ 420 = 8 °C.\nLetra B.',
    valores=[('U', '3 360 W'), ('m', '0,1 kg/s'), ('c', '4 200')],
    pista='"aquecedor elétrico com rendimento e vazão" → potência útil, massa por segundo (litros por minuto ÷ 60) e T = U ÷ (m · c).',
    rec1='4 200 W, 80%, 6 L/min', rec3='U = 3 360 W; m = 0,1 kg/s; c = 4 200',
    checagem=('Aquecedor de 4 200 W (tudo vira calor) aquece 0,25 kg de água por segundo (c = 4 200). Qual o aumento?', ['4 °C', '40 °C', '16 °C', '1 °C'], '4 °C',
              'T = 4 200 ÷ (0,25 · 4 200) = 1 ÷ 0,25 = 4 °C.'),
))
# b) ITA: máxima potência
Pmax = 2 * (12 / 4) ** 2; assert Pmax == 18 and [R * (12 / (R + 2)) ** 2 for R in (1, 2, 4)] == [16, 18, 16]
Q.append(dict(
    id='d2-escada-fis-ita-ele-00b', tema=T, calc=18,
    enunciado=('Uma bateria de força eletromotriz 12 V e resistência interna 2 Ω alimenta um resistor externo de resistência R, que pode ser ajustada para qualquer valor. '
               'Qual é a maior potência, em watts, que a bateria pode entregar ao resistor R?'),
    dados=[('Força eletromotriz', '12 V'), ('Resistência interna', '2 Ω'), ('Resistor externo', 'R (ajustável)')],
    alts=[('16', 16, 'Calculou com R = 1 Ω ou R = 4 Ω, que não é o máximo'),
          ('18', 18, 'OK'),
          ('36', 36, 'Contou a potência total da bateria (12 · 3), não só a do resistor'),
          ('72', 72, 'Calculou a potência com R = 0 (curto), toda perdida na resistência interna'),
          ('144', 144, 'Fez 12² e esqueceu de dividir')],
    resumo='O máximo vem com R = r = 2 Ω: I = 12 ÷ 4 = 3 A e P = 2 · 3² = 18 W. Com R = 1: 16 W; com R = 4: 16 W.',
    ideia='Se R é muito pequeno, quase não há tensão nele; se é muito grande, a corrente cai. A potência no resistor é máxima quando ele é igual à resistência interna.',
    pecas=[('Resistência interna', 'A resistência da própria bateria, que fica em série com o resistor ligado a ela.')],
    formulas=[('circuito', 'Corrente no circuito', 'I = ε ÷ (R + r)'), ('circuito', 'Potência no resistor', 'P = R · I²')],
    eq='P = R · I²', leitura='potência no resistor = R · corrente ao quadrado',
    letras=[('P', 'potência no resistor, em W (o que a questão quer)'), ('R', 'resistência do resistor externo, em Ω'), ('I', 'corrente no circuito, em A')],
    eq_texto='A potência no resistor é R · I². Mas I também depende de R, então tenho de escolher o R que dá o maior P.\nAgora é só achar R e I.',
    achando=[('Achando R: o valor que dá o máximo', 'Teste: R = 1 Ω → I = 12 ÷ 3 = 4 A, P = 1 · 16 = 16 W. R = 2 Ω → I = 3 A, P = 18 W. R = 4 Ω → I = 2 A, P = 16 W.\nO maior está em R = 2 Ω, igual à resistência interna.'),
             ('Achando I: a corrente', 'Com R = 2 Ω e r = 2 Ω em série: I = 12 ÷ (2 + 2) = 3 A.')],
    volta='P = 2 · 3² = 2 · 9 = 18 W.\nLetra B.',
    valores=[('R', '2 Ω'), ('I', '3 A')],
    pista='"máxima potência no resistor de uma bateria" → a potência é máxima quando R é igual à resistência interna; teste os vizinhos para conferir.',
    rec1='12 V, r = 2 Ω, R ajustável', rec3='R = 2 Ω; I = 3 A',
    checagem=('Bateria de 10 V e r = 5 Ω. Qual a potência máxima no resistor?', ['5 W', '10 W', '20 W', '2,5 W'], '5 W',
              'R = 5 Ω; I = 10 ÷ 10 = 1 A; P = 5 · 1 = 5 W.'),
))
# c) Fuvest: circuito misto
Rp = 12 * 6 / 18; It = 36 / (8 + Rp); Up = It * Rp; assert Rp == 4 and It == 3 and Up == 12 and Up / 6 == 2
Q.append(dict(
    id='d2-escada-fis-ita-ele-00c', tema=T, calc=2,
    enunciado=('Uma fonte de 36 V alimenta um circuito em que um resistor de 8 Ω está ligado em série com um conjunto de dois resistores em paralelo, '
               'um de 12 Ω e outro de 6 Ω. Considere a fonte e os fios ideais. A corrente, em ampères, que passa pelo resistor de 6 Ω '
               'do conjunto em paralelo é:'),
    dados=[('Fonte', '36 V'), ('Resistor em série', '8 Ω'), ('Em paralelo', '12 Ω e 6 Ω')],
    alts=[('1', 1, 'Deu a corrente do resistor de 12 Ω (12 ÷ 12)'),
          ('2', 2, 'OK'),
          ('3', 3, 'Deu a corrente total do circuito'),
          ('4,5', 4.5, 'Fez 36 ÷ 8, ignorando o paralelo'),
          ('6', 6, 'Fez 36 ÷ 6, como se só ele estivesse ligado à fonte')],
    resumo='Paralelo: 12 · 6 ÷ 18 = 4 Ω; total 12 Ω; I = 36 ÷ 12 = 3 A; U no paralelo = 3 · 4 = 12 V; I(6 Ω) = 12 ÷ 6 = 2 A.',
    ideia='Primeiro o circuito todo: some o paralelo ao resistor em série e ache a corrente total. Essa corrente cria uma tensão no conjunto em paralelo, e é essa tensão que divide a corrente entre os dois resistores.',
    pecas=[('Resistores em paralelo', 'Ligados nos mesmos dois pontos: têm a mesma tensão, e a corrente se divide entre eles.')],
    formulas=[('circuito', 'Lei de Ohm', 'U = R · I'), ('circuito', 'Dois em paralelo', 'R = (R1 · R2) ÷ (R1 + R2)')],
    eq='I = U ÷ R', leitura='corrente no de 6 Ω = tensão do paralelo ÷ 6',
    letras=[('I', 'corrente no resistor de 6 Ω, em A (o que a questão quer)'), ('U', 'tensão sobre o conjunto em paralelo, em V'), ('R', 'resistência desse resistor, em Ω')],
    eq_texto='O resistor de 6 Ω recebe a tensão do conjunto em paralelo. A corrente nele é U ÷ 6.\nAgora é só achar R e U.',
    achando=[('Achando R: o resistor do paralelo', 'É o resistor de 6 Ω do enunciado: R = 6 Ω.'),
             ('Achando U: a tensão do paralelo', 'Paralelo: 12 · 6 ÷ (12 + 6) = 72 ÷ 18 = 4 Ω.\nTotal em série: 8 + 4 = 12 Ω. Corrente total: 36 ÷ 12 = 3 A.\nTensão no paralelo: U = 3 · 4 = 12 V.')],
    volta='I = 12 ÷ 6 = 2 A.\nLetra B. Conferindo: no de 12 Ω passa 1 A, e 1 + 2 = 3 A, a corrente total.',
    valores=[('R', '6 Ω'), ('U', '12 V')],
    pista='"série com paralelo" → ache a resistência total e a corrente total; a tensão do paralelo é corrente · resistência dele; divida por cada resistor.',
    rec1='36 V, 8 Ω em série, 12 Ω e 6 Ω em paralelo', rec3='R = 6 Ω; U = 12 V',
    checagem=('Fonte de 20 V, 4 Ω em série e dois de 12 Ω em paralelo. Corrente em cada um dos de 12 Ω?', ['1 A', '2 A', '0,5 A', '3 A'], '1 A',
              'Paralelo = 6 Ω; total 10 Ω; I = 2 A; U no paralelo = 12 V; cada um: 12 ÷ 12 = 1 A.'),
))
# d) Harvard-MIT: cubo de resistores
E = (1 / 3 + 1 / 6 + 1 / 3) * 12; assert abs(E - 10) < 1e-9
Q.append(dict(
    id='d2-escada-fis-ita-ele-00d', tema=T, calc=10,
    enunciado=('Doze resistores iguais, de 12 Ω cada um, formam as arestas de um cubo. Uma bateria é ligada a dois vértices opostos, as pontas de uma diagonal do cubo. '
               'A resistência equivalente entre esses dois vértices, em ohms, é:'),
    dados=[('Resistores', '12, todos de 12 Ω'), ('Montagem', 'arestas de um cubo'), ('Bateria', 'nos vértices opostos')],
    alts=[('4', 4, 'Deu R ÷ 3, como se só as três primeiras arestas contassem'),
          ('6', 6, 'Deu R ÷ 2, sem raciocínio de simetria'),
          ('8', 8, 'Somou só duas etapas: 4 + 4'),
          ('10', 10, 'OK'),
          ('12', 12, 'Deu a resistência de um resistor só')],
    resumo='Por simetria, as correntes se dividem em I/3, I/6 e I/3: tensão = (1/3 + 1/6 + 1/3) · I · R = (5/6) · I · R. Equivalente = (5/6) · 12 = 10 Ω.',
    ideia='Pela simetria do cubo, a corrente que sai de um vértice se divide em 3 partes iguais, depois em 6, e volta a juntar em 3. Somando as quedas de tensão nessas três etapas, sai o equivalente.',
    pecas=[('Simetria', 'Pontos que o circuito trata do mesmo jeito têm a mesma tensão e a mesma corrente. Aqui, as três arestas iniciais são iguais.')],
    formulas=[('circuito', 'Lei de Ohm', 'U = R · I'), ('circuito', 'Resistência equivalente', 'E = U ÷ I')],
    eq='E = F · R', leitura='equivalente = fração · resistência de uma aresta',
    letras=[('E', 'resistência equivalente, em Ω (o que a questão quer)'), ('F', 'fração de R, vinda da simetria do cubo'), ('R', 'resistência de cada aresta, em Ω')],
    eq_texto='Em três etapas a corrente passa por arestas iguais. A tensão total é a soma das três quedas, e o equivalente é essa tensão dividida pela corrente total I.\nAgora é só achar R e F.',
    achando=[('Achando R: a aresta', 'O enunciado dá: R = 12 Ω.'),
             ('Achando F: a fração', 'Saindo do vértice A, a corrente I se divide em 3 arestas iguais: I/3 em cada. Elas chegam a 3 vértices que se ligam a mais 3 por 6 arestas: I/6 em cada. As últimas 3 arestas levam I/3 cada ao outro vértice.\nTensão = (I/3) · R + (I/6) · R + (I/3) · R = (1/3 + 1/6 + 1/3) · I · R.\nF = 2/6 + 1/6 + 2/6 = 5/6.')],
    volta='E = (5/6) · 12 = 60 ÷ 6 = 10 Ω.\nLetra D.',
    valores=[('R', '12 Ω'), ('F', '5/6')],
    pista='"resistores iguais nas arestas de um cubo" → por simetria a corrente se divide em I/3, I/6 e I/3; some as quedas de tensão.',
    rec1='12 arestas de 12 Ω, diagonal', rec3='R = 12 Ω; F = 5/6',
    checagem=('Cubo de resistores de 6 Ω cada, ligado pela diagonal. Qual o equivalente?', ['5 Ω', '6 Ω', '4 Ω', '3 Ω'], '5 Ω',
              '(5/6) · 6 = 5 Ω.'),
))


def principal():
    aplicar_ajustes(Q)
    for i, q in enumerate(Q):
        q['pos'] = i % 5
    saida = [montar(q) for q in Q]
    ids = [q['id'] for q in saida]
    assert len(ids) == len(set(ids)) == 24
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with open(SAIDA, 'w', encoding='utf-8') as f:
        json.dump(saida, f, ensure_ascii=False, indent=1)
        f.write('\n')
    letras = {l: sum(q['resposta'] == l for q in saida) for l in LETRAS}
    print('questões:', len(saida), '| letra certa:', letras)
    print('letras médias do enunciado:', sum(len(q['enunciado']) for q in saida) // len(saida))


if __name__ == '__main__':
    principal()
