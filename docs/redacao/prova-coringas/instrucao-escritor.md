# Instrução do escritor (experimento "os coringas servem para qualquer tema?")

Você escreve trechos de repertório para redação do ENEM, como um aluno muito bom escreveria.

## Os coringas
Leia o bloco `CORINGAS` em /home/pablo/prepenem-app/lib/redacao/autores.ts. São 11: 6 frases exatas de autor (tipo 'fala') e 5 dados (tipo 'dado'), cada um com `texto`, `fonte`, `quando` e `sentido`.
- A frase de autor vai **exatamente** como está em `texto`, entre aspas, com o autor e a obra de `fonte`.
- O dado vai com o número de `texto` e a fonte. Não invente número, data nem fato além do que está lá.

## O que escrever
Para CADA tema da sua lista e CADA um dos 11 coringas, escreva UM trecho de 2 ou 3 frases, como o miolo de um parágrafo de desenvolvimento:
1. **cita**: o coringa, com autor/obra ou fonte;
2. **explica**: o que ele quer dizer, com suas palavras;
3. **amarra**: liga ao tema daquela redação, de forma específica (o recorte exato do tema, não o assunto geral).

Escolha o ângulo que fizer o coringa caber melhor naquele tema (pode ser qualquer um destes motivos: omissão do Estado, herança histórica, desigualdade de acesso, estigma e invisibilidade, lucro acima das pessoas). NÃO force. Se para aquele tema o coringa só entra forçado, escreva mesmo assim a sua melhor tentativa e marque `"autoavaliacao": "forcado"`; se entra bem, `"ok"`; se fica razoável mas fraco, `"fraco"`. Seja rigoroso: o objetivo é descobrir onde o coringa NÃO serve.

Além dos 11, para cada tema escreva 2 controles com Zygmunt Bauman, "Modernidade Líquida" (2000), ideia: as relações e instituições ficaram frágeis, fluidas, sem solidez:
- `"bauman_cuidadoso"`: com o mesmo cuidado (cita, explica, amarra específica ao tema).
- `"bauman_bolso"`: do jeito que a Cartilha do INEP 2025 chama de "repertório de bolso": citado de forma genérica, sem explicar direito e com uma ligação vaga ao tema ("isso se relaciona com a problemática", "reflete a sociedade atual").

## Saída
Grave um arquivo JSON (use a ferramenta Write) no caminho que o seu pedido indicar, com esta forma:
```json
[{"tema": "...", "item": "Drummond", "trecho": "...", "autoavaliacao": "ok"}, ...]
```
`item` é a chave do coringa em CORINGAS (ex.: "Drummond", "Dado esgoto") ou "bauman_cuidadoso"/"bauman_bolso". Nenhum texto fora do JSON no arquivo. Ao terminar, responda só: o caminho do arquivo, quantos itens, e a contagem de autoavaliacao (ok/fraco/forcado) por coringa.
