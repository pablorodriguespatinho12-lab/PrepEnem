import { describe, expect, it } from 'vitest';
import { TEMAS_COM_DESENHO, desenhoDoTema } from '@/lib/aulas-desenho';
import { TEMAS_COM_AULA } from '@/lib/aulas-dia-2';
import { PROPORCOES, DESENHO_LOGICA } from '@/lib/aulas-desenho-dados.js';

// As aulas em desenho cobrem os mesmos 22 temas das provas do dia 2, no formato que a tela espera.
describe('aulas em desenho', () => {
  it('um desenho para cada tema das provas, e nenhum a mais', () => {
    expect([...TEMAS_COM_DESENHO].sort()).toEqual([...TEMAS_COM_AULA].sort());
  });

  it('cada desenho tem svg, peças em par, sentido e conta', () => {
    for (const tema of TEMAS_COM_DESENHO) {
      const d = desenhoDoTema(tema)!;
      expect(d.svg, tema).toMatch(/^<svg viewBox="0 0 \d+ \d+" role="img" aria-label="[^"]+">/);
      expect(d.svg, tema).not.toMatch(/\$\{|undefined|NaN/);
      expect(d.pecas.length, tema).toBeGreaterThanOrEqual(3);
      for (const p of d.pecas) expect(p, tema).toHaveLength(2);
      expect(d.sentido.length, tema).toBeGreaterThan(40);
      expect(d.conta, tema).toMatch(/^<strong>/);
    }
  });

  it('"Direta ou inversa" só em tema que existe, com tipo válido', () => {
    for (const [tema, lista] of Object.entries(PROPORCOES)) {
      expect(TEMAS_COM_DESENHO, tema).toContain(tema);
      for (const [tipo, par, exemplo] of lista) {
        expect(['direta', 'inversa', 'outra'], tema).toContain(tipo);
        expect(par.length, tema).toBeGreaterThan(2);
        expect(exemplo.length, tema).toBeGreaterThan(10);
      }
    }
    for (const tema of Object.keys(DESENHO_LOGICA)) expect(PROPORCOES, tema).toHaveProperty([tema]);
  });

  it('eletricidade ensina que mais resistência dá menos corrente', () => {
    const d = desenhoDoTema('Eletricidade e Circuitos')!;
    expect(d.proporcoes.find((p) => p.par === 'R e i')?.tipo).toBe('inversa');
    expect(d.desenhoLogica).toMatch(/R grande/);
  });
});
