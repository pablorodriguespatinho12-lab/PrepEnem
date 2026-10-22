import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Deck do livro "O Cavalo e Seu Menino" (C.S. Lewis), do artefato aprovado pelo Pablo
// em 15/10/2026 (claude.ai/artifact/6PoWDVkq5cr9xN4v3EkeBR).
// `capitulo`: a frase fica trancada até o capítulo ser marcado como lido (spoiler).
// Só cria ou atualiza o próprio deck; não toca em outros.
const DECK = {
  nome: 'O Cavalo e Seu Menino',
  materia: 'Livros',
  subtema: 'C.S. Lewis',
  descricao: 'Crônicas de Nárnia. Antes de ler, a história e as frases por capítulo.',
};

const CARDS: { frente: string; verso: string; capitulo?: number }[] = [
  // Antes de ler
  { frente: 'O livro', verso: 'O Cavalo e Seu Menino, de C.S. Lewis. Faz parte das Crônicas de Nárnia.' },
  { frente: 'O autor', verso: 'C.S. Lewis foi um autor de teologia muito importante.' },
  { frente: 'A intenção', verso: 'Apresentar a teologia cristã a jovens por meio de uma aventura.' },
  { frente: 'A história', verso: 'Um menino criado por um pescador e os problemas que ele enfrenta.' },
  { frente: 'O que o livro ensina', verso: 'Deus guia a nossa vida, mesmo quando o sofrimento parece só acaso.' },
  { frente: 'Liberdade', verso: 'Ninguém é dono de outra pessoa. Liberdade e dignidade valem mais que riqueza.' },
  { frente: 'Orgulho', verso: 'O orgulho atrapalha. Quem reconhece o erro cedo se sai melhor.' },
  // História
  { frente: 'O menino', verso: 'Shasta vive no sul da Calormânia, à beira do mar.' },
  { frente: 'O pescador', verso: 'Arsheesh, pescador pobre, é quem Shasta chama de pai. Trabalham duro e ele é bravo.' },
  { frente: 'Sem amor', verso: 'Shasta não ama Arsheesh e se sente mal por isso. Um filho deveria amar o pai.' },
  { frente: 'O nobre', verso: 'Um nobre chega a cavalo e exige pousada por uma noite.' },
  { frente: 'A compra', verso: 'O nobre quer comprar Shasta como escravo. Arsheesh negocia o preço.' },
  { frente: 'O pai de verdade', verso: 'Arsheesh admite que não é o pai de Shasta. Achou o bebê num barco.' },
  { frente: 'O alívio', verso: 'Shasta sente alívio, não tristeza. Se o pai o amasse, teria de amar de volta.' },
  { frente: 'O estábulo', verso: 'Shasta fala sozinho no estábulo. O cavalo do nobre responde.' },
  { frente: 'Bree', verso: 'O cavalo é Bree, de Nárnia. Shasta se espanta ao ouvir um cavalo falar.' },
  // Frases (trancadas até o capítulo)
  { frente: 'O grito da fuga', verso: 'Ao fugir, Shasta e Bree têm um grito: Nárnia e o Norte, a liberdade.', capitulo: 1 },
  { frente: 'O leão', verso: 'Uma voz revela que o leão estava junto de Shasta desde sempre. Nada foi só acaso.', capitulo: 11 },
  { frente: 'Não foi sorte', verso: 'Shasta entende que chegar até ali não foi sorte. Alguém grande o guiava.', capitulo: 12 },
  { frente: 'O cavalo sensato', verso: 'Bree admite que foi tolo. Aslan diz que é feliz o cavalo que aprende isso cedo.', capitulo: 14 },
  { frente: 'O orgulho paga', verso: 'O príncipe orgulhoso sofre as consequências do que fez. Arrogância tem preço.', capitulo: 15 },
  // Por capítulo: o resumo e uma frase para pregar (pedido do Pablo, 22/10/2026).
  {
    frente: 'Capítulo 1',
    verso: 'Shasta descobre que o pescador não é seu pai e que vai ser vendido como escravo. Bree, um cavalo falante, chama Shasta para fugirem juntos para Nárnia.',
    capitulo: 1,
  },
  {
    frente: 'Capítulo 1 · para pregar',
    verso: 'Como Shasta em O Cavalo e Seu Menino: ele vivia como escravo porque não sabia de onde vinha. Em Cristo, "já não és escravo, mas filho" (Gálatas 4:7).',
    capitulo: 1,
  },
  {
    frente: 'Capítulo 2',
    verso: 'Na viagem, leões perseguem Shasta e Bree. A fuga junta os dois com Aravis e a égua falante Huin, que também fogem para Nárnia. Viram companheiros.',
    capitulo: 2,
  },
  {
    frente: 'Capítulo 2 · para pregar',
    verso: 'Como em O Cavalo e Seu Menino: o susto dos leões parecia azar, mas foi ele que juntou os amigos. "O coração do homem planeja o seu caminho, mas o Senhor lhe dirige os passos" (Provérbios 16:9).',
    capitulo: 2,
  },
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
