"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Combinatória e
Probabilidade (princípio multiplicativo, arranjo, combinação, probabilidade, "não
acontecer") e um que junta. Âncoras reais (só estudo): ENEM 2023 D2 (senhas; sorteio de
um estudante). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_combinatoria"""

ARQUIVO = '../escada/matematica-base-combinatoria'

SENHAS = 'ENEM 2023 D2 (três tipos de senha)'
SORTEIO = 'ENEM 2023 D2 (sorteio de um estudante)'


def M(nivel='facil'):
  return {'materia': 'Matemática', 'tema': 'Análise Combinatória e Probabilidade', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**M(), id='d2-escada-mat-com-03', resp='D', objeto='lanche na cantina', cobra='princípio multiplicativo', confere=4 * 3,
  ancora=SENHAS, canal='mat-36 [21:38:00] princípio multiplicativo',
  enun='Numa cantina, o lanche é montado com 1 salgado e 1 suco. Há 4 tipos de salgado e 3 tipos de suco. De quantas maneiras diferentes dá para montar o lanche?',
  alts=['7', '4', '64', '12', '24'],
  ideia='Cada um dos 4 salgados combina com os 3 sucos: 4 × 3 = 12 lanches.',
  pecas=[('Maneiras diferentes', 'Lanches que mudam no salgado, no suco ou nos dois.')],
  conferencia='4×3 = 12. D. A = soma; B = só salgados; C = 4³; E = 12×2.',
  sua_vez=('5 camisetas e 2 bermudas. Quantas roupas diferentes?', ['10', '7', '25', '3'], '10', '5 × 2 = 10.'),
  aula=dict(
    formulas=[('contagem', 'Princípio multiplicativo', 'total = opções da 1ª escolha × opções da 2ª')],
    tenho=[('Salgados', '4'), ('Sucos', '3')],
    quer='A questão quer quantos lanches diferentes existem.',
    equacao='t = s × u (total = salgados × sucos)',
    porque='Por que multiplicar? Com 2 salgados e 3 sucos: 3 lanches com o 1º e 3 com o 2º, 3 + 3 = 6.',
    letras=[('t', 'total de lanches (o que a questão quer)'), ('s', 'número de salgados'), ('u', 'número de sucos')],
    telas=[tela('Achando s (salgados)', 'O enunciado dá direto.\ns = 4'),
           tela('Achando u (sucos)', 'O enunciado dá direto.\nu = 3')],
    volta='t = 4 × 3 = 12\nLetra D.',
    valores=[('s', '4'), ('u', '3')],
    pista='uma coisa de cada grupo → multiplique as opções.',
    receita=receita('4 salgados, 3 sucos', 't = s × u', 's = 4; u = 3', '4 × 3 = 12'))),

dict(**M(), id='d2-escada-mat-com-04', resp='B', objeto='pódio da corrida', cobra='arranjo: escolher com ordem', confere=5 * 4 * 3,
  ancora=SENHAS, canal='mat-37 [22:19:02] arranjo simples',
  enun='Numa corrida com 5 atletas, de quantas maneiras diferentes pode ficar o pódio com 1º, 2º e 3º lugar? Não há empate.',
  alts=['125', '60', '15', '10', '12'],
  ideia='São 5 opções para o 1º, sobram 4 para o 2º e 3 para o 3º: 5 × 4 × 3 = 60.',
  pecas=[('Pódio', 'Os três primeiros lugares, em ordem.'), ('Empate', 'Dois atletas no mesmo lugar.')],
  conferencia='5×4×3 = 60. B. A = repetindo atleta; C = 5×3; D = combinação; E = 5+4+3.',
  sua_vez=('4 pessoas, escolher presidente e vice. Maneiras?', ['12', '16', '6', '7'], '12', '4 × 3 = 12.'),
  aula=dict(
    formulas=[('contagem', 'Escolha com ordem', 'multiplique as opções de cada lugar, uma a menos a cada vez')],
    tenho=[('Atletas', '5'), ('Lugares', '3')],
    quer='A questão quer quantos pódios diferentes existem.',
    equacao='p = a × b × c (pódios = opções do 1º × do 2º × do 3º lugar)',
    porque='Por que vai diminuindo? Quem já ficou em 1º não pode ficar também em 2º.',
    letras=[('p', 'número de pódios (o que a questão quer)'), ('a', 'opções para o 1º lugar'), ('b', 'opções para o 2º lugar'), ('c', 'opções para o 3º lugar')],
    telas=[tela('Achando a (1º lugar)', 'Qualquer um dos atletas.\na = 5'),
           tela('Achando b (2º lugar)', 'Um já foi usado.\nb = 5 − 1 = 4'),
           tela('Achando c (3º lugar)', 'Dois já foram usados.\nc = 5 − 2 = 3')],
    volta='p = 5 × 4 × 3\n5 × 4 = 20\n20 × 3 = 60\nLetra B.',
    valores=[('a', '5'), ('b', '4'), ('c', '3')],
    pista='a ordem importa (1º, 2º, 3º) → multiplique, tirando um a cada lugar.',
    receita=receita('5 atletas, 3 lugares', 'p = a × b × c', 'a = 5; b = 4; c = 3', '5 × 4 × 3 = 60'))),

dict(**M(), id='d2-escada-mat-com-05', resp='A', objeto='dupla para o trabalho', cobra='combinação: escolher sem ordem', confere=6 * 5 / 2,
  ancora=SENHAS, canal='mat-39 [23:47:30] combinação simples',
  enun='Um professor vai escolher uma dupla entre 6 alunos para apresentar um trabalho. Os dois têm a mesma função. Quantas duplas diferentes podem ser formadas?',
  alts=['15', '30', '36', '12', '11'],
  ideia='Contando com ordem são 6 × 5 = 30, mas cada dupla apareceu 2 vezes: 30 ÷ 2 = 15.',
  pecas=[('Dupla', 'Duas pessoas, sem primeira nem segunda.')],
  conferencia='6×5/2 = 15. A. B = com ordem; C = repetindo; D = 6×2; E = 6+5.',
  sua_vez=('4 amigos, escolher uma dupla. Quantas?', ['6', '12', '16', '8'], '6', '4 × 3 = 12; 12 ÷ 2 = 6.'),
  aula=dict(
    formulas=[('contagem', 'Dupla sem ordem', 'duplas = escolhas com ordem ÷ 2')],
    tenho=[('Alunos', '6'), ('Pessoas na dupla', '2')],
    quer='A questão quer quantas duplas diferentes existem.',
    equacao='d = c ÷ r (duplas = contagem com ordem ÷ repetições de cada dupla)',
    porque='Por que dividir? "Ana e Bia" e "Bia e Ana" são a mesma dupla, contada 2 vezes.',
    letras=[('d', 'número de duplas (o que a questão quer)'), ('c', 'contagem com ordem: 1º escolhido e 2º escolhido'), ('r', 'quantas vezes cada dupla foi contada')],
    telas=[tela('Achando c (com ordem)', '6 opções para o primeiro, 5 para o segundo.\nc = 6 × 5 = 30'),
           tela('Achando r (repetições)', 'Cada dupla aparece nas duas ordens.\nr = 2'),
           tela('O seu jeito', 'Parece certo parar em 30, a letra B.\n30 conta cada dupla duas vezes.')],
    volta='d = 30 ÷ 2 = 15\nLetra A.',
    valores=[('c', '30'), ('r', '2')],
    pista='dupla com a mesma função → conte com ordem e divida por 2.',
    receita=receita('6 alunos, duplas', 'd = c ÷ r', 'c = 30; r = 2', '30 ÷ 2 = 15'))),

dict(**M(), id='d2-escada-mat-com-06', resp='E', objeto='rifa da turma', cobra='probabilidade: favoráveis ÷ total', confere=3,
  ancora=SORTEIO, canal='mat-41 [25:07:02] casos favoráveis e espaço de possibilidades',
  enun='Numa rifa há 20 bilhetes, e um único bilhete será sorteado. Lia comprou 3 deles. Qual é a probabilidade de Lia ganhar?',
  alts=['3/17', '1/20', '1/3', '17/20', '3/20'],
  ideia='São 3 bilhetes bons para Lia num total de 20: a chance é 3 em 20.',
  pecas=[('Probabilidade', 'A chance: casos bons sobre todos os casos.'), ('3/20', 'Lê-se três em vinte.')],
  conferencia='3/20. E. A = bons sobre ruins; B = um bilhete; C = 1 sobre os dela; D = chance de perder.',
  sua_vez=('10 bolas, 7 azuis. Chance de sair azul?', ['7/10', '7/3', '3/10', '1/7'], '7/10', '7 boas em 10.'),
  aula=dict(
    formulas=[('contagem', 'Probabilidade', 'chance = casos bons ÷ todos os casos')],
    tenho=[('Bilhetes', '20'), ('Bilhetes da Lia', '3')],
    quer='A questão quer a chance de sair um bilhete da Lia.',
    equacao='p = b ÷ t (probabilidade = bilhetes bons ÷ total de bilhetes)',
    porque='Por que sobre o total? Com 1 bilhete bom em 2, a chance é 1 de 2, escrito 1/2: metade.',
    letras=[('p', 'probabilidade (o que a questão quer)'), ('b', 'bilhetes bons: os da Lia'), ('t', 'total de bilhetes')],
    telas=[tela('Achando b (bons)', 'O enunciado dá direto.\nb = 3'),
           tela('Achando t (total)', 'O enunciado dá direto.\nt = 20')],
    volta='p = 3/20\nTrês chances em vinte.\nLetra E.',
    valores=[('b', '3'), ('t', '20')],
    pista='"qual a probabilidade" → o que serve sobre tudo que pode sair.',
    receita=receita('20 bilhetes, 3 dela', 'p = b ÷ t', 'b = 3; t = 20', '3/20'))),

dict(**M(), id='d2-escada-mat-com-07', resp='C', objeto='previsão de chuva', cobra='probabilidade de não acontecer', confere=100 - 30,
  ancora=SORTEIO, canal='mat-41 [25:17:30] o que não acontece completa o todo',
  enun='A previsão diz que a probabilidade de chover amanhã é de 30%. Qual é a probabilidade de não chover?',
  alts=['30%', '3%', '70%', '130%', '50%'],
  ideia='Chover ou não chover completam 100%: se chover vale 30%, não chover vale 100 − 30 = 70%.',
  pecas=[('%', 'Lê-se por cento: partes de cada 100.')],
  conferencia='100-30 = 70. C. A = a própria; B = 30/10; D = soma; E = achou meio a meio.',
  sua_vez=('Chance de acertar: 40%. Chance de errar?', ['60%', '40%', '140%', '50%'], '60%', '100 − 40 = 60%.'),
  aula=dict(
    formulas=[('porcentagem', 'Não acontecer', 'chance de não = 100% − chance de sim')],
    tenho=[('Chance de chover', '30%'), ('Tudo junto', '100%, para decorar')],
    quer='A questão quer a chance de ficar sem chuva.',
    equacao='n = t − c (não chover = tudo − chover)',
    porque='Por que subtrair de 100%? De 100 partes, as que não são de chuva são de tempo sem chuva. Juntas dão as 100.',
    letras=[('n', 'chance de não chover (o que a questão quer)'), ('t', 'tudo: 100%'), ('c', 'chance de chover')],
    telas=[tela('Achando t (tudo)', 'Somando todas as chances dá 100% (para decorar).\nt = 100'),
           tela('Achando c (chover)', 'O enunciado dá direto.\nc = 30')],
    volta='n = 100 − 30 = 70%\nLetra C.',
    valores=[('t', '100'), ('c', '30')],
    pista='"probabilidade de não" → 100% menos a de sim.',
    receita=receita('30% de chuva', 'n = t − c', 't = 100; c = 30', '100 − 30 = 70'))),

dict(**M('medio'), id='d2-escada-mat-com-08', resp='B', objeto='senha de dois dígitos', cobra='probabilidade com contagem das senhas', confere=1,
  ancora=SENHAS, canal='mat-41 [25:07:02] probabilidade usando a contagem dos casos',
  enun='Uma senha tem uma letra seguida de um número. A letra é A, B ou C, e o número é 1, 2, 3 ou 4. Alguém tenta uma senha ao acaso, uma única vez. Qual é a probabilidade de acertar?',
  alts=['1/7', '1/12', '2/12', '1/4', '1/3'],
  ideia='Primeiro conte as senhas: 3 × 4 = 12. Só 1 é a certa: a chance é 1/12.',
  pecas=[('Ao acaso', 'Chutando, sem saber nada.'), ('1/12', 'Lê-se um em doze.')],
  conferencia='12 senhas; 1/12. B. A = somou; C = duas tentativas; D = só número; E = só letra.',
  sua_vez=('2 letras e 5 números (uma de cada). Chance de acertar de primeira?', ['1/10', '1/7', '1/5', '1/2'], '1/10', '2 × 5 = 10 senhas: 1/10.'),
  aula=dict(
    formulas=[('contagem', 'Contar as senhas', 'total = letras × números'), ('contagem', 'Probabilidade', 'chance = casos bons ÷ total')],
    tenho=[('Letras', '3'), ('Números', '4'), ('Senha certa', '1')],
    quer='A questão quer a chance de acertar chutando uma vez.',
    equacao='p = b ÷ t (probabilidade = senhas certas ÷ total de senhas)',
    porque='Por que contar primeiro? Sem saber quantas senhas existem, não há como achar a chance.',
    letras=[('p', 'probabilidade (o que a questão quer)'), ('b', 'senhas certas'), ('t', 'total de senhas')],
    telas=[tela('Achando b (certas)', 'Só uma senha abre.\nb = 1'),
           tela('Achando t (total)', 'Cada letra combina com cada número.\nt = 3 × 4 = 12'),
           tela('O seu jeito', 'Parece certo somar, 3 + 4 = 7, e marcar a letra A.\nA senha usa uma letra junto com um número: multiplique.')],
    volta='p = 1/12\nUma chance em doze.\nLetra B.',
    valores=[('b', '1'), ('t', '12')],
    pista='chance de acertar uma senha → conte todas e faça 1 sobre o total.',
    receita=receita('3 letras, 4 números', 'p = b ÷ t', 'b = 1; t = 12', '1/12'))),
]
