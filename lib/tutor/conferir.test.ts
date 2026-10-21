import { describe, expect, test, vi } from 'vitest';
import type { ResultadoIA } from '@/lib/pedir-json';
import type { Explicacao } from './validar';
import { aplicarCorrecoes, explicarConferido, promptCorrecao, textoParaConferir, validarConferencia } from './conferir';

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

describe('aplicarCorrecoes: troca o trecho direto, sem gerar de novo', () => {
  test('troca nos campos de texto e não muda o original', () => {
    const e = explicacao('O solvente é a benzina.');
    const { explicacao: nova, faltaram } = aplicarCorrecoes(e, [{ trecho: 'benzina', correcao: 'benzeno' }]);
    expect(nova.ideia).toBe('O solvente é a benzeno.');
    expect(e.ideia).toBe('O solvente é a benzina.');
    expect(faltaram).toEqual([]);
  });

  test('tira o rótulo que o verificador copiou de textoParaConferir ("Peça: estaca: ...")', () => {
    const e = { ...explicacao('Ideia.'), pecas: [{ termo: 'estaca', significado: 'Trocado de planta cortado para plantar.' }] };
    const { explicacao: nova } = aplicarCorrecoes(e, [{ trecho: 'Peça: estaca: Trocado de planta cortado para plantar.', correcao: 'Peça: estaca: Pedaço de planta cortado para plantar.' }]);
    expect(nova.pecas[0].significado).toBe('Pedaço de planta cortado para plantar.');
  });

  test('trecho que não está no texto (ex.: dentro do desenho) volta em faltaram', () => {
    const { faltaram } = aplicarCorrecoes(explicacao('Ideia.'), [{ trecho: '31.25', correcao: '31,25' }]);
    expect(faltaram).toHaveLength(1);
  });
});

describe('explicarConferido com troca direta', () => {
  test('todos os trechos trocados: não gera de novo (não gasta cota)', async () => {
    const gerar = vi.fn().mockResolvedValueOnce(ok(explicacao('Ex.: benzina.')));
    const conferir = vi.fn().mockResolvedValue(ok([{ trecho: 'benzina', correcao: 'benzeno' }]));
    const r = await explicarConferido('P', gerar, conferir);
    expect(r.ok && r.dado.ideia).toBe('Ex.: benzeno.');
    expect(gerar).toHaveBeenCalledOnce();
  });

  test('a correção por geração falhou: fica a versão com as trocas que deram', async () => {
    const gerar = vi.fn().mockResolvedValueOnce(ok(explicacao('Ex.: benzina.'))).mockResolvedValueOnce(falha);
    const conferir = vi.fn().mockResolvedValue(ok([{ trecho: 'benzina', correcao: 'benzeno' }, { trecho: 'não existe', correcao: 'y' }]));
    const r = await explicarConferido('P', gerar, conferir);
    expect(r.ok && r.dado.ideia).toBe('Ex.: benzeno.');
  });

  test('"Correta: C" é sobre o gabarito da questão, não da explicação: não dispara correção', async () => {
    const gerar = vi.fn().mockResolvedValueOnce(ok(explicacao('Ideia.')));
    const conferir = vi.fn().mockResolvedValue(ok([{ trecho: 'Correta: C', correcao: 'Correta: D' }]));
    await explicarConferido('P', gerar, conferir);
    expect(gerar).toHaveBeenCalledOnce();
  });
});
