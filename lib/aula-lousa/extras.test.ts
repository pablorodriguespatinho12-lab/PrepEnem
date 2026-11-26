import { describe, expect, it } from 'vitest';
import { comResposta, telaDaFigura, telasDosConceitos } from './extras';
import { validarLousa } from './validar';
import { lousaDoRobo } from './do-robo';
import { comFiguraDoSolido } from './solido';
import type { Cena } from './tipos';

const escrito = (cenas: Cena[]): string => cenas.flatMap((c) => (c.tipo === 'lousa' ? c.desenho.flatMap((d) => (d.k === 'tx' ? [d.s] : [])) : [])).join(' | ');
const PASSOS = [
  { titulo: 'As fórmulas desta questão', texto: 'Só o nome.', visual: { tipo: 'formulas', itens: [{ nome: 'Volume do cone', formula: '⅓ · π · r · r · h' }] } },
  { titulo: 'O desenho', texto: 'Veja o copo.', visual: { tipo: 'diagrama', nome: 'copo-cone-80' } },
  { titulo: 'Volta na equação', texto: 'N = 15\nResposta: alternativa A.', visual: null },
];
const ENTRADA = { enunciado: 'Um copo em forma de cone. Quantos copos?', alternativas: ['15', '10'], tema: 'Geometria', passos: PASSOS };

describe('telas extras da lousa', () => {
  it('o passo com desenho vira tela de figura, aceita pelo porteiro e sem a frase repetida', () => {
    const r = lousaDoRobo(ENTRADA);
    if (!r.ok) throw new Error(r.motivo);
    expect(r.aula.cenas.filter((c) => c.tipo === 'figura')).toHaveLength(1);
    expect(escrito(r.aula.cenas)).not.toContain('o desenho');
    expect(validarLousa(r.aula)!.cenas).toHaveLength(r.aula.cenas.length);
    expect(comFiguraDoSolido(r.aula, ENTRADA.enunciado, false)).toBe(r.aula);
  });

  it('desenho com nome desconhecido é cortado pelo porteiro', () => {
    const figura = telaDaFigura({ tipo: 'diagrama', nome: 'nao-existe' }, [[0.3, 'x']])!;
    const cenas = [figura, figura, figura];
    expect(validarLousa({ cenas })).toBeNull();
  });

  it('explica volume e o ⅓ do cone; esfera ganha o 4/3', () => {
    expect(escrito(telasDosConceitos([{ nome: 'Volume do cone', formula: '⅓ · π' }]))).toContain('3 cones cheios = 1 cilindro');
    expect(escrito(telasDosConceitos([{ nome: 'Volume da esfera', formula: '4/3 · π' }]))).toContain('bola = 4/3 · π · r³');
    expect(telasDosConceitos([{ nome: 'Área do quadrado', formula: 'l · l' }])).toEqual([]);
  });

  it('escreve a resposta no quadro, sem inventar quando não há letra', () => {
    expect(escrito(comResposta([], 'Letra B.', ['1', '2']))).toContain('A: 1 | B: 2 | Resposta: alternativa B');
    expect(comResposta([], 'Q = 3', ['1', '2'])).toEqual([]);
  });
});
