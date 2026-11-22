import { describe, expect, it } from 'vitest';
import { cabem, lousaDoRobo, quebrar } from './do-robo';
import { validarLousa } from './validar';

const PASSOS = [
  { titulo: 'As fórmulas desta questão', texto: 'Estas são as fórmulas que a questão usa. Já estão prontas: é só usar.', visual: { tipo: 'formulas', itens: [{ nome: 'Princípio multiplicativo', figura: 'contagem', formula: 'opções de cada escolha multiplicadas' }] } },
  { titulo: 'O que eu tenho', texto: 'Primeiro, tire os números do enunciado.', visual: { tipo: 'tabela', linhas: [['Pães', '3'], ['Recheios', '4']] } },
  { titulo: 'A equação em letras', texto: 'A questão quer quantos sanduíches.\nPor que vezes? Para CADA pão há 4 recheios.', visual: { tipo: 'equacao', formula: 'S = P × R', leitura: 'sanduíches = pães × recheios', letras: [{ letra: 'S', oque: 'sanduíches (o que a questão quer)' }, { letra: 'P', oque: 'pães' }] } },
  { titulo: 'Achando P (pães)', texto: 'P = 3', visual: null },
  { titulo: 'Volta na equação', texto: 'S = 3 × 4 = 12\nLetra A.', visual: null },
];
const ENTRADA = { enunciado: 'Uma lanchonete tem 3 pães e 4 recheios. Quantos sanduíches?', alternativas: ['12', '7', '34', '1', '24'], tema: 'Combinatória', passos: PASSOS };

describe('lousa a partir da aula do robô', () => {
  it('gera telas que o porteiro aceita sem cortar nenhuma', () => {
    const r = lousaDoRobo(ENTRADA);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const aula = validarLousa(r.aula);
    expect(aula).not.toBeNull();
    expect(aula!.cenas).toHaveLength(r.aula.cenas.length);
  });

  it('abre com a capa e a questão em papel', () => {
    const r = lousaDoRobo(ENTRADA);
    if (!r.ok) throw new Error(r.motivo);
    expect(r.aula.cenas[0].tipo).toBe('lousa');
    expect(r.aula.cenas[1].tipo).toBe('papel');
  });

  it('recusa o que não é o molde do robô', () => {
    const r = lousaDoRobo({ ...ENTRADA, passos: [{ titulo: 'A pergunta', texto: 'x' }] });
    expect(r.ok).toBe(false);
  });

  it('recusa alternativa longa demais', () => {
    expect(lousaDoRobo({ ...ENTRADA, alternativas: ['a'.repeat(80), 'b'] }).ok).toBe(false);
  });

  it('quebra em linhas que cabem na lousa', () => {
    for (const l of quebrar('uma frase bem comprida que precisa ser quebrada em várias linhas curtas', cabem(24))) {
      expect(l.length).toBeLessThanOrEqual(cabem(24));
    }
  });
});
