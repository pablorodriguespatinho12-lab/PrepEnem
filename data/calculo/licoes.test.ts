import { describe, expect, test } from 'vitest';
import { LICOES_ESCRITAS } from './licoes';
import { TRILHA } from './trilha';
import { validarLicao } from '@/lib/calculo/validar';
import { conferirResposta } from '@/lib/calculo/tipos';
import { validarVisual } from '@/lib/visual/especificacao';

describe('trilha', () => {
  test('ids únicos e pré-requisitos apontam para degraus anteriores', () => {
    const vistos = new Set<string>();
    for (const d of TRILHA) {
      expect(vistos.has(d.id), d.id).toBe(false);
      for (const p of d.prerequisitos) expect(vistos.has(p), `${d.id} depende de ${p}, que vem depois`).toBe(true);
      vistos.add(d.id);
    }
  });
});

describe('lições escritas', () => {
  for (const [id, licao] of Object.entries(LICOES_ESCRITAS)) {
    test(`${id}: passa no mesmo validador das lições da IA, sem perder nada`, () => {
      const validada = validarLicao(licao);
      expect(validada).not.toBeNull();
      expect(validada!.construcao).toHaveLength(licao.construcao.length);
      expect(validada!.exercicios).toHaveLength(licao.exercicios.length);
    });

    test(`${id}: todo desenho é válido`, () => {
      const visuais = [
        ...licao.construcao.map((p) => p.visual),
        ...licao.exemplos.map((e) => e.visual),
        ...licao.exercicios.map((e) => e.visual),
      ].filter(Boolean);
      for (const v of visuais) expect(validarVisual(v), JSON.stringify(v).slice(0, 80)).not.toBeNull();
    });

    test(`${id}: está na trilha`, () => {
      expect(TRILHA.some((d) => d.id === id)).toBe(true);
    });
  }
});

describe('conferirResposta', () => {
  test('número aceita vírgula e tolerância pequena', () => {
    expect(conferirResposta({ tipo: 'numero', valor: 0.5 }, '0,5')).toBe(true);
    expect(conferirResposta({ tipo: 'numero', valor: 300 }, '300.1')).toBe(true);
    expect(conferirResposta({ tipo: 'numero', valor: 300 }, '301')).toBe(false);
    expect(conferirResposta({ tipo: 'numero', valor: 3 }, 'três')).toBe(false);
  });

  test('escolha compara o índice', () => {
    expect(conferirResposta({ tipo: 'escolha', opcoes: ['a', 'b'], correta: 1 }, 1)).toBe(true);
    expect(conferirResposta({ tipo: 'escolha', opcoes: ['a', 'b'], correta: 1 }, 0)).toBe(false);
  });
});
