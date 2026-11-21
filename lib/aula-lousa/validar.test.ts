import { describe, expect, it } from 'vitest';
import { validarLousa } from './validar';

const lousa = (extra: object = {}) => ({
  tipo: 'lousa',
  fala: [[0.3, 'Oi!']],
  desenho: [{ k: 'tx', x: 200, y: 40, s: 'olá', t: 0.2 }],
  ...extra,
});
const tresCenas = (primeira: object = lousa()) => ({ cenas: [primeira, lousa(), lousa()] });

describe('validarLousa', () => {
  it('aceita uma aula certa', () => {
    const r = validarLousa(tresCenas());
    expect(r?.cenas).toHaveLength(3);
  });

  it('recusa menos de 3 telas boas', () => {
    expect(validarLousa({ cenas: [lousa(), lousa()] })).toBeNull();
    expect(validarLousa(null)).toBeNull();
    expect(validarLousa('<script>')).toBeNull();
  });

  it('descarta desenho de tipo desconhecido e cena sem fala', () => {
    const r = validarLousa({ cenas: [lousa({ desenho: [{ k: 'script', s: 'x' }] }), lousa({ fala: [] }), lousa(), lousa(), lousa()] });
    expect(r?.cenas).toHaveLength(3);
  });

  it('prende número nas bordas da lousa (400 x 280)', () => {
    const r = validarLousa(tresCenas(lousa({ desenho: [{ k: 'tx', x: 9999, y: -5, s: 'a', t: 99 }] })));
    const d = r?.cenas[0].tipo === 'lousa' ? r.cenas[0].desenho[0] : null;
    expect(d).toMatchObject({ k: 'tx', x: 400, y: 0, t: 40 });
  });

  it('só deixa passar comandos de traço no caminho', () => {
    const ruim = lousa({ desenho: [{ k: 'caminho', d: 'M0 0 L10 10"/><script>', t: 0 }] });
    const bom = lousa({ desenho: [{ k: 'caminho', d: 'M10 10 L50 50 h20', t: 0 }] });
    expect(validarLousa({ cenas: [ruim, lousa(), lousa(), lousa()] })?.cenas).toHaveLength(3);
    expect(validarLousa({ cenas: [bom, lousa(), lousa()] })?.cenas).toHaveLength(3);
  });

  it('cor fora da lista vira tinta', () => {
    const r = validarLousa(tresCenas(lousa({ desenho: [{ k: 'tx', x: 1, y: 1, s: 'a', t: 0, cor: 'url(javascript:1)' }] })));
    const d = r?.cenas[0].tipo === 'lousa' ? r.cenas[0].desenho[0] : null;
    expect(d).toMatchObject({ cor: 'tinta' });
  });

  it('prova: exige um motivo por opção e a certa dentro da lista', () => {
    const prova = (extra: object) => ({ tipo: 'prova', fala: [], pergunta: 'Qual?', opcoes: ['a', 'b'], certa: 1, porque: ['x', 'y'], ...extra });
    expect(validarLousa({ cenas: [prova({}), lousa(), lousa()] })?.cenas).toHaveLength(3);
    expect(validarLousa({ cenas: [prova({ porque: ['x'] }), lousa(), lousa()] })).toBeNull();
    expect(validarLousa({ cenas: [prova({ certa: 2 }), lousa(), lousa()] })).toBeNull();
  });

  it('grade grande demais é descartada', () => {
    const grande = lousa({ desenho: [{ k: 'grade', cols: 12, rows: 12, x0: 0, y0: 0, s: 10, gap: 1, t0: 0, passo: 0.1 }] });
    expect(validarLousa({ cenas: [grande, lousa(), lousa(), lousa()] })?.cenas).toHaveLength(3);
  });
});
