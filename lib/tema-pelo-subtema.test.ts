import { describe, expect, it } from 'vitest';
import { temaPeloSubtema } from './tema-pelo-subtema';
import { ESCADAS } from '../data/escadas';

describe('temaPeloSubtema', () => {
  it.each([
    ['Física', 'Lançamento horizontal e movimento de projéteis', 'Cinemática'],
    ['Física', 'Potência elétrica e aquecimento resistivo', 'Eletricidade e Circuitos'],
    ['Matemática', 'Funções trigonométricas', 'Funções'],
    ['Matemática', 'Mediana e interpretação de gráfico', 'Estatística'],
    ['Português', 'Interpretação de texto e crítica aos papéis de gênero', 'Interpretação de Texto'],
    ['Português', 'Crase', 'Gramática e Coesão'],
    ['Biologia', 'Metabolismo energético e fermentação', 'Citologia'],
    ['Química', 'Titulação ácido-base e estequiometria', 'Soluções, pH e Titulação'],
  ])('%s: %s → %s', (materia, subtema, tema) => {
    expect(temaPeloSubtema(materia, subtema)).toBe(tema);
  });

  it('deixa sem tema o que não está na escada', () => {
    expect(temaPeloSubtema('Física', 'Física nuclear')).toBeNull();
    expect(temaPeloSubtema('Física', null)).toBeNull();
  });

  it('todo tema devolvido existe na escada da matéria', () => {
    const amostra: [string, string][] = [['Física', 'Ondas'], ['Química', 'Isomeria'], ['Biologia', 'Botânica']];
    for (const [m, s] of amostra) {
      const temas = ESCADAS.find((e) => e.materia === m)!.degraus.map((d) => d.tema);
      expect(temas).toContain(temaPeloSubtema(m, s));
    }
  });
});
