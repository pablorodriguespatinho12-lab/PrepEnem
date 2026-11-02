import { PrismaClient } from '@prisma/client';
import { cartoesDosAutoresPorTema } from '../lib/redacao/cartoes-autores-tema';
const prisma = new PrismaClient();

// Baralho "Autores por tema" (Pablo, 02/11/2026: "que autores eu posso
// utilizar nesse tema... e fico decorando"). Um cartão por tema, de
// lib/redacao/cartoes-autores-tema.ts. Só cria ou atualiza o próprio deck, pela
// ordem, sem perder o progresso de cada cartão. Rodar de novo quando
// coringas-por-tema.json mudar:
//   DB_CONFIRMED=1 npx tsx --env-file=.env scripts/seed-autores-por-tema.ts
const DECK = {
  nome: 'Autores por tema',
  materia: 'Redação',
  /* A lista de baralhos mostra o subtema como título. */
  subtema: 'Autores por tema',
  descricao: 'Os 28 temas do ENEM e os autores que serviram em cada um, além do Drummond.',
};

async function main() {
  const cartoes = cartoesDosAutoresPorTema();
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
