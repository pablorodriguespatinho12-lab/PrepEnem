import { describe, expect, test } from 'vitest';
import { contarParagrafos, corrigirParte, corrigirRedacao, notaC2, notaC3 } from './correcao';

const TEXTO = 'Introdução.\n\nDesenvolvimento um.\n\nDesenvolvimento dois.\n\nConclusão.';

const valido = (trecho: string) => ({ trecho, valido: true });

function evidencia(sobrescrever: Record<string, unknown> = {}) {
  return {
    c1: { estrutura: 'excelente', desvios: [{ trecho: 'a nível de', tipo: 'registro', correcao: 'em nível de' }] },
    c2: { abordagem: 'completa', outroTipoTextual: false, copiaMotivadores: false, partesEmbrionarias: 0,
      repertorios: [{ trecho: 'Goffman', legitimado: true, pertinente: true, produtivo: true, comentario: '' }] },
    c3: { nivel: 200, contradicaoGrave: false, paragrafos: [1, 2, 3, 4].map((n) => ({ numero: n, ideia: 'x', desenvolvida: true })) },
    c4: { nivel: 200, operadoresEntreParagrafos: ['Em primeira análise', 'Além disso', 'Portanto'], todoParagrafoTemCoesivo: true, inadequacoes: [], repeticoes: [] },
    c5: { agente: valido('o Estado'), acao: valido('criar'), modo: valido('por meio de'), efeito: valido('a fim de'), detalhamento: valido('com'), desrespeitaDH: false, condicional: false },
    proximoPasso: { c1: 'não deve aparecer, já está no 200' },
    reescritas: [],
    ...sobrescrever,
  };
}

describe('corrigirRedacao', () => {
  test('evidência de texto completo chega a 1000', () => {
    const c = corrigirRedacao(evidencia(), TEXTO)!;
    expect(c.total).toBe(1000);
    expect(c.proximoPasso).toEqual({});
  });

  test('a nota da C5 sai da contagem de elementos, não do que a IA disser', () => {
    const c = corrigirRedacao(evidencia({
      c5: { agente: valido('o Estado'), acao: valido('criar'), modo: { trecho: null, valido: true }, efeito: { trecho: null, valido: false }, detalhamento: { trecho: null, valido: false } },
    }), TEXTO)!;
    expect(c.notas.c5).toBe(80);
  });

  test('texto em um parágrafo trava a C4 em 80', () => {
    expect(corrigirRedacao(evidencia(), 'Tudo junto num bloco só.')!.notas.c4).toBe(80);
  });

  test('evidência sem estrutura ou abordagem válida é recusada', () => {
    expect(corrigirRedacao({ c1: { estrutura: 'ótima' } }, TEXTO)).toBeNull();
    expect(corrigirRedacao(null, TEXTO)).toBeNull();
  });
});

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
    const desvios = Array.from({ length: 6 }, () => ({ trecho: 'y', tipo: 'crase', correcao: 'z' }));
    expect(corrigirParte({ itens: tudo, desvios }, 'desenvolvimento1')!.nota).toBe(8);
  });

  test('sem nenhum item marcado é resposta inválida', () => {
    expect(corrigirParte({ itens: {} }, 'introducao')).toBeNull();
  });
});
