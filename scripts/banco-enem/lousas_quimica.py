"""Aulas de lousa de nível acima de Química (Pablo, 21/11/2026): 1 por prova, ideias procuradas no banco
(nenhuma de reagente limitante, mistura de soluções ou lei de Faraday existia). O canal Universo Narrado só tem
Matemática e Física: aqui o que se copia é o TIPO DE QUADRO (lousa que se desenha, abre com a questão,
"por que as outras letras erram", Prove você), não vídeo. Regras da casa: número antes de letra, palavra
nova primeiro no desenho, fala só com conteúdo (nada de elogio), até ~260 letras de fala por tela."""
from lousa import aula_lousa, caixa, caminho, circ, hl, linha, lousa, prova, tx
from lousa_padrao import ensinou, outras_letras, papel_da_questao

# ======================================================================================
# 1. Hidrogênio e oxigênio (Estequiometria): B = 36 g
# ======================================================================================
ENUN_LIMITANTE = ('Em um laboratório, 4 g de hidrogênio (H2) reagem com 48 g de oxigênio (O2) para formar água, segundo a equação '
                  '2 H2 + O2 → 2 H2O. Massas molares: H2 = 2 g/mol, O2 = 32 g/mol, H2O = 18 g/mol. A reação vai até acabar um dos '
                  'dois gases. Qual é a massa de água formada?')
ALTS_LIMITANTE = ['18 g', '36 g', '52 g', '54 g', '72 g']

LOUSA_LIMITANTE = aula_lousa(
    lousa([(.3, 'Questão de nível acima: dois gases reagem e formam água.'), (3.4, 'Um deles acaba primeiro, e é ele que manda.')],
          tx(200, 42, 'Hidrogênio e oxigênio', 'tinta', 36, .2),
          caixa(60, 100, 110, 80, 'azul', .8), tx(115, 148, '4 g de H2', 'azul', 28, 1.6),
          caixa(230, 100, 110, 80, 'vermelho', 2.0), tx(285, 148, '48 g de O2', 'vermelho', 28, 2.8),
          tx(200, 236, 'forma água: quanto?', 'cinza', 30, 3.6)),
    papel_da_questao([(.3, 'Mol é um número fixo de partículas, como dúzia é 12. Massa molar é o peso de 1 mol, em gramas: o H2 pesa 2 g por mol.'),
                      (5.2, '24 ovos ÷ 12 = 2 dúzias; do mesmo jeito, 4 g ÷ 2 g por mol = 2 mol. H2 lê-se "agá dois": 2 átomos de hidrogênio.')],
                     ENUN_LIMITANTE, ALTS_LIMITANTE),
    lousa([(.3, 'Tenho 4 g de H2 e 48 g de O2. A equação é 2 H2 + O2 → 2 H2O.'), (4.6, 'Quero a massa de água que se forma.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .8),
          tx(30, 84, '4 g de H2 (2 g por mol)', 'tinta', 26, .8, 'start'),
          tx(30, 122, '48 g de O2 (32 g por mol)', 'tinta', 26, 2.2, 'start'),
          tx(30, 160, '2 H2 + O2 → 2 H2O', 'tinta', 28, 3.6, 'start'),
          hl(26, 182, 330, 46, 4.6), tx(30, 216, 'quero: a massa de água', 'vermelho', 28, 4.7, 'start')),
    lousa([(.3, 'A equação conta em mols, então passo os gramas para mols: massa ÷ massa molar.'), (4.8, 'H2: 4 ÷ 2 = 2 mol. O2: 48 ÷ 32 = 1,5 mol.')],
          tx(200, 32, 'gramas em mols', 'tinta', 30, .2),
          tx(30, 86, 'mols = massa ÷ massa molar', 'tinta', 26, .8, 'start'),
          tx(30, 136, 'H2: 4 ÷ 2 = 2 mol', 'azul', 30, 4.8, 'start'),
          tx(30, 184, 'O2: 48 ÷ 32 = 1,5 mol', 'vermelho', 30, 6.4, 'start')),
    lousa([(.3, 'A equação pede 2 H2 para cada 1 O2. Os 2 mol de H2 pedem 1 mol de O2.'), (4.6, 'Há 1,5 mol de O2: sobram 0,5 mol. O H2 acaba primeiro: ele é o reagente limitante.')],
          tx(200, 32, 'quem acaba primeiro', 'tinta', 30, .2),
          tx(30, 84, '2 mol de H2 pedem 1 mol de O2', 'tinta', 26, .8, 'start'),
          tx(30, 126, 'há 1,5 mol de O2: sobra 0,5', 'tinta', 26, 4.6, 'start'),
          hl(26, 150, 330, 56, 6.4, 'verdeClaro'), tx(30, 194, 'limitante: o H2', 'verde', 36, 6.5, 'start')),
    lousa([(.3, 'O limitante manda na conta. Pela equação, 2 mol de H2 formam 2 mol de H2O: de 2 para 2.'), (5.2, 'Massa: 2 mol × 18 g por mol = 36 g de água.')],
          tx(200, 32, 'a água formada', 'tinta', 30, .2),
          tx(30, 86, '2 H2 → 2 H2O: 2 mol de água', 'tinta', 26, .8, 'start'),
          tx(30, 130, '2 mol × 18 g = 36 g', 'tinta', 30, 5.2, 'start'),
          hl(26, 160, 330, 56, 6.4, 'verdeClaro'), tx(30, 204, '36 g de água', 'verde', 40, 6.5, 'start')),
    outras_letras([(.3, 'Cada letra errada usa o gás que sobra ou mistura as unidades.'), (3.0, 'A tira o coeficiente 2 da água. C soma as massas. D parte do O2. E confunde gramas com mols.'), (7.4, 'A certa é a B.')],
                  ['A · 18 g: 1 mol de água, não 2', 'C · 52 g: somou 4 + 48 (sobra O2)', 'D · 54 g: partiu do O2, que sobra', 'E · 72 g: 4 g tratado como 4 mol'], 'certa: B, 36 g'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Passar para mols, achar quem acaba primeiro e seguir só por ele.'), (6.0, 'Os gramas só voltam no fim.')],
            '1. gramas viram mols (÷ molar)', '2. o que acaba primeiro manda', '3. mols de água × 18 = gramas'),
    prova('3 mol de H2 e 1 mol de O2 reagem (2 H2 + O2 → 2 H2O). Quantos mols de água se formam?', ['2 mol', '3 mol', '1 mol', '4 mol'], 0,
          ['1 mol de O2 pede 2 de H2 e forma 2 de água: o O2 é o limitante, e sobra 1 mol de H2.',
           '3 mol seguiria o H2 sozinho, mas o O2 acaba antes.',
           '1 mol é o O2 sem o coeficiente 2 da água.',
           '4 mol soma os mols dos dois gases, e a água não vem de soma.']),
    prova('Mais difícil: 6 g de H2 e 16 g de O2 (H2 = 2 e O2 = 32 g/mol). Qual a massa de água formada?', ['18 g', '54 g', '22 g', '9 g'], 0,
          ['H2: 6 ÷ 2 = 3 mol; O2: 16 ÷ 32 = 0,5 mol. O O2 é o limitante: 0,5 mol de O2 forma 1 mol de água, que são 18 g.',
           '54 g parte do H2 (3 mol de água), mas o O2 acaba antes.',
           '22 g soma as massas, 6 + 16, e sobra H2.',
           '9 g é metade do certo: esqueceu o coeficiente 2 da água.']),
)

# ======================================================================================
# 2. Duas soluções de sal e a evaporação (Soluções): C = 0,75 mol/L
# ======================================================================================
ENUN_MISTURA = ('Um técnico mistura 300 mL de uma solução de sal (NaCl) de 0,4 mol/L com 200 mL de outra solução de NaCl de 0,9 mol/L. '
                'Depois, deixa evaporar 100 mL de água dessa mistura (o sal não evapora). Qual é a concentração final, em mol/L?')
ALTS_MISTURA = ['0,60', '0,65', '0,75', '1,3', '3,0']

LOUSA_MISTURA = aula_lousa(
    lousa([(.3, 'Questão de nível acima: duas soluções de sal se misturam, e depois some um pouco de água.'), (4.0, 'O que muda a concentração?')],
          tx(200, 42, 'A mistura e a evaporação', 'tinta', 34, .2),
          caixa(40, 110, 100, 90, 'azul', .8), tx(90, 160, '300 mL', 'azul', 26, 1.6), tx(90, 224, '0,4 mol/L', 'azul', 24, 2.0),
          caixa(260, 110, 100, 90, 'vermelho', 2.4), tx(310, 160, '200 mL', 'vermelho', 26, 3.2), tx(310, 224, '0,9 mol/L', 'vermelho', 24, 3.6),
          tx(200, 168, '+', 'tinta', 40, 2.2)),
    papel_da_questao([(.3, 'Mol é um número fixo de partículas, como dúzia é 12. "mol/L" lê-se "mol por litro": quantos mols de sal há em cada litro.'),
                      (4.6, 'Misturar soma os mols e soma os volumes. Evaporar só tira água: os mols ficam, e o volume diminui.')],
                     ENUN_MISTURA, ALTS_MISTURA),
    lousa([(.3, 'Tenho duas soluções de sal: 300 mL a 0,4 mol/L e 200 mL a 0,9 mol/L.'), (4.4, 'Depois saem 100 mL de água. Quero a concentração final.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .8),
          tx(30, 84, '300 mL a 0,4 mol/L', 'tinta', 26, .8, 'start'),
          tx(30, 122, '200 mL a 0,9 mol/L', 'tinta', 26, 2.4, 'start'),
          tx(30, 160, 'evapora 100 mL de água', 'tinta', 26, 4.4, 'start'),
          hl(26, 182, 330, 46, 5.6), tx(30, 216, 'quero: mol/L no fim', 'vermelho', 28, 5.7, 'start')),
    lousa([(.3, 'Em cada copo, mols = concentração × volume em litros.'), (3.6, '1 L são 1000 mL, então 300 mL são 0,3 L: 0,4 × 0,3 = 0,12 mol. E 200 mL são 0,2 L: 0,9 × 0,2 = 0,18 mol.')],
          tx(200, 32, 'os mols de cada copo', 'tinta', 30, .2),
          tx(30, 86, 'mols = mol/L × litros', 'tinta', 26, .8, 'start'),
          tx(30, 132, '0,4 × 0,3 = 0,12 mol', 'azul', 30, 3.6, 'start'),
          tx(30, 180, '0,9 × 0,2 = 0,18 mol', 'vermelho', 30, 5.4, 'start')),
    lousa([(.3, 'Misturando, somo os mols: 0,12 + 0,18 = 0,30 mol. Somo os volumes: 0,3 + 0,2 = 0,5 L.'), (5.0, 'A concentração da mistura é 0,30 ÷ 0,5 = 0,6 mol/L.')],
          tx(200, 32, 'a mistura', 'tinta', 30, .2),
          tx(30, 84, 'mols: 0,12 + 0,18 = 0,30', 'tinta', 28, .8, 'start'),
          tx(30, 124, 'litros: 0,3 + 0,2 = 0,5', 'tinta', 28, 2.6, 'start'),
          tx(30, 168, '0,30 ÷ 0,5 = 0,6 mol/L', 'tinta', 28, 5.0, 'start'),
          tx(200, 232, 'ainda falta a evaporação', 'azul', 26, 6.4)),
    lousa([(.3, 'Sai só água: os 0,30 mol continuam todos lá. O volume cai de 0,5 L para 0,5 − 0,1 = 0,4 L.'), (5.4, '0,30 ÷ 0,4 = 0,75 mol/L.')],
          tx(200, 32, 'a evaporação', 'tinta', 30, .2),
          tx(30, 84, 'mols: continuam 0,30', 'tinta', 28, .8, 'start'),
          tx(30, 124, 'litros: 0,5 − 0,1 = 0,4', 'tinta', 28, 3.0, 'start'),
          hl(26, 150, 330, 56, 5.4, 'verdeClaro'), tx(30, 194, '0,30 ÷ 0,4 = 0,75 mol/L', 'verde', 32, 5.5, 'start')),
    outras_letras([(.3, 'Cada letra errada pula um passo.'), (2.6, 'A esquece a evaporação. B tira a média simples de 0,4 e 0,9. D soma as concentrações. E divide por 0,1 L.'), (7.2, 'A certa é a C.')],
                  ['A · 0,60: esqueceu a evaporação', 'B · 0,65: média simples (0,4 e 0,9)', 'D · 1,3: somou as concentrações', 'E · 3,0: 0,30 ÷ 0,1 L (o que saiu)'], 'certa: C, 0,75 mol/L'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Trabalhar em mols, que se somam, e não em concentrações, que não se somam.'), (6.0, 'O volume final é o que sobra.')],
            '1. concentração × litros = mols', '2. misturar soma mols e litros', '3. evaporar tira litros, não mols'),
    prova('Misturam-se 100 mL de NaCl 1 mol/L com 100 mL de NaCl 3 mol/L. Qual a concentração?', ['2 mol/L', '4 mol/L', '1,5 mol/L', '0,5 mol/L'], 0,
          ['0,1 + 0,3 = 0,4 mol em 0,2 L: 0,4 ÷ 0,2 = 2 mol/L.',
           '4 mol/L soma as concentrações, 1 + 3.',
           '1,5 mol/L divide 0,3 por 0,2 e esquece os 0,1 mol da primeira.',
           '0,5 mol/L usa só os 0,1 mol da primeira solução, 0,1 ÷ 0,2 L.']),
    prova('Mais difícil: dessa mistura (200 mL a 2 mol/L), evaporam-se 100 mL de água. Qual a concentração?', ['4 mol/L', '2 mol/L', '8 mol/L', '1 mol/L'], 0,
          ['Os 0,4 mol ficam e o volume vai a 0,1 L: 0,4 ÷ 0,1 = 4 mol/L.',
           '2 mol/L é a de antes da evaporação.',
           '8 mol/L divide 0,4 mol por 0,05 L, como se saíssem 150 mL.',
           '1 mol/L divide 0,4 mol por 0,4 L, mas o volume final é 0,1 L.']),
)

# ======================================================================================
# 3. O cobre da eletrólise (Eletroquímica): C = 3860 s
# ======================================================================================
ENUN_FARADAY = ('Uma corrente constante de 5 A passa por uma solução de sulfato de cobre, e o cobre se deposita no eletrodo: '
                'Cu2+ + 2 e− → Cu. Para depositar 6,35 g de cobre (Cu = 63,5 g/mol), a eletrólise precisa durar quanto tempo? '
                'Dado: 1 mol de elétrons carrega 96 500 C (coulombs), e carga = corrente × tempo.')
ALTS_FARADAY = ['386 s', '1930 s', '3860 s', '7720 s', '19 300 s']

LOUSA_FARADAY = aula_lousa(
    lousa([(.3, 'Questão de nível acima: uma corrente elétrica deposita cobre numa placa (o eletrodo).'), (3.6, 'Quanto tempo leva para depositar 6,35 g?')],
          tx(200, 42, 'A corrente e o cobre', 'tinta', 36, .2),
          caixa(60, 110, 280, 80, 'azul', .8), tx(200, 160, 'solução com Cu2+', 'azul', 28, 1.8),
          tx(60, 236, '5 A', 'cinza', 30, 2.8, 'start'), tx(340, 236, '6,35 g de Cu', 'cinza', 28, 3.6, 'end')),
    papel_da_questao([(.3, 'Elétron é a partícula que leva a carga elétrica; a carga se mede em coulombs (C). Corrente em ampères (A): 5 A são 5 C por segundo.'),
                      (5.2, 'Em 3 s passam 15 C: carga = corrente × tempo. Cu2+ é cobre com 2 cargas positivas: pega 2 elétrons e vira Cu.')],
                     ENUN_FARADAY, ALTS_FARADAY),
    lousa([(.3, 'Corrente de 5 A, depositando 6,35 g de cobre (63,5 g/mol).'), (4.4, 'Cada cobre pede 2 elétrons. Quero o tempo.')],
          tx(200, 34, 'o que a questão dá', 'tinta', 32, .8),
          tx(30, 84, '5 A (carga = 5 × tempo)', 'tinta', 26, .8, 'start'),
          tx(30, 122, '6,35 g de Cu (63,5 g/mol)', 'tinta', 26, 2.4, 'start'),
          tx(30, 160, 'Cu2+ + 2 e− → Cu', 'tinta', 28, 4.4, 'start'),
          hl(26, 182, 330, 46, 5.6), tx(30, 216, 'quero: o tempo', 'vermelho', 28, 5.7, 'start')),
    lousa([(.3, 'Primeiro, quantos mols de cobre: massa ÷ massa molar.'), (3.6, '6,35 ÷ 63,5 = 0,1 mol de Cu.')],
          tx(200, 32, 'os mols de cobre', 'tinta', 30, .2),
          tx(30, 90, 'mols = massa ÷ massa molar', 'tinta', 26, .8, 'start'),
          tx(30, 140, '6,35 ÷ 63,5', 'tinta', 30, 3.6, 'start'),
          hl(26, 166, 330, 56, 4.6, 'verdeClaro'), tx(30, 208, '= 0,1 mol de Cu', 'verde', 38, 4.7, 'start')),
    lousa([(.3, 'Cada cobre usa 2 elétrons. Então 0,1 mol de Cu pede 0,1 × 2 = 0,2 mol de elétrons.'), (4.6, 'Carga: 0,2 × 96 500 = 19 300 coulombs.')],
          tx(200, 32, 'a carga que precisa passar', 'tinta', 30, .2),
          tx(30, 86, 'elétrons: 0,1 × 2 = 0,2 mol', 'tinta', 28, .8, 'start'),
          tx(30, 130, 'carga: 0,2 × 96 500', 'tinta', 28, 4.6, 'start'),
          hl(26, 156, 330, 56, 6.0, 'verdeClaro'), tx(30, 198, '= 19 300 C', 'verde', 40, 6.1, 'start')),
    lousa([(.3, 'Carga = corrente × tempo, então tempo = carga ÷ corrente.'), (4.0, '19 300 ÷ 5 = 3860 segundos. Resposta: letra C.')],
          tx(200, 32, 'o tempo', 'tinta', 30, .2),
          tx(30, 88, 'tempo = carga ÷ corrente', 'tinta', 28, .8, 'start'),
          tx(30, 132, '19 300 ÷ 5', 'tinta', 30, 4.0, 'start'),
          hl(26, 158, 330, 56, 5.0, 'verdeClaro'), tx(30, 200, '= 3860 s', 'verde', 40, 5.1, 'start')),
    outras_letras([(.3, 'Cada letra errada erra um passo da cadeia.'), (2.8, 'A erra uma casa nos mols. B esquece os 2 elétrons. D conta 4 elétrons. E responde a carga, sem dividir por 5 A.'), (7.6, 'A certa é a C.')],
                  ['A · 386 s: 0,01 mol de Cu (uma casa)', 'B · 1930 s: 1 elétron por cobre', 'D · 7720 s: 4 elétrons por cobre', 'E · 19 300 s: carga, sem ÷ 5 A'], 'certa: C, 3860 s'),
    ensinou([(.3, 'O que a questão cobrou:'), (2.2, 'Seguir a cadeia: massa, mols de cobre, mols de elétrons, carga, tempo.'), (6.0, 'Cada seta é uma conta curta.')],
            '1. massa ÷ molar = mols de Cu', '2. mols de Cu × 2 = mols de e−', '3. × 96 500 ÷ corrente = tempo'),
    prova('Uma corrente de 10 A deposita 0,1 mol de prata (Ag+ + 1 e− → Ag; 96 500 C por mol de e−). Quanto tempo?', ['965 s', '9650 s', '1930 s', '96,5 s'], 0,
          ['0,1 mol de Ag pede 0,1 mol de e−: 9650 C. E 9650 ÷ 10 = 965 s.',
           '9650 s é a carga, sem dividir pela corrente.',
           '1930 s conta 2 elétrons por prata, e a equação mostra 1.',
           '96,5 s erra uma casa na carga.']),
    prova('Mais difícil: 5 A deposita 0,05 mol de alumínio (Al3+ + 3 e− → Al). Quanto tempo?', ['2895 s', '965 s', '8685 s', '1930 s'], 0,
          ['0,05 × 3 = 0,15 mol de e−. A carga é 0,15 × 96 500 = 14 475 C, e 14 475 ÷ 5 = 2895 s.',
           '965 s usa 1 elétron por alumínio, e são 3.',
           '8685 s usa 0,15 mol de Al, em vez de 0,05.',
           '1930 s conta 2 elétrons por alumínio, e são 3.']),
)
