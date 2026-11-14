"""Põe o quadro (uma conta por linha) nos 22 macetes e refaz o passo
"O que acontece" da questão da geladeira (ENEM 2022 · 140).
Pablo, 14/11/2026: "não entendi nada do macete, faz um quadro".
Rodar: python3 scripts/macete-quadros.py"""
import json
from pathlib import Path

AULAS = Path('data/revisao-final/dia-2/aulas.json')
ENEM = Path('data/revisao-final/dia-2/enem-matematica.json')

QUADROS = {
    'Eletricidade e Circuitos': [['Ferro', '110 V e 10 A'], ['Conta', 'P = U × i'], ['Troca', '110 × 10'], ['Potência', '1 100 W']],
    'Termodinâmica e Calor': [['Água', '500 g, de 20 °C a 80 °C'], ['Muda', '80 − 20 = 60 °C'], ['Calor', '500 × 1 × 60 = 30 000 cal'], ['Tempo', '30 000 ÷ 500 = 60 s']],
    'Ondas e Acústica': [['Sonar', 'som a 1 500 m/s, volta em 0,4 s'], ['Ida e volta', '1 500 × 0,4 = 600 m'], ['Fundo', '600 ÷ 2 = 300 m']],
    'Óptica': [['Você', '1,5 m na frente do espelho'], ['Imagem', '1,5 m atrás do espelho'], ['Até ela', '1,5 + 1,5 = 3 m']],
    'Dinâmica e Leis de Newton': [['Empurra', '200 N'], ['Segura', '80 N'], ['Sobra', '200 − 80 = 120 N'], ['a = F ÷ m', '120 ÷ 40 = 3 m/s²']],
    'Química Orgânica': [['Molécula', 'CH₃–CO–CH₃'], ['O e N', 'um O, com ligação dupla'], ['Onde', 'no carbono do meio'], ['Família', 'C=O no meio = cetona']],
    'Química Ambiental e Energia': [['Carro', '30 km por dia, 10 km por litro'], ['Litros', '30 ÷ 10 = 3 L'], ['CO₂', '3 × 2,3 = 6,9 kg por dia']],
    'Soluções, pH e Titulação': [['Suco', '200 mL a 100 g/L'], ['Gramas', '0,2 × 100 = 20 g'], ['Pôs água', 'os 20 g ficam'], ['Em 1 L', '20 g/L']],
    'Eletroquímica': [['Cobre', '+0,34 V: maior, ganha elétrons'], ['Zinco', '−0,76 V: perde, polo −'], ['Pilha', '0,34 − (−0,76)'], ['Total', '0,34 + 0,76 = 1,10 V']],
    'Estequiometria': [['Receita', '16 g de CH₄ → 44 g de CO₂'], ['Você tem', '32 g = 2 × 16 g'], ['Dá', '2 × 44 = 88 g de CO₂']],
    'Ecologia': [['Capim', '10 000 kcal'], ['→ Boi', 'corta um zero: 1 000 kcal'], ['→ Pessoa', 'corta um zero: 100 kcal']],
    'Fisiologia Humana e Saúde': [['Pergunta', 'para que serve?'], ['Montanha', 'pouco oxigênio no ar'], ['Corpo', 'faz mais hemácias'], ['Resultado', 'mais oxigênio a cada volta']],
    'Genética': [['Pai AB', 'Iᴬ e Iᴮ'], ['Mãe O', 'i e i'], ['Cruza', 'Iᴬi, Iᴬi, Iᴮi, Iᴮi'], ['Tipo A', '2 de 4 = 50%']],
    'Citologia': [['Trabalho', 'fazer muita proteína (enzima)'], ['Quem faz', 'retículo rugoso'], ['Então', 'tem muito retículo rugoso']],
    'Evolução': [['Antes', 'já havia insetos escuros e claros'], ['Ambiente', 'tronco escuro'], ['Escolha', 'o pássaro vê e come os claros'], ['Depois', 'os escuros ficam comuns']],
    'Microbiologia e Doenças': [['Soro', 'anticorpo pronto: protege já'], ['Vacina', 'ensina o corpo: leva semanas'], ['Prego, sem vacina', 'soro agora']],
    'Aritmética e Porcentagem': [['Preço', 'R$ 50, com 20% de desconto'], ['10%', 'corta um zero: 5'], ['20%', '2 × 5 = 10'], ['Paga', '50 − 10 = R$ 40']],
    'Grandezas e Medidas': [['Receita', '2 kg → 30 pães'], ['Você tem', '6 kg = 3 × 2 kg'], ['Pães', '3 × 30 = 90']],
    'Estatística': [['Quer', 'média 7 em 4 provas'], ['Precisa', '7 × 4 = 28'], ['Tem', '6 + 8 + 5 = 19'], ['Falta', '28 − 19 = 9']],
    'Funções': [['Táxi', 'R$ 5 fixos + R$ 2 por km'], ['Troca', 'km = 10'], ['Paga', '5 + 2 × 10 = R$ 25']],
    'Geometria Plana': [['Terreno', '12 m por 20 m'], ['Área', '12 × 20 = 240'], ['Quadradinhos', '240 de 1 m² = 240 m²']],
    'Geometria Espacial': [['Caixa', '10 × 5 × 4 cm'], ['Fundo', '10 × 5 = 50 cm²'], ['Volume', '50 × 4 = 200 cm³']],
}

REGRA_PORCENTAGEM = 'Para achar 10%, corte um zero do número. Desconto: tira. Aumento: soma. Dois seguidos: um de cada vez.'

PASSO_LOJA = {
    'titulo': 'O que acontece',
    'texto': (
        'A loja faz em 2 passos:\n'
        '1º o preço normal: 1 000 + 10% = 1 100.\n'
        '2º o cartão tira 2% de 1 100 (= 22): 1 100 − 22 = 1 078.\n'
        'A cliente fez 1 passo só: 1 000 + 8% = 1 080.\n'
        'Os 2% saem de 1 100, não de 1 000: por isso as contas não batem.'
    ),
    'visual': {
        'tipo': 'tabela',
        'titulo': 'Loja e cliente',
        'cabecalho': ['Quem', 'Conta', 'Valor'],
        'linhas': [
            ['loja, 1º', '1 000 + 100', 'R$ 1 100'],
            ['loja, 2º', '1 100 − 22', 'R$ 1 078'],
            ['cliente', '1 000 + 80', 'R$ 1 080'],
        ],
    },
}


def main() -> None:
    aulas = json.loads(AULAS.read_text(encoding='utf-8'))
    assert set(QUADROS) == set(aulas), set(aulas) ^ set(QUADROS)
    novas = {
        tema: {**a, 'macete': {**a['macete'], 'quadro': QUADROS[tema],
                               **({'regra': REGRA_PORCENTAGEM} if tema == 'Aritmética e Porcentagem' else {})}}
        for tema, a in aulas.items()
    }
    AULAS.write_text(json.dumps(novas, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    questoes = json.loads(ENEM.read_text(encoding='utf-8'))
    achou = 0
    for q in questoes:
        if q['id'] != 'cmouei9850079uoz9am4gd7bz':
            continue
        passos = q['explicacao']['passos']
        q['explicacao']['passos'] = [PASSO_LOJA if p['titulo'] == 'O que acontece' else p for p in passos]
        achou += 1
    assert achou == 1, achou
    ENEM.write_text(json.dumps(questoes, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('22 quadros e 1 passo gravados')


if __name__ == '__main__':
    main()
