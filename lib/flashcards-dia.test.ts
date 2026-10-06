import { describe, expect, test } from 'vitest';
import { escolherCartoesDoDia, type CartaoCandidato } from './flashcards-dia';

const c = (id: string, materia: string, subtema: string, extra: Partial<CartaoCandidato> = {}): CartaoCandidato =>
  ({ id, materia, subtema, naFilaHoje: true, precisaRevisar: false, ...extra });

describe('escolherCartoesDoDia', () => {
  test('até N de cada matéria do dia, na ordem das matérias', () => {
    const cartoes = [
      ...Array.from({ length: 15 }, (_, i) => c(`f${i}`, 'Física', 'Cinemática')),
      ...Array.from({ length: 15 }, (_, i) => c(`p${i}`, 'Português', 'Crase')),
      c('b1', 'Biologia', 'Células'),
    ];
    const dia = escolherCartoesDoDia(cartoes, [{ materia: 'Física', subtemas: [] }, { materia: 'Português', subtemas: [] }], 10);
    expect(dia.filter((x) => x.materia === 'Física')).toHaveLength(10);
    expect(dia.filter((x) => x.materia === 'Português')).toHaveLength(10);
    expect(dia.some((x) => x.materia === 'Biologia')).toBe(false);
    expect(dia[0].materia).toBe('Física');
    expect(dia[10].materia).toBe('Português');
  });

  test('errados primeiro, depois o assunto do dia; dominados e respondidos hoje ficam de fora', () => {
    const cartoes = [
      c('outro', 'Química', 'Pilhas'),
      c('assunto', 'Química', 'Mol e massa molar'),
      c('errado', 'Química', 'Pilhas', { precisaRevisar: true }),
      c('dominado', 'Química', 'Mol e massa molar', { naFilaHoje: false }),
    ];
    const dia = escolherCartoesDoDia(cartoes, [{ materia: 'Química', subtemas: ['Mol'] }], 10);
    expect(dia.map((x) => x.id)).toEqual(['errado', 'assunto', 'outro']);
  });
});
