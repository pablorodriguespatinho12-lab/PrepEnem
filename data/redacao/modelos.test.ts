import { describe, expect, test } from 'vitest';
import { MODELOS, ORDEM_PARTES, textoBaseSemParte } from './modelos';

describe('redações-modelo', () => {
  test('todo trecho anotado existe literalmente no parágrafo', () => {
    for (const m of MODELOS) {
      for (const p of ORDEM_PARTES) {
        for (const a of m.partes[p].anotacoes) {
          expect(m.partes[p].texto, `${m.id}/${p}: "${a.trecho}"`).toContain(a.trecho);
        }
      }
    }
  });

  test('toda conclusão tem os 5 elementos da proposta (C5 = 200)', () => {
    for (const m of MODELOS) {
      const papeis = new Set(m.partes.conclusao.anotacoes.map((a) => a.papel));
      for (const e of ['agente', 'acao', 'modo', 'efeito', 'detalhamento'] as const) {
        expect(papeis.has(e), `${m.id} sem ${e}`).toBe(true);
      }
    }
  });

  test('introdução tem repertório, tese e anúncio; desenvolvimentos têm operador e tópico', () => {
    for (const m of MODELOS) {
      const intro = new Set(m.partes.introducao.anotacoes.map((a) => a.papel));
      expect([...intro]).toEqual(expect.arrayContaining(['repertorio', 'tese', 'anuncio']));
      for (const d of ['desenvolvimento1', 'desenvolvimento2'] as const) {
        const papeis = new Set(m.partes[d].anotacoes.map((a) => a.papel));
        expect([...papeis], `${m.id}/${d}`).toEqual(expect.arrayContaining(['operador', 'topico', 'repertorio']));
      }
    }
  });

  test('ids únicos e texto-base marca só a parte retirada', () => {
    expect(new Set(MODELOS.map((m) => m.id)).size).toBe(MODELOS.length);
    const base = textoBaseSemParte(MODELOS[0], 'desenvolvimento1');
    expect(base).toContain('[DESENVOLVIMENTO 1: escreva esta parte]');
    expect(base).not.toContain(MODELOS[0].partes.desenvolvimento1.texto);
    expect(base).toContain(MODELOS[0].partes.conclusao.texto);
  });
});
