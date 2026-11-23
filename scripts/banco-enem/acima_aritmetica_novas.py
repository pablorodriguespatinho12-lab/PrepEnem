#!/usr/bin/env python3
"""Nível acima de MATEMÁTICA, degrau 1 (Aritmética e Porcentagem): 4 questões originais (23/11/2026).

a = ENEM (tabela de custos), b = ITA (mistura), c = Fuvest (parcelas com juros), d = Harvard-MIT (porcentagem em cadeia).
As 2 primeiras entram na prova. Mesmo molde e mesmo gerador da Física (acima_fisica_novas.montar).
Substitui as antigas `d2-escada-mat-ita-ari-01` ("muito fácil", Pablo 23/11/2026).

Uso: python3 scripts/banco-enem/acima_aritmetica_novas.py
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from acima_fisica_novas import montar, LETRAS  # noqa: E402

SAIDA = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'revisao-final', 'escada', 'matematica-aritmetica-novas.json')
T = 'Aritmética e Porcentagem'
VEZES = ' O ponto · significa vezes.'
Q = []
INTRO = 'Cada fórmula é explicada, com números, no passo em que for usada. Aqui você só vê o nome dela. O p é o número da porcentagem (em 20%, p = 20). O ponto · significa vezes.'

# a) ENEM: custo com três partes que mudam
M = 0.6 * 1.2; E = 0.25 * 0.9; O = 0.15 * 1.4; assert abs(M + E + O - 1.155) < 1e-9
Q.append(dict(
    id='d2-escada-mat-ita-ari-00a', intro_formulas=INTRO, materia='Matemática', tema=T, calc=15.5, pos=1,
    enunciado=('Uma cooperativa produz suco em garrafas. No mês passado, o custo de produção de cada garrafa se dividia assim: 60% em matéria-prima (as frutas), '
               '25% em embalagem e 15% em outros gastos (energia e transporte). Neste mês, o preço das frutas subiu 20%, o preço da embalagem caiu 10% e os outros '
               'gastos subiram 40%. A gerente quer saber em quantos por cento o custo total de uma garrafa mudou em relação ao mês passado. '
               'A variação do custo total, em %, foi um aumento de:'),
    dados=[('Frutas', '60% do custo; subiu 20%'), ('Embalagem', '25% do custo; caiu 10%'), ('Outros gastos', '15% do custo; subiu 40%')],
    alts=[('15,5', 15.5, 'OK'),
          ('16,7', 16.7, 'Fez a média simples de 20, −10 e 40 (50 ÷ 3), sem pesar pela fatia de cada gasto'),
          ('20,5', 20.5, 'Somou o 10% da embalagem em vez de tirar (12 + 2,5 + 6)'),
          ('50', 50, 'Somou 20 − 10 + 40, sem considerar a fatia de cada gasto'),
          ('70', 70, 'Somou os três reajustes sem sinal: 20 + 10 + 40')],
    resumo='M = 0,6 · 1,2 = 0,72; E = 0,25 · 0,9 = 0,225; O = 0,15 · 1,4 = 0,21; custo novo = 1,155 do antigo, então V = 0,155 = 15,5%.',
    ideia='Cada gasto muda do seu jeito e pesa uma fatia diferente do custo. Calcule quanto cada fatia vale hoje, some, e compare com o custo de antes (que vale 1).',
    pecas=[('Variação percentual', 'Quanto o valor mudou, em % do valor de antes: (novo − antigo) ÷ antigo.')],
    formulas=[('porcentagem', 'Subir p%', 'novo = antigo · (1 + p ÷ 100)'), ('porcentagem', 'Cair p%', 'novo = antigo · (1 − p ÷ 100)')],
    origem="Porcentagem é 'em cada 100': 60% = 60 ÷ 100 = 0,6. Subir 20% é multiplicar por 1 + 0,2 = 1,2: um preço de 100 passa a 120. Cair 10% é multiplicar por 1 − 0,1 = 0,9: 100 passa a 90. O custo do mês passado vale 1 (100%). O ponto · significa vezes.",
    eq='V = M + E + O − 1', leitura='variação = (fatias de hoje somadas) − 1',
    letras=[('V', 'variação do custo, em fração (o que a questão quer)'), ('M', 'matéria-prima (as frutas): quanto pesam hoje, em fração do custo antigo'), ('E', 'quanto a embalagem pesa hoje'), ('O', 'quanto os outros gastos pesam hoje')],
    eq_texto='O custo antigo vale 1. Cada gasto, hoje, vale a fatia antiga vezes o reajuste. Somando as três fatias de hoje e tirando 1, sai a variação. Por que − 1? O custo de antes vale 1: se hoje vale 1,155, subiu 1,155 − 1 = 0,155. Exemplo: de 100 para 120, a variação é 120 − 100 = 20, ou 0,20 de 100.\nAgora é só achar M, E e O.',
    achando=[('Achando M: as frutas hoje', 'Frutas eram 60% = 0,6 do custo. Subir 20% é multiplicar por 1,2.\nM = 0,6 · 1,2. Tire as vírgulas: 6 · 12 = 72. Em 0,6 há 1 número depois da vírgula e em 1,2 há mais 1: são 2 ao todo. Ponha a vírgula com 2 números depois dela: M = 0,72.'),
             ('Achando E: a embalagem hoje', 'Embalagem era 25% = 0,25. Cair 10% é multiplicar por 0,9.\nE = 0,25 · 0,9. Sem vírgulas: 25 · 9 = 225. Depois das vírgulas há 2 + 1 = 3 números: E = 0,225.'),
             ('Achando O: os outros gastos hoje', 'Outros eram 15% = 0,15. Subir 40% é multiplicar por 1,4.\nO = 0,15 · 1,4. Sem vírgulas: 15 · 14 = 210. Depois das vírgulas há 2 + 1 = 3 números: O = 0,210 = 0,21.')],
    volta='M + E + O: 0,72 + 0,225 = 0,945 (0,720 + 0,225) e 0,945 + 0,21 = 1,155 (0,945 + 0,210). O custo de hoje é 1,155 do de antes.\nV = 1,155 − 1 = 0,155. 0,155 é 155 em cada 1 000; vezes 100 dá 15,5%. Para passar fração em % basta multiplicar por 100 (0,6 → 60%).\nResposta: alternativa A.',
    valores=[('M', '0,72'), ('E', '0,225'), ('O', '0,21')],
    pista='"várias partes do custo com reajustes diferentes" → multiplique cada fatia pelo seu reajuste, some e compare com 1; não faça média simples dos reajustes.',
    rec1='60% sobe 20%, 25% cai 10%, 15% sobe 40%', rec3='M = 0,72; E = 0,225; O = 0,21',
    checagem=('Um custo se divide em 50% A e 50% B. A sobe 10% e B cai 10%. Qual a variação do custo total?', ['0%', '10%', '1%', '−1%'], '0%',
              '0,5 · 1,1 = 0,55 e 0,5 · 0,9 = 0,45; 0,55 + 0,45 = 1, então não mudou.'),
))
# b) ITA: mistura com duas trocas
A1 = 0.32 * 40; A2 = A1 * 0.75; A3 = A2 * 0.75; assert abs(A3 - 7.2) < 1e-9 and abs(A3 / 40 * 100 - 18) < 1e-9
Q.append(dict(
    id='d2-escada-mat-ita-ari-00b', intro_formulas=INTRO, materia='Matemática', tema=T, calc=18, pos=3,
    enunciado=('Um tanque tem 40 L de uma mistura de água e álcool, com 32% de álcool. Retiram-se 10 L da mistura, que são jogados fora, e o tanque é completado com 10 L de água pura, '
               'mexendo bem. A operação é repetida uma segunda vez, do mesmo jeito. Qual é, em %, a porcentagem de álcool na mistura final?'),
    dados=[('Volume do tanque', '40 L'), ('Álcool no início', '32%'), ('Cada troca', 'sai 10 L, entra 10 L de água'), ('Trocas', '2')],
    alts=[('8', 8, 'Deu a quantidade que sai de álcool a cada troca em pontos (25% de 32)'),
          ('16', 16, 'Tirou 8 pontos duas vezes (32 − 8 − 8), sem ver que a segunda troca tira menos álcool'),
          ('18', 18, 'OK'),
          ('24', 24, 'Fez só uma troca (32 · 0,75)'),
          ('25', 25, 'Deu a fração que sai da mistura (10 ÷ 40), não a porcentagem de álcool')],
    resumo='Álcool: 0,32 · 40 = 12,8 L; 1ª troca: 12,8 · 0,75 = 9,6 L; 2ª troca: 9,6 · 0,75 = 7,2 L. P = 7,2 ÷ 40 · 100 = 18%.',
    ideia='Cada troca leva embora 1/4 da mistura e, junto, 1/4 do álcool que estava nela. Como a água que entra não tem álcool, sobra 3/4 do álcool a cada troca.',
    pecas=[('Mistura', 'Água e álcool misturados por igual: o que sai tem a mesma porcentagem de álcool do tanque.')],
    formulas=[('porcentagem', 'Parte de um total', 'parte = total · p ÷ 100'), ('porcentagem', 'Porcentagem', 'p% = parte ÷ total · 100')],
    origem="32% de 40 L: 32 ÷ 100 = 0,32 e 0,32 · 40 = 12,8 L de álcool. 10 L de 40 L: 10 ÷ 40 = 0,25. Lê-se 'um quarto' (1/4): 4 partes iguais, tira 1. Sobram 3 partes de 4, 3/4 = 3 ÷ 4 = 0,75. Dividir por 4 é o mesmo que pegar 1/4: 12,8 ÷ 4 = 3,2. Os 40 L têm 12,8 L de álcool espalhado por igual; os 10 L que saem levam 1/4 disso, 3,2 L, e sobram 12,8 − 3,2 = 9,6 L. A água pura que entra não tem álcool. O ponto · significa vezes.",
    eq='P = A ÷ V · 100', leitura='porcentagem de álcool = álcool ÷ volume do tanque · 100',
    letras=[('P', 'porcentagem final de álcool (o que a questão quer)'), ('A', 'álcool que sobra no fim, em L'), ('V', 'volume do tanque, em L')],
    eq_texto='Porcentagem é a parte dividida pelo total, vezes 100. O total é sempre o tanque cheio, e a parte é o álcool que sobrou depois das duas trocas.\nAgora é só achar A e V.',
    achando=[('Achando A: o álcool que sobra', 'No começo: 0,32 · 40 = 12,8 L de álcool.\n1ª troca: sai 1/4 do álcool e sobra 0,75 · 12,8 = 9,6 L (12,8 ÷ 4 = 3,2 e 12,8 − 3,2 = 9,6).\n2ª troca: sai 1/4 de novo e sobra 0,75 · 9,6 = 7,2 L (9,6 ÷ 4 = 2,4 e 9,6 − 2,4 = 7,2).'),
             ('Achando V: o volume do tanque', 'A cada troca saem 10 L e entram 10 L de água: o tanque fica sempre com 40 L.\nV = 40 L.')],
    volta='P = 7,2 ÷ 40 · 100. 7,2 ÷ 40: 72 ÷ 40 = 1,8, então 7,2 ÷ 40 = 0,18 (outro jeito: 40 · 0,1 = 4 e 40 · 0,08 = 3,2; 4 + 3,2 = 7,2). Vezes 100: 0,18 · 100 = 18%.\nResposta: alternativa C.',
    valores=[('A', '7,2 L'), ('V', '40 L')],
    pista='"retira parte da mistura e completa com água" → a cada troca sobra a mesma fração do álcool; aplique em cadeia e divida pelo volume total.',
    rec1='40 L, 32%, troca 10 L, 2 vezes', rec3='A = 7,2 L; V = 40 L',
    checagem=('Tanque de 20 L com 50% de álcool. Trocam-se 10 L por água, uma vez. Qual a % de álcool?', ['25%', '50%', '0%', '40%'], '25%',
              '50% de 20 = 10 L de álcool; sai metade da mistura, sobram 5 L; 5 ÷ 20 = 0,25 = 25%.'),
))
# c) Fuvest: parcelas iguais com juros sobre o saldo
P = 2310 / 2.1; assert abs(P - 1100) < 1e-9 and abs((2100 - 1100) * 1.1 - 1100) < 1e-9
Q.append(dict(
    id='d2-escada-mat-ita-ari-00c', intro_formulas=INTRO, materia='Matemática', tema=T, calc=1100, pos=0,
    enunciado=('Um notebook custa R$ 2 100 à vista. A loja oferece pagá-lo em duas parcelas iguais: a primeira no ato da compra (a entrada) e a segunda 30 dias depois. '
               'Sobre o que ainda se deve depois da entrada, a loja cobra juros de 10% ao mês. Qual é o valor de cada parcela, em reais?'),
    dados=[('Preço à vista', 'R$ 2 100'), ('Parcelas', '2 iguais: entrada e 30 dias depois'), ('Juros', '10% ao mês, sobre o saldo devedor')],
    alts=[('1 000', 1000, 'Deu o saldo devedor depois da entrada (2 100 − 1 100), não a parcela'),
          ('1 050', 1050, 'Dividiu 2 100 por 2, sem os juros'),
          ('1 100', 1100, 'OK'),
          ('1 155', 1155, 'Pôs 10% de juros sobre 1 050, mas as duas parcelas precisam ser iguais'),
          ('1 210', 1210, 'Aplicou 10% de juros sobre a própria parcela de 1 100')],
    resumo='P = (2 100 − P) · 1,1 = 2 310 − 1,1 · P; 2,1 · P = 2 310; P = 1 100. Conferindo: saldo 1 000, com 10%: 1 100.',
    ideia='A entrada é uma parcela P. O que sobra, 2 100 − P, rende 10% em um mês, e esse total tem de ser igual à segunda parcela, que também vale P.',
    pecas=[('Saldo devedor', 'O que ainda falta pagar depois da entrada. Os juros são cobrados só sobre ele.')],
    formulas=[('porcentagem', 'Acrescentar p%', 'novo = antigo · (1 + p ÷ 100)')],
    origem="10% de juros quer dizer multiplicar por 1 + 0,1 = 1,1: se falta pagar 100, vira 110. A entrada não paga juros, pois é paga na hora. Por isso a segunda parcela é o saldo vezes 1,1, e as duas parcelas têm o mesmo valor P. O ponto · significa vezes.",
    eq='P = S · J', leitura='parcela = saldo devedor · fator dos juros',
    letras=[('P', 'valor de cada parcela, em R$ (o que a questão quer)'), ('S', 'saldo devedor depois da entrada, em R$'), ('J', 'fator dos juros')],
    eq_texto='A segunda parcela é o saldo devedor com juros. Como as duas parcelas são iguais, ela também vale P.\nAgora é só achar J (um número) e S (que vai ficar com P dentro, porque a entrada também é P).',
    achando=[('Achando J: o fator dos juros', '10% = 10 ÷ 100 = 0,1. Acrescentar 10% é multiplicar por 1 + 0,1.\nJ = 1,1.'),
             ('Achando S: o saldo devedor', 'A entrada vale P, então o saldo é o preço menos a entrada.\nS = 2 100 − P.')],
    volta='P = (2 100 − P) · 1,1. O 1,1 multiplica tudo dentro do parêntese: 2 100 · 1,1 − P · 1,1. Teste com P = 1 000: (2 100 − 1 000) · 1,1 = 1 210 e 2 310 − 1 100 = 1 210. E 2 100 · 1,1 = 2 100 + 210 = 2 310. Então P = 2 310 − 1,1 · P.\nQuero o P de um lado só. A equação é uma balança: o que faço de um lado faço do outro. Somo 1,1 · P dos dois lados e o “menos 1,1 · P” some do lado direito. P é o mesmo que 1 · P, então 1 · P + 1,1 · P = 2,1 · P (1 + 1,1 = 2,1): 2,1 · P = 2 310.\nP = 2 310 ÷ 2,1: multiplico os dois por 10 e fica 23 100 ÷ 21 = 1 100 (21 · 1 100 = 23 100).\nResposta: alternativa C. Conferindo: saldo 2 100 − 1 100 = 1 000, e 1 000 · 1,1 = 1 100.',
    valores=[('J', '1,1'), ('S', '2 100 − P = 1 000')],
    pista='"parcelas iguais com juros sobre o saldo" → a entrada não paga juros; a última parcela é o saldo vezes (1 + juros); iguale e ache P.',
    rec1='2 100 à vista, 2 parcelas iguais, 10% ao mês', rec3='J = 1,1; S = 2 100 − P',
    checagem=('À vista R$ 900, duas parcelas iguais (entrada e 30 dias), juros de 25% ao mês sobre o saldo. Qual a parcela?', ['R$ 500', 'R$ 450', 'R$ 560', 'R$ 400'], 'R$ 500',
              'P = (900 − P) · 1,25 = 1 125 − 1,25 · P; 2,25 · P = 1 125; P = 500. Conferindo: saldo 400, com 25%: 500.'),
))
# d) Harvard-MIT: porcentagens em cadeia entre três pessoas
assert abs(265 / 2.65 - 100) < 1e-9 and abs(1.2 * 0.75 - 0.9) < 1e-9
Q.append(dict(
    id='d2-escada-mat-ita-ari-00d', intro_formulas=INTRO, materia='Matemática', tema=T, calc=100, pos=2,
    enunciado=('Ana tem 20% a mais de figurinhas do que Bia. Bia tem 25% a menos de figurinhas do que Caio. Os três juntos têm 265 figurinhas. Quantas figurinhas tem Caio?'),
    dados=[('Ana', '20% a mais que Bia'), ('Bia', '25% a menos que Caio'), ('Total dos três', '265 figurinhas')],
    alts=[('75', 75, 'Deu a quantidade de Bia (75% da de Caio)'),
          ('88,3', 88.3, 'Dividiu 265 por 3, como se os três tivessem o mesmo tanto'),
          ('90', 90, 'Deu a quantidade de Ana'),
          ('100', 100, 'OK'),
          ('106', 106, 'Somou 1 + 0,75 + 0,75, tratando Ana como igual a Bia (265 ÷ 2,5)')],
    resumo='B = 0,75 · C; A = 1,2 · B = 0,9 · C; C · (1 + 0,75 + 0,9) = 265, então 2,65 · C = 265 e C = 100. Conferindo: Bia 75, Ana 90, soma 265.',
    ideia='Escreva tudo em função de Caio: Bia tem 0,75 dele e Ana tem 1,2 de Bia, que é 0,9 dele. Cada porcentagem é sobre o valor anterior da cadeia, não sobre o de Caio.',
    pecas=[('Porcentagem em cadeia', 'Cada "a mais" ou "a menos" é sobre o valor da pessoa citada: Ana é 20% a mais que Bia, e não que Caio.')],
    formulas=[('porcentagem', 'p% a mais', 'novo = antigo · (1 + p ÷ 100)'), ('porcentagem', 'p% a menos', 'novo = antigo · (1 − p ÷ 100)')],
    origem="'20% a mais' é multiplicar por 1,2 (100 vira 120); '25% a menos' é multiplicar por 0,75 (100 vira 75). Os dois seguem em cadeia: Ana = 1,2 · Bia e Bia = 0,75 · Caio, então Ana = 1,2 · 0,75 · Caio. Cuidado: 20% a mais que Bia não é 20% a mais que Caio, porque cada porcentagem é sobre o valor de antes. Aqui C, B e A são Caio, Bia e Ana. O ponto · significa vezes.",
    eq='C + B + A = 265', leitura='as figurinhas de Caio, Bia e Ana somam 265',
    letras=[('C', 'figurinhas de Caio (o que a questão quer)'), ('B', 'figurinhas de Bia'), ('A', 'figurinhas de Ana')],
    eq_texto='Escrevo B e A usando só C. Depois a soma vira uma conta com uma letra só.\nAgora é só achar B e A.',
    achando=[('Achando B: as figurinhas de Bia', '25% a menos que Caio é ficar com 75%: B = 0,75 · C.'),
             ('Achando A: as figurinhas de Ana', '20% a mais que Bia é 1,2 vezes Bia: A = 1,2 · B = 1,2 · 0,75 · C. 1,2 · 0,75: sem vírgulas, 12 · 75 = 900; depois das vírgulas há 1 + 2 = 3 números, então 0,900 = 0,9. Conferindo: Bia com 100 de Caio tem 75; Ana = 1,2 · 75 = 90, que é 0,9 · 100.\nA = 0,9 · C.')],
    volta='C + 0,75 · C + 0,9 · C = 265. C é o mesmo que 1 · C. Somo quanto cada um tem de C: 1 + 0,75 + 0,9 = 2,65. Então 2,65 · C = 265, quer dizer que C é 265 ÷ 2,65.\nPara tirar a vírgula, multiplico os dois por 100: 265 ÷ 2,65 = 26 500 ÷ 265 = 100 (265 · 100 = 26 500).\nResposta: alternativa D. Conferindo: Bia 0,75 · 100 = 75, Ana 0,9 · 100 = 90, e 100 + 75 + 90 = 265.',
    valores=[('B', '0,75 · C'), ('A', '0,9 · C')],
    pista='"fulano tem p% a mais que beltrano" → escreva cada pessoa em função de uma só e some; a % é sempre sobre o valor da pessoa citada.',
    rec1='Ana +20% de Bia, Bia −25% de Caio, total 265', rec3='B = 0,75 · C; A = 0,9 · C',
    checagem=('Ana tem 50% a mais que Bia; Bia tem 20% a menos que Caio. Caio tem 100. Quantas tem Ana?', ['120', '130', '110', '100'], '120',
              'Bia = 0,8 · 100 = 80; Ana = 1,5 · 80 = 120.'),
))


def principal():
    saida = [montar(q) for q in Q]
    ids = [q['id'] for q in saida]
    assert len(ids) == len(set(ids)) == 4
    with open(SAIDA, 'w', encoding='utf-8') as f:
        json.dump(saida, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('questões:', len(saida), '| letra certa:', {q['id'][-3:]: q['resposta'] for q in saida},
          '| enunciado:', [len(q['enunciado']) for q in saida])


if __name__ == '__main__':
    principal()
