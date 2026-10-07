import { describe, expect, test } from 'vitest';
import { validarResumos } from './resumo';

describe('validarResumos', () => {
  test('mantém assuntos completos e descarta o visual inválido', () => {
    const r = validarResumos({
      resumos: [
        {
          materia: 'Física', subtema: 'MRU', ideia: 'Velocidade constante.',
          construcao: [{ titulo: 'Posição', texto: 'Anda 2 m por segundo.', visual: { tipo: 'grafico', x: [0, 5], funcoes: [{ expr: '2x' }] } },
            { titulo: 'Sem visual', texto: 'x', visual: { tipo: 'foto' } }],
          regra: '$s = s_0 + vt$', dicaEnem: 'Aparece em gráfico s × t.',
        },
        { materia: 'Química', subtema: 'Mol', ideia: '', construcao: [] },
      ],
    })!;
    expect(r).toHaveLength(1);
    expect(r[0].construcao[0].visual?.tipo).toBe('grafico');
    expect(r[0].construcao[1].visual).toBeNull();
  });

  test('guarda o que o assunto é e até 2 conceitos de antes; sem eles, fica vazio', () => {
    const [com, sem] = validarResumos({
      resumos: [
        {
          materia: 'Química', subtema: 'Massa molar', oQueE: 'Massa molar é quanto pesa 1 mol.',
          antes: [{ titulo: 'O que é mol', texto: 'Um jeito de contar átomos.' }, { titulo: 'Massa atômica', texto: 'O peso de um átomo.' }, { titulo: 'Sobra', texto: 'x' }],
          ideia: 'Soma a massa dos átomos.', construcao: [{ titulo: 'Água', texto: '1 + 1 + 16 = 18.' }],
        },
        { materia: 'Física', subtema: 'MRU', ideia: 'Velocidade constante.', construcao: [{ titulo: 'Bicicleta', texto: 'Anda 15 km por hora.' }] },
      ],
    })!;
    expect(com.oQueE).toBe('Massa molar é quanto pesa 1 mol.');
    expect(com.antes.map((a) => a.titulo)).toEqual(['O que é mol', 'Massa atômica']);
    expect(sem.oQueE).toBe('');
    expect(sem.antes).toEqual([]);
  });

  test('sem nenhum assunto válido devolve null', () => {
    expect(validarResumos({ resumos: [] })).toBeNull();
    expect(validarResumos('lixo')).toBeNull();
  });
});
