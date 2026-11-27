# Relatório de QA do PrepEnem · 27/11/2026

## Resumo

| | Antes | Depois |
|---|---|---|
| Testes | 1.003 (994 passam, 9 pulados) | 1.818 (1.690 passam, 119 falham, 9 pulados) |
| Testes novos | | 815: 765 de unidade e API, 50 no navegador |
| Cobertura de linhas | 20,05% | 31,72% |
| Cobertura de ramos | 80,51% | 84,09% |
| Cobertura de funções | 62,16% | 73,86% |
| Bugs documentados | | **44: 7 altos, 13 médios, 24 baixos** |

As **119 falhas são os bugs**: cada uma tem `BUG-` no nome do teste e fica vermelha até o conserto. Nenhum código de produção foi alterado.

Cobertura por pasta (só unidade e API; o navegador não entra na conta): `app/api` 91,3% · `lib` 87,3% · `middleware.ts` 100% · telas (`app`) 0% · `components` 0,3%.

## Como rodar

```bash
npm ci
npx playwright install chromium   # só na primeira vez
npm run test:qa                   # unidade e API com cobertura, build, navegador (uns 5 min)
```

- Sai com erro enquanto houver bug aberto.
- Usa a porta 3123. Não rodar com o servidor de desenvolvimento ligado (o build reescreve `.next`).
- `npm test` continua igual: os testes novos de QA usam outra extensão (`.qa.ts`, `.e2e.ts`).

## Isolamento

- Banco **falso** nos testes de API; build e navegador apontam para um endereço de banco que **não existe**.
- Chaves de IA e de arquivos vazias; IA simulada. `test:redacao` não rodou.
- Nada rodou contra o site no ar.

## Estabilidade

- Unidade e API: 3 rodadas, mesma lista de falhas.
- Navegador: a 1ª rodada completa achou 2 testes instáveis, **erro do teste** (`/treino` sem parâmetro redireciona para `/provas` de propósito). Corrigidos; as 2 rodadas seguintes deram resultado igual (49 passam, 1 falha: BUG-S2).

## Ferramentas

- **agentic-qe 3.15.24** (plugin `agentic-qe-fleet`) instalado conforme a documentação, com memória só em RAM.
- **Limite honesto:** o plugin foi instalado no meio da sessão, então os agentes e o servidor MCP dele **não ficaram disponíveis**. Os testes de API foram escritos por 2 agentes genéricos, com a orientação do `qe-test-architect`; segurança, cobertura e instabilidade foram feitas com Vitest, Playwright e `npm audit`, não pelos agentes `qe-*`.
- Usados: Vitest 2 e Playwright (já no projeto). Única dependência nova: `@vitest/coverage-v8` (desenvolvimento).

## Funcionalidades (inventário em `docs/qa/inventario.md`)

| # | Funcionalidade | Risco | Resultado |
|---|---|---|---|
| 1 | Login e sessão | Alto | passa |
| 2 | Limite de tentativas de senha | Alto | **S1** |
| 3 | Proteção das páginas | Alto | **S2** |
| 4 | Permissões das APIs | Alto | sem sessão e sem ser admin: passa. Entre usuários: **E1, E10** |
| 5 | Cadastro fechado | Médio | passa |
| 6 | Provas prontas | Alto | **E1 a E6** |
| 7 | Reforço e revisão de erros | Alto | **E7** |
| 8 | Treino | Alto | **E8 a E14** |
| 9 | Simulado | Alto | **E10, E11, E13, E15 a E17** |
| 10 | Caderno de erros | Médio | passa |
| 11 | Revisão espaçada | Médio | **E18, E19** |
| 12 | Aula em lousa | Alto | passa (testes que já existiam) |
| 13 | Tutor | Médio | passa |
| 14 | Flashcards: baralhos e cartões | Alto | **C1, C5, C19, C20** |
| 15 | Flashcards: estudo | Alto | **C3, C4** |
| 16 | Flashcards por IA | Médio | **C1** |
| 17 | Redação: correção | Alto | **C6 a C9** |
| 18 | Redação: partes e modelos | Médio | passa (testes que já existiam) |
| 19 | Cálculo | Médio | passa |
| 20 | Caneta | Baixo | passa |
| 21 | Banco de questões e conferência | Médio | **C12, E21, E22** |
| 22 | Administração de questões | Alto | **C11, C13 a C16** |
| 23 | PDF de provas | Alto | **C17, C18** |
| 24 | Progresso e estatísticas | Médio | **C2, E6** |
| 25 | Início | Médio | **E20** |
| 26 | Perfil | Baixo | **C10** |
| 27 a 29 | Descobrir, visual e celular, vestibular | Baixo | só fumaça: abrem, sem erro de script e sem rolar de lado em 390 px |

## Bugs

Como reproduzir qualquer um: `npx vitest run -c vitest.qa.config.ts -t "BUG-E10"` (S2: `npx vitest run -c vitest.e2e.config.ts -t "BUG-S2"`, depois do build). Caminhos relativos a `app/api/` quando não indicado.

**Conferidos também lendo o código:** E1, E10, C1, C2, C14, C16, C17. Os demais estão confirmados pelo teste, com banco falso.

### Altos

Causa comum de E1, E10, C1 e C2: o servidor **não confere se o identificador recebido é um texto**. Um objeto como `{"not":""}`, ou um campo ausente, muda o filtro do banco.

| Id | Onde | Passos | Esperado | Obtido |
|---|---|---|---|---|
| E10 | `treino/session`, `simulado/session` | PUT com `sessionId: {"not":""}`, `questionId` e `respostaDada` | 400, nada gravado | grava a resposta nas sessões de **todos os alunos** que têm a questão |
| E1 | `provas/responder` | POST sem `examId`, com a questão de uma prova de outro aluno | 400, nada gravado | a linha de **outro aluno** fica respondida |
| C17 | `pdf-process` | admin importa; gabarito lido como "X" ou "-" para questão já salva com D | não tocar | troca o gabarito certo por **A** |
| C1 | `flashcards/cards`, `flashcards/gerar` | POST sem `deckId` | 400 | usa um baralho qualquer do aluno; gerar ainda gasta IA |
| C2 | `progress/feynman` | `progressId: {"not":""}` | 400 | sobrescreve a explicação em todas as respostas do próprio aluno |
| C14 | `batch-import` | gabarito volta vazio | erro, nada gravado | grava com palpite ou "A" |
| C16 | `batch-import`, `pdf-process` | questão sem gabarito e sem palpite | não gravar | grava "A" |

E1 e E10 exigem login, e o cadastro é fechado.

### Médios

| Id | Onde | Passos | Esperado | Obtido |
|---|---|---|---|---|
| S1 | `lib/auth.ts`, `lib/limite-login.ts` | 20 senhas erradas ao mesmo tempo | no máximo 5 conferidas | as 20 conferidas |
| C3 | `flashcards/progresso` | `cardId: {"not":""}`, `acertou: true` | 400 | limpa a revisão de todos os cartões do aluno |
| C9 | `redacao/submit`, `evaluate` | texto de 200 mil caracteres | recusar | grava e manda inteiro para a IA |
| C12 | `questions/ai-generate` | `subtema` de 100 mil letras | cortar ou recusar | vai inteiro ao pedido da IA |
| C18 | `pdf-process` | arquivo que não é PDF | recusar sem IA | gasta IA e devolve 500 com a mensagem interna |
| E2 | `provas/responder` | a gravação falha e a tela tenta de novo | 1 acerto, 1 registro | responde 200 com 0 e 0 |
| E8 | `treino/answer` | mesmo envio 2 vezes | 1 registro | 2 registros e questão "dominada" |
| E19 | `review` | falha ao criar a próxima revisão, nova tentativa | revisão agendada | a revisão some |
| E15 | `simulado/submit` | mesma questão 3 vezes no envio | 1 acerto | 3 acertos |
| E13 | `simulado/generate`, `treino/filtered` | banco com questão-degrau | não aparece solta | aparece |
| E20 | `lib/schedule-data.ts` | chamar `getWeekTopics(0)` | cronograma intacto | segunda acumula os assuntos dos outros dias até reiniciar |
| E22 | `lib/verificar-respostas.ts` | conferente devolve letra vazia | `null` | vira "A" e passa sem conferência |
| E21 | `lib/verificar-respostas.ts` | `valor` vazio | `null` | vira 0 |

### Baixos

| Id | Onde | Passos | Esperado / obtido |
|---|---|---|---|
| S2 | `middleware.ts` | abrir `/dashboard` sem login com o cabeçalho `next-router-prefetch` | 307 / 200 (casca da tela, sem proteção de login e de CSP) |
| C4 | `flashcards/progresso` | cartão inexistente | 404 / 500 |
| C5 | 14 rotas de conteúdo | corpo quebrado ou `null` | 400 / 500 |
| C6 | `redacao/submit` | `texto` como número ou lista | 400 / 500 |
| C7 | `redacao/submit` | `customTema` só com espaços | 400 / cria tema vazio |
| C8 | `redacao/submit` | tema inexistente | 4xx / 500 |
| C10 | `user/profile` | nome número, vazio ou enorme | 400 / 200 e grava |
| C11 | `questions/[id]` | editar ou apagar id inexistente | 404 / 500 |
| C13 | `batch-import` | `pairIndex` inválido | 400 / 500 |
| C15 | `batch-import` | IA responde texto que não é JSON | 502 / 500 |
| C19 | `flashcards/decks/[id]` | apagar baralho de outra pessoa | 404 / "sucesso" sem apagar |
| C20 | `flashcards/decks` | nome número, vazio ou enorme | 400 / 200 |
| E3 | `provas/finalizar` | finalizar 2 vezes | data mantida / data trocada |
| E4 | `provas/finalizar` | sem `examId` | 400 / 200 |
| E5 | `provas/criar` | `nivel: "toString"` | 4xx / 500 |
| E6 | rotas de estudo | corpo quebrado ou `null` | 400 / 500 |
| E7 | `provas/reforco` | 200 questões usadas mais a atual | pula a atual / devolve a atual |
| E9 | `treino/answer` | resposta vazia ou "Z" | 400 / 200 e vira erro no histórico |
| E11 | `treino/session`, `simulado/session` | ids repetidos | 400 / 200 e fecha a sessão aberta |
| E12 | `treino/filtered` | quantidade -1, 0 ou "abc" | 400 / 200 com lista cortada ou vazia |
| E14 | `treino/generate` | abrir dia concluído | segue concluído / volta a "em andamento" (regra a confirmar) |
| E16 | `simulado/generate` | `totalQuestoes: "abc"` | 400 / 200 vazio |
| E17 | `simulado/generate` | matéria repetida | sem repetir / repete questões |
| E18 | `review` | `acertou: "false"` | 400 / conta como acerto |

## Riscos não cobertos

- **Banco real:** o efeito de objeto como filtro e os erros do Prisma são o comportamento esperado, não confirmados em banco. Sem teste de transação nem de concorrência reais.
- **IA, arquivos e PDF reais:** qualidade das respostas e leitura de gabarito não testadas.
- **Navegador:** só fumaça (abrir, erro, celular, entrada pelo Início). Falta o fluxo completo de responder uma prova com dados.
- **Observado no código, sem teste vermelho:** qualquer usuário logado envia arquivo de qualquer tipo em `upload/presigned` e grava questão de IA no banco comum; o limite de senha deixa passar se o banco falhar; tirar alguém de `ALLOWED_USERS` não encerra a sessão aberta; 30 erros de senha no total travam o login de todos.
- **Dependências** (`npm audit --omit=dev`): 14 alertas (2 críticos: `next` e `next-auth`; 7 altos; 2 médios; 3 baixos). Não foi avaliado se são exploráveis aqui.

## Próximos passos

1. Validar o tipo de todo identificador recebido (zod, já no projeto): fecha E1, E10, C1, C2, C3.
2. Nunca gravar gabarito "A" por falta de informação: C14, C16, C17.
3. Registrar a tentativa de senha antes de conferir: S1.
4. Atualizar `next` e `next-auth` num ramo separado e rodar esta bateria.
5. Colocar `npm run test:qa` na integração do GitHub quando os bugs altos fecharem.
