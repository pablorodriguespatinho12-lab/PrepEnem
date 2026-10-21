import { describe, expect, test } from 'vitest';
import { FORMATO_VISUAL_PARA_IA, formatoVisualSem } from './especificacao';
describe('formatoVisualSem', () => {
  const sem = formatoVisualSem(['cena', 'fatias']);
  test('tira o tipo e as linhas de explicação dele', () => {
    expect(sem).not.toContain('"tipo":"cena"');
    expect(sem).not.toContain('"veiculo" é EXATAMENTE');
    expect(sem).not.toContain('"tipo":"fatias"');
  });
  test('mantém os outros tipos e o fim do texto', () => {
    for (const tipo of ['grafico', 'quadro', 'tabela', 'processo', 'molecula', 'palavra', 'vetores', 'transformacao', 'reta']) {
      expect(sem).toContain(`"tipo":"${tipo}"`);
    }
    expect(sem).toContain('REGRAS DE TEXTO');
    expect(sem).toContain('O app desenha um quadro branco');
  });
  test('fica menor que o formato inteiro', () => {
    expect(FORMATO_VISUAL_PARA_IA.length - sem.length).toBeGreaterThan(1000);
  });
});
