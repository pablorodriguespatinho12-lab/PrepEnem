"""Lista cada passo de explicação do dia 2 que mudou desde um commit, com o
enunciado, as alternativas e o texto antes/depois, para o revisor-de-fatos.

Uso: python3 scripts/passos-mudados.py <commit> <saida.md>
"""
import glob
import json
import subprocess
import sys

PASTA = 'data/revisao-final/dia-2'


def antes(commit: str, caminho: str) -> dict:
    bruto = subprocess.run(['git', 'show', f'{commit}:{caminho}'], capture_output=True, text=True, check=True).stdout
    return {q['id']: q for q in json.loads(bruto)}


def main() -> None:
    commit, saida = sys.argv[1], sys.argv[2]
    out, total = [], 0
    for caminho in sorted(glob.glob(f'{PASTA}/*.json')):
        if caminho.endswith('aulas.json'):
            continue
        velhas = antes(commit, caminho)
        for q in json.load(open(caminho, encoding='utf8')):
            v = velhas.get(q['id'])
            pv = {p['titulo']: p for p in v['explicacao']['passos']} if v else {}
            mudados = [p for p in q['explicacao']['passos'] if pv.get(p['titulo']) != p]
            if v and v['explicacao'].get('ideia') != q['explicacao'].get('ideia'):
                mudados.append({'titulo': 'Ideia', 'texto': q['explicacao']['ideia']})
            if not mudados:
                continue
            alts = ' | '.join(f"{l}) {q[l]}" for l in 'ABCDE')
            out += [f"# {q['id']} ({q['materia']}, {q['tema']})", q['enunciado'], alts, f"Certa: {q['resposta']}", '']
            for p in mudados:
                total += 1
                out += [f"## {p['titulo']} (DEPOIS)", p['texto']]
                if p.get('visual'):
                    out.append(f"[desenho {json.dumps(p['visual'], ensure_ascii=False)}]")
                out.append('')
    open(saida, 'w', encoding='utf8').write('\n'.join(out))
    print(total, 'passos mudados')


if __name__ == '__main__':
    main()
