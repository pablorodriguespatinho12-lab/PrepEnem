import { describe, expect, test } from 'vitest';
// corrigirRedacao (v3, com trecho obrigatório) é testada em tests/redacao/correcao-v3.test.ts.
import { contarParagrafos, corrigirParte, notaC2, notaC3 } from './correcao';

const TEXTO = 'Introdução.\n\nDesenvolvimento um.\n\nDesenvolvimento dois.\n\nConclusão.';

describe('notaC2 e notaC3', () => {
  const rep = (produtivo: boolean, legitimado = true) => ({ trecho: 't', legitimado, pertinente: true, produtivo, comentario: '' });
  test('C2 segue partes embrionárias e o estado do repertório', () => {
    expect(notaC2(0, [rep(true)])).toBe(200);
    expect(notaC2(0, [rep(false)])).toBe(160);
    expect(notaC2(0, [rep(true, false)])).toBe(120);
    expect(notaC2(1, [rep(true)])).toBe(120);
    expect(notaC2(2, [rep(true)])).toBe(80);
  });

  test('C3 não passa do teto da evidência', () => {
    const p = (desenvolvida: boolean) => ({ numero: 1, ideia: '', desenvolvida, comentario: '' });
    expect(notaC3(200, [p(true), p(true)])).toBe(200);
    expect(notaC3(200, [p(true), p(true), p(false)])).toBe(160);
    expect(notaC3(200, [p(false), p(true)])).toBe(120);
  });

  test('conta parágrafos com uma ou duas quebras de linha', () => {
    expect(contarParagrafos(TEXTO)).toBe(4);
    expect(contarParagrafos('a\nb')).toBe(2);
  });
});

describe('corrigirParte', () => {
  test('nota proporcional aos itens, item sem trecho não conta como cumprido', () => {
    const c = corrigirParte({
      itens: {
        retomada: { ok: true, trecho: 'Portanto' }, agente: { ok: true, trecho: 'o Estado' }, acao: { ok: true, trecho: 'criar' },
        modo: { ok: true, trecho: null }, efeito: { ok: false, trecho: null, comoMelhorar: 'diga para quê' }, detalhamento: { ok: false },
      },
      desvios: [],
      reescrita: 'versão melhor',
    }, 'conclusao')!;
    expect(c.nota).toBe(5);
    expect(c.itens.find((i) => i.id === 'modo')!.ok).toBe(false);
    expect(c.itens.find((i) => i.id === 'efeito')!.comoMelhorar).toBe('diga para quê');
  });

  test('desvios descontam 1 ponto a cada 3', () => {
    const tudo = Object.fromEntries(['operador', 'topico', 'repertorio_produtivo', 'analise', 'fecho'].map((id) => [id, { ok: true, trecho: 'x' }]));
    const desvios = Array.from({ length: 6 }, (_, i) => ({ trecho: `erro ${i}`, tipo: 'crase', correcao: `certo ${i}` }));
    expect(corrigirParte({ itens: tudo, desvios }, 'desenvolvimento1')!.nota).toBe(8);
  });

  test('desvio que não corrige nada ou repetido é descartado', () => {
    const c = corrigirParte({
      itens: { operador: { ok: true, trecho: 'Além disso' } },
      desvios: [
        { trecho: 'ninguém', tipo: 'acento', correcao: 'ninguém' },
        { trecho: 'nao', tipo: 'acento', correcao: 'não' },
        { trecho: 'Nao', tipo: 'acento', correcao: 'Não' },
      ],
    }, 'desenvolvimento1')!;
    expect(c.desvios).toEqual([{ trecho: 'nao', tipo: 'acento', correcao: 'não' }]);
  });

  test('sem nenhum item marcado é resposta inválida', () => {
    expect(corrigirParte({ itens: {} }, 'introducao')).toBeNull();
  });
});
