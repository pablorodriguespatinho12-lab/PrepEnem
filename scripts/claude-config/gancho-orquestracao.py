"""Liga o lembrete automatico: toda vez que um agente volta, o Claude confere e atualiza o agente.
Rodar pelo Pablo (o Claude nao pode mudar settings). Pode rodar 2 vezes sem duplicar."""
import json
from pathlib import Path

ARQ = Path(__file__).resolve().parents[2] / '.claude' / 'settings.json'
TEXTO = ('Agente voltou: 1) confira o achado com comando; 2) se errou, grave 1 linha no arquivo do agente '
         '(ou em distribuir-trabalho), editando a linha velha; 3) diga "aprendi: X, gravei em Y".')
SAIDA = {'hookSpecificOutput': {'hookEventName': 'PostToolUse', 'additionalContext': TEXTO}}
COMANDO = "echo '" + json.dumps(SAIDA, ensure_ascii=True) + "'"

dados = json.loads(ARQ.read_text())
lista = dados.setdefault('hooks', {}).setdefault('PostToolUse', [])
if any(h['command'] == COMANDO for g in lista for h in g['hooks']):
    print('Ja estava ligado.')
else:
    lista.append({'matcher': 'Agent', 'hooks': [{'type': 'command', 'command': COMANDO}]})
    ARQ.write_text(json.dumps(dados, indent=2, ensure_ascii=False) + '\n')
    print('Ligado. Vale na proxima sessao.')
