/* Integração das rotas app/api/redacao/** com banco, sessão e IA de mentira. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso, entrarComo, gravacoes, pedido, zerar } from '../apoio/banco-falso';
import { POST as enviar } from '@/app/api/redacao/submit/route';
import { POST as avaliar } from '@/app/api/redacao/evaluate/route';
import { GET as historico } from '@/app/api/redacao/history/route';
import { GET as temas } from '@/app/api/redacao/themes/route';
import { POST as ajuda } from '@/app/api/redacao/ajuda/route';
import { MINIMO_LINHAS } from '@/lib/redacao/grade';

const { pedirJson } = vi.hoisted(() => ({ pedirJson: vi.fn() }));
vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
vi.mock('next-auth', async () => (await import('../apoio/banco-falso')).nextAuthFalso);
vi.mock('@/lib/pedir-json', () => ({ pedirJson }));

const TEXTO = 'Uma redação com tamanho suficiente para passar do mínimo de cinquenta caracteres.';
const LONGA = Array.from({ length: MINIMO_LINHAS + 2 }, () => TEXTO).join('\n');
const redacao = (extra: object = {}) => ({ id: 'r1', userId: 'aluno-1', texto: LONGA, theme: { tema: 'T', textoMotivador: null }, ...extra });

beforeEach(() => {
  zerar();
  pedirJson.mockReset().mockResolvedValue({ ok: false, erro: 'cheio', status: 429 });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('sem sessão', () => {
  it.each([
    ['submit', () => enviar(pedido('/s', { texto: TEXTO, themeId: 't' }))],
    ['evaluate', () => avaliar(pedido('/e', { essayId: 'r1' }))],
    ['history', () => historico(pedido('/h'))],
    ['themes', () => temas()],
    ['ajuda', () => ajuda(pedido('/a', { tema: 'T', paragrafo: 'introducao' }))],
  ])('%s devolve 401 sem gravar nem gastar IA', async (_n, chamar) => {
    expect((await chamar()).status).toBe(401);
    expect(gravacoes()).toEqual([]);
    expect(pedirJson).not.toHaveBeenCalled();
  });
});

describe('submit', () => {
  beforeEach(() => entrarComo());

  it.each([[49, 400], [50, 200]])('texto com %i caracteres devolve %i', async (n, status) => {
    expect((await enviar(pedido('/s', { texto: 'a'.repeat(n), themeId: 't' }))).status).toBe(status);
  });

  it('espaços nas pontas não contam para o mínimo', async () => {
    expect((await enviar(pedido('/s', { texto: `  ${'a'.repeat(49)}   `, themeId: 't' }))).status).toBe(400);
  });

  it('sem tema devolve 400', async () => {
    expect((await enviar(pedido('/s', { texto: TEXTO }))).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });

  it('grava pendente no usuário da sessão, nunca no userId do corpo', async () => {
    await enviar(pedido('/s', { texto: `  ${TEXTO}  `, themeId: 't', userId: 'outro', status: 'avaliada', notaTotal: 1000 }));
    expect(bancoFalso.essay.create.mock.calls[0][0].data).toEqual({ userId: 'aluno-1', themeId: 't', texto: TEXTO, status: 'pendente' });
  });

  it('tema livre usa upsert com o tema aparado', async () => {
    bancoFalso.essayTheme.upsert.mockResolvedValue({ id: 'tn' });
    await enviar(pedido('/s', { texto: TEXTO, customTema: '  Água  ' }));
    expect(bancoFalso.essayTheme.upsert.mock.calls[0][0].where).toEqual({ tema: 'Água' });
    expect(bancoFalso.essay.create.mock.calls[0][0].data.themeId).toBe('tn');
  });

  it.each([
    ['texto numérico', { texto: 12345, themeId: 't' }],
    ['texto lista', { texto: ['a'], themeId: 't' }],
    ['customTema numérico', { texto: TEXTO, customTema: 7 }],
  ])('BUG-C6: %s devolve 400, não 500', async (_n, corpo) => {
    expect((await enviar(pedido('/s', corpo))).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });

  it('BUG-C7: tema livre só de espaços devolve 400 sem criar tema vazio', async () => {
    const r = await enviar(pedido('/s', { texto: TEXTO, customTema: '     ' }));
    expect(gravacoes()).toEqual([]);
    expect(r.status).toBe(400);
  });

  it('BUG-C8: themeId inexistente devolve 4xx, não 500', async () => {
    bancoFalso.essay.create.mockRejectedValue(Object.assign(new Error('Foreign key constraint failed'), { code: 'P2003' }));
    const r = await enviar(pedido('/s', { texto: TEXTO, themeId: 'nao-existe' }));
    expect([400, 404]).toContain(r.status);
  });

  it('BUG-C9: texto de 200 mil caracteres é recusado antes de ir para o banco', async () => {
    const r = await enviar(pedido('/s', { texto: 'a '.repeat(100_000), themeId: 't' }));
    expect([400, 413]).toContain(r.status);
    expect(gravacoes()).toEqual([]);
  });
});

describe('evaluate', () => {
  beforeEach(() => {
    entrarComo();
    bancoFalso.essay.findUnique.mockResolvedValue(redacao());
    bancoFalso.essay.updateMany.mockResolvedValue({ count: 1 });
  });
  const chamar = (corpo: unknown = { essayId: 'r1' }) => avaliar(pedido('/e', corpo));
  const status = () => bancoFalso.essay.update.mock.calls.map((c: any) => c[0].data.status);

  it.each([{}, { essayId: 1 }, { essayId: { not: 'x' } }, '{quebrado'])('corpo %j devolve 400', async (corpo) => {
    expect((await chamar(corpo)).status).toBe(400);
    expect(gravacoes()).toEqual([]);
  });

  it('BUG-C5: corpo null devolve 400, não 500', async () => {
    expect((await chamar('null')).status).toBe(400);
  });

  it('redação inexistente devolve 404', async () => {
    bancoFalso.essay.findUnique.mockResolvedValue(null);
    expect((await chamar()).status).toBe(404);
  });

  it('redação de outro aluno devolve 403 sem travar nem gastar IA', async () => {
    bancoFalso.essay.findUnique.mockResolvedValue(redacao({ userId: 'outro' }));
    expect((await chamar()).status).toBe(403);
    expect(gravacoes()).toEqual([]);
    expect(pedirJson).not.toHaveBeenCalled();
  });

  it('já em avaliação devolve 409 sem gastar IA', async () => {
    bancoFalso.essay.updateMany.mockResolvedValue({ count: 0 });
    expect((await chamar()).status).toBe(409);
    expect(pedirJson).not.toHaveBeenCalled();
  });

  it('a trava só reabre avaliação parada há mais de 3 minutos', async () => {
    const antes = Date.now();
    await chamar();
    const limite: Date = bancoFalso.essay.updateMany.mock.calls[0][0].where.OR[1].updatedAt.lt;
    expect(antes - limite.getTime()).toBeGreaterThanOrEqual(180_000 - 50);
    expect(antes - limite.getTime()).toBeLessThan(181_000);
  });

  it(`com menos de ${MINIMO_LINHAS} linhas dá zero sem IA`, async () => {
    bancoFalso.essay.findUnique.mockResolvedValue(redacao({ texto: Array(MINIMO_LINHAS - 1).fill('linha').join('\n') }));
    expect(await (await chamar()).json()).toEqual({ success: true, notaTotal: 0 });
    expect(pedirJson).not.toHaveBeenCalled();
    expect(status()).toEqual(['avaliada']);
  });

  it(`com ${MINIMO_LINHAS} linhas já chama a IA`, async () => {
    bancoFalso.essay.findUnique.mockResolvedValue(redacao({ texto: Array(MINIMO_LINHAS).fill('linha').join('\n') }));
    await chamar();
    expect(pedirJson).toHaveBeenCalledTimes(1);
  });

  it('falha da IA volta para pendente e repassa o status', async () => {
    expect((await chamar()).status).toBe(429);
    expect(status()).toEqual(['pendente']);
  });

  it('exceção volta para pendente e devolve 500', async () => {
    pedirJson.mockRejectedValue(new Error('caiu'));
    expect((await chamar()).status).toBe(500);
    expect(status()).toEqual(['pendente']);
  });

  it('sucesso grava as cinco notas, o total e quem corrigiu', async () => {
    pedirJson.mockResolvedValue({ ok: true, modelo: 'm1', dado: { notas: { c1: 160, c2: 120, c3: 120, c4: 160, c5: 80 }, total: 640 } });
    expect(await (await chamar()).json()).toEqual({ success: true, notaTotal: 640 });
    const { data } = bancoFalso.essay.update.mock.calls[0][0];
    expect(data).toMatchObject({ status: 'avaliada', notaC1: 160, notaC5: 80, notaTotal: 640 });
    expect(JSON.parse(data.avaliacao).corrigidaPor).toBe('m1');
  });

  it('BUG-C9: redação de 200 mil caracteres não é mandada para a IA', async () => {
    bancoFalso.essay.findUnique.mockResolvedValue(redacao({ texto: 'palavra '.repeat(25_000) }));
    await chamar();
    expect(pedirJson).not.toHaveBeenCalled();
  });
});

describe('submit: JSON inválido', () => {
  it.each(['{quebrado', 'null'])('BUG-C5: corpo %s devolve 400, não 500', async (c) => {
    entrarComo();
    expect((await enviar(pedido('/s', c))).status).toBe(400);
  });
});

describe('history e themes', () => {
  beforeEach(() => entrarComo());

  it('lista só as redações do aluno', async () => {
    await historico(pedido('/h'));
    expect(bancoFalso.essay.findMany.mock.calls[0][0].where).toEqual({ userId: 'aluno-1' });
  });

  it('buscar por id também filtra pelo dono; alheia dá 404', async () => {
    expect((await historico(pedido('/h?id=alheia'))).status).toBe(404);
    expect(bancoFalso.essay.findFirst.mock.calls[0][0].where).toEqual({ id: 'alheia', userId: 'aluno-1' });
  });

  it('themes semeia os modelos sem duplicar e devolve a lista', async () => {
    bancoFalso.essayTheme.findMany.mockResolvedValue([{ id: 't' }]);
    expect(await (await temas()).json()).toEqual({ themes: [{ id: 't' }] });
    const arg = bancoFalso.essayTheme.createMany.mock.calls[0][0];
    expect(arg.skipDuplicates).toBe(true);
    expect(arg.data.length).toBeGreaterThan(0);
  });

  it('banco fora: history e themes devolvem 500 sem vazar', async () => {
    bancoFalso.essay.findMany.mockRejectedValue(new Error('segredo'));
    bancoFalso.essayTheme.createMany.mockRejectedValue(new Error('segredo'));
    for (const r of [await historico(pedido('/h')), await temas()]) {
      expect(r.status).toBe(500);
      expect(await r.text()).not.toContain('segredo');
    }
  });
});

describe('ajuda', () => {
  beforeEach(() => entrarComo());

  it.each(['{quebrado', 'null', {}, { tema: 'T' }, { tema: '  ', paragrafo: 'introducao' }, { tema: 'T', paragrafo: 'outro' }])(
    'pedido %j devolve 400 sem IA', async (c) => {
      expect((await ajuda(pedido('/a', c, 'POST'))).status).toBe(400);
      expect(pedirJson).not.toHaveBeenCalled();
    });

  it('limita o tamanho do que vai para a IA', async () => {
    await ajuda(pedido('/a', { tema: 'T'.repeat(9000), paragrafo: 'introducao', texto: 'x'.repeat(100_000), tese: 'y'.repeat(100_000), pergunta: 'z'.repeat(100_000) }));
    expect(pedirJson.mock.calls[0][0].length).toBeLessThan(15_000);
  });

  it('repassa o status de falha da IA', async () => {
    expect((await ajuda(pedido('/a', { tema: 'T', paragrafo: 'introducao' }))).status).toBe(429);
  });
});
