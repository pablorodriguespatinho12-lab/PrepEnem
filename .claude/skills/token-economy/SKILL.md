---
name: token-economy
description: "Use no início de qualquer tarefa que envolva explorar o codebase, ler múltiplos arquivos, ou rodar operações longas."
---

# Economia de Tokens neste projeto

- **Fork para AMPLITUDE, fique inline para PROFUNDIDADE.** Buscar/escanear/
  descobrir onde algo está → delegue a um subagent (ex.: `Explore`, ou os
  subagents deste projeto como `db-inspector`/`build-guard`). Raciocinar
  sobre uma decisão de arquitetura, ou decidir o que fazer com o que foi
  encontrado → mantenha inline, no contexto principal.
- **Grep/Glob antes de Read.** Nunca abra um arquivo inteiro só para achar
  uma função ou padrão — localize a linha/trecho primeiro.
- **offset/limit em arquivos grandes.** Ler um arquivo de centenas de linhas
  por completo quando só uma seção importa desperdiça contexto.
- **Não releia arquivos já vistos nesta sessão.** Se o conteúdo já está no
  contexto, use-o — releitura só depois de uma Edit própria não é necessária
  (o harness já reflete o estado atual).
- **Subagents recebem tarefa fechada, devolvem só o resultado.** Não peça
  para um subagent "narrar o processo" — peça o achado final. Isso mantém
  o contexto principal limpo para as decisões que realmente importam.
- **Avise antes de tarefas longas.** Se a próxima etapa vai gerar muita
  exploração (ex.: rodar seeds grandes, ler múltiplos seeds de flashcards),
  avise que pode valer rodar `/compact` antes de prosseguir.

## Medido neste repo (2026-08-04)

Números reais, não estimativa — cada item abaixo custou tokens de verdade
numa sessão e é evitável.

- **`git log --oneline` é armadilha AQUI.** As mensagens de commit deste
  repo têm corpo longo, e o `--oneline` achata tudo numa linha só em vez de
  cortar: um `git log --oneline -6` despejou ~4.000 tokens de corpo de
  commit. Use sempre truncado:

  ```bash
  git log --format='%h %<(72,trunc)%s' -10
  ```

- **`git diff --stat` antes de `git diff`.** Confirme quais arquivos e
  quantas linhas antes de puxar o conteúdo inteiro. Num commit de 13
  arquivos, o `--stat` custa ~150 tokens e o diff completo ~8.000.

- **Rota de API grande: grep antes de Read.** `app/api/pdf-process/route.ts`
  tem 344 linhas. Ler inteiro para alterar 2 trechos é desperdício — ache com
  `grep -n` e leia com `offset`/`limit`.

- **Subagent devolve o achado, não a narração.** Um prompt de `build-guard`
  que pede "reporte só os erros" volta com `Build OK` (~2 tokens). O mesmo
  build narrado volta com ~2.000. Vale para todos os subagents deste projeto.

- **Verificação no navegador tem custo de descoberta.** Autenticar o
  Playwright localmente custou ~8 chamadas de ferramenta só para redescobrir
  o formato do cookie do NextAuth. Isso agora está em
  [[verificacao-local]] — leia de lá em vez de redescobrir.

- **Build em segundo plano: a notificação mente.** `npm run build > log; echo $?`
  termina com o `echo`, e o "exit 0" é dele. Leia a linha de saída que o
  próprio comando imprime, ou procure `Compiled successfully` no log
  (logica-app, 26/09/2026: dois commits entraram com a cadeia parada assim).

- **Subagente custa por CHAMADA, não por pedido.** Medido no logica-app
  (28/08/2026): 130 mil tokens em 32 chamadas e 142 mil em 24, com pedido de 2
  mil. Cole no pedido o que ele iria buscar. E **continuar um agente vivo com
  `SendMessage` é mais barato que abrir outro** — o novo começa frio e relê tudo.

- **Contexto curto: não comece frente nova.** Feche a aberta — build, commit
  do que está pronto, uma linha do que faltou. Frente pela metade com contexto
  no fim vira trabalho refeito.

- **O maior dreno não é resolvível por skill.** As regras `ecc` em
  `~/.claude/rules/ecc/` carregam ~9.900 tokens em TODA sessão
  (`web/` + `common/` + `README.md`), e injeções por linguagem chegaram a
  ~15.000 numa única sessão — incluindo `arkts/` (HarmonyOS, stack que este
  projeto não usa) a ~6.100 tokens sozinho. Nenhuma instrução compensa isso;
  é decisão de arquivo em disco, no escopo global do usuário.

## Ideias da web (24/11/2026, conferidas só como leitura; % dos autores NÃO provado aqui)
Fontes: dev.to "9 ways to cut token consumption", alexgreensh/token-optimizer, JuliusBrussee/caveman.
- **Medido aqui:** carga fixa por sessão ≈ 19 KB (~5 mil tokens: 2 CLAUDE.md, licoes, MEMORY.md). `decisoes-prepenem` tem 52 KB (~13 mil tokens) por carga: só carregar quando mexer em UI/IA/taxonomia; candidata a dividir em arquivos de `references/` lidos sob demanda.
- Caveman (resposta curta): o autor diz -65% de SAÍDA, mas só ~4% da sessão inteira (leitura de arquivo e agente pesam mais). O estilo TDAH do Pablo já faz isso: não instalar.
- Filtrar saída longa antes de ler: `| tail -20`, `| grep -c`, `--seco`; nunca despejar log de build/teste inteiro.
- `/context` mostra quem ocupa espaço; `/usage` antes e depois de lote grande.
- Lote repetido (módulos v2): colar no pedido do agente o que ele iria buscar e reusar o agente com `SendMessage`.

## Medido na frente "nível acima v2" (24/11/2026, 16 agentes, contado por comando)
Total dos agentes: **2 282 548 tokens**. Por tarefa (tokens do agente, vindos do aviso de término):
- Chamada mínima de um agente (explorador, 1 `ls`): **20 mil**. Todo agente novo paga esse arranque; por isso lote pequeno de 1 tarefa não compensa.
- Aluno-do-zero lendo (rodada 2): **14,2 mil por questão** (56 questões = 793 mil).
- Gabarito às cegas: **8,6 mil por questão** (16 questões = 138 mil). Mais barato que o aluno e acha o que mais importa (resposta errada): rodar ANTES.
- Corrigir módulo (executor): 107 a 159 mil. Desenhos: 152 a 189 mil por 7 a 8 desenhos.
- Conserto de 1 a 3 linhas (juntar passos de com-00b e ter-00d, tabela de gra-00a): fiz inline com 2 a 3 chamadas, bem abaixo de 100 mil. **Regra: até ~5 linhas em 1 arquivo, inline; agente só para o que passa disso.**

Regras que saem dos números:
1. Ordem da conferência, do mais barato ao mais caro: `--seco` + `vitest` (segundos) → gabarito às cegas (8,6 mil/q) → aluno-do-zero (14 mil/q) → revisor-de-fatos. Não pular para o caro quando o barato ainda acha defeito.
2. Um agente por arquivo escrito (`diagramas-acima-*.tsx`, módulos `v2/*.py`): 3 agentes em paralelo no mesmo `.tsx` quebrariam. Registrar nomes/stubs ANTES de abrir os agentes (feito com 23 nomes de desenho).
3. Regravar o JSON e testar UMA vez por leva (`montar_v2.py` sem `--seco` só no coordenador), não por agente.
4. Esperar agente: não usar laço `sleep` no terminal (o Pablo barrou, 24/11); o aviso de término chega sozinho.
5. Build: rodar em segundo plano com `> log` e ler só `grep "Compiled|Failed|FIM"` do log.
6. Guarda do banco lê o TEXTO do comando: `git add -u` em vez de listar `scripts/...`.
7. Pablo pediu (24/11) usar esta skill SEMPRE: abrir toda tarefa carregando-a e escrevendo o plano com quem faz cada parte.

8. **Ao orquestrar agentes (Pablo, 24/11/2026: "quando for orquestrar seus agentes, economiza tokens")**: (a) menos agentes, cada um com mais trabalho: 4 executores de ~100 mil cada pagam 4 arranques de 20 mil; (b) escolher o modelo mais barato que dá conta (conserto de texto: `model: "sonnet"`; só ler: `explorador`/Haiku); (c) colar no pedido o trecho exato do relatório, não mandar o agente reler; (d) resposta pedida em ≤10 linhas; (e) 1 agente que já leu os arquivos continua com `SendMessage` em vez de abrir outro; (f) coordenador não relê o que o agente editou: roda `--seco` + `vitest` e olha só o resumo.

9. **Medido na frente "lousa visual" (24/11/2026):** gerador novo (3 arquivos, 443 lousas) feito INLINE, sem agente: raciocínio em sequência com teste a cada passo. Conferência: foto de 2 aulas reais por mim achou 4 defeitos que 64 testes não pegaram; `aluno-do-zero` em 2 aulas (fotos + fala) custou **45,7 mil tokens, 23 chamadas, 55 s** e achou 3 defeitos do gerador (legenda longe da peça, pista só na fala, fórmula sem legenda) e ~8 lacunas do texto de origem. Ordem barata: `vitest` → minha foto de 2 aulas → 1 aluno-do-zero com 2 aulas (não 1 por aula).

Não provado ainda: o ganho do plugin caveman (`/usage` antes e depois, ver memória `teste-caveman-plugin`); a economia em % dos blogs não vale aqui.
