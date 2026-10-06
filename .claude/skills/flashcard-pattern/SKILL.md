---
name: flashcard-pattern
description: "Use ao criar, editar ou debugar qualquer coisa relacionada a flashcards, decks, ou a tela de revisão espaçada do PrepEnem."
---

# Padrão de Flashcards do PrepEnem

## Modelo de dados (prisma/schema.prisma)

```
FlashcardDeck  (nome, materia, subtema?, cor?, isDefault)
  └─ Flashcard      (frente, verso, dica?, ordem)
       └─ FlashcardProgress  (userId, cardId, acertou, precisaRevisar, dataResposta)
```

`FlashcardDeck.userId` é opcional: `null` = deck padrão do sistema, disponível
para todos. Um deck pertence a UMA `materia` (Matemática, Português, Biologia
etc. — ver `lib/theme-colors.ts` para as cores por matéria).

## Padrão de conteúdo do card

- **Frente**: pergunta curta, conceito, ou nome de lei/fórmula
  ("O que é X?", "Fórmula de Bhaskara").
- **Verso**: definição, enunciado completo, ou a fórmula em si.
- **Dica** (opcional): pista mostrada sob demanda antes de virar o card
  (ícone de lâmpada), nunca revela a resposta direta.

## Fluxo de UX (já implementado em `app/flashcards/[deckId]/page.tsx`)

1. Card mostra só a **frente** — cor de fundo = cor da matéria.
2. Usuário clica no card → flip 3D (`rotateY`, 0,42 s sem mola, opção A de 05/10/2026; Espaço também vira) revela o
   **verso** com a definição.
3. Aparecem os botões **Acertei** / **Errei**.
4. "Errei" → `POST /api/flashcards/progresso` com `acertou: false` →
   `FlashcardProgress.precisaRevisar = true` → o card volta a aparecer no
   modo "revisar" (`mode=revisar` na URL/estado).
5. "Acertei" → `precisaRevisar = false`. O cartão só sai da fila de "Estudar"
   com **3 acertos seguidos em dias diferentes** (`lib/flashcard-dominio.ts`,
   pedido do Pablo em 05/10/2026, da pesquisa de TDAH): acertou hoje, volta
   amanhã; errou, zera. A frente mostra "x/3". `cardsAcertados` = dominados.
6. Ao esgotar os cards do modo atual, tela final mostra estatísticas da
   sessão (acertos/erros) e ações: estudar de novo, revisar erros, gerar
   mais cards com IA.

## Onde mexer

- Página de listagem (matéria → decks): `app/flashcards/page.tsx`
- Sessão de estudo (flip, resposta, revisão): `app/flashcards/[deckId]/page.tsx`
- Rotas de API: `app/api/flashcards/**`
- Seeds: `scripts/data/flashcards-*.ts` + `scripts/seed-flashcards-2000.ts`

Ver também [[animation-system]] para os padrões de motion usados no flip.
