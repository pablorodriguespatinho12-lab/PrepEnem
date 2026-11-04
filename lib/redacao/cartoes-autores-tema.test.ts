import { describe, expect, test } from 'vitest';
import dados from './coringas-por-tema.json';
import { cartoesDosAutoresPorTema } from './cartoes-autores-tema';

describe('baralho dos autores por tema', () => {
  const cartoes = cartoesDosAutoresPorTema();
  const temas = Object.keys(dados);

  test('um cartão por tema da prova', () => {
    expect(cartoes).toHaveLength(temas.length);
    for (const t of temas) expect(cartoes.some((c) => c.frente.includes(t)), t).toBe(true);
  });

  test('o verso só traz quem serviu no tema, no máximo 3, sem o Drummond', () => {
    const veredito = dados as Record<string, Record<string, { serve: boolean }>>;
    for (const [i, t] of temas.entries()) {
      const verso = cartoes[i].verso;
      expect(verso).not.toContain('Drummond');
      const nomes = verso.replace(/\.$/, '').split(/, | e /);
      expect(nomes.length).toBeLessThanOrEqual(3);
      const reprovados = Object.entries(veredito[t]).filter(([, v]) => !v.serve).map(([k]) => k);
      for (const r of reprovados) expect(verso.includes(r), `${t}: ${r}`).toBe(false);
    }
  });

  test('violência contra a mulher: Rui Barbosa, Dom Hélder e Elie Wiesel', () => {
    const c = cartoes.find((x) => x.frente.includes('violência contra a mulher'))!;
    expect(c.verso).toBe('Rui Barbosa, Dom Hélder e Elie Wiesel.');
  });

  test('a dica nunca entrega um nome do verso', () => {
    const palavras = (s: string) => s.toLowerCase().match(/\p{L}{5,}/gu) ?? [];
    for (const c of cartoes) {
      expect(c.dica).not.toBe('');
      for (const p of palavras(c.dica)) expect(c.verso.toLowerCase().includes(p), `${c.frente}: "${p}"`).toBe(false);
    }
  });
});
