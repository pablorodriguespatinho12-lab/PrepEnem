import { describe, expect, test } from 'vitest';
import { proximoDegrau, registrarLicao, registrarRevisao, revisoesPendentes, situacao, type EstadoDegrau } from './progresso';
import type { Degrau } from './tipos';

const D = (id: string, prerequisitos: string[] = []): Degrau => ({
  id, modulo: 'pre', titulo: id, objetivo: '', pergunta: '', prerequisitos, minutos: 20,
});
const TRILHA = [D('a'), D('b', ['a']), D('c', ['a', 'b'])];
const AGORA = new Date('2026-10-05T12:00:00Z');
const DIA = 24 * 60 * 60 * 1000;

const concluida = (licaoId: string, proximaRevisao: Date | null = null): EstadoDegrau =>
  ({ licaoId, status: 'concluida', acertos: 4, tentativas: 5, revisoes: 0, proximaRevisao });

describe('situação dos degraus', () => {
  test('toda lição fica aberta desde o começo, com ou sem pré-requisito', () => {
    const estados = new Map([['a', concluida('a')]]);
    expect(situacao(TRILHA[0], estados)).toBe('concluida');
    expect(situacao(TRILHA[1], estados)).toBe('disponivel');
    expect(situacao(TRILHA[2], estados)).toBe('disponivel');
  });

  test('o próximo degrau é o primeiro aberto e não concluído', () => {
    expect(proximoDegrau(TRILHA, new Map())!.id).toBe('a');
    expect(proximoDegrau(TRILHA, new Map([['a', concluida('a')]]))!.id).toBe('b');
    expect(proximoDegrau(TRILHA, new Map(TRILHA.map((d) => [d.id, concluida(d.id)])))).toBeNull();
  });
});

describe('registrarLicao', () => {
  test('terminar os exercícios conclui, com qualquer número de acertos, e agenda revisão em 2 dias', () => {
    const e = registrarLicao(undefined, 'a', 1, 5, AGORA);
    expect(e.status).toBe('concluida');
    expect(e.proximaRevisao!.getTime()).toBe(AGORA.getTime() + 2 * DIA);
  });

  test('sem exercício nenhum, continua em andamento e sem revisão', () => {
    const e = registrarLicao(undefined, 'a', 0, 0, AGORA);
    expect(e.status).toBe('em_andamento');
    expect(e.proximaRevisao).toBeNull();
  });

  test('refazer mal uma lição concluída não a desconclui nem mexe na revisão', () => {
    const antes = concluida('a', new Date(AGORA.getTime() + 5 * DIA));
    const depois = registrarLicao(antes, 'a', 0, 5, AGORA);
    expect(depois.status).toBe('concluida');
    expect(depois.proximaRevisao).toEqual(antes.proximaRevisao);
  });
});

describe('revisão espaçada', () => {
  test('acertar aumenta o intervalo; errar volta para amanhã', () => {
    const r1 = registrarRevisao(concluida('a'), true, AGORA);
    expect(r1.proximaRevisao!.getTime()).toBe(AGORA.getTime() + 7 * DIA);
    const r2 = registrarRevisao(r1, true, AGORA);
    expect(r2.proximaRevisao!.getTime()).toBe(AGORA.getTime() + 21 * DIA);
    const errou = registrarRevisao(r2, false, AGORA);
    expect(errou.revisoes).toBe(0);
    expect(errou.proximaRevisao!.getTime()).toBe(AGORA.getTime() + 1 * DIA);
  });

  test('pendentes são as concluídas com revisão vencida, da mais atrasada para a mais nova', () => {
    const estados = [
      concluida('a', new Date(AGORA.getTime() - DIA)),
      concluida('b', new Date(AGORA.getTime() + DIA)),
      concluida('c', new Date(AGORA.getTime() - 3 * DIA)),
    ];
    expect(revisoesPendentes(estados, AGORA)).toEqual(['c', 'a']);
  });
});
