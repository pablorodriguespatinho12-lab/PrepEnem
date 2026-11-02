import { describe, expect, test } from 'vitest';
import { autoresNoTema } from './coringas-por-tema';

const ESTIGMA = 'O estigma associado às doenças mentais na sociedade brasileira';

describe('autoresNoTema', () => {
  test('acha o tema do ENEM mesmo sem acento e com maiúscula', () => {
    expect(autoresNoTema('o estigma associado as doencas mentais na sociedade brasileira')).not.toBeNull();
  });
  test('tema digitado fora da lista volta null', () => {
    expect(autoresNoTema('Meu tema inventado')).toBeNull();
  });
  test('quem serve vem primeiro e traz as 3 partes no próprio tema', () => {
    const autores = autoresNoTema(ESTIGMA)!;
    const primeiroQueNaoServe = autores.findIndex((a) => !a.serve);
    expect(autores.slice(primeiroQueNaoServe).every((a) => !a.serve)).toBe(true);
    for (const a of autores.filter((x) => x.serve)) {
      expect(a.citacao && a.sentido && a.ligacao).toBeTruthy();
    }
  });
  test('Drummond serve no estigma e a ligação fala do tema', () => {
    const d = autoresNoTema(ESTIGMA)!.find((a) => a.coringa === 'Drummond')!;
    expect(d.serve).toBe(true);
    expect(d.citacao).toContain('As leis não bastam');
    expect(d.ligacao).toMatch(/mental|mentais|psiqui/i);
  });
  test('o dado de 1888 não serve no estigma', () => {
    expect(autoresNoTema(ESTIGMA)!.find((a) => a.coringa === 'Dado 1888')!.serve).toBe(false);
  });
});
