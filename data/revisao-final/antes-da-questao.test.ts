import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, test } from 'vitest';
import { CONCEITOS_ANTES, QUESTOES_COM_ANTES, antesDaQuestao } from '@/lib/antes-da-questao';

const PASTA = join(__dirname, 'dia-2');
const PASTA_ESCADA = join(__dirname, 'escada');
const idsDe = (pasta: string, fora: string[] = []) =>
  readdirSync(pasta)
    .filter((f) => f.endsWith('.json') && !fora.includes(f))
    .flatMap((f) => (JSON.parse(readFileSync(join(pasta, f), 'utf8')) as { id: string }[]).map((q) => q.id));
// Questões do dia 2 e das provas em escada (nível acima novo liga a aulas "Antes" em 23/11/2026).
const IDS = new Set([...idsDe(PASTA, ['aulas.json']), ...idsDe(PASTA_ESCADA)]);
const MAX_LINHA = 170;

describe('antes da questão (conteúdo que a aula do tema não ensina)', () => {
  test('toda questão ligada existe nas provas do dia 2 e todo conceito ligado existe', () => {
    for (const [id, conceitos] of Object.entries(QUESTOES_COM_ANTES)) {
      expect(IDS.has(id), id).toBe(true);
      for (const c of conceitos) expect(CONCEITOS_ANTES[c], `${id} → ${c}`).toBeDefined();
    }
  });

  test('cada conceito tem aula curta em linhas e 2 exercícios com a certa na resolução', () => {
    for (const [id, c] of Object.entries(CONCEITOS_ANTES)) {
      expect(c.linhas.every((l) => l.length <= MAX_LINHA), id).toBe(true);
      expect(c.exercicios.length, id).toBeGreaterThanOrEqual(2);
      for (const e of c.exercicios) {
        expect(e.certa, e.enunciado).toBeLessThan(e.alternativas.length);
        expect(new Set(e.alternativas).size, e.enunciado).toBe(e.alternativas.length);
        const numero = e.alternativas[e.certa].split(' ')[0];
        expect(e.resolucao.split('\n')[0], e.enunciado).toContain(numero);
      }
    }
  });

  test('a mangueira abre com velocidade e velocidade média, nessa ordem', () => {
    expect(antesDaQuestao('cmouei967006buoz9sn75cdpe').map((c) => c.id)).toEqual(['velocidade', 'queda']);
    expect(antesDaQuestao('id-que-nao-existe')).toEqual([]);
  });
});
