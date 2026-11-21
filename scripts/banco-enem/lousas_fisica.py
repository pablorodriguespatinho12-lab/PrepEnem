"""Aulas de lousa de nível acima de Física (Pablo, 21/11/2026): 1 por prova, ideias procuradas no banco.
Trem e ponte (Cinemática), dois blocos na polia (Dinâmica), aquecedor com perda (Termodinâmica), dois
alto-falantes (Ondas), espelho que gira (Óptica) e fio esticado (Eletricidade). Contas provadas por
força bruta. Regras da casa: número antes de letra, palavra nova primeiro no desenho, fala só com
conteúdo (nada de elogio), até ~300 letras de fala por tela."""
from lousa import aula_lousa, caixa, caminho, circ, hl, linha, lousa, prova, tx
from lousa_padrao import ensinou, outras_letras, papel_da_questao

# ======================================================================================
# 1. O trem e a ponte (Cinemática): D = 30 s
# ======================================================================================
ENUN_TREM_PONTE = ('Um trem de 200 m de comprimento atravessa uma ponte de 400 m, a 72 km/h constantes. Quanto tempo se passa entre o '
                   'instante em que a frente do trem entra na ponte e o instante em que a traseira sai dela?')
ALTS_TREM_PONTE = ['8,3 s', '10 s', '20 s', '30 s', '40 s']

LOUSA_TREM_PONTE = aula_lousa(
    lousa([(.3, 'Questão de nível acima: um trem comprido atravessa uma ponte.'), (3.4, 'O trem não é um ponto: o comprimento dele entra na conta.')],
          tx(200, 44, 'O trem e a ponte', 'tinta', 40, .2),
          linha(160, 150, 280, 150, 'tinta', .6, .6), caixa(80, 112, 60, 34, 'azul', 1.4), tx(110, 136, 'trem', 'azul', 22, 1.9),
          tx(220, 176, 'ponte', 'cinza', 24, 2.4), tx(200, 236, '72 km/h', 'cinza', 30, 3.2)),
    papel_da_questao([(.3, '72 km/h é a velocidade. O trem tem 200 m de comprimento e a ponte, 400 m.'), (4.6, 'O tempo conta da frente entrando na ponte até a traseira saindo.')],
                     ENUN_TREM_PONTE, ALTS_TREM_PONTE),
    lousa([(.3, 'O trem tem 200 m e a ponte 400 m. A velocidade é 72 km/h.'), (3.4, 'O tempo começa quando a frente entra na ponte.'), (6.0, 'E termina quando a traseira sai dela.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .2),
          tx(30, 82, 'trem: 200 m de comprimento', 'tinta', 28, .8, 'start'),
          tx(30, 120, 'ponte: 400 m', 'tinta', 28, 1.8, 'start'),
          tx(30, 158, 'velocidade: 72 km/h', 'tinta', 28, 2.8, 'start'),
          hl(26, 180, 330, 46, 6.0), tx(30, 214, 'quero: o tempo da travessia', 'vermelho', 28, 6.1, 'start')),
    lousa([(.3, 'Quando a frente entra na ponte, o trem está todo antes dela.'), (3.4, 'Quando a traseira sai, o trem está todo depois. A frente andou a ponte inteira mais o comprimento do trem.'), (8.2, '400 + 200 = 600 m.')],
          tx(200, 28, 'quanto a frente anda', 'tinta', 28, .2),
          linha(140, 140, 260, 140, 'tinta', .4, .5),
          caixa(80, 106, 60, 34, 'azul', .9), tx(110, 98, 'início', 'azul', 20, 1.2),
          caixa(260, 106, 60, 34, 'vermelho', 3.8), tx(290, 98, 'fim', 'vermelho', 20, 4.1),
          linha(140, 76, 320, 76, 'verde', 5.4, .8), tx(230, 66, '600 m', 'verde', 26, 6.2),
          tx(30, 196, 'ponte: 400 m', 'tinta', 26, 1.6, 'start'), tx(30, 226, 'trem: 200 m', 'tinta', 26, 2.4, 'start'),
          hl(26, 236, 330, 38, 8.2, 'verdeClaro'), tx(30, 264, '400 + 200 = 600 m', 'verde', 30, 8.3, 'start')),
    lousa([(.3, 'A distância está em metros: a velocidade tem que estar em m/s.'), (3.8, '72 km/h são 72 000 m em 1 hora. Uma hora tem 3 600 s: 72 000 ÷ 3 600 = 20 m/s.'), (9.0, 'Atalho: 1000 m em 3 600 s dá 1 m em 3,6 s. Então km/h ÷ 3,6 = m/s: 72 ÷ 3,6 = 20.')],
          tx(200, 32, 'km/h para m/s', 'tinta', 30, .2),
          tx(30, 82, '72 km/h = 72 000 m em 1 h', 'tinta', 27, .8, 'start'),
          tx(30, 122, '1 h = 3 600 s', 'tinta', 27, 3.8, 'start'),
          hl(26, 146, 330, 46, 5.4, 'verdeClaro'), tx(30, 180, '72 000 ÷ 3 600 = 20 m/s', 'verde', 30, 5.5, 'start'),
          tx(200, 232, 'atalho: km/h ÷ 3,6 = m/s', 'azul', 28, 9.0), tx(200, 266, 'o trem anda 20 m a cada segundo', 'cinza', 22, 10.4)),
    lousa([(.3, 'Se anda 20 metros a cada segundo, 600 metros levam 600 ÷ 20 = 30 segundos.'), (5.0, 'Tempo é distância ÷ velocidade. Resposta: letra D.')],
          tx(200, 32, 'o tempo', 'tinta', 30, .2),
          tx(30, 86, 'distância: 600 m', 'tinta', 30, .8, 'start'),
          tx(30, 130, 'velocidade: 20 m/s', 'tinta', 30, 1.8, 'start'),
          hl(26, 152, 330, 56, 3.6, 'verdeClaro'), tx(30, 196, '600 ÷ 20 = 30 s', 'verde', 40, 3.7, 'start'),
          tx(200, 252, 'resposta: D, 30 s', 'vermelho', 30, 5.0)),
    outras_letras([(.3, 'Cada letra errada é um tempo que existe na conta.'), (2.8, 'B e C esquecem uma das partes. E conta o trem duas vezes. A não converte a velocidade.'), (7.0, 'A certa é a D.')],
                  ['A · 8,3 s: 600 ÷ 72, sem converter', 'B · 10 s: só o trem (200 ÷ 20)', 'C · 20 s: só a ponte (400 ÷ 20)', 'E · 40 s: 800 ÷ 20, trem 2 vezes'], 'certa: D, 30 s'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'O trem tem comprimento: a frente anda a ponte mais o trem.'), (5.6, 'Depois, tempo é distância dividida pela velocidade.')],
            '1. a frente anda ponte + trem', '2. km/h ÷ 3,6 = m/s', '3. tempo = distância ÷ velocidade'),
    prova('Um trem de 100 m passa por um poste a 36 km/h. Quanto tempo leva para passar por inteiro?', ['10 s', '2,8 s', '20 s', '100 s'], 0,
          ['36 ÷ 3,6 = 10 m/s, e a frente só anda o comprimento do trem: 100 ÷ 10 = 10 s.',
           '2,8 s é 100 ÷ 36, sem converter km/h para m/s.',
           '20 s conta o trem duas vezes: o poste não tem comprimento.',
           '100 s é a distância escrita como tempo.']),
    prova('Mais difícil: um trem de 300 m atravessa um túnel de 900 m a 90 km/h. Quanto tempo, da frente entrar até a traseira sair?', ['48 s', '36 s', '13,3 s', '12 s'], 0,
          ['90 ÷ 3,6 = 25 m/s (3,6 × 25 = 90). A frente anda 900 + 300 = 1200 m: 1200 ÷ 25 = 48 s.',
           '36 s conta só o túnel (900 ÷ 25).',
           '13,3 s é 1200 ÷ 90, sem converter km/h para m/s.',
           '12 s conta só o trem (300 ÷ 25).']),
)

# ======================================================================================
# 2. Dois blocos na polia (Dinâmica e Leis de Newton): B = 5 m/s²
# ======================================================================================
ENUN_POLIA = ('Dois blocos, de 3 kg e de 1 kg, estão presos às pontas de um fio leve que passa por uma polia sem atrito, pendurados um de cada lado. '
              'Os blocos são soltos do repouso. Qual é a aceleração dos blocos? (Use g = 10 m/s².)')
ALTS_POLIA = ['2,5 m/s²', '5 m/s²', '7,5 m/s²', '10 m/s²', '20 m/s²']

LOUSA_POLIA = aula_lousa(
    lousa([(.3, 'Questão de nível acima: dois blocos pendurados numa polia.'), (3.2, 'O mais pesado desce e puxa o mais leve para cima.')],
          tx(200, 36, 'Dois blocos e uma polia', 'tinta', 34, .2),
          circ(200, 86, 26, 'tinta', .8), linha(174, 86, 174, 140, 'tinta', 1.6, .4), linha(226, 86, 226, 140, 'tinta', 1.8, .4),
          caixa(140, 140, 56, 52, 'azul', 2.2), tx(168, 176, '3 kg', 'azul', 24, 2.8),
          caixa(204, 140, 56, 52, 'vermelho', 3.0), tx(232, 176, '1 kg', 'vermelho', 24, 3.6),
          tx(200, 236, 'soltos do repouso', 'cinza', 28, 4.4)),
    papel_da_questao([(.3, 'Polia é a roda por onde passa o fio. Sem atrito, ela gira livre.'), (3.4, 'Fio leve: quase sem massa, então ele faz a mesma força dos dois lados.'), (7.0, 'g é a gravidade: 10 m/s² quer dizer que a velocidade de queda cresce 10 m/s a cada segundo.')],
                     ENUN_POLIA, ALTS_POLIA),
    lousa([(.3, 'Dois blocos, 3 kg e 1 kg, ligados por um fio que passa na polia.'), (3.4, 'Soltos do repouso, o de 3 kg desce e o de 1 kg sobe.'), (6.4, 'Como o fio não estica, os dois têm a mesma aceleração. Quero ela.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .2),
          tx(30, 82, 'bloco A: 3 kg', 'tinta', 28, .8, 'start'),
          tx(30, 120, 'bloco B: 1 kg', 'tinta', 28, 1.8, 'start'),
          tx(30, 158, 'soltos do repouso, g = 10', 'tinta', 28, 3.4, 'start'),
          hl(26, 180, 330, 46, 6.4), tx(30, 214, 'quero: a aceleração', 'vermelho', 30, 6.5, 'start')),
    lousa([(.3, 'Cada bloco é puxado para baixo pelo próprio peso. Peso é massa × 10.'), (3.6, 'O de 3 kg pesa 3 × 10 = 30 N. O de 1 kg pesa 1 × 10 = 10 N.'), (7.4, 'N é newton, a unidade de força.')],
          tx(200, 32, 'o peso de cada bloco', 'tinta', 30, .2),
          tx(30, 84, 'peso = massa × 10', 'tinta', 28, .8, 'start'),
          tx(30, 126, 'A: 3 × 10 = 30 N', 'azul', 30, 3.6, 'start'),
          tx(30, 168, 'B: 1 × 10 = 10 N', 'vermelho', 30, 5.0, 'start'),
          hl(26, 190, 330, 46, 7.4, 'amarelo'), tx(30, 224, 'o lado de 30 puxa mais que o de 10', 'tinta', 24, 7.5, 'start')),
    lousa([(.3, 'Os dois andam juntos: um bloco só de 4 kg. O fio freia o que desce e ajuda o que sobe, com a mesma força T: se anulam.'), (5.4, 'A força que sobra é a diferença dos pesos: 30 − 10 = 20 N.'), (9.4, 'Aceleração = força ÷ massa: 20 N ÷ 4 kg = 5 m/s².')],
          tx(200, 32, 'a aceleração', 'tinta', 30, .2),
          tx(30, 86, 'massa total: 3 + 1 = 4 kg', 'tinta', 28, .8, 'start'),
          tx(30, 130, 'força que sobra: 30 − 10 = 20 N', 'tinta', 26, 5.4, 'start'),
          hl(26, 156, 330, 56, 9.4, 'verdeClaro'), tx(30, 198, 'a = 20 ÷ 4 = 5 m/s²', 'verde', 38, 9.5, 'start'),
          tx(200, 254, 'resposta: B', 'vermelho', 30, 11.0)),
    lousa([(.3, 'Conferindo um bloco de cada vez. T é a força do fio. A força que sobra em cada bloco é massa × aceleração.'), (5.0, 'Leve, sobe com 5: T − 10 = 1 × 5, então T = 15 N.'), (9.0, 'Pesado, desce com 5: 30 − T = 3 × 5 = 15, então T = 15 N. Os dois dão o mesmo T.')],
          tx(200, 32, 'conferindo', 'tinta', 30, .2),
          tx(30, 84, 'leve: T − 10 = 1 × 5  →  T = 15', 'tinta', 26, .8, 'start'),
          tx(30, 128, 'pesado: 30 − T = 3 × 5  →  T = 15', 'tinta', 26, 6.4, 'start'),
          hl(26, 156, 330, 46, 9.0, 'verdeClaro'), tx(30, 190, 'mesmo T nos dois: confere', 'verde', 30, 9.1, 'start')),
    outras_letras([(.3, 'Cada letra errada é uma conta que para no meio.'), (2.8, 'A e C usam o peso de um bloco só. D ignora o outro bloco. E é a força, em newtons.'), (7.0, 'A certa é a B.')],
                  ['A · 2,5: 10 ÷ 4, só o peso do leve', 'C · 7,5: 30 ÷ 4, só o peso do pesado', 'D · 10: só o g, sem o outro bloco', 'E · 20: a força, não a aceleração'], 'certa: B, 5 m/s²'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'A força que sobra é a diferença dos pesos.'), (5.0, 'E a aceleração é essa força dividida pela massa de todos.')],
            '1. peso = massa × g', '2. sobra: diferença dos pesos', '3. a = sobra ÷ massa total'),
    prova('Dois blocos, de 6 kg e de 4 kg, estão ligados por um fio numa polia (g = 10 m/s²). Qual a aceleração?', ['2 m/s²', '4 m/s²', '10 m/s²', '20 m/s²'], 0,
          ['Os pesos são 60 N e 40 N: sobram 20 N para 10 kg, e 20 ÷ 10 = 2 m/s².',
           '4 m/s² é 40 ÷ 10: só o peso do bloco leve.',
           '10 m/s² é só o g: o outro bloco segura.',
           '20 m/s² é a força que sobra, 20 N, no lugar da aceleração.']),
    prova('Mais difícil: dois blocos iguais, de 5 kg cada, ligados por um fio numa polia (g = 10 m/s²). Qual a aceleração?', ['0 (ficam parados)', '5 m/s²', '10 m/s²', '2,5 m/s²'], 0,
          ['Os pesos são iguais: 50 − 50 = 0 N sobra, então a = 0 ÷ 10 = 0.',
           '5 m/s² vem de 50 ÷ 10, sem tirar o peso do outro bloco (50 − 50).',
           '10 m/s² é só o g: o outro bloco segura.',
           '2,5 m/s² não tem base: a força que sobra é 0.']),
)

# ======================================================================================
# 3. O aquecedor com perda (Termodinâmica e Calor): D = 8,75 min
# ======================================================================================
ENUN_AQUEC = ('Um aquecedor elétrico de 1000 W aquece 2 kg de água de 20 °C até 70 °C. Só 80% da energia do aquecedor vai para a água. '
              'O calor específico da água é 4200 J/(kg·°C). Quanto tempo leva esse aquecimento?')
ALTS_AQUEC = ['4,4 min', '5,6 min', '7 min', '8,75 min', '12,25 min']

LOUSA_AQUEC = aula_lousa(
    lousa([(.3, 'Questão de nível acima: um aquecedor esquenta 2 kg de água.'), (3.2, 'Parte da energia se perde. Quanto tempo leva?')],
          tx(200, 40, 'O aquecedor e a água', 'tinta', 38, .2),
          caminho('M120 120l16 -24l16 48l16 -48l16 48l16 -48l16 24', 'vermelho', .8, 1.4, 4),
          caixa(100, 150, 200, 76, 'azul', 2.4, 1.0), tx(200, 196, '2 kg de água', 'azul', 28, 3.4),
          tx(200, 262, '1000 W, 80% aproveitado', 'cinza', 26, 4.2)),
    papel_da_questao([(.3, 'Potência é energia por segundo. W é watt: 1000 W são 1000 joules (J) a cada segundo.'), (5.0, 'Calor específico, escrito c, é a energia para esquentar 1 kg em 1 °C (um grau Celsius): para a água, 4200 J.')],
                     ENUN_AQUEC, ALTS_AQUEC),
    lousa([(.3, 'Aquecedor de 1000 W. Só 80% da energia vai para a água.'), (3.4, 'A água, 2 kg, vai de 20 °C a 70 °C.'), (6.0, 'Quero o tempo que isso leva.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .8),
          tx(30, 82, '1000 W, só 80% vai para a água', 'tinta', 26, .8, 'start'),
          tx(30, 120, '2 kg de água: de 20 °C a 70 °C', 'tinta', 26, 3.4, 'start'),
          tx(30, 158, 'calor específico: 4200', 'tinta', 28, 4.6, 'start'),
          hl(26, 180, 330, 46, 6.0), tx(30, 214, 'quero: o tempo', 'vermelho', 30, 6.1, 'start')),
    lousa([(.3, 'Primeiro, quanta energia a água precisa. Para esquentar 1 kg em 1 °C são 4200 J.'), (4.4, 'São 2 kg e a temperatura sobe 70 − 20 = 50 °C. Então 2 × 4200 × 50.'), (9.0, '2 × 4200 × 50 = 420 000 J.')],
          tx(200, 32, 'a energia que a água precisa', 'tinta', 28, .2),
          tx(30, 86, 'sobe: 70 − 20 = 50 °C', 'tinta', 28, .8, 'start'),
          tx(30, 130, 'energia: 2 × 4200 × 50', 'tinta', 28, 4.4, 'start'),
          hl(26, 156, 330, 56, 9.0, 'verdeClaro'), tx(30, 198, '= 420 000 J', 'verde', 40, 9.1, 'start')),
    lousa([(.3, 'Só 80% de 1000 W chega à água. 80% é 80 em cada 100: em 1000, são 800 W, ou 800 joules por segundo.'), (3.8, 'Essa é a potência útil, o ritmo em que a água recebe energia.')],
          tx(200, 32, 'a potência útil', 'tinta', 30, .2),
          tx(30, 90, '80% de 1000 W', 'tinta', 30, .8, 'start'),
          hl(26, 112, 330, 56, 2.2, 'verdeClaro'), tx(30, 156, '= 800 W', 'verde', 40, 2.3, 'start'),
          tx(200, 220, 'a água recebe 800 J por segundo', 'azul', 28, 3.8)),
    lousa([(.3, 'Tempo = energia ÷ potência: 420 000 ÷ 800 = 525 segundos.'), (4.6, 'Em minutos: 525 ÷ 60 = 8,75. Resposta: letra D.')],
          tx(200, 32, 'o tempo', 'tinta', 30, .2),
          tx(30, 86, 'energia: 420 000 J', 'tinta', 28, .8, 'start'),
          tx(30, 126, 'potência útil: 800 W', 'tinta', 28, 1.8, 'start'),
          tx(30, 170, '420 000 ÷ 800 = 525 s', 'tinta', 30, 2.8, 'start'),
          hl(26, 190, 330, 50, 4.6, 'verdeClaro'), tx(30, 226, '525 ÷ 60 = 8,75 min', 'verde', 34, 4.7, 'start')),
    outras_letras([(.3, 'Cada letra errada pula um dado do problema.'), (2.8, 'A usa 1 kg em vez de 2. B multiplica por 0,8 em vez de dividir. C ignora a perda. E usa a temperatura final.'), (7.0, 'A certa é a D.')],
                  ['A · 4,4: usou 1 kg, não 2 kg', 'B · 5,6: multiplicou por 0,8', 'C · 7: ignorou os 80% (÷ 1000)', 'E · 12,25: usou 70 °C, não 50'], 'certa: D, 8,75 min'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Achar a energia que a água precisa e a potência que realmente chega a ela.'), (6.0, 'O tempo é uma divisão.')],
            '1. energia: massa × 4200 × subida', '2. só 80% chega à água', '3. tempo = energia ÷ potência útil'),
    prova('Um aquecedor de 500 W, sem perdas, aquece 1 kg de água de 20 °C a 30 °C (c = 4200). Quanto tempo leva?', ['84 s', '840 s', '42 s', '8,4 s'], 0,
          ['4200 × 10 = 42 000 J, e 42 000 ÷ 500 = 84 s.',
           '840 s vem de 4200 × 100 ÷ 500: uma casa a mais na subida de temperatura.',
           '42 s vem de dividir 42 000 por 1000, e a potência é 500 W.',
           '8,4 s vem de dividir por 5000: uma casa a mais.']),
    prova('Mais difícil: o mesmo aquecedor de 500 W, mas só 50% da energia vai para a água. Quanto tempo para aquecer 1 kg de 20 °C a 30 °C?', ['168 s', '84 s', '42 s', '336 s'], 0,
          ['A potência útil é 50% de 500 = 250 W: 42 000 ÷ 250 = 168 s.',
           '84 s ignora a perda de 50%.',
           '42 s vem de dividir 42 000 por 1000.',
           '336 s aplica os 50% duas vezes: 50% de 250 é 125, e 42 000 ÷ 125 = 336.']),
)

# ======================================================================================
# 4. Dois alto-falantes (Ondas e Acústica): B = 0,5 m
# ======================================================================================
ENUN_ONDA = ('Dois alto-falantes iguais emitem a mesma nota de 340 Hz, em fase (as ondas saem sempre iguais, no mesmo instante). A velocidade '
             'do som é 340 m/s. Qual é a menor diferença entre as distâncias de um ouvinte aos dois alto-falantes para que ele ouça silêncio?')
ALTS_ONDA = ['0,25 m', '0,5 m', '1 m', '2 m', '340 m']

LOUSA_ONDA = aula_lousa(
    lousa([(.3, 'Questão de nível acima: duas fontes de som, uma nota só.'), (3.4, 'Em alguns lugares o som soma; em outros, some.')],
          tx(200, 40, 'Dois alto-falantes', 'tinta', 38, .2),
          caixa(50, 90, 40, 50, 'azul', .8), caixa(50, 170, 40, 50, 'vermelho', 1.4), circ(330, 150, 10, 'verde', 2.0),
          linha(90, 115, 320, 148, 'azul', 2.4, .8), linha(90, 195, 320, 152, 'vermelho', 3.2, .8),
          tx(330, 186, 'ouvinte', 'verde', 22, 3.8), tx(200, 262, 'mesma nota nos dois', 'cinza', 26, 4.2)),
    papel_da_questao([(.3, 'Hz é hertz: 340 Hz são 340 ondas por segundo. Isso é a frequência.'), (3.8, 'Em fase: os dois alto-falantes mandam o pico da onda no mesmo instante.'), (7.6, 'Diferença de distância: quanto um caminho é mais longo que o outro até o ouvinte.')],
                     ENUN_ONDA, ALTS_ONDA),
    lousa([(.3, 'Dois alto-falantes iguais, 340 Hz, em fase.'), (3.0, 'O som anda a 340 m/s.'), (5.0, 'Quero a menor diferença de distância que dá silêncio.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .2),
          tx(30, 82, 'dois alto-falantes, 340 Hz, em fase', 'tinta', 25, .8, 'start'),
          tx(30, 120, 'velocidade do som: 340 m/s', 'tinta', 28, 3.0, 'start'),
          hl(26, 146, 330, 78, 5.0), tx(30, 180, 'quero: a menor diferença', 'vermelho', 28, 5.1, 'start'), tx(30, 212, 'de distância que dá silêncio', 'vermelho', 28, 5.6, 'start')),
    lousa([(.3, 'Comprimento de onda, λ, é a distância entre dois picos seguidos. Pico é o ponto mais alto; vale, o mais baixo.'), (5.0, 'Em 1 s passam 340 ondas de λ metros cada: 340 × λ metros. Isso é a velocidade, 340 m/s.'), (10.0, 'Então λ = velocidade ÷ frequência = 340 ÷ 340 = 1 m.')],
          tx(200, 28, 'o comprimento de onda', 'tinta', 28, .2),
          caminho('M40 110Q80 60 120 110T200 110T280 110T360 110', 'azul', .6, 1.4, 4),
          linha(40, 160, 200, 160, 'vermelho', 2.4, .6), tx(120, 188, 'λ = 1 m', 'vermelho', 26, 3.2),
          tx(30, 232, 'λ = v ÷ f = 340 ÷ 340', 'tinta', 26, 10.0, 'start'), tx(200, 268, 'λ = 1 m', 'verde', 32, 10.8)),
    lousa([(.3, 'Dois picos juntos: o som soma e fica mais forte (interferência construtiva).'), (3.6, 'Um pico junto com um vale: um cancela o outro (interferência destrutiva), silêncio.'), (7.6, 'Se um caminho é meio λ mais longo, a onda chega atrasada meio λ: no lugar do pico, vem um vale.')],
          tx(200, 28, 'pico com vale = silêncio', 'tinta', 28, .2),
          caminho('M40 80Q80 40 120 80T200 80T280 80T360 80', 'azul', .6, 1.2, 4),
          caminho('M40 150Q80 190 120 150T200 150T280 150T360 150', 'vermelho', 3.6, 1.2, 4),
          linha(40, 222, 360, 222, 'verde', 7.6, .6), tx(200, 262, 'soma: 0, silêncio', 'verde', 30, 8.0)),
    lousa([(.3, 'Para silêncio, a diferença de distância tem que ser meio comprimento de onda.'), (4.4, 'Como λ = 1 m, a menor diferença é 1 ÷ 2 = 0,5 m.'), (8.2, 'Diferenças de 1,5 λ, 2,5 λ... também dão silêncio, mas a menor é meio λ. Resposta: letra B.')],
          tx(200, 32, 'a menor diferença', 'tinta', 30, .2),
          tx(30, 86, 'λ = 1 m', 'tinta', 30, .8, 'start'),
          tx(30, 130, 'silêncio: meio λ', 'tinta', 30, 2.0, 'start'),
          hl(26, 152, 330, 56, 4.4, 'verdeClaro'), tx(30, 196, '1 ÷ 2 = 0,5 m', 'verde', 40, 4.5, 'start'),
          tx(200, 252, 'resposta: B', 'vermelho', 30, 8.2)),
    outras_letras([(.3, 'Cada letra errada é uma fração de λ, ou outro número do problema.'), (2.8, 'C e D são 1 λ e 2 λ inteiros: pico com pico, som forte. E é a velocidade.'), (6.8, 'A certa é a B.')],
                  ['A · 0,25 m: um quarto de λ', 'C · 1 m: um λ inteiro, som forte', 'D · 2 m: dois λ, som forte', 'E · 340 m: é a velocidade, não λ'], 'certa: B, 0,5 m'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Achar o comprimento de onda e compará-lo com a diferença de distância.'), (5.6, 'Silêncio é meio comprimento de onda.')],
            '1. λ = velocidade ÷ frequência', '2. silêncio: pico com vale', '3. menor diferença: λ ÷ 2'),
    prova('Dois alto-falantes em fase emitem 170 Hz (v = 340 m/s). Qual a menor diferença de distância para silêncio?', ['1 m', '2 m', '0,5 m', '4 m'], 0,
          ['λ = 340 ÷ 170 = 2 m, e silêncio é meio λ: 1 m.',
           '2 m é um λ inteiro: pico com pico, som forte.',
           '0,5 m seria para 340 Hz, não para 170 Hz.',
           '4 m é dois λ: som forte.']),
    prova('Mais difícil: com os alto-falantes de 340 Hz, um ouvinte está a 4 m de um e a 4,5 m do outro. O que ele ouve?', ['Silêncio', 'Som mais forte', 'Som de frequência dobrada', 'Som só um pouco mais fraco'], 0,
          ['λ = 1 m e a diferença é 4,5 − 4 = 0,5 m, meio λ: pico com vale, silêncio.',
           'Som mais forte pede diferença 0, 1 m, 2 m...: 0, 1 λ, 2 λ...',
           'A frequência não muda: continua 340 Hz.',
           'Com meio λ de diferença as ondas se cancelam por inteiro, não só enfraquecem.']),
)

# ======================================================================================
# 5. O espelho que gira (Óptica): C = 40°
# ======================================================================================
ENUN_ESPELHO = ('Um raio de luz incide em um espelho plano. Sem mudar o raio incidente, o espelho gira 20°. Em quantos graus gira o raio refletido?')
ALTS_ESPELHO = ['10°', '20°', '40°', '60°', '80°']

LOUSA_ESPELHO = aula_lousa(
    lousa([(.3, 'Questão de nível acima: um espelho gira e o raio que chega fica parado.'), (3.4, 'O raio que sai também vai girar. Quanto?')],
          tx(200, 40, 'O espelho que gira', 'tinta', 38, .2),
          linha(100, 210, 300, 210, 'tinta', .6, .6), linha(130, 120, 200, 210, 'azul', 1.4, .6), linha(200, 210, 270, 120, 'vermelho', 2.2, .6),
          tx(200, 256, 'o raio que chega fica parado', 'cinza', 26, 3.4)),
    papel_da_questao([(.3, 'Raio incidente é o que chega ao espelho. Raio refletido é o que sai dele.'), (4.2, 'O raio que chega fica parado; só o espelho gira. Ângulo se mede em graus, escritos °.')],
                     ENUN_ESPELHO, ALTS_ESPELHO),
    lousa([(.3, 'Espelho plano. O raio que chega não muda.'), (2.8, 'O espelho gira 20°.'), (4.6, 'Quero saber quanto gira o raio que sai.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .2),
          tx(30, 84, 'espelho plano', 'tinta', 28, .8, 'start'),
          tx(30, 124, 'o espelho gira 20°', 'tinta', 28, 2.8, 'start'),
          tx(30, 164, 'raio que chega: parado', 'tinta', 28, 3.6, 'start'),
          hl(26, 186, 330, 46, 4.6), tx(30, 220, 'quero: giro do refletido', 'vermelho', 28, 4.7, 'start')),
    lousa([(.3, 'Normal é a linha perpendicular ao espelho (forma 90° com ele), no ponto onde o raio bate.'), (3.6, 'Lei da reflexão: ângulo de chegada = ângulo de saída, medidos a partir da normal.'), (8.4, 'Exemplo: chega a 30°, sai a 30° do outro lado: entre os raios há 2 × 30 = 60°.')],
          linha(90, 200, 310, 200, 'tinta', .4, .6), linha(200, 200, 200, 92, 'cinza', 1.2, .5), tx(214, 108, 'normal', 'cinza', 20, 1.7, 'start'),
          linha(142, 100, 200, 200, 'azul', 3.8, .5), linha(200, 200, 258, 100, 'vermelho', 4.4, .5),
          tx(166, 160, '30°', 'azul', 20, 5.2), tx(236, 160, '30°', 'vermelho', 20, 5.6),
          tx(200, 238, 'ângulo de chegada = ângulo de saída', 'cinza', 22, 3.6), tx(200, 268, 'entre os raios: 2 × 30 = 60°', 'verde', 26, 8.4)),
    lousa([(.3, 'Gira o espelho 20°: a normal gira 20° junto.'), (3.4, 'O raio que chega fica parado: o ângulo com a normal vai de 30° a 30 + 20 = 50°.'), (8.0, 'O raio sai a 50° do outro lado: agora 2 × 50 = 100° entre os raios. Antes, 60°.'), (12.6, 'O refletido girou 100 − 60 = 40°.')],
          tx(200, 30, 'depois de girar 20°', 'tinta', 28, .2),
          tx(30, 76, 'a normal gira 20° junto', 'tinta', 26, .8, 'start'),
          tx(30, 112, 'com a normal: 30° → 50°', 'tinta', 26, 3.4, 'start'),
          tx(30, 148, 'agora 2 × 50 = 100° (antes 60°)', 'tinta', 26, 8.0, 'start'),
          hl(26, 168, 330, 52, 12.6, 'verdeClaro'), tx(30, 206, 'girou: 100 − 60 = 40°', 'verde', 36, 12.7, 'start')),
    lousa([(.3, 'Chegada e saída têm o mesmo ângulo com a normal: entre os raios há o dobro dele.'), (4.4, 'O refletido gira o dobro do espelho: 2 × 20° = 40°. O espelho gira metade do refletido.'), (9.0, 'Para o outro lado, o ângulo vai de 30° a 10°: também muda 40°. Resposta: C.')],
          tx(200, 30, 'a regra', 'tinta', 30, .2),
          tx(30, 86, 'entre raios: 2 × ângulo com a normal', 'tinta', 24, .8, 'start'),
          tx(30, 132, 'refletido gira: 2 × espelho', 'tinta', 28, 4.4, 'start'),
          hl(26, 156, 330, 56, 5.6, 'verdeClaro'), tx(30, 200, '2 × 20° = 40°', 'verde', 40, 5.7, 'start'),
          tx(200, 252, 'resposta: C', 'vermelho', 30, 7.0)),
    outras_letras([(.3, 'Cada letra errada usa o giro do espelho do jeito errado.'), (2.8, 'A divide por 2. B copia. D triplica. E dobra duas vezes. O certo é dobrar uma vez só.'), (7.0, 'A certa é a C.')],
                  ['A · 10°: metade do giro do espelho', 'B · 20°: o mesmo giro do espelho', 'D · 60°: triplicou o giro', 'E · 80°: dobrou duas vezes'], 'certa: C, 40°'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'O raio refletido gira o dobro do espelho.'), (5.0, 'O exemplo 30° → 50° mostra a conta: 60° viram 100°, mudança de 40°.')],
            '1. normal: perpendicular ao espelho', '2. espelho 20°: refletido 40°', '3. teste: 30° → 50°'),
    prova('O espelho gira 15° com o raio incidente parado. Quantos graus gira o raio refletido?', ['30°', '15°', '7,5°', '60°'], 0,
          ['O refletido gira o dobro do espelho: 2 × 15° = 30°.',
           '15° é o giro do espelho, não do raio refletido.',
           '7,5° é a metade do giro do espelho.',
           '60° dobra duas vezes: 4 × 15°.']),
    prova('Mais difícil: com o raio incidente parado, o raio refletido gira 50°. Quantos graus gira o espelho?', ['25°', '50°', '100°', '12,5°'], 0,
          ['O espelho gira a metade do refletido: 50 ÷ 2 = 25°.',
           '50° seria o espelho girando igual ao refletido.',
           '100° dobra em vez de dividir por 2.',
           '12,5° divide duas vezes.']),
)

# ======================================================================================
# 6. O fio esticado (Eletricidade e Circuitos): D = 4R
# ======================================================================================
ENUN_FIO = ('Um fio de cobre tem resistência R. Esse fio é esticado, sem perder nem ganhar material, até ficar com o dobro do comprimento. '
            'A resistência passa a ser:')
ALTS_FIO = ['R/2', 'R', '2R', '4R', '8R']

LOUSA_FIO = aula_lousa(
    lousa([(.3, 'Questão de nível acima: um fio de cobre é esticado.'), (3.2, 'Fica mais comprido e, como o cobre é o mesmo, mais fino.')],
          tx(200, 40, 'O fio esticado', 'tinta', 40, .2),
          caminho('M60 100L200 100', 'tinta', .8, .8, 10), tx(130, 140, 'antes', 'cinza', 22, 1.6),
          caminho('M60 190L340 190', 'azul', 2.0, 1.2, 4), tx(200, 226, 'depois: mais comprido e mais fino', 'cinza', 24, 3.4)),
    papel_da_questao([(.3, 'Resistência é a dificuldade que o fio faz para a corrente passar.'), (3.6, 'Grossura é o tamanho do corte do fio: a área do círculo que aparece se o fio for cortado.'), (7.6, 'Fio mais comprido atrapalha mais. Fio mais grosso atrapalha menos.')],
                     ENUN_FIO, ALTS_FIO),
    lousa([(.3, 'Um fio de cobre, com resistência R.'), (2.6, 'Ele é esticado até o dobro do comprimento, sem perder material.'), (5.4, 'Quero a resistência nova.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .2),
          tx(30, 84, 'fio de cobre: resistência R', 'tinta', 28, .8, 'start'),
          tx(30, 124, 'esticado até o dobro', 'tinta', 28, 2.6, 'start'),
          tx(30, 164, 'sem perder material', 'tinta', 28, 3.6, 'start'),
          hl(26, 186, 330, 46, 5.4), tx(30, 220, 'quero: a resistência nova', 'vermelho', 28, 5.5, 'start')),
    lousa([(.3, 'Para ver quanto, use números. Fio de comprimento 1 e grossura 1: resistência = comprimento ÷ grossura = 1.'), (5.2, 'Mais comprido: a resistência sobe. Mais grosso: desce. Por isso é uma divisão.')],
          tx(200, 32, 'com números', 'tinta', 30, .2),
          tx(30, 86, 'comprimento 1, grossura 1', 'tinta', 28, .8, 'start'),
          hl(26, 108, 330, 52, 3.0, 'verdeClaro'), tx(30, 146, 'R = 1 ÷ 1 = 1', 'verde', 36, 3.1, 'start'),
          tx(30, 196, 'mais comprido: R sobe', 'tinta', 26, 5.2, 'start'), tx(30, 232, 'mais grosso: R desce', 'tinta', 26, 6.4, 'start')),
    lousa([(.3, 'Esticar para o dobro: o comprimento vai de 1 para 2.'), (3.6, 'O cobre é o mesmo: comprimento × grossura continua 1. Com comprimento 2, a grossura cai para 1/2.'), (8.6, '1/2 é metade: o fio fica com metade da grossura.')],
          tx(200, 32, 'esticando o fio', 'tinta', 30, .2),
          tx(30, 86, 'antes: 1 × 1 = 1 de cobre', 'tinta', 28, .8, 'start'),
          tx(30, 130, 'depois: 2 × ? = 1', 'tinta', 28, 3.6, 'start'),
          hl(26, 154, 330, 50, 6.4, 'verdeClaro'), tx(30, 190, '? = 1/2  (metade da grossura)', 'verde', 28, 6.5, 'start'),
          circ(352, 96, 20, 'azul', 1.2), tx(352, 136, 'área 1', 'azul', 18, 1.6),
          circ(352, 212, 14, 'vermelho', 8.6), tx(352, 244, 'área 1/2', 'vermelho', 18, 9.0)),
    lousa([(.3, 'Resistência nova = comprimento ÷ grossura = 2 ÷ 1/2.'), (3.8, 'Quantas metades cabem em 2? Quatro. Então 2 ÷ 1/2 = 4.'), (8.0, 'A resistência ficou 4 vezes maior: 4R. Resposta: letra D.')],
          tx(200, 32, 'a resistência nova', 'tinta', 30, .2),
          tx(30, 86, 'R nova = 2 ÷ 1/2', 'tinta', 32, .8, 'start'),
          tx(30, 130, 'em 2 cabem 4 metades', 'tinta', 28, 3.8, 'start'),
          hl(26, 154, 330, 56, 8.0, 'verdeClaro'), tx(30, 198, '= 4  →  4R', 'verde', 40, 8.1, 'start'),
          tx(200, 252, 'resposta: D', 'vermelho', 30, 9.2)),
    outras_letras([(.3, 'Cada letra errada olha só uma das duas mudanças.'), (2.8, 'A certa conta as duas mudanças: o comprimento dobra e a grossura cai à metade. A letra C conta só a primeira.'), (7.0, 'A certa é a D.')],
                  ['A · R/2: 1 ÷ 2 em vez de 2 ÷ 1/2', 'B · R: cobre igual, R igual', 'C · 2R: só o comprimento dobrou', 'E · 8R: dobrou três vezes'], 'certa: D, 4R'),
    lousa([(.3, 'Esticar 2 vezes: a resistência fica 4 vezes maior (2 × 2).'), (3.6, 'Esticar 3 vezes: comprimento 3 e grossura 1/3 (um terço). Em 3 inteiros cabem 9 terços: R fica 9 vezes maior.'), (9.0, 'É o fator vezes ele mesmo: o comprimento cresce e a grossura diminui no mesmo fator.')],
          tx(200, 36, 'o que a questão ensinou', 'tinta', 30, .2),
          tx(30, 100, '1. R = comprimento ÷ grossura', 'tinta', 26, .8, 'start'),
          tx(30, 150, '2. esticar 2 vezes: R fica 4 vezes', 'tinta', 25, 2.8, 'start'), hl(26, 166, 300, 6, 3.8),
          tx(30, 206, '3. esticar 3 vezes: R fica 9 vezes', 'tinta', 25, 5.0, 'start')),
    prova('Um fio de resistência R é esticado até ter o triplo do comprimento, sem perder material. Qual a nova resistência?', ['3R', '6R', '9R', '27R'], 2,
          ['3R seria só o comprimento triplicando. A grossura também cai.',
           '6R não tem base: 3 + 3 não aparece na conta.',
           'Comprimento 3 e grossura 1/3 (um terço): 3 ÷ 1/3 = 9, porque em 3 inteiros cabem 9 terços.',
           '27R seria 3 × 3 × 3: a conta tem só duas mudanças, não três.']),
    prova('Mais difícil: um fio é esticado até ter 5 vezes o comprimento, sem perder material. A resistência fica quantas vezes maior?', ['5', '10', '25', '125'], 2,
          ['5 vezes é só o comprimento. A grossura cai para 1/5.',
           '10 vem de 5 + 5. As mudanças se multiplicam, não se somam.',
           'Comprimento 5 e grossura 1/5 (um quinto): 5 ÷ 1/5 = 25, que é 5 × 5.',
           '125 seria 5 × 5 × 5: só há duas mudanças.']),
)
