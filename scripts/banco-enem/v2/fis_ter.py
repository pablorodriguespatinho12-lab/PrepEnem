"""Nível acima v2 de Física: Termodinâmica e Calor (23/11/2026).

a = ENEM (banheira: mistura, rendimento e custo do gás), b = ITA (reta p-V entre dois pontos da mesma isoterma),
c = Fuvest (o gelo derrete todo? depois a resistência com 80%), d = Harvard-MIT (escada infinita de barras, âncora por técnica).
As 4 antigas saem (a, b, c REESCREVER; d TROCAR). Conferido por assert no próprio módulo.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_ter
"""
from fractions import Fraction as Fr

ARQUIVO = 'fisica-acima-novas.json'
T = 'Termodinâmica e Calor'

Q = []
MANTER = {}


def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


# ============ Aulas "Antes" novas (calor específico, mudança de fase, gás ideal, resistência térmica, produto zero) ============
ANTES_NOVOS = {
    'calor-especifico': {
        'titulo': 'Calor para esquentar: Q = m · c · ΔT',
        'linhas': [
            'Calor (Q) é energia que passa do corpo quente para o frio. Medimos em cal ou em J (1 cal = 4 J, perto de 4,2).',
            'Calor específico (c): quanto calor 1 g do material pede para subir 1 °C. A água pede 1 cal por g por °C.',
            'Q = m · c · ΔT. 200 g de água de 20 °C a 50 °C: ΔT = 30, então Q = 200 · 1 · 30 = 6 000 cal.',
            'Em kJ: a água pede 4,2 kJ por kg por °C. 1 L de água tem 1 kg. 1 MJ = 1 000 kJ.',
            'Dois corpos isolados trocam calor até a mesma temperatura: o calor que um cede é o que o outro recebe.',
        ],
        'visual': tabela('Calor para esquentar a água', ['Massa', 'ΔT', 'Calor'], [['100 g', '10 °C', '100 · 1 · 10 = 1 000 cal'], ['2 kg', '5 °C', '2 · 4,2 · 5 = 42 kJ']]),
        'exercicios': [
            {'enunciado': 'Quanto calor pedem 500 g de água para ir de 20 °C a 60 °C? (c = 1 cal/(g · °C))', 'alternativas': ['20 000 cal', '500 cal', '40 cal', '10 000 cal'], 'certa': 0,
             'resolucao': '20 000 cal: ΔT = 60 − 20 = 40 e Q = 500 · 1 · 40 = 20 000 cal.\n500 cal esquece o ΔT; 40 cal é só o ΔT; 10 000 cal usa ΔT = 20.'},
            {'enunciado': 'Misturam-se 1 kg de água a 80 °C e 1 kg de água a 20 °C, sem perda. Qual a temperatura final?', 'alternativas': ['50 °C', '100 °C', '60 °C', '40 °C'], 'certa': 0,
             'resolucao': '50 °C: a quente perde 80 − T e a fria ganha T − 20. 80 − T = T − 20, então 2 · T = 100 e T = 50.\n100 °C soma as duas; 60 °C e 40 °C não equilibram.'},
        ],
    },
    'mudanca-de-fase': {
        'titulo': 'Gelo derretendo: calor latente',
        'linhas': [
            'Gelo a 0 °C derrete sem esquentar: o calor entra e a temperatura fica parada em 0 °C até acabar o gelo.',
            'Calor latente (L): calor para mudar 1 g de fase. Fusão do gelo: L = 80 cal por g.',
            'Q = m · L. Derreter 50 g de gelo a 0 °C: Q = 50 · 80 = 4 000 cal.',
            'Gelo abaixo de 0 °C primeiro esquenta até 0 °C (c do gelo = 0,5 cal por g por °C), depois derrete, depois a água esquenta.',
            'Cada etapa é uma conta separada. Se o calor não basta para derreter tudo, a mistura fica em 0 °C com gelo sobrando.',
        ],
        'visual': tabela('Etapas de 10 g de gelo a −10 °C até água a 20 °C', ['Etapa', 'Conta', 'Calor'], [['Gelo a 0 °C', '10 · 0,5 · 10', '50 cal'], ['Derreter', '10 · 80', '800 cal'], ['Água a 20 °C', '10 · 1 · 20', '200 cal']]),
        'exercicios': [
            {'enunciado': 'Quanto calor derrete 100 g de gelo a 0 °C? (L = 80 cal/g)', 'alternativas': ['8 000 cal', '800 cal', '180 cal', '80 cal'], 'certa': 0,
             'resolucao': '8 000 cal: Q = 100 · 80 = 8 000 cal.\n800 cal perde um zero; 180 cal soma 100 + 80; 80 cal é só o L.'},
            {'enunciado': '10 g de gelo a −10 °C vão a 0 °C. Quanto calor? (c do gelo = 0,5 cal/(g · °C))', 'alternativas': ['50 cal', '100 cal', '5 cal', '800 cal'], 'certa': 0,
             'resolucao': '50 cal: Q = 10 · 0,5 · 10 = 50 cal.\n100 cal esquece o 0,5; 5 cal esquece a massa; 800 cal é o calor de derreter.'},
        ],
    },
    'gas-ideal': {
        'titulo': 'Gás ideal: p · V, temperatura e trabalho',
        'linhas': [
            'Num gás ideal, pressão (p), volume (V) e temperatura (T, em kelvin) se ligam por p · V = n · R · T.',
            'n e R não mudam. Se a temperatura não muda, p · V fica igual: a pressão dobra quando o volume cai à metade.',
            'A energia interna só depende da temperatura. Mesma temperatura, mesma energia: ΔU = 0.',
            'Trabalho do gás com pressão constante: W = p · ΔV. Se a linha no gráfico p × V é reta, use a pressão média.',
            '1ª lei: calor recebido Q = trabalho W + variação de energia interna ΔU. Com 1 L = 10⁻³ m³ e p em Pa, W sai em J.',
        ],
        'visual': tabela('Trabalho a pressão constante', ['p', 'ΔV', 'W = p · ΔV'], [['2 × 10⁵ Pa', '3 L = 3 × 10⁻³ m³', '600 J'], ['1 × 10⁵ Pa', '2 L = 2 × 10⁻³ m³', '200 J']]),
        'exercicios': [
            {'enunciado': 'Um gás tem p = 4 e V = 2 (unidades de aula). A temperatura não muda e o volume vai a 8. Qual a nova pressão?', 'alternativas': ['1', '4', '16', '0,5'], 'certa': 0,
             'resolucao': '1: p · V = 4 · 2 = 8 fica igual, e 8 ÷ 8 = 1.\n4 não muda a pressão; 16 multiplica por 4; 0,5 divide por 16.'},
            {'enunciado': 'Pressão constante de 2 × 10⁵ Pa, volume de 1 L a 4 L. Qual o trabalho do gás? (1 L = 10⁻³ m³)', 'alternativas': ['600 J', '800 J', '200 J', '600 000 J'], 'certa': 0,
             'resolucao': '600 J: ΔV = 4 − 1 = 3 L = 3 × 10⁻³ m³ e W = 2 × 10⁵ · 3 × 10⁻³ = 600 J.\n800 J usa 4 L; 200 J usa 1 L; 600 000 J esquece a conversão.'},
        ],
    },
    'resistencia-termica': {
        'titulo': 'Barra que conduz calor: resistência térmica',
        'linhas': [
            'O calor passa por uma barra de um ponto quente para um frio. Fluxo (W) = diferença de temperatura ÷ resistência R.',
            'Resistência da barra: R = L ÷ (k · S). L comprimento (m), S seção (m²), k condutividade (W/(m · K)). 1 cm² = 10⁻⁴ m².',
            'Exemplo: k = 100, L = 1 m, S = 1 cm². R = 1 ÷ (100 · 10⁻⁴) = 1 ÷ 0,01 = 100 K/W.',
            'Barras em fila (série): o mesmo fluxo passa por todas e as resistências somam. A queda de temperatura numa barra = fluxo · R.',
            'Duas barras iguais ligadas aos mesmos dois pontos (paralelo): a resistência vira a metade.',
        ],
        'visual': tabela('Resistências', ['Montagem', 'Conta', 'Resultado'], [['1 barra', 'L ÷ (k · S)', '100 K/W'], ['2 em série', '100 + 100', '200 K/W'], ['2 em paralelo', '100 ÷ 2', '50 K/W']]),
        'exercicios': [
            {'enunciado': 'Barra de 2 m, seção de 1 cm² e k = 100 W/(m · K). Qual a resistência?', 'alternativas': ['200 K/W', '0,005 K/W', '100 K/W', '20 K/W'], 'certa': 0,
             'resolucao': '200 K/W: 1 cm² = 10⁻⁴ m², k · S = 0,01 e R = 2 ÷ 0,01 = 200.\n0,005 inverte a conta; 100 usa L = 1; 20 erra a seção.'},
            {'enunciado': 'Duas barras de 40 K/W em série, com 100 °C de diferença entre as pontas. Qual o fluxo?', 'alternativas': ['1,25 W', '2,5 W', '5 W', '0,8 W'], 'certa': 0,
             'resolucao': '1,25 W: R = 40 + 40 = 80 e fluxo = 100 ÷ 80 = 1,25 W.\n2,5 W usa só uma barra; 5 W usa o paralelo; 0,8 W inverte a divisão.'},
        ],
    },
    'produto-zero': {
        'titulo': 'Produto zero: achar a raiz de x · x − x − 6',
        'linhas': [
            'Se um produto dá zero, um dos fatores é zero. (x − 3) · (x + 2) = 0 vale se x = 3 ou x = −2.',
            'Abrindo: (x − 3) · (x + 2) = x · x + 2x − 3x − 6 = x · x − x − 6.',
            'Então x · x − x − 6 = 0 tem raízes 3 e −2. Procure dois números que somam −1 (o número de x) e multiplicam −6.',
            'Os dois números são −3 e +2, e os fatores são (x − 3) e (x + 2).',
            'Se a grandeza não pode ser negativa (resistência, tempo), fica só a raiz positiva.',
        ],
        'visual': tabela('Achar os fatores', ['Equação', 'Soma e produto', 'Fatores'], [['x · x − x − 6 = 0', '−3 + 2 = −1 e −3 · 2 = −6', '(x − 3) · (x + 2)']]),
        'exercicios': [
            {'enunciado': 'Quais as raízes de x · x − 2x − 15 = 0?', 'alternativas': ['5 e −3', '−5 e 3', '5 e 3', '−5 e −3'], 'certa': 0,
             'resolucao': '5 e −3: −5 + 3 = −2 e −5 · 3 = −15, então (x − 5) · (x + 3) = 0.\n−5 e 3 troca os sinais; 5 e 3 e −5 e −3 erram a soma ou o produto.'},
            {'enunciado': 'A resistência R não é negativa e R · R − 4R − 12 = 0. Quanto vale R?', 'alternativas': ['6', '2', '12', '4'], 'certa': 0,
             'resolucao': '6: −6 + 2 = −4 e −6 · 2 = −12, então (R − 6) · (R + 2) = 0; R = 6 (−2 não serve).\n2 é a raiz negativa trocada; 12 e 4 são só números da equação.'},
        ],
    },
}
for _id, _c in ANTES_NOVOS.items():
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    for _e in _c['exercicios']:
        assert _e['alternativas'][_e['certa']].split(' ')[0] in _e['resolucao'].split('\n')[0], (_id, _e['enunciado'])
# confere as contas das aulas
assert 200 * 1 * 30 == 6000 and 500 * 40 == 20000 and 80 - 50 == 50 - 20
assert 50 * 80 == 4000 and 100 * 80 == 8000 and 10 * Fr(1, 2) * 10 == 50
assert 4 * 2 // 8 == 1 and Fr(2e5) * Fr(3, 1000) == 600
assert Fr(2) / (100 * Fr(1, 10000)) == 200 and Fr(100, 80) == Fr(5, 4)
assert (-5 + 3, -5 * 3) == (-2, -15) and (-6 + 2, -6 * 2) == (-4, -12) and (-3 + 2, -3 * 2) == (-1, -6)

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


X = Fr(30 * 0 + (V_BANHEIRA * (T_BANHO - T_FRIA)), (T_QUENTE - T_FRIA))      # x · 30 = (50 − x) · 20  ->  x = 50 · 20 ÷ 50
assert X == 20 and X * (T_QUENTE - T_BANHO) == (V_BANHEIRA - X) * (T_BANHO - T_FRIA)
assert X * C_AGUA * 50 == 4200                                                # kJ
CALOR_MJ = Fr(4200, 1000)
GAS_ENERGIA = CALOR_MJ / RENDIM
assert (CALOR_MJ, GAS_ENERGIA, GAS_ENERGIA / PODER, PRECO_KG) == (Fr(21, 5), Fr(21, 4), Fr(1, 8), 8)
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
    resumo='Mistura: 30 · x = 20 · (50 − x), x = 20 L quentes; Q = 20 · 4,2 · 50 = 4 200 kJ = 4,2 MJ; gás: 4,2 ÷ 0,8 = 5,25 MJ = 0,125 kg; 0,125 · R$ 8 · 60 banhos = R$ 60,00.',
    ideia='O aquecedor só esquenta a parte quente da banheira; a mistura diz quantos litros são. Depois o calor vira massa de gás (com o rendimento) e a massa vira reais.',
    pecas=[('Rendimento', 'Fração da energia do gás que chega à água. Se 20% se perde, chega 80%, ou 0,8.'),
           ('Poder calorífico', 'Energia que 1 kg de gás entrega ao queimar (aqui, em MJ por kg).')],
    formulas=[('termometro', 'Calor para esquentar', 'Q = m · c · ΔT'), ('termometro', 'Mistura', 'calor cedido = calor recebido'),
              ('porcentagem', 'Rendimento', 'energia do gás = calor útil ÷ 0,8')],
    eq='R = N · m · p', leitura='custo do mês = nº de banhos · kg de gás por banho · preço de 1 kg',
    letras=[('R', 'custo de gás no mês, em reais (o que a questão quer)'), ('N', 'número de banhos no mês'), ('m', 'kg de gás gastos em 1 banho'),
            ('p', 'preço de 1 kg de gás, em reais'), ('Q', 'calor útil que a água quente recebe, em MJ'), ('x', 'litros de água quente em cada banho')],
    eq_texto='Cada banho gasta m kg de gás, e cada kg custa p reais. Multiplicando pelos N banhos, sai o custo do mês.\nAgora é só achar N, p, x, Q e m.',
    achando=[('Achando N: os banhos do mês', '2 banhos por dia em 30 dias: N = 2 · 30 = 60 banhos.'),
             ('Achando p: o preço de 1 kg', 'O botijão tem 13 kg e custa R$ 104,00.\np = 104 ÷ 13 = R$ 8,00 por kg.'),
             ('Achando x: os litros quentes',
              'A quente esfria de 70 °C a 40 °C: 70 − 40 = 30 graus. A fria esquenta de 20 °C a 40 °C: 20 graus, e são 50 − x litros.\n'
              'Calor cedido = recebido, e o c corta: 30 · x = 20 · (50 − x) = 1 000 − 20 · x.\n30 · x + 20 · x = 1 000, então 50 · x = 1 000 e x = 20 L.'),
             ('Achando Q: o calor útil',
              'Só os 20 L (20 kg) passam pelo aquecedor, de 20 °C a 70 °C: ΔT = 50.\nQ = 20 · 4,2 · 50 = 84 · 50 = 4 200 kJ.\n1 MJ = 1 000 kJ, então Q = 4,2 MJ.'),
             ('Achando m: o gás de um banho',
              'Perde 20%, chega 100% − 20% = 80% = 0,8. Energia do gás = 4,2 ÷ 0,8 = 42 ÷ 8 = 5,25 MJ.\nCada kg dá 42 MJ: m = 5,25 ÷ 42 = 0,125 kg (pois 42 · 0,125 = 5,25).')],
    volta='R = 60 · 0,125 · 8. Primeiro 0,125 · 8 = 1 real por banho; depois 60 · 1 = R$ 60,00.\nResposta: alternativa X. Conferindo: 8 ÷ 8 = 1 e 60 · 1 = 60.',
    valores=[('N', '60 banhos'), ('p', 'R$ 8,00 por kg'), ('x', '20 L'), ('Q', '4,2 MJ'), ('m', '0,125 kg')],
    pista='"mistura" e "rendimento do aquecedor" → ache quantos litros passam pelo aquecedor (pela mistura), depois calor útil, divida pelo rendimento e passe a kg e a reais.',
    rec1='50 L a 40 °C; 20 e 70 °C; rendimento 0,8; 42 MJ/kg; R$ 8 por kg; 60 banhos', rec3='N = 60; p = 8; x = 20; Q = 4,2; m = 0,125',
    checagem=('Quanto calor pedem 2 kg de água para ir de 20 °C a 30 °C? (c = 4,2 kJ/(kg · °C))', ['84 kJ', '42 kJ', '8,4 kJ', '840 kJ'], '84 kJ', '2 · 4,2 · 10 = 84 kJ.'),
    ancora=('parcial · Fuvest 2022 q.50 (mistura de líquido quente e frio com c e densidade iguais) e ENEM 2022 q.116 caderno 7 (ducha: vazão, calor, '
            'unidades misturadas e tabela); aqui a mistura define qual parte da água passa pelo aquecedor'),
    canal='fis-06-calorimetria.txt [5:42:30] (Q = m · c · ΔT); rendimento e custo do gás: fora do canal',
    antes=['calor-especifico', 'porcentagem', 'dividir-por-decimal'],
))

# ============ b) ITA: reta p-V entre dois pontos da mesma isoterma ============
PA, VA = Fr(3), Fr(1)            # 10^5 Pa e L
PB = PA / 3
VB = PA * VA / PB                # mesma temperatura: p · V igual
assert (PB, VB) == (1, 3) and PA * VA == PB * VB
UNID = 100                       # 10^5 Pa · 1 L = 100 J
W = (PA + PB) / 2 * (VB - VA) * UNID
assert W == 400
assert PA * (VB - VA) * UNID == 600 and PB * (VB - VA) * UNID == 200       # p inicial e p final como se fossem constantes
assert (PA + PB) * (VB - VA) * UNID == 800                                 # esqueceu o ½ do trapézio
assert W + Fr(3, 2) * W == 1000                                            # ΔU = 3/2 · p · ΔV com p médio
Q.append(dict(
    id='d2-escada-fis-ita-ter-00b', materia='Física', tema=T, calc=400,
    enunciado=('Um gás ideal monoatômico vai do estado A ao estado B por uma reta no diagrama pressão × volume. Em A, a pressão é 3,0 × 10⁵ Pa e o volume é 1,0 L. '
               'Em B, o gás tem a mesma temperatura que tinha em A, e a pressão é um terço da pressão de A. A energia interna desse gás vale U = (3/2) · n · R · T. '
               'Considere 1 L = 10⁻³ m³. O calor líquido recebido pelo gás de A até B, em joules, é:'),
    dados=[('Estado A', '3,0 × 10⁵ Pa e 1,0 L'), ('Estado B', 'mesma temperatura de A; pressão = 1/3 da de A'), ('Caminho', 'reta no diagrama p × V'),
           ('Energia interna', 'U = (3/2) · n · R · T'), ('Conversão', '1 L = 10⁻³ m³')],
    alts=[('200', 200, 'Contou só o triângulo de cima do trapézio, ou usou a pressão final: 1 × 10⁵ · 2 × 10⁻³'),
          ('400', 400, 'OK'),
          ('600', 600, 'Usou a pressão inicial como se fosse constante: 3 × 10⁵ · 2 × 10⁻³'),
          ('800', 800, 'Esqueceu de dividir por 2 na área do trapézio: (3 + 1) × 10⁵ · 2 × 10⁻³'),
          ('1 000', 1000, 'Somou ΔU = (3/2) · 400 = 600 J ao trabalho, esquecendo que a temperatura não mudou')],
    resumo='p · V igual: 3 · 1 = 1 · V, V = 3 L; U = 0 (mesma temperatura); W = área do trapézio = (3 + 1) ÷ 2 · 10⁵ · 2 · 10⁻³ = 400 J; Q = 400 + 0 = 400 J.',
    ideia='Mesma temperatura é o mesmo p · V, e dá o volume de B e a energia interna que não mudou. Sobra só o trabalho, a área sob a reta, e o calor líquido é igual a ele.',
    pecas=[('Calor líquido', 'Calor que entrou menos o que saiu, do começo ao fim. Pela 1ª lei, é o trabalho mais a variação de energia interna.')],
    formulas=[('termometro', '1ª lei', 'Q = W + ΔU'), ('grafico', 'Mesma temperatura', 'p · V igual nos dois estados'),
              ('grafico', 'Trabalho com reta', 'W = pressão média · ΔV')],
    eq='Q = W + U', leitura='calor líquido = trabalho + variação da energia interna',
    letras=[('Q', 'calor líquido recebido, em J (o que a questão quer)'), ('W', 'trabalho do gás de A até B, em J'),
            ('U', 'variação da energia interna de A até B, em J'), ('v', 'volume do estado B, em L')],
    eq_texto='O calor líquido é o trabalho mais a variação da energia interna.\nAgora é só achar U, v e W.',
    achando=[('Achando U: a variação da energia interna', 'U = (3/2) · n · R · T depende só da temperatura. A e B têm a mesma temperatura, então a variação é zero.\nU = 0.'),
             ('Achando v: o volume de B',
              'Mesma temperatura: p · V igual (n e R não mudam). Em A: 3 · 1 = 3 (em 10⁵ Pa · L).\nEm B a pressão é 3 ÷ 3 = 1. Então 1 · v = 3 e v = 3 L.'),
             ('Achando W: o trabalho como área',
              'A reta de 3 a 1 (10⁵ Pa), de 1 L a 3 L: a área sob ela é um trapézio. Pressão média = (3 + 1) ÷ 2 = 2, ou 2 × 10⁵ Pa.\n'
              'ΔV = 3 − 1 = 2 L = 2 × 10⁻³ m³. W = 2 × 10⁵ · 2 × 10⁻³ = 400 J.')],
    volta='Q = W + U = 400 + 0 = 400 J.\nResposta: alternativa X. Conferindo: p médio 2 × 10⁵ e ΔV de 2 × 10⁻³ dão 4 × 10² J.',
    valores=[('U', '0'), ('v', '3 L'), ('W', '400 J')],
    pista='"mesma temperatura" entre dois estados → p · V igual (acha o volume que falta) e a energia interna não muda; o calor líquido é o trabalho, a área sob a linha.',
    rec1='A: 3 × 10⁵ Pa e 1 L; B: mesma temperatura e p = 1/3', rec3='U = 0; v = 3 L; W = 400 J',
    checagem=('Um gás vai de p · V = 8 a p · V = 8, com a mesma temperatura. Qual a variação da energia interna?', ['0', '8', '−8', '16'], '0', 'Mesma temperatura, mesma energia interna: variação 0.'),
    ancora=('parcial · ITA 2020 q.9 (p · V = n · R · T liga os estados sem precisar de n nem de R) e ITA 2021 q.6 '
            '(energia interna não muda quando a temperatura não muda)'),
    canal='fis-07-gases-e-leis-da-termodinamica.txt [6:15:31] (mesma isoterma, mesma temperatura)',
    antes=['gas-ideal', 'potencia-de-dez', 'fracoes'],
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
assert (JOULES, POT_UTIL, TEMPO) == (72000, 720, 100)
# erros típicos
assert JOULES / 900 == 80                                                     # esqueceu o rendimento
assert JOULES / (900 / Fr(8, 10)) == 64                                       # multiplicou a potência por 1/0,8
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
           ('Potência útil', 'A parte da potência que vira calor no conteúdo: 80% de 900 W.')],
    formulas=[('termometro', 'Calor para esquentar', 'Q = m · c · ΔT'), ('termometro', 'Calor para derreter', 'Q = m · L'), ('carro', 'Tempo', 't = energia ÷ potência')],
    eq='t = Q ÷ p', leitura='tempo = energia necessária, em J ÷ potência útil, em W',
    letras=[('t', 'tempo com a resistência ligada, em s (o que a questão quer)'), ('Q', 'energia que a resistência ainda precisa dar, em J'),
            ('p', 'potência que vira calor, em W'), ('z', 'calor que sobra da água para derreter gelo, em cal'), ('m', 'gelo que ainda sobra depois do equilíbrio, em g')],
    eq_texto='A resistência dá energia à potência p. Dividindo a energia que falta pela potência, sai o tempo.\nAgora é só achar p, z, m e Q.',
    achando=[('Achando p: a potência útil', 'A resistência tem 900 W, mas só 80% vira calor: 80% = 0,8.\np = 900 · 0,8 = 720 W.'),
             ('Achando z: o calor que sobra',
              'Gelo até 0 °C pede: 200 · 0,5 · 10 = 1 000 cal.\nA água cede ao esfriar até 0 °C: 300 · 1 · 30 = 9 000 cal.\n'
              'Dá para chegar a 0 °C e ainda sobram z = 9 000 − 1 000 = 8 000 cal.'),
             ('Achando m: o gelo que sobra',
              'Derreter tudo pediria 200 · 80 = 16 000 cal, e só há 8 000: não derrete tudo, e a mistura fica em 0 °C.\n'
              'Derretem 8 000 ÷ 80 = 100 g. Sobram m = 200 − 100 = 100 g de gelo e 300 + 100 = 400 g de água.'),
             ('Achando Q: a energia que falta',
              'Fundir os 100 g de gelo: 100 · 80 = 8 000 cal.\nAquecer 500 g de água (400 + 100) de 0 °C a 20 °C: 500 · 1 · 20 = 10 000 cal.\n'
              'Soma: 18 000 cal. Em joules: 18 000 · 4 = 72 000 J. Q = 72 000 J.')],
    volta='t = 72 000 ÷ 720 = 100 s (pois 720 · 100 = 72 000).\nResposta: alternativa X.',
    valores=[('p', '720 W'), ('z', '8 000 cal'), ('m', '100 g'), ('Q', '72 000 J')],
    pista='gelo e água quente juntos → antes de somar etapas, veja se o calor da água derrete todo o gelo; se não, a mistura fica em 0 °C. Rendimento: multiplique a potência.',
    rec1='gelo 200 g, água 300 g, 900 W com 80%, 1 cal = 4 J', rec3='p = 720; z = 8 000; m = 100; Q = 72 000',
    checagem=('Quanto calor derrete 50 g de gelo a 0 °C? (L = 80 cal/g)', ['4 000 cal', '400 cal', '130 cal', '80 cal'], '4 000 cal', '50 · 80 = 4 000 cal.'),
    ancora=('forte · Fuvest 2024 2ª fase F01 item c (energia = c · ΔT + m · L, passando de cal a J) e IME 2025 q.8 '
            '(etapas de calor, potência e rendimento); aqui entra o teste de "derrete tudo?"'),
    canal='fis-06-calorimetria.txt [5:44:31] (calor latente, Q = m · L)',
    antes=['calor-especifico', 'mudanca-de-fase', 'porcentagem'],
))

# ============ d) Harvard-MIT: escada infinita de barras ============
K, AREA, L_H, L_V = 200, Fr(1, 10000), Fr(1, 2), 1
R_H = L_H / (K * AREA)
R_V = L_V / (K * AREA)
assert (R_H, R_V) == (25, 50)
Z = Fr(50)
assert Z == R_H + (R_V * Z) / (R_V + Z)                                       # a rede que sobra é igual ao todo
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
# erros típicos
assert TEMPS[1] / R_V == Fr(1, 2)                                             # 2º nó no lugar do 3º
assert 100 / Z == 2                                                           # fluxo total da fonte
r_cm = L_H / (K * 1)                                                          # 1 cm² usado como 1 m²
assert float(TEMPS[2] / (L_V / (K * 1))) == 2500
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
    resumo='r = 0,5 ÷ (200 · 10⁻⁴) = 25 K/W; vertical s = 50; a rede toda z = 25 + 50 · z ÷ (50 + z), z = 50; cada nó fica com 1/2 da temperatura: 12,5 °C no 3º; 12,5 ÷ 50 = 0,25 W.',
    ideia='Depois do 1º nó, o que resta é uma escada igual à inteira, com a mesma resistência z, e isso dá uma equação para z. Com ela, cada nó fica com metade da temperatura do anterior.',
    pecas=[('Escada igual ao todo', 'Tirando o 1º degrau de uma escada sem fim, sobra uma escada igual: o resto tem a mesma resistência do todo.'),
           ('Resistência térmica', 'Quanto a barra dificulta a passagem do calor: R = L ÷ (k · S).')],
    formulas=[('termometro', 'Resistência da barra', 'R = L ÷ (k · S)'), ('termometro', 'Fluxo', 'fluxo = diferença de temperatura ÷ R'), ('grafico', 'Série', 'R total = R1 + R2')],
    eq='P = t ÷ s', leitura='fluxo na vertical do 3º nó = temperatura do 3º nó ÷ resistência da vertical',
    letras=[('P', 'fluxo de calor na barra vertical do 3º nó, em W (o que a questão quer)'), ('t', 'temperatura do 3º nó, em °C'), ('s', 'resistência de uma barra vertical, em K/W'),
            ('r', 'resistência de uma barra horizontal, em K/W'), ('z', 'resistência da escada toda, vista da fonte, em K/W'), ('f', 'fração da temperatura que sobra de um nó para o seguinte')],
    eq_texto='A vertical do 3º nó liga o nó (temperatura t) ao frio (0 °C), então o fluxo é t dividido pela resistência s.\nAgora é só achar r, s, z, f e t.',
    achando=[('Achando r: a barra horizontal', '1 cm² = 10⁻⁴ m². k · S = 200 · 10⁻⁴ = 0,02.\nr = 0,5 ÷ 0,02 = 50 ÷ 2 = 25 K/W.'),
             ('Achando s: a barra vertical', 'A vertical tem 1,0 m, o dobro da horizontal, com o mesmo k e S.\ns = 1,0 ÷ 0,02 = 50 K/W, o dobro de r.'),
             ('Achando z: a escada toda',
              'Depois do 1º nó a escada é igual à inteira, de resistência z. No 1º nó, s e z ficam em paralelo, e r vem em série: z = 25 + 50 · z ÷ (50 + z).\n'
              'Multiplico por (50 + z): 50 · z + z · z = 1 250 + 25 · z + 50 · z, então z · z − 25 · z − 1 250 = 0.\n'
              'Dois números que somam −25 e multiplicam −1 250: −50 e 25. (z − 50) · (z + 25) = 0. Resistência não é negativa: z = 50 K/W.'),
             ('Achando f: a fração de cada nó',
              'No 1º nó, a vertical s = 50 e o resto z = 50 estão em paralelo: iguais, a metade, 25 K/W.\nEm série com r = 25, a queda de temperatura é proporcional à resistência: 25 de 50 total.\n'
              'f = 25 ÷ 50 = 1/2. O resto é igual ao todo, então cada nó repete isso.'),
             ('Achando t: a temperatura do 3º nó', '1º nó: 100 · 1/2 = 50 °C. 2º nó: 50 · 1/2 = 25 °C. 3º nó: 25 · 1/2 = 12,5 °C.\nt = 12,5 °C.')],
    volta='P = 12,5 ÷ 50 = 25 ÷ 100 = 0,25 W.\nResposta: alternativa X. Conferindo: as verticais dão 1 + 0,5 + 0,25 + ... = 2 W, e 100 ÷ 50 = 2 W saem da fonte.',
    valores=[('r', '25 K/W'), ('s', '50 K/W'), ('z', '50 K/W'), ('f', '1/2'), ('t', '12,5 °C')],
    pista='"escada que se repete sem fim" → o que sobra depois do 1º degrau é igual ao todo: escreva a equação da resistência z e resolva; cada nó fica com a mesma fração.',
    rec1='k = 200; 1 cm²; horizontal 0,5 m; vertical 1,0 m; 100 °C e 0 °C', rec3='r = 25; s = 50; z = 50; f = 1/2; t = 12,5',
    checagem=('Duas barras iguais de 40 K/W estão ligadas entre os mesmos dois pontos (paralelo). Qual a resistência?', ['20 K/W', '80 K/W', '40 K/W', '10 K/W'], '20 K/W',
              'Iguais em paralelo: a metade, 40 ÷ 2 = 20 K/W.'),
    ancora=('sem · técnica: auto-semelhança de rede infinita (o que sobra é igual ao todo, ideia de invariante dos problemas de Harvard-MIT) '
            'mais analogia entre calor e corrente; não há prova de Física de Harvard-MIT no corpus'),
    canal='fis-06-calorimetria.txt [5:19:32] (lei de Fourier: fluxo, k, área, ΔT e espessura); a escada infinita fica fora do canal',
    antes=['resistencia-termica', 'produto-zero', 'potencia-de-dez', 'fracoes'],
))

for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
