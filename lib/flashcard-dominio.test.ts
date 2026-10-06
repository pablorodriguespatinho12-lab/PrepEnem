import { describe, expect, test } from 'vitest';
import { situacaoDoCartao, ACERTOS_PARA_DOMINAR } from './flashcard-dominio';

const agora = new Date('2026-10-10T15:00:00Z');
const dia = (d: number, acertou: boolean) => ({ acertou, dataResposta: new Date(`2026-10-${String(d).padStart(2, '0')}T15:00:00Z`) });

describe('situacaoDoCartao', () => {
  test('cartão novo: 0 acertos, entra na fila', () => {
    expect(situacaoDoCartao([], agora)).toEqual({ acertosSeguidos: 0, dominado: false, naFilaHoje: true });
  });

  test('acertou hoje: conta 1 e espera amanhã', () => {
    expect(situacaoDoCartao([dia(10, true)], agora)).toEqual({ acertosSeguidos: 1, dominado: false, naFilaHoje: false });
  });

  test('acertou ontem: volta hoje', () => {
    expect(situacaoDoCartao([dia(9, true)], agora).naFilaHoje).toBe(true);
  });

  test('dois acertos no mesmo dia contam como um', () => {
    expect(situacaoDoCartao([dia(9, true), dia(9, true)], agora).acertosSeguidos).toBe(1);
  });

  test(`${ACERTOS_PARA_DOMINAR} acertos em dias diferentes: dominado, sai da fila`, () => {
    const r = situacaoDoCartao([dia(9, true), dia(7, true), dia(5, true)], agora);
    expect(r).toEqual({ acertosSeguidos: 3, dominado: true, naFilaHoje: false });
  });

  test('erro zera a contagem e o cartão volta na hora', () => {
    const r = situacaoDoCartao([dia(10, false), dia(9, true), dia(7, true)], agora);
    expect(r).toEqual({ acertosSeguidos: 0, dominado: false, naFilaHoje: true });
  });

  test('conta só os acertos depois do último erro, em qualquer ordem de entrada', () => {
    const r = situacaoDoCartao([dia(5, true), dia(8, true), dia(6, false), dia(9, true)], agora);
    expect(r.acertosSeguidos).toBe(2);
  });
});
