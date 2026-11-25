"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Estatística
(média, mediana, moda, média ponderada pelo peso) e um que junta. Âncoras reais (só
estudo): ENEM 2022 D2 (mediana de valores) e ENEM 2023 D2 (média, mediana e moda).
Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_estatistica"""

ARQUIVO = '../escada/matematica-base-estatistica'

MEDIANA = 'ENEM 2022 D2 (mediana de valores em milhão de reais)'
TRES = 'ENEM 2023 D2 (comparar média, mediana e moda)'


def M(nivel='facil'):
  return {'materia': 'Matemática', 'tema': 'Estatística', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**M(), id='d2-escada-mat-est-b01', resp='D', objeto='notas de provas', cobra='média aritmética', confere=(6 + 7 + 11) / 3,
  ancora=TRES, canal='mat-44 [27:19:31] média',
  enun='Um time marcou 6, 7 e 11 pontos em três jogos. Qual foi a média de pontos por jogo?',
  alts=['7', '24', '12', '8', '5'],
  ideia='Junte tudo, 24 pontos, e reparta igualmente pelos 3 jogos: 8 em cada.',
  pecas=[('Média', 'O valor que cada um teria se o total fosse repartido por igual.')],
  conferencia='24/3 = 8. D. A = o do meio; B = só a soma; C = 24/2; E = diferença.',
  sua_vez=('Notas 4, 6 e 8. Média?', ['6', '18', '9', '4'], '6', '18 ÷ 3 = 6.'),
  aula=dict(
    formulas=[('media', 'Média', 'média = soma de todos ÷ quantos são')],
    tenho=[('Pontos', '6, 7 e 11'), ('Jogos', '3')],
    quer='A questão quer os pontos de cada jogo se fossem iguais.',
    equacao='m = s ÷ n (média = soma ÷ número de jogos)',
    porque='Por que dividir? Com 4 e 6 pontos: juntos 10, repartidos em 2 jogos, 5 em cada.',
    letras=[('m', 'média (o que a questão quer)'), ('s', 'soma dos pontos'), ('n', 'número de jogos')],
    telas=[tela('Achando s (soma)', '6 + 7 = 13\ns = 13 + 11 = 24'),
           tela('Achando n (jogos)', 'O enunciado dá direto.\nn = 3')],
    volta='m = 24 ÷ 3 = 8\nLetra D.',
    valores=[('s', '24'), ('n', '3')],
    pista='"média" → some tudo e divida por quantos são.',
    receita=receita('6, 7, 11', 'm = s ÷ n', 's = 24; n = 3', '24 ÷ 3 = 8'))),

dict(**M(), id='d2-escada-mat-est-b02', resp='B', objeto='idades num grupo', cobra='mediana: o do meio, depois de ordenar', confere=14,
  ancora=MEDIANA, canal='fora do canal: mediana não achada em mat-43 e mat-44',
  enun='As idades de cinco jogadores são 19, 12, 18, 14 e 13 anos. Qual é a mediana dessas idades?',
  alts=['13', '14', '15,2', '18', '12'],
  ideia='Em ordem ficam 12, 13, 14, 18, 19: o do meio é 14.',
  pecas=[('Mediana', 'O número do meio, com todos em ordem.'), ('Em ordem', 'Do menor para o maior.')],
  conferencia='ordenado 12,13,14,18,19; meio 14. B. A = o último sem ordenar; C = a média; D = meio sem ordenar; E = o menor.',
  sua_vez=('Mediana de 9, 2 e 5?', ['5', '2', '9', '16'], '5', 'Em ordem: 2, 5, 9.'),
  aula=dict(
    formulas=[('media', 'Mediana', 'ponha em ordem e pegue o do meio')],
    tenho=[('Idades', '19, 12, 18, 14, 13'), ('Quantidade', '5')],
    quer='A questão quer a idade do meio, com todas em ordem.',
    equacao='p = (n + 1) ÷ 2 (posição do meio = (quantidade + 1) ÷ 2)',
    porque='Em ordem, com 3 números o meio é o 2º: (3 + 1) ÷ 2 = 2. Fora de ordem, o meio muda.',
    letras=[('p', 'posição do meio na fila'), ('n', 'quantidade de idades')],
    telas=[tela('Pondo em ordem', 'Do menor para o maior:\n12, 13, 14, 18, 19'),
           tela('Achando n (quantidade)', 'Conte as idades.\nn = 5'),
           tela('O seu jeito', 'Parece certo pegar o meio da lista como veio, 18, a letra D.\nPrimeiro ordene, depois pegue o meio.')],
    volta='p = (5 + 1) ÷ 2 = 3\nA 3ª idade em ordem é 14.\nLetra B.',
    valores=[('n', '5')],
    pista='"mediana" → ordenar e pegar o do meio.',
    receita=receita('19, 12, 18, 14, 13', 'p = (n + 1) ÷ 2', 'n = 5', '3ª posição: 14'))),

dict(**M(), id='d2-escada-mat-est-b03', resp='E', objeto='tamanhos de tênis vendidos', cobra='moda: o valor que mais aparece', confere=38,
  ancora=TRES, canal='mat-43 [26:42:32] moda',
  enun='Uma loja vendeu tênis dos números 37, 38, 40, 38, 39, 38 e 40. Qual é a moda desses números?',
  alts=['40', '39', '3', '7', '38'],
  ideia='O número 38 aparece 3 vezes, mais do que qualquer outro: ele é a moda.',
  pecas=[('Moda', 'O valor que mais aparece.')],
  conferencia='38 aparece 3×. E. A = aparece 2×; B = chute vizinho; C = quantas vezes; D = quantos tênis.',
  sua_vez=('Moda de 5, 7, 5, 9, 5, 7?', ['5', '7', '9', '3'], '5', 'O 5 aparece 3 vezes.'),
  aula=dict(
    formulas=[('contagem', 'Moda', 'conte as repetições e pegue o campeão')],
    tenho=[('Números', '37, 38, 40, 38, 39, 38, 40')],
    quer='A questão quer o número de tênis que mais saiu.',
    equacao='m = número com r repetições (moda = o número da maior contagem r)',
    porque='Por que contar? A moda não faz soma nem divisão: só olha quem se repete mais.',
    letras=[('m', 'moda (o que a questão quer)'), ('r', 'a maior contagem de repetições')],
    telas=[tela('Achando r (maior contagem)', '37: 1 vez\n38: 3 vezes\n39: 1 vez\n40: 2 vezes\nr = 3'),
           tela('O seu jeito', 'Parece certo responder 3, a letra C.\n3 é quantas vezes; a moda é o número do tênis.')],
    volta='m = 38\nLetra E.',
    valores=[('r', '3')],
    pista='"moda" → o valor repetido mais vezes.',
    receita=receita('sete números', 'm = o campeão', '38 aparece 3 vezes', 'm = 38'))),

dict(**M(), id='d2-escada-mat-est-b04', resp='A', objeto='nota com pesos', cobra='média ponderada pelo peso', confere=(5 * 1 + 9 * 3) / (1 + 3),
  ancora=TRES, canal='mat-44 [27:20:30] cada valor multiplicado pelo seu peso',
  enun='Numa matéria, o trabalho tem peso 1 e a prova tem peso 3. Um aluno tirou 5 no trabalho e 9 na prova. Qual é a média dele?',
  alts=['8', '7', '32', '16', '6'],
  ideia='A prova conta 3 vezes: 5 + 9 + 9 + 9 = 32, repartidos por 4, dão 8.',
  pecas=[('Peso', 'Quantas vezes a nota conta.')],
  conferencia='(5+27)/4 = 8. A. B = média simples; C = só a soma; D = 32/2; E = pesos trocados.',
  sua_vez=('Nota 4 com peso 1 e nota 10 com peso 2. Média?', ['8', '7', '24', '6'], '8', '4 + 20 = 24; 24 ÷ 3 = 8.'),
  aula=dict(
    formulas=[('media', 'Média com peso', 'cada nota × peso, somar, dividir pela soma dos pesos')],
    tenho=[('Trabalho', 'nota 5, peso 1'), ('Prova', 'nota 9, peso 3')],
    quer='A questão quer a média contando a prova 3 vezes.',
    equacao='m = s ÷ p (média = soma com pesos ÷ soma dos pesos)',
    porque='Por que dividir pela soma dos pesos? É como ter 4 notas: uma do trabalho e três da prova.',
    letras=[('m', 'média (o que a questão quer)'), ('s', 'soma das notas já multiplicadas pelo peso'), ('p', 'soma dos pesos')],
    telas=[tela('Achando s (soma com pesos)', '5 × 1 = 5\n9 × 3 = 27\ns = 5 + 27 = 32'),
           tela('Achando p (soma dos pesos)', 'Os dois pesos juntos.\np = 1 + 3 = 4'),
           tela('O seu jeito', 'Parece certo fazer a média de 5 e 9, que dá 7, a letra B.\nA prova vale mais que o trabalho.')],
    volta='m = 32 ÷ 4 = 8\nLetra A.',
    valores=[('s', '32'), ('p', '4')],
    pista='"peso" → multiplique cada um pelo peso e divida pela soma dos pesos.',
    receita=receita('5 peso 1; 9 peso 3', 'm = s ÷ p', 's = 32; p = 4', '32 ÷ 4 = 8'))),

dict(**M('medio'), id='d2-escada-mat-est-b05', resp='C', objeto='livros lidos', cobra='comparar média e mediana na mesma lista', confere=(1 + 2 + 3 + 4 + 15) / 5 - 3,
  ancora=TRES, canal='mat-44 [27:19:31] média; mediana fora do canal',
  enun='Cinco amigos leram 1, 2, 3, 4 e 15 livros num ano. Quanto a média de livros é maior que a mediana?',
  alts=['5', '3', '2', '8', '0'],
  ideia='A média é 25 ÷ 5 = 5 e a mediana é o do meio, 3: a diferença é 2.',
  pecas=[('Média', 'A soma repartida por igual.'), ('Mediana', 'O número do meio, com todos em ordem.')],
  conferencia='5-3 = 2. C. A = a média; B = a mediana; D = diferença errada; E = achou iguais.',
  sua_vez=('Em 2, 3 e 10, quanto a média é maior que a mediana?', ['2', '5', '3', '7'], '2', 'Média 5; mediana 3; 5 − 3 = 2.'),
  aula=dict(
    formulas=[('media', 'Média', 'soma ÷ quantos são'), ('media', 'Mediana', 'o do meio, em ordem')],
    tenho=[('Livros', '1, 2, 3, 4, 15'), ('Amigos', '5')],
    quer='A questão quer a diferença entre a média e a mediana.',
    equacao='d = m − e (diferença = média − mediana)',
    porque='Por que são diferentes? O 15 puxa a média para cima, mas não muda quem está no meio.',
    letras=[('d', 'diferença (o que a questão quer)'), ('m', 'média'), ('e', 'mediana, o elemento do meio')],
    telas=[tela('Achando m: a soma', '1 + 2 + 3 + 4 = 10\n10 + 15 = 25'),
           tela('Achando m (média)', 'm = 25 ÷ 5 = 5'),
           tela('Achando e (mediana)', 'Já estão em ordem. O 3º dos 5 é o do meio.\ne = 3')],
    volta='d = 5 − 3 = 2\nLetra C.',
    valores=[('m', '5'), ('e', '3')],
    pista='pede duas medidas → ache uma de cada vez e compare.',
    receita=receita('1, 2, 3, 4, 15', 'd = m − e', 'm = 5; e = 3', '5 − 3 = 2'))),
]
