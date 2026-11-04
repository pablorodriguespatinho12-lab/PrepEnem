# Plano: revisão final do ENEM (pedido do Pablo, 03/11/2026)

Prova por volta de 06/11/2026. Sobram 3 dias: tudo aqui é para ser usado
ANTES da prova, então vale o que fica pronto rápido e não derruba o site.

## O que o Pablo pediu (palavras dele, resumidas)

1. **Checklist do que mais cai**, de todas as matérias, cobrindo ~70% da
   prova, tirado da análise de todas as provas do INEP. Pode baixar as provas
   (ele deu permissão); se não der, ele baixa e manda.
2. **Flashcards** desses conteúdos no site.
3. **Uma prova em cima disso**, para fazer dias antes do ENEM.
4. **Trocar os níveis do site** para 4:
   - **Fácil**: pergunta direta e curta ("O que é X?"), 5 alternativas.
   - **Médio**: com um texto um pouco maior.
   - **Difícil**: texto maior, no jeito do ENEM, mas não é questão real.
   - **ENEM**: só questão real do ENEM.
   Hoje "Difícil" pode trazer questão do ENEM e "ENEM" é uma etapa à parte;
   ele quer que ENEM seja o próprio nível e os outros três nunca tenham
   questão real.

## Fontes para "o que mais cai" (em ordem)

1. **Microdados do INEP** (`ITENS_PROVA_<ano>.csv`, 2009 a 2024): cada
   questão tem área, habilidade (H1 a H30) e o parâmetro B da TRI
   (dificuldade real). Dá a contagem por habilidade em todos os anos sem
   precisar ler PDF. Baixar com a lição de [[inep-download-tls]].
2. **Texto das questões** para dar nome de conteúdo (habilidade é jargão;
   a taxonomia do site usa nome de conteúdo, ver `decisoes-prepenem`):
   - conferir se a API aberta enem.dev ainda tem 2009–2023 em texto;
   - as 381 reais do banco (2021: 149, 2022: 152, 2023: 80) já têm `tema`.
   PDF do INEP NÃO serve para extrair texto (fonte codificada).
3. Classificar cada questão no `tema` de `lib/tema-taxonomy.ts`, contar por
   matéria e cortar onde a soma passa de 70% da prova.
   Classificar em lote com IA gasta cota: fazer com o Claude da sessão
   (não com a Groq/Gemini do site, ver [[enem-proximo]]).

## Entregas, em ordem

| Dia | Entrega | Onde |
|---|---|---|
| 03/11 | Checklist por matéria, com % de quanto cai e caixinha de marcar | Artifact (abre no celular) |
| 03/11 | 4 níveis: Fácil, Médio, Difícil, ENEM | site |
| 04/11 | Baralho "O que mais cai", um por matéria, escrito à mão | site (seed) |
| 04/11 | Prova "Revisão final": questões REAIS dos temas do checklist | site (Treino) |
| 05/11 | Só estudo. Nada de mudança no site. | — |

### Checklist
- Por matéria: tema, quanto cai (% das questões da área), 1 linha do que
  saber. Ordem: o que mais cai primeiro.
- Caixinha de marcar que lembra (estado guardado no artifact, não só no
  navegador).
- Fonte e anos usados no rodapé. Nada de % sem conta feita.

### Os 4 níveis (site)
- Campo `dificuldade` continua `facil | medio | dificil`; **ENEM sai da
  origem** (`isQuestaoEnem` em `lib/treino-etapas.ts`). Nível mostrado =
  ENEM se for real, senão a dificuldade. Real nunca aparece como fácil,
  médio ou difícil.
- Escada do treino: Fácil → Médio → Difícil → ENEM (era Base →
  Intermediária → ENEM). Em 10: 2 fáceis, 3 médias, 2 difíceis, 3 ENEM.
- Onde mexer: `lib/treino-etapas.ts` (Etapa, rótulos, cotas),
  `app/banco-questoes/page.tsx` (filtro), `app/api/simulado/generate`,
  `lib/questoes-geradas.ts` e `lib/treino-degraus.ts` (o que a IA gera em
  cada nível: fácil = pergunta curta "o que é"; médio = texto de 3 a 5
  linhas; difícil = texto longo estilo ENEM), `app/admin/questoes`.
- Mudar prompt de geração zera o cache (ver `decisoes-prepenem`): aceitável.
- Banco: questão não real marcada `dificil` hoje (157 no total, conferir
  quantas são reais) — as reais passam a ser mostradas como ENEM só pela
  origem, sem escrever no Neon. Escrever no Neon só com `prisma-neon-safety`.
- Teste: `grep` dos rótulos antigos ("Base", "Intermediária") em
  components/lib/tests (ver [[rotulo-tambem-e-logica]]) e o e2e do treino.

### Baralho "O que mais cai"
- Um fato por cartão (`flashcard-pattern`), escrito à mão pelo Claude a
  partir do checklist, sem IA do site. Seed novo no padrão de
  `scripts/seed-coringas-redacao.ts` (só cria/atualiza os próprios).

### Prova "Revisão final"
- Só questões reais do banco dos temas do topo do checklist, uma ou duas
  por tema, ordem fácil → ENEM. Sem IA (não gasta cota). Entra como
  caminho no topo de `/provas` ou como prova pronta já criada.

## Regras desta frente
- Nada de rodada de IA em lote no site até a prova ([[enem-proximo]]).
- Commit ao fim de cada entrega, push é do Pablo.
- Visual: olhar o print antes de entregar.
