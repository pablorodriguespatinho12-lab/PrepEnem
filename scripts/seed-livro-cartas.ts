import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Deck do livro "Cartas de um Diabo a seu Aprendiz" (C.S. Lewis), do resumo que o
// Pablo ditou em 22/10/2026 conferido com o texto do livro.
// `capitulo` = número da carta: a frase fica trancada até a carta ser marcada como lida.
// Só cria ou atualiza o próprio deck; não toca em outros.
const DECK = {
  nome: 'Cartas de um Diabo a seu Aprendiz',
  materia: 'Livros',
  subtema: 'C.S. Lewis',
  descricao: 'Um diabo velho ensina o sobrinho a tentar um homem. Uma lição por carta.',
};

// Por carta, dois cartões: o resumo e uma frase para pregar (pedido do Pablo, 22/10/2026).
const CARDS: { frente: string; verso: string; capitulo?: number }[] = [
  {
    frente: 'Carta 1',
    verso: 'O diabo não deixa o homem buscar a verdade: faz ele achar que já é dono dela. O que leu por alto vira "a pesquisa mais recente".',
    capitulo: 1,
  },
  {
    frente: 'Carta 1 · para pregar',
    verso: 'Como em Cartas de um Diabo a seu Aprendiz: o diabo não precisa que a gente minta, só que a gente ache que já sabe tudo. "Quem pensa saber alguma coisa ainda não sabe como convém saber" (1 Coríntios 8:2).',
    capitulo: 1,
  },
  {
    frente: 'Carta 2',
    verso: 'O homem virou cristão. Agora o diabo quer que ele se decepcione com a igreja, olhando os defeitos de quem está no banco do lado.',
    capitulo: 2,
  },
  {
    frente: 'Carta 2 · para pregar',
    verso: 'Como em Cartas de um Diabo a seu Aprendiz: o diabo quer que você olhe para o irmão que canta desafinado, e não para Jesus. Corramos "olhando para Jesus" (Hebreus 12:2).',
    capitulo: 2,
  },
];

async function main() {
  const existente = await prisma.flashcardDeck.findFirst({
    where: { nome: DECK.nome, materia: DECK.materia, isDefault: true },
    include: { cards: true },
  });

  if (!existente) {
    await prisma.flashcardDeck.create({
      data: {
        ...DECK,
        isDefault: true,
        cards: { create: CARDS.map((c, ordem) => ({ ...c, ordem })) },
      },
    });
    console.log(`Criado: ${DECK.nome} (${CARDS.length} cartões)`);
    return;
  }

  // Já existe: atualiza pelo `ordem`, mantendo o progresso de cada cartão.
  for (const [ordem, c] of CARDS.entries()) {
    const card = existente.cards.find((x) => x.ordem === ordem);
    if (card) {
      await prisma.flashcard.update({ where: { id: card.id }, data: { ...c, capitulo: c.capitulo ?? null } });
    } else {
      await prisma.flashcard.create({ data: { ...c, ordem, deckId: existente.id } });
    }
  }
  // Cartões que sobraram de uma versão maior do deck.
  await prisma.flashcard.deleteMany({ where: { deckId: existente.id, ordem: { gte: CARDS.length } } });
  console.log(`Atualizado: ${DECK.nome} (${CARDS.length} cartões)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
