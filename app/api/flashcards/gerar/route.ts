export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/flashcards/gerar - generate cards for a deck using AI
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { username: (session.user as any).username || session.user.email! } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const { deckId, quantidade = 10 } = await request.json();

    const deck = await prisma.flashcardDeck.findFirst({
      where: { id: deckId, OR: [{ userId: user.id }, { isDefault: true }] },
    });
    if (!deck) return NextResponse.json({ error: 'Deck não encontrado' }, { status: 404 });

    const qty = Math.min(Math.max(parseInt(String(quantidade)), 1), 30);

    const prompt = `Você é um professor especialista de ${deck.materia}${deck.subtema ? `, especificamente em ${deck.subtema}` : ''}.

Crie ${qty} flashcards para estudo de vestibular/ENEM sobre ${deck.subtema || deck.materia}.

Cada flashcard deve ter:
- frente: Uma pergunta curta, direta, sobre um conceito-chave ou termo importante. Pode ser uma pergunta tipo "O que é X?", "Qual a função de Y?", "Como ocorre Z?", "Defina W?", etc.
- verso: A resposta clara, objetiva, didática (1-3 frases, no máximo). Pode incluir um exemplo curto.
- dica: (opcional) Um macete, mnemônico ou dica curta para ajudar a lembrar.

IMPORTANTE:
- Cubra os conceitos mais importantes e que mais caem em vestibulares.
- Varie os tipos de questões: definições, funções, classificações, exemplos, processos, fórmulas.
- NÃO repita conceitos.
- Use linguagem clara e jovem (máximo 2 frases por resposta).

Retorne APENAS um JSON válido com este formato:
{
  "cards": [
    { "frente": "...", "verso": "...", "dica": "..." }
  ]
}`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 5000,
      }),
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => '');
      console.error('LLM error:', response.status, txt);
      return NextResponse.json({ error: 'Erro na IA' }, { status: 500 });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content ?? '{}';
    content = content.replace(/```json\s*/g, '').replace(/```/g, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error('JSON parse error:', e, content.slice(0, 500));
      return NextResponse.json({ error: 'Erro ao parsear IA' }, { status: 500 });
    }

    if (!Array.isArray(parsed.cards)) {
      return NextResponse.json({ error: 'Resposta inválida' }, { status: 500 });
    }

    // Get current max ordem
    const lastCard = await prisma.flashcard.findFirst({
      where: { deckId: deck.id },
      orderBy: { ordem: 'desc' },
    });
    let nextOrdem = lastCard ? lastCard.ordem + 1 : 0;

    const created = await prisma.flashcard.createMany({
      data: parsed.cards.map((c: any, i: number) => ({
        deckId: deck.id,
        frente: String(c.frente || '').slice(0, 1000),
        verso: String(c.verso || '').slice(0, 2000),
        dica: c.dica ? String(c.dica).slice(0, 500) : null,
        ordem: nextOrdem + i,
      })),
    });

    return NextResponse.json({ created: created.count });
  } catch (error: any) {
    console.error('Erro ao gerar cards:', error);
    return NextResponse.json({ error: 'Erro ao gerar cards' }, { status: 500 });
  }
}
