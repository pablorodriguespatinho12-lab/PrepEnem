"""Base antes da junção (regra 20 do Pablo, 24/11/2026): um exercício SÓ de cada
conceito de Cinemática (km/h em m/s, aceleração, velocidade constante, saindo do
repouso, queda livre) e depois um que junta. Âncoras reais (só estudo):
ENEM 2020 D2 Q99 (semáforos) e ENEM 2019 D2 Q111 (tijolo em queda livre).
Situações originais, nunca apresentadas como reais.
Gerar: python3 scripts/banco-enem/montar.py base_fisica"""

ARQUIVO = '../escada/fisica-base'

SEMAFORO = 'ENEM 2020 D2 Q99'
TIJOLO = 'ENEM 2019 D2 Q111'
CANAL_VT = 'fis-01 [0:31:30] no gráfico velocidade por tempo, a inclinação é a aceleração'
SEM_QUEDA = 'fora do canal: queda livre não achada em fis-01'


def F(nivel='facil'):
  return {'materia': 'Física', 'tema': 'Cinemática', 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


def tela(titulo, texto):
  return dict(titulo=titulo, texto=texto)


FICHAS = [
dict(**F(), id='d2-escada-fis-cin-04', resp='B', objeto='carro na avenida', cobra='km/h para m/s', confere=72 / 3.6,
  ancora=SEMAFORO, canal='cin-01 [0:54:30] 1 km/h = 1000 ÷ 3600, 1 sobre 3,6',
  enun='O velocímetro de um carro marca 72 km/h numa avenida com semáforos. Mantendo essa velocidade, quantos metros o carro percorre a cada segundo?',
  alts=['259,2 m', '20 m', '72 m', '7,2 m', '2 m'],
  ideia='Para passar de km/h para m/s, divida por 3,6: 72 ÷ 3,6 = 20 metros a cada segundo.',
  pecas=[('km/h', 'Quilômetros por hora. 1 km = 1000 m.'), ('m/s', 'Metros por segundo: quantos metros a cada segundo.')],
  conferencia='72 km/h = 72000 m em 3600 s = 20 m/s. B. A = multiplicou por 3,6; C = não converteu; D = dividiu por 10; E = dividiu por 36.',
  sua_vez=('Um ônibus anda a 36 km/h. Quantos metros por segundo?', ['10 m/s', '36 m/s', '129,6 m/s', '3,6 m/s'], '10 m/s', '36 ÷ 3,6 = 10 m/s.'),
  aula=dict(
    formulas=[('carro', 'km/h para m/s', 'm/s = km/h ÷ 3,6')],
    tenho=[('Velocidade', '72 km/h'), ('1 km (decore)', '1000 m'), ('1 hora (60 × 60)', '3600 s')],
    tenho_texto='A velocidade vem do enunciado. Os outros dois valem sempre.',
    quer='A questão quer os metros percorridos em 1 segundo.',
    equacao='v = k ÷ 3,6 (velocidade em m/s = velocidade em km/h ÷ 3,6)',
    porque='De onde vem o 3,6? Cada km vira 1000 m e cada hora vira 3600 s: 3600 ÷ 1000 = 3,6.',
    letras=[('v', 'velocidade em m/s (o que a questão quer)'), ('k', 'velocidade em km/h')],
    telas=[tela('Achando k (velocidade em km/h)', 'O velocímetro dá direto.\nk = 72 km/h')],
    volta='v = 72 ÷ 3,6\nPara tirar a vírgula, vezes 10 nos dois:\n72 × 10 = 720\n3,6 × 10 = 36\nv = 720 ÷ 36 = 20 m/s\nLetra B.',
    valores=[('k', '72 km/h')],
    pista='velocidade em km/h e pergunta em metros ou segundos → divida por 3,6 antes de tudo.',
    receita=receita('72 km/h', 'v = k ÷ 3,6', 'k = 72', '72 ÷ 3,6 = 20'))),

dict(**F(), id='d2-escada-fis-cin-05', resp='D', objeto='ônibus no semáforo', cobra='aceleração a partir de duas velocidades', confere=(12 - 0) / 8,
  ancora=SEMAFORO, canal=CANAL_VT,
  enun='Um ônibus está parado no semáforo. Quando o sinal abre, ele aumenta a velocidade sempre no mesmo ritmo e, 8 s depois, está a 12 m/s. A aceleração do ônibus é de',
  alts=['96 m/s²', '0,67 m/s²', '12 m/s²', '1,5 m/s²', '4 m/s²'],
  ideia='Aceleração é quanto a velocidade aumenta a cada segundo. Subiu 12 m/s em 8 s: 12 ÷ 8 = 1,5 m/s a cada segundo.',
  pecas=[('Aceleração', 'Quanto a velocidade muda a cada segundo.'), ('m/s²', 'Lê-se metro por segundo ao quadrado: m/s ganhos a cada segundo.'), ('Parado', 'Velocidade inicial igual a 0.')],
  conferencia='a = (12-0)/8 = 1,5 m/s². D. A = 12×8; B = 8/12; C = só a velocidade final; E = 12-8.',
  sua_vez=('Uma moto vai de 0 a 20 m/s em 5 s. Aceleração?', ['4 m/s²', '100 m/s²', '15 m/s²', '0,25 m/s²'], '4 m/s²', '20 ÷ 5 = 4 m/s².'),
  aula=dict(
    formulas=[('carro', 'Aceleração', 'a = mudança de velocidade ÷ tempo')],
    tenho=[('Velocidade no começo', '0 (parado)'), ('Velocidade no fim', '12 m/s'), ('Tempo', '8 s')],
    quer='A questão quer a aceleração.',
    equacao='a = m ÷ t (aceleração = mudança de velocidade ÷ tempo)',
    porque='Por que dividir? Se ganhasse 10 m/s em 5 s, seriam 10 ÷ 5 = 2 m/s em cada segundo.',
    letras=[('a', 'aceleração (o que a questão quer)'), ('m', 'mudança de velocidade, em m/s'), ('t', 'tempo, em segundos')],
    telas=[tela('Achando m (mudança de velocidade)', 'Velocidade do fim menos a do começo.\nm = 12 − 0 = 12 m/s'),
           tela('Achando t (tempo)', 'O enunciado dá direto.\nt = 8 s')],
    volta='a = 12 ÷ 8\n12 ÷ 4 = 3\n8 ÷ 4 = 2\na = 3 ÷ 2\n2 cabe 1 vez em 3 e sobra metade: 1,5 m/s²\nLetra D.',
    valores=[('m', '12 m/s'), ('t', '8 s')],
    pista='"aceleração" com duas velocidades e um tempo → (fim − começo) ÷ tempo.',
    receita=receita('0, 12 m/s, 8 s', 'a = m ÷ t', 'm = 12; t = 8', '12 ÷ 8 = 1,5'))),

dict(**F(), id='d2-escada-fis-cin-06', resp='A', objeto='caminhão na avenida', cobra='distância com velocidade constante', confere=20 * 15,
  ancora=SEMAFORO, canal='fis-01 [0:42:30] movimento uniforme: a posição cresce em linha reta',
  enun='Um caminhão segue por uma avenida reta com velocidade constante de 20 m/s. Que distância ele percorre em 15 s?',
  alts=['300 m', '35 m', '1,33 m', '150 m', '3 000 m'],
  ideia='Com velocidade constante, cada segundo rende os mesmos metros: 20 m por segundo, durante 15 s, dá 300 m.',
  pecas=[('Velocidade constante', 'A velocidade não muda: todo segundo anda o mesmo tanto.')],
  conferencia='d = 20×15 = 300 m. A. B = soma; C = 20/15; D = metade; E = zero a mais.',
  sua_vez=('A 10 m/s constantes, que distância se anda em 30 s?', ['300 m', '40 m', '3 m', '150 m'], '300 m', '10 × 30 = 300 m.'),
  aula=dict(
    formulas=[('carro', 'Velocidade constante', 'distância = velocidade × tempo')],
    tenho=[('Velocidade', '20 m/s (constante)'), ('Tempo', '15 s')],
    quer='A questão quer a distância percorrida.',
    equacao='d = v × t (distância = velocidade × tempo)',
    porque='Por que vezes? São 15 segundos, e em cada um o caminhão anda 20 m.',
    letras=[('d', 'distância (o que a questão quer)'), ('v', 'velocidade, em m/s'), ('t', 'tempo, em segundos')],
    telas=[tela('Achando v (velocidade)', 'O enunciado dá direto.\nv = 20 m/s'),
           tela('Achando t (tempo)', 'O enunciado dá direto.\nt = 15 s')],
    volta='d = 20 × 15 = 300 m\nLetra A.',
    valores=[('v', '20 m/s'), ('t', '15 s')],
    pista='"velocidade constante" → distância = velocidade × tempo.',
    receita=receita('20 m/s, 15 s', 'd = v × t', 'v = 20; t = 15', '20 × 15 = 300'))),

dict(**F(), id='d2-escada-fis-cin-07', resp='C', objeto='moto no semáforo', cobra='distância saindo do repouso com aceleração', confere=(0 + 20) / 2 * 10,
  ancora=SEMAFORO, canal='fis-01 [0:30:30] no gráfico velocidade por tempo, a área é a distância',
  enun='Uma moto parte do repouso e aumenta a velocidade sempre no mesmo ritmo. Em 10 s ela chega a 20 m/s. Que distância a moto percorre nesses 10 s?',
  alts=['200 m', '2 m', '100 m', '30 m', '50 m'],
  ideia='A velocidade sobe por igual de 0 a 20, então a média é 10 m/s. Em 10 s, a moto anda 10 × 10 = 100 m.',
  pecas=[('Repouso', 'Parado: velocidade 0.'), ('Velocidade média', 'Com a velocidade subindo por igual: o meio entre a do começo e a do fim.')],
  conferencia='vm = (0+20)/2 = 10; d = 10×10 = 100 m. C. A = usou 20 m/s o tempo todo; B = aceleração; D = 20+10; E = dividiu por 2 duas vezes.',
  sua_vez=('De 0 a 30 m/s, por igual, em 4 s. Distância?', ['60 m', '120 m', '15 m', '34 m'], '60 m', 'Média 15 m/s; 15 × 4 = 60 m.'),
  aula=dict(
    formulas=[('carro', 'Velocidade média', 'média = (começo + fim) ÷ 2'), ('carro', 'Distância', 'distância = média × tempo')],
    tenho=[('Velocidade no começo', '0'), ('Velocidade no fim', '20 m/s'), ('Tempo', '10 s')],
    quer='A questão quer a distância percorrida.',
    equacao='d = m × t (distância = velocidade média × tempo)',
    porque='Por que a média? A moto não andou a 20 m/s o tempo todo: começou em 0 e foi subindo por igual.',
    letras=[('d', 'distância (o que a questão quer)'), ('m', 'velocidade média, em m/s'), ('t', 'tempo, em segundos')],
    telas=[tela('Achando m: o seu jeito', 'Parece certo usar 20 m/s: daria 200 m, a letra A.\nMas ela só chega a 20 no fim.\nm = (0 + 20) ÷ 2 = 10 m/s'),
           tela('Achando m: por que o meio', 'O começo lento compensa o fim rápido, em pares.\n0 + 20 = 20\nDepois sobe 5 no começo e desce 5 no fim:\n0 + 5 = 5\n20 − 5 = 15\n5 + 15 = 20\nCada par vale o mesmo que 10 + 10.'),
           tela('Achando t (tempo)', 'O enunciado dá direto.\nt = 10 s')],
    volta='d = 10 × 10 = 100 m\nLetra C.',
    valores=[('m', '10 m/s'), ('t', '10 s')],
    pista='velocidade subindo por igual → média entre começo e fim, vezes o tempo.',
    receita=receita('0, 20 m/s, 10 s', 'd = m × t', 'm = 10; t = 10', '10 × 10 = 100'))),

dict(**F(), id='d2-escada-fis-cin-08', resp='E', objeto='chave que cai', cobra='velocidade na queda livre', confere=10 * 3,
  ancora=TIJOLO, canal=SEM_QUEDA,
  enun='Uma chave escapa da mão de um pintor, no alto de um prédio, e cai a partir do repouso durante 3 s. Considere g = 10 m/s² e despreze a resistência do ar. A velocidade da chave ao fim dos 3 s é de',
  alts=['10 m/s', '45 m/s', '3,3 m/s', '13 m/s', '30 m/s'],
  ideia='Na queda livre, a velocidade aumenta 10 m/s a cada segundo. Em 3 s: 10 × 3 = 30 m/s.',
  pecas=[('Queda livre', 'Cair só puxado pela Terra, sem o ar atrapalhar.'), ('g = 10 m/s²', 'g é a gravidade: caindo, a velocidade ganha 10 m/s a cada segundo.'), ('Repouso', 'Parado: velocidade 0.')],
  conferencia='v = 10×3 = 30 m/s. E. A = só g; B = altura (45 m); C = 10/3; D = soma.',
  sua_vez=('Uma pedra cai do repouso por 2 s (g = 10). Velocidade?', ['20 m/s', '10 m/s', '5 m/s', '12 m/s'], '20 m/s', '10 × 2 = 20 m/s.'),
  aula=dict(
    formulas=[('carro', 'Velocidade na queda', 'velocidade = g × tempo')],
    tenho=[('Começo', 'parada (0)'), ('g', '10 m/s²'), ('Tempo', '3 s')],
    quer='A questão quer a velocidade depois de 3 s.',
    equacao='v = g × t (velocidade = gravidade × tempo)',
    porque='Por que vezes? Com 1 s: 10 m/s. Com 2 s: 20 m/s. Com 3 s: 30 m/s.',
    letras=[('v', 'velocidade no fim (o que a questão quer)'), ('g', 'gravidade, em m/s²'), ('t', 'tempo de queda, em segundos')],
    telas=[tela('Achando g (gravidade)', 'O enunciado dá direto.\ng = 10 m/s²'),
           tela('Achando t (tempo)', 'O enunciado dá direto.\nt = 3 s')],
    volta='v = 10 × 3 = 30 m/s\nLetra E.',
    valores=[('g', '10 m/s²'), ('t', '3 s')],
    pista='"cai do repouso" e pergunta a velocidade → gravidade × tempo.',
    receita=receita('0, g = 10, 3 s', 'v = g × t', 'g = 10; t = 3', '10 × 3 = 30'))),

dict(**F(), id='d2-escada-fis-cin-09', resp='B', objeto='tijolo na obra', cobra='altura na queda livre', confere=(0 + 10 * 2) / 2 * 2,
  ancora=TIJOLO, canal=SEM_QUEDA,
  enun='Em uma obra, um tijolo cai a partir do repouso e leva 2 s para chegar ao chão. Considere g = 10 m/s² e despreze a resistência do ar. De que altura o tijolo caiu?',
  alts=['40 m', '20 m', '10 m', '5 m', '12 m'],
  ideia='A velocidade vai de 0 a 20 m/s, então a média é 10 m/s. Em 2 s o tijolo desce 10 × 2 = 20 m.',
  pecas=[('Velocidade média', 'Com a velocidade subindo por igual: o meio entre a do começo e a do fim.')],
  conferencia='v = 10×2 = 20; média 10; h = 10×2 = 20 m. B. A = usou 20 m/s o tempo todo; C = usou a média e esqueceu o tempo; D = altura de 1 s; E = soma.',
  sua_vez=('Um objeto cai do repouso por 4 s (g = 10). Altura?', ['80 m', '160 m', '40 m', '14 m'], '80 m', 'Fim 40 m/s, média 20; 20 × 4 = 80 m.'),
  aula=dict(
    formulas=[('carro', 'Velocidade na queda', 'velocidade = g × tempo'), ('carro', 'Altura', 'altura = média × tempo')],
    tenho=[('Começo', 'parado (0)'), ('g', '10 m/s²'), ('Tempo', '2 s')],
    quer='A questão quer a altura da queda.',
    equacao='h = m × t (altura = velocidade média × tempo)',
    porque='Por que a média? O tijolo começa parado e vai ficando mais rápido por igual.',
    letras=[('h', 'altura (o que a questão quer)'), ('m', 'velocidade média, em m/s'), ('t', 'tempo de queda, em segundos')],
    telas=[tela('Achando m (velocidade média)', 'Velocidade no fim = g × tempo\n10 × 2 = 20 m/s\nm = (0 + 20) ÷ 2 = 10 m/s'),
           tela('Achando m: por que o meio', 'O começo lento compensa o fim rápido, em pares.\n0 + 20 = 20\nDepois sobe 5 no começo e desce 5 no fim:\n0 + 5 = 5\n20 − 5 = 15\n5 + 15 = 20\nCada par vale o mesmo que 10 + 10.'),
           tela('Achando t (tempo)', 'O enunciado dá direto.\nt = 2 s')],
    volta='h = 10 × 2 = 20 m\nLetra B.',
    valores=[('m', '10 m/s'), ('t', '2 s')],
    pista='queda com tempo dado e pergunta a altura → ache a velocidade do fim, tire a média, vezes o tempo.',
    receita=receita('0, g = 10, 2 s', 'h = m × t', 'm = 10; t = 2', '10 × 2 = 20'))),

dict(**F('medio'), id='d2-escada-fis-cin-10', resp='D', objeto='carro no semáforo', cobra='acelerar e depois seguir constante', confere=20 + (400 - 200) / 20,
  ancora=SEMAFORO, canal=CANAL_VT,
  enun='Um carro parte do repouso num semáforo e acelera 1 m/s a cada segundo até atingir 72 km/h. A partir daí, segue com velocidade constante. Quanto tempo depois da partida o carro está a 400 m do semáforo?',
  alts=['20 s', '5,6 s', '40 s', '30 s', '10 s'],
  ideia='São dois trechos: primeiro acelera até 20 m/s (20 s e 200 m), depois anda os 200 m que faltam a 20 m/s (10 s). Total: 30 s.',
  pecas=[('Trecho', 'Um pedaço do caminho com um só tipo de movimento.')],
  conferencia='72/3,6 = 20; t1 = 20/1 = 20 s; d1 = 10×20 = 200 m; t2 = 200/20 = 10 s; total 30 s. D. A = só o 1º trecho; B = 400/72; C = 400 m com média 10 o tempo todo; E = só o 2º.',
  sua_vez=('Do repouso, 2 m/s a cada segundo até 20 m/s, depois constante. Tempo para 300 m?', ['20 s', '10 s', '15 s', '30 s'], '20 s', '10 s e 100 m; faltam 200 m a 20 m/s = 10 s; total 20 s.'),
  aula=dict(
    formulas=[('carro', 'km/h para m/s', 'm/s = km/h ÷ 3,6'), ('carro', 'Tempo para acelerar', 'tempo = mudança de velocidade ÷ aceleração'), ('carro', 'Distância', 'distância = média × tempo')],
    tenho=[('Aceleração', '1 m/s a cada segundo'), ('Velocidade máxima', '72 km/h'), ('Distância', '400 m')],
    quer='A questão quer o tempo total até os 400 m.',
    equacao='t = x + y (tempo total = tempo acelerando + tempo constante)',
    porque='Por que duas partes? O movimento muda quando o carro chega a 72 km/h.',
    letras=[('t', 'tempo total (o que a questão quer)'), ('x', 'tempo acelerando, em segundos'), ('y', 'tempo em velocidade constante, em segundos')],
    telas=[tela('Achando x (tempo acelerando)', '72 ÷ 3,6 = 20 m/s\nGanha 1 m/s por segundo:\n1 s dá 1 m/s, 2 s dão 2 m/s\nx = 20 ÷ 1 = 20 s'),
           tela('Achando y: quanto já andou', 'Velocidade média: (0 + 20) ÷ 2 = 10 m/s\nDurante 20 segundos:\n10 × 20 = 200 m\n400 − 200 = 200 m faltando'),
           tela('Achando y: o tempo que falta', 'Agora cada segundo rende 20 m.\nQuantos 20 cabem em 200?\ny = 200 ÷ 20 = 10 s')],
    volta='t = 20 + 10 = 30 s\nLetra D.',
    valores=[('x', '20 s'), ('y', '10 s')],
    pista='"acelera até... e a partir daí constante" → separe em dois trechos e some os tempos.',
    receita=receita('1 m/s², 72 km/h, 400 m', 't = x + y', 'x = 20; y = 10', '20 + 10 = 30'))),
]
