---
name: combinar-skills
description: "A ordem das skills e agentes do PrepEnem: o ritual de abertura de toda tarefa (listar, perguntar se falta skill), a cadeia de cada tipo de frente (tela, conteúdo de IA, banco, bug, ideia, commit) e o fecho. Usar na abertura de TODA tarefa, logo antes da primeira ferramenta, e de novo no fecho."
---

# Combinar skills

O `CLAUDE.md` diz **quando** chamar cada skill. Esta diz **qual vem antes de
qual**. Veio do logica-app, onde a falha medida foi esta: frente com 18 skills
disponíveis, **4 carregadas**, e uma delas depois da decisão que ela existia
para tomar (02/09/2026). Anunciar não é usar.

## A abertura de toda tarefa, nesta ordem

1. **Listar** as skills e agentes deste projeto que se aplicam. Se nenhum,
   dizer "nenhum". Silêncio é indistinguível de não ter olhado.
2. **Responder em voz alta: falta skill?** Mesmo quando a resposta é não.
   - Tarefa recorrente E com procedimento não óbvio → `desenhar-skill` →
     `write-a-skill` (ou `skill-creator`) → `ln-162-skill-reviewer`.
   - Qualquer outro caso → é **uma linha** numa skill que já existe. No
     logica-app, 26 de 27 commits em skills foram linha, não skill nova.
3. **Carregar cada skill no instante ANTES do trabalho que ela governa**, não
   na abertura. Carregada cedo, ela já saiu do foco quando o trabalho chega.
4. `token-economy` não é etapa: vale dentro de todas.

## As cadeias

| Frente | Cadeia, na ordem |
|---|---|
| **tela / design** | `decisoes-prepenem` → `montar-referencia` (medir a tela equivalente lá fora e a nossa) → `perguntar-ao-pablo` (2 opções numa página `Artifact`) → `animation-system` se tiver movimento → implementar → agente `design-system-auditor` → `chamar-revisor` (inspetor-visual?) → `explicar-ao-pablo` |
| **conteúdo de IA** (explicação, flashcard) | `decisoes-prepenem` → `flashcard-pattern` se for card → mudar o prompt → rodar contra 3 questões reais e ler a saída → `scripts/jornada-do-aluno.mts` + agente `aluno-do-zero` (onde quem nunca viu o assunto se perde) → `explicar-ao-pablo`. Material escrito à mão (aula, cartão, questão com gabarito): agente `revisor-de-fatos` antes de entregar |
| **banco / script de dados** | `prisma-neon-safety` → agente `db-inspector` → rodar → conferir a contagem depois |
| **bug** | `verificacao-local` (reproduzir no navegador antes de acreditar no código) → corrigir → agente `build-guard` |
| **lento / fps / travando** | `medir-fluidez` (medir no build, eliminar um suspeito por vez) → `animation-system` → corrigir → medir de novo → agente `build-guard` |
| **briefing longo do Pablo** | `briefing-longo` primeiro, depois a cadeia do tipo |
| **"o que a gente faz agora?"** | `inventar-daqui` → `garimpar-da-web` se a ideia é de fora → `perguntar-ao-pablo` |
| **"pesquisa e vê se dá"** | `garimpar-da-web` → `inventar-daqui` |
| **frente com mais de 2 arquivos** | `distribuir-trabalho` antes de abrir o primeiro |
| **commit** | agente `build-guard` → `chamar-revisor` (revisor-adversarial? só mecanismo novo, auth ou script que grava no Neon) → `vercel-deploy-checklist` → commit (push é do Pablo) → validar em produção |
| **fechar qualquer frente** | `auditar-o-repertorio` (o que ficou FALSO) + `inventar-daqui` (o que ficou VERDADEIRO) → `explicar-ao-pablo` |

## Design: por que as skills globais ficam fora

Há dezenas de skills globais de design (`frontend-design`,
`design-taste-frontend`, `high-end-visual-design`, `ui-ux-pro-max`...). Todas
trazem uma direção própria. **O PrepEnem já tem a dele, fechada em 05/08/2026:**
editorial, teal Clareza, Fraunces + Source Serif 4 + DM Sans, tokens em
`app/globals.css`, régua no painel `/design-system`. Global de design entra só
para pesquisa de referência, nunca para escolher estilo. Seguir uma delas é
desfazer o redesign sem perceber.

A ordem dentro da cadeia de tela importa: o `design-system-auditor` é barato e
devolve tabela com número (contraste, raio, transição); o `inspetor-visual`
custa caro e olha composição. O barato vem primeiro, sempre.

## As cadeias que parecem certas e estão erradas

- **`inventar-daqui` → `desenhar-skill`** não é o normal, é a exceção. O normal
  é `inventar-daqui` → uma linha.
- **Chamar os revisores todos "por segurança".** Revisor custa ~66 mil tokens
  (medido no logica-app). `chamar-revisor` decide antes.
- **Implementar tela e mostrar depois.** O Pablo decide o que vê. A opção
  desenhada vem antes do código, não depois.

## Como provar que a cadeia foi usada

Na mensagem final, uma linha: qual cadeia foi seguida e onde foi quebrada de
propósito. Sem essa linha, a frente parece ter lembrado das skills no fim.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
