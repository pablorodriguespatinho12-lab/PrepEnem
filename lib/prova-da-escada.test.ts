import { describe, expect, it } from 'vitest';
import { etapaDaProva, questoesDoDegrau, type QuestaoDaEscada } from './prova-da-escada';

const q = (id: string, nivel: string, extra: Partial<QuestaoDaEscada> = {}): QuestaoDaEscada => ({
  id, materia: 'Física', tema: 'Cinemática', nivel, anoProva: null, origem: null, ...extra,
});
const degrau = { tema: 'Cinemática', precisaAntes: null, palavras: [] };

describe('prova da escada', () => {
  it('sobe Fácil → Médio → Difícil → ENEM → ITA, mesmo com o banco fora de ordem', () => {
    const todas = [q('i1', 'acima'), q('e1', 'dificil', { anoProva: 2023 }), q('d1', 'dificil'), q('m1', 'medio'), q('f1', 'facil')];
    expect(questoesDoDegrau('Física', degrau, todas).questoes.map((x) => x.id)).toEqual(['f1', 'm1', 'd1', 'e1', 'i1']);
  });

  it('ENEM real vem antes do modelo, e no máximo 2 por etapa', () => {
    const todas = [q('a', 'modelo_enem'), q('b', 'facil', { origem: 'ENEM 2022' }), q('c', 'facil', { anoProva: 2021 })];
    const { questoes } = questoesDoDegrau('Física', degrau, todas);
    expect(questoes.map((x) => x.id)).toEqual(['b', 'c']);
    expect(etapaDaProva(todas[0])).toBe('enem');
  });

  it('diz quais etapas faltam', () => {
    expect(questoesDoDegrau('Física', degrau, [q('f1', 'facil'), q('f2', 'facil')]).faltam).toEqual(['medio', 'dificil', 'juncao', 'enem', 'ita']);
  });

  it('nível acima de raciocínio (id d2-escada-xxx-ita-) entra antes das antigas na vaga do ITA', () => {
    const todas = [q('d2-acima-mat-05', 'acima'), q('d2-acima-mat-06', 'acima'), q('d2-escada-mat-ita-est-01', 'acima')];
    const ita = questoesDoDegrau('Física', degrau, todas).questoes.map((x) => x.id);
    expect(ita).toEqual(['d2-escada-mat-ita-est-01', 'd2-acima-mat-05']);
  });

  it('o resto da ordem não muda: ids de Física e Português seguem como estavam', () => {
    const todas = [q('d2-escada-fis-ele-02', 'acima'), q('d2-escada-fis-ele-01', 'acima'), q('cmux1', 'vestibular')];
    expect(questoesDoDegrau('Física', degrau, todas).questoes.map((x) => x.id)).toEqual(['d2-escada-fis-ele-01', 'd2-escada-fis-ele-02']);
  });

  it('junção vem ANTES do ENEM e o ITA é sempre o último degrau; a 1ª prova não cobra junção', () => {
    const todas = [q('i1', 'acima'), q('j1', 'juncao'), q('e1', 'dificil', { anoProva: 2023 })];
    expect(questoesDoDegrau('Física', degrau, todas).questoes.map((x) => x.id)).toEqual(['j1', 'e1', 'i1']);
    expect(questoesDoDegrau('Física', degrau, [], false).faltam).not.toContain('juncao');
  });
});
