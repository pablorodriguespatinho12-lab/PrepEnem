# Antes de começar qualquer tarefa

1. Liste as skills e agentes deste projeto que se aplicam, e use-os. Se nenhum,
   diga isso. A ordem de cada tipo de frente está em `combinar-skills`.
   **Carregue `token-economy` em TODA tarefa** (pedido do Pablo, 24/11/2026), com
   plano curto de quem faz cada parte.
2. Responda em voz alta, mesmo quando for não: **falta skill?** Skill nova só
   para tarefa recorrente com procedimento não óbvio (`desenhar-skill` →
   `write-a-skill` → `ln-162-skill-reviewer`). Quase sempre é uma LINHA numa existente.
3. Carregue cada skill no instante antes do trabalho que ela governa.
4. No fim da frente, no mesmo commit: o que ela tornou FALSO
   (`auditar-o-repertorio`) e o que tornou VERDADEIRO (`inventar-daqui`).
5. **Autoatualização obrigatória** (Pablo, 24/11/2026): depois de toda leva de agentes,
   achar onde o PLANO/prompt errou, corrigir o plano e o arquivo do agente, e dizer
   "aprendi: X, gravei em Y". Memória `autoatualizar-agentes-e-planos`.
6. **Bug ou melhoria visto no caminho é automático** (Pablo, 27/11/2026): pequeno (até 3 arquivos), consertar
   e dizer; maior, 1 linha em `docs/melhorias.md`. Regra vencida que eu encontrar sai no mesmo commit.
7. **Rapidez** (27/11/2026: "demorando muito pra fazer coisas mais ou menos simples"): tarefa pequena = sem agente,
   sem skill além da que governa o arquivo (e `token-economy`), foto só do que mudou, build em segundo plano.
8. **O Pablo tem TDAH**: toda mensagem final passa por `explicar-ao-pablo` —
   curta, pelo que aparece na tela, no máximo duas opções.

## Ferramentas em `.claude/`

- **Ordem e economia:** `combinar-skills`, `token-economy` (vale dentro de todas), `distribuir-trabalho`.
- **Produto:** `decisoes-prepenem` (fonte de verdade), `montar-referencia` (não há site de referência: monta uma por tela), `animation-system`, `flashcard-pattern`.
- **Desempenho:** `medir-fluidez` (fps, travadas; script `scripts/medir-fps.mts`).
- **Banco e deploy:** `prisma-neon-safety`, `vercel-deploy-checklist`, `verificacao-local`.
- **Ideia e pesquisa:** `inventar-daqui`, `garimpar-da-web`, `briefing-longo`,
  `transcrever-universo-narrado` (vídeo do canal → transcrição, jeito de ensinar, fotos do quadro).
- **Falar com o Pablo:** `perguntar-ao-pablo`, `explicar-ao-pablo`.
- **Manter as ferramentas:** `desenhar-skill`, `auditar-o-repertorio`.
- **Agentes automáticos** (Pablo, 26/11/2026: "quero tipo automático"): o Claude aciona sozinho, sem pedir
  que ele digite nada. `escritor`: material de estudo maior que um texto curto; `revisor-de-fatos`: antes de
  entregar material; `explorador`: busca em mais de 5 arquivos; `executor`: lote braçal já planejado;
  `build-guard`: antes do push. Tarefa pequena (até 3 arquivos): fazer direto. Tarefa média ou incerta:
  entrar no modo plano por conta própria (`EnterPlanMode`).
- **Agentes:** `escritor` (aula, questão, redação-modelo; tem memória), `build-guard`, `db-inspector`, `design-system-auditor`,
  `aluno-do-zero` (lê a jornada de `scripts/jornada-do-aluno.mts`, ou um texto de
  estudo, como quem só sabe as 4 operações; **toda vez que o Pablo disser "não
  entendi" de uma explicação, corrigir o caso E acrescentar esse tipo de tropeço
  ao agente**, com a frase dele e a data; teste: `docs/aluno-do-zero/`),
  `revisor-de-fatos` (conta, gabarito e
  fato de material de estudo, antes de entregar), `revisor-adversarial` e
  `inspetor-visual` (~66 mil tokens cada: decidir com `chamar-revisor`).

Skills globais de design ficam fora: o PrepEnem já tem direção fechada
(ver `combinar-skills`). Push é meu desde 12/11/2026 (o Pablo autorizou sempre), depois de build e testes.

# PrepEnem

Prisma sem migrations: o schema vai ao banco com `db push`.

## Convenções
- Nomes de campos/models de domínio em português (`enunciado`, `materia`,
  `dificuldade`, `precisaRevisar` etc.) — siga o padrão já existente.
- UI com Tailwind + componentes shadcn/ui; evite CSS solto quando já existe
  primitiva shadcn equivalente.
- Antes de qualquer commit, rode `npm run build` (roda `prisma generate` +
  `next build`) e resolva os erros antes de seguir.

## Decisões já tomadas
Antes de mexer em UI, conteúdo gerado por IA, visualização de dados ou
taxonomia de temas, carregue a skill `decisoes-prepenem` — ela é a fonte
de verdade dessas decisões (elas não sobrevivem ao /compact de outro jeito).

## Questão ou aula nova (nível acima, escada, lousa)
O Pablo não pode ter que lembrar regra que ele já deu (23/11/2026). ANTES de escrever: `ls ~/.claude/projects/-home-pablo-prepenem-app/memory`,
ler as descrições e abrir as que tocam a tarefa, e ler `docs/nivel-acima/regras-do-pablo.md` (14 regras, fonte e quem confere cada uma).
DEPOIS: `npx vitest run data/revisao-final/nivel-acima-regras.test.ts data/revisao-final/provas-dia-2.test.ts` e conferir as linhas de processo
(gabarito às cegas, `aluno-do-zero` em rodadas, prova aberta na tela, lista do que cada prova tem no banco).

## /compact
Ao resumir, preserve: decisões de schema do Prisma, erros de build já vistos
e a solução aplicada. Descarte: exploração de arquivos já concluída e
navegação que não gerou decisão.
