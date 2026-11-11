# Antes de começar qualquer tarefa

1. Liste as skills e agentes deste projeto que se aplicam, e use-os. Se nenhum,
   diga isso. A ordem de cada tipo de frente está em `combinar-skills`.
2. Responda em voz alta, mesmo quando for não: **falta skill?** Skill nova só
   para tarefa recorrente com procedimento não óbvio (`desenhar-skill` →
   `write-a-skill` → `ln-162-skill-reviewer`). Quase sempre é uma LINHA numa existente.
3. Carregue cada skill no instante antes do trabalho que ela governa.
4. No fim da frente, no mesmo commit: o que ela tornou FALSO
   (`auditar-o-repertorio`) e o que tornou VERDADEIRO (`inventar-daqui`).
5. **O Pablo tem TDAH**: toda mensagem final passa por `explicar-ao-pablo` —
   curta, pelo que aparece na tela, no máximo duas opções.

## Ferramentas em `.claude/`

- **Ordem e economia:** `combinar-skills`, `token-economy` (vale dentro de todas), `distribuir-trabalho`.
- **Produto:** `decisoes-prepenem` (fonte de verdade), `montar-referencia` (não há site de referência: monta uma por tela), `animation-system`, `flashcard-pattern`.
- **Desempenho:** `medir-fluidez` (fps, travadas; script `scripts/medir-fps.mts`).
- **Banco e deploy:** `prisma-neon-safety`, `vercel-deploy-checklist`, `verificacao-local`.
- **Ideia e pesquisa:** `inventar-daqui`, `garimpar-da-web`, `briefing-longo`.
- **Falar com o Pablo:** `perguntar-ao-pablo`, `explicar-ao-pablo`.
- **Manter as ferramentas:** `desenhar-skill`, `auditar-o-repertorio`.
- **Agentes:** `build-guard`, `db-inspector`, `design-system-auditor`,
  `aluno-do-zero` (lê a jornada de `scripts/jornada-do-aluno.mts`, ou um texto de
  estudo, como quem só sabe as 4 operações), `revisor-de-fatos` (conta, gabarito e
  fato de material de estudo, antes de entregar), `revisor-adversarial` e
  `inspetor-visual` (~66 mil tokens cada: decidir com `chamar-revisor`).

Skills globais de design ficam fora: o PrepEnem já tem direção fechada
(ver `combinar-skills`). Sem push automático — o Pablo faz na mão.

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

## /compact
Ao resumir, preserve: decisões de schema do Prisma, erros de build já vistos
e a solução aplicada. Descarte: exploração de arquivos já concluída e
navegação que não gerou decisão.
