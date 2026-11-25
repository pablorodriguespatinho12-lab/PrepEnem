"""Base antes da junção (regra 20): um exercício SÓ de cada conceito de Dinâmica
(resultante, F = m·a, velocidade constante, atrito, ação e reação) e um que junta.
Peso já tem questão fácil no banco. Âncora real (só estudo): ENEM 2023 D2 (caixa presa
por cordas num caminhão, com atrito). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_dinamica"""

ARQUIVO = '../escada/fisica-base-dinamica'

CAMINHAO = 'ENEM 2023 D2 (caixa num caminhão, atrito e aceleração)'


def F(nivel='facil'):
  return {'materia': 'Física', 'tema': 'Dinâmica e Leis de Newton', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


NEWTON = ('N', 'Lê-se newton: a medida de força.')


FICHAS = [
dict(**F(), id='d2-escada-fis-din-b01', resp='B', objeto='cabo de guerra com caixa', cobra='força resultante', confere=30 + 20 - 15,
  ancora=CAMINHAO, canal='fis-02 [1:08:30] força resultante',
  enun='Duas crianças puxam uma caixa para a direita, uma com 30 N e a outra com 20 N. Uma terceira puxa para a esquerda com 15 N. Qual é a força resultante?',
  alts=['65 N para a direita', '35 N para a direita', '50 N para a direita', '15 N para a esquerda', '5 N para a direita'],
  ideia='Forças para o mesmo lado se somam e forças opostas se subtraem: 30 + 20 = 50, e 50 − 15 = 35 N.',
  pecas=[NEWTON, ('Força resultante', 'A força única que sobra depois de juntar todas.')],
  conferencia='50 - 15 = 35. B. A = soma tudo; C = esqueceu a esquerda; D = só a esquerda; E = 20-15.',
  sua_vez=('40 N para a direita e 10 N para a esquerda. Resultante?', ['30 N', '50 N', '40 N', '4 N'], '30 N', '40 − 10 = 30 N.'),
  aula=dict(
    formulas=[('carro', 'Resultante', 'soma de um lado − força do outro lado')],
    tenho=[('Para a direita', '30 N e 20 N'), ('Para a esquerda', '15 N')],
    quer='A questão quer a força que sobra, e o lado dela.',
    equacao='r = d − e (resultante = força para a direita − força para a esquerda)',
    porque='Por que subtrair? Se 10 N puxam para um lado e 10 N para o outro, não sobra nada: 10 − 10 = 0.',
    letras=[('r', 'força resultante (o que a questão quer)'), ('d', 'total para a direita, em newtons'), ('e', 'total para a esquerda, em newtons')],
    telas=[tela('Achando d (direita)', 'As duas para o mesmo lado se somam.\nd = 30 + 20 = 50 N'),
           tela('Achando e (esquerda)', 'O enunciado dá direto.\ne = 15 N')],
    volta='r = 50 − 15 = 35 N\nSobra para a direita, o lado maior.\nLetra B.',
    valores=[('d', '50 N'), ('e', '15 N')],
    pista='forças dos dois lados → some cada lado e subtraia.',
    receita=receita('30, 20 e 15 N', 'r = d − e', 'd = 50; e = 15', '50 − 15 = 35'))),

dict(**F(), id='d2-escada-fis-din-b02', resp='D', objeto='carrinho de mercado', cobra='segunda lei de Newton: força = massa × aceleração', confere=20 * 2,
  ancora=CAMINHAO, canal='fis-02 [1:15:01] segunda lei de Newton',
  enun='Um carrinho de mercado de 20 kg ganha uma aceleração de 2 m/s². Qual é a força resultante sobre ele?',
  alts=['10 N', '22 N', '18 N', '40 N', '80 N'],
  ideia='A força é a massa vezes a aceleração: 20 × 2 = 40 N.',
  pecas=[NEWTON, ('Aceleração', 'Quanto a velocidade muda a cada segundo.'), ('m/s²', 'Lê-se metros por segundo ao quadrado: é só o nome da medida da aceleração.')],
  conferencia='20×2 = 40. D. A = 20/2; B = soma; C = subtrai; E = 20×2×2.',
  sua_vez=('Um objeto de 5 kg com aceleração de 3 m/s². Força?', ['15 N', '8 N', '2 N', '1,7 N'], '15 N', '5 × 3 = 15 N.'),
  aula=dict(
    formulas=[('carro', 'Segunda lei de Newton', 'força = massa × aceleração')],
    tenho=[('Massa', '20 kg'), ('Aceleração', '2 m/s²')],
    quer='A questão quer a força resultante no carrinho.',
    equacao='f = m × a (força = massa × aceleração)',
    porque='Por que multiplicar? Cada quilo pede 2 N para essa aceleração: 3 kg pediriam 3 × 2 = 6 N.',
    letras=[('f', 'força resultante, em newtons (o que a questão quer)'), ('m', 'massa, em kg'), ('a', 'aceleração, em m/s²')],
    telas=[tela('Achando m (massa)', 'O enunciado dá direto.\nm = 20 kg'),
           tela('Achando a (aceleração)', 'O enunciado dá direto.\na = 2 m/s²')],
    volta='f = 20 × 2 = 40 N\nLetra D.',
    valores=[('m', '20 kg'), ('a', '2 m/s²')],
    pista='dá massa e aceleração → multiplique.',
    receita=receita('20 kg, 2 m/s²', 'f = m × a', 'm = 20; a = 2', '20 × 2 = 40'))),

dict(**F(), id='d2-escada-fis-din-b03', resp='A', objeto='caixote empurrado', cobra='velocidade constante: resultante zero', confere=80 - 80,
  ancora=CAMINHAO, canal='fis-02 [1:08:30] força resultante zero',
  enun='Um funcionário empurra um caixote com força de 80 N, e o caixote anda em linha reta sempre com a mesma velocidade. Qual é a força resultante sobre o caixote?',
  alts=['0 N', '80 N', '160 N', '40 N', '8 N'],
  ideia='Velocidade que não muda quer dizer aceleração zero, então não sobra força: o atrito segura os mesmos 80 N.',
  pecas=[NEWTON, ('Força resultante', 'A força única que sobra depois de juntar todas.'), ('Atrito', 'A força do chão que segura o caixote, contra o movimento.')],
  conferencia='a = 0, resultante 0. A. B = força aplicada; C = somou o atrito; D = metade; E = 80/10.',
  sua_vez=('Um carro anda em linha reta a velocidade fixa; o motor empurra com 500 N. Resultante?', ['0 N', '500 N', '1000 N', '250 N'], '0 N', 'Velocidade fixa: resultante zero.'),
  aula=dict(
    formulas=[('carro', 'Velocidade que não muda', 'força resultante = 0')],
    tenho=[('Empurrão', '80 N'), ('Velocidade', 'sempre a mesma, em linha reta')],
    quer='A questão quer o que sobra somando todas as forças.',
    equacao='r = emp − atr (resultante = empurrão − atrito)',
    porque='Por que o atrito é igual ao empurrão? Se sobrasse força, a velocidade iria mudar.',
    letras=[('r', 'força resultante (o que a questão quer)'), ('emp', 'empurrão do funcionário'), ('atr', 'atrito, contra o movimento')],
    telas=[tela('Achando emp (empurrão)', 'O enunciado dá direto.\nemp = 80 N'),
           tela('Achando atr (atrito)', 'A velocidade não muda, então não sobra força: o atrito é igual ao empurrão.\natr = 80 N'),
           tela('O seu jeito', 'Parece certo responder 80 N, a letra B.\n80 N é só o empurrão.\nO atrito puxa 80 N para o outro lado.')],
    volta='r = 80 − 80 = 0 N\nLetra A.',
    valores=[('emp', '80 N'), ('atr', '80 N')],
    pista='"mesma velocidade em linha reta" → resultante zero.',
    receita=receita('80 N, velocidade fixa', 'r = emp − atr', 'atr = 80', '80 − 80 = 0'))),

dict(**F(), id='d2-escada-fis-din-b04', resp='E', objeto='móvel arrastado', cobra='força de atrito = coeficiente × força normal', confere=0.2 * 300,
  ancora=CAMINHAO, canal='fis-04 [3:22:32] o atrito segura o movimento',
  enun='Um móvel é arrastado num piso plano. A força normal do piso sobre ele é de 300 N, e o coeficiente de atrito é 0,2. Qual é a força de atrito?',
  alts=['1 500 N', '300 N', '600 N', '6 N', '60 N'],
  ideia='O atrito é uma fração da força normal: 0,2 são 2 décimos de 300, ou 60 N.',
  pecas=[NEWTON, ('Força normal', 'A força com que o piso empurra o móvel para cima.'), ('Coeficiente de atrito', 'Um número que diz o quanto as superfícies agarram.')],
  conferencia='0,2×300 = 60. E. A = 300/0,2; B = a normal; C = vírgula; D = vírgula ao contrário.',
  sua_vez=('Normal 100 N, coeficiente 0,5. Atrito?', ['50 N', '200 N', '100 N', '5 N'], '50 N', 'Metade de 100: 50 N.'),
  aula=dict(
    formulas=[('carro', 'Atrito', 'atrito = coeficiente × força normal')],
    tenho=[('Força normal', '300 N'), ('Coeficiente', '0,2')],
    quer='A questão quer a força com que o piso segura o móvel.',
    equacao='atr = c × n (atrito = coeficiente × força normal)',
    porque='Por que multiplicar? 0,2 são 2 décimos: de cada 10 partes da força normal, o atrito fica com 2.',
    letras=[('atr', 'força de atrito, em newtons (o que a questão quer)'), ('c', 'coeficiente de atrito'), ('n', 'força normal, em newtons')],
    telas=[tela('Achando c (coeficiente)', 'O enunciado dá direto.\nc = 0,2'),
           tela('Achando n (normal)', 'O enunciado dá direto.\nn = 300 N')],
    volta='atr = 0,2 × 300\n0,2 são 2 décimos.\nUm décimo de 300: 300 ÷ 10 = 30\nDois décimos: 30 + 30 = 60 N\nLetra E.',
    valores=[('c', '0,2'), ('n', '300 N')],
    pista='dá coeficiente e normal → multiplique.',
    receita=receita('300 N; 0,2', 'atr = c × n', 'c = 0,2; n = 300', '0,2 × 300 = 60'))),

dict(**F(), id='d2-escada-fis-din-b05', resp='C', objeto='patinador na parede', cobra='terceira lei: ação e reação', confere=50,
  ancora=CAMINHAO, canal='fis-02 [1:01:00] terceira lei de Newton, empurrando a parede',
  enun='Uma pessoa de patins empurra uma parede com uma força de 50 N. Qual é a força que a parede faz sobre a pessoa?',
  alts=['0 N', '25 N para trás', '50 N no sentido contrário', '50 N no mesmo sentido', '100 N no sentido contrário'],
  ideia='Toda força vem em par: a parede devolve o mesmo tanto, 50 N, para o lado contrário.',
  pecas=[NEWTON, ('Ação e reação', 'Quem empurra é empurrado de volta, com a mesma força.')],
  conferencia='mesmo valor, sentido contrário. C. A = parede parada não faz força; B = metade; D = sentido errado; E = dobro.',
  sua_vez=('Um nadador empurra a borda com 120 N. Força da borda nele?', ['120 N ao contrário', '0 N', '60 N ao contrário', '240 N ao contrário'], '120 N ao contrário', 'Mesmo valor, sentido contrário.'),
  aula=dict(
    formulas=[('carro', 'Ação e reação', 'volta = ida, no sentido contrário')],
    tenho=[('Empurrão na parede', '50 N')],
    quer='A questão quer a força que volta para a pessoa.',
    equacao='par = emp (força da parede = empurrão da pessoa)',
    porque='Por que a pessoa sai andando para trás? Porque a parede empurra a pessoa, mesmo parada.',
    letras=[('par', 'força que a parede faz na pessoa (o que a questão quer)'), ('emp', 'força que a pessoa faz na parede')],
    telas=[tela('Achando emp (empurrão)', 'O enunciado dá direto.\nemp = 50 N'),
           tela('O seu jeito', 'Parece certo dizer 0 N, a letra A, porque a parede não se mexe.\nEla não anda, mas empurra de volta.')],
    volta='par = 50 N, no sentido contrário\nLetra C.',
    valores=[('emp', '50 N')],
    pista='"força que o outro faz de volta" → mesmo valor, sentido contrário.',
    receita=receita('50 N na parede', 'par = emp', 'emp = 50', '50 N ao contrário'))),

dict(**F('medio'), id='d2-escada-fis-din-b06', resp='B', objeto='geladeira empurrada', cobra='aceleração com atrito: resultante e segunda lei', confere=(200 - 50) / 50,
  ancora=CAMINHAO, canal='fis-02 [1:15:01] segunda lei de Newton',
  enun='Uma geladeira de 50 kg é empurrada com 200 N para a frente, enquanto o atrito faz 50 N para trás. Qual é a aceleração da geladeira?',
  alts=['4 m/s²', '3 m/s²', '5 m/s²', '1 m/s²', '150 m/s²'],
  ideia='Primeiro a força que sobra: 200 − 50 = 150 N. Depois divida pela massa: 150 ÷ 50 = 3 m/s².',
  pecas=[NEWTON, ('Atrito', 'A força do chão, contra o movimento.'), ('m/s²', 'Lê-se metros por segundo ao quadrado: é só o nome da medida da aceleração.')],
  conferencia='(200-50)/50 = 3. B. A = ignorou o atrito; C = somou; D = só o atrito; E = parou na força.',
  sua_vez=('10 kg, empurrão de 60 N, atrito de 20 N. Aceleração?', ['4 m/s²', '6 m/s²', '8 m/s²', '40 m/s²'], '4 m/s²', '60 − 20 = 40; 40 ÷ 10 = 4 m/s².'),
  aula=dict(
    formulas=[('carro', 'Resultante', 'empurrão − atrito'), ('carro', 'Aceleração', 'aceleração = força resultante ÷ massa')],
    tenho=[('Massa', '50 kg'), ('Empurrão', '200 N'), ('Atrito', '50 N')],
    quer='A questão quer quanto a velocidade cresce a cada segundo.',
    equacao='a = r ÷ m (aceleração = força resultante ÷ massa)',
    porque='Por que dividir? Força é massa × aceleração: 2 × 3 = 6. Voltando: 6 ÷ 2 = 3, a aceleração.',
    letras=[('a', 'aceleração (o que a questão quer)'), ('r', 'força resultante, em newtons'), ('m', 'massa, em kg')],
    telas=[tela('Achando r (resultante)', 'O empurrão menos o atrito.\nr = 200 − 50 = 150 N'),
           tela('Achando m (massa)', 'O enunciado dá direto.\nm = 50 kg'),
           tela('O seu jeito', 'Parece certo fazer 200 ÷ 50 = 4, a letra A.\nIsso esquece o atrito: a força que sobra é 150 N.')],
    volta='a = 150 ÷ 50 = 3 m/s²\nLetra B.',
    valores=[('r', '150 N'), ('m', '50 kg')],
    pista='tem atrito e pede aceleração → primeiro a força que sobra, depois ÷ massa.',
    receita=receita('50 kg; 200 N; 50 N', 'a = r ÷ m', 'r = 150', '150 ÷ 50 = 3'))),
]
