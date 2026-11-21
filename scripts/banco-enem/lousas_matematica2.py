"""2ª leva das aulas de lousa de nível acima de Matemática (Pablo, 21/11/2026): as outras 5 provas.
Caixas (Equações), quadrados dentro de quadrados (Geometria Plana), cubo que cresce (Geometria
Espacial), operários que saem (Grandezas) e preço que sobe e desce (Porcentagem). Contas
conferidas por força bruta. Regra da casa: número antes de letra, e palavra nova primeiro no desenho."""
from lousa import aula_lousa, caixa, caminho, circ, grade, hl, linha, lousa, prova, tx
from lousa_padrao import ensinou, outras_letras, papel_da_questao

# ======================================================================================
# 1. As três caixas (Equações e Sistemas): C = 30 kg
# ======================================================================================
ENUN_CAIXAS = ('Três caixas, A, B e C, são pesadas de duas em duas: A e B juntas pesam 30 kg, B e C juntas pesam 40 kg '
               'e A e C juntas pesam 50 kg. Quanto pesa a caixa mais pesada?')
ALTS_CAIXAS = ['20 kg', '25 kg', '30 kg', '35 kg', '60 kg']

LOUSA_CAIXAS = aula_lousa(
    lousa([(.3, 'Questão de nível acima. Ela só dá o peso das caixas de duas em duas.'), (3.4, 'Ninguém pesou uma caixa sozinha. Dá para descobrir assim mesmo.')],
          tx(200, 46, 'Três caixas', 'tinta', 46, .2),
          caixa(70, 90, 60, 60, 'tinta', .8), tx(100, 132, 'A', 'azul', 40, 1.2),
          caixa(170, 90, 60, 60, 'tinta', 1.4), tx(200, 132, 'B', 'vermelho', 40, 1.8),
          caixa(270, 90, 60, 60, 'tinta', 2.0), tx(300, 132, 'C', 'verde', 40, 2.4),
          tx(200, 200, 'só pesadas de duas em duas', 'cinza', 28, 3.4)),
    papel_da_questao([(.3, 'Lê com calma. De duas em duas quer dizer: A com B, B com C e A com C.'), (4.6, 'Ninguém pesou uma caixa sozinha.')],
                     ENUN_CAIXAS, ALTS_CAIXAS),
    lousa([(.3, 'Três pesagens, e cada uma tem duas caixas.'), (3.0, 'A com B dá 30. B com C dá 40. A com C dá 50.'), (6.0, 'A pergunta é o peso de uma caixa só, a mais pesada.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .2),
          tx(30, 84, 'A + B = 30 kg', 'tinta', 30, .8, 'start'),
          tx(30, 124, 'B + C = 40 kg', 'tinta', 30, 2.4, 'start'),
          tx(30, 164, 'A + C = 50 kg', 'tinta', 30, 3.6, 'start'),
          hl(26, 186, 320, 46, 6.0), tx(30, 220, 'quero: a caixa mais pesada', 'vermelho', 28, 6.1, 'start')),
    lousa([(.3, 'Truque: soma as três pesagens. 30 mais 40 mais 50 dá 120.'), (3.8, 'Olha as letras: A aparece em duas pesagens, B em duas e C em duas.'), (7.8, 'Então 120 é o dobro do peso das três: 2 × (A + B + C) = 120, logo A + B + C = 60. As três juntas pesam 60 kg.')],
          tx(200, 30, 'somando as três pesagens', 'tinta', 28, .2),
          tx(30, 70, 'A + B = 30', 'tinta', 26, .6, 'start'), tx(30, 100, 'B + C = 40', 'tinta', 26, 1.0, 'start'), tx(30, 130, 'A + C = 50', 'tinta', 26, 1.4, 'start'),
          linha(30, 140, 200, 140, 'tinta', 2.0, .4), tx(30, 166, 'soma: 30 + 40 + 50 = 120', 'tinta', 26, 2.6, 'start'),
          tx(250, 76, 'A: 2 vezes', 'azul', 24, 4.4, 'start'), tx(250, 104, 'B: 2 vezes', 'vermelho', 24, 5.2, 'start'), tx(250, 132, 'C: 2 vezes', 'verde', 24, 6.0, 'start'),
          hl(26, 182, 340, 40, 7.8, 'verdeClaro'), tx(30, 212, '120 ÷ 2 = 60 (as três juntas)', 'verde', 28, 7.9, 'start'),
          tx(200, 260, '2 × (A + B + C) = 120', 'azul', 26, 9.0)),
    lousa([(.3, 'Agora cada caixa. As três juntas pesam 60.'), (2.8, 'Tirando a pesagem A mais B, que é 30, sobra só a C: 60 menos 30 dá 30.'), (6.4, 'Do mesmo jeito: A é 60 − 40 = 20, e B é 60 − 50 = 10.'), (10.0, 'A mais pesada é a C, com 30 kg.')],
          tx(200, 30, 'achando cada caixa', 'tinta', 30, .2),
          tx(30, 76, 'as três juntas: 60', 'tinta', 26, .6, 'start'),
          tx(30, 114, 'C = 60 − (A + B) = 60 − 30 = 30', 'verde', 26, 2.8, 'start'),
          tx(30, 152, 'A = 60 − (B + C) = 60 − 40 = 20', 'azul', 26, 6.4, 'start'),
          tx(30, 190, 'B = 60 − (A + C) = 60 − 50 = 10', 'vermelho', 26, 8.0, 'start'),
          hl(26, 206, 340, 46, 10.0), tx(30, 240, 'a mais pesada: C = 30 kg', 'verde', 32, 10.1, 'start')),
    lousa([(.3, 'Confere: 20 mais 10 dá 30, certo. 10 mais 30 dá 40, certo.'), (3.4, '20 mais 30 dá 50, certo. Resposta: letra C.')],
          tx(200, 32, 'conferindo', 'tinta', 30, .2),
          tx(30, 84, 'A + B = 20 + 10 = 30  certo', 'verde', 27, .8, 'start'),
          tx(30, 124, 'B + C = 10 + 30 = 40  certo', 'verde', 27, 2.0, 'start'),
          tx(30, 164, 'A + C = 20 + 30 = 50  certo', 'verde', 27, 3.2, 'start'),
          tx(200, 222, 'resposta: C, 30 kg', 'vermelho', 34, 4.2)),
    outras_letras([(.3, 'Cada letra errada vem de uma conta tentadora.'), (2.8, 'A é o peso da A. B e D vêm de dividir somas ao meio. E é o peso das três juntas.'), (6.4, 'A certa é a C.')],
                  ['A · 20 kg: é o peso da caixa A', 'B · 25 kg: metade da maior pesagem', 'D · 35 kg: média de 30 e 40', 'E · 60 kg: as três juntas'], 'certa: C, 30 kg'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Soma de duas em duas: cada caixa entra 2 vezes.'), (5.4, 'Depois tira a pesagem que não tem a caixa.')],
            '1. some todas as pesagens', '2. cada uma entra 2 vezes: ÷ 2', '3. tire a pesagem sem a caixa'),
    prova('As pesagens de duas em duas são A + B = 9 kg, B + C = 11 kg e A + C = 12 kg. Quanto pesam as três juntas?', ['16 kg', '32 kg', '8 kg', '12 kg'], 0,
          ['Isso! 9 + 11 + 12 = 32, e cada caixa entrou 2 vezes: 32 ÷ 2 = 16.',
           '32 é a soma das pesagens. Cada caixa entrou 2 vezes, então falta dividir por 2.',
           '8 não tem base: a conta é (9 + 11 + 12) ÷ 2.',
           '12 é só uma das pesagens, a de A com C.']),
    prova('Mais difícil: com as mesmas pesagens (9, 11 e 12 kg), quanto pesa a caixa mais leve?', ['4 kg', '5 kg', '7 kg', '9 kg'], 0,
          ['Isso! As três pesam 16. B = 16 − 12 = 4 kg, porque 12 é a pesagem sem o B.',
           '5 kg é a caixa A (16 − 11). A B é mais leve.',
           '7 kg é a caixa C, a mais pesada das três.',
           '9 kg é uma pesagem de duas caixas, não de uma.']),
)

# ======================================================================================
# 2. Quadrados dentro de quadrados (Geometria Plana): B = 12,5 cm²
# ======================================================================================
ENUN_QUADRADOS = ('Um quadrado tem área de 100 cm². Unindo os pontos médios dos seus lados, forma-se um segundo quadrado dentro dele. '
                  'Repetindo o processo no segundo quadrado, forma-se um terceiro, e depois um quarto. Qual é a área do quarto quadrado?')
ALTS_QUADRADOS = ['6,25 cm²', '12,5 cm²', '25 cm²', '50 cm²', '87,5 cm²']

LOUSA_QUADRADOS = aula_lousa(
    lousa([(.3, 'Quadrado dentro de quadrado, unindo os pontos do meio dos lados.'), (3.4, 'A pergunta é a área do quarto. Mas calma: tem um padrão.')],
          tx(200, 34, 'Quadrados dentro de quadrados', 'tinta', 30, .2),
          caminho('M120 60L280 60L280 220L120 220Z', 'tinta', .6, .9, 3),
          caminho('M200 60L280 140L200 220L120 140Z', 'azul', 1.8, .9, 3),
          caminho('M240 100L240 180L160 180L160 100Z', 'vermelho', 3.0, .9, 3),
          caminho('M200 100L240 140L200 180L160 140Z', 'verde', 4.2, .9, 3)),
    papel_da_questao([(.3, 'Lê com calma. Ponto médio é o ponto do meio do lado.'), (3.4, 'Cada quadrado novo nasce unindo os pontos do meio do anterior.')],
                     ENUN_QUADRADOS, ALTS_QUADRADOS),
    lousa([(.3, 'O primeiro quadrado tem 100. Unir os pontos do meio dos lados faz o segundo.'), (3.4, 'Fazemos isso de novo, e de novo, até o quarto.'), (6.0, 'Quero a área do quarto.')],
          tx(200, 34, 'o que a questão pede', 'tinta', 32, .2),
          tx(30, 84, '1º quadrado: 100 cm²', 'tinta', 28, .8, 'start'),
          tx(30, 124, 'une os pontos do meio dos lados', 'tinta', 28, 2.4, 'start'),
          tx(30, 164, 'repete até o 4º quadrado', 'tinta', 28, 3.6, 'start'),
          hl(26, 186, 320, 46, 6.0), tx(30, 220, 'quero: a área do 4º', 'vermelho', 30, 6.1, 'start')),
    lousa([(.3, 'Um passo só. Quadrado de 10 por 10, área 100. Os pontos do meio dividem cada lado em 5 e 5.'), (4.0, 'Sobram 4 triângulos nos cantos, com lados 5 e 5: 5 × 5 ÷ 2 = 12,5 cada.'), (8.0, 'Os 4 triângulos somam 50. O quadrado de dentro fica com 100 − 50 = 50: a metade.')],
          caminho('M150 40L250 40L250 140L150 140Z', 'tinta', .4, .8, 3),
          caminho('M200 40L250 90L200 140L150 90Z', 'azul', 1.4, .8, 3),
          tx(175, 32, '5', 'cinza', 20, 2.4), tx(225, 32, '5', 'cinza', 20, 2.5),
          tx(30, 176, 'quadrado 10 × 10 = 100', 'tinta', 24, 1.0, 'start'),
          tx(30, 204, 'triângulo de canto: 5 × 5 ÷ 2 = 12,5', 'tinta', 24, 4.0, 'start'),
          tx(30, 232, '4 triângulos: 4 × 12,5 = 50', 'tinta', 24, 6.0, 'start'),
          hl(26, 244, 340, 34, 8.0, 'verdeClaro'), tx(30, 270, 'dentro: 100 − 50 = 50 (a metade)', 'verde', 26, 8.1, 'start')),
    lousa([(.3, 'Pelo mesmo motivo, cada quadrado novo é a metade do anterior, mesmo o torto: ele também perde 4 triângulos nos cantos.'), (3.0, '1º: 100. 2º: 100 ÷ 2 = 50. 3º: 50 ÷ 2 = 25. 4º: 25 ÷ 2 = 12,5.'), (7.0, 'A área do quarto é 12,5. Resposta: letra B.')],
          tx(200, 32, 'cada quadrado: metade do anterior', 'tinta', 28, .2),
          tx(30, 82, '1º quadrado: 100', 'tinta', 28, .8, 'start'),
          tx(30, 122, '2º: 100 ÷ 2 = 50', 'tinta', 28, 3.0, 'start'),
          tx(30, 162, '3º: 50 ÷ 2 = 25', 'tinta', 28, 4.6, 'start'),
          hl(26, 184, 340, 46, 6.0, 'verdeClaro'), tx(30, 220, '4º: 25 ÷ 2 = 12,5', 'verde', 34, 6.1, 'start'),
          tx(200, 264, 'resposta: B, 12,5 cm²', 'vermelho', 28, 7.0)),
    outras_letras([(.3, 'Cada letra errada para em outro quadrado, ou erra o passo.'), (3.0, 'A contou 4 metades, uma por quadrado. Mas do 1º ao 4º são só 3 passos.'), (7.2, 'A certa é a B.')],
                  ['A · 6,25: contou 4 metades, são 3', 'C · 25: é a área do 3º quadrado', 'D · 50: é a área do 2º quadrado', 'E · 87,5: tirou só 1 triângulo'], 'certa: B, 12,5'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Unir os pontos do meio faz a área cair pela metade.'), (5.4, 'E cada passo repete: mais uma metade.')],
            '1. unir pontos do meio: área ÷ 2', '2. cada passo: mais um ÷ 2', '3. é a área que cai à metade'),
    prova('Um quadrado tem área 80 cm². Unindo os pontos do meio dos lados, qual a área do novo quadrado?', ['40 cm²', '20 cm²', '160 cm²', '60 cm²'], 0,
          ['Isso! Cada passo fica com a metade: 80 ÷ 2 = 40.',
           '20 seria dividir por 4. A área cai pela metade, não por 4.',
           '160 é o dobro. O quadrado de dentro é menor.',
           '60 não tem base: são 4 triângulos que tiram a metade.']),
    prova('Mais difícil: o 1º quadrado tem área 64 cm². Repetindo o processo, qual a área do 4º quadrado?', ['8 cm²', '16 cm²', '4 cm²', '32 cm²'], 0,
          ['Isso! 64 → 32 → 16 → 8: três passos, três vezes ÷ 2.',
           '16 cm² é a área do 3º quadrado.',
           '4 cm² vem de contar 4 metades em vez de 3.',
           '32 cm² é a área do 2º quadrado.']),
)

# ======================================================================================
# 3. O cubo que cresce (Geometria Espacial): D = 33,1%
# ======================================================================================
ENUN_CUBO = 'Cada aresta de um cubo aumenta 10%. O volume desse cubo aumenta em quantos por cento?'
ALTS_CUBO = ['10%', '21%', '30%', '33,1%', '133,1%']

LOUSA_CUBO = aula_lousa(
    lousa([(.3, 'Questão de nível acima. A aresta cresce um pouquinho.'), (3.0, 'Será que o volume cresce o mesmo tanto? Vamos ver.')],
          tx(200, 30, 'O cubo que cresce', 'tinta', 34, .2),
          caminho('M100 100h100v100h-100z', 'tinta', .6, .8, 3), caminho('M140 60h100v100h-100z', 'tinta', 1.4, .8, 3),
          linha(100, 100, 140, 60, 'tinta', 2.2, .4), linha(200, 100, 240, 60, 'tinta', 2.4, .4), linha(200, 200, 240, 160, 'tinta', 2.6, .4), linha(100, 200, 140, 160, 'tinta', 2.8, .4),
          tx(200, 250, 'cada aresta cresce 10%', 'azul', 28, 3.4)),
    papel_da_questao([(.3, 'Lê com calma. Aresta é cada lado do cubo.'), (3.0, 'A pergunta é quanto cresce o volume, não a aresta.')],
                     ENUN_CUBO, ALTS_CUBO),
    lousa([(.3, 'Cada aresta do cubo cresce 10%.'), (2.6, 'A pergunta não é sobre a aresta. É sobre o volume.'), (5.4, 'Cuidado: o volume não cresce 10%.')],
          tx(200, 34, 'o que a questão pede', 'tinta', 32, .2),
          tx(30, 90, 'aresta: cresce 10%', 'tinta', 30, .8, 'start'),
          tx(30, 140, 'volume: cresce quantos %?', 'tinta', 30, 2.6, 'start'),
          hl(26, 168, 320, 46, 5.4, 'rosa'), tx(30, 202, 'não é 10%. Vamos provar.', 'vermelho', 30, 5.5, 'start')),
    lousa([(.3, 'Pega um cubo de aresta 10. 10% de 10 é a décima parte de 10, que é 1: a aresta vira 11.'), (4.0, 'Volume é aresta vezes aresta vezes aresta. Antes: 10 × 10 × 10 = 1000.'), (8.2, 'Depois: 11 × 11 = 121 e 121 × 11 = 1331.')],
          tx(200, 32, 'com um número fácil', 'tinta', 30, .2),
          tx(30, 84, 'aresta: 10 → 11', 'tinta', 28, .8, 'start'),
          tx(30, 132, 'antes: 10 × 10 × 10 = 1000', 'tinta', 28, 4.0, 'start'),
          tx(30, 180, 'depois: 11 × 11 × 11 = 1331', 'tinta', 28, 8.2, 'start'),
          tx(200, 242, 'volume: de 1000 para 1331', 'azul', 28, 9.4)),
    lousa([(.3, 'Subiu de 1000 para 1331: aumentou 331.'), (3.0, '331 em 1000 é 331 de cada 1000, que é 33,1 de cada 100.'), (6.6, 'Então o volume aumentou 33,1%. Resposta: letra D.')],
          tx(200, 32, 'quanto aumentou?', 'tinta', 30, .2),
          tx(30, 84, '1331 − 1000 = 331', 'tinta', 28, .8, 'start'),
          tx(30, 132, '331 em 1000 = 33,1 em 100', 'tinta', 28, 3.0, 'start'),
          hl(60, 156, 280, 62, 6.6, 'verdeClaro'), tx(200, 204, '33,1%', 'verde', 56, 6.7),
          tx(200, 256, 'resposta: D', 'vermelho', 30, 7.6)),
    outras_letras([(.3, 'Cada letra errada é um número que existe no problema.'), (2.8, 'B é a área da face, não o volume. E é o volume final, não o aumento.'), (6.4, 'A certa é a D.')],
                  ['A · 10%: é o aumento da aresta', 'B · 21%: é a ÁREA (11 × 11 = 121)', 'C · 30%: somou 10% três vezes', 'E · 133,1%: é o volume final'], 'certa: D, 33,1%'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Volume é aresta × aresta × aresta, e cada uma cresceu: por isso o aumento se multiplica, não se soma.'), (5.4, 'Use um número fácil e compare antes e depois.')],
            '1. volume: aresta três vezes', '2. 3 vezes 10%: não é 30%', '3. use um número: aresta 10'),
    prova('A aresta de um cubo dobra (de 10 para 20). O volume aumenta quantos por cento?', ['100%', '200%', '700%', '800%'], 2,
          ['100% seria o aumento da aresta, que dobrou.',
           '200% não tem base: a aresta dobra 3 vezes, uma por dimensão.',
           'Isso! 10 × 10 × 10 = 1000 e 20 × 20 × 20 = 8000: aumentou 7000, e 7000 em 1000 é 700 em 100: 700%.',
           '800% é o volume final em relação ao de antes. O aumento é 8000 − 1000 = 7000, ou 700%.']),
    prova('Mais difícil: cada aresta de um cubo aumenta 20% (de 10 para 12). O volume aumenta quantos por cento?', ['20%', '44%', '60%', '72,8%'], 3,
          ['20% é o aumento da aresta, não do volume.',
           '44% é a área da face: 12 × 12 = 144, contra 100.',
           '60% seria 3 vezes 20%. Mas as três medidas se multiplicam.',
           'Isso! 12 × 12 = 144 e 144 × 12 = 1728, contra 1000: aumentou 728 em 1000, ou seja, 72,8%.']),
)

# ======================================================================================
# 4. Os operários que saem (Grandezas e Medidas): C = 13 dias
# ======================================================================================
ENUN_OPERARIOS = ('Nove operários, todos com o mesmo ritmo, constroem um muro em 10 dias. Depois de 4 dias de trabalho, 3 operários saem e '
                  'não voltam. Em quantos dias, contando desde o primeiro dia, o muro fica pronto?')
ALTS_OPERARIOS = ['9', '10', '13', '14', '15']

LOUSA_OPERARIOS = aula_lousa(
    lousa([(.3, 'Questão de nível acima. A obra começa com nove e termina com seis.'), (3.4, 'O prazo muda. O difícil é saber quanto.')],
          tx(200, 46, 'O muro e os operários', 'tinta', 38, .2),
          grade(9, 1, 47, 96, 30, 4, .8, .12),
          tx(200, 190, '9 operários, 10 dias', 'cinza', 28, 2.6), tx(200, 232, 'e se saírem 3 no meio?', 'azul', 28, 3.6)),
    papel_da_questao([(.3, 'Lê com calma. Contando desde o primeiro dia quer dizer: os 4 dias que já passaram também entram.'), (5.4, 'A resposta é o total, não só o que falta.')],
                     ENUN_OPERARIOS, ALTS_OPERARIOS),
    lousa([(.3, 'Nove operários, mesmo ritmo. O muro fica pronto em 10 dias.'), (3.4, 'Depois de 4 dias, 3 saem.'), (5.8, 'Quero o total de dias, desde o primeiro.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .2),
          tx(30, 84, '9 operários, mesmo ritmo', 'tinta', 28, .8, 'start'),
          tx(30, 124, 'pronto em 10 dias', 'tinta', 28, 2.4, 'start'),
          tx(30, 164, 'depois de 4 dias, saem 3', 'tinta', 28, 3.6, 'start'),
          hl(26, 186, 330, 46, 5.8), tx(30, 220, 'quero: o total de dias', 'vermelho', 30, 5.9, 'start')),
    lousa([(.3, 'Truque: medir o muro em operário-dia, que é um operário trabalhando um dia.'), (3.8, '9 operários por 10 dias: 9 × 10 = 90 operário-dias. Esse é o tamanho do muro.'), (7.8, 'Se mudar o número de operários, os 90 continuam os mesmos.')],
          tx(200, 32, 'o tamanho do muro', 'tinta', 30, .2),
          tx(30, 84, '1 operário × 1 dia = 1 operário-dia', 'tinta', 24, .8, 'start'),
          tx(30, 132, '9 operários × 10 dias', 'tinta', 28, 3.8, 'start'),
          hl(26, 156, 330, 50, 5.6, 'verdeClaro'), tx(30, 192, '= 90 operário-dias', 'verde', 34, 5.7, 'start'),
          tx(200, 246, 'o muro tem 90, não importa quantos', 'azul', 24, 7.8)),
    lousa([(.3, 'Em 4 dias, os 9 operários fizeram 9 × 4 = 36 operário-dias.'), (3.4, 'Faltam 90 − 36 = 54 operário-dias. Com 6 operários, cada dia rende 6: 54 ÷ 6 = 9 dias.'), (7.4, 'Total desde o começo: 4 dias que já passaram mais 9. Dá 13. Resposta: letra C.')],
          tx(30, 40, 'já feito: 9 × 4 = 36', 'tinta', 28, .6, 'start'),
          tx(30, 84, 'falta: 90 − 36 = 54', 'tinta', 28, 3.4, 'start'),
          tx(30, 128, 'com 6 operários: 54 ÷ 6 = 9 dias', 'tinta', 26, 5.0, 'start'),
          hl(26, 156, 340, 52, 7.4, 'verdeClaro'), tx(30, 194, 'total: 4 + 9 = 13 dias', 'verde', 36, 7.5, 'start'),
          tx(200, 248, 'resposta: C, 13', 'vermelho', 30, 8.6)),
    outras_letras([(.3, 'Cada letra errada é uma conta que existe, mas para no meio.'), (2.8, 'A é só o que falta. D soma o prazo antigo. E refaz tudo só com os seis.'), (6.4, 'A certa é a C.')],
                  ['A · 9: só os dias que faltam', 'B · 10: o prazo de antes', 'D · 14: somou 4 + 10', 'E · 15: obra toda com 6 pessoas'], 'certa: C, 13 dias'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Meça a obra em operário-dia: ela não muda.'), (5.0, 'Tire o que já foi feito e divida o resto.')],
            '1. meça a obra: operários × dias', '2. tire o que já foi feito', '3. divida o resto pelo novo grupo'),
    prova('Quatro operários terminam uma obra em 6 dias. Depois de 2 dias, 2 saem. No total, em quantos dias a obra termina?', ['8', '10', '12', '14'], 1,
          ['8 são só os dias que faltam depois dos 2 primeiros.',
           'Isso! A obra tem 4 × 6 = 24. Em 2 dias, 8 feitos. Faltam 16, com 2 operários: 8 dias. Total: 2 + 8 = 10.',
           '12 vem de 24 ÷ 2, como se só 2 operários fizessem a obra toda.',
           '14 somou o prazo antigo, 6, com os 8 dias que faltam.']),
    prova('Mais difícil: 10 operários fazem uma obra em 12 dias. Depois de 3 dias, entram mais 5. No total, em quantos dias a obra termina?', ['9', '6', '8', '12'], 0,
          ['Isso! A obra tem 120, 30 já feitos, faltam 90. Com 15 operários são 6 dias. Total: 3 + 6 = 9.',
           '6 são só os dias que faltam. O total conta os 3 primeiros.',
           '8 é a obra toda feita só com os 15 (120 ÷ 15), mas 3 dias já foram feitos com 10.',
           '12 é o prazo de antes: com mais operários, o prazo tem que diminuir.']),
)

# ======================================================================================
# 5. O preço que sobe e desce (Aritmética e Porcentagem): C = 28%
# ======================================================================================
ENUN_PRECO = ('Uma loja aumentou o preço de um produto em 25%. Depois, numa liquidação, deu um desconto sobre o preço já aumentado, '
              'e o produto ficou 10% mais barato que o preço original. Qual foi o desconto da liquidação?')
ALTS_PRECO = ['15%', '25%', '28%', '30%', '35%']

LOUSA_PRECO = aula_lousa(
    lousa([(.3, 'Questão de nível acima. O preço sobe, e depois desce.'), (3.0, 'A pergunta é: desce quantos por cento?')],
          tx(200, 46, 'O preço que sobe e desce', 'tinta', 36, .2),
          caixa(40, 90, 90, 60, 'tinta', .8), tx(85, 130, '100', 'azul', 34, 1.2),
          caixa(155, 90, 90, 60, 'tinta', 1.6), tx(200, 130, '125', 'vermelho', 34, 2.0),
          caixa(270, 90, 90, 60, 'tinta', 2.4), tx(315, 130, '90', 'verde', 34, 2.8),
          linha(130, 120, 155, 120, 'tinta', 1.4, .3), linha(245, 120, 270, 120, 'tinta', 2.2, .3),
          tx(200, 210, 'sobe 25%, depois desce quanto?', 'cinza', 28, 3.6)),
    papel_da_questao([(.3, 'Lê com calma. O desconto é dado sobre o preço JÁ aumentado.'), (4.2, 'E o resultado é 10% abaixo do preço original.')],
                     ENUN_PRECO, ALTS_PRECO),
    lousa([(.3, 'Primeiro o preço sobe 25%.'), (2.4, 'Depois desce um desconto, sobre o preço novo.'), (5.0, 'No fim, ficou 10% abaixo do original. Quero o desconto.')],
          tx(200, 34, 'o que a questão pede', 'tinta', 32, .2),
          tx(30, 84, 'sobe 25%', 'tinta', 30, .8, 'start'),
          tx(30, 124, 'desce d% do preço já aumentado', 'tinta', 28, 2.4, 'start'),
          tx(30, 164, 'fica 10% abaixo do original', 'tinta', 28, 4.0, 'start'),
          hl(26, 186, 320, 46, 5.4), tx(30, 220, 'quero: o d', 'vermelho', 32, 5.5, 'start')),
    lousa([(.3, 'Truque: usa um preço fácil, 100 reais. Sobe 25%: 100 mais 25 dá 125.'), (4.2, 'Ficou 10% mais barato que o original: 100 menos 10 dá 90.'), (8.0, 'Na loja, o preço escrito na etiqueta foi de 125 para 90.')],
          tx(200, 32, 'com um preço fácil', 'tinta', 30, .2),
          tx(30, 84, '100  sobe 25%  →  125', 'tinta', 28, .8, 'start'),
          tx(30, 132, '100  menos 10%  →  90', 'tinta', 28, 4.2, 'start'),
          hl(26, 160, 320, 50, 8.0, 'verdeClaro'), tx(30, 196, 'de 125 para 90', 'verde', 36, 8.1, 'start'),
          tx(200, 248, 'qual foi o desconto?', 'azul', 28, 9.2)),
    lousa([(.3, 'De 125 para 90, o desconto foi 125 − 90 = 35 reais.'), (3.6, 'Mas o desconto é uma parte do preço que estava na etiqueta, que era 125, não 100.'), (7.6, '35 em 125. Para ver em 100: 125 ÷ 5 = 25 e 35 ÷ 5 = 7, então 7 em 25. Depois 25 × 4 = 100 e 7 × 4 = 28: dá 28 em 100.')],
          tx(200, 30, 'o desconto, em %', 'tinta', 30, .2),
          tx(30, 76, '125 − 90 = 35 reais', 'tinta', 28, .8, 'start'),
          tx(30, 116, '35 em 125 (a etiqueta)', 'tinta', 28, 3.6, 'start'),
          tx(30, 156, '35/125 = 7/25  (÷ 5)', 'tinta', 28, 7.6, 'start'),
          tx(30, 194, '7/25 = 28/100  (× 4)', 'tinta', 28, 8.8, 'start'),
          hl(60, 208, 280, 58, 10.0, 'verdeClaro'), tx(200, 252, '28%', 'verde', 52, 10.1)),
    outras_letras([(.3, 'Cada letra errada é um número que parece certo.'), (2.8, 'E é o desconto em reais, mas a base é 125. A e B nascem de somar ou copiar porcentagens.'), (7.0, 'A certa é a C.')],
                  ['A · 15%: 25 − 10, sem base', 'B · 25%: copiou o aumento', 'D · 30%: sobra 87,50, abaixo de 90', 'E · 35%: 35 são reais, não %'], 'certa: C, 28%'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Desconto é reais dividido pelo preço da etiqueta.'), (5.4, 'E um preço fácil mostra tudo.')],
            '1. ponha um preço fácil: 100', '2. desconto = reais ÷ etiqueta', '3. a base é o preço antes dele'),
    prova('Um produto de R$ 200 sobe 50% e depois cai 50%. Quanto custa no fim?', ['R$ 200', 'R$ 150', 'R$ 100', 'R$ 250'], 1,
          ['R$ 200 seria voltar ao início, mas 50% de 300 é 150, não 100.',
           'Isso! 200 + 100 = 300; 50% de 300 é 150; 300 − 150 = 150.',
           'R$ 100 é o valor do aumento (50% de 200), não o preço final.',
           'R$ 250 não tem base: o preço sobe e depois desce.']),
    prova('Mais difícil: o preço sobe 25% e depois cai d% para voltar exatamente ao preço original. Quanto é d?', ['25%', '20%', '5%', '30%'], 1,
          ['25% de 125 são 31,25, e fica 93,75: abaixo do original.',
           'Isso! 100 → 125 → 100: desconto de 25 em 125. Dividindo por 25: 1 em 5, que é 20 em 100: 20%.',
           '5% não tem base: tiraria só 6,25 de 125.',
           '30% tiraria 37,50 e ficaria 87,50, abaixo do original.']),
)
