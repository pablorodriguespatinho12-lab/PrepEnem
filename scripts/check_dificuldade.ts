import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const byDif = await prisma.question.groupBy({
    by: ['dificuldade'],
    _count: true,
  });
  console.log(JSON.stringify(byDif, null, 2));
}
main().finally(() => prisma.$disconnect());
