import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bancoFalso as db, gravacoes, zerar } from '../apoio/banco-falso';

vi.mock('@/lib/db', async () => ({ prisma: (await import('../apoio/banco-falso')).bancoFalso }));
const ia = vi.hoisted(() => ({ chave: '', resposta: vi.fn() }));
vi.mock('@/lib/ai-client', () => ({ getAbacusApiKey: () => ia.chave }));
// a "IA" devolve JSON bruto; a validação de cada lib roda de verdade
vi.mock('@/lib/pedir-json', () => ({
  pedirJson: vi.fn(async (prompt: string, validar: (b: unknown) => unknown) => {
    const dado = validar(await ia.resposta(prompt));
    return dado ? { ok: true, dado } : { ok: false, erro: 'inválida', status: 502 };
  }),
}));
vi.mock('next/cache', () => ({ unstable_cache: (fn: () => unknown) => fn }));

import { comCache } from '@/lib/cache-ia';
import { getSubtemaLevel } from '@/lib/learning-order';
import { gerarQuestoesConferidas } from '@/lib/questoes-geradas';
import { agendarRevisaoDoErro } from '@/lib/revisao';
import { degrauDoDia, getCycleInfoForDay, getWeekTopics, studyCycle } from '@/lib/schedule-data';
import { getActiveStudyDay, upsertStudyProgress } from '@/lib/study-progress';
import { degrausDasAncoras, validarAcima } from '@/lib/treino-degraus';
import { resolverIndependente } from '@/lib/verificar-respostas';

beforeEach(() => {
  zerar();
  ia.chave = '';
  ia.resposta.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const questao = (respostaCorreta = 'B') => ({
  enunciado: 'e', alternativaA: '1', alternativaB: '2', alternativaC: '3', alternativaD: '4', alternativaE: '5',
  respostaCorreta, explicacao: 'x',
});

describe('agendarRevisaoDoErro', () => {
  const amanha = new Date('2026-11-28T03:00:00Z');
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-28T02:00:00Z')); // 23h do dia 27 em Brasília
  });
  it('cria para amanhã (Brasília) quando não há pendente', async () => {
    await agendarRevisaoDoErro('u', 'q');
    expect(db.reviewSchedule.create.mock.calls[0][0].data).toEqual({ userId: 'u', questionId: 'q', proximaRevisao: amanha, intervaloAtual: 1 });
  });
  it('reaproveita a pendente, voltando ao intervalo 1', async () => {
    db.reviewSchedule.findFirst.mockResolvedValue({ id: 'r' });
    await agendarRevisaoDoErro('u', 'q');
    expect(db.reviewSchedule.update.mock.calls[0][0]).toEqual({ where: { id: 'r' }, data: { proximaRevisao: amanha, intervaloAtual: 1 } });
    expect(gravacoes()).toEqual(['reviewSchedule.update']);
  });
});

describe('dia ativo do plano', () => {
  const todos = (status: string) => studyCycle.flatMap((s) => s.days.map((_, dayIndex) => ({ weekNumber: s.weekNumber, dayIndex, status })));
  it.each(['nao_iniciado', 'em_andamento', 'pulado'])('dia "%s" continua sendo o de hoje', async (status) => {
    db.studyProgress.findMany.mockResolvedValue([{ weekNumber: 1, dayIndex: 0, status }]);
    expect(await getActiveStudyDay('u')).toEqual({ weekNumber: 1, dayIndex: 0, cycleComplete: false });
  });
  it('passa para a semana 2 depois dos 7 dias', async () => {
    db.studyProgress.findMany.mockResolvedValue(todos('concluido').slice(0, 7));
    expect(await getActiveStudyDay('u')).toEqual({ weekNumber: 2, dayIndex: 0, cycleComplete: false });
  });
  it('ciclo completo fica no último dia', async () => {
    db.studyProgress.findMany.mockResolvedValue(todos('concluido'));
    expect(await getActiveStudyDay('u')).toEqual({ weekNumber: 4, dayIndex: 6, cycleComplete: true });
  });
  it.each([['concluido', true], ['pulado', true], ['em_andamento', false], ['nao_iniciado', false]] as const)(
    '%s grava data de conclusão: %s', async (status, temData) => {
      await upsertStudyProgress('u', 1, 0, status);
      expect(db.studyProgress.upsert.mock.calls[0][0].update.completedAt instanceof Date).toBe(temData);
    });
});

describe('cronograma', () => {
  it.each([[-1, -1, 1, 0], [1, 0, 1, 0], [4, 6, 4, 6], [5, 7, 4, 6]])('(%i,%i) fica dentro do ciclo', (s, d, semana, dia) => {
    const info = getCycleInfoForDay(s, d);
    expect(info.weekNumber).toBe(semana);
    expect(info.daySchedule).toBe(studyCycle[semana - 1].days[dia]);
  });
  it('sexta é simulado, sem tópicos', () => {
    for (const s of studyCycle) expect(s.days[4]).toMatchObject({ isSimulado: true, topics: [] });
  });
  it('degrau não passa do fim da escada; matéria sem escada é null', () => {
    expect(degrauDoDia('Física', 999)?.tema).toBeTruthy();
    expect(degrauDoDia('Inexistente', 0)).toBeNull();
  });
  it('semana fora do ciclo não tem tópicos', () => {
    expect(getWeekTopics(-1)).toEqual([]);
    expect(getWeekTopics(4)).toEqual([]);
  });
  it('BUG-E20: juntar os assuntos da semana não altera o cronograma de segunda', () => {
    const antes = JSON.stringify(studyCycle);
    getWeekTopics(0);
    expect(JSON.stringify(studyCycle) === antes, `assuntos de segunda agora: ${studyCycle[0].days[0].topics[0].subtemas.join(', ')}`).toBe(true);
  });
});

describe('ordem de aprendizado', () => {
  it.each([['Biologia', 'x', 0], ['Física', 'assunto que não existe', 3], ['Química', 'QUÍMICA ORGÂNICA', 5]])(
    '%s / %s -> %i', (materia, subtema, nivel) => expect(getSubtemaLevel(materia, subtema)).toBe(nivel));
});

describe('comCache', () => {
  const validar = (v: string) => (v === 'bom' ? v : null);
  it('devolve o dado validado', async () => {
    expect(await comCache('p', 'x', async () => ({ ok: true, dado: 'bom' }), validar)).toEqual({ ok: true, dado: 'bom' });
  });
  it('dado guardado que já não vale vira 502', async () => {
    expect(await comCache('p', 'x', async () => ({ ok: true, dado: 'velho' }), validar)).toMatchObject({ ok: false, status: 502 });
  });
  it('falha da IA mantém o status', async () => {
    expect(await comCache('p', 'x', async () => ({ ok: false, erro: 'cota', status: 429 }), validar)).toEqual({ ok: false, erro: 'cota', status: 429 });
  });
  it('erro inesperado sobe', async () => {
    await expect(comCache('p', 'x', async () => { throw new Error('quebrou'); }, validar)).rejects.toThrow('quebrou');
  });
});

describe('conferência por um segundo modelo', () => {
  it('lista vazia não chama a IA', async () => {
    expect(await resolverIndependente([])).toEqual([]);
    expect(ia.resposta).not.toHaveBeenCalled();
  });
  it.each([
    ['b', { indice: 1 }], ['B) dois', { indice: 1 }], ['F', null],
  ])('letra %j', async (letra, esperado) => {
    ia.resposta.mockResolvedValue({ respostas: [{ n: 1, letra }] });
    expect(await resolverIndependente([{ enunciado: 'e', opcoes: ['1', '2', '3', '4', '5'] }])).toEqual([esperado]);
  });
  it.each([[undefined], [''], [null]])('BUG-E22: letra ausente (%j) não pode virar A', async (letra) => {
    ia.resposta.mockResolvedValue({ respostas: [{ n: 1, letra }] });
    expect(await resolverIndependente([{ enunciado: 'e', opcoes: ['1', '2', '3', '4', '5'] }])).toEqual([null]);
  });
  it.each([[45, { valor: 45 }], ['2,5', { valor: 2.5 }], [0, { valor: 0 }], ['abc', null]])('valor %j', async (valor, esperado) => {
    ia.resposta.mockResolvedValue({ respostas: [{ n: 1, valor }] });
    expect(await resolverIndependente([{ enunciado: 'e' }])).toEqual([esperado]);
  });
  it.each([[undefined], [''], [null]])('BUG-E21: resposta numérica ausente (%j) não pode virar 0', async (valor) => {
    ia.resposta.mockResolvedValue({ respostas: [{ n: 1, valor }] });
    expect(await resolverIndependente([{ enunciado: 'e' }])).toEqual([null]);
  });
  it('geradas: fica só a que o conferente resolveu igual', async () => {
    ia.resposta
      .mockResolvedValueOnce({ questoes: [questao('B'), { ...questao('C'), enunciado: 'f' }] })
      .mockResolvedValueOnce({ respostas: [{ n: 1, letra: 'B' }, { n: 2, letra: 'A' }] });
    expect((await gerarQuestoesConferidas('p')).map((q) => q.enunciado)).toEqual(['e']);
  });
  it.each([
    ['geração falha', [{}]],
    ['conferência falha', [{ questoes: [questao()] }, {}]],
  ])('geradas: %s -> nenhuma', async (_n, respostas) => {
    for (const r of respostas) ia.resposta.mockResolvedValueOnce(r);
    expect(await gerarQuestoesConferidas('p')).toEqual([]);
  });
});

describe('degraus', () => {
  const ancora = { id: 'a', materia: 'Física', subtema: 's', tema: 't', ...questao() } as any;
  const salvo = (id: string, nivel: string) => ({ id, nivel, ancoraId: 'a' });
  const degraus = (...niveis: string[]) => ({ degraus: niveis.map((nivel) => ({ ...questao(), nivel })) });
  const concordam = (n: number) => ({ respostas: Array.from({ length: n }, (_, i) => ({ n: i + 1, letra: 'B' })) });

  it('do banco, em ordem de nível, sem chamar a IA', async () => {
    db.question.findMany.mockResolvedValue([salvo('4', 'acima'), salvo('3', 'dificil'), salvo('1', 'facil'), salvo('2', 'medio')]);
    const mapa = await degrausDasAncoras([ancora]);
    expect(mapa.get('a')!.map((q) => q.id)).toEqual(['1', '2', '3', '4']);
    expect(ia.resposta).not.toHaveBeenCalled();
  });
  it('sem chave de IA, âncora volta sem degraus', async () => {
    expect((await degrausDasAncoras([ancora])).get('a')).toEqual([]);
    expect(gravacoes()).toEqual([]);
  });
  it.each([[2, 0], [3, 3]])('gerados com %i degraus conferidos: salva %i', async (n, salvos) => {
    ia.chave = 'x';
    ia.resposta
      .mockResolvedValueOnce(degraus(...Array(n).fill('facil')))
      .mockResolvedValueOnce(concordam(n))
      .mockResolvedValue({});
    await degrausDasAncoras([ancora]);
    expect(db.question.create).toHaveBeenCalledTimes(salvos);
  });
  it('validarAcima só aceita nível acima com gabarito A-E', () => {
    expect(validarAcima(degraus('facil'))).toBeNull();
    expect(validarAcima({ degraus: [{ ...questao('F'), nivel: 'acima' }] })).toBeNull();
    expect(validarAcima(degraus('acima'))).toHaveLength(1);
  });
});
