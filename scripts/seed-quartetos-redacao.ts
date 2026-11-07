import { PrismaClient } from '@prisma/client';
import { cartoesDosQuartetos } from '../lib/redacao/cartoes-quartetos';
const prisma = new PrismaClient();

// Baralho "Meus quartetos da redação" (Pablo, 06/11/2026: "lembra dos
// flashcards para decorar os repertórios"). Cartões em lib/redacao/cartoes-quartetos.ts.
// Só cria ou atualiza o próprio deck, pela ordem, sem perder o progresso.
// Rodar: DB_CONFIRMED=1 npx tsx scripts/seed-quartetos-redacao.ts
const DECK = {
  nome: 'Meus quartetos da redação',
  materia: 'Redação',
  /* A lista de baralhos mostra o subtema como título. */
  subtema: 'Meus quartetos da redação',
  descricao: 'Os 2 quartetos que juntos servem em 25 dos 28 temas do ENEM: quem vai em cada parte, qual usar e as frases.',
};

async function main() {
  const cartoes = cartoesDosQuartetos();
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
  /* Casa pela frente, não pela ordem: ao reordenar (07/11/2026), o progresso
   * de cada cartão segue o conteúdo dele. */
  const usados = new Set<string>();
  for (const [ordem, c] of cartoes.entries()) {
    const card = existente.cards.find((x) => x.frente === c.frente && !usados.has(x.id));
    if (card) {
      usados.add(card.id);
      await prisma.flashcard.update({ where: { id: card.id }, data: { ...c, ordem } });
    } else await prisma.flashcard.create({ data: { ...c, ordem, deckId: existente.id } });
  }
  /* Cartão que não existe mais no baralho: sai, com o progresso dele. */
  const sobrando = existente.cards.filter((x) => !usados.has(x.id)).map((x) => x.id);
  if (sobrando.length > 0) await prisma.flashcard.deleteMany({ where: { id: { in: sobrando }, deckId: existente.id } });
  console.log(`Atualizado: ${DECK.nome} (${cartoes.length} cartões${sobrando.length ? `, ${sobrando.length} removidos` : ''})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
