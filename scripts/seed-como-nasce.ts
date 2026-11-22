import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';
import { CARTOES_COMO_NASCE } from '../data/flashcards/como-nasce';

// Cria os baralhos "Como nasce a fórmula" (um por matéria, padrão do sistema).
// ADITIVO: só cria baralho com esse nome que ainda não existe; nunca altera nem apaga nada.
// Uso: DB_CONFIRMED=1 npx tsx scripts/seed-como-nasce.ts            (simula)
//      DB_CONFIRMED=1 npx tsx scripts/seed-como-nasce.ts --gravar   (cria)

const NOME = 'Como nasce a fórmula';
const prisma = new PrismaClient();

async function main() {
  const gravar = process.argv.includes('--gravar');
  const materias = [...new Set(CARTOES_COMO_NASCE.map((c) => c.materia))];
  for (const materia of materias) {
    const cartoes = CARTOES_COMO_NASCE.filter((c) => c.materia === materia);
    const jaExiste = await prisma.flashcardDeck.findFirst({ where: { nome: NOME, materia, isDefault: true } });
    if (jaExiste) { console.log(`${materia}: baralho já existe (${jaExiste.id}), nada a fazer`); continue; }
    console.log(`${materia}: ${gravar ? 'criando' : 'criaria'} ${cartoes.length} cartões`);
    if (!gravar) continue;
    await prisma.flashcardDeck.create({
      data: {
        nome: NOME,
        materia,
        subtema: 'Como nasce a fórmula',
        descricao: 'Monte a fórmula do zero no papel e depois confira como ela nasce, com números primeiro.',
        isDefault: true,
        cards: { create: cartoes.map((c, i) => ({ frente: c.frente, verso: c.verso, dica: c.dica ?? null, ordem: i })) },
      },
    });
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
