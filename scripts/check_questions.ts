import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const total = await prisma.question.count();
  console.log('Total questions:', total);
  const byMateria = await prisma.question.groupBy({
    by: ['materia', 'nivel'],
    _count: true,
  });
  byMateria.sort((a, b) => (a.materia || '').localeCompare(b.materia || ''));
  console.log(JSON.stringify(byMateria, null, 2));
}
main().finally(() => prisma.$disconnect());
