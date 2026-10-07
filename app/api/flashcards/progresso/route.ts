export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/flashcards/progresso - record a card answer
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const { cardId, acertou } = await request.json();

    if (!cardId || typeof acertou !== 'boolean') {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // If acertou: mark all previous "precisaRevisar" as false too (they're now learned)
    if (acertou) {
      await prisma.flashcardProgress.updateMany({
        where: { userId: user.id, cardId, precisaRevisar: true },
        data: { precisaRevisar: false },
      });
    }

    const progress = await prisma.flashcardProgress.create({
      data: {
        userId: user.id,
        cardId,
        acertou,
        precisaRevisar: !acertou,
      },
    });

    return NextResponse.json({ progress });
  } catch (error: any) {
    console.error('Erro ao registrar progresso:', error);
    return NextResponse.json({ error: 'Erro ao registrar progresso' }, { status: 500 });
  }
}
