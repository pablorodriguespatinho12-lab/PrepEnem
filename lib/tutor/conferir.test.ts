import { describe, expect, test, vi } from 'vitest';
import type { ResultadoIA } from '@/lib/pedir-json';
import type { Explicacao } from './validar';
import { explicarConferido, promptCorrecao, textoParaConferir, validarConferencia } from './conferir';

const explicacao = (ideia: string): Explicacao => ({
  ideia,
  pecas: [{ termo: 'endosperma', significado: 'Reserva de alimento do embrião.' }],
  passos: [{ titulo: 'Dupla fecundação', texto: 'Um núcleo espermático se une aos núcleos polares.', visual: { tipo: 'tabela', cabecalho: ['a', 'b'], linhas: [['1', '2']] } }],
  seuErro: 'Você marcou A.',
  checagem: { pergunta: 'Quem come o endosperma?', resposta: 'O embrião.' },
});
const ok = <T,>(dado: T): ResultadoIA<T> => ({ ok: true, dado });
const falha = { ok: false as const, erro: 'sem cota', status: 429 };

describe('validarConferencia', () => {
  test('lê os erros e ignora item sem trecho ou sem correção', () => {
    expect(validarConferencia({ erros: [{ trecho: 'núcleo poligênico', correcao: 'núcleos polares' }, { trecho: 'x' }] }))
      .toEqual([{ trecho: 'núcleo poligênico', correcao: 'núcleos polares' }]);
  });

  test('lista vazia é resposta válida (nada a corrigir); formato errado é null', () => {
    expect(validarConferencia({ erros: [] })).toEqual([]);
    expect(validarConferencia({ nada: 1 })).toBeNull();
  });

  test('no máximo 5 erros', () => {
    const erros = Array.from({ length: 9 }, (_, i) => ({ trecho: `t${i}`, correcao: `c${i}` }));
    expect(validarConferencia({ erros })).toHaveLength(5);
  });
});

test('textoParaConferir leva tudo que o aluno lê, inclusive o desenho', () => {
  const t = textoParaConferir(explicacao('O endosperma alimenta o embrião.'));
  for (const parte of ['O endosperma alimenta o embrião.', 'endosperma: Reserva', 'Dupla fecundação', 'núcleos polares', 'Você marcou A.', 'Quem come o endosperma?', '"tabela"']) {
    expect(t).toContain(parte);
  }
});

test('promptCorrecao acrescenta os erros apontados ao prompt original', () => {
  const p = promptCorrecao('PROMPT', [{ trecho: 'núcleo poligênico', correcao: 'núcleos polares' }]);
  expect(p.startsWith('PROMPT')).toBe(true);
  expect(p).toContain('"núcleo poligênico" → núcleos polares');
});

describe('explicarConferido', () => {
  const primeira = explicacao('Primeira.');
  const corrigida = explicacao('Corrigida.');

  test('conferência sem erro: fica a primeira, sem gerar de novo', async () => {
    const gerar = vi.fn().mockResolvedValueOnce(ok(primeira));
    const conferir = vi.fn().mockResolvedValue(ok([]));
    expect(await explicarConferido('P', gerar, conferir)).toEqual(ok(primeira));
    expect(gerar).toHaveBeenCalledOnce();
  });

  test('conferência com erro: gera de novo com os erros no prompt', async () => {
    const gerar = vi.fn().mockResolvedValueOnce(ok(primeira)).mockResolvedValueOnce(ok(corrigida));
    const conferir = vi.fn().mockResolvedValue(ok([{ trecho: 'x', correcao: 'y' }]));
    expect(await explicarConferido('P', gerar, conferir)).toEqual(ok(corrigida));
    expect(gerar).toHaveBeenLastCalledWith(expect.stringContaining('"x" → y'));
  });

  test('verificador falhou: fica a primeira (nunca vira tela de erro)', async () => {
    const gerar = vi.fn().mockResolvedValueOnce(ok(primeira));
    const conferir = vi.fn().mockResolvedValue(falha);
    expect(await explicarConferido('P', gerar, conferir)).toEqual(ok(primeira));
  });

  test('a correção falhou: fica a primeira', async () => {
    const gerar = vi.fn().mockResolvedValueOnce(ok(primeira)).mockResolvedValueOnce(falha);
    const conferir = vi.fn().mockResolvedValue(ok([{ trecho: 'x', correcao: 'y' }]));
    expect(await explicarConferido('P', gerar, conferir)).toEqual(ok(primeira));
  });

  test('a primeira falhou: devolve a falha sem conferir', async () => {
    const gerar = vi.fn().mockResolvedValueOnce(falha);
    const conferir = vi.fn();
    expect(await explicarConferido('P', gerar, conferir)).toEqual(falha);
    expect(conferir).not.toHaveBeenCalled();
  });
});
