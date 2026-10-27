import { describe, expect, test } from 'vitest';
import { CARACTERES_POR_LINHA, contarLinhas, duplaSugerida, ehTemaDaLista, montarRedacao, moldeTese, situacaoLinhas } from './receita';
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
    expect(moldeTese('estado', 'estigma')).toBe('Tal cenário decorre, sobretudo, da omissão do Estado e do estigma e da invisibilidade.');
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
