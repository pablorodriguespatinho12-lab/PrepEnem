import { describe, expect, test } from 'vitest';
import katex from 'katex';
import { renderizarTextoMatematico } from '@/lib/visual/texto-matematico';
import { chaveVestibular } from '@/lib/vestibular/tipos';
import { QUESTOES_VESTIBULAR } from '.';

// Gabaritos oficiais copiados à parte das fontes (ITA: vestibular.ita.br;
// Unesp: gabarito Vunesp versão 1; IME, Fuvest e Unicamp: banco de origem,
// conferido por resolução). Os dados têm de bater com esta segunda cópia.
const OFICIAL: Record<string, string> = {
  'ITA 2025': '1B 3C 4D 5D 6B 7A 10D 11A 12C 13B',
  'IME 2024': '1C 3B 4C 5D 8D 9A 11C 14D 26D 28C',
  'Fuvest 2025': '25B 52D 61C 64B 70A 76D 77E',
  'Fuvest 2024': '24B 33A 34A',
  'Unicamp 2024': '38B 54C 55D 56B 58C 59C 60B 61B 62B 64C',
  'Unesp 2025': '71E 73E 74B 75C 78A 85A 89C 90A',
};

const letra = (i: number) => 'ABCDE'[i];

describe('questões de vestibular', () => {
  test('48 questões, cada uma com o gabarito oficial', () => {
    expect(QUESTOES_VESTIBULAR).toHaveLength(48);
    const nossas: Record<string, string[]> = {};
    for (const q of QUESTOES_VESTIBULAR) (nossas[chaveVestibular(q)] ??= []).push(`${q.numero}${letra(q.gabarito)}`);
    expect(Object.fromEntries(Object.entries(nossas).map(([k, v]) => [k, v.join(' ')]))).toEqual(OFICIAL);
  });

  test('sem repetição, alternativas e passos bem formados', () => {
    const chaves = QUESTOES_VESTIBULAR.map((q) => `${chaveVestibular(q)}#${q.numero}`);
    expect(new Set(chaves).size).toBe(chaves.length);
    for (const q of QUESTOES_VESTIBULAR) {
      const nome = `${chaveVestibular(q)} Q${q.numero}`;
      expect(q.alternativas.length, nome).toBe(q.banca === 'Unicamp' ? 4 : 5);
      expect(q.gabarito, nome).toBeLessThan(q.alternativas.length);
      expect(q.passos.length, nome).toBeGreaterThanOrEqual(2);
      expect(q.passos.length, nome).toBeLessThanOrEqual(4);
      for (const p of q.passos) {
        expect(p.opcoes.length, nome).toBeGreaterThanOrEqual(2);
        expect(p.correta, nome).toBeLessThan(p.opcoes.length);
        expect(new Set(p.opcoes).size, `${nome}: opções repetidas`).toBe(p.opcoes.length);
      }
    }
  });

  test('toda fórmula renderiza sem erro', () => {
    const textos = QUESTOES_VESTIBULAR.flatMap((q) => [
      q.enunciado, ...q.alternativas, ...q.passos.flatMap((p) => [p.pergunta, ...p.opcoes, p.porque ?? '']),
    ]);
    for (const texto of textos) {
      // Tirando as fórmulas (mesmo recorte de lib/visual/texto-matematico.ts),
      // só pode sobrar o $ de "R$": um $ solto é fórmula que não fechou.
      const fora = texto.replace(/(?<![$R])\$(?!\$)([^$\n]+?)\$/g, '');
      expect(fora.replace(/R\$/g, ''), texto.slice(0, 80)).not.toContain('$');
      expect(renderizarTextoMatematico(texto), texto.slice(0, 80)).not.toContain('katex-error');
    }
    for (const q of QUESTOES_VESTIBULAR) {
      for (const p of q.passos) {
        if (p.conta) expect(() => katex.renderToString(p.conta!, { throwOnError: true }), p.conta).not.toThrow();
      }
    }
  });
});
test('a opção certa não fica sempre no mesmo lugar da tela', async () => {
  const { ordemFixa, sementeDoPasso } = await import('@/lib/vestibular/ordem');
  const lugares = new Map<number, number>();
  let total = 0;
  for (const q of QUESTOES_VESTIBULAR) {
    q.passos.forEach((p, i) => {
      const lugar = ordemFixa(p.opcoes.length, sementeDoPasso(q, i)).indexOf(p.correta);
      lugares.set(lugar, (lugares.get(lugar) ?? 0) + 1);
      total++;
    });
  }
  // Com 3 opções, cada lugar deve ficar entre 20% e 46% das vezes.
  for (const lugar of [0, 1, 2]) {
    const fracao = (lugares.get(lugar) ?? 0) / total;
    expect(fracao, `lugar ${lugar}`).toBeGreaterThan(0.2);
    expect(fracao, `lugar ${lugar}`).toBeLessThan(0.46);
  }
});
test('a conta quebrada em linhas continua renderizando, linha por linha', async () => {
  const { quebrarConta } = await import('@/lib/vestibular/conta');
  expect(quebrarConta(String.raw`a^2-2a-195=0\ \Rightarrow\ (a-15)(a+13)=0\ \Rightarrow\ a=15`))
    .toEqual(['a^2-2a-195=0', String.raw`\Rightarrow\ (a-15)(a+13)=0`, String.raw`\Rightarrow\ a=15`]);
  expect(quebrarConta(String.raw`r_{\min}=A-C,\qquad r_{\max}=A+C`)).toEqual([String.raw`r_{\min}=A-C`, String.raw`r_{\max}=A+C`]);
  for (const q of QUESTOES_VESTIBULAR) {
    for (const p of q.passos) {
      for (const linha of quebrarConta(p.conta ?? '')) {
        expect(() => katex.renderToString(linha, { throwOnError: true }), linha).not.toThrow();
      }
    }
  }
});
test('linha comprida quebra antes do "=", e cada pedaço renderiza', async () => {
  const { quebrarConta } = await import('@/lib/vestibular/conta');
  const linhas = quebrarConta(String.raw`\tfrac12\,\big|(a-1)\cdot4a-2\,(a^2-5)\big|=\tfrac12\,(2a^2-4a+10)=a^2-2a+5`);
  expect(linhas).toHaveLength(3);
  expect(linhas[1].startsWith('=')).toBe(true);
});
