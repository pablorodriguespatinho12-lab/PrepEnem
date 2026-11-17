import { describe, expect, test } from 'vitest';
import { baralhosDosTrios } from './cartoes-trios';
import { MODELOS } from '@/data/redacao/modelos';
import { deveManterOrdem } from '../flashcards/ordem-fixa';

const baralhos = baralhosDosTrios();
const todos = baralhos.flatMap((b) => b.cartoes);
const palavras = (s: string) => s.toLowerCase().match(/\p{L}{5,}/gu) ?? [];

describe('flashcards de redação em escadinha', () => {
  /* Só o Trio 1 (Pablo, 07/11/2026). */
  test('4 baralhos: 3 falas, 3 sentidos, 5 posições, 1 tema por redação pronta', () => {
    expect(baralhos.map((b) => b.cartoes.length)).toEqual([3, 3, 5, MODELOS.filter((m) => m.trio).length]);
    expect(baralhos.map((b) => b.nome[0])).toEqual(['1', '2', '3', '4']);
  });
  test('baralho 1: o nome na frente, a fala atrás, começando pelo Drummond', () => {
    const [falas] = baralhos;
    expect(falas.cartoes[0]).toMatchObject({ frente: 'Carlos Drummond de Andrade' });
    expect(falas.cartoes[0].verso).toContain('As leis não bastam. Os lírios não nascem da lei.');
  });
  test('baralho 2: a fala na frente, o sentido atrás', () => {
    expect(baralhos[1].cartoes.every((c) => c.frente.endsWith('O que ele quer dizer?'))).toBe(true);
    expect(baralhos[1].cartoes[0].frente).toContain('Os lírios não nascem da lei');
  });
  test('nenhum autor do Trio 2 nos baralhos', () => {
    for (const c of todos) expect(`${c.frente} ${c.verso} ${c.dica}`, c.frente).not.toMatch(/Graciliano|Galeano|Fabiano|ninguéns|Trio 2/);
  });
  test('nenhum "quarteto" na tela', () => {
    for (const c of todos) expect(`${c.frente} ${c.verso} ${c.dica}`.toLowerCase()).not.toContain('quarteto');
  });
  test('frentes únicas e todos com frente, verso e dica', () => {
    expect(new Set(todos.map((c) => c.frente)).size).toBe(todos.length);
    for (const c of todos) expect(c.frente && c.verso && c.dica, c.frente).toBeTruthy();
  });
  test('a dica nunca entrega uma palavra do verso', () => {
    for (const c of todos) {
      const verso = new Set(palavras(c.verso));
      for (const p of palavras(c.dica ?? '')) expect(verso.has(p), `${c.frente}: "${p}"`).toBe(false);
    }
  });
  test('os 4 baralhos estudam inteiros e em ordem', () => {
    for (const b of baralhos) expect(deveManterOrdem(b.nome), b.nome).toBe(true);
  });
});
