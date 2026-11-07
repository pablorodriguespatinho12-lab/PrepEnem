import { describe, expect, test } from 'vitest';
import { baralhosDosQuartetos, cartoesDosQuartetos } from './cartoes-quartetos';
import { deveManterOrdem } from '../flashcards/ordem-fixa';
import { CORINGAS } from './autores';

const cartoes = cartoesDosQuartetos();
const palavras = (s: string) => s.toLowerCase().match(/\p{L}{5,}/gu) ?? [];

describe('baralho dos quartetos', () => {
  test('escadinha em 3 baralhos: falas, sentidos, quartetos', () => {
    const [falas, sentidos, quartetos] = baralhosDosQuartetos();
    expect(falas.cartoes.map((c) => c.frente.split(':')[0])).toEqual(['Carlos Drummond de Andrade', 'Rui Barbosa', 'Dom Hélder Câmara', 'Graciliano Ramos', 'Eduardo Galeano']);
    expect(falas.cartoes.every((c) => c.frente.endsWith('qual é a frase?'))).toBe(true);
    expect(sentidos.cartoes.every((c) => c.frente.endsWith('O que ele quer dizer?'))).toBe(true);
    expect(sentidos.cartoes[0].frente).toContain('Os lírios não nascem da lei');
    expect(quartetos.cartoes[0].frente).toContain('em quantos temas');
    expect(quartetos.cartoes).toHaveLength(14);
  });
  test('os 3 baralhos estudam em ordem (não embaralham)', () => {
    for (const b of baralhosDosQuartetos()) expect(deveManterOrdem(b.nome), b.nome).toBe(true);
  });
  test('frentes únicas (o seed casa o progresso pela frente)', () => {
    expect(new Set(cartoes.map((c) => c.frente)).size).toBe(cartoes.length);
  });
  test('24 cartões, todos com frente, verso e dica', () => {
    expect(cartoes).toHaveLength(24);
    for (const c of cartoes) expect(c.frente && c.verso && c.dica, c.frente).toBeTruthy();
  });
  test('a dica nunca entrega uma palavra do verso', () => {
    for (const c of cartoes) {
      const verso = new Set(palavras(c.verso));
      for (const p of palavras(c.dica)) expect(verso.has(p), `${c.frente}: "${p}"`).toBe(false);
    }
  });
  test('as frases são as mesmas das fichas do site', () => {
    const galeano = cartoes.find((c) => c.frente === 'Eduardo Galeano: qual é a frase?')!;
    expect(galeano.verso).toContain(CORINGAS.Galeano.texto);
    const rui = cartoes.find((c) => c.frente === 'Rui Barbosa: qual é a frase?')!;
    expect(rui.verso).toContain(CORINGAS['Rui Barbosa'].curta);
  });
  test('o Pacto traz os 4 artigos', () => {
    const pacto = cartoes.find((c) => c.frente.startsWith('Pacto: qual artigo'))!;
    expect(pacto.verso).toBe('art. 6º e 7º: trabalho digno; art. 11: alimentação e moradia; art. 12: saúde física e mental; art. 13: educação.');
  });
});
