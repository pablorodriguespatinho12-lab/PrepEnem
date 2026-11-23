"""Correções do aluno-do-zero nas 24 questões de Física (23/11/2026, 2 levas de 12).

Cada `aj(...)` troca campos de uma questão de acima_fisica_novas.py: fórmula com origem e caso com número,
conta sem salto, letra única (sem Q/N/A/B repetidos), dado que sobra avisado, 4 bugs de gabarito/figura.
`motivos` troca o motivo do erro de uma alternativa (índice na ordem crescente original).
"""
AJUSTES = {}


def aj(sufixo, **campos):
    AJUSTES.setdefault('d2-escada-fis-ita-' + sufixo, {}).update(campos)


aj('cin-00a', origem="Tempo = distância ÷ velocidade: se anda 20 m a 5 m/s, leva 20 ÷ 5 = 4 s. Para passar km/h para m/s divide-se por 3,6: 1 km/h = 1 000 m em 3 600 s, e 1 000 ÷ 3 600 = 1 ÷ 3,6. Exemplo: 36 km/h = 10 m/s. Passamos tudo para metros e segundos para as unidades baterem. O ponto · significa vezes.",
   ideia='Radar de trecho multa pela velocidade média, então o que vale é o tempo total. O limite permite um tempo mínimo, e ele gastou menos que isso.',
   achando=[('Achando M: o tempo mínimo', '90 km/h ÷ 3,6 = 25 m/s (veja a tela de cima). O trecho tem 12 km = 12 000 m.\nM = 12 000 ÷ 25 = 480 s (25 · 480 = 12 000), ou seja, 8 minutos.'),
            ('Achando G: o tempo gasto', 'Das 8 h 00 min 00 s às 8 h 07 min 00 s passaram 7 minutos. 1 minuto tem 60 segundos.\nG = 7 · 60 = 420 s.')],
   volta='D = 480 − 420 = 60 s.\nLetra A. Conferindo: 8 min = 480 s; 12 000 ÷ 480 = 25 m/s, e 25 · 3,6 = 90 km/h, o limite exato.')
aj('cin-00b', origem="Queda livre é cair só com a gravidade puxando. Largada parada, com g = 10: depois de 1 s a pedra está a 10 m/s e caiu 5 m; depois de 2 s, a 20 m/s e caiu 20 m; depois de 3 s, a 30 m/s e caiu 45 m. Conferindo: 2 · 10 · 45 = 900 e 30 · 30 = 900. Por isso Y² = 2 · g · altura (Y² quer dizer Y · Y). Pitágoras: num triângulo com um canto reto, a diagonal ao quadrado é a soma dos quadrados dos outros dois lados (3, 4 e 5: 9 + 16 = 25). Aqui V = velocidade total (a diagonal), X = parte horizontal, Y = parte vertical.",
   achando=[('Achando X: a parte horizontal', 'Nada empurra nem freia a pedra para o lado: em 1 s, 2 s ou 3 s ela segue andando 40 m a cada segundo.\nX = 40 m/s.'),
            ('Achando Y: a parte vertical', 'Y² = 2 · g · altura = 2 · 10 · 45 = 900.\nComo 30 · 30 = 900, Y = 30 m/s.')],
   volta='V² = 40² + 30² = 1 600 + 900 = 2 500 (40² = 40 · 40 e 30² = 30 · 30).\nV é o número que vezes ele mesmo dá 2 500: 50 · 50 = 2 500. V = 50 m/s.\nLetra B.')
aj('cin-00c', origem="3 m/s é 3 metros a cada segundo: em 2 s ela anda 6 m e em 60 s anda 180 m (distância = velocidade · tempo). Quando duas pessoas vêm uma contra a outra, a distância entre elas diminui a soma das velocidades: 3 + 5 = 8 m a cada segundo (em 2 s diminui 16 m).",
   ideia='Quando Bia sai, Ana já está a 180 m de P. Entre as duas sobram 1 140 − 180 = 960 m, e os dois juntos precisam fechar essa distância.',
   formulas=[('carro', 'Distância', 'distância = velocidade · tempo'), ('carro', 'Aproximação', 'soma das duas velocidades')],
   eq='X = V + 3 · t', leitura='posição do encontro = vantagem de Ana + o que ela anda depois',
   letras=[('X', 'distância de P até o encontro (o que a questão quer)'), ('V', 'vantagem de Ana quando Bia sai, em m'), ('t', 'tempo, depois de Bia sair, até se cruzarem, em s')],
   achando=[('Achando V: a vantagem de Ana', 'Ela correu sozinha por 60 s a 3 m/s.\nV = 3 · 60 = 180 m.'),
            ('Achando t: o tempo até se cruzarem', 'Sobram 1 140 − 180 = 960 m entre os dois. Eles se aproximam a 3 + 5 = 8 m/s.\nt = 960 ÷ 8 = 120 s.')],
   volta='X = 180 + 3 · 120 = 540 m.\nLetra C. Conferindo por Bia: 5 · 120 = 600 m, e 540 + 600 = 1 140 m.',
   valores=[('V', '180 m'), ('t', '120 s')], rec3='V = 180 m; t = 120 s')
aj('cin-00d', origem="r diz quanto a escada anda comparada com a pessoa: r = 0,5 é metade, r = 1 é igual (pessoa a 2 degraus por segundo e escada a 1: r = 1 ÷ 2 = 0,5). N = degraus que aparecem com a escada parada. Subindo, a pessoa pisa 30 degraus e, nesse tempo, a escada traz mais 30 · r: com r = 0,5 são 15, total 30 + 15 = 45. Em geral N = 30 + 30 · r = 30 · (1 + r). Descendo, a escada leva embora 90 · r: N = 90 − 90 · r = 90 · (1 − r). 'Conta' quer dizer os degraus em que ela pisa.",
   achando=[('Achando r: a razão das velocidades', '30 · (1 + r) = 30 + 30 · r e 90 · (1 − r) = 90 − 90 · r (30r quer dizer 30 vezes r).\nIgualando: 30 + 30 · r = 90 − 90 · r.\nSomo 90 · r nos dois lados: 30 + 120 · r = 90.\nTiro 30: 120 · r = 60.\nr = 60 ÷ 120 = 0,5.')],
   checagem=('Subindo, conta 20 degraus; descendo, 60. Quantos degraus visíveis?', ['30', '40', '35', '45'], '30',
             '20 + 20r = 60 − 60r; então 20 + 80r = 60, 80r = 40 e r = 0,5. N = 20 · 1,5 = 30.'))
aj('din-00a', origem="Aceleração é quanto a velocidade cresce por segundo: 1,2 m/s² quer dizer que ela ganha 1,2 m/s a cada segundo. m = 70 kg é a massa da pessoa. Newton (N) é a unidade de força: parado, o chão empurra a pessoa com 70 · 10 = 700 N. A balança divide a força por g: 700 ÷ 10 = 70 kg, a massa certa.",
   formulas=[('carro', 'Aceleração', 'a = variação da velocidade ÷ tempo'), ('caixa', 'Força de contato (subindo)', 'F = m · (g + a)')],
   eq='L = F ÷ g', leitura='leitura em kg = força de contato ÷ g',
   letras=[('L', 'valor mostrado pela balança, em kg (o que a questão quer)'), ('F', 'força de contato da balança, em N'), ('a', 'aceleração do elevador, em m/s²')],
   eq_texto='A balança mostra a força que recebe dividida por g. Essa força depende da massa (70 kg) e da aceleração do elevador. Depois dos 5 s não há aceleração, então esse trecho não entra na conta.\nAgora é só achar a e F.',
   achando=[('Achando a: a aceleração', 'Saiu do repouso e chegou a 6 m/s em 5 s.\na = 6 ÷ 5 = 1,2 m/s².'),
            ('Achando F: a força de contato', 'Elevador parado: o chão empurra com 70 · 10 = 700 N. Acelerando a 1,2, o chão ainda dá 70 · 1,2 = 84 N para acelerar a pessoa.\nF = 700 + 84 = 784 N, o mesmo que 70 · (10 + 1,2).')],
   volta='L = 784 ÷ 10 = 78,4 kg.\nLetra E. São 78,4 − 70 = 8,4 kg a mais, só enquanto o elevador acelera; depois dos 5 s a balança volta a marcar 70 kg.',
   valores=[('a', '1,2 m/s²'), ('F', '784 N')], rec3='a = 1,2; F = 784 N',
   pista='"balança dentro do elevador" → ache a aceleração; subindo e acelerando, F = m · (g + a); a leitura em kg é F ÷ g.')
aj('din-00b', origem="O peso do bloco é m · g = 2 · 10 = 20 N. No plano inclinado ele se divide em duas partes: 0,6 do peso puxa o bloco ao longo do plano para baixo (20 · 0,6 = 12 N) e 0,8 do peso aperta o bloco contra o plano (20 · 0,8 = 16 N). O enunciado deu 0,6 e 0,8 para isso. μ (lê-se 'mi') é o coeficiente de atrito, o 0,5 do enunciado: o atrito vale 0,5 do aperto. Força = massa · aceleração, então aceleração = força ÷ massa.",
   formulas=[('carro', 'Distância até parar', 'v² = 2 · a · d (v é a inicial)'), ('caixa', 'Atrito', 'atrito = μ · aperto no plano')],
   pecas=[('Aperto no plano (normal)', 'A força que o plano faz contra o bloco, em ângulo reto com o plano. O atrito é o coeficiente vezes essa força.')],
   achando=[('Achando v: a velocidade inicial', 'O enunciado dá: v = 12 m/s.\nv² = 12 · 12 = 144.'),
            ('Achando a: a desaceleração', 'Peso ao longo do plano: 20 · 0,6 = 12 N. Aperto: 20 · 0,8 = 16 N. Atrito: 0,5 · 16 = 8 N.\nSubindo, o peso e o atrito puxam os dois para baixo, contra o movimento: 12 + 8 = 20 N.\na = 20 ÷ 2 = 10 m/s².')],
   volta='Freando até parar vale v · v = 2 · a · d (teste: v = 4 e a = 2 dão d = 4, pois 16 = 2 · 2 · 4). Dividindo por 2 · a: d = v² ÷ (2 · a).\nd = 144 ÷ 20 = 7,2 m.\nLetra A.',
   checagem=('Sem atrito, o mesmo bloco (seno 0,6, v = 12 m/s, g = 10) sobe quanto no plano?', ['12 m', '7,2 m', '14,4 m', '24 m'], '12 m',
             'Força = 20 · 0,6 = 12 N e a = 12 ÷ 2 = 6 (a massa cancela: a = g · 0,6). d = 144 ÷ 12 = 12 m.'))
aj('din-00c', origem="Força = massa · aceleração: um bloco de 2 kg com 10 N de força acelera 10 ÷ 2 = 5 m/s². Peso é a força da gravidade: B pesa 2 · 10 = 20 N. 'Ideal' quer dizer sem massa e sem atrito; por isso a tração vale o mesmo nas duas pontas do fio. O peso de A (3 · 10 = 30 N) é segurado pela mesa e não entra na conta.",
   formulas=[('caixa', '2ª lei de Newton', 'força = massa · aceleração'), ('caixa', 'Peso', 'peso = massa · g')],
   eq='T = mA · a', leitura='tração = massa de A · aceleração do sistema',
   letras=[('T', 'tração no fio, em N (o que a questão quer)'), ('mA', 'massa do bloco A, em kg'), ('a', 'aceleração dos blocos, em m/s²')],
   eq_texto='Em A, a única força na horizontal é a tração. Então T = mA · a.\nAgora é só achar mA e a.',
   achando=[('Achando mA: a massa de A', 'A tração age no bloco A, que tem 3 kg.\nmA = 3 kg.'),
            ('Achando a: a aceleração', 'O fio liga os blocos: se um anda, o outro anda igual. Os 20 N do peso de B puxam o conjunto todo, de 3 + 2 = 5 kg.\na = 20 ÷ 5 = 4 m/s².')],
   volta='T = 3 · 4 = 12 N.\nLetra B. Conferindo em B: o peso (20 N) puxa para baixo e a tração (12 N) para cima; sobram 20 − 12 = 8 N, que aceleram B: 2 · 4 = 8.',
   valores=[('mA', '3 kg'), ('a', '4 m/s²')], rec3='mA = 3 kg; a = 4 m/s²')
aj('din-00d', origem="L = comprimento do fio, 1,25 m (também quanto a esfera desce até o ponto mais baixo). v = velocidade da esfera lá embaixo. É a conta da queda livre: cair 1,25 m dá v² = 2 · 10 · 1,25 = 25. Para andar em círculo, algo precisa puxar a esfera para o centro: essa força cresce com a massa e com a velocidade e diminui se a curva é mais aberta, C = m · v² ÷ L (o raio do círculo é o fio). Pêndulo é um peso preso a um fio que balança.",
   eq_texto='Embaixo, o fio puxa para cima (T) e o peso puxa para baixo (P). O que sobra para cima, T − P, é a força que curva: T − P = C. Então T = P + C.\nAgora é só achar P e C.',
   achando=[('Achando P: o peso', 'P = m · g = 2 · 10 = 20 N.'),
            ('Achando C: a força que curva', 'Velocidade: v² = 2 · g · L = 2 · 10 · 1,25 = 25; como 5 · 5 = 25, v = 5 m/s.\nC = m · v² ÷ L = 2 · 25 ÷ 1,25 = 50 ÷ 1,25 = 40 N (1,25 · 40 = 50).')],
   volta='T = 20 + 40 = 60 N.\nLetra C. É 3 vezes o peso, e vale para qualquer massa e qualquer fio, se a esfera é solta da horizontal e olhamos o ponto mais baixo (na checagem: 30 N = 3 · 10).')
aj('ter-00a', origem="c = calor específico: quanto calor 1 kg de água precisa para subir 1 °C. A água quente cede m · c · 32 (70 − 38 = 32 graus) e a fria recebe m · c · 18 (38 − 20 = 18 graus). Como 1 L = 1 kg e o c é igual dos dois lados, ele some: sobra Lq · 32 = Lf · 18. 32 · Lq quer dizer 32 vezes Lq.",
   eq='Lq · 32 = Lf · 18', leitura='litros quentes · queda (70 − 38) = litros frios · subida (38 − 20)',
   letras=[('Lq', 'litros de água quente (o que a questão quer)'), ('Lf', 'litros de água fria')],
   eq_texto='A quente cai de 70 para 38 (32 graus) e a fria sobe de 20 para 38 (18 graus). O calor cedido é igual ao recebido, e c e a massa por litro se cancelam.\nAgora é só achar Lf.',
   achando=[('Achando Lf: os litros de água fria', 'A banheira tem 40 L no total: Lf = 40 − Lq.\nSubstituindo na equação: Lq · 32 = (40 − Lq) · 18.')],
   volta='(40 − Lq) · 18 = 40 · 18 − 18 · Lq = 720 − 18 · Lq (40 · 18 = 720).\nSomo 18 · Lq nos dois lados: 32 · Lq + 18 · Lq = 50 · Lq = 720.\nLq = 720 ÷ 50 = 14,4 L.\nLetra A. Então Lf = 40 − 14,4 = 25,6 L. Conferindo: 14,4 · 32 = 460,8 e 25,6 · 18 = 460,8.',
   valores=[('Lf', '40 − Lq = 25,6 L')], rec3='Lf = 40 − Lq',
   formulas=[('termometro', 'Calor trocado', 'Q = m · c · variação da temperatura'), ('termometro', 'Equilíbrio', 'calor cedido = calor recebido')],
   checagem=('Misturam-se 10 L de água a 80 °C com 30 L a 20 °C. Qual a temperatura final?', ['35 °C', '50 °C', '40 °C', '30 °C'], '35 °C',
             '10 · (80 − T) = 30 · (T − 20): 800 − 10T = 30T − 600, então 1 400 = 40T e T = 35 °C.'))
aj('ter-00b', dados=[('Pressão', '2,0 × 10⁵ Pa (constante)'), ('Volume', '3,0 L para 5,0 L'), ('Conversão', '1 L = 10⁻³ m³'), ('Energia interna', 'U = (3/2) · n · R · T')],
   origem="Δ (delta) quer dizer quanto mudou: ΔV = volume final − volume inicial. 10⁵ = 100 000 e 10⁻³ = 1 ÷ 1 000 = 0,001. Pa (pascal) é a unidade de pressão e J (joule), a de energia. Trabalho é a energia que o gás gasta empurrando o ambiente quando aumenta de volume. Monoatômico = gás de átomos soltos (como o hélio): por isso vale o 3/2. Na lei p · V = n · R · T, n é a quantidade de gás, R uma constante e T a temperatura.",
   formulas=[('termometro', 'Primeira lei', 'Q = W + ΔU'), ('termometro', 'Trabalho (pressão constante)', 'W = p · ΔV'), ('termometro', 'Gás ideal', 'p · V = n · R · T')],
   eq='Q = W + ΔU', leitura='calor recebido = trabalho feito + aumento da energia interna',
   letras=[('Q', 'calor recebido, em J (o que a questão quer)'), ('W', 'trabalho do gás, em J'), ('ΔU', 'variação da energia interna, em J')],
   eq_texto='Pela primeira lei da termodinâmica, o calor se divide em trabalho e energia interna.\nAgora é só achar W e ΔU.',
   achando=[('Achando W: o trabalho', 'ΔV = 5 − 3 = 2 L = 2 · 0,001 = 0,002 m³.\nW = p · ΔV = 200 000 · 0,002 = 400 J.'),
            ('Achando ΔU: a energia interna', 'Como p é constante, a mudança de n · R · T vale p · ΔV. Então ΔU = (3/2) · n · R · ΔT = (3/2) · p · ΔV.\n(3/2) lê-se "três meios" e vale 1,5. ΔU = 1,5 · 400 = 600 J.')],
   volta='Q = 400 + 600 = 1 000 J.\nLetra E.', valores=[('W', '400 J'), ('ΔU', '600 J')], rec3='W = 400 J; ΔU = 600 J')
aj('ter-00c', origem="c = calor específico: quanto calor 1 g precisa para subir 1 °C (gelo: 0,5 cal). L = calor latente: o calor para derreter 1 g (80 cal). O gelo derrete a 0 °C e fica em 0 °C até derreter por completo; por isso são 3 etapas: de −10 a 0 °C (10 graus), derreter, e de 0 a 20 °C. Caloria e joule são unidades de energia; a potência é em joules por segundo (W), então passamos tudo para joules: 1 cal = 4 J.",
   formulas=[('termometro', 'Calor que muda a temperatura', 'Q = m · c · variação'), ('termometro', 'Calor da fusão', 'Q = m · L'), ('circuito', 'Potência', 'tempo = energia ÷ potência')],
   volta='t = 84 000 ÷ 700 = 840 ÷ 7 = 120 s (700 W dão 1 400 J em 2 s).\nLetra A.')
aj('ter-00d', origem="k = condutividade térmica: quanto o material deixa o calor passar (cobre alto, madeira baixo). Fluxo é quanto calor passa por segundo: passa mais se k é alto e a diferença de temperatura entre as pontas é grande, e menos se a barra é comprida. A grossura (seção) também conta, mas é igual nas duas barras. 'Em série' é uma barra depois da outra, com o mesmo calor passando por todas. A barra A vai de 100 °C até T: diferença 100 − T. A barra B vai de T até 0 °C: diferença T − 0.",
   eq='kA · (100 − T) = kB · (T − 0)', leitura='fluxo em A = fluxo em B (mesmo comprimento e seção)',
   letras=[('T', 'temperatura da junção, em °C (o que a questão quer)'), ('kA', 'condutividade de A'), ('kB', 'condutividade de B')],
   eq_texto='Como as barras têm o mesmo comprimento e a mesma seção, o fluxo só depende de k e da diferença de temperatura de cada barra.\nAgora é só achar kA e kB.',
   achando=[('Achando kA: a condutividade de A', 'O enunciado dá: kA = 300 W/(m · K) (a unidade é só a de k).'),
            ('Achando kB: a condutividade de B', 'O enunciado dá: kB = 100 W/(m · K).')],
   volta='300 · (100 − T) = 100 · T. Como 300 · 100 = 30 000: 30 000 − 300 · T = 100 · T.\nSomo 300 · T nos dois lados: 30 000 = 400 · T.\nT = 30 000 ÷ 400 = 75 °C (300 ÷ 4).\nLetra B. Conferindo: 300 · 25 = 7 500 e 100 · 75 = 7 500.',
   valores=[('kA', '300'), ('kB', '100')], rec3='kA = 300; kB = 100', rec1='100 °C, 0 °C, kA = 300, kB = 100',
   dados=[('Ponta de A', '100 °C'), ('Ponta de B', '0 °C'), ('Condutividade de A', '300 W/(m · K)'), ('Condutividade de B', '100 W/(m · K)'), ('Barras', 'mesmo comprimento e seção')])
aj('ond-00a', origem="Ultrassom é um som agudo demais para o ouvido humano; pulso é um apito curtinho. Distância = velocidade · tempo: se o som anda 1 500 m a cada segundo, em 2 s anda 3 000 m. Com números: o eco do cardume voltou em 0,2 s: 1 500 · 0,2 = 300 m de ida e volta, então o cardume está a 300 ÷ 2 = 150 m. O do fundo voltou em 0,8 s: 1 200 m de ida e volta, 600 m de profundidade. Entre os dois: 600 − 150 = 450 m. A conta curta usa o intervalo de 0,6 s.")
aj('ond-00b', origem="Frequência é quantas vezes por segundo o som se repete: 640 Hz são 640 apitos por segundo. Fonte é quem faz o som, aqui a sirene. Em 1 s o primeiro apito anda 340 m e a ambulância anda 20 m; os 640 apitos ficam espremidos em 340 − 20 = 320 m, em vez de 340 m, e chegam mais apitos por segundo ao pedestre: multiplica-se por 340 ÷ 320 (maior que 1, porque dividimos por um número menor).",
   ideia='Quando a ambulância se aproxima, os apitos ficam espremidos num espaço menor e chegam mais vezes por segundo ao pedestre. O fator é a velocidade do som dividida por (som menos ambulância).',
   formulas=[('onda', 'Doppler (fonte se aproxima)', 'fo = fe · V ÷ (V − va)'), ('carro', 'km/h para m/s', 'm/s = km/h ÷ 3,6')],
   eq='fo = fe · V ÷ (V − va)', leitura='frequência ouvida = emitida · som ÷ (som − ambulância)',
   letras=[('fo', 'frequência ouvida, em Hz (o que a questão quer)'), ('fe', 'frequência emitida, em Hz'), ('V', 'velocidade do som, em m/s'), ('va', 'velocidade da ambulância, em m/s')],
   achando=[('Achando fe: a frequência emitida', 'O enunciado dá: fe = 640 Hz.'),
            ('Achando V: a velocidade do som', 'O enunciado dá: V = 340 m/s.'),
            ('Achando va: a velocidade da ambulância', '1 km/h = 1 000 m em 3 600 s = 1 ÷ 3,6 m/s. Por isso divide-se por 3,6.\nva = 72 ÷ 3,6 = 20 m/s (3,6 · 20 = 72).')],
   volta='fo = 640 · 340 ÷ (340 − 20) = 640 · 340 ÷ 320.\n640 ÷ 320 = 2 e 2 · 340 = 680 Hz.\nLetra D.',
   valores=[('fe', '640 Hz'), ('V', '340 m/s'), ('va', '20 m/s')], rec3='fe = 640; V = 340; va = 20 m/s',
   motivos={0: 'Calculou como se a ambulância se afastasse: 640 · 340 ÷ 360 = 604,4'})
aj('ond-00c', origem="Comprimento de onda é o tamanho de uma ondinha completa. A onda anda v metros por segundo e repete f vezes por segundo, então v = (comprimento de onda) · f, ou f = v ÷ (comprimento de onda). Num tubo fechado numa ponta cabe só um quarto da ondinha, então a ondinha inteira tem 4 · L e f = v ÷ (4 · L). T é a temperatura: aqui, 35 °C.",
   pecas=[('Modo fundamental', 'A menor frequência com que o tubo enche de som, soando mais forte.')],
   eq_texto='Tubo fechado numa ponta cabe um quarto de ondinha: por isso o 4 na equação.\nAgora é só achar v e L.',
   achando=[('Achando v: a velocidade do som a 35 °C', '0,6 · 35 = 21 (6 · 35 = 210, dividido por 10).\nv = 331 + 21 = 352 m/s.'),
            ('Achando L: o comprimento', 'O enunciado dá: L = 0,88 m.\n4 · L = 4 · 0,88 = 3,52 m.')],
   volta='f = 352 ÷ 3,52. Multiplico os dois por 100: 35 200 ÷ 352 = 100 Hz (352 · 100 = 35 200).\nLetra E.',
   motivos={3: 'Deu 3 vezes o fundamental (3 · 100 = 300 Hz), que é outro modo do tubo'})
aj('ond-00d', origem="Fundamental é o jeito mais simples de a corda vibrar: uma barriga só, com a menor frequência f. Com 2 barrigas a frequência é 2f, com 3 é 3f. Comprimento de onda é o tamanho de uma ondinha completa; a barriga do fundamental é só metade dela, então a ondinha inteira tem 2 · L e v = 2 · L · f. Modos seguidos, como 3f e 4f ou 5f e 6f, diferem sempre de f. Atenção: o 300 da resposta é velocidade (m/s), outra coisa que os 300 Hz.",
   achando=[('Achando L: o comprimento', 'O enunciado dá: L = 1,5 m.'),
            ('Achando f: a frequência fundamental', 'As frequências possíveis são f, 2f, 3f, 4f (2f lê-se "2 vezes f"). Dois modos seguidos diferem de f: 4f − 3f = f.\nAqui 400 − 300 = 100, então f = 100 Hz. Conferindo: 3 · 100 = 300 e 4 · 100 = 400.')],
   motivos={2: 'Usou 300 como fundamental e esqueceu o 2: 1,5 · 300 = 450', 3: 'Usou 300 Hz como fundamental: 2 · 1,5 · 300 = 900'})
aj('opt-00a', origem="f = 20 cm (distância focal: onde a lente junta os raios que chegam paralelos). p = 30 cm (do slide até a lente). p' (lê-se 'p linha') = distância da lente até a imagem, o que falta achar. A equação da lente é uma regra pronta que diz onde a imagem se forma.",
   formulas=[('lente', 'Equação da lente', "1/f = 1/p + 1/p'"), ('lente', 'Aumento', "M = p' ÷ p")],
   eq='i = M · o', leitura='altura da imagem = aumento · altura do slide',
   letras=[('i', 'altura da imagem, em cm (o que a questão quer)'), ('M', 'aumento (quantas vezes a imagem é maior)'), ('o', 'altura do slide, em cm')],
   eq_texto='A imagem é o slide multiplicado pelo aumento M da lente.\nAgora é só achar o e M.',
   achando=[('Achando o: a altura do slide', 'O enunciado dá: o = 5 cm.'),
            ('Achando M: o aumento', "Quero 1/p': tiro 1/p dos dois lados, então 1/p' = 1/20 − 1/30. Para subtrair frações deixo o mesmo número embaixo: 1/20 = 3/60 (multiplico em cima e embaixo por 3) e 1/30 = 2/60 (por 2). 3/60 − 2/60 = 1/60. Se 1 ÷ p' = 1/60, então p' = 60 cm.\nM = p' ÷ p = 60 ÷ 30 = 2 (a imagem é 2 vezes maior que o slide).")],
   volta='i = 2 · 5 = 10 cm.\nLetra B.', valores=[('o', '5 cm'), ('M', '2')], rec3="o = 5 cm; p' = 60 cm; M = 2")
aj('opt-00b', origem="Índice de refração diz quantas vezes a luz é mais lenta no material do que no vácuo; o ar tem índice 1. Lente biconvexa é barriguda dos dois lados; raio de curvatura é o quanto cada barriga é curva. N = n da lente ÷ n do meio: no ar, N = 1,5 ÷ 1 = 1,5. O foco no ar (20 cm) não entra na conta: serve só para comparar no final.",
   eq_texto='As duas faces têm o mesmo raio R. O que muda do ar para a água é o índice relativo N.\nAgora é só achar N e R.',
   achando=[('Achando N: o índice relativo', 'Dividir por 4/3 é multiplicar pelo inverso, 3/4: 1,5 · 3/4 = 4,5 ÷ 4 = 1,125.\nN − 1 = 0,125.'),
            ('Achando R: o raio', 'O enunciado dá: R = 20 cm nas duas faces.\n1 ÷ 20 = 0,05 e 0,05 + 0,05 = 0,1.')],
   volta='1/F = 0,125 · 0,1 = 0,0125. Como 0,0125 · 80 = 1, F = 80 cm.\nLetra D. No ar, N − 1 = 0,5 dava 1/F = 0,05 e F = 20 cm: na água o foco ficou 4 vezes maior.')
aj('opt-00c', origem="c = velocidade da luz no vácuo (3 × 10⁸ m/s), n = índice do núcleo (1,6) e v = velocidade da luz no núcleo: v = c ÷ n. 10⁸ é 1 seguido de 8 zeros (100 000 000), então 3 × 10⁸ = 300 000 000. Núcleo é o miolo de vidro da fibra; a luz anda reta dentro dele, por isso as reflexões não entram na conta.",
   achando=[('Achando L: o comprimento em metros', '3 km = 3 000 m.'),
            ('Achando v: a velocidade no núcleo', 'v = 300 000 000 ÷ 1,6. Multiplico os dois por 10: 3 000 000 000 ÷ 16 = 187 500 000 m/s (16 · 187 500 000 = 3 000 000 000).')],
   volta='t = 3 000 ÷ 187 500 000. Divido os dois por 3 000: 1 ÷ 62 500. Como 62 500 · 16 = 1 000 000, t = 16 ÷ 1 000 000 = 0,000016 s.\n1 µs = 0,000001 s, então t = 16 µs.\nLetra D.',
   valores=[('L', '3 000 m'), ('v', '187 500 000 m/s')], rec3='L = 3 000 m; v = 187 500 000 m/s')
aj('opt-00d', origem="No espelho plano, a imagem aparece atrás do espelho, à mesma distância que o objeto está na frente. Simétrica quer dizer igual dos dois lados, como um reflexo.",
   formulas=[('carro', 'Distância andada', 'distância = velocidade · tempo'), ('retangulo', 'Espelho plano', 'imagem a x do espelho (mesmo x dele)')],
   eq='D = 2 · x', leitura='distância até a imagem = 2 · distância dele ao espelho',
   letras=[('D', 'distância entre o homem e a imagem, em m (o que a questão quer)'), ('x', 'distância do homem ao espelho depois de 4 s, em m')],
   eq_texto='Se ele está a 8 m do espelho, a imagem parece estar 8 m atrás do espelho, como outra pessoa do outro lado. Entre os dois: 8 + 8 = 16 m, ou seja, 2 · x.\nAgora é só achar x.',
   achando=[('Achando x: a distância ao espelho', 'Em 4 s ele andou 1,5 · 4 = 6 m.\nx = 8 − 6 = 2 m.')],
   volta='D = 2 · 2 = 4 m.\nLetra E. Conferindo: o homem se aproxima a 1,5 m/s e a imagem também: a distância entre eles diminui 3 m/s; em 4 s, 12 m; e 16 − 12 = 4.',
   valores=[('x', '2 m')], rec3='x = 2 m')
aj('ele-00a', origem="Joule (J) é unidade de energia e watt (W) é joule por segundo: 3 360 W são 3 360 J a cada segundo. Calor específico é quantos joules esquentam 1 kg em 1 °C: 4 200 J (J/(kg · °C) lê-se 'joules por quilo e por grau'). Com 2 kg, 8 400 J; para subir 3 °C com 1 kg, 12 600 J. Logo calor = massa · 4 200 · aumento: U = m · c · ΔT, e ΔT (delta T) é quanto a temperatura subiu. 'Constante' quer dizer que a cada segundo a água esquenta o mesmo tanto.",
   formulas=[('circuito', 'Potência útil', 'U = P · rendimento (P = 4 200 W)'), ('termometro', 'Calor por segundo', 'U = m · c · ΔT')],
   eq='ΔT = U ÷ (m · c)', leitura='aumento de temperatura = potência útil ÷ (massa por segundo · calor específico)',
   letras=[('ΔT', 'aumento de temperatura, em °C (o que a questão quer)'), ('U', 'potência que vira calor na água, em W'), ('m', 'massa de água por segundo, em kg/s'), ('c', 'calor específico da água')],
   eq_texto='Cada segundo, U joules aquecem m quilos de água. Dividindo U = m · c · ΔT por m · c, fica ΔT = U ÷ (m · c).\nAgora é só achar U, m e c.',
   achando=[('Achando U: a potência útil', '80% é 80 em cada 100: 80 ÷ 100 = 0,8.\nU = 4 200 · 0,8 = 33 600 ÷ 10 = 3 360 W (3 360 J por segundo).'),
            ('Achando m: a massa por segundo', '6 L por minuto = 6 kg por minuto. 1 minuto tem 60 segundos: 6 ÷ 60 = 0,1 kg a cada segundo.'),
            ('Achando c: o calor específico', 'O enunciado dá: c = 4 200 J/(kg · °C).')],
   volta='0,1 · 4 200 = 420.\nΔT = 3 360 ÷ 420 = 8 °C (420 · 8 = 3 360).\nLetra A.',
   valores=[('U', '3 360 W'), ('m', '0,1 kg/s'), ('c', '4 200')], pista='"aquecedor elétrico com rendimento e vazão" → potência útil, massa por segundo (litros por minuto ÷ 60) e ΔT = U ÷ (m · c).',
   motivos={4: 'Errou a vazão por um fator 10 (usou 0,01 kg/s): 3 360 ÷ (0,01 · 4 200) = 80'})
aj('ele-00b', origem="ε (épsilon) é a força eletromotriz: os 12 V que a bateria empurra. r é a resistência interna (2 Ω) e R, o resistor ligado a ela. A corrente passa pelo resistor e pela bateria um depois do outro (em série), então as resistências somam: I = ε ÷ (R + r) = 12 ÷ (R + 2). A potência no resistor é R · I · I (I² lê-se 'I vezes I'): com R = 2 e I = 3, 2 · 3 · 3 = 18 W.",
   eq_texto='A potência no resistor é R · I · I. Mas I também depende de R, então tenho de escolher o R que dá o maior P.\nAgora é só escolher R (pelo teste) e achar I.',
   achando=[('Achando R: o valor que dá o máximo', 'R = 1: 1 + 2 = 3; I = 12 ÷ 3 = 4 A; P = 1 · 4 · 4 = 16 W.\nR = 2: 2 + 2 = 4; I = 3 A; P = 2 · 3 · 3 = 18 W.\nR = 3: 3 + 2 = 5; I = 2,4 A; P = 3 · 2,4 · 2,4 = 17,28 W.\nR = 4: 4 + 2 = 6; I = 2 A; P = 4 · 2 · 2 = 16 W.\nO maior é R = 2, igual à resistência interna. Na prova, vá direto: R = r.'),
            ('Achando I: a corrente', 'Com R = 2 Ω e r = 2 Ω em série: I = 12 ÷ (2 + 2) = 3 A.')],
   motivos={3: 'Usou R = 0: I = 12 ÷ 2 = 6 A e 12 · 6 = 72 W, a potência da bateria toda; no resistor chega 0 W', 4: 'Fez 12² = 144 e esqueceu de dividir por 4 · r = 8'})
aj('ele-00c', origem="Em série: um depois do outro, mesma corrente, e as resistências somam. Em paralelo: caminhos lado a lado, mesma tensão, e a corrente se divide. Lei de Ohm: U = R · I, então I = U ÷ R. Com 12 V, o de 12 Ω deixa passar 1 A e o de 6 Ω deixa passar 2 A; juntos, 3 A com 12 V: 12 ÷ 3 = 4 Ω (menos que 6, porque dois caminhos juntos resistem menos). A conta rápida é Rp = (12 · 6) ÷ (12 + 6). Ideais: sem resistência própria.",
   formulas=[('circuito', 'Lei de Ohm', 'U = R · I'), ('circuito', 'Dois em paralelo', 'Rp = (R1 · R2) ÷ (R1 + R2)')],
   achando=[('Achando R: o resistor do paralelo', 'É o resistor de 6 Ω do enunciado: R = 6 Ω.'),
            ('Achando U: a tensão do paralelo', '1) Paralelo: Rp = 12 · 6 ÷ 18 = 72 ÷ 18 = 4 Ω.\n2) Em série soma: 8 + 4 = 12 Ω.\n3) Corrente total: 36 ÷ 12 = 3 A (passa pelo de 8 Ω e depois se divide).\n4) Tensão no paralelo: U = 3 · 4 = 12 V.')])
aj('ele-00d', dados=[('Resistores', '12 resistores de 12 Ω cada'), ('Montagem', 'arestas de um cubo'), ('Bateria', 'nos vértices opostos')],
   origem="Aresta é cada traço do cubo, vértice é cada ponta, e a diagonal vai de A até o vértice oposto B. Resistência equivalente é um resistor único que, com a mesma tensão, deixa passar a mesma corrente: E = U ÷ I, com I a corrente total que sai da bateria. A tensão de A até B é a soma das quedas ao longo de um caminho; a queda em cada aresta é R · (corrente nela).",
   achando=[('Achando R: a aresta', 'O enunciado dá: R = 12 Ω.'),
            ('Achando F: a fração', 'A corrente I sai de A por 3 arestas iguais: I ÷ 3 em cada. Cada uma chega a um vértice de onde saem 2 arestas iguais: (I ÷ 3) ÷ 2 = I ÷ 6 em cada (por simetria, os 3 vértices do meio são tratados igual). As últimas 3 arestas levam I ÷ 3 cada a B.\nTensão = (I/3) · R + (I/6) · R + (I/3) · R. Mesmo número embaixo: 1/3 = 2/6, então F = 2/6 + 1/6 + 2/6 = 5/6.',
             {'tipo': 'diagrama', 'nome': 'cubo-resistores', 'rotulos': ['A', 'B', 'saem de A: I ÷ 3 em cada', 'no meio: I ÷ 6 em cada', 'chegam em B: I ÷ 3 em cada', 'cada aresta é um resistor de 12 Ω']})],
   desenho=('Cada traço do cubo é um resistor de 12 Ω. A bateria liga os pontos A e B, as pontas de uma diagonal.', 'cubo-resistores', ['A', 'B', '', '', '', 'cada aresta é um resistor de 12 Ω']),
   volta='E = (5/6) · 12: 12 ÷ 6 = 2 e 2 · 5 = 10 Ω.\nLetra D.')


def aplicar(Q):
    """Aplica os ajustes às questões (dicts de acima_fisica_novas.Q), em ordem crescente das alternativas."""
    ids = {q['id'] for q in Q}
    faltam = set(AJUSTES) - ids
    assert not faltam, faltam
    for q in Q:
        a = dict(AJUSTES.get(q['id'], {}))
        motivos = a.pop('motivos', {})
        for antigo, novo in a.pop('troca_enunciado', []):
            assert antigo in q['enunciado'], (q['id'], antigo)
            q['enunciado'] = q['enunciado'].replace(antigo, novo)
        q.update(a)
        if motivos:
            q['alts'] = [(t, v, motivos.get(i, m)) for i, (t, v, m) in enumerate(q['alts'])]
