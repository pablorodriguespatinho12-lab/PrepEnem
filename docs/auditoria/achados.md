# Achados da leva 1 (24/11/2026)

Fonte: 3 agentes Haiku, só leitura. Tabela completa da fase A em `fase-a.md`.

## A: exercícios por tema x nível (1.462 questões, 51 temas)
- 18 de 51 temas têm algum nível com menos de 3 questões.
- Humanas e Inglês: 11 temas com 1 fácil e 0 médio/difícil (Filosofia Antiga e Política, Geografia x5, História x2, Inglês Reading, Sociologia Movimentos).
- Química: Atomística e Ligações 7 / 0 / 0; Equilíbrio, Cinética e Termoquímica 0 / 3 / 4.
- Exatas pesam no difícil: Física Óptica 3 / 2 / 35; Ondas 2 / 5 / 35; Matemática Geometria Plana 9 / 10 / 51.
- Biologia Botânica 4 / 2 / 1.
- 290 questões sem tema (null).

## C: ENEM sem cobertura: LEITURA ERRADA, REFAZER
O agente leu "tema" como tema de REDAÇÃO (7 temas, 3 buracos: 2021 sem questão; 2024 e 2025 sem EssayTheme no banco). Útil mas não é a pergunta. A pergunta: conteúdos de Matemática/Ciências/Humanas cobrados no ENEM 2019-2025 sem questão nem aula. Refazer com a lista de conteúdos por prova.

## E: nível acima, dado repetido e texto longo: PARCIAL
- 90 questões com lousa (104 nível acima, 14 sem; os 90 incluem degraus `d2-escada-*`).
- 52 de 90 com enunciado > 380 letras (número firme).
- "89 de 90 repetem" NÃO vale: contou qualquer número (inclusive 1 e 2). Refazer só com números de 3+ dígitos ou decimais.

## Leva 2 (medida por mim em SQL, sem agente: 1 consulta < 40 mil tokens de Haiku)
### C refeita: questões REAIS do ENEM 2019-2025 (anoProva) x aula pronta
SQL: Question left join ExplicacaoPronta where anoProva between 2019 and 2025.
- 381 reais; 116 com aula; **265 sem aula** (209 de Linguagens/Humanas/Biologia/Química; 56 de Matemática e Física).
- **Lousa nas reais: 0 em Biologia, Química, Português, Geografia, História, Filosofia, Sociologia, Inglês.** Só Matemática e Física têm.
- Sem nenhuma aula: Português Literatura (9 reais), Funções/Figuras (4), Gramática (2); Química Soluções/pH (4), Atomística (1), Equilíbrio (1).
- Geografia 37 reais e História 37 reais com "(sem tema)": taxonomia não cobre; só 7 e 10 têm aula.

### E refeita (números de 3+ dígitos ou decimais)
- 104 nível acima com lousa; 92 são degraus `d2-escada-*`.
- 55 longas (>380 letras), TODAS degraus (0 fora de escada).
- 45 de 104 não têm número grande: a medida de repetição nesses não vale. Falta medir repetição por tela (precisa de script, próximo passo).

### E medida por script (`scripts/auditar-repeticao-lousa.mts`, 90 lousas)
Comando: `DB_CONFIRMED=1 npx tsx scripts/auditar-repeticao-lousa.mts`
- **52 de 90 repetem** um número do enunciado em 3+ telas (fora de escada: 5 de 12; escadas: 47 de 78).
- Escadas: média de 598 letras de enunciado e 21 telas; 29 de 78 sem repetição, 17 com 8+ telas, 1 com 31 telas.
- Script corrigido (24/11): conta só TEXTO das telas (antes contava coordenada x=200 e milhar "1.000"). Resultado depois do conserto: **51 de 90** repetem (fora de escada 5 de 12); maior: 16 de 26 telas (0,75).
- Isto responde o pedido do Pablo (regra 22): ~58% das lousas digitam o dado várias vezes.

## Plano dos lotes de conserto (ordem por dor, cada lote = 1 commit)
| Lote | O que | Quem | Teste de pronto |
|---|---|---|---|
| 1 | Script: regex de milhar + vira linha em `nivel-acima-regras.test.ts` | executor Sonnet | teste vermelho nas 52, depois verde |
| 2 | Lousa das 17 escadas com 8+ repetições: dado numa tabela/figura 1 vez, telas só apontam | executor Sonnet + `k:'eq'`/`grade` | repetem < 3 telas; foto 1366 px |
| 3 | Aulas de lousa para Biologia/Química reais (53 reais sem aula, 6 temas) | executor Sonnet (código) + Haiku (conferir) | `revisor-de-fatos`, depois `aluno-do-zero` |
| 4 | Temas Química sem exercício fácil/médio (Atomística, Equilíbrio) e Humanas com 1 fácil | executor, questão âncora real | regras-do-pablo 1-23 |
Limite semanal volta 27/11 16h: lotes 3 e 4 gastam; 1 e 2 são baratos.
