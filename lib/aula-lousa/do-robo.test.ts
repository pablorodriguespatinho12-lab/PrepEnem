import { describe, expect, it } from 'vitest';
import { cabem, lousaDoRobo, quebrar } from './do-robo';
import { validarLousa } from './validar';
import { META_DE_CONTA, TOLERANCIA_DA_META, ehTelaDeConta } from './quadro-de-conta';

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

  const textosDe = (c: (typeof ENTRADA_OK)['aula']['cenas'][number]) => (c.tipo === 'lousa' ? c.desenho.flatMap((d) => (d.k === 'tx' ? [d] : [])) : []);
  const gera = (e = ENTRADA) => {
    const r = lousaDoRobo(e);
    if (!r.ok) throw new Error(r.motivo);
    return validarLousa(r.aula)!;
  };
  const ENTRADA_OK = { aula: gera() };

  it('a equação vira UMA tela com a legenda embaixo de cada letra (regra 18), sem tela de "as letras" em texto', () => {
    const cenas = gera().cenas;
    const tela = cenas.find((c) => textosDe(c).some((d) => d.s === 'a equação'))!;
    const t = textosDe(tela);
    const letraS = t.find((d) => d.s === 'S')!;
    const legS = t.find((d) => d.s === 'sanduíches')!;
    expect(legS.x).toBe(letraS.x);
    expect(legS.y).toBeGreaterThan(letraS.y);
    expect(cenas.some((c) => textosDe(c).some((d) => d.s === 'as letras'))).toBe(false);
  });

  it('letra que não está na fórmula (CM) vai numa 2ª linha com a legenda, depois das que estão', () => {
    const passos = [PASSOS[0], { titulo: 'A equação em letras', texto: 'Quer a distância.', visual: { tipo: 'equacao', formula: 'D = M ÷ 1 000', leitura: 'km = metros ÷ 1 000', letras: [{ letra: 'D', oque: 'distância em km' }, { letra: 'CM', oque: 'distância em cm' }, { letra: 'M', oque: 'distância em metros' }] } }, PASSOS[3], PASSOS[4]];
    const tela = gera({ ...ENTRADA, passos }).cenas.find((c) => textosDe(c).some((d) => d.s === 'a equação'))!;
    const t = textosDe(tela);
    expect(t.some((d) => d.s === '1 000')).toBe(true); // denominador desenhado embaixo do traço
    expect(t.find((d) => d.s === 'CM')!.y).toBeGreaterThan(t.find((d) => d.s === 'D')!.y);
    expect(t.some((d) => d.s.includes('÷') || d.s.includes('|'))).toBe(false); // divisão sempre em fração
  });

  it('depois da equação vem o porquê: a conta de novo na tela e a explicação só na fala', () => {
    const cenas = gera().cenas;
    const i = cenas.findIndex((c) => textosDe(c).some((d) => d.s === 'a equação'));
    const porque = cenas[i + 1];
    expect(textosDe(porque).some((d) => d.s === 'por quê')).toBe(true);
    expect(textosDe(porque).some((d) => /Por que/.test(d.s))).toBe(false);
    expect(porque.fala.map((f) => f[1]).join(' ')).toMatch(/Por que/);
  });

  it('regra 24: em média, mais ou menos 80% das telas de lousa (fora a capa) são só conta', () => {
    const lousas = gera().cenas.filter((c) => c.tipo === 'lousa').slice(1);
    const contas = lousas.filter(ehTelaDeConta).length;
    expect(contas / lousas.length).toBeGreaterThanOrEqual(META_DE_CONTA - TOLERANCIA_DA_META);
  });

  it('"Achando P" e a volta viram conta; a prosa e "Letra A." só viram fala', () => {
    const cenas = gera().cenas;
    const volta = cenas[cenas.length - 1];
    expect(textosDe(volta).map((d) => d.s)).toEqual(expect.arrayContaining(['S', '=', '3', '×', '4', '12']));
    expect(textosDe(volta).some((d) => /Letra/.test(d.s))).toBe(false);
    expect(volta.fala.map((f) => f[1]).join(' ')).toContain('Letra A');
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

describe('resumoDaPista', () => {
  it('pista curta fica inteira; comprida mostra o conselho depois da seta, sem cortar palavra', async () => {
    const { resumoDaPista } = await import('./do-robo');
    expect(resumoDaPista('Pista: soma em binário.')).toBe('soma em binário.');
    const longa = 'Pista: trechos de MESMA DISTÂNCIA com velocidades diferentes → nunca tire a média das velocidades.';
    expect(resumoDaPista(longa)).toBe('nunca tire a média das velocidades.');
    const sem = resumoDaPista(`Pista: ${'palavra '.repeat(30)}fim.`);
    expect(sem.length).toBeLessThanOrEqual(90);
    expect(sem.endsWith('…')).toBe(true);
  });
});

describe('dividirEnunciado', () => {
  it('enunciado curto fica em 1 tela', async () => {
    const { dividirEnunciado } = await import('./do-robo');
    expect(dividirEnunciado('Quanto é 2 + 2?')).toEqual(['Quanto é 2 + 2?']);
  });
  it('enunciado longo quebra entre frases, sem perder texto, cada parte até 380', async () => {
    const { dividirEnunciado } = await import('./do-robo');
    const longo = Array.from({ length: 12 }, (_, i) => `Esta é a frase número ${i} do enunciado comprido.`).join(' ');
    const partes = dividirEnunciado(longo);
    expect(partes.length).toBeGreaterThan(1);
    expect(partes.every((p) => p.length <= 380)).toBe(true);
    expect(partes.join(' ')).toBe(longo);
  });
});
