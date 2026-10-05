import { describe, expect, test } from 'vitest';
import { aplicarTravas, arredondarNivel, linhasAproximadas, notaC1, notaC5, total, type Travas } from './grade';

describe('notaC1', () => {
  test('200 só com estrutura excelente e no máximo 2 desvios', () => {
    expect(notaC1('excelente', 2)).toBe(200);
    expect(notaC1('excelente', 3)).toBe(160);
    expect(notaC1('boa', 0)).toBe(160);
  });

  test('fica no nível de baixo quando estrutura e desvios discordam', () => {
    expect(notaC1('regular', 1)).toBe(120);
    expect(notaC1('excelente', 12)).toBe(80);
  });

  test('deficitária e muitos desvios desce para 40; inexistente é 0', () => {
    expect(notaC1('deficitaria', 3)).toBe(80);
    expect(notaC1('deficitaria', 20)).toBe(40);
    expect(notaC1('inexistente', 0)).toBe(0);
  });
});

describe('notaC5', () => {
  const todos = { agente: true, acao: true, modo: true, efeito: true, detalhamento: true };

  test('40 por elemento válido', () => {
    expect(notaC5(todos)).toBe(200);
    expect(notaC5({ ...todos, modo: false, detalhamento: false })).toBe(120);
  });

  test('direitos humanos zera; condicional trava em 80', () => {
    expect(notaC5(todos, { desrespeitaDH: true })).toBe(0);
    expect(notaC5(todos, { condicional: true })).toBe(80);
  });
});

describe('aplicarTravas', () => {
  const base: Travas = {
    abordagem: 'completa', outroTipoTextual: false, copiaMotivadores: false, monobloco: false,
    contradicaoGrave: false, inadequacaoCoesiva: false, operadoresEntreParagrafos: 3, todoParagrafoTemCoesivo: true,
  };
  const mil = { c1: 200, c2: 200, c3: 200, c4: 200, c5: 200 } as const;

  test('sem trava, nada muda', () => {
    const r = aplicarTravas({ ...mil }, base);
    expect(total(r.notas)).toBe(1000);
    expect(r.motivos).toEqual([]);
  });

  test('fuga ao tema zera tudo', () => {
    expect(total(aplicarTravas({ ...mil }, { ...base, abordagem: 'fuga' }).notas)).toBe(0);
  });

  test('tangenciar trava C2, C3 e C5 em 40', () => {
    const r = aplicarTravas({ ...mil }, { ...base, abordagem: 'tangencia' });
    expect(r.notas).toEqual({ c1: 200, c2: 40, c3: 40, c4: 200, c5: 40 });
    expect(r.motivos).toHaveLength(1);
  });

  test('C4 no 200 exige operadores e nenhuma inadequação', () => {
    expect(aplicarTravas({ ...mil }, { ...base, inadequacaoCoesiva: true }).notas.c4).toBe(160);
    expect(aplicarTravas({ ...mil }, { ...base, operadoresEntreParagrafos: 0 }).notas.c4).toBe(120);
    expect(aplicarTravas({ ...mil }, { ...base, monobloco: true }).notas.c4).toBe(80);
  });
});

describe('utilidades', () => {
  test('arredonda para o nível mais próximo', () => {
    expect(arredondarNivel(170)).toBe(160);
    expect(arredondarNivel('x')).toBe(0);
  });

  test('conta linhas aproximadas por parágrafo', () => {
    expect(linhasAproximadas('a'.repeat(140) + '\n\n' + 'b'.repeat(10))).toBe(3);
  });
});
