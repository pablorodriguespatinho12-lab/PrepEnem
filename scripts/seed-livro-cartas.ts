import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Deck do livro "Cartas de um Diabo a seu Aprendiz" (C.S. Lewis), do resumo que o
// Pablo ditou em 22/10/2026 conferido com o texto do livro.
// `capitulo` = número da carta: a frase fica trancada até a carta ser marcada como lida.
// Só cria ou atualiza o próprio deck; não toca em outros.
const DECK = {
  nome: 'Cartas de um Diabo a seu Aprendiz',
  materia: 'Livros',
  subtema: 'C.S. Lewis',
  descricao: 'Um diabo velho ensina o sobrinho a tentar um homem. Uma lição por carta.',
};

const CARDS: { frente: string; verso: string; capitulo?: number }[] = [
  // Antes de ler
  { frente: 'O livro', verso: 'Cartas de um Diabo a seu Aprendiz, de C.S. Lewis (1942).' },
  { frente: 'Quem escreve', verso: 'Fitafuso, um diabo experiente, escreve ao sobrinho Vermebile, um diabo novato.' },
  { frente: 'O "paciente"', verso: 'Um homem comum que Vermebile precisa afastar de Deus.' },
  { frente: 'O truque do livro', verso: 'Tudo é dito pelo avesso: o que o diabo chama de bom, é ruim para nós.' },
  // Carta 1
  { frente: 'Carta 1: a ideia', verso: 'Não deixe o homem buscar a verdade. Faça ele achar que já é dono dela.', capitulo: 1 },
  { frente: 'Carta 1: sem discussão', verso: 'Discutir faz o homem pensar. Melhor é ele julgar ideias por "moderna" ou "antiquada", não por verdadeira ou falsa.', capitulo: 1 },
  { frente: 'Carta 1: falsa certeza', verso: 'O que ele pegou de conversa e leitura casual, ele acha que é "o resultado das pesquisas mais recentes".', capitulo: 1 },
  { frente: 'Carta 1: a ciência', verso: 'O diabo evita a ciência de verdade: ela faz pensar no que não se vê. Alguns físicos acabaram crendo em Deus.', capitulo: 1 },
  { frente: 'Carta 1: a lição', verso: 'Falta de humildade fecha a porta para a verdade. Quem acha que sabe tudo, para de procurar.', capitulo: 1 },
  // Carta 2
  { frente: 'Carta 2: a ideia', verso: 'O homem virou cristão. Agora o diabo quer que ele se decepcione com a igreja.', capitulo: 2 },
  { frente: 'Carta 2: os vizinhos de banco', verso: 'Faça ele reparar em quem canta desafinado ou se veste mal, e concluir que a fé deve ser ridícula.', capitulo: 2 },
  { frente: 'Carta 2: a igreja de verdade', verso: 'O diabo esconde que a Igreja é enorme, de todos os tempos e lugares. Ele só deixa ver o banco do lado.', capitulo: 2 },
  { frente: 'Carta 2: a lição', verso: 'Todo começo empolgado tem um momento sem graça. Não confunda a decepção com as pessoas com a fé.', capitulo: 2 },
];

async function main() {
  const existente = await prisma.flashcardDeck.findFirst({
    where: { nome: DECK.nome, materia: DECK.materia, isDefault: true },
    include: { cards: true },
  });

  if (!existente) {
    await prisma.flashcardDeck.create({
      data: {
        ...DECK,
        isDefault: true,
        cards: { create: CARDS.map((c, ordem) => ({ ...c, ordem })) },
      },
    });
    console.log(`Criado: ${DECK.nome} (${CARDS.length} cartões)`);
    return;
  }

  // Já existe: atualiza pelo `ordem`, mantendo o progresso de cada cartão.
  for (const [ordem, c] of CARDS.entries()) {
    const card = existente.cards.find((x) => x.ordem === ordem);
    if (card) {
      await prisma.flashcard.update({ where: { id: card.id }, data: { ...c, capitulo: c.capitulo ?? null } });
    } else {
      await prisma.flashcard.create({ data: { ...c, ordem, deckId: existente.id } });
    }
  }
  console.log(`Atualizado: ${DECK.nome} (${CARDS.length} cartões)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
