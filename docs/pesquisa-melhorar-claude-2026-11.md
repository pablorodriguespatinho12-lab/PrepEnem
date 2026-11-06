# Como melhorar o Claude Code — pesquisa de 06/11/2026

Feita porque a pesquisa anterior se perdeu num reinício (não estava salva em arquivo).

## A ideia que mais importa (fonte oficial da Anthropic)

Toda instrução é de dois tipos:

- **O Claude decide**: CLAUDE.md, skills, o pedido. Ele segue *quase* sempre.
- **O programa obriga**: hooks, regras `deny`, sandbox, testes. Vale *sempre*.

Regra prática: se uma linha do CLAUDE.md foi esquecida duas vezes, ela vira hook
ou `deny`. Escrever "IMPORTANTE" ou em maiúsculas não ajuda mais — só faz o
modelo aplicar a regra demais.

## O que os melhores fazem (Boris Cherny, criador do Claude Code, e o time)

1. **Dar ao Claude um teste que responde passou/falhou.** É a dica nº 1 do Boris:
   com um jeito de se conferir, a qualidade sobe 2 a 3 vezes (número dele, citado
   por terceiros). No PrepEnem já existe: `npm run build`, typecheck, Playwright.
2. **CLAUDE.md curto e vivo** (menos de 200 linhas): só o que o Claude não acha
   lendo o código. Cada erro vira uma linha. Não descrever pastas.
3. **Pedir prova, não "tá pronto"**: o comando rodado e a saída, ou a foto.
4. **Revisor que não viu a conversa** (`/code-review`): pede "pule estilo",
   senão ele sempre acha alguma coisa e o código engorda.
5. **Esforço (`/effort`) controla o quanto ele pensa**, não frases como "pense
   bem". `ultrathink` vale para uma pergunta só.
6. **`/clear` entre tarefas diferentes**: resposta melhor e mais barata.
7. **Várias sessões em paralelo com `claude --worktree nome`**.
8. **Hook que bloqueia no commit, não a cada edição** (Shrivu Shankar):
   deixar o Claude terminar o plano e conferir no fim.
9. **Fim de sessão = retrospectiva**: "o que você aprendeu?" vira memória/skill.
   (Já fazemos: `inventar-daqui`, `auditar-o-repertorio`.)

## Segurança (o que vale saber)

- **Prompt injection** é o risco principal: texto de site, issue ou pacote que
  manda o agente fazer coisa. Nenhuma IA é imune. Defesa: regras `deny` e sandbox,
  porque o modo automático é um juiz que pode errar.
- **Repositório de outra pessoa pode trazer hooks** em `.claude/settings.json`
  (falha da Check Point, CVE-2025-59536, já corrigida). Só confiar em pasta conhecida.
- **Pacotes npm já vazaram credenciais** em `.claude/settings.local.json`
  (Check Point achou 33 arquivos em 30 pacotes). Nunca publicar essa pasta.
- **O sandbox cobre só comandos de terminal**; leitura de arquivo, MCP e hooks
  ficam fora. Por isso também precisa de `deny`.

## Análise da minha configuração

| Achado | Situação |
|---|---|
| Sem `deny` global para `~/.ssh`, `~/.aws`, credenciais | Script pronto para o Pablo rodar |
| Modo automático descrevia o logica-app sem GitHub | Script pronto |
| 3 regras ECC ensinam coisa velha (Option+T, TodoWrite, pnpm) | Script desliga |
| Sandbox desligado | Não ligar agora: pode travar `localhost:3000` no WSL2 |
| ~69 KB de regras globais por sessão | Cortar em dezembro, com calma |
| 124 skills globais | Em dezembro: `skillOverrides` "name-only" nas raras |
| Typecheck após cada edição | Não bloqueia (1–3 s); avaliar Stop hook em dezembro |

## Segurança como carreira (para depois do ENEM)

- Comece por **PortSwigger Web Security Academy** (grátis) e **TryHackMe**.
- Leia o **OWASP Top 10** e o **OWASP Top 10 para LLM/agentes** — é exatamente
  o tipo de falha que existe em apps com IA, como o PrepEnem.
- Use o Claude como tutor de CTF: ele explica o passo, você executa.
  Pesquisa de 2026: agentes resolvem ~19 de 30 desafios e travam nas mesmas
  categorias; num teste real (ICLR 2026) um agente bateu 9 de 10 profissionais,
  mas com mais falso positivo. Humano no comando ainda faz diferença.
- Skills já instaladas para treinar: `seguranca-site-nextjs`, `ai-security`,
  `prompt-injection`.

## MCPs e skills do GitHub (2ª pesquisa, 06/11/2026)

Hoje não há nenhum MCP local. Só os conectores do claude.ai (Vercel, Exa, Gmail,
Drive…) e o plugin Context7, ligado mas sem login — ou seja, não funciona.

| Candidato | Veredito | Por quê |
|---|---|---|
| **Neon MCP** (oficial) | **Instalado 06/11 (falta login)** | Login por OAuth (sem senha em arquivo), modo só-leitura, preso a um projeto. Ver tabelas e dados sem script. Soma com `db-inspector` e `prisma-neon-safety`. |
| Context7 (já instalado) | Logar ou desligar | Hoje ocupa espaço sem funcionar. Logado, traz docs atualizadas de bibliotecas. |
| next-devtools-mcp (Vercel) | Só depois do Next 16 | As ferramentas de erro e rota em tempo real exigem Next 16; estamos no 14.2.35. |
| Prisma MCP | Não | É para Prisma Postgres; usamos Neon. |
| Playwright MCP | Não | Já usamos Playwright por script e a skill `verificacao-local`; MCP gasta contexto toda sessão. |
| GitHub MCP | Não | O `gh` já faz o mesmo. |
| mattpocock/skills | `handoff` instalada 06/11 | Já temos `grill-me`. Vale `handoff` e talvez `improve-codebase-architecture`. |
| obra/superpowers | Já temos o núcleo | `writing-plans`, `systematic-debugging`, `test-driven-development`… |
| anthropics/skills, karpathy-guidelines, ui-ux-pro-max | Já instalados | — |

**Regra para escolher MCP:** servidor oficial do fabricante; modo só-leitura quando
existir; versão fixa; desconfiar de servidor que muda a descrição das ferramentas
depois de aprovado ("rug pull", envenenamento de ferramenta).

**Comandos de dezembro (não rodar antes):**

- Neon: `claude mcp add --transport http neon "https://mcp.neon.tech/mcp?readonly=true" --scope project` e logar no navegador.
- Context7: `/mcp` → logar, ou desligar o plugin.
- `handoff`: ler o SKILL.md em github.com/mattpocock/skills e copiar para `~/.claude/skills/`.

## Fontes

- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/security
- https://github.com/shanraisshan/claude-code-best-practice
- https://blog.sshh.io/p/how-i-use-every-claude-code-feature
- https://www.practicalsystems.io/blog/my-claude-code-harness-hooks-skills-rules-that-became-code
- https://www.akto.io/blog/claude-code-security-risks
- https://arxiv.org/html/2512.09882v2 (agentes x profissionais em pentest)
- https://arxiv.org/html/2605.21497v1 (agentes e CTF)
- Segunda opinião: Antigravity (Google), `agy -p`, 06/11/2026
- https://nextjs.org/docs/app/guides/mcp
- https://neon.com/docs/ai/neon-mcp-server
- https://www.prisma.io/docs/postgres/integrations/mcp-server
- https://github.com/mattpocock/skills
- https://mailtrap.io/blog/mcp-server-security/
- https://zuplo.com/blog/remote-mcp-server-rug-pull/
