# Briefing: questões de REFORÇO do dia 2 (PrepEnem)

O aluno (Pablo, tem TDAH, estuda para o ENEM sabendo pouco) erra uma questão da prova
e o site mostra uma questão PARECIDA do mesmo conteúdo, estilo ENEM, para ver se ele
entendeu. Você vai escrever essas questões.

## Onde escrever
- Só o arquivo que o seu pedido indicar (ex.: `data/revisao-final/dia-2/reforco-quimica.json`).
- NÃO mexa em nenhum outro arquivo. NÃO rode script que grave no banco.
- Molde exato (copie o formato, campo por campo): `data/revisao-final/dia-2/reforco-natureza.json`
  (15 questões de Física já aprovadas).
- O que o aluno já viu de cada conteúdo (use as mesmas palavras e a "Palavra-chave"):
  `docs/revisao-final/dia-2/quimica.js`, `biologia.js`, `matematica.js` (campo `aula` de cada tema).

## Regras de cada questão
- `id`: `d2-reforco-<area>-<tema-curto>-NN` (ex.: `d2-reforco-qui-org-01`). Únicos.
- `materia` e `tema`: EXATAMENTE como nos arquivos de docs (ex.: "Química", "Química Orgânica").
- `origem`: "Reforço do dia 2".
- Estilo ENEM: um contexto curto do dia a dia + a pergunta. 5 alternativas, só 1 certa;
  os erros (distratores) vêm de erros comuns de aluno (conta trocada, conceito confundido).
- O enunciado NUNCA diz "na figura", "observe a imagem", "no gráfico abaixo".
- Letra certa espalhada entre A, B, C, D e E no arquivo.
- Português simples. Toda palavra técnica explicada na 1ª vez, entre parênteses ou numa peça.
- Fato e conta CERTOS. Refaça cada conta.
- Fórmula que a aula não ensinou (h = 5t², v² = 2gh...) só entra mostrando de onde vem em conta
  de 4 operações, e "t²" escrito também como "t × t" (Pablo não entendeu o "t ao quadrado", 12/11/2026).

## A explicação (campo `explicacao`), igual ao molde
- `conferencia`: a conta/raciocínio + letra + de onde vem cada distrator.
- `ideia`: no máximo 2 frases e 300 letras.
- `pecas`: 1 a 3, cada `significado` até 320 letras.
- `passos`, nesta ordem e com estes títulos: "A pergunta", "O que acontece", "Jeito rápido",
  "Por que funciona", "A resposta". Texto de cada passo até 900 letras.
  - "A pergunta" SEMPRE com `visual` do tipo `figura` (lista abaixo), com `rotulos` (até 4,
    cada um até 28 letras) com os números/nomes DA QUESTÃO, sem entregar a resposta.
  - Questão com conta: o passo "Jeito rápido" tem `visual` tipo `quadro` (veja os do molde:
    `dados` com números, `formula`, `legenda`, `contas`, `resultado`, `nota`; LaTeX com `\\,`
    para espaço de milhar e `{,}` para vírgula decimal).
  - "A resposta": "Letra X, ..." e por que cada distrator está errado.
- `seuErro`: null.
- `checagem`: `pergunta`, `opcoes` (até 4, cada uma até 60 letras), `certa` (igual a uma das
  opções), `resposta`.
- Proibido: "é importante notar", "vale ressaltar", "vamos analisar", derivada, integral, emoji.

## Figuras em pixel disponíveis (campo `nome`) e o que vai em cada rótulo (na ordem)
Química:
- `molecula-cadeia`: cadeia de carbonos com um grupo em destaque. rótulos: [nome ou fórmula, grupo em destaque, pergunta ou dado, extra]
- `fumaca-chamine`: chaminé soltando gases e nuvem. rótulos: [gás que sai, efeito no ambiente, fonte/combustível, extra]
- `bequer-ph`: béquer com líquido e régua de pH. rótulos: [solução, pH ou concentração, volume/massa, extra]
- `pilha-eletrodos`: dois metais num fio com elétrons andando. rótulos: [metal que oxida (esquerda), metal que reduz (direita), o que passa no fio, extra]
- `balanca-receita`: reação como receita, entra e sai. rótulos: [o que entra, o que sai, proporção, extra]
Biologia:
- `cadeia-alimentar`: planta → bicho → bicho, energia caindo. rótulos: [produtor, consumidor 1º, consumidor 2º, energia/extra]
- `celula`: célula com organelas, uma em destaque. rótulos: [organela, o que faz, extra, extra]
- `cruzamento`: quadro de cruzamento 2 × 2. rótulos: [pai, mãe, pergunta, extra]
- `corpo-sangue`: coração bombeando, sangue indo e voltando. rótulos: [órgão, o que leva, extra, extra]
- `selecao-natural`: bichos de 2 cores num ambiente. rótulos: [ambiente, quem sobrevive mais, quem some, extra]
- `virus-bacteria`: causador, mosquito/vetor e pessoa. rótulos: [causador, vetor, doença, prevenção]
Matemática:
- `porcentagem-barra`: barra de 100 quadradinhos. rótulos: [total, porcentagem, pergunta, extra]
- `grafico-barras`: gráfico de barras. rótulos: [o que mede, valores, pergunta, extra]
- `funcao-reta`: reta num gráfico com um ponto andando. rótulos: [fórmula, valor de partida, quanto sobe, extra]
- `solido-caixa`: caixa/cilindro enchendo. rótulos: [medida 1, medida 2, medida 3, pergunta]
- `figura-plana`: retângulo/triângulo com medidas. rótulos: [base/lado, altura/lado, pergunta, extra]
- `escala-regua`: mapa com régua. rótulos: [escala, medida no mapa, pergunta, extra]
Use a figura que combina com o caso; pode repetir figura entre questões do mesmo tema.

## Como saber se ficou certo
Rode e repita até passar (o teste lê todo `reforco-*.json`):
`npx vitest run data/revisao-final/provas-dia-2.test.ts`
Ele confere formato, tamanhos, figura no 1º passo, quadro na conta, ids e "Sua vez".
No fim, responda em 3 linhas: quantas questões, quantas por tema, e "teste passou" (com a linha
"Tests N passed" que apareceu).
