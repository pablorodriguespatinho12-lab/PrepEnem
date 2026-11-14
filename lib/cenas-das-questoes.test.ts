import { describe, expect, it } from 'vitest';
import { QUESTOES_COM_CENA, cenaDaQuestao } from './cenas-das-questoes';

describe('cena da situação da questão', () => {
  it('toda cena do mapa existe e tem no máximo 4 rótulos curtos', () => {
    expect(QUESTOES_COM_CENA.length).toBeGreaterThanOrEqual(8);
    for (const id of QUESTOES_COM_CENA) {
      const c = cenaDaQuestao(id);
      expect(c, id).not.toBeNull();
      expect(c!.rotulos.length, id).toBeLessThanOrEqual(4);
      expect(c!.rotulos.every((r) => r.length <= 24), id).toBe(true);
    }
  });

  it('questão sem cena não mostra nada', () => {
    expect(cenaDaQuestao('nao-existe')).toBeNull();
    expect(cenaDaQuestao(undefined)).toBeNull();
  });
});
