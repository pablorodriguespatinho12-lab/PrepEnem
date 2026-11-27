# Inventário de funcionalidades (Etapa 2) · aprovado em 27/11/2026 · resultado em QA-REPORT.md

PrepEnem: site de estudo para o ENEM (questões, provas, flashcards, redação, cálculo).
Next.js 14.2 (App Router), React 18, NextAuth 4, Prisma 5 + Postgres (Neon), Vitest 2, Node 22.
Rodar: `npm run dev`. Build: `npm run build`. Testes: `npm test`.

Estado em 27/11/2026 (`npx vitest run`): 95 arquivos passaram, 1 pulado; 994 testes passaram, 9 pulados.
Os testes ficam em `lib/`, `data/` e `tests/`. Nenhum arquivo de teste em `app/` (53 rotas de API, 30 telas).
Cobertura em % ainda não medida (falta `@vitest/coverage-v8`).

Risco = impacto para quem estuda + complexidade. Leitura de estrutura, não revisão linha a linha.

| # | Funcionalidade | O que faz | Onde no código | Risco |
|---|---|---|---|---|
| 1 | Login e sessão | entrar, sair, sessão, lista de usuários permitidos, entrada pelo Início | `lib/auth.ts`, `app/login`, `components/session-guard.tsx`, `components/abrir-no-inicio.tsx` | Alto |
| 2 | Limite de tentativas de senha | bloqueia chute de senha | `lib/limite-login.ts` | Alto |
| 3 | Proteção das páginas | sem login não abre; política de scripts (CSP) | `middleware.ts` | Alto |
| 4 | Permissões das APIs | exige sessão; ações de administrador; dado de um usuário não vaza para outro | `app/api/**` | Alto |
| 5 | Cadastro fechado | sempre recusa (403) | `app/api/signup` | Médio |
| 6 | Provas prontas | listar, criar, abrir, responder, finalizar, apagar, prova de hoje | `app/api/provas/*`, `app/provas/*`, `lib/provas-*.ts` | Alto |
| 7 | Reforço e revisão de erros | questão parecida ao errar; refazer erros | `app/api/provas/reforco`, `revisar-erros`, `lib/prova-da-escada.ts` | Alto |
| 8 | Treino | gerar, filtrar, responder, retomar sessão, resumo | `app/api/treino/*`, `app/treino`, `lib/treino-*.ts` | Alto |
| 9 | Simulado | gerar, salvar sessão, entregar | `app/api/simulado/*`, `app/simulado` | Alto |
| 10 | Caderno de erros | lista o que foi errado | `app/api/caderno-erros`, `app/caderno-erros` | Médio |
| 11 | Revisão espaçada de questões | o que revisar e quando | `app/api/review`, `lib/revisao.ts` | Médio |
| 12 | Aula em lousa | conta desenhada passo a passo | `lib/aula-lousa/*`, `data/lousas` | Alto |
| 13 | Tutor | explicação, conversa, "seu erro", explicações prontas | `app/api/tutor/*`, `lib/tutor/*` | Médio |
| 14 | Flashcards: baralhos e cards | criar, editar, apagar, listar | `app/api/flashcards/decks*`, `cards` | Alto |
| 15 | Flashcards: estudo | progresso, revisão do dia, domínio, ordem | `app/api/flashcards/progresso`, `revisao`, `lib/flashcard*` | Alto |
| 16 | Flashcards por IA e do erro | gera card; card a partir de erro | `app/api/flashcards/gerar`, `do-erro` | Médio |
| 17 | Redação: correção | enviar, corrigir, histórico, temas, ajuda | `app/api/redacao/*`, `lib/redacao/correcao*` | Alto |
| 18 | Redação: treino por partes, plano e modelos | partes, trios, repertório, textos prontos | `app/redacao/*`, `lib/redacao/*` | Médio |
| 19 | Cálculo | trilha, lição, progresso, revisão, dúvida | `app/api/calculo/*`, `lib/calculo/*` | Médio |
| 20 | Caneta | converte conta em traço | `app/api/caneta`, `lib/caneta` | Baixo |
| 21 | Banco de questões | listar, subtemas, gerar por IA | `app/api/questions*`, `app/banco-questoes` | Médio |
| 22 | Administração de questões | editar, apagar, importar lote | `app/admin/questoes`, `app/api/questions/[id]`, `batch-import` | Alto |
| 23 | PDF de provas | enviar, processar, buscar PDF externo | `app/api/pdf-process`, `pdf-proxy`, `upload/presigned` | Alto |
| 24 | Progresso e estatísticas | acertos, dias, matérias, plano de estudo | `app/api/stats`, `study-progress`, `progress/feynman`, `app/progresso` | Médio |
| 25 | Início | matérias do dia, números, meta de leitura | `app/dashboard`, `lib/schedule-data.ts`, `meta-leitura.ts` | Médio |
| 26 | Perfil e preferências | nome, tema, modo escuro, som | `app/perfil`, `app/api/user/profile` | Baixo |
| 27 | Descobrir e macetes | aulas de onde vem a fórmula | `app/descobrir`, `app/provas/macetes`, `lib/descobrir` | Baixo |
| 28 | Visual e celular | animações, tema, telas em 390 px | `components/visual`, `lib/jardim`, `lib/pixel` | Baixo |
| 29 | Vestibular | tela "em construção" | `app/vestibular`, `lib/vestibular` | Baixo |

## Agentes e skills do agentic-qe (3.15.24) propostos

| Usar | Para quê |
|---|---|
| `qe-test-architect` + `qe-test-generation` | escrever os testes: partição, valor limite, casos negativos, tabela de decisão |
| `risk-based-testing` | ordenar pelo risco da tabela acima |
| `qe-coverage-specialist` + `qe-coverage-analysis` | achar o que ficou sem teste |
| `qe-security-scanner` | permissões das APIs e dependências, só no código e local |
| `qe-flaky-hunter` + `qe-test-execution` | rodar de novo e achar teste instável |

Fora: `qe-chaos-engineer` e `qe-performance-tester` (derrubar ou sobrecarregar o único banco, que é o de produção).

## Segurança da execução
- Um só banco (Neon, o do site no ar): testes de API com o banco simulado; nada de escrita real.
- IA (Groq/Gemini) simulada: a cota é a mesma do site. `test:redacao` não roda.
- Instalação: plugin oficial com `memory_backend=memory` (não grava no projeto) e `llm_provider=claude-code` (não usa outras chaves de IA).
- Dependência nova no projeto: só `@vitest/coverage-v8@2.1.9` (desenvolvimento), para medir cobertura.
- E2E: Playwright local, com toda gravação interceptada antes de chegar ao servidor.
