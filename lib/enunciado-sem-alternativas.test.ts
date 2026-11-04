import { describe, expect, test } from 'vitest';
import { cortarAlternativasRepetidas } from './enunciado-sem-alternativas';

const alts = [
  'unificação do lema anterior ao atual.',
  'aproximação entre o lema olímpico e o COI.',
  'junção do lema olímpico com os princípios esportivos.',
  'associação entre o lema olímpico e a cooperatividade.',
  'vinculação entre o lema olímpico e os eventos atléticos.',
];

describe('cortarAlternativasRepetidas', () => {
  test('tira as 5 alternativas coladas no fim e deixa o comando', () => {
    const enunciado = [
      'Texto do lema olímpico.',
      'De acordo com o texto, a alteração teve como objetivo a',
      'A unificação do lema anterior ao atual.',
      'B aproximação entre o lema olímpico e o COI.',
      'C junção do lema olímpico com os princípios esportivos.',
      'D associação entre o lema olímpico e a cooperatividade.',
      'E vinculação entre o lema olímpico e os eventos atléticos. ',
    ].join('\n');
    expect(cortarAlternativasRepetidas(enunciado, alts)).toBe(
      'Texto do lema olímpico.\nDe acordo com o texto, a alteração teve como objetivo a',
    );
  });

  test('não mexe quando falta alguma alternativa', () => {
    const enunciado = 'Comando\nA unificação do lema anterior ao atual.\nB aproximação entre o lema olímpico e o COI.';
    expect(cortarAlternativasRepetidas(enunciado, alts)).toBe(enunciado);
  });

  test('não mexe quando há texto novo depois da E', () => {
    const enunciado = `Comando\n${alts.map((a, i) => `${'ABCDE'[i]} ${a}`).join('\n')}\nE ainda um parágrafo inteiro que não é alternativa nenhuma e continua o texto-base.`;
    expect(cortarAlternativasRepetidas(enunciado, alts)).toBe(enunciado);
  });

  test('não mexe em enunciado normal', () => {
    expect(cortarAlternativasRepetidas('A cidade cresceu. Qual a causa?', alts)).toBe('A cidade cresceu. Qual a causa?');
  });
});
