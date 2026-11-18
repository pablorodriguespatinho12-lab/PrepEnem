import { describe, expect, test } from 'vitest';
import { avaliarPlano, lerPlano, triosQueServem, respostaSugerida, TEMAS_DO_PLANO } from './plano-quarteto';

const MULHER = 'A persistência da violência contra a mulher na sociedade brasileira'; // Trio 1 pelos juízes
const IMIGRACAO = 'O movimento imigratório para o Brasil no século XXI'; // só o Rui passou
const SAUDE = 'O estigma associado às doenças mentais na sociedade brasileira'; // tem redação pronta
const ETICA = 'O indivíduo frente à ética nacional'; // nenhum

describe('lerPlano: entende o jeito de falar do Pablo', () => {
  test('"no começo, na argumentação, na segunda argumentação"', () => {
    expect(lerPlano('Drummond no começo, Rui na argumentação e Dom Hélder na segunda argumentação').partes)
      .toEqual({ introducao: 'Drummond', d1: 'Rui Barbosa', d2: 'Dom Hélder' });
  });
  test('parte antes do nome, com vírgula ("no segundo, Galeano")', () => {
    const p = lerPlano('Pacto e Drummond na introdução; no primeiro argumento Graciliano; no segundo, Galeano');
    expect(p.partes).toEqual({ introducao: 'Drummond', d1: 'Graciliano', d2: 'Galeano' });
    expect(p.citouPacto).toBe(true);
  });
  test('fora de ordem, mas com a parte dita', () => {
    expect(lerPlano('Rui no D1, Drummond na introdução, Dom Helder no D2').partes)
      .toEqual({ introducao: 'Drummond', d1: 'Rui Barbosa', d2: 'Dom Hélder' });
  });
  test('só os nomes: vale a ordem do texto', () => {
    expect(lerPlano('drummond, graciliano, galeano').partes)
      .toEqual({ introducao: 'Drummond', d1: 'Graciliano', d2: 'Galeano' });
  });
  test('"quarteto 1" no texto não vira "1º argumento"', () => {
    expect(lerPlano('Vou usar o quarteto 1: Drummond na introdução, Rui no primeiro, Dom Hélder no segundo').partes)
      .toEqual({ introducao: 'Drummond', d1: 'Rui Barbosa', d2: 'Dom Hélder' });
  });
  test('pela frase ou pelo personagem', () => {
    expect(lerPlano('os lírios na introdução, Fabiano no 1º, os ninguéns no 2º').partes)
      .toEqual({ introducao: 'Drummond', d1: 'Graciliano', d2: 'Galeano' });
  });
});

describe('avaliarPlano', () => {
  test('quarteto certo no tema certo: "dá certo"', () => {
    const a = avaliarPlano(SAUDE, 'Pacto e Drummond no começo, Rui no primeiro e Dom Hélder no segundo')!;
    expect(a.certo).toBe(true);
    expect(a.titulo).toBe('Boa ideia: dá certo. É o Trio 1.');
    expect(a.ligacoes.length).toBeGreaterThan(0);
    /* A ligação mostrada é a da redação pronta, sem lei de fora. */
    expect(a.ligacoes.map((l) => l.texto).join(' ')).not.toMatch(/\bLei\b|\d{4}/);
  });
  test('quarteto que não passou no tema: aponta quem trocar', () => {
    const a = avaliarPlano(MULHER, 'Pacto e Drummond na introdução, Graciliano no primeiro, Galeano no segundo')!;
    expect(a.certo).toBe(false);
    expect(a.dicas.some((d) => d.includes('não passou'))).toBe(true);
    expect(respostaSugerida(MULHER)).toContain('Trio 1');
  });
  test('faltou uma parte', () => {
    const a = avaliarPlano(IMIGRACAO, 'Pacto e Drummond na introdução e Graciliano no primeiro')!;
    expect(a.certo).toBe(false);
    expect(a.dicas[0]).toContain('2º argumento');
  });
  test('texto sem autor', () => {
    expect(avaliarPlano(IMIGRACAO, 'vou falar de educação')!.titulo).toBe('Não entendi o plano.');
  });
  test('tema fora da lista: null', () => {
    expect(avaliarPlano('tema inventado', 'Drummond')).toBeNull();
  });
});

describe('os 28 temas', () => {
  test('28 temas; o Trio 1 serve em 19 (18 pelos juízes + criança, com redação pronta)', () => {
    expect(TEMAS_DO_PLANO).toHaveLength(28);
    expect(TEMAS_DO_PLANO.filter((t) => triosQueServem(t).length > 0)).toHaveLength(19);
    expect(triosQueServem(MULHER)).toEqual([1]);
    expect(triosQueServem(IMIGRACAO)).toEqual([]);
    expect(respostaSugerida(IMIGRACAO)).toContain('Rui Barbosa');
    expect(triosQueServem(ETICA)).toEqual([]);
  });
  test('todo tema tem resposta sugerida, e ela passa na própria avaliação', () => {
    for (const t of TEMAS_DO_PLANO) {
      const r = respostaSugerida(t);
      if (triosQueServem(t).length > 0) expect(avaliarPlano(t, r)!.certo, t).toBe(true);
    }
  });
});
