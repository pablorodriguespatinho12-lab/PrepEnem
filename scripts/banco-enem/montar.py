"""Monta os arquivos do banco ENEM a partir de fichas curtas em Python.

Pablo, 16/11/2026: "várias questões parecidas" (toalha, disco, eletrodinâmica,
estatística, probabilidade, geometria misturada) para a rotina de estudo.
Cada ficha traz só o conteúdo; aqui vira o formato de
data/revisao-final/dia-2/LEIA-ME.md, e a conta de cada questão é refeita
(campo `confere`) antes de gravar: se não bater com a letra certa, para tudo.

Uso: python3 scripts/banco-enem/montar.py cobrir_e_chance
Grava data/revisao-final/banco-enem/<arquivo>.json. Depois: npm test.
"""
import importlib
import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parents[2]
PASTA = RAIZ / 'data/revisao-final/banco-enem'
LETRAS = 'ABCDE'
ORIGEM = 'Banco ENEM do dia 2'  # o teste e o script de gravação esperam esta origem
MAX_LINHA_RAPIDO = 170
TITULO_FORMULAS = 'As fórmulas desta questão'  # components/simulado/aula-do-tema.tsx procura este título


def numero(texto):
    """Primeiro número de uma alternativa ('R$ 1 200,50' -> 1200.5)."""
    # Ponto é separador de milhar ('R$ 2.100,00' = 2100); a vírgula é a decimal.
    achado = re.search(r'-?\d(?:[\d ]|\.(?=\d{3}))*(?:,\d+)?', texto)
    if not achado:
        raise ValueError(f'sem número em: {texto}')
    return float(achado.group().replace(' ', '').replace('.', '').replace(',', '.'))


def passo_logica(f):
    """Tela 'A lógica' (Pablo, 16/11/2026: "por que eu tenho que dividir... para, se vir
    uma questão parecida, saber como enfrentar"). O que a questão pede, cada conta com o
    porquê e a pista para reconhecer a próxima. Obrigatória no jeito novo (com cena)."""
    if 'logica' not in f:
        if 'cena' in f and 'equacao' not in f:
            raise SystemExit(f"{f['id']}: questão do jeito novo sem 'logica'")
        return []
    pede, contas, parecida = f['logica']
    texto = f'A questão pede: {pede}\nQuestão parecida: {parecida}'
    tabela = {'tipo': 'tabela', 'titulo': 'Cada conta e o porquê', 'cabecalho': ['Conta', 'Por quê'],
              'linhas': [list(c) for c in contas]}
    return [{'titulo': 'A lógica', 'texto': texto, 'visual': tabela}]


def passos_em_letras(f, figura, quadro):
    """Jeito novo (Pablo, 16/11/2026, aprovado na prévia do robô): o que eu tenho →
    equação em letras → achar cada letra, uma tela por letra → o jeito que parece
    certo e por que não dá → volta na equação → questão parecida."""
    eq = f['equacao']
    passos = [
        {'titulo': 'A pergunta', 'texto': f['pergunta'], 'visual': figura},
        {'titulo': 'O que eu tenho', 'texto': 'Tire os números do enunciado, todos na mesma unidade.',
         'visual': {'tipo': 'tabela', 'titulo': 'O que eu tenho', 'cabecalho': ['Informação', 'Valor'], 'linhas': [list(t) for t in f['tenho']]}},
        {'titulo': 'A equação em letras', 'texto': f"{eq['texto']}\n{eq['porque']}\nAgora é só achar cada letra.",
         'visual': {'tipo': 'legenda', 'partes': [{'texto': t, 'rotulo': rot} for t, rot in eq['partes']]}},
    ]
    for letra in f['letras']:
        passos.append({'titulo': letra['titulo'], 'texto': letra['texto'], **({'visual': letra['visual']} if letra.get('visual') else {})})
    if f.get('seu_jeito'):
        sj = f['seu_jeito']
        passos.append({'titulo': 'O jeito que parece certo', 'texto': sj['texto'], **({'visual': sj['visual']} if sj.get('visual') else {})})
    passos.append({'titulo': 'Volta na equação', 'texto': f['volta'], 'visual': quadro})
    passos.append({'titulo': f.get('titulo_funciona', 'Por que funciona'), 'texto': f['funciona']})
    receita, pista = f['parecida']
    passos.append({'titulo': 'Questão parecida? Faça assim', 'texto': f'Pista: {pista}',
                   'visual': {'tipo': 'tabela', 'titulo': 'A receita', 'cabecalho': ['Passo', 'Nesta questão'], 'linhas': [list(x) for x in receita]}})
    passos.append({'titulo': 'A resposta', 'texto': f['resposta']})
    return passos


def tabela(titulo, cabecalho, linhas):
    return {'tipo': 'tabela', 'titulo': titulo, 'cabecalho': cabecalho, 'linhas': [list(l) for l in linhas]}


def equacao_no_quadro(equacao, letras):
    """'v = d ÷ t (velocidade = distância ÷ tempo)' vira a fórmula grande e a leitura embaixo."""
    # A leitura é o ÚLTIMO parêntese, e só se tiver palavra: '(20 − 5) ÷ 3' é conta, não leitura.
    achado = re.match(r'^(.*\S)\s+\(([^()]*[A-Za-zÀ-ÿ]{3}[^()]*)\)$', equacao.strip())
    formula, leitura = (achado.group(1), achado.group(2)) if achado else (equacao.strip(), '')
    return {'tipo': 'equacao', 'formula': formula.strip(), **({'leitura': leitura.strip()} if leitura else {}),
            'letras': [{'letra': l, 'oque': o} for l, o in letras]}


def passos_aula(f):
    """Molde da "Aula do Robô Aspirador" (artefato aprovado em 17/11/2026: "copia
    exatamente essa explicação"): o que eu tenho → equação em letras → uma tela por
    letra (o seu jeito entra onde o erro acontece) → volta na equação → receita."""
    a = f['aula']
    # 1ª tela: as fórmulas que a questão usa, já prontas (Pablo, 17/11/2026).
    formulas = [{
        # Português (18/11/2026): 'A regra desta questão' (TITULO_REGRAS), mesmo lugar.
        'titulo': a.get('titulo_formulas', TITULO_FORMULAS),
        'texto': a.get('formulas_texto', 'Estas são as fórmulas que a questão usa. Já estão prontas: é só usar.'),
        'visual': {'tipo': 'formulas', 'itens': [{'figura': fig, 'nome': nome, 'formula': conta} for fig, nome, conta in a['formulas']]},
    }] if a.get('formulas') else []
    passos = [
        *formulas,
        {'titulo': 'O que eu tenho', 'texto': a.get('tenho_texto', 'Primeiro, tire os números do enunciado.'),
         'visual': tabela('O que eu tenho', ['Informação', 'Valor'], a['tenho'])},
        # Sem conta (Português): 'A regra em palavras' e as pistas no lugar das letras.
        # A equação vai num quadro branco, cada letra numa cor, com o que ela é embaixo
        # (Pablo, 18/11/2026: "em quadro, não só texto"); o texto fica com o porquê.
        {'titulo': a.get('titulo_regra', 'A equação em letras'), 'texto': f"{a['quer']}\n{a['porque']}\n{a.get('agora', 'Agora é só achar cada letra.')}",
         'visual': equacao_no_quadro(a['equacao'], a['letras'])},
    ]
    for t in a['telas']:
        passos.append({'titulo': t['titulo'], 'texto': t['texto'], **({'visual': t['visual']} if t.get('visual') else {})})
    passos.append({'titulo': 'Volta na equação', 'texto': a['volta'],
                   'visual': tabela('As letras', ['Letra', 'Valor'], a['valores'])})
    passos.append({'titulo': 'Questão parecida? Faça assim', 'texto': f"Pista: {a['pista']}",
                   'visual': tabela('A receita', ['Passo', a.get('coluna_receita', 'Nesta questão')], a['receita'])})
    return passos


def montar(f):
    certa = f['alts'][LETRAS.index(f['resp'])]
    if 'confere' in f:
        valor = f['confere']
        if abs(valor - numero(certa)) > 0.01 * max(1, abs(valor)):
            raise SystemExit(f"{f['id']}: a conta deu {valor}, mas a letra {f['resp']} diz {certa}")
    # Mesma régua de lib/tutor/pronta.ts: ideia com até 300 letras e 2 frases.
    frases_ideia = [p for p in re.split(r'(?<=[.!?])\s+', f['ideia'].strip()) if p]
    if len(f['ideia']) > 300 or len(frases_ideia) > 2:
        raise SystemExit(f"{f['id']}: ideia longa ({len(f['ideia'])} letras, {len(frases_ideia)} frases; máximo 300 e 2)")
    rapido = f.get('rapido', 'Macete de')
    if not rapido.startswith('Macete de'):
        raise SystemExit(f"{f['id']}: Jeito rápido tem que começar com 'Macete de'")
    longas = [l for l in rapido.split('\n') if len(l) > MAX_LINHA_RAPIDO]
    if longas:
        raise SystemExit(f"{f['id']}: linha do Jeito rápido com mais de {MAX_LINHA_RAPIDO} letras: {longas[0][:60]}")
    # Questão nova (16/11/2026): cena da situação, que aparece na tela da questão e abre
    # a explicação. Sem cena, a figura genérica antiga.
    # A aula no jeito do robô não usa a figura; questão sem cena fica sem ela.
    cena_ou_fig = f.get('cena') or f.get('fig')
    quadro = {'tipo': 'quadro', **f['quadro']} if 'quadro' in f else None
    figura = {'tipo': 'figura', 'nome': cena_ou_fig[0], 'titulo': f.get('fig_titulo', 'A situação'), 'rotulos': cena_ou_fig[1]} if cena_ou_fig else None
    if 'aula' in f:
        passos = passos_aula(f)
    elif 'equacao' in f:
        passos = passos_em_letras(f, figura, quadro)
    else:
      passos = [
        {'titulo': 'A pergunta', 'texto': f['pergunta'], 'visual': figura},
        *passo_logica(f),
        {'titulo': f.get('titulo_acontece', 'O que acontece'), 'texto': f['acontece'], **({'visual': f['visual2']} if f.get('visual2') else {})},
        {'titulo': 'Jeito rápido', 'texto': rapido, 'visual': quadro},
        {'titulo': f.get('titulo_funciona', 'Por que funciona'), 'texto': f['funciona']},
        {'titulo': 'A resposta', 'texto': f['resposta']},
      ]
    pergunta, opcoes, certa_sv, porque = f['sua_vez']
    return {
        'id': f['id'], 'materia': f['materia'], 'tema': f['tema'],
        'enunciado': f['enun'], **dict(zip(LETRAS, f['alts'])), 'resposta': f['resp'], 'origem': ORIGEM,
        # Questões das provas em escada (17/11/2026) dizem o degrau: facil, medio, dificil ou acima.
        **({'nivel': f['nivel']} if 'nivel' in f else {}),
        'explicacao': {
            'conferencia': f['conferencia'], 'ideia': f['ideia'],
            'pecas': [{'termo': t, 'significado': s} for t, s in f.get('pecas', [])],
            'passos': passos, 'seuErro': None,
            'checagem': {'pergunta': pergunta, 'opcoes': opcoes, 'certa': certa_sv, 'resposta': porque},
        },
    }


CENAS = RAIZ / 'data/revisao-final/cenas-das-questoes.json'
MAX_ROTULO = 24  # lib/cenas-das-questoes.test.ts


def gravar_cenas(fichas):
    """Põe a cena de cada ficha no mapa que a tela da questão lê."""
    mapa = json.loads(CENAS.read_text(encoding='utf8'))
    for f in fichas:
        if 'cena' not in f:
            continue
        nome, rotulos = f['cena']
        if len(rotulos) > 4 or any(len(r) > MAX_ROTULO for r in rotulos):
            raise SystemExit(f"{f['id']}: até 4 rótulos de até {MAX_ROTULO} letras na cena")
        mapa['cenas'][f['id']] = {'nome': nome, 'rotulos': rotulos}
    CENAS.write_text(json.dumps(mapa, ensure_ascii=False, indent=2) + '\n', encoding='utf8')


def main():
    for nome in sys.argv[1:]:
        sys.path.insert(0, str(pathlib.Path(__file__).parent))
        modulo = importlib.import_module(nome)
        # Um arquivo por tema (o teste do banco quer um tema só por arquivo). Módulo com
        # temas misturados, como as parecidas com o ENEM 2026, diz o arquivo de cada tema.
        por_tema = getattr(modulo, 'ARQUIVO_POR_TEMA', None)
        grupos = {}
        for f in modulo.FICHAS:
            grupos.setdefault(por_tema[f['tema']] if por_tema else modulo.ARQUIVO, []).append(f)
        for arquivo, fichas in grupos.items():
            questoes = [montar(f) for f in fichas]
            letras = {l: sum(q['resposta'] == l for q in questoes) for l in LETRAS}
            destino = PASTA / f"{arquivo}.json"
            destino.write_text(json.dumps(questoes, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
            print(f'{destino.name}: {len(questoes)} questões, contas conferidas, letras {letras}')
        gravar_cenas(modulo.FICHAS)


if __name__ == '__main__':
    main()
