export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/flashcards/decks/[id] - get deck with cards to study
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { username: (session.user as any).username || session.user.email! } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'todos'; // 'todos', 'revisar'

    const deck = await prisma.flashcardDeck.findFirst({
      where: {
        id: params.id,
        OR: [{ isDefault: true }, { userId: user.id }],
      },
      include: {
        cards: {
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!deck) return NextResponse.json({ error: 'Deck não encontrado' }, { status: 404 });

    // Get user's progress on these cards
    const cardIds = deck.cards.map((c: any) => c.id);
    const allProgress = await prisma.flashcardProgress.findMany({
      where: { userId: user.id, cardId: { in: cardIds } },
      orderBy: { dataResposta: 'desc' },
    });

    // Build progress map - latest per card
    const latestProgress: Record<string, any> = {};
    allProgress.forEach((p) => {
      if (!latestProgress[p.cardId]) latestProgress[p.cardId] = p;
    });

    let cardsToStudy = deck.cards;

    if (mode === 'revisar') {
      // Only cards marked for review (errado)
      cardsToStudy = deck.cards.filter((c) => {
        const p = latestProgress[c.id];
        return p && p.precisaRevisar;
      });
    } else {
      // 'todos' - exclude cards already acertou (definitively answered correctly)
      cardsToStudy = deck.cards.filter((c) => {
        const p = latestProgress[c.id];
        // Show if no progress OR not yet acertou
        return !p || !p.acertou || p.precisaRevisar;
      });
    }

    // Shuffle
    cardsToStudy = [...cardsToStudy].sort(() => Math.random() - 0.5);

    return NextResponse.json({
      deck: {
        id: deck.id,
        nome: deck.nome,
        materia: deck.materia,
        subtema: deck.subtema,
        cor: deck.cor,
      },
      cards: cardsToStudy,
      totalCards: deck.cards.length,
      cardsToRevise: deck.cards.filter((c) => latestProgress[c.id]?.precisaRevisar).length,
      cardsAcertados: deck.cards.filter((c) => {
        const p = latestProgress[c.id];
        return p && p.acertou && !p.precisaRevisar;
      }).length,
    });
  } catch (error: any) {
    console.error('Erro ao buscar deck:', error);
    return NextResponse.json({ error: 'Erro ao buscar deck' }, { status: 500 });
  }
}

// DELETE /api/flashcards/decks/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { username: (session.user as any).username || session.user.email! } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    // Only delete if it's user's own deck
    await prisma.flashcardDeck.deleteMany({ where: { id: params.id, userId: user.id, isDefault: false } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao deletar deck:', error);
    return NextResponse.json({ error: 'Erro ao deletar deck' }, { status: 500 });
  }
}
