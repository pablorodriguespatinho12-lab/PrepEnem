# Agentes, orquestração e economia de token (26/11/2026)

## Medido nesta máquina (transcrições dos últimos 7 dias, 272 arquivos)

| O quê | Número |
|---|---|
| Parcela do gasto na conversa principal (Sonnet) | 62,6% |
| Agentes Sonnet / Haiku | 30,0% / 7,1% |
| Opus (0,3% do gasto) | 8 chamadas |
| Conversa principal: contexto mediano por chamada | 201 mil tokens |
| Conversa principal: 1 em cada 10 chamadas passa de | 553 mil |
| Contexto enviado que está acima de 200 mil (principal) | 38,4% |
| Agentes: contexto mediano | 105 mil |

Parcelas usam pesos de preço **supostos** por mim (Opus 2,5x, Haiku 0,33x do Sonnet; saída 5x; cache lido 0,1x): são estimativa. Os tamanhos de contexto são contagem direta. 38,4% é teto: compactar também custa, e o ganho líquido não foi medido.

## Veredito

| Ideia | Fonte | Decisão | Motivo |
|---|---|---|---|
| `/autocompact 200k` | docs oficiais (settings, `autoCompactWindow`) | **Adotar já** | ataca o maior gasto medido; desfaz com `/autocompact auto` |
| Modo plano para tarefa média (usa o `opusplan` já ligado) | docs model-config | **Adotar** | Opus quase não foi usado em 7 dias |
| `advisor` (`/advisor opus`): Opus consultado no meio da tarefa | docs advisor (experimental) | Testar depois do autocompact | recebe a conversa inteira: com contexto grande, cada consulta é cara |
| Agente `escritor` (aula, questão, redação-modelo) | falha repetida nas lições | **Feito** | escrita hoje roda na conversa principal, a parte mais cara |
| `memory: project` em quem escreve e confere fato | docs sub-agents | **Feito** (`escritor`, `revisor-de-fatos`) | aprendizado entre sessões, recurso oficial |
| Memória no `aluno-do-zero` e no `revisor-adversarial` | idem | Não | o iniciante deixaria de saber zero; o revisor perderia o contexto limpo |
| Lista de vícios de texto de IA, de `blader/humanizer` (73,9 mil estrelas, MIT; teste cego 16/16 é do autor, em inglês) | README e SKILL.md | **Copiar a ideia** (6 itens no `escritor`) | skill inteira tem 33 KB por carga e é em inglês |
| CodeGraph (78,8 mil estrelas, MIT): grafo do código | README | Testar depois | autor: 62% menos token em 7 repos (não provado aqui); o próprio README avisa que ocupa **mais** contexto; tem telemetria (`codegraph telemetry off`); o app tem 46 mil linhas |
| codebase-memory-mcp (49,2 mil), graphify (153,8 mil), Understand-Anything (94,6 mil) | README | Reserva | mesma função; Understand-Anything avisa que a 1ª análise gasta muito token |
| archify (100,5 mil): diagramas | busca | Quando precisar de diagrama | não economiza token |
| Agent teams (times que conversam entre si) | docs costs | Não agora | oficial: cerca de 7x mais token em modo plano; experimental |
| oh-my-claudecode, orca, wshobson/agents (199 agentes), VoltAgent (100+) | README | Não instalar; catálogo para consultar | o time atual cobre os papéis; cada agente e skill a mais pesa na carga fixa |
| `self-learning-skills` (924 estrelas) | README | Copiar a ideia: gravar o **caminho que deu certo**, não só o erro | `aprender-com-erro` já cobre o erro |
| `claude-devtools` (4 mil): ver gasto por agente | busca | Opcional | o script desta pesquisa já responde |
| token-optimizer | memória 24/11 | Continua esperando o teste do caveman | |

## Time (nenhum agente a mais além do escritor)

| Papel | Agente | Modelo |
|---|---|---|
| Planejar e decidir caro | `pensador` ou modo plano | Opus |
| Escrever material de estudo | `escritor` (novo) | Sonnet |
| Programar | `executor` | Sonnet |
| Buscar | `explorador` | Haiku |
| Conferir | `revisor-de-fatos`, `aluno-do-zero`, `build-guard`, `db-inspector` | como estão |
| Revisar mudança arriscada | `revisor-adversarial`, `inspetor-visual`, `design-system-auditor` | Sonnet |

## Pendente
- `decisoes-prepenem` tem 52 KB por carga; a doc oficial pede `SKILL.md` com menos de 500 linhas: dividir em arquivos lidos sob demanda.
- `combinar-skills` manda carregar várias skills; em 7 dias `explicar-ao-pablo` foi chamada 1 vez apesar de "toda mensagem": virar gancho ou sair da regra.
- Medir 7 dias depois do autocompact, com o mesmo cálculo.

## Limites desta pesquisa
Li trechos de README e 5 páginas de docs oficiais (parte resumida por modelo). Não instalei nem rodei nenhuma ferramenta de terceiro. Busca: 12 termos no GitHub, repositórios com atividade desde 06/2026.

## Fontes
- https://code.claude.com/docs/en/costs , /model-config , /sub-agents , /agent-teams , /skills , /advisor , /settings
- https://github.com/colbymchenry/codegraph , /blader/humanizer , /Graphify-Labs/graphify , /Egonex-AI/Understand-Anything , /DeusData/codebase-memory-mcp , /Yeachan-Heo/oh-my-claudecode , /wshobson/agents , /Kulaxyz/self-learning-skills
