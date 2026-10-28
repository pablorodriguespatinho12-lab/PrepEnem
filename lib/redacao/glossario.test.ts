import { describe, expect, test } from 'vitest';
import { GLOSSARIO, marcarTermos } from './glossario';

const termos = (texto: string, usados = new Set<string>()) =>
  marcarTermos(texto, usados).filter((p) => p.termo).map((p) => p.texto);

describe('glossário: 1ª vez de cada termo na tela', () => {
  test('marca o termo só na 1ª vez, mesmo em textos seguidos da mesma tela', () => {
    const usados = new Set<string>();
    expect(termos('Sua tese vira a tese do passo 3.', usados)).toEqual(['tese']);
    expect(termos('A tese entra sozinha.', usados)).toEqual([]);
  });
  test('maiúscula, plural e termo de duas palavras', () => {
    expect(termos('Tópico frasal: causa A. Repertórios do eixo.')).toEqual(['Tópico frasal', 'Repertórios']);
    expect(termos('Feche com a proposta de intervenção e o agente.')).toEqual(['proposta de intervenção', 'agente']);
  });
  test('palavra que só contém o termo não conta', () => {
    expect(termos('Uma hipótese, um agenteiro, pontezinha.')).toEqual([]);
  });
  test('o texto volta inteiro, sem perder nada', () => {
    const t = 'Molde: Segundo [autor]. Ponte: liga o repertório ao Brasil.';
    expect(marcarTermos(t, new Set()).map((p) => p.texto).join('')).toBe(t);
  });
  test('cada termo pedido pelo Pablo tem 1 frase curta, sem emoji', () => {
    expect(GLOSSARIO.map((t) => t.chave).sort()).toEqual(['agente', 'molde', 'ponte', 'proposta', 'repertorio', 'tese', 'topico']);
    for (const t of GLOSSARIO) {
      expect(t.frase.length, t.chave).toBeLessThanOrEqual(110);
      expect(/\p{Extended_Pictographic}/u.test(t.frase)).toBe(false);
    }
  });
});
