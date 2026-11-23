# Aula no molde do robô para questões de Matemática e Física (guia do redator)

Pedido do Pablo (22/11/2026): **toda questão de Matemática e Física** tem a equação MONTADA antes de resolver, com letras
que são a inicial da palavra, e cada coisa numa tela. As 187 lousas do "molde antigo" (sem equação montada) são reescritas
neste molde; depois `lib/aula-lousa/do-robo.ts` transforma em lousa (letras → equação → porquê → achando → volta).

## O que você recebe e devolve

- Entrada: `<pasta>/<id>.json` com enunciado, alternativas, gabarito (`resposta`) e a explicação antiga (que já tem a conta certa).
- Saída: `<pasta>/saida/<id>.json` com `{ "passos": [...], "valor_final": <número>, "unidade": "km" }`.
- Questão **sem conta** (só conceito: "qual lei explica?"): devolva `{ "semConta": true, "motivo": "..." }` e não invente equação.

## O molde de `passos` (exatamente estes títulos e `visual.tipo`)

1. `As fórmulas desta questão` — `visual: {tipo:'formulas', itens:[{nome, figura, formula}]}` e texto `Estas são as fórmulas que a questão usa. Já estão prontas: é só usar.` (`figura`: uma palavra curta, ex. `carro`, `quadrado`, `circuito`.)
2. `O que eu tenho` — texto `Primeiro, tire os números do enunciado.` e `visual: {tipo:'tabela', titulo:'O que eu tenho', cabecalho:['Informação','Valor'], linhas:[[nome, valor com unidade], ...]}`.
3. `A equação em letras` — `visual: {tipo:'equacao', formula:'v = d ÷ (t1 + t2)', leitura:'velocidade média = distância total ÷ tempo total', letras:[{letra, oque}]}`. O `texto` é: o que a questão quer + POR QUE a equação é assim (a lousa põe isso numa tela separada, DEPOIS da equação) + `Agora é só achar cada letra.`
4. Um passo por letra que falta: título `Achando X (palavra)` ou `Achando X: o seu jeito` (quando a pegadinha é o erro mais comum, nomeando a alternativa errada). Só texto, `visual: null`.
5. `Volta na equação` — texto com a equação com os números e o resultado, terminando em `Letra X.` (X = o gabarito). `visual`: tabela `As letras` (`cabecalho: ['Letra','Valor']`).
6. `Questão parecida? Faça assim` — texto `Pista: ... → ...` e tabela `A receita` com `cabecalho: ['Passo','Nesta questão']` e as 4 linhas `1. Tabela do que eu tenho`, `2. Equação em letras`, `3. Achar cada letra`, `4. Substituir`.

Modelo completo e correto: `exemplo-fisica.json` (Física) e `exemplo-matematica.json` (Matemática), na pasta de entrada.

## Regras do Pablo (valem em tudo)

- **Letra = inicial da palavra** (T = terras, D = dias, C = cidades). Letras clássicas ficam: v velocidade, t tempo, F força, m massa,
  h altura, Q calor, U tensão, i corrente, P potência, E energia, x incógnita. Nunca A, B, C soltas sem sentido; nunca uma letra que já é
  ponto da figura do enunciado.
- **Equação MONTADA com os dados da questão e resolvida A PARTIR dela**: primeiro a equação com letras, depois cada letra, depois volta
  na equação com números. Nada de resolver "de cabeça" sem equação.
- **Número antes da letra**: regra ou fórmula com letra só depois do mesmo caso com números e um exemplo do dia a dia.
- **A tela das letras é só `letra = palavra`**: sem explicar. A explicação vai no texto do passo 3.
- Palavra ou símbolo novo (diagonal, raiz, "ao quadrado", Pitágoras) é explicado ANTES de usar, em palavras que o aluno já tem
  ("ao quadrado" = vezes ele mesmo). Aluno que só sabe as 4 operações.
- Frações escritas `a/b` (ex.: `5/3`, `3/5 × 5/x = 1/2`) viram fração em pé na lousa. Use só `× ÷ + − =` e números; **sem LaTeX, sem `$`**.
- Cada linha de texto ≤ ~150 letras; o passo todo ≤ ~5 linhas. No máximo 9 passos no total.
- Zero emoji, zero elogio, zero "vamos ver". Português do Brasil.
- Confira a conta com Python antes de devolver. `valor_final` é o número da alternativa certa; a `Letra X` do passo 5 tem de ser o gabarito.
