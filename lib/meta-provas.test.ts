import { describe, expect, it } from 'vitest';
import { META_PADRAO, metaValida, progressoDaMeta } from './meta-provas';

describe('meta de provas por dia', () => {
  it('conta quantas faltam e quando bateu', () => {
    expect(progressoDaMeta(0, 2)).toEqual({ feitas: 0, meta: 2, restam: 2, bateu: false });
    expect(progressoDaMeta(1, 2)).toEqual({ feitas: 1, meta: 2, restam: 1, bateu: false });
    expect(progressoDaMeta(2, 2)).toEqual({ feitas: 2, meta: 2, restam: 0, bateu: true });
  });

  it('passar da meta continua batida e não fica negativo', () => {
    expect(progressoDaMeta(5, 2)).toEqual({ feitas: 5, meta: 2, restam: 0, bateu: true });
  });

  it('número inválido vira zero', () => {
    expect(progressoDaMeta(-3, 2).feitas).toBe(0);
  });

  it('só aceita as opções de botão', () => {
    expect(META_PADRAO).toBe(2);
    expect(metaValida(3)).toBe(true);
    expect(metaValida(0)).toBe(false);
    expect(metaValida(2.5)).toBe(false);
    expect(metaValida('2')).toBe(false);
  });
});
