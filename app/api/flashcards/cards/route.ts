export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MAX_CARDS_PER_REQUEST = 50;

// POST /api/flashcards/cards - cria um ou mais flashcards num deck.
// Usado tanto pela criação manual (1 card) quanto pelo "salvar aceitos" do
// preview de geração por IA (N cards já revisados pelo usuário).
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const { deckId, cards } = await request.json();

    const deck = await prisma.flashcardDeck.findFirst({
      where: { id: deckId, OR: [{ userId: user.id }, ...(user.role === 'admin' ? [{ isDefault: true }] : [])] }, // baralho padrão é de todos: só admin escreve nele
    });
    if (!deck) return NextResponse.json({ error: 'Deck não encontrado' }, { status: 404 });

    if (!Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json({ error: 'Nenhum card fornecido' }, { status: 400 });
    }
    if (cards.length > MAX_CARDS_PER_REQUEST) {
      return NextResponse.json({ error: `Máximo de ${MAX_CARDS_PER_REQUEST} cards por vez` }, { status: 400 });
    }

    const valid = cards
      .map((c: any) => ({
        frente: String(c?.frente ?? '').trim().slice(0, 1000),
        verso: String(c?.verso ?? '').trim().slice(0, 2000),
        dica: c?.dica ? String(c.dica).trim().slice(0, 500) : null,
      }))
      .filter((c) => c.frente && c.verso);

    if (valid.length === 0) {
      return NextResponse.json({ error: 'Nenhum card com frente e verso preenchidos' }, { status: 400 });
    }

    const lastCard = await prisma.flashcard.findFirst({
      where: { deckId: deck.id },
      orderBy: { ordem: 'desc' },
    });
    let nextOrdem = lastCard ? lastCard.ordem + 1 : 0;

    const created = await prisma.flashcard.createMany({
      data: valid.map((c, i) => ({
        deckId: deck.id,
        frente: c.frente,
        verso: c.verso,
        dica: c.dica,
        ordem: nextOrdem + i,
      })),
    });

    return NextResponse.json({ created: created.count });
  } catch (error: any) {
    console.error('Erro ao criar cards:', error);
    return NextResponse.json({ error: 'Erro ao criar cards' }, { status: 500 });
  }
}
