"""Nível acima v2 de Física: Termodinâmica e Calor (23/11/2026; revisado 24/11/2026 pelo relatório do aluno-do-zero).

a = ENEM (banheira: mistura, rendimento e custo do gás), b = ITA (reta p-V, mesma isoterma, volume constante, energia interna),
c = Fuvest (o gelo derrete todo? depois a resistência com 80%), d = Harvard-MIT (escada infinita de barras, âncora por técnica).
As letras das equações são abreviações próprias (nunca A a E, nunca unidade nem letra de outra grandeza da questão).
Conferido por assert no próprio módulo.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_ter
"""
from fractions import Fraction as Fr

ARQUIVO = 'fisica-acima-novas.json'
T = 'Termodinâmica e Calor'

Q = []
MANTER = {}


def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


def ex(enunciado, alts, resolucao):
    return {'enunciado': enunciado, 'alternativas': alts, 'certa': 0, 'resolucao': resolucao}


# ============ Aulas "Antes" novas (todas com id 'ter-...') ============
ANTES_NOVOS = {
    'ter-calor-especifico': {
        'titulo': 'Calor para esquentar: calor = massa · c · ΔT',
        'linhas': [
            'Calor é energia que passa do corpo quente para o frio. Medimos em cal ou em J (1 cal = 4 J, perto de 4,2).',
            'Calor específico (c): quanto calor 1 g do material pede para subir 1 °C. A água pede 1 cal por g por °C.',
            'Calor = massa · c · ΔT. 200 g de água de 20 °C a 50 °C: ΔT = 30, então calor = 200 · 1 · 30 = 6 000 cal.',
            'Em kJ: a água pede 4,2 kJ por kg por °C. 1 L de água tem 1 kg. 1 MJ = 1 000 kJ.',
            'Dois corpos isolados trocam calor até a mesma temperatura: o calor que um cede é o que o outro recebe.',
        ],
        'visual': tabela('Calor para esquentar a água', ['Massa', 'ΔT', 'Calor'], [['100 g', '10 °C', '100 · 1 · 10 = 1 000 cal'], ['2 kg', '5 °C', '2 · 4,2 · 5 = 42 kJ']]),
        'exercicios': [
            ex('Quanto calor pedem 500 g de água para ir de 20 °C a 60 °C? (c = 1 cal/(g · °C))', ['20 000 cal', '500 cal', '40 cal', '10 000 cal'],
               '20 000 cal: ΔT = 60 − 20 = 40 e calor = 500 · 1 · 40 = 20 000 cal.\n500 cal esquece o ΔT; 40 cal é só o ΔT; 10 000 cal usa ΔT = 20.'),
            ex('Misturam-se 1 kg de água a 80 °C e 1 kg de água a 20 °C, sem perda. Qual a temperatura final?', ['50 °C', '100 °C', '60 °C', '40 °C'],
               '50 °C: a quente perde 80 − T e a fria ganha T − 20. 80 − T = T − 20, então 2 · T = 100 e T = 50.\n100 °C soma as duas; 60 °C e 40 °C não equilibram.'),
        ],
    },
    'ter-mistura-equacao': {
        'titulo': 'Equação da mistura: parêntese e cortar',
        'linhas': [
            'Parêntese: 20 · (50 − x) = 20 · 50 − 20 · x = 1 000 − 20 · x. O 20 multiplica os dois termos de dentro.',
            'Fator igual nos dois lados pode ser cortado: 30 · c · x = 20 · c · (50 − x) fica 30 · x = 20 · (50 − x).',
            'Somar o mesmo valor nos dois lados mantém a igualdade: 30 · x = 1 000 − 20 · x. Somo 20 · x: 50 · x = 1 000.',
            'Depois divido: x = 1 000 ÷ 50 = 20. Teste: 30 · 20 = 600 e 20 · (50 − 20) = 20 · 30 = 600. Iguais.',
        ],
        'visual': tabela('Teste da mistura', ['Lado', 'Conta com x = 20', 'Valor'], [['Quente', '30 · 20', '600'], ['Fria', '20 · (50 − 20) = 20 · 30', '600']]),
        'exercicios': [
            ex('Resolva 20 · x = 10 · (9 − x).', ['3', '9', '4,5', '0,3'],
               '3: 10 · (9 − x) = 90 − 10 · x. Somo 10 · x: 30 · x = 90, e x = 3.\n9 e 4,5 esquecem de somar 10 · x; 0,3 divide errado.'),
            ex('Quanto vale 7 · (6 − x) quando x = 2?', ['28', '40', '10', '35'],
               '28: 6 − 2 = 4 e 7 · 4 = 28.\n40 faz 7 · 6 − 2; 10 faz 6 + 2 + 2; 35 usa 6 − 1.'),
        ],
    },
    'ter-rendimento': {
        'titulo': 'Rendimento: quando dividir e quando multiplicar',
        'linhas': [
            'Rendimento é a parte da energia que chega ao que importa. 80% = 0,8 = 8 em cada 10.',
            'Se o gás dá 10 e chega 80%, chegam 0,8 · 10 = 8. O útil (8) é MENOR que o total (10).',
            'Para achar o total, divida o útil pelo rendimento: 8 ÷ 0,8 = 10. Multiplicar daria 6,4, e está errado.',
            'Dividir por 0,8: multiplique os dois por 10. 8 ÷ 0,8 = 80 ÷ 8 = 10. Para achar o útil, multiplique: 0,8 · 10 = 8.',
        ],
        'visual': tabela('Rendimento de 0,8', ['Pergunta', 'Conta', 'Resultado'], [['Total 10, qual o útil?', '0,8 · 10', '8'], ['Útil 8, qual o total?', '8 ÷ 0,8 = 80 ÷ 8', '10']]),
        'exercicios': [
            ex('Um forno entrega 60 J úteis com rendimento de 0,6. Quanta energia ele gasta?', ['100 J', '36 J', '60 J', '0,01 J'],
               '100 J: o total é maior que o útil. 60 ÷ 0,6 = 600 ÷ 6 = 100.\n36 J multiplica; 60 J ignora o rendimento; 0,01 J inverte a divisão.'),
            ex('Chegam 45 J úteis e o rendimento é 0,9. Qual o total?', ['50 J', '40,5 J', '135 J', '4,5 J'],
               '50 J: 45 ÷ 0,9 = 450 ÷ 9 = 50.\n40,5 J multiplica por 0,9; 135 J multiplica por 3; 4,5 J erra a vírgula.'),
        ],
    },
    'ter-watt-e-tempo': {
        'titulo': 'Watt é joule por segundo: achar o tempo',
        'linhas': [
            'Potência mede energia por tempo. 1 W = 1 J por segundo. 720 W = 720 J a cada segundo.',
            'Energia = potência · tempo. Então tempo = energia ÷ potência.',
            'Com 72 000 J e 720 J por segundo: 72 000 ÷ 720 = 7 200 ÷ 72 = 100 s (corte um zero de cada lado).',
            '1 kW = 1 000 W. Uma resistência de 2 kW dá 2 000 J por segundo.',
        ],
        'visual': tabela('Energia, potência e tempo', ['Potência', 'Tempo', 'Energia'], [['20 W', '30 s', '20 · 30 = 600 J'], ['500 W', '12 s', '500 · 12 = 6 000 J']]),
        'exercicios': [
            ex('Um aquecedor de 500 W entrega 6 000 J. Quanto tempo leva?', ['12 s', '3 000 000 s', '0,08 s', '5 500 s'],
               '12 s: 500 J por segundo, então 6 000 ÷ 500 = 60 ÷ 5 = 12.\n3 000 000 s multiplica; 0,08 s inverte; 5 500 s soma.'),
            ex('Uma resistência dá 20 J por segundo. Quanta energia dá em 30 s?', ['600 J', '50 J', '10 J', '1,5 J'],
               '600 J: 20 · 30 = 600.\n50 J soma 20 + 30; 10 J subtrai; 1,5 J divide.'),
        ],
    },
    'ter-mudanca-de-fase': {
        'titulo': 'Gelo derretendo: calor latente',
        'linhas': [
            'Gelo a 0 °C derrete sem esquentar: o calor entra e a temperatura fica parada em 0 °C até acabar o gelo.',
            'Calor latente (L): calor para mudar 1 g de fase. Fusão do gelo: L = 80 cal por g.',
            'Calor para derreter = massa · L. Derreter 50 g de gelo a 0 °C: 50 · 80 = 4 000 cal.',
            'Gelo abaixo de 0 °C primeiro esquenta até 0 °C (c do gelo = 0,5 cal por g por °C), depois derrete, depois a água esquenta.',
            'Cada etapa é uma conta separada. Se o calor não basta para derreter tudo, a mistura fica em 0 °C com gelo sobrando.',
        ],
        'visual': tabela('Etapas de 10 g de gelo a −10 °C até água a 20 °C', ['Etapa', 'Conta', 'Calor'], [['Gelo a 0 °C', '10 · 0,5 · 10', '50 cal'], ['Derreter', '10 · 80', '800 cal'], ['Água a 20 °C', '10 · 1 · 20', '200 cal']]),
        'exercicios': [
            ex('Quanto calor derrete 100 g de gelo a 0 °C? (L = 80 cal/g)', ['8 000 cal', '800 cal', '180 cal', '80 cal'],
               '8 000 cal: 100 · 80 = 8 000 cal.\n800 cal perde um zero; 180 cal soma 100 + 80; 80 cal é só o L.'),
            ex('10 g de gelo a −10 °C vão a 0 °C. Quanto calor? (c do gelo = 0,5 cal/(g · °C))', ['50 cal', '100 cal', '5 cal', '800 cal'],
               '50 cal: 10 · 0,5 · 10 = 50 cal.\n100 cal esquece o 0,5; 5 cal esquece a massa; 800 cal é o calor de derreter.'),
        ],
    },
    'ter-gas-ideal': {
        'titulo': 'Gás ideal: p · V, temperatura e trabalho',
        'linhas': [
            'Num gás ideal, pressão (p), volume (V) e temperatura (T, em kelvin) se ligam por p · V = n · R · T.',
            'n e R não mudam. Se a temperatura não muda, p · V fica igual: a pressão dobra quando o volume cai à metade.',
            'A energia interna do gás só depende da temperatura. Mesma temperatura, mesma energia: variação zero.',
            'Trabalho do gás com pressão constante: p · ΔV. Com volume constante, ΔV = 0 e o trabalho é zero.',
            '1ª lei: calor recebido = trabalho + variação da energia interna. Com p em Pa e V em m³, o trabalho sai em J.',
        ],
        'visual': tabela('Trabalho a pressão constante', ['p', 'ΔV', 'p · ΔV'], [['2 × 10⁵ Pa', '3 L = 3 × 10⁻³ m³', '600 J'], ['1 × 10⁵ Pa', '0 (volume constante)', '0']]),
        'exercicios': [
            ex('Um gás tem p = 4 e V = 2 (unidades de aula). A temperatura não muda e o volume vai a 8. Qual a nova pressão?', ['1', '4', '16', '0,5'],
               '1: p · V = 4 · 2 = 8 fica igual, e 8 ÷ 8 = 1.\n4 não muda a pressão; 16 multiplica por 4; 0,5 divide por 16.'),
            ex('Um gás recebe 500 J de calor e realiza 500 J de trabalho. Quanto varia a energia interna?', ['0 J', '1 000 J', '500 J', '250 J'],
               '0 J: calor = trabalho + variação, então 500 = 500 + variação, e a variação é 0.\n1 000 J soma; 500 J esquece o trabalho; 250 J divide.'),
        ],
    },
    'ter-energia-do-gas': {
        'titulo': 'Energia interna do gás monoatômico: U = (3/2) · p · V',
        'linhas': [
            'Gás monoatômico: cada partícula é um átomo solto (hélio, neônio). Só nele vale U = (3/2) · n · R · T.',
            'Mas n · R · T é o mesmo p · V da equação do gás. Então U = (3/2) · p · V.',
            'Exemplo: p · V = 300 J. U = (3/2) · 300 = 300 ÷ 2 · 3 = 150 · 3 = 450 J.',
            'O que importa é a variação: ΔU = U final − U inicial. Se p · V não muda, ΔU = 0.',
        ],
        'visual': tabela('Energia interna de um monoatômico', ['p · V', 'Conta', 'U'], [['300 J', '300 ÷ 2 · 3', '450 J'], ['900 J', '900 ÷ 2 · 3', '1 350 J']]),
        'exercicios': [
            ex('Gás monoatômico com p · V = 200 J. Quanto vale U?', ['300 J', '133 J', '200 J', '600 J'],
               '300 J: 200 ÷ 2 = 100 e 100 · 3 = 300.\n133 J divide por 3/2 ao contrário; 200 J esquece o 3/2; 600 J usa 3 · 200.'),
            ex('Num monoatômico, p · V vai de 100 J a 400 J. Quanto vale ΔU?', ['450 J', '600 J', '150 J', '300 J'],
               '450 J: variação de p · V = 400 − 100 = 300; 300 ÷ 2 = 150; 150 · 3 = 450.\n600 J usa só o final; 150 J só o inicial; 300 J esquece o 3/2.'),
        ],
    },
    'ter-area-trapezio': {
        'titulo': 'Trabalho no diagrama p × V: área do trapézio',
        'linhas': [
            'No diagrama p × V (pressão para cima, volume para o lado), o trabalho é a ÁREA entre a linha e o eixo do volume.',
            'Linha reta: a área é um trapézio. Área = (lado menor + lado maior) ÷ 2 · largura.',
            'Os lados são as pressões e a largura é a variação do volume. Pressões 3 e 1, volume de 1 L a 3 L: (3 + 1) ÷ 2 · 2 = 4.',
            'Volume constante: largura 0, área 0, sem trabalho. Pressão constante: um retângulo, p · ΔV.',
        ],
        'visual': tabela('Trapézio sob a reta', ['Lados (pressões)', 'Largura (ΔV)', 'Área'], [['3 e 1', '3 − 1 = 2', '(3 + 1) ÷ 2 · 2 = 4'], ['4 e 2', '5 − 2 = 3', '(4 + 2) ÷ 2 · 3 = 9']]),
        'exercicios': [
            ex('A pressão vai de 4 a 2 enquanto o volume vai de 2 a 5, em reta. Qual a área?', ['9', '18', '6', '12'],
               '9: (4 + 2) ÷ 2 = 3 e a largura é 5 − 2 = 3. 3 · 3 = 9.\n18 esquece o ÷ 2; 6 usa só a pressão final; 12 só a inicial.'),
            ex('O volume fica em 3 e a pressão sobe de 1 a 5. Qual o trabalho (área)?', ['0', '12', '9', '3'],
               '0: volume constante, largura 3 − 3 = 0 e área 0.\n12, 9 e 3 contam uma área que não existe.'),
        ],
    },
    'ter-potencias-multiplicar': {
        'titulo': 'Multiplicar potências de dez: somar os expoentes',
        'linhas': [
            '10⁵ · 10⁻³: some os expoentes. 5 + (−3) = 2, então 10².',
            'Confira com números: 10⁵ = 100 000 e 10⁻³ = 0,001. 100 000 · 0,001 = 100, que é 10².',
            'Com número na frente: 2 × 10⁵ · 2 × 10⁻³. Multiplique 2 · 2 = 4 e 10⁵ · 10⁻³ = 100. Então 4 · 100 = 400.',
        ],
        'visual': tabela('Passo a passo', ['Conta', 'Números', 'Potências', 'Resultado'], [['2 × 10⁵ · 2 × 10⁻³', '2 · 2 = 4', '10⁵ · 10⁻³ = 10²', '4 · 100 = 400']]),
        'exercicios': [
            ex('Quanto é 3 × 10⁵ · 2 × 10⁻³?', ['600', '6', '6 000', '60'],
               '600: 3 · 2 = 6 e 10⁵ · 10⁻³ = 10² = 100, então 6 · 100 = 600.\n6 esquece as potências; 6 000 e 60 erram o expoente.'),
            ex('Quanto é 10⁴ · 10⁻²?', ['100', '0,01', '1 000 000', '2'],
               '100: 4 + (−2) = 2, então 10² = 100.\n0,01 é 10⁻²; 1 000 000 soma 4 + 2 em vez de 4 − 2; 2 é só o expoente.'),
        ],
    },
    'ter-resistencia-termica': {
        'titulo': 'Barra que conduz calor: resistência térmica',
        'linhas': [
            'O calor passa por uma barra de um ponto quente para um frio. Fluxo (W) = diferença de temperatura ÷ resistência.',
            'Resistência da barra: L ÷ (k · S). L comprimento (m), S seção (m²), k condutividade (W/(m · K)). 1 cm² = 10⁻⁴ m² = 0,0001 m².',
            'Exemplo: k = 100, L = 1 m, S = 1 cm². k · S = 100 · 0,0001 = 0,01. Resistência = 1 ÷ 0,01 = 100 K/W (0,01 cabe 100 vezes em 1).',
            'Barras em fila (série): o mesmo fluxo passa por todas e as resistências somam. Queda de temperatura numa barra = fluxo · resistência.',
        ],
        'visual': tabela('Resistências', ['Montagem', 'Conta', 'Resultado'], [['1 barra', '1 ÷ 0,01', '100 K/W'], ['2 em série', '100 + 100', '200 K/W']]),
        'exercicios': [
            ex('Barra de 2 m, seção de 1 cm² e k = 100 W/(m · K). Qual a resistência?', ['200 K/W', '0,005 K/W', '100 K/W', '20 K/W'],
               '200 K/W: 1 cm² = 0,0001 m², k · S = 0,01 e 2 ÷ 0,01 = 200.\n0,005 inverte a conta; 100 usa L = 1; 20 erra a seção.'),
            ex('Duas barras de 40 K/W em série, com 100 °C de diferença entre as pontas. Qual o fluxo?', ['1,25 W', '2,5 W', '5 W', '0,8 W'],
               '1,25 W: resistência = 40 + 40 = 80 e fluxo = 100 ÷ 80 = 1,25 W.\n2,5 W usa só uma barra; 5 W usa o paralelo; 0,8 W inverte a divisão.'),
        ],
    },
    'ter-paralelo-desigual': {
        'titulo': 'Barras em paralelo: produto ÷ soma',
        'linhas': [
            'Barras ligadas aos mesmos dois pontos (paralelo): o calor tem dois caminhos, então o total é MENOR que a menor resistência.',
            'Com duas resistências, total = (R1 · R2) ÷ (R1 + R2): o produto dividido pela soma.',
            'Exemplo, 30 e 60: 30 · 60 = 1 800 e 30 + 60 = 90. 1 800 ÷ 90 = 20. Menor que 30, como deve ser.',
            'Duas iguais, 50 e 50: 2 500 ÷ 100 = 25, a metade.',
        ],
        'visual': tabela('Paralelo', ['Resistências', 'Produto ÷ soma', 'Total'], [['30 e 60', '1 800 ÷ 90', '20'], ['50 e 50', '2 500 ÷ 100', '25']]),
        'exercicios': [
            ex('Duas barras de 20 e 30 K/W em paralelo. Qual a resistência total?', ['12 K/W', '50 K/W', '25 K/W', '10 K/W'],
               '12 K/W: 20 · 30 = 600 e 20 + 30 = 50. 600 ÷ 50 = 12.\n50 K/W soma (é série); 25 K/W é a média; 10 K/W é a metade da menor.'),
            ex('Duas barras de 6 e 3 K/W em paralelo. Qual a resistência total?', ['2 K/W', '9 K/W', '4,5 K/W', '18 K/W'],
               '2 K/W: 6 · 3 = 18 e 6 + 3 = 9. 18 ÷ 9 = 2.\n9 K/W soma; 4,5 K/W é a média; 18 K/W só multiplica.'),
        ],
    },
    'ter-produto-zero': {
        'titulo': 'Produto zero: achar as raízes',
        'linhas': [
            'Se um produto dá zero, um dos fatores é zero. (x − 3) · (x + 2) = 0 vale se x = 3 ou x = −2.',
            'Abrindo: (x − 3) · (x + 2) = x · x + 2x − 3x − 6 = x · x − x − 6.',
            'Então x · x − x − 6 = 0 tem raízes 3 e −2. Procure dois números que somam −1 (o número de x) e multiplicam −6.',
            'Outro: x · x − 25 · x − 1 250. Como 1 250 = 50 · 25, teste 50 e 25. Produto negativo: um é negativo. Soma −25: o maior leva o sinal −.',
            'Então −50 + 25 = −25 e −50 · 25 = −1 250: (x − 50) · (x + 25) = 0. Se a grandeza não pode ser negativa, fica só a raiz positiva.',
        ],
        'visual': tabela('Achar os fatores', ['Equação', 'Soma e produto', 'Fatores'], [['x · x − x − 6 = 0', '−3 + 2 = −1 e −3 · 2 = −6', '(x − 3) · (x + 2)'], ['x · x − 25x − 1 250 = 0', '−50 + 25 = −25 e −50 · 25 = −1 250', '(x − 50) · (x + 25)']]),
        'exercicios': [
            ex('Quais as raízes de x · x − 25 · x − 1 250 = 0?', ['50 e −25', '−50 e 25', '50 e 25', '125 e −10'],
               '50 e −25: −50 + 25 = −25 e −50 · 25 = −1 250, então (x − 50) · (x + 25) = 0.\n−50 e 25 troca os sinais; 50 e 25 dá produto positivo; 125 e −10 erra a soma.'),
            ex('A resistência R não é negativa e R · R − 4R − 12 = 0. Quanto vale R?', ['6', '2', '12', '4'],
               '6: −6 + 2 = −4 e −6 · 2 = −12, então (R − 6) · (R + 2) = 0; R = 6 (−2 não serve).\n2 é a raiz negativa trocada; 12 e 4 são só números da equação.'),
        ],
    },
}
for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('ter-'), _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    for _e in _c['exercicios']:
        assert _e['alternativas'][_e['certa']].split(' ')[0] in _e['resolucao'].split('\n')[0], (_id, _e['enunciado'])
        assert len(set(_e['alternativas'])) == len(_e['alternativas']), (_id, _e['enunciado'])
    assert len(_c['exercicios']) == 2, _id
# confere as contas das aulas
assert 200 * 1 * 30 == 6000 and 500 * 40 == 20000 and 80 - 50 == 50 - 20
assert Fr(8) / Fr(8, 10) == 10 and Fr(60) / Fr(6, 10) == 100 and Fr(45) / Fr(9, 10) == 50 and Fr(8) * Fr(8, 10) == Fr(32, 5)
assert 20 * (50 - 20) == 30 * 20 == 600 and 30 * 3 == 90 and 7 * (6 - 2) == 28
assert Fr(72000, 720) == 100 and Fr(6000, 500) == 12 and 20 * 30 == 600
assert 50 * 80 == 4000 and 100 * 80 == 8000 and 10 * Fr(1, 2) * 10 == 50
assert Fr(3, 2) * 200 == 300 and Fr(3, 2) * (400 - 100) == 450 and Fr(3, 2) * 300 == 450 and Fr(3, 2) * 900 == 1350
assert Fr(4 + 2, 2) * 3 == 9 and Fr(3 + 1, 2) * 2 == 4 and 3 * 2 * 100 == 600
assert 1 * Fr(100) == 100 and Fr(2) / (100 * Fr(1, 10000)) == 200 and Fr(100, 80) == Fr(5, 4)
assert Fr(20 * 30, 50) == 12 and Fr(6 * 3, 9) == 2 and Fr(30 * 60, 90) == 20 and Fr(50 * 50, 100) == 25
assert (-5 + 3, -5 * 3) == (-2, -15) and (-50 + 25, -50 * 25) == (-25, -1250) and (-6 + 2, -6 * 2) == (-4, -12) and 50 * 25 == 1250

# ============ a) ENEM: banheira, custo do gás no mês ============
V_BANHEIRA, T_BANHO, T_FRIA, T_QUENTE = 50, 40, 20, 70
C_AGUA = Fr(42, 10)          # kJ/(kg·°C)
RENDIM = Fr(8, 10)           # 20% se perde
PODER = 42                   # MJ/kg
PRECO_KG = Fr(104, 13)
BANHOS = 2 * 30


def custo_mes(litros_quentes, rendimento=RENDIM, poder_mj=PODER, banhos=BANHOS):
    calor_mj = litros_quentes * C_AGUA * (T_QUENTE - T_FRIA) / 1000
    gas_kg = calor_mj / rendimento / poder_mj
    return gas_kg * PRECO_KG * banhos


X = Fr(V_BANHEIRA * (T_BANHO - T_FRIA), (T_QUENTE - T_FRIA))      # 30 · x = 20 · (50 − x)  ->  x = 50 · 20 ÷ 50
assert X == 20 and X * (T_QUENTE - T_BANHO) == (V_BANHEIRA - X) * (T_BANHO - T_FRIA) == 600
assert 20 * (50 - 20) == 1000 - 20 * 20 and 30 * 20 + 20 * 20 == 1000
assert X * C_AGUA * 50 == 4200 and 20 * Fr(42, 10) == 84 and 84 * 50 == 4200
CALOR_MJ = Fr(4200, 1000)
GAS_ENERGIA = CALOR_MJ / RENDIM
assert (CALOR_MJ, GAS_ENERGIA, GAS_ENERGIA / PODER, PRECO_KG) == (Fr(21, 5), Fr(21, 4), Fr(1, 8), 8)
assert 42 // 8 == 5 and 42 - 8 * 5 == 2 and Fr(2, 8) == Fr(1, 4) and Fr(42, 8) == Fr(21, 4) == Fr(525, 100)    # 42 ÷ 8 = 5,25
assert Fr(1, 8) == Fr(125, 1000) and 8 * Fr(125, 1000) == 1 and 13 * 8 == 104
assert custo_mes(X) == 60
# erros típicos
assert custo_mes(V_BANHEIRA) == 150                                           # os 50 L passam pelo aquecedor (20 a 70)
assert custo_mes(X, rendimento=1) == 48                                       # esqueceu o rendimento
assert float(CALOR_MJ * RENDIM / PODER * PRECO_KG * BANHOS) == 38.4          # multiplicou por 0,8
assert custo_mes(X) / BANHOS == 1                                             # custo de um banho, sem o mês
ENUN_A = ('Uma família com crianças pequenas dá dois banhos por dia numa banheira de 50 L, sempre com a água a 40 °C. A água da rua chega a 20 °C. '
          'Um aquecedor a gás, ligado à torneira de água quente, esquenta a água que passa por ele de 20 °C até 70 °C; depois a família completa a banheira '
          'com água fria da torneira, a 20 °C, até acertar os 40 °C do banho. O fabricante informa que 20% da energia do gás se perde pela chaminé; o restante '
          'vai para a água. O gás vem em botijão, e o rótulo e a nota fiscal trazem os dados da tabela abaixo. Considere que 1 L de água tem massa de 1 kg, '
          'que não há troca de calor com a banheira nem com o ar e que o mês tem 30 dias.\n\n'
          'Calor específico da água: 4,2 kJ/(kg · °C)\nPoder calorífico do gás: 42 MJ/kg\nBotijão: 13 kg de gás por R$ 104,00\n\n'
          'Qual é, em reais, o custo mensal de gás só com esses banhos?')
assert len(ENUN_A) >= 600, len(ENUN_A)
DADOS_A = [('Banheira', '50 L a 40 °C'), ('Água da rua', '20 °C'), ('Saída do aquecedor', '70 °C'), ('Perda na chaminé', '20% da energia do gás'),
           ('Calor específico da água', '4,2 kJ/(kg · °C)'), ('Poder calorífico do gás', '42 MJ/kg'), ('Botijão', '13 kg de gás por R$ 104,00'), ('Banhos', '2 por dia, 30 dias')]
Q.append(dict(
    id='d2-escada-fis-ita-ter-00a', materia='Física', tema=T, calc=60,
    enunciado=ENUN_A, dados=DADOS_A,
    alts=[('R$ 1,00', 1, 'Deu o custo de um banho só, sem multiplicar pelos 60 banhos do mês'),
          ('R$ 38,40', 38.4, 'Multiplicou o calor por 0,8 em vez de dividir: 4,2 · 0,8 = 3,36 MJ'),
          ('R$ 48,00', 48, 'Esqueceu o rendimento: 4,2 ÷ 42 = 0,1 kg por banho'),
          ('R$ 60,00', 60, 'OK'),
          ('R$ 150,00', 150, 'Passou os 50 L pelo aquecedor (de 20 °C a 70 °C), em vez de só os 20 L quentes')],
    resumo='Mistura: 30 · x = 20 · (50 − x), x = 20 L quentes; calor útil = 20 · 4,2 · 50 = 4 200 kJ = 4,2 MJ; gás: 4,2 ÷ 0,8 = 5,25 MJ = 0,125 kg; 0,125 · R$ 8 · 60 banhos = R$ 60,00.',
    ideia='O aquecedor só esquenta a parte quente da banheira; a mistura diz quantos litros são. Depois o calor vira massa de gás (com o rendimento) e a massa vira reais.',
    pecas=[('Rendimento', 'Fração da energia do gás que chega à água. Se 20% se perde, chega 80%, ou 0,8.'),
           ('Poder calorífico', 'Energia que 1 kg de gás entrega ao queimar (aqui, em MJ por kg).')],
    formulas=[('termometro', 'Calor para esquentar', 'calor = massa · c · ΔT'), ('termometro', 'Mistura', 'calor cedido = calor recebido'),
              ('porcentagem', 'Rendimento', 'energia do gás = calor útil ÷ 0,8')],
    eq='custo = banhos · gas · preco', leitura='custo do mês = nº de banhos · kg de gás por banho · preço de 1 kg',
    letras=[('custo', 'custo de gás no mês, em reais (o que a questão quer)'), ('banhos', 'número de banhos no mês'), ('gas', 'kg de gás gastos em 1 banho'),
            ('preco', 'preço de 1 kg de gás, em reais'), ('util', 'calor útil que a água quente recebe, em MJ'), ('quente', 'litros de água quente em cada banho')],
    eq_texto='Cada banho gasta "gas" kg de gás, e cada kg custa "preco" reais. Multiplicando pelos banhos do mês, sai o custo do mês.\nAgora é só achar banhos, preco, quente, util e gas.',
    achando=[('Achando banhos: os banhos do mês', '2 banhos por dia em 30 dias: banhos = 2 · 30 = 60.'),
             ('Achando preco: o preço de 1 kg', 'O botijão tem 13 kg e custa R$ 104,00. Cada kg custa 104 ÷ 13.\nTeste: 13 · 8 = 104, então preco = R$ 8,00 por kg.'),
             ('Achando quente: os litros quentes',
              'A quente esfria de 70 °C a 40 °C: 30 graus. A fria esquenta de 20 °C a 40 °C: 20 graus, e são 50 − quente litros.\n'
              'Calor cedido = recebido. A massa em kg é igual aos litros e o c é o mesmo, então corta: 30 · quente = 20 · (50 − quente).\n'
              'Abro o parêntese: 20 · (50 − quente) = 20 · 50 − 20 · quente = 1 000 − 20 · quente.\n'
              'Somo 20 · quente nos dois lados (a igualdade se mantém): 30 · quente + 20 · quente = 1 000, ou 50 · quente = 1 000. Então quente = 20 L.\n'
              'Teste: 30 · 20 = 600 e 20 · (50 − 20) = 20 · 30 = 600.'),
             ('Achando util: o calor útil',
              'Só os 20 L (20 kg) passam pelo aquecedor, de 20 °C a 70 °C: 70 − 20 = 50 graus.\ncalor = 20 · 4,2 · 50. Primeiro 20 · 4,2 = 84; depois 84 · 50 = 4 200 kJ.\n'
              '1 MJ = 1 000 kJ, então util = 4 200 ÷ 1 000 = 4,2 MJ.'),
             ('Achando gas: o gás de um banho',
              'Perde 20%, chega 100% − 20% = 80% = 0,8. O útil (4,2) é menor que o total do gás, então divide: 4,2 ÷ 0,8.\n'
              'Multiplico os dois por 10: 42 ÷ 8. Cabem 5 vezes (8 · 5 = 40) e sobram 2; 2 ÷ 8 = 0,25. Total: 5,25 MJ.\n'
              'Cada kg dá 42 MJ: gas = 5,25 ÷ 42. Como 5,25 = 42 ÷ 8, gas = (42 ÷ 8) ÷ 42 = 1 ÷ 8 = 0,125 kg (pois 8 · 0,125 = 1).')],
    volta='custo = 60 · 0,125 · 8. Primeiro 0,125 · 8 = 1 (pois 0,125 = 1 ÷ 8); depois 60 · 1 = R$ 60,00.\nResposta: alternativa A.',
    valores=[('banhos', '60'), ('preco', 'R$ 8,00 por kg'), ('quente', '20 L'), ('util', '4,2 MJ'), ('gas', '0,125 kg')],
    pista='"mistura" e "rendimento do aquecedor" → ache quantos litros passam pelo aquecedor (pela mistura), depois calor útil, divida pelo rendimento e passe a kg e a reais.',
    rec1='50 L a 40 °C; 20 e 70 °C; rendimento 0,8; 42 MJ/kg; R$ 8 por kg; 60 banhos', rec3='banhos = 60; preco = 8; quente = 20; util = 4,2; gas = 0,125',
    checagem=('Quanto calor pedem 2 kg de água para ir de 20 °C a 30 °C? (c = 4,2 kJ/(kg · °C))', ['84 kJ', '42 kJ', '8,4 kJ', '840 kJ'], '84 kJ', '2 · 4,2 · 10 = 84 kJ.'),
    ancora=('parcial · Fuvest 2022 q.50 (mistura de líquido quente e frio com c e densidade iguais) e ENEM 2022 q.116 caderno 7 (ducha: vazão, calor, '
            'unidades misturadas e tabela); aqui a mistura define qual parte da água passa pelo aquecedor'),
    canal='fis-06-calorimetria.txt [5:42:30] (Q = m · c · ΔT); rendimento e custo do gás: fora do canal',
    antes=['ter-calor-especifico', 'ter-mistura-equacao', 'ter-rendimento', 'porcentagem', 'dividir-por-decimal'],
))

# ============ b) ITA: reta p-V (mesma isoterma), volume constante e energia interna ============
UNID = 100                       # 10^5 Pa · 1 L = 100 J
PA, VA = Fr(3), Fr(1)            # 10^5 Pa e L
PB = PA / 3
VB = PA * VA / PB                # mesma temperatura: p · V igual
PC, VC = PA, VB                  # C: pressão de A, volume de B
assert (PB, VB, PC, VC) == (1, 3, 3, 3) and PA * VA == PB * VB
TRAB = (PA + PB) / 2 * (VB - VA) * UNID                                      # trapézio de A a B; B a C não tem trabalho (volume constante)
assert TRAB == 400 and (PA * VA * UNID, PC * VC * UNID) == (300, 900)
U_A, U_C = Fr(3, 2) * PA * VA * UNID, Fr(3, 2) * PC * VC * UNID
assert (U_A, U_C) == (450, 1350)
AUMENTO = U_C - U_A
assert AUMENTO == 900 and Fr(3, 2) * (900 - 300) == 900
CALOR = TRAB + AUMENTO
assert CALOR == 1300
# erros típicos
assert TRAB == 400                                                            # só o trabalho (esqueceu a energia interna)
assert PA * (VB - VA) * UNID + AUMENTO == 1500                               # p inicial como constante: 600 + 900
assert TRAB + U_C == 1750                                                     # energia final inteira em vez da variação
Q.append(dict(
    id='d2-escada-fis-ita-ter-00b', materia='Física', tema=T, calc=1300,
    enunciado=('Um gás ideal monoatômico passa do estado A ao estado C em dois trechos. No primeiro, vai de A a B por uma reta no diagrama pressão × volume; '
               'no segundo, vai de B a C com o volume constante. Em A, a pressão é 3,0 × 10⁵ Pa e o volume é 1,0 L. Em B, o gás tem a mesma temperatura que tinha em A, '
               'e a pressão é um terço da pressão de A. Em C, a pressão volta a ser igual à de A. A energia interna desse gás vale U = (3/2) · n · R · T. '
               'Considere 1 L = 10⁻³ m³. O calor líquido recebido pelo gás de A até C, em joules, é:'),
    dados=[('Estado A', '3,0 × 10⁵ Pa e 1,0 L'), ('Estado B', 'mesma temperatura de A; pressão = 1/3 da de A'), ('A até B', 'reta no diagrama p × V'),
           ('B até C', 'volume constante; em C a pressão é a de A'), ('Energia interna', 'U = (3/2) · n · R · T'), ('Conversão', '1 L = 10⁻³ m³')],
    alts=[('400', 400, 'Deu só o trabalho do trapézio e esqueceu o aumento da energia interna'),
          ('900', 900, 'Deu só o aumento da energia interna e esqueceu o trabalho'),
          ('1 300', 1300, 'OK'),
          ('1 500', 1500, 'Usou a pressão inicial como constante no trabalho: 600 J, em vez da área do trapézio'),
          ('1 750', 1750, 'Somou a energia interna final inteira (1 350 J), em vez da variação (900 J)')],
    resumo='B: 3 · 1 = 1 · V, V = 3 L. Trabalho de A a B = trapézio = (3 + 1) ÷ 2 · 2 · 100 = 400 J; de B a C, 0. Energia interna: U de A = 450 J e U de C = 1 350 J, aumento 900 J. Calor = 400 + 900 = 1 300 J.',
    ideia='Mesma temperatura é o mesmo p · V: dá o volume de B. De B a C não há trabalho, e a energia interna só depende de p · V. O calor é o trabalho (área) mais o aumento da energia interna de A a C.',
    pecas=[('Calor líquido', 'Calor que entrou menos o que saiu, do começo ao fim. Pela 1ª lei, é o trabalho mais a variação da energia interna.'),
           ('Monoatômico', 'Gás de átomos soltos; nele a energia interna é (3/2) · p · V.')],
    formulas=[('termometro', '1ª lei', 'calor = trabalho + ΔU'), ('grafico', 'Mesma temperatura', 'p · V igual nos dois estados'),
              ('grafico', 'Trabalho = área', '(p1 + p2) ÷ 2 · ΔV'), ('termometro', 'Energia do gás', 'U = (3/2) · p · V')],
    desenho=('Estado A: 3 · 10⁵ Pa e 1 L. De A a B, uma reta; de B a C, o volume não muda.', 'diagrama-pv-trapezio', []),
    eq='calor = trab + aumento', leitura='calor líquido = trabalho + aumento da energia interna de A até C',
    letras=[('calor', 'calor líquido recebido de A até C, em J (o que a questão quer)'), ('trab', 'trabalho do gás de A até C, em J'),
            ('aumento', 'aumento da energia interna de A até C, em J'), ('volB', 'volume do estado B, em L')],
    eq_texto='O calor líquido é o trabalho mais o aumento da energia interna.\nAgora é só achar volB, trab e aumento.',
    achando=[('Achando volB: o volume de B',
              'Mesma temperatura: p · V igual (n e R não mudam). Em A: 3 · 1 = 3 (em 10⁵ Pa · L).\nEm B a pressão é 3 ÷ 3 = 1. Então 1 · volB = 3 e volB = 3 L.\nEm C o volume é o mesmo de B: 3 L.'),
             ('Achando trab: o trabalho como área',
              'De B a C o volume não muda: ΔV = 0 e não há trabalho. Só conta de A a B.\nA área sob a reta é um trapézio: (3 + 1) ÷ 2 = 2 (×10⁵ Pa) e largura 3 − 1 = 2 L = 2 × 10⁻³ m³.\n'
              'trab = 2 × 10⁵ · 2 × 10⁻³. Números: 2 · 2 = 4. Potências: 10⁵ · 10⁻³ = 100 000 · 0,001 = 100. Então 4 · 100 = 400 J.',
              {'tipo': 'diagrama', 'nome': 'diagrama-pv-trapezio', 'rotulos': ['', '', '', '', '', '3', 'área = trabalho', '400 J']}),
             ('Achando aumento: a energia interna',
              'Gás monoatômico: U = (3/2) · n · R · T, e n · R · T = p · V. Então U = (3/2) · p · V.\n'
              'Em A: p · V = 3 × 10⁵ · 1 × 10⁻³ = 3 · 100 = 300 J. U = 300 ÷ 2 · 3 = 150 · 3 = 450 J.\n'
              'Em C: p · V = 3 × 10⁵ · 3 × 10⁻³ = 9 · 100 = 900 J. U = 900 ÷ 2 · 3 = 450 · 3 = 1 350 J.\naumento = 1 350 − 450 = 900 J.')],
    volta='calor = trab + aumento = 400 + 900 = 1 300 J.\nResposta: alternativa A. Conferindo: aumento também = (3/2) · (900 − 300) = 3/2 · 600 = 900 J.',
    valores=[('volB', '3 L'), ('trab', '400 J'), ('aumento', '900 J')],
    pista='"mesma temperatura" entre dois estados → p · V igual (acha o volume que falta); volume constante não tem trabalho; a energia interna de um monoatômico é (3/2) · p · V.',
    rec1='A: 3 × 10⁵ Pa e 1 L; B: mesma temperatura e p = 1/3; C: p de A e V de B', rec3='volB = 3 L; trab = 400 J; aumento = 900 J',
    checagem=('Um gás vai de p · V = 8 a p · V = 8, com a mesma temperatura. Qual a variação da energia interna?', ['0', '8', '−8', '16'], '0', 'Mesma temperatura, mesma energia interna: variação 0.'),
    ancora=('parcial · ITA 2020 q.9 (p · V = n · R · T liga os estados sem precisar de n nem de R) e ITA 2021 q.6 '
            '(energia interna não muda quando a temperatura não muda)'),
    canal='fis-07-gases-e-leis-da-termodinamica.txt [6:15:31] (mesma isoterma, mesma temperatura)',
    antes=['ter-gas-ideal', 'ter-energia-do-gas', 'ter-area-trapezio', 'ter-potencias-multiplicar', 'fracoes'],
))

# ============ c) Fuvest: o gelo derrete todo? depois a resistência ============
M_G, T_G, M_A, T_A = 200, -10, 300, 30
CG, CA, LF, CAL = Fr(1, 2), 1, 80, 4
PEDE_GELO = M_G * CG * (0 - T_G)
CEDE_AGUA = M_A * CA * (T_A - 0)
assert (PEDE_GELO, CEDE_AGUA) == (1000, 9000)
SOBRA = CEDE_AGUA - PEDE_GELO
DERRETE = Fr(SOBRA, LF)
assert SOBRA == 8000 and DERRETE == 100 and SOBRA < M_G * LF                 # não derrete tudo
GELO_RESTA = M_G - DERRETE
AGUA_AGORA = M_A + DERRETE
assert (GELO_RESTA, AGUA_AGORA) == (100, 400)
# hipótese errada (tudo derrete e termina acima de 0): sai absurdo
T_HIP = Fr(M_A * T_A - PEDE_GELO - M_G * LF, M_G * CA + M_A * CA)
assert T_HIP == -16                                                           # abaixo de 0: hipótese falhou
FUNDIR = GELO_RESTA * LF
ESQUENTAR = (GELO_RESTA + AGUA_AGORA) * CA * 20
assert (FUNDIR, ESQUENTAR) == (8000, 10000)
JOULES = (FUNDIR + ESQUENTAR) * CAL
POT_UTIL = 900 * Fr(8, 10)
TEMPO = JOULES / POT_UTIL
assert (JOULES, POT_UTIL, TEMPO) == (72000, 720, 100) and 72 * 100 == 7200
# erros típicos
assert JOULES / 900 == 80                                                     # esqueceu o rendimento
assert JOULES / (900 / Fr(8, 10)) == 64                                       # dividiu a potência pelo rendimento
assert round(float((M_A + M_G) * CA * 20 * CAL / POT_UTIL)) == 56            # achou que tudo virou água a 0 °C
assert round(float((M_G * LF + (M_G + M_A) * 20) * CAL / POT_UTIL)) == 144   # fundiu os 200 g outra vez
ENUN_C = ('Num experimento, 200 g de gelo a −10 °C são colocados dentro de um recipiente isolado, de capacidade térmica desprezível, que contém 300 g de água a 30 °C. '
          'Espera-se o equilíbrio térmico. Em seguida, liga-se dentro do recipiente uma resistência elétrica de 900 W, da qual 80% da energia elétrica vira calor '
          'para o conteúdo (o resto se perde). A resistência fica ligada até que todo o conteúdo seja água líquida a 20 °C.\n\n'
          'Calor específico do gelo: 0,5 cal/(g · °C)\nCalor específico da água: 1,0 cal/(g · °C)\nCalor latente de fusão do gelo: 80 cal/g\nConversão: 1 cal = 4 J\n\n'
          'Quanto tempo, em segundos, a resistência fica ligada?')
Q.append(dict(
    id='d2-escada-fis-ita-ter-00c', materia='Física', tema=T, calc=100,
    enunciado=ENUN_C,
    dados=[('Gelo', '200 g a −10 °C'), ('Água', '300 g a 30 °C'), ('Resistência', '900 W, 80% vira calor'), ('Chegada', 'tudo água a 20 °C'),
           ('Calores', 'gelo 0,5; água 1,0; fusão 80 cal/g'), ('Conversão', '1 cal = 4 J')],
    alts=[('56', 55.5556, 'Achou que tudo já era água a 0 °C: só aquecer 500 g, 10 000 cal = 40 000 J ÷ 720'),
          ('64', 64, 'Dividiu a potência pelo rendimento (900 ÷ 0,8 = 1 125 W) em vez de multiplicar'),
          ('80', 80, 'Esqueceu o rendimento: 72 000 J ÷ 900 W'),
          ('100', 100, 'OK'),
          ('144', 144.4444, 'Fundiu os 200 g de gelo de novo, sem ver que 100 g já tinham derretido: 26 000 cal = 104 000 J ÷ 720')],
    resumo='Gelo pede 1 000 cal e a água cede 9 000: sobram 8 000 cal, derretem 100 g (sobram 100 g de gelo a 0 °C, com 400 g de água); depois 8 000 + 10 000 = 18 000 cal = 72 000 J; 72 000 ÷ 720 = 100 s.',
    ideia='Antes de somar as etapas, teste se o calor da água derrete todo o gelo: não derrete, e o equilíbrio fica em 0 °C com gelo sobrando. Só então a resistência termina o serviço, com 80% da potência.',
    pecas=[('Equilíbrio a 0 °C', 'Se o calor não derrete todo o gelo, a mistura fica em 0 °C, com gelo e água juntos.'),
           ('Potência útil', 'A parte da potência que vira calor no conteúdo: 80% de 900 W. Watt é joule por segundo.')],
    formulas=[('termometro', 'Calor para esquentar', 'calor = massa · c · ΔT'), ('termometro', 'Calor para derreter', 'calor = massa · L'), ('carro', 'Tempo', 'tempo = energia ÷ potência')],
    eq='tempo = energia ÷ pot', leitura='tempo = energia que falta, em J ÷ potência útil, em W (joules por segundo)',
    letras=[('tempo', 'tempo com a resistência ligada, em s (o que a questão quer)'), ('energia', 'energia que a resistência ainda precisa dar, em J'),
            ('pot', 'potência que vira calor, em W'), ('sobra', 'calor que sobra da água para derreter gelo, em cal'), ('gelo', 'gelo que ainda sobra depois do equilíbrio, em g')],
    eq_texto='A resistência dá "pot" joules a cada segundo. Dividindo a energia que falta por isso, sai o tempo.\nAgora é só achar pot, sobra, gelo e energia.',
    achando=[('Achando pot: a potência útil', 'A resistência tem 900 W, mas só 80% vira calor: 80% = 0,8, e o útil é menor que o total, então multiplica.\npot = 900 · 0,8 = 720 W, ou seja, 720 J por segundo.'),
             ('Achando sobra: o calor que sobra',
              'Gelo até 0 °C pede: 200 · 0,5 · 10 = 1 000 cal.\nA água cede ao esfriar até 0 °C: 300 · 1 · 30 = 9 000 cal.\n'
              'Dá para chegar a 0 °C e ainda sobram 9 000 − 1 000 = 8 000 cal.'),
             ('Achando gelo: o gelo que sobra',
              'Derreter tudo pediria 200 · 80 = 16 000 cal, e só há 8 000: não derrete tudo, e a mistura fica em 0 °C.\n'
              'Derretem 8 000 ÷ 80 = 100 g. Sobram 200 − 100 = 100 g de gelo e 300 + 100 = 400 g de água.'),
             ('Achando energia: a energia que falta',
              'Fundir os 100 g de gelo: 100 · 80 = 8 000 cal.\nAquecer 500 g de água (400 + 100) de 0 °C a 20 °C: 500 · 1 · 20 = 10 000 cal.\n'
              'Soma: 18 000 cal. Em joules: 18 000 · 4 = 72 000 J.')],
    volta='tempo = 72 000 ÷ 720. Corto um zero de cada: 7 200 ÷ 72 = 100 s (pois 72 · 100 = 7 200).\nResposta: alternativa A.',
    valores=[('pot', '720 W'), ('sobra', '8 000 cal'), ('gelo', '100 g'), ('energia', '72 000 J')],
    pista='gelo e água quente juntos → antes de somar etapas, veja se o calor da água derrete todo o gelo; se não, a mistura fica em 0 °C. Rendimento: multiplique a potência.',
    rec1='gelo 200 g, água 300 g, 900 W com 80%, 1 cal = 4 J', rec3='pot = 720; sobra = 8 000; gelo = 100; energia = 72 000',
    checagem=('Quanto calor derrete 50 g de gelo a 0 °C? (L = 80 cal/g)', ['4 000 cal', '400 cal', '130 cal', '80 cal'], '4 000 cal', '50 · 80 = 4 000 cal.'),
    ancora=('forte · Fuvest 2024 2ª fase F01 item c (energia = c · ΔT + m · L, passando de cal a J) e IME 2025 q.8 '
            '(etapas de calor, potência e rendimento); aqui entra o teste de "derrete tudo?"'),
    canal='fis-06-calorimetria.txt [5:44:31] (calor latente, Q = m · L)',
    antes=['ter-calor-especifico', 'ter-mudanca-de-fase', 'ter-rendimento', 'ter-watt-e-tempo'],
))

# ============ d) Harvard-MIT: escada infinita de barras ============
K, AREA, L_H, L_V = 200, Fr(1, 10000), Fr(1, 2), 1
R_H = L_H / (K * AREA)
R_V = L_V / (K * AREA)
assert K * AREA == Fr(2, 100) and (R_H, R_V) == (25, 50)
Z = Fr(50)
assert Z == R_H + (R_V * Z) / (R_V + Z)                                       # a rede que sobra é igual ao todo
# passos da álgebra: z · (50 + z) = 25 · (50 + z) + 50 · z  ->  z · z − 25 · z − 1 250 = 0
assert Z * (50 + Z) == 25 * (50 + Z) + 50 * Z and 25 * 50 == 1250 and 25 * (50 + Z) + 50 * Z == 1250 + 25 * Z + 50 * Z
assert (Z - 50) * (Z + 25) == Z * Z - 25 * Z - 1250 == 0
PARALELO = R_V * Z / (R_V + Z)
FRACAO = PARALELO / (R_H + PARALELO)
assert (PARALELO, FRACAO) == (25, Fr(1, 2))
TEMPS = [100 * FRACAO ** n for n in (1, 2, 3)]
assert TEMPS == [50, 25, Fr(25, 2)]
FLUXO_3 = TEMPS[2] / R_V
assert FLUXO_3 == Fr(1, 4)
# conferência: fluxos das verticais somam o fluxo da fonte (1 + 1/2 + 1/4 + ... = 2)
assert abs(sum(float(100 * FRACAO ** n / R_V) for n in range(1, 60)) - float(100 / Z)) < 1e-12 and 100 / Z == 2
assert Fr(1) + Fr(1, 2) + Fr(1, 4) == Fr(7, 4)
# erros típicos
assert TEMPS[1] / R_V == Fr(1, 2)                                             # 2º nó no lugar do 3º
assert 100 / Z == 2                                                           # fluxo total da fonte
assert float(TEMPS[2] / (L_V / (K * 1))) == 2500                              # 1 cm² usado como 1 m²
Q.append(dict(
    id='d2-escada-fis-ita-ter-00d', materia='Física', tema=T, calc=0.25,
    enunciado=('Uma escada de barras, todas do mesmo material (k = 200 W/(m · K)) e todas com seção de 1,0 cm², é montada assim: uma barra horizontal de 0,50 m liga a fonte quente, '
               'mantida a 100 °C, ao 1º nó. Do 1º nó saem duas barras: uma vertical de 1,0 m, que vai até o reservatório frio, mantido a 0 °C, e outra horizontal de 0,50 m, '
               'que leva ao 2º nó. O 2º nó tem a mesma montagem do 1º (vertical de 1,0 m para o frio e horizontal de 0,50 m para o 3º nó), e o padrão se repete sem fim. '
               'O calor flui só ao longo das barras, em regime estável. Qual é, em watts, o fluxo de calor que passa pela barra vertical do 3º nó?'),
    dados=[('Material e seção', 'k = 200 W/(m · K); 1,0 cm²'), ('Barras horizontais', '0,50 m cada'), ('Barras verticais', '1,0 m cada, até o frio'),
           ('Fonte quente', '100 °C'), ('Reservatório frio', '0 °C'), ('Nós', 'o padrão se repete sem fim')],
    alts=[('0,25', 0.25, 'OK'),
          ('0,5', 0.5, 'Contou o 2º nó como se fosse o 3º: 25 ÷ 50'),
          ('2,0', 2.0, 'Deu o fluxo total que sai da fonte (100 ÷ 50), não o da vertical do 3º nó'),
          ('12,5', 12.5, 'Deu a temperatura do 3º nó, em °C, sem dividir pela resistência'),
          ('2 500', 2500, 'Usou 1 cm² como se fosse 1 m²: todas as resistências saem 10 000 vezes menores')],
    resumo='rhor = 0,5 ÷ (200 · 10⁻⁴) = 25 K/W; rvert = 50; a rede toda: rede = 25 + 50 · rede ÷ (50 + rede), rede = 50; cada nó fica com 1/2 da temperatura: 12,5 °C no 3º; 12,5 ÷ 50 = 0,25 W.',
    ideia='Depois do 1º nó, o que resta é uma escada igual à inteira: a mesma resistência. Isso dá uma equação para ela. Com ela, cada nó fica com metade da temperatura do anterior.',
    pecas=[('Escada igual ao todo', 'Tirando o 1º degrau de uma escada sem fim, sobra uma escada igual: o resto tem a mesma resistência do todo.'),
           ('Resistência térmica', 'Quanto a barra dificulta a passagem do calor: comprimento ÷ (k · seção).')],
    formulas=[('termometro', 'Resistência da barra', 'R = L ÷ (k · S)'), ('termometro', 'Fluxo', 'fluxo = diferença de temperatura ÷ R'), ('grafico', 'Série', 'R total = R1 + R2'),
              ('grafico', 'Paralelo', 'R total = R1 · R2 ÷ (R1 + R2)')],
    eq='fluxo = temp3 ÷ rvert', leitura='fluxo na vertical do 3º nó = temperatura do 3º nó ÷ resistência da vertical',
    letras=[('fluxo', 'fluxo de calor na barra vertical do 3º nó, em W (o que a questão quer)'), ('temp3', 'temperatura do 3º nó, em °C'), ('rvert', 'resistência de uma barra vertical, em K/W'),
            ('rhor', 'resistência de uma barra horizontal, em K/W'), ('rede', 'resistência da escada toda, vista da fonte, em K/W'), ('frac', 'fração da temperatura que fica de um nó para o seguinte')],
    eq_texto='A vertical do 3º nó liga o nó (temperatura temp3) ao frio (0 °C), então o fluxo é temp3 dividido pela resistência rvert.\nAgora é só achar rhor, rvert, rede, frac e temp3.',
    achando=[('Achando rhor: a barra horizontal', '1 cm² = 10⁻⁴ m² = 0,0001 m². k · S = 200 · 0,0001 = 0,02.\nrhor = 0,5 ÷ 0,02. Multiplico os dois por 100: 50 ÷ 2 = 25 K/W.',
              {'tipo': 'diagrama', 'nome': 'escada-de-barras', 'rotulos': []}),
             ('Achando rvert: a barra vertical', 'A vertical tem 1,0 m, o dobro da horizontal, com o mesmo k e a mesma seção.\nrvert = 1,0 ÷ 0,02. Multiplico os dois por 100: 100 ÷ 2 = 50 K/W, o dobro de rhor.'),
             ('Achando rede: a escada toda',
              'Depois do 1º nó a escada é igual à inteira: resistência rede. No 1º nó, rvert (50) e rede ficam em paralelo, e rhor (25) vem em série antes deles.\n'
              'Paralelo: 50 · rede ÷ (50 + rede). Série: rede = 25 + 50 · rede ÷ (50 + rede).\n'
              'Multiplico os dois lados por (50 + rede): rede · (50 + rede) = 25 · (50 + rede) + 50 · rede.\n'
              'Abro os parênteses: 50 · rede + rede · rede = 1 250 + 25 · rede + 50 · rede.\n'
              'Tiro 50 · rede dos dois lados: rede · rede = 1 250 + 25 · rede. Passo 25 · rede para o outro lado: rede · rede − 25 · rede − 1 250 = 0.\n'
              '1 250 = 50 · 25. Produto negativo: um dos números é negativo. Soma −25: o maior leva o sinal −. São −50 e +25.\n'
              '(rede − 50) · (rede + 25) = 0. Resistência não é negativa: rede = 50 K/W. Teste: 25 + 50 · 50 ÷ 100 = 25 + 25 = 50.'),
             ('Achando frac: a fração de cada nó',
              'No 1º nó, rvert = 50 e a rede = 50 estão em paralelo: 50 · 50 ÷ 100 = 25 K/W. Em série com rhor = 25, o total é 50.\n'
              'A queda de temperatura é proporcional à resistência: rhor tem 25 de 50, a metade, e o nó fica com a outra metade. frac = 25 ÷ 50 = 1/2.\n'
              'Do 2º nó para a frente a escada é a mesma, então o 2º nó divide a temperatura do 1º do mesmo jeito.'),
             ('Achando temp3: a temperatura do 3º nó', '1º nó: 100 · 1/2 = 50 °C. 2º nó: 50 · 1/2 = 25 °C. 3º nó: 25 · 1/2 = 12,5 °C.\ntemp3 = 12,5 °C.',
              {'tipo': 'diagrama', 'nome': 'escada-de-barras', 'rotulos': ['', '', '', '', '50 °C', '25 °C', '12,5 °C', '']})],
    volta='fluxo = 12,5 ÷ 50. Multiplico os dois por 2: 25 ÷ 100 = 0,25 W.\nResposta: alternativa A. Conferindo: as verticais dão 1 W, 0,5 W e 0,25 W (1 + 0,5 + 0,25 = 1,75), e as próximas chegam perto de 2 W, que é 100 ÷ 50, o fluxo da fonte.',
    valores=[('rhor', '25 K/W'), ('rvert', '50 K/W'), ('rede', '50 K/W'), ('frac', '1/2'), ('temp3', '12,5 °C')],
    pista='"escada que se repete sem fim" → o que sobra depois do 1º degrau é igual ao todo: escreva a equação da resistência e resolva; cada nó fica com a mesma fração.',
    rec1='k = 200; 1 cm²; horizontal 0,5 m; vertical 1,0 m; 100 °C e 0 °C', rec3='rhor = 25; rvert = 50; rede = 50; frac = 1/2; temp3 = 12,5',
    checagem=('Duas barras iguais de 40 K/W estão ligadas entre os mesmos dois pontos (paralelo). Qual a resistência?', ['20 K/W', '80 K/W', '40 K/W', '10 K/W'], '20 K/W',
              'Produto ÷ soma: 40 · 40 = 1 600 e 40 + 40 = 80. 1 600 ÷ 80 = 20 K/W, a metade.'),
    ancora=('sem · técnica: auto-semelhança de rede infinita (o que sobra é igual ao todo, ideia de invariante dos problemas de Harvard-MIT) '
            'mais analogia entre calor e corrente; não há prova de Física de Harvard-MIT no corpus'),
    canal='fis-06-calorimetria.txt [5:19:32] (lei de Fourier: fluxo, k, área, ΔT e espessura); a escada infinita fica fora do canal',
    antes=['ter-resistencia-termica', 'ter-paralelo-desigual', 'ter-produto-zero', 'potencia-de-dez', 'fracoes'],
))

for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
    assert all(len(l) <= 10 for l, _ in _q['letras']), _q['id']
    assert not {l for l, _ in _q['letras']} & set('ABCDE'), _q['id']
    assert all(len(a[1]) <= 900 for a in _q['achando']), _q['id']
