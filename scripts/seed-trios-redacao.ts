import { PrismaClient } from '@prisma/client';
import { baralhosDosTrios } from '../lib/redacao/cartoes-trios';
const prisma = new PrismaClient();

// Flashcards de Redação = só a escadinha dos trios (Pablo, 07/11/2026: "apaga
// todos os flash cards da parte de redação e coloca..."). Cartões em
// lib/redacao/cartoes-trios.ts.
// Apaga TODO baralho PADRÃO de Redação que não seja um dos 4 (com os cartões e
// o progresso deles) e recria os 4 do zero. Baralho criado pelo aluno
// (userId preenchido) não é tocado.
// Rodar: DB_CONFIRMED=1 npx tsx scripts/seed-trios-redacao.ts
const MATERIA = 'Redação';

async function main() {
  const baralhos = baralhosDosTrios();
  const velhos = await prisma.flashcardDeck.findMany({
    where: { materia: MATERIA, isDefault: true, userId: null },
    select: { id: true, nome: true },
  });
  if (velhos.length > 0) {
    await prisma.flashcardDeck.deleteMany({ where: { id: { in: velhos.map((d) => d.id) } } });
    console.log(`Apagados: ${velhos.map((d) => d.nome).join(' · ')}`);
  }
  for (const b of baralhos) {
    await prisma.flashcardDeck.create({
      data: {
        nome: b.nome, materia: MATERIA, subtema: b.nome, descricao: b.descricao, isDefault: true,
        cards: { create: b.cartoes.map((c, ordem) => ({ ...c, ordem })) },
      },
    });
    console.log(`Criado: ${b.nome} (${b.cartoes.length} cartões)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
