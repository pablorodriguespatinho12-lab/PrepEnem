import { describe, expect, it } from 'vitest';
import { canteiroDeEstudo, DIAS_DO_CANTEIRO } from './canteiro';

const HOJE = new Date('2026-11-27T15:00:00Z');

describe('canteiroDeEstudo', () => {
  it('dá um canteiro por dia, terminando hoje', () => {
    const dias = canteiroDeEstudo({}, HOJE);
    expect(dias).toHaveLength(DIAS_DO_CANTEIRO);
    expect(dias.at(-1)?.data).toBe('27/11');
    expect(dias.every((d) => d.estagio === 0)).toBe(true);
  });

  it('a planta cresce com as questões do dia', () => {
    const estagios = [1, 8, 15].map((total) => canteiroDeEstudo({ '2026-11-27': { total } }, HOJE).at(-1)?.estagio);
    expect(estagios).toEqual([1, 2, 3]);
  });
});
