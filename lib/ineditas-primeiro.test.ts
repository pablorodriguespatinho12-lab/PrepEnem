import { describe, expect, it } from 'vitest';
import { ineditasPrimeiro } from './ineditas-primeiro';

const q = (id: string) => ({ id });

describe('prova nova: questões nunca vistas primeiro', () => {
  it('põe as já respondidas em outra prova no fim, mantendo a ordem do sorteio', () => {
    const sorteadas = [q('a'), q('b'), q('c'), q('d')];
    const ordem = ineditasPrimeiro(sorteadas, new Set(['a', 'c'])).map((x) => x.id);
    expect(ordem).toEqual(['b', 'd', 'a', 'c']);
  });

  it('sem histórico, não muda nada', () => {
    const sorteadas = [q('a'), q('b')];
    expect(ineditasPrimeiro(sorteadas, new Set()).map((x) => x.id)).toEqual(['a', 'b']);
  });

  it('não repete nem perde questão', () => {
    const sorteadas = [q('a'), q('b'), q('c')];
    const ordem = ineditasPrimeiro(sorteadas, new Set(['b', 'z']));
    expect(ordem).toHaveLength(3);
    expect(new Set(ordem.map((x) => x.id)).size).toBe(3);
  });
});
