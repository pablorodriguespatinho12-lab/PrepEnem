import { describe, expect, it } from 'vitest';
import { comFiguraDoSolido, solidoDoEnunciado, telaDoSolido, type Solido } from './solido';
import { validarLousa } from './validar';
import type { AulaLousa } from './tipos';

const TODOS: Solido[] = ['cilindro', 'cone', 'piramide', 'esfera', 'cubo', 'caixa'];
const aula: AulaLousa = {
  cenas: [
    { tipo: 'lousa', fala: [[0.3, 'oi']], desenho: [{ k: 'tx', x: 200, y: 120, s: 'Geometria', t: 0.2 }] },
    { tipo: 'papel', fala: [[0.3, 'q']], rotulo: 'A questão', texto: 'Um cilindro tem raio 3.', alternativas: ['a', 'b'] },
    { tipo: 'lousa', fala: [[0.3, 'x']], desenho: [{ k: 'tx', x: 200, y: 120, s: 'conta', t: 0.2 }] },
  ],
};

describe('solido', () => {
  it('reconhece o sólido que aparece primeiro', () => {
    expect(solidoDoEnunciado('Uma casquinha em forma de cone dentro de um cilindro')).toBe('cone');
    expect(solidoDoEnunciado('Um copo de silicone')).toBeNull();
    expect(solidoDoEnunciado('Um tanque no formato de um paralelepípedo')).toBe('caixa');
  });

  it.each(TODOS)('%s passa no porteiro sem perder traço', (s) => {
    const cena = telaDoSolido(s);
    const v = validarLousa({ cenas: [cena, cena, cena] });
    expect(v).not.toBeNull();
    expect(v!.cenas[0].tipo === 'lousa' && v!.cenas[0].desenho.length).toBe(cena.tipo === 'lousa' ? cena.desenho.length : -1);
  });

  it('entra depois do papel e só sem imagem', () => {
    const com = comFiguraDoSolido(aula, 'Um cilindro de raio 3', false);
    expect(com.cenas).toHaveLength(4);
    expect(com.cenas[2].tipo).toBe('lousa');
    expect(comFiguraDoSolido(aula, 'Um cilindro de raio 3', true).cenas).toHaveLength(3);
    expect(comFiguraDoSolido(aula, 'Um triângulo', false).cenas).toHaveLength(3);
  });
});
