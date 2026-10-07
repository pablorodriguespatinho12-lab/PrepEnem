export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/flashcards/do-erro — a pergunta de fixação da explicação de uma
// questão errada vira cartão no baralho "Meus erros · <matéria>" do aluno.
// Entra marcado para revisar, então abre primeiro nos flashcards do dia
// (lib/flashcards-dia.ts). Antes a pergunta sumia ao trocar de questão.
const texto = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim().length > 0 ? v.trim().slice(0, max) : null;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const b = await request.json().catch(() => null);
  const materia = texto(b?.materia, 40);
  const frente = texto(b?.pergunta, 300);
  const verso = texto(b?.resposta, 400);
  if (!materia || !frente || !verso) return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });

  try {
    const nome = `Meus erros · ${materia}`;
    const deck = (await prisma.flashcardDeck.findFirst({ where: { userId, nome } }))
      ?? (await prisma.flashcardDeck.create({ data: { userId, nome, materia, descricao: 'Perguntas das questões que você errou.' } }));

    // A mesma questão errada de novo não duplica o cartão.
    const existente = await prisma.flashcard.findFirst({ where: { deckId: deck.id, frente } });
    if (existente) return NextResponse.json({ cardId: existente.id, novo: false });

    const ultimo = await prisma.flashcard.findFirst({ where: { deckId: deck.id }, orderBy: { ordem: 'desc' } });
    const card = await prisma.flashcard.create({ data: { deckId: deck.id, frente, verso, ordem: (ultimo?.ordem ?? -1) + 1 } });
    await prisma.flashcardProgress.create({ data: { userId, cardId: card.id, acertou: false, precisaRevisar: true } });
    return NextResponse.json({ cardId: card.id, novo: true });
  } catch (error) {
    console.error('Flashcard do erro:', error);
    return NextResponse.json({ error: 'Não consegui guardar o cartão.' }, { status: 500 });
  }
}
