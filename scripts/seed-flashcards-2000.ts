import { PrismaClient } from '@prisma/client';
import { portuguesDecks } from './data/flashcards-portugues';
import { literaturaDecks } from './data/flashcards-literatura';
import { historiaDecks } from './data/flashcards-historia';
import { geografiaDecks } from './data/flashcards-geografia';
import { filosofiaDecks } from './data/flashcards-filosofia';
import { sociologiaDecks } from './data/flashcards-sociologia';
import { biologiaDecks } from './data/flashcards-biologia';
import { quimicaDecks } from './data/flashcards-quimica';
import { fisicaDecks } from './data/flashcards-fisica';
import { matematicaDecks } from './data/flashcards-matematica';

const prisma = new PrismaClient();

const materiaColors: Record<string, string> = {
  'Matemática': '#60B5FF',
  'Português': '#FF9149',
  'Biologia': '#80D8C3',
  'Química': '#A19AD3',
  'Física': '#FF6363',
  'História': '#FF9898',
  'Geografia': '#72BF78',
  'Filosofia': '#FF90BB',
  'Sociologia': '#B8860B',
  'Literatura': '#E07C24',
};

const allDecks = [
  ...portuguesDecks,
  ...literaturaDecks,
  ...historiaDecks,
  ...geografiaDecks,
  ...filosofiaDecks,
  ...sociologiaDecks,
  ...biologiaDecks,
  ...quimicaDecks,
  ...fisicaDecks,
  ...matematicaDecks,
];

async function main() {
  console.log(`\n=== Seeding ${allDecks.length} decks ===`);
  let totalCards = 0;
  let deckCount = 0;

  for (const deckData of allDecks) {
    // Check if deck already exists (by nome + materia)
    const existing = await prisma.flashcardDeck.findFirst({
      where: { nome: deckData.nome, materia: deckData.materia, isDefault: true },
    });

    if (existing) {
      // Check if cards already exist
      const cardCount = await prisma.flashcard.count({ where: { deckId: existing.id } });
      if (cardCount >= deckData.cards.length) {
        console.log(`  [SKIP] ${deckData.materia} - ${deckData.nome} (já existe com ${cardCount} cards)`);
        totalCards += cardCount;
        deckCount++;
        continue;
      }
      // Delete existing cards and re-insert
      await prisma.flashcard.deleteMany({ where: { deckId: existing.id } });
      await prisma.flashcard.createMany({
        data: deckData.cards.map((c, idx) => ({
          deckId: existing.id,
          frente: c.frente,
          verso: c.verso,
          ordem: idx,
        })),
      });
      console.log(`  [UPDATE] ${deckData.materia} - ${deckData.nome} (${deckData.cards.length} cards)`);
      totalCards += deckData.cards.length;
      deckCount++;
      continue;
    }

    // Create new deck
    const deck = await prisma.flashcardDeck.create({
      data: {
        nome: deckData.nome,
        materia: deckData.materia,
        subtema: deckData.subtema || null,
        cor: materiaColors[deckData.materia] || '#06b6d4',
        isDefault: true,
        cards: {
          create: deckData.cards.map((c, idx) => ({
            frente: c.frente,
            verso: c.verso,
            ordem: idx,
          })),
        },
      },
    });
    console.log(`  [NEW] ${deckData.materia} - ${deckData.nome} (${deckData.cards.length} cards)`);
    totalCards += deckData.cards.length;
    deckCount++;
  }

  console.log(`\n✅ Total: ${deckCount} decks, ${totalCards} flashcards`);
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
