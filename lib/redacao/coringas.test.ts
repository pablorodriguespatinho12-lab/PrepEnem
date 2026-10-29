// Coringas (Pablo, 29/10/2026): frases de autor e dados fáceis de decorar.
// Cada motivo tem 2 frases e 1 dado, todos com a frase que os amarra ao
// motivo; nenhum é dos batidos; a ajuda da IA os recebe.

import { describe, expect, test } from 'vitest';
import { CORINGAS, coringaPorNome } from './autores';
import { CAUSAS } from './receita';
import { promptAjuda } from './ajuda';

/* Os que aparecem em quase toda lista de repertório (pesquisa de 29/10/2026,
   docs/redacao/repertorios-coringa.md), e a frase sem fonte primária. */
const BATIDOS = /bauman|foucault|arendt|byung|durkheim|kant|arist[óo]teles|plat[ãa]o|orwell|huxley|freire|maslow|mandela|luther king|wiesel|betinho|rui barbosa|josu[ée] de castro/i;
/* "Fácil de memorizar": frase de até 22 palavras. */
const PALAVRAS_FALA = 22;
const LIMITE_AMARRA = 130;

describe('coringas', () => {
  test.each(CAUSAS.map((c) => [c.chave, c] as const))('%s: 2 frases e 1 dado, todos com amarra para este motivo', (chave, causa) => {
    expect(causa.coringas).toHaveLength(3);
    const tipos = causa.coringas.map((n) => coringaPorNome(n)?.tipo);
    expect(tipos.filter((t) => t === 'fala')).toHaveLength(2);
    expect(tipos.filter((t) => t === 'dado')).toHaveLength(1);
    for (const nome of causa.coringas) expect(coringaPorNome(nome)?.amarra[chave], `${nome} sem amarra para ${chave}`).toBeTruthy();
  });
  test('todo coringa entra em pelo menos 1 motivo', () => {
    const usados = new Set(CAUSAS.flatMap((c) => c.coringas));
    for (const nome of Object.keys(CORINGAS)) expect(usados.has(nome), nome).toBe(true);
  });
  test('frase curta, dado com número, com fonte e data, sem emoji e sem batido', () => {
    for (const [nome, k] of Object.entries(CORINGAS)) {
      if (k.tipo === 'fala') expect(k.texto.split(/\s+/).length, nome).toBeLessThanOrEqual(PALAVRAS_FALA);
      else expect(/\d/.test(k.texto), nome).toBe(true);
      expect(k.fonte.length, nome).toBeGreaterThan(5);
      expect(k.quando, nome).toMatch(/\d{4}/);
      for (const a of Object.values(k.amarra)) expect(a.length, nome).toBeLessThanOrEqual(LIMITE_AMARRA);
      expect(/\p{Extended_Pictographic}/u.test(`${k.texto}${Object.values(k.amarra).join('')}`), nome).toBe(false);
      expect(BATIDOS.test(`${k.rotulo} ${k.fonte}`), nome).toBe(false);
    }
  });
  test('a ajuda da IA recebe os coringas do motivo, com a frase exata e a ligação', () => {
    const p = promptAjuda({ tema: 'T', paragrafo: 'desenvolvimento1', texto: '', tese: '', causaA: 'acesso', causaB: 'estado', pergunta: '' });
    expect(p).toContain('[coringa, fala] Dom Hélder Câmara: "Quando dou comida aos pobres');
    expect(p).toContain('[coringa, dado] 3 em 10 não entendem um texto');
    expect(p).toContain('Ligação ao motivo: Doar resolve o dia');
    expect(p).not.toContain('Fabiano');
  });
});
