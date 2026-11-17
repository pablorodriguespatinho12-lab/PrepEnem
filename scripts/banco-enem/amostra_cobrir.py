"""Amostra do jeito novo (Pablo, 16/11/2026): 3 situações e 3 jeitos de cobrar diferentes,
com cena própria, o porquê de "área ÷ área" e o quadro "tenho / quero descobrir".
Estas fichas substituem as 3 primeiras de cobrir_e_chance.py (mesmos ids)."""

PI = 3
BASE = {'materia': 'Matemática', 'tema': 'Geometria Plana'}
F = lambda **k: {**BASE, **k}

FICHAS = [
F(id='d2-banco-mat-cob-01', resp='B', objeto='robô aspirador', cobra='chance',
  confere=100 * 4 * (20 * 20 - PI * 20 * 20 / 4) / (200 * 200),
  enun='Um robô aspirador redondo, de raio 20 cm, limpa uma sala quadrada de 2 m de lado. Ele anda encostado nas paredes, mas, por ser redondo, nunca alcança o fundo dos 4 cantos. Uma migalha cai num ponto qualquer do chão, ao acaso. Use π = 3.\nA probabilidade de a migalha cair num lugar que o robô não alcança é de',
  alts=['0,25%', '1%', '3%', '4%', '0,75%'],
  cena=('cena-robo-aspirador', ['sala: 2 m × 2 m', 'robô: raio 20 cm', 'cantos sem limpar', 'π = 3']),
  ideia='Chance = área onde o robô não passa ÷ área da sala. No canto, o robô fica a 20 cm (o raio) de cada parede: num quadradinho de 20 × 20 = 400 cabe 1/4 dele (300) e sobram 100 cm² sujos.',
  pecas=[('Probabilidade', 'A chance de algo acontecer. 1% quer dizer 1 vez a cada 100.')],
  logica=('a chance de a migalha cair num lugar sujo.', [('Área da sala', 'É onde a migalha pode cair: o total.'), ('Área suja (4 cantos)', 'É onde a migalha cai no lugar que a questão quer.'), ('Área suja ÷ área da sala', 'Chance = o que interessa ÷ o total, como 1 bola premiada num saco de 100.')], 'caiu ao acaso numa figura? Chance = área que interessa ÷ área total.'),
  pergunta='O robô é redondo e a sala é quadrada.\nA questão quer a chance de uma migalha cair onde ele nunca passa.',
  titulo_acontece='Por que dividir área por área',
  acontece='Espalhe 100 migalhas pelo chão, bem misturadas. Cada pedaço do chão recebe migalha na proporção do tamanho dele.\nSe os cantos são 1% do chão, recebem 1 das 100 migalhas.\nPor isso a chance é a área que interessa dividida pela área toda.',
  visual2={'tipo': 'tabela', 'titulo': '100 migalhas espalhadas', 'cabecalho': ['Parte do chão', 'Área', 'Migalhas'], 'linhas': [['Sala inteira', '40 000 cm²', '100'], ['Cantos sem limpar', '400 cm²', '1']]},
  rapido='Macete de chance pela área: chance = área suja ÷ área da sala.\nÁrea da sala: 200 × 200 = 40 000 cm² (2 m = 200 cm).\nÁrea do quadradinho do canto: 20 × 20 = 400 cm² (o robô fica a 20 cm de cada parede).\nÁrea do robô inteiro: 3 × 20 × 20 = 1 200 cm². No quadradinho cabe 1/4 dela: 300 cm², a parte que ele LIMPA.\nÁrea suja de 1 canto: o que sobra do quadradinho, 400 − 300 = 100 cm². Dos 4 cantos: 400 cm².\nChance: área suja ÷ área da sala = 400 ÷ 40 000 = 1%.',
  quadro=dict(titulo='Os cantos que o robô não alcança', pede='A chance de a migalha cair num canto sem limpar',
    dados=['\\text{sala} = 200\\,\\text{cm}', 'r = 20\\,\\text{cm}', '\\pi = 3'],
    formula='\\text{chance} = \\frac{\\text{área suja}}{\\text{área da sala}}',
    contas=['\\text{quadradinho} = 20 \\times 20 = 400', '\\text{parte limpa} = \\frac{3 \\times 20 \\times 20}{4} = 300', '\\text{suja, 1 canto} = 400 - 300 = 100', '\\text{suja, 4 cantos} = 4 \\times 100 = 400\\,\\text{cm}^2', '\\text{sala} = 200 \\times 200 = 40\\,000\\,\\text{cm}^2', '\\frac{400}{40\\,000} = \\frac{1}{100}'],
    resultado='1\\%', nota='Passe tudo para cm antes.'),
  titulo_funciona='Por que funciona: juntando os cantos',
  funciona='Junte os 4 cantos: eles formam um quadrado de 40 × 40 (1 600) menos um robô inteiro (3 × 400 = 1 200).\n1 600 − 1 200 = 400 cm², o mesmo de antes.\nCom π = 3, o robô ocupa 3/4 do quadrado em volta dele: sobra 1/4, que é 400 de 1 600.',
  resposta='Letra B, 1%.\nA (0,25%) contou um canto só.\nE (0,75%) usou o quarto de robô (300) no lugar do que sobra.\nC (3%) somou os 4 quartos de robô (1 200), que é a parte que ele limpa.\nD (4%) usou o quadradinho inteiro dos 4 cantos (1 600).',
  conferencia='1 canto: 400 - 3*400/4 = 100; 4 cantos 400; sala 40000; 400/40000 = 1%. B. A = 100/40000; E = 300/40000; C = 1200/40000; D = 1600/40000.',
  sua_vez=('Robô de raio 10 cm, π = 3. Quanto ele deixa sem limpar em cada canto?', ['25 cm²', '75 cm²', '100 cm²', '300 cm²'], '25 cm²', '10 × 10 = 100; menos 3 × 100 ÷ 4 = 75; sobra 25.')),

F(id='d2-banco-mat-cob-02', resp='D', objeto='irrigação', cobra='custo',
  confere=(40 * 40 - PI * 20 * 20) * 5,
  enun='Num terreno quadrado de 40 m de lado, um irrigador fica no centro e gira molhando um círculo que encosta nos 4 lados do terreno. Nos cantos, onde a água não chega, o dono vai plantar uma grama que aguenta seca. Cada metro quadrado dessa grama custa R$ 5,00. Use π = 3.\nO gasto com essa grama será de',
  alts=['R$ 400,00', 'R$ 500,00', 'R$ 6 000,00', 'R$ 2 000,00', 'R$ 8 000,00'],
  cena=('cena-irrigacao', ['terreno: 40 m', 'raio: 20 m', 'cantos secos', 'R$ 5 por m²']),
  ideia='Os cantos secos são o terreno menos o círculo molhado: 1 600 − 1 200 = 400 m². A R$ 5 cada metro quadrado, dá R$ 2 000.',
  logica=('quanto custa a grama dos cantos secos.', [('Área do terreno', 'O chão todo.'), ('Área molhada (o círculo)', 'A água chega aqui: não vai grama.'), ('Terreno − molhado', 'O que sobra é onde vai a grama.'), ('Seco × R$ 5', 'Cada m² custa 5: preço = quantidade × preço de 1.')], 'sobra, onde não chega, cantos? Área de fora − área de dentro. Pediu preço? Multiplique no fim.'),
  pergunta='O irrigador molha um círculo dentro de um terreno quadrado.\nA questão quer o preço da grama para os 4 cantos que ficam secos.',
  titulo_acontece='Onde a água não chega',
  acontece='O círculo encosta no meio de cada lado: o raio é metade do lado, 20 m.\nSobram 4 cantinhos secos, um em cada ponta do terreno.\nÁrea seca = terreno − círculo. Depois, cada m² custa R$ 5.',
  visual2={'tipo': 'tabela', 'titulo': 'Terreno dividido', 'cabecalho': ['Parte', 'Conta', 'Área'], 'linhas': [['Terreno', '40 × 40', '1 600 m²'], ['Molhado', '3 × 20 × 20', '1 200 m²'], ['Seco', '1 600 − 1 200', '400 m²']]},
  rapido='Macete de cobrir: área que sobra = figura de fora − figura de dentro.\nTerreno: 40 × 40 = 1 600. Círculo: 3 × 20 × 20 = 1 200.\nSeco: 1 600 − 1 200 = 400 m².\nGrama: 400 × 5 = R$ 2 000.',
  quadro=dict(titulo='Grama dos cantos', pede='Quanto custa a grama dos cantos secos',
    dados=['L = 40\\,\\text{m}', 'r = 20\\,\\text{m}', '\\pi = 3', '5\\,\\text{reais por m}^2'],
    formula='\\text{seco} = L^2 - \\pi r^2',
    contas=['\\text{seco} = 1\\,600 - 1\\,200 = 400\\,\\text{m}^2', '400 \\times 5 = 2\\,000'],
    resultado='2\\,000\\,\\text{reais}', nota='Primeiro a área, depois o preço.'),
  titulo_funciona='Por que funciona: 1/4 do terreno',
  funciona='Com π = 3, o círculo que encosta nos lados ocupa 3 de cada 4 partes do quadrado.\nSobra 1/4: 1 600 ÷ 4 = 400 m², sem calcular o círculo.\nVale para qualquer terreno quadrado com o círculo encostando nos lados.',
  resposta='Letra D, R$ 2 000,00.\nA (R$ 400) é a área seca, esquecendo o preço.\nB (R$ 500) é um canto só (100 m² × 5).\nC (R$ 6 000) pôs grama na parte MOLHADA (1 200 × 5).\nE (R$ 8 000) pôs grama no terreno todo.',
  conferencia='1600 - 3*400 = 400; 400*5 = 2000. D. A = 400; B = 100*5; C = 1200*5; E = 1600*5.',
  sua_vez=('Terreno quadrado de 20 m e irrigador encostando nos lados, π = 3. Área seca?', ['100 m²', '300 m²', '400 m²', '25 m²'], '100 m²', '20 × 20 = 400; molhado 3 × 10 × 10 = 300; seco 100.')),

F(id='d2-banco-mat-cob-03', resp='C', objeto='antena', cobra='menor medida',
  confere=((1.2 ** 2 + 1.6 ** 2) ** 0.5) / 2,
  enun='Um bairro tem a forma de um retângulo de 1,2 km por 1,6 km. A operadora vai pôr uma antena de celular bem no centro do bairro. O sinal chega até uma certa distância da antena, em todas as direções, e precisa alcançar até as casas dos 4 cantos.\nO menor alcance que a antena precisa ter é de',
  alts=['0,6 km', '0,8 km', '1,0 km', '1,4 km', '2,0 km'],
  cena=('cena-antena-bairro', ['bairro: 1,2 × 1,6 km', 'antena no centro', 'chegar nos cantos', '']),
  ideia='O canto é o ponto mais longe do centro: fica a meia diagonal. A diagonal do 1,2 por 1,6 é 2,0 (triângulo 3-4-5), então o alcance é 1,0 km.',
  pecas=[('Alcance', 'Até onde o sinal chega a partir da antena. O sinal forma um círculo, e o alcance é o raio dele.')],
  logica=('o menor alcance que pega os 4 cantos.', [('Achar o ponto mais longe', 'Se o sinal chega no mais longe, chega em todos.'), ('Diagonal (3-4-5)', 'O canto fica na ponta da diagonal.'), ('Diagonal ÷ 2', 'A antena está no meio da diagonal.')], 'alcançar tudo a partir do centro? Alcance = distância até o ponto mais longe.'),
  pergunta='A antena fica no centro e o sinal forma um círculo.\nA questão quer o menor círculo que pega os 4 cantos do bairro.',
  titulo_acontece='Quem fica mais longe',
  acontece='Andando do centro, o meio de cada lado está perto: 0,6 km ou 0,8 km.\nO canto está mais longe que todos: é o fim da meia diagonal.\nSe o sinal chega no canto, chega no bairro todo.',
  visual2={'tipo': 'tabela', 'titulo': 'Do centro até...', 'cabecalho': ['Lugar', 'Distância'], 'linhas': [['meio do lado menor', '0,8 km'], ['meio do lado maior', '0,6 km'], ['um canto', '1,0 km']]},
  rapido='Macete de cobrir: o alcance é do centro até a ponta mais longe.\n1,2 e 1,6 são 3 e 4 vezes 0,4. Triângulo 3-4-5: a diagonal é 5 × 0,4 = 2,0.\nDo centro ao canto: metade, 1,0 km.',
  quadro=dict(titulo='Alcance da antena', pede='O menor alcance que chega aos 4 cantos',
    dados=['1{,}2\\,\\text{km}', '1{,}6\\,\\text{km}'],
    formula='d^2 = 1{,}2^2 + 1{,}6^2',
    contas=['d^2 = 1{,}44 + 2{,}56 = 4', 'd = 2{,}0\\,\\text{km}', '2{,}0 \\div 2 = 1{,}0'],
    resultado='1{,}0\\,\\text{km}', nota='3-4-5 pula a raiz.'),
  titulo_funciona='Por que funciona: pelo meio do lado',
  funciona='Do centro, ande 0,8 km até o meio do lado e depois 0,6 km até o canto.\nEsse caminho forma um triângulo retângulo de lados 0,6 e 0,8: o 3-4-5 de novo, vezes 0,2.\nO lado que falta é 5 × 0,2 = 1,0 km, direto do centro ao canto.',
  resposta='Letra C, 1,0 km.\nB (0,8 km) chega no meio do lado, mas não no canto.\nE (2,0 km) usou a diagonal inteira: a antena está no meio dela.\nD (1,4 km) somou 0,6 + 0,8, como se o sinal andasse pelas ruas em L.',
  conferencia='diag sqrt(1,44+2,56)=2; metade 1,0. C. A = 1,2/2; B = 1,6/2; D = 0,6+0,8; E = diagonal.',
  sua_vez=('Bairro de 0,6 km por 0,8 km, antena no centro. Menor alcance?', ['0,5 km', '0,4 km', '1,0 km', '0,7 km'], '0,5 km', 'Diagonal 1,0 (3-4-5 vezes 0,2); metade 0,5.')),
]

# Jeito "equação em letras" (Pablo, 16/11/2026, aprovado na prévia do robô): tabela do
# que eu tenho, equação com o nome de cada letra, uma tela por letra, o jeito que
# parece certo e por que não dá, volta na equação e a receita da questão parecida.
D = lambda nome, *rotulos: {'tipo': 'diagrama', 'nome': nome, **({'rotulos': list(rotulos)} if rotulos else {})}
EM_LETRAS = {
  'd2-banco-mat-cob-01': dict(
    tenho=[('Lado da sala', '2 m = 200 cm'), ('Raio do robô', '20 cm'), ('π', '3')],
    equacao=dict(texto='C = AC ÷ AS. C é a chance, AC é a área dos cantos sujos, AS é a área da sala.',
      porque='Por que dividir: chance é sempre o que eu quero ÷ o total. Com 100 bolas e 1 premiada, a chance é 1 ÷ 100. Aqui o total é o chão todo, e o que eu quero é o chão sujo.',
      partes=[('C', 'chance'), ('= \\text{AC}', 'área dos cantos sujos'), ('\\div \\text{AS}', 'área da sala')]),
    letras=[
      dict(titulo='Achando AS (área da sala)', texto='A sala é um quadrado: área = lado × lado.\nAS = 200 × 200 = 40 000 cm².'),
      dict(titulo='Onde fica sujo', texto='O robô anda pela sala toda, em faixas da largura dele.\nEle limpa quase tudo: só as 4 pontinhas dos cantos ficam sujas. Aperte o botão e veja.', visual=D('robo-limpando')),
      dict(titulo='Por que o canto fica sujo', texto='O robô encosta nas 2 paredes: o centro dele fica a 20 cm (o raio) de cada uma.\nEle é redondo e o canto é reto: a pontinha nunca é alcançada.', visual=D('canto-zoom')),
      dict(titulo='Achando o sujo de 1 canto', texto='O raio vira o lado do quadradinho do canto: 20 × 20 = 400.\nCorte o robô em 4 fatias pelo centro: 1 fatia cabe no quadradinho. Robô inteiro: 3 × 20 × 20 = 1 200. 1 fatia: 1 200 ÷ 4 = 300, a parte que ele LIMPA.\nSujo = quadradinho − fatia = 400 − 300 = 100 cm².', visual=D('canto-raio')),
      dict(titulo='Achando AC (área dos cantos)', texto='Os 4 cantos são iguais.\nAC = 4 × 100 = 400 cm².'),
    ],
    seu_jeito=dict(texto='Parece certo fazer AC = AS − 4 × área do robô = 40 000 − 4 800.\nMas o robô ANDA: ele é pequeno e passa pela sala toda, como uma vassoura. O tamanho dele não é o que ele limpa.\nEssa conta dá 88%, que nem está nas letras.'),
    volta='AS = 40 000 e AC = 400.\nC = 400 ÷ 40 000 = 1 ÷ 100 = 1%.',
    parecida=([('1. Tabela do que eu tenho', '200 cm, 20 cm, π = 3'), ('2. Equação em letras', 'C = AC ÷ AS'), ('3. Achar cada letra', 'AS = 40 000; AC = 400'), ('4. Substituir', '400 ÷ 40 000 = 1%')],
      'caiu ao acaso numa figura? Chance = área que eu quero ÷ área total.')),
  'd2-banco-mat-cob-02': dict(
    tenho=[('Lado do terreno', '40 m'), ('π', '3'), ('Preço da grama', 'R$ 5 por m²')],
    equacao=dict(texto='G = AS × 5. G é o gasto, AS é a área seca (os 4 cantos).',
      porque='Por que multiplicar: cada m² custa R$ 5, então o preço total é quantos m² × o preço de 1.',
      partes=[('G', 'gasto'), ('= \\text{AS}', 'área seca'), ('\\times 5', 'reais por m²')]),
    letras=[
      dict(titulo='Achando o raio', texto='O círculo encosta no meio de cada lado: o raio vai do centro até o lado.\nRaio = metade do lado = 40 ÷ 2 = 20 m.', visual=D('circulo-no-quadrado')),
      dict(titulo='Achando AS (área seca)', texto='Seco = o terreno menos o círculo molhado.\nTerreno: 40 × 40 = 1 600. Círculo: 3 × 20 × 20 = 1 200.\nAS = 1 600 − 1 200 = 400 m².'),
    ],
    seu_jeito=dict(texto='Parece certo fazer 1 200 × 5.\nMas 1 200 é a parte MOLHADA, onde a grama não vai. A grama vai no que sobra.'),
    volta='AS = 400.\nG = 400 × 5 = R$ 2 000.',
    parecida=([('1. Tabela do que eu tenho', '40 m, π = 3, R$ 5'), ('2. Equação em letras', 'G = AS × 5'), ('3. Achar cada letra', 'AS = 1 600 − 1 200 = 400'), ('4. Substituir', '400 × 5 = 2 000')],
      'sobra, onde não chega, cantos? Área de fora − área de dentro. Pediu preço? Multiplique no fim.')),
  'd2-banco-mat-cob-03': dict(
    tenho=[('Lado menor', '1,2 km'), ('Lado maior', '1,6 km'), ('Antena', 'no centro do bairro')],
    equacao=dict(texto='A = D ÷ 2. A é o alcance, D é a diagonal do bairro.',
      porque='Por que dividir por 2: o ponto mais longe do centro é o canto, na ponta da diagonal. A antena está no meio dela.',
      partes=[('A', 'alcance'), ('= D', 'diagonal do bairro'), ('\\div 2', 'antena no meio')]),
    letras=[
      dict(titulo='Quem fica mais longe', texto='Do centro, o meio dos lados está a 0,6 ou 0,8 km. O canto está mais longe que tudo.\nSe o sinal chega no canto, chega no bairro todo.', visual=D('retangulo-diagonal')),
      dict(titulo='Achando D (a diagonal)', texto='A diagonal é o lado maior de um triângulo retângulo de lados 1,2 e 1,6.\n1,2 e 1,6 são 3 e 4 vezes 0,4: é o triângulo 3-4-5.\nD = 5 × 0,4 = 2,0 km.'),
    ],
    seu_jeito=dict(texto='Parece certo somar 0,6 + 0,8 = 1,4 km.\nMas o sinal vai em linha reta, não pelas ruas em L. O caminho reto é a meia diagonal.'),
    volta='D = 2,0.\nA = 2,0 ÷ 2 = 1,0 km.',
    parecida=([('1. Tabela do que eu tenho', '1,2 km e 1,6 km'), ('2. Equação em letras', 'A = D ÷ 2'), ('3. Achar cada letra', 'D = 2,0 (3-4-5)'), ('4. Substituir', '2,0 ÷ 2 = 1,0')],
      'alcançar tudo a partir do centro? Alcance = distância até o ponto mais longe.')),
}
FICHAS = [{**f, **EM_LETRAS.get(f['id'], {})} for f in FICHAS]

# Robô: cópia da "Aula do Robô Aspirador" (artefato de 17/11/2026), palavra por palavra
# e na mesma ordem. Pablo: "copia exatamente essa explicação, que ficou perfeita:
# palavras, animaçãozinha do robô limpando".
T = lambda titulo, cab, linhas: {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': [list(l) for l in linhas]}
AULA_ROBO = [
  {'titulo': 'O que eu tenho',
   'texto': 'Primeiro, tire os números do enunciado. Tudo em cm, para não misturar.',
   'visual': T('O que eu tenho', ['Informação', 'Valor'], [('Lado da sala', '2 m = 200 cm'), ('Raio do robô', '20 cm'), ('π', '3')])},
  {'titulo': 'A equação em letras',
   'texto': 'A questão quer a chance de a migalha cair num lugar sujo.\nC = AC ÷ AS (chance = área dos cantos sujos ÷ área da sala)\nPor que dividir? Chance é sempre o que eu quero ÷ o total. Num saco com 100 bolas e 1 premiada, a chance é 1 ÷ 100. Aqui o "total" é o chão todo, e "o que eu quero" é o chão sujo.\nAgora é só achar cada letra.',
   'visual': T('As letras', ['Letra', 'O que é'], [('C', 'chance (o que a questão quer)'), ('AC', 'área dos cantos sujos'), ('AS', 'área da sala')])},
  {'titulo': 'Achando AS (área da sala)',
   'texto': 'A sala é um quadrado. Área do quadrado = lado × lado.\nAS = 200 × 200 = 40 000 cm²',
   'visual': D('sala-quadrada')},
  {'titulo': 'Achando AC: o seu jeito',
   'texto': 'Você pensou: AC = AS − 4 × área do robô.\nÁrea do robô = 3 × 20 × 20 = 1 200 (não 12 000: são dois 20).\nDaria 40 000 − 4 800 = 35 200 sujos. Isso dá 88%, e essa letra nem existe.\nPor que não funciona: o robô anda. Ele é pequeno, mas passa pela sala toda, como uma vassoura. Aperte e veja.\nNo fim, ele limpou quase tudo. Só ficam sujas as 4 pontinhas dos cantos.',
   'visual': D('robo-limpando')},
  {'titulo': 'Por que o canto fica sujo',
   'texto': 'O robô encosta nas 2 paredes. O centro dele fica a 20 cm (o raio) de cada parede.\nEle é redondo e o canto é reto: a pontinha nunca é alcançada.',
   'visual': D('canto-zoom')},
  {'titulo': 'Por que cabe 1/4 do robô',
   'texto': 'Corte o robô em 4 fatias iguais pelas linhas que passam no centro.\nO quadradinho do canto tem 20 × 20 e pega exatamente 1 fatia.\nRobô inteiro: 3 × 20 × 20 = 1 200\n1 fatia (parte limpa do quadradinho): 1 200 ÷ 4 = 300',
   'visual': D('robo-quatro-fatias')},
  {'titulo': 'O raio vira o lado do quadradinho',
   'texto': 'O lado do quadradinho é o raio. Então:\nsujo = r × r − (π × r × r) ÷ 4 (quadradinho − ¼ do círculo)\n20 × 20 − (3 × 20 × 20) ÷ 4 = 400 − 300 = 100',
   'visual': D('canto-raio')},
  {'titulo': 'A parte suja de 1 canto',
   'texto': 'Sujo = quadradinho − parte limpa.\nSão 4 cantos iguais: AC = 4 × 100 = 400 cm²',
   'visual': T('1 canto', ['Parte', 'Área'], [('Quadradinho do canto', '20 × 20 = 400'), ('Parte limpa (1 fatia)', '− 300'), ('Sujo em 1 canto', '100 cm²')])},
  {'titulo': 'Volta na equação',
   'texto': 'C = 400 ÷ 40 000 = 1 ÷ 100 = 1%\nLetra B. De cada 100 migalhas, 1 cai num canto sujo.',
   'visual': T('As letras', ['Letra', 'Valor'], [('AS', '40 000'), ('AC', '400')])},
  {'titulo': 'Questão parecida? Faça assim',
   'texto': 'Pista: "cai ao acaso" numa figura → chance = área que eu quero ÷ área total.',
   'visual': T('A receita', ['Passo', 'Neste robô'], [('1. Tabela do que eu tenho', '200 cm, 20 cm, π = 3'), ('2. Equação em letras', 'C = AC ÷ AS'), ('3. Achar cada letra', 'AS = 40 000; AC = 400'), ('4. Substituir', '400 ÷ 40 000 = 1%')])},
]
FICHAS = [{**f, 'passos_prontos': AULA_ROBO} if f['id'] == 'd2-banco-mat-cob-01' else f for f in FICHAS]
