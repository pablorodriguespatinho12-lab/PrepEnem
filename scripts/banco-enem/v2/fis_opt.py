"""Nível acima v2 de Física: Óptica (23/11/2026).

a = ENEM (projetor que se afasta da parede, junta Cinemática; âncora de técnica ITA 2024 q.7), b = ITA (biconvexa que diverge no líquido; ITA 2021 q.9),
c = Fuvest (fibra, revestimentos e atraso do raio no ângulo limite; ITA 2020 2ª fase q.9 e Fuvest 2025 q.22), d = Harvard-MIT (raio que quica em sala 5 m por 3 m,
desdobramento do espelho; âncora por técnica). As 4 antigas saem (a, b, c REESCREVER; d TROCAR). Conferido por assert no próprio módulo.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_opt
"""
from fractions import Fraction as Fr
from math import sqrt

ARQUIVO = 'fisica-acima-novas.json'
T = 'Óptica'

Q = []
MANTER = {}


def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


# ============ Aulas "Antes" novas (Gauss, índice e velocidade, fabricantes, reflexão total, desdobramento, mmc) ============
ANTES_NOVOS = {
    'opt-gauss-aumento': {
        'titulo': "Lente: 1/f = 1/p + 1/p' e o aumento",
        'linhas': [
            "Lente delgada: 1/f = 1/p + 1/p'. f é o foco, p a distância do objeto à lente e p' a da imagem à lente, todas na mesma unidade.",
            "Lente convergente tem f positivo. Objeto além do foco dá imagem real (p' positivo), de cabeça para baixo.",
            "Aumento: g = p' ÷ p. Altura da imagem = g · altura do objeto. Com f = 20 e p = 30: 1/p' = 3/60 − 2/60 = 1/60, p' = 60 e g = 60 ÷ 30 = 2.",
            "Atalho: de 1/p = 1/f − 1/p' sai p' ÷ p = p' ÷ f − 1. Então g = p' ÷ f − 1: o −1 é o que mais se esquece.",
            "Imagem virtual: p' sai negativo (do mesmo lado do objeto) e a imagem é direita; o aumento vale −p' ÷ p.",
        ],
        'visual': tabela('Exemplo com f = 20', ['p', "p'", 'g'], [['30', '60', '2'], ['40', '40', '1'], ['60', '30', '1/2']]),
        'exercicios': [
            {'enunciado': 'Lente de f = 10 cm e objeto a 15 cm. A que distância da lente fica a imagem?', 'alternativas': ['30 cm', '6 cm', '25 cm', '5 cm'], 'certa': 0,
             'resolucao': "30 cm: 1/p' = 1/10 − 1/15 = 3/30 − 2/30 = 1/30, então p' = 30 cm.\n6 cm soma os dois inversos; 25 cm soma 10 + 15; 5 cm subtrai 15 − 10."},
            {'enunciado': "Imagem real a 60 cm de uma lente de f = 20 cm. Qual o aumento? (use g = p' ÷ f − 1)", 'alternativas': ['2', '3', '1/3', '4'], 'certa': 0,
             'resolucao': "2: g = 60 ÷ 20 − 1 = 3 − 1 = 2.\n3 esquece o −1; 1/3 inverte a divisão; 4 soma 1 em vez de tirar."},
        ],
    },
    'opt-indice-meio': {
        'titulo': 'Índice de refração: n = c ÷ v',
        'linhas': [
            'O índice de refração n diz quantas vezes a luz é mais lenta no meio do que no vácuo: n = c ÷ v. No vácuo n = 1; no vidro, perto de 1,5.',
            'c = 3,0 × 10⁸ m/s. Num meio com n = 1,5: v = 3,0 × 10⁸ ÷ 1,5 = 2,0 × 10⁸ m/s.',
            'Ao entrar no meio, a frequência da onda não muda e o comprimento de onda encolhe: λ no meio = λ no vácuo ÷ n.',
            'Então n = λ no vácuo ÷ λ no meio. Luz de 600 nm no vácuo e 400 nm no vidro: n = 600 ÷ 400 = 1,5. (1 nm = 10⁻⁹ m)',
            'Pela velocidade: se v = 1,5 × 10⁸ m/s, então n = 3,0 × 10⁸ ÷ 1,5 × 10⁸ = 2,0.',
        ],
        'visual': tabela('Índice e velocidade', ['Meio', 'n', 'v'], [['vácuo', '1,0', '3,0 × 10⁸ m/s'], ['vidro', '1,5', '2,0 × 10⁸ m/s'], ['líquido', '2,0', '1,5 × 10⁸ m/s']]),
        'exercicios': [
            {'enunciado': 'A luz anda a 2,0 × 10⁸ m/s num material. Qual o índice de refração? (c = 3,0 × 10⁸ m/s)', 'alternativas': ['1,5', '0,67', '6', '1,0'], 'certa': 0,
             'resolucao': '1,5: n = c ÷ v = 3,0 × 10⁸ ÷ 2,0 × 10⁸ = 1,5.\n0,67 inverte a divisão; 6 multiplica; 1,0 é o índice do vácuo.'},
            {'enunciado': 'Luz de 500 nm no vácuo tem 400 nm dentro de um vidro. Qual o índice de refração?', 'alternativas': ['1,25', '0,8', '900', '100'], 'certa': 0,
             'resolucao': '1,25: n = 500 ÷ 400 = 1,25.\n0,8 inverte a divisão; 900 soma; 100 subtrai.'},
        ],
    },
    'opt-fabricantes': {
        'titulo': 'Equação dos fabricantes de lentes',
        'linhas': [
            'O foco de uma lente delgada depende do material e do meio: 1/f = (N − 1) · (1/R1 + 1/R2), com N = n da lente ÷ n do meio.',
            'R1 e R2 são os raios das duas faces. Numa lente biconvexa os dois entram com sinal de mais. Use a mesma unidade para todos.',
            'No ar, N = n da lente ÷ 1. Vidro de 1,5 e raios de 10 e 10 cm: 1/f = 0,5 · (1/10 + 1/10) = 0,5 · 0,2 = 0,1, então f = 10 cm.',
            'Se N é maior que 1, f é positivo e a lente converge. Se N é menor que 1, f sai negativo e a lente diverge, mesmo sendo biconvexa.',
            'Em Gauss, o foco negativo entra com o sinal de menos: de um objeto real, a lente divergente dá só imagem virtual.',
        ],
        'visual': tabela('N e a natureza da lente', ['N', 'N − 1', 'Lente'], [['1,5', '+0,5', 'converge'], ['1,0', '0', 'não desvia'], ['0,8', '−0,2', 'diverge']]),
        'exercicios': [
            {'enunciado': 'Lente biconvexa de vidro (1,5) no ar, com raios de 20 cm e 20 cm. Qual o foco?', 'alternativas': ['20 cm', '40 cm', '10 cm', '5 cm'], 'certa': 0,
             'resolucao': '20 cm: 1/f = 0,5 · (1/20 + 1/20) = 0,5 · 0,1 = 0,05, então f = 20 cm.\n40 cm usa só uma face; 10 cm esquece o 0,5; 5 cm erra os dois.'},
            {'enunciado': 'Uma lente biconvexa tem N = 0,8 (o meio é mais refringente que ela). Ela converge ou diverge?', 'alternativas': ['Diverge', 'Converge', 'Não desvia', 'Depende do raio'], 'certa': 0,
             'resolucao': 'Diverge: N − 1 = 0,8 − 1 = −0,2 é negativo, então f é negativo.\nConverge esquece o sinal; não desvia só vale se N = 1.'},
        ],
    },
    'opt-reflexao-total': {
        'titulo': 'Reflexão total e ângulo limite',
        'linhas': [
            'Quando a luz vai de um meio de índice n1 para outro de índice n2 menor (n1 > n2), ela se afasta da normal ao refratar.',
            'Ângulo limite θL: a luz sai rente à superfície. sen θL = n2 ÷ n1. Acima desse ângulo de incidência toda a luz reflete: reflexão total.',
            'Só existe reflexão total se n1 > n2. Com n2 igual ou maior, o seno daria 1 ou mais e não há ângulo limite.',
            'Exemplo: vidro 1,5 para ar 1,0: sen θL = 1,0 ÷ 1,5 = 0,67. O ângulo é medido da normal, a reta perpendicular à parede.',
            'Numa fibra reta, o raio vai e volta entre as paredes. Para avançar um comprimento L ao longo do eixo, ele anda L ÷ sen θ (θ medido da normal).',
        ],
        'visual': tabela('Seno do ângulo limite', ['n1', 'n2', 'sen θL'], [['1,5', '1,0', '0,67'], ['1,6', '1,2', '0,75'], ['1,5', '1,5', 'não há']]),
        'exercicios': [
            {'enunciado': 'Núcleo de índice 1,60 e revestimento de 1,20. Quanto vale o seno do ângulo limite?', 'alternativas': ['0,75', '1,33', '0,4', '1,92'], 'certa': 0,
             'resolucao': '0,75: sen θL = 1,20 ÷ 1,60 = 0,75.\n1,33 inverte a divisão; 0,4 subtrai; 1,92 multiplica.'},
            {'enunciado': 'Núcleo de 1,50 e revestimento de 1,50. Existe reflexão total?', 'alternativas': ['Não', 'Sim, a 90°', 'Sim, a 45°', 'Sim, a 0°'], 'certa': 0,
             'resolucao': 'Não: é preciso n1 maior que n2; com índices iguais, sen θL = 1 e não há ângulo limite.\nOs outros inventam um ângulo que não existe.'},
        ],
    },
    'opt-espelho-desdobrado': {
        'titulo': 'Espelho: desdobrar a sala',
        'linhas': [
            'Espelho plano: a imagem fica do outro lado, à mesma distância. O raio refletido segue como se viesse da imagem, em linha reta.',
            'Truque do desdobramento: em vez de quicar o raio, copie a sala do outro lado da parede, como num espelho. O raio segue reto pela cópia.',
            'Cada linha de parede que o raio cruza nas cópias é uma reflexão na sala de verdade. Contar reflexões vira contar linhas cruzadas.',
            'Sala de 4 m por 2 m, raio a 45° saindo do canto: ele anda x = y. Linhas verticais de parede em x = 4, 8, ...; horizontais em y = 2, 4, 6, ...',
            'O raio só chega a um canto de verdade quando x e y caem, os dois, em linhas de parede. Nesse ponto ele para e não conta como reflexão.',
        ],
        'visual': tabela('Sala de 4 m por 2 m, a 45°', ['x = y', 'Cruza', 'O que acontece'], [['2', 'y = 2', 'reflete na parede de cima'], ['4', 'x = 4 e y = 4', 'chega ao canto']]),
        'exercicios': [
            {'enunciado': 'Sala de 4 m por 2 m, raio a 45° saindo do canto. Quando chega a um canto, quanto andou na direção x?', 'alternativas': ['4 m', '8 m', '2 m', '6 m'], 'certa': 0,
             'resolucao': '4 m: x tem de ser múltiplo de 4 e y múltiplo de 2; o primeiro valor comum é 4.\n8 m é o segundo canto; 2 m só serve para y; 6 m não serve para x.'},
            {'enunciado': 'No mesmo raio, em quantas reflexões ele bate até chegar ao canto (a chegada não conta)?', 'alternativas': ['1', '2', '3', '0'], 'certa': 0,
             'resolucao': '1: nenhuma linha vertical antes de x = 4 e uma horizontal, y = 2.\n2 conta o canto; 3 conta o canto duas vezes; 0 ignora a linha y = 2.'},
        ],
    },
    'opt-mmc': {
        'titulo': 'Menor múltiplo comum (mmc)',
        'linhas': [
            'Múltiplos de 5: 5, 10, 15, 20... Múltiplos de 3: 3, 6, 9, 12, 15... Os que aparecem nas duas listas são os múltiplos comuns.',
            'O menor deles é o mmc. Para 5 e 3, o mmc é 15.',
            'Se os números não têm fator em comum (como 5 e 3), o mmc é o produto: 5 · 3 = 15.',
            'Se têm fator comum, o mmc é menor que o produto. 4 e 6: múltiplos de 6 são 6 e 12; 12 é múltiplo de 4. O mmc é 12, e não 24.',
            'Quantas vezes cada número cabe no mmc: 15 ÷ 5 = 3 e 15 ÷ 3 = 5. Esses quocientes contam as voltas de cada um.',
        ],
        'visual': tabela('Exemplos de mmc', ['Números', 'mmc', 'Cabe'], [['5 e 3', '15', '3 e 5 vezes'], ['4 e 6', '12', '3 e 2 vezes'], ['4 e 2', '4', '1 e 2 vezes']]),
        'exercicios': [
            {'enunciado': 'Qual o mmc de 6 e 4?', 'alternativas': ['12', '24', '2', '10'], 'certa': 0,
             'resolucao': '12: múltiplos de 6 são 6, 12; e 12 é múltiplo de 4.\n24 é o produto, maior que o mmc; 2 é divisor, não múltiplo; 10 não é múltiplo de 6.'},
            {'enunciado': 'Qual o mmc de 7 e 3?', 'alternativas': ['21', '10', '1', '42'], 'certa': 0,
             'resolucao': '21: sem fator comum, o mmc é o produto, 7 · 3 = 21.\n10 soma; 1 é divisor; 42 dobra.'},
        ],
    },
}
for _id, _c in ANTES_NOVOS.items():
    assert _id.startswith('opt-'), _id
    assert all(len(l) <= 170 for l in _c['linhas']), (_id, [len(l) for l in _c['linhas']])
    assert len(_c['exercicios']) == 2
    for _e in _c['exercicios']:
        assert _e['alternativas'][_e['certa']].split(' ')[0] in _e['resolucao'].split('\n')[0], (_id, _e['enunciado'])
        assert len(set(_e['alternativas'])) == len(_e['alternativas']), (_id, _e['enunciado'])
# conferência das contas das aulas
assert Fr(1, 10) - Fr(1, 15) == Fr(1, 30) and Fr(60, 20) - 1 == 2
assert Fr(1, 2) * (Fr(1, 20) + Fr(1, 20)) == Fr(1, 20) and Fr(1, 2) * Fr(2, 10) == Fr(1, 10)
assert Fr(3, 2) * 10**8 * 0 == 0 and Fr(30, 15) == 2 and Fr(600, 400) == Fr(3, 2) and Fr(500, 400) == Fr(5, 4) and Fr(3, 2) == Fr(30, 20)
assert Fr(12, 16) == Fr(3, 4) and Fr(120, 160) == Fr(3, 4)
assert (Fr(1, 20) - Fr(1, 30)) ** -1 == 60 and Fr(60, 30) == 2
assert [x for x in range(1, 20) if x % 4 == 0 and x % 2 == 0][0] == 4 and 4 // 4 - 1 == 0 and 4 // 2 - 1 == 1
assert [x for x in range(1, 40) if x % 6 == 0 and x % 4 == 0][0] == 12 and 7 * 3 == 21

# ============ a) ENEM: projetor que se afasta da parede ============
F_ESC = Fr(100, 1000)          # m
LADO = Fr(36, 1000)            # m
PAREDE0 = Fr(2)                # m
VEL = Fr(20, 100)              # m/s
ALVO = Fr(126, 100)            # m


def imagem(f, w):
    """Altura da imagem do lado do slide quando a parede (imagem real) está a w da lente: g = w/f − 1."""
    return LADO * (w / f - 1)


def inicio_ok(f):
    return Fr(60, 100) <= imagem(f, PAREDE0) <= Fr(80, 100)


assert [f for f in (Fr(50, 1000), Fr(100, 1000), Fr(150, 1000)) if inicio_ok(f)] == [F_ESC]
assert imagem(Fr(50, 1000), PAREDE0) == Fr(1404, 1000) and imagem(F_ESC, PAREDE0) == Fr(684, 1000)
assert float(imagem(Fr(150, 1000), PAREDE0)) == 0.444
G = ALVO / LADO
assert G == 35
# confere g = w/f − 1 pelas duas equações (Gauss e g = w/p)
W = (G + 1) * F_ESC
P_SLIDE = 1 / (1 / F_ESC - 1 / W)
assert W == Fr(36, 10) and W / P_SLIDE == G and float(P_SLIDE) == 0.10285714285714286
T_A = (W - PAREDE0) / VEL
assert T_A == 8
# erros típicos
assert ((G * F_ESC) - PAREDE0) / VEL == Fr(15, 2)                      # g = w/f (esquece o −1)
assert (((G - 1) * F_ESC) - PAREDE0) / VEL == 7                         # g = w/f + 1
assert W / VEL == 18                                                    # esquece a distância inicial
assert (((G + 1) * Fr(150, 1000)) - PAREDE0) / VEL == 17                # lente de 150 mm
assert (G + 1) * Fr(50, 1000) < PAREDE0                                 # com 50 mm, o projetor teria de se aproximar

ENUN_A = ('Na feira de ciências da escola, o professor de Física monta um projetor com uma lâmpada de 150 W, um carrossel de 24 slides e uma lente convergente delgada. '
          'Cada slide tem 36 mm no lado maior. Na caixa há três lentes, de distâncias focais 50 mm, 100 mm e 150 mm, e ele escolhe a única que, com o projetor a 2,0 m '
          'da parede, mostra o lado maior do slide com um tamanho entre 0,60 m e 0,80 m. Depois de focar, liga o foco automático: o projetor passa a se afastar da parede, '
          'em linha reta, a 0,20 m/s, e o slide se desloca sozinho para a imagem continuar nítida. Para a turma do fundo ver bem, o professor quer que o lado maior '
          'da imagem chegue a 1,26 m. Considere a distância da lente à parede, que é a distância da imagem.\n\n'
          'Lente 1: 50 mm   |   Lente 2: 100 mm   |   Lente 3: 150 mm\n\n'
          'Quantos segundos, contados do início do afastamento, a imagem do lado maior leva para chegar a 1,26 m?')
assert len(ENUN_A) >= 600, len(ENUN_A)
Q.append(dict(
    id='d2-escada-fis-ita-opt-00a', materia='Física', tema=T, calc=8,
    enunciado=ENUN_A,
    dados=[('Slide', '36 mm no lado maior'), ('Lentes', '50 mm, 100 mm e 150 mm'), ('Imagem no início', 'lado maior entre 0,60 m e 0,80 m'),
           ('Parede no início', 'a 2,0 m da lente'), ('Afastamento', '0,20 m/s, em linha reta'), ('Imagem pedida', 'lado maior com 1,26 m')],
    alts=[('7 s', 7, "Usou g = w ÷ f + 1 (sinal trocado): w = 34 · 0,10 = 3,4 m e (3,4 − 2,0) ÷ 0,20"),
          ('7,5 s', 7.5, "Esqueceu o −1: g = w ÷ f = 35 dá w = 3,5 m e (3,5 − 2,0) ÷ 0,20"),
          ('8 s', 8, 'OK'),
          ('17 s', 17, 'Escolheu a lente de 150 mm: w = 36 · 0,15 = 5,4 m e (5,4 − 2,0) ÷ 0,20'),
          ('18 s', 18, 'Esqueceu os 2,0 m do início: 3,6 ÷ 0,20')],
    resumo='Só a lente de 100 mm dá 36 · (20 − 1) = 684 mm no início; g = 1 260 ÷ 36 = 35; w ÷ f = 36, w = 3,6 m; t = (3,6 − 2,0) ÷ 0,20 = 8 s.',
    ideia='A parede é a imagem, e a imagem do projetor cresce com g = w ÷ f − 1. A condição do início escolhe a lente, o tamanho pedido dá g e w, e o movimento uniforme dá o tempo.',
    pecas=[('Aumento', 'Quantas vezes o lado da imagem é maior que o do slide. Num projetor, g = distância da parede ÷ f, menos 1.'),
           ('Parede = imagem', 'A imagem nítida se forma na parede, então a distância da lente à parede é a distância da imagem.')],
    formulas=[('lente', 'Equação da lente', "1/f = 1/p + 1/p'"), ('lente', 'Aumento do projetor', "g = p' ÷ f − 1"), ('carro', 'Movimento uniforme', 't = distância ÷ velocidade')],
    eq='t = (w − d) ÷ v', leitura='tempo = (distância final da parede − distância inicial) ÷ velocidade de afastamento',
    letras=[('t', 'tempo de afastamento, em s (o que a questão quer)'), ('w', 'distância da lente à parede quando a imagem tem 1,26 m, em m'),
            ('d', 'distância da lente à parede no início, em m'), ('v', 'velocidade de afastamento, em m/s'),
            ('f', 'distância focal da lente escolhida, em mm'), ('g', 'aumento da imagem quando o lado chega a 1,26 m')],
    eq_texto='A parede anda com velocidade v desde d até w, e o tempo é essa distância dividida por v.\nAgora é só achar v, d, f, g e w.',
    achando=[('Achando v: a velocidade', 'A parede se afasta 0,20 m a cada segundo.\nv = 0,20 m/s.'),
             ('Achando d: o ponto de partida', 'No início o projetor está a 2,0 m da parede.\nd = 2,0 m = 2 000 mm.'),
             ('Achando f: a lente escolhida',
              'O aumento do projetor é g = w ÷ f − 1, com w a distância da parede (aula "Antes").\nNo início, w = 2 000 mm. f = 50: 36 · (40 − 1) = 1 404 mm, grande. f = 150: 36 · 12,33 = 444 mm, pequeno.\n'
              'f = 100: 36 · (20 − 1) = 36 · 19 = 684 mm = 0,684 m, entre 0,60 e 0,80. f = 100 mm.',
              tabela('Lado maior da imagem com a parede a 2,0 m', ['Lente', 'Conta', 'Imagem'], [['50 mm', '36 · 39', '1,404 m'], ['100 mm', '36 · 19', '0,684 m'], ['150 mm', '36 · 12,33', '0,444 m']])),
             ('Achando g: o aumento pedido', 'O lado do slide tem 36 mm e a imagem deve ter 1,26 m = 1 260 mm.\ng = 1 260 ÷ 36 = 35 (pois 36 · 35 = 1 260).'),
             ('Achando w: a parede no final',
              'g = w ÷ f − 1, então w ÷ f = g + 1 = 35 + 1 = 36.\nw = 36 · f = 36 · 100 = 3 600 mm = 3,6 m.\nO −1 é a pegadinha: sem ele daria w = 3,5 m.')],
    volta='t = (3,6 − 2,0) ÷ 0,20 = 1,6 ÷ 0,2 = 16 ÷ 2 = 8 s.\nResposta: alternativa X. Conferindo: 0,20 · 8 = 1,6 m, e 2,0 + 1,6 = 3,6 m.',
    valores=[('v', '0,20 m/s'), ('d', '2,0 m'), ('f', '100 mm'), ('g', '35'), ('w', '3,6 m')],
    pista='"projetor" e "imagem na parede" → a parede é a imagem: escolha a lente pela condição do início, ache o aumento pedido, use g = w ÷ f − 1 e divida o deslocamento pela velocidade.',
    rec1='slide 36 mm; lentes 50, 100, 150 mm; parede a 2,0 m; 0,20 m/s; imagem 1,26 m', rec3='v = 0,20; d = 2,0; f = 100; g = 35; w = 3,6',
    checagem=("Uma lente de f = 10 cm projeta uma imagem real a 50 cm. Qual o aumento? (g = p' ÷ f − 1)", ['4', '5', '6', '0,2'], '4', '50 ÷ 10 = 5 e 5 − 1 = 4.'),
    ancora=("parcial · ITA 2024 q.7 (microscópio: Gauss e aumento linear, a imagem vira dado); no ENEM 2019 a 2023 não há conta de lente: "
            "o estilo e o tamanho são de ENEM e a técnica é a de ITA, com Cinemática (movimento uniforme) junto"),
    canal='fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [7:55:30] (lentes, foco e imagem)',
    antes=['opt-gauss-aumento', 'velocidade', 'multiplicar-decimais', 'dividir-por-decimal'],
))

# ============ b) ITA: biconvexa que diverge dentro do líquido ============
C_LUZ = Fr(3, 1) * 10**8
LAMBDA_VAC, LAMBDA_VID = 600, 400
V_LIQ = Fr(1875, 1000) * 10**8
N_V = Fr(LAMBDA_VAC, LAMBDA_VID)
N_L = C_LUZ / V_LIQ
assert (N_V, N_L) == (Fr(3, 2), Fr(8, 5))
R1, R2 = Fr(10), Fr(30)
N_REL = N_V / N_L
assert N_REL == Fr(15, 16)
SOMA_R = 1 / R1 + 1 / R2
assert SOMA_R == Fr(2, 15) and (N_V - 1) * SOMA_R == Fr(1, 15)           # no ar, f = 15 cm
F_B = 1 / ((N_REL - 1) * SOMA_R)
assert F_B == -120
OBJ, ALT = Fr(40), Fr(8)
P_IMG = 1 / (1 / F_B - 1 / OBJ)
G_B = -P_IMG / OBJ
H_IMG = G_B * ALT
assert (P_IMG, G_B, H_IMG) == (-30, Fr(3, 4), 6)                          # virtual, direta e menor


def altura(f, obj=OBJ, alt=ALT):
    p_img = 1 / (1 / f - 1 / obj)
    return p_img, abs(p_img) / obj * alt


# erros típicos
assert altura(Fr(15)) == (24, Fr(24, 40) * 8) and altura(Fr(15))[1] == Fr(24, 5)                     # foco do ar: real a 24 cm, 4,8 cm
f_inv = 1 / (((N_L / N_V) - 1) * SOMA_R)                                                          # razão invertida
assert f_inv == Fr(225, 2) and round(float(altura(f_inv)[0]), 1) == -62.1 and round(float(altura(f_inv)[1]), 1) == 12.4
assert altura(Fr(120)) == (-60, 12)                                                                # perdeu o sinal do foco em Gauss
f_dif = 1 / ((N_V - N_L) * SOMA_R)                                                                 # diferença no lugar da razão
assert f_dif == -75 and round(float(altura(f_dif)[0]), 1) == -26.1 and round(float(altura(f_dif)[1]), 1) == 5.2
Q.append(dict(
    id='d2-escada-fis-ita-opt-00b', materia='Física', tema=T, calc=6,
    enunciado=('Uma lente biconvexa de vidro tem faces com raios de curvatura de 10 cm e 30 cm. A luz de comprimento de onda 600 nm no vácuo passa a ter 400 nm dentro '
               'desse vidro. A lente é totalmente mergulhada num líquido onde a luz se propaga a 1,875 × 10⁸ m/s, sendo 3,0 × 10⁸ m/s a velocidade da luz no vácuo. '
               'Um objeto real de 8,0 cm de altura é colocado sobre o eixo da lente, a 40 cm dela, também dentro do líquido. '
               'Assinale a alternativa que descreve corretamente a lente e a imagem formada.'),
    dados=[('Raios da lente', '10 cm e 30 cm (biconvexa)'), ('Luz no vidro', '600 nm no vácuo viram 400 nm'), ('Luz no líquido', '1,875 × 10⁸ m/s'),
           ('Velocidade no vácuo', '3,0 × 10⁸ m/s'), ('Objeto', '8,0 cm de altura, a 40 cm da lente')],
    alts=[('Convergente; imagem real, a 24 cm da lente, com 4,8 cm de altura', 4.8, 'Usou o foco da lente no ar (15 cm), sem trocar o meio: 1/p\' = 1/15 − 1/40'),
          ('Divergente; imagem virtual, a 26 cm da lente, com 5,2 cm de altura', 5.217391304, 'Usou a diferença n_vidro − n_líquido = −0,1 em vez da razão: f = −75 cm'),
          ('Divergente; imagem virtual, a 30 cm da lente, com 6,0 cm de altura', 6, 'OK'),
          ('Divergente; imagem virtual, a 60 cm da lente, com 12 cm de altura', 12, 'Perdeu o sinal do foco em Gauss: usou f = +120 cm e 1/p\' = 1/120 − 1/40'),
          ('Convergente; imagem virtual, a 62 cm da lente, com 12,4 cm de altura', 12.413793103, 'Inverteu a razão (N = 1,6 ÷ 1,5): f = +112,5 cm, objeto dentro do foco')],
    resumo="n_vidro = 600 ÷ 400 = 1,5; n_líquido = 3,0 ÷ 1,875 = 1,6; N = 15/16; 1/f = (−1/16) · (2/15) = −1/120, f = −120 cm; 1/p' = −1/120 − 1/40 = −1/30, p' = −30 cm; g = 30 ÷ 40 = 0,75; imagem de 6 cm.",
    ideia='O que decide é a razão entre o índice da lente e o do meio. Como o líquido é mais refringente que o vidro, a biconvexa diverge, e a imagem de um objeto real é virtual, direita e menor.',
    pecas=[('Índice relativo N', 'Índice da lente dividido pelo índice do meio. Menor que 1 faz a lente divergir.'),
           ('Foco negativo', 'Lente divergente: f entra com sinal de menos, e a imagem de objeto real é virtual (p\' negativo).')],
    formulas=[('onda', 'Índice pelo λ', 'n = λ no vácuo ÷ λ no meio'), ('onda', 'Índice pela velocidade', 'n = c ÷ v'),
              ('lente', 'Fabricantes', '1/f = (N − 1) · (1/R1 + 1/R2)'), ('lente', 'Gauss', "1/f = 1/p + 1/p'")],
    eq='i = g · u', leitura='altura da imagem = aumento · altura do objeto',
    letras=[('i', 'altura da imagem, em cm (o que a questão quer)'), ('g', 'aumento da lente'), ('u', 'altura do objeto, em cm'),
            ('s', 'posição da imagem em Gauss (p\'), em cm'), ('f', 'distância focal da lente no líquido, em cm'), ('N', 'índice da lente ÷ índice do líquido'),
            ('k', 'índice de refração do vidro'), ('q', 'índice de refração do líquido')],
    eq_texto='A imagem tem o tamanho do objeto vezes o aumento.\nAgora é só achar u, k, q, N, f, s e g.',
    achando=[('Achando u: a altura do objeto', 'O enunciado dá o objeto com 8,0 cm de altura.\nu = 8 cm.'),
             ('Achando k: o índice do vidro', 'A frequência não muda e o comprimento de onda cai: n = λ no vácuo ÷ λ no vidro.\nk = 600 ÷ 400 = 1,5.'),
             ('Achando q: o índice do líquido', 'q = c ÷ v = 3,0 × 10⁸ ÷ 1,875 × 10⁸ = 3,0 ÷ 1,875 = 1,6 (pois 1,875 · 1,6 = 3,0).'),
             ('Achando N: o índice relativo', 'N = k ÷ q = 1,5 ÷ 1,6 = 15 ÷ 16.\nN é menor que 1: N − 1 = 15/16 − 16/16 = −1/16.'),
             ('Achando f: o foco no líquido',
              '1/f = (N − 1) · (1/10 + 1/30). Primeiro 1/10 + 1/30 = 3/30 + 1/30 = 4/30 = 2/15.\n1/f = (−1/16) · (2/15) = −2/240 = −1/120.\nf = −120 cm: a lente é divergente.'),
             ('Achando s: onde fica a imagem', "1/f = 1/p + 1/s, com p = 40: 1/s = −1/120 − 1/40 = −1/120 − 3/120 = −4/120 = −1/30.\ns = −30 cm: negativo, imagem virtual a 30 cm da lente."),
             ('Achando g: o aumento', 'Para imagem virtual, g = −s ÷ p = 30 ÷ 40 = 3/4 = 0,75.\nPositivo: imagem direita. Menor que 1: imagem menor.')],
    volta='i = g · u = 0,75 · 8 = 6 cm.\nResposta: alternativa X. Conferindo: lente divergente, imagem virtual, a 30 cm e com 6 cm de altura.',
    valores=[('u', '8 cm'), ('k', '1,5'), ('q', '1,6'), ('N', '15/16'), ('f', '−120 cm'), ('s', '−30 cm'), ('g', '0,75')],
    pista='"lente mergulhada em líquido" → ache os dois índices (λ e velocidade), use a razão N = n da lente ÷ n do meio: N menor que 1 faz o foco negativo (lente divergente) e a imagem virtual.',
    rec1='raios 10 e 30 cm; 600 e 400 nm; 1,875 × 10⁸ m/s; objeto 8 cm a 40 cm', rec3='k = 1,5; q = 1,6; N = 15/16; f = −120; s = −30; g = 0,75',
    checagem=('Uma lente biconvexa de vidro (n = 1,5) é mergulhada num líquido de n = 2,0. Ela converge ou diverge?', ['Diverge', 'Converge', 'Não desvia', 'Depende do objeto'], 'Diverge',
              'N = 1,5 ÷ 2,0 = 0,75, menor que 1: o foco é negativo e a lente diverge.'),
    ancora=('forte · ITA 2021 q.9 (lente biconvexa imersa num líquido de índice maior que o dela: o índice relativo inverte a natureza da lente; depois Gauss e aumento). '
            'IME 2024 q.28 fica só como apoio da equação dos fabricantes'),
    canal='fora do canal: equação dos fabricantes (0 hits); índice de refração e v = c/n em fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:14:31]',
    antes=['opt-fabricantes', 'opt-gauss-aumento', 'opt-indice-meio', 'fracoes'],
))

# ============ c) Fuvest: fibra, tabela de revestimentos e atraso do raio mais lento ============
N_NUC, L_FIB, C_MS = Fr(3, 2), Fr(3000), Fr(3, 1) * 10**8
REVEST = [Fr(12, 10), Fr(135, 100), Fr(145, 100), Fr(15, 10)]
GUIAM = [r for r in REVEST if r < N_NUC]                                  # reflexão total só com n_casca < n_núcleo
assert GUIAM == REVEST[:3]
R_ESC = max(GUIAM)
assert R_ESC == Fr(145, 100)


def atraso_us(r):
    t_axial = L_FIB * N_NUC / C_MS
    sen_lim = r / N_NUC
    t_max = (L_FIB / sen_lim) * N_NUC / C_MS
    return float((t_max - t_axial) * 10**6), float(t_axial * 10**6), float(t_max * 10**6)


assert round(atraso_us(R_ESC)[0], 2) == 0.52 and abs(atraso_us(R_ESC)[1] - 15) < 1e-9
assert round(atraso_us(R_ESC)[2], 2) == 15.52 and R_ESC / N_NUC == Fr(29, 30) and round(float(L_FIB / (R_ESC / N_NUC)), 1) == 3103.4
assert round(atraso_us(Fr(12, 10))[0], 2) == 3.75 and round(atraso_us(Fr(135, 100))[0], 2) == 1.67 and atraso_us(Fr(15, 10))[0] == 0
assert round(atraso_us(R_ESC)[2], 1) == 15.5                               # confundiu o tempo do mais lento com o atraso
Q.append(dict(
    id='d2-escada-fis-ita-opt-00c', materia='Física', tema=T, calc=0.52,
    enunciado=('Uma fibra óptica reta de 3,0 km tem núcleo de vidro com índice de refração 1,50. A luz é guiada por reflexões totais na parede entre o núcleo e o revestimento. '
               'O engenheiro dispõe dos revestimentos da tabela e escolhe o de maior índice que ainda permite guiar a luz. Raios que entram com ângulos diferentes fazem caminhos '
               'diferentes, e o pulso se alarga: o atraso é a diferença entre o tempo do raio mais lento (o que reflete rente ao limite da reflexão total) e o do raio que '
               'anda ao longo do eixo da fibra. A velocidade da luz no vácuo é 3,0 × 10⁸ m/s (1 µs = 10⁻⁶ s).\n\n'
               'Revestimento A: 1,20   |   B: 1,35   |   C: 1,45   |   D: 1,50\n\n'
               'Com o revestimento escolhido, o atraso entre o raio mais lento e o raio axial, ao fim dos 3,0 km, vale:'),
    dados=[('Fibra', '3,0 km, núcleo de índice 1,50'), ('Revestimentos', '1,20; 1,35; 1,45 e 1,50'), ('Escolha', 'o de maior índice que ainda guia a luz'),
           ('Luz no vácuo', '3,0 × 10⁸ m/s'), ('Atraso', 'tempo do mais lento − tempo do axial'), ('Unidade', '1 µs = 10⁻⁶ s')],
    alts=[('0', 0, 'Escolheu o revestimento D (1,50): com n igual, sen θL = 1 e só o raio axial é guiado'),
          ('0,52 µs', 0.52, 'OK'),
          ('1,67 µs', 1.67, 'Escolheu o revestimento B (1,35), que guia a luz mas não é o de maior índice'),
          ('3,75 µs', 3.75, 'Escolheu o revestimento A (1,20), o de menor índice'),
          ('15,5 µs', 15.5, 'Deu o tempo do raio mais lento (15,52 µs) e não o atraso')],
    resumo='Guia só n menor que 1,50, e o maior é 1,45; sen θL = 1,45 ÷ 1,50 = 29/30; caminho = 3 000 ÷ (29/30) = 3 103,4 m; v = 2,0 × 10⁸; raio lento 15,52 µs; axial 15 µs; atraso 0,52 µs.',
    ideia='Só há reflexão total se o revestimento tem índice menor que o do núcleo, então o D não serve e o C é o maior que serve. O raio mais lento anda L ÷ sen θL, e o atraso é a diferença para o tempo do raio axial.',
    pecas=[('Ângulo limite', 'O menor ângulo de incidência (medido da normal) em que a reflexão ainda é total: sen θL = n do revestimento ÷ n do núcleo.'),
           ('Raio axial', 'O que anda ao longo do eixo, em linha reta, sem bater na parede.')],
    formulas=[('onda', 'Velocidade na fibra', 'v = c ÷ n'), ('grafico', 'Ângulo limite', 'sen θL = n casca ÷ n núcleo'), ('carro', 'Tempo', 't = distância ÷ v')],
    eq='d = m − x', leitura='atraso = tempo do raio mais lento − tempo do raio axial',
    letras=[('d', 'atraso entre os dois raios, em µs (o que a questão quer)'), ('m', 'tempo do raio mais lento, em µs'), ('x', 'tempo do raio axial, em µs'),
            ('r', 'índice do revestimento escolhido'), ('v', 'velocidade da luz no núcleo, em m/s'), ('s', 'seno do ângulo limite'), ('l', 'caminho do raio mais lento, em m')],
    eq_texto='O atraso é o tempo do raio mais lento menos o do raio axial.\nAgora é só achar r, v, x, s, l e m.',
    achando=[('Achando r: o revestimento escolhido',
              'Para guiar a luz, o revestimento precisa ter índice menor que o do núcleo, 1,50. O D (1,50) é igual: não há reflexão total.\nO maior que ainda serve é o C. r = 1,45.',
              tabela('Revestimentos', ['Revest.', 'Índice', 'Guia a luz?'], [['A', '1,20', 'sim'], ['B', '1,35', 'sim'], ['C', '1,45', 'sim, o maior'], ['D', '1,50', 'não']])),
             ('Achando v: a velocidade no núcleo', 'v = c ÷ n = 3,0 × 10⁸ ÷ 1,5 = 2,0 × 10⁸ m/s.'),
             ('Achando x: o tempo do raio axial', '3,0 km = 3 000 m. x = 3 000 ÷ (2,0 × 10⁸) = 1,5 × 10⁻⁵ s.\nComo 1 µs = 10⁻⁶ s, 1,5 × 10⁻⁵ s = 15 × 10⁻⁶ s: x = 15 µs.'),
             ('Achando s: o seno do ângulo limite', 'sen θL = n do revestimento ÷ n do núcleo = 1,45 ÷ 1,50 = 145 ÷ 150 = 29/30.\ns = 29/30 ≈ 0,9667.'),
             ('Achando l: o caminho do raio lento', 'Para cada metro ao longo do eixo, o raio anda 1 ÷ s metros (θ medido da normal).\nl = 3 000 ÷ (29/30) = 3 000 · 30 ÷ 29 = 90 000 ÷ 29 ≈ 3 103,4 m.'),
             ('Achando m: o tempo do raio lento', 'm = l ÷ v = 3 103,4 ÷ (2,0 × 10⁸) = 1 551,7 ÷ 10⁸ = 1,5517 × 10⁻⁵ s.\nEm µs: 1,5517 × 10⁻⁵ = 15,517 × 10⁻⁶, então m ≈ 15,52 µs.')],
    volta='d = m − x = 15,52 − 15 = 0,52 µs.\nResposta: alternativa X. Conferindo: o raio lento anda 3 103,4 − 3 000 = 103,4 m a mais, e 103,4 ÷ (2,0 × 10⁸) = 0,517 µs.',
    valores=[('r', '1,45'), ('v', '2,0 × 10⁸ m/s'), ('x', '15 µs'), ('s', '29/30'), ('l', '3 103,4 m'), ('m', '15,52 µs')],
    pista='"fibra", "raio mais lento" e "revestimento" → só guia n menor que o do núcleo; o raio no ângulo limite anda L ÷ sen θL; o atraso é a diferença para o tempo do raio axial.',
    rec1='3,0 km; núcleo 1,50; revestimentos 1,20 a 1,50; c = 3,0 × 10⁸', rec3='r = 1,45; v = 2,0 × 10⁸; x = 15; s = 29/30; l = 3 103,4; m = 15,52',
    checagem=('Núcleo de 1,60 e revestimento de 1,20. Quanto vale o seno do ângulo limite?', ['0,75', '1,33', '0,4', '1,92'], '0,75', 'sen θL = 1,20 ÷ 1,60 = 0,75.'),
    ancora=('forte · ITA 2020 2ª fase q.9 (fibra de 3 km, raio guiado por reflexões totais: o caminho é L ÷ sen θL e o tempo, L · n² ÷ (c · n do revestimento)) '
            'e Fuvest 2025 1ª fase q.22 (tabela de índices: há reflexão total só se n1 > n2)'),
    canal='fora do canal: reflexão total e ângulo limite (0 hits); v = c/n em fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:14:31]',
    antes=['opt-reflexao-total', 'opt-indice-meio', 'dividir-por-decimal', 'potencia-de-dez'],
))


# ============ d) Harvard-MIT: raio que quica na sala de 5 m por 3 m ============
def quica(larg, alt, limite=100):
    """Simula o raio a 45° saindo do canto (0, 0): conta as reflexões até um canto. Tudo em frações."""
    x, y, dx, dy, refl, andou = Fr(0), Fr(0), 1, 1, 0, Fr(0)
    for _ in range(limite):
        tx = (larg - x) if dx > 0 else x
        ty = (alt - y) if dy > 0 else y
        t = min(tx, ty)
        x, y, andou = x + dx * t, y + dy * t, andou + t
        if x in (0, larg) and y in (0, alt):
            return refl, andou
        refl += 1
        if x in (0, larg):
            dx = -dx
        else:
            dy = -dy
    raise AssertionError('não chegou ao canto')


def mmc(a, b):
    return next(k for k in range(1, a * b + 1) if k % a == 0 and k % b == 0)


M = mmc(5, 3)
P_V, Q_H = M // 5 - 1, M // 3 - 1
assert M == 15 and (P_V, Q_H) == (2, 4) and quica(5, 3) == (6, 15) and P_V + Q_H == 6
assert abs(15 * sqrt(2) - 21.2132) < 1e-3
# o desdobramento vale para outras salas (inclusive com fator comum, em que o raio chega antes)
for _a in range(2, 9):
    for _b in range(2, 9):
        _m = mmc(_a, _b)
        assert quica(_a, _b)[0] == _m // _a - 1 + _m // _b - 1, (_a, _b)
assert mmc(6, 4) == 12 and quica(6, 4)[0] == 3
# erros típicos
assert Q_H == 4                                                           # só as paredes de 5 m
assert P_V + Q_H + 1 == 7                                                 # contou o canto como reflexão
assert M // 5 + M // 3 == 8                                               # contou as chegadas de cada eixo, o canto duas vezes
Q.append(dict(
    id='d2-escada-fis-ita-opt-00d', materia='Física', tema=T, calc=6,
    enunciado=('Uma sala retangular de 5 m por 3 m tem as quatro paredes cobertas por espelhos planos perfeitos. De um dos cantos, rente ao chão, sai um feixe de laser horizontal '
               'que faz 45° com as duas paredes que formam esse canto. O feixe quica nas paredes, sem perder energia, até chegar a um dos outros três cantos, onde um sensor o absorve. '
               'Quantas reflexões o feixe sofre nas paredes, sem contar a chegada ao canto?'),
    dados=[('Sala', '5 m por 3 m, quatro paredes espelhadas'), ('Saída', 'de um canto, a 45° com as paredes'), ('Chegada', 'num outro canto: não conta como reflexão')],
    alts=[('4', 4, 'Contou só as reflexões nas paredes de 5 m: 15 ÷ 3 − 1'),
          ('6', 6, 'OK'),
          ('7', 7, 'Contou a chegada ao canto como uma reflexão: 6 + 1'),
          ('8', 8, 'Contou as linhas até o canto nos dois eixos: 15 ÷ 5 + 15 ÷ 3 = 3 + 5'),
          ('15', 15, 'Respondeu o mmc de 5 e 3, e não o número de reflexões')],
    resumo='Desdobrando a sala, o raio anda reto com x = y; chega a um canto em mmc(5, 3) = 15; linhas verticais: 15 ÷ 5 − 1 = 2; horizontais: 15 ÷ 3 − 1 = 4; total 6 (percurso 15 · √2 ≈ 21,2 m).',
    ideia='Em vez de quicar o raio, desdobre a sala: ele anda reto, com x = y. O 1º canto vem quando x é múltiplo de 5 e y de 3, no mmc, e cada linha de parede cruzada é uma reflexão.',
    pecas=[('Desdobrar a sala', 'Copiar a sala do outro lado de cada parede, como num espelho, para o raio seguir em linha reta.'),
           ('mmc', 'O menor número que é múltiplo de 5 e de 3 ao mesmo tempo: 15.')],
    formulas=[('grafico', 'Chegada ao canto', 'x = mmc(5, 3), com x = y'), ('contagem', 'Linhas cruzadas', 'mmc ÷ medida − 1'), ('triangulo-retangulo', 'Percurso', 'x · √2')],
    eq='n = p + q', leitura='reflexões = reflexões nas paredes de 3 m + reflexões nas paredes de 5 m',
    letras=[('n', 'número total de reflexões (o que a questão quer)'), ('p', 'reflexões nas paredes de 3 m (linhas verticais cruzadas)'),
            ('q', 'reflexões nas paredes de 5 m (linhas horizontais cruzadas)'), ('m', 'distância andada em x até o 1º canto, em m')],
    eq_texto='Cada reflexão é numa parede de 3 m ou numa de 5 m, e o total é a soma das duas contagens.\nAgora é só achar m, p e q.',
    achando=[('Achando m: onde chega ao canto',
              'Desdobre a sala: o raio vai reto e anda o mesmo em x e em y. Ele chega a um canto quando x é múltiplo de 5 e y múltiplo de 3.\n'
              'Múltiplos de 5: 5, 10, 15. De 3: 3, 6, 9, 12, 15. O menor comum é m = 15 m.'),
             ('Achando p: as paredes de 3 m', 'Linhas verticais de parede em x = 5 e x = 10; em x = 15 ele já está no canto.\nSão 15 ÷ 5 = 3 salas, menos a do canto: p = 3 − 1 = 2.'),
             ('Achando q: as paredes de 5 m', 'Linhas horizontais em y = 3, 6, 9 e 12; em y = 15 ele já está no canto.\nSão 15 ÷ 3 = 5 salas, menos a do canto: q = 5 − 1 = 4.')],
    volta='n = p + q = 2 + 4 = 6.\nResposta: alternativa X. Conferindo: o raio anda 15 m em x e 15 m em y, e √(15 · 15 + 15 · 15) = 15 · √2 ≈ 21,2 m.',
    valores=[('m', '15 m'), ('p', '2'), ('q', '4')],
    pista='"raio que quica numa sala" → desdobre a sala: o raio vira uma reta; ache o 1º ponto em que x e y caem em linhas de parede (mmc) e conte as linhas cruzadas em cada eixo.',
    rec1='sala 5 m por 3 m; 45°; do canto a outro canto', rec3='m = 15; p = 2; q = 4',
    checagem=('Sala de 4 m por 2 m, raio a 45° saindo do canto. Quantas reflexões até o canto (a chegada não conta)?', ['1', '2', '3', '0'], '1',
              'Chega ao canto em x = 4; linhas verticais: 4 ÷ 4 − 1 = 0; horizontais: 4 ÷ 2 − 1 = 1.'),
    ancora=('sem · técnica: desdobramento do espelho (método das imagens, como no bilhar das olimpíadas); a mais próxima é Fuvest 2021 2ª fase F04 '
            '(método das imagens com espelho plano); HMMT 2020 a 2024 não tem luz que quica'),
    canal='fora do canal: desdobramento do espelho (0 hits); espelho plano em fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:11:34]',
    antes=['opt-espelho-desdobrado', 'opt-mmc', 'pitagoras'],
))

for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), _q['id']
    assert len(_q['ideia']) <= 300, (_q['id'], len(_q['ideia']))
