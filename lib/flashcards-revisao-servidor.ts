// Busca no banco (SÓ LEITURA) dos cartões que o aluno já respondeu, com a situação de hoje.
import { prisma } from '@/lib/db';
import { situacaoDoCartao, type RespostaCartao } from '@/lib/flashcard-dominio';
import type { CartaoDaRevisao } from '@/lib/flashcards-revisao';

export async function cartoesRespondidos(userId: string, agora: Date) {
  const respostas = await prisma.flashcardProgress.findMany({
    where: { userId },
    orderBy: { dataResposta: 'desc' },
    select: { cardId: true, acertou: true, precisaRevisar: true, dataResposta: true },
  });
  const historico = new Map<string, RespostaCartao[]>();
  const ultimaErrada = new Set<string>();
  for (const r of respostas) {
    if (!historico.has(r.cardId)) {
      historico.set(r.cardId, []);
      if (r.precisaRevisar) ultimaErrada.add(r.cardId);
    }
    historico.get(r.cardId)!.push(r);
  }
  const ids = [...historico.keys()];
  if (!ids.length) return [];

  const cartoes = await prisma.flashcard.findMany({
    where: { id: { in: ids }, deck: { OR: [{ isDefault: true }, { userId }] } },
    select: { id: true, frente: true, verso: true, dica: true, ordem: true, deckId: true, capitulo: true, deck: { select: { materia: true, nome: true, subtema: true, capituloLido: true } } },
  });
  return cartoes
    .filter((c) => c.capitulo == null || c.capitulo <= c.deck.capituloLido)
    .map((c) => {
      const s = situacaoDoCartao(historico.get(c.id) ?? [], agora);
      const base: CartaoDaRevisao = {
        id: c.id,
        jaRespondido: true,
        naFilaHoje: s.naFilaHoje,
        precisaRevisar: ultimaErrada.has(c.id),
        proximaRevisao: s.proximaRevisao,
      };
      return { ...c, ...base, materia: c.deck.materia, subtema: c.deck.subtema ?? c.deck.nome, acertosSeguidos: s.acertosSeguidos };
    });
}
