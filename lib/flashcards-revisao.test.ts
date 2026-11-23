import { describe, expect, test } from 'vitest';
import { escolherRevisao, MAX_REVISAO_POR_DIA, type CartaoDaRevisao } from './flashcards-revisao';

const c = (id: string, extra: Partial<CartaoDaRevisao> = {}): CartaoDaRevisao =>
  ({ id, jaRespondido: true, naFilaHoje: true, precisaRevisar: false, proximaRevisao: '2026-11-20', ...extra });

describe('escolherRevisao', () => {
  test('cartão nunca respondido não é revisão', () => {
    expect(escolherRevisao([c('novo', { jaRespondido: false })])).toEqual([]);
  });

  test('cartão que ainda não venceu fica fora', () => {
    expect(escolherRevisao([c('cedo', { naFilaHoje: false })])).toEqual([]);
  });

  test('errados primeiro, depois o mais atrasado', () => {
    const r = escolherRevisao([
      c('recente', { proximaRevisao: '2026-11-22' }),
      c('atrasado', { proximaRevisao: '2026-11-10' }),
      c('errado', { precisaRevisar: true, proximaRevisao: null }),
    ]);
    expect(r.map((x) => x.id)).toEqual(['errado', 'atrasado', 'recente']);
  });

  test('corta no máximo do dia', () => {
    const muitos = Array.from({ length: MAX_REVISAO_POR_DIA + 5 }, (_, i) => c(`c${i}`));
    expect(escolherRevisao(muitos)).toHaveLength(MAX_REVISAO_POR_DIA);
  });
});
