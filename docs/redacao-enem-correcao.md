# Correção da redação do ENEM — referência do corretor do PrepEnem

Pesquisa de 05/10/2026 nos documentos oficiais do INEP. É a régua que
`lib/redacao/grade.ts` e `lib/redacao/prompts.ts` implementam. Ao mudar a
correção, mude aqui primeiro.

**Fontes oficiais (INEP):**
- Manuais de correção por competência ("Grade Específica", versão 2020, ainda
  listados como vigentes): `download.inep.gov.br/educacao_basica/enem/downloads/2020/Competencia_1.pdf`
  (trocar 1 por 2–5) e `.../2020/Situacoes_nota_zero.pdf`.
- Cartilhas do Participante 2024, 2025 e 2026 (a de 2026 publicada em set/2026),
  em gov.br/inep → Enem → Outros documentos.

## As 5 competências (0–200, em passos de 40)

Regra geral do manual: texto com características de dois níveis fica no **de baixo**.

### C1 — norma escrita formal
| Nível | Estrutura sintática | Desvios |
|---|---|---|
| 200 | excelente (no máximo 1 falha) | no máximo 2 |
| 160 | boa | poucos |
| 120 | regular | alguns |
| 80 | deficitária **ou** | muitos |
| 40 | deficitária **e** | muitos |
| 0 | inexistente | — |

"Poucos/alguns/muitos" não têm número oficial. O PrepEnem usa faixas
aproximadas (≤5 / ≤9 / ≤14 / mais), marcadas como aproximação no código.

### C2 — tema, tipo textual, repertório
- 0: fuga ao tema ou outro tipo textual (anula a redação).
- 40: tangencia o tema; ou traços constantes de outro tipo textual.
- 80: tema completo, mas 2 das 3 partes embrionárias; ou conclusão incompleta; ou muita cópia dos motivadores (cópia trava em 80).
- 120: no máximo 1 parte embrionária; repertório só dos motivadores, ou não legitimado, ou não pertinente.
- 160: nenhuma parte embrionária; repertório legitimado e pertinente, uso **improdutivo**.
- 200: o mesmo, com uso **produtivo**.
- Tangenciar trava C2, C3 e C5 em 40.

**Repertório:** legitimado = tem respaldo numa área do conhecimento (conceito,
fato histórico, autor, obra, lei, pesquisa); dado tirado dos textos motivadores
não conta. Pertinente = ligado a algum elemento do tema. Produtivo = articulado à
discussão. "Repertório de bolso" (citação decorada que daria para trocar por
outra sem mudar o sentido) é improdutivo: no máximo 160.

### C3 — projeto de texto
- 200: projeto estratégico, todas as ideias desenvolvidas (deslizes pontuais aceitos).
- 160: poucas falhas, a maior parte desenvolvida.
- 120: algumas falhas, algumas ideias desenvolvidas.
- 80: muitas falhas, uma ou nenhuma ideia desenvolvida. Contradição grave trava aqui.
- 40: tangente com direção, ou tema completo sem direção.
- O que mais derruba: informação solta, sem explicação, que deixa a ligação para o leitor.

### C4 — coesão
- 200: presença expressiva; ≥2 operadores **entre** parágrafos e ≥1 coesivo **dentro** de cada parágrafo; repetições raras; **nenhuma** inadequação.
- 160: presença constante; ≥1 operador entre parágrafos; poucas repetições/inadequações.
- 120: presença regular. 80: pontual (texto em um parágrafo só trava aqui). 40: rara.
- Um conectivo com relação de sentido errada já impede o 200. Conectivo artificial ou excessivo também é condenado.

### C5 — proposta de intervenção
Nota = 40 × elementos válidos (agente, ação, modo/meio, efeito/finalidade, detalhamento).
- 0: sem proposta, desrespeito aos direitos humanos, ou desligada do assunto.
- Proposta em oração condicional ("se...") trava em 80.
- **Ação** genérica ou que só constata ("faltam investimentos") é nula.
- **Agente** nulo: "alguém", "você", verbo no imperativo. "A sociedade", "o Estado", "nós" valem.
- **Detalhamento** nunca é nulo. Detalhar o efeito só conta como "efeito do efeito", com marcador explícito.
- Elemento repetido conta uma vez. Com várias propostas, vale a mais completa. Pode estar em qualquer parte do texto.

## Nota zero
Folha em branco; até 7 linhas; fuga total ao tema; não dissertativo-argumentativo;
parte deliberadamente desconectada; identificação; impropérios ou desenhos;
predominância de língua estrangeira; ilegível. O título é opcional.

## Padrões das redações bem avaliadas (observados nas cartilhas, não regra oficial)
- **Introdução:** repertório como mote → liga à realidade brasileira com todos os termos do tema → tese → anúncio de dois eixos.
- **Desenvolvimento:** operador entre parágrafos + tópico frasal que retoma um eixo → repertório que sustenta → análise de causa/consequência no Brasil → fecho ("Dessa forma...").
- **Conclusão:** retomada com "Portanto" → proposta completa respondendo às causas → volta ao repertório da introdução.

## Regras do corretor v3 (27/10/2026, pedido do Pablo)
- **Nota sem trecho é inválida.** Cada competência devolve o trecho da redação
  que justifica o nível; o código confere que o trecho existe no texto (sem
  diferença de caixa, acento, pontuação). Faltou em alguma: a correção inteira
  é recusada e a IA tenta de novo. Trecho de repertório ou de elemento da
  proposta que não está no texto conta como ausente.
- **Repertório só é produtivo com os 3 passos** (cita, explica, amarra ao tema
  com fato brasileiro). Legitimado, citado, sem "explica" ou sem "amarra" =
  **repertório de bolso** (termo das cartilhas 2025 e 2026): improdutivo, C2
  para em 160. A Cartilha 2025 chama de bolso o Bauman ("instituições zumbis")
  só nomeado, mesmo ligado ao tema: nomear o conceito não é explicar.
  Quem decide "produtivo" é o código, pelos trechos, não o booleano da IA.
- **C5:** ação com "conscientizar", "sensibilizar" ou "alertar" sem meio
  válido é ação nula.
- **C4:** o código conta conectivos. O mesmo conectivo 3 vezes ou mais, ou
  abrindo 2 parágrafos, trava a C4 em 160 ("repetições raras" é exigência do 200).
- **C1:** desvio cujo trecho não está no texto, ou cuja correção é igual ao
  trecho, não conta.
- **Raciocínio da IA em 'low'** (`opcoesCorrecaoCompleta`): com 'medium' o
  gpt-oss gastava até 4.380 dos 4.500 tokens pensando e o JSON vinha cortado.
- **Calibração:** `docs/redacao/padrao-nota-1000.md` (20 redações das cartilhas
  2025 e 2026) e o golden set, que compara com o nível que o INEP declara nos
  comentários (`tests/redacao/niveis-inep.ts`). As cartilhas não dizem que as
  redações tiraram 1000: o INEP põe algumas em 160 na C1 e na C4.
- **Prompt sem "seja rigoroso":** a IA recebe o descritor de cada nível
  (200/160/120/80/40) e devolve qual descritor escolheu e o trecho.

## Correção na prática
Dois corretores independentes; discrepância acima de 100 no total ou 80 numa
competência chama um terceiro. O feedback do PrepEnem segue a ordem dos
comentários da cartilha: desvios → tema e repertório → projeto, parágrafo a
parágrafo → coesão → proposta, elemento a elemento.

**Não confirmado em fonte oficial:** "sem ação perde 120"; repertório de bolso
penalizado na C3.
