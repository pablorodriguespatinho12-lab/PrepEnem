import { describe, expect, test } from 'vitest';
import { CORINGAS } from './autores';
import { cartoesDosCoringas, MEMORIA } from './cartoes-coringas';

describe('baralho dos coringas', () => {
  const cartoes = cartoesDosCoringas();
  test('todo coringa tem mecanismo e imagem, e vira 2 cartões', () => {
    for (const chave of Object.keys(CORINGAS)) expect(MEMORIA[chave], chave).toBeTruthy();
    expect(cartoes).toHaveLength(Object.keys(CORINGAS).length * 2 + 1);
  });
  test('o verso traz a frase exata; a dica nunca entrega a resposta', () => {
    for (const k of Object.values(CORINGAS)) {
      if (k.tipo !== 'fala') continue;
      expect(cartoes.some((c) => c.verso === `"${k.texto}"`), k.rotulo).toBe(true);
    }
    /* Nenhuma palavra de 5 letras ou mais da dica pode estar no verso: senão ela entrega. */
    const palavras = (s: string) => s.toLowerCase().match(/\p{L}{5,}/gu) ?? [];
    for (const c of cartoes) {
      if (c.frente.startsWith('Como ligar')) continue;
      const verso = c.verso.toLowerCase();
      for (const p of palavras(c.dica)) expect(verso.includes(p), `${c.frente}: "${p}"`).toBe(false);
    }
  });
  test('o "complete" mostra só o começo da frase', () => {
    const drummond = cartoes.find((c) => c.frente.startsWith('Carlos Drummond'))!;
    expect(drummond.frente).toBe('Carlos Drummond de Andrade: "As leis não bastam. Os..."');
    expect(drummond.verso).toBe('"As leis não bastam. Os lírios não nascem da lei."');
  });
  test('quem só serve em alguns temas avisa onde usar', () => {
    const machado = cartoes.find((c) => c.frente === 'Coringa para: quem vence leva tudo, quem perde ganha pena')!;
    expect(machado.verso).toContain('Use em temas como:');
  });
});
