# Automação do Claude Code para o TDAH — pesquisa de 06/11/2026

Continua `docs/pesquisa-melhorar-claude-2026-11.md` (boas práticas e segurança).
Aqui o foco é: **tirar coisa da cabeça do Pablo**.

## Resposta curta: falta logar algum MCP?

| MCP | Situação | Ação |
|---|---|---|
| Neon | Logado e testado: respondeu com 3 projetos (PrepEnem, logica-app, carteirinha) | nada |
| Context7 | Ligado, sem login | `/mcp` → context7 → logar (docs atualizadas de Next/Prisma) |
| Zoom (3 servidores) | Falham: token inválido | desligar (script) |
| Vendas, finanças, bio, Pendo, Adobe… (26 plugins) | Vêm sincronizados da conta claude.ai; nunca usados | desligar (script) |
| Gmail, Drive, Vercel, Exa | Já funcionam | nada |

## O que a comunidade faz (GitHub, por estrelas)

| Repositório | ★ | O que tem | Veredito |
|---|---|---|---|
| hesreallyhim/awesome-claude-code | 57 mil | lista curada | fonte para consulta |
| davila7/claude-code-templates | 33 mil | catálogo de hooks/skills | consulta |
| jarrodwatts/claude-hud | 29 mil | painel de contexto e ferramentas | **não**: já temos `context-monitor.sh` |
| alexgreensh/attention-span | 1,5 mil | estilo de resposta para TDAH, medido: −43% de texto, testes iguais (97%) | **ideia adotada**, escrita do zero em português (a deles é AGPL) |
| ravila4/claude-adhd-skills | 171 | hora em todo pedido, lembretes, diário no Obsidian | **ideia adotada**: data/hora no início da sessão |
| shaheer-00/claude-adhd | 114 | relembra fio solto de sessões passadas, painel web | **não agora**: "em modo de teste", sobe painel próprio |
| Hainrixz/aprende-skill | 29 | `/aprende` no fim da sessão grava as correções | já fazemos (máquina de aprendizado no CLAUDE.md) |
| UditAkhourii/adhd | 4,5 mil | apesar do nome, é técnica de brainstorm em paralelo | não é sobre TDAH |
| PeonPing/peon-ping, code-notify | 5 mil / 300 | aviso sonoro/visual quando o agente para | **ideia adotada**: aviso do Windows |

## Fatos das docs oficiais (code.claude.com, baixadas hoje)

- Gancho `Notification` tem tipos `permission_prompt`, `idle_prompt`, `elicitation_dialog`,
  `agent_needs_input` — dá para avisar só quando ele precisa agir.
- Gancho `SessionStart` pode pôr texto no meu contexto (`additionalContext`, até 10 mil caracteres).
- `~/.claude/CLAUDE.md` vale para todo projeto; ideal **menos de 200 linhas**. A memória
  automática carrega só as **primeiras 200 linhas ou 25 KB** do `MEMORY.md`.
- Estilo de resposta (`~/.claude/output-styles/`) muda o jeito de falar; com
  `keep-coding-instructions: true` o jeito de programar continua igual.
- Regra em `~/.claude/rules/` sem `paths:` entra em **toda** sessão.

## O que foi montado (em `scripts/claude-config/`)

1. **Aviso no Windows** (`avisar-windows.sh`): balão no canto da tela quando eu peço
   permissão, pergunto ou termino. Usa o `powershell.exe` do Windows, sem instalar nada. Testado.
2. **Onde parou** (`pendencias-inicio.sh`): no início de toda sessão eu recebo data, hora,
   ramo, commits sem push e a lista `~/.claude/pendencias.md`. Ele não precisa reexplicar.
3. **Estilo TDAH** (`estilo-tdah.md`): resposta na 1ª linha, negrito no essencial,
   no máximo 2 opções, fecha com "Próximo:".
4. **Arquivo global** (`CLAUDE.global.md`, 2,9 KB): o essencial do Pablo para qualquer projeto
   (antes estava preso na memória do PrepEnem; nos outros 8 projetos eu não sabia).
5. **Conserto do `comment-strip.sh`** — ver `docs/faxina-2026-11-06.md`.

Aplicar: `! python3 scripts/claude-config/aplicar.py --aplicar` e reabrir o Claude Code.

## Descartado

- Reflexão automática com `claude -p` a cada resposta: gasta cota sempre.
- Obsidian como memória: o Pablo não usa.
- Painéis/statusline novos: mais uma coisa para olhar.
- Lembrete por tempo ("me para às 23h"): bom, mas fica para dezembro se ele quiser.

## Segunda opinião (Antigravity, `agy -p`)

Concordou com o aviso no Windows como a automação nº 1 para TDAH. Sugeriu tirar duplicação
(`.env` aparecia duas vezes — tirado) e lembrar do servidor velho na porta 3000 (incluído;
já deu erro 500 em todas as telas do logica-app). Não adotado: tirar o gosto visual do
global (é dele, vale em todo site).

## Fontes

- https://code.claude.com/docs/en/hooks · /memory · /output-styles · /statusline
- https://github.com/hesreallyhim/awesome-claude-code
- https://github.com/alexgreensh/attention-span
- https://github.com/ravila4/claude-adhd-skills
- https://github.com/shaheer-00/claude-adhd
- https://github.com/Hainrixz/aprende-skill
- https://github.com/jarrodwatts/claude-hud
- https://dev.classmethod.jp/articles/notification-claudecode-in-windows/ (aviso no Windows pelo WSL)
- https://gist.github.com/latenssi/e3a54bbdd84f6d595908c10931ac9b9f
- https://dev.to/chudi_nnorukam/adhd-devs-claude-code-workflows-1b5c
- https://chudi.dev/blog/claude-code-adhd-workflows
- https://alexop.dev/posts/claude-code-notification-hooks/
- https://claudefa.st/blog/tools/hooks/session-lifecycle-hooks
