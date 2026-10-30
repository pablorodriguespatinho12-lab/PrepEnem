import { PrismaClient } from '@prisma/client';
import { cartoesDosCoringas } from '../lib/redacao/cartoes-coringas';
const prisma = new PrismaClient();

// Baralho "Coringas da redação" (Pablo, 30/10/2026: "tem que decorar os
// argumentos"). Os cartões saem de CORINGAS (lib/redacao/autores.ts), os que
// passaram na prova (docs/redacao/repertorios-coringa.md).
// Só cria ou atualiza o próprio deck, pela ordem, sem perder o progresso de cada
// cartão; não toca em outros. Rodar de novo quando CORINGAS mudar.
const DECK = {
  nome: 'Coringas da redação',
  materia: 'Redação',
  /* A lista de baralhos mostra o subtema como título. */
  subtema: 'Coringas da redação',
  descricao: 'Frases de autor testadas em 28 temas do ENEM. Decore quem disse, a frase e quando usar.',
};

async function main() {
  const cartoes = cartoesDosCoringas();
  const existente = await prisma.flashcardDeck.findFirst({
    where: { nome: DECK.nome, materia: DECK.materia, isDefault: true },
    include: { cards: true },
  });

  if (!existente) {
    await prisma.flashcardDeck.create({
      data: { ...DECK, isDefault: true, cards: { create: cartoes.map((c, ordem) => ({ ...c, ordem })) } },
    });
    console.log(`Criado: ${DECK.nome} (${cartoes.length} cartões)`);
    return;
  }

  await prisma.flashcardDeck.update({ where: { id: existente.id }, data: { subtema: DECK.subtema, descricao: DECK.descricao } });
  for (const [ordem, c] of cartoes.entries()) {
    const card = existente.cards.find((x) => x.ordem === ordem);
    if (card) await prisma.flashcard.update({ where: { id: card.id }, data: c });
    else await prisma.flashcard.create({ data: { ...c, ordem, deckId: existente.id } });
  }
  /* Cartão que sobrou de uma versão maior do baralho: sai, com o progresso dele. */
  const sobrando = existente.cards.filter((x) => x.ordem >= cartoes.length).map((x) => x.id);
  if (sobrando.length > 0) await prisma.flashcard.deleteMany({ where: { id: { in: sobrando }, deckId: existente.id } });
  console.log(`Atualizado: ${DECK.nome} (${cartoes.length} cartões${sobrando.length ? `, ${sobrando.length} removidos` : ''})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
