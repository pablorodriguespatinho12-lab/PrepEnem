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

## Telas enxutas (06/10/2026, pedido do Pablo: menos coisa num lugar só)

- **Menu: 6 itens à vista** (Início, Treino, Flashcards, Redação, Cálculo,
  Progresso) e o resto em "Mais", aberto sozinho quando a página atual é dele.
  Tela nova entra em "Mais", a não ser que seja estudo diário.
- **Início = só o estudo de hoje** + "Revisar o que você errou" (se houver).
  Números ficam em Progresso; a semana fica atrás de "Ver a semana".
- **Um número, um lugar.** Se a informação já aparece na tela, não repete em
  gráfico (Progresso perdeu a rosca e as barras; ficou a evolução por dia).

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
- **Flashcards seguem o princípio da informação mínima do SuperMemo**: um
  fato por card, resposta o mais curta possível, sem enumeração longa
  (quebre em cards separados ou use cloze). Ver [[flashcard-pattern]].

## Treino

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
- **A IA pede cena (06/10/2026):** questão sobre algo que muda no tempo abre
  com uma `cena`. Medido com 3 questões de Física: antes, só "transformação";
  depois, a queda dos corpos chega com duas bolas caindo. O validador conserta
  o que a IA erra sempre: nome de função vira letra, objeto inventado vira
  bola (nome no rótulo), relógio de queda é cortado no chão. A IA copia o
  EXEMPLO do formato mais do que a regra: para mudar o comportamento, mude o
  exemplo.
- **Exemplo resolvido e nível acima (05/10/2026, pedido do Pablo):** as 5
  primeiras questões de cada matéria no treino do dia chegam resolvidas
  (gabarito marcado, explicação e tutor abertos) — nunca a do ENEM nem a de
  nível acima (`ehExemploResolvido` em `lib/treino-etapas.ts`). Cada bloco de
  âncora fecha com 1 questão "Nível acima" gerada por IA no estilo
  Fuvest/Unicamp (+ ITA/IME nas exatas), original, autossuficiente, só
  programa do médio, conferida pelo verificador. Não há questão real dessas
  bancas no banco: não apresentar a gerada como real.
- **Simulado semanal (06/10/2026):** uma matéria, 10, 15 ou 20 questões,
  3 min por questão; sorteadas mas em ordem fácil → média → ENEM
  (`ordenarPorEtapa`). O de 45 a 180 questões saiu.
- "Recomeçar" no treino monta sessão nova; antes só restaurava a mesma.
- Sessão aberta só é retomada se tiver menos de 12 h — a de outro dia foi
  montada para outro dia do cronograma.

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
  em 41 degraus (`data/calculo/trilha.ts`). O degrau abre quando os
  pré-requisitos estão concluídos. Conclui com 70% nos exercícios e volta em
  revisão espaçada com 2, 7, 21 e 60 dias; se errar, volta no dia seguinte.
- Toda lição na mesma ordem: tentativa curta → construção do raciocínio →
  fórmula como resumo → 3 exemplos (completo, 1 lacuna, 2 lacunas) →
  exercícios com resolução comentada → pergunta de recuperação.
- **Lições escritas à mão** (`data/calculo/licoes`): p1 a p12 (todo o pré-cálculo) e c1 a c4 em 06/10/2026.
  A geração por IA está desligada (`CALCULO_LICAO_IA`, teste de 05/10: contas
  certas, explicação sem sentido); lição sem versão escrita aparece "em
  preparação". Escrever a próxima é o caminho, não religar a IA.
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
  definição (derivada, c4). Lição nova
  nasce com cena. O x é o relógio, nunca "o carro".
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
- **`AUTH_TRUST_HOST` não é necessário.** É conceito do Auth.js v5; este
  projeto usa NextAuth v4, onde a variável não tem efeito.
- **Validar em produção depois do push, nunca só local.** Já houve caso de
  bug reportado em produção que não reproduzia local — porque produção
  rodava código de antes do push. Ver [[vercel-deploy-checklist]].
