---
name: decisoes-prepenem
description: "Use antes de qualquer mudança de UI, conteúdo gerado por IA, ou visualização de dados no PrepEnem — também ao definir temas/taxonomia ou mexer em animação. Decisões de produto já fechadas, com o motivo de cada uma."
---

# Decisões já tomadas — PrepEnem

Cada item aqui é uma decisão **fechada**, com o motivo. Não são sugestões.
Se algo aqui parecer errado para a tarefa atual, levante a questão com o
usuário em vez de contrariar em silêncio.

## Identidade visual — o que é trava e o que é aberto

Definido no início do redesign visual (2026-08-05). A distinção importa:
o redesign pode reinventar quase tudo, **menos** os itens abaixo.

**Travado (não se renegocia):**

- **Teal "Clareza" é a base cromática.** `--primary: 189 80% 52%`
  (`app/globals.css:75`, também em `--ring` e `--chart-1`). Toda a paleta
  do redesign se constrói a partir dele.
- **Zero emoji na UI** (ver seção abaixo).
- **Limiares de dado esparso** (`<5` sem %, `5–15` com alerta, `15+` limpa).
- **Exceção do flip no reduced-motion.**
- **Proibição de treemap.**

**Aberto para o redesign:** tipografia, escala, densidade, elevação, forma
dos componentes, movimento, personalidade visual. Nada disso está decidido
— não trate o estado atual como referência a preservar.

## Referência por tela

O PrepEnem não tem site de referência. Cada tela ganha a sua pela skill
`montar-referencia`, escolhida pelo Pablo olhando, e registrada aqui com data.

- Nenhuma escolhida ainda (05/10/2026).
- **Desenho de química = mapa mental (opção A, Pablo, 07/10/2026):** átomo de
  verdade (núcleo de bolinhas, camadas com elétrons girando, símbolo embaixo),
  linha do átomo até uma etiqueta "H: massa 1", e a soma numa caixa. Nunca seta
  ou bolinha solta fingindo ser átomo. Exemplo: https://claude.ai/artifact/9tM1oPntj5qQ7owQEpA1rM

## Telas enxutas (06/10/2026, pedido do Pablo: menos coisa num lugar só)

- **Menu: 6 itens à vista** (Início, Treino, Flashcards, Redação, Cálculo,
  Progresso) e o resto em "Mais", aberto sozinho quando a página atual é dele.
  Tela nova entra em "Mais", a não ser que seja estudo diário.
- **Início = só o cronograma de hoje e "Começar"** (detalhe na seção Treino).
  Enquanto carrega, esqueleto do cartão, nunca tela vazia.
- **Progresso = 2 números** (total respondidas e acertos), 06/10/2026.
- **Sem contorno azul ao clicar:** anel de foco só com teclado (`FocoTeclado`,
  classe `usando-teclado`); campo de texto nunca tem anel.
  Números ficam em Progresso; a semana fica atrás de "Ver a semana".
- **Página escaneada da prova só abre sozinha se a questão depende da imagem**
  (`dependeImagem`); nas outras fica atrás de "Ver na página da prova"
  (`components/pagina-da-prova.tsx`, Treino e Simulado, 06/10/2026). A página
  inteira trazia outras 3 questões em volta.
- **Um número, um lugar.** Se a informação já aparece na tela, não repete em
  gráfico (Progresso perdeu a rosca e as barras; ficou a evolução por dia).
  Desde 21/10/2026 a evolução é barra de acertos e erros por dia nos 30 dias
  de calendário (`lib/evolucao-diaria.ts`), sem %: a linha de taxa dava "0%"
  para dia com 1 questão e espaçava igual dias com 9 dias de distância.
- **Cores mais saturadas (Pablo, 21/10/2026):** matérias saíram do pastel e o
  tema Índigo subiu de 42% para 64% de saturação, com AA conferido par a par. Baralho padrão
  usa a cor atual da matéria (`corDoBaralho`), não a gravada no seed.

## Conteúdo gerado por IA

- **Zero emoji** em explicações, feedback ou UI. Hierarquia se faz com
  tipografia (peso, tamanho, cor), não com ícone decorativo.
- **Explicações seguem estrutura baseada em evidência.** Wisniewski/Zierer/
  Hattie (2020): feedback de alta informação tem d=0.99, contra d=0.46 do
  meramente corretivo e d=0.24 do reforço. A ordem importa — começar pelo
  erro explora o efeito de hipercorreção:
  1. O que a questão pedia de fato
  2. Por que a alternativa marcada falha (**começa pelo erro**)
  3. Caminho passo a passo, com o raciocínio explícito
  4. O princípio por trás (feedback de processo, não de resultado)
  5. Como reconhecer uma questão parecida
- **Proibido**: elogio, tom motivacional genérico, "É importante notar",
  parágrafo-preview ("Vamos analisar..."), conclusão vazia que só repete o
  que já foi dito.
- **Testar prompt de explicação contra questões reais** (só leitura no banco):
  `npx tsx --env-file=.env scripts/testar-tutor.ts 3 [Matéria]`. Imprime a
  explicação e mede passos, visual, frase longa, emoji e frase proibida.
- **Questão do ENEM sem texto-base:** 14 estavam assim (ENEM 2021/2023 D1) e
  foram corrigidas em 06/10/2026 com autorização do Pablo
  (`scripts/corrigir-texto-base.ts`, dados em `scripts/data/`). Também tinham
  alternativa com palavra trocada (Q75: "negação" em vez de "conjugação").
  O PDF do INEP usa fonte codificada: extrair texto devolve lixo. A fonte boa
  é a imagem da página em `public/questoes-imagens/<id>.webp`. Gabarito: conferir
  com o `..._GB_impresso_...pdf` oficial. `faltaTextoBase()` continua no
  prompt como rede de segurança.
- **Caminhos únicos da IA (07/10/2026):** questão gerada (treino, simulado,
  banco) só entra pelo `lib/questoes-geradas.ts` (validação estrita +
  resolução por outro modelo; gabarito inválido descarta, nunca vira 'A').
  Resposta repetível vai pelo `lib/cache-ia.ts` (chave = hash do prompt; a
  explicação foi de 10.838 ms para 41 ms). Toda `pedirJson` tem prazo total de
  50 s (a Vercel mata aos 60 s). Molécula usa massa da tabela fixa; ponto
  "raiz/vértice" fora da curva é descartado. Questão errada vira cartão em
  "Meus erros · matéria" (`api/flashcards/do-erro`). Contexto do aluno (erros
  no assunto, Feynman) vai só na conversa, nunca na explicação (quebraria o cache).
  Pelo mesmo motivo, erro da IA que o CÓDIGO consegue consertar vai no
  validador, não no prompt: mudar o prompt zera o cache inteiro (ex.: peça com
  a explicação no termo, `separarTermo`, 21/10/2026).
- **Deck de livro (Pablo, 15/10/2026, artefato https://claude.ai/artifact/6PoWDVkq5cr9xN4v3EkeBR):**
  matéria "Livros", frente = título curto, verso = 1 ou 2 frases. Frase de
  capítulo (`Flashcard.capitulo`) fica trancada até "Li o capítulo N"
  (`FlashcardDeck.capituloLido`). Primeiro: O Cavalo e Seu Menino
  (`scripts/seed-livro-cavalo.ts`). O campo "digite a frase exata" ficou de fora.
- **Lembrete de leitura (Pablo, 21/10/2026):** cartão no canto ao entrar no
  site (`components/lembrete-leitura.tsx`), livros em `data/leituras.ts`.
  Página muda no − e + (fica no navegador); fechado, só volta na próxima visita.
  Plano dele: blocos de 5 páginas, começando com 4 e subindo 1 por dia.
- **Flashcards seguem o princípio da informação mínima do SuperMemo**: um
  fato por card, resposta o mais curta possível, sem enumeração longa
  (quebre em cards separados ou use cloze). Ver [[flashcard-pattern]].

## Treino

- **Prova rápida (Pablo, 21/10/2026, dia de cabeça cansada):** fica DENTRO do
  Simulado, num painel que minimiza pela setinha (lembra no navegador), não é
  tela nova. Escolhe flashcards (os do dia, ou matéria → baralho) → 3-2-1 →
  até 8 cartões → 3-2-1 → 10 questões médias, sem cronômetro: Português 3,
  Matemática 3, Biologia 3, Química 1 (`MISTURA_PROVA_RAPIDA`; o generate
  aceita `mistura`). As questões são montadas enquanto ele faz os cartões.

- **Treino do dia (Pablo, 06/10/2026):** 10 questões de cada matéria do dia:
  as do cronograma, depois Português e Matemática (`cotasDoDia`; era 20 e ele
  baixou para 10 no mesmo dia);
  uma matéria por vez, cada uma na escada com cota proporcional (em 10: 3
  fáceis, 4 médias, 3 ENEM). Retoma só treino aberto HOJE, e nunca a sessão do
  simulado (as duas ficam em `TrainingSession`; filtrar `mode`).
- **Conceitos antes do treino, um por vez (Pablo, 07/10/2026):** abrem sozinhos,
  em ordem, com Continuar (`components/treino/conceitos-do-dia.tsx`). Por
  assunto: o que precisa saber ANTES (pré-requisito, `antes`) → o que o assunto
  É, sigla por extenso (`oQueE`: "não me falou o que é MRU") → passos → regra e
  ENEM. Química de átomo e massa usa o desenho `molecula`.
- **Início (06/10/2026):** sem saudação e sem banner: cartão "Hoje" com as
  matérias e temas do dia e um botão "Começar"; revisões num link discreto.
- **Conteúdo atrasado vira o de hoje (Pablo, 15/10/2026):** o dia do
  cronograma só avança com o treino TERMINADO (`concluido`) ou o simulado
  enviado. "Pular este dia" saiu e o `pulado` antigo conta como pendente. O
  rótulo diz o dia de verdade: "Quinta-feira · conteúdo de segunda".
- **Treino é escada, decidida pelo Pablo em 05/10/2026:** resumo do conteúdo
  do dia → questões Base → Intermediárias → ENEM real por último. Só matérias
  do cronograma do dia. A etapa sai da ORIGEM (`lib/treino-etapas.ts`), não de
  `dificuldade`: as reais do ENEM estão cadastradas como fácil/médio e são as
  mais difíceis da sessão.
- **Degraus:** para até 2 questões do ENEM do assunto do dia (assunto no
  subtema/tema, não no enunciado), a IA gera 2 base + 3 intermediárias que
  quebram a questão em peças; ficam no banco com `ancoraId` e a questão do
  ENEM vem logo depois delas. Sem âncora ou sem IA, cai na escada do banco.
- **Explicação e dúvida (05/10/2026):** a IA descreve o desenho em JSON e o
  app desenha (`lib/visual/especificacao.ts`) — gerador de imagem erra eixo e
  número, então nunca imagem gerada para matemática. Desenho antes do texto,
  um passo por vez, a fórmula sai do raciocínio (concreto → desenho →
  símbolo), pergunta de recuperação no fim. Na conversa o tutor não entrega a
  resposta de cara (Bastani et al. 2025: IA que entrega piora o aprendizado),
  corrige sem concordar para agradar e muda de ângulo em vez de repetir.
  Regras e fontes no topo de `lib/tutor/prompts.ts`.
- **Explicação curta e processo desenhado (06/10/2026):** a "ideia" da
  explicação tem 1 ou 2 frases práticas ("A planta precisa de energia.
  Carboidrato é energia."), 2 a 4 passos opcionais. Processo (fotossíntese,
  respiração, digestão) vira o desenho `processo`, animado; processo forçado
  (etapa sem nada entrando nem saindo) é descartado pelo validador. O texto
  antigo das questões importadas (com emoji) fica atrás de "Ver texto completo",
  sem emoji (`lib/explicacao-antiga.ts`).
- **Conceito com nome vira peça com exemplo (Pablo, 18/10/2026: "não sei o
  que é queda livre, me dá um exemplo"):** errou, a explicação abre com o
  conceito central (o que é + exemplo do dia a dia) nas peças; a "ideia" nunca
  é só fórmula e aponta a pegadinha (velocidade para o lado não muda o tempo
  de queda); "seu erro" é a conta com os números do enunciado que dá
  exatamente a alternativa marcada. Testado em 3 questões: antes, o erro
  inventava "√8 ≈ 2,8 arredondado para 2".
- **Aluno do zero (18/10/2026):** o texto gerado é lido pelo agente
  `aluno-do-zero` (só sabe as quatro operações) sobre a jornada de
  `scripts/jornada-do-aluno.mts`. Primeira leitura: ~25 tropeços em palavra ou
  símbolo nunca explicado e 3 de 7 "seu erro" com conta falsa. Daí a regra
  `PALAVRA_NOVA` (símbolo e termo explicados entre parênteses na 1ª vez, conta
  que muda de lado dita em palavras, tudo em português), usada na explicação,
  no conceito e na lição; e o validador que descarta "seu erro" com chute
  ("provavelmente", "arredondado") ou fórmula sem `$`.
- **A IA pede cena (06/10/2026):** questão sobre algo que muda no tempo abre
  com uma `cena`. Medido com 3 questões de Física: antes, só "transformação";
  depois, a queda dos corpos chega com duas bolas caindo. O validador conserta
  o que a IA erra sempre: nome de função vira letra, objeto inventado vira
  bola (nome no rótulo), relógio de queda é cortado no chão. A IA copia o
  EXEMPLO do formato mais do que a regra: para mudar o comportamento, mude o
  exemplo.
- **Exemplo resolvido e nível acima (05/10/2026, pedido do Pablo):** as 3
  primeiras questões de cada matéria (eram 5; 3 desde 07/10/2026) no treino do dia chegam resolvidas
  (gabarito marcado, explicação e tutor abertos) — nunca a do ENEM nem a de
  nível acima (`ehExemploResolvido` em `lib/treino-etapas.ts`). Cada bloco de
  âncora fecha com 1 questão "Nível acima" gerada por IA no estilo
  Fuvest/Unicamp (+ ITA/IME nas exatas), original, autossuficiente, só
  programa do médio, conferida pelo verificador. A gerada nunca se apresenta
  como real.
- **Treino em duas colunas (Pablo, 15/10/2026, artefato
  https://claude.ai/artifact/15stmsNn2K6a3xQEzfwLaj, "A com o quadro do B"):**
  na tela grande (`lg`) a questão fica na esquerda com os botões embaixo, a
  resolução na direita, e a página não rola: só a coluna da direita. A
  explicação mostra UM passo por vez (Próximo / Passo anterior, sem empilhar)
  e o "Não entendeu? Pergunte aqui" fica preso embaixo da coluna. No celular,
  uma coluna só, na ordem de antes. **A direita não rola** (Pablo, mesmo dia):
  o que é sobre a resposta dele (Correto/Incorreto, onde errou, glossário,
  Feynman) vai para a esquerda (`lateral`, portal), o "01 de 41" grande vira
  linha pequena e a conversa rola só dentro dela. Medido: cabe em 1920×1030;
  em 1366×768 passa um pouco quando o passo tem `cena`.
- **Exemplo resolvido sem escolha (Pablo, 07/10/2026):** só a alternativa certa
  aparece, já marcada; a resolução vem ao lado (embaixo no celular). Conta = visual `quadro`
  (abaixo); `transformacao` só deduz fórmula. Questão de uma palavra (acento, sílaba)
  = visual `palavra`, 1 passo só. Questão simples tem resposta pequena.
- **Quadro de escola em toda conta (Pablo, 08/10/2026, foto do quadro do
  Ferretto: "exatamente desse jeito"):** visual `quadro`
  (`components/visual/quadro-escola.tsx`): quadro branco também no escuro,
  dados da questão à esquerda, fórmula geral, o que cada letra é, "troca as
  letras pelos números" com seta laranja, resultado em verde e 1 frase do que
  ele quer dizer. Antes dele, o passo "De onde vem" com números redondos. TODA
  questão tem visual no 1º passo, de qualquer matéria. A conversa com a IA fica
  aberta desde o 1º passo (o "Não entendi" mandava a pergunta para uma conversa
  escondida até o último passo).
- **Forma do quadro = a da prévia (Pablo, 15/10/2026, print do artefato:
  "assim que eu quero"):** `quadro` compacto e inteiro de uma vez, sem
  rótulos, legenda, nota nem botões (a caneta não escreve bloco a bloco). O
  quadro das deduções do Cálculo (`Quadro`, de `transformacao`) também é
  branco, com "Continuar" e os botões fora dele. Conversão de unidade em
  qualquer campo da explicação: o atalho (÷ 3,6), nunca × 1000 ÷ 3600.
  Quadro só com número nos dados (o validador descarta o sem número, que era
  a fórmula três vezes); questão sem número abre com tabela do efeito
  (velocidade 2× → energia 4×). Palavra solta na fórmula vira `\text{}`
  (`palavrasComoTexto`: "massadocorpo"). "De onde vem" sem integral ou derivada.
  Regra de prompt não basta: o CÓDIGO barra (15/10/2026). `semCifrao` tira o
  `$` que a IA põe no quadro; `temCalculo` derruba passo com integral/derivada
  na questão e no resumo; `comCache` revalida o que sai do cache (senão a
  explicação errada fica 30 dias). Erro novo da IA = regra no validador + teste.
- **Quadro primeiro, sem cena na questão (Pablo, 15/10/2026: "o quadro branco
  e a fórmula", depois de ver o carro com gráfico no lugar):** na explicação
  da questão, conta abre com o `quadro` no 1º passo e a `cena` não entra (ela
  fica nas lições de Cálculo). Nos conceitos do dia, o passo da fórmula também
  é `quadro`, e o texto ao lado EXPLICA o desenho, nunca o descreve. Conceitos
  do dia em duas colunas na tela grande (texto à esquerda, desenho à direita).
  Resumo: no máximo 4 assuntos e teto de tokens pelo tamanho do prompt (a Groq
  gratuita recusa acima de 8.000/min; o prompt já tem ~3.600).
- **"Como você fez?" na conversa (Pablo, 15/10/2026: "multiplicar por 1000 não
  dá"):** atalho de cabeça primeiro (km/h ÷ 3,6; vírgula 3 casas) e sempre um
  visual mostrando o atalho. Só a regra não mudou nada em 3 testes; o EXEMPLO
  no prompt mudou os 3 (`scripts/testar-conversa.ts`).
- **Vestibular real, a última do dia (06/10/2026):** 48 questões reais (ITA
  2025, IME 2024, Fuvest 2024/25, Unicamp 2024, Unesp 2025) em
  `data/vestibular`, gravadas com `nivel: 'vestibular'` e `anoProva` vazio
  (`anoProva` marca prova do ENEM). Cada gabarito conferido contra o oficial
  e por resolução própria; o teste guarda uma segunda cópia dos gabaritos.
  Resolução "Resolva comigo": passos de clicar, conta escrita como caneta.
  Gabarito de cursinho resumido por IA veio errado: só fonte oficial.
  Questão nova: `scripts/seed-vestibular.ts` (só cria/atualiza as próprias).
- **Simulado semanal (06/10/2026):** uma matéria, 10, 15 ou 20 questões,
  3 min por questão; sorteadas mas em ordem fácil → média → ENEM
  (`ordenarPorEtapa`). O de 45 a 180 questões saiu.
- "Começar do zero" no treino monta sessão nova; antes só restaurava a mesma.
  Chamava "Recomeçar" e o Pablo apertou achando que voltava de onde parou
  (15/10/2026): o nome diz que sai de onde está. Voltar é automático.
- **Conceito antes do assunto novo (Pablo, 15/10/2026: resistor "sem
  revisar conceito"):** a Revisão de Conceitos cobre só até 4 assuntos do
  cronograma; o treino completa com outros. Na 1ª questão de assunto não
  coberto, o conceito dele vem antes (`lib/conceito-antes.ts`), já buscado
  durante a questão anterior. Falhou a IA, a questão segue sem cartão.
- Sessão aberta só é retomada se for do mesmo dia (horário de Brasília) e não
  for simulado — a de outro dia foi montada para outro dia do cronograma.
- **Flashcards do dia (06/10/2026):** o fim do treino leva a `/flashcards/dia`,
  deck virtual com 10 cartões de cada matéria do treino (errados primeiro,
  depois o assunto do dia; dominados e já respondidos hoje ficam fora).
  Escolha em `lib/flashcards-dia.ts`; o deck não tem modo nem botão de editar.

## Redação

- **A IA levanta evidência, o código dá a nota (05/10/2026).** C1, C2 e C5
  saem inteiras das regras da grade do INEP (`lib/redacao/grade.ts`); C3 e C4
  usam o nível da IA com teto pela evidência e pelas travas. Régua e fontes
  em `docs/redacao-enem-correcao.md` — mude lá antes de mudar o código.
- Treino por partes usa as redações-modelo de `data/redacao/modelos.ts`
  (textos originais, temas reais, cada trecho comentado). Não inventa
  texto-base com IA. Repertório nos modelos: só fato verificável.

## Trilha de Cálculo

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

## Visualização de dados

- **Dado esparso é ruído, não informação.** Numa amostra binária pequena,
  uma resposta a mais muda a taxa em 20-33 pontos:
  - `< 5` questões: **não mostra %** — mostra "poucos dados"
  - `5–15`: mostra a % **com indicador de baixa confiança**
  - `15+`: mostra a % limpa
  - Em todos os casos, **o n fica visível** ("73% · 15 questões", nunca o
    número solto). Implementado em `TaxaAcerto` (`app/progresso/page.tsx`).
- **Sem treemap** para comparar desempenho entre matérias/subtemas. Área
  visual não permite comparação precisa entre categorias (Nielsen Norman
  Group) — e comparar taxa de acerto é exatamente esse caso de uso.

## Animação

- `prefers-reduced-motion` é respeitado, **exceto no flip do flashcard** —
  ali a rotação comunica o estado (a carta virou, o conteúdo mudou), não é
  decoração. Sob reduced-motion o flip fica mais curto e sem bounce
  (`{ duration: 0.25, ease: 'easeOut' }`), mas continua visível.
- **Partículas de fundo e parallax respeitam sempre** — esses são
  decorativos e são exatamente o tipo de movimento que a diretriz mira.
- **Flashcard é a opção A, escolhida pelo Pablo em 05/10/2026** (entre A "flip
  firme" e B "revelar embaixo, pergunta fica na tela"): flip 3D de 0,42 s sem
  mola, pilha atrás, saída para o lado da resposta, Espaço vira e 1/2 respondem.
- Detalhes de implementação e padrões em uso: [[animation-system]].

## Taxonomia de temas

- Temas usam **nomes de conteúdo reconhecíveis** pelo estudante
  ("Estequiometria", "Geometria Analítica"), não jargão de competência da
  matriz do INEP.
- **Categorias temáticas foram rejeitadas** ("Esporte e Sociedade", "Temas
  Culturais e Sociais"). Essas são categorias de *tema de prova*, não de
  conteúdo disciplinar — a questão vai para o tema de conteúdo mais próximo,
  senão a navegação por tema deixa de servir ao propósito (achar o que
  estudar).
- Taxonomia em `lib/tema-taxonomy.ts`; o campo `subtema` original fica
  intacto no banco, `tema` é populado a partir dele.

## Infraestrutura

- **Neon é o mesmo banco de dev e de produção.** Não há banco separado.
  Qualquer script que escreve, escreve em produção — descoberto quando o
  script de geração de imagens atualizou produção antes do deploy. Ver
  [[prisma-neon-safety]] para o checklist antes de escrever.
- **AWS não será configurada.** As credenciais eram do bucket da Abacus (não
  do usuário) e o bucket já responde 403. Upload de PDF degrada com mensagem
  clara (`lib/aws-client.ts`, 503) em vez de estourar 500. As questões com
  imagem usam `public/questoes-imagens/` pré-renderizado e o `pdf-proxy`
  busca do INEP — nenhum dos dois depende de S3.
- **Login e cadastro não esperam a sessão** (`components/app-layout.tsx`):
  esperar `/api/auth/session` acordava o Neon e deixava 6,7 s de círculo antes
  do formulário (06/10/2026). A conta é reconferida no banco a cada 30 min
  (`SESSION_REVALIDATE_INTERVAL_MS`), não a cada minuto. A primeira consulta
  com o Neon dormindo leva ~3 s (medido no ar); as seguintes, ~0,5 s.
- **`AUTH_TRUST_HOST` não é necessário.** É conceito do Auth.js v5; este
  projeto usa NextAuth v4, onde a variável não tem efeito.
- **Validar em produção depois do push, nunca só local.** Já houve caso de
  bug reportado em produção que não reproduzia local — porque produção
  rodava código de antes do push. Ver [[vercel-deploy-checklist]].
