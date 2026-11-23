# Mapa da escada de Matemática (Fase 3 do plano nível acima)

Fonte: `data/escadas.ts` (`precisaAntes`). Na tela só aparece o rótulo "Precisa antes: X" (`app/provas/page.tsx:137`), não há trava.
Regra segura: uma questão de nível acima do degrau k só junta conteúdo da **cadeia de pré-requisitos** de k (o que o aluno já deve ter visto).

| Degrau | Tema | Precisa antes | Cadeia completa (pode juntar com) |
|---|---|---|---|
| 1 | Aritmética e Porcentagem | — | (só ele mesmo) |
| 2 | Grandezas e Medidas | 1 | 1 |
| 3 | Estatística | 1 | 1 |
| 4 | Equações e Sistemas | 1 | 1 |
| 5 | Funções | 4 | 4, 1 |
| 6 | Geometria Plana | 2 | 2, 1 |
| 7 | Geometria Espacial | 6 | 6, 2, 1 |
| 8 | Análise Combinatória e Probabilidade | 1 | 1 |

## O problema que isso mostra (medido, 22/11/2026)
- Degraus **2, 3, 4 e 8** só têm **1 conteúdo** para juntar (Aritmética). Junção pobre: "estatística + porcentagem", "probabilidade + porcentagem".
- A junção que o Pablo deu de modelo (**geometria plana + probabilidade**, ENEM dos 3 círculos e o disco) **não é permitida** pela regra:
  nem 6 tem 8 na cadeia, nem 8 tem 6.

## Decisão que falta (2 opções)
- **A (recomendada):** nível acima do degrau k pode juntar qualquer degrau **anterior na ordem da escada** (1..k-1) **e** a aula "Antes" correspondente
  vira pré-requisito declarado na questão. Libera 6+8, 5+3, 7+8, etc. Custo: o aluno que pulou degrau pode travar.
- **B:** manter a cadeia estrita. Seguro, mas 4 de 8 degraus ficam com junção pobre e o modelo do Pablo fica de fora.

## Decidido (22/11/2026, Pablo): **A**
Nível acima junta qualquer degrau anterior e declara o "Antes". Estilo: mistura de Fuvest, ITA, ENEM e Harvard–MIT ("pega um pouco de todos").
