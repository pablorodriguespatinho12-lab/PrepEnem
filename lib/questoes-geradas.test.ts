import { describe, expect, test } from 'vitest';
import { validarQuestoesGeradas } from './questoes-geradas';

const completa = {
  enunciado: 'Quanto é 2 + 2?',
  alternativaA: '3', alternativaB: '4', alternativaC: '5', alternativaD: '6', alternativaE: '7',
  respostaCorreta: 'b', subtema: 'Aritmética', dificuldade: 'Facil', explicacao: 'Soma.',
};

describe('validarQuestoesGeradas', () => {
  test('aceita a questão completa e normaliza letra e dificuldade', () => {
    const [q] = validarQuestoesGeradas({ questoes: [completa] })!;
    expect(q.respostaCorreta).toBe('B');
    expect(q.dificuldade).toBe('facil');
  });

  test('gabarito inválido descarta a questão (antes virava "A")', () => {
    expect(validarQuestoesGeradas({ questoes: [{ ...completa, respostaCorreta: 'F' }] })).toBeNull();
    expect(validarQuestoesGeradas({ questoes: [{ ...completa, respostaCorreta: undefined }] })).toBeNull();
  });

  test('alternativa faltando descarta a questão (antes virava "N/A")', () => {
    const { alternativaE: _, ...semE } = completa;
    expect(validarQuestoesGeradas({ questoes: [semE, completa] })).toHaveLength(1);
  });

  test('lixo vira null', () => {
    expect(validarQuestoesGeradas(null)).toBeNull();
    expect(validarQuestoesGeradas({ questoes: 'x' })).toBeNull();
  });
});
