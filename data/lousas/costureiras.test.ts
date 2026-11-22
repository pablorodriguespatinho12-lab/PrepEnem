import { describe, expect, test } from 'vitest';
import { validarLousa } from '@/lib/aula-lousa/validar';
import type { Cena } from '@/lib/aula-lousa/tipos';
import { aulaCostureiras } from './costureiras';

const CAPA: Cena = { tipo: 'lousa', fala: [[0.3, 'Capa.']], desenho: [{ k: 'tx', x: 200, y: 120, s: 'Grandezas', cor: 'tinta', tam: 40, t: 0.2 }] };
const PAPEL: Cena = { tipo: 'papel', fala: [[0.3, 'Questão.']], rotulo: 'A questão', texto: 'Texto.', alternativas: ['6.', '7,5.'] };
const aula = aulaCostureiras(CAPA, PAPEL);

describe('lousa das costureiras (jeito do Pablo)', () => {
  test('o porteiro aceita todas as telas sem cortar nada', () => {
    const v = validarLousa(aula);
    expect(v).not.toBeNull();
    expect(v!.cenas).toHaveLength(aula.cenas.length);
    for (let i = 0; i < aula.cenas.length; i++) {
      const [antes, depois] = [aula.cenas[i], v!.cenas[i]];
      if (antes.tipo === 'lousa' && depois.tipo === 'lousa') expect(depois.desenho).toHaveLength(antes.desenho.length);
    }
  });

  test('a equação em frações fecha em 6 dias (e as outras letras vêm de contas erradas)', () => {
    const x = 6;
    expect((8 / 10) * (6 / 8) * (5 / x)).toBeCloseTo(240 / 480, 10);
    expect(5 * (480 / 240) * (8 / 10) * (6 / 8)).toBeCloseTo(x, 10);
    expect(5 * 2 * (6 / 8)).toBeCloseTo(7.5, 10); // esqueceu as costureiras
    expect(5 * 2 * (8 / 10)).toBeCloseTo(8, 10); // esqueceu as horas
    expect(5 * 2).toBe(10); // só as camisetas
    expect(5 * 2 * (10 / 8)).toBeCloseTo(12.5, 10); // costureiras como direta, sem as horas
  });

  test('a conferência por horas de trabalho dá o mesmo resultado', () => {
    expect(8 * 6 * 5).toBe(240);
    expect(480 / (10 * 8)).toBe(6);
  });

  test('cabe na lousa: até 300 letras de fala por tela', () => {
    for (const c of aula.cenas) expect(c.fala.reduce((n, f) => n + f[1].length, 0)).toBeLessThanOrEqual(300);
  });
});
