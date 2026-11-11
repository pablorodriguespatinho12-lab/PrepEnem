import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TEMAS_COM_AULA, aulaDoTema } from '@/lib/aulas-dia-2';

// O botão "Não sei isso" das provas do dia 2 acha a aula pelo tema da questão.
const PASTA = join(process.cwd(), 'data/revisao-final/dia-2');
const ARQUIVOS = ['facil', 'medio', 'dificil', 'enem'].flatMap((n) => [`${n}-natureza.json`, `${n}-matematica.json`]);
const questoes = ARQUIVOS.flatMap(
  (f) => JSON.parse(readFileSync(join(PASTA, f), 'utf8')) as { tema: string; enunciado: string }[],
);

describe('aulas do dia 2', () => {
  it('toda questão das 4 provas tem aula, e toda aula tem questão', () => {
    const temas = new Set(questoes.map((q) => q.tema));
    expect([...temas].sort()).toEqual([...TEMAS_COM_AULA].sort());
  });

  it('cada aula tem frases, e degraus Médio e Difícil com gabarito válido', () => {
    for (const tema of TEMAS_COM_AULA) {
      const a = aulaDoTema(tema)!;
      expect(a.aula.length, tema).toBeGreaterThanOrEqual(3);
      const niveis = a.degraus.map((d) => d.nivel);
      expect(niveis, tema).toContain('Médio');
      expect(niveis, tema).toContain('Difícil');
      for (const d of a.degraus) {
        expect(d.alternativas, tema).toHaveLength(5);
        expect(d.certa, tema).toBeGreaterThanOrEqual(0);
        expect(d.certa, tema).toBeLessThan(5);
      }
    }
  });

  it('nenhum degrau repete questão das provas (não estraga a surpresa)', () => {
    const naProva = new Set(questoes.map((q) => q.enunciado.slice(0, 60)));
    for (const tema of TEMAS_COM_AULA) {
      for (const d of aulaDoTema(tema)!.degraus) expect(naProva.has(d.enunciado.slice(0, 60)), tema).toBe(false);
    }
  });

  it('tema desconhecido não tem aula', () => {
    expect(aulaDoTema('Literatura')).toBeNull();
    expect(aulaDoTema(null)).toBeNull();
  });
});
