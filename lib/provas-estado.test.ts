import { describe, expect, it } from 'vitest';
import { estadoDaProva, provaParaContinuar, type ProvaDoQuadro } from './provas-estado';

const prova = (p: Partial<ProvaDoQuadro>): ProvaDoQuadro => ({
  id: 'a', nome: 'P', nivel: 'escada', status: 'pendente', totalQuestoes: 12, currentIdx: 0, acertos: 0,
  updatedAt: '2026-11-01T00:00:00Z', ...p,
});

describe('estadoDaProva', () => {
  it('diz quanto falta, quanto acertou ou quantas questões tem', () => {
    expect(estadoDaProva(prova({})).texto).toBe('12 questões');
    expect(estadoDaProva(prova({ status: 'em_andamento', currentIdx: 3 }))).toEqual({ texto: '3 de 12', progresso: 0.25 });
    expect(estadoDaProva(prova({ status: 'finalizada', acertos: 9 })).texto).toBe('Feita · 75% acertos');
  });

  it('com menos de 5 questões não mostra porcentagem', () => {
    expect(estadoDaProva(prova({ status: 'finalizada', totalQuestoes: 4, acertos: 4 })).texto).toBe('Feita');
  });
});

describe('provaParaContinuar', () => {
  it('pega a começada mais recente; sem nenhuma, nada', () => {
    const velha = prova({ id: 'v', status: 'em_andamento' });
    const nova = prova({ id: 'n', status: 'em_andamento', updatedAt: '2026-11-20T00:00:00Z' });
    expect(provaParaContinuar([velha, nova, prova({ id: 'x' })])?.id).toBe('n');
    expect(provaParaContinuar([prova({})])).toBeNull();
  });
});
