import { describe, expect, test } from 'vitest';
import type { CorrecaoCompleta } from './correcao';
import { comparar, montarDevolutiva, paragrafoDoTrecho } from './devolutiva';

const REDACAO = [
  'Hoje em dia muita gente tem preconceito com quem tem doença mental. Esse estigma decorre do preconceito.',
  'Em primeiro lugar, muitas pessoas não conseguem pagar psicólogo.',
  'Além disso as pessoas tem vergonha de falar que estão doentes.',
  'Portanto, o governo deve ajudar as pessoas.',
].join('\n\n');

const elemento = (valido: boolean, trecho = 'x') => ({ trecho: valido ? trecho : null, valido });
const rep = (parcial: Partial<CorrecaoCompleta['c2']['repertorios'][number]> = {}) =>
  ({ trecho: 'Segundo Goffman', legitimado: true, pertinente: true, produtivo: true, comentario: '', explica: 'x', amarra: 'x', bolso: false, ...parcial });
/* A redação do leigo, como a correção do site devolveria. */
const correcao = (parcial: Partial<CorrecaoCompleta> = {}): CorrecaoCompleta => ({
  versao: 3,
  notas: { c1: 120, c2: 40, c3: 80, c4: 80, c5: 40 },
  total: 360,
  travas: [],
  c1: { estrutura: 'regular', desvios: [{ trecho: 'as pessoas tem vergonha', tipo: 'concordância', correcao: 'as pessoas têm vergonha' }] },
  c2: { abordagem: 'completa', partesEmbrionarias: 0, copiaMotivadores: false, repertorios: [] },
  c3: { paragrafos: [{ numero: 2, ideia: 'custo do psicólogo', desenvolvida: false, comentario: '' }], contradicaoGrave: false },
  c4: { operadoresEntreParagrafos: ['Em primeiro lugar', 'Além disso', 'Portanto'], inadequacoes: [], repeticoes: [] },
  c5: { agente: elemento(true, 'o governo'), acao: elemento(true), modo: elemento(false), efeito: elemento(false), detalhamento: elemento(false), desrespeitaDH: false, condicional: false },
  proximoPasso: {},
  reescritas: [],
  ...parcial,
});
const notas = (c1: number, c2: number, c3: number, c4: number, c5: number) => ({ c1, c2, c3, c4, c5 }) as CorrecaoCompleta['notas'];

describe('o que treinar', () => {
  test('empate na nota mais baixa: a proposta vem antes do repertório', () => {
    const d = montarDevolutiva(correcao(), REDACAO);
    expect(d.treinar).toMatchObject({ competencia: 'c5', passo: 7 });
    expect(d.treinar?.oQueFalta).toBe('Sua proposta ainda não diz: como fazer (meio); para quê (finalidade); um detalhe a mais sobre uma dessas partes (detalhamento).');
    expect(d.meta).toEqual({ competencia: 'c5', de: 40, para: 80 });
  });
  test('sem exemplo de fora: passo 5, com o molde da frase e onde achar o autor', () => {
    const d = montarDevolutiva(correcao({ notas: notas(120, 40, 80, 80, 120) }), REDACAO);
    expect(d.treinar).toMatchObject({ competencia: 'c2', passo: 5 });
    expect(d.treinar?.comoFazer).toContain('"Autores deste motivo"');
    expect(d.treinar?.comoFazer).toContain('"Nesse sentido, [autor] mostra que [ideia]."');
  });
  test('erro de português leva ao parágrafo onde ele está', () => {
    const d = montarDevolutiva(correcao({ notas: notas(40, 120, 120, 120, 120) }), REDACAO);
    expect(d.treinar).toMatchObject({ competencia: 'c1', passo: 6 });
    expect(d.treinar?.oQueFalta).toBe('Em "as pessoas tem vergonha", o certo é: as pessoas têm vergonha.');
  });
  test('parágrafo não desenvolvido: diz que falta explicar, no passo dele', () => {
    const d = montarDevolutiva(correcao({ notas: notas(120, 120, 40, 120, 120) }), REDACAO);
    expect(d.treinar).toMatchObject({ competencia: 'c3', passo: 5 });
    expect(d.treinar?.oQueFalta).toBe('O 1º desenvolvimento afirma uma ideia, mas não explica por quê.');
  });
  test('C3 baixa sem parágrafo marcado: não acusa nenhum parágrafo', () => {
    const d = montarDevolutiva(correcao({ notas: notas(120, 120, 40, 120, 120), c3: { paragrafos: [], contradicaoGrave: false } }), REDACAO);
    expect(d.treinar?.oQueFalta).not.toMatch(/desenvolvimento|introdução|conclusão/);
  });
  test('nota máxima em tudo: nada a treinar e sem meta', () => {
    const d = montarDevolutiva(correcao({ notas: notas(200, 200, 200, 200, 200), total: 1000 }), REDACAO);
    expect(d.treinar).toBeNull();
    expect(d.meta).toBeNull();
  });
  test('empate entre coesão e ideias: coesão primeiro (troca da lista)', () => {
    expect(montarDevolutiva(correcao({ notas: notas(120, 120, 80, 80, 120) }), REDACAO).treinar?.competencia).toBe('c4');
  });
});

/* Revisores, 29/10/2026: frases que eram falsas em algum caso. */
describe('nunca diz o que a correção não sustenta', () => {
  test('fuga ao tema vem antes de tudo, sem "já funciona"', () => {
    const d = montarDevolutiva(correcao({ notas: notas(0, 0, 0, 0, 0), total: 0, c2: { ...correcao().c2, abordagem: 'fuga' } }), REDACAO);
    expect(d.treinar?.oQueFalta).toContain('não fala do tema');
    expect(d.jaFunciona).toBeNull();
  });
  test('zero por tamanho: pede as frases do molde no parágrafo mais curto', () => {
    const d = montarDevolutiva(correcao({ notas: notas(0, 0, 0, 0, 0), total: 0, travas: ['Texto com até 7 linhas recebe nota zero no ENEM.'] }), REDACAO);
    expect(d.treinar).toMatchObject({ passo: 7 });
    expect(d.treinar?.oQueFalta).toContain('menos de 8 linhas');
  });
  test('proposta com "se": manda tirar o "se", e a meta conta os elementos que já valem', () => {
    const c5 = { ...correcao().c5, modo: elemento(true), efeito: elemento(true), condicional: true };
    const d = montarDevolutiva(correcao({ notas: notas(120, 120, 120, 120, 80), c5 }), REDACAO);
    expect(d.treinar?.oQueFalta).toContain('"se"');
    expect(d.meta).toEqual({ competencia: 'c5', de: 80, para: 160 });
  });
  test('exemplo inventado ou fora do tema: manda trocar, não "explicar melhor"', () => {
    const c2 = { ...correcao().c2, repertorios: [rep({ trecho: 'Doença mental', legitimado: false, produtivo: false })] };
    const d = montarDevolutiva(correcao({ notas: notas(120, 40, 120, 120, 120), c2 }), REDACAO);
    expect(d.treinar?.oQueFalta).toContain('não é conhecido ou não fala do tema');
  });
  test('citou sem dizer a ideia: aponta o passo que falta', () => {
    const c2 = { ...correcao().c2, repertorios: [rep({ explica: null, bolso: true, produtivo: false })] };
    expect(montarDevolutiva(correcao({ notas: notas(120, 80, 120, 120, 120), c2 }), REDACAO).treinar?.oQueFalta)
      .toBe('Você citou "Segundo Goffman". Agora falta dizer, com as suas palavras, o que ele pensa.');
  });
  test('coesão sem erro apontado: frase geral, sem acusar', () => {
    const d = montarDevolutiva(correcao({ notas: notas(200, 200, 200, 160, 200) }), REDACAO);
    expect(d.treinar?.oQueFalta).toBe('A ligação entre uma frase e outra pode ficar mais clara.');
  });
  test('só 1 parágrafo ligado: não diz "nenhum"', () => {
    const c4 = { ...correcao().c4, operadoresEntreParagrafos: ['Portanto'] };
    expect(montarDevolutiva(correcao({ notas: notas(200, 200, 200, 80, 200), c4 }), REDACAO).treinar?.oQueFalta).toBe('Só 1 parágrafo começa com palavra de ligação.');
  });
});

describe('o que já funciona', () => {
  test('é um fato do texto, da parte mais alta que não é a do treino', () => {
    expect(montarDevolutiva(correcao(), REDACAO).jaFunciona).toBe('Só 1 erro de português no texto todo.');
    const semC1 = montarDevolutiva(correcao({ notas: notas(40, 40, 80, 120, 40) }), REDACAO);
    expect(semC1.jaFunciona).toBe('Você ligou os parágrafos com "Em primeiro lugar", "Além disso", "Portanto".');
  });
  test('proposta: conta as partes e mostra o trecho dele', () => {
    expect(montarDevolutiva(correcao({ notas: notas(40, 40, 40, 40, 80) }), REDACAO).jaFunciona).toBe('Sua proposta já tem 2 das 5 partes. Quem faz: "o governo".');
  });
  test('exemplo fora do tema não vira "já funciona"', () => {
    const c2 = { ...correcao().c2, repertorios: [rep({ pertinente: false })] };
    expect(montarDevolutiva(correcao({ notas: notas(40, 120, 40, 40, 40), c2 }), REDACAO).jaFunciona).not.toContain('exemplo de fora');
  });
  test('sem nada acima de 80: os 4 parágrafos escritos contam', () => {
    expect(montarDevolutiva(correcao({ notas: notas(40, 40, 40, 40, 40) }), REDACAO).jaFunciona).toContain('4 parágrafos');
  });
  test('sem elogio vazio', () => {
    expect(montarDevolutiva(correcao(), REDACAO).jaFunciona).not.toMatch(/parabéns|ótimo|muito bem|excelente/i);
  });
});

test('trecho é achado no parágrafo certo, sem diferença de maiúscula', () => {
  expect(paragrafoDoTrecho(REDACAO, 'PORTANTO, o governo')).toBe(4);
  expect(paragrafoDoTrecho(REDACAO, 'não existe no texto')).toBe(0);
});

test('comparação: total e a parte que mais mudou', () => {
  const r = comparar(notas(80, 40, 80, 80, 40), notas(80, 40, 80, 120, 120));
  expect(r).toEqual({ antes: 320, agora: 440, maisMudou: { competencia: 'c5', diferenca: 80 } });
  const zero = notas(0, 0, 0, 0, 0);
  expect(comparar(zero, zero).maisMudou).toBeNull();
});
