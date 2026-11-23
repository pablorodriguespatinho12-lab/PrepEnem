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

  it('a letra que está na fórmula é explicada na mesma tela, antes da que não está', () => {
    const passos = [
      PASSOS[0],
      { titulo: 'A equação em letras', texto: 'Quer a distância.', visual: { tipo: 'equacao', formula: 'D = M ÷ 1 000', leitura: 'km = metros ÷ 1 000', letras: [{ letra: 'D', oque: 'distância em km' }, { letra: 'CM', oque: 'distância em cm' }, { letra: 'M', oque: 'distância em metros' }] } },
      PASSOS[3],
      PASSOS[4],
    ];
    const r = lousaDoRobo({ ...ENTRADA, passos });
    if (!r.ok) throw new Error(r.motivo);
    const tela = r.aula.cenas.find((c) => c.tipo === 'lousa' && c.desenho.some((d) => d.k === 'tx' && d.s === 'as letras'));
    const textos = tela && tela.tipo === 'lousa' ? tela.desenho.flatMap((d) => (d.k === 'tx' ? [d.s] : [])) : [];
    expect(textos.indexOf('M = distância em metros')).toBeGreaterThan(-1);
    expect(textos.indexOf('M = distância em metros')).toBeLessThan(textos.findIndex((s) => s.startsWith('CM')) === -1 ? 99 : textos.findIndex((s) => s.startsWith('CM')));
  });

  it('equação em 3 telas: só "letra = palavra", depois a equação sozinha, depois o porquê (sem explicar na 1ª)', () => {
    const r = lousaDoRobo(ENTRADA);
    if (!r.ok) throw new Error(r.motivo);
    const titulo = (c: (typeof r.aula.cenas)[number]) => (c.tipo === 'lousa' ? (c.desenho.find((d) => d.k === 'tx') as { s: string } | undefined)?.s : undefined);
    const ordem = r.aula.cenas.map(titulo);
    const i = ordem.indexOf('as letras');
    expect(i).toBeGreaterThan(-1);
    expect(ordem.slice(i, i + 3)).toEqual(['as letras', 'a equação', 'por quê']);
    const textos = (n: number) => { const c = r.aula.cenas[n]; return c.tipo === 'lousa' ? c.desenho.flatMap((d) => (d.k === 'tx' ? [d.s] : [])) : []; };
    expect(textos(i)).toContain('P = pães');
    expect(textos(i).join(' ')).toContain('S = sanduíches');
    expect(textos(i).join(' ')).not.toMatch(/Por que/);
    expect(textos(i + 1).join(' ')).toContain('S = P × R');
    expect(textos(i + 1).join(' ')).not.toMatch(/Por que/);
    expect(textos(i + 2).join(' ')).toMatch(/Por que/);
  });

  it('escala 1 : 50 000 não é cortada em duas falas', () => {
    const falasDaTela = (r: ReturnType<typeof lousaDoRobo>) => (r.ok ? r.aula.cenas.flatMap((c) => c.fala.map((f) => f[1])) : []);
    const r = lousaDoRobo({ ...ENTRADA, passos: [PASSOS[0], { ...PASSOS[1], texto: 'Escala 1 : 50 000 diz que 1 cm vale 50 000 cm.' }, PASSOS[2], PASSOS[3], PASSOS[4]] });
    expect(falasDaTela(r).some((f) => /1:50 000/.test(f))).toBe(true);
    expect(falasDaTela(r).some((f) => /Escala 1 ?:?$/.test(f))).toBe(false);
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
