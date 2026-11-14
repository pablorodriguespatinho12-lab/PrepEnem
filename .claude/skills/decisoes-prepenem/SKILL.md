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

- **Fluidez e Início = Nubank (Pablo, 21/10/2026: "achei muito legal e fluido",
  o site e o app).** Medido em nubank.com.br: título de 112px, blocos de cor
  de ponta a ponta, 57 elementos em pílula (999px), transição de 0,65 s,
  `scroll-behavior: smooth`. Venda fora (foto, CPF, carrossel do blog). O
  Pablo escolheu a opção B de https://claude.ai/artifact/Wy2USfyj6hiYfSKA4dKdfs.
- **Desenho de química = mapa mental (opção A, Pablo, 07/10/2026):** átomo de
  verdade (núcleo de bolinhas, camadas com elétrons girando, símbolo embaixo),
  linha do átomo até uma etiqueta "H: massa 1", e a soma numa caixa. Nunca seta
  ou bolinha solta fingindo ser átomo. Exemplo: https://claude.ai/artifact/9tM1oPntj5qQ7owQEpA1rM

## Telas enxutas (06/10/2026, pedido do Pablo: menos coisa num lugar só)

- **Menu: 6 itens à vista** (Início, Treino, Flashcards, Redação, Cálculo,
  Progresso) e o resto em "Mais", aberto sozinho quando a página atual é dele.
  Tela nova entra em "Mais", a não ser que seja estudo diário.
  **Treino = Provas (Pablo, 02/11/2026: "tem a mesma função e é até melhor,
  inclui flashcards antes"):** o item Treino do menu e o atalho do Início
  abrem `/provas`, e Provas saiu do "Mais". O treino do dia (`/treino`) fica
  só pelo "Começar" do Início, porque é ele que faz o cronograma andar; o item
  Treino fica aceso nas duas rotas.
  **Passeio do iniciante (02/11/2026):** Vestibular saiu do menu (tela toda
  "Em construção"; as 48 questões reais seguem no treino do dia). Na Redação,
  "Treino por partes" é o cartão grande do topo ("Primeira vez? Comece aqui")
  e a lista de temas virou "Ou escreva a redação inteira". O lembrete de
  leitura aparece só na 1ª tela da visita e some ao trocar de tela (cobria o
  conteúdo em 8 telas); entrou pelo Início, não aparece. Banco mostra o
  enunciado com `MathText` (aparecia `$\log_2$` cru). "Recomeçar" do Treino
  por partes virou "Começar do zero", o nome que já valia no treino.
  **Treino é o lugar único de escolher como treinar (opção B, mesmo dia):**
  eram 6 portas para questões. O topo de `/provas` tem 3 cartões
  (`components/treino/caminhos-do-treino.tsx`): Nova prova (o principal),
  Prova rápida ou simulado (`/simulado`) e Refazer meus erros
  (`/caderno-erros`). Desde 09/11/2026 são 4: "Revisão do dia 2" abre a
  página pronta `public/revisao/dia-2.html` (cópia de `docs/revisao-final/`,
  conferida por `data/revisao-final/cartoes-dia-2.test.ts`). Motivo medido: em
  14 dias o site teve 14 questões respondidas, porque a revisão só existia por link. Simulado e Caderno de Erros saíram do "Mais" e acendem
  o item Treino. A faixa de números das provas saiu (os números ficam em
  Progresso). Ficam fora do Treino só o "Começar" e as Revisões do Início
  (o dia do cronograma) e o Banco de Questões no "Mais".
  2º passeio (conta nova simulada): nome da prova é opcional (vazio vira
  "Matemática e Física", `nomeAutomatico`); Simulado e Criar prova oferecem
  só matérias com questão (`MATERIAS_COM_QUESTOES`: saíram Literatura, Livros
  e Redação do Simulado); a tela do Simulado se chama "Prova rápida ou
  simulado", como o cartão; Simulado e Caderno têm "‹ Treino" no topo; Caderno
  vazio diz "Ainda não há erro para refazer", não "Continue assim".
- **Início = o cronograma de hoje e "Começar", no jeito Nubank (B, 21/10/2026):**
  bloco bg-primary de ponta a ponta com "N matérias hoje" (`--type-mega`) e o
  Começar em pílula; 4 atalhos redondos (mesmos ícones do menu); seções com
  linha fina, sem caixa: O que cai hoje (com tema), Leitura (o cartão
  flutuante não aparece no Início), Revisões, A semana (fechada).
  Enquanto carrega, esqueleto do cartão, nunca tela vazia.
- **Progresso = 2 números** (total respondidas e acertos), 06/10/2026.
- **Sem controle deslizante para número (Pablo, 21/10/2026: "muito feio"):**
  quantidade se escolhe com botões (`components/escolha-de-numero.tsx`); saiu
  de criar prova e de gerar flashcards. Skill global `sem-controle-deslizante`.
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
- **Explicação = o artefato dos peixes (Pablo, 22/10/2026: "perfeito, fala
  para a IA fazer exatamente assim"):** uma tela por passo, nada rola (o desenho
  encolhe em `CaberNaCaixa`), pontinhos, Voltar/Próximo. Nome do passo pequeno
  em teal, o texto em destaque, desenho à direita só quando o CARTÃO tem
  700 px ou mais; mais estreito, embaixo (celular e treino em tela grande, onde o
  cartão divide a tela com a questão: lado a lado ali cortava o desenho, 23/10). Ordem:
  A pergunta (visual `legenda`: a fórmula com o que cada pedaço é) → O que
  acontece → Jeito rápido (quadro) → Por que funciona (vértice SEMPRE pelo
  espelho; derivada derruba o passo) → A resposta → Sua vez (opções de tocar).
  Perguntar à IA: ícone discreto no meio, embaixo, abre por cima do passo.
  Artefato de referência: claude.ai/artifact/BkAg7rxYtof11vRoPMmvWu.

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
  **Espaço do prompt (21/10/2026):** a explicação reserva `maxTokens: 4000` e
  a Groq gratuita aceita 8.000 tokens/min, então prompt + questão cabem em
  ~4.000. Regra nova sem corte deu 413 em 4 de 9 questões (modelo reserva, 20
  a 35 s). Saída: o prompt da explicação usa `formatoVisualSem(['cena',
  'fatias'])` (-1.350 caracteres) e o validador barra os dois. Com a fila de
  regras dentro (termo sem parêntese, palavra técnica explicada, só fórmula
  do médio, "você" no seuErro, passo-pergunta responde) ficou 14.110 contra
  14.765 de antes: 0 x 413 em 9 questões, 2 a 8 s. Regra nova: corte antes.
  Medir: o tamanho sai de `promptExplicacao(...).length`.
- **"Não pode falhar" (Pablo, 21/10/2026): o CÓDIGO garante, não o prompt.**
  Primeiro passo sem desenho recebe tabela de reserva (peças termo × o que é,
  ou os passos) em `comAlgumDesenho`; chulo vira palavra limpa ("caga" →
  "solta") e frase com palavrão sai (`semPalavraChula`, também em conceito do
  dia, flashcard gerado e lição; questão gerada com palavrão é descartada;
  "Cu" é o cobre e fica); inglês que escapa vira português (endosperm,
  genotype); 429 espera uma 3ª vez (20 s) dentro do prazo de 50 s. Não dá para
  garantir por código: erro de conteúdo ("núcleo poligênico" no lugar de
  núcleos polares, "espermatozoide" em planta). Esses vão para a fila do prompt.
- **Segunda IA confere antes de guardar (21/10/2026, `lib/tutor/conferir.ts`):**
  gera → o verificador (qwen, outro modelo) lista só erro de CONTEÚDO → se
  achou, gera de novo com os erros no prompt. Falhou ou sem tempo: fica a
  primeira (nunca tela de erro). Prazo único de 55 s. Dentro do cache, chave
  `explicacao-conferida`: cada questão é conferida uma vez. Medir com
  `scripts/medir-conferencia.ts` (o verificador é o juiz: ler os marcados).
  Medido em 50 questões (21/10/2026): 43 geradas, 7 caíram no limite da Groq
  (teste em rajada). Erros reais lidos à mão: 5 de 43 (~12%: "benzina",
  "Conselho de Geografia" sem Nacional, dengue por "tosse", "trocado de
  planta", ciganos "nômades"); 1 alarme falso. A geração nova corrigiu 3 e
  falhou em 2 por cota; por isso o erro agora é TROCADO direto no texto
  (`aplicarCorrecoes`) e só gera de novo o que não achou. "Correta: X" no
  trecho é sobre o gabarito: achou ENEM 2021 Q113 (id cmoudnnu2002auoz9dskgmqnx)
  com C no banco e conta dando D (31,25 L). **Resolvido em 02/11/2026 (Pablo
  autorizou):** o gabarito C estava certo (gabarito oficial `2021_GB_impresso_D2_CD5`);
  o TEXTO no banco é que tinha perdido "80% de conversão" e trazia D = 32 no
  lugar de 64. Lição: conta que não fecha com o gabarito, olhar primeiro a
  página escaneada (`public/questoes-imagens/<id>.webp`), não o gabarito.
  Varredura das 88 questões de resposta numérica (explicação que termina em
  outra alternativa): mais 3 com a EXPLICAÇÃO errada e o gabarito certo
  (2021 Q99, 2022 Q99, 2022 Q153), corrigidas; versão antiga guardada fora do
  git. As 679 de resposta em texto não entram nessa varredura.
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
  tela nova. 3-2-1 → 10 questões médias, sem cronômetro: Português 3,
  Matemática 3, Biologia 3, Química 1 (`MISTURA_PROVA_RAPIDA`; o generate
  aceita `mistura`). As questões são montadas durante a contagem.
- **Flashcards antes moram em Provas (Pablo, 22/10/2026):** saíram da prova
  rápida. Em Criar prova, "Flashcards antes: Sem · 5 · 10 · 15" (os do dia);
  vão por `?cartoes=N` e aparecem só antes da 1ª questão.
- **Aquecimento antes da prova (Pablo, 04/11/2026: "como na piscina, primeiro
  aquecer o corpo"):** toda prova Médio, Difícil ou ENEM de Nova prova começa
  com mais fáceis das mesmas matérias, A MAIS (1 a cada 4, mínimo 3; fácil
  antes de médio; nunca real), `lib/aquecimento.ts`. Prova pronta feita à mão
  ganha o aquecimento dela, do conteúdo de cada questão (modelo: 31 fáceis com
  explicação pronta em `data/revisao-final/aquecimento.json`; a prova que as
  usava foi apagada a pedido dele em 10/11/2026, as questões ficam no banco).
- **Provas do dia 2 (Pablo, 10/11/2026):** "Dia 2 · 1 Fácil", "2 Médio",
  "3 Difícil" (escritas à mão) e "4 ENEM real", 40 cada, só os 22 conteúdos que
  mais caem, explicação pronta. A Fácil é o aquecimento das outras. Molde, cotas
  e os tropeços do aluno-do-zero em `data/revisao-final/dia-2/LEIA-ME.md`;
  conferência em `provas-dia-2.test.ts` (inclui texto que o validador cortaria
  calado); gravar com `scripts/criar-provas-dia-2.ts`.
  **Estudar pela questão (Pablo, 11/11/2026):** em toda questão dos 22 conteúdos,
  "Não sei isso: ver a aula" abre a aula de 5 frases e depois o mesmo conteúdo
  no Médio, Difícil e ENEM (`components/simulado/aula-do-tema.tsx`, dados de
  `scripts/gerar-aulas-dia-2.cjs`). Zero IA; exemplo que já está numa prova fica fora.
  **Aula começa pelo desenho (Pablo, 11/11/2026: "preciso de uma imagem"; aprovou a
  mangueira):** 3 telas antes das frases: Em desenho (analogia + o que é o quê), Por que
  faz sentido (+ conta com números que não estão nas provas) e Direta ou inversa
  ("fica mais fácil de entender a lógica"; ex.: mais aperto, menos água). Fonte única
  `lib/aulas-desenho-dados.js`; prévia gerada por `scripts/gerar-aulas-em-desenho.mjs`.
  O movimento do desenho continua com "reduzir movimento", só mais lento (explica, como o flip).
  **Aula de CADA questão (Pablo, mesmo dia: "cada exercício tem uma aula diferente"):**
  conceito em desenho (do tema) → a explicação pronta DESTA questão, passo a passo, sem
  "A resposta" → "Tentar responder"; o resto do conteúdo fica atrás de "Mais do
  conteúdo". Só explicação pronta (`soPronta`, a rota nunca chama a IA); 160 de 160 têm.
  As 40 reais estão no banco com `tema` vazio: `temaDaQuestao` acha pelo id nos JSON.
- **Provas do dia 2 por conteúdo (Pablo, 12/11/2026: "começa com uma fácil de
  velocidade média, depois média, difícil, ENEM; aí vai para o próximo
  conteúdo"):** 5 provas "Dia 2 por conteúdo · Física/Química/Biologia/
  Matemática 1/Matemática 2" (24, 28, 28, 44, 36), nível `escada` ("Do fácil ao
  ENEM" na lista). As MESMAS 160 questões das 4 por nível, que continuam lá; em
  cada conteúdo, Fácil → Médio → Difícil → ENEM e repete
  (`scripts/criar-provas-dia-2-por-conteudo.ts`). Cada aula abre com uma
  "Palavra-chave" de memória (QUE MACETE, FAMA, VÊ LÁ FORA...), como o
  coringa da redação, nos `docs/revisao-final/dia-2/*.js`.
  Em 14/11 ele entrou na "Dia 2 · 1 Fácil" achando que era a escada: as
  `escada` agora vêm num grupo próprio no topo de Estudar (`lib/provas-grupos.ts`).
  **Aula em desenho em pixel (14/11/2026: "nem todos os desenhos estão em arte de pixel"):**
  o SVG é desenhado pequeno num canvas e ampliado com pixel quadrado; rótulos nítidos por
  cima (`components/visual/desenho-pixel.tsx`). Filtro SVG (feTile) apagava tudo no Chrome
  sem placa de vídeo. Ainda vetor: `molecula`, `processo` e `grafico` da explicação.
- **Fórmula nunca cai do céu (Pablo, 12/11/2026, questão da mangueira: "não sei
  de onde saiu esse t ao quadrado"):** explicação escrita à mão não usa fórmula que
  a aula não ensinou sem mostrar de onde ela vem em conta de 4 operações (queda:
  velocidade média 5 × t vezes o tempo = 5 × t × t; subida: (v ÷ 2) × (v ÷ 10)).
  Potência ("t²") se escreve também como "t × t, o tempo vezes ele mesmo". Varridas
  as provas do dia 2 em 12/11: 2 casos (mangueira e balanço), corrigidos no banco.
- **Número antes de letra (Pablo, 12/11/2026, mangueira: "por que colocou o 10
  ali?"):** conta com letra (10 × t) ou regra ("a média é a metade", "distância =
  velocidade × tempo") só DEPOIS da mesma conta com números (1 s, 2 s) e um caso
  do dia a dia (carro a 60 km/h por 2 h). Tabela "segundo a segundo" cuja última
  linha é a letra. O `aluno-do-zero` procura isso (tropeço 7).
- **Antes da questão (Pablo, 12/11/2026: "ela ensinava usando velocidade média, que
  eu não tinha estudado; coloca os exercícios antes"):** conteúdo que a questão cobra
  e a aula do TEMA não ensina vira aula curta + 2 exercícios ANTES da explicação, na
  aula "Não sei isso" (`data/revisao-final/antes-da-questao.json`, `lib/antes-da-questao.ts`).
  Varridas as 240 questões em 13/11 (`scripts/jornada-aula-questoes.py` + `aluno-do-zero`;
  achados em `docs/revisao-final/varredura-conteudo-nao-estudado.md`): 11 aulas "Antes"
  em 30 questões; o resto consertado no texto (palavra explicada na hora, número antes
  da letra). Material novo: rodar a mesma varredura antes de entregar.
  **Sem exercício no meio (Pablo, 14/11/2026: "não precisa colocar questão no meio para ver
  se entendeu, só coloca a explicação"):** a aula "Antes" mostra só a explicação; os 2
  exercícios ficam no JSON, fora da tela. Isômeros (F-P-C) entrou como aula "Antes".
  **Curta e sem rolar (Pablo, 14/11/2026: "não gosto de rolar telas, lembra disso"; "não
  quero explicações muito grandes"):** o jeito que funcionou é uma conta por linha (passo dos
  isômeros). Sem analogia de LEGO ("pode tirar o negócio de lego"). Tabela que repete o
  texto sai. **"Os dados" primeiro (mesmo dia: "gostei desse negócio de coletar dados"):**
  na aula da questão, o passo A pergunta (tabela dos dados) vem logo depois dos desenhos.
  Sem brilhinhos no desenho da aula ("tira esse brilhinho"); a água ferve e o termômetro
  sobe e desce no desenho de Termodinâmica. O boneco de cima do cartão é um mini astronauta.
  **Jeito rápido = o macete (Pablo, 14/11/2026: "vê se essas soluções são o jeito mais
  rápido... isso é muito, muito importante"):** o passo Jeito rápido é o caminho mais curto
  de prova; toda divisão diz o que conta ("quantos 60 cabem em 120? 1 litro dá 60, 2 dão
  120"). Achado na mistura de águas: o atalho estava escondido no Por que funciona. Varredura
  por regex: 25 nas provas do dia 2 e 76 no banco ENEM com divisão sem sentido dito.
  **Macete curinga por conteúdo (mesmo dia: "um jeito curinga que serve para a maioria
  das ocasiões... até o nível ENEM"):** campo `macete` em `aulas.json` (nome, regra, até 4
  passos, exemplo), tela própria na aula da questão logo depois de "Os dados", e no lugar da
  Palavra-chave em "Aula do conteúdo". Todo Jeito rápido começa por "Macete de <conteúdo>:"
  e aplica o mesmo macete (teste `data/revisao-final/macetes.test.ts`). Feito: Química (5
  macetes, 28 questões), Física (5, 24), Biologia (6, 28) e Matemática 1 (3, 44). Faltam Matemática 2 e o banco ENEM.
- **Passo em linhas (Pablo, 12/11/2026, foto do "Jeito rápido" da mangueira: "deixa
  o texto mais organizado e entendível"):** texto de passo acima de 200 letras vai
  em linhas separadas por `\n` (uma ideia por linha, até 170 letras cada); "A
  resposta" = "Letra X" + uma linha por alternativa errada. Cada figura mostra a
  conta DO SEU passo (a mangueira virou 3 telas: tempo, velocidade, altura). A tela
  (`TelaPasso`) desenha cada linha separada e o validador guarda o `\n`.
  Conferidor: `python3 scripts/conferir-passos-em-linhas.py` (números iguais ao commit).
- **Questão de reforço (Pablo, 12/11/2026: "se eu errar, a próxima é para ver se
  entendi o erro"):** errou na prova, o botão vira "Tentar uma parecida" e vem uma
  questão guardada do MESMO conteúdo (`app/api/provas/reforco`, origem "Reforço do
  dia 2", ids `d2-reforco-*`), com a figura em pixel do caso na tela da questão (sem
  a conta). Não conta na nota nem grava resposta; as já vistas ficam no navegador
  para a próxima vez trazer outra. Rótulo "Reforço · estilo ENEM", nunca "ENEM real".
  Errou o reforço também: segue a prova. Conteúdo em
  `data/revisao-final/dia-2/reforco-*.json` (mesma conferência das provas), gravado
  por `scripts/criar-reforco-dia-2.ts`. Feito (12/11/2026): 80 questões, 20 por
  área (Física, Química, Biologia, Matemática), 3 ou 4 por conteúdo, cada uma com
  figura em pixel própria do tema (`components/visual/figuras-areas.tsx`).
- **Prova responde na hora (22/10/2026):** o acerto é conferido no navegador
  (a letra certa já vem com a questão) e a resposta é gravada por trás, com
  3 tentativas; "Próxima" avança sem recarregar a prova. Antes: 1,5 s para ver
  certo/errado e a questão anterior voltava sem resposta enquanto carregava.
  O lembrete de leitura não aparece em Provas, Simulado e Treino (cobria o
  Confirmar).

- **Treino do dia (Pablo, 06/10/2026):** 10 questões de cada matéria do dia:
  as do cronograma, depois Português e Matemática (`cotasDoDia`; era 20 e ele
  baixou para 10 no mesmo dia);
  uma matéria por vez, cada uma na escada com cota proporcional (em 10: 2
  fáceis, 3 médias, 2 difíceis, 3 ENEM; desde 03/11/2026). Retoma só treino aberto HOJE, e nunca a sessão do
  simulado (as duas ficam em `TrainingSession`; filtrar `mode`).
- **Conceitos antes do treino, um por vez (Pablo, 07/10/2026):** abrem sozinhos,
  em ordem, com Continuar (`components/treino/conceitos-do-dia.tsx`). Por
  assunto: o que precisa saber ANTES (pré-requisito, `antes`) → o que o assunto
  É, sigla por extenso (`oQueE`: "não me falou o que é MRU") → passos → regra e
  ENEM. Química de átomo e massa usa o desenho `molecula`.
- **Início (06/10/2026, forma nova em 21/10/2026):** sem saudação e sem
  banner; o bloco de cor É o cronograma de hoje (ver "Telas enxutas").
- **Conteúdo atrasado vira o de hoje (Pablo, 15/10/2026):** o dia do
  cronograma só avança com o treino TERMINADO (`concluido`) ou o simulado
  enviado. "Pular este dia" saiu e o `pulado` antigo conta como pendente. O
  rótulo diz o dia de verdade: "Quinta-feira · conteúdo de segunda".
- **Treino é escada, decidida pelo Pablo em 05/10/2026:** resumo do conteúdo
  do dia → questões fáceis → médias → ENEM real por último. Só matérias
  do cronograma do dia. A etapa sai da ORIGEM (`lib/treino-etapas.ts`), não de
  `dificuldade`: as reais do ENEM estão cadastradas como fácil/médio e são as
  mais difíceis da sessão.
- **4 níveis (Pablo, 03/11/2026):** Fácil (pergunta curta "O que é X?"),
  Médio (texto um pouco maior), Difícil (texto longo no jeito do ENEM, NÃO
  real), ENEM (só real: `anoProva` ou origem "ENEM 2022 ..."). Real nunca
  aparece como Fácil, Médio ou Difícil; `modelo_enem` e "ENEM adaptado" não
  são reais (viram Difícil e Médio). Vale no treino, no banco, no simulado e
  em Criar prova (`etapaDaQuestao`).
- **Degraus:** para até 2 questões do ENEM do assunto do dia (assunto no
  subtema/tema, não no enunciado), a IA gera 2 fáceis + 2 médias + 1 difícil (desde 03/11/2026) que
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

As decisões de Redação (correção, trios, treino por partes, coringas, Me ajuda) estão em
`redacao.md`, nesta pasta. **Leia esse arquivo antes de mexer em qualquer coisa de Redação.**
Em uma linha: a IA levanta evidência e o código dá a nota; flashcards e redações-modelo
usam só o Trio 1 (Drummond + Pacto, Rui Barbosa, Dom Hélder).

## Trilha de Cálculo

As decisões da Trilha de Cálculo (lições escritas à mão, cena antes da fórmula, sem múltipla
escolha, nível acima) estão em `calculo.md`, nesta pasta. **Leia antes de mexer em Cálculo.**

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
- **Mundo pixel (Pablo, 12/11/2026, votos 1B 2A 3A 4A na prévia
  https://claude.ai/artifact/QVn75VnVMV9JmptgX1pJXG; gosto na skill global
  `design-do-pablo`):** Início com anéis e luz atrás do bloco (`AnelInicio`);
  prova com a serra em pixel no fundo e o dia e a noite passando (`MundoPixel`,
  ciclo de 6 min), questão num `.px-cartao`, botões "Mundo animado" e "Tela
  cheia" (esconde o menu, `html[data-imersivo]`); alternativa afunda 4 px com
  borda de pixel e faíscas (`.px-alt`); acerto/erro abre anéis (`.px-anel`);
  fim da prova é a casinha acesa (`CenaFim`). Desenho em canvas UMA vez
  (`lib/pixel/desenho.ts`), movimento só CSS. **Exceção ao "respeitam sempre":**
  ele pediu "bastante animação" e, no mesmo dia, "deixa como padrão do site; quem
  quiser muda nas configurações". O mundo nasce ANIMADO mesmo com reduzir
  movimento no sistema; desliga em Perfil > "Mundo pixel animado"
  (`useMundoAnimado`, guardado no navegador). Não há botão disso na prova. A seleção da alternativa anima sempre (0,25 s),
  como o flip. As regras animadas levam `!important` porque a regra geral do
  reduced-motion também leva; o mesmo faltava na aula em desenho (água parada no
  PC dele) e foi corrigido no mesmo dia. Letra da alternativa em sans: sozinho,
  o "A" da Jersey 10 parece "Â".
  **Site inteiro (mesmo dia, "literalmente tudo"):** o `AppLayout` põe o
  `MundoPixel` no fundo de toda tela, com um véu `.mundo-veu` da cor da página a
  84% por cima (texto cinza segue AA mesmo sobre o pinheiro mais escuro; a 78%
  dava 4,1:1). Substituiu as partículas. A prova aberta tem o mundo dela, forte,
  sem véu. **Cartão da questão translúcido (13/11/2026, "transparente para ver o
  fundo, mas que dê para ler"):** `.px-cartao` a 75% e `.px-alt` a 70%, SEM
  backdrop-filter (desfoque sobre fundo animado repinta todo quadro); o cinza dentro
  do cartão fica mais forte para manter AA sobre o pior pixel do fundo
  (`scripts/contraste-cartao.py`). Medido no build: prova parada 99 ms de composição
  em 3 s, marcar alternativa 35 a 47 ms com CPU 4× mais lenta.
  **Letras em pixel (mesmo dia, "até as letras e as palavras"):** com
  `html[data-letra-pixel]` (padrão; desliga em Perfil > "Letras em pixel",
  `useLetraPixel`) só palavra curta vira pixel: títulos (h1-h3) em Jersey 10,
  botões, menu e rótulos em Jersey 15 (size-adjust 125%), sem negrito inventado
  (`font-synthesis: none`). Frase, enunciado, alternativa e cartão ficam na letra
  normal: com pixel em tudo ele "não estava conseguindo ler" (print de /provas,
  mesmo dia). Pixelify Sans foi testada e caiu: "C" vira "O" e "5" vira "8" em
  negrito ("15%" lia "18%"). **Flip em CSS** (`.cartao-flip`, 0,45 s nos dois
  modos), não em framer: roda no compositor e não trava ao virar.
  **Mais vivo (Pablo, 14/11/2026: "deixa mais animado tudo, as árvores, coloca até
  personagens dependendo da questão"):** pinheiros com vento em rajadas (camadas
  `mp-vento` só com as árvores entortadas, `arvoresAoVento`); personagem da matéria em pé
  EM CIMA do cartão da prova (do lado não cabe: ~45 px na tela dele), anda, pisca, pula no
  acerto e coça a cabeça no erro (`components/pixel/personagem.tsx`, folha de 4 quadros em
  `lib/pixel/personagem.ts`). Desenho da aula: brilhos piscando. **Sem interação de
  mouse** (luz no cursor, faíscas, onda de luz): ele testou e disse "não gostei" (14/11).
  Vento: ele pediu as árvores "sempre se movimentando" (14/11), então é contínuo, mesmo
  custando mais (medido: rajada +31%, contínuo +85% de composição parada, sem tarefa longa).
  Jaleco branco sumia no fundo claro: roupa de cena nunca da cor da lousa; braço com contorno.
  **Cena da situação da questão (Pablo, 14/11/2026: "personagem no sentido de: se a
  questão fala de um menino puxando uma corda, desenha o menino, pixelado, se mexendo,
  bem fluido"):** desenho em pixel da HISTÓRIA do enunciado, embaixo dele, na tela da
  questão. Kit em `components/visual/cenas-questoes.tsx` (pessoa que respira e pisca,
  chama de 3 quadros, bolhas e gotas andando 1 pixel por passo); mapa questão → cena em
  `data/revisao-final/cenas-das-questoes.json`. Feito: as 8 de Química Orgânica da prova
  por conteúdo; as outras esperam ele aprovar o jeito.
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
