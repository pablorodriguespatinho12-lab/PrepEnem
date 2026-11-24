"""Nível acima v2 de Física: Óptica (24/11/2026, 2ª versão depois da leitura do aluno-do-zero).

a = ENEM (projetor de dois estágios: a imagem da 1ª lente vira objeto da 2ª, que se afasta; a solução "virtual" não vale; âncora de técnica ITA 2024 q.7),
b = ITA (biconvexa que diverge no líquido; ITA 2021 q.9), c = Fuvest (fibra, revestimentos e atraso do raio no ângulo limite; ITA 2020 2ª fase q.9 e Fuvest 2025 q.22),
d = Harvard-MIT (corredor de dois espelhos: quantas direções de tiro chegam ao sensor, contando as imagens do alvo; âncora por técnica, Fuvest 2021 F04).
As 4 antigas saem (a, b, c REESCREVER; d TROCAR). Conferido por assert no próprio módulo.
Uso: python3 scripts/banco-enem/montar_v2.py --seco fis_opt
"""
from fractions import Fraction as Fr

ARQUIVO = 'fisica-acima-novas.json'
T = 'Óptica'

Q = []
MANTER = {}


def tabela(titulo, cab, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cab, 'linhas': linhas}


# ============ Aulas "Antes" novas ============
ANTES_NOVOS = {
    'opt-gauss-aumento': {
        'titulo': 'Lente: 1/f = 1/p + 1/q e o aumento',
        'linhas': [
            'Lente delgada: 1/f = 1/p + 1/q. f é o foco, p a distância do objeto à lente e q a da imagem à lente, na mesma unidade.',
            'Lente convergente tem f positivo. Objeto além do foco (p maior que f) dá imagem real (q positivo), de cabeça para baixo.',
            'Objeto dentro do foco (p menor que f): 1/q sai negativo e a imagem é virtual, direita e do lado do objeto; ela não aparece na parede.',
            'Aumento: g = q ÷ p (sem o sinal). Altura da imagem = g · altura do objeto.',
            'Exemplo, f = 20 e p = 30: 1/q = 1/20 − 1/30 = 3/60 − 2/60 = 1/60, então q = 60 e g = 60 ÷ 30 = 2.',
        ],
        'visual': tabela('Exemplo com f = 20', ['p', 'q', 'g'], [['30', '60 (real)', '2'], ['40', '40 (real)', '1'], ['10', '−20 (virtual)', '2']]),
        'exercicios': [
            {'enunciado': 'Lente de f = 10 cm e objeto a 15 cm. A que distância da lente fica a imagem?', 'alternativas': ['30 cm', '6 cm', '25 cm', '5 cm'], 'certa': 0,
             'resolucao': '30 cm: 1/q = 1/10 − 1/15 = 3/30 − 2/30 = 1/30, então q = 30 cm.\n6 cm soma os dois inversos; 25 cm soma 10 + 15; 5 cm subtrai 15 − 10.'},
            {'enunciado': 'Lente de f = 10 cm e objeto a 5 cm. Como é a imagem?', 'alternativas': ['Virtual, a 10 cm', 'Real, a 10 cm', 'Virtual, a 3,3 cm', 'Real, a 3,3 cm'], 'certa': 0,
             'resolucao': 'Virtual, a 10 cm: 1/q = 1/10 − 1/5 = 1/10 − 2/10 = −1/10, e q = −10 (negativo: virtual).\nReal, a 10 cm esquece o sinal; os de 3,3 cm somam os inversos.'},
        ],
    },
    'opt-duas-lentes': {
        'titulo': 'Duas lentes em fila',
        'linhas': [
            'Duas lentes em fila: a imagem da lente 1 vira o objeto da lente 2. Resolva a lente 1 primeiro e depois a lente 2.',
            'Se as lentes estão a uma distância D e a imagem 1 está a q1 da lente 1, o objeto da lente 2 está a p2 = D − q1.',
            'Se p2 for menor que f2, a lente 2 dá imagem virtual. Ela só aparece na parede quando p2 passa de f2.',
            'Aumento total: g1 · g2. A altura final é a altura do objeto vezes g1 vezes g2.',
            'Exemplo: f1 = 10 e p1 = 15 dão q1 = 30 e g1 = 2. Com D = 50, p2 = 50 − 30 = 20. Com f2 = 10: 1/q2 = 1/10 − 1/20 = 1/20, q2 = 20, g2 = 1. Total: 2 · 1 = 2.',
        ],
        'visual': tabela('Exemplo com duas lentes', ['Etapa', 'Conta', 'Resultado'], [['Lente 1', '1/q1 = 1/10 − 1/15', 'q1 = 30, g1 = 2'], ['Objeto da 2', 'p2 = 50 − 30', '20'], ['Lente 2', '1/q2 = 1/10 − 1/20', 'q2 = 20, g2 = 1']]),
        'exercicios': [
            {'enunciado': 'A lente 1 forma a imagem a 30 cm dela. A lente 2 está a 50 cm da lente 1. A que distância da lente 2 está esse objeto?', 'alternativas': ['20 cm', '80 cm', '30 cm', '50 cm'], 'certa': 0,
             'resolucao': '20 cm: p2 = D − q1 = 50 − 30 = 20 cm.\n80 cm soma; 30 cm é só a imagem 1; 50 cm é só a distância entre as lentes.'},
            {'enunciado': 'Objeto de 2 cm, g1 = 3 e g2 = 4. Qual a altura da imagem final?', 'alternativas': ['24 cm', '14 cm', '6 cm', '8 cm'], 'certa': 0,
             'resolucao': '24 cm: 2 · 3 · 4 = 24 cm.\n14 cm soma os aumentos; 6 cm usa só g1; 8 cm usa só g2.'},
        ],
    },
    'opt-indice-meio': {
        'titulo': 'Índice de refração: n = c ÷ v',
        'linhas': [
            'O índice de refração n diz quantas vezes a luz é mais lenta no meio do que no vácuo: n = c ÷ v. No vácuo n = 1; no vidro, perto de 1,5.',
            'c = 3,0 × 10⁸ m/s. Num meio com n = 1,5: v = 3,0 × 10⁸ ÷ 1,5 = 2,0 × 10⁸ m/s.',
            'Ao entrar no meio, a frequência da onda não muda e o comprimento de onda encolhe: λ no meio = λ no vácuo ÷ n.',
            'Então n = λ no vácuo ÷ λ no meio. Luz de 600 nm no vácuo e 400 nm no vidro: n = 600 ÷ 400 = 1,5. (1 nm = 10⁻⁹ m)',
            'Pela velocidade: se v = 1,5 × 10⁸ m/s, então n = (3,0 × 10⁸) ÷ (1,5 × 10⁸) = 3,0 ÷ 1,5 = 2,0, pois os 10⁸ se cancelam.',
        ],
        'visual': tabela('Índice e velocidade', ['Meio', 'n', 'v'], [['vácuo', '1,0', '3,0 × 10⁸ m/s'], ['vidro', '1,5', '2,0 × 10⁸ m/s'], ['líquido', '2,0', '1,5 × 10⁸ m/s']]),
        'exercicios': [
            {'enunciado': 'A luz anda a 2,0 × 10⁸ m/s num material. Qual o índice de refração? (c = 3,0 × 10⁸ m/s)', 'alternativas': ['1,5', '0,67', '6', '1,0'], 'certa': 0,
             'resolucao': '1,5: n = c ÷ v = (3,0 × 10⁸) ÷ (2,0 × 10⁸) = 3,0 ÷ 2,0 = 1,5.\n0,67 inverte a divisão; 6 multiplica; 1,0 é o índice do vácuo.'},
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
            {'enunciado': 'Uma lente biconvexa tem N = 0,8 (o índice do meio é maior que o dela). Ela converge ou diverge?', 'alternativas': ['Diverge', 'Converge', 'Não desvia', 'Depende do raio'], 'certa': 0,
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
            'Numa fibra reta, o raio vai e volta. sen θ = avanço no eixo ÷ caminho do raio. Para avançar L no eixo, ele anda L ÷ sen θ.',
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
        'titulo': 'Espelho plano: a imagem do alvo',
        'linhas': [
            'Espelho plano: a imagem de um ponto fica do outro lado, à mesma distância. Ponto (8, 1) e espelho na linha y = 0: a imagem é (8, −1).',
            'Um raio que sai de P, bate no espelho e chega ao alvo T segue, no desenho desdobrado, como uma reta de P até a imagem T\' do alvo.',
            'O ponto em que essa reta cruza a linha do espelho é onde o raio bate de verdade.',
            'Com mais espelhos, reflete-se de novo a imagem. Cada linha de espelho que a reta cruza é uma reflexão.',
            'Se a reta não cruza nenhum espelho, é o raio direto. A inclinação da reta é (y final − y inicial) ÷ (distância em x).',
        ],
        'visual': tabela('Um espelho em y = 0', ['Ponto', 'Imagem no espelho', 'O que vale'], [['T = (8, 1)', "T' = (8, −1)", 'o raio refletido aponta para T\''], ['P = (0, 3)', 'fica onde está', 'sai de P']]),
        'exercicios': [
            {'enunciado': 'Espelho na linha y = 0 e alvo T = (8, 1). Onde fica a imagem de T no espelho?', 'alternativas': ['(8, −1)', '(−8, 1)', '(8, 1)', '(−8, −1)'], 'certa': 0,
             'resolucao': '(8, −1): o x fica e o y troca de sinal.\n(−8, 1) troca o x; (8, 1) é o próprio alvo; (−8, −1) troca os dois.'},
            {'enunciado': 'Um raio sai de P = (0, 3), bate no espelho y = 0 e chega a T = (8, 1). Em que x ele bate no espelho?', 'alternativas': ['x = 6', 'x = 4', 'x = 8', 'x = 3'], 'certa': 0,
             'resolucao': 'x = 6: a reta de (0, 3) até T\' = (8, −1) cai 4 em 8 de x, ou seja, 1 a cada 2. Para cair 3, anda x = 6.\nx = 4 supõe queda de 2; x = 8 é o alvo.'},
        ],
    },
    'opt-contar-no-intervalo': {
        'titulo': 'Contar valores do tipo 2 + 6 · j num intervalo',
        'linhas': [
            'j é um número inteiro, que pode ser negativo. Em 2 + 6 · j: j = 0 dá 2; j = 1 dá 8; j = −1 dá −4; j = −2 dá −10.',
            'Para contar quantos valores cabem entre dois limites, teste j em ordem até sair do intervalo pelos dois lados.',
            'Valores no limite só entram se o texto disser "até" ou "inclusive". Fora dos limites, não contam.',
            'Duas listas diferentes, como 2 + 6 · j e −2 + 6 · j, contam-se separadas e depois somam-se.',
            'Exemplo: valores de 2 + 6 · j entre −11 e 13: −10, −4, 2, 8 (14 passa de 13; −16 passa de −11). São 4.',
        ],
        'visual': tabela('2 + 6 · j entre −11 e 13', ['j', 'Valor', 'Entra?'], [['−3', '−16', 'não'], ['−2', '−10', 'sim'], ['1', '8', 'sim'], ['2', '14', 'não']]),
        'exercicios': [
            {'enunciado': 'Quantos valores da forma 1 + 4 · j (j inteiro) estão entre 0 e 10?', 'alternativas': ['3', '2', '4', '5'], 'certa': 0,
             'resolucao': '3: j = 0, 1, 2 dão 1, 5 e 9 (j = 3 dá 13, passa de 10; j = −1 dá −3, sai).\n2 esquece um; 4 e 5 contam valores fora.'},
            {'enunciado': 'Quantos valores da forma 3 + 5 · j (j inteiro) estão entre −8 e 12?', 'alternativas': ['4', '3', '5', '2'], 'certa': 0,
             'resolucao': '4: j = −2, −1, 0, 1 dão −7, −2, 3 e 8 (j = 2 dá 13, passa de 12; j = −3 dá −12, sai).\n3 esquece o −7; 5 conta o 13; 2 conta só os positivos.'},
        ],
    },
    'opt-multiplicar-fracoes': {
        'titulo': 'Multiplicar frações e dividir por fração',
        'linhas': [
            'Multiplicar fração: em cima com em cima, embaixo com embaixo. (2/3) · (3/5) = (2 · 3) ÷ (3 · 5) = 6/15.',
            'Simplificar: divida em cima e embaixo pelo mesmo número. 6/15, dividindo por 3, vira 2/5.',
            'Com sinal de menos: um negativo e um positivo dão negativo. (−1/16) · (2/15) = −2/240 = −1/120 (dividi por 2 em cima e embaixo).',
            'Dividir por fração é multiplicar pelo inverso (a fração virada). 3 000 ÷ (29/30) = 3 000 · 30/29 = 90 000/29.',
            'Número inteiro é fração sobre 1: 3 000 = 3 000/1.',
        ],
        'visual': tabela('Exemplos', ['Conta', 'Passo', 'Resultado'], [['(2/3) · (3/5)', '6/15', '2/5'], ['(−1/16) · (2/15)', '−2/240', '−1/120'], ['12 ÷ (3/4)', '12 · 4/3', '16']]),
        'exercicios': [
            {'enunciado': 'Quanto é (3/4) · (2/5)?', 'alternativas': ['3/10', '5/9', '6/9', '5/20'], 'certa': 0,
             'resolucao': '3/10: (3 · 2) ÷ (4 · 5) = 6/20 e, dividindo por 2, 3/10.\n5/9 soma em cima e embaixo; 6/9 mistura as contas; 5/20 soma em cima.'},
            {'enunciado': 'Quanto é 12 ÷ (3/4)?', 'alternativas': ['16', '9', '4', '3'], 'certa': 0,
             'resolucao': '16: 12 ÷ (3/4) = 12 · 4/3 = 48/3 = 16.\n9 multiplica por 3/4; 4 e 3 dividem por 3 ou por 4 sem inverter.'},
        ],
    },
    'opt-dividir-decimal': {
        'titulo': 'Dividir por número com vírgula',
        'linhas': [
            'Para dividir por decimal, multiplique os dois lados por 10, 100 ou 1 000 até o divisor ficar inteiro. 3,0 ÷ 1,5 = 30 ÷ 15 = 2.',
            'Com 1,875 (3 casas depois da vírgula), multiplique por 1 000: 3,0 ÷ 1,875 = 3 000 ÷ 1 875.',
            '1 875 cabe 1 vez em 3 000 e sobram 1 125. Como 1 875 · 0,6 = 1 125, a conta dá 1 + 0,6 = 1,6.',
            'Confira pela volta: 1 875 · 1,6 = 1 875 + 1 125 = 3 000.',
        ],
        'visual': tabela('Dividir por decimal', ['Conta', 'Passo', 'Resultado'], [['3,0 ÷ 1,5', '30 ÷ 15', '2'], ['2,4 ÷ 0,8', '24 ÷ 8', '3'], ['3,0 ÷ 1,875', '3 000 ÷ 1 875', '1,6']]),
        'exercicios': [
            {'enunciado': 'Quanto é 4,5 ÷ 1,5?', 'alternativas': ['3', '0,3', '30', '6,75'], 'certa': 0,
             'resolucao': '3: 4,5 ÷ 1,5 = 45 ÷ 15 = 3.\n0,3 e 30 erram a vírgula; 6,75 multiplica.'},
            {'enunciado': 'Quanto é 2,4 ÷ 0,8?', 'alternativas': ['3', '0,3', '1,92', '1,6'], 'certa': 0,
             'resolucao': '3: 2,4 ÷ 0,8 = 24 ÷ 8 = 3.\n0,3 erra a vírgula; 1,92 multiplica; 1,6 subtrai.'},
        ],
    },
    'opt-potencia-dividir': {
        'titulo': 'Dividir por potência de dez e microssegundo',
        'linhas': [
            '10² = 100, 10³ = 1 000 e 10⁸ = 100 000 000 (1 seguido de 8 zeros).',
            'Dividir por 10⁸: a vírgula anda 8 casas para a esquerda. 1 500 ÷ 10⁸ = 0,000 015.',
            'Dividir por 2,0 × 10⁸ é dividir por 2 e depois por 10⁸. 3 000 ÷ (2 × 10⁸): 3 000 ÷ 2 = 1 500; 1 500 ÷ 10⁸ = 0,000 015.',
            '1 µs (microssegundo) = 0,000 001 s = 10⁻⁶ s. Então 0,000 015 s = 15 µs.',
            'Mesma potência em cima e embaixo: elas se cancelam. (3 × 10⁸) ÷ (2 × 10⁸) = 3 ÷ 2.',
        ],
        'visual': tabela('Segundos em µs', ['Segundos', 'Conta', 'µs'], [['0,000 001', '1 · 10⁻⁶', '1'], ['0,000 015', '15 · 10⁻⁶', '15'], ['0,000 04', '40 · 10⁻⁶', '40']]),
        'exercicios': [
            {'enunciado': 'Quanto é 2 000 ÷ (4 × 10⁵)?', 'alternativas': ['0,005', '0,05', '5', '0,0005'], 'certa': 0,
             'resolucao': '0,005: 2 000 ÷ 4 = 500 e 500 ÷ 10⁵ = 500 ÷ 100 000 = 0,005.\n0,05 e 0,0005 erram uma casa; 5 não divide pela potência.'},
            {'enunciado': 'Quantos microssegundos são 0,000 04 s?', 'alternativas': ['40 µs', '4 µs', '400 µs', '0,4 µs'], 'certa': 0,
             'resolucao': '40 µs: 0,000 04 = 40 · 0,000 001 s = 40 µs.\n4 µs, 400 µs e 0,4 µs erram uma casa.'},
        ],
    },
    'opt-ponto-vezes': {
        'titulo': 'Ponto é vezes, parênteses e conta cruzada',
        'linhas': [
            'O ponto · e o sinal × querem dizer vezes: 3 · 4 = 12. O sinal ÷ quer dizer dividido por.',
            'Parênteses primeiro: 2 · (3 + 4) = 2 · 7 = 14.',
            'Letra com número, como p2 ou q1, é um nome só (a distância 2 ou a imagem 1). 4 · p2 é 4 vezes p2.',
            'Fração com conta embaixo: 5/(4 · p2) é 5 dividido por (4 vezes p2).',
            'Conta cruzada: se 1/10 = 5/(4 · p2), então 4 · p2 = 5 · 10 = 50 e p2 = 50 ÷ 4 = 12,5.',
        ],
        'visual': tabela('Conta cruzada', ['Passo', 'Conta'], [['Igualdade', '1/10 = 5/(4 · p2)'], ['Cruzo', '4 · p2 = 5 · 10 = 50'], ['Divido por 4', 'p2 = 12,5']]),
        'exercicios': [
            {'enunciado': 'Quanto vale 3 · (2 + 5)?', 'alternativas': ['21', '11', '30', '13'], 'certa': 0,
             'resolucao': '21: primeiro o parêntese, 2 + 5 = 7, e 3 · 7 = 21.\n11 faz 3 · 2 + 5; 30 e 13 misturam os sinais.'},
            {'enunciado': 'Se 4 · x = 50, quanto vale x?', 'alternativas': ['12,5', '200', '46', '54'], 'certa': 0,
             'resolucao': '12,5: x = 50 ÷ 4 = 12,5.\n200 multiplica; 46 e 54 subtraem ou somam.'},
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
assert Fr(1, 10) - Fr(1, 15) == Fr(1, 30) and Fr(1, 10) - Fr(1, 5) == Fr(-1, 10) and Fr(1, 20) - Fr(1, 30) == Fr(1, 60)
assert Fr(1, 10) - Fr(1, 20) == Fr(1, 20) and 50 - 30 == 20 and 2 * 3 * 4 == 24
assert Fr(1, 2) * (Fr(1, 20) + Fr(1, 20)) == Fr(1, 20) and Fr(1, 2) * Fr(2, 10) == Fr(1, 10)
assert Fr(600, 400) == Fr(3, 2) and Fr(500, 400) == Fr(5, 4) and Fr(30, 20) == Fr(3, 2)
assert Fr(3, 4) * Fr(2, 5) == Fr(3, 10) and Fr(2, 3) * Fr(3, 5) == Fr(2, 5) and Fr(-1, 16) * Fr(2, 15) == Fr(-1, 120) and 12 / Fr(3, 4) == 16 and 3000 / Fr(29, 30) == Fr(90000, 29)
assert Fr(3000, 1875) == Fr(8, 5) and 1875 * Fr(16, 10) == 3000 and 3000 - 1875 == 1125 and 1875 * Fr(6, 10) == 1125 and Fr(45, 15) == 3 and Fr(24, 8) == 3
assert Fr(2000, 4 * 10**5) == Fr(5, 1000) and Fr(1500, 10**8) == Fr(15, 10**6) and Fr(40, 10**6) == Fr(4, 10**5)
assert 3 * (2 + 5) == 21 and Fr(50, 4) == Fr(25, 2) and Fr(1, 10) == Fr(5, 4 * Fr(25, 2))
assert [1 + 4 * j for j in range(-3, 6) if 0 <= 1 + 4 * j <= 10] == [1, 5, 9]
assert [3 + 5 * j for j in range(-6, 6) if -8 <= 3 + 5 * j <= 12] == [-7, -2, 3, 8]
assert [2 + 6 * j for j in range(-6, 6) if -11 <= 2 + 6 * j <= 13] == [-10, -4, 2, 8]
assert (0 - Fr(3)) / 8 == Fr(-3, 8) and Fr(3) / (Fr(4, 8)) == 6          # ex. do espelho: de (0, 3) a (8, −1), cai 1 a cada 2 e bate em x = 6

# ============ a) ENEM: projetor de dois estágios ============
F1, F2, P1 = Fr(5), Fr(10), Fr(6)         # cm
ALT_SLIDE, D0, VEL, ALVO_ALT = Fr(36, 10), Fr(75, 2), Fr(1, 2), Fr(72)
Q1 = 1 / (1 / F1 - 1 / P1)
G1 = Q1 / P1
H1 = G1 * ALT_SLIDE
assert (Q1, G1, H1) == (30, 5, 18)
G2 = ALVO_ALT / H1
assert G2 == 4
P2 = F2 * (G2 + 1) / G2                    # q2 = g2 · p2  =>  1/f = (1/p2) · (1 + 1/g2)
assert P2 == Fr(25, 2) and 1 / P2 + 1 / (G2 * P2) == 1 / F2 and P2 > F2           # imagem real
DF = Q1 + P2
T_A = (DF - D0) / VEL
assert (DF, T_A) == (Fr(85, 2), 10)
# a solução "virtual" (p2 menor que f2, aumento f2 ÷ (f2 − p2) = 4) já vale em t = 0: não é imagem na parede
P2_VIRT = F2 * (1 - 1 / G2)
assert P2_VIRT == Fr(15, 2) and D0 - Q1 == P2_VIRT and P2_VIRT < F2
assert (Q1 + P2_VIRT - D0) / VEL == 0
# real a 4x só em p2 = 12,5; confere o caminho todo pelo tempo: p2(t) = D0 + v · t − q1
for _t in (0, 5, 10, 15):
    _p2 = D0 + VEL * _t - Q1
    if _p2 > F2:
        _q2 = 1 / (1 / F2 - 1 / _p2)
        assert (_q2 / _p2 * H1 == ALVO_ALT) == (_t == 10)
# erros típicos
_g2_sem_g1 = ALVO_ALT / ALT_SLIDE            # esqueceu a lente 1: objeto da lente 2 teria 3,6 cm
assert _g2_sem_g1 == 20
_p2_sem = F2 * (_g2_sem_g1 + 1) / _g2_sem_g1
assert _p2_sem == Fr(21, 2) and (Q1 + _p2_sem - D0) / VEL == 6
assert DF / VEL == 85                          # esqueceu a distância inicial
assert (DF - D0) * 10 / Fr(1, 2) == 100        # leu 0,50 cm/s como 0,50 mm/s: 50 mm ÷ 0,50 mm/s

ENUN_A = ('Na feira de ciências, o professor de Física monta sobre um trilho um projetor de dois estágios. Um slide com 3,6 cm no lado maior, iluminado por uma lâmpada de 150 W '
          'e tirado de um carrossel de 24 slides, fica a 6,0 cm de uma lente convergente de foco 5,0 cm. A 37,5 cm dessa primeira lente há uma segunda lente convergente, '
          'de foco 10,0 cm, e uma parede móvel que ele desloca para acompanhar a imagem final. Para ampliar a imagem, o professor começa a afastar a segunda lente da primeira, '
          'em linha reta pelo trilho, a 0,50 cm/s, mantendo parados o slide e a primeira lente. Ele quer ver na parede uma imagem nítida do lado maior do slide com 72 cm de altura.\n\n'
          'Quantos segundos depois de começar o afastamento isso acontece?')
assert len(ENUN_A) >= 600, len(ENUN_A)
Q.append(dict(
    id='d2-escada-fis-ita-opt-00a', materia='Física', tema=T, calc=10,
    enunciado=ENUN_A,
    dados=[('Lâmpada 150 W e 24 slides', 'não entram na conta'), ('Slide', '3,6 cm no lado maior, a 6,0 cm da lente 1'), ('Lente 1', 'convergente, foco f1 = 5,0 cm'),
           ('Lente 2', 'convergente, foco f2 = 10,0 cm'), ('Distância inicial entre as lentes', '37,5 cm'), ('Afastamento da lente 2', '0,50 cm/s, em linha reta'),
           ('Imagem pedida na parede', 'nítida, 72 cm de altura')],
    alts=[('0 s', 0, "Tomou a solução em que a lente 2 está dentro do foco (p2 = 7,5 cm, aumento 4): já vale no início, mas a imagem é virtual e não aparece na parede"),
          ('6 s', 6, 'Usou g2 = 72 ÷ 3,6 = 20 (esqueceu o aumento 5 da lente 1) mas manteve q1 = 30 cm: p2 = 10,5 cm, Df = 30 + 10,5 = 40,5 cm, (40,5 − 37,5) ÷ 0,50 = 6 s'),
          ('10 s', 10, 'OK'),
          ('85 s', 85, 'Dividiu a distância final entre as lentes (42,5 cm) pela velocidade, sem tirar os 37,5 cm do início'),
          ('100 s', 100, 'Leu 0,50 cm/s como 0,50 mm/s: 50 mm ÷ 0,50 mm/s')],
    resumo='1/q1 = 1/5 − 1/6 = 1/30, q1 = 30 cm, imagem 1 de 18 cm; g2 = 72 ÷ 18 = 4; 1/10 = 5/(4 · p2), p2 = 12,5 cm (maior que 10: real); Df = 30 + 12,5 = 42,5 cm; t = (42,5 − 37,5) ÷ 0,50 = 10 s.',
    ideia='A imagem da lente 1 é o objeto da lente 2, e o aumento total é o produto dos dois. O aumento 4 da lente 2 aparece duas vezes, com a lente dentro do foco (virtual) e fora dele (real): só a real aparece na parede.',
    pecas=[('Imagem 1 vira objeto', 'A imagem que a lente 1 forma é o objeto da lente 2. O tamanho dela (18 cm) é o que a lente 2 amplia.'),
           ('Imagem real e virtual', 'Real: aparece na parede (objeto além do foco). Virtual: não aparece na parede (objeto dentro do foco).')],
    formulas=[('lente', 'Equação da lente', '1/f = 1/p + 1/q'), ('lente', 'Aumento', 'g = q ÷ p'), ('carro', 'Movimento uniforme', 't = deslocamento ÷ v')],
    desenho=('Veja o projetor, fora de escala: o slide, a lente 1, a lente 2 e a parede. A lente 2 se afasta da lente 1 pelo trilho.', 'projetor-duas-lentes', []),
    eq='t = (Df − D0) ÷ v', leitura='tempo = (distância final entre as lentes − distância inicial) ÷ velocidade de afastamento',
    letras=[('t', 'tempo de afastamento, em s (o que a questão quer)'), ('Df', 'distância entre as lentes quando a imagem tem 72 cm, em cm'),
            ('D0', 'distância entre as lentes no início, em cm'), ('v', 'velocidade de afastamento da lente 2, em cm/s'),
            ('q1', 'distância da imagem 1 até a lente 1, em cm'), ('h1', 'altura da imagem 1, em cm'),
            ('g2', 'aumento da lente 2 quando a imagem final tem 72 cm'), ('p2', 'distância da imagem 1 (objeto da lente 2) até a lente 2, em cm')],
    eq_texto='A lente 2 anda de D0 até Df com velocidade v, e o tempo é essa distância dividida por v.\nAgora é só achar v, D0, q1, h1, g2, p2 e Df.',
    achando=[('Achando v: a velocidade da lente 2', 'A lente 2 se afasta 0,50 cm a cada segundo: v = 0,50 cm/s.'),
             ('Achando D0: a distância do começo', 'No começo, as lentes estão a 37,5 cm uma da outra: D0 = 37,5 cm.'),
             ('Achando q1: a imagem da lente 1', 'Com f1 = 5 e p1 = 6 (cm): 1/q1 = 1/5 − 1/6 = 6/30 − 5/30 = 1/30.\nq1 = 30 cm, depois da lente 1.'),
             ('Achando h1: o tamanho da imagem 1', 'A lente 1 aumenta q1 ÷ p1 = 30 ÷ 6 = 5 vezes o objeto de 3,6 cm: h1 = 5 · 3,6. Como 5 · 3 = 15 e 5 · 0,6 = 3, h1 = 18 cm.\nÉ esse tamanho que a lente 2 vai ampliar.'),
             ('Achando g2: o aumento da lente 2', 'A imagem final deve ter 72 cm e o objeto da lente 2 tem 18 cm.\ng2 = 72 ÷ 18 = 4.'),
             ('Achando p2: onde está o objeto da lente 2',
              'q2 é a distância da imagem final à lente 2. g2 = q2 ÷ p2, então q2 = 4 · p2. Com f2 = 10: 1/10 = 1/p2 + 1/(4 · p2).\n'
              'Troque 1/p2 por 4/(4 · p2): multiplicar em cima e embaixo por 4 não muda a fração (1/5 = 4/20). Então 1/10 = 4/(4 · p2) + 1/(4 · p2) = 5/(4 · p2).\n'
              'Cruzando: 4 · p2 = 5 · 10 = 50, p2 = 50 ÷ 4 = 12,5 cm. É maior que f2 = 10: imagem real, aparece na parede.',
              {'tipo': 'diagrama', 'nome': 'projetor-duas-lentes', 'rotulos': ['', '', '', '', '', '', '', 'imagem 1: 18 cm, a 30 cm da lente 1', 'p2 = 12,5 cm']}),
             ('Achando Df: a distância entre as lentes', 'A imagem 1 está a q1 = 30 cm da lente 1, e o objeto da lente 2 fica a p2 = 12,5 cm antes dela.\nDf = 30 + 12,5 = 42,5 cm.')],
    volta=('t = (Df − D0) ÷ v = (42,5 − 37,5) ÷ 0,50 = 5 ÷ 0,5 = 10 s.\nResposta: alternativa X. Conferindo: 0,50 · 10 = 5 cm. Em t = 0, p2 = 37,5 − 30 = 7,5 cm (dentro do foco): '
           'q2 = −30 (virtual), aumento 30 ÷ 7,5 = 4, mas não aparece na parede. Por isso 0 s não serve.'),
    valores=[('v', '0,50 cm/s'), ('D0', '37,5 cm'), ('q1', '30 cm'), ('h1', '18 cm'), ('g2', '4'), ('p2', '12,5 cm'), ('Df', '42,5 cm')],
    pista='"duas lentes" e "imagem na parede" → a imagem da lente 1 é o objeto da lente 2; ache o aumento que falta, veja se a imagem é real (p2 maior que f2) e divida o deslocamento pela velocidade.',
    rec1='f1 = 5; p1 = 6; f2 = 10; D0 = 37,5; v = 0,50; imagem de 72 cm', rec3='q1 = 30; h1 = 18; g2 = 4; p2 = 12,5; Df = 42,5',
    checagem=('A lente 1 forma a imagem a 30 cm dela e as lentes estão a 50 cm uma da outra. Qual a distância dessa imagem até a lente 2?', ['20 cm', '80 cm', '30 cm', '50 cm'], '20 cm', 'p2 = 50 − 30 = 20 cm.'),
    ancora=("parcial · ITA 2024 q.7 (microscópio de duas lentes: Gauss duas vezes, a imagem da objetiva vira objeto da ocular e o aumento é o produto); "
            "no ENEM 2019 a 2023 não há conta de lente: o estilo e o tamanho são de ENEM, a técnica é a de ITA, com Cinemática (movimento uniforme) junto"),
    canal='fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [7:55:30] (lentes, foco e imagem)',
    antes=['opt-duas-lentes', 'opt-gauss-aumento', 'velocidade', 'opt-ponto-vezes', 'opt-multiplicar-fracoes'],
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
    q = 1 / (1 / f - 1 / obj)
    return q, abs(q) / obj * alt


assert altura(Fr(15)) == (24, Fr(24, 5))                                                          # foco do ar: real a 24 cm, 4,8 cm
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
    alts=[('Convergente; imagem real, a 24 cm da lente, com 4,8 cm de altura', 4.8, "Usou o foco da lente no ar (15 cm), sem trocar o meio: 1/q = 1/15 − 1/40"),
          ('Divergente; imagem virtual, a 26 cm da lente, com 5,2 cm de altura', 5.217391304, 'Usou a diferença nv − nl = −0,1 em vez da razão: f = −75 cm'),
          ('Divergente; imagem virtual, a 30 cm da lente, com 6,0 cm de altura', 6, 'OK'),
          ('Divergente; imagem virtual, a 60 cm da lente, com 12 cm de altura', 12, "Perdeu o sinal do foco em Gauss: usou f = +120 cm e 1/q = 1/120 − 1/40"),
          ('Convergente; imagem virtual, a 62 cm da lente, com 12,4 cm de altura', 12.413793103, 'Inverteu a razão (N = 1,6 ÷ 1,5): f = +112,5 cm, objeto dentro do foco')],
    resumo="nv = 600 ÷ 400 = 1,5; nl = 3,0 ÷ 1,875 = 1,6; N = 15/16; 1/f = (−1/16) · (2/15) = −1/120, f = −120 cm; 1/q = −1/120 − 1/40 = −1/30, q = −30 cm; g = 30 ÷ 40 = 0,75; imagem de 6 cm.",
    ideia='O que decide é a razão entre o índice da lente e o do meio. Como o líquido tem índice de refração maior que o do vidro, a biconvexa diverge, e a imagem de um objeto real é virtual, direita e menor.',
    pecas=[('Razão N', 'N = nv ÷ nl, o índice da lente dividido pelo do meio. Menor que 1 faz a lente divergir.'),
           ('Foco negativo', 'Lente divergente: f entra com sinal de menos, e a imagem de objeto real é virtual (q negativo).')],
    formulas=[('onda', 'Índice pelo λ', 'n = λ vácuo ÷ λ no meio'), ('onda', 'Índice pela velocidade', 'n = c ÷ v'), ('lente', 'Razão dos índices', 'N = nv ÷ nl'),
              ('lente', 'Fabricantes', '1/f = (N − 1) · (1/R1 + 1/R2)'), ('lente', 'Gauss', '1/f = 1/p + 1/q')],
    eq='hi = g · ho', leitura='altura da imagem = aumento · altura do objeto',
    letras=[('hi', 'altura da imagem, em cm (o que a questão quer)'), ('g', 'aumento da lente'), ('ho', 'altura do objeto, em cm'),
            ('p', 'distância do objeto à lente, em cm'), ('q', 'distância da imagem à lente, em cm (negativa se for virtual)'),
            ('f', 'distância focal da lente no líquido, em cm'), ('N', 'índice da lente ÷ índice do líquido'),
            ('nv', 'índice de refração do vidro'), ('nl', 'índice de refração do líquido')],
    eq_texto='A imagem tem o tamanho do objeto vezes o aumento.\nAgora é só achar ho, p, nv, nl, N, f, q e g.',
    achando=[('Achando ho: a altura do objeto', 'O enunciado dá o objeto com 8,0 cm de altura.\nho = 8 cm.'),
             ('Achando p: a distância do objeto', 'O objeto está a 40 cm da lente.\np = 40 cm.'),
             ('Achando nv: o índice do vidro', 'A frequência não muda e o comprimento de onda cai: n = λ no vácuo ÷ λ no vidro.\nnv = 600 ÷ 400 = 1,5.'),
             ('Achando nl: o índice do líquido',
              'nl = c ÷ v = (3,0 × 10⁸) ÷ (1,875 × 10⁸). Os 10⁸ se cancelam: 3,0 ÷ 1,875.\nMultiplico os dois por 1 000: 3 000 ÷ 1 875. Cabe 1 vez (1 875) e sobram 1 125.\n'
              '1 875 · 0,6 = 1 125, então nl = 1,6. Confere: 1 875 · 1,6 = 3 000.'),
             ('Achando N: o índice relativo', 'N = nv ÷ nl = 1,5 ÷ 1,6 = 15 ÷ 16 (multiplico os dois por 10; a conta não muda).\nN é menor que 1: N − 1 = 15/16 − 1 = 15/16 − 16/16 = −1/16, pois 1 = 16/16 e 15 − 16 = −1.'),
             ('Achando f: o foco no líquido',
              '1/f = (N − 1) · (1/10 + 1/30). Primeiro 1/10 + 1/30 = 3/30 + 1/30 = 4/30 = 2/15.\n'
              'Multiplicar fração: em cima com em cima, embaixo com embaixo: (−1/16) · (2/15) = (−1 · 2) ÷ (16 · 15) = −2/240.\nDividindo por 2 em cima e embaixo: 1/f = −1/120. f = −120 cm: a lente diverge.'),
             ('Achando q: onde fica a imagem', '1/f = 1/p + 1/q, então 1/q = 1/f − 1/p = −1/120 − 1/40 = −1/120 − 3/120 (1/40 = 3/120). Tirar 3 de −1 anda para o lado negativo: −1 − 3 = −4, então −4/120. Dividindo em cima e embaixo por 4: −1/30.\nq = −30 cm: negativo, imagem virtual a 30 cm da lente.'),
             ('Achando g: o aumento', 'g = q ÷ p sem o sinal: 30 ÷ 40 = 3/4 = 0,75.\nMenor que 1: a imagem é menor. (Virtual de objeto real é direita.)')],
    volta='hi = g · ho = 0,75 · 8 = 6 cm.\nResposta: alternativa X. Conferindo: lente divergente, imagem virtual, a 30 cm e com 6 cm de altura.',
    valores=[('ho', '8 cm'), ('p', '40 cm'), ('nv', '1,5'), ('nl', '1,6'), ('N', '15/16'), ('f', '−120 cm'), ('q', '−30 cm'), ('g', '0,75')],
    pista='"lente mergulhada em líquido" → ache os dois índices (λ e velocidade), use a razão N = índice da lente ÷ índice do meio: N menor que 1 faz o foco negativo (lente divergente) e a imagem virtual.',
    rec1='raios 10 e 30 cm; 600 e 400 nm; 1,875 × 10⁸ m/s; objeto 8 cm a 40 cm', rec3='nv = 1,5; nl = 1,6; N = 15/16; f = −120; q = −30; g = 0,75',
    checagem=('Uma lente biconvexa de vidro (n = 1,5) é mergulhada num líquido de n = 2,0. Ela converge ou diverge?', ['Diverge', 'Converge', 'Não desvia', 'Depende do objeto'], 'Diverge',
              'N = 1,5 ÷ 2,0 = 0,75, menor que 1: o foco é negativo e a lente diverge.'),
    ancora=('forte · ITA 2021 q.9 (lente biconvexa imersa num líquido de índice maior que o dela: o índice relativo inverte a natureza da lente; depois Gauss e aumento). '
            'IME 2024 q.28 fica só como apoio da equação dos fabricantes'),
    canal='fora do canal: equação dos fabricantes (0 hits); índice de refração e v = c/n em fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:14:31]',
    antes=['opt-fabricantes', 'opt-gauss-aumento', 'opt-indice-meio', 'opt-multiplicar-fracoes', 'opt-dividir-decimal', 'fracoes'],
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
assert round(atraso_us(R_ESC)[2], 3) == 15.517 and R_ESC / N_NUC == Fr(29, 30) and round(float(L_FIB / (R_ESC / N_NUC)), 1) == 3103.4
assert round(atraso_us(Fr(12, 10))[0], 2) == 3.75 and round(atraso_us(Fr(135, 100))[0], 2) == 1.67 and atraso_us(Fr(15, 10))[0] == 0
assert 29 * 3100 == 89900 and 90000 - 89900 == 100 and round(100 / 29, 1) == 3.4 and Fr(3000, 2) == 1500 and Fr(31034, 10) / 2 == Fr(15517, 10)
Q.append(dict(
    id='d2-escada-fis-ita-opt-00c', materia='Física', tema=T, calc=0.52,
    enunciado=('Uma fibra óptica reta de 3,0 km tem núcleo de vidro com índice de refração 1,50, envolvido por um revestimento (uma camada de fora, de outro material). A luz é guiada por reflexões totais na parede entre o núcleo e o revestimento. '
               'O engenheiro dispõe de revestimentos de quatro índices de refração, e escolhe o de maior índice que ainda permite guiar a luz. Raios que entram com ângulos diferentes fazem caminhos '
               'diferentes, e o pulso se alarga: o atraso é a diferença entre o tempo do raio mais lento (o que reflete rente ao limite da reflexão total) e o do raio que '
               'anda ao longo do eixo da fibra. A velocidade da luz no vácuo é 3,0 × 10⁸ m/s (1 µs = 10⁻⁶ s).\n\n'
               'Índices dos revestimentos:   1,20   |   1,35   |   1,45   |   1,50\n\n'
               'Com o revestimento escolhido, o atraso entre o raio mais lento e o raio axial, ao fim dos 3,0 km, vale:'),
    dados=[('Fibra', '3,0 km, núcleo de índice 1,50'), ('Revestimentos', 'índices 1,20; 1,35; 1,45 e 1,50'), ('Escolha', 'o de maior índice que ainda guia a luz'),
           ('Luz no vácuo', '3,0 × 10⁸ m/s'), ('Atraso', 'tempo do mais lento − tempo do axial'), ('Unidade', '1 µs = 10⁻⁶ s')],
    alts=[('0', 0, 'Escolheu o revestimento de 1,50: com índice igual, sen θL = 1 e só o raio axial é guiado'),
          ('0,52 µs', 0.52, 'OK'),
          ('1,67 µs', 1.67, 'Escolheu o revestimento de 1,35, que guia a luz mas não é o de maior índice'),
          ('3,75 µs', 3.75, 'Escolheu o revestimento de 1,20, o de menor índice'),
          ('15,5 µs', 15.5, 'Deu o tempo do raio mais lento (15,517 µs) e não o atraso')],
    resumo='Guia só índice menor que 1,50, e o maior é 1,45; sen θL = 1,45 ÷ 1,50 = 29/30; caminho = 3 000 ÷ (29/30) = 3 103,4 m; v = 2,0 × 10⁸; raio lento 15,517 µs; axial 15 µs; atraso 0,517 ≈ 0,52 µs.',
    ideia='Só há reflexão total se o revestimento tem índice menor que o do núcleo, então o de 1,50 não serve e o de 1,45 é o maior que serve. O raio mais lento anda L ÷ sen θL, e o atraso é a diferença para o tempo do raio axial.',
    pecas=[('Ângulo limite', 'O menor ângulo de incidência (medido da normal) em que a reflexão ainda é total: sen θL = n do revestimento ÷ n do núcleo.'),
           ('Raio axial', 'O que anda ao longo do eixo, em linha reta, sem bater na parede.')],
    formulas=[('onda', 'Velocidade no núcleo', 'vn = c ÷ n do núcleo'), ('grafico', 'Seno do ângulo limite', 'sli = nr ÷ n do núcleo'), ('carro', 'Tempo', 't = caminho ÷ vn')],
    desenho=('Veja a fibra: o núcleo de índice 1,50 entre dois revestimentos. O raio axial vai reto; o mais lento vai em zigue-zague, rente ao limite da reflexão total.', 'fibra-zigue-zague', []),
    eq='atr = tle − tax', leitura='atraso = tempo do raio mais lento − tempo do raio axial',
    letras=[('atr', 'atraso entre os dois raios, em µs (o que a questão quer)'), ('tle', 'tempo do raio mais lento, em µs'), ('tax', 'tempo do raio axial, em µs'),
            ('nr', 'índice do revestimento escolhido'), ('vn', 'velocidade da luz no núcleo, em m/s'), ('sli', 'seno do ângulo limite'), ('Lc', 'caminho do raio mais lento, em m')],
    eq_texto='O atraso é o tempo do raio mais lento menos o do raio axial.\nAgora é só achar nr, vn, tax, sli, Lc e tle.',
    achando=[('Achando nr: o revestimento escolhido',
              'Para guiar a luz, o revestimento precisa ter índice menor que o do núcleo, 1,50. O de 1,50 é igual: não há reflexão total.\nO maior que ainda serve é o de 1,45. nr = 1,45.',
              tabela('Revestimentos', ['Índice', 'Guia a luz?'], [['1,20', 'sim'], ['1,35', 'sim'], ['1,45', 'sim, o maior'], ['1,50', 'não']])),
             ('Achando vn: a velocidade no núcleo', 'vn = c ÷ n = (3,0 × 10⁸) ÷ 1,5. Como 3,0 ÷ 1,5 = 2,0, vn = 2,0 × 10⁸ m/s.'),
             ('Achando tax: o tempo do raio axial',
              '3,0 km = 3 000 m. tax = 3 000 ÷ (2,0 × 10⁸). Primeiro 3 000 ÷ 2 = 1 500; depois 1 500 ÷ 10⁸ = 0,000 015 s (a vírgula anda 8 casas para a esquerda).\n'
              'Como 1 µs = 0,000 001 s, tax = 15 µs.'),
             ('Achando sli: o seno do ângulo limite', 'sli = nr ÷ n do núcleo = 1,45 ÷ 1,50. Multiplico os dois por 100: 145 ÷ 150.\nDividindo por 5 em cima e embaixo: 145 ÷ 5 = 29 e 150 ÷ 5 = 30. sli = 29/30.'),
             ('Achando Lc: o caminho do raio lento',
              'Seno = avanço no eixo ÷ caminho do raio. Com sli = 29/30: a cada 30 m que o raio anda, só 29 m avançam no eixo. Para avançar 3 000 m, o caminho é maior que 3 000 m: caminho = avanço ÷ sli.\nLc = 3 000 ÷ (29/30) = 3 000 · 30/29 = 90 000 ÷ 29.\n'
              '29 · 3 100 = 89 900 e sobram 100; 100 ÷ 29 ≈ 3,4. Lc ≈ 3 103,4 m.',
              {'tipo': 'diagrama', 'nome': 'fibra-zigue-zague', 'rotulos': ['', '', '', '', '', 'revestimento escolhido: 1,45', 'caminho do raio lento: 3 103,4 m']}),
             ('Achando tle: o tempo do raio lento', 'tle = Lc ÷ vn = 3 103,4 ÷ (2,0 × 10⁸). Primeiro 3 103,4 ÷ 2 = 1 551,7; depois ÷ 10⁸: 0,000 015 517 s.\nEm µs: tle = 15,517 µs.')],
    volta='atr = tle − tax = 15,517 − 15 = 0,517, que arredondado dá 0,52 µs.\nResposta: alternativa X. Conferindo: o raio lento anda 3 103,4 − 3 000 = 103,4 m a mais, e 103,4 ÷ (2,0 × 10⁸): 103,4 ÷ 2 = 51,7 e 51,7 ÷ 10⁸ = 0,000 000 517 s = 0,517 µs (1 µs = 0,000 001 s).',
    valores=[('nr', '1,45'), ('vn', '2,0 × 10⁸ m/s'), ('tax', '15 µs'), ('sli', '29/30'), ('Lc', '3 103,4 m'), ('tle', '15,517 µs')],
    pista='"fibra", "raio mais lento" e "revestimento" → só guia índice menor que o do núcleo; o raio no ângulo limite anda L ÷ sen θL; o atraso é a diferença para o tempo do raio axial.',
    rec1='3,0 km; núcleo 1,50; revestimentos 1,20 a 1,50; c = 3,0 × 10⁸', rec3='nr = 1,45; vn = 2,0 × 10⁸; tax = 15; sli = 29/30; Lc = 3 103,4; tle = 15,517',
    checagem=('Núcleo de 1,80 e revestimento de 1,20. Quanto vale o seno do ângulo limite?', ['0,67', '1,5', '0,6', '2,16'], '0,67', 'sen θL = 1,20 ÷ 1,80 = 12 ÷ 18 = 2/3, cerca de 0,67.'),
    ancora=('forte · ITA 2020 2ª fase q.9 (fibra de 3 km, raio guiado por reflexões totais: o caminho é L ÷ sen θL e o tempo, L · n² ÷ (c · n do revestimento)) '
            'e Fuvest 2025 1ª fase q.22 (tabela de índices: há reflexão total só se n1 > n2)'),
    canal='fora do canal: reflexão total e ângulo limite (0 hits); v = c/n em fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:14:31]',
    antes=['opt-reflexao-total', 'opt-indice-meio', 'opt-potencia-dividir', 'opt-multiplicar-fracoes', 'opt-ponto-vezes'],
))


# ============ d) Harvard-MIT: corredor de dois espelhos, quantas direções chegam ao sensor ============
LARG, COMP = Fr(3), Fr(12)
Y_LASER, Y_ALVO = Fr(1), Fr(2)


def imagens_do_alvo():
    """Posições y do alvo no corredor desdobrado: 2 + 6j (reflexões pares) e −2 + 6j (ímpares), com j inteiro."""
    for j in range(-20, 21):
        yield Y_ALVO + 2 * LARG * j, 'par'
        yield -Y_ALVO + 2 * LARG * j, 'impar'


def reflexoes(y_img):
    """Linhas de espelho (y = 0, ±3, ±6, ...) cruzadas pela reta de y = 1 até y_img: cada uma é uma reflexão."""
    lo, hi = sorted((Y_LASER, y_img))
    return sum(1 for k in range(-40, 41) if lo < k * LARG < hi)


def bate_no_sensor(inclinacao):
    """Simula o raio de verdade (reflete nos espelhos y = 0 e y = 3) e vê se chega ao fim do corredor a 2 m do espelho de baixo."""
    x, y, dy, refl = Fr(0), Y_LASER, inclinacao, 0
    while x < COMP:
        if dy == 0:
            x = COMP
            break
        alvo_y = LARG if dy > 0 else Fr(0)
        dx = (alvo_y - y) / dy
        if x + dx >= COMP:
            y += dy * (COMP - x)
            x = COMP
            break
        x, y, dy, refl = x + dx, alvo_y, -dy, refl + 1
    return y == Y_ALVO, refl


LIM_MIN, LIM_MAX = Y_LASER - COMP, Y_LASER + COMP                          # 45° = inclinação 1: |y − 1| ≤ 12
assert (LIM_MIN, LIM_MAX) == (-11, 13)
VALIDAS = [(y, tipo) for y, tipo in imagens_do_alvo() if LIM_MIN <= y <= LIM_MAX]
A_PARES = sorted(y for y, t in VALIDAS if t == 'par')
B_IMPARES = sorted(y for y, t in VALIDAS if t == 'impar')
assert A_PARES == [-10, -4, 2, 8] and B_IMPARES == [-8, -2, 4, 10]
assert len(VALIDAS) == 8 and len({y for y, _ in VALIDAS}) == 8
# cada direção é conferida simulando o raio de verdade, e o número de reflexões bate com a contagem de linhas
for _y, _tipo in VALIDAS:
    _ok, _refl = bate_no_sensor((_y - Y_LASER) / COMP)
    assert _ok and _refl == reflexoes(_y), (_y, _refl, reflexoes(_y))
    assert (_refl % 2 == 0) == (_tipo == 'par')
assert sorted(reflexoes(y) for y, _ in VALIDAS) == [0, 1, 1, 2, 2, 3, 3, 4]
# varre inclinações em passos de 1/48 (e as das imagens): só as 8 acertam o sensor
_acertam = [(Fr(i, 48)) for i in range(-48, 49) if bate_no_sensor(Fr(i, 48))[0]]
assert len(_acertam) == 8
# erros típicos
assert len(A_PARES) == 4                                                    # só as reflexões pares (esqueceu o alvo refletido)
assert len(VALIDAS) - 1 == 7                                                # não contou o raio direto
assert max(reflexoes(y) for y, _ in VALIDAS) + 1 == 5                       # um caminho para cada número de reflexões, de 0 a 4
assert 2 * len(VALIDAS) == 16                                               # contou duas vezes (subindo e descendo)
Q.append(dict(
    id='d2-escada-fis-ita-opt-00d', materia='Física', tema=T, calc=8,
    enunciado=('Um corredor retangular tem 12 m de comprimento e 3 m de largura. As duas paredes compridas são espelhos planos perfeitos; as duas paredes das pontas absorvem a luz. '
               'Um laser está numa das pontas, a 1 m de um dos espelhos, e um sensor está na outra ponta, a 2 m desse mesmo espelho. O laser pode ser apontado em qualquer direção do plano '
               'do corredor, mas o motor só deixa o feixe inclinar até 45° para cada lado do eixo comprido. Quantas direções diferentes de disparo levam o feixe até o sensor?'),
    dados=[('Corredor', '12 m por 3 m, duas paredes compridas espelhadas'), ('Laser', 'numa ponta, a 1 m do espelho de baixo'), ('Sensor', 'na outra ponta, a 2 m do mesmo espelho'),
           ('Inclinação do feixe', 'até 45° para cada lado do eixo')],
    alts=[('4', 4, 'Contou só as direções com número par de reflexões (a imagem de reflexões pares) e esqueceu o alvo refletido no espelho'),
          ('5', 5, 'Contou um caminho para cada número de reflexões, de 0 a 4, sem ver que cada número aparece 2 vezes (subindo e descendo), menos o 0'),
          ('7', 7, 'Não contou o raio direto, sem reflexão, que também chega ao sensor'),
          ('8', 8, 'OK'),
          ('16', 16, 'Contou as direções duas vezes, uma subindo e outra descendo')],
    resumo='Desdobrando, o sensor aparece em y = 2 + 6j e em y = −2 + 6j; a inclinação é (y − 1) ÷ 12 e vale até 1, então y vai de −11 a 13; pares: −10, −4, 2, 8; ímpares: −8, −2, 4, 10; total 8.',
    ideia='Desdobre o corredor: cada direção de tiro é uma reta até uma imagem do sensor, com y = 2 + 6j (reflexões pares) ou y = −2 + 6j (ímpares). O limite de 45° corta a lista, e é só contar as imagens que cabem.',
    pecas=[('Imagem do sensor', 'Cada cópia desdobrada do sensor. A reta do laser até ela é um caminho possível do feixe.'),
           ('Limite de 45°', 'A inclinação da reta (y final − 1) ÷ 12 não pode passar de 1, nem de −1.')],
    formulas=[('grafico', 'Inclinação', '(y − 1) ÷ 12'), ('contagem', 'Alvos desdobrados', 'y = 2 + 6j e y = −2 + 6j'), ('contagem', 'Total', 'n = par + imp')],
    desenho=('Veja o corredor visto de cima: o laser numa ponta, o sensor na outra e espelhos nas duas paredes compridas.', 'corredor-imagens', []),
    eq='n = par + imp', leitura='direções = imagens com número par de reflexões + imagens com número ímpar',
    letras=[('n', 'número de direções de disparo (o que a questão quer)'), ('par', 'imagens do sensor depois de um número par de reflexões, y = 2 + 6j, dentro do limite'),
            ('imp', 'imagens do sensor depois de um número ímpar de reflexões, y = −2 + 6j, dentro do limite'), ('lo', 'menor y permitido pelo limite de 45°, em m'), ('hi', 'maior y permitido pelo limite de 45°, em m')],
    eq_texto='Cada direção que acerta o sensor aponta para uma imagem dele. O total é a soma das imagens de reflexões pares e de ímpares.\nAgora é só achar lo, hi, par e imp.',
    achando=[('Achando lo: o menor y', 'Posição no desenho desdobrado: x vai de 0 a 12 e y parte de 1. Inclinação é quanto y muda a cada 1 m de x: (y − 1) ÷ 12.\nA 45° o raio anda 1 m para o lado e 1 m para baixo (lados iguais, como a diagonal de um quadrado): inclinação −1. Então y − 1 = −12 e lo = 1 − 12 = −11.'),
             ('Achando hi: o maior y', 'A 45° para cima, 1 m de subida a cada 1 m de x: inclinação 1, y − 1 = 12 e hi = 1 + 12 = 13.\nSó contam as imagens do sensor com y de −11 a 13.'),
             ('Achando par: as imagens de reflexões pares',
              'Reflexão é cada batida do raio num espelho. Cada espelho joga o sensor para o outro lado dele: pelo espelho de baixo (y = 0), y = 2 vira −2; depois pelo de cima (y = 3), −2 vira 3 + 5 = 8. Passando pelos dois, o sensor subiu de 2 para 8: 6 m = 2 · 3. Repetindo, o sensor aparece em y = 2 + 6j, com j inteiro.\n'
              'j = −3: −16 (fora). j = −2: −10, j = −1: −4, j = 0: 2, j = 1: 8 (dentro). j = 2: 14 (fora). par = 4.'),
             ('Achando imp: as imagens de reflexões ímpares',
              'Refletido no espelho de baixo (y = 0), o sensor vai para y = −2, e repete a cada 6: y = −2 + 6j.\n'
              'j = −2: −14 (fora). j = −1: −8, j = 0: −2, j = 1: 4, j = 2: 10 (dentro). j = 3: 16 (fora). imp = 4.',
              {'tipo': 'diagrama', 'nome': 'corredor-imagens', 'rotulos': ['', '', '', '', '', 'corredor desdobrado: uma reta por imagem', 'cheias: dentro do cone de 45° · vazias: fora']})],
    volta=('n = par + imp = 4 + 4 = 8.\nResposta: alternativa X. Conferindo: cada reta até uma imagem cruza as linhas de espelho (y = 0, 3, 6, 9... e −3, −6, −9) que ficam entre y = 1 e a imagem, e cada cruzamento é uma batida. '
           'Imagem y = 2: 0 batidas (raio direto). y = 4: 1 (a linha y = 3). y = −10: 4 (y = 0, −3, −6, −9). As 8 retas dão 0, 1, 1, 2, 2, 3, 3 e 4 batidas.'),
    valores=[('lo', '−11'), ('hi', '13'), ('par', '4'), ('imp', '4')],
    pista='"raio que quica entre espelhos" e "quantas direções" → desdobre: cada direção é uma reta até uma imagem do alvo; liste as imagens (duas famílias), corte pelo limite de inclinação e conte.',
    rec1='corredor 12 por 3; laser a 1 m; sensor a 2 m; até 45°', rec3='lo = −11; hi = 13; par = 4; imp = 4',
    checagem=('Espelho na linha y = 0 e alvo em y = 5. Qual o y da imagem do alvo nesse espelho?', ['−5', '5', '0', '−10'], '−5', 'A imagem fica do outro lado, à mesma distância: o y troca de sinal, y = −5.'),
    ancora=('sem · técnica: desdobramento do espelho e imagens do alvo (método das imagens, como no bilhar das olimpíadas); a mais próxima é Fuvest 2021 2ª fase F04 '
            '(método das imagens com espelho plano); HMMT 2020 a 2024 não tem luz que quica'),
    canal='fora do canal: desdobramento do espelho (0 hits); espelho plano em fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:11:34]',
    antes=['opt-espelho-desdobrado', 'opt-contar-no-intervalo', 'opt-ponto-vezes'],
))

# contas das correções do aluno-do-zero (24/11)
assert Fr(1, 10) - Fr(1, 7) * 0 == Fr(1, 10) and 1 / (Fr(1, 10) - 1 / Fr(15, 2)) == -30 and Fr(30) / Fr(15, 2) == 4 and Fr(1, 5) == Fr(4, 20)
assert Fr(517, 10**9) * 10**6 == Fr(517, 1000) and Fr(1034, 10) / 2 == Fr(517, 10) and Fr(12, 18) == Fr(2, 3) and round(1.2 / 1.8, 2) == 0.67 and 1.8 * 1.2 == 2.16
assert 2 * 3 - (-2) == 8 and 2 * 3 * 1 + 2 == 8 and 8 - 2 == 6 == 2 * 3 and 1 - 12 == -11 and 1 + 12 == 13
assert [y for y in (2, 4, -2, 8, -4, 10, -8, -10) if reflexoes(Fr(y)) == 0] == [2] and reflexoes(Fr(4)) == 1 and reflexoes(Fr(-10)) == 4
assert Fr(-1, 120) - Fr(3, 120) == Fr(-4, 120) == Fr(-1, 30) and Fr(15, 16) - 1 == Fr(-1, 16)
for _q in Q:
    assert all(len(v) <= 60 for _, v in _q['dados']), _q['id']
    assert all(len(f[1]) <= 30 and len(f[2]) <= 60 for f in _q['formulas']), _q['id']
    assert len(_q['ideia']) <= 300, (_q['id'], len(_q['ideia']))
