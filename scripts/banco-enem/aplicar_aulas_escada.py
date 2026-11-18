"""Põe no jeito do robô as aulas de questões que JÁ existem nas provas em escada
(Pablo, 18/11/2026: "montar a equação e descobrir cada valor a partir dos dados").

Lê as fichas de scripts/banco-enem/aulas/<modulo>.py (AULAS = {id: ficha}) e:
  1. refaz a conta (`confere`) contra a letra certa do dump das questões;
  2. troca passos (e ideia/conferencia/checagem/peças, se a ficha trouxer) no JSON de
     origem, quando a questão mora num data/revisao-final/**/*.json (senão outro script
     desfaria a troca);
  3. grava data/revisao-final/aulas-escada/<MATERIA>.json, que
     scripts/gravar-aulas-escada.ts leva ao banco.

Uso: python3 scripts/banco-enem/aplicar_aulas_escada.py <modulo> <dump.json>
O dump é a lista [{id, A..E, resposta}] das questões (gravar-aulas-escada.ts --dump)."""
import importlib
import json
import pathlib
import sys

from montar import LETRAS, RAIZ, numero, passos_aula

PASTA_AULAS = pathlib.Path(__file__).parent / 'aulas'
DADOS = RAIZ / 'data/revisao-final'
META = ('confere', 'ideia', 'conferencia', 'sua_vez', 'pecas', 'enunciado', 'alternativa')
MAX_IDEIA = 300


def parcial_da_ficha(qid, ficha, questao):
    if 'confere' in ficha:
        certa = questao[questao['resposta']]
        if abs(ficha['confere'] - numero(certa)) > 0.01 * max(1, abs(ficha['confere'])):
            raise SystemExit(f"{qid}: a conta deu {ficha['confere']}, mas a letra {questao['resposta']} diz {certa}")
    aula = {k: v for k, v in ficha.items() if k not in META}
    parcial = {'passos': passos_aula({'aula': aula})}
    if ficha.get('ideia'):
        if len(ficha['ideia']) > MAX_IDEIA:
            raise SystemExit(f'{qid}: ideia com mais de {MAX_IDEIA} letras')
        parcial['ideia'] = ficha['ideia']
    if ficha.get('conferencia'):
        parcial['conferencia'] = ficha['conferencia']
    if ficha.get('pecas'):
        parcial['pecas'] = [{'termo': t, 'significado': s} for t, s in ficha['pecas']]
    if ficha.get('sua_vez'):
        pergunta, opcoes, certa, porque = ficha['sua_vez']
        if certa not in opcoes:
            raise SystemExit(f'{qid}: "Sua vez" com a certa fora das opções')
        parcial['checagem'] = {'pergunta': pergunta, 'opcoes': opcoes, 'certa': certa, 'resposta': porque}
    return parcial


def trocar_nos_jsons(parciais, enunciados):
    """A questão que mora num JSON de dados recebe a mesma troca lá."""
    trocadas = set()
    for arquivo in sorted(DADOS.rglob('*.json')):
        if 'escada' in arquivo.parts or 'aulas-escada' in arquivo.parts:
            continue
        texto = arquivo.read_text(encoding='utf8')
        try:
            dados = json.loads(texto)
        except json.JSONDecodeError:
            continue
        if not isinstance(dados, list):
            continue
        mudou = False
        for q in dados:
            if isinstance(q, dict) and q.get('id') in parciais and isinstance(q.get('explicacao'), dict):
                q['explicacao'].update(parciais[q['id']])
                if q['id'] in enunciados:
                    q['enunciado'] = enunciados[q['id']]
                trocadas.add(q['id'])
                mudou = True
        if mudou:
            segunda = texto.split('\n', 2)[1] if '\n' in texto else ''
            recuo = len(segunda) - len(segunda.lstrip()) or 1
            arquivo.write_text(json.dumps(dados, ensure_ascii=False, indent=recuo) + '\n', encoding='utf8')
            print(f'  {arquivo.relative_to(RAIZ)}: atualizado')
    return trocadas


def main():
    nome, dump = sys.argv[1], sys.argv[2]
    sys.path.insert(0, str(PASTA_AULAS))
    modulo = importlib.import_module(nome)
    questoes = {q['id']: q for q in json.loads(pathlib.Path(dump).read_text(encoding='utf8'))}
    faltam = [i for i in modulo.AULAS if i not in questoes]
    if faltam:
        raise SystemExit(f'ids fora do dump: {faltam}')
    parciais = {qid: parcial_da_ficha(qid, f, questoes[qid]) for qid, f in modulo.AULAS.items()}
    enunciados = {qid: f['enunciado'] for qid, f in modulo.AULAS.items() if f.get('enunciado')}
    trocadas = trocar_nos_jsons(parciais, enunciados)
    # Texto restaurado da página escaneada: enunciado inteiro ou uma alternativa (letra, texto).
    alternativas = {qid: f['alternativa'] for qid, f in modulo.AULAS.items() if f.get('alternativa')}
    saida = {qid: {'explicacao': p, **({'enunciado': enunciados[qid]} if qid in enunciados else {}),
                   **({'alternativa': list(alternativas[qid])} if qid in alternativas else {})} for qid, p in parciais.items()}
    destino = DADOS / 'aulas-escada' / f'{modulo.MATERIA}.json'
    destino.write_text(json.dumps(saida, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
    letras = {l: sum(questoes[i]['resposta'] == l for i in parciais) for l in LETRAS}
    print(f'{destino.relative_to(RAIZ)}: {len(parciais)} aulas ({len(trocadas)} também no JSON de origem); contas conferidas; letras {letras}')


if __name__ == '__main__':
    main()
