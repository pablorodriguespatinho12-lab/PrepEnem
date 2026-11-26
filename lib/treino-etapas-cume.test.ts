import { describe, expect, it } from 'vitest';
import { etapaDaQuestao, rotuloDaQuestao } from './treino-etapas';

describe('questão do nível Cume', () => {
  const q = { nivel: 'cume', dificuldade: 'dificil', anoProva: null, origem: 'ITA 2025, 1ª fase, q. 8' };
  it('mostra o selo Cume, nunca Médio', () => expect(rotuloDaQuestao(q)).toBe('Cume'));
  it('fica no degrau mais alto, fora do treino comum', () => expect(etapaDaQuestao(q)).toBe('acima'));
});
