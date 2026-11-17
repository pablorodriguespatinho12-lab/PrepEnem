import { describe, expect, it } from 'vitest';
import { agruparProvas, degrauDaProva, TITULO_OUTRAS } from './provas-grupos';

describe('agruparProvas', () => {
  it('agrupa por matéria, na ordem do dia e da escada; o resto vai para Outras', () => {
    const exams = [
      { nivel: 'escada', nome: 'Química 1 · Atomística e Ligações' },
      { nivel: 'escada', nome: 'Física 2 · Dinâmica e Leis de Newton' },
      { nivel: 'revisao', nome: 'Revisão de erros' },
      { nivel: 'escada', nome: 'Física 1 · Cinemática' },
    ];
    const grupos = agruparProvas(exams);
    expect(grupos.map((g) => g.titulo)).toEqual(['Física', 'Química', TITULO_OUTRAS]);
    expect(grupos[0].lista.map((e) => e.nome)).toEqual(['Física 1 · Cinemática', 'Física 2 · Dinâmica e Leis de Newton']);
  });

  it('prova de escada com nome fora do molde vai para Outras', () => {
    expect(agruparProvas([{ nivel: 'escada', nome: 'Jeito novo · toalha e disco' }]).map((g) => g.titulo)).toEqual([TITULO_OUTRAS]);
  });

  it('sabe o que precisa vir antes', () => {
    expect(degrauDaProva('Física 2 · Dinâmica e Leis de Newton')?.degrau.precisaAntes).toBe('Cinemática');
    expect(degrauDaProva('Física 6 · Eletricidade e Circuitos')?.degrau.precisaAntes).toBeNull();
  });
});
