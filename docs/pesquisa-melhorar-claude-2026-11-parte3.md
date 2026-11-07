# Como melhorar o Claude — parte 3: ideias do GitHub (06/11/2026)

As partes 1 e 2 cobriram Boris Cherny, as docs, MCPs e enxugar a lista de skills.
Esta parte leu listas e repositórios do GitHub e textos de devs sobre o "hook de parada".

## A lição que se repete

**Regra escrita o Claude segue quase sempre; hook o programa obriga sempre.**
Duas regras do Pablo só viviam no CLAUDE.md e falharam na própria sessão de 06/11:
- "Provar antes de afirmar": nada impedia dizer "pronto" com teste quebrado.
- "Carregar as skills que servem": `combinar-skills` e `explicar-ao-pablo` não foram carregadas.

## O que entrou (testado; o Pablo instala com `aplicar-travas.py`)

| Trava | Evento | O que faz | Medido |
|---|---|---|---|
| `verificar-antes-de-parar.sh` | Stop | com `.ts/.tsx` mudados desde o commit, roda tsc e `vitest related`; falhou → o Claude tem de continuar | sem mudança: 0,03 s; com mudança: 6–10 s, 1 vez por conjunto de mudanças; pegou erro de tipo e teste quebrado de propósito |
| `sugerir-skills.py` + `skill-rules.json` | UserPromptSubmit | palavras do pedido → 1 linha com as skills do projeto que servem | 0,03–0,08 s; 6 de 6 pedidos de exemplo certos |

Proteções do hook de parada (pedidas por todos os textos): sai se `stop_hook_active`
(senão vira laço infinito), sai se nada mudou, guarda o que já passou para não repetir.
Limite conhecido: confere que o teste passa, não que o teste está certo.

## O que ficou de fora

| Ideia | Fonte | Por quê |
|---|---|---|
| Revisão de PR por GitHub Action | ChrisWiles | precisa de `ANTHROPIC_API_KEY` paga (US$ 10–50/mês, estimativa dele) |
| Tarefas agendadas (docs, dependências) | ChrisWiles | mesma chave paga |
| Hook que manda o Opus aprovar comandos | shanraisshan | o modo automático já faz isso |
| `/careful` e `/freeze` | shanraisshan | `destructive-guard` e `db-guard` já cobrem |
| Regras com `paths:` | shanraisshan | as regras globais de React e TypeScript já carregam só nesses arquivos |
| Bloquear edição na branch main | ChrisWiles | `branch-guard` já existe |

## Parte 4: por dentro, sem nova pesquisa (06/11/2026, noite)

Erros de ferramenta nas 4 sessões depois da parte 2: **6** (antes, 32). Não há erro grande a caçar;
o ganho agora está no que entra em **toda sessão** (~20 KB medidos).

Correção da tabela acima: "regras com `paths:`" valia só para React e TypeScript.
`web/performance.md` e `web/security.md` não tinham `paths:` e carregavam em todo pedido.

| O quê | Antes | Depois | Como |
|---|---|---|---|
| Índice da memória (`MEMORY.md`) | 6,8 KB | 4,5 KB | linhas encurtadas; as 44 memórias seguem no índice |
| Regras `web/*` | sempre (3,4 KB) | só em .tsx/.css/next.config | `enxugar-regras.py` |
| `common/security.md` | manda usar `security-reviewer` (não existe) | `revisor-adversarial` / `seguranca-site-nextjs` | idem |
| `common/git-workflow.md` | "Attribution disabled", "push com -u", link para arquivo inexistente | "nunca push" | idem |

O script foi testado numa cópia: 1ª vez ajusta 4 arquivos, 2ª vez não muda nada.
Pablo roda: `python3 scripts/claude-config/enxugar-regras.py` (cópia em `~/.claude/rules-backup-<data>/`).

## Fontes

- https://github.com/ChrisWiles/claude-code-showcase
- https://github.com/shanraisshan/claude-code-best-practice
- https://github.com/ithiria894/awesome-claude-code-hooks
- https://github.com/MPIsaac-Per/claude-code-loop-patterns
- https://dev.to/shipwithaiio/how-to-build-a-self-verification-loop-in-claude-code-3-layers-20-minutes-m1p
- https://codingwithroby.substack.com/p/the-stop-hook-that-wont-let-claude
