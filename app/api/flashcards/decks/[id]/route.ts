export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { situacaoDoCartao, type RespostaCartao } from '@/lib/flashcard-dominio';
import { escolherCartoesDoDia } from '@/lib/flashcards-dia';
import { getCycleInfoForDay } from '@/lib/schedule-data';
import { getActiveStudyDay } from '@/lib/study-progress';
import { cotasDoDia } from '@/lib/treino-etapas';
import { ordenarParaEstudo } from '@/lib/flashcards/ordem-fixa';

// Deck virtual "dia": 10 cartões de cada matéria do treino de hoje, montado na
// hora a partir dos decks padrão e dos do usuário (lib/flashcards-dia.ts).
const DECK_DO_DIA = 'dia';
const CARTOES_POR_MATERIA = 10;

async function deckDoDia(userId: string) {
  const dia = await getActiveStudyDay(userId);
  const topicos = getCycleInfoForDay(dia.weekNumber, dia.dayIndex).daySchedule?.topics ?? [];
  const materias = cotasDoDia(topicos.map((t) => t.materia)).map(({ materia }) => ({
    materia,
    subtemas: topicos.filter((t) => t.materia === materia).flatMap((t) => t.subtemas),
  }));

  const decks = await prisma.flashcardDeck.findMany({
    where: { materia: { in: materias.map((m) => m.materia) }, OR: [{ isDefault: true }, { userId }] },
    select: { materia: true, subtema: true, nome: true, cards: { orderBy: { ordem: 'asc' } } },
  });
  const cartoes = decks.flatMap((d) => d.cards.map((c) => ({ ...c, materia: d.materia, subtema: d.subtema ?? d.nome })));
  const respostas = await prisma.flashcardProgress.findMany({
    where: { userId, cardId: { in: cartoes.map((c) => c.id) } },
    orderBy: { dataResposta: 'desc' },
  });
  const historico: Record<string, RespostaCartao[]> = {};
  const ultimaErrada = new Set<string>();
  respostas.forEach((r) => {
    if (!historico[r.cardId] && r.precisaRevisar) ultimaErrada.add(r.cardId);
    (historico[r.cardId] ??= []).push(r);
  });

  const agora = new Date();
  const candidatos = cartoes.map((c) => {
    const situacao = situacaoDoCartao(historico[c.id] ?? [], agora);
    return { ...c, naFilaHoje: situacao.naFilaHoje, acertosSeguidos: situacao.acertosSeguidos, precisaRevisar: ultimaErrada.has(c.id) };
  });
  const escolhidos = escolherCartoesDoDia(candidatos, materias, CARTOES_POR_MATERIA);

  return {
    deck: { id: DECK_DO_DIA, nome: 'Flashcards do dia', materia: materias.map((m) => m.materia).join(' · '), subtema: null, cor: null },
    cards: escolhidos,
    totalCards: escolhidos.length,
    cardsToRevise: escolhidos.filter((c) => c.precisaRevisar).length,
    cardsAcertados: 0,
    cardsParaHoje: escolhidos.length,
  };
}

// GET /api/flashcards/decks/[id] - get deck with cards to study
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    if (params.id === DECK_DO_DIA) return NextResponse.json(await deckDoDia(user.id));

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

    // Deck de livro: cartão com `capitulo` ainda não lido fica fora (spoiler).
    const trancados = deck.cards.filter((c) => c.capitulo != null && c.capitulo > deck.capituloLido);
    const proximoCapitulo = trancados.length ? Math.min(...trancados.map((c) => c.capitulo!)) : null;
    deck.cards = deck.cards.filter((c) => !trancados.includes(c));

    // Get user's progress on these cards
    const cardIds = deck.cards.map((c: any) => c.id);
    const allProgress = await prisma.flashcardProgress.findMany({
      where: { userId: user.id, cardId: { in: cardIds } },
      orderBy: { dataResposta: 'desc' },
    });

    // Build progress map - latest per card
    const latestProgress: Record<string, any> = {};
    const historico: Record<string, RespostaCartao[]> = {};
    allProgress.forEach((p) => {
      if (!latestProgress[p.cardId]) latestProgress[p.cardId] = p;
      (historico[p.cardId] ??= []).push(p);
    });
    const agora = new Date();
    const situacao = Object.fromEntries(
      deck.cards.map((c) => [c.id, situacaoDoCartao(historico[c.id] ?? [], agora)])
    );
    const filaDeHoje = deck.cards.filter((c) => situacao[c.id].naFilaHoje);

    let cardsToStudy = deck.cards;

    if (mode === 'revisar') {
      // Only cards marked for review (errado)
      cardsToStudy = deck.cards.filter((c) => {
        const p = latestProgress[c.id];
        return p && p.precisaRevisar;
      });
    } else {
      // 'todos': sai da fila só com 3 acertos em dias diferentes (lib/flashcard-dominio.ts)
      cardsToStudy = filaDeHoje;
    }

    // Embaralha, exceto baralho de progressão (lib/flashcards/ordem-fixa.ts)
    const cartoes = ordenarParaEstudo(cardsToStudy, deck.nome)
      .map((c) => ({ ...c, acertosSeguidos: situacao[c.id].acertosSeguidos }));

    return NextResponse.json({
      deck: {
        id: deck.id,
        nome: deck.nome,
        materia: deck.materia,
        subtema: deck.subtema,
        cor: deck.cor,
        capituloLido: deck.capituloLido,
        proximoCapitulo,
        trancados: trancados.length,
      },
      cards: cartoes,
      totalCards: deck.cards.length,
      cardsToRevise: deck.cards.filter((c) => latestProgress[c.id]?.precisaRevisar).length,
      cardsAcertados: deck.cards.filter((c) => situacao[c.id].dominado).length,
      cardsParaHoje: filaDeHoje.length,
    });
  } catch (error: any) {
    console.error('Erro ao buscar deck:', error);
    return NextResponse.json({ error: 'Erro ao buscar deck' }, { status: 500 });
  }
}

// PATCH /api/flashcards/decks/[id] - deck de livro: marca até que capítulo já foi lido
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { capituloLido } = await request.json();
    if (!Number.isInteger(capituloLido) || capituloLido < 0 || capituloLido > 500) {
      return NextResponse.json({ error: 'Capítulo inválido' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const { count } = await prisma.flashcardDeck.updateMany({
      where: { id: params.id, OR: [{ isDefault: true }, { userId }] },
      data: { capituloLido },
    });
    if (!count) return NextResponse.json({ error: 'Deck não encontrado' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao marcar capítulo:', error);
    return NextResponse.json({ error: 'Erro ao marcar capítulo' }, { status: 500 });
  }
}
// DELETE /api/flashcards/decks/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    // Only delete if it's user's own deck
    await prisma.flashcardDeck.deleteMany({ where: { id: params.id, userId: user.id, isDefault: false } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao deletar deck:', error);
    return NextResponse.json({ error: 'Erro ao deletar deck' }, { status: 500 });
  }
}
