import { PrismaClient } from '@prisma/client';
import { biologiaQuestions } from './data/questions-biologia';
import { historiaQuestions } from './data/questions-historia';
import { matematicaQuestions } from './data/questions-matematica';
import { portuguesQuestions } from './data/questions-portugues';
import { fisicaQuestions } from './data/questions-fisica';
import { quimicaQuestions } from './data/questions-quimica';
import { geografiaQuestions } from './data/questions-geografia';
import { filosofiaQuestions } from './data/questions-filosofia';
import { sociologiaQuestions } from './data/questions-sociologia';
import { inglesQuestions } from './data/questions-ingles';

const prisma = new PrismaClient();

const allQuestions = [
  ...biologiaQuestions,
  ...historiaQuestions,
  ...matematicaQuestions,
  ...portuguesQuestions,
  ...fisicaQuestions,
  ...quimicaQuestions,
  ...geografiaQuestions,
  ...filosofiaQuestions,
  ...sociologiaQuestions,
  ...inglesQuestions,
];

async function main() {
  console.log(`Seeding ${allQuestions.length} questions...`);
  let created = 0;
  let skipped = 0;

  for (const q of allQuestions) {
    const snippet = q.enunciado.substring(0, 80);
    const exists = await prisma.question.findFirst({
      where: { enunciado: { startsWith: snippet } },
    });
    if (exists) {
      skipped++;
      continue;
    }
    await prisma.question.create({ data: q as any });
    created++;
  }

  console.log(`Done! Created: ${created}, Skipped (duplicates): ${skipped}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
