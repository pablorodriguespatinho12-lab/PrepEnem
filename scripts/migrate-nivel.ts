import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Map existing dificuldade to new nivel field
  console.log('Migrando dificuldade -> nivel...');

  const facil = await prisma.question.updateMany({
    where: { dificuldade: 'facil', nivel: null },
    data: { nivel: 'facil' },
  });
  console.log(`  facil: ${facil.count} questões atualizadas`);

  const medio = await prisma.question.updateMany({
    where: { dificuldade: 'medio', nivel: null },
    data: { nivel: 'medio' },
  });
  console.log(`  medio: ${medio.count} questões atualizadas`);

  const dificil = await prisma.question.updateMany({
    where: { dificuldade: 'dificil', nivel: null },
    data: { nivel: 'modelo_enem' },
  });
  console.log(`  dificil -> modelo_enem: ${dificil.count} questões atualizadas`);

  // Verify
  const grouped = await prisma.question.groupBy({
    by: ['nivel'],
    _count: true,
  });
  console.log('\nDistribuição final por nível:');
  console.log(JSON.stringify(grouped, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
