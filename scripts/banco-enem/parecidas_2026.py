"""Parecidas com as questões mais pesadas do ENEM 2026, dia 2, caderno azul (Pablo,
17/11/2026: "pesquisa o Enem 2026... e também do nosso site questões parecidas com
elas"). Cada uma cobra a MESMA ideia da questão do ENEM, numa situação diferente; o
texto do ENEM não é copiado. Aula no molde da "Aula do Robô Aspirador" (passos_aula
em montar.py). Um arquivo por tema."""

ARQUIVO = 'parecidas-2026'
ARQUIVO_POR_TEMA = {
  'Geometria Plana': 'parecidas-2026-geometria',
  'Análise Combinatória e Probabilidade': 'parecidas-2026-contagem',
}
D = lambda nome, *rotulos: {'tipo': 'diagrama', 'nome': nome, **({'rotulos': list(rotulos)} if rotulos else {})}
GEO = {'materia': 'Matemática', 'tema': 'Geometria Plana'}
CONTA = {'materia': 'Matemática', 'tema': 'Análise Combinatória e Probabilidade'}

FICHAS = [
# Parecida com ENEM 2026 · questão 176 (toalha na mesa de 3 pontas): o menor círculo
# que cobre um triângulo de lados iguais, com sobra, sai do centro a 2/3 da altura.
dict(**GEO, id='d2-banco-mat-p26-01', resp='C', objeto='holofote', cobra='menor medida',
  confere=(2 / 3) * (12 * 1.7 / 2) + 1,
  enun='Um palco tem a forma de um triângulo de 3 lados iguais, cada um com 12 m. Um holofote fica no centro do palco, o ponto que está à mesma distância das 3 pontas, e ilumina um círculo em volta dele. A luz precisa chegar às 3 pontas e passar 1 m além de cada uma. Use 1,7 como valor de √3.\nO menor raio de luz que atende ao pedido é de',
  alts=['6,0 m', '6,8 m', '7,8 m', '11,2 m', '4,4 m'],
  cena=('cena-palco-holofote', ['lado: 12 m', 'sobra: 1 m', '√3 = 1,7', '']),
  ideia='O ponto do palco mais longe do centro é a ponta, a 2/3 da altura: 2/3 × 10,2 = 6,8 m. Com 1 m de sobra, o raio é 7,8 m.',
  pecas=[('Altura', 'A linha reta que sai de uma ponta e chega ao meio do lado da frente, formando um canto reto.')],
  conferencia='H = 12*1,7/2 = 10,2; D = 2/3*10,2 = 6,8; R = 6,8+1 = 7,8. C. A = 12/2; B = sem a sobra; D = 10,2+1; E = 10,2/3+1.',
  sua_vez=('Palco de 3 lados iguais de 6 m, √3 = 1,7. Do centro até a ponta?', ['3,4 m', '5,1 m', '3,0 m', '1,7 m'], '3,4 m', 'Altura 6 × 1,7 ÷ 2 = 5,1; 2/3 de 5,1 = 3,4.'),
  aula=dict(
    tenho_texto='Primeiro, tire os números do enunciado. Tudo em metros.',
    tenho=[('Lado do palco', '12 m'), ('Sobra da luz', '1 m'), ('√3', '1,7')],
    quer='A questão quer o menor raio de luz que passa 1 m das 3 pontas.',
    equacao='R = D + 1 (raio = distância do centro até a ponta + a sobra)',
    porque='Por que somar? A luz sai do centro. Para passar 1 m da ponta, ela anda até a ponta e mais 1 m.',
    letras=[('R', 'raio da luz (o que a questão quer)'), ('D', 'distância do centro até a ponta')],
    telas=[
      dict(titulo='Por que a ponta', visual=D('holofote-palco'),
        texto='A luz forma um círculo em volta do centro. O lugar do palco mais longe do centro é a ponta.\nSe a luz passa das pontas, passa do palco todo. Aperte e veja.'),
      dict(titulo='Achando H (a altura)',
        texto='A altura vai da ponta até o meio do lado de baixo.\nNo triângulo de 3 lados iguais: altura = lado × √3 ÷ 2.\nH = 12 × 1,7 ÷ 2 = 10,2 m'),
      dict(titulo='Achando D: o seu jeito', visual=D('triangulo-centro'),
        texto='Parece certo usar metade do lado, 6 m. Mas o centro não fica na borda: ele fica dentro do triângulo.\nAs 3 alturas se cruzam no centro, e ele divide cada altura em 3 partes iguais: 2 partes até a ponta e 1 parte até o lado.\nD = 10,2 ÷ 3 × 2 = 3,4 × 2 = 6,8 m'),
    ],
    volta='R = 6,8 + 1 = 7,8 m\nLetra C. Com 6,8 m, sem a sobra, a luz só encosta na ponta.',
    valores=[('H', '10,2'), ('D', '6,8')],
    pista='menor círculo que cobre um triângulo de 3 lados iguais → raio = 2/3 da altura (+ a sobra, se pedir).',
    coluna_receita='Neste palco',
    receita=[('1. Tabela do que eu tenho', '12 m, 1 m, √3 = 1,7'), ('2. Equação em letras', 'R = D + 1'), ('3. Achar cada letra', 'H = 10,2; D = 6,8'), ('4. Substituir', '6,8 + 1 = 7,8')])),

# Parecida com ENEM 2026 · questão 174 (rotas e estradas): trechos em sequência
# multiplicam; o produto que falta é primo, então só sobra "ele × 1".
dict(**CONTA, id='d2-banco-mat-p26-02', resp='B', objeto='trilhas', cobra='contagem',
  confere=84 / (4 * 3),
  enun='Num parque, o passeio vai da portaria ao lago, do lago ao mirante, do mirante à cachoeira e da cachoeira à saída, nessa ordem. Da portaria ao lago há 4 trilhas, e da cachoeira à saída há 3. O mapa não mostra quantas trilhas ligam o lago ao mirante nem o mirante à cachoeira, mas há mais trilhas entre o lago e o mirante. Ao todo, há 84 caminhos diferentes da portaria até a saída.\nO número de trilhas entre o lago e o mirante é',
  alts=['12', '7', '77', '21', '28'],
  cena=('cena-trilhas-parque', ['4 trilhas', '? trilhas', '3 trilhas', '84 caminhos']),
  ideia='Trechos em sequência multiplicam: 4 × L × M × 3 = 84, então L × M = 7. Como 7 só é 7 × 1 e há mais trilhas no lago, L = 7.',
  pecas=[('Número primo', 'Número que só se divide por 1 e por ele mesmo, como 2, 3, 5 e 7.')],
  conferencia='84/(4*3) = 7 = 7*1 e L > M: L = 7. B. A = 84/(4+3); C = 84-(4+3); D = 84/4; E = 84/3.',
  sua_vez=('3 estradas de A a B, ? de B a C e 2 de C a D. São 30 rotas de A a D. Estradas de B a C?', ['5', '6', '25', '10'], '5', '30 ÷ (3 × 2) = 30 ÷ 6 = 5.'),
  aula=dict(
    tenho=[('Portaria → lago', '4 trilhas'), ('Cachoeira → saída', '3 trilhas'), ('Caminhos ao todo', '84'), ('Lago → mirante', 'mais que mirante → cachoeira')],
    quer='A questão quer quantas trilhas ligam o lago ao mirante.',
    equacao='84 = 4 × L × M × 3 (caminhos = trilhas de cada trecho multiplicadas)',
    porque='Por que multiplicar? Para cada trilha do 1º trecho, você ainda pode pegar qualquer trilha do 2º. Com 2 trilhas e depois 3, são 2 × 3 = 6 caminhos, não 2 + 3.',
    letras=[('L', 'trilhas lago → mirante (o que a questão quer)'), ('M', 'trilhas mirante → cachoeira')],
    telas=[
      dict(titulo='Por que multiplicar',
        texto='Cada caminho escolhe 1 trilha em cada trecho. Trocou uma trilha, é outro caminho.\nVeja com 2 trilhas (a e b) e depois 3 (1, 2 e 3): cada letra vai com cada número.',
        visual={'tipo': 'tabela', 'titulo': '2 trilhas e depois 3', 'cabecalho': ['1º trecho', '2º trecho'], 'linhas': [['a', '1'], ['a', '2'], ['a', '3'], ['b', '1'], ['b', '2'], ['b', '3']]}),
      dict(titulo='Achando L × M: o seu jeito',
        texto='Parece certo fazer 84 ÷ (4 + 3) = 12. Mas os trechos vêm um depois do outro: multiplica, não soma.\nTire o 4 e o 3 dividindo: L × M = 84 ÷ (4 × 3) = 84 ÷ 12 = 7'),
      dict(titulo='Achando M (o trecho menor)', visual=D('trilhas-parque'),
        texto='L × M = 7. Que números multiplicados dão 7? Só 7 × 1: o 7 é primo.\nComo há mais trilhas entre o lago e o mirante, L = 7 e M = 1. Aperte e veja alguns caminhos.'),
    ],
    volta='L = 7 ÷ M = 7 ÷ 1 = 7\nLetra B. Confere: 4 × 7 × 1 × 3 = 84 caminhos.',
    valores=[('L × M', '7'), ('M', '1')],
    pista='trechos um depois do outro → multiplica; falta um trecho → divida o total pelos que você sabe.',
    coluna_receita='Neste parque',
    receita=[('1. Tabela do que eu tenho', '4, 3 e 84'), ('2. Equação em letras', '84 = 4 × L × M × 3'), ('3. Achar cada letra', 'L × M = 7; M = 1'), ('4. Substituir', 'L = 7')])),
]
