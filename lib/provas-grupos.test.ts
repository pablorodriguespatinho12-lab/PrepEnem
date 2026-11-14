import { describe, expect, it } from 'vitest';
import { agruparProvas, TITULO_OUTRAS, TITULO_POR_CONTEUDO } from './provas-grupos';

describe('agruparProvas', () => {
  it('põe as provas por conteúdo antes das por nível, mesmo criadas depois', () => {
    const exams = [
      { nome: 'Dia 2 · 1 Fácil', nivel: 'facil' },
      { nome: 'Dia 2 por conteúdo · Química', nivel: 'escada' },
      { nome: 'Dia 2 · 4 ENEM real', nivel: 'enem' },
    ];
    const grupos = agruparProvas(exams);
    expect(grupos.map((g) => g.titulo)).toEqual([TITULO_POR_CONTEUDO, TITULO_OUTRAS]);
    expect(grupos[0].lista.map((e) => e.nome)).toEqual(['Dia 2 por conteúdo · Química']);
    expect(grupos[1].lista).toHaveLength(2);
  });

  it('não mostra grupo vazio', () => {
    expect(agruparProvas([{ nivel: 'facil' }]).map((g) => g.titulo)).toEqual([TITULO_OUTRAS]);
  });
});
