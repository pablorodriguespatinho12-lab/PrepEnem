import { describe, expect, it } from 'vitest';
import type { Etapa } from './treino-etapas';
import { montarAquecimento, tamanhoDoAquecimento } from './aquecimento';

const q = (id: string, etapa: Etapa) => ({ id, etapa });
const etapaDe = (x: { etapa: Etapa }) => x.etapa;

describe('aquecimento antes da prova', () => {
  it('prova Fácil não ganha aquecimento', () => {
    expect(tamanhoDoAquecimento('facil', 20)).toBe(0);
  });

  it('1 para cada 4 questões, no mínimo 3', () => {
    expect(tamanhoDoAquecimento('enem', 5)).toBe(3);
    expect(tamanhoDoAquecimento('enem', 20)).toBe(5);
    expect(tamanhoDoAquecimento('dificil', 45)).toBe(12);
  });

  it('prova ENEM aquece com fáceis antes das médias, nunca com real', () => {
    const sobras = [q('m1', 'medio'), q('e1', 'enem'), q('f1', 'facil'), q('d1', 'dificil'), q('f2', 'facil')];
    expect(montarAquecimento('enem', 10, sobras, etapaDe).map((x) => x.id)).toEqual(['f1', 'f2', 'm1']);
  });

  it('prova Médio aquece só com fáceis', () => {
    const sobras = [q('m1', 'medio'), q('f1', 'facil')];
    expect(montarAquecimento('medio', 10, sobras, etapaDe).map((x) => x.id)).toEqual(['f1']);
  });
});
