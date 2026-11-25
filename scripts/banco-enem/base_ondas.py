"""Base antes da junção (regra 20, 24/11/2026): um exercício SÓ de cada conceito de
Ondas (frequência, período, comprimento de onda, v = comprimento × frequência, eco) e
um que junta. Âncoras reais (só estudo): ENEM 2020 D2 (frequências num tubo) e
ENEM 2023 D2 (pulso acústico com dois ecos). Situações originais.
Gerar: python3 scripts/banco-enem/montar.py base_ondas"""

ARQUIVO = '../escada/fisica-base-ondas'

TUBO = 'ENEM 2020 D2 (frequências de ressonância)'
ECOS = 'ENEM 2023 D2 (pulso acústico e dois ecos)'
SEM_ECO = 'fora do canal: eco não achado em fis-09'


def F(nivel='facil'):
  return {'materia': 'Física', 'tema': 'Ondas e Acústica', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**F(), id='d2-escada-fis-ond-04', resp='B', objeto='corda de violão', cobra='frequência contando vibrações', confere=20 / 4,
  ancora=TUBO, canal='fis-09 [8:34:00] frequência é o número de ciclos por segundo',
  enun='Num vídeo em câmera lenta, uma corda faz 20 vibrações completas em 4 segundos, sempre no mesmo ritmo. Qual é a frequência dessa corda?',
  alts=['80 Hz', '5 Hz', '0,2 Hz', '16 Hz', '24 Hz'],
  ideia='Frequência é quantas vibrações acontecem em 1 segundo: 20 em 4 segundos dá 5 em cada segundo.',
  pecas=[('Vibração completa', 'Um vai e volta da corda.'), ('Hz', 'Lê-se hertz: vibrações a cada segundo.')],
  conferencia='f = 20/4 = 5 Hz. B. A = 20×4; C = 4/20; D = 20-4; E = 20+4.',
  sua_vez=('Um pêndulo faz 30 vibrações em 10 s. Frequência?', ['3 Hz', '300 Hz', '20 Hz', '40 Hz'], '3 Hz', '30 ÷ 10 = 3 Hz.'),
  aula=dict(
    formulas=[('carro', 'Frequência', 'frequência = vibrações ÷ segundos')],
    tenho=[('Vibrações', '20'), ('Tempo', '4 s')],
    quer='A questão quer quantas vibrações há em 1 segundo.',
    equacao='f = n ÷ t (frequência = número de vibrações ÷ tempo)',
    porque='Por que dividir? Se fossem 20 em 2 s, seriam 20 ÷ 2 = 10 em cada segundo.',
    letras=[('f', 'frequência, em Hz (o que a questão quer)'), ('n', 'número de vibrações'), ('t', 'tempo, em segundos')],
    telas=[tela('Achando n (número de vibrações)', 'O enunciado dá direto.\nn = 20'),
           tela('Achando t (tempo)', 'O enunciado dá direto.\nt = 4 s')],
    volta='f = 20 ÷ 4 = 5 Hz\nLetra B.',
    valores=[('n', '20'), ('t', '4 s')],
    pista='"tantas vibrações em tantos segundos" → vibrações ÷ segundos.',
    receita=receita('20 vibrações, 4 s', 'f = n ÷ t', 'n = 20; t = 4', '20 ÷ 4 = 5'))),

dict(**F(), id='d2-escada-fis-ond-05', resp='D', objeto='luz que pisca', cobra='período a partir da frequência', confere=1 / 4,
  ancora=TUBO, canal='fis-09 [8:33:00] frequência é o inverso do período',
  enun='A luz de um enfeite pisca com frequência de 4 Hz, ou seja, 4 vezes a cada segundo. Quanto tempo passa entre o começo de uma piscada e o começo da seguinte?',
  alts=['4 s', '2 s', '0,4 s', '0,25 s', '5 s'],
  ideia='Em 1 segundo cabem 4 piscadas iguais, então cada uma ocupa 1 dividido por 4: 0,25 s.',
  pecas=[('Hz', 'Lê-se hertz: vezes a cada segundo.'), ('Período', 'O tempo de uma repetição.')],
  conferencia='T = 1/4 = 0,25 s. D. A = a própria frequência; B = 4/2; C = 4/10; E = 4+1.',
  sua_vez=('Algo se repete 5 vezes por segundo. Período?', ['0,2 s', '5 s', '0,5 s', '2 s'], '0,2 s', '1 ÷ 5 = 0,2 s.'),
  aula=dict(
    formulas=[('carro', 'Período', 'período = 1 segundo ÷ frequência')],
    tenho=[('Frequência', '4 Hz')],
    quer='A questão quer o tempo de uma piscada.',
    equacao='p = 1 ÷ f (período = 1 segundo ÷ frequência)',
    porque='Por que 1 ÷ f? Com 2 piscadas em 1 s, cada uma leva 1 ÷ 2 = meio segundo.',
    letras=[('p', 'período, em segundos (o que a questão quer)'), ('f', 'frequência, em Hz')],
    telas=[tela('Achando f (frequência)', 'O enunciado dá direto.\nf = 4 Hz')],
    volta='p = 1 ÷ 4\n1 s são 100 centésimos de segundo.\n100 ÷ 4 = 25 centésimos\n25 centésimos se escreve 0,25 s\nLetra D.',
    valores=[('f', '4 Hz')],
    pista='pergunta o tempo de uma repetição e dá a frequência → 1 ÷ frequência.',
    receita=receita('4 Hz', 'p = 1 ÷ f', 'f = 4', '1 ÷ 4 = 0,25'))),

dict(**F(), id='d2-escada-fis-ond-06', resp='A', objeto='ondas na piscina', cobra='comprimento de onda a partir das cristas', confere=12 / 3,
  ancora=TUBO, canal='fis-09 [8:37:30] comprimento de onda é a distância entre duas cristas vizinhas',
  enun='Numa piscina com ondas iguais, um aluno mede 12 m da primeira até a quarta crista, em linha reta. Qual é o comprimento de onda?',
  alts=['4 m', '3 m', '48 m', '12 m', '9 m'],
  ideia='Entre a 1ª e a 4ª crista há 3 espaços iguais, e cada espaço é um comprimento de onda: 12 ÷ 3 = 4 m.',
  pecas=[('Crista', 'O ponto mais alto da onda.'), ('Comprimento de onda', 'A distância de uma crista até a seguinte.')],
  conferencia='3 espaços; 12/3 = 4 m. A. B = 12/4 (contou cristas); C = 12×4; D = a distância toda; E = 12-3.',
  sua_vez=('Da 1ª à 3ª crista há 10 m. Comprimento de onda?', ['5 m', '3,3 m', '10 m', '20 m'], '5 m', '2 espaços: 10 ÷ 2 = 5 m.'),
  aula=dict(
    formulas=[('carro', 'Comprimento de onda', 'comprimento = distância ÷ espaços')],
    tenho=[('Distância medida', '12 m'), ('Cristas', 'da 1ª até a 4ª')],
    quer='A questão quer a distância entre duas cristas vizinhas.',
    equacao='c = d ÷ e (comprimento de onda = distância ÷ número de espaços)',
    porque='Por que espaços? Com 2 cristas há 1 espaço entre elas; com 3 cristas, 2 espaços.',
    letras=[('c', 'comprimento de onda (o que a questão quer)'), ('d', 'distância medida, em metros'), ('e', 'número de espaços entre as cristas')],
    telas=[tela('Achando d (distância)', 'O enunciado dá direto.\nd = 12 m'),
           tela('Achando e: o seu jeito', 'Parece certo dividir por 4: daria 3 m, a letra B.\nConte os espaços: 1ª a 2ª, 2ª a 3ª, 3ª a 4ª.\ne = 4 − 1 = 3')],
    volta='c = 12 ÷ 3 = 4 m\nLetra A.',
    valores=[('d', '12 m'), ('e', '3')],
    pista='distância entre várias cristas → conte os espaços (cristas menos 1) e divida.',
    receita=receita('12 m, 1ª à 4ª crista', 'c = d ÷ e', 'd = 12; e = 3', '12 ÷ 3 = 4'))),

dict(**F(), id='d2-escada-fis-ond-07', resp='E', objeto='alto-falante', cobra='comprimento de onda com velocidade e frequência', confere=340 / 170,
  ancora=TUBO, canal='fis-09 [8:45:01] v = comprimento de onda × frequência',
  enun='Um alto-falante emite um som de frequência 170 Hz. No ar, esse som anda 340 m a cada segundo. Qual é o comprimento de onda?',
  alts=['57 800 m', '0,5 m', '170 m', '510 m', '2 m'],
  ideia='Em 1 segundo o som anda 340 m, e nesse caminho cabem 170 ondas iguais: cada uma mede 340 ÷ 170 = 2 m.',
  pecas=[('Hz', 'Lê-se hertz: ondas a cada segundo.'), ('Comprimento de onda', 'O tamanho de uma onda, em metros.')],
  conferencia='λ = 340/170 = 2 m. E. A = 340×170; B = 170/340; C = a frequência; D = soma.',
  sua_vez=('Uma onda anda 100 m por segundo e tem 50 Hz. Comprimento?', ['2 m', '5 000 m', '0,5 m', '150 m'], '2 m', '100 ÷ 50 = 2 m.'),
  aula=dict(
    formulas=[('carro', 'Comprimento de onda', 'comprimento = velocidade ÷ frequência')],
    tenho=[('Frequência', '170 Hz'), ('Velocidade', '340 m por segundo')],
    quer='A questão quer o tamanho de uma onda.',
    equacao='c = v ÷ f (comprimento de onda = velocidade ÷ frequência)',
    porque='Por que dividir? Se fossem 2 ondas em 340 m, cada uma teria 340 ÷ 2 = 170 m.',
    letras=[('c', 'comprimento de onda (o que a questão quer)'), ('v', 'velocidade, em metros por segundo'), ('f', 'frequência, em Hz')],
    telas=[tela('Achando v (velocidade)', 'O enunciado dá direto.\nv = 340 m por segundo'),
           tela('Achando f (frequência)', 'O enunciado dá direto.\nf = 170 Hz')],
    volta='c = 340 ÷ 170\n170 × 2 = 340\nc = 2 m\nLetra E.',
    valores=[('v', '340 m/s'), ('f', '170 Hz')],
    pista='dá velocidade e frequência e pede o comprimento → velocidade ÷ frequência.',
    receita=receita('170 Hz, 340 m/s', 'c = v ÷ f', 'v = 340; f = 170', '340 ÷ 170 = 2'))),

dict(**F(), id='d2-escada-fis-ond-08', resp='C', objeto='grito no paredão', cobra='distância pelo eco (ida e volta)', confere=340 * 2 / 2,
  ancora=ECOS, canal=SEM_ECO,
  enun='Uma pessoa grita diante de um paredão e ouve o eco 2 segundos depois. O som anda 340 m a cada segundo. A que distância está o paredão?',
  alts=['680 m', '170 m', '340 m', '342 m', '85 m'],
  ideia='Em 2 segundos o som anda 680 m, mas isso é ida e volta: o paredão está na metade, 340 m.',
  pecas=[('Eco', 'O som que bate numa parede e volta até quem gritou.')],
  conferencia='caminho 340×2 = 680; metade 340 m. C. A = esqueceu a volta; B = 340/2; D = soma; E = 340/4.',
  sua_vez=('Eco depois de 4 s, som a 340 m por segundo. Distância da parede?', ['680 m', '1 360 m', '340 m', '170 m'], '680 m', '340 × 4 = 1360; metade: 680 m.'),
  aula=dict(
    formulas=[('carro', 'Caminho do som', 'caminho = velocidade × tempo'), ('carro', 'Distância no eco', 'distância = caminho ÷ 2')],
    tenho=[('Velocidade', '340 m por segundo'), ('Tempo do eco', '2 s')],
    quer='A questão quer a distância até o paredão.',
    equacao='d = c ÷ 2 (distância = caminho do som ÷ 2)',
    porque='Por que dividir por 2? Parede a 100 m: o som anda 100 de ida + 100 de volta = 200 m.',
    letras=[('d', 'distância até o paredão (o que a questão quer)'), ('c', 'caminho todo do som, em metros')],
    telas=[tela('Achando c (caminho do som)', 'Velocidade × tempo\n340 × 2 = 680 m')],
    volta='d = 680 ÷ 2 = 340 m\nLetra C.',
    valores=[('c', '680 m')],
    pista='"ouve o eco depois de" → velocidade × tempo e depois a metade.',
    receita=receita('340 m/s, 2 s', 'd = c ÷ 2', 'c = 680', '680 ÷ 2 = 340'))),

dict(**F('medio'), id='d2-escada-fis-ond-09', resp='B', objeto='sonar no subsolo', cobra='velocidade do som por dois ecos', confere=2 * 300 / (0.6 - 0.2),
  ancora=ECOS, canal=SEM_ECO,
  enun='Um aparelho no chão emite um estalo para estudar uma camada de líquido de 300 m de espessura, presa entre duas rochas. O eco do topo da camada volta 0,2 s depois do estalo. O eco do fundo da camada volta 0,6 s depois do estalo. A velocidade do som dentro do líquido é de',
  alts=['500 m/s', '1 500 m/s', '750 m/s', '1 000 m/s', '375 m/s'],
  ideia='O segundo eco demora 0,4 s a mais porque desce e sobe a camada: são 600 m em 0,4 s, ou 1 500 m por segundo.',
  pecas=[('Eco', 'O som que bate numa superfície e volta.'), ('Espessura', 'A grossura da camada: do topo (em cima) até o fundo (embaixo).'), ('m/s', 'Lê-se metros por segundo.')],
  conferencia='d = 600; t = 0,6-0,2 = 0,4; v = 1500. B. A = 300/0,6; C = 300/0,4; D = 600/0,6; E = 300/0,8.',
  sua_vez=('Camada de 100 m; ecos em 0,1 s e 0,3 s. Velocidade na camada?', ['1000 m/s', '500 m/s', '333 m/s', '2000 m/s'], '1000 m/s', '200 m em 0,2 s: 1000 m/s.'),
  aula=dict(
    formulas=[('carro', 'Velocidade', 'velocidade = distância ÷ tempo')],
    tenho=[('Espessura da camada', '300 m'), ('Eco do topo', '0,2 s'), ('Eco do fundo', '0,6 s')],
    quer='A questão quer a velocidade do som só dentro do líquido.',
    equacao='v = d ÷ t (velocidade = distância no líquido ÷ tempo no líquido)',
    porque='Por que dois ecos? O 1º volta do topo. O 2º faz o mesmo caminho e ainda atravessa o líquido.',
    letras=[('v', 'velocidade no líquido (o que a questão quer)'), ('d', 'caminho dentro do líquido, em metros'), ('t', 'tempo dentro do líquido, em segundos')],
    telas=[tela('Achando d (caminho no líquido)', 'A espessura é 300 m: o som desce e sobe.\nd = 300 × 2 = 600 m'),
           tela('Achando t (tempo no líquido)', 'Eco do fundo menos eco do topo.\nt = 0,6 − 0,2 = 0,4 s')],
    volta='v = 600 ÷ 0,4\n0,4 s são 4 décimos de segundo.\nEm 1 décimo: 600 ÷ 4 = 150 m\n1 s tem 10 décimos:\nv = 150 × 10 = 1500 m/s\nLetra B.',
    valores=[('d', '600 m'), ('t', '0,4 s')],
    pista='dois ecos de uma camada → o dobro da espessura, dividido pela diferença dos tempos.',
    receita=receita('300 m; 0,2 s e 0,6 s', 'v = d ÷ t', 'd = 600; t = 0,4', '600 ÷ 0,4 = 1500'))),
]
