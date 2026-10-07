export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { maxSimilarity } from '@/lib/text-similarity';
import { chatCompletion } from '@/lib/ai-client';

// Abaixo disso, dois cards contam como o mesmo conceito repetido — limiar
// ajustável pelo chamador (query "limiar" ou body.limiarSimilaridade) pra
// calibrar sem precisar mexer em código.
const DEFAULT_SIMILARITY_THRESHOLD = 0.85;
const MAX_EXISTING_FRONTS_IN_PROMPT = 100;

// POST /api/flashcards/gerar - gera candidatos a flashcard via IA (NÃO salva).
// O cliente mostra um preview e decide o que aceitar; o que for aceito vai
// pra POST /api/flashcards/cards separadamente.
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const body = await request.json();
    const { deckId, quantidade = 10, topico } = body;
    const limiarSimilaridade =
      typeof body.limiarSimilaridade === 'number' && body.limiarSimilaridade > 0 && body.limiarSimilaridade <= 1
        ? body.limiarSimilaridade
        : DEFAULT_SIMILARITY_THRESHOLD;

    const deck = await prisma.flashcardDeck.findFirst({
      where: { id: deckId, OR: [{ userId: user.id }, ...(user.role === 'admin' ? [{ isDefault: true }] : [])] }, // baralho padrão é de todos: só admin escreve nele
    });
    if (!deck) return NextResponse.json({ error: 'Deck não encontrado' }, { status: 404 });

    const qty = Math.min(Math.max(Number.parseInt(String(quantidade), 10) || 10, 1), 30);

    const existingCards = await prisma.flashcard.findMany({
      where: { deckId: deck.id },
      select: { frente: true },
      orderBy: { createdAt: 'desc' },
      take: MAX_EXISTING_FRONTS_IN_PROMPT,
    });
    const existingFronts = existingCards.map((c) => c.frente);

    const topicoTrimmed = typeof topico === 'string' ? topico.trim().slice(0, 300) : '';

    const prompt = `Você é um especialista em ${deck.materia}${deck.subtema ? `, especificamente em ${deck.subtema}` : ''}, criando flashcards de estudo pro vestibular/ENEM.

Crie ${qty} flashcards${topicoTrimmed ? ` sobre: ${topicoTrimmed}` : ` sobre ${deck.subtema || deck.materia}`}.

PRINCÍPIO DA INFORMAÇÃO MÍNIMA (SuperMemo) — regra central, não é opcional:
- Um fato por card. Se a resposta natural tem dois fatos, isso é dois cards, não um.
- Resposta o mais curta possível — uma frase, idealmente uma palavra ou número quando o conceito permitir.
- Evite enumerações longas na resposta (ex.: listar as 5 causas de algo num "verso" só). Se o conceito é uma lista, quebre em cards separados (um por item) ou use formato cloze (frente com lacuna, verso só a palavra que falta).
- Evite cards ambíguos, ou dois cards tão parecidos entre si que causem confusão de qual resposta vai com qual pergunta (interferência de memória).

${existingFronts.length > 0 ? `JÁ EXISTEM cards neste deck com as seguintes perguntas — NÃO repita esses conceitos, gere só coisa nova:\n${existingFronts.map((f) => `- ${f}`).join('\n')}\n` : ''}
Cada flashcard:
- frente: pergunta curta e direta sobre um único conceito.
- verso: resposta mínima e objetiva (1 frase, no máximo 2).
- dica: opcional, um mnemônico ou pista curta.

Varie o tipo (definição, função, classificação, exemplo, processo, fórmula) mas sem forçar padrão repetitivo entre os cards.

Retorne APENAS um JSON válido:
{
  "cards": [
    { "frente": "...", "verso": "...", "dica": "..." }
  ]
}`;

    const result = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      responseFormat: { type: 'json_object' },
      maxTokens: 5000,
    });
    if (!result.ok) return result.response;

    let content = result.data.choices?.[0]?.message?.content ?? '{}';
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

    // Camada 2 de dedup: filtra candidato cuja frente é similar demais a um
    // card já existente OU a outro candidato já aceito nesta mesma leva
    // (a IA às vezes gera duas variações do mesmo conceito no mesmo lote).
    const accepted: { frente: string; verso: string; dica: string | null }[] = [];
    let descartadosPorDuplicata = 0;
    for (const raw of parsed.cards) {
      const frente = String(raw?.frente ?? '').trim().slice(0, 1000);
      const verso = String(raw?.verso ?? '').trim().slice(0, 2000);
      if (!frente || !verso) continue;

      const comparaContra = [...existingFronts, ...accepted.map((c) => c.frente)];
      const similaridade = maxSimilarity(frente, comparaContra);
      if (similaridade >= limiarSimilaridade) {
        descartadosPorDuplicata++;
        continue;
      }

      accepted.push({
        frente,
        verso,
        dica: raw?.dica ? String(raw.dica).trim().slice(0, 500) : null,
      });
    }

    return NextResponse.json({ candidatos: accepted, descartadosPorDuplicata });
  } catch (error: any) {
    console.error('Erro ao gerar cards:', error);
    return NextResponse.json({ error: 'Erro ao gerar cards' }, { status: 500 });
  }
}
