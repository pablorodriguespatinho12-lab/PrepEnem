import { describe, expect, it } from 'vitest';
import { letraCombina, letrasPelaInicial, palavrasDoSignificado, trocarLetra, trocasDaAula } from './letras';

const passo = (formula: string, letras: { letra: string; oque: string }[], extra: object[] = []) => [
  { titulo: 'A equação em letras', texto: 'A questão quer a chance. Por que × 2? A conta usa G.', visual: { tipo: 'equacao', formula, leitura: 'chance = parte ÷ todo', letras } },
  ...extra,
];

describe('letra pela inicial', () => {
  it('reconhece letra que já combina com alguma palavra do significado', () => {
    expect(letraCombina('T', 'temperatura em kelvin')).toBe(true);
    expect(letraCombina('A', 'área da faixa (o que a questão quer)')).toBe(true);
    expect(letraCombina('m', 'massa do corpo')).toBe(true);
    expect(letraCombina('H', 'altura máxima')).toBe(true); // clássica
    expect(letraCombina('Q', 'calor necessário')).toBe(true); // clássica
    expect(letraCombina('T', 'total investido')).toBe(true);
    expect(letraCombina('x', 'o número escondido')).toBe(true); // incógnita
    expect(letraCombina('E', 'm³ que passaram de 10')).toBe(true); // com unidade: não adivinha
    expect(letraCombina('G', 'chance de ficar toda dentro')).toBe(false);
    expect(letraCombina('J', 'soma que já tem')).toBe(false);
  });

  it('ignora artigo, aparte e número ao olhar o significado', () => {
    expect(palavrasDoSignificado('o tempo de queda (o que a questão quer)')).toEqual(['tempo', 'queda']);
  });

  it('troca G por C (chance) em toda a aula, sem tocar em "A questão"', () => {
    const passos = passo('G = F ÷ T', [{ letra: 'G', oque: 'chance de ficar toda dentro (o que a questão quer)' }, { letra: 'F', oque: 'casos favoráveis' }, { letra: 'T', oque: 'todos os casos' }], [
      { titulo: 'Achando G', texto: 'G = 3 ÷ 12. A questão pede a chance.', visual: null },
    ]);
    const r = letrasPelaInicial(passos);
    expect(r.trocas).toEqual([{ de: 'G', para: 'C', oque: 'chance de ficar toda dentro (o que a questão quer)' }]);
    const eq = r.passos[0].visual as { formula: string; letras: { letra: string }[] };
    expect(eq.formula).toBe('C = F ÷ T');
    expect(eq.letras[0].letra).toBe('C');
    expect(r.passos[1].titulo).toBe('Achando C');
    expect(r.passos[1].texto).toBe('C = 3 ÷ 12. A questão pede a chance.');
  });

  it('não troca para uma letra que já está em uso na equação', () => {
    const t = trocasDaAula(passo('J = C × 2', [{ letra: 'J', oque: 'soma que já tem' }, { letra: 'C', oque: 'custo da parcela' }]));
    expect(t.map((x) => x.para)).toEqual(['S']);
  });

  it('não troca para letra que já é ponto da figura ou nome na questão (Q → D, com ponto D no enunciado)', () => {
    const passos = passo('Q = P ÷ 2', [{ letra: 'Q', oque: 'distância até o poste' }, { letra: 'P', oque: 'ponto médio' }]);
    expect(trocasDaAula(passos, 'Os pontos P e D estão na reta. Qual é a distância até o poste?')).toEqual([]);
    expect(trocasDaAula(passos, 'Uma reta.')).toEqual([{ de: 'Q', para: 'D', oque: 'distância até o poste' }]);
  });

  it('não troca a letra velha se ela também é nome na questão (ponto B)', () => {
    const passos = passo('B = A × 2', [{ letra: 'B', oque: 'área da base' }, { letra: 'A', oque: 'ponto A' }]);
    expect(trocasDaAula(passos, 'O ponto B fica à direita de A.').find((x) => x.de === 'B')).toBeUndefined();
  });

  it('letra ambígua (A, E, O) só troca ao lado de sinal de conta, nunca em frase', () => {
    expect(trocarLetra('A questão quer E = A × 2', 'A', 'P')).toBe('A questão quer E = P × 2');
    expect(trocarLetra('E sobra 3. E = 5 × 2', 'E', 'S')).toBe('E sobra 3. S = 5 × 2');
  });

  it('a letra da alternativa ("Letra C.") nunca é trocada', () => {
    expect(trocarLetra('C = 38 / Letra C. A moda é 38. Escolha a alternativa C.', 'C', 'V')).toBe('V = 38 / Letra C. A moda é 38. Escolha a alternativa C.');
  });

  it('coeficiente (número que multiplica, termo fixo) fica com a, b, c', () => {
    expect(trocasDaAula(passo('V = A × 5', [{ letra: 'A', oque: 'número que multiplica o t × t' }, { letra: 'B', oque: 'termo fixo da lei' }]))).toEqual([]);
  });

  it('não mexe em R$, grau nem dentro de palavra', () => {
    expect(trocarLetra('R$ 5 e 30 °C, R = 2, Rua', 'R', 'X')).toBe('R$ 5 e 30 °C, X = 2, Rua');
    expect(trocarLetra('30 °C = C', 'C', 'Z')).toBe('30 °C = Z');
  });

  it('letra que já combina fica; aula sem troca devolve o mesmo array', () => {
    const passos = passo('E = R × 1,25', [{ letra: 'E', oque: 'estrada (o que a questão quer)' }, { letra: 'R', oque: 'linha reta real' }]);
    const r = letrasPelaInicial(passos);
    expect(r.trocas).toEqual([]);
    expect(r.passos).toBe(passos);
  });

  it('letra de mais de um caractere (CM, ΔT) nunca é trocada', () => {
    expect(trocasDaAula(passo('D = CM ÷ 100', [{ letra: 'CM', oque: 'distância em cm' }, { letra: 'D', oque: 'distância em metros' }]))).toEqual([]);
  });
});
