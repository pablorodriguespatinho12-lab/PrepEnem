"""Questões de nível acima (ITA/IME) das provas em escada de Química (Pablo, 21/11/2026), com aula de lousa.
Amostra de 3 (Estequiometria, Soluções, Eletroquímica); falta o ok dele para o resto. Questão original,
nunca apresentada como real. O canal Universo Narrado só tem Matemática e Física: a fonte é `canal='fora do canal: ...'`
e o que se copia é o tipo de quadro. Gravar: scripts/criar-provas-escada.ts."""

ARQUIVO = '../escada/quimica'

from lousas_quimica import (ALTS_FARADAY, ALTS_LIMITANTE, ALTS_MISTURA, ENUN_FARADAY, ENUN_LIMITANTE, ENUN_MISTURA,
                            LOUSA_FARADAY, LOUSA_LIMITANTE, LOUSA_MISTURA)

SEM_CANAL = 'fora do canal: o canal só tem Matemática e Física'


def Q(tema, nivel):
  return {'materia': 'Química', 'tema': tema, 'nivel': nivel}


def receita(tenho, equacao, letras, conta):
  return [('1. Tabela do que eu tenho', tenho), ('2. Equação em letras', equacao), ('3. Achar cada letra', letras), ('4. Substituir', conta)]


FICHAS = [
dict(**Q('Estequiometria', 'acima'), id='d2-escada-qui-ita-est-01', canal=SEM_CANAL, resp='B', objeto='hidrogênio e oxigênio', cobra='reagente limitante e massa do produto', confere=36,
  enun=ENUN_LIMITANTE, alts=ALTS_LIMITANTE, lousa=LOUSA_LIMITANTE,
  ideia='A equação conta em mols. Os 4 g de H2 são 2 mol e os 48 g de O2 são 1,5 mol; 2 mol de H2 pedem só 1 mol de O2, então o H2 acaba primeiro e forma 2 mol de água, 36 g.',
  pecas=[('Reagente limitante', 'O que acaba primeiro: ele decide quanto produto se forma.'), ('Mol', 'Quantidade fixa de partículas; a massa molar diz quanto 1 mol pesa em gramas.')],
  conferencia='nH2 = 4/2 = 2; nO2 = 48/32 = 1,5; 2 H2 pedem 1 O2 (sobram 0,5 mol); limitante H2; 2 mol de H2O × 18 = 36 g. B. A = 1 mol de água; C = 4 + 48 (soma de massas, sobra O2); D = partiu do O2 (3 mol de água, 54 g); E = 4 g lido como 4 mol (72 g).',
  sua_vez=('3 mol de H2 e 1 mol de O2 reagem (2 H2 + O2 → 2 H2O). Quantos mols de água se formam?', ['2 mol', '3 mol', '1 mol', '4 mol'], '2 mol', '1 mol de O2 pede 2 de H2 e forma 2 de água: o O2 é o limitante.'),
  aula=dict(
    formulas=[('contagem', 'Mols', 'mols = massa ÷ massa molar'), ('contagem', 'Proporção da equação', '2 H2 : 1 O2 : 2 H2O')],
    tenho=[('H2', '4 g (2 g por mol)'), ('O2', '48 g (32 g por mol)'), ('Água', '18 g por mol')],
    quer='A questão quer a massa de água formada, m.',
    equacao='m = n × M (massa de água = mols de água × massa molar)',
    porque='Por que olhar quem acaba primeiro? A reação para quando um dos gases acaba, e o gás que sobra não forma água. Quem acaba primeiro decide a água formada.',
    letras=[('m', 'massa de água (o que a questão quer)'), ('n', 'mols de água formados, pelo limitante'), ('M', 'massa molar da água, 18 g/mol')],
    telas=[dict(titulo='Achando n: os mols de água', texto='H2: 4 ÷ 2 = 2 mol. O2: 48 ÷ 32 = 1,5 mol. Os 2 mol de H2 pedem 1 mol de O2 e há 1,5: o H2 é o limitante.\nPela equação, 2 mol de H2 formam 2 mol de água: n = 2 mol'),
           dict(titulo='Achando M: o seu jeito', texto='Parece certo somar as massas, 4 + 48 = 52 g, porque a massa se conserva. Mas o O2 que sobra não virou água.\nM = 18 g/mol, a massa molar da água')],
    volta='m = 2 × 18 = 36 g\nLetra B.',
    valores=[('n', '2 mol'), ('M', '18 g/mol')],
    pista='"quantidade de cada reagente dada" → passe tudo para mols, ache quem acaba primeiro pela proporção da equação e siga só por ele.',
    receita=receita('4 g de H2 e 48 g de O2', 'm = n × M', 'n = 2 mol; M = 18 g/mol', '2 × 18 = 36'))),

dict(**Q('Soluções, pH e Titulação', 'acima'), id='d2-escada-qui-ita-sol-01', canal=SEM_CANAL, resp='C', objeto='duas soluções de sal', cobra='mistura de soluções e evaporação', confere=0.75,
  enun=ENUN_MISTURA, alts=ALTS_MISTURA, lousa=LOUSA_MISTURA,
  ideia='Concentrações não se somam, mols sim. A mistura tem 0,12 + 0,18 = 0,30 mol em 0,5 L; ao evaporar 100 mL de água os mols ficam e o volume vai a 0,4 L: 0,30 ÷ 0,4 = 0,75 mol/L.',
  pecas=[('Mol/L', 'Quantos mols de sal há em cada litro de solução.'), ('Evaporação', 'Tira só água: o volume cai e os mols de sal continuam.')],
  conferencia='n1 = 0,4 × 0,3 = 0,12; n2 = 0,9 × 0,2 = 0,18; n = 0,30; V = 0,5 − 0,1 = 0,4 L; C = 0,75. C. A = 0,6 (sem evaporar); B = média simples (0,4 + 0,9) ÷ 2 = 0,65; D = 0,4 + 0,9 = 1,3; E = 0,30 ÷ 0,1 = 3,0.',
  sua_vez=('Misturam-se 100 mL de NaCl 1 mol/L com 100 mL de NaCl 3 mol/L. Qual a concentração?', ['2 mol/L', '4 mol/L', '1,5 mol/L', '200 mol/L'], '2 mol/L', '0,1 + 0,3 = 0,4 mol em 0,2 L: 2 mol/L.'),
  aula=dict(
    formulas=[('media', 'Mols de uma solução', 'mols = mol/L × litros'), ('media', 'Concentração', 'mol/L = mols ÷ litros')],
    tenho=[('Solução 1', '300 mL a 0,4 mol/L'), ('Solução 2', '200 mL a 0,9 mol/L'), ('Evaporação', '100 mL de água')],
    quer='A questão quer a concentração final, C.',
    equacao='C = n ÷ V (concentração = mols totais ÷ litros no fim)',
    porque='Por que mols, e não a média das concentrações? Cada solução tem um volume diferente, então pesa diferente. Os mols se somam; as concentrações, não.',
    letras=[('C', 'concentração final (o que a questão quer)'), ('n', 'mols de sal no total'), ('V', 'volume no fim, em litros')],
    telas=[dict(titulo='Achando n: os mols de sal', texto='0,4 × 0,3 = 0,12 mol e 0,9 × 0,2 = 0,18 mol.\nn = 0,12 + 0,18 = 0,30 mol'),
           dict(titulo='Achando V: o seu jeito', texto='Parece certo parar nos 0,5 L da mistura. Mas saíram 100 mL de água, e os mols de sal ficaram.\nV = 0,3 + 0,2 − 0,1 = 0,4 L')],
    volta='C = 0,30 ÷ 0,4 = 0,75 mol/L\nLetra C.',
    valores=[('n', '0,30 mol'), ('V', '0,4 L')],
    pista='"mistura de soluções" ou "evapora água" → ache os mols de cada copo (mol/L × litros), some, e só então divida pelo volume final.',
    receita=receita('300 mL a 0,4; 200 mL a 0,9; evapora 100 mL', 'C = n ÷ V', 'n = 0,30 mol; V = 0,4 L', '0,30 ÷ 0,4 = 0,75'))),

dict(**Q('Eletroquímica', 'acima'), id='d2-escada-qui-ita-ele-01', canal=SEM_CANAL, resp='C', objeto='eletrólise do cobre', cobra='lei de Faraday: tempo para depositar massa', confere=3860,
  enun=ENUN_FARADAY, alts=ALTS_FARADAY, lousa=LOUSA_FARADAY,
  ideia='Cadeia: 6,35 g são 0,1 mol de Cu; cada Cu usa 2 elétrons, então 0,2 mol de elétrons; a carga é 0,2 × 96 500 = 19 300 C; com 5 A, o tempo é 19 300 ÷ 5 = 3860 s.',
  pecas=[('Coulomb (C)', 'Unidade de carga elétrica; corrente (A) é a carga que passa por segundo.'), ('Elétrons por Cu', 'Cu2+ + 2 e− → Cu: cada átomo de cobre recebe 2 elétrons.')],
  conferencia='n(Cu) = 6,35/63,5 = 0,1; n(e) = 0,2; Q = 0,2 × 96 500 = 19 300 C; t = 19 300/5 = 3860 s. C. A = 0,01 mol (uma casa): 386; B = 1 elétron por Cu: 1930; D = 4 elétrons: 7720; E = a carga, sem dividir por 5 A.',
  sua_vez=('Uma corrente de 10 A deposita 0,1 mol de prata (Ag+ + 1 e− → Ag; 96 500 C por mol de e−). Quanto tempo?', ['965 s', '9650 s', '1930 s', '96,5 s'], '965 s', '0,1 mol de e− são 9650 C, e 9650 ÷ 10 = 965 s.'),
  aula=dict(
    formulas=[('circuito', 'Carga', 'Q = corrente × tempo'), ('circuito', 'Carga de elétrons', 'Q = mols de e− × 96 500')],
    tenho=[('Corrente', '5 A'), ('Cobre', '6,35 g (63,5 g/mol)'), ('Equação', 'Cu2+ + 2 e− → Cu')],
    quer='A questão quer o tempo da eletrólise, t.',
    equacao='t = Q ÷ i (tempo = carga ÷ corrente)',
    porque='Por que passar por mols? A equação diz quantos elétrons cada cobre usa. Contando mols de elétrons, chego à carga em coulombs, e a carga dividida pela corrente dá o tempo.',
    letras=[('t', 'tempo (o que a questão quer)'), ('Q', 'carga total, em coulombs'), ('i', 'corrente, 5 A')],
    telas=[dict(titulo='Achando Q: a carga', texto='6,35 ÷ 63,5 = 0,1 mol de Cu. Cada Cu usa 2 elétrons: 0,2 mol de e−.\nQ = 0,2 × 96 500 = 19 300 C'),
           dict(titulo='Achando i: o seu jeito', texto='Parece certo responder 19 300, porque é o número que saiu da conta. Mas 19 300 está em coulombs, e a questão quer segundos.\ni = 5 A, e o tempo vem de dividir a carga por ele')],
    volta='t = 19 300 ÷ 5 = 3860 s\nLetra C.',
    valores=[('Q', '19 300 C'), ('i', '5 A')],
    pista='"corrente por tempo depositando massa" → massa vira mols, mols viram mols de elétrons, × 96 500 dá a carga, e carga ÷ corrente dá o tempo.',
    receita=receita('5 A, 6,35 g de Cu, 2 e− por Cu', 't = Q ÷ i', 'Q = 19 300 C; i = 5 A', '19 300 ÷ 5 = 3860'))),
]
