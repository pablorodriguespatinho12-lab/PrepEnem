// Camada A: as regras da correção v3, sem IA. Cada teste quebra uma coisa na
// evidência ou no texto e confere que a nota cai na competência certa.

import { describe, expect, test } from 'vitest';
import { corrigirRedacao, erroPrincipal, COMPETENCIAS } from '@/lib/redacao/correcao';
import { conectivosRepetidos, trechoExiste } from '@/lib/redacao/trecho';
import { REDACAO, evidencia1000 } from './fixtures';

const base = evidencia1000();
const corrigir = (sobrescrever: Record<string, unknown> = {}, texto = REDACAO) =>
  corrigirRedacao(evidencia1000(sobrescrever), texto);

describe('trechoExiste', () => {
  test('acha o trecho mesmo com caixa, acento ou pontuação trocados', () => {
    expect(trechoExiste('segundo erving goffman em estigma', REDACAO)).toBe(true);
    expect(trechoExiste('a sociedade reduz a pessoa... excluí-la por ele', REDACAO)).toBe(true);
  });
  test('tolera uma letra errada na cópia de um trecho longo ("Estima" por "Estigma")', () => {
    expect(trechoExiste('Segundo Erving Goffman, em Estima, a sociedade reduz a pessoa a um atributo', REDACAO)).toBe(true);
    expect(trechoExiste('em Estima', REDACAO)).toBe(false);
  });
  test('frase longa parecida, mas trocando o sentido, não passa', () => {
    expect(trechoExiste('Segundo Michel Foucault, em História da Loucura, a sociedade isola quem foge', REDACAO)).toBe(false);
  });
  test('2 frases reais coladas, pulando o meio, valem; fora de ordem não', () => {
    const texto = 'Além disso as pessoas tem vergonha. Então ficam caladas e ninguém ajuda.\n\nPortanto, o governo deve ajudar as pessoas.';
    expect(trechoExiste('Além disso, as pessoas têm vergonha. Portanto, o governo deve ajudar...', texto)).toBe(true);
    expect(trechoExiste('Portanto, o governo deve ajudar as pessoas. Além disso as pessoas tem vergonha.', texto)).toBe(false);
  });
  test('palavras soltas com ponto não viram trecho (revisor, 29/10/2026)', () => {
    const texto = 'O Estado falha. A escola ignora o tema e a família se cala diante da mídia.';
    expect(trechoExiste('Estado. Escola. Família. Mídia.', texto)).toBe(false);
  });
  test('trecho inventado ou curto demais não existe', () => {
    expect(trechoExiste('segundo Michel Foucault', REDACAO)).toBe(false);
    expect(trechoExiste('o', REDACAO)).toBe(false);
    expect(trechoExiste(null, REDACAO)).toBe(false);
  });
});

describe('nota sem trecho é inválida', () => {
  test('a evidência completa chega a 1000, com trecho em todas as competências', () => {
    const c = corrigir()!;
    expect(c.total).toBe(1000);
    for (const comp of COMPETENCIAS) expect(c.justificativas![comp].trecho).toBeTruthy();
  });
  test.each(['c1', 'c2', 'c3', 'c4'] as const)('%s sem trecho recusa a correção inteira', (comp) => {
    expect(corrigir({ [comp]: { ...base[comp], trecho: '' } })).toBeNull();
  });
  test.each(['c1', 'c2', 'c3', 'c4'] as const)('%s com trecho que não está na redação recusa a correção', (comp) => {
    expect(corrigir({ [comp]: { ...base[comp], trecho: 'frase que o aluno nunca escreveu' } })).toBeNull();
  });
  test('formato fora do schema é recusado', () => {
    expect(corrigirRedacao({ c1: { estrutura: 'ótima' } }, REDACAO)).toBeNull();
    expect(corrigirRedacao(null, REDACAO)).toBeNull();
  });
});

describe('C2: repertório em 3 passos', () => {
  const rep = base.c2.repertorios[0];
  test('sem a amarra ao tema vira repertório de bolso e a C2 cai para 160', () => {
    const c = corrigir({ c2: { ...base.c2, repertorios: [{ ...rep, amarra: null }] } })!;
    expect(c.c2.repertorios[0].bolso).toBe(true);
    expect(c.notas.c2).toBe(160);
    expect(erroPrincipal(c, 'c2')).toContain('Repertório de bolso');
  });
  test('passo com trecho inventado conta como ausente', () => {
    const c = corrigir({ c2: { ...base.c2, repertorios: [{ ...rep, amarra: 'como mostram os dados do IBGE de 2022' }] } })!;
    expect(c.c2.repertorios[0].produtivo).toBe(false);
    expect(c.notas.c2).toBe(160);
  });
  test('ligado ao tema mas sem explicar a ideia também é bolso (o Bauman da Cartilha 2025)', () => {
    const c = corrigir({ c2: { ...base.c2, repertorios: [{ ...rep, explica: null }] } })!;
    expect(c.c2.repertorios[0].bolso).toBe(true);
    expect(c.notas.c2).toBe(160);
    expect(erroPrincipal(c, 'c2')).toContain('sem explicar a ideia');
  });
  test('a IA dizer "produtivo" não basta: quem decide são os 3 trechos', () => {
    const c = corrigir({ c2: { ...base.c2, repertorios: [{ ...rep, explica: null, produtivo: true }] } })!;
    expect(c.notas.c2).toBe(160);
  });
  test('tangenciar o tema trava C2, C3 e C5 em 40', () => {
    const c = corrigir({ c2: { ...base.c2, abordagem: 'tangencia' } })!;
    expect([c.notas.c2, c.notas.c3, c.notas.c5]).toEqual([40, 40, 40]);
  });
});

describe('C5: elemento por elemento', () => {
  test('sem agente perde 40', () => {
    const c = corrigir({ c5: { ...base.c5, agente: { trecho: null, valido: false } } })!;
    expect(c.notas.c5).toBe(160);
    expect(erroPrincipal(c, 'c5')).toBe('Falta na proposta: agente.');
  });
  test('"conscientizar" sem meio não conta como ação', () => {
    const texto = REDACAO.replace('deve criar campanhas permanentes contra o estigma, por meio de anúncios nas redes sociais e nas unidades básicas de saúde,', 'deve conscientizar a população,');
    const c = corrigir({
      c5: { ...base.c5, acao: { trecho: 'deve conscientizar a população', valido: true }, modo: { trecho: null, valido: false } },
    }, texto)!;
    expect(c.c5.acao.valido).toBe(false);
    expect(c.notas.c5).toBe(120);
  });
  test('elemento com trecho que não está no texto não vale', () => {
    const c = corrigir({ c5: { ...base.c5, detalhamento: { trecho: 'com verba do FUNDEB', valido: true } } })!;
    expect(c.notas.c5).toBe(160);
  });
});

describe('C4: conectivo repetido', () => {
  test('acha o conectivo usado 3 vezes ou abrindo 2 parágrafos', () => {
    expect(conectivosRepetidos(REDACAO)).toEqual([]);
    expect(conectivosRepetidos('Além disso, a.\n\nAlém disso, b.')).toEqual(['alem disso']);
  });
  test('trava a C4 em 160 mesmo com a IA dando 200', () => {
    const texto = REDACAO.replace('Em primeiro lugar,', 'Além disso,').replace('Portanto,', 'Além disso,');
    const c = corrigir({ c4: { ...base.c4, trecho: 'a herança manicomial também contribui' } }, texto)!;
    expect(c.notas.c4).toBe(160);
    expect(erroPrincipal(c, 'c4')).toContain('Repetição');
    expect(c.travas.join(' ')).toContain('Conectivo repetido');
  });
});
describe('C1: desvio que não vale', () => {
  test('desvio fora do texto ou com a correção igual ao trecho não conta', () => {
    const desvios = [
      { trecho: 'Eremos Seis', tipo: 'grafia', correcao: 'Eremas Seis' },
      { trecho: 'reduz a pessoa a um atributo', tipo: 'aspas', correcao: 'reduz a pessoa  a um atributo' },
      { trecho: 'a sociedade reduz a pessoa', tipo: 'regência', correcao: 'a sociedade reduz à pessoa' },
    ];
    const c = corrigir({ c1: { ...base.c1, desvios } })!;
    expect(c.c1.desvios.map((d) => d.trecho)).toEqual(['a sociedade reduz a pessoa']);
  });
});

describe('travas de forma', () => {
  test('texto em um parágrafo só trava a C4 em 80', () => {
    const texto = REDACAO.replace(/\n\n/g, ' ');
    expect(corrigir({}, texto)!.notas.c4).toBe(80);
  });
});
describe('resumo', () => {
  test('competência no 200 não tem erro principal', () => {
    const c = corrigir()!;
    expect(COMPETENCIAS.map((comp) => erroPrincipal(c, comp))).toEqual([null, null, null, null, null]);
  });
});
