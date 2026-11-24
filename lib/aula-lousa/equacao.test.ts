import { describe, expect, it } from 'vitest';
import { validarLousa } from './validar';
import { expandirEquacao, tamanhoQueCabe } from './equacao';

const partes = [
  { s: 'A', leg: 'aceleração' },
  { s: '=' },
  { s: 'H', leg: 'altura' },
  { s: '×' },
  { s: 'V', leg: 'velocidade' },
];

describe('expandirEquacao', () => {
  const saida = expandirEquacao({ k: 'eq', y: 120, t: 0.5, tam: 44, partes });

  it('põe uma legenda cinza embaixo de cada peça que tem legenda, no mesmo x', () => {
    const textos = saida.filter((d) => d.k === 'tx');
    expect(textos).toHaveLength(8); // 5 peças + 3 legendas
    const a = textos.find((d) => d.s === 'A')!;
    const legA = textos.find((d) => d.s === 'aceleração')!;
    expect(legA.x).toBe(a.x);
    expect(legA.y).toBeGreaterThan(a.y);
    expect(legA.cor).toBe('cinza');
  });

  it('cabe nos 400 de largura e fica centrada', () => {
    const xs = saida.flatMap((d) => (d.k === 'tx' ? [d.x] : []));
    expect(Math.min(...xs)).toBeGreaterThan(0);
    expect(Math.max(...xs)).toBeLessThan(400);
    expect((Math.min(...xs) + Math.max(...xs)) / 2).toBeCloseTo(200, 0);
  });

  it('encolhe a letra grande quando a equação é comprida', () => {
    const longa = Array.from({ length: 8 }, (_, i) => ({ s: `peça${i}x`, leg: 'legenda longa 1' }));
    expect(tamanhoQueCabe(longa, 44)).toBeLessThan(44);
  });
});

describe('validarLousa com eq', () => {
  const cena = (desenho: unknown[]) => ({ tipo: 'lousa', fala: [[0.3, 'oi']], desenho });
  const base = [cena([{ k: 'tx', x: 1, y: 1, s: 'a', t: 0 }]), cena([{ k: 'tx', x: 1, y: 1, s: 'b', t: 0 }])];

  it('troca eq por textos comuns', () => {
    const aula = validarLousa({ cenas: [...base, cena([{ k: 'eq', y: 120, t: 0.5, tam: 44, partes }])] });
    const ultima = aula!.cenas[2];
    expect(ultima.tipo === 'lousa' && ultima.desenho.every((d) => d.k === 'tx')).toBe(true);
  });

  it('eq sem peças some e a cena inteira cai', () => {
    const aula = validarLousa({ cenas: [...base, cena([{ k: 'eq', y: 120, t: 0, partes: [] }])] });
    expect(aula).toBeNull();
  });
});
