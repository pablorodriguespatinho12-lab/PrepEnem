// Coringas (Pablo, 29/10/2026): frases de autor e dados fáceis de decorar, que
// PASSARAM na prova (docs/redacao/prova-coringas.md): 3 juízes cegos, 11 temas
// do ENEM de 2015 a 2025. Cada motivo tem 3, do mais universal ao menos, e
// cada um tem a amarra para aquele motivo.

import { describe, expect, test } from 'vitest';
import { CORINGAS, coringaPorNome } from './autores';
import { CAUSAS, coringasDosMotivos } from './receita';
import { promptAjuda } from './ajuda';

/* Os que aparecem em quase toda lista de repertório, e a frase sem fonte. */
const BATIDOS = /bauman|foucault|arendt|byung|durkheim|kant|arist[óo]teles|plat[ãa]o|orwell|huxley|freire|maslow|mandela|betinho|josu[ée] de castro/i;
const PALAVRAS_FALA = 22;
const LIMITE_AMARRA = 130;
/* Abaixo de 60% dos temas não é coringa: tem de dizer em que temas serviu. */
const UNIVERSAL = 0.6;

describe('coringas', () => {
  test.each(CAUSAS.map((c) => [c.chave, c] as const))('%s: 3 coringas, do mais testado ao menos, com amarra', (chave, causa) => {
    expect(causa.coringas).toHaveLength(3);
    const provas = causa.coringas.map((n) => coringaPorNome(n)!.prova.aprovados);
    expect(provas).toEqual([...provas].sort((a, b) => b - a));
    expect(causa.coringas.filter((n) => coringaPorNome(n)!.tipo === 'fala').length).toBeGreaterThanOrEqual(2);
    for (const nome of causa.coringas) expect(coringaPorNome(nome)?.amarra[chave], `${nome} sem amarra para ${chave}`).toBeTruthy();
  });
  test('todo coringa entra em pelo menos 1 motivo', () => {
    const usados = new Set(CAUSAS.flatMap((c) => c.coringas));
    for (const nome of Object.keys(CORINGAS)) expect(usados.has(nome), nome).toBe(true);
  });
  test('quem passou em poucos temas diz onde serve', () => {
    for (const [nome, k] of Object.entries(CORINGAS)) {
      expect(k.prova.aprovados, nome).toBeLessThanOrEqual(k.prova.temas);
      if (k.prova.aprovados / k.prova.temas < UNIVERSAL) expect(k.restricao, nome).toBeTruthy();
    }
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
  test('a ajuda da IA recebe os coringas do motivo, com a prova e a ligação', () => {
    const p = promptAjuda({ tema: 'T', paragrafo: 'desenvolvimento1', texto: '', tese: '', causaA: 'acesso', causaB: 'estado', pergunta: '' });
    expect(p).toContain('[coringa, fala, serviu em 24 de 28 temas] Rui Barbosa: "Tratar com desigualdade');
    expect(p).toContain('Ligação ao motivo: Doar resolve o dia');
    expect(p).not.toContain('Fabiano');
  });
});

/* Revisor, 29/10/2026: motivo ainda não escolhido apagava os coringas do outro. */
test('coringas à vista: alterna os motivos e não some com motivo vazio', () => {
  expect(coringasDosMotivos(['estigma', 'estado'], 3)).toEqual(['Graciliano', 'Drummond', 'Elie Wiesel']);
  expect(coringasDosMotivos([null, 'estado'], 3)).toEqual(['Drummond', 'Rui Barbosa', 'Dom Hélder']);
  expect(coringasDosMotivos(['estado', 'acesso'], 3)).toEqual(['Drummond', 'Rui Barbosa', 'Dom Hélder']);
});
