export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/flashcards/decks - list decks (default + user's)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const decks = await prisma.flashcardDeck.findMany({
      where: { OR: [{ isDefault: true }, { userId: user.id }] },
      include: {
        _count: { select: { cards: true } },
        cards: {
          select: { id: true },
        },
      },
      orderBy: [{ isDefault: 'desc' }, { materia: 'asc' }, { subtema: 'asc' }],
    });

    // For each deck, calculate user progress
    const deckIds = decks.map((d) => d.id);
    const cardIds = decks.flatMap((d) => d.cards.map((c) => c.id));
    const progress = await prisma.flashcardProgress.findMany({
      where: { userId: user.id, cardId: { in: cardIds } },
    });

    const result = decks.map((d) => {
      const deckCardIds = new Set(d.cards.map((c) => c.id));
      const deckProgress = progress.filter((p) => deckCardIds.has(p.cardId));
      const acertos = new Set(deckProgress.filter((p) => p.acertou).map((p) => p.cardId)).size;
      const erros = new Set(deckProgress.filter((p) => !p.acertou && p.precisaRevisar).map((p) => p.cardId)).size;
      const restantes = d.cards.length - acertos;
      return {
        id: d.id,
        nome: d.nome,
        materia: d.materia,
        subtema: d.subtema,
        descricao: d.descricao,
        cor: d.cor,
        isDefault: d.isDefault,
        totalCards: d.cards.length,
        acertos,
        erros,
        restantes,
      };
    });

    return NextResponse.json({ decks: result });
  } catch (error: any) {
    console.error('Erro ao listar decks:', error);
    return NextResponse.json({ error: 'Erro ao listar decks' }, { status: 500 });
  }
}

// POST /api/flashcards/decks - create new deck
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const body = await request.json();
    const { nome, materia, subtema, descricao, cor } = body;

    if (!nome || !materia) {
      return NextResponse.json({ error: 'Nome e matéria são obrigatórios' }, { status: 400 });
    }

    const deck = await prisma.flashcardDeck.create({
      data: {
        userId: user.id,
        nome,
        materia,
        subtema: subtema || null,
        descricao: descricao || null,
        cor: cor || null,
      },
    });

    return NextResponse.json({ deck });
  } catch (error: any) {
    console.error('Erro ao criar deck:', error);
    return NextResponse.json({ error: 'Erro ao criar deck' }, { status: 500 });
  }
}
