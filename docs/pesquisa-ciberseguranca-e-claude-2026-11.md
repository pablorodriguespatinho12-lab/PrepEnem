# Cibersegurança e Claude: o que os profissionais fazem (08/11/2026)

Pedido do Pablo depois da redação do ENEM: um dia trabalhar fora, como profissional de
cibersegurança. Três frentes pesquisadas em paralelo; as três seções abaixo são os relatórios.

## Conferido por mim na fonte (08/11, 23h)
- ISC2 CC gratuito acabou em **20/05/2026** ([ISC2, 22/04/2026](https://www.isc2.org/Insights/2026/04/one-million-certified-cyber-conclusion)).
- Hackers do Bem: **gratuito**, ensino médio cursando ou concluído, 25 mil vagas em 2026; a fonte
  diz inscrição aberta em **janeiro/2026** (o relatório da frente 3 dizia 12/09: divergência)
  ([Convergência Digital, 14/01/2026](https://convergenciadigital.com.br/seguranca/hackers-do-bem-abre-25-mil-novas-vagas-para-formacao-em-ciberseguranca-em-2026/)).
- `trailofbits/skills`: 8.079 estrelas, CC-BY-SA-4.0, último push 06/11/2026 (`gh api`).

## O que muda para o Pablo
- **Estilo de resposta fixo** (ideia 1 da Trail of Bits): já existe, é o estilo TDAH.
- **CTF com IA desclassifica** (picoCTF, RITSEC): o Claude explica, não resolve.
- Configuração da Trail of Bits roda com `--dangerously-skip-permissions` e supõe macOS: copiar
  ideias, não o arquivo.
- Sem `/sandbox`, as regras `deny` não seguram o Bash. No WSL2 precisa de `bubblewrap socat`.

## Segunda opinião (Antigravity, `agy -p`) e o que entrou na página
Página: https://claude.ai/artifact/2AbJ5HkJtYzVcatrjUfcUf
- Aceito: foco em **AppSec/DevSecOps** (ele programa), SOC N1 vira plano B.
- Aceito: Bandit até o nível **20** (o 10 sai em 2 h); fundamentos de **redes e Linux** antes.
- Aceito: writeup **por desafio terminado**, sem meta semanal (TDAH).
- Aceito: no SiSU, ADS, Redes ou Ciência da Computação.
- Aceito: remoto EUA é raro para SOC N1; comum para AppSec e programação.
- Recusado: "Blue Card exige diploma". A regra alemã de 2023 aceita TI sem diploma com
  3 anos de experiência (frente 3, item 5).


---

## Frente 1: como os profissionais configuram o Claude Code (pesquisa de 08/11/2026)

Base do que o Pablo já tem: CLAUDE.md global curto, hooks de segurança (rm -rf, segredos, .env),
skills de projeto, memória em arquivos, hook que sugere skills, subagentes revisores, placar de métricas,
hook Stop (travas de 06/11).

---

## 1. Estilo de resposta "Concise" no lugar de regra no CLAUDE.md
- **Quem:** Trail of Bits (repo claude-code-config, 2.148 estrelas)
- **O que é:** escolher o estilo de resposta "Concise" (`"outputStyle"` no settings.json do usuário, Claude Code v2.1.237 ou mais novo), que vai no prompt de sistema e começa pelo resultado, sem preâmbulo.
- **Por que ajuda:** o estilo fica no prompt de sistema e gera lembretes periódicos, o que segura melhor em sessão longa do que uma linha no CLAUDE.md; eles recomendam usar os dois juntos. `/config` grava só no projeto; para valer em tudo, pôr no `~/.claude/settings.json`.
- **Fonte:** https://github.com/trailofbits/claude-code-config (seção "Output Styles")
- **Novo para o Pablo:** sim

## 2. Hook SessionStart com matcher "compact" para reinjetar o essencial
- **Quem:** Anthropic (guia oficial de hooks)
- **O que é:** um hook `SessionStart` com `"matcher": "compact"` que imprime (echo ou `git log --oneline -5`) o que não pode se perder depois de cada compactação.
- **Por que ajuda:** a compactação resume e perde detalhe; o hook põe de volta, sempre, o que hoje depende do resumidor obedecer à seção "/compact" do CLAUDE.md. Trail of Bits avisa: regras com `paths:` não voltam sozinhas depois da compactação.
- **Fonte:** https://code.claude.com/docs/en/hooks-guide (seção "Re-inject context after compaction")
- **Novo para o Pablo:** sim

## 3. Regras de leitura negada + `/sandbox` (bubblewrap no Linux)
- **Quem:** Trail of Bits
- **O que é:** regras `Read(~/.ssh/**)`, `Read(~/.config/gh/**)`, `Read(~/.npmrc)`, `Edit(~/.bashrc)` etc. em `permissions.deny`, mais `/sandbox`, que aplica essas regras no sistema operacional.
- **Por que ajuda:** sem `/sandbox`, a regra só barra as ferramentas Read/Edit, e o Bash passa por cima (`cat ~/.ssh/id_rsa` funciona); hook que lê o comando como texto também é contornável. Com `/sandbox`, a escrita fica presa à pasta do projeto e a rede só vai a domínios liberados. No Linux exige `sudo apt install bubblewrap`.
- **Fonte:** https://github.com/trailofbits/claude-code-config (seção "Sandboxing") e https://deepwiki.com/trailofbits/claude-code-config/3.1-permission-deny-rules
- **Novo para o Pablo:** sim (os hooks dele barram texto do comando, não leitura no sistema)

## 4. Hook Stop do tipo "prompt" contra desculpa de trabalho incompleto
- **Quem:** Trail of Bits
- **O que é:** hook `Stop` com `"type": "prompt"`: um modelo rápido (Haiku) lê a resposta final e devolve `{"ok": false, "reason": ...}` se ela disser "já existia antes", "fora do escopo", "fica para depois" ou pular teste que falhou.
- **Por que ajuda:** obriga a continuar em vez de declarar vitória cedo. Detalhe que quebra: o prompt precisa exigir "só JSON cru", senão o Haiku põe cercas de código e o hook falha em silêncio; tempo padrão 30 s.
- **Fonte:** https://github.com/trailofbits/claude-code-config (seção "Hooks", "Anti-rationalization gate")
- **Novo para o Pablo:** parcial (ele já tem hook Stop; o tipo "prompt" com juiz Haiku é o novo)

## 5. Regras por caminho (`paths:`) em vez de regra sempre carregada
- **Quem:** Trail of Bits
- **O que é:** CLAUDE.md global de ~100 linhas + arquivos em `~/.claude/rules/` com `paths:` no topo, que só carregam quando o Claude toca um arquivo daquele tipo (ex.: `*.ts`, `package.json`).
- **Por que ajuda:** a sessão só paga o contexto do que usa. `@arquivo` dentro do CLAUDE.md NÃO economiza contexto (carrega no início). Para conferir o que carregou: hook `InstructionsLoaded` ou `/context`.
- **Fonte:** https://github.com/trailofbits/claude-code-config (seção "Global CLAUDE.md")
- **Novo para o Pablo:** sim (as regras `rules/ecc/common/*` dele carregam sempre)

## 6. `/insights` toda semana + histórico de 365 dias
- **Quem:** Trail of Bits; Boris Cherny também cita o `/insights`
- **O que é:** rodar `/insights` uma vez por semana e pôr `"cleanupPeriodDays": 365` no settings (padrão 30 dias).
- **Por que ajuda:** o `/insights` lê as sessões e aponta o que dá certo e o que falha; cada achado vira linha no CLAUDE.md, hook ou skill. Com 30 dias de histórico, ele tem pouca coisa para ler.
- **Fonte:** https://github.com/trailofbits/claude-code-config (seções "Settings" e "Continuous Improvement") e https://www.claudecodecamp.com/p/how-the-claude-code-team-really-works
- **Novo para o Pablo:** sim (o placar dele é próprio; `/insights` é o nativo)

## 7. Comando de barra com bash pré-calculado e ferramentas pré-liberadas
- **Quem:** Boris Cherny e Cat Wu (equipe do Claude Code)
- **O que é:** comando em `.claude/commands/` (ex.: `/commit-push-pr`) que roda `git status`/`git diff` dentro do próprio arquivo antes de chegar ao modelo, libera `git commit` etc. só para aquele comando e pode usar Haiku.
- **Por que ajuda:** sem ida e volta com o modelo para descobrir o estado, sem pedido de permissão no meio; Boris usa "dezenas de vezes por dia".
- **Fonte:** https://threadreaderapp.com/thread/2007179832300581177.html (item 7) e https://every.to/podcast/transcript-how-to-use-claude-code-like-the-people-who-built-it
- **Novo para o Pablo:** sim (ele usa skills; o bash embutido que roda antes do modelo é o novo)

## 8. "Máquina caça-níquel": salvar, deixar rodar 30 min, aceitar ou recomeçar
- **Quem:** equipes de Ciência de Dados e RL da Anthropic (relatório "How Anthropic teams use Claude Code")
- **O que é:** commit antes, deixar o Claude trabalhar sozinho ~30 min, e aceitar o resultado ou começar do zero, em vez de corrigir no meio.
- **Por que ajuda:** segundo as equipes, recomeçar do zero acerta mais do que remendar a sessão que desandou; uma equipe diz que acerta de primeira só ~1 em 3 vezes, por isso o commit antes.
- **Fonte:** https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf
- **Novo para o Pablo:** sim

## 9. Frases de desafio da equipe do Claude Code
- **Quem:** Boris Cherny (dicas reunidas da equipe, 01/02/2026)
- **O que é:** três frases: "Me sabatina sobre essas mudanças e não faça PR até eu passar"; "Prove que funciona" (comparar main x branch); depois de um conserto fraco: "Sabendo tudo o que sabe agora, jogue fora e faça a solução elegante". Variante: um 2º Claude revisa o plano "como engenheiro sênior" antes de executar; quando desanda, voltar ao modo de planejamento.
- **Por que ajuda:** força uma 2ª tentativa com o contexto todo e uma revisão do plano antes de gastar com código.
- **Fonte:** https://paddo.dev/blog/claude-code-team-tips/ e https://www.claudecodecamp.com/p/how-the-claude-code-team-really-works
- **Novo para o Pablo:** sim (os revisores dele olham o diff, não o plano)

## 10. Sessões em paralelo com worktree nativo
- **Quem:** equipe do Claude Code (Boris Cherny)
- **O que é:** 3 a 5 worktrees com um Claude cada (`claude --worktree nome`); subagente com `isolation: worktree` no cabeçalho; atalhos de shell `za`, `zb`, `zc` para pular entre eles.
- **Por que ajuda:** a equipe chama de "o maior ganho de produtividade". Pegadinha (Trail of Bits): com `/sandbox`, se o worktree for criado fora da pasta, o agente cai em `git checkout -b` na pasta compartilhada e acha que está isolado; usar `.worktrees/` dentro do repo.
- **Fonte:** https://github.com/DemosAI-Foundation/BorisCode/blob/main/boris%20tips%20summary.md (itens 1 e 28) e https://github.com/trailofbits/claude-code-config
- **Novo para o Pablo:** sim

## 11. Registro de todo comando Bash (PostToolUse)
- **Quem:** Trail of Bits
- **O que é:** hook `PostToolUse` no Bash que anexa cada comando com data/hora em `~/.claude/bash-commands.log` (uma linha de `jq`).
- **Por que ajuda:** revisar depois o que o agente realmente rodou; base para medir quais comandos repetem (e liberar com `/permissions`, como o Boris faz no item 10 da thread dele).
- **Fonte:** https://github.com/trailofbits/claude-code-config (seção "Hooks", "Bash command log")
- **Novo para o Pablo:** sim

## 12. A rede é a porta de vazamento ("trifeta letal")
- **Quem:** Simon Willison
- **O que é:** quem consegue pôr texto no contexto controla o agente; o que impede o roubo é cortar a rede para fora, e a sandbox mais segura é "o computador de outra pessoa" (Claude Code na web).
- **Por que ajuda:** mostra que hook de texto não fecha o risco de prompt injection: o que fecha é rede restrita (o `/sandbox` libera só domínios da lista) ou rodar a tarefa arriscada na nuvem.
- **Fonte:** https://simonwillison.net/2025/Oct/22/living-dangerously-with-claude/ e https://simonwillison.net/2025/Sep/30/designing-agentic-loops/
- **Novo para o Pablo:** parcial (ele já trata texto de site como dado; a rede restrita é a nova)

---

## As 2 que eu aplicaria primeiro

1. **Estilo "Concise" no settings do usuário (ideia 1).** É uma linha no settings e ataca o pedido nº 1 do CLAUDE.md dele (resposta curta, resultado na 1ª linha) no prompt de sistema, com lembrete periódico, o que segura mais em sessão longa do que o CLAUDE.md sozinho.
2. **Hook SessionStart "compact" (ideia 2).** O CLAUDE.md do projeto já tem uma seção "/compact" que depende do resumidor obedecer; o hook reinjeta as decisões de schema e os erros de build sempre, depois de toda compactação. É um `echo`/script, sem custo de tokens fora da compactação.

---

## Frente 2: como profissionais de segurança usam o Claude (pesquisa de 08/11/2026)

Método: dados dos repositórios lidos com `gh api` (estrelas, licença e último push medidos hoje);
documentação oficial lida com WebFetch. Texto de site tratado como dado.
"Oficial" = publicado pela própria empresa dona do produto.

## 1. Trail of Bits (consultoria de auditoria de segurança dos EUA)

### 1.1 trailofbits/skills
- **O que é:** loja de plugins (marketplace) com skills de auditoria de código, análise estática, contratos inteligentes, engenharia reversa e verificação.
- **Link:** https://github.com/trailofbits/skills
- **Confiável?** Oficial da Trail of Bits. 8.079 estrelas, último push 06/11/2026. Licença **CC-BY-SA-4.0**.
- **Instalar (dentro do Claude Code):**
  ```
  /plugin marketplace add trailofbits/skills
  /plugin menu
  ```
- **Skills úteis para quem audita código web (nomes exatos do README):**
  - `static-analysis`: kit com CodeQL, Semgrep e leitura de SARIF.
  - `differential-review`: revisão de segurança de um diff, olhando o histórico do git.
  - `insecure-defaults`: acha configuração padrão que "falha aberta" (ex.: segredo vazio aceito).
  - `sharp-edges`: aponta APIs e configurações fáceis de usar errado.
  - `supply-chain-risk-auditor`: audita dependências npm/PyPI/Go (alertas, projeto abandonado, script de instalação).
  - `fp-check`: confere se um achado é falso positivo antes de reportar.
  - `audit-context-building`: entender o código função por função antes de caçar bug.
  - `variant-analysis`: achar o mesmo bug em outros lugares do código.
  - `semgrep-rule-creator`: escrever regra Semgrep própria.
  - `open-sourcing`: preparar repositório para ficar público (segredos, licença).
  - `agentic-actions-auditor`: audita GitHub Actions que rodam agentes de IA.
  - `cvss-scoring`: calcula a nota CVSS v4.0 de uma vulnerabilidade.
  - Outras: `c-review`, `rust-review`, `yara-authoring` (malware), `constant-time-analysis` (cripto), `building-secure-contracts` (blockchain), `firebase-apk-scanner` (Android), `devcontainer-setup`, `second-opinion`.
- **Prova de uso real:** o README cita um bug achado com a skill `constant-time-analysis` (vazamento por tempo na assinatura ML-DSA, PR em RustCrypto/signatures #1144).

### 1.2 trailofbits/claude-code-config
- **O que é:** a configuração padrão que a Trail of Bits usa no Claude Code (sandbox, permissões, hooks, MCPs, CLAUDE.md global).
- **Link:** https://github.com/trailofbits/claude-code-config
- **Confiável?** Oficial da Trail of Bits. 2.148 estrelas, último push 24/08/2026. **Sem licença declarada** no GitHub (a API devolve vazio): dá para ler e copiar ideias, não para redistribuir.
- **Instalar:**
  ```
  git clone https://github.com/trailofbits/claude-code-config.git
  cd claude-code-config
  claude
  ```
  e dentro da sessão: `/trailofbits:config` (assistente que instala item por item).
- **Atenção:** pressupõe macOS/Homebrew e o modo `--dangerously-skip-permissions` (sem pedir permissão), compensado por sandbox. Não é configuração de iniciante para copiar inteira.

### 1.3 trailofbits/claude-code-devcontainer
- **O que é:** contêiner pronto para rodar o Claude Code isolado ao revisar código não confiável.
- **Link:** https://github.com/trailofbits/claude-code-devcontainer
- **Confiável?** Oficial. 974 estrelas, Apache-2.0, push 06/11/2026. Exige Docker.

### 1.4 trailofbits/skills-curated
- **O que é:** lista de plugins de terceiros que a Trail of Bits revisou e aprovou.
- **Link:** https://github.com/trailofbits/skills-curated (528 estrelas, CC-BY-SA-4.0).

## 2. Anthropic

### 2.1 Comando `/security-review` (já vem no Claude Code)
- **O que é:** revisão de segurança das mudanças pendentes do branch, direto no terminal.
- **Link:** https://github.com/anthropics/claude-code-security-review (seção "Claude Code Integration")
- **Confiável?** Oficial. Neste computador ele já aparece como skill `security-review`.
- **Usar:** digitar `/security-review` numa sessão. Para personalizar: copiar `.claude/commands/security-review.md` do repositório para `.claude/commands/` do projeto.

### 2.2 GitHub Action `anthropics/claude-code-security-review`
- **O que é:** roda a mesma revisão em cada pull request e comenta os achados.
- **Link:** https://github.com/anthropics/claude-code-security-review
- **Confiável?** Oficial. 6.809 estrelas, MIT, último push 11/02/2026.
- **Instalar:** workflow com `uses: anthropics/claude-code-security-review@main` + chave da API Anthropic como segredo do repositório (custa crédito da API).
- **Aviso do próprio README:** "não é protegida contra prompt injection; use só em PRs confiáveis" e ligar "Require approval for all external contributors".

### 2.3 Claude Code Security (produto pago)
- **O que é:** varredura do repositório inteiro que propõe correções, com aprovação humana.
- **Links:** https://www.anthropic.com/news/claude-code-security e https://claude.com/solutions/claude-code-security
- **Confiável?** Oficial. Lançado em 20/02/2026 como prévia para planos Enterprise e Team; mantenedores open source podiam pedir acesso grátis. Testadores só podem escanear código que é deles.
- **Para iniciante:** não se aplica (plano empresarial).

### 2.4 Red team da Anthropic: Claude em CTFs
- **O que é:** o Frontier Red Team inscreveu o Claude em 7 competições feitas para humanos em 2025.
- **Link:** https://www.anthropic.com/research/cyber-competitions (post de 09/08/2025; o endereço antigo red.anthropic.com redireciona para cá)
- **Números do post:** picoCTF: 297º de 10.460 equipes (32 de 41 desafios). HackTheBox AI vs Human: 30º de 161. PlaidCTF e qualificatória do DEF CON: zero desafios. Falhou em tarefas longas (contexto encheu).
- **Também:** https://www.anthropic.com/news/building-ai-cyber-defenders (defesa) e https://www.anthropic.com/research/claude-4-cyber.

### 2.5 Sandbox do Claude Code (`/sandbox`)
- **O que é:** isola os comandos Bash: escrita só na pasta do projeto, rede só para domínios liberados.
- **Link:** https://code.claude.com/docs/en/sandboxing
- **Confiável?** Documentação oficial. **Funciona no WSL2** (WSL1 não).
- **Instalar no Ubuntu/WSL2:**
  ```
  sudo apt-get install bubblewrap socat
  ```
  depois `/sandbox` dentro do Claude Code (ou `"sandbox": {"enabled": true}` em `~/.claude/settings.json`).
- **Testar:** pedir ao Claude para rodar `touch ~/sandbox-probe` (deve dar "Read-only file system") e `curl --noproxy '*' https://example.com` (deve dar "Could not resolve host").
- **Limite documentado:** leitura de `~/.ssh` e `~/.aws` continua liberada por padrão (precisa de `denyRead`); Read/Edit/WebFetch, MCPs e hooks ficam fora do sandbox.

### 2.6 Estilo de resposta "Learning"
- **O que é:** o Claude explica cada escolha e deixa trechos marcados `TODO(human)` para a pessoa escrever.
- **Link:** https://code.claude.com/docs/en/output-styles
- **Confiável?** Oficial.
- **Ativar:** `/output-style learning` (ou `/output-style explanatory`, só explica, sem tarefa).

## 3. Semgrep, CodeQL e outras ferramentas

### 3.1 Semgrep Guardian (plugin oficial para Claude Code)
- **O que é:** escaneia cada arquivo que o agente gera (Semgrep Code, Supply Chain e Secrets) e devolve os problemas ao agente.
- **Links:** https://docs.semgrep.dev/semgrep-guardian/overview e https://docs.semgrep.dev/semgrep-guardian/quickstart
- **Confiável?** Oficial da Semgrep. Exige conta Semgrep (login pelo navegador na 1ª sessão). Preço não aparece na página.
- **Instalar:**
  ```
  claude plugin install semgrep@claude-plugins-official
  ```
- **Observação:** o repositório antigo https://github.com/semgrep/mcp está **arquivado** (MIT, 687 estrelas); o servidor MCP foi para dentro do binário `semgrep`. Por padrão o Guardian manda o código para o servidor da Semgrep; há versão local em https://github.com/semgrep/guardian-local.

### 3.2 CodeQL
- **GitHub MCP Server, conjunto `code_security`:** lê alertas do Code Scanning (CodeQL), Dependabot e Secret Scanning do repositório. Oficial do GitHub, MIT, 34.329 estrelas. Link: https://github.com/github/github-mcp-server (ativar com `--toolsets ...,code_security`). Só lê alertas, não roda consultas.
- **advanced-security/codeql-development-mcp-server:** MCP para escrever e rodar consultas CodeQL. Do time do GitHub, mas pequeno (39 estrelas, licença "NOASSERTION"). Link: https://github.com/advanced-security/codeql-development-mcp-server. Exige o CodeQL CLI.
- **CodeQL no GitHub Actions:** https://github.com/github/codeql-action (oficial, MIT; grátis em repositório público).
- **Via Trail of Bits:** a skill `static-analysis` (item 1.1) já ensina o Claude a rodar CodeQL e Semgrep.

### 3.3 MCPs que a Trail of Bits recomenda (do README da config)
- Todo funcionário: Context7 (documentação) e Exa (busca).
- Por tarefa: `slither-mcp` (Solidity, https://github.com/trailofbits/slither-mcp) e `pyghidra-mcp` (engenharia reversa com Ghidra, https://github.com/clearbluejar/pyghidra-mcp, comunitário).

## 4. O que esses profissionais proíbem ou isolam

| Regra | Quem | Fonte |
|---|---|---|
| Negar leitura de `~/.ssh`, `~/.gnupg`, `~/.aws`, `~/.azure`, `~/.kube`, `~/.docker/config.json`, `~/.npmrc`, `~/.pypirc`, `~/.git-credentials`, `~/.config/gh` e carteiras de cripto | Trail of Bits | claude-code-config, seção Sandboxing |
| Negar edição de `~/.bashrc` e `~/.zshrc` (evita porta dos fundos) | Trail of Bits | idem |
| Regra `deny` sozinha não segura o Bash; só com `/sandbox` vale também para comandos. "Use os dois." | Trail of Bits | idem |
| Modo sem permissão só dentro de sandbox, contêiner ou máquina remota descartável | Trail of Bits | idem (devcontainer, "droplets") |
| "Hooks não são barreira de segurança: prompt injection contorna. São guarda-corpo, não parede." | Trail of Bits | idem, seção Hooks |
| Rede do sandbox começa sem nenhum domínio liberado | Anthropic | docs de sandboxing |
| Action de revisão "não protegida contra prompt injection": só PRs confiáveis, aprovação para contribuidor externo | Anthropic | README da Action |
| Claude Code Security: escanear só código próprio | Anthropic | cobertura do lançamento (cyberscoop) |
| CTFs: LakeCTF (EPFL) proíbe qualquer IA; RITSEC 2026 proíbe IA resolvendo sozinha, mas aceita pergunta de conceito (cerca de 100 de ~800 equipes desclassificadas); o picoCTF já desclassificou por uso de IA (white paper da CyLab) | organizadores | https://lakectf.epfl.ch/no-llm.html, https://sylvie.fyi/posts/ritsec-2026/, https://www.cylabacademy.org/pdfs/Skill_or_Shortcut_WhitePaper.pdf |

## 5. Iniciante: aprender com o Claude sem pedir a resposta

- **picoCTF / picoGym** (https://picoctf.org): exercícios gratuitos, da Carnegie Mellon. Na competição ao vivo, a IA pode desclassificar; no picoGym (treino) não há ranking.
- **OverTheWire Bandit** (https://overthewire.org/wargames/bandit/): ensina terminal Linux por SSH. Regra do site (https://overthewire.org/rules/): pode escrever writeup, mas **nunca publicar as senhas** dos níveis e não dar spoiler.
- **Como usar o Claude (ideia de uso, montada a partir das regras acima):**
  1. `/output-style learning` para o Claude explicar e deixar a parte decisiva para você.
  2. Pedir **conceito**, não a flag: "o que é base64 e como reconheço?" em vez de "qual é a flag?". É a linha que o RITSEC aceita.
  3. Writeup: colar só depois de resolver (ou desistir), e pedir "explique o passo 3 como se eu soubesse só Linux básico".
  4. Rodar ferramentas de CTF dentro do `/sandbox` ou de um contêiner, nunca com acesso aos seus segredos.
  5. Atacar só o que é seu ou o que o desafio autoriza (laboratório, CTF). Fora disso é crime no Brasil (Lei 12.737/2012, invasão de dispositivo).

## 6. As 2 coisas para um iniciante no Brasil com Claude Code no WSL pegar primeiro

1. **`/sandbox` (com `sudo apt-get install bubblewrap socat`)**, mais `/output-style learning`.
   Motivo: é oficial, grátis, funciona no WSL2 e fecha o risco nº 1 apontado pela Trail of Bits: um comando (ou uma página com prompt injection) escrever fora da pasta ou mandar dados para a rede. O estilo Learning faz o Claude ensinar em vez de resolver.
2. **`/plugin marketplace add trailofbits/skills` e instalar só `static-analysis` e `differential-review`**, rodando junto com o `/security-review` que já vem no Claude Code.
   Motivo: é o que uma consultoria de auditoria usa de verdade (8.079 estrelas, bug real achado), é grátis, não exige conta, e ensina o método (contexto, diff, falso positivo) no próprio código do aluno. O Semgrep Guardian fica para depois porque exige conta e envia o código para o servidor da Semgrep.

---

## Frente 3: carreira em cibersegurança (do zero até trabalhar fora)

Pesquisa feita em 08/11/2026. Preços em dólar (US$), sem conversão. Onde a fonte não é oficial, aparece "(fonte não oficial)".

---

## 1. Funções de entrada: o que cada uma faz

| Função | O que faz no dia a dia | Salário júnior EUA | Fonte |
|---|---|---|---|
| Analista SOC N1 (Tier 1) | Faz a triagem de alertas num SIEM (Splunk, Sentinel) e lê logs de eventos do Windows | US$ 50–70 mil/ano. N2 em 1–2 anos: US$ 85–110 mil | [TryHackMe, 15/05/2026](https://tryhackme.com/resources/blog/best-entry-level-cyber-security-jobs-in-2026-what-they-pay-and-how-to-get-them) |
| Pentest júnior | Testa ataques em sites, redes e Active Directory e escreve o relatório | US$ 65–95 mil | mesma fonte |
| Analista GRC | Aplica normas (NIST CSF, ISO 27001) e cuida de conformidade e risco | US$ 60–80 mil | mesma fonte |
| Especialista de segurança de TI | Segurança somada ao trabalho de suporte ou de administração de sistemas | US$ 55–75 mil | mesma fonte |

- A mesma fonte recomenda começar pelo **SOC N1** e passar para pentest depois de **12 a 18 meses**.
- A matéria não fala de AppSec (segurança de aplicações). Quem já programa (Next.js) costuma chegar nela pelo caminho web: PortSwigger, item 3.
- No Brasil, o **SOC N1** é a porta de entrada e paga **R$ 4 mil a R$ 7 mil** ([Correio Braziliense](https://www.correiobraziliense.com.br/aqui/?p=30956); [JobRise 2026](https://jobrise.io/pt/blog/quanto-ganha-um-cybersecurity-analyst-2026/), fonte não oficial).
- Guia Canaltech 2026, "Analista de Segurança Júnior": percentil 25 = R$ 6,2 mil, mediana = R$ 8,1 mil, percentil 75 = R$ 10,4 mil ([Canaltech](https://canaltech.com.br/mercado/salario-de-r-19-mil-guia-mostra-as-profissoes-de-tecnologia-em-alta-em-2026/)).
- CAGED, CBO 2123-20, todos os níveis juntos: média de R$ 8.953/mês, mínimo de R$ 2.727 e máximo de R$ 16.292 ([salario.com.br](https://www.salario.com.br/profissao/analista-em-seguranca-da-informacao-cbo-212320)).

## 2. Certificados: preço e o que é gratuito

| Certificado | Preço 2026 | Gratuito? | Fonte |
|---|---|---|---|
| **ISC2 CC** | Prova: US$ 199. Taxa anual: US$ 50. São 100–125 questões em 2 h, e a aprovação é 700/1000 | **Não mais.** O programa gratuito (1MCC) parou de aceitar inscrições em **20/05/2026**. Quem já tem código pode fazer a prova até 31/12/2026 | [ISC2, abr/2026](https://www.isc2.org/Insights/2026/04/one-million-certified-cyber-conclusion); preço em [open-exam-prep](https://open-exam-prep.com/study-guides/isc2-cc/introduction/official-2026-cc-exam-facts) (fonte não oficial) |
| **CompTIA Security+** | Preço cheio de cerca de US$ 439 (subiu de US$ 425 em 2026). Revendedores: US$ 365–395. Cada tentativa paga outro voucher | Não. A versão SY0-801 sai por volta de 17/11/2026 | [CrucialExams](https://crucialexams.com/posts/blog/comptia-voucher-price-increase-2026); [HackerDNA](https://hackerdna.com/blog/security-plus-certification-cost) (fontes não oficiais) |
| **eJPT (INE)** | Cerca de US$ 249, com 1 nova tentativa. Validade de 180 dias. Prova nova de 31/03/2026: 45 questões, prática, em 48 h | Não | [HackerDNA](https://hackerdna.com/blog/ejpt-certification) (fonte não oficial); [INE](https://ine.com/security/certifications/ejpt-certification) |
| **Google Cybersecurity Certificate** (Coursera, 8 cursos, menos de 6 meses) | Assinatura de US$ 49/mês nos EUA. O preço muda por país | Sim, **com bolsa CIEE + Google**: 110 mil bolsas no ciclo 2026/2027, a partir de 16 anos, com Cibersegurança entre as 7 trilhas. O Coursera também tem auxílio financeiro | [Diário do Pará, 15/06/2026](https://diariodopara.com.br/concursos-e-empregos/google-e-ciee-oferecem-110-mil-bolsas-gratuitas-em-cursos-de-tecnologia-no-brasil/); [Google](https://grow.google/certificates/cybersecurity/) |
| **Cisco: Introduction to Cybersecurity + trilha Junior Cybersecurity Analyst** | Curso gratuito. A prova CCST Cybersecurity custa cerca de US$ 125 | Sim: o curso, o selo da Credly e a prova final da trilha (cerca de 120 h, ou 15 semanas a 8 h/semana) | [NetAcad](https://www.netacad.com/career-paths/cybersecurity); [itknowledgelab](https://itknowledgelab.com/blog/cisco-networking-academy-free-courses-digital-badges-guide-2026) (fonte não oficial) |
| **Hackers do Bem** (governo federal: MCTI + RNP + Senai-SP) | Gratuito. Nivelamento de 80 h (hardware, redes, lógica) e Básico de 64 h. Também tem níveis intermediário e especializado | Sim. Basta estar cursando ou ter concluído o ensino médio, sem limite de idade. Mais de 36 mil certificados. Em 2026: 25 mil vagas, com inscrição aberta em 12/09 | [Agência Gov, 01/10/2025](https://agenciagov.ebc.com.br/noticias/202510/programa-hackers-do-bem-abre-inscricoes-para-25-mil-novas-vagas-em-ciberseguranca); [Convergência Digital](https://convergenciadigital.com.br/seguranca/hackers-do-bem-abre-25-mil-novas-vagas-para-formacao-em-ciberseguranca-em-2026/) |

O que o mercado pede, segundo a pesquisa ISC2 com 929 gestores ([ISC2 Hiring Trends, jun/2025](https://www.isc2.org/Insights/2025/06/cybersecurity-hiring-trends-study)):
- O que pesa na contratação: **certificação, 47%**; experiência em TI, 44%; formação, 43%.
- **89%** dos gestores considerariam um candidato que só tem um certificado de entrada.
- **90%** considerariam um candidato que só tem experiência em TI, sem diploma.
- **84%** aplicam um teste prático aos candidatos júnior.
- Mais de 1/3 ainda pede, para vaga de entrada, certificados avançados (CISSP, CISM).

## 3. Sites de treino legais e gratuitos: por onde começar

Ordem recomendada pelas fontes: **Bandit → picoCTF → PortSwigger → Hack The Box** ([HackerDNA, guia de 2026](https://hackerdna.com/blog/overthewire-wargames-guide), fonte não oficial).

| Site | O que tem de graça | Começar por |
|---|---|---|
| [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) | Tudo. Entra por SSH, sem criar conta | Bandit nível 0, depois Natas (web) |
| [picoCTF](https://picoctf.org/) (desde 08/05/2026 se chama CyLab Security Academy, da Carnegie Mellon) | Tudo. Os desafios ficam abertos o ano inteiro e têm dicas | picoGym, desafios fáceis |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | Laboratórios de XSS, SQL injection e outros ataques web | "All labs", nível Apprentice. É o caminho para AppSec, perto do que ele já faz no site Next.js |
| [TryHackMe](https://tryhackme.com) | Centenas de salas, AttackBox 1 h/dia e as salas de introdução de cada trilha. O Premium custa cerca de US$ 14/mês | Salas gratuitas de Linux, redes e Windows ([TryHackMe](https://tryhackme.com/resources/blog/best-free-vs-paid-cybersecurity-learning-platforms-in-2026)) |
| [Hack The Box Academy](https://academy.hackthebox.com) | Pouca coisa grátis. O plano de estudante custa **US$ 10/mês desde 12/10/2026** e exige e-mail de faculdade | Só depois dos sites acima ([HTB, 03/09/2026](https://www.hackthebox.com/blog/new-academy-pricing)) |

## 4. Portfólio no GitHub (fontes são blogs de empresas de treino, não pesquisa)

- O que mais conta é prova de trabalho prático, não lista de cursos concluídos: writeup limpo de homelab, nota de resposta a incidente, regra de detecção testada ([TryHackMe](https://tryhackme.com/resources/blog/how-to-build-a-cybersecurity-portfolio-that-gets-you-hired)).
- Repositórios sugeridos: `/tryhackme-writeups`, `/homelab-scripts`, `/security-tools`. O GitHub também serve para guardar regras Sigma, detecções em YAML e scripts ([ITU Online](https://www.ituonline.com/blogs/how-to-build-a-strong-cybersecurity-portfolio-for-job-interviews/)).
- Homelab de SOC: instalar um SIEM gratuito (Wazuh ou Elastic), mandar os logs para ele, simular força bruta e detectar o ataque.
- Writeup bom explica como achou a falha, qual o impacto e como corrigir, e não só "consegui root". Comece com um resumo curto.
- Os números que circulam, como "78% dos recrutadores olham o GitHub", **não foram confirmados**. Não usar.

## 5. Trabalhar fora

**Inglês**
- Linguaskill: **B2 = 160–179** e **C1 = 180+** ([Cambridge](https://www.cambridgeenglish.org/exams-and-tests/linguaskill/results/)).
- O Opportunity Card da Alemanha pede **inglês B2** (ou alemão A1) ([mygermanuniversity](https://www.mygermanuniversity.com/articles/opportunity-card-requirements), fonte não oficial).
- Na pesquisa TechFX, brasileiros com inglês avançado ganham **67% a mais** do que os de nível intermediário em vagas estrangeiras ([Revista Oeste](https://revistaoeste.com/economia/real-fraco-e-dominio-do-ingles-empurram-brasileiros-para-empresas-estrangeiras/)).

**Remoto, morando no Brasil**
- Contratações de brasileiros por empresas estrangeiras: **+46% em um ano**, segundo a Deel ([Olhar Digital](https://olhardigital.com.br/2024/11/28/pro/quer-receber-em-dolar-ou-em-euro-conheca-4-plataformas-de-trabalhos-remotos-no-exterior/)).
- **85,5%** dessas contratações são de empresas dos EUA (TechFX, [Revista Oeste](https://revistaoeste.com/economia/real-fraco-e-dominio-do-ingles-empurram-brasileiros-para-empresas-estrangeiras/)).
- A maioria trabalha como PJ ou MEI.
- Não há dado específico de segurança da informação: a maioria dos contratados é de desenvolvedores e analistas de dados.

**Visto**
- Alemanha, **EU Blue Card de TI sem diploma**: pede **3 anos de experiência em TI nos últimos 7** e salário de pelo menos **€ 45.934/ano** em 2026, sem exigir alemão.
- Alemanha, rota alternativa **§19c**: 2 anos de experiência mais qualificação profissional reconhecida ([msingermany](https://msingermany.com/blog/germany-it-visa-without-degree-2026), fonte não oficial; conferir na [Make it in Germany](https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card)).
- Portugal: o visto de procura de trabalho mudou em 2025–2026. As fontes divergem: uma diz que foi suspenso, outra que virou um visto para "altamente qualificado" com 120 dias para achar emprego ([Expat.com](https://www.expat.com/en/expat-mag/12115-portugal-tightens-immigration-work-seeker-visa-abolished.html)). Conferir na AIMA ou no consulado.

**Salário júnior: Brasil e fora**

| Lugar | Faixa júnior / SOC de entrada | Fonte |
|---|---|---|
| Brasil | R$ 4–7 mil/mês (SOC N1) | item 1 |
| EUA | US$ 50–70 mil/ano (SOC N1). Mediana de todos os níveis: **US$ 129.180** (maio/2025). Crescimento previsto de **21%** entre 2025 e 2035. Formação típica: bacharelado | [BLS](https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm) |
| Alemanha | € 45–60 mil/ano bruto (T1) | [Optima Europe](https://www.optimaeurope.com/recruitment-blog/soc-analyst-salary-benchmark-europe) (fonte não oficial) |
| Holanda | € 45–62 mil/ano bruto (T1) | mesma fonte |
| Europa em geral | € 35–55 mil/ano bruto | [Readynez](https://www.readynez.com/en/blog/cyber-security-salaries-2026-uk-europe-and-us-compared/) (fonte não oficial) |

## 6. Faculdade: precisa?

- **Não é obrigatória para o 1º emprego.** 89% dos gestores aceitam só certificado e 90% aceitam só experiência em TI ([ISC2](https://www.isc2.org/Insights/2025/06/cybersecurity-hiring-trends-study)).
- **Ajuda a sair do país.** O BLS lista bacharelado como formação típica nos EUA. Na Alemanha, sem diploma, o visto exige 3 anos de experiência (item 5). Estágio no Brasil exige matrícula em curso.
- **No Brasil, de graça: Fatec, Tecnologia em Segurança da Informação** (Americana, Araraquara, Ourinhos, Santana de Parnaíba e São Caetano do Sul). A nota do ENEM 2023–2025 complementa a nota do vestibular. As inscrições para o 1º semestre de 2027 fecharam em 06/11/2026. A próxima chance é o vestibular do 2º semestre de 2027 ([pebsp](https://www.pebsp.com/os-ataques-ciberneticos-triplicaram-no-brasil-e-o-mercado-carece-de-profissionais-fatec-tem-inscricoes-abertas-para-cursos-na-area/); oficial: [vestibular.fatec.sp.gov.br](https://vestibular.fatec.sp.gov.br)).
- **Outras vias com a nota do ENEM:** SiSU (federais), ProUni (bolsa em particular) e FIES. Não pesquisei vagas específicas de segurança nesta frente.
- **Alemanha:**
  - Universidade pública sem mensalidade. Paga só a taxa de semestre de € 150–350 (Baden-Württemberg cobra € 1.500/semestre de quem é de fora da UE) ([GradGermany](https://www.gradgermany.com/study-in-germany-from-brazil), fonte não oficial).
  - Quem tem só o ensino médio brasileiro precisa de um destes: **Studienkolleg** (6–12 meses), Studienbrücke ou **2 semestres de faculdade no Brasil** ([Goethe-Institut](https://www.goethe.de/ins/co/de/m/spr/sid.html)).
  - Conta bloqueada de cerca de **€ 11.904/ano** (fonte não oficial).
  - Regras oficiais: [uni-assist, Brasil](https://www.uni-assist.de/tools/laenderhinweise/laenderdetails/country/br/).

## 7. Tempo realista até o 1º emprego

- **Sem base de TI: 12 a 18 meses** estudando 10–15 h por semana. **Com base de TI: 4 a 8 meses** ([TryHackMe, 10/04/2026](https://tryhackme.com/resources/blog/how-long-does-it-take-to-get-a-job-in-cyber-security), fonte de empresa de treino, não pesquisa).
- Depois de contratado, um júnior leva **4 a 9 meses** para trabalhar sozinho (56% dos gestores, [ISC2](https://www.isc2.org/Insights/2025/06/cybersecurity-hiring-trends-study)).
- Não achei pesquisa de 2025 que mediu esse tempo de verdade. Os números acima são estimativas.

---

## Rota em 5 passos (dez/2026 → 2028)

1. **Dez/2026–jan/2027: base de graça + vaga de faculdade.**
   - Fazer o Nivelamento do Hackers do Bem (80 h) e o Bandit até o nível 10.
   - Em jan/2027, usar a nota do ENEM 2026 no SiSU/ProUni para um curso de TI ou Segurança. Fazer o Linguaskill buscando **160+ (B2)**.
   - Primeiro clique: **hackersdobem.org.br → "Inscreva-se"**. Se estiver fechado: **overthewire.org/wargames/bandit/bandit0.html**.

2. **Fev–jun/2027: primeiro certificado gratuito + GitHub.**
   - Fazer a trilha Junior Cybersecurity Analyst da Cisco (cerca de 120 h, selo gratuito) e as salas gratuitas do TryHackMe.
   - Escrever 1 writeup por semana num repositório público.
   - Primeiro clique: **netacad.com → buscar "Introduction to Cybersecurity" → Enroll**. Depois: **github.com/new → repositório "writeups"**.

3. **Jul–dez/2027: lado web, que já é a praia dele.**
   - Fazer os laboratórios Apprentice da PortSwigger e aplicar o que aprendeu ao próprio site Next.js.
   - Pedir a bolsa CIEE + Google de Cibersegurança.
   - Se não entrou numa faculdade em jan/2027: vestibular Fatec Segurança da Informação, 2º semestre de 2027.
   - Primeiro clique: **portswigger.net/web-security/all-labs**.

4. **2028, 1º semestre: homelab de SOC + estágio.**
   - Montar Wazuh numa máquina virtual, simular força bruta e publicar a regra de detecção no GitHub.
   - Mandar currículo para estágio ou vaga de SOC N1 (R$ 4–7 mil).
   - Pagar a 1ª prova (CC, US$ 199) só se sobrar dinheiro.
   - Primeiro clique: **documentation.wazuh.com → "Quickstart"**.

5. **2028 em diante: experiência que conta para sair do país.**
   - Contar os 36 meses de experiência em TI que o Blue Card alemão pede sem diploma, ou terminar a faculdade.
   - Subir o inglês para **180+ (C1)**.
   - Mirar remoto para empresa dos EUA (85,5% das contratações) ou Blue Card (€ 45.934/ano).
   - Primeiro clique: **LinkedIn Vagas → "SOC analyst" + filtro "Remoto" + "Nível de entrada"**.
