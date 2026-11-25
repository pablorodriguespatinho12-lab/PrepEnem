"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Funções
(valor da função, fixo + variável, achar a taxa, raiz, ler tabela) e um que junta.
Âncora real (só estudo): ENEM 2022 D2 (salário de um vendedor em função das peças).
Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_funcoes"""

ARQUIVO = '../escada/matematica-base-funcoes'

SALARIO = 'ENEM 2022 D2 (salário em função das peças vendidas)'


def M(nivel='facil'):
  return {'materia': 'Matemática', 'tema': 'Funções', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**M(), id='d2-escada-mat-fun-b01', resp='C', objeto='máquina de números', cobra='valor de uma função', confere=3 * 4 + 2,
  ancora=SALARIO, canal='mat-08 [4:18:31] função do primeiro grau',
  enun='Uma função é dada por f(x) = 3x + 2. Qual é o valor de f(4)?',
  alts=['9', '12', '14', '36', '18'],
  ideia='f(4) quer dizer: ponha 4 no lugar do x. Fica 3 × 4 + 2 = 14.',
  pecas=[('f(x)', 'Lê-se f de x: o resultado que depende do número x.'), ('3x', 'Quer dizer 3 vezes x.')],
  conferencia='3×4+2 = 14. C. A = soma 3+4+2; B = esqueceu o 2; D = 34+2; E = 3×(4+2).',
  sua_vez=('f(x) = 2x + 1. Quanto é f(5)?', ['11', '8', '26', '12'], '11', '2 × 5 + 1 = 11.'),
  aula=dict(
    formulas=[('grafico', 'Valor da função', 'troque o x pelo número e faça a conta')],
    tenho=[('Multiplica x', '3'), ('Somado', '2'), ('Número no lugar de x', '4')],
    quer='A questão quer o resultado quando x vale 4.',
    equacao='r = m × x + s (resultado = multiplicador × x + somado)',
    porque='Por que multiplicar antes? 3x é "três vezes x": com x = 1, dá 3 × 1 + 2 = 5.',
    letras=[('r', 'resultado f(4) (o que a questão quer)'), ('m', 'número que multiplica x'), ('x', 'número que entra'), ('s', 'número somado')],
    telas=[tela('Achando m (multiplica)', 'Está na função.\nm = 3'),
           tela('Achando x (entrada)', 'Está dentro de f(4).\nx = 4'),
           tela('Achando s (somado)', 'Está na função.\ns = 2')],
    volta='3 × 4 = 12\nr = 12 + 2 = 14\nLetra C.',
    valores=[('m', '3'), ('x', '4'), ('s', '2')],
    pista='f de um número → ponha o número no lugar do x.',
    receita=receita('f(x) = 3x + 2; x = 4', 'r = m × x + s', 'm = 3; x = 4; s = 2', '12 + 2 = 14'))),

dict(**M(), id='d2-escada-mat-fun-b02', resp='A', objeto='conta do estacionamento', cobra='parte fixa mais parte variável', confere=7 + 4 * 3,
  ancora=SALARIO, canal='mat-10 [5:03:33] valor de partida e quanto cresce',
  enun='Um estacionamento cobra R$ 7,00 de entrada mais R$ 4,00 por hora. Quanto paga, em reais, quem fica 3 horas?',
  alts=['19', '33', '25', '14', '12'],
  ideia='A entrada se paga uma vez só e a hora se repete: 7 + 4 × 3 = 19.',
  pecas=[('Fixo', 'O que se paga uma vez, não importa o tempo.'), ('Variável', 'O que muda com o tempo.')],
  conferencia='7+12 = 19. A. B = (7+4)×3; C = 7×3+4; D = soma; E = só as horas.',
  sua_vez=('Taxa de 5 mais 2 por hora; 4 horas. Total?', ['13', '28', '22', '11'], '13', '2 × 4 = 8; 5 + 8 = 13.'),
  aula=dict(
    formulas=[('grafico', 'Fixo mais variável', 'total = fixo + preço da hora × horas')],
    tenho=[('Entrada', '7'), ('Por hora', '4'), ('Horas', '3')],
    quer='A questão quer o total pago.',
    equacao='t = fix + q × h (total = fixo + preço da hora × horas)',
    porque='Por que só a hora multiplica? Em 2 horas: paga 7 uma vez, mais 4 e mais 4.',
    letras=[('t', 'total (o que a questão quer)'), ('fix', 'parte fixa'), ('q', 'preço de cada hora'), ('h', 'horas')],
    telas=[tela('Achando fix (fixo)', 'O enunciado dá direto.\nfix = 7'),
           tela('Achando q (preço da hora)', 'O enunciado dá direto.\nq = 4'),
           tela('Achando h (horas)', 'O enunciado dá direto.\nh = 3')],
    volta='4 × 3 = 12\nt = 7 + 12 = 19\nLetra A.',
    valores=[('fix', '7'), ('q', '4'), ('h', '3')],
    pista='"de entrada mais por hora" → fixo + hora × horas.',
    receita=receita('7 e 4 por hora; 3 h', 't = fix + q × h', 'fix = 7; q = 4; h = 3', '7 + 12 = 19'))),

dict(**M(), id='d2-escada-mat-fun-b03', resp='D', objeto='planta crescendo', cobra='achar a taxa de crescimento', confere=(26 - 14) / (6 - 2),
  ancora=SALARIO, canal='mat-10 [4:48:00] o quanto a reta sobe',
  enun='Uma planta cresce sempre no mesmo ritmo. No dia 2 ela media 14 cm, e no dia 6 media 26 cm. Quantos centímetros ela cresce por dia?',
  alts=['12', '7', '4', '3', '2'],
  ideia='Em 4 dias ela cresceu 12 cm: são 12 ÷ 4 = 3 cm por dia.',
  pecas=[('Ritmo', 'Quanto muda a cada dia, sempre igual.')],
  conferencia='12/4 = 3. D. A = só o crescimento; B = 14/2; C = só os dias; E = 12/6.',
  sua_vez=('No dia 1: 10 cm; no dia 3: 20 cm. Cresce quanto por dia?', ['5', '10', '20', '15'], '5', '10 cm em 2 dias: 5.'),
  aula=dict(
    formulas=[('grafico', 'Taxa', 'por dia = quanto cresceu ÷ dias que passaram')],
    tenho=[('Dia 2', '14 cm'), ('Dia 6', '26 cm')],
    quer='A questão quer o crescimento de um único dia.',
    equacao='t = c ÷ p (taxa = crescimento ÷ dias passados)',
    porque='Por que dividir? Se crescesse 10 cm em 2 dias, seriam 10 ÷ 2 = 5 em cada dia.',
    letras=[('t', 'crescimento por dia, a taxa (o que a questão quer)'), ('c', 'quanto cresceu, em cm'), ('p', 'dias passados')],
    telas=[tela('Achando c (crescimento)', 'Altura depois menos altura antes.\nc = 26 − 14 = 12'),
           tela('Achando p (dias passados)', 'Dia depois menos dia antes.\np = 6 − 2 = 4'),
           tela('O seu jeito', 'Parece certo fazer 14 ÷ 2 = 7, a letra B.\nA planta não começou do zero no dia 0.')],
    volta='t = 12 ÷ 4 = 3 cm por dia\nLetra D.',
    valores=[('c', '12'), ('p', '4')],
    pista='dois momentos e pede "por dia" → diferença ÷ diferença.',
    receita=receita('dia 2: 14; dia 6: 26', 't = c ÷ p', 'c = 12; p = 4', '12 ÷ 4 = 3'))),

dict(**M(), id='d2-escada-mat-fun-b04', resp='E', objeto='tanque esvaziando', cobra='raiz: quando a função dá zero', confere=60 / 5,
  ancora=SALARIO, canal='mat-09 [4:33:00] raiz é onde a função vale zero',
  enun='A água de um tanque, em litros, é dada por f(t) = 60 − 5t, em que t é o tempo em minutos. Depois de quantos minutos o tanque fica vazio?',
  alts=['60', '55', '300', '5', '12'],
  ideia='Vazio é água igual a zero: 5 litros por minuto precisam gastar os 60, e 60 ÷ 5 = 12 minutos.',
  pecas=[('f(t)', 'Lê-se f de t: a água que há no minuto t.'), ('5t', 'Quer dizer 5 vezes t.'), ('Raiz', 'O número que faz a função dar zero.')],
  conferencia='60/5 = 12. E. A = o começo; B = 60-5; C = 60×5; D = a taxa.',
  sua_vez=('f(t) = 20 − 4t. Quando dá zero?', ['5', '16', '80', '4'], '5', '20 ÷ 4 = 5.'),
  aula=dict(
    formulas=[('grafico', 'Raiz', 'iguale a função a zero')],
    tenho=[('Água no começo', '60'), ('Sai por minuto', '5')],
    quer='A questão quer o minuto em que a água acaba.',
    equacao='t = a ÷ s (tempo = água no começo ÷ quanto sai por minuto)',
    porque='Por que zero? Tanque vazio tem 0 litro: 60 − 5t = 0, como 8 − 8 = 0, o que sai, 5t, tem de ser igual ao que havia, 60.',
    letras=[('t', 'tempo, em minutos (o que a questão quer)'), ('a', 'água no começo, em litros'), ('s', 'litros que saem por minuto')],
    telas=[tela('Achando a (começo)', 'É o número sozinho na função.\na = 60'),
           tela('Achando s (sai por minuto)', 'É o número que multiplica t.\ns = 5')],
    volta='t = 60 ÷ 5 = 12 minutos\nLetra E.',
    valores=[('a', '60'), ('s', '5')],
    pista='"fica vazio", "zera" → iguale a zero.',
    receita=receita('60 − 5t', 't = a ÷ s', 'a = 60; s = 5', '60 ÷ 5 = 12'))),

dict(**M(), id='d2-escada-mat-fun-b05', resp='B', objeto='tabela de corrida de táxi', cobra='ler uma tabela e continuar o padrão', confere=14 + 3,
  ancora=SALARIO, canal='mat-43 [26:25:30] dados organizados em tabela',
  enun='Uma tabela mostra o preço de uma corrida: 1 km custa R$ 8,00; 2 km, R$ 11,00; 3 km, R$ 14,00. Mantido o padrão, quanto custam 4 km, em reais?',
  alts=['16', '17', '32', '22', '15'],
  ideia='A cada quilômetro o preço sobe 3 reais: depois de 14 vem 17.',
  pecas=[('Padrão', 'O que se repete sempre igual.'), ('km', 'Lê-se quilômetro.')],
  conferencia='14+3 = 17. B. A = +2; C = 8×4; D = 8+14; E = 14+1.',
  sua_vez=('1 dá 5, 2 dá 9, 3 dá 13. Quanto dá 4?', ['17', '20', '14', '18'], '17', 'Sobe 9 − 5 = 4 de cada vez: 13 + 4 = 17.'),
  aula=dict(
    formulas=[('grafico', 'Continuar a tabela', 'próximo = último + quanto sobe de cada vez')],
    tenho=[('1 km', '8'), ('2 km', '11'), ('3 km', '14')],
    quer='A questão quer a próxima linha da tabela.',
    equacao='n = u + d (próximo = último preço + degrau)',
    porque='Por que não multiplicar 8 por 4? Isso cobraria a entrada 4 vezes; só 3 reais se repetem.',
    letras=[('n', 'preço dos 4 km (o que a questão quer)'), ('u', 'último preço da tabela'), ('d', 'degrau: quanto sobe a cada km')],
    telas=[tela('Achando u (último)', 'É a linha de 3 km.\nu = 14'),
           tela('Achando d (degrau)', 'Uma linha menos a anterior.\nd = 11 − 8 = 3')],
    volta='n = 14 + 3 = 17\nLetra B.',
    valores=[('u', '14'), ('d', '3')],
    pista='tabela subindo igual → ache o degrau e some.',
    receita=receita('8, 11, 14', 'n = u + d', 'u = 14; d = 3', '14 + 3 = 17'))),

dict(**M('medio'), id='d2-escada-mat-fun-b06', resp='A', objeto='plano de celular', cobra='achar a taxa e o fixo para prever um valor', confere=((50 - 30) / (6 - 2)) * 10 + (30 - ((50 - 30) / (6 - 2)) * 2),
  ancora=SALARIO, canal='mat-10 [5:02:01] achar o coeficiente de uma função',
  enun='Num plano de celular, a conta é um valor fixo mais um preço por gigabyte usado. Com 2 gigabytes a conta foi de R$ 30,00, e com 6 gigabytes, R$ 50,00. Quanto será a conta com 10 gigabytes, em reais?',
  alts=['70', '150', '80', '60', '50'],
  ideia='4 gigabytes a mais custaram 20 reais, então cada um custa 5. O fixo é 30 − 10 = 20, e com 10 gigabytes: 20 + 50 = 70.',
  pecas=[('Gigabyte', 'Uma medida da internet usada.'), ('Fixo', 'O que se paga sempre, mesmo sem usar.')],
  conferencia='taxa 5; fixo 20; 20+50 = 70. A. B = 15×10; C = 30+50; D = 50+10; E = repetiu.',
  sua_vez=('Fixo mais preço por unidade: 1 dá 12, 3 dá 20. Quanto dá 5?', ['28', '60', '32', '24'], '28', 'Cada um: 8 ÷ 2 = 4. Fixo: 12 − 4 = 8. Conta: 8 + 20 = 28.'),
  aula=dict(
    formulas=[('grafico', 'Taxa', 'preço de 1 = diferença de contas ÷ diferença de uso'), ('grafico', 'Conta', 'conta = fixo + preço de 1 × quantidade')],
    tenho=[('2 gigabytes', '30'), ('6 gigabytes', '50'), ('Quero', '10 gigabytes')],
    quer='A questão quer a conta de um uso que não está na tabela.',
    equacao='c = fix + q × g (conta = fixo + preço de cada gigabyte × gigabytes)',
    porque='Por que achar o preço de 1 antes? Sem ele não dá para saber quanto do 30 é fixo.',
    letras=[('c', 'conta com 10 gigabytes (o que a questão quer)'), ('fix', 'parte fixa'), ('q', 'preço de cada gigabyte'), ('g', 'gigabytes usados')],
    telas=[tela('Achando q (preço de cada um)', '50 − 30 = 20 reais\n6 − 2 = 4 gigabytes\nq = 20 ÷ 4 = 5'),
           tela('Achando fix (fixo)', 'Na conta de 2: 2 × 5 = 10 foi de uso.\nfix = 30 − 10 = 20'),
           tela('Achando g (gigabytes)', 'O enunciado pede.\ng = 10'),
           tela('O seu jeito', 'Parece certo fazer 30 ÷ 2 = 15 por gigabyte e achar 150, a letra B.\nDentro dos 30 há o fixo.')],
    volta='5 × 10 = 50\nc = 20 + 50 = 70\nLetra A.',
    valores=[('fix', '20'), ('q', '5'), ('g', '10')],
    pista='duas contas e um fixo → preço de 1, depois o fixo, depois a nova conta.',
    receita=receita('2 dá 30; 6 dá 50', 'c = fix + q × g', 'q = 5; fix = 20', '20 + 50 = 70'))),
]
