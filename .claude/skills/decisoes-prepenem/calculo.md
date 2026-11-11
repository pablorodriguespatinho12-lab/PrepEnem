# Decisões já tomadas: Trilha de Cálculo

Parte da skill `decisoes-prepenem` (o índice e as outras decisões estão em `SKILL.md`).
Cada item é decisão fechada, com o motivo.

- **Opcional, para o tempo livre (05/10/2026):** do pré-cálculo ao Cálculo 3
  em 41 degraus (`data/calculo/trilha.ts`). **Sem tranca e sem meta (Pablo,
  07/10/2026: "toda hora volto do início"):** toda lição abre desde o começo,
  as etapas da lição são botões para pular, e terminar os exercícios conclui
  com qualquer número de acertos (a meta de 70% saiu). Concluída, volta em
  revisão espaçada com 2, 7, 21 e 60 dias; se errar, volta no dia seguinte.
- Toda lição na mesma ordem: tentativa curta → construção do raciocínio →
  fórmula como resumo → 3 exemplos (completo, 1 lacuna, 2 lacunas) →
  exercícios com resolução comentada → pergunta de recuperação.
- **Lições escritas à mão** (`data/calculo/licoes`): p1 a p12 (todo o pré-cálculo) e c1 a c12 em 06/10/2026.
  A geração por IA está desligada (`CALCULO_LICAO_IA`, teste de 05/10: contas
  certas, explicação sem sentido); lição sem versão escrita aparece "em
  preparação". Escrever a próxima é o caminho, não religar a IA.
- **Exercício de desenhar (06/10/2026):** resposta `{ tipo: 'desenho', reta }`.
  Ele risca eixos e reta; cada traço vira reta na hora e a conferência é conta
  (`lib/calculo/desenho.ts`, tolerância de 1/3 de quadradinho), nunca IA. Diz o
  que falta e, se errou, mostra a certa tracejada. Por ora só reta (p2 e p3).
- **Sem múltipla escolha nas lições de Cálculo (Pablo, 07/10/2026):** os 23
  exercícios de escolha saíram ("tira mesmo"). No lugar do "qual destes é
  função", o "por que funciona": a fórmula deduzida no quadro, do jeito do
  Universo Narrado (canal que o Pablo usa de referência de MÉTODO, nunca de
  conteúdo): começa pela pergunta, uma regra só (o que faz de um lado do =
  faz do outro), condição no canto (`condicao`), operação anotada em cada linha
  (`lado`), peça usada no cantinho (`ajuda`), termo novo em cor (`\novo`), o
  que cancela riscado (`\corta`), nome dado depois que aparece (Δ), resultado
  em `\boxed`. Feito: Bhaskara na p4. Lacuna de exemplo resolvido continua.
- **Nível acima no Cálculo (Pablo, 06/10/2026: "saber mais do que a maior parte
  do pessoal"):** toda lição escrita fecha com 2 exercícios `nivelAcima`
  (estilo ITA, Fuvest, Unicamp), originais, resolvíveis só com o que a trilha
  já ensinou. Marcados "estilo X" na tela, nunca apresentados como questão real.
- **Cena antes da fórmula (Pablo, 06/10/2026, pedido da psiquiatra: coisas
  visualizáveis):** toda lição abre com uma cena concreta que se mexe
  (visual `cena` em `lib/visual/especificacao.ts`: veículo andando por uma
  função, relógio em x, gráfico junto). O exemplo do Pablo (carro e moto) é o
  princípio, não a receita: cada conceito ganha a cena que melhor o mostra.
  Feitas p1 a p12: carro (função), rastro do carro (gráfico), vela e carro×moto
  com a = velocidade e b = largada (afim), bola jogada (parábola), moto 2 min
  atrás = f(x − 2) (transformação), balão que dobra (potência), balão que
  soma contra balão que dobra (exponencial, p7), o mesmo balão ao contrário
  (logaritmo, p8), ponto girando no círculo, desenho `roda` (seno e cosseno,
  p9), roda-gigante desenrolando a onda (funções periódicas, p10), táxi com taxímetro como máquinas em fila
  (composição e inversa, p11), carro que acelera com secante virando
  tangente (taxa média, p12), carro que anda metade do que falta até o pedágio
  (limite, c1), degraus do estacionamento com bolinha vazia (continuidade,
  c2; pedaço de função limitado com `0*sqrt(...)`), balão que perde metade da
  altura e corrida x³ × 2ˣ (limites no infinito, c3), o velocímetro do carro x² e o 2x saindo da
  definição (derivada, c4), velocímetro da cena anotando 3, 12, 27 para x³
  (regra da potência, c5). A cena tem `velocimetro: true` desde a c4. Retângulo que cresce, desenho
  `retangulo`: faixa de cima + faixa do lado + canto (produto, c6), táxi com velocímetro e taxímetro como engrenagens
  (cadeia, c7), carro eˣ com km igual ao velocímetro (exp, log e trig, c8),
  bola com velocímetro marcando zero no topo (subir, descer e o topo, c9),
  cerca de 20 m com o retângulo sem faixas (`faixas: false`) e a caixa (otimização, c10),
  desenho `fatias`: retângulos que afinam sob a velocidade (integral, c11), hodômetro
  e velocímetro como operações inversas (Teorema Fundamental, c12). Lição nova
  nasce com cena.
- **Tela da cena (Pablo, 07/10/2026: "eu quero algo visual mesmo"):** equação
  grande no topo, embaixo 2 a 4 linhas curtas do que cada pedaço é (`legenda`,
  "5 → km por minuto"), o objeto andando e o plano cartesiano inteiro, com os
  quatro lados do zero e seta nos eixos. Toca sozinha; sem deslizante. O texto
  do passo vem embaixo e tem 1 ou 2 frases. Lição nova escreve a `legenda`. O x é o relógio, nunca "o carro".
- Antes de commitar lição nova: os testes de `data/calculo` (inclusive: nenhuma
  lacuna nem gabarito pode ser alterado pelo validador; decimal no fim da
  resolução vai fora do `$`, "que dá 0,78", porque `0{,}78` não é lido; validador e
  gabarito conferido contra a resolução, que precisa terminar em "= valor") e
  conferir que todo ponto marcado num gráfico está sobre a curva.

