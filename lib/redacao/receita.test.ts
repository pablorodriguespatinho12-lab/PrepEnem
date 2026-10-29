import { describe, expect, test } from 'vitest';
import {
  CARACTERES_POR_LINHA, CAUSAS, contarLinhas, duplaSugerida, ehTemaDaLista, montarRedacao, moldeTese, PARAGRAFOS,
  palavrasChaveDoTema, preencherProblema, problemaDoTema, situacaoLinhas, teseTemPalavraDoTema,
} from './receita';
import { AUTORES } from './autores';
import { EXEMPLO_CAUSAS, EXEMPLO_PARAGRAFOS, EXEMPLO_TEMA, EXEMPLO_TESE, exemploDoParagrafo } from './exemplo-receita';
import { CHAVE_RASCUNHO, CHAVE_SALVAS, guardarEmSalvas, lerRascunho, rascunhoVazio, salvarRascunho, apagarRascunho } from './rascunho-receita';

/* Armazenamento de mentira: um Map, ou um que estoura em tudo (aba anônima). */
function memoria() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => { m.set(k, v); },
    removeItem: (k: string) => { m.delete(k); },
    m,
  };
}
const quebrado = {
  getItem: () => { throw new Error('bloqueado'); },
  setItem: () => { throw new Error('bloqueado'); },
  removeItem: () => { throw new Error('bloqueado'); },
};

describe('contador de linhas (~70 caracteres por linha)', () => {
  test('texto vazio é 0 linha', () => {
    expect(contarLinhas('')).toBe(0);
    expect(contarLinhas('  \n\n ')).toBe(0);
  });
  test('até 70 caracteres é 1 linha; 71 já são 2', () => {
    expect(contarLinhas('a'.repeat(CARACTERES_POR_LINHA))).toBe(1);
    expect(contarLinhas('a'.repeat(CARACTERES_POR_LINHA + 1))).toBe(2);
  });
  test('cada parágrafo começa numa linha nova', () => {
    expect(contarLinhas(`${'a'.repeat(10)}\n\n${'b'.repeat(10)}`)).toBe(2);
  });
  test('a meta do parágrafo diz curto, na meta ou longo', () => {
    expect(situacaoLinhas(0, 6, 7)).toBe('vazio');
    expect(situacaoLinhas(5, 6, 7)).toBe('curto');
    expect(situacaoLinhas(7, 6, 7)).toBe('na-meta');
    expect(situacaoLinhas(8, 6, 7)).toBe('longo');
  });
});

describe('molde e montagem', () => {
  test('a tese vem preenchida com as causas escolhidas', () => {
    expect(moldeTese('estado', 'estigma')).toBe('Tal cenário decorre, sobretudo, da negligência estatal na garantia de direitos já previstos em lei e do estigma social, que torna invisível quem sofre com o problema.');
    expect(moldeTese(null, null)).toBe('Tal cenário decorre, sobretudo, de [causa A] e de [causa B].');
  });
  test('a redação montada tem os 4 parágrafos na ordem, separados por linha em branco', () => {
    const texto = montarRedacao({ introducao: 'I. ', desenvolvimento1: 'D1.', desenvolvimento2: 'D2.', conclusao: 'C.' });
    expect(texto).toBe('I.\n\nD1.\n\nD2.\n\nC.');
  });
});

describe('rascunho: salvar e restaurar', () => {
  test('o que foi salvo volta igual', () => {
    const arm = memoria();
    const r = { ...rascunhoVazio(), passo: 5, tema: 'Envelhecimento', causaA: 'estigma' as const, paragrafos: { ...rascunhoVazio().paragrafos, introducao: 'Segundo Goffman...' } };
    expect(salvarRascunho(r, arm)).toBe(true);
    expect(lerRascunho(arm)).toEqual(r);
  });
  test('sem nada salvo, ou com JSON quebrado, começa vazio', () => {
    const arm = memoria();
    expect(lerRascunho(arm)).toEqual(rascunhoVazio());
    arm.setItem(CHAVE_RASCUNHO, '{quebrado');
    expect(lerRascunho(arm)).toEqual(rascunhoVazio());
  });
  test('rascunho de versão velha ganha os campos que faltam', () => {
    const arm = memoria();
    arm.setItem(CHAVE_RASCUNHO, JSON.stringify({ passo: 3, tema: 'X', paragrafos: { introducao: 'oi' } }));
    const r = lerRascunho(arm);
    expect(r.paragrafos.conclusao).toBe('');
    expect(r.elementos.agente).toBe(false);
    expect(r.paragrafos.introducao).toBe('oi');
  });
  test('navegador que bloqueia o armazenamento não quebra a tela', () => {
    expect(lerRascunho(quebrado)).toEqual(rascunhoVazio());
    expect(salvarRascunho(rascunhoVazio(), quebrado)).toBe(false);
    expect(() => apagarRascunho(quebrado)).not.toThrow();
    expect(guardarEmSalvas('t', 'x', quebrado)).toBe(false);
  });
  test('Recomeçar apaga o rascunho', () => {
    const arm = memoria();
    salvarRascunho({ ...rascunhoVazio(), tema: 'X' }, arm);
    apagarRascunho(arm);
    expect(arm.m.has(CHAVE_RASCUNHO)).toBe(false);
  });
  test('guardar em Salvas põe a redação no topo da lista que já existe', () => {
    const arm = memoria();
    arm.setItem(CHAVE_SALVAS, JSON.stringify([{ id: 'antiga' }]));
    expect(guardarEmSalvas('Envelhecimento', 'Texto da redação', arm)).toBe(true);
    const lista = JSON.parse(arm.getItem(CHAVE_SALVAS)!);
    expect(lista.map((s: { id: string }) => s.id.startsWith('receita_') ? 'nova' : s.id)).toEqual(['nova', 'antiga']);
    expect(lista[0].texto).toBe('Texto da redação');
  });
});

const LISTA = [
  'O estigma associado às doenças mentais na sociedade brasileira',
  'Perspectivas acerca do envelhecimento na sociedade brasileira',
  'Desafios para a valorização da herança africana no Brasil',
  'Democratização do acesso ao cinema no Brasil',
  'Os desafios da mobilidade urbana',
];
describe('dupla sugerida pela tabela da receita', () => {
  test('tema da lista com dupla na receita vem com os 2 motivos, na ordem', () => {
    expect(duplaSugerida(LISTA[1], LISTA)).toEqual(['estigma', 'estado']);
    expect(duplaSugerida(LISTA[2], LISTA)).toEqual(['historia', 'estigma']);
    expect(duplaSugerida(LISTA[3], LISTA)).toEqual(['acesso', 'mercado']);
    expect(duplaSugerida(LISTA[0], LISTA)).toEqual(['estigma', 'estado']);
  });
  test('reconhece pelo texto, sem diferenciar maiúsculas e espaços (rascunho antigo, sem marcador)', () => {
    expect(duplaSugerida('  o ESTIGMA associado às   doenças mentais na sociedade brasileira ', LISTA)).toEqual(['estigma', 'estado']);
    expect(ehTemaDaLista('o estigma associado às doenças mentais na sociedade brasileira', LISTA)).toBe(true);
  });
  test('tema livre (texto que não está na lista) não tem sugestão, mesmo com a mesma palavra', () => {
    expect(duplaSugerida('Envelhecimento no Brasil', LISTA)).toBeNull();
    expect(ehTemaDaLista('', LISTA)).toBe(false);
  });
  test('tema da lista que não está na tabela não tem sugestão', () => {
    expect(duplaSugerida(LISTA[4], LISTA)).toBeNull();
  });
  test('sem a lista carregada, nada é sugerido', () => {
    expect(duplaSugerida(LISTA[0], [])).toBeNull();
  });
});

describe('autores: cada nome das causas abre obra, ano e ideia', () => {
  test('todo repertório das 5 causas tem ficha completa', () => {
    for (const nome of CAUSAS.flatMap((c) => c.repertorios)) {
      const a = AUTORES[nome];
      expect(a, nome).toBeDefined();
      expect(a.obra.length, nome).toBeGreaterThan(3);
      expect(a.ano, nome).toBeGreaterThan(1900);
      expect(a.ideia.length, nome).toBeLessThanOrEqual(100);
    }
  });
});
describe('tema nos moldes e na tese', () => {
  test('tema da receita: a tese abre com a forma curta (o tema inteiro já veio na ponte)', () => {
    expect(moldeTese('estigma', 'estado', EXEMPLO_TEMA)).toBe(EXEMPLO_TESE);
  });
  test('tema livre: a tese começa com as palavras do tema', () => {
    expect(moldeTese('estigma', 'estado', 'A obesidade infantil no Brasil')).toBe(
      'A obesidade infantil no Brasil decorre, sobretudo, do estigma social, que torna invisível quem sofre com o problema, e da negligência estatal na garantia de direitos já previstos em lei.',
    );
  });
  test('começo que não é problema vira problema; depois de ":" sai', () => {
    expect(problemaDoTema('Desafios para a valorização da herança africana no Brasil')).toBe('a falta de valorização da herança africana no Brasil');
    expect(problemaDoTema('Perspectivas acerca do envelhecimento na sociedade brasileira')).toBe('o desafio do envelhecimento na sociedade brasileira');
    expect(problemaDoTema('A obesidade infantil no Brasil: causas e soluções')).toBe('a obesidade infantil no Brasil');
    expect(problemaDoTema('  ')).toBe('');
  });
  test('[problema] e [problema do tema] trocados, com "de a" virando "da"', () => {
    expect(preencherProblema('Em primeiro lugar, cabe destacar [causa A] como fator central de [problema].', EXEMPLO_TEMA))
      .toBe('Em primeiro lugar, cabe destacar [causa A] como fator central do estigma associado às doenças mentais na sociedade brasileira.');
    expect(preencherProblema('Assim, [causa A] mantém [problema do tema].', 'Desafios para a inclusão de surdos'))
      .toBe('Assim, [causa A] mantém a falta de inclusão de surdos.');
    expect(preencherProblema('central de [problema].', '')).toBe('central de [problema].');
  });
  test('aviso: tese sem nenhuma palavra-chave do tema', () => {
    expect(palavrasChaveDoTema(EXEMPLO_TEMA)).toEqual(['estigma', 'associado', 'doencas', 'mentais']);
    expect(teseTemPalavraDoTema('Isso decorre da omissão do Estado.', EXEMPLO_TEMA)).toBe(false);
    expect(teseTemPalavraDoTema('Quem tem transtorno mental sofre preconceito.', EXEMPLO_TEMA)).toBe(true);
    expect(teseTemPalavraDoTema('', EXEMPLO_TEMA)).toBe(true);
  });
});
describe('exemplo do tema de 2020 (estigma + omissão do Estado)', () => {
  test('usa a dupla da receita para o tema', () => {
    expect(duplaSugerida(EXEMPLO_TEMA, [EXEMPLO_TEMA])).toEqual(EXEMPLO_CAUSAS);
  });
  test('cada parágrafo tem uma frase por função do molde e cabe na meta de linhas', () => {
    for (const p of PARAGRAFOS) {
      expect(EXEMPLO_PARAGRAFOS[p.chave].frases, p.chave).toHaveLength(p.frases.length);
      const linhas = contarLinhas(exemploDoParagrafo(p.chave));
      expect(linhas, p.chave).toBeGreaterThanOrEqual(p.linhasMin);
      expect(linhas, p.chave).toBeLessThanOrEqual(p.linhasMax);
    }
  });
  test('segue o molde: cada frase abre com o começo fixo do molde', () => {
    for (const p of PARAGRAFOS) {
      p.frases.forEach((f, i) => {
        if (p.chave === 'introducao' && i === 2) return expect(EXEMPLO_PARAGRAFOS.introducao.frases[2]).toBe(EXEMPLO_TESE);
        const inicio = f.molde.split(/[\[,]/)[0].trim();
        if (inicio) expect(EXEMPLO_PARAGRAFOS[p.chave].frases[i].startsWith(inicio), `${p.chave} ${i + 1}`).toBe(true);
      });
    }
  });
  test('ponte em 3 passos na introdução e nos desenvolvimentos, com trecho do próprio parágrafo', () => {
    for (const chave of ['introducao', 'desenvolvimento1', 'desenvolvimento2'] as const) {
      const ponte = EXEMPLO_PARAGRAFOS[chave].ponte ?? [];
      expect(ponte.map((p) => p.passo)).toEqual(['Cita', 'Explica', 'Amarra']);
      expect(exemploDoParagrafo(chave).includes(ponte[0].trecho.split(',')[0].split(' (')[0])).toBe(true);
    }
  });
  test('tese e desenvolvimentos têm palavra do tema; a tese é a 3ª frase da introdução', () => {
    expect(teseTemPalavraDoTema(EXEMPLO_TESE, EXEMPLO_TEMA)).toBe(true);
    expect(EXEMPLO_PARAGRAFOS.introducao.frases[2]).toBe(EXEMPLO_TESE);
    expect(teseTemPalavraDoTema(EXEMPLO_PARAGRAFOS.desenvolvimento1.frases[0], EXEMPLO_TEMA)).toBe(true);
    expect(teseTemPalavraDoTema(EXEMPLO_PARAGRAFOS.desenvolvimento2.frases[0], EXEMPLO_TEMA)).toBe(true);
  });
  test('zero emoji no exemplo', () => {
    const tudo = [EXEMPLO_TESE, ...Object.values(EXEMPLO_PARAGRAFOS).flatMap((p) => p.frases)].join(' ');
    expect(/\p{Extended_Pictographic}/u.test(tudo)).toBe(false);
  });
});
