import { PrismaClient } from '@prisma/client';
import { baralhosDosQuartetos, type BaralhoDosQuartetos } from '../lib/redacao/cartoes-quartetos';
const prisma = new PrismaClient();

// Baralhos "Quartetos 1, 2 e 3" (Pablo, 07/11/2026: "pode dividir em 3
// baralhos"). Cartões em lib/redacao/cartoes-quartetos.ts.
// Cada cartão é achado pela frente OU pelo verso em qualquer um dos baralhos
// (inclusive o antigo "Meus quartetos da redação") e MOVIDO: o progresso vai
// junto. O baralho antigo só é apagado quando fica vazio.
// Rodar: DB_CONFIRMED=1 npx tsx scripts/seed-quartetos-redacao.ts
const MATERIA = 'Redação';
const NOME_ANTIGO = 'Meus quartetos da redação';

type CartaoNoBanco = { id: string; frente: string; verso: string };

async function garantirBaralho(b: BaralhoDosQuartetos): Promise<string> {
  const dados = { nome: b.nome, materia: MATERIA, subtema: b.nome, descricao: b.descricao, isDefault: true };
  const existente = await prisma.flashcardDeck.findFirst({ where: { nome: b.nome, materia: MATERIA, isDefault: true } });
  if (existente) {
    await prisma.flashcardDeck.update({ where: { id: existente.id }, data: dados });
    return existente.id;
  }
  return (await prisma.flashcardDeck.create({ data: dados })).id;
}

async function main() {
  const baralhos = baralhosDosQuartetos();
  const nomes = [NOME_ANTIGO, ...baralhos.map((b) => b.nome)];
  const antigos = await prisma.flashcardDeck.findMany({
    where: { nome: { in: nomes }, materia: MATERIA, isDefault: true },
    include: { cards: true },
  });
  const soltos: CartaoNoBanco[] = antigos.flatMap((d) => d.cards);
  const usados = new Set<string>();

  for (const b of baralhos) {
    const deckId = await garantirBaralho(b);
    for (const [ordem, c] of b.cartoes.entries()) {
      const achado =
        soltos.find((x) => !usados.has(x.id) && x.frente === c.frente) ??
        soltos.find((x) => !usados.has(x.id) && x.verso === c.verso);
      if (achado) {
        usados.add(achado.id);
        await prisma.flashcard.update({ where: { id: achado.id }, data: { ...c, ordem, deckId } });
      } else await prisma.flashcard.create({ data: { ...c, ordem, deckId } });
    }
    console.log(`${b.nome}: ${b.cartoes.length} cartões`);
  }

  /* Cartão que não existe mais em nenhum dos 3: sai, com o progresso dele. */
  const sobrando = soltos.filter((x) => !usados.has(x.id)).map((x) => x.id);
  if (sobrando.length > 0) await prisma.flashcard.deleteMany({ where: { id: { in: sobrando } } });
  const velho = antigos.find((d) => d.nome === NOME_ANTIGO);
  if (velho && (await prisma.flashcard.count({ where: { deckId: velho.id } })) === 0) {
    await prisma.flashcardDeck.delete({ where: { id: velho.id } });
    console.log(`Apagado o baralho antigo (vazio): ${NOME_ANTIGO}`);
  }
  console.log(`Movidos com progresso: ${usados.size}; removidos: ${sobrando.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
