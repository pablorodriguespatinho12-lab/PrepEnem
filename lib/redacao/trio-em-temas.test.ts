import { describe, expect, test } from 'vitest';
import { MODELOS } from '@/data/redacao/modelos';
import coringasPorTema from './coringas-por-tema.json';
import { TRIOS } from './cartoes-trios';
import { autoresEmTemas } from './trio-em-temas';
import { EXEMPLO_PARAGRAFOS } from './exemplo-receita';

type Veredito = Record<string, Record<string, { serve: boolean }>>;
const VEREDITO = coringasPorTema as unknown as Veredito;

describe('o mesmo autor em 3 temas', () => {
  test('cada trio tem pelo menos 3 redações prontas, e cada autor uma linha em cada uma', () => {
    for (const trio of [1, 2] as const) {
      const autores = autoresEmTemas(trio);
      expect(autores.map((a) => a.autor)).toEqual(['Drummond', TRIOS[trio].d1, TRIOS[trio].d2]);
      const total = MODELOS.filter((m) => m.trio === trio).length;
      expect(total).toBeGreaterThanOrEqual(3);
      for (const a of autores) expect(a.usos, `${trio}/${a.autor}`).toHaveLength(total);
    }
  });

  test('todo autor de redação de trio passou na prova dos juízes NAQUELE tema', () => {
    for (const m of MODELOS.filter((x) => x.trio)) {
      const trio = TRIOS[m.trio!];
      for (const autor of ['Drummond', trio.d1, trio.d2]) {
        expect(VEREDITO[m.tema]?.[autor]?.serve, `${m.id}: ${autor}`).toBe(true);
      }
    }
  });

  test('a fala de cada autor aparece igual no texto das 3 redações do trio', () => {
    const marcas: Record<string, string> = {
      Drummond: 'os lírios não nascem da lei', 'Rui Barbosa': 'e não igualdade real',
      'Dom Hélder': 'por que eles são pobres', Graciliano: 'Você é um bicho, Fabiano', Galeano: 'os filhos de ninguém, os donos de nada',
    };
    for (const m of MODELOS.filter((x) => x.trio)) {
      const trio = TRIOS[m.trio!];
      const texto = Object.values(m.partes).map((p) => p.texto).join(' ').toLowerCase();
      for (const autor of ['Drummond', trio.d1, trio.d2]) expect(texto, `${m.id}: ${autor}`).toContain(marcas[autor].toLowerCase());
      expect(texto, `${m.id}: Pacto`).toContain('pacto internacional sobre direitos econômicos, sociais e culturais');
    }
  });

  test('conectivo entre parágrafos não se repete na mesma redação (C4)', () => {
    for (const m of MODELOS.filter((x) => x.trio)) {
      const comecos = Object.values(m.partes).map((p) => p.texto.split(',')[0]);
      expect(new Set(comecos).size, m.id).toBe(comecos.length);
    }
  });

  /* Pablo, 07/11/2026: "eu só sei os trios... esses trios, nada mais". Ano só
     dos repertórios do trio; nenhuma lei, órgão, campanha ou detalhe de livro. */
  test('toda redação-modelo é de trio', () => {
    expect(MODELOS.filter((m) => !m.trio).map((m) => m.id)).toEqual([]);
  });

  test('redação de trio usa só o repertório do trio', () => {
    const DE_FORA = /\bLei\b|Constitui|Estatuto|STF|LGPD|Setembro|IBGE|Funai|Incra|CAPS|UBS|Autoridade Nacional|inferno|cascudo|bolivian|Foucault|Goffman|Barbacena|Arendt|Beauvoir|Federici|Paradiso/;
    const ANOS_DO_TRIO = new Set(['1966', '1992', '1921', '1938', '1989']);
    const textos = [
      ...MODELOS.map((m) => ({ id: m.id, texto: Object.values(m.partes).map((p) => p.texto).join(' ') })),
      { id: 'exemplo do Treino por partes', texto: Object.values(EXEMPLO_PARAGRAFOS).flatMap((p) => p.frases).join(' ') },
    ];
    for (const m of textos) {
      const texto = m.texto;
      for (const ano of texto.match(/\b\d{4}\b/g) ?? []) expect(ANOS_DO_TRIO.has(ano), `${m.id}: ano ${ano}`).toBe(true);
      expect(texto.match(DE_FORA)?.[0], m.id).toBeUndefined();
    }
  });
});
