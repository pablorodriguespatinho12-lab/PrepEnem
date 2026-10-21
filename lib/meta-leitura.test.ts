import { describe, expect, test } from 'vitest';
import { metaDePaginas } from './meta-leitura';
const PLANO = { inicio: '2026-10-21', paginasIniciais: 4, teto: 15 };
describe('metaDePaginas', () => {
  test('primeiro dia é 4 páginas', () => {
    expect(metaDePaginas(PLANO, new Date('2026-10-21T15:00:00Z'))).toBe(4);
  });
  test('sobe 1 por dia', () => {
    expect(metaDePaginas(PLANO, new Date('2026-10-22T15:00:00Z'))).toBe(5);
    expect(metaDePaginas(PLANO, new Date('2026-10-28T15:00:00Z'))).toBe(11);
  });
  test('para em 15 a partir do 12º dia', () => {
    expect(metaDePaginas(PLANO, new Date('2026-11-01T15:00:00Z'))).toBe(15);
    expect(metaDePaginas(PLANO, new Date('2027-01-10T15:00:00Z'))).toBe(15);
  });
  test('22h de Brasília ainda conta como o mesmo dia', () => {
    expect(metaDePaginas(PLANO, new Date('2026-10-22T01:30:00Z'))).toBe(4);
  });
  test('antes do início fica no número inicial', () => {
    expect(metaDePaginas(PLANO, new Date('2026-10-01T15:00:00Z'))).toBe(4);
  });
});
