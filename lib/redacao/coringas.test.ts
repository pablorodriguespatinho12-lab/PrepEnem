// Coringas raros (Pablo, 29/10/2026): cada motivo tem 3, cada um com a frase
// que o amarra ao motivo; nenhum é dos batidos; a ajuda da IA os recebe.

import { describe, expect, test } from 'vitest';
import { CORINGAS, coringaPorNome } from './autores';
import { CAUSAS } from './receita';
import { promptAjuda } from './ajuda';

/* Os que aparecem em quase toda lista de "repertório coringa" (pesquisa de
   29/10/2026, docs/redacao/repertorios-coringa.md). */
const BATIDOS = /bauman|foucault|arendt|byung|durkheim|kant|arist[óo]teles|plat[ãa]o|orwell|huxley|constitui|freire|maslow|darcy|freyre|black mirror|tempos modernos|utopia/i;
const LIMITE_IDEIA = 160;
const LIMITE_AMARRA = 130;

describe('coringas raros', () => {
  test.each(CAUSAS.map((c) => [c.chave, c] as const))('%s: 3 coringas, todos com amarra para este motivo', (chave, causa) => {
    expect(causa.coringas).toHaveLength(3);
    for (const nome of causa.coringas) expect(coringaPorNome(nome)?.amarra[chave], `${nome} sem amarra para ${chave}`).toBeTruthy();
  });
  test('todo coringa entra em pelo menos 1 motivo', () => {
    const usados = new Set(CAUSAS.flatMap((c) => c.coringas));
    for (const nome of Object.keys(CORINGAS)) expect(usados.has(nome), nome).toBe(true);
  });
  test('ficha curta, ano plausível, sem emoji e sem nenhum batido', () => {
    for (const [nome, k] of Object.entries(CORINGAS)) {
      expect(k.ideia.length, nome).toBeLessThanOrEqual(LIMITE_IDEIA);
      for (const a of Object.values(k.amarra)) expect(a.length, nome).toBeLessThanOrEqual(LIMITE_AMARRA);
      expect(k.ano, nome).toBeGreaterThan(1850);
      expect(k.ano, nome).toBeLessThanOrEqual(2026);
      expect(/\p{Extended_Pictographic}/u.test(`${k.ideia}${Object.values(k.amarra).join('')}`), nome).toBe(false);
      expect(BATIDOS.test(`${k.nome} ${k.obra}`), nome).toBe(false);
    }
  });
  test('a ajuda da IA recebe os coringas do motivo, com a ligação', () => {
    const p = promptAjuda({ tema: 'T', paragrafo: 'desenvolvimento1', texto: '', tese: '', causaA: 'acesso', causaB: 'estado', pergunta: '' });
    expect(p).toContain('[raro] Robert K. Merton (Efeito Mateus)');
    expect(p).toContain('Ligação ao motivo: Quem nasce com acesso');
    expect(p).not.toContain('Vozes da Seca');
  });
});
