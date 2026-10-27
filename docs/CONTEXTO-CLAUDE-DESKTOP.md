# PrepEnem — contexto para o Claude (aba Projetos)

Atualizado em 27/10/2026, lendo o repositório `~/prepenem-app` (commit `5bde373`).
Código: https://github.com/pablorodriguespatinho12-lab/PrepEnem (privado). Hospedagem: Vercel, projeto `prepenem.app`.

## Como falar com o Pablo (ler primeiro)

- **O Pablo tem TDAH.** Tudo curto, rápido e prático: "A e B, pronto".
  Mostrar o código vence explicar o código. Número concreto vence abstração.
- Pergunta boa = opção concreta com referência. Pergunta abstrata de gosto ele não responde.
- **Zero emoji**, zero confete, zero tom motivacional (UI, conteúdo e commit).
- Ele fala por voz: as mensagens dele chegam sem pontuação, com palavras trocadas. Interprete pela intenção.

## O que é

Plataforma pessoal de estudo para o ENEM, **um usuário só** (acesso trancado).
Treino de questões, simulado, provas, flashcards, caderno de erros, redação, Cálculo, progresso.

**Stack:** Next.js 14.2.35 (App Router) + React 18 + TypeScript + Tailwind 3 + shadcn/ui +
Framer Motion 11 + Prisma 5 + NextAuth 4 + Neon (Postgres) + Vercel. Ambiente: WSL Ubuntu.
Testes: vitest (`npm test`, 349 passando em 23/10). Não há lint.

**Rotas:** `/dashboard`, `/treino`, `/simulado`, `/provas`, `/banco-questoes`, `/caderno-erros`,
`/flashcards`, `/redacao`, `/calculo`, `/progresso`, `/perfil`, `/vestibular`, `/upload`, `/admin`,
`/design-system`.

**Dados:** 772 questões no banco, 530 imagens pré-renderizadas em `public/questoes-imagens/`,
93 decks de flashcards. Models Prisma em português de domínio (`enunciado`, `materia`, `dificuldade`).

## Decisões fechadas (não reabrir sem falar com ele)

- **Teal "Clareza"** é a cor base. `--primary` = preenchimento; `--primary-text` = texto (contraste AA).
- **Direção editorial:** Fraunces (título), Source Serif 4 (leitura), DM Sans (interface), JetBrains Mono.
- **Explicação da IA = "artefato dos peixes" (22/10):** uma tela por passo, nada rola, Voltar/Próximo.
  Ordem: A pergunta → O que acontece → Jeito rápido (quadro) → Por que funciona → A resposta → Sua vez.
  Desenho ao lado só quando o cartão tem 700 px ou mais; senão, embaixo.
  Explicações prontas ficam no banco (`ExplicacaoPronta`), geradas e revisadas antes.
- **Gerador de explicações prontas:** Groq primeiro; se falhar, Mistral (se tiver chave), depois os modelos menores da Groq. O Gemini não é reserva de nada: o gratuito dá 20 pedidos por dia e fica só para a correção de redação (27/10/2026).
- **Flashcard:** um fato por card, resposta mínima. Deck de livro: por capítulo, resumo + frase para pregar.
- **Número se escolhe com botões**, nunca com controle deslizante.
- **Dado esparso:** `<5` questões não mostra %; `5–15` mostra com alerta; `15+` limpo. O *n* sempre visível.
- **Sem treemap.** Reduced-motion respeitado, **exceto o flip do flashcard** (fica curto, mas fica).
- **Temas com nome de conteúdo** ("Estequiometria"), não categoria do INEP. Taxonomia em `lib/tema-taxonomy.ts`.
- **Neon é o mesmo banco de dev e produção.** Script que escreve, escreve em produção.
- **AWS não será configurada.** Upload de PDF degrada com 503 e mensagem clara.
- Movimento só em `transform`/`opacity`; nada de `transition-all`.

## Onde paramos (27/10/2026)

- 22/10: tutor com explicação em passos, explicações prontas no banco (26 geradas, 9 limpas
  na revisão automática), Gemini e Mistral como reserva do gerador.
- 23/10: corrigido o desenho cortado no tutor em tela grande e o quadro de conta que vazava.
  Build limpo. Também: 11 arquivos sem uso apagados, guia e skills limpos do que estava velho,
  enunciado do "porquê" das questões reescrito e explicações sem emoji. Tudo já foi para o ar.
- **Em andamento (não commitado):** correção no fim do simulado (`components/simulado/correcao-dos-erros.tsx`):
  uma questão errada por vez, com a explicação em passos ao lado, logo que a prova termina.
  Antes o resultado só mandava para o Caderno de Erros.

## O que falta, por prioridade

1. **Gerar e revisar as explicações prontas que faltam:** 26 de 772 questões têm uma; só 9
   passaram limpas na revisão automática.
2. **Arquivos grandes demais** (teto 800 linhas): `app/treino/page.tsx` 1.158,
   `app/flashcards/[deckId]/page.tsx` 885, `app/simulado/page.tsx` 865, `app/design-system/page.tsx` 804.
3. **Sem lint.** O logica-app tem `npm run verificar` (contraste, CSS que anima layout): portar.

Resolvido em 23/10: o `.env` que vazou em `public/prepenem_codigo.tar.gz` não vale mais (senha do
banco, `NEXTAUTH_SECRET` e chave de IA foram trocadas, conferido; repositório privado).

## Jeito de trabalhar

O roteiro completo está no `CLAUDE.md` e na skill `combinar-skills` do repositório; aqui vai o resumo.

- **Antes de qualquer tarefa:** listar quais skills e agentes do projeto se aplicam, e usar.
  Dizer em voz alta se falta skill (quase sempre é uma LINHA numa existente).
- **Medir antes de decidir**, e reproduzir no navegador antes de acreditar no código.
- **Um commit por frente**, mensagem em português no formato `tipo(área): o quê`.
  `npm run build` antes de todo commit. **Sem push automático**: o Pablo faz na mão.
- **Validar em produção depois do push**, nunca só local.
- **Fechar a frente:** o que ficou falso no repertório (`auditar-o-repertorio`) e o que ficou
  verdadeiro (`inventar-daqui`), no mesmo commit.

### O que existe em `.claude/`
- **Skills (19):** `combinar-skills`, `token-economy`, `distribuir-trabalho`, `decisoes-prepenem`,
  `montar-referencia`, `animation-system`, `flashcard-pattern`, `medir-fluidez`, `prisma-neon-safety`,
  `vercel-deploy-checklist`, `verificacao-local`, `inventar-daqui`, `garimpar-da-web`, `briefing-longo`,
  `perguntar-ao-pablo`, `explicar-ao-pablo`, `chamar-revisor`, `desenhar-skill`, `auditar-o-repertorio`.
- **Agentes (8):** `build-guard`, `db-inspector`, `design-system-auditor`, `layout-organizer`,
  `ui-animations`, `aluno-do-zero`, `revisor-adversarial`, `inspetor-visual` (os dois últimos
  custam ~66 mil tokens cada).
- **Hooks:** commit-guard, push-guard, db-guard, typecheck depois de editar.
