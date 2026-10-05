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

  test('sem nenhum assunto válido devolve null', () => {
    expect(validarResumos({ resumos: [] })).toBeNull();
    expect(validarResumos('lixo')).toBeNull();
  });
});
