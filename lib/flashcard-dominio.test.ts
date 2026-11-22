import { describe, expect, test } from 'vitest';
import { situacaoDoCartao, ACERTOS_PARA_DOMINAR, intervaloDepoisDe, somaDias } from './flashcard-dominio';

const agora = new Date('2026-10-10T15:00:00Z');
const dia = (d: number, acertou: boolean) => ({ acertou, dataResposta: new Date(`2026-10-${String(d).padStart(2, '0')}T15:00:00Z`) });

describe('situacaoDoCartao', () => {
  test('cartão novo: 0 acertos, entra na fila', () => {
    expect(situacaoDoCartao([], agora)).toEqual({ acertosSeguidos: 0, dominado: false, naFilaHoje: true, proximaRevisao: null });
  });

  test('acertou hoje: conta 1 e espera amanhã', () => {
    expect(situacaoDoCartao([dia(10, true)], agora)).toEqual({ acertosSeguidos: 1, dominado: false, naFilaHoje: false, proximaRevisao: '2026-10-11' });
  });

  test('acertou ontem: volta hoje', () => {
    expect(situacaoDoCartao([dia(9, true)], agora).naFilaHoje).toBe(true);
  });

  test('dois acertos no mesmo dia contam como um', () => {
    expect(situacaoDoCartao([dia(9, true), dia(9, true)], agora).acertosSeguidos).toBe(1);
  });

  test(`${ACERTOS_PARA_DOMINAR} acertos em dias diferentes: dominado, e só volta 7 dias depois do último`, () => {
    const r = situacaoDoCartao([dia(9, true), dia(7, true), dia(5, true)], agora);
    expect(r).toEqual({ acertosSeguidos: 3, dominado: true, naFilaHoje: false, proximaRevisao: '2026-10-16' });
  });

  test('dominado volta quando passa o intervalo (não some para sempre)', () => {
    const respostas = [dia(9, true), dia(7, true), dia(5, true)];
    expect(situacaoDoCartao(respostas, new Date('2026-10-15T15:00:00Z')).naFilaHoje).toBe(false);
    expect(situacaoDoCartao(respostas, new Date('2026-10-16T15:00:00Z')).naFilaHoje).toBe(true);
  });

  test('2 acertos: volta em 3 dias', () => {
    const r = situacaoDoCartao([dia(9, true), dia(8, true)], agora);
    expect(r.proximaRevisao).toBe('2026-10-12');
    expect(r.naFilaHoje).toBe(false);
  });

  test('erro zera a contagem e o cartão volta na hora', () => {
    const r = situacaoDoCartao([dia(10, false), dia(9, true), dia(7, true)], agora);
    expect(r).toEqual({ acertosSeguidos: 0, dominado: false, naFilaHoje: true, proximaRevisao: null });
  });

  test('conta só os acertos depois do último erro, em qualquer ordem de entrada', () => {
    const r = situacaoDoCartao([dia(5, true), dia(8, true), dia(6, false), dia(9, true)], agora);
    expect(r.acertosSeguidos).toBe(2);
  });
});

describe('intervalos', () => {
  test('crescem e param no último', () => {
    expect([1, 2, 3, 4, 5, 9].map(intervaloDepoisDe)).toEqual([1, 3, 7, 21, 45, 45]);
  });

  test('somaDias passa de mês', () => {
    expect(somaDias('2026-10-30', 3)).toBe('2026-11-02');
  });
});
